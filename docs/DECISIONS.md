# Decisions — Ifteyaj-Portfolio

## 2026-10-30 — Search Console verification needs an HTML meta tag, not DNS

### Context
Search Console rejected domain verification with "Couldn't find your verification
token in your domain's TXT records" for `ifteyaj-portfolio.vercel.app`.
The token itself was valid (`google-site-verification=JorKj5rI…`).

### Finding
`ifteyaj-portfolio.vercel.app` is **not a DNS zone**. It is a record inside the
`vercel.app` zone served by `ns1-4.vercel-dns-3.com`:

    $ dig ifteyaj-portfolio.vercel.app NS +noall +authority
    vercel.app.  IN  SOA  ns1.vercel-dns-3.com. ...   # no delegation

There is no nameserver delegation for the subdomain, so no TXT record can be added
by anyone except Vercel itself. DNS-based (Domain property) verification is
therefore **permanently impossible** for this host. Waiting for propagation or
reattempting TXT creation will never succeed.

### Decision
Verify a **URL-prefix property** via the HTML meta tag method. Implemented in
`src/app/layout.tsx`:

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
              "yuVkm9tdUD8QGlgq_fm4tYW6uiH2Z-SYicrxXJUTLfE",
    },

The token is public by design (it ships in the HTML), so a literal default
keeps verification working on every deploy without extra configuration; the env
var still overrides if re-verification requires a new token. `.env.example`
documents the variable.

### Why not the other options
- DNS / Domain property: impossible — see Finding. Would cover all subdomains
  and protocols in one property, which is the benefit forfeited.
- HTML file upload: works, but requires committing `google*.html` to `public/`.
  Kept the meta tag only; a downloaded `google8cbd…html` exists in
  `~/Downloads` as a documented fallback if ever needed.
- Google Analytics / Tag Manager: not configured; would add an unnecessary
  third-party snippet and hardcode the dependency on those products.

## Playbook — moving to a real custom domain

This is the record to follow whenever a custom domain is purchased. Next.js is
already wired for it: `NEXT_PUBLIC_SITE_URL` drives `metadataBase`, canonicals,
`sitemap.ts`, structured data, and OG URLs in `src/data/site.ts`, and
`next.config.ts` 301-redirects the Vercel host once a different canonical is
configured (only fires if `NEXT_PUBLIC_SITE_URL` names a non-vercel host — see
`CANONICAL_HOST !== VERCEL_HOST`).

### Preconditions
1. Buy the domain. Avoid `vercel.app` and other public-suffix hosts.
2. Vercel → Project → Settings → Domains → add the domain; set
   `www`→apex (or apex→www) redirect as preferred. Vercel will configure
   nameservers (`ns1.vercel-dns.com` …).

### Search Console migration (do in this order)
1. Add a new property in Search Console — **Domain property** now works because
   you own the DNS zone. Domain properties cover `https`, `http`, apex, `www`
   and subdomains in one place.
2. Paste the Domain verification TXT at the apex (`HOST = @`). Because you own
   the zone, the DNS TXT method now succeeds — use it, not the meta tag (unless
   you want to keep one as a fallback).
3. Add the URL-prefix property for the old `*.vercel.app` host only if you
   have not already; it stays verified and keeps history locatable.
4. Set Vercel env `NEXT_PUBLIC_SITE_URL=https://<custom-domain>` (Production).
   Redeploy. At this point the 301 redirect goes live and the vercel host
   starts steering traffic + Google.
5. In Search Console: Settings → Change of address → select the new property.
   This tells Google the migration explicitly and speeds up re-indexing
   (without it, Google follows the 301, but slower).
6. Resubmit `sitemap.xml` under the *new* property.
7. Request indexing for the new homepage (counts against the 10/day limit).
8. Keep the HTML verification meta tag in `layout.tsx` initially (it is
   harmless). Once the new Domain property verifies and is stable, the
   vercel.app URL-prefix property can be left to decay quietly. Do NOT delete it
   during the transition.

### What breaks if done wrong
- Flipping `NEXT_PUBLIC_SITE_URL` *before* putting the domain on Vercel:
  301 redirect live, destination NXDOMAIN, site goes dark + Google de-indexes.
- Using the old HTML token on the new property: verification fails; the new
  property often needs its own token.
- Relying on DNS TXT verification while the domain's nameservers are still
  pointing at the registrar (not Vercel): the TXT at the registrar is correct,
  but if Vercel is the configured host, Vercel is the authority — mismatch.
- Not resubmitting the sitemap under the new property: new content still
  crawls via the 301 chain, but candidate URLs are slow to surface.

### Known quota note
Search Console "Request Indexing" caps at ~10 URLs per day per property. Quota
resets nightly. Sitemap submission and verification itself do not count.
