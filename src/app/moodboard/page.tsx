import type { Metadata } from "next";
import MoodboardIndex from "@/components/MoodboardIndex";
import { DEFAULT_OG_IMAGE, SITE_URL, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Moodboard — Visual Inspiration",
  description:
    "A running visual library of color studies, type sketches, and design inspiration by Ifteyaj Ahmed.",
  alternates: {
    canonical: "/moodboard",
  },
  openGraph: {
    title: "Moodboard — Visual Inspiration — Ifteyaj Ahmed",
    description:
      "A running visual library of color studies, type sketches, and design inspiration by Ifteyaj Ahmed.",
    url: `${SITE_URL}/moodboard`,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moodboard — Visual Inspiration — Ifteyaj Ahmed",
    description:
      "A running visual library of color studies, type sketches, and design inspiration by Ifteyaj Ahmed.",
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MoodboardPage() {
  return <MoodboardIndex />;
}