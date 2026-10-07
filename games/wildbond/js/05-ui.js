'use strict';
/* Everything on screen except the canvas scene. */
function toast(m) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = m; const b = $('#toasts'); b.appendChild(el); while (b.children.length > 3) b.firstChild.remove(); setTimeout(() => el.remove(), 3200); }
const elChip = e => e ? `<span class="el" style="--c:${ELEMENTS[e].col}">${e}</span>` : '';
const rarTag = r => r ? `<span class="rar r${r}">${Cr.RARITY[r].name}</span>` : '';
function bar(cur, max, cls) { return `<div class="bar ${cls || ''}"><i style="width:${Math.max(0, Math.min(100, cur / max * 100))}%"></i></div>`; }
function portrait(id, sm) { return `<canvas class="pic${sm ? ' sm' : ''}" width="${sm ? 56 : 72}" height="${sm ? 44 : 56}" data-sp="${id}"></canvas>`; }
function drawPortraits(root) { (root || document).querySelectorAll('canvas[data-sp]').forEach(cv => { if (cv.dataset.done) return; cv.dataset.done = 1;
  const c = eraCtx(cv.getContext('2d')); c.imageSmoothingEnabled = false; const s = SPECIES[cv.dataset.sp], p = Math.max(2, Math.floor(cv.height / 18));
  art().creature(c, cv.width / 2 - 2 * p, cv.height - 3, p, s, false, 0, cv.dataset.seen === '0' ? { col: '#2a3a40' } : null); }); }

/* ---- header ---- */
function renderTop() {
  $('#coins').textContent = fmtI(S.coins); $('#lures').textContent = S.lures; $('#badges').textContent = S.badges.length;
  $('#autoBtn').setAttribute('aria-pressed', S.auto ? 'true' : 'false');
}

