'use strict';
/* T39: Hearthmere, an authored life. Days advance only at story moments, never while reading.
   New lives use hearth; Asterhold saves and entered-node receipts remain untouched. */
WORLDS.hearthmere.start = 'h_key';
GIFTS.hearthmere = {
  cooking: {name:'Hearth Cooking',good:'A meal can mend a frightened heart.',cost:'Healing food takes time; some departures cannot wait.'},
  speech: {name:'Spirit Speech',good:'Hear the spirits who live beside the village.',cost:'The living may mistake your conversations for something frightening.'},
  green: {name:'Green Thumb',good:'Wake seeds even in the cold.',cost:'Everything grows, including the weeds you did not plant.'}
};
CAST.puddle = {name:'Puddle',title:'Spirit of the Inn Well',skin:'#9fcfc8',hair:'short',hairCol:'#699da7',shirt:'#628f9e',bg:'#324c59'};
CAST.vesper = {name:'Vesper',title:'Keeper of the Spare Key',skin:'#cda07c',hair:'bun',hairCol:'#b8bbb0',shirt:'#638368',bg:'#395347'};
CAST.tavi = {name:'Tavi',title:'Pass Courier',skin:'#e2b794',hair:'short',hairCol:'#55422c',shirt:'#aa7947',bg:'#555846'};
Object.assign(MEMORIES, {
  broth:'Vesper\'s winter broth: a little grain can go further when everyone brings a bowl.',
  thaw:'Puddle\'s thaw song: listen for the water moving under the ice.',
  shelter:'A stranger once held a door for you. Shelter is a choice, not a reward.'
});
Object.assign(MEMORY_REPLY, {
  broth:'You brought a recipe, not a feast. Good. A recipe can be shared more than once.',
  thaw:'A voice beneath the ice. You listened before you named it danger.',
  shelter:'You remember a door kept open. I hope another world gives you a chance to do the same.'
});
Object.assign(ENDINGS, {
  e_hearth_shared:{title:'A Table Through Winter',feel:'hopeful',keep:['broth','shelter']},
  e_hearth_banked:{title:'One Ember Kept',feel:'bittersweet',keep:['shelter']},
  e_hearth_pass:{title:'The Last Lantern Over the Pass',feel:'bittersweet',keep:['broth']},
  e_hearth_lake:{title:'The Guest Beneath the Ice',feel:'strange',keep:['thaw','shelter']}
});
const prepareBeforeHearth = prepareLife;
prepareLife = function(life, legacy=false){
  prepareBeforeHearth(life,legacy);
  if(life.world!=='hearthmere')return life;
  life.hearth ||= {day:1,stores:1,warmth:0,welcome:0};
  for(const [k,base,lo,hi] of [['day',1,1,3],['stores',1,0,6],['warmth',0,0,3],['welcome',0,0,3]])
    life.hearth[k]=Number.isFinite(life.hearth[k])?Math.max(lo,Math.min(hi,Math.floor(life.hearth[k]))):base;
  return life;
};
function hearthShift(l,stores=0,warmth=0,welcome=0){const h=l.hearth;for(const [k,n,max] of [['stores',stores,6],['warmth',warmth,3],['welcome',welcome,3]])h[k]=Math.max(0,Math.min(max,h[k]+n));}
function hearthDay(l,day){while(l.hearth.day<Math.min(3,day)){l.hearth.day++;hearthShift(l,-1);}}
function hearthView(l){const h=l?.hearth||{day:1,stores:1,warmth:0,welcome:0};return {snow:h.day-1,open:!!l?.flags.innOpen,fire:h.warmth>0,bowls:h.stores>=2?3:h.stores>0?1:0,guests:h.welcome,weeds:!!l?.flags.weeds,puddle:!!l?.flags.puddle,late:!!l?.flags.late};}
const winterReady = l => l.hearth.stores>=2 && l.hearth.warmth>=1 && l.hearth.welcome>=1;
const passReady = l => !has(l,'late')&&!has(l,'weeds');
const lakeReady = l => has(l,'puddle')&&(l.gift==='speech'||l.mem.rootsong||l.mem.thaw);
Object.assign(NODES, {
 h_key:{bg:'h_inn',lines:[
  ['', 'A brass key on a string. Mist over a green lake. An inn with a board across its door. You wake with the key in your hand.'],
  ['vesper','There you are. The last Keeper left that key for whoever would come next. I was beginning to think next meant never.'],
  ['vesper','I am Vesper. This is the Reedlight Inn, or was. Three mornings before the long snow shuts the pass. There are people without a hearth.'],
  ['', 'Inside: dust, four empty beds and a table worn smooth by elbows. Beyond the kitchen, something splashes in the well.']],go:'h_threshold'},
 h_threshold:{bg:'h_inn',lines:l=>[
  ['vesper','You need not promise the whole village a miracle. Start with a door that opens.'],
  ...(l.mem.shelter?[['','You remember being the person outside a closed door. The key feels heavier.']]:[]),
  ['tavi','I carry the last lantern over the pass tomorrow. If you mean to leave with us, pack before dusk.']],choices:[
  {t:'Take down the board; invite the village in',go:'h_well',fx:l=>{l.flags.innOpen=true;hearthShift(l,0,1,1);}},
  {t:'Mend the stove first; open one warm room',go:'h_well',fx:l=>{l.flags.innOpen=true;l.flags.stove=true;hearthShift(l,0,2);}},
  {t:'Keep the door shut until you know the well is safe',go:'h_well',fx:l=>{l.flags.cautious=true;}}
 ]},
 h_well:{bg:'h_well',lines:l=>[
  ['', 'A bucket rises without a rope. Two small eyes look over its rim, then vanish.'],
  ['puddle',l.gift==='speech'?'You can hear? Oh. Oh dear. I rehearsed what to say, but not to someone.':'...Plip?'],
  ['vesper','The well has kept this inn through every winter. Leave an empty cup by it if you want to be polite.'],
  ...(l.mem.thaw?[['','You remember the thaw song. A ripple answers when you hum.']]:[]),
  ...(l.mem.rootsong?[['','The slow song of Oldroot fits beneath the sound of the bucket, like another voice.']]:[])],choices:[
  {t:'Leave a cup; sit until the little spirit comes back',go:'h_gift',fx:l=>{l.flags.puddle=true;hearthShift(l,0,0,1);}},
  {t:'Tell Puddle you can hear the water beneath the ice',need:l=>l.gift==='speech'||l.mem.thaw||l.mem.rootsong,why:'You need Spirit Speech, the thaw song, or a remembered forest song to understand that voice.',go:'h_gift',fx:l=>{l.flags.puddle=true;l.flags.listened=true;hearthShift(l,0,0,1);}},
  {t:'Draw a bucket for the kitchen; leave the well in peace',go:'h_gift',fx:l=>{l.flags.water=true;hearthShift(l,1);}}
 ]},
 h_gift:{bg:'h_kitchen',fx:l=>{
  if(l.gift==='cooking'){l.flags.late=true;hearthShift(l,2,1);}
  if(l.gift==='speech'){l.flags.odd=true;hearthShift(l,0,1);}
  if(l.gift==='green'){l.flags.weeds=true;hearthShift(l,3);}
 },lines:l=>[
  ['', 'You try the gift the Archivist placed in your hands.'],
  ...({cooking:[['','A pot of barley broth catches the light. Vesper tastes it and, for the first time today, sits down.'],['vesper','I had forgotten what it feels like to be looked after.'],['','You cook for each tired person who comes. When the last bowl is warm, Tavi is already on the upper road. The dawn caravan cannot wait for you.']],
   speech:[['puddle','The stove is cold because the chimney spirit is sulking. You swept its favorite cobweb.'],['','You apologize to the chimney. Fire catches; the room warms. Two neighbors hear you speaking to empty brick and back away.'],['vesper','They do not know who you are talking to. Give them time, and something they can see.']],
   green:[['','Beans climb the kitchen sill in an hour. So does the bindweed beside the door.'],['tavi','Food! Good. But your front step has disappeared. Nobody gets a cart through that until you clear it.'],['','The roots hold the latch shut. The village can smell dinner through the window, but cannot come in.']]}[l.gift])],go:'h_morning'},
 h_morning:{bg:'h_inn',fx:l=>hearthDay(l,2),lines:l=>[
  ['', 'The second morning lays a skin of ice along the lake. Vesper counts sacks in the pantry, not coins.'],
  ['vesper',l.hearth.stores<=1?'Enough for tonight, perhaps. Winter asks the same question again tomorrow.':'There is food. Now there must be somewhere warm to eat it.'],
  ...(has(l,'puddle')?[['puddle',l.gift==='speech'?'Under the lake there is a warm spring. It is lonely. Like the inn was.':'Plip. ... Plip!'],['','Puddle sets a wet leaf beside your hand. Its veins trace a path to the shore.']]:[]),
  ['tavi',has(l,'late')?'I came back for my gloves. The others have gone. I can stay and help, but I cannot turn them around.':'I leave at dusk. After that the pass belongs to the snow.']],go:'h_prep'},
 h_prep:{bg:'h_kitchen',lines:[
  ['vesper','We cannot do everything today. Pick what we can do properly, and I will take the other end of it.']],choices:[
  {t:'Fill the pantry together; leave a bowl for every neighbor',go:'h_prepared',fx:l=>{hearthShift(l,3,0,1);l.flags.pantry=true;l.flags.innOpen=true;}},
  {t:'Clear the front step; mend the stove and welcome the neighbors',go:'h_prepared',fx:l=>{l.flags.weeds=false;l.flags.odd=false;l.flags.innOpen=true;hearthShift(l,0,2,2);l.flags.door=true;}},
  {t:'Cook Vesper\'s winter broth from a remembered recipe',need:l=>!!l.mem.broth,why:'You have not brought the winter-broth recipe from another life.',go:'h_prepared',fx:l=>{hearthShift(l,2,1,1);l.flags.recipe=true;l.flags.innOpen=true;}},
  {t:'Follow Puddle\'s leaf to the warm spring',need:l=>has(l,'puddle'),why:'Puddle has not offered you its leaf. The pantry and front step still need hands.',go:'h_spring',fx:l=>{hearthShift(l,0,1);l.flags.spring=true;}},
  {t:'Pack for the last lantern over the pass',need:passReady,why:l=>has(l,'late')?'The dawn caravan left while you were cooking. Staying can still make a good life.':'Bindweed has closed your step. Clear it before trying to take a cart out.',go:'h_pack',fx:l=>{l.flags.packed=true;}}
 ]},
 h_spring:{bg:'h_lake',lines:l=>[
  ['', 'Puddle leads you to a circle where ice will not settle. Beneath it, warm water rises from the dark.'],
  ['puddle',l.gift==='speech'?'The spring can keep the well awake. But it needs someone beside it when the lake goes quiet.':'... Plip.'],
  ['', 'You could ask a spirit to spend its whole winter serving the inn. Or you could make room for a guest who has spent too long alone.']],choices:[
  {t:'Invite Puddle to the table; do not ask it to keep watch alone',go:'h_prepared',fx:l=>{l.flags.guest=true;l.flags.innOpen=true;hearthShift(l,2,0,1);}},
  {t:'Promise to stay beside the spring through winter',need:lakeReady,why:'You need Puddle\'s trust and a way to understand the song under the ice.',go:'h_prepared',fx:l=>{l.flags.lakePromise=true;l.flags.innOpen=true;}},
  {t:'Return to Vesper; carry water and gather fallen wood',go:'h_prepared',fx:l=>{hearthShift(l,1,1);l.flags.wood=true;}}
 ]},
 h_pack:{bg:'h_inn',lines:[
  ['tavi','Take only what you can carry. Vesper knows the little houses by the lake. She will keep one hearth lit.'],
  ['vesper','Leaving is not the same as forgetting. Sit once more before you go.']],go:'h_prepared'},
 h_prepared:{bg:'h_inn',lines:l=>[
  ['', has(l,'weeds')?'Beans crowd the sill; bindweed still holds the step. Vesper opens the side door so nobody has to go hungry outside.':'The step is clear. A lantern waits beside the door.'],
  ...(has(l,'odd')?[['vesper','Some still keep their distance. I will put the empty cup where they can see who answers.']]:[]),
  ...(has(l,'pantry')?[['','Neighbors bring what they have: oats, dried apples, one small bag of salt. The cupboard closes only when Vesper leans against it.']]:[]),
  ...(has(l,'door')?[['','Vesper holds a ladder while you clear the chimney. People come in when they see smoke above the roof.']]:[]),
  ...(has(l,'recipe')?[['vesper','You know that recipe? My mother taught it to me. Come; we can make it stretch.']]:[]),
  ...(has(l,'guest')?[['','Puddle sits in a blue basin on a chair. Tavi brings it an empty spoon, which it accepts solemnly.']]:[]),
  ['', 'The wind changes. Snow begins on the upper road.']],choices:[
  {t:'Sit for one last meal; stay beside the inn',go:'h_winter'},
  {t:'Pack with Tavi while the upper gate is still open',need:passReady,why:l=>has(l,'late')?'The caravan left while you were cooking. Tavi will hang the lantern here.':'Bindweed still holds the step. The cart cannot get out.',go:'h_winter',fx:l=>{l.flags.packed=true;}}
 ]},
 h_winter:{bg:'h_inn',night:true,fx:l=>hearthDay(l,3),lines:l=>[
  ['', 'The third morning is white. The pass bell rings once, then its rope freezes. Winter has arrived.'],
  ['vesper',winterReady(l)?'Enough in the pantry. Enough wood. Enough chairs, if we move close. What shall this place be?':'We cannot warm every bed. We can keep one room, and help the others reach the village hearths.'],
  ...(has(l,'puddle')?[['puddle',l.gift==='speech'?'I have never had a chair before.':'Plip!']]:[]),
  ['tavi',has(l,'packed')?'My lantern is ready. Say the word before the upper gate disappears.':'I will hang my lantern here. Someone should be able to find this door.']],choices:[
  {t:'Keep the table open through the long winter',need:winterReady,why:l=>l.hearth.stores<2?'The pantry will not feed every bed. Keep one warm room and share the village hearths instead.':l.hearth.warmth<1?'There is food, but the rooms are cold. Vesper can help keep one ember alive.':'The beds are ready, but you have not brought the neighbors together. Begin with one warm room.',end:'e_hearth_shared'},
  {t:'Keep one ember; help everyone find a hearth',end:'e_hearth_banked'},
  {t:'Carry the last lantern over the pass with Tavi',need:l=>has(l,'packed')&&passReady(l),why:l=>has(l,'late')?'The caravan left while you were cooking. Tavi is staying with you.':has(l,'weeds')?'The cart cannot pass the bindweed. Vesper has opened the side door for those staying.':'You did not pack with Tavi while the upper road was still open.',end:'e_hearth_pass'},
  {t:'Keep your promise at the warm spring',need:l=>has(l,'lakePromise')&&lakeReady(l),why:'You have not promised Puddle a winter beside the spring. A chair by the hearth is still a kindness.',end:'e_hearth_lake'}
 ]}
});
Object.assign(EPILOGUES, {
 e_hearth_shared:[['','Each morning somebody brings wood. Each evening somebody washes bowls. The inn becomes less yours, and more itself.'],['vesper','Reedlight. We can put the name back over the door.'],['','Spring returns slowly. When the pass opens, no one is waiting to be rescued. They are waiting to show travelers to a table.']],
 e_hearth_banked:[['','The upper rooms stay shut. Vesper walks each guest to a warm house, and you keep soup on the stove for whoever knocks.'],['vesper','An inn is not only its beds. You kept a door. That counts.'],['','Come spring, you mend the first upstairs window together. It is a beginning, not a failure.']],
 e_hearth_pass:[['','Tavi walks ahead with the lantern. You bring broth in a wrapped pot, passing it back along the line when the road grows steep.'],['tavi','Look. The next village has seen our light.'],['','You spend the winter carrying letters between hearths. In each one, you ask after a little inn by a green lake.']],
 e_hearth_lake:[['','You sit beside the spring until the snow covers your boots. Puddle teaches you a song with spaces wide enough for winter.'],['puddle','You do not have to become water. Just stay until I finish this verse.'],['','Under the lake, a light answers. Above it, the inn well never freezes. When you return in spring, Vesper sets two cups beside your chair.']]
});
const epilogueBeforeHearth = townEpilogue;
townEpilogue = function(l,e){if(l.world!=='hearthmere')return epilogueBeforeHearth(l,e);return [
 ['','At Reedlight, '+(has(l,'weeds')?'Vesper cuts the bindweed back a little each day; the beans feed the village.':has(l,'door')?'the step you cleared stays open; a broom leans beside the door.':'a lantern remains in the side window, where anyone on the shore can see it.')],
 ...(has(l,'odd')?[['','The neighbors slowly learn to leave a cup for the chimney spirit. Vesper makes the first introduction.']]:[]),
 ...(has(l,'puddle')?[['','Puddle keeps the cup you left. Once a year it fills it with the first thaw water.']]:[])
];};
/* Memories cross worlds as knowledge, never a statistic bonus. Keep the original Asterhold options intact. */
NODES.a_return_market.choices.splice(4,0,{
 t:'Make winter broth for the well queue',need:l=>!!l.mem.broth,
 why:'You have not brought a winter-broth recipe from another life.',go:'a_last_market',
 fx:l=>{townShift(l,1,-2);l.flags.hearthBroth=true;}
});
const marketBeforeHearth = NODES.a_return_market.lines;
NODES.a_return_market.lines = l => [...marketBeforeHearth(l),...(l.mem.thaw?[
 ['','You listen, as Puddle taught you. Water still moves beneath the well\'s cold rim.'],['bren','That lower bucket works. Good ear. I thought we would have to break the ice.']
]:[])];
const lastMarketBeforeHearth = NODES.a_last_market.lines;
NODES.a_last_market.lines=l=>[...lastMarketBeforeHearth(l),...(has(l,'hearthBroth')?[
 ['ressa','That broth stretches the grain. Show me how you made it when we have another morning.']
]:[])];
/* Reedlight: warm windows, changing pantry and snow, all drawn inside the world. */
function drawHearthmere(t,place){
 const v=hearthView(S.life),s=Math.max(2,Math.floor(Math.min(W/160,H/110))),gy=H*.48;
 const dark=night||v.snow===2;
 AMB.sky(cx,W,H,t,{top:dark?'#394f61':'#a1c8bf',bottom:dark?'#b6c9c4':'#e4e6be',h:gy,clouds:{n:4},sun:!dark,sunX:W*.12,sunY:H*.18});
 AMB.far(cx,W,H,t,{layers:[{kind:'peaks',col:'#788f83',base:.42,h:.22,seed:12},{kind:'pines',col:'#536f61',base:.47,h:.13,seed:3}],px:s});
 R(0,gy,W,H-gy,v.snow?'#cad7cd':'#6f997a');
 R(0,gy-s*4,W,s*9,v.snow===2?'#adc5ce':'#799fa9');
 for(let i=0;i<10;i++){const x=(i*97+(!reduce?t*8:0))%W;R(x,gy-s*3+(i%3)*s,W*.055,s,v.snow===2?'#d2e3df':'#a7c8c5');}
 if(place==='kitchen'){
  R(0,H*.08,W,H*.49,'#44584a');for(let x=0;x<W;x+=s*14)R(x,H*.08,s,H*.49,'#354638');
  R(W*.08,H*.16,s*28,s*17,'#a5c4c3');R(W*.08+s*13,H*.16,s*2,s*17,'#72836c');
  R(W*.57,H*.18,s*30,s*26,'#657161');R(W*.57-s,H*.18-s*2,s*32,s*3,'#7c8671');
  for(let i=0;i<3;i++)R(W*.57+s*3,H*.18+s*(5+i*8),s*25,s,'#465043');
  for(let i=0;i<v.bowls;i++){R(W*.57+s*(4+i*8),H*.18+s*7,s*5,s*5,'#bfaa78');R(W*.57+s*(5+i*8),H*.18+s*6,s*3,s,'#ede0ad');}
  R(W*.1,H*.47,s*35,s*5,'#a38057');R(W*.1+s*2,H*.47+s*5,s*3,s*12,'#72573e');R(W*.1+s*29,H*.47+s*5,s*3,s*12,'#72573e');
  R(W*.1+s*9,H*.47-s*8,s*12,s*8,'#657372');R(W*.1+s*10,H*.47-s*9,s*10,s*2,'#dfcb8e');
  if(v.fire)AMB.smoke(cx,W*.1+s*15,H*.47-s*11,s*.5,t,{id:'broth',col:'#f0e8cf',size:.45});
 }else if(place==='inn'){
  const x=W*.18,y=gy-s*29;
  R(x+s*2,gy+s*3,s*64,s*3,'rgba(25,45,35,.22)');
  R(x,y,s*60,s*32,'#ceca9e');R(x-s*3,y-s*7,s*66,s*9,'#6e6d59');
  for(let i=0;i<6;i++)R(x-s*2,y-s*7+i*s,s*64,s,'#555a4d');
  for(let i=0;i<3;i++){const wx=x+s*(6+i*20);R(wx,y+s*8,s*8,s*9,v.fire?'#f4cc77':'#73969a');R(wx+s*3,y+s*8,s,s*9,'#788068');}
  R(x+s*27,y+s*14,s*9,s*18,v.open?'#303e32':'#6e7359');
  if(!v.open)R(x+s*24,y+s*23,s*15,s*2,'#9f9571');
  R(x+s*18,y+s*2,s*25,s*4,'#c9b07c');
  R(x+s*53,y-s*15,s*6,s*10,'#818c78');if(v.fire)AMB.smoke(cx,x+s*56,y-s*16,s*.6,t,{id:'inn',size:.65});
  R(x+s*26,gy+s*3,s*11,s*12,'#b6ad8a');
  if(v.weeds)for(let i=0;i<9;i++){R(x+s*(20+i*2),gy+s*(2-i%3),s*2,s*(6+i%4),'#466943');R(x+s*(19+i*2),gy-s*(i%4),s*4,s*2,'#7e9a4f');}
  for(let i=0;i<v.guests;i++)hearthPerson(W*.58+i*s*10,gy+s*9,s,t,i);
 }else if(place==='well'){
  const x=W*.48,y=gy+s*4;
  R(x-s*18,y+s*14,s*37,s*3,'rgba(25,45,35,.24)');R(x-s*14,y,s*28,s*14,'#87918a');R(x-s*12,y+s,s*24,s*4,'#335563');
  R(x-s*19,y-s*24,s*3,s*28,'#708169');R(x+s*16,y-s*24,s*3,s*28,'#708169');R(x-s*22,y-s*26,s*44,s*4,'#868d6b');
  R(x+s*6,y-s*22,s,s*22,'#b6b78e');R(x+s*3,y-s*4,s*7,s*6,'#9c997c');
  R(x-s*9,y+s*6,s*4,s*3,'#e8d9af');
 }else{
  R(0,gy-s*3,W,H*.26,v.snow?'#a5c6ce':'#749aa3');
  const x=W*.5,y=gy+s*9;R(x-s*19,y,s*38,s*4,'#567f85');R(x-s*14,y-s,s*28,s*5,'#789d9c');
  if(!reduce)for(let i=0;i<3;i++){R(x-s*(8+i*7),y-s*(5+i*4)-Math.sin(t+i)*s,s*(16+i*14),s,'rgba(224,239,210,.5)');}
  R(W*.2,gy+s*22,s*36,s*4,'#778d79');
 }
 if(v.puddle){const x=W*(place==='well'?.43:.69),y=gy+s*7,b=reduce?0:Math.sin(t*1.3)*s*.4;
  R(x-s*5,y+s*7,s*12,s*2,'rgba(25,45,35,.18)');R(x-s*3,y+b,s*8,s*7,'#81bfc0');R(x-s*2,y-s*2+b,s*6,s*2,'#adddda');R(x-s,y+s*2+b,s,s,'#2b525b');R(x+s*3,y+s*2+b,s,s,'#2b525b');}
 hearthPerson(W*.13,gy+s*12,s,t,3);
 if(v.snow)AMB.weather(cx,W,H,t,{snow:v.snow*.25,ground:H,px:s});
 AMB.lights(cx,W,H,t,{dark:dark?.48:.12,max:.4,lights:[{x:W*.4,y:gy-s*9,r:H*.32,col:'#ffcf87',flick:reduce?0:.4}]});
}
function hearthPerson(x,y,s,t,i){const b=reduce?0:Math.sin(t*1.5+i)*s*.15;R(x-s*3,y+s*10,s*9,s*2,'rgba(25,45,35,.2)');R(x-s,y-s*5+b,s*4,s*4,'#dfb590');R(x-s*2,y-s*7+b,s*6,s*3,i===3?S.look.hair:'#b9bbaa');R(x-s*2,y-s+b,s*6,s*7,i===3?'#796d8c':'#64876a');R(x-s,y+s*6,s,s*4,'#4a4e3d');R(x+s*2,y+s*6,s,s*4,'#4a4e3d');}
SCENES.h_inn=t=>drawHearthmere(t,'inn');
SCENES.h_kitchen=t=>drawHearthmere(t,'kitchen');
SCENES.h_well=t=>drawHearthmere(t,'well');
SCENES.h_lake=t=>drawHearthmere(t,'lake');
