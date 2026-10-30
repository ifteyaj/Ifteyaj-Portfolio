import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { siteConfig, SITE_URL, DEFAULT_OG_IMAGE } from "@/data/site";
import PageTransition from "@/components/PageTransition";

const fontMain = localFont({
  src: [
    { path: "../../public/fonts/PPNeueMontrealTT-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/PPNeueMontrealTT-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ppnn",
  display: "swap",
  preload: true,
});

const fontSerif = localFont({
  src: [
    { path: "../../public/fonts/PTSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/PTSerif-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/PTSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const fontMono = localFont({
  src: [{ path: "../../public/fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

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
  applicationName: siteConfig.name,
  authors: [{ name: "Ifteyaj Ahmed", url: SITE_URL }],
  creator: "Ifteyaj Ahmed",
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
    <html lang="en" dir="ltr" className={`${fontMain.variable} ${fontSerif.variable} ${fontMono.variable} h-full`}>
      <head>
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