/* ---- the panel under the scene: battle or exploring ---- */
let panelKey = '';
function renderPanel() {
  const el = $('#panel');
  if (TALK) { if (panelKey !== 'talk') { panelKey = 'talk'; el.innerHTML = `<div class="explore"><p class="msg">Click the scene or press Space to continue.</p><div class="acts"><button class="btn alt" data-act="skiptalk">Skip scene <kbd>Esc</kbd></button></div></div>`; } return; }
  if (B) {
    const k = 'b' + B.allies.map(u => u.c.uid).join() + B.foes.map(u => u.c.uid).join() + B.over + !!B.capture + B.kind;
    if (k !== panelKey) { panelKey = k;
      el.innerHTML = `<div class="side foes">${B.foes.map((u, i) => `<div class="card" id="fu${i}"><div class="cn">${u.c.name} <span class="lv">Lv ${u.c.lvl}</span></div><div>${elChip(sp(u.c).el)}${rarTag(u.c.rar)}</div><div class="hpw"></div></div>`).join('')}</div>
        <div class="tele" id="tele" hidden></div>
        <div class="side allies">${B.allies.map((u, i) => `<div class="card" id="au${i}"><div class="cn">${u.c.name} <span class="lv">Lv ${u.c.lvl}</span></div><div class="hpw"></div><div class="atbw"></div></div>`).join('')}</div>
        ${B.over ? `<div class="result ${B.over}">${{ won: 'Victory!', caught: 'Caught!', lost: 'Your team needs rest.', fled: 'You got away.' }[B.over]} <button class="btn" data-act="continue">Continue</button></div>` :
        B.capture ? `<div class="capture"><div class="meter"><i class="zone" style="left:${(B.capture.zone - 0.1) * 100}%"></i><i class="mark" id="mark"></i></div><button class="btn big" data-act="calm">Calm (Space)</button></div>` :
        `<div class="cmds"><span class="pts" id="pts"></span>
          <button class="btn" data-act="cmd" data-arg="focus" title="An ally acts right now, 30% harder. Costs 1.">Focus <kbd>F</kbd></button>
          <button class="btn" data-act="cmd" data-arg="guard" title="Your team takes half damage for 3 seconds. Use it on telegraphed attacks. Costs 1.">Guard <kbd>G</kbd></button>
          ${modeOn("hardcore") ? "" : `<button class="btn" data-act="cmd" data-arg="rally" title="Heal your whole team 20%. Costs 2.">Rally <kbd>R</kbd></button>`}
          ${B.kind === 'wild' ? `<button class="btn lure" data-act="cmd" data-arg="lure">Lure (${S.lures}) <kbd>L</kbd></button><button class="btn alt" data-act="cmd" data-arg="flee">Flee</button>` : ''}</div>`}
        <div class="hint" id="bhint"></div>`; }
    B.foes.forEach((u, i) => { const c = $('#fu' + i); if (!c) return; c.classList.toggle('down', u.c.hp <= 0); c.querySelector('.hpw').innerHTML = bar(u.c.hp, u.st.hp, 'hp') + `<span class="hpt">${u.c.hp}/${u.st.hp}</span>`; });
    B.allies.forEach((u, i) => { const c = $('#au' + i); if (!c) return; c.classList.toggle('down', u.c.hp <= 0); c.querySelector('.hpw').innerHTML = bar(u.c.hp, u.st.hp, 'hp') + `<span class="hpt">${u.c.hp}/${u.st.hp}</span>`; c.querySelector('.atbw').innerHTML = bar(u.atb, ACT_AT, 'atb'); });
    const tl = $('#tele'); tl.hidden = !B.tele; if (B.tele) tl.textContent = `${B.tele.u.c.name} is gathering power for ${MOVES[B.tele.m].name}! Guard now!`;
    const pts = $('#pts'); if (pts) pts.innerHTML = 'Commands ' + [0, 1, 2].map(i => `<b class="${i < B.cmd ? 'on' : ''}"></b>`).join('');
    const mk = $('#mark'); if (mk && B.capture) mk.style.left = (B.capture.pos * 100) + '%';
    $('#bhint').textContent = B.over ? '' : isAuto() ? (S.auto ? 'Auto-explore is on: your team fights on its own.' : 'Autopilot took over. Press any command to take charge.') : 'Command points refill every 5 seconds.';
    return;
  }
  if (S.pos && curMap().league) { const key = 'league:' + W.msg + leagueState().room + leagueState().active + S.day + !!S.story.leagueWren + !!S.story.leagueChampion + !!S.story.leagueEnding; if (panelKey !== key) { panelKey = key; el.innerHTML = leaguePanel(); } return; }
  const town = S.pos && !curMap().biome;
  const k = 'x' + S.biome + S.badges.length + S.explored + W.msg + S.lures + wardenReady() + elderReady() + alive().length + S.auto + (S.pos && S.pos.map) + isNight() + weatherNow() + !!S.ride + S.era;
  if (k === panelKey) return; panelKey = k;
  const nb = STORY.find(b => beatHere(b) && !S.story[b.id] && !b.gate && !(b.id === 'elder' && S.story.elderFled)), g = gateHere();
  el.innerHTML = `<div class="explore"><div><b>${town ? curMap().name : BIOMES[S.biome].name}</b> <span class="meta">${town ? 'inn, shop and Maren\'s ranch · walk north to Thornwood' : `explored ${S.explored} times · wild levels ${BIOMES[S.biome].lv[0]}–${BIOMES[S.biome].lv[1]}`}</span></div>
    <p class="msg">${W.msg || (!alive().length ? 'Your team is exhausted. Rest at the Larkhaven inn.' : town ? 'Walk into a door to visit. Talk to people by walking up to them.' : 'Wild creatures hide in the tall grass.')}</p>
    <p class="meta">${S.auto ? 'Auto-explore is on: your tamer walks the grass on their own.' : `Walk with the arrow keys or WASD, or tap where you want to go.${S.shoes ? ' Hold Shift to run.' : ''}${S.era === 'diorama' ? ' Drag the scene to turn the camera, scroll to zoom.' : ''}`}${!town && isNight() ? ' Night has fallen: Shade creatures are out.' : ''}${WEATHER_NAME[weatherNow()] ? ' ' + WEATHER_NAME[weatherNow()] : ''}</p>
    ${!town && nb && beatCount(nb) < nb.at ? `<p class="meta">Something is waiting further in (${nb.at - beatCount(nb)} more finds in the grass).</p>` : ''}
    <div class="acts">${town ? '' : `<button class="btn big" data-act="explore" ${alive().length ? '' : 'disabled'}>Search the grass <kbd>E</kbd></button>`}${rideOK() ? `<button class="btn alt" data-act="ride">${S.ride ? "Walk" : "Ride " + S.team.find(c => c.hp > 0).name} <kbd>R</kbd></button>` : ""}
      ${wardenReady() ? `<button class="btn gold" data-act="warden">Challenge ${g.trainer}</button>` : ''}
      ${elderReady() ? '<button class="btn gold" data-act="elder">Seek Elderhorn</button>' : ''}
      ${Object.keys(BIOMES).filter(id => (S.pos ? S.pos.map !== id : id !== S.biome) && biomeOpen(id)).map(id => `<button class="btn alt" data-act="biome" data-arg="${id}">Travel to ${BIOMES[id].name}</button>`).join('')}
      <button class="btn alt" data-act="rest">Rest in Larkhaven</button><button class="btn alt" data-act="lures">Buy 5 lures (50)</button></div></div>`;
}

