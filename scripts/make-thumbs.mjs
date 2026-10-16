/**
 * Generate lightweight thumbnail copies of project images for grid/index views.
 *
 * Full-resolution originals in public/images/** stay untouched and are served
 * raw (unoptimized) on hero / full-bleed sections. This script writes downscaled
 * copies to public/images/thumbs/** so small grid slots don't download 2500px
 * files. Requires `cwebp` (brew install webp).
 *
 * Usage: node scripts/make-thumbs.mjs
 */
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");

const PER_PROJECT = Number(process.env.THUMB_PER_PROJECT ?? 2);
const WIDTH = Number(process.env.THUMB_WIDTH ?? 900);
const QUALITY = Number(process.env.THUMB_QUALITY ?? 82);

const EXTRA = ["/images/about-hero.webp"];

function collectSources() {
  const src = readFileSync(join(ROOT, "src/data/projects.ts"), "utf8");
  const wanted = new Set();
  for (const arr of src.matchAll(/images:\s*\[([\s\S]*?)\]/g)) {
    const imgs = [...arr[1].matchAll(/"(\/images\/[^"]+)"/g)].map((m) => m[1]);
    imgs.slice(0, PER_PROJECT).forEach((p) => wanted.add(p));
  }
  EXTRA.forEach((p) => wanted.add(p));
  return wanted;
}

function main() {
  const sources = collectSources();
  let made = 0;
  let missing = 0;

  for (const srcPath of sources) {
    const inFile = join(PUBLIC, srcPath);
    const outRel = srcPath.replace(/^\/images\//, "/images/thumbs/");
    const outFile = join(PUBLIC, outRel);

    if (!existsSync(inFile)) {
      console.warn(`  missing source: ${srcPath}`);
      missing++;
      continue;
    }

    mkdirSync(dirname(outFile), { recursive: true });
    execFileSync("cwebp", [
      "-quiet",
      "-resize", String(WIDTH), "0",
      "-q", String(QUALITY),
      inFile,
      "-o", outFile,
    ]);
    made++;
  }

  console.log(`Generated ${made} thumbnail(s) at ${WIDTH}px q${QUALITY} -> public/images/thumbs/`);
  if (missing) console.log(`Skipped ${missing} missing source(s).`);
}

main();
