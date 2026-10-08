'use strict';
/* Runs the real Otherworld test page, injecting faults only into its temporary game instance. */
document.querySelector('#run').addEventListener('click',async()=>{
  const button=document.querySelector('#run'),summary=document.querySelector('#summary'),results=document.querySelector('#results');if(button.disabled)return;
  button.disabled=true;summary.textContent='Running…';results.replaceChildren();let outer,frame,count=0;
  const foreign='arcade-backup:runner-safety-unrelated:keep';
  const managed=k=>k==='otherworld-save-v1'||k==='arcade-index-v1'||k.startsWith('arcade-backup:otherworld-save-v1:')||k.startsWith('arcade-backup:arcade-index-v1:');
  const snapshot=()=>JSON.stringify(Object.keys(localStorage).filter(managed).sort().map(k=>[k,localStorage.getItem(k)]));
  const check=(ok,label)=>{const li=document.createElement('li');li.className=ok?'pass':'fail';li.textContent=(ok?'PASS — ':'FAIL — ')+label;results.appendChild(li);if(!ok)throw Error(label);count++;};
  const waitFor=async fn=>{for(let i=0;i<300;i++){if(fn())return;await new Promise(r=>setTimeout(r,100));}throw Error('Runner did not finish in 30 seconds.');};
  try{
    outer=new Map(Object.keys(localStorage).filter(k=>managed(k)||k===foreign).map(k=>[k,localStorage.getItem(k)]));
    for(const mode of ['real','failed','throw','missing-hook','load-error','timeout','empty']){
      Object.keys(localStorage).filter(managed).forEach(k=>localStorage.removeItem(k));
      if(mode!=='empty')for(const [key,value]of [['otherworld-save-v1','original save bytes · α'],['arcade-index-v1','original hub bytes'],['arcade-backup:otherworld-save-v1:keep','original recovery bytes'],['arcade-backup:arcade-index-v1:keep','original hub recovery bytes']])localStorage.setItem(key,value);
      localStorage.setItem(foreign,'another game stays untouched');const before=snapshot();
      frame=document.createElement('iframe');frame.title='Save-safety regression: '+mode;
      await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Could not open Otherworld runner within 20 seconds.')),20000);frame.onload=()=>{clearTimeout(timer);resolve();};frame.onerror=()=>{clearTimeout(timer);reject(Error('Could not open Otherworld runner.'));};frame.src='otherworld.html';document.querySelector('#game').appendChild(frame);});
      const w=frame.contentWindow;
      if(mode==='failed')w.otherworldChecks=function(){localStorage.setItem('otherworld-save-v1','test save');localStorage.setItem('arcade-index-v1','test hub');localStorage.setItem('arcade-backup:otherworld-save-v1:keep','overwritten backup');localStorage.setItem('arcade-backup:otherworld-save-v1:test-only','test backup');localStorage.setItem('arcade-backup:arcade-index-v1:test-only','test hub backup');return [{ok:false,label:'Deliberately failed check'}];};
      if(mode==='throw')w.otherworldChecks=function(){localStorage.setItem('otherworld-save-v1','test save');localStorage.setItem('arcade-index-v1','test hub');localStorage.setItem('arcade-backup:otherworld-save-v1:keep','overwritten backup');localStorage.setItem('arcade-backup:otherworld-save-v1:test-only','test backup');throw Error('Deliberate scenario exception');};
      if(['missing-hook','load-error','timeout'].includes(mode)){
        const create=w.document.createElement.bind(w.document);w.document.createElement=function(tag,opts){const el=create(tag,opts);if(tag==='iframe')el.addEventListener('load',event=>{if(mode==='missing-hook')delete el.contentWindow.__ow;else if(mode==='load-error')el.dispatchEvent(new w.Event('error'));else event.stopImmediatePropagation();},true);return el;};
        if(mode==='timeout'){const schedule=w.setTimeout.bind(w);w.setTimeout=(callback,ms,...args)=>schedule(callback,ms===20000?1:ms,...args);}
      }
      const run=w.document.querySelector('#run');run.click();run.click();check(run.disabled&&w.document.querySelectorAll('iframe').length===1,mode+': repeat clicks cannot start overlapping runs');
      await waitFor(()=>!run.disabled);
      check(w.document.querySelector('#summary').textContent.startsWith(['failed','throw','missing-hook','load-error','timeout'].includes(mode)?'FAIL':'PASS'),mode+': intended result is reported');
      check(snapshot()===before,mode+': save, hub and existing/new recovery backups restored byte for byte');
      check(localStorage.getItem(foreign)==='another game stays untouched',mode+': unrelated recovery backup untouched');
      check(!w.document.querySelector('iframe'),mode+': temporary game removed before restoration');frame.remove();frame=null;
    }
    summary.textContent='PASS — '+count+' save-safety checks.';
  }catch(e){summary.textContent='FAIL — '+e.message;}
  finally{
    if(frame)frame.remove();
    if(outer){Object.keys(localStorage).filter(k=>managed(k)||k===foreign).forEach(k=>localStorage.removeItem(k));for(const [k,v]of outer)localStorage.setItem(k,v);}
    button.disabled=false;
  }
});
