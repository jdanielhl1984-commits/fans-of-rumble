// Fans of Rumble · Campos de batalla especiales de los jefes
'use strict';
/* ---------- v0.9.18-0.9.19: campos de jefe ----------
   Cada jefe de mundo pelea en su propio campo, que sorprende al jugador y afecta a los DOS bandos:
   · un río distinto (lava, café, dulces, arcoíris, discos…), y a veces helado: se cruza por donde sea
   · 1, 2 o 3 puentes (de piedra, metal, galleta, oro…), un túnel donde no se ve la pelea o un peaje
   · zonas en el suelo, en sitios distintos cada partida: queman, pegan, resbalan, hacen tropezar, pinchan, aceleran o curan
   · cosas que caen del cielo con aviso: meteoritos, chicles gigantes, diapositivas del CEO…
   Los que vuelan no pisan las zonas del suelo, pero lo que cae del cielo les da igual.
   Para cambiar un campo: su entrada en TERRAINS. Para cambiar qué jefe lleva cuál: TERRAIN_OF (mundo empezando por 0). */

// ---- tipos de zona: qué hacen
//   burn: quema v (fracción de la vida) por segundo · spike: v de daño cada cuarto de segundo mientras anda
//   slow / fast: multiplica la velocidad por v · slide: más rápido y se va de lado · trip: al entrar, aturdido v segundos
//   heal: cura v (fracción de la vida) por segundo
const TERRAINS = {
  cafe: {
    ground: ['#c49a6a', 0.22],
    name: 'OFICINA INUNDADA', sub: 'Río de café, charcos que resbalan y cartas de despido que caen del techo.',
    tint: ['#e6c9a8', 0], river: { c: ['#3b2412', '#7a4a22', '#a8703f'], float: 'foam' }, bridges: [110, 430], bstyle: 'metal',
    zones: [{ kind: 'slide', art: 'coffee', n: 2, v: 1.45, rx: 34, ry: 18 }],
    fall: { art: 'paper', every: 9, warn: 1.4, r: 36, dmg: 0.03, stun: 1.1, say: '¡DESPEDIDO!' },
  },
  cripta: {
    ground: ['#14241a', 0.32],
    name: 'LA CRIPTA DEL TÚNEL', sub: 'Un túnel cruza por debajo del río: lo que pasa dentro, no se ve. Y las tumbas te agarran.',
    tint: ['#9fb4c8', 0.04], river: { c: ['#123b1f', '#2f9a4b', '#8ef07a'], float: 'slime' }, bridges: [110, 430], bstyle: 'stone',
    tunnel: 270,
    zones: [{ kind: 'slow', art: 'grave', n: 2, v: 0.45, rx: 30, ry: 17, say: '¡AGARRADO!' }],
  },
  plato: {
    ground: ['#2b1446', 0.22], weather: 'confetti',
    name: 'PLATÓ EN DIRECTO', sub: 'Río de chat, tres puentes, cables por el suelo y focos que se descuelgan.',
    tint: ['#e2c8ff', 0.04], river: { c: ['#2b1446', '#6d28c9', '#c084fc'], float: 'emoji' }, bridges: [110, 270, 430], bstyle: 'neon',
    zones: [{ kind: 'trip', art: 'cable', n: 3, v: 0.7, rx: 34, ry: 14, say: '¡TROPIEZO!' }],
    fall: { art: 'spot', every: 11, warn: 1.5, r: 38, dmg: 0.08, stun: 0.5 },
  },
  olimpo: {
    ground: ['#ffffff', 0.55], weather: 'snow',
    name: 'OLIMPO NEVADO', sub: '¡El río está helado! Se cruza por donde quieras, pero resbala. Y ojo con las bolas de nieve.',
    tint: ['#dfeeff', 0.08], river: { c: ['#8fc6e8', '#cfeaff', '#ffffff'], float: 'ice', frozen: true }, bridges: [110, 430], bstyle: 'stone',
    zones: [{ kind: 'slow', art: 'snow', n: 2, v: 0.55, rx: 36, ry: 19 }],
    fall: { art: 'snowball', every: 10, warn: 1.5, r: 34, dmg: 0.06, stun: 1 },
  },
  lava: {
    ground: ['#3a1206', 0.38],
    name: 'RÍO DE LAVA', sub: 'Grietas que queman a los dos bandos, en sitios distintos cada vez. ¡Y caen meteoritos!',
    tint: ['#d98a6a', 0.1], glow: true, river: { c: ['#b3200c', '#ff8a1c', '#ffd23f'], float: 'crust' }, bridges: [110, 430], bstyle: 'metal',
    zones: [{ kind: 'burn', art: 'lava', n: 2, v: 0.04, rx: 30, ry: 17 }],
    fall: { art: 'meteor', every: 8, warn: 1.6, r: 34, dmg: 0.1, leave: { kind: 'burn', art: 'lava', v: 0.06, rx: 26, ry: 15, life: 7 } },
  },
  dulces: {
    ground: ['#ffb6d9', 0.38], weather: 'sprinkles',
    name: 'FÁBRICA DE DULCES', sub: 'Río de chocolate, puentes de galleta y chicle por todas partes: ¡te quedas pegado!',
    tint: ['#ffd6ec', 0.05], river: { c: ['#3b1d0e', '#6b3a1f', '#9a5a32'], float: 'candy' }, bridges: [110, 270, 430], bstyle: 'cookie',
    zones: [{ kind: 'slow', art: 'gum', n: 3, v: 0.42, rx: 30, ry: 16, say: '¡PEGADO!' }],
    fall: { art: 'gumball', every: 9, warn: 1.4, r: 32, dmg: 0.05, leave: { kind: 'slow', art: 'gum', v: 0.4, rx: 26, ry: 14, life: 10 } },
  },
  juntas: {
    ground: ['#f3e3b5', 0.3], weather: 'paper',
    name: 'LA SALA DE JUNTAS', sub: 'Río de monedas, piezas de construcción en el suelo (1 de daño al pisarlas) y… ¡diapositivas del CEO!',
    tint: ['#fff2c8', 0.04], river: { c: ['#7a5310', '#d99a1f', '#ffe06a'], float: 'coin' }, bridges: [110, 430], bstyle: 'gold',
    zones: [{ kind: 'spike', art: 'bricks', n: 3, v: 1, rx: 30, ry: 15 }],
    fall: { art: 'slide', every: 8, warn: 1.5, r: 40, dmg: 0, stun: 1.5, say: () => `DIAPOSITIVA ${Math.floor(rand(12, 300))} DE 300` },
  },
  sotano: {
    ground: ['#141224', 0.4], weather: 'dust',
    name: 'EL SÓTANO', sub: 'Un solo puente en el centro, ratoneras escondidas y cajas que se caen de las estanterías.',
    tint: ['#9a9ab8', 0.12], river: { c: ['#1c2a3a', '#2e4a63', '#5d7f99'], float: 'cart' }, bridges: [270], bstyle: 'box',
    zones: [{ kind: 'trip', art: 'trap', n: 2, v: 1, rx: 24, ry: 14, say: '¡CLAC!' }],
    fall: { art: 'box', every: 10, warn: 1.5, r: 34, dmg: 0.08, stun: 0.4 },
  },
  discos: {
    ground: ['#c8d4ff', 0.25],
    name: 'LA TIENDA SIN DISCOS', sub: 'Un río de discos de verdad (formato físico), cristales rotos en el suelo y una lluvia de CDs.',
    tint: ['#d8e4ff', 0.04], river: { c: ['#1d2b5c', '#3b56a8', '#8fb4ff'], float: 'cd' }, bridges: [110, 430], bstyle: 'box',
    zones: [{ kind: 'spike', art: 'shards', n: 3, v: 1, rx: 30, ry: 15 }],
    fall: { art: 'disc', every: 6, warn: 1.2, r: 26, dmg: 0.05 },
  },
  lan: {
    ground: ['#06140b', 0.4], weather: 'pixels',
    name: 'LA LAN PARTY', sub: 'Río de bebida energética, tres puentes, alfombras RGB que te aceleran, cables… ¡y picos de lag!',
    tint: ['#cfffe0', 0.03], river: { c: ['#0b3b1c', '#1fbf5a', '#b6ff3a'], float: 'drink' }, bridges: [110, 270, 430], bstyle: 'neon',
    zones: [{ kind: 'fast', art: 'boost', n: 2, v: 1.5, rx: 30, ry: 15, say: '¡TURBO!' }, { kind: 'trip', art: 'cable', n: 1, v: 0.7, rx: 34, ry: 14, say: '¡TROPIEZO!' }],
    fall: { art: 'lag', every: 10, warn: 1.3, r: 44, dmg: 0, stun: 1.2, say: 'LAG 999 ms' },
  },
  arcoiris: {
    ground: ['#ffd6f0', 0.3], weather: 'confetti',
    name: 'EL PLATÓ ARCOÍRIS', sub: 'Río de arcoíris, pintura fresca que frena, maquillaje que cura… y focos que caen.',
    tint: ['#fff0fa', 0.03], river: { c: ['#ff5f6d', '#ffcb3d', '#4ade80'], float: 'rainbow', rainbow: true }, bridges: [110, 270, 430], bstyle: 'gold',
    zones: [{ kind: 'slow', art: 'paint', n: 2, v: 0.6, rx: 32, ry: 17 }, { kind: 'heal', art: 'makeup', n: 1, v: 0.025, rx: 28, ry: 15, say: '¡RETOQUE!' }],
    fall: { art: 'spot', every: 9, warn: 1.5, r: 38, dmg: 0.08, stun: 0.5 },
  },
  sede: {
    ground: ['#1c1640', 0.32],
    name: 'LA SEDE DE PAGO', sub: 'Los puentes tienen PEAJE: cada vez que una unidad cruza, su equipo paga 0,3 de CAOS. Suelo de mármol que resbala y facturas que vuelan.',
    tint: ['#e8e0ff', 0.05], river: { c: ['#0f1530', '#24306b', '#5a6ad8'], float: 'card' }, bridges: [110, 430], bstyle: 'gold', toll: 0.3,
    zones: [{ kind: 'slide', art: 'marble', n: 2, v: 1.4, rx: 34, ry: 18 }],
    fall: { art: 'bill', every: 9, warn: 1.4, r: 34, dmg: 0.04, stun: 0.8, say: 'FACTURA: 9,99 €' },
  },
};
// jefe de cada mundo → su campo
const TERRAIN_OF = { 0: 'cafe', 1: 'cripta', 2: 'plato', 3: 'olimpo', 4: 'lava', 5: 'dulces', 6: 'juntas', 7: 'sotano', 8: 'discos', 9: 'lan', 10: 'arcoiris', 11: 'sede' };
const BSTYLES = {
  stone: { deck: '#9a958c', plank: '#6f6a62', rail: '#7d7870', post: '#5d5850' },
  metal: { deck: '#8a98a8', plank: '#5d6b7a', rail: '#4d5866', post: '#3b4450', dots: '#c9d4df' },
  neon: { deck: '#2b1446', plank: '#d43cff', rail: '#3e2363', post: '#7df3ff' },
  cookie: { deck: '#d9a05b', plank: '#a8703f', rail: '#ff9ac8', post: '#ff6fb0', dots: '#7a4a22' },
  gold: { deck: '#e0a92a', plank: '#b07a10', rail: '#ffe06a', post: '#c48a12' },
  box: { deck: '#c99a62', plank: '#9a6f3e', rail: '#8a5f30', post: '#6b4520' },
};
const TR = { on: null, key: null, t: 0, zones: [], falls: [], fallT: 0, built: '' };
function terrainFor(mode, lvl) {
  if (mode === 'camp' && lvl && lvl.boss) return TERRAIN_OF[lvl.wi] || null;
  if (mode === 'boss') return TERRAIN_OF[G.bossWi] || null;
  return null;
}
// zonas repartidas al azar: las mismas en cada mitad (para que sea justo), pero en sitios distintos cada partida
function terrainPlace(defs) {
  const out = [];
  for (const d of defs) for (const half of ['e', 'p']) for (let i = 0; i < d.n; i++) for (let tries = 0; tries < 60; tries++) {
    const x = rand(64, W - 64), y = half === 'e' ? rand(292, 380) : rand(462, 556);
    if (out.some(z => Math.hypot((z.x - x) / 1.4, z.y - y) < 46)) continue;
    if (structs.some(s => Math.hypot(s.x - x, (s.y - y) * 1.3) < s.r + (d.rx || 30) + 6)) continue;
    out.push(Object.assign({}, d, { x, y, rx: d.rx || 30, ry: d.ry || 16, id: out.length + 1, seed: Math.random() * 1000, life: Infinity })); break;
  }
  return out;
}
function terrainStart() {   // al empezar la partida (después de colocar las torres)
  const k = G.terrain || null, T = k ? TERRAINS[k] : null; TR.on = T; TR.key = k; TR.t = 0; TR.zones = []; TR.falls = [];
  const br = T ? (T.tunnel ? [...new Set(T.bridges.concat(T.tunnel))].sort((a, b) => a - b) : T.bridges) : BASE_BRIDGES;
  BRIDGES.length = 0; BRIDGES.push(...br); RIVER_OPEN = !!(T && T.river.frozen); BRIDGE_STYLE = T ? BSTYLES[T.bstyle] || null : null;
  const sig = BRIDGES.join(',') + '|' + (T ? T.bstyle : '');
  if (TR.built !== sig) { BRIDGE_LAYER = buildBridges(); TR.built = sig; }
  if (!T) return;
  TR.zones = terrainPlace(T.zones || []); TR.fallT = T.fall ? T.fall.every * 0.7 : 0;
  setTimeout(() => { if (TR.on === T && (G.state === 'play' || G.state === 'countdown')) banner('¡' + T.name + '!', T.sub, 'boss'); }, 700);
}
const inZone = (u, z, grow = 1) => { const dx = (u.x - z.x) / (z.rx * grow), dy = (u.y - z.y) / (z.ry * grow); return dx * dx + dy * dy < 1; };
const inTunnel = u => TR.on && TR.on.tunnel != null && Math.abs(u.x - TR.on.tunnel) < 40 && u.y > RIVER.top - 44 && u.y < RIVER.bottom + 44;
function tSay(u, txt, col) { if (!u.saidT || G.t - u.saidT > 2.2) { u.saidT = G.t; addNum(u.x, u.y, topOf(u) + 16, typeof txt === 'function' ? txt() : txt, col || '#ffe06a', 13); } }
function terrainUpdate(dt) {
  const T = TR.on; if (!T || G.state !== 'play') return;
  TR.t += dt;
  // cosas que caen del cielo: aviso (sombra que crece) y golpe
  if (T.fall) {
    const F = T.fall;
    if ((TR.fallT -= dt) <= 0) {
      TR.fallT = F.every * rand(0.8, 1.2);
      let x = rand(60, W - 60), y = rand(250, 610);
      const crowd = units.filter(u => u.alive && u.deployT <= 0);   // a veces apunta donde hay jaleo
      if (crowd.length && Math.random() < 0.55) { const u = pick(crowd); x = clamp(u.x + rand(-40, 40), 40, W - 40); y = clamp(u.y + rand(-30, 30), 230, 640); }
      TR.falls.push({ x, y, t: F.warn, max: F.warn, done: false }); play('deny');
    }
    for (const f of TR.falls) {
      f.t -= dt; if (f.done || f.t > 0) continue;
      f.done = true; f.boom = 0.5; G.shake = Math.max(G.shake, 4); play('boom');
      for (const u of units) {
        if (!u.alive || u.deployT > 0 || Math.hypot(u.x - f.x, (u.y - f.y) * 1.25) > F.r + u.r * 0.5) continue;
        if (F.dmg) hurt(u, Math.max(1, Math.round(u.maxHp * F.dmg)), null, 'aoe');
        if (F.stun && u.alive && !u.immuneCC) { u.stunT = Math.max(u.stunT || 0, F.stun); u.stunKind = 'daze'; }
        if (F.say && u.alive) tSay(u, F.say, '#ffffff');
      }
      if (F.leave) TR.zones.push(Object.assign({}, F.leave, { x: f.x, y: f.y, id: 1000 + Math.floor(Math.random() * 1e6), seed: Math.random() * 1000, life: F.leave.life, max: F.leave.life }));
    }
    TR.falls = TR.falls.filter(f => !f.done || (f.boom -= dt) > 0);
  }
  for (const z of TR.zones) if (z.life !== Infinity) z.life -= dt;
  TR.zones = TR.zones.filter(z => z.life > 0);
  // efectos del suelo
  for (const u of units) {
    u.tSpd = 1;
    if (!u.alive || u.deployT > 0 || u.jump) continue;
    const fly = TYPES[u.type] && TYPES[u.type].hover;
    if (T.toll) {   // peaje al cruzar el río
      const side = u.y < RIVER.y;
      if (u.tSide !== undefined && u.tSide !== side && S[u.team]) { S[u.team].chaos = Math.max(0, S[u.team].chaos - T.toll); addNum(u.x, u.y, topOf(u) + 16, `PEAJE -${fmtV(T.toll)} CAOS`, '#d8b4fe', 12); }
      u.tSide = side;
    }
    if (fly) continue;
    if (RIVER_OPEN && u.y > RIVER.top && u.y < RIVER.bottom) { u.tSpd = 1.35; u.x += Math.sin(TR.t * 2.4 + u.id) * 26 * dt; }   // hielo: resbala
    let trip = 0;
    for (const z of TR.zones) {
      if (!inZone(u, z)) continue;
      switch (z.kind) {
        case 'burn': u.tAcc = (u.tAcc || 0) + u.maxHp * z.v * dt; break;
        case 'spike': if (u.moving) { u.tSpk = (u.tSpk || 0) + dt; if (u.tSpk >= 0.25) { u.tSpk = 0; hurt(u, z.v, null, 'hit'); } } break;
        case 'slow': u.tSpd = Math.min(u.tSpd, z.v); if (z.say) tSay(u, z.say, '#ff9ef0'); break;
        case 'fast': u.tSpd = Math.max(u.tSpd, z.v); if (z.say) tSay(u, z.say, '#7df3ff'); break;
        case 'slide': u.tSpd = Math.max(u.tSpd, z.v); u.x += Math.sin(TR.t * 3 + u.id) * 30 * dt; break;
        case 'trip': trip = z.id; if (u.tTrip !== z.id && !u.immuneCC) { u.stunT = Math.max(u.stunT || 0, z.v); u.stunKind = 'daze'; if (z.say) tSay(u, z.say, '#ffe06a'); } break;
        case 'heal': if (u.hp < u.maxHp) { u.hp = Math.min(u.maxHp, u.hp + u.maxHp * z.v * dt); if (z.say) tSay(u, z.say, '#8cf05a'); } break;
      }
    }
    u.tTrip = trip;
    if (u.tAcc >= 1) { u.tT = (u.tT || 0) + dt; if (u.tT >= 0.5) { const n = Math.floor(u.tAcc); u.tAcc -= n; u.tT = 0; hurt(u, n, null, 'rage'); if (Math.random() < 0.15) tSay(u, '¡QUEMA!', '#ff8a3d'); } }
    u.x = clamp(u.x, BOUNDS.x0 + u.r * 0.5, BOUNDS.x1 - u.r * 0.5);
  }
}

