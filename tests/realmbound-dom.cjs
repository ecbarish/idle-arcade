// Dependency: jsdom. Run: node tests/realmbound-dom.cjs
const {JSDOM}=require('jsdom');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'games/realmbound/index.html'),'utf8');
const engine=fs.readFileSync(path.join(root,'shared/engine.js'),'utf8');
const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
function create(saved){
  const dom=new JSDOM(html,{url:'http://localhost:8765/games/realmbound/',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;
  w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{}});
  w.requestAnimationFrame=()=>0;w.setInterval=()=>0;w.setTimeout=()=>0;w.matchMedia=()=>({matches:false,addEventListener(){}});
  if(saved)w.localStorage.setItem('realmbound-save-v1',saved);
  w.eval(engine);w.eval(script);return dom;
}
const dom=create();
try {
  const w=dom.window;
  const checks=w.eval('('+require('./realmbound-scenarios.cjs').toString()+')()');
  const saved=w.localStorage.getItem('realmbound-save-v1');
  const restored=create(saved);
  try{
    const w=restored.window;
    assert.equal(w.__rb.S.chars[0].drecords.foundry.best,0);
    assert.equal(w.__rb.S.chars[0].dun.id,'sanctum');
    const click=s=>{const el=w.document.querySelector(s);assert.ok(el,s);el.click();};
    w.document.querySelector('#sheet [data-act="close"]')?.click();
    click('[data-act="leavedun"]');
    click('[data-act="zone"][data-arg="ashen"]');
    click('[data-act="tab"][data-arg="friends"]');
    click('[data-act="lfg"][data-arg="foundry"]');
    assert.match(w.document.querySelector('#sheet').textContent,/Cindervein Foundry/);
    click('[data-act="lfgfill"]');click('[data-act="lfgenter"]');
    assert.equal(w.__rb.S.chars[0].dun.id,'foundry');
    assert.match(w.document.querySelector('#zoneName').textContent,/Cindervein Foundry/);
    console.log(`${checks.length+5} checks passed: migration, quest chains, levels, dungeon gates, encounter selection, save/reload and DOM group-finder interactions.`);
  }finally{restored.window.close();}
}finally{dom.window.close();}
