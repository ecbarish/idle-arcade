'use strict';
/* WD3: additions to the shared move catalogue. Existing IDs and learning levels stay intact.
   Effects are battle-local, never stored on a creature. The Godot exporter reads the same tables. */
Object.assign(MOVES, {
  packHunt:{name:'Pack Hunt',kind:'hit',pow:45,cd:6,status:'marked',duration:6},
  shedSkin:{name:'Shed Skin',kind:'guard',cd:12,duration:3,cleanse:true},
  rootCharge:{name:'Root Charge',kind:'hit',pow:65,cd:7,breakGuard:true},
  skyDive:{name:'Sky Dive',el:'Gale',kind:'hit',pow:65,cd:7,pierce:true},
  stonePounce:{name:'Stone Pounce',kind:'hit',pow:55,cd:6,combo:'rooted',bonus:1.5},
  silkLull:{name:'Silk Lull',el:'Shade',kind:'hit',pow:30,spec:1,cd:12,status:'sleep',duration:3},
  laughFeint:{name:'Laughing Feint',kind:'hit',pow:45,cd:7,status:'marked',duration:6},
  deepDrag:{name:'Deep Drag',el:'Tide',kind:'hit',pow:55,cd:6,status:'soaked',duration:5},
  brightCare:{name:'Bright Care',kind:'heal',cd:12,heal:.3,cleanse:true},
  herdRush:{name:'Herd Rush',kind:'haste',cd:14,duration:7},
  coalFlick:{name:'Coal Flick',el:'Ember',kind:'hit',pow:35,spec:1,cd:5,status:'scorched',duration:5},
  steamBurst:{name:'Steam Burst',el:'Ember',kind:'hit',pow:65,spec:1,cd:7,combo:'soaked',bonus:1.5},
  emberMantle:{name:'Ember Mantle',kind:'guard',cd:14,duration:6},
  rainTap:{name:'Rain Tap',el:'Tide',kind:'hit',pow:35,spec:1,cd:5,status:'soaked',duration:5},
  undertowPull:{name:'Undertow Pull',el:'Tide',kind:'hit',pow:55,spec:1,cd:6,combo:'rooted',bonus:1.4},
  rinse:{name:'Rinse',kind:'heal',cd:10,heal:.2,cleanse:true},
  seedGrip:{name:'Seed Grip',el:'Grove',kind:'hit',pow:30,cd:6,status:'rooted',duration:5},
  bramblePress:{name:'Bramble Press',el:'Grove',kind:'hit',pow:65,cd:7,combo:'rooted',bonus:1.4},
  groveShelter:{name:'Grove Shelter',kind:'guard',cd:12,duration:4,cleanse:true},
  faultLine:{name:'Fault Line',el:'Stone',kind:'hit',pow:70,cd:8,breakGuard:true},
  gravelFan:{name:'Gravel Fan',el:'Stone',kind:'aoe',pow:40,cd:8},
  standingStone:{name:'Standing Stone',kind:'guard',cd:14,duration:6},
  airCut:{name:'Air Cut',el:'Gale',kind:'hit',pow:50,spec:1,cd:5,pierce:true},
  crosswind:{name:'Crosswind',kind:'slow',cd:10,duration:5},
  windLift:{name:'Wind Lift',kind:'haste',cd:14,duration:6},
  duskLull:{name:'Dusk Lull',el:'Shade',kind:'hit',pow:25,spec:1,cd:12,status:'sleep',duration:2.4},
  shadeThread:{name:'Shade Thread',el:'Shade',kind:'hit',pow:40,spec:1,cd:8,status:'marked',duration:5},
  dreamBreak:{name:'Dream Break',el:'Shade',kind:'hit',pow:65,spec:1,cd:8,combo:'sleep',bonus:1.5},
  clearLight:{name:'Clear Light',kind:'heal',cd:12,heal:.25,cleanse:true},
  dawnRay:{name:'Dawn Ray',el:'Radiant',kind:'hit',pow:65,spec:1,cd:7,pierce:true},
  gleamTrail:{name:'Gleam Trail',el:'Radiant',kind:'hit',pow:35,spec:1,cd:6,status:'marked',duration:5},
  steadyStrike:{name:'Steady Strike',kind:'hit',pow:45,cd:0},
  helpingPaw:{name:'Helping Paw',kind:'heal',cd:10,heal:.2},
  guardBreak:{name:'Guard Break',kind:'hit',pow:55,cd:6,breakGuard:true},
  feintStep:{name:'Feint Step',kind:'hit',pow:35,cd:6,status:'marked',duration:4},
  soothingTouch:{name:'Soothing Touch',kind:'heal',cd:10,heal:.15,cleanse:true},
  secondWind:{name:'Second Wind',kind:'haste',cd:12,duration:4},
  sweepHit:{name:'Sweep',kind:'aoe',pow:35,cd:7}
});
const FAMILY_SIGNATURE={wolf:'packHunt',lizard:'shedSkin',boar:'rootCharge',bird:'skyDive',cat:'stonePounce',spider:'silkLull',hyena:'laughFeint',croc:'deepDrag',sprite:'brightCare',horse:'herdRush'};
const ELEMENT_LESSONS={Ember:['coalFlick','steamBurst','emberMantle'],Tide:['rainTap','undertowPull','rinse'],Grove:['seedGrip','bramblePress','groveShelter'],Stone:['faultLine','gravelFan','standingStone'],Gale:['airCut','crosswind','windLift'],Shade:['duskLull','shadeThread','dreamBreak'],Radiant:['gleamTrail','dawnRay','clearLight']};
const BATTLE_LESSONS={family:FAMILY_SIGNATURE,element:ELEMENT_LESSONS};
const PRACTICE_MOVES=["steadyStrike","helpingPaw","guardBreak","feintStep","soothingTouch","secondWind","sweepHit"];
let practiceIndex=0;
for(const s of Object.values(SPECIES)){
  s.legacyLearn=s.learn.map(l=>l.slice());
  const extra=[[8,FAMILY_SIGNATURE[s.fam]],[15,ELEMENT_LESSONS[s.el][0]],[22,ELEMENT_LESSONS[s.el][1]],[30,ELEMENT_LESSONS[s.el][2]]];
  const room=8-new Set(s.legacyLearn.map(l=>l[1])).size;
  const added=extra.slice(0,room);
  if(practiceIndex<PRACTICE_MOVES.length && room>=3){s.practiceMove=PRACTICE_MOVES[practiceIndex++];added[added.length-1]=[30,s.practiceMove];}
  s.learn=s.learn.concat(added).sort((a,b)=>a[0]-b[0]);
}

