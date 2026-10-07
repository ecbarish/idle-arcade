'use strict';
/* Dialogue scenes: a speaker portrait, a name and typewriter text over the scene, drawn by the shared scene system
   (shared/dialogue.js, also used by Realmbound) in Wildbond's colours. talk(lines, done, opts) plays [who, text]
   lines (CAST in 00-data.js and 11-maps.js; 'who:mood' for happy, sad, surprised or angry faces); opts.choices
   ends the scene with buttons and done(choice) gets the one picked. The world pauses while a scene plays; with
   Auto-explore on, lines advance by themselves so idle play never stalls. */
let TALK = null;
const DLG = Dialogue.create({
  host: $('.scene'), theme: 'wildbond',
  get: () => TALK, set: s => { TALK = s; },
  cast: who => CAST[who] || null,
  creature: (c, id) => { const s = SPECIES[id]; c.fillStyle = ELEMENTS[s.el] ? ELEMENTS[s.el].col + '55' : '#ddd'; c.fillRect(0, 0, 64, 64);
    art().creature(c, 26, 56, s.big ? 2 : 2.4, s, true, 0, {}); },
  creatureName: id => SPECIES[id].name,
  ctx: c => eraCtx(c),
  fill: t => fillText(t),
  blip: who => sfx('blip', who),
  auto: () => S.auto,
  onStart: () => { panelKey = ''; },
  onEnd: () => { panelKey = ''; if (S.started) { renderAll(); save(); } }
});
const talkEl = DLG.el;
function fillText(t) {
  return t.replace(/\{name\}/g, S.name).replace(/\{starter\}/g, S.starter ? SPECIES[S.starter].name : 'your partner')
    .replace(/\{rival\}/g, S.rivalStarter ? SPECIES[S.rivalStarter].name : 'a partner');
}
function talk(lines, done, opts) { DLG.play(lines, done ? (choice => done(choice)) : null, opts); }
function advanceTalk() { DLG.advance(); }
function skipTalk() { DLG.skip(); }
