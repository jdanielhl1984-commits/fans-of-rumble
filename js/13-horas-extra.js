// Fans of Rumble · HORAS EXTRA: el minijuego del menú
'use strict';
/* ---------- v0.9.14: HORAS EXTRA, el minijuego del menú: tu líder sigue luchando aunque no juegues ---------- */
// Gana oro, gemas y a veces un objeto por hora según su poder de verdad (nivel, habilidad y equipo). Se llena a las 12 h.
const IDLE = { cap: 12, gold: 60, gExp: 1.6, gems: 1, gemsK: 2.5, item: 0.02, itemK: 0.05 };
const IDLE_MOBS = ['becario', 'starbot', 'cajabotin', 'soportebot', 'descargabot', 'licenciabot', 'plusbot'];
const IDLE_SAY = {
  mob: ['¡Vuelve al trabajo!', 'Esto no cuenta como horas extra', '¡Firma el despido!', '¿Y tu productividad?', '¡Sin pausa para el café!', 'Reunión en 5 minutos', '¡Suscríbete!'],
  hero: ['¡Esto lo cobro yo!', '¡Por los fans!', 'Otra reunión más…', '¡El siguiente!', 'Mi jornada no acaba nunca', '¡Sin pausa!'],
};
const CHEST_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 9h14v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5z" fill="#c2772d" style="stroke: var(--outline)" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 9V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2z" fill="#e0a050" style="stroke: var(--outline)" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 8h3v4h-3z" fill="#ffcb3d" style="stroke: var(--outline)" stroke-width="1.2"/></svg>';
const idleFacOk = f => !!(f && FACTIONS[f] && FACTIONS[f].leader && !isCorp(f) && isUnlocked(f));
let idleR = null;   // ritmo por hora del líder que trabaja
function idleState() {
  const I = SAVE.idle || (SAVE.idle = { fac: '', h: 0, gold: 0, gems: 0, items: 0, last: Date.now() });
  if (!idleFacOk(I.fac)) I.fac = idleFacOk(G.faction) ? G.faction : FACTION_ORDER.find(idleFacOk) || 'animales';
  if (!(I.last > 0)) I.last = Date.now();
  for (const k of ['h', 'gold', 'gems', 'items']) if (!(I[k] >= 0)) I[k] = 0;
  return I;
}
// poder del líder: 100 = nivel 1 sin nada; sube con el nivel, la habilidad y el equipo (lo que de verdad lleva en la batalla)
function idlePower(fac) {
  const k = FACTIONS[fac].leader, d = CFG.units[k], es = effStats(k, fac), E = SAVE.equip[fac] || {};
  let n = invGet(SAVE.abEquip[k]) ? 1 : 0; for (const sl in SLOTS) { const it = invGet(E[sl]); if (it && it.k === 'eq') n++; }
  return Math.max(1, Math.sqrt((es.hp / d.hp) * (es.dmg / d.dmg) / Math.max(0.4, es.u.mCd)) + 0.05 * n);
}
function idleRates(fac) { const pw = idlePower(fac); return { pw, gold: IDLE.gold * Math.pow(pw, IDLE.gExp), gems: IDLE.gems + (pw - 1) * IDLE.gemsK, item: IDLE.item + (pw - 1) * IDLE.itemK }; }
// suma lo ganado desde la última vez, hasta el tope de 12 h (si el reloj va hacia atrás no se suma nada)
function idleTick(now) {
  const I = idleState(); now = now || Date.now();
  const dh = Math.min((now - I.last) / 3600000, IDLE.cap - I.h), from = I.last; I.last = now;
  idleR = idleRates(I.fac);
  // v0.9.16: con el turbo (anuncio) gana el doble mientras dura
  const td = dh > 0 && I.turbo > from ? Math.min(dh, (Math.min(now, I.turbo) - from) / 3600000) : 0, x = dh + Math.max(0, td);
  if (dh > 0) { I.h = Math.min(IDLE.cap, I.h + dh); I.gold += idleR.gold * x; I.gems += idleR.gems * x; I.items += idleR.item * x; }
  return I;
}
const idleFull = () => idleState().h >= IDLE.cap - 1e-6;
function idleItem() {   // un objeto o una habilidad al azar con las probabilidades del gashapón (sin tocar sus garantías)
  const kind = Math.random() < 0.5 ? 'ab' : 'eq', DB = kind === 'ab' ? ABILITIES : ITEMS;
  let x = Math.random() * 100, rar = 'common'; for (const k of ['legendary', 'epic', 'rare']) { if (x < ECON.odds[k]) { rar = k; break; } x -= ECON.odds[k]; }
  const pool = Object.keys(DB).filter(id => DB[id].rar === rar && !DB[id].pass && (kind === 'ab' || !DB[id].fac || isUnlocked(DB[id].fac)));
  return newCopy(kind, pick(pool), 0);
}
function idleCollect(x2) {   // v0.9.16: x2 = premio doble por anuncio
  const I = idleTick(), m = x2 ? 2 : 1, g = Math.floor(I.gold), gm = Math.floor(I.gems), ni = Math.floor(I.items), h = I.h, full = h >= IDLE.cap - 1e-6;
  if (g < 1 && gm < 1 && ni < 1) { play('deny'); toast('Todavía no hay nada. ¡Dale un rato a tu líder!'); return; }
  I.gold -= g; I.gems -= gm; I.items -= ni; I.h = 0; SAVE.gold += g * m; SAVE.gems += gm * m;
  const got = []; for (let i = 0; i < ni * m; i++) got.push(idleItem());
  stat('idle', 1, true); stat('idleh', h, true); stat('idleg', g, true); stat('idlem', gm, true); if (ni) stat('idlei', ni, true); if (full) stat('idlefull', 1, true);
  achScan(); saveGame(); updateWallets(); play('crown'); idleBurst(); idleUI(true);
  toast(`Horas extra${x2 ? ' x2' : ''}: +${fmt(g * m)} de oro${gm ? ` y +${fmt(gm * m)} ${gm * m > 1 ? 'gemas' : 'gema'}` : ''}`, true);
  if (got.length) setTimeout(() => confirmBox(got.length > 1 ? `¡${got.length} OBJETOS!` : '¡HA ENCONTRADO ALGO!', got.map(it => { const D = defOf(it); return `<b>${D.name}</b> · ${RARITY[D.rar][0]}, calidad ${QTIERS[tierOf(avgQ(it))].name}`; }).join('<br>') + '<small>Tu líder lo ha encontrado haciendo horas extra. Ya lo tienes en el inventario.</small>', null, null, '¡GENIAL!'), 650);
}
function idleSetHero(f) {
  if (!idleFacOk(f)) return;
  const I = idleTick(); $('#scr-idle').hidden = true; if (I.fac === f) { play('select'); return; }
  I.fac = f; idleR = idleRates(f); stat('idleswap', 1); saveGame(); play('select'); idleSc.mobs.length = 0; idleSc.fx.length = 0; idleUI(true);
  toast(`${CFG.cards[FACTIONS[f].leader].name} empieza su turno de horas extra`, true);
}
function openIdlePick() {
  const I = idleTick(), L = FACTION_ORDER.filter(idleFacOk);
  $('#idle-list').innerHTML = L.map(f => {
    const k = FACTIONS[f].leader, R = idleRates(f), on = f === I.fac;
    return `<button class="idle-opt" data-idf="${f}" aria-pressed="${on}"><canvas aria-hidden="true"></canvas><span><b>${CFG.cards[k].name}</b><small>${FACTIONS[f].name} · nivel ${uSave(k).lvl}${on ? ' · <em>TRABAJANDO</em>' : ''}</small><small>Cada hora: ${fmt(R.gold)} de oro · ${fmtV(rnd(R.gems, 1))} ${rnd(R.gems, 1) === 1 ? 'gema' : 'gemas'}</small></span><span class="pw">${Math.round(R.pw * 100)}<small>PODER</small></span></button>`;
  }).join('');
  for (const b of $('#idle-list').querySelectorAll('[data-idf]')) { drawArt(b.querySelector('canvas'), FACTIONS[b.dataset.idf].leader, 44, 44); b.onclick = () => idleSetHero(b.dataset.idf); }
  const nl = FACTION_ORDER.length - L.length;
  $('#idle-more').textContent = nl ? `Libera más facciones en la campaña para tener más líderes (te ${nl > 1 ? 'faltan ' + nl : 'falta 1'}).` : '';
  $('#scr-idle').hidden = false; play('select');
}
let idleUIKey = '', idleFaceKey = '';
function idleUI(force) {
  if (!$('#idle')) return;
  const I = idleState(), R = idleR || (idleR = idleRates(I.fac)), k = FACTIONS[I.fac].leader, full = I.h >= IDLE.cap - 1e-6;
  const nI = Math.floor(I.items), pc = Math.floor((I.items - nI) * 100), hh = Math.floor(I.h * 10) / 10;
  const key = [I.fac, full, Math.floor(I.gold), Math.floor(I.gems), nI, pc, hh, Math.round(R.gold), Math.round(R.gems * 10), Math.round(R.pw * 100)].join('|');
  if (key === idleUIKey && !force) return; idleUIKey = key;
  $('#idle').classList.toggle('full', full); $('#idle-full').hidden = !full;
  $('#idle-sub').textContent = full ? 'Ya no cabe más: recoge lo que ha ganado' : 'Tu líder sigue luchando aunque no juegues';
  $('#idle-clock').innerHTML = `${full ? '¡LLENO! ' : ''}${fmtV(hh)} h / ${IDLE.cap} h<i style="--p:${Math.min(100, (I.h / IDLE.cap) * 100)}%"></i>`;
  $('#idle-acc').innerHTML = `<div class="ia">${COIN_SVG}<span>${fmt(I.gold)}</span>${GEM_SVG}<span>${fmt(I.gems)}</span>${CHEST_SVG}<span>${nI ? 'x' + nI : pc + ' %'}</span></div><small>Por hora: ${COIN_SVG}${fmt(R.gold)} ${GEM_SVG}${fmtV(rnd(R.gems, 1))}</small>`;
  $('#idle-name').textContent = CFG.cards[k].name; $('#idle-pw').textContent = `Poder ${Math.round(R.pw * 100)}`;
  $('#idle-get').setAttribute('aria-label', `Recoger ${fmt(I.gold)} de oro y ${fmt(I.gems)} gemas`);
  if (idleFaceKey !== k) { idleFaceKey = k; drawArt($('#idle-face'), k, 38, 38); }
  fitText($('#idle-name'), 15, 11);
  adIdleUI();   // v0.9.16
}
// ---- la escena: scroll lateral con parallax; el líder pega a los bots de Microblizz y Phony que van llegando
const idleSc = { t: 0, off: 0, walk: 0, mobs: [], fx: [], cw: 0, ch: 0, R: 0, L: null, lfac: '', tick: 0, atkT: 0.6, lunge: 0, jump: 0, jumpHit: true, hit: 0, hp: 1, spec: 5, spawn: 0.3, wave: 0, sayT: 6, eu: null, pend: null, pendT: 0 };
function idleBuild(cw, ch, fac) {
  const TH = THEMES[fac] || THEMES.animales, R = idleSc.R, k = idleSc.k, gy = idleSc.gy, W2 = Math.ceil(cw * 2);
  const mk = w => { const c = document.createElement('canvas'); c.width = Math.ceil(w * R); c.height = Math.ceil(ch * R); const x = c.getContext('2d'); x.scale(R, R); x.lineJoin = 'round'; x.lineCap = 'round'; return [c, x]; };
  const rng = mulberry32(91), r = (a, b) => a + rng() * (b - a);
  // cielo de tarde-noche (horas extra) con estrellas y luna
  const [sky, s] = mk(cw);
  let g = s.createLinearGradient(0, 0, 0, ch); g.addColorStop(0, '#1d1240'); g.addColorStop(0.5, '#4a2878'); g.addColorStop(0.8, '#b0577f'); g.addColorStop(1, '#f39a7a');
  s.fillStyle = g; s.fillRect(0, 0, cw, ch);
  for (let i = 0; i < 34; i++) { s.globalAlpha = r(0.35, 0.9); s.fillStyle = '#fff6ea'; s.beginPath(); s.arc(r(0, cw), r(0, ch * 0.5), r(0.5, 1.4), 0, Math.PI * 2); s.fill(); }
  s.globalAlpha = 0.25; s.fillStyle = '#ffe9b0'; s.beginPath(); s.arc(cw * 0.6, ch * 0.2, 17 * k, 0, Math.PI * 2); s.fill();
  s.globalAlpha = 1; s.fillStyle = '#fff1c9'; s.beginPath(); s.arc(cw * 0.6, ch * 0.2, 10 * k, 0, Math.PI * 2); s.fill();
  // ciudad lejana: oficinas con la luz encendida y carteles de las empresas
  const [far, f] = mk(W2), base = gy - 10 * k;
  const blds = []; for (let x = 0; x < W2;) { const w = r(26, 52) * k, h = r(0.28, 0.62) * ch; blds.push([x, w, h]); x += w + r(2, 10) * k; }
  for (const [x, w, h] of blds) for (const dx of [0, W2]) {
    f.fillStyle = '#2b1d52'; f.fillRect(x - dx, base - h, w, h + 12 * k);
    f.fillStyle = '#3a2a6b'; f.fillRect(x - dx, base - h, w, 3 * k);
    for (let wy = base - h + 7 * k; wy < base - 4 * k; wy += 9 * k) for (let wx = x - dx + 4 * k; wx < x - dx + w - 6 * k; wx += 8 * k) if (((wx * 13 + wy * 7) | 0) % 5 < 3) { f.fillStyle = ((wx + wy) | 0) % 7 < 2 ? 'rgba(130,190,255,.55)' : 'rgba(255,214,120,.6)'; f.fillRect(wx, wy, 3.4 * k, 4.2 * k); }
  }
  const sign = (x, y, w, h, bg, fg, txt, sz) => { for (const dx of [0, W2]) { f.fillStyle = OL; f.fillRect(x - dx + w * 0.22, y + h, 2.4 * k, base - y - h); f.fillRect(x - dx + w * 0.78 - 2.4 * k, y + h, 2.4 * k, base - y - h); f.fillStyle = OL; f.fillRect(x - dx - 2, y - 2, w + 4, h + 4); f.fillStyle = bg; f.fillRect(x - dx, y, w, h); f.fillStyle = fg; f.font = `${sz * k}px ${FONT_D}`; f.textAlign = 'center'; f.textBaseline = 'middle'; f.fillText(txt, x - dx + w / 2, y + h / 2 + 1); } };
  sign(W2 * 0.08, base - ch * 0.5, 104 * k, 22 * k, '#ffe06a', '#7a3d00', 'HORAS EXTRA = PASIÓN', 9);
  sign(W2 * 0.36, base - ch * 0.62, 84 * k, 20 * k, '#2e8bff', '#fff', 'MICROBLIZZ', 11);
  sign(W2 * 0.58, base - ch * 0.46, 96 * k, 22 * k, '#334155', '#ffcb3d', 'PAYSTATION · SIN DISCOS', 8);
  sign(W2 * 0.82, base - ch * 0.56, 92 * k, 22 * k, '#ff5fa8', '#fff', '¡COMPRA EL PASE!', 9.5);
  // arbustos y árboles del color de la facción
  const [mid, m] = mk(W2), mb = gy - 3 * k;
  for (let x = 0; x < W2; x += r(40, 80) * k) for (const dx of [0, W2]) {
    const X = x - dx;
    if (rng() < 0.35) { m.fillStyle = '#5b3a24'; m.fillRect(X - 2.5 * k, mb - 30 * k, 5 * k, 30 * k); for (const [ox, oy, rr2] of [[0, -36, 15], [-10, -28, 11], [10, -28, 11]]) { m.beginPath(); m.arc(X + ox * k, mb + oy * k, rr2 * k, 0, Math.PI * 2); m.fillStyle = TH.hedge[0]; m.fill(); m.lineWidth = 2; m.strokeStyle = OL; m.stroke(); } m.beginPath(); m.arc(X - 3 * k, mb - 40 * k, 6 * k, 0, Math.PI * 2); m.fillStyle = TH.hedge[1]; m.fill(); }
    else { for (const [ox, rr2] of [[-9, 9], [0, 12], [10, 8]]) { m.beginPath(); m.arc(X + ox * k, mb - rr2 * 0.55 * k, rr2 * k, Math.PI, 0); m.closePath(); m.fillStyle = TH.greens[3]; m.fill(); m.lineWidth = 2; m.strokeStyle = OL; m.stroke(); } }
  }
  return { sky, far, mid, W2 };
}
function idleSize() {
  const cv = $('#idle-cv'); if (!cv) return false;
  const cw = cv.clientWidth, ch = cv.clientHeight; if (!cw || !ch) return false;
  const R = SAVE.pixel ? 0.4 : clamp(Math.round((VIEW.sc || 1) * (window.devicePixelRatio || 1) * 2) / 2, 1, 2), fac = idleState().fac;
  if (cw === idleSc.cw && ch === idleSc.ch && R === idleSc.R && fac === idleSc.lfac && idleSc.L) return true;
  Object.assign(idleSc, { cw, ch, R, lfac: fac }); idleSc.hh = clamp(ch * 0.44, 54, 112); idleSc.k = idleSc.hh / 64; idleSc.gy = ch - Math.max(15, ch * 0.11);
  cv.width = Math.round(cw * R); cv.height = Math.round(ch * R); idleSc.L = idleBuild(cw, ch, fac); idleSc.mobs.length = 0;
  return true;
}
function idleSay(x, y, txt) { idleSc.fx.push({ k: 'say', x, y, txt, t: 2.4, max: 2.4 }); }
function idleHurt(m, dmg, big) {
  const S2 = idleSc; if (m.dead) return;
  m.hp -= dmg; m.hitT = 0.12; S2.fx.push({ k: 'num', x: m.x + rand(-6, 6), y: S2.gy - m.h * 0.8, txt: String(Math.round(dmg)), col: big ? '#ffe06a' : '#fff6ea', sz: big ? 19 : 15, t: 0.8, max: 0.8 });
  if (m.hp > 0) return;
  m.dead = true; m.die = 0.45; S2.wave++;
  for (let i = 0; i < 8; i++) S2.fx.push({ k: 'puff', x: m.x + rand(-10, 10) * S2.k, y: S2.gy - rand(4, m.h * 0.6), vx: rand(-30, 30), vy: rand(-40, -10), r: rand(3, 6) * S2.k, t: 0.5, max: 0.5 });
  const n = 3 + ((Math.random() * 3) | 0); for (let i = 0; i < n; i++) S2.fx.push({ k: 'coin', x: m.x, y: S2.gy - m.h * 0.5, vx: rand(-50, 70), vy: rand(-170, -110), t: 1.3, max: 1.3 });
  if (Math.random() < 0.18) S2.fx.push({ k: 'gem', x: m.x, y: S2.gy - m.h * 0.6, vx: rand(-20, 40), vy: rand(-190, -140), t: 1.4, max: 1.4 });
}
function idleBurst() { const S2 = idleSc; for (let i = 0; i < 22; i++) S2.fx.push({ k: i % 5 ? 'coin' : 'gem', x: S2.cw * rand(0.3, 0.9), y: S2.gy - 10, vx: rand(-90, 90), vy: rand(-260, -150), t: 1.4, max: 1.4 }); }
function idleSim(dt) {
  const S2 = idleSc, I = idleState(), k = FACTIONS[I.fac].leader, d = CFG.units[k], pw = (idleR && idleR.pw) || 1, full = I.h >= IDLE.cap - 1e-6, K = S2.k, hx = S2.cw * 0.25;
  S2.t += dt; S2.hit = Math.max(0, S2.hit - dt); S2.lunge = Math.max(0, S2.lunge - dt); S2.hp = Math.min(1, S2.hp + dt * 0.05);
  for (const p of S2.fx) {
    p.t -= dt;
    if (p.k === 'coin' || p.k === 'gem') { const age = p.max - p.t; if (age < 0.6) { p.vy += 420 * dt; p.x += p.vx * dt; p.y = Math.min(S2.gy - 3, p.y + p.vy * dt); } else { const tx = S2.cw - 26, ty = S2.ch + 10; p.x += (tx - p.x) * Math.min(1, dt * 5); p.y += (ty - p.y) * Math.min(1, dt * 5); } }
    else if (p.k === 'puff') { p.x += p.vx * dt; p.y += p.vy * dt; }
    else if (p.k === 'num') p.y -= 26 * dt;
    else if (p.k === 'shot') { const m = p.m, tx = m.x, ty = S2.gy - m.h * 0.5, dx = tx - p.x, dy = ty - p.y, dd = Math.hypot(dx, dy), v = 420 * K * dt; if (dd <= v || m.dead) { p.t = 0; if (!m.dead) idleHurt(m, p.dmg); } else { p.x += dx / dd * v; p.y += dy / dd * v; } }
    else if (p.k === 'zz') { p.y -= 12 * dt; p.x += Math.sin(p.t * 4) * 8 * dt; }
  }
  S2.fx = S2.fx.filter(p => p.t > 0);
  S2.mobs = S2.mobs.filter(m => !m.dead || m.die > 0);
  for (const m of S2.mobs) if (m.dead) m.die -= dt;
  if (full) {   // almacén lleno: se sienta a descansar y los bots se van
    S2.walking = false; S2.jump = 0;
    for (const m of S2.mobs) if (!m.dead) { m.x += 40 * K * dt; m.face = 1; m.walk += dt * 8; m.moving = true; }
    S2.mobs = S2.mobs.filter(m => m.x < S2.cw + 60);
    if (Math.random() < dt * 1.2) S2.fx.push({ k: 'zz', x: hx + 10 * K, y: S2.gy - S2.hh * 1.05, t: 1.6, max: 1.6 });
    return;
  }
  const alive = S2.mobs.filter(m => !m.dead), front = alive[0], reach = d.ranged ? Math.min(150 * K, S2.cw * 0.36) : S2.hh * 0.72, contact = hx + S2.hh * 0.6;
  const engaged = !!front && front.x - hx <= reach + 1;
  S2.walking = !engaged && S2.jump <= 0;
  const v = S2.walking ? 46 * K : 0; S2.off += v * dt; if (S2.walking) S2.walk += dt * 9;
  alive.forEach((m, i) => {
    m.hitT = Math.max(0, m.hitT - dt); m.lunge = Math.max(0, m.lunge - dt);
    const stop = i === 0 ? contact : alive[i - 1].x + 34 * K;
    if (m.x > stop + 0.5) { m.x = Math.max(stop, m.x - (v + 30 * K) * dt); m.walk += dt * 8; m.moving = true; } else m.moving = false;
    if (i === 0 && !m.moving) { m.atk -= dt; if (m.atk <= 0) { m.atk = 1.5; m.lunge = 0.2; S2.hit = 0.12; S2.hp = Math.max(0.35, S2.hp - 0.06); } }
  });
  // ataque del líder (cuerpo a cuerpo con embestida o a distancia con su disparo) y su especial cada 8 s
  const dmg = 20 * pw;
  if (S2.pend && (S2.pendT -= dt) <= 0) { idleHurt(S2.pend, dmg); S2.pend = null; }
  if (engaged && S2.jump <= 0) {
    S2.atkT -= dt;
    if (S2.atkT <= 0) {
      S2.atkT = 0.85 / Math.min(1.8, Math.sqrt(pw));
      if (d.ranged) S2.fx.push({ k: 'shot', x: hx + 14 * K, y: S2.gy - S2.hh * 0.6, m: front, dmg, col: (PROJ[d.ranged] && PROJ[d.ranged].spark) || '#ffe14d', t: 3, max: 3 });
      else { S2.lunge = 0.2; S2.pend = front; S2.pendT = 0.08; }
    }
    S2.spec -= dt;
    if (S2.spec <= 0) { S2.spec = 8; S2.jump = 0.6; S2.jumpHit = false; }
  }
  if (S2.jump > 0) {
    S2.jump -= dt;
    if (S2.jump <= 0.14 && !S2.jumpHit) {
      S2.jumpHit = true; const A = invGet(SAVE.abEquip[k]), lab = (A && ABILITIES[A.id] ? ABILITIES[A.id].name : CFG.cards[k].tag).toUpperCase();
      S2.fx.push({ k: 'ring', x: hx + 30 * K, y: S2.gy, r: 120 * K, t: 0.45, max: 0.45 });
      S2.fx.push({ k: 'num', x: hx + 10 * K, y: S2.gy - S2.hh * 1.25, txt: lab, col: '#ffe06a', sz: 17, t: 1.3, max: 1.3 });
      for (const m of alive) if (m.x - hx < 150 * K) idleHurt(m, dmg * 3, true);
    }
  }
  // llegan bots nuevos; de vez en cuando alguien dice algo
  if (alive.length < 2 && (S2.spawn -= dt) <= 0) {
    S2.spawn = rand(0.5, 1.5); const mk2 = pick(IDLE_MOBS), mx = 70 + Math.min(110, S2.wave * 3);
    S2.mobs.push({ k: mk2, x: S2.cw + 40 * K, hp: mx, max: mx, h: S2.hh * 0.8, hitT: 0, atk: 0.8, lunge: 0, walk: rand(0, 6), moving: true, dead: false, die: 0, face: -1 });
  }
  if ((S2.sayT -= dt) <= 0) { S2.sayT = rand(9, 15); if (front && engaged && Math.random() < 0.55) idleSay(front.x, S2.gy - front.h - 14 * K, pick(IDLE_SAY.mob)); else idleSay(hx, S2.gy - S2.hh - 16 * K, pick(IDLE_SAY.hero)); }
}
function idleSprite(c, key, x, y, h, flip, sx, sy, white, eu) {
  const s = SPR[key], T = TYPES[key]; if (!s || !T) return;
  const sc = h / T.top; c.save(); c.translate(x, y); c.scale(sc * flip * sx, sc * sy);
  if (eu && eu.equip) drawEquip(eu, T, c, 'back');
  c.drawImage(s.c, -s.ax, -s.ay, s.wd, s.ht);
  if (eu && eu.equip) drawEquip(eu, T, c);
  if (T.foot) { const r = CFG.units[key].r; for (const fx of [-0.4, 0.4]) { c.beginPath(); c.ellipse(fx * r, -1, r * 0.3, r * 0.19, 0, 0, Math.PI * 2); c.fillStyle = T.foot; c.fill(); c.lineWidth = 1.6; c.strokeStyle = OL; c.stroke(); } }
  if (white > 0) { c.globalAlpha = Math.min(1, white); c.drawImage(s.w, -s.ax, -s.ay, s.wd, s.ht); c.globalAlpha = 1; }
  c.restore();
}
function idleLayer(c, img, o, W2, cw, ch, R) {   // solo el trozo visible de una capa que se repite
  const x0 = ((o % W2) + W2) % W2, w1 = Math.min(cw, W2 - x0);
  c.drawImage(img, x0 * R, 0, w1 * R, ch * R, 0, 0, w1, ch);
  if (w1 < cw) c.drawImage(img, 0, 0, (cw - w1) * R, ch * R, w1, 0, cw - w1, ch);
}
function idleText(c, txt, x, y, sz, col) { c.font = `${sz}px ${FONT_D}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = Math.max(3, sz * 0.28); c.strokeStyle = OL; c.strokeText(txt, x, y); c.fillStyle = col; c.fillText(txt, x, y); }
function idleDraw() {
  const S2 = idleSc, cv = $('#idle-cv'), c = cv.getContext('2d'), { cw, ch, R, L, k: K, gy } = S2, I = idleState(), key = FACTIONS[I.fac].leader, TH = THEMES[I.fac] || THEMES.animales;
  c.setTransform(R, 0, 0, R, 0, 0); c.globalAlpha = 1;
  c.drawImage(L.sky, 0, 0, cw, ch);
  for (const [img, f] of [[L.far, 0.18], [L.mid, 0.5]]) idleLayer(c, img, S2.off * f, L.W2, cw, ch, R);
  // suelo: hierba, camino y piedras que pasan
  c.fillStyle = TH.grad[1]; c.fillRect(0, gy - 6 * K, cw, ch); c.fillStyle = 'rgba(20,10,30,.18)'; c.fillRect(0, gy - 6 * K, cw, 2.5 * K);
  c.fillStyle = '#d8b27c'; c.fillRect(0, gy - 1 * K, cw, 9 * K); c.fillStyle = '#b98d55'; c.fillRect(0, gy + 7 * K, cw, 2 * K);
  const st = 30 * K, so = S2.off % st;
  for (let x = -so; x < cw + st; x += st) { c.fillStyle = '#a8804c'; c.beginPath(); c.ellipse(x, gy + 3 * K, 3.2 * K, 1.6 * K, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = TH.greens[0]; c.beginPath(); c.moveTo(x + 12 * K, gy - 5 * K); c.lineTo(x + 14 * K, gy - 11 * K); c.lineTo(x + 16 * K, gy - 5 * K); c.fill(); }
  for (let x = -so * 0.7; x < cw; x += 52 * K) { c.fillStyle = TH.greens[2]; c.beginPath(); c.ellipse(x + 20 * K, gy + 15 * K, 6 * K, 2.4 * K, 0, 0, Math.PI * 2); c.fill(); }
  // bots
  for (const m of S2.mobs) {
    let z = 0, sx = 1, sy = 1, x = m.x; const a = m.dead ? Math.max(0, m.die / 0.45) : 1;
    if (m.moving && !m.dead) { z = Math.abs(Math.sin(m.walk)) * 2 * K; const w = Math.sin(m.walk * 2); sy = 1 + w * 0.035; sx = 1 - w * 0.03; }
    if (m.lunge > 0) x -= Math.sin((1 - m.lunge / 0.2) * Math.PI) * 8 * K;
    if (m.dead) { sy = a; sx = 1 + (1 - a) * 0.5; }
    c.globalAlpha = 0.3 * a; c.fillStyle = '#140a1e'; c.beginPath(); c.ellipse(x, gy + 1, m.h * 0.28, m.h * 0.07, 0, 0, Math.PI * 2); c.fill(); c.globalAlpha = a;
    idleSprite(c, m.k, x, gy - z, m.h, m.face, sx, sy, m.hitT > 0 ? (m.hitT / 0.12) * 0.85 : 0);
    c.globalAlpha = 1;
    if (!m.dead && m.hp < m.max) { const bw = 30 * K, by = gy - m.h - 9 * K; c.fillStyle = OL; c.fillRect(x - bw / 2 - 1.5, by - 1.5, bw + 3, 6); c.fillStyle = '#3d9bff'; c.fillRect(x - bw / 2, by, bw * Math.max(0, m.hp / m.max), 3); }
  }
  // el líder
  const full = I.h >= IDLE.cap - 1e-6, hx = cw * 0.25; let z = 0, sx = 1, sy = 1, x = hx;
  if (S2.jump > 0) { const q = 1 - S2.jump / 0.6; z = Math.sin(Math.PI * q) * S2.hh * 0.8; }
  else if (S2.walking) { z = Math.abs(Math.sin(S2.walk)) * 2.4 * K; const w = Math.sin(S2.walk * 2); sy = 1 + w * 0.035; sx = 1 - w * 0.03; }
  else if (full) { sy = 0.9 + Math.sin(S2.t * 2) * 0.015; sx = 1.04; }
  else { const br = Math.sin(S2.t * 3) * 0.025; sy = 1 + br; sx = 1 - br * 0.6; }
  if (S2.lunge > 0) x += Math.sin((1 - S2.lunge / 0.2) * Math.PI) * 10 * K;
  c.fillStyle = 'rgba(20,10,30,.35)'; c.beginPath(); c.ellipse(hx, gy + 1, S2.hh * 0.3 * (1 - z / (S2.hh * 2)), S2.hh * 0.07, 0, 0, Math.PI * 2); c.fill();
  idleSprite(c, key, x, gy - z, S2.hh, 1, sx, sy, S2.hit > 0 ? (S2.hit / 0.12) * 0.7 : 0, S2.eu);
  if (!full) { const bw = 36 * K, by = gy - S2.hh - 10 * K - z; c.fillStyle = OL; c.fillRect(hx - bw / 2 - 1.5, by - 1.5, bw + 3, 6); c.fillStyle = '#7be04a'; c.fillRect(hx - bw / 2, by, bw * S2.hp, 3); }
  // efectos
  for (const p of S2.fx) {
    const a = Math.max(0, p.t / p.max);
    if (p.k === 'coin') { c.globalAlpha = Math.min(1, a * 3); c.fillStyle = '#ffcb3d'; c.beginPath(); c.ellipse(p.x, p.y, 4.2 * K * Math.abs(Math.cos(p.t * 9)) + 1.2, 4.2 * K, 0, 0, Math.PI * 2); c.fill(); c.lineWidth = 1.4; c.strokeStyle = OL; c.stroke(); }
    else if (p.k === 'gem') { c.globalAlpha = Math.min(1, a * 3); const r = 4.6 * K; c.fillStyle = '#ff5fd2'; c.beginPath(); c.moveTo(p.x - r, p.y - r * 0.3); c.lineTo(p.x - r * 0.5, p.y - r); c.lineTo(p.x + r * 0.5, p.y - r); c.lineTo(p.x + r, p.y - r * 0.3); c.lineTo(p.x, p.y + r); c.closePath(); c.fill(); c.lineWidth = 1.4; c.strokeStyle = OL; c.stroke(); }
    else if (p.k === 'puff') { c.globalAlpha = a * 0.7; c.fillStyle = '#e8dcf5'; c.beginPath(); c.arc(p.x, p.y, p.r * (1.6 - a * 0.6), 0, Math.PI * 2); c.fill(); }
    else if (p.k === 'num') { c.globalAlpha = Math.min(1, a * 2.5); idleText(c, p.txt, p.x, p.y, p.sz * Math.min(1.15, K), p.col); }
    else if (p.k === 'shot') { c.globalAlpha = 1; c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, 4 * K, 0, Math.PI * 2); c.fill(); c.lineWidth = 1.5; c.strokeStyle = OL; c.stroke(); c.globalAlpha = 0.45; c.beginPath(); c.arc(p.x - 7 * K, p.y, 2.6 * K, 0, Math.PI * 2); c.fill(); }
    else if (p.k === 'ring') { const rr2 = p.r * (1 - a) + 8; c.globalAlpha = a; c.strokeStyle = '#ffe06a'; c.lineWidth = 4 * a + 1; c.beginPath(); c.ellipse(p.x, p.y, rr2, rr2 * 0.22, 0, 0, Math.PI * 2); c.stroke(); }
    else if (p.k === 'zz') { c.globalAlpha = Math.min(1, a * 2); idleText(c, 'Z', p.x, p.y, 13 * K * (1.3 - a * 0.5), '#cdb9ea'); }
    else if (p.k === 'say') {
      c.globalAlpha = Math.min(1, a * 4); c.font = `bold ${Math.round(11 * Math.min(1.2, K))}px "Baloo 2", system-ui, sans-serif`; const tw = c.measureText(p.txt).width + 14, bx = clamp(p.x, tw / 2 + 4, cw - tw / 2 - 4), by = p.y;
      c.fillStyle = '#fff6ea'; c.strokeStyle = OL; c.lineWidth = 2; c.beginPath(); c.roundRect ? c.roundRect(bx - tw / 2, by - 10, tw, 19, 8) : c.rect(bx - tw / 2, by - 10, tw, 19); c.fill(); c.stroke();
      c.fillStyle = OL; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(p.txt, bx, by + 0.5);
    }
  }
  c.globalAlpha = 1;
}
function idleFrame(dt) {
  if ($('#scr-title').hidden) return;
  const S2 = idleSc; S2.tick -= dt;
  if (S2.tick <= 0 || !S2.L) {
    S2.tick = 1; idleTick(); const I = idleState(), k = FACTIONS[I.fac].leader; S2.eu = effStats(k, I.fac).u; idleUI();
    if (!idleSize()) return;
  }
  if (!S2.L) return;
  idleSim(Math.min(dt, 0.05)); idleDraw();
}
$('#idle-get').addEventListener('click', () => { audioInit(); idleCollect(); });
$('#idle-hero').addEventListener('click', () => { audioInit(); openIdlePick(); });
$('#btn-idle-close').addEventListener('click', () => { $('#scr-idle').hidden = true; play('select'); });

