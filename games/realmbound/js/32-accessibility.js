'use strict';
/* Named destinations use the existing tap-to-walk pathfinder. No teleport or new save fields. */
(() => {
 const scene=document.querySelector('#scene');scene.setAttribute('role','img');scene.setAttribute('aria-describedby','zoneName zoneSub status');
 const surroundings=document.createElement('details');surroundings.className='realm-surroundings';surroundings.hidden=true;
 surroundings.innerHTML='<summary>Look around</summary><div></div>';document.querySelector('.world').append(surroundings);
 let destinations=[],lastKey='';const original=updateWorld;
 updateWorld=function(){original();
   const visible=townActive()&&!RTALK&&!modalKind&&!realmNotebookOpen();surroundings.hidden=!visible;
   if(!visible){surroundings.open=false;return;}
   destinations=townPeople().map(n=>({label:'Walk to '+n.name,at:n.at}));
   if(!TOWN.inside)destinations.push(...townBuildings().map(b=>({label:'Walk to '+buildingName(b),at:[b.door,b.y+b.h-1]})));
   const rows=TOWN.map.rows;let exit=null;for(let y=0;y<rows.length&&!exit;y++)for(let x=0;x<rows[y].length;x++)if(rows[y][x]==='G'){exit=[x,y];break;}if(exit)destinations.push({label:TOWN.inside?'Walk to the door':'Walk to the road',at:exit});
   const key=JSON.stringify(destinations);if(key===lastKey)return;lastKey=key;
   const list=surroundings.querySelector('div');list.replaceChildren();destinations.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.textContent=d.label;b.dataset.destination=i;list.append(b);});
 };
 surroundings.addEventListener('click',e=>{const b=e.target.closest('[data-destination]');if(!b||!townActive()||RTALK||modalKind||realmNotebookOpen())return;const d=destinations[Number(b.dataset.destination)];if(d){TOWN.auto=null;TOWN_WALK.held=[];TOWN_WALK.walkTo(...d.at);surroundings.open=false;}});
})();
