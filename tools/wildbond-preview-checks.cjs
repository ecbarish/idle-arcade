// Review the shipped WASM engine and release PCK through real browser inputs.
// FS exposure and fixture preloading are Playwright response overrides only;
// neither is written into the game shell, engine, scripts or exported pack.
const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'preview-review');
fs.mkdirSync(path.join(out, 'screens'), { recursive: true });
const report = { checks: [], consoles: [], screenshots: [] };
const check = (ok, label) => { assert(ok, label); report.checks.push(label); console.log('PASS ' + label); };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

async function open(browser, size, fixture, before = false) {
  const context = await browser.newContext({ viewport: size });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => {
    const line = msg.text();
    report.consoles.push({ type: msg.type(), line });
    if (/SCRIPT ERROR|Parse Error|Failed to load script|Aborted\(/.test(line)) errors.push(line);
  });
  await page.route('**/play/wildbond/index.js', route => {
    const source = fs.readFileSync(path.join(root, 'play/wildbond/index.js'), 'utf8');
    assert(source.includes('var FS={'), 'Engine filesystem declaration found');
    route.fulfill({ contentType: 'text/javascript', body: source.replace('var FS={', 'var FS=globalThis.__reviewFS={') });
  });
  await page.route('**/play/wildbond/', route => {
    let source = fs.readFileSync(path.join(root, 'play/wildbond/index.html'), 'utf8');
    let hook = 'window.__reviewEngine = engine;';
    if (fixture) hook += `engine.preloadFile(new TextEncoder().encode(${JSON.stringify(JSON.stringify(fixture))}), '/userfs/journey.json');`;
    source = source.replace('const engine = new Engine(GODOT_CONFIG);', 'const engine = new Engine(GODOT_CONFIG);' + hook);
    assert(source.includes('__reviewEngine'), 'Review override attached to exported shell');
    route.fulfill({ contentType: 'text/html', body: source });
  });
  if (before) await page.route('**/play/wildbond/index.pck', route => route.fulfill({ path: process.env.BEFORE_PACK, contentType: 'application/octet-stream' }));
  await page.goto(`http://127.0.0.1:${server.address().port}/play/wildbond/`);
  await page.waitForFunction(() => document.querySelector('#status').style.display === 'none', null, { timeout: 90000 });
  await page.waitForTimeout(1200);
  check(errors.length === 0, `${before ? 'previous' : 'refreshed'} web pack starts at ${size.width}×${size.height}`);
  return { context, page, errors };
}

