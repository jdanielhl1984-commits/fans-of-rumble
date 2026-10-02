// Fans of Rumble · Hechizos, mata-sanadores, gashapón de cartas, mazo, Modo Jefe y equipo compartido
'use strict';
/* ---------- v0.9.15: hechizos (gashapón de cartas) y mata-sanadores ---------- */
const isSpell = k => !!(cardDef(k) && cardDef(k).spell);
const cardStars = k => (SAVE.cards && SAVE.cards[k] && SAVE.cards[k].st) || 0;
let spells = [];   // hechizos lanzados que aún no han caído (y su efecto al caer)
function spellPow(team, k) {   // nivel (+6 % por nivel) y estrellas (+5 % cada una). La CPU usa el nivel del rival
  const lv = team === 'p' ? uSave(k).lvl : G.elvl || 1, st = team === 'p' ? cardStars(k) : 0;
  return (1 + (lv - 1) * ECON.lvlStep) * (1 + 0.05 * st);
}
function castSpell(team, k, x, y) {
  const C = cardDef(k), D = C.spell, me = S[team];
  me.chaos -= C.cost; me.spent += C.cost; me.deployed++;
  x = clamp(x, BOUNDS.x0, BOUNDS.x1); y = clamp(y, BOUNDS.y0, BOUNDS.y1);
  spells.push({ team, k, D, x, y, t: 0, delay: D.delay || 0.7, pow: spellPow(team, k), done: false, bits: [], sp: 0 });
  if (team === 'p') { chatSt.lastDep = G.t; chatEv('deploy', C.name, k, 0.3, 5); } else chatEv('enemyBig', C.name, null, 0.6, 8);
  addNum(x, y, 74, C.name.toUpperCase(), team === 'p' ? '#ffe06a' : '#8fc2ff', 14); play('card');
}
const RAIN = ['acorn', 'tomb', 'coin', 'cat', 'cart', 'letter', 'card9', 'leaf', 'heart', 'flea'];
function updateSpells(dt) {
  if (!spells.length) return;
  for (const sp of spells) {
    sp.t += dt;
    if (!sp.done) {
      if (RAIN.includes(sp.D.fx) && (sp.sp -= dt) <= 0) {   // lluvia de cosas (bellotas, lápidas, monedas, gatos…)
        sp.sp = 0.05; const a = rand(0, Math.PI * 2), rr = Math.sqrt(Math.random()) * sp.D.r * 0.9;
        sp.bits.push({ x: sp.x + Math.cos(a) * rr, y: sp.y + Math.sin(a) * rr, z: rand(200, 260), vz: -rand(420, 520), rot: rand(0, 6), vr: rand(-9, 9) });
      }
      for (const b of sp.bits) { b.z = Math.max(0, b.z + b.vz * dt); b.rot += b.vr * dt; if (b.z <= 0 && !b.hit) { b.hit = true; b.t = 0.25; puff(b.x, b.y, 2, '#efe2c4', 20, 3, true); } if (b.hit) b.t -= dt; }
      sp.bits = sp.bits.filter(b => !b.hit || b.t > 0);
      if (sp.t >= sp.delay) { applySpell(sp); sp.done = true; sp.tEnd = sp.t + 0.45; }
    } else { for (const b of sp.bits) { b.z = Math.max(0, b.z + b.vz * dt); if (b.z <= 0) b.hit = true; } sp.bits = sp.bits.filter(b => !b.hit); }
  }
  spells = spells.filter(sp => !sp.done || sp.t < sp.tEnd);
}
function applySpell(sp) {
  const D = sp.D, team = sp.team, foe = other(team), P = sp.pow, inR = o => Math.hypot(o.x - sp.x, o.y - sp.y) - o.r * 0.5 <= D.r;
  const foes = units.filter(o => o.alive && o.team === foe && o.deployT <= 0 && !o.jump && !(o.banT > 0) && inR(o));
  const allies = units.filter(o => o.alive && o.team === team && o.deployT <= 0 && !o.jump && inR(o));
  const cc = foes.filter(o => !o.immuneCC), C = D.col || '#ffffff';
  ring(sp.x, sp.y, 8, D.r, C, 0.5, 5, true);
  switch (D.kind) {
    case 'dmg': {
      let hits = 0;
      for (const o of foes) {
        let d = D.amt * P * (o.d.healer ? HEALER_SPELL : 1); if (D.crit && Math.random() < D.crit) { d *= 2; addNum(o.x, o.y, topOf(o) + 28, '¡UNO GORDO!', '#ffb04f', 13); }
        hurt(o, d, null, 'aoe'); hits++;
        if (D.stun && o.alive && !o.immuneCC) { o.stunT = Math.max(o.stunT, D.stun); o.stunKind = 'daze'; }
      }
      for (const st of structs) if (st.alive && st.team === foe && !st.hidden && Math.hypot(st.x - sp.x, st.y - sp.y) - st.r <= D.r) hurt(st, D.amt * P * (D.bld || 0.3), null, 'aoe');
      if (D.gain && hits) { const g = Math.min(1.5, D.gain * hits); S[team].chaos = Math.min(CFG.chaosMax, S[team].chaos + g); addNum(sp.x, sp.y, 96, `+${fmtV(rnd(g, 1))} DE CAOS`, '#d9a8ff', 13); }
      if (D.steal) { const n = Math.min(S[foe].chaos, D.steal); S[foe].chaos -= n; S[team].chaos = Math.min(CFG.chaosMax, S[team].chaos + n); }
      if (D.fx === 'bolt') parts.push({ type: 'zap', pts: [[sp.x + 10, sp.y, 320], [sp.x - 6, sp.y, 160], [sp.x, sp.y, 2]], life: 0.3, max: 0.3, seed: Math.random() * 1000 });
      if (D.fx === 'boom' || D.fx === 'sword' || D.fx === 'laser') { puff(sp.x, sp.y, 18, D.fx === 'laser' ? '#7df3ff' : '#ffb04f', 120, 10, false, 10); flashAt(sp.x, sp.y, 20, D.r, D.fx === 'laser' ? '125,243,255' : '255,180,80', 0.45); }
      shake(D.amt >= 200 ? 8 : 5); play(D.fx === 'bolt' ? 'zap' : D.fx === 'laser' ? 'laser' : D.fx === 'letter' ? 'despido' : D.fx === 'acorn' ? 'acorn' : D.fx === 'coin' || D.fx === 'card9' ? 'card' : 'boom');
      break;
    }
    case 'heal': {
      for (const o of allies) {
        const amt = Math.min(D.amt * P, o.maxHp - o.hp); o.hp += amt;
        if (amt >= 1) addNum(o.x + rand(-5, 5), o.y, topOf(o) * 0.75 + 4, '+' + Math.round(amt), '#8cf05a', 16);
        if (D.shield) { o.shield = (o.shield || 0) + D.shield * P; o.shieldMax = Math.max(o.shieldMax || 0, o.shield); }
        if (D.haste) o.hasteT = D.haste;
      }
      for (let i = 0; i < 12; i++) parts.push({ type: 'plus', x: sp.x + rand(-D.r, D.r) * 0.8, y: sp.y + rand(-D.r, D.r) * 0.5, z: rand(4, 30), vx: 0, vy: 0, vz: 30, g: 0, life: 0.9, max: 0.9 });
      play('heal');
      break;
    }
    case 'disarm': for (const o of cc) o.disarmT = D.t; play('pop'); break;
    case 'slow': for (const o of cc) { o.slowT = Math.max(o.slowT || 0, D.t); o.zombT = D.t; } play('wail'); break;
    case 'stun': for (const o of cc) { o.stunT = Math.max(o.stunT, D.t); o.stunKind = D.sk || 'daze'; } play(D.sk === 'stone' ? 'womp' : 'blip'); break;
    case 'shrink': for (const o of cc) { o.shrinkT = D.t; o.shrinkF = D.f; } play('womp'); break;
    case 'confuse': for (const o of cc) { o.confT = D.t; o.target = null; o.retarget = 0; } play('laugh'); break;
    case 'knock': for (const o of cc) { const dir = o.team === 'e' ? -1 : 1; o.y = clamp(o.y + dir * D.d, BOUNDS.y0, BOUNDS.y1); o.x = clamp(o.x + rand(-14, 14), BOUNDS.x0, BOUNDS.x1); o.stunT = Math.max(o.stunT, D.t); o.stunKind = 'lag'; o.target = null; puff(o.x, o.y, 6, '#ff9aa6', 40, 5, true); } play('blink'); break;
    case 'ban': for (const o of cc) { o.banT = D.t; o.target = null; } play('slam'); break;
    case 'remake': {
      const o = cc.slice().sort((a, b) => b.maxHp - a.maxHp)[0];
      if (o) { o.shrinkT = D.t; o.shrinkF = D.f; const cut = o.hp * D.cut; o.hp = Math.max(1, o.hp - cut); addNum(o.x, o.y, topOf(o) + 30, 'VERSIÓN REMAKE · 70 €', '#ff9ab8', 13); }
      play('card'); break;
    }
  }
  if (D.label) addNum(sp.x, sp.y, 58, D.label, C, 15);
  if (team === 'p' && (D.kind === 'dmg' || D.side === 'foe') && foes.some(o => o.d.healer)) chatEv('heal', null, null, 0.2, 20);
}
// dónde lanzar un hechizo (la CPU y el modo automático): busca el mejor sitio y, con los de daño, sobre todo a los sanadores
function spellAim(team, k) {
  const D = cardDef(k).spell, foe = other(team), P = spellPow(team, k), R = D.r;
  const pool = units.filter(o => o.alive && o.deployT <= 0 && !o.jump && !(o.banT > 0) && !o.summon && o.team === (D.side === 'ally' ? team : foe));
  if (!pool.length) return null;
  let best = null, bv = 0;
  for (const c of pool) {
    let v = 0;
    for (const o of pool) {
      if (Math.hypot(o.x - c.x, o.y - c.y) > R) continue;
      if (D.kind === 'dmg') { const dm = D.amt * P * (o.d.healer ? HEALER_SPELL : 1); v += Math.min(o.hp, dm) * (o.d.healer ? 2.4 : 1) + (o.hp <= dm ? (o.d.healer ? 160 : 60) : 0); }
      else if (D.kind === 'heal') v += Math.min(o.maxHp - o.hp, D.amt * P);
      else if (!o.immuneCC) v += o.maxHp * (o.d.healer ? 1.6 : 1);
    }
    if (v > bv) { bv = v; best = { x: c.x, y: c.y, v }; }
  }
  const need = D.kind === 'dmg' ? D.amt * P * 1.4 : D.kind === 'heal' ? D.amt * P * 1.3 : 900;
  return best && best.v >= need ? best : null;
}
function aiSpell(team, avail, go) {   // devuelve true si ha lanzado uno
  const me = S[team];
  for (const c of avail) if (isSpell(c.k) && me.chaos >= cardDef(c.k).cost) { const p = spellAim(team, c.k); if (p) { go(c, p.x, p.y); return true; } }
  return false;
}
// mata-sanadores: salto por encima de la primera línea hasta el sanador (o un tirador o un apoyo) que tenga a tiro
function leapPrey(u) {
  const L = u.d.leap; let best = null, bs = -Infinity;
  for (const o of units) {
    if (o.team === u.team || !targetable(o)) continue;
    const d = dist(o, u); if (d > L.range || d < 50) continue;
    const w = o.d.healer ? 3 : o.d.ranged || ROLES[o.type] === 'support' ? 2 : 0; if (!w) continue;
    const sc = w * 1000 - d; if (sc > bs) { bs = sc; best = o; }
  }
  return best;
}
function leapTick(u, dt) {
  if (u.jump) {
    const j = u.jump; j.t += dt; const k = Math.min(1, j.t / j.dur);
    u.x = lerp(j.x0, j.x1, k); u.y = lerp(j.y0, j.y1, k); u.z = Math.sin(Math.PI * k) * j.h; u.spin = k * Math.PI * 2 * u.face;
    if (k >= 1) {
      u.jump = null; u.z = 0; u.spin = 0; u.moving = false; puff(u.x, u.y, 8, '#efe2c4', 50, 6, true); play('land', u.team === 'p' ? 1 : 0.5);
      const t = j.prey;
      if (t && t.alive && targetable(t)) {
        u.target = t; u.retarget = 1.2; u.chaseOf = t; u.chaseT = 0; u.atkT = 0;
        if (u.d.flash && !t.immuneCC) { t.stunT = Math.max(t.stunT, u.d.flash); t.stunKind = 'daze'; flashAt(t.x, t.y, topOf(t) * 0.6, 50, '255,250,220', 0.5); addNum(t.x, t.y, topOf(t) + 22, '¡FLASH!', '#ffe14d', 14); }
      }
    }
    return true;
  }
  u.leapT = (u.leapT === undefined ? 0.4 : u.leapT) - dt; if (u.leapT > 0) return false;
  const prey = leapPrey(u); if (!prey) { u.leapT = 0.4; return false; }
  const d = dist(prey, u) || 1, ox = (u.x - prey.x) / d, oy = (u.y - prey.y) / d, gap = prey.r + u.r + 2;
  let x1 = clamp(prey.x + ox * gap, 24, W - 24), y1 = clamp(prey.y + oy * gap, BOUNDS.y0, BOUNDS.y1);
  if (y1 > RIVER.top - 14 && y1 < RIVER.bottom + 14 && Math.abs(x1 - nearestBridge(x1)) > BRIDGE_HALF) { y1 = prey.y; x1 = clamp(prey.x + (u.x < prey.x ? -gap : gap), 24, W - 24); }   // nada de caer al río
  u.jump = { x0: u.x, y0: u.y, x1, y1, t: 0, dur: 0.6, h: 70, prey };
  u.face = prey.x > u.x ? 1 : -1; u.leapT = u.d.leap.cd; u.stealthT = 0;
  addNum(u.x, u.y, topOf(u) + 18, prey.d.healer ? '¡A POR EL SANADOR!' : '¡A POR ÉL!', '#ffcb3d', 13); play('jump');
  return true;
}
function drawSpellsGround() {
  for (const sp of spells) {
    const D = sp.D, k = sp.done ? 1 - (sp.t - sp.delay) / 0.45 : 1, f = Math.min(1, sp.t / sp.delay), col = D.col || '#ffffff', mine = sp.team === 'p';
    ctx.save(); ctx.globalAlpha = 0.16 * k; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sp.x, sp.y, D.r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.85 * k; ctx.lineWidth = 3; ctx.strokeStyle = mine ? '#ffffff' : '#ff6b7a'; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -G.t * 30; ctx.stroke(); ctx.setLineDash([]);
    if (!sp.done) { ctx.globalAlpha = 0.5; ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(sp.x, sp.y, Math.max(2, D.r * f), 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
}
function drawSpellBit(c, fx, x, y, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.lineWidth = 1.4; c.strokeStyle = OL;
  if (fx === 'acorn') { c.beginPath(); c.ellipse(0, 1.4, 3.8, 4.2, 0, 0, Math.PI * 2); c.fillStyle = '#9a6a33'; c.fill(); c.stroke(); c.beginPath(); c.ellipse(0, -2.4, 4.4, 2.1, 0, 0, Math.PI * 2); c.fillStyle = '#5b3a1c'; c.fill(); c.stroke(); }
  else if (fx === 'tomb') { c.beginPath(); c.moveTo(-5, 6); c.lineTo(-5, -2); c.arc(0, -2, 5, Math.PI, 0); c.lineTo(5, 6); c.closePath(); c.fillStyle = '#b9bfcc'; c.fill(); c.stroke(); }
  else if (fx === 'coin') { c.beginPath(); c.ellipse(0, 0, 4.6, 4.6, 0, 0, Math.PI * 2); c.fillStyle = '#ffcb3d'; c.fill(); c.stroke(); }
  else if (fx === 'cat') { c.beginPath(); c.ellipse(0, 1, 5.6, 4.6, 0, 0, Math.PI * 2); c.moveTo(-5, -1); c.lineTo(-4, -6); c.lineTo(-1, -3); c.moveTo(5, -1); c.lineTo(4, -6); c.lineTo(1, -3); c.fillStyle = '#ffb04f'; c.fill(); c.stroke(); }
  else if (fx === 'cart') { c.beginPath(); c.rect(-4.5, -5.5, 9, 11); c.fillStyle = '#9ca3af'; c.fill(); c.stroke(); c.fillStyle = '#ffe06a'; c.fillRect(-3, -4, 6, 4.4); }
  else if (fx === 'letter') { c.beginPath(); c.rect(-5.5, -3.6, 11, 7.2); c.fillStyle = '#fff6ea'; c.fill(); c.stroke(); c.beginPath(); c.moveTo(-5.5, -3.6); c.lineTo(0, 0.6); c.lineTo(5.5, -3.6); c.stroke(); }
  else if (fx === 'card9') { c.beginPath(); c.rect(-6, -4, 12, 8); c.fillStyle = '#334155'; c.fill(); c.stroke(); c.fillStyle = '#ffcb3d'; c.fillRect(-4, 0.5, 3.6, 2); }
  else if (fx === 'heart') { c.beginPath(); c.moveTo(0, 4); c.bezierCurveTo(-7, -1, -4, -7, 0, -3); c.bezierCurveTo(4, -7, 7, -1, 0, 4); c.fillStyle = col; c.fill(); c.stroke(); }
  else if (fx === 'leaf') { c.beginPath(); c.ellipse(0, 0, 5, 2.4, 0.6, 0, Math.PI * 2); c.fillStyle = '#7be04a'; c.fill(); c.stroke(); }
  else if (fx === 'flea') { c.beginPath(); c.ellipse(0, 0, 2.6, 2, 0, 0, Math.PI * 2); c.fillStyle = '#8b5530'; c.fill(); c.stroke(); }
  c.restore();
}
function drawSpellsAir() {
  for (const sp of spells) {
    for (const b of sp.bits) { if (b.hit) continue; ctx.globalAlpha = 0.25; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(b.x, b.y, 4, 1.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; drawSpellBit(ctx, sp.D.fx, b.x, b.y - b.z, b.rot, sp.D.col); }
    if (!sp.done) {   // la carta del hechizo baja hasta el suelo
      const f = Math.min(1, sp.t / sp.delay), z = lerp(120, 26, f * f), s0 = SPR[sp.k];
      if (s0) { ctx.save(); ctx.globalAlpha = 0.95; ctx.translate(sp.x, sp.y - z); const sc = 0.95 + 0.1 * Math.sin(G.t * 12); ctx.scale(sc, sc); ctx.drawImage(s0.c, -s0.ax, -s0.ay, s0.wd, s0.ht); ctx.restore(); }
      if (sp.D.fx === 'laser') { ctx.save(); ctx.globalAlpha = 0.25 + 0.5 * f; ctx.strokeStyle = '#7df3ff'; ctx.lineWidth = 2 + f * 8; ctx.beginPath(); ctx.moveTo(sp.x, sp.y - 400); ctx.lineTo(sp.x, sp.y); ctx.stroke(); ctx.restore(); }
    }
  }
}

/* ---------- v0.9.15: gashapón de cartas (hechizos y mata-sanadores), estrellas y mazo personalizado ---------- */
const DECK_SPELLS = 2;   // como mucho 2 hechizos por mazo
const ownsCard = k => !!(SAVE.cards && SAVE.cards[k]) || !!SAVE.testAll;
const rarOfPull = r => (r.it ? defOf(r.it).rar : r.rar);
const starsHtml = k => { const n = cardStars(k); return `<span class="stars" aria-label="${n} estrellas">${'★'.repeat(n)}<i>${'★'.repeat(ECON.maxStars - n)}</i></span>`; };
function deckPool(f) { const F = FACTIONS[f]; return F.units.concat((F.gacha || []).filter(ownsCard)); }
function deckOf(f) {   // líder aparte + 6 cartas: las elegidas (si siguen siendo válidas) y, si faltan, las básicas
  const F = FACTIONS[f]; if (!F || !F.units) return [];
  const pool = deckPool(f); let d = (((SAVE.decks || {})[f]) || []).filter((k, i, a) => pool.includes(k) && a.indexOf(k) === i);
  let sp = 0; d = d.filter(k => !isSpell(k) || ++sp <= DECK_SPELLS);
  for (const k of F.units) if (d.length < 6 && !d.includes(k)) d.push(k);
  return d.slice(0, 6);
}
const deckCost = d => d.reduce((a, k) => a + CFG.cards[k].cost, 0) / Math.max(1, d.length);
function deckBarHtml(f) {
  const d = deckOf(f), L = FACTIONS[f].leader, nsp = d.filter(isSpell).length;
  return `<div class="deck-bar"><div><b class="ol">TU MAZO</b><small>Líder + 6 cartas · ${nsp} ${nsp === 1 ? 'hechizo' : 'hechizos'} · coste medio ${fmtV(rnd(deckCost(d), 1))}</small><div class="deck-mini"><span><canvas data-dk="${L}"></canvas></span>${d.map(k => `<span class="${isSpell(k) ? 'sp' : ''}"><canvas data-dk="${k}"></canvas></span>`).join('')}</div></div><button class="btn-up" id="btn-deck">EDITAR<small>MAZO</small></button></div>`;
}
// cartas del gashapón de la facción en la Colección (las que no tienes salen en gris)
function gachaRows(f, lock) {
  const G2 = FACTIONS[f].gacha || []; if (!G2.length) return '';
  const own = G2.filter(ownsCard).length;
  return `<p class="gacha-sec ol">CARTAS DEL GASHAPÓN · ${own}/${G2.length}<small>Salen en la máquina de cartas. Las repetidas le dan estrellas: +5 % cada una, hasta 5.</small></p>` + G2.map(k => (ownsCard(k) ? collRow(k, lock) : lockedRow(k))).join('');
}
function lockedRow(k) {
  const c = CFG.cards[k];
  return `<div class="coll-row locked" data-rarity="${c.rarity}"><canvas data-k="${k}"></canvas><div><div class="coll-name ol">${c.name}<em>${c.rar}</em></div><div class="deck-desc">${c.desc}</div><div class="deck-stats">${c.cost} de CAOS · ${c.tag}</div></div><button class="btn-up" data-goc="1">GASHAPÓN<small>DE CARTAS</small></button></div>`;
}
function spellNums(k, team) {   // números del hechizo con su nivel y estrellas
  const D = CFG.cards[k].spell, P = spellPow(team || 'p', k), t = [];
  if (D.amt) t.push(`${D.kind === 'heal' ? 'Cura' : 'Daño'} ${fmt(D.amt * P)}`);
  if (D.t) t.push(`${fmtV(D.t)} s`);
  t.push(`área de ${D.r}`);
  return t.join(' · ');
}
function spellRow(k, lock) {
  const c = CFG.cards[k], us = uSave(k), max = us.lvl >= ECON.maxLvl, need = needXp(us.lvl), ready = !max && us.xp >= need, cost = upCost(us.lvl), pct = max ? 100 : Math.min(100, (us.xp / need) * 100);
  const btn = max ? '<button class="btn-up max" disabled>NV MÁX</button>' : `<button class="btn-up" data-up="${k}" ${ready && !lock ? '' : 'disabled'}>SUBIR<small>${COIN_SVG}${fmt(cost)}</small></button>`;
  return `<div class="coll-row" data-rarity="${c.rarity}"><canvas data-k="${k}"></canvas><div><div class="coll-name ol">${c.name}<em>Nv ${us.lvl}</em>${starsHtml(k)}</div><div class="deck-desc">${c.desc}</div><div class="xpbar"><i style="width:${pct}%"></i><span>${max ? 'NIVEL MÁXIMO' : `${fmt(us.xp)} / ${fmt(need)} XP`}</span></div><div class="deck-stats">${c.cost} de CAOS · ${spellNums(k)}</div></div>${btn}</div>`;
}
function showSpellTip(k) {
  const c = CFG.cards[k], tip = $('#card-tip'), lv = uSave(k).lvl;
  tip.innerHTML = `<div class="tip-head"><canvas></canvas><div><b class="ol">${c.name} <small>Nv ${lv}</small></b><span class="tip-tags"><i class="tcost">${c.cost} de CAOS</i>${roleOf(k).map(t => `<i>${t}</i>`).join('')}<i>${c.rar}</i></span></div></div><div class="tip-spell">${c.desc}</div><div class="tip-stats">${spellNums(k)}${cardStars(k) ? ' · ' + cardStars(k) + ' ★' : ''}</div>`;
  drawArt(tip.querySelector('canvas'), k, 64, 52); tip.hidden = false;
}
// ---- la máquina de cartas
function cardPool(rar) { return FACTION_ORDER.filter(isUnlocked).flatMap(f => FACTIONS[f].gacha || []).filter(k => !rar || CFG.cards[k].rarity === rar); }
function rollCardRarity(force) {
  const P = SAVE.pity; P.cd = (P.cd || 0) + 1; P.cdL = (P.cdL || 0) + 1;
  let r = 'rare'; const O = ECON.cardOdds;
  if (P.cdL >= ECON.pityLeg) r = 'legendary';
  else if (force || P.cd >= ECON.pityEpic) r = Math.random() < O.legendary / (O.legendary + O.epic) ? 'legendary' : 'epic';
  else { const x = Math.random() * 100; r = x < O.legendary ? 'legendary' : x < O.legendary + O.epic ? 'epic' : 'rare'; }
  if (r !== 'rare') P.cd = 0;
  if (r === 'legendary') P.cdL = 0;
  return r;
}
function cardStartLevel(k) {   // la carta nueva llega cerca del nivel de su facción, para que sirva desde el principio
  const F = FACTIONS[CFG.cards[k].fac], avg = Math.round(F.units.reduce((a, u) => a + uSave(u).lvl, 0) / F.units.length), us = uSave(k);
  us.lvl = Math.max(us.lvl, avg - 1, 1);
}
function cardPull(force) {
  let pool = cardPool(rollCardRarity(force)); if (!pool.length) pool = cardPool();
  const k = pick(pool), rar = CFG.cards[k].rarity; SAVE.cards = SAVE.cards || {}; const C = SAVE.cards[k];
  if (!C) { SAVE.cards[k] = { n: 1, st: 0 }; cardStartLevel(k); stat('cardnew', 1); return { k, rar, isNew: true, tag: '¡NUEVA!' }; }
  C.n++;
  if (C.st < ECON.maxStars) { C.st++; stat('cardstar', 1); return { k, rar, up: true, tag: `¡SUBE A ${C.st} ★!` }; }
  SAVE.gems += ECON.dupGems; return { k, rar, gems: true, tag: `Ya tenía 5 ★: +${ECON.dupGems} gemas` };
}
let cardsGoFac = null;
function showCardPulls(res) {
  const card = $('#gr-card'), top = res.reduce((a, r) => (RAR_ORDER[r.rar] < RAR_ORDER[a.rar] ? r : a)), R = CARD_RAR[top.rar];
  card.style.setProperty('--rc1', R[1]); card.style.setProperty('--rc2', R[2]); cardsGoFac = CFG.cards[top.k].fac;
  if (res.length === 1) {
    const r = res[0], c = CFG.cards[r.k];
    card.classList.remove('multi');
    card.innerHTML = `<div class="gr-rar ol">${R[0].toUpperCase()} · ${FACTIONS[c.fac].name.toUpperCase()}</div><canvas class="gr-art"></canvas><div class="gr-name ol">${c.name}</div><div class="gr-desc">${c.desc}</div><div class="gr-tag">${r.tag}${!r.gems ? ' ' + starsHtml(r.k) : ''}</div>`;
    drawArt(card.querySelector('canvas'), r.k, 120, 104);
  } else {
    card.classList.add('multi');
    const news = res.filter(r => r.isNew).length, ups = res.filter(r => r.up).length, order = res.slice().sort((a, b) => RAR_ORDER[a.rar] - RAR_ORDER[b.rar]);
    card.innerHTML = `<div class="gr-rar ol">TIRADA x${res.length}</div><div class="gr-sum">${news ? `<b>${news} ${news > 1 ? 'nuevas' : 'nueva'}</b> · ` : ''}${ups} ${ups === 1 ? 'estrella' : 'estrellas'} más${res.length - news - ups ? ` · ${(res.length - news - ups) * ECON.dupGems} gemas` : ''}</div><div class="gr-grid">${order.map(r => { const c = CFG.cards[r.k], RR = CARD_RAR[r.rar]; return `<div class="gt" style="--rc:${RR[1]};--rc2:${RR[2]}"><canvas data-gk="${r.k}"></canvas><span class="gt-name">${c.name}</span><span class="gt-st">${r.gems ? '+' + ECON.dupGems + ' 💎' : '★'.repeat(cardStars(r.k))}</span>${r.isNew ? '<span class="gt-new">NUEVA</span>' : ''}</div>`; }).join('')}</div><small class="gr-hint">Ponlas en tu mazo desde la Colección.</small>`;
    for (const cv of card.querySelectorAll('canvas[data-gk]')) drawArt(cv, cv.dataset.gk, 40, 34);
  }
  $('#btn-gr-inv').textContent = 'Ver en la Colección';
  $('#gacha-result').hidden = false; play(res.some(r => r.isNew || r.rar !== 'rare') ? 'win' : 'levelup');
}
function buildCardGachaText() {
  const n = cardPool().length, own = cardPool().filter(k => SAVE.cards && SAVE.cards[k]).length, O = ECON.cardOdds;
  $('#gacha-sub').textContent = `Hechizos y mata-sanadores de las facciones que ya tienes (${own} de ${n}). La primera copia desbloquea la carta; las repetidas le dan estrellas: +5 % cada una, hasta 5.`;
  $('#btn-gr-inv').textContent = 'Ver en la Colección';
  $('#gacha-odds').textContent = `Probabilidades: rara ${O.rare} %, épica ${O.epic} %, legendaria ${O.legendary} %. Garantías: épica o mejor como mucho cada ${ECON.pityEpic} tiradas (llevas ${SAVE.pity.cd || 0}) y legendaria a las ${ECON.pityLeg} (llevas ${SAVE.pity.cdL || 0}). Con 5 estrellas, una repetida da ${ECON.dupGems} gemas.`;
}
// ---- editar el mazo (v0.9.16: expositor con el líder grande y las 6 cartas; tus tropas debajo)
let deckEdit = null;
function openDeck(f) { deckEdit = { f, sel: deckOf(f).slice(), pick: null }; buildDeck(); $('#scr-deck').hidden = false; $('#deck-grid').scrollTop = 0; }
function deckTile(k, o) {   // o: { lead, slot, inDeck, pick, target }
  const c = CFG.cards[k], sp = isSpell(k), st = cardStars(k), lv = uSave(k).lvl;
  const cls = ['dk2c', sp ? 'sp' : '', o.inDeck ? 'in' : '', o.pick ? 'pick' : '', o.target ? 'target' : ''].filter(Boolean).join(' ');
  const data = o.lead ? 'disabled' : o.slot != null ? `data-dks="${o.slot}"` : `data-dkp="${k}"`;
  const tag = o.lead ? c.tag : sp ? 'Hechizo' : c.tag || c.rar;
  return `<button class="${cls}" data-rarity="${c.rarity}" ${data} aria-label="${c.name}, nivel ${lv}, cuesta ${c.cost} de CAOS${o.inDeck ? ', en tu mazo' : ''}">`
    + `<span class="dk2c-art"><canvas data-dka="${k}" data-big="${o.lead ? 1 : 0}"></canvas></span>`
    + `<i class="dk2c-lvl">${lv}</i><i class="dk2c-cost">${c.cost}</i>`
    + (st ? `<span class="dk2c-stars">${'★'.repeat(st)}</span>` : '')
    + (o.lead ? '<span class="dk2c-lead">LÍDER</span>' : '')
    + `<span class="dk2c-name">${c.name}</span><span class="dk2c-tag">${tag}</span>`
    + (o.inDeck ? '<span class="dk2c-in">EN EL MAZO</span>' : '') + '</button>';
}
function buildDeck() {
  const D = deckEdit, { f, sel } = D, F = FACTIONS[f], pool = deckPool(f), nsp = sel.filter(isSpell).length, all = F.units.length + (F.gacha || []).length;
  const pickSp = D.pick && isSpell(D.pick), spFull = pickSp && nsp >= DECK_SPELLS;
  $('#deck-title').textContent = 'TU MAZO · ' + F.name.toUpperCase();
  let board = deckTile(F.leader, { lead: true });
  for (let i = 0; i < 6; i++) {
    const k = sel[i];
    if (!k) { board += `<button class="dk2c empty${D.pick ? ' target' : ''}" data-dks="${i}" aria-label="Hueco vacío"><b>+</b>VACÍO</button>`; continue; }
    board += deckTile(k, { slot: i, target: !!D.pick && (!spFull || isSpell(k)) });
  }
  $('#deck-board').innerHTML = board;
  $('#deck-grid').innerHTML = pool.map(k => deckTile(k, { inDeck: sel.includes(k), pick: D.pick === k })).join('');
  for (const cv of document.querySelectorAll('#scr-deck canvas[data-dka]')) { const big = cv.dataset.big === '1'; drawArt(cv, cv.dataset.dka, big ? 104 : 96, big ? 150 : 88); }
  const used = [F.leader].concat(sel), avg = used.reduce((a, k) => a + uSave(k).lvl, 0) / used.length;
  $('#deck-lvl').textContent = 'Nivel medio ' + fmtV(rnd(avg, 1));
  $('#deck-sp').textContent = `Hechizos ${nsp}/${DECK_SPELLS}`; $('#deck-sp').classList.toggle('full', nsp >= DECK_SPELLS);
  $('#deck-cost').textContent = 'Coste medio ' + fmtV(rnd(deckCost(sel), 1));
  $('#deck-count').textContent = `Tienes ${pool.length} de ${all}`;
  $('#deck-note').innerHTML = (D.pick ? '' : '<b>Mantén pulsada</b> una carta para ver qué hace. ') + (D.pick ? `Toca la carta de tu mazo que quieres cambiar por <b>${CFG.cards[D.pick].name}</b>${spFull ? ' (tiene que ser un hechizo: como mucho ' + DECK_SPELLS + ')' : ''}. Toca otra vez para cancelar.`
    : sel.length < 6 ? `Te faltan <b>${6 - sel.length}</b> ${6 - sel.length === 1 ? 'carta' : 'cartas'}: toca una de tus tropas para ponerla.`
    : 'Toca una de tus tropas y luego la carta del mazo que quieres cambiar.');
  for (const b of document.querySelectorAll('#deck-grid [data-dkp]')) { deckHold(b, b.dataset.dkp); b.onclick = () => { if (!deckHeld()) deckPoolTap(b.dataset.dkp); }; }
  for (const b of document.querySelectorAll('#deck-board [data-dks]')) { const k = sel[+b.dataset.dks]; if (k) deckHold(b, k); b.onclick = () => { if (!deckHeld()) deckSlotTap(+b.dataset.dks); }; }
  for (const b of document.querySelectorAll('#deck-board .dk2c[data-rarity="leader"]')) { b.disabled = false; deckHold(b, F.leader); }
}
// v0.9.18: mantener pulsada una carta enseña su ficha (qué hace); al soltar se cierra y no se pone ni se quita
let deckHoldT = null, deckHoldOn = false, deckHoldAt = 0;
const deckHeld = () => { const h = deckHoldOn || performance.now() - deckHoldAt < 350; deckHoldOn = false; return h; };
function deckHold(b, k) {
  b.addEventListener('contextmenu', e => e.preventDefault());
  b.addEventListener('pointerdown', e => {
    clearTimeout(deckHoldT); const x0 = e.clientX, y0 = e.clientY;
    deckHoldT = setTimeout(() => { const keep = G.faction; G.faction = deckEdit.f; showCardTip(k); G.faction = keep; $('#card-tip').classList.add('deck'); deckHoldOn = true; play('select'); }, 420);
    const mv = ev => { if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 10) clearTimeout(deckHoldT); };
    const up = () => { clearTimeout(deckHoldT); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); if (deckHoldOn) { deckHoldAt = performance.now(); hideCardTip(); $('#card-tip').classList.remove('deck'); } };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  });
}
function deckSave() { SAVE.decks[deckEdit.f] = deckEdit.sel.slice(); saveGame(); buildDeck(); }
function deckPoolTap(k) {
  const D = deckEdit, sel = D.sel, i = sel.indexOf(k);
  if (i >= 0) { sel.splice(i, 1); D.pick = null; play('select'); deckSave(); return; }   // ya estaba: se quita
  if (D.pick === k) { D.pick = null; play('select'); buildDeck(); return; }
  const spOk = !isSpell(k) || sel.filter(isSpell).length < DECK_SPELLS;
  if (sel.length < 6 && spOk) { sel.push(k); D.pick = null; play('select'); deckSave(); return; }
  D.pick = k; play('select'); buildDeck();   // mazo lleno (o ya hay 2 hechizos): elige qué carta cambiar
}
function deckSlotTap(i) {
  const D = deckEdit, sel = D.sel, k = sel[i];
  if (D.pick) {
    const others = sel.filter((x, j) => j !== i && isSpell(x)).length;
    if (isSpell(D.pick) && others >= DECK_SPELLS) { toast(`Como mucho ${DECK_SPELLS} hechizos: cambia uno de tus hechizos`); play('deny'); return; }
    if (k) sel[i] = D.pick; else sel.push(D.pick);
    D.pick = null; play('levelup'); deckSave(); return;
  }
  if (!k) { toast('Toca una de tus tropas de abajo para ponerla aquí'); return; }
  sel.splice(i, 1); play('select'); deckSave();
}
$('#btn-deck-ok').addEventListener('click', () => { const { f, sel } = deckEdit; if (sel.length < 6) toast('Faltaban cartas: se completa con las básicas'); SAVE.decks[f] = deckOf(f); saveGame(); $('#scr-deck').hidden = true; play('select'); if (!$('#scr-coll').hidden) buildColl(); buildPrepDeck(); if (G.state !== 'play') resetMatch(); });
$('#btn-deck-reset').addEventListener('click', () => { deckEdit.sel = FACTIONS[deckEdit.f].units.slice(); deckEdit.pick = null; play('select'); deckSave(); });

/* ---------- v0.9.15: Modo Jefe: elegir jefe y dificultad ---------- */
function buildBossPrep() {
  const sel = SAVE.bossSel || (SAVE.bossSel = { wi: CEO_WI, d: 'n' }); if (!bossOpen(sel.wi)) sel.wi = CEO_WI; if (!BDIFF[sel.d]) sel.d = 'n';
  const wi = sel.wi, d = sel.d, B = bossOf(wi), BD = BDIFF[d], hp = bossHp(wi, d), key = wi + d, rec = SAVE.bossRec[key] || 0, bits = SAVE.bossPay[key] || 0, lv = Math.min(12, avgLevel(G.faction) + BD.lvl);
  const pick = $('#boss-pick');
  pick.innerHTML = WORLDS.map((w, i) => { const o = bossOpen(i), k = ['n', 'h', 'm'].filter(x => (SAVE.bossPay[i + x] || 0) & 8).length; return `<button class="bp${o ? '' : ' locked'}" data-bw="${i}" aria-pressed="${i === wi}" aria-label="${o ? bossOf(i).name : 'Bloqueado'}"><canvas data-ba="${BOSS_ART[i]}"></canvas><span>${o ? BOSS_SHORT[i] : 'Mundo ' + (i + 1)}</span>${k ? `<i class="bp-k">${'★'.repeat(k)}</i>` : ''}</button>`; }).join('');
  for (const cv of pick.querySelectorAll('canvas[data-ba]')) drawArt(cv, cv.dataset.ba, 50, 40);
  for (const b of pick.querySelectorAll('[data-bw]')) b.onclick = () => {
    const i = +b.dataset.bw; if (!bossOpen(i)) { toast(`Gana a ${bossOf(i).name} en la campaña (mundo ${i + 1}) para retarle aquí`); play('deny'); return; }
    sel.wi = i; saveGame(); play('select'); buildBossPrep();
  };
  const on = pick.querySelector('[aria-pressed="true"]'); if (on) pick.scrollLeft = Math.max(0, on.offsetLeft - pick.clientWidth / 2 + on.offsetWidth / 2);
  for (const b of document.querySelectorAll('[data-bd]')) b.setAttribute('aria-pressed', String(b.dataset.bd === d));
  for (const x of ['n', 'h', 'm']) $('#bd-' + x).textContent = `${fmt(bossHp(wi, x))} de vida${x === 'n' ? '' : ' · x' + BDIFF[x].pay}`;
  const tiers = BOSS_TIERS.map((f, i) => { const t = `${Math.round(f * 100)} % → ${BOSS_TGEMS[i] * BD.pay}`; return bits & (1 << i) ? `<s>${t}</s>` : t; }).join(' · '), kt = `derrotarlo → ${BOSS_KGEMS * BD.pay}`;
  $('#prep-info').innerHTML = `<b class="ol">${B.name}</b> <span class="cd-badge ${d} ol"${d === 'n' ? ' hidden' : ''}>${BD.name.toUpperCase()}</span><br>Sede de ${fmt(hp)} de vida y 4 minutos para hacerle todo el daño posible. Rival de nivel ${lv}${BD.gear ? ', con tropas de élite y equipo' : ''}. Récord: <b>${fmt(rec)}</b> (${Math.min(100, Math.floor(rec / hp * 100))} %)<br><span class="rw">Gemas la primera vez que le quitas el ${tiers} · ${bits & 8 ? `<s>${kt}</s>` : kt}. Y oro según el daño (más si lo derrotas).</span>`;
}
for (const b of document.querySelectorAll('[data-bd]')) b.addEventListener('click', () => { SAVE.bossSel.d = b.dataset.bd; saveGame(); play('select'); buildBossPrep(); });

/* ---------- v0.9.15: equipo compartido y objetos de facción ---------- */
function equipAll(f) {
  const E = SAVE.equip[f] || {}, facs = SAVE.unlocked.filter(g => g !== f && FACTIONS[g]);
  const names = Object.keys(SLOTS).filter(sl => invGet(E[sl])).map(sl => ITEMS[invGet(E[sl]).id].name);
  confirmBox('EQUIPO PARA TODOS', `¿Poner <b>${names.join(', ')}</b> a tus otros ${facs.length} líderes?<small>El equipo se comparte: una copia la pueden llevar todos a la vez. Los objetos de facción solo se los pone su líder.</small>`, 'PONER A TODOS', () => {
    let n = 0;
    for (const g of facs) for (const sl in SLOTS) { const it = invGet(E[sl]); if (it && fitsFac(it.id, g)) { SAVE.equip[g] = SAVE.equip[g] || {}; SAVE.equip[g][sl] = it.u; n++; } }
    stat('eqall', 1); saveGame(); play('levelup'); buildColl(); toast(`Hecho: ${facs.length} líderes equipados`);
  });
}
function facItemsRetro() {   // a quien ya ganó a un jefe en Difícil antes de esta versión, se le da su objeto de facción
  SAVE.facItem = SAVE.facItem || {}; const got = [];
  WORLDS.forEach((w, wi) => { const f = worldFac(wi), id = w.levels[3].id; if (f && !SAVE.facItem[f] && (starsD(id, 'h') > 0 || starsD(id, 'm') > 0)) { SAVE.facItem[f] = 1; got.push(ITEMS[newCopy('eq', FAC_ITEM[f], 2).id].name); } });
  if (got.length) setTimeout(() => toast(`¡Objetos de facción nuevos en tu inventario: ${got.join(', ')}!`, true), 2500);
}

// v0.9.18: botón «Mazo» en el menú principal: edita el mazo de la facción que tienes elegida
$('#btn-deck-menu').addEventListener('click', () => { play('select'); openDeck(isUnlocked(G.faction) ? G.faction : SAVE.unlocked[0]); });
