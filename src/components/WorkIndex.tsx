"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SiteFooter from "@/components/SiteFooter";
import { projects } from "@/data/projects";

const DragableCarousel = dynamic(() => import("@/lib/framer/DragableCarousel"), { ssr: false });

const ILLUSTRATIONS: { src: string; alt: string; width: number; height: number }[] = [
  { src: "/images/illustrations/illustration-1.webp", alt: "Illustration 1", width: 900, height: 1018 },
  { src: "/images/illustrations/illustration-2.webp", alt: "Illustration 2", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-3.webp", alt: "Illustration 3", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-4.webp", alt: "Illustration 4", width: 900, height: 1008 },
  { src: "/images/illustrations/illustration-5.webp", alt: "Illustration 5", width: 900, height: 525 },
  { src: "/images/illustrations/illustration-6.webp", alt: "Illustration 6", width: 900, height: 600 },
  { src: "/images/illustrations/illustration-7.webp", alt: "Illustration 7", width: 900, height: 549 },
  { src: "/images/illustrations/illustration-8.webp", alt: "Illustration 8", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-9.webp", alt: "Illustration 9", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-10.webp", alt: "Illustration 10", width: 900, height: 1103 },
  { src: "/images/illustrations/illustration-11.webp", alt: "Illustration 11", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-12.webp", alt: "Illustration 12", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-13.webp", alt: "Illustration 13", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-14.webp", alt: "Illustration 14", width: 900, height: 684 },
  { src: "/images/illustrations/illustration-15.webp", alt: "Illustration 15", width: 900, height: 1125 },
  { src: "/images/illustrations/illustration-16.webp", alt: "Illustration 16", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-17.webp", alt: "Illustration 17", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-18.webp", alt: "Illustration 18", width: 900, height: 678 },
  { src: "/images/illustrations/illustration-19.webp", alt: "Illustration 19", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-20.webp", alt: "Illustration 20", width: 710, height: 410 },
  { src: "/images/illustrations/illustration-21.webp", alt: "Illustration 21", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-22.webp", alt: "Illustration 22", width: 900, height: 900 },
  { src: "/images/illustrations/illustration-23.webp", alt: "Illustration 23", width: 900, height: 832 },
];

const PORTRAIT_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  src: `/images/vexel-art/portrait-${i + 1}.webp`,
  alt: `Portrait ${i + 1}`,
}));

const PORTRAIT_SLIDES = PORTRAIT_IMAGES.map((img) => img.src);

export default function WorkIndex() {
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

    // ── Link hover (dual-text) ──
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
      <CustomCursor />

      <main className="index-main">
        <header className="index-header">
          <div className="index-page-title">
            <span className="index-title-text">All Works</span>
            <span className="index-title-count">({String(projects.length).padStart(2, "0")})</span>
          </div>
        </header>

        <div className="index-entries">
          {projects.map((project) => (
            <Link key={project.slug} href={project.href} className="index-entry">
              <div className="index-entry-info">
                <span className="index-entry-title">{project.title}</span>
                <span className="index-entry-cat">{project.category}</span>
              </div>
              <div className="index-entry-images">
                {project.images?.slice(0, 2).map((img, i) => (
                  <div key={i} className="index-entry-img-wrap">
                    <Image
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
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
          <div className="index-illustrations-grid">
            {ILLUSTRATIONS.map((ill) => (
              <div key={ill.src} className="index-illustrations-item">
                <Image
                  src={ill.src}
                  alt={ill.alt}
                  width={ill.width}
                  height={ill.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 16vw"
                  className="index-illustrations-img"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </div>
        </section>
        </div>

        <section className="index-illustrations index-portraits">
            <h2 className="index-illustrations-title">
              Portrait / Vexel Art
              <span className="index-illustrations-count">({String(PORTRAIT_IMAGES.length).padStart(2, "0")})</span>
            </h2>
          <div className="portraits-carousel-wrapper" style={{ height: '420px' }}>
            <DragableCarousel
              images={PORTRAIT_SLIDES}
              slideWidth={320}
              slideHeight={400}
              gap={20}
              preset="Custom"
              perspective={1000}
              rotateY={45}
              depth={150}
              activeScale={1}
              inactiveScale={0.85}
              inactiveOpacity={0.5}
              borderRadius={12}
              objectFit="cover"
              showArrows={true}
              arrowColor="rgb(51, 51, 51)"
              arrowSize={44}
              showDots={true}
              dotColor="rgb(255, 255, 255)"
              dotSize={8}
              loop={true}
            />
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
