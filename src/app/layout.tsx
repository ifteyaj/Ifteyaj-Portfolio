import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { siteConfig, SITE_URL, DEFAULT_OG_IMAGE } from "@/data/site";
import PageTransition from "@/components/PageTransition";

/* ── Structured Data (JSON-LD) ──────────────────────────────────────────────── */
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const address = {
  "@type": "PostalAddress",
  addressLocality: "Dhaka",
  addressCountry: "BD",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Ifteyaj Ahmed",
      givenName: "Ifteyaj",
      familyName: "Ahmed",
      alternateName: ["Ifteyaj"],
      url: SITE_URL,
      image: `${SITE_URL}/og-image.png`,
      jobTitle: "Brand Identity Designer & AI Web Developer",
      description: siteConfig.description,
      email: siteConfig.email,
      address,
      workLocation: {
        "@type": "Place",
        address,
      },
      sameAs: [...siteConfig.socials.map((s) => s.href), "https://github.com/ifteyaj"],
      knowsAbout: [
        "Brand identity design",
        "Logo design",
        "Web design",
        "Vibe coding",
        "AI-assisted web development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: siteConfig.name,
      url: SITE_URL,
      publisher: { "@id": PERSON_ID },
      author: { "@id": PERSON_ID },
      inLanguage: "en",
    },
  ],
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
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