// Fans of Rumble · Sonidos y música (creados con código, sin archivos)
'use strict';
/* =========================================================
   AUDIO (synthesised, no files)
   ========================================================= */
let AC = null, master = null, noiseBuf = null, muted = false;
try { muted = localStorage.getItem('for-muted') === '1'; } catch (e) { /* storage blocked */ }
function audioInit() {
  try {
    if (!AC) {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain(); master.gain.value = 0; master.connect(AC.destination); applyVolume();
      noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      musicInit();
    }
    if (AC.state === 'suspended') AC.resume();
  } catch (e) { AC = null; }
}
function tone(f0, f1, dur, type = 'sine', vol = 0.3, delay = 0) {
  if (!AC) return; const t = AC.currentTime + delay; const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, vol, freq = 1200, ftype = 'lowpass', delay = 0) {
  if (!AC) return; const t = AC.currentTime + delay; const s = AC.createBufferSource(); s.buffer = noiseBuf;
  const f = AC.createBiquadFilter(); f.type = ftype; f.frequency.value = freq; const g = AC.createGain();
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.05);
}
const SFX = {
  deploy: (v = 1) => { tone(560, 200, 0.18, 'sine', 0.22 * v); noise(0.1, 0.08 * v, 900); },
  land: (v = 1) => { noise(0.16, 0.22 * v, 500); tone(150, 60, 0.14, 'sine', 0.25 * v); },
  hit: () => noise(0.06, 0.1, 2400, 'bandpass'),
  acorn: () => tone(900, 520, 0.08, 'triangle', 0.07),
  carrot: () => tone(700, 380, 0.1, 'triangle', 0.08),
  laser: () => tone(1500, 320, 0.12, 'square', 0.035),
  eyelaser: () => tone(900, 200, 0.18, 'sawtooth', 0.05),
  plasma: () => tone(720, 260, 0.14, 'sawtooth', 0.04),
  boom: () => { noise(0.7, 0.5, 650); tone(95, 40, 0.55, 'sine', 0.4); },
  jump: () => tone(220, 900, 0.35, 'triangle', 0.16),
  slam: () => { noise(0.35, 0.4, 420); tone(120, 45, 0.3, 'sine', 0.35); },
  womp: () => { tone(320, 290, 0.26, 'sawtooth', 0.09); tone(270, 170, 0.55, 'sawtooth', 0.09, 0.28); },
  despido: () => { tone(500, 500, 0.08, 'square', 0.06); tone(500, 500, 0.08, 'square', 0.06, 0.12); },
  poof: () => { noise(0.16, 0.1, 1600); tone(620, 300, 0.1, 'sine', 0.06); },
  clank: () => { noise(0.12, 0.12, 3000, 'highpass'); tone(260, 180, 0.12, 'square', 0.04); },
  deny: () => tone(190, 140, 0.13, 'square', 0.07),
  heal: () => { tone(660, 990, 0.18, 'sine', 0.06); tone(990, 1320, 0.2, 'sine', 0.05, 0.08); },
  summon: () => { tone(160, 320, 0.4, 'sawtooth', 0.06); tone(240, 480, 0.4, 'triangle', 0.06, 0.1); },
  wail: () => { tone(900, 1400, 0.25, 'sawtooth', 0.05); tone(1400, 700, 0.35, 'sawtooth', 0.05, 0.22); },
  revive: () => { tone(220, 660, 0.3, 'triangle', 0.08); noise(0.2, 0.06, 1500); },
  eject: () => { tone(300, 900, 0.2, 'square', 0.07); noise(0.15, 0.15, 1200); },
  trash: () => { noise(0.18, 0.2, 900); tone(220, 90, 0.18, 'sine', 0.18); },
  select: () => tone(660, 880, 0.07, 'triangle', 0.08),
  pop: () => tone(880, 1400, 0.08, 'sine', 0.06),
  gun: () => noise(0.05, 0.08, 3200, 'bandpass'),
  snipe: () => { tone(1800, 200, 0.22, 'sawtooth', 0.06); noise(0.12, 0.12, 2400, 'highpass'); },
  zap: () => { noise(0.18, 0.16, 4000, 'highpass'); tone(1200, 300, 0.16, 'square', 0.05); },
  note: () => tone(pick([523, 587, 659, 784, 880]), 0, 0.14, 'square', 0.05),
  card: () => { noise(0.06, 0.08, 5000, 'highpass'); tone(500, 900, 0.08, 'triangle', 0.05); },
  hack: () => { for (let i = 0; i < 5; i++) tone(rand(300, 1600), 0, 0.04, 'square', 0.04, i * 0.05); },
  blink: () => { tone(1400, 400, 0.14, 'sine', 0.08); noise(0.1, 0.06, 3000, 'highpass'); },
  shield: () => tone(500, 1000, 0.18, 'sine', 0.05),
  levelup: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, f, 0.14, 'triangle', 0.08, i * 0.07)),
  hype: () => { tone(660, 990, 0.12, 'square', 0.06); tone(990, 1320, 0.14, 'square', 0.06, 0.1); },
  roll: () => { for (let i = 0; i < 4; i++) noise(0.03, 0.08, 2600, 'bandpass', i * 0.05); tone(700, 1000, 0.1, 'triangle', 0.05, 0.22); },
  laugh: () => [0, 0.11, 0.22].forEach(d => tone(420, 300, 0.09, 'square', 0.05, d)),
  blip: () => { tone(880, 880, 0.05, 'square', 0.035); tone(1320, 1320, 0.05, 'square', 0.03, 0.05); },
  missile: () => { noise(0.25, 0.12, 1800, 'bandpass'); tone(300, 900, 0.22, 'sawtooth', 0.04); },
  horn: () => { tone(330, 330, 0.25, 'sawtooth', 0.07); tone(440, 440, 0.3, 'sawtooth', 0.06, 0.05); },
  tick: () => tone(660, 660, 0.1, 'square', 0.09),
  go: () => { tone(880, 1320, 0.3, 'square', 0.1); noise(0.3, 0.1, 2000); },
  crown: () => { tone(784, 1568, 0.35, 'triangle', 0.14); tone(1046, 1046, 0.3, 'triangle', 0.1, 0.12); },
  sad: () => { tone(330, 300, 0.3, 'triangle', 0.12); tone(262, 220, 0.45, 'triangle', 0.12, 0.25); },
  win: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, f, 0.24, 'square', 0.08, i * 0.11)),
  lose: () => [392, 370, 349, 294].forEach((f, i) => tone(f, f * 0.97, 0.38, 'sawtooth', 0.08, i * 0.32)),
};
const THROTTLE = { blip: 70, missile: 120, heal: 250, trash: 80, hit: 45, acorn: 60, laser: 60, plasma: 60, carrot: 60, eyelaser: 60, poof: 50, clank: 50, pop: 70, gun: 60, note: 90, card: 90, zap: 80, shield: 300, roll: 120, laugh: 1500 };
const lastPlay = {};
function play(name, ...a) {
  if (!AC || muted) return;
  const now = performance.now(); if (lastPlay[name] && now - lastPlay[name] < (THROTTLE[name] || 25)) return; lastPlay[name] = now;
  try { SFX[name](...a); } catch (e) { /* ignore */ }
}

