#!/usr/bin/env node
/**
 * Generates social-share images:
 *   public/og-image.png          → default 1200×630 placeholder (only if missing)
 *   public/icon-512.png          → app icon
 *   public/icon-192.png          → app icon
 *   public/apple-touch-icon.png  → 180×180 iOS icon
 *   public/og/<slug>.jpg         → per-project OG cards (cover crop + title)
 *   public/og/blog/<slug>.jpg    → per-post OG cards
 *
 * Run with: npm run og
 * Add `--force` to overwrite the default OG image and icons.
 *
 * Output is always PNG/JPEG (never SVG/WebP) because some social crawlers
 * cannot render WebP.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OG_DIR = path.join(PUBLIC, "og");
const BLOG_OG_DIR = path.join(OG_DIR, "blog");
const FORCE = process.argv.includes("--force");
const W = 1200;
const H = 630;

fs.mkdirSync(OG_DIR, { recursive: true });
fs.mkdirSync(BLOG_OG_DIR, { recursive: true });

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Read `slug`, title, kicker and first image path from a data file with a light regex. */
function readEntries(file, imageKeys = ["images", "image"]) {
  const source = fs.readFileSync(path.join(ROOT, file), "utf8");
  const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)];
  const entries = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i][1];
    const start = slugs[i].index ?? 0;
    const end = slugs[i + 1]?.index ?? source.length;
    const block = source.slice(start, end);

    let image;
    for (const key of imageKeys) {
      const re = new RegExp(`${key}:\\s*(?:\\[\\s*)?"(/images/[^"]+\\.(?:webp|jpe?g|png))"`, "i");
      const match = block.match(re);
      if (match) {
        image = match[1];
        break;
      }
    }

    const title = block.match(/title:\s*"((?:[^"\\]|\\.)*)"/)?.[1]?.replace(/\\"/g, '"');
    const kicker = block.match(/(?:category|tag):\s*"([^"]+)"/)?.[1];

    if (image) entries.push({ slug, image, title, kicker });
  }
  return entries;
}

async function makeDefaultOg() {
  const output = path.join(PUBLIC, "og-image.png");
  if (fs.existsSync(output) && !FORCE) {
    console.log("• public/og-image.png already exists — leaving it alone (use --force to replace)");
    return;
  }

  const mark = await sharp(path.join(PUBLIC, "nav-favicon.svg"), { density: 72 })
    .resize(132, 132, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="10"
            fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="2"/>
      <text x="${W / 2}" y="322" text-anchor="middle"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="82" font-weight="500" letter-spacing="-1" fill="#f4f4f4">Ifteyaj Ahmed</text>
      <text x="${W / 2}" y="386" text-anchor="middle"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="27" font-weight="500" letter-spacing="7" fill="#a3a3a3">BRAND DESIGNER &amp; VIBE CODER</text>
      <line x1="${W / 2 - 46}" y1="430" x2="${W / 2 + 46}" y2="430"
            stroke="#ffffff" stroke-opacity="0.28" stroke-width="2"/>
      <text x="${W / 2}" y="480" text-anchor="middle"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="20" letter-spacing="2" fill="#737373">ifteyaj-portfolio.vercel.app</text>
    </svg>`);

  await sharp({
    create: { width: W, height: H, channels: 3, background: "#0a0a0a" },
  })
    .composite([
      { input: mark, left: Math.round((W - 132) / 2), top: 118 },
      { input: overlay, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log("✓ public/og-image.png (1200×630 placeholder)");
}

async function makeIcons() {
  const markSvg = fs.readFileSync(path.join(PUBLIC, "nav-favicon.svg"));

  /**
   * Browser-tab icons stay transparent, matching the original favicon.ico.
   * The Apple touch icon gets an opaque background because iOS ignores
   * transparency for home-screen icons (and applies its own rounded mask).
   */
  async function writeIcon({ size, output, insetRatio, background }) {
    if (fs.existsSync(output) && !FORCE) {
      console.log(`• ${path.relative(ROOT, output)} already exists — skipping`);
      return;
    }

    const inset = Math.round(size * insetRatio);
    const inner = size - inset * 2;
    const mark = await sharp(markSvg, { density: 72 })
      .resize(inner, inner, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const canvas = background
      ? sharp({
          create: { width: size, height: size, channels: 4, background },
        }).composite([{ input: mark, left: inset, top: inset }])
      : sharp(mark).extend({
          top: inset,
          bottom: inset,
          left: inset,
          right: inset,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        });

    await canvas.png({ compressionLevel: 9 }).toFile(output);
    console.log(`✓ ${path.relative(ROOT, output)}${background ? "" : " (transparent)"}`);
  }

  await writeIcon({
    size: 512,
    output: path.join(PUBLIC, "icon-512.png"),
    insetRatio: 0.08,
    background: null,
  });
  await writeIcon({
    size: 192,
    output: path.join(PUBLIC, "icon-192.png"),
    insetRatio: 0.08,
    background: null,
  });
  await writeIcon({
    size: 180,
    output: path.join(PUBLIC, "apple-touch-icon.png"),
    insetRatio: 0.12,
    background: "#0a0a0a",
  });
}

function wrapTitle(title, maxChars = 36) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length > 2) {
    lines.length = 2;
    lines[1] = `${lines[1].slice(0, maxChars - 1).trimEnd()}…`;
  }
  return lines;
}

function cardOverlay({ title, kicker, domain }) {
  const lines = wrapTitle(title);
  const fontSize = lines.length > 1 ? 50 : title.length > 22 ? 56 : 68;
  const titleY = lines.length > 1 ? 474 : 512;
  const titleSpans = lines
    .map(
      (line, i) =>
        `<tspan x="72" dy="${i === 0 ? 0 : Math.round(fontSize * 1.12)}">${esc(line)}</tspan>`
    )
    .join("");

  return Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stop-color="#0a0a0a" stop-opacity="0"/>
          <stop offset="1" stop-color="#0a0a0a" stop-opacity="0.88"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#shade)"/>
      <text x="72" y="${titleY}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="${fontSize}" font-weight="600" letter-spacing="-1"
            fill="#f7f7f7">${titleSpans}</text>
      <text x="74" y="570" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="21" font-weight="500" letter-spacing="4" fill="#c9c9c9">${esc(
              kicker.toUpperCase()
            )}</text>
      <text x="${W - 72}" y="570" text-anchor="end"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="18" letter-spacing="1.5" fill="#9a9a9a">${esc(domain)}</text>
    </svg>`);
}

