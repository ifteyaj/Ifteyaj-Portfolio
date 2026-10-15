import { gsap } from "@/lib/gsap";

export interface MenuLinkHoverOptions {
  enterFirst?: string;
  enterSecond?: string;
  leaveFirst?: string;
  leaveSecond?: string;
}

/**
 * Wires the dual-text hover animation for every `.menu-link` inside `root`.
 * The first/second text layers slide on hover; links inside `.case-bottom-nav`
 * are skipped because they use a pure CSS left-to-right fill instead.
 *
 * Defaults reproduce the standard flip-up swap. Pass overrides to match a
 * page that uses a different direction (e.g. the blog index).
 */
export function setupMenuLinkHovers(
  root: HTMLElement,
  {
    enterFirst = "0%",
    enterSecond = "-100%",
    leaveFirst = "100%",
    leaveSecond = "0%",
  }: MenuLinkHoverOptions = {}
) {
  root.querySelectorAll<HTMLElement>(".menu-link").forEach((link) => {
    // Skip case-bottom-nav links (they use CSS left-to-right effect)
    if (link.closest(".case-bottom-nav")) return;

    const first = link.querySelector<HTMLElement>(".first-menu-link");
    const second = link.querySelector<HTMLElement>(".second-menu-link");

    link.addEventListener("mouseenter", () => {
      if (first) gsap.to(first, { y: enterFirst, duration: 0.6, ease: "hoverin" });
      if (second) gsap.to(second, { y: enterSecond, duration: 0.6, ease: "hoverin" });
    });
    link.addEventListener("mouseleave", () => {
      if (first) gsap.to(first, { y: leaveFirst, duration: 1, ease: "hoverout" });
      if (second) gsap.to(second, { y: leaveSecond, duration: 1, ease: "hoverout" });
    });
  });
}
