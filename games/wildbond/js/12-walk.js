'use strict';
/* Walking the world (T7b). Your position is S.pos = { map, x, y, dir }; maps are in 11-maps.js and the scene draws
   them in 06-scene.js. Steps in tall grass count as exploring (the same explore() as the button), so story beats,
   battles and pacing work exactly as before. With Auto-explore on, your tamer walks the grass on their own. */
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const KEYDIR = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
const WALK_SPEED = 5; // tiles a second
/* fx, fy: where the tamer is drawn (slides toward S.pos); path: queued steps; grassN: tall-grass steps until the next find;
   fol: where your lead creature walks (one step behind you); spot: a trainer who just saw you; cool: trainers who beat
   you won't come at you again until you leave the area */
const WK = { fx: 0, fy: 0, held: [], queued: null, path: [], grassN: 10, cam: null, fol: { x: 0, y: 0, fx: 0, fy: 0 }, spot: null, cool: {}, roam: [], roamT: 99 };

function curMap() { return MAPS[S.pos.map]; }
function tileAt(m, x, y) { return y < 0 || y >= m.rows.length || x < 0 || x >= m.rows[0].length ? 'T' : m.rows[y][x]; }
function castKeyOf(name) { return Object.keys(CAST).find(k => CAST[k].name === name); }
/* the people standing on a map: its townsfolk plus the area's Warden, if the area has one */
function npcsOf(m) {
  const list = (m.npcs || []).slice(), g = m.biome && m.warden && STORY.find(b => b.gate && (b.biome || 'thornwood') === m.biome);
  if (g) { const who = castKeyOf(g.trainer); if (who) list.push({ who, at: m.warden, dir: 'down', warden: g }); }
  return list;
}
function npcAt(m, x, y) { return npcsOf(m).find(n => n.at[0] === x && n.at[1] === y); }
function blocked(m, x, y) { return !!(TILES[tileAt(m, x, y)] || TILES.T).solid || !!npcAt(m, x, y); }

/* put the tamer on a map: at [x, y, dir], or at the map's start */
function placeAt(id, x, y, dir) {
  const m = MAPS[id]; if (!m) return;
  if (x === undefined) [x, y, dir] = m.start;
  if (!S.pos || S.pos.map !== id) { WK.cool = {}; WK.roam = []; WK.roamT = 99; }
  S.pos = { map: id, x, y, dir: dir || 'down' }; WK.fx = x; WK.fy = y; WK.path = []; WK.spot = null; WK.ready = true;
  followBehind();
  if (m.biome) S.biome = m.biome;
}
/* the follower starts one tile behind you if there's room, otherwise right where you are */
function followBehind() {
  const [dx, dy] = DIRS[S.pos.dir] || [0, 1], bx = S.pos.x - dx, by = S.pos.y - dy, ok = !blocked(curMap(), bx, by);
  WK.fol = { x: ok ? bx : S.pos.x, y: ok ? by : S.pos.y }; WK.fol.fx = WK.fol.x; WK.fol.fy = WK.fol.y;
}
/* older saves (and new tamers) have no position yet */
function ensurePos() {
  if (S.pos && MAPS[S.pos.map]) { if (!WK.ready) { WK.ready = true; WK.fx = S.pos.x; WK.fy = S.pos.y; followBehind(); } return; }
  placeAt(MAPS[S.biome] ? S.biome : 'larkhaven');
}
function arrived() { return Math.abs(WK.fx - S.pos.x) < 0.01 && Math.abs(WK.fy - S.pos.y) < 0.01; }
/* Warden's boots (the Thorn Badge): hold Shift, or tap somewhere far away, to run. Auto-explore keeps walking. */
const RUN_SPEED = 9;
function speedNow() { return S.shoes && !S.auto && (WK.run || WK.pathRun) ? RUN_SPEED : WALK_SPEED; }
/* The day/night clock follows the ranch day (07-ranch.js); it arrives with the Thorn Badge, like the boots.
   darkness: 0 by day, rising at dusk to 1 at night. At night Shade creatures come out more. */
