'use strict';
/* Supplies (R1, the two-hero supply trial, on the shared roster in shared/roster.js). Characters you aren't playing
   can take a job on the jobs board:
   - Mining: ore for the account's supply bank. 6 ore make a repair kit, which mends all your gear anywhere (Auto
     uses one instead of walking back to town).
   - Herbalism: herbs for the bank. 4 herbs make a healing potion, drunk in a fight below 30% health (40% of your
     health back, once a minute; it can be switched off).
   - Questing: the worker earns a little XP and gold for themselves, far slower than playing them (about 6% of a
     level an hour), so a benched hero still creeps forward.
   Rules: the bank is account-wide and holds only supplies; each hero keeps their own bags and gear, nothing moves.
   The hero you're playing can't hold a job (switching to a worker takes them off it, paying what they'd earned).
   Jobs run while you play someone else and while you're away, up to 8 hours uncollected, like rested XP.
   3 job slots for now; the guild (later) adds slots, more jobs and the guild hall. */
const KIT_ORE = 6, POTION_HERBS = 4, JOB_SLOTS = 3;
const bank = () => { const b = S.bank || (S.bank = {}); for (const k of ['ore', 'kit', 'herb', 'potion']) b[k] = b[k] || 0; if (b.autoPot === undefined) b.autoPot = true; return b; };
const charOf = id => S.chars.find(c => String(c.id) === String(id)) || null;
const gatherEvery = id => { const c = charOf(id); return Math.round(600 / (1 + (c ? c.lvl : 1) / 40)); };
/* Questing: one stretch of quests every 20 minutes, worth 2% of the worker's level and some coin */
function questWork(id, n) {
  const c = charOf(id); if (!c) return;
  for (let i = 0; i < n; i++) {
    c.money += c.lvl * 25;
    if (c.lvl >= LEVEL_CAP) continue;
    c.xp += Math.round(xpNeed(c.lvl) * .02);
    while (c.lvl < LEVEL_CAP && c.xp >= xpNeed(c.lvl)) { c.xp -= xpNeed(c.lvl); c.lvl++; (c.log = c.log || []).unshift(`Reached level ${c.lvl} while questing on the jobs board.`); }
  }
}
const JOBS = {
  mine: { name: 'Mining', doing: 'Mining', done: 'mined', unit: 'ore', every: gatherEvery, give: (id, n) => { bank().ore += n; } },
  herb: { name: 'Herbalism', doing: 'Gathering herbs', done: 'gathered', unit: 'herbs', every: gatherEvery, give: (id, n) => { bank().herb += n; } },
  quest: { name: 'Questing', doing: 'Questing', done: 'finished', unit: 'quest runs', every: () => 1200, give: questWork }
};
const JOB_BTN = { mine: 'Mine', herb: 'Gather herbs', quest: 'Quest' };
const ROSTER = Roster.create({
  get: () => S.guild || (S.guild = { jobs: {} }),
  jobs: JOBS, slots: () => JOB_SLOTS,
  canWork: id => String(id) !== String(S.cur) && !!charOf(id)
});
function reportText(rep) {
  return rep.map(r => { const c = charOf(r.who) || { name: 'Someone' }, j = JOBS[r.job];
    return r.job === 'quest' ? `${c.name} finished ${r.units} quest run${r.units > 1 ? 's' : ''} (now level ${c.lvl})` : `${c.name} ${j.done} ${r.units} ${j.unit}`; }).join(', ');
}
/* on loading or switching heroes: take the new hero off any job, then one report for everything earned */
function supplyCheckIn() {
  bank(); const h = H(); if (!h) return [];
  for (const id of Object.keys((S.guild && S.guild.jobs) || {})) if (!charOf(id)) ROSTER.forget(id);
  const own = ROSTER.jobOf(h.id), rep = ROSTER.collect();
  if (own) { ROSTER.stop(h.id); line(`${h.name} leaves the jobs board and takes up the road again.`, 'l-sys'); }
  if (rep.length) { const t = reportText(rep); line(`Supplies while you were away: ${t}.`, 'l-loot'); toast(`Supplies: ${t}`); }
  return rep;
}
function supplyTick() { if (H()) ROSTER.collect(); }
function canRepair() { const h = H(); return !!h && SLOTS.some(s => h.gear[s] && h.gear[s].dur < 100); }
function craftKit() { const b = bank(); if (b.ore < KIT_ORE) { err(`A repair kit takes ${KIT_ORE} ore.`); return false; } b.ore -= KIT_ORE; b.kit++; sfx('coin'); return true; }
function craftPotion() { const b = bank(); if (b.herb < POTION_HERBS) { err(`A healing potion takes ${POTION_HERBS} herbs.`); return false; } b.herb -= POTION_HERBS; b.potion++; sfx('heal'); return true; }
function useKit(auto) {
  const h = H(), b = bank(); if (!b.kit || !canRepair()) return false;
  b.kit--; for (const s of SLOTS) if (h.gear[s]) h.gear[s].dur = 100; recalc();
  line(auto ? 'Your gear is wearing thin: you mend it with a repair kit and press on.' : 'You mend your gear with a repair kit.', 'l-loot');
  return true;
}
/* called every combat step: a potion below 30% health, at most once a minute */
function autoPotion() {
  const b = bank(); if (!b.potion || !b.autoPot || C.cds.potion > 0 || C.phase !== 'fight' || C.hp <= 0 || C.hp >= ST.hpMax * .3) return false;
  b.potion--; C.cds.potion = 60; const a = Math.round(ST.hpMax * .4); C.hp = Math.min(ST.hpMax, C.hp + a);
  line(`You drink a healing potion: +${a} health.`, 'l-heal'); fx('+' + a, '#7cf08a', 'hero'); sfx('heal');
  return true;
}
function fmtLeft(id) { const s = ROSTER.nextIn(id), u = JOBS[ROSTER.jobOf(id)].unit;
  return s === Infinity ? 'waiting for you (8 hours uncollected)' : `next ${u === 'quest runs' ? 'quest run' : u === 'herbs' ? 'herb' : u} in ${s >= 60 ? Math.ceil(s / 60) + ' min' : s + 's'}`; }
