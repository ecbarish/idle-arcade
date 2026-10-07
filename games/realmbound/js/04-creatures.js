'use strict';
/* =================== creatures =================== */
/* The creature system: species families, rarity, traits, bond and happiness.
   Written to be lifted out later and shared with the standalone creature game. */
const FAMILIES={
  wolf:{name:'Wolf',pl:'Wolves',role:'Damage',hpM:1,atkM:1.1,speed:2,taunt:.35,diet:'meat',ab:'howl',abName:'Furious Howl',abDesc:'Every 20s: you deal 10% more damage for 10 seconds.'},
  boar:{name:'Boar',pl:'Boars',role:'Tank',hpM:1.25,atkM:.9,speed:2,taunt:.7,diet:'any',ab:'charge',abName:'Charge',abDesc:'Opens each fight with a heavy hit that staggers the enemy.'},
  cat:{name:'Cat',pl:'Cats',role:'Damage',hpM:.9,atkM:1.25,speed:2,taunt:.3,diet:'meat',ab:'claw',abName:'Claw',abDesc:'Every 6s: a raking claw for 60% extra damage.'},
  hyena:{name:'Hyena',pl:'Hyenas',role:'Damage',hpM:.95,atkM:1,speed:1.6,taunt:.35,diet:'meat',ab:'frenzy',abName:'Frenzy',abDesc:'Every 15s: attacks 40% faster for 6 seconds.'},
  lizard:{name:'Lizard',pl:'Lizards',role:'Tank',hpM:1.1,atkM:.95,speed:2,taunt:.55,diet:'meat',ab:'tail',abName:'Tail Whip',abDesc:'Every 10s: a whipping strike that slows the enemy.'},
  croc:{name:'Crocolisk',pl:'Crocolisks',role:'Tank',hpM:1.3,atkM:1,speed:2.2,taunt:.65,diet:'meat',ab:'roll',abName:'Death Roll',abDesc:'Every 12s: drags the enemy under for double damage.'},
  spider:{name:'Spider',pl:'Spiders',role:'Damage',hpM:.9,atkM:1.05,speed:2,taunt:.35,diet:'meat',ab:'web',abName:'Web',abDesc:'Every 15s: webs the enemy, slowing its attacks.'},
};
const RARITY=[
  {name:'Common',m:1,traits:[0,1]},{name:'Uncommon',m:1.1,traits:[1,1]},{name:'Rare',m:1.25,traits:[2,2]},
  {name:'Epic',m:1.45,traits:[2,2]},{name:'Legendary',m:1.7,traits:[3,3]},{name:'Mythical',m:2,traits:[3,4]}];
const TRAITS={
  ferocious:{name:'Ferocious',desc:'Deals 12% more damage.'},thick:{name:'Thick Hide',desc:'15% more health.'},
  swift:{name:'Swift',desc:'Attacks 12% faster.'},keen:{name:'Keen',desc:'+6% critical strike chance.'},
  loyal:{name:'Loyal',desc:'Bond grows 50% faster.'},hardy:{name:'Hardy',desc:'Gets hungry half as fast.'},
  vicious:{name:'Vicious',desc:'Critical strikes deal 30% more damage.'},guardian:{name:'Guardian',desc:'Draws enemy attacks more often.'}};
const UNCOMMON_PRE=['Scarred','Sleek','Lean','Grizzled','Wary'];
const RARE_VAR=[{n:'Ashen',c:'#c8c8c8'},{n:'Frostcoat',c:'#bfe3ff'},{n:'Bloodmane',c:'#b02a2a'},{n:'Duskpelt',c:'#4a3a6a'},{n:'Goldenhide',c:'#e0b030'}];
const EPIC_NAMES={wolf:['Old One-Eye','Silverfang'],boar:['Bristleking','Old Mudwallow'],lizard:['Sunscale','Embertongue'],hyena:['Cackletooth','Laughing Ghost'],
  croc:['Gulper','Deeptooth'],spider:['Silkmother','The Weaver'],cat:['Shadowstalk','Whisperpaw']};