async function shot(page, label) {
  const file = label + '.png';
  await page.screenshot({ path: path.join(out, 'screens', file) });
  report.screenshots.push(file);
}
async function press(page, key, times = 1, delay = 350) {
  for (let i = 0; i < times; i++) { await page.keyboard.press(key); await page.waitForTimeout(delay); }
}
async function readSave(page) {
  return page.evaluate(() => {
    const fs = globalThis.__reviewFS;
    function find(dir) {
      for (const name of fs.readdir(dir)) {
        if (name === '.' || name === '..') continue;
        const p = dir + '/' + name;
        if (fs.isDir(fs.stat(p).mode)) { const result = find(p); if (result) return result; }
        else if (name === 'journey.json') return JSON.parse(fs.readFile(p, { encoding: 'utf8' }));
      }
      return null;
    }
    return find('/userfs');
  });
}
async function persisted(page, test, label) {
  let save;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(500);
    save = await readSave(page);
    if (save && test(save)) { check(true, label); return save; }
  }
  throw new Error(label + ': last save ' + JSON.stringify(save));
}
async function continueJourney(page) {
  await press(page, 'Enter');
  await page.waitForTimeout(600);
  await press(page, 'Enter'); // Welcome back.
  await page.waitForTimeout(700);
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const fixtures = Object.fromEntries(['barn', 'thornwood', 'champion'].map(name => [name, JSON.parse(fs.readFileSync(path.join(out, 'fixtures', name + '.json'), 'utf8'))]));
    check(!fixtures.barn.team[0].moves && !fixtures.barn.spire && !fixtures.barn.rematches, 'fixtures were written in the pre-WD3/pre-Spire format');
    for (const size of [{ width: 667, height: 375 }, { width: 1366, height: 768 }, { width: 1920, height: 1080 }, { width: 3440, height: 1440 }]) {
      const tag = `${size.width}x${size.height}`;
      if (size.width === 667 || size.width === 1920) {
        const old = await open(browser, size, fixtures.barn, true);
        await continueJourney(old.page);
        await press(old.page, 'e');
        await shot(old.page, `before-workbench-${tag}`);
        await old.context.close();
      }
      const current = await open(browser, size, fixtures.barn);
      const { page } = current;
      await shot(page, `continue-${tag}`);
      await continueJourney(page);
      const loaded = await persisted(page, d => d.saved !== fixtures.barn.saved, 'legacy barn journey is loaded and saved by the new web game at ' + tag);
      check(loaded.map === 'barn' && loaded.x === 2 && loaded.y === 9 && loaded.bag.coins === 321 && loaded.bag.lures === 17 && loaded.team[0].sp === fixtures.barn.team[0].sp && loaded.team[0].lvl === 30, 'legacy position, satchel and creature survive at ' + tag);
      await press(page, 'e');
      await shot(page, `workbench-${tag}`);
      await press(page, 'Enter'); // First workbench button: Practice.
      await shot(page, `practice-${tag}`);
      await press(page, 'ArrowDown', 3, 120);
      await press(page, 'e', 2); // Select Pack Hunt, then rest the first old move.
      await shot(page, `practice-chosen-${tag}`);
      await press(page, 'Escape');
      await press(page, 'Escape');
      const selected = await persisted(page, d => (d.team[0].moves || []).length === 4 && d.team[0].moves.includes('packHunt'), 'a fourth move chosen through web practice saves at ' + tag);
      check(selected.bag.coins === 321 && selected.team[0].lvl === 30, 'practice preserves money and level at ' + tag);
      // Reload without fixture injection: this checks browser persistence, not a repeated preload.
      await page.unroute('**/play/wildbond/');
      await page.reload();
      await page.waitForFunction(() => document.querySelector('#status').style.display === 'none', null, { timeout: 90000 });
      await page.waitForTimeout(900);
      await continueJourney(page);
      const reloaded = await readSave(page);
      check(JSON.stringify(reloaded.team[0].moves) === JSON.stringify(selected.team[0].moves), 'chosen moves survive a browser reload at ' + tag);
      check(current.errors.length === 0, 'no script or page errors in the workbench/reload flow at ' + tag);
      await current.context.close();
    }
    const thorn = await open(browser, { width: 1366, height: 768 }, fixtures.thornwood);
    await continueJourney(thorn.page);
    const t = await persisted(thorn.page, d => d.saved !== fixtures.thornwood.saved, 'pre-expansion Thornwood save loads and autosaves in the web build');
    check(t.map === 'thornwood' && t.x === 13 && t.y === 14 && t.bag.lures === 17, 'old Thornwood map ID, coordinates and lures are preserved');
    await shot(thorn.page, 'thornwood-settlement');
    await thorn.page.keyboard.down('ArrowDown');
    await thorn.page.waitForTimeout(650);
    await thorn.page.keyboard.up('ArrowDown');
    await persisted(thorn.page, d => d.map === 'thornwood_route', 'walking south from the old settlement reaches the new Thornwood trail');
    await shot(thorn.page, 'thornwood-trail');
    check(thorn.errors.length === 0, 'Thornwood transitions without script/page errors');
    await thorn.context.close();

    const champion = await open(browser, { width: 1920, height: 1080 }, fixtures.champion);
    await continueJourney(champion.page);
    await persisted(champion.page, d => d.spire && d.spire.best === 0 && !d.spire.active, 'legacy Champion receives safe empty Spire defaults');
    await champion.page.keyboard.down('ArrowLeft');
    await champion.page.waitForTimeout(330);
    await champion.page.keyboard.up('ArrowLeft');
    await persisted(champion.page, d => d.map === 'spire', 'legacy Champion can walk into the new Lighthouse Spire');
    await shot(champion.page, 'spire-arrival');
    await champion.page.keyboard.down('ArrowLeft');
    await champion.page.waitForTimeout(2750);
    await champion.page.keyboard.up('ArrowLeft');
    await press(champion.page, 'e', 2);
    await champion.page.waitForTimeout(2500);
    await shot(champion.page, 'spire-battle');
    check(champion.errors.length === 0, 'Spire encounter has no script/page errors');
    await champion.context.close();

    const opening = await open(browser, { width: 667, height: 375 });
    const start = Date.now();
    await shot(opening.page, 'new-journey-controls');
    await press(opening.page, 'Enter', 3);
    await opening.page.waitForTimeout(6000);
    await press(opening.page, 'Enter', 4);
    await shot(opening.page, 'new-journey-register');
    await press(opening.page, 'Enter', 10, 200);
    await press(opening.page, 'Enter', 8);
    await opening.page.keyboard.down('ArrowUp');
    await opening.page.waitForTimeout(600);
    await opening.page.keyboard.up('ArrowUp');
    await opening.page.waitForTimeout(Math.max(0, 60000 - (Date.now() - start)));
    await shot(opening.page, 'new-journey-one-minute');
    await opening.page.setViewportSize({ width: 375, height: 812 });
    await opening.page.waitForTimeout(700);
    await shot(opening.page, 'phone-portrait');
    await opening.page.setViewportSize({ width: 667, height: 375 });
    await opening.page.waitForTimeout(700);
    await shot(opening.page, 'phone-rotated-back');
    check(opening.errors.length === 0, 'new journey responds for a minute and survives portrait/landscape rotation without script/page errors');
    await opening.context.close();
    console.log('WEB REVIEW PASSED: ' + report.checks.length + ' checks, ' + report.screenshots.length + ' screenshots');
  } finally {
    fs.writeFileSync(path.join(out, 'web-review.json'), JSON.stringify(report, null, 2) + '\n');
    await browser.close();
    server.close();
  }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