/* =========================================================
   MUSIC (synthesised, no files): menu, one theme per faction, boss, last-minute rush, win / lose jingles
   ========================================================= */
const SCALES = { maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 10], phr: [0, 1, 3, 5, 7, 8, 10], hmin: [0, 2, 3, 5, 7, 8, 11], wt: [0, 2, 4, 6, 8, 10] };
// "4 - . 2" -> [{ s: 0, v: 4, n: 2 }, { s: 3, v: 2, n: 1 }]   (s = step 0-15, n = length in steps; "-" holds, "." rests, "?" = random note)
function mseq(str) {
  const out = [];
  str.trim().split(/\s+/).forEach((t, i) => {
    if (t === '-') { if (out.length) out[out.length - 1].n++; }
    else if (t !== '.') out.push({ s: i, v: t === '?' ? '?' : (isNaN(+t) ? t : +t), n: 1 });
  });
  return out;
}
const TRACKS = (() => {
  const mk = d => { d.sc = SCALES[d.scale]; d.L = d.lead.seq.map(mseq); d.B = d.bass ? mseq(d.bass.seq) : []; d.A = d.arp ? d.arp.seq.split(' ') : null; return d; };
  const T = {
    // música de espera de Microblizz: ascensor, jazz suave, nada que ver con el caos de ahí abajo
    menu: mk({
      bpm: 92, tonic: 53, scale: 'maj', prog: [0, 5, 1, 4], seven: true, swing: 0.1, dv: 0.5,
      pad: { wave: 'triangle', vol: 0.34, lp: 1600, att: 0.25 },
      bass: { wave: 'sine', vol: 0.5, seq: 'r . . . . . f . . . r . . . f .' },
      drums: { k: 'x.......x.......', h: '..x...x...x...x.' },
      lead: { wave: 'sine', bell: true, vol: 0.36, gate: 0.9, min: 0.9, oct: 7, up: 0, seq: [
        '4 . . . 2 . 4 . 6 . . . 4 . . .',
        '5 . . . 4 . 2 . 4 . . . 2 . . .',
        '3 . . . 4 . 5 . 4 . 3 . 1 . . .',
        '4 . . . 6 . 5 . 3 . . . 4 . . .'] } }),
    // Animales Locos: dibujos animados, saltarín
    animales: mk({
      bpm: 132, tonic: 48, scale: 'maj', prog: [0, 4, 5, 3], dv: 1,
      pad: { wave: 'square', vol: 0.16, lp: 1200, att: 0.05 },
      bass: { wave: 'triangle', vol: 0.7, seq: 'r . o . r . o . r . o . r . f .' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', h: '..x...x...x...x.' },
      lead: { wave: 'square', vol: 0.2, gate: 0.55, lp: 4000, oct: 7, up: 7, seq: [
        '4 . 4 2 . 0 . 2 4 - . . 7 . 4 .',
        '6 . 6 4 . 1 . 4 6 - . . 8 . 6 .',
        '5 . 7 5 . 2 . 5 7 - . . 9 . 7 .',
        '5 . 3 5 . 7 . 5 7 8 9 8 7 5 4 2'] } }),
    // No-Muertos: lento, gótico, campanas de caja de música
    nomuertos: mk({
      bpm: 78, tonic: 45, scale: 'min', prog: [0, 5, 3, 4], dv: 0.8,
      pad: { wave: 'sawtooth', vol: 0.28, lp: 700, att: 0.5 },
      bass: { wave: 'triangle', vol: 0.8, oct: 0, seq: 'r - - - - - - - o . . . r . . .' },
      drums: { k: 'x.......x.x.....', t: '........x.......' },
      lead: { wave: 'sine', bell: true, vol: 0.3, gate: 1.5, min: 1.2, oct: 14, up: 0, seq: [
        '4 . . . 2 . . . 0 . . . 2 . . .',
        '5 . . . 7 . . . 5 . . . 4 . . .',
        '7 . . . 5 . . . 3 . . . 5 . . .',
        '8 . . . 6 . . . 4 . . . 6 . 7 .'] } }),
    // Streamers: pop de directo, bombo a negro y palmas
    streamers: mk({
      bpm: 124, tonic: 50, scale: 'maj', prog: [0, 4, 5, 3], dv: 1,
      pad: { wave: 'sawtooth', vol: 0.15, lp: 2200, att: 0.05 },
      bass: { wave: 'sawtooth', vol: 0.45, lp: 600, seq: '. . r . . . r . . . r . . . r .' },
      drums: { k: 'x...x...x...x...', c: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      arp: { wave: 'square', vol: 0.1, lp: 3000, oct: 0, gate: 0.5, seq: '0 1 2 3 2 1 2 3 0 1 2 3 2 1 2 1' },
      lead: { wave: 'sawtooth', vol: 0.19, det: 9, lp: 3500, gate: 0.8, oct: 7, up: 0, seq: [
        '2 . 4 . 7 - - . 4 . 2 . 4 - . .',
        '6 . 4 . 6 . 8 - . . 6 . 4 . 2 .',
        '5 . 7 . 9 - - . 7 . 5 . 7 - . .',
        '5 . 7 . 10 - - . 9 . 7 . 5 . 3 .'] } }),
    // Héroes: fanfarria épica, marcha y trompetas
    heroes: mk({
      bpm: 100, tonic: 48, scale: 'maj', prog: [0, 3, 4, 0], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.2, lp: 1400, att: 0.25 },
      bass: { wave: 'triangle', vol: 0.7, seq: 'r . . r . . r . r . . r . . . .' },
      drums: { k: 'x.....x.x.......', s: '....x.......x.x.', t: '..............x.' },
      lead: { wave: 'sawtooth', vol: 0.22, det: 7, lp: 3000, att: 0.03, gate: 0.95, oct: 7, up: 0, seq: [
        '0 - . 0 . 4 - - 7 - - - 4 - . .',
        '3 - . 3 . 7 - - 10 - - - 7 - . .',
        '4 - . 4 . 8 - - 11 - - - 8 - 6 .',
        '7 - - - 4 - 7 - 9 - 8 - 7 - - -'] } }),
    // Ciberpunks: synthwave, bajo pulsante y arpegio
    ciber: mk({
      bpm: 112, tonic: 45, scale: 'min', prog: [0, 0, 6, 5], dv: 1,
      pad: { wave: 'sawtooth', vol: 0.13, lp: 900, att: 0.3 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 500, oct: 0, seq: 'r r . r r . r . r r . r r . o .' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      arp: { wave: 'square', vol: 0.1, lp: 2500, oct: 7, gate: 0.4, seq: '0 1 2 3 0 1 2 3 0 1 2 3 0 1 2 3' },
      lead: { wave: 'sawtooth', vol: 0.17, det: 10, lp: 2200, gate: 0.95, oct: 14, up: 0, seq: [
        '4 - - . 2 . 0 . 2 - - - . . . .',
        '4 - - . 7 - 6 - 4 - . . . . . .',
        '6 - - . 4 . 3 . 4 - - - . . 1 .',
        '5 - - . 7 - 9 - 7 - 5 - 4 - . .'] } }),
    // Memes: rápido, raro y con notas al azar (RNG)
    memes: mk({
      bpm: 140, tonic: 55, scale: 'maj', prog: [0, 3, 4, 3], swing: 0.05, dv: 1,
      pad: { wave: 'square', vol: 0.12, lp: 1500, att: 0.05 },
      bass: { wave: 'square', vol: 0.4, lp: 900, seq: 'r . r . o . r . r . r . o . f .' },
      drums: { k: 'x..x..x...x.x...', s: '....x.......x..x', h: 'x.x.x.x.x.x.x.x.' },
      lead: { wave: 'square', vol: 0.19, lp: 3500, gate: 0.6, oct: 7, up: 7, seq: [
        '4 . 4 . ? . 7 - . ? . 4 . ? . 2',
        '3 . 3 . ? . 5 - . ? . 3 . ? . 7',
        '4 . 4 . ? . 6 - . ? . 4 . ? . 8',
        '3 . ? . 5 . ? . 7 . ? . 5 . ? .'] } }),
    // Jefes (y CEO de Microblizz): amenaza corporativa
    boss: mk({
      bpm: 150, tonic: 40, scale: 'phr', prog: [0, 1, 0, 6], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.18, lp: 800, att: 0.1 },
      bass: { wave: 'sawtooth', vol: 0.45, lp: 700, oct: 0, seq: 'r r . r r . r r . r r . r . r r' },
      drums: { k: 'x.x.x.x.x.xxx.x.', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      lead: { wave: 'sawtooth', vol: 0.21, det: 12, lp: 2800, gate: 0.85, oct: 14, up: 0, seq: [
        '0 . 0 . 1 - 0 . . . 3 - 1 . 0 .',
        '1 . 1 . 2 - 1 . . . 4 - 2 . 1 .',
        '0 . 0 . 1 - 0 . . . 5 - 3 . 1 .',
        '6 . 6 . 5 - 6 . . . 4 - 3 - 2 .'] } }),
    // ---- un tema por jefe de mundo (v0.9.8) ----
    // Mundo 1, SurvivalBot: robot corporativo con tecleo de oficina
    boss0: mk({
      bpm: 128, tonic: 45, scale: 'min', prog: [0, 5, 6, 4], dv: 1, crash: true,
      pad: { wave: 'square', vol: 0.12, lp: 900, att: 0.05 },
      bass: { wave: 'square', vol: 0.4, lp: 600, oct: 0, seq: 'r . r . r . r . r . r . o . r .' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', h: 'xxxxxxxxxxxxxxxx' },
      lead: { wave: 'square', vol: 0.17, gate: 0.5, lp: 3000, oct: 14, up: 0, seq: [
        '0 . 2 . 4 . 2 . 0 . 4 . 7 . 4 .',
        '5 . 7 . 9 . 7 . 5 . 9 . 12 . 9 .',
        '6 . 8 . 10 . 8 . 6 . 10 . 13 . 10 .',
        '4 . 6 . 8 . 6 . 4 . 8 . 11 . 7 -'] } }),
    // Mundo 2, NecroLord corrupto: órgano de catedral en menor armónica
    boss1: mk({
      bpm: 96, tonic: 50, scale: 'hmin', prog: [0, 5, 3, 4], dv: 1, crash: true,
      pad: { wave: 'square', vol: 0.2, lp: 1300, att: 0.04 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 500, seq: 'r - - - r - - - r - - - o - r -' },
      drums: { k: 'x.......x.......', t: '....x.......x.x.' },
      lead: { wave: 'square', vol: 0.16, det: 5, lp: 2200, gate: 0.95, oct: 7, up: 0, seq: [
        '7 - - - 6 - 7 - 9 - - - 7 - 4 -',
        '5 - - - 7 - 9 - 12 - - - 9 - 7 -',
        '3 - - - 5 - 7 - 10 - - - 8 - 7 -',
        '4 - - - 6 - 8 - 11 - - - 10 - 8 -'] } }),
    // Mundo 3, TwitchKing corrupto: EDM de directo patrocinado con fallos (notas al azar)
    boss2: mk({
      bpm: 128, tonic: 47, scale: 'min', prog: [0, 5, 2, 6], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.14, lp: 1800, att: 0.02 },
      bass: { wave: 'sawtooth', vol: 0.45, lp: 700, oct: 0, seq: '. . r . . . r . . . r . . . r r' },
      drums: { k: 'x...x...x...x...', c: '....x.......x...', h: '......x.......x.', o: '..x.......x.....' },
      arp: { wave: 'square', vol: 0.09, lp: 3200, oct: 7, gate: 0.4, seq: '0 2 1 3 0 2 1 3 0 2 1 3 2 1 0 1' },
      lead: { wave: 'sawtooth', vol: 0.18, det: 14, lp: 3200, gate: 0.7, oct: 14, up: 0, seq: [
        '0 . 0 . 2 . 4 . ? . 4 . 2 . 0 .',
        '0 . 0 . 2 . 4 . ? . 5 . 4 . 2 .',
        '2 . 2 . 4 . 6 . ? . 7 . 6 . 4 .',
        '6 . 6 . 8 . 9 . ? ? ? ? 8 . 6 .'] } }),
    // Mundo 4, EpicChampion corrupto: épica de guerra en menor, tambores y metales
    boss3: mk({
      bpm: 112, tonic: 50, scale: 'min', prog: [0, 5, 6, 0], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.22, lp: 1200, att: 0.2 },
      bass: { wave: 'triangle', vol: 0.75, seq: 'r . . r . . r . r . . r . . r .' },
      drums: { k: 'x..x..x.x..x..x.', t: '....x.......x.xx', s: '............x...' },
      lead: { wave: 'sawtooth', vol: 0.21, det: 8, lp: 2600, att: 0.03, gate: 0.95, oct: 7, up: 0, seq: [
        '0 - - . 0 . 2 - 4 - - - 2 - 0 -',
        '5 - - . 5 . 4 - 2 - - - 4 - 5 -',
        '6 - - . 6 . 8 - 9 - - - 8 - 6 -',
        '7 - - - 4 - 7 - 9 - 7 - 4 - - -'] } }),
    // Mundo 5, CyberMarine corrupto: darksynth industrial
    boss4: mk({
      bpm: 118, tonic: 45, scale: 'phr', prog: [0, 0, 1, 6], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.15, lp: 900, att: 0.1 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 600, oct: 0, seq: 'r r r r r r r r r r r r o o r r' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', c: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      arp: { wave: 'square', vol: 0.08, lp: 2400, oct: 7, gate: 0.35, seq: '0 1 2 3 2 1 0 1 0 1 2 3 2 1 0 3' },
      lead: { wave: 'sawtooth', vol: 0.17, det: 12, lp: 2000, gate: 0.95, oct: 14, up: 0, seq: [
        '0 - - - . . 1 - 0 - - - . . . .',
        '0 - - - . . 3 - 1 - - - . . . .',
        '1 - - - . . 3 - 4 - - - 3 - 1 -',
        '6 - - - 5 - 4 - 3 - 1 - 0 - - -'] } }),
    // Mundo 6, MemeLord corrupto: caos en escala de tonos enteros, con notas al azar
    boss5: mk({
      bpm: 156, tonic: 52, scale: 'wt', prog: [0, 1, 0, 2], swing: 0.12, dv: 1, crash: true,
      pad: { wave: 'square', vol: 0.12, lp: 1400, att: 0.05 },
      bass: { wave: 'square', vol: 0.4, lp: 800, seq: 'r . o . r . o . r o . r . o r .' },
      drums: { k: 'x..x..x.x..x.x..', s: '....x..x....x...', h: 'x.x.x.x.x.x.x.x.' },
      lead: { wave: 'square', vol: 0.18, lp: 3600, gate: 0.6, oct: 6, up: 6, seq: [
        '0 . 2 . 4 . ? . 6 . ? . 4 . 2 .',
        '1 . 3 . 5 . ? . 7 . ? . 5 . 3 .',
        '0 . 2 . 4 . ? ? ? ? 8 . 6 . 4 .',
        '2 . 4 . 6 . 8 - - . ? . ? . ? .'] } }),
    // Mundo 7 y Modo Jefe, el CEO: la música de espera del menú… en versión malvada
    boss6: mk({
      bpm: 138, tonic: 53, scale: 'hmin', prog: [0, 5, 1, 4], seven: true, dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.2, lp: 1100, att: 0.08 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 650, seq: 'r . r r . r r . r . r r . r o .' },
      drums: { k: 'x.x.x.x.x.xxx.x.', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      lead: { wave: 'sawtooth', vol: 0.21, det: 10, lp: 2600, gate: 0.9, oct: 7, up: 7, seq: [
        '4 . . . 2 . 4 . 6 . . . 4 . . .',
        '5 . . . 4 . 2 . 4 . . . 2 . . .',
        '3 . . . 4 . 5 . 4 . 3 . 1 . . .',
        '4 . . . 6 . 5 . 3 . . . 4 . . .'] } }),
    // ---- v0.9.13: facciones nuevas
    // Comunidad Gamer: chiptune con ritmo de torneo
    gamer: mk({
      bpm: 136, tonic: 50, scale: 'min', prog: [0, 5, 2, 6], dv: 1,
      pad: { wave: 'sawtooth', vol: 0.12, lp: 1600, att: 0.03 },
      bass: { wave: 'square', vol: 0.4, lp: 800, seq: 'r . r r . r . r r . r . o . r .' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.', o: '......x.......x.' },
      arp: { wave: 'square', vol: 0.08, lp: 3400, oct: 7, gate: 0.4, seq: '0 1 2 3 2 1 0 1 0 1 2 3 2 1 0 2' },
      lead: { wave: 'square', vol: 0.17, lp: 3600, gate: 0.7, oct: 14, up: 0, seq: [
        '0 . 2 . 4 . 2 . 0 . 4 . 7 - . .',
        '5 . 4 . 2 . 0 . 2 . 4 . 5 - . .',
        '2 . 4 . 5 . 4 . 2 . 5 . 9 - . .',
        '6 . 5 . 4 . 2 . 1 . 2 . 4 - 6 .'] } }),
    // Olvidados: 8 bits nostálgicos, como un juego que nunca salió
    olvidados: mk({
      bpm: 112, tonic: 52, scale: 'maj', prog: [0, 4, 5, 3], swing: 0.08, dv: 0.9,
      pad: { wave: 'triangle', vol: 0.16, lp: 1200, att: 0.08 },
      bass: { wave: 'triangle', vol: 0.5, seq: 'r . . r . . r . r . . r . . o .' },
      drums: { k: 'x.......x.......', s: '....x.......x...', h: '..x...x...x...x.' },
      arp: { wave: 'square', vol: 0.06, lp: 2400, oct: 7, gate: 0.5, seq: '0 1 2 1 0 1 2 3 0 1 2 1 0 1 2 3' },
      lead: { wave: 'square', vol: 0.15, lp: 2600, gate: 0.85, oct: 7, up: 7, seq: [
        '4 - - . 2 . 4 . 7 - - . 6 - 4 .',
        '4 - - . 1 . 4 . 6 - - . 4 - 1 .',
        '5 - - . 4 . 2 . 4 - - . 2 - 0 .',
        '3 - - . 4 . 5 . 6 - - - 4 - - .'] } }),
    // Cultura Pop: fanfarria de película taquillera
    pop: mk({
      bpm: 120, tonic: 48, scale: 'maj', prog: [0, 5, 3, 4], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.18, lp: 1400, att: 0.06 },
      bass: { wave: 'sawtooth', vol: 0.42, lp: 700, seq: 'r . . r r . . . r . . r r . o .' },
      drums: { k: 'x.....x.x.......', s: '....x.......x..x', t: '..............x.', h: 'x.x.x.x.x.x.x.x.' },
      lead: { wave: 'sawtooth', vol: 0.2, det: 8, lp: 3000, gate: 0.9, oct: 7, up: 0, seq: [
        '4 - - 4 7 - - - 9 - 7 - 4 - - -',
        '5 - - 5 7 - - - 9 - 11 - 12 - - -',
        '10 - - 9 7 - - - 5 - 7 - 9 - - -',
        '11 - - - 9 - 7 - 8 - - - 11 - - -'] } }),
    // Mundo 8, VikingoPerdido corrupto: marcha vikinga con tambores de guerra
    boss7: mk({
      bpm: 104, tonic: 45, scale: 'min', prog: [0, 6, 5, 6], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.18, lp: 900, att: 0.1 },
      bass: { wave: 'square', vol: 0.45, lp: 600, oct: 0, seq: 'r . r . r . r . r . r . r r r .' },
      drums: { k: 'x...x...x...x.x.', t: '..x...x...x.xx..', s: '....x.......x...' },
      lead: { wave: 'square', vol: 0.18, det: 6, lp: 2400, gate: 0.85, oct: 7, up: 0, seq: [
        '0 - - 2 3 - 2 - 0 - - - 4 - 3 -',
        '6 - - 5 4 - 3 - 4 - - - 2 - - -',
        '5 - - 4 3 - 2 - 3 - - - 5 - 7 -',
        '6 - - - 4 - - - 6 - 5 - 4 - - -'] } }),
    // Mundo 9, PayStation sin lector: música de tienda de consolas, pero fría y amenazante
    boss8: mk({
      bpm: 132, tonic: 47, scale: 'hmin', prog: [0, 5, 3, 4], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.14, lp: 1300, att: 0.04 },
      bass: { wave: 'sawtooth', vol: 0.45, lp: 650, oct: 0, seq: 'r . r . . r . r r . r . . r o .' },
      drums: { k: 'x...x...x...x...', c: '....x.......x...', h: 'x.xxx.xxx.xxx.xx' },
      arp: { wave: 'triangle', vol: 0.09, lp: 3200, oct: 7, gate: 0.5, seq: '0 2 1 3 0 2 1 3 0 2 1 3 3 2 1 0' },
      lead: { wave: 'sawtooth', vol: 0.19, det: 12, lp: 2800, gate: 0.8, oct: 14, up: 0, seq: [
        '0 . . 0 . . 2 . 4 . . 4 . . 2 .',
        '5 . . 5 . . 4 . 2 . . 2 . . 4 .',
        '3 . . 3 . . 2 . 0 . . 0 . . 2 .',
        '4 . . 6 . . 7 - - . 6 . 4 . 2 .'] } }),
    // Mundo 10, ProGamer corrupto: electrónica de final de torneo
    boss9: mk({
      bpm: 150, tonic: 49, scale: 'min', prog: [0, 0, 5, 6], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.14, lp: 1800, att: 0.02 },
      bass: { wave: 'sawtooth', vol: 0.45, lp: 750, oct: 0, seq: '. r . r . r . r . r . r . r r r' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', h: '.x.x.x.x.x.x.x.x', o: '..............x.' },
      arp: { wave: 'square', vol: 0.08, lp: 3600, oct: 14, gate: 0.35, seq: '0 1 2 3 0 1 2 3 0 1 2 3 3 2 1 0' },
      lead: { wave: 'square', vol: 0.17, det: 8, lp: 3400, gate: 0.6, oct: 14, up: 0, seq: [
        '0 . 0 . 3 . 0 . 4 . 3 . 2 . 0 .',
        '0 . 0 . 3 . 0 . 6 . 5 . 4 . 2 .',
        '5 . 5 . 7 . 5 . 9 . 7 . 5 . 4 .',
        '6 . 6 . 8 . 6 . 10 - - . 9 . 8 .'] } }),
    // Mundo 11, LaDirectora corrupta: tráiler dramático en menor armónica
    boss10: mk({
      bpm: 92, tonic: 41, scale: 'hmin', prog: [0, 5, 3, 4], seven: true, dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.2, lp: 1000, att: 0.15 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 520, seq: 'r - - - . . r . r - - - . . o .' },
      drums: { k: 'x.......x.x.....', t: '....x.......x.xx', s: '............x...' },
      lead: { wave: 'sawtooth', vol: 0.2, det: 10, lp: 2400, gate: 0.95, oct: 7, up: 7, seq: [
        '4 - - - 3 - 4 - 6 - - - 4 - - -',
        '5 - - - 4 - 2 - 4 - - - 2 - - -',
        '3 - - - 2 - 3 - 5 - - - 3 - - -',
        '4 - - - 6 - 7 - 6 - - - 4 - - -'] } }),
    // Mundo 12, el Presidente de Phony: el sonido de arranque de una consola… en versión malvada
    boss11: mk({
      bpm: 144, tonic: 46, scale: 'phr', prog: [0, 1, 0, 5], seven: true, dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.2, lp: 900, att: 0.06 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 650, oct: 0, seq: 'r r . r r . r . r r . r . r o .' },
      drums: { k: 'x.x.x.x.x.xxx.x.', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      arp: { wave: 'triangle', vol: 0.08, lp: 3000, oct: 14, gate: 0.4, seq: '3 2 1 0 3 2 1 0 3 2 1 0 2 1 0 1' },
      lead: { wave: 'sawtooth', vol: 0.21, det: 12, lp: 2700, gate: 0.85, oct: 7, up: 7, seq: [
        '0 . 1 . 0 . 4 - - . 3 . 1 . 0 .',
        '1 . 2 . 1 . 5 - - . 4 . 2 . 1 .',
        '0 . 1 . 3 . 4 - - . 6 . 7 - - .',
        '5 . 4 . 3 . 1 - - . 0 . 1 . 0 .'] } }),
    // jingles de final de partida (suenan una vez y vuelve el menú)
    win: mk({
      bpm: 132, tonic: 48, scale: 'maj', prog: [0, 3, 0], dv: 1, once: true, next: 'menu',
      pad: { wave: 'sawtooth', vol: 0.18, lp: 2500, att: 0.04 },
      bass: { wave: 'triangle', vol: 0.6, seq: 'r . . . . . . . r . . . . . . .' },
      drums: { k: 'x...x...x...x...', s: '..x...x...x.x.xx' },
      lead: { wave: 'square', vol: 0.22, det: 6, lp: 4000, gate: 0.9, oct: 7, up: 0, seq: [
        '0 . 2 . 4 . 7 - - - . . 4 . 7 .',
        '3 . 5 . 7 . 10 - - - . . 7 . 10 .',
        '7 - - - 4 - 7 - 9 - - - 11 - - -'] } }),
    lose: mk({
      bpm: 76, tonic: 45, scale: 'min', prog: [0, 0], dv: 1, once: true, next: 'menu',
      pad: { wave: 'sawtooth', vol: 0.18, lp: 600, att: 0.2 },
      bass: { wave: 'triangle', vol: 0.6, oct: 0, seq: 'r - - - - - - - - - - - - - - -' },
      drums: { k: 'x...............' },
      lead: { wave: 'sawtooth', vol: 0.2, lp: 1200, gate: 0.95, oct: 7, up: 0, seq: [
        '4 - - - 3 - - - 2 - - - 1 - - -',
        '0 - - - - - - - - - - - - - - -'] } }),
  };
  return T;
})();

