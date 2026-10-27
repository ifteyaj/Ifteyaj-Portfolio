"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GooeyNavbar from "@/components/ui/GooeyNavbar";
import { siteConfig } from "@/data/site";
import { markSiteBooted } from "@/lib/navSession";

interface NavbarProps {
  revealed?: boolean;
}

const NAV_ITEMS = [
  { label: "About", link: "/about" },
  { label: "All Works", link: "/work" },
  { label: "Contact", link: "/contact" },
  { label: "Blog", link: "/blog" },
  { label: "Moodboard", link: "/moodboard" },
];

export default function Navbar(props: NavbarProps) {
  void props.revealed;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const previousBodyOverflowRef = useRef<string | null>(null);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Contact navigation is handled by the router (GooeyNavbar pushes the
  // href directly for internal links). Nothing extra to do here.
  const handleNavSelect = useCallback((index: number) => {
    void index;
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    markSiteBooted();
  }, []);

  const handleLogoClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      closeMenu();
      if (pathname !== "/") return;

      event.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }, 60);
    },
    [closeMenu, pathname]
  );

  useEffect(() => {
    const onMenuKeyDown = (event: KeyboardEvent) => {
      if (!menuOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    if (menuOpen) {
      if (previousBodyOverflowRef.current === null) {
        previousBodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = "hidden";
      wasOpenRef.current = true;
      window.addEventListener("keydown", onMenuKeyDown);
      requestAnimationFrame(() => {
        menuRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();
      });
    } else {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        menuButtonRef.current?.focus();
      }
    }

    return () => {
      if (menuOpen && previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
      window.removeEventListener("keydown", onMenuKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="nav-bar">
        <div className="nav-logo-wrapper">
          <Link
            href="/"
            className="nav-logo-link"
            aria-label="Ifteyaj studio home"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={handleLogoClick}
          >
            <Image
              src="/nav-logo-primary.svg"
              alt="Ifteyaj"
              width={352}
              height={157}
              priority
              className="nav-logo"
            />
          </Link>
        </div>

        <div className="nav-gooey">
          <GooeyNavbar
            items={NAV_ITEMS}
            pillColor="#212121"
            hoverPillColor="#4ade80"
            textColor="#ffffff"
            hoverTextColor="#111111"
            uppercase
            letterSpacing={0.6}
            fontSize={13}
            paddingX={18}
            paddingY={12}
            cornerRadius="0px"
            gap={10}
            neighborPush={8}
            anchorEdge="center"
            neckRatio={0.4}
            glowSize={80}
            activeFrom="page"
            onSelect={handleNavSelect}
          />
        </div>

        <button
          ref={menuButtonRef}
          className={`nav-menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={toggleMenu}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div
        ref={menuRef}
        id="mobile-navigation"
        className={`nav-mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        onClick={(event) => {
          if (event.currentTarget === event.target) closeMenu();
        }}
      >
        <div className="nav-mobile-inner">
          {NAV_ITEMS.map((item) => {
            const isInternal = item.link.startsWith("/");
            const content = (
              <>
                {item.label}
                <svg
                  className="nav-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </>
            );

            return (
              <div key={item.label} className="nav-mobile-section">
                {isInternal ? (
                  <Link href={item.link} className="nav-mobile-link" onClick={closeMenu}>
                    {content}
                  </Link>
                ) : (
                  <a href={item.link} className="nav-mobile-link" onClick={closeMenu}>
                    {content}
                  </a>
                )}
              </div>
            );
          })}

          <div className="nav-mobile-bottom">
            <div className="nav-mobile-social">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
