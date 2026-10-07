'use strict';
/* T26: original Starfall Guild tunes on the arcade's shared Web Audio engine.
   UI/runtime bindings exist before this adapter; boot loads last. No save defaults are added. */
const TRACKS = {
  // A soft Dorian melody for the guild's warm lamps and returning adventurers.
  town: { bpm: 92, lead: 'triangle',
    mel: 'D5 . F5 A5 G5 F5 E5 . A4 . C5 D5 F5 E5 D5 . G4 . B4 D5 E5 . F5 E5 D5 C5 A4 . D5 . . .',
    bass: 'D3 . A2 . G2 . D3 . C3 . G2 . D3 . A2 .' },
  // A steady pulse and sparse drums carry the party deeper under the stars.
  delve: { bpm: 106, lead: 'pulse',
    mel: 'D5 A4 D5 . F5 E5 D5 A4 C5 . E5 G5 F5 E5 D5 . G5 F5 E5 D5 C5 A4 C5 . E5 F5 G5 E5 D5 . A4 .',
    bass: 'D2 . D3 A2 C3 . G2 . G2 D3 G2 . A2 . A3 .',
    drum: 'k . h . s . h . k . k h s . h .' },
  // The same tonal home, faster and dry so the boss rhythm stays clear.
  boss: { bpm: 148, lead: 'pulse', echo: false,
    mel: 'A4 D5 F5 E5 D5 A4 C5 D5 E5 . G5 F5 E5 C5 A4 . D5 F5 A5 G5 F5 E5 D5 C5 A4 C5 E5 G5 F5 E5 D5 .',
    bass: 'D2 D3 A2 . D2 . C3 . G2 G3 D3 . A2 . A3 .',
    drum: 'k h s h k k s h k h s h k . s h' }
};
function musicKey() {
  if (modalKind || S.regionOffer) return null;
  if (!S.party.length || S.resting > 0 || S.tab !== 'party') return 'town';
  return isBoss(S.floor) ? 'boss' : 'delve';
}
const SND = ArcadeSound.create({
  tracks: TRACKS, musicKey,
  mode: () => S.snd || 0,
  setMode: m => { S.snd = m; save(); },
  button: () => $('#sndBtn')
});
// A catch-up tick or staff batch can trigger a cue repeatedly. Queue each kind once
// per JS turn, then rate-limit real-time farming/automation. These are transient, not save fields.
const soundPending = new Set(), soundPlayed = new Map();
function sfx(name) {
  if (!(S.snd || 0) || soundPending.has(name)) return;
  const first = soundPending.size === 0;
  soundPending.add(name);
  if (first) queueMicrotask(() => {
    const cues = [...soundPending]; soundPending.clear();
    const t = performance.now();
    for (const cue of cues) {
      const gap = cue === 'win' || cue === 'lose' ? 4000 : 1500;
      if (soundPlayed.has(cue) && t - soundPlayed.get(cue) < gap) continue;
      soundPlayed.set(cue, t); SND.sfx(cue);
    }
  });
}
