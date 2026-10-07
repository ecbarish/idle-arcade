'use strict';
/* Battles: up to 3 vs 3, fought automatically on speed-based turns. You spend command points to steer them:
   Focus (an ally acts now, harder), Guard (allies take half damage; counters telegraphed attacks),
   Rally (heal everyone), Lure (try to catch a wild creature), Flee. Playing actively always beats Auto. */
let B = null;
const ACT_AT = 2.2;

function unit(c, side) {
  const st = stOf(c);
  if (c.hp === null || c.hp === undefined || c.hp > st.hp) c.hp = st.hp;
  return { c, side, st, atb: Math.random() * 1.2, cds: {}, buff: {}, dots: [], anim: 0, hit: 0 };
}
function startBattle(kind, foes, opts) {
  opts = opts || {};
  B = { kind, title: opts.title || '', trainer: opts.trainer || null, story: opts.story || null, npc: opts.npc || null,
    leagueDay: opts.leagueDay || null, rematch: opts.rematch || null, tier: opts.tier || 0, firstMeet: kind === 'wild' && firstMetHere(), // 15-challenge.js
    allies: S.team.filter(c => c.hp > 0).map(c => unit(c, 'a')), foes: foes.map(c => unit(c, 'f')),
    cmd: 1, cmdT: 0, t: 0, tele: null, lines: [], over: null, capture: null, fx: [], bursts: [], shake: 0, lastInput: -99 };
  for (const u of B.foes) S.seen[u.c.sp] = true;
  S.stats.battles++;
  const names = B.foes.map(u => `${u.c.name} (Lv ${u.c.lvl})`).join(', ');
  bline(kind === 'wild' ? `A wild ${names} appeared!` : `${B.trainer} sends out ${names}!`, 'sys');
}
function bline(t, cls) { B.lines.push({ t, cls }); if (B.lines.length > 40) B.lines.shift(); }
function living(side) { return (side === 'a' ? B.allies : B.foes).filter(u => u.c.hp > 0); }
function front(side) { return living(side)[0]; }
function isAuto() { return S.auto || B.t - B.lastInput > 12; }

function advantage(el, target) {
  if (!el) return 1; const te = sp(target.c).el;
  if (ELEMENTS[el].beats.includes(te)) return 1.5;
  if (ELEMENTS[te] && ELEMENTS[te].beats.includes(el)) return 0.67;
  return 1;
}
function damage(att, def, mv, mult) {
  const A = mv.spec ? att.st.wit : att.st.pow, D = mv.spec ? def.st.spi : def.st.grd;
  let d = ((2 * att.c.lvl / 5 + 2) * mv.pow * A / Math.max(1, D)) / 50 + 2;
  d *= (mv.el && mv.el === sp(att.c).el ? 1.2 : 1) * advantage(mv.el, def) * (0.85 + Math.random() * 0.15) * (mult || 1);
  if (att.buff.dmg > 0) d *= 1.25;
  if (def.buff.guard > 0) d *= def.side === 'a' && def.buff.guardCmd ? 0.5 : 0.6;
  if (att.c.traits.includes('ferocious')) d *= 1.1; if (def.c.traits.includes('thick')) d *= 0.9;
  const crit = Math.random() < 0.06 + (att.c.traits.includes('keen') ? 0.08 : 0); if (crit) d *= 1.5;
  return { d: Math.max(1, Math.round(d)), crit, adv: advantage(mv.el, def) };
}
function hurt(u, d, crit, el) { u.c.hp = Math.max(0, u.c.hp - d); u.hit = 0.3; B.fx.push({ u, txt: '-' + d, col: crit ? '#ffd23a' : '#ffffff', age: 0 });
  if (el !== undefined) burst(u, el && ELEMENTS[el] ? ELEMENTS[el].col : '#ffffff', 'hit', crit);
  if (crit) B.shake = 0.25; sfx(crit ? 'crit' : 'hit');
  if (u.c.hp <= 0) { u.downAt = B.t; bline(`${u.c.name} fainted!`, 'warn'); sfx('faint'); } }
/* a visual effect at a unit's spot: hit sparks, heal sparkles, the catch flash */
function burst(u, col, kind, big) { const list = u.side === 'a' ? B.allies : B.foes; B.bursts.push({ side: u.side, i: list.indexOf(u), col, kind, big: !!big, age: 0 }); }

