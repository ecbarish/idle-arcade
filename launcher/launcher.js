/* The arcade launcher (L8, 2026-10-07): the homepage as a place instead of a shelf. Two styles, and players vote:
   - The living world: one landscape on the real clock (day, golden dusk, starry night with lit windows and torches),
     where each game is a place: Primordial's tide pool, Wildbond's Larkhaven, Realmbound's Thornvale, Starfall's
     dungeon gate. The games of the arcade sharing one world is the "light shared universe" made visible.
   - The arcade hall: a cozy room of cabinets whose screens play each game's cover; walk along with the arrow keys or
     tap a cabinet to walk to it, Enter to play.
   Each game is also a real link laid over its place, so keyboard, screen readers and taps work the same way.
   Reads window.ARCADE (GAMES, covers, idx) from index.html; draws with shared/ambience.js and shared/light.js.
   ?time=dawn|day|dusk|night previews a time of day.                                                            */
(function () {
  'use strict';
  const A = window.ARCADE, root = document.getElementById('launcher'); if (!A || !root) return;
  const cv = root.querySelector('#launchCv'), hits = root.querySelector('#launchHits'), hint = root.querySelector('#launchHint');
  const cx = cv.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AMB = Ambience.create({ reduce: () => reduce }), LT = Light.create({ reduce: () => reduce, quality: () => 'high' });
  const MODE_KEY = 'arcade-launcher';
  const firstMode = () => innerWidth < 720 ? 'road' : 'scene'; // phones start on the road: it scales with height, not width (L3)
  let mode = (() => { try { const m = localStorage.getItem(MODE_KEY); return m === 'hall' || m === 'road' || m === 'scene' ? m : firstMode(); } catch (e) { return firstMode(); } })();
  let W = 0, H = 0, hover = null, lastT = 0;
  const playable = A.GAMES.filter(g => g.href), byId = id => A.GAMES.find(g => g.id === id);
  const prog = id => { const p = A.idx[id]; return p ? p.summary : 'Not started yet'; };
  function size() {
    const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = Math.max(1, Math.round(W * d)); cv.height = Math.max(1, Math.round(H * d)); cx.setTransform(d, 0, 0, d, 0, 0);
    cx.imageSmoothingEnabled = false; layoutHits();
  }
  /* ---------- time of day: the real clock (or ?time=) ---------- */
  function clock() {
    const q = (new URLSearchParams(location.search).get('time') || '').toLowerCase();
    const fixed = { dawn: 6.4, day: 12, dusk: 18.6, night: 22.5 }[q];
    const d = new Date(), h = fixed !== undefined ? fixed : d.getHours() + d.getMinutes() / 60;
    return LT.time(Light.cycle(h / 24, 6 / 24, 19 / 24), { sky: '#9cc4e8', ground: '#5a7a44' });
  }
  const R = (x, y, w, h, col) => { cx.fillStyle = col; cx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };

  /* ===================== the living world ===================== */
  const PLACES = [ // x: centre as a fraction of the width; w: hit width fraction
    { id: 'primordial', x: .075, w: .13, name: 'The tide pool', col: '#5fd0c8' },
    { id: 'wildbond', x: .3, w: .3, name: 'Larkhaven', col: '#7fe0a0' },
    { id: 'realmbound', x: .645, w: .3, name: 'Thornvale', col: '#ffd27a' },
    { id: 'starfall-guild', x: .88, w: .2, name: 'The Starfall gate', col: '#b48aff' }
  ];
  const nightOf = st => st.day ? Math.max(0, 1 - st.elev * 4) * .6 * (st.golden > .6 ? 1 : 0) : 1;
  /* the sky, the hills and the ground with its winding road; scroll moves the far layers (the road style) */
  function backdrop(t, st, gy, p, scroll, circle) {
    const night = nightOf(st), sunX = W * (.5 - st.sunX * .45), sunY = H * (.62 - st.elev * .5);
    AMB.sky(cx, W, H, t, { top: st.day ? (st.golden > .5 ? '#6d8fc8' : '#7fb4e8') : '#0b1030', bottom: st.day ? (st.golden > .5 ? '#ffb27a' : '#d9ecf5') : '#29305c',
      night, stars: true, sun: st.day, sunX, sunY, moon: !st.day, moonX: W * .78, moonY: H * .16, clouds: { n: 5, col: st.golden > .5 ? '#ffd9c0' : '#ffffff', alpha: st.day ? .8 : .25, speed: 4 }, h: gy });
    // Otherworld, still an idea: a faint magic circle turning high in the sky
    if (circle) { cx.save(); cx.globalAlpha = .1 + .08 * night; cx.strokeStyle = '#bfe9ff'; cx.lineWidth = 1; cx.translate(W * .5, H * .16); cx.rotate(reduce ? 0 : t * .05);
      for (const k of [1, .72]) { cx.beginPath(); cx.arc(0, 0, H * .07 * k, 0, 7); cx.stroke(); } cx.restore(); }
    AMB.far(cx, W, H, t, { layers: [{ kind: 'peaks', col: st.day ? '#8aa3c0' : '#2a3352', base: .66, h: .2, par: .03, snow: 1, seed: 3 },
      { kind: 'oaks', col: st.day ? '#4f7a4a' : '#1c2a26', base: .78, h: .16, par: .1, seed: 5 }], night, px: p, scroll: scroll || 0 });
    const g = cx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, st.day ? '#6a9a48' : '#24361f'); g.addColorStop(1, st.day ? '#4f7a3a' : '#16241a'); cx.fillStyle = g; cx.fillRect(0, gy, W, H - gy);
    const off = scroll || 0;
    for (let x = -((off % (p * 2)) + p * 2); x < W; x += p * 2) { const wx = x + off, y = gy + H * .08 + Math.sin(wx / Math.max(W, 1) * 9) * H * .025; R(x, y, p * 2, p * 2, st.day ? '#c8a874' : '#5a4a36'); }
    for (let x = -(off % (p * 6)); x < W; x += p * 6) R(x, gy, p * 3, p, st.day ? '#7cae52' : '#2d4426');
  }
  function scene(t) {
    const st = clock(), gy = H * .8, p = Math.max(2, Math.round(Math.min(H / 80, W / 200)));
    backdrop(t, st, gy, p, 0, true);
    const lights = [];
    drawTidePool(PLACES[0], gy, p, t, st, lights);
    drawLarkhaven(PLACES[1], gy, p, t, st, lights);
    drawThornvale(PLACES[2], gy, p, t, st, lights);
    drawGate(PLACES[3], gy, p, t, st, lights);
    // Diamond Career, in design: stadium lights glowing over the far hill at night
    if (!st.day) { R(W * .955, gy - H * .3, p, H * .1, '#3a4058'); R(W * .945, gy - H * .32, p * 6, p * 2, '#fff6c8'); lights.push({ x: W * .955, y: gy - H * .31, r: H * .12, col: '#fff6c8' }); }
    AMB.life(cx, W, H, t, { birds: st.day ? 3 : 0, bats: st.day ? 0 : 3, y0: .1, y1: .35, px: p });
    AMB.weather(cx, W, H, t, { fireflies: st.day ? 0 : .6, leaves: st.day ? .15 : 0, ground: gy, px: p });
    LT.fog(cx, W, H, t, { ground: H, top: gy - H * .12, density: st.day && st.p < .2 ? .35 : .18, col: st.day ? '#e8f0f0' : '#2a3450', lights });
    LT.grade(cx, W, H, st, {});
    if (!st.day) AMB.lights(cx, W, H, t, { dark: 1, max: .55, lights });
    // the chosen place: a soft glow and its name
    if (hover) { const pl = PLACES.find(q => q.id === hover); if (pl) label(pl.x * W, gy - H * .42, byId(pl.id).title, prog(pl.id), pl.col); }
    return st;
  }
  function label(x, y, title, sub, col) {
    cx.save(); cx.font = `700 ${Math.max(13, Math.round(H / 18))}px Figtree, system-ui, sans-serif`; const fs2 = Math.max(11, Math.round(H / 26));
    const w1 = cx.measureText(title).width; cx.font = `${fs2}px Figtree, system-ui, sans-serif`; const w2 = cx.measureText(sub).width, w = Math.max(w1, w2) + 20, hh = H / 18 + fs2 + 16;
    const lx = Math.max(6, Math.min(W - w - 6, x - w / 2)), ly = Math.max(6, y - hh);
    cx.fillStyle = 'rgba(18,16,28,.82)'; cx.fillRect(lx, ly, w, hh); cx.fillStyle = col; cx.fillRect(lx, ly + hh - 3, w, 3);
    cx.fillStyle = '#fff'; cx.font = `700 ${Math.max(13, Math.round(H / 18))}px Figtree, system-ui, sans-serif`; cx.textBaseline = 'top'; cx.fillText(title, lx + 10, ly + 6);
    cx.fillStyle = '#cfc8e0'; cx.font = `${fs2}px Figtree, system-ui, sans-serif`; cx.fillText(sub, lx + 10, ly + 8 + H / 18); cx.restore();
  }
  function glow(x, y, r, col, a) { const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.save(); cx.globalAlpha = a; cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); cx.restore(); }
  function drawTidePool(pl, gy, p, t, st, lights) {
    const x = pl.x * W, w = W * .1, y = gy + H * .03;
    R(x - w / 2 - p * 2, y - p, w + p * 4, H * .09 + p * 2, st.day ? '#8a7a5a' : '#3a3428');
    R(x - w / 2, y, w, H * .09, st.day ? '#2f7f8a' : '#123a44');
    const cols = ['#f0b25a', '#86dc97', '#5fd0c8', '#ff9b85'];
    for (let i = 0; i < 7; i++) { const k = reduce ? i / 7 : ((i * .37 + t * .03 * (1 + i % 3)) % 1), cxp = x - w / 2 + p * 2 + k * (w - p * 4), cyp = y + H * .02 + (i % 3) * H * .022, c = cols[i % 4];
      R(cxp, cyp, p * 2, p * 2, c); if (!st.day) lights.push({ x: cxp, y: cyp, r: H * .05, col: c }); }
    for (let i = 0; i < 4; i++) R(x - w / 2 + i * w / 4 + p, y - p * 3, p, p * 3, st.day ? '#5a8a4a' : '#22381f'); // reeds
    if (hover === pl.id) glow(x, y + H * .04, w * .7, pl.col, .35);
  }
  function house(x, gy, p, wall, roof, st, lights, k) {
    const w = p * 14, h = p * 9;
    R(x, gy - h, w, h, st.day ? wall : '#4a4438'); R(x - p, gy - h - p * 6, w + p * 2, p * 2, roof);
    for (let i = 1; i < 4; i++) R(x - p + i * p, gy - h - p * 6 - i * p * 1.3, w + p * 2 - i * p * 2, p * 1.4, roof);
    R(x + p * 2, gy - p * 6, p * 3, p * 6, '#6a4224');
    const lit = !st.day || st.golden > .7, win = lit ? '#ffd47a' : '#7fb0d0';
    R(x + p * 8, gy - p * 7, p * 4, p * 3, win); if (lit) lights.push({ x: x + p * 10, y: gy - p * 5, r: p * 14, col: '#ffcf80', flick: 1 });
    if (k) { R(x + w - p * 3, gy - h - p * 8, p * 2, p * 4, '#7a6a5a'); AMB.smoke(cx, x + w - p * 2, gy - h - p * 8, p, lastT, { id: 'ch' + k, wind: .4 }); }
  }
  function drawLarkhaven(pl, gy, p, t, st, lights) {
    const x = pl.x * W;
    house(x - p * 26, gy, p, '#eadfc4', '#c8553d', st, lights, 1); house(x - p * 6, gy, p, '#eadfc4', '#3d8a8a', st, lights, 0); house(x + p * 14, gy, p, '#e4d8b8', '#8a5a3a', st, lights, 2);
    for (let i = 0; i < 9; i++) R(x - p * 30 + i * p * 7, gy + p * 2, p, p * 4, '#a0703a'); R(x - p * 30, gy + p * 3, p * 58, p, '#a0703a');
    // a partner creature trots along the fence, and a little light-sprite bobs above the roofs
    const k = reduce ? .5 : (Math.sin(t * .35) + 1) / 2, wx = x - p * 26 + k * p * 46, b = !reduce && Math.sin(t * 6) > 0 ? p : 0, right = Math.cos(t * .35) > 0;
    const q = (dx, dy, w, h, c) => R(wx + (right ? dx : -dx - w) * p, gy - 8 * p + dy * p - (dy > 6 ? 0 : b * .5), w * p, h * p, c);
    q(-2, 3, 9, 4, '#d8642e'); q(5, 1, 4, 4, '#d8642e'); q(7, 2, 1, 1, '#111'); q(-1, 7, 1, 2, '#b04a20'); q(5, 7, 1, 2, '#b04a20'); q(-4, 3, 2, 1, '#d8642e'); q(6, 0, 1, 1, '#d8642e');
    const sy = gy - p * 24 + Math.sin(t * 2) * p * (reduce ? 0 : 2); R(x + p * 4, sy, p * 3, p * 3, '#ffe36a'); glow(x + p * 5.5, sy + p * 1.5, p * 8, 'rgba(255,227,106,.9)', .5);
    if (!st.day) lights.push({ x: x + p * 5.5, y: sy, r: p * 12, col: '#fff0a0' });
    if (hover === pl.id) glow(x, gy - p * 8, W * .14, pl.col, .3);
  }
  function drawThornvale(pl, gy, p, t, st, lights) {
    const x = pl.x * W, w = p * 52, h = p * 16, stone = st.day ? '#9a958a' : '#46443e', dark = st.day ? '#7a756a' : '#33312c';
    R(x - w / 2, gy - h, w, h, stone);
    for (let i = 0; i < w / (p * 4); i++) if (i % 2 === 0) R(x - w / 2 + i * p * 4, gy - h - p * 3, p * 4, p * 3, stone);
    for (const s of [-1, 1]) { const tx = x + s * (w / 2 - p * 4) - p * 5; R(tx, gy - h - p * 12, p * 10, h + p * 12, dark); R(tx - p, gy - h - p * 14, p * 12, p * 3, '#5a3a5a');
      R(tx + p * 4, gy - h - p * 6, p * 2, p * 4, st.day ? '#2a2a34' : '#ffcf70'); if (!st.day) lights.push({ x: tx + p * 5, y: gy - h - p * 4, r: p * 10, col: '#ffcf70' }); }
    R(x - p * 7, gy - p * 12, p * 14, p * 12, '#2a2018'); R(x - p * 6, gy - p * 11, p * 12, p * 11, '#4a3020');
    for (let i = 0; i < 3; i++) R(x - p * 6, gy - p * (9 - i * 3), p * 12, p * .6, '#2a2018');
    // the Concord banner over the gate, lifting in the wind
    const wave = reduce ? 0 : Math.sin(t * 2) * p; R(x - p, gy - h - p * 18, p, p * 18, '#6a5a4a'); R(x, gy - h - p * 18 + wave * .3, p * 9, p * 6, '#2f5aa8'); R(x + p * 3, gy - h - p * 16 + wave * .3, p * 3, p * 2, '#ffcf4d');
    for (const s of [-1, 1]) { const fx = x + s * p * 10; R(fx - p * .5, gy - p * 8, p, p * 8, '#5a3a22');
      const L = AMB.fire(cx, fx, gy - p * 8, Math.max(1, p * .6), t, { id: 'tv' + s, size: .8, logs: false }); if (L) lights.push(Object.assign(L, { r: (L.r || p * 16) })); else lights.push({ x: fx, y: gy - p * 9, r: p * 16, col: '#ffb050', flick: 1 }); }
    if (hover === pl.id) glow(x, gy - h, W * .14, pl.col, .3);
  }
  let star = { t0: 0 };
  function drawGate(pl, gy, p, t, st, lights) {
    const x = pl.x * W, w = W * .16;
    cx.fillStyle = st.day ? '#5f7a52' : '#1f2a22'; cx.beginPath(); cx.moveTo(x - w / 2 - p * 6, gy); cx.quadraticCurveTo(x, gy - H * .42, x + w / 2 + p * 6, gy); cx.fill();
    R(x - p * 8, gy - p * 16, p * 16, p * 16, '#1a1424'); for (let i = 1; i <= 4; i++) R(x - p * 8 + i * p, gy - p * 16 - i * p, p * 16 - i * p * 2, p, '#1a1424');
    const runes = .55 + .45 * Math.sin(t * 2); for (let i = 0; i < 5; i++) R(x - p * 10 + i * p * 5, gy - p * 22 - (i % 2) * p, p * 2, p * 2, `rgba(180,138,255,${runes})`);
    lights.push({ x, y: gy - p * 10, r: p * 18, col: '#b48aff', flick: 1 });
    // now and then a star falls into the gate
    if (!reduce) { const k = (t % 9) / 1.2; if (k < 1) { const sx = x + W * .25 * (1 - k), sy = H * .05 + (gy - p * 12 - H * .05) * k; for (let i = 0; i < 6; i++) R(sx + i * p * 2, sy - i * p, p * 2, p, `rgba(255,240,180,${.9 - i * .14})`); } }
    R(x + p * 10, gy - p * 30, p, p * 14, '#6a5a4a'); R(x + p * 11, gy - p * 30, p * 6, p * 4, '#ff8fb1');
    if (hover === pl.id) glow(x, gy - p * 10, W * .1, pl.col, .4);
  }

  /* ===================== the road ===================== */
  /* Evan liked a character he controls and a world that can grow: the living world as a road you walk along.
     Each game is a stop; games still in design are building sites with a "coming soon" sign. A new game is one more
     stop at the end of the road. */
  const DRAW = { primordial: drawTidePool, wildbond: drawLarkhaven, realmbound: drawThornvale, 'starfall-guild': drawGate, otherworld: drawPortal };
  // every game is a stop: the four places, then later games (a portal or a ballpark once playable, a building site until then)
  const STOPS = PLACES.map(pl => Object.assign({}, pl)).concat(A.GAMES.filter(g => !PLACES.some(p => p.id === g.id)).map(g => ({ id: g.id, name: g.title, col: g.href ? '#bfe9ff' : '#d8d0c0', site: !(g.href && DRAW[g.id]) })));
  const ROAD = { x: 0, target: null, go: null, dir: 1, keys: {}, cam: 0 };
  const spacing = () => Math.max(W * .42, H * 1.1), stopX = i => spacing() * (i + .7), roadEnd = () => stopX(STOPS.length - 1) + spacing() * .7;
  function drawPortal(pl, gy, p, t, st, lights) { // Otherworld: a standing stone arch, a summoning circle turning inside it
    const x = pl.x * W, stone = st.day ? '#9a958a' : '#46443e';
    R(x - p * 12, gy - p * 30, p * 4, p * 30, stone); R(x + p * 8, gy - p * 30, p * 4, p * 30, stone); R(x - p * 13, gy - p * 33, p * 26, p * 4, st.day ? '#8a857a' : '#3a3832');
    cx.save(); cx.translate(x, gy - p * 15); cx.rotate(reduce ? 0 : t * .5); cx.strokeStyle = 'rgba(180,230,255,.9)'; cx.lineWidth = Math.max(1, p * .5);
    for (const k of [1, .7, .4]) { cx.beginPath(); cx.arc(0, 0, p * 8 * k, 0, 7); cx.stroke(); }
    cx.beginPath(); for (let i = 0; i <= 6; i++) { const a = i * Math.PI * 4 / 6; cx.lineTo(Math.cos(a) * p * 5.6, Math.sin(a) * p * 5.6); } cx.stroke(); cx.restore();
    glow(x, gy - p * 15, p * 14, 'rgba(160,220,255,.9)', st.day ? .25 : .5); lights.push({ x, y: gy - p * 15, r: p * 22, col: '#bfe9ff' });
    if (hover === pl.id) glow(x, gy - p * 15, p * 28, '#bfe9ff', .3);
  }
  function drawSite(pl, gy, p, t, st, lights) { // a building site: scaffolding, a half-built frame, a signpost
    const x = pl.x * W, wood = st.day ? '#a07a4a' : '#4a3a28', iron = st.day ? '#6a6a72' : '#33343a';
    for (const dx of [-18, -6, 6, 18]) R(x + dx * p, gy - p * 26, p, p * 26, wood);
    for (const dy of [8, 16, 24]) R(x - p * 18, gy - dy * p, p * 37, p, wood);
    for (let i = 0; i < 6; i++) R(x - p * 18 + i * p * 6, gy - p * 8 - i * p * 3, p * 2, p, wood); // a brace
    if (pl.id === 'baseball') { // a floodlight tower and the base paths chalked out
      R(x + p * 26, gy - p * 40, p * 2, p * 40, iron); R(x + p * 22, gy - p * 43, p * 10, p * 4, st.day ? '#cfcfd8' : '#fff6c8');
      if (!st.day) lights.push({ x: x + p * 27, y: gy - p * 41, r: p * 30, col: '#fff6c8' });
      cx.strokeStyle = st.day ? '#f4f0e0' : '#6a6658'; cx.lineWidth = Math.max(1, p * .5); cx.beginPath(); cx.moveTo(x, gy + p * 9); cx.lineTo(x + p * 10, gy + p * 5); cx.lineTo(x, gy + p * 1); cx.lineTo(x - p * 10, gy + p * 5); cx.closePath(); cx.stroke();
    } else { // Otherworld: a stone arch with a summoning circle turning inside it
      R(x - p * 12, gy - p * 30, p * 4, p * 30, st.day ? '#9a958a' : '#46443e'); R(x + p * 8, gy - p * 30, p * 4, p * 30, st.day ? '#9a958a' : '#46443e'); R(x - p * 12, gy - p * 33, p * 24, p * 4, st.day ? '#8a857a' : '#3a3832');
      cx.save(); cx.translate(x, gy - p * 15); cx.rotate(reduce ? 0 : t * .4); cx.strokeStyle = 'rgba(180,230,255,.75)'; cx.lineWidth = Math.max(1, p * .4);
      for (const k of [1, .7]) { cx.beginPath(); cx.arc(0, 0, p * 7 * k, 0, 7); cx.stroke(); } cx.restore(); lights.push({ x, y: gy - p * 15, r: p * 16, col: '#bfe9ff' });
    }
    R(x - p * 31, gy - p * 12, p, p * 12, wood); R(x - p * 40, gy - p * 16, p * 18, p * 6, st.day ? '#e8d8b0' : '#6a5a40');
    cx.save(); cx.fillStyle = '#3a2a1a'; cx.font = `700 ${Math.max(8, Math.round(p * 2.6))}px Figtree, system-ui, sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText('COMING SOON', x - p * 31, gy - p * 13); cx.restore();
    if (hover === pl.id) glow(x, gy - p * 14, p * 30, '#ffffff', .2);
  }
  function road(t, dt) {
    const st = clock(), gy = H * .78, p = Math.max(2, Math.round(H / 72)), end = roadEnd();
    // walking: arrow keys, or a tap/link walks you to a stop and in
    let vx = (ROAD.keys.right ? 1 : 0) - (ROAD.keys.left ? 1 : 0);
    if (vx) ROAD.target = null; else if (ROAD.target !== null) { const d = ROAD.target - ROAD.x; if (Math.abs(d) < 6) { const gm = ROAD.go; ROAD.target = null; if (gm && gm.href) location.href = gm.href; } else vx = Math.sign(d); }
    ROAD.x = Math.max(W * .08, Math.min(end - W * .05, ROAD.x + vx * H * 1.15 * dt)); if (vx) ROAD.dir = vx;
    const cam = ROAD.cam = Math.max(0, Math.min(end - W, ROAD.x - W * .45));
    backdrop(t, st, gy, p, cam, false);
    const lights = [];
    // the arcade's own signpost where the road begins
    { const sx = W * .04 - cam; if (sx > -W * .2) { R(sx, gy - p * 14, p, p * 14, '#6a4a2a'); R(sx - p * 6, gy - p * 19, p * 22, p * 6, '#3a2a50');
      cx.save(); cx.fillStyle = '#ffcf4d'; cx.font = `${Math.max(8, Math.round(p * 2.6))}px Bungee, Impact, sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('IDLE ARCADE', sx + p * 5, gy - p * 16); cx.restore(); } }
    let near = null, nearD = Infinity;
    STOPS.forEach((s, i) => {
      const wx = stopX(i), sx = wx - cam, d = Math.abs(wx - ROAD.x); if (d < nearD) { nearD = d; near = s; }
      if (sx < -W * .45 || sx > W * 1.45) return;
      const pl = Object.assign({}, s, { x: sx / W }); (s.site ? drawSite : DRAW[s.id])(pl, gy, p, t, st, lights);
    });
    hover = nearD < spacing() * .3 ? near.id : null;
    const g = hover && byId(hover);
    if (hint) hint.textContent = g ? (g.href ? 'Press Enter (or tap) to go into ' + g.title : g.title + ' is still being built') : 'Walk with ← → or tap a place';
    // you, and your Wildbond partner trotting behind
    const mx = ROAD.x - cam, step = vx && !reduce ? Math.floor(t * 8) % 2 : 0;
    walker(mx, gy + p * 4, p, ROAD.dir, step);
    { const fx = mx - ROAD.dir * p * 14, b = step ? p : 0, q = (dx, dy, w, h, c) => R(fx + (ROAD.dir > 0 ? dx : -dx - w) * p * .9, gy + p * 4 - 8 * p * .9 + dy * p * .9 - (dy > 6 ? 0 : b * .5), w * p * .9, h * p * .9, c);
      q(-2, 3, 9, 4, '#d8642e'); q(5, 1, 4, 4, '#d8642e'); q(7, 2, 1, 1, '#111'); q(-1, 7, 1, 2, '#b04a20'); q(5, 7, 1, 2, '#b04a20'); q(-4, 3, 2, 1, '#d8642e'); }
    if (!st.day) lights.push({ x: mx, y: gy - p * 8, r: p * 22, col: '#ffe0b0' });
    AMB.life(cx, W, H, t, { birds: st.day ? 3 : 0, bats: st.day ? 0 : 3, y0: .1, y1: .35, px: p });
    AMB.weather(cx, W, H, t, { fireflies: st.day ? 0 : .6, leaves: st.day ? .15 : 0, ground: gy, px: p });
    LT.fog(cx, W, H, t, { ground: H, top: gy - H * .12, density: st.day && st.p < .2 ? .35 : .18, col: st.day ? '#e8f0f0' : '#2a3450', lights });
    LT.grade(cx, W, H, st, {});
    if (!st.day) AMB.lights(cx, W, H, t, { dark: 1, max: .55, lights });
    if (g) { const i = STOPS.findIndex(s => s.id === hover); label(stopX(i) - cam, gy - H * .5, g.title, g.href ? prog(g.id) : 'Coming soon', STOPS[i].col); }
    // keep each place's link over the place as the road scrolls
    hits.querySelectorAll('[data-id]').forEach(h => { const i = STOPS.findIndex(s => s.id === h.dataset.id); h.style.left = ((stopX(i) - cam) / W - .14) * 100 + '%'; });
  }

  /* ===================== the arcade hall ===================== */
  const HALL = { x: .1, target: null, dir: 1, keys: {} }, CABS = playable.concat(A.GAMES.filter(g => !g.href));
  const screens = {};
  function cabX(i) { return W * (.1 + i * (.8 / Math.max(1, CABS.length - 1))); }
  function hall(t, dt) {
    const floor = H * .82, p = Math.max(2, Math.round(H / 120));
    R(0, 0, W, floor, '#1c1630'); for (let x = 0; x < W; x += p * 8) R(x, 0, p * 4, floor, '#201a36'); // striped wallpaper
    R(0, floor - p * 3, W, p * 3, '#3a2a50');
    const g = cx.createLinearGradient(0, floor, 0, H); g.addColorStop(0, '#2a1838'); g.addColorStop(1, '#140c1e'); cx.fillStyle = g; cx.fillRect(0, floor, W, H - floor);
    const carpet = ['#ff6fa8', '#7ab8ff', '#ffcf4d', '#7fe0a0']; for (let i = 0; i < 40; i++) { const x = (i * 97) % W, y = floor + p * 2 + ((i * 53) % Math.max(1, H - floor - p * 4)); R(x, y, p * 3, p, carpet[i % 4]); R(x + p, y - p, p, p * 3, carpet[i % 4]); }
    // neon sign
    cx.save(); cx.font = `${Math.max(14, Math.round(H / 10))}px Bungee, Impact, sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'top';
    const flick = reduce ? 1 : (Math.sin(t * 23) > -.95 ? 1 : .4); cx.shadowColor = '#ff6fa8'; cx.shadowBlur = 18 * flick; cx.fillStyle = `rgba(255,111,168,${.9 * flick})`; cx.fillText('IDLE ARCADE', W / 2, H * .05); cx.restore();
    const lights = [{ x: W / 2, y: H * .1, r: H * .3, col: '#ff6fa8' }];
    for (let i = 0; i < 5; i++) { const lx = W * (.1 + i * .2); R(lx - p * 3, 0, p * 6, p * 2, '#5a4a70'); lights.push({ x: lx, y: p * 3, r: H * .35, col: '#ffe8c0' }); }
    CABS.forEach((gm, i) => {
      const x = cabX(i), cw = Math.min(W * .12, H * .36), ch = H * .52, top = floor - ch, on = hover === gm.id, col = { primordial: '#1e5a60', 'starfall-guild': '#3a4a8a', realmbound: '#4a2a6a', wildbond: '#2f7a52', baseball: '#5a5a5a', otherworld: '#4a3a7a' }[gm.id] || '#444';
      R(x - cw / 2, top, cw, ch, col); R(x - cw / 2 - p, top, p, ch, '#00000055'); R(x - cw / 2, top, cw, p * 6, '#0a0a12');
      cx.save(); cx.font = `${Math.max(9, Math.round(cw / 9))}px Bungee, Impact, sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = gm.href ? '#ffcf4d' : '#8a8aa0';
      cx.fillText(gm.title.toUpperCase().slice(0, 14), x, top + p * 3); cx.restore();
      const sw = cw * .8, sh = ch * .38, sx = x - sw / 2, sy = top + p * 9;
      let s = screens[gm.id]; if (!s) { s = screens[gm.id] = document.createElement('canvas'); s.width = 160; s.height = 90; }
      const sc = s.getContext('2d'); if (gm.href && A.covers[gm.cover]) A.covers[gm.cover](sc, 160, 90, reduce ? 0 : t); else { sc.fillStyle = '#111'; sc.fillRect(0, 0, 160, 90); for (let k = 0; k < 160; k++) { sc.fillStyle = `rgba(255,255,255,${Math.random() * .25})`; sc.fillRect(Math.random() * 160, Math.random() * 90, 2, 1); }
        sc.fillStyle = '#ccc'; sc.font = '14px Bungee, Impact, sans-serif'; sc.textAlign = 'center'; sc.fillText('COMING SOON', 80, 50); }
      R(sx - p, sy - p, sw + p * 2, sh + p * 2, '#0a0a12'); cx.drawImage(s, sx, sy, sw, sh);
      R(x - cw * .4, sy + sh + p * 3, cw * .8, p * 4, '#1a1a24'); R(x - cw * .2, sy + sh + p * 2, p * 2, p * 3, '#e0483e'); R(x + cw * .1, sy + sh + p * 3, p * 2, p * 2, '#3a8ae0'); R(x + cw * .2, sy + sh + p * 3, p * 2, p * 2, '#ffcf4d');
      lights.push({ x, y: sy + sh / 2, r: cw * (on ? 1.4 : 1), col: gm.href ? '#a8d8ff' : '#666' });
      if (on) { glow(x, sy + sh / 2, cw, gm.href ? '#ffcf4d' : '#888', .35); label(x, top - p * 2, gm.title, gm.href ? prog(gm.id) : 'Coming soon', '#ffcf4d'); }
    });
    // you: walk to the cabinet you chose, or with the arrow keys
    const speed = W * .35, k = HALL.keys; let vx = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    if (vx) HALL.target = null; else if (HALL.target !== null) { const d = HALL.target - HALL.x * W; if (Math.abs(d) < 4) { const gm = HALL.go; HALL.target = null; if (gm && gm.href) location.href = gm.href; } else vx = Math.sign(d); }
    HALL.x = Math.max(.03, Math.min(.97, HALL.x + vx * speed * dt / Math.max(1, W))); if (vx) HALL.dir = vx;
    const near = CABS.reduce((best, gm, i) => Math.abs(cabX(i) - HALL.x * W) < Math.abs(cabX(best.i) - HALL.x * W) ? { gm, i } : best, { gm: CABS[0], i: 0 });
    if (Math.abs(cabX(near.i) - HALL.x * W) >= W * .05) hover = null; else { hover = near.gm.id; if (hint) hint.textContent = near.gm.href ? 'Press Enter (or tap) to play ' + near.gm.title : near.gm.title + ' is coming soon'; }
    walker(HALL.x * W, floor + p * 2, p * 1.4, HALL.dir, vx && !reduce ? Math.floor(t * 8) % 2 : 0);
    AMB.lights(cx, W, H, t, { dark: .8, max: .5, lights, tint: '#0a0614' });
    LT.bloom(cx, cv, W, H, { day: false });
  }
  function walker(x, gy, p, dir, step) {
    const q = (dx, dy, w, h, c) => R(x + (dir > 0 ? dx : -dx - w) * p, gy - 16 * p + dy * p, w * p, h * p, c);
    q(-3, 0, 6, 2, '#6b4423'); q(-3, 2, 6, 4, '#f1c9a0'); q(dir > 0 ? 1 : -2, 3, 1, 1, '#222'); q(-3, 6, 6, 5, '#3a6fd8'); q(-4, 7, 1, 3, '#f1c9a0'); q(3, 7, 1, 3, '#f1c9a0');
    q(-3, 11, 2, 5 - step, '#2b2b3a'); q(1, 11, 2, 4 + step, '#2b2b3a');
  }

  /* ===================== links over each place, input, the loop ===================== */
  function layoutHits() {
    const link = (g, x, w, name) => g.href ? `<a class="launch-hit" href="${g.href}" data-id="${g.id}" style="left:${(x - w / 2) * 100}%;width:${w * 100}%" aria-label="${g.title}${name ? ', ' + name : ''}: ${prog(g.id)}"></a>`
      : `<span class="launch-hit soon" data-id="${g.id}" style="left:${(x - w / 2) * 100}%;width:${w * 100}%" aria-label="${g.title}: coming soon" role="img"></span>`;
    hits.innerHTML = mode === 'scene' ? PLACES.map(pl => link(byId(pl.id), pl.x, pl.w, pl.name)).join('')
      : mode === 'road' ? STOPS.map((s, i) => link(byId(s.id), (stopX(i) - ROAD.cam) / Math.max(1, W), .28, s.name)).join('')
      : CABS.map((g, i) => link(g, cabX(i) / Math.max(1, W), Math.min(.12, H * .36 / Math.max(1, W)) + .02)).join('');
  }
  const walkerOf = () => mode === 'hall' ? HALL : ROAD;
  const xOf = id => mode === 'hall' ? cabX(CABS.findIndex(g => g.id === id)) : stopX(STOPS.findIndex(s => s.id === id));
  hits.addEventListener('mouseover', e => { if (mode !== 'scene') return; const h = e.target.closest('[data-id]'); hover = h ? h.dataset.id : null; });
  hits.addEventListener('mouseleave', () => { if (mode === 'scene') hover = null; });
  hits.addEventListener('focusin', e => { // keyboard: tabbing to a place brings you to it
    const h = e.target.closest('[data-id]'); if (!h) return; hover = h.dataset.id;
    if (mode === 'hall') HALL.x = xOf(hover) / Math.max(1, W); else if (mode === 'road') ROAD.x = xOf(hover);
  });
  hits.addEventListener('click', e => { // in the hall and on the road, a tap walks you there first, then you go in
    if (mode === 'scene') return; const h = e.target.closest('[data-id]'); if (!h || e.detail === 0) return; e.preventDefault();
    const w = walkerOf(), g = byId(h.dataset.id); w.target = xOf(g.id); w.go = g;
  });
  root.querySelector('.launch-view').addEventListener('click', e => { // tapping empty ground on the road walks there
    if (mode !== 'road' || e.target.closest('[data-id]')) return; const r = cv.getBoundingClientRect(); ROAD.target = ROAD.cam + (e.clientX - r.left); ROAD.go = null;
  });
  addEventListener('keydown', e => {
    if (mode === 'scene' || (!root.contains(document.activeElement) && document.activeElement !== document.body)) return;
    const w = walkerOf(), k = e.key; if (k === 'ArrowLeft' || k === 'a') { w.keys.left = true; e.preventDefault(); } if (k === 'ArrowRight' || k === 'd') { w.keys.right = true; e.preventDefault(); }
    if ((k === 'Enter' || k === ' ') && hover && document.activeElement === document.body) { const g = byId(hover); if (g && g.href) location.href = g.href; }
  });
  addEventListener('keyup', e => { for (const w of [HALL, ROAD]) { if (e.key === 'ArrowLeft' || e.key === 'a') w.keys.left = false; if (e.key === 'ArrowRight' || e.key === 'd') w.keys.right = false; } });
  function setMode(m) {
    mode = m; try { localStorage.setItem(MODE_KEY, m); } catch (e) {}
    root.dataset.mode = m; hover = null; root.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    if (hint) hint.textContent = m === 'scene' ? 'Choose a place to play' : m === 'road' ? 'Walk with ← → or tap a place' : 'Walk with ← → or tap a cabinet';
    if (m === 'road' && !ROAD.x) { const i = Math.max(0, STOPS.findIndex(s => A.idx[s.id])); ROAD.x = stopX(i) - spacing() * .3; } // start near a game you've played
    layoutHits();
  }
  root.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  function frame(ms) {
    const t = ms / 1000, dt = Math.min(.1, t - lastT || 0); lastT = t;
    if (W >= 1 && H >= 1 && !document.hidden) { const tt = reduce ? 0 : t; if (mode === 'scene') scene(tt); else if (mode === 'road') road(tt, dt); else hall(tt, dt); }
    requestAnimationFrame(frame);
  }
  addEventListener('resize', size); size(); setMode(mode); requestAnimationFrame(frame);
  if (window.Votes) Votes.card(root.querySelector('#launchVote'), { id: 'launcher-style-2', game: 'hub', version: A.VERSION,
    question: 'Which homepage do you like best?', note: 'Try all three with the buttons above, then pick one. This helps decide what the arcade keeps.',
    options: [['scene', 'The living world'], ['road', 'The road'], ['hall', 'The arcade hall']] });
  window.__launcher = { setMode, get mode() { return mode; }, PLACES, CABS, STOPS, hall: HALL, road: ROAD };
})();
