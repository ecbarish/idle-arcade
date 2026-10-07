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
      h.lvl=59;h.xp=0;rb.boot();rb.gainXP(rb.xpNeed(59)*10,false);
      check(h.lvl===60&&h.xp===0,'XP stops at level 60');
      check(h.npcs.every(n=>rb.npcZone(n)==='crownheart'),'high-level companions visit the Crown heart');
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
      // T22: the Hollow Crown, old level-45 saves and Rootrot Hollow.
      {
        const crown=rb.ZONES.hollowcrown,rootrot=rb.DUNGEONS.rootrot,chain=rb.QUESTS.hollowcrown;
        check(crown.name==='The Hollow Crown'&&crown.lv[0]===45&&crown.lv[1]===52&&crown.faction===null,'Hollow Crown is a shared level 45-52 zone');
        check(crown.hub.concord==='Thornmantle Camp'&&crown.hub.wild===crown.hub.concord,'both factions share Thornmantle Camp');
        check(crown.lore.includes('empty throne')&&crown.lore.includes('Sundering')&&crown.lore.includes('Ashwing'),'Hollow Crown lore follows the Wayfolk and Ashwing story');
        check(crown.mobs.length===6&&crown.mobs.filter(m=>m.elite).length===1,'Hollow Crown has five ordinary mobs and one elite');
        check(crown.mobs.every(m=>m.lv[0]>=45&&m.lv[1]<=52&&m.lv[0]<=m.lv[1]),'Hollow Crown mob bands stay within 45-52');
        check(crown.mobs.find(m=>m.id==='ashwing').fam==='lizard'&&crown.mobs.find(m=>m.id==='hollowroot').kind==='humanoid','drakes and treants use existing visual kinds');
        check(['wolf','spider','boar'].every(fam=>crown.mobs.some(m=>m.fam===fam&&!m.elite)),'rotting wood contains wolves, spiders and boars');
        check(new Set(Object.values(rb.ZONES).flatMap(z=>z.mobs.map(m=>m.id))).size===Object.values(rb.ZONES).flatMap(z=>z.mobs).length,'surface mob IDs stay unique');
        check(chain.length===12&&chain.every((q,i)=>q.id==='hc'+(i+1)&&q.lvl>=45&&q.lvl<=52),'twelve hc quests cover levels 45-52');
        check(chain.every(q=>Array.isArray(q.giver)&&q.giver.length===2&&q.giver.every(Boolean)&&Array.isArray(q.done)&&q.done.length===2&&q.done.every(Boolean)),'all Hollow Crown quests have paired givers and turn-in voices');
        check(chain.every(q=>['kill','collect'].includes(q.type)&&q.n>0&&(!q.req||(chain.findIndex(p=>p.id===q.req)>=0&&chain.findIndex(p=>p.id===q.req)<chain.indexOf(q)))),'Hollow Crown objectives and prerequisite order are valid');
        check(chain.at(-1).text.includes('Rootrot Hollow')&&chain.at(-1).text.includes('Seraveth'),'final quest points to the dungeon and the later Crown heart');
        const elite=crown.mobs.find(m=>m.elite);
        check(elite.id==='veskareth'&&elite.rare&&elite.lv[0]===52&&elite.lv[1]===52&&elite.fam==='lizard','Veskareth is a level-52 legendary tameable drake');
        check(rootrot.name==='Rootrot Hollow'&&rootrot.minLvl===49&&rootrot.zone==='hollowcrown','Rootrot opens at 49 in the Hollow Crown');
        check(rootrot.enc.filter(e=>!e.boss).length===4&&rootrot.enc.filter(e=>e.boss).length===3,'Rootrot has four packs and three bosses');
        check(rootrot.enc.every(e=>e.lvl>=49&&e.lvl<=52&&(!e.mech||Object.keys(e.mech).every(k=>['wave','surge','enrage'].includes(k)))),'Rootrot uses existing warm-wood mechanics, without Grave Chill');
        check(rootrot.enc.at(-1).final&&rootrot.enc.at(-1).lvl===52&&!rootrot.enc.some(e=>e.name.includes('Seraveth')),'level-52 Rootrot finale leaves Seraveth for the later chapter');
        for(const faction of ['concord','wild']){
          const c=rb.newHero('Crowncheck',faction,faction==='concord'?'human':'grishar','hunter');rb.S.chars.push(c);rb.S.cur=c.id;
          Object.assign(c,{lvl:42,zone:'barrowfield',xp:0});for(const n of c.npcs)n.offset=0;rb.boot();
          const travel=()=>document.querySelector('[data-act="zone"][data-arg="hollowcrown"]').click();
          travel();check(c.zone==='barrowfield','Hollow Crown refuses travel at 42: '+faction);
          c.lvl=43;rb.boot();travel();rb.boot();
          check(c.zone==='hollowcrown','Hollow Crown accepts travel at 43: '+faction);
          check(document.querySelector('#zoneLore').textContent===crown.lore,'Hollow Crown lore visible: '+faction);
          check(document.body.textContent.includes('Thornmantle Camp'),'shared camp visible: '+faction);
          c.lvl=44;check(c.npcs.every(n=>rb.npcZone(n)==='barrowfield'),'level-44 companions retain Barrowfields: '+faction);
          c.lvl=45;check(c.npcs.every(n=>rb.npcZone(n)==='hollowcrown'),'level-45 companions visit Hollow Crown: '+faction);
          c.zone='barrowfield';c.quests.done.bf12=true;c.drecords={sanctum:{clears:2,best:1,runs:3},foundry:{clears:1,best:0,runs:1},barrows:{clears:1,best:0,runs:1}};
          rb.boot();rb.save();const resumed=rb.migrate(JSON.parse(localStorage.getItem('realmbound-save-v1')));
          const old=resumed.chars.find(h=>h.id===c.id);rb.S.chars=resumed.chars;rb.S.cur=old.id;rb.boot();
          check(old.lvl===45&&old.zone==='barrowfield'&&old.quests.done.bf12&&rb.dungeonStats('barrows').clears===1&&rb.dungeonStats('sanctum').best===1,'level-45 save preserves chapter, zone and separate dungeon records: '+faction);
          rb.gainXP(rb.xpNeed(45),false);check(old.lvl===46,'old level-45 save earns XP to 46: '+faction);
          travel();rb.boot();
          for(const q of chain){
            old.bags=[];old.grind=null;
            check(q.type!=='collect'||crown.mobs.find(m=>m.id===q.mob).drop,'Hollow Crown collection target has its item: '+q.id+' '+faction);
            if(q.req){delete old.quests.done[q.req];old.lvl=52;check(rb.qState(q)==='locked','Hollow Crown prerequisite actually gates quest: '+q.id+' '+faction);old.quests.done[q.req]=true;}
            old.lvl=q.lvl-3;check(rb.qState(q)==='locked','Hollow Crown quest locked below level-minus-two: '+q.id+' '+faction);
            old.lvl=q.lvl-2;check(rb.qState(q)==='avail','Hollow Crown quest opens at level-minus-two: '+q.id+' '+faction);
            questOffer(q.id);check(!!RTALK&&RTALK.lines[0][1]===q.text&&RTALK.choices.length===2,'Hollow Crown voiced offer and choices: '+q.id+' '+faction);
            SCN.choose(0);rb.boot();rb.spawn();
            check(old.quests.active.includes(q.id)&&rb.C.mob.id===q.mob,'Hollow Crown quest accepts and selects target: '+q.id+' '+faction);
            old.quests.prog[q.id]=q.n;rb.turnIn(q.id,0,false);const i=faction==='concord'?0:1;
            check(old.quests.done[q.id]&&rb.C.lines.some(l=>l.txt.includes(q.giver[i]+': "'+q.done[i]+'"')),'Hollow Crown turn-in voice: '+q.id+' '+faction);
            questThanks(q.id);check(!!RTALK&&RTALK.lines[0][1]===q.done[i],'Hollow Crown portrait thanks uses faction voice: '+q.id+' '+faction);SCN.skip();
            check(old.bags.length===1&&old.bags[0].ilvl===q.lvl+(q.elite?2:1)&&old.bags[0].rar===(q.elite?3:2),'Hollow Crown exact scaled reward: '+q.id+' '+faction);
          }
          rb.S.tab='quests';rb.boot();check(document.body.textContent.includes('12/12 quests done in The Hollow Crown'),'Hollow Crown completion visible: '+faction);
          old.lvl=52;old.grind=elite.id;rb.boot();rb.spawn();
          check(rb.C.mob.id===elite.id&&rb.C.mob.elite&&rb.C.mob.rar===4,'Veskareth spawns legendary: '+faction);
          rb.startTame();check(!!rb.C.taming,'Veskareth taming begins: '+faction);rb.finishTame();
          check(old.pets.some(p=>p.family==='lizard'&&p.rar===4),'Veskareth joins Hunter stable: '+faction);
          old.grind=null;old.lvl=48;rb.boot();document.querySelector('[data-act="tab"][data-arg="friends"]').click();
          check(document.querySelector('[data-act="lfg"][data-arg="rootrot"]').disabled,'Rootrot group finder locked at 48: '+faction);
          const team=old.npcs.slice(0,4).map(n=>n.id);rb.startDungeon(0,team,'rootrot');check(!old.dun,'Rootrot entry rejected below level 49: '+faction);
          old.lvl=49;rb.boot();document.querySelector('[data-act="tab"][data-arg="friends"]').click();
          check(!document.querySelector('[data-act="lfg"][data-arg="rootrot"]').disabled,'Rootrot group finder enabled at 49: '+faction);
          old.zone='barrowfield';rb.boot();rb.startDungeon(0,team,'rootrot');check(!old.dun,'Rootrot requires its own zone: '+faction);
          old.zone='hollowcrown';rb.boot();rb.startDungeon(1,team,'rootrot');check(!old.dun,'Rootrot Heroic requires a normal clear: '+faction);
          rb.startDungeon(0,team,'rootrot');check(old.dun&&old.dun.id==='rootrot','Rootrot normal entry at 49: '+faction);
          for(let i=0;i<rootrot.enc.length;i++){old.dun.step=i;rb.spawnDungeon();const e=rootrot.enc[i];check(rb.C.mob.name.includes(e.name)&&rb.C.mob.lvl===e.lvl&&rb.C.mob.boss===!!e.boss,'Rootrot encounter identity: '+i+' '+faction);}
          rb.finishDungeon();check(rb.dungeonStats('rootrot').clears===1&&rb.dungeonStats('rootrot').best===0,'Rootrot clear unlocks Heroic: '+faction);
          check(rb.dungeonStats('sanctum').best===1&&rb.dungeonStats('foundry').clears===1&&rb.dungeonStats('barrows').clears===1,'Rootrot clear preserves earlier dungeon records: '+faction);
          rb.startDungeon(1,team,'rootrot');check(old.dun.id==='rootrot'&&old.dun.mods.length===1,'Rootrot earned Heroic uses existing modifiers: '+faction);
          old.dun=null;rb.boot();rb.save();
        }
      }
      // T23: the Crown's Heart, Hollow Key gates and the existing raid unlock.
      {
        const z=rb.ZONES.crownheart,d=rb.DUNGEONS.heartwood,qs=rb.QUESTS.crownheart,elite=z.mobs.find(m=>m.elite);
        check(z.name==="The Crown's Heart"&&z.lv[0]===52&&z.lv[1]===60&&z.faction===null,'Crown heart is a shared 52-60 zone');
        check(z.hub.concord==='Heartwatch Camp'&&z.hub.wild===z.hub.concord,'both factions share the inward camp');
        check(['Seraveth','Hollow Throne','Hollow Key','Silent Barrows','Rootrot Hollow'].every(t=>z.lore.includes(t)),'Crown heart lore names the attunement and occupied throne');
        check(Object.values(ZONE_ORDER).every(r=>r.at(-1)==='crownheart'&&r.at(-2)==='hollowcrown'),'both routes append Crown heart');
        check(z.mobs.length===7&&z.mobs.filter(m=>m.elite).length===1,'six ordinary Crown heart mobs and one elite');
        check(z.mobs.every(m=>m.lv[0]>=52&&m.lv[1]<=60&&m.lv[0]<=m.lv[1]),'Crown heart mob bands remain within 52-60');
        check(['wolf','boar','spider','lizard'].every(f=>z.mobs.some(m=>m.fam===f))&&z.mobs.some(m=>m.kind==='humanoid'),'Crown heart mob roles use existing families and treant kind');
        check(new Set(Object.values(rb.ZONES).flatMap(z=>z.mobs.map(m=>m.id))).size===Object.values(rb.ZONES).flatMap(z=>z.mobs).length,'all surface mob IDs remain unique');
        check(elite.id==='aurethyn'&&elite.rare&&elite.fam==='lizard'&&elite.lv.every(l=>l===60),'Aurethyn is a legendary tameable level-60 drake');
        check(qs.length===14&&qs.every((q,i)=>q.id==='ch'+(i+1)&&q.lvl>=52&&q.lvl<=60),'fourteen ch quests cover levels 52-60');
        check(qs.every(q=>q.giver.length===2&&q.done.length===2&&q.giver.every(Boolean)&&q.done.every(Boolean)),'all Crown heart quests have faction givers and turn-in voices');
        check(qs.every(q=>['kill','collect'].includes(q.type)&&q.n>0&&(!q.req||qs.findIndex(p=>p.id===q.req)<qs.indexOf(q)&&qs.some(p=>p.id===q.req))),'Crown heart objectives and prerequisite chains are valid');
        check(qs.slice(-3).every(q=>q.attune&&JSON.stringify(q.needDun)==='["barrows","rootrot"]')&&qs[11].req==='ch11'&&qs[12].req==='ch12'&&qs[13].req==='ch13','three Hollow Key quests require both dungeon clears and chained predecessors');
        check(qs[13].done.every(t=>t.includes('Hollow Key')&&t.includes('Hollow Throne')&&t.includes('Seraveth')),'final voices hand over the Key and point to the existing raid');
        check(d.name==='The Heartwood Vault'&&d.minLvl===56&&d.zone==='crownheart','Heartwood opens at 56 in Crown heart');
        check(d.enc.filter(e=>!e.boss).length===4&&d.enc.filter(e=>e.boss).length===3,'Heartwood has four packs and three bosses');
        check(d.enc.every(e=>e.lvl>=56&&e.lvl<=60&&(!e.mech||Object.keys(e.mech).every(k=>['wave','surge','enrage'].includes(k)))),'Heartwood uses existing warm-wood mechanics');
        check(d.enc.at(-1).final&&d.enc.at(-1).lvl===60&&d.enc.at(-1).hpM>=13&&d.enc.at(-1).hpM<=14&&!d.enc.some(e=>e.name.includes('Seraveth')),'Heartwood final boss is tougher than Arveth and is not Seraveth');
        check(TRACKS.crownheart.mel.split(' ').length===32&&TRACKS.crownheart.mel.split(' ').every(n=>n==='.'||ArcadeSound.hz(n)>0),'Crown heart has an original valid 32-note tune');
        for(const faction of ['concord','wild']){
          const c=rb.newHero('Heartcheck',faction,faction==='concord'?'human':'grishar','hunter');rb.S.chars.push(c);rb.S.cur=c.id;
          Object.assign(c,{lvl:49,zone:'hollowcrown',xp:0});for(const n of c.npcs)n.offset=0;rb.boot();
          const travel=()=>document.querySelector('[data-act="zone"][data-arg="crownheart"]').click();
          travel();check(c.zone==='hollowcrown','Crown heart refuses travel at 49: '+faction);
          c.lvl=50;rb.boot();travel();rb.boot();check(c.zone==='crownheart','Crown heart accepts travel at 50: '+faction);
          check(document.querySelector('#zoneLore').textContent===z.lore&&document.body.textContent.includes('Heartwatch Camp'),'inward camp and lore visible: '+faction);
          c.lvl=51;check(c.npcs.every(n=>rb.npcZone(n)==='hollowcrown'),'51 companions retain Outer Wood: '+faction);
          c.lvl=52;check(c.npcs.every(n=>rb.npcZone(n)==='crownheart'),'52 companions visit Crown heart: '+faction);
          c.zone='hollowcrown';c.quests.done.hc12=true;c.drecords={barrows:{clears:1,best:0,runs:1},rootrot:{clears:1,best:1,runs:2}};rb.boot();rb.save();
          const resumed=rb.migrate(JSON.parse(localStorage.getItem('realmbound-save-v1'))),old=resumed.chars.find(h=>h.id===c.id);rb.S.chars=resumed.chars;rb.S.cur=old.id;rb.boot();
          check(old.lvl===52&&old.zone==='hollowcrown'&&old.quests.done.hc12&&rb.dungeonStats('rootrot').best===1&&rb.dungeonStats('barrows').clears===1,'old level-52 save retains quests and dungeon records: '+faction);
          rb.gainXP(rb.xpNeed(52),false);check(old.lvl===53,'old level-52 save resumes XP to 53: '+faction);travel();rb.boot();check(musicKey()==='crownheart','new zone selects its tune: '+faction);
          for(const q of qs){
            old.bags=[];old.grind=null;
            check(q.type!=='collect'||z.mobs.find(m=>m.id===q.mob).drop,'collection target has an item: '+q.id+' '+faction);
            if(q.req){delete old.quests.done[q.req];old.lvl=60;check(rb.qState(q)==='locked','actual prerequisite gates: '+q.id+' '+faction);old.quests.done[q.req]=true;}
            if(q.attune){
              for(const [b,r] of [[0,0],[1,0],[0,1]]){rb.dungeonStats('barrows').clears=b;rb.dungeonStats('rootrot').clears=r;old.lvl=60;check(rb.qState(q)==='locked','Hollow Key requires both clears '+b+'/'+r+': '+q.id+' '+faction);rb.accept(q.id);check(!old.quests.active.includes(q.id),'locked attunement cannot be accepted: '+q.id+' '+faction);}
              rb.dungeonStats('barrows').clears=1;rb.dungeonStats('rootrot').clears=1;
            }
            old.lvl=q.lvl-3;check(rb.qState(q)==='locked','level below minus-two locks: '+q.id+' '+faction);old.lvl=q.lvl-2;check(rb.qState(q)==='avail','level minus-two opens: '+q.id+' '+faction);
            questOffer(q.id);check(!!RTALK&&RTALK.lines[0][1]===q.text&&RTALK.choices.length===2,'voiced offer: '+q.id+' '+faction);SCN.choose(0);rb.boot();rb.spawn();check(old.quests.active.includes(q.id)&&rb.C.mob.id===q.mob,'acceptance selects actual mob: '+q.id+' '+faction);
            old.quests.prog[q.id]=q.n;
            if(q.attune){rb.dungeonStats('rootrot').clears=0;check(rb.qState(q)==='locked','imported active attunement remains gated: '+q.id+' '+faction);rb.turnIn(q.id,0,false);check(!old.quests.done[q.id],'gated attunement cannot turn in: '+q.id+' '+faction);rb.dungeonStats('rootrot').clears=1;}
            if(q.id==='ch14')check(!raidKey(old),'raid remains locked until actual ch14 turn-in: '+faction);
            rb.turnIn(q.id,0,false);const i=faction==='concord'?0:1;check(old.quests.done[q.id]&&rb.C.lines.some(l=>l.txt.includes(q.giver[i]+': "'+q.done[i]+'"')),'faction completion voice: '+q.id+' '+faction);
            questThanks(q.id);check(!!RTALK&&RTALK.lines[0][1]===q.done[i],'portrait thanks: '+q.id+' '+faction);SCN.skip();
            check(old.bags.length===1&&old.bags[0].ilvl===q.lvl+(q.elite?2:1)&&old.bags[0].rar===(q.elite?3:2),'scaled quest reward: '+q.id+' '+faction);
          }
          check(raidKey(old)&&!old.hollowKey,'ch14 alone unlocks the existing raid: '+faction);
          rb.S.tab='quests';rb.boot();check(document.body.textContent.includes("14/14 quests done in The Crown's Heart"),'chapter completion visible: '+faction);
          old.lvl=60;old.grind=elite.id;rb.boot();rb.spawn();check(rb.C.mob.rar===4&&rb.C.mob.id===elite.id,'legendary drake spawns: '+faction);rb.startTame();check(!!rb.C.taming,'legendary taming begins: '+faction);rb.finishTame();check(old.pets.some(p=>p.family==='lizard'&&p.rar===4),'legendary joins stable: '+faction);
          old.grind=null;old.lvl=55;rb.boot();document.querySelector('[data-act="tab"][data-arg="friends"]').click();check(document.querySelector('[data-act="lfg"][data-arg="heartwood"]').disabled,'Heartwood LFG locked at 55: '+faction);
          const team=old.npcs.slice(0,4).map(n=>n.id);rb.startDungeon(0,team,'heartwood');check(!old.dun,'entry rejected at 55: '+faction);
          old.lvl=56;rb.boot();document.querySelector('[data-act="tab"][data-arg="friends"]').click();check(!document.querySelector('[data-act="lfg"][data-arg="heartwood"]').disabled,'Heartwood LFG enabled at 56: '+faction);
          old.zone='hollowcrown';rb.boot();rb.startDungeon(0,team,'heartwood');check(!old.dun,'Heartwood requires Crown heart: '+faction);
          old.zone='crownheart';rb.boot();rb.startDungeon(1,team,'heartwood');check(!old.dun,'Heartwood Heroic needs normal clear: '+faction);rb.startDungeon(0,team,'heartwood');check(old.dun&&old.dun.id==='heartwood','normal entry at 56: '+faction);
          for(let i=0;i<d.enc.length;i++){old.dun.step=i;rb.spawnDungeon();check(rb.C.mob.name.includes(d.enc[i].name)&&rb.C.mob.lvl===d.enc[i].lvl&&rb.C.mob.boss===!!d.enc[i].boss,'Heartwood encounter '+i+': '+faction);}
          rb.finishDungeon();check(rb.dungeonStats('heartwood').clears===1&&rb.dungeonStats('heartwood').best===0,'Heartwood clear unlocks Heroic: '+faction);check(rb.dungeonStats('barrows').clears===1&&rb.dungeonStats('rootrot').best===1,'Heartwood clear preserves earlier records: '+faction);
          rb.startDungeon(1,team,'heartwood');check(old.dun.id==='heartwood'&&old.dun.mods.length===1,'earned Heartwood Heroic: '+faction);old.dun=null;old.lvl=59;old.xp=0;rb.boot();rb.gainXP(rb.xpNeed(59)*10,false);check(old.lvl===60&&old.xp===0,'cap at 60 discards overflow: '+faction);rb.save();
        }
      }
      // T1-A + T1-C: three talent trees, roles from your build, capstones, respec
      for(const [cls,trees] of Object.entries(rb.TALENTS)){
        check(trees.length===3,'three talent trees: '+cls);
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
      // T1-C: the third trees, each with abilities and talents that change how you play
      {const third={warrior:'Fury',rogue:'Subtlety',mage:'Arcane',priest:'Discipline',hunter:'Survival'};
        for(const [cls,name] of Object.entries(third)){const tr=rb.TALENTS[cls][2];check(tr.tree===name,'third tree: '+cls+' '+name);
          check(tr.list.filter(t=>t.key==='cap').every(t=>ABIL[cls].some(a=>a.talent===t.id)),'every learnable ability in '+name+' exists');
          check(tr.list.filter(t=>t.key!=='cap'&&t.key!=='crit'&&t.key!=='dmg'&&t.key!=='hpPct'&&t.key!=='dodge'&&t.key!=='intPct'&&t.key!=='regenPct'&&t.key!=='heal').length>=2,name+' has at least two talents that change an ability or open a window');}
        check(rb.TALENTS.priest[2].role==='heal','Discipline is a healing tree');
        const t=rb.newHero('Thirdcheck','wild','duskelf','priest');t.lvl=60;rb.S.chars.push(t);rb.S.cur=t.id;rb.boot();
        t.talents={twindisc:5,atonement:5};rb.boot();check(rb.heroRole()==='heal','a Discipline priest heals in groups');
        rb.spawn();const C=rb.C;C.mob.max=C.mob.hp=1e7;C.hp=ST.hpMax*.5;const hp0=C.hp;ABIL.priest.find(a=>a.id==='smite').fn();check(C.hp>hp0,'Atonement: Holy Smite heals you when you are hurt worst');
        t.talents={atonement:5,twindisc:5,mentalstr:5,divfury:5,dgrace:4,penance:1,painsup:1};C.buffs={};rb.boot();const raw=ST.hpMax*.2;rb.spawn();rb.C.mob.max=rb.C.mob.hp=1e7;rb.C.hp=ST.hpMax;
        const before=rb.C.hp;hitHero(raw);const plain=before-rb.C.hp;rb.C.hp=ST.hpMax;rb.C.buffs.painsup={t:8};const b2=rb.C.hp;hitHero(raw);check(b2-rb.C.hp<plain*.75,'Pain Suppression cuts the damage you take');rb.C.buffs={};
        check(ABIL.priest.find(a=>a.id==='smite').cast()<2,'Divine Fury makes Holy Smite faster');
        t.cls='warrior';t.talents={rampage:4};rb.boot();rb.spawn();rb.C.mob.hp=rb.C.mob.max*.27;check(ABIL.warrior.find(a=>a.id==='finish').cond(),'Rampage lets Finishing Blow land below 30%');
        t.talents={};rb.boot();rb.spawn();rb.C.mob.hp=rb.C.mob.max*.27;check(!ABIL.warrior.find(a=>a.id==='finish').cond(),'without Rampage Finishing Blow still waits for 20%');
        t.cls='rogue';t.talents={shadowdance:1};rb.boot();rb.spawn();rb.C.mob.max=rb.C.mob.hp=1e7;rb.C.buffs.dance={t:8};openWin('opening',8);ABIL.rogue.find(a=>a.id==='backstab').fn();
        check(rb.C.win.opening>0,'Shadow Dance keeps the Backstab opening after a Backstab');rb.C.buffs={};
        t.cls='hunter';t.talents={lockload:1};rb.boot();rb.spawn();rb.C.buffs.lnl={t:12};check(ABIL.hunter.find(a=>a.id==='shot').cast()===0,'Lock and Load makes the next Steady Shot instant');
        rb.C.mob.max=rb.C.mob.hp=1e7;ABIL.hunter.find(a=>a.id==='shot').fn();check(!rb.C.buffs.lnl,'and is used up by that shot');
        t.cls='mage';t.talents={};rb.boot();rb.spawn();rb.C.mob.max=rb.C.mob.hp=1e7;const m0=dmgMods();rb.C.buffs.arcpower={t:15};check(dmgMods()>m0*1.3,'Arcane Power raises your damage');rb.C.buffs={};
        t.cls='priest';t.lvl=45;t.talents={twindisc:3};t.freeRespecUsed=true;delete t.freeTreesV;t.money=0;rb.boot();check(rb.respecCost()===0,'everyone gets one more free reset for the third trees');
        rb.respec();check(!Object.keys(t.talents).length&&t.freeTreesV===3,'that reset is used once');t.talents={twindisc:1};check(rb.respecCost()===10000,'later resets cost gold again');
        rb.S.chars=rb.S.chars.filter(c=>c!==t);rb.S.cur=tw.id;rb.boot();}
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
      // S1: quest givers speak in shared portrait scenes when you accept or turn in by hand
      {const s=rb.newHero('Scenecheck','wild','grishar','hunter');s.lvl=40;s.zone='barrowfield';rb.S.chars.push(s);rb.S.cur=s.id;rb.boot();
        const q=rb.QUESTS.barrowfield[0];questOffer(q.id);check(!!RTALK&&RTALK.lines[0][0]===giver(q)&&RTALK.choices.length===2,'Accept opens the giver\'s scene with two choices');
        SCN.choose(1);check(!RTALK&&!s.quests.active.includes(q.id),'"Not now" leaves the quest unaccepted');
        questOffer(q.id);SCN.choose(0);check(s.quests.active.includes(q.id),'"Accept" takes the quest');
        s.quests.prog[q.id]=q.n;rb.turnIn(q.id,0,false);questThanks(q.id);check(!!RTALK&&RTALK.lines[0][1]===q.done[1],'turning in plays the giver\'s thanks in their voice');
        SCN.skip();check(!RTALK,'a scene can be skipped');
        const a=giverLook('Pathkeeper Dorr'),b=giverLook('Pathkeeper Dorr');check(JSON.stringify(a)===JSON.stringify(b)&&a.tusks,'a giver always gets the same face, from their faction\'s peoples');
        rb.S.chars=rb.S.chars.filter(c=>c!==s);}
      // S2: the shared chiptune engine plays Realmbound's own music per zone, off by default
      {check(Object.keys(rb.ZONES).every(z=>SND.tracks[z]&&SND.tracks[z].mel.length)&&['dungeon','boss','ghost'].every(k=>SND.tracks[k]),'every zone, dungeons, bosses and the spirit walk have their own tune');
        check(Object.values(SND.tracks).every(t=>t.mel.concat(t.bass).every(n=>n==='.'||SND.hz(n)>0)),'every note in every tune is a real pitch');
        const g=rb.newHero('Soundcheck','concord','human','priest');g.zone='fens';rb.S.chars.push(g);rb.S.cur=g.id;rb.boot();const C=rb.C;
        check(musicKey()==='fens','out in the world the zone\'s tune plays');C.phase='dead';check(musicKey()==='ghost','after a death the spirit tune plays');C.phase='fight';
        g.dun={id:'x'};C.mob={boss:false};check(musicKey()==='dungeon','in a dungeon the dungeon tune plays');C.mob={boss:true};check(musicKey()==='boss','a boss gets its own tune');g.dun=null;C.mob=null;
        const was=rb.S.snd;delete rb.S.snd;SND.render();const btn=document.querySelector('#sndBtn');
        check(!!btn&&btn.textContent==='Sound: off','sound starts off, shown in the header');
        btn.click();check(rb.S.snd===1&&btn.textContent==='Sound: effects','the header button turns on effects');
        btn.click();check(rb.S.snd===2&&btn.textContent==='Sound: effects + music','and then music');
        let ok=true;try{for(const n of ['level','quest','lose','warn','dodge','loot','catch','win','blip'])sfx(n,n==='blip'?voiceOf('Pathkeeper Dorr'):undefined);}catch(e){ok=false;}
        check(ok,'every Realmbound sound effect plays without error');
        btn.click();check(rb.S.snd===0,'a third press turns sound off again');
        check(voiceOf('Pathkeeper Dorr')===voiceOf('Pathkeeper Dorr:happy')&&voiceOf('Pathkeeper Dorr')>=260&&voiceOf('Pathkeeper Dorr')<540,'each giver keeps one voice pitch whatever their mood');
        if(was===undefined)delete rb.S.snd;else rb.S.snd=was;rb.S.chars=rb.S.chars.filter(c=>c!==g);}
      // S3 + R1: the shared roster pays by the clock, and other heroes mine ore for the account's supply bank
      {const mk=(o)=>{const st={},got={n:0};return {st,got,R:Roster.create(Object.assign({get:()=>st,jobs:{dig:{every:()=>60,give:(w,n)=>{got.n+=n;}}},slots:()=>2},o||{}))};};
        const t0=1e12,H1=3600e3;
        const a=mk();a.R.assign('x','dig',t0);for(let t=t0;t<=t0+H1;t+=10e3)a.R.collect(t);
        const b=mk();b.R.assign('x','dig',t0);b.R.collect(t0+H1);
        check(a.got.n===60&&b.got.n===60,'an hour of work pays the same whether collected every few seconds or once on return');
        const c=mk();c.R.assign('x','dig',t0);c.R.collect(t0+20*H1);check(c.got.n===480,'time away is capped at 8 hours, like rested XP');
        c.R.collect(t0+20*H1+30e3);check(c.got.n===480,'after the cap the clock restarts from the return, not from the start');
        const d=mk();d.R.assign('x','dig',t0);d.R.collect(t0+90e3);const saved=JSON.parse(JSON.stringify(d.st));
        const d2=mk();Object.assign(d2.st,saved);d2.R.collect(t0+120e3);check(d.got.n===1&&d2.got.n===1,'a save made partway through a unit keeps the part-finished work after reloading');
        d2.R.collect(t0+120e3);check(d2.got.n===1,'collecting twice never pays twice');
        const e=mk({canWork:w=>w!=='me'});check(!e.R.assign('me','dig',t0),'the member being played can\'t take a job');
        e.R.assign('x','dig',t0);e.R.assign('y','dig',t0);check(!e.R.assign('z','dig',t0)&&e.R.free()===0,'jobs are limited to the open slots');
        check(e.R.stop('x',t0+150e3)===2&&!e.R.jobOf('x'),'stopping a job pays what was earned first');}
      {const A=rb.newHero('Supplya','concord','human','warrior');A.lvl=40;const B=rb.newHero('Supplyb','concord','stonekin','priest');B.lvl=20;
        const keep={bank:rb.S.bank,guild:rb.S.guild};rb.S.bank={ore:0,kit:0};rb.S.guild={jobs:{}};
        rb.S.chars.push(A,B);rb.S.cur=A.id;rb.boot();const bBags=JSON.stringify(B.bags);
        check(!ROSTER.assign(A.id,'mine')&&ROSTER.assign(B.id,'mine'),'only the heroes you aren\'t playing can mine');
        rb.S.guild.jobs[B.id].since-=3600e3;supplyTick();const per=JOBS.mine.every(B.id);
        check(rb.S.bank.ore===Math.floor(3600/per)&&per===400,'a level-20 miner sends about 9 ore an hour to the shared bank');
        rb.S.tab='supplies';renderTab(true);check(/Jobs board/.test(document.querySelector('#tabbody').innerHTML)&&/Supplyb/.test(document.querySelector('#tabbody').innerHTML),'the Supplies tab shows the bank and the jobs board');
        rb.S.bank.ore=7;check(craftKit()&&rb.S.bank.ore===1&&rb.S.bank.kit===1,'six ore make a repair kit');
        A.gear.weapon.dur=20;rb.C.run=100;rb.C.lastInput=100;A.mode='auto';afterFight();
        check(A.gear.weapon.dur===100&&rb.S.bank.kit===0&&rb.C.phase!=='town','Auto mends worn gear with a kit instead of walking to town');
        A.gear.weapon.dur=20;afterFight();check(rb.C.phase==='town','with no kits left Auto walks back to town as before');A.mode='focus';
        rb.S.guild.jobs[B.id].since-=1800e3;switchTo(B.id);
        check(!ROSTER.jobOf(B.id)&&rb.S.bank.ore===1+Math.floor(1800/per),'switching to a miner pays their work and takes them off the job');
        check(JSON.stringify(B.bags)===bBags,'heroes keep their own bags; nothing moves between characters');
        const old=rb.migrate({v:2,chars:[JSON.parse(JSON.stringify(A))],cur:A.id,last:Date.now(),tab:'quests'});check(!old.bank&&!old.guild,'saves from before supplies load unchanged');
        // more jobs: herbs and potions, questing for the worker's own XP
        const W=rb.newHero('Supplyw','concord','human','mage');W.lvl=30;rb.S.chars.push(W);rb.S.cur=A.id;rb.boot();
        check(ROSTER.assign(W.id,'herb')&&ROSTER.busy()===1,'a hero can gather herbs');rb.S.guild.jobs[String(W.id)].since-=3600e3;supplyTick();
        check(rb.S.bank.herb===Math.floor(3600/JOBS.herb.every(W.id)),'herbs arrive in the shared bank');
        rb.S.bank.herb=8;check(craftPotion()&&craftPotion()&&rb.S.bank.potion===2&&rb.S.bank.herb===0,'four herbs brew a healing potion');
        rb.spawn();rb.C.mob.max=rb.C.mob.hp=1e7;rb.C.hp=ST.hpMax*.25;rb.step(.1);check(rb.S.bank.potion===1&&rb.C.hp>ST.hpMax*.5,'below 30% health in a fight you drink a potion');
        rb.C.hp=ST.hpMax*.25;rb.step(.1);check(rb.S.bank.potion===1,'only one potion a minute');
        rb.C.cds.potion=0;rb.S.bank.autoPot=false;rb.C.hp=ST.hpMax*.25;rb.step(.1);check(rb.S.bank.potion===1,'potion drinking can be switched off');rb.S.bank.autoPot=true;rb.C.hp=ST.hpMax;rb.C.mob=null;rb.C.phase='seek';
        ROSTER.stop(W.id);const lv0=W.lvl,xp0=W.xp,need=rb.xpNeed(W.lvl);ROSTER.assign(W.id,'quest');rb.S.guild.jobs[String(W.id)].since-=3600e3;supplyTick();
        check(W.lvl===lv0&&W.xp-xp0===3*Math.round(need*.02)&&W.money>0,'an hour of questing gives the worker about 6% of a level and some coin');
        check((W.xp-xp0)/need<.1,'questing stays far slower than playing the hero');
        W.xp=rb.xpNeed(W.lvl)-1;rb.S.guild.jobs[String(W.id)].since-=1200e3;supplyTick();check(W.lvl===lv0+1,'questing workers can level up');
        rb.S.chars=rb.S.chars.filter(c=>c!==W);
        rb.S.cur=A.id;rb.boot();deleteChar(B.id);check(!rb.S.guild.jobs[B.id],'deleting a character takes them off the jobs board');
        rb.S.chars=rb.S.chars.filter(c=>c!==A&&c!==B);rb.S.bank=keep.bank;rb.S.guild=keep.guild;if(!keep.bank)delete rb.S.bank;if(!keep.guild)delete rb.S.guild;rb.S.tab='quests';}
      // R2: raids. The Hollow Throne: plans, raid calls, lockout, set loot (raid levels follow the level cap)
      {const th=RAIDS.throne,bosses=th.enc.filter(e=>e.boss);
        check(bosses.length===4&&bosses.every(e=>e.mech&&e.mech.raid&&e.plans.length>=2&&e.tell),'four raid bosses, each with a tell and plans');
        check(bosses.flatMap(e=>e.slots).sort().join()==='chest,feet,hands,head,legs','the bosses drop a full five-piece set between them');
        check(!rb.DUNGEONS.throne&&dungeonDef('throne')===th,'the raid is not listed among the 5-person dungeons');
        const R0=rb.newHero('Raidcheck','concord','human','warrior');R0.lvl=LEVEL_CAP;rb.S.chars.push(R0);rb.S.cur=R0.id;rb.boot();
        for(const n of R0.npcs){n.met=true;n.aff=AFFINITY[2].at;n.offset=Math.max(n.offset,-1);}
        check(/Hollow Key/.test(raidProblem(autoRaid()))&&!startRaid(),'the raid is sealed without the Hollow Key');R0.hollowKey=true;
        const few=R0.npcs.slice(0,5).map(n=>n.id);check(/nine/.test(raidProblem(few)),'a raid needs nine others');
        const healers=R0.npcs.filter(n=>ROLE_OF[n.cls]==='heal').map(n=>n.id),noheal=autoRaid().filter(id=>!healers.includes(id));
        const pool=R0.npcs.filter(n=>!healers.includes(n.id)&&!noheal.includes(n.id)).map(n=>n.id);const nh=noheal.concat(pool).slice(0,9);
        if(nh.length===9)check(/two healers/.test(raidProblem(nh)),'a raid needs two healers');
        const alt=rb.newHero('Altraider','concord','stonekin','priest');alt.lvl=LEVEL_CAP;rb.S.chars.push(alt);
        check(autoRaid().includes('alt'+alt.id)&&npcOf('alt'+alt.id).name==='Altraider','your other characters can join the raid');
        const prev=R0.party.slice();check(startRaid()&&R0.dun.raid&&R0.party.length===9&&rb.C.party.length===9,'Gather the raid starts a ten-person run');
        R0.mode='focus';R0.dun.step=1;rb.C.lastInput=rb.C.run;rb.C.t=0;rb.step(.1);check(rb.C.phase==='plan'&&modalKind==='raidplan','before a boss the raid stops for a plan');
        choosePlan(1);check(R0.dun.plans[1]===1&&rb.C.phase==='seek','choosing a plan sends the raid in');
        rb.C.t=0;rb.C.lastInput=rb.C.run;rb.step(.1);const boss=rb.C.mob;check(boss&&boss.boss&&boss.raidStep===1&&rb.C.plan.swapAt===5,'the boss fight uses the chosen plan');
        boss.max=boss.hp=1e9;rb.C.shred=4;rb.C.shredT=.05;rb.C.lastInput=rb.C.run;rb.step(.1);check(rb.C.tell&&rb.C.tell.kind==='swap','enough shred stacks call for a tank swap');
        raidCall('swap');rb.C.tell.t=0;rb.C.lastInput=rb.C.run;rb.step(.1);check(rb.C.shred===0&&!rb.C.tell,'calling Swap in time resets the stacks');
        const hp1=rb.C.hp;rb.C.tell={kind:'stack',t:0,called:null};rb.C.lastInput=rb.C.run;rb.step(.1);check(rb.C.hp<hp1-ST.hpMax*.2,'a missed Choir call hurts everyone');
        rb.C.hp=ST.hpMax;const hp2=rb.C.hp;rb.C.tell={kind:'spread',t:1,called:null};check(raidKeyPress('q')&&rb.C.tell.called==='spread','Q calls Spread');rb.C.tell.t=0;rb.C.lastInput=rb.C.run;rb.step(.1);check(rb.C.hp>hp2-ST.hpMax*.2,'the right call avoids it');
        check(autoCallChance()<.6,'without Raid Leader, Auto calls poorly');R0.dun.wipes=5;check(autoCallChance()>.6,'each wipe teaches the raid the fight');R0.dun.wipes=0;
        boss.hp=1;boss.lootN=2;rb.C.lastInput=rb.C.run;const items=raidLoot(boss);check(items.some(it=>it.set==='warrior'&&it.rar===4&&it.slot==='hands'&&/^Thornwarden/.test(it.name)),'bosses drop your class set');
        check(raidLock().killed.includes(1),'a killed boss is locked out');
        const hpA=(R0.gear.hands=items.find(i=>i.set),rb.boot(),ST.hpMax);R0.gear.feet=Object.assign(genItem(LEVEL_CAP+4,4,'feet',{cls:'warrior'}),{set:'warrior'});rb.boot();
        check(setPieces()===2&&ST.hpMax>hpA,'two set pieces give the two-piece bonus');
        leaveDungeon();check(!R0.dun&&R0.party.join()===prev.join(),'leaving the raid restores your old party');
        startRaid();R0.dun.step=1;rb.C.t=0;rb.C.lastInput=rb.C.run;rb.step(.1);check(R0.dun.step===2&&rb.C.mob&&rb.C.mob.raidStep===2,'bosses killed this lockout stay dead');leaveDungeon();
        R0.raidLock.at=Date.now()-4*864e5;check(raidLock().killed.length===0,'the lockout resets after 3 days');
        R0.dun={id:'throne',tier:0,step:6,mods:[],wipes:0,raid:true,plans:{},prev:[]};syncParty();raidFinish();check(R0.raidLeader&&dungeonStats('throne').clears===1&&!R0.dun,'a clear earns Raid Leader');
        rb.S.chars=rb.S.chars.filter(c=>c!==R0&&c!==alt);if(modalKind)closeModal();rb.S.cur=rb.S.chars.length?rb.S.chars[0].id:null;}
      // S5: living scenes. Every zone and dungeon has a backdrop, and drawing every one of them never fails
      {check(Object.keys(rb.ZONES).every(z=>AMB_ZONES[z]&&AMB_ZONES[z].far&&AMB_ZONES[z].weather.every(w=>AMB_WEATHER[w])),'every zone has its own scenery and weather');
        check(Object.keys(rb.DUNGEONS).every(d=>AMB_DUNGEONS[d])&&AMB_DUNGEONS.throne,'every dungeon and the raid has its own air');
        const ns=[0,.3,.62,.7,.8,.95].map(k=>realmNight(k*AMB_DAY*1000));check(ns[0]===0&&ns[3]>0&&ns[4]===1&&ns.every(n=>n>=0&&n<=1),'a 24-minute day: day, dusk, night, dawn');
        const v=rb.newHero('Scenecheck2','wild','duskelf','mage');v.lvl=40;rb.S.chars.push(v);rb.S.cur=v.id;rb.boot();let ok=true,err='';
        const keepW=window.zoneWeather,keepN=window.realmNight;let tt=1000;const drawAmb=()=>{tt+=.05;const gy=(PH||200)*.78,p=4,A=ambBack(tt,gy,p);if(rb.C.phase==='intown')ambTown(gy,tt,A);ambFront(tt,gy,p,A);};
        try{for(const z of Object.keys(rb.ZONES))for(const w of Object.keys(AMB_WEATHER))for(const n of [0,1]){v.zone=z;zoneWeather=()=>w;realmNight=()=>n;for(const ph of ['seek','rest','intown']){rb.C.phase=ph;drawAmb();}}
          for(const d of Object.keys(AMB_DUNGEONS)){v.dun={id:d,tier:0,step:0,mods:[],wipes:0,raid:d==='throne',plans:{}};drawAmb();}}catch(e){ok=false;err=String(e);}
        zoneWeather=keepW;realmNight=keepN;v.dun=null;check(ok,'every zone, weather, time of day and dungeon draws without error'+(err?': '+err:''));
        rb.S.chars=rb.S.chars.filter(c=>c!==v);}
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
