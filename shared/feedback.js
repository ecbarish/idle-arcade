/* The Feedback menu (F2, built by Jules, 2026-10-10): every game's header has a "Feedback" button with three choices,
   each opening the matching GitHub issue form (.github/ISSUE_TEMPLATE/) in a new tab, with the game and a short
   "context" (version and where the player is) filled in. Never sends the save or anything personal.
   Usage: <div class="feedback-container"><button ...>Feedback</button></div> in the page, then
   setupFeedback(gameName, version, () => 'where the player is'). Keyboard: arrows move, Escape closes.          */
(function () {
  const styles = `
    .feedback-container { position: relative; display: inline-block; }
    .feedback-menu { position: absolute; top: 100%; right: 0; z-index: 100; min-width: 160px; margin-top: 4px; padding: 4px 0;
      display: flex; flex-direction: column; background: var(--bg, #fff); color: var(--fg, #000);
      border: 1px solid var(--border, #ccc); border-radius: 6px; box-shadow: 0 6px 14px rgba(0,0,0,.25); }
    .feedback-menu[hidden] { display: none; }
    .feedback-menu a { display: block; padding: 8px 12px; text-decoration: none; color: inherit; font-size: 14px; white-space: nowrap; }
    .feedback-menu a:hover, .feedback-menu a:focus { background: var(--hover, rgba(127,127,127,.15)); outline: none; }`;
  const styleEl = document.createElement('style'); styleEl.textContent = styles; document.head.appendChild(styleEl);
  const FORMS = [{ text: 'Share feedback', form: 'feedback.yml' }, { text: 'Report a bug', form: 'bug.yml' }, { text: 'Suggest an idea', form: 'suggestion.yml' }];

  window.setupFeedback = function (gameName, version, getContext) {
    document.querySelectorAll('.feedback-container').forEach(container => {
      const btn = container.querySelector('button'); if (!btn || container.dataset.ready) return; container.dataset.ready = '1';
      const menu = document.createElement('div'); menu.className = 'feedback-menu'; menu.hidden = true; menu.setAttribute('role', 'menu');
      for (const l of FORMS) {
        const a = document.createElement('a'); a.href = '#'; a.textContent = l.text; a.setAttribute('role', 'menuitem');
        a.addEventListener('click', e => {
          e.preventDefault(); let where = ''; try { where = getContext ? getContext() : ''; } catch (err) { where = ''; }
          const url = new URL('https://github.com/ecbarish/idle-arcade/issues/new');
          url.searchParams.set('template', l.form); url.searchParams.set('game', gameName);
          url.searchParams.set('context', where ? `v${version} - ${where}` : `v${version}`);
          window.open(url.toString(), '_blank', 'noopener'); menu.hidden = true; btn.setAttribute('aria-expanded', 'false');
        });
        menu.appendChild(a);
      }
      container.appendChild(menu);
      btn.addEventListener('click', e => {
        e.stopPropagation(); const open = menu.hidden;
        document.querySelectorAll('.feedback-menu').forEach(m => { m.hidden = true; });
        menu.hidden = !open; btn.setAttribute('aria-expanded', String(open));
        if (open) { const first = menu.querySelector('a'); if (first) first.focus(); }
      });
      document.addEventListener('click', e => { if (!container.contains(e.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
      container.addEventListener('keydown', e => {
        if (e.key === 'Escape') { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); e.stopPropagation(); }
        else if (!menu.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault(); e.stopPropagation(); const items = [...menu.querySelectorAll('a')], i = items.indexOf(document.activeElement);
          items[e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length].focus();
        }
      });
    });
  };
})();
