"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import type { Project } from "@/types";

interface WorkDetailProps {
  project: Project;
}

export default function WorkDetail({ project }: WorkDetailProps) {
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
      const first = link.querySelector<HTMLElement>(".first-menu-link");
      const second = link.querySelector<HTMLElement>(".second-menu-link");
      link.addEventListener("mouseenter", () => {
        if (first) gsap.to(first, { y: "-100%", duration: 0.6, ease: "hoverin" });
        if (second) gsap.to(second, { y: "-100%", duration: 0.6, ease: "hoverin" });
      });
      link.addEventListener("mouseleave", () => {
        if (first) gsap.to(first, { y: "0%", duration: 1, ease: "hoverout" });
        if (second) gsap.to(second, { y: "0%", duration: 1, ease: "hoverout" });
      });
    });

    qs<HTMLElement>(".case-gallery-img-wrap, .case-selected-img-wrap").forEach((wrap) => {
      const img = wrap.querySelector<HTMLElement>("img");
      wrap.addEventListener("mouseenter", () => {
        if (img) gsap.to(img, { scale: 1.03, duration: 0.6, ease: "hoverin" });
      });
      wrap.addEventListener("mouseleave", () => {
        if (img) gsap.to(img, { scale: 1, duration: 0.8, ease: "hoverout" });
      });
    });

    gsap.fromTo(".case-title", { y: 120 }, { y: 0, duration: 1.4, ease: "texttshow", delay: 0.1 });
    gsap.fromTo(".case-hero-index", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "texttshow", delay: 0.6 });
    gsap.fromTo(".case-hero-img", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 0.8 });
    gsap.fromTo(".case-gallery-img-wrap", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", stagger: 0.06, delay: 1.2 });
    gsap.fromTo(".case-selected-work", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.4 });
    gsap.fromTo(".case-footer-block", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.6 });

    gsap.to(".first-menu-link", { y: "0%", duration: 1, ease: "texttshow", delay: 0.3 });

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

  const images = project.images ?? [];

  return (
    <div ref={rootRef} className="case-page">
      <Navbar revealed={revealed} />
      <CustomCursor />

      <main className="case-main">
        <header className="case-header">
          <div className="case-title-wrap">
            <h1 className="case-title">{project.title}</h1>
          </div>
          <span className="case-hero-index">({String(project.index).padStart(2, "0")})</span>
        </header>

        <div className="case-hero-img">
          <img src={images[0]} alt={project.title} />
        </div>

        <div className="case-desc-section">
          <div className="case-desc-label">Description</div>
          <div className="case-desc-body">
            <p className="case-desc-text">{project.short}</p>
          </div>
        </div>

        <div className="case-gallery-grid">
          <div className="case-block-asym">
            <div className="case-block-media case-gallery-img-wrap case-block-media-small"><img src={images[1 % images.length]} alt={`${project.title} detail`} loading="lazy" /></div>
            <div className="case-block-media case-gallery-img-wrap case-block-media-landscape"><img src={images[2 % images.length]} alt={`${project.title} detail`} loading="lazy" /></div>
          </div>

          <div className="case-block case-block-full">
            <img src={images[0]} alt={`${project.title} banner`} loading="lazy" />
          </div>

          <div className="case-block-equal">
            <div className="case-block-media case-gallery-img-wrap"><img src={images[1 % images.length]} alt={`${project.title} detail`} loading="lazy" /></div>
            <div className="case-block-media case-gallery-img-wrap"><img src={images[2 % images.length]} alt={`${project.title} detail`} loading="lazy" /></div>
          </div>

          <div className="case-desc-section">
            <div className="case-desc-label">Description</div>
            <div className="case-desc-body">
              <p className="case-desc-text">{project.intro?.[0]?.body ?? project.short}</p>
            </div>
          </div>

          <div className="case-block case-block-feature">
            <img src={images[1 % images.length]} alt={`${project.title} feature`} loading="lazy" />
          </div>

          <div className="case-block-offset">
            <div className="case-block-media case-gallery-img-wrap case-block-media-strip"><img src={images[0]} alt={`${project.title} detail`} loading="lazy" /></div>
            <div className="case-block-media case-gallery-img-wrap case-block-media-portrait"><img src={images[1 % images.length]} alt={`${project.title} detail`} loading="lazy" /></div>
          </div>

          <div className="case-block case-block-wide">
            <img src={images[2 % images.length]} alt={`${project.title} wide`} loading="lazy" />
          </div>
        </div>

        <div className="case-selected-work">
          <span className="case-selected-arrow">[↓]</span>
          <h2 className="case-selected-title">Selected Work</h2>
          <div className="case-selected-grid">
            {projects.filter((p) => p.slug !== project.slug).slice(0, 2).map((p) => (
              <Link key={p.slug} href={p.href} className="case-selected-item">
                <div className="case-selected-img-wrap">
                  <img src={p.images?.[0]} alt={p.title} className="case-selected-img" loading="lazy" />
                </div>
                <span className="case-selected-label">({String(p.index).padStart(2, "0")}) {p.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <footer className="case-footer-block">
          <div className="case-footer-inner">
            <Link href="/" className="case-footer-logo-link" aria-label="Home">
              <img src="/monogram.svg" alt="Ifteyaj" className="case-footer-logo" />
            </Link>
            <a href="#" className="case-back-to-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top [↑]</a>
          </div>
        </footer>

        <div className="case-bottom-nav">
          <div className="case-bottom-col">
            <Link href="/" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">Featured ({String(projects.length).padStart(1, "0")})</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">Featured ({String(projects.length).padStart(1, "0")})</p></div>
            </Link>
            <Link href="/work" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">Index ({String(projects.length).padStart(2, "0")})</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">Index ({String(projects.length).padStart(2, "0")})</p></div>
            </Link>
          </div>
          <div className="case-bottom-col">
            <Link href="/about" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">About</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">About</p></div>
            </Link>
          </div>
          <div className="case-bottom-col">
            {siteConfig.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" className="menu-link">
                <div className="menu-text first-menu-link"><p className="menu-big-text">{s.label}</p></div>
                <div className="menu-text second-menu-link"><p className="menu-big-text">{s.label}</p></div>
              </a>
            ))}
          </div>
          <div className="case-bottom-col">
            <a href={`mailto:${siteConfig.email}`} className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
            </a>
            <a href={`tel:${siteConfig.phone}`} className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
            </a>
          </div>
          <div className="case-bottom-col">
            <span className="case-bottom-brand">Brand Designer</span>
            <span className="case-bottom-brand">Vibe Coder</span>
          </div>
          <div className="case-bottom-col">
            <span className="case-bottom-copy">{siteConfig.copyright}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