const BOND=[{n:'Wary',at:0},{n:'Friendly',at:25},{n:'Loyal',at:75},{n:'Devoted',at:175},{n:'Bonded',at:350}];
const bondLvl=p=>{let l=0;BOND.forEach((b,i)=>{if(p.bond>=b.at)l=i;});return l;};
const has=(p,t)=>p.traits.includes(t);
function rollTraits(rar){const [a,b]=RARITY[rar].traits;const n=rint(a,b);const keys=Object.keys(TRAITS),out=[];while(out.length<n){const k=pick(keys);if(!out.includes(k))out.push(k);}return out;}
function wildRarity(t){if(t.rare)return 4;const r=R();return r<.006?3:r<.036?2:r<.156?1:0;}
function petOf(){const h=H();return h.pets&&h.pets.find(p=>p.id===h.activePet)||null;}
function petStats(p){const F=FAMILIES[p.family],bl=bondLvl(p),rm=RARITY[p.rar].m,mood=p.happy>=70?1.15:p.happy<30?.75:1;
  return {hpMax:Math.round((40+p.lvl*22)*F.hpM*rm*(1+.05*bl)*(has(p,'thick')?1.15:1)*(1+T('petHp')/100)),
    atk:(4+p.lvl*2.2)*F.atkM*rm*(1+.05*bl)*(has(p,'ferocious')?1.12:1)*(1+T('petDmg')/100)*mood,
    speed:F.speed/(has(p,'swift')?1.12:1),crit:8+(has(p,'keen')?6:0)+T('petCrit'),taunt:F.taunt+(has(p,'guardian')?.15:0),armor:p.lvl*18*F.hpM};}
function moodName(p){return p.happy>=70?'Happy':p.happy<30?'Unhappy':'Content';}
const petXpNeed=l=>Math.round(xpNeed(l)*.6);

