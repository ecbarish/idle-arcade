'use strict';

/* ================= state ================= */
function makeAdv(star,cls){S.nextId=(S.nextId||1)+1;return {id:S.nextId,name:pick(NAMES),cls:cls||pick(CLS_IDS),star,lvl:1,hair:pick(HAIR)};}
function fresh(){
  const s={v:1,gold:60,floor:1,best:1,push:true,pushWait:0,party:[],nextId:1,board:[],boardT:90,rerolls:0,
    biz:BIZ.map(()=>0),fac:{},relics:[],relicPending:0,relicOffer:null,mon:null,php:0,resting:0,acc:0,
    region:'meadow',regionOffer:null,renown:0,renownLife:0,crest:{},staff:{unl:{},on:{},t:{}},autoAt:10,seenStaff:true,
    combosFound:{},stats:{recruits:0,maxLvl:1,bosses:0,seasons:0,kills:0,play:0,run:0,bestEver:1,bizMax:0,facMax:0},
    tab:'party',buy:1,last:now(),log:[]};
  return s;
}
function merge(o){
  const f=fresh();if(!o||typeof o!=='object')return f;
  const s=Object.assign(f,o);
  s.stats=Object.assign(fresh().stats,o.stats||{});s.staff=Object.assign({unl:{},on:{},t:{}},o.staff||{});
  s.crest=Object.assign({},o.crest||{});s.fac=Object.assign({},o.fac||{});s.combosFound=Object.assign({},o.combosFound||{});
  s.biz=BIZ.map((_,i)=>(o.biz&&o.biz[i])||0);
  s.relics=(o.relics||[]).filter(r=>RELICS[r]);s.party=(o.party||[]).filter(a=>a&&CLASSES[a.cls]);
  if(!REGIONS[s.region])s.region='meadow';
  return s;
}
let S=fresh(),D=null;
function log(m){S.log.unshift(m);if(S.log.length>40)S.log.length=40;}

/* ================= derived ================= */
function R(){return REGIONS[S.region]||REGIONS.meadow;}
function classCount(){const c={};for(const a of S.party)c[a.cls]=(c[a.cls]||0)+1;return c;}
function relicProd(k){let m=1;for(const id of S.relics){const v=RELICS[id][k];if(typeof v==='number')m*=v;}return m;}
function hasRelic(flag){return S.relics.some(id=>RELICS[id][flag]);}
function derive(){
  const r=R(),cr=id=>S.crest[id]||0,fc=id=>S.fac[id]||0,cc=classCount();
  const combos=COMBOS.filter(c=>c.test(cc));
  let cAtk=1,cHp=1,cGold=1;for(const c of combos){cAtk*=c.atk||1;cHp*=c.hp||1;cGold*=c.gold||1;}
  const renB=1+0.02*S.renown;
  const goldM=Math.pow(2,cr('banner'))*renB*relicProd('gold')*(r.gold||1)*cGold;
  const bizM=Math.pow(2,cr('banner'))*renB*Math.pow(1.2,fc('counting'))*relicProd('biz')*(r.biz||1);
  let atkM=Math.pow(1.15,fc('smith'))*Math.pow(1.5,cr('drills'))*renB*relicProd('atk')*(r.atk||1)*cAtk;
  const hpM=Math.pow(1.15,fc('chapel'))*Math.pow(1.5,cr('drills'))*relicProd('hp')*(r.hp||1)*cHp;
  if(hasRelic('saga')){let L=0;for(const a of S.party)L+=a.lvl;atkM*=1+0.01*L;}
  let patk=0,pmax=0,crit=0,heal=0,thief=0;const each=[];
  for(const a of S.party){const C=CLASSES[a.cls],g=STAR_MULT[a.star]*Math.pow(1.09,a.lvl-1);
    const at=C.atk*g*atkM,hp=C.hp*g*hpM;each.push({atk:at,hp});patk+=at;pmax+=hp;
    if(C.crit)crit+=C.crit*at;if(C.heal)heal+=C.heal;if(C.gold)thief+=C.gold;}
  const critShare=patk?crit/patk:0;
  let gps=0;const bizEach=BIZ.map((b,i)=>{const m=Math.pow(2,Math.floor(S.biz[i]/25));const v=b.inc*S.biz[i]*m*bizM;gps+=v;return {per:b.inc*m*bizM,total:v,mile:m};});
  return {combos,goldM,bizM,atkM,hpM,patk,pmax,critShare,heal,thief,each,gps,bizEach,
    rest:restBase(fc('inn'))*relicProd('rest')*(r.rest||1),regen:0.1+0.04*fc('inn')+S.relics.reduce((a,id)=>a+(RELICS[id].regen||0),0),
    speed:relicProd('speed'),lvlM:Math.pow(0.94,fc('training')),recruitM:relicProd('recruit')*(r.recruit||1),
    size:3+cr('hall'),boardN:3+(r.board||0)};
}

/* ================= save ================= */
function save(){S.last=now();Arcade.save(KEY,S);Arcade.report('starfall-guild',{summary:`Season ${S.stats.seasons+1} · ${floorName(S.floor)} (best ${floorName(S.best)})`,detail:`${S.party.length} adventurers · ${fmt(S.renownLife)} Renown earned · ${R().name}`});}
function load(){return Arcade.load(KEY);}
const exportSave=()=>Arcade.encode(S);
function importSave(t){const o=Arcade.decode(t);if(!o||!o.stats)throw new Error('bad');S=merge(o);S.last=now();D=derive();save();}

