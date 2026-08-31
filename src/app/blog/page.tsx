import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";

export const metadata: Metadata = {
  title: "Blog | Ifteyaj",
  description:
    "Notes, essays and visual thinking from Ifteyaj: color studies, type sketches and identity fragments.",
};

export default function BlogPage() {
  return <BlogIndex />;
}