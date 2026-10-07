'use strict';
/* R2: raids. The Hollow Throne, the first raid (docs/realmbound-40-60.md, "Raids"; decision 5 in
   docs/research/decisions.md). A raid is a dungeon run (09-dungeon-runs.js) with ten people:
   - Raiders: you plus nine from your companions (Acquaintance or better) and your other characters, who join as
     raiders at their own level. At least two tanks and two healers, counting you. "Gather the raid" picks for you.
   - Entry: the Hollow Key (the last quest of the Crown's Heart, T23) and the level cap.
   - Before each boss you choose a plan; during the pull the boss gives tells and you make raid calls (buttons, or
     S = Swap, A = Adds, Q = Spread, W = Stack). Auto makes calls too, badly at first; clearing the raid once earns
     the Raid Leader perk, and Auto's calls become reliable.
   - Lockout: a boss you kill stays dead for 3 days (its loot with it); trash comes back.
   - Loot: epics, and a five-piece set for your class (two, four and five-piece bonuses, see setT()).
   Raid levels follow the level cap (cap + 2 for bosses), so the raid already works while the cap is still 52. */
const RAID_RESET = 3 * 864e5;
const RAID_LVL = () => Math.min(60, LEVEL_CAP);
const THRONE = { name: 'The Hollow Throne', raid: true, minLvl: 60, zone: 'crownheart', sky: ['#1b1408', '#6b5a24'], hill: '#2a2414', ground: '#3a301c',
  waveName: 'Choir of Roots', surgeName: 'Throne Flame',
  enc: [
    { name: 'Thornbound Sentries', n: 4, off: 0, kind: 'humanoid', col: '#5d6b3a', hpM: 3 },
    { boss: true, name: 'The Bark Warden', off: 2, kind: 'humanoid', col: '#6e7a44', hpM: 110, dmgM: 8.4, mech: { raid: 1, shred: 9 }, loot: 2, slots: ['hands'],
      tell: 'Its blows strip the tank\'s bark-hard armour, stack by stack. Swap tanks before the stacks crush them.',
      plans: [{ n: 'Swap at three stacks', d: 'More swap calls, and a missed one hurts less.', swapAt: 3, crush: .3 },
        { n: 'Swap at five stacks', d: 'Fewer calls, but a missed swap is a crushing blow.', swapAt: 5, crush: .55 }] },
    { name: 'Ashwing Hatchlings', n: 5, off: 1, kind: 'beast', fam: 'lizard', col: '#93834b', hpM: 3 },
    { boss: true, name: 'The Ashwing Brood', off: 2, kind: 'beast', fam: 'lizard', col: '#a58c52', hpM: 110, dmgM: 7.6, mech: { raid: 1, adds: 18 }, loot: 2, slots: ['feet'],
      tell: 'Hatchlings pour from the canopy. Call the adds so the damage dealers cut them down.',
      plans: [{ n: 'Burn the brood', d: 'Damage dealers switch to the hatchlings: a missed call hurts less.', swarm: .12 },
        { n: 'Burn the mother', d: '15% more damage to the boss, but a missed call lets the brood swarm everyone.', swarm: .3, dmg: 1.15 }] },
    { name: 'Rootbound Acolytes', n: 4, off: 1, kind: 'humanoid', col: '#4f5b2e', hpM: 3 },
    { boss: true, name: 'The Rootbound Choir', off: 2, kind: 'humanoid', col: '#7d8a4e', hpM: 115, dmgM: 7.6, mech: { raid: 1, choir: 14 }, loot: 2, slots: ['legs'],
      tell: 'The Choir sings two songs: one punishes a crowd, one punishes the lonely. Spread or stack to match.',
      plans: [{ n: 'Spread by default', d: 'Spread songs handle themselves; you call Stack.', def: 'spread' },
        { n: 'Stack by default', d: 'Stack songs handle themselves; you call Spread.', def: 'stack' }] },
    { boss: true, final: true, name: 'Seraveth, the Hollow Queen', off: 3, kind: 'beast', fam: 'lizard', col: '#c6a85a', hpM: 155, dmgM: 8.4,
      mech: { raid: 1, shred: 11, adds: 26, choir: 19, enrage: 240 }, loot: 3, slots: ['chest', 'head'],
      tell: 'The matriarch uses everything her court did, and burns the throne room after four minutes.',
      plans: [{ n: 'Steady', d: 'Take 15% less damage, deal 10% less. Safe, if you beat the enrage.', taken: .85, dmg: .9, swapAt: 3, crush: .3, swarm: .15, def: 'spread' },
        { n: 'All-out', d: 'Deal 15% more damage to beat the enrage; take 10% more.', taken: 1.1, dmg: 1.15, swapAt: 4, crush: .45, swarm: .25, def: 'spread' }] }
  ] };
