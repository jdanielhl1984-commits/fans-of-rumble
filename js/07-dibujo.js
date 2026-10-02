// Fans of Rumble · Dibujar el campo y las unidades en pantalla
'use strict';
/* =========================================================
   RENDER
   ========================================================= */
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const VIEW = { k: 1, top: 0, bot: 0, LH: H };
const CLOUDS = [{ x: 80, y: 220, r: 130, s: 9 }, { x: 420, y: 600, r: 160, s: 7 }, { x: 250, y: 870, r: 120, s: 11 }];
function render() {
  if (!READY) return;
  const rdt = Math.min(0.05, Math.max(0, G.t - (render.lt == null ? G.t : render.lt))); render.lt = G.t;
  ctx.setTransform(VIEW.k, 0, 0, VIEW.k, 0, 0);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#24133a'; ctx.fillRect(0, 0, W, VIEW.LH);
  camApply();   // v0.9.18: zoom
  ctx.translate(0, VIEW.top + FIELD_DY);
  if (G.shake > 0.15) ctx.translate(rand(-1, 1) * G.shake, rand(-1, 1) * G.shake);
  ctx.drawImage(BG, 0, 0, W, H);
  if (!terrainGround()) drawWater();   // v0.9.18: el terreno del jefe puede cambiar el río
  ctx.drawImage(BRIDGE_LAYER, 0, 0, W, H);
  drawClouds();
  if (G.faction === 'nomuertos') drawFog();
  const showZones = G.state === 'play' && ((input.dragging && input.card) || input.selected);
  if (showZones && !isSpell((input.dragging && input.card) || input.selected)) drawZones();
  for (const p of parts) if (p.ground) drawPart(p);
  drawSpellsGround();   // v0.9.15
  for (const s of structs) { if (s.hidden) continue; ctx.globalAlpha = 0.3; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(s.x + 3, s.y + 3, s.r * 1.15, s.r * 0.45, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  for (const u of units) {
    drawUnitShadow(u);
    if (G.state === 'play' && u.moving && u.deployT <= 0 && u.r >= 17 && !TYPES[u.type].hover && Math.random() < 0.1)   // polvo al andar (unidades grandes)
      parts.push({ type: 'dust', x: u.x - u.face * u.r * 0.6 + rand(-3, 3), y: u.y + rand(-2, 2), z: 1, vx: -u.face * 10, vy: 0, vz: 8, g: 0, life: 0.45, max: 0.45, size: 3.2, color: 'rgba(225,205,165,.8)', ground: true });
  }
  if (G.state !== 'title') for (const st of structs) if (!st.alive && st.smokeUntil > G.t && Math.random() < 0.2)   // humo de las torres caídas
    parts.push({ type: 'smoke', x: st.x + rand(-12, 12), y: st.y, z: rand(4, 14), vx: rand(-6, 6), vy: 0, vz: rand(18, 30), g: 0, life: rand(1.2, 1.9), max: 1.9, size: rand(6, 10) });
  const list = structs.concat(units).sort((a, b) => a.y - b.y);
  for (const e of list) (e.kind === 'struct' ? drawStruct(e) : drawUnit(e));
  for (const p of projs) drawProj(p);
  for (const p of parts) if (!p.ground) drawPart(p);
  drawSpellsAir();
  terrainAir();
  if (G.state !== 'title') drawAmbient(rdt); else G.flash = 0;
  for (const e of list) if (!(e.kind === 'unit' && inTunnel(e))) drawBars(e);   // v0.9.19: dentro del túnel no se ve nada
  for (const n of nums) drawNum(n);
  if (showZones) drawGhost();
  if (G.flash > 0.01) { ctx.setTransform(VIEW.k, 0, 0, VIEW.k, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = `rgba(255,246,225,${Math.min(0.6, G.flash)})`; ctx.fillRect(0, 0, W, VIEW.LH); G.flash *= Math.pow(0.02, rdt); }
}
// v0.9.8: luz suave desde arriba a la izquierda y bordes algo más oscuros (se pinta una sola vez, dentro del fondo)
function paintLight(x) {
  const v = x.createRadialGradient(W / 2, H * 0.47, H * 0.3, W / 2, H * 0.47, H * 0.7); v.addColorStop(0, 'rgba(20,6,36,0)'); v.addColorStop(1, 'rgba(20,6,36,.32)');
  x.fillStyle = v; x.fillRect(0, 0, W, H);
  const sl = x.createRadialGradient(70, 120, 0, 70, 120, 440); sl.addColorStop(0, 'rgba(255,238,200,.13)'); sl.addColorStop(1, 'rgba(255,238,200,0)');
  x.fillStyle = sl; x.fillRect(0, 0, W, H);
}
// v0.9.8: ambiente animado en cada mitad del campo según la facción
const AMB = { list: [], key: '' };
const AMB_KIND = { animales: 'butterfly', nomuertos: 'wisp', streamers: 'heart', heroes: 'mote', ciber: 'bit', memes: 'confetti', gamer: 'orb', olvidados: 'pixel', pop: 'flashbulb' };
const AMB_COL = { butterfly: ['#ffd84d', '#ff8fb1', '#b98cff', '#ffffff', '#7dd3fc'], wisp: ['#5ef2a0', '#a7ffd6'], heart: ['#ff5fa8', '#c084fc', '#f472b6'], mote: ['#ffe28a', '#fff3c4'],
  bit: ['#22e3ff', '#ff3df0', '#a3ff7a'], confetti: ['#ff3df0', '#22e3ff', '#ffe14d', '#7be04a', '#ff8a1f'], memo: ['#ffffff', '#e9eef7'], ember: ['#ff3348', '#ff7a5c', '#ffb36b'],
  orb: ['#7be04a', '#a3ff7a', '#4ade80'], pixel: ['#d6a96a', '#e8c48a', '#b98a55', '#a8b478'], flashbulb: ['#ffffff', '#fff7d6'], disc: ['#e5e7eb', '#f1f5f9'] };
function ambNew(kind, top, init) {
  const y0 = top ? 80 : RIVER.bottom + 20, y1 = top ? RIVER.top - 25 : 785;
  const a = { kind, top, x: rand(24, W - 24), y: rand(y0, y1), y0, y1, ph: Math.random() * 6.28, life: rand(5, 10), col: pick(AMB_COL[kind]), dir: Math.random() < 0.5 ? -1 : 1 };
  a.max = a.life; if (init) a.life = rand(0.8, a.max);
  return a;
}
function drawAmbient(dt) {
  if (REDUCED) return;
  const ek = G.efac === 'microblizz' ? 'memo' : G.efac === 'phony' ? 'disc' : G.efac === 'iahorro' ? 'bit' : 'ember', pk = AMB_KIND[G.faction] || 'butterfly', key = pk + ek;
  if (AMB.key !== key) { AMB.key = key; AMB.list = []; for (let i = 0; i < 12; i++) AMB.list.push(ambNew(pk, false, true)); for (let i = 0; i < 7; i++) AMB.list.push(ambNew(ek, true, true)); }
  for (let i = 0; i < AMB.list.length; i++) {
    let a = AMB.list[i]; a.life -= dt;
    if (a.life <= 0 || a.y < a.y0 - 30 || a.y > a.y1 + 30 || a.x < -20 || a.x > W + 20) a = AMB.list[i] = ambNew(a.kind, a.top, false);
    const age = a.max - a.life, fade = Math.max(0, Math.min(1, age / 0.8, a.life / 0.8)); a.ph += dt;
    ctx.globalAlpha = fade;
    switch (a.kind) {
      case 'butterfly': {
        a.x += (Math.sin(a.ph * 0.7) * 20 + a.dir * 9) * dt; a.y += Math.cos(a.ph * 0.9) * 12 * dt;
        const fl = Math.abs(Math.sin(a.ph * 13)), y = a.y - 16 - Math.sin(a.ph * 2) * 4;
        ctx.save(); ctx.translate(a.x, y); ctx.fillStyle = a.col; ctx.strokeStyle = OL; ctx.lineWidth = 0.8;
        for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 2.6 * (0.35 + 0.65 * fl), -0.6, 2.8 * (0.3 + 0.7 * fl), 2.4, sd * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        ctx.fillStyle = OL; ctx.fillRect(-0.6, -2.4, 1.2, 4.4); ctx.restore(); break; }
      case 'wisp': {
        a.y -= 10 * dt; a.x += Math.sin(a.ph * 1.3) * 8 * dt; const f = 0.7 + 0.3 * Math.sin(a.ph * 9);
        ctx.globalAlpha = fade * 0.28 * f; ctx.fillStyle = a.col; ctx.beginPath(); ctx.arc(a.x, a.y - 14, 6, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = fade * f; ctx.beginPath(); ctx.arc(a.x, a.y - 14, 1.9, 0, Math.PI * 2); ctx.fill(); break; }
      case 'heart': {
        a.y -= 12 * dt; a.x += Math.sin(a.ph * 2) * 6 * dt;
        ctx.globalAlpha = fade * 0.75; ctx.fillStyle = a.col; ctx.beginPath(); heartPath(ctx, a.x, a.y - 14, 3.2); ctx.fill(); break; }
      case 'mote': {
        a.y -= 7 * dt; a.x += Math.sin(a.ph) * 4 * dt; const r = 1.2 + 1.6 * Math.abs(Math.sin(a.ph * 3));
        ctx.fillStyle = a.col; ctx.beginPath(); starPath(ctx, a.x, a.y - 14, r * 1.6, r * 0.45, 4); ctx.fill(); break; }
      case 'bit': {
        a.y -= 9 * dt; ctx.globalAlpha = fade * (Math.sin(a.ph * 6) > -0.3 ? 0.9 : 0.25); ctx.fillStyle = a.col; ctx.fillRect(a.x - 1.6, a.y - 15.6, 3.2, 3.2); break; }
      case 'confetti': {
        a.y += 16 * dt; a.x += Math.sin(a.ph * 1.5) * 12 * dt;
        ctx.save(); ctx.translate(a.x, a.y - 14); ctx.rotate(a.ph * 3); ctx.scale(Math.cos(a.ph * 5), 1); ctx.fillStyle = a.col; ctx.fillRect(-2.6, -1.5, 5.2, 3); ctx.restore(); break; }
      case 'memo': {   // memorandos de Microblizz volando
        a.y += 8 * dt; a.x += (Math.sin(a.ph * 0.8) * 16 + a.dir * 4) * dt;
        ctx.save(); ctx.translate(a.x, a.y - 14); ctx.rotate(Math.sin(a.ph * 1.6) * 0.6); ctx.globalAlpha = fade * 0.85;
        ctx.fillStyle = a.col; ctx.strokeStyle = OL; ctx.lineWidth = 0.8; ctx.fillRect(-3, -4, 6, 8); ctx.strokeRect(-3, -4, 6, 8);
        ctx.fillStyle = '#9aa3b2'; ctx.fillRect(-2, -2.4, 4, 0.8); ctx.fillRect(-2, -0.6, 4, 0.8); ctx.fillRect(-2, 1.2, 2.6, 0.8); ctx.restore(); break; }
      case 'orb': {   // orbes de experiencia (Comunidad Gamer)
        a.y -= 11 * dt; a.x += Math.sin(a.ph * 1.7) * 6 * dt; const f = 0.75 + 0.25 * Math.sin(a.ph * 7);
        ctx.globalAlpha = fade * 0.3 * f; ctx.fillStyle = a.col; ctx.beginPath(); ctx.arc(a.x, a.y - 14, 5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = fade * f; ctx.beginPath(); ctx.arc(a.x, a.y - 14, 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(a.x - 0.6, a.y - 14.6, 0.7, 0, Math.PI * 2); ctx.fill(); break; }
      case 'pixel': {   // polvo de píxeles viejos (Olvidados)
        a.y -= 5 * dt; a.x += Math.sin(a.ph * 0.9) * 5 * dt; ctx.globalAlpha = fade * 0.75; ctx.fillStyle = a.col; ctx.fillRect(Math.round(a.x) - 1.5, Math.round(a.y - 14) - 1.5, 3, 3); break; }
      case 'flashbulb': {   // flashes de los fotógrafos (Cultura Pop)
        const k2 = Math.max(0, Math.sin(a.ph * 2.2 + a.dir)); if (k2 < 0.92) break; const r2 = (k2 - 0.92) * 70;
        ctx.globalAlpha = fade * 0.9; ctx.fillStyle = a.col; ctx.beginPath(); starPath(ctx, a.x, a.y - 16, r2 + 1, (r2 + 1) * 0.3, 4); ctx.fill(); break; }
      case 'disc': {   // discos tirados por Phony
        a.y += 9 * dt; a.x += (Math.sin(a.ph * 0.8) * 12 + a.dir * 3) * dt; const sx2 = Math.cos(a.ph * 4);
        ctx.save(); ctx.translate(a.x, a.y - 14); ctx.scale(sx2, 1); ctx.globalAlpha = fade * 0.85; ctx.fillStyle = a.col; ctx.strokeStyle = OL; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(0, 0, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#7dd3fc'; ctx.fillRect(-2.4, -0.6, 2, 1.2); ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(0, 0, 0.9, 0, Math.PI * 2); ctx.fill(); ctx.restore(); break; }
      case 'ember': {
        a.y -= 14 * dt; a.x += Math.sin(a.ph * 2) * 5 * dt; ctx.globalAlpha = fade * (0.6 + 0.4 * Math.sin(a.ph * 11));
        ctx.fillStyle = a.col; ctx.beginPath(); ctx.arc(a.x, a.y - 14, 1.7, 0, Math.PI * 2); ctx.fill(); break; }
    }
  }
  ctx.globalAlpha = 1;
}
function drawWater() {
  ctx.save(); ctx.beginPath(); ctx.rect(0, RIVER.top, W, RIVER.bottom - RIVER.top); ctx.clip();
  ctx.strokeStyle = 'rgba(225,255,255,1)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  for (let i = 0; i < 18; i++) { const y = RIVER.top + 6 + (i % 4) * 8.5; const x = ((i * 71 + G.t * (16 + (i % 3) * 7)) % (W + 80)) - 40; ctx.globalAlpha = 0.3 + 0.22 * Math.sin(G.t * 2 + i); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 8, y - 2, x + 16, y); ctx.stroke(); }
  const t = G.t, T0 = RIVER.top, B0 = RIVER.bottom;
  ctx.strokeStyle = '#effcff'; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.6;
  for (const [yy, dir] of [[T0 + 2, 1], [B0 - 2, -1]]) { ctx.beginPath(); for (let x = 0; x <= W; x += 9) { const y = yy + dir * (1.4 + Math.sin(x * 0.08 + t * 2.4 * dir) * 1.4); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 12; i++) { const c = t * 0.55 + i * 0.29, ph = c % 1, a = Math.sin(ph * Math.PI); if (a < 0.1) continue; const x = (i * 97 + 31 + Math.floor(c) * 53) % W, y = T0 + 9 + ((i * 7) % 21); ctx.globalAlpha = a; ctx.beginPath(); starPath(ctx, x, y, 1 + a * 2.6, 0.5 + a * 0.5, 4); ctx.fill(); }
  ctx.lineWidth = 1.5; ctx.strokeStyle = '#e8fbff';
  for (const bx of BRIDGES) for (const side of [-1, 1]) for (const o of [0, 0.5]) { const k = (t * 0.6 + o + (side > 0 ? 0.25 : 0)) % 1; ctx.globalAlpha = (1 - k) * 0.55; ctx.beginPath(); ctx.ellipse(bx + side * 36, RIVER.y, 3 + k * 16, 2 + k * 7, 0, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1;
}
function drawClouds() {
  for (const cl of CLOUDS) {
    const x = ((cl.x + G.t * cl.s) % (W + 400)) - 200;
    const g = ctx.createRadialGradient(x, cl.y, 0, x, cl.y, cl.r); g.addColorStop(0, 'rgba(20,30,40,.09)'); g.addColorStop(1, 'rgba(20,30,40,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, cl.y, cl.r, cl.r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  }
}
function drawFog() {
  for (let i = 0; i < 4; i++) {
    const x = ((i * 170 + G.t * (6 + i * 2)) % (W + 300)) - 150, y = 500 + i * 70 + Math.sin(G.t * 0.4 + i) * 10, rx = 150 + i * 20;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, 'rgba(200,255,230,.10)'); g.addColorStop(1, 'rgba(200,255,230,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.35, 0, 0, Math.PI * 2); ctx.fill();
  }
}
function drawZones() {
  ctx.save();
  ctx.fillStyle = 'rgba(255,60,80,0.14)'; ctx.fillRect(0, 60, W, ZONE.p.y0 - 60);
  ctx.beginPath(); ctx.rect(0, 60, W, ZONE.p.y0 - 60); ctx.clip();
  ctx.strokeStyle = 'rgba(255,80,100,0.15)'; ctx.lineWidth = 6;
  for (let i = -H; i < W; i += 26) { ctx.beginPath(); ctx.moveTo(i, 60); ctx.lineTo(i + (ZONE.p.y0 - 60), ZONE.p.y0); ctx.stroke(); }
  ctx.restore();
  const a = 0.13 + 0.05 * Math.sin(G.t * 5);
  ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(0, ZONE.p.y0, W, ZONE.p.y1 - ZONE.p.y0);
  ctx.setLineDash([10, 8]); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, ZONE.p.y0); ctx.lineTo(W, ZONE.p.y0); ctx.stroke(); ctx.setLineDash([]);
}
function drawUnitShadow(u) {
  let z = u.z || 0;
  if (u.deployT > 0 && !u.rising) { const k = 1 - u.deployT / u.deployMax; if (k < 0.55) { const f = k / 0.55; z = (1 - f * f) * 170; } }
  const sc = Math.max(0.35, 1 - z / 260);
  if (u.deployT <= 0 && u.revived) { ctx.globalAlpha = 0.5 + 0.2 * Math.sin(G.t * 5 + u.id); ctx.fillStyle = '#5ef2a0'; ctx.beginPath(); ctx.ellipse(u.x, u.y + 1, u.r * 1.35, u.r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  if (u.slowT > 0) { ctx.globalAlpha = 0.85; ctx.strokeStyle = '#9fe3ff'; ctx.lineWidth = 3; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.ellipse(u.x, u.y + 1, u.r * 1.25, u.r * 0.5, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
  if (u.rage > 0 && u.deployT <= 0 && !u.jump) {
    const k = u.rage / CFG.passives.animales.maxStacks, pulse = 0.85 + 0.15 * Math.sin(G.t * 8 + u.id);
    const g = ctx.createRadialGradient(u.x, u.y, 0, u.x, u.y, u.r * (1.4 + k * 0.8));
    g.addColorStop(0, `rgba(255,120,40,${(0.25 + 0.4 * k) * pulse})`); g.addColorStop(1, 'rgba(255,60,20,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(u.x, u.y, u.r * (1.4 + k * 0.8), u.r * (0.6 + k * 0.35), 0, 0, Math.PI * 2); ctx.fill();
  }
  if (u.corrupt && u.deployT <= 0) {   // aura de corrupción
    const g = ctx.createRadialGradient(u.x, u.y, 0, u.x, u.y, u.r * 1.6); g.addColorStop(0, 'rgba(170,0,80,.35)'); g.addColorStop(1, 'rgba(170,0,80,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(u.x, u.y, u.r * 1.6, u.r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (S && facOf(u.team) === 'streamers' && S[u.team].hypeLvl > 0 && u.deployT <= 0) {
    const k = S[u.team].hypeLvl / CFG.passives.streamers.max, pulse = 0.85 + 0.15 * Math.sin(G.t * 7 + u.id);
    const g = ctx.createRadialGradient(u.x, u.y, 0, u.x, u.y, u.r * (1.4 + k * 0.7));
    g.addColorStop(0, `rgba(192,132,252,${(0.25 + 0.35 * k) * pulse})`); g.addColorStop(1, 'rgba(150,80,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(u.x, u.y, u.r * (1.4 + k * 0.7), u.r * (0.6 + k * 0.3), 0, 0, Math.PI * 2); ctx.fill();
  }
  if (u.deployT <= 0 && (u.actT > 0 || (u.d.fury && u.hp < u.maxHp * u.d.fury.f) || (S && facOf(u.team) === 'gamer' && S[u.team].comm > 1))) {   // v0.9.13: ¡Acción!, Furia y Comunidad
    const col = u.actT > 0 ? '255,154,184' : u.d.fury && u.hp < u.maxHp * u.d.fury.f ? '255,100,40' : '123,224,74', k = u.actT > 0 || u.d.fury ? 1 : S[u.team].comm / CFG.passives.gamer.max, pulse = 0.85 + 0.15 * Math.sin(G.t * 7 + u.id);
    const g = ctx.createRadialGradient(u.x, u.y, 0, u.x, u.y, u.r * (1.4 + k * 0.6)); g.addColorStop(0, `rgba(${col},${(0.22 + 0.33 * k) * pulse})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(u.x, u.y, u.r * (1.4 + k * 0.6), u.r * (0.6 + k * 0.25), 0, 0, Math.PI * 2); ctx.fill();
  }
  if (u.d.healer && u.deployT <= 0 && u.healGlowT != null) {   // v0.9.18: el cono solo se ve al curar: verde tenue que aparece y se va
    const e = G.t - u.healGlowT, a = e < 0.15 ? e / 0.15 : e < 0.45 ? 1 : Math.max(0, 1 - (e - 0.45) / 0.65);
    if (a > 0.01) {
      const ha = u.healAng === undefined ? healFwd(u) : u.healAng, R = u.d.healR, g = ctx.createRadialGradient(u.x, u.y, 4, u.x, u.y, R);
      g.addColorStop(0, `rgba(170,255,140,${0.26 * a})`); g.addColorStop(0.75, `rgba(140,240,110,${0.14 * a})`); g.addColorStop(1, 'rgba(140,240,110,0)');
      ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.arc(u.x, u.y, R, ha - HEAL_CONE / 2, ha + HEAL_CONE / 2); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    }
  }
  if (u.d.aura && u.deployT <= 0) { ctx.globalAlpha = 0.35 + 0.1 * Math.sin(G.t * 3); ctx.strokeStyle = u.team === 'p' ? '#c084fc' : '#8fc2ff'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.lineDashOffset = -G.t * 12; ctx.beginPath(); ctx.arc(u.x, u.y, u.d.aura.r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0; ctx.globalAlpha = 1; }
  ctx.globalAlpha = 0.3 * sc; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(u.x, u.y + 1, u.r * 1.05 * sc, u.r * 0.42 * sc, 0, 0, Math.PI * 2); ctx.fill();
  if (u.deployT <= 0 && !u.jump) { ctx.globalAlpha = u.stealthT > 0 ? 0.4 : 0.95; ctx.strokeStyle = u.team === 'p' ? '#ffa23a' : '#3d9bff'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(u.x, u.y + 1, u.r * 0.95, u.r * 0.4, 0, 0, Math.PI * 2); ctx.stroke(); }
  if (isLeader(u.type) && u.deployT <= 0 && !u.jump) { ctx.globalAlpha = u.stealthT > 0 ? 0.35 : 0.9; ctx.strokeStyle = '#ffcb3d'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.lineDashOffset = -G.t * 16; ctx.beginPath(); ctx.ellipse(u.x, u.y + 1, u.r * 1.3, u.r * 0.55, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0; }
  ctx.globalAlpha = 1;
}
function drawFoot(fx, fy, r, col) { ctx.beginPath(); ctx.ellipse(fx, fy - 1, r * 0.3, r * 0.19, 0, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = OL; ctx.stroke(); }
function drawUnit(u) {
  const s = SPR[u.type], T = TYPES[u.type];
  let x = u.x, y = u.y, z = u.z || 0, sx = 1, sy = 1;
  let rise = 1, ang = 0;   // v0.9.15: inclinación del cuerpo (andar, atacar, recibir un golpe, aturdido)
  if (u.deployT > 0 && u.rising) { rise = 1 - u.deployT / u.deployMax; sy = 0.15 + 0.85 * rise; sx = 1 + 0.25 * (1 - rise); }
  else if (u.deployT > 0) {
    const k = 1 - u.deployT / u.deployMax;
    if (k < 0.55) { const f = k / 0.55; z = (1 - f * f) * 170; } else { const w = Math.sin(((k - 0.55) / 0.45) * Math.PI); sx = 1 + w * 0.22; sy = 1 - w * 0.22; }
  } else if (u.moving && u.stunT <= 0) { z += Math.abs(Math.sin(u.walk)) * 2.4 * (u.r / 14); const w = Math.sin(u.walk * 2); sy = 1 + w * 0.035; sx = 1 - w * 0.03; ang = (T.hover ? 0.08 : 0.05) + Math.sin(u.walk) * (T.hover ? 0.02 : 0.06); }   // se inclina hacia delante y se balancea al andar
  else if (u.stunT <= 0) { const br = Math.sin(G.t * 3 + u.id * 1.7) * 0.025; sy = 1 + br; sx = 1 - br * 0.6; }
  else if (u.stunKind !== 'stone') ang = Math.sin(G.t * 11 + u.id) * 0.07;   // aturdido: se tambalea
  let ghost = 0;   // v0.9.24: estela del golpe
  if (u.lungeT > 0) {   // el golpe: sale disparado (rápido) y vuelve (más lento); los de distancia dan un culatazo
    const lm = u.lungeMax || 0.18, p = 1 - u.lungeT / lm, k = p < 0.3 ? 1 - Math.pow(1 - p / 0.3, 3) : 1 - Math.pow((p - 0.3) / 0.7, 2);
    if (u.d.ranged || u.d.chain) { x += u.lungeX * k * 7; y += u.lungeY * k * 4; ang -= 0.16 * k; sx *= 1 - 0.06 * k; sy *= 1 + 0.06 * k; }
    else { x += u.lungeX * k * 12; y += u.lungeY * k * 7; ang += 0.32 * k; sx *= 1 + 0.16 * k; sy *= 1 - 0.1 * k; if (p < 0.55) ghost = k; }
  }
  else if (!u.moving && u.target && u.stunT <= 0 && u.deployT <= 0 && !u.d.ranged && !u.d.chain && u.atkT > 0 && u.atkT < 0.32) {   // coge impulso: se echa atrás y se encoge como un muelle
    const w = 1 - u.atkT / 0.32, e = w * w; ang -= 0.22 * e; x -= u.face * 2.5 * e; sx *= 1 + 0.08 * e; sy *= 1 - 0.1 * e;
  }
  if (u.kbT > 0 && u.deployT <= 0) { const h = u.kbT / 0.18, e = h * h; x += (u.kbX || 0) * 6 * e; y += (u.kbY || 0) * 3 * e; ang -= 0.16 * e; sx *= 1 + 0.12 * e; sy *= 1 - 0.12 * e; }   // le dan: sale despedido un poco y se aplasta
  else if (u.hitT > 0 && u.deployT <= 0) { const h = u.hitT / 0.12; ang -= 0.1 * h; x -= u.face * 2.2 * h; }
  if (T.hover && u.deployT <= 0) z += 4 + Math.sin(G.t * 4 + u.id) * 1.5;
  let alpha = rise; if (u.stealthT > 0 && u.deployT <= 0) alpha = 0.36 + Math.sin(G.t * 9 + u.id) * 0.07;
  if (u.mut === 'glass') alpha *= 0.72;
  const ms = (u.mScale || 1) * (u.shrinkT > 0 ? u.shrinkF || 0.6 : 1);
  if (u.banT > 0) alpha *= 0.22;   // v0.9.15: baneado
  if (ghost > 0.25 && !REDUCED && u.stealthT <= 0) for (const g of [0.55, 0.25]) {   // v0.9.24: estela
    ctx.save(); ctx.globalAlpha = alpha * ghost * (g === 0.55 ? 0.3 : 0.16); ctx.translate(x - u.lungeX * ghost * 12 * (1 - g), y - z - u.lungeY * ghost * 7 * (1 - g));
    if (ang) ctx.rotate(ang * u.face * g); ctx.scale(u.face * sx * ms, sy * ms); ctx.drawImage(s.w, -s.ax, -s.ay, s.wd, s.ht); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y - z);
  if (u.jump) { const pv = T.top * 0.45; ctx.translate(0, -pv); ctx.rotate(u.spin); ctx.translate(0, pv); }
  if (ang) ctx.rotate(ang * u.face);
  ctx.scale(u.face * sx * ms, sy * ms);
  if (T.jet) { const fl = 4 + Math.random() * 3; ctx.fillStyle = 'rgba(120,230,255,.85)'; ctx.beginPath(); ctx.moveTo(-3.5, -6); ctx.lineTo(3.5, -6); ctx.lineTo(0, -4 + fl); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-1.6, -6); ctx.lineTo(1.6, -6); ctx.lineTo(0, -6 + fl); ctx.closePath(); ctx.fill(); }
  if (u.equip && u.equip.weapon && EQ_BACK[u.type]) drawEquip(u, T, ctx, 'back');
  ctx.drawImage(u.corrupt ? corruptOf(u.type) : s.c, -s.ax, -s.ay, s.wd, s.ht);
  if (u.equip) drawEquip(u, T);
  if (T.foot) { const l = u.moving && u.stunT <= 0 ? Math.sin(u.walk) * 2.2 : 0, fr = u.d.r; drawFoot(-fr * 0.4, -Math.max(0, l), fr, T.foot); drawFoot(fr * 0.4, -Math.max(0, -l), fr, T.foot); }
  if (T.spark && u.deployT <= 0) { const [fx, fy] = T.spark; const r = 2 + Math.random() * 2; ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(fx, fy, r * 0.45, 0, Math.PI * 2); ctx.fill(); }
  if (u.hitT > 0) { ctx.globalAlpha = alpha * (u.hitT / 0.12) * 0.9; ctx.drawImage(s.w, -s.ax, -s.ay, s.wd, s.ht); }
  if (u.stunT > 0) { if (u.stunKind === 'stone' && s.g) { ctx.globalAlpha = alpha * 0.85; ctx.drawImage(s.g, -s.ax, -s.ay, s.wd, s.ht); } else { ctx.globalAlpha = 0.45; ctx.drawImage(s.w, -s.ax, -s.ay, s.wd, s.ht); } }
  ctx.restore();
  if (u.bshield > 0 && u.deployT <= 0) {   // v0.9.13: barrera dorada del muro de escudos
    const top = topOf(u), k = Math.min(1, u.bshT / 1.5);
    ctx.save(); ctx.globalAlpha = 0.35 + 0.5 * k; ctx.strokeStyle = '#ffcb3d'; ctx.lineWidth = 2; ctx.fillStyle = 'rgba(255,203,61,.10)';
    ctx.beginPath(); ctx.ellipse(x, y - z - top * 0.46, Math.max(u.r * 1.3, top * 0.44), top * 0.62, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  if (u.shield > 0 && u.deployT <= 0) {   // burbuja del escudo de plasma
    const k = u.shield / u.shieldMax, top = topOf(u);
    ctx.save(); ctx.globalAlpha = 0.3 + 0.45 * k; ctx.strokeStyle = '#7df3ff'; ctx.lineWidth = 1.6; ctx.fillStyle = 'rgba(34,227,255,.08)';
    ctx.beginPath(); ctx.ellipse(x, y - z - top * 0.46, Math.max(u.r * 1.25, top * 0.42), top * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
  }
}
// tinte morado-rojizo de las facciones corrompidas por Microblizz (se genera al usarlo)
const CORRUPT = {};
function corruptOf(key) {
  if (CORRUPT[key]) return CORRUPT[key];
  const sp = SPR[key], c = document.createElement('canvas'); c.width = sp.c.width; c.height = sp.c.height;
  const x = c.getContext('2d'); x.drawImage(sp.c, 0, 0); x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(110,0,60,.34)'; x.fillRect(0, 0, c.width, c.height);
  return (CORRUPT[key] = c);
}
// equipo del gashapón dibujado sobre el líder (coordenadas del dibujo, ya escaladas y giradas)
const EQ_HEAD = { bunny: -47, necrolord: -56, twitchking: -60, epicchampion: -64, cybermarine: -62, memelord: -61, progamer: -53, vikingo: -57, directora: -53 };
const EQ_HAND = { bunny: [-12, -16], necrolord: [-13, -24], twitchking: [-20, -34.5], epicchampion: [17, -26], cybermarine: [-14, -21], memelord: [-15.6, -15.6], progamer: [-14.6, -14.6], vikingo: [16, -17], directora: [15, -28] };
// v0.9.15: el arma va en la mano libre (la izquierda del dibujo, en espejo); si tiene las dos ocupadas (espada y escudo, hacha y escudo, megáfono y claqueta), a la espalda
const EQ_MIRROR = { bunny: 1, necrolord: 1, twitchking: 1, cybermarine: 1, memelord: 1, progamer: 1 };
const EQ_BACK = { epicchampion: [-11, -30, -0.4], vikingo: [-10, -29, -0.34], directora: [-10, -27, -0.4] };
function drawEquip(u, T, cc, part) {
  if (part === 'back') { const BK = EQ_BACK[u.type], c = cc || ctx; if (BK && u.equip.weapon) { c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.translate(BK[0], BK[1]); c.rotate(BK[2]); c.scale(-1.55, 1.55); drawWeapon(c, u.equip.weapon, 0, 0); c.restore(); } return; }
  const c = cc || ctx, E = u.equip, hy = EQ_HEAD[u.type] || -T.top, [hx, hdy] = EQ_HAND[u.type] || [u.d.r * 0.85, -T.top * 0.42], ax = -u.d.r * 0.9, ay = -T.top * 0.32;
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  switch (E.head) {
    case 'corona_huesos': shape(c, poly(-8, hy + 2, -9, hy - 6, -5, hy - 2, -2, hy - 9, 2, hy - 2, 6, hy - 9, 9, hy - 2, 8, hy + 2), '#efeadf', 1.5); dot(c, -2, hy - 1, 1.2, '#5ef2d0'); dot(c, 4, hy - 1, 1.2, '#5ef2d0'); break;
    case 'yelmo_olimpo': shape(c, c2 => { c2.arc(0, hy + 4, 9.5, Math.PI, 0); c2.closePath(); }, '#ffcb3d', 1.5); shape(c, c2 => { c2.moveTo(-2, hy - 5); c2.quadraticCurveTo(2, hy - 16, 12, hy - 15); c2.quadraticCurveTo(6, hy - 10, 4, hy - 4); c2.closePath(); }, '#ef4444', 1.3); break;
    case 'gafas_pixel': c.fillStyle = OL; c.fillRect(-9, hy + 8, 18, 2.4); c.fillRect(-8, hy + 10.4, 7, 3.2); c.fillRect(1, hy + 10.4, 7, 3.2); c.fillStyle = '#fff'; c.fillRect(-7, hy + 10.6, 1.6, 1.6); c.fillRect(2, hy + 10.6, 1.6, 1.6); break;
    case 'cuernos': shape(c, c => { c.moveTo(-6, hy + 2); c.quadraticCurveTo(-14, hy, -13, hy - 9); c.quadraticCurveTo(-10, hy - 3, -4, hy - 1); c.closePath(); }, '#f5f0dc', 1.4); shape(c, c => { c.moveTo(6, hy + 2); c.quadraticCurveTo(14, hy, 13, hy - 9); c.quadraticCurveTo(10, hy - 3, 4, hy - 1); c.closePath(); }, '#f5f0dc', 1.4); break;
    case 'corona_carton': shape(c, poly(-8, hy + 2, -9, hy - 7, -4.5, hy - 3, 0, hy - 9, 4.5, hy - 3, 9, hy - 7, 8, hy + 2), '#ffd166', 1.5); line(c, [-7.5, hy - 0.5, 7.5, hy - 0.5], '#e63946', 1.4); break;
    case 'gorro_aluminio': shape(c, poly(-9, hy + 2, 0, hy - 15, 9, hy + 2), '#d9dde3', 1.6); line(c, [-4, hy - 4, 2, hy - 7], '#9aa3b2', 1); line(c, [-2, hy - 1, 5, hy - 3], '#9aa3b2', 1); break;
    case 'auriculares': c.beginPath(); c.arc(0, hy + 6, 10.5, Math.PI * 1.08, Math.PI * 1.92); c.strokeStyle = OL; c.lineWidth = 4; c.stroke(); c.strokeStyle = '#ff3348'; c.lineWidth = 2.2; c.stroke(); shape(c, rr(-13, hy + 2, 5, 8, 2), '#1f2937', 1.4); shape(c, rr(8, hy + 2, 5, 8, 2), '#1f2937', 1.4); break;
    case 'gorra_reves': shape(c, c2 => { c2.arc(0, hy + 4, 9, Math.PI, 0); c2.closePath(); }, '#e63946', 1.5); shape(c, rr(-15, hy + 1.6, 8, 3.4, 1.6), '#b0213a', 1.3); dot(c, 0, hy - 4.6, 1.3, '#fff6ea'); break;
    case 'casco_vr': line(c, [-10, hy + 9, -12, hy + 3], OL, 1.6); line(c, [10, hy + 9, 12, hy + 3], OL, 1.6); shape(c, rr(-10, hy + 7, 20, 8, 2.6), '#2b2d42', 1.5); line(c, [-8, hy + 10.5, 8, hy + 10.5], '#22e3ff', 1.1); dot(c, 6.5, hy + 12.6, 1.1, '#ff3df0'); break;
    case 'orejas_gato': shape(c, poly(-10, hy + 4, -7, hy - 8, -2.5, hy + 1.5), '#2b2d42', 1.4); shape(c, poly(10, hy + 4, 7, hy - 8, 2.5, hy + 1.5), '#2b2d42', 1.4); shape(c, poly(-8, hy + 2.6, -6.6, hy - 4, -4.4, hy + 1.4), '#ff8fd0', 0.8); shape(c, poly(8, hy + 2.6, 6.6, hy - 4, 4.4, hy + 1.4), '#ff8fd0', 0.8); break;
  }
  if (E.weapon && !EQ_BACK[u.type]) { if (EQ_MIRROR[u.type]) { c.save(); c.translate(hx, hdy); c.scale(-1, 1); drawWeapon(c, E.weapon, 0, 0); c.restore(); } else drawWeapon(c, E.weapon, hx, hdy); }
  switch (E.acc) {
    case 'microfono_oro': line(c, [ax, ay + 4, ax, ay - 4], OL, 2.4); shape(c, el(ax, ay - 6, 3.4, 4), '#ffcb3d', 1.3); break;
    case 'nucleo_plasma': shape(c, el(ax, ay, 5.4, 5.4), '#0e7490', 1.3); dot(c, ax, ay, 2.6, '#7df3ff'); break;
    case 'cartucho_dorado': shape(c, rr(ax - 4.5, ay - 6, 9, 11, 1.4), '#ffcb3d', 1.3); c.fillStyle = '#a16207'; c.fillRect(ax - 3, ay - 4, 6, 4); break;
    case 'taza': shape(c, rr(ax - 3.5, ay - 4, 7, 8, 1.4), '#fff', 1.3); c.beginPath(); c.arc(ax + 4, ay, 2, -1.2, 1.2); c.strokeStyle = OL; c.lineWidth = 1.2; c.stroke(); c.fillStyle = '#2e8bff'; c.fillRect(ax - 3, ay - 1, 6, 1.4); break;
    case 'pase_caducado': c.save(); c.translate(ax, ay); c.rotate(-0.3); shape(c, rr(-5, -3, 10, 6, 1), '#ffe14d', 1.2); line(c, [-3, 0, 3, 0], '#e63946', 1); c.restore(); break;
    case 'almohada': c.beginPath(); c.arc(0, hy + 18, 7, 0.1, Math.PI - 0.1); c.strokeStyle = OL; c.lineWidth = 6; c.stroke(); c.strokeStyle = '#7dd3fc'; c.lineWidth = 4; c.stroke(); break;
    case 'silla_gamer': shape(c, rr(ax - 6, ay - 12, 7, 16, 2), '#e63946', 1.3); line(c, [ax - 5, ay - 8, ax - 1, ay - 8], '#1f2937', 1.4); break;
    case 'cofre': shape(c, rr(ax - 5, ay - 3, 10, 7, 1.4), '#a16207', 1.3); line(c, [ax - 5, ay, ax + 5, ay], '#ffcb3d', 1.4); dot(c, ax, ay + 1, 1, '#ffcb3d'); break;
    case 'diploma': c.save(); c.translate(ax, ay - 2); c.rotate(-0.15); shape(c, rr(-6, -4.5, 12, 9, 1), '#8a5a33', 1.2); shape(c, rr(-4.4, -3, 8.8, 6, 0.6), '#fff6ea', 0.8); line(c, [-3, -1, 3, -1], '#a08ab8', 0.8); line(c, [-3, 1, 1.5, 1], '#a08ab8', 0.8); dot(c, 2.6, 1.6, 1.1, '#e63946'); c.restore(); break;
    case 'corbata_ceo': { const ty = hy + 13; shape(c, poly(-2.4, ty, 2.4, ty, 1.6, ty + 3, -1.6, ty + 3), '#b0213a', 1.1); shape(c, poly(-1.6, ty + 3, 1.6, ty + 3, 3, ty + 12, 0, ty + 15, -3, ty + 12), '#e63946', 1.1); line(c, [-1.6, ty + 7, 2, ty + 5.5], '#ffcb3d', 0.9); line(c, [-2.4, ty + 11, 2.6, ty + 9], '#ffcb3d', 0.9); break; }
    case 'bebida_xxl': shape(c, rr(ax - 3.6, ay - 7, 7.2, 12, 1.8), '#7be04a', 1.3); line(c, [ax - 3.6, ay - 4, ax + 3.6, ay - 4], OL, 1); shape(c, poly(ax - 1.5, ay - 1, ax + 1.5, ay - 2, ax - 0.5, ay + 3), '#ffcb3d', 0.6); break;
    case 'disco_fisico': shape(c, el(ax, ay, 6.4, 6.4), '#e5e7eb', 1.3); c.beginPath(); c.arc(ax, ay, 4.2, -0.6, 0.9); c.strokeStyle = '#ff8fd0'; c.lineWidth = 1.2; c.stroke(); dot(c, ax, ay, 1.6, OL); break;
    case 'alfombrilla': shape(c, rr(ax - 8, ay + 1, 16, 5, 1.6), '#2b2d42', 1.2); line(c, [ax - 6, ay + 3.5, ax + 6, ay + 3.5], '#a855f7', 1.1); break;
    case 'boton_pausa': shape(c, el(ax, ay, 5.8, 5.8), '#ff3348', 1.3); c.fillStyle = '#fff6ea'; c.fillRect(ax - 2.6, ay - 2.6, 1.8, 5.2); c.fillRect(ax + 0.8, ay - 2.6, 1.8, 5.2); break;
  }
  c.restore();
}
function drawWeapon(c, id, hx, hdy) {   // v0.9.15: las armas del gashapón (la mano está en hx, hdy)
  switch (id) {
    case 'zanahoria_oro': c.save(); c.translate(hx + 1, hdy - 4); c.rotate(0.25); shape(c, c2 => { c2.moveTo(-3.6, -14); c2.quadraticCurveTo(0, -17, 3.6, -14); c2.lineTo(0.8, 6); c2.quadraticCurveTo(0, 7.4, -0.8, 6); c2.closePath(); }, '#ffcb3d', 1.4); shape(c, poly(-1, -15, -4, -21, 0, -17, 3, -22, 1.4, -15), '#5cc23a', 1.1); c.restore(); break;
    case 'raton_campeon': shape(c, el(hx + 3, hdy - 3, 4.6, 6), '#ffcb3d', 1.4); line(c, [hx + 3, hdy - 9, hx + 3, hdy - 5], OL, 1); dot(c, hx + 3, hdy - 1, 1.2, '#22c55e'); break;
    case 'claqueta_oro': c.save(); c.translate(hx + 2, hdy - 5); c.rotate(-0.3); shape(c, rr(-7, -4, 14, 9, 1), '#ffcb3d', 1.4); shape(c, poly(-7, -4, -6, -9, 7, -9, 7, -4), '#1f2937', 1.2); c.restore(); break;
    case 'espada_carton': line(c, [hx, hdy, hx + 4, hdy - 16], OL, 4.4); line(c, [hx, hdy, hx + 4, hdy - 16], '#c8a27a', 2.6); line(c, [hx - 3, hdy - 2, hx + 3, hdy], OL, 2.4); break;
    case 'raton_dpi': shape(c, el(hx + 3, hdy - 2, 4, 5.4), '#1f2937', 1.4); line(c, [hx + 3, hdy - 7, hx + 3, hdy - 4], '#22e3ff', 1); dot(c, hx + 3, hdy, 1.2, '#ff3df0'); break;
    case 'teclado_rgb': c.save(); c.translate(hx + 2, hdy - 2); c.rotate(-0.5); shape(c, rr(-8, -3, 16, 6, 1.4), '#1f2937', 1.3); ['#ff3348', '#ffcb3d', '#7be04a', '#22e3ff', '#a855f7'].forEach((col, i) => { c.fillStyle = col; c.fillRect(-6.6 + i * 2.8, -1.4, 2, 2.6); }); c.restore(); break;
    case 'banhammer_oro': line(c, [hx, hdy, hx + 3, hdy - 14], OL, 3.6); line(c, [hx, hdy, hx + 3, hdy - 14], '#8a5a33', 2); c.save(); c.translate(hx + 3, hdy - 16); c.rotate(0.3); shape(c, rr(-7, -4, 14, 8, 2), '#ffcb3d', 1.4); c.restore(); break;
    case 'mando_cable': c.beginPath(); c.moveTo(hx, hdy - 4); c.quadraticCurveTo(hx - 14, hdy - 16, hx - 6, hdy - 28); c.strokeStyle = OL; c.lineWidth = 1.4; c.stroke(); shape(c, rr(hx - 7, hdy - 7, 14, 8, 3.4), '#2b2d42', 1.3); dot(c, hx - 3.5, hdy - 3, 1.2, '#ff3348'); dot(c, hx + 3.5, hdy - 3, 1.2, '#22e3ff'); break;
    case 'baguette': c.save(); c.translate(hx + 2, hdy - 9); c.rotate(0.5); shape(c, rr(-3.2, -15, 6.4, 28, 3.2), '#d9a35f', 1.4); for (const yy of [-9, -3, 3, 9]) line(c, [-1.8, yy, 1.8, yy - 2], '#a86b2d', 1); c.restore(); break;
    case 'lanzaconfeti': shape(c, poly(hx - 2.5, hdy, hx + 2.5, hdy, hx + 7, hdy - 15, hx - 7, hdy - 15), '#ffcb3d', 1.4); line(c, [hx - 5, hdy - 9, hx + 5, hdy - 9], '#ff3df0', 1.2); dot(c, hx - 5, hdy - 19, 1.5, '#ff5fa8'); dot(c, hx + 1, hdy - 21, 1.5, '#7be04a'); dot(c, hx + 6, hdy - 18, 1.5, '#63cfe0'); break;
  }
}
function drawStruct(s) {
  if (s.hidden) return;
  const key = s.alive ? s.skin + '_' + s.role : (SPR[s.skin + '_rubble'] ? s.skin + '_rubble' : 'x_rubble'); const sp = SPR[key];
  const sc = s.alive ? 1 : (s.r / 24) * 0.95;
  let sx = 1, sy = 1; if (s.hitT > 0) { const k = s.hitT / 0.12; sx = 1 + 0.03 * k; sy = 1 - 0.03 * k; } if (s.recoil > 0) sy *= 1 - s.recoil * 0.2;
  ctx.save(); ctx.translate(s.x, s.y); ctx.scale(sc * sx, sc * sy);
  ctx.drawImage(s.corrupt ? corruptOf(key) : sp.c, -sp.ax, -sp.ay, sp.wd, sp.ht);
  if (s.alive && s.hitT > 0) { ctx.globalAlpha = (s.hitT / 0.12) * 0.55; ctx.drawImage(sp.w, -sp.ax, -sp.ay, sp.wd, sp.ht); ctx.globalAlpha = 1; }
  ctx.restore();
  if (!s.alive) return;
  if (s.skin === 'y' && s.role === 'base') {   // v0.9.13: la luz de la PayStation
    const ph2 = S && S.e.phase2 && s.team === 'e', r = (10 + (0.6 + 0.4 * Math.sin(G.t * 4)) * 5) * (s.castT > 0 ? 1.9 : 1) * (ph2 ? 1.3 : 1), ex = s.x, ey = s.y - 118;
    const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, r); g.addColorStop(0, ph2 ? 'rgba(255,90,90,.95)' : 'rgba(255,220,110,.95)'); g.addColorStop(1, 'rgba(255,180,40,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI * 2); ctx.fill();
  }
  if (s.team === 'e' && s.role === 'base' && G.bossOn && s.skin !== 'e' && s.skin !== 'y' && s.skin !== 'i') {   // jefe corrupto: aura roja
    const r = 40 + 6 * Math.sin(G.t * 4) + (s.castT > 0 ? 18 : 0), cy = s.y - TOPS[s.skin + '_base'] * 0.55;
    const g = ctx.createRadialGradient(s.x, cy, 0, s.x, cy, r * 1.4); g.addColorStop(0, 'rgba(255,40,80,.28)'); g.addColorStop(1, 'rgba(255,40,80,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, cy, r * 1.4, 0, Math.PI * 2); ctx.fill();
  }
  if (s.skin === 'e' && s.role === 'base') {
    const ex = s.x - 9, ey = s.y - 121; const ph2 = S && S.e.phase2;
    const r = (11 + (0.6 + 0.4 * Math.sin(G.t * 4)) * 5) * (s.castT > 0 ? 1.9 : 1) * (ph2 ? 1.3 : 1);
    const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, r); g.addColorStop(0, 'rgba(255,90,100,.95)'); g.addColorStop(1, 'rgba(255,40,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI * 2); ctx.fill();
    if (ph2) { ctx.globalAlpha = 0.25 + 0.15 * Math.sin(G.t * 8); ctx.strokeStyle = '#ff3348'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(s.x, s.y - 118, 34, 26, 0, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  if (s.skin === 'e' && s.role === 'tower') {
    for (let i = 0; i < 6; i++) if (Math.sin(G.t * 6 + i * 13.7 + s.x) > 0.55) { ctx.fillStyle = '#ffffff'; ctx.fillRect(s.x - 11.5 + ((i * 7) % 3) * 4, s.y - 61 + i * 9.4 + 2.2, 2.4, 2); }
  }
  const gl = SKINS[s.skin].glow && SKINS[s.skin].glow[s.role];
  if (gl && s.hackedT <= 0) {
    const fx = s.x + gl[0], fy = s.y - gl[1], r = gl[2] * (0.85 + 0.15 * Math.sin(G.t * 9 + s.x));
    const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, r); g.addColorStop(0, `rgba(${gl[3]},.5)`); g.addColorStop(1, `rgba(${gl[3]},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2); ctx.fill();
  }
  if (s.hackedT > 0) {   // hackeada por HackerKid
    const top = TOPS[s.skin + '_' + s.role];
    ctx.save(); ctx.globalAlpha = 0.55 + 0.3 * Math.sin(G.t * 30); ctx.fillStyle = '#7be04a';
    for (let i = 0; i < 7; i++) ctx.fillRect(s.x - 24 + ((i * 37 + Math.floor(G.t * 20) * 13) % 48), s.y - top * ((i * 0.17 + G.t * 1.7) % 1), 5 + (i % 3) * 5, 2);
    ctx.restore();
    text('</>', s.x, s.y - top - 34 + Math.sin(G.t * 8) * 2, 14, '#7be04a');
  }
}
function bar(x, y, w, frac, team, h) {
  ctx.fillStyle = 'rgba(20,10,32,.88)'; ctx.beginPath(); rrPath(ctx, x - w / 2 - 2, y - 2, w + 4, h + 4, 3.5); ctx.fill();
  if (frac > 0) { ctx.fillStyle = team === 'p' ? '#ffb02e' : '#4aa3ff'; ctx.beginPath(); rrPath(ctx, x - w / 2, y, Math.max(2.5, w * frac), h, 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x - w / 2 + 1, y + 1, Math.max(0, w * frac - 2), h * 0.35); }
}
function text(str, x, y, size, color) {
  ctx.font = `${size}px ${FONT_D}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(2.5, size * 0.3); ctx.strokeStyle = OL; ctx.strokeText(str, x, y); ctx.fillStyle = color; ctx.fillText(str, x, y);
}
function drawBars(e) {
  if (e.kind === 'struct') {
    if (!e.alive) return;
    const isBase = e.role === 'base', w = isBase ? 92 : 58, h = isBase ? 10 : 8;
    const y = e.team === 'e' && isBase ? e.y + 26 : e.y - TOPS[e.skin + '_' + e.role] - 14;
    bar(e.x, y, w, e.hp / e.maxHp, e.team, h);
    ctx.font = `${isBase ? 10 : 9}px ${FONT_D}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(Math.ceil(e.hp), e.x, y + h / 2 + 1);
    if (isBase) text(e.team === 'e' ? G.ebaseName : FACTIONS[G.faction].base, e.x, e.team === 'e' ? y + 22 : y - 11, 12, e.team === 'e' ? '#cfe4ff' : '#ffe2c4');
    return;
  }
  const u = e; if (u.deployT > 0) return;
  const y = u.y - (u.z || 0) - topOf(u) - 9;
  const bw = clamp(u.r * 2.3, 26, 46);
  if (u.hp < u.maxHp || isLeader(u.type) || (u.shieldMax && u.shield < u.shieldMax)) {
    bar(u.x, y, bw, u.hp / u.maxHp, u.team, 5);
    if (u.shield > 0) { ctx.fillStyle = 'rgba(20,10,32,.88)'; ctx.fillRect(u.x - bw / 2 - 1, y - 5, bw + 2, 4.4); ctx.fillStyle = '#7df3ff'; ctx.fillRect(u.x - bw / 2, y - 4, bw * u.shield / u.shieldMax, 2.4); }
  }
  if (u.stunT > 0 && u.stunKind === 'daze') {
    for (let i = 0; i < 3; i++) { const a = G.t * 6 + (i * Math.PI * 2) / 3; ctx.save(); ctx.translate(u.x + Math.cos(a) * 10, y - 6 + Math.sin(a) * 3.5); ctx.beginPath(); starPath(ctx, 0, 0, 4, 1.7); ctx.fillStyle = '#ffcb3d'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = OL; ctx.stroke(); ctx.restore(); }
    return;
  }
  if (u.stunT > 0 && u.stunKind === 'stone') { if (u.stoneTxt) text(u.stoneTxt, u.x, y - 12, 10, '#d1d5db'); return; }
  if (u.banT > 0) { text('BANEADO', u.x, y - 10, 11, '#d8b4fe'); return; }   // v0.9.15
  if (u.stunT > 0 && u.stunKind === 'update') {   // v0.9.15: Actualización obligatoria
    const k = 1 - Math.max(0, u.stunT) / 3, bw2 = 34; ctx.fillStyle = OL; ctx.fillRect(u.x - bw2 / 2 - 1.5, y - 17.5, bw2 + 3, 8); ctx.fillStyle = '#0f172a'; ctx.fillRect(u.x - bw2 / 2, y - 16, bw2, 5); ctx.fillStyle = '#22e3ff'; ctx.fillRect(u.x - bw2 / 2, y - 16, bw2 * Math.min(0.99, 0.02 + k * 0.4), 5);
    text('1/47', u.x, y - 23, 9, '#7df3ff'); return;
  }
  if (u.stunT > 0 && u.stunKind === 'lag') { text('LAG', u.x, y - 12 + Math.sin(G.t * 20 + u.id) * 1.5, 12, '#ff4b5c'); return; }
  if (u.disarmT > 0) { for (let i = 0; i < 3; i++) { const a = G.t * 9 + i * 2.1; ctx.fillStyle = '#5b3a1c'; ctx.beginPath(); ctx.arc(u.x + Math.cos(a) * 9, y - 4 + Math.sin(a * 1.7) * 5, 1.6, 0, Math.PI * 2); ctx.fill(); } }
  if (u.confT > 0) text('?', u.x + Math.sin(G.t * 6 + u.id) * 6, y - 12, 13, '#ff7af0');
  if (u.zombT > 0) text('Zz', u.x + 10, y - 10 + Math.sin(G.t * 3) * 2, 10, '#b9a8ff');
  if (u.markT > 0) { const mx = u.x + bw / 2 + 8, my = y - 6; ctx.save(); ctx.lineWidth = 3.4; ctx.strokeStyle = OL; ctx.beginPath(); ctx.arc(mx, my, 4, 0, Math.PI * 2); ctx.moveTo(mx + 3, my + 3); ctx.lineTo(mx + 6.5, my + 6.5); ctx.stroke(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#ffe14d'; ctx.stroke(); ctx.restore(); }   // marcado por el Detective
  if (u.olvT > 0 && u.olvOn) text('?', u.x - bw / 2 - 8, y + 2, 13, '#ecc98f');   // las torres aún no se acuerdan
  if (u.d.life && u.d.life - (u.lifeT || 0) < 6) { const rem = Math.ceil(u.d.life - (u.lifeT || 0)); text(rem + ' s', u.x, y - 10, 11, '#ff8a8a'); }   // licencia a punto de caducar
  if (u.rage > 0 && !u.jump && !SAVE.noBadges) { const fx = u.x + bw / 2 + 7, fy = y + 1; flame(fx, fy, 1 + u.rage * 0.06); text(String(u.rage), fx + 8, fy + 2, 10, '#ffcb3d'); }
  if (facOf(u.team) === 'heroes' && S[u.team].xpLvl > 0 && !SAVE.noBadges) { const fx = u.x + bw / 2 + 7, fy = y + 2; ctx.beginPath(); starPath(ctx, fx, fy, 5.4, 2.5); ctx.fillStyle = '#ffcb3d'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = OL; ctx.stroke(); text(String(S[u.team].xpLvl), fx + 8, fy + 1, 10, '#ffe9a8'); }
  if (u.ab && !SAVE.noBadges) {   // habilidad del gashapón: chapita con su color de rareza (v0.9.22: se puede quitar en Opciones)
    const A = ABILITIES[u.ab], R = RARITY[A.rar], fx = u.x - bw / 2 - 8, fy = y + 2;
    ctx.beginPath(); ctx.arc(fx, fy, 6.4, 0, Math.PI * 2); ctx.fillStyle = R[2]; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = OL; ctx.stroke();
    ctx.beginPath(); ctx.arc(fx, fy, 4.4, 0, Math.PI * 2); ctx.fillStyle = R[1]; ctx.fill();
    ctx.font = '6.5px ' + FONT_D; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = OL; ctx.fillText(A.ic, fx, fy + 0.6);
  }
  if (u.labelT > 0) { ctx.globalAlpha = Math.min(1, u.labelT * 2); text((cardDef(u.type) || { name: '' }).name + (u.sequel ? ' 2' : '') + (u.lvl > 1 ? ' · Nv ' + u.lvl : ''), u.x, y - 9, 12, u.corrupt ? '#f0b8ff' : '#d6e8ff'); ctx.globalAlpha = 1; }
  if (u.stunT > 0 && u.stunKind === 'net') {   // v0.9.13: sin conexión (jefes de Phony)
    ctx.save(); ctx.translate(u.x, y - 14 + Math.sin(G.t * 6 + u.id) * 1.5); ctx.lineCap = 'round';
    for (const [r, w] of [[9, 4.6], [5.6, 4.6]]) { ctx.beginPath(); ctx.arc(0, 4, r, Math.PI * 1.22, Math.PI * 1.78); ctx.lineWidth = w; ctx.strokeStyle = OL; ctx.stroke(); ctx.lineWidth = 2.2; ctx.strokeStyle = '#a9c8ff'; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(0, 3.4, 2, 0, Math.PI * 2); ctx.fillStyle = '#a9c8ff'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = OL; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(8, 6); ctx.lineWidth = 4.4; ctx.strokeStyle = OL; ctx.stroke(); ctx.lineWidth = 2.4; ctx.strokeStyle = '#ff3348'; ctx.stroke(); ctx.restore();
    return;
  }
  if (u.stunT > 0) {
    ctx.save(); ctx.translate(u.x, y - 15 + Math.sin(G.t * 6 + u.id) * 1.5);
    ctx.beginPath(); ctx.moveTo(-7, 6); ctx.lineTo(-7, -2); ctx.arc(0, -2, 7, Math.PI, 0); ctx.lineTo(7, 6); ctx.closePath();
    ctx.fillStyle = '#b9bfcc'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = OL; ctx.stroke();
    ctx.fillStyle = OL; ctx.font = '7px ' + FONT_D; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('RIP', 0, 1); ctx.restore();
  }
}
function flame(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -6.5); ctx.bezierCurveTo(1.2, -3.2, 4.6, -1.6, 4.6, 1.8); ctx.arc(0, 1.8, 4.6, 0, Math.PI); ctx.bezierCurveTo(-4.6, -0.2, -3.2, -1.2, -2.2, -2.8); ctx.bezierCurveTo(-1.8, -1.4, -1, -0.8, -0.3, -0.6); ctx.bezierCurveTo(-0.8, -2.8, -1.1, -4.4, 0, -6.5); ctx.closePath();
  ctx.fillStyle = '#ffcb3d'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = OL; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 2.6, 2.3, 0, Math.PI * 2); ctx.fillStyle = '#ff5a2a'; ctx.fill();
  ctx.restore();
}
function drawProj(p) {
  const X = p.x, Y = p.y - p.z;
  if (p.kind === 'trash') {
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 5, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(X, Y); ctx.rotate(G.t * 9); ctx.lineWidth = 1.4; ctx.strokeStyle = OL;
    ctx.beginPath(); ctx.moveTo(-4.5, 4.5); ctx.quadraticCurveTo(-7, -2, -1.5, -5); ctx.lineTo(0, -6.5); ctx.lineTo(1.5, -5); ctx.quadraticCurveTo(7, -2, 4.5, 4.5); ctx.quadraticCurveTo(0, 7, -4.5, 4.5); ctx.closePath(); ctx.fillStyle = '#2a2e3a'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffcb3d'; ctx.fillRect(-1.6, -6, 3.2, 1.6);
    ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(1.5, -9, 1.6 + Math.random() * 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }
  if (p.kind === 'acorn' || p.kind === 'carrot') {
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 4, 1.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(X, Y); ctx.rotate(G.t * 14); ctx.lineWidth = 1.4; ctx.strokeStyle = OL;
    if (p.kind === 'acorn') { ctx.beginPath(); ctx.ellipse(0, 1, 3.6, 4, 0, 0, Math.PI * 2); ctx.fillStyle = '#9a6a33'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -2.4, 4.2, 2, 0, 0, Math.PI * 2); ctx.fillStyle = '#5b3a1c'; ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-3.5, -6); ctx.lineTo(3.5, -6); ctx.lineTo(0, 8); ctx.closePath(); ctx.fillStyle = '#ff8a1f'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -8, 3, 2.4, 0, 0, Math.PI * 2); ctx.fillStyle = '#5cc23a'; ctx.fill(); ctx.stroke(); }
    ctx.restore(); return;
  }
  const ORB = { plasma: ['#a98bff', 'rgba(120,90,255,0)', 9], shadow: ['#9a5cff', 'rgba(60,200,150,0)', 10], frost: ['#9ff0ff', 'rgba(120,220,255,0)', 9], soulfire: ['#5ef2a0', 'rgba(40,200,120,0)', 11], venom: ['#7be04a', 'rgba(60,200,60,0)', 9], fireball: ['#ff8a1f', 'rgba(255,60,20,0)', 15] }[p.kind];
  if (ORB) {
    if (p.kind === 'soulfire' || p.kind === 'fireball') { ctx.globalAlpha = 0.25; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 4, 1.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; if (Math.random() < 0.6) parts.push({ type: 'dust', x: p.x, y: p.y, z: p.z, vx: 0, vy: 0, vz: 10, g: 0, life: 0.3, max: 0.3, size: 3, color: p.kind === 'fireball' ? '#ffb347' : '#7dffb8' }); }
    const g = ctx.createRadialGradient(X, Y, 0, X, Y, ORB[2]); g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, ORB[0]); g.addColorStop(1, ORB[1]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, ORB[2], 0, Math.PI * 2); ctx.fill(); return;
  }
  const ang = Math.atan2((p.ty - p.sy) * 0.85, p.tx - p.sx);
  if (p.kind === 'pixel') { ctx.save(); ctx.translate(X, Y); ctx.fillStyle = 'rgba(255,154,60,.45)'; ctx.fillRect(-6, -6, 12, 12); ctx.fillStyle = '#ff9a3c'; ctx.fillRect(-4, -4, 8, 8); ctx.fillStyle = '#fff3c4'; ctx.fillRect(-2, -2, 4, 4); ctx.restore(); return; }
  if (p.kind === 'popcorn') {
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 4, 1.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(X, Y); ctx.rotate(G.t * 6); ctx.lineWidth = 1.2; ctx.strokeStyle = OL;
    for (const [ox, oy, r] of [[0, 0, 3.4], [3.2, -2, 2.6], [-3, -1.6, 2.6], [0.6, 3, 2.4]]) { ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.fillStyle = '#fff7e0'; ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0.6, 0.4, 1.2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return;
  }
  if (p.kind === 'missile') {
    if (Math.random() < 0.7) parts.push({ type: 'dust', x: p.x, y: p.y, z: p.z, vx: 0, vy: 0, vz: 6, g: 0, life: 0.35, max: 0.35, size: 2.6, color: '#d1d5db' });
    ctx.save(); ctx.translate(X, Y); ctx.rotate(ang); ctx.lineWidth = 1.4; ctx.strokeStyle = OL;
    ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.moveTo(-7, -2); ctx.lineTo(-12 - Math.random() * 4, 0); ctx.lineTo(-7, 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); rrPath(ctx, -7, -2.6, 11, 5.2, 2); ctx.fillStyle = '#e5e7eb'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, -2.6); ctx.lineTo(8, 0); ctx.lineTo(4, 2.6); ctx.closePath(); ctx.fillStyle = '#dc2626'; ctx.fill(); ctx.stroke(); ctx.restore(); return;
  }
  if (p.kind === 'disc') {
    ctx.save(); ctx.translate(X, Y); ctx.scale(1, 0.75); ctx.rotate(G.t * 18); ctx.lineWidth = 1.4; ctx.strokeStyle = OL;
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fillStyle = '#e5e7eb'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 4.2, -0.6, 0.9); ctx.strokeStyle = '#ff8fd0'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 4.2, 2.4, 3.8); ctx.strokeStyle = '#7dd3fc'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fillStyle = OL; ctx.fill(); ctx.restore(); return;
  }
  if (p.kind === 'contract' || p.kind === 'paper') {
    ctx.save(); ctx.translate(X, Y); ctx.rotate(G.t * 9); ctx.lineWidth = 1.3; ctx.strokeStyle = OL;
    ctx.beginPath(); rrPath(ctx, -4.5, -6, 9, 12, 1); ctx.fillStyle = p.kind === 'paper' ? '#f5f0e1' : '#ffffff'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.fillRect(-3, -3.6, 6, 1); ctx.fillRect(-3, -1.4, 6, 1); ctx.fillRect(-3, 0.8, 4, 1);
    if (p.kind === 'contract') { ctx.beginPath(); ctx.arc(2, 3.6, 1.6, 0, Math.PI * 2); ctx.fillStyle = '#dc2626'; ctx.fill(); } else { ctx.fillStyle = '#dc2626'; ctx.fillRect(-3, -5.4, 6, 1.2); }
    ctx.restore(); return;
  }
  if (p.kind === 'shell') {
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#140a1e'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 5, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(X, Y, 5, 0, Math.PI * 2); ctx.fillStyle = '#374151'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = OL; ctx.stroke();
    ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(X + 2, Y - 5, 1.6 + Math.random() * 1.4, 0, Math.PI * 2); ctx.fill(); return;
  }
  if (p.kind === 'heart' || p.kind === 'meme' || p.kind === 'clip' || p.kind === 'card' || p.kind === 'gif' || p.kind === 'note' || p.kind === 'code') {
    ctx.save(); ctx.translate(X, Y); ctx.lineWidth = 1.4; ctx.strokeStyle = OL;
    if (p.kind === 'heart') { const sc = 1 + 0.15 * Math.sin(G.t * 20); ctx.scale(sc, sc); ctx.beginPath(); heartPath(ctx, 0, 0, 5); ctx.fillStyle = '#ff5fa8'; ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(-2, -2, 1.3, 0, Math.PI * 2); ctx.fill(); }
    else if (p.kind === 'meme') { ctx.rotate(G.t * 8); ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fillStyle = '#ffe14d'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(-2.2, -1.4, 1.2, Math.PI, 0); ctx.moveTo(3.4, -1.4); ctx.arc(2.2, -1.4, 1.2, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 1, 3, 0, Math.PI); ctx.closePath(); ctx.fillStyle = '#5a1530'; ctx.fill(); ctx.fillStyle = '#60a5fa'; ctx.fillRect(-5.4, 0, 1.4, 2.6); ctx.fillRect(4, 0, 1.4, 2.6); }
    else if (p.kind === 'clip') { ctx.rotate(G.t * 10); ctx.fillStyle = '#1f2937'; ctx.fillRect(-6, -4.5, 12, 9); ctx.strokeRect(-6, -4.5, 12, 9); ctx.fillStyle = '#c4b5fd'; ctx.fillRect(-4, -2.6, 8, 5.2); ctx.fillStyle = '#fff'; for (const xx of [-5, -2, 1, 4]) { ctx.fillRect(xx, -4, 1.2, 1); ctx.fillRect(xx, 3, 1.2, 1); } }
    else if (p.kind === 'card') { ctx.scale(Math.cos(G.t * 14), 1); ctx.beginPath(); rrPath(ctx, -4.5, -6, 9, 12, 1.6); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); ctx.fillStyle = '#22c55e'; ctx.fillRect(-3, -4.4, 6, 8.8); }
    else if (p.kind === 'gif') { ctx.rotate(Math.sin(G.t * 12) * 0.3); ctx.beginPath(); rrPath(ctx, -8, -5, 16, 10, 2.4); ctx.fillStyle = ['#ff3df0', '#22e3ff', '#ffe14d'][Math.floor(G.t * 10) % 3]; ctx.fill(); ctx.stroke(); txt(ctx, 'GIF', 0, 0.6, 6.4, OL); }
    else if (p.kind === 'note') { ctx.translate(0, Math.sin(G.t * 16 + p.sx) * 3); const col = p.sx % 2 > 1 ? '#22e3ff' : '#ff8fd0'; ctx.beginPath(); ctx.ellipse(-1.5, 3, 3.4, 2.5, -0.4, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); ctx.fillStyle = OL; ctx.fillRect(1.2, -7, 1.6, 10); ctx.beginPath(); ctx.moveTo(2.8, -7); ctx.quadraticCurveTo(7, -5, 5.6, -1); ctx.lineWidth = 1.8; ctx.stroke(); }
    else { ctx.lineJoin = 'round'; ctx.font = '10px ' + FONT_D; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; ctx.strokeText('</>', 0, 0); ctx.fillStyle = '#7be04a'; ctx.fillText('</>', 0, 0); }
    ctx.restore(); return;
  }
  if (p.kind === 'arrow') {
    ctx.save(); ctx.translate(X, Y); ctx.rotate(ang); ctx.lineCap = 'round';
    ctx.strokeStyle = OL; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(4, 0); ctx.stroke();
    ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(4, 0); ctx.stroke();
    ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(-14, -3); ctx.lineTo(-14, 3); ctx.closePath(); ctx.fill();
    ctx.translate(6.5, 0); ctx.rotate(-Math.PI / 2); ctx.beginPath(); heartPath(ctx, 0, 0, 3); ctx.fillStyle = '#ff3d7a'; ctx.fill(); ctx.lineWidth = 1.2; ctx.stroke();
    ctx.restore(); return;
  }
  if (p.kind === 'wave') {
    const a = Math.atan2(p.ty - p.sy, p.tx - p.sx);
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.9 - i * 0.25; ctx.strokeStyle = OL; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(X - Math.cos(a) * i * 6, Y - Math.sin(a) * i * 6, 7 - i, a - 0.9, a + 0.9); ctx.stroke(); ctx.strokeStyle = '#e6dcff'; ctx.lineWidth = 2.2; ctx.stroke(); }
    ctx.globalAlpha = 1; return;
  }
  // rayos rectos: [color, largo, grosor]
  const B = { laser: ['#33e0ff', 20, 7], eyelaser: ['#ff3348', 20, 7], neon: ['#ff3df0', 20, 7], bolt: ['#ffd23f', 18, 8], bullet: ['#ffd23f', 10, 5], snipe: ['#ff3df0', 40, 6], payray: ['#ffcb3d', 20, 7], rgb: [['#ff3df0', '#22e3ff', '#7be04a', '#ffe14d'][Math.floor(G.t * 12) % 4], 20, 7] }[p.kind] || ['#ff3348', 20, 7];
  const dx = p.tx - p.sx, dy = (p.ty - p.z) - (p.sy - p.sz), d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  ctx.lineCap = 'round'; ctx.strokeStyle = B[0]; ctx.globalAlpha = 0.45; ctx.lineWidth = B[2];
  ctx.beginPath(); ctx.moveTo(X - ux * B[1], Y - uy * B[1]); ctx.lineTo(X, Y); ctx.stroke();
  ctx.globalAlpha = 1; ctx.lineWidth = B[2] * 0.37; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(X - ux * B[1] * 0.8, Y - uy * B[1] * 0.8); ctx.lineTo(X, Y); ctx.stroke();
  if (p.kind === 'bolt') { ctx.strokeStyle = '#ffe14d'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(X, Y); for (let i = 1; i < 4; i++) ctx.lineTo(X - ux * i * 6 + rand(-3, 3), Y - uy * i * 6 + rand(-3, 3)); ctx.stroke(); }
}
function drawPart(p) {
  const k = Math.max(0, p.life / p.max);
  switch (p.type) {
    case 'body': {   // v0.9.15: se desploma hacia atrás
      const sp = SPR[p.key]; if (!sp) break; const f = Math.min(1, (1 - k) * 2.4), e = 1 - (1 - f) * (1 - f) * (1 - f);
      ctx.save(); ctx.globalAlpha = Math.min(1, k * 2.4) * 0.92; ctx.translate(p.x - p.face * e * 4, p.y); ctx.rotate(-p.face * e * 1.4); ctx.scale(p.face * p.ms * (1 + 0.06 * e), p.ms * (1 - 0.12 * e));
      ctx.drawImage(p.cor ? corruptOf(p.key) : sp.c, -sp.ax, -sp.ay, sp.wd, sp.ht); ctx.restore(); break;
    }
    case 'dust': ctx.globalAlpha = k * 0.8; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y - p.z, p.size * (1.5 - 0.5 * k), 0, Math.PI * 2); ctx.fill(); break;
    case 'smoke': ctx.globalAlpha = k * 0.4; ctx.fillStyle = '#5f6170'; ctx.beginPath(); ctx.arc(p.x, p.y - p.z, p.size * (1.7 - 0.7 * k), 0, Math.PI * 2); ctx.fill(); break;
    case 'cone': { const r = lerp(p.r1, p.r0, k); ctx.globalAlpha = k; ctx.strokeStyle = p.color; ctx.lineWidth = p.lw * k + 1; ctx.beginPath(); ctx.arc(p.x, p.y, r, p.a - HEAL_CONE / 2, p.a + HEAL_CONE / 2); ctx.stroke(); break; }
    case 'ring': { const r = lerp(p.r1, p.r0, k); ctx.globalAlpha = k; ctx.strokeStyle = p.color; ctx.lineWidth = p.lw * k + 1; ctx.beginPath(); ctx.ellipse(p.x, p.y, r, p.circ ? r : r * 0.42, 0, 0, Math.PI * 2); ctx.stroke(); break; }
    case 'spark': ctx.globalAlpha = k; ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y - p.z); ctx.lineTo(p.x - p.vx * 0.03, p.y - p.z - p.vy * 0.03 + p.vz * 0.03); ctx.stroke(); break;
    case 'chip': ctx.globalAlpha = Math.min(1, k * 2.5); ctx.save(); ctx.translate(p.x, p.y - p.z); ctx.rotate(p.rot); ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7); ctx.lineWidth = 1; ctx.strokeStyle = OL; ctx.strokeRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7); ctx.restore(); break;
    case 'gear': ctx.globalAlpha = Math.min(1, k * 2.5); ctx.save(); ctx.translate(p.x, p.y - p.z); ctx.rotate(p.rot);
      ctx.setLineDash([2, 2]); ctx.lineWidth = 3; ctx.strokeStyle = '#6e7890'; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#b8c1d3'; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2); ctx.fill(); ctx.restore(); break;
    case 'ghost': { ctx.globalAlpha = k * 0.85; const gx = p.x + Math.sin(p.life * 6) * 3, gy = p.y - p.z;
      ctx.beginPath(); ctx.ellipse(gx, gy - 14, 6, 2, 0, 0, Math.PI * 2); ctx.strokeStyle = '#ffcb3d'; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx - 6, gy + 6); ctx.lineTo(gx - 6, gy - 3); ctx.arc(gx, gy - 3, 6, Math.PI, 0); ctx.lineTo(gx + 6, gy + 6); ctx.lineTo(gx + 3, gy + 3.5); ctx.lineTo(gx, gy + 6); ctx.lineTo(gx - 3, gy + 3.5); ctx.closePath();
      ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = OL; ctx.stroke();
      ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(gx - 2.2, gy - 3, 1, 0, Math.PI * 2); ctx.arc(gx + 2.2, gy - 3, 1, 0, Math.PI * 2); ctx.fill(); break; }
    case 'quip': {   // bocadillo con la frase de despedida
      const a = Math.min(1, (1 - k) * 10, k * 4); ctx.globalAlpha = a;
      ctx.font = `800 12.5px "Baloo 2", "Trebuchet MS", system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = ctx.measureText(p.txt).width + 16, bx = clamp(p.x, tw / 2 + 4, W - tw / 2 - 4), by = p.y - p.z;
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = OL; ctx.lineWidth = 2;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx - tw / 2, by - 11, tw, 22, 9); else ctx.rect(bx - tw / 2, by - 11, tw, 22);
      ctx.moveTo(p.x - 4, by + 11); ctx.lineTo(p.x, by + 18); ctx.lineTo(p.x + 4, by + 11);
      ctx.fill(); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.fillRect(p.x - 3, by + 9, 6, 3);
      ctx.fillStyle = OL; ctx.fillText(p.txt, bx, by + 1); ctx.globalAlpha = 1; break;
    }
    case 'stamp': { const age = 1 - k; const sc = age < 0.15 ? lerp(2.2, 1, age / 0.15) : 1; ctx.globalAlpha = Math.min(1, k * 2.5); ctx.save(); ctx.translate(p.x, p.y - p.z); ctx.rotate(-0.15); ctx.scale(sc, sc);
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(-36, -9, 72, 18); ctx.strokeStyle = p.color; ctx.lineWidth = 2.2; ctx.strokeRect(-36, -9, 72, 18);
      ctx.fillStyle = p.color; ctx.font = '13px ' + FONT_D; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.txt, 0, 1.5); ctx.restore(); break; }
    case 'grave': {
      const age = p.max - p.life, pop = Math.min(1, age / 0.18), fade = Math.min(1, p.life / 0.3);
      ctx.globalAlpha = fade; ctx.save(); ctx.translate(p.x, p.y); ctx.scale(pop, pop);
      const g = ctx.createRadialGradient(0, -8, 0, 0, -8, 18); g.addColorStop(0, 'rgba(94,242,160,.5)'); g.addColorStop(1, 'rgba(94,242,160,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -8, 18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-7, -10); ctx.arc(0, -10, 7, Math.PI, 0); ctx.lineTo(7, 0); ctx.closePath(); ctx.fillStyle = '#9a99ad'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = OL; ctx.stroke();
      ctx.fillStyle = OL; ctx.fillRect(-0.8, -14, 1.6, 8); ctx.fillRect(-3, -11.5, 6, 1.6);
      ctx.restore(); break; }
    case 'plus': { ctx.globalAlpha = Math.min(1, k * 2); const px = p.x, py = p.y - p.z; ctx.fillStyle = OL; ctx.fillRect(px - 1.9, py - 5.4, 3.8, 10.8); ctx.fillRect(px - 5.4, py - 1.9, 10.8, 3.8); ctx.fillStyle = '#8cf05a'; ctx.fillRect(px - 0.9, py - 4.4, 1.8, 8.8); ctx.fillRect(px - 4.4, py - 0.9, 8.8, 1.8); break; }
    case 'zap': {   // rayo en cadena de ThunderGod
      ctx.globalAlpha = Math.min(1, k * 1.6); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const R = mulberry32((p.seed + Math.floor(G.t * 30)) | 0); const pts = [];
      for (let i = 0; i < p.pts.length - 1; i++) { const [ax, ay, az] = p.pts[i], [bx, by, bz] = p.pts[i + 1]; for (let j = 0; j < 6; j++) { const t = j / 6, jx = j ? (R() - 0.5) * 12 : 0, jy = j ? (R() - 0.5) * 12 : 0; pts.push([lerp(ax, bx, t) + jx, lerp(ay - az, by - bz, t) + jy]); } }
      const last = p.pts[p.pts.length - 1]; pts.push([last[0], last[1] - last[2]]);
      for (const [w, c] of [[7, 'rgba(255,225,77,.45)'], [3.2, '#ffe14d'], [1.4, '#ffffff']]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); }
      break; }
    case 'beam': { ctx.globalAlpha = k; ctx.lineCap = 'round'; ctx.setLineDash([5, 4]); ctx.lineDashOffset = -G.t * 60; ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x0, p.y0 - p.z0); ctx.lineTo(p.x1, p.y1 - p.z1); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0; break; }
    case 'note': { ctx.globalAlpha = Math.min(1, k * 2); const px = p.x, py = p.y - p.z; ctx.beginPath(); ctx.ellipse(px - 1.5, py + 3, 3, 2.2, -0.4, 0, Math.PI * 2); ctx.fillStyle = p.col; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = OL; ctx.stroke(); ctx.fillStyle = OL; ctx.fillRect(px + 1, py - 6, 1.4, 9); break; }
    case 'card': {   // carta viral de MemeLord
      const age = p.max - p.life, sc = Math.min(1, age / 0.15) * 1.1, flip = Math.cos(Math.min(1, age / 0.35) * Math.PI);
      ctx.globalAlpha = Math.min(1, k * 3); ctx.save(); ctx.translate(p.x, p.y - p.z - age * 14); ctx.scale(sc * Math.abs(flip), sc);
      ctx.beginPath(); rrPath(ctx, -10, -13, 20, 26, 3); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = OL; ctx.stroke();
      if (flip > 0) { ctx.fillStyle = '#22c55e'; ctx.fillRect(-7, -10, 14, 20); txt(ctx, '?', 0, 1, 12, '#fff'); }
      else {
        const col = { heal: '#bbf7d0', stun: '#fef08a', fire: '#fed7aa', dogs: '#fde7c0' }[p.k]; ctx.fillStyle = col; ctx.fillRect(-7, -10, 14, 20);
        if (p.k === 'heal') { ctx.fillStyle = '#16a34a'; ctx.fillRect(-1.6, -6, 3.2, 12); ctx.fillRect(-6, -1.6, 12, 3.2); }
        else if (p.k === 'stun') { ctx.beginPath(); starPath(ctx, 0, 0, 7, 3); ctx.fillStyle = '#facc15'; ctx.fill(); ctx.lineWidth = 1.2; ctx.stroke(); }
        else if (p.k === 'fire') { ctx.scale(1.3, 1.3); ctx.beginPath(); ctx.moveTo(0, -6); ctx.bezierCurveTo(2, -3, 5, -1, 5, 2); ctx.arc(0, 2, 5, 0, Math.PI); ctx.bezierCurveTo(-5, -1, -2, -2, 0, -6); ctx.fillStyle = '#ff7a1a'; ctx.fill(); ctx.lineWidth = 1; ctx.stroke(); }
        else { const sp = SPR.suchdog; ctx.drawImage(sp.c, -sp.ax * 0.42, -sp.ay * 0.42 + 9, sp.wd * 0.42, sp.ht * 0.42); }
      }
      ctx.restore(); break; }
    case 'impact': { const a = 1 - k, r = p.size * (0.45 + a * 0.85); ctx.globalAlpha = Math.min(1, k * 1.6); ctx.save(); ctx.translate(p.x, p.y - p.z); ctx.rotate(p.rot);
      ctx.beginPath(); starPath(ctx, 0, 0, r, r * 0.34, 4); ctx.fillStyle = p.color; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore(); break; }
    case 'flash': { const r = p.size * (0.55 + (1 - k) * 0.6), fy = p.y - p.z, g = ctx.createRadialGradient(p.x, fy, 0, p.x, fy, r);
      g.addColorStop(0, `rgba(255,255,245,${0.8 * k})`); g.addColorStop(0.35, `rgba(${p.rgb},${0.5 * k})`); g.addColorStop(1, `rgba(${p.rgb},0)`);
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, fy, r, 0, Math.PI * 2); ctx.fill(); break; }
    case 'slash': { const a = 1 - k, a0 = p.ang - 0.95, a1 = a0 + 1.9 * Math.min(1, a * 2.2); ctx.save(); ctx.translate(p.x, p.y - p.z); ctx.scale(1, 0.62); ctx.lineCap = 'round'; ctx.globalAlpha = Math.min(1, k * 2);
      ctx.beginPath(); ctx.arc(0, 0, p.size, Math.max(a0, a1 - 1.3), a1);
      const W2 = p.w || 1; ctx.strokeStyle = 'rgba(32,16,44,.55)'; ctx.lineWidth = (8 * k + 2) * W2; ctx.stroke(); ctx.strokeStyle = p.color; ctx.lineWidth = (5.5 * k + 1) * W2; ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = (2.2 * k + 0.5) * W2; ctx.stroke();
      ctx.globalAlpha = Math.min(1, k * 2) * 0.35; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.78, Math.max(a0, a1 - 1.1), a1); ctx.strokeStyle = p.color; ctx.lineWidth = (3 * k + 1) * W2; ctx.stroke(); ctx.restore(); break; }
    case 'hitline': { const a = 1 - k, r1 = p.r0 + p.len * (0.35 + a * 0.9), r0 = p.r0 + p.len * a * 0.85; ctx.globalAlpha = Math.min(1, k * 2); ctx.strokeStyle = p.color; ctx.lineCap = 'round'; ctx.lineWidth = 2.6 * k + 0.6;   // v0.9.24
      ctx.beginPath(); ctx.moveTo(p.x + Math.cos(p.a) * r0, p.y - p.z + Math.sin(p.a) * r0 * 0.75); ctx.lineTo(p.x + Math.cos(p.a) * r1, p.y - p.z + Math.sin(p.a) * r1 * 0.75); ctx.stroke(); break; }
    case 'clapper': {   // v0.9.13: claqueta de cine
      const age = p.max - p.life, pop = Math.min(1, age / 0.15), shut = Math.min(1, age / 0.35), a = -0.55 * (1 - shut);
      ctx.globalAlpha = Math.min(1, k * 3); ctx.save(); ctx.translate(p.x, p.y - p.z - age * 8); ctx.scale(pop, pop); ctx.lineWidth = 1.6; ctx.strokeStyle = OL;
      ctx.beginPath(); rrPath(ctx, -9, -2, 18, 12, 1.4); ctx.fillStyle = '#2b2d3a'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillRect(-7, 2, 14, 1.4); ctx.fillRect(-7, 5.4, 10, 1.4);
      ctx.save(); ctx.translate(-9, -2); ctx.rotate(a); ctx.beginPath(); ctx.rect(0, -4.4, 18, 4.4); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = OL; for (const sx of [2, 7, 12]) { ctx.beginPath(); ctx.moveTo(sx, -4.4); ctx.lineTo(sx + 2.6, -4.4); ctx.lineTo(sx + 1, 0); ctx.lineTo(sx - 1.6, 0); ctx.closePath(); ctx.fill(); }
      ctx.restore(); ctx.restore(); break; }
    case 'conf': ctx.globalAlpha = 1; ctx.save(); ctx.translate(p.x, p.y - p.z); ctx.rotate(p.rot); ctx.fillStyle = p.color; ctx.fillRect(-3.5, -2, 7, 4); ctx.restore(); break;
    case 'env': { if (p.t < 0) break; ctx.globalAlpha = 1; ctx.save(); ctx.translate(p.x, p.y - p.z); ctx.rotate(p.rot + Math.sin(G.t * 10) * 0.15);
      if (p.k === 'lic') {   // v0.9.13: licencia revocada (Phony)
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = OL; ctx.lineWidth = 1.5; ctx.beginPath(); rrPath(ctx, -8, -5.5, 16, 11, 1.6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffcb3d'; ctx.fillRect(-6, -3.6, 4, 3); ctx.fillStyle = '#9ca3af'; ctx.fillRect(-1, -3.4, 6, 1); ctx.fillRect(-1, -1.4, 6, 1);
        ctx.beginPath(); ctx.moveTo(-6, 1); ctx.lineTo(6, 4.6); ctx.moveTo(6, 1); ctx.lineTo(-6, 4.6); ctx.lineWidth = 1.8; ctx.strokeStyle = '#ff3348'; ctx.stroke(); ctx.restore(); break;
      }
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = OL; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.rect(-8, -5.5, 16, 11); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, -5.5); ctx.lineTo(0, 1); ctx.lineTo(8, -5.5); ctx.stroke(); ctx.fillStyle = '#ff3348'; ctx.beginPath(); ctx.arc(0, 1.5, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); break; }
  }
  ctx.globalAlpha = 1;
}
function drawNum(n) {
  const k = n.life / n.max; const age = n.max - n.life; const sc = age < 0.1 ? lerp(n.tx ? 1.3 : 1.6, 1, age / 0.1) : 1;
  let x = n.x, tw = 0;
  if (n.tx) { ctx.font = `${n.size}px ${FONT_D}`; tw = ctx.measureText(n.txt).width + 16; x = clamp(x, tw / 2 + 4, W - tw / 2 - 4); }
  ctx.globalAlpha = Math.min(1, k * (n.tx ? 5 : 3.5)); ctx.save(); ctx.translate(x, n.y - n.z); ctx.scale(sc, sc);
  if (n.tx) { const th = n.size + 9; ctx.fillStyle = 'rgba(20,10,32,.74)'; ctx.beginPath(); rrPath(ctx, -tw / 2, -th / 2 - 1, tw, th, th / 2); ctx.fill(); }
  text(n.txt, 0, 0, n.size, n.color); ctx.restore(); ctx.globalAlpha = 1;
}
function drawGhost() {
  const key = (input.dragging && input.card) || input.selected; const g = input.ghost; if (!key || !g) return;
  if ((g.fy == null ? g.y : g.fy) >= TRAY_Y - 4) return;   // con el dedo sobre las cartas se cancela
  if (isSpell(key)) {   // v0.9.15: el hechizo cae en el sitio exacto, en cualquier parte del campo
    const C = CFG.cards[key], D = C.spell, x = clamp(g.x, BOUNDS.x0, BOUNDS.x1), y = clamp(g.y, BOUNDS.y0, BOUNDS.y1), rich = S.p.chaos >= C.cost;
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = D.col; ctx.beginPath(); ctx.arc(x, y, D.r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.95; ctx.lineWidth = 3; ctx.strokeStyle = rich ? '#ffffff' : '#ff4b5c'; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -G.t * 30; ctx.stroke(); ctx.setLineDash([]);
    const s0 = SPR[key]; if (s0) { ctx.globalAlpha = rich ? 0.9 : 0.45; ctx.drawImage(s0.c, x - s0.ax, y - 30 - s0.ay, s0.wd, s0.ht); }
    ctx.globalAlpha = 1; if (!rich) text(`Faltan ${Math.ceil(C.cost - S.p.chaos)} de CAOS`, clamp(x, 90, W - 90), y - D.r - 14, 13, '#ff8a96');
    ctx.restore(); return;
  }
  const sp = snapSpot('p', g.x, g.y), x = sp.x, y = sp.y;
  const card = CFG.cards[key]; const ok = true, rich = S.p.chaos >= card.cost, can = canDeploy('p', key); const good = rich && can;
  ctx.save();
  if (Math.hypot(g.x - x, g.y - y) > 8) { ctx.globalAlpha = 0.75; ctx.setLineDash([4, 5]); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
  ctx.strokeStyle = good ? '#ffffff' : '#ff4b5c'; ctx.lineWidth = 2.8; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.ellipse(x, y + 1, 36, 14, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  ctx.globalAlpha = good ? 0.82 : 0.42;
  for (let i = 0; i < card.count; i++) { const ox = card.count > 1 ? (i - (card.count - 1) / 2) * 22 : 0, oy = card.count > 1 ? (i % 2) * 6 : 0; const s = SPR[key]; ctx.drawImage(s.c, x + ox - s.ax, y + oy - s.ay, s.wd, s.ht); }
  ctx.globalAlpha = 1;
  if (good) { const bx = laneBridge(x < W / 2 ? 0 : 1); const b = (G.t * 1.8) % 1; for (let i = 0; i < 3; i++) { const yy = RIVER.bottom + 10 - i * 15 - b * 15; ctx.globalAlpha = Math.max(0, 0.95 - i * 0.28); ctx.beginPath(); ctx.moveTo(bx - 12, yy + 6); ctx.lineTo(bx, yy - 4); ctx.lineTo(bx + 12, yy + 6); ctx.lineWidth = 6; ctx.strokeStyle = OL; ctx.stroke(); ctx.lineWidth = 3.4; ctx.strokeStyle = '#fff'; ctx.stroke(); } ctx.globalAlpha = 1; }
  else { const msg = !can ? (S.p.leaderCd > 0 ? `Vuelve en ${Math.ceil(S.p.leaderCd)} s` : 'Ya está en el campo') : !ok ? 'Aquí no: solo tu lado' : `Faltan ${Math.ceil(card.cost - S.p.chaos)} de CAOS`; text(msg, clamp(x, 90, W - 90), y - TYPES[key].top - 20, 17, '#ffb3bc'); }
  ctx.restore();
}

