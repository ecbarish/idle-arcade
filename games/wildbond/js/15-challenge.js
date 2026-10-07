'use strict';
/* Challenge modes, rematches and area mastery (T11b). See "Pacing, level caps and journey settings" in
   docs/creature-game-design.md. Modes are picked with your starter and can't change afterwards (S.modes);
   rematches let you battle Wardens and Wren again at tiers that scale to your level (S.rematch); mastery gives
   each area up to three stars. */
const MODES = {
  nuzlocke: { name: 'Nuzlocke', title: 'Nuzlocke Survivor',
    desc: 'A creature that faints is released back to the wild. Only the first creature you meet in each area can be caught (guardians excepted).' },
  randomizer: { name: 'Randomizer', title: 'Wanderer of Shuffled Wilds', desc: 'Wild creatures are shuffled between the areas. Every save gets its own shuffle.' },
  solo: { name: 'Solo Run', title: 'One and Only', desc: 'Just you and your first partner. Creatures you catch live on the ranch.' },
  hardcore: { name: 'Hardcore', title: 'Hard as Hearthstone', desc: 'Opponents fight smarter, and you can\'t Rally.' }
};
function modeOn(k) { return !!(S.modes && S.modes[k]); }
function teamMax() { return modeOn('solo') ? 1 : 3; }

/* ---- Randomizer: a fixed shuffle of every species found in the wild tables, from this save's seed ---- */
let RANDOM_MAP = null, RANDOM_SEED = null;
function randomized(id) {
  if (!modeOn('randomizer')) return id;
  if (!RANDOM_MAP || RANDOM_SEED !== S.modes.seed) {
    const pool = [...new Set(Object.values(BIOMES).flatMap(b => b.wild.map(([w]) => w)))].sort(), out = pool.slice();
    let s = S.modes.seed || 1; const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    RANDOM_MAP = Object.fromEntries(pool.map((p, i) => [p, out[i]])); RANDOM_SEED = S.modes.seed;
  }
  return RANDOM_MAP[id] || id;
}

/* ---- Nuzlocke ---- */
function firstMetHere() { return !(S.metIn || {})[S.biome]; }
function canLure(target) {
  if (!modeOn('nuzlocke') || sp(target).unique) return true;
  return B && B.firstMeet;
}
/* after a battle: fainted creatures go home to the wild; this area's first meeting is used up */
function nuzlockeAfter() {
  if (!modeOn('nuzlocke') || !B) return;
  if (B.kind === 'wild') { S.metIn = S.metIn || {}; S.metIn[S.biome] = true; }
  const gone = S.team.filter(c => c.hp <= 0); if (!gone.length) return;
  S.team = S.team.filter(c => c.hp > 0);
  for (const c of gone) { slog(`${c.name} was too hurt to go on, and went home to the wild. Thank you, ${c.name}.`); bline(`${c.name} goes home to the wild.`, 'warn'); }
  if (!S.team.length && S.ranch.length) { const c = S.ranch.shift(); S.team.push(c); slog(`${c.name} steps up from the ranch to join you.`); }
  if (!S.team.length) {
    S.modes.nuzlocke = false; S.modes.nuzlockeEnded = true;
    const c = newCreature(S.starter, Math.max(5, levelCap() - 8), { rar: 1, born: 'A second chance, from Maren.' }); S.team.push(c);
    slog('Every partner has gone home. Your Nuzlocke run ends here; Maren found a young one who wants to try again with you.');
    W.after = [['maren', 'Oh, {name}. Come here. They\'re not lost, you know. They\'re home.'],
      ['maren', 'This little one has been waiting by the gate all morning. The run is over, but the journey doesn\'t have to be.']];
  }
}

/* ---- Hardcore: foes pick the hardest-hitting move for their target and go after your weakest ---- */
function hardcoreMove(u, moves) {
  const target = living('a').slice().sort((a, b) => a.c.hp / a.st.hp - b.c.hp / b.st.hp)[0]; if (!target) return null;
  const dmg = moves.filter(m => ['hit', 'aoe'].includes(MOVES[m].kind)).sort((a, b) => MOVES[b].pow * advantage(MOVES[b].el, target) - MOVES[a].pow * advantage(MOVES[a].el, target));
  u.focus = target; return dmg[0] || null;
}

/* ---- Titles: finishing a run (every badge there is) with modes on ---- */
function checkTitles() {
  if (!S.modes || !Object.keys(BADGES).every(b => S.badges.includes(b))) return;
  S.titles = S.titles || [];
  for (const k of Object.keys(MODES)) if (modeOn(k) && !S.titles.includes(MODES[k].title)) {
    S.titles.push(MODES[k].title); slog(`Title earned: ${MODES[k].title} (${MODES[k].name}).`); setTimeout(() => toast(`Title earned: ${MODES[k].title}!`), 6000);
  }
}

