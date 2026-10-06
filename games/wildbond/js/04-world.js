'use strict';
/* Exploring, the story, and the town of Larkhaven. */
const W = { msg: '', autoT: 0, endT: 0 };

function chooseStarter(id, name) {
  S.name = (name || 'Tamer').replace(/[<>&"]/g, '').slice(0, 14) || 'Tamer';
  const c = newCreature(id, 5, { rar: 1, born: 'Your first partner, from Larkhaven.' });
  S.started = true; S.starter = id; S.team = [c]; S.seen[id] = S.caught[id] = true;
  slog(`${S.name} arrived in Larkhaven and chose ${c.name}.`);
  // the rival picks the starter that beats yours
  const rival = newCreature(COUNTER[id], 4, { rar: 1 });
  S.rivalStarter = COUNTER[id];
  startBattle('trainer', [rival], { trainer: RIVAL.name, story: 'rival1' });
  bline(`Wren grins. "I picked ${rival.name} on purpose. Let's see what you've got!"`, 'say');
  save();
}
function storyWin(id) {
  S.story[id] = true;
  const msgs = { rival1: 'Wren laughs. "Okay, not bad! See you out in Thornwood."', rival2: 'Wren shakes your hand. "You and your team are really clicking. I won\'t lose next time."',
    warden: 'Warden Isolde nods. "Your bond is real. Take the Thorn Badge. The road north is yours."' };
  if (msgs[id]) bline(msgs[id], 'say');
  if (id === 'warden' && !S.badges.includes('thorn')) {
    S.badges.push('thorn'); S.coins += 300; toast('You earned the Thorn Badge!'); slog('Earned the Thorn Badge from Warden Isolde.');
    if (!S.eras.includes('bit16')) S.eras.push('bit16');
    setTimeout(() => toast('The world shimmers... the 16-bit art style is unlocked. Switch it in the Journal.'), 2500);
  }
}
function beat() { return STORY.find(b => S.explored >= b.at && !S.story[b.id] && !(S.explored < (S.story[b.id + 'Retry'] || 0)) && !(b.id === 'elder' && S.story.elderFled) && b.id !== 'warden'); }
function wardenReady() { return S.explored >= STORY[2].at && !S.story.warden; }
function elderReady() { return S.story.elderFled && !S.story.elderCaught && S.badges.includes('thorn'); }

function teamAvg() { return S.team.length ? S.team.reduce((s, c) => s + c.lvl, 0) / S.team.length : 1; }
function wildPick() { const t = BIOMES[S.biome].wild, tot = t.reduce((s, [, w]) => s + w, 0); let r = Math.random() * tot; for (const [id, w] of t) { r -= w; if (r <= 0) return id; } return t[0][0]; }
/* wild creatures match your team, within the biome's range */
function wildLvl() { const [a, b] = BIOMES[S.biome].lv, m = Math.round(teamAvg()); return clamp(rint(m - 2, m + 1), a, b); }

function explore() {
  if (B) return;
  if (!alive().length) { W.msg = 'Your team is exhausted. Rest in Larkhaven first.'; return; }
  S.explored++;
  const bt = beat();
  if (bt) { story(bt); return; }
  const r = Math.random();
  if (r < 0.62) {
    const n = S.team.length >= 2 ? (Math.random() < 0.6 ? 1 : Math.random() < 0.75 ? 2 : 3) : 1;
    const foes = []; for (let i = 0; i < n; i++) { const id = wildPick(); foes.push(newCreature(id, wildLvl(), { boost: S.team.some(c => c.traits.includes('lucky')) ? 0.3 : 0 })); }
    startBattle('wild', foes);
  } else if (r < 0.76) {
    if (Math.random() < 0.5) { const c = rint(8, 20); S.coins += c; W.msg = `You find ${c} coins under a fallen log.`; }
    else { S.lures++; W.msg = 'You find a lure caught in some brambles.'; }
  } else W.msg = pick(['You follow a stream deeper into Thornwood.', 'Birdsong all around. Your team looks happy.', 'You rest in a sunny clearing for a moment.',
    'Pawprints in the mud lead off between the trees.', 'A breeze rustles the old oaks.']);
}
function story(b) {
  W.msg = '';
  if (b.wild) { const [id, lvl, rar] = b.wild; slog(b.text); startBattle('wild', [newCreature(id, lvl, { rar })], { story: b.id }); bline(b.text, 'say'); return; }
  // story opponents bring no more creatures than you have (their strongest ones last)
  const team = b.team.slice(-Math.max(1, S.team.length)).map(([id, lvl]) => newCreature(id === '$rival' ? S.rivalStarter : id, lvl, { rar: 1 }));
  startBattle('trainer', team, { trainer: b.trainer || RIVAL.name, story: b.id }); bline(b.text, 'say');
}
function challengeWarden() { if (!B && wardenReady() && alive().length) story(STORY[2]); }
function seekElder() { if (!B && elderReady() && alive().length) { S.story.elderFled = false; story(STORY[1]); } }
function restInTown() { if (B) return; healAll(); W.msg = 'You rest at the Larkhaven inn. Your team is fully healed.'; }
function buyLures() { if (B) return; if (S.coins < 50) { W.msg = 'Lures cost 50 coins for 5.'; return; } S.coins -= 50; S.lures += 5; W.msg = 'You buy 5 lures.'; }

/* After a battle: show the result briefly, then clear it. Auto mode keeps exploring on its own. */
function worldTick(h) {
  S.stats.play += h; ranchTick(h);
  if (B) { battleTick(h);
    if (B && B.over) { W.endT += h; if (W.endT > (S.auto ? 2 : 3.5)) finishBattle(); } return; }
  if (S.auto) { W.autoT += h; if (W.autoT >= 3) { W.autoT = 0; if (!alive().length || alive().length < S.team.length && alive().some(c => c.hp < stOf(c).hp * 0.3)) restInTown(); else explore(); } }
}
function finishBattle() { if (!B) return; if (B.over === 'lost') healAll(); B = null; W.endT = 0; save(); }
