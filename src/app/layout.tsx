import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { siteConfig, SITE_URL, DEFAULT_OG_IMAGE } from "@/data/site";
import PageTransition from "@/components/PageTransition";

/* ── Structured Data (JSON-LD) ──────────────────────────────────────────────── */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ifteyaj Ahmed",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  jobTitle: "Brand Identity Designer & AI Web Developer",
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  sameAs: siteConfig.socials.map((s) => s.href),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: SITE_URL,
  description: siteConfig.description,
  author: { "@type": "Person", name: "Ifteyaj Ahmed" },
};

/* ── Viewport ───────────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

/* ── Metadata ───────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.title,
    template: `%s — Ifteyaj Ahmed`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Search Console URL-prefix verification via meta tag. The token is public
  // by design (it ships in the HTML), so a literal default keeps verification
  // working on every deploy without extra configuration.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
      "yuVkm9tdUD8QGlgq_fm4tYW6uiH2Z-SYicrxXJUTLfE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <head>
        <link
          rel="preload"
          href="/fonts/PPNeueMontrealTT-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PPNeueMontrealTT-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      {/* The host shell / browser extensions can add inline styles to <body> before
          React hydrates (e.g. user-select), which is not something we render and
          would otherwise flood the console with a hydration mismatch. */}
      <body className="min-h-full" suppressHydrationWarning>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}