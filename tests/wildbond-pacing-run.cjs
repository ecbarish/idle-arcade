/* Optional diagnostic runner. Uses an existing Node/Playwright/Chrome installation;
   never installs dependencies and never uses your browser profile or player save.
   Start serve.ps1 first; run from the repository root with node tests/wildbond-pacing-run.cjs.
   PACE_URL (localhost only), PACE_CHROME, PACE_OUTPUT, PACE_JOURNEYS, PACE_MODES override defaults. */
const { chromium } = require('playwright');
const fs = require('fs');
const url = process.env.PACE_URL || 'http://localhost:8765/games/wildbond/';
if (new URL(url).hostname !== 'localhost') throw Error('Diagnostic runs require a localhost server.');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PACE_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const source = fs.readFileSync('tests/wildbond-pacing.js', 'utf8');
  const results = [];
  try {
    for (const journey of (process.env.PACE_JOURNEYS || 'breezy,classic,long').split(',')) {
      for (const mode of (process.env.PACE_MODES || 'normal,nuzlocke,randomizer,solo,hardcore').split(',')) {
        const context = await browser.newContext();
        try {
          await context.addInitScript(() => {
            let seed = 42;
            Math.random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
            window.setInterval = window.setTimeout = () => 0;
            const raf = requestAnimationFrame.bind(window);
            window.requestAnimationFrame = fn => fn.name === 'frame' ? 0 : raf(fn);
          });
          await context.route('https://fonts.googleapis.com/**', route => route.fulfill({body: '', contentType: 'text/css'}));
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.goto(url);
          await page.evaluate(code => window.eval(code + '\nsfx=()=>{};toast=()=>{};save=()=>{};slog=()=>{};bline=()=>{};renderAll=()=>{};recolor=()=>{};'), source);
          await page.evaluate(([j,m]) => window.eval(`pacingStart(${JSON.stringify(j)},${JSON.stringify(m)})`), [journey,mode]);
          let result, bucket = -1;
          do {
            result = await page.evaluate(() => window.eval('pacingChunk(18000,240)'));
            const next = Math.floor(result.hours / 5);
            if (next !== bucket || result.end) {
              bucket = next;
              console.log(JSON.stringify({journey,mode,hours:+result.hours.toFixed(2),stage:result.stage,badges:result.badges.length,levels:result.team.map(c=>c.lvl),losses:result.losses,end:result.end}));
            }
          } while (!result.end);
          if (errors.length) throw Error(errors.join('\n'));
          results.push(result);
          fs.writeFileSync(process.env.PACE_OUTPUT || 'wildbond-pacing-results.json', JSON.stringify(results,null,2) + '\n');
        } finally { await context.close(); }
      }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
