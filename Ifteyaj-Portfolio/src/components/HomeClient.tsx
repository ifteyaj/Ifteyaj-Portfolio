"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import CustomCursor from "@/components/CustomCursor";

export default function HomeClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      setFullscreen(false);
    } else {
      document.documentElement.requestFullscreen?.();
      setFullscreen(true);
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerEases();
    const qs = <T extends Element = HTMLElement>(sel: string): T[] =>
      Array.from(root.querySelectorAll<T>(sel));

    // ── Lenis smooth scroll ──
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

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

    function goToSlide(next: number) {
      if (isAnimating || next === currentSlide) return;
      isAnimating = true;
      const prev = currentSlide;
      currentSlide = next;

      const prevItem = items[prev];
      const nextItem = items[next];

      // Layer BOTH slides so the previous image stays underneath while the next
      // one slides in from the right — no blank/black area mid-transition.
      nextItem.style.zIndex = "5";
      prevItem.style.zIndex = "4";
      nextItem.classList.add("active");
      prevItem.classList.add("active");

      const prevTitle = prevItem.querySelector<HTMLElement>(".main-slider_title");
      const nextTitle = nextItem.querySelector<HTMLElement>(".main-slider_title");
      // Carousel: current name slides out through the TOP of the line, the next
      // one rises in from the bottom.
      if (prevTitle) gsap.to(prevTitle, { bottom: "100%", duration: 0.6, ease: "texttshow" });
      if (nextTitle) gsap.set(nextTitle, { bottom: "-100%" });
      if (nextTitle) gsap.to(nextTitle, { bottom: "0", duration: 1.2, ease: "texttshow", delay: 0.1 });

      const prevImgWrap = prevItem.querySelector<HTMLElement>(".main-slider_img-wrap");
      const nextImgWrap = nextItem.querySelector<HTMLElement>(".main-slider_img-wrap");
      if (prevImgWrap) gsap.set(prevImgWrap, { xPercent: 0 });
      if (nextImgWrap) {
        gsap.fromTo(
          nextImgWrap,
          { xPercent: 100 },
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
        isAnimating = false;
      }, 1250);
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % items.length);
    }
    function prevSlide() {
      goToSlide((currentSlide - 1 + items.length) % items.length);
    }

    const nextBtn = root.querySelector<HTMLElement>(".btn-nextslide");
    const prevBtn = root.querySelector<HTMLElement>(".btn-prevslide");
    nextBtn?.addEventListener("click", nextSlide);
    prevBtn?.addEventListener("click", prevSlide);

    let wheelCooldown = false;
    const onWheel = (e: WheelEvent) => {
      if (wheelCooldown || isAnimating) return;
      wheelCooldown = true;
      setTimeout(() => {
        wheelCooldown = false;
      }, 900);
      if (e.deltaY > 0) goToSlide((currentSlide + 1) % items.length);
      else goToSlide((currentSlide - 1 + items.length) % items.length);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goToSlide((currentSlide + 1) % items.length);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goToSlide((currentSlide - 1 + items.length) % items.length);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);

    // ── Link hover (dual-text) ──
    qs<HTMLElement>(".menu-link").forEach((link) => {
      const first = link.querySelector<HTMLElement>(".first-menu-link");
      const second = link.querySelector<HTMLElement>(".second-menu-link");
      const firstS = link.querySelector<HTMLElement>(".first-menu-link-social");
      const secondS = link.querySelector<HTMLElement>(".second-menu-link-social");

      link.addEventListener("mouseenter", () => {
        if (first) gsap.to(first, { y: "-100%", duration: 0.6, ease: "hoverin" });
        if (second) gsap.to(second, { y: "-100%", duration: 0.6, ease: "hoverin" });
        if (firstS) gsap.to(firstS, { y: "-100%", duration: 0.6, ease: "hoverin" });
        if (secondS) gsap.to(secondS, { y: "-100%", duration: 0.6, ease: "hoverin" });
      });
      link.addEventListener("mouseleave", () => {
        if (first) gsap.to(first, { y: "0%", duration: 1, ease: "hoverout" });
        if (second) gsap.to(second, { y: "0%", duration: 1, ease: "hoverout" });
        if (firstS) gsap.to(firstS, { y: "0%", duration: 1, ease: "hoverout" });
        if (secondS) gsap.to(secondS, { y: "0%", duration: 1, ease: "hoverout" });
      });
    });

    // ── Page load intro ──
    const counterContent = root.querySelector<HTMLElement>(".frontpage-counter-content");
    const counterNumber = root.querySelector<HTMLElement>(".frontpage-counter-number");
    const loaderHeaders = root.querySelectorAll<HTMLElement>(".loader-header");
    const loaderHeaders2 = root.querySelectorAll<HTMLElement>(".loader-header-2");
    const loader = root.querySelector<HTMLElement>(".frontpage-loader");

    gsap.to(counterContent, { duration: 1.35, y: "0%", ease: "texttshow", delay: 0.5 });
    gsap.to(counterNumber, { duration: 1.35, y: "0%", ease: "texttshow", delay: 0.5 });

    const counterObj = { value: 0 };
    gsap.to(counterObj, {
      value: 100,
      duration: 1.7,
      delay: 1.8,
      ease: "none",
      onUpdate: () => {
        if (counterNumber) counterNumber.textContent = String(Math.ceil(counterObj.value));
      },
      onComplete: () => {
        gsap.to(counterContent, { duration: 1.5, y: "-100%", ease: "texttshow", delay: 0.15 });
        gsap.to(counterNumber, { duration: 1.5, y: "-100%", ease: "texttshow", delay: 0.15 });
      },
    });

    gsap.to(loaderHeaders, { duration: 1.35, y: "0%", ease: "texttshow", delay: 0.5 });
    gsap.to(loaderHeaders2, { duration: 1.35, y: "0%", ease: "texttshow", delay: 0.6 });
    gsap.to(loaderHeaders, { duration: 1.5, y: "-100%", ease: "texttshow", delay: 3.6 });
    gsap.to(loaderHeaders2, { duration: 1.5, y: "-100%", ease: "texttshow", delay: 3.6 });

    gsap.to(loader, {
      duration: 1.35,
      y: "-100%",
      ease: "Pagtrans",
      delay: 4.3,
      onComplete: () => {
        if (loader) loader.style.display = "none";
        setRevealed(true);
      },
    });

    // Reveals (post loader)
    const D = 5.4;
    gsap.fromTo(
      ".main-slider_img-wrap",
      { xPercent: 100 },
      { xPercent: 0, duration: 1.35, ease: "Pagtrans", delay: 4.3 }
    );
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
    gsap.to(".first-menu-link", { y: "0%", duration: 1, ease: "texttshow", delay: D });
    gsap.to(".first-menu-link-social", { y: "0%", duration: 1, ease: "texttshow", delay: D });
    gsap.to(".slider-footer-text", { y: "0%", duration: 1, ease: "texttshow", delay: D });
    gsap.to(root.querySelector(".nav-clock-dot"), { y: "0%", duration: 1, ease: "texttshow", delay: D });
    gsap.to(root.querySelector(".nav-clock"), { y: "0%", duration: 1, ease: "texttshow", delay: D });
    gsap.to(root.querySelector(".nav-clock-infomation"), { y: "0%", duration: 1, ease: "texttshow", delay: D });
    gsap.to(".numbers_wrap", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "texttshow",
      delay: D,
    });
    gsap.to(".main-slider_title", { bottom: "0", duration: 1.8, ease: "texttshow", delay: 4.8 });

    syncVideos();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      nextBtn?.removeEventListener("click", nextSlide);
      prevBtn?.removeEventListener("click", prevSlide);
    };
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
            <Hero fullscreen={fullscreen} onToggleFullscreen={toggleFullscreen} />
          </main>
        </div>
      </div>
    </div>
  );
}