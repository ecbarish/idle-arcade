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
      h.lvl=44;h.xp=0;rb.boot();rb.gainXP(rb.xpNeed(44)*10,false);
      check(h.lvl===45&&h.xp===0,'XP stops at level 45');
      check(h.npcs.every(n=>rb.npcZone(n)==='barrowfield'),'high-level companions visit the Barrowfields');
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
        rb.S.tab='quests';rb.boot(); // the check reads the Quests tab, whatever tab the save was left on
        check(document.body.textContent.includes('10/10 quests done in Frostmere'),'winter completion visible: '+faction);
        winter.grind='hushfang';rb.boot();rb.spawn();
        check(rb.C.mob.id==='hushfang'&&rb.C.mob.rar===4&&rb.C.mob.elite,'Hushfang spawns legendary: '+faction);
        rb.startTame();check(!!rb.C.taming,'Hushfang tame begins: '+faction);rb.finishTame();
        check(winter.pets.length===1&&winter.pets[0].family==='wolf'&&winter.pets[0].rar===4,'Hushfang joins stable: '+faction);
      }
      const barrows=rb.DUNGEONS.barrows,field=rb.ZONES.barrowfield;
      check(field.lv[0]===40&&field.lv[1]===45&&field.faction===null,'Barrowfields is a shared level 40-45 zone');
      check(field.mobs.length===6&&field.mobs.filter(m=>m.elite).length===1,'Barrowfields has five ordinary mobs and one elite');
      check(new Set(Object.values(rb.QUESTS).flat().map(q=>q.id)).size===Object.values(rb.QUESTS).flat().length,'quest IDs stay unique across chapters');
      check(rb.QUESTS.barrowfield.length===12,'Barrowfields has twelve quests');
      check(barrows.minLvl===42&&barrows.zone==='barrowfield','Silent Barrows unlocks at 42 in the Barrowfields');
      check(barrows.enc.filter(e=>!e.boss).length===4&&barrows.enc.filter(e=>e.boss).length===3,'Silent Barrows has four packs and three bosses');
      check(barrows.enc.at(-1).final&&barrows.enc.at(-1).name==='The Last Wayward'&&barrows.enc.at(-1).lvl===45,'Last Wayward is the level-45 finale');
      check(barrows.enc.every(e=>e.lvl>=42&&e.lvl<=45&&(!e.mech||Object.keys(e.mech).every(k=>['wave','surge','enrage','chill'].includes(k)))),'Barrows uses known encounter mechanics (Grave Chill added in T1-B)');
      check(barrows.enc.filter(e=>e.boss).every(e=>e.mech&&e.mech.chill>0),'every Barrows boss uses Grave Chill');
      for(const faction of ['concord','wild']){
        const b=rb.newHero('Barrowcheck',faction,faction==='concord'?'human':'grishar','hunter');
        rb.S.chars.push(b);rb.S.cur=b.id;
        Object.assign(b,{lvl:37,zone:'frostmere',xp:0});rb.boot();
        const travel=()=>document.querySelector('[data-act="zone"][data-arg="barrowfield"]').click();
        travel();check(b.zone==='frostmere','Barrowfields refuses travel at 37: '+faction);
        b.lvl=38;rb.boot();travel();rb.boot();
        check(b.zone==='barrowfield','Barrowfields accepts travel at 38: '+faction);
        check(document.querySelector('#zoneLore').textContent===field.lore,'Barrowfields lore visible: '+faction);
        check(document.body.textContent.includes(field.hub[faction]),'Barrowfields faction hub visible: '+faction);
        for(const n of b.npcs)n.offset=0;
        b.lvl=39;check(b.npcs.every(n=>rb.npcZone(n)==='frostmere'),'level-39 companions retain Frostmere: '+faction);
        b.lvl=40;check(b.npcs.every(n=>rb.npcZone(n)==='barrowfield'),'level-40 companions visit Barrowfields: '+faction);
        // Round-trip an old-cap save with completed quests and separate dungeon records.
        b.quests.done.fm10=true;b.drecords={sanctum:{clears:2,best:1,runs:3},foundry:{clears:1,best:0,runs:1}};
        rb.boot();rb.save();
        const resumed=rb.migrate(JSON.parse(localStorage.getItem('realmbound-save-v1')));
        const old=resumed.chars.find(c=>c.id===b.id);rb.S.chars=resumed.chars;rb.S.cur=old.id;rb.boot();
        check(old.lvl===40&&old.quests.done.fm10&&rb.dungeonStats('foundry').clears===1&&rb.dungeonStats('sanctum').best===1,'level-40 save preserves chapter and dungeon progress: '+faction);
        rb.gainXP(rb.xpNeed(40),false);
        check(old.lvl===41,'old level-40 save earns XP to 41: '+faction);
        old.lvl=45;rb.boot();
        for(const q of rb.QUESTS.barrowfield){
          old.bags=[];old.grind=null;
          check(q.type!=='collect'||field.mobs.find(m=>m.id===q.mob).drop,'collection target carries its quest item: '+q.id+' '+faction);
          check(!q.req||old.quests.done[q.req],'Barrowfields chain prerequisite completed: '+q.id+' '+faction);
          old.lvl=q.lvl-3;check(rb.qState(q)==='locked','quest locked below level-minus-two: '+q.id+' '+faction);
          old.lvl=q.lvl-2;check(rb.qState(q)==='avail','quest opens at level-minus-two: '+q.id+' '+faction);
          rb.accept(q.id);rb.boot();rb.spawn();
          check(old.quests.active.includes(q.id)&&rb.C.mob.id===q.mob,'Barrowfields quest accepted and selects target: '+q.id+' '+faction);
          old.quests.prog[q.id]=q.n;rb.turnIn(q.id,0,false);
          const i=faction==='concord'?0:1;
          check(old.quests.done[q.id]&&rb.C.lines.some(l=>l.txt.includes(q.giver[i]+': "'+q.done[i]+'"')),'Barrowfields turn-in voice: '+q.id+' '+faction);
          check(old.bags.length===1&&old.bags[0].ilvl===q.lvl+(q.elite?2:1)&&old.bags[0].rar===(q.elite?3:2),'Barrowfields exact scaled reward: '+q.id+' '+faction);
        }
        check(rb.QUESTS.barrowfield.at(-1).text.includes('Silent Barrows'),'last quest sends player to Silent Barrows: '+faction);
        old.lvl=45;old.grind='paleweft';rb.boot();rb.spawn();
        check(rb.C.mob.id==='paleweft'&&rb.C.mob.elite&&rb.C.mob.rar===4,'Paleweft spawns legendary: '+faction);
        rb.startTame();check(!!rb.C.taming,'Paleweft taming begins: '+faction);rb.finishTame();
        check(old.pets.some(p=>p.family==='spider'&&p.rar===4),'Paleweft joins Hunter stable: '+faction);
        old.grind=null;old.lvl=41;rb.boot();document.querySelector('[data-act="tab"][data-arg="friends"]').click();
        check(document.querySelector('[data-act="lfg"][data-arg="barrows"]').disabled,'Barrows group finder locked at 41: '+faction);
        old.lvl=42;rb.boot();document.querySelector('[data-act="tab"][data-arg="friends"]').click();
        check(!document.querySelector('[data-act="lfg"][data-arg="barrows"]').disabled,'Barrows appears enabled at 42 in its zone: '+faction);
        const team=old.npcs.slice(0,4).map(n=>n.id);
        old.zone='frostmere';rb.boot();rb.startDungeon(0,team,'barrows');
        check(!old.dun,'Barrows requires its own zone: '+faction);
        old.zone='barrowfield';rb.boot();rb.startDungeon(1,team,'barrows');
        check(!old.dun,'Barrows Heroic requires a normal clear: '+faction);
        rb.startDungeon(0,team,'barrows');
        check(old.dun&&old.dun.id==='barrows','Barrows normal entry at 42: '+faction);
        for(let i=0;i<barrows.enc.length;i++){
          old.dun.step=i;rb.spawnDungeon();const e=barrows.enc[i];
          check(rb.C.mob.name.includes(e.name)&&rb.C.mob.lvl===e.lvl&&rb.C.mob.boss===!!e.boss,'Barrows encounter identity: '+i+' '+faction);
        }
        rb.finishDungeon();
        check(rb.dungeonStats('barrows').clears===1&&rb.dungeonStats('barrows').best===0,'Barrows normal clear unlocks Heroic: '+faction);
        check(rb.dungeonStats('sanctum').best===1&&rb.dungeonStats('foundry').clears===1,'Barrows clear preserves other dungeon records: '+faction);
        rb.startDungeon(1,team,'barrows');
        check(old.dun.id==='barrows'&&old.dun.mods.length===1,'Barrows earned Heroic uses existing modifiers: '+faction);
        old.dun=null;rb.boot();rb.save();
      }
      // T1-A: two talent trees, roles from your build, capstones, respec
      for(const [cls,trees] of Object.entries(rb.TALENTS)){
        check(trees.length===2,'two talent trees: '+cls);
        trees.forEach(tr=>{const cap=tr.list.filter(t=>t.req===25),ranks=tr.list.filter(t=>t.req!==25).reduce((s,t)=>s+t.max,0);
          check(ranks===25&&cap.length===1&&cap[0].max===1,'25 ranks and one capstone: '+cls+' '+tr.tree);});
        const ids=rb.TALENT_LIST[cls].map(t=>t.id);check(new Set(ids).size===ids.length,'talent ids unique: '+cls);
      }
      check(Math.max(0,60-9)<2*26,'51 points at level 60 cannot reach both capstones');
      const tw=rb.newHero('Treecheck','concord','human','warrior');tw.lvl=45;rb.S.chars.push(tw);rb.S.cur=tw.id;rb.boot();
      check(rb.talentPoints()===36,'level 45 has 36 talent points to spend');
      check(rb.heroRole()==='tank','a warrior with no talents still tanks by default');
      tw.talents={cruelty:5,wmastery:3};rb.boot();check(rb.heroRole()==='dps','an Arms warrior deals damage in groups');
      tw.talents={cruelty:2,defiance:5,shieldspec:3};rb.boot();check(rb.heroRole()==='tank','a Protection warrior tanks');
      const learn=id=>{const b=document.createElement('button');b.dataset.act='talent';b.dataset.arg=id;document.body.appendChild(b);b.click();b.remove();};
      tw.talents={};rb.boot();learn('shieldwall');check(!tw.talents.shieldwall,'a capstone needs 25 points in its tree');
      learn('defiance');check(tw.talents.defiance===1,'second-tree talents can be learned');
      tw.talents={defiance:5,shieldspec:5,anticipation:5,toughened:5,shieldslam:1,impbulwark:4};rb.boot();learn('shieldwall');check(tw.talents.shieldwall===1,'capstone learnable at 25 points in its tree');
      check(rb.bar().some(a=>a.id==='shieldwall')&&rb.bar().some(a=>a.id==='shieldslam')&&!rb.bar().some(a=>a.id==='mortal'),'the bar shows learned talent abilities only');
      for(const [cls,trees] of Object.entries(rb.TALENTS)){const n=rb.newHero('Barcheck','concord','human',cls);n.lvl=60;rb.S.chars.push(n);rb.S.cur=n.id;rb.boot();
        const most=rb.bar().length+trees.flatMap(tr=>tr.list.filter(t=>t.key==='cap'&&t.req<25)).length+1;rb.S.chars=rb.S.chars.filter(c=>c!==n);
        check(most<=9,'every learnable ability fits keys 1-9: '+cls);}
      rb.S.cur=tw.id;rb.boot();
      tw.talents={};rb.boot();const hp0=rb.ST.hpMax;tw.talents={toughened:5};rb.boot();check(rb.ST.hpMax>hp0,'Toughened raises maximum health');
      tw.money=0;tw.freeRespecUsed=false;tw.talents={cruelty:3};rb.respec();check(!Object.keys(tw.talents).length,'the first reset after the new trees is free');
      tw.talents={cruelty:3};check(rb.respecCost()===10000,'the next reset costs 1 gold');rb.respec();check(tw.talents.cruelty===3,'no reset without the gold');
      tw.money=10000;rb.respec();check(!Object.keys(tw.talents).length&&tw.money===0,'a paid reset clears talents');
      tw.talents={cruelty:1};check(rb.respecCost()===20000,'resets in a row cost more');
      tw.lvl=30;tw.talents={cruelty:2};check(rb.respecCost()===0,'resets are free below level 40');
      rb.S.chars=rb.S.chars.filter(c=>c!==tw);
      // T1-B: Grave Chill in the Silent Barrows
      {const g=rb.newHero('Chillcheck','concord','human','priest');g.lvl=45;g.zone='barrowfield';g.talents={circle:1};rb.S.chars.push(g);rb.S.cur=g.id;rb.boot();
        g.party=g.npcs.slice(0,4).map(n=>n.id);syncParty();const C=rb.C,boss={name:'Test Wayward',hp:1e6,max:1e6,dmg:1,lvl:45,dots:{},armor:0,mech:{chill:5}};C.mob=boss;
        C.chill=0;for(const p of C.party){p.chill=0;p.hp=compStats(p.n).hpMax;}C.hp=rb.ST.hpMax;C.chillT=.05;C.chillTick=0;graveChill(boss,.1);
        check(C.chill===1&&partyAlive().every(p=>p.chill===1),'Grave Chill lays a stack on you and every companion');
        const hp0=C.hp;C.chillTick=.95;graveChill(boss,.1);check(C.hp<hp0,'Grave Chill hurts every second');
        const before=C.chill+partyAlive().reduce((s,p)=>s+p.chill,0);C.hp=1;healLowest(10,'Test');
        check(C.chill+partyAlive().reduce((s,p)=>s+p.chill,0)===before-1,'a heal takes one Grave Chill stack off');
        C.hp=rb.ST.hpMax;for(let i=0;i<10;i++){C.chillT=0;graveChill(boss,.001);}check(C.chill===5&&partyAlive().every(p=>p.chill===5),'Grave Chill stacks up to five');
        ABIL.priest.find(a=>a.id==='circle').fn();check(C.chill===0&&partyAlive().every(p=>!p.chill),'Circle of Light clears every stack');
        C.mob=null;rb.S.chars=rb.S.chars.filter(c=>c!==g);}
      // D2+D3: group kill XP is shared with classic bonuses; journey length scales all XP
      {const p=rb.newHero('Pacecheck','concord','human','warrior');p.lvl=30;p.xp=0;rb.S.chars.push(p);rb.S.cur=p.id;rb.boot();const C=rb.C;
        const share=n=>{p.party=p.npcs.slice(0,n).map(x=>x.id);syncParty();return groupXP(1000);};
        check(share(0)===1000,'a solo hero keeps all kill XP');check(share(1)===500,'a pair splits kill XP evenly');
        check(share(2)===389&&share(3)===325&&share(4)===280,'groups of 3, 4 and 5 share kill XP with the classic bonuses');
        p.party=[];syncParty();const xp0=p.xp;rb.gainXP(1000,false);check(p.xp-xp0===1000,'Classic journey gives XP as is');
        p.pace='breezy';const xp1=p.xp;rb.gainXP(1000,false);check(p.xp-xp1===1600,'Breezy gives 60% more XP');
        p.pace='long';const xp2=p.xp;rb.gainXP(1000,false);check(p.xp-xp2===600,'Long Road gives 40% less XP');
        const b=document.createElement('button');b.dataset.act='pace';b.dataset.arg='breezy';document.body.appendChild(b);b.click();b.remove();
        check(p.pace==='breezy','the Journal can change the journey length');
        rb.S.chars=rb.S.chars.filter(c=>c!==p);}
      // T21: every generated item category follows the widened name bands.
      check([...Object.values(MAT),...Object.values(WEAPONS).map(w=>w.names),...Object.values(OFFH),TRINKETS].every(names=>names.length===8&&new Set(names).size===8),'every tiered item list has eight distinct names');
      check(BLUE_PRE.length===17&&new Set(BLUE_PRE).size===17,'rare prefix pool retains seven names and adds ten distinct dungeon names');
      for(const [ilvl,tier] of [[1,0],[16,3],[25,4],[35,5],[45,6],[55,7]]){
        check(Object.entries(WEAPONS).every(([type,w])=>genItem(ilvl,1,'weapon',{cls:'warrior',type}).name===w.names[tier]),'weapon names use tier '+tier+' at item level '+ilvl);
        check(Object.entries(MAT).every(([atype,names])=>genItem(ilvl,1,'chest',{cls:'warrior',atype}).name.startsWith(names[tier]+' ')),'armor names use tier '+tier+' at item level '+ilvl);
        check(Object.entries(OFFH).every(([type,names])=>genItem(ilvl,1,'offhand',{cls:'warrior',type}).name===names[tier]),'off-hand names use tier '+tier+' at item level '+ilvl);
        check(genItem(ilvl,2,'trinket',{cls:'warrior',suffix:'bear'}).name===TRINKETS[tier]+' of the Bear','trinket names use tier '+tier+' at item level '+ilvl);
      }
      for(const [ilvl,tier] of [[5,0],[6,1],[10,1],[11,2],[15,2],[20,3],[21,4],[30,4],[31,5],[40,5],[41,6],[50,6],[51,7],[60,7],[61,7],[100,7]]){
        check(genItem(ilvl,1,'weapon',{cls:'warrior',type:'sword'}).name===WEAPONS.sword.names[tier]&&
          genItem(ilvl,1,'chest',{cls:'warrior',atype:'mail'}).name.startsWith(MAT.mail[tier]+' ')&&
          genItem(ilvl,1,'offhand',{cls:'warrior',type:'shield'}).name===OFFH.shield[tier]&&
          genItem(ilvl,2,'trinket',{cls:'warrior',suffix:'bear'}).name===TRINKETS[tier]+' of the Bear','item name boundary at level '+ilvl+' uses tier '+tier);
      }
      rb.S.cur=h.id;rb.boot();
      const oldBlade=genItem(45,1,'weapon',{cls:'warrior',type:'sword'});oldBlade.name='Tempered Longblade';rb.S.chars.find(c=>c.id===h.id).bags.push(oldBlade);rb.save();
      const saved=rb.migrate(JSON.parse(localStorage.getItem('realmbound-save-v1'))).chars.find(c=>c.id===h.id).bags.find(it=>it.id===oldBlade.id);
      check(saved.name==='Tempered Longblade'&&saved.ilvl===45,'saved high-level items retain their original generated names');
      rb.save();return checks;
    };