function defaultMoves(c){const known=learnedMoves(c),chosen=known.slice(-4);if(!chosen.some(m=>['hit','aoe','dot'].includes(MOVES[m].kind))){const attacks=known.filter(m=>['hit','aoe','dot'].includes(MOVES[m].kind));if(attacks.length)chosen[0]=attacks.at(-1);}return chosen;}
function learnedMoves(c){return [...new Set(sp(c).learn.filter(l=>l[0]<=c.lvl).map(l=>l[1]))];}
function keptMoves(c){
  const known=learnedMoves(c),chosen=Array.isArray(c.moves)?[...new Set(c.moves.filter(m=>known.includes(m)))].slice(0,4):[];
  const kept=chosen.length?chosen:[...new Set((sp(c).legacyLearn||sp(c).learn).filter(l=>l[0]<=c.lvl).map(l=>l[1]))].slice(-4);
  if(!kept.some(m=>['hit','aoe','dot'].includes(MOVES[m].kind))){const attacks=known.filter(m=>['hit','aoe','dot'].includes(MOVES[m].kind));if(attacks.length){if(kept.length<4)kept.push(attacks.at(-1));else kept[0]=attacks.at(-1);}}
  return kept;
}
function keepMoves(c,list){const known=learnedMoves(c);if(!Array.isArray(list)||!list.length||list.length>4||new Set(list).size!==list.length||list.some(m=>!known.includes(m))||!list.some(m=>['hit','aoe','dot'].includes(MOVES[m].kind)))return false;c.moves=list.slice();return true;}
const BattleEffects={
 bad:['soaked','scorched','rooted','sleep','marked'],label:{soaked:'Soaked',scorched:'Scorched',rooted:'Rooted',sleep:'Asleep',marked:'Exposed'},
 active:(u,id)=>!!(u.status&&u.status[id]>0),
 apply(u,id,seconds){if(u.c.hp<=0||!this.bad.includes(id))return false;u.status=u.status||{};if(id==='sleep'&&(this.active(u,id)||u.wakeGrace>0))return false;u.status[id]=Math.max(u.status[id]||0,seconds);if(id==='scorched')u.burnTick=1;return true;},
 wake(u){if(this.active(u,'sleep')){delete u.status.sleep;u.wakeGrace=5;}},
 cleanse(u){this.wake(u);u.status={};u.dots=[];u.buff.slow=0;},
 tick(u,h){let d=0;u.wakeGrace=Math.max(0,(u.wakeGrace||0)-h);if(this.active(u,'scorched')){u.burnTick=(u.burnTick??1)-h;if(u.burnTick<=0){u.burnTick+=1;d=Math.max(1,Math.round(u.st.hp*.02));}}for(const id of Object.keys(u.status||{})){u.status[id]-=h;if(u.status[id]<=0){delete u.status[id];if(id==='sleep')u.wakeGrace=5;}}return d;},
 modifier(a,t,m){return(this.active(a,'scorched')&&!m.spec?.75:1)*(this.active(t,'marked')?1.25:1)*(m.combo&&this.active(t,m.combo)?m.bonus||1.4:1);},
 after(t,m){this.wake(t);if(t.status){delete t.status.marked;if(m.combo)delete t.status[m.combo];}if(m.breakGuard){t.buff.guard=0;t.buff.guardCmd=0;}if(m.status)this.apply(t,m.status,m.duration||5);}
};

// Classic uses the same remembered moves. Practice is available on ranch creature cards.
const beforePracticeCard = cardHTML;
cardHTML = function(c, i, inTeam) {
  const html = beforePracticeCard(c, i, inTeam);
  if (S.tab !== 'ranch') return html;
  const kept=movesOf(c),known=learnedMoves(c);
  return html + `<fieldset class="cmoves" data-practice="${c.uid}"><legend>Maren's workbench · bring up to four moves</legend>${[0,1,2,3].map(slot=>`<label>Place ${slot+1} <select data-wdmove="${slot}" ${B||challengeLocked()?'disabled':''}><option value="">Rest this place</option>${known.map(m=>`<option value="${m}" ${kept[slot]===m?'selected':''}>${MOVES[m].name}</option>`).join('')}</select></label>`).join('')}<p class="meta">Keep one attack. Every learned move stays remembered.</p></fieldset>`;
};
document.addEventListener('change', e => {
  const field=e.target.closest('[data-practice]');
  if(!field || !e.target.hasAttribute('data-wdmove')) return;
  const c=everyone().find(c=>String(c.uid)===field.dataset.practice);
  if(!c || B || challengeLocked()) return;
  const moves=[...field.querySelectorAll('[data-wdmove]')].map(el=>el.value).filter(Boolean);
  if(!keepMoves(c,moves)) toast('Choose different moves and keep at least one attack.');
  else {save();toast('Ready for the next battle.');}
  tabKey='';renderAll();
});
