'use strict';
/* HD-2D (T13 part 2; unlocked by the Tide Badge): the same tile maps seen through a tilted camera. The ground is
   painted flat into a texture and laid out in perspective, row by row; people, creatures, trees, rocks, walls,
   fences and signs stand up as sprites; the distance fades into haze and goes soft (depth of field), and warm
   light and a vignette sit on top. It reuses the 16-bit sprites, so every species works here from day one.
   An era with world(ctx, w, h, view, t) draws the whole map itself (06-scene.js builds the view). The camera, haze,
   depth of field and light are the arcade's shared HD-2D renderer (shared/world.js, S4); this file paints Wildbond. */
ART.hd = (() => {
  const base = ART.bit16;
  const mk = () => { const c = document.createElement('canvas'); return [c, c.getContext('2d')]; };
  const [back, bx] = mk();
  const SRC = 16; // texture pixels per tile
  const STAND = { T: 1, R: 1, P: 1, '#': 1, D: 1, '=': 1, j: 1, q: 1 }; // tiles that stand up instead of lying flat
  const under = (ch, P) => ch === 'j' || ch === 'q' ? '~' : ch === 'R' && P.rockBase ? '_' : ch === '#' || ch === 'D' ? '.' : ',';
  const filterOK = 'filter' in bx;

  /* standing things, drawn up from their base line (x = left edge, y = ground) */
  function stand(c, ch, X, Y, s, P, t, gx0) {
    const u = s / 8, R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.floor(X + x * u), Math.floor(Y - (y + h) * u), Math.ceil(w * u), Math.ceil(h * u)); };
    if (ch === 'T') { const sw = reduceMotion ? 0 : Math.sin(t * 1.3 + gx0) * 0.3;
      R(3, 0, 2, 4.5, '#5a3c22'); R(3.5, 0, 0.6, 4.5, '#7a5634');
      R(-0.3, 4, 8.6, 5.4, P.treeDk); R(0.2, 4.4, 7.6, 4.8, P.tree); R(0.8 + sw, 8.8, 6.4, 3.2, P.treeDk); R(1.2 + sw, 9.1, 5.6, 2.7, P.tree);
      R(2 + sw * 1.5, 11.6, 4, 2, P.treeDk); R(2.4 + sw * 1.5, 11.8, 3.2, 1.6, P.tree);
      R(1, 7.8, 2.5, 1, P.treeLt); R(2 + sw, 10.8, 2, 0.8, P.treeLt); R(0.2, 4.4, 7.6, 0.9, P.treeDk); }
    else if (ch === 'R') { R(0.8, 0, 6.4, 4, P.rockDk); R(1.1, 0.4, 5.8, 3.4, P.rock); R(2, 3.6, 4, 1.2, P.rock); R(2, 3.2, 3, 0.8, P.rockLt); R(5.2, 0.8, 1.2, 2, P.rockDk); }
    else if (ch === 'P' || ch === 'q') { R(3.5, 0, 1, 4.5, '#5a3c22'); R(1, 3.5, 6, 3.5, '#5a3a1e'); R(1.3, 3.8, 5.4, 2.9, '#a0703a'); R(1.8, 5.6, 4.4, 0.4, '#6b4a2a'); R(1.8, 4.6, 3.4, 0.4, '#6b4a2a'); }
    else if (ch === '=') { R(0, 0, 1, 5, '#7a5028'); R(7, 0, 1, 5, '#7a5028'); R(0, 1.5, 8, 1, '#a0703a'); R(0, 3.5, 8, 1, '#a0703a'); R(0, 4.2, 8, 0.3, '#c8985a'); }
    else if (ch === 'j') { // shallow hull, seats and a rope down to the board landing
      R(1, .5, 6, 1.2, '#344c3f'); R(2, 0, 4, .7, '#182d31'); R(1.5, 1.7, 5, .6, '#ae8553');
      R(1, 1.6, 1, .8, '#57745b'); R(6, 1.6, 1, .8, '#344c3f');
      R(2, 2.2, 1, .4, '#e0c28e'); R(5, 2.2, 1, .4, '#e0c28e');
      R(6.5, 1.6, .4, 2.5, '#cfa96d'); R(6, 3.7, 1.4, .7, '#e0c28e'); R(3.5, -.7, .4, 1.5, '#ded2a7'); }
    else paintTile(c, ch, X, Y - s, s, P, t, 0, 0, true); // walls and doors: the 16-bit tile, upright
  }
  function light(c, W, H) {
    const sun = c.createRadialGradient(W * 0.2, -H * 0.3, 0, W * 0.2, -H * 0.3, W * 1.1);
    sun.addColorStop(0, 'rgba(255,236,190,.30)'); sun.addColorStop(1, 'rgba(255,236,190,0)'); c.fillStyle = sun; c.fillRect(0, 0, W, H);
    const vg = c.createRadialGradient(W / 2, H * 0.62, W * 0.3, W / 2, H * 0.62, W * 0.8);
    vg.addColorStop(0, 'rgba(10,12,30,0)'); vg.addColorStop(1, 'rgba(10,12,30,.38)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
  }

  /* the whole map, through the arcade's shared HD-2D renderer (shared/world.js): Wildbond paints the tiles and sprites */
  const HD = World.hd({ src: SRC });
  function world(c, W, H, v, t) {
    const { m, P } = v, bio = BIOMES[m.pal || m.biome];
    const things = v.things.map(q => ({ x: q.x, y: q.y, shadow: q.kind === 'item' ? 0.6 : 1, draw(cc, left, baseY, s, p, pass) {
      if (q.kind === 'item') base.item(cc, left, baseY - s * 0.95, s, t);
      else if (q.kind === 'pet') { const pp = s / (q.wild ? 15 : 17); base.creature(cc, p.x - 2 * pp, baseY - s * 0.02, pp, q.sp, q.right, q.t); }
      else { const top = baseY - s * (q.ride ? 1.3 : 0.95); base.walker(cc, left, top, s, q.look, q.dir, q.step); if (q.mark && pass !== 'shadow') drawMark(left, top, s, t); } } }));
    WK.cam = HD.draw(c, W, H, t, { rows: m.rows, px: v.px, py: v.py, sky: bio.sky, hill: bio.hill, haze: bio.sky[1],
      edgeFill: v.edge === 'R' ? P.rock : m.biome === 'saltmarsh' ? P.water : P.tree,
      flat: (g, ch, x, y, src, tt, tx, ty) => paintTile(g, ch, x, y, src, P, tt, tx, ty, true), under: ch => under(ch, P),
      stands: STAND, noShadow: { '#': 1, D: 1 }, stand: (cc, ch, left, baseY, s, tt, tx) => stand(cc, ch, left, baseY, s, P, tt, tx), things,
      lt: WLT, sun: wbSun(), lamps: doorLamps(m) }); // real shadows along the sun and from lit doors at night (06-scene.js)
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
