'use strict';
/* T43: catalogue correspondences; local IDs, aliases, bodies, colors and combat remain authoritative.
   An Ashwing borrows a lizard silhouette; it is not Wildbond's bred Drakelet. */
const REACH_CATALOGUE = {
 zones:{
  thornvale:{wolf:['flintpup','Stone dust catches in the young coat; watch the ears before the teeth.'],boar:['thornback','The herd follows its tusks through thick briar. Give the young ones room.'],grizzle:['cairnhound','Grizzlemaw is one old Cairnhound; the scarred muzzle belongs to him alone.']},
  redsand:{lizard:['sunfrill','The frill catches the noon glare; shade is a better place to watch it.'],hyena:['screegrin','A laugh on the ridge often means another set of eyes below it.'],razor:['flintroot','Dust hides the stony hide; the tusks still cut leather.'],duneclaw:['dunepounce','Kraska keeps her own hunting ground; look for a second track beyond the dune.']},
  fens:{lurker:['bogbough','Its mossy back passes for a bank until the water moves against the wind.'],spider:['duskweaver','The dark silk is easiest to see with a low lantern, never bare fingers.']},
  ashen:{ashwolf:['blazefang','Cinders in the mane are a warning to keep brush away from your camp.'],ridgeboar:['flintroot','Black stone has grown into the tusks; the old trail belongs to the herd.'],slagscale:['ashskip','Hot scales leave a pale print on cooled slag.'],coalmaw:['kilntusk','Coalmaw carries a furnace breath; no other Kilntusk bears that name.']},
  frostmere:{rimewolf:['soundhowl','A winter coat muffles its steps; the cold breath reaches you first.'],snowboar:['orchardroot','Pale bristles hide a winter root-digger. Watch where the snow has turned.'],driftcat:['shalecat','The winter cat waits where stone breaks the drift.'],hushfang:['soundhowl','Hushfang watches the white road; his silence is not an invitation.']},
  barrowfield:{gravewolf:['cairnhound','Cold breath does not make this living wolf a Wayfolk spirit.'],barrowspider:['moorweft','Silk ties the cairn stones together; do not disturb a thread without watching its far end.'],paleweft:['pallweaver','Paleweft hunts the moving lamp. Set it down before trusting the dark.']},
  hollowcrown:{rotgnaw:['briarwatch','Sick green coats hide among the roots; the Crown has not made them harmless.'],thornridge:['thornback','Forked tusks part the briar, and the herd closes the trail behind them.'],giltweb:['cragskein','Gold silk catches canopy light; a shining thread can still hold a boot.'],ashwing:['ashskip','Gold-brown wings fold against warm scales; the canopy hoard is never left unwatched.'],veskareth:['ashskip','Veskareth watches the bough paths; gold catches along the edge of each old wing.']},
  crownheart:{crownfang:['briarwatch','Golden light has not healed the rot in this wolf\'s coat.'],hearttusk:['thornback','The heartwood tusks lift whole roots; keep a tree between you and the charge.'],veilweft:['cragskein','Its gilt cord crosses the path above eye level.'],broodguard:['ashskip','The Ashwing Broodguard puts its body between a stranger and the hoard.'],elderwing:['ashskip','The gilded elder has kept these signs longer than any hunter has read them.'],aurethyn:['ashskip','Aurethyn circles the inward canopy; the scars on that wing are older than our maps.']}
 },
 dungeons:{
  sanctum:{4:['bogbough','Her mossy scales hide the nursery edge; the young wait beneath her shadow.'],5:['bogsnap','The young lurkers lie just beneath the sanctum waterline.'],6:['ripplet','Ysh\'Kara is a great deep-water Ripplet; the old tide title remains its own.']},
  foundry:{3:['ashskip','The brood seeks warmth in the slag channels, not friendship with the forge.'],4:['cinderstitch','The Crucible Matron stitches hot silk between the foundry vents.']},
  barrows:{1:['moorweft','The brood joins stones with silk rather than mortar.'],4:['pallweaver','Selnith tends a living web across the old doorway, not a dead soul\'s chain.']},
  rootrot:{0:['briarwatch','These wolves follow the same rot-marked trails as their cousins above.'],3:['cragskein','Gold silk binds the hollow branches into a nursery.'],4:['cragskein','Ossavine measures the hollow with gold silk; every thread returns to its span.'],5:['ashskip','Rootwardens spread local Ashwing wings across the hollow\'s lower hoard.'],6:['ashskip','Arveth keeps the hoard below; its Ember lineage does not tell you its history.']},
  heartwood:{0:['cragskein','The vault brood lays gilt cord between the inward pillars.'],3:['thornback','Rootbreakers turn heartwood with the weight behind their tusks.'],4:['cragskein','Vaulkris wears its own gold veil; no ordinary spider keeps this chamber.'],5:['ashskip','Vaultwardens shelter their local Ashwing brood beneath the living ceiling.'],6:['ashskip','Orethul has kept the last hoard through many winters; its name is not a species name.']}
 }
};
function catalogueForMob(m,h=H()) {
 if(!m||m.kind!=='beast'||!h)return null;
 const entry=m.dun?REACH_CATALOGUE.dungeons[h.dun?.id]?.[Number(String(m.id).replace(/^dun/,''))]:REACH_CATALOGUE.zones[h.zone]?.[m.id];
 if(!entry||!CreatureCatalogue[entry[0]]||CreatureCatalogue[entry[0]].family!==m.fam)return null;
 return {id:entry[0],species:CreatureCatalogue[entry[0]],observation:entry[1],localName:m.name};
}
function renderCatalogueSighting() {
 const info=catalogueForMob(C?.mob),note=document.getElementById('catalogueSighting');
 note.hidden=!info||townActive();
 if(!info)return;
 note.style.top=Math.ceil(document.getElementById('tframe').getBoundingClientRect().bottom-document.querySelector('.world').getBoundingClientRect().top+8)+'px';
 const key=info.id+'|'+info.localName+'|'+info.observation;
 if(note.dataset.key!==key){note.replaceChildren();const name=document.createElement('strong');name.textContent=info.species.name;const text=document.createElement('span');text.textContent=info.observation;note.append(name,text);note.dataset.key=key;}
}
(()=>{
 const note=document.createElement('p');note.id='catalogueSighting';note.hidden=true;note.className='catalogue-sighting';note.setAttribute('aria-label','Hunter observation');$('.world').append(note);
 const before=updateWorld;updateWorld=function(){before();renderCatalogueSighting();};
})();