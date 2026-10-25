"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import { setupMenuLinkHovers } from "@/lib/menuHover";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { about } from "@/data/about";

const CurveflowCarousel = dynamic(() => import("@/lib/framer/CurveflowCarousel"), { ssr: false });

export default function AboutClient({ carouselImages = [] }: { carouselImages?: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerEases();

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // ── Link hover (dual-text) ──
    setupMenuLinkHovers(root);

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

      <div className="about-hero">
        <div className="about-hero-img">
          <Image
            src="/images/Contact_page.png"
            alt={about.heroName}
            fill
            sizes="100vw"
            priority
            unoptimized
            fetchPriority="high"
            decoding="async"
            style={{ objectFit: "cover" }}
          />

        </div>
        <div className="about-hero-content">
          <p className="about-hero-label">Hello, I&apos;m</p>
          <div className="about-hero-name-wrap">
            <h1 className="about-hero-name">{about.heroName}</h1>
          </div>
        </div>
      </div>

      <div className="about-scroll-hint">
        <span className="about-hero-tagline">{about.heroTagline}</span>
        <div className="about-scroll-right">
          <span className="about-scroll-arrow">[↓]</span>
          <span className="about-scroll-text">Scroll</span>
        </div>
      </div>

      <main className="about-main">

        <section className="about-intro">
          <p className="about-intro-text">{about.intro}</p>
        </section>

        <div className="about-divider" />

        <section className="about-bio">
          <h2 className="about-bio-heading">{about.bioHeading}</h2>
          <div className="about-bio-body">
            {about.bio.map((paragraph, i) => (
              <p key={i} className="about-bio-paragraph">{paragraph}</p>
            ))}
          </div>
        </section>

        <div className="about-divider" />

        <section className="about-services">
          <h2 className="about-services-title">{about.servicesHeading}</h2>
          {about.services.map((service, i) => (
            <div key={i} className="about-service">
              <span className="about-service-num">({String(i + 1).padStart(2, "0")})</span>
              <div className="about-bio-body about-service-grid">
                <h3 className="about-service-heading">{service.heading}</h3>
                <p className="about-service-body">{service.body}</p>
              </div>
            </div>
          ))}
        </section>

        {carouselImages.length > 0 && (
          <section className="about-carousel">
            <div className="about-carousel-wrapper">
              <CurveflowCarousel
                slides={carouselImages.map((src) => ({ kind: "image", pictureUrl: src, href: "" }))}
                frame={{ corner: 12, heightPct: 50, fit: "natural", offset: 0 }}
                drive={{ autoplay: 50, holdOnHover: true }}
                backdrop={{ fill: "transparent" }}
              />
            </div>
          </section>
        )}

        <section className="about-experience">
          <h2 className="about-experience-title">{about.experienceHeading}</h2>
          {about.experience.map((item, i) => (
            <div key={i} className="about-experience-item">
              <span className="about-experience-num">({String(i + 1).padStart(2, "0")})</span>
              <div className="about-experience-content">
                <h3 className="about-experience-company">{item.company}</h3>
                <p className="about-experience-role">{item.role}</p>
                <span className="about-experience-period">{item.period}</span>
                {item.location && (
                  <span className="about-experience-location">{item.location}</span>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="about-tools">
          <h2 className="about-tools-title">{about.toolsHeading}</h2>
          <ul className="about-tools-list">
            {about.tools.map((tool, i) => (
              <li key={i} className="about-tool">
                <Image
                  className="about-tool-icon"
                  src={tool.icon}
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden
                />
                <span className="about-tool-name">{tool.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-tools-image">
          <Image
            src={about.heroImage}
            alt={about.heroName}
            width={1920}
            height={1080}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
