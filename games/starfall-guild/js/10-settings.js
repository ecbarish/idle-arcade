'use strict';
/* Starfall Guild's rows in the shared Settings panel (L1, shared/settings.js adds text size and motion for every game). */
Settings.create({ mount: document.querySelector('#sndBtn').parentNode, before: '.feedback-container', btnClass: 'btn sm2', rows: [
  { label: 'Sound', options: [[0, 'Off'], [1, 'Effects'], [2, 'Effects and music']], get: () => S.snd || 0, set: v => { for (let i = 0; i < 3 && (S.snd || 0) !== v; i++) SND.cycle(); save(); } }
] });
