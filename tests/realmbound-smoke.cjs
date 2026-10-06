// Run a local server on :8765, then: node tests/realmbound-smoke.cjs
// Requires Playwright with Chromium installed (no game build step required).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:8765/games/realmbound/');
    await page.waitForFunction(() => window.__rb);
    const result = await page.evaluate(require('./realmbound-scenarios.cjs'));
    await page.reload();await page.waitForFunction(()=>window.__rb&&window.__rb.S.cur);
    assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].drecords.foundry.best),0);
    assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].dun.id),'sanctum');
    if(await page.locator('#sheet [data-act="close"]').isVisible())await page.locator('#sheet [data-act="close"]').click();
    await page.locator('[data-act="leavedun"]').first().click();
    await page.locator('[data-act="zone"][data-arg="ashen"]').click();
    await page.locator('[data-act="tab"][data-arg="friends"]').click();
    await page.locator('[data-act="lfg"][data-arg="foundry"]').click();
    assert.match(await page.locator('#sheet').innerText(),/Cindervein Foundry/);
    await page.locator('[data-act="lfgfill"]').click();
    await page.locator('[data-act="lfgenter"]').click();
    await page.waitForFunction(()=>document.querySelector('#zoneName').textContent.includes('Cindervein Foundry'));
    await page.setViewportSize({width:390,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'mobile page overflows');
    assert.deepEqual(errors,[]);
    console.log(`${result.length+6} checks passed: migration, quests, progression, dungeon gating, save/reload, group finder, mobile layout; no browser errors.`);
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
