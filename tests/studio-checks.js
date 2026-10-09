'use strict';
/* Studio checks (Lane C). The text browser: studio/text-browser.js and its section in studio.html. */
async function studioChecks() {
  const checks = [], T = window.StudioText;
  const check = async (label, test) => { try { if (!(await test())) throw Error('Expected condition was false.'); checks.push({ ok: true, label }); } catch (e) { checks.push({ ok: false, label: label + ' — ' + e.message }); } };
  const texts = list => list.map(x => x.text);
  const snapshot = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return JSON.stringify(Object.entries(o).sort()); };

  // ---- reading code: string literals and their lines
  const js = T.jsStrings("const a = 'Hello there, tamer.'; // 'not this'\n/* 'nor this' */ const b = x / 2 / y, r = /it's \\/ a 'regex'/g;\nconst c = `Hi ${name + '}'}, welcome`;\nconst d = 'It\\'s \"fine\"'; return /'quoted' in regex/.test(s);");
  await check('Code reading finds quoted text and skips comments', () => texts(js).includes('Hello there, tamer.') && !texts(js).some(t => /not this|nor this/.test(t)));
  await check('Code reading skips regular expressions but not division', () => !texts(js).some(t => /regex|quoted/.test(t)) && texts(js).includes("It's \"fine\""));
  await check('Template text keeps its words and marks the gaps', () => texts(js).includes('Hi \u2026, welcome'));
  await check('Each string knows its line', () => js.find(x => x.text === 'Hello there, tamer.').line === 1 && js.find(x => x.text.startsWith('Hi')).line === 3 && js.find(x => x.text.startsWith('It')).line === 4);
  const gd = T.gdStrings('# "a comment"\nvar a = "Is this the guild?"\nvar b = """Two\nlines"""\nvar c = \'Tea\\\'s ready.\' # "trailing"');
  await check('Godot script reading skips # comments and reads all three quote styles', () => texts(gd).join('|') === 'Is this the guild?|Two\nlines|Tea\'s ready.');
  await check('Godot script strings know their lines', () => gd[0].line === 2 && gd[1].line === 3 && gd[2].line === 5);
  await check('Top-level data names are found, including a second one on the same line', () => { const n = T.declaredNames("const SPECIES = {\n};\nconst CAP = [1], MOVES = {};\nlet x = 1;\nfunction f(){ const inner = {}; }"); return n.includes('SPECIES') && n.includes('CAP') && n.includes('MOVES') && !n.includes('inner'); });

  // ---- what counts as player text, and what kind it is
  const yes = [['A wolf pup with smoldering fur.', 'dex', false], ['Cindercub', 'name', false], ['Thorn Badge', 'name', false], ['Is this the guild? I heard there is work.', '', true]];
  const no = [['#d8642e', 'col', false], ['flameRush', 'move', false], ['wild_bond', 'id', false], ['color: #fff; padding: 4px', '', true], ['games/wildbond/js/00-data.js', '', false],
    ['..##..TT..', 'row', false], ['ember', 'el', false], ['Ok', '', true], ['(a, b) => a + b', '', true], ['res://assets/music/thornwood.ogg', '', true]];
  await check('Sentences, names and titles count as player text', () => yes.every(([s, k, c]) => T.isPlayerText(s, k, c)));
  await check('Colours, ids, file paths, map rows and code do not', () => no.every(([s, k, c]) => !T.isPlayerText(s, k, c)));
  await check('Kinds: creature names, items, quests, descriptions, dialogue and code', () =>
    T.kindOf('SPECIES.cindercub.name', 'name') === 'Creature name' && T.kindOf('SPECIES.cindercub.dex', 'dex') === 'Description' &&
    T.kindOf('QUESTS[2].text', 'text') === 'Quest' && T.kindOf('STORY[1].lines[0][1]', '') === 'Dialogue' && T.kindOf('JUNK.beast[4]', '', false, 'Chipped Tooth') === 'Item name' &&
    T.kindOf('', '', true) === 'In code' && T.KINDS.length === 8);
  await check('Text is tidied for reading (no tags, single spaces)', () => T.tidy('Hello <b>there</b> ,  friend') === 'Hello there, friend');

  // ---- the whole index, read from the real files
  const before = snapshot(), started = Date.now();
  const index = await T.build('../');
  const secs = (Date.now() - started) / 1000;
  await check(`Reads every game (${T.SOURCES.length} sources, ${index.total} pieces of text, ${secs.toFixed(1)}s)`, () => T.SOURCES.every(g => index.perGame[g.id] > 0) && index.total > 2000);
  const least = { wildbond: 800, realmbound: 1000, 'starfall-guild': 100, otherworld: 300, 'diamond-career': 80, primordial: 40, 'wildbond-godot': 800, 'starfall-godot': 150 };
  await check('Each game gives at least the text it had on 2026-10-09 (a big drop means the reader broke)', () => Object.entries(least).every(([g, n]) => index.perGame[g] >= n) || (() => { throw Error(JSON.stringify(index.perGame)); })());
  const dex = index.entries.find(e => e.text === 'A wolf pup with smoldering fur. It sleeps curled around warm stones.');
  await check('A creature description shows both games, the file, the line and the data path', () => dex && dex.kinds.includes('Description') &&
    dex.places.some(p => p.game === 'wildbond' && p.file === 'games/wildbond/js/00-data.js' && p.line > 0 && p.path === 'SPECIES.cindercub.dex') &&
    dex.places.some(p => p.game === 'wildbond-godot' && p.file === 'wildbond-godot/data/wildbond.json' && p.path === 'SPECIES.cindercub.dex'));
  await check('A creature name is found as a creature name', () => { const e = index.entries.find(x => x.text === 'Cindercub'); return e && e.kinds.includes('Creature name'); });
  await check('Starfall village stories are read from stories.json with their paths', () => index.entries.some(e => e.places.some(p => p.file === 'starfall-godot/data/stories.json' && /^(Aki|Ren|Yuna|Kaito|Hana|Sora)\b/.test(p.path))));
  await check('Text written straight into Godot scripts is found with its line', () => index.entries.some(e => e.places.some(p => p.game === 'starfall-godot' && /\.gd$/.test(p.file) && p.line > 0)));
  await check('Realmbound item and quest text is found', () => index.entries.some(e => e.games.includes('realmbound') && e.kinds.includes('Item name')) && index.entries.some(e => e.games.includes('realmbound') && e.kinds.includes('Quest')));
  await check('Every place has a game and a file; data places have a path; code places have a line', () => index.entries.every(e => e.text && e.places.length && e.places.every(p => p.game && p.file && (p.path || p.line > 0))));
  await check('No game save or setting was changed while reading', () => snapshot() === before);
  await check('The sealed reading frames are gone afterwards', () => !document.querySelector('iframe[sandbox]'));
  await check('Search needs every word, in the text or the path, and filters by game and kind', () => {
    const a = T.search(index.entries, 'elderhorn guardian'), b = T.search(index.entries, 'SPECIES cindercub', 'wildbond-godot'), c = T.search(index.entries, '', 'starfall-godot', 'In code');
    return a.length && a.every(e => /elderhorn/i.test(e.text + e.places.map(p => p.path).join()) && /guardian/i.test(e.text)) && b.some(e => e.text === 'Cindercub') && c.length && c.every(e => e.games.includes('starfall-godot') && e.kinds.includes('In code'));
  });

  // ---- creature and quest viewers (E5): the rules flag broken data, and the real data reads clean
  const V = window.StudioViewers;
  const good = { SPECIES: { a: { name: 'Alpha', fam: 'wolf', el: 'Ember', base: { hp: 1, pow: 1, grd: 1, spd: 1, wit: 1, spi: 1 }, learn: [[1, 'bite']], evo: { at: 5, to: 'b' }, dex: 'A pup.' },
    b: { name: 'Beta', fam: 'wolf', el: 'Ember', base: { hp: 2, pow: 2, grd: 2, spd: 2, wit: 2, spi: 2 }, learn: [[1, 'bite']], dex: 'A wolf.' } },
    MOVES: { bite: { name: 'Bite', el: null, pow: 40 } }, ELEMENTS: { Ember: {} }, BIOMES: { wood: { name: 'Wood', req: 'thorn', wild: [['a', 5]] } }, BADGES: { thorn: {} }, STORY: [{ gate: 'thorn' }] };
  const flagged = r => Object.values(r).flat().filter(x => x.problems.length).map(x => x.id + ': ' + x.problems.join('; '));
  await check('Viewers: good Wildbond data has no problems', () => flagged(V.wildbond(good)).length === 0);
  const broken = JSON.parse(JSON.stringify(good)); Object.assign(broken.SPECIES.a, { fam: 'dragon', el: 'Lava', learn: [[0, 'zap']], evo: { at: 5, to: 'zzz' }, dex: '' }); broken.SPECIES.b.name = 'alpha';
  broken.BIOMES.wood.wild.push(['ghost', 3]); broken.BIOMES.wood.req = 'moon'; broken.EVOS = { b: [{ to: 'a', at: 0, place: 'mars', with: 'nobody' }] };
  const why = flagged(V.wildbond(broken)).join(' | ');
  await check('Viewers: the Wildbond test rules flag families, elements, moves, evolutions, dex, names, wild tables and badges', () =>
    ['unknown body family', 'unknown element "Lava"', "move that doesn't exist: zap", 'move zap at level 0', "evolves into a creature that doesn't exist: zzz", 'no Wilddex entry', 'same name as', "a creature that doesn't exist: ghost", 'no Warden gives', 'not an area', "raised with a creature that doesn't exist"].every(w => why.includes(w)) || (() => { throw Error(why); })());
  const rbFlags = flagged(V.realmbound({ ZONES: { vale: { name: 'Vale', mobs: [{ id: 'wolf' }] } }, QUESTS: { vale: [{ id: 'q1', name: 'A', text: 'B', mob: 'wolf' }, { id: 'q2', name: 'C', text: 'D', mob: 'bear', req: 'q9' }, { id: 'q1', name: 'E', text: 'F' }] } })).join(' | ');
  await check('Viewers: the Realmbound quest rules flag a missing target, a missing earlier quest and a repeated id', () => /"bear" doesn't live in Vale/.test(rbFlags) && /"q9", which doesn't exist/.test(rbFlags) && /used twice/.test(rbFlags) && !/^q1: .*bear/.test(rbFlags));
  const real = await V.load('../');
  await check(`Viewers: the real data loads (Wildbond ${real.wildbond.species.length} and ${real['wildbond-godot'].species.length} creatures, ${real.realmbound.quests.length} Realmbound quests)`, () =>
    real.wildbond.species.length >= 100 && real['wildbond-godot'].species.length >= real.wildbond.species.length && real.wildbond.wild.length > 50 && real['wildbond-godot'].evolutions.length > real.wildbond.evolutions.length && real.realmbound.quests.length >= 60 && real.wildbond.moves.length >= 20);
  await check('Viewers: the Godot evolutions include the new shapes (Pyremane in Emberfall, three Poolkit branches)', () => real['wildbond-godot'].evolutions.some(r => r.id === 'blazefang>pyremane' && /emberfall/.test(r.cells[3])) && real['wildbond-godot'].evolutions.filter(r => r.id.startsWith('poolkit>')).length === 3);
  await check('Viewers: the games\' current data has no problems (the same rules as the game checks)', () => { const f = Object.values(real).map(flagged).flat(); if (f.length) throw Error(f.slice(0, 5).join(' | ')); return true; });
  await check('No game save or setting was changed by the viewers', () => snapshot() === before);

  // ---- the Studio page itself
  const frame = document.createElement('iframe'); frame.src = '../studio.html'; document.querySelector('#frame').replaceChildren(frame);
  await new Promise(ok => frame.onload = ok);
  const w = frame.contentWindow, d = frame.contentDocument;
  for (let i = 0; i < 600 && !(w.__studioTextIndex && w.__studioViewers); i++) await new Promise(ok => setTimeout(ok, 100));
  await check('The Studio shows the text browser with a count for every game', () => w.__studioTextIndex && d.querySelectorAll('#tbStats span').length === T.SOURCES.length && /pieces of text/.test(d.querySelector('#tbStatus').textContent));
  const find = d.querySelector('#tbFind'); find.value = 'Elderhorn'; find.dispatchEvent(new w.Event('input'));
  await new Promise(ok => setTimeout(ok, 400));
  await check('Searching the Studio lists matches with highlighted words and where they live', () => { const items = [...d.querySelectorAll('#tbList .tb-item')];
    return items.length > 0 && items.every(x => /elderhorn/i.test(x.textContent)) && d.querySelector('#tbList mark') && /00-data\.js/.test(d.querySelector('#tbList').textContent) && d.querySelector('#tbMore').hidden; });
  const kind = d.querySelector('#tbKind'); kind.value = 'Creature name'; kind.dispatchEvent(new w.Event('change'));
  await check('The kind filter narrows the list', () => [...d.querySelectorAll('#tbList .tb-kind')].every(x => x.textContent === 'Creature name') && d.querySelectorAll('#tbList .tb-item').length >= 1);
  await check('The Studio shows the creature and quest viewers with a row per creature', () => w.__studioViewers && d.querySelectorAll('#vwTable tr').length === w.__studioViewers.wildbond.species.length + 1 && /no problems|with problems/.test(d.querySelector('#vwStatus').textContent));
  frame.remove();
  await check('Player pages do not link to the Studio', async () => { for (const p of ['../index.html', '../playtest.html']) { const t = await (await fetch(p)).text(); if (/href=["'][^"']*studio(\.html|\/)/.test(t)) return false; } return true; });
  return checks;
}
document.querySelector('#run').addEventListener('click', async () => {
  const button = document.querySelector('#run'); button.disabled = true; const summary = document.querySelector('#summary'); summary.textContent = 'Running…';
  try { const checks = await studioChecks(), fail = checks.filter(c => !c.ok);
    document.querySelector('#results').replaceChildren(...checks.map(c => { const li = document.createElement('li'); li.className = c.ok ? 'pass' : 'fail'; li.textContent = (c.ok ? 'PASS' : 'FAIL') + ' — ' + c.label; return li; }));
    summary.className = fail.length ? 'fail' : 'pass'; summary.textContent = fail.length ? 'FAIL — ' + fail.length + ' of ' + checks.length + ' failed.' : 'PASS — ' + checks.length + ' Studio checks.';
  } catch (e) { summary.className = 'fail'; summary.textContent = 'FAIL — ' + e.message; } finally { button.disabled = false; }
});
