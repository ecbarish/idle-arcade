'use strict';

// Executed in the game iframe so classic-script lexical globals stay accessible.
function wildbondChecks() {
  const checks = [];
  const check = (label, test) => {
    try {
      if (!test()) throw Error('Expected condition was false.');
      checks.push({ ok: true, label });
    } catch (error) {
      checks.push({ ok: false, label: label + ' — ' + error.message });
    }
  };
  const wb = window.__wb;
  const tile = (m, x, y) => m && m.rows[y] && m.rows[y][x];
  const walkable = (m, x, y) => {
    const ch = tile(m, x, y);
    return ch !== undefined && !!TILES[ch] && !TILES[ch].solid && !TILES[ch].door;
  };
  const speaker = who => who === '' || Object.hasOwn(CAST, who) ||
    (typeof who === 'string' && who.startsWith('@') && Object.hasOwn(SPECIES, who.slice(1)));
  const lines = (label, list) => (list || []).forEach(([who], i) =>
    check(label + ' speaker ' + (i + 1), () => speaker(who)));

  for (const [id, m] of Object.entries(MAPS)) {
    check(id + ': map rows have equal lengths', () => m.rows.length > 0 && m.rows[0].length > 0 && m.rows.every(r => r.length === m.rows[0].length));
    const exits = new Set(m.rows.join('').split('').filter(ch => TILES[ch] && TILES[ch].exit));
    for (const ch of exits) {
      check(id + ': exit ' + ch + ' has a destination map', () => !!m.exits && !!m.exits[ch] && !!MAPS[m.exits[ch].to]);
      check(id + ': exit ' + ch + ' arrives on a walkable tile', () => {
        const ex = (m.exits || {})[ch];
        return !!ex && walkable(MAPS[ex.to], ex.x, ex.y) && !npcAt(MAPS[ex.to], ex.x, ex.y);
      });
    }
    for (const key of Object.keys(m.doors || {})) {
      check(id + ': door ' + key + ' sits on D', () => { const [x, y] = key.split(',').map(Number); return tile(m, x, y) === 'D'; });
    }
    for (const n of m.npcs || []) {
      check(id + ': NPC ' + n.who + ' is in CAST', () => Object.hasOwn(CAST, n.who));
      check(id + ': NPC ' + n.who + ' stands on a walkable tile', () => walkable(m, ...n.at));
      lines(id + ': ' + n.who + ' dialogue', n.lines);
      if (n.trainer) { lines(id + ': ' + n.who + ' victory', n.trainer.win); lines(id + ': ' + n.who + ' after', n.trainer.after); }
    }
    if (m.warden) {
      check(id + ': Warden spot is walkable', () => walkable(m, ...m.warden));
      check(id + ': area has a Warden beat', () => STORY.some(b => b.gate && (b.biome || 'thornwood') === m.biome));
    }
  }
  for (const [id, list] of Object.entries(SCENES)) lines('Scene ' + id, list);
  for (const b of STORY) {
    if (b.speaker !== undefined) check(b.id + ': story speaker', () => speaker(b.speaker));
    lines(b.id + ': introduction', b.lines); lines(b.id + ': victory', b.win);
    if (b.gate) {
      check(b.id + ': gate is a badge', () => Object.hasOwn(BADGES, b.gate));
      check(b.id + ': Warden trainer is a CAST speaker', () => Object.values(CAST).some(c => c.name === b.trainer));
    }
  }
  for (const [id, s] of Object.entries(SPECIES)) {
    for (const [level, move] of s.learn) check(id + ': level ' + level + ' move ' + move + ' exists', () => Object.hasOwn(MOVES, move));
    if (s.evo) check(id + ': evolution exists', () => Object.hasOwn(SPECIES, s.evo.to));
  }
  for (const [id, b] of Object.entries(BIOMES)) {
    for (const [sp] of b.wild) check(id + ': wild species ' + sp + ' exists', () => Object.hasOwn(SPECIES, sp));
    if (b.req) check(id + ': required badge is awarded by a Warden', () => Object.hasOwn(BADGES, b.req) && STORY.some(s => s.gate === b.req));
  }

  function reset() {
    // Clear transient battle/dialogue state as well as persistent state between scenarios.
    B = null; TALK = null; talkEl.hidden = true; W.after = W.afterDone = null; W.endT = W.autoT = 0; W.msg = '';
    S = fresh(); WK.ready = false; WK.held = []; WK.queued = null; WK.spot = null;
    WK.run = WK.pathRun = false; WK.cool = {}; WK.roam = []; WK.roamT = 99; WK.grassN = 10000;
    panelKey = tabKey = ''; closeModal();
  }
  function ready() {
    reset(); S.started = true; S.starter = 'ripplet'; S.rivalStarter = 'mosshog';
    S.team = [wb.newCreature('tidewyrm', 100, { rar: 4 })]; wb.placeAt('larkhaven');
  }
  function walk(x, y) {
    if (!wb.walkTo(x, y)) return false;
    let ticks = 0;
    while (WK.path.length && ticks++ < 2000) wb.worldTick(0.1);
    return ticks < 2000;
  }
  check('Choosing a starter puts you in Larkhaven', () => {
    reset(); wb.chooseStarter('ripplet', 'Test Tamer', 'classic'); skipTalk();
    return S.started && S.pos.map === 'larkhaven' && S.team[0].sp === 'ripplet';
  });
  check('Walking north from Larkhaven reaches Thornwood', () => {
    ready(); return walk(10, 0) && S.pos.map === 'thornwood';
  });
  check('Thornwood north gate stays locked without Thorn Badge', () => {
    ready(); wb.placeAt('thornwood', 13, 1, 'up'); wb.tryStep('up');
    return S.pos.map === 'thornwood' && W.msg.includes('Thorn Badge');
  });
  check('Thornwood north gate opens with Thorn Badge', () => {
    ready(); S.badges = ['thorn']; wb.placeAt('thornwood', 13, 1, 'up'); wb.tryStep('up');
    return S.pos.map === 'saltmarsh';
  });
  const badges = ['thorn', 'tide', 'ember', 'beacon'];
  for (let n = 0; n <= badges.length; n++) check('Level cap with ' + n + ' badges is ' + (15 + 10 * n), () => {
    ready(); S.badges = badges.slice(0, n); return wb.levelCap() === 15 + 10 * n;
  });
  check('Soft cap still grants a trickle of XP at the cap', () => {
    ready(); S.capMode = 'soft'; const c = wb.newCreature('tidewyrm', 15); c.xp = 0; grow(c, 100);
    return c.lvl === 15 && c.xp === Math.round(100 * SOFT_TRICKLE) && c.xp > 0 && c.xp < 100;
  });
  check('Hard cap grants no XP at the cap', () => {
    ready(); S.capMode = 'hard'; const c = wb.newCreature('tidewyrm', 15); c.xp = 0; grow(c, 100);
    return c.lvl === 15 && c.xp === 0;
  });
  check('Caps off lets a creature grow past level 15', () => {
    ready(); S.capMode = 'off'; const c = wb.newCreature('tidewyrm', 15); grow(c, 100000);
    return wb.levelCap() === 100 && c.lvl > 15;
  });
  for (const g of STORY.filter(b => b.gate)) {
    check(g.trainer + ': cannot be challenged in town', () => {
      ready(); S.biome = g.biome || 'thornwood'; S.explored = g.at; S.exploredIn = { [S.biome]: g.at };
      wb.challengeWarden(); return !wb.wardenReady() && !TALK && !wb.B;
    });
    check(g.trainer + ': can be challenged on their own map', () => {
      ready(); const area = g.biome || 'thornwood'; const map = Object.keys(MAPS).find(id => MAPS[id].biome === area);
      wb.placeAt(map); S.explored = g.at; S.exploredIn = { [area]: g.at }; renderAll();
      const button = document.querySelector('[data-act="warden"]');
      if (!wb.wardenReady() || !button || button.textContent !== 'Challenge ' + g.trainer) return false;
      button.click(); const scene = !!TALK && !talkEl.hidden; skipTalk();
      return scene && !!wb.B && wb.B.story === g.id && wb.B.trainer === g.trainer;
    });
    check(g.trainer + ': actual victory awards their badge', () => {
      ready(); const area = g.biome || 'thornwood'; wb.placeAt(Object.keys(MAPS).find(id => MAPS[id].biome === area));
      S.explored = g.at; S.exploredIn = { [area]: g.at }; wb.challengeWarden(); skipTalk();
      if (!wb.B) return false;
      let ticks = 0;
      while (wb.B && !wb.B.over && ticks++ < 10000) { wb.command('focus'); wb.worldTick(0.1); }
      const won = wb.B && wb.B.over === 'won'; wb.finishBattle(); skipTalk();
      return won && S.story[g.id] && S.badges.includes(g.gate);
    });
  }
  check('Old save without position, journey or cap mode loads defaults', () => {
    ready(); const old = JSON.parse(JSON.stringify(S)); delete old.pos; delete old.journey; delete old.capMode;
    localStorage.setItem('wildbond-save-v1', JSON.stringify(old)); load(); ensurePos();
    return S.journey === 'classic' && S.capMode === 'soft' && S.pos.map === 'thornwood' && S.team[0].sp === 'tidewyrm';
  });
  check('Walking into the inn heals the team', () => {
    ready(); S.team[0].hp = 1; wb.placeAt('larkhaven', 4, 5, 'up'); wb.tryStep('up');
    return S.team.every(c => c.hp === stOf(c).hp) && W.msg.includes('innkeeper');
  });
  check('Walking into the shop buys five lures for 50 coins', () => {
    ready(); const coins = S.coins, lures = S.lures; wb.placeAt('larkhaven', 18, 5, 'up'); wb.tryStep('up');
    return S.coins === coins - 50 && S.lures === lures + 5 && W.msg.includes('shopkeeper');
  });
  // T27: Stillreed content and the real walking, story, capture and badge paths.
  const basinSpecies = ['reedlet', 'ferrycrest', 'siltjaw', 'rillwhisk', 'orchardroot', 'gustreed', 'duskcord', 'glassbill', 'stillwake'];
  for (const id of basinSpecies) {
    check('Stillreed ' + id + ': valid family, element, moves and dex', () => {
      const s = SPECIES[id]; return s && ['wolf','cat','boar','lizard','croc','bird','spider','horse','sprite','hyena'].includes(s.fam) && ELEMENTS[s.el] && s.learn.every(([l,m]) => l > 0 && MOVES[m]) && !!s.dex;
    });
    check('Stillreed ' + id + ': base stats follow its role', () => {
      const s = SPECIES[id], total = Object.values(s.base).reduce((a,b) => a+b,0);
      return Object.keys(s.base).sort().join(',') === 'grd,hp,pow,spd,spi,wit' && Object.values(s.base).every(n => n > 0) && (s.unique ? total >= 500 && total <= 600 : id === 'ferrycrest' ? total >= 400 && total <= 440 : total >= 280 && total <= 320);
    });
  }
  check('Stillreed opens only with the Beacon Badge at levels 52-60', () => {
    ready(); const b=BIOMES.stillreed; if (b.lv.join(',') !== '52,60' || b.req !== 'beacon' || biomeOpen('stillreed')) return false;
    S.badges=badges.slice(); return biomeOpen('stillreed') && levelCap()===55;
  });
  check('Cloudglass ferry path is gated and walks into Stillreed after the badge', () => {
    ready(); S.badges=badges.slice(0,3); wb.placeAt('cloudglass',27,8,'right'); wb.tryStep('right');
    if(S.pos.map!=='cloudglass'||!W.msg.includes('Beacon Badge'))return false;
    S.badges=badges.slice();wb.tryStep('right');return S.pos.map==='stillreed'&&S.biome==='stillreed'&&S.pos.x===1&&S.pos.y===8;
  });
  check('Stillreed west exit returns to Cloudglass on a safe tile', () => {
    ready();S.badges=badges.slice();wb.placeAt('stillreed');wb.tryStep('left');return S.pos.map==='cloudglass'&&S.biome==='cloudglass'&&S.pos.x===27&&S.pos.y===8;
  });
  check('Stillreed map uses valid tiles and every walkable square is connected', () => {
    const m=MAPS.stillreed; if(m.rows.length!==14||m.rows.some(r=>r.length!==30||[...r].some(c=>!TILES[c])))return false;
    const seen=new Set(),todo=[m.start.slice(0,2)];
    while(todo.length){const [x,y]=todo.pop(),key=x+','+y;if(seen.has(key)||!walkable(m,x,y)||npcAt(m,x,y))continue;seen.add(key);for(const [dx,dy] of Object.values(DIRS))todo.push([x+dx,y+dy]);}
    for(let y=0;y<14;y++)for(let x=0;x<30;x++)if(walkable(m,x,y)&&!npcAt(m,x,y)&&!seen.has(x+','+y))return false;
    return m.items.every(it=>seen.has(it.at.join(',')))&&seen.has('0,8')&&seen.has('23,8')&&m.rows.some(r=>r.includes('~')&&r.includes('"'));
  });
  check('Stillreed has a sign, three unique items and two route trainers at 52-56', () => {
    const m=MAPS.stillreed;return Object.keys(m.signs).length===1&&m.items.length===3&&new Set(Object.values(MAPS).flatMap(m=>(m.items||[]).map(it=>it.id))).size===Object.values(MAPS).flatMap(m=>m.items||[]).length&&m.npcs.filter(n=>n.trainer).length===2&&m.npcs.every(n=>n.trainer.team.every(([id,l])=>SPECIES[id]&&l>=52&&l<=56));
  });
  check('Stillreed wild table excludes its guardian and keeps Glassbill rare', () => {
    const w=BIOMES.stillreed.wild;return w.every(([id,n])=>basinSpecies.includes(id)&&n>0&&!SPECIES[id].unique)&&w.find(([id])=>id==='glassbill')[1]===3&&w.filter(([id])=>id!=='glassbill').every(([,n])=>n>3)&&SPECIES.stillwake.fam==='croc'&&SPECIES.stillwake.el==='Tide'&&SPECIES.stillwake.big===1&&SPECIES.stillwake.unique===1;
  });
  check('Reedlet really evolves at 54 before the fifth badge is needed', () => {
    ready();S.badges=badges.slice();const c=wb.newCreature('reedlet',53);c.xp=0;grow(c,Cr.xpNeed(53));return c.lvl===54&&c.sp==='ferrycrest'&&S.caught.ferrycrest;
  });
  check('Stillreed weather is rainy and its original zone tune has valid notes', () => {
    const t=TRACKS.stillreed;return WEATHER.stillreed.join(',')==='rain,clear,rain,mist'&&t.mel.split(' ').length===32&&[16,32].includes(t.bass.split(' ').length)&&[...t.mel.split(' '),...t.bass.split(' ')].every(n=>n==='.'||ArcadeSound.hz(n)>0);
  });
  check('Stillreed clear daytime selects its zone music', () => {
    ready();S.badges=badges.slice();S.day=4;S.ranchT=0;wb.placeAt('stillreed');return weatherNow()==='clear'&&!isNight()&&musicKey()==='stillreed';
  });
  const basinBeats=STORY.filter(b=>b.biome==='stillreed');
  check('Stillreed story has exactly the required thresholds and team bands', () => basinBeats.length===3&&basinBeats.map(b=>b.at).join(',')==='6,14,24'&&basinBeats[0].team.every(([,l])=>l>=52&&l<=55)&&JSON.stringify(basinBeats[0].team.at(-1))==='["$rival",55]'&&JSON.stringify(basinBeats[1].wild)==='["stillwake",57,4]'&&basinBeats[2].team.map(([,l])=>l).join(',')==='54,55,57'&&basinBeats[2].gate==='reed'&&basinBeats.every(b=>b.lines.length>=3&&b.lines.length<=4&&b.win.length>=2&&b.win.length<=3));
  check('Wren ferry rematch triggers at six local explores and a real victory completes it', () => {
    ready();S.badges=badges.slice();wb.placeAt('stillreed');S.explored=100;S.exploredIn={stillreed:5};wb.explore();
    if(!TALK||!TALK.lines.some(([,t])=>t.includes('rope')))return false;skipTalk();return B&&B.story==='rival6'&&B.kind==='trainer'&&B.foes.at(-1).c.lvl===55&&finishFight()==='won'&&S.story.rival6;
  });
  check('Stillwake triggers at fourteen local explores and a real lure records the guardian', () => {
    ready();S.badges=badges.slice();S.story.rival6=true;wb.placeAt('stillreed');S.explored=100;S.exploredIn={stillreed:13};wb.explore();if(!TALK)return false;skipTalk();
    if(!B||B.story!=='stillwake'||B.foes[0].c.sp!=='stillwake'||B.foes[0].c.lvl!==57||B.foes[0].c.rar!==4)return false;
    const random=Math.random;try{Math.random=()=>0;wb.command('lure');if(!B.capture)return false;B.capture.pos=B.capture.zone;wb.calmNow();const caught=B.over==='caught';wb.finishBattle();skipTalk();return caught&&S.story.stillwake&&S.caught.stillwake&&[...S.team,...S.ranch].some(c=>c.sp==='stillwake');}finally{Math.random=random;}
  });
  check('Olan waits for 24 local explores; real victory awards Reed and cap 60 without changing eras', () => {
    ready();S.badges=badges.slice();S.story.rival6=S.story.stillwake=true;wb.placeAt('stillreed');S.explored=100;S.exploredIn={stillreed:23};
    if(wb.wardenReady())return false;wb.challengeWarden();if(TALK||B)return false;S.exploredIn.stillreed=24;const eras=JSON.stringify(S.eras);wb.challengeWarden();if(!TALK)return false;skipTalk();
    return B&&B.story==='warden5'&&finishFight()==='won'&&S.story.warden5&&S.badges.includes('reed')&&levelCap()===60&&JSON.stringify(S.eras)===eras;
  });
  check('Four-badge saves preserve progress and Stillreed saves reload their position and badge', () => {
    ready();S.badges=badges.slice();S.story.warden4=true;save();load();if(levelCap()!==55||!S.story.warden4||S.badges.length!==4)return false;
    S.badges.push('reed');wb.placeAt('stillreed',19,9,'right');S.items={sr1:true};S.beaten={evren:true};save();reset();load();ensurePos();return S.pos.map==='stillreed'&&S.pos.x===19&&S.biome==='stillreed'&&levelCap()===60&&S.items.sr1&&S.beaten.evren;
  });
  // Living battle backdrops: real canvas calls across routes, eras, weather and reduced motion.
  check('Battle scenery draws each route and weather without changing the save or battle', () => {
    ready();S.badges=Object.keys(BADGES);const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;
    const oldCx=cx,oldPW=PW,oldPH=PH;try{cx=canvas.getContext('2d');PW=320;PH=180;
      for(const id of Object.keys(BIOMES)){
        wb.placeAt(id);startBattle('wild',[wb.newCreature('ripplet',2)]);
        for(const day of [1,3,6])for(const part of [0,.5,.8]){S.day=day;S.ranchT=part*DAY_SECONDS;const before=JSON.stringify({S,B});
          if(drawBattleBackdrop(12)!==144||JSON.stringify({S,B})!==before)return false;}
        B=null;
      }return true;
    }finally{cx=oldCx;PW=oldPW;PH=oldPH;B=null;}
  });
  check('Reduced-motion battle backgrounds stay identical at different animation times', () => {
    ready();S.badges=Object.keys(BADGES);const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;
    const oldCx=cx,oldPW=PW,oldPH=PH,oldReduce=reduceMotion;try{cx=canvas.getContext('2d');PW=320;PH=180;reduceMotion=true;
      for(const id of Object.keys(BIOMES)){wb.placeAt(id);S.day=3;S.ranchT=.8*DAY_SECONDS;drawBattleBackdrop(1);
        const a=Array.from(cx.getImageData(0,0,320,180).data);drawBattleBackdrop(90);const b=cx.getImageData(0,0,320,180).data;
        if(a.some((n,i)=>n!==b[i]))return false;}
      return true;
    }finally{cx=oldCx;PW=oldPW;PH=oldPH;reduceMotion=oldReduce;}
  });
  // T24: exercise the same walking, dialogue and battle paths as the game.
  function finishFight() {
    let ticks = 0;
    while (B && !B.over && ticks++ < 10000) {
      if (B.tele) wb.command('guard');
      else if (B.cmd >= 2 && living('a').some(u => u.c.hp < u.st.hp * 0.5)) wb.command('rally');
      else wb.command('focus');
      wb.worldTick(0.1);
    }
    const result = B && B.over;
    if (result) { wb.finishBattle(); skipTalk(); }
    return result;
  }
  function beside(map, x, y) {
    for (const [dir, [dx, dy]] of Object.entries(DIRS)) {
      const px = x - dx, py = y - dy;
      if (walkable(map, px, py) && !npcAt(map, px, py) && !TILES[tile(map, px, py)].exit && !TILES[tile(map, px, py)].sign) return [px, py, dir];
    }
    throw Error('No walkable approach at ' + x + ',' + y);
  }
  const trainers = Object.entries(MAPS).flatMap(([map, m]) => (m.npcs || []).filter(n => n.trainer).map(n => ({ map, n })));
  for (const { map, n } of trainers) {
    check(map + ': walking into ' + n.who + "'s sight starts a trainer scene and battle", () => {
      ready(); const m = MAPS[map], [dx, dy] = DIRS[n.dir];
      const x = n.at[0] + dx, y = n.at[1] + dy;
      const [px, py, dir] = beside(m, x, y); wb.placeAt(map, px, py, dir);
      if (!walk(x, y) || !WK.spot || WK.spot.n.who !== n.who) return false;
      for (let i = 0; i < 30 && !TALK; i++) wb.worldTick(0.1);
      const scene = !!TALK && TALK.lines[0][0] === n.who; skipTalk();
      return scene && B && B.kind === 'trainer' && B.npc === n.who && B.trainer === CAST[n.who].name;
    });
    check(map + ': victory records ' + n.who + ' and talking again plays after dialogue', () => {
      ready(); wb.placeAt(map); talkTo(n); skipTalk();
      if (finishFight() !== 'won' || !S.beaten[n.who]) return false;
      talkTo(n); const expected = n.trainer.after || n.trainer.win;
      return !B && !!TALK && JSON.stringify(TALK.lines) === JSON.stringify(expected.map(([who, text]) => [who, fillText(text)]));
    });
    check(map + ': losing to ' + n.who + ' prevents another sight challenge until changing maps', () => {
      ready(); wb.placeAt(map); S.team = [wb.newCreature('ripplet', 1)]; S.team[0].hp = 1;
      talkTo(n); skipTalk();
      let ticks = 0; while (B && !B.over && ticks++ < 10000) wb.worldTick(0.1);
      if (!B || B.over !== 'lost' || !WK.cool[n.who] || S.beaten && S.beaten[n.who]) return false;
      wb.finishBattle(); skipTalk();
      const [dx, dy] = DIRS[n.dir], x = n.at[0] + dx, y = n.at[1] + dy;
      wb.placeAt(map, x, y); if (spotted(MAPS[map]) || WK.spot) return false;
      wb.placeAt('larkhaven'); wb.placeAt(map, x, y);
      return !WK.cool[n.who] && spotted(MAPS[map]) && WK.spot.n.who === n.who;
    });
  }
  for (const [id, m] of Object.entries(MAPS)) {
    for (const it of m.items || []) check(id + ': walking picks up ' + it.id + ' exactly once', () => {
      ready(); ensureRanch(); const [x, y] = it.at, [px, py, dir] = beside(m, x, y);
      wb.placeAt(id, px, py, dir);
      const before = { coins: S.coins, lures: S.lures, ...S.food };
      wb.tryStep(dir);
      if (S.pos.x !== x || S.pos.y !== y || !S.items[it.id]) return false;
      for (const [key, amount] of Object.entries(it.give)) if ((key === 'coins' || key === 'lures' ? S[key] : S.food[key]) !== before[key] + amount) return false;
      const after = JSON.stringify({ coins: S.coins, lures: S.lures, food: S.food });
      wb.placeAt(id, px, py, dir); wb.tryStep(dir);
      return !itemsLeft(m).some(i => i.id === it.id) && after === JSON.stringify({ coins: S.coins, lures: S.lures, food: S.food });
    });
    for (const [at, words] of Object.entries(m.signs || {})) check(id + ': sign ' + at + ' shows its text and blocks movement', () => {
      ready(); const [x, y] = at.split(',').map(Number), [px, py, dir] = beside(m, x, y);
      wb.placeAt(id, px, py, dir); wb.tryStep(dir);
      return tile(m, x, y) === 'P' && S.pos.x === px && S.pos.y === py && W.msg === 'The sign reads: "' + words + '"';
    });
  }
  check('Riding requires the Ember Badge and a conscious partner', () => {
    ready(); toggleRide(); if (S.ride) return false;
    S.badges = ['ember']; S.team[0].hp = 0; toggleRide(); if (S.ride) return false;
    healAll(); toggleRide(); return S.ride && rideOK() && speedNow() === RIDE_SPEED;
  });
  check('Riding toggles off and cannot toggle during battle or dialogue', () => {
    ready(); S.badges = ['ember']; toggleRide(); toggleRide(); if (S.ride) return false;
    talk([['maren', 'Wait here.']]); toggleRide(); if (S.ride) return false; skipTalk();
    startBattle('wild', [wb.newCreature('ripplet', 2)]); toggleRide(); return !S.ride;
  });
  check('Boots and Shift run; Auto always walks even while riding', () => {
    ready(); WK.run = true; if (speedNow() !== WALK_SPEED) return false;
    S.shoes = true; if (speedNow() !== RUN_SPEED) return false;
    S.badges = ['ember']; toggleRide(); if (speedNow() !== RIDE_SPEED) return false;
    S.auto = true; return speedNow() === WALK_SPEED;
  });
  check('New saves start with only the Pocket era', () => { reset(); return S.era === 'pocket' && JSON.stringify(S.eras) === '["pocket"]' && !S.shoes; });
  for (const [gate, era, before, prior] of [
    ['thorn', 'bit16', 'pocket', []], ['tide', 'hd', 'bit16', ['thorn']], ['ember', 'diorama', 'hd', ['thorn', 'tide']]
  ]) check(gate + ': real Warden victory unlocks and switches art eras', () => {
    ready(); S.badges = prior.slice(); S.era = before;
    S.eras = ['pocket', ...(prior.includes('thorn') ? ['pixel', 'bit16'] : []), ...(prior.includes('tide') ? ['hd'] : [])];
    const g = STORY.find(b => b.gate === gate), map = Object.keys(MAPS).find(id => MAPS[id].biome === (g.biome || 'thornwood'));
    wb.placeAt(map); S.explored = g.at; S.exploredIn = { [S.biome]: g.at }; wb.challengeWarden(); skipTalk();
    // Accelerate only this scenario's scheduled color/depth/solid scene. Restore the real timer even on failure.
    const timer = window.setTimeout, scenes = [];
    window.setTimeout = (fn, delay, ...args) => delay === 900 ? (scenes.push(() => fn(...args)), 0) : timer(fn, delay, ...args);
    try {
      if (finishFight() !== 'won') return false;
      for (const scene of scenes) scene();
      const changed = S.badges.includes(gate) && S.era === era && S.eras.includes(era) && !!TALK;
      skipTalk(); return changed && (gate !== 'thorn' || S.shoes && S.eras.includes('pixel'));
    } finally { window.setTimeout = timer; }
  });
  for (let n = 0; n <= 3; n++) check('Old save with ' + n + ' badges recovers its earned eras and boots', () => {
    ready(); S.badges = badges.slice(0, n); S.era = 'pixel'; S.eras = ['pixel']; delete S.shoes;
    save(); load();
    const expected = ['pocket', 'pixel', ...(n >= 1 ? ['bit16'] : []), ...(n >= 2 ? ['hd'] : []), ...(n >= 3 ? ['diorama'] : [])];
    return S.era === 'pixel' && expected.every(e => S.eras.includes(e)) && !!S.shoes === (n >= 1);
  });
  check('Darkness arrives with Thorn, rises at dusk, and reaches night', () => {
    ready(); S.ranchT = DAY_SECONDS * 0.8; if (darkness() !== 0 || isNight()) return false;
    S.badges = ['thorn']; if (!isNight() || darkness() !== 1) return false;
    S.ranchT = DAY_SECONDS * 0.7; if (!(darkness() > 0 && darkness() < 1) || isNight()) return false;
    S.ranchT = 0; return darkness() === 0 && !isNight();
  });
  function shareOf(element) {
    // Stratified uniform draws test the distribution without a probabilistic pass/fail threshold.
    const random = Math.random; let sample = 0, found = 0;
    Math.random = () => (sample + 0.5) / 2000;
    try { for (; sample < 2000; sample++) if (SPECIES[wildPick()].el === element) found++; }
    finally { Math.random = random; }
    return found;
  }
  check('Night increases Shade wild picks over daylight', () => {
    ready(); wb.placeAt('thornwood'); S.badges = ['thorn']; S.ranchT = 0; const day = shareOf('Shade');
    S.ranchT = DAY_SECONDS * 0.8; return shareOf('Shade') > day;
  });
  check('Weather stays clear before Tide and in town', () => {
    ready(); wb.placeAt('saltmarsh'); S.day = 1; S.ranchT = 0;
    if (weatherNow() !== 'clear') return false;
    S.badges = ['tide']; wb.placeAt('larkhaven'); return weatherNow() === 'clear';
  });
  check('Rain increases Tide wild picks compared with clear weather', () => {
    ready(); wb.placeAt('saltmarsh'); S.badges = ['thorn', 'tide']; S.ranchT = 0;
    const dayFor = weather => { for (let day = 1; day <= 100; day++) { S.day = day; if (weatherNow() === weather) return true; } return false; };
    if (!dayFor('clear')) return false; const clear = shareOf('Tide');
    return dayFor('rain') && shareOf('Tide') > clear;
  });
  check('Visible wild creatures appear only after Tide and outside town', () => {
    ready(); wb.placeAt('thornwood'); roamTick(13); if (WK.roam.length) return false;
    S.badges = ['tide']; for (let i = 0; i < 3; i++) roamTick(13);
    if (WK.roam.length !== 3 || !WK.roam.every(r => tile(curMap(), r.x, r.y) === '"' && SPECIES[r.sp])) return false;
    wb.placeAt('larkhaven'); roamTick(13); return WK.roam.length === 0;
  });
  check('Walking onto a visible creature starts a wild battle with its species', () => {
    ready(); S.badges = ['tide']; wb.placeAt('thornwood'); roamTick(13);
    const r = WK.roam[0], [px, py, dir] = beside(curMap(), r.x, r.y); wb.placeAt('thornwood', px, py, dir); wb.tryStep(dir);
    return B && B.kind === 'wild' && B.foes[0].c.sp === r.sp && B.foes[0].c.lvl === r.lvl && !WK.roam.includes(r);
  });
  check('Choosing Nuzlocke stores the selected mode', () => {
    reset(); wb.chooseStarter('ripplet', 'Modecheck', 'classic', { nuzlocke: true });
    return S.modes.nuzlocke && modeOn('nuzlocke') && !modeOn('solo');
  });
  check('Nuzlocke allows the first meeting but refuses a second lure in an area', () => {
    ready(); wb.placeAt('thornwood'); S.modes = { nuzlocke: true };
    startBattle('wild', [wb.newCreature('ripplet', 2)]); wb.command('lure');
    if (!B.firstMeet || !B.capture) return false;
    B.capture = null; wb.command('flee'); wb.finishBattle();
    startBattle('wild', [wb.newCreature('ripplet', 2)]); const lures = S.lures; wb.command('lure');
    return S.metIn.thornwood && !B.firstMeet && !B.capture && S.lures === lures && B.lines.some(l => l.t.includes('Nuzlocke:'));
  });
  check('Nuzlocke releases a fainted partner after an actual battle', () => {
    ready(); S.modes = { nuzlocke: true }; const fallen = wb.newCreature('ripplet', 1); fallen.hp = 0; S.team.push(fallen);
    startBattle('wild', [wb.newCreature('ripplet', 2)]);
    return finishFight() === 'won' && !S.team.some(c => c.uid === fallen.uid) && !S.ranch.some(c => c.uid === fallen.uid) && !S.modes.nuzlockeEnded;
  });
  check('An empty Nuzlocke team ends the run gently with a second-chance partner', () => {
    ready(); S.modes = { nuzlocke: true }; S.team = [wb.newCreature('ripplet', 1)]; S.team[0].hp = 1;
    startBattle('wild', [wb.newCreature('tidewyrm', 100)]);
    let ticks = 0; while (B && !B.over && ticks++ < 10000) wb.worldTick(0.1);
    if (!B || B.over !== 'lost') return false; wb.finishBattle();
    return !S.modes.nuzlocke && S.modes.nuzlockeEnded && S.team.length === 1 && S.team[0].hp > 0 && !!TALK && TALK.lines.some(([who]) => who === 'maren');
  });
  check('Solo permits one teammate and sends an actual catch to the ranch', () => {
    ready(); S.modes = { solo: true }; startBattle('wild', [wb.newCreature('ripplet', 2, { rar: 0 })]);
    wb.command('lure'); if (!B.capture) return false; B.capture.pos = B.capture.zone;
    const random = Math.random; Math.random = () => 0;
    try { calmNow(); } finally { Math.random = random; }
    return teamMax() === 1 && S.team.length === 1 && S.ranch.length === 1 && S.ranch[0].sp === 'ripplet' && B.over === 'caught';
  });
  check('Hardcore refuses Rally without spending points or healing', () => {
    ready(); S.modes = { hardcore: true }; startBattle('wild', [wb.newCreature('ripplet', 2)]);
    B.cmd = 3; S.team[0].hp = Math.floor(stOf(S.team[0]).hp / 2); const hp = S.team[0].hp; wb.command('rally');
    return S.team[0].hp === hp && B.cmd === 3 && B.lines.some(l => l.t.includes('Hardcore: no Rally'));
  });
  check('Randomizer is a stable permutation for one seed, including after save/load', () => {
    ready(); S.modes = { randomizer: true, seed: 123456 }; RANDOM_MAP = RANDOM_SEED = null;
    const pool = [...new Set(Object.values(BIOMES).flatMap(b => b.wild.map(([id]) => id)))].sort();
    const shuffled = pool.map(randomized); if (JSON.stringify(shuffled.slice().sort()) !== JSON.stringify(pool)) return false;
    save(); load(); RANDOM_MAP = RANDOM_SEED = null;
    return JSON.stringify(pool.map(randomized)) === JSON.stringify(shuffled) && shuffled.some((id, i) => id !== pool[i]);
  });
  for (const g of STORY.filter(b => b.gate)) check(g.trainer + ': talking starts a rematch, victory advances its tier, and the same day is blocked', () => {
    ready(); S.story[g.id] = true; S.badges = badges.slice(); S.capMode = 'off';
    S.team = [wb.newCreature('tidewyrm', 50, { rar: 4, temp: 'steady', traits: ['ferocious', 'thick'], pot: Object.fromEntries(Cr.STATS.map(k => [k, 31])) })];
    const map = Object.keys(MAPS).find(id => MAPS[id].biome === (g.biome || 'thornwood')); wb.placeAt(map);
    const npc = npcsOf(curMap()).find(n => n.warden && n.warden.id === g.id); talkTo(npc); if (!TALK) return false; skipTalk();
    if (!B || B.kind !== 'trainer' || B.rematch !== g.id || B.tier !== 1 || finishFight() !== 'won') return false;
    if (S.rematch[g.id] !== 1 || rematchReady(g.id)) return false;
    talkTo(npc); const blocked = !!TALK && !B && TALK.lines.some(([, text]) => text.includes('tomorrow')); skipTalk();
    S.day++; return blocked && rematchReady(g.id) && rematchTier(g.id) === 2;
  });
  check('Wren appears in Larkhaven after rival2 and offers a trainer rematch', () => {
    ready(); if (wrenNpc() || npcsOf(MAPS.larkhaven).some(n => n.rematch === 'wren')) return false;
    S.story.rival2 = true; const npc = npcsOf(MAPS.larkhaven).find(n => n.rematch === 'wren');
    if (!npc || JSON.stringify(npc.at) !== JSON.stringify(WREN_SPOT.at)) return false;
    talkTo(npc); skipTalk(); return B && B.kind === 'trainer' && B.rematch === 'wren' && B.trainer === CAST.wren.name;
  });
  for (const biome of Object.keys(BIOMES)) check(biome + ': mastery counts each of its three stars independently', () => {
    ready(); const map = MAPS[biome], g = STORY.find(b => b.gate && (b.biome || 'thornwood') === biome);
    if (!map || !g || masteryOf(biome).stars !== 0) return false;
    for (const [id] of BIOMES[biome].wild) S.caught[id] = true;
    let m = masteryOf(biome); if (m.stars !== 1 || !m.dex || m.warden || m.secrets) return false;
    S.rematch[g.id] = 2; if (masteryOf(biome).stars !== 1) return false;
    S.rematch[g.id] = 3; m = masteryOf(biome); if (m.stars !== 2 || !m.warden) return false;
    S.items = Object.fromEntries((map.items || []).map(it => [it.id, true]));
    if (masteryOf(biome).secrets) return false;
    S.beaten = Object.fromEntries((map.npcs || []).filter(n => n.trainer).map(n => [n.who, true]));
    m = masteryOf(biome); return m.stars === 3 && m.dex && m.warden && m.secrets && m.hasWarden;
  });
  return checks;
}

