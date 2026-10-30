import { NextResponse } from "next/server";
import { contactSubjects } from "@/data/contact";

export const runtime = "nodejs";

/* ── Limits ───────────────────────────────────────────────────────────────── */

const LIMITS = { name: 100, email: 254, company: 100, message: 2000 } as const;

/* ── Best-effort IP rate limit ────────────────────────────────────────────────
   In-memory and therefore per-instance: on serverless every cold start gets a
   fresh map, and concurrent instances do not share it. It stops casual abuse
   (one client hammering the form) but it is NOT a strict limit. A durable
   limiter (Upstash Redis or Vercel KV) is the real fix — not added here. */

const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 } as const;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Housekeeping so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function trimTo(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/* ── Route ─────────────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  let payload: Record<string, unknown> | null = null;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: look successful, send nothing.
  if (trimTo(payload.website, 200)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = trimTo(payload.name, LIMITS.name);
  const email = trimTo(payload.email, LIMITS.email);
  const company = trimTo(payload.company, LIMITS.company);
  const subject = trimTo(payload.subject, 100);
  const message = trimTo(payload.message, LIMITS.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please fill in this field.";
  if (!contactSubjects.includes(subject as never)) errors.subject = "Please fill in this field.";
  if (!email) errors.email = "Please fill in this field.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";
  if (!message) errors.message = "Please fill in this field.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Never crash the build or the page: the client shows its error state with
    // a mailto: fallback.
    return NextResponse.json({ error: "Email is not configured." }, { status: 503 });
  }

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Subject", subject],
  ];

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 16px;font-size:18px">New contact message</h2>
      <table style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:2px 16px 2px 0;color:#666">${escapeHtml(label)}</td><td style="padding:2px 0">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin:16px 0 0;font-size:14px;color:#666">Message</p>
      <p style="margin:4px 0 0;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Contact form — ${subject}`,
        html,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\nSubject: ${subject}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      // Never log the payload: it contains the sender's address and message.
      return NextResponse.json({ error: "Could not send the message." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Could not send the message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