function jobRate(id, job) { return job === 'quest' ? '3 quest runs an hour, about 6% of a level' : `about ${Math.round(3600 / gatherEvery(id))} ${JOBS[job].unit} an hour`; }
TABS.supplies = {
  key() { const b = bank(); return [b.ore, b.kit, b.herb, b.potion, b.autoPot, S.cur, S.chars.map(c => c.id + ':' + c.lvl + ':' + (ROSTER.jobOf(c.id) || '')).join(','), canRepair()].join('|'); },
  build() {
    const h = H(), b = bank(), others = S.chars.filter(c => c.id !== h.id);
    const row = (name, n, meta, btn) => `<div class="rowl"><div class="l"><b>${name}</b> <span class="num">${n}</span><div class="meta">${meta}</div></div><div class="r">${btn}</div></div>`;
    let o = `<h3>Supplies</h3><p class="sub">The supply bank is shared by all your characters. Heroes you aren't playing can work a job and
      send what they earn here, even while you're away (up to 8 hours at a time). Each hero keeps their own bags.</p>`;
    o += row('Ore', b.ore, `${KIT_ORE} ore make a repair kit`, `<button class="btn sm" data-act="craftkit" ${b.ore < KIT_ORE ? 'disabled' : ''}>Make a repair kit</button>`);
    o += row('Repair kits', b.kit, 'Mends all your gear anywhere. Auto uses one instead of walking back to town.', `<button class="btn sm" data-act="usekit" ${b.kit && canRepair() ? '' : 'disabled'}>Use a repair kit</button>`);
    o += row('Herbs', b.herb, `${POTION_HERBS} herbs make a healing potion`, `<button class="btn sm" data-act="craftpot" ${b.herb < POTION_HERBS ? 'disabled' : ''}>Brew a potion</button>`);
    o += row('Healing potions', b.potion, 'In a fight below 30% health you drink one: 40% of your health back, once a minute.',
      `<button class="btn sm alt" data-act="autopot" aria-pressed="${b.autoPot}">${b.autoPot ? 'Drinking: on' : 'Drinking: off'}</button>`);
    o += `<h3 style="margin-top:12px">Jobs board <span class="meta">${ROSTER.busy()}/${JOB_SLOTS} working</span></h3>`;
    if (!others.length) return o + `<p class="meta">Only ${h.name} so far. Create another character (the Characters button) and they can work for
      ${h.name} while you play.</p>`;
    o += others.map(c => {
      const j = ROSTER.jobOf(c.id);
      return `<div class="rowl"><div class="l"><b style="color:${CLASSES[c.cls].col}">${c.name}</b> <span class="meta">level ${c.lvl}</span>
        <div class="meta" data-job="${c.id}">${j ? `${JOBS[j].doing} in ${ZONES[c.zone].name} · ${jobRate(c.id, j)} · ${fmtLeft(c.id)}` : 'Resting'}</div></div>
        <div class="r">${j ? `<button class="btn sm alt" data-act="jobstop" data-arg="${c.id}">Stop</button>`
          : Object.keys(JOBS).map(k => `<button class="btn sm" data-act="job" data-arg="${c.id}:${k}" ${ROSTER.free() ? '' : 'disabled'} title="${jobRate(c.id, k)}">${JOB_BTN[k]}</button>`).join('')}</div></div>`;
    }).join('');
    return o + `<p class="meta" style="margin-top:6px">Higher-level heroes gather faster. The hero you're playing always earns far more on the road.</p>`;
  },
  update() { for (const el of document.querySelectorAll('[data-job]')) { const id = el.dataset.job; if (!ROSTER.jobOf(id)) continue;
    const t = el.textContent.replace(/next .*|waiting for you.*/, fmtLeft(id)); if (t !== el.textContent) el.textContent = t; } }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || !H()) return; const a = el.dataset.act, arg = el.dataset.arg || '';
  if (a === 'job') { const [id, job] = arg.split(':'); if (ROSTER.assign(id, job)) { sfx('select'); save(); } }
  else if (a === 'jobstop') { const job = ROSTER.jobOf(arg), n = ROSTER.stop(arg); if (n) toast(reportText([{ who: arg, job, units: n }])); save(); }
  else if (a === 'craftkit') { if (craftKit()) save(); }
  else if (a === 'craftpot') { if (craftPotion()) save(); }
  else if (a === 'usekit') { if (useKit(false)) save(); }
  else if (a === 'autopot') { bank().autoPot = !bank().autoPot; save(); }
  else return;
  renderTab(true);
});