function dayPart() { return ((S.ranchT || 0) / DAY_SECONDS) % 1; }
function darkness() { if (!S.badges.includes('thorn')) return 0; const k = dayPart(); return k < 0.65 ? 0 : k < 0.75 ? (k - 0.65) / 0.1 : k < 0.95 ? 1 : (1 - k) / 0.05; }
function isNight() { return darkness() >= 1; }
/* Weather (arrives with the Tide Badge): it changes three times a ranch day and tips which creatures come out. */
const WEATHER = { thornwood: ['clear', 'clear', 'rain'], saltmarsh: ['clear', 'rain', 'mist'], emberfall: ['clear', 'clear', 'ash'] };
const WEATHER_FX = { rain: { Tide: 2, Ember: 0.5 }, mist: { Shade: 1.5, Gale: 1.5 }, ash: { Ember: 1.6, Gale: 0.6 } };
const WEATHER_NAME = { rain: 'Rain: Tide creatures are out.', mist: 'Mist: Shade and Gale creatures drift out of it.', ash: 'Falling ash: Ember creatures love it.' };
function weatherNow() {
  if (!S.badges.includes('tide') || !S.pos || !curMap().biome) return 'clear';
  const list = WEATHER[S.biome] || ['clear', 'mist'], seg = Math.floor(dayPart() * 3), h = ((S.day || 1) * 7 + seg * 13 + S.biome.length * 5) % 97;
  return list[h % list.length];
}
/* Visible wild creatures (arrive with the Tide Badge): a few wander the tall grass. Walk into one to battle it;
   they're a little more likely to be rare than what the grass turns up. Finds in the grass still happen as before. */
function roamOn() { return S.badges.includes('tide') && !!curMap().biome; }
function tallTiles(m) { const out = []; m.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '"') out.push([x, y]); })); return out; }
function addRoamer() {
  const m = curMap(), free = tallTiles(m).filter(([x, y]) => !(x === S.pos.x && y === S.pos.y) && !npcAt(m, x, y) && !WK.roam.some(r => r.x === x && r.y === y));
  if (!free.length) return; const [x, y] = pick(free);
  WK.roam.push({ sp: wildPick(), lvl: wildLvl(), x, y, fx: x, fy: y, t: 1 + Math.random() * 2, right: Math.random() < 0.5 });
}
function roamTick(h) {
  if (!roamOn()) { WK.roam = []; return; }
  WK.roamT = (WK.roamT || 0) + h; if (WK.roam.length < 3 && WK.roamT > 12) { WK.roamT = 0; addRoamer(); }
  const m = curMap();
  for (const r of WK.roam) {
    const s = 2.5 * h; r.fx += Math.max(-s, Math.min(s, r.x - r.fx)); r.fy += Math.max(-s, Math.min(s, r.y - r.fy));
    if ((r.t -= h) > 0) continue; r.t = 1.2 + Math.random() * 2.5;
    const [dx, dy] = pick(Object.values(DIRS)), nx = r.x + dx, ny = r.y + dy; if (dx) r.right = dx > 0;
    if (nx === S.pos.x && ny === S.pos.y) { meetRoamer(r); return; }
    if (tileAt(m, nx, ny) === '"' && !npcAt(m, nx, ny) && !WK.roam.some(o => o.x === nx && o.y === ny)) { r.x = nx; r.y = ny; }
  }
}
function meetRoamer(r) {
  if (B || TALK || !alive().length) return;
  WK.roam = WK.roam.filter(o => o !== r); WK.path = []; WK.held = []; W.msg = '';
  startBattle('wild', [newCreature(r.sp, r.lvl, { boost: 0.4 + journey().rare + (S.team.some(c => c.traits.includes('lucky')) ? 0.3 : 0) })]);
}