/* ---- Rematches: once per ranch day each; every tier is stronger and pays better ---- */
const WREN_SPOT = { map: 'larkhaven', at: [13, 7] }; // Wren hangs around town once she's lost on the trail
function wrenNpc() {
  if (!S.story.rival2) return null;
  return { who: 'wren', at: WREN_SPOT.at, dir: 'down', rematch: 'wren',
    lines: [['wren', 'There you are! I\'ve been training. Like, a lot. Rematch?']] };
}
function rematchTier(id) { return ((S.rematch || {})[id] || 0) + 1; }
function rematchReady(id) { return ((S.rematchDay || {})[id] || 0) !== (S.day || 1); }
function rematchTeam(id, tier) {
  const grown = (sid, lvl) => { let s = sid; while (SPECIES[s].evo && lvl >= SPECIES[s].evo.at) s = SPECIES[s].evo.to; return s; };
  const avg = Math.round(teamAvg()), base = id === 'wren' ? [...STORY].reverse().find(b => b.team && !b.trainer && S.story[b.id]).team : STORY.find(b => b.id === id).team;
  const top = base[base.length - 1][1], lift = Math.max(avg + tier, top + 4 * tier) - top;
  return base.slice(-Math.max(1, S.team.length)).map(([sid, l]) => { const lvl = Math.min(LEVEL_CAP, l + lift), real = sid === '$rival' ? S.rivalStarter : sid;
    return newCreature(grown(real, lvl), lvl, { rar: Math.min(4, 1 + Math.floor(tier / 2)) }); });
}
function startRematch(id, who) {
  if (!alive().length) { W.msg = 'Your team needs rest before a rematch.'; return; }
  if (!rematchReady(id)) { const done = id !== 'wren' && MAPS[S.pos.map].wardenDone;
    talk([...(done ? [[who, done]] : []), [who, 'Again already? Rest up. Come back tomorrow and I\'ll be ready for you.']]); return; }
  const tier = rematchTier(id), team = rematchTeam(id, tier), name = CAST[who].name;
  const hello = id === 'wren'
    ? (tier === 1 ? 'There you are! I\'ve been training. Like, a lot. Rematch?' : `Tier ${tier}! I've got a whole new plan this time. It's mostly yelling. Let's go!`)
    : (tier === 1 ? 'A rematch? Good. I\'ve been hoping you\'d ask.' : `Tier ${tier}, then. Don't hold back; I won't.`);
  talk([[who, hello]],
    () => startBattle('trainer', team, { trainer: name, rematch: id, tier }));
}
/* called when a rematch ends (03-battle.js) */
function rematchResult(id, tier, result) {
  S.rematchDay = S.rematchDay || {}; S.rematchDay[id] = S.day || 1;
  if (result !== 'won') return;
  S.rematch = S.rematch || {}; S.rematch[id] = Math.max(S.rematch[id] || 0, tier);
  const coins = 150 * tier, lures = 2 + tier; S.coins += coins; S.lures += lures;
  bline(`Rematch tier ${tier} won! +${coins} coins, +${lures} lures.`, 'good'); slog(`Won a tier ${tier} rematch against ${id === 'wren' ? 'Wren' : STORY.find(b => b.id === id).trainer}.`);
}

/* ---- Area mastery: three stars per area ---- */
function masteryOf(biome) {
  const wild = BIOMES[biome].wild.map(([id]) => randomized(id)), map = MAPS[biome], g = STORY.find(b => b.gate && (b.biome || 'thornwood') === biome);
  const dex = wild.every(id => S.caught[id]);
  const warden = !!g && ((S.rematch || {})[g.id] || 0) >= 3;
  const trainers = map ? (map.npcs || []).filter(n => n.trainer) : [];
  const secrets = !!map && itemsLeft(map).length === 0 && trainers.every(n => (S.beaten || {})[n.who]);
  return { dex, warden, secrets, stars: dex + warden + secrets, hasWarden: !!g };
}

/* Wren joins the townsfolk in Larkhaven (kept here so the map file stays data only) */
const npcsOfBase = npcsOf;
npcsOf = function (m) { const list = npcsOfBase(m), w = m === MAPS[WREN_SPOT.map] && wrenNpc(); if (w) list.push(w); return list; };
const PICKED = {}; // modes ticked on the starter screen
