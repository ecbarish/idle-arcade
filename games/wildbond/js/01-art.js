'use strict';
/* Art eras. All drawing goes through ART[era]. A new era is a new object with the same functions:
   creature(ctx, x, y, size, species, facingRight, t, opts), backdrop(ctx, w, h, biome, t), tamer(ctx, x, y, size, color, t),
   and for the walkable world tile(...) and walker(...) (see the bottom of this file).
   x,y = the creature's feet (bottom center). size = pixel unit. Gameplay never draws directly. */
const ART = {};
let reduceMotion = false;
try { reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

ART.pixel = {
  creature(c, x, y, p, sp, right, t, o) {
    o = o || {};
    if (sp.big) p = Math.round(p * 1.25);
    const col = o.col || sp.col, dk = '#111', b = t && !reduceMotion ? (Math.sin(t * 5) > 0 ? 1 : 0) : 0;
    c.save(); c.translate(Math.round(x), Math.round(y - 14 * p)); if (o.alpha !== undefined) c.globalAlpha = o.alpha;
    if (right) { c.translate(4 * p, 0); c.scale(-1, 1); }
    const q = (gx, gy, w, h, cc) => { c.fillStyle = cc; c.fillRect(Math.round(gx * p), Math.round(gy * p), Math.ceil(w * p), Math.ceil(h * p)); };
    switch (sp.fam) {
      case 'spider': q(0, 7, 8, 5, col); q(-3, 6, 4, 4, col); q(-3, 7, 1, 1, '#ff3a3a'); q(-1, 7, 1, 1, '#ff3a3a');
        for (let i = 0; i < 4; i++) { q(-1 + i * 2.5, 12, 1, 2 - ((i + b) % 2), col); q(-2 + i * 2.5, 5, 1, 2, col); } break;
      case 'lizard': case 'croc': { const L = sp.fam === 'croc' ? 14 : 11; q(-1, 9, L - 3, 3, col); q(-5, 9, 4, 2, col); q(-5, 9, 1, 1, dk); q(-3, 9, 1, 1, '#ffde55');
        q(L - 4, 10, 4, 1, col); q(0, 12, 1, 2 - b, col); q(L - 6, 12, 1, 1 + b, col); if (sp.fam === 'croc') q(-6, 10, 2, 1, '#e8e4d4'); if (sp.wings) { q(0, 6 - b, 5, 2, 'rgba(255,255,255,.55)'); q(2, 5 - b, 3, 1, 'rgba(255,255,255,.4)'); } break; }
      case 'boar': q(-1, 6, 10, 5, col); q(-4, 7, 4, 4, col); q(-5, 9, 1, 1, '#e8e4d4'); q(-4, 8, 1, 1, '#ffde55');
        q(0, 11, 1, 3 - b, col); q(7, 11, 1, 2 + b, col); q(2, 11, 1, 3, col); q(5, 11, 1, 3, col); q(0, 5, 6, 1, 'rgba(0,0,0,.3)'); break;
      case 'horse': { const mn = 'rgba(0,0,0,.4)'; q(-1, 5, 11, 5, col); q(-3, 1, 3, 6, col); q(-6, 1, 4, 3, col); q(-6, 2, 1, 1, dk); q(-7, 3, 1, 1, col);
        q(-1, 1, 1, 5, mn); q(10, 5, 2, 6, mn); q(0, 10, 1, 4 - b, col); q(2, 10, 1, 4, col); q(7, 10, 1, 4, col); q(9, 10, 1, 4 + b - 1, col);
        if (sp.antlers) { const a = '#c8b088'; q(-5, -2, 1, 3, a); q(-7, -3, 2, 1, a); q(-3, -2, 1, 3, a); q(-3, -3, 3, 1, a); q(-6, -4, 1, 1, a); } break; }
      case 'bird': q(-1, 6, 7, 4, col); q(-4, 4, 4, 4, col); q(-5, 6, 1, 1, '#f2c14e'); q(-3, 5, 1, 1, dk);
        q(0, 4 - b * 2, 5, 2, 'rgba(255,255,255,.55)'); q(6, 6, 3, 2, col); q(1, 10, 1, 4, '#d8a040'); q(4, 10, 1, 4, '#d8a040'); break;
      case 'sprite': { const fy = reduceMotion ? 0 : Math.sin(t * 3) * 1.5;
        c.globalAlpha = (o.alpha !== undefined ? o.alpha : 1) * 0.35; c.fillStyle = col; c.beginPath(); c.arc(2 * p, (7 + fy) * p, 6 * p, 0, 7); c.fill();
        c.globalAlpha = o.alpha !== undefined ? o.alpha : 1; q(-1, 5 + fy, 6, 5, col); q(0, 4 + fy, 4, 1, col); q(0, 7 + fy, 1, 1, dk); q(3, 7 + fy, 1, 1, dk);
        q(-4, 4 + fy - b, 3, 2, 'rgba(255,255,255,.7)'); q(5, 4 + fy - b, 3, 2, 'rgba(255,255,255,.7)'); break; }
      default: q(-1, 7, 10, 4, col); q(-4, 5 + b * 0.3, 4, 4, col); q(-4, 4, 1, 1, col); q(-2, 4, 1, 1, col); q(-5, 6, 1, 1, dk); q(-4, 6, 1, 1, '#ffde55');
        q(0, 11, 1, 3 - b, col); q(7, 11, 1, 2 + b, col); q(2, 11, 1, 3, col); q(5, 11, 1, 3, col);
        if (sp.fam === 'cat') { q(9, 6, 1, 1, col); q(10, 4, 1, 3, col); } else if (sp.fam === 'hyena') { q(2, 8, 1, 1, dk); q(5, 9, 1, 1, dk); q(9, 7, 2, 1, col); } else q(9, 6, 2, 1, col);
        if (sp.el === 'Ember' && sp.fam === 'wolf') { q(0, 6, 1, 1, '#ffd23a'); q(3, 6, 1, 1, '#ffd23a'); }
    }
    c.restore();
  },
  backdrop(c, w, h, bio, t) {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, bio.sky[0]); g.addColorStop(1, bio.sky[1]); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = bio.hill; c.beginPath(); c.moveTo(0, h * 0.7);
    for (let x = 0; x <= w; x += w / 10) c.lineTo(x, h * 0.55 + Math.sin(x * 0.02 + 1) * h * 0.07); c.lineTo(w, h); c.lineTo(0, h); c.fill();
    const gy = h * 0.8; c.fillStyle = bio.ground; c.fillRect(0, gy, w, h - gy);
    c.fillStyle = 'rgba(0,0,0,.12)'; for (let x = 0; x < w; x += 18) c.fillRect(x + (Math.floor(x / 18) % 2) * 6, gy + 6, 8, 3);
    return gy;
  },
  tamer(c, x, y, p, col, t) {
    const q = (gx, gy, w, h, cc) => { c.fillStyle = cc; c.fillRect(Math.round(x + gx * p), Math.round(y - 13 * p + gy * p), Math.ceil(w * p), Math.ceil(h * p)); };
    q(2, 10, 1, 3, '#2b2b3a'); q(5, 10, 1, 3, '#2b2b3a'); q(1, 5, 6, 5, col); q(1, 1, 6, 4, '#f1c9a0'); q(2, 3, 1, 1, '#111'); q(5, 3, 1, 1, '#111');
    q(0, 0, 8, 2, '#6b4423'); q(1, -1, 6, 1, '#6b4423'); q(-1, 1, 10, 1, '#6b4423');
  }
};
/* Half-size pixels, four-tone ramps and hand-shaped silhouettes. Frames are cached on the
   logical grid, then scaled without filtering. Drawing never consumes gameplay randomness. */
