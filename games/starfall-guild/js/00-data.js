'use strict';

const KEY='starfall-guild-save-v1';
Arcade.validators[KEY]=o=>!!(o&&o.stats&&Array.isArray(o.party)); // L2: what a Starfall Guild save looks like
const $=s=>document.querySelector(s);
const now=()=>Date.now();

/* ================= content ================= */
const CLASSES={
  swordsman:{name:'Swordsman',atk:10,hp:60,color:'#3a6fd8',note:'Steady all-rounder.'},
  knight:{name:'Knight',atk:6,hp:115,color:'#6b7a90',note:'Huge health. Holds the line.'},
  mage:{name:'Mage',atk:17,hp:34,color:'#8b5cf6',note:'Hits hardest, breaks easily.'},
  archer:{name:'Archer',atk:12,hp:44,color:'#3fa66b',note:'25% chance of a double-damage crit.',crit:0.25},
  cleric:{name:'Cleric',atk:4,hp:52,color:'#d9a21b',note:'Heals the party 4% each turn.',heal:0.04},
  thief:{name:'Thief',atk:8,hp:46,color:'#c2412f',note:'+20% gold from monsters.',gold:0.2},
  monk:{name:'Monk',atk:11,hp:72,color:'#e07a2e',note:'Strong and sturdy.'},
};
const CLS_IDS=Object.keys(CLASSES);
const STAR_MULT=[0,1,1.7,2.9,5,8.5];
const NAMES=['Aki','Ren','Yuna','Kaito','Hana','Sora','Mio','Riku','Nao','Haru','Emi','Kenji','Lumi','Rin','Taro','Saki','Yuki','Shin','Kira','Momo','Daichi','Aoi','Hikari','Jun','Natsu','Rei','Kai','Mei','Tsubasa','Ichika','Kotone','Ryo'];
const HAIR=['#ff8fb1','#5b8def','#d8dde6','#e0483e','#2b2b3a','#f7d046','#59c38a','#9b6bd6','#f08a3c','#7a4a2a'];

const COMBOS=[
  {id:'wall',name:'Holy Wall',need:'Knight + Cleric',test:c=>c.knight&&c.cleric,hp:1.5,desc:'Party HP ×1.5'},
  {id:'volley',name:'Arcane Volley',need:'Mage + Archer',test:c=>c.mage&&c.archer,atk:1.4,desc:'Attack ×1.4'},
  {id:'shadow',name:'Shadow Pact',need:'Thief + Archer',test:c=>c.thief&&c.archer,gold:1.5,desc:'Monster gold ×1.5'},
  {id:'dojo',name:'Dojo Bond',need:'Monk + Swordsman',test:c=>c.monk&&c.swordsman,atk:1.25,hp:1.25,desc:'Attack and HP ×1.25'},
  {id:'brother',name:'Brotherhood',need:'3 of one class',test:c=>Object.values(c).some(v=>v>=3),atk:1.6,desc:'Attack ×1.6'},
  {id:'classic',name:'Classic Party',need:'4 different classes',test:c=>Object.keys(c).length>=4,atk:1.3,hp:1.3,gold:1.3,desc:'Attack, HP and gold ×1.3'},
];

const MONSTERS=[
  {n:'Slime',k:'slime',c:'#5ccf6b'},{n:'Cave Bat',k:'bat',c:'#7a5fb0'},{n:'Goblin',k:'hum',c:'#7fae3c'},{n:'Skeleton',k:'hum',c:'#e8e4d4'},
  {n:'Golem',k:'hum',c:'#9a8a78'},{n:'Wraith',k:'ghost',c:'#8fb6ff'},{n:'Wyvern',k:'bat',c:'#d0583f'},{n:'Dragon',k:'dragon',c:'#e0483e'}];
const PREFIX=['','Elder ','Ancient ','Abyssal ','Celestial ','Void ','Mythic '];

