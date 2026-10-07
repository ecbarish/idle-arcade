'use strict';
/* Dialogue scenes: a speaker portrait, a name and typewriter text over the scene.
   talk(lines, done) plays [who, text] lines (see CAST in 00-data.js). The world pauses while a scene plays;
   with Auto-explore on, lines advance by themselves so idle play never stalls. */
let TALK = null;
const talkEl = (() => { const d = document.createElement('div'); d.className = 'talk'; d.id = 'talk'; d.hidden = true;
  d.innerHTML = '<canvas class="face" width="64" height="64"></canvas><div class="tbody"><b class="who"></b><span class="role"></span><p class="say"></p></div><span class="more" aria-hidden="true">▼</span>';
  $('.scene').appendChild(d); return d; })();

function fillText(t) {
  return t.replace(/\{name\}/g, S.name).replace(/\{starter\}/g, S.starter ? SPECIES[S.starter].name : 'your partner')
    .replace(/\{rival\}/g, S.rivalStarter ? SPECIES[S.rivalStarter].name : 'a partner');
}
function talk(lines, done) {
  if (!lines || !lines.length) { if (done) done(); return; }
  TALK = { lines: lines.map(([who, t]) => [who, fillText(t)]), i: 0, shown: 0, wait: 0, done };
  talkEl.hidden = false; showLine(); panelKey = '';
}
function showLine() {
  const [who] = TALK.lines[TALK.i], c = CAST[who];
  talkEl.classList.toggle('narr', !who); talkEl.querySelector('.who').textContent = c ? c.name : who[0] === '@' ? SPECIES[who.slice(1)].name : '';
  talkEl.querySelector('.role').textContent = c ? c.title : '';
  TALK.shown = 0; TALK.wait = 0; drawFace(who, false);
}
function advanceTalk() {
  if (!TALK) return; const len = TALK.lines[TALK.i][1].length;
  if (TALK.shown < len) { TALK.shown = len; return; }
  TALK.i++;
  if (TALK.i >= TALK.lines.length) { const done = TALK.done; TALK = null; talkEl.hidden = true; panelKey = ''; if (done) done(); if (S.started) { renderAll(); save(); } return; }
  showLine();
}
function skipTalk() { if (!TALK) return; TALK.i = TALK.lines.length - 1; TALK.shown = 1e9; advanceTalk(); }

/* typewriter, about 45 characters a second */
setInterval(() => {
  if (!TALK) return; const [who, t] = TALK.lines[TALK.i];
  if (TALK.shown < t.length) { const before = TALK.shown; TALK.shown = Math.min(t.length, TALK.shown + 2);
    if (who && Math.floor(TALK.shown / 6) > Math.floor(before / 6)) sfx('blip', who);
    if (CAST[who]) drawFace(who, TALK.shown < t.length && TALK.shown % 4 < 2); }
  else if (CAST[who]) drawFace(who, false);
  talkEl.querySelector('.say').textContent = t.slice(0, TALK.shown);
  talkEl.classList.toggle('ready', TALK.shown >= t.length);
  if (TALK.shown >= t.length && S.auto) { TALK.wait += 0.045; if (TALK.wait > 3.5) advanceTalk(); }
}, 45);
talkEl.addEventListener('click', e => { e.stopPropagation(); advanceTalk(); });
document.addEventListener('keydown', e => {
  if (!TALK || (e.target.matches && e.target.matches('input,textarea'))) return;
  if (e.key === ' ' || e.key === 'Enter') advanceTalk(); else if (e.key === 'Escape') skipTalk(); else return;
  e.preventDefault(); e.stopImmediatePropagation();
}, true);

/* Portraits: 32x32 busts drawn at 2x, or the creature itself for '@species' lines. */
function drawFace(who, open) {
  const cv = talkEl.querySelector('.face'), c = eraCtx(cv.getContext('2d')), P = CAST[who];
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 64, 64); c.imageSmoothingEnabled = false;
  cv.hidden = !who;
  if (!who) return;
  if (who[0] === '@') { const s = SPECIES[who.slice(1)]; c.fillStyle = ELEMENTS[s.el] ? ELEMENTS[s.el].col + '55' : '#ddd'; c.fillRect(0, 0, 64, 64);
    art().creature(c, 26, 56, s.big ? 2 : 2.4, s, true, 0, {}); return; }
  const q = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x * 2, y * 2, w * 2, h * 2); };
  const dk = shade(P.hairCol, -0.35), sk = P.skin, skd = shade(sk, -0.18);
  q(0, 0, 32, 32, P.bg); q(4, 4, 24, 24, shade(P.bg, 0.25));
  if (P.hair === 'long') { q(7, 9, 4, 18, P.hairCol); q(21, 9, 4, 18, P.hairCol); }
  q(5, 25, 22, 7, P.shirt); q(8, 24, 16, 2, P.shirt); q(13, 24, 6, 3, shade(P.shirt, -0.25)); q(14, 21, 4, 4, skd);
  q(10, 9, 12, 13, sk); q(11, 21, 10, 1, sk); q(9, 13, 1, 4, skd); q(22, 13, 1, 4, skd);
  q(12, 15, 2, 2, '#1d1d28'); q(18, 15, 2, 2, '#1d1d28'); q(12, 15, 1, 1, '#ffffff'); q(18, 15, 1, 1, '#ffffff');
  q(11, 13, 3, 1, dk); q(18, 13, 3, 1, dk); q(14, 18, 1, 1, skd);
  if (open) { q(14, 19, 4, 2, '#7a3b3b'); q(15, 20, 2, 1, '#d77'); } else q(14, 19, 4, 1, '#9a5148');
  q(11, 17, 2, 1, 'rgba(255,120,120,.35)'); q(19, 17, 2, 1, 'rgba(255,120,120,.35)');
  // hair on top
  q(9, 6, 14, 5, P.hairCol); q(9, 10, 2, 5, P.hairCol); q(21, 10, 2, 5, P.hairCol); q(11, 10, 5, 2, P.hairCol); q(10, 6, 12, 1, shade(P.hairCol, 0.2));
  if (P.hair === 'spiky') for (const x of [9, 12, 15, 18, 21]) { q(x, 4, 2, 2, P.hairCol); q(x + 1, 3, 1, 1, P.hairCol); }
  if (P.hair === 'bun') { q(13, 2, 6, 4, P.hairCol); q(14, 1, 4, 1, P.hairCol); q(14, 2, 2, 1, shade(P.hairCol, 0.25)); }
  if (P.hair === 'long') { q(8, 8, 2, 8, P.hairCol); q(22, 8, 2, 8, P.hairCol); }
  if (P.hair === 'hat') { const hc = P.hatCol || '#5a4a3a'; q(10, 2, 12, 6, hc); q(10, 6, 12, 1, shade(hc, 0.3)); q(5, 8, 22, 2, shade(hc, -0.2)); }
}
function shade(hex, n) { const v = parseInt(hex.slice(1, 7), 16), f = x => Math.round(n < 0 ? x * (1 + n) : x + (255 - x) * n);
  return '#' + [16, 8, 0].map(s => f((v >> s) & 255).toString(16).padStart(2, '0')).join(''); }
