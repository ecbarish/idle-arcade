'use strict';
/* Walkable towns (S4), on the arcade's world kit (shared/world.js): Wildbond's walking and HD-2D look, in Realmbound's
   colours. Arriving in town, the scene turns into the hub you can walk around (arrow keys / WASD, or tap where to go;
   Enter or Space talks to whoever you face):
   - the Inn (rest and heal everyone), the Smithy (sell junk and repair), the Trainer (talents), the Stable (mounts)
     and the Guild hall (the Guild tab, and founding a guild); doors open the matching tab;
   - the quest board and a quest giver (offers the next quest in a scene), townsfolk, and now and then Pell the
     travelling peddler with his mule Brisket (docs/lore/multiverse.md), who sells a healing potion;
   - the town gate takes you back out on the road.
   On Auto your hero strolls to the smithy, then out of the gate. Outside the scene (tests, hidden tabs) town works
   exactly as before. Each hub keeps the zone's own colours and its faction's roofs; the layout is shared for now. */
const TOWN_TILES = { ',': {}, f: {}, '.': {}, '~': { solid: 1 }, T: { solid: 1 }, '#': { solid: 1 }, '=': { solid: 1 }, L: { solid: 1 }, O: { solid: 1 },
  D: { door: 1 }, P: { sign: 1, solid: 1 }, G: { exit: 1 } };
