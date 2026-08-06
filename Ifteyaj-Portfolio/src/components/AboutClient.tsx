"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import LottiePlayer from "@/components/ui/Lottie";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

export default function AboutClient() {
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

    // ── Page intro reveal ──
    gsap.fromTo(
      ".about-hero-name",
      { y: 120 },
      { y: 0, duration: 1.4, ease: "texttshow", delay: 0.1 }
    );
    gsap.fromTo(
      ".about-hero-tagline",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "texttshow", delay: 0.7 }
    );
    gsap.fromTo(
      ".about-scroll-hint",
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "texttshow", delay: 1.0 }
    );
    gsap.fromTo(
      ".about-intro",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.1 }
    );
    gsap.fromTo(
      ".about-bio",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.3 }
    );
    gsap.fromTo(
      ".about-principle",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "texttshow", stagger: 0.1, delay: 1.5 }
    );
    gsap.fromTo(
      ".about-reachout",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.7 }
    );
    gsap.fromTo(
      ".about-list-block",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "texttshow", stagger: 0.1, delay: 1.9 }
    );

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
    <div ref={rootRef} className="about-page">
      <Navbar revealed={revealed} />
      <CustomCursor />

      <main className="about-main">
        <header className="about-hero">
          <p className="about-hero-label">Hello, I&apos;m</p>
          <div className="about-hero-name-wrap">
            <h1 className="about-hero-name">{about.heroName}</h1>
          </div>
          <p className="about-hero-tagline">{about.heroTagline}</p>
          <div className="about-scroll-hint">
            <span className="about-scroll-arrow">[↓]</span>
            <span className="about-scroll-text">Scroll</span>
          </div>
        </header>

        <section className="about-intro">
          <p className="about-intro-text">{about.intro}</p>
        </section>

        <section className="about-bio">
          <h2 className="about-bio-heading">{about.bioHeading}</h2>
          <div className="about-bio-body">
            {about.bio.map((paragraph, i) => (
              <p key={i} className="about-bio-paragraph">{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="about-principles">
          {about.principles.map((principle, i) => (
            <div key={i} className="about-principle">
              <span className="about-principle-num">({String(i + 1).padStart(2, "0")})</span>
              <h3 className="about-principle-heading">{principle.heading}</h3>
              <p className="about-principle-body">{principle.body}</p>
            </div>
          ))}
        </section>

        <section className="about-reachout">
          <p className="about-reachout-text">{about.reachout}</p>
          <a href={`mailto:${siteConfig.email}`} className="about-reachout-mail">
            {siteConfig.email}
          </a>
        </section>

        <section className="about-clients about-list-block">
          <h2 className="about-list-heading">Client Highlights</h2>
          <div className="about-client-list">
            {about.clients.map((client) => (
              <span key={client} className="about-client-item">{client}</span>
            ))}
          </div>
        </section>

        <section className="about-recognition about-list-block">
          <h2 className="about-list-heading">Recognition</h2>
          <div className="about-recognition-list">
            {about.recognition.map((item) => (
              <div key={`${item.year}-${item.title}`} className="about-recognition-item">
                <span className="about-recognition-year">{item.year}</span>
                <span className="about-recognition-title">{item.title}</span>
                <span className="about-recognition-project">{item.project}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="about-footer-block">
          <div className="about-footer-left">
            <LottiePlayer src="/lottie/nav-logo.json" className="about-footer-logo" />
          </div>
          <a href="#" className="about-back-to-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            Back to top [↑]
          </a>
        </footer>

        <div className="about-bottom-nav">
          <div className="about-bottom-col">
            <Link href="/" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">Featured ({String(projects.length).padStart(1, "0")})</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">Featured ({String(projects.length).padStart(1, "0")})</p></div>
            </Link>
            <Link href="/work" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">Index ({String(projects.length).padStart(2, "0")})</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">Index ({String(projects.length).padStart(2, "0")})</p></div>
            </Link>
          </div>
          <div className="about-bottom-col">
            <Link href="/about" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">About</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">About</p></div>
            </Link>
          </div>
          <div className="about-bottom-col">
            {siteConfig.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" className="menu-link">
                <div className="menu-text first-menu-link"><p className="menu-big-text">{s.label}</p></div>
                <div className="menu-text second-menu-link"><p className="menu-big-text">{s.label}</p></div>
              </a>
            ))}
          </div>
          <div className="about-bottom-col">
            <a href={`mailto:${siteConfig.email}`} className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
            </a>
            <a href={`tel:${siteConfig.phone}`} className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
            </a>
          </div>
          <div className="about-bottom-col">
            <span className="about-bottom-brand">Brand Designer</span>
            <span className="about-bottom-brand">Vibe Coder</span>
          </div>
          <div className="about-bottom-col">
            <span className="about-bottom-copy">{siteConfig.copyright}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
