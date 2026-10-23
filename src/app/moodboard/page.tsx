import type { Metadata } from "next";
import MoodboardIndex from "@/components/MoodboardIndex";

export const metadata: Metadata = {
  title: "Moodboard — Visual Inspiration",
  description:
    "A running visual library of color studies, type sketches, and design inspiration by Ifteyaj Ahmed.",
  alternates: {
    canonical: "/moodboard",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MoodboardPage() {
  return <MoodboardIndex />;
}