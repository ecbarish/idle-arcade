'use strict';
/* Starfall Guild's GM actions (E2) for the shared GM panel (shared/gm.js). Only active when GM mode is on. */
GM.create({
  game: 'Starfall Guild', saveKey: KEY, save: () => save(), refresh: () => { D = derive(); updateUI(); renderTab(true); },
  actions: [
    { group: 'Guild', label: 'Give gold', inputs: [{ id: 'n', label: 'gold', type: 'number', value: 100000 }], run: v => { S.gold += Math.max(0, v.n); return `${fmt(S.gold)} gold.`; } },
    { group: 'Guild', label: 'Give renown', inputs: [{ id: 'n', label: 'renown', type: 'number', value: 10 }], run: v => { S.renown += Math.max(0, Math.round(v.n)); S.renownLife += Math.max(0, Math.round(v.n)); return `${S.renown} renown.`; } },
    { group: 'Dungeon', label: 'Go to floor', inputs: [{ id: 'f', label: 'floor', type: 'number', value: 25 }], run: v => { const f = Math.max(1, Math.round(v.f)); S.floor = f; S.best = Math.max(S.best, f); spawn(); return `Now on ${floorName(f)}.`; } }
  ]
});
