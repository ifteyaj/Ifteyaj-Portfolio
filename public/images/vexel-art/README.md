# Portrait / Vexel Art — index page carousel

Drop-in folder for the **Portrait / Vexel Art** section on `/work`
(`src/components/WorkIndex.tsx`), rendered by `DragableCarousel`.

## File structure

```
public/images/vexel-art/
├── portrait-1.webp
├── portrait-2.webp
…
└── portrait-6.webp
```

Rule: **`portrait-<n>.webp`, starting at `1`, no gaps.** Currently 6 files.

## Wiring up

`WorkIndex.tsx` builds the list from a count — add or remove files and change
`length` to match, plus the hardcoded `(06)` in the section header:

```ts
const PORTRAIT_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  src: `/images/vexel-art/portrait-${i + 1}.webp`,
  alt: `Portrait ${i + 1}`,
}));
```

A wrong name (`Portrait-7.webp`, `vexel-7.webp`, `portrait_7.webp`) will 404 —
the list is generated, there is no folder scan here.

## Carousel sizing

Slides render at `slideWidth={320}` × `slideHeight={400}` with `objectFit="cover"`,
so **portrait 4:5** art crops cleanest. Export at 2× → **640×800** or larger.

```
cwebp -q 82 -resize 800 0 src.png -o portrait-7.webp
```
