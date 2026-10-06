'use strict';
/* =================== world data =================== */
const FACTIONS={
  concord:{name:'The Concord',desc:'Old kingdoms of the west, bound by oath and stone.',col:'var(--concord)',races:['human','stonekin'],start:'thornvale'},
  wild:{name:'The Wildclans',desc:'Free peoples of the red steppe, bound by blood and honor.',col:'var(--wild)',races:['grishar','duskelf'],start:'redsand'},
};
const RACES={
  human:{name:'Human',faction:'concord',bonus:'Quests give 5% more experience.',qxp:1.05,skin:'#f1c9a0',hair:'#6b4423'},
  stonekin:{name:'Stonekin',faction:'concord',bonus:'10% more armor, +2 Stamina.',armor:1.1,stat:{sta:2},skin:'#e0b08a',hair:'#b5662a',beard:true},
  grishar:{name:'Grishar',faction:'wild',bonus:'5% more health. Below 30% health you deal 10% more damage. Bonds with tamed beasts 20% faster.',hp:1.05,bloodrage:true,beastkin:true,skin:'#7fa65a',hair:'#2b2b2b',tusks:true},
  duskelf:{name:'Duskelf',faction:'wild',bonus:'+2% critical strike chance.',crit:2,skin:'#b9a3d9',hair:'#e8e8f0',ears:true},
};
const CLASSES={
  warrior:{name:'Warrior',role:'Tank / Damage',res:'rage',armor:['mail','leather','cloth'],weap:['sword','mace'],off:'shield',col:'#c79c6e',
    base:{str:23,agi:20,int:10,sta:22,spi:11},grow:{str:2,agi:1,int:0,sta:2,spi:.5},w:{str:2,agi:1,sta:1.2,int:0,spi:0,dps:4,armor:.04},
    desc:'Plate-and-steel fighter. Builds rage by hitting and being hit, spends it on heavy strikes.'},
  rogue:{name:'Rogue',role:'Damage',res:'energy',armor:['leather','cloth'],weap:['dagger','sword'],off:'dagger',col:'#fff469',
    base:{str:18,agi:24,int:11,sta:20,spi:12},grow:{str:1,agi:2,int:0,sta:1.5,spi:.5},w:{agi:2,str:1,sta:1,int:0,spi:0,dps:4,armor:.02},
    desc:'Quick blades and combo points. Builds combos, then spends them on a finisher.'},
  mage:{name:'Mage',role:'Damage',res:'mana',armor:['cloth'],weap:['staff','dagger'],off:'tome',col:'#69ccf0',
    base:{str:10,agi:12,int:24,sta:17,spi:20},grow:{str:0,agi:.5,int:2,sta:1,spi:1.5},w:{int:2,spi:1,sta:1,str:0,agi:0,dps:.5,armor:.01},
    desc:'Fire and frost from range. Huge damage, little health, watch your mana.'},
  priest:{name:'Priest',role:'Healer / Damage',res:'mana',armor:['cloth'],weap:['staff','mace'],off:'tome',col:'#f0f0f0',
    base:{str:11,agi:12,int:22,sta:18,spi:24},grow:{str:0,agi:.5,int:1.5,sta:1,spi:2},w:{int:1.5,spi:1.5,sta:1,str:0,agi:0,dps:.5,armor:.01},
    desc:'Holy light and shadow. Heals and shields keep you standing through long fights.'},
  hunter:{name:'Hunter',role:'Damage · Pet tamer',res:'mana',armor:['leather','cloth'],weap:['bow'],off:'dagger',col:'#abd473',
    base:{str:16,agi:24,int:14,sta:20,spi:14},grow:{str:.5,agi:2,int:.8,sta:1.5,spi:.5},w:{agi:2,sta:1,int:.5,str:0,spi:0,dps:4,armor:.02},
    desc:'Tames wild beasts and fights beside them. Rarer beasts make stronger pets, and your bond grows with every fight.'},
};
const STAT_NAME={str:'Strength',agi:'Agility',int:'Intellect',sta:'Stamina',spi:'Spirit'};

