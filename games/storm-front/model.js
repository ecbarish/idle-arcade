/* AC1: deterministic cabinet rules. No DOM, timers or storage. */
(function(root){'use strict';
 const W=640,H=640,SHIP_Y=582;
 function rng(seed){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
 function wave(number){return Array.from({length:32},(_,i)=>({id:i,x:70+(i%8)*64,y:100+Math.floor(i/8)*49+Math.min(5,number-1)*9,row:Math.floor(i/8),alive:true}));}
 function walls(){const out=[];for(const start of [80,220,360,500])for(let y=0;y<4;y++)for(let x=0;x<7;x++)if(!(y===3&&x>=2&&x<=4))out.push({x:start+x*10,y:492+y*10,hp:2});return out;}
 function player(){return {x:W/2,lives:3,score:0,wave:1,clouds:wave(1),wall:walls(),shots:[],rain:[],dir:1,fire:0,rainIn:1.3,gullIn:9,gull:null,invincible:1,clearing:0,ended:false};}
 function create(count=1,seed=1){return {players:Array.from({length:count===2?2:1},player),active:0,phase:'ready',paused:false,elapsed:0,events:[],random:rng(seed)};}
 function current(s){return s.players[s.active];}
 function ready(s){if(s.phase!=='ready')return false;s.phase='playing';return true;}
 function endTurn(s){const p=current(s);if(p.ended||s.phase!=='playing')return;p.ended=true;s.events.push('turn');const next=s.players.findIndex((p,i)=>i!==s.active&&!p.ended);if(next>=0){s.active=next;s.phase='ready';}else s.phase='over';}
 function hurt(s,invasion=false){const p=current(s);if(p.invincible>0&&!invasion)return;p.lives=invasion?0:p.lives-1;p.invincible=1.8;p.rain=[];p.shots=[];s.events.push('hit');if(p.lives<=0)endTurn(s);}
 function hitWall(p,b){const block=p.wall.find(c=>c.hp>0&&Math.abs(c.x+5-b.x)<7&&Math.abs(c.y+5-b.y)<9);if(!block)return false;block.hp--;return true;}
 function step(s,dt,input={}){
  s.events=[];if(s.phase!=='playing'||s.paused)return;s.elapsed+=dt;const p=current(s);p.fire=Math.max(0,p.fire-dt);p.invincible=Math.max(0,p.invincible-dt);
  p.x=Math.max(24,Math.min(W-24,p.x+(Math.max(-1,Math.min(1,input.axis||0)))*280*dt));
  if(input.fire&&p.fire<=0&&p.shots.length<3){p.shots.push({x:p.x,y:SHIP_Y-18});p.fire=.23;s.events.push('shot');}
  if(p.clearing>0){p.clearing-=dt;if(p.clearing<=0){p.wave++;p.clouds=wave(p.wave);p.dir=p.wave%2?1:-1;p.wall=walls();p.shots=[];p.rain=[];p.invincible=1.5;s.events.push('wave');}return;}
  const alive=p.clouds.filter(c=>c.alive),speed=(20+Math.min(100,(p.wave-1)*9)+(32-alive.length)*2.4)*dt;
  let edge=false;for(const c of alive){c.x+=p.dir*speed;if(c.x<29||c.x>W-29)edge=true;}
  if(edge){p.dir*=-1;for(const c of alive){c.x=Math.max(29,Math.min(W-29,c.x));c.y+=20;}}
  if(alive.some(c=>c.y>SHIP_Y-34)){hurt(s,true);return;}
  p.rainIn-=dt;if(p.rainIn<=0&&alive.length){const bottom=new Map();for(const c of alive){const col=c.id%8;if(!bottom.has(col)||bottom.get(col).y<c.y)bottom.set(col,c);}const candidates=[...bottom.values()],c=candidates[Math.floor(s.random()*candidates.length)];p.rain.push({x:c.x,y:c.y+18});p.rainIn=Math.max(.32,1.35-p.wave*.07-alive.length*.003);}
  p.gullIn-=dt;if(!p.gull&&p.gullIn<=0){p.gull={x:-25,y:68};p.gullIn=10+s.random()*6;}
  if(p.gull){p.gull.x+=105*dt;if(p.gull.x>W+25)p.gull=null;}
  p.shots=p.shots.filter(b=>{b.y-=510*dt;if(b.y<-10)return false;if(hitWall(p,b))return false;if(p.gull&&Math.abs(p.gull.x-b.x)<23&&Math.abs(p.gull.y-b.y)<14){p.score+=150;p.gull=null;s.events.push('bonus');return false;}const c=p.clouds.find(c=>c.alive&&Math.abs(c.x-b.x)<25&&Math.abs(c.y-b.y)<18);if(!c)return true;c.alive=false;p.score+=(4-c.row)*10;s.events.push('cloud');return false;});
  let hit=false;p.rain=p.rain.filter(b=>{b.y+=(170+Math.min(130,p.wave*12))*dt;if(b.y>H)return false;if(hitWall(p,b))return false;if(Math.abs(p.x-b.x)<19&&Math.abs(SHIP_Y-b.y)<16){if(p.invincible<=0){hurt(s);hit=true;}return false;}return true;});
  if(hit)p.rain=[];
  if(s.phase!=='playing')return;
  if(!p.clouds.some(c=>c.alive)){p.clearing=1.4;p.rain=[];s.events.push('clear');}
 }
 function advance(s,dt,input={}){let left=Math.max(0,Math.min(.25,dt)),events=[];while(left>0){const tick=Math.min(left,1/120);step(s,tick,input);events.push(...s.events);left-=tick;}s.events=events;return s;}
 function scores(data){return (Array.isArray(data)?data:[]).filter(r=>r&&Number.isSafeInteger(r.score)&&r.score>=0&&typeof r.name==='string'&&/^[A-Z0-9]{3}$/.test(r.name)).map(r=>({name:r.name,score:r.score})).sort((a,b)=>b.score-a.score).slice(0,5);}
 function record(table,name,score){const clean=String(name||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3).padEnd(3,'_').replace(/_/g,'A');return scores([...scores(table),{name:clean,score}]);}
 const api={W,H,SHIP_Y,create,current,ready,advance,hurt,endTurn,wave,walls,scores,record};if(typeof module==='object'&&module.exports)module.exports=api;else root.StormModel=api;
})(typeof window==='object'?window:globalThis);
