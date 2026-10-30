import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const OUT_DIR = "contact-redesign/after";

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 600, height: 960 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 667, height: 375 }, // landscape phone → mobile tier
  { width: 844, height: 390 }, // landscape phone → tablet tier
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

async function ready(page: Page) {
  await page.goto("/contact", { waitUntil: "load" });
  await page.waitForSelector(".contact-headline");
  // Let the reveal finish and clear the 2s submit time-trap.
  await page.waitForTimeout(2300);
}

type Metrics = {
  overflow: number;
  submitHeight: number;
  inputFontSize: number;
  labelFontSize: number;
  navGap: number;
  fieldColumns: number;
  h1Baseline: number | null;
  h2Baseline: number | null;
  submitBaseline: number | null;
  infoBaseline: number | null;
};

function measure(page: Page): Promise<Metrics> {
  return page.evaluate(() => {
    const q = (sel: string) => document.querySelector(sel) as HTMLElement | null;

    const baseline = (el: HTMLElement | null) => {
      if (!el) return null;
      const previous = el.style.display;
      if (getComputedStyle(el).display.includes("flex")) el.style.display = "inline";
      const probe = document.createElement("span");
      probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
      el.insertBefore(probe, el.firstChild);
      const y = probe.getBoundingClientRect().bottom;
      probe.remove();
      el.style.display = previous;
      return y;
    };

    const fields = q(".contact-fields")!;
    const columns = getComputedStyle(fields).gridTemplateColumns.split(" ").filter(Boolean).length;
    const nav = q(".nav-bar")!.getBoundingClientRect();
    const h1 = q(".contact-headline")!.getBoundingClientRect();
    const submit = q(".contact-submit")!.getBoundingClientRect();
    const phoneLink = document.querySelectorAll(".contact-info-values a")[1] as HTMLElement | null;

    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      submitHeight: submit.height,
      inputFontSize: parseFloat(getComputedStyle(q(".contact-input")!).fontSize),
      labelFontSize: parseFloat(getComputedStyle(q(".contact-label")!).fontSize),
      navGap: h1.top - nav.bottom,
      fieldColumns: columns,
      h1Baseline: baseline(q(".contact-headline")),
      h2Baseline: baseline(q(".contact-subheading")),
      submitBaseline: baseline(q(".contact-submit")),
      infoBaseline: baseline(phoneLink),
    };
  });
}

async function fillValid(page: Page) {
  await page.fill("#contact-name", "Test Person");
  await page.selectOption("#contact-subject", "Brand identity");
  await page.fill("#contact-email", "test@example.com");
  await page.fill("#contact-message", "Hello, I would like to talk about a brand refresh.");
}

/* ── Layout contract ──────────────────────────────────────────────────────── */

