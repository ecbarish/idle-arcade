'use strict';
/* Wildbond's rows in the shared Settings panel (L1, shared/settings.js adds text size and motion for every game). */
const SOUND_CHOICES = [[0, 'Off'], [1, 'Effects'], [2, 'Effects and music']];
Settings.create({ mount: '.chips', before: '.feedback-container', btnClass: 'snd', rows: [
  { label: 'Battle style', options: [['turn', 'Turn-based'], ['active', 'Active (real time)']], get: () => S.battleStyle || 'active', set: v => { S.battleStyle = v; save(); },
    note: "Turn-based: the battle pauses on your creature's turn and you choose its move. Active: they fight on their own and you steer with commands." },
  { label: 'Sound', options: SOUND_CHOICES, get: () => S.snd || 0, set: v => { for (let i = 0; i < 3 && (S.snd || 0) !== v; i++) SND.cycle(); save(); } },
  { label: 'Graphics', options: [['high', 'High'], ['low', 'Low (faster)']], get: () => WLT.quality(), set: v => { S.gfx = v; save(); },
    note: 'High adds soft shadows, bloom and light shafts in the lit art styles. Low is picked for slower devices.' },
  { label: 'View distance', options: Object.keys(VIEWS).map(k => [k, VIEWS[k][0]]), get: () => viewKey(),
    set: v => { S.view = v; if (typeof DIO !== 'undefined') DIO.dist = 16 * viewMult(); renderViewBtn(); save(); }, note: 'How much of the world you see while walking (also the V key).' }
] });
