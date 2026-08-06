"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SiteFooter from "@/components/SiteFooter";
import { projects } from "@/data/projects";

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
      ".index-entry",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "texttshow", stagger: 0.1, delay: 0.3 }
    );
    gsap.fromTo(
      ".case-footer-block",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.0 }
    );
    gsap.fromTo(
      ".case-bottom-nav",
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

        <section className="index-illustrations">
          <h2 className="index-illustrations-title">Illustrations</h2>
          <div className="index-illustrations-grid">
            <div className="index-illustrations-item">
              <img src="/images/illustration-1.png" alt="Illustration 1" className="index-illustrations-img" loading="lazy" />
            </div>
            <div className="index-illustrations-item">
              <img src="/images/illustration-2.png" alt="Illustration 2" className="index-illustrations-img" loading="lazy" />
            </div>
            <div className="index-illustrations-item">
              <img src="/images/illustration-3.png" alt="Illustration 3" className="index-illustrations-img" loading="lazy" />
            </div>
            <div className="index-illustrations-item">
              <img src="/images/illustration-4.png" alt="Illustration 4" className="index-illustrations-img" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="index-illustrations index-portraits">
          <h2 className="index-illustrations-title">Portrait / Vexel Art</h2>
          <div className="index-illustrations-grid">
            <div className="index-illustrations-item">
              <img src="/images/portrait-1.png" alt="Portrait 1" className="index-illustrations-img" loading="lazy" />
            </div>
            <div className="index-illustrations-item">
              <img src="/images/portrait-2.png" alt="Portrait 2" className="index-illustrations-img" loading="lazy" />
            </div>
            <div className="index-illustrations-item">
              <img src="/images/portrait-3.png" alt="Portrait 3" className="index-illustrations-img" loading="lazy" />
            </div>
            <div className="index-illustrations-item">
              <img src="/images/portrait-4.png" alt="Portrait 4" className="index-illustrations-img" loading="lazy" />
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
