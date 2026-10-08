/* Optional maintainer utility: refresh static guide tables from the real data files.
   Built-in Node modules only. No game startup, DOM, network, player saves or dependencies. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..'), arcade = { validators: {} };
const context = vm.createContext({ Arcade: arcade, window: { Arcade: arcade } });
for (const file of ['00-core.js','01-world.js','03-talents-abilities.js','07-dungeons.js','08-inventory-quests.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,'games/realmbound/js',file),'utf8'), context, {filename:file});
}
// The normal Sanctum zone is assigned by the existing dungeon runner, not its original definition.
const runners = fs.readFileSync(path.join(root,'games/realmbound/js/09-dungeon-runs.js'),'utf8');
vm.runInContext(runners.split('\n').find(line => line.startsWith('Object.assign(SANCTUM,')), context);
const data = vm.runInContext('({FACTIONS,RACES,CLASSES,TALENTS,ZONES,DUNGEONS,ADDONS:ADDONS.map(({name,req,desc})=>({name,req,desc}))})',context);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table = (heads, rows) => '\n<table><thead><tr>' + heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('') + '</tr></thead><tbody>' + rows.map(row=>'<tr>'+row.map(cell=>`<td>${esc(cell)}</td>`).join('')+'</tr>').join('\n') + '</tbody></table>\n';
const regions = ids => table(['Place','Level band','Hubs'], ids.map(id=>{const z=data.ZONES[id];return [z.name,z.lv.join('–'),typeof z.hub === 'string' ? z.hub : [...new Set(Object.values(z.hub))].join(' / ')];}));
const blocks = {
  people: table(['People','Faction','Racial bonus'],Object.values(data.RACES).map(r=>[r.name,data.FACTIONS[r.faction].name,r.bonus])),
  classes: table(['Class and role','Rhythm','Talent trees'],Object.entries(data.CLASSES).map(([id,c])=>[c.name+' · '+c.role,c.desc,data.TALENTS[id].map(t=>t.tree).join(' / ')])),
  places: regions(['thornvale','redsand','fens','ashen','frostmere']),
  late: regions(['barrowfield','hollowcrown','crownheart']),
  dungeons: table(['Dungeon','Entry level / region','Bosses'],Object.values(data.DUNGEONS).map(d=>[d.name,d.minLvl+' · '+data.ZONES[d.zone].name,d.enc.filter(e=>e.boss).map(e=>e.name).join(' → ')])),
  addons: table(['Addon','Earn it by','What it does'],data.ADDONS.map(a=>[a.name,a.req,a.desc]))
};
const target = path.join(root,'guides/realmbound.html'), source = fs.readFileSync(target,'utf8');
// Git's Windows checkout can use CRLF; line endings alone do not make data stale.
const before = source.replace(/\r\n/g, '\n');
let after = before;
for (const [id,html] of Object.entries(blocks)) {
  const start=`<!-- GENERATED:${id}:start -->`,end=`<!-- GENERATED:${id}:end -->`,from=after.indexOf(start),to=after.indexOf(end);
  if(from<0||to<from)throw Error('Missing guide markers: '+id);
  after=after.slice(0,from+start.length)+html+after.slice(to);
}
if (process.argv.includes('--check')) {
  if (after !== before) { console.error('Realmbound guide tables are stale. Run node scripts/update-realmbound-guide.cjs'); process.exitCode=1; }
  else console.log('PASS: Realmbound guide tables match current game data.');
} else { fs.writeFileSync(target,source.includes('\r\n') ? after.replace(/\n/g, '\r\n') : after);console.log('Updated Realmbound guide tables.'); }
