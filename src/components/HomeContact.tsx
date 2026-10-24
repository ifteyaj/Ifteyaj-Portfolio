"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { siteConfig } from "@/data/site";

const CONTACT_EMAIL = "ifteyaj0@gmail.com";
const INTRO = "Feel free to reach out to discuss your project:";

const socialIcons: Record<string, { d: string; viewBox?: string }> = {
  LinkedIn: {
    d: "M6.5 9H3.8v10.2h2.7V9ZM5.1 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20.2 13.5c0-2.9-1.5-4.5-3.6-4.5-1.7 0-2.5.9-2.9 1.6V9H11v10.2h2.7v-5.6c0-1.5.5-2.4 1.8-2.4 1.2 0 1.7.8 1.7 2.4v5.6h3V13.5Z",
  },
  Instagram: {
    d: "M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 2.1a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4Zm5.2-2.5a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM8.1 4h7.8A4.1 4.1 0 0 1 20 8.1v7.8A4.1 4.1 0 0 1 15.9 20H8.1A4.1 4.1 0 0 1 4 15.9V8.1A4.1 4.1 0 0 1 8.1 4Zm0 2A2.1 2.1 0 0 0 6 8.1v7.8A2.1 2.1 0 0 0 8.1 18h7.8a2.1 2.1 0 0 0 2.1-2.1V8.1A2.1 2.1 0 0 0 15.9 6H8.1Z",
  },
  Behance: {
    d: "M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z",
  },
};

const socials = ["LinkedIn", "Instagram", "Behance"]
  .map((label) => {
    const social = siteConfig.socials.find(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );
    return social ? { ...social, label, icon: socialIcons[label] } : null;
  })
  .filter((social): social is NonNullable<typeof social> => Boolean(social));

/**
 * Minimal contact close: one muted intro line with social links, then the
 * email set to exactly the available width with a layout-effect fit.
 */
export default function HomeContact() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  // On routes that arrive as /#contact, scroll it into view reliably even if
  // native hash scrolling is intercepted by the page's smooth scroller.
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#contact") return;
    const target = document.getElementById("contact");
    if (!target) return;
    const smooth = () => {
      const el = document.getElementById("contact");
      if (!el) return;
      if ((window as unknown).lenis && typeof (window as unknown).lenis.scrollTo === "function") {
        (window as unknown).lenis.scrollTo(el, { offset: 0, duration: 1 });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
    window.setTimeout(smooth, 350);
    window.setTimeout(smooth, 900);
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const email = emailRef.current;
    if (!wrap || !email) return;

    let cancelled = false;
    let lastWidth = 0;

    const fit = () => {
      const width = wrap.clientWidth;
      if (!width) return;
      if (Math.abs(width - lastWidth) < 1) return;

      // Measure the natural text width at a known size. max-width would clamp
      // the measured box to the container, so lift it for the measurement.
      const fallbackSize = email.style.fontSize;
      const fallbackMax = email.style.maxWidth;
      email.style.maxWidth = "none";
      email.style.fontSize = "100px";
      const textWidth = email.getBoundingClientRect().width;
      email.style.maxWidth = fallbackMax;

      if (!textWidth) {
        email.style.fontSize = fallbackSize;
        return;
      }

      lastWidth = width;
      // Floor to two decimals so sub-pixel rounding never overflows the edge.
      const size = Math.floor((width / textWidth) * 100 * 100) / 100;
      email.style.fontSize = `${size}px`;
    };

    fit();

    const observer = new ResizeObserver(() => fit());
    observer.observe(wrap);

    const onResize = () => {
      lastWidth = 0;
      fit();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    document.fonts?.ready.then(() => {
      if (!cancelled) {
        lastWidth = 0;
        fit();
      }
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return (
    <section id="contact" className="home-contact" aria-labelledby="home-contact-heading">
      <h2 id="home-contact-heading" className="sr-only">
        Contact
      </h2>

      <div className="home-contact-top">
        <p className="home-contact-intro">{INTRO}</p>

        <div className="home-contact-socials" aria-label="Social links">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="home-contact-social"
              aria-label={social.label}
            >
              <svg viewBox={social.icon.viewBox ?? "0 0 24 24"} aria-hidden="true">
                <path d={social.icon.d} fill="currentColor" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <div ref={wrapRef} className="home-contact-email-wrap">
        <a ref={emailRef} href={`mailto:${CONTACT_EMAIL}`} className="home-contact-email">
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}
