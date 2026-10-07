'use strict';
/* The walkable world (T7b): one tile map per place. Data only. 12-walk.js moves you around these maps and
   ART[era].tile / ART[era].walker draw them, so a later era (HD-2D, voxel, 3D) can render the same maps.
   Tiles: '.' path  ',' grass  '"' tall grass (wild creatures hide here)  'f' flowers  '_' sand
          'T' tree  '~' water  'o' hot spring  'R' rock  'r' roof  '#' wall  'D' door  '=' fence  'P' signpost
          (T ~ o R r # = P are solid)   'N' 'S' 'E' 'W' an exit on that side, drawn as path.
   A map: rows (all the same length), biome (wild creatures and levels; none for towns), start [x, y, facing],
   exits { N: { to, x, y, dir, locked } } (locked = what you're told if the next area's badge isn't earned yet),
   doors { 'x,y': 'inn' | 'shop' | 'ranch' }, signs { 'x,y': text }, npcs [{ who (a CAST key), at: [x, y], dir, lines, act }],
   warden [x, y] (where the area's Warden stands, if it has one), pen [x0, y0, x1, y1] (ranch creatures roam here),
   items [{ id, at: [x, y], give: { coins | lures | meat | fish | grain | berries: amount } }] (picked up once, by walking on them).
   A route trainer is an npc with trainer: { team: [[species, level]], sight (tiles they see ahead), win, after }:
   walk into their line of sight and they come for a battle; `lines` play before it, `win` after you win, `after` later. */
const TILES = {
  '.': {}, ',': {}, '"': { tall: 1 }, f: {}, _: {}, N: { exit: 1 }, S: { exit: 1 }, E: { exit: 1 }, W: { exit: 1 },
  T: { solid: 1 }, '~': { solid: 1 }, o: { solid: 1 }, R: { solid: 1 }, r: { solid: 1 }, '#': { solid: 1 }, '=': { solid: 1 }, D: { door: 1 },
  P: { solid: 1, sign: 1 }
};

/* Townsfolk and passers-by: speakers for map conversations. Wardens and story speakers live in 00-data.js. */
Object.assign(CAST, {
  pip: { name: 'Pip', skin: '#f2c8a2', hair: 'spiky', hairCol: '#c96a2a', shirt: '#e0b03a', bg: '#f5e6b8', title: 'Larkhaven kid' },
  tobin: { name: 'Old Tobin', skin: '#c48e68', hair: 'hat', hairCol: '#d8d4cc', hatCol: '#4a4038', shirt: '#6a7a5a', bg: '#d8e2d0', title: 'Saltmarsh fisher' },
  // route trainers
  bram: { name: 'Bram', skin: '#e8b890', hair: 'short', hairCol: '#4a3a2a', shirt: '#7a8a3a', bg: '#dfe6c4', title: 'Forager' },
  lise: { name: 'Lise', skin: '#d29a74', hair: 'long', hairCol: '#2a2a3a', shirt: '#c8604a', bg: '#f0d6cc', title: 'Birdwatcher' },
  cato: { name: 'Cato', skin: '#a8724e', hair: 'hat', hairCol: '#3a3028', hatCol: '#d8c08a', shirt: '#3a7a9a', bg: '#d0e4ec', title: 'Beachcomber' },
  marit: { name: 'Marit', skin: '#f0c8a4', hair: 'bun', hairCol: '#b8483a', shirt: '#4a6a8a', bg: '#d8e0ec', title: 'Lighthouse runner' },
  orsk: { name: 'Orsk', skin: '#8a5a3e', hair: 'short', hairCol: '#1e1e22', shirt: '#9a5a3a', bg: '#ecd4c0', title: 'Ridge hiker' },
  sela: { name: 'Sela', skin: '#c88a64', hair: 'spiky', hairCol: '#e8e0d0', shirt: '#6a4a8a', bg: '#e0d4ec', title: 'Spring keeper' },
  ilka: { name: 'Ilka', skin: '#e2b48c', hair: 'long', hairCol: '#5a3a24', shirt: '#7a8c5a', bg: '#e0e6d0', title: 'Rope-mender' },
  teodor: { name: 'Teodor', skin: '#a87452', hair: 'hat', hairCol: '#2a2a2a', hatCol: '#5a6a7a', shirt: '#c8b48a', bg: '#e6e0d0', title: 'Cloud-watcher' }
});

