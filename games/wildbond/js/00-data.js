'use strict';
/* Wildbond content data. Add species, moves and biomes here; no logic lives in this file. */

const LEVEL_CAP = 100;
/* Badge level caps: with no badges creatures stop at 15; each badge raises the cap by 10 (up to 100).
   Soft cap (default): XP drops to a trickle above it. Hard: no XP above it. Off: only the 100 limit. */
const CAP_BASE = 15, CAP_STEP = 10, SOFT_TRICKLE = 0.05;
/* Journey length: picked with your starter, changeable at the Larkhaven inn (Journal tab).
   Auto-explore always earns a little less XP than playing yourself (AUTO_XP). */
const JOURNEY = {
  breezy: { name: 'Breezy', xp: 0.36, coins: 1.5, rare: 0.15, desc: 'A quicker story: more XP and coins. First badge in about an hour.' },
  classic: { name: 'Classic', xp: 0.13, coins: 1, rare: 0, desc: 'The intended pace. First badge in about two to three hours.' },
  long: { name: 'Long Road', xp: 0.08, coins: 0.8, rare: -0.3, desc: 'For the grind: less XP and rarer finds. Every level is earned.' }
};
const AUTO_XP = 0.8;
const BADGES = { thorn: { name: 'Thorn Badge' }, tide: { name: 'Tide Badge' }, ember: { name: 'Ember Badge' } };

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
    dex: 'The coast falls silent when this ancient wolf walks the breakers, its mane carrying the rhythm of every tide.' },
  slaglet: { name: 'Slaglet', fam: 'boar', el: 'Ember', col: '#b77748',
    base: { hp: 60, pow: 58, grd: 56, spd: 34, wit: 48, spi: 44 },
    learn: [[1, 'charge'], [1, 'emberSnap'], [9, 'harden'], [16, 'flameRush']], evo: { at: 22, to: 'kilntusk' },
    dex: 'It rolls in warm volcanic dust until its coat forms a snug crust that keeps out the mountain chill.' },
  kilntusk: { name: 'Kilntusk', fam: 'boar', el: 'Ember', col: '#965338', big: 1,
    base: { hp: 82, pow: 86, grd: 80, spd: 46, wit: 66, spi: 60 },
    learn: [[1, 'charge'], [1, 'emberSnap'], [9, 'harden'], [16, 'flameRush']],
    dex: 'Its glowing tusks loosen hardened lava so its herd can root for tender shoots beneath the stone.' },
  ashskip: { name: 'Ashskip', fam: 'lizard', el: 'Ember', col: '#d99154',
    base: { hp: 42, pow: 44, grd: 38, spd: 68, wit: 64, spi: 44 },
    learn: [[1, 'tailWhip'], [5, 'emberSnap'], [14, 'flameRush']],
    dex: 'It hops between cooling rocks and leaves tiny tail prints in the soft ash.' },
  cragskein: { name: 'Cragskein', fam: 'spider', el: 'Stone', col: '#82736d',
    base: { hp: 46, pow: 40, grd: 68, spd: 38, wit: 62, spi: 46 },
    learn: [[1, 'bite'], [6, 'webSnare'], [10, 'rockToss'], [16, 'harden']],
    dex: 'Its mineral-dusted webs bridge narrow cracks, giving smaller creatures a safe path across the crags.' },
  ventwhisk: { name: 'Ventwhisk', fam: 'cat', el: 'Ember', col: '#b55e4a',
    base: { hp: 44, pow: 60, grd: 40, spd: 68, wit: 50, spi: 38 },
    learn: [[1, 'scratch'], [6, 'emberSnap'], [12, 'howl'], [16, 'flameRush']],
    dex: 'It curls beside warm vents and fans little clouds of steam with its copper-coloured tail.' },
  thermwing: { name: 'Thermwing', fam: 'bird', el: 'Gale', col: '#baa9a0',
    base: { hp: 40, pow: 48, grd: 38, spd: 74, wit: 58, spi: 42 },
    learn: [[1, 'peck'], [6, 'gust'], [13, 'tailwind']],
    dex: 'It circles on rising warmth, calling out sheltered ledges to the creatures climbing below.' },
  screegrin: { name: 'Screegrin', fam: 'hyena', el: 'Stone', col: '#8c7760',
    base: { hp: 52, pow: 64, grd: 54, spd: 56, wit: 34, spi: 40 },
    learn: [[1, 'bite'], [5, 'rockToss'], [11, 'howl'], [16, 'harden']],
    dex: 'Its cheerful chatter carries down the slopes as it gathers smooth stones for its den.' },
  glowmote: { name: 'Glowmote', fam: 'sprite', el: 'Radiant', col: '#f4cb78',
    base: { hp: 36, pow: 30, grd: 38, spd: 62, wit: 74, spi: 60 },
    learn: [[1, 'spark'], [8, 'regrowth'], [16, 'radiance']],
    dex: 'This seldom-seen spark drifts through the steam, lighting the way home when mist covers the highlands.' },
  hearthcrown: { name: 'Hearthcrown', fam: 'horse', el: 'Ember', col: '#a66e4c', antlers: 1, unique: 1, big: 1,
    base: { hp: 95, pow: 85, grd: 90, spd: 70, wit: 90, spi: 95 },
    learn: [[1, 'charge'], [1, 'emberSnap'], [12, 'regrowth'], [16, 'flameRush']],
    dex: 'The guardian of Emberfall warms frozen springs with its ember-lit antlers so every creature can drink.' }
};
const STARTERS = ['cindercub', 'ripplet', 'mosshog'];

