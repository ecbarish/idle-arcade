'use strict';
/* T31: Champions train together at the Spire. Battles, eggs and rematches use the existing systems. */
Object.assign(CAST, {
  orla: { name: 'Orla', title: 'Spire keeper', skin: '#bb8b69', hair: 'bun', hairCol: '#ece0bd', shirt: '#568e98', bg: '#cee6e6' },
  selven: { name: 'Selven', title: 'Spire regular', skin: '#d2a07d', hair: 'short', hairCol: '#68544b', shirt: '#bc8650', bg: '#eee1cc' },
  niva: { name: 'Niva', title: 'Spire regular', skin: '#94664f', hair: 'hat', hairCol: '#343a4a', hatCol: '#73999c', shirt: '#52777b', bg: '#d4e6dd' },
  brannic: { name: 'Brannic', title: 'Spire regular', skin: '#e0b999', hair: 'spiky', hairCol: '#7b5544', shirt: '#867cac', bg: '#dedbeb' }
});
FOODS.lanternseed = { name: 'Lantern seed', cost: 90, stat: 'wit' };
const ranchBeforeSpire = ensureRanch;
ensureRanch = function () { ranchBeforeSpire(); S.food.lanternseed = Math.max(0, Number(S.food.lanternseed) || 0); };
const SPIRE_REGULARS = ['selven', 'niva', 'brannic'];
const SPIRE_LINES = {
  selven: 'I kept my first bad route sketch. It reminds me to ask before I lead. Shall we compare teams?',
  niva: 'A high floor is still a place to listen. My partners have brought a new question for yours.',
  brannic: 'Last time I watched the scoreboard. Today I am watching who needs a breath. Ready when you are.'
};
function towerOpen() { return !!S.story.leagueEnding; }
function towerState() {
  const old = S.tower && typeof S.tower === "object" ? S.tower : {};
  const integer = n => Number.isFinite(Number(n)) ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER - 1, Math.floor(Number(n)))) : 0;
  S.tower = old; for (const [key,value] of Object.entries({ best: 0, floor: 0, active: false, rest: false, claimed: [], serial: 0 })) if (old[key] === undefined) old[key] = value;
  const t = S.tower; t.best = integer(t.best); t.floor = integer(t.floor); t.serial = integer(t.serial);
  t.claimed = [...new Set((Array.isArray(t.claimed) ? t.claimed : []).filter(n => Number.isInteger(n) && n > 0 && n % 10 === 0))];
  t.active = !!t.active && towerOpen(); t.rest = !!t.rest && t.active;
  return t;
}
function challengeLocked() { return leagueLocked() || towerState().active; }
function towerLevel(floor) { return Math.min(100, 74 + Math.max(1, Math.floor(floor))); }
function towerFloor(floor) {
  const areas = Object.keys(BIOMES), band = Math.min(2, Math.floor((floor - 1) / 10));
  const group = band === 0 ? areas.slice(0,3) : band === 1 ? areas.slice(3,6) : areas.slice(6);
  const area = group[(floor - 1) % group.length], level = towerLevel(floor);
  const pool = [...new Set(BIOMES[area].wild.map(([id]) => id))].filter(id => !SPECIES[id].unique);
  const grown = id => { while (SPECIES[id].evo && level >= SPECIES[id].evo.at) id = SPECIES[id].evo.to; return id; };
  const who = floor % 10 === 0 ? SPIRE_REGULARS[(floor / 10 - 1) % 3] : 'orla';
  const team = [0,1,2].map(i => grown(pool[(floor + i * 2) % pool.length]));
  return { area, level, who, team, theme: BIOMES[area].name + ' partners' };
}
function towerStart() {
  if (B || TALK || !towerOpen() || !S.pos || !curMap().tower || towerState().active) return;
  if (!alive().length) { W.msg = 'Rest your team before beginning a climb.'; return; }
  const t = towerState(); t.floor = 0; t.active = true; t.rest = false; t.serial++; S.ride = false;
  // A climb starts rested; after that only the fifth-floor benches heal the team.
  healAll(); save(); towerFight();
}
function towerFight() {
  const t = towerState(); if (B || TALK || !t.active || t.rest || !S.pos || !curMap().tower) return;
  if (!alive().length) { towerLeave(); return; }
  const floor = t.floor + 1, f = towerFloor(floor), serial = t.serial;
  const lines = [[f.who, floor % 10 === 0 ? SPIRE_LINES[f.who] : 'Floor ' + floor + ': ' + f.theme + '. A different road, a different way to work together.']];
  talk(lines, () => {
    if (!towerState().active || towerState().serial !== serial) return;
    const foes = f.team.slice(-Math.max(1,S.team.length)).map(id => newCreature(id,f.level,{rar:Math.min(3,1 + Math.floor(floor/10))}));
    startBattle('trainer',foes,{trainer:floor % 10 === 0 ? CAST[f.who].name : f.theme, towerFloor:floor, towerSerial:serial, towerAuto:!!S.auto});
  });
}
function towerReward(floor, auto) { return { coins: Math.floor((180 + floor * 20) * (auto ? .6 : 1)), lures: auto ? 1 : 2 }; }
function towerMilestone(floor) {
  const t = towerState(); if (floor % 10 || t.claimed.includes(floor)) return '';
  ensureRanch(); t.claimed.push(floor); S.food.lanternseed += 2;
  const title = floor === 10 ? 'Spire Climber' : floor === 20 ? 'Beacon Companion' : floor === 30 ? 'Lightkeeper' : 'Spire ' + floor;
  if (!S.titles.includes(title)) S.titles.push(title);
  const f = towerFloor(floor), id = baseForm(f.team[0]), child = newCreature(id,3,{rar:2});
  child.bond = 20; child.hp = null; child.born = 'A Spire milestone egg, floor ' + floor + '.';
  S.eggs.push({child,days:2,from:['The Lighthouse Spire','Your team'],hybrid:!!SPECIES[id].hybrid});
  return title + ', 2 Lantern seed, and a rare ' + SPECIES[id].name + ' egg (hatches in 2 ranch days).';
}
function towerResult(result) {
  const t = towerState();
  if (!B || !B.towerFloor || !t.active || B.towerSerial !== t.serial || B.towerFloor !== t.floor + 1) return;
  if (result !== 'won') {
    t.active = t.rest = false; t.floor = 0; S.auto = false; healAll(); placeAt('spire');
    W.after = [['orla','That is enough for this climb. Your partners come first. Every reward you earned is already yours.']];
    W.afterDone = () => { healAll(); placeAt('spire'); W.msg = 'The climb ended. Your best floor and earned rewards are kept.'; save(); }; save(); return;
  }
  t.floor = B.towerFloor; t.best = Math.max(t.best,t.floor);
  const reward = towerReward(t.floor,B.towerAuto); S.coins += reward.coins; S.lures += reward.lures;
  const milestone = towerMilestone(t.floor); bline('Floor ' + t.floor + ': +' + reward.coins + ' coins, +' + reward.lures + ' lures.' + (milestone ? ' ' + milestone : ''),'good');
  slog('Cleared Spire floor ' + t.floor + (B.towerAuto ? ' with Auto.' : '.') + (milestone ? ' Milestone: ' + milestone : ''));
  if (t.floor % 5 === 0) {
    t.rest = true;
    W.after = [['orla','Five floors together. Water and a quiet bench for every partner. Keep climbing when you are ready, or leave with your rewards.']];
    W.afterDone = () => { healAll(); placeAt('spire'); W.msg = 'Fully rested. Keep climbing or leave with your rewards.'; save(); };
  }
  save();
}
function towerContinue() { if (B || TALK || !towerState().active) return; const t=towerState(); if (t.rest) { healAll(); t.rest=false; save(); } towerFight(); }
function towerLeave() {
  if (B || TALK) return; const t=towerState(); t.active=t.rest=false; t.floor=0; S.auto=false;
  placeAt('league',1,15,'right'); W.msg='You leave with your Spire rewards. Your best floor stays in the Journal.'; save();
}
function towerTick() { if (S.auto && towerState().active && !towerState().rest) towerFight(); }
function towerPanel() {
  const t=towerState(), f=towerFloor(t.floor+1);
  return '<div class="explore"><b>The Lighthouse Spire</b><p class="msg">'+(W.msg||'A place for Champions to keep learning together.')+'</p><p class="meta">Best floor '+t.best+' · '+(t.active?'Cleared '+t.floor+'; next: '+f.theme+', level '+f.level+'.':'Floors rise from level 75 to 100.')+' Healing and a choice every 5 floors. Auto earns 60% coins, fewer lures and less XP; it waits at rests.</p><div class="acts"><button class="btn gold" data-act="'+(t.active?'towercontinue':'towerstart')+'">'+(t.rest?'Keep climbing':t.active?'Climb floor '+(t.floor+1):'Begin a rested climb')+'</button><button class="btn alt" data-act="towerleave">Leave with your rewards</button></div></div>';
}
function towerJournal() { const t=towerState(); return '<h4>The Lighthouse Spire</h4><p class="sub">'+(towerOpen()?'Best floor '+t.best+'. '+(t.active?'Current climb: '+t.floor+' cleared'+(t.rest?' · healing rest.':'.'):'Visit the path west from the league to begin.')+' Milestones pay once; their eggs hatch on the ranch. Your existing cap choice still governs growth beyond 75.':'The league ending opens the Spire. Bring your whole journey, then keep learning.')+'</p>'; }
const leagueRematchLines = {
  edrin:'Your partners have changed. Let us leave enough silence to hear what they learned.',
  maela:'Welcome back. A stronger team still needs a safe place to stand. Shall we test ours?',
  corven:'I have been practising the handover. Every partner should have useful work, even here.',
  liora:'A correction in my notebook, a new plan in yours. Let us see what the evidence says.',
  avenne:'Champion is a beginning too. We can keep teaching each other without needing another ending.'
};
function startLeagueRematch(room) {
  if (B || TALK || !towerOpen() || !S.pos || !curMap().league || leagueLocked()) return;
  const b=STORY.find(x=>x.league===room && Number.isInteger(room)); if (!b) return;
  const who=castKeyOf(b.trainer); if (!rematchReady(b.id)) { talk([[who,'One rematch each ranch day. Rest, wander, and bring me new questions.']]); return; }
  if (!alive().length) { W.msg='Rest with Nelva before a rematch.'; return; }
  const tier=rematchTier(b.id);
  talk([[who,leagueRematchLines[who]]],()=>{
    if (!rematchReady(b.id)) return;
    S.rematchDay=S.rematchDay||{}; S.rematchDay[b.id]=S.day||1;
    startBattle('trainer',rematchTeam(b.id,tier),{trainer:b.trainer,rematch:b.id,tier}); save();
  });
}
function leagueRematchPanel() {
  return '<div class="explore"><b>Returning Light League · Champion visits</b><p class="msg">'+(W.msg||'Five familiar teachers, one rematch each per ranch day. Nelva can help your team rest.')+'</p><div class="acts">'+STORY.filter(b=>Number.isInteger(b.league)).map(b=>'<button class="btn" data-act="leaguerematch" data-arg="'+b.league+'">'+b.trainer+' · '+(rematchReady(b.id)?'tier '+rematchTier(b.id):'tomorrow')+'</button>').join('')+'<button class="btn alt" data-act="leaguerest">Rest with Nelva</button><button class="btn gold" data-act="spirevisit">Walk to the Spire</button><button class="btn alt" data-act="leagueleave">Leave for Farwatch</button></div></div>';
}
const peopleBeforeSpire=npcsOf;
npcsOf=function(m) { if (!m.tower) return peopleBeforeSpire(m); const f=towerFloor(towerState().floor+1); return [{who:'orla',at:[5,14],dir:'right',tower:'keeper'}, {who:f.who,at:[9,7],dir:'down',tower:'trainer'}]; };
