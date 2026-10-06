'use strict';
/* =================== the world's adventurers =================== */
/* Each hero's world has 16 named adventurers of their faction. They level with the world, wander the zones,
   and remember you: affinity grows as you wave, help, group, share loot and clear dungeons together. */
const NPC_NAMES={concord:['Brienne','Aldous','Merrin','Tobias','Elowen','Garrett','Isla','Corwin','Hazel','Rhys','Maeve','Dorian','Wynn','Celeste','Bram','Odette'],
  wild:['Kesh','Ruk','Ugra','Thrak','Zula','Vash','Nokka','Grom','Sira','Drogo','Kaja','Tusk','Vela','Morg','Ishara','Brakka']};
const PERSONALITY={
  cheerful:{name:'Cheerful',join:.8,lines:{greet:['Hi there! Want to team up?','Oh, a friendly face!','Hey! Room for one more?'],kill:['Got it!','Nice one!','Teamwork!'],combo:['Now! Together!',"Let's do this!"],thanks:['For me? Thank you!',"You're the best."],wipe:['Ow... again?',"We'll get it next time!"],clear:['We did it! That was amazing!']}},
  gruff:{name:'Gruff',join:.5,lines:{greet:['Hm. You look like you can swing a blade.','Stay out of my way and we will get along.'],kill:['Next.','Hmph.'],combo:["Now. Don't miss."],thanks:['...Appreciated.'],wipe:['Sloppy.'],clear:["Good work. Don't let it go to your head."]}},
  shy:{name:'Shy',join:.4,lines:{greet:['Oh! Um... hello.','I-is it okay if I tag along?'],kill:['I-I did it.'],combo:['N-now, please!'],thanks:["You didn't have to... thank you."],wipe:['Sorry, that was my fault...'],clear:["I'm glad I came with you."]}},
  bold:{name:'Bold',join:.9,lines:{greet:["Ha! Another hero! Let's show these beasts!"],kill:['Too easy!',"Who's next?!"],combo:['With me! CHARGE!'],thanks:['A worthy prize!'],wipe:['A minor setback!'],clear:['Songs will be sung of this day!']}},
  scholarly:{name:'Scholarly',join:.6,lines:{greet:['Fascinating. You seem competent.','Ah, a fellow traveler. Do you read?'],kill:['As predicted.'],combo:['On my mark: now!'],thanks:['This will aid my research.'],wipe:['Statistically, we were due.'],clear:['The tide-runes alone were worth the trip.']}},
  greedy:{name:'Greedy',join:.7,lines:{greet:['Any loot in it for me?'],kill:['Check the pockets!'],combo:['For the treasure!'],thanks:["Now we're talking!"],wipe:['I lost my good boots for this?'],clear:['Payday!']}},
};
const AFFINITY=[{n:'Stranger',at:0},{n:'Acquaintance',at:10},{n:'Friend',at:30},{n:'Close Friend',at:60},{n:'Sworn Ally',at:100}];
const ROLE_OF={warrior:'tank',priest:'heal',mage:'dps',rogue:'dps',hunter:'dps'};
const ROLE_NAME={tank:'Tank',heal:'Healer',dps:'Damage'};
const COMBO={warrior:{name:'Shield and Sword',desc:'A heavy combined strike, and the party takes 30% less damage for 6 seconds.'},
  priest:{name:'Radiant Covenant',desc:'Heals the whole party and smites the enemy.'},mage:{name:'Arcane Convergence',desc:'A huge burst of combined magic.'},
  rogue:{name:'Pincer Ambush',desc:'You strike from both sides for a guaranteed critical hit.'},hunter:{name:'Pack Tactics',desc:'Big damage, and the party deals 20% more for 8 seconds.'}};
const affLvl=n=>{let l=0;AFFINITY.forEach((a,i)=>{if(n.aff>=a.at)l=i;});return l;};
function genNpcs(faction){const names=NPC_NAMES[faction].slice().sort(()=>R()-.5),cls=['warrior','priest','mage','rogue','hunter'];
  return names.map((name,i)=>({id:uid(),name,race:pick(FACTIONS[faction].races),cls:cls[i%5],pers:pick(Object.keys(PERSONALITY)),offset:rint(-3,3),aff:0,met:false,notes:[],
    hair:pick(['#6b4423','#e8c070','#2b2b2b','#a03020','#d8d8d8','#4a2a1a','#7a5ab0'])}));}
