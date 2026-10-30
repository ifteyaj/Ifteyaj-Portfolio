import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";

/**
 * Fixed content date for pages without a per-page publish/update field.
 * Change this when the static pages are edited so the sitemap stays honest
 * without changing on every build.
 */
const SITE_LAST_MODIFIED = new Date("2026-10-30");

export default function sitemap(): MetadataRoute.Sitemap {
  // Core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/moodboard`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Project case study pages
  const projectPages: MetadataRoute.Sitemap = projects
    .filter((p) => p.short !== "Coming Soon") // Exclude placeholder projects
    .map((p) => ({
      url: `${SITE_URL}${p.href}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // Blog post pages use the real publication date.
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
