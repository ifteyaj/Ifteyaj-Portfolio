# Blog cover images

Drop-in folder for the blog covers rendered from `src/data/blog.ts`.

## File structure

One cover per post, named after the post's slug:

```
public/images/blogs/
├── designer-new-toolbox.webp    ← slug: designer-new-toolbox
├── vibe-coding-seriously.webp   ← slug: vibe-coding-seriously
├── design-to-dev-handoff.webp   ← slug: design-to-dev-handoff
├── who-owns-an-ai-design.webp   ← slug: who-owns-an-ai-design
└── the-job-didnt-disappear.webp ← slug: the-job-didnt-disappear
```

Rule: **`<slug>.webp`** — the filename must equal the `slug` field of the post in
`src/data/blog.ts`, with `.webp` appended.

## Wiring up

Covers are hardcoded in `src/data/blog.ts` — there is no folder scan for blogs, so
a new file does nothing until it is referenced:

```ts
{
  slug: "my-new-post",
  image: "/images/blogs/my-new-post.webp",
  …
}
```

Wrong name (`My-New-Post.webp`, `my-new-post-2.webp`, `.jpg`) → 404. The path in
`blog.ts` is exact.

## Where it renders

- `src/components/BlogIndex.tsx` — the pin / list card
- `src/components/BlogDetail.tsx:92` — the case hero
- `src/components/BlogDetail.tsx:127` — "More Posts" related cards (first 4 other posts)

## Export

sRGB, quality ~80, no alpha. Cards and hero both crop landscape ~16:9, so a
**1920px wide** export at ~2400px cap is plenty:

```
cwebp -q 82 -resize 2400 0 src.png -o my-new-post.webp
```

Landscape 16:9 reads best at both sizes; a portrait or square source will be
centre-cropped by the card layout.

## Adding a post

1. Drop `public/images/blogs/<slug>.webp`.
2. Add the post object to `src/data/blog.ts` with `image: "/images/blogs/<slug>.webp"`.

Both steps are required — the folder alone will not surface the post.
