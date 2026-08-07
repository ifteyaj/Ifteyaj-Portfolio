"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SiteFooter from "@/components/SiteFooter";
import JustifiedGallery from "@/components/ui/JustifiedGallery";
import { moodboardItems } from "@/data/moodboard";

export default function MoodboardIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerEases();
    const qs = <T extends Element = HTMLElement>(sel: string): T[] =>
      Array.from(root.querySelectorAll<T>(sel));

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    qs<HTMLElement>(".menu-link").forEach((link) => {
      // Skip case-bottom-nav links (they use CSS left-to-right effect)
      if (link.closest(".case-bottom-nav")) return;

      const first = link.querySelector<HTMLElement>(".first-menu-link");
      const second = link.querySelector<HTMLElement>(".second-menu-link");
      link.addEventListener("mouseenter", () => {
        if (first) gsap.to(first, { y: "0%", duration: 0.6, ease: "hoverin" });
        if (second) gsap.to(second, { y: "-100%", duration: 0.6, ease: "hoverin" });
      });
      link.addEventListener("mouseleave", () => {
        if (first) gsap.to(first, { y: "100%", duration: 1, ease: "hoverout" });
        if (second) gsap.to(second, { y: "0%", duration: 1, ease: "hoverout" });
      });
    });

    gsap.fromTo(
      ".moodboard-title",
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.4, ease: "texttshow", delay: 0.1 }
    );
    gsap.fromTo(
      ".moodboard-header-line",
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "texttshow", delay: 0.4 }
    );
    gsap.fromTo(
      ".moodboard-sub",
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: "texttshow", delay: 0.6 }
    );
    gsap.fromTo(
      ".justified-gallery",
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "texttshow", delay: 0.7 }
    );
    gsap.fromTo(
      ".case-footer-block",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.1 }
    );

    gsap.to(".first-menu-link:not(.case-bottom-nav .first-menu-link):not(.about-nav-wrapper .first-menu-link):not(.contact-nav-wrapper .first-menu-link):not(.nav-clock-wrapper .first-menu-link):not(.work-nav-wrapper .first-menu-link)", { y: "0%", duration: 1, ease: "texttshow", delay: 0.3 });

    setTimeout(() => {
      setRevealed(true);
      gsap.to(".nav-clock-dot", { y: "0%", duration: 1, ease: "texttshow" });
      gsap.to(".nav-clock", { y: "0%", duration: 1, ease: "texttshow" });
      gsap.to(".nav-clock-infomation", { y: "0%", duration: 1, ease: "texttshow" });
    }, 600);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="moodboard-page">
      <Navbar revealed={revealed} />
      <CustomCursor />

      <main className="moodboard-main">
        <header className="moodboard-header">
          <h1 className="moodboard-title">Moodboard</h1>
          <div className="moodboard-header-line" />
        </header>

        <div className="mb-index">
          <JustifiedGallery items={moodboardItems} />
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}