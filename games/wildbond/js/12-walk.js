'use strict';
/* Walking the world (T7b). Your position is S.pos = { map, x, y, dir }; maps are in 11-maps.js and the scene draws
   them in 06-scene.js. Steps in tall grass count as exploring (the same explore() as the button), so story beats,
   battles and pacing work exactly as before. With Auto-explore on, your tamer walks the grass on their own. */
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const KEYDIR = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
const WALK_SPEED = 5; // tiles a second
/* fx, fy: where the tamer is drawn (slides toward S.pos); path: queued steps; grassN: tall-grass steps until the next find */
const WK = { fx: 0, fy: 0, held: [], queued: null, path: [], grassN: 10, cam: null };

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
  S.pos = { map: id, x, y, dir: dir || 'down' }; WK.fx = x; WK.fy = y; WK.path = [];
  if (m.biome) S.biome = m.biome;
}
/* older saves (and new tamers) have no position yet */
function ensurePos() {
  if (S.pos && MAPS[S.pos.map]) { if (!WK.cam) { WK.fx = S.pos.x; WK.fy = S.pos.y; } return; }
  placeAt(MAPS[S.biome] ? S.biome : 'larkhaven');
}
function arrived() { return Math.abs(WK.fx - S.pos.x) < 0.01 && Math.abs(WK.fy - S.pos.y) < 0.01; }

function tryStep(dir) {
  if (B || TALK || !S.pos) return;
  const m = curMap(), [dx, dy] = DIRS[dir], nx = S.pos.x + dx, ny = S.pos.y + dy, ch = tileAt(m, nx, ny);
  S.pos.dir = dir;
  const npc = npcAt(m, nx, ny); if (npc) { WK.path = []; talkTo(npc); return; }
  if (TILES[ch] && TILES[ch].door) { WK.path = []; enterDoor(m.doors[nx + ',' + ny]); return; }
  if (TILES[ch] && TILES[ch].exit) { useExit(m, ch); return; }
  if (blocked(m, nx, ny)) { WK.path = []; return; }
  S.pos.x = nx; S.pos.y = ny;
  if (TILES[ch].tall && --WK.grassN <= 0) { WK.grassN = rint(8, 16); WK.path = []; explore(); }
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
  const face = { up: 'down', down: 'up', left: 'right', right: 'left' }[S.pos.dir]; n.dir = face;
  if (n.warden) {
    const g = n.warden;
    if (S.story[g.id]) talk([[n.who, MAPS[S.pos.map].wardenDone || 'You\'ve earned my badge. The road ahead is yours.']]);
    else if (wardenReady()) challengeWarden();
    else talk([[n.who, `Not yet, {name}. Walk ${MAPS[S.pos.map].name} a while longer and let your team learn its ways. Come back to me after about ${Math.max(1, g.at - beatCount(g))} more finds in the grass.`]]);
    return;
  }
  talk(n.lines, n.act === 'ranch' ? () => enterDoor('ranch') : null);
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
  WK.path = steps; return true;
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
  const sp = WALK_SPEED * h;
  WK.fx += Math.max(-sp, Math.min(sp, S.pos.x - WK.fx)); WK.fy += Math.max(-sp, Math.min(sp, S.pos.y - WK.fy));
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
  if (d && !B) { if (!WK.held.includes(d)) WK.held.push(d); WK.path = []; e.preventDefault();
    if (!e.repeat) { if (arrived()) tryStep(d); else WK.queued = d; } } // a quick tap still takes one step
  else if ((k === 'enter' || k === ' ') && !B && interact()) e.preventDefault();
});
document.addEventListener('keyup', e => { const d = KEYDIR[e.key.toLowerCase()]; if (d) WK.held = WK.held.filter(x => x !== d); });
addEventListener('blur', () => { WK.held = []; });
cv.addEventListener('click', e => {
  if (!S.started || B || TALK || !WK.cam) return;
  const r = cv.getBoundingClientRect(), c = WK.cam;
  const tx = Math.floor((e.clientX - r.left - c.ox) / c.ts), ty = Math.floor((e.clientY - r.top - c.oy) / c.ts);
  if (tx === S.pos.x && ty === S.pos.y) return;
  walkTo(tx, ty);
});
