# Moodboard images

Drop-in folder for the `/moodboard` page (`src/components/MoodboardIndex.tsx`).
Data lives in `src/data/moodboard.ts`.

## File structure

```
public/images/moodboard/
├── mb-06.jpeg   ← Spendo · Brand Identity   (736×414)
├── mb-12.jpeg   ← Spendo · Detail           (736×736)
├── mb-18.jpeg   ← Spendo · Type Study       (736×736)
├── mb-24.jpeg   ← Spendo · Identity         (736×1308)
├── mb-25.jpeg … mb-51.jpeg                  (personal set)
```

Rule: **`mb-<NN>.jpeg`** — two digits, `.jpeg`. The number has no structural
meaning; it just has to be unique inside this folder. Keep it sequential-ish so
the folder stays scannable.

Note this folder is **`.jpeg`**, unlike the project/blog folders which are `.webp`.
Keep the extension consistent with the file you actually drop in.

## Layout

The index renders a **Pinterest-style masonry**
(`src/components/MoodboardGrid.tsx`): 7 columns at ≥1440px, 6 at ≥1024, 5 at
≥768, 4 at ≥480, 3 below. Every tile keeps its **natural aspect ratio** (each
`.mb-tile` gets an inline `aspect-ratio` from the entry's `width` / `height`) and
is dropped into whichever column is currently the shortest, so columns stay
balanced. Classes: `.mb-grid` / `.mb-col` / `.mb-tile` / `.mb-tile-img`.

Because the layout reads the real aspect ratio, `width` / `height` must be the
file's true pixel size — wrong numbers distort the tile.

## Wiring up

`moodboard.ts` is hardcoded — no folder scan, so a dropped file will not appear
on its own. Add an entry:

```ts
mb("52", 736, 900),   // → /images/moodboard/mb-52.jpeg
```

`width` / `height` are the file's real pixel dimensions; the masonry uses their
ratio to size the tile.

## Export

Match the existing set: **736px on the long edge**, sRGB, quality ~80.

```
cwebp -q 82 -resize 736 0 src.png -o mb-52.webp
```

If you switch a file to `.webp`, update the extension in `moodboard.ts` too —
the path is exact, a mismatch 404s.

## Where it renders

`src/components/MoodboardIndex.tsx` → `<MoodboardGrid items={moodboardItems} />`
(`src/components/MoodboardGrid.tsx`). Adding an item is two steps:

1. Drop `public/images/moodboard/mb-<NN>.jpeg`.
2. Add the object to `src/data/moodboard.ts` with its true `width` / `height`.

Both steps are required.
