# Current status

Last updated: 2026-10-30 — full SEO/a11y branch merged into `main`; perf pass: removed `unoptimized` from all `<Image>` tags, extended `content-visibility: auto` to case study blocks; no image files modified.

## Live on production
- URL: https://ifteyaj-portfolio.vercel.app
- Git ref: `4003f01` on `main`
- `fix/performance` was merged into `main` (merge commit `4003f01`); both
  branches now share the same tip. `fix/performance` and `origin/fix/performance`
  are technically redundant and safe to delete.

## Search Console
- Property: URL-prefix `https://ifteyaj-portfolio.vercel.app/` — VERIFIED
  (HTML meta tag method).
- Meta tag: `<meta name="google-site-verification" content="yuVkm9tdUD…LfE" />`,
  shipped in production from `src/app/layout.tsx`.
- Sitemap: submitted (`https://ifteyaj-portfolio.vercel.app/sitemap.xml`).
- Request Indexing budget: 10/day quota exhausted today; resets nightly.
- Domain-property method was attempted but is **permanently impossible** on
  `*.vercel.app` (no DNS delegation). See docs/DECISIONS.md.

## Domain
- Still on `ifteyaj-portfolio.vercel.app`. Search Console history is being
  built up there. Before it accretes value, see docs/DECISIONS.md
  "Playbook — moving to a real custom domain".

## Working state / housekeeping
- Untracked: `perf/` (pre-existing, intentional).
- Port 3000 dev server was running through the merge; may need restart if
  the indexer serves stale bytes.
- Stray temp branch `seo/gsc-verification` was deleted.
- No `.env.local` (example exists; prod values are in Vercel env).