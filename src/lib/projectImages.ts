import fs from "node:fs";
import path from "node:path";
import type { Project } from "@/types";

/** Number of image slots `WorkDetail.tsx` renders: `images[0]` … `images[13]`. */
export const IMAGE_SLOT_COUNT = 14;

/**
 * Resolves a project's image list.
 *
 * If `project.autoImages` is set, reads `public/images/<slug>/` and maps files
 * to slots by filename so a newly dropped file renders without touching code:
 *
 *   next-door-baby.webp     → images[0]   (cover / hero)
 *   next-door-baby-01.webp  → images[1]
 *   next-door-baby-NN.webp  → images[NN]
 *
 * Unmatched files (README, .DS_Store, wrongly named art) are ignored.
 * Slots with no file fall back to the cover, then to `project.images`.
 * Without `autoImages`, the hardcoded `project.images` array is returned.
 */
export function resolveProjectImages(project: Project): string[] {
  const fallback = project.images ?? [];
  if (!project.autoImages) return fallback;

  const dir = path.join(process.cwd(), "public", "images", project.slug);

  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return fallback;
  }

  const coverName = `${project.slug}.webp`;
  const numbered = new RegExp(`^${escapeRegExp(project.slug)}-(\\d+)\\.webp$`);

  const slots = new Map<number, string>();

  for (const entry of entries) {
    if (!entry.endsWith(".webp")) continue;

    let slot: number;
    if (entry === coverName) {
      slot = 0;
    } else {
      const match = entry.match(numbered);
      if (!match) continue;
      slot = Number(match[1]);
    }

    if (!Number.isInteger(slot) || slot < 0 || slot >= IMAGE_SLOT_COUNT) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[projectImages] ${project.slug}: "${entry}" is outside slots 0–${IMAGE_SLOT_COUNT - 1}, ignored`
        );
      }
      continue;
    }

    if (!slots.has(slot)) slots.set(slot, `/images/${project.slug}/${entry}`);
  }

  if (slots.size === 0) return fallback;

  const cover = slots.get(0) ?? fallback[0];

  return Array.from({ length: IMAGE_SLOT_COUNT }, (_, slot) => slots.get(slot) ?? cover);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
