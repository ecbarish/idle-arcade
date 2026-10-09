'use strict';
/* T42: memories are knowledge, and people carry a want and the history of this life.
   Existing flags are the receipts. No clock, stat bonus, generated prose or new storage key. */
const MEMORY_ORIGIN = { tide:'asterhold', oldroot:'asterhold', guildmaster:'asterhold', lantern:'asterhold', seed:'asterhold', rootsong:'asterhold', broth:'hearthmere', thaw:'hearthmere', shelter:'hearthmere', bellcode:'ashen', mercy:'ashen' };
const MEMORY_USES = [];
function addMemoryChoice(memory, world, at, choice) {
  const need = choice.need;
  choice.need = l => !!l.mem[memory] && (!need || need(l));
  const why = choice.why;
  choice.why = l => !l.mem[memory] ? `You have not carried this memory from ${WORLDS[MEMORY_ORIGIN[memory]].name}.` : typeof why === 'function' ? why(l) : why;
  choice.memory = memory;
  NODES[at].choices.push(choice);
  MEMORY_USES.push({ memory, world, at, choice });
}
const PEOPLE_WANTS = {
  asterhold:{ressa:'Feed the waiting families without surrendering her own privacy.',bren:'Get the grain and the people home, with another pair of hands.'},
  hearthmere:{vesper:'Make Reedlight a shared hearth, not a promise left on her shoulders.',puddle:'Be invited as a guest, not left to keep watch alone.'},
  ashen:{kael:'Keep people safe without closing another door on them.',emmet:'Bring the last family across, and leave a witness to what happened.'}
};
function rememberPeople(l) {
  const f = l.flags;
  const state = l.world === 'asterhold' ? {
    ressa:f.readRessa?'guarded':f.crate?'hurt':f.mendedCrate?'mended':f.ressaHands?'helping':f.unloaded||f.hearth||f.sharedBread||f.hearthBroth?'grateful':'waiting',
    bren:f.brenCart?'repaid':f.unloaded?'owesHands':'waiting'
  } : l.world === 'hearthmere' ? {
    vesper:f.vesperReserve?'sharedReserve':f.packed?'leftWithWork':f.pantry||f.door||f.recipe||f.rootShelter||f.seedbed?'grateful':'waiting',
    puddle:f.puddleWater?'sharedWater':f.lakePromise?'companioned':f.guest?'guest':f.puddle?'trusting':'waiting'
  } : {
    kael:f.forgotten?'unrecognized':f.seal&&!f.kaelMended?'hurt':f.kaelMended?'mended':f.kael?'grateful':'waiting',
    emmet:f.recordCourier?'repaid':f.boats||f.guided?'owesHands':'waiting'
  };
  l.people = Object.fromEntries(Object.entries(PEOPLE_WANTS[l.world] || {}).map(([id,want]) => [id,{want,state:state[id]}]));
  return l;
}
const prepareBeforeMemories = prepareLife;
prepareLife = function(l,legacy=false) { prepareBeforeMemories(l,legacy); return rememberPeople(l); };
const personIs = (l,id,...states) => states.includes(l.people?.[id]?.state);

