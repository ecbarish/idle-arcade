/* Diagnostic only: evaluate in a fresh localhost game, never in a player's profile.
   Presentation and browser timers may be disabled by the harness; game rules remain real. */
function pacingStart(journeyKey, mode) {
  closeModal(); TALK = null; B = null; W.after = W.afterDone = null; S = fresh();
  S.era = 'pixel'; // omit delayed art-transition presentation, not rewards or rules
  chooseStarter('ripplet', 'Pacing', journeyKey, mode === 'normal' ? {} : { [mode]: true });
  skipTalk();
  window.PACING_SEEN = new WeakSet();
  window.PACING = { journey: journeyKey, mode, checkpoints: [], losses: 0, lossesBy: {}, target: 0,
    stage: 'story', lastDay: 0, restartAt: 0, end: null, challengeEnded: null };
}
function pacingSnapshot() {
  const p = window.PACING;
  return { ...p, hours: S.stats.play / 3600, badges: S.badges.slice(), team: S.team.map(c => ({ sp: c.sp, lvl: c.lvl, hp: c.hp })),
    explored: S.explored, wins: S.stats.wins, caught: S.stats.caught, coins: S.coins, champion: !!S.story.leagueEnding,
    bestFloor: towerState().best, cap: levelCap() };
}
function pacingChunk(ticks = 18000, maxHours = 240) {
  const p = window.PACING, areas = Object.keys(BIOMES);
  const mark = name => p.checkpoints.push({ name, hours: S.stats.play / 3600, levels: S.team.map(c => c.lvl), losses: p.losses });
  for (let i = 0; i < ticks && !p.end; i++) {
    if (S.stats.play >= maxHours * 3600) { p.end = 'time limit'; break; }
    if (S.modes.nuzlockeEnded && !p.challengeEnded) p.challengeEnded = { hours: S.stats.play / 3600, area: S.biome };
    if (TALK) { skipTalk(); continue; }
    if (B) {
      if (B.over) {
        if (B.over === 'lost' && !window.PACING_SEEN.has(B)) { window.PACING_SEEN.add(B); p.losses++; const key = B.story || B.npc || (B.towerFloor ? 'tower' : 'wild'); p.lossesBy[key] = (p.lossesBy[key] || 0) + 1; if (B.story && STORY.find(b => b.id === B.story && b.gate)) p.target = Math.min(levelCap(), Math.ceil(teamAvg()) + 1); }
        // Keep the actual result delay and finishBattle callbacks in worldTick.
      } else if (B.capture) {
        if (Math.abs(B.capture.pos - B.capture.zone) < .04) calmNow();
      } else {
        const foe = living('f')[0], low = living('a').some(u => u.c.hp < u.st.hp * .65);
        const needPartner = S.team.length < teamMax() || (foe && sp(foe.c).unique && !everyone().some(c => c.sp === foe.c.sp));
        if (B.kind === 'wild' && foe && needPartner && S.lures > 0 && canLure(foe.c) && (foe.c.hp < foe.st.hp * .55 || B.firstMeet && modeOn('nuzlocke'))) command('lure');
        else if (B.cmd >= 2 && low && !modeOn('hardcore')) command('rally');
        else if (B.cmd >= 1 && B.tele) command('guard');
        else if (B.cmd >= 1 && (!low || modeOn('hardcore') || B.lastInput < 0)) command('focus');
      }
      worldTick(.1); continue;
    }
    if (!challengeLocked() && S.team.length > 1 && S.ranch.length) {
      const score = c => { const st = stOf(c); return st.hp / 3 + st.pow + st.wit + st.grd + st.spi + st.spd; };
      const weakest = S.team.slice().sort((a,b) => score(a)-score(b))[0];
      const best = S.ranch.slice().sort((a,b) => score(b)-score(a))[0];
      if (score(best) > score(weakest) * 1.15) {
        const click = (act,c) => { const el = document.createElement('button'); el.dataset.act=act; el.dataset.arg=c.uid; document.body.append(el); el.click(); el.remove(); };
        click('toranch',weakest); click('toteam',best); restInTown();
      }
    }
    if (S.day !== p.lastDay) {
      p.lastDay = S.day;
      for (const c of S.team) { ensureCare(c); c.plan.act = c.fatigue > 25 ? 'rest' : 'sparring'; const food = FAVORITE[sp(c).fam] || 'grain'; c.plan.food = food;
        if ((S.food[food] || 0) < 3 && S.coins >= FOODS[food].cost * 10) buyFood(food, 10); }
      if (S.lures < 5 && S.coins >= 50) buyLures();
    }
    if (p.stage === 'story') {
      const index = S.badges.length;
      if (p.checkpoints.length < index) { mark(areas[index - 1]); p.target = 0; }
      if (index === 8) { p.stage = 'league'; p.target = 75; mark('eight badges'); continue; }
      const area = areas[index], gate = STORY.find(b => b.gate && (b.biome || 'thornwood') === area);
      if (index && teamAvg() < BIOMES[area].lv[0] - 2) {
        const previous = areas[index-1]; if (S.biome !== previous) travelTo(previous);
        if (S.team.some(c => c.hp < stOf(c).hp * .65)) restInTown();
        if (!WK.path.length) autoWalk(); worldTick(.1); continue;
      }
      if (S.biome !== area || !curMap().biome) { travelTo(area); if (!curMap().biome) { const ch = Object.keys(curMap().exits)[0]; useExit(curMap(), ch); } }
      if (!curMap().biome || S.biome !== area) { p.end = 'route blocked: ' + area; break; }
      const target = Math.max(p.target, Math.min(levelCap(), Math.max(...gate.team.map(x => x[1]))));
      if (wardenReady() && Math.min(...S.team.map(c => c.lvl)) >= target) { restInTown(); challengeWarden(); continue; }
      if (S.team.some(c => c.hp < stOf(c).hp * .65)) restInTown();
      if (!WK.path.length) autoWalk();
    } else if (p.stage === 'league') {
      if (S.story.leagueEnding) { mark('Champion'); p.stage = 'tower'; continue; }
      if (Math.min(...S.team.map(c => c.lvl)) < p.target) {
        if (leagueLocked()) leagueLeave(); if (S.pos.map !== 'farwatch') travelTo('farwatch');
        if (S.team.some(c => c.hp < stOf(c).hp * .65)) restInTown(); if (!WK.path.length) autoWalk();
      } else { if (S.pos.map !== 'league') useExit(MAPS.farwatch, 'N'); if (!leagueLocked()) { leagueTalk('keeper'); } else leagueContinue(); if (TALK) skipTalk(); if (!B && !TALK) leagueContinue(); }
    } else if (p.stage === 'tower') {
      if (towerState().best >= 10) { mark('Spire 10'); p.end = 'complete'; break; }
      if (S.pos.map !== 'spire') { useExit(MAPS.league, 'W'); }
      if (!towerState().active) towerStart(); else towerContinue();
      if (p.lossesBy.tower > 10) { p.end = 'tower entry strategy exhausted'; break; }
    }
    worldTick(.1);
  }
  return pacingSnapshot();
}

