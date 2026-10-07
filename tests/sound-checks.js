'use strict';
function soundChecks() {
  const checks=[],players=[],intervals=new Map();let nextId=0,hidden=false;
  const check=(label,test)=>{try{if(!test())throw Error('Expected condition was false.');checks.push({ok:true,label});}catch(e){checks.push({ok:false,label:label+' — '+e.message});}};
  const saved={AudioContext:window.AudioContext,webkitAudioContext:window.webkitAudioContext,setInterval:window.setInterval,clearInterval:window.clearInterval,hidden:Object.getOwnPropertyDescriptor(document,'hidden')};
  class Param { constructor(value=0){this.value=value;this.targets=[];}setValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}cancelScheduledValues(){}setTargetAtTime(v,t,constant){this.value=v;this.targets.push({v,t,constant});} }
  class Node { constructor(){this.connections=[];this.disconnects=0;this.gain=new Param();this.frequency=new Param();this.delayTime=new Param();this.started=0;this.stopped=0;}connect(n){this.connections.push(n);}disconnect(){this.connections=[];this.disconnects++;}start(){this.started++;}stop(){this.stopped++;}setPeriodicWave(){} }
  class AudioDouble {
    static instances=[];
    constructor(){AudioDouble.instances.push(this);this.state='running';this.currentTime=5;this.sampleRate=64;this.destination=new Node();this.sources=[];this.gains=[];this.filters=[];this.closed=0;}
    createGain(){const n=new Node();this.gains.push(n);return n;}createBiquadFilter(){const n=new Node();this.filters.push(n);return n;}createBufferSource(){const n=new Node();this.sources.push(n);return n;}
    createOscillator(){return new Node();}createDelay(){return new Node();}createPeriodicWave(){return {};}createBuffer(c,n){return {getChannelData:()=>new Float32Array(n)};}resume(){this.state='running';return Promise.resolve();}close(){this.closed++;this.state='closed';return Promise.resolve();}
  }
  const pulse=()=>{for(const f of intervals.values())f();};
  const make=o=>{const p=ArcadeSound.create(o);players.push(p);return p;};
  try{
    window.AudioContext=AudioDouble;window.webkitAudioContext=undefined;
    window.setInterval=f=>{const id=++nextId;intervals.set(id,f);return id;};window.clearInterval=id=>intervals.delete(id);
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});
    let mode=0,rain=.65;
    const p=make({tracks:{},mode:()=>mode,setMode:v=>mode=v,musicKey:()=>null,rain:()=>rain});
    pulse();p.sfx('hit');p.render();check('Off never creates an audio context, even while raining',()=>AudioDouble.instances.length===0);
    mode=1;pulse();check('A saved sound-on mode waits for a gesture or effect before opening audio',()=>AudioDouble.instances.length===0);
    p.sfx('select');pulse();const ac=AudioDouble.instances[0],loop=()=>ac.sources.filter(n=>n.loop&&n.started&&!n.stopped);
    check('Effects mode starts one looping rain source without music',()=>loop().length===1&&loop()[0].buffer);
    const source=loop()[0],high=source.connections[0],low=high.connections[0],gain=low.connections[0];
    check('Rain filters the shared noise through a highpass and lowpass',()=>high.type==='highpass'&&high.frequency.value===400&&low.type==='lowpass'&&low.frequency.value===2500);
    check('Rain has a separate quiet gain routed through master',()=>gain.connections[0]===ac.gains[0]&&gain!==ac.gains[1]&&gain!==ac.gains[2]&&gain.gain.value>0&&gain.gain.value<.35);
    const original=loop()[0];for(let i=0;i<30;i++)pulse();check('Repeated scheduler calls never stack rain sources',()=>loop().length===1&&loop()[0]===original&&gain.gain.targets.length===1);
    rain=1;pulse();check('Storm intensity changes smoothly on the same loop',()=>loop()[0]===original&&gain.gain.targets.at(-1).v===.35&&gain.gain.targets.at(-1).constant===.35);
    rain=0;pulse();check('Dry weather fades to zero without creating another source',()=>gain.gain.targets.at(-1).v===0&&ac.sources.filter(n=>n.loop).length===1);
    rain=.3;mode=2;pulse();check('Rain resumes with music enabled using the existing source',()=>loop().length===1&&loop()[0]===original&&gain.gain.targets.at(-1).v===.3*.35);
    rain=5;pulse();check('Large rain values are bounded',()=>gain.gain.targets.at(-1).v===.35);
    rain=-1;pulse();check('Negative rain values become silence',()=>gain.gain.targets.at(-1).v===0);
    rain=NaN;pulse();check('Invalid rain values stay silent',()=>gain.gain.targets.at(-1).v===0);
    rain=.65;pulse();hidden=true;document.dispatchEvent(new Event('visibilitychange'));
    check('Hiding the page immediately stops and disconnects rain',()=>loop().length===0&&original.stopped===1&&original.disconnects===1&&high.disconnects===1&&low.disconnects===1&&gain.disconnects===1);
    pulse();check('A hidden page never recreates the loop',()=>loop().length===0);
    hidden=false;document.dispatchEvent(new Event('visibilitychange'));check('Returning to a visible rainy page starts only one fresh loop',()=>loop().length===1&&loop()[0]!==original);
    mode=0;p.render();check('Turning sound off stops rain immediately',()=>loop().length===0);
    mode=1;p.sfx('select');pulse();ac.state='suspended';pulse();check('Suspending audio releases the loop',()=>loop().length===0);
    ac.state='running';pulse();check('Running audio can restart the current rain',()=>loop().length===1);
    const count=ac.sources.length;p.dispose();p.dispose();pulse();p.sfx('hit');document.dispatchEvent(new Event('visibilitychange'));
    check('Dispose is idempotent and releases the timer, context and loop',()=>intervals.size===0&&ac.closed===1&&loop().length===0&&ac.sources.length===count);
    let oldMode=0;const old=make({tracks:{},mode:()=>oldMode,setMode:v=>oldMode=v,musicKey:()=>null});old.cycle();pulse();
    check('Existing games without a rain callback remain compatible',()=>AudioDouble.instances[1].sources.length===0);old.dispose();
    window.AudioContext=undefined;window.webkitAudioContext=undefined;let quiet=0;const noAudio=make({tracks:{},mode:()=>quiet,setMode:v=>quiet=v,musicKey:()=>null,rain:()=>1});noAudio.cycle();pulse();noAudio.dispose();
    check('Browsers without Web Audio remain safe and silent',()=>intervals.size===0);
  }finally{
    players.forEach(p=>p.dispose());window.AudioContext=saved.AudioContext;window.webkitAudioContext=saved.webkitAudioContext;window.setInterval=saved.setInterval;window.clearInterval=saved.clearInterval;
    if(saved.hidden)Object.defineProperty(document,'hidden',saved.hidden);else delete document.hidden;
  }
  return checks;
}
document.querySelector('#run').addEventListener('click',()=>{
  const button=document.querySelector('#run');button.disabled=true;
  try{const checks=soundChecks(),fail=checks.filter(c=>!c.ok);document.querySelector('#results').replaceChildren(...checks.map(c=>{const li=document.createElement('li');li.className=c.ok?'pass':'fail';li.textContent=(c.ok?'PASS':'FAIL')+' — '+c.label;return li;}));
    const summary=document.querySelector('#summary');summary.className=fail.length?'fail':'pass';summary.textContent=fail.length?'FAIL — '+fail.length+' of '+checks.length+' failed.':'PASS — '+checks.length+' shared sound checks.';
  }catch(e){document.querySelector('#summary').textContent='FAIL — '+e.message;}finally{button.disabled=false;}
});