const MAPS = {
  larkhaven: { name: 'Larkhaven', pal: 'thornwood', start: [11, 7, 'down'],
    rows: [
      'TTTTTTTTTTNNTTTTTTTTTTTT',
      'T,,,,,,,,,..P,,,,,,,,,,T',
      'T,rrrrr,,,..,,,,rrrrr,,T',
      'T,rrrrr,,,..,,,,rrrrr,,T',
      'T,##D##,,,..,,,,##D##,,T',
      'T,,,.,,,,,..,,,,,,.,,,,T',
      'T,,.................,f,T',
      'T,f,,,,,,,..,,,,,,,,,,,T',
      'T,,,,rrrrr..,=======,,,T',
      'T,,,,rrrrr..,=,,,,,=,,,T',
      'T,,,,##D##..,=,,,,,=,f,T',
      'T,f,,,,.,,..,===.===,,,T',
      'T,,,,,,..........,,,,,,T',
      'TTTTTTTTTTTTTTTTTTTTTTTT'
    ],
    exits: { N: { to: 'thornwood', x: 13, y: 14, dir: 'up' } },
    doors: { '4,4': 'inn', '18,4': 'shop', '7,10': 'ranch' },
    signs: { '12,1': 'North: Thornwood. Mind the tall grass, and mind your partner.' },
    items: [{ id: 'lh1', at: [22, 12], give: { coins: 30 } }],
    pen: [14, 9, 18, 10],
    npcs: [
      { who: 'maren', at: [9, 11], dir: 'down', act: 'ranch',
        lines: [['maren', 'Your ranch creatures are out in the paddock, {name}. Come into the barn and I\'ll show you how they\'re doing.']],
        byBadge: { thorn: [['maren', 'Well, look at that. In my day the world had four colors and we liked it.'],
          ['maren', '...It is very pretty, though. Don\'t tell Isolde I said so. Come on, the barn\'s open.']] } },
      { who: 'pip', at: [21, 7], dir: 'left',
        lines: [['pip', 'Wren says she\'s going to be Champion. I\'m going to be Champion first. I\'m seven, so I\'ve got loads of time.'],
          ['pip', 'The tall grass up north is where the wild ones hide. Mum says don\'t go in without a partner. You\'ve got one, so that\'s fine.']],
        byBadge: { thorn: [['pip', 'Did everything just get... brighter? My shirt is YELLOW. Was it always yellow?'],
          ['pip', 'Mum says I\'m imagining it. Mum has also started wearing her good scarf, so.']],
          tide: [['pip', 'Mum, the corners are round now. The corners of EVERYTHING. Come and look!'],
            ['pip', 'Mum says the corners were always round. Then she stood looking at the windmill for a really long time.']] } }
    ] },
  thornwood: { name: 'Thornwood', biome: 'thornwood', start: [13, 14, 'up'], warden: [12, 1],
    rows: [
      'TTTTTTTTTTTTTNNTTTTTTTTTTTTTTT',
      'TTTTTTTTTTTT,..,TTTTTTTTTTTTTT',
      'TT""""TTT,,,,..,,,TT"""""TTTTT',
      'T"""""",,,,,,..,,,,,,""""""""T',
      'T""""",,TT,,,..,,TT,,""""""""T',
      'T"",,,,TTT,,,..,,TTT,,,,"""""T',
      'T,,,,,,,,,,,,..,,,,,,,,,,,,,,T',
      'T~~~~,,""""""..,,"""""""",,TTT',
      'T~~~~,,""""""..,,"""""""",,,,T',
      'T~~~,,,""""""..,,,,,,TTT,,,,,T',
      'T,,,,,,,,,,,,..,,,,,,,,,,,,,,T',
      'TT""""""",,,,..,,,""""""",,TTT',
      'TT""""""",,,,..,,,""""""",,TTT',
      'TTT"""",,,,,P..,,,,,,""""TTTTT',
      'TTTTTTTTTTTTT..TTTTTTTTTTTTTTT',
      'TTTTTTTTTTTTTSSTTTTTTTTTTTTTTT'
    ],
    exits: { S: { to: 'larkhaven', x: 10, y: 1, dir: 'down' },
      N: { to: 'saltmarsh', x: 13, y: 12, dir: 'up', locked: 'The hawthorn gate is shut tight. Warden Isolde keeps it, and she opens it only for tamers who have earned the Thorn Badge.' } },
    signs: { '12,13': 'Thornwood. South: Larkhaven. North: the hawthorn gate and Warden Isolde.' },
    items: [{ id: 'tw1', at: [2, 6], give: { coins: 60 } }, { id: 'tw2', at: [27, 10], give: { lures: 3 } }, { id: 'tw3', at: [5, 9], give: { berries: 5 } }],
    npcs: [
      { who: 'bram', at: [11, 10], dir: 'right',
        trainer: { sight: 3, team: [['gnawhound', 5], ['duskweaver', 6]],
          win: [['bram', 'Ha! Fair\'s fair. I was only out here for mushrooms anyway.']],
          after: [['bram', 'The stream by the pond floods in spring. Best mushrooms in Thornwood grow right where it stops.']] },
        lines: [['bram', 'Hold it! You walked right past my mushroom patch. Least you can do is give me a battle.']] },
      { who: 'lise', at: [16, 6], dir: 'left',
        trainer: { sight: 3, team: [['glimmerwing', 8], ['emberling', 9], ['pebblepaw', 10]],
          win: [['lise', 'Oh, that was lovely to watch. Your team moves like a flock.']],
          after: [['lise', 'I\'ve counted forty-one Glimmerwings this week. One of them keeps following Wren around.']] },
        lines: [['lise', 'Shh! You\'ll scare the birds. ...Well, now they\'re gone. You owe me a battle.']] }
    ],
    wardenDone: 'The gate is yours, {name}. The coast is waiting.' },
  saltmarsh: { name: 'Saltmarsh Coast', biome: 'saltmarsh', start: [13, 12, 'up'], warden: [16, 4],
    rows: [
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~______~~~~~~~~~~~~~~~~',
      '~~~~~______________~~~~~~~~~~~',
      '______________________________',
      '_""""__RR____..___""""""__RR__',
      '""""""_______..__"""""""""____',
      '""""""",,,,,,..,,"""""""",,,TT',
      '"""""",,,,,,,................E',
      '""""",,,RR,,,................E',
      'T""""",,,,,,,..,,""""""",,,TTT',
      'TT"""",,,,,,P..,,,""""",,TTTTT',
      'TTTTTTTTTTTTT..TTTTTTTTTTTTTTT',
      'TTTTTTTTTTTTTSSTTTTTTTTTTTTTTT'
    ],
    exits: { S: { to: 'thornwood', x: 13, y: 1, dir: 'down' },
      E: { to: 'emberfall', x: 1, y: 8, dir: 'right', locked: 'The cliff path up to the highlands is roped off. A sign reads: "Tide Badge holders only. By order of Warden Nerys."' } },
    npcs: [
      { who: 'tobin', at: [6, 3], dir: 'down',
        lines: [['tobin', 'Forty years I\'ve fished this coast. Seen the tide go out further than it should, once. Didn\'t much like what walked out of it.'],
          ['tobin', 'Reeds hide the wild ones. Walk through slow and they\'ll come and have a look at you.'],
          ['tobin', 'And before you ask: no, the sea has not "got bluer lately". Sea\'s always been this color. Always.']] },
      { who: 'cato', at: [16, 7], dir: 'left',
        trainer: { sight: 3, team: [['kiteskirl', 14], ['reedtusk', 15]],
          win: [['cato', 'Washed up, just like everything else on this beach. Good battle, though.']],
          after: [['cato', 'Found a shell yesterday that hums when the tide comes in. Old Tobin told me to put it back.']] },
        lines: [['cato', 'A new tamer on my beach? The tide brought you in, so let\'s see what you\'re made of.']] },
      { who: 'marit', at: [22, 9], dir: 'up',
        trainer: { sight: 1, team: [['wrackjaw', 17], ['dunepounce', 18], ['brineskit', 18]],
          win: [['marit', 'You\'re fast. Faster than me, and I run the lighthouse stairs twice a day.']],
          after: [['marit', 'Warden Nerys says the flats change every six hours. I time my runs by them.']] },
        lines: [['marit', 'Out of the way, I\'m on a run! ...Actually, no. A battle first. Then the run.']] }
    ],
    signs: { '12,11': 'Saltmarsh Coast. East: the cliff road to the Emberfall Highlands.' },
    items: [{ id: 'sm1', at: [2, 4], give: { lures: 3 } }, { id: 'sm2', at: [27, 6], give: { fish: 5 } }, { id: 'sm3', at: [10, 11], give: { coins: 120 } }],
    wardenDone: 'The flats will still be here when the tide turns, {name}. So will I.' },
  emberfall: { name: 'Emberfall Highlands', biome: 'emberfall', start: [1, 8, 'right'], warden: [20, 6],
    rows: [
      'RRRRRRRRRRRRRNNRRRRRRRRRRRRRRR',
      'RRRRRRRR""""R..RRRRRR""""RRRRR',
      'RRRR"""""""",,,RRRR,,""""""RRR',
      'RR""""""""",,,,,,,,,,""""""""R',
      'R""""",,oo,,,,RR,,,,,,""""""RR',
      'R"""",,ooo,,,,RR,,,,,,,,""""RR',
      'R,,,,,,,,,,,,,,,,,,,,,,,,,,,RR',
      'R,P""""",,,,,,,,,""""""",,,,RR',
      'W.........................,,RR',
      'W.........................,,RR',
      'R,,""""""",,,,RR,,,"""""",,RRR',
      'RR,""""""""",,,RR,,""""""",RRR',
      'RRRR""""""RRRRRRRRR""""RRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR'
    ],
    exits: { W: { to: 'saltmarsh', x: 28, y: 8, dir: 'left' },
      N: { to: 'cloudglass', x: 13, y: 12, dir: 'up', locked: 'A rope bars the high path into the cloud. A tag on it reads: "Ember Badge holders only. The pass is no place to learn patience. Toren."' } },
    signs: { '2,7': 'Emberfall Highlands. Mind the springs: they\'re warmer than they look.' },
    items: [{ id: 'ef1', at: [12, 3], give: { meat: 5 } }, { id: 'ef2', at: [27, 6], give: { lures: 5 } }, { id: 'ef3', at: [26, 11], give: { coins: 250 } }],
    npcs: [
      { who: 'orsk', at: [10, 7], dir: 'down',
        trainer: { sight: 1, team: [['ashskip', 24], ['ventwhisk', 25]],
          win: [['orsk', 'Good. Good! My legs are tired anyway. I\'ll blame them.']],
          after: [['orsk', 'From the top of the ridge you can see all the way back to Larkhaven. Tiny little windmill.']] },
        lines: [['orsk', 'The ridge path is narrow, friend. Only one of us gets to keep walking. Battle for it?']] },
      { who: 'sela', at: [17, 10], dir: 'up',
        trainer: { sight: 1, team: [['screegrin', 27], ['thermwing', 28], ['kilntusk', 29]],
          win: [['sela', 'Warm work. Your team deserves a soak in the springs after that.']],
          after: [['sela', 'Toren sits by the springs every morning. He says he\'s thinking. I think he\'s napping.']] },
        lines: [['sela', 'Visitors to the springs have to earn their soak. Show me your team!']] }
    ],
    wardenDone: 'You\'ve earned your badge here, {name}. The mountain will remember your team.' },
  cloudglass: { name: 'Cloudglass Pass', biome: 'cloudglass', edge: 'R', start: [13, 12, 'up'], warden: [14, 2],
    rows: [
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRR""""RRRRR,,,,,,RRRR"""""RRR',
      'RR""""""",,,,,,,,,,,,""""""""R',
      'R""""",,,,,,,,,,,,,,,,,""""RRR',
      'R"",,,RR,,,,,..,,,,,RR,,""",RR',
      'RR,,RRR,"""",..,"""",RRR,,,,RR',
      'R"""",,,"""""..""""",,,,,"""RR',
      'R"""",RR,,,,,..,,,,,RR,"""""RR',
      'RR,,,,,,,,,,,..,,,,,,,,,,,,,RR',
      'R""""""",,RR,..,RR,,""""""",RR',
      'RR"""""",,,,P..,,,,,""""""RRRR',
      'RRR""""",,,,,..,,,,,"""""RRRRR',
      'RRRRRRRRRRRRR..RRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRSSRRRRRRRRRRRRRRR'
    ],
    exits: { S: { to: 'emberfall', x: 13, y: 1, dir: 'down' } },
    signs: { '12,10': 'Cloudglass Pass. South: Emberfall. Up top: Warden Vessa\'s shelter. If the cloud comes down, stop and shout.' },
    items: [{ id: 'cg1', at: [2, 8], give: { coins: 300 } }, { id: 'cg2', at: [27, 8], give: { lures: 5 } }, { id: 'cg3', at: [3, 2], give: { berries: 6 } }],
    npcs: [
      { who: 'ilka', at: [8, 8], dir: 'right',
        trainer: { sight: 5, team: [['fogtail', 34], ['pallweaver', 35]],
          win: [['ilka', 'Good knots, your team. You tie yourselves together without even trying.']],
          after: [['ilka', 'Every rope on this pass, I\'ve mended at least twice. Vessa says that makes me the pass\'s grandmother. I\'m thirty-one.']] },
        lines: [['ilka', 'Mind the rope! ...You didn\'t trip on it. Fine. Then you can battle me instead.']] },
      { who: 'teodor', at: [15, 5], dir: 'left',
        trainer: { sight: 2, team: [['gritbeak', 38], ['cirrusmane', 39], ['shalecat', 40]],
          win: [['teodor', 'The cloud is lifting. That usually happens right after I lose.']],
          after: [['teodor', 'I count the clouds every morning. Yesterday, four hundred and twelve. Vessa says I made that up. I did not.']] },
        lines: [['teodor', 'Stand still. You\'re in my view of the cloud. ...Well, now that you\'re here, a battle.']] }
    ],
    wardenDone: 'The cloud always lifts in the end, {name}. Bring a friend next time anyway.' }
};
