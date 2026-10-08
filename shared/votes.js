/* Player votes (2026-10-07). Evan: "if we have undecided features it could be awesome to let players vote between
   choices as they're going, so we can figure out the best direction". Any page can ask a question:
     Votes.card(element, { id: 'launcher-1', question, options: [[value, text]], game, version, note })
   A player's choice is kept on their device (localStorage 'arcade-votes-v1') and can be changed any time. If
   shared/votes-config.js names a Google Form, each vote is also sent there, anonymously (a random tester id, the
   poll, the choice, the game and its version; nothing personal), and Evan reads the results in the Form's sheet.
   Without a form, the card offers the Feedback form instead. Open polls are listed in docs/VOTES.md.           */
(function () {
  'use strict';
  var KEY = 'arcade-votes-v1', ID_KEY = 'arcade-tester-id';
  function all() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function put(id, rec) { var a = all(); a[id] = rec; try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function tester() {
    try { var t = localStorage.getItem(ID_KEY); if (!t) { t = Math.random().toString(36).slice(2, 10); localStorage.setItem(ID_KEY, t); } return t; } catch (e) { return 'anon'; }
  }
  function cfg() { return window.VOTES_CONFIG || {}; }
  function configured() { var c = cfg(); return !!(c.form && c.fields && c.fields.poll && c.fields.choice); }
  function send(poll, choice, game, version) {
    if (!configured()) return false;
    var c = cfg(), f = c.fields, body = new FormData();
    body.append(f.poll, poll); body.append(f.choice, choice);
    if (f.game) body.append(f.game, game || ''); if (f.version) body.append(f.version, version || ''); if (f.tester) body.append(f.tester, tester());
    try { fetch(c.form, { method: 'POST', mode: 'no-cors', body: body }).catch(function () {}); return true; } catch (e) { return false; }
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var css = '.vote{border:1px solid var(--vote-line,#4a4266);background:var(--vote-bg,rgba(255,255,255,.04));border-radius:12px;padding:12px 14px}' +
    '.vote h3{margin:0 0 4px;font-size:15px}.vote p{margin:4px 0;font-size:13px;opacity:.8}.vote-opts{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 4px}' +
    '.vote-opts button{font:inherit;font-size:14px;min-height:44px;padding:6px 14px;border-radius:9px;border:1px solid var(--vote-line,#4a4266);background:transparent;color:inherit;cursor:pointer}' +
    '.vote-opts button[aria-pressed="true"]{background:var(--vote-on,#ffcf4d);color:#1a1020;border-color:var(--vote-on,#ffcf4d);font-weight:700}';
  if (typeof document !== 'undefined') { var st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st); }
  function card(el, o) {
    if (!el) return;
    function render(msg) {
      var mine = all()[o.id], pick = mine && mine.choice;
      el.innerHTML = '<div class="vote" role="group" aria-label="' + esc(o.question) + '"><h3>' + esc(o.question) + '</h3>' + (o.note ? '<p>' + esc(o.note) + '</p>' : '') +
        '<div class="vote-opts">' + o.options.map(function (op) { return '<button type="button" data-vote="' + esc(op[0]) + '" aria-pressed="' + (pick === op[0]) + '">' + esc(op[1]) + '</button>'; }).join('') + '</div>' +
        '<p aria-live="polite">' + (msg || (pick ? 'Thanks! You can change your vote any time.' : 'Votes are anonymous.')) + '</p></div>';
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-vote]'); if (!b) return;
      var v = b.dataset.vote; put(o.id, { choice: v, at: Date.now(), game: o.game || '', version: o.version || '' });
      var sent = send(o.id, v, o.game, o.version);
      render(sent ? 'Thanks! Your vote was sent. You can change it any time.' :
        'Thanks! Saved on this device. To make it count now, mention it in Feedback (the button at the top).');
      if (o.onVote) o.onVote(v);
    });
    render();
  }
  window.Votes = { card: card, all: all, configured: configured, tester: tester };
})();
