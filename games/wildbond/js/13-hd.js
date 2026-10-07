'use strict';
/* HD-2D (T13 part 2; unlocked by the Tide Badge): the same tile maps seen through a tilted camera. The ground is
   painted flat into a texture and laid out in perspective, row by row; people, creatures, trees, rocks, walls,
   fences and signs stand up as sprites; the distance fades into haze and goes soft (depth of field), and warm
   light and a vignette sit on top. It reuses the 16-bit sprites, so every species works here from day one.
   An era with world(ctx, w, h, view, t) draws the whole map itself (06-scene.js builds the view). */
ART.hd = (() => {
  const base = ART.bit16;
  const mk = () => { const c = document.createElement('canvas'); return [c, c.getContext('2d')]; };
  const [ground, gx] = mk(), [screen, sx] = mk(), [back, bx] = mk();
  const SRC = 16; // texture pixels per tile
  const STAND = { T: 1, R: 1, P: 1, '#': 1, D: 1, '=': 1 }; // tiles that stand up instead of lying flat
  const under = (ch, P) => ch === 'R' && P.rockBase ? '_' : ch === '#' || ch === 'D' ? '.' : ',';
  const filterOK = 'filter' in gx;
  const rgba = (hex, a) => `rgba(${[1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',')},${a})`;

  /* the camera: horizon at 20% of the height, your tamer at 80%, about 4 tiles from the lens */
  function camera(W, H, v) {
    const yh = H * 0.2, ys = H * 0.8, dp = 4.2, ts = H / 6.5;
    return { W, H, yh, dp, K: (ys - yh) * dp, F: ts * dp, px: v.px + 0.5, py: v.py + 0.5 };
  }
  function project(C, wx, wy) { const d = C.dp + (C.py - wy); if (d < 0.45) return null; const s = C.F / d; return { x: C.W / 2 + (wx - C.px) * s, y: C.yh + C.K / d, s, d }; }

  /* standing things, drawn up from their base line (x = left edge, y = ground) */
  function stand(c, ch, X, Y, s, P, t, gx0) {
    const u = s / 8, R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(X + x * u), Math.floor(Y - (y + h) * u), Math.ceil(w * u), Math.ceil(h * u)); };
    if (ch === 'T') { const sw = reduceMotion ? 0 : Math.sin(t * 1.3 + gx0) * 0.3;
      R(3, 0, 2, 4.5, '#5a3c22'); R(3.5, 0, 0.6, 4.5, '#7a5634');
      R(-0.3, 4, 8.6, 5.4, P.treeDk); R(0.2, 4.4, 7.6, 4.8, P.tree); R(0.8 + sw, 8.8, 6.4, 3.2, P.treeDk); R(1.2 + sw, 9.1, 5.6, 2.7, P.tree);
      R(2 + sw * 1.5, 11.6, 4, 2, P.treeDk); R(2.4 + sw * 1.5, 11.8, 3.2, 1.6, P.tree);
      R(1, 7.8, 2.5, 1, P.treeLt); R(2 + sw, 10.8, 2, 0.8, P.treeLt); R(0.2, 4.4, 7.6, 0.9, P.treeDk); }
    else if (ch === 'R') { R(0.8, 0, 6.4, 4, P.rockDk); R(1.1, 0.4, 5.8, 3.4, P.rock); R(2, 3.6, 4, 1.2, P.rock); R(2, 3.2, 3, 0.8, P.rockLt); R(5.2, 0.8, 1.2, 2, P.rockDk); }
    else if (ch === 'P') { R(3.5, 0, 1, 4.5, '#5a3c22'); R(1, 3.5, 6, 3.5, '#5a3a1e'); R(1.3, 3.8, 5.4, 2.9, '#a0703a'); R(1.8, 5.6, 4.4, 0.4, '#6b4a2a'); R(1.8, 4.6, 3.4, 0.4, '#6b4a2a'); }
    else if (ch === '=') { R(0, 0, 1, 5, '#7a5028'); R(7, 0, 1, 5, '#7a5028'); R(0, 1.5, 8, 1, '#a0703a'); R(0, 3.5, 8, 1, '#a0703a'); R(0, 4.2, 8, 0.3, '#c8985a'); }
    else paintTile(c, ch, X, Y - s, s, P, t, 0, 0, true); // walls and doors: the 16-bit tile, upright
  }
  function shadow(c, x, y, s) { c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(x, y, s * 0.42, s * 0.12, 0, 0, 7); c.fill(); }
  function light(c, W, H) {
    const sun = c.createRadialGradient(W * 0.2, -H * 0.3, 0, W * 0.2, -H * 0.3, W * 1.1);
    sun.addColorStop(0, 'rgba(255,236,190,.30)'); sun.addColorStop(1, 'rgba(255,236,190,0)'); c.fillStyle = sun; c.fillRect(0, 0, W, H);
    const vg = c.createRadialGradient(W / 2, H * 0.62, W * 0.3, W / 2, H * 0.62, W * 0.8);
    vg.addColorStop(0, 'rgba(10,12,30,0)'); vg.addColorStop(1, 'rgba(10,12,30,.38)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
  }

  function world(c, W, H, v, t) {
    const { m, P } = v, rows = m.rows.length, cols = m.rows[0].length, C = camera(W, H, v), bio = BIOMES[m.pal || m.biome];
    // 1. the flat ground texture
    if (ground.width !== cols * SRC || ground.height !== rows * SRC) { ground.width = cols * SRC; ground.height = rows * SRC; }
    gx.imageSmoothingEnabled = false;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const ch = m.rows[y][x]; paintTile(gx, STAND[ch] ? under(ch, P) : ch, x * SRC, y * SRC, SRC, P, t, x, y, true); }
    // 2. sky and far hills, then the ground in perspective, one screen row at a time
    if (screen.width !== Math.ceil(W) || screen.height !== Math.ceil(H)) { screen.width = Math.ceil(W); screen.height = Math.ceil(H); }
    sx.imageSmoothingEnabled = false;
    const sky = sx.createLinearGradient(0, 0, 0, C.yh); sky.addColorStop(0, bio.sky[0]); sky.addColorStop(1, bio.sky[1]); sx.fillStyle = sky; sx.fillRect(0, 0, W, C.yh + 1);
    sx.fillStyle = tint(bio.hill, bio.sky[1], 0.4); sx.beginPath(); sx.moveTo(0, C.yh + 1);
    for (let x = 0; x <= W + 8; x += 8) sx.lineTo(x, C.yh - H * 0.05 - Math.sin(x * 0.012 + C.px * 0.1) * H * 0.035 - Math.sin(x * 0.043) * H * 0.012);
    sx.lineTo(W, C.yh + 1); sx.fill();
    sx.fillStyle = v.edge === 'R' ? P.rock : m.biome === 'saltmarsh' ? P.water : P.tree; sx.fillRect(0, C.yh, W, H - C.yh);
    for (let y = Math.floor(C.yh) + 1; y < H; y++) {
      const d = C.K / (y - C.yh), wy = C.py - (d - C.dp); if (d > 18 || wy < 0 || wy >= rows) continue;
      const s = C.F / d, half = W / 2 / s;
      sx.drawImage(ground, (C.px - half) * SRC, Math.floor(wy * SRC), 2 * half * SRC, 1, 0, y, W, 1);
    }
    // 3. haze toward the horizon
    const fogTo = C.yh + (H * 0.8 - C.yh) * 0.4, fog = sx.createLinearGradient(0, C.yh - H * 0.08, 0, fogTo);
    fog.addColorStop(0, rgba(bio.sky[1], 0.9)); fog.addColorStop(1, rgba(bio.sky[1], 0)); sx.fillStyle = fog; sx.fillRect(0, C.yh - H * 0.08, W, fogTo - C.yh + H * 0.08);
    c.drawImage(screen, 0, 0, W, H);
    // 4. depth of field: the far distance goes soft
    if (filterOK) { const b1 = C.yh + (H - C.yh) * 0.16, b2 = C.yh + (H - C.yh) * 0.28; c.save();
      c.filter = 'blur(1px)'; c.drawImage(screen, 0, 0, W, b2, 0, 0, W, b2); c.filter = 'blur(2px)'; c.drawImage(screen, 0, 0, W, b1, 0, 0, W, b1); c.restore(); }
    // 5. everything that stands up, far to near
    const list = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const ch = m.rows[y][x]; if (STAND[ch]) list.push({ tile: ch, x, y }); }
    for (const q of v.things) list.push(q);
    list.sort((a, b) => a.y - b.y || (a.tile ? -1 : 1));
    for (const q of list) {
      const p = project(C, q.x + 0.5, q.y + 0.92); if (!p || p.d > 17 || p.y - p.s * 2.5 > H) continue;
      const s = p.s, left = p.x - s / 2; if (left > W + s || left + s < -s) continue;
      if (q.tile) { if (q.tile !== '#' && q.tile !== 'D') shadow(c, p.x, p.y, s); stand(c, q.tile, left, p.y, s, P, t, q.x); continue; }
      shadow(c, p.x, p.y, s * (q.kind === 'item' ? 0.6 : 1));
      if (q.kind === 'item') base.item(c, left, p.y - s * 0.95, s, t);
      else if (q.kind === 'pet') { const pp = s / (q.wild ? 15 : 17); base.creature(c, p.x - 2 * pp, p.y - s * 0.02, pp, q.sp, q.right, q.t); }
      else { base.walker(c, left, p.y - s * 0.95, s, q.look, q.dir, q.step); if (q.mark) drawMark(left, p.y - s * 0.95, s, t); }
    }
    light(c, W, H);
    // tapping the ground: screen -> tile
    WK.cam = { inv(mx, my) { if (my <= C.yh + 2) return []; const d = C.K / (my - C.yh), s = C.F / d; return [Math.floor(C.px + (mx - W / 2) / s), Math.floor(C.py - (d - C.dp))]; } };
  }
  /* battles: the 16-bit scene with the background softly out of focus and the same light */
  function backdrop(c, w, h, bio, t) {
    if (back.width !== Math.ceil(w) || back.height !== Math.ceil(h)) { back.width = Math.ceil(w); back.height = Math.ceil(h); }
    bx.setTransform(1, 0, 0, 1, 0, 0); bx.imageSmoothingEnabled = false;
    const gy = base.backdrop(bx, w, h, bio, t);
    c.save(); if (filterOK) c.filter = 'blur(1.3px)'; c.drawImage(back, 0, 0, w, h); c.restore();
    light(c, w, h); return gy;
  }
  return Object.assign({}, base, { world, backdrop, light: true });
})();
