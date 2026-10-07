'use strict';

/* ================= economy ================= */
function gain(x){if(x>0)S.gold=Math.min(1e300,S.gold+x);}
function bizCostN(i,k){const b=BIZ[i],n=S.biz[i];return b.base*Math.pow(b.growth,n)*(Math.pow(b.growth,k)-1)/(b.growth-1);}
function bizMax(i){const b=BIZ[i],c0=b.base*Math.pow(b.growth,S.biz[i]);if(S.gold<c0)return 0;let k=Math.floor(Math.log(S.gold*(b.growth-1)/c0+1)/Math.log(b.growth));while(k>0&&bizCostN(i,k)>S.gold)k--;return k;}
function bizUnlocked(i){return S.best>=BIZ[i].floor;}
function buyBiz(i,mode){if(!bizUnlocked(i))return false;const k=mode==='max'?bizMax(i):Number(mode);if(k<=0)return false;const c=bizCostN(i,k);if(c>S.gold)return false;
  const before=Math.floor(S.biz[i]/25);S.gold-=c;S.biz[i]+=k;if(Math.floor(S.biz[i]/25)>before)toast(`${BIZ[i].name} income doubled!`,'var(--blue)');
  const tot=S.biz.reduce((a,b)=>a+b,0);if(tot>S.stats.bizMax)S.stats.bizMax=tot;D=derive();sfx('coin');return true;}
function facCost(f){const l=S.fac[f.id]||0;return Math.ceil(f.base*Math.pow(f.mult,l));}
function buyFac(id){const f=FAC.find(x=>x.id===id),l=S.fac[id]||0;if(l>=f.max)return false;const c=facCost(f);if(S.gold<c)return false;
  S.gold-=c;S.fac[id]=l+1;const tot=Object.values(S.fac).reduce((a,b)=>a+b,0);if(tot>S.stats.facMax)S.stats.facMax=tot;D=derive();sfx('coin');return true;}
function lvlCostN(a,k){const base=5*(1+0.5*a.star)*D.lvlM,r=1.16;return base*Math.pow(r,a.lvl-1)*(Math.pow(r,k)-1)/(r-1);}
function lvlMax(a){const base=5*(1+0.5*a.star)*D.lvlM,r=1.16,c0=base*Math.pow(r,a.lvl-1);if(S.gold<c0)return 0;let k=Math.floor(Math.log(S.gold*(r-1)/c0+1)/Math.log(r));while(k>0&&lvlCostN(a,k)>S.gold)k--;return k;}
function levelUp(id,mode){const a=S.party.find(x=>x.id===id);if(!a)return false;const k=mode==='max'?lvlMax(a):Number(mode);if(k<=0)return false;const c=lvlCostN(a,k);if(c>S.gold)return false;
  S.gold-=c;const oldMax=D.pmax;a.lvl+=k;if(a.lvl>S.stats.maxLvl)S.stats.maxLvl=a.lvl;D=derive();if(!S.resting)S.php+=Math.max(0,D.pmax-oldMax);sfx('level');return true;}

/* ================= tavern ================= */
function rollStar(){const w=starWeights(S.fac.tavern||0,S.crest.rep||0);let t=w.reduce((a,b)=>a+b,0),r=Math.random()*t;for(let i=0;i<5;i++){r-=w[i];if(r<=0)return i+1;}return 1;}
function recruitCost(a){return Math.ceil(30*Math.pow(3.2,a.star-1)*D.recruitM);}
function refreshBoard(){S.board=Array.from({length:D.boardN},()=>{S.nextId++;return {id:S.nextId,name:pick(NAMES),cls:pick(CLS_IDS),star:rollStar(),lvl:1,hair:pick(HAIR)};});S.boardT=90;}
function rerollCost(){return Math.ceil((20+S.best*6)*Math.pow(1.5,S.rerolls));}
function recruit(id){const a=S.board.find(x=>x.id===id);if(!a||S.party.length>=D.size)return false;const c=recruitCost(a);if(S.gold<c)return false;
  S.gold-=c;S.board=S.board.filter(x=>x.id!==id);S.party.push(a);S.stats.recruits++;const oldMax=D.pmax;D=derive();if(!S.resting)S.php+=D.pmax-oldMax;
  log(`<b>${a.name}</b> the ${stars(a.star).replace(/☆/g,'')} ${CLASSES[a.cls].name} joined the guild.`);checkCombos();sfx('quest');return true;}
function dismiss(id){const a=S.party.find(x=>x.id===id);if(!a)return;S.party=S.party.filter(x=>x.id!==id);D=derive();S.php=Math.min(S.php,D.pmax);log(`${a.name} left the guild.`);}
function checkCombos(){for(const c of D.combos){if(!S.combosFound[c.id]){S.combosFound[c.id]=true;toast(`Combo found: ${c.name}! ${c.desc}`,'var(--gold)');log(`Combo discovered: <b>${c.name}</b>.`);}}}
function power(a,i){const e=D.each[i];return e?e.atk+e.hp/5:0;}

