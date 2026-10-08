'use strict';
/* T33: cosmetic individuality. No stat, rarity, capture or progression multipliers. */
const VARIANTS = { gleam: 1 / 200, size: 1 / 25, inherit: .1, families: ['cat', 'hyena', 'spider', 'bird'] };
function rollVariant(id, random = Math.random, parents = []) {
  const v = {}, colour = random(), size = random();
  if (colour < VARIANTS.gleam) v.gleaming = true;
  if (size < VARIANTS.size) v.size = 'tiny';
  else if (size < 2 * VARIANTS.size) v.size = 'huge';
  if (VARIANTS.families.includes(SPECIES[id].fam)) v.mark = Math.floor(random() * 4294967296) >>> 0;
  // Each feature can echo a parent at 10%; markings receive their own new seed.
  const p = parents.filter(c => c && c.variant);
  if (p.length) {
    const inherited = p[Math.floor(random() * p.length)].variant;
    if (inherited.gleaming && random() < VARIANTS.inherit) v.gleaming = true;
    if (inherited.size && random() < VARIANTS.inherit) v.size = inherited.size;
  }
  return Object.keys(v).length ? v : undefined;
}
function variantLabel(c) {
  const v = c.variant || {}, words = [];
  if (v.gleaming) words.push('Gleaming');
  if (['tiny', 'huge'].includes(v.size)) words.push(v.size);
  if (v.mark !== undefined) words.push('individual markings');
  return words.join(', ');
}
function variantScale(v) { return v && v.size === 'tiny' ? .85 : v && v.size === 'huge' ? 1.15 : 1; }
function variantKey(v) { return v ? [!!v.gleaming, v.size || '', v.mark === undefined ? '' : v.mark].join(':') : ''; }
function variantSpecies(c) { return c.variant ? Object.assign({}, SPECIES[c.sp], { variant: c.variant }) : SPECIES[c.sp]; }
function variantRecord(c, bonded) {
  if (!c.variant) return;
  S.seen[c.sp] = true;
  S.variantDex = S.variantDex || {};
  const entry = S.variantDex[c.sp] || (S.variantDex[c.sp] = { seen: {}, bonded: {} });
  for (const key of ['gleaming', 'tiny', 'huge', 'marked']) {
    const present = key === 'gleaming' ? c.variant.gleaming : key === 'marked' ? c.variant.mark !== undefined : c.variant.size === key;
    if (present) { entry.seen[key] = true; if (bonded) entry.bonded[key] = true; }
  }
}
function variantDexHTML(id) {
  const entry = (S.variantDex || {})[id]; if (!entry) return '';
  const names = { gleaming: 'Gleaming', tiny: 'tiny', huge: 'huge', marked: 'individual markings' };
  const labels = Object.keys(names).filter(k => entry.seen[k]).map(k => names[k] + (entry.bonded[k] ? ' (bonded)' : ' (seen)'));
  return labels.length ? `<div class="meta">Looks recorded: ${labels.join(' · ')}. Cosmetic only.</div>` : '';
}
function variantPortrait(cv) {
  const raw = cv.dataset.variant;
  return raw ? Object.assign({}, SPECIES[cv.dataset.sp], { variant: JSON.parse(decodeURIComponent(raw)) }) : SPECIES[cv.dataset.sp];
}
function gleamColour(col) {
  // Complementary dawn tones retain luminance contrast with the creature's ink.
  const n = parseInt(col.slice(1), 16), rgb = [n >> 16 & 255, n >> 8 & 255, n & 255];
  return '#' + [rgb[2], rgb[0], rgb[1]].map(x => Math.round(80 + x * .6).toString(16).padStart(2, '0')).join('');
}
function variantMarks(seed) {
  let n = seed >>> 0;
  const next = () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
  return Array.from({ length: 7 }, () => ({ x: next(), y: next(), stripe: next() < .45 }));
}
const variantCanvas = document.createElement('canvas');
function drawVariant(base, ctx, x, y, p, species, right, time, opts, pocket) {
  const v = species.variant;
  if (!v || opts && opts.col) return base(ctx, x, y, p, species, right, time, opts);
  p *= variantScale(v);
  const options = Object.assign({}, opts);
  if (v.gleaming) options.col = gleamColour(species.col);
  // Mask marks to the body on a reusable-sized local canvas; eyes, face and feet remain clear.
  const cv = variantCanvas, width = Math.ceil(p * 42), height = Math.ceil(p * 40);
  if (cv.width !== width) cv.width = width;
  if (cv.height !== height) cv.height = height;
  const raw = cv.getContext('2d'), c = pocket ? pocketCtx(raw) : raw, ax = p * 17, ay = p * 36;
  c.clearRect(0, 0, cv.width, cv.height);
  c.imageSmoothingEnabled = false;
  base(c, ax, ay, p, species, right, time, options);
  if (v.mark !== undefined) {
    c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = pocket ? '#19202f' : 'rgba(25,31,47,.48)';
    const body = species.fam === 'bird' ? [0, 6, 5, 3] : species.fam === 'spider' ? [0, 8, 7, 3] : [0, 8, 7, 3];
    const bp = species.big ? p * 1.25 : p;
    for (const m of variantMarks(v.mark)) {
      const px = (body[0] + m.x * body[2]) * bp, py = (-14 + body[1] + m.y * body[3]) * bp;
      c.fillRect(Math.round(ax + (right ? 4 * bp - px : px)), Math.round(ay + py), Math.max(1, Math.round(bp)), Math.max(1, Math.round(bp * (m.stripe ? 2 : 1))));
    }
    c.restore();
  }
  if (pocket) {
    // Fractional size units can blend edge pixels. Snap the finished sprite to its four inks.
    const image = raw.getImageData(0, 0, cv.width, cv.height), d = image.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) { d[i + 3] = 0; continue; }
      const ink = pocketColor(`rgb(${d[i]},${d[i + 1]},${d[i + 2]})`);
      d[i] = parseInt(ink.slice(1,3),16); d[i + 1] = parseInt(ink.slice(3,5),16); d[i + 2] = parseInt(ink.slice(5,7),16); d[i + 3] = 255;
    }
    raw.putImageData(image, 0, 0);
  }
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(cv, Math.round(x - ax), Math.round(y - ay)); ctx.restore();
  if (v.gleaming) {
    // A steady pair of stars under reduced motion; no flash or gameplay randomness.
    const drift = reduceMotion ? 0 : Math.sin((time || 0) * 1.5) * p;
    ctx.save(); ctx.fillStyle = '#fff3a4'; ctx.globalAlpha *= opts && opts.alpha !== undefined ? opts.alpha : 1;
    for (const [dx, dy] of [[-8, -11], [12, -16]]) {
      const sx = Math.round(x + dx * p), sy = Math.round(y + dy * p + drift), u = Math.max(1, Math.round(p * .5));
      ctx.fillRect(sx - u, sy, u * 3, u); ctx.fillRect(sx, sy - u, u, u * 3);
    }
    ctx.restore();
  }
}

