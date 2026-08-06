"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline();
    tl.set(overlay, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
    tl.to(overlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.5,
      ease: "power3.inOut",
    });
    tl.set(overlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
    tl.to(overlay, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      duration: 0.5,
      ease: "power3.inOut",
      delay: 0.1,
    });
  }, [pathname]);

  return (
    <>
      <div ref={overlayRef} className="page-transition-overlay" />
      {children}
    </>
  );
}