function chooseMove(u) {
  const allies = living(u.side), moves = movesOf(u.c).filter(m => !(u.cds[m] > 0));
  const low = allies.find(x => x.c.hp < x.st.hp * 0.45);
  if (low && moves.includes('regrowth')) return 'regrowth';
  for (const m of moves) { const k = MOVES[m].kind;
    if (k === 'buff' && !allies.some(x => x.buff.dmg > 0)) return m;
    if (k === 'haste' && !allies.some(x => x.buff.haste > 0)) return m;
    if (k === 'guard' && !allies.some(x => x.buff.guard > 0) && Math.random() < 0.6) return m;
    if (k === 'slow' || k === 'dot') { if (Math.random() < 0.5) return m; } }
  if (u.side === 'f' && modeOn('hardcore')) { const m = hardcoreMove(u, moves); if (m) return m; }
  const dmg = moves.filter(m => ['hit', 'aoe'].includes(MOVES[m].kind)).sort((a, b) => MOVES[b].pow - MOVES[a].pow);
  return dmg[0] || movesOf(u.c)[0];
}
function act(u, forced, mult) {
  const m = forced || chooseMove(u), mv = MOVES[m], foes = living(u.side === 'a' ? 'f' : 'a'), allies = living(u.side);
  if (!foes.length) return;
  u.cds[m] = mv.cd; u.anim = 0.25;
  const aim = u.focus && u.focus.c.hp > 0 ? u.focus : null; u.focus = null; // Hardcore foes go for your weakest
  const target = () => aim || (Math.random() < 0.65 ? foes[0] : pick(foes));
  // telegraph a big enemy attack so the player can Guard in time
  if (u.side === 'f' && !forced && (mv.kind === 'aoe' || mv.pow >= 80) && !B.tele) {
    B.tele = { u, m, t: 1.6 }; sfx('warn'); bline(`${u.c.name} is gathering power for ${mv.name}!`, 'warn');
    if (isAuto() && Math.random() < 0.5 && B.cmd >= 1) setTimeout(() => B && B.tele && command('guard', true), 700);
    return;
  }
  resolve(u, m, mv, foes, allies, target, mult);
}
function resolve(u, m, mv, foes, allies, target, mult) {
  switch (mv.kind) {
    case 'hit': { const t = target(), r = damage(u, t, mv, mult); hurt(t, r.d, r.crit, mv.el);
      bline(`${u.c.name} used ${mv.name}${r.crit ? ', a critical hit' : ''} on ${t.c.name} for ${r.d}${r.adv > 1 ? '. It hits hard!' : r.adv < 1 ? '. Not very effective.' : '.'}`, u.side === 'a' ? 'ally' : 'foe'); break; }
    case 'aoe': for (const t of foes) { const r = damage(u, t, mv, (mult || 1) * 0.75); hurt(t, r.d, r.crit, mv.el); } bline(`${u.c.name} used ${mv.name} on everyone!`, u.side === 'a' ? 'ally' : 'foe'); break;
    case 'dot': { const t = target(); t.dots.push({ per: Math.max(1, Math.round(damage(u, t, mv, mult).d / 2)), left: 4, tick: 1 }); bline(`${u.c.name} used ${mv.name}. ${t.c.name} is poisoned.`, u.side === 'a' ? 'ally' : 'foe'); break; }
    case 'buff': for (const a of allies) a.buff.dmg = 6; bline(`${u.c.name} used ${mv.name}! Its team hits harder.`, 'sys'); break;
    case 'haste': for (const a of allies) a.buff.haste = 6; bline(`${u.c.name} used ${mv.name}! Its team speeds up.`, 'sys'); break;
    case 'guard': for (const a of allies) a.buff.guard = 4; bline(`${u.c.name} used ${mv.name}! Its team braces.`, 'sys'); break;
    case 'slow': { const t = target(); t.buff.slow = 5; bline(`${u.c.name} used ${mv.name}. ${t.c.name} slows down.`, 'sys'); break; }
    case 'heal': { const low = allies.slice().sort((a, b) => a.c.hp / a.st.hp - b.c.hp / b.st.hp)[0]; const h = Math.round(low.st.hp * 0.25);
      low.c.hp = Math.min(low.st.hp, low.c.hp + h); B.fx.push({ u: low, txt: '+' + h, col: '#7cf08a', age: 0 }); burst(low, '#7cf08a', 'heal'); sfx('heal'); bline(`${u.c.name} used ${mv.name}. ${low.c.name} recovers ${h}.`, 'sys'); break; }
  }
}

