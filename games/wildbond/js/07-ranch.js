'use strict';
/* Ranch days, training, food and breeding.
   A ranch day passes every DAY_SECONDS of play (and while you're away). Each creature follows its daily plan:
   a food and an activity. Training raises "trained points" (every 4 add 1 to a stat), limited per stat and in total. */
const DAY_SECONDS = 3600; // one ranch day (and one day-night cycle) is an hour of play (Evan, 2026-10-07: five minutes felt overwhelming)
const TRAIN_CAP = 40, TRAIN_TOTAL = 120;
const FOODS = {
  meat: { name: 'Meat', cost: 4, stat: 'pow' }, grain: { name: 'Grain', cost: 3, stat: 'hp' },
  fish: { name: 'Fish', cost: 4, stat: 'spd' }, berries: { name: 'Berries', cost: 3, stat: 'spi' }
};
const FAVORITE = { wolf: 'meat', hyena: 'meat', spider: 'meat', cat: 'fish', croc: 'fish', lizard: 'fish', boar: 'grain', horse: 'grain', bird: 'berries', sprite: 'berries' };
const REGIMENS = {
  rest: { name: 'Rest', gain: {}, tire: -35, desc: 'Recover from fatigue and lift mood.' },
  sprint: { name: 'Sprint', gain: { spd: 3, hp: 1 }, tire: 18, desc: 'Speed, a little Health.' },
  weights: { name: 'Weights', gain: { pow: 3, grd: 1 }, tire: 22, desc: 'Power, a little Guard.' },
  swim: { name: 'Swim', gain: { hp: 3, spi: 1 }, tire: 16, desc: 'Health, a little Spirit.' },
  sparring: { name: 'Sparring', gain: { pow: 2, grd: 2, wit: 1 }, tire: 20, bond: 1, desc: 'All-round, and bond grows.' },
  puzzles: { name: 'Puzzles', gain: { wit: 3, spd: 1 }, tire: 12, desc: 'Wits, a little Speed.' },
  meditation: { name: 'Meditation', gain: { spi: 3, grd: 1 }, tire: 4, desc: 'Spirit, gentle on fatigue.' }
};

/* Hybrids: specific cross-family pairs hatch a new species. Keys are the two families in alphabetical order. */
const HYBRIDS = { 'cat+wolf': 'lynxhound', 'bird+lizard': 'drakelet', 'boar+horse': 'bramblestag' };
Object.assign(SPECIES, {
  lynxhound: { name: 'Lynxhound', fam: 'cat', el: 'Shade', col: '#4a3f63', hybrid: 1, base: { hp: 60, pow: 78, grd: 55, spd: 82, wit: 60, spi: 55 },
    learn: [[1, 'bite'], [1, 'scratch'], [5, 'shadowSting'], [9, 'howl'], [13, 'rockToss']], dex: 'A wolf-cat hybrid that hunts in silence. Only ever seen on ranches.' },
  drakelet: { name: 'Drakelet', fam: 'lizard', wings: 1, el: 'Ember', col: '#d8542e', hybrid: 1, base: { hp: 58, pow: 70, grd: 58, spd: 70, wit: 80, spi: 60 },
    learn: [[1, 'scratch'], [1, 'peck'], [5, 'emberSnap'], [9, 'gust'], [13, 'flameRush']], dex: 'Part lizard, part bird. It glides on hot air and dreams of becoming a dragon.' },
  bramblestag: { name: 'Bramblestag', fam: 'horse', antlers: 1, el: 'Grove', col: '#7a6a3a', hybrid: 1, base: { hp: 80, pow: 72, grd: 70, spd: 66, wit: 52, spi: 60 },
    learn: [[1, 'charge'], [5, 'vineLash'], [9, 'regrowth'], [13, 'thornQuake']], dex: 'A boar-horse hybrid crowned with thorny antlers. Steady, strong and gentle with foals.' }
});
const PRE = {}; for (const id in SPECIES) { const e = SPECIES[id].evo; if (e) PRE[e.to] = id; }
function baseForm(id) { while (PRE[id]) id = PRE[id]; return id; }

