// Fans of Rumble · Efectos y lógica del combate: unidades, ataques, IA
'use strict';
/* =========================================================
   EFFECTS
   ========================================================= */
function shake(n) { if (!REDUCED) G.shake = Math.max(G.shake, n); }
function puff(x, y, n, color, spd = 40, size = 6, ground = false, z0 = 2) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = rand(spd * 0.4, spd); parts.push({ type: 'dust', x, y, z: z0 + rand(0, 6), vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.5, vz: rand(5, 28), g: 0, life: rand(0.35, 0.65), max: 0.65, size: rand(size * 0.6, size), color, ground }); } }
function ring(x, y, r0, r1, color, dur = 0.4, lw = 4, circ = false) { parts.push({ type: 'ring', x, y, z: 0, r0, r1, color, life: dur, max: dur, lw, ground: true, circ }); }   // circ: círculo exacto (áreas de efecto)
function sparks(x, y, z, n, color) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = rand(60, 160); parts.push({ type: 'spark', x, y, z, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.5, vz: rand(20, 140), g: 420, life: rand(0.2, 0.35), max: 0.35, color }); } }
function chips(x, y, z, n, colors, kind = 'chip', size = 4) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = rand(30, 110); parts.push({ type: kind, x, y, z, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.5, vz: rand(90, 220), g: 520, rot: rand(0, 6), vr: rand(-12, 12), life: rand(0.7, 1.1), max: 1.1, size: rand(size * 0.7, size * 1.3), color: pick(colors) }); } }
function addNum(x, y, z, txt, color, size = 15) {
  txt = String(txt);
  if (/^[+-]?[0-9]/.test(txt)) { nums.push({ x, y, z, vz: 46, txt, color, size, life: 0.85, max: 0.85 }); return; }   // números (daño, curas, +CAOS): rápidos
  // v0.9.9: los mensajes duran más, suben despacio, llevan fondo y no se pisan entre ellos
  for (let k = 0; k < 4; k++) { const o = nums.find(n => n.tx && Math.abs(n.x - x) < 90 && Math.abs((n.y - n.z) - (y - z)) < 20); if (!o) break; z = o.z + (y - o.y) + 22; }
  nums.push({ x, y, z, vz: 22, txt, color, size: Math.max(14, size), life: 2.1, max: 2.1, tx: true });
}
// v0.9.8: destello de golpe, tajo de los ataques cuerpo a cuerpo, resplandor y flash de pantalla
function impact(x, y, z, size, color) { parts.push({ type: 'impact', x, y, z, size, color, rot: Math.random() * Math.PI, life: 0.17, max: 0.17 }); }
function flashAt(x, y, z, size, rgb, dur = 0.3) { parts.push({ type: 'flash', x, y, z, size, rgb, life: dur, max: dur }); }
function slashFx(u, t) { const d = dist(u, t) || 1; parts.push({ type: 'slash', x: u.x, y: u.y, z: topOf(u) * 0.45, ang: Math.atan2((t.y - u.y) * 1.6, t.x - u.x), size: clamp(d * 0.95, 14, 46), color: u.team === 'p' ? '#ffd28a' : '#a9d8ff', life: 0.2, max: 0.2 }); }
function screenFlash(a) { if (!REDUCED) G.flash = Math.max(G.flash || 0, a); }

/* =========================================================
   GAME LOGIC
   ========================================================= */
