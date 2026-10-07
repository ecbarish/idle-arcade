'use strict';
/* =================== scene =================== */
const cv=$('#scene'),cx=cv.getContext('2d');let PW=0,PH=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){const r=cv.getBoundingClientRect();const d=Math.min(2,devicePixelRatio||1);PW=r.width;PH=r.height;cv.width=Math.round(PW*d);cv.height=Math.round(PH*d);cx.setTransform(d,0,0,d,0,0);cx.imageSmoothingEnabled=false;}
if(window.ResizeObserver)new ResizeObserver(resize).observe(cv);else addEventListener('resize',resize);
function drawHero(x,y,p,t){const h=H(),r=RACES[h.race],K=CLASSES[h.cls];const q=(gx,gy,w,hh,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x+gx*p),Math.round(y+gy*p),Math.ceil(w*p),Math.ceil(hh*p));};
  const sit=C.phase==='rest'||C.phase==='intown';const dy=sit?3:0;
  if(C.phase==='dead')cx.globalAlpha=.4;
  q(2,10+dy,1,sit?1:3,'#2b2b3a');q(5,10+dy,1,sit?1:3,'#2b2b3a');
  q(1,5+dy,6,5,K.col);q(1,9+dy,6,1,'#3a2a1a');q(0,6+dy,1,3,K.col);q(7,6+dy,1,3,K.col);
  q(1,1+dy,6,4,r.skin);q(2,3+dy,1,1,'#111');q(5,3+dy,1,1,'#111');q(1,0+dy,6,1,r.hair);q(0,1+dy,1,2,r.hair);q(7,1+dy,1,2,r.hair);
  if(r.beard)q(1,4+dy,6,2,r.hair);if(r.tusks){q(2,4+dy,1,1,'#fff');q(5,4+dy,1,1,'#fff');}if(r.ears){q(-1,2+dy,1,1,r.skin);q(8,2+dy,1,1,r.skin);}
  const sw=C.anim.hero>0?-2:0;
  if(h.cls==='hunter'){q(8,1+dy,1,1,'#8a5a2b');q(9,2+dy,1,6,'#8a5a2b');q(8,8+dy,1,1,'#8a5a2b');q(8,2+dy,1,6,'#e8e4d4');}
  else if(h.cls==='warrior'||h.cls==='rogue'){q(8,2+dy+sw,1,6,'#dfe6ee');q(7,7+dy,3,1,'#8a5a2b');}else{q(8,-1+dy,1,11,'#8a5a2b');q(7,-2+dy,3,2,h.cls==='mage'?'#69ccf0':'#f2c14e');}
  if(h.cls==='warrior')q(-1,5+dy,2,4,'#9aa5b5');
  if(C.cast){cx.globalAlpha=.5+.3*Math.sin(t*12);cx.fillStyle=h.cls==='mage'?'#ff9a3a':'#fff0a0';cx.beginPath();cx.arc(x+9*p,y-1*p,p*2.2,0,7);cx.fill();}
  cx.globalAlpha=1;}
function drawMob(m,x,y,p,t){const sc=m.elite?1.45:1;p*=sc;const q=(gx,gy,w,hh,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x+gx*p),Math.round(y+gy*p),Math.ceil(w*p),Math.ceil(hh*p));};
  const c=m.col,b=reduce?0:(Math.sin(t*5)>0?1:0);
  if(m.kind==='beast')drawBeast(cx,x,y,p,c,m.fam||'wolf',false,t);
  else{q(0,0,5,4,c);q(1,2,1,1,'#ff4a3a');q(3,2,1,1,'#ff4a3a');q(-1,4,7,6,c);q(-2,4,1,4,c);q(6,4,1,4,c);q(0,10,2,3+b,c);q(3,10,2,3-b,c);q(-3,1,1,8,'#7a5a3a');}
  if(m.elite){cx.strokeStyle='#f2c14e';cx.lineWidth=2;cx.strokeRect(x-6*p,y-2*p,18*p,17*p);}}
/* Companions and other adventurers */
function drawPerson(x,y,p,o,t){const r=RACES[o.race],K=CLASSES[o.cls];const q=(gx,gy,w,hh,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x+gx*p),Math.round(y+gy*p),Math.ceil(w*p),Math.ceil(hh*p));};
  if(o.dead)cx.globalAlpha=.3;const b=!reduce&&!o.dead&&Math.sin(t*6)>0?1:0;
  q(2,10,1,3,'#2b2b3a');q(5,10,1,3,'#2b2b3a');q(1,5-b*.2,6,5,K.col);q(1,9,6,1,'#3a2a1a');q(0,6,1,3,K.col);q(7,6,1,3,K.col);
  q(1,1,6,4,r.skin);q(2,3,1,1,'#111');q(5,3,1,1,'#111');q(1,0,6,1,o.hair);q(0,1,1,2,o.hair);q(7,1,1,2,o.hair);if(r.tusks){q(2,4,1,1,'#fff');q(5,4,1,1,'#fff');}if(r.ears){q(-1,2,1,1,r.skin);q(8,2,1,1,r.skin);}
  if(o.cls==='warrior'){q(-1,5,2,4,'#9aa5b5');q(8,2,1,6,'#dfe6ee');}else if(o.cls==='rogue')q(8,6,2,1,'#dfe6ee');else if(o.cls==='hunter'){q(9,2,1,6,'#8a5a2b');q(8,2,1,6,'#e8e4d4');}
  else{q(8,-1,1,11,'#8a5a2b');q(7,-2,3,2,o.cls==='mage'?'#69ccf0':'#f2c14e');}
  cx.globalAlpha=1;}
