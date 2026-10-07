'use strict';

/* ================= pixel art ================= */
function hero(ctx,x,y,p,a,f){
  const C=CLASSES[a.cls],skin='#f6d3b0',dk='#2b2b3a';const r=(gx,gy,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x+gx*p),Math.round(y+gy*p),Math.ceil(w*p),Math.ceil(h*p));};
  const step=f?1:0;
  // weapon behind/side
  if(a.cls==='mage'){r(8,-1,1,12,'#8a5a2b');r(7,-2,3,2,'#c4a7ff');}
  if(a.cls==='cleric'){r(8,0,1,11,'#e6c35a');r(7,1,3,1,'#e6c35a');}
  if(a.cls==='archer'){r(8,2,1,1,'#8a5a2b');r(9,3,1,5,'#8a5a2b');r(8,8,1,1,'#8a5a2b');r(8,3,1,5,'#e8e4d4');}
  // legs
  r(2,10,1,2+step,dk);r(5,10,1,3-step,dk);
  // body
  r(1,6,6,4,C.color);r(0,6,1,3,C.color);r(7,6,1,3,C.color);r(1,9,6,1,dk);
  if(a.cls==='thief')r(1,6,6,1,'#e0483e');
  if(a.cls==='cleric')r(3,6,2,4,'#fff');
  // head
  r(1,2,6,4,skin);
  r(2,4,1,2,dk);r(5,4,1,2,dk);r(2,4,1,1,'#fff');r(5,4,1,1,'#fff');
  r(1,5,1,1,'#f4a0a0');r(6,5,1,1,'#f4a0a0');
  // hair / headgear
  if(a.cls==='knight'){r(0,0,8,3,'#9aa5b5');r(0,3,1,2,'#9aa5b5');r(7,3,1,2,'#9aa5b5');r(3,-1,2,1,'#e0483e');}
  else{r(1,0,6,2,a.hair);r(0,1,1,4,a.hair);r(7,1,1,3,a.hair);r(1,2,2,1,a.hair);r(5,2,2,1,a.hair);r(3,2,1,1,a.hair);}
  if(a.cls==='mage'){r(-1,0,10,1,'#6d3fd0');r(1,-1,6,1,'#6d3fd0');r(2,-2,4,1,'#6d3fd0');r(3,-3,3,1,'#6d3fd0');r(5,-4,2,1,'#6d3fd0');}
  if(a.cls==='monk')r(1,1,6,1,'#e0483e');
  // front weapon
  if(a.cls==='swordsman'){r(8,1,1,7,'#dfe6ee');r(7,7,3,1,'#8a5a2b');r(8,8,1,1,'#8a5a2b');}
  if(a.cls==='knight'){r(-1,5,3,5,'#c9d2dc');r(-1,6,3,1,'#f2a91a');}
  if(a.cls==='thief'){r(8,7,2,1,'#dfe6ee');r(7,7,1,1,'#8a5a2b');}
  if(a.cls==='monk'){r(-1,7,1,1,skin);r(8,7,1,1,skin);}
}
function staffSprite(ctx,x,y,p,s){hero(ctx,x,y,p,{cls:'swordsman',hair:s.hair},0);ctx.fillStyle=s.col;ctx.fillRect(x+1*p,y+6*p,6*p,4*p);ctx.fillStyle='#fff';ctx.fillRect(x+3*p,y+6*p,2*p,1*p);}
function monsterArt(ctx,cx,by,p,m,t){
  const r=(gx,gy,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(cx+gx*p),Math.round(by+gy*p),Math.ceil(w*p),Math.ceil(h*p));};
  const c=m.c,dk='#1d2433',eye='#fff';const b=Math.sin(t*4)>0?1:0;
  if(m.k==='slime'){const w=[4,8,10,12,12,12];w.forEach((ww,i)=>r(-ww/2,-6+i+b*0.5,ww,1,c));r(-6,-1,12,1,'#3a9b49');r(-3,-4,2,2,eye);r(1,-4,2,2,eye);r(-2,-3,1,1,dk);r(2,-3,1,1,dk);r(-4,-5,2,1,'#b6f0bd');}
  else if(m.k==='bat'){const fl=b?-2:0;r(-2,-7,4,4,c);r(-6,-7+fl,4,2,c);r(2,-7+fl,4,2,c);r(-8,-6+fl,2,2,c);r(6,-6+fl,2,2,c);r(-1,-6,1,1,'#ff5a5a');r(1,-6,1,1,'#ff5a5a');r(-1,-3,1,2,c);r(1,-3,1,2,c);}
  else if(m.k==='hum'){r(-2,-14,4,4,c);r(-1,-12,1,1,'#ff5a5a');r(1,-12,1,1,'#ff5a5a');r(-3,-10,6,5,c);r(-4,-10,1,4,c);r(3,-10,1,4,c);r(-3,-5,2,5-b,c);r(1,-5,2,4+b,c);r(4,-12,1,7,'#8a5a2b');}
  else if(m.k==='ghost'){r(-4,-14,8,8,c);r(-5,-12,10,6,c);for(let i=-5;i<5;i+=2)r(i,-6,1,2+((i+Math.floor(t*4))&1),c);r(-2,-11,2,2,dk);r(1,-11,2,2,dk);}
  else{r(-8,-9,12,6,c);r(3,-13,5,5,c);r(7,-11,2,2,c);r(5,-12,1,1,'#ffd34a');r(-12,-7,4,2,c);r(-14,-6,2,1,c);r(-6,-3,2,3,c);r(0,-3,2,3,c);r(-6,-14+b,6,4,'#a33a30');r(-4,-16+b,3,2,'#a33a30');}
}

