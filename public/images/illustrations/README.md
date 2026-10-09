# Illustrations — index page gallery

Drop-in folder for the **Illustrations** section on `/work` (`src/components/WorkIndex.tsx`).

## File structure

```
public/images/illustrations/
├── illustration-1.webp
├── illustration-2.webp
…
└── illustration-23.webp
```

Rule: **`illustration-<n>.webp`, starting at `1`, no gaps.** Currently 23 files.

## Wiring up

`WorkIndex.tsx` reads the hardcoded `ILLUSTRATIONS` array — each entry is
`{ src, alt, width, height }`. The section header count `(23)` is hardcoded in the
same file, so bump it when you add or remove art.

```ts
{ src: "/images/illustrations/illustration-24.webp", alt: "Illustration 24", width: 900, height: 900 },
```

A wrong name (`Illustration-24.webp`, `ill-24.webp`, `illustration_24.webp`) will
404 — the array is exact, there is no folder scan here.

## Export

Same convention as the project folders: sRGB, quality ~80, no alpha unless the art
needs it. The grid renders these at ~16vw on desktop, so a **1600–1800px** long edge
is plenty; cap at 2400px.

```
cwebp -q 82 -resize 1800 0 src.png -o illustration-24.webp
```

Keep `width` / `height` in the array matching the real file — it drives the
placeholder box before the image loads, so a mismatch causes layout shift.