ART.bit16 = (() => {
  const ink = '#18232b', cream = '#f4e6c3', cache = new Map();
  const mix = (a, b, n) => {
    const aa = parseInt(a.slice(1), 16), bb = parseInt(b.slice(1), 16);
    return '#' + [16, 8, 0].map(s => Math.round(((aa >> s) & 255) * (1 - n) + ((bb >> s) & 255) * n).toString(16).padStart(2, '0')).join('');
  };
  const phase = t => !t || reduceMotion ? 0 : Math.floor(t * 12) % 16;
  function sprite(key, paint) {
    if (cache.has(key)) return cache.get(key);
    const w = 64, h = 48, pixels = new Array(w * h);
    const dot = (x, y, col) => { x = Math.round(x) + 18; y = Math.round(y) + 8; if (x >= 0 && x < w && y >= 0 && y < h) pixels[y * w + x] = col; };
    const rect = (x, y, ww, hh, col) => { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) dot(x + i, y + j, col); };
    // Scanline polygons keep the source pixels crisp, including diagonal edges.
    const poly = (points, col, shaded = true) => {
      const top = Math.min(...points.map(v => v[1])), bot = Math.max(...points.map(v => v[1]));
      const ramp = shaded ? [mix(col, '#ffffff', 0.32), mix(col, '#ffffff', 0.12), col, mix(col, ink, 0.32)] : [col, col, col, col];
      for (let y = Math.ceil(top); y < bot; y++) {
        const hits = [], scan = y + 0.5;
        for (let i = 0; i < points.length; i++) { const a = points[i], b = points[(i + 1) % points.length];
          if ((a[1] <= scan && b[1] > scan) || (b[1] <= scan && a[1] > scan)) hits.push(a[0] + (scan - a[1]) * (b[0] - a[0]) / (b[1] - a[1])); }
        hits.sort((a, b) => a - b);
        const shade = ramp[Math.min(3, Math.floor((y - top) / Math.max(1, bot - top) * 4))];
        for (let i = 0; i + 1 < hits.length; i += 2) for (let x = Math.ceil(hits[i]); x < hits[i + 1]; x++) dot(x, y, shade);
      }
    };
    paint(rect, poly, dot);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const ctx = cv.getContext('2d');
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x, col = pixels[i];
      if (col || pixels[i - 1] || pixels[i + 1] || pixels[i - w] || pixels[i + w]) { ctx.fillStyle = col || ink; ctx.fillRect(x, y, 1, 1); }
    }
    // Keep custom portrait colours from growing the frame cache indefinitely.
    if (cache.size >= 384) cache.delete(cache.keys().next().value);
    cache.set(key, cv); return cv;
  }
  function draw(c, cv, x, y, p, right, alpha) {
    c.save(); c.imageSmoothingEnabled = false; if (alpha !== undefined) c.globalAlpha = alpha;
    c.translate(Math.round(x), Math.round(y)); if (right) { c.translate(4 * p, 0); c.scale(-1, 1); }
    c.drawImage(cv, -9 * p, -18 * p, 32 * p, 24 * p); c.restore();
  }
  return {
    creature(c, x, y, p, sp, right, t, o) {
      o = o || {}; const col = o.col || sp.col, f = phase(t), a = f * Math.PI / 8;
      const step = Math.round(Math.sin(a) * 2), wing = Math.round(Math.sin(a) * 3), dk = mix(col, ink, 0.45), hi = mix(col, '#ffffff', 0.48);
      const cv = sprite(['c', sp.fam, sp.el, !!sp.antlers, !!sp.big, col, f].join(':'), (r, poly, dot) => {
        const leg = (xx, yy, sway, color = dk) => poly([[xx, yy], [xx + 3, yy], [xx + 3 + sway, 27], [xx + 4 + sway, 28], [xx + sway, 28]], color);
        const eye = (xx, yy, color = '#ffcf62') => { r(xx, yy, 3, 2, ink); dot(xx, yy, color); dot(xx, yy - 1, cream); };
        switch (sp.fam) {
          case 'wolf': case 'cat': case 'hyena': {
            leg(3, 20, -step); leg(12, 20, step);
            const back = sp.fam === 'hyena' ? 12 : 14;
            poly([[-1, back], [4, back - 1], [14, back], [19, 17], [17, 22], [2, 23], [-2, 19]], col);
            if (sp.fam === 'cat') poly([[17, 19], [21, 18], [23 + step, 11], [25 + step, 9], [25 + step, 14], [23, 21], [18, 22]], col);
            else poly([[17, 16], [22, 15 + step], [25, 17 + step], [21, 19 + step], [17, 19]], col);
            leg(0, 21, step, col); leg(15, 21, -step, col);
            poly([[-7, 9], [-8, 4], [-4, 7], [-1, 5], [0, 11], [3, 15], [0, 20], [-7, 19], [-11, 15], [-11, 12]], col);
            r(-8, 8, 1, 2, '#d99589'); r(-3, 8, 1, 2, '#d99589'); eye(-8, 12);
            r(-12, 14, 3, 2, ink); r(-9, 17, 4, 1, cream); r(1, 15, 7, 1, hi);
            if (sp.fam === 'cat') { r(-10, 16, 4, 1, hi); r(3, 18, 2, 1, dk); r(8, 18, 2, 1, dk); }
            if (sp.fam === 'hyena') { poly([[1, 13], [3, 9], [5, 12], [7, 10], [9, 14]], dk); [[3, 18], [7, 20], [12, 17], [15, 20]].forEach(([xx, yy]) => r(xx, yy, 2, 2, dk)); }
            if (sp.el === 'Ember') { poly([[-1, 12], [1, 7 - wing], [3, 12], [5, 9 - wing], [7, 15], [4, 18]], '#ed722d'); r(1, 12, 2, 3, '#ffe187'); }
            break;
          }
          case 'boar': {
            leg(3, 19, -step); leg(12, 19, step);
            poly([[-3, 15], [0, 11], [5, 10], [14, 11], [19, 15], [18, 21], [13, 24], [0, 23], [-4, 19]], col);
            poly([[18, 15], [22, 13], [24, 15], [23, 18], [21, 18], [21, 16]], dk);
            leg(0, 21, step, col); leg(15, 21, -step, col);
            poly([[-8, 13], [-7, 9], [-3, 11], [0, 14], [0, 21], [-7, 23], [-11, 20], [-11, 16]], col);
            r(-12, 18, 4, 3, mix(col, '#c99781', 0.6)); eye(-7, 15); r(-12, 19, 1, 1, dk);
            poly([[-9, 21], [-11, 16], [-10, 15], [-8, 19], [-6, 21]], cream);
            poly([[-1, 12], [2, 8], [4, 11], [7, 7], [9, 10], [12, 8], [16, 13], [11, 15], [3, 14]], '#659545');
            r(3, 10, 2, 1, '#bad67b'); r(9, 11, 3, 1, '#bad67b');
            if (sp.big) for (let i = 0; i < 4; i++) poly([[i * 4, 11], [i * 4 + 1, 5], [i * 4 + 3, 12]], '#d0c397');
            break;
          }
          case 'lizard': case 'croc': {
            const long = sp.fam === 'croc', end = long ? 24 : 18;
            leg(2, 20, -step); leg(end - 7, 20, step);
            poly([[end - 3, 19], [end + 4, 18], [end + 10, 15 + step], [end + 7, 20 + step], [end, 23], [end - 4, 22]], col);
            poly([[-5, 18], [0, 15], [end - 5, 15], [end, 19], [end - 2, 23], [0, 24], [-5, 22]], col);
            poly([[-10, 16], [-8, 13], [-4, 13], [0, 16], [0, 22], [-7, 23], [-13, 21], [-13, 17]], col);
            poly([[-12, 20], [-4, 20], [1, 22], [end - 4, 22], [end - 2, 23], [0, 24], [-8, 23]], mix(col, cream, 0.45));
            leg(0, 22, step, col); leg(end - 6, 22, -step, col); eye(-8, 15);
            r(-13, 20, 5, 1, ink); dot(-12, 17, dk);
            for (let i = 0; i < (long ? 6 : 4); i++) { poly([[i * 4, 16], [i * 4 + 1, 12], [i * 4 + 3, 16]], dk); dot(i * 4 + 1, 13, hi); }
            if (long) { r(-11, 21, 1, 2, cream); r(-7, 21, 1, 2, cream); }
            else { r(3, 19, 2, 1, hi); r(9, 20, 2, 1, hi); }
            break;
          }
          case 'horse': {
            leg(4, 18, -step); leg(14, 18, step);
            poly([[18, 11], [21, 13], [23, 22 + step], [21, 25 + step], [19, 20]], dk);
            poly([[-1, 11], [5, 9], [15, 10], [20, 13], [18, 19], [5, 20], [0, 18]], col);
            leg(1, 18, step, col); leg(17, 18, -step, col);
            poly([[-5, 7], [-4, 1], [-2, 1], [0, 9], [3, 14], [0, 18], [-4, 14]], col);
            poly([[-10, 4], [-10, 0], [-8, 2], [-6, -1], [-4, 3], [-4, 8], [-10, 9], [-13, 7], [-13, 5]], col);
            poly([[-3, 2], [-1, 4], [1, 12], [-2, 14], [-3, 9]], dk); eye(-9, 4); r(-13, 7, 3, 1, dk);
            r(4, 11, 9, 1, hi); r(1 + step, 27, 4, 1, ink); r(17 - step, 27, 4, 1, ink);
            if (sp.antlers) {
              poly([[-9, 2], [-10, -3], [-14, -5], [-15, -7], [-13, -6], [-12, -7], [-11, -4], [-8, -3], [-7, 2]], '#baaa79');
              poly([[-5, 2], [-4, -4], [-1, -5], [0, -7], [1, -7], [1, -4], [-2, -3], [-3, 2]], '#baaa79');
              r(5, 12, 5, 2, '#819d58'); dot(7, 11, '#c3d288');
            }
            break;
          }
          case 'bird': {
            poly([[10, 16], [20, 12], [18, 16], [21, 17], [12, 21]], dk);
            poly([[-2, 13], [3, 11], [11, 13], [14, 18], [10, 22], [1, 22], [-3, 18]], col);
            poly([[-5, 8], [-2, 6], [1, 8], [2, 13], [-2, 16], [-7, 13]], col); eye(-5, 10, '#b8edff');
            poly([[-7, 12], [-11, 13], [-7, 15]], '#efba55');
            poly([[1, 15], [5, 7 - wing], [9, 5 - wing], [11, 10 - wing], [8, 16], [4, 19]], hi);
            r(6, 10 - wing, 1, 5, col); r(9, 9 - wing, 1, 3, col);
            r(2 + step, 22, 1, 5, '#dba64c'); r(8 - step, 22, 1, 5, '#dba64c'); r(1 + step, 27, 3, 1, '#dba64c'); r(7 - step, 27, 3, 1, '#dba64c');
            break;
          }
          case 'spider': {
            for (let i = 0; i < 4; i++) {
              const xx = i * 4, move = (i % 2 ? step : -step);
              poly([[xx, 17], [xx - 4, 11 + move], [xx - 6, 10 + move], [xx - 5, 14 + move], [xx - 1, 19]], dk);
              poly([[xx, 21], [xx + 1, 24], [xx - 1 + move, 28], [xx - 3 + move, 28], [xx - 1, 24], [xx - 2, 20]], col);
            }
            poly([[2, 13], [9, 12], [16, 15], [18, 20], [14, 24], [5, 24], [0, 20]], col);
            poly([[-6, 15], [-2, 13], [3, 16], [3, 22], [-3, 24], [-7, 20]], col);
            r(5, 15, 6, 1, hi); r(7, 17, 2, 3, dk); r(11, 19, 2, 2, dk);
            eye(-5, 17, '#ff687d'); eye(-1, 17, '#ff687d'); r(-5, 22, 1, 2, cream); r(-1, 22, 1, 2, cream);
            break;
          }
          case 'sprite': {
            const lift = Math.round(Math.sin(a) * 2);
            poly([[-3, 13 + lift], [-9, 8 + lift - wing], [-11, 9 + lift - wing], [-9, 15 + lift], [-4, 18 + lift]], '#c4e5d5');
            poly([[7, 13 + lift], [14, 8 + lift + wing], [16, 10 + lift + wing], [13, 16 + lift], [8, 18 + lift]], '#c4e5d5');
            poly([[-2, 12 + lift], [0, 9 + lift], [5, 9 + lift], [9, 13 + lift], [8, 19 + lift], [4, 22 + lift], [0, 21 + lift], [-3, 17 + lift]], col);
            r(0, 13 + lift, 2, 2, ink); r(5, 13 + lift, 2, 2, ink); r(2, 17 + lift, 3, 1, '#bd803c');
            dot(1, 11 + lift, cream); r(-7, 21 - lift, 1, 3, hi); r(-8, 22 - lift, 3, 1, hi); dot(12, 5 + lift, cream);
            break;
          }
        }
      });
      if (sp.big) p *= 1.25;
      draw(c, cv, x, y, p, right, o.alpha);
    },
    backdrop(c, w, h, bio, t) {
      c.save(); const px = Math.max(2, Math.floor(h / 100)), gy = h * 0.8;
      const r = (x, y, ww, hh, col) => { c.fillStyle = col; c.fillRect(Math.round(x / px) * px, Math.round(y / px) * px, Math.ceil(ww / px) * px, Math.ceil(hh / px) * px); };
      for (let i = 0; i < 20; i++) r(0, h * i / 20, w, h / 20 + px, mix(bio.sky[0], bio.sky[1], i / 19));
      const drift = reduceMotion ? 0 : t * 2;
      for (let i = 0; i < 4; i++) { const x = ((i * w / 3 + drift) % (w + 120)) - 80, y = h * (0.12 + i % 2 * 0.09);
        r(x, y, 52, 9, '#ecf2df'); r(x + 12, y - 7, 23, 7, '#f7f7e8'); r(x + 4, y + 9, 44, 3, mix(bio.sky[1], '#ffffff', 0.35)); }
      for (let layer = 0; layer < 2; layer++) for (let x = 0; x < w; x += px * 4) {
        const y = h * (0.48 + layer * 0.13) + Math.sin(x / w * 9 + layer * 2) * h * 0.07;
        r(x, y, px * 4, h - y, mix(bio.hill, layer ? bio.ground : bio.sky[1], layer ? 0.14 : 0.28)); }
      for (let i = 0; i < 7; i++) {
        const x = w * (i + 0.3) / 7, y = gy - h * (0.21 + i % 3 * 0.025), sway = reduceMotion ? 0 : Math.sin(t * 1.8 + i) * px;
        r(x - px * 2, y, px * 5, gy - y, '#3d4c32'); r(x, y + px * 6, px * 2, gy - y - px * 6, '#66734b');
        const crown = (xx, yy, ww, hh, color) => { r(xx - px, yy - px, ww + px * 2, hh + px * 2, '#304732'); r(xx, yy, ww, hh, color); r(xx + px * 2, yy, ww - px * 4, px * 2, mix(color, '#c0d990', 0.3)); };
        crown(x - h * 0.06 + sway, y - h * 0.04, h * 0.13, h * 0.07, mix(bio.hill, '#263f35', 0.25));
        crown(x - h * 0.045 + sway, y - h * 0.09, h * 0.095, h * 0.07, bio.hill);
      }
      r(0, gy, w, h - gy, bio.ground); r(0, gy, w, px * 2, mix(bio.ground, '#d3e7a1', 0.28));
      for (let i = 0; i < Math.ceil(w / 24); i++) {
        const x = i * 24 + i % 3 * 4, y = gy + px * (4 + i % 4 * 3);
        r(x, y, px * 3, px, mix(bio.ground, '#243b30', 0.25)); r(x + px, y - px * 2, px, px * 2, mix(bio.ground, '#c5da8e', 0.24));
        if (i % 5 === 2) { r(x + 8, y + 8, px * 4, px * 2, '#68796b'); r(x + 8, y + 8, px * 3, px, '#a0ac89'); }
        if (i % 7 === 1) { r(x, y - px, px, px, '#e5cf9c'); r(x + px * 3, y + px, px, px, '#d5e7ae'); }
      }
      c.restore(); return gy;
    },
    tamer(c, x, y, p, col, t) {
      const f = phase(t), step = Math.round(Math.sin(f * Math.PI / 8));
      const cv = sprite('t:' + col + ':' + f, (r, poly) => {
        poly([[2, 19], [7, 19], [7 + step, 27], [2 + step, 27]], '#34455d');
        poly([[9, 19], [13, 19], [13 - step, 27], [9 - step, 27]], '#34455d');
        r(1 + step, 26, 6, 2, '#332e31'); r(9 - step, 26, 6, 2, '#332e31');
        poly([[1, 10], [5, 8], [10, 8], [14, 11], [14, 20], [1, 20]], col);
        poly([[-1, 11], [2, 11], [2 - step, 20], [-1 - step, 20]], col);
        poly([[13, 11], [16, 11], [16 + step, 20], [13 + step, 20]], col);
        r(-1 - step, 19, 3, 3, '#edbc92'); r(13 + step, 19, 3, 3, '#edbc92');
        r(2, 18, 11, 2, '#665137'); r(6, 18, 2, 2, '#e4c571'); r(4, 11, 2, 5, mix(col, '#ffffff', 0.35));
        poly([[3, 1], [11, 1], [13, 4], [12, 8], [9, 10], [5, 10], [2, 7], [2, 3]], '#edbc92');
        r(3, 2, 2, 5, '#694733'); r(10, 3, 2, 3, '#694733'); r(5, 5, 1, 2, ink); r(9, 5, 1, 2, ink); r(7, 8, 2, 1, '#b67e68');
        poly([[1, 0], [3, -3], [11, -3], [13, 0], [17, 1], [16, 3], [-2, 3], [-3, 1]], '#8a613e');
        r(2, -2, 9, 1, '#bd9360'); r(1, 0, 12, 1, '#503c32');
        r(11, 10, 2, 7, '#c9ad75'); r(12, 14, 3, 3, '#866b4b');
      });
      draw(c, cv, x, y, p, false);
    }
  };
})();
/* The walkable world (T7b): two more drawing calls per era.
   tile(ctx, ch, x, y, size, pal, t, gx, gy): one map tile (see TILES in 11-maps.js) at screen x,y; gx,gy = its map spot.
   walker(ctx, x, y, size, look, dir, step): a person seen from above, standing on the tile at x,y.
   item(ctx, x, y, size, t): something lying on the tile at x,y, waiting to be picked up.
   pal comes from the area's colors (worldPal in 06-scene.js). The 16-bit era adds outlines and extra detail. */
