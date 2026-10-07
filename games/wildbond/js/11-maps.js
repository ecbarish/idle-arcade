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
  delka: { name: 'Delka', skin: '#ce9c77', hair: 'hat', hairCol: '#736a61', hatCol: '#667f88', shirt: '#7f9392', bg: '#d5e4e2', title: 'Lookout recorder' },
  sivren: { name: 'Sivren', skin: '#966a4b', hair: 'short', hairCol: '#b9b6a3', shirt: '#5a7e92', bg: '#dbe6ec', title: 'Harbor keeper' },
  // route trainers
  bram: { name: 'Bram', skin: '#e8b890', hair: 'short', hairCol: '#4a3a2a', shirt: '#7a8a3a', bg: '#dfe6c4', title: 'Forager' },
  lise: { name: 'Lise', skin: '#d29a74', hair: 'long', hairCol: '#2a2a3a', shirt: '#c8604a', bg: '#f0d6cc', title: 'Birdwatcher' },
  cato: { name: 'Cato', skin: '#a8724e', hair: 'hat', hairCol: '#3a3028', hatCol: '#d8c08a', shirt: '#3a7a9a', bg: '#d0e4ec', title: 'Beachcomber' },
  marit: { name: 'Marit', skin: '#f0c8a4', hair: 'bun', hairCol: '#b8483a', shirt: '#4a6a8a', bg: '#d8e0ec', title: 'Lighthouse runner' },
  orsk: { name: 'Orsk', skin: '#8a5a3e', hair: 'short', hairCol: '#1e1e22', shirt: '#9a5a3a', bg: '#ecd4c0', title: 'Ridge hiker' },
  sela: { name: 'Sela', skin: '#c88a64', hair: 'spiky', hairCol: '#e8e0d0', shirt: '#6a4a8a', bg: '#e0d4ec', title: 'Spring keeper' },
  ilka: { name: 'Ilka', skin: '#e2b48c', hair: 'long', hairCol: '#5a3a24', shirt: '#7a8c5a', bg: '#e0e6d0', title: 'Rope-mender' },
  teodor: { name: 'Teodor', skin: '#a87452', hair: 'hat', hairCol: '#2a2a2a', hatCol: '#5a6a7a', shirt: '#c8b48a', bg: '#e6e0d0', title: 'Cloud-watcher' },
  evren: { name: 'Evren', skin: '#d4a27a', hair: 'bun', hairCol: '#493a2c', shirt: '#6c8650', bg: '#e0dfb9', title: 'Orchard keeper' },
  tavil: { name: 'Tavil', skin: '#946749', hair: 'short', hairCol: '#b8b49a', shirt: '#5a7d85', bg: '#d0dfd5', title: 'Ferry rope-mender' },
  veslin: { name: 'Veslin', skin: '#b28162', hair: 'bun', hairCol: '#5c4f4b', shirt: '#9e986d', bg: '#dadcc4', title: 'Bell keeper' },
  narro: { name: 'Narro', skin: '#deb798', hair: 'short', hairCol: '#393d48', shirt: '#69808d', bg: '#cedbdf', title: 'Cave surveyor' },
  mirel: { name: 'Mirel', skin: '#c79975', hair: 'bun', hairCol: '#55412e', shirt: '#b39255', bg: '#e9e3bc', title: 'Shelter mender' },
  aldren: { name: 'Aldren', skin: '#8f6145', hair: 'short', hairCol: '#c5af7c', shirt: '#738e72', bg: '#dce8c8', title: 'Gathering runner' },
  pell: { name: 'Pell', skin: '#c4956c', hair: 'hat', hairCol: '#796b58', hatCol: '#7a684c', shirt: '#aa895b', bg: '#e8dec0', title: 'Traveling peddler' }
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
      'RR,,,,,,,,,,,..,,,,,,,,,,,,,EE',
      'R""""""",,RR,..,RR,,""""""",RR',
      'RR"""""",,,,P..,,,,,""""""RRRR',
      'RRR""""",,,,,..,,,,,"""""RRRRR',
      'RRRRRRRRRRRRR..RRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRSSRRRRRRRRRRRRRRR'
    ],
    exits: { S: { to: 'emberfall', x: 13, y: 1, dir: 'down' },
      E: { to: 'stillreed', x: 1, y: 8, dir: 'right', locked: 'The basin ferry path waits for the Beacon Badge. Vessa asks every team to learn the pass before descending.' } },
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
    wardenDone: 'The cloud always lifts in the end, {name}. Bring a friend next time anyway.' },
  stillreed: { name: 'Stillreed Basin', biome: 'stillreed', start: [1, 8, 'right'], warden: [23, 9],
    rows: [
      "TTTTTTTTTTTT~~~TTTTTTTTTTTTTTT",
      "T,,,,,,,,,,\"~~~\",,,,,,,,,,,,,T",
      "T,\"\"\"\"\",,,,\"~~~\",,,T,T,T,T,,,T",
      "T,\"\"\"\"\",,,,\"~~~\",,,T,T,T,T,,,T",
      "T,,,........................,T",
      "T,\"\"\"\"\",,,,\"~~~\",,,,,,,,\"\"\"\",T",
      "T,\"\"\"\"\",,,,\"~~~\",,,,,,,,\"\"\"\",T",
      "T,,,,,,,,,,\"~~~\",,,,,,,,\"\"\"\",T",
      "W..P.......\"~~~\",,,,,,,,,,,,,T",
      "T,,,.........................E",
      "T,\"\"\"\"\",,,,\"~~~\",,,,,,,,,,,,,T",
      "T,\"\"\"\"\",,,,\"~~~\",,,,,,,,,,,,,T",
      "T,,,,,,,,,,\"~~~\",,,,,,,,,,,,,T",
      "TTTTTTTTTTTT~~~TTTTTTTTTTTTTTT"
    ],
    exits: { W: { to: 'cloudglass', x: 27, y: 8, dir: 'left' }, E: { to: 'hollowecho', x: 1, y: 9, dir: 'right', locked: 'The hill survey trail requires the Reed Badge. Leave the basin crossing safe before exploring the caverns.' } },
    signs: { '3,8': 'Stillreed Basin. West: Cloudglass Pass. Leave the ferry landing open for small creatures; orchard paths cross the channels on raised boards.' },
    items: [{ id: 'sr1', at: [4, 3], give: { fish: 6 } }, { id: 'sr2', at: [24, 6], give: { lures: 6 } }, { id: 'sr3', at: [27, 11], give: { berries: 8 } }],
    npcs: [
      { who: 'evren', at: [8, 5], dir: 'right',
        trainer: { sight: 3, team: [['orchardroot', 52], ['gustreed', 53]],
          win: [['evren', 'Lovely footing. Not one fallen apple squashed! Both teams have earned a rest.']],
          after: [['evren', 'Orchardroot turns the fallen fruit into good soil. We leave some for the herd before we fill our baskets.']] },
        lines: [['evren', 'Welcome to the orchard path. A friendly battle while the ferry comes back? We can keep the landing clear.']] },
      { who: 'tavil', at: [21, 10], dir: 'up',
        trainer: { sight: 2, team: [['rillwhisk', 54], ['duskcord', 55], ['ferrycrest', 56]],
          win: [['tavil', 'Well held. Your partners gave each other room, like a good knot that still opens.']],
          after: [['tavil', 'Wren and a new tamer freed a ferry rope today. The passengers thanked them; the rope had no comment.']] },
        lines: [['tavil', 'The boards are dry enough for a battle. Shall we? I promise the losing team still gets a ferry ride.']] }
    ],
    wardenDone: 'The landing stays open, {name}. Keep winning with room for your neighbors.' },
  hollowecho: {
  name: 'Hollowecho Hills',
  biome: 'hollowecho',
  edge: 'R',
  start: [ 1, 9, 'right' ],
  warden: [ 23, 4 ],
  rows: [
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    'R,rrrrr,,,RRRRR,",,,RRRRRRR,,R',
    'R,rrrrr,,,RRRRR""",,RRRRRRR,,R',
    'R,##_##,",RRRRR"""",RR___RR,,R',
    'R,_____""",RRR,""",,,R___R,,,R',
    'R,__.__P""",,,,,",,,........,R',
    'R,,,.,,""",,,,,......,,,,"".,R',
    'R,,,............,,,,,,,,"""."R',
    'R,,",.,,RRRRR,,",,R_RR,,,"".,R',
    'W.....,,RRRRR,""",R__R,,,,"..E',
    'R"""""",RRRRR"""""R__R,,RRR,,R',
    'R""""",,,RRR,,""",RRRR,,RRR,,R',
    'R,,",,,,,,,,,,,",,,,,,,,,,,,,R',
    'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR'
  ],
  exits: { W: { to: 'stillreed', x: 28, y: 9, dir: 'left' }, E: { to: 'sunthread', x: 1, y: 9, dir: 'right', locked: 'The gathering trail requires the Echo Badge. Listen to your partners before joining Sunthread Commons.' } },
  signs: {
    '7,5': 'Hollowecho Hills. West: Stillreed Basin. Ring the hamlet bell before dusk; answer a returning team before choosing your next passage.'
  },
  items: [
    { id: 'he1', at: [ 3, 5 ], give: { berries: 8 } },
    { id: 'he2', at: [ 19, 10 ], give: { lures: 6 } },
    { id: 'he3', at: [ 27, 8 ], give: { coins: 500 } }
  ],
  npcs: [
    {
      who: 'veslin',
      at: [ 6, 6 ],
      dir: 'down',
      trainer: {
        sight: 1,
        team: [ [ 'bellmote', 58 ], [ 'umbrelace', 59 ] ],
        win: [ [ 'veslin', 'Good listening! The bell can wait while both teams catch their breath.' ] ],
        after: [
          [ 'veslin', 'One ring means a team is home. We always answer, even if supper is getting cold.' ]
        ]
      },
      lines: [
        [
          'veslin',
          'Welcome back to daylight. A friendly battle beside the bell? Nobody has to find the dark trail alone.'
        ]
      ]
    },
    {
      who: 'narro',
      at: [ 16, 6 ],
      dir: 'down',
      trainer: {
        sight: 1,
        team: [ [ 'dripdart', 60 ], [ 'flintroot', 61 ], [ 'hushmane', 62 ] ],
        win: [
          [
            'narro',
            'A fine change of plan. My partners heard yours coming and still could not quite keep up.'
          ]
        ],
        after: [
          [
            'narro',
            'The bright mouth has loose footing. My Dripdart showed me the familiar passage; I changed the map.'
          ]
        ]
      },
      lines: [
        [
          'narro',
          'I have put the measuring cord away. Shall we see what our partners make of a battle on level ground?'
        ]
      ]
    }
  ],
  wardenDone: 'Keep listening, {name}. A careful return matters more than a perfect map.'
},
  sunthread: {
  "name": "Sunthread Commons",
  "biome": "sunthread",
  "start": [
    1,
    9,
    "right"
  ],
  "warden": [
    24,
    5
  ],
  "rows": [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "T,,,,,,,,,,,,,,,,,,rrrrrrrr,,T",
    "T,,\"\"\"\",f,T,,\"\"\",,,rrrrrrrr,,T",
    "T,\"\"\"\"\"f,TT,\"\"\"\"\",,########,,T",
    "T,\"\"\"\"\",,f,f,\"\"\"\"\"_________P,T",
    "T,,\"\"\",,,,,,,,\"\"\"P__________,T",
    "T,,,,,.......,,,,,,.........,T",
    "T,,,,,.,,,,,.,,,,,,.,,,,,,,f,T",
    "T,,,,,.,,,,,.....f..,,,,,T,,,T",
    "W......,,,,,,,,,,,f,f,T,T,,,,E",
    "T,,\"\"\"\"\"===,,,,,,,,,,\"\"\"\"\"\"T,T",
    "T,\"\"\"\"\"\",,,,,,====,,\"\"\"\"\"\"\",,T",
    "T,,,\"\"\",,,,,,,,,,,,,,,\"\"\"\",,,T",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
  ],
  "exits": {
    "E": { "to": "farwatch", "x": 1, "y": 9, "dir": "right", "locked": "The coastal road requires the Loom Badge. Make room for every partner before Farwatch Reach." },
    "W": {
      "to": "hollowecho",
      "x": 28,
      "y": 9,
      "dir": "left"
    }
  },
  "signs": {
    "17,5": "Sunthread Commons. West: Hollowecho Hills. Follow the winding meadow path to the gathering; leave the nursery beds and resting partners room.",
    "27,4": "The meeting hall welcomes every team. When the wind rises, bring loose shelter ties here and let the youngest creatures rest."
  },
  "items": [
    {
      "id": "st1",
      "at": [
        3,
        4
      ],
      "give": {
        "grain": 8
      }
    },
    {
      "id": "st2",
      "at": [
        14,
        10
      ],
      "give": {
        "lures": 6
      }
    },
    {
      "id": "st3",
      "at": [
        26,
        11
      ],
      "give": {
        "berries": 8
      }
    }
  ],
  "npcs": [
    {
      "who": "mirel",
      "at": [
        8,
        6
      ],
      "dir": "down",
      "trainer": {
        "sight": 2,
        "team": [
          [
            "clovercolt",
            64
          ],
          [
            "hemglow",
            65
          ]
        ],
        "win": [
          [
            "mirel",
            "Beautifully shared. My little Hemglow still has enough light to guide the late arrivals."
          ]
        ],
        "after": [
          [
            "mirel",
            "We mend one tie at a time. Clovercolt holds the cord; Hemglow shows me where it has frayed."
          ]
        ]
      },
      "lines": [
        [
          "mirel",
          "A friendly battle while the next shelter dries? Every partner gets a useful turn."
        ]
      ]
    },
    {
      "who": "aldren",
      "at": [
        19,
        7
      ],
      "dir": "left",
      "trainer": {
        "sight": 2,
        "team": [
          [
            "pennantlark",
            65
          ],
          [
            "hearthrunner",
            66
          ],
          [
            "ribbonstride",
            67
          ]
        ],
        "win": [
          [
            "aldren",
            "Well played! A quick runner and a steady helper can both carry a team."
          ]
        ],
        "after": [
          [
            "aldren",
            "Ribbonstride collects loose ribbons after the gusts. Hearthrunner dries them under the bench. I mostly untangle them."
          ]
        ]
      },
      "lines": [
        [
          "aldren",
          "The hall is nearly ready. Shall our teams try a battle before we carry the last benches over?"
        ]
      ]
    },
    {
      "who": "pell",
      "at": [
        21,
        4
      ],
      "dir": "down",
      "lines": [
        [
          "pell",
          "Just passing through! I have sold a lantern to every hero who ever needed one. Brisket says that cannot possibly be true."
        ],
        [
          "pell",
          "Today I am keeping the shelter ties in one place. Brisket has found the shade. A gathering runs better when everyone knows their job."
        ]
      ]
    }
  ],
  "wardenDone": "There is a place for your whole team here, {name}. Remember the names of those who helped you."
},
  farwatch: {
  "name": "Farwatch Reach",
  "biome": "farwatch",
  "start": [
    1,
    9,
    "right"
  ],
  "warden": [
    20,
    3
  ],
  "rows": [
    "RRRRRRRRRRRRNRRRRRRRRRRR~~~~~~",
    "R,,,,,,rrrr,,,,,\"\"\",,,RR~~~~~~",
    "R,,\"\"\",rrrr,,,,\"\"\"\",,,RR~~~~~~",
    "R,\"\"\"\",####,,,,,,,______~~~~~~",
    "R,\"\"\"\"f,,,,R,,,.......__~~~~~~",
    "R,\"\"\",,,,,,R,,P.,,___.__~~~~~~",
    "R,,,,,..........,,,,,.,,~~~~~~",
    "R,,,f,.,,,,,,,,,R,___.__~~~~~~",
    "R,,,,,.,,,,\"\"\",,R,___._P~~~~~~",
    "W......,,.............__....~~",
    "R,,,rrrrr.\"\"\"\",,,,______....~~",
    "R,,,#####.\"\"\",,,,,______~~~~~~",
    "R,,T,,,,,.,,f,,,T,______~~~~~~",
    "RRRRRRRRRRRRRRRRRRRRRRRR~~~~~~"
  ],
  "exits": {
    "N": { "to": "league", "x": 3, "y": 16, "dir": "up", "locked": "The league requires all eight badges. Every road has something to teach your team." },
    "W": {
      "to": "sunthread",
      "x": 28,
      "y": 9,
      "dir": "left"
    }
  },
  "signs": {
    "14,5": "Farwatch Reach. West: Sunthread Commons. Follow the bluff path to the harbor. Lookout records are checked each tide; a crossed-out note is better than a hidden mistake.",
    "23,8": "Returning teams: answer the shore lantern before approaching. Rest on the harbor bench; distant islands are not a marked route."
  },
  "items": [
    {
      "id": "fw1",
      "at": [
        3,
        4
      ],
      "give": {
        "lures": 8
      }
    },
    {
      "id": "fw2",
      "at": [
        12,
        10
      ],
      "give": {
        "fish": 8
      }
    },
    {
      "id": "fw3",
      "at": [
        26,
        10
      ],
      "give": {
        "berries": 8
      }
    }
  ],
  "npcs": [
    {
      "who": "delka",
      "at": [
        9,
        6
      ],
      "dir": "down",
      "lines": [
        [
          "delka",
          "A friendly battle? Chartwing checks the wind, and Moorweft checks the footing. I try to check both."
        ]
      ],
      "trainer": {
        "sight": 2,
        "team": [
          [
            "chartwing",
            68
          ],
          [
            "moorweft",
            69
          ]
        ],
        "win": [
          [
            "delka",
            "That was useful practice. I will mark where my plan changed, so the next team can learn from it."
          ]
        ],
        "after": [
          [
            "delka",
            "The lookout ledger has a space for corrections. Filling it in is part of the job."
          ]
        ]
      }
    },
    {
      "who": "sivren",
      "at": [
        20,
        8
      ],
      "dir": "left",
      "lines": [
        [
          "sivren",
          "We have a clear patch beside the harbor. Shall we practice before the fog comes back?"
        ]
      ],
      "trainer": {
        "sight": 2,
        "team": [
          [
            "keeljaw",
            69
          ],
          [
            "buoyglint",
            70
          ],
          [
            "shoalpup",
            70
          ]
        ],
        "win": [
          [
            "sivren",
            "Well played! Every partner is counted, every plank is back on shore. A good finish."
          ]
        ],
        "after": [
          [
            "sivren",
            "Some teams are heading toward the league. We keep a dry bench for them and a lantern for the ones returning."
          ]
        ]
      }
    }
  ],
  "wardenDone": "Eight badges, {name}. Take time to rest before the league, and leave clear notes for the teams behind you."
},
  league: {
  "name": "Returning Light League",
  "league": true,
  "pal": "cloudglass",
  "edge": "R",
  "start": [
    3,
    16,
    "up"
  ],
  "rows": [
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    "R~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~R",
    "R~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~R",
    "R,,,,rrrrr,,rrrrr,,rrrrr,,rrrrr,,rrrrr,R",
    "R,,,,#####,,#####,,#####,,#####,,#####,R",
    "R,,,,_____,,_____,,_____,,_____,,_____,R",
    "R,,,,_____,,_____,,_____,,_____,,_____,R",
    "R,,,,f_._f,,f_._f,,f_._f,,f_._f,,f_._f,R",
    "R,,..................................,,R",
    "R,,..................................,,R",
    "R,,..................................,,R",
    "R,,.,,,P,,,,,,P,,,,,,P,,,,,,P,,,,,,P,,,R",
    "R,,.,,,,,,,,f,,,,,,,,,,,,,,f,,,,,,,,,,,R",
    "R,,.,,,,~~~~~~~,,,,,,,,~~~~~~~~,,,,,,,,R",
    "R,,.,,,,~~~~~~~,,,,,,,,~~~~~~~~,,,,,,,,R",
    "W...,====,,,,,,,,,,,,,,,,,,,,,,,,====,,R",
    "R,,.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,R",
    "RRRSRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR"
  ],
  "exits": {
    "W": { "to": "spire", "x": 17, "y": 14, "dir": "left", "locked": "The Spire opens after the Champion ending. Take your team home in the story first." },
    "S": {
      "to": "farwatch",
      "x": 12,
      "y": 1,
      "dir": "down"
    }
  },
  "signs": {
    "7,11": "Listening court: listen while the plan changes.",
    "14,11": "Shelter court: strength leaves somewhere safe to rest.",
    "21,11": "Shared-work court: every partner has a part.",
    "28,11": "Honest-record court: corrections belong where others can see them.",
    "35,11": "Champion terrace: bring the whole journey with you."
  },
  "npcs": [
    {
      "who": "wren",
      "at": [
        3,
        12
      ],
      "dir": "down",
      "league": "wren"
    },
    {
      "who": "nelva",
      "at": [
        4,
        15
      ],
      "dir": "left",
      "league": "keeper"
    },
    {
      "who": "edrin",
      "at": [
        7,
        6
      ],
      "dir": "down",
      "league": 0
    },
    {
      "who": "maela",
      "at": [
        14,
        6
      ],
      "dir": "down",
      "league": 1
    },
    {
      "who": "corven",
      "at": [
        21,
        6
      ],
      "dir": "down",
      "league": 2
    },
    {
      "who": "liora",
      "at": [
        28,
        6
      ],
      "dir": "down",
      "league": 3
    },
    {
      "who": "avenne",
      "at": [
        35,
        6
      ],
      "dir": "down",
      "league": 4
    }
  ]
},
  spire: {
  "name": "The Lighthouse Spire",
  "tower": true,
  "pal": "farwatch",
  "start": [
    9,
    14,
    "up"
  ],
  "rows": [
    "RRRRRRRRRRRRRRRRRRR",
    "R~~~~~~~~~~~~~~~~~R",
    "R~~,,,rrrrrrr,,,~~R",
    "R~~,,,#######,,,~~R",
    "R~~,,,_______,,,~~R",
    "R~~,,,_______,,,~~R",
    "R~~,,,__f_f__,,,~~R",
    "R~~,,,.......,,,~~R",
    "R~~,,,.......,,,~~R",
    "R~~,,,.......,,,~~R",
    "R~~,,,,,...,,,,,~~R",
    "R~~,,,,P...P,,,,~~R",
    "R~~,,,,,...,,,,,~~R",
    "R~~,====...====,~~R",
    "R~~,..............E",
    "R~~,,,,,...,,,,,~~R",
    "R~~~~~~~~~~~~~~~~~R",
    "RRRRRRRRRRRRRRRRRRR"
  ],
  "exits": {
    "E": {
      "to": "league",
      "x": 1,
      "y": 15,
      "dir": "right"
    }
  },
  "signs": {
    "7,11": "The Lighthouse Spire. Champions climb together; every fifth floor has a healing bench.",
    "11,11": "Leave with what you earned. Milestone gifts are yours once; the Journal remembers your best floor."
  },
  "npcs": []
}
};
