"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProject, homeContent } from "@/data/home";

/**
 * Bottom media row: a muted looping reel on the left and the featured
 * project's cover on the right.
 *
 * The 16fr / 9fr grid plus 16:9 and 1:1 aspect ratios keeps both blocks at the
 * same height at every width (9/25 of the row minus the gap). On phones the
 * grid collapses to one column: reel first, then the cover.
 */
export default function HomeMediaRow() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reduced motion: leave the poster up, never start playback.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Don't spend someone's data on a decorative loop.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;

    let cancelled = false;
    // HomeClient sets this once the loader is gone and the reveal starts.
    let revealed = document.documentElement.dataset.homeRevealed === "true";

    // Start only after both the page has loaded and the home stage has
    // revealed, so the reel never competes with the first paint or the
    // loader animation.
    const play = () => {
      if (cancelled || !revealed || document.readyState !== "complete") return;
      const attempt = video.play();
      if (attempt) attempt.catch(() => {});
    };

    const onReveal = () => {
      revealed = true;
      play();
    };

    window.addEventListener("home:reveal", onReveal);
    window.addEventListener("load", play);
    play();

    return () => {
      cancelled = true;
      window.removeEventListener("home:reveal", onReveal);
      window.removeEventListener("load", play);
    };
  }, []);

  const project = featuredProject;
  const cover =
    homeContent.featuredImage ?? project.images?.[0] ?? project.image ?? "/images/about-hero.webp";

  return (
    <div className="home-media">
      <div className="home-media-video">
        <video
          ref={videoRef}
          className="home-reel"
          poster={homeContent.reel.poster}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-label="Showreel of selected brand identity and website work"
        >
          {homeContent.reel.webm ? (
            <source src={homeContent.reel.webm} type="video/webm" />
          ) : null}
          <source src={homeContent.reel.mp4} type="video/mp4" />
        </video>
      </div>

      <Link href={project.href} className="home-featured">
        <Image
          src={cover}
          alt="Logo Style, Communication Design, Branding and UI/UX service cards"
          fill
          sizes="(max-width: 639px) 100vw, 36vw"
          loading="eager"
          className="home-featured-img"
        />
      </Link>
    </div>
  );
}
