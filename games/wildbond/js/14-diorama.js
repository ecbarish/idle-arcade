'use strict';
/* Diorama (T13 part 3; unlocked by the Ember Badge): the same tile maps built as a little voxel world on a table,
   drawn with three.js (loaded from cdnjs the first time the era is used; until then, or offline, HD-2D stands in).
   Every tile becomes a few blocks; people, creatures and items are their 16-bit pixel art pushed out into voxels,
   so every species works from day one. Drag the scene to turn the camera, scroll to zoom. Battles use HD-2D.
   The WebGL canvas sits under the 2D scene canvas, which stays clear here so labels, weather and night still draw
   on top. dioramaShow(on) hides the WebGL canvas whenever another view is drawn. */
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
const DIO = { T: null, loading: false, failed: false, yaw: 0.35, pitch: 0.9, dist: 16, drag: null, turn: 0 };
function dioramaShow(on) { if (DIO.gl) DIO.gl.style.display = on ? '' : 'none'; }
ART.diorama = (() => {
  const hd = ART.hd;
  let T, R, scene, camera, sun, hemi, terrain = null, terrainKey = '', spriteMat, markMat, pool = [];
  const geos = new Map(), boxGeo = () => new T.BoxGeometry(1, 1, 1);

  function load() {
    if (DIO.T || DIO.loading || DIO.failed) return; DIO.loading = true;
    const s = document.createElement('script'); s.src = THREE_URL; s.crossOrigin = 'anonymous';
    s.onload = () => { DIO.loading = false; if (window.THREE) { DIO.T = T = window.THREE; setup(); } else DIO.failed = true; };
    s.onerror = () => { DIO.loading = false; DIO.failed = true; };
    document.head.appendChild(s);
  }
  function setup() {
    const gl = DIO.gl = document.createElement('canvas'); gl.className = 'gl'; gl.setAttribute('aria-hidden', 'true');
    const host = $('.scene'); host.insertBefore(gl, host.firstChild);
    R = new T.WebGLRenderer({ canvas: gl, antialias: true }); R.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
    scene = new T.Scene(); camera = new T.PerspectiveCamera(32, 2, 0.1, 200);
    hemi = new T.HemisphereLight(0xffffff, 0x556655, 0.72); scene.add(hemi);
    sun = new T.DirectionalLight(0xfff0d8, 0.8); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 80 }); scene.add(sun, sun.target);
    spriteMat = new T.MeshLambertMaterial({ vertexColors: true });
    markMat = new T.MeshLambertMaterial({ color: 0xf2c14e, emissive: 0x6a5010 });
  }

  /* ---- the map as blocks: [x, y, z, width, height, depth, color]; y is up, a tile is 1 unit, z grows southward ---- */
  function buildTerrain(m, P) {
    const B = [], add = (x, y, z, w, h, d, col) => B.push([x, y, z, w, h, d, col]);
    const rows = m.rows.length, cols = m.rows[0].length, hsh = (x, y, n) => (((x * 73856093) ^ (y * 19349663)) >>> n) & 7;
    add(cols / 2, -0.85, rows / 2, cols, 0.9, rows, '#5a4434'); add(cols / 2, -1.33, rows / 2, cols + 0.3, 0.06, rows + 0.3, '#3a2c22'); // the table-top block
    const top = (x, z, h, col) => add(x + 0.5, -0.4 + h / 2, z + 0.5, 1, 0.8 + h, 1, col); // a column of ground, its top at height h
    for (let z = 0; z < rows; z++) for (let x = 0; x < cols; x++) {
      const ch = m.rows[z][x], cxm = x + 0.5, czm = z + 0.5, below = m.rows[z + 1] && m.rows[z + 1][x];
      switch (ch) {
        case '.': case 'N': case 'S': case 'E': case 'W': top(x, z, -0.04, P.path); break;
        case '_': top(x, z, -0.02, P.sand); break;
        case '~': top(x, z, -0.22, P.water); add(cxm, -0.2, czm, 1, 0.02, 1, P.waterLt); break;
        case 'b': top(x, z, -.14, P.water);
          for (let i = 0; i < 4; i++) { add(cxm, .015, z + .125 + i * .25, 1, .1, .23, '#a17b4e'); add(x + .12, .07, z + .125 + i * .25, .035, .025, .035, '#503d2c'); }
          add(x + .1, -.11, czm, .1, .28, .12, '#604b34'); add(x + .9, -.11, czm, .1, .28, .12, '#604b34'); break;
        case 'j': top(x, z, -.22, P.water);
          add(cxm, -.12, czm, .65, .12, .72, '#344c3f'); add(cxm, -.025, czm, .5, .06, .6, '#ae8553');
          for (const side of [-1, 1]) { add(cxm + side * .29, .04, czm, .08, .24, .72, '#57745b'); add(cxm, .04, czm + side * .34, .52, .2, .08, '#344c3f'); }
          for (const seat of [-.16, .16]) add(cxm, .12, czm + seat, .5, .06, .12, '#e0c28e');
          add(cxm + .38, .15, czm, .045, .04, .85, '#cfa96d'); add(cxm + .38, .15, czm - .38, .12, .05, .16, '#e0c28e');
          add(cxm, -.025, czm + .42, .035, .035, .2, '#ded2a7'); break;
        case 'o': top(x, z, 0, P.grass); add(cxm, -0.02, czm, 0.8, 0.06, 0.8, '#f0b070'); add(cxm + 0.15, 0.25, czm, 0.12, 0.12, 0.12, '#ffffff'); break;
        case '"': top(x, z, 0, P.grass); for (let i = 0; i < 4; i++) add(x + 0.2 + i * 0.2, 0.2 + hsh(x, z, i * 3) * 0.015, czm + ((i % 2) - 0.5) * 0.3, 0.12, 0.42 + hsh(x, z, i * 3) * 0.03, 0.12, i % 2 ? P.tall : P.tallLt); break;
        case 'f': top(x, z, 0, P.grass); add(cxm - 0.2, 0.05, czm, 0.12, 0.1, 0.12, ['#f2d24a', '#f07a9a', '#ffffff'][hsh(x, z, 2) % 3]); add(cxm + 0.25, 0.05, czm + 0.2, 0.12, 0.1, 0.12, '#ffffff'); break;
        case 'T': top(x, z, 0, P.grass); add(cxm, 0.35, czm, 0.24, 0.7, 0.24, '#6b4a2a'); add(cxm, 0.95, czm, 0.95, 0.65, 0.95, P.tree); add(cxm, 1.45, czm, 0.6, 0.4, 0.6, P.treeLt); break;
        case 'R': top(x, z, 0, P.rockBase || P.grass); add(cxm, 0.26, czm, 0.8, 0.52, 0.72, P.rock); add(cxm - 0.05, 0.58, czm, 0.5, 0.14, 0.45, P.rockLt); break;
        case 'P': case 'q': top(x, z, ch === 'q' ? -.22 : 0, ch === 'q' ? P.water : P.grass); add(cxm, 0.3, czm, 0.1, 0.6, 0.1, '#6b4a2a'); add(cxm, 0.62, czm + 0.06, 0.7, 0.36, 0.08, '#a0703a'); break;
        case '=': top(x, z, 0, P.grass); add(x + 0.06, 0.26, czm, 0.12, 0.52, 0.12, '#7a5028'); add(x + 0.94, 0.26, czm, 0.12, 0.52, 0.12, '#7a5028');
          add(cxm, 0.22, czm, 1, 0.08, 0.06, '#a0703a'); add(cxm, 0.42, czm, 1, 0.08, 0.06, '#a0703a'); break;
        case 'r': { const front = below === '#' || below === 'D'; add(cxm, front ? 0.75 : 0.9, czm, 1, front ? 1.5 : 1.8, 1, P.roof);
          add(cxm, front ? 1.52 : 1.82, czm, 1.02, 0.06, 1.02, P.roofDk); break; }
        case '#': add(cxm, 0.6, czm, 1, 1.2, 1, '#eadfc4'); add(cxm, 0.04, czm + 0.01, 1.01, 0.08, 1.01, '#b8a888');
          if (hsh(x, z, 1) % 2) add(cxm, 0.68, czm + 0.5, 0.45, 0.35, 0.04, '#6aa0c8'); break;
        case 'D': add(cxm, 0.6, czm, 1, 1.2, 1, '#eadfc4'); add(cxm, 0.42, czm + 0.5, 0.45, 0.84, 0.05, '#7a4a2a'); add(cxm + 0.13, 0.42, czm + 0.53, 0.06, 0.06, 0.03, '#f2d24a'); break;
        default: top(x, z, 0, P.grass);
      }
    }
    const mesh = new T.InstancedMesh(boxGeo(), new T.MeshLambertMaterial(), B.length), mt = new T.Matrix4(), col = new T.Color();
    B.forEach(([x, y, z, w, h, d, c], i) => { mt.makeScale(w, h, d); mt.setPosition(x, y, z); mesh.setMatrixAt(i, mt); mesh.setColorAt(i, col.set(c)); });
    mesh.castShadow = mesh.receiveShadow = true; return mesh;
  }

  /* ---- pixel art pushed out into voxels (two voxels deep), anchored at the feet, cached per look ---- */
  function voxelGeo(key, w, h, draw, vs) {
    if (geos.has(key)) return geos.get(key);
    const cv2 = document.createElement('canvas'); cv2.width = w; cv2.height = h; const c2 = cv2.getContext('2d'); c2.imageSmoothingEnabled = false; draw(c2);
    const d = c2.getImageData(0, 0, w, h).data, on = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 140;
    let bottom = 0, minX = w, maxX = 0; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (on(x, y)) { bottom = Math.max(bottom, y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
    const mid = (minX + maxX + 1) / 2, pos = [], colr = [], D = vs;
    const quad = (a, b, c, e, rgb) => { for (const v of [a, b, c, a, c, e]) { pos.push(...v); colr.push(...rgb); } };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!on(x, y)) continue; const i = (y * w + x) * 4, rgb = [d[i] / 255, d[i + 1] / 255, d[i + 2] / 255];
      const x0 = (x - mid) * vs, x1 = x0 + vs, y0 = (bottom - y) * vs, y1 = y0 + vs, z0 = -D, z1 = D;
      quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], rgb); quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], rgb);
      if (!on(x + 1, y)) quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], rgb);
      if (!on(x - 1, y)) quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], rgb);
      if (!on(x, y - 1)) quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], rgb);
      if (!on(x, y + 1)) quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], rgb);
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(colr, 3)); g.computeVertexNormals();
    if (geos.size > 300) { for (const [k, old] of geos) { old.dispose(); geos.delete(k); if (geos.size < 200) break; } }
    geos.set(key, g); return g;
  }
  function thingGeo(q) {
    if (q.kind === 'item') return voxelGeo('item', 16, 16, c2 => paintItem(c2, 0, 0, 16, 0, true), 1 / 18);
    if (q.kind === 'pet') return voxelGeo('c:' + q.sp.name + ':' + variantKey(q.sp.variant) + ':' + (q.right ? 1 : 0), 44, 40, c2 => ART.bit16.creature(c2, 12, 34, 1, q.sp, q.right, 0), 1 / 22);
    const L = q.look; return voxelGeo(`w:${L.skin}${L.hair}${L.hairCol}${L.hatCol || ''}${L.shirt}:${q.dir}:${q.step}`, 24, 28, c2 => paintWalker(c2, 4, 10, 16, L, q.dir, q.step, true), 1 / 16);
  }

  function world(c, W, H, v, t) {
    if (!DIO.T) { load(); return hd.world(c, W, H, v, t); } // while three.js loads (or if it can't), HD-2D stands in
    T = DIO.T; dioramaShow(true);
    const { m, P } = v, bio = BIOMES[m.pal || m.biome], key = S.pos.map;
    if (key !== terrainKey) { if (terrain) { scene.remove(terrain); terrain.geometry.dispose(); terrain.material.dispose(); }
      terrain = buildTerrain(m, P); scene.add(terrain); terrainKey = key; scene.background = new T.Color(bio.sky[1]); scene.fog = new T.Fog(bio.sky[1], 26, 60); }
    const buf = R.getSize(new T.Vector2()); if (Math.abs(buf.x - W) > 0.5 || Math.abs(buf.y - H) > 0.5) { R.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
    // people, creatures and items
    let i = 0;
    const slot = () => pool[i] || (pool[i] = (() => { const ms = new T.Mesh(undefined, spriteMat); ms.castShadow = true; scene.add(ms); return ms; })());
    for (const q of v.things) {
      const mesh = slot(); i++;
      mesh.geometry = thingGeo(q); mesh.material = spriteMat; mesh.scale.set(1, 1, 1); mesh.visible = true;
      mesh.position.set(q.x + 0.5, q.ride ? 0.42 : 0, q.y + 0.55); mesh.rotation.y = DIO.yaw;
      if (q.mark) { const mk = slot(); i++; mk.geometry = DIO.box || (DIO.box = boxGeo()); mk.material = markMat; mk.visible = true; mk.scale.set(0.16, 0.3, 0.16);
        mk.position.set(q.x + 0.5, 2 + (reduceMotion ? 0 : Math.abs(Math.sin(t * 4)) * 0.12), q.y + 0.55); }
    }
    for (; i < pool.length; i++) pool[i].visible = false;
    // the camera orbits your tamer
    const tx = v.px + 0.5, tz = v.py + 0.5, cp = Math.cos(DIO.pitch);
    camera.position.set(tx + Math.sin(DIO.yaw) * DIO.dist * cp, Math.sin(DIO.pitch) * DIO.dist, tz + Math.cos(DIO.yaw) * DIO.dist * cp); camera.lookAt(tx, 0.3, tz);
    sun.position.set(tx - 7, 14, tz + 5); sun.target.position.set(tx, 0, tz);
    DIO.turn = ((Math.round(DIO.yaw / (Math.PI / 2)) % 4) + 4) % 4;
    R.render(scene, camera);
    c.clearRect(0, 0, W, H);
    // tapping the ground: screen -> tile, through the camera
    const ray = new T.Raycaster(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hit = new T.Vector3();
    WK.cam = { fwd(wx, wy) { const v = new T.Vector3(wx, 0.5, wy).project(camera); return v.z < 1 ? [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, H / 12] : null; }, inv(mx, my) { ray.setFromCamera({ x: mx / W * 2 - 1, y: -(my / H) * 2 + 1 }, camera); return ray.ray.intersectPlane(plane, hit) ? [Math.floor(hit.x), Math.floor(hit.z)] : []; } };
    return true;
  }
  return Object.assign({}, hd, { world });
})();

/* drag to turn the diorama, scroll to zoom (only while it's showing) */
(() => {
  const live = () => DIO.gl && DIO.gl.style.display !== 'none' && S.era === 'diorama';
  cv.addEventListener('pointerdown', e => { if (live()) DIO.drag = { x: e.clientX, y: e.clientY, moved: false }; });
  addEventListener('pointermove', e => { const d = DIO.drag; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return; d.moved = true; d.x = e.clientX; d.y = e.clientY;
    DIO.yaw -= dx * 0.008; DIO.pitch = clamp(DIO.pitch + dy * 0.006, 0.45, 1.35); });
  addEventListener('pointerup', () => { if (DIO.drag && DIO.drag.moved) WK.dragged = true; DIO.drag = null; });
  cv.addEventListener('wheel', e => { if (!live()) return; e.preventDefault(); DIO.dist = clamp(DIO.dist * (e.deltaY > 0 ? 1.1 : 0.9), 6, 24); }, { passive: false });
})();