function command(kind, auto) {
  if (!B || B.over || B.capture) return;
  if (!auto) B.lastInput = B.t;
  const cost = { focus: 1, guard: 1, rally: 2 }[kind] || 0;
  if (B.cmd < cost) { bline('Not enough command points.', 'warn'); return; }
  if (kind === 'focus') { const u = living('a').sort((a, b) => b.st.pow + b.st.wit - a.st.pow - a.st.wit)[0]; if (!u) return; B.cmd -= 1;
    const best = movesOf(u.c).filter(m => ['hit', 'aoe'].includes(MOVES[m].kind)).sort((a, b) => MOVES[b].pow - MOVES[a].pow)[0];
    bline(`You call to ${u.c.name}: now!`, 'cmd'); u.cds[best] = 0; act(u, best, 1.3); u.atb = 0; Cr.addBond(u.c, 1); }
  if (kind === 'guard') { B.cmd -= 1; for (const a of living('a')) { a.buff.guard = 3; a.buff.guardCmd = 1; } bline(auto ? 'Your team braces.' : 'Guard! Your team braces for the hit.', 'cmd'); }
  if (kind === 'rally' && modeOn('hardcore')) { bline('Hardcore: no Rally. Your team has to hold on by itself.', 'warn'); return; }
  if (kind === 'rally') { B.cmd -= 2; for (const a of living('a')) { const h = Math.round(a.st.hp * 0.2); a.c.hp = Math.min(a.st.hp, a.c.hp + h); Cr.addBond(a.c, 1); } bline('You rally your team. Everyone recovers.', 'cmd'); }
  if (kind === 'flee' && B.kind === 'wild') { bline('You slip away.', 'sys'); endBattle('fled'); }
  if (kind === 'lure') startCapture();
}
/* Capturing: a lure plus a timing meter. Weaker, calmer creatures are easier. */
function startCapture() {
  if (B.kind !== 'wild') { bline("You can't catch another tamer's creature.", 'warn'); return; }
  if (S.lures <= 0) { bline('You are out of lures. Buy more in Larkhaven.', 'warn'); return; }
  const t = living('f').sort((a, b) => a.c.hp / a.st.hp - b.c.hp / b.st.hp)[0]; if (!t) return;
  if (!canLure(t.c)) { bline(`Nuzlocke: you've already met your one creature in ${BIOMES[S.biome].name}. ${t.c.name} can't be caught.`, 'warn'); return; }
  S.lures--; B.capture = { t, pos: 0, dir: 1, zone: 0.62 + Math.random() * 0.2 }; bline(`You throw a lure at ${t.c.name}. Calm it: press Calm when the marker is in the green.`, 'cmd');
}
function calmNow() {
  const cap = B && B.capture; if (!cap) return; B.lastInput = B.t;
  const off = Math.abs(cap.pos - cap.zone), q = off < 0.04 ? 'perfect' : off < 0.1 ? 'good' : 'miss';
  const t = cap.t, rar = t.c.rar, hpPct = t.c.hp / t.st.hp;
  let ch = (sp(t.c).unique ? 0.12 : [0.55, 0.42, 0.3, 0.2, 0.1, 0.05][rar]) * (1.5 - hpPct) * (q === 'perfect' ? 1.6 : q === 'good' ? 1.3 : 1);
  if (S.team.some(c => c.traits.includes('gentle'))) ch *= 1.15;
  B.capture = null;
  if (Math.random() < Math.min(0.95, ch)) {
    const c = t.c; burst(t, '#7cf08a', 'catch', true); sfx('catch'); B.foes = B.foes.filter(u => u !== t); const where = keep(c); S.stats.caught++;
    bline(`${q === 'perfect' ? 'Perfect calm! ' : q === 'good' ? 'Nicely done. ' : ''}${c.name} trusts you. Caught! (sent to your ${where})`, 'good');
    toast(`Caught ${c.name}${c.rar ? ` (${Cr.RARITY[c.rar].name})` : ''}!`); slog(`Caught ${c.name} (level ${c.lvl}${c.rar ? ', ' + Cr.RARITY[c.rar].name.toLowerCase() : ''}) in ${BIOMES[S.biome].name}.`);
    if (sp(c).unique) { if (B.story) S.story[B.story] = true; if (c.sp === 'elderhorn') S.story.elderCaught = true; slog(`${c.name} chose to come with you.`); }
    if (!living('f').length) endBattle('caught');
  } else { sfx('miss'); bline(`${q === 'miss' ? 'It shies away. ' : ''}${t.c.name} broke free!`, 'warn'); }
}

