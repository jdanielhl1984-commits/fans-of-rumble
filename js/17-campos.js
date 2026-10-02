// Fans of Rumble · Campos de batalla especiales de los jefes
'use strict';
/* ---------- v0.9.18: campos de jefe ----------
   Cada jefe de mundo podrá tener su propio terreno, que sorprende al jugador y afecta a los DOS bandos.
   De momento hay uno de prueba: el RÍO DE LAVA del jefe del Sector Neón (CyberMarine corrupto), en la campaña y en el Modo Jefe.
   Para añadir otro terreno: una entrada en TERRAINS y su mundo en TERRAIN_OF. */
const TERRAINS = {
  lava: {
    name: 'RÍO DE LAVA',
    sub: 'Las grietas queman a los dos bandos. ¡Y a veces entran en erupción!',
    burn: 0.04,        // quema el 4 % de la vida por segundo dentro de una grieta (los que vuelan, no)
    erupt: 3,          // en erupción, el triple
    eruptEvery: 13,    // cada cuántos segundos entra en erupción una grieta
    warn: 1.6,         // segundos de aviso antes de la erupción
    eruptFor: 2.4,     // lo que dura la erupción
    pools: [           // grietas de lava: en el camino entre el centro y los puentes, dos en cada mitad
      { x: 172, y: 338, rx: 30, ry: 17 }, { x: 368, y: 338, rx: 30, ry: 17 },
      { x: 172, y: 504, rx: 30, ry: 17 }, { x: 368, y: 504, rx: 30, ry: 17 },
    ],
  },
};
const TERRAIN_OF = { 4: 'lava' };   // mundo (empezando por 0) → terreno de su jefe
const TR = { on: null, t: 0, next: 0, pool: -1, phase: '', phaseT: 0 };
function terrainFor(mode, lvl) {
  if (mode === 'camp' && lvl && lvl.boss) return TERRAIN_OF[lvl.wi] || null;
  if (mode === 'boss') return TERRAIN_OF[G.bossWi] || null;
  return null;
}
function terrainStart() {   // al empezar la partida
  const k = G.terrain; TR.on = k ? TERRAINS[k] : null; TR.t = 0; TR.pool = -1; TR.phase = ''; TR.phaseT = 0;
  if (!TR.on) return;
  TR.next = TR.on.eruptEvery * 0.8;
  for (const u of units) u.lavaAcc = 0;
  setTimeout(() => { if (G.state === 'play' || G.state === 'countdown') banner('¡' + TR.on.name + '!', TR.on.sub, 'boss'); }, 600);
}
const inPool = (u, p, grow) => { const dx = (u.x - p.x) / (p.rx * grow), dy = (u.y - p.y) / (p.ry * grow); return dx * dx + dy * dy < 1; };
function terrainUpdate(dt) {
  const T = TR.on; if (!T || G.state !== 'play') return;
  TR.t += dt;
  // erupciones: aviso → erupción → calma
  if (TR.phase === 'warn') { TR.phaseT -= dt; if (TR.phaseT <= 0) { TR.phase = 'erupt'; TR.phaseT = T.eruptFor; G.shake = Math.max(G.shake, 5); play('boom'); } }
  else if (TR.phase === 'erupt') { TR.phaseT -= dt; if (TR.phaseT <= 0) { TR.phase = ''; TR.pool = -1; TR.next = T.eruptEvery; } }
  else if ((TR.next -= dt) <= 0) { TR.pool = Math.floor(Math.random() * T.pools.length); TR.phase = 'warn'; TR.phaseT = T.warn; play('deny'); }
  // quemaduras (se apuntan poco a poco y se enseñan cada medio segundo, para no llenar la pantalla de números)
  for (const u of units) {
    if (!u.alive || u.deployT > 0 || u.jump || (TYPES[u.type] && TYPES[u.type].hover)) continue;
    let m = 0;
    T.pools.forEach((p, i) => { const er = TR.phase === 'erupt' && TR.pool === i; if (inPool(u, p, er ? 1.7 : 1)) m = Math.max(m, er ? T.erupt : 1); });
    if (!m) { u.lavaT = 0; continue; }
    u.lavaAcc = (u.lavaAcc || 0) + u.maxHp * T.burn * m * dt; u.lavaT = (u.lavaT || 0) + dt;
    if (u.lavaT >= 0.5 && u.lavaAcc >= 1) { const n = Math.floor(u.lavaAcc); u.lavaAcc -= n; u.lavaT = 0; hurt(u, n, null, 'rage'); if (Math.random() < 0.15) addNum(u.x, u.y, topOf(u) + 16, '¡QUEMA!', '#ff8a3d', 13); }
  }
}
// ---- dibujo (va encima del fondo, debajo de las unidades). Devuelve true si sustituye al agua.
function terrainGround() {
  const T = TR.on && G.state !== 'title' ? TR.on : null; if (!T) return false;
  const t = G.t, c = ctx;
  // ambiente: todo el campo con luz roja de lava
  c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = '#d98a6a'; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 0.1; c.fillStyle = '#ff3c00'; c.fillRect(0, 0, W, H); c.restore();
  // el río es de lava
  c.save();
  const top = RIVER.top, bot = RIVER.bottom, g = c.createLinearGradient(0, top, 0, bot);
  g.addColorStop(0, '#b3200c'); g.addColorStop(0.35, '#ff8a1c'); g.addColorStop(0.5, '#ffd23f'); g.addColorStop(0.65, '#ff8a1c'); g.addColorStop(1, '#b3200c');
  c.fillStyle = g; c.fillRect(0, top, W, bot - top);
  for (const [y0, dir] of [[top - 16, 1], [bot, -1]]) { const gg = c.createLinearGradient(0, y0, 0, y0 + 16); gg.addColorStop(dir > 0 ? 0 : 1, 'rgba(255,110,20,0)'); gg.addColorStop(dir > 0 ? 1 : 0, 'rgba(255,110,20,.45)'); c.fillStyle = gg; c.fillRect(0, y0, W, 16); }
  c.beginPath(); c.rect(0, top, W, bot - top); c.clip();
  c.fillStyle = 'rgba(70,14,4,.55)';   // costras que flotan despacio
  for (let i = 0; i < 9; i++) { const x = ((i * 83 + t * (7 + (i % 3) * 3)) % (W + 120)) - 60, y = top + 8 + (i % 3) * 11; c.beginPath(); c.ellipse(x, y, 16 + (i % 4) * 6, 4 + (i % 2) * 2, 0, 0, Math.PI * 2); c.fill(); }
  c.fillStyle = '#fff3b0';   // burbujas que revientan
  for (let i = 0; i < 10; i++) { const k = (t * 0.7 + i * 0.37) % 1, x = (i * 61 + Math.floor(t * 0.7 + i * 0.37) * 97) % W, y = top + 7 + ((i * 13) % 24); c.globalAlpha = Math.sin(k * Math.PI) * 0.9; c.beginPath(); c.arc(x, y, 1.5 + k * 3.5, 0, Math.PI * 2); c.fill(); }
  c.restore();
  // grietas de lava
  T.pools.forEach((p, i) => {
    const er = TR.pool === i && TR.phase === 'erupt', wn = TR.pool === i && TR.phase === 'warn', s = er ? 1.7 : 1, pulse = 1 + Math.sin(t * 3 + i) * 0.04;
    c.save(); c.translate(p.x, p.y);
    c.fillStyle = 'rgba(40,10,4,.85)'; c.beginPath(); c.ellipse(0, 2, p.rx * s * 1.18, p.ry * s * 1.25, 0, 0, Math.PI * 2); c.fill();   // borde de roca
    const rg = c.createRadialGradient(0, 0, 2, 0, 0, p.rx * s); rg.addColorStop(0, '#fff3b0'); rg.addColorStop(0.35, '#ffb02e'); rg.addColorStop(0.8, '#e2420f'); rg.addColorStop(1, '#8c1a08');
    c.fillStyle = rg; c.beginPath(); c.ellipse(0, 0, p.rx * s * pulse, p.ry * s * pulse, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(70,14,4,.5)'; c.beginPath(); c.ellipse(-p.rx * 0.35 * s, -2, p.rx * 0.28 * s, p.ry * 0.25 * s, 0.3, 0, Math.PI * 2); c.fill();
    if (wn) {   // aviso: anillo que parpadea y una exclamación
      const a = 0.5 + 0.5 * Math.sin(t * 22); c.strokeStyle = `rgba(255,236,120,${a})`; c.lineWidth = 3; c.setLineDash([6, 5]);
      c.beginPath(); c.ellipse(0, 0, p.rx * 1.7, p.ry * 1.7, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      c.font = '22px "Luckiest Guy", Impact, sans-serif'; c.textAlign = 'center'; c.lineWidth = 5; c.strokeStyle = '#20102c'; c.strokeText('!', 0, -p.ry - 6); c.fillStyle = '#ffe06a'; c.fillText('!', 0, -p.ry - 6);
    }
    c.restore();
  });
  return true;
}
function terrainAir() {   // llamas de la erupción y chispas del río (encima de las unidades)
  const T = TR.on && G.state !== 'title' ? TR.on : null; if (!T) return;
  const t = G.t, c = ctx;
  c.save();
  for (let i = 0; i < 14; i++) {   // chispas que suben del río
    const k = (t * 0.45 + i * 0.173) % 1, x = (i * 41 + Math.floor(t * 0.45 + i * 0.173) * 131) % W, y = RIVER.y + 10 - k * 70;
    c.globalAlpha = (1 - k) * 0.8; c.fillStyle = i % 2 ? '#ffd23f' : '#ff6a1a'; c.beginPath(); c.arc(x + Math.sin(t * 3 + i) * 4, y, 1.6, 0, Math.PI * 2); c.fill();
  }
  if (TR.phase === 'erupt' && TR.pool >= 0) {
    const p = T.pools[TR.pool];
    for (let i = 0; i < 9; i++) {   // lenguas de fuego
      const k = (t * 1.8 + i * 0.21) % 1, x = p.x + (i - 4) * p.rx * 0.32, hgt = 30 + 40 * Math.sin((k + i) * Math.PI);
      const fg = c.createLinearGradient(0, p.y, 0, p.y - hgt); fg.addColorStop(0, 'rgba(255,150,30,.9)'); fg.addColorStop(1, 'rgba(255,60,0,0)');
      c.globalAlpha = 0.85; c.fillStyle = fg; c.beginPath(); c.moveTo(x - 7, p.y); c.quadraticCurveTo(x + Math.sin(t * 9 + i) * 8, p.y - hgt * 0.6, x, p.y - hgt); c.quadraticCurveTo(x + 4, p.y - hgt * 0.5, x + 7, p.y); c.fill();
    }
  }
  c.restore();
}