function canDeploy(team, key) {
  if (!isLeader(key)) return true;
  if (S[team].leaderCd > 0) return false;
  if (revives.some(r => r.team === team && r.type === key)) return false;
  return !units.some(u => u.alive && u.team === team && u.type === key);
}
function validSpot(team, x, y) { const z = ZONE[team]; return x >= 16 && x <= W - 16 && y >= z.y0 && y <= z.y1; }
// v0.9.9: si sueltas la carta en el río o en el lado enemigo, la tropa sale en el borde de tu zona (la línea límite)
function snapSpot(team, x, y) { const z = ZONE[team]; return { x: clamp(x, 26, W - 26), y: clamp(y, z.y0, z.y1) }; }
function spawnUnit(team, type, x, y) {
  const d = CFG.units[type];
  const u = { kind: 'unit', id: ++uid, team, type, d, x, y, z: 0, r: d.r, hp: d.hp, maxHp: d.hp, alive: true, atkT: 0.35, target: null, retarget: 0, deployT: 0.7, deployMax: 0.7, face: x < W / 2 ? 1 : -1, walk: Math.random() * 6, moving: false, lungeT: 0, lungeX: 0, lungeY: 0, hitT: 0, stunT: 0, stealthT: d.stealth || 0, jumpCd: d.jumpCd ? 2.5 : 0, jump: null, spin: 0, labelT: team === 'e' ? 2 : 0, slowT: 0,
    sumT: 3, pulseT: 2.5, viralT: 3, tfT: 3, hackT: 2, blinkT: 1.5, tauntT: 1, runDist: 0, stonk: 0, mHp: 1, mDmg: 1, mSpeed: 1, mCd: 1, mScale: 1, shield: 0, shieldMax: 0, shT: 0 };
  units.push(u);
  if (S) applySpawnMods(u);
  return u;
}
function unitLevel(team, type) {
  if (team === 'e') return G.elvl;
  const k = SUMMON_PARENT[type] || type; return SAVE.units[k] ? SAVE.units[k].lvl : 1;
}
// al salir: nivel, pasivas de facción (RNG, Experiencia, Escudos), habilidad del gashapón y equipo del líder
function applySpawnMods(u) {
  const team = u.team, f = facOf(team), P = CFG.passives;
  u.lvl = unitLevel(team, u.type); u.mLvl = 1 + (u.lvl - 1) * ECON.lvlStep;
  u.corrupt = team === 'e' && !isCorp(G.efac);
  if (f === 'olvidados') u.olvT = P.olvidados.t;   // v0.9.13: Nostalgia
  if (f === 'memes') { const m = pick(P.memes.muts); u.mut = m.id; u.mHp = m.hp; u.mDmg = m.dmg; u.mSpeed = m.speed; u.mCd = m.cd; u.mScale = m.scale; u.r = u.d.r * m.scale; u.mutTxt = m.txt; u.mutCol = m.color; }
  if (team === 'p') { applyAbility(u); if (isLeader(u.type)) applyEquip(u); const st = cardStars(u.type); if (st) { u.mHp *= 1 + st * ECON.starStep; u.mDmg *= 1 + st * ECON.starStep; } }
  else if (G.egear && (isLeader(u.type) || G.egearOn.includes(u.type))) applyEnemyGear(u);
  const M = G.mod;   // v0.9.12: ruleta de la Mítica
  if (M && team === 'p') { if (M.deb.id === 'lag') u.mSpeed *= 0.8; if (M.deb.id === 'parche') u.mHp *= 0.8; if (M.deb.id === 'becarios') u.mDmg *= 0.8; }
  else if (M) { if (M.buf.id === 'horas') u.mCd *= 0.7; if (M.buf.id === 'robots') u.mHp *= 1.25; if (M.buf.id === 'bonus') u.mDmg *= 1.25; if (M.buf.id === 'turbo') u.mSpeed *= 1.25; }
  if (team === 'e' && G.mode === 'camp' && G.cdiff && G.cdiff !== 'n') { const el = CDIFF[G.cdiff].elite; u.mHp *= el; u.mDmg *= el; }   // tropas de élite en Difícil y Mítica
  if (team === 'e' && G.mode === 'boss' && G.bossDiff && G.bossDiff !== 'n') { const el = BDIFF[G.bossDiff].elite; u.mHp *= el; u.mDmg *= el; }   // v0.9.15: y en el Modo Jefe
  u.hpBase = u.d.hp * u.mHp * u.mLvl;
  u.maxHp = Math.round(u.hpBase * (f === 'heroes' ? 1 + S[team].xpLvl * P.heroes.step : 1)); u.hp = u.maxHp;
  if (f === 'ciber') u.shieldMax = u.shield = Math.round(u.maxHp * P.ciber.frac);
  if (u.abShield) u.shieldMax = u.shield = Math.max(u.shieldMax, Math.round(u.maxHp * u.abShield));
}
const invGet = uid => (uid ? SAVE.inv.find(it => it.u === uid) : null);
function applyAbility(u) {
  const k = SUMMON_PARENT[u.type] || u.type, it = invGet(SAVE.abEquip[k]); if (!it || it.k !== 'ab' || !ABILITIES[it.id]) return;
  const id = it.id, v = valsOf(it)[0]; u.ab = id;
  switch (id) {
    case 'cafeina': u.mSpeed *= 1 + v / 100; break;
    case 'piel': u.mHp *= 1 + v / 100; break;
    case 'punos': u.mDmg *= 1 + v / 100; break;
    case 'reflejos': u.mCd *= 1 - v / 100; break;
    case 'plasma': u.abShield = v / 100; break;
    case 'sigilo': u.stealthT = Math.max(u.stealthT, v); u.abSurprise = 2; break;
    case 'escarcha': u.abSlow = { f: 0.5, t: v }; break;
    case 'vampiro': u.abVamp = v / 100; break;
    case 'cadena': u.abChain = v / 100; break;
    case 'provoca': u.abTaunt = v; break;
    case 'renacer': u.abRevive = v / 100; break;
    case 'grito': u.abPulse = { cd: 9, r: 70, stun: v, kind: 'daze', text: '¡GRITO!', color: 'rgba(230,220,255,.9)', tc: '#e6dcff', sfx: 'wail' }; break;
    case 'clon': if (!isLeader(u.type)) u.abClone = v / 100; break;
    case 'furia': u.abFury = 1 + v / 100; break;
    case 'speedrun': u.abRun = v; break;
    case 'hitbox': u.abDodge = v / 100; break;
    case 'microtrans': u.abSteal = v; break;
    case 'ragequit': u.abRage = v; break;
    case 'modofoto': u.abPhoto = v; break;
    case 'dlc': u.abDlc = v; break;
    case 'gigante': { const k = 1 + v / 100; u.mHp *= k; u.mDmg *= k; u.mSpeed *= 0.82; u.mScale *= 1.28; u.r *= 1.28; u.abGiant = true; break; }
    case 'iman': u.abMagnet = v; break;
  }
}
function applyEquip(u) {
  const E = SAVE.equip[facOf(u.team)] || {};
  for (const slot in SLOTS) { const it = invGet(E[slot]); if (it && it.k === 'eq' && ITEMS[it.id] && fitsFac(it.id, facOf(u.team))) applyItem(u, it); }
}
// v0.9.12: efecto de un objeto. Sirve para tu líder y para el equipo del rival en Difícil y Mítica
function applyItem(u, it) {
  {
    const id = it.id, v = valsOf(it), pc = i => 1 + v[i] / 100;
    switch (id) {
      case 'espada_carton': u.mDmg *= pc(0); break;
      case 'raton_dpi': u.mRange = pc(0); u.mDmg *= pc(1); break;
      case 'teclado_rgb': u.mCd *= 1 - v[0] / 100; break;
      case 'banhammer_oro': u.mDmg *= pc(0); u.abKnock = 18; break;
      case 'cuernos': u.mHp *= pc(0); break;
      case 'corona_carton': u.mHp *= pc(0); u.mDmg *= pc(1); break;
      case 'gorro_aluminio': u.mHp *= pc(0); u.immuneBoss = true; break;
      case 'auriculares': u.mHp *= pc(0); u.immuneCC = true; u.immuneBoss = true; break;
      case 'taza': u.regen = (u.regen || 0) + v[0] / 100; break;
      case 'pase_caducado': u.mHp *= pc(0); u.mDmg *= pc(0); u.mSpeed *= pc(0); break;
      case 'almohada': u.respawnM = 1 - v[0] / 100; break;
      case 'silla_gamer': u.abArmor = v[0] / 100; break;
      case 'cofre': { const c = pick(COFRE), pw = v[0] / 100; c[1](u, pw); u.cofreTxt = c[0](pw); break; }
      case 'diploma': u.mHp *= pc(0); u.mDmg *= pc(1); break;
      case 'corbata_ceo': u.mHp *= pc(0); u.mDmg *= pc(1); u.mSpeed *= pc(2); break;
      case 'mando_cable': u.mRange = (u.mRange || 1) * pc(0); break;
      case 'baguette': u.abCrit = v[0] / 100; break;
      case 'lanzaconfeti': u.abSplash = v[0] / 100; break;
      case 'gorra_reves': u.mSpeed *= pc(0); break;
      case 'casco_vr': u.mDmg *= pc(0); u.mHp *= 0.9; break;
      case 'orejas_gato': u.abCute = v[0] / 100; break;
      case 'bebida_xxl': u.abDrink = v[0] / 100; break;
      case 'disco_fisico': u.mHp *= pc(0); break;
      case 'alfombrilla': u.abAura = v[0] / 100; break;
      case 'boton_pausa': u.abPause = v[0]; break;
      case 'zanahoria_oro': u.mDmg *= pc(0); u.jumpCdM = 1 - v[1] / 100; break;
      case 'corona_huesos': u.mHp *= pc(0); u.regen = (u.regen || 0) + v[1] / 100; break;
      case 'microfono_oro': u.mDmg *= pc(0); u.abAura = (u.abAura || 0) + v[1] / 100; break;
      case 'yelmo_olimpo': u.mHp *= pc(0); u.abArmor = Math.max(u.abArmor || 0, v[1] / 100); break;
      case 'nucleo_plasma': u.abShield = Math.max(u.abShield || 0, v[0] / 100); u.mDmg *= pc(1); break;
      case 'gafas_pixel': u.abCrit = Math.max(u.abCrit || 0, v[0] / 100); u.mSpeed *= pc(1); break;
      case 'raton_campeon': u.mCd *= 1 - v[0] / 100; u.mRange = (u.mRange || 1) * pc(1); break;
      case 'cartucho_dorado': u.mHp *= pc(0); u.mDmg *= pc(0); u.olvT = (u.olvT || 0) + v[1]; break;
      case 'claqueta_oro': u.mDmg *= pc(0); u.abSplash = Math.max(u.abSplash || 0, v[1] / 100); break;
    }
    u.equip = u.equip || {}; u.equip[ITEMS[id].slot] = id;
  }
}
function applyEnemyGear(u) { for (const id of G.egear) applyItem(u, { k: 'eq', id, q: ITEMS[id].st.map(() => G.egearQ) }); u.geared = true; }
function doDeploy(team, key, x, y) {
  if (isSpell(key)) { castSpell(team, key, x, y); return; }   // v0.9.15
  const def = cardDef(key);
  S[team].chaos -= def.cost; S[team].spent += def.cost; S[team].deployed++;
  if (team === 'p') chatSt.lastDep = G.t;
  if (team === 'p' && isLeader(key) && Math.random() < 0.6) chatSay('leader');
  else if (team === 'p') chatEv('deploy', def.name, key, 0.35, 5);
  else if (def.cost >= 5 || isLeader(key)) chatEv('enemyBig', def.name, null, 0.6, 8);
  const n = def.count;
  for (let i = 0; i < n; i++) { const ox = n > 1 ? (i - (n - 1) / 2) * 22 : 0, oy = n > 1 ? (i % 2) * 6 : 0, v = spawnUnit(team, key, clamp(x + ox, 24, W - 24), y + oy); if (team === 'p' && G.pDeployAdd) { v.deployT += G.pDeployAdd; v.deployMax = v.deployT; } }
  play('deploy', team === 'p' ? 1 : 0.5);
}
function playerPlay(slot, key, x, y) {
  doDeploy('p', key, x, y); S.p.plays[key] = (S.p.plays[key] || 0) + 1;
  if (G.tutMatch && G.tutB === 0) { G.tutB = 1; G.tutAt = G.tutT; tipBattle('¡Muy bien! Cada carta gasta <b>CAOS</b>: la barra morada de abajo. Se recarga sola.', 7); }
  if (slot >= 0) { const used = S.p.hand[slot]; S.p.hand[slot] = S.p.queue.shift(); S.p.queue.push(used); }
}
function tryPlayerDeploy(slot, key, x, y) {
  if (G.state !== 'play' || !key) return false;
  const card = CFG.cards[key];
  if (card.spell) { x = clamp(x, BOUNDS.x0, BOUNDS.x1); y = clamp(y, BOUNDS.y0, BOUNDS.y1); }   // v0.9.15: los hechizos se lanzan en cualquier sitio
  else { const sp = snapSpot('p', x, y); x = sp.x; y = sp.y; }
  if (isLeader(key) && !canDeploy('p', key)) { const nm = CFG.cards[key].name; toast(S.p.leaderCd > 0 ? `${nm} vuelve en ${Math.ceil(S.p.leaderCd)} s` : `${nm} ya está en el campo`); play('deny'); return false; }
  if (S.p.chaos < card.cost) { toast(`Te falta CAOS: ${Math.ceil(card.cost - S.p.chaos)} más`); play('deny'); return false; }
  playerPlay(slot, key, x, y);
  hideTut();
  return true;
}
function targetable(t) { return t && t.alive && !(t.kind === 'unit' && (t.stealthT > 0 || t.jump || t.deployT > 0.2 || t.banT > 0)); }
function laneStruct(u) {
  const foe = other(u.team); const li = u.x < W / 2 ? 0 : 1;
  const tw = towers[foe][li]; if (tw.alive) return tw;
  return bases[foe];
}
const tauntR = o => (o.d.taunt ? o.d.taunt.r : o.abTaunt || 0);
const rangeOf = u => u.d.range * (u.mRange || 1);
function acquire(u) {
  if (u.confT > 0) {   // v0.9.15: Confusión: se pelea con el aliado más cercano
    let b = null, bd2 = Infinity; for (const o of units) if (o !== u && o.alive && o.team === u.team && o.deployT <= 0 && !o.jump) { const d = edgeDist(u, o); if (d < bd2) { bd2 = d; b = o; } }
    if (b) return b;
  }
  const foe = other(u.team); let best = null, bd = Infinity;
  const ign = o => u.ignT > 0 && o === u.ign;   // v0.9.15: el que ha dejado de perseguir
  if (!u.d.buildings) {
    for (const o of units) if (o.team === foe && tauntR(o) && targetable(o) && edgeDist(u, o) <= tauntR(o)) return o;   // TrollBot y Provocación
    for (const o of units) if (o.team === foe && targetable(o) && !ign(o)) { const d = edgeDist(u, o); if (d < u.d.sight && d < bd) { bd = d; best = o; } }
  }
  for (const s of structs) if (s.team === foe && s.alive) { const d = edgeDist(u, s); if (d < u.d.sight * 0.55 && d < bd) { bd = d; best = s; } }
  return best || laneStruct(u);
}
function moveToward(u, tx, ty, dt) {
  let gx = tx, gy = ty;
  const inBand = u.y > RIVER.top - 2 && u.y < RIVER.bottom + 2;
  const uN = u.y < RIVER.y, tN = ty < RIVER.y;
  // puentes: cada unidad cruza por su sitio dentro del ancho del puente (antes todas iban al centro exacto
  // y, si llegaban dos juntas, se empujaban y se quedaban atascadas en la entrada)
  const bx = nearestBridge(u.x), lim = Math.max(4, BRIDGE_HALF - u.r * 0.6), ex = clamp(u.x, bx - lim, bx + lim);
  if (inBand) { gx = ex; gy = tN ? RIVER.top - 18 : RIVER.bottom + 18; }
  else if (uN !== tN) {
    const ey = uN ? RIVER.top - 8 : RIVER.bottom + 8;
    const atMouth = Math.abs(u.y - ey) <= 30 && Math.abs(u.x - bx) <= BRIDGE_HALF + u.r;   // ya está en la entrada: a cruzar
    gx = ex; gy = atMouth ? (uN ? RIVER.bottom + 18 : RIVER.top - 18) : ey;
  }
  const dx = gx - u.x, dy = gy - u.y, dl = Math.hypot(dx, dy) || 1;
  const step = Math.min(dl, u.d.speed * (u.slowT > 0 ? 0.5 : 1) * u.mSpeed * (u.abFury && u.hp < u.maxHp * 0.5 ? u.abFury : 1) * (u.runT > 0 ? 3 : 1) * (u.drinkT > 0 ? 1 + u.abDrink : 1) * (u.actT > 0 ? 1.2 : 1) * (u.d.fury && u.hp < u.maxHp * u.d.fury.f ? u.d.fury.spd : 1) * dt);
  u.x += (dx / dl) * step; u.y += (dy / dl) * step; u.runDist += step;
  if (Math.abs(dx) > 3) u.face = dx > 0 ? 1 : -1;
  u.moving = true; u.walk += dt * u.d.speed * u.mSpeed * 0.2;
  if (u.mut === 'turbo' && Math.random() < dt * 14) parts.push({ type: 'dust', x: u.x - u.face * u.r, y: u.y, z: rand(2, 10), vx: -u.face * 20, vy: 0, vz: 4, g: 0, life: 0.35, max: 0.35, size: 2.4, color: '#ffe14d' });
}
function explodeBeaver(u, t) {
  const m = dmgMult(u);
  u.alive = false; u.hp = 0;
  hurt(t, u.d.dmg * m, u, 'aoe');
  for (const o of units) if (o.alive && o.team !== u.team && Math.hypot(o.x - u.x, o.y - u.y) - o.r <= u.d.splash) hurt(o, u.d.splashDmg * m, u, 'aoe');
  ring(u.x, u.y, 8, u.d.splash * 1.6, 'rgba(255,170,60,.95)', 0.5, 7);
  puff(u.x, u.y, 14, '#ffb347', 90, 10, false, 10); puff(u.x, u.y, 8, '#8a8f9c', 60, 9, false, 16);
  chips(u.x, u.y, 12, 10, ['#e2463b', '#8a5a33', '#ffcb3d'], 'chip', 4); sparks(u.x, u.y, 14, 10, '#ffd34d'); flashAt(u.x, u.y, 14, 80, '255,160,60', 0.35); screenFlash(0.12);
  addNum(u.x, u.y, 62, '¡BUM!', '#ffb347', 22); if (u.team === 'p') chatEv('kamikaze', null, null, 0.5, 8);
  parts.push({ type: 'ghost', x: u.x, y: u.y, z: 26, vz: 30, life: 1.4, max: 1.4 });
  shake(8); play('boom');
}
function attack(u, t) {
  if (u.d.kamikaze) { explodeBeaver(u, t); return; }
  const surpriseM = u.stealthT > 0 ? u.d.surprise || u.abSurprise || 0 : 0, surprise = surpriseM > 0;
  u.stealthT = 0;
  let mult = dmgMult(u); const st = u.rage > 0 ? 'rage' : 'hit';
  const critHit = !!u.abCrit && Math.random() < u.abCrit; if (critHit) { mult *= 3; addNum(t.x, t.y, topOf(t) + 30, '¡CRÍTICO!', '#ffd23f', 14); }
  const tf = u.tfBoost; if (tf) { mult *= 1.5; u.tfBoost = false; }
  if (u.d.leap && t.kind === 'unit' && (t.d.healer || t.d.ranged || ROLES[t.type] === 'support')) mult *= u.d.leap.mult;   // v0.9.15: mata-sanadores
  if (surprise && u.d.ranged) { mult *= surpriseM; addNum(t.x, t.y, topOf(t) + 22, '¡SORPRESA!', '#e6a8ff', 15); if (u.team === 'p') chatEv('stealth', null, null, 0.5, 12); }   // v0.9.13: GhostAgent
  if (u.d.chain) { zapChain(u, t, u.d.dmg * mult); u.lungeT = 0.12; const d = dist(u, t) || 1; u.lungeX = -(t.x - u.x) / d * 0.5; u.lungeY = -(t.y - u.y) / d * 0.5; return; }
  if (u.d.ranged) { shoot(u, t, u.d.ranged, u.d.dmg * mult, tf || critHit || surprise ? 'crit' : st); u.lungeT = 0.12; const d = dist(u, t) || 1; u.lungeX = -(t.x - u.x) / d * 0.5; u.lungeY = -(t.y - u.y) / d * 0.5; return; }
  u.lungeT = 0.18; const d = dist(u, t) || 1; u.lungeX = (t.x - u.x) / d; u.lungeY = (t.y - u.y) / d;
  let dmg = u.d.dmg * mult, crit = surprise || tf || critHit;
  if (surprise) { dmg *= surpriseM; addNum(t.x, t.y, topOf(t) + 22, '¡SORPRESA!', '#e6a8ff', 15); if (u.team === 'p') chatEv('stealth', null, null, 0.5, 12); }
  if (u.d.charge && u.runDist >= u.d.charge.dist) {   // Minotaur: embestida si llega corriendo
    const C = u.d.charge; dmg *= C.mult; crit = true;
    if (t.kind === 'unit') { t.stunT = Math.max(t.stunT, C.stun); t.stunKind = 'daze'; }
    addNum(t.x, t.y, topOf(t) + 24, '¡EMBESTIDA!', '#ffb347', 15); puff(u.x, u.y, 8, '#e9dcc0', 60, 7, true); shake(4); play('slam');
  }
  u.runDist = 0;
  if (u.d.combo) {   // v0.9.13: ProGamer, cada 4.º golpe es un combo
    const C = u.d.combo; u.comboN = (u.comboN || 0) + 1;
    if (u.comboN >= C.n) { u.comboN = 0; dmg *= C.mult; crit = true; if (t.kind === 'unit' && !t.immuneCC) { t.stunT = Math.max(t.stunT, C.stun); t.stunKind = 'daze'; } addNum(t.x, t.y, topOf(t) + 26, '¡COMBO x' + C.n + '!', '#7be04a', 16); flashAt(t.x, t.y, topOf(t) * 0.5, 40, '123,224,74', 0.25); play('hype'); }
  }
  if (u.d.steal && t.kind === 'struct' && S) {   // v0.9.13: CobraDLC te cobra CAOS en cada golpe a un edificio
    const foe = other(u.team), n = Math.min(S[foe].chaos, u.d.steal);
    if (n > 0.05) { S[foe].chaos -= n; S[u.team].chaos = Math.min(CFG.chaosMax, S[u.team].chaos + n); addNum(t.x, t.y, topOf(t) + 30, `¡COBRADO! -${fmtV(rnd(n, 1))} CAOS`, '#ffcb3d', 13); play('card'); }
  }
  if (u.d.stonks && t.kind === 'struct') {   // Stonks: cada golpe a un edificio pega más
    const K = u.d.stonks; dmg *= 1 + u.stonk * K.step; if (u.stonk < K.max) u.stonk++;
    if (u.stonk % 3 === 0) addNum(u.x, u.y, topOf(u) + 16, 'STONKS ↑', '#4ade80', 13);
  }
  const sl = u.d.slow || u.abSlow;
  if (sl && t.kind === 'unit' && t.alive && !t.immuneCC) { t.slowT = sl.t; chips(t.x, t.y, topOf(t) * 0.5, 3, ['#9fe3ff', '#ffffff'], 'chip', 2.5); }
  slashFx(u, t);
  hurt(t, dmg, u, crit ? 'crit' : st);
  if (u.abSplash) confetti(u, t, dmg * u.abSplash);
  if (u.abChain) chainOne(u, t, dmg * u.abChain);
  if (u.d.cleave) {   // BanHammer: el martillazo también da a los de alrededor
    for (const o of units) if (o !== t && o.alive && o.team !== u.team && targetable(o) && dist(o, t) - o.r <= u.d.cleave.r) { hurt(o, dmg * u.d.cleave.f, u, 'aoe'); knockBack(u, o); }
    ring(t.x, t.y, 6, u.d.cleave.r, 'rgba(255,255,255,.85)', 0.3, 4);
  }
  if ((u.d.knock || u.abKnock) && t.kind === 'unit') knockBack(u, t);
}
// habilidad Rayo en cadena: el golpe salta a otro enemigo cercano
function chainOne(u, t, dmg) {
  let best = null, bd = 75;
  for (const o of units) if (o !== t && o.team !== u.team && targetable(o)) { const dd = dist(o, t); if (dd < bd) { bd = dd; best = o; } }
  if (!best) return;
  parts.push({ type: 'zap', pts: [[t.x, t.y, topOf(t) * 0.5], [best.x, best.y, topOf(best) * 0.5]], life: 0.22, max: 0.22, seed: Math.random() * 1000 });
  hurt(best, dmg, u, 'aoe');
}
function knockBack(u, t) {
  if (!t.alive || t.jump || t.immuneCC) return;
  const kn = u.d.knock || u.abKnock || 0, dd = dist(u, t) || 1; t.x += (t.x - u.x) / dd * kn; t.y += (t.y - u.y) / dd * kn * 0.7;
  puff(t.x, t.y, 4, '#e9dcc0', 30, 5, true);
}
// ThunderGod: rayo que salta entre enemigos
function zapChain(u, t, dmg) {
  const C = u.d.chain; const pts = [[u.x + u.face * 14, u.y, topOf(u) * 1.05], [t.x, t.y, topOf(t) * 0.5]];
  const hit = [t]; let cur = t, d = dmg;
  hurt(t, dmg, u, 'hit');
  for (let i = 0; i < C.n; i++) {
    d *= C.f; let best = null, bd = C.r;
    for (const o of units) if (o.team !== u.team && targetable(o) && !hit.includes(o)) { const dd = dist(o, cur); if (dd < bd) { bd = dd; best = o; } }
    if (!best) break;
    pts.push([best.x, best.y, topOf(best) * 0.5]); hurt(best, d, u, 'aoe'); hit.push(best); cur = best;
  }
  parts.push({ type: 'zap', pts, life: 0.3, max: 0.3, seed: Math.random() * 1000 });
  sparks(t.x, t.y, topOf(t) * 0.5, 5, '#ffe14d'); play('zap');
}
// cada frame: aura de TwitchKing y Rabia de los Animales Locos
function updatePassives() {
  const R = CFG.passives.animales;
  if (S) for (const tm of ['p', 'e']) if (facOf(tm) === 'gamer') {   // v0.9.13: Comunidad
    const set = new Set(); for (const u of units) if (u.alive && u.team === tm && u.deployT <= 0) set.add(u.type);
    const n = Math.min(CFG.passives.gamer.max, set.size), St = S[tm];
    if (n === CFG.passives.gamer.max && (St.comm || 0) < n && tm === 'p' && !St.commMax) { St.commMax = true; banner('¡COMUNIDAD AL MÁXIMO!', '6 tipos de unidad en el campo: +30 % de daño para todos', 'gamer'); play('hype'); }
    St.comm = n;
  }
  const auras = units.filter(a => a.alive && a.d.aura && a.deployT <= 0);
  for (const u of units) {
    u.aura = 0;
    if (auras.length && u.alive && u.deployT <= 0) for (const a of auras) if (a.team === u.team && dist(a, u) <= a.d.aura.r) { u.aura = a.d.aura.mult; break; }
    if (facOf(u.team) !== 'animales') { u.rage = 0; continue; }
    let n = 0;
    if (u.alive && u.deployT <= 0) for (const o of units) { if (o !== u && o.alive && o.team === u.team && o.deployT <= 0 && Math.abs(o.x - u.x) < R.radius && Math.abs(o.y - u.y) < R.radius && dist(o, u) <= R.radius) n++; }
    n = Math.min(R.maxStacks, n);
    if (n === R.maxStacks && !u.rageShown) { u.rageShown = true; addNum(u.x, u.y, TYPES[u.type].top + 20, '¡RABIA MÁXIMA!', '#ff8a3d', 13); }
    u.rage = n;
  }
}
function dmgMult(u) {
  let m = (u.mDmg || 1) * (u.mLvl || 1);
  if (S) {
    const f = facOf(u.team);
    if (f === 'animales') m *= 1 + (u.rage || 0) * CFG.passives.animales.perAlly;
    else if (f === 'heroes') m *= 1 + S[u.team].xpLvl * CFG.passives.heroes.step;
    else if (f === 'gamer') m *= 1 + (S[u.team].comm || 0) * CFG.passives.gamer.step;
  }
  if (u.d.fury && u.hp < u.maxHp * u.d.fury.f) m *= u.d.fury.mult;
  if (u.aura) m *= u.aura;
  if (u.abFury && u.hp < u.maxHp * 0.5) m *= u.abFury;
  if (u.drinkT > 0) m *= 1 + u.abDrink;
  if (u.shrinkT > 0) m *= u.shrinkF || 0.6;   // v0.9.15: Nerfeo divino y Remake
  return m;
}
// Hype (Streamers), Turbo (Memes) y equipo/habilidades aceleran los ataques
const cdMult = u => (u.mCd || 1) * (u.actT > 0 ? 0.7 : 1) * (u.zombT > 0 ? 2 : 1) * (u.hasteT > 0 ? 0.7 : 1) / (S && facOf(u.team) === 'streamers' ? 1 + S[u.team].hypeLvl * CFG.passives.streamers.step : 1);
function topOf(e) { return e.kind === 'unit' ? TYPES[e.type].top * (e.mScale || 1) * (e.shrinkT > 0 ? e.shrinkF || 0.6 : 1) : TOPS[e.skin + '_' + e.role]; }
function hurt(t, amount, src, style = 'hit') {
  if (!t || !t.alive) return;
  if (src && src.kind === 'unit') for (const c of units) if (c.abCute && c.alive && c.team !== src.team && dist(c, src) <= 75) { amount *= 1 - c.abCute; break; }   // orejas de gato
  if (t.kind === 'unit') {
    if (t.jump) return;
    if (t.invulnT > 0) { if (Math.random() < 0.25) addNum(t.x, t.y, topOf(t) + 12, 'PAUSA', '#7df3ff', 12); return; }
    if (t.abDodge && src && Math.random() < t.abDodge) { addNum(t.x + rand(-6, 6), t.y, topOf(t) + 12, '¡ESQUIVA!', '#7df3ff', 13); return; }
    if (t.markT > 0) amount *= 1 + (t.markF || 0);   // marcado por el Detective
    if (t.d.armor) amount *= 1 - t.d.armor;
    if (t.abArmor) amount *= 1 - t.abArmor;
    t.shT = 0;
    if (t.bshield > 0) {   // v0.9.13: barrera dorada del muro de escudos (VikingoPerdido)
      const ab = Math.min(t.bshield, amount); t.bshield -= ab; amount -= ab; t.hitT = 0.12;
      if (ab >= 1) addNum(t.x + rand(-7, 7), t.y, topOf(t) * 0.75 + 10, Math.round(ab), '#ffe08a', 13);
      if (t.bshield <= 0.01) { t.bshield = 0; t.bshT = 0; ring(t.x, t.y, 6, t.r * 2.4, 'rgba(255,203,61,.95)', 0.3, 4); sparks(t.x, t.y, topOf(t) * 0.5, 6, '#ffe08a'); play('shield'); }
      if (amount < 0.5) { sparks(t.x, t.y, topOf(t) * 0.45, 2, '#ffe08a'); return; }
    }
    if (t.shield > 0) {   // Escudos de plasma: absorben primero
      const ab = Math.min(t.shield, amount); t.shield -= ab; amount -= ab; t.hitT = 0.12;
      if (ab >= 1) addNum(t.x + rand(-7, 7), t.y, topOf(t) * 0.75 + 10, Math.round(ab), '#7df3ff', 13);
      if (t.shield <= 0.01) { t.shield = 0; ring(t.x, t.y, 6, t.r * 2.4, 'rgba(34,227,255,.95)', 0.3, 4); sparks(t.x, t.y, topOf(t) * 0.5, 6, '#7df3ff'); play('shield'); }
      if (amount < 0.5) { sparks(t.x, t.y, topOf(t) * 0.45, 2, '#7df3ff'); return; }
    }
  }
  if (t.kind === 'unit' && t.abPause && !t.pauseUsed && t.hp - amount <= t.maxHp * 0.2) {   // Botón de pausa
    t.pauseUsed = true; t.invulnT = t.abPause; addNum(t.x, t.y, topOf(t) + 24, '¡PAUSA!', '#7df3ff', 16); ring(t.x, t.y, 6, t.r * 3, 'rgba(125,243,255,.95)', 0.4, 5); play('shield');
    if (t.team === 'p') chatEv('ability', null, null, 0.5, 15);
    return;
  }
  amount = Math.round(amount);
  if (G.mode === 'boss' && t === bases.e) S.p.bossDmg += Math.min(amount, Math.max(0, t.hp));
  t.hp -= amount; t.hitT = 0.12;
  if (src && src.abVamp && src.alive && src.kind === 'unit') { const hv = Math.min(src.maxHp - src.hp, amount * src.abVamp); src.hp += hv; if (hv >= 2 && Math.random() < 0.45) addNum(src.x + rand(-5, 5), src.y, topOf(src) * 0.75 + 8, '+' + Math.round(hv), '#8cf05a', 13); }
  const col = style === 'crit' ? '#ffd23f' : style === 'aoe' ? '#f3a6ff' : style === 'boss' ? '#ff6b7a' : style === 'rage' ? '#ff8a3d' : '#ffffff';
  addNum(t.x + rand(-7, 7), t.y, topOf(t) * 0.75 + 6, amount, col, style === 'crit' ? 22 : style === 'rage' ? 16 : t.kind === 'struct' ? 14 : 15);
  sparks(t.x, t.y, topOf(t) * 0.45, style === 'hit' ? 3 : 6, t.team === 'e' ? '#bfe9ff' : '#ffe7a8');
  if (!t.fxT || G.t - t.fxT > 0.07) { t.fxT = G.t; const big = style === 'crit'; impact(t.x + rand(-4, 4), t.y, topOf(t) * 0.5 + rand(-4, 4), big ? 17 : style === 'aoe' ? 12 : t.kind === 'struct' ? 13 : 10, big ? '#ffd23f' : t.team === 'e' ? '#d8f1ff' : '#fff0c2'); if (big) flashAt(t.x, t.y, topOf(t) * 0.5, 36, '255,210,63', 0.25); }
  play(t.kind === 'unit' && t.team === 'e' ? 'clank' : 'hit');
  if (t.kind === 'struct') shake(style === 'aoe' ? 5 : 1.2);
  if (t.kind === 'struct' && t.role === 'base' && !t.lowSaid && t.hp > 0 && t.hp < t.maxHp * 0.35) { t.lowSaid = true; chatEv(t.team === 'e' ? 'baseLowE' : 'baseLowP', null, null, 1, 0); }
  if (t.hp <= 0) kill(t, src);
}
function kill(t, src) {
  t.alive = false; t.hp = 0;
  if (t.kind === 'unit') {
    deathFx(t, src);
    // Renacer (No-Muertos): revive una vez, salvo los invocados
    const nm = facOf(t.team) === 'nomuertos';
    const live = G.state === 'play' || G.state === 'ending';
    const willRevive = (nm || t.abRevive || t.d.remaster) && !t.revived && !t.summon && live;
    if (willRevive) {
      const rm = !nm && !t.abRevive;   // v0.9.13: Remaster 70 € vuelve una vez (el mismo juego, otra vez a precio completo)
      revives.push({ team: t.team, type: t.type, x: t.x, y: t.y, face: t.face, t: CFG.passives.nomuertos.delay, frac: nm ? CFG.passives.nomuertos.hpFrac : rm ? t.d.remaster : t.abRevive, txt: rm ? '¡REMASTER!' : null, col: rm ? '#ffcb3d' : null, rgb: rm ? '255,203,61' : null });
      if (rm) { addNum(t.x, t.y, topOf(t) + 20, 'VUELVE A 70 €', '#ffcb3d', 13); if (t.team === 'e') chatEv('remaster', null, null, 0.7, 10); }
      else parts.push({ type: 'grave', x: t.x, y: t.y, z: 0, life: CFG.passives.nomuertos.delay + 0.3, max: CFG.passives.nomuertos.delay + 0.3 });
    }
    // v0.9.13: Secuela (Cultura Pop): 3 de cada 10 vuelven en versión «2»
    const PP = CFG.passives.pop, seq = !willRevive && facOf(t.team) === 'pop' && !t.sequel && !t.summon && !t.isClone && live && Math.random() < PP.chance;
    if (seq) {
      revives.push({ team: t.team, type: t.type, x: t.x, y: t.y, face: t.face, t: 0.9, frac: 1, seq: true, txt: '¡SECUELA!', col: '#ff9ab8', rgb: '255,154,184' });
      parts.push({ type: 'clapper', x: t.x, y: t.y, z: topOf(t) * 0.6 + 14, life: 1.1, max: 1.1 });
    }
    deathExtras(t, src);
    if (t.d.deathBlast) {
      const B = t.d.deathBlast, rgb = B.rgb || '123,224,74';
      for (const o of units) if (o.alive && o.team !== t.team && Math.hypot(o.x - t.x, o.y - t.y) - o.r <= B.r) hurt(o, B.dmg * (t.mLvl || 1), null, 'aoe');
      ring(t.x, t.y, 10, B.r * 1.3, `rgba(${rgb},.9)`, 0.55, 7); puff(t.x, t.y, 16, B.c1 || '#7be04a', 80, 10, false, 14); puff(t.x, t.y, 8, B.c2 || '#c6a4c9', 50, 8, false, 20);
      addNum(t.x, t.y, 64, B.txt || '¡NUBE TÓXICA!', B.tc || '#9cf06a', 16); flashAt(t.x, t.y, 14, 90, rgb, 0.4); shake(6); play('trash');
      if (B.txt && t.team === 'p') chatEv('ability', null, null, 0.4, 12);
    }
    if (isLeader(t.type) && !willRevive && !seq) { const sec = Math.round(CFG.cards[t.type].respawn * (t.respawnM || 1) * (t.team === 'p' ? G.pRespawnM || 1 : 1)); S[t.team].leaderCd = sec; if (t.team === 'p') toast(`${CFG.cards[t.type].name} ha caído. Vuelve en ${sec} s`); }
    if (t.abClone && !t.isClone && (G.state === 'play' || G.state === 'ending')) {   // Clon viral
      for (const ox of [-12, 12]) { const c = spawnUnit(t.team, t.type, clamp(t.x + ox, 24, W - 24), t.y); c.isClone = true; c.summon = true; c.abClone = 0; c.labelT = 0; c.mScale *= 0.7; c.r *= 0.7; c.maxHp = Math.max(1, Math.round(c.maxHp * t.abClone)); c.hp = c.maxHp; c.deployT = c.deployMax = 0.3; c.rising = true; }
      addNum(t.x, t.y, topOf(t) + 20, '¡CLON VIRAL!', '#ffe14d', 15); play('pop');
    }
    if (src && src.alive && src.kind === 'unit' && src.d.restealth) src.stealthT = src.d.restealth;   // SlyFox y GhostAgent vuelven a desaparecer
    if (facOf(t.team) === 'microblizz' && G.state === 'play' && CFG.enemyCards[t.type]) {
      const card = CFG.enemyCards[t.type]; const refund = (card.cost / card.count) * CFG.passives.e.refund;
      S[t.team].chaos = Math.min(CFG.chaosMax, S[t.team].chaos + refund);
      addNum(t.x, t.y, TYPES[t.type].top + 34, '+' + String(Math.round(refund * 10) / 10).replace('.', ',') + ' CAOS', '#8fc2ff', 11);
      if (!G.layoffShown) { G.layoffShown = true; banner('DESPIDOS RENTABLES', 'Pasiva de Microblizz: cada bot despedido le devuelve CAOS', 'enemy'); }
    }
    if (t.d.eject) {
      const n = t.d.ejectN || 1;
      for (let i = 0; i < n; i++) { const v = spawnUnit(t.team, t.d.eject, clamp(t.x + (n > 1 ? (i - (n - 1) / 2) * 18 : 0), 24, W - 24), t.y); v.deployT = v.deployMax = 0.35; v.face = t.face; v.labelT = 0; v.summon = true; }
      addNum(t.x, t.y, 70, t.d.ejectTxt || '¡EYECCIÓN!', '#ff8fc8', 18); play('eject');
    }
    if (G.state === 'play' && !t.summon && G.t >= (G.quipT || 0) && Math.random() < (t.team === 'p' ? 0.12 : 0.4)) {   // frase de despedida
      const pool = t.team === 'p' ? QUIPS.player.concat(QUIPS_FAC[G.faction] || []) : isCorp(facOf(t.team)) ? QUIPS[facOf(t.team)] : (ownerOf() === 'phony' ? QUIPS.corruptPh : QUIPS.corrupt).concat(QUIPS_CORRUPT[facOf(t.team)] || []);
      parts.push({ type: 'quip', x: clamp(t.x, 70, W - 70), y: t.y, z: topOf(t) + 24, vz: 9, txt: pick(pool), life: 3.3, max: 3.3 }); G.quipT = G.t + 3.2;
    }
    S[other(t.team)].kills++; if (G.state === 'play') passiveKill(other(t.team));
    if (t.team === 'e' && !t.summon) { const sp = S.p; sp.kb = sp.kb || {}; sp.kb[t.type] = (sp.kb[t.type] || 0) + 1; if (isLeader(t.type)) sp.kl = (sp.kl || 0) + 1; }   // v0.9.14: para los logros
    if (t.team === 'e' && G.state === 'play') { chatSt.kq = (chatSt.kq || []).filter(x => G.t - x < 2.5); chatSt.kq.push(G.t); if (chatSt.kq.length >= 3) { chatSt.kq = []; chatEv('multikill', null, null, 1, 10); } }
    if (isLeader(t.type) && !willRevive && !seq) chatEv(t.team === 'p' ? 'leaderDown' : 'eLeaderDown', CFG.cards[t.type].name, null, 0.85, 8);
    return;
  }
  structDeathFx(t);
  if (G.state !== 'play') return;
  const winner = other(t.team);
  if (t.role === 'base') { S[winner].crowns = 3; endMatch(winner, 'base'); return; }
  S[winner].crowns++;
  if (winner === 'p') { if (facOf('e') === 'streamers') { S.e.hype = 0; S.e.hypeLvl = 0; } banner('¡TORRE DERRIBADA!', 'Microblizz dice que esa torre le sobraba', 'player'); play('crown'); chatBurst(S.p.crowns === S.e.crowns && S.e.crowns > 0 ? 'comeback' : 'towerP', 2); }
  else {
    const lostHype = facOf('p') === 'streamers' && S.p.hype > 0; if (lostHype) { S.p.hype = 0; S.p.hypeLvl = 0; }
    chatBurst('towerE', 2);
    banner('TE HAN TIRADO UNA TORRE', lostHype ? 'El chat se va: tu HYPE vuelve a 0' : 'Protege ese carril con más unidades', 'enemy'); play('sad');
  }
}
// Hype (Streamers) y Experiencia (Héroes) suben con cada bot despedido
function passiveKill(team) {
  const f = facOf(team), St = S[team], mine = team === 'p';
  if (f === 'streamers') {
    const P = CFG.passives.streamers; St.hype++;
    const lvl = Math.min(P.max, Math.floor(St.hype / P.per));
    if (lvl > St.hypeLvl) {
      St.hypeLvl = lvl; if (mine) { banner('HYPE ' + lvl, `El chat está que arde: tu equipo ataca un ${lvl * 5} % más rápido`, 'stream'); play('hype'); }
      for (const u of units) if (u.alive && u.team === team) ring(u.x, u.y, 4, u.r * 2.4, 'rgba(192,132,252,.95)', 0.45, 4);
    }
  } else if (f === 'heroes') {
    const P = CFG.passives.heroes; St.xp++;
    const lvl = Math.min(P.max, Math.floor(St.xp / P.per));
    if (lvl > St.xpLvl) {
      St.xpLvl = lvl;
      for (const u of units) if (u.alive && u.team === team) { const old = u.maxHp; u.maxHp = Math.round(u.hpBase * (1 + lvl * P.step)); u.hp += u.maxHp - old; ring(u.x, u.y, 4, u.r * 2.4, 'rgba(255,203,61,.95)', 0.45, 4); }
      if (mine) { banner('¡NIVEL ' + lvl + '!', `Tu ejército sube de nivel: +${lvl * 5} % de vida y daño`, 'hero'); play('levelup'); }
    }
  }
}
// proyectiles: velocidad, parábola (lob), sonido, chispa y aro de impacto
const PROJ = {
  acorn: { v: 300, lob: 0.12, sfx: 'acorn' }, carrot: { v: 280, lob: 0.12, sfx: 'carrot' }, trash: { v: 250, lob: 0.25, sfx: 'carrot' }, soulfire: { v: 290, lob: 0.12, sfx: 'carrot', spark: '#7dffb8' },
  laser: { v: 720, sfx: 'laser', spark: '#33e0ff' }, eyelaser: { v: 640, sfx: 'eyelaser' }, plasma: { v: 360, sfx: 'plasma', spark: '#a98bff' }, shadow: { v: 380, sfx: 'plasma', spark: '#b27dff' }, frost: { v: 400, sfx: 'plasma', spark: '#bff6ff' }, wave: { v: 300, sfx: 'plasma', spark: '#e6dcff', ring: 'rgba(230,220,255,.9)' },
  heart: { v: 330, sfx: 'pop', spark: '#ff8fd0' }, bolt: { v: 640, sfx: 'zap', spark: '#ffe14d' }, neon: { v: 700, sfx: 'laser', spark: '#ff3df0' }, meme: { v: 300, lob: 0.08, sfx: 'pop', spark: '#ffe14d' },
  clip: { v: 420, sfx: 'pop', spark: '#ffffff' }, bullet: { v: 820, sfx: 'gun', spark: '#ffe66b' }, snipe: { v: 1300, sfx: 'snipe', spark: '#ff3df0' }, code: { v: 380, sfx: 'gun', spark: '#7be04a' },
  venom: { v: 360, sfx: 'plasma', spark: '#7be04a' }, arrow: { v: 520, sfx: 'acorn', spark: '#ff8fd0' }, card: { v: 400, sfx: 'card', spark: '#ffffff' }, gif: { v: 460, sfx: 'pop', spark: '#ffe14d' },
  shell: { v: 260, lob: 0.3, sfx: 'carrot', ring: 'rgba(255,170,60,.95)' }, note: { v: 300, sfx: 'note', spark: '#ff8fd0', ring: 'rgba(255,143,208,.9)' }, fireball: { v: 300, lob: 0.15, sfx: 'card', ring: 'rgba(255,120,40,.95)' },
  // v0.9.13
  pixel: { v: 420, sfx: 'blip', spark: '#ff9a3c' }, payray: { v: 680, sfx: 'laser', spark: '#ffcb3d' }, popcorn: { v: 300, lob: 0.15, sfx: 'pop', spark: '#fff7e0' }, rgb: { v: 720, sfx: 'laser', spark: '#22e3ff' },
  missile: { v: 360, sfx: 'missile', spark: '#ffb347' }, disc: { v: 430, sfx: 'pop', spark: '#e5e7eb' }, contract: { v: 380, sfx: 'card', spark: '#ffffff' }, paper: { v: 360, sfx: 'card', spark: '#f5f0e1' },
};
function shoot(src, tgt, kind, dmg, style = 'hit') {
  const sx = src.x + (src.kind === 'unit' ? src.face * 12 * (src.mScale || 1) : src.muzzleX), sy = src.y;
  const sz = src.kind === 'struct' ? src.muzzleZ : topOf(src) * 0.5;
  const d = Math.hypot(tgt.x - sx, tgt.y - sy); const P = PROJ[kind];
  const pr = { kind, x: sx, y: sy, z: sz, sx, sy, sz, tgt, tx: tgt.x, ty: tgt.y, t: 0, dur: Math.max(0.1, d / P.v), dmg, team: src.team, src, arc: P.lob ? 30 + d * P.lob : 0, splash: src.kind === 'unit' ? src.d.splash || 0 : 0, style };
  projs.push(pr); play(P.sfx); return pr;
}
function bounceShot(p) {
  const from = p.tgt; let best = null, bd = 95;
  for (const o of units) if (o !== from && o.team !== p.team && targetable(o)) { const d = dist(o, from); if (d < bd) { bd = d; best = o; } }
  if (!best) return;
  const sz = topOf(from) * 0.45;
  projs.push({ kind: p.kind, x: from.x, y: from.y, z: sz, sx: from.x, sy: from.y, sz, tgt: best, tx: best.x, ty: best.y, t: 0, dur: Math.max(0.08, bd / PROJ[p.kind].v), dmg: p.dmg * p.src.d.bounce, team: p.team, src: p.src, arc: 0, splash: 0, style: 'aoe', bounced: true });
}
function updateProjs(dt) {
  for (const p of projs) {
    p.t += dt; if (p.tgt.alive) { p.tx = p.tgt.x; p.ty = p.tgt.y; }
    const k = Math.min(1, p.t / p.dur); const tz = p.tgt.alive ? topOf(p.tgt) * 0.45 : 6;
    p.x = lerp(p.sx, p.tx, k); p.y = lerp(p.sy, p.ty, k); p.z = lerp(p.sz, tz, k) + Math.sin(Math.PI * k) * p.arc;
    if (k >= 1) {
      p.done = true;
      const P = PROJ[p.kind];
      if (p.splash) {
        for (const o of units) if (o.alive && o.team !== p.team && Math.hypot(o.x - p.x, o.y - p.y) - o.r <= p.splash) hurt(o, p.dmg, p.src, 'aoe');
        if (p.tgt.kind === 'struct' && p.tgt.alive) hurt(p.tgt, p.dmg, p.src, 'aoe');
        ring(p.x, p.y, 6, p.splash, P.ring || 'rgba(255,170,60,.9)', 0.35, 5);
        if (p.kind === 'note') { for (let i = 0; i < 3; i++) parts.push({ type: 'note', x: p.x + rand(-14, 14), y: p.y, z: rand(8, 20), vx: 0, vy: 0, vz: 30, g: 0, life: 0.7, max: 0.7, col: pick(['#ff8fd0', '#22e3ff', '#ffe14d']) }); play('note'); }
        else if (p.kind === 'wave') sparks(p.x, p.y, 8, 5, '#e6dcff');
        else { puff(p.x, p.y, 8, p.kind === 'fireball' ? '#ff8a1f' : '#ffb347', 60, 7, false, 6); if (p.kind === 'trash') chips(p.x, p.y, 6, 6, ['#2a2e3a', '#7be04a', '#c9cbd3', '#ffcb3d'], 'chip', 3.5); else sparks(p.x, p.y, 8, 8, '#ffd34d'); play('trash'); }
        continue;
      }
      if (p.tgt.alive && p.tgt.kind === 'unit' && p.src && p.src.d) {
        const sl = p.src.d.slow || p.src.abSlow; if (sl && !p.tgt.immuneCC) p.tgt.slowT = sl.t;
        if (p.src.d.stunOnHit) { p.tgt.stunT = Math.max(p.tgt.stunT, p.src.d.stunOnHit); p.tgt.stunKind = 'daze'; }
        if (p.src.d.mark) { if (!(p.tgt.markT > 0)) addNum(p.tgt.x, p.tgt.y, topOf(p.tgt) + 18, '¡PISTA!', '#ffe14d', 12); p.tgt.markT = p.src.d.mark.t; p.tgt.markF = p.src.d.mark.f; }
      }
      if (p.tgt.alive) { hurt(p.tgt, p.dmg, p.src, p.style); if (p.src && p.src.abChain && p.src.kind === 'unit') chainOne(p.src, p.tgt, p.dmg * p.src.abChain); }
      if (p.src && p.src.d && p.src.d.bounce && !p.bounced && p.tgt.kind === 'unit') bounceShot(p);   // v0.9.13: el disco del Coleccionista rebota
      if (p.src && p.src.abSplash && p.src.kind === 'unit') confetti(p.src, p.tgt, p.dmg * p.src.abSplash);
      if (p.kind === 'acorn' || p.kind === 'carrot') chips(p.x, p.y, p.z, 3, p.kind === 'acorn' ? ['#9a6a33', '#5b3a1c'] : ['#ff8a1f', '#5cc23a'], 'chip', 3);
      else sparks(p.x, p.y, p.z, 4, P.spark || '#ff3348');
    }
  }
  projs = projs.filter(p => !p.done);
}
function updateUnit(u, dt) {
  u.hitT = Math.max(0, u.hitT - dt); u.lungeT = Math.max(0, u.lungeT - dt); u.labelT = Math.max(0, u.labelT - dt);
  if (u.deployT > 0) {
    u.deployT -= dt;
    if (u.deployT <= 0) {
      u.deployT = 0; u.rising = false; puff(u.x, u.y, 8, '#efe2c4', 50, 6, true); ring(u.x, u.y, 6, u.r * 2.6, 'rgba(255,255,255,.8)', 0.3, 3); play('land', u.team === 'p' ? 1 : 0.5);
      if (u.type === 'bunny' || u.mut === 'giant') shake(5);
      if (u.mutTxt) { addNum(u.x, u.y, topOf(u) + 18, u.mutTxt, u.mutCol, 14); play('roll'); }
      if (u.cofreTxt) addNum(u.x, u.y, topOf(u) + 32, 'COFRE: ' + u.cofreTxt, '#ffe06a', 13);
      onLand(u);
    }
    return;
  }
  tickExtras(u, dt);
  if (u.banT > 0) { u.banT -= dt; u.moving = false; return; }   // v0.9.15: baneado: ni se mueve ni hace nada
  if (u.d.life) { u.lifeT = (u.lifeT || 0) + dt; if (u.lifeT >= u.d.life) { expireUnit(u); return; } }   // v0.9.13: la licencia caduca
  if (u.olvT > 0) {   // v0.9.13: Nostalgia: las torres no se acuerdan de él durante 3 s
    u.olvOn = structs.some(s => s.alive && s.team !== u.team && edgeDist(s, u) <= s.range);
    if (u.olvOn) { u.olvT -= dt; if (!u.olvSaid) { u.olvSaid = true; const St = S[u.team]; if (G.t - (St.olvSaidT || -9) > 2.5) { St.olvSaidT = G.t; addNum(u.x, u.y, topOf(u) + 18, '¿Y ESTE QUIÉN ES?', '#ecc98f', 13); } } }
  }
  if (u.immuneCC) { u.stunT = 0; u.slowT = 0; }
  if (u.regen && u.hp < u.maxHp) u.hp = Math.min(u.maxHp, u.hp + u.maxHp * u.regen * dt);
  if (u.shieldMax) {   // Escudos de plasma: se recargan tras unos segundos sin daño
    const P = CFG.passives.ciber; u.shT += dt;
    if (u.shT >= P.delay && u.shield < u.shieldMax) { if (u.shield === 0) { ring(u.x, u.y, 4, u.r * 2.2, 'rgba(34,227,255,.9)', 0.35, 3); play('shield'); } u.shield = Math.min(u.shieldMax, u.shield + u.shieldMax * P.regen * dt); }
  }
  if (u.slowT > 0) u.slowT -= dt;
  if (u.jump && u.d.leap) { leapTick(u, dt); return; }   // v0.9.15: el salto del mata-sanadores no se corta
  if (u.stunT > 0) { u.stunT -= dt; u.moving = false; return; }
  if (u.stealthT > 0) { u.stealthT -= dt; if (Math.random() < dt * 6) parts.push({ type: 'dust', x: u.x + rand(-10, 10), y: u.y, z: rand(4, 30), vx: 0, vy: 0, vz: 18, g: 0, life: 0.5, max: 0.5, size: 2, color: '#d9a8ff' }); }
  u.atkT -= dt;
  if (u.d.healer) { healAim(u, dt); if (!(u.disarmT > 0)) healPulse(u, dt); if (followAlly(u, dt)) return; }
  if (u.d.summon) summonTick(u, dt);
  if (u.d.pulse || u.abPulse) pulseTick(u, dt);
  if (u.d.viral) viralTick(u, dt);
  if (u.d.teamFight) teamFightTick(u, dt);
  if (u.d.hack) hackTick(u, dt);
  if (u.d.taunt) tauntTick(u, dt);
  if (u.d.shieldUp) shieldUpTick(u, dt);
  if (u.d.action) actionTick(u, dt);
  if (u.type === 'bunny' && bunnyJump(u, dt)) return;
  if (u.d.leap && !(u.confT > 0) && leapTick(u, dt)) return;   // v0.9.15: mata-sanadores
  u.retarget -= dt;
  if (!targetable(u.target) || u.retarget <= 0) { u.target = acquire(u); u.retarget = 0.3; }
  const t = u.target; if (!t) { u.moving = false; return; }
  if (u.d.blink) blinkTick(u, t, dt);
  if (edgeDist(u, t) <= rangeOf(u)) {
    u.moving = false; u.chaseT = 0; if (Math.abs(t.x - u.x) > 2) u.face = t.x > u.x ? 1 : -1;
    if (u.atkT <= 0 && !(u.disarmT > 0)) { attack(u, t); u.atkT = u.d.cd * cdMult(u); }   // v0.9.15: con pulgas no ataca
  } else {
    // v0.9.15: si persigue a una unidad más de 4 s sin alcanzarla, la deja estar 5 s y sigue con lo suyo (antes se iban muy lejos)
    if (t.kind === 'unit') { if (u.chaseOf !== t) { u.chaseOf = t; u.chaseT = 0; } u.chaseT += dt; if (u.chaseT > 4) { u.ign = t; u.ignT = 5; u.chaseT = 0; u.target = acquire(u); u.retarget = 0.3; return; } }
    moveToward(u, t.x, t.y, dt); if (u.atkT < 0.25) u.atkT = 0.25;
  }
}
// NecroLord levanta esqueletos; CyberMarine pide drones del cielo
function summonTick(u, dt) {
  u.sumT -= dt; if (u.sumT > 0) return; u.sumT = u.d.summonCd;
  const back = u.team === 'p' ? 16 : -16, drop = u.d.summonDrop;
  for (let i = 0; i < u.d.summonN; i++) {
    const s = spawnUnit(u.team, u.d.summon, clamp(u.x + (i ? 20 : -20), 24, W - 24), u.y + back);
    s.summon = true; s.labelT = 0;
    if (drop) s.deployT = s.deployMax = 0.6; else { s.rising = true; s.deployT = s.deployMax = 0.5; }
  }
  if (drop) { ring(u.x, u.y + back, 10, 50, 'rgba(34,227,255,.9)', 0.5, 5); addNum(u.x, u.y, topOf(u) + 18, '¡ORBITAL DROP!', '#7df3ff', 15); play('deploy', 0.7); }
  else { ring(u.x, u.y + back, 10, 50, 'rgba(94,242,160,.9)', 0.5, 5); puff(u.x, u.y + back, 10, '#7dffb8', 40, 6, true); addNum(u.x, u.y, topOf(u) + 18, '¡LEVANTAOS!', '#7dffb8', 15); play('summon'); }
}
// onda de área que aturde: Banshee (grito), Medusa (piedra), ChonkCat (se sienta)
function pulseTick(u, dt) {
  u.pulseT -= dt; if (u.pulseT > 0) return;
  const P = u.d.pulse || u.abPulse; const hit = units.filter(o => o.alive && o.team !== u.team && o.deployT <= 0 && !o.jump && !o.immuneCC && dist(o, u) - o.r <= P.r);
  if (!hit.length) { u.pulseT = 0.4; return; }
  for (const o of hit) { o.stunT = Math.max(o.stunT, P.stun); o.stunKind = P.kind; if (P.dmg) hurt(o, P.dmg * dmgMult(u), u, 'aoe'); }
  for (let i = 0; i < 3; i++) parts.push({ type: 'ring', x: u.x, y: u.y, z: 0, r0: 8 + i * 6, r1: P.r * (1 + i * 0.12), color: P.color, life: 0.45 + i * 0.1, max: 0.45 + i * 0.1, lw: 4, ground: true, circ: true });
  if (P.kind === 'stone') for (const o of hit) chips(o.x, o.y, topOf(o) * 0.5, 4, ['#9aa3a0', '#c9cfc6'], 'chip', 3);
  if (P.dmg) { puff(u.x, u.y, 14, '#efe2c4', 80, 8, true); shake(6); }
  addNum(u.x, u.y, topOf(u) + 18, P.text, P.tc, 15); play(P.sfx);
  u.pulseT = P.cd;
}
// MemeLord: cada pocos segundos juega una carta al azar
const VIRAL = { heal: ['¡CARTA: CURA!', '#8cf05a'], stun: ['¡CARTA: ATURDIR!', '#ffe14d'], fire: ['¡CARTA: FUEGO!', '#ff9a3c'], dogs: ['¡CARTA: PERRITOS!', '#ffcf8a'] };
function viralTick(u, dt) {
  u.viralT -= dt; if (u.viralT > 0) return;
  const foes = units.filter(o => o.team !== u.team && targetable(o) && dist(o, u) < 150);
  const fs = structs.find(s => s.alive && s.team !== u.team && edgeDist(u, s) < 120);
  if (!foes.length && !fs) { u.viralT = 0.5; return; }
  const hurtAllies = units.some(a => a.alive && a.team === u.team && a.deployT <= 0 && a.hp < a.maxHp * 0.7 && dist(a, u) < 130);
  let opts = foes.length ? ['stun', 'fire', 'dogs'] : ['fire', 'dogs']; if (hurtAllies) opts.push('heal', 'heal');
  const k = pick(opts);
  parts.push({ type: 'card', x: u.x, y: u.y, z: topOf(u) + 30, k, life: 1.1, max: 1.1 });
  if (k === 'heal') {
    for (const a of units) if (a.alive && a.team === u.team && a.deployT <= 0 && dist(a, u) < 130) { const amt = Math.min(60, a.maxHp - a.hp); a.hp += amt; if (amt >= 4) addNum(a.x + rand(-5, 5), a.y, topOf(a) * 0.75 + 4, '+' + Math.round(amt), '#8cf05a', 13); }
    ring(u.x, u.y, 10, 130, 'rgba(123,224,74,.85)', 0.5, 5, true); play('heal');
  } else if (k === 'stun') {
    for (const o of foes) if (dist(o, u) - o.r < 110) { o.stunT = Math.max(o.stunT, 1.2); o.stunKind = 'daze'; }
    ring(u.x, u.y, 10, 110, 'rgba(255,225,77,.9)', 0.5, 5, true); play('wail');
  } else if (k === 'fire') {
    const tg = targetable(u.target) && dist(u, u.target) < 170 ? u.target : foes[0] || fs;
    const pr = shoot(u, tg, 'fireball', 80 * dmgMult(u), 'aoe'); pr.splash = 55;
  } else {
    for (let i = 0; i < 2; i++) { const s = spawnUnit(u.team, 'suchdog', clamp(u.x + (i ? 18 : -18), 24, W - 24), u.y + (u.team === 'p' ? -14 : 14)); s.summon = true; s.labelT = 0; s.deployT = s.deployMax = 0.45; }
    play('deploy', 0.7);
  }
  addNum(u.x, u.y, topOf(u) + 16, VIRAL[k][0], VIRAL[k][1], 14);
  u.viralT = u.d.viral.cd;
}
// EpicChampion: ¡Team Fight! — los aliados cercanos golpean ya, con +50 %
function teamFightTick(u, dt) {
  u.tfT -= dt; if (u.tfT > 0) return;
  const R = u.d.teamFight.r;
  const engaged = units.some(o => o.team !== u.team && targetable(o) && dist(o, u) < R + 20) || (u.target && u.target.kind === 'struct' && edgeDist(u, u.target) <= u.d.range + 6);
  if (!engaged) { u.tfT = 0.5; return; }
  for (const a of units) if (a.alive && a.team === u.team && a.deployT <= 0 && !a.d.healer && dist(a, u) <= R) { a.atkT = Math.min(a.atkT, 0); a.tfBoost = true; ring(a.x, a.y, 4, a.r * 2, 'rgba(255,203,61,.9)', 0.35, 3); }
  ring(u.x, u.y, 10, R, 'rgba(255,203,61,.95)', 0.5, 6, true); addNum(u.x, u.y, topOf(u) + 20, '¡TEAM FIGHT!', '#ffcb3d', 17); play('horn');
  u.tfT = u.d.teamFight.cd;
}
// HackerKid: deja una torre sin disparar unos segundos
function hackTick(u, dt) {
  u.hackT -= dt; if (u.hackT > 0) return;
  let best = null, bd = u.d.hack.r;
  for (const s of structs) if (s.alive && s.team !== u.team && s.hackedT <= 0) { const d = edgeDist(u, s); if (d < bd) { bd = d; best = s; } }
  if (!best) { u.hackT = 0.5; return; }
  best.hackedT = u.d.hack.t; best.cur = null;
  parts.push({ type: 'beam', x0: u.x, y0: u.y, z0: topOf(u) * 0.6, x1: best.x, y1: best.y, z1: topOf(best) * 0.6, color: '#7be04a', life: 0.4, max: 0.4 });
  addNum(best.x, best.y, topOf(best) + 20, '¡HACKEADO!', '#7be04a', 15); play('hack');
  u.hackT = u.d.hack.cd;
}
// CyberNinja: se teletransporta hacia su objetivo
function blinkTick(u, t, dt) {
  u.blinkT -= dt; if (u.blinkT > 0) return;
  const gap = edgeDist(u, t) - u.d.range;
  if (gap < 25 || gap > u.d.sight + 40 || (u.y < RIVER.y) !== (t.y < RIVER.y)) return;
  const d = dist(u, t) || 1, step = Math.min(u.d.blink.dist, gap + 4);
  const BK = u.d.blink; puff(u.x, u.y, 8, BK.col || '#ff3df0', 40, 5, false, 12);
  u.x += (t.x - u.x) / d * step; u.y += (t.y - u.y) / d * step; u.face = t.x > u.x ? 1 : -1;
  ring(u.x, u.y, 4, 30, BK.ring || 'rgba(34,227,255,.9)', 0.3, 4); play('blink'); if (BK.txt && Math.random() < 0.5) addNum(u.x, u.y, topOf(u) + 16, BK.txt, BK.col, 13);
  u.blinkT = u.d.blink.cd; u.atkT = Math.min(u.atkT, 0.1);
}
// v0.9.13: VikingoPerdido levanta un muro de escudos: barrera dorada para él y sus aliados cercanos
function shieldUpTick(u, dt) {
  u.shUpT = (u.shUpT == null ? 2 : u.shUpT) - dt; if (u.shUpT > 0) return;
  const D = u.d.shieldUp, engaged = units.some(o => o.team !== u.team && targetable(o) && dist(o, u) < D.r + 40) || (u.target && u.target.kind === 'struct' && edgeDist(u, u.target) <= rangeOf(u) + 10);
  if (!engaged) { u.shUpT = 0.5; return; }
  const amt = Math.round(D.amt * (u.mLvl || 1));
  for (const a of units) if (a.alive && a.team === u.team && a.deployT <= 0 && !a.jump && dist(a, u) <= D.r) { a.bshield = Math.max(a.bshield || 0, amt); a.bshT = D.t; ring(a.x, a.y, 4, a.r * 2.2, 'rgba(255,203,61,.9)', 0.35, 3); }
  ring(u.x, u.y, 10, D.r, 'rgba(255,203,61,.95)', 0.5, 6, true); addNum(u.x, u.y, topOf(u) + 20, '¡MURO DE ESCUDOS!', '#ffcb3d', 15); play('shield'); play('horn');
  if (u.team === 'p') chatEv('shieldwall', null, null, 0.35, 15);
  u.shUpT = D.cd;
}
// v0.9.13: LaDirectora grita ¡ACCIÓN!: sus aliados cercanos atacan más rápido y corren más durante unos segundos
function actionTick(u, dt) {
  u.actCd = (u.actCd == null ? 2.5 : u.actCd) - dt; if (u.actCd > 0) return;
  const A = u.d.action, engaged = units.some(o => o.team !== u.team && targetable(o) && dist(o, u) < A.r + 60) || (u.target && u.target.kind === 'struct' && edgeDist(u, u.target) <= rangeOf(u) + 10);
  if (!engaged) { u.actCd = 0.5; return; }
  for (const a of units) if (a.alive && a.team === u.team && a.deployT <= 0 && dist(a, u) <= A.r) { a.actT = A.t; ring(a.x, a.y, 4, a.r * 2, 'rgba(255,154,184,.9)', 0.35, 3); }
  ring(u.x, u.y, 10, A.r, 'rgba(255,154,184,.95)', 0.5, 6, true); addNum(u.x, u.y, topOf(u) + 20, '¡ACCIÓN!', '#ff9ab8', 17);
  parts.push({ type: 'clapper', x: u.x, y: u.y, z: topOf(u) + 36, life: 0.9, max: 0.9 }); play('card');
  if (u.team === 'p') chatEv('action', null, null, 0.35, 15);
  u.actCd = A.cd;
}
// v0.9.13: LicenciaBot: su licencia caduca y desaparece (no cuenta como baja)
function expireUnit(u) {
  u.alive = false; u.hp = 0;
  parts.push({ type: 'stamp', x: u.x, y: u.y, z: topOf(u) + 12, txt: 'CADUCADA', color: '#ff3348', life: 1.1, max: 1.1 });
  puff(u.x, u.y, 10, '#c7d2fe', 50, 7, false, topOf(u) * 0.4); play('poof');
  if (u.team === 'e') chatEv('expire', null, null, 0.6, 12);
}
// TrollBot: se ríe de vez en cuando (la provocación está en acquire y en las torres)
function tauntTick(u, dt) {
  u.tauntT -= dt; if (u.tauntT > 0) return;
  if (!units.some(o => o.team !== u.team && targetable(o) && dist(o, u) < u.d.taunt.r)) { u.tauntT = 0.6; return; }
  addNum(u.x, u.y, topOf(u) + 16, '¡JAJAJA!', '#7be04a', 14); ring(u.x, u.y, 8, u.d.taunt.r, 'rgba(123,224,74,.6)', 0.5, 3, true); play('laugh');
  u.tauntT = 6;
}
const healFwd = u => (u.team === 'p' ? -Math.PI / 2 : Math.PI / 2);   // hacia el rival
function healAim(u, dt) {   // v0.9.14: el cono apunta a la unidad que sigue; si va sola, hacia delante
  const f = u.follow && u.follow.alive ? u.follow : null;
  const ta = f && dist(f, u) > 8 ? Math.atan2(f.y - u.y, f.x - u.x) : healFwd(u);
  if (u.healAng === undefined) { u.healAng = ta; return; }
  let d = ta - u.healAng; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
  u.healAng += d * Math.min(1, dt * 6);
}
// ¿está dentro del cono de curación? (delante, a menos de su alcance; ni ella misma ni lo que tiene al lado)
function inHealCone(u, a) {
  const dx = a.x - u.x, dy = a.y - u.y, d = Math.hypot(dx, dy); if (d < 4 || d > u.d.healR + a.r * 0.5) return false;
  const an = u.healAng === undefined ? healFwd(u) : u.healAng;
  return (dx * Math.cos(an) + dy * Math.sin(an)) / d >= HEAL_COS;
}
function healPulse(u, dt) {
  u.healT = (u.healT === undefined ? 0.6 : u.healT) - dt; if (u.healT > 0) return;
  u.healT = u.d.healCd; let any = false;
  for (const a of units) {
    if (a === u || !a.alive || a.team !== u.team || a.deployT > 0 || a.jump || a.hp >= a.maxHp || !inHealCone(u, a)) continue;
    const amt = Math.min(u.d.heal, a.maxHp - a.hp); a.hp += amt; any = true;
    // v0.9.9: que se vea a quién cura: rayo verde, círculo y «+N» más grande
    if (a !== u) parts.push({ type: 'beam', x0: u.x, y0: u.y, z0: topOf(u) * 0.6, x1: a.x, y1: a.y, z1: topOf(a) * 0.5, color: '#8cf05a', life: 0.5, max: 0.5 });
    ring(a.x, a.y, 4, a.r * 2.2, 'rgba(140,240,90,.9)', 0.4, 3);
    if (amt >= 1) addNum(a.x + rand(-5, 5), a.y, topOf(a) * 0.75 + 4, '+' + Math.round(amt), '#8cf05a', 16);
  }
  if (!any) return;
  if (u.team === 'p') chatEv('heal', null, null, 0.18, 15);
  parts.push({ type: 'cone', x: u.x, y: u.y, z: 0, a: u.healAng === undefined ? healFwd(u) : u.healAng, r0: 14, r1: u.d.healR, color: 'rgba(123,224,74,.85)', life: 0.5, max: 0.5, lw: 4, ground: true });
  for (let i = 0; i < 4; i++) parts.push({ type: 'plus', x: u.x + rand(-22, 22), y: u.y + rand(-6, 6), z: rand(10, 30), vx: 0, vy: 0, vz: 26, g: 0, life: 0.8, max: 0.8 });
  flashAt(u.x, u.y, 12, 40, '120,255,140', 0.3);
  play('heal');
}
// v0.9.9: la curandera va detrás de sus aliados (primero los heridos y los cercanos, nunca delante del grupo)
// v0.9.14: a más distancia (HEAL_BACK) y recordando a quién sigue, para apuntarle el cono
// y, si está sola, espera delante de su torre en vez de ir a por las del enemigo
function followAlly(u, dt) {
  const home = u.team === 'p' ? 1 : -1; let best = null, bs = -Infinity;
  for (const a of units) {
    if (a === u || !a.alive || a.team !== u.team || a.deployT > 0 || a.d.healer || a.d.kamikaze || a.jump || dist(a, u) > 230) continue;   // v0.9.15: solo aliados cercanos
    const sc = (1 - a.hp / a.maxHp) * 150 - dist(a, u) * 0.5 - Math.abs(a.x - u.x) * 0.3 + a.y * home * 0.2 - (a.d.buildings ? 40 : 0);
    if (sc > bs) { bs = sc; best = a; }
  }
  u.follow = best;
  if (best) {
    const tx = clamp(best.x, 24, W - 24), ty = clamp(best.y + home * HEAL_BACK, BOUNDS.y0, BOUNDS.y1);
    if (Math.hypot(tx - u.x, ty - u.y) > 10) moveToward(u, tx, ty, dt); else { u.moving = false; if (Math.abs(best.x - u.x) > 3) u.face = best.x > u.x ? 1 : -1; }
    return true;
  }
  if (units.some(o => o.alive && o.team !== u.team && targetable(o) && dist(o, u) < u.d.sight)) return false;   // la atacan: se defiende
  const wx = BRIDGES[u.x < W / 2 ? 0 : 1], wy = u.team === 'p' ? ZONE.p.y0 + 75 : ZONE.e.y1 - 75;
  if (Math.hypot(wx - u.x, wy - u.y) > 12) moveToward(u, wx, wy, dt); else u.moving = false;
  return true;
}
function bunnyJump(u, dt) {
  if (u.jump) {
    const j = u.jump; j.t += dt; const k = Math.min(1, j.t / j.dur);
    u.x = lerp(j.x0, j.x1, k); u.y = lerp(j.y0, j.y1, k); u.z = Math.sin(Math.PI * k) * j.h; u.spin = k * Math.PI * 2 * u.face;
    if (k >= 1) {
      u.jump = null; u.z = 0; u.spin = 0; u.moving = false;
      const jd = u.d.jumpDmg * dmgMult(u);
      for (const o of units) if (o.alive && o.team !== u.team && Math.hypot(o.x - u.x, o.y - u.y) - o.r <= u.d.jumpR) { const d = Math.hypot(o.x - u.x, o.y - u.y) || 1; o.x += (o.x - u.x) / d * 16; o.y += (o.y - u.y) / d * 16; hurt(o, jd, u, 'aoe'); }
      for (const s of structs) if (s.alive && s.team !== u.team && Math.hypot(s.x - u.x, s.y - u.y) - s.r <= u.d.jumpR) hurt(s, jd, u, 'aoe');
      ring(u.x, u.y, 10, u.d.jumpR * 1.15, 'rgba(212,60,255,.95)', 0.45, 7); ring(u.x, u.y, 6, u.d.jumpR * 0.7, 'rgba(255,255,255,.9)', 0.3, 4);
      puff(u.x, u.y, 18, '#e9dcc0', 90, 9, true); chips(u.x, u.y, 4, 10, ['#6eb646', '#8b5530', '#d9b77e'], 'chip', 4);
      addNum(u.x, u.y, 90, '¡CHAOS JUMP!', '#f3a6ff', 20); flashAt(u.x, u.y, 10, 95, '212,60,255', 0.35); screenFlash(0.1);
      shake(9); play('slam');
    }
    return true;
  }
  u.jumpCd -= dt;
  if (u.jumpCd > 0) return false;
  let best = null, bestScore = 0;
  for (const o of units) {
    if (o.team === u.team || !targetable(o)) continue;
    const d = dist(u, o); if (d > u.d.jumpRange) continue;
    let sc = 0.001 * (u.d.jumpRange - d);
    for (const q of units) if (q.alive && q.team !== u.team && Math.hypot(q.x - o.x, q.y - o.y) < u.d.jumpR) sc += 1;
    if (sc > bestScore) { bestScore = sc; best = o; }
  }
  if (!best) for (const s of structs) if (s.alive && s.team !== u.team && edgeDist(u, s) < 90) best = s;
  if (!best) { u.jumpCd = 0.5; return false; }
  const ang = Math.atan2(u.y - best.y, u.x - best.x); const off = best.kind === 'struct' ? best.r + u.r - 4 : 0;
  u.jump = { x0: u.x, y0: u.y, x1: best.x + Math.cos(ang) * off, y1: best.y + Math.sin(ang) * off, t: 0, dur: 0.7, h: 95 };
  u.face = u.jump.x1 > u.x ? 1 : -1; u.jumpCd = u.d.jumpCd * (u.jumpCdM || 1); play('jump');
  return true;
}
function updateStruct(s, dt) {
  s.hitT = Math.max(0, s.hitT - dt); s.recoil = Math.max(0, s.recoil - dt); s.castT = Math.max(0, s.castT - dt);
  if (!s.alive) { if (s.hidden) return; s.smokeT -= dt; if (s.smokeT <= 0) { s.smokeT = rand(0.25, 0.5); parts.push({ type: 'smoke', x: s.x + rand(-12, 12), y: s.y, z: rand(6, 16), vx: rand(-4, 4), vy: 0, vz: rand(14, 24), g: 0, life: rand(1.2, 1.8), max: 1.8, size: rand(5, 10) }); } return; }
  if (s.hackedT > 0) { s.hackedT -= dt; return; }
  s.atkT -= dt; if (s.atkT > 0) return;
  const seen = u => targetable(u) && !(u.olvT > 0);   // v0.9.13: Nostalgia
  let best = seen(s.cur) && edgeDist(s, s.cur) <= s.range ? s.cur : null;
  if (!best) { let bd = Infinity; for (const u of units) if (u.team !== s.team && seen(u)) { const d = edgeDist(s, u); if (d <= s.range && d < bd) { bd = d; best = u; } } }
  for (const u of units) if (u.team !== s.team && u.d.taunt && seen(u) && edgeDist(s, u) <= s.range) { best = u; break; }
  if (!best) return;
  s.cur = best; s.atkT = s.cd; s.recoil = 0.15;
  shoot(s, best, SKINS[s.skin].shot[s.role === 'tower' ? 0 : 1], s.dmg);
}
function updateBoss(dt) {
  const b = bases.e; if (!b.alive || !G.bossOn) return;
  const D = G.diffCfg, nm = G.bossName;
  const ph = ownerOf() === 'phony', own = ownerName();
  if (!S.e.phase2 && b.hp < b.maxHp * 0.5) { S.e.phase2 = true; S.e.bossT = Math.min(S.e.bossT, 3); banner(ph ? 'FASE 2: SUBIDA DE PRECIOS' : 'FASE 2: DESPIDOS MASIVOS', `${nm} está a media vida y se ha enfadado`, 'enemy'); play('womp'); chatBurst('phase2', 2); }
  if (b.hackedT > 0) return;   // hackeado: tampoco lanza habilidades
  S.e.bossT -= dt; if (S.e.bossT > 0) return;
  const near = units.filter(u => u.alive && u.team === 'p' && u.y < RIVER.y + 30 && !u.jump && u.deployT <= 0 && !u.immuneBoss);
  const all = units.filter(u => u.alive && u.team === 'p' && !u.jump && u.deployT <= 0 && !u.immuneBoss);
  let cast = null;
  if (S.e.phase2 && S.e.nextDespido && all.length) cast = 'despido';
  else if (near.length) cast = 'entierro';
  else if (S.e.phase2 && all.length) cast = 'despido';
  if (!cast) { S.e.bossT = 1; return; }
  b.castT = 0.9; ring(b.x, b.y, 20, 260, 'rgba(255,51,72,.8)', 0.7, 6); if (cast === 'entierro') chatEv('stun', null, null, 0.75, 6); else if (Math.random() < 0.6) chatSay('boss');
  if (cast === 'entierro') {
    for (const u of near) { u.stunT = D.stun; u.stunKind = ph ? 'net' : 'ip'; puff(u.x, u.y, 6, '#9fb3d6', 30, 5); }
    if (ph) banner(G.efac === 'phony' ? '¡SERVIDORES EN MANTENIMIENTO!' : 'ORDEN DE PHONY', `${nm} ha dejado sin conexión a tus unidades de su lado`, 'enemy');
    else banner(G.efac === 'microblizz' ? '¡JUEGO CERRADO!' : 'ORDEN DE MICROBLIZZ', `${nm} ha congelado a tus unidades de su lado`, 'enemy');
    play('womp');
  } else {
    for (const u of all) parts.push({ type: 'env', k: ph ? 'lic' : 'env', tgt: u, x: u.x, y: u.y, z: 170, t: rand(-0.25, 0), dur: 0.6, dmg: D.despido, life: 2, max: 2, rot: rand(-0.4, 0.4) });
    if (ph) banner('LICENCIAS REVOCADAS', G.efac === 'phony' ? 'Phony borra la licencia de todas tus unidades' : 'Phony le obliga a revocar la licencia de todas tus unidades', 'enemy');
    else banner('DESPIDOS MASIVOS', G.efac === 'microblizz' ? 'Carta de despido para todas tus unidades' : `${own} le obliga a despedir a todas tus unidades`, 'enemy');
    play('despido');
  }
  S.e.nextDespido = S.e.phase2 ? cast !== 'despido' : true;
  S.e.bossT = S.e.phase2 ? D.bossCd * 0.8 : D.bossCd;
}
function separate() {
  const n = units.length;
  for (let i = 0; i < n; i++) {
    const a = units[i]; if (!a.alive || a.jump) continue;
    for (let j = i + 1; j < n; j++) {
      const b = units[j]; if (!b.alive || b.jump) continue;
      let dx = b.x - a.x, dy = b.y - a.y; const min = (a.r + b.r) * 0.9;
      if (dx > min || dx < -min || dy > min || dy < -min) continue;
      let d = Math.hypot(dx, dy); if (d >= min) continue;
      if (d < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d = Math.hypot(dx, dy); }
      const push = (min - d) * 0.5; const ma = a.r * a.r, mb = b.r * b.r; const wa = mb / (ma + mb), wb = ma / (ma + mb);
      a.x -= (dx / d) * push * wa; a.y -= (dy / d) * push * wa; b.x += (dx / d) * push * wb; b.y += (dy / d) * push * wb;
    }
    for (const s of structs) { if (!s.alive) continue; const dx = a.x - s.x, dy = a.y - s.y; const d = Math.hypot(dx, dy) || 0.01; const min = a.r + s.r * 0.82; if (d < min) { a.x = s.x + (dx / d) * min; a.y = s.y + (dy / d) * min; } }
  }
}
function constrain(u) {
  u.x = clamp(u.x, BOUNDS.x0 + u.r * 0.5, BOUNDS.x1 - u.r * 0.5); u.y = clamp(u.y, BOUNDS.y0, BOUNDS.y1);
  const m = u.r * 0.3;
  if (u.y > RIVER.top - m && u.y < RIVER.bottom + m) {
    const bx = nearestBridge(u.x); const lim = BRIDGE_HALF - u.r * 0.55;
    if (Math.abs(u.x - bx) <= BRIDGE_HALF + 3) u.x = clamp(u.x, bx - lim, bx + lim);
    else u.y = u.y < RIVER.y ? RIVER.top - m : RIVER.bottom + m;
  }
}
/* ---------- enemy brain (also drives your side in autoplay tests) ---------- */
function chooseLane(team) {
  const t = towers[other(team)];
  if (!t[0].alive && t[1].alive) return 0; if (!t[1].alive && t[0].alive) return 1;
  const a = t[0].alive ? t[0].hp / t[0].maxHp : 0, b = t[1].alive ? t[1].hp / t[1].maxHp : 0;
  if (Math.abs(a - b) > 0.15) return a < b ? 0 : 1;
  return Math.random() < 0.5 ? 0 : 1;
}
function aiUpdate(team, dt) {
  const A = AI[team]; A.think -= dt; if (A.think > 0) return;
  const D = G.diffCfg; A.think = team === 'e' ? rand(D.think[0], D.think[1]) : rand(0.6, 1.2);
  const me = S[team], foe = other(team); const cards = team === 'e' ? CFG.enemyCards : CFG.cards; const zone = ZONE[team];
  if (aiSpell(team, me.deck.filter(isSpell).map(k => ({ k, slot: -2 })), (c, x, y) => doDeploy(team, c.k, x, y))) return;   // v0.9.15
  const can = k => me.deck.includes(k) && me.chaos >= cards[k].cost && canDeploy(team, k);
  const myHalf = u => (team === 'e' ? u.y < RIVER.y + 24 : u.y > RIVER.y - 24);
  const myBase = bases[team];
  const threats = units.filter(u => u.alive && u.team === foe && u.deployT <= 0 && u.stealthT <= 0 && myHalf(u)).sort((a, b) => dist(a, myBase) - dist(b, myBase));
  if (threats.length) {
    const t = threats[0];
    const mine = units.filter(u => u.alive && u.team === team && !u.d.buildings && dist(u, t) < 130).length;
    if (mine < threats.length + 1) {
      const pref = team === 'e' ? (t.hp > 300 ? ['starbot', 'becario'] : ['becario', 'starbot']) : ['squirrel', 'fox', 'bunny'];
      const k = pref.find(can);
      if (k) { const x = clamp(t.x + rand(-20, 20), 34, W - 34), y = clamp(t.y + (team === 'e' ? -70 : 70), zone.y0 + 8, zone.y1 - 8); doDeploy(team, k, x, y); }
      return;
    }
  }
  if (!A.plan) {
    const plans = team === 'e' ? [['fallen', 'starbot'], ['becario', 'starbot'], ['fallen', 'becario'], ['starbot', 'becario', 'becario']] : [['bunny', 'squirrel'], ['fox', 'squirrel'], ['squirrel', 'fox', 'squirrel']];
    const ok = plans.map(pl => pl.filter(k => me.deck.includes(k))).filter(pl => pl.length);
    A.plan = { seq: (ok.length ? pick(ok) : [me.deck[0]]).slice(), lane: chooseLane(team), wait: rand(6, 9.5), started: false };
  }
  const P = A.plan; const k = P.seq[0];
  if (!canDeploy(team, k)) { P.seq.shift(); if (!P.seq.length) A.plan = null; return; }
  const total = P.seq.reduce((a, c) => a + cards[c].cost, 0);
  if (me.chaos < cards[k].cost) return;
  if (P.started || me.chaos >= Math.min(P.wait, total) || me.chaos >= CFG.chaosMax - 0.3) {
    const bx = BRIDGES[P.lane]; const tank = k === 'fallen' || k === 'bunny';
    const front = team === 'e' ? 330 : 495, back = team === 'e' ? 296 : 530;
    doDeploy(team, k, clamp(bx + rand(-16, 16), 34, W - 34), P.started && !tank ? back : front);
    P.started = true; P.seq.shift(); if (!P.seq.length) A.plan = null;
  }
}
// IA por papeles (tanque, enjambre, distancia...): juega cualquier mazo. La usan los rivales de facción y el modo automático de pruebas
function aiGeneric(team, dt) {
  const A = AI[team]; A.think -= dt; if (A.think > 0) return;
  const D = G.diffCfg; A.think = team === 'e' ? rand(D.think[0], D.think[1]) : rand(0.6, 1.2);
  const me = S[team], foe = other(team), F = FACTIONS[facOf(team)], zone = ZONE[team], dir = team === 'p' ? 1 : -1;
  const avail = team === 'p' ? me.hand.map((k, i) => ({ k, slot: i })) : shuffle(me.deck.filter(k => !isLeader(k)).map(k => ({ k, slot: -2 })));
  if (F.leader && canDeploy(team, F.leader)) avail.push({ k: F.leader, slot: -1 });
  const find = roles => { for (const role of roles) { const c = avail.find(a => ROLES[a.k] === role && me.chaos >= cardDef(a.k).cost); if (c) return c; } return null; };
  const go = (c, x, y) => (team === 'p' ? playerPlay(c.slot, c.k, x, y) : doDeploy(team, c.k, x, y));
  if (aiSpell(team, avail, go)) return;   // v0.9.15: hechizos (sobre todo contra tus sanadores)
  const myHalf = u => (team === 'e' ? u.y < RIVER.y + 24 : u.y > RIVER.y - 24);
  const bh = team === 'e' && G.mode === 'boss' && !!G.bossDiff && G.bossDiff !== 'n';
  const hard = bh || (team === 'e' && G.mode === 'camp' && !!G.cdiff && G.cdiff !== 'n'), myth = hard && (bh ? G.bossDiff === 'm' : G.cdiff === 'm');
  const threats = units.filter(u => u.alive && u.team === foe && u.deployT <= 0 && u.stealthT <= 0 && myHalf(u)).sort((a, b) => dist(a, bases[team]) - dist(b, bases[team]));
  if (threats.length) {
    // defiende si la amenaza está cerca de una torre (o le sobra CAOS); si no, ahorra para atacar
    const t = threats[0];
    const foeHp = threats.filter(o => dist(o, t) < 120).reduce((a, o) => a + o.hp, 0);
    const myHp = units.filter(u => u.alive && u.team === team && !u.d.buildings && !u.d.healer && dist(u, t) < 140).reduce((a, u) => a + u.hp, 0);
    const close = structs.some(s => s.alive && s.team === team && dist(s, t) < 170);
    if (myHp < foeHp * (hard ? 1.6 : 1.2) && (close || me.chaos >= (hard ? 6 : 9))) { const c = find(['ranged', 'swarm', 'control', 'assassin', 'tank', 'support']); if (c) go(c, clamp(t.x + rand(-20, 20), 34, W - 34), clamp(t.y + 70 * dir, zone.y0 + 8, zone.y1 - 8)); return; }
  }
  if (!A.plan) A.plan = { lane: chooseLane(team), n: 0 };
  const P = A.plan; if (P.n === 0 && me.chaos < (hard ? 6.5 : 8)) return;
  const c = P.n === 0 ? find(['tank', 'assassin', 'swarm']) : find(['support', 'ranged', 'control', 'buster', 'swarm', 'assassin']);
  if (!c) { if (P.n > 0 && me.chaos >= 9) A.plan = null; return; }
  const front = team === 'p' ? 495 : 330, back = team === 'p' ? 530 : 296;
  go(c, clamp(BRIDGES[P.lane] + rand(-16, 16), 34, W - 34), P.n === 0 ? front : back);
  P.n++; if (P.n >= (myth ? 4 : 3)) A.plan = null;
}
/* ---------- match flow ---------- */
function timeUp() {
  if (G.mode === 'boss') { endMatch('p', 'score'); return; }
  const pc = S.p.crowns, ec = S.e.crowns; let w = null;
  if (pc !== ec) w = pc > ec ? 'p' : 'e';
  else { const hp = t => structs.filter(s => s.team === t).reduce((a, s) => a + Math.max(0, s.hp) / s.maxHp, 0); const a = hp('p'), b = hp('e'); if (Math.abs(a - b) > 0.01) w = a > b ? 'p' : 'e'; }
  endMatch(w, pc !== ec ? 'crowns' : w ? 'hp' : 'draw');
}
function endMatch(w, reason) {
  if (G.state !== 'play') return;
  G.state = 'ending'; G.winner = w; G.endReason = reason; G.endT = 1.9; G.slowmo = 0.35;
  input.card = null; input.dragging = false; input.selected = null; input.ghost = null; hideTut(); $('#tut-tip').hidden = true;
  if (w === 'p') { play('win'); for (let i = 0; i < 140; i++) parts.push({ type: 'conf', x: rand(0, W), y: rand(80, 780), z: rand(250, 700), vx: rand(-20, 20), vy: 0, vz: -rand(90, 160), g: 0, rot: rand(0, 6), vr: rand(-8, 8), life: 6, max: 6, color: pick(['#ff7a1a', '#ffcb3d', '#d43cff', '#63cfe0', '#ffffff', '#7be04a']) }); }
  else if (w === 'e') play('lose'); else play('tick');
  chatBurst(w === 'e' ? 'lose' : 'win', 3);
}
function updateGame(dt) {
  if (G.state === 'play') {
    G.time -= dt;
    if (!G.double && G.time <= CFG.doubleAt) { G.double = true; $('#x2').hidden = false; banner('¡CAOS x2!', 'Último minuto: el CAOS se recarga el doble de rápido', 'chaos'); play('go'); chatSay('x2'); }
    chatTick(dt); chatWatch(dt);
    const rate = (G.double ? 2 : 1) / CFG.chaosEvery;
    S.p.chaos = Math.min(CFG.chaosMax, S.p.chaos + dt * rate * (G.pInc || 1));
    S.e.chaos = Math.min(CFG.chaosMax, S.e.chaos + dt * rate * G.diffCfg.aiIncome);
    for (const t of ['p', 'e']) if (S[t].leaderCd > 0) S[t].leaderCd = Math.max(0, S[t].leaderCd - dt);
    if (G.classicAI) aiUpdate('e', dt); else aiGeneric('e', dt);
    if (G.efac === 'phony') {   // v0.9.13: cada 20 s Phony te cobra la suscripción
      const PS = CFG.passives.phony; if (S.e.subT == null) S.e.subT = PS.every;
      S.e.subT -= dt;
      if (S.e.subT <= 0) {
        S.e.subT = PS.every; const take = Math.min(S.p.chaos, PS.take); S.p.chaos -= take; S.e.chaos = Math.min(CFG.chaosMax, S.e.chaos + PS.gain);
        const b = bases.p; addNum(b.x, b.y, TOPS[b.skin + '_base'] + 26, `SUSCRIPCIÓN: -${fmtV(rnd(take, 1))} CAOS`, '#ffcb3d', 14); play('card');
        if (!G.subShown) { G.subShown = true; banner('SUSCRIPCIÓN OBLIGATORIA', 'Pasiva de Phony: cada 20 s te cobra 0,5 de CAOS', 'enemy'); } else chatEv('sub', null, null, 0.5, 30);
      }
    }
    if (G.autoplay) aiGeneric('p', dt);
    updateBoss(dt);
    if (G.time <= 0) { G.time = 0; timeUp(); }
  }
  for (const r of revives) {
    r.t -= dt; if (r.t > 0) continue;
    const v = spawnUnit(r.team, r.type, r.x, r.y);
    v.hp = Math.round(v.maxHp * (r.frac || CFG.passives.nomuertos.hpFrac)); v.revived = true; v.rising = true; v.deployT = v.deployMax = 0.5; v.face = r.face; v.labelT = 0;
    if (r.seq) { const PP = CFG.passives.pop; v.sequel = true; v.mScale *= PP.scale; v.r *= PP.scale; v.maxHp = v.hp = Math.max(1, Math.round(v.maxHp * PP.hp)); v.labelT = 2.2; }
    const rgb = r.rgb || '94,242,160';
    ring(r.x, r.y, 8, 46, `rgba(${rgb},.9)`, 0.5, 5); puff(r.x, r.y, 10, r.col || '#7dffb8', 40, 6, true);
    addNum(r.x, r.y, TYPES[r.type].top + 16, r.txt || '¡RENACE!', r.col || '#7dffb8', 15); play(r.seq ? 'card' : 'revive'); r.done = true;
    if (r.team === 'p') chatEv(r.seq ? 'sequel' : 'revive', null, null, 0.5, 12);
  }
  if (revives.length) revives = revives.filter(r => !r.done);
  updatePassives();
  for (const u of units) if (u.alive) updateUnit(u, dt);
  for (const s of structs) updateStruct(s, dt);
  updateProjs(dt);
  updateSpells(dt);   // v0.9.15
  separate();
  for (const u of units) if (u.alive && !u.jump) constrain(u);
  units = units.filter(u => u.alive);
}
function updateParts(dt) {
  for (const p of parts) {
    p.life -= dt;
    if (p.type === 'env') {
      p.t += dt; const tg = p.tgt; if (tg.alive) { p.x = tg.x; p.y = tg.y; }
      const k = clamp(p.t / p.dur, 0, 1); p.z = lerp(170, TYPES[tg.type].top * 0.8, k * k);
      if (k >= 1) { p.life = 0; if (tg.alive && (G.state === 'play' || G.state === 'ending')) hurt(tg, p.dmg, null, 'boss'); puff(p.x, p.y, 5, '#ffffff', 30, 4, false, p.z); }
      continue;
    }
    if (p.vx !== undefined) { p.x += p.vx * dt; p.y += (p.vy || 0) * dt; }
    if (p.vz !== undefined) { p.vz -= (p.g || 0) * dt; p.z += p.vz * dt; if (p.z < 0) { if (p.type === 'conf') p.life = 0; else if (p.g) { p.z = 0; p.vz *= -0.3; p.vx *= 0.5; p.vy *= 0.5; } else p.z = 0; } }
    if (p.vr) p.rot += p.vr * dt;
  }
  parts = parts.filter(p => p.life > 0);
  if (parts.length > 700) parts.splice(0, parts.length - 700);
  for (const n of nums) { n.life -= dt; n.z += n.vz * dt; n.vz *= Math.pow(0.05, dt); }
  nums = nums.filter(n => n.life > 0);
}
const FUR = { bunny: ['#f7f3ff', '#ffb3cf', '#ff7a1a'], fox: ['#e8702a', '#fff4e6', '#7b2cbf'], squirrel: ['#b14d1c', '#f6d7a7'], beaver: ['#8a5a33', '#ffcb3d'], meercat: ['#d9b07a', '#ffffff'], junkcoon: ['#8d8f99', '#2b2d3a'], mechavaca: ['#ff8fc8', '#9fe3ff', '#3b3d47'], vaca: ['#ffffff', '#2b2d3a', '#ffb3cf'], necrolord: ['#3b2457', '#efeadf', '#5ef2d0'], skeleton: ['#efeadf'], zombie: ['#8fbf6a', '#bcd3e8'], ghostmage: ['#bef0eb', '#6a3fb0'], banshee: ['#e3def5', '#ffffff'], skullknight: ['#4a5677', '#efeadf', '#9fe3ff'], stitchbrute: ['#9cb88a', '#c6a4c9'],
  twitchking: ['#8b5cf6', '#e11d74', '#ffcb3d'], subswarm: ['#8b5cf6', '#22d3ee'], hypebeast: ['#f97316', '#111827'], viralbot: ['#4b4b66', '#8b5cf6', '#ff3348'], snackmom: ['#60a5fa', '#fde68a'], hypetrain: ['#8b5cf6', '#ffcb3d', '#2b2d3a'], banhammer: ['#16a34a', '#6b7280'],
  epicchampion: ['#facc15', '#2563eb', '#ef4444'], cupidarcher: ['#fbcfe8', '#ffffff', '#fcd34d'], hoplite: ['#d97706', '#dc2626'], shieldmaiden: ['#9ca3af', '#a16207', '#fcd34d'], thundergod: ['#f5f5f4', '#ffe14d'], medusa: ['#86efac', '#a855f7'], minotaur: ['#92400e', '#d1d5db'],
  cybermarine: ['#4b5563', '#22e3ff', '#0e7490'], drone: ['#4b5563', '#22e3ff'], nanobot: ['#cbd5e1', '#22e3ff'], cyberninja: ['#1f2937', '#ff3df0', '#22e3ff'], techdroid: ['#eef2f7', '#22d3ee'], hackerkid: ['#374151', '#a3ff7a'], neonsniper: ['#312e81', '#ff3df0'], siegemech: ['#6b7280', '#ffcb3d', '#22e3ff'],
  memelord: ['#7c3aed', '#16a34a', '#ffcb3d'], suchdog: ['#e8a04a', '#fff7ea'], gifblaster: ['#f97316', '#e5e7eb', '#8b5cf6'], synthcat: ['#f59e0b', '#ec4899'], trollbot: ['#6b7280', '#9ca3af', '#ff3348'], stonks: ['#1e3a8a', '#dc2626', '#16a34a'], chonkcat: ['#f59e0b', '#fde7c0'],
  progamer: ['#111827', '#22c55e', '#7c3aed'], noobs: ['#f97316', '#3b82f6'], speedrunner: ['#16a34a', '#dc2626'], modder: ['#0d9488', '#57534e'], coleccionista: ['#f59e0b', '#e5e7eb', '#2563eb'], ragequitter: ['#4b5563', '#f87171'], recreativa: ['#7c3aed', '#ffe14d', '#7be04a'],
  vikingo: ['#7c4a1e', '#e2572b', '#aab4c4'], swarmbug: ['#7c3aed', '#c4b5fd'], vikingsquad: ['#3b5b8a', '#f2c94c'], retromarine: ['#4d7c0f', '#fb923c'], ghostagent: ['#374151', '#22e3ff'], rockracer: ['#dc2626', '#ffffff', '#1f2937'], titanbeta: ['#78716c', '#ffe14d', '#65a30d'],
  directora: ['#d97706', '#dc2626', '#1f2937'], extras: ['#9ca3af', '#d6b07a'], doble: ['#f5f5f4', '#dc2626'], detective: ['#c8a97e', '#5b4636'], heroe: ['#2563eb', '#dc2626', '#facc15'], spoiler: ['#16a34a', '#f5f0e1'], kaiju: ['#8b5cf6', '#f472b6', '#facc15'] , huron: ["#9a6634", "#f3dfc0", "#e63946"], sombra: ["#3b1d5c", "#7dffb8"], hater: ["#6b7280", "#f1c9a5", "#e63946"], arpia: ["#9a6634", "#4a2f6b", "#ffb04f"], dron: ["#334155", "#ff3348", "#22e3ff"], clickbait: ["#ffe14d", "#ff3348", "#fff6ea"], campero: ["#65a30d", "#3f6212", "#a3e635"], espia: ["#c8a46e", "#4b5563", "#111827"], paparazzi: ["#78716c", "#e63946", "#ffe14d"] };
