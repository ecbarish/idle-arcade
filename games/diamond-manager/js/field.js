'use strict';
/* Lamplight Field from above. The stands and light towers grow with the ballpark upgrades; runners show on the
   bases while a game is being watched. Drawing never changes the league. */
const FIELD = {flash:0, ball:null};
function drawField(cv, L, ev) {
  const dpr=Math.min(2,window.devicePixelRatio||1), w=cv.clientWidth, h=cv.clientHeight;
  if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);}
  const c=cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
  // Grass stripes
  for(let x=0;x<w;x+=36){c.fillStyle=(x/36)%2?'#2a6b3c':'#256236';c.fillRect(x,0,36,h);}
  // The park is sized to the window: home plate near the bottom middle, the outfield fence near the top.
  const s=Math.min(w/2.4,h/1.25), hx=w/2, hy=h*.5+s*.5, base=s*.42;
  const u=L?L.upgrades:{seats:0,lights:0};
  // Stands: one ring per seats level, behind the fence.
  c.save(); c.translate(hx,hy);
  for(let i=u.seats;i>=0;i--){ c.fillStyle=i%2?'#5b4a3a':'#6b5845'; c.beginPath(); c.arc(0,0,s*(1.02+i*.07+.07),Math.PI*1.2,Math.PI*1.8); c.arc(0,0,s*(1.02+i*.07),Math.PI*1.8,Math.PI*1.2,true); c.fill();
    // Crowd dots
    c.fillStyle='#d9c9a8'; for(let a=1.22;a<1.78;a+=.018+.01*((i*7)%3)/3){ const rr=s*(1.055+i*.07); c.fillRect(Math.cos(a*Math.PI)*rr-1,Math.sin(a*Math.PI)*rr-1,2,2);} }
  // Fence
  c.strokeStyle='#e8dcae'; c.lineWidth=3; c.beginPath(); c.arc(0,0,s,Math.PI*1.25,Math.PI*1.75); c.stroke();
  // Foul lines and infield dirt
  c.strokeStyle='#f4f1e4'; c.lineWidth=2; c.beginPath(); c.moveTo(0,0); c.lineTo(-s*.707,-s*.707); c.moveTo(0,0); c.lineTo(s*.707,-s*.707); c.stroke();
  c.fillStyle='#b98b5a'; c.beginPath(); c.moveTo(0,8); c.lineTo(-base*.8,-base*.75); c.quadraticCurveTo(0,-base*2.1,base*.8,-base*.75); c.closePath(); c.fill();
  c.fillStyle='#2f7a44'; c.beginPath(); c.moveTo(0,-base*.18); c.lineTo(-base*.55,-base*.72); c.lineTo(0,-base*1.26); c.lineTo(base*.55,-base*.72); c.closePath(); c.fill();
  // Bases: first, second, third, and home.
  const B=[[base*.72,-base*.72],[0,-base*1.44],[-base*.72,-base*.72]];
  const on=ev&&ev.bases?ev.bases:[0,0,0];
  B.forEach(([x,y],i)=>{ c.fillStyle='#fff'; c.save(); c.translate(x,y); c.rotate(Math.PI/4); c.fillRect(-5,-5,10,10); c.restore();
    if(on[i]){ person(c,x,y-10,'#ffd281'); } });
  c.fillStyle='#fff'; c.fillRect(-5,-3,10,7);
  // Mound and pitcher, fielders
  c.fillStyle='#c79a66'; c.beginPath(); c.arc(0,-base*.72,9,0,7); c.fill();
  if(ev){ person(c,0,-base*.72-8,'#e7e2d0'); person(c,-12,-6,'#ffd281');
    [[base*.95,-base*.95],[base*.35,-base*1.45],[-base*.35,-base*1.45],[-base*.95,-base*.95],[-s*.55,-s*.65],[0,-s*.82],[s*.55,-s*.65]].forEach(([x,y])=>person(c,x,y,'#e7e2d0')); }
  // Light towers, one pair per level.
  for(let i=0;i<u.lights;i++) for(const side of [-1,1]){ const a=Math.PI*(1.5+side*(.2+i*.08)), x=Math.cos(a)*s*1.25, y=Math.sin(a)*s*1.25;
    c.fillStyle='#3a3a3a'; c.fillRect(x-2,y,4,26); c.fillStyle='#fff6c8'; c.fillRect(x-9,y-6,18,8); c.fillStyle='rgba(255,246,200,.08)'; c.beginPath(); c.arc(x,y,60,0,7); c.fill(); }
  // A hit flies out for a moment.
  if(FIELD.ball){ const t=Math.min(1,(performance.now()-FIELD.ball.at)/600), [tx,ty]=FIELD.ball.to; c.fillStyle='#fff'; c.beginPath(); c.arc(tx*t,ty*t-Math.sin(t*Math.PI)*30,4,0,7); c.fill(); if(t>=1)FIELD.ball=null; }
  c.restore();
  // Park sign
  c.fillStyle='#1b3639d0'; c.fillRect(12,h-42,180,30); c.fillStyle='#fff4cd'; c.font='12px system-ui'; c.fillText('LAMPLIGHT FIELD',24,h-22);
  return {s,base};
}
function person(c,x,y,col){ c.fillStyle='#1d1d1d'; c.fillRect(x-3,y+1,6,9); c.fillStyle=col; c.fillRect(x-4,y-1,8,8); c.fillStyle='#d9a77a'; c.fillRect(x-3,y-7,6,6); }
function throwBall(res,s){ const far=res===4?1.15:res===3?.95:res===2?.85:.55, a=Math.PI*(1.3+Math.random()*.4); FIELD.ball={at:performance.now(),to:[Math.cos(a)*s*far,Math.sin(a)*s*far]}; }
