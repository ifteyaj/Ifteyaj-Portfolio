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
  /**
   * When true, `images` is resolved at render time by reading
   * `public/images/<slug>/` instead of the hardcoded `images` array.
   * Files map to slots by name: `<slug>.webp` → slot 0 (cover/hero),
   * `<slug>-NN.webp` → slot NN. Upload a file, it renders — no code edit.
   * The `images` array stays as the fallback when the folder is empty.
   */
  autoImages?: boolean;
  video?: string;
  poster?: string;
  href: string;
  // ── Detail page fields ──
  short: string;
  client?: string;
  agency?: string;
  industry?: string;
  collab?: string;
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

export interface MoodboardPin {
  slug: string;
  title: string;
  tag: string;
  image: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  tag: string;
  image: string;
  description: string;
  /** Optional long-form paragraphs rendered on the detail page. */
  body?: string[];
}

export interface MoodboardItem {
  title: string;
  tag: string;
  image: string;
  width: number;
  height: number;
}
