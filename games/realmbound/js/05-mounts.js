'use strict';
/* =================== mounts =================== */
/* Mounts shorten travel: finding the next monster, trips to town, changing zones.
   Speed = the mount's base speed (capped by riding skill) + a training bonus that grows as you ride it. */
const RIDING=[{n:'No riding skill',cap:0},{n:'Apprentice Riding',lvl:10,cost:5000,cap:.6},{n:'Journeyman Riding',lvl:20,cost:30000,cap:1}];
const MOUNT_SHOP={
  concord:[{key:'chestnut',name:'Chestnut Horse',kind:'horse',col:'#8a5a2b',rar:1,base:.6,lvl:10,cost:5000},{key:'dapple',name:'Dapple Gray Horse',kind:'horse',col:'#a8a8b0',rar:1,base:.6,lvl:10,cost:5000},
    {key:'swiftwhite',name:'Swift White Steed',kind:'horse',col:'#f0f0f0',rar:3,base:1,lvl:20,cost:40000}],
  wild:[{key:'timber',name:'Timber Wolf',kind:'wolf',col:'#7a6a5a',rar:1,base:.6,lvl:10,cost:5000},{key:'dusk',name:'Dusk Wolf',kind:'wolf',col:'#3a3a4a',rar:1,base:.6,lvl:10,cost:5000},
    {key:'swiftred',name:'Swift Red Wolf',kind:'wolf',col:'#a03020',rar:3,base:1,lvl:20,cost:40000}]};
const REINS={grizzle:{name:'Reins of Grizzlemaw',kind:'wolf',col:'#5a5a6a',rar:4,base:1},duneclaw:{name:'Reins of the Dune Stalker',kind:'cat',col:'#c08040',rar:4,base:1},
  prophet:{name:'Reins of the Tidecaller',kind:'croc',col:'#1a6a8a',rar:4,base:1}};
const MOUNT_TRAIN=[{n:'Green',at:0},{n:'Trained',at:300},{n:'Seasoned',at:1200},{n:'Swift',at:3600},{n:'Champion',at:9000}];
const MOUNTABLE=['wolf','boar','cat','hyena','lizard','croc'];
const PET_MOUNT_SPEED=[.6,.65,.75,.85,1,1.1];
const PET_MOUNT_COST=5000;
const trainLvl=xp=>{let l=0;MOUNT_TRAIN.forEach((t,i)=>{if(xp>=t.at)l=i;});return l;};
function petMountObj(p){return {id:'pet',name:p.name,kind:p.family,col:p.col,rar:p.rar,base:PET_MOUNT_SPEED[p.rar],get xp(){return p.rideXp||0;},set xp(v){p.rideXp=v;},pet:true};}
function activeMount(){const h=H();if(!h||!h.riding)return null;
  if(h.mount==='pet'){const p=petOf();return p&&p.mountTrained&&p.hp>0?petMountObj(p):null;}
  return (h.mounts||[]).find(m=>m.id===h.mount)||null;}
function mountSpeed(m){m=m||activeMount();if(!m)return 0;return Math.min(m.base,RIDING[H().riding].cap)+.05*trainLvl(m.xp||0);}
function travel(t){return t/(1+mountSpeed());}

