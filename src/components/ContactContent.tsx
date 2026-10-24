"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { contactContent, contactSocials } from "@/data/contact";

export default function ContactContent() {
  const rootRef = useRef<HTMLElement>(null);
  const [copiedHref, setCopiedHref] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const handleEmailClick = (href: string, text: string) => {
    if (!href.startsWith("mailto:")) return;
    try {
      navigator.clipboard?.writeText(text);
    } catch {}
    setCopiedHref(href);
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopiedHref(null), 1200);
  };

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const headline = root.querySelector<HTMLElement>(".contact-headline");
    const intro = root.querySelector<HTMLElement>(".contact-intro");
    const info = root.querySelectorAll<HTMLElement>(".contact-info-block");
    const image = root.querySelector<HTMLElement>(".contact-image-wrap");
    const socials = root.querySelectorAll<HTMLElement>(".contact-socials a");

    if (reduced) {
      [headline, intro, image].forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
      gsap.set(info, { opacity: 1, y: 0 });
      gsap.set(socials, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (headline)
        gsap.fromTo(headline, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "texttshow" });
      if (intro)
        gsap.fromTo(intro, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.12, ease: "texttshow" });
      if (info.length)
        gsap.fromTo(info, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, delay: 0.22, ease: "texttshow" });
      if (image)
        gsap.fromTo(image, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, delay: 0.46, ease: "texttshow" });
      if (socials.length)
        gsap.fromTo(socials, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.58, ease: "texttshow" });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="contact-body" aria-labelledby="contact-heading">
      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-left">
            <h1 id="contact-heading" className="contact-headline">
              {contactContent.headline}
            </h1>
            <p className="contact-intro">{contactContent.intro}</p>

            <nav className="contact-socials" aria-label="Social links">
              {contactSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                >
                  {social.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="contact-right">
            <div className="contact-info-grid">
              {contactContent.infoBlocks.map((block) => (
                <div key={block.label} className="contact-info-block">
                  <span className="contact-info-label">{block.label}</span>
                  <div className="contact-info-values">
                    {block.values.map((value, i) => {
                      const key = `${block.label}-${i}`;
                      const href = "href" in value ? value.href : undefined;
                      if (href) {
                        return (
                          <a
                            key={key}
                            href={href}
                            className="contact-info-link"
                            onClick={() => handleEmailClick(href, value.text)}
                            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            {value.text}
                            {copiedHref === href && (
                              <span className="contact-copied" aria-live="polite">copied</span>
                            )}
                          </a>
                        );
                      }
                      return (
                        <span key={key} className="contact-info-value">
                          {value.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-image-wrap">
              <Image
                src={contactContent.image.src}
                alt={contactContent.image.alt}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 66vw, 66vw"
                priority
                className="contact-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
