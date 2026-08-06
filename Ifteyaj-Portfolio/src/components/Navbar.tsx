import Link from "next/link";
import LottiePlayer from "@/components/ui/Lottie";
import LiveClock from "@/components/ui/LiveClock";
import { navLinks, navInfoLinks, siteConfig } from "@/data/site";

interface NavbarProps {
  revealed: boolean;
}

export default function Navbar({ revealed }: NavbarProps) {
  return (
    <nav className="navbar" role="banner">
      <div className="nav-bar">
        <div className="nav-logo-wrapper">
          <Link href="/" className="nav-logo-link" aria-label="Ifteyaj studio home">
            <LottiePlayer src="/lottie/nav-logo.json" className="nav-logo" />
          </Link>
        </div>

        <div className="work-menu-section">
          <div className="work-nav-wrapper">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="menu-link page_link">
                <div className="menu-text first-menu-link">
                  <p className="menu-big-text">{link.label}</p>
                  <p className="menu-small-text">({link.count?.toString().padStart(2, "0")})</p>
                </div>
                <div className="menu-text second-menu-link">
                  <p className="menu-big-text">{link.label}</p>
                  <p className="menu-small-text">({link.count?.toString().padStart(2, "0")})</p>
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
              </div>
              <div className="menu-text second-menu-link">
                <p className="menu-big-text">{navInfoLinks[0].label}</p>
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

        <div className="nav-clock-wrapper">
          <LiveClock visible={revealed} label="(BDT)" />
        </div>
      </div>
    </nav>
  );
}