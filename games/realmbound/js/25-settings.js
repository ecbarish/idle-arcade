'use strict';
/* Realmbound's rows in the shared Settings panel (L1, shared/settings.js adds text size and motion for every game). */
Settings.create({ mount: '.brand', before: '.version-label', btnClass: 'btn sm alt', rows: [
  { label: 'Sound', options: [[0, 'Off'], [1, 'Effects'], [2, 'Effects and music']], get: () => S.snd || 0, set: v => { for (let i = 0; i < 3 && (S.snd || 0) !== v; i++) SND.cycle(); save(); } },
  { label: 'Graphics', options: [['high', 'High'], ['low', 'Low (faster)']], get: () => gfxQuality(), set: v => { S.gfx = v; renderGfxBtn(); save(); },
    note: 'High adds soft silhouette shadows and bloom. Low is picked for slower devices.' }
] });
