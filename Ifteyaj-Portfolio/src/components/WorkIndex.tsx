"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import LottiePlayer from "@/components/ui/Lottie";
import CustomCursor from "@/components/CustomCursor";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

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

    // ── Page intro reveal ──
    gsap.fromTo(
      ".index-page-title",
      { y: 120 },
      { y: 0, duration: 1.4, ease: "texttshow", delay: 0.1 }
    );
    gsap.fromTo(
      ".index-arrow",
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "texttshow", delay: 0.6 }
    );
    gsap.fromTo(
      ".index-entry",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "texttshow", stagger: 0.1, delay: 0.3 }
    );
    gsap.fromTo(
      ".index-footer-block",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.0 }
    );
    gsap.fromTo(
      ".index-bottom-nav",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "texttshow", delay: 1.2 }
    );

    // Nav link reveal (first-menu-link starts at translateY(100%) — hidden)
    gsap.to(".first-menu-link", { y: "0%", duration: 1, ease: "texttshow", delay: 0.3 });

    // Nav clock reveal
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
    <div ref={rootRef} className="index-page">
      <Navbar revealed={revealed} />
      <CustomCursor />

      <main className="index-main">
        <header className="index-header">
          <div className="index-page-title">
            <span className="index-title-text">Index</span>
            <span className="index-title-count">({String(projects.length).padStart(2, "0")})</span>
          </div>
          <Link href="/" className="index-arrow">[↓]</Link>
        </header>

        <div className="index-entries">
          {projects.map((project) => (
            <Link key={project.slug} href={project.href} className="index-entry">
              <div className="index-entry-info">
                <span className="index-entry-title">{project.title}</span>
                <span className="index-entry-cat">{project.category}</span>
                <span className="index-entry-sub">{project.secondaryCategory}</span>
                <span className="index-entry-num">({String(project.index).padStart(2, "0")})</span>
              </div>
              <div className="index-entry-images">
                {project.images?.map((img, i) => (
                  <div key={i} className="index-entry-img-wrap">
                    <img src={img} alt={`${project.title} ${i + 1}`} className="index-entry-img" loading="lazy" />
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <footer className="index-footer-block">
          <div className="index-footer-left">
            <LottiePlayer src="/lottie/nav-logo.json" className="index-footer-logo" />
          </div>
          <a href="#" className="index-back-to-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            Back to top [↑]
          </a>
        </footer>

        <div className="index-bottom-nav">
          <div className="index-bottom-col">
            <Link href="/" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">Featured ({String(projects.length).padStart(1, "0")})</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">Featured ({String(projects.length).padStart(1, "0")})</p></div>
            </Link>
            <Link href="/work" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">Index ({String(projects.length).padStart(2, "0")})</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">Index ({String(projects.length).padStart(2, "0")})</p></div>
            </Link>
          </div>
          <div className="index-bottom-col">
            <Link href="/about" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">About</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">About</p></div>
            </Link>
          </div>
          <div className="index-bottom-col">
            {siteConfig.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" className="menu-link">
                <div className="menu-text first-menu-link"><p className="menu-big-text">{s.label}</p></div>
                <div className="menu-text second-menu-link"><p className="menu-big-text">{s.label}</p></div>
              </a>
            ))}
          </div>
          <div className="index-bottom-col">
            <a href={`mailto:${siteConfig.email}`} className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
            </a>
            <a href={`tel:${siteConfig.phone}`} className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
            </a>
          </div>
          <div className="index-bottom-col">
            <span className="index-bottom-brand">Brand Designer</span>
            <span className="index-bottom-brand">Vibe Coder</span>
          </div>
          <div className="index-bottom-col">
            <span className="index-bottom-copy">{siteConfig.copyright}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