function battleTick(h) {
  if (!B || B.over) return;
  B.t += h;
  if (B.capture) { const c = B.capture; c.pos += c.dir * h * 0.9; if (c.pos > 1) { c.pos = 1; c.dir = -1; } if (c.pos < 0) { c.pos = 0; c.dir = 1; }
    if (isAuto() && B.t - B.lastInput > 12) calmNow(); return; }
  B.cmdT += h; if (B.cmdT >= 5) { B.cmdT = 0; B.cmd = Math.min(3, B.cmd + 1); }
  if (isAuto() && B.cmd >= 3) command('focus', true);
  if (B.tele) { B.tele.t -= h; if (B.tele.t <= 0) { const { u, m } = B.tele; B.tele = null;
    if (u.c.hp > 0 && living('a').length) resolve(u, m, MOVES[m], living('a'), living('f'), () => (Math.random() < 0.65 ? living('a')[0] : pick(living('a'))) || living('a')[0]); } }
  for (const u of [...B.allies, ...B.foes]) {
    if (u.c.hp <= 0) continue;
    for (const k in u.cds) u.cds[k] = Math.max(0, u.cds[k] - h);
    for (const k of ['dmg', 'haste', 'guard', 'slow']) if (u.buff[k] > 0) { u.buff[k] -= h; if (u.buff[k] <= 0 && k === 'guard') u.buff.guardCmd = 0; }
    for (const d of u.dots) { d.tick -= h; if (d.tick <= 0) { d.tick = 1; d.left--; hurt(u, d.per); } } u.dots = u.dots.filter(d => d.left > 0);
    u.anim = Math.max(0, u.anim - h);
    if (u.c.hp <= 0 || (B.tele && B.tele.u === u)) continue;
    u.atb += h * (u.st.spd + 40) / 100 * (u.buff.haste > 0 ? 1.3 : 1) * (u.buff.slow > 0 ? 0.6 : 1) * (u.c.traits.includes('swift') ? 1.1 : 1);
    if (u.atb >= ACT_AT) { u.atb = 0; act(u); }
    if (!living('f').length) return endBattle('won');
    if (!living('a').length) return endBattle('lost');
  }
  for (const f of B.fx) f.age += h; B.fx = B.fx.filter(f => f.age < 1);
  for (const f of B.bursts) f.age += h; B.bursts = B.bursts.filter(f => f.age < 0.6);
  for (const u of [...B.allies, ...B.foes]) u.hit = Math.max(0, u.hit - h); B.shake = Math.max(0, B.shake - h);
}
function endBattle(result) {
  if (!B || B.over) return; B.over = result; sfx(result === 'lost' ? 'lose' : result === 'fled' ? 'select' : 'win');
  if (result === 'won' || result === 'caught') {
    const foes = B.foes.concat([]), lvSum = B.foes.reduce((s, u) => s + u.c.lvl, 0) || 3;
    const base = lvSum * 12 * (B.kind === 'wild' ? 1 : 1.6) * xpMult(), coins = Math.round(lvSum * (B.kind === 'wild' ? 3 : 12) * journey().coins);
    if (result === 'won') { S.stats.wins++; S.coins += coins; bline(`You win! +${coins} coins.`, 'good'); }
    const msgs = [];
    const avgFoe = lvSum / Math.max(1, B.foes.length + (result === 'caught' ? 1 : 0));
    // much less xp from foes far below your level, so you move on instead of grinding
    const scale = c => Math.min(1.2, Math.pow(Math.max(1, avgFoe) / c.lvl, 2));
    for (const u of B.allies) { if (u.c.hp <= 0) { msgs.push(...grow(u.c, Math.round(base * 0.3 * scale(u.c)))); continue; } msgs.push(...grow(u.c, Math.round(base * scale(u.c)))); Cr.addBond(u.c, B.kind === 'wild' ? 0.5 : 2); }
    // XP share: creatures resting on the ranch learn from watching, at a quarter of the XP
    if (S.xpShare) for (const c of S.ranch) for (const m of grow(c, Math.round(base * 0.25 * scale(c)))) if (/evolved/.test(m)) msgs.push(m);
    for (const m of msgs) { bline(m, 'good'); if (/evolved|learned/.test(m)) toast(m); }
    // a legendary knocked out (not befriended) slips away and can be found again later
    const legend = B.kind === 'wild' && B.foes.find(f => sp(f.c).unique);
    if (B.story && legend) { if (B.story === 'elder') S.story.elderFled = true; else S.story[B.story + 'Retry'] = S.explored + 6;
      bline(`${legend.c.name} staggers up and slips away. It might let you approach another time.`, 'warn'); }
    else if (B.story) storyWin(B.story);
  }
  if (B.npc) trainerResult(B.npc, result); // a route trainer (12-walk.js)
  if (B.rematch) rematchResult(B.rematch, B.tier, result); // 15-challenge.js
  nuzlockeAfter();
  if (result === 'lost' && B.story) S.story[B.story + 'Retry'] = S.explored + 4;
  if (result === 'lost') { const lost = Math.round(S.coins * 0.1); S.coins -= lost; bline(`Your team is exhausted. ${B.leagueDay ? "You return to the league entrance" : "You hurry back to Larkhaven"} (−${lost} coins).`, 'warn');
    if (B.story === 'elder') S.story.elderFled = true; }
  if (result === 'fled' && B.story) { if (B.story === 'elder') S.story.elderFled = true; else S.story[B.story + 'Retry'] = S.explored + 4; }
  if (B.leagueDay && result !== 'won') leagueDefeat();
  B.endAt = B.t;
}
