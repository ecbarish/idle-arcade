'use strict';
/* S5: living scenes, on the arcade's shared ambience kit (shared/ambience.js). Every zone has its own sky, distant
   scenery that scrolls past while you travel and sways in the wind, weather that changes every few minutes (rain,
   thunderstorms with lightning and thunder, snow and blizzards, fog, dust, ashfall), its own small life (birds,
   bats at dusk, fireflies, grave-wisps, spores, far-off drakes) and a day/night cycle of 24 real minutes: stars,
   the moon, aurora over Frostmere, and real pools of light at night (your own glow, a campfire when you rest, the
   inn's windows in town). Dungeons get flickering torches and their own air (embers in the Foundry, wisps in the
   Barrows, spores in Rootrot Hollow, braziers in the Hollow Throne). Purely visual: nothing here changes the game. */
const AMB = Ambience.create({ reduce: () => reduce });
const AMB_DAY = 1440; // seconds in a day/night cycle
/* zone looks: far scenery layers (base and height as a share of the scene), effects, weather pool */
const AMB_ZONES = {
  thornvale: { sun: 1, clouds: 6, birds: 4, far: [{ kind: 'peaks', col: '#7f9dbd', base: .6, h: .2, par: .05 }, { kind: 'oaks', col: '#3f6b36', base: .72, h: .22, par: .25 }],
    fx: { leaves: .35 }, nightFx: { fireflies: .8 }, weather: ['clear', 'clear', 'clear', 'rain', 'storm'] },
  redsand: { sun: 1, clouds: 2, birds: 2, far: [{ kind: 'mesas', col: '#b4643c', base: .62, h: .24, par: .06 }, { kind: 'mesas', col: '#9a4f2c', base: .72, h: .12, par: .2, seed: 3 }],
    fx: { dust: .5, dustCol: '#f6cf94' }, nightFx: {}, weather: ['clear', 'clear', 'dust'] },
  fens: { clouds: 7, birds: 2, far: [{ kind: 'dead', col: '#3f554a', base: .72, h: .3, par: .2 }, { kind: 'reeds', col: '#35513b', base: .78, h: .09, par: .55 }],
    fx: { fog: .6, fireflies: .35 }, nightFx: { fireflies: 1 }, weather: ['drizzle', 'fog', 'storm', 'clear', 'drizzle'] },
  ashen: { clouds: 4, cloudCol: '#6e5a58', far: [{ kind: 'peaks', col: '#3c2a2e', base: .6, h: .32, par: .06, glow: '#ff6a2a' }, { kind: 'dead', col: '#2b2024', base: .74, h: .2, par: .22 }],
    fx: { embers: .7, ash: .25 }, nightFx: { embers: 1 }, weather: ['clear', 'ashfall', 'clear'] },
  frostmere: { clouds: 4, cloudCol: '#d8e5f0', aurora: 1, far: [{ kind: 'peaks', col: '#7295b6', base: .58, h: .32, par: .05, snow: 1 }, { kind: 'pines', col: '#35566a', base: .74, h: .24, par: .22 }],
    fx: { snow: .45 }, nightFx: {}, weather: ['snow', 'clear', 'blizzard', 'snow'] },
  barrowfield: { clouds: 6, birds: 3, birdCol: '#151820', far: [{ kind: 'dead', col: '#3b4653', base: .7, h: .26, par: .12 }, { kind: 'stones', col: '#44515f', base: .76, h: .2, par: .25 }],
    fx: { fog: .5, wisps: .7 }, nightFx: { wisps: 1.2 }, weather: ['fog', 'clear', 'drizzle', 'fog'] },
  hollowcrown: { clouds: 3, drakes: 1, far: [{ kind: 'canopy', col: '#34442a', base: .7, h: .42, par: .14, light: '#d8c860' }, { kind: 'canopy', col: '#2b3a20', base: .78, h: .3, par: .3, seed: 2 }],
    fx: { spores: .8 }, nightFx: { spores: 1, fireflies: .4 }, weather: ['clear', 'rain', 'storm', 'clear'] },
  crownheart: { clouds: 3, drakes: 2, far: [{ kind: 'canopy', col: '#2a2a18', base: .72, h: .45, par: .14, light: '#f2c14e' }, { kind: 'ruins', col: '#3a3420', base: .78, h: .22, par: .3 }],
    fx: { spores: 1, sporeCol: '#f2d77a' }, nightFx: { spores: 1.2 }, weather: ['clear', 'storm', 'clear'] }
};
const AMB_DUNGEONS = {
  sanctum: { fx: { rain: .12, dust: .3 }, torch: '#6ac8ff' }, foundry: { fx: { embers: 1, ash: .3 } }, barrows: { fx: { fog: .5, wisps: .8 } },
  rootrot: { fx: { spores: .9 } }, heartwood: { fx: { spores: 1, sporeCol: '#f2d77a' } }, throne: { fx: { embers: .6, spores: .5, sporeCol: '#f2d77a' }, braziers: 1 }
};
const AMB_WEATHER = { clear: {}, rain: { rain: .8 }, drizzle: { rain: .4 }, storm: { rain: 1.2, storm: 1, wind: .6 }, fog: { fog: 1.1 }, snow: { snow: 1 },
  blizzard: { snow: 2, wind: 1.3, fog: .5 }, dust: { dust: 1.6, wind: .8 }, ashfall: { ash: 1.2, embers: .4 } };
