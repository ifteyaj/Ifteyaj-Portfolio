# Home reel

The home page plays `home-reel.mp4` from this folder (paths live in
`homeContent.reel` in `src/data/home.ts`).

| File | What it is |
| --- | --- |
| `home-reel.mp4` | H.264 / MP4. Currently uploaded: 9.6 s, 1920×1080, ~8.5 MB, no audio. |
| `home-reel.webm` | Optional VP9 / WebM, served first when present. Not uploaded yet — add it and set `webm` in `src/data/home.ts` to enable it. |
| `home-reel-poster.jpg` | 1600×900 still shown before playback and for reduced-motion visitors. Generated from the reel; swap it for any frame you prefer. |

The loop is muted, inline, has no controls and starts on the page `load`
event, after the site loader, so it never competes with the first paint.
Reduced-motion visitors and Save-Data / 2G connections get the poster only.

The file is larger than the 1–3 MB target in the brief. Compressing it to
720p or raising the H.264 CRF would get it there without touching any code.

If you rename any file, update the paths in `src/data/home.ts`.