function ensureRanch() {
  S.day = S.day || 1; S.ranchT = S.ranchT || 0; S.food = S.food || { meat: 12, grain: 12, fish: 12, berries: 12 };
  S.eggs = S.eggs || []; S.hybrids = S.hybrids || {}; S.dayReport = S.dayReport || [];
}
function ensureCare(c) {
  c.train = c.train || {}; c.fatigue = c.fatigue || 0; if (c.mood === undefined) c.mood = 60; c.injured = c.injured || 0; c.gen = c.gen || 1;
  if (!c.plan) c.plan = { food: FAVORITE[sp(c).fam] || 'none', act: 'rest' };
}
function everyone() { return S.team.concat(S.ranch); }
function trainedTotal(c) { return Cr.STATS.reduce((s, k) => s + (c.train[k] || 0), 0); }
function addTrain(c, stat, v) {
  const room = Math.min(TRAIN_CAP - (c.train[stat] || 0), TRAIN_TOTAL - trainedTotal(c)); const g = Math.max(0, Math.min(room, v));
  c.train[stat] = (c.train[stat] || 0) + g; return g;
}
function moodName(c) { return c.mood >= 75 ? 'Happy' : c.mood >= 45 ? 'Content' : c.mood >= 20 ? 'Grumpy' : 'Miserable'; }

function newDay(quiet) {
  ensureRanch(); S.day++; const report = [];
  for (const c of everyone()) {
    ensureCare(c); const name = c.name;
    // food
    const f = c.plan.food;
    if (f !== 'none' && S.food[f] > 0) { S.food[f]--; const fav = FAVORITE[sp(c).fam] === f; c.mood += fav ? 12 : 4; addTrain(c, FOODS[f].stat, 1); Cr.addBond(c, 0.5); }
    else if (f !== 'none') { c.mood -= 7; report.push(`${name} went hungry: you're out of ${FOODS[f].name.toLowerCase()}.`); }
    else c.mood -= 8;
    // activity
    if (c.injured > 0) { c.injured--; c.fatigue = Math.max(0, c.fatigue - 25); report.push(c.injured ? `${name} is still healing (${c.injured} day${c.injured > 1 ? 's' : ''} left).` : `${name} has recovered.`); }
    else {
      const R2 = REGIMENS[c.plan.act] || REGIMENS.rest, T = Cr.TEMPERAMENTS[c.temp];
      if (c.plan.act === 'rest') { c.fatigue = Math.max(0, c.fatigue - 35); c.mood += 8; }
      else {
        const moodM = 0.5 + Math.max(0, Math.min(100, c.mood)) / 100, tiredM = c.fatigue > 70 ? 0.6 : 1, got = [];
        for (const s in R2.gain) { const potM = 0.7 + (c.pot[s] / 31) * 0.6, tM = T.up === s ? 1.25 : T.down === s ? 0.8 : 1;
          const g = addTrain(c, s, Math.round(R2.gain[s] * moodM * potM * tM * tiredM)); if (g) got.push(`+${g} ${Cr.STAT_NAME[s]}`); }
        if (R2.bond) Cr.addBond(c, R2.bond);
        c.fatigue = Math.min(100, c.fatigue + R2.tire);
        report.push(got.length ? `${name}: ${got.join(', ')} (${R2.name})` : `${name} trained (${R2.name}) but has reached its training limit.`);
        if (c.fatigue > 70 && Math.random() < (c.fatigue - 60) / 100) { c.injured = 2; c.mood -= 15; report.push(`${name} pulled something overtraining and needs 2 days off.`); }
      }
    }
    c.mood = clamp(c.mood, 0, 100);
  }
  // eggs
  for (const e of S.eggs) e.days--;
  for (const e of S.eggs.filter(e => e.days <= 0)) hatch(e);
  S.eggs = S.eggs.filter(e => e.days > 0);
  S.dayReport = report.slice(0, 12);
  if (!quiet) { toast(`Ranch day ${S.day}: ${report.filter(l => l.includes('+')).length} trained${report.some(l => /hungry|pulled/.test(l)) ? ' · check the ranch' : ''}`); }
  return report;
}
function ranchTick(h) { ensureRanch(); S.ranchT += h; if (S.ranchT >= DAY_SECONDS) { S.ranchT -= DAY_SECONDS; newDay(false); } }
function catchUpDays(sec) { ensureRanch(); const n = Math.min(36, Math.floor((sec + S.ranchT) / DAY_SECONDS)); S.ranchT = (sec + S.ranchT) % DAY_SECONDS; for (let i = 0; i < n; i++) newDay(true); return n; }
function buyFood(f, n) { const cost = FOODS[f].cost * n; if (S.coins < cost) { toast(`${n} ${FOODS[f].name} costs ${cost} coins.`); return; } S.coins -= cost; S.food[f] += n; }