const BIOMES = {
  thornwood: { name: 'Thornwood', lv: [2, 12], sky: ['#9fd0f0', '#e0f0d0'], hill: '#4f7a3a', ground: '#6a9a48',
    wild: [['glimmerwing', 22], ['pebblepaw', 20], ['duskweaver', 16], ['bogsnap', 14], ['emberling', 12], ['gnawhound', 12], ['galefoal', 4], ['sunspark', 3]] },
  saltmarsh: { name: 'Saltmarsh Coast', lv: [12, 22], req: 'thorn', sky: ['#7dbbd8', '#d1e9ed'], hill: '#a6ae75', ground: '#7f9b6c',
    wild: [['brineskit', 24], ['dunepounce', 20], ['reedtusk', 16], ['wrackjaw', 14], ['kiteskirl', 18], ['spindriftfoal', 8], ['foamglint', 3]] },
  emberfall: { name: 'Emberfall Highlands', lv: [22, 32], req: 'tide', sky: ['#a6a6bf', '#efd0aa'], hill: '#81756d', ground: '#a58a68',
    wild: [['slaglet', 24], ['ashskip', 20], ['cragskein', 16], ['ventwhisk', 16], ['thermwing', 14], ['screegrin', 10], ['glowmote', 3]] }
};

const RIVAL = { name: 'Wren', col: '#d85a8a' };
/* Speakers in dialogue scenes. Portraits are drawn in 09-dialogue.js from these colors.
   hair: short | long | bun | spiky | hood | hat. A line is [who, text]; who '' = narration, '@species' = a creature. */
