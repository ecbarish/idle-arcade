'use strict';
/* The guild (docs/realmbound-40-60.md, "The guild"): your account becomes a guild. One guild for all your characters.
   - Founding: a hero of level 40+ in town pays 5 gold and needs five signatures: your other characters and companions
     at Friend or better. Friends who sign join as members.
   - Members: all your characters (always), plus adventurers you invite (Friend or better). Adventurers keep their
     personalities and affinity and have a mood: grouping with them, giving them loot and clearing dungeons together
     lift it; being benched slowly lowers it (at most a day's worth while you're away). Below 30 they tell you; below
     10 they leave. Happy members (70+) work 10% faster on jobs, unhappy ones (below 30) 20% slower.
   - Jobs: adventurers can mine, gather herbs or stand guard (guild XP); your other characters can also go questing.
   - Guild levels 1-5 from members' activity (quests, dungeon clears, raid bosses, guard duty): +2% XP per level for
     every character, and job slots grow from 3 to 6.
   State lives in S.guild beside the jobs board's own S.guild.jobs: { name, founded, level, xp, members: { key: {...} } }.
   Member keys: 'adv:<heroId>:<npcId>' for adventurers (they stay in their hero's companion list). */
const GUILD_COST = 50000, GUILD_SIGS = 5, GUILD_LVL = [0, 600, 1800, 4200, 8400], GUILD_MAX = 5;
const GUILD_NAMES = ['The Lanternbound', 'Wayfolk\'s Promise', 'The Long Road', 'Hearthkeepers', 'The Open Seat', 'Brisket\'s Friends'];
const guildOn = () => !!(S.guild && S.guild.founded);
const G = () => S.guild || (S.guild = { jobs: {} });
function guildLevel() { return guildOn() ? G().level : 0; }
function guildXPMult() { return 1 + .02 * guildLevel(); }
function jobSlots() { return JOB_SLOTS + (guildOn() ? [0, 0, 1, 1, 2, 3][G().level] : 0); }
/* workers: your characters (by id) and guild adventurers ('adv:hero:npc') */
function advParts(key) { const p = String(key).split(':'); return p[0] === 'adv' ? { hero: S.chars.find(c => String(c.id) === p[1]), npcId: p[2] } : null; }
function advNpc(key) { const a = advParts(key); return a && a.hero ? (a.hero.npcs || []).find(n => String(n.id) === a.npcId) || null : null; }
function workerOf(id) {
  const a = advParts(id);
  if (a) { const n = advNpc(id); if (!n || !a.hero || !G().members || !G().members[id]) return null; return { kind: 'adv', name: n.name, cls: n.cls, lvl: clamp(a.hero.lvl + n.offset, 1, LEVEL_CAP), n, hero: a.hero, m: G().members[id] }; }
  const c = charOf(id); return c ? { kind: 'char', name: c.name, cls: c.cls, lvl: c.lvl, c } : null;
}
function moodMult(id) { const w = workerOf(id); if (!w || w.kind !== 'adv') return 1; return w.m.mood >= 70 ? 1.1 : w.m.mood < 30 ? .8 : 1; }
function workerCanWork(id) {
  const w = workerOf(id), h = H(); if (!w || !h) return false;
  if (w.kind === 'char') return String(w.c.id) !== String(h.id) && !(w.c.dun && w.c.dun.raid) && !S.chars.some(c => c.dun && c.dun.raid && (c.party || []).includes('alt' + w.c.id));
  if (memberRaiding(id)) return false;
  return !(String(w.hero.id) === String(h.id) && (h.party || []).includes(w.n.id)); // not while they're in your party
}
/* A saved raid reserves its adventurers even while you play another hero. */
function memberRaiding(key) {
  const a = advParts(key); if (!a || !a.hero) return false;
  return S.chars.some(c => c.dun && c.dun.raid && ((c.party || []).includes(key) || (String(c.id) === String(a.hero.id) && (c.party || []).some(id => String(id) === a.npcId))));
}
const memberKey = (heroId, npcId) => `adv:${heroId}:${npcId}`;
function isMember(n, h) { h = h || H(); return guildOn() && !!G().members[memberKey(h.id, n.id)]; }
/* founding */
function guildSignatures() { const h = H(); return { chars: S.chars.filter(c => c.id !== h.id), friends: (h.npcs || []).filter(n => n.met && affLvl(n) >= 2) }; }
function foundProblem() {
  const h = H(); if (!h) return 'No hero.'; if (guildOn()) return 'Your account already has a guild.';
  if (h.lvl < 40) return 'A guild charter needs a hero of level 40.';
  if (!inTown()) return 'Buy the charter in town.';
  if (h.money < GUILD_COST) return `The charter costs ${moneyTxt(GUILD_COST)}.`;
  const s = guildSignatures(), n = s.chars.length + s.friends.length;
  if (n < GUILD_SIGS) return `A charter needs ${GUILD_SIGS} signatures; you have ${n} (your other characters, and companions at Friend or better).`;
  return '';
}
function foundGuild(name) {
  const why = foundProblem(); if (why) { err(why); return false; }
  const h = H(), s = guildSignatures(); name = String(name || '').replace(/[^A-Za-z' -]/g, '').trim().slice(0, 24) || pick(GUILD_NAMES);
  h.money -= GUILD_COST; Object.assign(G(), { name, founded: Date.now(), founder: h.id, level: 1, xp: 0, members: {}, requests: {} });
  for (const n of s.friends) addMember(n, h, true);
  slog(`Founded the guild ${name}.`); toast(`${name} is founded!`); sfx('badge');
  line(`${name} is founded. ${s.chars.length ? 'All your characters' : 'You'}${s.friends.length ? ` and ${s.friends.map(n => n.name).join(', ')}` : ''} sign the charter.`, 'l-loot');
  return true;
}
function addMember(n, h, quiet) { G().members[memberKey(h.id, n.id)] = { mood: 60, at: Date.now(), joined: Date.now() }; if (!quiet) { addAff(n, 5, `Joined ${G().name}.`); toast(`${n.name} joins ${G().name}`); } }
function inviteToGuild(npcId) { const h = H(), n = npcOf(npcId); if (!guildOn() || !n || n.alt || affLvl(n) < 2 || isMember(n, h)) return false; addMember(n, h); say(n, 'thanks'); return true; }
function dismissMember(key) { if (!G().members || !G().members[key] || memberRaiding(key)) return false; ROSTER.stop(key); delete G().members[key]; return true; }
/* guild XP and levels */
function guildXP(n, why) {
  if (!guildOn() || !(n > 0)) return; const g = G(); g.xp += n;
  while (g.level < GUILD_MAX && g.xp >= GUILD_LVL[g.level]) { g.level++; toast(`${g.name} reached guild level ${g.level}`); slog(`${g.name} reached guild level ${g.level}.`); sfx('level'); }
}
function guildNext() { const g = G(); return g.level >= GUILD_MAX ? null : GUILD_LVL[g.level]; }
/* mood: in your party +6 an hour, on a job +2 (up to 85), benched -1 (at most 24 hours counted while away) */
function moodBump(n, v, h) { h = h || H(); if (!guildOn() || !n) return; const m = G().members[n.guildKey || memberKey(h.id, n.id)]; if (m) m.mood = clamp(m.mood + v, 0, 100); }
function guildTick(now) {
  if (!guildOn()) return; now = now || Date.now(); const h = H();
  for (const [key, m] of Object.entries(G().members)) {
    const w = workerOf(key); if (!w) { delete G().members[key]; continue; }
    const hrs = Math.min(24, Math.max(0, (now - m.at) / 36e5)); m.at = now; if (!hrs) continue;
    const inParty = memberRaiding(key) || h && String(w.hero.id) === String(h.id) && (h.party || []).includes(w.n.id) && C && C.party && C.party.length;
    const working = !!ROSTER.jobOf(key);
    m.mood = clamp(m.mood + (inParty ? 6 * hrs : working ? Math.min(2 * hrs, Math.max(0, 85 - m.mood)) : -hrs), 0, 100);
    if (m.mood < 30 && !m.warned) { m.warned = true; toast(`${w.name} feels overlooked by ${G().name}`); slog(`${w.name} feels overlooked. Group with them, give them a job or some loot.`); }
    if (m.mood >= 40) m.warned = false;
    if (m.mood < 10 && dismissMember(key)) { toast(`${w.name} has left ${G().name}`); slog(`${w.name} left ${G().name}, feeling forgotten.`); }
  }
}
/* A first supply favor per adventurer, not a daily chore. The account ledger survives leaving/rejoining. */
const MEMBER_REQUESTS = {
  warrior: { title: 'A shield worth lending', item: 'kit', count: 1, supply: 'repair kit', ask: 'My shield strap is fraying. Could you spare a repair kit? I want it ready when a new member needs cover.' },
  rogue: { title: 'Mend before the next mile', item: 'kit', count: 1, supply: 'repair kit', ask: 'The buckle on my travel gear finally gave way. A repair kit would get me ready for the next road.' },
  mage: { title: 'A focus for the workbench', item: 'ore', count: 6, supply: 'ore', ask: 'I am shaping a practice focus for the hall. Six ore would let me finish its stand without borrowing a weapon rack.' },
  priest: { title: 'Something for the returning watch', item: 'potion', count: 1, supply: 'healing potion', ask: 'I would like a healing potion set aside for a weary guard. A quiet welcome can matter as much as a sermon.' },
  hunter: { title: 'A gentler trail', item: 'herb', count: 4, supply: 'herbs', ask: 'Four herbs would help me prepare a soothing rub for the animals returning from long walks. They carry us far enough.' }
};
const REQUEST_VOICE = {
  cheerful: { hello: 'Oh, you have a moment!', thanks: 'You remembered! I will make sure the next person feels as welcome.' },
  gruff: { hello: 'A small thing. Hear me out.', thanks: 'That will do. Better than that, actually. Appreciated.' },
  shy: { hello: 'If it is not too much trouble...', thanks: 'You listened. I was not sure I should ask. Thank you.' },
  bold: { hello: 'A fine guild deserves sound preparations!', thanks: 'A worthy kindness! The hall will hear who helped.' },
  scholarly: { hello: 'I have a practical proposal.', thanks: 'Useful evidence that a guild is more than a charter. Thank you.' },
  greedy: { hello: 'Before you ask, this is for all of us.', thanks: 'A good investment. Fine, yes, a kind one too.' }
};
function memberRequest(key) {
  if (!guildOn() || !G().members[key] || (G().requests || {})[key]) return null;
  const worker = workerOf(key); if (!worker || worker.kind !== 'adv') return null;
  return MEMBER_REQUESTS[worker.cls] || null;
}
function requestProblem(key) {
  const request = memberRequest(key); if (!request) return 'No unfinished request from this member.';
  if (!H() || !inTown() || H().dun) return 'Bring supplies to a town to help a member.';
  if (ROSTER.jobOf(key)) return 'Return this member from their job first.';
  if ((S.bank && S.bank[request.item] || 0) < request.count) return 'Needs ' + request.count + ' ' + request.supply + ' from the shared bank.';
  return '';
}
function fulfillMemberRequest(key) {
  const problem = requestProblem(key); if (problem) { err(problem); return false; }
  const request = memberRequest(key), worker = workerOf(key), g = G();
  bank()[request.item] -= request.count;
  (g.requests || (g.requests = {}))[key] = { title: request.title, at: Date.now() };
  moodBump(worker.n, 10, worker.hero); addAff(worker.n, 3, 'You helped with ' + request.title.toLowerCase() + '.');
  guildXP(15, 'A member request');
  const voice = REQUEST_VOICE[worker.n.pers] || REQUEST_VOICE.cheerful;
  line(worker.name + ': ' + voice.thanks, 'l-say');slog('Helped ' + worker.name + ' with ' + request.title.toLowerCase() + '.');
  sfx('quest');return true;
}
function memberRequestsHTML() {
  if (!guildOn()) return '';
  const members = Object.keys(G().members).map(key => ({ key, worker: workerOf(key) })).filter(({ worker }) => worker && worker.kind === 'adv');
  if (!members.length) return '';
  return '<h4>Members asking a favor</h4><p class="sub">A first favor for each adventurer: give supplies from the shared bank in town. Helping gives +10 mood, +3 friendship and 15 guild experience. No deadline; each favor can be completed once.</p>' +
    members.map(({ key, worker }) => {
      const done = (G().requests || {})[key], request = memberRequest(key);
      if (done) return '<div class="rowl"><div class="l"><b>' + worker.name + '</b><div class="meta">Helped: ' + done.title + '</div></div></div>';
      if (!request) return '';
      const voice = REQUEST_VOICE[worker.n.pers] || REQUEST_VOICE.cheerful, why = requestProblem(key);
      return '<div class="rowl"><div class="l"><b>' + worker.name + ' · ' + request.title + '</b><div class="meta">' + voice.hello + ' ' + request.ask + '</div><div class="meta">' + (why || 'Ready: give ' + request.count + ' ' + request.supply + ' from the shared bank.') + '</div></div><div class="r"><button class="btn sm" data-act="guildrequest" data-arg="' + key + '" ' + (why ? 'disabled' : '') + '>Help</button></div></div>';
    }).join('');
}
/* the guild hall: drawn at the top of the Guild tab (18-supplies.js) */
function guildHTML() {
  const h = H();
  if (!guildOn()) {
    const why = foundProblem(), s = guildSignatures();
    return `<h3>Guild</h3><p class="sub">Found a guild for your whole account: every character is a member, and you can invite the adventurers
      you trust. Members work the jobs board, the guild levels up from everyone's deeds, and every level makes the road a little shorter.</p>
      <p class="meta">Needs: a level 40 hero in town, ${moneyTxt(GUILD_COST)} for the charter, and ${GUILD_SIGS} signatures
      (you have ${s.chars.length + s.friends.length}: ${s.chars.length} other character${s.chars.length === 1 ? '' : 's'}, ${s.friends.length} friend${s.friends.length === 1 ? '' : 's'}).</p>
      ${why ? `<p class="meta">${why}</p>` : `<p><input id="guildName" maxlength="24" placeholder="${GUILD_NAMES[0]}" style="max-width:220px"> <button class="btn" data-act="guildfound">Found the guild</button></p>`}`;
  }
  const g = G(), nx = guildNext(), prev = GUILD_LVL[g.level - 1] || 0;
  const mem = Object.keys(g.members).map(workerOf).filter(Boolean);
  const cand = (h.npcs || []).filter(n => n.met && affLvl(n) >= 2 && !isMember(n, h));
  let o = `<h3>${g.name} <span class="meta">guild level ${g.level}</span></h3>
    <div class="aff" title="Guild experience"><i style="width:${nx ? (g.xp - prev) / (nx - prev) * 100 : 100}%"></i></div>
    <p class="meta">${nx ? `${fmtI(g.xp)} / ${fmtI(nx)} guild experience` : 'The highest guild level'} · +${2 * g.level}% experience for every character · ${jobSlots()} job slots.
      Guild experience comes from quests, dungeon clears, raid bosses and guard duty.</p>
    <h4>Adventurers (${mem.length})</h4>`;
  o += mem.length ? mem.map(w => { const k = memberKey(w.hero.id, w.n.id), mood = Math.round(w.m.mood), face = mood >= 70 ? 'happy' : mood >= 30 ? 'content' : 'unhappy';
    return `<div class="rowl"><div class="l"><b style="color:${CLASSES[w.cls].col}">${w.name}</b> <span class="meta">level ${w.lvl} ${CLASSES[w.cls].name} · ${String(w.hero.id) === String(h.id) ? 'your companion' : `${w.hero.name}'s companion`} · ${face}</span>
      <div class="aff" title="Mood ${mood}"><i style="width:${mood}%;background:${mood >= 70 ? '#7cf08a' : mood >= 30 ? '#f2c14e' : '#e0483e'}"></i></div></div>
      <div class="r"><button class="btn sm alt" data-act="guilddismiss" data-arg="${k}" ${memberRaiding(k) ? 'disabled title="Return from the raid before dismissing this member"' : ''}>Dismiss</button></div></div>`; }).join('') : '<p class="meta">No adventurers yet. Invite companions who are your Friends.</p>';
  if (cand.length) o += `<p class="meta" style="margin-top:6px">Could join: ${cand.map(n => `<button class="btn sm" data-act="guildinvite" data-arg="${n.id}">Invite ${n.name}</button>`).join(' ')}</p>`;
  return o + memberRequestsHTML();
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || !H()) return; const a = el.dataset.act, arg = el.dataset.arg;
  if (a === 'guildfound') { if (foundGuild(($('#guildName') || {}).value)) save(); }
  else if (a === 'guildinvite') { if (inviteToGuild(Number(arg))) save(); }
  else if (a === 'guildrequest') { if (fulfillMemberRequest(arg)) save(); }
  else if (a === 'guilddismiss') { const w = workerOf(arg); if (w && arm(el, 'Dismiss', 'Click again to dismiss')) { if (!dismissMember(arg)) { err('Return from the raid before dismissing this member.'); return; } line(`${w.name} leaves the guild on good terms.`, 'l-sys'); save(); } else return; }
  else return;
  renderTab(true);
});
