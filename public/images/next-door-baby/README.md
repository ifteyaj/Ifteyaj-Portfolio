# Next Door Baby — detail page images

Drop-in folder for the `/work/next-door-baby` case study. `src/components/WorkDetail.tsx` reads `project.images` positionally (`images[0]` … `images[13]`).

## File structure

Matches `riverborn` / `tru-express` / `inner-circle`: the cover lives inside the folder as `<slug>.webp`, numbered frames follow.

```
public/images/next-door-baby/
├── next-door-baby.webp        ← cover / hero (images[0]), also the work-index card
├── next-door-baby-01.webp     ← images[1]
├── next-door-baby-02.webp     ← images[2]
…
└── next-door-baby-13.webp     ← images[13]
```

Rule: **cover = `images[0]`, then `-01` … `-13` fill `images[1]` … `images[13]` in order.** 14 files, 14 slots.

## Uploading = rendering

This project has `autoImages: true` (`src/data/projects.ts`), so `src/lib/projectImages.ts` reads this folder at render time. Drop a correctly named file in and it appears in its slot on the next request — **no edit to `projects.ts`**.

```
cwebp -q 82 -resize 2400 0 src.webp -o next-door-baby-04.webp   # → images[4]
```

- Wrong name (`next door baby-04.webp`, `Next-Door-Baby-04.webp`, `nd-04.webp`) → **ignored**, slot keeps the cover. Watch the dev-server console for `[projectImages]` warnings.
- Number above `13` → ignored, with a console warning.
- Missing slot → shows the cover until you upload it.
- Works live under `next dev`. After `next build`, the folder is read once at build time, so a production deploy needs a rebuild to pick up new files.
- Other projects don't have `autoImages` set — they still read their hardcoded `images` array, because their files (`riberborn_3`, `Spendo_2`, `tru-express-2`) don't follow this numbering. Flip the flag on them once their files are renamed to `<slug>-NN.webp`.

Export at **2× display size**, sRGB, quality ~80, no alpha unless the art needs it. Cap width around 2400px:

```
cwebp -q 82 -resize 2400 0 src.webp -o next-door-baby-03.webp
```

## Slot map

| File | Index | Layout block in `WorkDetail.tsx` | Recommended crop |
| --- | --- | --- | --- |
| `next-door-baby.webp` | `images[0]` | `case-hero-img` — full-width hero, also the work-index / "More Works" card cover | Landscape, ~16:9, readable at small card size |
| `next-door-baby-01.webp` | `images[1]` | `case-block-media-small` — small square, left of the first asymmetric pair | Portrait or near-square |
| `next-door-baby-02.webp` | `images[2]` | `case-block-media-landscape` — landscape, right of the first asymmetric pair | Wide |
| `next-door-baby-03.webp` | `images[3]` | `case-block-full` — full bleed | Wide |
| `next-door-baby-04.webp` | `images[4]` | `case-block-equal-short` — equal pair, left | Square-ish |
| `next-door-baby-05.webp` | `images[5]` | `case-block-equal-short` — equal pair, right | Square-ish |
| `next-door-baby-06.webp` | `images[6]` | `case-block-full-tall` — full bleed, tall | Portrait-leaning wide |
| `next-door-baby-07.webp` | `images[7]` | `case-block-media-small` — small square, **right** of the second asymmetric pair | Near-square |
| `next-door-baby-08.webp` | `images[8]` | `case-block-media-landscape` — landscape, **left** of the second asymmetric pair | Wide |
| `next-door-baby-09.webp` | `images[9]` | `case-block-full-tall` — full bleed, tall | Portrait-leaning wide |
| `next-door-baby-10.webp` | `images[10]` | `case-block-full` — full bleed | Wide |
| `next-door-baby-11.webp` | `images[11]` | `case-block-equal-short` — equal pair, left | Square-ish |
| `next-door-baby-12.webp` | `images[12]` | `case-block-equal-short` — equal pair, right | Square-ish |
| `next-door-baby-13.webp` | `images[13]` | `case-block-full-tall` — closing full bleed | Portrait-leaning wide |

Note the second asymmetric pair is visually swapped: `images[8]` (landscape) renders on the **left**, `images[7]` (small) on the **right**.

Indices above 13 wrap via `images[i % images.length]`, so a shorter set still renders — it just repeats the cover. Ship all 14 to avoid duplicates.

## Wiring up

Nothing to do — `autoImages: true` covers it. `src/lib/projectImages.ts` resolves the folder into the 14-slot array and `src/app/work/[slug]/page.tsx` passes it to `WorkDetail`.

The hardcoded `images` array in `src/data/projects.ts` (`slug: "next-door-baby"`) is only the fallback for when this folder is missing or holds no matching `.webp`. Keep it pointing at the cover:

```ts
autoImages: true,
images: ["/images/next-door-baby/next-door-baby.webp", /* …fallback only… */],
```
