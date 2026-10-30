"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerEases } from "@/lib/gsap";
import { setupMenuLinkHovers } from "@/lib/menuHover";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import SiteFooter from "@/components/SiteFooter";
import HomeIntro from "@/components/HomeIntro";
import HomeMediaRow from "@/components/HomeMediaRow";
import HomeFeaturedWork from "@/components/HomeFeaturedWork";
import dynamic from "next/dynamic";

const HomeProcess = dynamic(() => import("@/components/HomeProcess"));
const HomeContact = dynamic(() => import("@/components/HomeContact"));
const HomePanorama = dynamic(() => import("@/components/HomePanorama"));
import { hasSiteBooted } from "@/lib/navSession";
import { closingImages } from "@/data/home";
import { logoImages } from "@/data/logos";

export default function HomeClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Arriving from another page (nav logo, back button) shows the home page
  // immediately; only a real page load plays the intro.
  const [skipIntro] = useState(() => hasSiteBooted());

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerEases();
    setupMenuLinkHovers(root);

    // Lock the viewport itself: `html { overflow-x: hidden }` makes the root's
    // overflow propagate to the viewport, so a body-only lock never reaches it
    // and the page stays scrollable behind the loader.
    const unlockScroll = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loader = root.querySelector<HTMLElement>(".frontpage-loader");

    // Intro → headline → media row, in well under a second.
    const revealHome = () => {
      // The reel waits for this so it never decodes behind the loader.
      document.documentElement.dataset.homeRevealed = "true";
      window.dispatchEvent(new Event("home:reveal"));

      // Headline: the same slide-in every other page title uses.
      gsap.fromTo(
        ".home-headline-line",
        { x: -120, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: "texttshow", delay: 0.1 }
      );

      gsap
        .timeline({ defaults: { ease: "texttshow" } })
        .to(".home-intro", { opacity: 1, y: 0, duration: 0.45 }, 0)
        .to(".home-media", { opacity: 1, y: 0, duration: 0.55 }, 0.15);
    };

    // Client-side arrival: no loader and no staged reveal, just the page.
    if (skipIntro) {
      document.documentElement.dataset.homeRevealed = "true";
      window.dispatchEvent(new Event("home:reveal"));
      gsap.set([".home-intro", ".home-media"], { opacity: 1, y: 0 });
      gsap.set(".home-headline-line", { opacity: 1, x: 0, y: 0 });
      return () => {
        unlockScroll();
      };
    }

    // Keep the page still behind the loader, then let the media row continue
    // below the fold once the reveal starts.
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    if (prefersReducedMotion) {
      if (loader) loader.style.display = "none";
      unlockScroll();
      return () => {
        unlockScroll();
      };
    }

    const counterNumber = root.querySelector<HTMLElement>(".frontpage-counter-number");
    const logoWrap = root.querySelector<HTMLElement>(".loader-logo-wrap");
    const logoOutline = root.querySelector<HTMLElement>(".loader-logo-outline");

    // ── Logo draw-on ──
    if (logoOutline) {
      const outlineLength =
        (logoOutline as unknown as SVGPathElement).getTotalLength?.() || 80000;
      gsap.set(logoOutline, { strokeDasharray: outlineLength, strokeDashoffset: outlineLength });
      gsap.to(logoOutline, {
        strokeDashoffset: 0,
        duration: 1.7,
        delay: 1.8,
        ease: "power1.inOut",
        onComplete: () => logoWrap?.classList.add("is-idle"),
      });
    }

    // ── Counter 0 → 100 ──
    const counterObj = { value: 0 };
    gsap.to(counterObj, {
      value: 100,
      duration: 1.7,
      delay: 1.8,
      ease: "none",
      onUpdate: () => {
        if (counterNumber) counterNumber.textContent = String(Math.ceil(counterObj.value));
      },
    });

    // ── Loader exit → home reveal ──
    if (!loader) {
      unlockScroll();
      revealHome();
    } else {
      gsap.to(loader, {
        duration: 1.35,
        y: "-100%",
        ease: "Pagtrans",
        delay: 4.3,
        onComplete: () => {
          loader.style.display = "none";
          unlockScroll();
          revealHome();
        },
      });
    }

    return () => {
      unlockScroll();
    };
  }, [skipIntro]);

  return (
    <div ref={rootRef}>
      {skipIntro ? null : <Loader />}
      <div className="overlay" />
      <Navbar />
      <div className="page-content">
        <div className="page-wrapper">
          <main id="smooth-content" className="main-wrapper home-main">
            <section className="home-stage" aria-label="Introduction">
              <HomeIntro />
              <HomeMediaRow />
            </section>

            <div className="home-sections">
              <HomeProcess />
              <HomeFeaturedWork />

              {logoImages.length > 0 && (
                <>
                  <section className="home-logo-reel" aria-label="Logo carousel">
                    <h2 className="home-logo-reel-title">Worked with 30+ brands, local &amp; global</h2>
                    <div className="home-logo-marquee">
                      <div className="home-logo-marquee-track">
                        {[...logoImages, ...logoImages].map((logo, i) => {
                          // The second pass only exists for the seamless loop.
                          const isRepeat = i >= logoImages.length;
                          return (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              key={`${logo.src}-${i}`}
                              src={logo.src}
                              alt={isRepeat ? "" : `${logo.name} logo`}
                              aria-hidden={isRepeat || undefined}
                              className={`home-logo-marquee-img${/salvator/i.test(logo.src) ? " is-salvator" : ""}`}
                              decoding="async"
                            />
                          );
                        })}
                      </div>
                    </div>
                  </section>
                  <div className="about-divider home-logo-reel-divider" />
                </>
              )}
              <HomeContact />
              <HomePanorama images={closingImages} />
              <SiteFooter />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
