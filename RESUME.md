# RESUME — pick up here after restarting opencode

> Shortcut: tell the new session "read RESUME.md and continue". This file is the source of truth for where we left off.

## Project
- Goal: high-fidelity clone of https://www.simonholm.studio/ (portfolio site).
- App: `/Users/ifteyajahmed/Desktop/Website-Clone/Ifteyaj-Portfolio` — Next.js 16 (Turbopack), React 19, Tailwind v4, gsap 3.15, lottie-web, lenis.
- Static reference: `/Users/ifteyajahmed/Desktop/Website-Clone/simonholm-studio.html`; screenshots in `/Users/ifteyajahmed/Desktop/Website-Clone/RECON/screenshots/original-1440.png` (1440x900).
- Run: `cd Ifteyaj-Portfolio && npm run dev` (NOT repo root — root package.json has no dev script). URL http://localhost:3000. Dev server was running at last session.
- Verify: `npm run lint` (clean), `npx tsc --noEmit` (clean), headless Chrome probes.

## Current state (all verified at 1440x900 + 390x844, 0 console errors)
- Homepage built: Navbar (Lottie logo, LiveClock), Loader (0→100), Hero (full-screen slider + number nav + prev/next + footer), CustomCursor, Lenis smooth scroll, GSAP intro, wheel/key/btn slide nav, video autoplay, fullscreen toggle.
- Image/background transition is horizontal right-to-left; BOTH slides stay `.active` during transition (prev z-index 4 underneath, next 5) so no blank/black gap; prev removed ~1250ms later.
- **Title transition = vertical carousel** (last change): current name slides UP and vanishes through the top of the title line (`bottom: 0 → 100%`), next name rises in from the bottom (`-100% → 0`). Implemented in `HomeClient.tsx` `goToSlide`. Verified mid/settled: old title hidden, new title "Snuw" + number "(02)".
- **Bottom filmstrip REMOVED** per user request (markup in `Hero.tsx`, styles in `globals.css`, JS refs in `HomeClient.tsx` all deleted; `.text-link`/`.number-link-small`/`.small-slider-*` gone).
- **Number nav scroll fixed**: removed `transition: transform …` from `.numbers_list` in `globals.css` (was fighting GSAP `y` tween, kept computed transform at 0 so `(01)` never changed).

## Opencode provider (user's other ask, done)
- AIML API configured as provider `aimlapi` in `~/.config/opencode/opencode.jsonc` (`npm: @ai-sdk/openai-compatible`, baseURL `https://api.aimlapi.com/v1`, model `openai/gpt-5-5` exposed as `aimlapi/openai/gpt-5-5`).
- Keys NO LONGER in the config — moved to `~/.zshrc` as `AIML_API_KEY` and `OPENROUTER_API_KEY`; config uses `{env:...}` interpolation. openrouter also switched to `{env:OPENROUTER_API_KEY}`.
- Verified: `opencode models` lists `aimlapi/openai/gpt-5-5`. User must restart opencode + new shell to load.
- **BLOCKER:** AIML account has $0 balance → API returns `403 OutOfFunds` until topped up at https://aimlapi.com/app/billing.

## Open / next items
- Routes `/work`, `/about`, `/work/*` NOT implemented (nav links 404). Next big chunk if user wants.
- Fullscreen toggle approximates the original via browser Fullscreen API.
- Mobile filmstrip removal already done; responsive check at 390/820 was clean after strip removal.
- NOTES.md (Website-Clone root) still lists the strip as present / is stale — update if we touch it again.

## Diagnostic tooling (temp dir)
- Scripts live in `/var/folders/z1/s7hsfjcn0g7f29s7dkhyj_pc0000gn/T/opencode/pw/`: `shot.js`, `probe3.js`, `func.js`, `hslide.js`, `layer.js`, `textmap.js`, `footer.js`, `dup.js`, `clip.js`, `px.js`, `ocr.swift` (Vision OCR: `swift ocr.swift <img.png>` → stdout), `aimlapi.mjs` (AIML API test call).
- Headless Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` + playwright-core.

## Last user request in progress
"after restart, figure out where we were so we can continue" → this file is the answer. Next real task is TBD by the user (likely /work + /about routes, or pixel-diff remaining sections against RECON).
