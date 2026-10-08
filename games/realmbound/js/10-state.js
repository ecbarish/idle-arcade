'use strict';
const ALLQ={};for(const z in QUESTS)for(const q of QUESTS[z]){q.zone=z;ALLQ[q.id]=q;}

/* =================== state =================== */
/* One save holds every character. S.cur is the id of the one being played. */
const MAX_CHARS=8;
const emptyS=()=>({v:2,chars:[],cur:null,last:Date.now(),tab:'quests'});
let S=emptyS();
const H=()=>S.chars.find(c=>c.id===S.cur)||null;
function migrate(o){
  if(!o||typeof o!=='object')return emptyS();
  if(Array.isArray(o.chars)){
    for(const h of o.chars)if(h.onboarding===undefined)h.onboarding=null;
    if(o.guild&&o.guild.founded)o.guild.requests=o.guild.requests||{};
    return o;
  }
  const s=emptyS();s.last=o.last||Date.now();s.tab=o.tab||'quests';
  if(o.hero){const h=o.hero;if(h.onboarding===undefined)h.onboarding=null;h.id=h.id||uid();h.log=o.log||[];h.lastPlayed=o.last||Date.now();s.chars.push(h);s.cur=h.id;}
  return s;
}
function newHero(name,faction,race,cls){
  const h={id:uid(),log:[],lastPlayed:Date.now(),name,faction,race,cls,lvl:1,xp:0,rested:0,money:0,zone:FACTIONS[faction].start,gear:{},bags:[],talents:{},
    quests:{active:[],done:{},prog:{},rewards:{}},addons:{unl:{},on:{}},mode:'focus',grind:null,pets:[],activePet:null,riding:0,mounts:[],mount:null,npcs:genNpcs(faction),party:[],dun:null,dstats:{clears:0,best:-1,runs:0},
    stats:{kills:0,deaths:0,loots:0,junkSold:0,quests:0,equips:0,manual:0,uses:0,play:0,money:0,feeds:0,tamed:0},avg:{cycle:30,xp:20,money:5},seenAddons:true,onboarding:{arrival:false,hints:{}}};
  const K=CLASSES[cls];
  h.gear.weapon=genItem(1,1,'weapon',{cls,type:K.weap[0]});
  h.gear.chest=genItem(1,1,'chest',{cls});
  if(cls==='warrior')h.gear.offhand=genItem(1,1,'offhand',{cls});
  if(cls!=='warrior')h.gear.feet=genItem(1,1,'feet',{cls});
  return h;
}
/* =================== save / offline =================== */
function save(){S.last=Date.now();const h=H();
  if(h&&C){h.cur={hp:C.hp,res:C.res};h.lastPlayed=Date.now();}
  Arcade.save(KEY,S);
  if(h)Arcade.report('realmbound',{summary:`${h.name}, level ${h.lvl} ${RACES[h.race].name} ${CLASSES[h.cls].name}`,detail:`${ZONES[h.zone].name} · ${S.chars.length} character${S.chars.length>1?'s':''}`});}
/* hunt=false for characters you weren't playing: like a classic logout, they only rest at the inn */
function offline(sec,hunt){
  const h=H();if(!h||sec<60)return null;sec=Math.min(sec,86400);if(hunt===undefined)hunt=true;
  const restedGain=h.lvl<LEVEL_CAP?Math.max(0,Math.min(xpNeed(h.lvl)*1.5-h.rested,sec/3600*xpNeed(h.lvl)*.15)):0;h.rested+=restedGain;
  const kills=hunt?Math.floor(sec*.5/Math.max(8,h.avg.cycle)):0;const lvl0=h.lvl;let xp=0;const money=Math.round(kills*h.avg.money);
  if(kills>0&&h.lvl<LEVEL_CAP){xp=Math.round(kills*h.avg.xp);gainXP(xp,false);}h.money+=money;h.stats.kills+=kills;
  return {sec,kills,xp,money,levels:h.lvl-lvl0,rested:restedGain};
}