function npcLvl(n){return clamp(H().lvl+n.offset,1,LEVEL_CAP);}
function npcZone(n){return npcLvl(n)<10?FACTIONS[H().faction].start:npcLvl(n)<20?'fens':'ashen';}
function npcOf(id){return (H().npcs||[]).find(n=>n.id===id);}
function noteNpc(n,t){n.notes=n.notes||[];n.notes.unshift(t);if(n.notes.length>6)n.notes.length=6;}
function say(n,kind){const L=PERSONALITY[n.pers].lines[kind];if(L)line(`${n.name}: ${pick(L)}`,'l-say');}
function addAff(n,v,note){const b=affLvl(n);n.aff=Math.max(0,n.aff+v);n.met=true;if(note)noteNpc(n,note);const a=affLvl(n);
  if(a>b){toast(`${n.name} is now your ${AFFINITY[a].n}`);slog(`${n.name} became your ${AFFINITY[a].n.toLowerCase()}.`);if(a===2)line(`You and ${n.name} can now combine abilities in a fight.`,'l-sys');}}
function compStats(n){const l=npcLvl(n),role=ROLE_OF[n.cls],g=1+.08*Math.max(0,(H().dstats?H().dstats.best:-1)+1),am=1+.03*affLvl(n);
  return {lvl:l,role,hpMax:Math.round((60+l*26)*(role==='tank'?1.9:1)*g),dps:(6+l*2.6)*(role==='dps'?1.4:role==='tank'?.75:.45)*g*am,hps:(5+l*2.6)*g*am,armor:l*30*(role==='tank'?3:1)};}

/* ---- meeting people in the world ---- */
function maybeEncounter(){const h=H();if(h.dun||C.enc||R()>.12)return;
  const here=(h.npcs||[]).filter(n=>npcZone(n)===h.zone&&!(h.party||[]).includes(n.id));if(!here.length)return;
  const n=pick(here);C.enc={id:n.id,t:25,kind:pick(['fighting','resting','questing']),waved:false};n.seen=(n.seen||0)+1;}
function encAct(kind){const h=H(),e=C.enc;if(!e)return;const n=npcOf(e.id);if(!n){C.enc=null;return;}C.lastInput=C.run;const z=ZONES[h.zone].name;
  if(kind==='wave'){if(!e.waved){e.waved=true;addAff(n,1,n.met?null:`Met in ${z} at level ${h.lvl}.`);say(n,'greet');}return;}
  if(kind==='help'&&e.kind==='fighting'){addAff(n,3,`You helped them in a fight in ${z}.`);say(n,'thanks');gainXP(Math.round((h.lvl*5+45)*.6),false);C.enc=null;return;}
  if(kind==='invite'){
    if(h.party.length>=4){err('Your party is full (4).');return;}
    if(Math.abs(npcLvl(n)-h.lvl)>4){line(`${n.name}: You're a bit out of my league... another time.`,'l-say');C.enc=null;return;}
    const ok=affLvl(n)>=1||R()<PERSONALITY[n.pers].join;
    if(ok){if(!n.met)noteNpc(n,`Met in ${z} at level ${h.lvl}.`);addAff(n,1,`Grouped up in ${z}.`);n.joinedAt=C.run;h.party.push(n.id);syncParty();say(n,'greet');line(`${n.name} joins your party.`,'l-sys');}
    else{n.met=true;line(`${n.name}: Maybe another time.`,'l-say');}
    C.enc=null;}
}
function partyUpkeep(){const h=H();if(h.dun)return;
  for(const id of [...h.party]){const n=npcOf(id);if(!n){h.party=h.party.filter(x=>x!==id);continue;}
    const stranger=affLvl(n)<1&&C.run-(n.joinedAt||0)>480,gap=Math.abs(npcLvl(n)-h.lvl)>5;
    if(stranger||gap){line(`${n.name}: I have to head off. Good luck out there!`,'l-say');h.party=h.party.filter(x=>x!==id);syncParty();}}}
