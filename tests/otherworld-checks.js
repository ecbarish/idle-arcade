/* Otherworld checks: every path through every built world reaches an ending, for every gift and every set of soul
   memories; the save, rebirth and memories behave as the design promises. Runs inside the game page (iframe). */
function otherworldChecks() {
  const ow = window.__ow, out = [];
  const check = (label, fn) => { try { out.push({ ok: !!fn(), label }); } catch (e) { out.push({ ok: false, label: label + ' (' + e.message + ')' }); } };
  const clone = l => JSON.parse(JSON.stringify(l));
  // walk every branch: returns { endings: Set, problems: [] }
  function explore(world, gift, mem, town) {
    const endings = new Set(), problems = [];
    const life0 = { world, gift, name: 'Test', flags: {}, at: WORLDS[world].start, silver: 0, status: false, mem, ...(town ? { town: { ...town } } : {}) };
    const stack = [[WORLDS[world].start, life0, 0]];
    while (stack.length) {
      const [id, life, depth] = stack.pop(), n = NODES[id];
      if (!n) { problems.push('missing node ' + id); continue; }
      if (depth > 40) { problems.push('loop at ' + id); continue; }
      ow.prepareLife(life); life.at = id; if (!life.entered[id]) { if (n.fx) n.fx(life); life.entered[id] = true; }
      const lines = typeof n.lines === 'function' ? n.lines(life) : n.lines;
      if (!Array.isArray(lines) || lines.some(l => !Array.isArray(l) || typeof l[1] !== 'string')) problems.push('bad lines at ' + id);
      const avail = (n.choices || []).filter(c => !c.need || c.need(life));
      if (n.choices && !avail.length) problems.push('no choice available at ' + id);
      if (avail.length) for (const c of avail) { const l2 = clone(life); l2.mem = life.mem; if (c.fx) c.fx(l2);
        if (c.end) endings.add(c.end); else stack.push([typeof c.go === 'function' ? c.go(l2) : c.go, l2, depth + 1]); }
      else if (n.end) endings.add(typeof n.end === 'function' ? n.end(life) : n.end);
      else if (n.go) stack.push([typeof n.go === 'function' ? n.go(life) : n.go, life, depth + 1]);
      else problems.push('dead end at ' + id);
    }
    return { endings, problems };
  }
  const built = Object.keys(WORLDS).filter(w => WORLDS[w].start);
  const memSets = [{}, { tide: true }, { oldroot: true }, { guildmaster: true }, Object.fromEntries(Object.keys(MEMORIES).map(k => [k, true]))];
  for (const w of built) for (const g of Object.keys(GIFTS[w])) for (const m of memSets) {
    const r = explore(w, g, m);
    check(`${WORLDS[w].name}, ${GIFTS[w][g].name}, memories [${Object.keys(m).join(',') || 'none'}]: every path reaches an ending`, () => !r.problems.length && r.endings.size > 0 || (() => { throw Error(r.problems.slice(0, 3).join('; ')); })());
    check(`${WORLDS[w].name}, ${GIFTS[w][g].name}, memories [${Object.keys(m).join(',') || 'none'}]: endings are real and have epilogues`, () => [...r.endings].every(e => ENDINGS[e] && EPILOGUES[e]));
  }
  check('every ending can be reached by some gift and memories', () => {
    const all = new Set(); for (const w of built) for (const g of Object.keys(GIFTS[w])) for (const m of memSets) explore(w, g, m).endings.forEach(e => all.add(e));
    const missing = Object.keys(ENDINGS).filter(e => !all.has(e)); if (missing.length) throw Error('unreachable: ' + missing.join(', ')); return true;
  });
  check('at least three kinds of ending per world (hopeful, bittersweet, strange or death)', () => new Set(Object.values(ENDINGS).map(e => e.feel)).size >= 3);
  check('every ending\'s memories exist', () => Object.values(ENDINGS).every(e => e.keep.every(k => MEMORIES[k])));
  check('every world offers three gifts, each with a strength and a cost', () => built.every(w => Object.values(GIFTS[w]).length === 3 && Object.values(GIFTS[w]).every(g => g.good && g.cost)));
  check('a memory from a past life opens a new choice (Oldroot\'s name)', () => {
    const fresh = explore('asterhold', 'pocket', {}).endings, wise = explore('asterhold', 'pocket', { oldroot: true }).endings;
    return !fresh.has('e_oldroot') && wise.has('e_oldroot');
  });
  check('finishing a life keeps the ending\'s memories, records the life and returns to the Between', () => {
    const keep = JSON.stringify(ow.S);
    try { ow.S = Object.assign(JSON.parse(keep), { mem: {}, lives: [], life: { world: 'asterhold', gift: 'sword', name: 'T', flags: {}, at: 'a_heart', silver: 0, status: true, mem: {} } });
      ow.finish('e_fell'); ow.D.skip(); for (let i = 0; i < 20; i++) ow.D.advance();
      return ow.S.mem.oldroot && ow.S.lives.length === 1 && ow.S.lives[0].ending === 'e_fell' && ow.S.life === null; }
    finally { ow.S = JSON.parse(keep); }
  });
  check('a death keeps only what death teaches', () => ENDINGS.e_death_tide.death && ENDINGS.e_death_tide.keep.join() === 'tide');
  check('saves are validated: another game\'s save is refused', () => Arcade.validators['otherworld-save-v1']({ lives: [], mem: {} }) && !Arcade.validators['otherworld-save-v1']({ team: [] }));

  // T35: exercise every memory combination, every gift and hungry/frightened alternatives, not only the happy route.
  const keys = Object.keys(MEMORIES);
  for (let mask = 0; mask < (1 << keys.length); mask++) {
    const mem = Object.fromEntries(keys.filter((k, i) => mask & (1 << i)).map(k => [k, true]));
    for (const gift of Object.keys(GIFTS.asterhold)) for (const town of [
      { day: 1, food: 4, fear: 1 }, { day: 1, food: 0, fear: 6 }, { day: 2, food: 6, fear: 0 }, { day: 3, food: 0, fear: 6 }
    ]) {
      const r = explore('asterhold', gift, mem, town);
      check('Lanthorn paths: ' + gift + ', memories ' + mask + ', town ' + JSON.stringify(town), () => {
        if (r.problems.length) throw Error(r.problems.slice(0, 3).join('; ')); return r.endings.size > 0;
      });
    }
  }
  const fixture = (gift = 'appraisal', town) => ow.prepareLife({ world: 'asterhold', gift, name: 'Test', flags: {},
    at: 'a_market', silver: 6, mem: {}, status: true, ...(town ? { town } : {}) });
  const withLife = fn => { const old = ow.S; try { ow.S = { ...fresh(), life: fixture() }; return fn(ow.S.life); } finally { ow.S = old; } };
  check('every conditional choice has an authored reason', () => Object.values(NODES).every(n => (n.choices || []).every(c => !c.need || typeof c.why === 'string' || typeof c.why === 'function')));
  check('locked options remain in their original order, rather than disappearing', () => withLife(l => {
    l.gift = 'pocket'; return ow.choicesOf(NODES.a_alone).length === 3 && !ow.choiceReady(NODES.a_alone.choices[0]) && !ow.choiceReady(NODES.a_alone.choices[1]);
  }));
  check("Appraisal closes Ressa's private door but keeps bread and labor available", () => withLife(l => {
    ow.run('a_market'); ow.D.skip();
    const buttons = [...ow.D.el.querySelectorAll('.dlg-choices button')];
    return l.flags.readRessa && buttons.length === 4 && buttons[1].disabled && !buttons[0].disabled && !buttons[2].disabled && /felt you reading/.test(buttons[1].textContent);
  }));
  check('neither a direct choice nor a numbered key can pay or advance a locked option', () => withLife(l => {
    ow.run('a_market'); ow.D.skip(); const before = JSON.stringify(l);
    ow.D.choose(1); document.dispatchEvent(new KeyboardEvent('keydown', {key:'2', bubbles:true}));
    return JSON.stringify(l) === before && l.at === 'a_market' && !l.flags.hearth;
  }));
  check('a disabled native button cannot select its story', () => withLife(l => {
    ow.run('a_market'); ow.D.skip(); const before = JSON.stringify(l); ow.D.el.querySelectorAll('.dlg-choices button')[1].click(); return JSON.stringify(l) === before;
  }));
  check('a forged choice is rechecked against the current purse', () => withLife(l => {
    ow.run('a_market'); ow.D.skip(); l.silver = 0; const before = JSON.stringify(l); ow.D.choose(2); return JSON.stringify(l) === before;
  }));
  check('Pocket Space: accepting is paid once and diverts relief flour', () => withLife(l => {
    l.gift = 'pocket'; ow.run('a_pocket_job'); ow.D.skip(); ow.D.choose(0); ow.D.skip();
    return l.flags.crate && l.silver === 10 && l.town.food === 1 && l.town.fear === 4;
  }));
  check('Pocket Space: refusal pays the promised cart cost and preserves relief flour', () => withLife(l => {
    l.gift = 'pocket'; ow.run('a_pocket_job'); ow.D.skip(); ow.D.choose(1); ow.D.skip();
    return l.flags.refusedCrate && !l.flags.crate && l.silver === 3 && l.town.food === 3;
  }));
  check('Pocket Space: no silver still has a refusal with a time cost', () => withLife(l => {
    l.gift = 'pocket'; l.silver = 0; ow.run('a_pocket_job'); ow.D.skip();
    const buttons = [...ow.D.el.querySelectorAll('.dlg-choices button')];
    if (!buttons[1].disabled || buttons[2].disabled) return false; ow.D.choose(2); ow.D.skip();
    return l.flags.delayed && l.flags.refusedCrate && l.town.day === 2 && l.silver === 0 && l.town.food === 2 && l.town.fear === 4;
  }));
  check('the crate decision can be repaired, without another forced permanent penalty', () => withLife(l => {
    l.gift = 'pocket'; l.flags.crate = true; l.silver = 10; ow.run('a_return_market'); ow.D.skip(); ow.D.choose(3);
    return !l.flags.crate && l.flags.mendedCrate && l.silver === 6 && l.town.food === 4;
  }));
  check('Sword Saint explicitly cannot choose the gentle ways at the heart', () => withLife(l => {
    l.gift = 'sword'; l.flags.mira = true; l.mem.oldroot = true;
    return NODES.a_heart.choices.slice(1).every(c => !ow.choiceReady(c) && /will not let you/.test(c.why(l))) && ow.choiceReady(NODES.a_heart.choices[0]);
  }));
  check('each new dawn consumes food and raises fear exactly once', () => {
    const l = fixture(); ow.townDay(l, 3); const before = JSON.stringify(l.town); ow.townDay(l, 3); ow.townDay(l, 1);
    return l.town.day === 3 && l.town.food === 2 && l.town.fear === 5 && JSON.stringify(l.town) === before;
  });
  check('prices respond to food and fear, not elapsed reading time', () => {
    const normal = fixture(), hungry = fixture('pocket', {day:2, food:1, fear:1}), afraid = fixture('pocket', {day:2, food:5, fear:6});
    return ow.breadPrice(normal) === 2 && ow.breadPrice(hungry) === 4 && ow.breadPrice(afraid) === 3;
  });
  check('bread uses the displayed current price and changes the town', () => withLife(l => {
    l.town = {day:2, food:1, fear:4}; ow.run('a_return_market'); ow.D.skip();
    if (!ow.D.el.querySelector('.dlg-choices button').textContent.includes('4 silver')) return false;
    ow.D.choose(0); return l.silver === 2 && l.town.food === 2 && l.town.fear === 4;
  }));
  check('help responds to hunger and fear; the well remains a free way to improve things', () => withLife(l => {
    l.gift = 'sword'; l.town = {day:2, food:0, fear:6}; ow.run('a_return_market'); ow.D.skip();
    if (ow.choiceReady(NODES.a_return_market.choices[2]) || !ow.choiceReady(NODES.a_return_market.choices[1])) return false;
    ow.D.choose(1); return l.flags.reassured && l.town.food === 0 && l.town.fear === 5;
  }));
  check('a fed and reassured town can rally neighbors; Appraisal and diverted flour change who helps', () => {
    const l = fixture('sword'); if (!NODES.a_return_market.choices[2].need(l)) return false;
    l.flags.crate = true; if (NODES.a_return_market.choices[2].need(l)) return false;
    l.flags.crate = false; l.flags.readRessa = true; return !NODES.a_return_market.choices[2].need(l);
  });
  check('town scene shows fewer stalls, more shutters and a longer well queue when struggling', () => {
    const calm = ow.townView(fixture('pocket', {day:2, food:6, fear:0})), struggling = ow.townView(fixture('pocket', {day:3, food:0, fear:6}));
    return struggling.stalls < calm.stalls && struggling.shutters > calm.shutters && struggling.queue > calm.queue;
  });
  check('people speak differently when food or fear change; no raw meters in their lines', () => withLife(l => {
    l.town = {day:3, food:0, fear:6}; const poor = JSON.stringify(ow.linesOf(NODES.a_council));
    l.town = {day:3, food:6, fear:0}; const calm = JSON.stringify(ow.linesOf(NODES.a_council));
    return poor !== calm && /shutters/.test(poor) && /bread and water/.test(calm) && !/food:|fear:|mood|cooldown|XP/.test(poor + calm);
  }));
  check('every soul memory has a distinct Archivist line; none is invented for an empty soul', () => {
    const lines = ow.archivistMemories(Object.fromEntries(keys.map(k => [k,true])));
    return lines.length === keys.length && new Set(lines.map(l => l[1])).size === keys.length && !ow.archivistMemories({}).length;
  });
  check('node effects do not repeat when resuming registration or the council', () => withLife(l => {
    ow.run('a_guild'); const silver = l.silver; ow.run('a_guild'); if (l.silver !== silver) return false;
    ow.run('a_council'); const before = JSON.stringify(l); ow.run('a_council'); return JSON.stringify(l) === before;
  }));
  check('save/reload preserves paid decisions and exact town state', () => withLife(l => {
    l.gift = 'pocket'; ow.run('a_pocket_job'); ow.D.skip(); ow.D.choose(1); ow.D.skip(); ow.save(); const before = JSON.stringify(ow.S.life);
    ow.S = fresh(); ow.load(); ow.run(ow.S.life.at); return JSON.stringify(ow.S.life) === before;
  }));
  check('legacy active lives resume with sensible defaults and no repeated silver reward', () => withLife(l => {
    delete l.town; delete l.entered; l.at = 'a_guild'; l.silver = 17; l.flags.mira = true; l.mem.seed = true;
    ow.save(); ow.S = fresh(); ow.load(); ow.run('a_guild');
    return ow.S.life.silver === 17 && ow.S.life.flags.mira && ow.S.life.mem.seed && ow.S.life.town.day === 1;
  }));
  check('legacy later scenes start on their authored day without erasing choices', () => {
    const l = fixture(); delete l.town; delete l.entered; l.at = 'a_heart'; l.flags.named = true; ow.prepareLife(l, true);
    return l.town.day === 3 && l.entered.a_heart && l.flags.named;
  });
  check('an ending in progress reloads its epilogue rather than allowing another decision', () => withLife(l => {
    ow.finish('e_lantern'); ow.save(); ow.S = fresh(); ow.load(); const resumed = ow.S.life;
    if (resumed.ending !== 'e_lantern') return false;
    ow.finish(resumed.ending); ow.D.skip(); return ow.S.life === null && ow.S.lives.length === 1 && ow.S.mem.lantern;
  }));
  check('a stale portrait callback cannot mutate a replacement life', () => withLife(l => {
    ow.run('a_market'); const replacement = fixture('pocket'); ow.S.life = replacement; const before = JSON.stringify(replacement); ow.D.choose(0);
    return JSON.stringify(replacement) === before;
  }));
  return out;
}
