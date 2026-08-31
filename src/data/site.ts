import type { SiteConfig, NavLinkItem } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Ifteyaj",
  title: "Ifteyaj - Brand Designer",
  description:
    "A digital-first brand designer specializing in strategic visual communication and story-driven brand identities.",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  copyright: "©2026",
  email: "ifteyaj0@gmail.com",
  phone: "01644279166",
  socials: [
    {
      label: "Linkedin",
      href: "https://www.linkedin.com/",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/_charlieforc/",
    },
  ],
};

export const navLinks: NavLinkItem[] = [
  { label: "Featured", count: 5, href: "/" },
  { label: "All Works", count: 13, href: "/work" },
];

export const navInfoLinks: NavLinkItem[] = [
  { label: "About", href: "/about" },
];