(() => {
  const button = document.querySelector('#run'), summary = document.querySelector('#summary'), results = document.querySelector('#results');
  const keys = ['wildbond-save-v1', 'arcade-index-v1'];
  let active = null;
  function result(ok, label) {
    const li = document.createElement('li'); li.className = ok ? 'pass' : 'fail'; li.textContent = (ok ? 'PASS — ' : 'FAIL — ') + label; results.appendChild(li);
  }
  function restore() {
    if (!active) return;
    // Destroy the writer (timers and beforeunload save) BEFORE restoring the originals.
    if (active.frame) { active.frame.remove(); active.frame = null; }
    const errors = [];
    for (const [key, value] of active.backup) {
      try {
        if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
        if (localStorage.getItem(key) !== value) throw Error('Value did not match backup.');
      } catch (error) { errors.push(key + ': ' + error.message); }
    }
    if (errors.length) throw Error('Save restoration failed: ' + errors.join('; '));
    active = null;
  }
  addEventListener('pagehide', restore);
  button.addEventListener('click', async () => {
    button.disabled = true; results.replaceChildren(); summary.className = ''; summary.textContent = 'Running…';
    let total = 0, failed = 0;
    const record = (ok, label) => { total++; if (!ok) failed++; result(ok, label); };
    try {
      if (location.hostname !== 'localhost' || !/^https?:$/.test(location.protocol)) throw Error('Open this page through serve.ps1 at http://localhost:8765/tests/wildbond.html.');
      // Finish ALL reads before changing storage; if backup fails, no game is loaded.
      const backup = new Map(keys.map(key => [key, localStorage.getItem(key)]));
      active = { backup, frame: null };
      localStorage.removeItem(keys[0]);
      const frame = document.createElement('iframe'); frame.title = 'Wildbond test instance'; active.frame = frame;
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(Error('Game iframe load timed out.')), 15000);
        frame.onload = () => { clearTimeout(timer); resolve(); };
        frame.onerror = () => { clearTimeout(timer); reject(Error('Game iframe failed to load.')); };
        frame.src = '../games/wildbond/'; document.querySelector('#game').appendChild(frame);
      });
      const w = frame.contentWindow;
      if (!w.__wb) throw Error('Wildbond localhost test hook is unavailable.');
      for (const c of w.eval('(' + wildbondChecks.toString() + ')()')) record(c.ok, c.label);
    } catch (error) {
      record(false, error.message);
    } finally {
      try { restore(); } catch (error) { record(false, error.message); }
      summary.textContent = failed ? 'FAIL — ' + failed + ' of ' + total + ' failed.' : 'PASS — ' + total + ' checks.';
      summary.className = failed ? 'fail' : 'pass'; button.disabled = false;
    }
  });
})();
