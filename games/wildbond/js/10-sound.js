'use strict';
/* Chiptune sound, made live with Web Audio (no audio files). Off by default; the header button cycles
   Off → Effects → Effects + music. sfx(name) is safe to call anytime. Tracks are note strings, one 8th
   note per token, '.' = rest. */
const SND = { ac: null, out: null, next: 0, step: 0, track: null };
const TRACKS = {
  thornwood: { bpm: 104, mel: 'E5 . G5 . A5 G5 E5 . D5 . E5 . C5 . . . E5 . G5 . A5 . C6 . B5 A5 G5 . E5 . . . F5 . A5 . G5 F5 E5 . D5 . E5 . C5 . A4 . G4 . C5 . E5 . D5 . G4 . C5 . . . . .',
    bass: 'C3 . G3 . C3 . G3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 .' },
  saltmarsh: { bpm: 92, mel: 'D5 . F5 A5 . G5 F5 . E5 D5 . . C5 . D5 E5 . F5 E5 . D5 C5 . . A4 . C5 D5 . E5 F5 . G5 A5 . . G5 . F5 E5 . D5 C5 . A4 D5 . . . . .',
    bass: 'D3 . . A2 . . D3 . . A2 . . C3 . . G2 . . C3 . . G2 . . A#2 . . F2 . . C3 . . G2 . . D3 . . A2 . . D3 . . . . .' },
  battle: { bpm: 152, mel: 'A4 C5 E5 A5 G5 E5 C5 E5 F5 A5 C6 A5 G5 E5 D5 E5 A4 C5 E5 A5 B5 G5 E5 G5 A5 . E5 . A4 . . .',
    bass: 'A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 G2 G3 G2 G3 A2 A3 A2 A3 E2 E3 E2 E3 A2 A3 A2 A3 A2 . . .' },
  trainer: { bpm: 164, shift: 2, mel: 'A4 . A4 C5 E5 . D5 C5 B4 . G4 B4 D5 . C5 B4 A4 . A4 C5 E5 . A5 G5 F5 E5 D5 C5 B4 . E5 .',
    bass: 'A2 A3 A2 A3 A2 A3 A2 A3 G2 G3 G2 G3 G2 G3 G2 G3 F2 F3 F2 F3 F2 F3 F2 F3 E2 E3 E2 E3 E2 E3 E2 E3' },
  legend: { bpm: 84, mel: 'E5 . . . D5 . . . B4 . . . A4 . . . G4 . . . A4 . B4 . E4 . . . . . . .',
    bass: 'E2 . . . E2 . . . C2 . . . C2 . . . G2 . . . D2 . . . E2 . . . E2 . . .' }
};
for (const t of Object.values(TRACKS)) { t.mel = t.mel.split(' '); t.bass = t.bass.split(' '); }
const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
function hz(n, shift) { const m = /^([A-G]#?)(\d)$/.exec(n); return m ? 440 * Math.pow(2, (NOTE[m[1]] + (shift || 0) + (Number(m[2]) + 1) * 12 - 69) / 12) : 0; }

function sndMode() { return (S.snd || 0); }   // 0 off, 1 effects, 2 effects + music
function audio() {
  if (!SND.ac) { try { SND.ac = new (window.AudioContext || window.webkitAudioContext)(); SND.out = SND.ac.createGain(); SND.out.gain.value = 0.14; SND.out.connect(SND.ac.destination); } catch (e) { return null; } }
  if (SND.ac.state === 'suspended') SND.ac.resume(); return SND.ac;
}
function tone(f, dur, type, at, vol, slide) {
  const ac = SND.ac, o = ac.createOscillator(), g = ac.createGain(), t = at || ac.currentTime;
  o.type = type || 'square'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.5, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(SND.out); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, at, vol) {
  const ac = SND.ac, n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ac.createBufferSource(), g = ac.createGain(); g.gain.value = vol || 0.4; s.buffer = buf; s.connect(g); g.connect(SND.out); s.start(at || ac.currentTime);
}
const VOICE = { maren: 330, wren: 620, isolde: 260, nerys: 290, toren: 240, pip: 700, tobin: 220 };
function sfx(name, arg) {
  if (!sndMode() || document.hidden || !audio()) return; const t = SND.ac.currentTime, arp = (ns, d, ty, v) => ns.forEach((n, i) => tone(hz(n), d, ty || 'square', t + i * d, v || 0.35));
  switch (name) {
    case 'blip': tone((VOICE[arg] || 440) * (0.95 + Math.random() * 0.1), 0.04, 'square', t, 0.12); break;
    case 'select': tone(880, 0.05, 'square', t, 0.15); break;
    case 'hit': noise(0.08, t, 0.35); tone(180, 0.08, 'square', t, 0.25, 0.5); break;
    case 'crit': noise(0.16, t, 0.5); tone(240, 0.16, 'sawtooth', t, 0.35, 0.3); break;
    case 'faint': tone(520, 0.45, 'triangle', t, 0.4, 0.2); break;
    case 'heal': arp(['C5', 'E5', 'G5', 'C6'], 0.06, 'triangle'); break;
    case 'warn': tone(330, 0.1, 'square', t, 0.25); tone(330, 0.1, 'square', t + 0.14, 0.25); break;
    case 'catch': arp(['G5', 'C6', 'E6', 'G6', 'C7'], 0.07); break;
    case 'miss': tone(300, 0.2, 'square', t, 0.25, 0.6); break;
    case 'win': arp(['C5', 'E5', 'G5', 'C6', 'G5', 'C6'], 0.09); break;
    case 'lose': arp(['E4', 'D#4', 'D4', 'C#4'], 0.16, 'triangle'); break;
    case 'level': arp(['C5', 'G5', 'C6', 'E6'], 0.08); break;
    case 'badge': arp(['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'], 0.11); break;
  }
}
function musicKey() {
  if (B) return B.story && B.kind === 'wild' ? 'legend' : B.kind === 'trainer' ? 'trainer' : 'battle';
  return TRACKS[S.biome] ? S.biome : 'thornwood';
}
/* a small look-ahead sequencer */
setInterval(() => {
  if (sndMode() < 2 || document.hidden || !SND.ac || SND.ac.state !== 'running') { SND.track = null; return; }
  const k = musicKey(); if (k !== SND.track) { SND.track = k; SND.step = 0; SND.next = SND.ac.currentTime + 0.1; }
  const tr = TRACKS[k], len = 60 / tr.bpm / 2;
  while (SND.next < SND.ac.currentTime + 0.25) {
    const m = tr.mel[SND.step % tr.mel.length], b = tr.bass[SND.step % tr.bass.length];
    if (m !== '.') tone(hz(m, tr.shift), len * 0.9, 'square', SND.next, 0.09);
    if (b !== '.') tone(hz(b, tr.shift), len * 0.95, 'triangle', SND.next, 0.22);
    SND.step++; SND.next += len;
  }
}, 60);
function cycleSound() { S.snd = (sndMode() + 1) % 3; if (S.snd) { audio(); sfx('select'); } renderSoundBtn(); }
function renderSoundBtn() { const b = $('#sndBtn'); if (b) { b.textContent = ['Sound: off', 'Sound: effects', 'Sound: effects + music'][sndMode()]; b.setAttribute('aria-pressed', sndMode() ? 'true' : 'false'); } }