test.describe("layout contract", () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const viewport of VIEWPORTS) {
    test(`${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await ready(page);
      const m = await measure(page);
      const label = `${viewport.width}x${viewport.height}`;

      await page.screenshot({ path: `${OUT_DIR}/${label}.png`, fullPage: true });

      expect(m.overflow, `${label}: horizontal overflow`).toBe(0);
      expect(m.submitHeight, `${label}: submit tap target`).toBeGreaterThanOrEqual(44);
      expect(m.labelFontSize, `${label}: label floor`).toBeGreaterThanOrEqual(11);
      expect(m.navGap, `${label}: content must clear the fixed navbar`).toBeGreaterThan(0);

      if (viewport.width < 768) {
        expect(m.inputFontSize, `${label}: 16px input floor on touch tiers`).toBeGreaterThanOrEqual(16);
        expect(m.fieldColumns, `${label}: mobile has one field column`).toBe(1);
      } else {
        expect(m.fieldColumns, `${label}: paired fields`).toBe(2);
      }

      if (viewport.width >= 1024) {
        expect(
          Math.abs((m.h1Baseline ?? 0) - (m.h2Baseline ?? 0)),
          `${label}: H1 and "Say hello" share a baseline`
        ).toBeLessThanOrEqual(2);
        expect(
          Math.abs((m.submitBaseline ?? 0) - (m.infoBaseline ?? 0)),
          `${label}: Submit sits on the info values line`
        ).toBeLessThanOrEqual(3);
      }
    });
  }
});

/* ── Behaviour ────────────────────────────────────────────────────────────── */

test.describe("form behaviour", () => {
  test("empty submit shows errors and focuses the first invalid field", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await ready(page);
    await page.click(".contact-submit");

    await expect(page.locator(".contact-error")).toHaveCount(4);
    await expect(page.locator(".contact-error").first()).toHaveText("Please fill in this field.");
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("contact-name");
    expect(await page.locator("[aria-invalid=true]").count()).toBe(4);
  });

  test("server-side field errors are surfaced and focused", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ errors: { email: "Please enter a valid email address." } }),
      })
    );
    await ready(page);
    await fillValid(page);
    await page.click(".contact-submit");

    await expect(page.locator("#contact-email-error")).toHaveText(
      "Please enter a valid email address."
    );
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("contact-email");
  });

  test("valid submit shows the success state and moves focus", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    let posted = 0;
    await page.route("**/api/contact", (route) => {
      posted += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await ready(page);
    await fillValid(page);
    await page.click(".contact-submit");

    await expect(page.locator(".contact-form-status")).toHaveText("Thank you. I'll reply soon.");
    await expect(page.locator("#contact-form")).toHaveCount(0);
    expect(posted).toBe(1);
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toBe("Thank you. I'll reply soon.");
  });

  for (const status of [500, 503]) {
    test(`${status} shows the error state, keeps values and offers mailto`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.route("**/api/contact", (route) =>
        route.fulfill({ status, contentType: "application/json", body: '{"error":"nope"}' })
      );
      await ready(page);
      await fillValid(page);
      await page.click(".contact-submit");

      await expect(page.locator(".contact-form-status")).toContainText("Something went wrong");
      await expect(page.locator(".contact-form-status a")).toHaveAttribute(
        "href",
        "mailto:ifteyaj0@gmail.com"
      );
      await expect(page.locator("#contact-name")).toHaveValue("Test Person");
      await expect(page.locator("#contact-message")).toHaveValue(
        "Hello, I would like to talk about a brand refresh."
      );
    });
  }

  test("honeypot submissions are ignored by the route", async ({ request }) => {
    // Distinct forwarded IPs keep these two requests out of the shared
    // "unknown" rate-limit bucket that other local traffic fills up.
    const spam = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.11" },
      data: {
        website: "http://spam.example",
        name: "Bot",
        email: "bot@example.com",
        subject: "Logo design",
        message: "buy things",
      },
    });
    expect(spam.status()).toBe(200);

    // The same payload without the honeypot reaches the send step, which is
    // unconfigured in this environment and answers 503.
    const genuine = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.12" },
      data: {
        name: "Human",
        email: "human@example.com",
        subject: "Logo design",
        message: "hello",
      },
    });
    expect([200, 503]).toContain(genuine.status());
    if (genuine.status() === 503) {
      expect((await genuine.json()).error).toBe("Email is not configured.");
    }
  });

  test("reduce motion leaves the form fully visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contact", { waitUntil: "load" });
    await page.waitForSelector(".contact-headline");

    const opacities = await page.$$eval(
      ".contact-headline, .contact-email, .contact-subheading, .contact-field, .contact-submit-row, .contact-info-col",
      (els) => els.map((el) => getComputedStyle(el).opacity)
    );
    expect(opacities.every((value) => value === "1")).toBe(true);
  });
});

/* ── Contrast ─────────────────────────────────────────────────────────────── */

test("contrast of every text/background pair", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  const pairs = await page.evaluate(() => {
    const parse = (value: string) => {
      const nums = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return { r: nums[0] ?? 0, g: nums[1] ?? 0, b: nums[2] ?? 0, a: nums[3] ?? 1 };
    };
    const composite = (
      fg: { r: number; g: number; b: number; a: number },
      bg: [number, number, number]
    ) => ({
      r: Math.round(fg.r * fg.a + bg[0] * (1 - fg.a)),
      g: Math.round(fg.g * fg.a + bg[1] * (1 - fg.a)),
      b: Math.round(fg.b * fg.a + bg[2] * (1 - fg.a)),
    });
    const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const channel = (c: number) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    const ratio = (
      a: { r: number; g: number; b: number },
      b: { r: number; g: number; b: number }
    ) => {
      const l1 = luminance(a);
      const l2 = luminance(b);
      const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (hi + 0.05) / (lo + 0.05);
    };

    const black = getComputedStyle(document.querySelector(".contact-page")!).backgroundColor;
    const bg = composite(parse(black), [0, 0, 0]);
    const bgTuple: [number, number, number] = [bg.r, bg.g, bg.b];

    const targets: Array<[string, string, string | null]> = [
      ["H1 headline", ".contact-headline", null],
      ["Email line", ".contact-email", null],
      ["H2 Say hello", ".contact-subheading", null],
      ["Field label", ".contact-label", null],
      ["Field text", ".contact-input", null],
      ["Field placeholder", ".contact-input", "::placeholder"],
      ["Submit", ".contact-submit", null],
      ["Privacy note", ".contact-privacy", null],
      ["Info label", ".contact-info-label", null],
      ["Info values", ".contact-info-values", null],
    ];

    const rows: Array<{ name: string; fg: string; ratio: number }> = [];
    for (const [name, selector, pseudo] of targets) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const color = getComputedStyle(el, pseudo ?? undefined).color;
      rows.push({ name, fg: color, ratio: ratio(composite(parse(color), bgTuple), bg) });
    }

    const line = getComputedStyle(document.querySelector(".contact-input")!).borderBottomColor;
    rows.push({
      name: "Field underline (UI boundary)",
      fg: line,
      ratio: ratio(composite(parse(line), bgTuple), bg),
    });

    return rows;
  });

  console.log("\n  text/background pairs on #1a1a1a");
  for (const row of pairs) {
    console.log(`   ${row.name.padEnd(30)} ${row.fg.padEnd(22)} ${row.ratio.toFixed(2)}:1`);
  }

  for (const row of pairs) {
    const boundary = row.name.includes("UI boundary");
    expect
      .soft(row.ratio, `${row.name} must reach ${boundary ? 3 : 4.5}:1`)
      .toBeGreaterThanOrEqual(boundary ? 3 : 4.5);
  }
});

/* ── Zoom ─────────────────────────────────────────────────────────────────── */

test.describe("zoom", () => {
  test("browser zoom 400% on a 1280px window", async ({ page }) => {
    // 1280 CSS px at 400% zoom = a 320 CSS px viewport.
    await page.setViewportSize({ width: 320, height: 320 });
    await ready(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBe(0);
    await expect(page.locator(".contact-submit")).toBeVisible();
  });

  test("text zoom 200% keeps labels and fields apart", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await ready(page);
    // Chrome's text-only zoom multiplies text; emulate it by doubling the
    // font-size of every text-bearing element.
    await page.addStyleTag({
      content: `.contact-headline, .contact-email, .contact-subheading, .contact-label,
                .contact-input, .contact-select, .contact-textarea, .contact-submit,
                .contact-privacy, .contact-info-label, .contact-info-values {
                  font-size: 200% !important;
                }`,
    });
    await page.waitForTimeout(300);

    const result = await page.evaluate(() => {
      const label = document.querySelector(".contact-label")!.getBoundingClientRect();
      const input = document.querySelector(".contact-input")!.getBoundingClientRect();
      return {
        overlap: label.bottom - input.top,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(result.overflow).toBe(0);
    expect(result.overlap, "label must not overlap its input").toBeLessThanOrEqual(0);
  });
});

/* ── Built HTML ───────────────────────────────────────────────────────────── */

test.describe("server-rendered markup", () => {
  test("H1, labels and title are in the HTML", async ({ request }) => {
    const response = await request.get("/contact");
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toMatch(/Let&#x27;s talk|Let's talk/);
    for (const label of ["Name", "Subject", "Company", "Email", "Message"]) {
      expect(html, `label "${label}" must be server-rendered`).toContain(`>${label}</label>`);
    }
    expect(html.match(/<h1/g) ?? []).toHaveLength(1);
    expect(html).toContain("<title>Contact — Ifteyaj Ahmed</title>");
    expect(html).toContain('rel="canonical"');
  });
});