addMemoryChoice('rootsong','asterhold','a_alone',{
  t:'Sing the forest song; let the boars pass around you',
  need:l=>l.gift!=='sword',why:'The Instinct has already drawn your blade. It will not let you answer a charge with a song.',go:'a_alone_live',
  fx:l=>{l.flags.songCalmed=true;}
});
const aloneBeforeSong=NODES.a_alone_live.lines;
NODES.a_alone_live.lines=l=>has(l,'songCalmed')?[
 ['','You sing with the spaces Oldroot left between its notes. The first boar slows, then turns. The others stream around you, toward daylight.'],
 ['','A remembered song has kept your hands empty and your body alive. You return to Lanthorn with bark dust on your coat, and something to tell the guild.']
]:aloneBeforeSong(l);
addMemoryChoice('tide','hearthmere','h_spring',{
  t:'Let the frightened spring answer before asking it for water',go:'h_prepared',
  fx:l=>{l.flags.guest=true;l.flags.innOpen=true;l.flags.springCalmed=true;hearthShift(l,2,0,1);}
});
addMemoryChoice('oldroot','hearthmere','h_prep',{
  t:'Offer the cellar roots a name instead of an axe',go:'h_prepared',
  fx:l=>{l.flags.rootShelter=true;l.flags.innOpen=true;hearthShift(l,1,2,1);}
});
addMemoryChoice('seed','hearthmere','h_prep',{
  t:'Remember the warm seed; plant Vesper\'s beans beside the stove',go:'h_prepared',
  fx:l=>{l.flags.seedbed=true;l.flags.innOpen=true;hearthShift(l,3,0,1);}
});
addMemoryChoice('guildmaster','ashen','s_square',{
  t:'Ask for a public count before believing the cupboard is empty',go:'s_record',
  fx:l=>{l.flags.records=true;l.flags.recordPublic=true;l.flags.countedSacks=true;l.ash.knowledge.store=true;l.ash.knowledge.record=true;}
});
addMemoryChoice('lantern','ashen','s_work',{
  t:'Make Mira\'s lantern charm; carry the marked grain through the rot',
  need:l=>has(l,'records')&&!has(l,'oathBroken'),
  why:l=>has(l,'oathBroken')?'The broken promise holds your hands shut. A remembered light cannot undo it.':'You have not found the marked grain. The cold store is still a place to ask.',go:'s_dusk',
  fx:l=>{l.flags.lanternWatch=true;l.flags.supplies=true;l.flags.shelter=true;l.flags.lamp=true;}
});
addMemoryChoice('shelter','ashen','s_stair',{
  t:'Tell Isera what a stranger\'s open door once meant to you',go:'s_permission',
  fx:l=>{l.flags.kael=true;l.flags.sharedShelter=true;l.flags.supplies=true;}
});
addMemoryChoice('thaw','asterhold','a_return_market',{
  t:'Listen beneath the ice; free the lower well bucket',go:'a_last_market',
  fx:l=>{l.flags.thawWell=true;townShift(l,1,-2);}
});
addMemoryChoice('mercy','asterhold','a_council',{
  t:'Stand beside Hesta; bring the outer families in before the gates close',go:'a_walls',
  fx:l=>{l.flags.farmersRescued=true;l.flags.walls=true;townShift(l,0,-1);}
});
// These earlier cross-world choices already work. List them beside the new ones so coverage is explicit.
for (const [memory,world,at,match] of [
  ['rootsong','hearthmere','h_well',c=>c.t.startsWith('Tell Puddle')],
  ['broth','asterhold','a_return_market',c=>c.t==='Make winter broth for the well queue'],
  ['bellcode','hearthmere','h_well',c=>c.t.includes('quay')]
]) MEMORY_USES.push({memory,world,at,choice:NODES[at].choices.find(match)});

