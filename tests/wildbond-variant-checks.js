'use strict';
function wildbondVariantChecks() {
  const results = [], check = (label, fn) => { try { if (!fn()) throw Error('Expected condition was false.'); results.push({ok:true,label:'Variants: '+label}); } catch(e) {results.push({ok:false,label:'Variants: '+label+' — '+e.message});} };
  const original = S, battle = B;
  try {
    S = fresh();
    let seed = 1933, gleams = 0, tiny = 0, huge = 0;
    const random = () => {seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<50000;i++){const v=rollVariant('ripplet',random)||{};gleams+=!!v.gleaming;tiny+=v.size==='tiny';huge+=v.size==='huge';}
    check('Gleaming encounter rate remains near 1 in 200 over 50000 rolls',()=>gleams>=180&&gleams<=320);
    check('tiny and huge each remain near 1 in 25 over 50000 rolls',()=>tiny>=1750&&tiny<=2250&&huge>=1750&&huge<=2250);
    check('ordinary rolls omit the optional field',()=>rollVariant('ripplet',()=>.9)===undefined);
    const patterned=Object.keys(SPECIES).find(id=>SPECIES[id].fam==='cat');
    const a=newCreature(patterned,12,{rar:1,temp:'steady',traits:[],pot:{hp:10,pow:10,grd:10,spd:10,wit:10,spi:10}});
    a.variant={gleaming:true,size:'huge',mark:912};
    const plain=JSON.parse(JSON.stringify(a));delete plain.variant;
    check('all six stats are identical to the ordinary individual',()=>JSON.stringify(stOf(a))===JSON.stringify(stOf(plain)));
    check('moves, rarity, traits and temperament are unchanged',()=>JSON.stringify(movesOf(a))===JSON.stringify(movesOf(plain))&&a.rar===plain.rar&&a.temp===plain.temp&&JSON.stringify(a.traits)===JSON.stringify(plain.traits));
    check('labels use words and include the size',()=>variantLabel(a)==='Gleaming, huge, individual markings'&&variantLabel(plain)==='');
    check('card includes the label and variant portrait data without changing its layout',()=>cardHTML(a,0,true).includes('Gleaming, huge')&&cardHTML(a,0,true).includes('data-variant='));
    check('tiny and huge are modest, legible sizes',()=>variantScale({size:'tiny'})===.85&&variantScale({size:'huge'})===1.15);
    check('same seed repeats, different seeds give different markings',()=>JSON.stringify(variantMarks(912))===JSON.stringify(variantMarks(912))&&JSON.stringify(variantMarks(912))!==JSON.stringify(variantMarks(913)));
    check('drawing species never mutates shared species data',()=>!SPECIES[a.sp].variant&&sp(a).variant===a.variant);
    variantRecord(a,false);
    check('seeing does not claim a bond',()=>S.variantDex[a.sp].seen.gleaming&&!S.variantDex[a.sp].bonded.gleaming&&variantDexHTML(a.sp).includes('(seen)'));
    keep(a);
    check('bonding records both seen and bonded looks in the Wilddex',()=>S.variantDex[a.sp].bonded.gleaming&&S.variantDex[a.sp].bonded.huge&&S.variantDex[a.sp].bonded.marked&&variantDexHTML(a.sp).includes('(bonded)'));
    S.started=true;S.starter=a.sp;save();load();
    check('variants and Wilddex records survive actual save/load',()=>JSON.stringify(S.team[0].variant)===JSON.stringify(a.variant)&&S.variantDex[a.sp].bonded.huge);
    const old=fresh();delete old.variantDex;old.team=[plain];old.started=true;
    Arcade.save(KEY,old);load();
    check('old saves gain an empty record and ordinary creatures stay unchanged',()=>Object.keys(S.variantDex).length===0&&!S.team[0].variant&&JSON.stringify(S.team[0])===JSON.stringify(plain));
    check('fixed-rarity starters and guardians stay ordinary',()=>!newCreature('ripplet',5,{rar:1,born:'Your first partner.'}).variant&&!newCreature('elderhorn',10,{rar:4}).variant);
    const inherited=rollVariant(a.sp,()=>.01,[a]);
    check('a small inheritance roll echoes colour and size, with a fresh pattern',()=>inherited.gleaming&&inherited.size==='huge'&&inherited.mark!==a.variant.mark);
    const noInheritance=rollVariant(a.sp,()=>.9,[a]);
    check('parent looks are not guaranteed',()=>!noInheritance.gleaming&&!noInheritance.size);
    check('parent colour inheritance stays near its small 10 percent chance',()=>{
      let count=0;for(let i=0;i<10000;i++)count+=!!rollVariant(a.sp,random,[a]).gleaming;
      return count>=850&&count<=1250;
    });
    S=fresh();ensureRanch();S.coins=1000;
    const b=JSON.parse(JSON.stringify(a));b.uid+=1;a.bond=b.bond=20;a.hp=b.hp=stOf(a).hp;S.team=[a,b];
    check('real breeding stores a seeded cosmetic egg without changing the cost',()=>startBreed(a,b)&&S.coins===920&&S.eggs[0].child.variant.mark!==undefined);
    const eggVariant=JSON.stringify(S.eggs[0].child.variant);save();load();
    check('egg keeps its individual look through saving and hatching',()=>{const egg=S.eggs[0];hatch(egg);return JSON.stringify(egg.child.variant)===eggVariant&&S.variantDex[egg.child.sp].bonded.marked;});
    S=fresh();S.started=true;S.team=[plain];S.badges=['thorn','tide'];placeAt('thornwood');
    addRoamer();const r=WK.roam[WK.roam.length-1];r.variant={gleaming:true,size:'tiny',mark:311};B=null;TALK=null;meetRoamer(r);
    check('a visible roamer keeps exactly the same look when its battle begins',()=>JSON.stringify(B.foes[0].c.variant)===JSON.stringify(r.variant)&&S.variantDex[r.sp].seen.gleaming);
    B=null;
    for(const era of ['pocket','pixel','bit16','hd','diorama']) {
      check(era+' draws every cosmetic look and changes the rendered pixels',()=>{
        const cv=document.createElement('canvas');cv.width=180;cv.height=140;const ctx=ART[era].ctx?ART[era].ctx(cv.getContext('2d')):cv.getContext('2d');
        const pixels=spec=>{ctx.clearRect(0,0,180,140);ART[era].creature(ctx,70,115,4,spec,true,0,{});return cv.getContext('2d').getImageData(0,0,180,140).data;};
        const normal=pixels(SPECIES[a.sp]);
        return [{size:'tiny'},{size:'huge'},{gleaming:true},{mark:121},{mark:122}].every(variant=>{const drawn=pixels({...SPECIES[a.sp],variant});return drawn.some((v,i)=>v!==normal[i]);});
      });
    }
    check('drawing consumes no random rolls and restores canvas state',()=>{
      const cv=document.createElement('canvas');cv.width=140;cv.height=120;const ctx=cv.getContext('2d'),random=Math.random;let rolls=0;
      Math.random=()=>{rolls++;return .5;};ctx.globalAlpha=.75;ctx.fillStyle='#123456';
      try{ART.bit16.creature(ctx,50,100,3,sp(a),false,4,{});return rolls===0&&ctx.globalAlpha===.75&&ctx.fillStyle==='#123456';}finally{Math.random=random;}
    });
    check('Pocket variants retain the four-colour palette',()=>{
      const cv=document.createElement('canvas');cv.width=180;cv.height=140;const ctx=pocketCtx(cv.getContext('2d'));
      ART.pocket.creature(ctx,70,115,4,sp(a),true,0,{});
      const data=cv.getContext('2d').getImageData(0,0,180,140).data,colours=new Set();
      for(let i=0;i<data.length;i+=4)if(data[i+3])colours.add('#'+[data[i],data[i+1],data[i+2]].map(n=>n.toString(16).padStart(2,'0')).join(''));
      return [...colours].every(col=>POCKET.includes(col));
    });
    check('reduced motion keeps both markings and Gleaming stars still',()=>{
      const before=reduceMotion;reduceMotion=true;
      try{const cv=document.createElement('canvas');cv.width=180;cv.height=140;const ctx=cv.getContext('2d');
        const draw=t=>{ctx.clearRect(0,0,180,140);ART.bit16.creature(ctx,70,115,4,sp(a),true,t,{});return cv.getContext('2d').getImageData(0,0,180,140).data;};
        const first=draw(1),second=draw(10);return first.every((v,i)=>v===second[i]);
      }finally{reduceMotion=before;}
    });
  } finally { S=original;B=battle;WK.roam=[]; }
  return results;
}
