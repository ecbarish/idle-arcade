'use strict';
/* Wildbond content data. Add species, moves and biomes here; no logic lives in this file. */

const LEVEL_CAP = 20;

/* Element wheel: each element is strong against the ones listed. */
const ELEMENTS = {
  Ember: { col: '#ff7a3a', beats: ['Grove', 'Gale'] },
  Tide: { col: '#3a9bff', beats: ['Ember', 'Stone'] },
  Grove: { col: '#4fc35a', beats: ['Tide', 'Stone'] },
  Stone: { col: '#b8946a', beats: ['Ember', 'Gale'] },
  Gale: { col: '#a8e0ff', beats: ['Grove', 'Shade'] },
  Shade: { col: '#8a5ad0', beats: ['Radiant', 'Gale'] },
  Radiant: { col: '#ffe36a', beats: ['Shade'] }
};

/* kind: hit (one target), aoe (all enemies), dot (damage over time), buff (allies +25% damage),
   haste (allies act faster), guard (allies take 40% less), heal (lowest ally), slow (target acts slower).
   spec: uses Wits vs Spirit instead of Power vs Guard. cd: seconds before it can be used again. */
const MOVES = {
  bite: { name: 'Bite', el: null, pow: 40, kind: 'hit', cd: 0 },
  scratch: { name: 'Scratch', el: null, pow: 40, kind: 'hit', cd: 0 },
  charge: { name: 'Charge', el: null, pow: 55, kind: 'hit', cd: 4 },
  tailWhip: { name: 'Tail Whip', el: null, pow: 38, kind: 'hit', cd: 0 },
  peck: { name: 'Peck', el: 'Gale', pow: 38, kind: 'hit', cd: 0 },
  emberSnap: { name: 'Ember Snap', el: 'Ember', pow: 55, kind: 'hit', spec: 1, cd: 3 },
  flameRush: { name: 'Flame Rush', el: 'Ember', pow: 85, kind: 'hit', cd: 7 },
  bubbleJet: { name: 'Bubble Jet', el: 'Tide', pow: 55, kind: 'hit', spec: 1, cd: 3 },
  tidePulse: { name: 'Tide Pulse', el: 'Tide', pow: 50, kind: 'aoe', spec: 1, cd: 8 },
  vineLash: { name: 'Vine Lash', el: 'Grove', pow: 55, kind: 'hit', cd: 3 },
  thornQuake: { name: 'Thorn Quake', el: 'Grove', pow: 50, kind: 'aoe', cd: 8 },
  gust: { name: 'Gust', el: 'Gale', pow: 55, kind: 'hit', spec: 1, cd: 3 },
  rockToss: { name: 'Rock Toss', el: 'Stone', pow: 62, kind: 'hit', cd: 4 },
  shadowSting: { name: 'Shadow Sting', el: 'Shade', pow: 30, kind: 'dot', spec: 1, cd: 6 },
  spark: { name: 'Spark', el: 'Radiant', pow: 50, kind: 'hit', spec: 1, cd: 2 },
  radiance: { name: 'Radiance', el: 'Radiant', pow: 55, kind: 'aoe', spec: 1, cd: 8 },
  howl: { name: 'Howl', kind: 'buff', cd: 14 },
  tailwind: { name: 'Tailwind', kind: 'haste', cd: 14 },
  mistVeil: { name: 'Mist Veil', kind: 'guard', cd: 12 },
  harden: { name: 'Harden', kind: 'guard', cd: 12 },
  webSnare: { name: 'Web Snare', kind: 'slow', cd: 10 },
  regrowth: { name: 'Regrowth', kind: 'heal', cd: 10 }
};

/* base stats: hp, pow (power), grd (guard), spd (speed), wit (wits), spi (spirit).
   learn: [level, move]. evo: evolves into another species at a level. */
