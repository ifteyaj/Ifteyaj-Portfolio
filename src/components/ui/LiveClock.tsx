"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * LiveClock — renders a live clock in the specified timezone.
 * On mount, animates in with the same timing as the original nav clock reveal.
 * Controlled externally (the `visible` prop) so the Navbar can trigger the
 * reveal after the page loader exits.
 */
interface LiveClockProps {
  timezone?: string;
  label?: string;  // e.g. "(CET)"
  visible?: boolean;
}

export default function LiveClock({
  timezone = "Europe/Copenhagen",
  label = "(CET)",
  visible = false,
}: LiveClockProps) {
  const dotRef   = useRef<HTMLDivElement>(null);
  const timeRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Tick every second
  useEffect(() => {
    function update() {
      if (!timeRef.current) return;
      const t = new Date().toLocaleString("en-US", {
        timeZone:  timezone,
        hour12:    false,
        hour:      "2-digit",
        minute:    "2-digit",
      });
      timeRef.current.textContent = t;
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  // Animate in when visible becomes true
  useEffect(() => {
    if (!visible) return;
    const els = [dotRef.current, timeRef.current, labelRef.current];
    gsap.to(els, {
      y: "0%",
      duration: 1,
      ease: "texttshow",
      stagger: 0,
    });
  }, [visible]);

  return (
    <div className="flex items-center gap-[0.3rem] ml-[2rem]">
      {/* Animated dot */}
      <div
        ref={dotRef}
        className="nav-clock-dot w-[0.35rem] h-[0.35rem] rounded-full bg-white inline-block"
        style={{ transform: "translateY(250%)" }}
        aria-hidden="true"
      />
      {/* Time */}
      <div
        ref={timeRef}
        className="nav-clock overflow-hidden"
        style={{
          fontSize:      "var(--small-discriptor-text)",
          lineHeight:    "var(--small-discriptor-line)",
          fontWeight:    "var(--main-weight)",
          letterSpacing: "var(--small-discriptor-space)",
          height:        "1.05rem",
          transform:     "translateY(100%)",
        }}
        aria-live="polite"
        aria-label={`Current time in ${label}`}
      />
      {/* Label e.g. (CET) */}
      <div
        ref={labelRef}
        className="nav-clock-infomation"
        style={{
          fontSize:  "var(--small-discriptor-text)",
          color:     "var(--grey)",
          transform: "translateY(100%)",
        }}
        aria-hidden="true"
      >
        {label}
      </div>
    </div>
  );
}
