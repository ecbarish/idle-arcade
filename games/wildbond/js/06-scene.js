'use strict';
/* The scene: exploring with your team, or the two sides of a battle. Drawn through the current art era.
   Battle motion: teams slide in, attackers lunge, hit creatures flinch and blink, element-colored sparks,
   screen shake on critical hits, fainted creatures sink, winners hop. All of it is skipped with reduced motion. */
const cv = $('#scene'), cxRaw = cv.getContext('2d'); let cx = cxRaw, PW = 0, PH = 0; // cx: drawn through the era's color wrapper, if it has one
function resize() { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); PW = r.width; PH = r.height; cv.width = Math.round(PW * d); cv.height = Math.round(PH * d); cx.setTransform(d, 0, 0, d, 0, 0); cx.imageSmoothingEnabled = false; }
if (window.ResizeObserver) new ResizeObserver(resize).observe(cv); else addEventListener('resize', resize);
const AX = [0.38, 0.25, 0.12], FX = [0.62, 0.75, 0.88];

function frame(ms) {
  requestAnimationFrame(frame); if (!PW || document.hidden) return;
  if (document.body.classList.contains('faded') !== !!S.faded) document.body.classList.toggle('faded', !!S.faded); // a new journey's washed-out colour, until the Thorn Badge
  const t = ms / 1000, A = art(), p = Math.max(2, Math.floor(PH / 46)), mo = !reduceMotion; cx = eraCtx(cxRaw);
  dioramaShow(false); // the 3D view turns itself back on when it draws (14-diorama.js)
  cx.save();
  if (B && B.shake > 0 && mo) cx.translate((Math.random() - 0.5) * p * 3, (Math.random() - 0.5) * p * 2);
  if (S.started && !B && S.pos && MAPS[S.pos.map]) { drawWorld(t, A); cx.restore(); return; }
  const gy = B && A.light ? drawBattleBackdrop(t) : A.backdrop(cx, PW, PH, BIOMES[S.biome], t);
  if (!S.started) { cx.restore(); return; }
  if (B) {
    const ent = mo ? Math.max(0, 1 - B.t / 0.5) : 0;
    const draw = (u, x, right) => {
      x += (right ? -1 : 1) * ent * ent * PW * 0.45;
      let y = gy, alpha = 1;
      if (u.anim > 0 && mo) x += (right ? 1 : -1) * p * 3;
      if (u.hit > 0 && mo) { x += Math.sin(u.hit * 70) * p * 1.2; if (Math.floor(u.hit * 24) % 2) alpha = 0.45; }
      if (u.c.hp <= 0) { const k = u.downAt !== undefined && mo ? Math.min(1, (B.t - u.downAt) / 0.5) : 1; y += k * p * 3; alpha = 1 - 0.75 * k; }
      else if (B.over === 'won' && right && mo) y -= Math.abs(Math.sin(t * 8 + x)) * p * 2;
      A.creature(cx, x, y, p, sp(u.c), right, u.c.hp > 0 ? t : 0, { alpha });
      if (u.c.hp > 0 && !ent) { const w = 16 * p, bx = x - w / 2 + p * 2, by = gy - 20 * p * (sp(u.c).big ? 1.25 : 1); cx.fillStyle = 'rgba(0,0,0,.5)'; cx.fillRect(bx, by, w, p * 1.4);
        cx.fillStyle = u.c.hp / u.st.hp > 0.5 ? '#3fd46a' : u.c.hp / u.st.hp > 0.2 ? '#f2c14e' : '#ff5a4a'; cx.fillRect(bx, by, w * u.c.hp / u.st.hp, p * 1.4); } };
    B.allies.forEach((u, i) => draw(u, PW * AX[i], true));
    B.foes.forEach((u, i) => draw(u, PW * FX[i], false));
    for (const b of B.bursts) drawBurst(b, gy, p);
    if (B.tele) { cx.font = `800 ${p * 5}px Fredoka, sans-serif`; cx.textAlign = 'center'; cx.fillStyle = '#ff5a4a'; cx.globalAlpha = mo ? 0.6 + 0.4 * Math.sin(t * 14) : 1; cx.fillText('GUARD!', PW * 0.5, PH * 0.18); cx.globalAlpha = 1; }
    if (B.capture) { const i = B.foes.indexOf(B.capture.t), x = PW * FX[Math.max(0, i)]; cx.strokeStyle = '#7cf08a'; cx.lineWidth = 3; cx.beginPath(); cx.arc(x + 2 * p, gy - 8 * p, (8 + Math.sin(t * 6) * 1.5) * p, 0, 7); cx.stroke(); }
    cx.textAlign = 'center';
    for (const f of B.fx) { const side = B.allies.includes(f.u) ? AX : FX, list = B.allies.includes(f.u) ? B.allies : B.foes, x = PW * side[list.indexOf(f.u)];
      cx.globalAlpha = 1 - f.age; cx.font = `800 ${p * 5}px Fredoka, sans-serif`; cx.lineWidth = 3; cx.strokeStyle = '#000'; cx.strokeText(f.txt, x + 2 * p, gy - 24 * p - f.age * p * 8); cx.fillStyle = f.col; cx.fillText(f.txt, x + 2 * p, gy - 24 * p - f.age * p * 8); }
    cx.globalAlpha = 1; cx.textAlign = 'left';
    if (ent > 0) { cx.fillStyle = `rgba(255,255,255,${ent * 0.8})`; cx.fillRect(0, 0, PW, PH); }
  } else {
    const bob = mo ? Math.sin(t * 6) * p * 0.5 : 0;
    A.tamer(cx, PW * 0.14, gy + bob, p, '#2f9e6b', t);
    S.team.forEach((c, i) => A.creature(cx, PW * (0.32 + i * 0.13), gy, p, sp(c), true, c.hp > 0 ? t + i : 0, { alpha: c.hp > 0 ? 1 : 0.35 }));
  }
  cx.restore();
}
/* Regional battle scenery in light-enabled eras. The Pocket and Pixel scenes keep their original look.
   Weather and night come from the walking clock; this paints behind creatures and never changes a battle. */
