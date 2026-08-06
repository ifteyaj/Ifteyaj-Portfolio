# e0d7a3ec-a1d2-4dbe-af9c-904d25ae93b6 implementation handoff

This archive is the source of truth for turning the design into production code. Start from `simonholm-studio.html`, then preserve the visual system, responsive behavior, and interactions found in the exported files.

## Implementation target
- Build production UI from the exported design, not a loose reinterpretation.
- Preserve typography scale, spacing rhythm, color tokens, border radii, shadows, motion timing, and component states.
- Replace static placeholders only when the target app has real data or functional equivalents.
- Keep generated product UI free of Open Design chrome, preview labels, or design-process annotations.
- Treat this handoff as a visual contract: if implementation choices conflict, match the exported pixels and behavior first, then refactor internals.

## Source map
- Primary entry: `simonholm-studio.html`
- HTML screens detected: 1
- Stylesheets detected: 4
- Script/component files detected: 0
- Supporting assets detected: 45

## Responsive contract
Validate the implementation across this 2025–2026 viewport matrix:
- Mobile compact: 360×800
- Mobile standard: 390×844
- Mobile large: 430×932
- Foldable / small tablet: 600×960
- Tablet portrait: 820×1180
- Tablet landscape: 1024×768
- Laptop: 1366×768
- Desktop: 1440×900
- Wide desktop: 1920×1080

For responsive web exports, treat these as a modern breakpoint system for one adaptive web experience, not three fixed screenshots. Do not split responsive web into unrelated native app screens unless the project explicitly includes native targets. Use semantic layout thresholds, fluid `clamp()` type/spacing, and container queries where component width matters more than viewport width. Preserve any CSS media queries, container queries, fluid `clamp()` scales, and layout changes already present in the exported files.

## Design fidelity contract
- Extract reusable tokens before writing components: background, surface, foreground, muted text, border, accent, radius, shadow, spacing, type scale, and motion duration/easing.
- Map product screens, in-app modules/components, optional landing page, and optional OS widget surfaces before coding. Keep these surfaces separate in the target architecture.
- Match layout geometry: max-widths, gutters, grid columns, card proportions, sticky/fixed elements, and viewport-specific navigation.
- Preserve real copy, labels, and data shown in the export. Do not replace specific text with generic marketing filler.
- Preserve interactive affordances: hover, focus, pressed, disabled, loading, validation, copy/share, tab/accordion, modal/sheet, and keyboard states where present.
- Preserve accessibility semantics when converting: headings stay hierarchical, controls remain buttons/links/inputs, focus states stay visible.
- Do not keep prototype-only annotations, frame labels, or Open Design chrome in the production UI.

## CJX-ready UX contract
- Use `DESIGN-MANIFEST.json` as the machine-readable map for screens, app modules, OS widgets, landing pages, tokens, interactions, and viewport checks.
- Screen-file-first: when multiple user-facing surfaces exist, implement each HTML screen as its own route/file. Treat `index.html` as a launcher/overview when the manifest marks it that way, not as a combined final UI.
- If `landing.html`, app screens, platform screens, or OS widget files exist, preserve those boundaries in the target app instead of merging them into one page.
- A single self-contained `simonholm-studio.html` is acceptable only when the export truly contains one user-facing screen and its CSS/JS are structured enough to extract tokens, components, states, and behavior.
- If separate `css/` or `js/` files exist, treat them as source of truth for token/component/interactions before porting to React, Vue, SwiftUI, Compose, or another target stack.
- In-app modules/components are product UI blocks inside the app. OS widgets are home-screen/lock-screen/quick-access surfaces outside the app. Do not merge those concepts.

## Color and brand contract
- Use the exported design tokens and product/domain context as the color source of truth.
- Do not introduce warm beige / cream / peach / pink / orange-brown background washes unless they are already explicit brand/reference colors in the export.
- A stylesheet or design/token file was detected; inspect it for canonical color variables before choosing framework theme tokens.

## Implementation sequence for AI coding tools
1. Open `simonholm-studio.html` and `DESIGN-MANIFEST.json`; identify every screen file, launcher/overview file, app module, and interaction before coding.
2. If multiple HTML screens exist, map them to separate routes/surfaces first; do not merge `landing.html`, product app screens, platform screens, or OS widgets into one route.
3. Extract a token table from CSS/root styles and inline styles before building framework components.
4. Build product screens and domain-specific in-app modules from largest layout regions down to controls; avoid starting with isolated atoms that lose spatial intent.
5. Port responsive behavior across the modern viewport matrix and test each semantic breakpoint before cleanup.
6. Port interactions and states, then replace static placeholders only with real app data or functional equivalents.
7. Keep optional landing page and OS widget surfaces as separate surfaces if present.
8. Compare final screenshots against the export at 360×800, 390×844, 430×932, 820×1180, 1024×768, 1366×768, 1440×900, and 1920×1080 before declaring done.

## Entry points
- `simonholm-studio.html`

## Styles
- `assets/css/cdn.prod.website-files.com/simonholm-portfolio-v2.webflow.shared.08125b3d8-83b0623f93.css`
- `assets/css/unpkg.com/swiper-bundle.min-0a18714d8e.css`
- `assets/css/unpkg.com/swiper-bundle.min-3797bbd255.css`
- `assets/fonts/fonts.css`

## Scripts/components
- None detected