const ZONES={
  thornvale:{name:'Thornvale',lv:[1,10],faction:'concord',hub:'Thornvale Abbey',sky:['#86b7e6','#dff0d0'],hill:'#4f7a3a',ground:'#5f8f3f',
    mobs:[
      {id:'wolf',name:'Young Wolf',lv:[1,2],kind:'beast',fam:'wolf',col:'#8a8a8a'},
      {id:'digger',name:'Tunnel Digger',lv:[2,4],kind:'humanoid',col:'#b07a3a',drop:'Waxy Candle'},
      {id:'boar',name:'Thornback Boar',lv:[4,6],kind:'beast',fam:'boar',col:'#7a4a2a',drop:'Thornback Tusk'},
      {id:'bandit',name:'Redkerchief Bandit',lv:[5,7],kind:'humanoid',col:'#c0392b',drop:'Red Kerchief'},
      {id:'foreman',name:'Digger Foreman',lv:[7,9],kind:'humanoid',col:'#d0a050'},
      {id:'grizzle',name:'Grizzlemaw',lv:[10,10],kind:'beast',fam:'wolf',col:'#5a5a6a',elite:true,rare:true},
    ]},
  redsand:{name:'Redsand Steppe',lv:[1,10],faction:'wild',hub:'Bloodstone Camp',sky:['#e8a868','#f6dcb0'],hill:'#a5552e',ground:'#b8683a',
    mobs:[
      {id:'lizard',name:'Sun Lizard',lv:[1,2],kind:'beast',fam:'lizard',col:'#c9a03a'},
      {id:'hyena',name:'Dust Hyena',lv:[2,4],kind:'beast',fam:'hyena',col:'#b8925a',drop:'Hyena Mane'},
      {id:'razor',name:'Razorhide Boar',lv:[4,6],kind:'beast',fam:'boar',col:'#6a3a2a',drop:'Razorhide Pelt'},
      {id:'outcast',name:'Outcast Raider',lv:[5,7],kind:'humanoid',col:'#5a6a3a',drop:'Raider Totem'},
      {id:'harpy',name:'Cliff Harpy',lv:[7,9],kind:'humanoid',col:'#8a5ab0'},
      {id:'duneclaw',name:'Kraska Duneclaw',lv:[10,10],kind:'beast',fam:'cat',col:'#a03020',elite:true,rare:true},
    ]},
  fens:{name:'Greywater Fens',lv:[10,20],faction:null,hub:{concord:'Fenwatch Post',wild:'Mudtusk Camp'},sky:['#7d8f8a','#b9c4b0'],hill:'#3f5a48',ground:'#4a5e3c',
    mobs:[
      {id:'gloomfin',name:'Gloomfin Hunter',lv:[10,12],kind:'humanoid',col:'#3a8a7a',drop:'Gloomfin Scale'},
      {id:'lurker',name:'Bog Lurker',lv:[12,14],kind:'beast',fam:'croc',col:'#4a6a3a'},
      {id:'spider',name:'Fen Spider',lv:[13,15],kind:'beast',fam:'spider',col:'#3a3a4a',drop:'Bog Silk'},
      {id:'cultist',name:'Drowned Cultist',lv:[15,17],kind:'humanoid',col:'#2a5a8a',drop:'Tide Sigil'},
      {id:'troll',name:'Mire Troll',lv:[17,19],kind:'humanoid',col:'#5a8a5a',drop:'Mire Troll Tusk'},
      {id:'prophet',name:'The Drowned Prophet',lv:[20,20],kind:'humanoid',col:'#1a4a7a',elite:true,rare:true},
    ]},
  ashen:{name:'Ashen Ridge',lv:[20,30],faction:null,hub:{concord:'Emberwatch Hold',wild:'Cinderhorn Outpost'},sky:['#75434a','#e5a16a'],hill:'#493333',ground:'#65463c',
    mobs:[
      {id:'ashwolf',name:'Cinderfang Wolf',lv:[20,22],kind:'beast',fam:'wolf',col:'#9a5440',drop:'Cinderfang Pelt'},
      {id:'ridgeboar',name:'Obsidian Boar',lv:[22,24],kind:'beast',fam:'boar',col:'#38343c',drop:'Obsidian Tusk'},
      {id:'ogre',name:'Ridgebreaker Ogre',lv:[23,25],kind:'humanoid',col:'#a38a61',drop:'Stolen Supply Crate'},
      {id:'embercult',name:'Ember Covenant Adept',lv:[25,27],kind:'humanoid',col:'#b54e32',drop:'Ember Seal'},
      {id:'slagscale',name:'Slagscale Lizard',lv:[27,29],kind:'beast',fam:'lizard',col:'#da7939',drop:'Heatproof Scale'},
      {id:'coalmaw',name:'Coalmaw, the Living Furnace',lv:[30,30],kind:'beast',fam:'boar',col:'#b53d26',elite:true,rare:true},
    ]},
};
const ZONE_ORDER={concord:['thornvale','fens','ashen'],wild:['redsand','fens','ashen']};

