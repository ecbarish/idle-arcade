'use strict';
/* Wildbond's GM actions (E2) for the shared GM panel (shared/gm.js). Only active when GM mode is on (the Studio, or
   ?gm in the address); Ctrl+Shift+G opens the panel. Every change is logged and the save is backed up first. */
let GM_WEATHER = null;
const wbWeatherBase = weatherNow;
weatherNow = function () { return GM_WEATHER || wbWeatherBase(); }; // the GM can set the weather until reload
function wbStarted() { if (!S.started) throw new Error('Start a game first.'); }
GM.create({
  game: 'Wildbond', saveKey: KEY, save: () => save(), refresh: () => { renderAll(); renderTabs(true); },
  actions: [
    { group: 'Tamer', label: 'Give coins', inputs: [{ id: 'n', label: 'coins', type: 'number', value: 500 }], run: v => { wbStarted(); S.coins += Math.max(0, Math.round(v.n)); return `${S.coins} coins.`; } },
    { group: 'Tamer', label: 'Give lures', inputs: [{ id: 'n', label: 'lures', type: 'number', value: 20 }], run: v => { wbStarted(); S.lures += Math.max(0, Math.round(v.n)); return `${S.lures} lures.`; } },
    { group: 'Tamer', label: 'Set badges', inputs: [{ id: 'n', label: `how many (0-${Object.keys(BADGES).length})`, type: 'number', value: 4 }],
      run: v => { wbStarted(); S.badges = Object.keys(BADGES).slice(0, Math.max(0, Math.min(Object.keys(BADGES).length, Math.round(v.n)))); return `Badges: ${S.badges.map(b => BADGES[b].name).join(', ') || 'none'}. Level cap ${levelCap()}.`; } },
    { group: 'Tamer', label: 'Teleport', inputs: [{ id: 'm', label: 'place', type: 'select', options: () => Object.keys(MAPS).map(id => [id, MAPS[id].name]) }],
      run: v => { wbStarted(); placeAt(v.m); return `You are in ${MAPS[v.m].name}.`; } },
    { group: 'Tamer', label: 'Set art era', inputs: [{ id: 'e', label: '', type: 'select', options: () => Object.keys(ART).map(e => [e, e]) }], run: v => { S.era = v.e; return `The world is drawn in the ${v.e} era.`; } },
    { group: 'Team', label: 'Heal team', run: () => { wbStarted(); healAll(); return 'Your team is fully healed.'; } },
    { group: 'Team', label: 'Set team level', inputs: [{ id: 'l', label: 'level', type: 'number', value: 30 }],
      run: v => { wbStarted(); const l = Math.max(1, Math.min(100, Math.round(v.l))); for (const c of S.team) { c.lvl = l; c.xp = 0; } healAll(); return `Your team is level ${l}.`; } },
    { group: 'Team', label: 'Give creature', inputs: [{ id: 's', label: 'species', type: 'select', options: () => Object.keys(SPECIES).map(id => [id, SPECIES[id].name]).sort((a, b) => a[1].localeCompare(b[1])) }, { id: 'l', label: 'level', type: 'number', value: 10 }],
      run: v => { wbStarted(); const c = newCreature(v.s, Math.max(1, Math.min(100, Math.round(v.l)))); S.caught[v.s] = true; S.seen[v.s] = true;
        if (S.team.length < teamMax()) S.team.push(c); else S.ranch.push(c); return `${c.name} joined ${S.team.includes(c) ? 'your team' : 'the ranch'}.`; } },
    { group: 'World', label: 'Set time of day', inputs: [{ id: 'k', label: '', type: 'select', options: [['.1', 'Morning'], ['.35', 'Noon'], ['.6', 'Afternoon'], ['.7', 'Dusk'], ['.85', 'Night']] }],
      run: v => { wbStarted(); S.ranchT = Math.floor((S.ranchT || 0) / DAY_SECONDS) * DAY_SECONDS + Number(v.k) * DAY_SECONDS; return S.badges.includes('thorn') ? 'The sky changes.' : 'Set, but the day/night clock only shows after the Thorn Badge.'; } },
    { group: 'World', label: 'Set weather', inputs: [{ id: 'w', label: '', type: 'select', options: [['', 'natural'], ['clear', 'clear'], ['rain', 'rain'], ['mist', 'mist'], ['ash', 'ash']] }],
      run: v => { GM_WEATHER = v.w || null; return v.w ? `Weather: ${v.w} (until you reload; weather shows after the Tide Badge).` : 'Weather follows the day again.'; } }
  ]
});
