// Fans of Rumble · Campaña 3 (segunda parte): mecánicas de IAhorro y de Los Creadores, campos de sus jefes y tablas de dibujo
'use strict';
/* ---------- v0.9.23 ----------
   Va al final, antes del arranque, porque completa tablas que se crean en archivos anteriores. */
Object.assign(BOSS_QUOTE, BOSS_QUOTE_IA);
const QUOTES_IA = {
  p: ['IAhorro ha generado una disculpa. Se nota que no la ha escrito nadie.', 'IAhorro se ha desconectado. Los creadores vuelven al estudio.', 'IAhorro promete «mejorar el modelo». Nadie se lo cree.'],
  e: ['IAhorro ha generado tu derrota en 0,3 segundos.', 'IAhorro te da las gracias por los datos de entrenamiento.', 'Error: victoria no encontrada en los datos de entrenamiento.'],
  d: ['Empate. IAhorro dice que ha ganado (se lo ha inventado).'],
};
Object.assign(FUR, {
  promptbot: ['#475569', '#22e3ff'], copiapega: ['#334155', '#e2e8f0'], alucinador: ['#334155', '#ffcb3d'], dronia: ['#1e293b', '#94a3b8'], granjaserv: ['#1e293b', '#22e3ff', '#7be04a'], clonador: ['#334155', '#7df3ff'],
  indie: ['#7c3aed', '#e0a872', '#ff9a3c'], jam: ['#ff9a3c', '#f1c27d'], tester: ['#16a34a', '#facc15'], pixelartista: ['#0ea5e9', '#ff5f6d', '#ffcb3d'], compositora: ['#1f2937', '#facc15', '#ff9ef0'], disenadora: ['#f59e0b', '#93c5fd'], prototipo: ['#9ca3af', '#d6d3d1', '#7be04a'], freelance: ['#475569', '#92400e'],
});
BIG.push('prototipo', 'granjaserv', 'clonador');
AMB_KIND.creadores = 'pixel';
FAC_COLOR.creadores = '#ff9a3c';
EQ_HEAD.indie = -52; EQ_HAND.indie = [-14, -20]; EQ_BACK.indie = [-10, -30, -0.4];
MENU_TRACKS.splice(10, 0, ['creadores', 'Los Creadores']);
MENU_TRACKS.push(['boss12', 'Jefe: Generador de Clones'], ['boss13', 'Jefe: CyberMarine entrenado'], ['boss14', 'Jefe: StreamKing generado'], ['boss15', 'Jefe: IAhorro']);

// ---- campos de los 4 jefes nuevos
Object.assign(TERRAINS, {
  prompts: {
    name: 'LA GRANJA DE PROMPTS', sub: 'Un río de datos con tres puentes, cables por el suelo y prompts que caen del techo.',
    ground: ['#0b2a33', 0.35], weather: 'pixels', tint: ['#cfefff', 0.05], river: { c: ['#06161d', '#0e5a6e', '#22e3ff'], float: 'binary' }, bridges: [110, 270, 430], bstyle: 'metal',
    zones: [{ kind: 'trip', art: 'cable', n: 2, v: 0.7, rx: 34, ry: 14, say: '¡TROPIEZO!' }],
    fall: { art: 'paper', every: 8, warn: 1.4, r: 34, dmg: 0.04, stun: 0.8, say: 'PROMPT: «HAZ UN JUEGO IGUAL»' },
  },
  datos: {
    name: 'EL ALMACÉN DE DATOS', sub: 'La sala fría: el río de datos está congelado (se cruza por donde quieras) y el suelo pulido resbala. Caen discos duros.',
    ground: ['#d8ecff', 0.32], weather: 'snow', tint: ['#dfeeff', 0.06], river: { c: ['#8fc6e8', '#cfeaff', '#ffffff'], float: 'ice', frozen: true }, bridges: [110, 430], bstyle: 'metal',
    zones: [{ kind: 'slide', art: 'marble', n: 2, v: 1.4, rx: 34, ry: 18 }],
    fall: { art: 'box', every: 9, warn: 1.5, r: 34, dmg: 0.07, stun: 0.5, say: 'DATOS SIN PERMISO' },
  },
  estudio: {
    name: 'EL ESTUDIO VACÍO', sub: 'Río de arte generado, pintura que frena, cristales rotos y focos que caen sobre sillas vacías.',
    ground: ['#2b1446', 0.28], weather: 'confetti', tint: ['#f0d8ff', 0.04], river: { c: ['#2b1446', '#6d28c9', '#ff9ef0'], float: 'binary' }, bridges: [110, 270, 430], bstyle: 'neon',
    zones: [{ kind: 'slow', art: 'paint', n: 2, v: 0.6, rx: 32, ry: 17 }, { kind: 'spike', art: 'shards', n: 1, v: 1, rx: 30, ry: 15 }],
    fall: { art: 'spot', every: 9, warn: 1.5, r: 38, dmg: 0.08, stun: 0.5, say: 'ARTE CON SEIS DEDOS' },
  },
  nucleo: {
    name: 'EL NÚCLEO DE IAHORRO', sub: 'Los servidores se sobrecalientan (las grietas queman), las alfombras de datos aceleran y, de vez en cuando, IAhorro se reinicia.',
    ground: ['#06161d', 0.42], weather: 'pixels', glow: true, tint: ['#bfefff', 0.08], river: { c: ['#06161d', '#0e7490', '#7df3ff'], float: 'binary' }, bridges: [270], bstyle: 'metal',
    zones: [{ kind: 'burn', art: 'lava', n: 2, v: 0.035, rx: 30, ry: 17 }, { kind: 'fast', art: 'boost', n: 1, v: 1.5, rx: 30, ry: 15, say: '¡TURBO!' }],
    fall: { art: 'lag', every: 9, warn: 1.3, r: 46, dmg: 0, stun: 1.2, say: 'REINICIANDO…' },
  },
});
Object.assign(TERRAIN_OF, { 12: 'prompts', 13: 'datos', 14: 'estudio', 15: 'nucleo' });

