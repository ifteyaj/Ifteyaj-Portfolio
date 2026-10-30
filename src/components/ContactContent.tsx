"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { contactContent, contactSocials } from "@/data/contact";
import { siteConfig } from "@/data/site";
import ContactForm, { type ContactStatus } from "@/components/ContactForm";

const RESUME_HREF =
  "https://drive.google.com/file/d/1FrO_WGZ_RXZvE894trR2sm_1kpdQR6wC/view?usp=sharing";

const PHONE_HREF = `tel:+880${siteConfig.phone.replace(/^0/, "")}`;

export default function ContactContent() {
  const rootRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const copyTimerRef = useRef<number | null>(null);

  const handleEmailClick = useCallback(() => {
    try {
      navigator.clipboard?.writeText(siteConfig.email);
    } catch {
      /* Clipboard can be blocked; the mailto: link still works. */
    }
    setCopied(true);
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopied(false), 1200);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Move focus to the confirmation so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (status === "success") statusRef.current?.focus();
  }, [status]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const headline = root.querySelector<HTMLElement>(".contact-headline");
    const email = root.querySelector<HTMLElement>(".contact-email");
    const subheading = root.querySelector<HTMLElement>(".contact-subheading");
    const fields = root.querySelectorAll<HTMLElement>(".contact-field");
    const submit = root.querySelector<HTMLElement>(".contact-submit-row");
    const info = root.querySelectorAll<HTMLElement>(".contact-info-col");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      [headline, email, subheading, submit].forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
      gsap.set(fields, { opacity: 1, y: 0 });
      gsap.set(info, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const reveal = (
        target: Element | Element[] | NodeListOf<HTMLElement> | null,
        delay: number,
        stagger = 0
      ) => {
        if (!target) return;
        gsap.fromTo(
          target,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            delay,
            ease: "texttshow",
            ...(stagger ? { stagger } : {}),
          }
        );
      };

      reveal(headline, 0);
      reveal(email, 0.1);
      reveal(subheading, 0.18);
      reveal(fields, 0.26, 0.06);
      reveal(submit, 0.5);
      reveal(info, 0.58, 0.06);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="contact-body" aria-labelledby="contact-heading">
      <div className="contact-grid">
        <div className="contact-lead">
          <h1 id="contact-heading" className="contact-headline">
            {contactContent.headline}
          </h1>
          <a
            className="contact-email"
            href={`mailto:${siteConfig.email}`}
            onClick={handleEmailClick}
          >
            {siteConfig.email}
            {copied && (
              <span className="contact-copied" aria-live="polite">
                copied
              </span>
            )}
          </a>
        </div>

        {status !== "success" && (
          <ContactForm status={status} onStatusChange={setStatus} />
        )}

        <div className="contact-submit-row">
          {status === "success" ? (
            <p
              className="contact-form-status contact-form-status--success"
              ref={statusRef}
              tabIndex={-1}
              aria-live="polite"
            >
              Thank you. I&apos;ll reply soon.
            </p>
          ) : (
            <>
              <button
                className="contact-submit"
                type="submit"
                form="contact-form"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Submit"}
                <svg
                  className="contact-submit-arrow"
                  viewBox="0 0 40 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M0 8h37M31 2l7 6-7 6" strokeLinecap="square" />
                </svg>
              </button>
              <p className="contact-privacy">
                By sending this form you agree that I use your details only to reply to you.
              </p>
              <p
                className="contact-form-status"
                ref={statusRef}
                tabIndex={-1}
                aria-live="polite"
              >
                {status === "error" && (
                  <>
                    Something went wrong. Please try again or email me directly at{" "}
                    <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
                  </>
                )}
              </p>
            </>
          )}
        </div>

        <div className="contact-info">
          <div className="contact-info-col">
            <p className="contact-info-label">Find us</p>
            <ul className="contact-info-values">
              {contactSocials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
                  Resume
                </a>
              </li>
            </ul>
          </div>

          <div className="contact-info-col">
            <p className="contact-info-label">{siteConfig.location}</p>
            <ul className="contact-info-values">
              <li>
                <a href={PHONE_HREF}>{siteConfig.phone}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