/* ---- tabs ---- */
let tabKey = '';
const TABS = {
  team: { key: () => S.team.map(c => c.uid + ':' + c.lvl + ':' + c.sp + ':' + c.name + ':' + Cr.bondLvl(c)).join() + !!B + leagueLocked() + levelCap() + S.capMode,
    build: () => `<h3>Your team (${S.team.length}/3)</h3><p class="sub">Grades show each creature's hidden potential (F to S). Train and breed them on the Ranch.
      ${S.capMode === 'off' ? '' : `Badge level cap: <b>${levelCap()}</b>.`}</p>` +
      S.team.map((c, i) => cardHTML(c, i, true)).join('') },
  ranch: { key: () => S.ranch.map(c => c.uid + ':' + c.lvl).join() + S.team.length + !!B,
    build: () => `<h3>Ranch (${S.ranch.length})</h3><p class="sub">Creatures you've caught beyond your team of 3 wait here. Feed them, set their training and pair them in the barn below.</p>` +
      (S.ranch.length ? S.ranch.map((c, i) => cardHTML(c, i, false)).join('') : '<p class="meta">Nobody here yet. Catch more creatures with lures.</p>') },
  dex: { key: () => Object.keys(S.seen).length + ':' + Object.keys(S.caught).length,
    build: () => { const ids = Object.keys(SPECIES); return `<h3>Wilddex</h3><p class="sub">${Object.keys(S.caught).length} caught · ${Object.keys(S.seen).length} seen · ${ids.length} known in this region.</p><div class="dex">` +
      ids.map(id => { const s = SPECIES[id], seen = S.seen[id], got = S.caught[id];
        return `<div class="dx ${got ? '' : 'faded'}"><canvas class="pic sm" width="56" height="44" data-sp="${id}" data-seen="${seen ? 1 : 0}"></canvas><div><b>${seen ? s.name : '???'}</b> ${seen ? elChip(s.el) : ''}<div class="meta">${got ? s.dex : seen ? 'Seen, not caught.' : 'Not yet seen.'}</div></div></div>`; }).join('') + '</div>'; } },
  journal: { key: () => S.log.length + S.era + S.journey + S.capMode + S.xpShare + !!B + S.badges.length + ':' + (S.day || 1) + ':' + Math.floor(dayPart() * 3) + ':' + (S.pos && S.pos.map) + ':' + leagueState().room + ':' + !!S.story.leagueEnding,
    build: () => `<h3>Journal</h3><div class="stats"><div>Battles <b>${S.stats.battles}</b></div><div>Wins <b>${S.stats.wins}</b></div><div>Caught <b>${S.stats.caught}</b></div><div>Played <b>${fmtTime(S.stats.play)}</b></div></div>
      ${forecastHTML()}
      <h4>Larkhaven inn: your journey</h4><p class="sub">Choose how long the road is. You can change these any time you're not in a battle.${S.auto ? ' Auto-explore earns a little less XP than exploring yourself.' : ''}</p>
      ${settingRow('journey', Object.keys(JOURNEY).map(k => [k, JOURNEY[k].name, JOURNEY[k].desc]), S.journey)}
      <p class="sub" style="margin-top:10px">Badge level cap: right now your creatures can reach level <b>${levelCap()}</b>. Each badge raises it: by 10 for the first four, then by 5, up to 75 with all eight; the post-game goes on to 100.</p>
      ${settingRow('cap', [['soft', 'Soft cap', 'Above the cap, XP slows to a trickle.'], ['hard', 'Hard cap', 'No XP at all above the cap.'], ['off', 'No cap', 'Grow freely up to level 100.']], S.capMode)}
      <p class="sub" style="margin-top:10px">XP share: creatures resting on the ranch learn from your battles.</p>
      ${settingRow('share', [['off', 'XP share off', 'Only your team of three gains XP.'], ['on', 'XP share on', 'Ranch creatures get a quarter of the XP.']], S.xpShare ? 'on' : 'off')}
      ${challengeHTML()}
      <h4>Art style</h4><p class="sub">The world's look evolves as you progress. Unlocked styles can be switched any time.</p><div class="eras">${ERAS.map(e => { const on = S.eras.includes(e.id) && ART[e.id];
        return `<button class="era ${S.era === e.id ? 'cur' : ''}" data-act="era" data-arg="${e.id}" ${on ? '' : 'disabled'}><b>${e.name}</b><span>${on ? (S.era === e.id ? 'In use' : 'Use this style') : e.soon ? `Coming soon · ${e.unlock}` : e.unlock}</span></button>`; }).join('')}</div>
      ${leagueJournal()}<h4>Story so far</h4><div class="logl">${S.log.slice(0, 20).map(m => `<div>${m}</div>`).join('')}</div>` }
};
/* Weather forecasts use the same three periods per ranch day as the walking scene. */
function forecastHTML() {
  if (!S.badges.includes('tide')) return '<h4>Trail forecast</h4><p class="sub">Earn the Tide Badge to read the changing weather on your routes.</p>';
  const names = { clear: 'Clear', rain: 'Rain', mist: 'Mist', ash: 'Falling ash' };
  return '<h4>Trail forecast</h4><p class="sub">Weather changes three times each ranch day. Now, the next period, then the following one. Rain favors Tide, mist favors Shade and Gale, and ash favors Ember; these change wild encounters, not battle damage.</p><div class="eras">' +
    Object.keys(BIOMES).filter(biomeOpen).map(id => {
      const current = S.pos && MAPS[S.pos.map].biome === id;
      return '<div class="era' + (current ? ' cur' : '') + '"><b>' + BIOMES[id].name + (current ? ' · here' : '') + '</b>' +
        weatherForecast(id).map((f, i) => '<span>' + ['Now', 'Next', 'Then'][i] + ': <strong>' + names[f.weather] + '</strong> · day ' + f.day + ', period ' + (f.segment + 1) + '</span>').join('') + '</div>';
    }).join('') + '</div>';
}
/* a row of choice cards for a setting: opts = [[value, name, description]] */
function settingRow(kind, opts, cur) {
  return `<div class="eras">${opts.map(([v, n, d]) => `<button class="era ${cur === v ? 'cur' : ''}" data-act="set" data-arg="${kind}:${v}" aria-pressed="${cur === v}" ${B ? 'disabled' : ''}><b>${n}</b><span>${d}</span></button>`).join('')}</div>`;
}
function capNote(c) {
  if (c.lvl >= LEVEL_CAP) return 'max level';
  const xp = `${fmtI(c.xp)}/${fmtI(Cr.xpNeed(c.lvl))} xp`;
  if (c.lvl < levelCap()) return xp;
  return S.capMode === 'hard' ? `at the badge cap (${levelCap()})` : `${xp}, slowed above the badge cap`;
}
function cardHTML(c, i, inTeam) {
  const s = sp(c), st = stOf(c), mv = movesOf(c), bl = Cr.bondLvl(c), T = Cr.TEMPERAMENTS[c.temp];
  return `<div class="ccard">${portrait(c.sp)}<div class="cbody">
    <div class="cn">${c.name} <span class="lv">Lv ${c.lvl}</span> ${elChip(s.el)} ${rarTag(c.rar)}</div>
    <div class="meta">${s.name !== c.name ? s.name + ' · ' : ''}${T.name}${T.up ? ` (+${Cr.STAT_NAME[T.up]}, −${Cr.STAT_NAME[T.down]})` : ''} · ${Cr.BOND[bl].n}${c.traits.length ? ' · ' + c.traits.map(t => Cr.TRAITS[t].name).join(', ') : ''}</div>
    ${bar(c.hp, st.hp, 'hp')}<div class="meta">${c.hp <= 0 ? 'Fainted, needs rest' : `${c.hp}/${st.hp} health`} · ${capNote(c)}${s.evo && c.lvl < s.evo.at ? ` · evolves at ${s.evo.at}` : ''}</div>
    <div class="grades">${Cr.STATS.map(k => `<span title="${Cr.STAT_NAME[k]}: ${st[k]} (potential ${Cr.grade(c.pot[k])})">${Cr.STAT_NAME[k].slice(0, 3)} <b>${st[k]}</b> <i class="g${Cr.grade(c.pot[k])}">${Cr.grade(c.pot[k])}</i></span>`).join('')}</div>
    <div class="meta">Moves: ${mv.map(m => MOVES[m].name).join(', ')}</div>
    <div class="cacts">${inTeam ? (S.team.length > 1 && !B && !leagueLocked() ? `<button class="btn sm alt" data-act="toranch" data-arg="${c.uid}">Send to ranch</button>` : '') :
      `<button class="btn sm" data-act="toteam" data-arg="${c.uid}" ${S.team.length >= teamMax() || B ? 'disabled' : ''}>Add to team</button><button class="btn sm alt" data-act="release" data-arg="${c.uid}">Release</button>`}
      <button class="btn sm alt" data-act="rename" data-arg="${c.uid}">Rename</button></div></div></div>`;
}
function renderTabs(force) {
  const t = TABS[S.tab] || TABS.team, k = S.tab + t.key();
  if (force || k !== tabKey) { tabKey = k; $('#tabbody').innerHTML = t.build(); drawPortraits($('#tabbody')); }
  document.querySelectorAll('.tabs [data-arg]').forEach(b => b.setAttribute('aria-selected', b.dataset.arg === S.tab ? 'true' : 'false'));
}
let logKey = '';
function renderLog() { const L = B ? B.lines.slice(-6) : []; const html = L.map(l => `<div class="l-${l.cls}">${l.t}</div>`).join(''); if (html !== logKey) { logKey = html; $('#blog').innerHTML = html; } $('#blog').hidden = !B; }

