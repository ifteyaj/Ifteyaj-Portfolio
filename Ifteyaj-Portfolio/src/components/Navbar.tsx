"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { navLinks, navInfoLinks, siteConfig } from "@/data/site";

interface NavbarProps {
  revealed?: boolean;
}

export default function Navbar(_props: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="navbar" role="banner">
      <div className="nav-bar">
        <div className="nav-logo-wrapper">
          <Link href="/" className="nav-logo-link" aria-label="Ifteyaj studio home" onClick={closeMenu}>
            <img src="/nav-logo-primary.svg" alt="Ifteyaj" className="nav-logo" />
          </Link>
        </div>

        <div className="work-menu-section">
          <div className="work-nav-wrapper">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="menu-link page_link">
                <div className="menu-text first-menu-link">
                  <p className="menu-big-text">{link.label}</p>
                  <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </div>
                <div className="menu-text second-menu-link">
                  <p className="menu-big-text">{link.label}</p>
                  <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="information-work-section">
          <div className="about-nav-wrapper">
            <Link href="/about" className="menu-link page_link">
              <div className="menu-text first-menu-link">
                <p className="menu-big-text">{navInfoLinks[0].label}</p>
                <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </div>
              <div className="menu-text second-menu-link">
                <p className="menu-big-text">{navInfoLinks[0].label}</p>
                <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </div>
            </Link>
          </div>
          <div className="contact-nav-wrapper">
            <a href={`mailto:${siteConfig.email}`} className="menu-link contact-link">
              <div className="menu-text first-menu-link">
                <p className="menu-big-text">{siteConfig.email}</p>
              </div>
              <div className="menu-text second-menu-link">
                <p className="menu-big-text">{siteConfig.email}</p>
              </div>
            </a>
            <a href={`tel:${siteConfig.phone}`} className="menu-link contact-link">
              <div className="menu-text first-menu-link">
                <p className="menu-big-text">{siteConfig.phone}</p>
              </div>
              <div className="menu-text second-menu-link">
                <p className="menu-big-text">{siteConfig.phone}</p>
              </div>
            </a>
          </div>
        </div>

        <div className="brand-designer-text">
          <span className="menu-big-text">Brand Designer</span>
          <span className="menu-big-text brand-designer-sub">Vibe Coder</span>
        </div>

        <div className="nav-clock-wrapper moodboard-nav-link">
          <Link href="/moodboard" className="menu-link page_link" onClick={closeMenu}>
            <div className="menu-text first-menu-link">
              <p className="menu-big-text">Moodboard</p>
              <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
            <div className="menu-text second-menu-link">
              <p className="menu-big-text">Moodboard</p>
              <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </Link>
          <Link href="/blog" className="menu-link page_link" onClick={closeMenu}>
            <div className="menu-text first-menu-link">
              <p className="menu-big-text">Blog</p>
              <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
            <div className="menu-text second-menu-link">
              <p className="menu-big-text">Blog</p>
              <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </Link>
        </div>

        <button
          className={`nav-hamburger ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
        </button>
      </div>

      <div className={`nav-mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <div className="nav-mobile-inner">
          <div className="nav-mobile-section">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="nav-mobile-link" onClick={closeMenu}>
                {link.label}
                <svg className="nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </Link>
            ))}
          </div>
          <div className="nav-mobile-section">
            <Link href="/moodboard" className="nav-mobile-link" onClick={closeMenu}>
              Moodboard
              <svg className="nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </Link>
          </div>
          <div className="nav-mobile-section">
            <Link href="/blog" className="nav-mobile-link" onClick={closeMenu}>
              Blog
              <svg className="nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </Link>
          </div>
          <div className="nav-mobile-section">
            <Link href="/about" className="nav-mobile-link" onClick={closeMenu}>
              About
              <svg className="nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </Link>
          </div>
          <div className="nav-mobile-section nav-mobile-contact">
            <a href={`mailto:${siteConfig.email}`} className="nav-mobile-link">{siteConfig.email}</a>
            <a href={`tel:${siteConfig.phone}`} className="nav-mobile-link">{siteConfig.phone}</a>
          </div>
          <div className="nav-mobile-section nav-mobile-social">
            {siteConfig.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" className="nav-mobile-link" rel="noopener noreferrer">{s.label}</a>
            ))}
          </div>
          <div className="nav-mobile-meta">
            <span>Brand Designer</span>
            <span>Vibe Coder</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
