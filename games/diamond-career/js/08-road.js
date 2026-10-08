'use strict';
/* T36: a bounded second month, paid by date. Travel choices are manual, once per series; no wall clock. */
const ROAD_TOWNS = [
  {id:'sablebay',name:'Sablebay',park:'Breakwater Park',club:'Sablebay Pilots',kind:'sea',person:'tamsin',
    first:'Tamsin Holt. I keep the lights at Breakwater Park. Mind the salt on the rail; everything here belongs to the sea eventually.',
    back:'You came back. I kept your name on the visitors\' locker. The sea has not claimed that yet.'},
  {id:'fircrest',name:'Fircrest',park:'Switchback Field',club:'Fircrest Ibex',kind:'mountain',person:'oren',
    first:'Oren Pike. Groundskeeper. The mountain does not care about your batting average, so neither will I until the first pitch.',
    back:'Good to see you again. Same mountain, same uneven step by the dugout. I did fix the step, once.'},
  {id:'brickmere',name:'Brickmere',park:'Foundry Square',club:'Brickmere Coppers',kind:'brick',person:'della',
    first:'Della Quill. My cafe faces left field. Hit one over my roof and I will give you directions to fetch it, not a free dinner.',
    back:'There is that familiar shirt. Your old seat is by the window, if you want to watch the park before it watches you.'}
];
const ROAD_OFFERS = Object.fromEntries(Object.entries(DC.renewals).map(([id,o])=>[id,{...o,bonus:0,days:[6,12,18,24,30]}]));
function currentPeriod(s) { return s.road || s.month; }
function validRoadFields(s) {
  if(s.visits!==undefined && (!s.visits||typeof s.visits!=='object'||Array.isArray(s.visits)||
    !Object.entries(s.visits).every(([id,n])=>ROAD_TOWNS.some(t=>t.id===id)&&Number.isInteger(n)&&n>=0)))return false;
  const r=s.road;if(r===undefined||r===null)return s.contract?.generation!==2;
  return !!r && Number.isInteger(r.start)&&r.start>=1&&r.end===r.start+30&&Number.isInteger(r.index)&&r.index>=0&&r.index<3&&
    Number.isInteger(r.games)&&r.games>=0&&r.games<=18&&Number.isInteger(r.wins)&&r.wins>=0&&r.wins<=r.games&&
    r.record&&Object.keys(lineStats()).every(k=>Number.isFinite(r.record[k])&&r.record[k]>=0)&&
    typeof r.closed==='boolean'&&typeof r.film==='boolean'&&Number.isInteger(r.standing)&&r.standing>=0&&r.standing<=3&&
    r.trips&&typeof r.trips==='object'&&!Array.isArray(r.trips)&&Object.entries(r.trips).every(([id,v])=>ROAD_TOWNS.some(t=>t.id===id)&&['rest','film','cards'].includes(v))&&
    s.contract?.generation===2&&s.contract.start===r.start;
}
function roadReady(s) { return !!s.road && !!s.road.trips[ROAD_TOWNS[s.road.index].id]; }
function beginRoadMonth(s) {
  if(s.phase!=='month'||!s.month?.closed||s.road||s.contract?.generation!==1||s.day<s.month.end)return false;
  const start=s.day,previous=copy(s.contract);
  s.contracts.push(previous);s.contract={...previous,start,generation:2};
  s.road={start,end:start+30,index:0,trips:{},games:0,wins:0,record:lineStats(),film:false,standing:0,closed:false};
  s.visits ||= {};s.series++;s.played=0;s.season=lineStats();s.prepared=false;s.phase='home';
  s.message='Iona: “Three parks, three places to learn. Same role, a new thirty-day term. No signing bonus this time; the salary dates are on your calendar.”';return true;
}
function nextRoadSeries(s) {
  if(s.phase!=='home'||!s.road||s.road.closed||s.active||s.played!==6||s.road.index>=2||s.day>=s.road.end)return false;
  s.road.index++;advanceDays(s,Math.max(0,s.road.start+s.road.index*10-s.day));
  if(s.day>=s.road.end){s.phase=careerPhase(s);return false;}
  s.played=0;s.series++;s.season=lineStats();s.prepared=false;s.road.film=false;return true;
}
function localGreeting(s,town=ROAD_TOWNS[s.road?.index||0]) { return (s.visits?.[town.id]||0)>0?town.back:town.first; }
function chooseBus(s,choice) {
  if(s.phase!=='home'||!s.road||s.road.closed||s.active||roadReady(s)||!['rest','film','cards'].includes(choice)||s.day>=s.road.end)return false;
  const town=ROAD_TOWNS[s.road.index];s.road.trips[town.id]=choice;
  if(choice==='rest')s.fatigue=Math.max(0,s.fatigue-12);
  if(choice==='film')s.road.film=true;
  if(choice==='cards')s.road.standing++;
  s.visits[town.id]=(s.visits[town.id]||0)+1;
  rememberDecision(s,'bus-'+town.id,{rest:'Rested on the bus to '+town.name+'.',film:'Studied the pitcher before arriving in '+town.name+'.',cards:'Joined the team card game on the way to '+town.name+'.'}[choice]);
  return true;
}
function careerCast(who) {
  const people={iona:{name:DC.coach,title:'Your coach',skin:'#bb7850',hair:'short',hairCol:'#353a38',shirt:'#3c7b72',bg:'#c8d4be'},
    tamsin:{name:'Tamsin Holt',title:'Breakwater Park keeper',skin:'#dba572',hair:'bun',hairCol:'#493834',shirt:'#63848e',bg:'#b9d5d7'},
    oren:{name:'Oren Pike',title:'Switchback groundskeeper',skin:'#81523c',hair:'short',hairCol:'#26232a',shirt:'#746b4a',bg:'#c0c8ae'},
    della:{name:'Della Quill',title:'Foundry Square cafe owner',skin:'#f1c1a3',hair:'bun',hairCol:'#ad583b',shirt:'#aa6651',bg:'#dbc5b6'}};
  return people[who]||people.iona;
}
function playBusTrip() {
  if(sceneState||S.phase!=='home'||!S.road||S.road.closed||roadReady(S))return;
  careerRoom='bus';careerSheet=null;renderCareer();
  const life=S,town=ROAD_TOWNS[S.road.index],index=S.road.index,greeting=localGreeting(S,town);
  D.play([['','The team bus climbs out of Brackenport. '+town.park+' waits in '+town.name+'.'],
    ['iona','A long ride. Rest your legs, study the pitcher, or find a seat at the card game. Nobody is betting wages.']],i=>{
    if(S!==life||S.road.index!==index||!chooseBus(S,['rest','film','cards'][i]))return;
    saveCareer();careerRoom='clubhouse';
    D.play([['', {rest:'You wake as the bus reaches the park. Your legs feel less heavy.',film:'The release repeats on the little screen. Your eye gets a small lift for this first game; a clue, not a promised hit.',cards:'Remi moves a bag off the empty seat. By the last hand, the jokes include you.'}[['rest','film','cards'][i]]],
      [town.person,greeting]],()=>renderCareer());renderCareer();
  },{choices:['Rest on the bus · ease fatigue','Study film · clearer reads for one game','Join the card game · know the team']});
}