## Assets and supporting files
- `assets/css/fonts.googleapis.com/css-fcdd4e7957.bin`
- `assets/fonts/cdn.prod.website-files.com/66b77166786b3123910cd33e_PPNeueMontrealTT-Regular-0667958c24.woff2`
- `assets/fonts/cdn.prod.website-files.com/66b77166a8c1bb478d55f70a_PPNeueMontrealTT-Medium-0f19e8affb.woff2`
- `assets/fonts/fonts.gstatic.com/EJRQQgYoZZY2vCFuvAFT9gaQZynfoOFC-I0-c4bb8a4f77.woff2`
- `assets/fonts/fonts.gstatic.com/EJRSQgYoZZY2vCFuvAnt66qSVyvVp8NA-4e293c0ca6.woff2`
- `assets/fonts/fonts.gstatic.com/EJRTQgYoZZY2vCFuvAFT_r21cgT9rcs-3f2b7cf88c.woff2`
- `assets/fonts/fonts.gstatic.com/EJRVQgYoZZY2vCFuvAFWzr-_dSb_-19f8c355bf.woff2`
- `assets/images/assets.simonholml.com/WH-Hero.mp4-948b45452d.webp`
- `assets/images/cdn.prod.website-files.com/68a571c2f9d051f5356560c1_BF-Hero-a22b8eceda.webp`
- `assets/images/cdn.prod.website-files.com/68f9e088802b5ec348dac431_b-packagning-mood-4-aa82382502.webp`
- `assets/images/cdn.prod.website-files.com/692b4e4dea92dbe6d39293f2_p-index-1-8d0925ef8e.webp`
- `assets/images/cdn.prod.website-files.com/6949508af718bcfd496bee6d_SH-fav-32x32-4e700a8662.png`
- `assets/images/cdn.prod.website-files.com/69760d69248c608aadbfd085_snuw-hero-2-8615ce32d8.webp`
- `assets/images/www.simonholm.studio/asset-a362ebb5d9.bin`
- `assets/media/assets.simonholml.com/WH-Hero-4a1fbfe374.mp4`
- `NOTES.md`
- `package-lock.json`
- `package.json`
- `RECON/asset-manifest.json`
- `RECON/interactions/original-interactions.json`
- `RECON/interactions/original-interactions.md`
- `RECON/interactions/screenshots/00-initial.png`
- `RECON/interactions/screenshots/01-scroll-middle-b04a45f075.png`
- `RECON/interactions/screenshots/02-scroll-bottom-7297e0cbea.png`
- `RECON/interactions/screenshots/05-hover-Index-05-Index-05-37b4291532.png`
- `RECON/interactions/screenshots/06-hover-About-About-2d5ad8a3bb.png`
- `RECON/interactions/screenshots/07-hover-hello-simonholm.studio-bd692821ea.png`
- `RECON/interactions/screenshots/08-hover--45-2632-0731-e4296fd650.png`
- `RECON/interactions/screenshots/09-hover-Birdie-7960567bc8.png`
- `RECON/interactions/screenshots/13-click-Index-05-Index-05-30fb135cbc.png`
- `RECON/interactions/screenshots/14-click-About-About-a631749cbc.png`
- `RECON/interactions/screenshots/15-click-hello-simonholm.studio-163caa1e64.png`
- `RECON/interactions/screenshots/16-click--45-2632-0731-68b81cdae1.png`
- `RECON/interactions/screenshots/17-click-Birdie-2cc172c18a.png`
- `RECON/network/fixtures/6649cbdf19aa7125580e2ccb-676fcf55d3480b19b59b09d3_logo-new-14.json-dc345221d5.json`
- `RECON/network/fixtures/6649cbdf19aa7125580e2ccb-67701fba2c2b1563bdf59578_btn-open-3.json-086630b521.json`
- `RECON/network/fixtures/6649cbdf19aa7125580e2ccb-677022b2174fc6d87af967b6_btn-close-2.json-75b9d3f492.json`
- `RECON/network/fixtures/6649cbdf19aa7125580e2ccb-6884dd709297eaa43988c9c8_Nav-logo-new-2.json-613acfc94f.json`
- `RECON/network/original-network.json`
- `RECON/original-recon.json`
- `RECON/original-summary.md`
- `RECON/screenshots/original-1440.png`
- `RECON/screenshots/original-390.png`
- `RECON/screenshots/original-768.png`
- `RECON/sourcemaps/sourcemap-manifest.json`

## Coding checklist for AI tools
1. Inspect `simonholm-studio.html` and `DESIGN-MANIFEST.json` first and identify reusable components before coding.
2. Implement each user-facing screen file as its own route/surface; keep launcher, landing, app, platform, and OS widget files separate.
3. Extract design tokens into the target stack: colors, type scale, spacing, radius, shadows, and motion.
4. Implement layout with real 2025–2026 responsive breakpoints, fluid type/spacing, and container-query-aware component behavior; test with no horizontal overflow.
5. Preserve interactive controls, hover/focus/pressed states, form behavior, validation, and copy actions where present.
6. Implement domain-specific in-app modules with real states; do not flatten them into generic cards.
7. Keep landing page, product screens, and OS widget/quick-access surfaces separate when present.
8. Confirm the production result visually matches the exported design before refactoring internals.
9. Reject implementation shortcuts that flatten the design into generic cards, generic gradients, placeholder stats, or framework-default typography.
10. If a detail is ambiguous, keep the exported HTML/CSS/JS behavior rather than inventing a new pattern.
