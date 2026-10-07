'use strict';

// Executed in the game iframe so classic-script lexical globals stay accessible.
function wildbondChecks() {
  const checks = [];
  const check = (label, test) => {
    try {
      if (!test()) throw Error('Expected condition was false.');
      checks.push({ ok: true, label });
    } catch (error) {
      checks.push({ ok: false, label: label + ' — ' + error.message });
    }
  };
  const wb = window.__wb;
  const tile = (m, x, y) => m && m.rows[y] && m.rows[y][x];
  const walkable = (m, x, y) => {
    const ch = tile(m, x, y);
    return ch !== undefined && !!TILES[ch] && !TILES[ch].solid && !TILES[ch].door;
  };
  const speaker = who => who === '' || Object.hasOwn(CAST, who) ||
    (typeof who === 'string' && who.startsWith('@') && Object.hasOwn(SPECIES, who.slice(1)));
  const lines = (label, list) => (list || []).forEach(([who], i) =>
    check(label + ' speaker ' + (i + 1), () => speaker(who)));

  for (const [id, m] of Object.entries(MAPS)) {
    check(id + ': map rows have equal lengths', () => m.rows.length > 0 && m.rows[0].length > 0 && m.rows.every(r => r.length === m.rows[0].length));
    const exits = new Set(m.rows.join('').split('').filter(ch => TILES[ch] && TILES[ch].exit));
    for (const ch of exits) {
      check(id + ': exit ' + ch + ' has a destination map', () => !!m.exits && !!m.exits[ch] && !!MAPS[m.exits[ch].to]);
      check(id + ': exit ' + ch + ' arrives on a walkable tile', () => {
        const ex = (m.exits || {})[ch];
        return !!ex && walkable(MAPS[ex.to], ex.x, ex.y) && !npcAt(MAPS[ex.to], ex.x, ex.y);
      });
    }
    for (const key of Object.keys(m.doors || {})) {
      check(id + ': door ' + key + ' sits on D', () => { const [x, y] = key.split(',').map(Number); return tile(m, x, y) === 'D'; });
    }
    for (const n of m.npcs || []) {
      check(id + ': NPC ' + n.who + ' is in CAST', () => Object.hasOwn(CAST, n.who));
      check(id + ': NPC ' + n.who + ' stands on a walkable tile', () => walkable(m, ...n.at));
      lines(id + ': ' + n.who + ' dialogue', n.lines);
      if (n.trainer) { lines(id + ': ' + n.who + ' victory', n.trainer.win); lines(id + ': ' + n.who + ' after', n.trainer.after); }
    }
    if (m.warden) {
      check(id + ': Warden spot is walkable', () => walkable(m, ...m.warden));
      check(id + ': area has a Warden beat', () => STORY.some(b => b.gate && (b.biome || 'thornwood') === m.biome));
    }
  }
  for (const [id, list] of Object.entries(SCENES)) lines('Scene ' + id, list);
  for (const b of STORY) {
    if (b.speaker !== undefined) check(b.id + ': story speaker', () => speaker(b.speaker));
    lines(b.id + ': introduction', b.lines); lines(b.id + ': victory', b.win);
    if (b.gate) {
      check(b.id + ': gate is a badge', () => Object.hasOwn(BADGES, b.gate));
      check(b.id + ': Warden trainer is a CAST speaker', () => Object.values(CAST).some(c => c.name === b.trainer));
    }
  }
  for (const [id, s] of Object.entries(SPECIES)) {
    for (const [level, move] of s.learn) check(id + ': level ' + level + ' move ' + move + ' exists', () => Object.hasOwn(MOVES, move));
    if (s.evo) check(id + ': evolution exists', () => Object.hasOwn(SPECIES, s.evo.to));
  }
  for (const [id, b] of Object.entries(BIOMES)) {
    for (const [sp] of b.wild) check(id + ': wild species ' + sp + ' exists', () => Object.hasOwn(SPECIES, sp));
    if (b.req) check(id + ': required badge is awarded by a Warden', () => Object.hasOwn(BADGES, b.req) && STORY.some(s => s.gate === b.req));
  }

  function reset() {
    // Clear transient battle/dialogue state as well as persistent state between scenarios.
    B = null; TALK = null; talkEl.hidden = true; W.after = W.afterDone = null; W.endT = W.autoT = 0; W.msg = '';
    S = fresh(); WK.ready = false; panelKey = tabKey = ''; closeModal();
  }
  function ready() {
    reset(); S.started = true; S.starter = 'ripplet'; S.rivalStarter = 'mosshog';
    S.team = [wb.newCreature('tidewyrm', 100, { rar: 4 })]; wb.placeAt('larkhaven');
  }
  function walk(x, y) {
    if (!wb.walkTo(x, y)) return false;
    let ticks = 0;
    while (WK.path.length && ticks++ < 2000) wb.worldTick(0.1);
    return ticks < 2000;
  }
  check('Choosing a starter puts you in Larkhaven', () => {
    reset(); wb.chooseStarter('ripplet', 'Test Tamer', 'classic'); skipTalk();
    return S.started && S.pos.map === 'larkhaven' && S.team[0].sp === 'ripplet';
  });
  check('Walking north from Larkhaven reaches Thornwood', () => {
    ready(); return walk(10, 0) && S.pos.map === 'thornwood';
  });
  check('Thornwood north gate stays locked without Thorn Badge', () => {
    ready(); wb.placeAt('thornwood', 13, 1, 'up'); wb.tryStep('up');
    return S.pos.map === 'thornwood' && W.msg.includes('Thorn Badge');
  });
  check('Thornwood north gate opens with Thorn Badge', () => {
    ready(); S.badges = ['thorn']; wb.placeAt('thornwood', 13, 1, 'up'); wb.tryStep('up');
    return S.pos.map === 'saltmarsh';
  });
  const badges = ['thorn', 'tide', 'ember'];
  for (let n = 0; n <= 3; n++) check('Level cap with ' + n + ' badges is ' + (15 + 10 * n), () => {
    ready(); S.badges = badges.slice(0, n); return wb.levelCap() === 15 + 10 * n;
  });
  check('Soft cap still grants a trickle of XP at the cap', () => {
    ready(); S.capMode = 'soft'; const c = wb.newCreature('tidewyrm', 15); c.xp = 0; grow(c, 100);
    return c.lvl === 15 && c.xp === Math.round(100 * SOFT_TRICKLE) && c.xp > 0 && c.xp < 100;
  });
  check('Hard cap grants no XP at the cap', () => {
    ready(); S.capMode = 'hard'; const c = wb.newCreature('tidewyrm', 15); c.xp = 0; grow(c, 100);
    return c.lvl === 15 && c.xp === 0;
  });
  check('Caps off lets a creature grow past level 15', () => {
    ready(); S.capMode = 'off'; const c = wb.newCreature('tidewyrm', 15); grow(c, 100000);
    return wb.levelCap() === 100 && c.lvl > 15;
  });
  for (const g of STORY.filter(b => b.gate)) {
    check(g.trainer + ': cannot be challenged in town', () => {
      ready(); S.biome = g.biome || 'thornwood'; S.explored = g.at; S.exploredIn = { [S.biome]: g.at };
      wb.challengeWarden(); return !wb.wardenReady() && !TALK && !wb.B;
    });
    check(g.trainer + ': can be challenged on their own map', () => {
      ready(); const area = g.biome || 'thornwood'; const map = Object.keys(MAPS).find(id => MAPS[id].biome === area);
      wb.placeAt(map); S.explored = g.at; S.exploredIn = { [area]: g.at }; renderAll();
      const button = document.querySelector('[data-act="warden"]');
      if (!wb.wardenReady() || !button || button.textContent !== 'Challenge ' + g.trainer) return false;
      button.click(); const scene = !!TALK && !talkEl.hidden; skipTalk();
      return scene && !!wb.B && wb.B.story === g.id && wb.B.trainer === g.trainer;
    });
    check(g.trainer + ': actual victory awards their badge', () => {
      ready(); const area = g.biome || 'thornwood'; wb.placeAt(Object.keys(MAPS).find(id => MAPS[id].biome === area));
      S.explored = g.at; S.exploredIn = { [area]: g.at }; wb.challengeWarden(); skipTalk();
      if (!wb.B) return false;
      let ticks = 0;
      while (wb.B && !wb.B.over && ticks++ < 10000) { wb.command('focus'); wb.worldTick(0.1); }
      const won = wb.B && wb.B.over === 'won'; wb.finishBattle(); skipTalk();
      return won && S.story[g.id] && S.badges.includes(g.gate);
    });
  }
  check('Old save without position, journey or cap mode loads defaults', () => {
    ready(); const old = JSON.parse(JSON.stringify(S)); delete old.pos; delete old.journey; delete old.capMode;
    localStorage.setItem('wildbond-save-v1', JSON.stringify(old)); load(); ensurePos();
    return S.journey === 'classic' && S.capMode === 'soft' && S.pos.map === 'thornwood' && S.team[0].sp === 'tidewyrm';
  });
  check('Walking into the inn heals the team', () => {
    ready(); S.team[0].hp = 1; wb.placeAt('larkhaven', 4, 5, 'up'); wb.tryStep('up');
    return S.team.every(c => c.hp === stOf(c).hp) && W.msg.includes('innkeeper');
  });
  check('Walking into the shop buys five lures for 50 coins', () => {
    ready(); const coins = S.coins, lures = S.lures; wb.placeAt('larkhaven', 18, 5, 'up'); wb.tryStep('up');
    return S.coins === coins - 50 && S.lures === lures + 5 && W.msg.includes('shopkeeper');
  });
  return checks;
}