function startHTML() {
  return `<h2>Welcome to Larkhaven</h2><p class="sub">A frontier town at the edge of Thornwood. Every tamer starts with one partner. Choose yours.</p>
    <div class="starters">${STARTERS.map(id => { const s = SPECIES[id]; return `<button class="starter" data-act="starter" data-arg="${id}">${portrait(id)}<b>${s.name}</b>${elChip(s.el)}<span>${s.dex}</span></button>`; }).join('')}</div>
    <label class="meta">Your name <input id="tname" maxlength="14" value="${S.name === 'Tamer' ? '' : S.name}" placeholder="Tamer"></label>
    <h4>How long a journey?</h4><p class="sub">You can change this later at the Larkhaven inn (Journal tab).</p>
    ${settingRow('pace', Object.keys(JOURNEY).map(k => [k, JOURNEY[k].name, JOURNEY[k].desc]), S.journey)}
    <h4>Challenge modes <span class="meta">(optional, mix any)</span></h4><p class="sub">Picked now, kept for the whole journey. Collect every badge with a mode on to earn its title.</p>
    <div class="eras">${Object.keys(MODES).map(k => `<button class="era ${PICKED[k] ? 'cur' : ''}" data-act="mode" data-arg="${k}" aria-pressed="${!!PICKED[k]}"><b>${MODES[k].name}</b><span>${MODES[k].desc}</span></button>`).join('')}</div>`;
}
/* the Journal's challenge section: modes, titles, rematch tiers and area mastery stars */
function challengeHTML() {
  const on = Object.keys(MODES).filter(modeOn), star = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  const areas = Object.keys(BIOMES).filter(id => S.exploredIn && S.exploredIn[id] || id === S.biome).map(id => { const m = masteryOf(id);
    return `<div>${BIOMES[id].name} <b title="Wilddex · Warden rematch tier 3 · every item and trainer">${star(m.stars)}</b> <span class="meta">${m.dex ? 'Wilddex ✓' : 'Wilddex'} · ${m.hasWarden ? (m.warden ? 'Warden tier 3 ✓' : 'Warden tier 3') : 'no Warden yet'} · ${m.secrets ? 'secrets ✓' : 'items and trainers'}</span></div>`; }).join('');
  const tiers = Object.entries(S.rematch || {}).map(([id, t]) => `${id === 'wren' ? 'Wren' : STORY.find(b => b.id === id).trainer} tier ${t}`).join(' · ');
  return `<h4>Challenges and mastery</h4>
    <p class="sub">${on.length ? 'Modes: <b>' + on.map(k => MODES[k].name).join(', ') + '</b>.' : 'No challenge modes on this journey.'}${S.modes && S.modes.nuzlockeEnded ? ' (Your Nuzlocke run ended.)' : ''}
      ${(S.titles || []).length ? ' Titles: <b>' + S.titles.join(', ') + '</b>.' : ''}</p>
    <p class="sub">Beaten Wardens (and Wren, in Larkhaven) take one rematch a day, each tier stronger and better paid.${tiers ? ' Best: ' + tiers + '.' : ''}</p>
    <div class="logl">${areas}</div>`;
}
function openModal(html) { $('#sheet').innerHTML = html; $('#modal').hidden = false; drawPortraits($('#sheet')); }
function closeModal() { $('#modal').hidden = true; }

function renderAll() { renderTop(); renderPanel(); renderLog(); renderTabs(false); }