/* Small adapters keep the screen rebuild independent. Each original function is called once. */
(() => {
  let roaming = null;
  const make = newCreature;
  newCreature = function(id, level, opts) {
    const c = make(id, level, opts);
    const v = roaming ? roaming.variant : (!opts || opts.rar === undefined) ? rollVariant(id) : undefined;
    if (v) c.variant = Object.assign({}, v);
    return c;
  };
  const species = sp; sp = c => c.variant ? variantSpecies(c) : species(c);
  const bond = keep; keep = function(c, how) { const where = bond(c, how); variantRecord(c, true); return where; };
  const battle = startBattle;
  startBattle = function(kind, foes, opts) { const result = battle(kind, foes, opts); for (const c of foes) variantRecord(c, false); return result; };
  const breed = startBreed;
  startBreed = function(a, b) { const ok = breed(a, b); if (ok) { const c = S.eggs[S.eggs.length - 1].child, v = rollVariant(c.sp, Math.random, [a, b]); if (v) c.variant = v; } return ok; };
  const milestone = towerMilestone;
  towerMilestone = function(floor) { ensureRanch(); const before = S.eggs.length, result = milestone(floor); if (S.eggs.length > before) { const c = S.eggs[S.eggs.length - 1].child, v = rollVariant(c.sp); if (v) c.variant = v; } return result; };
  const growCreature = grow;
  grow = function(c, xp) { const old = c.sp, result = growCreature(c, xp); if (c.sp !== old) variantRecord(c, true); return result; };
  const add = addRoamer;
  addRoamer = function() { const length = WK.roam.length; add(); if (WK.roam.length > length) { const r = WK.roam[WK.roam.length - 1], v = rollVariant(r.sp); if (v) r.variant = v; variantRecord(r, false); } };
  const meet = meetRoamer;
  meetRoamer = function(r) { roaming = r; try { return meet(r); } finally { roaming = null; } };
  // Rebuild only when the record changes; no new layout or styles.
  const dexKey = TABS.dex.key; TABS.dex.key = () => dexKey() + ':' + JSON.stringify(S.variantDex || {});
  for (const id of Object.keys(ART)) {
    const base = ART[id].creature;
    ART[id].creature = (ctx,x,y,p,s,right,t,o) => drawVariant(base,ctx,x,y,p,s,right,t,o,id === 'pocket');
  }
})();