async function makeCard({ source, output, title, kicker }) {
  if (!fs.existsSync(source)) {
    console.warn(`  ! missing cover: ${path.relative(ROOT, source)} — skipped`);
    return false;
  }

  const base = await sharp(source)
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.94 })
    .toBuffer();

  await sharp(base)
    .composite([{ input: cardOverlay({ title, kicker, domain: "ifteyaj-portfolio.vercel.app" }) }])
    .jpeg({ quality: 82, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" })
    .toFile(output);

  return true;
}

async function makeProjectCards() {
  const entries = readEntries("src/data/projects.ts");
  if (!entries.length) {
    console.warn("! No project entries found in src/data/projects.ts");
    return;
  }

  for (const { slug, image, title, kicker } of entries) {
    const ok = await makeCard({
      source: path.join(PUBLIC, image.replace(/^\//, "")),
      output: path.join(OG_DIR, `${slug}.jpg`),
      title: title || titleCase(slug),
      kicker: kicker ? `${kicker} · Ifteyaj Ahmed` : "Case study · Ifteyaj Ahmed",
    });
    if (ok) console.log(`✓ public/og/${slug}.jpg`);
  }
}

async function makeBlogCards() {
  const entries = readEntries("src/data/blog.ts", ["image"]);
  for (const { slug, image, title, kicker } of entries) {
    const ok = await makeCard({
      source: path.join(PUBLIC, image.replace(/^\//, "")),
      output: path.join(BLOG_OG_DIR, `${slug}.jpg`),
      title: title || titleCase(slug),
      kicker: kicker ? `${kicker} · Ifteyaj Ahmed` : "Journal · Ifteyaj Ahmed",
    });
    if (ok) console.log(`✓ public/og/blog/${slug}.jpg`);
  }
}

function titleCase(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function report() {
  const targets = [
    "public/og-image.png",
    "public/icon-512.png",
    "public/icon-192.png",
    "public/apple-touch-icon.png",
    ...fs.readdirSync(OG_DIR).filter((f) => f.endsWith(".jpg")).map((f) => `public/og/${f}`),
    ...fs.readdirSync(BLOG_OG_DIR).filter((f) => f.endsWith(".jpg")).map((f) => `public/og/blog/${f}`),
  ];

  console.log("\nSizes:");
  for (const rel of targets) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;
    const { size } = fs.statSync(file);
    const kb = (size / 1024).toFixed(1);
    const warn = size > 1024 * 1024 ? "  ⚠ over 1 MB" : size > 300 * 1024 ? "  ⚠ over 300 KB" : "";
    console.log(`  ${kb.padStart(7)} KB  ${rel}${warn}`);
  }
}

await makeDefaultOg();
await makeIcons();
await makeProjectCards();
await makeBlogCards();
await report();
