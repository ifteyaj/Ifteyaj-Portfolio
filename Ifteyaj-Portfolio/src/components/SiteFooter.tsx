import Link from "next/link";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

export default function SiteFooter() {
  const count = projects.length;
  return (
    <>
      <footer className="case-footer-block">
        <div className="case-footer-inner">
          <Link href="/" className="case-footer-logo-link" aria-label="Home">
            <img src="/monogram.svg" alt="Ifteyaj" className="case-footer-logo" />
          </Link>
          <a href={`mailto:${siteConfig.email}`} className="case-footer-cta-link">
            Let's build something great together
          </a>
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
        <div className="case-bottom-col">
          <Link href="/" className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">Featured</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">Featured</p></div>
          </Link>
          <Link href="/work" className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">All Works</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">All Works</p></div>
          </Link>
        </div>
        <div className="case-bottom-col">
          <Link href="/about" className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">About</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">About</p></div>
          </Link>
        </div>
        <div className="case-bottom-col">
          {siteConfig.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" className="menu-link">
              <div className="menu-text first-menu-link"><p className="menu-big-text">{s.label}</p></div>
              <div className="menu-text second-menu-link"><p className="menu-big-text">{s.label}</p></div>
            </a>
          ))}
        </div>
        <div className="case-bottom-col">
          <a href={`mailto:${siteConfig.email}`} className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.email}</p></div>
          </a>
          <a href={`tel:${siteConfig.phone}`} className="menu-link">
            <div className="menu-text first-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
            <div className="menu-text second-menu-link"><p className="menu-big-text">{siteConfig.phone}</p></div>
          </a>
        </div>
        <div className="case-bottom-col">
          <span className="case-bottom-brand">Brand Designer</span>
          <span className="case-bottom-brand">Vibe Coder</span>
        </div>
        <div className="case-bottom-col">
          <span className="case-bottom-copy">{siteConfig.copyright}</span>
        </div>
      </div>
    </>
  );
}