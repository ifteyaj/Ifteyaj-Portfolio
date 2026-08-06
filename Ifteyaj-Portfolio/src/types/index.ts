// ── Type Definitions ──────────────────────────────────────────────────────────

export interface WorkSection {
  heading: string;
  body: string;
}

export interface Project {
  index: number;
  slug: string;
  title: string;
  category: string;
  secondaryCategory?: string;
  year: string;
  image?: string;
  images?: string[];
  video?: string;
  poster?: string;
  href: string;
  // ── Detail page fields ──
  short: string;
  client?: string;
  agency?: string;
  industry?: string;
  role?: string;
  intro?: { heading?: string; body: string }[];
  sections?: WorkSection[];
}

export interface NavLinkItem {
  label: string;
  count?: number;       // Shown as (05) next to label
  href: string;
}

export interface ContactItem {
  label: string;
  href: string;         // mailto: or tel:
}

export interface SocialItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  location: string;
  timezone: string;
  copyright: string;
  email: string;
  phone: string;
  socials: SocialItem[];
}