const SPECIES = {
  cindercub: { name: 'Cindercub', fam: 'wolf', el: 'Ember', col: '#d8642e', base: { hp: 45, pow: 60, grd: 40, spd: 62, wit: 55, spi: 45 },
    learn: [[1, 'bite'], [1, 'emberSnap'], [6, 'howl'], [11, 'flameRush']], evo: { at: 14, to: 'blazefang' },
    dex: 'A wolf pup with smoldering fur. It sleeps curled around warm stones.' },
  blazefang: { name: 'Blazefang', fam: 'wolf', el: 'Ember', col: '#e8441e', big: 1, base: { hp: 65, pow: 88, grd: 58, spd: 90, wit: 78, spi: 60 },
    learn: [[1, 'bite'], [1, 'emberSnap'], [6, 'howl'], [11, 'flameRush']], dex: 'Its mane burns brighter the more it trusts its tamer.' },
  ripplet: { name: 'Ripplet', fam: 'lizard', el: 'Tide', col: '#3a8fd8', base: { hp: 50, pow: 48, grd: 55, spd: 45, wit: 60, spi: 55 },
    learn: [[1, 'tailWhip'], [1, 'bubbleJet'], [6, 'mistVeil'], [11, 'tidePulse']], evo: { at: 14, to: 'tidewyrm' },
    dex: 'A curious river lizard that blows bubbles when it is happy.' },
  tidewyrm: { name: 'Tidewyrm', fam: 'croc', el: 'Tide', col: '#1f6fbf', big: 1, base: { hp: 75, pow: 70, grd: 80, spd: 62, wit: 85, spi: 78 },
    learn: [[1, 'tailWhip'], [1, 'bubbleJet'], [6, 'mistVeil'], [11, 'tidePulse']], dex: 'It rides the river currents and can call up a wave at will.' },
  mosshog: { name: 'Mosshog', fam: 'boar', el: 'Grove', col: '#5d9a3e', base: { hp: 60, pow: 58, grd: 58, spd: 38, wit: 42, spi: 50 },
    learn: [[1, 'charge'], [1, 'vineLash'], [6, 'regrowth'], [11, 'thornQuake']], evo: { at: 14, to: 'thornback' },
    dex: 'Moss grows on its back. Birds nest in it, and it lets them.' },
  thornback: { name: 'Thornback', fam: 'boar', el: 'Grove', col: '#3f7a2a', big: 1, base: { hp: 88, pow: 85, grd: 85, spd: 52, wit: 60, spi: 70 },
    learn: [[1, 'charge'], [1, 'vineLash'], [6, 'regrowth'], [11, 'thornQuake']], dex: 'Its thorns can split a fallen log. It guards its herd fiercely.' },
  glimmerwing: { name: 'Glimmerwing', fam: 'bird', el: 'Gale', col: '#9fd6f0', base: { hp: 40, pow: 50, grd: 38, spd: 72, wit: 52, spi: 42 },
    learn: [[1, 'peck'], [4, 'gust'], [9, 'tailwind']], dex: 'Its feathers catch the light like glass.' },
  pebblepaw: { name: 'Pebblepaw', fam: 'cat', el: 'Stone', col: '#9a8a74', base: { hp: 48, pow: 60, grd: 62, spd: 48, wit: 35, spi: 45 },
    learn: [[1, 'scratch'], [5, 'rockToss'], [10, 'harden']], dex: 'It sharpens its claws on granite and naps in the sun.' },
  duskweaver: { name: 'Duskweaver', fam: 'spider', el: 'Shade', col: '#5a4a7a', base: { hp: 42, pow: 45, grd: 45, spd: 55, wit: 62, spi: 50 },
    learn: [[1, 'bite'], [5, 'shadowSting'], [10, 'webSnare']], dex: 'It weaves webs only at dusk, and they vanish by morning.' },
  bogsnap: { name: 'Bogsnap', fam: 'croc', el: 'Tide', col: '#4a6a4a', base: { hp: 58, pow: 62, grd: 55, spd: 35, wit: 40, spi: 48 },
    learn: [[1, 'bite'], [6, 'bubbleJet']], dex: 'It waits in still water for hours without moving.' },
  emberling: { name: 'Emberling', fam: 'lizard', el: 'Ember', col: '#e06a2a', base: { hp: 40, pow: 48, grd: 40, spd: 58, wit: 60, spi: 45 },
    learn: [[1, 'scratch'], [4, 'emberSnap'], [9, 'flameRush']], dex: 'It basks on hot rocks and glows faintly at night.' },
  gnawhound: { name: 'Gnawhound', fam: 'hyena', el: 'Shade', col: '#6a5a4a', base: { hp: 46, pow: 58, grd: 40, spd: 60, wit: 40, spi: 40 },
    learn: [[1, 'bite'], [7, 'shadowSting']], dex: 'Packs of them laugh at night to frighten travelers.' },
  sunspark: { name: 'Sunspark', fam: 'sprite', el: 'Radiant', col: '#ffe36a', base: { hp: 38, pow: 35, grd: 40, spd: 68, wit: 72, spi: 65 },
    learn: [[1, 'spark'], [6, 'regrowth'], [10, 'radiance']], dex: 'A rare spark of living light. Seeing one is said to be good luck.' },
  galefoal: { name: 'Galefoal', fam: 'horse', el: 'Gale', col: '#cfd8e0', base: { hp: 55, pow: 55, grd: 45, spd: 80, wit: 40, spi: 45 },
    learn: [[1, 'charge'], [6, 'gust']], dex: 'A wild foal that runs with the wind. Born to race.' },
  elderhorn: { name: 'Elderhorn', fam: 'horse', el: 'Grove', col: '#6a8a4a', antlers: 1, big: 1, unique: 1,
    base: { hp: 95, pow: 90, grd: 95, spd: 70, wit: 80, spi: 95 },
    learn: [[1, 'charge'], [1, 'vineLash'], [1, 'regrowth'], [1, 'thornQuake']], dex: 'The ancient guardian of Thornwood. Few have seen it and fewer have earned its trust.' },
  brineskit: { name: 'Brineskit', fam: 'lizard', el: 'Tide', col: '#569eaa',
    base: { hp: 48, pow: 42, grd: 48, spd: 58, wit: 60, spi: 44 },
    learn: [[1, 'tailWhip'], [1, 'bubbleJet'], [8, 'mistVeil'], [16, 'tidePulse']], evo: { at: 16, to: 'shoalcrest' },
    dex: 'It skims shallow tide pools on its wide toes and shelters beneath empty shells.' },
  shoalcrest: { name: 'Shoalcrest', fam: 'croc', el: 'Tide', col: '#307e96', big: 1,
    base: { hp: 75, pow: 62, grd: 72, spd: 58, wit: 85, spi: 68 },
    learn: [[1, 'tailWhip'], [1, 'bubbleJet'], [8, 'mistVeil'], [16, 'tidePulse']],
    dex: 'Its ridged back parts the surf into calm channels where smaller creatures can cross.' },
  dunepounce: { name: 'Dunepounce', fam: 'cat', el: 'Stone', col: '#c5aa75',
    base: { hp: 46, pow: 62, grd: 60, spd: 57, wit: 32, spi: 43 },
    learn: [[1, 'scratch'], [6, 'rockToss'], [12, 'harden'], [16, 'charge']],
    dex: 'It buries its stone-tipped paws in warm dunes before springing at shadows on the sand.' },
  reedtusk: { name: 'Reedtusk', fam: 'boar', el: 'Grove', col: '#829956',
    base: { hp: 65, pow: 58, grd: 62, spd: 30, wit: 38, spi: 47 },
    learn: [[1, 'charge'], [5, 'vineLash'], [12, 'regrowth']],
    dex: 'It combs the marsh with curved tusks, leaving narrow trails that fill with fresh reeds.' },
  wrackjaw: { name: 'Wrackjaw', fam: 'hyena', el: 'Stone', col: '#94877b',
    base: { hp: 50, pow: 65, grd: 48, spd: 62, wit: 32, spi: 43 },
    learn: [[1, 'bite'], [6, 'rockToss'], [12, 'howl']],
    dex: 'Its rattling laugh echoes through driftwood piles as it cracks shellfish with pebble-hard jaws.' },
  kiteskirl: { name: 'Kiteskirl', fam: 'bird', el: 'Gale', col: '#adc9da',
    base: { hp: 40, pow: 45, grd: 36, spd: 76, wit: 58, spi: 45 },
    learn: [[1, 'peck'], [5, 'gust'], [12, 'tailwind']],
    dex: 'It rides the sea breeze without flapping and whistles whenever a storm approaches.' },
  spindriftfoal: { name: 'Spindriftfoal', fam: 'horse', el: 'Gale', col: '#d2d9cb',
    base: { hp: 52, pow: 48, grd: 40, spd: 78, wit: 38, spi: 44 },
    learn: [[1, 'charge'], [6, 'gust'], [14, 'tailwind']],
    dex: 'It races along the waterline, scattering ribbons of sea spray with every stride.' },
  foamglint: { name: 'Foamglint', fam: 'sprite', el: 'Tide', col: '#a0dfcf',
    base: { hp: 36, pow: 30, grd: 40, spd: 64, wit: 72, spi: 58 },
    learn: [[1, 'bubbleJet'], [8, 'mistVeil'], [16, 'tidePulse']],
    dex: 'This elusive fleck of living foam glows only where moonlit waves meet the marsh.' },
  breakwatermane: { name: 'Breakwatermane', fam: 'wolf', el: 'Tide', col: '#497a9e', unique: 1, big: 1,
    base: { hp: 95, pow: 90, grd: 85, spd: 80, wit: 85, spi: 90 },
    learn: [[1, 'bite'], [1, 'bubbleJet'], [10, 'howl'], [16, 'tidePulse']],
    dex: 'The coast falls silent when this ancient wolf walks the breakers, its mane carrying the rhythm of every tide.' }
};
const STARTERS = ['cindercub', 'ripplet', 'mosshog'];

