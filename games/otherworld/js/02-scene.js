'use strict';
/* Otherworld's scenes, drawn in code to fill the whole window (games feel like games): the Between as a library of
   stars, and Asterhold's places (the road, the guild hall, the watchtower, the walls, the Deepwood, Oldroot's heart).
   Uses shared/ambience.js for sky, distant hills, weather, fire and night light. */
const cv = document.getElementById('scene'), cx = cv.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const AMB = Ambience.create({ reduce: () => reduce });
let W = 0, H = 0, bg = 'between', night = false;
function setScene(b, n) { bg = b || 'between'; night = !!n; }
function size() { const d = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); cx.imageSmoothingEnabled = false; }
addEventListener('resize', size); size();
const R = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
const px = () => Math.max(3, Math.round(Math.min(W / 220, H / 130)));

const SCENES = {
  between(t) {
    const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0c0b22'); g.addColorStop(1, '#1d1b3a'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (let i = 0; i < 140; i++) { const x = (i * 97.3) % W, y = (i * 53.7 + (reduce ? 0 : t * (4 + i % 5))) % H, a = .3 + .5 * Math.abs(Math.sin(t * .8 + i));
      R(x, H - y, 2, 2, `rgba(220,215,255,${a})`); }
    const p = px();                              // shelves of lives, drifting in the dark
    for (let s = 0; s < 4; s++) { const sy = H * (.2 + s * .2), off = reduce ? 0 : Math.sin(t * .3 + s) * 10;
      for (let b = 0; b < 26; b++) { const bx = (b * 47 + s * 23) % (W + 60) - 30 + off, h = p * (5 + (b * 7 + s) % 4);
        R(bx, sy - h, p * 2, h, ['#3a3a7a', '#5a3a6a', '#2a4a6a', '#6a5a3a'][(b + s) % 4]); R(bx, sy - h, p * 2, p * .6, 'rgba(255,240,200,.35)'); }
      R(0, sy, W, p * .6, 'rgba(160,150,220,.18)'); }
    const gl = cx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, H * .5); gl.addColorStop(0, 'rgba(255,230,170,.18)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gl; cx.fillRect(0, 0, W, H);
  },
  road(t) {
    const gy = H * .72, p = px();
    AMB.sky(cx, W, H, t, { top: night ? '#141a3a' : '#f2b07a', bottom: night ? '#2a3058' : '#ffe2b8', night: night ? 1 : 0, sun: !night, sunX: W * .2, sunY: H * .3, moon: night, moonX: W * .8, moonY: H * .15, clouds: { n: 4 }, h: gy });
    AMB.far(cx, W, H, t, { layers: [{ kind: 'oaks', col: night ? '#1c2a26' : '#4a6a3a', base: .72, h: .2, par: .05, seed: 2 }], night: night ? 1 : 0, px: p });
    R(0, gy, W, H - gy, night ? '#26301e' : '#6a8a3a'); R(0, gy + H * .08, W, H * .07, night ? '#4a3e2a' : '#b89460');
    // Lanthorn on the hill, its bell tower ringing
    for (let i = 0; i < 6; i++) R(W * .62 + i * p * 9, gy - p * (8 + (i % 3) * 3), p * 8, p * (8 + (i % 3) * 3), night ? '#2a2620' : '#8a6a4a');
    R(W * .7, gy - p * 22, p * 6, p * 22, night ? '#3a3228' : '#9a7a5a'); R(W * .7 - p, gy - p * 24, p * 8, p * 3, night ? '#4a3a2a' : '#6a4a3a');
    if (night) for (let i = 0; i < 6; i++) R(W * .62 + i * p * 9 + p * 3, gy - p * 5, p * 2, p * 2, '#ffcf70');
    const cxp = W * .2, bob = reduce ? 0 : Math.round(Math.sin(t * 3)) * p * .3;      // the hay cart
    R(cxp, gy + H * .06 + bob, p * 26, p * 8, '#7a5230'); R(cxp + p, gy + H * .06 - p * 4 + bob, p * 24, p * 5, '#d8b858');
    R(cxp + p * 3, gy + H * .06 + p * 7, p * 6, p * 6, '#4a3020'); R(cxp + p * 18, gy + H * .06 + p * 7, p * 6, p * 6, '#4a3020');
    if (night) AMB.lights(cx, W, H, t, { dark: .8, lights: [{ x: W * .66, y: gy - p * 5, r: H * .25, col: '#ffcf70', flick: 1 }] });
  },
  guild(t) {
    const p = px(), fy = H * .78;
    R(0, 0, W, fy, '#4a3020'); for (let x = 0; x < W; x += p * 10) R(x, 0, p, fy, '#3a2416');           // plank walls
    R(0, fy, W, H - fy, '#5a3a22'); for (let y = fy; y < H; y += p * 4) R(0, y, W, p * .5, '#4a2e1a');
    for (let i = 0; i < 5; i++) { const bx = W * (.1 + i * .2); R(bx, H * .08, p * 10, p * 16, ['#2f5aa8', '#a83a3a', '#3a8a5a', '#a87a2a', '#6a3a8a'][i]); R(bx + p * 3, H * .08 + p * 5, p * 4, p * 4, '#f2d24a'); }
    R(W * .15, fy - p * 14, W * .4, p * 14, '#7a5030'); R(W * .15, fy - p * 15, W * .4, p * 2, '#9a6a40');   // the counter
    const cx0 = W * .72, cy0 = fy - p * 22, pulse = reduce ? .6 : .5 + .3 * Math.sin(t * 2);             // the crystal
    R(cx0 - p * 4, fy - p * 10, p * 8, p * 10, '#6a6a7a');
    cx.fillStyle = `rgba(120,220,255,${pulse})`; cx.beginPath(); cx.moveTo(cx0, cy0 - p * 8); cx.lineTo(cx0 + p * 5, cy0); cx.lineTo(cx0, cy0 + p * 10); cx.lineTo(cx0 - p * 5, cy0); cx.fill();
    const lights = [{ x: cx0, y: cy0, r: H * .35, col: '#8ae0ff' }];
    for (let i = 0; i < 3; i++) { const lx = W * (.2 + i * .3); R(lx - p, H * .3, p * 3, p * 4, '#ffcf70'); lights.push({ x: lx, y: H * .32, r: H * .3, col: '#ffcf70', flick: 1 }); }
    AMB.lights(cx, W, H, t, { dark: night ? .9 : .6, max: .55, lights });
  },
  tower(t) {
    const gy = H * .75, p = px();
    AMB.sky(cx, W, H, t, { top: '#7a9ac8', bottom: '#d8e4ea', clouds: { n: 5 }, h: gy });
    AMB.far(cx, W, H, t, { layers: [{ kind: 'pines', col: '#2e4a32', base: .72, h: .3, par: .05, seed: 4 }], px: p });
    R(0, gy, W, H - gy, '#4a6a32');
    R(W * .12, gy - p * 40, p * 16, p * 40, '#7a7268'); for (let i = 0; i < 4; i++) R(W * .12 + i * p * 4, gy - p * 43, p * 3, p * 3, '#7a7268');  // the old tower
    for (let i = 0; i < 9; i++) { const x = ((reduce ? i * 120 : t * (60 + i * 9) + i * 140) % (W + 200)) - 100, y = gy + p * (3 + (i % 3) * 5);   // beasts running out of the trees
      R(W - x, y, p * 7, p * 3, ['#5a4a3a', '#6a5a4a', '#4a3a2a'][i % 3]); R(W - x - p * 2, y - p, p * 3, p * 3, '#4a3a2a'); }
  },
  walls(t) {
    const gy = H * .72, p = px();
    AMB.sky(cx, W, H, t, { top: '#0a0e24', bottom: '#2a1e3a', night: 1, moon: true, moonX: W * .2, moonY: H * .15, h: gy });
    R(0, gy, W, H - gy, '#1c1a14');
    for (let x = 0; x < W; x += p * 5) R(x, gy - p * 24 - (x / p % 3) * p, p * 4, p * 30, '#4a3624');        // the palisade
    const lights = [];
    for (let i = 0; i < 4; i++) { const fx = W * (.15 + i * .24), L = AMB.fire(cx, fx, gy - p * 24, p * .7, t, { id: 'w' + i, size: .9, logs: false }); lights.push(L || { x: fx, y: gy - p * 26, r: H * .2, col: '#ffb050', flick: 1 }); }
    for (let i = 0; i < 14; i++) if (reduce || Math.sin(t * 1.3 + i * 2) > -.2) R(W * ((i * .07) % 1), gy + p * (10 + (i % 4) * 4), p * 2, p, '#ffe86a');   // eyes in the dark
    AMB.lights(cx, W, H, t, { dark: .85, max: .6, lights });
  },
  forest(t) {
    const p = px(); R(0, 0, W, H, '#0e1a12');
    for (let i = 0; i < 12; i++) { const x = (i * 211) % W; R(x, 0, p * (6 + i % 4), H, ['#1a2a1a', '#22301e', '#14221a'][i % 3]); }
    const gl = cx.createRadialGradient(W * .6, H * .55, 0, W * .6, H * .55, H * .5); gl.addColorStop(0, 'rgba(140,255,120,.35)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gl; cx.fillRect(0, 0, W, H);
    AMB.weather(cx, W, H, t, { spores: .6, fireflies: .4, ground: H, px: p });
  },
  heart(t) {
    const p = px(), gy = H * .8; R(0, 0, W, H, '#0a140e'); R(0, gy, W, H - gy, '#14220e');
    const tx = W / 2, sway = reduce ? 0 : Math.sin(t * .6) * p;                                                 // Oldroot
    R(tx - p * 10 + sway * .3, gy - p * 50, p * 20, p * 50, '#4a3a22');
    for (let i = 0; i < 9; i++) R(tx - p * 24 + i * p * 6 + sway, gy - p * (56 + (i % 3) * 6), p * 10, p * 12, '#2a4a22');
    for (let i = 0; i < 7; i++) R(tx - p * 8 + (i * 5) % 16 * p, gy - p * (10 + i * 6), p * 2, p * 5, '#0a0a0a');   // the black rot
    const pulse = reduce ? .4 : .3 + .2 * Math.sin(t * 2), gl = cx.createRadialGradient(tx, gy - p * 30, 0, tx, gy - p * 30, H * .45);
    gl.addColorStop(0, `rgba(120,255,140,${pulse})`); gl.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gl; cx.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + (reduce ? 0 : t * .2); R(tx + Math.cos(a) * W * .38, gy - p * 6 + Math.sin(a) * p * 6, p * 2, p, '#ffe86a'); }   // circling eyes
  }
};
function frame(ms) {
  const t = ms / 1000;
  if (W && H && !document.hidden) (SCENES[bg] || SCENES.between)(reduce ? 0 : t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
