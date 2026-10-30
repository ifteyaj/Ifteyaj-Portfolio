"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import { setupMenuLinkHovers } from "@/lib/menuHover";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
const IllustrationMarquee = dynamic(() => import("@/components/IllustrationMarquee").then((m) => m.default));
import { projects } from "@/data/projects";
import { thumb } from "@/lib/thumbs";

const ILLUSTRATIONS: { src: string; alt: string; width: number; height: number }[] = [
  { src: "/images/illustrations/illustration-1.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 1018 },
  { src: "/images/illustrations/illustration-2.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-3.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-4.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 1008 },
  { src: "/images/illustrations/illustration-5.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 525 },
  { src: "/images/illustrations/illustration-6.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 600 },
  { src: "/images/illustrations/illustration-7.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 549 },
  { src: "/images/illustrations/illustration-8.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-9.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-10.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 1103 },
  { src: "/images/illustrations/illustration-11.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-12.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-13.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-14.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 684 },
  { src: "/images/illustrations/illustration-15.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 1125 },
  { src: "/images/illustrations/illustration-16.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-17.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-18.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 678 },
  { src: "/images/illustrations/illustration-19.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-20.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 710, height: 410 },
  { src: "/images/illustrations/illustration-21.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-22.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-23.webp", alt: "Digital illustration by Ifteyaj Ahmed", width: 900, height: 832 },
];

const PORTRAIT_DIMS = [
  { width: 800, height: 588 },
  { width: 800, height: 996 },
  { width: 800, height: 1105 },
  { width: 800, height: 780 },
  { width: 800, height: 1151 },
  { width: 800, height: 936 },
  { width: 800, height: 1134 },
];

const PORTRAIT_IMAGES = PORTRAIT_DIMS.map((dims, i) => ({
  src: `/images/vexel-art/portrait-${i + 1}.webp`,
  alt: `Portrait ${i + 1}`,
  ...dims,
}));

const CardDeck = dynamic(() => import("@/lib/framer/CardDeck"), { ssr: false });

// Design footprint of the deck (7 cards, spacing 110, card 240 wide):
//   width  = (7 - 1) * 110 + 240 = 900
//   height = card height (340) + outer arc (3² * 12 = 108) + breathing room
const DECK_DESIGN_WIDTH = 900;
const DECK_DESIGN_HEIGHT = 620;

export default function WorkIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [deckScale, setDeckScale] = useState(1);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (!w) return;
      const next = Math.min(1, w / DECK_DESIGN_WIDTH);
      setDeckScale((prev) => (Math.abs(next - prev) < 0.001 ? prev : next));
    };
    measure();
    if (typeof window !== "undefined" && typeof window.ResizeObserver !== "undefined") {
      const ro = new window.ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerEases();
    const qs = <T extends Element = HTMLElement>(sel: string): T[] =>
      Array.from(root.querySelectorAll<T>(sel));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ lerp: prefersReducedMotion ? 1 : 0.1, smoothWheel: !prefersReducedMotion });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // ── Link hover (dual-text) ──
    setupMenuLinkHovers(root);

    // ── Page intro reveal ──
    gsap.fromTo(".index-title-text", { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, ease: "texttshow", delay: 0.1 });
    gsap.fromTo(".index-title-count", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "texttshow", delay: 0.4 });
    gsap.fromTo(".index-entry", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", stagger: 0.05, delay: 0.5 });
    gsap.fromTo(".index-illustrations:not(.index-portraits)", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 0.9 });
    gsap.fromTo(".index-portraits", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.05 });
    gsap.fromTo(".case-footer-block", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.2 });

    // ── Row hover: images scale up slightly ──
    qs<HTMLElement>(".index-entry").forEach((row) => {
      const imgs = Array.from(row.querySelectorAll<HTMLElement>(".index-entry-img"));
      row.addEventListener("mouseenter", () => {
        gsap.to(imgs, { scale: 1.03, duration: 0.6, ease: "hoverin", stagger: 0.05 });
      });
      row.addEventListener("mouseleave", () => {
        gsap.to(imgs, { scale: 1, duration: 0.8, ease: "hoverout", stagger: 0.03 });
      });
    });

    // Nav link reveal (first-menu-link starts at translateY(100%) — hidden)
    gsap.to(".first-menu-link:not(.case-bottom-nav .first-menu-link):not(.about-nav-wrapper .first-menu-link):not(.contact-nav-wrapper .first-menu-link):not(.nav-clock-wrapper .first-menu-link):not(.work-nav-wrapper .first-menu-link)", { y: "0%", duration: 1, ease: "texttshow", delay: 0.3 });

    // Nav clock reveal
    setTimeout(() => {
      setRevealed(true);
    }, 600);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="index-page">
      <Navbar revealed={revealed} />

      <main className="index-main">
        <header className="index-header">
          <h1 className="index-page-title">
            <span className="index-title-text">All Works</span>
            <span className="index-title-count">({String(projects.length).padStart(2, "0")})</span>
          </h1>
        </header>

        <div className="index-entries">
          {projects.map((project) => (
            <Link key={project.slug} href={project.href} className="index-entry">
              <div className="index-entry-info">
                <span className="index-entry-title">{project.title}</span>
                <span className="index-entry-cats">
                  {[project.category, ...(project.categories ?? [])]
                    .filter((cat, i, all) => cat && all.indexOf(cat) === i)
                    .map((cat) => (
                      <span key={cat} className="index-entry-cat">{cat}</span>
                    ))}
                </span>
              </div>
              <div className="index-entry-images">
                {project.images?.slice(0, 2).map((img, i) => (
                  <div key={i} className="index-entry-img-wrap">
                    <Image
                      src={thumb(img)}
                      alt={`${project.title} ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                      loading="lazy"
                      decoding="async"
                      className="index-entry-img"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="index-illustrations-cols">
          <section className="index-illustrations">
            <h2 className="index-illustrations-title">
              Illustrations
              <span className="index-illustrations-count">({String(ILLUSTRATIONS.length).padStart(2, "0")})</span>
            </h2>
            <IllustrationMarquee images={ILLUSTRATIONS} />
        </section>
        </div>

        <section className="index-illustrations index-portraits">
            <h2 className="index-illustrations-title">
              Portrait / Vexel Art
              <span className="index-illustrations-count">({String(PORTRAIT_IMAGES.length).padStart(2, "0")})</span>
            </h2>
          <div
            ref={deckRef}
            className="index-portraits-deck"
            style={{ height: `${DECK_DESIGN_HEIGHT * deckScale}px` }}
          >
            <div
              className="index-portraits-deck-inner"
              style={{ transform: `scale(${deckScale})` }}
            >
              <CardDeck
                images={PORTRAIT_IMAGES.map(({ src, alt }) => ({ src, alt }))}
                fanSettings={{ spacing: 110, rotationIntensity: 12, arcIntensity: 12, scaleDecay: 0.06 }}
                hoverBoost={1.15}
                hoverLift={60}
                pushForce={130}
                cardWidth={240}
                cardHeight={340}
                borderRadius={20}
                shadow={0.25}
                transitionStyle="smooth"
              />
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
