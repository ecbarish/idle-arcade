'use strict';
/* Fictional clubs, people and personal purchases. Dollars are game currency. */
const DC = {
  key: 'diamond-career-save-v1', club: 'Brackenport Lanterns', park: 'Lamplight Field',
  coach: 'Iona Vale', opponents: ['Alder Quay Terns', 'Copperbank Rivets', 'Windlecross Kites'],
  teammates: ['You', 'Remi Moss', 'Kit Fenner', 'Ada Lorne', 'Sol Becket', 'Jules Orrin', 'Nell Calder', 'Tavi Reed', 'Pax Alder'],
  pitchers: [{name:'Milo Venn', favorite:'fastball', skill:52}, {name:'Sera Penn', favorite:'curve', skill:56}, {name:'Orin Bell', favorite:'change-up', skill:54}],
  looks: [{name:'Warm umber',skin:'#bb7850',hair:'#302a2a'}, {name:'Golden brown',skin:'#dba572',hair:'#604135'}, {name:'Deep brown',skin:'#81523c',hair:'#26232a'}, {name:'Rose ivory',skin:'#f1c1a3',hair:'#ad583b'}],
  pitches: {'fastball': {duration:1500, cue:'a firm, quick shoulder'}, 'curve':{duration:1900,cue:'a high elbow and an arcing release'}, 'change-up':{duration:2200,cue:'a loose hand behind the back'}},
  offers: {
    wage: {name:'Copperbank Rivets',role:'Rotation batter',bonus:320,wage:240,moments:1,days:[2,4,6]},
    starts: {name:'Alder Quay Terns',role:'Everyday batter',bonus:180,wage:170,moments:3,days:[2,4,6]}
  },
  purchases: {apartment:{name:'A sunlit apartment',price:300},car:{name:'A little teal runabout',price:420}},
  threshold:{hits:5,obp:.300}
};
const copy = o => JSON.parse(JSON.stringify(o));
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
function random(r) { r.seed = (Math.imul(r.seed >>> 0,1664525) + 1013904223) >>> 0; return r.seed / 4294967296; }
function lineStats() { return {pa:0,ab:0,hits:0,walks:0,k:0,hr:0,rbi:0,runs:0}; }
function average(s) { return s.ab ? s.hits/s.ab : 0; }
function onBase(s) { return s.pa ? (s.hits+s.walks)/s.pa : 0; }
function rate(n) { return n.toFixed(3).replace(/^0/,''); }
function money(n) { return '$'+n.toLocaleString('en-US'); }
