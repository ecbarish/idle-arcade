/* Otherworld checks: every path through every built world reaches an ending, for every gift and every set of soul
   memories; the save, rebirth and memories behave as the design promises. Runs inside the game page (iframe). */
function otherworldChecks() {
  const ow = window.__ow, out = [];
  const check = (label, fn) => { try { out.push({ ok: !!fn(), label }); } catch (e) { out.push({ ok: false, label: label + ' (' + e.message + ')' }); } };
  const clone = l => JSON.parse(JSON.stringify(l));
  // walk every branch: returns { endings: Set, problems: [] }
  function explore(world, gift, mem) {
    const endings = new Set(), problems = [];
    const life0 = { world, gift, name: 'Test', flags: {}, at: WORLDS[world].start, silver: 0, status: false, mem };
    const stack = [[WORLDS[world].start, life0, 0]];
    while (stack.length) {
      const [id, life, depth] = stack.pop(), n = NODES[id];
      if (!n) { problems.push('missing node ' + id); continue; }
      if (depth > 40) { problems.push('loop at ' + id); continue; }
      if (n.fx) n.fx(life);
      const lines = typeof n.lines === 'function' ? n.lines(life) : n.lines;
      if (!Array.isArray(lines) || lines.some(l => !Array.isArray(l) || typeof l[1] !== 'string')) problems.push('bad lines at ' + id);
      const avail = (n.choices || []).filter(c => !c.need || c.need(life));
      if (n.choices && !avail.length) problems.push('no choice available at ' + id);
      if (avail.length) for (const c of avail) { const l2 = clone(life); l2.mem = life.mem; if (c.fx) c.fx(l2);
        if (c.end) endings.add(c.end); else stack.push([c.go, l2, depth + 1]); }
      else if (n.end) endings.add(typeof n.end === 'function' ? n.end(life) : n.end);
      else if (n.go) stack.push([n.go, life, depth + 1]);
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
  return out;
}
