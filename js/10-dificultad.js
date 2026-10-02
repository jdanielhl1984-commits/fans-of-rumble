// Fans of Rumble · Difícil, Mítica, equipo del rival, ruleta semanal y efectos nuevos
'use strict';
/* =========================================================
   v0.9.12: Difícil y Mítica (mundo a mundo), equipo del rival, ruleta semanal y efectos nuevos
   ========================================================= */
const CDIFF = {
  n: { name: 'Normal' },
  h: { name: 'Difícil', lvl: l => Math.min(10, l.elvl + 5), inc: 1.45, incMin: 1.05, start: 7, elite: 1.1, think: [0.4, 0.85], bossCd: 14, stun: 2.5, hp: 1.3, dmg: 1.2, pay: 2, q: 0.6 },
  m: { name: 'Mítica', lvl: l => Math.min(12, Math.max(9, l.elvl + 7)), inc: 1.8, incMin: 1.35, start: 9, elite: 1.25, think: [0.3, 0.7], bossCd: 11, stun: 2.8, hp: 1.55, dmg: 1.35, pay: 3, q: 1 },
};
const CAMP_SUB = {
  n: 'Libera cada mundo corrompido y su facción se unirá a ti. Campaña 1: Microblizz. Al ganar al CEO se abren el sótano y la Campaña 2, contra Phony; y al ganar a Phony, la Campaña 3, contra IAhorro.',
  h: 'Difícil: rivales de nivel 6 a 10 y líderes equipados. Te hará falta subir tus cartas y equiparlas bien. Premios dobles.',
  m: 'Mítica, el verdadero desafío: rivales de nivel 9 a 12, equipo perfecto y la ruleta de la semana. Premios triples y un legendario por cada jefe.',
};
// equipo del rival en cada mundo: lo lleva su líder (en los mundos de Microblizz, sus FallenHero y Parche Día 1)
const ENEMY_GEAR = {
  h: [['espada_carton', 'cuernos', 'taza'], ['raton_dpi', 'corona_carton', 'almohada'], ['baguette', 'gorra_reves', 'bebida_xxl'], ['mando_cable', 'casco_vr', 'disco_fisico'], ['teclado_rgb', 'gorro_aluminio', 'silla_gamer'], ['lanzaconfeti', 'orejas_gato', 'cofre'], ['banhammer_oro', 'auriculares', 'alfombrilla'],
      ['baguette', 'cuernos', 'almohada'], ['raton_dpi', 'casco_vr', 'cofre'], ['teclado_rgb', 'auriculares', 'bebida_xxl'], ['lanzaconfeti', 'corona_carton', 'alfombrilla'], ['banhammer_oro', 'gorro_aluminio', 'silla_gamer']],
  m: [['baguette', 'casco_vr', 'bebida_xxl'], ['lanzaconfeti', 'gorro_aluminio', 'almohada'], ['banhammer_oro', 'orejas_gato', 'silla_gamer'], ['teclado_rgb', 'auriculares', 'boton_pausa'], ['lanzaconfeti', 'auriculares', 'alfombrilla'], ['banhammer_oro', 'orejas_gato', 'boton_pausa'], ['banhammer_oro', 'auriculares', 'boton_pausa'],
      ['banhammer_oro', 'auriculares', 'almohada'], ['baguette', 'auriculares', 'boton_pausa'], ['teclado_rgb', 'orejas_gato', 'boton_pausa'], ['lanzaconfeti', 'auriculares', 'alfombrilla'], ['banhammer_oro', 'auriculares', 'boton_pausa']],
};
const MB_GEAR_ON = ['fallen', 'parchebot'], PH_GEAR_ON = ['servidorbot', 'remasterbot'], IA_GEAR_ON = ['granjaserv', 'clonador'];
// v0.9.23: equipo del rival en los mundos de la Campaña 3
ENEMY_GEAR.h.push(['raton_dpi', 'auriculares', 'silla_gamer'], ['teclado_rgb', 'casco_vr', 'cofre'], ['lanzaconfeti', 'orejas_gato', 'bebida_xxl'], ['banhammer_oro', 'gorro_aluminio', 'alfombrilla']);
ENEMY_GEAR.m.push(['banhammer_oro', 'auriculares', 'boton_pausa'], ['teclado_rgb', 'orejas_gato', 'boton_pausa'], ['baguette', 'auriculares', 'alfombrilla'], ['banhammer_oro', 'casco_vr', 'boton_pausa']);
let campDiff = 'n';
const campOf = d => (d === 'h' ? SAVE.campH || (SAVE.campH = {}) : d === 'm' ? SAVE.campM || (SAVE.campM = {}) : SAVE.camp);
const starsD = (id, d) => campOf(d || 'n')[id] || 0;
function worldOpenD(wi, d) {
  if (SAVE.testAll) return true;
  if (d === 'h') return starsD(`${wi + 1}-4`, 'n') > 0;
  if (d === 'm') return starsD(`${wi + 1}-4`, 'h') > 0;
  const w = WORLDS[wi]; if (w.openAfter) return starsD(w.openAfter, 'n') > 0;
  return wi === 0 || starsD(`${wi}-4`, 'n') > 0;
}
const levelOpenD = (l, d) => worldOpenD(l.wi, d) && (SAVE.testAll || l.li === 0 || starsD(`${l.wi + 1}-${l.li}`, d) > 0);
for (const b of document.querySelectorAll('[data-cd]')) b.addEventListener('click', () => { campDiff = b.dataset.cd; play('select'); buildCamp(); if (campDiff === 'm' && SAVE.rlWeek !== weekStr()) openRoulette(); });
function gearRow(id, q) { const D = ITEMS[id], T = QTIERS[tierOf(q)]; return `<div class="gear-row"><span class="gi" style="--qc:${T.col}">${SLOT_SVG[D.slot]}</span><span><b class="ol">${D.name}</b> <i class="gq" style="color:${T.col}">${T.name}</i><br>${descOf({ k: 'eq', id, q: D.st.map(() => q) })}</span></div>`; }
function resetMods() { G.mod = null; G.pInc = 1; G.pDeployAdd = 0; G.pRespawnM = 1; G.eKillChaos = 0; G.egear = null; G.egearQ = 0.5; G.egearOn = []; }
function setupHardMode(lvl) {
  const cd = G.cdiff, C = CDIFF[cd];
  G.elvl = C.lvl(lvl);
  G.diffCfg = Object.assign({}, G.diffCfg, { aiIncome: Math.max(C.incMin, lvl.income * C.inc), think: C.think.slice(), bossCd: C.bossCd, stun: C.stun, despido: 24 + G.elvl * 3 });
  if (isCorp(G.efac)) { G.edeck = FACTIONS[G.efac].units.slice(); G.classicAI = false; G.egearOn = G.efac === 'phony' ? PH_GEAR_ON : G.efac === 'iahorro' ? IA_GEAR_ON : MB_GEAR_ON; }
  G.egear = ENEMY_GEAR[cd][lvl.wi]; G.egearQ = C.q;
  if (cd === 'm') {
    const M = G.mod = mythicWeek();
    if (M.deb.id === 'recorte') G.pInc = 0.7;
    if (M.deb.id === 'carga') G.pDeployAdd = 1.5;
    if (M.deb.id === 'vacaciones') G.pRespawnM = 2;
    if (M.buf.id === 'inversion') G.diffCfg.aiIncome *= 1.3;
    if (M.buf.id === 'despidos') G.eKillChaos = 1;
  }
}
function applyMatchMods() {   // al empezar: torres, sede y CAOS inicial según la dificultad y la ruleta
  if (G.mode !== 'camp' || !G.cdiff || G.cdiff === 'n') return;
  const C = CDIFF[G.cdiff], M = G.mod;
  for (const st of structs) {
    if (st.team === 'e') { st.hp = st.maxHp = Math.round(st.maxHp * C.hp * (M && M.buf.id === 'blindaje' ? 1.4 : 1)); st.dmg = Math.round(st.dmg * C.dmg); if (M && M.buf.id === 'torretas') st.cd *= 0.6; }
    else if (M && M.deb.id === 'carton') st.hp = st.maxHp = Math.round(st.maxHp * 0.65);
  }
  S.e.chaos = C.start;
  if (M && M.deb.id === 'sincaos') S.p.chaos = 0;
}
function hardBanner() {
  if (G.cdiff === 'm' && G.mod) banner('MÍTICA', `Tu castigo: ${G.mod.deb.name} · CPU: ${G.mod.buf.name}`, 'chaos');
  else banner('DIFÍCIL', isCorp(G.efac) ? 'Sus robots grandes van equipados' : `${CFG.cards[FACTIONS[G.efac].leader].name} va equipado hasta los dientes`, 'enemy');
}
// v0.9.13: en Difícil y Mítica se ve arriba a la izquierda qué está en juego (tócalo para leerlo entero)
function hudMods() {
  const box = $('#hud-mods'); if (!box) return;
  const bh = G.mode === 'boss' && G.bossDiff && G.bossDiff !== 'n', on = bh || (G.mode === 'camp' && G.cdiff && G.cdiff !== 'n');
  box.hidden = !on; if (!on) { box.innerHTML = ''; return; }
  const C = bh ? BDIFF[G.bossDiff] : CDIFF[G.cdiff], M = bh ? null : G.mod;
  let h = `<div class="hm lvl" data-hm="lvl"><b>${C.name.toUpperCase()}</b>rival de nivel ${G.elvl}</div>`;
  if (M) h += `<div class="hm bad" data-hm="deb"><b>TU CASTIGO</b>${M.deb.name}</div><div class="hm good" data-hm="buf"><b>CPU</b>${M.buf.name}</div>`;
  box.innerHTML = h;
  for (const el of box.querySelectorAll('[data-hm]')) el.onclick = () => {
    const k = el.dataset.hm, t = k === 'deb' ? `${M.deb.name}: ${M.deb.desc}` : k === 'buf' ? `Ventaja de la CPU, ${M.buf.name}: ${M.buf.desc}` : `${C.name}: rival de nivel ${G.elvl}, más CAOS y tropas de élite${G.egear ? '; su líder va equipado' : ''}.`;
    toast(t, true);
  };
}
// vida, daño y extras de verdad: nivel + habilidad del gashapón + equipo del líder
function effStats(k, fac) {
  const d = CFG.units[k], lv = uSave(k).lvl, m = 1 + (lv - 1) * ECON.lvlStep;
  const u = { type: k, d, team: 'p', r: d.r, mHp: 1, mDmg: 1, mSpeed: 1, mCd: 1, mScale: 1, stealthT: 0 };
  applyAbility(u);
  if (isLeader(k)) { const E = SAVE.equip[fac] || {}; for (const sl in SLOTS) { const it = invGet(E[sl]); if (it && it.k === 'eq' && ITEMS[it.id] && it.id !== 'cofre') applyItem(u, it); } }
  const pc = x => Math.round((x - 1) * 100), sg = n => (n > 0 ? '+' : '') + n + ' %', b = [];
  if (pc(u.mHp)) b.push(sg(pc(u.mHp)) + ' de vida');
  if (pc(u.mDmg)) b.push(sg(pc(u.mDmg)) + ' de daño');
  if (pc(u.mSpeed)) b.push(sg(pc(u.mSpeed)) + ' de velocidad');
  if (u.mCd !== 1) b.push('ataca un ' + Math.round((1 / u.mCd - 1) * 100) + ' % más rápido');
  if (u.mRange && pc(u.mRange)) b.push(sg(pc(u.mRange)) + ' de alcance');
  if (u.regen) b.push('se cura un ' + fmtV(rnd(u.regen * 100, 1)) + ' % por segundo');
  if (u.abArmor) b.push('recibe un ' + Math.round(u.abArmor * 100) + ' % menos de daño');
  const st = 1 + cardStars(k) * ECON.starStep;   // v0.9.15: estrellas
  return { hp: d.hp * m * u.mHp * st, dmg: d.dmg * m * u.mDmg * st, boosts: b, u };
}
// al entrar en el campo, tus cartas enseñan su habilidad y su equipo (así se ve que funcionan)
const OWN_CALLOUT = ['speedrun', 'modofoto', 'microtrans', 'gigante', 'sigilo'];
function showLoadout(u) {
  if (u.team !== 'p' || u.summon || u.isClone) return;
  if (u.ab && !OWN_CALLOUT.includes(u.ab)) addNum(u.x, u.y, topOf(u) + 26, ABILITIES[u.ab].name.toUpperCase(), '#ffe06a', 13);
  if (u.equip) addNum(u.x, u.y, topOf(u) + 40, 'EQUIPADO', '#ffcb3d', 12);
}
function legendaryPrize() {
  const k = Math.random() < 0.5 ? 'ab' : 'eq', DB = k === 'ab' ? ABILITIES : ITEMS, pool = Object.keys(DB).filter(id => DB[id].rar === 'legendary' && !DB[id].pass && (k === 'ab' || !DB[id].fac));
  return newCopy(k, pick(pool), 3);
}
// ---- ruleta semanal de la Mítica: un castigo para ti y una ventaja para la CPU (igual para todo el mundo esa semana)
const MYTH_DEB = [
  { id: 'recorte', short: 'Recorte', name: 'Recorte de presupuesto', desc: 'tu CAOS se recarga un 30 % más lento.' },
  { id: 'lag', short: 'Lag', name: 'Lag', desc: 'tus unidades van un 20 % más lentas.' },
  { id: 'parche', short: 'Parche', name: 'Parche sorpresa', desc: 'tus unidades tienen un 20 % menos de vida.' },
  { id: 'carga', short: 'Carga', name: 'Pantalla de carga', desc: 'tus cartas tardan 1,5 segundos más en entrar.' },
  { id: 'vacaciones', short: 'Sin líder', name: 'Líder de vacaciones', desc: 'tu líder tarda el doble en volver.' },
  { id: 'carton', short: 'Cartón', name: 'Torres de cartón', desc: 'tus torres y tu base tienen un 35 % menos de vida.' },
  { id: 'sincaos', short: 'Sin CAOS', name: 'Sin presupuesto', desc: 'empiezas cada partida sin CAOS.' },
  { id: 'becarios', short: 'Becarios', name: 'Becarios en prácticas', desc: 'tus unidades hacen un 20 % menos de daño.' },
];
const MYTH_BUF = [
  { id: 'horas', short: 'Horas extra', name: 'Horas extra', desc: 'sus unidades atacan un 30 % más rápido.' },
  { id: 'inversion', short: 'Inversión', name: 'Inversión millonaria', desc: 'la CPU gana CAOS un 30 % más rápido.' },
  { id: 'blindaje', short: 'Blindaje', name: 'Torres blindadas', desc: 'sus torres y su sede tienen un 40 % más de vida.' },
  { id: 'robots', short: 'Robots', name: 'Robots nuevos', desc: 'sus unidades tienen un 25 % más de vida.' },
  { id: 'torretas', short: 'Torretas', name: 'Torretas turbo', desc: 'sus torres disparan un 40 % más rápido.' },
  { id: 'bonus', short: 'Bonus', name: 'Bonus de productividad', desc: 'sus unidades hacen un 25 % más de daño.' },
  { id: 'despidos', short: 'Despidos', name: 'Despidos rentables', desc: 'cada unidad tuya que cae le da 1 de CAOS.' },
  { id: 'turbo', short: 'Turbo', name: 'Turbo', desc: 'sus unidades van un 25 % más rápido.' },
];
function mythicWeek() { const sd = seedOf('mitica-' + weekStr()); return { deb: MYTH_DEB[sd % MYTH_DEB.length], buf: MYTH_BUF[Math.floor(sd / 8) % MYTH_BUF.length] }; }
function modBoxHtml() {
  const M = mythicWeek();
  return `<div class="mod-box"><div class="mod-head ol">ESTA SEMANA EN MÍTICA<small>cambia en ${untilStr(true)}</small></div><div class="mod-row bad"><b>TU CASTIGO</b>${M.deb.name}: ${M.deb.desc}</div><div class="mod-row good"><b>VENTAJA DE LA CPU</b>${M.buf.name}: ${M.buf.desc}</div><button class="chip-btn" id="btn-rl-again">VER LA RULETA</button></div>`;
}
const RL = { phase: 'p', ang: 0, spin: null, wk: null };
function openRoulette() { RL.wk = mythicWeek(); RL.phase = 'p'; RL.ang = 0; RL.spin = null; rlPhaseUi(false); $('#scr-roulette').hidden = false; drawRoulette(); }
function rlPhaseUi(done) {
  const p = RL.phase === 'p', r = $('#rl-res');
  $('#rl-title').textContent = p ? 'TU CASTIGO DE LA SEMANA' : 'LA VENTAJA DE LA CPU';
  $('#rl-sub').textContent = p ? 'La ruleta de Microblizz decide cómo te complica la Mítica esta semana. Cambia cada lunes.' : 'Y ahora, el regalo de Microblizz para la CPU.';
  r.className = 'rl-res ' + (p ? 'bad' : 'good');
  if (done) { const x = p ? RL.wk.deb : RL.wk.buf; r.innerHTML = `<b class="ol">${x.name}</b>${x.desc.charAt(0).toUpperCase() + x.desc.slice(1)}`; } else r.innerHTML = '';
  $('#btn-rl').textContent = !done ? '¡GIRAR!' : p ? 'SIGUIENTE' : '¡A JUGAR!';
  $('#btn-rl').disabled = false; $('#btn-rl-skip').hidden = !!done && !p;
}
function rlClose() { RL.spin = null; $('#scr-roulette').hidden = true; if (SAVE.rlWeek !== weekStr()) { SAVE.rlWeek = weekStr(); saveGame(); } play('select'); if (!$('#scr-camp').hidden) buildCamp(); }
$('#btn-rl').addEventListener('click', () => {
  if (RL.spin) return;
  if (!$('#rl-res').innerHTML) { rlSpin(); return; }
  if (RL.phase === 'p') { RL.phase = 'c'; RL.ang = 0; rlPhaseUi(false); drawRoulette(); play('select'); return; }
  rlClose();
});
$('#btn-rl-skip').addEventListener('click', rlClose);
function rlSpin() {
  stat('rlspin', 1);
  const list = RL.phase === 'p' ? MYTH_DEB : MYTH_BUF, TAU = Math.PI * 2, seg = TAU / list.length;
  const idx = list.indexOf(RL.phase === 'p' ? RL.wk.deb : RL.wk.buf), want = -(idx * seg + seg / 2);
  const from = RL.ang, to = from + ((((want - from) % TAU) + TAU) % TAU) + TAU * (REDUCED ? 1 : 5);
  RL.spin = { from, to, t0: performance.now(), dur: REDUCED ? 900 : 3800, last: Math.floor(from / seg) };
  $('#btn-rl').disabled = true; audioInit(); play('roll');
  requestAnimationFrame(rlFrame);
}
function rlFrame(now) {
  const sp = RL.spin; if (!sp || $('#scr-roulette').hidden) { RL.spin = null; return; }
  const k = Math.min(1, (now - sp.t0) / sp.dur), e = 1 - Math.pow(1 - k, 3), seg = Math.PI * 2 / (RL.phase === 'p' ? MYTH_DEB : MYTH_BUF).length;
  RL.ang = sp.from + (sp.to - sp.from) * e;
  const cur = Math.floor(RL.ang / seg); if (cur !== sp.last) { sp.last = cur; play('tick'); }
  drawRoulette();
  if (k < 1) { requestAnimationFrame(rlFrame); return; }
  RL.spin = null; rlPhaseUi(true); play(RL.phase === 'p' ? 'sad' : 'womp');
}
function drawRoulette() {
  const cv = $('#rl-cv'), R2 = 2, SZ = 300; if (cv.width !== SZ * R2) { cv.width = SZ * R2; cv.height = SZ * R2; }
  const c = cv.getContext('2d'); c.setTransform(R2, 0, 0, R2, 0, 0); c.clearRect(0, 0, SZ, SZ);
  const p = RL.phase === 'p', list = p ? MYTH_DEB : MYTH_BUF, n = list.length, seg = Math.PI * 2 / n, cx = 150, cy = 158, r = 124;
  const cols = p ? ['#ff6b6b', '#b0213a'] : ['#4f8dff', '#1d3f8a'];
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.arc(cx, cy + 6, r + 10, 0, Math.PI * 2); c.fill();
  c.fillStyle = OL; c.beginPath(); c.arc(cx, cy, r + 10, 0, Math.PI * 2); c.fill();
  c.fillStyle = p ? '#ffcb3d' : '#9fd0ff'; c.beginPath(); c.arc(cx, cy, r + 6, 0, Math.PI * 2); c.fill();
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + RL.ang + i * seg;
    c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, a0, a0 + seg); c.closePath(); c.fillStyle = cols[i % 2]; c.fill(); c.lineWidth = 2.5; c.strokeStyle = OL; c.stroke();
    c.save(); c.translate(cx, cy); c.rotate(a0 + seg / 2); c.textAlign = 'right'; c.textBaseline = 'middle';
    let fs = 16; c.font = `${fs}px ${FONT_D}`; while (c.measureText(list[i].short).width > r - 44 && fs > 9) { fs -= 1; c.font = `${fs}px ${FONT_D}`; }
    c.lineJoin = 'round'; c.lineWidth = 4; c.strokeStyle = OL; c.strokeText(list[i].short, r - 10, 1); c.fillStyle = '#fff6ea'; c.fillText(list[i].short, r - 10, 1); c.restore();
  }
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, on = RL.spin ? (Math.floor(performance.now() / 120) + i) % 2 === 0 : i % 2 === 0; c.beginPath(); c.arc(cx + Math.cos(a) * (r + 6), cy + Math.sin(a) * (r + 6), 3, 0, Math.PI * 2); c.fillStyle = on ? '#fff6ea' : '#7a5310'; c.fill(); }
  c.beginPath(); c.arc(cx, cy, 24, 0, Math.PI * 2); c.fillStyle = '#ffcb3d'; c.fill(); c.lineWidth = 4; c.strokeStyle = OL; c.stroke();
  c.font = `11px ${FONT_D}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = OL; c.fillText(p ? 'TÚ' : 'CPU', cx, cy + 1);
  c.beginPath(); c.moveTo(cx - 15, cy - r - 20); c.lineTo(cx + 15, cy - r - 20); c.lineTo(cx, cy - r + 8); c.closePath(); c.fillStyle = '#fff6ea'; c.fill(); c.lineWidth = 3.5; c.strokeStyle = OL; c.stroke();
}
// ---- efectos nuevos (habilidades y objetos de la v0.9.12)
function onLand(u) {
  if (u.abRun) { u.runT = u.abRun; addNum(u.x, u.y, topOf(u) + 18, '¡SPEEDRUN!', '#7df3ff', 13); }
  if (u.abDrink) { u.drinkT = 10; addNum(u.x, u.y, topOf(u) + 44, '¡BEBIDA XXL!', '#9ef07a', 12); }
  if (u.abSteal && S && G.state === 'play') {
    const foe = other(u.team), n = Math.min(S[foe].chaos, u.abSteal);
    if (n > 0.05) { S[foe].chaos -= n; S[u.team].chaos = Math.min(CFG.chaosMax, S[u.team].chaos + n); addNum(u.x, u.y, topOf(u) + 22, `¡MICROPAGO! +${fmtV(rnd(n, 1))} CAOS`, '#ff9be6', 13); if (u.team === 'p') chatEv('ability', null, null, 0.4, 15); }
  }
  if (u.abPhoto) {
    let n = 0; for (const o of units) if (o.alive && o.team !== u.team && !o.immuneCC && o.deployT <= 0 && dist(o, u) <= 85) { o.stunT = Math.max(o.stunT, u.abPhoto); o.stunKind = 'daze'; n++; }
    flashAt(u.x, u.y, 18, 100, '255,255,255', 0.55); ring(u.x, u.y, 8, 85, 'rgba(255,255,255,.9)', 0.35, 4, true); addNum(u.x, u.y, topOf(u) + 22, '¡FOTO!', '#ffffff', 15); play('zap');
    if (n && u.team === 'p') chatEv('ability', null, null, 0.4, 15);
  }
  if (u.abGiant) addNum(u.x, u.y, topOf(u) + 12, '¡MODO GIGANTE!', '#ffcb3d', 13);
  if (u.geared && u.team === 'e') addNum(u.x, u.y, topOf(u) + 30, 'EQUIPADO', '#ffcb3d', 12);
  showLoadout(u);
}
function tickExtras(u, dt) {
  if (u.ignT > 0) u.ignT -= dt;
  for (const k of ['disarmT', 'zombT', 'shrinkT', 'confT', 'hasteT', 'crunchT']) if (u[k] > 0) { u[k] -= dt; if (k === 'confT' && u[k] <= 0) { u.target = null; u.retarget = 0; } }   // v0.9.15: efectos de hechizos
  if (u.crunchT > 0) {   // v0.9.20: hechizo Crunch: pega el doble de rápido pero se va quemando
    u.crAcc = (u.crAcc || 0) + u.maxHp * (u.crunchDrain || 0.04) * dt; u.crTk = (u.crTk || 0) + dt;
    if (u.crTk >= 0.5 && u.crAcc >= 1) { const n = Math.floor(u.crAcc); u.crAcc -= n; u.crTk = 0; if (u.hp - n >= 1) u.hp -= n; else hurt(u, n, null, 'rage'); if (Math.random() < 0.12) addNum(u.x, u.y, topOf(u) + 16, pick(['¡CRUNCH!', '¿Y las vacaciones?', 'Café nº 14']), '#ff8a3d', 12); }
  }
  if (u.bshT > 0) { u.bshT -= dt; if (u.bshT <= 0) u.bshield = 0; }
  if (u.actT > 0) u.actT -= dt;
  if (u.markT > 0) u.markT -= dt;
  if (u.d.fury && !u.furySaid && u.hp < u.maxHp * u.d.fury.f) { u.furySaid = true; addNum(u.x, u.y, topOf(u) + 20, '¡FURIA DE TITÁN!', '#ff8a3d', 15); flashAt(u.x, u.y, topOf(u) * 0.5, 60, '255,120,40', 0.3); shake(3); play('slam'); }
  if (u.runT > 0) { u.runT -= dt; if (Math.random() < dt * 14) parts.push({ type: 'dust', x: u.x - u.face * 8, y: u.y, z: 3, vx: 0, vy: 0, vz: 6, g: 0, life: 0.4, max: 0.4, size: 3, color: '#cfe9ff' }); }
  if (u.drinkT > 0) u.drinkT -= dt;
  if (u.invulnT > 0) { u.invulnT -= dt; if (Math.random() < dt * 8) ring(u.x, u.y, 4, u.r * 2.3, 'rgba(125,243,255,.85)', 0.25, 3); }
  if (u.abAura) {
    u.auraT = (u.auraT || 0) - dt; if (u.auraT > 0) return; u.auraT = 1; let any = false;
    for (const a of units) if (a.alive && a.team === u.team && a.deployT <= 0 && a.hp < a.maxHp && dist(a, u) <= 80) { a.hp = Math.min(a.maxHp, a.hp + a.maxHp * u.abAura); any = true; }
    if (any) ring(u.x, u.y, 4, 80, 'rgba(140,240,90,.45)', 0.45, 2, true);
  }
}
function deathExtras(t, src) {
  if (G.state !== 'play') return;
  if (t.abRage) {
    const dmg = t.abRage * (t.mLvl || 1);
    for (const o of units) if (o.alive && o.team !== t.team && Math.hypot(o.x - t.x, o.y - t.y) - o.r <= 64) hurt(o, dmg, null, 'aoe');
    ring(t.x, t.y, 8, 80, 'rgba(255,90,90,.9)', 0.45, 6); puff(t.x, t.y, 10, '#ff6b6b', 70, 8, false, 12); addNum(t.x, t.y, topOf(t) + 26, '¡RAGE QUIT!', '#ff6b6b', 16); shake(4); play('trash');
    if (t.team === 'p') chatEv('ability', null, null, 0.5, 15);
  }
  if (t.abDlc) { S[t.team].chaos = Math.min(CFG.chaosMax, S[t.team].chaos + t.abDlc); addNum(t.x, t.y, topOf(t) + 30, `DLC: +${fmtV(t.abDlc)} CAOS`, '#d08cff', 13); }
  if (src && src.abMagnet && src.alive && src.kind === 'unit') { S[src.team].chaos = Math.min(CFG.chaosMax, S[src.team].chaos + src.abMagnet); addNum(src.x, src.y, topOf(src) + 14, `+${fmtV(src.abMagnet)} CAOS`, '#f3a6ff', 11); }
  if (t.team === 'p' && G.eKillChaos && !t.summon) S.e.chaos = Math.min(CFG.chaosMax, S.e.chaos + G.eKillChaos);
}
function confetti(u, t, dmg) {   // Lanzaconfeti: el golpe salpica a los de alrededor
  for (const o of units) if (o !== t && o.alive && o.team !== u.team && targetable(o) && dist(o, t) - o.r <= 48) hurt(o, dmg, u, 'aoe');
  chips(t.x, t.y, topOf(t) * 0.6, 8, ['#ff5fa8', '#ffe14d', '#7be04a', '#63cfe0', '#d08cff'], 'chip', 3);
}
