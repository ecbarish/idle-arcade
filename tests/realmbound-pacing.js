/* Diagnostic player for L7b/R8. Load only in a fresh localhost browser context. */
function rbPacingClick(act,arg='') {
  const el=document.createElement('button'); el.dataset.act=act; el.dataset.arg=String(arg);
  document.body.append(el); el.click(); el.remove();
}
function rbPacingStart(cls,pace='classic') {
  S=emptyS(); const hero=newHero('Pacing','concord','human',cls); hero.pace=pace;
  S.chars=[hero,...Array.from({length:5},(_,i)=>newHero('Worker '+i,'concord','human','warrior'))];
  S.cur=hero.id; boot(); accept(QUESTS[hero.zone][0].id);
  window.RB_PACING={cls,pace,levels:[{level:1,minutes:0}],systems:{},lastLevel:1,nextPolicy:0,end:null,level60Minutes:null};
  ROSTER.assign(S.chars[1].id,'mine'); ROSTER.assign(S.chars[2].id,'herb'); ROSTER.assign(S.chars[3].id,'quest');
}
function rbPacingSnapshot() {
  const h=H(),p=window.RB_PACING;
  return {...p,hours:h.stats.play/3600,level:h.lvl,zone:h.zone,stats:{...h.stats},money:h.money,
    quests:{...h.quests.done},active:h.quests.active.slice(),talents:{...h.talents},party:h.party.map(id=>({cls:npcOf(id).cls,aff:npcOf(id).aff})),
    gear:Object.fromEntries(Object.entries(h.gear).map(([slot,it])=>[slot,{ilvl:it.ilvl,rar:it.rar,dur:it.dur}])),
    addons:h.addons,bank:{...bank()},guild:guildOn()?{level:G().level,xp:G().xp,members:Object.keys(G().members).length}:null,
    pets:h.pets.map(p=>({lvl:p.lvl,bond:p.bond,happy:p.happy})),riding:h.riding,dungeons:h.drecords};
}
function rbPacingPolicy() {
  const h=H(),p=window.RB_PACING,mark=key=>{if(p.systems[key]===undefined)p.systems[key]=h.stats.play/60;};
  // Use earned loot; inventory space and actual trips to town are part of this run.
  for(const it of h.bags.slice())if(it.slot&&score(it)>score(h.gear[it.slot]))equip(it.id,false);
  for(const it of h.bags.slice())if(it.mountItem)rbPacingClick('learnmount',it.id);
  checkAddons(); for(const key of Object.keys(h.addons.unl))if(key!=='lfg')h.addons.on[key]=true;
  for(const id of h.quests.active.slice())if(qState(ALLQ[id])==='ready'){
    const rewards=qReward(ALLQ[id]);turnIn(id,score(rewards[0])>=score(rewards[1])?0:1,false);
  }
  for(const q of QUESTS[h.zone])if(h.quests.active.length<3&&qState(q)==='avail'&&q.lvl<=h.lvl+1)accept(q.id);
  while(talentPoints()>0){const t=TALENT_LIST[h.cls].find(t=>(h.talents[t.id]||0)<t.max&&(!t.req||treePoints(t.ti)>=t.req));if(!t)break;rbPacingClick('talent',t.id);mark('talents');}
  if(C.enc){const n=npcOf(C.enc.id);encAct('wave');
    const needed=n&&(ROLE_OF[n.cls]==='heal'&&!h.party.some(id=>npcOf(id).cls==='priest')||ROLE_OF[n.cls]==='tank'&&!h.party.some(id=>npcOf(id).cls==='warrior'));
    if(h.party.length===4&&needed){const old=h.party.find(id=>ROLE_OF[npcOf(id).cls]==='dps');if(old)rbPacingClick('kick',old);}
    if(h.party.length<4)encAct('invite');else if(C.enc&&C.enc.kind==='fighting')encAct('help');
  }
  if(h.party.length)mark('companions');
  if(petOf()){mark('pet');if(petOf().happy<55)feedPet(null,false);if(petOf().hp<=0&&C.phase!=='fight')rbPacingClick('revive');}
  if(h.dun&&dungeonStats(h.dun.id).best>=h.dun.tier)leaveDungeon('The first clear is complete; return to the story.');
  if(C.phase!=='fight'&&!h.dun){
    for(const member of C.party.slice())if(member.dead&&affLvl(member.n)>=1){rbPacingClick('kick',member.id);rbPacingClick('invite',member.id);}
    const worn=SLOTS.some(slot=>h.gear[slot]&&h.gear[slot].dur<30); if(worn&&!useKit(false)&&C.phase!=='town'&&!inTown())goTown();
    if(h.bags.length>=12&&C.phase!=='town'&&!inTown())goTown();
    if(inTown()){
      for(const it of h.bags.slice())if(!it.food||h.bags.filter(x=>x.food).length>5)sellItem(it.id);
      repairAll(false); if(h.cls==='hunter'&&h.bags.filter(it=>it.food).length<3)buyFood(false);
      rbPacingClick('buyriding');
      const mount=MOUNT_SHOP[h.faction].slice().reverse().find(m=>m.lvl<=h.lvl&&!h.mounts.some(x=>x.key===m.key)&&h.money>=m.cost);
      if(mount)rbPacingClick('buymount',mount.key);if(h.riding&&activeMount())mark('riding');
      if(!guildOn()&&!foundProblem())foundGuild('The Measured Road');
      if(guildOn())mark('guild');leaveTown();
    }
    const next=ZONE_ORDER[h.faction].filter(id=>ZONES[id].lv[0]<=h.lvl).at(-1);
    if(next!==h.zone&&C.phase!=='town'&&QUESTS[h.zone].every(q=>h.quests.done[q.id])){
      for(const id of h.quests.active.slice())if(ALLQ[id].zone===h.zone)abandon(id);
      rbPacingClick('zone',next);
    }
    const dungeon=Object.entries(DUNGEONS).find(([id,d])=>d.zone===h.zone&&h.lvl>=d.minLvl+2&&dungeonStats(id).clears===0);
    if(dungeon&&C.phase!=='town'){
      LFG={id:dungeon[0],tier:0,sel:[]};rbPacingClick('lfgfill');rbPacingClick('lfgenter');
    }
  }
  if(h.lvl>=60&&h.quests.done.ch14&&!h.dun&&C.phase!=='fight'&&C.phase!=='town'&&!inTown()) {
    const id=['rootrot','heartwood'].find(id=>dungeonStats(id).best<1);
    if(id){const d=DUNGEONS[id];if(h.zone!==d.zone)rbPacingClick('zone',d.zone);
      LFG={id,tier:1,sel:[]};rbPacingClick('lfgfill');rbPacingClick('lfgenter');}
  }
  supplyTick(); while(bank().ore>=KIT_ORE)craftKit(); while(bank().herb>=POTION_HERBS)craftPotion();
  if(guildOn()){
    if(ROSTER.jobOf(S.chars[3].id)!=='guard'){ROSTER.stop(S.chars[3].id);ROSTER.assign(S.chars[3].id,'guard');}
    for(const c of S.chars.slice(4))if(ROSTER.free()&&!ROSTER.jobOf(c.id))ROSTER.assign(c.id,'quest');
  }
  if(h.dun&&h.dun.wipes>=4){p.end='dungeon strategy exhausted: '+h.dun.id;}
}
function rbPacingChunk(ticks=36000,maxHours=120) {
  const p=window.RB_PACING,h=H();
  for(let i=0;i<ticks&&!p.end;i++){
    if(h.lvl>=60&&p.level60Minutes===null)p.level60Minutes=h.stats.play/60;
    if(h.lvl>=60&&h.quests.done.ch14&&['rootrot','heartwood'].every(id=>dungeonStats(id).best>=1)){if(h.dun)leaveDungeon('Measured clears complete.');p.end='complete';break;}
    if(h.stats.play>=maxHours*3600){p.end='time limit';break;}
    if(h.lvl!==p.lastLevel){p.lastLevel=h.lvl;p.levels.push({level:h.lvl,minutes:h.stats.play/60,deaths:h.stats.deaths,quests:h.stats.quests});}
    if(C.phase==='loot')lootAll();
    if(C.run>=p.nextPolicy){p.nextPolicy=C.run+1;rbPacingPolicy();}
    C.lastInput=C.run;
    if(C.phase==='fight'&&C.mob){
      if(h.cls==='hunter'&&!h.pets.length&&canTame()&&!tameBlock())startTame();
      if(C.win.dodge>0&&C.surge)dodgeNow();if(C.win.combo>0)doCombo(true);
      const a=aiList().find(a=>canUse(a,true));if(a)useAb(a,true);
    }
    window.RB_PACING_CLOCK+=.1;step(.1);
  }
  return rbPacingSnapshot();
}
