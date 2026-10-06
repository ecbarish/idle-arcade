'use strict';
/* The scene: exploring with your team, or the two sides of a battle. Drawn through the current art era.
   Battle motion: teams slide in, attackers lunge, hit creatures flinch and blink, element-colored sparks,
   screen shake on critical hits, fainted creatures sink, winners hop. All of it is skipped with reduced motion. */
const cv = $('#scene'), cx = cv.getContext('2d'); let PW = 0, PH = 0;
function resize() { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); PW = r.width; PH = r.height; cv.width = Math.round(PW * d); cv.height = Math.round(PH * d); cx.setTransform(d, 0, 0, d, 0, 0); cx.imageSmoothingEnabled = false; }
if (window.ResizeObserver) new ResizeObserver(resize).observe(cv); else addEventListener('resize', resize);
const AX = [0.38, 0.25, 0.12], FX = [0.62, 0.75, 0.88];

function frame(ms) {
  requestAnimationFrame(frame); if (!PW || document.hidden) return;
  const t = ms / 1000, A = art(), p = Math.max(2, Math.floor(PH / 46)), mo = !reduceMotion;
  cx.save();
  if (B && B.shake > 0 && mo) cx.translate((Math.random() - 0.5) * p * 3, (Math.random() - 0.5) * p * 2);
  const gy = A.backdrop(cx, PW, PH, BIOMES[S.biome], t);
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