/* ---------- dibujo ---------- */
// el río (sustituye al agua) y las zonas del suelo; va debajo de las unidades. Devuelve true si el campo es especial.
function terrainGround() {
  const T = TR.on && G.state !== 'title' ? TR.on : null; if (!T) return false;
  const c = ctx, t = G.t, top = RIVER.top, bot = RIVER.bottom;
  if (T.ground) { c.save(); c.globalAlpha = T.ground[1]; c.fillStyle = T.ground[0]; c.fillRect(0, 0, W, H); c.restore(); }   // el suelo cambia de color
  if (T.tint) { c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = T.tint[0]; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; if (T.tint[1]) { c.globalAlpha = T.tint[1]; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); } c.restore(); }
  c.save();
  if (T.river.rainbow) {   // río arcoíris
    const cols = ['#ff5f6d', '#ffb04f', '#ffe06a', '#7be04a', '#3fd0e8', '#8b5cf6'], hh = (bot - top) / cols.length;
    cols.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, top + i * hh, W, hh + 0.5); });
  } else {
    const [e, m, ctr] = T.river.c, g = c.createLinearGradient(0, top, 0, bot);
    g.addColorStop(0, e); g.addColorStop(0.3, m); g.addColorStop(0.5, ctr); g.addColorStop(0.7, m); g.addColorStop(1, e);
    c.fillStyle = g; c.fillRect(0, top, W, bot - top);
  }
  if (T.glow) for (const [y0, dir] of [[top - 16, 1], [bot, -1]]) { const gg = c.createLinearGradient(0, y0, 0, y0 + 16); gg.addColorStop(dir > 0 ? 0 : 1, 'rgba(255,110,20,0)'); gg.addColorStop(dir > 0 ? 1 : 0, 'rgba(255,110,20,.45)'); c.fillStyle = gg; c.fillRect(0, y0, W, 16); }
  c.beginPath(); c.rect(0, top, W, bot - top); c.clip();
  riverFloats(T.river.float, top, bot, t);
  c.restore();
  // túnel: la boca a cada lado del río (el techo se dibuja encima de las unidades)
  for (const z of TR.zones) drawZone(z, t);
  for (const f of TR.falls) if (!f.done) {   // sombra que avisa de lo que va a caer
    const k = 1 - f.t / f.max, F = T.fall, r = F.r * (0.4 + 0.6 * k);
    c.save(); c.globalAlpha = 0.25 + 0.35 * k; c.fillStyle = '#140a1e'; c.beginPath(); c.ellipse(f.x, f.y, r, r * 0.55, 0, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 20); c.strokeStyle = '#ffe06a'; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.beginPath(); c.ellipse(f.x, f.y, F.r, F.r * 0.55, 0, 0, Math.PI * 2); c.stroke(); c.restore();
  }
  return true;
}
function riverFloats(kind, top, bot, t) {
  const c = ctx, mid = (top + bot) / 2;
  const lane = (i, sp) => ((i * 83 + t * sp) % (W + 120)) - 60;
  switch (kind) {
    case 'crust': c.fillStyle = 'rgba(70,14,4,.55)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(lane(i, 7 + (i % 3) * 3), top + 8 + (i % 3) * 11, 16 + (i % 4) * 6, 4 + (i % 2) * 2, 0, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#fff3b0'; for (let i = 0; i < 10; i++) { const k = (t * 0.7 + i * 0.37) % 1, x = (i * 61 + Math.floor(t * 0.7 + i * 0.37) * 97) % W; c.globalAlpha = Math.sin(k * Math.PI) * 0.9; c.beginPath(); c.arc(x, top + 7 + ((i * 13) % 24), 1.5 + k * 3.5, 0, Math.PI * 2); c.fill(); } break;
    case 'foam': c.fillStyle = 'rgba(255,240,215,.75)'; for (let i = 0; i < 12; i++) { const x = lane(i, 12 + (i % 3) * 4), y = top + 6 + (i % 4) * 8; c.beginPath(); c.ellipse(x, y, 10 + (i % 3) * 4, 3, 0, 0, Math.PI * 2); c.fill(); } break;
    case 'slime': for (let i = 0; i < 12; i++) { const k = (t * 0.5 + i * 0.29) % 1, x = (i * 71 + Math.floor(t * 0.5 + i * 0.29) * 113) % W; c.globalAlpha = Math.sin(k * Math.PI); c.fillStyle = '#c8ffb0'; c.beginPath(); c.arc(x, top + 6 + (i * 7) % 26, 2 + k * 4, 0, Math.PI * 2); c.fill(); }
      c.globalAlpha = 0.5; c.fillStyle = '#e8fff0'; for (let i = 0; i < 6; i++) { const x = lane(i, 9); c.font = '13px sans-serif'; c.fillText('☠', x, mid + 5); } break;
    case 'emoji': c.font = '15px sans-serif'; c.textAlign = 'center'; for (let i = 0; i < 12; i++) { c.globalAlpha = 0.9; c.fillText(['❤', '😂', '🔥', 'GG', '👍', '💜'][i % 6], lane(i, 22 + (i % 3) * 6), top + 13 + (i % 3) * 10); } break;
    case 'ice': c.strokeStyle = 'rgba(120,170,210,.8)'; c.lineWidth = 1.4; for (let i = 0; i < 14; i++) { const x = (i * 41) % W; c.beginPath(); c.moveTo(x, top + 4); c.lineTo(x + 12, mid); c.lineTo(x + 3, bot - 4); c.moveTo(x + 12, mid); c.lineTo(x + 26, mid - 6); c.stroke(); }
      c.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 8; i++) { const k = (t * 0.4 + i * 0.3) % 1; c.globalAlpha = Math.sin(k * Math.PI); c.beginPath(); c.arc((i * 67 + 20) % W, top + 6 + (i * 11) % 26, 2, 0, Math.PI * 2); c.fill(); } break;
    case 'candy': for (let i = 0; i < 12; i++) { const x = lane(i, 10 + (i % 3) * 3), y = top + 8 + (i % 3) * 10; c.save(); c.translate(x, y); c.rotate(t * (i % 2 ? 1 : -1) + i);
      if (i % 3 === 0) { c.fillStyle = '#ff6fb0'; c.beginPath(); c.arc(0, 0, 5, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 1.6; c.beginPath(); c.arc(0, 0, 3, 0, Math.PI); c.stroke(); }
      else if (i % 3 === 1) { c.fillStyle = '#7df3ff'; c.fillRect(-6, -2.5, 12, 5); c.fillStyle = '#fff'; c.fillRect(-2, -2.5, 4, 5); }
      else { c.fillStyle = '#ffe06a'; c.beginPath(); c.moveTo(0, -5); c.lineTo(5, 4); c.lineTo(-5, 4); c.closePath(); c.fill(); }
      c.restore(); } break;
    case 'coin': for (let i = 0; i < 16; i++) { const x = lane(i, 14 + (i % 4) * 3), y = top + 6 + (i % 4) * 8, w = Math.abs(Math.cos(t * 3 + i)) * 5 + 1; c.fillStyle = '#ffe06a'; c.strokeStyle = '#7a5310'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, y, w, 5, 0, 0, Math.PI * 2); c.fill(); c.stroke(); } break;
    case 'cart': for (let i = 0; i < 9; i++) { const x = lane(i, 9 + (i % 3) * 3), y = top + 9 + (i % 3) * 10; c.save(); c.translate(x, y); c.rotate(Math.sin(t + i) * 0.3); c.fillStyle = ['#8a8f9a', '#5d6b7a', '#a8703f'][i % 3]; c.fillRect(-8, -5, 16, 10); c.fillStyle = '#ffe06a'; c.fillRect(-5, -3, 10, 4); c.strokeStyle = '#20102c'; c.lineWidth = 1; c.strokeRect(-8, -5, 16, 10); c.restore(); } break;
    case 'cd': for (let i = 0; i < 11; i++) { const x = lane(i, 11 + (i % 3) * 4), y = top + 9 + (i % 3) * 10, s = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.5 + i));
      c.save(); c.translate(x, y); c.scale(1, s * 0.55); const cg = c.createLinearGradient(-8, -8, 8, 8); cg.addColorStop(0, '#e0e7ff'); cg.addColorStop(0.35, '#ff9ef0'); cg.addColorStop(0.6, '#7df3ff'); cg.addColorStop(1, '#ffe06a');
      c.fillStyle = cg; c.beginPath(); c.arc(0, 0, 8, 0, Math.PI * 2); c.fill(); c.fillStyle = '#1d2b5c'; c.beginPath(); c.arc(0, 0, 2, 0, Math.PI * 2); c.fill(); c.restore(); } break;
    case 'drink': for (let i = 0; i < 14; i++) { const k = (t * 0.9 + i * 0.21) % 1, x = (i * 53 + Math.floor(t * 0.9 + i * 0.21) * 89) % W; c.globalAlpha = Math.sin(k * Math.PI); c.fillStyle = '#eaffb0'; c.beginPath(); c.arc(x, bot - 4 - k * (bot - top - 8), 1.6 + k * 1.5, 0, Math.PI * 2); c.fill(); }
      c.globalAlpha = 0.9; for (let i = 0; i < 4; i++) { const x = lane(i * 2, 12); c.fillStyle = '#d43cff'; c.fillRect(x - 4, mid - 7, 8, 14); c.fillStyle = '#b6ff3a'; c.fillRect(x - 4, mid - 2, 8, 4); } break;
    case 'rainbow': c.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 10; i++) { const k = (t * 0.6 + i * 0.31) % 1; c.globalAlpha = Math.sin(k * Math.PI); const x = (i * 59 + 13) % W, y = top + 5 + (i * 9) % 28; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x + 1.5, y - 1.5); c.lineTo(x + 4, y); c.lineTo(x + 1.5, y + 1.5); c.lineTo(x, y + 4); c.lineTo(x - 1.5, y + 1.5); c.lineTo(x - 4, y); c.lineTo(x - 1.5, y - 1.5); c.fill(); } break;
    case 'binary': c.font = '11px monospace'; c.textAlign = 'center'; for (let i = 0; i < 26; i++) { const x = lane(i, 16 + (i % 4) * 5), y = top + 9 + (i % 4) * 8; c.globalAlpha = 0.55 + 0.45 * Math.sin(t * 3 + i); c.fillStyle = i % 5 ? '#7df3ff' : '#ffffff'; c.fillText((i * 7 + Math.floor(t * 2)) % 3 ? '1' : '0', x, y); } break;   // v0.9.23: río de datos
    case 'card': for (let i = 0; i < 10; i++) { const x = lane(i, 10 + (i % 3) * 4), y = top + 9 + (i % 3) * 10; c.save(); c.translate(x, y); c.rotate(Math.sin(t * 0.8 + i) * 0.25); c.fillStyle = i % 2 ? '#ffe06a' : '#c0c8ff'; c.fillRect(-9, -5.5, 18, 11); c.fillStyle = '#20102c'; c.fillRect(-9, -3, 18, 2.5); c.fillStyle = '#d4a017'; c.fillRect(-6, 1, 4, 3); c.restore(); } break;
  }
  c.globalAlpha = 1; c.textAlign = 'left';
}
function drawZone(z, t) {
  const c = ctx, fade = z.life === Infinity ? 1 : Math.min(1, z.life / 1.2, (z.max - z.life) / 0.3 + 0.2), R = mulberry32(Math.floor(z.seed));
  c.save(); c.translate(z.x, z.y); c.globalAlpha = fade;
  const blob = (sx, sy, fill) => { c.fillStyle = fill; c.beginPath(); for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI * 2, rr = 0.82 + R() * 0.3; i ? c.lineTo(Math.cos(a) * sx * rr, Math.sin(a) * sy * rr) : c.moveTo(Math.cos(a) * sx * rr, Math.sin(a) * sy * rr); } c.closePath(); c.fill(); };
  const rx = z.rx, ry = z.ry;
  switch (z.art) {
    case 'lava': { c.fillStyle = 'rgba(40,10,4,.85)'; c.beginPath(); c.ellipse(0, 2, rx * 1.18, ry * 1.25, 0, 0, Math.PI * 2); c.fill();
      const p = 1 + Math.sin(t * 3 + z.seed) * 0.05, rg = c.createRadialGradient(0, 0, 2, 0, 0, rx); rg.addColorStop(0, '#fff3b0'); rg.addColorStop(0.35, '#ffb02e'); rg.addColorStop(0.8, '#e2420f'); rg.addColorStop(1, '#8c1a08');
      c.fillStyle = rg; c.beginPath(); c.ellipse(0, 0, rx * p, ry * p, 0, 0, Math.PI * 2); c.fill(); break; }
    case 'coffee': blob(rx, ry, 'rgba(92,52,22,.85)'); c.fillStyle = 'rgba(255,240,215,.5)'; c.beginPath(); c.ellipse(-rx * 0.3, -ry * 0.25, rx * 0.3, ry * 0.2, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; c.globalAlpha = fade * (0.5 + 0.5 * Math.sin(t * 4 + z.seed)); c.fillRect(rx * 0.2, -ry * 0.4, 3, 3); break;
    case 'grave': c.fillStyle = 'rgba(40,30,30,.7)'; c.beginPath(); c.ellipse(0, 2, rx, ry, 0, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#7be04a'; c.lineWidth = 2.4; c.lineCap = 'round'; for (let i = -1; i <= 1; i++) { const x = i * rx * 0.5, s = Math.sin(t * 3 + i * 2 + z.seed) * 3; c.beginPath(); c.moveTo(x, 4); c.lineTo(x + s, -7); c.moveTo(x + s, -7); c.lineTo(x + s - 3, -11); c.moveTo(x + s, -7); c.lineTo(x + s + 3, -11); c.stroke(); } break;
    case 'cable': c.lineWidth = 3; c.lineCap = 'round'; ['#20102c', '#ff4b5c', '#3fd0e8'].forEach((col, j) => { c.strokeStyle = col; c.beginPath(); for (let i = 0; i <= 10; i++) { const x = -rx + (2 * rx * i) / 10, y = Math.sin(i * 1.3 + j * 2 + z.seed) * ry * 0.6 + (j - 1) * 4; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }); break;
    case 'snow': blob(rx, ry, 'rgba(255,255,255,.95)'); c.fillStyle = 'rgba(180,210,235,.7)'; c.beginPath(); c.ellipse(rx * 0.2, ry * 0.3, rx * 0.5, ry * 0.3, 0, 0, Math.PI * 2); c.fill(); break;
    case 'gum': blob(rx, ry, 'rgba(255,111,176,.88)'); c.strokeStyle = 'rgba(255,200,230,.9)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const b = 3 + ((t * 0.8 + i * 0.33 + z.seed) % 1) * 7; c.beginPath(); c.arc((i - 1) * rx * 0.45, -2, b, 0, Math.PI * 2); c.stroke(); } break;
    case 'bricks': { const cols = ['#ff4b5c', '#3fd0e8', '#ffcb3d', '#7be04a', '#d43cff']; for (let i = 0; i < 9; i++) { const x = (R() * 2 - 1) * rx * 0.85, y = (R() * 2 - 1) * ry * 0.75; c.save(); c.translate(x, y); c.rotate(R() * 3); c.fillStyle = cols[i % 5]; c.fillRect(-5, -3, 10, 6); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-3, -2, 2, 2); c.fillRect(1, -2, 2, 2); c.strokeStyle = '#20102c'; c.lineWidth = 1; c.strokeRect(-5, -3, 10, 6); c.restore(); } break; }
    case 'trap': c.fillStyle = '#c99a62'; c.strokeStyle = '#20102c'; c.lineWidth = 1.6; c.fillRect(-rx * 0.6, -ry * 0.5, rx * 1.2, ry); c.strokeRect(-rx * 0.6, -ry * 0.5, rx * 1.2, ry); c.strokeStyle = '#b4bccb'; c.lineWidth = 2; c.beginPath(); c.rect(-rx * 0.45, -ry * 0.35, rx * 0.9, ry * 0.7); c.stroke(); c.fillStyle = '#ffe06a'; c.beginPath(); c.moveTo(0, -3); c.lineTo(6, 3); c.lineTo(-6, 3); c.closePath(); c.fill(); break;
    case 'shards': for (let i = 0; i < 8; i++) { const x = (R() * 2 - 1) * rx * 0.85, y = (R() * 2 - 1) * ry * 0.7; c.save(); c.translate(x, y); c.rotate(R() * 6); const cg = c.createLinearGradient(-5, 0, 5, 0); cg.addColorStop(0, '#e0e7ff'); cg.addColorStop(0.5, '#ff9ef0'); cg.addColorStop(1, '#7df3ff'); c.fillStyle = cg; c.beginPath(); c.moveTo(0, -6); c.lineTo(5, 4); c.lineTo(-4, 3); c.closePath(); c.fill(); c.restore(); } break;
    case 'boost': c.fillStyle = 'rgba(20,10,34,.8)'; c.fillRect(-rx, -ry * 0.8, rx * 2, ry * 1.6); for (let i = 0; i < 3; i++) { const h = (t * 120 + i * 120) % 360; c.strokeStyle = `hsl(${h},100%,60%)`; c.lineWidth = 3; const x = -rx * 0.5 + i * rx * 0.5; c.beginPath(); c.moveTo(x - 6, -ry * 0.5); c.lineTo(x, 0); c.lineTo(x - 6, ry * 0.5); c.stroke(); } c.strokeStyle = `hsl(${(t * 90) % 360},100%,65%)`; c.lineWidth = 2; c.strokeRect(-rx, -ry * 0.8, rx * 2, ry * 1.6); break;
    case 'paint': blob(rx, ry, ['#ff5f6d', '#3fd0e8', '#ffcb3d'][Math.floor(z.seed) % 3]); c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(-rx * 0.3, -ry * 0.3, rx * 0.25, ry * 0.2, 0, 0, Math.PI * 2); c.fill(); break;
    case 'makeup': blob(rx, ry, 'rgba(255,190,220,.75)'); c.font = '15px sans-serif'; c.textAlign = 'center'; c.globalAlpha = fade * (0.7 + 0.3 * Math.sin(t * 3)); c.fillText('✨', 0, 5); break;
    case 'marble': { const mg = c.createLinearGradient(-rx, -ry, rx, ry); mg.addColorStop(0, 'rgba(255,255,255,.9)'); mg.addColorStop(0.5, 'rgba(210,215,240,.9)'); mg.addColorStop(1, 'rgba(255,255,255,.9)'); c.fillStyle = mg; c.fillRect(-rx, -ry * 0.75, rx * 2, ry * 1.5); c.strokeStyle = 'rgba(160,160,200,.7)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-rx * 0.8, -ry * 0.3); c.quadraticCurveTo(0, ry * 0.4, rx * 0.8, -ry * 0.1); c.stroke(); const s = (t * 0.7 + z.seed) % 1; c.globalAlpha = fade * Math.sin(s * Math.PI) * 0.9; c.fillStyle = '#fff'; c.fillRect(-rx + s * rx * 2, -ry * 0.75, 4, ry * 1.5); break; }
  }
  c.restore();
}
// encima de las unidades: el techo del túnel, lo que cae y chispas
function terrainAir() {
  const T = TR.on && G.state !== 'title' ? TR.on : null; if (!T) return;
  const c = ctx, t = G.t;
  c.save();
  if (T.glow) for (let i = 0; i < 14; i++) { const k = (t * 0.45 + i * 0.173) % 1, x = (i * 41 + Math.floor(t * 0.45 + i * 0.173) * 131) % W, y = RIVER.y + 10 - k * 70; c.globalAlpha = (1 - k) * 0.8; c.fillStyle = i % 2 ? '#ffd23f' : '#ff6a1a'; c.beginPath(); c.arc(x + Math.sin(t * 3 + i) * 4, y, 1.6, 0, Math.PI * 2); c.fill(); }
  c.globalAlpha = 1;
  if (T.weather) for (let i = 0; i < 40; i++) {   // nieve, confeti, virutas…
    const sp = 18 + (i % 5) * 7, y = ((i * 97 + t * sp) % (H - 60)) + 30, x = ((i * 53 + Math.sin(t * 0.8 + i) * 14) % W + W) % W, w = T.weather;
    if (w === 'snow') { c.globalAlpha = 0.85; c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 1.6 + (i % 3) * 0.8, 0, Math.PI * 2); c.fill(); }
    else if (w === 'confetti' || w === 'sprinkles') { c.globalAlpha = 0.8; c.fillStyle = ['#ff5f6d', '#ffcb3d', '#7be04a', '#3fd0e8', '#d43cff', '#ff9ef0'][i % 6]; c.save(); c.translate(x, y); c.rotate(t * 3 + i); w === 'sprinkles' ? c.fillRect(-3, -1, 6, 2) : c.fillRect(-2.5, -1.5, 5, 3); c.restore(); }
    else if (w === 'dust' && i % 2) { c.globalAlpha = 0.35; c.fillStyle = '#d8d0c0'; c.beginPath(); c.arc(x, y, 1.4, 0, Math.PI * 2); c.fill(); }
    else if (w === 'paper' && i % 4 === 0) { c.globalAlpha = 0.7; c.fillStyle = '#fff6ea'; c.save(); c.translate(x, y); c.rotate(Math.sin(t * 2 + i)); c.fillRect(-4, -3, 8, 6); c.restore(); }
    else if (w === 'pixels' && i % 2) { c.globalAlpha = 0.6; c.fillStyle = `hsl(${(i * 40 + t * 60) % 360},100%,60%)`; c.fillRect(Math.round(x), Math.round(y), 3, 3); }
  }
  c.globalAlpha = 1;
  if (T.tunnel != null) {   // techo del túnel: tapa a las unidades que van por dentro
    const x = T.tunnel, y0 = RIVER.top - 46, y1 = RIVER.bottom + 46, w = 46, busy = units.filter(u => u.alive && inTunnel(u));
    c.fillStyle = 'rgba(20,10,30,.35)'; c.beginPath(); c.ellipse(x + 4, y1 - 2, w + 6, 10, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#5d5850'; c.strokeStyle = OL; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - w, y1); c.lineTo(x - w, y0 + 14); c.quadraticCurveTo(x - w, y0, x - w + 14, y0); c.lineTo(x + w - 14, y0); c.quadraticCurveTo(x + w, y0, x + w, y0 + 14); c.lineTo(x + w, y1); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#7d7870'; for (let r2 = 0; r2 < 6; r2++) for (let k = 0; k < 4; k++) { const bx = x - w + 6 + k * 22 + (r2 % 2) * 10, by = y0 + 6 + r2 * 19; if (bx + 18 > x + w) continue; c.fillRect(bx, by, 18, 14); }
    for (const [yy, up] of [[y0 + 12, true], [y1 - 4, false]]) { c.fillStyle = '#140a1e'; c.beginPath(); c.ellipse(x, yy, 22, 12, 0, up ? Math.PI : 0, up ? Math.PI * 2 : Math.PI); c.fill(); }
    c.font = '16px "Luckiest Guy", Impact, sans-serif'; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = OL; c.strokeText('TÚNEL', x, RIVER.y + 6); c.fillStyle = '#ffe06a'; c.fillText('TÚNEL', x, RIVER.y + 6);
    if (busy.length) {   // pelea dentro: polvo y «?» que se escapan
      for (let i = 0; i < 3; i++) { const k = (t * 1.3 + i * 0.33) % 1; c.globalAlpha = 1 - k; c.fillStyle = '#e8dcc8'; c.beginPath(); c.arc(x + (i - 1) * 18, y0 - k * 18, 4 + k * 6, 0, Math.PI * 2); c.fill(); }
      c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 6); c.strokeText(busy.length + ' DENTRO', x, y0 - 6); c.fillStyle = '#fff'; c.fillText(busy.length + ' DENTRO', x, y0 - 6);
    }
    c.globalAlpha = 1;
  }
  const F = T.fall;
  if (F) for (const f of TR.falls) {
    if (!f.done) { const k = 1 - f.t / f.max; if (k > 0.45) { const z = (1 - (k - 0.45) / 0.55) * 260; drawFaller(F.art, f.x, f.y - z, t, 1); } }
    else if (f.boom > 0) { c.globalAlpha = f.boom * 2; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.ellipse(f.x, f.y, F.r * (1.4 - f.boom), F.r * 0.55 * (1.4 - f.boom), 0, 0, Math.PI * 2); c.stroke(); drawFaller(F.art, f.x, f.y, t, f.boom * 2); c.globalAlpha = 1; }
  }
  c.restore(); c.textAlign = 'left';
}
function drawFaller(art, x, y, t, a) {
  const c = ctx; c.save(); c.translate(x, y); c.globalAlpha = Math.min(1, a); c.strokeStyle = OL; c.lineWidth = 2;
  switch (art) {
    case 'meteor': { const g = c.createLinearGradient(0, -40, 0, 0); g.addColorStop(0, 'rgba(255,120,20,0)'); g.addColorStop(1, 'rgba(255,170,40,.9)'); c.fillStyle = g; c.beginPath(); c.moveTo(-8, -6); c.lineTo(0, -46); c.lineTo(8, -6); c.fill(); c.fillStyle = '#5a2010'; c.beginPath(); c.arc(0, -4, 10, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = '#ffb02e'; c.beginPath(); c.arc(-3, -6, 4, 0, Math.PI * 2); c.fill(); break; }
    case 'paper': c.rotate(Math.sin(t * 6) * 0.4); c.fillStyle = '#fff6ea'; c.fillRect(-12, -16, 24, 16); c.strokeRect(-12, -16, 24, 16); c.fillStyle = '#ff4b5c'; c.font = '7px "Luckiest Guy", Impact, sans-serif'; c.textAlign = 'center'; c.fillText('DESPIDO', 0, -6); break;
    case 'spot': c.fillStyle = '#3b4450'; c.beginPath(); c.moveTo(-9, -18); c.lineTo(9, -18); c.lineTo(13, -2); c.lineTo(-13, -2); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#fff3b0'; c.beginPath(); c.ellipse(0, -2, 12, 4, 0, 0, Math.PI * 2); c.fill(); break;
    case 'snowball': c.fillStyle = '#ffffff'; c.beginPath(); c.arc(0, -10, 12, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = '#cfe4f5'; c.beginPath(); c.arc(4, -6, 5, 0, Math.PI * 2); c.fill(); break;
    case 'gumball': { c.fillStyle = ['#ff6fb0', '#7df3ff', '#ffe06a'][Math.floor(x) % 3]; c.beginPath(); c.arc(0, -11, 12, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(-4, -15, 3.5, 0, Math.PI * 2); c.fill(); break; }
    case 'slide': c.rotate(Math.sin(t * 5) * 0.3); c.fillStyle = '#ffffff'; c.fillRect(-16, -22, 32, 22); c.strokeRect(-16, -22, 32, 22); c.fillStyle = '#3fd0e8'; c.fillRect(-11, -8, 5, 6); c.fillStyle = '#ffcb3d'; c.fillRect(-4, -12, 5, 10); c.fillStyle = '#ff4b5c'; c.fillRect(3, -16, 5, 14); c.fillStyle = '#20102c'; c.fillRect(-12, -19, 18, 2); break;
    case 'box': c.fillStyle = '#c99a62'; c.fillRect(-12, -22, 24, 20); c.strokeRect(-12, -22, 24, 20); c.strokeStyle = '#8a5f30'; c.beginPath(); c.moveTo(-12, -14); c.lineTo(12, -14); c.stroke(); break;
    case 'disc': { c.rotate(t * 8); const g = c.createLinearGradient(-9, -9, 9, 9); g.addColorStop(0, '#e0e7ff'); g.addColorStop(0.4, '#ff9ef0'); g.addColorStop(0.7, '#7df3ff'); g.addColorStop(1, '#ffe06a'); c.fillStyle = g; c.beginPath(); c.arc(0, -8, 10, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = '#20102c'; c.beginPath(); c.arc(0, -8, 2.5, 0, Math.PI * 2); c.fill(); break; }
    case 'lag': c.font = '18px "Luckiest Guy", Impact, sans-serif'; c.textAlign = 'center'; c.lineWidth = 4; c.strokeText('LAG', 0, -6); c.fillStyle = '#ff4b5c'; c.fillText('LAG', 0, -6); c.fillStyle = 'rgba(255,75,92,.5)'; for (let i = 0; i < 4; i++) c.fillRect(-20 + i * 11, -26 + (i % 2) * 4, 8, 3); break;
    case 'bill': c.rotate(Math.sin(t * 7) * 0.35); c.fillStyle = '#fff6ea'; c.fillRect(-10, -24, 20, 24); c.strokeRect(-10, -24, 20, 24); c.fillStyle = '#20102c'; for (let i = 0; i < 4; i++) c.fillRect(-6, -19 + i * 4, 12 - (i % 2) * 4, 1.6); c.fillStyle = '#ff4b5c'; c.fillRect(-6, -5, 12, 3); break;
  }
  c.restore();
}
