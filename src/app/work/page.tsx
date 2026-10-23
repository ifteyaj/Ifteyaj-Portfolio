import type { Metadata } from "next";
import WorkIndex from "@/components/WorkIndex";
import { DEFAULT_OG_IMAGE, SITE_URL, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Brand Identity, Logo & Web Design Projects",
  description:
    "Selected branding, logo design, visual identity, illustration, and web development projects by Ifteyaj Ahmed. Case studies across AI, fintech, agri-tech, fashion, and more.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Brand Identity, Logo & Web Design Projects — Ifteyaj Ahmed",
    description:
      "Selected branding, logo design, visual identity, illustration, and web development projects by Ifteyaj Ahmed.",
    url: `${SITE_URL}/work`,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Identity, Logo & Web Design Projects — Ifteyaj Ahmed",
    description:
      "Selected branding, logo design, visual identity, illustration, and web development projects by Ifteyaj Ahmed.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function WorkPage() {
  return <WorkIndex />;
}
