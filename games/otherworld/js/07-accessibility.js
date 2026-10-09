'use strict';
/* Reading windows stay within the world; no story or save rules change. */
document.addEventListener('keydown', e => {
  if (e.target.closest('.arc-set-bg')) return;
  const status = document.getElementById('status'), choose = panel();
  if (!status.hidden && !status.contains(document.activeElement) && e.key === 'Tab') { e.preventDefault(); e.stopImmediatePropagation(); status.querySelector('button')?.focus(); return; }
  if (!status.hidden) {
    if (e.key === 'Escape') { e.preventDefault(); status.hidden = true; if (sceneState) D.el.focus(); else document.getElementById('statusBtn').focus(); }
    Settings.trapTab(e, status); e.stopImmediatePropagation();
  } else if (!choose.hidden) Settings.trapTab(e, choose);
}, true);