const BIG = ['mechavaca', 'stitchbrute', 'banhammer', 'minotaur', 'siegemech', 'chonkcat', 'hypetrain', 'recreativa', 'titanbeta', 'kaiju'];
const CORP_BIG = ['fallen', 'parchebot', 'cobradlc', 'servidorbot', 'remasterbot'];
function deathFx(u, src) {
  const top = topOf(u);
  if (SPR[u.type]) parts.push({ type: 'body', key: u.type, x: u.x, y: u.y, face: u.face || 1, ms: (u.mScale || 1) * (u.shrinkT > 0 ? u.shrinkF || 0.6 : 1), cor: !!u.corrupt, life: 0.6, max: 0.6, ground: true });   // v0.9.15
  if (!isCorp(facOf(u.team))) {
    if (u.team === 'e') parts.push({ type: 'stamp', x: u.x, y: u.y, z: top + 12, txt: src && src.type === 'banhammer' ? 'BANEADO' : 'LIBERADO', color: '#7c3aed', life: 0.9, max: 0.9 });
    puff(u.x, u.y, 10, '#ffffff', 60, 8, false, top * 0.4); flashAt(u.x, u.y, top * 0.5, BIG.includes(u.type) ? 64 : 34, '255,255,255', 0.28);
    const fur = FUR[u.type] || ['#ffffff'];
    chips(u.x, u.y, top * 0.5, BIG.includes(u.type) ? 14 : 6, fur, 'chip', BIG.includes(u.type) ? 5 : 3.5);
    parts.push({ type: 'ghost', x: u.x, y: u.y, z: top * 0.6, vz: 30, life: 1.4, max: 1.4 });
    play('poof');
  } else {
    const ph = facOf(u.team) === 'phony', big = CORP_BIG.includes(u.type);
    sparks(u.x, u.y, top * 0.5, 10, '#ffd34d'); flashAt(u.x, u.y, top * 0.5, big ? 60 : 34, '255,200,80', 0.28);
    chips(u.x, u.y, top * 0.5, big ? 8 : 4, ['#9aa5ba'], 'gear', 4);
    if (ph) chips(u.x, u.y, top * 0.5, big ? 8 : 4, ['#ffcb3d', '#e5e7eb'], 'chip', 3.5);   // monedas y discos
    puff(u.x, u.y, 8, '#9aa3b2', 50, 7, false, top * 0.4);
    parts.push({ type: 'stamp', x: u.x, y: u.y, z: top + 12, txt: src && src.type === 'banhammer' ? 'BANEADO' : ph ? 'CANCELADO' : 'DESPEDIDO', color: '#ff3348', life: 0.9, max: 0.9 });
    play('clank');
  }
}
function structDeathFx(s) {
  const top = TOPS[s.skin + '_' + s.role];
  for (let i = 0; i < 4; i++) puff(s.x + rand(-s.r, s.r) * 0.6, s.y, 10, i % 2 ? '#ffb347' : '#8a8f9c', 120, 14, false, rand(10, top * 0.7));
  ring(s.x, s.y, 20, s.r * 4, 'rgba(255,190,80,.9)', 0.6, 8);
  chips(s.x, s.y, top * 0.5, 22, SKINS[s.skin].chips, 'chip', 7);
  sparks(s.x, s.y, top * 0.5, 16, '#ffd34d');
  flashAt(s.x, s.y, top * 0.5, s.role === 'base' ? 190 : 140, '255,190,80', 0.5); screenFlash(s.role === 'base' ? 0.5 : 0.3); s.smokeUntil = G.t + 8;
  shake(14); play('boom');
}

