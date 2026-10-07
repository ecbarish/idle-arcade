'use strict';
/* Sound (S2): the arcade's shared chiptune engine (shared/sound.js, also used by Wildbond) with Realmbound's own
   music, one tune per zone plus dungeons, bosses and the spirit walk after a death. Off by default; the header
   button cycles off / effects / effects + music and the setting is kept for every character. Effects are kept to
   the moments that matter (a level, a quest, a tame, a rare drop, a warning, a death) so idle play stays calm.
   Tracks are note strings, one 8th note per token, '.' = rest (see shared/sound.js). */
const TRACKS = {
  /* Thornvale: a pastoral flute tune in D, fields and an abbey bell */
  thornvale: { bpm: 96, lead: 'triangle',
    mel: 'D5 . F#5 A5 G5 . F#5 E5 D5 . E5 F#5 A4 . . . B4 . D5 E5 F#5 . E5 D5 C5 . A4 B4 D5 . . .',
    bass: 'D3 . A3 . D3 . A3 . G2 . D3 . G2 . D3 . C3 . G3 . C3 . G3 . D3 . A3 . D3 . . .' },
  /* Redsand Steppe: a hot, bending scale over a war-drum */
  redsand: { bpm: 104, lead: 'pulse',
    mel: 'A4 . A4 A#4 C#5 . A#4 A4 E5 . D5 C#5 A#4 . A4 . G4 . A4 A#4 C#5 . E5 D5 C#5 A#4 A4 . . . . .',
    bass: 'A2 . . A2 E3 . A2 . A2 . . A2 G2 . A2 .',
    drum: 'k . . k s . . . k . k . s . h .' },
  /* Greywater Fens: slow and damp, with a long echo */
  fens: { bpm: 78, lead: 'triangle',
    mel: 'E5 . . G5 F#5 . E5 . D5 . B4 . . . . . E5 . . G5 A5 . B5 . A5 G5 F#5 . E5 . . .',
    bass: 'E2 . . . B2 . . . A2 . . . E2 . . . E2 . . . B2 . . . C#3 . . . B2 . . .' },
  /* Ashen Ridge: a tense march in C minor */
  ashen: { bpm: 112, lead: 'pulse',
    mel: 'C5 . D#5 . G5 . F5 D#5 D5 . D#5 . C5 . . . G4 . C5 D5 D#5 . F5 G5 G#5 . G5 F5 D#5 . D5 .',
    bass: 'C3 . C3 . G2 . C3 . G#2 . G#2 . G2 . G2 .',
    drum: 'k . h . s . h . k k h . s . h h' },
  /* Frostmere: clear and high, like breath in cold air */
  frostmere: { bpm: 84, lead: 'triangle',
    mel: 'F#5 . B5 . A5 F#5 E5 . D5 . . . E5 F#5 . . G5 . F#5 E5 D5 . C#5 . B4 . . . . . . .',
    bass: 'B2 . . . F#3 . . . G2 . . . D3 . . . E2 . . . G2 . . . F#2 . . . . . . .' },
  /* The Barrowfields: a slow lament over a heartbeat */
  barrowfield: { bpm: 72, lead: 'triangle',
    mel: 'F#4 . . A4 G#4 . . . F#4 . . C#5 D5 . C#5 . A4 . . . G#4 . . . F#4 . . . . . . .',
    bass: 'F#2 . . . . . . . D2 . . . . . . . E2 . . . . . . . C#2 . . . . . . .',
    drum: 'k . . . . . . . k . . . . . . h' },
  /* Hollow Crown: an uneasy canopy tune with gaps around the empty seat */
  hollowcrown: { bpm: 88, lead: 'triangle',
    mel: 'E5 . F5 B4 C5 . G5 F5 E5 D5 . B4 A4 . . . C5 . E5 G5 F5 E5 D5 . B4 C5 . A4 B4 . E5 .',
    bass: 'E2 . . B2 C3 . G2 . A2 . . E3 F2 . C3 . E2 . B2 . C3 . . G2 A2 . E3 . B2 . . .',
    drum: 'k . . . . . h . k . . . . . . h' },
  /* Crown's Heart: low, old wood opening briefly into the throne's gold light */
  crownheart: { bpm: 82, lead: 'triangle',
    mel: 'B4 . E5 F#5 G5 . F#5 B4 A4 . C5 E5 D5 . B4 . G4 B4 . D5 E5 . G5 F#5 E5 D5 C5 . B4 . E5 .',
    bass: 'E2 . B2 . C3 . G2 . A2 . E3 . B2 . F#3 .',
    drum: 'k . . h . . . . k . . . . h . .' },
  /* any dungeon: low stone halls */
  dungeon: { bpm: 96, lead: 'pulse',
    mel: 'D4 . F4 . A4 . G#4 . A4 . . . F4 . E4 . D4 . F4 . A4 . C5 . A#4 . A4 . G4 . E4 .',
    bass: 'D2 . D2 . . . D2 . A#1 . A#1 . A1 . A1 .',
    drum: 'k . . . s . . . k . . k s . . .' },
  /* a dungeon boss: fast and driving */
  boss: { bpm: 144, lead: 'square', echo: false,
    mel: 'A4 A4 C5 A4 D5 A4 C5 B4 A4 A4 E5 A4 D5 C5 B4 G#4 A4 A4 C5 A4 F5 E5 D5 C5 B4 C5 D5 B4 G#4 . E4 .',
    bass: 'A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 E2 E3 E2 E3',
    drum: 'k h s h k k s h k h s h k k s s' },
  /* after a death, walking back as a spirit */
  ghost: { bpm: 60, lead: 'triangle',
    mel: 'E5 . . . . . D5 . . . . . B4 . . . . . . . . . . . A4 . . . G4 . . .',
    bass: 'E2 . . . . . . . . . . . . . . . C2 . . . . . . . . . . . . . . .' }
};
function musicKey() {
  const h = H(); if (!h || !C) return null;
  if (C.phase === 'dead') return 'ghost';
  if (h.dun) return C.mob && C.mob.boss ? 'boss' : 'dungeon';
  return TRACKS[h.zone] ? h.zone : 'thornvale';
}
/* every quest giver has their own voice pitch, the same each time */
function voiceOf(who) { let n = 0; for (const ch of String(who).split(':')[0]) n = (n * 31 + ch.charCodeAt(0)) % 997; return 260 + n % 280; }
const SND = ArcadeSound.create({
  tracks: TRACKS, musicKey,
  mode: () => S.snd || 0, setMode: m => { S.snd = m; save(); },
  button: () => $('#sndBtn')
});
function sfx(name, arg) { SND.sfx(name, arg); }
