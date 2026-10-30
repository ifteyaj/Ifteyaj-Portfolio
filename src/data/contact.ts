import { siteConfig } from "@/data/site";

/**
 * What the contact page renders. Edit here only.
 *
 * LinkedIn URL check: make sure the value in src/data/site.ts
 * (`siteConfig.socials` → "Linkedin") is a real profile URL, not the
 * generic `https://www.linkedin.com/`. If it ever reverts to the generic
 * one, set the real URL there.
 *
 * The page pulls its facts (email, phone, location, socials) straight from
 * `siteConfig`; this file only owns the headline and which socials to show.
 */
export const contactContent = {
  headline: "Let's talk",
  socialLabels: ["Linkedin", "Instagram", "Behance"],
} as const;

/**
 * The only accepted values for the Subject field — shared by the form and the
 * /api/contact route so the server can reject anything else.
 */
export const contactSubjects = [
  "Brand identity",
  "Logo design",
  "Web design",
  "Vibe coding / AI web development",
  "Something else",
] as const;

export const contactSocials = contactContent.socialLabels
  .map((label) => siteConfig.socials.find((s) => s.label.toLowerCase() === label.toLowerCase()))
  .filter((s): s is (typeof siteConfig.socials)[number] => Boolean(s));