function tryStep(dir) {
  if (B || TALK || !S.pos) return;
  const m = curMap(), [dx, dy] = DIRS[dir], nx = S.pos.x + dx, ny = S.pos.y + dy, ch = tileAt(m, nx, ny);
  S.pos.dir = dir;
  const npc = npcAt(m, nx, ny); if (npc) { WK.path = []; talkTo(npc); return; }
  if (TILES[ch] && TILES[ch].door) { WK.path = []; enterDoor(m.doors[nx + ',' + ny]); return; }
  if (TILES[ch] && TILES[ch].exit) { useExit(m, ch); return; }
  if (TILES[ch] && TILES[ch].sign) { WK.path = []; W.msg = `The sign reads: "${(m.signs || {})[nx + ',' + ny] || 'The words have worn away.'}"`; return; }
  if (blocked(m, nx, ny)) { WK.path = []; return; }
  WK.fol.x = S.pos.x; WK.fol.y = S.pos.y; S.pos.x = nx; S.pos.y = ny;
  pickUp(m, nx, ny);
  const r = WK.roam.find(o => o.x === nx && o.y === ny); if (r) { meetRoamer(r); return; }
  if (spotted(m)) return;
  if (TILES[ch].tall && --WK.grassN <= 0) { WK.grassN = rint(8, 16); WK.path = []; explore(); }
}
/* items lying on the ground: picked up once, by walking onto them */
function itemsLeft(m) { return (m.items || []).filter(it => !(S.items && S.items[it.id])); }
function pickUp(m, x, y) {
  const it = itemsLeft(m).find(i => i.at[0] === x && i.at[1] === y); if (!it) return;
  S.items = S.items || {}; S.items[it.id] = true; ensureRanch();
  const got = Object.entries(it.give).map(([k, n]) => {
    if (k === 'coins') { S.coins += n; return `${n} coins`; }
    if (k === 'lures') { S.lures += n; return `${n} lure${n > 1 ? 's' : ''}`; }
    S.food[k] = (S.food[k] || 0) + n; return `${n} ${FOODS[k].name.toLowerCase()} for the ranch`; });
  W.msg = `You found ${got.join(' and ')}!`; sfx('catch'); toast(W.msg);
}
/* route trainers: walk into the line they're facing and they come over for a battle */
function spotted(m) {
  for (const n of npcsOf(m)) {
    if (!n.trainer || (S.beaten && S.beaten[n.who]) || WK.cool[n.who]) continue;
    const [dx, dy] = DIRS[n.dir || 'down'];
    for (let k = 1; k <= (n.trainer.sight || 3); k++) {
      const x = n.at[0] + dx * k, y = n.at[1] + dy * k;
      if (x === S.pos.x && y === S.pos.y) { WK.path = []; WK.held = []; WK.queued = null; WK.spot = { n, t: 0.9 }; sfx('warn'); return true; }
      if (blocked(m, x, y)) break;
    }
  }
  return false;
}
function challengeTrainer(n) {
  WK.spot = null;
  const grown = (id, lvl) => { let s = id; while (SPECIES[s].evo && lvl >= SPECIES[s].evo.at) s = SPECIES[s].evo.to; return s; };
  const team = n.trainer.team.slice(-Math.max(1, S.team.length)).map(([id, lvl]) => newCreature(grown(id, lvl), lvl, { rar: 1 }));
  talk(n.lines, () => { if (alive().length) startBattle('trainer', team, { trainer: CAST[n.who].name, npc: n.who }); });
}
/* called when a battle against a route trainer ends (03-battle.js) */
function trainerResult(who, result) {
  const n = npcsOf(curMap()).find(x => x.who === who); if (!n) return;
  if (result === 'won') { S.beaten = S.beaten || {}; S.beaten[who] = true; W.after = n.trainer.win || null; slog(`Beat ${CAST[who].title.toLowerCase()} ${CAST[who].name} in ${curMap().name}.`); }
  else WK.cool[who] = true;
}
function useExit(m, ch) {
  const ex = m.exits[ch]; if (!ex) return; WK.path = [];
  const to = MAPS[ex.to];
  if (to.biome && !biomeOpen(to.biome)) { W.msg = ex.locked || 'The way ahead is closed for now.'; return; }
  placeAt(ex.to, ex.x, ex.y, ex.dir); W.msg = `You walk on to ${to.name}.`; slog(`Travelled to ${to.name}.`); save();
}
function enterDoor(kind) {
  if (kind === 'inn') { restInTown(); W.msg = 'The innkeeper brings out warm blankets. Your team is fully healed.'; sfx('heal'); }
  else if (kind === 'shop') { buyLures(); if (W.msg === 'You buy 5 lures.') W.msg = 'The shopkeeper wraps up 5 lures for you (50 coins).'; }
  else if (kind === 'ranch') { S.tab = 'ranch'; renderTabs(true); W.msg = 'Maren waves you into the barn. Your ranch is open on the right.'; }
}
function talkTo(n) {
  const face = { up: 'down', down: 'up', left: 'right', right: 'left' }[S.pos.dir]; if (!n.trainer) n.dir = face; // trainers keep watching their path
  if (n.warden) {
    const g = n.warden;
    if (S.story[g.id]) talk([[n.who, MAPS[S.pos.map].wardenDone || 'You\'ve earned my badge. The road ahead is yours.']]);
    else if (wardenReady()) challengeWarden();
    else talk([[n.who, `Not yet, {name}. Walk ${MAPS[S.pos.map].name} a while longer and let your team learn its ways. Come back to me after about ${Math.max(1, g.at - beatCount(g))} more finds in the grass.`]]);
    return;
  }
  if (n.trainer) { if (S.beaten && S.beaten[n.who]) talk(n.trainer.after || n.trainer.win); else challengeTrainer(n); return; }
  // townsfolk notice how the world changes: byBadge lines replace their usual ones once you hold that badge
  const later = Object.keys(n.byBadge || {}).filter(b => S.badges.includes(b)).pop();
  talk(later ? n.byBadge[later] : n.lines, n.act === 'ranch' ? () => enterDoor('ranch') : null);
}

