# Performance Audit Report — Ifteyaj Portfolio

---

## PHASE 1: PROJECT RECON

### Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.0 (App Router, React 19.2.8) |
| Bundler | Turbopack (Next.js built-in) |
| Styling | Tailwind CSS v4 + 78 KB hand-written vanilla CSS ([globals.css](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/styles/globals.css), 3014 lines) |
| Animation | GSAP 3.15 (w/ CustomEase), Lenis 1.3 (smooth scroll), lottie-web 5.13, framer-motion 13 |
| Hosting | Local / Vercel (implied by Next.js) |

### Dependencies — Flags

| Package | Version | Status | Issue |
|---|---|---|---|
| `framer-motion` | 13.0.0 | ⚠️ **Duplicate** | Only used in 1 unused demo component ([logo-carousel.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/ui/logo-carousel.tsx)). Also, `motion` 13.0.0 is installed — they are **two separate packages** for the same lib. Together ~328 KB in JS bundle. |
| `motion` | 13.0.0 | ⚠️ **Duplicate** | Same library, different package name. The site uses GSAP for all actual animations, not framer-motion/motion. |
| `@types/gsap` | 1.20.2 | ⚠️ **Wrong place** | Listed in `dependencies` instead of `devDependencies`. GSAP v3 ships its own types, making this obsolete. Won't affect bundle but adds install bloat. |
| `lottie-web` | 5.13.0 | ⚠️ **Full bundle** | ~60KB min. Only used for 2 tiny button animations (~5KB JSON each). The full lottie renderer is overkill. |
| `react-use-measure` | 2.1.7 | ⚠️ **Unused in prod** | Only imported in [logo-marquee.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/ui/logo-marquee.tsx), which is never imported by any page. |
| `lucide-react` | 1.30.0 | ⚠️ **Unused in prod** | Only imported in [logo-cloud-2.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/ui/logo-cloud-2.tsx), a demo page not linked from nav. |
| `clsx` + `tailwind-merge` | — | ℹ️ Minor | Only used in utility-demo components. Main site uses plain CSS classes. |

### Unused Components & Demo Pages
These are **playground pages** with no navigation links, but they pull in framer-motion, react-use-measure, and lucide-react into the build:

| File | Issue |
|---|---|
| [logo-carousel.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/ui/logo-carousel.tsx) | Imports `framer-motion`. **Not used by any page.** |
| [logo-cloud-2.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/ui/logo-cloud-2.tsx) | Imports `lucide-react`. Only used by demo `/logo-cloud`. |
| [logo-marquee.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/ui/logo-marquee.tsx) | Imports `react-use-measure` + `framer-motion`. **Not used by any page.** |
| [marquee-logo-scroller.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/ui/marquee-logo-scroller.tsx) | Only used by demo `/logo-marquee`. |
| `/app/logo-cloud/page.tsx` | Demo page, not linked from site nav. |
| `/app/logo-marquee/page.tsx` | Demo page, not linked from site nav. |
| [CustomCursor.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/CustomCursor.tsx) | 203 lines, already disabled (`return null`). Dead code — imported by every page client. |

### Asset Inventory

#### Fonts (self-hosted, woff2 — ✅ Good)
| File | Size | Used |
|---|---|---|
| PPNeueMontrealTT-Regular.woff2 | 29 KB | ✅ body |
| PPNeueMontrealTT-Medium.woff2 | 31 KB | ✅ headings |
| PTSerif-Regular.woff2 | 14 KB | ✅ blog/about |
| PTSerif-Bold.woff2 | 13 KB | ✅ blog/about |
| **Total** | **87 KB** | `font-display: swap` ✅ |

#### Lottie JSON
| File | Size | Used |
|---|---|---|
| btn-open.json | 4.7 KB | ✅ Hero grid toggle |
| btn-close.json | 4.7 KB | ✅ Hero grid close |
| logo-loader.json | 126 KB | ❌ **Not imported anywhere** |
| nav-logo.json | 125 KB | ❌ **Not imported anywhere** |

#### Public GIF
| File | Size | Used |
|---|---|---|
| Load_logo.gif | **2.9 MB** | ❌ **Not imported anywhere** — dead asset |