(() => {
  const button = document.querySelector('#run'), summary = document.querySelector('#summary'), results = document.querySelector('#results');
  const keys = ['wildbond-save-v1', 'arcade-index-v1'];
  let active = null;
  function result(ok, label) {
    const li = document.createElement('li'); li.className = ok ? 'pass' : 'fail'; li.textContent = (ok ? 'PASS — ' : 'FAIL — ') + label; results.appendChild(li);
  }
  function restore() {
    if (!active) return;
    // Destroy the writer (timers and beforeunload save) BEFORE restoring the originals.
    if (active.frame) { active.frame.remove(); active.frame = null; }
    const errors = [];
    for (const [key, value] of active.backup) {
      try {
        if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
        if (localStorage.getItem(key) !== value) throw Error('Value did not match backup.');
      } catch (error) { errors.push(key + ': ' + error.message); }
    }
    if (errors.length) throw Error('Save restoration failed: ' + errors.join('; '));
    active = null;
  }
  addEventListener('pagehide', restore);
  button.addEventListener('click', async () => {
    button.disabled = true; results.replaceChildren(); summary.className = ''; summary.textContent = 'Running…';
    let total = 0, failed = 0;
    const record = (ok, label) => { total++; if (!ok) failed++; result(ok, label); };
    try {
      if (location.hostname !== 'localhost' || !/^https?:$/.test(location.protocol)) throw Error('Open this page through serve.ps1 at http://localhost:8765/tests/wildbond.html.');
      // Finish ALL reads before changing storage; if backup fails, no game is loaded.
      const backup = new Map(keys.map(key => [key, localStorage.getItem(key)]));
      active = { backup, frame: null };
      localStorage.removeItem(keys[0]);
      const frame = document.createElement('iframe'); frame.title = 'Wildbond test instance'; active.frame = frame;
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(Error('Game iframe load timed out.')), 15000);
        frame.onload = () => { clearTimeout(timer); resolve(); };
        frame.onerror = () => { clearTimeout(timer); reject(Error('Game iframe failed to load.')); };
        frame.src = '../games/wildbond/'; document.querySelector('#game').appendChild(frame);
      });
      const w = frame.contentWindow;
      if (!w.__wb) throw Error('Wildbond localhost test hook is unavailable.');
      for (const c of w.eval('(' + wildbondChecks.toString() + ')()')) record(c.ok, c.label);
    } catch (error) {
      record(false, error.message);
    } finally {
      try { restore(); } catch (error) { record(false, error.message); }
      summary.textContent = failed ? 'FAIL — ' + failed + ' of ' + total + ' failed.' : 'PASS — ' + total + ' checks.';
      summary.className = failed ? 'fail' : 'pass'; button.disabled = false;
    }
  });
})();
