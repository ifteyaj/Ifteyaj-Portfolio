# Foshol Ghor — detail page images

Drop-in folder for the `/work/foshol-ghor` case study. `src/components/WorkDetail.tsx` reads `project.images` positionally (`images[0]` … `images[13]`).

## File structure

Matches `next-door-baby` / `inner-circle`: the cover lives inside the folder as `<slug>.webp`, numbered frames follow.

```
public/images/foshol-ghor/
├── foshol-ghor.webp        ← cover / hero (images[0]), also the work-index card
├── foshol-ghor-01.webp     ← images[1]
├── foshol-ghor-02.webp     ← images[2]
…
└── foshol-ghor-13.webp     ← images[13]
```

Rule: **cover = `images[0]`, then `-01` … `-13` fill `images[1]` … `images[13]` in order.** 14 files, 14 slots.

## Uploading = rendering

This project has `autoImages: true` (`src/data/projects.ts`), so `src/lib/projectImages.ts` reads this folder at render time. Drop a correctly named file in and it appears in its slot on the next request — **no edit to `projects.ts`**.

```
cwebp -q 82 -resize 2400 0 src.webp -o foshol-ghor-04.webp   # → images[4]
```

- Wrong name (`foshol ghor-04.webp`, `Foshol-Ghor-04.webp`, `fg-04.webp`) → **ignored**, slot keeps the cover. Watch the dev-server console for `[projectImages]` warnings.
- Number above `13` → ignored, with a console warning.
- Missing slot → shows the cover until you upload it.
- Works live under `next dev`. After `next build`, the folder is read once at build time, so a production deploy needs a rebuild to pick up new files.

Export at **2× display size**, sRGB, quality ~80, no alpha unless the art needs it. Cap width around 2400px:

```
cwebp -q 82 -resize 2400 0 src.webp -o foshol-ghor-03.webp
```

## Slot map

| File | Index | Layout block in `WorkDetail.tsx` | Recommended crop |
| --- | --- | --- | --- |
| `foshol-ghor.webp` | `images[0]` | `case-hero-img` — full-width hero, also the work-index / "More Works" card cover | Landscape, ~16:9, readable at small card size |
| `foshol-ghor-01.webp` | `images[1]` | `case-block-media-small` — small square, left of the first asymmetric pair | Portrait or near-square |
| `foshol-ghor-02.webp` | `images[2]` | `case-block-media-landscape` — landscape, right of the first asymmetric pair | Wide |
| `foshol-ghor-03.webp` | `images[3]` | `case-block-full` — full bleed | Wide |
| `foshol-ghor-04.webp` | `images[4]` | `case-block-equal-short` — equal pair, left | Square-ish |
| `foshol-ghor-05.webp` | `images[5]` | `case-block-equal-short` — equal pair, right | Square-ish |
| `foshol-ghor-06.webp` | `images[6]` | `case-block-full-tall` — full bleed, tall | Portrait-leaning wide |
| `foshol-ghor-07.webp` | `images[7]` | `case-block-media-small` — small square, **right** of the second asymmetric pair | Near-square |
| `foshol-ghor-08.webp` | `images[8]` | `case-block-media-landscape` — landscape, **left** of the second asymmetric pair | Wide |
| `foshol-ghor-09.webp` | `images[9]` | `case-block-full-tall` — full bleed, tall | Portrait-leaning wide |
| `foshol-ghor-10.webp` | `images[10]` | `case-block-full` — full bleed | Wide |
| `foshol-ghor-11.webp` | `images[11]` | `case-block-equal-short` — equal pair, left | Square-ish |
| `foshol-ghor-12.webp` | `images[12]` | `case-block-equal-short` — equal pair, right | Square-ish |
| `foshol-ghor-13.webp` | `images[13]` | `case-block-full-tall` — closing full bleed | Portrait-leaning wide |

Note the second asymmetric pair is visually swapped: `images[8]` (landscape) renders on the **left**, `images[7]` (small) on the **right**.

Indices above 13 wrap via `images[i % images.length]`, so a shorter set still renders — it just repeats the cover. Ship all 14 to avoid duplicates.

## Placeholders

The cover (`foshol-ghor.webp`) is your real art. Slots `01`–`13` currently hold **generated placeholders** (dark card reading "FOSHL GHOR / 01 / PLACEHOLDER - replace with real art") so every detail-page block renders with its own file. Overwrite each one with real art, keeping the same filename — the crop hint printed on each placeholder matches its slot.

## Wiring up

Nothing to do — `autoImages: true` covers it. `src/lib/projectImages.ts` resolves the folder into the 14-slot array and `src/app/work/[slug]/page.tsx` passes it to `WorkDetail`.

The hardcoded `images` array in `src/data/projects.ts` (`slug: "foshol-ghor"`) is only the fallback for when this folder is missing or holds no matching `.webp`. Keep it pointing at the cover:

```ts
autoImages: true,
images: ["/images/foshol-ghor/foshol-ghor.webp", /* …fallback only… */],
```
