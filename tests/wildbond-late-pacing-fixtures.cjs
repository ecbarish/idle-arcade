/* Diagnostic inputs only. No browser profile or game-save access. */
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const output=process.argv[2];if(!output)throw Error('Pass a disposable output directory.');
const c=vm.createContext({window:{Arcade:{validators:{}}},Arcade:{validators:{}},document:{}});
for(const f of ['shared/creatures.js','games/wildbond/js/00-data.js','games/wildbond/js/11-maps.js','games/wildbond/js/02-state.js','games/wildbond/js/03-battle.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f});
const browser=JSON.parse(vm.runInContext('JSON.stringify({SPECIES,MAPS,STORY,BIOMES,CAP_TABLE,JOURNEY,MOVES,ELEMENTS})',c));
const godot=JSON.parse(fs.readFileSync('wildbond-godot/data/wildbond.json','utf8'));
const evolution=JSON.parse(fs.readFileSync('wildbond-godot/data/evolution.json','utf8'));
for(const k of ['MAPS','STORY','BIOMES','CAP_TABLE','JOURNEY','MOVES','ELEMENTS'])assert.deepStrictEqual(browser[k],godot[k],k+' browser/Godot drift');
// Cosmetic and dex fields can differ. Numeric combat/evolution fields must not be assumed equal.
const speciesDrift=[];for(const [id,sp]of Object.entries(browser.SPECIES)){if(!godot.SPECIES[id]){speciesDrift.push({id,field:'missing'});continue}for(const field of ['base','learn','evo','el','fam'])if(JSON.stringify(sp[field])!==JSON.stringify(godot.SPECIES[id][field]))speciesDrift.push({id,field});}
assert.equal(speciesDrift.length,0,'Exported species combat drift: '+JSON.stringify(speciesDrift));
const fixtures=[];for(const lvl of [44,55,60,65,70,75])for(const sp of ['tidewyrm','thornback','glimmerwing'])for(const temp of ['steady','bold']){
 c.caseInput={lvl,sp,temp};fixtures.push(JSON.parse(JSON.stringify(vm.runInContext(`(()=>{const {lvl,sp:id,temp}=caseInput;const pot=Object.fromEntries(Cr.STATS.map(k=>[k,7]));const a=Cr.make({...SPECIES[id],id},lvl,{rar:1,temp,pot,traits:['keen']});a.bond=140;const b=Cr.make({...SPECIES.blazefang,id:'blazefang'},lvl,{rar:1,temp:'steady',pot,traits:['thick']});b.bond=60;const au=unit(a,'a'),bu=unit(b,'f');bu.buff.guard=3;bu.buff.guardCmd=1;const old=Math.random;let seq=[0.5,1];Math.random=()=>seq.shift();const hit=damage(au,bu,MOVES[movesOf(a).find(m=>MOVES[m].kind==='hit')],1);Math.random=old;return {a,b,stats:au.st,xpNeed:Cr.xpNeed(lvl),move:movesOf(a).find(m=>MOVES[m].kind==='hit'),damage:hit};})()`,c))));
}
const metadata={schema:1,browserCombatTablesMatch:true,speciesCombatFieldsMatch:true,fixtureCount:fixtures.length,evolutionOverrides:Object.keys(evolution.species),fixtures};
fs.writeFileSync(path.join(output,'fixtures.json'),JSON.stringify(metadata));console.log('Browser/Godot encounter, cap, move and combat data agree; '+fixtures.length+' numeric fixtures prepared. Godot-only evolution is separate.');
