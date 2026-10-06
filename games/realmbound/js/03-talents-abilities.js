'use strict';
/* =================== talents =================== */
const TALENTS={
  warrior:{tree:'Arms',list:[
    {id:'cruelty',name:'Cruelty',max:5,per:1,key:'crit',desc:'+1% critical strike chance per rank.'},
    {id:'impstrike',name:'Improved Brutal Strike',max:3,per:1,key:'strikeCost',desc:'Brutal Strike costs 1 less rage per rank.'},
    {id:'wmastery',name:'Weapon Mastery',max:5,per:2,key:'dmg',desc:'+2% damage per rank.'},
    {id:'tactical',name:'Tactical Mastery',max:2,per:1,key:'window',desc:'Counterstrike openings last 1 second longer per rank.'},
    {id:'toughness',name:'Toughness',max:5,per:2,key:'armor',desc:'+2% armor per rank.'},
    {id:'mortal',name:'Mortal Wound',max:1,per:1,key:'cap',req:8,desc:'Learn Mortal Wound: a crushing strike on a 6 second cooldown. Needs 8 points spent.'}]},
  rogue:{tree:'Assassination',list:[
    {id:'malice',name:'Malice',max:5,per:1,key:'crit',desc:'+1% critical strike chance per rank.'},
    {id:'lethality',name:'Lethality',max:5,per:6,key:'critDmg',desc:'Critical strikes deal 6% more damage per rank.'},
    {id:'vigor',name:'Vigor',max:3,per:6,key:'energyRegen',desc:'Energy regenerates 6% faster per rank.'},
    {id:'opportunity',name:'Opportunity',max:5,per:6,key:'opener',desc:'Backstab deals 6% more damage per rank.'},
    {id:'reflexes',name:'Lightning Reflexes',max:5,per:1,key:'dodge',desc:'+1% dodge per rank. Every dodge opens Riposte.'},
    {id:'vendetta',name:'Vendetta',max:1,per:1,key:'cap',req:8,desc:'Learn Vendetta: for 6 seconds every attack is a critical strike. Needs 8 points spent.'}]},
  mage:{tree:'Fire',list:[
    {id:'burning',name:'Burning Soul',max:5,per:1,key:'crit',desc:'+1% critical strike chance per rank.'},
    {id:'ignite',name:'Ignite',max:5,per:8,key:'bleed',desc:'Critical strikes burn the target for 8% of the damage per rank.'},
    {id:'impbolt',name:'Improved Firebolt',max:5,per:.1,key:'castSpeed',desc:'Firebolt casts 0.1 seconds faster per rank.'},
    {id:'mind',name:'Arcane Mind',max:5,per:3,key:'intPct',desc:'+3% Intellect per rank.'},
    {id:'clarity',name:'Clarity',max:3,per:3,key:'procChance',desc:'+3% chance per rank for spells to trigger Arcane Surge.'},
    {id:'cinder',name:'Cinderstorm',max:1,per:1,key:'cap',req:8,desc:'Learn Cinderstorm: a huge fire spell on a 20 second cooldown. Needs 8 points spent.'}]},
  priest:{tree:'Shadow & Light',list:[
    {id:'tap',name:'Spirit Tap',max:5,per:10,key:'regenPct',desc:'+10% mana regeneration in combat per rank.'},
    {id:'improt',name:'Improved Shadow Rot',max:5,per:6,key:'dot',desc:'Shadow Rot deals 6% more damage per rank.'},
    {id:'sfocus',name:'Shadow Focus',max:5,per:1,key:'crit',desc:'+1% critical strike chance per rank.'},
    {id:'hfocus',name:'Healing Focus',max:5,per:6,key:'heal',desc:'Your heals and wards are 6% stronger per rank.'},
    {id:'inner',name:'Inner Light',max:3,per:4,key:'procChance',desc:'+4% chance per rank for Divine Spark.'},
    {id:'voidlash',name:'Void Lash',max:1,per:1,key:'cap',req:8,desc:'Learn Void Lash: shadow damage that heals you for half. 10 second cooldown. Needs 8 points spent.'}]},
  hunter:{tree:'Beast Mastery',list:[
    {id:'endurance',name:'Endurance Training',max:5,per:5,key:'petHp',desc:'Your pet has 5% more health per rank.'},
    {id:'ferocity',name:'Ferocity',max:5,per:2,key:'petCrit',desc:'+2% pet critical strike chance per rank.'},
    {id:'lethal',name:'Lethal Shots',max:5,per:1,key:'crit',desc:'+1% critical strike chance per rank.'},
    {id:'bestial',name:'Bestial Bond',max:3,per:20,key:'bondRate',desc:'Your bond with your pet grows 20% faster per rank.'},
    {id:'unleashed',name:'Unleashed Fury',max:5,per:4,key:'petDmg',desc:'Your pet deals 4% more damage per rank.'},
    {id:'packfury',name:'Pack Fury',max:1,per:1,key:'cap',req:8,desc:'Learn Pack Fury: your pet deals 50% more damage and attacks faster for 10 seconds. Needs 8 points spent.'}]},
};

