'use strict';
const VERSION='0.1.0'; // Initial prototype; no existing game's version changes.
Arcade.validators[DC.key]=validCareer;
S=migrateCareer(Arcade.load(DC.key));
D=Dialogue.create({host:document.querySelector('#stage'),theme:'diamond',get:()=>sceneState,set:v=>{sceneState=v;},cast:()=>({name:DC.coach,title:'Development coach',skin:'#bb7850',hair:'short',hairCol:'#353a38',shirt:'#3c7b72',bg:'#c8d4be'}),blip:()=>SOUND.sfx('blip',350),onEnd:()=>saveCareer()});
setupSound();
Settings.create({mount:'#tools',btnClass:'hbtn',rows:[{label:'Batting style',options:[['timing','Timing · swing on arrival'],['tactical','Tactical · read and choose']],get:()=>S.mode,set:v=>{S.mode=v;resetClock();saveCareer();renderCareer();},note:'Switch freely. Your count and the current pitch are preserved.'}]});
setupFeedback('Diamond Career',VERSION,()=>`Day ${S.day}, ${S.phase}, ${S.mode}, game ${S.played+1}, ${S.contract?.offer||'development'}`);
document.querySelector('#content').addEventListener('submit',e=>{
  if(e.target.id!=='creator')return;e.preventDefault();const form=new FormData(e.target);
  if(startCareer(S,form.get('name'),form.get('bats'),form.get('look'))){saveCareer();renderCareer();D.play([['','The last bus leaves Brackenport. The ballpark lights stay on.'],['iona','Six games. Five hits, or getting on base three times in ten chances. Those are our senior call-up targets.'],['iona','You can time your swing or read the pitcher. Settings lets you change. Take the space you need; I will be here.']],()=>{renderCareer();});}
});
document.querySelector('#content').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.stance){S.stance=b.dataset.stance;saveCareer();renderCareer();}
  else if(b.dataset.act)actCareer(b.dataset.act);
});
document.querySelector('#content').addEventListener('change',e=>{if(e.target.id==='guess'){S.guess=e.target.value;saveCareer();}});
document.querySelector('#save-tools').addEventListener('click',()=>{document.querySelector('#save-content').innerHTML=Arcade.saveToolsHTML(DC.key);document.querySelector('#save-dialog').showModal();});
document.querySelector('#close-save').addEventListener('click',()=>document.querySelector('#save-dialog').close());
document.addEventListener('keydown',e=>{
  if(e.repeat||sceneState||document.querySelector('#save-dialog').open||e.target.closest('input,select,textarea,button,a')||document.querySelector('.arc-set-bg:not([hidden])'))return;
  if(!['Space','Enter'].includes(e.code))return;e.preventDefault();
  if(S.phase==='result')actCareer('continue');
  else if(S.phase==='pitch')actCareer(S.mode==='tactical'?'tactical':pitchClock.running?'swing':'ready');
});
addEventListener('pagehide',()=>saveCareer());
document.addEventListener('visibilitychange',()=>{previousFrame=0;});
renderCareer();requestAnimationFrame(animateWorld);
if(location.hostname==='localhost')window.__dc={get S(){return S;},set S(v){S=v;resetClock();renderCareer();},DC,newGame,applyPlay,makePitch,resolvePitch,simulateToMoment,simulatedAction,batterOf,freshCareer,migrateCareer,validCareer,startCareer,startMatch,playPitch,continueMatch,afterMatch,training,signContract,advanceDays,purchase,evaluation,saveCareer,renderCareer,actCareer,random,lineStats,DC_TRACKS,contractOffer,termEnd,calendarStatus,beginSeries,finishMonth,careerPhase,get clock(){return pitchClock;},get D(){return D;}};
