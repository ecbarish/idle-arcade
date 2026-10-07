'use strict';
/* Game state, saving, and helpers for creatures in your care. */
const KEY = 'wildbond-save-v1';
const Cr = window.Creatures;
const $ = s => document.querySelector(s);
const { fmt, fmtI, fmtTime } = window.Arcade;
const R = Math.random, pick = a => a[Math.floor(R() * a.length)], rint = (a, b) => a + Math.floor(R() * (b - a + 1)), clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function fresh() {
  return { v: 1, started: false, name: 'Tamer', starter: null, team: [], ranch: [], coins: 120, lures: 5, biome: 'thornwood',
    explored: 0, story: {}, badges: [], seen: {}, caught: {}, auto: false, era: 'pocket', eras: ['pocket'],
    stats: { battles: 0, wins: 0, caught: 0, play: 0 }, log: [], last: Date.now(), tab: 'team',
    journey: 'classic', capMode: 'soft', xpShare: false, pos: null, modes: {}, rematch: {}, titles: [] };
}
let S = fresh();

function sp(c) { return SPECIES[c.sp]; }
function stOf(c) { const s = Cr.stats(c, sp(c).base); if ((c.fatigue || 0) > 70 || c.injured > 0) for (const k in s) if (k !== 'hp') s[k] = Math.round(s[k] * 0.9); return s; }
function movesOf(c) { const L = sp(c).learn.filter(([l]) => l <= c.lvl).map(([, m]) => m); return [...new Set(L)].slice(-4); }
function healAll() { for (const c of S.team) c.hp = stOf(c).hp; }
function alive() { return S.team.filter(c => c.hp > 0); }
function slog(m) { S.log.unshift(m); if (S.log.length > 40) S.log.length = 40; }
function newCreature(id, lvl, opts) { const c = Cr.make({ id, name: SPECIES[id].name }, lvl, opts); c.hp = Cr.stats(c, SPECIES[id].base).hp; return c; }
function keep(c, how) {
  S.caught[c.sp] = true; S.seen[c.sp] = true;
  if (S.team.length < teamMax()) { S.team.push(c); return 'team'; }
  S.ranch.push(c); return 'ranch';
}
/* Pacing: the badge level cap and the XP/coin multipliers from the journey setting. */
function levelCap() { return S.capMode === 'off' ? LEVEL_CAP : Math.min(LEVEL_CAP, CAP_BASE + CAP_STEP * S.badges.length); }
function journey() { return JOURNEY[S.journey] || JOURNEY.classic; }
function xpMult() { return journey().xp * (S.auto ? AUTO_XP : 1); }
/* Level ups, new moves and evolution after gaining xp. Returns messages. */
function grow(c, xp) {
  const cap = levelCap(), msgs = [], before = movesOf(c);
  let gained = 0;
  if (c.lvl < cap) gained = Cr.gainXp(c, xp, cap);
  else if (S.capMode === 'soft' && c.lvl < LEVEL_CAP) gained = Cr.gainXp(c, Math.round(xp * SOFT_TRICKLE), LEVEL_CAP);
  if (gained) {
    msgs.push(`${c.name} grew to level ${c.lvl}!`); sfx('level');
    for (const m of movesOf(c)) if (!before.includes(m)) msgs.push(`${c.name} learned ${MOVES[m].name}!`);
    const evo = sp(c).evo;
    if (evo && c.lvl >= evo.at) { const old = c.name, wasDefault = c.name === sp(c).name; c.sp = evo.to; if (wasDefault) c.name = sp(c).name;
      msgs.push(`${old} evolved into ${sp(c).name}!`); S.seen[c.sp] = true; S.caught[c.sp] = true; slog(`${old} evolved into ${sp(c).name}.`); }
    c.hp = Math.min(stOf(c).hp, c.hp + Math.round(stOf(c).hp * 0.2));
  }
  return msgs;
}

function save() {
  S.last = Date.now(); Arcade.save(KEY, S);
  if (S.started) { const lead = S.team[0];
    Arcade.report('wildbond', { summary: `${S.name} · ${S.badges.length} badge${S.badges.length === 1 ? '' : 's'} · ${Object.keys(S.caught).length} species caught`,
      detail: lead ? `Lead: ${lead.name}, level ${lead.lvl} · ${BIOMES[S.biome].name}` : BIOMES[S.biome].name }); }
}
function load() { const o = Arcade.load(KEY); if (!o) return; S = Object.assign(fresh(), o); S.stats = Object.assign(fresh().stats, o.stats || {});
  // older saves began in color: they keep it, and get the faded Pocket look as an extra
  if (!S.eras.includes('pocket')) S.eras.unshift('pocket');
  if (S.badges.includes('thorn')) { for (const e of ['pixel', 'bit16']) if (!S.eras.includes(e)) S.eras.push(e); S.shoes = true; }
  if (S.badges.includes('tide') && !S.eras.includes('hd')) S.eras.push('hd');
  if (S.badges.includes('ember') && !S.eras.includes('diorama')) S.eras.push('diorama'); }
