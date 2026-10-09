/* Every check in the arcade with one command (docs/learning/saves-and-testing.md).
   Opens the eight browser test pages in a hidden browser, presses "Run checks" on each and reads the result, then
   (when Godot is found) runs both Godot suites. Prints one line per suite and exits 1 if anything failed.

     node tools/run-all-checks.cjs                  every suite
     node tools/run-all-checks.cjs wildbond starfall  only the suites whose names contain these words
     GODOT=C:\Users\evanb\Godot\Godot_v4.7.2-stable_win64_console.exe node tools/run-all-checks.cjs

   Needs Node and the playwright package (npm i -g playwright). On Windows it uses the installed Chrome;
   elsewhere Playwright's own Chromium (CHROME_PATH overrides both). GitHub runs this on every push and pull
   request (.github/workflows/checks.yml). No game saves are touched: every page runs in a fresh browser context. */
const http=require('http'),fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const PAGES=['run','wildbond','starfall','sound','offline','diamond','otherworld','runner-safety'];
const GODOT_SUITES=['wildbond-godot','starfall-godot'];
const only=process.argv.slice(2);
const wanted=name=>!only.length||only.some(w=>name.includes(w));
if(only.length&&!PAGES.concat(GODOT_SUITES).some(wanted)){console.error('No suite matches: '+only.join(' ')+'. Suites: '+PAGES.concat(GODOT_SUITES).join(', '));process.exit(2);}
const TYPES={'.html':'text/html','.js':'text/javascript','.cjs':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ogg':'audio/ogg','.wav':'audio/wav','.mp3':'audio/mpeg','.mp4':'video/mp4','.wasm':'application/wasm','.pck':'application/octet-stream','.webmanifest':'application/manifest+json','.ico':'image/x-icon','.txt':'text/plain','.md':'text/plain'};

function serve(){return new Promise(ok=>{const server=http.createServer((req,res)=>{
  let p=decodeURIComponent(new URL(req.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';
  const file=path.join(ROOT,p);if(!file.startsWith(ROOT)){res.writeHead(403);return res.end();}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.writeHead(200,{'Content-Type':TYPES[path.extname(file)]||'application/octet-stream'});res.end(data);});
 });server.listen(0,'localhost',()=>ok(server));});}

function browserPath(){
  if(process.env.CHROME_PATH)return process.env.CHROME_PATH;
  const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
  return process.platform==='win32'&&fs.existsSync(chrome)?chrome:undefined;
}

function findGodot(){
  if(process.env.GODOT)return process.env.GODOT;
  const dir='C:/Users/evanb/Godot';
  if(process.platform==='win32'&&fs.existsSync(dir)){const exe=fs.readdirSync(dir).find(f=>/console\.exe$/i.test(f));if(exe)return path.join(dir,exe);}
  return null;
}

(async()=>{
  const results=[];
  const pages=PAGES.filter(wanted);
  if(pages.length){
    const {chromium}=require('playwright');
    const server=await serve(),origin='http://localhost:'+server.address().port;
    const browser=await chromium.launch({executablePath:browserPath(),headless:true});
    try{for(const name of pages){
      const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage(),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const started=Date.now();let line;
      try{
        await page.goto(origin+'/tests/'+name+'.html');
        await page.click('#run');
        await page.waitForFunction(()=>/^(PASS|FAIL)/.test(document.querySelector('#summary').textContent),null,{timeout:15*60*1000,polling:500});
        line=(await page.textContent('#summary')).trim();
      }catch(e){line='FAIL: the page did not finish ('+e.message.split('\n')[0]+')';}
      const ok=line.startsWith('PASS');
      if(!ok){const fails=await page.$$eval('#results .fail',els=>els.slice(0,10).map(el=>el.textContent)).catch(()=>[]);fails.forEach(f=>console.log('    '+f));errors.slice(0,5).forEach(e=>console.log('    page error: '+e));}
      results.push({name:'tests/'+name+'.html',ok,line,secs:Math.round((Date.now()-started)/1000)});
      console.log((ok?'ok  ':'FAIL')+'  tests/'+name+'.html  '+line+'  ('+results.at(-1).secs+'s)');
      await context.close();
    }}finally{await browser.close();server.close();}
  }
  const suites=GODOT_SUITES.filter(wanted);
  if(suites.length){
    const godot=findGodot();
    if(!godot){console.log((process.env.CI?'FAIL':'skip')+'  Godot suites: Godot not found (set GODOT to the console executable)');if(process.env.CI)results.push({name:'godot',ok:false});}
    else for(const project of suites){
      const dir=path.join(ROOT,project);
      if(!fs.existsSync(path.join(dir,'.godot')))spawnSync(godot,['--headless','--path',dir,'--import'],{encoding:'utf8',timeout:600000});
      const run=spawnSync(godot,['--headless','--path',dir,'-s','tests/run_tests.gd'],{encoding:'utf8',timeout:600000});
      const out=(run.stdout||'')+(run.stderr||'');
      const total=(out.match(/checks: .*/)||['no result line'])[0];
      const scriptErrors=out.split('\n').filter(l=>/SCRIPT ERROR|Parse Error/.test(l));
      const ok=run.status===0&&!scriptErrors.length;
      if(!ok){out.split('\n').filter(l=>/^FAIL/.test(l)).slice(0,10).forEach(l=>console.log('    '+l));scriptErrors.slice(0,5).forEach(l=>console.log('    '+l));}
      results.push({name:project,ok,line:total});
      console.log((ok?'ok  ':'FAIL')+'  '+project+'  '+total);
    }
  }
  const failed=results.filter(r=>!r.ok);
  console.log(failed.length?'\n'+failed.length+' of '+results.length+' suites FAILED.':'\nAll '+results.length+' suites pass.');
  process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