/* ================= stage canvas ================= */
const cv=$('#stage'),cx=cv.getContext('2d');let PW=0,PH=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){const r=cv.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);PW=r.width;PH=r.height;cv.width=Math.round(PW*dpr);cv.height=Math.round(PH*dpr);cx.setTransform(dpr,0,0,dpr,0,0);cx.imageSmoothingEnabled=false;}
if(window.ResizeObserver)new ResizeObserver(resize).observe(cv);else addEventListener('resize',resize);
let lastF=performance.now();
function frame(t){
  requestAnimationFrame(frame);if(!PW||document.hidden)return;
  const dt=Math.min(0.05,(t-lastF)/1000);lastF=t;const ts=t/1000;
  const p=Math.max(2,Math.floor(PH/64)),floorY=Math.floor(PH*0.78);
  // wall
  cx.fillStyle='#3b3552';cx.fillRect(0,0,PW,floorY);
  cx.fillStyle='#463f63';const bw=p*12,bh=p*6;
  for(let y=0,row=0;y<floorY;y+=bh,row++)for(let x=(row%2)*bw/2-bw;x<PW;x+=bw)cx.fillRect(Math.round(x)+p/2,y+p/2,bw-p,bh-p);
  // torches
  [0.2,0.8].forEach((fxp,i)=>{const tx=Math.round(PW*fxp),ty=Math.round(floorY*0.35);cx.fillStyle='#8a5a2b';cx.fillRect(tx-p,ty,p*2,p*6);
    const fl=reduce?0:Math.sin(ts*12+i*3)*p;cx.fillStyle='#f2a91a';cx.fillRect(tx-p*2,ty-p*4+fl,p*4,p*4);cx.fillStyle='#ffe28a';cx.fillRect(tx-p,ty-p*3+fl,p*2,p*2);
    const g=cx.createRadialGradient(tx,ty,2,tx,ty,PW*0.18);g.addColorStop(0,'rgba(242,169,26,.18)');g.addColorStop(1,'rgba(242,169,26,0)');cx.fillStyle=g;cx.fillRect(tx-PW*.2,ty-PW*.2,PW*.4,PW*.4);});
  // floor
  cx.fillStyle='#5a4a3a';cx.fillRect(0,floorY,PW,PH-floorY);cx.fillStyle='#6b5946';for(let x=0;x<PW;x+=p*10)cx.fillRect(x,floorY,p*9,p);
  cx.fillStyle='#4a3c2f';for(let x=p*5;x<PW;x+=p*10)cx.fillRect(x,floorY+p*4,p*8,p);
  // floor label
  cx.fillStyle='rgba(29,36,51,.7)';cx.fillRect(p*2,p*2,p*22,p*9);cx.fillStyle='#ffe28a';cx.font=`${p*6}px DotGothic16, monospace`;cx.textBaseline='top';cx.fillText(floorName(S.floor),p*4,p*3);
  fx.monHit=Math.max(0,fx.monHit-dt);fx.partyHit=Math.max(0,fx.partyHit-dt);fx.swing=Math.max(0,fx.swing-dt);
  // party
  const resting=S.resting>0,n=S.party.length;
  S.party.forEach((a,i)=>{const col=i%2,row=Math.floor(i/2);
    const x=Math.round(PW*0.08+col*p*13+row*p*4),y=Math.round(floorY-p*13-row*p*3+col*p*2);
    const bob=reduce||resting?0:(Math.sin(ts*6+i)>0?p:0);const lunge=!reduce&&fx.swing>0&&!resting?p*2:0;const shake=fx.partyHit>0&&!reduce?(Math.random()-.5)*p*2:0;
    cx.globalAlpha=resting?0.45:1;hero(cx,x+lunge+shake,y-bob,p,a,!reduce&&Math.sin(ts*8+i)>0);cx.globalAlpha=1;});
  if(resting){cx.fillStyle='#fff';cx.font=`${p*5}px DotGothic16, monospace`;cx.fillText('Zzz',Math.round(PW*0.12),Math.round(floorY-p*26)-(reduce?0:Math.floor(ts*2)%3*p));}
  // monster
  const m=S.mon;
  if(m&&n){const sc=m.boss?Math.round(p*1.6):p;const mx=Math.round(PW*0.72)+(fx.monHit>0&&!reduce?(Math.random()-.5)*p*3:0);
    cx.save();if(fx.monHit>0){cx.globalAlpha=0.6;}monsterArt(cx,mx,floorY,sc,m,ts);cx.restore();}
  // floaters
  cx.font=`${p*5}px DotGothic16, monospace`;cx.textAlign='center';
  for(let j=fx.hits.length-1;j>=0;j--){const h=fx.hits[j];h.age+=dt;if(h.age>0.9||reduce){fx.hits.splice(j,1);continue;}
    const isM=h.t==='m',isG=h.t==='g';const x=isM||isG?PW*0.72+(h.x-.5)*PW*0.12:PW*0.18+(h.x-.5)*PW*0.1;const y=floorY-p*(isG?30:22)-h.age*p*14;
    cx.globalAlpha=1-h.age/0.9;cx.fillStyle=isG?'#ffd34a':isM?(h.crit?'#ff8fb1':'#fff'):'#ff6b5a';cx.fillText((isG?'+':'')+fmt(h.v)+(h.crit?'!':''),x,y);}
  cx.globalAlpha=1;cx.textAlign='left';
  if(!n){cx.fillStyle='#fff';cx.font=`${p*5}px DotGothic16, monospace`;cx.textAlign='center';cx.fillText('The dungeon waits. Hire a party.',PW/2,floorY*0.5);cx.textAlign='left';}
}

