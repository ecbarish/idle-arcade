/* X3 before/after review pictures; use a fresh context for every page and never read player saves. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.argv[2]||'.'),out=path.resolve(process.argv[3]||'/tmp/ow-pictures');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let file=path.join(root,new URL(req.url,'http://localhost').pathname);if(file.endsWith('/'))file+='index.html';fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(resolve=>server.listen(0,'localhost',resolve));
 const browser=await chromium.launch({headless:true});
 try{
 for(const [width,height]of [[375,812],[1366,768]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:'+server.address().port+'/games/otherworld/');
  await page.waitForFunction(()=>window.__ow);
  await page.waitForTimeout(500);
  await page.screenshot({path:path.join(out,width+'x'+height+'-archivist.png')});
  for(const [label,node,index]of [['hesta','a_guild',0],['mira','a_mira',0],['pocket-tower','a_tower',2],['guild-master','a_tower',4],['voss','a_council',0],['pocket-walls','a_walls',1]]){
   await page.evaluate(({node,index})=>{
    window.eval("S=fresh();S.name='Ren';S.life={world:'asterhold',gift:'pocket',name:'Ren',flags:{bolts:true},at:'a_tower',silver:0,status:false,mem:{}};panel().hidden=true;");
    window.__ow.run(node);document.querySelector('#status').hidden=true;
    window.__ow.D.play([window.__ow.linesOf(window.__ow.NODES[node])[index]],null);
   },{node,index});
   await page.waitForTimeout(100);
   const layout=await page.evaluate(()=>{const r=document.querySelector('.dlg').getBoundingClientRect();return {fits:!document.querySelector(".dlg").hidden&&r.width>0&&r.height>0&&r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1,overflow:document.documentElement.scrollWidth>innerWidth};});
   assert.ok(layout.fits&&!layout.overflow,width+' '+label+' fits viewport');
   await page.screenshot({path:path.join(out,width+'x'+height+'-'+label+'.png')});
  }
  assert.deepEqual(errors,[]);await context.close();
 }

 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
