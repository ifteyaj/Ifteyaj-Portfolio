import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactContent from "@/components/ContactContent";
import "@/styles/contact.css";
import { DEFAULT_OG_IMAGE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://ifteyaj-portfolio.vercel.app"),
  // The root layout template appends "— Ifteyaj Ahmed"; the suffix belongs here
  // only as the template, otherwise the rendered title repeats it.
  title: "Contact",
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

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="contact-page">
        <ContactContent />
      </main>
    </>
  );
}
