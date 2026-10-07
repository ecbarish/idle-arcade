'use strict';
/* The Ranch tab: daily plans, food, the breeding barn, and the last day's report. Replaces the simple ranch list. */
const BARN = { a: null, b: null };
TABS.ranch = {
  key: () => { ensureRanch(); return everyone().map(c => { ensureCare(c); return [c.uid, c.lvl, c.plan.food, c.plan.act, c.injured, Math.round(c.fatigue / 10), Math.round(c.mood / 10), trainedTotal(c)].join(':'); }).join() +
    '|' + S.day + '|' + S.eggs.length + '|' + JSON.stringify(S.food) + '|' + BARN.a + '|' + BARN.b + '|' + S.team.length + '|' + !!B + '|' + JSON.stringify(S.titles || []);  },
  build: () => {
    ensureRanch(); const all = everyone();
    const foodOpts = c => `<option value="none" ${c.plan.food === 'none' ? 'selected' : ''}>No food</option>` + Object.entries(FOODS).map(([k, f]) =>
      `<option value="${k}" ${c.plan.food === k ? 'selected' : ''}>${f.name}${FAVORITE[sp(c).fam] === k ? ' (favorite)' : ''}</option>`).join('');
    const actOpts = c => Object.entries(REGIMENS).map(([k, r]) => `<option value="${k}" ${c.plan.act === k ? 'selected' : ''}>${r.name}</option>`).join('');
    const tr = c => Cr.STATS.filter(k => c.train[k] >= 4).map(k => `${Cr.STAT_NAME[k].slice(0, 3)} +${Math.floor(c.train[k] / 4)}`).join(' · ') || 'nothing yet';
    let o = `<h3>Ranch</h3><p class="sub">Day <b>${S.day}</b> · next day in <b id="dayT"></b>. Each creature follows its daily plan: a food and an activity.
      Training adds up to ${TRAIN_CAP / 4} to a stat and ${TRAIN_TOTAL / 4} in total. Overtraining tired creatures can injure them.</p>`;
    o += ranchPennantsHTML();
    o += `<h4>Food stores</h4><div class="foods">${Object.entries(FOODS).map(([k, f]) => `<div class="food"><b>${f.name}</b> <span class="meta">${S.food[k]} left</span>
      <button class="btn sm alt" data-act="buyfood" data-arg="${k}">Buy 10 (${f.cost * 10})</button></div>`).join('')}</div>`;
    o += `<h4>Daily plans</h4>` + all.map(c => { ensureCare(c); const inTeam = S.team.includes(c);
      return `<div class="plan">${portrait(c.sp, true)}<div class="pbody"><div class="cn">${c.name} <span class="lv">Lv ${c.lvl}</span> <span class="tag">${inTeam ? 'Team' : 'Ranch'}</span>
        ${c.injured ? `<span class="tag hurt">Injured ${c.injured}d</span>` : ''} <span class="meta">gen ${c.gen}</span></div>
        <div class="pbars"><span class="meta">Fatigue</span>${bar(c.fatigue, 100, 'tired')}<span class="meta">${moodName(c)}</span></div>
        <div class="meta">Trained: ${tr(c)}</div>
        <div class="psel"><select data-plan="food" data-uid="${c.uid}" aria-label="Food for ${c.name}">${foodOpts(c)}</select>
          <select data-plan="act" data-uid="${c.uid}" aria-label="Activity for ${c.name}">${actOpts(c)}</select>
          <span class="meta">${(REGIMENS[c.plan.act] || REGIMENS.rest).desc}</span></div></div></div>`; }).join('');
    // breeding barn
    const opt = (sel, cur) => `<select data-barn="${sel}" aria-label="Parent ${sel.toUpperCase()}"><option value="">Choose…</option>${all.map(c => `<option value="${c.uid}" ${cur === c.uid ? 'selected' : ''}>${c.name} (${sp(c).name}, Lv ${c.lvl})</option>`).join('')}</select>`;
    const a = all.find(c => c.uid === BARN.a), b = all.find(c => c.uid === BARN.b), info = a && b ? breedInfo(a, b) : null;
    const hyN = Object.keys(HYBRIDS).length, hyF = Object.keys(S.hybrids).length;
    o += `<h4>Breeding barn</h4><p class="sub">Pair two creatures at level 8+ with Friendly bond. The egg hatches in 2 days. Its potential lands between the parents', with a chance to beat both.
      Some pairs from different families make hybrids. Hybrids discovered: ${hyF}/${hyN}.</p>`;
    o += S.eggs.length ? `<div class="egg">Egg from ${S.eggs[0].from.join(' and ')}: hatches in ${S.eggs[0].days} day${S.eggs[0].days > 1 ? 's' : ''}.</div>` :
      `<div class="barn">${opt('a', BARN.a)} <b>+</b> ${opt('b', BARN.b)}</div>
       <p class="meta">${info ? (info.ok ? info.text : info.why) : 'Choose two parents.'}</p>
       <button class="btn" data-act="breed" ${info && info.ok ? '' : 'disabled'}>Breed (${BREED_COST} coins)</button>`;
    if (S.dayReport.length) o += `<h4>Day ${S.day} report</h4><div class="logl">${S.dayReport.map(l => `<div>${l}</div>`).join('')}</div>`;
    if (S.ranch.length) o += `<h4>Creatures on the ranch (${S.ranch.length})</h4>` + S.ranch.map((c, i) => cardHTML(c, i, false)).join('');
    return o;
  }
};
/* Original static pennants, earned from the existing challenge title record. No separate cosmetic save state. */
const RANCH_PENNANTS = {
  nuzlocke: { name: 'Homeward Leaf', col: '#438965', mark: '<path d="M23 39c-8-15 3-22 18-22 0 15-7 25-18 22Z"/><path d="m23 40 12-17" fill="none" stroke="currentColor" stroke-width="3"/>' },
  randomizer: { name: 'Crossing Paths', col: '#7563b0', mark: '<path d="m18 24 8-6 8 6-8 6Zm14 15 8-6 8 6-8 6Z"/><path d="m20 40 24-20" fill="none" stroke="#f9f1d5" stroke-width="3"/>' },
  solo: { name: 'One Bright Star', col: '#b18a32', mark: '<path d="m32 16 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z"/>' },
  hardcore: { name: 'Warmstone Promise', col: '#b66145', mark: '<path d="m22 20 17-3 9 14-6 15-20 1-8-15Z"/><path d="m31 23-4 9 9 9" fill="none" stroke="currentColor" stroke-width="3"/>' }
};
function ranchPennantsHTML() {
  const titles = S.titles || [], earned = Object.keys(MODES).filter(k => titles.includes(MODES[k].title));
  return '<h4>Challenge pennants</h4><p class="sub">' + earned.length + '/4 displayed. Earn every available badge with a challenge mode on to receive its title and pennant. These ranch decorations give no bonuses.</p><div class="pennants">' +
    Object.entries(RANCH_PENNANTS).map(([key, flag]) => {
      const on = titles.includes(MODES[key].title), col = on ? flag.col : '#9aaba4';
      return '<div class="pennant' + (on ? ' earned' : '') + '" data-pennant="' + key + '" data-earned="' + on + '"><svg viewBox="0 0 64 76" aria-hidden="true" class="pennant-art" style="color:'+col+'"><path d="M10 7h44v43L32 66 10 50Z" fill="' + col + '"/><path d="M14 11h36v37L32 61 14 48Z" fill="none" stroke="#f9f1d5" stroke-width="2"/><g fill="#f9f1d5">' + flag.mark + '</g><path d="M6 5h52" stroke="#6a756e" stroke-width="4" stroke-linecap="round"/></svg><div><b>' + flag.name + '</b><div class="meta">' + (on ? MODES[key].title + ' · earned' : 'Locked · ' + MODES[key].name) + '</div></div></div>';
    }).join('') + '</div>';
}

document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.plan) { const c = everyone().find(x => x.uid === Number(t.dataset.uid)); if (c) { ensureCare(c); c.plan[t.dataset.plan] = t.value; save(); } }
  if (t.dataset.barn) { BARN[t.dataset.barn] = t.value ? Number(t.value) : null; }
  if (t.dataset.plan || t.dataset.barn) renderAll();
});
function renderRanchLive() { const el = $('#dayT'); if (el) { ensureRanch(); const s = Math.max(0, Math.ceil(DAY_SECONDS - S.ranchT)); el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; } }
const _renderAll = renderAll;
renderAll = function () { _renderAll(); renderRanchLive(); };