// ---- mecánicas: ENTRENADA CON TU TRABAJO (IAhorro), SIN CRUNCH (Creadores) y el ¡HOTFIX! de la IndieDev
function iaUpdate(dt) {
  if (G.state !== 'play') return;
  // IAhorro copia la última unidad que has sacado
  if (G.efac === 'iahorro' && G.mode !== 'sandbox') {
    const PS = CFG.passives.iahorro; if (S.e.copyT == null) S.e.copyT = PS.every * 0.8;
    S.e.copyT -= dt;
    if (S.e.copyT <= 0) {
      S.e.copyT = PS.every;
      const mine = units.filter(u => u.team === 'p' && !u.summon && !u.isClone && !u.sequel && !isLeader(u.type) && CFG.cards[u.type]).sort((a, b) => b.id - a.id)[0];
      if (mine) {
        const k = mine.type, x = clamp(270 + rand(-90, 90), 40, W - 40), y = rand(300, 360);
        const n = Math.min(3, CFG.cards[k].count || 1);
        for (let i = 0; i < n; i++) {
          const v = spawnUnit('e', k, clamp(x + (i - (n - 1) / 2) * 22, 30, W - 30), y);
          v.corrupt = true; v.iaCopy = true; v.maxHp = v.hp = Math.max(1, Math.round(v.maxHp * PS.power)); v.mDmg *= PS.power;
        }
        addNum(x, y, 60, `COPIA DE ${CFG.cards[k].name.toUpperCase()}`, '#7df3ff', 14); play('blink'); puff(x, y, 14, '#7df3ff', 80, 8, false, 20);
        if (!G.iaShown) { G.iaShown = true; banner('ENTRENADA CON TU TRABAJO', 'Pasiva de IAhorro: cada 25 s copia la última unidad que has sacado', 'enemy'); } else chatEv('sub', null, null, 0.5, 30);
      }
    }
  }
  const PC = CFG.passives.creadores;
  for (const u of units) {
    if (!u.alive || u.deployT > 0) continue;
    // SIN CRUNCH: tras 3 s sin recibir daño, se cura un 2 % por segundo
    if (facOf(u.team) === 'creadores' && u.hp < u.maxHp && G.t - (u.hitAt == null ? -99 : u.hitAt) >= PC.after) {
      u.hp = Math.min(u.maxHp, u.hp + u.maxHp * PC.regen * dt);
      if (Math.random() < dt * 0.6) parts.push({ type: 'plus', x: u.x + rand(-8, 8), y: u.y, z: topOf(u) * 0.8, vx: 0, vy: 0, vz: 18, g: 0, life: 0.7, max: 0.7 });
    }
    // ¡HOTFIX! de la IndieDev: cura a los cercanos y les quita los aturdimientos
    const H = u.d.hotfix; if (!H) continue;
    u.hfT = (u.hfT == null ? H.cd * 0.6 : u.hfT) - dt; if (u.hfT > 0) continue;
    const near = units.filter(o => o.alive && o.team === u.team && o.deployT <= 0 && dist(o, u) <= H.r);
    if (!near.some(o => o.hp < o.maxHp || o.stunT > 0)) { u.hfT = 0.5; continue; }
    u.hfT = H.cd; const P = u.mLvl || 1;
    for (const o of near) { const amt = Math.min(H.heal * P, o.maxHp - o.hp); o.hp += amt; o.stunT = 0; o.slowT = 0; if (amt >= 1) addNum(o.x, o.y, topOf(o) * 0.75 + 4, '+' + Math.round(amt), '#8cf05a', 15); }
    ring(u.x, u.y, 8, H.r, 'rgba(124,58,237,.8)', 0.5, 4, true); addNum(u.x, u.y, topOf(u) + 18, '¡HOTFIX!', '#c4b5fd', 15); play('heal');
  }
}
