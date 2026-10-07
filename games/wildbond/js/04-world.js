'use strict';
/* Exploring, the story, and the town of Larkhaven. */
const W = { msg: '', autoT: 0, endT: 0 };

function chooseStarter(id, name, pace, modes) {
  S.name = (name || 'Tamer').replace(/[<>&"]/g, '').slice(0, 14) || 'Tamer';
  if (JOURNEY[pace]) S.journey = pace;
  S.modes = Object.assign({}, modes || {}); if (S.modes.randomizer) S.modes.seed = 1 + Math.floor(Math.random() * 2e9); // challenge modes (15-challenge.js)
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
  const leagueBeat = STORY.find(b => b.id === id && b.league !== undefined);
  if (leagueBeat) { leagueVictory(leagueBeat); return; }
  S.story[id] = true;
  // the after-battle scene plays once the result screen closes (see finishBattle)
  W.after = id === 'rival1' ? SCENES.rival1Win : (STORY.find(b => b.id === id) || {}).win || null;
  const g = STORY.find(b => b.id === id && b.gate);
  if (g && !S.badges.includes(g.gate)) {
    const badge = BADGES[g.gate].name;
    S.badges.push(g.gate); S.coins += 300 * S.badges.length; slog(`Earned the ${badge} from ${g.trainer}.`); checkTitles();
    // the first badge brings the world\'s color back (Pocket -> 16-bit), and Warden's boots for running
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
function wildPick() { const n = isNight(), fx = WEATHER_FX[weatherNow()] || {}, t = BIOMES[S.biome].wild.map(([id, w]) => [id, (n && SPECIES[id].el === 'Shade' ? w * 3 : n && SPECIES[id].el === 'Radiant' ? w * 0.5 : w) * (fx[SPECIES[id].el] || 1)]), tot = t.reduce((s, [, w]) => s + w, 0); let r = Math.random() * tot; for (const [id, w] of t) { r -= w; if (r <= 0) return randomized(id); } return randomized(t[0][0]); }
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
  startBattle('trainer', team, { trainer: b.trainer || RIVAL.name, story: b.id, leagueDay: b.league !== undefined ? leagueState().day : null });
}
function challengeWarden() { if (!B && !TALK && wardenReady() && alive().length) story(gateHere()); }
function seekElder() { if (!B && !TALK && elderReady() && alive().length) { S.story.elderFled = false; story(STORY[1]); } }
function restInTown() { if (B || challengeLocked()) { if (!B) W.msg = 'Rest between league rooms or at the fifth Spire floor; leave the attempt before visiting Larkhaven.'; return; } healAll(); W.msg = 'You rest at the Larkhaven inn. Your team is fully healed.'; }
function buyLures() { if (B) return; if (S.coins < 50) { W.msg = 'Lures cost 50 coins for 5.'; return; } S.coins -= 50; S.lures += 5; W.msg = 'You buy 5 lures.'; }

/* After a battle: show the result briefly, then clear it. Auto mode keeps exploring on its own. */
function worldTick(h) {
  S.stats.play += h; ranchTick(h); leagueState();
  if (TALK) return;
  if (B) { battleTick(h);
    if (B && B.over) { W.endT += h; if (W.endT > (S.auto ? 2 : 3.5)) finishBattle(); } return; }
  if (S.pos && curMap().tower) { towerTick(); if (B || TALK) return; walkTick(h); return; }
  if (S.started) { ensurePos(); walkTick(h); }
  // Auto-explore: your tamer walks the tall grass (12-walk.js); every few seconds they check whether the team needs rest
  if (S.auto) { W.autoT += h; if (W.autoT >= 3) { W.autoT = 0; if (!alive().length || alive().length < S.team.length && alive().some(c => c.hp < stOf(c).hp * 0.3)) restInTown(); } }
}
function finishBattle() { if (!B) return; if (B.over === 'lost') healAll(); B = null; W.endT = 0; save();
  if (W.after) { const lines = W.after, done = W.afterDone; W.after = W.afterDone = null; talk(lines, done); } else if (W.afterDone) { W.afterDone(); W.afterDone = null; } }

/* T30: the league uses existing story fights, result scenes and the ranch day. */
function leagueOpen() { return Object.keys(BADGES).every(id => S.badges.includes(id)); }
function leagueState() {
  S.league = S.league || { day: 0, room: 0, active: false, rest: false };
  if (S.league.day !== (S.day || 1)) {
    const wasActive = S.league.active;
    S.league = { day: S.day || 1, room: 0, active: false, rest: false };
    if (wasActive && S.pos && MAPS[S.pos.map] && curMap().league && !B) { placeAt('league'); W.msg = 'A new ranch day begins. The league rooms are ready for a fresh attempt.'; }
  }
  return S.league;
}
function leagueLocked() { return leagueState().active; }
function leagueBeat() { return STORY.find(b => b.league === (!S.story.leagueWren ? 'wren' : leagueState().room)); }
function leagueTalk(room) {
  if (B || TALK || !S.pos || !curMap().league || !leagueOpen()) return;
  if (room === 'keeper') { talk([['nelva', leagueLocked() ? 'Your cleared rooms are kept for today. Continue with the same team, or leave this attempt to visit the ranch.' : 'Welcome. There is a dry bench here; take your time before meeting Wren.']], () => { if (!leagueLocked()) { healAll(); save(); } }); return; }
  if (S.story.leagueEnding && Number.isInteger(room)) { startLeagueRematch(room); return; }
  if (S.story.leagueChampion) { if (!S.story.leagueEnding) leagueEnding(); else if (room === 'wren') talk([['wren','Champion! Come back to Larkhaven with me sometime. I want to show Maren our notes.']]); else { const who = castKeyOf((STORY.find(b => b.league === room) || {}).trainer) || 'avenne'; talk([[who,'Welcome back, Champion. These roads are still yours to walk. The Lighthouse Spire and daily league rematches are open.']]); } return; }
  const b = leagueBeat();
  if (!b) { W.msg = 'Return to the entrance for a fresh attempt.'; return; }
  if (leagueState().rest) { talk([['nelva','A quiet rest between courts. Your team is fully healed; take the next room when you are ready.']], () => { healAll(); S.league.rest = false; placeAt('league',7 + S.league.room * 7,9,'up'); save(); }); return; }
  if (b.league !== room) { W.msg = !S.story.leagueWren ? 'Meet Wren at the gate first.' : 'Visit the next court in order: ' + b.title + '.'; return; }
  if (!alive().length) { W.msg = 'Rest at the entrance before beginning.'; return; }
  const run = leagueState(); run.active = true; S.ride = false;
  placeAt('league', room === 'wren' ? 3 : 7 + room * 7, room === 'wren' ? 13 : 8, 'up');
  story(b);
}
function leagueContinue() { const b = leagueBeat(); if (S.story.leagueChampion) { leagueTalk(4); return; } if (b) leagueTalk(b.league); }
function leagueLeave() {
  if (B || TALK) return;
  S.league = { day: S.day || 1, room: 0, active: false, rest: false };
  placeAt('farwatch',12,1,'down'); W.msg = 'You leave the league attempt. Visit the ranch freely; the four courts begin again when you return.'; save();
}
function leagueVictory(b) {
  const run = leagueState();
  if (!B || B.leagueDay !== run.day) { W.after = [['nelva','The ranch day changed during that battle. Rest here; the courts begin afresh today.']]; W.afterDone = () => { healAll(); placeAt('league'); save(); }; return; }
  if (b.league === 'wren') S.story.leagueWren = true;
  else { run.room = b.league + 1; S.story[b.id] = true; }
  if (b.id === 'leagueChampion') { W.after = b.win.concat(SCENES.leagueEnding); W.afterDone = completeLeagueEnding; return; }
  run.rest = true;
  const next = STORY.find(x => x.league === run.room);
  W.after = b.win.concat([['nelva','Water, warm cloths, and a quiet moment. Every partner is counted. Your team is fully healed for the next court.']]);
  W.afterDone = () => { healAll(); run.rest = false; placeAt('league',7 + run.room * 7,9,'up'); W.msg = 'Rested. Next: ' + next.title + '. Cleared rooms last for this ranch day.'; save(); };
  slog(b.text);
}
function leagueDefeat() {
  const run = leagueState();
  W.after = (W.after || []).concat([['nelva','Come back to the entrance. We will help your partners rest. Today\'s cleared rooms are still yours; try the next one when you are ready.']]);
  W.afterDone = () => { healAll(); placeAt('league'); W.msg = 'Your team is rested. Continue today\'s attempt, or leave it to visit the ranch.'; save(); };
  run.active = true; placeAt('league');
}
function leagueEnding() { talk(SCENES.leagueEnding,completeLeagueEnding); }
function completeLeagueEnding() {
  healAll(); S.story.leagueEnding = true; S.titles = S.titles || [];
  if (!S.titles.includes('Champion')) { S.titles.push('Champion'); slog('Champion of the Returning Light League: the world\'s colour is fully restored. The Lighthouse Spire is open.'); toast('Title earned: Champion!'); sfx('badge'); }
  S.league.active = false; placeAt('league',3,14,'down'); W.msg = 'Champion! Your journey is complete. The Lighthouse Spire and daily league rematches are open.'; save();
}
function leaguePanel() {
  if (S.story.leagueEnding) return leagueRematchPanel();
  const run = leagueState(), b = leagueBeat();
  return '<div class="explore"><b>Returning Light League</b><p class="msg">' + (W.msg || 'Meet Wren at the gate, then follow the four courts to the Champion terrace.') + '</p><p class="meta">Day ' + (S.day || 1) + ' · ' + Math.min(4,run.room) + '/4 courts cleared. Healing rests between rooms; leaving ends this attempt. Walk with WASD/arrows, or tap a person.</p><div class="acts"><button class="btn gold" data-act="league">' + (S.story.leagueChampion ? S.story.leagueEnding ? 'Greet the Champion' : 'See the ending' : b.league === 'wren' ? 'Meet Wren at the gate' : 'Visit ' + b.title) + '</button><button class="btn alt" data-act="leagueleave">Leave for Farwatch</button></div></div>';
}
function leagueJournal() { return '<h4>The Returning Light League</h4><p class="sub">' + (S.story.leagueEnding ? 'Champion. The world\'s colour is fully restored. Wren, Maren and Isolde welcomed your team home. The Lighthouse Spire and daily league rematches are open.' : S.story.leagueChampion ? 'Champion battle won. Return to the league to see the ending.' : S.story.leagueWren ? 'Wren\'s last gate battle is won. Today: ' + Math.min(4,leagueState().room) + '/4 courts cleared; the Champion waits beyond them.' : 'Eight badges open the league road from Farwatch. Wren waits at the gate.') + '</p>'; }