const M = { name: null, trk: null, out: null, bus: null, lp: null, step: 0, bar: 0, next: 0, tm: 1, tmT: 1, want: undefined, duck: false, timer: null };
const musVol = () => (SAVE.mus == null ? 70 : SAVE.mus) / 100;
const midiHz = m => 440 * Math.pow(2, (m - 69) / 12);
function degMidi(T, d) { const n = T.sc.length, o = Math.floor(d / n); return T.tonic + T.sc[d - o * n] + 12 * o; }
function musicInit() {
  M.bus = AC.createGain(); M.lp = AC.createBiquadFilter(); M.lp.type = 'lowpass'; M.lp.frequency.value = 18000;
  M.bus.connect(M.lp); M.lp.connect(master);
  try { const comp = AC.createDynamicsCompressor(); comp.threshold.value = -12; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.18; master.disconnect(); master.connect(comp); comp.connect(AC.destination); } catch (e) { /* sin compresor */ }
  applyVolume();
  if (!M.timer) M.timer = setInterval(musicPump, 40);
}
function mnote(out, f, t, dur, type, vol, o = {}) {
  const osc = AC.createOscillator(), g = AC.createGain(); osc.type = type; osc.frequency.value = f;
  const a = o.att || 0.01, r = o.rel || 0.08, tEnd = t + dur, tA = Math.min(t + a, tEnd);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, tA);
  if (o.dec) { const tD = Math.min(tA + o.dec, tEnd); if (tD > tA) g.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol * Math.pow(o.sus == null ? 0.3 : o.sus, (tD - tA) / o.dec)), tD); }
  g.gain.exponentialRampToValueAtTime(0.0001, tEnd + r);
  let node = osc;
  if (o.lp) { const fl = AC.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp; osc.connect(fl); node = fl; }
  node.connect(g); g.connect(out);
  osc.start(t); osc.stop(tEnd + r + 0.05);
  if (o.det) { // segundo oscilador desafinado: sonido más grueso
    const o2 = AC.createOscillator(); o2.type = type; o2.frequency.value = f; o2.detune.value = o.det; let n2 = o2;
    if (o.lp) { const f2 = AC.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = o.lp; o2.connect(f2); n2 = f2; }
    n2.connect(g); o2.start(t); o2.stop(tEnd + r + 0.05);
  }
}
function mnoise(out, t, dur, vol, freq, type = 'bandpass') {
  const s = AC.createBufferSource(); s.buffer = noiseBuf; const f = AC.createBiquadFilter(); f.type = type; f.frequency.value = freq; const g = AC.createGain();
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 0.08); s.stop(t + dur + 0.02);
}
const MDRUM = {
  k: (o, t, v) => { const os = AC.createOscillator(), g = AC.createGain(); os.type = 'sine'; os.frequency.setValueAtTime(165, t); os.frequency.exponentialRampToValueAtTime(48, t + 0.14);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.9 * v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22); os.connect(g); g.connect(o); os.start(t); os.stop(t + 0.26); },
  s: (o, t, v) => { mnoise(o, t, 0.13, 0.5 * v, 1900); mnote(o, 190, t, 0.07, 'triangle', 0.3 * v, { rel: 0.05 }); },
  c: (o, t, v) => { [0, 0.012, 0.024].forEach(d => mnoise(o, t + d, 0.05, 0.3 * v, 1500)); mnoise(o, t + 0.036, 0.16, 0.35 * v, 1300); },
  h: (o, t, v) => mnoise(o, t, 0.04, 0.16 * v, 7500, 'highpass'),
  o: (o, t, v) => mnoise(o, t, 0.2, 0.16 * v, 7000, 'highpass'),
  t: (o, t, v) => { const os = AC.createOscillator(), g = AC.createGain(); os.type = 'sine'; os.frequency.setValueAtTime(190, t); os.frequency.exponentialRampToValueAtTime(95, t + 0.25);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.55 * v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35); os.connect(g); g.connect(o); os.start(t); os.stop(t + 0.4); },
  X: (o, t, v) => mnoise(o, t, 0.9, 0.3 * v, 4500, 'highpass'),
};
// v0.9.16: cada tema es una canción de 8 vueltas (32 compases) antes de repetirse:
//   vuelta 0 = tema tal cual · 1 = más agudo y con segunda voz · 2 = pregunta y respuesta (la melodía se da la vuelta)
//   3 = respiro (melodía suelta, sin bombo al principio) y redoble para volver · 4 a 7 = lo mismo, un tono más alto
function musicStep(T, out, step, bar, loop, t, sd) {
  const bi = bar % T.prog.length, d = T.prog[bi], song = !T.once, sec = song ? loop % 4 : 0, odd = song ? sec === 1 : loop % 2 === 1;
  const mod = song && Math.floor(loop / 4) % 2 === 1 ? (T.mod == null ? 2 : T.mod) : 0, hz = deg => midiHz(degMidi(T, deg) + mod);
  const last = bi === T.prog.length - 1, n7 = T.sc.length, tones = [d, d + 2, d + 4, d + n7];
  if (step === 0) {
    if (T.pad) { const vs = T.seven ? [d, d + 2, d + 4, d + 6] : [d, d + 2, d + 4]; vs.forEach(x => mnote(out, hz(x), t, sd * 16 * 0.98, T.pad.wave, T.pad.vol / vs.length * (sec === 3 ? 2 : 1.6), { att: T.pad.att, rel: 0.3, lp: T.pad.lp, det: 6 })); }
    if (T.crash && bi === 0) MDRUM.X(out, t, 1);
  }
  // bajo
  for (const ev of T.B) if (ev.s === step) {
    const sh = T.bass.oct == null ? -n7 : T.bass.oct, deg = ev.v === 'r' ? d + sh : ev.v === 'f' ? d + 4 + sh : ev.v === 'o' ? d + sh + n7 : d + sh - n7;
    mnote(out, hz(deg), t, ev.n * sd * 0.92, T.bass.wave, T.bass.vol, { att: 0.012, rel: 0.06, lp: T.bass.lp });
  }
  // batería (en el respiro, los dos primeros compases sin bombo; en el último, redoble para volver)
  if (T.drums) {
    const dv = (T.dv || 1) * (M.rush ? 1.1 : 1), brk = sec === 3 && bi < 2;
    for (const k in T.drums) if (T.drums[k][step] === 'x' && !(brk && (k === 'k' || k === 's' || k === 'c'))) MDRUM[k](out, t, dv);
    if (M.rush && !T.drums.h && step % 2 === 0) MDRUM.h(out, t, dv);       // en el último minuto se añaden hi-hats
    if (M.rush && T.drums.h && step % 2 === 1 && step % 4 !== 3) MDRUM.h(out, t, dv * 0.7);
    if (song && sec === 3 && last && step >= 12 && T.drums.k) MDRUM.s(out, t, dv * (0.55 + (step - 12) * 0.15));
    if (song && sec === 3 && last && step === 14 && T.drums.k) MDRUM.s(out, t + sd / 2, dv * 0.8);
  }
  // arpegio
  if (T.A && T.A[step] !== '.') mnote(out, hz(tones[+T.A[step]] + (T.arp.oct || 0)), t, sd * T.arp.gate, T.arp.wave, T.arp.vol, { att: 0.005, rel: 0.05, lp: T.arp.lp });
  // melodía
  const Ld = T.lead, resp = sec === 2 && bi % 2 === 1, src = T.L[(resp ? bi + 2 : bi) % T.L.length];
  for (const ev of src) if (ev.s === step) {
    if (sec === 3 && ev.s % 4 !== 0) continue;   // respiro: solo las notas fuertes
    let v = ev.v === '?' ? pick([0, 1, 2, 4, 5, 7, 8, 9]) : ev.v;
    if (resp) v = 8 - v;                          // respuesta: la frase de otro compás, dada la vuelta
    const deg = v + (Ld.oct || 0) + (odd ? (Ld.up || 0) : 0);
    const dur = Math.max(ev.n * sd * (Ld.gate || 0.9) * (sec === 3 ? 2 : 1), Ld.min || 0), f = hz(deg);
    if (Ld.bell) { mnote(out, f, t, dur, 'sine', Ld.vol, { att: 0.004, rel: 0.4, dec: dur * 0.9, sus: 0.05 }); mnote(out, f * 2.01, t, dur * 0.4, 'sine', Ld.vol * 0.3, { att: 0.002, rel: 0.2, dec: 0.2, sus: 0.05 }); }
    else mnote(out, f, t, dur, Ld.wave, Ld.vol, { att: Ld.att || 0.012, rel: 0.07, lp: Ld.lp, det: Ld.det });
    if (sec === 1) mnote(out, hz(deg + 2), t, dur, Ld.bell ? 'sine' : Ld.wave, Ld.vol * 0.38, { att: Ld.att || 0.012, rel: 0.07, lp: Ld.lp });   // segunda voz, una tercera por encima
  }
}
function musicSet(name, at) {
  if (!AC || !M.bus) return;
  const now = AC.currentTime, t0 = Math.max(now + 0.03, at || 0), old = M.out;
  if (old) { old.gain.setTargetAtTime(0, Math.max(now, at || now), 0.12); setTimeout(() => { try { old.disconnect(); } catch (e) { /* ya desconectado */ } }, Math.max(0, t0 - now) * 1000 + 2500); }
  M.name = name; M.trk = name ? TRACKS[name] : null; M.out = null;
  if (!M.trk) return;
  M.out = AC.createGain(); M.out.gain.setValueAtTime(0.0001, t0); M.out.gain.linearRampToValueAtTime(1, t0 + (M.trk.once ? 0.02 : 0.5)); M.out.connect(M.bus);
  M.step = 0; M.bar = 0; M.next = t0 + 0.02;
}
// programa las notas con un poco de antelación (así no se corta aunque el juego vaya justo)
function musicPump(limitOverride) {
  if (!AC || !M.trk) return;
  const T = M.trk, now = AC.currentTime;
  if (limitOverride === undefined && (muted || musVol() === 0 || document.hidden)) { M.next = Math.max(M.next, now + 0.05); return; }
  if (limitOverride === undefined && M.next < now - 0.1) M.next = now + 0.03;
  const limit = typeof limitOverride === 'number' ? limitOverride : now + 0.3;
  while (M.next < limit && M.trk === T) {
    const sd = 60 / (T.bpm * M.tm) / 4, loop = Math.floor(M.bar / T.prog.length);
    M.rush = M.tmT > 1;
    musicStep(T, M.out, M.step, M.bar, loop, M.next + (M.step % 2 === 1 ? (T.swing || 0) * sd : 0), sd);
    M.next += sd; M.step++; M.tm += (M.tmT - M.tm) * 0.06;
    if (M.step >= 16) { M.step = 0; M.bar++; if (T.once && M.bar >= T.prog.length) { musicSet(T.next === 'menu' && SAVE.menuMus && TRACKS[SAVE.menuMus] ? SAVE.menuMus : T.next || null, M.next + 0.6); return; } }
  }
}
// decide qué suena según lo que pasa en el juego (se llama en cada frame; es barato)
function musicUpdate() {
  if (!AC || !M.bus) return;
  const st = G.state, boss = G.mode === 'boss' || (G.mode === 'camp' && G.level && G.level.boss);
  let want;
  if (st === 'title') want = SAVE.menuMus && TRACKS[SAVE.menuMus] ? SAVE.menuMus : 'menu';   // v0.9.22: la elige el jugador en Opciones
  else if (st === 'play' || st === 'paused') { want = !boss ? G.faction : G.mode === 'boss' ? 'boss' + (G.bossWi == null ? CEO_WI : G.bossWi) : 'boss' + G.level.wi; if (!TRACKS[want]) want = boss ? 'boss' : 'menu'; }
  else if (st === 'end') want = G.winner === 'p' ? 'win' : G.winner === 'e' ? 'lose' : 'menu';
  else want = null;                                  // cuenta atrás y final de la partida: silencio
  if (want !== M.want) { M.want = want; musicSet(want); }
  M.tmT = st === 'play' && (G.double || (boss && S.e.phase2)) ? 1.18 : 1;   // último minuto o fase 2 del jefe: más rápido
  const duck = st === 'paused';
  if (duck !== M.duck) { M.duck = duck; M.lp.frequency.setTargetAtTime(duck ? 600 : 18000, AC.currentTime, 0.08); }
}

