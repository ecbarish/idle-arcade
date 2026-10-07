'use strict';
/* Exploring, the story, and the town of Larkhaven. */
const W = { msg: '', autoT: 0, endT: 0 };

function chooseStarter(id, name, pace) {
  S.name = (name || 'Tamer').replace(/[<>&"]/g, '').slice(0, 14) || 'Tamer';
  if (JOURNEY[pace]) S.journey = pace;
  const c = newCreature(id, 5, { rar: 1, born: 'Your first partner, from Larkhaven.' });
  S.started = true; S.starter = id; S.team = [c]; S.seen[id] = S.caught[id] = true; placeAt('larkhaven');
  slog(`${S.name} arrived in Larkhaven and chose ${c.name}.`);
  // the rival picks the starter that beats yours
  const rival = newCreature(COUNTER[id], 4, { rar: 1 });
  S.rivalStarter = COUNTER[id];
  save();
  talk(SCENES.rival1, () => startBattle('trainer', [rival], { trainer: RIVAL.name, story: 'rival1' }));
}
function storyWin(id) {
  S.story[id] = true;
  // the after-battle scene plays once the result screen closes (see finishBattle)
  W.after = id === 'rival1' ? SCENES.rival1Win : (STORY.find(b => b.id === id) || {}).win || null;
  const g = STORY.find(b => b.id === id && b.gate);
  if (g && !S.badges.includes(g.gate)) {
    const badge = BADGES[g.gate].name;
    S.badges.push(g.gate); S.coins += 300 * S.badges.length; slog(`Earned the ${badge} from ${g.trainer}.`);
    // the first badge brings the world's color back (Pocket -> 16-bit), and Warden's boots for running
    const newEra = g.gate === 'thorn' && !S.eras.includes('bit16');
    if (g.gate === 'thorn') { for (const e of ['pixel', 'bit16']) if (!S.eras.includes(e)) S.eras.push(e); S.shoes = true; }
    const faded = newEra && S.era === 'pocket';
    // the second badge brings light and depth (16-bit -> HD-2D), weather, and wild creatures you can see
    const newHD = g.gate === 'tide' && !S.eras.includes('hd'); if (newHD) S.eras.push('hd');
    const flat = newHD && S.era === 'bit16';
    // the third badge makes the world solid (HD-2D -> Diorama) and lets you ride your lead creature
    const newDio = g.gate === 'ember' && !S.eras.includes('diorama'); if (newDio) S.eras.push('diorama');
    const lit = newDio && S.era === 'hd';
    W.afterDone = () => { toast(`You earned the ${badge}!`); sfx('badge');
      setTimeout(() => toast(S.capMode === 'off' ? 'Your team feels stronger.' : `Your creatures can now grow to level ${levelCap()}.`), 2000);
      if (faded) setTimeout(() => { S.era = 'bit16'; recolor(); slog('Color came back to the world. Isolde gave you Warden\'s boots.');
        talk(SCENES.colorReturns, () => toast('New art styles unlocked: Pixel and 16-bit. Switch any time in the Journal. Hold Shift to run.')); }, 900);
      else if (newEra) setTimeout(() => toast('The world shimmers... the 16-bit art style is unlocked. Switch it in the Journal. Hold Shift to run.'), 4500);
      if (flat) setTimeout(() => { S.era = 'hd'; recolor(); slog('Light and depth came back to the world. Weather rolls in, and wild creatures can be seen in the grass.');
        talk(SCENES.lightReturns, () => toast('New art style: HD-2D. Wild creatures now show themselves in the tall grass, and the weather changes.')); }, 900);
      else if (newHD) setTimeout(() => toast('HD-2D art style unlocked (Journal). Wild creatures now show themselves in the grass, and the weather changes.'), 4500);
      if (lit) setTimeout(() => { S.era = 'diorama'; recolor(); slog('The world turned solid as a carved model. Your partner can carry you now.');
        talk(SCENES.solidReturns, () => toast('New art style: Diorama. Drag the scene to turn the camera, scroll to zoom. Press R to ride your partner.')); }, 900);
      else if (newDio) setTimeout(() => toast('Diorama art style unlocked (Journal). Press R to ride your lead creature.'), 4500); };
  }
}
/* after the art style changes, portraits and faces redraw in the new look */
function recolor() { document.querySelectorAll('canvas[data-sp]').forEach(c => delete c.dataset.done); tabKey = ''; }
/* Thornwood beats count all explores (older saves); other biomes count explores made in that biome. */
function beatCount(b) { return b.biome ? ((S.exploredIn || {})[b.biome] || 0) : S.explored; }
function beatHere(b) { return (b.biome || 'thornwood') === S.biome; }
function beat() { return STORY.find(b => beatHere(b) && beatCount(b) >= b.at && !S.story[b.id] && !(S.explored < (S.story[b.id + 'Retry'] || 0)) && !(b.id === 'elder' && S.story.elderFled) && !b.gate); }
/* the Warden of the area you're in, if you haven't beaten them yet */
function gateHere() { if (S.pos && MAPS[S.pos.map] && !MAPS[S.pos.map].biome) return null; return STORY.find(b => b.gate && beatHere(b) && !S.story[b.id]); }
function wardenReady() { const g = gateHere(); return !!g && beatCount(g) >= g.at; }
function elderReady() { return S.story.elderFled && !S.story.elderCaught && S.badges.includes('thorn'); }

function teamAvg() { return S.team.length ? S.team.reduce((s, c) => s + c.lvl, 0) / S.team.length : 1; }
/* at night, Shade creatures come out more and Radiant ones hide; weather tips the odds too (12-walk.js) */
function wildPick() { const n = isNight(), fx = WEATHER_FX[weatherNow()] || {}, t = BIOMES[S.biome].wild.map(([id, w]) => [id, (n && SPECIES[id].el === 'Shade' ? w * 3 : n && SPECIES[id].el === 'Radiant' ? w * 0.5 : w) * (fx[SPECIES[id].el] || 1)]), tot = t.reduce((s, [, w]) => s + w, 0); let r = Math.random() * tot; for (const [id, w] of t) { r -= w; if (r <= 0) return id; } return t[0][0]; }
/* wild creatures match your team, within the biome's range */
function wildLvl() { const [a, b] = BIOMES[S.biome].lv, m = Math.round(teamAvg()); return clamp(rint(m - 2, m + 1), a, b); }

function explore() {
  if (B || TALK) return;
  if (!alive().length) { W.msg = 'Your team is exhausted. Rest in Larkhaven first.'; return; }
  if (S.pos && !curMap().biome) { W.msg = 'No wild creatures in town. Walk out into the tall grass to find them.'; return; }
  S.explored++; S.exploredIn = S.exploredIn || {}; S.exploredIn[S.biome] = (S.exploredIn[S.biome] || 0) + 1;
  const bt = beat();
  if (bt) { story(bt); return; }
  const r = Math.random();
  if (r < 0.62) {
    const n = S.team.length >= 2 ? (Math.random() < 0.6 ? 1 : Math.random() < 0.75 ? 2 : 3) : 1;
    const boost = (S.team.some(c => c.traits.includes('lucky')) ? 0.3 : 0) + journey().rare;
    const foes = []; for (let i = 0; i < n; i++) { const id = wildPick(); foes.push(newCreature(id, wildLvl(), { boost })); }
    startBattle('wild', foes);
  } else if (r < 0.76) {
    if (Math.random() < 0.5) { const c = Math.round(rint(8, 20) * journey().coins); S.coins += c; W.msg = `You find ${c} coins under a fallen log.`; }
    else { S.lures++; W.msg = 'You find a lure caught in some brambles.'; }
  } else W.msg = pick(['You follow a stream deeper into Thornwood.', 'Birdsong all around. Your team looks happy.', 'You rest in a sunny clearing for a moment.',
    'Pawprints in the mud lead off between the trees.', 'A breeze rustles the old oaks.']);
}
function story(b) {
  W.msg = ''; slog(b.text);
  talk(b.lines, () => storyFight(b));
}
function storyFight(b) {
  if (b.wild) { const [id, lvl, rar] = b.wild; startBattle('wild', [newCreature(id, lvl, { rar })], { story: b.id }); return; }
  // story opponents bring no more creatures than you have (their strongest ones last)
  // trainers' creatures appear evolved once they're past their evolution level
  const grown = (id, lvl) => { let s = id; while (SPECIES[s].evo && lvl >= SPECIES[s].evo.at) s = SPECIES[s].evo.to; return s; };
  const team = b.team.slice(-Math.max(1, S.team.length)).map(([id, lvl]) => newCreature(grown(id === '$rival' ? S.rivalStarter : id, lvl), lvl, { rar: 1 }));
  startBattle('trainer', team, { trainer: b.trainer || RIVAL.name, story: b.id });
}
function challengeWarden() { if (!B && !TALK && wardenReady() && alive().length) story(gateHere()); }
function seekElder() { if (!B && !TALK && elderReady() && alive().length) { S.story.elderFled = false; story(STORY[1]); } }
function restInTown() { if (B) return; healAll(); W.msg = 'You rest at the Larkhaven inn. Your team is fully healed.'; }
function buyLures() { if (B) return; if (S.coins < 50) { W.msg = 'Lures cost 50 coins for 5.'; return; } S.coins -= 50; S.lures += 5; W.msg = 'You buy 5 lures.'; }

/* After a battle: show the result briefly, then clear it. Auto mode keeps exploring on its own. */
function worldTick(h) {
  S.stats.play += h; ranchTick(h);
  if (TALK) return;
  if (B) { battleTick(h);
    if (B && B.over) { W.endT += h; if (W.endT > (S.auto ? 2 : 3.5)) finishBattle(); } return; }
  if (S.started) { ensurePos(); walkTick(h); }
  // Auto-explore: your tamer walks the tall grass (12-walk.js); every few seconds they check whether the team needs rest
  if (S.auto) { W.autoT += h; if (W.autoT >= 3) { W.autoT = 0; if (!alive().length || alive().length < S.team.length && alive().some(c => c.hp < stOf(c).hp * 0.3)) restInTown(); } }
}
function finishBattle() { if (!B) return; if (B.over === 'lost') healAll(); B = null; W.endT = 0; save();
  if (W.after) { const lines = W.after, done = W.afterDone; W.after = W.afterDone = null; talk(lines, done); } else if (W.afterDone) { W.afterDone(); W.afterDone = null; } }
