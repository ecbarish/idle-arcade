'use strict';
/* A bounded first professional month: six daily games, then two six-game series on a 24-day renewal.
   All dates move by player choices, not elapsed time. First-payday payment IDs stay unchanged. */
function contractOffer(c) { return c && (c.generation === 2 ? ROAD_OFFERS : c.generation === 1 ? DC.renewals : DC.offers)[c.offer]; }
function termEnd(c) { return c.start + (c.generation === 2 ? 30 : c.generation === 1 ? 24 : 6); }
function salaryId(c,i) { return c.generation ? 'contract-'+c.generation+'-salary-' + i : 'salary-' + i; }
function contractDue(s) { return !!(s.contract && s.day >= termEnd(s.contract)); }
function careerPhase(s) {
  if (s.road) { if(s.day>=s.road.end)s.road.closed=true; return s.road.closed?'month':'home'; }
  if (!s.contract) return s.played >= 6 ? 'offers' : 'clubhouse';
  if (s.month && s.day >= s.month.end) { s.month.closed = true; return 'month'; }
  return contractDue(s) && s.contract.generation !== 1 ? 'offers' : 'home';
}
function beginSeries(s) {
  if(s.road)return nextRoadSeries(s);
  if (s.phase !== 'home' || !s.contract || contractDue(s) || s.played !== 6) return false;
  s.played=0; s.series++; s.season=lineStats(); s.prepared=false; return true;
}
function finishMonth(s) {
  if(s.road){ if(s.phase!=='home'||!contractDue(s))return false; s.road.closed=true; s.phase='month'; return true; }
  if (s.phase !== 'home' || !s.month || !s.contract || s.contract.generation !== 1 || !contractDue(s)) return false;
  advanceDays(s, Math.max(0,s.month.end-s.day)); s.phase=careerPhase(s); return true;
}
function calendarStatus(s) {
  if (!s.contract) return null;
  const c=s.contract,o=contractOffer(c),due=o.days.map((offset,i)=>({id:salaryId(c,i),day:c.start+offset,amount:o.wage}));
  const paid=due.filter(e=>s.ledger.some(l=>l.id===e.id)),next=due.find(e=>!s.ledger.some(l=>l.id===e.id));
  return {total:o.bonus+o.wage*o.days.length,paid:paid.length,next,due,end:termEnd(c)};
}
function rememberDecision(s,kind,text) {
  if (s.notes.some(n=>n.kind===kind&&n.day===s.day)) return;
  s.notes.push({day:s.day,kind,text}); if(s.notes.length>6)s.notes.shift();
}
function coachGame(s,a) {
  const n=a.g.hero;
  if (n.walks) return 'Iona: “'+n.walks+' walk'+(n.walks===1?'':'s')+' today. You found a way aboard even when a hit was not there.”';
  if (n.hits) return 'Iona: “'+n.hits+' hit'+(n.hits===1?'':'s')+'. Keep the swing that got you here; a quiet game will not erase it.”';
  return 'Iona: “No hits today. That is one game, not a verdict. You can rest tired legs or choose one training focus before the next.”';
}
function normalizeCalendar(s,raw) {
  if(!s.contract)return;
  s.contract.generation=[1,2].includes(s.contract.generation)?s.contract.generation:0;
  if(!s.month){ // Original prototype saves begin their month now; earned wealth and all history stay intact.
    const start=s.day;
    s.month={start,end:start+30,games:0,wins:0,record:lineStats(),closed:false};
  }
  if(!['pitch','result','summary'].includes(s.phase))s.phase=careerPhase(s);
}
