/* Idle Arcade shared engine.
   Every game loads this before its own script and uses window.Arcade for:
   - number/time formatting (fmt, fmtI, fmtTime)
   - per-game saves in localStorage (load, save, erase) that never throw
   - portable save strings for backup or moving devices (encode, decode)
   - a progress card for the hub page (report, readIndex)
   All games on one site share an origin, so the hub can read every game's card. */
(function () {
  'use strict';
  var INDEX_KEY = 'arcade-index-v1';
  var SUF = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

  function fmt(x) {
    if (!isFinite(x)) return '∞';
    if (x < 0) return '-' + fmt(-x);
    if (x < 1000) {
      if (x === Math.floor(x)) return String(x);
      return x < 10 ? x.toFixed(2) : x < 100 ? x.toFixed(1) : Math.floor(x).toString();
    }
    var e = Math.floor(Math.log10(x) / 3);
    if (e < SUF.length) {
      var m = x / Math.pow(10, e * 3);
      if (m >= 999.5 && e + 1 < SUF.length) { e++; m = x / Math.pow(10, e * 3); }
      return m.toFixed(m < 10 ? 2 : m < 100 ? 1 : 0) + SUF[e];
    }
    var ex = Math.floor(Math.log10(x));
    return (x / Math.pow(10, ex)).toFixed(2) + 'e' + ex;
  }
  function fmtI(x) { return x < 1000 ? String(Math.floor(x)) : fmt(x); }
  function fmtTime(s) {
    s = Math.floor(s);
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    if (d) return d + 'd ' + h + 'h';
    if (h) return h + 'h ' + m + 'm';
    if (m) return m + 'm ' + sec + 's';
    return sec + 's';
  }

  function load(key) { try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function save(key, obj) { try { localStorage.setItem(key, JSON.stringify(obj)); return true; } catch (e) { return false; } }
  function encode(obj) { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
  function decode(text) { return JSON.parse(decodeURIComponent(escape(atob(String(text).trim())))); }

  function readIndex() { return load(INDEX_KEY) || {}; }
  /* info: { summary: 'one line shown big on the hub card', detail: 'one quieter line' } */
  function report(gameId, info) {
    var idx = readIndex();
    idx[gameId] = { summary: info.summary || '', detail: info.detail || '', last: Date.now() };
    save(INDEX_KEY, idx);
  }
  function erase(key, gameId) {
    try { localStorage.removeItem(key); } catch (e) {}
    var idx = readIndex(); delete idx[gameId]; save(INDEX_KEY, idx);
  }

  window.Arcade = {
    fmt: fmt, fmtI: fmtI, fmtTime: fmtTime,
    load: load, save: save, encode: encode, decode: decode, erase: erase,
    report: report, readIndex: readIndex,
    home: '../../index.html'
  };
})();
