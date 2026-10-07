/* No game iframe, save writes, real CacheStorage writes or worker registration. */
'use strict';
document.querySelector('#run').addEventListener('click', async () => {
  const button=document.querySelector('#run'), results=document.querySelector('#results'), summary=document.querySelector('#summary');
  button.disabled=true; results.replaceChildren(); let passed=0,failed=0;
  const check=async(name,fn)=>{const row=document.createElement('li');try{await fn();row.className='pass';row.textContent='PASS '+name;passed++;}catch(e){row.className='fail';row.textContent='FAIL '+name+': '+e.message;failed++;}results.append(row);};
  const assert=(value,message='unexpected result')=>{if(!value)throw Error(message);};
  try {
    const base=new URL('../',location.href), source=await (await fetch(new URL('sw.js',base))).text(), responses=new Map();
    const prefix='idle-arcade-shell:'+base.href+':', version=source.match(/const CACHE_VERSION = '([^']+)'/)[1], current=prefix+version;
    function fixture({active=false,fail=null}={}) {
      const stores=new Map(), events={}, requests=[];let forced=0;
      const cacheAPI={keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name),open:async name=>{
        if(!stores.has(name))stores.set(name,new Map());const store=stores.get(name);
        return {put:async(url,response)=>store.set(url,response.clone()),match:async url=>store.get(url)?.clone()};
      }};
      const self={location:{href:new URL('sw.js',base).href},registration:{active},addEventListener:(name,fn)=>events[name]=fn,skipWaiting:()=>forced++,clients:{claim:()=>forced++}};
      const network=async request=>{requests.push(request);if(request.url.endsWith(fail||'__never__'))return new Response('',{status:503});if(!responses.has(request.url)){const r=await fetch(request);if(!r.ok)throw Error('Fixture file unavailable '+request.url);responses.set(request.url,r.clone());}return responses.get(request.url).clone();};
      new Function('self','caches','fetch','Request','URL',source)(self,cacheAPI,network,Request,URL);
      const run=async name=>{let task;events[name]({waitUntil:p=>task=p});await task;};
      const request=(url,options)=>{let task;events.fetch({request:new Request(new URL(url,base),options),respondWith:p=>task=p});return task;};
      return {stores,requests,run,request,forced:()=>forced};
    }
    const normal=fixture();
    await check('All four games and their current scripts prepare as one complete release',async()=>{await normal.run('install');const files=[...normal.stores.get(current).keys()];for(const game of ['primordial','starfall-guild','realmbound','wildbond'])assert(files.includes(new URL('games/'+game+'/index.html',base).href));assert(files.some(f=>f.endsWith('/js/14-diorama.js')));assert(files.some(f=>f.endsWith('/js/24-gm.js')));});
    await check('Preparation bypasses browser HTTP caches and the previous worker',()=>assert(normal.requests.every(r=>r.cache==='reload'&&r.headers.get('X-Arcade-Prepare')==='1')));
    await check('Remote dependencies and developer pages are excluded',()=>assert([...normal.stores.get(current).keys()].every(f=>f.startsWith(base.href)&&!f.includes('/tests/')&&!f.endsWith('/studio.html'))));
    await check('Directory and query navigation reuse the same release',async()=>{const before=normal.requests.length;const response=await normal.request('games/wildbond/?gm');assert((await response.text()).includes('Wildbond'));assert(normal.requests.length===before);});
    await check('Unknown local files pass through to the network',async()=>{await normal.request('tests/offline.html');assert(normal.requests.at(-1).url.endsWith('/tests/offline.html'));});
    await check('POST requests are never intercepted',()=>assert(normal.request('index.html',{method:'POST',body:'fixture'})===undefined));
    await check('Other origins are never intercepted',()=>assert(normal.request('https://example.org/index.html')===undefined));
    await check('The worker script always reaches the network',()=>assert(normal.request('sw.js')===undefined));
    await check('Release preparation always reaches the network',()=>assert(normal.request('index.html',{headers:{'X-Arcade-Prepare':'1'}})===undefined));
    await check('A failed install removes only its partial cache',async()=>{const broken=fixture({active:true,fail:'/games/wildbond/js/00-data.js'});broken.stores.set(prefix+'previous',new Map([['saved',new Response('old release')]]));let rejected=false;try{await broken.run('install');}catch(_){rejected=true;}assert(rejected);assert(!broken.stores.has(current));assert(broken.stores.get(prefix+'previous').has('saved'));});
    await check('A repeated release version cannot overwrite the active cache',async()=>{const same=fixture({active:true});const saved=new Map([['saved',new Response('active release')]]);same.stores.set(current,saved);let rejected=false;try{await same.run('install');}catch(_){rejected=true;}assert(rejected&&same.stores.get(current)===saved&&same.requests.length===0);});
    await check('Activation removes old releases only within this arcade scope',async()=>{normal.stores.set(prefix+'previous',new Map());normal.stores.set('unrelated-app',new Map());normal.stores.set('idle-arcade-shell:https://example.org/other/:one',new Map());await normal.run('activate');assert(!normal.stores.has(prefix+'previous'));assert(normal.stores.has(current)&&normal.stores.has('unrelated-app')&&normal.stores.has('idle-arcade-shell:https://example.org/other/:one'));});
    await check('Updates never force control of an open game',()=>assert(normal.forced()===0));
    await check('Manifest launch paths and icons resolve inside the arcade',async()=>{const manifest=await(await fetch(new URL('manifest.webmanifest',base))).json();assert(manifest.scope==='./'&&manifest.start_url==='./index.html'&&manifest.display==='standalone');for(const icon of manifest.icons){assert(new URL(icon.src,base).href.startsWith(base.href));assert((await fetch(new URL(icon.src,base))).ok);}assert(manifest.icons.some(i=>i.sizes==='192x192')&&manifest.icons.some(i=>i.sizes==='512x512'));});
  } catch(e) {failed++;const row=document.createElement('li');row.className='fail';row.textContent='FAIL setup: '+e.message;results.append(row);}
  finally {summary.textContent=(failed?'FAIL':'PASS')+': '+passed+' checks passed, '+failed+' failed.';button.disabled=false;}
});
