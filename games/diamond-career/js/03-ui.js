'use strict';
let S, D, sceneState=null, SOUND, pitchClock={elapsed:0,running:false}, contactAt=0;
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn = (act,label,primary=false,disabled=false) => `<button data-act="${act}" ${disabled?'disabled':''} class="${primary?'primary':''}">${label}</button>`;
function saveCareer() {
  if(!S.player)return;
  document.querySelector('#save-warning').hidden=Arcade.save(DC.key,S);
  Arcade.report('baseball',{summary:`${S.player.name} · ${S.contract?S.contract.tier:DC.club}`,detail:`Day ${S.day} · ${S.record.hits} hits · ${money(S.cash)} · ${S.owned.car?'Own car':S.owned.apartment?'Own apartment':'First season'}`});
}
function resetClock() { pitchClock={elapsed:0,running:false}; }
function renderCareer() {
  const el=document.querySelector('#content'),g=S.active&&S.active.g;
  document.querySelector('#place').textContent=S.phase==='home'?'BRACKENPORT · YOUR CORNER OF THE WORLD':['clubhouse','offers'].includes(S.phase)?'THE LANTERNS CLUBHOUSE':'LAMPLIGHT FIELD · BRACKENPORT';
  document.querySelector('#scoreboard').innerHTML=g?`<div class="score-teams"><span>${esc(S.active.opponent.split(' ').slice(-1)[0])} <b>${g.score[0]}</b></span><span>${esc((S.contract?DC.offers[S.contract.offer].name:DC.club).split(' ').slice(-1)[0])} <b>${g.score[1]}</b></span></div><div>${g.finished?'FINAL':(g.half?'Bottom':'Top')+' '+g.inning} · ${g.outs} out${g.outs===1?'':'s'}</div><div class="score-count"><span>${g.count.balls} balls · ${g.count.strikes} strikes</span><span aria-label="Bases, first through third">${g.bases.map((b,i)=>`<i class="base ${b?'on':''}" title="${i+1}: ${b?'occupied':'empty'}"></i>`).join('')}</span></div>`:`<div class="eyebrow">The first call-up</div><b>${esc(DC.club)}</b><div>Six games · your first chance</div>`;
  document.querySelector('#timing-bar').hidden=S.phase!=='pitch'||S.mode!=='timing';
  if(S.phase==='creator') {
    el.innerHTML=`<div class="eyebrow">An original baseball career</div><h1>The lights are on.<br>Your name is next.</h1><p>Six games at Lamplight Field. Earn your first call-up, choose a contract, and bring your first payday home.</p><form id="creator"><label for="player-name">Your name</label><input id="player-name" name="name" maxlength="24" value="Rookie" autocomplete="off" required><label for="bats">Batting hand</label><select id="bats" name="bats"><option value="right">Right-handed</option><option value="left">Left-handed</option></select><label for="look">Your look</label><select id="look" name="look">${DC.looks.map((l,i)=>`<option value="${i}">${l.name}</option>`).join('')}</select><p class="muted">A batter, just starting out. Change batting style anytime in Settings.</p><button class="primary" type="submit">Meet the coach</button></form>`;
    return;
  }
  const header=`<div class="eyebrow">Day ${S.day} · ${S.contract?esc(DC.offers[S.contract.offer].role):'Development series'}</div><h1>${esc(S.player.name)}</h1>`;
  const stats=`<div class="stats"><span>Contact ${S.stats.contact}</span><span>Power ${S.stats.power}</span><span>Eye ${S.stats.discipline}</span><span>Fatigue ${S.fatigue}</span></div>`;
  if(S.phase==='pitch') {
    const p=S.active.pitch;
    el.innerHTML=`${header}<h2>Step into the box.</h2><p class="pitch-read">${esc(S.active.pitcher.name)} favors the ${S.active.pitcher.favorite}. This release shows ${DC.pitches[p.hint].cue}. A clue, not a promise.</p><div class="stats"><span>Game ${S.played+1}/6</span><span>${S.mode==='timing'?'Timing':'Tactical'} batting</span><span>${g.manual+1} of up to ${S.contract?DC.offers[S.contract.offer].moments:2} key at-bats</span></div>`+
      (S.mode==='timing'?`<p>Ready the pitch. Swing when the ball reaches the plate and the gold bar fills. Space or Enter swings; a tap works too. You can let a pitch go.</p><div class="actions">${btn('ready','Ready pitch',true)}${btn('swing','Swing',true,true)}${btn('take','Let it go',false,true)}</div>`:
      `<fieldset><legend>Your approach</legend><div class="actions">${['patience','contact','power'].map(x=>`<button class="${S.stance===x?'selected':''}" data-stance="${x}" aria-pressed="${S.stance===x}">${x[0].toUpperCase()+x.slice(1)}</button>`).join('')}</div></fieldset><label for="guess">Read the pitch</label><select id="guess">${Object.keys(DC.pitches).map(x=>`<option ${S.guess===x?'selected':''}>${x}</option>`).join('')}</select><p class="muted">Patience judges the zone using your eye. Contact favors getting aboard; power trades contact for extra bases.</p><div class="actions">${btn('tactical','Commit to your read',true)}${btn('take','Let it go')}</div>`)+`<details><summary>How baseball works here</summary><p>Four balls earn a walk. Three strikes make an out. A foul cannot be strike three. Three outs switch sides. Runs count when runners reach home. Nine innings, with extras for a tie.</p><p>You play key at-bats. Teammates, opponents and your other turns use the same pitch model. This first slice has no steals, errors or double plays; runners hold on clean outs.</p></details>`;
  } else if(S.phase==='result') {
    el.innerHTML=`${header}<div class="eyebrow">${S.active.last.ended?'At-bat complete':'Same at-bat'}</div><h2 class="result" role="status">${esc(S.active.last.text)}</h2><p>${S.active.last.runs?S.active.last.runs+' run'+(S.active.last.runs===1?'':'s')+' scored.':'The scoreboard is up to date.'}</p><p class="muted">${S.active.last.ended?'The rest of the field plays on. Your next moment waits for you.':'The count stays with you. Take a breath before the next pitch.'}</p>${btn('continue',S.active.last.ended?'Watch the game move on':'Next pitch',true)}`;
  } else if(S.phase==='summary') {
    const h=g.hero;
    el.innerHTML=`${header}<h2>${g.score[1]>g.score[0]?'The clubhouse is buzzing.':'Tomorrow is another game.'}</h2><p>${esc(S.active.opponent)} ${g.score[0]} · ${esc(S.contract?DC.offers[S.contract.offer].name:DC.club)} ${g.score[1]}. ${g.inning} innings.</p><div class="card"><h3>Your full game</h3><p>${h.hits} for ${h.ab} · ${h.walks} walk${h.walks===1?'':'s'} · ${h.rbi} RBI · ${h.hr} home runs.</p><p class="muted">You played ${g.manual} key at-bat${g.manual===1?'':'s'}. Other turns and both teams simulated pitch by pitch.</p></div><p>${evaluation(S).text}</p>${btn('after','Back to the clubhouse',true)}`;
  } else if(S.phase==='offers') {
    const e=evaluation(S);
    el.innerHTML=`${header}<h2>${e.earned?'Your first call-up.':'A place to keep growing.'}</h2><p class="quote">Iona: “${e.earned?'You earned this. Now decide what matters more: a bigger cheque, or your name on the lineup every day.':'Not quite the senior target yet. Both clubs offer paid development places. You can earn the call-up in your next series.'}”</p><p>${e.text}</p>${Object.entries(DC.offers).map(([id,o])=>`<article class="card offer"><h3>${o.name}</h3><b>${o.role}</b><p>${money(o.bonus)} signing bonus + ${money(o.wage)} on days +2, +4, +6.</p><p>${o.moments} playable key at-bat${o.moments===1?'':'s'} per game in your next series. All your remaining turns simulate.</p>${btn('sign-'+id,'Choose '+o.role,true)}</article>`).join('')}`;
  } else {
    const o=S.contract&&DC.offers[S.contract.offer];
    el.innerHTML=`${header}<h2>${S.contract?'A life beyond the line.':'The coach leaves a light on.'}</h2><p class="quote">${esc(S.message)}</p>${stats}<p class="muted">${evaluation(S).text} Training helps your odds; nothing guarantees a hit.</p>`+
      (S.played<6?`${!S.prepared?`<h3>One preparation before the game</h3><div class="actions">${btn('train-contact','Contact +2')}${btn('train-power','Power +2')}${btn('train-discipline','Eye +2')}${btn('rest','Rest')}</div>`:'<p>Preparation done. Time for the field.</p>'}${btn('match','Play game '+(S.played+1)+' of 6',true)}`:S.contract?`${btn('new-series','Begin another six-game series',true)}`:'')+
      (o?`<h3>${money(S.cash)} to make your own</h3><p>${esc(o.name)} · ${esc(S.contract.tier)} · ${o.moments} key at-bats per game.</p><div class="actions">${btn('day','Spend a quiet day at home')}</div><p class="muted">Salary: ${money(o.wage)} on calendar days ${o.days.map(d=>S.contract.start+d).join(', ')}. Three payments in this contract; no daily upkeep.</p>${Object.entries(DC.purchases).map(([id,p])=>`<article class="card offer"><h3>${p.name}</h3><p>${id==='apartment'?'A warm room, a sofa and your own shirt on the wall.':'Your own car in the garage. A permanent milestone, with no running costs.'}</p>${btn('buy-'+id,S.owned[id]?'Yours, permanently':'Buy · '+money(p.price),false,S.owned[id]||S.cash<p.price)}</article>`).join('')}<details><summary>Your salary ledger · ${S.ledger.length} entries</summary><table class="ledger"><tbody>${S.ledger.map(e=>`<tr><td>Day ${e.day}<br>${esc(e.label)}</td><td>${e.amount<0?'−':'+'}${money(Math.abs(e.amount))}</td></tr>`).join('')}</tbody></table></details>`:'')+
      `<details><summary>Your notebook</summary><p>Contact helps you put the ball in play. Power improves extra-base chances. Eye helps judge the zone when you choose Patience. Fatigue reduces contact; rest clears it.</p><p>On-base means hits plus walks divided by plate appearances. Career: ${S.record.hits} hits in ${S.record.ab} at-bats, ${S.record.walks} walks, average ${rate(average(S.record))}.</p>${S.history.slice(-6).map(h=>`<p class="muted">Day ${h.day} · ${esc(h.opponent)} ${h.score[0]}–${h.score[1]} · ${h.hero.hits}/${h.hero.ab}</p>`).join('')}</details>`;
  }
  SOUND&&SOUND.render();
}
function actCareer(act) {
  if(sceneState)return;
  let changed=false;
  if(act==='ready'&&S.phase==='pitch'&&!pitchClock.running){pitchClock.running=true;pitchClock.elapsed=0;document.querySelector('[data-act="ready"]').disabled=true;document.querySelector('[data-act="swing"]').disabled=false;document.querySelector('[data-act="take"]').disabled=false;return;}
  if(['swing','tactical','take'].includes(act)) {
    if(S.phase!=='pitch'||(S.mode==='timing'&&!pitchClock.running))return;
    let take=act==='take';
    if(act==='tactical'&&S.stance==='patience') { const p=S.active.pitch;take=random(S.active.g)<clamp(.58+(S.stats.discipline-50)*.006,.4,.85)?!p.inZone:random(S.active.g)<.3; }
    changed=!!playPitch(S,{take,mode:S.mode,timing:pitchClock.elapsed/S.active.pitch.duration,stance:S.stance,guess:S.guess});
    if(changed){contactAt=performance.now();SOUND.sfx(typeof S.active.last.play==='number'?'hit':S.active.last.play==='ball'?'select':'miss');}
  } else if(act==='continue')changed=continueMatch(S);
  else if(act==='after')changed=afterMatch(S);
  else if(act==='match')changed=startMatch(S);
  else if(act==='rest')changed=training(S,'rest');
  else if(act.startsWith('train-'))changed=training(S,act.slice(6));
  else if(act.startsWith('sign-')){changed=signContract(S,act.slice(5));if(changed)SOUND.sfx('level');}
  else if(act.startsWith('buy-')){changed=purchase(S,act.slice(4));if(changed)SOUND.sfx('coin');}
  else if(act==='day'&&S.phase==='home'){advanceDays(S,1);S.message='A quiet day at home. Any salary due today is in your ledger.';changed=true;}
  else if(act==='new-series'&&S.contract&&S.played===6){S.played=0;S.series++;S.season=lineStats();S.prepared=false;changed=true;}
  if(changed){resetClock();saveCareer();renderCareer();}
}