#### SVGs in `/public`
| File | Size | Notes |
|---|---|---|
| nav-logo-primary.svg | 40 KB | ✅ Navbar logo (above fold, `priority`) |
| monogram.svg | 21 KB | ✅ Footer logo (lazy ✅) |
| nav-favicon.svg | 14 KB | ✅ Mobile menu bottom |
| favicon.png | 432 B | ✅ |
| file.svg, globe.svg, next.svg, vercel.svg, window.svg | tiny | ❌ Next.js boilerplate, unused |

#### Project Images (webp) — Top 10 largest
| File | Size | Page |
|---|---|---|
| riberborn_5.webp | **7.4 MB** | /work/riverborn (below fold) |
| inner-circle-10.webp | **4.5 MB** | /work/inner-circle (below fold) |
| Spendo_10.webp | **3.9 MB** | /work/spendo (below fold) |
| Load_logo.gif | **2.9 MB** | ❌ **Unused** |
| inner-circle-11.webp | 2.7 MB | /work/inner-circle (below fold) |
| inner-circle-01.webp | 2.7 MB | /work/inner-circle |
| riberborn_10.webp | 2.6 MB | /work/riverborn (below fold) |
| foshol-ghor-06.webp | 2.5 MB | /work/foshol-ghor (below fold) |
| tru-express.webp | 2.2 MB | /work/tru-express (hero) |
| foshol-ghor-13.webp | 2.2 MB | /work/foshol-ghor (below fold) |

**Total public/ images: ~74 MB across ~120 files**

> [!IMPORTANT]
> Per your constraint: I will NOT resize, recompress, or modify any of these image files. Fixes are **loading-behavior only**.

---

## PHASE 2: MEASURE (Real Numbers)

### Bundle Sizes (Production Build)

| Chunk | Size (raw) | Contents |
|---|---|---|
| `1od4v5jesrsyu.js` | **328 KB** | `motion` (framer-motion/motion package) |
| `4561u0v7ysn3r.js` | **224 KB** | React DOM |
| `213zvx-x_gk21.js` | **155 KB** | Next.js router/prefetching internals |
| `0cz1d0mv5g_q7.js` | **110 KB** | Polyfills (URL, fetch, etc.) |
| `1-o912xxpjquk.js` | **69 KB** | GSAP core + CustomEase |
| `3eq38x4ybo1au.js` | **54 KB** | Lenis smooth scroll |
| Remaining 14 chunks | ~230 KB | App code, Next.js runtime |
| **Total JS** | **~1,170 KB** | |
| **Total CSS** | **67 KB** | Single Tailwind + globals.css bundle |

### Lighthouse Scores

| Metric | Desktop | Mobile |
|---|---|---|
| **Performance Score** | **76** 🔴 | **90** 🟠 |
| FCP | 0.3 s ✅ | 1.0 s ✅ |
| **LCP** | **5.0 s** 🔴 | **1.2 s** ✅ |
| TBT | 50 ms ✅ | 50 ms ✅ |
| CLS | 0.00 ✅ | 0.001 ✅ |
| **Speed Index** | 1.1 s ✅ | **12.9 s** 🔴 |
| **TTI** | **5.3 s** 🔴 | **7.5 s** 🔴 |
| Total Transfer | **9,213 KB** 🔴 | — |

### LCP Breakdown (Desktop — the worst case)

The LCP element is the **case hero image** (`div.case-page > main.case-main > div.case-hero-img > img`).

| Phase | Time | % of LCP |
|---|---|---|
| TTFB | 128 ms | 3% |
| Load Delay | 395 ms | 8% |
| Load Time | 527 ms | 11% |
| **Render Delay** | **3,926 ms** 🔴 | **79%** |

> [!CAUTION]
> **79% of LCP time is render delay** — the image is loaded but not painted. The root cause: `unoptimized` on all `<Image>` components bypasses Next.js image optimization, and the loader animation delays reveal by 4.3+ seconds on the home page.

### Key Lighthouse Opportunities
| Finding | Estimated Savings |
|---|---|
| Properly size images (`unoptimized` bypasses responsive) | **8,114 KB** |
| Unused JavaScript (motion/framer-motion) | **114 KB** |
| Offscreen images (favicon.ico at 180KB!) | 180 KB |
| Total transfer too large | 9,213 KB |

### Long Tasks
| Task | Duration | Source |
|---|---|---|
| Main-thread JS execution | **153 ms** | `1-o912xxpjquk.js` (GSAP chunk) |