/* ---- abilities ---- */
const lv=()=>H().lvl;
const ABIL={
  warrior:[
    {id:'strike',name:'Brutal Strike',lvl:1,cost:()=>12-T('strikeCost'),desc:'A heavy weapon strike.',ai:()=>C.res>=30||!knows('rend'),fn:()=>hitMob(wroll()+11+lv()*1.6,{phys:1,label:'Brutal Strike'})},
    {id:'cry',name:'Battle Cry',lvl:2,cost:()=>10,desc:'+attack power for 60 seconds.',cond:()=>!C.buffs.cry,ai:()=>true,fn:()=>{C.buffs.cry={t:60,ap:15+lv()*2};line('You let out a Battle Cry.','l-sys');}},
    {id:'rend',name:'Rend',lvl:4,cost:()=>10,desc:'Wounds the target, bleeding over 9 seconds.',cond:()=>!C.mob.dots.rend,ai:()=>C.mob.hp>C.mob.max*.4,fn:()=>{addDot('rend',15+lv()*3,9,'Rend');line(`${C.mob.name} is bleeding.`,'l-hit');}},
    {id:'counter',name:'Counter­strike',lvl:6,react:'counter',cost:()=>5,desc:'Only after the target dodges or leaves an opening. Can\'t be dodged, extra crit chance.',ai:()=>true,fn:()=>{C.win.counter=0;hitMob(wroll()+20+lv()*2.2,{phys:1,sure:1,critBonus:50,label:'Counterstrike'});}},
    {id:'finish',name:'Finishing Blow',lvl:12,cost:()=>15,desc:'Only below 20% target health. Spends extra rage for more damage.',cond:()=>C.mob.hp<C.mob.max*.2,ai:()=>true,fn:()=>{const extra=Math.min(30,C.res);C.res-=extra;hitMob(60+lv()*6+extra*3,{phys:1,label:'Finishing Blow'});}},
    {id:'mortal',name:'Mortal Wound',talent:'mortal',cd:6,cost:()=>15,desc:'A crushing strike. 6 second cooldown.',ai:()=>true,fn:()=>hitMob(wroll()*1.2+40+lv()*3,{phys:1,label:'Mortal Wound'})},
  ],
  rogue:[
    {id:'slash',name:'Quick Slash',lvl:1,cost:()=>40,desc:'Strike for weapon damage. +1 combo point.',ai:()=>C.cp<5,fn:()=>{if(hitMob(wroll()+8+lv()*1.2,{phys:1,label:'Quick Slash'})>0)C.cp=Math.min(5,C.cp+1);}},
    {id:'gut',name:'Gutting Strike',lvl:1,cost:()=>35,desc:'Finisher. Damage grows with every combo point.',cond:()=>C.cp>0,ai:()=>C.cp>=4||C.mob.hp<C.mob.max*.15,fn:()=>{const cp=C.cp;C.cp=0;hitMob(cp*(10+lv()*2.2)+ST.ap*.03*cp,{phys:1,sure:1,label:`Gutting Strike (${cp})`});}},
    {id:'backstab',name:'Backstab',lvl:4,react:'opening',cost:()=>60,desc:'Only in the opening seconds of a fight. Big damage, +2 combo points.',ai:()=>true,fn:()=>{C.win.opening=0;if(hitMob((wroll()*1.5+15+lv()*2)*(1+T('opener')/100),{phys:1,sure:1,label:'Backstab'})>0)C.cp=Math.min(5,C.cp+2);}},
    {id:'riposte',name:'Riposte',lvl:6,react:'riposte',cost:()=>10,desc:'Only right after you dodge or parry. +1 combo point.',ai:()=>true,fn:()=>{C.win.riposte=0;if(hitMob(wroll()*1.5,{phys:1,sure:1,label:'Riposte'})>0)C.cp=Math.min(5,C.cp+1);}},
    {id:'quicken',name:'Quicken',lvl:10,cost:()=>25,desc:'Finisher. Attack 30% faster for 6 seconds per combo point.',cond:()=>C.cp>0&&!C.buffs.quicken,ai:()=>C.cp>=2&&C.mob.hp>C.mob.max*.5,fn:()=>{C.buffs.quicken={t:6*C.cp};C.cp=0;line('You feel quicker.','l-sys');}},
    {id:'vendetta',name:'Vendetta',talent:'vendetta',cd:45,cost:()=>0,desc:'For 6 seconds every attack is a critical strike.',ai:()=>C.mob.hp>C.mob.max*.5,fn:()=>{C.buffs.vendetta={t:6};line('Vendetta!','l-sys');}},
  ],
  mage:[
    {id:'firebolt',name:'Firebolt',lvl:1,cast:()=>2.5-T('castSpeed'),cost:()=>25+lv()*3,desc:'A bolt of fire. 2.5 second cast.',ai:()=>true,fn:()=>{hitMob(14+lv()*4.5+ST.sp*.8,{label:'Firebolt'});surgeChance();}},
    {id:'burst',name:'Flame Burst',lvl:6,cd:8,cost:()=>20+lv()*2.5,desc:'Instant fire damage. 8 second cooldown.',ai:()=>true,fn:()=>{hitMob(12+lv()*3.2+ST.sp*.45,{label:'Flame Burst'});surgeChance();}},
    {id:'frost',name:'Frost Lance',lvl:4,cast:()=>2,cost:()=>20+lv()*2.5,desc:'Frost damage that slows the target\'s attacks for 6 seconds.',cond:()=>!(C.mob.chill>0),ai:()=>true,fn:()=>{hitMob(10+lv()*3.6+ST.sp*.65,{label:'Frost Lance'});if(C.mob)C.mob.chill=6;surgeChance();}},
    {id:'surge',name:'Arcane Surge',lvl:1,react:'surge',cost:()=>0,desc:'Only when Arcane Surge lights up after a spell. Instant and free.',ai:()=>true,fn:()=>{C.win.surge=0;hitMob(20+lv()*5+ST.sp,{label:'Arcane Surge'});}},
    {id:'ward',name:'Mana Ward',lvl:8,cd:20,cost:()=>30+lv()*3,desc:'Absorbs damage for 30 seconds.',cond:()=>C.absorb<=0,ai:()=>true,fn:()=>{C.absorb=40+lv()*10+ST.sp;C.buffs.absorb={t:30};line('A Mana Ward surrounds you.','l-sys');}},
    {id:'cinder',name:'Cinderstorm',talent:'cinder',cd:20,cast:()=>3,cost:()=>60+lv()*5,desc:'Huge fire damage. 20 second cooldown.',ai:()=>true,fn:()=>hitMob(60+lv()*9+ST.sp*1.5,{label:'Cinderstorm'})},
  ],
  priest:[
    {id:'smite',name:'Holy Smite',lvl:1,cast:()=>2,cost:()=>22+lv()*3,desc:'Holy damage. 2 second cast.',ai:()=>true,fn:()=>{hitMob(12+lv()*3.9+ST.sp*.7,{label:'Holy Smite'});sparkChance();}},
    {id:'mend',name:'Mend',lvl:1,cast:()=>2,cost:()=>25+lv()*3.5,desc:'Heals you, or whoever in your party is hurt worst. 2 second cast.',cond:()=>C.hp<ST.hpMax||partyAlive().some(p=>p.hp<compStats(p.n).hpMax),ai:()=>C.hp<ST.hpMax*.45||partyAlive().some(p=>p.hp<compStats(p.n).hpMax*.45),fn:()=>{const amt=30+lv()*9+ST.sp*.8;if(partyAlive().length)healLowest(amt*(1+T('heal')/100),'Mend');else healHero(amt,'Mend');sparkChance();}},
    {id:'ward',name:'Ward of Light',lvl:2,cd:12,cost:()=>25+lv()*3,desc:'Absorbs damage for 30 seconds. 12 second cooldown.',cond:()=>C.absorb<=0,ai:()=>true,fn:()=>{C.absorb=(30+lv()*8+ST.sp*.5)*(1+T('heal')/100);C.buffs.absorb={t:30};line('A Ward of Light surrounds you.','l-sys');}},
    {id:'rot',name:'Shadow Rot',lvl:4,cost:()=>20+lv()*2.5,desc:'Shadow damage over 15 seconds.',cond:()=>!C.mob.dots.rot,ai:()=>C.mob.hp>C.mob.max*.35,fn:()=>{addDot('rot',(18+lv()*4.5+ST.sp*.5)*(1+T('dot')/100),15,'Shadow Rot');line(`${C.mob.name} is afflicted by Shadow Rot.`,'l-hit');}},
    {id:'spark',name:'Divine Spark',lvl:1,react:'spark',cost:()=>0,desc:'Only when Divine Spark lights up. An instant, free, empowered Smite.',ai:()=>true,fn:()=>{C.win.spark=0;hitMob((12+lv()*3.9+ST.sp*.7)*1.5,{label:'Divine Spark'});}},
    {id:'voidlash',name:'Void Lash',talent:'voidlash',cd:10,cost:()=>40+lv()*4,desc:'Shadow damage that heals you for half. 10 second cooldown.',ai:()=>true,fn:()=>{const a=hitMob(30+lv()*6+ST.sp,{label:'Void Lash'});if(a)healHero(a/2,'Void Lash');}},
  ],
  hunter:[
    {id:'shot',name:'Steady Shot',lvl:1,cast:()=>1.5,cost:()=>10+lv()*1.5,desc:'A careful, heavy shot. 1.5 second cast.',ai:()=>true,fn:()=>hitMob(wroll()+10+lv()*1.6,{phys:1,label:'Steady Shot'})},
    {id:'mark',name:'Mark Prey',lvl:2,cost:()=>8+lv(),desc:'The target takes 10% more damage from you and your pet for 60 seconds.',cond:()=>!(C.mob.marked>0),ai:()=>C.mob.hp>C.mob.max*.5,fn:()=>{C.mob.marked=60;line(`You mark ${C.mob.name}.`,'l-sys');}},
    {id:'pierce',name:'Piercing Shot',lvl:4,cd:6,cost:()=>15+lv()*2,desc:'Instant. Ignores armor. 6 second cooldown.',ai:()=>true,fn:()=>hitMob(wroll()*.6+18+lv()*2.5,{label:'Piercing Shot'})},
    {id:'sting',name:'Venom Sting',lvl:6,cost:()=>14+lv()*1.8,desc:'Poisons the target over 12 seconds.',cond:()=>!C.mob.dots.sting,ai:()=>C.mob.hp>C.mob.max*.35,fn:()=>{addDot('sting',14+lv()*3.5+ST.ap*.1,12,'Venom Sting');line(`${C.mob.name} is poisoned.`,'l-hit');}},
    {id:'coord',name:'Coordinated Strike',lvl:1,react:'exposed',cost:()=>10,desc:'Needs a pet at Loyal bond or better. Lights up when your pet uses its special ability or lands a critical hit: you and your pet strike together.',ai:()=>true,
      fn:()=>{C.win.exposed=0;hitMob(wroll()*1.2+20+lv()*2,{phys:1,sure:1,label:'Coordinated Strike'});if(C.mob)petHit(1.5,'Coordinated Strike');}},
    {id:'mendpet',name:'Mend Pet',lvl:4,cast:()=>2,cost:()=>15+lv()*2,desc:'Heals your pet. 2 second cast.',cond:()=>{const p=petOf();return p&&p.hp>0&&p.hp<petStats(p).hpMax;},ai:()=>{const p=petOf();return p&&p.hp<petStats(p).hpMax*.45;},
      fn:()=>{const p=petOf();if(!p||p.hp<=0)return;const a=Math.round(40+lv()*10);p.hp=Math.min(petStats(p).hpMax,p.hp+a);line(`Mend Pet heals ${p.name} for ${a}.`,'l-heal');fx('+'+a,'#7cf08a','pet');}},
    {id:'packfury',name:'Pack Fury',talent:'packfury',cd:40,cost:()=>20+lv()*2,desc:'Your pet deals 50% more damage and attacks faster for 10 seconds. 40 second cooldown.',cond:()=>{const p=petOf();return p&&p.hp>0;},ai:()=>C.mob.hp>C.mob.max*.4,fn:()=>{C.buffs.packfury={t:10};line('Your pet is filled with fury!','l-sys');}},
  ],
};
/* Auto mode's priority order, where it differs from the bar order */
const ABIL_AI={hunter:['mendpet','mark','coord','packfury','sting','pierce','shot']};
function aiList(){const o=ABIL_AI[H().cls];return o?o.map(id=>bar().find(a=>a.id===id)):bar();}
function surgeChance(){if(R()*100<10+T('procChance'))openWin('surge',6);}
function sparkChance(){if(R()*100<15+T('procChance'))openWin('spark',6);}
function knows(id){const h=H(),a=ABIL[h.cls].find(x=>x.id===id);if(!a)return false;return a.talent?(h.talents[a.talent]||0)>0:h.lvl>=a.lvl;}
function bar(){return ABIL[H().cls];}
function canUse(a,quiet){
  const fail=m=>{if(!quiet)err(m);return false;};
  if(!knows(a.id))return fail("You haven't learned that yet.");
  if(C.phase!=='fight'||!C.mob)return fail('You have no target.');
  if(C.taming)return fail('You are busy taming.');
  if(C.cast)return fail('You are busy casting.');
  if(C.gcd>0||(a.cd&&C.cds[a.id]>0))return fail('Ability is not ready yet.');
  if(a.react&&!(C.win[a.react]>0))return fail('That needs an opening.');
  if(a.cond&&!a.cond())return fail(a.id==='finish'?'Target needs to be below 20% health.':'You can\'t use that right now.');
  const cost=a.cost();if(C.res<cost)return fail(`Not enough ${CLASSES[H().cls].res}.`);
  return true;
}
function useAb(a,manual){
  C.res-=a.cost();if(a.cd)C.cds[a.id]=a.cd;
  const ct=a.cast?a.cast():0;C.gcd=Math.max(1.5,ct);
  if(CLASSES[H().cls].res==='mana')C.lastCast=C.fightT;
  H().stats.uses++;if(manual){H().stats.manual++;}
  if(ct>0){C.cast={a,t:ct,max:ct};}else{C.anim.hero=.2;a.fn();}
}
function press(i){
  const a=bar()[i];if(!a||!C)return;C.lastInput=C.run;
  if(canUse(a,false))useAb(a,true);
}

