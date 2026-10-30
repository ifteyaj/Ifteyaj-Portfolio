import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import AboutClient from "@/components/AboutClient";
import { aboutCarouselImages } from "@/data/aboutCarousel";
import { DEFAULT_OG_IMAGE, SITE_URL, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "About Ifteyaj Ahmed — Brand Designer & Web Developer, Dhaka" },
  description:
    "Ifteyaj Ahmed is a Dhaka-based brand identity designer and AI web developer. Learn about his design process, services, experience, and tools.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Ifteyaj Ahmed — Brand Designer & Web Developer",
    description:
      "Ifteyaj Ahmed is a Dhaka-based brand identity designer and AI web developer. Learn about his design process, services, experience, and tools.",
    url: `${SITE_URL}/about`,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ifteyaj Ahmed — Brand Designer & Web Developer",
    description:
      "Ifteyaj Ahmed is a Dhaka-based brand identity designer and AI web developer. Learn about his design process, services, experience, and tools.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const CAROUSEL_DIR = path.join(process.cwd(), "public", "images", "about-carousel");
const IMAGE_RE = /\.(avif|gif|jpe?g|png|webp)$/i;

function getFolderImages(): string[] {
  try {
    return fs
      .readdirSync(CAROUSEL_DIR)
      .filter((file) => IMAGE_RE.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/images/about-carousel/${file}`);
  } catch {
    return [];
  }
}

function getCarouselImages(): string[] {
  return [...aboutCarouselImages, ...getFolderImages()];
}

const profileJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/about#profilepage`,
      url: `${SITE_URL}/about`,
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/about#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${SITE_URL}/about`,
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profileJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AboutClient carouselImages={getCarouselImages()} />
    </>
  );
}
