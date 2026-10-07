// Dev dependency: Playwright only. Serve the repository root, then run this file.
// REALMBOUND_TEST_URL defaults to http://localhost:8765; REALMBOUND_BROWSER_PATH is optional.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.REALMBOUND_TEST_URL||'http://localhost:8765';
(async()=>{const browser=await chromium.launch({...(process.env.REALMBOUND_BROWSER_PATH?{executablePath:process.env.REALMBOUND_BROWSER_PATH}:{}),headless:true,args:['--no-sandbox']});try{
const page=await browser.newPage({viewport:{width:1365,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await page.goto(base+'/tests/run.html');await page.getByRole('button',{name:'Run checks'}).click();await page.waitForFunction(()=>/^(PASS|FAIL)/.test(document.querySelector('#summary').textContent));
const summary=await page.locator('#summary').textContent();assert.match(summary,/^PASS/);console.log(summary);
await page.goto(base+'/games/realmbound/');await page.waitForFunction(()=>window.__rb);
for(const faction of ['concord','wild']){
 await page.evaluate(f=>{const rb=window.__rb,h=rb.newHero('Winterwalker',f,f==='concord'?'human':'grishar','hunter');h.lvl=27;h.zone='ashen';rb.S.chars=[h];rb.S.cur=h.id;rb.boot();},faction);
 await page.locator('[data-act="zone"][data-arg="frostmere"]').click();assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].zone),'ashen');
 await page.evaluate(()=>{window.__rb.S.chars[0].lvl=28;window.__rb.boot();});
 await page.locator('[data-act="zone"][data-arg="frostmere"]').click();assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].zone),'frostmere');
 assert.ok((await page.locator('#zoneLore').textContent()).includes('lit window'));
 // Reconstitute a save using the pre-chapter schema and level cap; real reload enters current boot/load.
 await page.evaluate(()=>{const rb=window.__rb,h=rb.S.chars[0];h.lvl=30;h.zone='ashen';h.xp=0;h.quests={active:[],done:{a10:true},prog:{},rewards:{}};h.drecords={foundry:{clears:1,best:0,runs:1}};rb.boot();rb.save();});
 await page.reload();await page.waitForFunction(()=>window.__rb&&window.__rb.S.chars.length);
 assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].lvl),30);
 assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].quests.done.a10),true);
 assert.equal(await page.evaluate(()=>window.__rb.dungeonStats('foundry').best),0);
 await page.locator('[data-act="zone"][data-arg="frostmere"]').click();
 await page.locator('[data-act="accept"][data-arg="fm1"]').click();
 // Generated level-30 uncommon quest gear; no combat-stat override. Existing companion party.
 const fight=await page.evaluate(()=>{const rb=window.__rb,h=rb.S.chars[0];for(const slot of SLOTS)h.gear[slot]=genItem(30,2,slot,{cls:h.cls});h.party=h.npcs.slice(0,4).map(n=>n.id);h.mode='auto';rb.boot();rb.spawn();const start=h.stats.kills;let secs=0;while(rb.C.phase==='fight'&&secs<240){rb.step(.1);secs+=.1;}updateWorld();return {phase:rb.C.phase,secs:Math.round(secs),kills:h.stats.kills-start,progress:h.quests.prog.fm1,hp:rb.C.hp};});
 assert.equal(fight.kills,1,JSON.stringify(fight));assert.equal(fight.progress,1);console.log(faction+' actual opening combat: '+JSON.stringify(fight));
 // Use actual loot action where applicable; elite always guarantees equipment loot below.
 if(await page.locator('[data-act="loot"]').count()&&await page.locator('[data-act="loot"]').first().isVisible())await page.locator('[data-act="loot"]').first().click();
 for(const tab of await page.locator('[data-act="tab"]').all())await tab.click();
 await page.locator('[data-act="tab"][data-arg="quests"]').click();
 const elite=await page.evaluate(()=>{const rb=window.__rb,h=rb.S.chars[0];h.lvl=40;h.zone='frostmere';h.grind='hushfang';h.quests.active=['fm10'];h.quests.prog.fm10=0;for(const slot of SLOTS)h.gear[slot]=genItem(40,2,slot,{cls:h.cls});rb.boot();rb.spawn();let secs=0;while(rb.C.phase==='fight'&&secs<240){rb.step(.1);secs+=.1;}updateWorld();return {phase:rb.C.phase,secs:Math.round(secs),progress:h.quests.prog.fm10,loot:rb.C.loot?.items.length};});
 assert.equal(elite.progress,1,JSON.stringify(elite));assert.equal(elite.phase,'loot');assert.ok(elite.loot>=1);console.log(faction+' actual elite combat: '+JSON.stringify(elite));
 await page.locator('[data-act="loot"]').click();
 await page.locator('[data-act="turnin"][data-arg="fm10:0"]').click();
 await page.evaluate(()=>{const rb=window.__rb,h=rb.S.chars[0];h.grind='driftcat';h.quests.active=[];rb.boot();rb.spawn();rb.startTame();rb.finishTame();rb.save();});
 await page.reload();await page.waitForFunction(()=>window.__rb&&window.__rb.S.chars.length);
 assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].zone),'frostmere');assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].pets[0].family),'cat');assert.equal(await page.evaluate(()=>window.__rb.S.chars[0].quests.done.fm10),true);

}
assert.deepEqual(errors,[]);console.log('PASS: both faction travel gates, level-30 save loading, generated-gear combat, quest progress, elite loot/turn-in, all tabs, taming and save/reload; zero console errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