const BATTLE_AMB = Ambience.create({ reduce: () => reduceMotion });
const BATTLE_PLACES = {
  league: { far: 'ruins', near: 'oaks', leaves: .15 },
  thornwood: { far: 'oaks', near: 'pines', leaves: .25 },
  saltmarsh: { far: 'dunes', near: 'stones', water: true },
  emberfall: { far: 'mesas', near: 'stones', embers: .3 },
  cloudglass: { far: 'peaks', near: 'stones', fog: .45, snow: true },
  stillreed: { far: 'oaks', near: 'reeds', water: true, fog: .35 },
  hollowecho: { far: 'peaks', near: 'stones', fog: .2 },
  sunthread: { far: 'dunes', near: 'oaks', leaves: .35 },
  farwatch: { far: 'ruins', near: 'stones', water: true, fog: .35 }
};
function drawBattleBackdrop(t) {
  const atLeague = S.pos && (curMap().league || curMap().tower), b = BIOMES[atLeague ? curMap().pal : S.biome], place = BATTLE_PLACES[atLeague ? 'league' : S.biome] || { far: 'dunes', near: 'stones' };
  const night = darkness(), weather = weatherNow(), time = reduceMotion ? 0 : t;
  const px = Math.max(2, Math.round(PH / 160)), gy = PH * .8;
  cx.save();
  BATTLE_AMB.sky(cx, PW, PH, time, { top: b.sky[0], bottom: b.sky[1], h: gy, night, sun: true,
    storm: weather === 'rain' ? .45 : 0, clouds: { n: 4, speed: 3, alpha: .6 }, px });
  BATTLE_AMB.far(cx, PW, PH, time, { night, px, wind: .15, layers: [
    { kind: place.far, col: tint(b.hill, b.sky[1], .35), base: .68, h: .24, seed: 11, snow: place.snow },
    { kind: place.near, col: b.hill, base: .76, h: .12, seed: 23 }
  ] });
  if (place.water) {
    cx.fillStyle = tint('#559baf', '#15233c', night * .55); cx.fillRect(0, PH * .7, PW, PH * .1);
    cx.fillStyle = tint('#a7c8cf', '#35435b', night * .55);
    for (let i = 0; i < 12; i++) {
      const x = ((i * PW / 9 + time * 5) % (PW + 50)) - 30, y = PH * (.715 + (i % 3) * .025);
      cx.fillRect(Math.round(x / px) * px, Math.round(y / px) * px, px * (4 + i % 4), px);
    }
  }
  cx.fillStyle = tint(b.ground, '#152036', night * .45); cx.fillRect(0, gy, PW, PH - gy);
  cx.fillStyle = tint(b.ground, b.hill, .35);
  for (let i = 0; i < 18; i++) cx.fillRect(Math.round(PW * (i + .3) / 18), gy + px * (3 + i % 5 * 2), px * 3, px);
  BATTLE_AMB.weather(cx, PW, PH, time, { px, ground: gy, wind: .15,
    rain: weather === 'rain' ? .55 : 0, fog: weather === 'mist' ? Math.max(.8, place.fog || 0) : place.fog || 0,
    ash: weather === 'ash' ? .7 : 0, embers: place.embers || 0,
    leaves: weather === 'clear' ? place.leaves || 0 : 0, fireflies: night > .3 && weather !== 'rain' ? .35 : 0 });
  // A subdued dusk glow stays behind the fighters, health bars and reaction prompt.
  if (night > 0) BATTLE_AMB.lights(cx, PW, PH, time, { dark: night, max: .16, tint: '#121838', lights: [] });
  cx.restore(); return gy;
}
/* ---- the walkable world, seen from above, the camera following your tamer ---- */
const PALS = {};
function worldPal(m) {
  const id = m.pal || m.biome; if (PALS[id]) return PALS[id];
  const b = BIOMES[id], g = b.ground, coast = id === 'saltmarsh', ash = id === 'emberfall';
  return (PALS[id] = { grass: g, grassDk: tint(g, '#1d3a20', 0.25), grassLt: tint(g, '#e8f0b0', 0.3),
    tall: tint(g, '#1f4a22', 0.4), tallDk: tint(g, '#1f4a22', 0.2), tallLt: tint(g, '#d8f0a0', 0.35),
    path: ash ? '#b8a48e' : '#d8c08a', pathDk: ash ? '#8a7866' : '#b09868', pathLt: '#ecdcb0',
    sand: '#e3d3a0', sandDk: '#c4b07c', water: coast ? '#3a86b8' : '#3d8fd0', waterLt: '#a8dcf0',
    tree: tint(b.hill, '#1e3a24', 0.35), treeDk: tint(b.hill, '#10241a', 0.6), treeLt: tint(b.hill, '#c8e090', 0.25),
    rock: ash ? '#7a6a64' : '#8b817a', rockDk: ash ? '#4a3c38' : '#5e5650', rockLt: ash ? '#a8948a' : '#b8aea6',
    roof: '#b0503a', roofDk: '#8a3a2a', rockBase: coast ? '#e3d3a0' : null });
}
const PLAYER_LOOK = { skin: '#f1c9a0', hair: 'hat', hairCol: '#6b4423', hatCol: '#2a3f6b', shirt: '#d8453a' }; // a red shirt and blue cap that stand out against grass
/* What's on the map right now, for any renderer: positions are in tiles (x, y = the tile's top-left corner). */
function worldView(m, t) {
  const things = [];
  if (m.pen) { const [x0, y0, x1, y1] = m.pen; S.ranch.slice(0, 4).forEach((c, i) => {
    const k = reduceMotion ? 0.5 : (Math.sin(t * 0.25 + i * 2.1) + 1) / 2;
    things.push({ kind: 'pet', x: x0 + k * (x1 - x0), y: y0 + (i % 2) * (y1 - y0), sp: sp(c), right: Math.cos(t * 0.25 + i * 2.1) > 0, t: t + i }); }); }
  for (const it of itemsLeft(m)) things.push({ kind: 'item', x: it.at[0], y: it.at[1] });
  for (const r of WK.roam) things.push({ kind: 'pet', wild: 1, x: r.fx, y: r.fy, sp: variantSpecies(r), right: r.right, t: t * 1.5 + r.x });
  for (const n of npcsOf(m)) things.push({ kind: 'person', x: n.at[0], y: n.at[1], look: CAST[n.who], dir: n.dir || 'down', step: 0,
    mark: (n.warden && wardenReady() && !S.story[n.warden.id]) || (WK.spot && WK.spot.n.who === n.who) });
  const lead = S.team.find(c => c.hp > 0), riding = S.ride && lead && rideOK();
  if (riding) things.push({ kind: 'pet', x: WK.fx, y: WK.fy, sp: sp(lead), right: S.pos.dir !== 'left', t: arrived() ? 0 : t * 3 });
  things.push({ kind: 'person', me: 1, ride: riding, x: WK.fx, y: WK.fy, look: PLAYER_LOOK, dir: S.pos.dir, step: riding || arrived() ? 0 : Math.floor(t * 8) % 2 });
  if (!riding && lead && (Math.abs(WK.fol.fx - WK.fx) > 0.05 || Math.abs(WK.fol.fy - WK.fy) > 0.05))
    things.push({ kind: 'pet', x: WK.fol.fx, y: WK.fol.fy, sp: sp(lead), right: WK.fx > WK.fol.fx + 0.01 || (Math.abs(WK.fx - WK.fol.fx) < 0.01 && S.pos.dir !== 'left'), t });
  things.sort((a, b) => a.y - b.y);
  return { m, P: worldPal(m), px: WK.fx, py: WK.fy, things, edge: m.edge || (m.biome === 'emberfall' ? 'R' : 'T') };
}
/* a "!" over someone's head: a Warden who is ready, or a trainer who just spotted you */
function drawMark(sx, sy, ts, t) {
  const by = sy - ts * 0.75 - (reduceMotion ? 0 : Math.abs(Math.sin(t * 4)) * ts * 0.1);
  cx.fillStyle = '#f2c14e'; cx.fillRect(sx + ts * 0.35, by, ts * 0.3, ts * 0.38);
  cx.fillStyle = '#17323a'; cx.fillRect(sx + ts * 0.46, by + ts * 0.06, ts * 0.08, ts * 0.17); cx.fillRect(sx + ts * 0.46, by + ts * 0.27, ts * 0.08, ts * 0.06);
}
function drawWorld(t, A) {
  const m = curMap(), v = worldView(m, t); renderViewBtn();
  if (A.world) A.world(cx, PW, PH, v, t); else drawTopDown(v, t, A);
  drawAmbience(t, A, v);
  // where you are
  const fs = Math.max(12, Math.round(PH / 19)); cx.font = `700 ${fs}px Fredoka, sans-serif`; const label = m.name, w = cx.measureText(label).width + 16;
  cx.fillStyle = 'rgba(23,50,58,.72)'; cx.fillRect(8, 8, w, fs * 1.65); cx.fillStyle = '#fff'; cx.textBaseline = 'middle'; cx.fillText(label, 16, 8 + fs * 0.85); cx.textBaseline = 'alphabetic';
}
/* View distance (L11): Close, Wide or Far, from the header button or the V key. Big screens see more of the world
   instead of bigger tiles: with no choice made, a tall scene (a desktop or ultrawide) starts on Wide. */
