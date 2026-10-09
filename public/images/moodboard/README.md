# Moodboard images

Drop-in folder for the `/moodboard` page (`src/components/MoodboardIndex.tsx` →
`JustifiedGallery`). Data lives in `src/data/moodboard.ts`.

## File structure

```
public/images/moodboard/
├── mb-06.jpeg   ← tag: Brand Identity  (736×414)
├── mb-12.jpeg   ← tag: Detail          (736×736)
├── mb-18.jpeg   ← tag: Type Study      (736×736)
└── mb-24.jpeg   ← tag: Identity        (736×1308)
```

Rule: **`mb-<NN>.jpeg`** — two digits, `.jpeg`. The number has no structural
meaning (it is a legacy export index); it just has to be unique inside this
folder.

Note this folder is **`.jpeg`**, unlike the project/blog folders which are `.webp`.
Keep the extension consistent with the file you actually drop in.

## Wiring up

`moodboard.ts` is hardcoded — no folder scan, so a dropped file will not appear
on its own. Each item needs an entry with its **real** dimensions, since
`JustifiedGallery` uses `width` / `height` to compute the justified layout before
the image loads. Wrong numbers → broken layout shift.

```ts
{ title: "Spendo", tag: "Palette", image: "/images/moodboard/mb-30.jpeg", width: 736, height: 490 },
```

Keep `mb-<NN>` sequential-ish so the folder stays scannable.

## Where it renders

`src/components/MoodboardIndex.tsx:101` → `<JustifiedGallery items={moodboardItems} />`.
The same `MoodboardItem[]` powers the layout; items are never cropped, they are
packed into rows of matching height.

## Export

Match your existing set: **736px on the long edge**, sRGB, quality ~80.

```
cwebp -q 82 -resize 736 0 src.png -o mb-30.webp
```

If you switch a file to `.webp`, update the extension in `moodboard.ts` too —
the path is exact, a mismatch 404s.

## Adding an item

1. Drop `public/images/moodboard/mb-<NN>.jpeg`.
2. Add the object to `src/data/moodboard.ts` with the file's true `width` / `height`.

Both steps are required.
