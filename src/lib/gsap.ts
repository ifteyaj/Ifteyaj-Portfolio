"use client";

/**
 * GSAP custom ease registration.
 * Import and call registerEases() once at the top of the app (RootLayout).
 * All ease names match the originals from the live site's inline script.
 */
import { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export function registerEases() {
  CustomEase.create("Pagtrans",    ".645,.045,.355,1");
  CustomEase.create("texttshow",   "0.35,0.15,0.35,1");
  CustomEase.create("linedraw",    ".65,.05,.36,1");
  CustomEase.create("hoverout",    ".23,1,.32,1");
  CustomEase.create("hoverin",     ".65,.05,.36,1");
  CustomEase.create("slowoutfade", "1,0,1,.93");
  CustomEase.create("fastinfade",  "0,.89,.63,1");
}

/** React hook — registers eases once on mount (client-side only). */
export function useGsapEases() {
  useEffect(() => {
    registerEases();
  }, []);
}

export { gsap };
