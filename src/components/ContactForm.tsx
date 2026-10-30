"use client";

import { useCallback, useRef, useState } from "react";

const SUBJECTS = [
  "Brand identity",
  "Logo design",
  "Web design",
  "Vibe coding / AI web development",
  "Something else",
] as const;

const COUNTER_FROM = 1800;

export default function ContactForm({ email }: { email: string }) {
  void email;
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [messageLength, setMessageLength] = useState(0);

  const autosize = useCallback(() => {
    const el = messageRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const onMessageInput = useCallback(() => {
    setMessageLength(messageRef.current?.value.length ?? 0);
    autosize();
  }, [autosize]);

  // Phase 2 wires validation and POST /api/contact; for now the shell keeps
  // the browser from navigating away.
  return (
    <form id="contact-form" className="contact-form" noValidate onSubmit={(e) => e.preventDefault()}>
      <h2 className="contact-subheading">Say hello</h2>

      <div className="contact-fields">
        <div className="contact-field">
          <label className="contact-label" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            className="contact-input"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            maxLength={100}
            required
          />
        </div>

        <div className="contact-field">
          <label className="contact-label" htmlFor="contact-subject">
            Subject
          </label>
          <span className="contact-select-wrap">
            <select
              id="contact-subject"
              name="subject"
              className="contact-select"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Choose subject
              </option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <svg
              className="contact-select-chevron"
              viewBox="0 0 10 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M1 1l4 4 4-4" />
            </svg>
          </span>
        </div>

        <div className="contact-field">
          <label className="contact-label" htmlFor="contact-company">
            Company
          </label>
          <input
            id="contact-company"
            name="company"
            className="contact-input"
            type="text"
            placeholder="Your company"
            autoComplete="organization"
            maxLength={100}
          />
        </div>

        <div className="contact-field">
          <label className="contact-label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            className="contact-input"
            type="email"
            inputMode="email"
            placeholder="Email address"
            autoComplete="email"
            maxLength={254}
            required
          />
        </div>

        <div className="contact-field contact-field--message">
          <label className="contact-label" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            ref={messageRef}
            className="contact-textarea"
            placeholder="Start typing here"
            rows={2}
            maxLength={2000}
            required
            onInput={onMessageInput}
          />
          {messageLength > COUNTER_FROM && (
            <p className="contact-counter">
              {messageLength} / 2000
            </p>
          )}
        </div>
      </div>

      <input
        className="contact-honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </form>
  );
}
