/* The GM panel (E2, 2026-10-10): a game-master toolkit inside every game, for Evan to change things without code.
   Turned on from the Studio (studio.html) or by adding ?gm to a game's address; then press Ctrl+Shift+G (or the
   small "GM" tab at the bottom right) to open it. Each game registers its own actions; this file draws the panel,
   backs up the save before the first change of each visit (kept in the Studio's backup list), and logs every action.
   GM.create({ game, saveKey, save: () => {...}, refresh: () => {...}, actions: [{ group, label, inputs: [{ id, label,
     type: 'number' | 'select' | 'text', options: () => [[value, text]], value }], run(values) -> message }] })     */
(function () {
  'use strict';
  const ON_KEY = 'arcade-gm', LOG_KEY = 'arcade-gm-log', BK_PREFIX = 'arcade-backup:';
  const on = () => /[?&]gm\b/.test(location.search) || (() => { try { return localStorage.getItem(ON_KEY) === '1'; } catch (e) { return false; } })();
  /* backups: up to 8 per save, newest first; the Studio lists and restores them */
  function backup(saveKey, why) {
    try { const raw = localStorage.getItem(saveKey); if (!raw) return false;
      const k = BK_PREFIX + saveKey + ':' + Date.now(); localStorage.setItem(k, JSON.stringify({ at: Date.now(), why: why || 'backup', data: raw }));
      const all = Object.keys(localStorage).filter(x => x.startsWith(BK_PREFIX + saveKey + ':') && !x.includes(':auto-')).sort().reverse(); // automatic backups (engine.js) rotate on their own
      for (const old of all.slice(8)) localStorage.removeItem(old); return true; } catch (e) { return false; }
  }
  function log(game, text) { try { const l = JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); l.unshift({ at: Date.now(), game, text }); localStorage.setItem(LOG_KEY, JSON.stringify(l.slice(0, 200))); } catch (e) {} }
  function create(o) {
    if (!on()) return { open() {}, enabled: false };
    let backedUp = false;
    const css = `.gm-tab{position:fixed;right:10px;bottom:10px;z-index:9998;background:#2a1a3a;color:#f2c14e;border:1px solid #f2c14e;border-radius:6px;padding:4px 10px;font:700 12px sans-serif;cursor:pointer}
      .gm-panel{position:fixed;right:10px;bottom:44px;z-index:9999;width:340px;max-height:75vh;overflow:auto;background:#17121f;color:#eee;border:1px solid #f2c14e;border-radius:8px;padding:10px;font:13px sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.6)}
      .gm-panel[hidden]{display:none}.gm-panel h3{margin:0 0 6px;color:#f2c14e;font-size:14px}.gm-panel h4{margin:10px 0 4px;color:#c8b0ff;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
      .gm-row{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:4px 0}.gm-row label{font-size:11px;color:#aaa}.gm-row input,.gm-row select{background:#241c30;color:#eee;border:1px solid #555;border-radius:4px;padding:2px 4px;max-width:150px}
      .gm-row button{background:#f2c14e;color:#1a1020;border:none;border-radius:4px;padding:3px 8px;font-weight:700;cursor:pointer}.gm-msg{margin-top:8px;padding:6px;background:#241c30;border-radius:4px;font-size:12px;min-height:16px}`;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const tab = document.createElement('button'); tab.className = 'gm-tab'; tab.textContent = 'GM'; tab.title = 'Game master panel (Ctrl+Shift+G)';
    const panel = document.createElement('div'); panel.className = 'gm-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Game master panel');
    document.body.append(tab, panel);
    const msg = t => { const m = panel.querySelector('.gm-msg'); if (m) m.textContent = t; };
    function render() {
      let h = `<h3>GM: ${o.game}</h3><div style="font-size:11px;color:#aaa">Changes apply right away. Your save was backed up before the first change; restore it from the Studio.</div>`;
      let group = null;
      o.actions.forEach((a, i) => {
        if (a.group !== group) { group = a.group; h += `<h4>${group}</h4>`; }
        h += `<div class="gm-row" data-i="${i}">` + (a.inputs || []).map(inp => {
          if (inp.type === 'select') { const opts = (typeof inp.options === 'function' ? inp.options() : inp.options) || [];
            return `<label>${inp.label || ''}</label><select data-id="${inp.id}">${opts.map(([v, t]) => `<option value="${String(v).replace(/"/g, '&quot;')}">${t}</option>`).join('')}</select>`; }
          return `<label>${inp.label || ''}</label><input data-id="${inp.id}" type="${inp.type === 'number' ? 'number' : 'text'}" value="${inp.value === undefined ? '' : inp.value}" style="width:${inp.type === 'number' ? 70 : 120}px">`;
        }).join('') + `<button data-run="${i}">${a.label}</button></div>`;
      });
      panel.innerHTML = h + '<div class="gm-msg" aria-live="polite"></div>';
    }
    function toggle(force) { panel.hidden = force === undefined ? !panel.hidden : !force; if (!panel.hidden) render(); }
    tab.addEventListener('click', () => toggle());
    document.addEventListener('keydown', e => { if (e.ctrlKey && e.shiftKey && (e.key === 'G' || e.key === 'g')) { e.preventDefault(); toggle(); } });
    panel.addEventListener('keydown', e => e.stopPropagation()); // typing in the panel never moves your hero
    panel.addEventListener('click', e => {
      const b = e.target.closest('[data-run]'); if (!b) return; const a = o.actions[Number(b.dataset.run)], row = b.closest('.gm-row'), vals = {};
      row.querySelectorAll('[data-id]').forEach(el => { vals[el.dataset.id] = el.type === 'number' ? Number(el.value) : el.value; });
      try {
        if (!backedUp) { if (o.save) o.save(); backup(o.saveKey, 'before GM changes'); backedUp = true; }
        const out = a.run(vals) || 'Done.'; if (o.save) o.save(); if (o.refresh) o.refresh(); log(o.game, `${a.label}: ${JSON.stringify(vals)} -> ${out}`); msg(out);
      } catch (err) { msg('That did not work: ' + err.message); }
    });
    return { open: () => toggle(true), enabled: true };
  }
  window.GM = { create, backup, on, LOG_KEY, BK_PREFIX, ON_KEY };
})();