NODES.a_return_market.choices.push(
  {t:'Ask Ressa to send kitchen hands to the frightened neighbors',
   need:l=>personIs(l,'ressa','grateful','mended')&&l.town.food>=1,
   why:l=>personIs(l,'ressa','hurt')?'The relief flour is still missing. Help bring it back before asking for more.':personIs(l,'ressa','guarded')?'Ressa will sell bread, but she has not invited you into her private kitchen.':l.town.food<1?'There is no food to send yet. Bren still needs hands at the well.':'First share the work or a meal with Ressa; she has her own queue to care for.',go:'a_last_market',
   fx:l=>{l.flags.ressaHands=true;townShift(l,1,-2);}},
  {t:'Ask Bren for the cart journey he promised after you unloaded',need:l=>personIs(l,'bren','owesHands'),
   why:'Bren has no spare journey promised to you. Helping with his flour earns hands in return.',go:'a_last_market',
   fx:l=>{l.flags.brenCart=true;l.flags.farmersRescued=true;townShift(l,1,-1);}}
);
NODES.h_prepared.choices.push({
  t:'Ask Puddle, your guest, to share spring water with the kitchen',need:l=>personIs(l,'puddle','guest'),
  why:'Puddle needs a place at the table before it can share as a guest. Its winter must not become a solitary watch.',go:'h_winter',
  fx:l=>{l.flags.puddleWater=true;hearthShift(l,1,1);}
});
NODES.h_winter.choices.push({
  t:'Share Vesper\'s own reserve; keep the table together',
  need:l=>personIs(l,'vesper','grateful')&&l.hearth.warmth>=1&&l.hearth.welcome>=1,
  why:l=>!personIs(l,'vesper','grateful')?'Vesper cannot carry another promise alone. She needed you beside the pantry or the stove.':'Her reserve is food, not a lit stove or a village willing to share it.',end:'e_hearth_shared',
  fx:l=>{l.flags.vesperReserve=true;hearthShift(l,2);}
});
NODES.s_work.choices.push(
  {t:'Ask Kael to stand as your witness beside the house record',
   need:l=>personIs(l,'kael','grateful','mended')&&has(l,'records'),
   why:l=>personIs(l,'kael','hurt')?'Kael is still carrying the people your seal turned away. Work beside him before asking for his word.':personIs(l,'kael','unrecognized')?'Kael cannot vouch for a person he does not remember. Shared work can introduce you again.':!has(l,'records')?'You have not read the house record. A witness needs something true to stand beside.':'First stand beside Kael and the families; his word is his to give.',go:'s_dusk',
   fx:l=>{l.flags.recordPublic=true;l.flags.kaelWitness=true;}},
  {t:'Ask Emmet to carry a copy of the seals with the families',
   need:l=>personIs(l,'emmet','owesHands')&&has(l,'records'),
   why:l=>!has(l,'records')?'You have not found the house record. The cold store is still a place to ask.':'Emmet is still preparing the crossing alone. Help with the boats before asking him to carry your evidence.',go:'s_dusk',
   fx:l=>{l.flags.recordPublic=true;l.flags.recordCourier=true;l.flags.guided=true;}}
);
// Existing repairs retain their exact prices, timing and gift costs; they also repair the personal relationship.
const mendKael = NODES.s_work.choices[0].fx;
NODES.s_work.choices[0].fx = l => { mendKael(l); l.flags.kaelMended=true; };
for (const n of Object.values(NODES)) {
  if (n.fx) { const fx=n.fx; n.fx=l=>{fx(l);rememberPeople(l);}; }
  for (const c of n.choices || []) if (c.fx) { const fx=c.fx; c.fx=l=>{fx(l);rememberPeople(l);}; }
}
function appendMemoryLines(id,more) {
  const before=NODES[id].lines;
  NODES[id].lines=l=>[...(typeof before==='function'?before(l):before||[]),...more(l)];
}
appendMemoryLines('a_last_market',l=>[
  ...(has(l,'thawWell')?[['bren','The bucket comes up full. Ressa has water for her ovens; the well queue is moving again.']]:[]),
  ...(has(l,'ressaHands')?[['ressa','You stayed when there was work. We can spare two kitchen hands now; they are knocking on the frightened doors.']]:[]),
  ...(has(l,'brenCart')?[['bren','You lifted my flour. I can lift these people out of the tide\'s way. The Fennels are in my cart, not outside the wall.']]:[]),
  ...(personIs(l,'ressa','mended')?[['ressa','The flour is home. I am still hurt, but I will work beside you again.']]:[])
]);
appendMemoryLines('h_prepared',l=>[
  ...(has(l,'springCalmed')?[['','You remember beasts mistaken for attackers. You wait. The spring stills; Puddle puts a bowl in the warm water rather than standing guard alone.']]:[]),
  ...(has(l,'rootShelter')?[['vesper','Oldroot? No, these have another name. But you remembered to ask. The cellar roots fold across the draught without being cut.']]:[]),
  ...(has(l,'seedbed')?[['','Vesper\'s own beans sit beside the stove. Remembering a warm seed teaches you where to plant; no object has crossed from another life.'],['vesper','A sheltered bed, not a miracle. I can keep that watered while you mend the room.']]:[]),
  ...(personIs(l,'puddle','guest')?[['puddle',l.gift==='speech'?'I have water to share. Will you ask me as a guest?':'Plip!'],['','Puddle brings its cup to the kitchen door, waiting to be invited rather than ordered.']]:[])
]);
appendMemoryLines('h_winter',l=>[
  ...(has(l,'puddleWater')?[['','Puddle pours a cup into the pot. Warm spring water runs clear; the small spirit keeps its chair beside yours.']]:[]),
  ...(personIs(l,'vesper','grateful')?[['vesper','You did not leave the work to me. I have one sack of my own; we can share it if the room and the people are ready.']]:[])
]);
appendMemoryLines('s_permission',l=>has(l,'sharedShelter')?[
 ['isera','Then use my upstairs grain too. I have kept that little cupboard for one frightened person. It can feed more than one.'],
 ['kael','A room, and food beside it. I will remember who helped carry both.']
]:[]);
appendMemoryLines('s_record',l=>has(l,'countedSacks')?[
 ['','You remember Voss calling occupied farms empty. This time you ask for a count; families identify their missing sacks before the steward can shut the cupboard.'],
 ['rulvek','You were meant to bring a seal, not ask everyone what it covered.']
]:[]);
appendMemoryLines('s_dusk',l=>[
 ...(has(l,'lanternWatch')?[['','Mira\'s remembered charm burns rot from the storehouse ropes. You carry the marked grain into the lower rooms. A light can clear a path; it has not cured Veyrin\'s plague.']]:[]),
 ...(has(l,'kaelWitness')?[['kael','I know your hands, and I have seen the seals. I will stand beside this page and answer with you.']]:[]),
 ...(has(l,'recordCourier')?[['emmet','You helped me bring people to the water. I can carry their evidence too. Nobody on the new shore needs to start without a witness.']]:[]),
 ...(personIs(l,'kael','mended')?[['kael','The door hurt. The work beside me helped. Neither needs to be forgotten.']]:[])
]);
function endingLines(l,id) {
  if (id==='e_walls'&&has(l,'farmersRescued')) return [
    ['','Lanthorn stands. The Fennels stand inside it. Hesta writes their names before Voss can say the farms were empty.'],
    ['hesta','You questioned the order without abandoning the people. We will keep that in the record.']
  ];
  return EPILOGUES[id] || [];
}
const councilBeforeRescue = NODES.a_council.lines;
NODES.a_council.lines = l => councilBeforeRescue(l).map(([who,text]) =>
  has(l,'farmersRescued') && who==='mira' && text.includes('still out there') ? ['mira','The Fennels are here. Bren brought them in. Do not tell us those farms were empty.'] : [who,text]);
appendMemoryLines('a_walls',l=>has(l,'farmersRescued')?[
 ['hesta','The families are behind us, not beyond us. Bren is bringing the last cart through.'],
 ['','Beyond the walls, the empty farm buildings burn. Their people carry their own names into the Guild Hall.']
]:[]);
const epilogueBeforeMemories=townEpilogue;
townEpilogue=function(l,id) {return [...epilogueBeforeMemories(l,id),
  ...(ENDINGS[id].death||id==='e_ash_rest'?[]:l.world==='hearthmere'&&has(l,'vesperReserve')?[['','Vesper opens her last sack beside the stove. The reserve becomes everyone\'s winter, not her quiet burden.']]:[]),
  ...(ENDINGS[id].death?[]:l.world==='ashen'&&has(l,'recordCourier')?[['','Emmet sets a dry copy of the seals on the new shore. The families can name what was taken, and ask for it together.']]:[])
];};