const CAST = {
  maren: { name: 'Keeper Maren', skin: '#d9a77c', hair: 'bun', hairCol: '#c9c3b8', shirt: '#5b8a4a', bg: '#cfe7c4', title: 'Larkhaven ranch keeper' },
  wren: { name: 'Wren', skin: '#f0c7a4', hair: 'spiky', hairCol: '#3a2230', shirt: '#d85a8a', bg: '#f6d3e1', title: 'Your rival' },
  isolde: { name: 'Warden Isolde', skin: '#b98262', hair: 'long', hairCol: '#2a3b2c', shirt: '#3d6b52', bg: '#c9dfc8', title: 'Warden of Thornwood' },
  nerys: { name: 'Warden Nerys', skin: '#8a5a3c', hair: 'hat', hairCol: '#9a948a', hatCol: '#3c5a6a', shirt: '#2f5e78', bg: '#cfe3ea', title: 'Warden of the Saltmarsh' },
  toren: { name: 'Warden Toren', skin: '#b87d59', hair: 'short', hairCol: '#ddd0bd', shirt: '#98543c', bg: '#ead0b2', title: 'Warden of Emberfall' }
};
/* Scenes that aren't tied to an explore count. */
const SCENES = {
  intro: [
    ['', 'The supply cart stops at the edge of the trees. Larkhaven is a handful of roofs, a windmill and a ranch fence that runs right up to the forest.'],
    ['maren', 'You made it! I\'m Maren. I keep the ranch here, and I\'ve paired more young tamers with their first partner than I can count.'],
    ['maren', 'Out there is Thornwood. Past it, the coast, the hills, places nobody has mapped yet. The creatures out there are wild, but not cruel. Treat them well and some will choose to walk with you.'],
    ['maren', 'That\'s the whole secret, really. Nobody owns a creature. You earn a bond, and the bond does the rest. Now, three little ones have been waiting all week to meet you.']
  ],
  rival1: [
    ['', 'The ranch gate bangs open.'],
    ['wren', 'Am I late? Maren, you said the new tamer was coming tomorrow!'],
    ['maren', 'I said today, Wren. This is Wren. Same age as you, same first day, and twice the noise.'],
    ['wren', 'Hey! So you picked {starter}? Then I\'m taking {rival}. Don\'t look at me like that, it\'s called strategy. Let\'s battle!']
  ],
  rival1Win: [
    ['wren', 'Okay. Okay! Not bad. {rival} and I were just warming up.'],
    ['maren', 'You two will push each other a long way. Now go on, Thornwood won\'t explore itself. Bring your team back here to rest whenever they need it.'],
    ['maren', 'And {name}? Watch how the wild ones move. Tire one out, toss a lure, and keep it calm. If it trusts you, it will come home with you.']
  ]
};
/* Story beats trigger on the number of times you've explored. `text` goes to the journal; `lines` play as a
   scene before the fight and `win` after it. In lines, {name} {starter} {rival} are filled in. */