const BIOMES = {
  thornwood: { name: 'Thornwood', lv: [2, 9], sky: ['#9fd0f0', '#e0f0d0'], hill: '#4f7a3a', ground: '#6a9a48',
    wild: [['glimmerwing', 22], ['pebblepaw', 20], ['duskweaver', 16], ['bogsnap', 14], ['emberling', 12], ['gnawhound', 12], ['galefoal', 4], ['sunspark', 3]] },
  saltmarsh: { name: 'Saltmarsh Coast', lv: [10, 18], req: 'thorn', sky: ['#7dbbd8', '#d1e9ed'], hill: '#a6ae75', ground: '#7f9b6c',
    wild: [['brineskit', 24], ['dunepounce', 20], ['reedtusk', 16], ['wrackjaw', 14], ['kiteskirl', 18], ['spindriftfoal', 8], ['foamglint', 3]] }
};

/* Story beats trigger on the number of times you've explored. */
const RIVAL = { name: 'Wren', col: '#d85a8a' };
const STORY = [
  { at: 12, id: 'rival2', title: 'Wren again', text: "Wren cuts across the trail. \"Still at it? My team's been training. Let's see who's grown more!\"",
    team: [['glimmerwing', 6], ['$rival', 7]] },
  { at: 20, id: 'elder', title: 'Something moves in the old trees', text: 'The forest goes quiet. Between the oldest trees stands a huge stag of moss and bark: Elderhorn, the guardian of Thornwood. It watches you.',
    wild: ['elderhorn', 11, 4] },
  { at: 26, id: 'warden', title: 'The Thornwood Warden', text: 'Warden Isolde waits at the forest gate. "Every tamer who wants to go further proves themselves here first. Show me your bond."',
    trainer: 'Warden Isolde', team: [['pebblepaw', 10], ['bogsnap', 11], ['thornback', 12]] }
];
const COUNTER = { cindercub: 'ripplet', ripplet: 'mosshog', mosshog: 'cindercub' };

/* Art eras: the world's look evolves as you progress. */
const ERAS = [
  { id: 'pixel', name: 'Pixel', unlock: 'From the start' },
  { id: 'bit16', name: '16-bit', unlock: 'Earn the Thorn Badge' },
  { id: 'hd', name: 'HD', unlock: 'A later region', soon: true },
  { id: '3d', name: '3D', unlock: 'Become Champion', soon: true }
];
