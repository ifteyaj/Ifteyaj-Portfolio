/**
 * Phase 0.3 & 0.4 — Metrics collection + media-query overlap analysis
 * Run with: npx playwright test tests/phase0-metrics.spec.ts --reporter=list
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const OUT = '/Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/responsive/before';

// All viewports from the matrix
const viewports: { name: string; w: number; h: number; dpr: number }[] = [
  // Phones portrait
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
  // Phones landscape
  { name: 'phoneL-667x375', w: 667, h: 375, dpr: 2 },
  { name: 'phoneL-844x390', w: 844, h: 390, dpr: 2 },
  { name: 'phoneL-932x430', w: 932, h: 430, dpr: 2 },
  // Tablets
  { name: 'tablet-600x960', w: 600, h: 960, dpr: 2 },
  { name: 'tablet-768x1024', w: 768, h: 1024, dpr: 2 },
  { name: 'tablet-810x1080', w: 810, h: 1080, dpr: 2 },
  { name: 'tablet-820x1180', w: 820, h: 1180, dpr: 2 },
  { name: 'tablet-834x1194', w: 834, h: 1194, dpr: 2 },
  { name: 'tablet-1024x768', w: 1024, h: 768, dpr: 2 },
  { name: 'tablet-1024x1366', w: 1024, h: 1366, dpr: 2 },
  { name: 'tablet-1180x820', w: 1180, h: 820, dpr: 2 },
  // Desktops
  { name: 'desktop-1280x720', w: 1280, h: 720, dpr: 1 },
  { name: 'desktop-1366x768', w: 1366, h: 768, dpr: 1 },
  { name: 'desktop-1440x900', w: 1440, h: 900, dpr: 1 },
  { name: 'desktop-1536x864', w: 1536, h: 864, dpr: 1 },
  { name: 'desktop-1920x1080', w: 1920, h: 1080, dpr: 1 },
  { name: 'desktop-2560x1440', w: 2560, h: 1440, dpr: 1 },
];

test.describe('Phase 0 — Metrics', () => {
  test.setTimeout(300_000);

  test('collect rem and overflow metrics at every viewport', async ({ browser }) => {
    const metrics: Record<string, unknown>[] = [];

    for (const vp of viewports) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: vp.dpr,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();

      // Just test on the home page for rem + overflow
      await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForFunction(
        () => {
          const l = document.querySelector('.frontpage-loader');
          if (!l) return true;
          const s = getComputedStyle(l);
          return s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0';
        },
        { timeout: 15000 },
      ).catch(() => {});
      await page.waitForTimeout(500);

      const data = await page.evaluate(() => {
        const html = document.documentElement;
        const cs = getComputedStyle(html);
        return {
          htmlFontSize: cs.fontSize,
          htmlFontSizePx: parseFloat(cs.fontSize),
          scrollWidth: html.scrollWidth,
          clientWidth: html.clientWidth,
          hasOverflow: html.scrollWidth > html.clientWidth,
          overflowAmount: html.scrollWidth - html.clientWidth,
        };
      });

      metrics.push({
        viewport: vp.name,
        width: vp.w,
        height: vp.h,
        dpr: vp.dpr,
        ...data,
      });

      await ctx.close();
    }

    // Write metrics
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(
      path.join(OUT, 'metrics.json'),
      JSON.stringify(metrics, null, 2),
    );

    console.log('\n=== REM TABLE ===');
    console.log('Viewport           | Width | Height |  Rem (px) | Overflow');
    console.log('-------------------|-------|--------|-----------|--------');
    for (const m of metrics) {
      const name = String(m.viewport).padEnd(19);
      const w = String(m.width).padStart(5);
      const h = String(m.height).padStart(6);
      const rem = Number(m.htmlFontSizePx).toFixed(2).padStart(9);
      const overflow = m.hasOverflow ? `YES (+${m.overflowAmount}px)` : 'No';
      console.log(`${name}| ${w} | ${h} | ${rem} | ${overflow}`);
    }
  });

  test('verify 1023/1024/1025 overlap', async ({ browser }) => {
    // Test at boundary widths to see which media queries apply
    const boundaries = [
      { w: 1023, h: 768, name: '1023px' },
      { w: 1024, h: 768, name: '1024px' },
      { w: 1025, h: 768, name: '1025px' },
      { w: 767, h: 1024, name: '767px' },
      { w: 768, h: 1024, name: '768px' },
    ];

    for (const b of boundaries) {
      const ctx = await browser.newContext({
        viewport: { width: b.w, height: b.h },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();
      await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);

      const data = await page.evaluate(() => {
        const html = document.documentElement;
        const cs = getComputedStyle(html);
        // Check which tier rules apply by looking at specific selectors
        const navGooey = document.querySelector('.nav-gooey');
        const navToggle = document.querySelector('.nav-menu-toggle');
        const navGroups = document.querySelector('.nav-groups');

        return {
          htmlFontSize: cs.fontSize,
          // nav-gooey is display:none on <=1024 (line 4324)
          navGooeyDisplay: navGooey ? getComputedStyle(navGooey).display : 'N/A',
          // nav-menu-toggle is display:inline-flex on <=767 (line 3014), display:inline-flex on <=1024 (line 4329)
          navToggleDisplay: navToggle ? getComputedStyle(navToggle).display : 'N/A',
          // nav-groups is display:none on <=767 (line 3027)
          navGroupsDisplay: navGroups ? getComputedStyle(navGroups).display : 'N/A',
        };
      });

      console.log(`\n=== ${b.name} (${b.w}x${b.h}) ===`);
      console.log(`  html font-size: ${data.htmlFontSize}`);
      console.log(`  .nav-gooey display: ${data.navGooeyDisplay}`);
      console.log(`  .nav-menu-toggle display: ${data.navToggleDisplay}`);
      console.log(`  .nav-groups display: ${data.navGroupsDisplay}`);

      await ctx.close();
    }
  });
});
