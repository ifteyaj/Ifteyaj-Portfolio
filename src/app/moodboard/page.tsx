import type { Metadata } from "next";
import MoodboardIndex from "@/components/MoodboardIndex";

export const metadata: Metadata = {
  title: "Moodboard — Ifteyaj",
  description:
    "A running visual library of color studies, type sketches and identity fragments.",
};

export default function MoodboardPage() {
  return <MoodboardIndex />;
}