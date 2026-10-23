import type { SiteConfig, NavLinkItem } from "@/types";

const FALLBACK_SITE_URL = "https://ifteyaj-portfolio.vercel.app";

/** Accepts `example.com` or `https://example.com/` and returns an origin without a trailing slash. */
function normalizeSiteUrl(value?: string): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

/**
 * Canonical production origin — used for sitemap, OG URLs, canonical tags and
 * `metadataBase`. Set `NEXT_PUBLIC_SITE_URL` in Vercel (or `.env.local`) to your
 * custom domain; otherwise Vercel's system URL is used, then the fallback.
 */
export const SITE_URL =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.NEXT_PUBLIC_VERCEL_URL) ??
  FALLBACK_SITE_URL;

/** Default 1200×630 social card — replace public/og-image.png with your own art. */
export const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Ifteyaj – Brand Designer & Vibe Coder portfolio",
};

export const siteConfig: SiteConfig = {
  name: "Ifteyaj Ahmed",
  title: "Ifteyaj Ahmed — Brand Designer & Vibe Coder",
  description:
    "Dhaka-based brand designer and vibe coder building sharp identities and fast, expressive websites for founders and small teams.",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  copyright: `©${new Date().getFullYear()}`,
  email: "ifteyaj0@gmail.com",
  phone: "01644279166",
  socials: [
    {
      label: "Linkedin",
      // TODO: Replace with your real LinkedIn profile URL
      href: "https://www.linkedin.com/",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/_charlieforc/",
    },
  ],
};

export const navLinks: NavLinkItem[] = [
  { label: "All Works", count: 13, href: "/work" },
];

export const navInfoLinks: NavLinkItem[] = [
  { label: "About Me", href: "/about" },
];