/* ================= seasons ================= */
const SEASON_MIN=20;
function renownFor(best){return best<SEASON_MIN?0:Math.floor(Math.pow(best/SEASON_MIN,3)*R().ren);}
function renownGain(){return renownFor(S.best);}
function nextRenownFloor(){const g=renownGain();for(let f=Math.max(S.best+1,SEASON_MIN);f<S.best+500;f++)if(renownFor(f)>g)return f;return null;}
function newSeason(auto){
  const g=renownGain();if(g<=0||S.regionOffer)return;
  const keepN=S.crest.legends||0;const ranked=S.party.map((a,i)=>({a,p:power(a,i)})).sort((x,y)=>y.p-x.p).slice(0,keepN).map(o=>Object.assign({},o.a,{lvl:1}));
  S.renown+=g;S.renownLife+=g;S.stats.seasons++;sfx('badge');
  log(`Season ${S.stats.seasons} ended at ${floorName(S.best)}. +${fmt(g)} Renown.`);
  const prev=S.region;
  Object.assign(S,{gold:startGold(S.crest.funds||0),floor:1,best:1,push:true,pushWait:0,party:ranked,board:[],boardT:0,rerolls:0,biz:BIZ.map(()=>0),fac:{},
    relics:[],relicPending:0,relicOffer:null,mon:null,php:0,resting:0,acc:0});
  S.stats.run=0;S.stats.bizMax=0;S.stats.facMax=0;
  const ids=Object.keys(REGIONS).filter(k=>k!=='meadow'&&k!==prev),offer=[];
  while(offer.length<3&&ids.length)offer.push(ids.splice(Math.floor(Math.random()*ids.length),1)[0]);
  S.regionOffer=offer;D=derive();
  if(auto)chooseRegion(offer[0],true);
}
function chooseRegion(id,auto){if(!S.regionOffer||!S.regionOffer.includes(id))return;S.region=id;S.regionOffer=null;D=derive();refreshBoard();
  if(!S.party.length){const a=makeAdv(1,'swordsman');S.party.push(a);}
  D=derive();S.php=D.pmax;spawn();
  log(`Season ${S.stats.seasons+1} begins in ${REGIONS[id].name}.`);toast(`${auto?'Aldric: ':''}New season in ${REGIONS[id].name}!`,'var(--violet)');closeModal();}

/* ================= staff ================= */
function staffOn(id){return S.staff.unl[id]&&S.staff.on[id];}
function checkStaff(){for(const s of STAFF){if(S.staff.unl[s.id])continue;const [a,b]=s.prog();if(a>=b){S.staff.unl[s.id]=true;S.staff.on[s.id]=s.id!=='aldric';S.seenStaff=false;
  log(`<b>${s.who}</b> the ${s.role} joined your staff.`);toast(`${s.who} the ${s.role} wants to work for you!`,'var(--green)');}}}
function runStaff(h){
  const iv=staffIv(S.crest.staffx||0);
  const due=id=>{S.staff.t[id]=(S.staff.t[id]||0)+h;if(S.staff.t[id]>=iv){S.staff.t[id]=0;return true;}return false;};
  if(staffOn('mina')&&due('mina')){
    const aff=S.board.filter(a=>recruitCost(a)<=S.gold).sort((x,y)=>y.star-x.star);
    if(aff.length){if(S.party.length<D.size)recruit(aff[0].id);
      else{let wi=-1,wp=Infinity;S.party.forEach((a,i)=>{const p=a.star*1e6+a.lvl;if(p<wp){wp=p;wi=i;}});const weak=S.party[wi];
        if(weak&&aff[0].star>weak.star){dismiss(weak.id);recruit(aff[0].id);}}}}
  if(staffOn('kuro')&&due('kuro')){for(let n=0;n<5;n++){let best=null,bc=Infinity;for(const a of S.party){const c=lvlCostN(a,1);if(c<bc){bc=c;best=a;}}if(!best||!levelUp(best.id,1))break;}}
  if(staffOn('gruff')&&due('gruff')){for(let n=0;n<5;n++){let bi=-1,bc=Infinity;BIZ.forEach((b,i)=>{if(!bizUnlocked(i))return;const c=bizCostN(i,1);if(c<bc){bc=c;bi=i;}});if(bi<0||!buyBiz(bi,1))break;}}
  if(staffOn('brann')&&due('brann')){let bf=null,bc=Infinity;for(const f of FAC){if((S.fac[f.id]||0)>=f.max)continue;const c=facCost(f);if(c<bc){bc=c;bf=f;}}if(bf)buyFac(bf.id);}
  if(staffOn('nyx')){if(S.relicPending>0){ensureRelicOffer();const b=S.relicOffer.slice().sort((x,y)=>RAR_ORDER[RELICS[y].r]-RAR_ORDER[RELICS[x].r]);takeRelic(b[0],true);}
    S.staff.t.nyxB=(S.staff.t.nyxB||0)+h;if(S.staff.t.nyxB>=30){S.staff.t.nyxB=0;refreshBoard();}}
  if(staffOn('aldric')&&S.autoAt>0&&renownGain()>=S.autoAt)newSeason(true);
}

