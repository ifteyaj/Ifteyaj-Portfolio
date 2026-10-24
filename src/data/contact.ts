import { siteConfig } from "@/data/site";

/**
 * Single source of truth for the contact page. Edit here only.
 *
 * LinkedIn URL check: make sure the value in src/data/site.ts
 * (`siteConfig.socials` → "Linkedin") is a real profile URL, not the
 * generic `https://www.linkedin.com/`. If it ever reverts to the generic
 * one, set the real URL there.
 */
export const contactContent = {
  headline: "Let's talk",
  intro: "Have a project in mind? Get in touch for brand identity, logo, and web design work.",
  infoBlocks: [
    {
      label: "general inquiries",
      values: [
        { text: siteConfig.email, href: `mailto:${siteConfig.email}` },
        { text: siteConfig.phone, href: `tel:+880${siteConfig.phone.replace(/^0/, "")}` },
      ],
    },
    {
      label: "new projects",
      values: [
        { text: "Brand identity, logo design, and AI-assisted web development. Typical reply within 24 hours." },
      ],
    },
    {
      label: "collaborations",
      values: [{ text: "ifteyajahmed6@gmail.com", href: "mailto:ifteyajahmed6@gmail.com" }],
    },
    {
      label: "based in",
      values: [
        { text: siteConfig.location },
        { text: "Working with clients worldwide" },
      ],
    },
  ],
  socialLabels: ["Linkedin", "Instagram", "Behance"],
  image: {
    src: "/images/Contact_page.png",
    alt: "Contact page featured image",
  },
} as const;

export const contactSocials = contactContent.socialLabels
  .map((label) => siteConfig.socials.find((s) => s.label.toLowerCase() === label.toLowerCase()))
  .filter((s): s is (typeof siteConfig.socials)[number] => Boolean(s));
