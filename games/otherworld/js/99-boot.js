'use strict';
/* Otherworld: startup. Loads the save, then resumes your life where you were, or opens the Between. */
D = Dialogue.create({
  host: document.getElementById('stage'), theme: 'otherworld',
  get: () => sceneState, set: v => { sceneState = v; },
  cast: who => who === 'me' ? { name: S.name, skin: S.look.skin, hair: 'short', hairCol: S.look.hair, shirt: '#4a4a7a', bg: '#d8d0f0' } : CAST[who] || null,
  fill: t => String(t).replace(/\{name\}/g, (S.life && S.life.name) || S.name || 'traveller'),
  onEnd: () => save()
});
Settings.create({ mount: '#hudRight', before: '.version-label', btnClass: 'hbtn', rows: [] });
setupFeedback('Otherworld', VERSION, () => S.life ? `${WORLDS[S.life.world].name}, ${S.life.gift}, at ${S.life.at}` : 'The Between');
load();
if (S.life && NODES[S.life.at]) run(S.life.at); else { S.life = null; toBetween(null, []); }
renderHUD();
/* test hook, local dev server only */
if (location.hostname === 'localhost') window.__ow = { get S() { return S; }, set S(v) { S = v; }, run, finish, begin, choicesOf, NODES, ENDINGS, WORLDS, GIFTS, D };
