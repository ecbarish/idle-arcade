'use strict';
/* Chiptune sound, made live by the arcade's shared sound engine (shared/sound.js; Realmbound uses it too). Off by
   default; the header button cycles Off → Effects → Effects + music. sfx(name) is safe to call anytime. Tracks are
   note strings, one 8th note per token, '.' = rest; drum lines use k (kick), s (snare), h (hi-hat). */
const TRACKS = {
  // Original four-bar loops; each group of eight tokens is one bar.
  // Larkhaven: C major, gentle steps home over C–Am–F–G.
  larkhaven: { bpm: 88, mel: 'G4 . E5 G5 E5 . D5 . C5 . E5 . A4 G4 E4 . F4 . A4 C5 A4 . G4 . D5 . B4 G4 D5 B4 G4 .',
    bass: 'C3 . G3 . C3 . G3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 .' },
  // Emberfall: G major, rising phrases with room for the highland air.
  emberfall: { bpm: 116, mel: 'G4 D5 G5 . B5 A5 G5 . E5 . G5 B5 A5 G5 E5 . C5 E5 G5 . A5 G5 E5 C5 D5 F#5 A5 . G5 F#5 D5 .',
    bass: 'G2 . D3 G3 G2 . D3 . E3 . B2 E3 E3 . B2 . C3 . G2 C3 C3 . G2 . D3 . A2 D3 D3 . A2 .' },
  // Cloudglass: D major, suspended phrases and open space above the pass.
  cloudglass: { bpm: 90, mel: 'A5 . . F#5 E5 . D5 . B4 . F#5 . A5 . . . G5 . E5 D5 E5 . A4 . C#5 . E5 . A5 G5 E5 .',
    bass: 'D3 . . A3 . . D3 . B2 . . F#3 . . B2 . G2 . . D3 . . G2 . A2 . . E3 . . A2 .' },
  // Stillreed: a quiet F-major crossing, pauses between the drops and reeds.
  stillreed: { bpm: 76, lead: 'triangle', mel: 'C5 . A4 C5 F5 . E5 D5 C5 . . A4 G4 . F4 . A4 C5 D5 . F5 E5 D5 C5 A#4 . G4 A4 C5 . F5 .',
    bass: 'F2 . C3 . A2 . E3 . D3 . A2 . G2 . C3 .' },
  // Hollowecho: original D-minor call and answering fragments between quiet rests.
  hollowecho: { bpm: 72, lead: 'pulse', mel: 'D5 . A4 . F5 . E5 D5 . A4 . C5 . . D5 . F5 . G5 F5 . E5 . A4 C5 . E5 D5 . A4 . .',
    bass: 'D3 . . A2 . . D3 . C3 . . G2 . . A2 .' },
  // Sunthread: original G-major answering phrases over G-C-Em-D, bright and open.
  sunthread: { bpm: 104, lead: 'triangle', mel: 'G4 B4 D5 . E5 D5 B4 A4 C5 E5 G5 E5 D5 . C5 . B4 D5 E5 G5 F#5 E5 D5 B4 A4 C5 D5 F#5 E5 D5 A4 .',
    bass: 'G2 . D3 . G2 . B2 . C3 . G2 . C3 . E3 . E3 . B2 . E3 . G3 . D3 . A2 . D3 . F#3 .' },
  // Farwatch: original D-major horizon phrases over D-Bm-G-A; rests leave room for the sea.
  farwatch: { bpm: 86, lead: 'triangle', mel: 'F#4 A4 D5 . E5 F#5 E5 . D5 B4 F#4 . A4 B4 D5 . G4 B4 E5 D5 B4 . A4 G4 E4 A4 C#5 E5 D5 . A4 .',
    bass: 'D3 . A2 . D3 . F#3 . B2 . F#3 . B2 . D3 . G2 . D3 . G2 . B2 . A2 . E3 . A2 . C#3 .' },
  // Wardens: A minor, a firm march resolving through E back to A.
  warden: { bpm: 180, mel: 'A4 E5 A5 C6 B5 A5 E5 . F5 A5 C6 A5 G5 F5 E5 D5 G5 D5 B5 A5 G5 E5 D5 B4 E5 G#5 B5 E6 D6 B5 G#5 E5',
    bass: 'A2 E3 A3 E3 A2 E3 A3 E3 F2 C3 F3 C3 F2 C3 F3 C3 G2 D3 G3 D3 G2 D3 G3 D3 E2 B2 E3 B2 E2 B2 E3 B2',
    drum: 'k h s h k h s h k h s h k h s h k h s h k h s h k k s h k s s s' },
  // Night: slower C-major fragments; rests leave the landscape quiet.
  night: { bpm: 68, mel: 'E5 . . G5 . E5 . . C5 . . A4 . E5 . . A4 . C5 . G4 . . . B4 . D5 . G4 . D5 .',
    bass: 'C3 . . . G2 . . . A2 . . . E3 . . . F2 . . . C3 . . . G2 . . . D3 . . .' },
  // Rain: C major, a steady falling figure over Dm–G–C–G.
  rain: { bpm: 82, mel: 'A4 . F5 E5 D5 . F5 . B4 . D5 C5 B4 . A4 . G4 . E5 D5 C5 . E5 . D5 . B4 A4 G4 . B4 .',
    bass: 'D3 . A2 . D3 . A2 . G2 . D3 . G2 . D3 . C3 . G2 . C3 . G2 . G2 . D3 . G2 . D3 .' },
  thornwood: { bpm: 104, mel: 'E5 . G5 . A5 G5 E5 . D5 . E5 . C5 . . . E5 . G5 . A5 . C6 . B5 A5 G5 . E5 . . . F5 . A5 . G5 F5 E5 . D5 . E5 . C5 . A4 . G4 . C5 . E5 . D5 . G4 . C5 . . . . .',
    bass: 'C3 . G3 . C3 . G3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 .' },
  saltmarsh: { bpm: 92, mel: 'D5 . F5 A5 . G5 F5 . E5 D5 . . C5 . D5 E5 . F5 E5 . D5 C5 . . A4 . C5 D5 . E5 F5 . G5 A5 . . G5 . F5 E5 . D5 C5 . A4 D5 . . . . .',
    bass: 'D3 . . A2 . . D3 . . A2 . . C3 . . G2 . . C3 . . G2 . . A#2 . . F2 . . C3 . . G2 . . D3 . . A2 . . D3 . . . . .' },
  battle: { bpm: 152, mel: 'A4 C5 E5 A5 G5 E5 C5 E5 F5 A5 C6 A5 G5 E5 D5 E5 A4 C5 E5 A5 B5 G5 E5 G5 A5 . E5 . A4 . . .',
    bass: 'A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 G2 G3 G2 G3 A2 A3 A2 A3 E2 E3 E2 E3 A2 A3 A2 A3 A2 . . .',
    drum: 'k . h . s . h . k . h k s . h . k . h . s . h . k k h . s . s s' },
  trainer: { bpm: 164, shift: 2, mel: 'A4 . A4 C5 E5 . D5 C5 B4 . G4 B4 D5 . C5 B4 A4 . A4 C5 E5 . A5 G5 F5 E5 D5 C5 B4 . E5 .',
    bass: 'A2 A3 A2 A3 A2 A3 A2 A3 G2 G3 G2 G3 G2 G3 G2 G3 F2 F3 F2 F3 F2 F3 F2 F3 E2 E3 E2 E3 E2 E3 E2 E3',
    drum: 'k . h k s . h . k . h k s . h h k . h k s . h . k k h . s s s .' },
  legend: { bpm: 84, mel: 'E5 . . . D5 . . . B4 . . . A4 . . . G4 . . . A4 . B4 . E4 . . . . . . .',
    bass: 'E2 . . . E2 . . . C2 . . . C2 . . . G2 . . . D2 . . . E2 . . . E2 . . .',
    drum: 'k . . . . . . . h . . . . . . . k . . . . . . . s . . . s . . .' }
};
const VOICE = { maren: 330, wren: 620, isolde: 260, nerys: 290, toren: 240, pip: 700, tobin: 220,
  vessa: 410, bram: 280, lise: 510, cato: 350, marit: 560, orsk: 230, sela: 460, ilka: 480, teodor: 250 };
function musicKey() {
  if (B) {
    if (B.story && STORY.some(b => b.id === B.story && b.gate)) return 'warden';
    return B.story && B.kind === 'wild' ? 'legend' : B.kind === 'trainer' ? 'trainer' : 'battle';
  }
  if (S.pos) {
    const map = MAPS[S.pos.map];
    if (map && !map.biome) return 'larkhaven';
    if (isNight()) return 'night';
    if (weatherNow() === 'rain') return 'rain';
  }
  return TRACKS[S.biome] ? S.biome : 'thornwood';
}
/* The same rain heard on the route continues behind a battle; the inn stays quiet. */
function rainLevel() { return S.started && S.pos && MAPS[S.pos.map].biome && weatherNow() === 'rain' ? (stormy() ? 1 : .65) : 0; }
const SND = ArcadeSound.create({
  tracks: TRACKS, voices: VOICE, musicKey, rain: rainLevel,
  mode: () => S.snd || 0, setMode: m => { S.snd = m; },
  button: () => $('#sndBtn')
});
function sfx(name, arg) { SND.sfx(name, arg); }
function cycleSound() { SND.cycle(); }
function renderSoundBtn() { SND.render(); }
