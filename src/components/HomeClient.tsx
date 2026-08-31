"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import CustomCursor from "@/components/CustomCursor";
import LottiePlayer from "@/components/ui/Lottie";
import { projects } from "@/data/projects";

export default function HomeClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [gridView, setGridView] = useState(false);
  const transitioning = useRef(false);
  const gridCloseButtonRef = useRef<HTMLButtonElement>(null);
  const gridFocusReturnRef = useRef<HTMLElement | null>(null);

  const toggleGridView = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    const root = rootRef.current;
    if (!root) { transitioning.current = false; return; }

    if (!gridView && document.activeElement instanceof HTMLElement) {
      gridFocusReturnRef.current = document.activeElement;
    }

    const sliderWrap = root.querySelector<HTMLElement>(".main-slider_wrap");
    const sliderNav = root.querySelector<HTMLElement>(".slider-toggle-nav");
    const numberWrapper = root.querySelector<HTMLElement>(".number-wrapper");
    const prevBtn = root.querySelector<HTMLElement>(".prev-btn-wrapper");
    const nextBtn = root.querySelector<HTMLElement>(".next-btn-wrapper");
    const sliderFooter = root.querySelector<HTMLElement>(".slider-footer");
    const gridOverlay = root.querySelector<HTMLElement>(".home-grid-overlay");
    const gridItems = root.querySelectorAll<HTMLElement>(".home-grid-item");
    const gridToggleNav = root.querySelector<HTMLElement>(".grid-toggle-nav");
    const contentElements = [sliderWrap, sliderNav, numberWrapper, prevBtn, nextBtn, sliderFooter].filter(Boolean) as HTMLElement[];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (!gridView) {
        gsap.set(contentElements, { opacity: 0, y: 0 });
        gsap.set(gridOverlay, { display: "flex", opacity: 1 });
        gsap.set(gridItems, { opacity: 1, y: 0 });
        gsap.set(gridToggleNav, { opacity: 1 });
        root.classList.add("is-grid-open");
        setGridView(true);
        requestAnimationFrame(() => {
          if (root.classList.contains("is-grid-open")) gridCloseButtonRef.current?.focus();
        });
      } else {
        gsap.set(gridOverlay, { display: "none", opacity: 0 });
        gsap.set(contentElements, { opacity: 1, y: 0 });
        root.classList.remove("is-grid-open");
        setGridView(false);
        const returnTarget = gridFocusReturnRef.current;
        gridFocusReturnRef.current = null;
        if (returnTarget?.isConnected) returnTarget.focus();
      }
      transitioning.current = false;
      return;
    }

    if (!gridView) {
      // → Grid view
      const tl = gsap.timeline({
        onComplete: () => {
          transitioning.current = false;
          setGridView(true);
          root.classList.add("is-grid-open");
          requestAnimationFrame(() => {
            if (root.classList.contains("is-grid-open")) gridCloseButtonRef.current?.focus();
          });
        }
      });

      tl.to(contentElements, {
        opacity: 0,
        y: -30,
        duration: 0.45,
        ease: "power2.inOut",
        stagger: 0.03,
      });

      tl.set(gridOverlay, { display: "flex" }, "<");
      tl.fromTo(gridOverlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, "<+0.15");
      tl.fromTo(gridItems, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 }, "<+0.1");
      if (gridToggleNav) {
        tl.fromTo(gridToggleNav, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, "<+0.2");
        const gridBorder = gridToggleNav.querySelector<HTMLElement>(".slider-nav-border");
        if (gridBorder) tl.fromTo(gridBorder, { width: "0%" }, { width: "100%", duration: 1, ease: "linedraw" }, "<+0.1");
      }
    } else {
      // → Slider view
      const tl = gsap.timeline({
        onComplete: () => {
          transitioning.current = false;
          setGridView(false);
          root.classList.remove("is-grid-open");
          gsap.set(gridOverlay, { display: "none" });
          const returnTarget = gridFocusReturnRef.current;
          gridFocusReturnRef.current = null;
          if (returnTarget?.isConnected) returnTarget.focus();
        }
      });

      if (gridToggleNav) tl.to(gridToggleNav, { opacity: 0, duration: 0.25, ease: "power2.in" });
      tl.to(gridItems, { opacity: 0, y: 30, duration: 0.35, ease: "power2.inOut", stagger: 0.03 });
      tl.to(gridOverlay, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, "<+0.1");
      tl.set(contentElements, { opacity: 0, y: 30 }, "<");
      tl.to(contentElements, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.04,
      }, "<+0.1");
    }
  }, [gridView]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    registerEases();
    const qs = <T extends Element = HTMLElement>(sel: string): T[] =>
      Array.from(root.querySelectorAll<T>(sel));

    // ── Lenis smooth scroll ──
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.1,
      smoothWheel: !prefersReducedMotion,
    });
    let rafId: number | null = null;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    if (!prefersReducedMotion) rafId = requestAnimationFrame(raf);

    // ── Grid: smooth horizontal scroll ──
    const gridOverlay = root.querySelector<HTMLElement>(".home-grid-overlay");
    const gridTrack = root.querySelector<HTMLElement>(".home-grid-track");
    let gridTarget = 0;
    let gridCurrent = 0;
    let gridRaf: number | null = null;

    const gridAnimate = () => {
      if (!gridTrack) {
        gridRaf = null;
        return;
      }
      gridCurrent += (gridTarget - gridCurrent) * 0.08;
      if (Math.abs(gridTarget - gridCurrent) < 0.5) {
        gridCurrent = gridTarget;
        gridTrack.scrollLeft = gridCurrent;
        gridRaf = null;
        return;
      }
      gridTrack.scrollLeft = gridCurrent;
      gridRaf = requestAnimationFrame(gridAnimate);
    };

    const onGridWheel = (e: WheelEvent) => {
      if (!gridTrack || !gridOverlay || !root.classList.contains("is-grid-open")) return;
      e.preventDefault();
      e.stopPropagation();
      const maxScroll = gridTrack.scrollWidth - gridTrack.clientWidth;
      gridTarget = Math.max(0, Math.min(gridTarget + e.deltaY * 1.5, maxScroll));
      if (prefersReducedMotion) {
        gridCurrent = gridTarget;
        gridTrack.scrollLeft = gridTarget;
      } else if (!gridRaf) {
        gridRaf = requestAnimationFrame(gridAnimate);
      }
    };
    gridOverlay?.addEventListener("wheel", onGridWheel, { passive: false });

    // Touch/gesture scrolling is handled natively via overflow-x on the track
    // (see `.home-grid-track` in globals.css), so we don't intercept touchmove.

    // ── Slider state ──
    const items: HTMLElement[] = qs(".main-slider_item");
    const numberItems: HTMLElement[] = qs(".numbers_item");
    const numbersList = root.querySelector<HTMLElement>(".numbers_list");
    const ITEM_H = 25;
    let currentSlide = 0;
    let isAnimating = false;

    const syncVideos = () => {
      const videos = qs<HTMLVideoElement>("video");
      videos.forEach((v) => {
        const inActive = !!v.closest(".main-slider_item.active");
        if (inActive) {
          v.muted = true;
          v.play?.().catch(() => {});
        } else {
          v.pause?.();
        }
      });
    };

    function goToSlide(next: number, direction: 1 | -1) {
      if (isAnimating || next === currentSlide) return;
      isAnimating = true;
      const prev = currentSlide;
      currentSlide = next;

      const prevItem = items[prev];
      const nextItem = items[next];

      if (prefersReducedMotion) {
        prevItem.classList.remove("active");
        nextItem.classList.add("active");
        prevItem.style.zIndex = "";
        nextItem.style.zIndex = "";
        prevItem.querySelector<HTMLElement>(".main-slider_img-wrap")?.style.removeProperty("transform");
        nextItem.querySelector<HTMLElement>(".main-slider_img-wrap")?.style.removeProperty("transform");
        numberItems.forEach((n, i) => n.classList.toggle("active", i === next));
        syncVideos();
        isAnimating = false;
        return;
      }

      // Layer BOTH slides so the previous image stays underneath while the next
      // one slides in — no blank/black area mid-transition. Forward (next)
      // slides in from the right (right → left), backward (prev) from the left
      // (left → right).
      nextItem.style.zIndex = "5";
      prevItem.style.zIndex = "4";
      nextItem.classList.add("active");
      prevItem.classList.add("active");

      const prevTitle = prevItem.querySelector<HTMLElement>(".main-slider_title");
      const nextTitle = nextItem.querySelector<HTMLElement>(".main-slider_title");
      // Scroll down (next): text enters bottom → top. Scroll up (prev): top → bottom.
      const enterFrom = direction === 1 ? -100 : 100;
      const exitTo = direction === 1 ? 100 : -100;
      if (nextTitle) gsap.set(nextTitle, { bottom: `${enterFrom}%`, opacity: 1 });
      if (prevTitle) gsap.to(prevTitle, { bottom: `${exitTo}%`, opacity: 0, duration: 0.6, ease: "Pagtrans" });
      if (nextTitle) gsap.to(nextTitle, { bottom: "0", duration: 1.2, ease: "texttshow", delay: 0.1 });

      const prevImgWrap = prevItem.querySelector<HTMLElement>(".main-slider_img-wrap");
      const nextImgWrap = nextItem.querySelector<HTMLElement>(".main-slider_img-wrap");
      if (prevImgWrap) gsap.set(prevImgWrap, { xPercent: 0 });
      if (nextImgWrap) {
        gsap.fromTo(
          nextImgWrap,
          { xPercent: direction === -1 ? -100 : 100 },
          { xPercent: 0, duration: 1.1, ease: "Pagtrans" }
        );
      }

      if (numbersList) gsap.to(numbersList, { y: -next * ITEM_H, duration: 0.8, ease: "Pagtrans" });
      numberItems.forEach((n, i) => n.classList.toggle("active", i === next));

      syncVideos();
      setTimeout(() => {
        prevItem.classList.remove("active");
        prevItem.style.zIndex = "";
        nextItem.style.zIndex = "";
        if (prevImgWrap) gsap.set(prevImgWrap, { clearProps: "transform" });
        if (nextImgWrap) gsap.set(nextImgWrap, { clearProps: "transform" });
        isAnimating = false;
      }, 1250);
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % items.length, 1);
    }
    function prevSlide() {
      goToSlide((currentSlide - 1 + items.length) % items.length, -1);
    }

    const nextBtn = root.querySelector<HTMLElement>(".btn-nextslide");
    const prevBtn = root.querySelector<HTMLElement>(".btn-prevslide");
    nextBtn?.addEventListener("click", nextSlide);
    prevBtn?.addEventListener("click", prevSlide);

    let wheelCooldown = false;
    const onWheel = (e: WheelEvent) => {
      if (root.classList.contains("is-grid-open") || wheelCooldown || isAnimating) return;
      wheelCooldown = true;
      setTimeout(() => {
        wheelCooldown = false;
      }, 900);
      if (e.deltaY > 0) nextSlide();
      else prevSlide();
    };
    const onKey = (e: KeyboardEvent) => {
      if (root.classList.contains("is-grid-open")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextSlide();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevSlide();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);

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

    // ── Page load intro ──
    const counterNumber = root.querySelector<HTMLElement>(".frontpage-counter-number");
    const loader = root.querySelector<HTMLElement>(".frontpage-loader");
    const logoWrap = root.querySelector<HTMLElement>(".loader-logo-wrap");
    const logoOutline = root.querySelector<HTMLElement>(".loader-logo-outline");

    if (prefersReducedMotion) {
      if (loader) loader.style.display = "none";
      requestAnimationFrame(() => setRevealed(true));
      gsap.set(qs<HTMLElement>(".main-slider_title"), { bottom: "0" });
      gsap.set(qs<HTMLElement>(".first-menu-link"), { y: "0%" });
      gsap.set(root.querySelector<HTMLElement>(".circle-minimize-btn"), {
        clipPath: "inset(0% 0% 0% 0%)",
      });
      gsap.set(root.querySelector<HTMLElement>(".numbers_wrap"), {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });
      gsap.set(root.querySelector<HTMLElement>(".slider-nav-border"), { width: "100%" });
      gsap.set(root.querySelector<HTMLElement>(".slider-footer-border"), { width: "100%" });
    } else {
      // Logo draw-on animation (outline only)
      if (logoOutline) {
      const outlineLength = (logoOutline as unknown as SVGPathElement).getTotalLength?.() || 80000;
      gsap.set(logoOutline, {
        strokeDasharray: outlineLength,
        strokeDashoffset: outlineLength,
      });

      // Draw outline slowly to match counter timing
      gsap.to(logoOutline, {
        strokeDashoffset: 0,
        duration: 1.7,
        delay: 1.8,
        ease: "power1.inOut",
        onComplete: () => {
          logoWrap?.classList.add("is-idle");
        },
      });
    }

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

    gsap.to(loader, {
      duration: 1.35,
      y: "-100%",
      ease: "Pagtrans",
      delay: 4.3,
      onComplete: () => {
        if (loader) loader.style.display = "none";
        setRevealed(true);
        // Force a clean re-rasterization of the hero layers after reveal.
        // iOS composited the image once at a stale scale; a tiny transform
        // nudge (then removal) makes the browser re-raster it at full DPR —
        // the same effect the manual "resize" was producing.
        requestAnimationFrame(() => {
          root.querySelectorAll<HTMLElement>(".main-slider_img-wrap").forEach((wrap) => {
            gsap.set(wrap, { scale: 1.001 });
          });
        });
        requestAnimationFrame(() => {
          root.querySelectorAll<HTMLElement>(".main-slider_img-wrap").forEach((wrap) => {
            gsap.set(wrap, { clearProps: "scale, transform" });
          });
        });
      },
    });

    // Reveals (post loader)
    const D = 5.4;
    gsap.to(root.querySelector(".slider-nav-border"), {
      width: "100%",
      duration: 1.5,
      ease: "linedraw",
      delay: 4.4,
    });
    gsap.to(root.querySelector(".slider-footer-border"), {
      width: "100%",
      duration: 1.5,
      ease: "linedraw",
      delay: 4.8,
    });
    gsap.to(".circle-minimize-btn", { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "texttshow", delay: D });
    gsap.to(".numbers_wrap", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "texttshow",
      delay: D,
    });
    gsap.to(".main-slider_item.active .main-slider_title", { bottom: "0", duration: 1.8, ease: "texttshow", delay: D });
    // Nav link reveal (first-menu-link starts at translateY(100%) — hidden)
    // Skip navbar and footer links - they're always visible
    gsap.to(".first-menu-link:not(.case-bottom-nav .first-menu-link):not(.about-nav-wrapper .first-menu-link):not(.contact-nav-wrapper .first-menu-link):not(.nav-clock-wrapper .first-menu-link):not(.work-nav-wrapper .first-menu-link)", { y: "0%", duration: 1, ease: "texttshow", delay: D });
    }

    syncVideos();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (gridRaf) cancelAnimationFrame(gridRaf);
      lenis.destroy();
      gridOverlay?.removeEventListener("wheel", onGridWheel);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      nextBtn?.removeEventListener("click", nextSlide);
      prevBtn?.removeEventListener("click", prevSlide);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div ref={rootRef}>
      <Loader />
      <div className="overlay" />
      <Navbar revealed={revealed} />
      <CustomCursor />
      <div className="page-content">
        <div className="page-wrapper">
          <main id="smooth-content" className="main-wrapper">
            <Hero gridView={gridView} onToggleGridView={toggleGridView} />
          </main>
        </div>
      </div>

      {/* Grid overlay */}
      <div className="home-grid-overlay" style={{ display: "none" }}>
        <div className="slider-toggle-nav grid-toggle-nav">
          <div className="slider-nav-border" />
          <div className="circle-btn container-arrows" aria-label="trail{link}">
            <button
              ref={gridCloseButtonRef}
              type="button"
              className="circle-scale-btn"
              aria-label="Switch to slider view"
              onClick={toggleGridView}
            >
              <LottiePlayer src="/lottie/btn-close.json" loop={false} autoplay={false} />
            </button>
          </div>
          <div className="circle-minimize" aria-label="trail{link}">
            <div className="minimizetool">
              <button
                type="button"
                className="circle-minimize-btn"
                aria-label="Exit grid view"
                onClick={toggleGridView}
              />
            </div>
          </div>
        </div>
        <div className="home-grid-track">
          {projects.map((p) => (
            <Link key={p.slug} href={p.href} className="home-grid-item">
              <span className="home-grid-label">({String(p.index).padStart(2, "0")}) {p.title}</span>
              <div className="home-grid-img-wrap">
                <img src={p.images?.[0]} alt={p.title} className="home-grid-img" loading="lazy" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