/* ---- breeding ---- */
const BREED_COST = 80;
function breedInfo(a, b) {
  if (!a || !b || a === b) return { ok: false, why: 'Pick two different creatures.' };
  if (sp(a).unique || sp(b).unique) return { ok: false, why: 'Legendary creatures will not breed.' };
  for (const c of [a, b]) { ensureCare(c); if (c.lvl < 8) return { ok: false, why: `${c.name} needs to reach level 8.` };
    if (Cr.bondLvl(c) < 1) return { ok: false, why: `${c.name} doesn't trust you enough yet (needs Friendly bond).` };
    if (c.injured) return { ok: false, why: `${c.name} is injured.` }; }
  const fa = sp(a).fam, fb = sp(b).fam;
  if (fa === fb) { const opts = [...new Set([baseForm(a.sp), baseForm(b.sp)])]; return { ok: true, opts, text: `Same family: the egg will hatch into ${opts.map(id => SPECIES[id].name).join(' or ')}.` }; }
  const hy = HYBRIDS[[fa, fb].sort().join('+')];
  if (hy) return { ok: true, opts: [hy], hybrid: true, text: S.hybrids[hy] ? `These two make a ${SPECIES[hy].name}.` : 'These two seem to get along... something new might hatch.' };
  return { ok: false, why: "These two families won't breed. Try a pair from the same family, or experiment with others." };
}
function startBreed(a, b) {
  ensureRanch(); const info = breedInfo(a, b);
  if (!info.ok) { toast(info.why); return false; }
  if (S.eggs.length) { toast('The barn already has an egg. Wait for it to hatch.'); return false; }
  if (S.coins < BREED_COST) { toast(`Breeding costs ${BREED_COST} coins.`); return false; }
  S.coins -= BREED_COST;
  const id = pick(info.opts), child = Cr.breed(a, b, { id, name: SPECIES[id].name }, 3);
  child.gen = Math.max(a.gen || 1, b.gen || 1) + 1; child.parents = [a.name, b.name]; child.bond = 20;
  child.born = `Hatched on the ranch, day ${S.day + 2}, from ${a.name} and ${b.name}.`; child.hp = null;
  a.fatigue = Math.min(100, (a.fatigue || 0) + 20); b.fatigue = Math.min(100, (b.fatigue || 0) + 20);
  S.eggs.push({ child, days: 2, from: [a.name, b.name], hybrid: !!info.hybrid });
  slog(`${a.name} and ${b.name} have an egg in the barn.`); toast('An egg! It will hatch in 2 ranch days.');
  return true;
}
function hatch(e) {
  const c = e.child; c.hp = stOf(c).hp; ensureCare(c);
  const where = keep(c); S.seen[c.sp] = S.caught[c.sp] = true;
  if (SPECIES[c.sp].hybrid && !S.hybrids[c.sp]) { S.hybrids[c.sp] = true; toast(`A new species hatched: ${SPECIES[c.sp].name}!`); slog(`Discovered a hybrid: ${SPECIES[c.sp].name}, from ${e.from.join(' and ')}.`); }
  else { toast(`The egg hatched: ${c.name}${c.rar ? ` (${Cr.RARITY[c.rar].name})` : ''}!`); slog(`An egg hatched into ${c.name} (generation ${c.gen}), sent to your ${where}.`); }
}

/* ---- biome travel ---- */
function biomeOpen(id) { const b = BIOMES[id]; return !b.req || S.badges.includes(b.req); }
function travelTo(id) { if (challengeLocked()) { W.msg = 'Leave the challenge attempt before travelling.'; return; } if (B || TALK || !BIOMES[id] || !biomeOpen(id) || (S.pos ? S.pos.map === id : S.biome === id)) return; S.biome = id; if (MAPS[id]) placeAt(id); W.msg = `You travel to ${BIOMES[id].name}.`; slog(`Travelled to ${BIOMES[id].name}.`); }