const STORY = [
  { at: 12, id: 'rival2', title: 'Wren again', text: 'Wren caught up with you on the Thornwood trail for a rematch.',
    lines: [['', 'Someone is sitting on a stump in the middle of the trail, swinging their legs.'],
      ['wren', 'Finally! I\'ve been waiting here for an hour. Okay, ten minutes. Still!'],
      ['wren', 'I caught a Glimmerwing yesterday. It sat on my head until I gave up and said yes. Want to see what we can do?']],
    win: [['wren', 'You and your team are really clicking. I can tell they trust you.'], ['wren', 'I won\'t lose next time. Probably. See you deeper in!']],
    team: [['glimmerwing', 6], ['$rival', 7]] },
  { at: 20, id: 'elder', title: 'Something moves in the old trees', text: 'Elderhorn, the guardian of Thornwood, stepped out of the oldest trees.',
    lines: [['', 'The birds stop. Even the wind stops. The trees here are older than Larkhaven, older than anyone\'s stories about it.'],
      ['', 'Between two trunks stands a stag of moss and bark, antlers hung with flowers. Elderhorn, the guardian of Thornwood. Maren said it shows itself only to tamers it is curious about.'],
      ['@elderhorn', 'It lowers its antlers. Not an attack. A test.']],
    win: [['@elderhorn', 'Elderhorn lowers its great head and breathes on your hands. The moss on its back flowers.'], ['', 'The guardian of Thornwood has chosen to walk with you.']],
    wild: ['elderhorn', 11, 4] },
  /* gate: a Warden. They wait for you to challenge them (a button, not a surprise) and award that badge. */
  { at: 26, id: 'warden', gate: 'thorn', title: 'The Thornwood Warden', text: 'Warden Isolde tested your bond at the Thornwood gate.',
    lines: [['', 'The road north ends at a gate of living hawthorn. A tall woman waits beside it, three creatures resting at her feet.'],
      ['isolde', 'Maren wrote to me about you, {name}. She does that when she thinks someone is worth watching.'],
      ['isolde', 'Wardens don\'t judge strength. Strength is easy. We judge whether your team fights for you or just near you.'],
      ['isolde', 'Show me your bond. If it holds, the road north is yours.']],
    win: [['isolde', 'Your bond is real. They looked back at you before every move. Not many teams do that.'],
      ['isolde', 'Take the Thorn Badge. The gate will open for you now, and the coast is waiting.'],
      ['isolde', 'One more thing. Thornwood isn\'t the only place with a guardian. Every region has something old watching it. Be kind when you meet them.']],
    trainer: 'Warden Isolde', team: [['pebblepaw', 11], ['bogsnap', 12], ['thornback', 14]] },
  /* Saltmarsh Coast: beats count explores made in that biome */
  { biome: 'saltmarsh', at: 6, id: 'rival3', title: 'Wren on the coast', text: 'Wren was waiting where the dunes meet the marsh for another battle.',
    lines: [['', 'Where the dunes meet the marsh, a familiar figure is building a very bad sandcastle.'],
      ['wren', 'There you are! I heard you beat Isolde. I got here first, though. Two whole days first.'],
      ['wren', 'The coast changes a team. Wind, salt, the tide pulling at your feet. Let me show you how much.']],
    win: [['wren', 'Ugh! Fine. Fine! You\'re good.'], ['wren', 'Hey, have you heard the howling at low tide? The old fishers say it\'s the keeper of the coast. I\'m going to find it first.']],
    team: [['kiteskirl', 17], ['brineskit', 18], ['$rival', 19]] },
  { biome: 'saltmarsh', at: 14, id: 'tidewolf', title: 'A howl over the breakers', text: 'Breakwatermane, keeper of the coast, appeared at low tide.',
    lines: [['', 'The tide pulls back further than it should. Fish flop on the bare sand. Far out, something howls.'],
      ['', 'A great wolf walks out of the surf, its mane breaking like a wave and reforming. Breakwatermane, keeper of the coast. Every wave seems to wait for it.'],
      ['@breakwatermane', 'It watches your team for a long moment, then steps forward.']],
    win: [['@breakwatermane', 'Breakwatermane shakes the sea from its mane and sits beside you, as calm as still water.'], ['', 'Somewhere up the beach, Wren yells something that sounds a lot like \"NO WAY.\"']],
    wild: ['breakwatermane', 21, 4] },
  { biome: 'saltmarsh', at: 24, id: 'warden2', gate: 'tide', title: 'The Saltmarsh Warden', text: 'Warden Nerys tested your team on the tidal flats below the lighthouse.',
    lines: [['', 'Below the old lighthouse the tide has pulled back, leaving a mile of rippled sand. A woman in a salt-stained hat waits on it, ankle-deep and unbothered.'],
      ['nerys', 'You\'re the one Isolde wrote about. She says your team looks back at you. Good. Out here, that isn\'t enough.'],
      ['nerys', 'The sea changes every six hours. A team that only knows one way to fight gets swept off its feet. I judge whether yours can change with it.'],
      ['nerys', 'The flats flood in an hour. Let\'s not waste it.']],
    win: [['nerys', 'You shifted when I shifted. Your team read the water as fast as mine did. That\'s the whole test.'],
      ['nerys', 'Take the Tide Badge. Your creatures can grow stronger now, and the road up to the Emberfall Highlands is open.'],
      ['nerys', 'Mind the hot springs up there. And if the ground hums under your feet, stand still and be polite. Something old lives in that mountain too.']],
    trainer: 'Warden Nerys', team: [['wrackjaw', 21], ['spindriftfoal', 22], ['brineskit', 24]] },
  /* Emberfall Highlands: beats count explores made in that biome */
  { biome: 'emberfall', at: 6, id: 'rival4', title: 'Wren at Warmstep Rise', text: 'Wren challenged you to a rematch on the warm stone trail above the coast.',
    lines: [['', 'The coast is a blue ribbon far below Warmstep Rise, where Wren is trying to keep a scarf out of a Thermwing\'s beak.'],
      ['wren', 'I beat you up here. That\'s a win. A small one. Still counts!'],
      ['wren', 'Thermwing and I have an agreement: it gives back my scarf, and it gets the first turn. That\'s teamwork.'],
      ['wren', 'Your team looks happy. Mine looks ready for a rematch. Come on, {name}, let\'s see what the climb taught us!']],
    win: [['wren', 'All right, you win. I\'m blaming the hill. It was clearly on your side.'],
      ['wren', 'Next time, I pick the hill. Come on, there\'s a warm spring ahead; both our teams have earned a rest.']],
    team: [['thermwing', 27], ['kilntusk', 28], ['$rival', 29]] },
  { biome: 'emberfall', at: 14, id: 'hearthstag', title: 'Hoofbeats beneath the mountain', text: 'Hearthcrown, guardian of Emberfall, emerged beside the highland springs.',
    lines: [['', 'The trail reaches a bowl of black stone where warm water bubbles softly through the cracks. Hoofbeats sound through the steam.'],
      ['', 'A great stag steps into view, ember light threaded through its antlers: Hearthcrown, guardian of Emberfall. The springs glow a little brighter around it.'],
      ['@hearthcrown', 'It nudges a loose stone away from your partner\'s feet, then lowers its antlers and waits. A gentle invitation to show your bond.']],
    win: [['@hearthcrown', 'Hearthcrown folds its legs beside your team, warming the stone beneath their tired paws.'],
      ['', 'When you rise to leave, the guardian rises too, ready to share the next stretch of the trail.']],
    wild: ['hearthcrown', 31, 4] },
  { biome: 'emberfall', at: 24, id: 'warden3', gate: 'ember', title: 'The Emberfall Warden', text: 'Warden Toren tested your patience on the warm stone above the springs.',
    lines: [['', 'Above the springs, steam drifts across a ring of warm stone. A grey-haired man waits with three creatures, letting a Glowmote finish its nap on his sleeve.'],
      ['toren', 'Welcome, {name}. Give us a moment. My smallest partner takes punctuality as a suggestion.'],
      ['toren', 'Up here, rushing across a hot ledge gets everyone hurt. I judge patience: can you wait for a safe opening when every part of you wants to push ahead?'],
      ['toren', 'Keep a steady pace, and give your team room to breathe. The mountain will still be here when we finish.']],
    win: [['toren', 'You waited without giving up. Even under pressure, you left your partners time to find their footing. Well done.'],
      ['toren', 'Take the Ember Badge. Your creatures can grow stronger now. You have earned it, and a sit by the springs.'],
      ['toren', 'Further on, beyond the high pass, there are old stones that stay warm through winter. Something was keeping watch there long before we Wardens arrived. Walk slowly, and listen.']],
    trainer: 'Warden Toren', team: [['cragskein', 31], ['glowmote', 32], ['kilntusk', 34]] }
];
const COUNTER = { cindercub: 'ripplet', ripplet: 'mosshog', mosshog: 'cindercub' };

/* Art eras: the world's look evolves as you progress. */
const ERAS = [
  { id: 'pixel', name: 'Pixel', unlock: 'From the start' },
  { id: 'bit16', name: '16-bit', unlock: 'Earn the Thorn Badge' },
  { id: 'hd', name: 'HD', unlock: 'A later region', soon: true },
  { id: '3d', name: '3D', unlock: 'Become Champion', soon: true }
];
