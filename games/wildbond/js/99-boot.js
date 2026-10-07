'use strict';
/* Clicks, keys, the game loop and startup. */
function findC(uid) { uid = Number(uid); return S.team.find(c => c.uid === uid) || S.ranch.find(c => c.uid === uid); }
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act, arg = el.dataset.arg;
  sfx('select');
  switch (a) {
    case 'sound': cycleSound(); break;
    case 'skiptalk': skipTalk(); break;
    case 'starter': chooseStarter(arg, ($('#tname') || {}).value, S.journey); closeModal(); break;
    case 'set': { const [k, v] = arg.split(':'); if (B) break;
      if (k === 'pace' && JOURNEY[v]) { S.journey = v; el.parentNode.querySelectorAll('.era').forEach(b => { const on = b === el; b.classList.toggle('cur', on); b.setAttribute('aria-pressed', on); }); return; }
      if (k === 'journey' && JOURNEY[v] && S.journey !== v) { S.journey = v; toast(`Journey length: ${JOURNEY[v].name}.`); slog(`Chose a ${JOURNEY[v].name} journey at the Larkhaven inn.`); }
      if (k === 'cap' && ['soft', 'hard', 'off'].includes(v)) S.capMode = v;
      if (k === 'share') S.xpShare = v === 'on';
      break; }
    case 'explore': explore(); break;
    case 'warden': challengeWarden(); break;
    case 'elder': seekElder(); break;
    case 'rest': restInTown(); break;
    case 'lures': buyLures(); break;
    case 'auto': S.auto = !S.auto; W.autoT = 2; toast(S.auto ? 'Auto-explore on: your team explores and fights on its own.' : 'Auto-explore off.'); break;
    case 'cmd': command(arg); break;
    case 'calm': calmNow(); break;
    case 'continue': finishBattle(); break;
    case 'tab': S.tab = arg; renderTabs(true); break;
    case 'toranch': { const c = findC(arg); if (c && S.team.length > 1 && !B) { S.team = S.team.filter(x => x !== c); S.ranch.push(c); } break; }
    case 'toteam': { const c = findC(arg); if (c && S.team.length < 3 && !B) { S.ranch = S.ranch.filter(x => x !== c); S.team.push(c); } break; }
    case 'release': { if (!el.classList.contains('armed')) { el.classList.add('armed'); el.textContent = 'Click again to release'; setTimeout(() => { if (el.isConnected) { el.classList.remove('armed'); el.textContent = 'Release'; } }, 4000); return; }
      const c = findC(arg); if (c) { S.ranch = S.ranch.filter(x => x !== c); slog(`Released ${c.name} back into ${BIOMES[S.biome].name}.`); toast(`${c.name} returns to the wild.`); } break; }
    case 'rename': { const c = findC(arg); if (!c) break; const card = el.closest('.cbody'); if (card.querySelector('.rn')) break;
      card.insertAdjacentHTML('beforeend', `<div class="rn"><input maxlength="14" value="${c.name}" aria-label="New name"><button class="btn sm" data-act="dorename" data-arg="${c.uid}">Save</button></div>`); return; }
    case 'dorename': { const c = findC(arg), v = (el.previousElementSibling.value || '').replace(/[<>&"]/g, '').trim().slice(0, 14); if (c && v) c.name = v; tabKey = ''; break; }
    case 'buyfood': buyFood(arg, 10); break;
    case 'breed': { const all = everyone(); if (startBreed(all.find(c => c.uid === BARN.a), all.find(c => c.uid === BARN.b))) { BARN.a = BARN.b = null; } break; }
    case 'biome': travelTo(arg); break;
    case 'era': if (S.eras.includes(arg) && ART[arg]) { S.era = arg; recolor(); } break;
  }
  if (S.started) { renderAll(); save(); }
});
document.addEventListener('keydown', e => {
  if (!S.started || e.target.matches('input,textarea')) return; const k = e.key.toLowerCase();
  if (B && !B.over) { if (k === 'f') command('focus'); else if (k === 'g') command('guard'); else if (k === 'r') command('rally'); else if (k === 'l') command('lure'); else if (k === ' ' && B.capture) { calmNow(); e.preventDefault(); } }
  else if (B && B.over && (k === 'enter' || k === ' ')) { finishBattle(); e.preventDefault(); }
  else if (!B && k === 'e') explore();
  renderAll();
});

/* test hook, local dev server only */
if (location.hostname === 'localhost') window.__wb = { get S() { return S; }, get B() { return B; }, newDay, startBreed, breedInfo, catchUpDays, travelTo, explore, command, calmNow, worldTick, finishBattle, challengeWarden, chooseStarter, newCreature, startBattle, levelCap, wardenReady, placeAt, walkTo, tryStep, get WK() { return WK; } };

let started = false;
function start() {
  if (started) return; started = true; load();
  if (!S.started) talk(SCENES.intro, () => openModal(startHTML())); else if (!S.team.length) openModal(startHTML());
  renderSoundBtn();
  resize(); renderAll(); renderTabs(true);
  // time away: auto-explore keeps going at a gentle pace, manual play just rests
  const away = (Date.now() - (S.last || Date.now())) / 1000;
  if (S.started) { const days = catchUpDays(Math.max(0, away)); if (days) setTimeout(() => toast(` ranch day passed while you were away. Check the Ranch tab.`), 1500); }
  if (S.started && away > 60) { healAll(); if (S.auto) { const n = Math.min(200, Math.floor(away / 30)); let xp = 0, coins = 0; for (let i = 0; i < n; i++) { coins += Math.round(rint(2, 6) * 3 * journey().coins); xp += Math.round(teamAvg() * 9 * xpMult()); }
      S.coins += coins; for (const c of S.team) grow(c, Math.round(xp / Math.max(1, S.team.length))); toast(`While you were away your team explored ${n} times: +${fmtI(coins)} coins.`); } else toast('Your team rested while you were away.'); }
  let last = performance.now();
  setInterval(() => { const n = performance.now(); let dt = Math.min(5, (n - last) / 1000); last = n; if (!S.started) return;
    while (dt > 0) { const h = Math.min(0.1, dt); dt -= h; worldTick(h); } renderAll(); }, 100);
  setInterval(save, 10000); addEventListener('beforeunload', save); document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  requestAnimationFrame(frame);
}
start();