const VIEWS = { near: ['Close', 1], wide: ['Wide', 1.35], far: ['Far', 1.7] };
function viewKey() { return VIEWS[S.view] ? S.view : 'near'; } // Close by default: Evan found Wide too small to see himself
function viewMult() { return VIEWS[viewKey()][1]; }
function cycleView() { const ks = Object.keys(VIEWS); S.view = ks[(ks.indexOf(viewKey()) + 1) % ks.length];
  if (typeof DIO !== 'undefined') DIO.dist = 16 * viewMult(); W.msg = `View: ${VIEWS[S.view][0]}.`; renderViewBtn(); save(); }
let viewLabel = '';
function renderViewBtn() { const b = $('#viewBtn'), l = 'View: ' + VIEWS[viewKey()][0]; if (b && l !== viewLabel) { viewLabel = l; b.textContent = l; } }
document.addEventListener('click', e => { if (e.target.closest('[data-act="view"]')) cycleView(); });
/* the classic view: straight down, the camera following your tamer */
function drawTopDown(v, t, A) {
  const { m, P } = v, rows = m.rows.length, cols = m.rows[0].length;
  const ts = Math.max(14, Math.round(PH / (8.5 * viewMult()))), vw = PW / ts, vh = PH / ts;
  const camX = cols <= vw ? (cols - vw) / 2 : clamp(v.px + 0.5 - vw / 2, 0, cols - vw);
  const camY = rows <= vh ? (rows - vh) / 2 : clamp(v.py + 0.5 - vh / 2, 0, rows - vh);
  const ox = Math.round(-camX * ts), oy = Math.round(-camY * ts), tile = A.tile || ART.pixel.tile, walker = A.walker || ART.pixel.walker, item = A.item || ART.pixel.item;
  WK.cam = { ox, oy, ts, fwd: (wx, wy) => [ox + wx * ts, oy + wy * ts, ts] };
  for (let y = Math.floor(camY); y < camY + vh; y++) for (let x = Math.floor(camX); x < camX + vw; x++) {
    const inside = x >= 0 && y >= 0 && x < cols && y < rows;
    tile(cx, inside ? m.rows[y][x] : (m.biome === 'saltmarsh' && y < 4 ? '~' : v.edge), ox + x * ts, oy + y * ts, ts, P, t, x, y);
  }
  for (const q of v.things) { const sx = ox + q.x * ts, sy = oy + q.y * ts;
    if (q.kind === 'item') item(cx, sx, sy, ts, t);
    else if (q.kind === 'pet') { const pp = ts / (q.wild ? 17 : 18); A.creature(cx, sx + ts / 2 - 2 * pp, sy + ts * 0.92, pp, q.sp, q.right, q.t); }
    else { const ry = q.ride ? sy - ts * 0.35 : sy; walker(cx, sx, ry, ts, q.look, q.dir, q.step); if (q.mark) drawMark(sx, ry, ts, t); } }
}
/* The weather, the night and the life in it (S5), on the arcade's shared ambience kit (shared/ambience.js).
   Weather arrives with the Tide Badge (see weatherNow in 12-walk.js): rain with splashes, and on every third ranch
   day the rain brings a thunderstorm (lightning, then thunder through the sound system); mist; falling ash with
   embers. Each area has its own air in eras that show light: leaves on the Thornwood wind, embers over Emberfall,
   glittering cloud in Cloudglass Pass, fireflies in the grass at night. Night is a dark layer with real pools of
   light: around you, and at every door in town. Purely visual: nothing here changes what creatures appear. */
