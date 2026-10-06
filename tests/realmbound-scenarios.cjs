module.exports = function scenarios() {
      const rb = window.__rb, checks = [];
      const check = (ok, label) => {if(!ok)throw Error(label);checks.push(label);};
      const h = rb.newHero('Testhero','concord','human','warrior');
      Object.assign(h,{lvl:20,zone:'fens',xp:0});
      h.dstats={clears:5,best:2,runs:7};
      h.dun={tier:1,step:2,mods:[],wipes:0};
      rb.S.chars=[h];rb.S.cur=h.id;rb.boot();
      check(h.dun.id==='sanctum','old dungeon run gains Sanctum identity');
      check(rb.dungeonStats('sanctum').best===2,'old Sanctum Heroic progress preserved');
      check(rb.dungeonStats('foundry').best===-1,'Foundry progression starts locked');
      h.dun=null;rb.boot();rb.gainXP(rb.xpNeed(20),false);
      check(h.lvl===21,'previously capped hero levels to 21');
      for(const [zone,qs] of Object.entries(rb.QUESTS))for(const q of qs){
        check(rb.ZONES[zone].mobs.some(m=>m.id===q.mob),'quest target exists: '+q.id);
        check(!q.req||Object.values(rb.QUESTS).flat().some(p=>p.id===q.req),'quest prerequisite exists: '+q.id);
      }
      h.zone='ashen';h.lvl=30;rb.boot();
      for(const q of rb.QUESTS.ashen){
        check(rb.qState(q)==='avail','quest available: '+q.id);
        rb.accept(q.id);h.quests.prog[q.id]=q.n;rb.turnIn(q.id,0,false);
        check(h.quests.done[q.id],'quest completed: '+q.id);
      }
      h.lvl=39;h.xp=0;rb.boot();rb.gainXP(rb.xpNeed(39)*10,false);
      check(h.lvl===40&&h.xp===0,'XP stops at level 40');
      check(h.npcs.every(n=>rb.npcZone(n)==='frostmere'),'high-level companions visit Frostmere');
      h.lvl=27;for(const n of h.npcs)n.offset=0;
      check(h.npcs.every(n=>rb.npcZone(n)==='ashen'),'level-27 companions still visit Ashen Ridge');
      h.lvl=30;rb.boot();
      const party=h.npcs.slice(0,4).map(n=>n.id);
      rb.startDungeon(1,party,'foundry');check(!h.dun,'uncleared Foundry cannot enter Heroic');
      rb.startDungeon(0,[party[0],party[0],party[1],party[2]],'foundry');check(!h.dun,'duplicate party rejected');
      h.zone='fens';rb.startDungeon(0,party,'foundry');check(!h.dun,'Foundry requires Ashen Ridge');
      h.zone='ashen';rb.startDungeon(0,party,'foundry');check(h.dun.id==='foundry','Foundry normal entry');
      rb.spawnDungeon();check(rb.C.mob.name.startsWith('Foundry Overseers'),'Foundry uses its own encounters');
      for(let i=0;i<rb.DUNGEONS.foundry.enc.length;i++){h.dun.step=i;rb.spawnDungeon();check(rb.C.mob.name.includes(rb.DUNGEONS.foundry.enc[i].name),'Foundry encounter '+i);}
      rb.finishDungeon();
      check(rb.dungeonStats('foundry').clears===1&&rb.dungeonStats('foundry').best===0,'Foundry clear unlocks Heroic 1');
      check(rb.dungeonStats('sanctum').clears===5&&rb.dungeonStats('sanctum').best===2,'Foundry clear leaves Sanctum record intact');
      rb.startDungeon(1,party,'foundry');check(h.dun.tier===1&&h.dun.mods.length===1,'earned Foundry Heroic entry with modifier');
      h.dun=null;h.zone='fens';rb.boot();rb.startDungeon(3,party,'sanctum');check(h.dun.id==='sanctum','migrated Sanctum Heroic unlock usable');
      const hunter=rb.newHero('Ashhunter','wild','grishar','hunter');hunter.lvl=30;hunter.zone='ashen';hunter.grind='coalmaw';
      rb.S.chars.push(hunter);rb.S.cur=hunter.id;rb.boot();rb.spawn();
      check(rb.C.mob.id==='coalmaw'&&rb.C.mob.rar===4,'Coalmaw spawns as a legendary tameable beast');
      rb.startTame();check(!!rb.C.taming,'Hunter can begin taming Coalmaw');rb.finishTame();
      check(hunter.pets.length===1&&hunter.pets[0].family==='boar'&&hunter.pets[0].rar===4,'Coalmaw joins the Hunter stable with legendary rarity');
      const legacy=rb.migrate({hero:hunter,last:1234});check(legacy.chars.length===1&&legacy.cur===hunter.id,'legacy single-hero save migrates');
      for(const faction of ['concord','wild']){
        const winter=rb.newHero('Wintercheck',faction,faction==='concord'?'human':'grishar','hunter');
        winter.lvl=40;winter.zone='frostmere';rb.S.chars.push(winter);rb.S.cur=winter.id;rb.boot();
        check(document.querySelector('#zoneLore').textContent.includes(rb.ZONES.frostmere.lore),'Frostmere lore visible: '+faction);
        check(document.body.textContent.includes(rb.ZONES.frostmere.hub[faction]),'correct winter hub visible: '+faction);
        const chain=rb.QUESTS.frostmere;
        for(const q of chain){
          winter.bags=[];
          check(rb.qState(q)==='avail','winter quest available: '+q.id+' '+faction);
          rb.accept(q.id);rb.spawn();
          check(rb.C.mob.id===q.mob,'winter quest selects target: '+q.id+' '+faction);
          winter.quests.prog[q.id]=q.n;rb.turnIn(q.id,0,false);
          const voice=q.done[faction==='concord'?0:1],speaker=q.giver[faction==='concord'?0:1];
          check(winter.quests.done[q.id]&&rb.C.lines.some(l=>l.txt.includes(speaker+': "'+voice+'"')),'winter turn-in voice: '+q.id+' '+faction);
          check(winter.bags.length===1&&winter.bags[0].ilvl>=q.lvl,'winter reward scales: '+q.id+' '+faction);
        }
        rb.boot();
        check(document.body.textContent.includes('10/10 quests done in Frostmere'),'winter completion visible: '+faction);
        winter.grind='hushfang';rb.boot();rb.spawn();
        check(rb.C.mob.id==='hushfang'&&rb.C.mob.rar===4&&rb.C.mob.elite,'Hushfang spawns legendary: '+faction);
        rb.startTame();check(!!rb.C.taming,'Hushfang tame begins: '+faction);rb.finishTame();
        check(winter.pets.length===1&&winter.pets[0].family==='wolf'&&winter.pets[0].rar===4,'Hushfang joins stable: '+faction);
      }
      rb.S.cur=h.id;rb.boot();rb.save();return checks;
    };
