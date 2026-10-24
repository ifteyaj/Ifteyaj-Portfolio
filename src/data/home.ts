import { projects } from "@/data/projects";
import type { Project } from "@/types";

/**
 * Home page copy and media paths.
 *
 * Everything the redesigned home page renders comes from this file: the intro
 * paragraph, the headline lines and the reel paths. Edit here — no component
 * changes.
 */

export const homeContent = {
  intro:
    "I design brand identities, user interfaces, social visuals, and build custom websites. Blending creative thinking with engineering. Based in Dhaka, working with founders and teams worldwide.",

  headline: ["Design, Code & AI"] as string[],

  /** Featured project for the square block — must match a slug in projects.ts. */
  featuredSlug: "riverborn",

  /** Below the fold: a curated list of project slugs (must exist in projects.ts). */
  featuredWorkSlugs: ["riverborn", "tru-express", "spendo", "inner-circle"],
  featuredWorkHeading: "Featured Work",

  /**
   * Closing panorama below the contact email. Cards cycle through the second
   * image of every project; reorder `closingProjectSlugs` to curate it.
   */
  closingProjectSlugs: [
    "riverborn",
    "tru-express",
    "spendo",
    "inner-circle",
    "next-door-baby",
    "dripcheck",
    "foshol-ghor",
    "settle-desk",
  ] as string[],

  /**
   * Square image for the right-hand block. This is a 2000×2000 crop of the
   * uploaded artwork; set it to null to fall back to the featured project's
   * own cover from projects.ts.
   */
  featuredImage: "/images/home/featured-cards.webp" as string | null,

  /** Drop the reel in public/videos/ with these names. */
  reel: {
    mp4: "/videos/home-reel.mp4",
    /** Optional VP9/WebM source served first; leave null if you only have MP4. */
    webm: null as string | null,
    poster: "/videos/home-reel-poster.jpg",
  },
};

/** Falls back to the first project if `featuredSlug` is ever renamed. */
export const featuredProject: Project =
  projects.find((project) => project.slug === homeContent.featuredSlug) ?? projects[0];

/**
 * Panorama cards cycle through the second image of every project. The copies
 * in public/images/home/panorama are 1600×900 crops (see the README there):
 * decoding the multi-megapixel originals inside dozens of 3D strips was what
 * made the band stutter.
 */
export const closingImages: string[] = homeContent.closingProjectSlugs.map(
  (slug) => `/images/home/panorama/${slug}.webp`
);
