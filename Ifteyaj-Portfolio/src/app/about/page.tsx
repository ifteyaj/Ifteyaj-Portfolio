import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "About — Ifteyaj",
  description:
    "A digital-first brand designer specializing in strategic visual communication and story-driven brand identities.",
};

export default function AboutPage() {
  return <AboutClient />;
}