const QUESTS={
  thornvale:[
    {id:'t1',name:'Wolves at the Fence',giver:'Farmer Aldous',text:'The wolves have taken three of my lambs this week. Thin them out before they take the rest.',type:'kill',mob:'wolf',n:8,lvl:1},
    {id:'t2',name:'Candles in the Dark',giver:'Deputy Rhea',text:'The Diggers in the old mine steal our candles. Bring back what they took.',type:'collect',mob:'digger',n:8,lvl:2},
    {id:'t3',name:'Clearing the Old Mine',giver:'Deputy Rhea',text:'Enough is enough. Drive the Diggers out of the mine.',type:'kill',mob:'digger',n:10,lvl:3,req:'t2'},
    {id:'t4',name:'Tusks for the Smith',giver:'Smith Corwen',text:'Thornback tusk makes the best handles in the valley. Six should do.',type:'collect',mob:'boar',n:6,lvl:4},
    {id:'t5',name:'The Redkerchief Gang',giver:'Captain Morrow',text:'Bandits are robbing the road to the abbey. Show them the law.',type:'kill',mob:'bandit',n:10,lvl:5},
    {id:'t6',name:'Proof of the Deed',giver:'Captain Morrow',text:'Bring me their red kerchiefs so I can pay the bounty.',type:'collect',mob:'bandit',n:8,lvl:6,req:'t5'},
    {id:'t7',name:"The Foreman's Ledger",giver:'Deputy Rhea',text:'Someone is giving the Diggers orders. Find the foremen and end it.',type:'kill',mob:'foreman',n:8,lvl:7,req:'t3'},
    {id:'t8',name:'Grizzlemaw',giver:'Farmer Aldous',text:'The old wolf that leads the pack is bigger than a horse. Bring friends, or a lot of courage.',type:'kill',mob:'grizzle',n:1,lvl:10,elite:true,req:'t1'},
  ],
  redsand:[
    {id:'r1',name:'Lizards in the Water',giver:'Elder Ugra',text:'Sun lizards foul our watering hole. Drive them off.',type:'kill',mob:'lizard',n:8,lvl:1},
    {id:'r2',name:'Manes for the Hunt',giver:'Huntress Kesh',text:'Young hunters prove themselves with hyena manes. Prove yourself.',type:'collect',mob:'hyena',n:8,lvl:2},
    {id:'r3',name:'The Laughing Packs',giver:'Huntress Kesh',text:'The hyenas grow bold. Cut their numbers.',type:'kill',mob:'hyena',n:10,lvl:3,req:'r2'},
    {id:'r4',name:'Razorhide Pelts',giver:'Tanner Bosk',text:'Razorhide makes armor that turns a blade. Six pelts.',type:'collect',mob:'razor',n:6,lvl:4},
    {id:'r5',name:'Outcasts',giver:'Warchief Drogan',text:'Raiders cast out of the clans attack our caravans. Show them why they were cast out.',type:'kill',mob:'outcast',n:10,lvl:5},
    {id:'r6',name:'Broken Totems',giver:'Warchief Drogan',text:'Take their totems. Without them they have no clan, no luck.',type:'collect',mob:'outcast',n:8,lvl:6,req:'r5'},
    {id:'r7',name:'Harpies on the Cliffs',giver:'Elder Ugra',text:'The cliff harpies have taken our scouts. Climb up and end their nests.',type:'kill',mob:'harpy',n:8,lvl:7,req:'r3'},
    {id:'r8',name:'Kraska Duneclaw',giver:'Huntress Kesh',text:'The great beast of the dunes. Many hunters went out. None came back.',type:'kill',mob:'duneclaw',n:1,lvl:10,elite:true,req:'r1'},
  ],
  fens:[
    {id:'f1',name:'Scales of the Gloomfin',giver:['Scout Merrin','Tracker Vosh'],text:'The gloomfins came up out of the water a month ago. Bring their scales so we can learn why.',type:'collect',mob:'gloomfin',n:8,lvl:10},
    {id:'f2',name:'Hold the Causeway',giver:['Captain Hale','Blademaster Ruk'],text:'Gloomfin hunting parties are cutting the causeway. Hold it.',type:'kill',mob:'gloomfin',n:12,lvl:11},
    {id:'f3',name:'What Lurks Below',giver:['Scout Merrin','Tracker Vosh'],text:'Something drags travelers into the bog. Find it and kill it.',type:'kill',mob:'lurker',n:10,lvl:12},
    {id:'f4',name:'Silk for Bandages',giver:['Sister Ilsa','Mender Garra'],text:'Our wounded need bandages and fen silk is strong. Eight bundles.',type:'collect',mob:'spider',n:8,lvl:13},
    {id:'f5',name:'The Spider Nests',giver:['Captain Hale','Blademaster Ruk'],text:'The spiders are breeding faster than we can burn them.',type:'kill',mob:'spider',n:12,lvl:14,req:'f4'},
    {id:'f6',name:'Signs of the Tide',giver:['Sister Ilsa','Mender Garra'],text:'Cultists in the drowned ruins carry strange sigils. Bring them to me.',type:'collect',mob:'cultist',n:8,lvl:15,req:'f2'},
    {id:'f7',name:'The Drowned Cult',giver:['Captain Hale','Blademaster Ruk'],text:'They worship something under the water. Stop the ritual before it finishes.',type:'kill',mob:'cultist',n:12,lvl:16,req:'f6'},
    {id:'f8',name:'Trolls in the Mire',giver:['Scout Merrin','Tracker Vosh'],text:'Mire trolls guard the way to the ruins. Clear a path.',type:'kill',mob:'troll',n:10,lvl:17},
    {id:'f9',name:'Tusks of the Mire',giver:['Smith Dunstan','Smith Grall'],text:'Troll tusk is harder than iron. I can work with eight.',type:'collect',mob:'troll',n:8,lvl:18,req:'f8'},
    {id:'f10',name:'The Drowned Prophet',giver:['Captain Hale','Blademaster Ruk'],text:'The cult answers to one voice. Silence it. Then we can enter the Drowned Sanctum.',type:'kill',mob:'prophet',n:1,lvl:20,elite:true,req:'f7'},
  ],
  ashen:[
    {id:'a1',name:'Teeth in the Ash',giver:['Ranger Elowen','Scout Brakka'],text:'Cinderfang packs follow every caravan. Make the ridge road safe.',type:'kill',mob:'ashwolf',n:12,lvl:20},
    {id:'a2',name:'Cinderfang Cloaks',giver:['Smith Halden','Tanner Ursha'],text:'Their pelts resist sparks. Our scouts need new cloaks.',type:'collect',mob:'ashwolf',n:8,lvl:21,req:'a1'},
    {id:'a3',name:'Black Glass Tusks',giver:['Smith Halden','Tanner Ursha'],text:'Obsidian tusks hold an edge even in this heat. Bring me eight.',type:'collect',mob:'ridgeboar',n:8,lvl:22},
    {id:'a4',name:'Break the Ridgebreakers',giver:['Captain Veyra','Warden Korr'],text:'The ogres have seized the mountain pass. Drive them back.',type:'kill',mob:'ogre',n:12,lvl:23},
    {id:'a5',name:'The Missing Caravan',giver:['Captain Veyra','Warden Korr'],text:'Recover our supplies from the ogre camps before the outpost runs dry.',type:'collect',mob:'ogre',n:10,lvl:24,req:'a4'},
    {id:'a6',name:'Seals of the Covenant',giver:['Scholar Iven','Seer Morra'],text:'A fire cult is paying the ogres. Their seals will reveal who gives the orders.',type:'collect',mob:'embercult',n:8,lvl:25,req:'a5'},
    {id:'a7',name:'Extinguish the Covenant',giver:['Captain Veyra','Warden Korr'],text:'They plan to awaken something beneath the ridge. Stop their rites.',type:'kill',mob:'embercult',n:14,lvl:26,req:'a6'},
    {id:'a8',name:'Scales Against the Flame',giver:['Smith Halden','Tanner Ursha'],text:'Slagscale hides survive molten stone. We will need them for the descent.',type:'collect',mob:'slagscale',n:10,lvl:27},
    {id:'a9',name:'The Molten Trail',giver:['Ranger Elowen','Scout Brakka'],text:'Slagscales block the trail to the foundry. Clear our approach.',type:'kill',mob:'slagscale',n:14,lvl:28,req:'a8'},
    {id:'a10',name:'Coalmaw',giver:['Captain Veyra','Warden Korr'],text:'The great boar feeds on the foundry runoff. Bring allies and end its rampage.',type:'kill',mob:'coalmaw',n:1,lvl:30,elite:true,req:'a7'},
  ],
};
