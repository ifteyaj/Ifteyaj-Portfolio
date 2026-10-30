"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contactSubjects } from "@/data/contact";

export type ContactStatus = "idle" | "sending" | "success" | "error";

type FieldName = "name" | "subject" | "company" | "email" | "message";
export type FieldErrors = Partial<Record<FieldName, string>>;
type Values = Record<FieldName, string>;

const COUNTER_FROM = 1800;
const MIN_FILL_TIME_MS = 2000;
const REQUIRED_MESSAGE = "Please fill in this field.";
const EMAIL_MESSAGE = "Please enter a valid email address.";

/* Deliberately conservative: something@something.tld, no spaces, no bare dots. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const FIELD_ORDER: FieldName[] = ["name", "subject", "company", "email", "message"];

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name) errors.name = REQUIRED_MESSAGE;
  if (!values.subject || !contactSubjects.includes(values.subject as never)) {
    errors.subject = REQUIRED_MESSAGE;
  }
  if (!values.email) errors.email = REQUIRED_MESSAGE;
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = EMAIL_MESSAGE;
  if (!values.message) errors.message = REQUIRED_MESSAGE;
  return errors;
}

export default function ContactForm({
  status,
  onStatusChange,
}: {
  status: ContactStatus;
  onStatusChange: (status: ContactStatus) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const mountedAt = useRef<number>(0);
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [messageLength, setMessageLength] = useState(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

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

  /** Reads live form values — used by both submit and blur validation. */
  const readValues = useCallback((): Values => {
    const form = formRef.current;
    const data = form ? new FormData(form) : null;
    return {
      name: String(data?.get("name") ?? "").trim(),
      subject: String(data?.get("subject") ?? "").trim(),
      company: String(data?.get("company") ?? "").trim(),
      email: String(data?.get("email") ?? "").trim(),
      message: String(data?.get("message") ?? "").trim(),
    };
  }, []);

  const clearError = useCallback((field: FieldName) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateOne = useCallback(
    (field: FieldName) => {
      const next = validate(readValues());
      setErrors((prev) => {
        const merged = { ...prev };
        if (next[field]) merged[field] = next[field];
        else delete merged[field];
        return merged;
      });
    },
    [readValues]
  );

  const focusFirstInvalid = useCallback((nextErrors: FieldErrors) => {
    const first = FIELD_ORDER.find((field) => nextErrors[field]);
    if (!first) return;
    fieldRefs.current[first]?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "sending") return;

      const values = readValues();
      const nextErrors = validate(values);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        focusFirstInvalid(nextErrors);
        onStatusChange("idle");
        return;
      }

      setErrors({});

      // Time trap: a person cannot fill this form in under two seconds.
      if (Date.now() - mountedAt.current < MIN_FILL_TIME_MS) return;

      onStatusChange("sending");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            website: String(new FormData(event.currentTarget).get("website") ?? ""),
          }),
        });

        if (response.ok) {
          onStatusChange("success");
          return;
        }

        if (response.status === 400) {
          const payload = (await response.json().catch(() => null)) as
            | { errors?: FieldErrors }
            | null;
          if (payload?.errors && Object.keys(payload.errors).length > 0) {
            setErrors(payload.errors);
            focusFirstInvalid(payload.errors);
            onStatusChange("idle");
            return;
          }
        }

        onStatusChange("error");
      } catch {
        onStatusChange("error");
      }
    },
    [focusFirstInvalid, onStatusChange, readValues, status]
  );

  const fieldProps = (field: FieldName) => ({
    "aria-invalid": errors[field] ? (true as const) : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  });

  return (
    <form
      id="contact-form"
      ref={formRef}
      className="contact-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <h2 className="contact-subheading">Say hello</h2>

      <div className="contact-fields">
        <div className="contact-field" data-invalid={errors.name ? "true" : undefined}>
          <label className="contact-label" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            ref={(node) => {
              fieldRefs.current.name = node;
            }}
            className="contact-input"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            maxLength={100}
            required
            {...fieldProps("name")}
            onChange={() => clearError("name")}
            onBlur={() => validateOne("name")}
          />
          {errors.name && (
            <p className="contact-error" id="contact-name-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="contact-field" data-invalid={errors.subject ? "true" : undefined}>
          <label className="contact-label" htmlFor="contact-subject">
            Subject
          </label>
          <span className="contact-select-wrap">
            <select
              id="contact-subject"
              name="subject"
              ref={(node) => {
                fieldRefs.current.subject = node;
              }}
              className="contact-select"
              defaultValue=""
              required
              {...fieldProps("subject")}
              onChange={() => clearError("subject")}
              onBlur={() => validateOne("subject")}
            >
              <option value="" disabled>
                Choose subject
              </option>
              {contactSubjects.map((subject) => (
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
          {errors.subject && (
            <p className="contact-error" id="contact-subject-error">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="contact-field" data-invalid={errors.company ? "true" : undefined}>
          <label className="contact-label" htmlFor="contact-company">
            Company
          </label>
          <input
            id="contact-company"
            name="company"
            ref={(node) => {
              fieldRefs.current.company = node;
            }}
            className="contact-input"
            type="text"
            placeholder="Your company"
            autoComplete="organization"
            maxLength={100}
            {...fieldProps("company")}
          />
          {errors.company && (
            <p className="contact-error" id="contact-company-error">
              {errors.company}
            </p>
          )}
        </div>

        <div className="contact-field" data-invalid={errors.email ? "true" : undefined}>
          <label className="contact-label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            ref={(node) => {
              fieldRefs.current.email = node;
            }}
            className="contact-input"
            type="email"
            inputMode="email"
            placeholder="Email address"
            autoComplete="email"
            maxLength={254}
            required
            {...fieldProps("email")}
            onChange={() => clearError("email")}
            onBlur={() => validateOne("email")}
          />
          {errors.email && (
            <p className="contact-error" id="contact-email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div
          className="contact-field contact-field--message"
          data-invalid={errors.message ? "true" : undefined}
        >
          <label className="contact-label" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            ref={(node) => {
              messageRef.current = node;
              fieldRefs.current.message = node;
            }}
            className="contact-textarea"
            placeholder="Start typing here"
            rows={2}
            maxLength={2000}
            required
            {...fieldProps("message")}
            onInput={onMessageInput}
            onChange={() => clearError("message")}
            onBlur={() => validateOne("message")}
          />
          {errors.message && (
            <p className="contact-error" id="contact-message-error">
              {errors.message}
            </p>
          )}
          {messageLength > COUNTER_FROM && <p className="contact-counter">{messageLength} / 2000</p>}
        </div>
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. */}
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