/* Light and shadow (S6), on the arcade's light engine (shared/light.js): the sun follows the ranch day once the clock
   arrives (the Thorn Badge; before that it's always a bright late morning), so shadows swing and lengthen through the
   day and fall away from lit doors at night; each area has its own fog and the colour of the hour grades the scene. */
const WLT = Light.create({ reduce: () => reduceMotion, quality: () => (S.gfx || ((navigator.hardwareConcurrency || 8) <= 4 || Math.min(screen.width, screen.height) < 500 ? 'low' : 'high')) });
// Optional area settings leave the original defaults intact everywhere else. Saltmarsh uses
// sea-blue skylight, sand bounce and low mist; clock, shadow direction and lamps stay shared.
const AREA_AIR = { thornwood: { fog: .12, col: '#e6eee0' }, saltmarsh: { fog: .17, col: '#d4e5e4', tint: '#b6d4d5', fogTop: .58, mist: .26, dawnFog: .05, mistFx: .85,
    nightCol: '#23394c', grade: .72, shafts: .48, bounceSky: '#9cbecb', bounceGround: '#c8c5a0' }, emberfall: { fog: .22, col: '#9a8078', tint: '#ff9050' },
  cloudglass: { fog: .4, col: '#f2f6fa', tint: '#c8d8f0' }, stillreed: { fog: .35, col: '#dfe8d8', tint: '#b0c8a0' }, hollowecho: { fog: .3, col: '#c8ccd4', tint: '#a8a0c0' } };