const BIZ=[
  {name:'Potion Stall',ch:'P',col:'#3fa66b',base:15,inc:1,growth:1.07,floor:1},
  {name:'Bakery',ch:'B',col:'#e07a2e',base:220,inc:8,growth:1.08,floor:3},
  {name:'Armory',ch:'A',col:'#6b7a90',base:3500,inc:60,growth:1.09,floor:8},
  {name:'Alchemy Lab',ch:'L',col:'#8b5cf6',base:5e4,inc:450,growth:1.10,floor:15},
  {name:'Magic Emporium',ch:'M',col:'#3a6fd8',base:8e5,inc:3600,growth:1.11,floor:25},
  {name:'Airship Dock',ch:'D',col:'#2a9db0',base:1.4e7,inc:3e4,growth:1.12,floor:40},
  {name:'Dragon Bank',ch:'$',col:'#e0483e',base:3e8,inc:2.6e5,growth:1.13,floor:60},
];
const FAC=[
  {id:'smith',name:'Blacksmith',ch:'S',col:'#6b7a90',base:100,mult:2.3,max:Infinity,desc:l=>`Party attack ×1.15 per level. Now ×${fmt(1.15**l)}.`},
  {id:'chapel',name:'Chapel',ch:'C',col:'#d9a21b',base:100,mult:2.3,max:Infinity,desc:l=>`Party HP ×1.15 per level. Now ×${fmt(1.15**l)}.`},
  {id:'inn',name:'Inn',ch:'I',col:'#c2412f',base:150,mult:2.4,max:12,desc:l=>`Faster rest after a defeat, more healing between fights. Rest now ${restBase(l).toFixed(1)}s.`},
  {id:'tavern',name:'Tavern',ch:'T',col:'#e07a2e',base:300,mult:2.8,max:10,desc:l=>`Better recruits on the board. ★3 or better: ${Math.round(highOdds(l,S.crest.rep||0)*100)}%.`},
  {id:'training',name:'Training Grounds',ch:'G',col:'#3fa66b',base:500,mult:2.5,max:15,desc:l=>`Level-up costs ×0.94 per level. Now ×${(0.94**l).toFixed(2)}.`},
  {id:'counting',name:'Counting House',ch:'¥',col:'#3a6fd8',base:250,mult:2.3,max:Infinity,desc:l=>`Shop income ×1.2 per level. Now ×${fmt(1.2**l)}.`},
];

const RELICS={
  whet:{name:'Whetstone',r:'common',desc:'Attack ×1.3',atk:1.3},
  pouch:{name:'Leather Pouch',r:'common',desc:'Monster gold ×1.4',gold:1.4},
  band:{name:'Bandages',r:'common',desc:'Party HP ×1.4',hp:1.4},
  ledger:{name:'Merchant Ledger',r:'common',desc:'Shop income ×1.6',biz:1.6},
  coin:{name:'Lucky Coin',r:'common',desc:'Recruits cost 30% less',recruit:0.7},
  brand:{name:'Flame Brand',r:'rare',desc:'Attack ×2',atk:2},
  aegis:{name:'Aegis Charm',r:'rare',desc:'Party HP ×2',hp:2},
  idol:{name:'Golden Idol',r:'rare',desc:'All gold ×2.5',gold:2.5,biz:2.5},
  glass:{name:'Hourglass',r:'rare',desc:'Battles run 1.5× faster',speed:1.5},
  spring:{name:'Healing Spring',r:'rare',desc:'Rest 70% shorter, more healing between fights',rest:0.3,regen:0.2},
  heart:{name:'Dragon Heart',r:'epic',desc:'Attack ×4',atk:4},
  crown:{name:'Crown of Ages',r:'epic',desc:'All gold ×5',gold:5,biz:5},
  phoenix:{name:'Phoenix Feather',r:'epic',desc:'Defeats never cost a floor, and rest is instant',unique:true,phoenix:true},
  saga:{name:"Hero's Saga",r:'epic',desc:'Attack +1% for every party level',unique:true,saga:true},
};
const RAR_ORDER={common:0,rare:1,epic:2};

const REGIONS={
  meadow:{name:'Greenleaf Meadow',mods:['No modifiers'],flavor:'Where every guild starts. Gentle slimes and cheap rent.',ren:1},
  frost:{name:'Frostpeak',mods:['Monsters have 1.5× HP','Renown ×1.4'],flavor:'Snowbound ruins full of patient monsters.',mhp:1.5,ren:1.4},
  desert:{name:'Sunken Desert',mods:['Monster gold ×2','Monsters hit 1.5× harder'],flavor:'Buried treasure and angry guardians.',gold:2,matk:1.5,ren:1},
  sky:{name:'Sky Isles',mods:['Shop income ×3','Party HP ×0.7'],flavor:'Trade winds bring rich customers. The fall is long.',biz:3,hp:0.7,ren:1},
  haunt:{name:'Haunted Wood',mods:['A boss every 5 floors','Monsters hit 1.3× harder','Renown ×1.2'],flavor:'More bosses, more relics, more screaming.',boss5:true,matk:1.3,ren:1.2},
  caldera:{name:'Ember Caldera',mods:['Party attack ×1.6','Rest takes 2× longer'],flavor:'The heat sharpens blades and tempers.',atk:1.6,rest:2,ren:1},
  harbor:{name:'Port Lumen',mods:['Recruits cost half','4 adventurers on the board'],flavor:'Every ship brings someone looking for work.',recruit:0.5,board:1,ren:1},
};

