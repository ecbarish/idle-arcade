'use strict';

/* ================= dungeon ================= */
function isBoss(f){return f%(R().boss5?5:10)===0;}
function monFor(f){
  const idx=Math.floor((f-1)/10),M=MONSTERS[idx%MONSTERS.length],pre=PREFIX[Math.min(PREFIX.length-1,Math.floor(idx/MONSTERS.length))],boss=isBoss(f),r=R();
  const hp=40*Math.pow(1.19,f-1)*(boss?5:1)*(r.mhp||1),atk=6*Math.pow(1.17,f-1)*(boss?2.5:1)*(r.matk||1);
  return {f,boss,name:pre+M.n+(boss?' Lord':''),k:M.k,c:M.c,hp,max:hp,atk,gold:5*Math.pow(1.17,f-1)*(boss?10:1)};
}
function spawn(){S.mon=monFor(S.floor);}
const fx={hits:[],monHit:0,partyHit:0,swing:0};
function battleTick(h){
  if(!S.party.length){return;}
  if(!S.mon||S.mon.f!==S.floor)spawn();
  if(S.pushWait>0)S.pushWait=Math.max(0,S.pushWait-h);
  if(S.resting>0){S.resting-=h;if(S.resting<=0){S.resting=0;S.php=D.pmax;}return;}
  if(S.php>D.pmax)S.php=D.pmax;
  S.acc+=h*D.speed;
  let guard=0;
  while(S.acc>=0.5&&guard++<400){
    S.acc-=0.5;const m=S.mon;
    let dmg=D.patk*(0.85+Math.random()*0.3);const crit=Math.random()<0.25*D.critShare;
    if(crit)dmg*=2;m.hp-=dmg;fxHit('m',dmg,crit);
    if(m.hp<=0){
      const g=m.gold*D.goldM*(1+D.thief);gain(g);S.stats.kills++;fxHit('g',g);
      if(m.boss){S.stats.bosses++;S.relicPending++;log(`Defeated <b>${m.name}</b> on ${floorName(m.f)}. A relic dropped!`);toast(`Boss down: ${m.name}. Choose a relic!`,'var(--violet)');}
      S.php=Math.min(D.pmax,S.php+D.pmax*D.regen);
      if(S.push&&S.pushWait<=0){S.floor++;if(S.floor>S.best){S.best=S.floor;if(S.best>S.stats.bestEver)S.stats.bestEver=S.best;
        BIZ.forEach((b,i)=>{if(b.floor===S.best)toast(`${b.name} can now open in town.`,'var(--green)');});}}
      spawn();continue;
    }
    const hit=m.atk*(0.85+Math.random()*0.3);S.php-=hit;S.php=Math.min(D.pmax,S.php+D.pmax*D.heal);fxHit('p',hit);
    if(S.php<=0){
      S.php=0;const ph=hasRelic('phoenix');S.resting=ph?0.01:D.rest;
      if(!ph&&S.floor>1)S.floor--;S.pushWait=30;spawn();
      fx.lastDefeat=performance.now();break;
    }
  }
}
function fxHit(t,v,crit){if(fx.hits.length>30)fx.hits.shift();fx.hits.push({t,v,crit,age:0,x:Math.random()});if(t==='m')fx.monHit=0.15;if(t==='p')fx.partyHit=0.15;fx.swing=0.2;}

/* ================= relics ================= */
function ensureRelicOffer(){if(S.relicOffer||S.relicPending<=0)return;const pool=Object.keys(RELICS).filter(id=>!(RELICS[id].unique&&S.relics.includes(id)));
  const wt={common:65,rare:28,epic:7},out=[];
  while(out.length<3&&out.length<pool.length){const cand=pool.filter(id=>!out.includes(id));let t=0;for(const id of cand)t+=wt[RELICS[id].r];let r=Math.random()*t;
    for(const id of cand){r-=wt[RELICS[id].r];if(r<=0){out.push(id);break;}}if(r>0)out.push(cand[cand.length-1]);}
  S.relicOffer=out;}
function takeRelic(id,auto){if(!S.relicOffer||!S.relicOffer.includes(id))return;S.relics.push(id);S.relicPending--;S.relicOffer=null;D=derive();
  log(`${auto?'Nyx picked':'Took'} the <b>${RELICS[id].name}</b>.`);if(!auto)toast(`${RELICS[id].name}: ${RELICS[id].desc}`,'var(--violet)');}

