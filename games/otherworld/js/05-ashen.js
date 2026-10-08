'use strict';
/* OW0c: a third authored life. Return remembers knowledge, not this dawn's objects or favors. */
WORLDS.ashen.start='s_wake';
GIFTS.ashen={
 return:{name:'Return',good:'After death, wake again at this life\'s dawn with what you learned.',cost:'You alone remember the pain. Nobody else remembers your friendship or your work.'},
 oath:{name:'Blood Oath',good:'Make a promise that cannot be ignored.',cost:'Breaking your own promise binds your hands when others need them.'},
 silence:{name:'Silence',good:'Pass unseen where a name would shut the door.',cost:'Those who would welcome you can forget your face.'}
};
Object.assign(CAST,{
 kael:{name:'Kael',title:'Knight Without a House',skin:'#cca17f',hair:'short',hairCol:'#73747a',shirt:'#626774',bg:'#3b3449'},
 isera:{name:'Lady Isera',title:'Last Keeper of House Ardel',skin:'#e3bba0',hair:'bun',hairCol:'#8e878e',shirt:'#806579',bg:'#423342'},
 rulvek:{name:'Rulvek',title:'House Steward',skin:'#d4ab86',hair:'short',hairCol:'#4e4148',shirt:'#725c57',bg:'#3b3449'},
 emmet:{name:'Emmet',title:'Quay Lamplighter',skin:'#ad7f62',hair:'hat',hairCol:'#423932',shirt:'#79744f',bg:'#3f3c48'}
});
Object.assign(MEMORIES,{
 bellcode:'The quay bells count safe crossings, not the people lost. Listen before following a crowd.',
 mercy:'Kael kept a door open when his house ordered it shut. A duty can be questioned without abandoning the people behind it.'
});
Object.assign(MEMORY_REPLY,{
 bellcode:'You learned what the bell was saying, rather than what frightened people thought it said. Keep listening.',
 mercy:'A knight without a house, still holding a door. Titles can fall away without taking all our promises with them.'
});
Object.assign(ENDINGS,{
 e_ash_hearth:{title:'The House With No Crest',feel:'hopeful',keep:['mercy','bellcode']},
 e_ash_truth:{title:'The Record in Daylight',feel:'bittersweet',keep:['bellcode']},
 e_ash_quay:{title:'Lanterns Across the Water',feel:'hopeful',keep:['bellcode','mercy']},
 e_ash_keeper:{title:'The Unnamed Lamplighter',feel:'strange',keep:['mercy']},
 e_ash_death:{title:'The Closed Passage',feel:'death',death:true,keep:['bellcode']},
 e_ash_rest:{title:'A Dawn You May Leave',feel:'bittersweet',keep:['bellcode']}
});
const prepareBeforeAsh=prepareLife;
prepareLife=function(l,legacy=false){prepareBeforeAsh(l,legacy);if(l.world!=='ashen')return l;
 if(!l.ash||typeof l.ash!=='object'||Array.isArray(l.ash))l.ash={day:1,returns:0,knowledge:{}};
 if(!l.ash.knowledge||typeof l.ash.knowledge!=='object'||Array.isArray(l.ash.knowledge))l.ash.knowledge={};
 for(const[k,v,lo,hi]of[['day',1,1,3],['returns',0,0,1000000]])l.ash[k]=Number.isFinite(l.ash[k])?Math.max(lo,Math.min(hi,Math.floor(l.ash[k]))):v;
 return l;
};
const knowsStore=l=>!!l.ash.knowledge.store;
const ableHearth=l=>has(l,'supplies')&&has(l,'shelter')&&!has(l,'oathBroken');
Object.assign(NODES,{
 s_wake:{bg:'s_house',lines:l=>[
  ['', 'A bell tolls through ash-grey curtains. You wake on a narrow servant\'s bed. Beyond the window, the capital of Veyrin has shuttered its streets.'],
  ['isera','You there! The west stair. Bring the keys before the guard comes for the house.'],
  ['', 'Your apron bears the crest of House Ardel. Someone has sewn it over a tear.'],
  ...(l.ash.returns?[
   ['', 'Dawn again. The same bell. The pain returns before the memory settles; you hold the bed frame until you can stand.'],
   ['', 'Nobody remembers the last day but you. The keys, the meals, the promises: you will have to choose them again.']
  ]:[]),
  ...(l.mem.mercy?[['','You remember a knight holding a door, though you have never met him in this life.']]:[])
 ],choices:[
  {t:'Take the west stair to the keys',go:'s_stair'},
  {t:'Lay Return down; let the Archivist close this life',need:l=>l.gift==='return'&&(l.ash.returns>0||l.mem.bellcode),why:'This choice is for a soul who has already returned to this dawn. There is still a safe road through the house.',end:'e_ash_rest'}
 ]},
 s_stair:{bg:'s_house',lines:[
  ['', 'A man in a worn knight\'s coat is holding the west door open. Families wait on the step.'],
  ['kael','Kael. They took my crest when I refused to close this door. They left me the coat; it is good against the cold.'],
  ['rulvek','The guards arrive at dusk. Lady Isera may keep her rooms if we seal the lower house. There is not enough for everyone.'],
  ['kael','He has said that every morning. Ask to see the cupboard before you believe it.']],choices:[
  {t:'Help Kael bring the families inside',go:'s_gift',fx:l=>{l.flags.shelter=true;l.flags.kael=true;}},
  {t:'Ask Isera for permission to open the lower rooms',go:'s_permission',fx:l=>{l.flags.kael=true;}},
  {t:'Follow the steward to the house records',go:'s_gift',fx:l=>{l.flags.steward=true;}}
 ]},
 s_permission:{bg:'s_house',lines:[
  ['isera','I thought the lower house was empty. No. That is easier to say than to find out. Open it.'],
  ['kael','Then help me carry the beds. Permission is a fine thing when it gets its hands dirty.']],fx:l=>{l.flags.shelter=true;},go:'s_gift'},
 s_gift:{bg:'s_archive',fx:l=>{
  if(l.gift==='oath')l.flags.sworn=true;
  if(l.gift==='silence'){l.flags.forgotten=true;l.flags.records=true;l.ash.knowledge.store=true;l.ash.knowledge.record=true;}
 },lines:l=>[
  ['', 'The gift follows you through the quiet hall.'],
  ...({return:[['','The bell catches in your breath. You know, with no explanation, that death would bring you back to this morning.'],['kael','You look as though you have heard that bell before. Come slowly. Nobody needs to prove courage on these stairs.']],
   oath:[['','You promise: no one beyond this door will be left without a hearth. A red thread closes around your wrist.'],['isera','Then I promise the lower rooms will stay open. It seems we both have something to answer for.']],
   silence:[['','You step past the steward unseen. The records show full sacks sent to a cold store by the quay while this house goes hungry.'],['','When you return, Kael moves aside politely, as for a stranger. He does not recognize the person who climbed the stair beside him.'],['kael','Were you looking for work? I can show you where the beds need carrying.']]}[l.gift])
 ],go:'s_square'},
 s_square:{bg:'s_quay',fx:l=>{l.ash.day=Math.max(l.ash.day,2);},lines:l=>[
  ['', 'The next morning, ash settles on the quay. Plague bells sound inland; beside the water, three smaller bells answer in a different order.'],
  ['emmet','Not funeral bells. Three rings: wait for the crossing. Two: the lower stair is clear. The crowd keeps running on the third.'],
  ...(l.mem.thaw?[['','Puddle taught you to listen beneath a frightening silence. You hear the water lapping below the lower stair.']]:[]),
  ...(l.mem.broth?[['','Vesper\'s broth would stretch the house grain, if you can find where it has gone.']]:[]),
  ['rulvek','Bring me the house seal. I can save Isera\'s place. The lower rooms will have to close.'],
  ['kael','Or find the missing sacks. Or get these families to the river boats before the guards arrive. I will help whichever people you choose to stand beside.']],choices:[
  {t:'Go with Kael to the cold store; check the missing sacks',go:'s_store',fx:l=>{l.flags.kael=true;}},
  {t:'Deliver the seal; keep Isera\'s rooms by closing the lower house',go:'s_seal',fx:l=>{l.flags.seal=true;l.flags.shelter=false;if(l.gift==='oath')l.flags.oathBroken=true;}},
  {t:'Stay with Emmet; prepare the boats for the families',go:'s_boats',fx:l=>{l.flags.boats=true;}},
  {t:'Copy the house record where everyone can read it',need:l=>has(l,'records')||!!l.ash.knowledge.record,why:'You have not seen the record or learned where the sacks went. The cold store is still a place to ask.',go:'s_record',fx:l=>{l.flags.recordPublic=true;}},
  {t:'Force the upper passage open despite the warning bell',go:'s_closed'}
 ]},
 s_closed:{bg:'s_quay',night:true,fx:l=>{l.ash.knowledge.store=true;},lines:[
  ['emmet','Wait! The third bell means the upper stair is being closed. Use the lower one!'],
  ['', 'You hear him too late. The passage fills with ash and falling stone. Your hand finds the cold-store mark on the wall before the light goes.']],end:'e_ash_death'},
 s_store:{bg:'s_archive',fx:l=>{l.flags.records=true;l.ash.knowledge.store=true;l.ash.knowledge.record=true;},lines:l=>[
  ['', 'The cold store is full. Each sack bears yesterday\'s house seal. The guard at the door has been told these are the last supplies in the city.'],
  ['kael','Our door has empty bowls. This one has locked grain. They cannot both be unavoidable.'],
  ...(l.ash.returns&&knowsStore(l)?[['','You recognize the cold-store mark from another dawn. Kael does not; you show him where to look.']]:[]),
  ...(l.gift==='oath'?[['','Your promise tightens at your wrist. The guard asks you to say it aloud; the thread runs around his own forgotten house oath.']]:[]),
  ...(l.gift==='silence'?[['','The latch does not notice your hand. You could lift a sack, but Kael might not remember who gave it to him.']]:[])
 ],choices:[
  {t:'Bring the marked sacks to the house, in daylight',go:'s_work',fx:l=>{l.flags.supplies=true;l.flags.shelter=true;l.flags.kael=true;}},
  {t:'Copy the seals; leave the sacks where they are',go:'s_record',fx:l=>{l.flags.recordPublic=true;}},
  {t:'Take supplies quietly to the river boats',go:'s_boats',fx:l=>{l.flags.boats=true;l.flags.supplies=true;}}
 ]},
 s_seal:{bg:'s_house',lines:l=>[
  ['isera','My rooms? That is what you saved? I cannot sleep above a door I helped close.'],
  ...(l.gift==='oath'?[
   ['', 'You reach for a bedframe. The red thread binds your fingers shut. You broke the promise you spoke; your hands will not do that work now.'],
   ['kael','Then let me carry it. You can still tell the others where to go. A hurt promise must not become an excuse to leave people outside.']
  ]:[['kael','There is still time to take the families to the quay. The seal is not the people.']]),
  ['isera','Give Emmet my lamp. I can at least light the road from this window.']],fx:l=>{l.flags.lamp=true;},go:'s_work'},
 s_record:{bg:'s_archive',lines:l=>[
  ['', 'You hang a copy of the seals where the quay queue can read it. Some recognize their own sacks. Others begin asking who locked this door.'],
  ...(has(l,'forgotten')?[['emmet','Someone left the copy. I wish I knew whom to thank.']]:[['emmet','Stay with it. A record is safer beside someone who will answer a question.']]),
  ['kael','They have something solid to ask about now. But a page will not carry a tired child down the stair. We have work before dusk.']],go:'s_work'},
 s_boats:{bg:'s_quay',lines:l=>[
  ['emmet','Boats, blankets, lower stair. Leave the big house its crest. We can find a shore without one.'],
  ...(l.mem.thaw?[['','You hear the safe water beneath the ash-dark surface and help Emmet move a boat off the shallow step.']]:[]),
  ...(l.mem.broth?[['','You teach the waiting families the winter broth. A small sack of grain fills more bowls than anyone expected.']]:[]),
  ['kael','Count people, not boats. I have left my coat on the last one so nobody mistakes it for empty.']],go:'s_work'},
 s_work:{bg:'s_house',lines:l=>[
  ['', 'Before dusk, there is time for one task done properly.'],
  ['kael',has(l,'forgotten')?'I do not know your name. I know the work in front of us. That is enough to begin.':'Tell me which end to lift. We can argue with a falling house after the people are safe.']],choices:[
  {t:'Work beside Kael; carry beds and say your name again',need:l=>!has(l,'oathBroken'),why:'The broken oath holds your hands shut. You can still direct people to the river boats.',go:'s_dusk',fx:l=>{l.flags.shelter=true;l.flags.forgotten=false;l.flags.kael=true;}},
  {t:'Direct every family to Emmet\'s lower stair',go:'s_dusk',fx:l=>{l.flags.boats=true;l.flags.guided=true;}},
  {t:'Remain unseen; keep lamps lit along the empty streets',need:l=>l.gift==='silence',why:'You would need Silence to pass the closed streets unseen.',go:'s_dusk',fx:l=>{l.flags.keeper=true;l.flags.forgotten=true;}},
  {t:'Make Vesper\'s broth for the house',need:l=>!!l.mem.broth&&!has(l,'oathBroken'),why:l=>has(l,'oathBroken')?'The oath holds your hands shut. Emmet still needs a voice to guide the waiting people.':'You have not brought the winter-broth recipe from Hearthmere.',go:'s_dusk',fx:l=>{l.flags.supplies=true;l.flags.shelter=true;l.flags.broth=true;l.flags.forgotten=false;}}
 ]},
 s_dusk:{bg:'s_house',night:true,fx:l=>{l.ash.day=3;},lines:l=>[
  ['', 'At dusk the guards take down House Ardel\'s crest. Nobody cheers. The plague has not vanished with a piece of cloth.'],
  ['isera','This house will not belong to my family tomorrow. I would rather it belonged to someone alive.'],
  ...(has(l,'oathBroken')?[['','The red thread is still tight. Kael carries the lamp you cannot hold. He does not ask you to pretend nothing happened.']]:[]),
  ...(has(l,'forgotten')?[['','People pass you without a greeting. Every lamp you tend is still seen.']]:[]),
  ['kael','The doors are changing hands. What shall we keep?']],choices:[
  {t:'Keep the lower house as a shelter without a crest',need:ableHearth,why:l=>has(l,'oathBroken')?'Your broken promise still binds your hands. Guide the families to a safe shore instead.':!has(l,'supplies')?'The beds have no food beside them. The river boats remain a way to care for the families.':'You did not open the lower rooms. Emmet can still take people across the water.',end:'e_ash_hearth'},
  {t:'Go with the families to a new shore',end:'e_ash_quay'},
  {t:'Remain with the public record; answer for what the house hid',need:l=>has(l,'recordPublic')&&!has(l,'forgotten'),why:l=>has(l,'forgotten')?'Nobody remembers the witness behind this page. You chose to keep working unseen.':'You have not placed a public copy of the house seals.',end:'e_ash_truth'},
  {t:'Keep the street lamps, without a name',need:l=>has(l,'keeper')&&l.gift==='silence',why:'This path belongs to someone who chose to remain unseen and tend the street lamps.',end:'e_ash_keeper'}
 ]}
});
Object.assign(EPILOGUES,{
 e_ash_hearth:[['','The crest comes down. The beds remain. Kael answers the door in a plain coat while Isera washes the bowls she once counted from upstairs.'],['isera','They can take a name off a house. They cannot take this work out of our hands.'],['','Veyrin is still ill. This one door is open. Each morning, someone else learns to knock.']],
 e_ash_truth:[['','People take copies of the seals home. There is no single speech that puts the city right. There are questions the steward can no longer close in a cupboard.'],['kael','The boats are away. I will sit beside this page with you.'],['','You spend a life answering questions, and learn to write when you do not yet know.']],
 e_ash_quay:[['','The lower stair stays lit until the last family is aboard. The house crest disappears behind the ash, but nobody is counted as cargo.'],['kael','My coat is on the last boat. So am I. You coming?'],['','Across the water, there is room to begin. You cannot save every street by leaving one; you can carry these people to a shore.']],
 e_ash_keeper:[['','Nobody remembers the lamplighter. Nobody walks the lower stair in darkness. Emmet leaves oil where an unseen hand can find it.'],['','You grow old in a city that never learns your name, and learns the way home by your lamps.']],
 e_ash_death:[['','The upper passage closes. It is quick, and frightening, and over.'],['','The bell was a warning, not a command to hurry. You carry its meaning beyond the dark.']],
 e_ash_rest:[['','You sit on the servant\'s bed and let the bell finish. You do not have to spend another dawn proving that the pain can be endured.'],['archivist','Come here. A life is not a debt you must keep paying. I will keep what you learned.']]
});
const epilogueBeforeAsh=townEpilogue;
townEpilogue=function(l,e){if(l.world!=='ashen')return epilogueBeforeAsh(l,e);if(ENDINGS[e].death||e==='e_ash_rest')return [];return [
 ...(has(l,'oathBroken')?[['','The thread loosens slowly while you keep new, smaller promises. Kael takes the heavier work until your hands can open again.']]:[]),
 ...(has(l,'broth')?[['','Isera writes Vesper\'s broth in the house book, under meals that can be shared.']]:[]),
 ...(l.ash.returns?[['','Nobody remembers the dawns you lost. You remember the people you chose to meet again.']]:[])
];};
function ashRewind(l){
 if(S.life!==l||l.world!=='ashen'||l.gift!=='return')return false;
 const knowledge={...l.ash.knowledge},returns=l.ash.returns+1;
 l.flags={};l.entered={};l.silver=0;l.status=false;delete l.ending;delete l.town;
 l.ash={day:1,returns,knowledge};l.at='s_wake';prepareLife(l);save();run('s_wake');return true;
}
const finishBeforeAsh=finish;
finish=function(id){const l=S.life,e=ENDINGS[id];
 if(!l||l.world!=='ashen'||l.gift!=='return'||!e?.death)return finishBeforeAsh(id);
 prepareLife(l);l.ending=id;save();
 D.play([...(EPILOGUES[id]||[]),['','Your gift catches the last breath. The world folds back to dawn; you will remember, but it will not.']],()=>{if(S.life===l&&l.ending===id)ashRewind(l);});
};
// The boot hook calls the current finish function; expose the same dispatcher to browser checks.
// New world state stays local; no new global storage key or hub record format.
NODES.h_well.choices.splice(2,0,{
 t:'Read the water\'s answering sounds as you learned at the quay',need:l=>!!l.mem.bellcode,
 why:'You have not learned the quay-bell pattern in another life.',go:'h_gift',
 fx:l=>{l.flags.puddle=true;l.flags.listened=true;hearthShift(l,0,0,1);}
});

