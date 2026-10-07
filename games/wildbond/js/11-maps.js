'use strict';
/* The walkable world (T7b): one tile map per place. Data only. 12-walk.js moves you around these maps and
   ART[era].tile / ART[era].walker draw them, so a later era (HD-2D, voxel, 3D) can render the same maps.
   Tiles: '.' path  ',' grass  '"' tall grass (wild creatures hide here)  'f' flowers  '_' sand
          'T' tree  '~' water  'o' hot spring  'R' rock  'r' roof  '#' wall  'D' door  '=' fence   (T ~ o R r # = are solid)
          'N' 'S' 'E' 'W' an exit on that side, drawn as path.
   A map: rows (all the same length), biome (wild creatures and levels; none for towns), start [x, y, facing],
   exits { N: { to, x, y, dir, locked } } (locked = what you're told if the next area's badge isn't earned yet),
   doors { 'x,y': 'inn' | 'shop' | 'ranch' }, npcs [{ who (a CAST key), at: [x, y], dir, lines, act }],
   warden [x, y] (where the area's Warden stands, if it has one), pen [x0, y0, x1, y1] (ranch creatures roam here). */
const TILES = {
  '.': {}, ',': {}, '"': { tall: 1 }, f: {}, _: {}, N: { exit: 1 }, S: { exit: 1 }, E: { exit: 1 }, W: { exit: 1 },
  T: { solid: 1 }, '~': { solid: 1 }, o: { solid: 1 }, R: { solid: 1 }, r: { solid: 1 }, '#': { solid: 1 }, '=': { solid: 1 }, D: { door: 1 }
};

/* Townsfolk and passers-by: speakers for map conversations. Wardens and story speakers live in 00-data.js. */
Object.assign(CAST, {
  pip: { name: 'Pip', skin: '#f2c8a2', hair: 'spiky', hairCol: '#c96a2a', shirt: '#e0b03a', bg: '#f5e6b8', title: 'Larkhaven kid' },
  tobin: { name: 'Old Tobin', skin: '#c48e68', hair: 'hat', hairCol: '#d8d4cc', hatCol: '#4a4038', shirt: '#6a7a5a', bg: '#d8e2d0', title: 'Saltmarsh fisher' }
});

const MAPS = {
  larkhaven: { name: 'Larkhaven', pal: 'thornwood', start: [11, 7, 'down'],
    rows: [
      'TTTTTTTTTTNNTTTTTTTTTTTT',
      'T,,,,,,,,,..,,,,,,,,,,,T',
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
    pen: [14, 9, 18, 10],
    npcs: [
      { who: 'maren', at: [9, 11], dir: 'down', act: 'ranch',
        lines: [['maren', 'Your ranch creatures are out in the paddock, {name}. Come into the barn and I\'ll show you how they\'re doing.']] },
      { who: 'pip', at: [21, 7], dir: 'left',
        lines: [['pip', 'Wren says she\'s going to be Champion. I\'m going to be Champion first. I\'m seven, so I\'ve got loads of time.'],
          ['pip', 'The tall grass up north is where the wild ones hide. Mum says don\'t go in without a partner. You\'ve got one, so that\'s fine.']] }
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
      'TTT"""",,,,,,..,,,,,,""""TTTTT',
      'TTTTTTTTTTTTT..TTTTTTTTTTTTTTT',
      'TTTTTTTTTTTTTSSTTTTTTTTTTTTTTT'
    ],
    exits: { S: { to: 'larkhaven', x: 10, y: 1, dir: 'down' },
      N: { to: 'saltmarsh', x: 13, y: 12, dir: 'up', locked: 'The hawthorn gate is shut tight. Warden Isolde keeps it, and she opens it only for tamers who have earned the Thorn Badge.' } },
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
      'TT"""",,,,,,,..,,,""""",,TTTTT',
      'TTTTTTTTTTTTT..TTTTTTTTTTTTTTT',
      'TTTTTTTTTTTTTSSTTTTTTTTTTTTTTT'
    ],
    exits: { S: { to: 'thornwood', x: 13, y: 1, dir: 'down' },
      E: { to: 'emberfall', x: 1, y: 8, dir: 'right', locked: 'The cliff path up to the highlands is roped off. A sign reads: "Tide Badge holders only. By order of Warden Nerys."' } },
    npcs: [
      { who: 'tobin', at: [6, 3], dir: 'down',
        lines: [['tobin', 'Forty years I\'ve fished this coast. Seen the tide go out further than it should, once. Didn\'t much like what walked out of it.'],
          ['tobin', 'Reeds hide the wild ones. Walk through slow and they\'ll come and have a look at you.']] }
    ],
    wardenDone: 'The flats will still be here when the tide turns, {name}. So will I.' },
  emberfall: { name: 'Emberfall Highlands', biome: 'emberfall', start: [1, 8, 'right'], warden: [20, 6],
    rows: [
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRR""""RRRRRRRRR""""RRRRR',
      'RRRR"""""""",,,RRRR,,""""""RRR',
      'RR""""""""",,,,,,,,,,""""""""R',
      'R""""",,oo,,,,RR,,,,,,""""""RR',
      'R"""",,ooo,,,,RR,,,,,,,,""""RR',
      'R,,,,,,,,,,,,,,,,,,,,,,,,,,,RR',
      'R,,""""",,,,,,,,,""""""",,,,RR',
      'W.........................,,RR',
      'W.........................,,RR',
      'R,,""""""",,,,RR,,,"""""",,RRR',
      'RR,""""""""",,,RR,,""""""",RRR',
      'RRRR""""""RRRRRRRRR""""RRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR'
    ],
    exits: { W: { to: 'saltmarsh', x: 28, y: 8, dir: 'left' } },
    wardenDone: 'You\'ve earned your badge here, {name}. The mountain will remember your team.' }
};
