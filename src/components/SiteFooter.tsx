"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site";

export default function SiteFooter() {
  return (
    <>
      <footer className="case-footer-block">
        <div className="case-footer-inner">
          <Link href="/" className="case-footer-logo-link" aria-label="Home">
            <Image
              src="/monogram.svg"
              alt="Ifteyaj"
              width={320}
              height={320}
              loading="lazy"
              className="case-footer-logo"
            />
          </Link>
          <Link href="/contact" className="case-footer-cta-link">
            Let&rsquo;s build something{" "}
            <br className="case-footer-cta-break" />
            great together
          </Link>
          <a
            href="#"
            className="case-back-to-top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to top [↑]
          </a>
        </div>
      </footer>

      <div className="case-bottom-nav">
        <div className="case-bottom-col case-bottom-col-copy">
          <span className="case-bottom-copy">{siteConfig.copyright}</span>
        </div>
        <div className="case-bottom-col case-bottom-col-nav">
          <Link href="/about" className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">About</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">About</p></div>
          </Link>
          <a href="https://drive.google.com/file/d/1FrO_WGZ_RXZvE894trR2sm_1kpdQR6wC/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">Resume</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">Resume</p></div>
          </a>
          <Link href="/work" className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">All Works</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">All Works</p></div>
          </Link>
        </div>
        <div className="case-bottom-col case-bottom-col-social">
          {siteConfig.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{s.label}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{s.label}</p></div>
            </a>
          ))}
        </div>
        <div className="case-bottom-col case-bottom-col-brand">
          <span className="case-bottom-brand menu-big-text">Web Designer</span>
          <span className="case-bottom-brand menu-big-text">Brand Designer</span>
        </div>
      </div>
    </>
  );
}