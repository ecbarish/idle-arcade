'use strict';
/* Art eras. All drawing goes through ART[era]. A new era is a new object with the same three functions:
   creature(ctx, x, y, size, species, facingRight, t, opts), backdrop(ctx, w, h, biome, t), tamer(ctx, x, y, size, color, t).
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
        q(L - 4, 10, 4, 1, col); q(0, 12, 1, 2 - b, col); q(L - 6, 12, 1, 1 + b, col); if (sp.fam === 'croc') q(-6, 10, 2, 1, '#e8e4d4'); break; }
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
function art() { return ART[(S && S.era) || 'pixel'] || ART.pixel; }
