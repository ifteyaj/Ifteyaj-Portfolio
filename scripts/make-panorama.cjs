/**
 * Rebuild the closing panorama's image set.
 *
 *   node scripts/make-panorama.cjs
 *
 * Reads the curated slugs from src/data/home.ts and each project's second
 * image from src/data/projects.ts, then writes a 1600×900 centre crop to
 * public/images/home/panorama/<slug>.webp. The carousel repeats these across
 * dozens of 3D facets, so it must not decode the multi-megapixel originals.
 */
const fs = require("fs");
const path = require("path");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error(
    "sharp is required. It ships with Next.js; run `npm install` first."
  );
  process.exit(1);
}

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const home = read("src/data/home.ts");
const projects = read("src/data/projects.ts");

const block = home.match(/closingProjectSlugs:\s*\[([\s\S]*?)\]/);
if (!block) {
  console.error("Could not find closingProjectSlugs in src/data/home.ts");
  process.exit(1);
}
const slugs = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const outDir = path.join(root, "public/images/home/panorama");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const slug of slugs) {
    const at = projects.indexOf(`slug: "${slug}"`);
    const segment = projects.slice(at, at + 4000);
    const list = segment.match(/images:\s*\[([^\]]*)\]/s);
    const images = list
      ? [...list[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : [];
    const source = images[1] ?? images[0];

    if (!source) {
      console.warn(`skip ${slug}: no image in src/data/projects.ts`);
      continue;
    }

    const to = path.join(outDir, `${slug}.webp`);
    const info = await sharp(path.join(root, "public", source))
      .resize({ width: 1600, height: 900, fit: "cover", position: "centre" })
      .webp({ quality: 80, effort: 5 })
      .toFile(to);

    console.log(
      `${slug}: ${source} -> ${info.width}×${info.height}, ${Math.round(
        info.size / 1024
      )} KB`
    );
  }
})();