/* A sick city is shown through closed windows, waiting lamps and empty/public rooms, not meters. */
function drawAshen(t,place){
 const l=S.life,s=Math.max(2,Math.floor(Math.min(W/210,H/140))),gy=H*.5,dark=night||l?.ash?.day===3;
 AMB.sky(cx,W,H,t,{top:'#272b3d',bottom:dark?'#5e4d59':'#96919b',h:gy,clouds:{n:5}});
 AMB.far(cx,W,H,t,{layers:[{kind:'ruins',col:'#555261',base:.45,h:.19,seed:9}],px:s});
 R(0,gy,W,H-gy,'#626169');for(let i=0;i<25;i++)R((i*81)%W,gy+(i%7)*s*3,s*9,s,'#77737a');
 const lamps=[];
 if(place==='house'){
  const x=W*.2,y=gy-s*36;R(x,y,W*.6,s*38,'#756e77');R(x-s*2,y-s*4,W*.6+s*4,s*5,'#4d4857');
  for(let i=0;i<3;i++){const wx=W*(.25+i*.19);R(wx,y+s*7,s*13,s*17,'#302f3e');R(wx+s*2,y+s*9,s*9,s*13,'#ae967a');R(wx+s*6,y+s*7,s,s*17,'#5c5361');}
  const door=W*.47;R(door,gy-s*17,s*15,s*19,l?.flags.shelter?'#272c36':'#4e434d');
  if(!l?.flags.shelter)R(door-s,gy-s*8,s*17,s*2,'#83736a');
  if(l?.ash?.day<3){R(W*.48,y-s*2,s*10,s*9,'#796078');R(W*.48+s*4,y,s*2,s*4,'#d4b884');}
  R(W*.19,gy+s*2,W*.62,s*4,'#9a8a80');
  for(let i=0;i<(l?.flags.shelter?3:1);i++)ashPerson(W*.28+i*s*11,gy+s*14,s,t,i);
  ashPerson(W*.65,gy+s*12,s,t,4);lamps.push({x:W*.49,y:gy-s*9,r:H*.35,col:'#eabe7d'});
 }else if(place==='archive'){
  R(0,H*.08,W,H*.48,'#393543');for(let i=0;i<4;i++){const x=W*(.05+i*.25);R(x,H*.17,s*34,s*35,'#5c5159');for(let j=0;j<3;j++){
   R(x+s*2,H*.17+s*(9+j*10),s*29,s*2,'#332e3b');
   for(let k=0;k<6;k++)R(x+s*(3+k*5),H*.17+s*(1+j*10),s*3,s*7,['#a4977e','#756979','#929075'][k%3]);}}
  R(W*.35,H*.43,W*.3,s*5,'#8a7565');R(W*.37,H*.43+s*5,s*3,s*13,'#5b4b44');R(W*.6,H*.43+s*5,s*3,s*13,'#5b4b44');
  R(W*.43,H*.43-s*6,s*12,s*6,'#d1c4a5');R(W*.44,H*.43-s*5,s*9,s,'#676471');
  R(W*.62,H*.35,s*2,s*8,'#e5d4a1');R(W*.62,H*.35-s*2,s*2,s*2,'#ffda89');lamps.push({x:W*.62,y:H*.35,r:H*.35,col:'#edbf7d'});
 }else{
  R(0,gy-s*3,W,H*.22,'#475968');for(let i=0;i<9;i++)R((i*93+(reduce?0:t*5))%W,gy+s*(i%4)*3,s*15,s,'#71818b');
  R(0,gy+s*18,W,s*5,'#847b76');for(let i=0;i<10;i++)R(i*W*.12,gy+s*18,s*2,s*12,'#4e4549');
  const x=W*.28,y=gy+s*8;R(x,y,W*.4,s*7,'#645349');R(x+s*5,y+s*7,W*.4-s*10,s*3,'#453e41');
  for(let i=0;i<3;i++)R(x+s*(5+i*8),y-s*6,s*6,s*6,l?.flags.supplies?'#b7aa80':'#6e6970');
  ashPerson(W*.67,gy+s*10,s,t,2);ashPerson(W*.16,gy+s*14,s,t,4);
  if(l?.flags.recordPublic){R(W*.75,gy-s*26,s*15,s*22,'#5d5459');R(W*.75+s*2,gy-s*24,s*11,s*15,'#d8cbae');for(let i=0;i<4;i++)R(W*.75+s*4,gy-s*(21-i*3),s*7,s,'#726673');}
  lamps.push({x:W*.68,y:gy-s*10,r:H*.4,col:'#e6b879'});
 }
 if(l?.gift!=='silence'||!l?.flags.forgotten)ashPerson(W*.12,gy+s*16,s,t,5);
 AMB.weather(cx,W,H,t,{ash:.3,ground:H,px:s});
 AMB.lights(cx,W,H,t,{dark:dark?.64:.3,max:.48,lights:lamps});
}
function ashPerson(x,y,s,t,i){const b=reduce?0:Math.sin(t+i)*s*.12;R(x-s*2,y+s*8,s*8,s,'rgba(20,18,28,.4)');R(x,y-s*5+b,s*4,s*4,'#ceab89');R(x-s,y-s*7+b,s*6,s*3,i===4?'#96979d':'#504754');R(x-s,y-s+b,s*6,s*7,i===4?'#686c7c':i===5?'#8a8272':'#786976');R(x,y+s*6,s,s*3,'#35343f');R(x+s*3,y+s*6,s,s*3,'#35343f');}
SCENES.s_house=t=>drawAshen(t,'house');SCENES.s_archive=t=>drawAshen(t,'archive');SCENES.s_quay=t=>drawAshen(t,'quay');
