/* Runs in the existing isolated scenario iframe, with saves restored by run.html. */
async function checkRealmPhone(frame) {
 const w=frame.contentWindow,d=w.document,checks=[];
 const check=(ok,label)=>{if(!ok)throw Error('RB1.4: '+label);checks.push('RB1.4: '+label);};
 const details=frame.closest('details');details.open=true;
 frame.style.cssText='position:fixed;left:-10000px;top:0;border:0;max-width:none';
 w.eval("clearRealmRoad();clearTownService();closeRealmNotebook(false);const phoneHero=newHero('Phonecheck','concord','human','hunter');phoneHero.lvl=60;phoneHero.onboarding={arrival:true,hints:{}};phoneHero.mode='focus';S.chars=[phoneHero];S.cur=phoneHero.id;boot();closeModal();updateWorld();");
 const settle=()=>new Promise(resolve=>w.requestAnimationFrame(()=>w.requestAnimationFrame(()=>w.requestAnimationFrame(resolve))));
 const rect=selector=>d.querySelector(selector).getBoundingClientRect();
 for(const [width,height]of [[320,568],[390,844],[667,375],[1366,768],[1920,1080],[3440,1440]]){
  frame.style.width=width+'px';frame.style.height=height+'px';await settle();
  const label=width+'×'+height;
  check(d.documentElement.scrollWidth<=w.innerWidth,label+' keeps page within viewport');
  check(rect('#fieldDock').bottom<=height+1,label+' dock stays on screen');
  const bar=rect('.abar');check(bar.left>=0&&bar.right<=width+1,label+' action bar fits horizontally');
  check(bar.bottom<=rect('.xp').top+1,label+' action bar clears XP and dock');
  if(width<=700){
   check([...d.querySelectorAll('#slots button')].every(el=>el.getBoundingClientRect().width>=44&&el.getBoundingClientRect().height>=44),label+' abilities have 44px tap targets');
   check([...d.querySelectorAll('#fieldDock button')].every(el=>el.getBoundingClientRect().height>=44),label+' dock has 44px tap targets');
   d.querySelector('#fieldOptions').open=true;await settle();const options=rect('.field-options-list');
   check(options.left>=0&&options.right<=width+1&&options.bottom<=height+1,label+' Options stays inside screen');d.querySelector('#fieldOptions').open=false;
  }
  d.querySelector('[data-field-book="bags"]').click();await settle();
  check(!d.querySelector('.menu').hidden,label+' tap opens Satchel');
  const book=rect('.menu');check(book.left>=0&&book.right<=width+1&&book.top>=0&&book.bottom<=height+1,label+' notebook fits screen');
  d.querySelector('#fieldPutAway').click();check(d.querySelector('.menu').hidden,label+' tap puts notebook away');
 }
 frame.removeAttribute('style');details.open=false;return checks;
}