const TOWN_W = 28, TOWN_H = 16;
/* buildings: their footprint, the door on the bottom row (facing the street) and what it opens */
const TOWN_BUILDINGS = [
  { kind: 'inn', name: 'Inn', x: 2, y: 2, w: 5, h: 3, door: 4 },
  { kind: 'smith', name: 'Smithy', x: 8, y: 3, w: 4, h: 2, door: 9 },
  { kind: 'guild', name: 'Guild hall', x: 12, y: 1, w: 5, h: 4, door: 14 },
  { kind: 'trainer', name: 'Trainer', x: 18, y: 3, w: 4, h: 2, door: 19 },
  { kind: 'stable', name: 'Stable', x: 23, y: 2, w: 3, h: 3, door: 24 }
];
function townMap() {
  const g = Array.from({ length: TOWN_H }, (_, y) => Array.from({ length: TOWN_W }, (_, x) => (y === 0 || x === 0 || x === TOWN_W - 1 || y === TOWN_H - 1) ? 'T' : ','));
  const doors = {};
  for (const b of TOWN_BUILDINGS) { for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) g[y][x] = '#'; const dy = b.y + b.h - 1; g[dy][b.door] = 'D'; doors[b.door + ',' + dy] = b;
    for (let y = dy + 1; y <= 6; y++) g[y][b.door] = '.'; }
  for (let x = 2; x <= 25; x++) g[6][x] = '.';
  for (let y = 7; y < TOWN_H - 1; y++) { g[y][13] = '.'; g[y][14] = '.'; }
  for (let y = 8; y <= 10; y++) for (let x = 10; x <= 17; x++) g[y][x] = '.';
  g[TOWN_H - 1][13] = 'G'; g[TOWN_H - 1][14] = 'G';
  g[9][11] = 'O'; g[8][17] = 'P';
  for (const [x, y] of [[7, 7], [20, 7], [12, 12], [15, 12]]) g[y][x] = 'L';
  for (const [x, y] of [[3, 10], [5, 12], [22, 11], [24, 13], [2, 14], [9, 13], [19, 13], [26, 9]]) g[y][x] = 'T';
  for (const [x, y] of [[3, 8], [4, 8], [4, 9], [21, 9], [22, 9], [10, 12], [17, 13], [25, 12]]) g[y][x] = 'f';
  for (let x = 22; x <= 26; x++) if (g[5][x] === ',') g[5][x] = '=';
  return { rows: g.map(r => r.join('')), doors, start: [13, TOWN_H - 2, 'up'] };
}
const TOWN = { map: townMap(), pos: { x: 13, y: TOWN_H - 2, dir: 'up' }, on: false, cam: null, last: null, auto: null };
/* the people of the hub (the giver's name follows the zone's first quest giver so they're someone you know) */
function townPeople() {
  const h = H(); if (!h) return [];
  const q = (QUESTS[h.zone] || [])[0], giverName = q ? giver(q) : 'Quartermaster Hale';
  const list = [
    { id: 'giver', name: giverName, at: [18, 9], dir: 'left', look: { race: FACTIONS[h.faction].races[0], cls: 'warrior', hair: '#6b4423' } },
    { id: 'registrar', name: 'Registrar Mott', at: [16, 6], dir: 'down', look: { race: FACTIONS[h.faction].races[1] || FACTIONS[h.faction].races[0], cls: 'priest', hair: '#d8d8d8' },
      lines: () => guildOn() ? [[`Registrar Mott`, `${G().name} is in good standing. The hall is through that door; mind the banners, they bite.`]]
        : foundProblem() ? [['Registrar Mott', `A guild? A fine idea. ${foundProblem()}`]] : [['Registrar Mott:happy', 'Everything is in order! Step into the hall and sign the charter.']] },
    { id: 'kid', name: 'Pip the Lamplighter', at: [8, 9], dir: 'right', look: { race: 'human', cls: 'rogue', hair: '#c96a2a' },
      lines: () => [['Pip the Lamplighter', realmNight() > .4 ? 'Every lamp lit! You can see the whole square from the inn roof.' : 'I light the lamps when it gets dark. Come back tonight and see!']] }
  ];
  if (pellHere()) list.push({ id: 'pell', name: 'Pell', at: [6, 10], dir: 'right', look: { race: 'human', cls: 'hunter', hair: '#8a6a4a' }, mule: [5, 10] });
  return list;
}
/* Pell visits a hub for a while, then moves on (the same hours for everyone) */
function pellHere(now) { return Math.floor((now === undefined ? Date.now() : now) / 1800000) % 3 === 0; }
const TOWN_WALK = World.walker({
  map: () => TOWN.map, tiles: TOWN_TILES, pos: () => TOWN.pos,
  people: () => { const ps = townPeople(); return ps.concat(ps.filter(p => p.mule).map(p => ({ at: p.mule, isMule: 1, id: 'brisket' }))); },
  busy: () => !!RTALK || !!modalKind, speed: () => 4.5,
  on: { person: townTalk, door: (x, y) => townDoor(TOWN.map.doors[x + ',' + y]), exit: () => { TOWN.auto = null; leaveTown(); }, sign: () => townDoor({ kind: 'board' }) }
});
function townActive() { const h = H(); return !!(h && C && !h.dun && C.phase === 'intown' && PW > 0); }
function townEnter() {
  const [x, y, d] = TOWN.map.start; TOWN_WALK.place(x, y, d); TOWN.auto = null;
  if (aiOn()) { C.townT = Math.max(C.townT || 0, 25); TOWN.auto = 'smith'; }
}
function townDoor(b) {
  if (!b) return; const h = H();
  if (b.kind === 'inn') { C.hp = ST.hpMax; if (CLASSES[h.cls].res === 'mana') C.res = ST.resMax; for (const p of C.party) { p.dead = false; p.hp = compStats(p.n).hpMax; }
    line('The innkeeper sets a bowl of stew in front of you. Everyone is rested.', 'l-heal'); sfx('heal'); return; }
  if (b.kind === 'smith') { const junk = h.bags.filter(i => i.junk).length; sellJunk(true); repairAll(false); if (junk) line(`The smith buys your ${junk} bits of junk.`, 'l-loot'); S.tab = 'bags'; renderTab(true); sfx('coin'); return; }
  if (b.kind === 'trainer') { S.tab = 'talents'; renderTab(true); line('The trainer looks over your talents. (Talents tab)', 'l-sys'); return; }
  if (b.kind === 'stable') { S.tab = 'mounts'; renderTab(true); line('The stablehand nods at your mounts. (Mounts tab)', 'l-sys'); return; }
  if (b.kind === 'guild') { S.tab = 'supplies'; renderTab(true); line(guildOn() ? `You step into the hall of ${G().name}. (Guild tab)` : 'The guild hall stands empty, waiting for a charter. (Guild tab)', 'l-sys'); return; }
  if (b.kind === 'board') { S.tab = 'quests'; renderTab(true); line('You read the notices on the quest board. (Quests tab)', 'l-sys'); }
}
function townTalk(n) {
  if (n.isMule) { SCN.play([['Pell', 'That\'s Brisket. He doesn\'t talk, which makes him the best listener in three worlds.']], null); return; }
  const h = H();
  if (n.id === 'giver') { const q = (QUESTS[h.zone] || []).find(q => qState(q) === 'avail');
    if (q && h.quests.active.length < 3) { questOffer(q.id); return; }
    SCN.play([[n.name, q ? 'Your pack looks full already. Finish what you carry first, then come and see me.' : 'Nothing new on the board for you today. The road is quieter for your work.']], null); return; }
  if (n.id === 'pell') { const cost = 200;
    SCN.play([['Pell:happy', 'Just passing through! Honest prices, mind. A healing potion for the road? Two silver, and Brisket throws in a nod.']],
      c => { if (c !== 0) return; if (h.money < cost) { err('Not enough money.'); return; } h.money -= cost; bank().potion++; sfx('coin'); line('Pell hands you a healing potion. It goes into the supply bank.', 'l-loot'); save(); },
      { choices: ['Buy a potion (2s)', 'Not today'] }); return; }
  SCN.play(n.lines(), null);
}
/* Auto: stroll to the smithy, then out of the gate */
function townAutoTick() {
  if (!TOWN.auto && aiOn() && !RTALK) { TOWN.auto = 'smith'; C.townT = Math.max(C.townT || 0, 25); } // Auto took over while you stood around
  if (!TOWN.auto || !aiOn() || RTALK || !TOWN_WALK.arrived() || TOWN_WALK.path.length) return;
  if (TOWN.auto === 'smith') { const b = TOWN_BUILDINGS.find(x => x.kind === 'smith'); if (!TOWN_WALK.walkTo(b.door, b.y + b.h - 1)) TOWN.auto = 'gate'; else TOWN.auto = 'gate'; return; }
  if (TOWN.auto === 'gate') { TOWN_WALK.walkTo(13, TOWN_H - 1); TOWN.auto = 'out'; }
}

