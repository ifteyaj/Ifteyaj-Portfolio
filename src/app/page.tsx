import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Ifteyaj Ahmed — Brand Designer & Vibe Coder",
  description:
    "Explore Ifteyaj Ahmed's portfolio of brand identities, logos, and AI-assisted websites. Available for freelance projects worldwide.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return (
    <>
      <h1 className="sr-only">
        Ifteyaj Ahmed — Brand Identity Designer, Logo Designer & AI Web Developer
      </h1>
      <HomeClient />
    </>
  );
}