---

## PHASE 3: CHECKLIST

### Images & Media

| Check | Status | Evidence |
|---|---|---|
| Hero/LCP image preloaded and NOT lazy? | ❌ **No preload `<link>`**; `priority` is set on the first slider image in [Hero.tsx:82](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/Hero.tsx#L82) (good) but `unoptimized` nullifies Next.js responsive sizing and AVIF/WebP generation |
| All `<Image>` use `unoptimized`? | 🔴 **Yes — every single one** | [Hero.tsx:83](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/Hero.tsx#L83), [WorkDetail.tsx:134](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/WorkDetail.tsx#L134) + 14 more occurrences. This bypasses Next.js image optimization entirely: no responsive `srcset`, no AVIF conversion, no size-based variants. **8 MB wasted per case page.** |
| Below-fold images `loading="lazy"`? | ❌ **No** | [WorkDetail.tsx:150-222](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/WorkDetail.tsx#L150-L222): all 14 gallery images load eagerly. None have `loading="lazy"`. |
| Images have `width/height` or `aspect-ratio`? | ✅ | All use `fill` (absolute positioning) with parent containers. CLS is 0. |
| Videos autoplaying off-screen? | ⚠️ | [Hero.tsx:66-74](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/Hero.tsx#L66-L74): videos have `autoPlay` but are sync-paused when not active slide via [HomeClient.tsx:196-207](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/HomeClient.tsx#L196-L207). Acceptable. |
| `content-visibility: auto` for offscreen sections? | ❌ **Not used anywhere** | globals.css has 0 instances. Case pages with 14 images would benefit greatly. |
| Large images used as CSS backgrounds? | ✅ No | All images use `<Image>` or `<img>`. |
| `favicon.ico` size? | ⚠️ **180 KB** | [favicon.ico](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/app/favicon.ico) is 184 KB — abnormally large. Lighthouse flags it as offscreen waste. |

### JavaScript

| Check | Status | Evidence |
|---|---|---|
| `unoptimized` bypasses image optimization | 🔴 **Root cause of slow transfer** | All `<Image>` tags across 6 components. Removing `unoptimized` enables Next.js to serve responsive AVIF/WebP variants → ~8 MB savings per case page. |
| Duplicate animation libraries | 🔴 **328 KB wasted** | `framer-motion` (5.6 MB node_modules) + `motion` (772 KB node_modules) installed. Only `framer-motion` is imported — by 1 unused component. The `motion` package is entirely unused. Combined chunk: 328 KB in production JS. |
| Dead component shipped | 🟠 | [CustomCursor.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/CustomCursor.tsx): 203 lines, `return null` at line 178 and 181. Still imported by HomeClient, WorkDetail, AboutClient, MoodboardIndex, BlogIndex, BlogDetail. |
| Unnecessary re-renders | ✅ | State is well-scoped. No inline object/function props causing re-renders. |
| Memory leaks | ✅ | All `useEffect` hooks have cleanup: Lenis destroyed, RAF cancelled, listeners removed. |
| Scroll handlers passive | ✅ | Wheel handler is `{ passive: true }` at [HomeClient.tsx:301](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/HomeClient.tsx#L301). Grid overlay wheel uses `{ passive: false }` (necessary for `preventDefault`). |
| Animations use transform/opacity | ✅ | GSAP animations target `y`, `xPercent`, `opacity`, `scale`, `clipPath`. No layout-triggering properties. |
| `will-change` usage | ✅ | Single use on slider wrap ([globals.css:967](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/styles/globals.css#L967)). Appropriately scoped. |
| Code-split large libraries? | ⚠️ | Lottie-web (full bundle ~60 KB) loaded on first paint for 2 tiny button anims. Could use `lottie-light` or inline the SVGs. |
| `useGsapEases` hook exported but never used | ⚠️ Dead code | [gsap.ts:25-29](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/lib/gsap.ts#L25-L29): unused `useEffect` import + unused hook. |
| Duplicated menu-link hover logic | ⚠️ | Copy-pasted across [HomeClient.tsx:305-320](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/HomeClient.tsx#L305-L320), [WorkDetail.tsx:42-56](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/WorkDetail.tsx#L42-L56), [AboutClient.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/AboutClient.tsx), [MoodboardIndex.tsx](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/MoodboardIndex.tsx). Identical logic in 4+ places. |

### CSS

| Check | Status | Evidence |
|---|---|---|
| Expensive properties (`backdrop-filter`, large `blur`) | ✅ None | Only `filter: saturate()` used, minor impact. |
| Animating layout properties | ✅ No | All GSAP/CSS animations use `transform`/`opacity`. |
| Huge unused CSS | ⚠️ | globals.css is 78 KB / 3014 lines. Contains styles for components that may not exist on every page, but Tailwind v4 handles purging. The vanilla CSS portion may have unused selectors. |
| `content-visibility: auto` for offscreen sections | ❌ Missing | Would help on case study pages with 14+ large images. |

### Fonts

| Check | Status |
|---|---|
| `font-display: swap` | ✅ All 4 `@font-face` declarations |
| Self-hosted woff2 | ✅ |
| Preloaded critical font | ❌ **No `<link rel="preload">` for PPNeueMontrealTT** |
| Number of families/weights | ✅ Reasonable (2 families, 4 files, 87 KB total) |

### Rendering / DOM

| Check | Status |
|---|---|
| DOM size | ✅ Moderate — no huge lists |
| Layout thrashing | ✅ None detected |
| Loader SVG complexity | ⚠️ The loader's inline SVG path ([Loader.tsx:43](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/Loader.tsx#L43)) is ~5,600 characters of path data with `stroke-dasharray` animation on it. This is rendered on every page load. 17.7 KB component. |

### Mobile & QA

| Check | Status |
|---|---|
| Speed Index (mobile) | 🔴 12.9 s — loader animation forces 4.3s delay before any content shows |
| TTI (mobile) | 🔴 7.5 s |
| Console errors | ✅ None observed |
| Source maps in production | ✅ Not shipped |
| Hydration issues | ✅ None |
| Dev-only code | ✅ No StrictMode double-effects, no debug logs |

---

## PHASE 4: REPORT

### Issue Table (Ranked by Impact)

| # | Problem | Evidence | Impact | Fix | Effort | Risk |
|---|---|---|---|---|---|---|
| 1 | **`unoptimized` on ALL `<Image>` tags bypasses Next.js responsive/AVIF optimization** | [Hero.tsx:83](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/Hero.tsx#L83), [WorkDetail.tsx:134+14 more](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/WorkDetail.tsx#L134). Lighthouse: 8,114 KB saveable. Total transfer 9.2 MB. | 🔴 **High** | Remove `unoptimized` from all `<Image>` components. Next.js will serve responsive AVIF/WebP variants at correct sizes via `/_next/image`. The original files stay byte-identical. | Small (find-replace) | Low — image files untouched, Next.js optimizer serves derived variants |
| 2 | **Below-fold case images not lazy-loaded** | [WorkDetail.tsx:150-222](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/WorkDetail.tsx#L150-L222): 13 images below hero all load eagerly | 🔴 **High** | Add `loading="lazy"` + `decoding="async"` to all non-hero `<Image>` tags. Keep `priority` only on the first (hero) image. | Small | None |
| 3 | **`framer-motion` + `motion` packages unused → 328 KB JS** | package.json lines 14,19. Only used in 1 dead demo component. Chunk `1od4v5jesrsyu.js` = 328 KB. | 🔴 **High** | Remove `framer-motion` and `motion` from deps. Delete unused demo components (logo-carousel, logo-cloud-2, logo-marquee, marquee-logo-scroller) and their demo pages. | Medium | None — unused code |
| 4 | **Home loader delays LCP by 4.3 s** | [HomeClient.tsx:378](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/HomeClient.tsx#L378): `delay: 4.3` before loader slides away. Lighthouse LCP Render Delay: 3,926 ms (79%). | 🟠 **Med** | *Propose but ask first*: reduce loader duration from 4.3 s to ~2.5 s. The visual design stays the same, just faster. | Small | Medium — design choice |
| 5 | **Dead `CustomCursor` component imported everywhere** | [CustomCursor.tsx:178-181](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/components/CustomCursor.tsx#L178-L181): `return null`. 203 lines. Imported by 5+ page clients. | 🟠 **Med** | Remove the component file and all imports. | Small | None |
| 6 | **No `content-visibility: auto` on offscreen sections** | Case pages have 14 full-width images — the browser paints all of them on load. | 🟠 **Med** | Add `content-visibility: auto` + `contain-intrinsic-size` to case gallery blocks and footer. | Small | Low |
| 7 | **`lottie-web` full bundle for 2 tiny buttons** | ~60 KB JS for two ~5 KB JSON animations. | 🟡 **Low** | Switch to `lottie-web/build/player/lottie_light.min.js` (SVG-only renderer, ~30 KB) or inline the SVGs. | Small | Low |
| 8 | **Dead assets in `/public`** | `Load_logo.gif` (2.9 MB), `logo-loader.json` (126 KB), `nav-logo.json` (125 KB), Next.js boilerplate SVGs | 🟡 **Low** | Delete unused files. Saves disk/deploy size. | Trivial | None |
| 9 | **`@types/gsap` in `dependencies` instead of `devDependencies`** | [package.json:12](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/package.json#L12). GSAP v3 has built-in types. | 🟡 **Low** | Remove `@types/gsap` entirely. | Trivial | None |
| 10 | **Unused deps: `react-use-measure`, `lucide-react`, `clsx`, `tailwind-merge`** | Only used by demo components being deleted in fix #3. | 🟡 **Low** | Remove from package.json after fix #3. | Trivial | None |
| 11 | **No font preload for critical PPNeueMontrealTT** | No `<link rel="preload">` in layout. | 🟡 **Low** | Add `<link rel="preload" as="font" type="font/woff2" href="/fonts/PPNeueMontrealTT-Medium.woff2" crossorigin>` to root layout. | Trivial | None |
| 12 | **Duplicated menu-link hover logic across 4+ components** | Identical GSAP mouseenter/mouseleave code copy-pasted in HomeClient, WorkDetail, AboutClient, MoodboardIndex. | 🟡 **Low** | Extract to shared utility (`setupMenuLinkHovers(root)`). | Medium | Low |
| 13 | **Dead `useGsapEases` hook + unused `useEffect` import in gsap.ts** | [gsap.ts:8,25-29](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/lib/gsap.ts#L8) | 🟡 **Low** | Remove unused hook and import. | Trivial | None |
| 14 | **`favicon.ico` is 184 KB** | [favicon.ico](file:///Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/src/app/favicon.ico). Lighthouse flags 180 KB offscreen waste. | 🟡 **Low** | *Cannot fix without modifying the file* — flagging for awareness. | — | — |

---

### Root Cause Summary

**The top 3 reasons the site feels slow, in plain English:**

1. **Every `<Image>` has `unoptimized`, which forces the browser to download the original full-size files (some 3-7 MB each) instead of Next.js serving properly-sized AVIF/WebP variants.** On a case study page, the browser downloads ~9 MB of images even though the viewport only needs ~1 MB. This alone accounts for the 9,213 KB total transfer and the poor LCP.

2. **13 below-fold images on case study pages load eagerly** (no `loading="lazy"`) — the browser requests all 14 images immediately, competing for bandwidth with the hero image and delaying its render.

3. **~328 KB of JavaScript (framer-motion + motion packages) is bundled but never used** on any production page. Combined with lottie-web's full bundle, this adds ~390 KB of parse/eval work to first load.

---

### Confirmation

> [!IMPORTANT]
> **NO image file will be altered by any proposed fix.** All image files remain byte-identical. The fixes involve:
> - Removing the `unoptimized` flag so Next.js serves *derived* optimized variants (the originals stay untouched in `/public`)
> - Adding `loading="lazy"` / `decoding="async"` attributes (loading behavior only)
> - Adding `content-visibility: auto` (rendering behavior only)
> - Removing unused JS libraries and dead code

### Estimated Before/After

| Metric | Before | After (estimated) |
|---|---|---|
| **LCP (desktop)** | 5.0 s | ~1.5–2.0 s |
| **LCP (mobile)** | 1.2 s | ~1.0 s |
| **Total JS** | 1,170 KB | ~780 KB (−33%) |
| **Total Transfer (case page)** | ~9,200 KB | ~1,200–1,800 KB (−80%) |
| **Speed Index (mobile)** | 12.9 s | ~4–5 s |
| **Performance Score (desktop)** | 76 | ~92–96 |

---

> **⏸️ STOPPING HERE — awaiting your approval before making any changes.**
>
> Which fixes would you like me to apply? I'll do them one at a time, highest impact first, and re-measure after each.