/* One beast drawer for wild beasts, pets and portraits. Faces left unless right=true. */
function drawBeast(c,x,y,p,col,fam,right,t){
  c.save();c.translate(x,y);if(right){c.translate(6*p,0);c.scale(-1,1);}
  const q=(gx,gy,w,hh,cc)=>{c.fillStyle=cc;c.fillRect(Math.round(gx*p),Math.round(gy*p),Math.ceil(w*p),Math.ceil(hh*p));};
  const b=t&&!reduce?(Math.sin(t*5)>0?1:0):0,dk='#111';
  switch(fam){
    case 'spider':q(0,6,8,5,col);q(-3,5,4,4,col);q(-3,6,1,1,'#ff3a3a');q(-1,6,1,1,'#ff3a3a');for(let i=0;i<4;i++){q(-1+i*2.5,11,1,2+((i+b)%2),col);q(-2+i*2.5,4,1,2,col);}break;
    case 'lizard':case 'croc':{const L=fam==='croc'?14:11;q(-1,8,L-3,3,col);q(-5,8,4,2,col);q(-5,8,1,1,dk);q(-3,8,1,1,'#ffde55');q(L-4,9,4,1,col);q(0,11,1,2-b,col);q(L-6,11,1,1+b,col);if(fam==='croc')q(-6,9,2,1,'#e8e4d4');break;}
    case 'horse':{const mn='rgba(0,0,0,.45)';q(-1,5,11,5,col);q(-3,1,3,6,col);q(-6,1,4,3,col);q(-6,2,1,1,dk);q(-7,3,1,1,col);q(-2,0,2,1,col);
      q(-1,1,1,5,mn);q(10,5,2,6,mn);q(0,10,1,5-b,col);q(2,10,1,5,col);q(7,10,1,5,col);q(9,10,1,5+b-1,col);q(0,14,1,1,dk);q(9,14,1,1,dk);break;}
    case 'boar':q(-1,5,10,5,col);q(-4,6,4,4,col);q(-5,8,1,1,'#e8e4d4');q(-4,7,1,1,'#ffde55');q(0,10,1,3-b,col);q(7,10,1,2+b,col);q(2,10,1,3,col);q(5,10,1,3,col);q(0,4,6,1,'rgba(0,0,0,.35)');break;
    default:q(-1,6,10,4,col);q(-4,4+b*.3,4,4,col);q(-4,3,1,1,col);q(-2,3,1,1,col);q(-5,5,1,1,dk);q(-4,5,1,1,'#ffde55');q(0,10,1,3-b,col);q(7,10,1,2+b,col);q(2,10,1,3,col);q(5,10,1,3,col);
      if(fam==='cat'){q(9,5,1,1,col);q(10,3,1,3,col);}else if(fam==='hyena'){q(2,7,1,1,dk);q(5,8,1,1,dk);q(9,6,2,1,col);}else q(9,5,2,1,col);
  }
  c.restore();
}
function frame(ms){requestAnimationFrame(frame);if(!PW||!H()||!C||document.hidden)return;const t=ms/1000;const h=H(),z=h.dun?dungeonDef():ZONES[h.zone];
  const g=cx.createLinearGradient(0,0,0,PH);g.addColorStop(0,z.sky[0]);g.addColorStop(1,z.sky[1]);cx.fillStyle=g;cx.fillRect(0,0,PW,PH);
  cx.fillStyle=z.hill;cx.beginPath();cx.moveTo(0,PH*.7);for(let x=0;x<=PW;x+=PW/10)cx.lineTo(x,PH*.55+Math.sin(x*.02+1)*PH*.07);cx.lineTo(PW,PH);cx.lineTo(0,PH);cx.fill();
  const gy=PH*.78;cx.fillStyle=z.ground;cx.fillRect(0,gy,PW,PH-gy);cx.fillStyle='rgba(0,0,0,.12)';for(let x=0;x<PW;x+=18)cx.fillRect(x+(Math.floor(x/18)%2)*6,gy+6,8,3);
  if(C.phase==='intown'||C.phase==='town'){cx.fillStyle='#6b4a2a';const bx=PW*.62;cx.fillRect(bx,gy-PH*.36,PH*.4,PH*.36);cx.fillStyle='#8a2a1a';cx.beginPath();cx.moveTo(bx-10,gy-PH*.36);cx.lineTo(bx+PH*.2,gy-PH*.55);cx.lineTo(bx+PH*.4+10,gy-PH*.36);cx.fill();cx.fillStyle='#f2c14e';cx.fillRect(bx+PH*.15,gy-PH*.16,PH*.1,PH*.16);}
  const p=Math.max(2,Math.floor(PH/42));
  const walk=(C.phase==='seek'||C.phase==='town')&&!reduce?Math.sin(t*8)*p*.6:0;
  const lunge=C.anim.hero>0?p*3:0;
  const ride=!h.dun&&(C.phase==='seek'||C.phase==='town')?activeMount():null;
  if(ride){const mp=Math.max(2,Math.round(p*(ride.kind==='horse'?1:1.1)));const bottom=ride.kind==='horse'?15:ride.kind==='lizard'||ride.kind==='croc'?13:13;
    const back={horse:5,boar:5,lizard:8,croc:8}[ride.kind]||6;const gallop=reduce?0:Math.abs(Math.sin(t*10))*p*.3;const by=gy-bottom*mp-gallop;
    drawBeast(cx,PW*.28-2*p,by,mp,ride.col,ride.kind,true,t*1.8);drawHero(PW*.28,by+back*mp-10.5*p,p,t);}
  else drawHero(PW*.28+lunge,gy-13*p+walk,p,t);
  const pet=petOf();if(pet&&C.phase!=='dead'&&!(ride&&ride.pet)){const pp=Math.max(2,Math.round(p*.8));cx.globalAlpha=pet.hp>0?1:.35;
    drawBeast(cx,PW*.4+(C.anim.pet>0?pp*3:0),gy-13*pp+(walk?walk*.6:0),pp,pet.col,pet.family,true,pet.hp>0?t:0);cx.globalAlpha=1;
    if(C.taming&&C.mob){cx.strokeStyle='rgba(124,240,138,.8)';cx.setLineDash([4,4]);cx.beginPath();cx.moveTo(PW*.3+8*p,gy-8*p);cx.lineTo(PW*.64,gy-8*p);cx.stroke();cx.setLineDash([]);}}
  else if(C.taming&&C.mob){cx.strokeStyle='rgba(124,240,138,.8)';cx.setLineDash([4,4]);cx.beginPath();cx.moveTo(PW*.3+8*p,gy-8*p);cx.lineTo(PW*.64,gy-8*p);cx.stroke();cx.setLineDash([]);}
  if(C.mob){const m=C.mob;const mx=PW*.64+(C.anim.mob<0?-p*3:0)+(C.anim.mob>0&&!reduce?(R()-.5)*p*2:0);drawMob(m,mx,gy-13*p*(m.elite?1.45:1),p,t);
    const c=con(m.lvl);cx.font=`700 ${Math.max(11,p*4)}px Alegreya Sans, sans-serif`;cx.textAlign='center';cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--con-'+c);cx.fillText(`${m.name}`,mx+3*p,gy-17*p*(m.elite?1.45:1));
    cx.fillStyle='#000';cx.fillRect(mx-6*p,gy-16*p*(m.elite?1.45:1),18*p,p*1.4);cx.fillStyle='#d33';cx.fillRect(mx-6*p,gy-16*p*(m.elite?1.45:1),18*p*Math.max(0,m.hp/m.max),p*1.4);}
  // companions stand behind you
  C.party.forEach((q,i)=>{const pp=Math.max(2,Math.round(p*.85));const x=PW*.28-(i+1)*PW*(C.party.length>4?.027:.065),y=gy-13*pp+((i%2)?pp:0)-(C.party.length>4&&i%2?3*pp:0)+(walk?walk*.5:0);
    drawPerson(x,y,pp,{cls:q.n.cls,race:q.n.race,hair:q.n.hair,dead:q.dead||C.phase==='dead'},t+i);});
  if(C.surge&&C.mob){cx.font=`800 ${p*5}px Alegreya Sans, sans-serif`;cx.textAlign='center';cx.fillStyle='#ff8a2a';cx.fillText(dungeonDef().surgeName.toUpperCase(),PW*.66,gy-22*p);
    cx.fillStyle='rgba(60,140,220,.25)';cx.fillRect(PW*.1,gy-4*p,PW*.6*(1-C.surge.t/2.5),4*p);cx.textAlign='left';}
  if(C.phase==='rest'&&!reduce){cx.fillStyle='#fff';cx.font=`700 ${p*4}px Alegreya Sans, sans-serif`;cx.fillText('z',PW*.28+10*p,gy-16*p-(Math.floor(t*2)%3)*p*2);}
  cx.textAlign='center';
  for(let i=C.fx.length-1;i>=0;i--){const f=C.fx[i];f.age+=1/60;if(f.age>1.1||reduce){C.fx.splice(i,1);continue;}const x=(f.who==='mob'?PW*.66:f.who==='pet'?PW*.43:PW*.3)+(f.x-.5)*PW*.08,y=gy-20*p-f.age*p*10;
    cx.globalAlpha=1-f.age/1.1;cx.font=`800 ${f.big?p*7:p*5}px Alegreya Sans, sans-serif`;cx.lineWidth=3;cx.strokeStyle='#000';cx.strokeText(f.txt,x,y);cx.fillStyle=f.col;cx.fillText(f.txt,x,y);}
  cx.globalAlpha=1;cx.textAlign='left';}

