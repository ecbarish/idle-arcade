'use strict';
/* Supplies (R1, the two-hero supply trial, on the shared roster in shared/roster.js). Characters you aren't playing
   can take a job; for now the one job is Mining, which fills the account's supply bank with ore. Ore becomes repair
   kits, which mend all your gear anywhere (Auto uses one instead of walking back to town). Rules:
   - The bank is account-wide and holds only supplies; each hero keeps their own bags and gear, nothing moves.
   - The hero you're playing can't hold a job (switching to a miner takes them off it, paying what they'd earned).
   - Jobs run while you play someone else and while you're away, up to 8 hours uncollected, like rested XP.
   - 3 job slots for now; the guild (later) adds slots, more jobs and the guild hall. */
const KIT_ORE = 6, JOB_SLOTS = 3;
const bank = () => S.bank || (S.bank = { ore: 0, kit: 0 });
const charOf = id => S.chars.find(c => String(c.id) === String(id)) || null;
const JOBS = {
  mine: { name: 'Mining', verb: 'mining', unit: 'ore',
    every: id => { const c = charOf(id); return Math.round(600 / (1 + (c ? c.lvl : 1) / 40)); },
    give: (id, n) => { bank().ore += n; } }
};
const ROSTER = Roster.create({
  get: () => S.guild || (S.guild = { jobs: {} }),
  jobs: JOBS, slots: () => JOB_SLOTS,
  canWork: id => String(id) !== String(S.cur) && !!charOf(id)
});
function reportText(rep) { return rep.map(r => `${(charOf(r.who) || { name: 'Someone' }).name} ${JOBS[r.job].verb === 'mining' ? 'mined' : 'earned'} ${r.units} ${JOBS[r.job].unit}`).join(', '); }
/* on loading or switching heroes: take the new hero off any job, then one report for everything earned */
function supplyCheckIn() {
  bank(); const h = H(); if (!h) return [];
  for (const id of Object.keys((S.guild && S.guild.jobs) || {})) if (!charOf(id)) ROSTER.forget(id);
  const own = ROSTER.jobOf(h.id); let rep = ROSTER.collect();
  if (own) { ROSTER.stop(h.id); line(`${h.name} sets down the pick and takes up the road again.`, 'l-sys'); }
  if (rep.length) { const t = reportText(rep); line(`Supplies while you were away: ${t}.`, 'l-loot'); toast(`Supplies: ${t}`); }
  return rep;
}
function supplyTick() { if (H()) ROSTER.collect(); }
function canRepair() { const h = H(); return !!h && SLOTS.some(s => h.gear[s] && h.gear[s].dur < 100); }
function craftKit() { const b = bank(); if (b.ore < KIT_ORE) { err(`A repair kit takes ${KIT_ORE} ore.`); return false; } b.ore -= KIT_ORE; b.kit++; sfx('coin'); return true; }
function useKit(auto) {
  const h = H(), b = bank(); if (!b.kit || !canRepair()) return false;
  b.kit--; for (const s of SLOTS) if (h.gear[s]) h.gear[s].dur = 100; recalc();
  line(auto ? 'Your gear is wearing thin: you mend it with a repair kit and press on.' : 'You mend your gear with a repair kit.', 'l-loot');
  return true;
}
function fmtLeft(s) { return s === Infinity ? 'waiting for you (8 hours uncollected)' : s >= 60 ? `next ore in ${Math.ceil(s / 60)} min` : `next ore in ${s}s`; }
TABS.supplies = {
  key() { const b = bank(); return [b.ore, b.kit, S.cur, S.chars.map(c => c.id + ':' + c.lvl + ':' + (ROSTER.jobOf(c.id) || '')).join(','), canRepair()].join('|'); },
  build() {
    const h = H(), b = bank(), others = S.chars.filter(c => c.id !== h.id);
    let o = `<h3>Supplies</h3><p class="sub">The supply bank is shared by all your characters. Heroes you aren't playing can work a job and
      send what they earn here, even while you're away (up to 8 hours at a time). Each hero keeps their own bags.</p>
      <div class="rowl"><div class="l"><b>Ore</b> <span class="num">${b.ore}</span><div class="meta">${KIT_ORE} ore make a repair kit</div></div>
        <div class="r"><button class="btn sm" data-act="craftkit" ${b.ore < KIT_ORE ? 'disabled' : ''}>Make a repair kit</button></div></div>
      <div class="rowl"><div class="l"><b>Repair kits</b> <span class="num">${b.kit}</span><div class="meta">Mends all your gear anywhere. Auto uses one instead of walking back to town.</div></div>
        <div class="r"><button class="btn sm" data-act="usekit" ${b.kit && canRepair() ? '' : 'disabled'}>Use a repair kit</button></div></div>
      <h3 style="margin-top:12px">Jobs board <span class="meta">${ROSTER.busy()}/${JOB_SLOTS} working</span></h3>`;
    if (!others.length) return o + `<p class="meta">Only ${h.name} so far. Create another character (the Characters button) and they can mine for
      ${h.name} while you play.</p>`;
    o += others.map(c => {
      const j = ROSTER.jobOf(c.id), rate = Math.round(3600 / JOBS.mine.every(c.id));
      return `<div class="rowl"><div class="l"><b style="color:${CLASSES[c.cls].col}">${c.name}</b> <span class="meta">level ${c.lvl}</span>
        <div class="meta" data-job="${c.id}">${j ? `Mining in ${ZONES[c.zone].name} · about ${rate} ore an hour · ${fmtLeft(ROSTER.nextIn(c.id))}` : `Resting · could mine about ${rate} ore an hour`}</div></div>
        <div class="r">${j ? `<button class="btn sm alt" data-act="jobstop" data-arg="${c.id}">Stop</button>` : `<button class="btn sm" data-act="jobmine" data-arg="${c.id}" ${ROSTER.free() ? '' : 'disabled'}>Mine</button>`}</div></div>`;
    }).join('');
    return o + `<p class="meta" style="margin-top:6px">Higher-level heroes mine faster. The hero you're playing always earns more on the road.</p>`;
  },
  update() { for (const el of document.querySelectorAll('[data-job]')) { const id = el.dataset.job; if (!ROSTER.jobOf(id)) continue;
    const t = el.textContent.replace(/next ore in .*|waiting for you.*/, fmtLeft(ROSTER.nextIn(id))); if (t !== el.textContent) el.textContent = t; } }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || !H()) return; const a = el.dataset.act, id = el.dataset.arg;
  if (a === 'jobmine') { if (ROSTER.assign(id, 'mine')) { sfx('select'); save(); } }
  else if (a === 'jobstop') { const n = ROSTER.stop(id); if (n) toast(`${charOf(id).name} brings back ${n} ore`); save(); }
  else if (a === 'craftkit') { if (craftKit()) save(); }
  else if (a === 'usekit') { if (useKit(false)) save(); }
  else return;
  renderTab(true);
});
