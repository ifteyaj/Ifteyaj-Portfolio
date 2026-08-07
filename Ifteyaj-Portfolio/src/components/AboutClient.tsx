"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SiteFooter from "@/components/SiteFooter";
import Testimonials from "@/components/Testimonials";
import { about } from "@/data/about";
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

    // Reveal nav/footer link text (first-menu-link starts at translateY(100%) — hidden)
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
    <div ref={rootRef} className="about-page">
      <Navbar revealed={revealed} />
      <CustomCursor />

      <div className="about-hero">
        <div className="about-hero-img">
          <img src={about.heroImage} alt={about.heroName} />
        </div>
        <div className="about-hero-content">
          <p className="about-hero-label">Hello, I&apos;m</p>
          <div className="about-hero-name-wrap">
            <h1 className="about-hero-name">{about.heroName}</h1>
          </div>
        </div>
      </div>

      <div className="about-scroll-hint">
        <div className="about-scroll-left">
          <span className="about-scroll-arrow">[↓]</span>
          <span className="about-scroll-text">Scroll</span>
        </div>
        <span className="about-hero-tagline">{about.heroTagline}</span>
      </div>

      <main className="about-main">

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

        <section className="about-services">
          <h2 className="about-services-title">{about.servicesHeading}</h2>
          {about.services.map((service, i) => (
            <div key={i} className="about-service">
              <div className="about-service-left">
                <span className="about-service-num">({String(i + 1).padStart(2, "0")})</span>
                <h3 className="about-service-heading">{service.heading}</h3>
              </div>
              <p className="about-service-body">{service.body}</p>
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
          <div className="about-client-slider">
            <div className="about-client-slider-track">
              {[...about.clients, ...about.clients].map((client, i) => (
                <span key={`${client}-${i}`} className="about-client-item">{client}</span>
              ))}
            </div>
          </div>
        </section>

        <Testimonials
          heading={about.testimonialsHeading}
          testimonials={about.testimonials}
        />

        <SiteFooter />
      </main>
    </div>
  );
}
