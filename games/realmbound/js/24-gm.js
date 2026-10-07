'use strict';
/* Realmbound's GM actions (E2) for the shared GM panel (shared/gm.js). Only active when GM mode is on (the Studio,
   or ?gm in the address); Ctrl+Shift+G opens the panel. Every change is logged and the save is backed up first. */
const RB_TIMES = [['.95', 'Dawn'], ['.05', 'Morning'], ['.3', 'Noon'], ['.5', 'Afternoon'], ['.635', 'Sunset'], ['.75', 'Night'], ['.85', 'Midnight']];
function rbHero() { const h = H(); if (!h) throw new Error('Pick or create a character first.'); return h; }
GM.create({
  game: 'Realmbound', saveKey: KEY, save: () => { if (H() && C) save(); else Arcade.save(KEY, S); },
  refresh: () => { if (H() && C) { recalc(); updateWorld(); renderTab(true); } },
  actions: [
    { group: 'Hero', label: 'Give gold', inputs: [{ id: 'g', label: 'gold', type: 'number', value: 10 }], run: v => { const h = rbHero(); h.money += Math.round(v.g * 10000); return `${h.name} has ${moneyTxt(h.money)}.`; } },
    { group: 'Hero', label: 'Set level', inputs: [{ id: 'l', label: `level (1-${LEVEL_CAP})`, type: 'number', value: LEVEL_CAP }], run: v => { const h = rbHero(); h.lvl = clamp(Math.round(v.l) || 1, 1, LEVEL_CAP); h.xp = 0; recalc(); C.hp = ST.hpMax; return `${h.name} is now level ${h.lvl}.`; } },
    { group: 'Hero', label: 'Heal fully', run: () => { rbHero(); C.hp = ST.hpMax; C.res = ST.resMax; if (C.phase === 'dead') C.phase = 'rest'; for (const p of C.party) { p.dead = false; p.hp = compStats(p.n).hpMax; } return 'Everyone is fully healed.'; } },
    { group: 'Hero', label: 'Teleport', inputs: [{ id: 'z', label: 'zone', type: 'select', options: () => Object.keys(ZONES).map(z => [z, ZONES[z].name]) }],
      run: v => { const h = rbHero(); if (h.dun) leaveDungeon(); h.zone = v.z; C.mob = null; C.phase = 'seek'; C.t = 1; return `Arrived in ${ZONES[v.z].name}.`; } },
    { group: 'Hero', label: 'Give item', inputs: [{ id: 's', label: 'slot', type: 'select', options: () => SLOTS.map(s => [s, s]) }, { id: 'r', label: 'rarity', type: 'select', options: [['2', 'rare'], ['3', 'epic'], ['4', 'raid epic'], ['1', 'uncommon']] }],
      run: v => { const h = rbHero(); if (h.bags.length >= 16) throw new Error('Bags are full.'); const it = genItem(h.lvl, Number(v.r), v.s, { cls: h.cls }); h.bags.push(it); return `[${it.name}] is in your bags.`; } },
    { group: 'Hero', label: 'Grant the Hollow Key', run: () => { const h = rbHero(); h.hollowKey = true; return 'The Hollow Throne is open to this hero.'; } },
    { group: 'World', label: 'Set time of day', inputs: [{ id: 'k', label: '', type: 'select', options: RB_TIMES }],
      run: v => { const now = (Date.now() / 1000) % AMB_DAY / AMB_DAY; window.GM_SHIFT = ((Number(v.k) - now + 1) % 1) * AMB_DAY * 1000; return `It is now ${RB_TIMES.find(t => t[0] === v.k)[1].toLowerCase()} (until you reload).`; } },
    { group: 'World', label: 'Set weather', inputs: [{ id: 'w', label: '', type: 'select', options: () => [['', 'natural']].concat(Object.keys(AMB_WEATHER).map(w => [w, w])) }],
      run: v => { window.GM_WEATHER = v.w || null; return v.w ? `Weather: ${v.w} (until you reload).` : 'Weather follows the sky again.'; } },
    { group: 'World', label: 'Next fight now', run: () => { rbHero(); if (C.phase === 'fight') return 'Already fighting.'; C.phase = 'seek'; C.t = 0; return 'Something comes over the hill...'; } },
    { group: 'Companions and guild', label: 'Make companions Friends', run: () => { const h = rbHero(); let n = 0; for (const c of h.npcs || []) { c.met = true; if (affLvl(c) < 2) { c.aff = AFFINITY[2].at; n++; } } return `${n} companions are now your Friends.`; } },
    { group: 'Companions and guild', label: 'Add supplies', inputs: [{ id: 'k', label: '', type: 'select', options: [['ore', 'ore'], ['herb', 'herbs'], ['kit', 'repair kits'], ['potion', 'potions']] }, { id: 'n', label: 'how many', type: 'number', value: 10 }],
      run: v => { bank()[v.k] = (bank()[v.k] || 0) + Math.max(0, Math.round(v.n)); return `The bank has ${bank()[v.k]} ${v.k}.`; } },
    { group: 'Companions and guild', label: 'Give guild experience', inputs: [{ id: 'n', label: 'xp', type: 'number', value: 1000 }], run: v => { if (!guildOn()) throw new Error('Found a guild first.'); guildXP(Math.max(0, v.n)); return `${G().name} is level ${G().level}.`; } },
    { group: 'Companions and guild', label: 'Reset raid lockout', run: () => { const h = rbHero(); h.raidLock = { at: 0, killed: [] }; return 'Every raid boss is back.'; } }
  ]
});
