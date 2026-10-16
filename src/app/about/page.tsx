import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import AboutClient from "@/components/AboutClient";
import { aboutCarouselImages } from "@/data/aboutCarousel";

export const metadata: Metadata = {
  title: "About — Ifteyaj",
  description:
    "A digital-first brand designer specializing in strategic visual communication and story-driven brand identities.",
};

const CAROUSEL_DIR = path.join(process.cwd(), "public", "images", "about-carousel");
const IMAGE_RE = /\.(avif|gif|jpe?g|png|webp)$/i;

function getFolderImages(): string[] {
  try {
    return fs
      .readdirSync(CAROUSEL_DIR)
      .filter((file) => IMAGE_RE.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/images/about-carousel/${file}`);
  } catch {
    return [];
  }
}

function getCarouselImages(): string[] {
  return [...aboutCarouselImages, ...getFolderImages()];
}

export default function AboutPage() {
  return <AboutClient carouselImages={getCarouselImages()} />;
}