function wbSun() {
  const bio = BIOMES[S.biome] || BIOMES.thornwood, air = AREA_AIR[S.biome] || {};
  const o = { sky: air.bounceSky || bio.sky[1], ground: air.bounceGround || bio.ground || '#5a8a4a' };
  if (!S.badges.includes('thorn')) return WLT.time(.18, o);
  return WLT.time(Light.cycle(dayPart(), .965, .70), o);
}
function doorLamps(m) { const out = []; m.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === 'D') out.push({ x: x + .5, y: y + .9, h: .6, reach: 4 }); })); return out; }
function wbAtmosphere(t, A, m, lights) {
  if (!A.light) return; const st = wbSun(), air = AREA_AIR[m.biome] || { fog: .1, col: '#e8eef0' }, w = weatherNow();
  WLT.fog(cx, PW, PH, t, { ground: PH, top: PH * (air.fogTop ?? .2), density: air.fog + (w === 'mist' ? (air.mist ?? .35) : 0) + (st.day && st.p < .12 ? (air.dawnFog ?? .08) : 0), col: Light.css(Light.mix(air.col, air.nightCol || '#1a2040', st.day ? 0 : .5)), lights });
  WLT.grade(cx, PW, PH, st, { tint: air.tint, amount: air.grade ?? .9 });
  if (w !== 'rain') WLT.shafts(cx, PW, PH, t, st, { strength: air.shafts ?? (.8 + air.fog) });
}
const AMB = Ambience.create({ reduce: () => reduceMotion });
function stormy() { return weatherNow() === 'rain' && (S.day || 1) % 3 === 0; }
function drawAmbience(t, A, v) {
  const w = weatherNow(), dk = A.light ? darkness() : 0, m = v.m, px = Math.max(2, Math.round(PH / 170)), fx = { px, splashAnywhere: true, wind: .15 };
  if (w === 'rain') Object.assign(fx, { rain: stormy() ? 1.15 : .75, storm: stormy() ? 1 : 0, wind: stormy() ? .55 : .2, onThunder: vol => sfx('thunder', vol) });
  else if (w === 'mist') Object.assign(fx, { fog: 1.3, ground: PH * 1.05 });
  else if (w === 'ash') Object.assign(fx, { ash: 1, embers: .45 });
  if (A.light && m.biome) {
    // Coastal mist stays translucent: the light engine supplies the low, coloured layer.
    const air = AREA_AIR[m.biome];
    if (w === 'mist' && air && air.mistFx !== undefined) Object.assign(fx, { fog: air.mistFx, fogCol: air.col });
    if (m.biome === 'thornwood' && w === 'clear') fx.leaves = .3;
    if (m.biome === 'emberfall') fx.embers = Math.max(fx.embers || 0, .3);
    if (m.biome === 'cloudglass') Object.assign(fx, { dust: .9, dustCol: '#ffffff', fog: Math.max(fx.fog || 0, .5), ground: PH * 1.05 });
    if (m.biome === 'hollowecho') { fx.dust = Math.max(fx.dust || 0, .6); fx.dustCol = '#e8e0cc'; if (w === 'mist') fx.fogCol = '#c8ccd4'; }
    if (m.biome === 'stillreed') { fx.fog = Math.max(fx.fog || 0, .45); fx.fogCol = '#e2ecdc'; fx.ground = PH * 1.05; if (w === 'clear') fx.fireflies = Math.max(fx.fireflies || 0, .35); }
    if (dk > .3 && m.biome !== 'emberfall' && w !== 'rain') fx.fireflies = dk;
  }
  AMB.weather(cx, PW, PH, t, fx);
  if (A.light && m.biome === 'hollowecho' && dk > .2) AMB.life(cx, PW, PH, t, { bats: 3, col: '#1a1820', y0: .05, y1: .35 }); // bats out of the caves at dusk
  if (!(dk > 0)) wbAtmosphere(t, A, m, []); // fog, the colour of the hour, light shafts
  if (dk > 0) {
    const lights = [], cam = WK.cam, at = (x, y) => cam && cam.fwd ? cam.fwd(x, y) : null;
    const me = at(WK.fx + .5, WK.fy + .5); lights.push(me ? { x: me[0], y: me[1], r: Math.max(PH * .22, me[2] * 2.6), col: '#ffe2b0' } : { x: PW / 2, y: PH * .6, r: PH * .3, col: '#ffe2b0' });
    if (cam && cam.fwd) for (let y = 0; y < m.rows.length; y++) for (let x = 0; x < m.rows[y].length; x++) if (m.rows[y][x] === 'D') {
      const p = at(x + .5, y + .5); if (p && p[0] > -PW * .2 && p[0] < PW * 1.2 && p[1] > -PH * .2 && p[1] < PH * 1.2) lights.push({ x: p[0], y: p[1] - p[2] * .3, r: p[2] * 2.4, col: '#ffc860', flick: true }); }
    wbAtmosphere(t, A, m, lights);
    AMB.lights(cx, PW, PH, t, { dark: dk, max: .58, tint: '#121838', lights });
    if (dk < 1) { cx.fillStyle = `rgba(255,140,60,${(0.14 * Math.sin(dk * Math.PI)).toFixed(3)})`; cx.fillRect(0, 0, PW, PH); }
  }
  AMB.flash(cx, PW, PH, t);
  if (A.light) WLT.bloom(cxRaw, cv, PW, PH, wbSun());
}
/* sparks fly outward for hits, sparkles rise for heals, a ring flashes for a catch */
function drawBurst(b, gy, p) {
  const x = PW * (b.side === 'a' ? AX : FX)[Math.max(0, b.i)] + 2 * p, y = gy - 8 * p, k = b.age / 0.6, n = b.big ? 10 : 6;
  cx.globalAlpha = 1 - k; cx.fillStyle = b.col;
  if (b.kind === 'heal') for (let i = 0; i < n; i++) { const a = i / n * 6.28; cx.fillRect(x + Math.cos(a) * 6 * p, y - k * 10 * p - (i % 3) * p * 2, p, p); }
  else if (b.kind === 'catch') { cx.strokeStyle = b.col; cx.lineWidth = p; cx.beginPath(); cx.arc(x, y, (4 + k * 16) * p, 0, 7); cx.stroke();
    for (let i = 0; i < n; i++) { const a = i / n * 6.28; cx.fillRect(x + Math.cos(a) * (6 + k * 14) * p, y + Math.sin(a) * (6 + k * 14) * p, p * 1.5, p * 1.5); } }
  else { const r = (2 + k * (b.big ? 12 : 8)) * p; for (let i = 0; i < n; i++) { const a = i / n * 6.28 + b.i; cx.fillRect(x + Math.cos(a) * r - p / 2, y + Math.sin(a) * r * 0.7 - p / 2, p * 1.3, p * 1.3); }
    if (k < 0.3) { cx.fillStyle = '#ffffff'; cx.fillRect(x - 2 * p, y - 2 * p, 4 * p, 4 * p); } }
  cx.globalAlpha = 1;
}
