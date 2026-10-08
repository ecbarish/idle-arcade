'use strict';
// A small field overlay, reusable when the rest of the career moves into the world.
function renderBattingWindow() {
  const host=document.querySelector('#batting-window'),stage=document.querySelector('#stage');
  stage.classList.toggle('batting-play',['pitch','result'].includes(S.phase));
  const timing=S.phase==='pitch'&&S.mode==='timing';
  host.hidden=!(timing||S.phase==='result');
  if(host.hidden){host.replaceChildren();return;}
  if(S.phase==='result'){
    host.innerHTML='<p class="field-result" role="status">'+esc(S.active.last.text)+'</p>'+btn('continue',S.active.last.ended?'Watch the game move on':'Next pitch',true);
    return;
  }
  const p=S.active.pitch;
  // Loaded old pitches keep the original cue model; never reroll an existing hint.
  const chance=Number.isFinite(p.cueChance)&&p.cueChance>=0&&p.cueChance<=1?p.cueChance:cueAccuracy({discipline:50});
  host.innerHTML='<fieldset><legend>Your swing</legend><div class="field-choices">'+['contact','power'].map(x=>'<button data-stance="'+x+'" aria-pressed="'+(timingStance(S)===x)+'" class="'+(timingStance(S)===x?'selected':'')+'" '+(pitchClock.running?'disabled':'')+'>'+x[0].toUpperCase()+x.slice(1)+'</button>').join('')+'</div></fieldset>'+
    '<p class="field-cue">'+esc(DC.pitches[p.hint].cue)+' · cue matches about '+(chance*100).toFixed(1)+'% of the time.</p>'+
    '<p class="field-help">'+(timingStance(S)==='power'?'Power: fewer contacts, more extra-base chances.':'Contact: more chances to get aboard.')+' '+(pitchClock.running?'Swing when the gold bar reaches the plate.':'Choose, then ready the pitch.')+'</p>'+
    '<div class="field-choices">'+btn('ready','Ready pitch',true,pitchClock.running)+btn('swing','Swing',true,!pitchClock.running)+btn('take','Let it go',false,!pitchClock.running)+'</div>';
}
document.querySelector('#batting-window').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.stance)chooseStance(b.dataset.stance);
  else if(b.dataset.act)actCareer(b.dataset.act);
});