const RAIDS = { throne: THRONE };
const TIER = { warrior: 'Thornwarden', rogue: 'Ashstalker', mage: 'Crownseer', priest: 'Rootmother\'s', hunter: 'Broodhunter' };
const TIER_SLOT = { head: 'Crown', chest: 'Vestments', legs: 'Legwraps', hands: 'Grips', feet: 'Treads' };
const CALL = { swap: ['S', 'Swap!'], adds: ['A', 'Adds!'], spread: ['Q', 'Spread!'], stack: ['W', 'Stack!'] };

/* ---- your other characters as raiders (npc-shaped, so the party code treats them like companions) ---- */
const ALT_RAIDERS = {};
function raidAlt(id) {
  if (typeof id !== 'string' || !id.startsWith('alt')) return null;
  const c = charOf(id.slice(3)), h = H(); if (!c || !h || String(c.id) === String(h.id)) return null;
  const n = ALT_RAIDERS[id] || (ALT_RAIDERS[id] = { id, aff: 9999, met: true, notes: [], hair: '#6b4423', alt: true, pers: Object.keys(PERSONALITY)[0] });
  return Object.assign(n, { name: c.name, cls: c.cls, race: c.race, offset: c.lvl - h.lvl, role: heroRole(c) });
}
const roleOf = n => n.role || ROLE_OF[n.cls];
function raidKey(h) { h = h || H(); return !!(h.hollowKey || (h.quests && h.quests.done && h.quests.done.ch14)); }
function raidLock(h) { h = h || H(); const L = h.raidLock; if (!L || Date.now() - L.at > RAID_RESET) h.raidLock = { at: 0, killed: [] }; return h.raidLock; }
/* who could come: other characters at the cap, then companions you know, strongest first */
function raidCandidates() {
  const h = H(), need = RAID_LVL() - 2, out = [];
  for (const c of S.chars) if (String(c.id) !== String(h.id) && c.lvl >= need) out.push(raidAlt('alt' + c.id));
  for (const n of h.npcs || []) if (n.met && affLvl(n) >= 1 && npcLvl(n) >= need) out.push(n);
  return out.filter(Boolean);
}
function raidComp(ids) { const ns = ids.map(npcOf).filter(Boolean), me = heroRole(), cnt = r => ns.filter(n => roleOf(n) === r).length + (me === r ? 1 : 0); return { tank: cnt('tank'), heal: cnt('heal'), n: ns.length }; }
/* pick nine: tanks and healers first, then the strongest of the rest */
function autoRaid() {
  const pool = raidCandidates().sort((a, b) => npcLvl(b) - npcLvl(a) || b.aff - a.aff), me = heroRole(), pickd = [];
  const take = (r, k) => { for (const n of pool) if (k > 0 && roleOf(n) === r && !pickd.includes(n)) { pickd.push(n); k--; } };
  take('tank', 2 - (me === 'tank' ? 1 : 0)); take('heal', 3 - (me === 'heal' ? 1 : 0));
  for (const n of pool) if (pickd.length < 9 && !pickd.includes(n)) pickd.push(n);
  return pickd.slice(0, 9).map(n => n.id);
}
function raidProblem(ids) {
  const h = H();
  if (h.dun) return 'You are already inside a dungeon.';
  if (!raidKey(h)) return 'The Hollow Throne is sealed: it needs the Hollow Key, from the last quest of the Crown\'s Heart.';
  if (h.lvl < RAID_LVL()) return `Needs level ${RAID_LVL()}.`;
  if (ids.length !== 9 || new Set(ids).size !== 9) return `A raid needs nine others; you can gather ${raidCandidates().length}. Befriend more adventurers or bring your other characters to level ${RAID_LVL() - 2}.`;
  const c = raidComp(ids); if (c.n !== 9) return 'Someone in that raid is no longer around.';
  if (c.tank < 2) return 'A raid needs at least two tanks (counting you).';
  if (c.heal < 2) return 'A raid needs at least two healers (counting you).';
  return '';
}
function startRaid(ids) {
  ids = ids || autoRaid(); const why = raidProblem(ids); if (why) { err(why); return false; }
  const h = H(), base = RAID_LVL(); for (const e of THRONE.enc) e.lvl = base + e.off;
  h.dun = { id: 'throne', tier: 0, step: 0, mods: [], wipes: 0, raid: true, plans: {}, prev: (h.party || []).slice() };
  h.party = ids.slice(); dungeonStats('throne').runs++; syncParty(); for (const p of C.party) { p.hp = compStats(p.n).hpMax; p.dead = false; }
  C.mob = null; C.loot = null; C.enc = null; C.tell = null; C.phase = 'seek'; C.t = 4;
  const k = raidLock(h).killed.length; line(`You lead ten into ${THRONE.name}.${k ? ` ${k} of its bosses are still dead from your last raid.` : ''}`, 'l-sys'); toast(THRONE.name); sfx('warn');
  if (C.party.length) say(pick(C.party).n, 'greet');
  return true;
}
/* before a raid spawn: skip bosses still dead this lockout, and hold for a plan before each living boss */
function raidBeforeSpawn() {
  const h = H(), d = h.dun, lock = raidLock(h);
  while (THRONE.enc[d.step] && THRONE.enc[d.step].boss && lock.killed.includes(d.step)) d.step++;
  const e = THRONE.enc[d.step]; if (!e || !e.boss || d.plans[d.step] !== undefined) return false;
  C.phase = 'plan'; C.t = aiOn() ? 2 : 90;
  if (!aiOn()) openModal('raidplan', planHTML(e));
  else line(`The raid gathers before ${e.name}.`, 'l-sys');
  return true;
}
function planHTML(e) {
  return `<h2>${e.name}</h2><p class="sub">${e.tell}</p><p class="meta">Choose the plan for this pull:</p>` +
    e.plans.map((p, i) => `<div class="rowl"><div class="l"><b>${p.n}</b><div class="meta">${p.d}</div></div><div class="r"><button class="btn sm" data-act="raidplan" data-arg="${i}">Use this plan</button></div></div>`).join('');
}
function choosePlan(i) {
  const h = H(), d = h.dun; if (!d || !d.raid || C.phase !== 'plan') return;
  const e = THRONE.enc[d.step]; d.plans[d.step] = clamp(i | 0, 0, e.plans.length - 1);
  line(`Plan for ${e.name}: ${e.plans[d.plans[d.step]].n}.`, 'l-sys'); if (modalKind === 'raidplan') closeModal();
  C.phase = 'seek'; C.t = .5;
}
/* called by spawnDungeon once a raid enemy is up */
function raidSpawned(e) {
  const d = H().dun, plan = e.boss ? e.plans[d.plans[d.step] || 0] : {};
  C.mob.raidStep = d.step; C.raidDmg = plan.dmg || 1; C.raidTaken = plan.taken || 1; C.plan = plan; C.tell = null;
  const m = e.mech || {}; C.shred = 0; C.shredT = m.shred || 0; C.addsT = (m.adds || 0) * .7; C.choirT = (m.choir || 0) * .6;
}
function raidTank() { if (heroRole() === 'tank') return 'hero'; return partyAlive().find(p => roleOf(p.n) === 'tank') || null; }
/* damage to everyone as a share of their health (raid mechanics ignore armor) */
function raidHurtAll(pct, label) {
  const k = (C.raidTaken || 1) * (C.buffs.painsup ? .6 : 1);
  for (const p of partyAlive()) { const mx = compStats(p.n).hpMax; p.hp -= mx * pct * k; if (p.hp <= 0) { p.hp = 0; p.dead = true; line(`${p.n.name} has fallen!`, 'l-hurt'); } }
  const pet = petOf(); if (pet && pet.hp > 0) { pet.hp -= petStats(pet).hpMax * pct * k; if (pet.hp <= 0) petDie(); }
  const a = Math.round(ST.hpMax * pct * k * (C.buffs.shieldwall ? .4 : 1)); C.hp -= a; line(`${label} hits you for ${a}.`, 'l-hurt'); fx('-' + a, '#ff6a5a', 'hero');
  if (C.hp <= 0) { die(); return true; } return false;
}
function autoCallChance() { const h = H(); return h.raidLeader ? .85 : Math.min(.85, aiEff() * .6 + .08 * ((h.dun && h.dun.wipes) || 0)); }
function openTell(kind, t) {
  /* Auto's calls: reliable with the Raid Leader perk; otherwise poor, but each wipe teaches the raid the fight */
  const auto = aiOn() && R() < autoCallChance();
  C.tell = { kind, t, called: auto ? kind : null, auto };
  line(`${C.mob.name}: ${{ swap: 'the tank\'s armour is in shreds. Swap tanks!', adds: 'the brood hatches. Call the adds!', spread: 'the Choir sings of crowds. Spread out!', stack: 'the Choir sings of the lonely. Stack up!' }[kind]}`, 'l-warn');
  toast(`${CALL[kind][1]} (${CALL[kind][0]})`); sfx('warn');
}
/* a raid call: right call in the window succeeds; for the Choir, a wrong call is as bad as none */
function raidCall(kind) { if (!C.tell || !CALL[kind]) return false; if (C.tell.kind === kind || ['spread', 'stack'].includes(C.tell.kind)) C.tell.called = kind; C.lastInput = C.run; return true; }
function raidKeyPress(k) { k = String(k).toLowerCase(); const kind = Object.keys(CALL).find(x => CALL[x][0].toLowerCase() === k); return !!(kind && C && C.tell && raidCall(kind)); }
function resolveTell() {
  const t = C.tell, plan = C.plan || {}, ok = t.called === t.kind; C.tell = null;
  if (t.kind === 'swap') { if (ok) { C.shred = 0; line('The tanks trade places. The fresh tank takes the Warden.', 'l-sys'); return false; }
    const tk = raidTank(), pct = plan.crush || .4; line(`${C.mob.name} lands a crushing blow on the shredded tank!`, 'l-hurt');
    if (tk === 'hero') { const a = Math.round(ST.hpMax * pct * (C.raidTaken || 1)); C.hp -= a; fx('-' + a, '#ff6a5a', 'hero'); if (C.hp <= 0) { die(); return true; } }
    else if (tk) { tk.hp -= compStats(tk.n).hpMax * pct * 1.5; if (tk.hp <= 0) { tk.hp = 0; tk.dead = true; line(`${tk.n.name} has fallen!`, 'l-hurt'); } }
    return false; }
  if (t.kind === 'adds') { if (ok) { line('The raid cuts the hatchlings down.', 'l-sys'); return false; } return raidHurtAll(plan.swarm || .2, 'The brood swarms the raid and'); }
  if (ok) { line(t.kind === 'spread' ? 'The raid spreads out and the song finds no crowd.' : 'The raid stacks together and the song finds no one alone.', 'l-sys'); return false; }
  return raidHurtAll(.3, 'The Choir\'s song');
}
/* every combat step inside the raid */
function raidStep(h) {
  if (C.phase === 'plan') { C.t -= h; if (C.t <= 0) choosePlan(0); return false; }
  const m = C.mob; if (C.phase !== 'fight' || !m || !m.mech || !m.mech.raid) { C.tell = null; return false; }
  if (C.tell) { C.tell.t -= h; if (C.tell.t <= 0) return resolveTell(); return false; }
  const mech = m.mech, plan = C.plan || {};
  if (mech.shred) { C.shredT -= h; if (C.shredT <= 0) { C.shredT = mech.shred; C.shred++; line(`${m.name} shreds the tank's armour (${C.shred}).`, 'l-hit');
    if (C.shred >= (plan.swapAt || 4)) { openTell('swap', 4); return false; } } }
  if (mech.adds) { C.addsT -= h; if (C.addsT <= 0) { C.addsT = mech.adds; openTell('adds', 4); return false; } }
  if (mech.choir) { C.choirT -= h; if (C.choirT <= 0) { C.choirT = mech.choir; const kind = R() < .5 ? 'spread' : 'stack';
    if (kind === (plan.def || '')) line(`The Choir sings of ${kind === 'spread' ? 'crowds' : 'the lonely'}; the raid is already ${kind === 'spread' ? 'spread out' : 'stacked'}, as planned.`, 'l-sys');
    else openTell(kind, 3.5); } }
  return false;
}
/* raid loot: your set piece for each boss's slot, plus an epic for anyone */
function raidLoot(m) {
  const h = H(), lock = raidLock(h), e = THRONE.enc[m.raidStep]; if (!lock.at) lock.at = Date.now(); if (!lock.killed.includes(m.raidStep)) lock.killed.push(m.raidStep);
  const il = RAID_LVL() + 4 + (e.final ? 2 : 0), out = [];
  for (const s of e.slots) { const it = genItem(il, 4, s, { cls: h.cls }); it.set = h.cls; it.name = `${TIER[h.cls]} ${TIER_SLOT[s]}`; out.push(it); }
  for (let i = e.slots.length; i < m.lootN; i++) out.push(genItem(il, 4, pick(['weapon', 'trinket', 'offhand']), { cls: R() < .5 ? h.cls : undefined }));
  slog(`Defeated ${e.name} in ${THRONE.name}.`);
  return out;
}
function raidFinish() {
  const h = H(), r = dungeonStats('throne'), first = !r.clears; r.clears++;
  for (const p of C.party) addAff(p.n, 15, `Cleared ${THRONE.name} together at level ${h.lvl}.`);
  if (first) { h.raidLeader = true; toast('Raid Leader: Auto now makes raid calls reliably'); }
  slog(`Cleared ${THRONE.name}${h.dun.wipes ? ` after ${h.dun.wipes} wipe${h.dun.wipes > 1 ? 's' : ''}` : ' without a wipe'}.`);
  sfx('badge'); toast(`${THRONE.name} cleared!`); leaveDungeon(`Seraveth falls. The throne stays empty, and the raid walks out of ${THRONE.name} together.`);
}
/* the set bonuses, added to talents through T() */
function setPieces() { const h = H(); if (!h) return 0; let n = 0; for (const s of SLOTS) { const it = h.gear[s]; if (it && it.set === h.cls && it.dur > 0) n++; } return n; }
function setT(key) {
  const n = setPieces(); if (n < 2) return 0; const role = heroRole(); let s = 0;
  if (key === 'hpPct') s += 5;
  if (n >= 4 && key === { tank: 'armor', heal: 'heal', dps: 'dmg' }[role]) s += role === 'dps' ? 5 : 10;
  if (n >= 5 && key === { tank: 'dodge', heal: 'regenPct', dps: 'crit' }[role]) s += role === 'heal' ? 20 : 3;
  return s;
}
/* the raid section of the Friends tab */
function raidSection() {
  const h = H(), r = dungeonStats('throne'), lock = raidLock(h), ids = autoRaid(), why = raidProblem(ids), c = raidComp(ids);
  const zoneName = ZONES[THRONE.zone] ? ZONES[THRONE.zone].name : 'The Crown\'s Heart';
  return `<h4>Raid: ${THRONE.name}</h4><p class="meta">Ten people, four bosses, in ${zoneName}. Before each boss you choose a plan; during the
    pull make raid calls when the boss gives a tell (S Swap, A Adds, Q Spread, W Stack). Bosses stay dead for 3 days. Drops epics and your class's
    ${TIER[h.cls]} set.</p><p class="meta">Cleared ${r.clears} time${r.clears === 1 ? '' : 's'}${lock.killed.length ? ` · ${lock.killed.length} of 4 bosses dead this lockout` : ''}${h.raidLeader ? ' · Raid Leader: Auto calls reliably' : ''}${setPieces() ? ` · ${setPieces()}/5 set pieces worn` : ''}.</p>
    ${why ? `<p class="meta">${why}</p>` : `<p class="meta">Your raid: ${ids.map(id => npcOf(id).name).join(', ')} (${c.tank} tanks, ${c.heal} healers).</p>`}
    <button class="btn" data-act="raidgo" ${why ? 'disabled' : ''}>Gather the raid and enter</button>`;
}
function raidUI() {
  const t = C && C.tell, kinds = !t ? [] : ['spread', 'stack'].includes(t.kind) ? ['spread', 'stack'] : [t.kind];
  for (const k of Object.keys(CALL)) { const b = $('#call-' + k); if (b) b.hidden = !kinds.includes(k) || !!(t && t.called); }
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || !H()) return; const a = el.dataset.act;
  if (a === 'raidgo') { if (startRaid()) { renderTab(true); save(); } }
  else if (a === 'raidplan') choosePlan(Number(el.dataset.arg));
  else if (a === 'raidcall') raidCall(el.dataset.arg);
  else return;
  updateWorld();
});
