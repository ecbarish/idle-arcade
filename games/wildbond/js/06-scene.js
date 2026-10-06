'use strict';
/* The scene: exploring with your team, or the two sides of a battle. Drawn through the current art era. */
const cv = $('#scene'), cx = cv.getContext('2d'); let PW = 0, PH = 0;
function resize() { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); PW = r.width; PH = r.height; cv.width = Math.round(PW * d); cv.height = Math.round(PH * d); cx.setTransform(d, 0, 0, d, 0, 0); cx.imageSmoothingEnabled = false; }
if (window.ResizeObserver) new ResizeObserver(resize).observe(cv); else addEventListener('resize', resize);
const AX = [0.38, 0.25, 0.12], FX = [0.62, 0.75, 0.88];

function frame(ms) {
  requestAnimationFrame(frame); if (!PW || !S.started || document.hidden) return;
  const t = ms / 1000, A = art(), gy = A.backdrop(cx, PW, PH, BIOMES[S.biome], t), p = Math.max(2, Math.floor(PH / 46));
  if (B) {
    const draw = (u, x, right) => { const lunge = u.anim > 0 ? (right ? 1 : -1) * p * 3 : 0; A.creature(cx, x + lunge, gy, p, sp(u.c), right, u.c.hp > 0 ? t : 0, { alpha: u.c.hp > 0 ? 1 : 0.25 });
      if (u.c.hp > 0) { const w = 16 * p, bx = x - w / 2 + p * 2, by = gy - 20 * p * (sp(u.c).big ? 1.25 : 1); cx.fillStyle = 'rgba(0,0,0,.5)'; cx.fillRect(bx, by, w, p * 1.4);
        cx.fillStyle = u.c.hp / u.st.hp > 0.5 ? '#3fd46a' : u.c.hp / u.st.hp > 0.2 ? '#f2c14e' : '#ff5a4a'; cx.fillRect(bx, by, w * u.c.hp / u.st.hp, p * 1.4); } };
    B.allies.forEach((u, i) => draw(u, PW * AX[i], true));
    B.foes.forEach((u, i) => draw(u, PW * FX[i], false));
    if (B.tele) { cx.font = `800 ${p * 5}px Fredoka, sans-serif`; cx.textAlign = 'center'; cx.fillStyle = '#ff5a4a'; cx.fillText('GUARD!', PW * 0.5, PH * 0.18); }
    if (B.capture) { const i = B.foes.indexOf(B.capture.t), x = PW * FX[Math.max(0, i)]; cx.strokeStyle = '#7cf08a'; cx.lineWidth = 3; cx.beginPath(); cx.arc(x + 2 * p, gy - 8 * p, (8 + Math.sin(t * 6) * 1.5) * p, 0, 7); cx.stroke(); }
    cx.textAlign = 'center';
    for (const f of B.fx) { const side = B.allies.includes(f.u) ? AX : FX, list = B.allies.includes(f.u) ? B.allies : B.foes, x = PW * side[list.indexOf(f.u)];
      cx.globalAlpha = 1 - f.age; cx.font = `800 ${p * 5}px Fredoka, sans-serif`; cx.lineWidth = 3; cx.strokeStyle = '#000'; cx.strokeText(f.txt, x + 2 * p, gy - 24 * p - f.age * p * 8); cx.fillStyle = f.col; cx.fillText(f.txt, x + 2 * p, gy - 24 * p - f.age * p * 8); }
    cx.globalAlpha = 1; cx.textAlign = 'left';
  } else {
    const bob = reduceMotion ? 0 : Math.sin(t * 6) * p * 0.5;
    A.tamer(cx, PW * 0.14, gy + bob, p, '#2f9e6b', t);
    S.team.forEach((c, i) => A.creature(cx, PW * (0.32 + i * 0.13), gy, p, sp(c), true, c.hp > 0 ? t + i : 0, { alpha: c.hp > 0 ? 1 : 0.35 }));
  }
}
