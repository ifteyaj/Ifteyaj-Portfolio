import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactContent from "@/components/ContactContent";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "Contact — Ifteyaj Ahmed" },
  description:
    "Get in touch with Ifteyaj Ahmed to discuss brand identity, logo, and web design work.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Ifteyaj Ahmed",
    description:
      "Get in touch with Ifteyaj Ahmed to discuss brand identity, logo, and web design work.",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Ifteyaj Ahmed",
    description:
      "Get in touch with Ifteyaj Ahmed to discuss brand identity, logo, and web design work.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${SITE_URL}/contact#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contact",
      item: `${SITE_URL}/contact`,
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="contact-page">
        <ContactContent />
      </main>
    </>
  );
}