/* ---- pets in combat ---- */
function petHit(mult,label){
  const p=petOf(),m=C.mob;if(!p||p.hp<=0||!m)return 0;const ps=petStats(p);
  let a=ps.atk*mult*(C.buffs.packfury?1.5:1)*(C.buffs.wrath?2:1)*(m.marked>0?1.1:1)*(.9+R()*.2);a*=1-m.armor/(m.armor+400+85*p.lvl);
  const crit=R()*100<ps.crit;if(crit)a*=has(p,'vicious')?2.6:2;a=Math.max(1,Math.round(a));
  m.hp-=a;C.anim.pet=.15;line(`${petLabel(p)}${label?`'s ${label}`:''} ${crit?'crits':'hits'} ${m.name} for ${a}.`,crit?'l-crit':'l-pet');fx(String(a)+(crit?'!':''),crit?'#ffd24a':'#d9f7a8','mob',crit);
  if(crit&&H().cls==='hunter'&&bondLvl(p)>=2&&H().lvl>=1)openWin('exposed',4);
  if(m.hp<=0)onKill();return a;
}
function petAbility(){
  const p=petOf(),m=C.mob;if(!p||p.hp<=0||!m)return;const F=FAMILIES[p.family],devoted=bondLvl(p)>=3?.7:1;
  switch(F.ab){
    case 'howl':C.buffs.howl={t:10};line(`${petLabel(p)} lets out a Furious Howl.`,'l-pet');C.petCd=20*devoted;break;
    case 'charge':C.petCd=999;if(!C.charged){C.charged=true;m.swing+=1.5;petHit(2,'Charge');}break;
    case 'claw':C.petCd=6*devoted;petHit(1.6,'Claw');break;
    case 'frenzy':C.buffs.frenzy={t:6};line(`${petLabel(p)} goes into a Frenzy.`,'l-pet');C.petCd=15*devoted;break;
    case 'tail':C.petCd=10*devoted;if(petHit(1.3,'Tail Whip')&&C.mob)C.mob.chill=Math.max(C.mob.chill,3);break;
    case 'roll':C.petCd=12*devoted;petHit(2,'Death Roll');break;
    case 'web':C.petCd=15*devoted;m.chill=Math.max(m.chill,6);line(`${petLabel(p)} webs ${m.name}.`,'l-pet');break;
  }
  if(C.mob&&H().cls==='hunter'&&bondLvl(p)>=2)openWin('exposed',4);
}
function petLabel(p){return p.name===p.species?'Your '+p.name:p.name;}
function petDie(){const p=petOf();if(!p)return;p.hp=0;p.happy=Math.max(0,p.happy-15);line(`${p.name} has died.`,'l-hurt');toast(`${p.name} has fallen`);C.buffs.packfury=null;}
function revivePet(){const p=petOf();if(!p||p.hp>0)return false;p.hp=Math.round(petStats(p).hpMax*.5);line(`You revive ${p.name}.`,'l-heal');return true;}
function petGain(x){
  const h=H(),p=petOf();if(!p||p.hp<=0)return;
  if(p.lvl<h.lvl){p.xp+=x*(p.lvl<h.lvl-2?2:1);while(p.lvl<h.lvl&&p.xp>=petXpNeed(p.lvl)){p.xp-=petXpNeed(p.lvl);p.lvl++;p.hp=petStats(p).hpMax;line(`${p.name} reaches level ${p.lvl}.`,'l-xp');}}else p.xp=0;
  if(p.happy>=30){const before=bondLvl(p);p.bond+=(1+T('bondRate')/100)*(RACES[h.race].beastkin?1.2:1)*(has(p,'loyal')?1.5:1)*(p.happy>=70?1.5:1);
    const after=bondLvl(p);if(after>before){toast(`${p.name} is now ${BOND[after].n}`);slog(`${p.name}'s bond grew to ${BOND[after].n}.`);
      if(after===2)line(`Coordinated Strike unlocked: it lights up when ${p.name} uses its ability or lands a critical hit.`,'l-sys');
      if(after===4)line(`${p.name} would now take a killing blow for you, once per fight.`,'l-sys');}}
}
function canTame(){const h=H(),m=C.mob;if(h.cls!=='hunter'||!m||C.phase!=='fight'||C.taming||m.kind!=='beast')return false;return true;}
function tameBlock(){const h=H(),m=C.mob;if(m.lvl>h.lvl)return `${m.name} is too high level to tame.`;if((h.pets||[]).length>=3)return 'Your stable is full (3). Release a pet first.';return '';}
function startTame(){if(!canTame())return;const why=tameBlock();if(why){err(why);return;}C.taming={t:6,max:6};C.cast=null;C.lastInput=C.run;line(`You begin to tame ${C.mob.name}. Survive for 6 seconds.`,'l-sys');}
function finishTame(){
  const h=H(),m=C.mob;C.taming=null;
  const p={id:uid(),name:m.petName,species:m.species,family:m.fam,rar:m.rar,col:m.col,lvl:m.lvl,xp:0,bond:0,happy:60,traits:m.traits,hp:0,tamedIn:ZONES[h.zone].name,tamedAt:h.lvl};
  p.hp=petStats(p).hpMax;h.pets.push(p);if(!petOf())h.activePet=p.id;h.stats.tamed++;
  for(const qid of h.quests.active){const q=ALLQ[qid];if(q.mob===m.id&&q.type==='kill'&&(h.quests.prog[qid]||0)<q.n){h.quests.prog[qid]=(h.quests.prog[qid]||0)+1;if(h.quests.prog[qid]>=q.n)toast(`${q.name} (Complete)`);}}
  C.mob=null;sfx('catch');line(`You have tamed ${p.name}!`,'l-loot');toast(`Tamed: ${p.name} (${RARITY[p.rar].name} ${FAMILIES[p.family].name})`);slog(`Tamed ${p.name}, a ${RARITY[p.rar].name.toLowerCase()} ${FAMILIES[p.family].name.toLowerCase()}, in ${p.tamedIn}.`);
  if(h.activePet!==p.id)line(`${p.name} waits in your stable. Swap pets at a stable in town.`,'l-sys');
  C.phase='rest';
}
function feedPet(id,auto){
  const h=H(),p=petOf();if(!p){err('You have no pet.');return false;}
  const diet=FAMILIES[p.family].diet;const i=h.bags.findIndex(it=>it.food&&(id?it.id===id:true)&&(diet==='any'||it.diet===diet));
  if(i<0){if(!auto)err(`${p.name} won't eat that.`);return false;}
  const it=h.bags.splice(i,1)[0];p.happy=Math.min(100,p.happy+35);if(!auto)h.stats.feeds++;line(`${p.name} eats the ${it.name}.`,'l-pet');fx('Yum','#ffd24a','pet');return true;
}
function petTick(h,phase){
  const he=H(),p=petOf();if(!p)return;const ps=petStats(p);
  p.happy=Math.max(0,p.happy-h/25*(has(p,'hardy')?.5:1));
  if(p.hp>0&&phase!=='fight')p.hp=Math.min(ps.hpMax,p.hp+ps.hpMax*(phase==='rest'?.07:.015)*h);
  if(p.hp>ps.hpMax)p.hp=ps.hpMax;
  if(C.reviving>0){if(phase==='fight')C.reviving=0;else{C.reviving-=h;if(C.reviving<=0)revivePet();}}
  else if(p.hp<=0&&phase!=='fight'&&phase!=='dead'&&aiOn())C.reviving=4;
  const care=he.addons.unl.petcare&&he.addons.on.petcare;
  if(care&&p.happy<55)feedPet(null,true);
}