function tint(a, b, n) {
  const aa = parseInt(a.slice(1, 7), 16), bb = parseInt(b.slice(1, 7), 16);
  return '#' + [16, 8, 0].map(s => Math.round(((aa >> s) & 255) * (1 - n) + ((bb >> s) & 255) * n).toString(16).padStart(2, '0')).join('');
}
function paintTile(c, ch, X, Y, s, P, t, gx, gy, fine) {
  const u = s / 8, R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(X + x * u), Math.floor(Y + y * u), Math.ceil(w * u), Math.ceil(h * u)); };
  const hsh = ((gx * 73856093) ^ (gy * 19349663)) >>> 0, v = n => (hsh >> n) & 7, mo = !reduceMotion;
  const grass = () => { R(0, 0, 8, 8, P.grass); R(v(2), v(5), 1, 1, P.grassDk); if (fine) { R(v(8), v(11), 1, 1, P.grassLt); R(v(14), v(17), 1, 1, P.grassDk); } };
  switch (ch) {
    case '.': case 'N': case 'S': case 'E': case 'W': R(0, 0, 8, 8, P.path); R(v(1), v(4), 1, 1, P.pathDk); if (fine) R(v(7), v(10), 1, 1, P.pathLt); break;
    case '_': R(0, 0, 8, 8, P.sand); R(v(1), v(4), 1, 1, P.sandDk); if (fine) R(v(9), v(12), 1, 1, '#fff6d8'); break;
    case '~': { R(0, 0, 8, 8, P.water); const k = mo ? Math.floor(t * 1.5 + v(3)) % 8 : v(3); R(k, 1 + v(6) % 5, 2, 1, P.waterLt); if (fine) R((k + 4) % 8, 6, 1, 1, P.waterLt); break; }
    case 'o': grass(); R(0.5, 0.5, 7, 7, '#d98a52'); R(1, 1, 6, 6, '#f0b070'); { const k = mo ? (t * 2 + v(3)) % 4 : 1; R(2 + v(5) % 3, 4 - k, 1, 1, 'rgba(255,255,255,.7)'); } break;
    case '"': grass(); R(0, 4, 8, 4, P.tallDk);
      for (let i = 0; i < 4; i++) { const sw = mo ? Math.round(Math.sin(t * 2 + gx * 0.9 + i)) * 0.5 : 0, x = 0.5 + i * 2;
        R(x + sw, 1 + (i % 2), 1, 6 - (i % 2), P.tall); if (fine) R(x + sw, 1 + (i % 2), 1, 1, P.tallLt); } break;
    case 'f': grass(); R(1 + v(3) % 3, 2 + v(6) % 3, 1, 1, ['#f2d24a', '#f07a9a', '#ffffff'][v(9) % 3]); R(5 + v(4) % 2, 5, 1, 1, ['#ffffff', '#f2d24a', '#b48ae8'][v(12) % 3]); break;
    case 'T': grass(); R(3, 6, 2, 2, '#6b4a2a'); R(0, 1, 8, 5, P.tree); R(1, 0, 6, 7, P.tree); R(2, 1, 3, 1, P.treeLt);
      if (fine) { R(1, 6, 6, 1, P.treeDk); R(0, 5, 1, 1, P.treeDk); R(7, 5, 1, 1, P.treeDk); R(5, 2, 1, 1, P.treeLt); } break;
    case 'R': R(0, 0, 8, 8, P.rockBase || P.grass); R(1, 2, 6, 5, P.rock); R(2, 1, 4, 1, P.rock); R(2, 2, 3, 1, P.rockLt); R(1, 6, 6, 1, P.rockDk);
      if (fine) { R(6, 3, 1, 3, P.rockDk); R(3, 4, 1, 1, P.rockDk); } break;
    case 'r': R(0, 0, 8, 8, P.roof); R(0, 2, 8, 1, P.roofDk); R(0, 5, 8, 1, P.roofDk); if (fine) R(0, 0, 8, 1, tint(P.roof, '#ffffff', 0.25)); break;
    case '#': R(0, 0, 8, 8, '#eadfc4'); R(0, 7, 8, 1, '#b8a888'); if (v(1) % 2) { R(2, 2, 4, 3, '#6aa0c8'); if (fine) R(2, 2, 4, 1, '#a8d0ea'); } break;
    case 'D': R(0, 0, 8, 8, '#eadfc4'); R(2, 1, 4, 7, '#7a4a2a'); R(5, 4, 1, 1, '#f2d24a'); if (fine) R(2, 1, 4, 1, '#5a3418'); break;
    case '=': grass(); R(0, 3, 8, 1, '#a0703a'); R(0, 5, 8, 1, '#a0703a'); R(0, 2, 1, 5, '#7a5028'); R(7, 2, 1, 5, '#7a5028'); break;
    case 'P': grass(); R(3.5, 4, 1, 4, '#6b4a2a'); R(1, 1, 6, 3.5, '#a0703a'); R(1.5, 1.8, 5, 0.5, '#6b4a2a'); R(1.5, 3, 4, 0.5, '#6b4a2a');
      if (fine) { R(1, 1, 6, 0.5, '#c8985a'); R(1, 4, 6, 0.5, '#5a3a1e'); } break;
    default: grass();
  }
}
function paintWalker(c, X, Y, s, L, dir, step, fine) {
  const u = s / 8, R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(X + x * u), Math.floor(Y + y * u), Math.ceil(w * u), Math.ceil(h * u)); };
  const side = dir === 'left' ? -1 : dir === 'right' ? 1 : 0, ink = '#1d2a30';
  R(1.5, 7, 5, 1, 'rgba(0,0,0,.25)');
  if (fine) { R(1.6, 2.6, 4.8, 3.8, ink); R(1.6, -1.4, 4.8, 4.6, ink); }
  R(2.5, 5.5, 1, step ? 1.5 : 2, '#2b2b3a'); R(4.5, 5.5, 1, step ? 2 : 1.5, '#2b2b3a');
  R(2, 3, 4, 3, L.shirt); R(1.4 + side * 0.4, 3.2, 0.6, 2, L.shirt); R(6 + side * 0.4, 3.2, 0.6, 2, L.shirt);
  R(2, -1, 4, 4, L.skin);
  if (dir === 'up') R(2, -1.3, 4, 3.6, L.hairCol);
  else { R(2, -1.3, 4, 1.3, L.hairCol); if (side) R(side < 0 ? 5 : 2, -0.5, 1, 2, L.hairCol);
    const eye = '#111'; if (!side) { R(2.8, 0.8, 0.7, 0.7, eye); R(4.5, 0.8, 0.7, 0.7, eye); } else R(side < 0 ? 2.5 : 4.8, 0.8, 0.7, 0.7, eye); }
  if (L.hair === 'long') { R(1.6, -0.6, 0.6, 3.2, L.hairCol); R(5.8, -0.6, 0.6, 3.2, L.hairCol); }
  if (L.hair === 'bun') R(3.2, -2.2, 1.6, 1.2, L.hairCol);
  if (L.hair === 'spiky') { R(2.2, -2, 0.8, 0.8, L.hairCol); R(3.6, -2.2, 0.8, 0.9, L.hairCol); R(5, -2, 0.8, 0.8, L.hairCol); }
  if (L.hair === 'hat') { const hc = L.hatCol || '#6b4423'; R(1, -1.4, 6, 0.8, hc); R(2.2, -2.8, 3.6, 1.6, hc); if (fine) R(2.2, -2.8, 3.6, 0.5, tint(hc, '#ffffff', 0.3)); }
}
/* an item on the ground: a little pouch that glints now and then */
function paintItem(c, X, Y, s, t, fine) {
  const u = s / 8, R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(X + x * u), Math.floor(Y + y * u), Math.ceil(w * u), Math.ceil(h * u)); };
  R(2, 6.5, 4, 1, 'rgba(0,0,0,.2)'); if (fine) R(1.6, 3.1, 4.8, 3.8, '#3a2414');
  R(2, 3.5, 4, 3, '#c8783a'); R(3, 2.5, 2, 1, '#a85a2a'); R(2.5, 3.5, 3, 0.6, '#f2c14e');
  const g = reduceMotion ? 0 : (t * 0.8 + X * 0.01) % 2; if (g < 0.25) { R(5.5, 1.5, 1, 1, '#ffffff'); R(5, 2, 2, 0.4, '#ffffff'); }
}
ART.pixel.item = (c, x, y, s, t) => paintItem(c, x, y, s, t, false);
ART.bit16.item = (c, x, y, s, t) => paintItem(c, x, y, s, t, true);
ART.pixel.tile = (c, ch, x, y, s, P, t, gx, gy) => paintTile(c, ch, x, y, s, P, t, gx, gy, false);
ART.pixel.walker = (c, x, y, s, L, dir, step) => paintWalker(c, x, y, s, L, dir, step, false);
ART.bit16.tile = (c, ch, x, y, s, P, t, gx, gy) => paintTile(c, ch, x, y, s, P, t, gx, gy, true);
ART.bit16.walker = (c, x, y, s, L, dir, step) => paintWalker(c, x, y, s, L, dir, step, true);
function art() { return ART[(S && S.era) || 'pixel'] || ART.pixel; }