/* walk to a tile by the shortest route; the last step may be onto a person, a door or an exit */
function walkTo(tx, ty) {
  const m = curMap(), W0 = m.rows[0].length, key = (x, y) => y * W0 + x, prev = new Map([[key(S.pos.x, S.pos.y), null]]), q = [[S.pos.x, S.pos.y]];
  const goal = key(tx, ty);
  while (q.length) {
    const [x, y] = q.shift(); if (key(x, y) === goal) break;
    for (const d in DIRS) { const nx = x + DIRS[d][0], ny = y + DIRS[d][1], k = key(nx, ny);
      if (prev.has(k) || nx < 0 || ny < 0 || nx >= W0 || ny >= m.rows.length) continue;
      if (k !== goal && (blocked(m, nx, ny) || TILES[tileAt(m, nx, ny)].door || TILES[tileAt(m, nx, ny)].exit)) continue;
      prev.set(k, [key(x, y), d]); q.push([nx, ny]); }
  }
  if (!prev.has(goal)) return false;
  const steps = []; for (let k = goal; prev.get(k); k = prev.get(k)[0]) steps.unshift(prev.get(k)[1]);
  WK.path = steps; WK.pathRun = steps.length > 3; return true;
}
/* Auto-explore: wander to a random patch of tall grass; in town, head out toward the wild */
function autoWalk() {
  const m = curMap(), tall = [];
  m.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '"') tall.push([x, y]); }));
  if (tall.length) { for (let i = 0; i < 6 && !WK.path.length; i++) { const [x, y] = pick(tall); walkTo(x, y); } return; }
  const out = Object.keys(m.exits || {})[0]; if (!out) return;
  m.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === out && !WK.path.length) walkTo(x, y); }));
}

function walkTick(h) {
  if (!S.pos || B || TALK) return;
  if (!WK.path.length) WK.pathRun = false;
  const sp = speedNow() * h, f = WK.fol;
  WK.fx += Math.max(-sp, Math.min(sp, S.pos.x - WK.fx)); WK.fy += Math.max(-sp, Math.min(sp, S.pos.y - WK.fy));
  f.fx += Math.max(-sp, Math.min(sp, f.x - f.fx)); f.fy += Math.max(-sp, Math.min(sp, f.y - f.fy));
  if (WK.spot) { if (arrived() && (WK.spot.t -= h) <= 0) challengeTrainer(WK.spot.n); return; }
  roamTick(h); if (B) return;
  if (!arrived()) return;
  const dir = WK.held[WK.held.length - 1] || WK.queued || WK.path.shift(); WK.queued = null;
  if (dir) tryStep(dir);
  else if (S.auto && alive().length) autoWalk();
}
/* press or tap something you're facing: talk, open a door */
function interact() {
  if (!S.pos || B || TALK) return false;
  const m = curMap(), [dx, dy] = DIRS[S.pos.dir], x = S.pos.x + dx, y = S.pos.y + dy, npc = npcAt(m, x, y);
  if (npc) { talkTo(npc); return true; }
  if (TILES[tileAt(m, x, y)].door) { enterDoor(m.doors[x + ',' + y]); return true; }
  return false;
}

document.addEventListener('keydown', e => {
  if (!S.started || TALK || e.target.matches('input,textarea') || $('#modal').hidden === false) return;
  const k = e.key.toLowerCase(), d = KEYDIR[k];
  if (k === 'shift') WK.run = true;
  if (d && !B) { if (!WK.held.includes(d)) WK.held.push(d); WK.path = []; e.preventDefault();
    if (!e.repeat) { if (arrived()) tryStep(d); else WK.queued = d; } } // a quick tap still takes one step
  else if ((k === 'enter' || k === ' ') && !B && interact()) e.preventDefault();
});
document.addEventListener('keyup', e => { const k = e.key.toLowerCase(), d = KEYDIR[k]; if (d) WK.held = WK.held.filter(x => x !== d); if (k === 'shift') WK.run = false; });
addEventListener('blur', () => { WK.held = []; WK.run = false; });
cv.addEventListener('click', e => {
  if (!S.started || B || TALK || !WK.cam) return;
  const r = cv.getBoundingClientRect(), c = WK.cam;
  const mx = e.clientX - r.left, my = e.clientY - r.top; // a renderer with a tilted camera supplies cam.inv (screen -> tile)
  const [tx, ty] = c.inv ? c.inv(mx, my) : [Math.floor((mx - c.ox) / c.ts), Math.floor((my - c.oy) / c.ts)];
  if (tx === undefined) return;
  if (tx === S.pos.x && ty === S.pos.y) return;
  walkTo(tx, ty);
});
