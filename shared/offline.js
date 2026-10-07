/* L5: one installable arcade, with unchanged browser saves. Loaded only by the hub. */
(function () {
  'use strict';
  const status = document.querySelector('#offlineStatus'), button = document.querySelector('#installArcade');
  const say = text => { if (status) status.textContent = text; };
  let prompt = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); prompt = e; if (button) button.hidden = false; });
  addEventListener('appinstalled', () => { prompt = null; if (button) button.hidden = true; });
  if (button) button.addEventListener('click', async () => {
    if (!prompt) return; const current = prompt; prompt = null; button.hidden = true;
    try { await current.prompt(); await current.userChoice; } catch (_) { /* Browser menu installation remains available. */ }
  });
  if (!('serviceWorker' in navigator) || !isSecureContext) { say('Offline play needs HTTPS or localhost.'); return; }
  const base = new URL('../', document.currentScript.src);
  say('Preparing offline play…');
  navigator.serviceWorker.register(new URL('sw.js', base), { scope: base.href, updateViaCache: 'none' }).then(reg => {
    const show = () => { if (reg.active) say('Ready for offline play. Updates arrive on their own when you are online.'); };
    show();
    const watch = worker => { if (!worker) return; worker.addEventListener('statechange', () => {
      if (worker.state === 'redundant' && !reg.active) say('Offline setup did not finish. Reopen the arcade online to try again.'); else show();
    }); };
    watch(reg.installing); reg.addEventListener('updatefound', () => watch(reg.installing));
    navigator.serviceWorker.ready.then(show);
  }).catch(() => say('Offline setup is unavailable here. You can keep playing online.'));
})();