/* ---- painting the town ---- */
const TOWN_HD = World.hd({ src: 16 });
const tHash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
function townPal() {
  const h = H(), z = ZONES[h.zone], wild = h.faction === 'wild';
  return { grass: z.ground, grassDk: Ambience.mix(z.ground, '#000000', .18), grassLt: Ambience.mix(z.ground, '#ffffff', .12), stone: wild ? '#a08868' : '#9a9a90', stoneDk: wild ? '#7a6448' : '#76766e',
    wall: wild ? '#b08a60' : '#d8c8a8', timber: wild ? '#5a3a22' : '#5a4632', roof: wild ? ['#8a4a2a', '#6a3a22', '#7a5a2a', '#a0603a', '#5a3a22'] : ['#8a2a1a', '#4a5a7a', '#6a2a5a', '#4a6a4a', '#7a3a1a'],
    tree: Ambience.mix(z.hill, '#2a5a2a', .4), treeDk: Ambience.mix(z.hill, '#000000', .3) };
}
function townFlat(g, ch, X, Y, s, t, x, y) {
  const P = TOWN.pal, hsh = tHash(x, y), R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(X + a, Y + b, w, h); };
  if (ch === '.' || ch === 'G') { R(0, 0, s, s, P.stone); g.fillStyle = P.stoneDk; for (let i = 0; i < 4; i++) { const ox = (hsh >> (i * 3)) % 12, oy = (hsh >> (i * 5)) % 12; g.fillRect(X + ox, Y + oy, 4, 1); g.fillRect(X + ox, Y + oy, 1, 3); } return; }
  R(0, 0, s, s, (hsh & 3) ? P.grass : P.grassDk); g.fillStyle = P.grassLt; for (let i = 0; i < 3; i++) g.fillRect(X + (hsh >> (i * 4)) % 14, Y + (hsh >> (i * 6)) % 14, 1, 2);
  if (ch === 'f') for (let i = 0; i < 5; i++) { g.fillStyle = ['#e85a7a', '#f2c14e', '#ffffff', '#b48aff'][(hsh >> i) & 3]; g.fillRect(X + (hsh >> (i * 3)) % 13 + 1, Y + (hsh >> (i * 4)) % 13 + 1, 2, 2); }
}
function buildingAt(x, y) { return TOWN_BUILDINGS.find(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h); }
function townStand(c, ch, left, base, s, t, x, y) {
  const P = TOWN.pal, u = s / 8, R = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(left + a * u), Math.floor(base - (b + h) * u), Math.ceil(w * u), Math.ceil(h * u)); };
  const night = realmNight();
  if (ch === 'T') { const sw = reduce ? 0 : Math.sin(t * 1.3 + x) * .3; R(3, 0, 2, 4.5, '#5a3c22'); R(-.3, 4, 8.6, 5.4, P.treeDk); R(.2, 4.4, 7.6, 4.8, P.tree); R(.8 + sw, 8.8, 6.4, 3.2, P.treeDk); R(1.2 + sw, 9.1, 5.6, 2.7, P.tree); R(2 + sw * 1.5, 11.6, 4, 2, P.treeDk); R(2.4 + sw * 1.5, 11.8, 3.2, 1.6, P.tree); return; }
  if (ch === '#' || ch === 'D') {
    const b = buildingAt(x, y), roof = P.roof[TOWN_BUILDINGS.indexOf(b) % P.roof.length], front = y === b.y + b.h - 1, depth = b.y + b.h - 1 - y;
    if (!front) { const hgt = 11 + depth * 2.2; R(-.2, 0, 8.4, hgt, Ambience.mix(roof, '#000000', .15)); R(-.2, hgt - 1.2, 8.4, 1.2, Ambience.mix(roof, '#ffffff', .15)); return; }
    R(0, 0, 8, 9, P.wall); R(0, 0, .8, 9, P.timber); R(7.2, 0, .8, 9, P.timber); R(0, 4.4, 8, .7, P.timber); R(-.4, 9, 8.8, 2.4, roof); R(-.4, 10.8, 8.8, .6, Ambience.mix(roof, '#ffffff', .2));
    if (ch === 'D') { R(2.2, 0, 3.6, 6, '#3a2414'); R(2.6, 0, 2.8, 5.4, '#6a4426'); R(4.6, 2.6, .5, .5, '#f2c14e');
      if (b.kind === 'guild') { R(.6, 5.4, 1.2, 3.2, guildOn() ? '#2a4a8a' : '#6a6a6a'); R(6.2, 5.4, 1.2, 3.2, guildOn() ? '#2a4a8a' : '#6a6a6a'); R(.6, 5.2, 1.2, .4, '#f2c14e'); R(6.2, 5.2, 1.2, .4, '#f2c14e'); }
      const sz = Math.max(9, Math.round(s * .28)); c.font = `700 ${sz}px Alegreya Sans, sans-serif`; c.textAlign = 'center'; c.fillStyle = 'rgba(0,0,0,.55)'; c.fillText(b.name, left + s / 2 + 1, base - 11.8 * u + 1); c.fillStyle = '#ffe9b0'; c.fillText(b.name, left + s / 2, base - 11.8 * u); c.textAlign = 'left'; }
    else { const lit = Ambience.mix('#3a3448', '#ffd36a', .2 + .8 * night); R(2.4, 5.6, 3.2, 2.4, '#3a2414'); R(2.8, 6, 2.4, 1.7, lit); R(3.9, 6, .3, 1.7, '#3a2414'); }
    return;
  }
  if (ch === 'L') { R(3.6, 0, .8, 9, '#2b2b3a'); R(2.8, 9, 2.4, 2.2, '#2b2b3a'); R(3.1, 9.3, 1.8, 1.6, Ambience.mix('#806040', '#ffe08a', .3 + .7 * night)); return; }
  if (ch === 'P') { R(1, 0, .8, 6, '#5a3c22'); R(6.2, 0, .8, 6, '#5a3c22'); R(.4, 4, 7.2, 5, '#6b4a2a'); R(.8, 4.4, 6.4, 4.2, '#a0703a');
    for (const [a, b2] of [[1.2, 7], [3.4, 6.6], [5.2, 7.2], [2, 5], [4.4, 4.8]]) R(a, b2 - 1.4, 1.6, 1.4, '#efe6cc'); return; }
  if (ch === 'O') { R(.4, 0, 7.2, 2.4, P.stoneDk); R(.8, .4, 6.4, 1.8, P.stone); R(1.2, 1.6, 5.6, .8, '#4a8ab8'); R(3.5, 2.2, 1, 3.6, P.stone);
    const sp = reduce ? 0 : (Math.sin(t * 6) + 1) * .3; R(3.2, 5.6 + sp, 1.6, .6, '#bfe4ff'); R(2.4, 4.2 - sp, .5, 1.2, '#bfe4ff'); R(5.1, 4.2 - sp, .5, 1.2, '#bfe4ff'); return; }
  if (ch === '=') { R(0, 0, 1, 5, '#7a5028'); R(7, 0, 1, 5, '#7a5028'); R(0, 1.5, 8, 1, '#a0703a'); R(0, 3.5, 8, 1, '#a0703a'); return; }
}
/* draw the town into the scene; returns the lights it wants at night */
function drawTown(t) {
  const h = H(), dt = TOWN.last === null ? 0 : Math.min(.1, Math.max(0, t - TOWN.last)); TOWN.last = t;
  if (!TOWN.on) { TOWN.on = true; townEnter(); }
  TOWN_WALK.tick(dt); townAutoTick(); TOWN.pal = townPal();
  const z = ZONES[h.zone], night = realmNight(), wk = zoneWeather(h.zone), W = AMB_WEATHER[wk] || {}, p = TOWN_WALK, people = townPeople();
  const things = people.map(n => ({ x: n.at[0], y: n.at[1], draw(c, left, base, s) { const pp = s / 11; drawPerson(left + s * .14, base - 13 * pp, pp, { race: n.look.race, cls: n.look.cls, hair: n.look.hair }, t + n.at[0]); } }));
  for (const n of people) if (n.mule) things.push({ x: n.mule[0], y: n.mule[1], draw(c, left, base, s) { const pp = s / 16; drawBeast(cx, left + s * .3, base - 14 * pp, pp, '#7a5a3a', 'horse', true, t * .5); } });
  things.push({ x: p.fx, y: p.fy, draw(c, left, base, s) { const pp = s / 11; drawHero(left + s * .14, base - 13 * pp, pp, t); } });
  const sky = [Ambience.mix(z.sky[0], '#070b22', night * .85), Ambience.mix(z.sky[1], '#2e3868', night * .8)];
  TOWN.cam = TOWN_HD.draw(cx, PW, PH, t, { rows: TOWN.map.rows, px: p.fx, py: p.fy, sky, hill: TOWN.pal.treeDk, edgeFill: TOWN.pal.treeDk, haze: Ambience.mix(z.sky[1], '#2e3868', night * .8),
    skyDraw: (g, w, hh, tt) => AMB.sky(g, w, hh, tt, { top: z.sky[0], bottom: z.sky[1], h: hh, night, clouds: { n: 4, speed: 6 }, storm: W.storm ? 1 : W.rain ? .45 : 0, px: 2 }),
    flat: townFlat, under: ',', stands: { T: 1, '#': 1, D: 1, L: 1, P: 1, O: 1, '=': 1 }, noShadow: { '#': 1, D: 1 }, stand: townStand, things });
  // the hub's name, top left
  const fs = Math.max(12, Math.round(PH / 17)); cx.font = `700 ${fs}px Alegreya Sans, sans-serif`; const label = hubName(), lw = cx.measureText(label).width + 16;
  cx.fillStyle = 'rgba(20,16,12,.72)'; cx.fillRect(8, 8, lw, fs * 1.6); cx.fillStyle = '#f2c14e'; cx.textBaseline = 'middle'; cx.fillText(label, 16, 8 + fs * .82); cx.textBaseline = 'alphabetic';
  // weather, night and its lights (lamps, windows, doors, you)
  const lights = [], at = (x, y) => TOWN.cam.fwd(x, y);
  TOWN.map.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === 'L' || ch === 'D') { const q = at(x + .5, y + .9); if (q) lights.push({ x: q[0], y: q[1] - q[2] * (ch === 'L' ? 1.25 : .5), r: q[2] * 2.6, col: '#ffc860', flick: true }); } }));
  const me = at(p.fx + .5, p.fy + .5); if (me) lights.push({ x: me[0], y: me[1] - me[2] * .6, r: me[2] * 2.2, col: '#ffe2b0' });
  AMB.weather(cx, PW, PH, t, Object.assign({}, W, { px: 2, splashAnywhere: true, fireflies: night > .4 && !W.rain ? .5 : 0, onThunder: v => sfx('thunder', v) }));
  if (night > .02) AMB.lights(cx, PW, PH, t, { dark: night, max: .55, lights });
  AMB.flash(cx, PW, PH, t);
  const hint = Math.max(10, Math.round(PH / 22)); cx.font = `600 ${hint}px Alegreya Sans, sans-serif`; cx.fillStyle = 'rgba(255,240,210,.75)'; cx.textAlign = 'right';
  cx.fillText(aiOn() ? 'Auto: off to the smithy, then the road' : 'Walk: arrows / WASD or tap · Enter: talk · the gate: back on the road', PW - 10, PH - 10); cx.textAlign = 'left';
}
/* input while you're walking the town */
document.addEventListener('keydown', e => {
  if (!townActive() || RTALK || modalKind || (e.target.matches && e.target.matches('input,textarea,select'))) return;
  if (TOWN_WALK.keyDown(e)) { C.lastInput = C.run; TOWN.auto = null; e.preventDefault(); e.stopImmediatePropagation(); }
  else if ((e.key === 'Enter' || e.key === ' ') && TOWN_WALK.interact()) { e.preventDefault(); e.stopImmediatePropagation(); }
}, true);
document.addEventListener('keyup', e => { TOWN_WALK.keyUp(e); });
addEventListener('blur', () => { TOWN_WALK.held = []; });
cv.addEventListener('click', e => {
  if (!townActive() || !TOWN.cam || RTALK) return; const r = cv.getBoundingClientRect();
  if (TOWN_WALK.tap(e.clientX - r.left, e.clientY - r.top, TOWN.cam)) { C.lastInput = C.run; TOWN.auto = null; }
});
