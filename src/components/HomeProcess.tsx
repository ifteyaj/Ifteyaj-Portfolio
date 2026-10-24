"use client";

import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import { gsap } from "@/lib/gsap";
import { about } from "@/data/about";
import { IconDiscovery, IconStrategy, IconDesign, IconBuildLaunch } from "@/components/ProcessIcons";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  discovery: IconDiscovery,
  strategy: IconStrategy,
  design: IconDesign,
  build: IconBuildLaunch,
};

/**
 * "How I work" — four-step process rendered as an editorial column row.
 */
export default function HomeProcess() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = rootRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cols = Array.from(section.querySelectorAll<HTMLElement>(".home-process-col"));

    if (reduced) {
      cols.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      // make icon strokes visible
      section.querySelectorAll("svg path, svg line, svg circle, svg rect").forEach((p) => {
        (p as SVGElement).style.strokeDashoffset = "0";
      });
      return;
    }

    cols.forEach((c) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(24px)";
    });

    // prepare icon draw-on
    section.querySelectorAll("svg path, svg line, svg circle, svg rect").forEach((p) => {
      const el = p as SVGGeometryElement;
      try {
        const len = el.getTotalLength?.();
        if (len && Number.isFinite(len)) {
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
        }
      } catch {}
    });

    let revealed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || revealed) return;
        revealed = true;
        cols.forEach((col, i) => {
          gsap.to(col, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.08, ease: "texttshow" });
        });
        section.querySelectorAll("svg").forEach((svg, i) => {
          svg.querySelectorAll("path, line, circle, rect").forEach((p) => {
            if ((p as SVGElement).style.strokeDasharray) {
              gsap.to(p, {
                strokeDashoffset: 0,
                duration: 0.9,
                delay: i * 0.08 + 0.12,
                ease: "texttshow",
              });
            }
          });
        });
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="home-process" aria-labelledby="home-process-label">
      <h2 id="home-process-label" className="home-work-title">
        My Work process
      </h2>
      <ol className="home-process-cols">
        {about.process.map((step) => {
          const Icon = icons[step.iconKey as string] ?? IconDiscovery;
          return (
            <li key={step.number} className="home-process-col">
              <span className="home-process-num">{step.number}</span>
              <Icon className="home-process-icon" />
              <h3 className="home-process-title">{step.heading}</h3>
              <p className="home-process-desc">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
