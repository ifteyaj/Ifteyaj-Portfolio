/**
 * Phase 5 — Final verification: metrics + reference screenshots
 * Run with: npx playwright test tests/phase5-verify.spec.ts --reporter=list
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const OUT = '/Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/responsive/after';

const routes = [
  '/',
  '/work',
  '/work/riverborn',
  '/about',
  '/contact',
  '/moodboard',
];

// Reference viewports — must match within 1%
const references: { name: string; w: number; h: number; dpr: number; expectedRem: number }[] = [
  { name: 'mobile-390x844', w: 390, h: 844, dpr: 2, expectedRem: 15.02 },
  { name: 'tablet-820x1180', w: 820, h: 1180, dpr: 2, expectedRem: 14.76 },
  { name: 'desktop-1440x900', w: 1440, h: 900, dpr: 1, expectedRem: 13.39 },
];

// All viewports for consistency check
const viewports: { name: string; w: number; h: number; dpr: number }[] = [
  { name: 'phoneP-320x568', w: 320, h: 568, dpr: 2 },
  { name: 'phoneP-360x640', w: 360, h: 640, dpr: 2 },
  { name: 'phoneP-360x740', w: 360, h: 740, dpr: 2 },
  { name: 'phoneP-360x800', w: 360, h: 800, dpr: 2 },
  { name: 'phoneP-375x667', w: 375, h: 667, dpr: 2 },
  { name: 'phoneP-375x812', w: 375, h: 812, dpr: 2 },
  { name: 'phoneP-390x844', w: 390, h: 844, dpr: 2 },
  { name: 'phoneP-393x852', w: 393, h: 852, dpr: 2 },
  { name: 'phoneP-412x915', w: 412, h: 915, dpr: 2 },
  { name: 'phoneP-414x896', w: 414, h: 896, dpr: 2 },
  { name: 'phoneP-430x932', w: 430, h: 932, dpr: 2 },
  { name: 'phoneP-440x956', w: 440, h: 956, dpr: 2 },
  { name: 'tablet-768x1024', w: 768, h: 1024, dpr: 2 },
  { name: 'tablet-820x1180', w: 820, h: 1180, dpr: 2 },
  { name: 'tablet-1024x768', w: 1024, h: 768, dpr: 2 },
  { name: 'tablet-1024x1366', w: 1024, h: 1366, dpr: 2 },
  { name: 'desktop-1280x720', w: 1280, h: 720, dpr: 1 },
  { name: 'desktop-1440x900', w: 1440, h: 900, dpr: 1 },
  { name: 'desktop-1920x1080', w: 1920, h: 1080, dpr: 1 },
  { name: 'desktop-2560x1440', w: 2560, h: 1440, dpr: 1 },
];

async function waitForPage(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => {
      const l = document.querySelector('.frontpage-loader');
      if (!l) return true;
      const s = getComputedStyle(l);
      return s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0';
    },
    { timeout: 15000 },
  ).catch(() => {});
  await page.waitForTimeout(800);
}

test.describe('Phase 5 — Final Verification', () => {
  test.setTimeout(600_000);

  test('reference viewports: rem match ≤ 1%', async ({ browser }) => {
    for (const ref of references) {
      const ctx = await browser.newContext({
        viewport: { width: ref.w, height: ref.h },
        deviceScaleFactor: ref.dpr,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();
      await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
      await waitForPage(page);

      const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
      const delta = Math.abs(rem - ref.expectedRem) / ref.expectedRem * 100;

      console.log(`${ref.name}: ${rem}px (expected ${ref.expectedRem}px, delta ${delta.toFixed(2)}%)`);
      expect(delta).toBeLessThan(1);

      await ctx.close();
    }
  });

  test('same-width phones have identical rem', async ({ browser }) => {
    const pairs = [
      [{ w: 360, h: 640 }, { w: 360, h: 740 }, { w: 360, h: 800 }],
      [{ w: 375, h: 667 }, { w: 375, h: 812 }],
    ];

    for (const group of pairs) {
      const rems: number[] = [];
      for (const vp of group) {
        const ctx = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          deviceScaleFactor: 2,
          reducedMotion: 'reduce',
        });
        const page = await ctx.newPage();
        await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
        await waitForPage(page);
        const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
        rems.push(rem);
        console.log(`  ${vp.w}x${vp.h}: ${rem}px`);
        await ctx.close();
      }
      // All rems in the group must be identical
      for (let i = 1; i < rems.length; i++) {
        expect(rems[i]).toBe(rems[0]);
      }
    }
  });

  test('1024px boundary: no overlap', async ({ browser }) => {
    // At 1023px → tablet rules
    const ctx1023 = await browser.newContext({
      viewport: { width: 1023, height: 768 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page1023 = await ctx1023.newPage();
    await page1023.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
    await waitForPage(page1023);
    const data1023 = await page1023.evaluate(() => {
      const gooey = document.querySelector('.nav-gooey');
      return {
        rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
        navGooey: gooey ? getComputedStyle(gooey).display : 'N/A',
      };
    });
    console.log(`1023px: rem=${data1023.rem}, nav-gooey=${data1023.navGooey}`);
    expect(data1023.navGooey).toBe('none'); // Tablet → no gooey
    await ctx1023.close();

    // At 1024px → desktop rules
    const ctx1024 = await browser.newContext({
      viewport: { width: 1024, height: 768 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page1024 = await ctx1024.newPage();
    await page1024.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
    await waitForPage(page1024);
    const data1024 = await page1024.evaluate(() => {
      const gooey = document.querySelector('.nav-gooey');
      return {
        rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
        navGooey: gooey ? getComputedStyle(gooey).display : 'N/A',
      };
    });
    console.log(`1024px: rem=${data1024.rem}, nav-gooey=${data1024.navGooey}`);
    expect(data1024.navGooey).toBe('block'); // Desktop → gooey visible
    await ctx1024.close();
  });

  test('no horizontal overflow at any viewport', async ({ browser }) => {
    for (const vp of viewports) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: vp.dpr,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();
      await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
      await waitForPage(page);

      const overflow = await page.evaluate(() => {
        const html = document.documentElement;
        return html.scrollWidth > html.clientWidth;
      });

      if (overflow) {
        console.log(`⛔ OVERFLOW at ${vp.name}`);
      }
      expect(overflow).toBe(false);

      await ctx.close();
    }
  });

  test('reference screenshots (3 viewports × all routes)', async ({ browser }) => {
    fs.mkdirSync(OUT, { recursive: true });

    for (const ref of references) {
      const ctx = await browser.newContext({
        viewport: { width: ref.w, height: ref.h },
        deviceScaleFactor: ref.dpr,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();

      for (const r of routes) {
        await page.goto(BASE_URL + r, { waitUntil: 'networkidle', timeout: 30000 });
        await waitForPage(page);

        const safe = r.replace(/\//g, '_') || 'home';
        await page.screenshot({
          path: path.join(OUT, `${ref.name}${safe}.png`),
          fullPage: true,
        });
      }

      await ctx.close();
    }
  });
});
