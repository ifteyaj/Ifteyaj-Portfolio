# Portrait / Vexel Art — index page grid

Drop-in folder for the **Portrait / Vexel Art** section on `/work`
(`src/components/WorkIndex.tsx`), rendered as a static CSS grid
(`.index-portraits-grid` — 4 columns desktop, 3 tablet, 2 mobile).

## File structure

```
public/images/vexel-art/
├── portrait-1.webp
├── portrait-2.webp
…
└── portrait-7.webp
```

Rule: **`portrait-<n>.webp`, starting at `1`, no gaps.** Currently 7 files.

## Wiring up

`WorkIndex.tsx` holds an explicit `PORTRAIT_DIMS` list (one `{ width, height }`
per file) that is mapped into `PORTRAIT_IMAGES`. Add the file, then append its
real dimensions — the section header count is derived from
`PORTRAIT_IMAGES.length`, so it updates itself:

```ts
const PORTRAIT_DIMS = [
  { width: 800, height: 588 },
  …
  { width: 800, height: 1134 }, // portrait-7
];
```

A wrong name (`Portrait-7.webp`, `vexel-7.webp`, `portrait_7.webp`) will 404 —
the list is exact, there is no folder scan here.

## Sizing

The grid renders each tile at ~25vw on desktop with `objectFit="cover"`, so a
**long edge of ~1600px** is plenty for 2× displays; cap at 2400px. Keep
`width` / `height` matching the real file so the pre-load box reserves space.

```
cwebp -q 82 -resize 800 0 src.png -o portrait-7.webp
```
