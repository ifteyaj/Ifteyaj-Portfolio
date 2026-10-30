import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const routes = [
  '/',
  '/work',
  '/work/riverborn',
  '/about',
  '/blog',
  '/blog/designer-new-toolbox',
  '/contact',
  '/moodboard',
];

const phonesP: [number, number][] = [
  [320, 568], [360, 640], [360, 740], [360, 800],
  [375, 667], [375, 812], [390, 844], [393, 852],
  [412, 915], [414, 896], [430, 932], [440, 956],
];
const phonesL: [number, number][] = [
  [667, 375], [844, 390], [932, 430],
];
const tablets: [number, number][] = [
  [600, 960], [768, 1024], [810, 1080], [820, 1180],
  [834, 1194], [1024, 768], [1024, 1366], [1180, 820],
];
const desktops: [number, number][] = [
  [1280, 720], [1366, 768], [1440, 900],
  [1536, 864], [1920, 1080], [2560, 1440],
];

type ViewportEntry = {
  name: string;
  vp: [number, number];
  tier: string;
  dpr: number;
};

const cases: ViewportEntry[] = [];
for (const [w, h] of phonesP) cases.push({ name: `phoneP-${w}x${h}`, vp: [w, h], tier: 'phone', dpr: 2 });
for (const [w, h] of phonesL) cases.push({ name: `phoneL-${w}x${h}`, vp: [w, h], tier: w < 768 ? 'phone' : 'tablet', dpr: 2 });
for (const [w, h] of tablets) cases.push({ name: `tablet-${w}x${h}`, vp: [w, h], tier: w < 768 ? 'phone' : w < 1024 ? 'tablet' : 'desktop', dpr: 2 });
for (const [w, h] of desktops) cases.push({ name: `desktop-${w}x${h}`, vp: [w, h], tier: 'desktop', dpr: 1 });

const BASE = '/Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/responsive/before';

// Metrics collection
interface ViewportMetric {
  viewport: string;
  width: number;
  height: number;
  tier: string;
  htmlFontSize: string;
  htmlFontSizePx: number;
  scrollWidth: number;
  clientWidth: number;
  hasOverflow: boolean;
  route: string;
}

const allMetrics: ViewportMetric[] = [];

test.describe('Phase 0 — Baseline screenshots + metrics', () => {
  test.setTimeout(600_000); // 10 minutes for all viewports

  for (const c of cases) {
    test(`${c.name}`, async ({ browser }) => {
      const ctx = await browser.newContext({
        viewport: { width: c.vp[0], height: c.vp[1] },
        deviceScaleFactor: c.dpr,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();

      for (const r of routes) {
        await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle', timeout: 30000 });

        // Wait for loader to disappear
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

        // Collect metrics
        const metrics = await page.evaluate(() => {
          const html = document.documentElement;
          const computed = getComputedStyle(html);
          return {
            htmlFontSize: computed.fontSize,
            htmlFontSizePx: parseFloat(computed.fontSize),
            scrollWidth: html.scrollWidth,
            clientWidth: html.clientWidth,
          };
        });

        allMetrics.push({
          viewport: c.name,
          width: c.vp[0],
          height: c.vp[1],
          tier: c.tier,
          route: r,
          htmlFontSize: metrics.htmlFontSize,
          htmlFontSizePx: metrics.htmlFontSizePx,
          scrollWidth: metrics.scrollWidth,
          clientWidth: metrics.clientWidth,
          hasOverflow: metrics.scrollWidth > metrics.clientWidth,
        });

        // Screenshot
        const safe = r.replace(/\//g, '_') || 'home';
        const dir = path.join(BASE);
        fs.mkdirSync(dir, { recursive: true });
        await page.screenshot({
          path: path.join(dir, `${c.name}${safe}.png`),
          fullPage: true,
        });
      }

      await ctx.close();
    });
  }

  test.afterAll(async () => {
    // Write metrics JSON
    const metricsPath = path.join(BASE, 'metrics.json');
    fs.writeFileSync(metricsPath, JSON.stringify(allMetrics, null, 2));
  });
});
