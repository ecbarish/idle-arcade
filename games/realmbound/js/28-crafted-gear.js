'use strict';
/* R5: reliable level-55 rares made from guild supplies, commissioned in the Smithy. */
const GUILD_GEAR_LEVEL=55;
const GUILD_GEAR_COST={head:[18,6],chest:[24,8],legs:[20,6],feet:[12,4],hands:[12,4],weapon:[30,12],offhand:[18,8],trinket:[20,12]};
const GUILD_GEAR_PREFIX={warrior:'Hearthguard',rogue:'Duskthread',mage:'Emberscript',priest:'Hearthlight',hunter:'Trailwoven'};
const GUILD_GEAR_SLOT={head:'Hood',chest:'Coat',legs:'Leggings',feet:'Boots',hands:'Gloves',weapon:'Weapon',offhand:'Off-hand',trinket:'Keepsake'};
function guildGearItem(cls,slot){
  if(!CLASSES[cls]||!GUILD_GEAR_COST[slot])return null;
  const k=CLASSES[cls],weapon=k.weap[0],names={sword:'Longblade',dagger:'Dirk',staff:'Staff',mace:'Hammer',bow:'Longbow',shield:'Shield',tome:'Fieldbook'};
  const part=slot==='weapon'?names[weapon]:slot==='offhand'?names[k.off]:slot==='chest'?({mail:'Hauberk',leather:'Tunic',cloth:'Robe'}[k.armor[0]]):slot==='head'&&k.armor[0]==='mail'?'Coif':GUILD_GEAR_SLOT[slot];
  const item=genItem(GUILD_GEAR_LEVEL,3,slot,{cls,type:slot==='weapon'?weapon:undefined,name:GUILD_GEAR_PREFIX[cls]+' '+part});
  item.crafted=true;return item;
}
function guildGearCost(slot,cls){
  const supplies=GUILD_GEAR_COST[slot],item=guildGearItem(cls||H()?.cls,slot);if(!supplies||!item)return null;
  return {ore:supplies[0],herb:supplies[1],money:Math.ceil(item.value*1.25)};
}
function guildGearProblem(slot){
  const h=H();if(!h||!GUILD_GEAR_COST[slot])return 'There is no pattern for that piece.';
  if(h.lvl<GUILD_GEAR_LEVEL)return 'Guild commissions open at level 55.';
  if(!guildOn())return 'Found a guild before commissioning its equipment.';
  if(!inTown()||h.dun||TOWN.inside!=='smith')return 'Visit the Smith inside the Smithy.';
  if(h.mode==='auto')return 'Switch to Focus to choose your commission.';
  if(h.bags.length>=16)return 'Make room in your bags before commissioning a piece.';
  const c=guildGearCost(slot),b=S.bank||{};
  if(!(b.ore>=c.ore)||!(b.herb>=c.herb))return 'Needs '+c.ore+' ore and '+c.herb+' herbs from the shared guild bank.';
  if(!(h.money>=c.money))return 'The Smith’s fee is '+moneyTxt(c.money)+'.';
  return '';
}
function craftGuildGear(slot){
  const why=guildGearProblem(slot);if(why){err(why);return false;}
  const h=H(),cost=guildGearCost(slot),item=guildGearItem(h.cls,slot);
  // All checks precede every debit; equipment remains in the bags until the player equips it.
  bank().ore-=cost.ore;bank().herb-=cost.herb;h.money-=cost.money;h.bags.push(item);
  line('The Smith places ['+item.name+'] in your bags.','l-loot');slog('Commissioned '+item.name+' from the guild’s supplies.');sfx('loot');save();return item;
}
function removeGuildGearPreview(){SCN.el.querySelector('.guild-craft-preview')?.remove();}
function guildGearDialogue(n,line,choices,done,preview){
  if(RTALK||!H()||TOWN.inside!=='smith'||H().mode==='auto')return false;
  const hero=H(),account=S,state={cancelled:false};let settled=false;
  SCN.play([[n.name,line]],choice=>{
    if(settled||state.cancelled)return;settled=true;removeGuildGearPreview();SCN.el.classList.remove('town-service-dialogue');
    if(S!==account||H()!==hero||TOWN.inside!=='smith'||!inTown()||hero.mode==='auto')return;
    done(choice);
  },{choices});RTALK.townService=true;RTALK.serviceState=state;C.lastInput=C.run;TOWN.auto=null;SCN.el.classList.add('town-service-dialogue');
  if(preview){const card=document.createElement('div');card.className='guild-craft-preview';card.setAttribute('role','status');card.innerHTML=preview;SCN.el.querySelector('.dlg-choices').before(card);}
  SCN.el.scrollIntoView({block:'center'});return true;
}
function openGuildGear(n,page){
  page=page||0;const slots=[['weapon','offhand','trinket'],['head','chest','legs'],['feet','hands']][page];if(!slots)return false;
  return guildGearDialogue(n,'Bring the ore and herbs your guild gathered. I will make a sound piece for the road ahead. Take a look at the patterns first.',slots.map(s=>GUILD_GEAR_SLOT[s]).concat(['More patterns','Back to services']),choice=>{
    if(choice<slots.length)previewGuildGear(n,slots[choice],page);
    else if(choice===slots.length)openGuildGear(n,(page+1)%3);
    else talkTownService(n);
  });
}
function previewGuildGear(n,slot,page){
  const item=guildGearItem(H().cls,slot),cost=guildGearCost(slot),why=guildGearProblem(slot),b=S.bank||{};
  if(!item||!cost)return false;
  const stat=Object.entries(item.stats).map(([key,value])=>'+'+value+' '+STAT_NAME[key]).join(' · ');
  const detail='<b class="r3">'+item.name+'</b><div>Rare · Item level 55 · '+(item.atype||item.wtype||item.otype||'Trinket')+'</div><div>'+stat+(item.armor?' · '+item.armor+' Armour':'')+(item.wmin?' · '+item.wmin+'–'+item.wmax+' Weapon damage · '+item.speed+'s swing':'')+'</div><div><b>Cost:</b> '+cost.ore+' ore · '+cost.herb+' herbs · '+moneyTxt(cost.money)+'</div><div><b>Available:</b> '+(b.ore||0)+' ore · '+(b.herb||0)+' herbs · '+moneyTxt(H().money)+'</div>'+(why?'<div class="craft-unavailable">'+why+'</div>':'');
  return guildGearDialogue(n,'This is the finished pattern. Nothing leaves your purse or the guild’s stores until you ask me to make it.',why?['Back to patterns']:['Commission this piece','Back to patterns'],choice=>{
    if(!why&&choice===0){const made=craftGuildGear(slot);if(made)guildGearDialogue(n,'There. Made to carry you further. You will find it in your pack; try it on when you are ready.',['Back to patterns','Back to services'],c=>c===0?openGuildGear(n,page):talkTownService(n));else previewGuildGear(n,slot,page);}
    else openGuildGear(n,page);
  },detail);
}