let ambScroll = 0, ambLastT = null;
/* 0 by day, 1 at night (a 24-minute cycle that every character shares); never dark inside dungeons */
/* the world's clock: real time, plus any shift the GM panel set (js/24-gm.js) */
function rbNow() { return Date.now() + (window.GM_SHIFT || 0); }
function realmNight(now) { const k = (((now === undefined ? rbNow() : now) / 1000) % AMB_DAY) / AMB_DAY; return k < .6 ? 0 : k < .68 ? (k - .6) / .08 : k < .92 ? 1 : (1 - k) / .08; }
/* the weather in a zone changes every 6 minutes, the same for everyone at the same time */
function zoneWeather(id, now) { if (window.GM_WEATHER) return window.GM_WEATHER; const z = AMB_ZONES[id], list = (z && z.weather) || ['clear'], seg = Math.floor((now === undefined ? rbNow() : now) / 360000);
  return list[(seg * 7 + id.charCodeAt(0) * 13 + id.length * 5) % 97 % list.length]; }
function ambProfile() { const h = H(); return h.dun ? (AMB_DUNGEONS[h.dun.id] || { fx: { dust: .4 } }) : (AMB_ZONES[h.zone] || AMB_ZONES.thornvale); }
/* behind everyone: sky, life, far scenery, hills and ground (all scrolling while you travel), torches, the campfire */
function ambBack(t, gy, p) {
  const h = H(), dun = !!h.dun, z = dun ? dungeonDef() : ZONES[h.zone], P = ambProfile();
  const dt = ambLastT === null ? 0 : Math.min(.1, Math.max(0, t - ambLastT)); ambLastT = t;
  if (!dun && !reduce && (C.phase === 'seek' || C.phase === 'town')) ambScroll += dt * PW * (activeMount() ? .22 : .11);
  const wk = dun ? 'clear' : zoneWeather(h.zone), W = AMB_WEATHER[wk] || {}, night = dun ? 0 : realmNight();
  AMB.sky(cx, PW, PH, t, { top: z.sky[0], bottom: z.sky[1], h: gy, night, stars: !dun, moon: !dun, sun: !dun && !!P.sun, aurora: !!P.aurora && !W.storm,
    clouds: dun ? null : { n: (P.clouds || 4) + (W.rain ? 3 : 0), speed: 7 + (W.wind || 0) * 10, col: P.cloudCol }, storm: W.storm ? 1 : W.rain ? .45 : W.snow > 1 ? .5 : 0, px: p / 2 });
  if (!dun) AMB.life(cx, PW, PH, t, { birds: night < .5 && !W.rain ? (P.birds || 0) : 0, bats: night > .3 ? 2 : 0, drakes: P.drakes || 0, col: P.birdCol, y0: .08, y1: .38, px: Math.max(2, p / 2) });
  if (P.far) AMB.far(cx, PW, PH, t, { layers: P.far, scroll: ambScroll, wind: .3 + (W.wind || 0), night, px: Math.max(2, Math.round(p / 2)) });
  const dark = c => Ambience.mix(c, '#0b0f22', night * .5);
  if (dun) { // the dungeon's back wall: pillars in the gloom
    cx.fillStyle = Ambience.mix(z.hill, '#000000', .35); for (let i = 0; i < 6; i++) { const x = PW * (i + .5) / 6 - p * 3; cx.fillRect(Math.round(x), 0, p * 6, gy); cx.fillRect(Math.round(x - p * 2), Math.round(gy - p * 3), p * 10, p * 3); }
  } else {
    cx.fillStyle = dark(z.hill); cx.beginPath(); cx.moveTo(0, PH * .7);
    for (let x = 0; x <= PW + PW / 10; x += Math.max(4, PW / 20)) cx.lineTo(x, PH * .55 + Math.sin((x + ambScroll * .45) * .02 + 1) * PH * .07 + Math.sin((x + ambScroll * .45) * .051) * PH * .02); cx.lineTo(PW, PH); cx.lineTo(0, PH); cx.fill();
  }
  cx.fillStyle = dark(z.ground); cx.fillRect(0, gy, PW, PH - gy); cx.fillStyle = 'rgba(0,0,0,.12)';
  const so = dun ? 0 : ambScroll % 36; for (let x = -36; x < PW + 36; x += 18) cx.fillRect(Math.round(x - so + (Math.floor((x + 36) / 18) % 2) * 6), gy + 6, 8, 3);
  const lights = [];
  if (dun) { const ty = gy - PH * .34; for (const fx of P.braziers ? [.08, .5, .92] : [.12, .52, .9]) { const x = PW * fx;
      if (!P.braziers) { cx.fillStyle = '#4a3a2a'; cx.fillRect(Math.round(x - p * .5), Math.round(ty), p, p * 4); }
      const l = AMB.fire(cx, x, P.braziers ? gy - p : ty, Math.max(2, Math.round(p / 2)), t, { id: 'torch' + fx, size: P.braziers ? 1.6 : .7, logs: !!P.braziers, smoke: !!P.braziers });
      if (P.torch) l.col = P.torch; lights.push(l); } }
  else if (C.phase === 'rest' && !reduce) lights.push(AMB.fire(cx, PW * .47, gy, Math.max(2, Math.round(p / 2)), t, { id: 'camp', size: 1, smoke: true, wind: W.wind || .3 }));
  return { P, W, night, lights, dun };
}
/* the inn in town: lit windows at night, smoke from the chimney, a lantern by the door */
function ambTown(gy, t, A) {
  const bx = PW * .62, w = PH * .4, top = gy - PH * .36, night = A.night;
  cx.fillStyle = '#6b4a2a'; cx.fillRect(bx, top, w, PH * .36); cx.fillStyle = '#4e341c'; for (const fx of [0, .48, .96]) cx.fillRect(bx + w * fx, top, PH * .015, PH * .36); cx.fillRect(bx, top + PH * .17, w, PH * .015);
  cx.fillStyle = '#5a4a40'; cx.fillRect(bx + w * .72, gy - PH * .58, PH * .05, PH * .14);
  cx.fillStyle = '#8a2a1a'; cx.beginPath(); cx.moveTo(bx - 10, top); cx.lineTo(bx + PH * .2, gy - PH * .55); cx.lineTo(bx + w + 10, top); cx.fill();
  AMB.smoke(cx, bx + w * .72 + PH * .025, gy - PH * .58, Math.max(2, Math.round(PH / 120)), t, { id: 'inn', wind: (A.W.wind || 0) + .3 });
  const win = Ambience.mix('#3a2a1a', '#ffd36a', .25 + .75 * night);
  for (const fx of [.12, .7]) { cx.fillStyle = win; cx.fillRect(bx + w * fx, top + PH * .06, PH * .07, PH * .07); cx.fillStyle = '#4e341c'; cx.fillRect(bx + w * fx + PH * .033, top + PH * .06, PH * .006, PH * .07);
    A.lights.push({ x: bx + w * fx + PH * .035, y: top + PH * .095, r: PH * .22, col: '#ffc860', flick: true }); }
  cx.fillStyle = '#f2c14e'; cx.fillRect(bx + PH * .15, gy - PH * .16, PH * .1, PH * .16);
  cx.fillStyle = '#2b2b3a'; cx.fillRect(bx - PH * .06, gy - PH * .26, PH * .012, PH * .26); cx.fillStyle = Ambience.mix('#806040', '#ffe08a', .3 + .7 * night); cx.fillRect(bx - PH * .072, gy - PH * .3, PH * .036, PH * .045);
  A.lights.push({ x: bx - PH * .054, y: gy - PH * .28, r: PH * .3, col: '#ffcf7a', flick: true });
}
/* in front of everyone: weather, the night (with its pools of light), lightning */
function ambFront(t, gy, p, A) {
  const fx = Object.assign({}, A.P.fx, A.night > .4 ? A.P.nightFx : {}, A.W);
  if (fx.rain && fx.wind === undefined) fx.wind = .25;
  AMB.weather(cx, PW, PH, t, Object.assign(fx, { ground: gy + p * 4, px: Math.max(2, Math.round(p / 2)), onThunder: v => sfx('thunder', v) }));
  const lights = A.lights.concat(A.dun || A.night > .02 ? [{ x: PW * .3, y: gy - 7 * p, r: PH * (A.dun ? .32 : .26), col: '#ffe0b0' }] : []);
  if (C.mob && (A.dun || A.night > .02)) lights.push({ x: PW * .66, y: gy - 8 * p, r: PH * .2, col: '#c8d0ff' });
  realmAtmosphere(t, gy, A.sun || realmSun(), lights, A.W); // fog you move through, the colour of the hour, light shafts (23-light.js)
  if (A.dun || A.night > .02) AMB.lights(cx, PW, PH, t, { dark: A.dun ? .85 : A.night, max: A.dun ? .55 : .5, lights });
  AMB.flash(cx, PW, PH, t);
  LT.bloom(cx, cv, PW, PH, A.sun || realmSun());
}
