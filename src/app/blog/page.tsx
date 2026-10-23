import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import { DEFAULT_OG_IMAGE, SITE_URL, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog — Design, AI & Branding Insights",
  description:
    "Articles on brand identity design, AI-assisted web development, and the evolving design industry by Ifteyaj Ahmed.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Design, AI & Branding Insights — Ifteyaj Ahmed",
    description:
      "Articles on brand identity design, AI-assisted web development, and the evolving design industry by Ifteyaj Ahmed.",
    url: `${SITE_URL}/blog`,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Design, AI & Branding Insights — Ifteyaj Ahmed",
    description:
      "Articles on brand identity design, AI-assisted web development, and the evolving design industry by Ifteyaj Ahmed.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function BlogPage() {
  return <BlogIndex />;
}