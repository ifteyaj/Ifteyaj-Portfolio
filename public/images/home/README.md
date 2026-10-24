# Featured square image

- `featured-cards.webp` — the square block on the home page. A 2000×2000 crop
  of your uploaded artwork (`featured-img.png`), 114 KB.
- `featured-img.png` — the original upload, kept as the editing source.

The home page reads the path from `featuredImage` in `src/data/home.ts`.

To swap it, drop a new square image here (2000×2000 or larger) and point
`featuredImage` at it:

```ts
featuredImage: "/images/home/your-image.webp",
```

Set `featuredImage` to `null` to fall back to the featured project's cover
from `src/data/projects.ts`.

# Closing panorama images

`panorama/` holds 1600×900 WebP crops of the second image from every project in
`closingProjectSlugs`. The carousel repeats them across a dozen 3D strips per
tile, so serving the full-size originals (some are 35 MP) makes it stutter.

To refresh them after changing a project image, run this from the repo root:

```sh
node scripts/make-panorama.cjs
```

The script reads the curated slugs from `src/data/home.ts`, takes each
project's `images[1]` (falling back to `images[0]`), centre-crops to 16:9, and
writes `panorama/<project-slug>.webp`.
