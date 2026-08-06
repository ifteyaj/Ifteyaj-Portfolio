"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener("mousemove", onMove);

    const ticker = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      gsap.set(cursor, { x: cx, y: cy });
    };
    gsap.ticker.add(ticker);

    return () => {
      document.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef}>
      <div className="close-text">
        <div className="close-text-p cursor-text">[Close]</div>
      </div>
      <div className="custom-cursor-dot" />
      <div className="custom-cursor-dot-case" />
    </div>
  );
}