import { test } from '@playwright/test';

const routes = ['/', '/work', '/work/riverborn', '/about', '/blog', '/blog/designer-new-toolbox', '/contact', '/moodboard'];

const phonesP = [[320,568],[360,640],[360,740],[360,800],[375,667],[375,812],[390,844],[393,852],[412,915],[414,896],[430,932],[440,956]];
const phonesL = [[667,375],[844,390],[932,430]];
const tablets = [[600,960],[768,1024],[810,1080],[820,1180],[834,1194],[1024,768],[1024,1366],[1180,820]];
const desktops = [[1280,720],[1366,768],[1440,900],[1536,864],[1920,1080],[2560,1440]];

function dprFor(w:number,h:number){ if (w<=440) return 2; if (w<=1180) return 2; return 1; }

const cases: {name:string;vp:[number,number]}[] = [];
for (const [w,h] of phonesP) cases.push({name:`phoneP-${w}x${h}`, vp:[w,h]});
for (const [w,h] of phonesL) cases.push({name:`phoneL-${w}x${h}`, vp:[w,h]});
for (const [w,h] of tablets) cases.push({name:`tablet-${w}x${h}`, vp:[w,h]});
for (const [w,h] of desktops) cases.push({name:`desktop-${w}x${h}`, vp:[w,h]});

const OUT = '/Users/ifteyajahmed/Desktop/Ifteyaj-Portfolio/responsive/before';

test.describe('baseline', () => {
  for (const c of cases) {
    test(c.name, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: c.vp[0], height: c.vp[1] }, deviceScaleFactor: dprFor(c.vp[0],c.vp[1]) });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const r of routes) {
        await page.goto('http://localhost:3000'+r, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => { const l = document.querySelector('.frontpage-loader'); return !l || getComputedStyle(l).display === 'none'; }, { timeout: 10000 }).catch(()=>{});
        await page.waitForTimeout(500);
        const safe = r.replace(/\//g,'_') || 'home';
        await page.screenshot({ path: `${OUT}/${c.name}${safe}.png`, fullPage: true });
      }
      await ctx.close();
    });
  }
});