const CREST=[
  {id:'banner',name:'Guild Banner',desc:l=>`All gold ×2 per level. Now ×${fmt(2**l)}.`,cost:l=>Math.ceil(3**l),max:Infinity},
  {id:'drills',name:'Veteran Drills',desc:l=>`Attack and HP ×1.5 per level. Now ×${fmt(1.5**l)}.`,cost:l=>Math.ceil(2*2.5**l),max:Infinity},
  {id:'hall',name:'Bigger Hall',desc:l=>`+1 party slot. Party size now ${3+l}.`,cost:l=>[5,40,300][l],max:3},
  {id:'rep',name:'Reputation',desc:l=>'Higher-star adventurers visit the Tavern more often.',cost:l=>Math.ceil(4*3**l),max:5},
  {id:'funds',name:'Starting Funds',desc:l=>`Begin each season with ${fmt(startGold(l+1))} gold.`,cost:l=>Math.ceil(2*4**l),max:6},
  {id:'legends',name:'Hall of Legends',desc:l=>`Your ${l+1} strongest adventurer${l?'s':''} stay through a new season (back to level 1).`,cost:l=>Math.ceil(10*6**l),max:3},
  {id:'staffx',name:'Staff Training',desc:l=>`Staff act 25% faster. Now every ${staffIv(l).toFixed(2)}s.`,cost:l=>Math.ceil(3*2.5**l),max:8},
  {id:'night',name:'Night Shift',desc:l=>`While you're away the guild earns ${50+10*(l+1)}% of normal (now ${50+10*l}%).`,cost:l=>Math.ceil(4*3**l),max:5},
];
const startGold=l=>60+(l?100*10**(l-1):0);
const staffIv=l=>Math.max(0.15,3*Math.pow(0.75,l));
const restBase=l=>8*Math.pow(0.85,l);
function highOdds(tav,rep){const w=starWeights(tav,rep);const t=w.reduce((a,b)=>a+b,0);return (w[2]+w[3]+w[4])/t;}
function starWeights(tav,rep){const s=tav+rep*1.5;return [55,28+s*0.6,12+s*1.2,4+s*0.8,1+s*0.35];}

const STAFF=[
  {id:'mina',who:'Mina',role:'Receptionist',hair:'#ff8fb1',col:'#3a6fd8',desc:'Hires from the Tavern board: fills empty slots, and swaps out your weakest adventurer when a higher-star one is affordable.',req:'Recruit 5 adventurers',prog:()=>[S.stats.recruits,5]},
  {id:'kuro',who:'Sensei Kuro',role:'Trainer',hair:'#d8dde6',col:'#e07a2e',desc:'Levels up your cheapest adventurer, on a timer.',req:'Get any adventurer to level 15',prog:()=>[S.stats.maxLvl,15]},
  {id:'gruff',who:'Gruff',role:'Quartermaster',hair:'#7a4a2a',col:'#3fa66b',desc:'Buys the cheapest shop in town, on a timer.',req:'Own 30 shops in one season',prog:()=>[S.stats.bizMax,30]},
  {id:'brann',who:'Brann',role:'Smith',hair:'#e0483e',col:'#6b7a90',desc:'Upgrades the cheapest town facility, on a timer.',req:'Reach 10 total facility levels in one season',prog:()=>[S.stats.facMax,10]},
  {id:'nyx',who:'Nyx',role:'Scout',hair:'#9b6bd6',col:'#2b2b3a',desc:'Picks relics for you, rarest first, and refreshes the Tavern board for free every 30 seconds.',req:'Defeat 3 bosses',prog:()=>[S.stats.bosses,3]},
  {id:'aldric',who:'Aldric',role:'Guildmaster',hair:'#f7d046',col:'#8b5cf6',desc:'Starts a new season once it would pay your chosen Renown, and takes the first region offered.',req:'Complete 5 seasons',prog:()=>[S.stats.seasons,5]},
];

const ROAD=[
  ['Season 1 · the guild hall','Party, Tavern, Town, Staff and seasons. You are here.',true],
  ['Class advancement','Swordsman to Blade Master, Mage to Archmage. Every class gets a second tier.'],
  ['Expeditions','Send a second and third party to other dungeons while the first one pushes.'],
  ['Guild rivals','Autobattle other guilds in ranked tournaments.'],
  ['The kingdom','Build a whole city of guilds, managed by your best staff.'],
  ['The starfall','Floors past 1e308. Infinity stops being a figure of speech.'],
];

/* ================= utils ================= */
const {fmt,fmtI,fmtTime}=window.Arcade;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const floorName=f=>`B${f}F`;

