// Fans of Rumble · Arte: todos los personajes y edificios dibujados con código
'use strict';
/* =========================================================
   ART: every character and building is drawn in code
   (origin = ground point under the feet, up is negative y)
   ========================================================= */
function shape(c, build, fill, lw = 2.2) {
  c.beginPath(); build(c);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (lw) { c.lineWidth = lw; c.strokeStyle = OL; c.stroke(); }
}
const el = (x, y, rx, ry, rot = 0) => c => c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
const rr = (x, y, w, h, r) => c => rrPath(c, x, y, w, h, r);
const poly = (...p) => c => { c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath(); };
function line(c, p, color, lw) { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.strokeStyle = color; c.lineWidth = lw; c.stroke(); }
function dot(c, x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
function heartPath(c, x, y, s) { c.moveTo(x, y + s * 0.9); c.bezierCurveTo(x - s * 1.7, y - s * 0.1, x - s * 0.8, y - s * 1.4, x, y - s * 0.45); c.bezierCurveTo(x + s * 0.8, y - s * 1.4, x + s * 1.7, y - s * 0.1, x, y + s * 0.9); c.closePath(); }
function txt(c, s, x, y, size, color) { c.fillStyle = color; c.font = size + 'px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); }
function starPath(c, x, y, r1, r2, n = 5) { c.moveTo(x, y - r1); for (let i = 1; i < n * 2; i++) { const a = -Math.PI / 2 + (i * Math.PI) / n; const r = i % 2 ? r2 : r1; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); }

// v0.9.15: fondo redondo de los iconos de hechizo: naranja (daño), verde (cura) o morado (loco)
function otxt(c, t, x, y, size, color) { c.font = size + 'px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = Math.max(2, size * 0.32); c.strokeStyle = OL; c.strokeText(t, x, y); c.fillStyle = color; c.fillText(t, x, y); }
function spBg(c, k) { const C = { d: ['#ffd08a', '#ff7a1a'], h: ['#d6ffc2', '#3fa62a'], c: ['#f0c8ff', '#8b3dff'] }[k]; const g = c.createRadialGradient(-5, -29, 3, 0, -22, 23); g.addColorStop(0, C[0]); g.addColorStop(1, C[1]); c.beginPath(); c.arc(0, -22, 21, 0, Math.PI * 2); c.fillStyle = g; c.fill(); c.lineWidth = 2.2; c.strokeStyle = OL; c.stroke(); c.beginPath(); c.arc(0, -22, 17.5, Math.PI * 1.1, Math.PI * 1.5); c.lineWidth = 2.4; c.strokeStyle = 'rgba(255,255,255,.45)'; c.stroke(); }
const ART = {
  // v0.9.15: retratos del CEO de Microblizz y del Presidente de Phony (Modo Jefe)
  ceo(c) {
    shape(c, rr(-9, -19, 7.5, 18, 2.4), '#2b2d3a', 1.6); shape(c, rr(1.5, -19, 7.5, 18, 2.4), '#2b2d3a', 1.6);
    shape(c, el(-5.6, -1.4, 6, 2.6), '#111827', 1.4); shape(c, el(5.6, -1.4, 6, 2.6), '#111827', 1.4);
    shape(c, el(0, -30, 15.5, 15), '#5b6170', 2);
    shape(c, poly(-6, -44, 6, -44, 0, -31), '#fff6ea', 1.4);
    shape(c, poly(-1.8, -42, 1.8, -42, 3, -29, 0, -24, -3, -29), '#e63946', 1.3);
    shape(c, rr(-19, -38, 6.5, 15, 3), '#5b6170', 1.6); shape(c, el(-15.8, -22, 3.4, 3.4), '#f2c7a5', 1.3);
    shape(c, rr(11, -36, 6.5, 13, 3), '#5b6170', 1.6);
    shape(c, rr(9, -24, 17, 13, 2.6), '#7a4d1c', 1.8); line(c, [14, -24, 14, -27, 21, -27, 21, -24], OL, 1.5); otxt(c, '$', 17.5, -17.4, 9, '#9ef07a');
    shape(c, el(0, -52, 10.5, 10.5), '#f2c7a5', 2);
    shape(c, c2 => { c2.moveTo(-10.5, -53); c2.quadraticCurveTo(-9, -65, 2, -63.5); c2.quadraticCurveTo(11, -62, 10.5, -53); c2.quadraticCurveTo(5, -58, -10.5, -53); c2.closePath(); }, '#3b2a1a', 1.6);
    shape(c, rr(-8.6, -55.5, 7.4, 4.6, 1.6), '#111827', 1.1); shape(c, rr(1.2, -55.5, 7.4, 4.6, 1.6), '#111827', 1.1); line(c, [-1.2, -53.6, 1.2, -53.6], '#111827', 1.3);
    line(c, [-4.4, -46.6, 0, -44.6, 4.4, -46.6], OL, 1.5);
  },
  presi(c) {
    shape(c, rr(-9, -19, 7.5, 18, 2.4), '#1e293b', 1.6); shape(c, rr(1.5, -19, 7.5, 18, 2.4), '#1e293b', 1.6);
    shape(c, el(-5.6, -1.4, 6, 2.6), '#0f172a', 1.4); shape(c, el(5.6, -1.4, 6, 2.6), '#0f172a', 1.4);
    shape(c, el(0, -30, 15, 14.5), '#1e3a8a', 2);
    shape(c, poly(-6, -44, 6, -44, 0, -31), '#fff6ea', 1.4);
    shape(c, poly(-1.8, -42, 1.8, -42, 3, -29, 0, -24, -3, -29), '#ffcb3d', 1.3);
    shape(c, rr(-19, -38, 6.5, 15, 3), '#1e3a8a', 1.6); shape(c, el(-15.8, -22, 3.4, 3.4), '#e8b894', 1.3);
    shape(c, rr(11, -40, 6.5, 13, 3), '#1e3a8a', 1.6);
    c.save(); c.translate(19, -42); c.rotate(-0.25); shape(c, rr(-9, -6, 18, 12, 2), '#334155', 1.6); c.fillStyle = '#ffcb3d'; c.fillRect(-6.5, 0.5, 5, 2.6); otxt(c, '9,99', 2.5, -2.4, 5.2, '#fff6ea'); c.restore();
    shape(c, el(0, -52, 10.5, 10.5), '#e8b894', 2);
    shape(c, c2 => { c2.moveTo(-10.5, -52); c2.quadraticCurveTo(-11, -64, 0, -63.5); c2.quadraticCurveTo(11, -64, 10.5, -52); c2.quadraticCurveTo(9, -57, 0, -58); c2.quadraticCurveTo(-9, -57, -10.5, -52); c2.closePath(); }, '#d1d5db', 1.6);
    shape(c, el(-4, -53, 3.3, 3.1), '#e0f2fe', 1.2); shape(c, el(4, -53, 3.3, 3.1), '#e0f2fe', 1.2); line(c, [-0.8, -53, 0.8, -53], OL, 1.2); dot(c, -4, -52.6, 1.1, OL); dot(c, 4, -52.6, 1.1, OL);
    line(c, [-4.2, -46.2, 0, -45, 4.2, -46.2], OL, 1.5);
  },
  /* ---------- v0.9.15: mata-sanadores del gashapón de cartas (uno por facción) ---------- */
  huron(c) {
    shape(c, c => { c.moveTo(-5, -9); c.bezierCurveTo(-21, -7, -27, -20, -20, -29); c.bezierCurveTo(-17, -24, -12, -18, -3, -15); c.closePath(); }, '#9a6634');
    shape(c, c => { c.moveTo(-20, -29); c.bezierCurveTo(-24, -32, -26, -27, -23, -24); c.quadraticCurveTo(-21, -27, -20, -29); c.closePath(); }, '#2b1622', 1.4);
    line(c, [-9, -4, 10, -41], OL, 4.4); line(c, [-9, -4, 10, -41], '#e5e7eb', 2.2);
    line(c, [6, -33, 11, -44], OL, 4); line(c, [6, -33, 11, -44], '#7b2cbf', 2.2); line(c, [3, -32, 9, -35], OL, 2.2);
    shape(c, el(0, -12, 11, 12), '#9a6634');
    shape(c, el(0, -10, 6.5, 8), '#f3dfc0', 0);
    shape(c, el(-11, -14, 3, 4.4, 0.5), '#9a6634', 1.6); shape(c, el(11, -15, 3, 4.4, -0.5), '#9a6634', 1.6);
    shape(c, el(0, -30, 11.5, 9.5), '#9a6634');
    shape(c, el(-8.5, -38, 3.4, 3.4), '#9a6634', 1.6); shape(c, el(8.5, -38, 3.4, 3.4), '#9a6634', 1.6);
    shape(c, el(-8.5, -38, 1.6, 1.6), '#f3b8c8', 0); shape(c, el(8.5, -38, 1.6, 1.6), '#f3b8c8', 0);
    shape(c, el(0, -26.5, 6.4, 4.2), '#f3dfc0', 0);
    shape(c, rr(-11.6, -33.4, 23.2, 6, 3), '#2b1622', 1.6);
    shape(c, el(-4.6, -30.4, 2.6, 1.4), '#fff', 0); shape(c, el(4.6, -30.4, 2.6, 1.4), '#fff', 0);
    dot(c, -4, -30.3, 1, OL); dot(c, 5.2, -30.3, 1, OL);
    line(c, [-7.6, -32.6, -2, -31.2], OL, 1.2); line(c, [2, -31.2, 7.6, -32.6], OL, 1.2);
    shape(c, el(0, -26.6, 1.7, 1.2), '#2b1622', 0);
    shape(c, rr(-11, -37.4, 22, 3.4, 1.4), '#e63946', 1.4);
    shape(c, c => { c.moveTo(-11, -36.4); c.quadraticCurveTo(-17, -39, -20, -35); c.quadraticCurveTo(-16, -36, -11, -34.4); c.closePath(); }, '#e63946', 1.3);
    shape(c, c => { c.moveTo(-11, -35.4); c.quadraticCurveTo(-16, -33, -18, -29); c.quadraticCurveTo(-14, -32, -11, -34); c.closePath(); }, '#e63946', 1.3);
  },
  sombra(c) {
    shape(c, c => { c.moveTo(-14, -8); c.quadraticCurveTo(-17, -26, -12, -38); c.quadraticCurveTo(0, -50, 12, -38); c.quadraticCurveTo(17, -26, 14, -8); c.lineTo(9, -2); c.lineTo(5, -7); c.lineTo(0, 0); c.lineTo(-5, -7); c.lineTo(-9, -2); c.closePath(); }, '#3b1d5c');
    shape(c, c => { c.moveTo(-9, -12); c.quadraticCurveTo(-11, -26, -8, -34); c.quadraticCurveTo(0, -42, 8, -34); c.quadraticCurveTo(11, -26, 9, -12); c.quadraticCurveTo(0, -8, -9, -12); c.closePath(); }, '#24103a', 0);
    shape(c, c => { c.moveTo(-9, -24); c.quadraticCurveTo(0, -42, 9, -24); c.quadraticCurveTo(0, -20, -9, -24); c.closePath(); }, '#0e0618', 1.6);
    shape(c, el(-3.6, -28, 2.2, 1.5, 0.2), '#7dffb8', 0); shape(c, el(3.6, -28, 2.2, 1.5, -0.2), '#7dffb8', 0);
    c.globalAlpha = 0.35; dot(c, -3.6, -28, 4.2, '#7dffb8'); dot(c, 3.6, -28, 4.2, '#7dffb8'); c.globalAlpha = 1;
    for (const sx of [-1, 1]) {
      c.save(); c.translate(sx * 13, -20); c.scale(sx, 1);
      shape(c, c => { c.moveTo(0, -3); c.quadraticCurveTo(7, -2, 8, 5); c.lineTo(5, 3); c.lineTo(4.4, 7); c.lineTo(2, 3.6); c.lineTo(0, 6); c.closePath(); }, '#3b1d5c', 1.6);
      line(c, [5, 3, 9, 8], '#d9c8ff', 1.4); line(c, [2.4, 4, 4, 9], '#d9c8ff', 1.4);
      c.restore();
    }
  },
  hater(c) {
    shape(c, c => { c.moveTo(-12, -24); c.quadraticCurveTo(-13, -8, -10, -4); c.lineTo(10, -4); c.quadraticCurveTo(13, -8, 12, -24); c.quadraticCurveTo(0, -28, -12, -24); c.closePath(); }, '#6b7280');
    shape(c, rr(-5, -14, 10, 5, 2), '#4b5563', 1.2);
    line(c, [-3, -24, -2, -17], '#e5e7eb', 1.2); line(c, [3, -24, 2, -17], '#e5e7eb', 1.2);
    shape(c, c => { c.moveTo(-12, -30); c.quadraticCurveTo(-13, -46, 0, -46); c.quadraticCurveTo(13, -46, 12, -30); c.quadraticCurveTo(12, -23, 0, -23); c.quadraticCurveTo(-12, -23, -12, -30); c.closePath(); }, '#6b7280');
    shape(c, el(0, -32, 8.4, 7.8), '#f1c9a5', 1.8);
    line(c, [-6, -36.6, -1.6, -34.4], OL, 1.8); line(c, [6, -36.6, 1.6, -34.4], OL, 1.8);
    dot(c, -3.6, -32.6, 1.2, OL); dot(c, 3.6, -32.6, 1.2, OL);
    c.beginPath(); c.moveTo(-3.2, -27.6); c.quadraticCurveTo(0, -29.6, 3.2, -27.6); c.strokeStyle = OL; c.lineWidth = 1.4; c.stroke();
    line(c, [12, -18, 16, -26], OL, 3.6); line(c, [12, -18, 16, -26], '#f1c9a5', 2);
    line(c, [17, -24, 17, -40], OL, 3.2); line(c, [17, -24, 17, -40], '#8a5a33', 1.8);
    c.save(); c.translate(15, -41); c.rotate(0.08);
    shape(c, rr(-13, -10, 26, 12, 2.4), '#fff6ea', 1.8);
    txt(c, 'BUUU', 0, -3.6, 8, '#e63946');
    c.restore();
  },
  arpia(c) {
    for (const sx of [-1, 1]) {
      c.save(); c.scale(sx, 1);
      shape(c, c => { c.moveTo(6, -26); c.quadraticCurveTo(22, -40, 28, -30); c.quadraticCurveTo(24, -28, 26, -22); c.quadraticCurveTo(21, -22, 21, -16); c.quadraticCurveTo(15, -18, 7, -16); c.closePath(); }, '#9a6634');
      line(c, [12, -26, 22, -30], '#6b4423', 1.2); line(c, [12, -22, 20, -22], '#6b4423', 1.2);
      c.restore();
    }
    line(c, [-4, -8, -6, -1], OL, 3.4); line(c, [-4, -8, -6, -1], '#ffb04f', 1.8);
    line(c, [4, -8, 6, -1], OL, 3.4); line(c, [4, -8, 6, -1], '#ffb04f', 1.8);
    for (const [x, d] of [[-6, -1], [6, 1]]) { line(c, [x, -1, x - 3 * d, 1], OL, 1.6); line(c, [x, -1, x + 2 * d, 1.4], OL, 1.6); }
    shape(c, c => { c.moveTo(-8, -24); c.quadraticCurveTo(-10, -10, -5, -7); c.lineTo(5, -7); c.quadraticCurveTo(10, -10, 8, -24); c.quadraticCurveTo(0, -27, -8, -24); c.closePath(); }, '#b5793c');
    line(c, [-5, -15, 5, -15], '#8a5a2b', 1.2); line(c, [-5, -11, 5, -11], '#8a5a2b', 1.2);
    shape(c, c => { c.moveTo(-10, -30); c.quadraticCurveTo(-14, -48, 0, -47); c.quadraticCurveTo(14, -48, 10, -30); c.quadraticCurveTo(12, -22, 7, -24); c.quadraticCurveTo(0, -20, -7, -24); c.quadraticCurveTo(-12, -22, -10, -30); c.closePath(); }, '#4a2f6b');
    shape(c, el(0, -33, 7.4, 8), '#f4d2b0', 1.8);
    line(c, [-5.4, -37, -1.6, -35.2], OL, 1.6); line(c, [5.4, -37, 1.6, -35.2], OL, 1.6);
    shape(c, el(-3, -33.4, 1.6, 1.8), '#ffcb3d', 1); shape(c, el(3, -33.4, 1.6, 1.8), '#ffcb3d', 1);
    shape(c, poly(-1.8, -30.8, 1.8, -30.8, 0, -28), '#ffb04f', 1.1);
    shape(c, c => { c.moveTo(-9, -40); c.quadraticCurveTo(-4, -45, 0, -41); c.quadraticCurveTo(4, -46, 9, -40); c.quadraticCurveTo(5, -42, 0, -39); c.quadraticCurveTo(-5, -42, -9, -40); c.closePath(); }, '#4a2f6b', 0);
  },
  dron(c) {
    line(c, [-6, -20, -18, -30], OL, 3.4); line(c, [6, -20, 18, -30], OL, 3.4);
    line(c, [-6, -20, -18, -30], '#475569', 1.8); line(c, [6, -20, 18, -30], '#475569', 1.8);
    shape(c, el(-18, -31, 9, 2.4), 'rgba(200,230,255,.85)', 1.4); shape(c, el(18, -31, 9, 2.4), 'rgba(200,230,255,.85)', 1.4);
    dot(c, -18, -31, 1.6, OL); dot(c, 18, -31, 1.6, OL);
    shape(c, c => { c.moveTo(-12, -20); c.quadraticCurveTo(-12, -32, 0, -32); c.quadraticCurveTo(12, -32, 12, -20); c.quadraticCurveTo(12, -10, 0, -9); c.quadraticCurveTo(-12, -10, -12, -20); c.closePath(); }, '#334155');
    shape(c, c => { c.moveTo(-9, -22); c.quadraticCurveTo(0, -30, 9, -22); c.quadraticCurveTo(0, -25, -9, -22); c.closePath(); }, '#64748b', 0);
    shape(c, el(0, -18, 6, 5), '#0f172a', 1.6);
    shape(c, el(0, -18, 3.4, 3), '#ff3348', 0); dot(c, 1, -19, 1, '#ffd2d8');
    line(c, [-10, -12, -14, -5], OL, 2.4); line(c, [10, -12, 14, -5], OL, 2.4);
    line(c, [-14, -5, -11, -3], OL, 2); line(c, [14, -5, 11, -3], OL, 2);
    shape(c, poly(-4, -9, 4, -9, 0, -4), '#22e3ff', 1.2);
  },
  clickbait(c) {
    line(c, [-5, -10, -6, -1], OL, 3.4); line(c, [5, -10, 6, -1], OL, 3.4);
    line(c, [-14, -24, -19, -16], OL, 3.4); line(c, [14, -24, 19, -30], OL, 3.4);
    shape(c, rr(-16, -42, 32, 32, 3), '#fff6ea', 2.2);
    shape(c, rr(-13.4, -39.4, 26.8, 26.8, 1.6), '#ffe14d', 1.2);
    shape(c, el(-3, -27, 7.6, 8.2), '#f1c9a5', 1.6);
    shape(c, el(-5.6, -29, 2.2, 2.6), '#fff', 1); shape(c, el(-0.4, -29, 2.2, 2.6), '#fff', 1);
    dot(c, -5.6, -28.6, 1, OL); dot(c, -0.4, -28.6, 1, OL);
    shape(c, el(-3, -23.2, 2, 2.6), '#5a1530', 1.1);
    c.beginPath(); c.arc(-3, -27, 11, 0, Math.PI * 2); c.lineWidth = 3.4; c.strokeStyle = OL; c.stroke(); c.lineWidth = 1.8; c.strokeStyle = '#ff3348'; c.stroke();
    c.save(); c.translate(9, -19); c.rotate(-0.7);
    shape(c, poly(-1.6, 0, 1.6, 0, 1.6, -7, 4, -7, 0, -12, -4, -7, -1.6, -7), '#ff3348', 1.3);
    c.restore();
    txt(c, '!!!', 8, -35, 7, '#ff3348');
  },
  campero(c) {
    for (const [x, y, r, col] of [[-10, -12, 8, '#4d7c0f'], [10, -12, 8, '#4d7c0f'], [0, -10, 9, '#3f6212'], [-9, -24, 9, '#65a30d'], [9, -24, 9, '#4d7c0f'], [0, -32, 10, '#65a30d'], [-6, -38, 6, '#4d7c0f'], [7, -38, 6, '#3f6212']]) shape(c, el(x, y, r, r * 0.92), col, 1.8);
    for (const [x, y] of [[-12, -18], [12, -30], [-4, -42], [6, -16], [-2, -26]]) line(c, [x, y, x + 2, y - 4], '#a3e635', 1.3);
    shape(c, rr(-7, -30, 14, 5.6, 2.6), '#1f2937', 1.4);
    shape(c, el(-3.2, -27.4, 2, 1.6), '#fff', 0); shape(c, el(3.2, -27.4, 2, 1.6), '#fff', 0);
    dot(c, -2.6, -27.3, 1, OL); dot(c, 3.8, -27.3, 1, OL);
    line(c, [13, -18, 22, -24], OL, 3.4); line(c, [13, -18, 22, -24], '#9ca3af', 1.8);
    line(c, [19, -21, 21, -18], OL, 2);
  },
  espia(c) {
    shape(c, c => { c.moveTo(-11, -28); c.quadraticCurveTo(-15, -12, -12, -4); c.lineTo(12, -4); c.quadraticCurveTo(15, -12, 11, -28); c.quadraticCurveTo(0, -31, -11, -28); c.closePath(); }, '#c8a46e');
    line(c, [0, -28, 0, -5], '#a07f4c', 1.4); line(c, [-11, -16, 11, -16], '#8a6a3c', 2.4);
    shape(c, rr(-1.6, -17.6, 3.2, 3.2, 0.6), '#ffcb3d', 1);
    shape(c, poly(-6, -28, 0, -20, 6, -28, 3, -29, 0, -25, -3, -29), '#9a7a48', 1.3);
    shape(c, el(0, -34, 7.6, 7.4), '#f1c9a5', 1.8);
    shape(c, rr(-7.4, -36.6, 6.4, 3.4, 1.2), '#111827', 1.2); shape(c, rr(1, -36.6, 6.4, 3.4, 1.2), '#111827', 1.2);
    line(c, [-1, -35.2, 1, -35.2], OL, 1.2);
    shape(c, c => { c.moveTo(-5, -30.4); c.quadraticCurveTo(0, -32, 5, -30.4); c.quadraticCurveTo(0, -29.4, -5, -30.4); c.closePath(); }, '#5b3a1c', 1);
    shape(c, el(0, -40.4, 14, 3), '#4b5563', 1.8);
    shape(c, c => { c.moveTo(-8, -40); c.quadraticCurveTo(-8, -49, 0, -49); c.quadraticCurveTo(8, -49, 8, -40); c.closePath(); }, '#4b5563', 1.8);
    shape(c, rr(-8, -43, 16, 2.6, 1), '#1f2937', 0);
    c.save(); c.translate(12, -10); c.rotate(-0.25);
    shape(c, rr(-5, -6, 10, 8, 1.4), '#fff6ea', 1.4);
    txt(c, 'X', 0, -2, 7, '#e63946');
    c.restore();
  },
  paparazzi(c) {
    shape(c, c => { c.moveTo(-11, -26); c.quadraticCurveTo(-13, -10, -10, -4); c.lineTo(10, -4); c.quadraticCurveTo(13, -10, 11, -26); c.quadraticCurveTo(0, -29, -11, -26); c.closePath(); }, '#78716c');
    for (const y of [-21, -14]) { shape(c, rr(-9, y, 6, 4.4, 1), '#57534e', 1); shape(c, rr(3, y, 6, 4.4, 1), '#57534e', 1); }
    shape(c, el(0, -33, 7.8, 7.6), '#f1c9a5', 1.8);
    dot(c, -2.6, -33.6, 1.2, OL);
    c.beginPath(); c.moveTo(-3.6, -28.8); c.quadraticCurveTo(0, -27, 3.4, -29.4); c.strokeStyle = OL; c.lineWidth = 1.3; c.stroke();
    shape(c, c => { c.moveTo(-8, -36); c.quadraticCurveTo(-8, -43, 0, -43); c.quadraticCurveTo(8, -43, 8, -36); c.closePath(); }, '#e63946', 1.8);
    shape(c, rr(-13, -37.4, 12, 3, 1.4), '#b0213a', 1.4);
    shape(c, rr(1, -40, 16, 12, 2.4), '#1f2937', 2);
    shape(c, el(9, -34, 4.4, 4.4), '#334155', 1.6); shape(c, el(9, -34, 2.4, 2.4), '#63cfe0', 0);
    shape(c, rr(4, -46, 9, 6, 1.4), '#e5e7eb', 1.6); shape(c, rr(5.6, -44.6, 5.8, 3.2, 0.8), '#fffbe0', 0);
    c.globalAlpha = 0.5; for (const a of [-0.9, -0.4, 0.1]) line(c, [8.5 + Math.cos(a) * 6, -43 + Math.sin(a) * 6, 8.5 + Math.cos(a) * 11, -43 + Math.sin(a) * 11], '#ffe14d', 1.6); c.globalAlpha = 1;
  },
  /* ---------- v0.9.15: hechizos del gashapón de cartas (icono de cada carta) ---------- */
  sp_bellotas(c) { spBg(c, 'd'); for (const [x, y, r] of [[-6, -32, 6], [2, -35, 7.5], [9, -31, 5.6]]) shape(c, el(x, y, r, r * 0.8), '#f5f3ff', 1.8); shape(c, rr(-11, -33, 25, 6, 3), '#f5f3ff', 0); for (const [x, y] of [[-8, -16], [2, -11], [10, -19]]) { shape(c, el(x, y + 1.5, 3.8, 4.4), '#9a6a33', 1.4); shape(c, el(x, y - 2.2, 4.6, 2.2), '#5b3a1c', 1.4); line(c, [x, y - 4.6, x + 1, y - 6.6], OL, 1.2); } },
  sp_botiquin(c) { spBg(c, 'h'); shape(c, c => { c.moveTo(-5, -33); c.quadraticCurveTo(-5, -38, 0, -38); c.quadraticCurveTo(5, -38, 5, -33); }, null, 2.6); line(c, [-5, -33, -5, -30], OL, 2.6); line(c, [5, -33, 5, -30], OL, 2.6); shape(c, rr(-15, -31, 30, 21, 4), '#fff6ea', 2.2); shape(c, poly(-2.6, -28, 2.6, -28, 2.6, -23, 7.6, -23, 7.6, -18, 2.6, -18, 2.6, -13, -2.6, -13, -2.6, -18, -7.6, -18, -7.6, -23, -2.6, -23), '#2f9e3a', 1.4); shape(c, c => { c.moveTo(9, -31); c.quadraticCurveTo(17, -38, 18, -30); c.quadraticCurveTo(14, -29, 9, -31); c.closePath(); }, '#7be04a', 1.3); },
  sp_pulgas(c) { spBg(c, 'c'); for (const [x, y, s] of [[-5, -20, 1], [8, -30, 0.7]]) { c.save(); c.translate(x, y); c.scale(s, s); for (const a of [-1, 0, 1]) { line(c, [a * 3, 4, a * 7 - 2, 11], OL, 1.6); } shape(c, el(0, 0, 8, 6.4), '#8b5530', 2); shape(c, el(-6, -5, 4.6, 4), '#a86b3c', 1.8); shape(c, el(-7.4, -6, 1.6, 1.8), '#fff', 0.8); dot(c, -7.6, -5.8, 0.8, OL); line(c, [-9, -8, -12, -13], OL, 1.2); line(c, [-7, -9, -8, -14], OL, 1.2); c.restore(); } line(c, [-14, -34, -10, -38], '#fff6ea', 1.6); line(c, [-16, -29, -11, -30], '#fff6ea', 1.6); },
  sp_lapidas(c) { spBg(c, 'd'); shape(c, c => { c.moveTo(-11, -9); c.lineTo(-11, -28); c.quadraticCurveTo(-11, -40, 0, -40); c.quadraticCurveTo(11, -40, 11, -28); c.lineTo(11, -9); c.closePath(); }, '#b9bfcc', 2.2); otxt(c, 'RIP', 0, -26, 9, OL); line(c, [3, -38, 1, -33, 5, -30], OL, 1.2); shape(c, rr(-14, -11, 28, 4, 1.6), '#6b7280', 1.6); line(c, [-16, -38, -13, -42], '#fff6ea', 1.6); line(c, [15, -40, 13, -44], '#fff6ea', 1.6); },
  sp_formol(c) { spBg(c, 'h'); shape(c, c => { c.moveTo(-4, -38); c.lineTo(4, -38); c.lineTo(4, -30); c.quadraticCurveTo(13, -26, 12, -17); c.quadraticCurveTo(11, -8, 0, -8); c.quadraticCurveTo(-11, -8, -12, -17); c.quadraticCurveTo(-13, -26, -4, -30); c.closePath(); }, '#e5fff1', 2.2); shape(c, c => { c.moveTo(-11.6, -19); c.quadraticCurveTo(0, -23, 11.6, -19); c.quadraticCurveTo(11, -9, 0, -9); c.quadraticCurveTo(-11, -9, -11.6, -19); c.closePath(); }, '#7dffb8', 0); shape(c, rr(-5, -43, 10, 6, 1.6), '#a86b3c', 1.6); for (const [x, y, r] of [[-4, -15, 1.8], [3, -18, 1.3], [5, -13, 1]]) shape(c, el(x, y, r, r), '#e5fff1', 0.8); },
  sp_eternas(c) { spBg(c, 'c'); shape(c, el(0, -23, 14, 14), '#fff6ea', 2.4); for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [Math.cos(a) * 11, -23 + Math.sin(a) * 11, Math.cos(a) * 12.6, -23 + Math.sin(a) * 12.6], OL, 1.2); } line(c, [0, -23, -1, -32], OL, 2); line(c, [0, -23, 6, -21], OL, 2); dot(c, 0, -23, 1.6, '#7d5fff'); otxt(c, 'Zz', 12, -38, 9, '#fff6ea'); },
  sp_donaciones(c) { spBg(c, 'd'); for (const [x, y] of [[-8, -12], [-8, -16], [-8, -20], [6, -12], [6, -16]]) { shape(c, el(x, y, 8, 3.4), '#ffcb3d', 1.6); } shape(c, el(-8, -24, 8, 3.4), '#ffe06a', 1.6); shape(c, el(6, -20, 8, 3.4), '#ffe06a', 1.6); shape(c, c => { c.moveTo(4, -32); c.bezierCurveTo(4, -36, 9, -36, 9, -32); c.bezierCurveTo(9, -36, 14, -36, 14, -32); c.quadraticCurveTo(14, -28, 9, -24.6); c.quadraticCurveTo(4, -28, 4, -32); c.closePath(); }, '#ff5fa8', 1.4); },
  sp_merienda(c) { spBg(c, 'h'); shape(c, rr(-15, -16, 30, 6, 3), '#e0a050', 2); shape(c, c => { c.moveTo(-15, -18); for (let x = -15; x <= 15; x += 5) c.quadraticCurveTo(x + 2.5, -22, x + 5, -18); c.lineTo(15, -16); c.lineTo(-15, -16); c.closePath(); }, '#7be04a', 1.4); shape(c, rr(-13, -21, 26, 3, 1.4), '#ff5a3c', 1.2); shape(c, rr(-14, -24, 28, 3.4, 1.4), '#ffe06a', 1.2); shape(c, c => { c.moveTo(-15, -24); c.quadraticCurveTo(-15, -36, 0, -36); c.quadraticCurveTo(15, -36, 15, -24); c.closePath(); }, '#e0a050', 2); for (const [x, y] of [[-6, -30], [0, -32], [6, -30]]) dot(c, x, y, 0.9, '#fff6ea'); },
  sp_baneo(c) { spBg(c, 'c'); c.save(); c.translate(0, -24); c.rotate(-0.6); line(c, [0, 2, 0, 18], OL, 5); line(c, [0, 2, 0, 18], '#8a5a33', 3); shape(c, rr(-12, -9, 24, 12, 2.6), '#9ca3af', 2.2); shape(c, rr(-12, -9, 5, 12, 1.6), '#6b7280', 0); otxt(c, 'BAN', 1.6, -3, 8.6, '#e63946'); c.restore(); },
  sp_rayo(c) { spBg(c, 'd'); for (const [x, y, r] of [[-7, -36, 6], [1, -38.5, 7], [8, -35.5, 5.4]]) shape(c, el(x, y, r, r * 0.75), '#cbd5e1', 1.6); shape(c, poly(2, -34, -7, -20, -1, -20, -5, -6, 9, -24, 2, -24, 6, -34), '#ffe14d', 1.8); },
  sp_ambrosia(c) { spBg(c, 'h'); shape(c, c => { c.moveTo(-11, -35); c.lineTo(11, -35); c.quadraticCurveTo(11, -22, 2, -20); c.lineTo(2, -13); c.lineTo(7, -10); c.lineTo(-7, -10); c.lineTo(-2, -13); c.lineTo(-2, -20); c.quadraticCurveTo(-11, -22, -11, -35); c.closePath(); }, '#ffcb3d', 2); shape(c, el(0, -34.6, 11, 2.6), '#fff1c9', 1.4); shape(c, el(0, -28, 3.2, 3.2), '#ff5fa8', 1.2); for (const [x, y] of [[-13, -40], [13, -42], [15, -24]]) { c.beginPath(); starPath(c, x, y, 3.2, 1.3, 4); c.fillStyle = '#fff6ea'; c.fill(); } },
  sp_nerfeo(c) { spBg(c, 'c'); shape(c, poly(-6, -40, 6, -40, 6, -24, 12, -24, 0, -10, -12, -24, -6, -24), '#63cfe0', 2); otxt(c, '-40%', 0, -31, 7.4, OL); },
  sp_orbital(c) { spBg(c, 'd'); c.globalAlpha = 0.8; shape(c, poly(-3, -30, 3, -30, 8, -6, -8, -6), '#7df3ff', 0); c.globalAlpha = 1; line(c, [0, -30, 0, -7], '#e0faff', 1.6); shape(c, el(0, -7, 10, 3), '#22e3ff', 1.4); shape(c, rr(-4, -40, 8, 9, 2), '#cbd5e1', 1.8); shape(c, rr(-15, -38, 9, 5, 1), '#2563eb', 1.4); shape(c, rr(6, -38, 9, 5, 1), '#2563eb', 1.4); line(c, [-6, -35.6, -4, -35.6], OL, 1.4); line(c, [4, -35.6, 6, -35.6], OL, 1.4); },
  sp_nanobots(c) { spBg(c, 'h'); shape(c, rr(-11, -33, 22, 22, 3), '#166534', 2); for (const y of [-29, -24, -19, -14]) { line(c, [-14, y, -11, y], OL, 1.6); line(c, [11, y, 14, y], OL, 1.6); } shape(c, rr(-6, -28, 12, 12, 2), '#4ade80', 1.4); c.save(); c.translate(3, -20); c.rotate(-0.8); shape(c, rr(-2, -3, 4, 16, 1.6), '#cbd5e1', 1.4); shape(c, c => { c.arc(0, -5, 5, Math.PI * 0.2, Math.PI * 1.8); c.lineTo(0, -5); c.closePath(); }, '#cbd5e1', 1.4); c.restore(); },
  sp_update(c) { spBg(c, 'c'); c.beginPath(); c.arc(0, -31, 7, -0.4, Math.PI * 1.4); c.lineWidth = 4; c.strokeStyle = OL; c.stroke(); c.lineWidth = 2.4; c.strokeStyle = '#22e3ff'; c.stroke(); shape(c, rr(-15, -19, 30, 8, 3), '#0f172a', 2); shape(c, rr(-13.6, -17.6, 12, 5.2, 2), '#22e3ff', 0); otxt(c, '1/47', 0, -8, 7, '#fff6ea'); },
  sp_gatos(c) { spBg(c, 'd'); for (const [x, y, s] of [[-6, -22, 1], [9, -34, 0.55], [-12, -37, 0.45]]) { c.save(); c.translate(x, y); c.scale(s, s); shape(c, poly(-9, -4, -8, -14, -2, -8), '#ffb04f', 1.8); shape(c, poly(9, -4, 8, -14, 2, -8), '#ffb04f', 1.8); shape(c, el(0, 0, 11, 9), '#ffb04f', 2); line(c, [-6.4, -3.2, -2.4, -1.6], OL, 1.6); line(c, [6.4, -3.2, 2.4, -1.6], OL, 1.6); dot(c, -4, 0.6, 1.4, OL); dot(c, 4, 0.6, 1.4, OL); shape(c, poly(-1.4, 3, 1.4, 3, 0, 4.6), '#ff7aa8', 0.8); c.restore(); } },
  sp_likes(c) { spBg(c, 'h'); shape(c, c => { c.moveTo(0, -11); c.bezierCurveTo(-18, -22, -14, -40, 0, -32); c.bezierCurveTo(14, -40, 18, -22, 0, -11); c.closePath(); }, '#ff5fa8', 2.2); shape(c, el(-6, -29, 3, 2, -0.6), 'rgba(255,255,255,.6)', 0); otxt(c, '+999', 0, -6, 7.2, '#fff6ea'); },
  sp_confusion(c) { spBg(c, 'c'); c.beginPath(); for (let a = 0; a < 5.4 * Math.PI; a += 0.2) { const q = 0.85 * a; c.lineTo(Math.cos(a) * q, -22 + Math.sin(a) * q); } c.lineWidth = 4; c.strokeStyle = OL; c.stroke(); c.lineWidth = 2.2; c.strokeStyle = '#ff3df0'; c.stroke(); otxt(c, '?', -13, -36, 11, '#fff6ea'); otxt(c, '?', 14, -10, 9, '#fff6ea'); },
  sp_critico(c) { spBg(c, 'd'); c.beginPath(); starPath(c, 0, -24, 18, 8, 8); c.fillStyle = '#ffe14d'; c.fill(); c.lineWidth = 1.8; c.strokeStyle = OL; c.stroke(); c.save(); c.translate(0, -24); c.rotate(0.75); shape(c, poly(-2, -15, 2, -15, 2.6, 6, 0, 9, -2.6, 6), '#e5e7eb', 1.6); shape(c, rr(-6, 5, 12, 3, 1.2), '#7b2cbf', 1.4); shape(c, rr(-1.6, 8, 3.2, 6, 1), '#5b3a1c', 1.2); c.restore(); otxt(c, 'CRIT', 0, -6, 7, '#e63946'); },
  sp_energetica(c) { spBg(c, 'h'); shape(c, rr(-9, -38, 18, 29, 3), '#22c55e', 2.2); shape(c, rr(-9, -38, 18, 4, 1.6), '#cbd5e1', 1.4); shape(c, rr(-9, -13, 18, 4, 1.6), '#cbd5e1', 1.4); shape(c, poly(1, -32, -5, -22, -1, -22, -3, -14, 5, -25, 1, -25, 3, -32), '#ffe14d', 1.2); },
  sp_ping(c) { spBg(c, 'c'); for (const [r, a] of [[16, 1], [11, 1], [6, 1]]) { c.beginPath(); c.arc(0, -12, r, Math.PI * 1.22, Math.PI * 1.78); c.lineWidth = 5; c.strokeStyle = OL; c.stroke(); c.lineWidth = 2.8; c.strokeStyle = '#ff4b5c'; c.stroke(); } dot(c, 0, -12, 2.6, OL); dot(c, 0, -12, 1.6, '#ff4b5c'); otxt(c, '999', 0, -36, 9, '#fff6ea'); },
  sp_cartuchos(c) { spBg(c, 'd'); for (const [x, y, rot] of [[-5, -18, -0.25], [6, -26, 0.3]]) { c.save(); c.translate(x, y); c.rotate(rot); shape(c, c => { c.moveTo(-8, -10); c.lineTo(8, -10); c.lineTo(8, 9); c.lineTo(6, 11); c.lineTo(-6, 11); c.lineTo(-8, 9); c.closePath(); }, '#9ca3af', 1.8); shape(c, rr(-5.6, -7, 11.2, 9, 1.2), '#ffe06a', 1.2); for (const xx of [-5, -2, 1, 4]) line(c, [xx, 8, xx, 10], '#facc15', 1.2); c.restore(); } },
  sp_parchefan(c) { spBg(c, 'h'); c.save(); c.translate(0, -23); c.rotate(-0.7); shape(c, rr(-17, -6, 34, 12, 5), '#fde68a', 2); shape(c, rr(-6, -6, 12, 12, 1.6), '#f5d58a', 1.2); for (const [x, y] of [[-12, -2], [-12, 2], [12, -2], [12, 2]]) dot(c, x, y, 0.9, '#c49a3c'); c.restore(); shape(c, c => { c.moveTo(-2.4, -23); c.bezierCurveTo(-2.4, -26, 0, -26.6, 0, -24.4); c.bezierCurveTo(0, -26.6, 2.4, -26, 2.4, -23); c.quadraticCurveTo(2.4, -21, 0, -19.6); c.quadraticCurveTo(-2.4, -21, -2.4, -23); c.closePath(); }, '#ff5fa8', 1); },
  sp_cancelado(c) { spBg(c, 'c'); shape(c, c => { c.moveTo(-11, -36); c.lineTo(11, -36); c.lineTo(11, -12); c.lineTo(8, -9); c.lineTo(-8, -9); c.lineTo(-11, -12); c.closePath(); }, '#9aa3a0', 2); shape(c, rr(-8, -32, 16, 12, 1.4), '#c9cfc6', 1.2); c.save(); c.translate(0, -22); c.rotate(-0.35); shape(c, rr(-15, -5, 30, 10, 2), 'rgba(230,57,70,.9)', 1.6); otxt(c, 'CANCEL', 0, 0.4, 7.2, '#fff6ea'); c.restore(); },
  sp_taquilla(c) { spBg(c, 'd'); c.beginPath(); starPath(c, 0, -23, 19, 10, 9); c.fillStyle = '#ff7a1a'; c.fill(); c.lineWidth = 2; c.strokeStyle = OL; c.stroke(); c.beginPath(); starPath(c, 0, -23, 11, 6, 9); c.fillStyle = '#ffe14d'; c.fill(); shape(c, rr(-13, -9, 26, 6, 1.4), '#1f2937', 1.6); for (let x = -11; x <= 9; x += 5) shape(c, rr(x, -7.6, 3, 3.2, 0.6), '#fff6ea', 0); },
  sp_maquillaje(c) { spBg(c, 'h'); shape(c, el(-4, -16, 11, 6), '#ff9ab8', 2); shape(c, el(-4, -17.6, 8.4, 3.6), '#ffd6e4', 1.2); c.save(); c.translate(6, -26); c.rotate(0.5); shape(c, rr(-2, -2, 4, 15, 1.4), '#5b3a1c', 1.4); shape(c, rr(-2.6, -6, 5.2, 5, 1), '#cbd5e1', 1.2); shape(c, c => { c.moveTo(-3.4, -6); c.quadraticCurveTo(0, -17, 3.4, -6); c.closePath(); }, '#ffcfdd', 1.4); c.restore(); for (const [x, y] of [[-14, -34], [13, -40]]) { c.beginPath(); starPath(c, x, y, 3, 1.2, 4); c.fillStyle = '#fff6ea'; c.fill(); } },
  sp_remake(c) { spBg(c, 'c'); shape(c, rr(-14, -26, 28, 17, 2), '#1f2937', 2); c.save(); c.translate(-14, -27); c.rotate(-0.28); shape(c, rr(0, -6, 28, 6, 1.4), '#fff6ea', 1.8); for (let x = 3; x < 26; x += 7) shape(c, poly(x, -6, x + 3.4, -6, x + 1, 0, x - 2.4, 0), OL, 0); c.restore(); otxt(c, '2', 0, -17.4, 12, '#ff9ab8'); shape(c, rr(4, -42, 15, 8, 2), '#ffcb3d', 1.4); otxt(c, '70€', 11.5, -37.8, 6.2, OL); },
  sp_despido(c) { spBg(c, 'd'); for (const [x, y, rot] of [[-6, -16, -0.3], [6, -28, 0.25]]) { c.save(); c.translate(x, y); c.rotate(rot); shape(c, rr(-11, -7, 22, 14, 1.6), '#fff6ea', 1.8); line(c, [-11, -7, 0, 1, 11, -7], OL, 1.4); shape(c, el(0, 1, 3, 3), '#e63946', 1); c.restore(); } otxt(c, 'FUERA', 0, -40, 7.4, '#fff6ea'); },
  sp_cobro(c) { spBg(c, 'd'); c.save(); c.translate(0, -22); c.rotate(-0.2); shape(c, rr(-15, -9, 30, 19, 3), '#334155', 2); shape(c, rr(-15, -5, 30, 4, 0), '#0f172a', 0); shape(c, rr(-11, 3, 8, 4, 1), '#ffcb3d', 1); c.restore(); otxt(c, '9,99€', 2, -38, 7.6, '#ffe06a'); },

  squirrel(c) {
    shape(c, c => { c.moveTo(3, -8); c.bezierCurveTo(20, -6, 27, -24, 19, -36); c.bezierCurveTo(13, -45, 1, -44, 1, -36); c.bezierCurveTo(1, -30, 8, -29, 11, -31); c.bezierCurveTo(14, -24, 11, -15, 1, -15); c.closePath(); }, '#c45a22');
    c.beginPath(); c.moveTo(8, -12); c.bezierCurveTo(19, -13, 21, -27, 15, -35); c.strokeStyle = '#f0a065'; c.lineWidth = 2.6; c.stroke();
    shape(c, el(0, -9, 9.5, 9), '#b14d1c');
    shape(c, el(0, -7.5, 5.6, 6), '#f6d7a7', 0);
    shape(c, el(0, -10.5, 3.4, 3.6), '#9a6a33', 1.5);
    shape(c, el(0, -13.4, 4, 1.9), '#5b3a1c', 1.5);
    shape(c, el(-4.6, -10.5, 2.4, 2.1), '#b14d1c', 1.4);
    shape(c, el(4.6, -10.5, 2.4, 2.1), '#b14d1c', 1.4);
    shape(c, poly(-8, -25, -9.5, -35.5, -2.5, -29), '#b14d1c', 2);
    shape(c, poly(8, -25, 9.5, -35.5, 2.5, -29), '#b14d1c', 2);
    shape(c, poly(-7.4, -27.2, -8.3, -32.6, -4.4, -28.9), '#ff9bb0', 0);
    shape(c, poly(7.4, -27.2, 8.3, -32.6, 4.4, -28.9), '#ff9bb0', 0);
    shape(c, el(0, -21.5, 10, 9.2), '#b14d1c');
    shape(c, el(0, -17.8, 6.2, 4.3), '#f6d7a7', 0);
    shape(c, el(-3.9, -23, 4.1, 4.3), '#fff', 1.5);
    shape(c, el(4.3, -23.6, 3.1, 3.3), '#fff', 1.5);
    dot(c, -2.6, -22.1, 1.7, OL); dot(c, 5.2, -24.7, 1.15, OL); dot(c, -2.1, -22.7, 0.55, '#fff');
    shape(c, el(0, -19.4, 1.8, 1.25), '#3a1a12', 0);
    shape(c, rr(-1.9, -17.9, 3.8, 3.6, 0.9), '#fff', 1.1);
    line(c, [0, -17.9, 0, -14.4], OL, 0.8);
    shape(c, el(-7.2, -18.6, 2.1, 1.2), 'rgba(255,110,140,.5)', 0);
    shape(c, el(7.2, -18.6, 2.1, 1.2), 'rgba(255,110,140,.5)', 0);
  },
  fox(c) {
    shape(c, c => { c.moveTo(-3, -6); c.bezierCurveTo(-20, -4, -28, -18, -22, -32); c.bezierCurveTo(-18, -40, -9, -38, -10, -30); c.bezierCurveTo(-11, -22, -6, -16, -2, -14); c.closePath(); }, '#e8702a');
    shape(c, c => { c.moveTo(-22, -32); c.bezierCurveTo(-18, -40, -9, -38, -10, -30); c.bezierCurveTo(-14, -28.5, -19, -28.5, -22, -32); c.closePath(); }, '#fff4e6', 1.5);
    shape(c, el(0, -10, 10, 10), '#e8702a');
    shape(c, el(0, -8.5, 6, 7), '#fff4e6', 0);
    shape(c, el(-7, -11.5, 2.6, 3.4, 0.35), '#c9561c', 1.4);
    shape(c, el(7, -11.5, 2.6, 3.4, -0.35), '#c9561c', 1.4);
    shape(c, poly(-10, -29, -12.5, -45, -2, -35), '#e8702a', 2);
    shape(c, poly(10, -29, 12.5, -45, 2, -35), '#e8702a', 2);
    shape(c, poly(-11.4, -40.2, -12.5, -45, -8.4, -41.6), '#2b1622', 0);
    shape(c, poly(11.4, -40.2, 12.5, -45, 8.4, -41.6), '#2b1622', 0);
    shape(c, c => { c.moveTo(-12, -27); c.quadraticCurveTo(-13, -38, 0, -38.5); c.quadraticCurveTo(13, -38, 12, -27); c.lineTo(15.5, -21); c.lineTo(9, -20.5); c.quadraticCurveTo(0, -15, -9, -20.5); c.lineTo(-15.5, -21); c.closePath(); }, '#e8702a');
    shape(c, c => { c.moveTo(-8.5, -21.5); c.quadraticCurveTo(0, -30, 8.5, -21.5); c.quadraticCurveTo(0, -16.2, -8.5, -21.5); c.closePath(); }, '#fff4e6', 0);
    shape(c, poly(11, -29.5, 19.5, -33.5, 18, -27.8), '#6a22a8', 1.4);
    shape(c, poly(11, -27.6, 19, -25, 15.8, -22.8), '#6a22a8', 1.4);
    shape(c, rr(-12.6, -31.6, 25.2, 6.6, 3.2), '#7b2cbf', 1.8);
    shape(c, el(-5, -28.3, 3, 1.7), '#fff', 0); shape(c, el(5, -28.3, 3, 1.7), '#fff', 0);
    dot(c, -4, -28.1, 1.2, OL); dot(c, 6, -28.1, 1.2, OL);
    line(c, [-8, -29.5, -2, -29.7], OL, 1.3); line(c, [2, -29.7, 8, -29.5], OL, 1.3);
    shape(c, el(0, -23.6, 1.9, 1.35), '#2b1622', 0);
    c.beginPath(); c.moveTo(-3, -20.6); c.quadraticCurveTo(1, -18.8, 4.2, -21.8); c.strokeStyle = OL; c.lineWidth = 1.3; c.stroke();
  },
  bunny(c) {
    shape(c, c => { c.moveTo(-12, -30); c.lineTo(12, -30); c.lineTo(20, -3); c.quadraticCurveTo(0, 1.5, -20, -3); c.closePath(); }, '#ff7a1a');
    c.save(); c.translate(15, -19); c.rotate(0.5);
    shape(c, c => { c.moveTo(-1, -27); c.quadraticCurveTo(-8, -39, -3, -41); c.quadraticCurveTo(0, -33, 1, -28); c.closePath(); }, '#5cc23a', 1.5);
    shape(c, c => { c.moveTo(1, -27); c.quadraticCurveTo(7, -37, 3, -40); c.quadraticCurveTo(-1, -33, -1, -28); c.closePath(); }, '#47a82f', 1.5);
    shape(c, c => { c.moveTo(-6.5, -26); c.quadraticCurveTo(0, -30, 6.5, -26); c.lineTo(1.3, 2); c.quadraticCurveTo(0, 4, -1.3, 2); c.closePath(); }, '#ff8a1f');
    line(c, [-4.5, -18, -1, -17.2], '#c45a12', 1.2); line(c, [1, -11, 3.4, -11.6], '#c45a12', 1.2); line(c, [-3, -5, -0.6, -4.6], '#c45a12', 1.2);
    c.restore();
    shape(c, el(0, -14, 13.5, 13), '#f7f3ff');
    shape(c, el(0, -12, 8, 8.5), '#ffe0ee', 0);
    shape(c, el(-12, -16, 3.4, 4.6, 0.5), '#f7f3ff', 1.8);
    shape(c, el(13, -18.5, 3.8, 4.6, -0.5), '#f7f3ff', 1.8);
    shape(c, el(-6.5, -57, 4.8, 13, -0.12), '#f7f3ff');
    shape(c, el(-6.6, -56, 2.2, 9, -0.12), '#ffb3cf', 0);
    shape(c, el(7.2, -51.5, 4.6, 8, 0.25), '#f7f3ff');
    shape(c, el(14.6, -59.5, 4.2, 8, 1.15), '#f7f3ff');
    shape(c, el(14.6, -59.5, 1.8, 5.2, 1.15), '#ffb3cf', 0);
    shape(c, el(7.2, -51.5, 2, 5, 0.25), '#ffb3cf', 0);
    shape(c, el(0, -35, 14.5, 13.5), '#f7f3ff');
    c.save(); c.translate(-2, -48); c.rotate(-0.22);
    shape(c, poly(-7, 1, -7, -5, -3.5, -2, 0, -7, 3.5, -2, 7, -5, 7, 1), '#ffcb3d', 1.6);
    dot(c, 0, -1, 1.1, '#ff4b5c');
    c.restore();
    shape(c, el(-6, -36, 5, 5.2), '#fff', 1.6);
    c.beginPath(); for (let a = 0; a < 4.2 * Math.PI; a += 0.25) { const q = 0.33 * a; c.lineTo(-6 + Math.cos(a) * q, -36 + Math.sin(a) * q); } c.strokeStyle = '#8a2bff'; c.lineWidth = 1.2; c.stroke();
    shape(c, el(6.5, -37, 5.8, 6.2), '#fff', 1.6);
    dot(c, 7.8, -36.2, 1.6, OL);
    shape(c, c => { c.moveTo(-7.5, -29); c.quadraticCurveTo(0, -20.5, 7.5, -29); c.quadraticCurveTo(0, -26.8, -7.5, -29); c.closePath(); }, '#5a1530', 1.5);
    shape(c, rr(-2.7, -28.4, 2.5, 3.2, 0.6), '#fff', 1);
    shape(c, rr(0.2, -28.4, 2.5, 3.2, 0.6), '#fff', 1);
    shape(c, poly(-1.6, -31.6, 1.6, -31.6, 0, -30), '#ff7aa8', 1);
    shape(c, el(-10, -29.5, 2.4, 1.4), 'rgba(255,110,160,.5)', 0);
    shape(c, el(10.5, -30, 2.4, 1.4), 'rgba(255,110,160,.5)', 0);
  },
  becario(c) {
    shape(c, el(-11.5, -11, 2.7, 2.7), '#aab4c4', 1.4);
    shape(c, rr(-10.5, -25, 21, 22, 4), '#aab4c4');
    shape(c, rr(-8.5, -24, 17, 3.2, 1.4), '#d7dee9', 0);
    shape(c, rr(-7.6, -21, 15.2, 9.4, 2.6), '#1b4fc4', 1.6);
    line(c, [-5.2, -16.8, -2, -16.8], '#e8f1ff', 1.5); line(c, [2, -16.8, 5.2, -16.8], '#e8f1ff', 1.5);
    c.beginPath(); c.arc(-3.6, -15.6, 1.6, 0.2, Math.PI - 0.2); c.moveTo(5.2, -15.1); c.arc(3.6, -15.6, 1.6, 0.2, Math.PI - 0.2); c.strokeStyle = 'rgba(232,241,255,.6)'; c.lineWidth = 0.9; c.stroke();
    line(c, [-1.4, -13.4, 1.4, -13.4], '#e8f1ff', 1);
    shape(c, c => { c.moveTo(9.3, -23.5); c.quadraticCurveTo(11.8, -20, 9.3, -19); c.quadraticCurveTo(7, -20, 9.3, -23.5); c.closePath(); }, '#8fd3ff', 1);
    line(c, [0, -25, 0, -31], OL, 1.6); shape(c, el(0, -32.2, 2.3, 2.3), '#ff4b5c', 1.4);
    c.beginPath(); c.moveTo(-5.5, -12); c.lineTo(0, -7.6); c.lineTo(5.5, -12); c.strokeStyle = '#ff4b5c'; c.lineWidth = 1.3; c.stroke();
    shape(c, rr(-3.4, -8.2, 6.8, 5.4, 1), '#fff', 1.1);
    c.fillStyle = '#2e8bff'; c.fillRect(-2.8, -7.6, 5.6, 1.5);
    shape(c, el(11.6, -10.5, 2.7, 2.7), '#aab4c4', 1.4);
    shape(c, rr(10.5, -17.5, 6.4, 7, 1.3), '#fff', 1.4);
    c.beginPath(); c.arc(17.2, -14, 1.9, -1.3, 1.3); c.strokeStyle = OL; c.lineWidth = 1.3; c.stroke();
    c.beginPath(); c.moveTo(12.6, -19.5); c.quadraticCurveTo(11.2, -21.5, 12.8, -23.2); c.moveTo(15, -19.5); c.quadraticCurveTo(13.6, -21.5, 15.2, -23.2); c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1; c.stroke();
  },
  starbot(c) {
    shape(c, rr(-5, -10, 10, 4.5, 1.6), '#2a3858', 1.4);
    shape(c, el(0, -17.5, 10, 9.5), '#34466e');
    shape(c, c => starPath(c, 0, -16, 3.6, 1.6), '#c8b65a', 1);
    shape(c, el(-11, -23.5, 6.6, 4.7, -0.25), '#4d6496');
    shape(c, el(11, -23.5, 6.6, 4.7, 0.25), '#4d6496');
    c.strokeStyle = 'rgba(235,240,250,.8)'; c.lineWidth = 0.6; c.beginPath();
    for (let i = 0; i < 5; i++) { const a = -0.1 + i * 0.32; c.moveTo(-17, -27); c.lineTo(-17 + Math.cos(a) * 9, -27 + Math.sin(a) * 9); }
    for (const rad of [4, 7]) { for (let i = 0; i < 5; i++) { const a = -0.1 + i * 0.32; const px = -17 + Math.cos(a) * rad, py = -27 + Math.sin(a) * rad; i ? c.lineTo(px, py) : c.moveTo(px, py); } }
    c.stroke();
    shape(c, rr(11, -20, 10.5, 6.2, 2), '#2a3858', 1.6);
    shape(c, el(21.3, -16.9, 1.7, 3), '#33e0ff', 1.1);
    shape(c, el(0, -31, 8.6, 8.2), '#4d6496');
    shape(c, el(0, -31, 6.6, 3.5), '#33e0ff', 1.4);
    c.beginPath(); c.ellipse(-2.4, -32.2, 2, 0.9, -0.2, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,.85)'; c.fill();
    line(c, [4, -38.5, 6.5, -43], OL, 1.4); dot(c, 6.6, -43.6, 1.8, '#ffcb3d');
  },
  fallen(c) {
    shape(c, c => { c.moveTo(1, -50); c.bezierCurveTo(-9, -59, -23, -52, -21, -34); c.bezierCurveTo(-18, -41, -11, -46, -3, -45); c.closePath(); }, '#c94a4a');
    shape(c, poly(15.5, -19, 15.5, -34, 17, -36.5, 18, -33.5, 19.5, -36, 19.5, -19), '#d6dceb', 1.4);
    shape(c, rr(12.5, -20, 10, 3.2, 1.2), '#6b4a2e', 1.4);
    shape(c, el(0, -17, 15, 14.5), '#8d9cc0');
    shape(c, el(-6, -21, 5, 4, -0.3), 'rgba(255,255,255,.25)', 0);
    shape(c, rr(-13, -11, 26, 4.2, 1.6), '#5b6787', 1.4);
    shape(c, el(0, -39, 12.5, 12), '#aeb9d6');
    line(c, [0, -51, 0, -43], OL, 1.4);
    shape(c, rr(-8.2, -41.4, 16.4, 4, 1.6), '#2a1020', 1.4);
    c.fillStyle = '#ff3b3b'; c.fillRect(-6.6, -40.4, 13.2, 2);
    line(c, [4, -30, 5.5, -27.2], OL, 1); line(c, [13, -30, 11.5, -27.2], OL, 1);
    shape(c, rr(2.5, -27.2, 13, 8, 1.2), '#ffcb3d', 0);
    c.save(); c.beginPath(); rrPath(c, 2.5, -27.2, 13, 8, 1.2); c.clip(); c.strokeStyle = OL; c.lineWidth = 1.6;
    for (let i = -2; i < 6; i++) { c.beginPath(); c.moveTo(2.5 + i * 4, -19); c.lineTo(2.5 + i * 4 + 8, -27.5); c.stroke(); }
    c.restore();
    shape(c, rr(2.5, -27.2, 13, 8, 1.2), null, 1.4);
    shape(c, c => { c.moveTo(-19, -29); c.lineTo(-2, -29); c.lineTo(-2, -14.5); c.quadraticCurveTo(-4, -4, -10.5, -1); c.quadraticCurveTo(-17, -4, -19, -14.5); c.closePath(); }, '#c9cfe0');
    shape(c, c => starPath(c, -10.5, -17, 5, 2.2), 'rgba(120,130,160,.55)', 0);
    c.beginPath(); c.moveTo(-6, -29); c.lineTo(-8.5, -23); c.lineTo(-5.5, -19); c.lineTo(-9, -12); c.lineTo(-7, -7); c.strokeStyle = '#3e4459'; c.lineWidth = 1.2; c.stroke();
  },
  beaver(c) {
    shape(c, el(-12, -5, 9, 4.6, -0.35), '#6b4a2e');
    c.save(); c.beginPath(); c.ellipse(-12, -5, 9, 4.6, -0.35, 0, Math.PI * 2); c.clip();
    c.strokeStyle = '#4e3420'; c.lineWidth = 0.8; c.beginPath();
    for (let i = -3; i <= 3; i++) { c.moveTo(-18 + i * 3, -11); c.lineTo(-8 + i * 3, 1); c.moveTo(-18 + i * 3, 1); c.lineTo(-8 + i * 3, -11); }
    c.stroke(); c.restore();
    shape(c, el(0, -10, 10, 10), '#8a5a33');
    shape(c, el(0, -8, 6, 6.5), '#c79a6b', 0);
    for (const dx of [-3.6, 0, 3.6]) shape(c, rr(dx - 1.7, -18, 3.4, 11, 1), '#e2463b', 1.2);
    shape(c, rr(-6, -14, 12, 2.4, 0.8), '#f1e3c6', 1);
    c.beginPath(); c.moveTo(0, -18); c.quadraticCurveTo(0.5, -21, 3, -22.5); c.strokeStyle = OL; c.lineWidth = 1.2; c.stroke();
    shape(c, el(-8.5, -11.5, 2.6, 2.4), '#8a5a33', 1.4); shape(c, el(8.5, -11.5, 2.6, 2.4), '#8a5a33', 1.4);
    shape(c, el(-7, -31, 2.8, 2.8), '#8a5a33', 1.6); shape(c, el(7, -31, 2.8, 2.8), '#8a5a33', 1.6);
    shape(c, el(0, -25, 9.2, 8.6), '#8a5a33');
    shape(c, el(0, -21.5, 5.8, 3.9), '#c79a6b', 0);
    shape(c, el(-3.6, -26.6, 2.7, 2.9), '#fff', 1.3); shape(c, el(3.6, -26.6, 2.7, 2.9), '#fff', 1.3);
    dot(c, -3.2, -26.2, 1.2, OL); dot(c, 4, -26.2, 1.2, OL);
    shape(c, el(0, -23.4, 2.1, 1.4), '#3a1a12', 0);
    shape(c, rr(-2.7, -21, 5.4, 5.2, 1), '#fff7d6', 1.2); line(c, [0, -21, 0, -15.8], OL, 0.8);
    shape(c, c => { c.moveTo(-8.6, -30.5); c.quadraticCurveTo(-8.6, -38.6, 0, -39); c.quadraticCurveTo(8.6, -38.6, 8.6, -30.5); c.closePath(); }, '#ffcb3d', 1.8);
    line(c, [0, -38.4, 0, -31.6], '#f2a81f', 1.8);
    shape(c, rr(-11, -31.6, 22, 2.8, 1.2), '#f2a81f', 1.4);
  },
  meercat(c) {
    shape(c, c => { c.moveTo(-3, -25); c.quadraticCurveTo(-17, -36, -21, -22); c.quadraticCurveTo(-15, -23, -13, -17); c.quadraticCurveTo(-9, -21, -3, -19); c.closePath(); }, '#ffffff', 1.6);
    shape(c, c => { c.moveTo(3, -25); c.quadraticCurveTo(17, -36, 21, -22); c.quadraticCurveTo(15, -23, 13, -17); c.quadraticCurveTo(9, -21, 3, -19); c.closePath(); }, '#ffffff', 1.6);
    line(c, [-15, -28, -11, -22.5], '#d6def0', 1); line(c, [15, -28, 11, -22.5], '#d6def0', 1);
    c.beginPath(); c.moveTo(4, -3); c.quadraticCurveTo(12, -2, 13, -9); c.strokeStyle = OL; c.lineWidth = 4.2; c.stroke(); c.strokeStyle = '#c99d66'; c.lineWidth = 2.4; c.stroke();
    line(c, [10, -2, 12.5, -34], OL, 3.6); line(c, [10, -2, 12.5, -34], '#ffcb3d', 1.8);
    shape(c, el(12.8, -36.5, 3.4, 3.4), '#7be04a', 1.4);
    line(c, [11.3, -36.5, 14.3, -36.5], '#fff', 1); line(c, [12.8, -38, 12.8, -35], '#fff', 1);
    shape(c, el(0, -11.5, 7.4, 11.5), '#d9b07a');
    shape(c, el(0, -10.5, 4.4, 8.4), '#f3dcb2', 0);
    c.fillStyle = '#ff4b5c'; c.fillRect(-0.9, -14, 1.8, 5.6); c.fillRect(-2.8, -12.1, 5.6, 1.8);
    shape(c, el(-6, -17, 2.2, 4, 0.3), '#d9b07a', 1.3); shape(c, el(9.6, -17, 2.4, 2.6), '#d9b07a', 1.3);
    shape(c, el(-6.8, -30.5, 2, 2.4), '#5b3a26', 1.2); shape(c, el(6.8, -30.5, 2, 2.4), '#5b3a26', 1.2);
    shape(c, el(0, -28.5, 7.6, 7.2), '#d9b07a');
    shape(c, el(0, -24.6, 4.2, 3), '#ecca95', 0);
    shape(c, el(-3.3, -29.2, 2.6, 2.2, -0.35), '#5b3a26', 0); shape(c, el(3.3, -29.2, 2.6, 2.2, 0.35), '#5b3a26', 0);
    dot(c, -3.1, -29.2, 1.25, '#fff'); dot(c, 3.1, -29.2, 1.25, '#fff'); dot(c, -2.9, -29, 0.6, OL); dot(c, 3.3, -29, 0.6, OL);
    shape(c, el(0, -25.2, 1.6, 1.1), '#2b1622', 0);
    c.beginPath(); c.arc(0, -23.4, 1.6, 0.3, Math.PI - 0.3); c.strokeStyle = OL; c.lineWidth = 0.9; c.stroke();
    shape(c, rr(-4.6, -37.6, 9.2, 4.2, 1.2), '#ffffff', 1.4);
    c.fillStyle = '#ff4b5c'; c.fillRect(-0.7, -37, 1.4, 3); c.fillRect(-1.5, -36.2, 3, 1.4);
    c.beginPath(); c.ellipse(0, -42, 6.5, 1.9, 0, 0, Math.PI * 2); c.strokeStyle = OL; c.lineWidth = 3; c.stroke(); c.strokeStyle = '#ffcb3d'; c.lineWidth = 1.6; c.stroke();
  },
  junkcoon(c) {
    const tail = c => { c.moveTo(4, -7); c.bezierCurveTo(16, -5, 25, -14, 22, -27); c.bezierCurveTo(20, -32, 14, -31, 14.5, -26); c.bezierCurveTo(16, -19, 11, -13, 3, -13.5); c.closePath(); };
    shape(c, tail, '#8d8f99', 0);
    c.save(); c.beginPath(); tail(c); c.clip(); c.strokeStyle = '#3b3d47'; c.lineWidth = 2.6;
    for (const [a, b, x2, y2] of [[9, -15, 15, -6], [15, -18, 23, -14], [16, -23, 24, -22], [14, -28, 22, -31]]) { c.beginPath(); c.moveTo(a, b); c.lineTo(x2, y2); c.stroke(); }
    c.restore(); shape(c, tail, null, 2.2);
    shape(c, el(0, -10.5, 10.5, 10), '#8d8f99');
    shape(c, el(0, -9, 6.4, 6.8), '#c9cbd3', 0);
    shape(c, c => { c.moveTo(-15, -6); c.quadraticCurveTo(-19, -14, -13, -19); c.lineTo(-11, -21); c.lineTo(-9, -19); c.quadraticCurveTo(-4, -14, -8, -6); c.quadraticCurveTo(-11.5, -4, -15, -6); c.closePath(); }, '#2a2e3a');
    line(c, [-12.8, -20.3, -9.8, -20.3], '#ffcb3d', 1.8);
    c.beginPath(); c.moveTo(-11, -21.5); c.quadraticCurveTo(-12, -25, -9, -26.5); c.strokeStyle = OL; c.lineWidth = 1.1; c.stroke();
    shape(c, el(-12.4, -12.5, 1.6, 2.6, 0.3), 'rgba(255,255,255,.3)', 0);
    shape(c, el(-8.6, -11.5, 2.6, 2.6), '#8d8f99', 1.3); shape(c, el(9.5, -12, 2.6, 2.6), '#8d8f99', 1.3);
    shape(c, poly(-10, -31, -9, -39, -3.5, -34), '#8d8f99', 1.8); shape(c, poly(10, -31, 9, -39, 3.5, -34), '#8d8f99', 1.8);
    shape(c, poly(-8.8, -32.5, -8.4, -36.6, -5.6, -34), '#ff9bb0', 0); shape(c, poly(8.8, -32.5, 8.4, -36.6, 5.6, -34), '#ff9bb0', 0);
    shape(c, el(0, -27, 11, 9.4), '#8d8f99');
    shape(c, el(0, -23.4, 7.2, 5), '#eceef2', 0);
    shape(c, c => { c.moveTo(-11, -29); c.quadraticCurveTo(-6, -33.5, 0, -29.6); c.quadraticCurveTo(6, -33.5, 11, -29); c.quadraticCurveTo(6, -24.6, 0, -27); c.quadraticCurveTo(-6, -24.6, -11, -29); c.closePath(); }, '#2b2d3a', 0);
    shape(c, el(-4.6, -29.2, 2.5, 2.5), '#fff', 1); shape(c, el(4.6, -29.4, 2.9, 3.1), '#fff', 1);
    dot(c, -4, -29, 1.1, OL); dot(c, 5.5, -30, 1.2, OL);
    shape(c, el(0, -24.6, 1.9, 1.3), '#2b1622', 0);
    shape(c, c => { c.moveTo(-5, -21.6); c.quadraticCurveTo(0, -17.4, 5.5, -22.4); c.quadraticCurveTo(0, -20.2, -5, -21.6); c.closePath(); }, '#5a1530', 1.1);
    c.fillStyle = '#fff'; c.fillRect(-1.8, -21.2, 1.6, 1.4); c.fillRect(1.2, -21.4, 1.6, 1.4);
    line(c, [-10.5, -33.6, 10.5, -33.6], '#5b3a26', 1.6);
    shape(c, el(-4, -34, 2.8, 2.6), '#ff9a3c', 1.3); shape(c, el(4, -34, 2.8, 2.6), '#ff9a3c', 1.3);
  },
  mechavaca(c) {
    shape(c, rr(-21, -44, 8, 15, 3), '#b84f86'); shape(c, rr(13, -44, 8, 15, 3), '#b84f86');
    shape(c, poly(-13, -46, -17, -54, -9, -48), '#ff8fc8', 1.6); shape(c, poly(13, -46, 17, -54, 9, -48), '#ff8fc8', 1.6);
    shape(c, rr(-19, -48, 38, 42, 14), '#ff8fc8');
    shape(c, rr(-16, -20, 32, 6, 2), '#ffffff', 1.2);
    shape(c, el(-10, -12, 3.4, 2.4, 0.3), '#2b2d3a', 0); shape(c, el(9, -10, 2.6, 2), '#2b2d3a', 0);
    shape(c, el(-12, -40, 2.2, 3.4, -0.3), 'rgba(255,255,255,.35)', 0);
    shape(c, rr(-28, -36, 10, 17, 4), '#ff8fc8'); shape(c, rr(-27, -21, 8, 5, 1.5), '#3b3d47', 1.4);
    shape(c, rr(18, -36, 10, 17, 4), '#ff8fc8'); shape(c, rr(19, -21, 8, 5, 1.5), '#3b3d47', 1.4);
    shape(c, el(0, -38, 11.5, 8.5), '#9fe3ff', 1.8);
    c.save(); c.beginPath(); c.ellipse(0, -38, 11.5, 8.5, 0, 0, Math.PI * 2); c.clip();
    shape(c, poly(-6, -42, -9.5, -47, -4, -44), '#f3e6cc', 1); shape(c, poly(6, -42, 9.5, -47, 4, -44), '#f3e6cc', 1);
    shape(c, el(0, -37, 7.4, 6.6), '#ffffff', 1.4);
    shape(c, el(-3.8, -39.6, 2.6, 2, 0.4), '#2b2d3a', 0);
    dot(c, -2.6, -37.8, 1.1, OL); dot(c, 2.8, -37.8, 1.1, OL);
    shape(c, el(0, -33.8, 4.6, 2.8), '#ffb3cf', 1.1);
    dot(c, -1.5, -33.8, 0.7, OL); dot(c, 1.5, -33.8, 0.7, OL);
    c.beginPath(); c.arc(0, -37, 8.2, Math.PI * 1.08, Math.PI * 1.92); c.strokeStyle = '#ff4fa3'; c.lineWidth = 1.6; c.stroke();
    c.restore();
    c.beginPath(); c.ellipse(-5, -41.5, 3, 1.4, -0.4, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,.65)'; c.fill();
  },
  vaca(c) {
    shape(c, el(0, -9, 9, 9), '#ffffff');
    shape(c, el(-4, -11, 3, 2.4, 0.4), '#2b2d3a', 0); shape(c, el(4.5, -6, 2.4, 2), '#2b2d3a', 0);
    shape(c, rr(8, -13.4, 7.4, 3.4, 1), '#ff4fa3', 1.2);
    shape(c, el(8.6, -11, 2.4, 2.4), '#ffffff', 1.3); shape(c, el(-8.6, -11, 2.4, 2.4), '#ffffff', 1.3);
    shape(c, poly(-5, -27, -8, -33, -2.4, -29), '#f3e6cc', 1.3); shape(c, poly(5, -27, 8, -33, 2.4, -29), '#f3e6cc', 1.3);
    shape(c, el(-10, -24, 3.4, 1.8, 0.3), '#ffffff', 1.3); shape(c, el(10, -24, 3.4, 1.8, -0.3), '#ffffff', 1.3);
    shape(c, el(0, -22, 8.6, 8), '#ffffff');
    shape(c, el(-3.4, -25, 2.8, 2.2, 0.4), '#2b2d3a', 0);
    dot(c, -2.8, -23, 1.2, OL); dot(c, 3, -23, 1.2, OL);
    shape(c, el(0, -18.2, 5.6, 3.4), '#ffb3cf', 1.2); dot(c, -1.8, -18.2, 0.8, OL); dot(c, 1.8, -18.2, 0.8, OL);
    c.beginPath(); c.arc(0, -22, 9.6, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = OL; c.lineWidth = 3; c.stroke(); c.strokeStyle = '#ff4fa3'; c.lineWidth = 1.6; c.stroke();
    shape(c, el(-9.2, -21, 1.8, 2.8), '#ff4fa3', 1.2); shape(c, el(9.2, -21, 1.8, 2.8), '#ff4fa3', 1.2);
  },
  necrolord(c) {
    line(c, [15, -2, 18, -58], OL, 4.2); line(c, [15, -2, 18, -58], '#5a4630', 2.2);
    shape(c, el(18, -61, 5, 4.6), '#efeadf', 1.5); dot(c, 16.3, -61.6, 1.3, '#5ef2d0'); dot(c, 19.7, -61.6, 1.3, '#5ef2d0');
    shape(c, poly(14, -63, 13, -68, 16, -65), '#8d9cc0', 1.1); shape(c, poly(22, -63, 23, -68, 20, -65), '#8d9cc0', 1.1);
    shape(c, c => { c.moveTo(-10, -36); c.lineTo(10, -36); c.lineTo(16, -2); c.quadraticCurveTo(0, 2, -16, -2); c.closePath(); }, '#3b2457');
    shape(c, poly(-4, -34, 4, -34, 6, -1, -6, -1), '#2a1840', 1.2);
    c.beginPath(); c.moveTo(-15.5, -4); c.quadraticCurveTo(0, 0, 15.5, -4); c.strokeStyle = '#5ef2d0'; c.lineWidth = 1.8; c.stroke();
    shape(c, rr(-10, -22, 20, 3.6, 1.2), '#5c6d8a', 1.2); dot(c, 0, -20.2, 1.9, '#efeadf');
    shape(c, el(14.5, -26, 3, 3), '#efeadf', 1.3); shape(c, el(-13, -24, 2.8, 3), '#efeadf', 1.3);
    shape(c, el(-11, -36, 7, 4.6, -0.2), '#5c6d8a'); shape(c, el(11, -36, 7, 4.6, 0.2), '#5c6d8a');
    shape(c, poly(-14, -38.5, -19, -46, -10, -40.5), '#8d9cc0', 1.3); shape(c, poly(14, -38.5, 19, -46, 10, -40.5), '#8d9cc0', 1.3);
    shape(c, el(0, -44, 8.6, 8.4), '#efeadf');
    shape(c, rr(-5, -38.5, 10, 5, 1.5), '#efeadf', 1.4);
    line(c, [-2.5, -38.5, -2.5, -34], OL, 0.8); line(c, [0, -38.5, 0, -34], OL, 0.8); line(c, [2.5, -38.5, 2.5, -34], OL, 0.8);
    shape(c, el(-3.4, -44.6, 2.6, 2.8), '#1a1022', 0); shape(c, el(3.4, -44.6, 2.6, 2.8), '#1a1022', 0);
    dot(c, -3.4, -44.6, 1.25, '#5ef2d0'); dot(c, 3.4, -44.6, 1.25, '#5ef2d0');
    shape(c, poly(-0.9, -41, 0.9, -41, 0, -39.6), '#1a1022', 0);
    shape(c, c => { c.moveTo(-8, -49); c.lineTo(-9, -58); c.lineTo(-5, -53); c.lineTo(-3, -62); c.lineTo(0, -54); c.lineTo(3, -62); c.lineTo(5, -53); c.lineTo(9, -58); c.lineTo(8, -49); c.quadraticCurveTo(0, -47, -8, -49); c.closePath(); }, '#4a5677', 1.6);
    dot(c, 0, -51, 1.5, '#5ef2d0');
  },
  skeleton(c) {
    line(c, [6, -8, 10.5, -20], OL, 3.8); line(c, [6, -8, 10.5, -20], '#efeadf', 2); shape(c, el(11, -21.4, 2.6, 2.6), '#efeadf', 1.2);
    shape(c, el(0, -9, 6, 7), '#efeadf');
    line(c, [0, -15, 0, -3], OL, 1); line(c, [-4, -11.5, 4, -11.5], OL, 0.9); line(c, [-4.6, -8.8, 4.6, -8.8], OL, 0.9); line(c, [-3.8, -6, 3.8, -6], OL, 0.9);
    line(c, [-5, -12, -8.5, -6], OL, 2.6); line(c, [-5, -12, -8.5, -6], '#efeadf', 1.2);
    shape(c, el(0, -20, 6.6, 6.2), '#efeadf');
    shape(c, rr(-3.6, -16.2, 7.2, 3.4, 1), '#efeadf', 1.1); line(c, [-1.2, -16.2, -1.2, -12.8], OL, 0.6); line(c, [1.2, -16.2, 1.2, -12.8], OL, 0.6);
    shape(c, el(-2.4, -20.6, 1.8, 2), '#1a1022', 0); shape(c, el(2.4, -20.6, 1.8, 2), '#1a1022', 0);
    dot(c, -2.4, -20.6, 0.75, '#5ef2d0'); dot(c, 2.4, -20.6, 0.75, '#5ef2d0');
    shape(c, c => { c.moveTo(-6.6, -22); c.quadraticCurveTo(0, -29.5, 6.6, -22); c.quadraticCurveTo(0, -24.2, -6.6, -22); c.closePath(); }, '#e2463b', 1.3);
    shape(c, poly(5.4, -23, 10, -25.4, 9, -21), '#e2463b', 1.1);
  },
  zombie(c) {
    shape(c, el(-10, -15, 5, 2.6, 0.2), '#8fbf6a', 1.4); shape(c, el(10, -15, 5, 2.6, -0.2), '#8fbf6a', 1.4);
    shape(c, c => { c.moveTo(-8.5, -21); c.lineTo(8.5, -21); c.lineTo(8.5, -4); c.lineTo(6, -2); c.lineTo(4, -4.5); c.lineTo(1, -2); c.lineTo(-2, -4.5); c.lineTo(-5, -2); c.lineTo(-8.5, -4); c.closePath(); }, '#bcd3e8');
    shape(c, poly(-1.4, -20.5, 1.4, -20.5, 2.4, -9.5, 0, -7, -2.4, -9.5), '#e2463b', 1.1);
    shape(c, rr(2.6, -15.5, 5.4, 4.2, 0.8), '#fff', 1); c.fillStyle = '#2e8bff'; c.fillRect(3, -15.1, 4.6, 1.3);
    shape(c, el(-12.5, -14.5, 2.2, 2.2), '#8fbf6a', 1.2); shape(c, el(12.5, -14.5, 2.2, 2.2), '#8fbf6a', 1.2);
    shape(c, el(0, -27, 8, 7.6), '#8fbf6a');
    shape(c, c => { c.moveTo(-8, -29); c.quadraticCurveTo(-7, -36, 0, -35.5); c.quadraticCurveTo(7, -36, 8, -29); c.lineTo(5, -31); c.lineTo(3, -29.5); c.lineTo(0, -31.5); c.lineTo(-3, -29.5); c.lineTo(-5, -31); c.closePath(); }, '#4a3a2a', 1.4);
    shape(c, el(-3.2, -27, 2.4, 2.4), '#fffbe0', 1.1); shape(c, el(3.4, -27.4, 1.8, 1.8), '#fffbe0', 1.1);
    dot(c, -3, -26.8, 0.9, OL); dot(c, 3.6, -27.2, 0.7, OL);
    c.strokeStyle = '#6b4e8a'; c.lineWidth = 1; c.beginPath(); c.arc(-3.2, -25.2, 2.4, 0.4, Math.PI - 0.4); c.stroke(); c.beginPath(); c.arc(3.4, -25.6, 1.9, 0.4, Math.PI - 0.4); c.stroke();
    shape(c, el(0, -22.2, 2.2, 1.6), '#3a1a22', 1);
    line(c, [4.8, -24.6, 6.8, -22.4], OL, 0.8); line(c, [5.2, -22.6, 6.4, -24.4], OL, 0.6);
  },
  ghostmage(c) {
    shape(c, c => { c.moveTo(-10, -30); c.quadraticCurveTo(-11, -14, -8, -6); c.quadraticCurveTo(-6, -1, -3, -5); c.quadraticCurveTo(0, 0, 3, -5); c.quadraticCurveTo(6, -1, 8, -6); c.quadraticCurveTo(11, -14, 10, -30); c.closePath(); }, 'rgba(190,240,235,.93)');
    shape(c, rr(-9.6, -26, 19.2, 4, 1.5), '#6a3fb0', 1.2);
    shape(c, rr(-17, -22, 8, 10, 1.2), '#6a3fb0', 1.3); line(c, [-13, -22, -13, -12], '#ffcb3d', 1.1);
    shape(c, el(13, -20, 3.6, 3.6), '#9ff0ff', 1.2); dot(c, 13, -20, 1.5, '#ffffff');
    shape(c, el(0, -33, 9, 8.5), 'rgba(205,246,240,.97)');
    shape(c, el(-3.4, -33, 1.8, 2.6), '#1a1022', 0); shape(c, el(3.4, -33, 1.8, 2.6), '#1a1022', 0);
    dot(c, -3.4, -33.4, 0.8, '#5ef2d0'); dot(c, 3.4, -33.4, 0.8, '#5ef2d0');
    shape(c, el(0, -28.8, 1.4, 1.8), '#1a1022', 0);
    shape(c, c => { c.moveTo(-10, -38.5); c.quadraticCurveTo(-4, -46, -2, -57); c.quadraticCurveTo(3, -50, 6, -46); c.quadraticCurveTo(8, -42, 10, -38.5); c.closePath(); }, '#6a3fb0', 1.8);
    shape(c, el(0, -38.6, 12.5, 2.8), '#5a32a0', 1.6);
    shape(c, c => starPath(c, 1.5, -45, 2.6, 1.1), '#ffcb3d', 0.8);
  },
  banshee(c) {
    shape(c, c => { c.moveTo(-8, -40); c.quadraticCurveTo(-18, -30, -15, -10); c.quadraticCurveTo(-12, -14, -10, -12); c.quadraticCurveTo(-8, -24, -6, -30); c.closePath(); }, '#e9ecf7', 1.6);
    shape(c, c => { c.moveTo(8, -40); c.quadraticCurveTo(18, -30, 15, -10); c.quadraticCurveTo(12, -14, 10, -12); c.quadraticCurveTo(8, -24, 6, -30); c.closePath(); }, '#e9ecf7', 1.6);
    shape(c, c => { c.moveTo(-8, -26); c.quadraticCurveTo(-11, -12, -9, -4); c.lineTo(-6, -7); c.lineTo(-3, -2); c.lineTo(0, -6); c.lineTo(3, -2); c.lineTo(6, -7); c.lineTo(9, -4); c.quadraticCurveTo(11, -12, 8, -26); c.closePath(); }, 'rgba(214,200,245,.95)');
    line(c, [-5, -20, 5, -20], '#a68fd8', 1.2);
    shape(c, el(-6.5, -27.6, 2.4, 2.4), '#d6d0ee', 1.2); shape(c, el(6.5, -27.6, 2.4, 2.4), '#d6d0ee', 1.2);
    shape(c, el(0, -34, 7.6, 7.6), '#e3def5');
    shape(c, c => { c.moveTo(-8, -35); c.quadraticCurveTo(-7, -43.5, 0, -43); c.quadraticCurveTo(7, -43.5, 8, -35); c.quadraticCurveTo(4, -39, 0, -38); c.quadraticCurveTo(-4, -39, -8, -35); c.closePath(); }, '#ffffff', 1.4);
    shape(c, el(-3, -34.5, 1.6, 2), '#5ef2d0', 0.8); shape(c, el(3, -34.5, 1.6, 2), '#5ef2d0', 0.8);
    shape(c, el(0, -30.2, 2, 2.8), '#2a1030', 1);
  },
  skullknight(c) {
    shape(c, c => { c.moveTo(-11, -34); c.lineTo(11, -34); c.lineTo(15, -4); c.lineTo(10, -7); c.lineTo(6, -3); c.lineTo(2, -7); c.lineTo(-2, -3); c.lineTo(-6, -7); c.lineTo(-10, -3); c.lineTo(-15, -4); c.closePath(); }, '#24304f');
    shape(c, poly(14.5, -14, 15.5, -50, 18, -54, 20.5, -50, 21.5, -14), '#9fe3ff', 1.5);
    line(c, [18, -48, 18, -18], '#5ef2d0', 1.2);
    shape(c, rr(12, -15, 12, 3.4, 1.2), '#4a5677', 1.4); shape(c, rr(16.4, -12, 3.2, 7, 1), '#3b2a1e', 1.2);
    shape(c, el(0, -18, 12.5, 13), '#4a5677');
    shape(c, el(0, -19, 6.4, 7.4), '#5c6d8a', 0);
    shape(c, poly(0, -24, 2.6, -19, 0, -14, -2.6, -19), '#5ef2d0', 0.8);
    shape(c, rr(-11, -9, 22, 3.4, 1.2), '#2f3a5c', 1.2);
    shape(c, el(-12, -29, 6.4, 4.6, -0.2), '#5c6d8a'); shape(c, el(12, -29, 6.4, 4.6, 0.2), '#5c6d8a');
    shape(c, el(-12.5, -15, 2.8, 3), '#efeadf', 1.2);
    shape(c, c => { c.moveTo(-7.5, -42); c.quadraticCurveTo(-15, -45, -15, -53); c.quadraticCurveTo(-11, -47, -5.5, -46.5); c.closePath(); }, '#d9d2c2', 1.4);
    shape(c, c => { c.moveTo(7.5, -42); c.quadraticCurveTo(15, -45, 15, -53); c.quadraticCurveTo(11, -47, 5.5, -46.5); c.closePath(); }, '#d9d2c2', 1.4);
    shape(c, el(0, -39, 9, 8.6), '#efeadf');
    shape(c, c => { c.moveTo(-9.2, -39); c.quadraticCurveTo(-9, -48.5, 0, -48.6); c.quadraticCurveTo(9, -48.5, 9.2, -39); c.lineTo(5, -41); c.lineTo(0, -38.5); c.lineTo(-5, -41); c.closePath(); }, '#2f3a5c', 1.6);
    shape(c, el(-3.3, -37.4, 2.2, 2), '#1a1022', 0); shape(c, el(3.3, -37.4, 2.2, 2), '#1a1022', 0);
    dot(c, -3.3, -37.4, 1.1, '#5ef2d0'); dot(c, 3.3, -37.4, 1.1, '#5ef2d0');
    shape(c, rr(-4, -34.6, 8, 3, 1), '#efeadf', 1.1); line(c, [-1.3, -34.6, -1.3, -31.6], OL, 0.6); line(c, [1.3, -34.6, 1.3, -31.6], OL, 0.6);
  },
  stitchbrute(c) {
    c.beginPath(); c.arc(-24, -12, 4.2, 0.2, Math.PI * 1.4); c.strokeStyle = OL; c.lineWidth = 3.6; c.stroke(); c.strokeStyle = '#c9cfe0'; c.lineWidth = 1.8; c.stroke();
    shape(c, el(-20, -22, 6, 8.4, 0.35), '#9cb88a');
    shape(c, rr(21, -42, 13, 11, 1.5), '#c9cfe0', 1.4); shape(c, rr(24.6, -32, 3.4, 9, 1), '#5a3a20', 1.2);
    shape(c, el(20, -24, 6, 8.4, -0.35), '#9cb88a');
    shape(c, el(0, -22, 20, 19), '#9cb88a');
    shape(c, poly(4, -36, 15, -31, 13, -22, 3, -25), '#c6a4c9', 1.2);
    shape(c, el(-7, -14, 7, 5, 0.2), '#b5cfa4', 0);
    c.strokeStyle = OL; c.lineWidth = 1.1; c.beginPath(); c.moveTo(-15, -27); c.lineTo(11, -12);
    for (let i = 0; i <= 6; i++) { const x = -15 + i * 4.3, y = -27 + i * 2.5; c.moveTo(x - 1.4, y + 2.2); c.lineTo(x + 1.4, y - 2.2); }
    c.stroke();
    dot(c, -10, -6, 1.6, '#7be04a'); dot(c, 6, -5, 1.2, '#7be04a');
    shape(c, el(0, -42, 8.4, 7.4), '#9cb88a');
    line(c, [-6, -47, 5, -48.4], OL, 1); line(c, [-3, -49.2, -2.4, -45.6], OL, 0.8); line(c, [1.6, -49.6, 2.2, -46], OL, 0.8);
    shape(c, el(-3, -42.8, 2.8, 3), '#fffbe0', 1.1); dot(c, -2.6, -42.6, 1.1, OL);
    shape(c, el(3.6, -42.4, 1.5, 1.5), '#fffbe0', 1); dot(c, 3.7, -42.4, 0.6, OL);
    shape(c, c => { c.moveTo(-4, -38.4); c.lineTo(-2, -36.6); c.lineTo(0, -38); c.lineTo(2, -36.6); c.lineTo(4, -38.4); c.quadraticCurveTo(0, -35, -4, -38.4); c.closePath(); }, '#3a1a22', 1);
    c.fillStyle = '#fff'; c.fillRect(-0.6, -38.2, 1.3, 1.4);
  },
  /* ---------- Streamers ---------- */
  twitchking(c) {
    shape(c, c => { c.moveTo(-11, -36); c.lineTo(11, -36); c.lineTo(19, -3); c.quadraticCurveTo(0, 2, -19, -3); c.closePath(); }, '#e11d74');
    c.beginPath(); c.moveTo(-18, -5.5); c.quadraticCurveTo(0, -1, 18, -5.5); c.strokeStyle = '#ffcb3d'; c.lineWidth = 2; c.stroke();
    line(c, [15, -12, 19.5, -47], OL, 3.8); line(c, [15, -12, 19.5, -47], '#ffcb3d', 2);
    shape(c, c => { c.moveTo(16, -48); c.lineTo(14.5, -44); c.lineTo(19.5, -47.6); c.closePath(); }, '#a855f7', 1.4);
    shape(c, rr(11.5, -59, 17, 12, 4.5), '#a855f7', 1.6);
    shape(c, c => heartPath(c, 20, -53.2, 3), '#fff', 0);
    shape(c, c => { c.moveTo(-12, -35); c.quadraticCurveTo(-15, -16, -13, -4); c.quadraticCurveTo(0, -1, 13, -4); c.quadraticCurveTo(15, -16, 12, -35); c.quadraticCurveTo(0, -39, -12, -35); c.closePath(); }, '#8b5cf6');
    line(c, [-3, -33, -3.6, -27], '#f5f3ff', 1.2); line(c, [3, -33, 3.6, -27], '#f5f3ff', 1.2);
    shape(c, c => { c.moveTo(-8, -7.5); c.lineTo(-6, -14.5); c.lineTo(6, -14.5); c.lineTo(8, -7.5); c.closePath(); }, '#7c3aed', 1.3);
    shape(c, rr(-7.5, -25, 15, 6.6, 2), '#ff3348', 1.4); txt(c, 'LIVE', 0.3, -21.4, 5.4, '#fff');
    shape(c, el(-15, -28, 4.2, 8, 0.7), '#8b5cf6'); shape(c, el(-20, -34.5, 3.4, 3.4), '#f1c27d', 1.4);
    shape(c, el(13.5, -22, 4.2, 7.5, -0.4), '#8b5cf6'); shape(c, el(16, -16, 3.4, 3.4), '#f1c27d', 1.4);
    shape(c, el(0, -44, 10.5, 10), '#f1c27d');
    shape(c, c => { c.moveTo(-10.6, -45); c.quadraticCurveTo(-11, -55.5, -1, -55.5); c.quadraticCurveTo(9.5, -56, 10.7, -46); c.quadraticCurveTo(6, -50.5, 2, -49); c.quadraticCurveTo(-3, -51.5, -6.5, -48); c.quadraticCurveTo(-8.6, -47, -10.6, -45); c.closePath(); }, '#5b3a26', 1.6);
    c.beginPath(); c.moveTo(-6.4, -44); c.quadraticCurveTo(-4, -46.4, -1.6, -44); c.strokeStyle = OL; c.lineWidth = 1.4; c.stroke();
    dot(c, 4, -44.4, 1.6, OL); dot(c, 4.5, -45, 0.5, '#fff');
    shape(c, c => { c.moveTo(-4.4, -39.8); c.quadraticCurveTo(0.6, -34.6, 5.8, -40.2); c.quadraticCurveTo(0.6, -38.4, -4.4, -39.8); c.closePath(); }, '#fff', 1.2);
    shape(c, el(-7.6, -40.6, 2.2, 1.3), 'rgba(255,110,140,.45)', 0); shape(c, el(8, -41, 2.2, 1.3), 'rgba(255,110,140,.45)', 0);
    c.beginPath(); c.arc(0, -45, 12, Math.PI * 1.08, Math.PI * 1.92); c.strokeStyle = OL; c.lineWidth = 4.6; c.stroke(); c.strokeStyle = '#2b2d3a'; c.lineWidth = 2.6; c.stroke();
    shape(c, rr(-14.2, -49.5, 5.6, 10, 2.4), '#2b2d3a', 1.6); shape(c, rr(8.6, -49.5, 5.6, 10, 2.4), '#2b2d3a', 1.6);
    dot(c, -11.4, -44.5, 1.6, '#22e3ff'); dot(c, 11.4, -44.5, 1.6, '#22e3ff');
    c.beginPath(); c.moveTo(11.4, -40); c.quadraticCurveTo(10, -35.6, 5, -36.4); c.strokeStyle = OL; c.lineWidth = 2.6; c.stroke(); c.strokeStyle = '#2b2d3a'; c.lineWidth = 1.2; c.stroke();
    dot(c, 4.6, -36.4, 1.8, OL);
    shape(c, poly(-7.5, -54, -9, -62, -4.2, -58, 0, -64, 4.2, -58, 9, -62, 7.5, -54), '#ffcb3d', 1.6);
    dot(c, 0, -57.6, 1.3, '#ff3348');
  },
  subswarm(c) {
    line(c, [-6, -12, -10, -22], OL, 3.8); line(c, [-6, -12, -10, -22], '#e0a872', 2);
    shape(c, c => { c.moveTo(-6.5, -21); c.lineTo(-15, -22); c.lineTo(-14.6, -29.5); c.lineTo(-12.8, -29.8); c.lineTo(-12.6, -36.4); c.quadraticCurveTo(-11, -38.6, -9.4, -36.2); c.lineTo(-9.6, -29.6); c.lineTo(-7.2, -29.2); c.closePath(); }, '#d946ef', 1.6);
    txt(c, '#1', -11, -25.2, 4.6, '#fff');
    shape(c, c => { c.moveTo(-7, -15); c.lineTo(7, -15); c.lineTo(8, -3); c.quadraticCurveTo(0, -1, -8, -3); c.closePath(); }, '#8b5cf6');
    shape(c, c => heartPath(c, 0, -9, 2.6), '#f5d0fe', 0.9);
    shape(c, el(8, -9, 2.2, 4, -0.3), '#8b5cf6', 1.4); shape(c, el(8.6, -5.6, 1.8, 1.8), '#e0a872', 1.1);
    shape(c, el(0, -21.5, 7, 6.6), '#e0a872');
    shape(c, c => { c.moveTo(-7.2, -22.5); c.quadraticCurveTo(-7, -29.6, 0, -29.6); c.quadraticCurveTo(7, -29.6, 7.2, -22.5); c.closePath(); }, '#22d3ee', 1.6);
    shape(c, c => { c.moveTo(4, -23.4); c.lineTo(11.4, -22.8); c.quadraticCurveTo(11.4, -21, 6, -21.4); c.closePath(); }, '#0891b2', 1.3);
    dot(c, -2, -20.4, 1.2, OL); dot(c, 3, -20.4, 1.2, OL); dot(c, -1.7, -20.8, 0.45, '#fff'); dot(c, 3.3, -20.8, 0.45, '#fff');
    shape(c, c => { c.moveTo(-1.8, -17.4); c.quadraticCurveTo(0.6, -14.2, 3.2, -17.4); c.closePath(); }, '#5a1530', 1);
  },
  hypebeast(c) {
    shape(c, c => { c.moveTo(-10, -24); c.quadraticCurveTo(-12.5, -12, -10.5, -3); c.quadraticCurveTo(0, 0, 10.5, -3); c.quadraticCurveTo(12.5, -12, 10, -24); c.quadraticCurveTo(0, -27, -10, -24); c.closePath(); }, '#f97316');
    shape(c, poly(1.4, -21, -3.6, -13, -0.4, -13, -1.8, -7, 4.2, -15, 0.8, -15, 2.8, -21), '#ffe14d', 1.1);
    shape(c, el(-11, -15, 3.4, 6.5, 0.2), '#f97316'); shape(c, el(-11.6, -9, 2.6, 2.6), '#c68642', 1.3);
    shape(c, el(11, -18, 3.4, 6, -0.8), '#f97316');
    shape(c, rr(13, -28, 6.4, 10, 1.6), '#7be04a', 1.4); line(c, [13.6, -25.4, 18.8, -25.4], '#1f2937', 1); shape(c, poly(14.6, -23.6, 17.6, -23.6, 15.4, -20, 16.4, -22), '#1f2937', 0);
    shape(c, el(14.8, -19.6, 2.7, 2.7), '#c68642', 1.3);
    shape(c, el(0, -31, 8.4, 8), '#c68642');
    shape(c, c => { c.moveTo(-8.6, -32); c.quadraticCurveTo(-8.2, -40.6, 0, -40.6); c.quadraticCurveTo(8.2, -40.6, 8.6, -32); c.closePath(); }, '#111827', 1.6);
    shape(c, c => { c.moveTo(-6, -35.5); c.lineTo(-13.8, -34.4); c.quadraticCurveTo(-14, -32.2, -7.6, -32.6); c.closePath(); }, '#111827', 1.4);
    dot(c, 1, -38.4, 1.3, '#f97316');
    shape(c, rr(-6.4, -33.8, 14, 4.2, 1.6), '#111827', 1.2);
    line(c, [-4.6, -32.8, -2, -32.8], '#f472b6', 1); line(c, [2.4, -32.8, 5, -32.8], '#f472b6', 1);
    shape(c, c => { c.moveTo(-2.4, -27.4); c.quadraticCurveTo(1, -24.2, 4.6, -27.8); c.closePath(); }, '#fff', 1.1);
    c.beginPath(); c.arc(0, -24.5, 5.5, 0.35, Math.PI - 0.35); c.strokeStyle = OL; c.lineWidth = 2.8; c.stroke(); c.strokeStyle = '#ffcb3d'; c.lineWidth = 1.4; c.stroke();
  },
  viralbot(c) {
    line(c, [-1.5, -31, -1.5, -38], OL, 2.4);
    shape(c, el(-1.5, -39, 13, 2.2), 'rgba(205,215,235,.92)', 1.4); dot(c, -1.5, -39, 1.8, '#ff3348');
    line(c, [-8, -12, -10, -8], OL, 2); line(c, [4, -12, 6, -8], OL, 2); line(c, [-12.5, -8, -6.5, -8], OL, 2.2); line(c, [3.5, -8, 9.5, -8], OL, 2.2);
    shape(c, rr(-13, -31, 23, 19, 4.5), '#4b4b66');
    shape(c, rr(-11, -29, 9, 5, 1.6), '#ff3348', 1.1); txt(c, 'REC', -6.5, -26.3, 3.8, '#fff');
    shape(c, rr(-10.5, -22.5, 12, 8, 2.2), '#22e3ff', 1.2);
    dot(c, -7.2, -19.6, 1.1, OL); dot(c, -2.4, -19.6, 1.1, OL);
    c.beginPath(); c.arc(-4.8, -18.2, 1.8, 0.25, Math.PI - 0.25); c.strokeStyle = OL; c.lineWidth = 0.9; c.stroke();
    shape(c, rr(8.5, -28.5, 6, 14, 2), '#2b2d3a', 1.4);
    shape(c, el(15, -21.5, 6.2, 6.8), '#1f2937');
    shape(c, el(15.6, -21.5, 4.2, 4.6), '#8b5cf6', 1.2); dot(c, 15.8, -21.4, 1.8, '#1a1022');
    dot(c, 14.2, -23.3, 1.4, 'rgba(255,255,255,.9)');
  },
  snackmom(c) {
    shape(c, c => { c.moveTo(-8, -26); c.lineTo(8, -26); c.lineTo(12, -3); c.quadraticCurveTo(0, 0, -12, -3); c.closePath(); }, '#60a5fa');
    for (const [px, py] of [[-8.5, -8], [9, -7], [-6.6, -16], [7, -18]]) dot(c, px, py, 1.1, '#e0f2fe');
    shape(c, c => { c.moveTo(-6, -23); c.lineTo(6, -23); c.lineTo(8, -5); c.quadraticCurveTo(0, -3, -8, -5); c.closePath(); }, '#fff', 1.4);
    shape(c, c => heartPath(c, 0, -12.5, 2.6), '#fda4af', 1);
    shape(c, el(-10, -16, 3, 5.5, 0.3), '#60a5fa'); shape(c, el(-10.8, -11, 2.4, 2.4), '#f1c27d', 1.3);
    shape(c, el(9.5, -19, 3.2, 5.5, -0.9), '#60a5fa');
    shape(c, el(17, -24, 9.4, 2.6), '#d1d5db', 1.5);
    shape(c, poly(10.5, -25.6, 14.6, -31.4, 18.6, -25.6), '#fde68a', 1.2); line(c, [11.6, -26.6, 17.6, -26.6], '#7be04a', 1.4);
    shape(c, el(21.6, -27.4, 2.8, 2.1), '#d97706', 1.1); dot(c, 21, -27.8, 0.55, OL); dot(c, 22.4, -27, 0.55, OL);
    shape(c, el(13, -21.4, 2.6, 2.6), '#f1c27d', 1.3);
    shape(c, el(0, -32.5, 8, 7.6), '#f1c27d');
    shape(c, el(0, -43.6, 4.8, 3.8), '#9ca3af', 1.5);
    shape(c, c => { c.moveTo(-8.3, -33); c.quadraticCurveTo(-9, -41.6, 0, -41.6); c.quadraticCurveTo(9, -41.6, 8.3, -33); c.quadraticCurveTo(4, -37.6, 0, -37); c.quadraticCurveTo(-4, -37.6, -8.3, -33); c.closePath(); }, '#9ca3af', 1.5);
    shape(c, rr(-7, -41.4, 4.2, 2.6, 1), '#f472b6', 1); shape(c, rr(3, -41.8, 4.2, 2.6, 1), '#f472b6', 1);
    c.strokeStyle = OL; c.lineWidth = 1.1; c.beginPath(); c.arc(-3.2, -32.4, 2.5, 0, Math.PI * 2); c.moveTo(5.8, -32.4); c.arc(3.3, -32.4, 2.5, 0, Math.PI * 2); c.moveTo(-0.7, -32.6); c.lineTo(0.8, -32.6); c.stroke();
    c.lineWidth = 0.9; c.beginPath(); c.arc(-3.2, -31.8, 1.1, Math.PI * 1.15, Math.PI * 1.85); c.moveTo(4.4, -31.8); c.arc(3.3, -31.8, 1.1, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
    c.beginPath(); c.arc(0.2, -28.8, 2.4, 0.3, Math.PI - 0.3); c.lineWidth = 1.1; c.stroke();
    shape(c, el(-6, -29.2, 1.8, 1.1), 'rgba(255,110,140,.5)', 0); shape(c, el(6.4, -29.2, 1.8, 1.1), 'rgba(255,110,140,.5)', 0);
  },
  hypetrain(c) {
    shape(c, el(12, -46, 5.4, 4.2), '#f5f3ff', 1.4); shape(c, el(5, -51.5, 4.4, 3.6), '#f5f3ff', 1.3); shape(c, el(-1.5, -55, 3.2, 2.7), '#f5f3ff', 1.2);
    shape(c, c => heartPath(c, 12, -46.4, 2.2), '#f472b6', 0);
    shape(c, rr(-27, -37, 18, 32, 2.4), '#7c3aed');
    shape(c, rr(-30.5, -41.5, 25, 5.6, 2.2), '#4c1d95', 1.6);
    shape(c, rr(-24, -33, 12, 9.5, 1.6), '#a5f3fc', 1.4);
    shape(c, rr(-11, -27, 34, 21, 8.5), '#8b5cf6');
    line(c, [-2, -26.6, -2, -6.4], '#ffcb3d', 1.8); line(c, [8, -26.6, 8, -6.4], '#ffcb3d', 1.8);
    txt(c, 'HYPE', -18.4, -17.5, 4.6, '#ffe14d');
    shape(c, el(1, -27.5, 4, 3), '#ffcb3d', 1.3);
    shape(c, poly(11, -26, 10, -38, 20, -38, 19, -26), '#4c1d95');
    shape(c, rr(8.4, -41.5, 13.2, 4.4, 1.6), '#ffcb3d', 1.4);
    shape(c, el(24, -16.5, 8.4, 10), '#e5e7eb');
    shape(c, el(22.4, -20, 2.2, 2.8), '#fff', 1.1); shape(c, el(27.2, -20, 2, 2.6), '#fff', 1.1);
    dot(c, 23, -19.6, 1.1, OL); dot(c, 27.6, -19.6, 1, OL);
    shape(c, c => { c.moveTo(19.6, -14.5); c.quadraticCurveTo(24.6, -8.6, 30, -14.8); c.quadraticCurveTo(24.6, -12.6, 19.6, -14.5); c.closePath(); }, '#5a1530', 1.2);
    shape(c, poly(26, -8.5, 35, -2.5, 21, -2.5), '#ff3348', 1.5);
    for (const wx of [-19, -5, 11]) { shape(c, el(wx, -6, 6.3, 6.3), '#2b2d3a'); shape(c, el(wx, -6, 2.7, 2.7), '#ffcb3d', 1.2); }
    line(c, [-19, -6, 11, -6], OL, 3.2); line(c, [-19, -6, 11, -6], '#c4b5fd', 1.6);
  },
  banhammer(c) {
    line(c, [8, -18, 22, -56], OL, 5.2); line(c, [8, -18, 22, -56], '#8a5a33', 3.2);
    c.save(); c.translate(23, -61); c.rotate(0.35);
    shape(c, rr(-14, -8, 28, 15, 3), '#6b7280');
    shape(c, rr(-16, -9.5, 4.4, 18, 1.6), '#4b5563', 1.6); shape(c, rr(11.6, -9.5, 4.4, 18, 1.6), '#4b5563', 1.6);
    txt(c, 'BAN', 0, 0.4, 9, '#ff3348');
    c.restore();
    shape(c, c => { c.moveTo(-16, -40); c.quadraticCurveTo(-21, -22, -15.5, -4); c.quadraticCurveTo(0, 0, 15.5, -4); c.quadraticCurveTo(21, -22, 16, -40); c.quadraticCurveTo(0, -45, -16, -40); c.closePath(); }, '#16a34a');
    shape(c, el(0, -17, 9, 10), '#22c55e', 0);
    shape(c, c => { c.moveTo(-6, -35); c.lineTo(6, -35); c.lineTo(6, -29); c.quadraticCurveTo(0, -23, -6, -29); c.closePath(); }, '#fff', 1.3);
    line(c, [0, -33.6, 0, -26.4], '#16a34a', 1.5); line(c, [-2.3, -31.2, 2.3, -31.2], '#16a34a', 1.3);
    shape(c, el(-18.5, -25, 5.6, 11, 0.25), '#16a34a'); shape(c, el(-20.5, -14.5, 4.4, 4.4), '#e0a872', 1.5);
    shape(c, el(14.5, -29, 5.6, 9.5, -0.7), '#16a34a'); shape(c, el(10.4, -21.6, 4.8, 4.8), '#e0a872', 1.5);
    shape(c, el(0, -50, 10, 9.6), '#e0a872');
    shape(c, c => { c.moveTo(-10, -51.5); c.quadraticCurveTo(-10, -60.5, 0, -60.5); c.quadraticCurveTo(10, -60.5, 10, -51.5); c.quadraticCurveTo(5, -55.5, 0, -55.5); c.quadraticCurveTo(-5, -55.5, -10, -51.5); c.closePath(); }, '#3b2a1e', 1.5);
    line(c, [-6.8, -53.4, -1.8, -51.4], OL, 2); line(c, [7.4, -53.4, 2.4, -51.4], OL, 2);
    dot(c, -3.6, -49.4, 1.4, OL); dot(c, 4.2, -49.4, 1.4, OL);
    c.beginPath(); c.moveTo(-3.6, -43.4); c.quadraticCurveTo(0.3, -46, 4.2, -43.4); c.strokeStyle = OL; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = 'rgba(59,42,30,.35)'; for (let i = 0; i < 9; i++) c.fillRect(-6 + (i % 5) * 3, -45 + Math.floor(i / 5) * 2.2, 0.9, 0.9);
    c.beginPath(); c.arc(0, -51, 11.4, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = OL; c.lineWidth = 3.6; c.stroke(); c.strokeStyle = '#1f2937'; c.lineWidth = 2; c.stroke();
    shape(c, rr(-13, -54, 4.6, 8, 2), '#1f2937', 1.4);
  },
  /* ---------- Héroes ---------- */
  epicchampion(c) {
    shape(c, c => { c.moveTo(-11, -38); c.lineTo(11, -38); c.lineTo(20, -3); c.quadraticCurveTo(0, 2, -20, -3); c.closePath(); }, '#2563eb');
    c.save(); c.translate(17, -27); c.rotate(0.32);
    shape(c, poly(-2.2, -2, -2.6, -34, 0, -40, 2.6, -34, 2.2, -2), '#eef2f7', 1.5);
    line(c, [0, -34, 0, -4], '#9ca3af', 1);
    shape(c, rr(-7.4, -3, 14.8, 3.8, 1.4), '#ffcb3d', 1.4);
    shape(c, rr(-1.7, 0.6, 3.4, 8, 1), '#7c2d12', 1.2); dot(c, 0, 10, 2.2, '#ffcb3d');
    c.restore();
    shape(c, c => { c.moveTo(-13, -38); c.quadraticCurveTo(-16, -18, -13, -4); c.quadraticCurveTo(0, 0, 13, -4); c.quadraticCurveTo(16, -18, 13, -38); c.quadraticCurveTo(0, -42, -13, -38); c.closePath(); }, '#facc15');
    line(c, [0, -38, 0, -19], '#ca8a04', 1.4);
    shape(c, c => starPath(c, 0, -29, 4.2, 1.9), '#fff7d6', 1);
    shape(c, rr(-13.4, -17, 26.8, 4.2, 1.2), '#7c2d12', 1.3); shape(c, rr(-2.6, -17.6, 5.2, 5.2, 1), '#ffcb3d', 1.1);
    shape(c, el(-13, -37, 7.2, 5, -0.2), '#eab308'); shape(c, el(13, -37, 7.2, 5, 0.2), '#eab308');
    shape(c, el(16.4, -24.6, 3.8, 3.8), '#f1c27d', 1.4);
    shape(c, el(-16.5, -21, 10, 11.4), '#2563eb');
    shape(c, el(-16.5, -21, 7, 8.2), '#facc15', 1.4);
    shape(c, c => starPath(c, -16.5, -21, 4.2, 1.9), '#2563eb', 1);
    shape(c, el(0, -50, 9.6, 9.4), '#f1c27d');
    dot(c, -3.2, -49.4, 1.5, OL); dot(c, 4, -49.4, 1.5, OL); dot(c, -2.8, -49.9, 0.5, '#fff'); dot(c, 4.4, -49.9, 0.5, '#fff');
    c.beginPath(); c.arc(0.6, -46, 3.2, 0.3, Math.PI - 0.3); c.strokeStyle = OL; c.lineWidth = 1.4; c.stroke();
    shape(c, c => { c.moveTo(-10.4, -49); c.quadraticCurveTo(-10.8, -61.5, 0, -61.6); c.quadraticCurveTo(10.8, -61.5, 10.4, -49); c.lineTo(8, -49); c.lineTo(8, -53.6); c.lineTo(-8, -53.6); c.lineTo(-8, -49); c.closePath(); }, '#facc15', 1.6);
    line(c, [-8, -57.4, 8, -57.4], '#ca8a04', 1.2);
    shape(c, c => { c.moveTo(-3, -60.6); c.quadraticCurveTo(-5, -71, 9, -72); c.quadraticCurveTo(3, -68, 5.2, -61); c.closePath(); }, '#ef4444', 1.5);
  },
  cupidarcher(c) {
    shape(c, c => { c.moveTo(-4, -26); c.quadraticCurveTo(-18, -38, -23, -25); c.quadraticCurveTo(-17, -25, -15.5, -20); c.quadraticCurveTo(-10, -23, -4, -19.5); c.closePath(); }, '#fff', 1.6);
    line(c, [-16.5, -29, -12, -22.5], '#dbe3f0', 1); line(c, [-20, -26, -15, -22], '#dbe3f0', 1);
    shape(c, el(-4.2, -3.8, 2.7, 3.3, 0.25), '#fbcfe8', 1.4); shape(c, el(3.6, -3.4, 2.7, 3.3, -0.2), '#fbcfe8', 1.4);
    shape(c, el(0, -13.5, 8.6, 9), '#fbcfe8');
    shape(c, c => { c.moveTo(-8.4, -12); c.quadraticCurveTo(0, -8, 8.4, -12); c.quadraticCurveTo(7, -4.4, 0, -4.4); c.quadraticCurveTo(-7, -4.4, -8.4, -12); c.closePath(); }, '#fff', 1.4);
    c.beginPath(); c.arc(9, -18, 10, -1.1, 1.1); c.strokeStyle = OL; c.lineWidth = 3.8; c.stroke(); c.strokeStyle = '#ffcb3d'; c.lineWidth = 2; c.stroke();
    line(c, [13.5, -26.9, 13.5, -9.1], '#fff', 0.9);
    line(c, [4, -18, 21, -18], OL, 2.6); line(c, [4, -18, 21, -18], '#fde68a', 1.3);
    shape(c, poly(4, -18, 1.5, -20.6, 1.5, -15.4), '#f472b6', 1);
    shape(c, c => { c.save(); c.translate(23.4, -18); c.rotate(-Math.PI / 2); heartPath(c, 0, 0, 2.6); c.restore(); }, '#ff3d7a', 1.2);
    shape(c, el(9.4, -17.2, 2.9, 2.9), '#fbcfe8', 1.3);
    shape(c, el(0, -28, 8, 7.6), '#fbcfe8');
    for (const [hx, hy] of [[-6.4, -32.6], [-2.4, -35.2], [2.6, -35.2], [6.4, -32.6]]) shape(c, el(hx, hy, 3, 2.8), '#fcd34d', 1.3);
    dot(c, -2.4, -27.6, 1.25, OL); dot(c, 3.2, -27.6, 1.25, OL); dot(c, -2.1, -28.1, 0.45, '#fff'); dot(c, 3.5, -28.1, 0.45, '#fff');
    c.beginPath(); c.arc(0.4, -25.4, 1.8, 0.3, Math.PI - 0.3); c.strokeStyle = OL; c.lineWidth = 1; c.stroke();
    shape(c, el(-5.4, -25.2, 1.8, 1.1), 'rgba(255,90,140,.55)', 0); shape(c, el(6, -25.2, 1.8, 1.1), 'rgba(255,90,140,.55)', 0);
    c.beginPath(); c.ellipse(0, -39.6, 6.4, 1.9, 0, 0, Math.PI * 2); c.strokeStyle = OL; c.lineWidth = 3; c.stroke(); c.strokeStyle = '#ffcb3d'; c.lineWidth = 1.6; c.stroke();
  },
  hoplite(c) {
    line(c, [11, -2, 13.5, -47], OL, 3.4); line(c, [11, -2, 13.5, -47], '#8a5a33', 1.7);
    shape(c, poly(11.8, -45.5, 13.6, -54, 15.4, -45.8), '#e5e7eb', 1.3);
    shape(c, c => { c.moveTo(-7, -21); c.lineTo(7, -21); c.lineTo(9, -3); c.lineTo(5, -5); c.lineTo(2, -3); c.lineTo(-1, -5); c.lineTo(-4, -3); c.lineTo(-9, -3); c.closePath(); }, '#dc2626');
    shape(c, rr(-7.6, -21.5, 15.2, 9.5, 2.4), '#d97706', 1.4);
    shape(c, el(11.8, -18.6, 2.7, 2.7), '#e0a872', 1.3);
    shape(c, el(0.5, -27, 7, 6.6), '#e0a872');
    dot(c, 4, -27.4, 1.15, OL);
    shape(c, c => { c.moveTo(-7.4, -24.5); c.quadraticCurveTo(-8, -35.4, 0.5, -35.4); c.quadraticCurveTo(7.8, -35.4, 8, -29.5); c.lineTo(1.8, -29.5); c.lineTo(1.8, -24); c.lineTo(-2, -21.6); c.lineTo(-7.4, -21.6); c.closePath(); }, '#d97706', 1.5);
    line(c, [-6, -30, 1, -30], '#fbbf24', 1);
    shape(c, c => { c.moveTo(-8.6, -31); c.quadraticCurveTo(-7, -40.6, 5, -38.6); c.quadraticCurveTo(0, -36, -1.4, -33.6); c.closePath(); }, '#dc2626', 1.4);
    shape(c, el(-5.6, -13, 8.6, 9.6), '#b45309');
    shape(c, el(-5.6, -13, 6.3, 7.2), '#f59e0b', 1.2);
    shape(c, c => starPath(c, -5.6, -13, 3.4, 1.5), '#b45309', 0.9);
  },
  shieldmaiden(c) {
    shape(c, el(-8.4, -24, 2.6, 7.4, 0.25), '#fcd34d', 1.4);
    shape(c, c => { c.moveTo(-9, -30); c.lineTo(9, -30); c.lineTo(12, -3); c.quadraticCurveTo(0, 0, -12, -3); c.closePath(); }, '#3b82f6');
    shape(c, rr(-9.4, -30.5, 18.8, 13, 3.4), '#9ca3af', 1.4);
    c.strokeStyle = '#6b7280'; c.lineWidth = 0.8; c.beginPath(); for (let yy = -28; yy < -19; yy += 2.6) for (let xx = -7.5; xx < 8; xx += 2.6) { c.moveTo(xx + 1.1, yy); c.arc(xx, yy, 1.1, 0, Math.PI); } c.stroke();
    shape(c, rr(-10, -18.5, 20, 3.4, 1.2), '#7c2d12', 1.2); dot(c, 0, -16.8, 1.3, '#ffcb3d');
    shape(c, el(-11, -21, 3.4, 7, 0.3), '#9ca3af'); shape(c, el(-12, -14.4, 2.8, 2.8), '#f1c27d', 1.3);
    shape(c, el(0, -37, 8.4, 8), '#f1c27d');
    shape(c, c => { c.moveTo(-8.6, -37); c.quadraticCurveTo(-10, -30, -6, -27); c.quadraticCurveTo(-5.6, -32, -6.2, -35); c.closePath(); }, '#fcd34d', 1.3);
    shape(c, el(7.6, -28.6, 2.4, 5, -0.15), '#fcd34d', 1.3); line(c, [6.4, -31, 8.8, -30], '#e0a92a', 0.9); line(c, [6.4, -28, 8.8, -27], '#e0a92a', 0.9);
    dot(c, -2.6, -36.4, 1.3, OL); dot(c, 3.6, -36.4, 1.3, OL);
    line(c, [-4.6, -39, -1, -38.2], OL, 1.2); line(c, [5.6, -39, 2, -38.2], OL, 1.2);
    c.beginPath(); c.moveTo(-1.6, -32.4); c.lineTo(3, -32.6); c.strokeStyle = OL; c.lineWidth = 1.2; c.stroke();
    shape(c, c => { c.moveTo(-9, -38); c.quadraticCurveTo(-9.4, -47, 0, -47.2); c.quadraticCurveTo(9.4, -47, 9, -38); c.closePath(); }, '#9ca3af', 1.6);
    line(c, [0, -47, 0, -38.6], '#6b7280', 1.2);
    shape(c, c => { c.moveTo(-8.6, -42); c.quadraticCurveTo(-16, -45, -18, -52); c.quadraticCurveTo(-13, -49, -11, -50); c.quadraticCurveTo(-12, -46, -7.6, -44.6); c.closePath(); }, '#fff', 1.4);
    shape(c, c => { c.moveTo(8.6, -42); c.quadraticCurveTo(16, -45, 18, -52); c.quadraticCurveTo(13, -49, 11, -50); c.quadraticCurveTo(12, -46, 7.6, -44.6); c.closePath(); }, '#fff', 1.4);
    shape(c, el(9.5, -18, 11, 12), '#a16207');
    c.save(); c.beginPath(); c.ellipse(9.5, -18, 11, 12, 0, 0, Math.PI * 2); c.clip(); c.strokeStyle = '#7c4a12'; c.lineWidth = 1.1; c.beginPath(); for (const xx of [3, 7.5, 12, 16.5]) { c.moveTo(xx, -31); c.lineTo(xx, -5); } c.stroke(); c.restore();
    c.beginPath(); c.ellipse(9.5, -18, 9.6, 10.6, 0, 0, Math.PI * 2); c.strokeStyle = '#9ca3af'; c.lineWidth = 2; c.stroke();
    shape(c, el(9.5, -18, 3.4, 3.6), '#d1d5db', 1.3);
    shape(c, el(-2.4, -18.6, 2.8, 2.8), '#f1c27d', 1.3);
  },
  thundergod(c) {
    const cl = [[-11, -6, 8, 5], [0, -5, 10, 6], [11, -6, 8, 5], [-5, -10, 7, 5.4], [6, -10.5, 7, 5.4]];
    for (const [x, y, rx, ry] of cl) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.strokeStyle = OL; c.lineWidth = 4.4; c.stroke(); }
    for (const [x, y, rx, ry] of cl) shape(c, el(x, y, rx, ry), '#eef2f7', 0);
    for (const [x, y, rx] of [[-4, -11, 4], [7, -11.6, 3.6]]) shape(c, el(x, y, rx, 2), '#fff', 0);
    shape(c, c => { c.moveTo(-10, -35); c.lineTo(10, -35); c.lineTo(12, -11); c.quadraticCurveTo(0, -8, -12, -11); c.closePath(); }, '#f5f5f4');
    shape(c, poly(-10, -34, -4.6, -35, 10.6, -13, 5.4, -11.2), '#2563eb', 1.2);
    shape(c, el(-12.5, -24, 4, 7.6, 0.2), '#f1c27d'); shape(c, el(-13.2, -16.6, 3, 3), '#f1c27d', 1.3);
    shape(c, el(13, -37, 3.8, 7.4, -0.5), '#f1c27d');
    shape(c, poly(13.5, -63, 21, -63, 17, -55, 22.5, -55, 11.5, -40, 15, -50.6, 10, -50.6), '#ffe14d', 1.4);
    shape(c, el(16, -45, 3.2, 3.2), '#f1c27d', 1.3);
    shape(c, el(0, -42, 8, 7.6), '#f1c27d');
    shape(c, c => { c.moveTo(-8.2, -43); c.quadraticCurveTo(-9, -51.5, 0, -51.4); c.quadraticCurveTo(9, -51.5, 8.2, -43); c.quadraticCurveTo(5, -47, 0, -47); c.quadraticCurveTo(-5, -47, -8.2, -43); c.closePath(); }, '#e5e7eb', 1.5);
    shape(c, c => { c.moveTo(-8, -41); c.quadraticCurveTo(-9.5, -29, 0, -26); c.quadraticCurveTo(9.5, -29, 8, -41); c.quadraticCurveTo(4.5, -37.2, 0.5, -38.4); c.quadraticCurveTo(-4, -37.2, -8, -41); c.closePath(); }, '#f5f5f4', 1.5);
    line(c, [-3, -35, -1, -31], '#d1d5db', 1); line(c, [3, -35, 2, -31], '#d1d5db', 1);
    line(c, [-5.4, -45, -1.4, -43.6], OL, 1.8); line(c, [6, -45, 2, -43.6], OL, 1.8);
    dot(c, -2.8, -42, 1.3, '#22e3ff'); dot(c, 3.6, -42, 1.3, '#22e3ff');
    shape(c, el(0.4, -39.6, 2.6, 1.4), '#f5f5f4', 1);
    for (let i = 0; i < 5; i++) { const a = Math.PI * (1.15 + i * 0.17); shape(c, el(Math.cos(a) * 8.4, -44 + Math.sin(a) * 6.4, 2, 1, a + Math.PI / 2), '#ffcb3d', 0.9); }
  },
  medusa(c) {
    shape(c, c => { c.moveTo(-8, -26); c.lineTo(8, -26); c.lineTo(11, -3); c.quadraticCurveTo(0, 0, -11, -3); c.closePath(); }, '#a855f7');
    shape(c, poly(-8, -25, -3, -26, 9, -6, 4, -4), '#ffcb3d', 1.1);
    shape(c, el(-10, -17, 3, 6.5, 0.25), '#86efac'); shape(c, el(-11, -11.4, 2.5, 2.5), '#86efac', 1.3);
    const snakes = [[-6, -38, -13, -44, -10, -50], [-2, -40, -5, -48, 0, -51], [2.5, -40, 4, -48, 9, -50], [6, -37, 12, -42, 13, -48], [-7.4, -33, -14, -35, -16, -40]];
    for (const [x0, y0, x1, y1, x2, y2] of snakes) { c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x1, y1, x2, y2); c.strokeStyle = OL; c.lineWidth = 4.4; c.stroke(); c.strokeStyle = '#16a34a'; c.lineWidth = 2.4; c.stroke(); shape(c, el(x2, y2, 2.6, 2), '#22c55e', 1.3); dot(c, x2 + 0.8, y2 - 0.6, 0.6, '#ffe14d'); }
    shape(c, el(0, -33, 7.8, 7.4), '#86efac');
    shape(c, rr(-6.8, -35.6, 6.2, 3.8, 1.4), '#111827', 1.1); shape(c, rr(1.2, -35.6, 6.2, 3.8, 1.4), '#111827', 1.1); line(c, [-0.6, -34.6, 1.2, -34.6], OL, 1);
    line(c, [-5.4, -35, -3, -35], '#a855f7', 0.9); line(c, [2.6, -35, 5, -35], '#a855f7', 0.9);
    shape(c, c => { c.moveTo(-2.2, -29.4); c.quadraticCurveTo(1, -27.6, 3.6, -29.8); c.quadraticCurveTo(1, -28.8, -2.2, -29.4); c.closePath(); }, '#be123c', 1);
    shape(c, el(10, -23, 3, 6, -0.6), '#86efac'); shape(c, el(12.6, -28, 2.6, 2.6), '#86efac', 1.3);
  },
  minotaur(c) {
    line(c, [12, -6, 21, -50], OL, 4.6); line(c, [12, -6, 21, -50], '#7c4a1e', 2.6);
    c.save(); c.translate(20.4, -46); c.rotate(0.2);
    shape(c, c => { c.moveTo(0, -3); c.quadraticCurveTo(10, -13, 13.5, -2); c.quadraticCurveTo(10, 9, 0, 3); c.closePath(); }, '#d1d5db', 1.6);
    shape(c, c => { c.moveTo(0, -3); c.quadraticCurveTo(-10, -13, -13.5, -2); c.quadraticCurveTo(-10, 9, 0, 3); c.closePath(); }, '#d1d5db', 1.6);
    c.restore();
    shape(c, c => { c.moveTo(-15, -38); c.quadraticCurveTo(-20.5, -20, -15.5, -4); c.quadraticCurveTo(0, 0, 15.5, -4); c.quadraticCurveTo(20.5, -20, 15, -38); c.quadraticCurveTo(0, -44, -15, -38); c.closePath(); }, '#92400e');
    shape(c, el(0, -27, 9, 8), '#b45309', 0);
    line(c, [-12, -38, 12, -10], OL, 4); line(c, [-12, -38, 12, -10], '#3b2a1e', 2.4);
    shape(c, rr(-12.5, -12.5, 25, 8, 2), '#3b2a1e', 1.5);
    shape(c, el(-17.5, -24, 6, 11, 0.2), '#92400e'); shape(c, el(-18.5, -13.4, 4.4, 4.4), '#7c2d12', 1.5);
    shape(c, el(15.5, -21, 5.6, 10, -0.3), '#92400e'); shape(c, el(13.8, -13.6, 4.6, 4.6), '#7c2d12', 1.5);
    shape(c, c => { c.moveTo(-7, -52); c.quadraticCurveTo(-17, -52, -19, -61); c.quadraticCurveTo(-13, -57, -8, -57.4); c.closePath(); }, '#f5f0dc', 1.5);
    shape(c, c => { c.moveTo(7, -52); c.quadraticCurveTo(17, -52, 19, -61); c.quadraticCurveTo(13, -57, 8, -57.4); c.closePath(); }, '#f5f0dc', 1.5);
    shape(c, el(-10, -49, 3.4, 2, -0.4), '#7c2d12', 1.3); shape(c, el(10, -49, 3.4, 2, 0.4), '#7c2d12', 1.3);
    shape(c, el(0, -47, 9.6, 9), '#7c2d12');
    shape(c, el(2.6, -41.4, 7.2, 5), '#d6a77a');
    dot(c, 0.4, -41.6, 1.1, OL); dot(c, 5, -41.6, 1.1, OL);
    c.beginPath(); c.arc(2.6, -38, 2.6, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 2.2; c.stroke(); c.strokeStyle = '#ffcb3d'; c.lineWidth = 1.2; c.stroke();
    shape(c, el(-3.4, -49.6, 2.2, 2), '#fff', 1); shape(c, el(4, -49.6, 2.2, 2), '#fff', 1);
    dot(c, -2.8, -49.4, 1, '#dc2626'); dot(c, 4.6, -49.4, 1, '#dc2626');
    line(c, [-6, -52.4, -1.2, -51], OL, 1.8); line(c, [7, -52.4, 2.2, -51], OL, 1.8);
  },
  /* ---------- Ciberpunks ---------- */
  cybermarine(c) {
    shape(c, rr(-19, -46, 10, 26, 3), '#374151');
    dot(c, -14, -40, 1.6, '#ff3df0'); dot(c, -14, -34, 1.6, '#22e3ff');
    shape(c, rr(-14, -41, 28, 37, 7), '#4b5563');
    shape(c, rr(-10, -38, 20, 14, 4), '#6b7280', 1.4);
    line(c, [-8, -30, 8, -30], '#22e3ff', 1.6);
    shape(c, rr(-12, -9, 24, 5, 2), '#374151', 1.4);
    shape(c, el(-14, -38.5, 8.4, 6, -0.2), '#0e7490'); shape(c, el(14, -38.5, 8.4, 6, 0.2), '#0e7490');
    line(c, [-19, -38, -9, -40], '#22e3ff', 1.2); line(c, [19, -38, 9, -40], '#22e3ff', 1.2);
    shape(c, rr(0, -27, 28, 7, 2.4), '#1f2937');
    shape(c, rr(27, -25.8, 9, 3.6, 1.2), '#374151', 1.3);
    shape(c, rr(9, -21, 4.6, 7, 1.2), '#1f2937', 1.3);
    shape(c, rr(14, -31, 9, 4, 1.4), '#374151', 1.3); dot(c, 22, -29, 1.2, '#ff3df0');
    line(c, [3, -23.5, 24, -23.5], '#ff3df0', 1.2);
    shape(c, el(4, -22, 4.6, 4.6), '#4b5563', 1.4);
    shape(c, rr(-10, -61, 20, 19, 8), '#4b5563');
    shape(c, rr(-4, -55, 14.5, 6.4, 3.2), '#22e3ff', 1.4);
    line(c, [-1.5, -53.4, 7, -53.4], 'rgba(255,255,255,.85)', 1.2);
    line(c, [-7, -60, -9.5, -68], OL, 1.8); dot(c, -9.6, -68.6, 2, '#ff3df0');
  },
  drone(c) {
    line(c, [-12, -19, 12, -19], OL, 3); line(c, [-12, -19, 12, -19], '#9ca3af', 1.6);
    shape(c, el(-12.5, -21, 6.4, 1.8), 'rgba(205,225,245,.9)', 1.2); shape(c, el(12.5, -21, 6.4, 1.8), 'rgba(205,225,245,.9)', 1.2);
    shape(c, rr(-1, -11, 9, 2.6, 1), '#1f2937', 1.1);
    shape(c, el(0, -15, 7.4, 6.2), '#4b5563');
    shape(c, el(2.4, -15, 3.6, 3.6), '#111827', 1.2); dot(c, 3, -15, 1.9, '#22e3ff'); dot(c, 2.4, -15.8, 0.6, '#fff');
    line(c, [-3, -21, -4, -24], OL, 1.2); dot(c, -4, -24.3, 1.1, '#ff3df0');
  },
  nanobot(c) {
    line(c, [-6, -9, -9.5, -5.5], OL, 2); line(c, [6, -9, 9.5, -5.5], OL, 2);
    shape(c, el(0, -10, 7, 7), '#cbd5e1');
    shape(c, rr(-4.6, -14, 9.6, 6, 2), '#1f2937', 1.2);
    dot(c, 1.6, -11, 1.9, '#22e3ff'); dot(c, 1.2, -11.6, 0.6, '#fff');
    line(c, [-3, -5.5, 3, -5.5], '#ff3df0', 1.2);
    line(c, [0, -17, 1.4, -21], OL, 1.4); dot(c, 1.5, -21.6, 1.7, '#ff3df0');
  },
  cyberninja(c) {
    shape(c, c => { c.moveTo(-3, -27); c.quadraticCurveTo(-14, -29, -21, -23); c.quadraticCurveTo(-14, -23.4, -10, -21.4); c.quadraticCurveTo(-15, -18, -18, -13); c.quadraticCurveTo(-8, -17, -2, -23); c.closePath(); }, '#ff3df0', 1.5);
    c.save(); c.globalAlpha = 0.35; line(c, [9, -15, 27, -38], '#22e3ff', 6); c.restore();
    line(c, [9, -15, 27, -38], OL, 3.8); line(c, [9, -15, 27, -38], '#a5f3fc', 2); line(c, [10, -16.4, 26.4, -37.2], '#fff', 0.7);
    line(c, [5.6, -10.6, 9.6, -15.6], OL, 3.4); line(c, [5.6, -10.6, 9.6, -15.6], '#ff3df0', 1.6);
    shape(c, c => { c.moveTo(-7, -24); c.lineTo(7, -24); c.lineTo(9, -3); c.quadraticCurveTo(0, 0, -9, -3); c.closePath(); }, '#1f2937');
    line(c, [-7.6, -12, 7.6, -12], '#ff3df0', 1.6);
    line(c, [-1, -24, 4, -12], '#374151', 1.4);
    shape(c, el(-8.5, -16, 2.8, 6, 0.3), '#1f2937'); shape(c, el(7, -14, 2.8, 2.8), '#374151', 1.3);
    shape(c, el(0, -31, 7.6, 7.2), '#1f2937');
    shape(c, rr(-1, -34.2, 9.4, 3.8, 1.8), '#22e3ff', 1.2);
    line(c, [0.4, -33, 7, -33], '#fff', 0.8);
    shape(c, c => { c.moveTo(-7, -33); c.quadraticCurveTo(-13, -35, -15, -31); c.quadraticCurveTo(-12, -32, -7, -30.4); c.closePath(); }, '#ff3df0', 1.2);
  },
  techdroid(c) {
    line(c, [8, -21, 15.5, -25], OL, 2.8); line(c, [8, -21, 15.5, -25], '#9ca3af', 1.4);
    shape(c, c => { c.moveTo(14.5, -28.5); c.lineTo(18.5, -27.5); c.lineTo(17.4, -25.4); c.lineTo(19.6, -23.6); c.lineTo(17.4, -21.6); c.lineTo(15, -24); c.closePath(); }, '#d1d5db', 1.2);
    line(c, [-8, -19, -13, -15], OL, 2.8); line(c, [-8, -19, -13, -15], '#9ca3af', 1.4); shape(c, el(-13.6, -14.4, 2.2, 2.2), '#7be04a', 1.1);
    shape(c, rr(-10, -31, 20, 21, 8), '#eef2f7');
    shape(c, rr(-6, -27, 12, 9.6, 2), '#1f2937', 1.2);
    c.fillStyle = '#7be04a'; c.fillRect(-1.1, -25.6, 2.2, 7); c.fillRect(-3.5, -23.2, 7, 2.2);
    line(c, [-8, -12.5, 8, -12.5], '#22e3ff', 1.4);
    shape(c, c => { c.moveTo(-8.2, -31); c.quadraticCurveTo(-8.2, -40, 0, -40.4); c.quadraticCurveTo(8.2, -40, 8.2, -31); c.closePath(); }, '#22d3ee', 1.6);
    dot(c, 2.6, -34.6, 2.4, '#1f2937'); dot(c, 3.2, -35.2, 0.8, '#fff');
    shape(c, el(-3.6, -37, 2, 1, -0.5), 'rgba(255,255,255,.7)', 0);
  },
  hackerkid(c) {
    shape(c, c => { c.moveTo(-8, -22); c.quadraticCurveTo(-10, -10, -8.5, -3); c.quadraticCurveTo(0, 0, 8.5, -3); c.quadraticCurveTo(10, -10, 8, -22); c.quadraticCurveTo(0, -25, -8, -22); c.closePath(); }, '#374151');
    line(c, [-2, -21, -2.4, -15], '#9ca3af', 1); line(c, [2, -21, 2.4, -15], '#9ca3af', 1);
    shape(c, el(-9, -14, 2.6, 5.4, 0.25), '#374151');
    shape(c, poly(3, -12, 19, -12, 21, -9, 1, -9), '#9ca3af', 1.3);
    shape(c, poly(4.4, -12, 7, -26, 22, -26, 18.6, -12), '#1f2937', 1.4);
    shape(c, c => heartPath(c, 13.6, -19.2, 2.4), '#7be04a', 0.9);
    shape(c, el(5, -12.4, 2.5, 2.5), '#e0a872', 1.2);
    shape(c, el(0, -29, 9, 8.6), '#374151');
    shape(c, el(2, -28, 6, 5.8), '#e0a872', 1.3);
    shape(c, rr(-2.6, -31, 4.8, 3.2, 1), '#a3ff7a', 1); shape(c, rr(3.2, -31, 4.8, 3.2, 1), '#a3ff7a', 1);
    line(c, [2.2, -29.4, 3.2, -29.4], OL, 0.9);
    c.beginPath(); c.moveTo(0.6, -25.2); c.quadraticCurveTo(3, -24, 5, -25.8); c.strokeStyle = OL; c.lineWidth = 1; c.stroke();
    shape(c, c => { c.moveTo(-1.6, -33.4); c.quadraticCurveTo(2, -36, 6.4, -33.6); c.quadraticCurveTo(2, -34.4, -1.6, -33.4); c.closePath(); }, '#5b3a26', 0);
  },
  neonsniper(c) {
    shape(c, c => { c.moveTo(-8, -26); c.lineTo(8, -26); c.lineTo(11, -3); c.lineTo(3, -5.5); c.lineTo(-11, -3); c.closePath(); }, '#312e81');
    line(c, [-10.6, -4, 10.6, -4], '#22e3ff', 1.2);
    shape(c, rr(-8, -23, 33, 4.6, 1.6), '#1f2937');
    line(c, [24, -21, 35, -21], OL, 2.8); line(c, [24, -21, 35, -21], '#4b5563', 1.4);
    shape(c, poly(-8, -23, -14, -20, -13, -15, -6, -18.6), '#1f2937', 1.4);
    shape(c, rr(5, -29, 12, 4, 1.6), '#374151', 1.3); shape(c, el(17, -27, 1.6, 2), '#ff3df0', 1);
    line(c, [-6, -21.6, 22, -21.6], '#ff3df0', 1);
    shape(c, el(-3, -19, 3, 3), '#c68642', 1.3); shape(c, el(11, -18.6, 2.8, 2.8), '#c68642', 1.3);
    shape(c, c => { c.moveTo(-8.2, -29); c.quadraticCurveTo(-9.4, -40, 0, -40.4); c.quadraticCurveTo(9.4, -40, 8.2, -29); c.closePath(); }, '#312e81');
    shape(c, el(1.5, -31, 6, 5.6), '#c68642', 1.3);
    shape(c, rr(0, -33.6, 9.4, 3.4, 1.6), '#ff3df0', 1.2); line(c, [1.4, -32.4, 7.6, -32.4], '#fff', 0.8);
    shape(c, c => { c.moveTo(-5, -36); c.quadraticCurveTo(2, -38, 6, -35); c.quadraticCurveTo(1, -35.4, -2, -33); c.closePath(); }, '#c084fc', 1);
  },
  siegemech(c) {
    shape(c, rr(-12.5, -17, 8.5, 15, 2), '#374151'); shape(c, rr(4, -17, 8.5, 15, 2), '#374151');
    shape(c, rr(-14.5, -21, 29, 6, 2), '#1f2937', 1.6);
    shape(c, rr(-24, -55, 13, 13, 2.4), '#4b5563');
    for (const [mx, my] of [[-20.5, -51.5], [-15, -51.5], [-20.5, -46], [-15, -46]]) dot(c, mx, my, 1.8, '#ff3348');
    shape(c, rr(-18, -45, 36, 26, 6), '#6b7280');
    c.save(); c.beginPath(); rrPath(c, -18, -25, 36, 6, 2); c.clip(); c.fillStyle = '#ffcb3d'; c.fillRect(-18, -25, 36, 6); c.fillStyle = '#1f2937'; for (let i = -20; i < 20; i += 6) { c.beginPath(); c.moveTo(i, -19); c.lineTo(i + 3, -25); c.lineTo(i + 6, -25); c.lineTo(i + 3, -19); c.closePath(); c.fill(); } c.restore();
    shape(c, rr(-18, -45, 36, 26, 6), null, 2.2);
    shape(c, rr(2, -41, 13, 10, 3), '#22e3ff', 1.5); shape(c, el(7, -35, 3, 3), '#1f2937', 0); line(c, [4, -39.4, 9, -39.4], 'rgba(255,255,255,.8)', 1);
    shape(c, el(-21, -30, 4.6, 8, 0.2), '#4b5563');
    shape(c, rr(-6, -58, 27, 10, 3.4), '#4b5563');
    shape(c, rr(20, -57, 15, 7.6, 2), '#374151', 1.5); shape(c, rr(33, -58.2, 4, 10, 1.4), '#1f2937', 1.3);
    line(c, [-3, -53, 18, -53], '#22e3ff', 1.2);
    line(c, [8, -58, 6, -66], OL, 1.6); dot(c, 5.8, -66.6, 1.8, '#ff3df0');
  },
  /* ---------- Memes ---------- */
  memelord(c) {
    shape(c, c => { c.moveTo(-11, -36); c.lineTo(11, -36); c.lineTo(19, -3); c.quadraticCurveTo(0, 2, -19, -3); c.closePath(); }, '#16a34a');
    shape(c, c => { c.moveTo(-12, -36); c.quadraticCurveTo(-15, -16, -13.5, -3); c.quadraticCurveTo(0, 0, 13.5, -3); c.quadraticCurveTo(15, -16, 12, -36); c.quadraticCurveTo(0, -39, -12, -36); c.closePath(); }, '#7c3aed');
    line(c, [0, -36, 0, -3], '#ffcb3d', 1.8);
    for (const yy of [-28, -20, -12]) dot(c, 0, yy, 1.5, '#ffe14d');
    shape(c, el(-6, -26, 3.6, 3.6), '#ffe14d', 1.2); dot(c, -7.2, -26.8, 0.6, OL); dot(c, -4.8, -26.8, 0.6, OL); c.beginPath(); c.arc(-6, -25.8, 1.8, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 0.8; c.stroke();
    shape(c, el(-14.5, -23, 4, 8, 0.25), '#7c3aed'); shape(c, el(-15.6, -15.6, 3.2, 3.2), '#f1c27d', 1.4);
    shape(c, el(13.5, -33, 4, 8, -0.6), '#7c3aed');
    c.save(); c.translate(19, -45); c.rotate(0.25);
    shape(c, rr(-5.4, -7.4, 10.8, 14.8, 1.8), '#fff', 1.4); shape(c, rr(-3.8, -5.8, 7.6, 11.6, 1.2), '#22c55e', 1);
    txt(c, '?', 0, 0.4, 8, '#fff');
    c.restore();
    shape(c, el(16.6, -39, 3.2, 3.2), '#f1c27d', 1.4);
    shape(c, el(0, -44, 9.2, 8.8), '#f1c27d');
    c.fillStyle = OL; c.fillRect(-8.4, -47.8, 17.4, 1.4); c.fillRect(-7.4, -46.6, 6.4, 3.2); c.fillRect(1.4, -46.6, 6.4, 3.2); c.fillRect(-6.4, -43.4, 4.2, 1.2); c.fillRect(2.4, -43.4, 4.2, 1.2);
    c.fillStyle = '#fff'; c.fillRect(-6.4, -46, 1.2, 1.2); c.fillRect(2.4, -46, 1.2, 1.2);
    c.beginPath(); c.moveTo(-2.4, -39.4); c.quadraticCurveTo(1.4, -37.2, 4.8, -40); c.strokeStyle = OL; c.lineWidth = 1.3; c.stroke();
    shape(c, el(0, -51.4, 14, 3), '#27272a', 1.6);
    shape(c, c => { c.moveTo(-8.4, -52); c.quadraticCurveTo(-9, -62.5, -2, -61.6); c.lineTo(0, -59.4); c.lineTo(2, -61.6); c.quadraticCurveTo(9, -62.5, 8.4, -52); c.closePath(); }, '#27272a', 1.6);
    shape(c, rr(-8.4, -55.4, 16.8, 3, 1), '#ffcb3d', 1);
  },
  suchdog(c) {
    c.beginPath(); c.arc(-9.5, -18.5, 4.6, 0.6, Math.PI * 1.85); c.strokeStyle = OL; c.lineWidth = 5.6; c.stroke(); c.strokeStyle = '#e8a04a'; c.lineWidth = 3.4; c.stroke();
    dot(c, -6, -22.8, 1.7, '#fff7ea');
    shape(c, el(0, -11, 10, 8.6), '#e8a04a');
    shape(c, el(3.4, -9.6, 5.6, 6.4), '#fff7ea', 0);
    shape(c, el(3.5, -24, 9, 8), '#e8a04a');
    shape(c, poly(-2.6, -28.6, -2, -37, 3.6, -30.6), '#e8a04a', 1.6); shape(c, poly(5.4, -30.8, 10, -37.2, 11.4, -27.6), '#e8a04a', 1.6);
    shape(c, poly(-1.6, -30, -1.4, -34.4, 1.6, -30.8), '#fff7ea', 0); shape(c, poly(7, -31, 9.6, -34.6, 10.2, -29.4), '#fff7ea', 0);
    shape(c, el(7.4, -20.4, 6, 4.2), '#fff7ea', 0);
    shape(c, el(11.6, -21.6, 3.6, 2.6), '#fff7ea', 1.2); dot(c, 14.4, -22.4, 1.5, OL);
    shape(c, el(3, -25.6, 2.4, 2), '#fff', 1); dot(c, 4.3, -25.6, 1, OL);
    shape(c, el(8.6, -25.6, 2.2, 1.9), '#fff', 1); dot(c, 9.8, -25.6, 0.9, OL);
    dot(c, 2.4, -28.6, 1.1, '#fff7ea'); dot(c, 8.4, -28.6, 1, '#fff7ea');
    c.beginPath(); c.moveTo(9.6, -19.4); c.quadraticCurveTo(11.6, -17.6, 13.6, -19.4); c.strokeStyle = OL; c.lineWidth = 1; c.stroke();
  },
  gifblaster(c) {
    shape(c, rr(-7, -19, 14, 16, 3.4), '#f97316');
    shape(c, el(-8.6, -12, 2.6, 5, 0.25), '#f97316');
    shape(c, rr(3, -17, 19, 6.4, 2.6), '#8b5cf6'); shape(c, rr(6, -12, 3.6, 5, 1), '#6d28d9', 1.2);
    shape(c, el(22.4, -13.8, 2.6, 3.6), '#ffe14d', 1.3); line(c, [8, -15.6, 18, -15.6], '#c4b5fd', 1);
    shape(c, el(5, -13, 2.6, 2.6), '#e5e7eb', 1.2);
    shape(c, rr(-3, -21.6, 6, 3.4, 1), '#9ca3af', 1.2);
    shape(c, rr(-14.5, -36, 7, 12, 2), '#d1d5db', 1.5);
    shape(c, rr(-11.5, -39, 23, 19, 3.4), '#e5e7eb');
    shape(c, rr(-8.6, -36.4, 17, 13.6, 2.8), '#1e3a8a', 1.4);
    c.fillStyle = '#7be04a'; c.fillRect(-5, -33.4, 2.2, 3); c.fillRect(2.6, -33.4, 2.2, 3);
    c.beginPath(); c.arc(-0.2, -28.6, 3.4, 0.15, Math.PI - 0.15); c.closePath(); c.fill();
    dot(c, 7, -21.8, 0.9, '#ff3348');
    line(c, [-3, -39, -7, -46], OL, 1.6); line(c, [3, -39, 7, -46], OL, 1.6); dot(c, -7.2, -46.6, 1.6, '#ff3df0'); dot(c, 7.2, -46.6, 1.6, '#22e3ff');
  },
  synthcat(c) {
    c.beginPath(); c.moveTo(-6, -6); c.quadraticCurveTo(-17, -6, -15, -20); c.strokeStyle = OL; c.lineWidth = 5; c.stroke(); c.strokeStyle = '#f59e0b'; c.lineWidth = 3; c.stroke();
    shape(c, el(0, -12, 8.6, 9), '#f59e0b');
    line(c, [-6, -16, -3, -14], '#d97706', 1.4); line(c, [-7, -11, -4, -10], '#d97706', 1.4);
    shape(c, el(0, -26.5, 9, 8), '#f59e0b');
    shape(c, poly(-8, -29, -7, -38, -2, -32.5), '#f59e0b', 1.6); shape(c, poly(2, -32.5, 7, -38, 8, -29), '#f59e0b', 1.6);
    shape(c, poly(-6.6, -30.6, -6.2, -35.4, -3.6, -32.6), '#f9a8d4', 0); shape(c, poly(3.6, -32.6, 6.2, -35.4, 6.6, -30.6), '#f9a8d4', 0);
    line(c, [-2, -33, -1, -30.6], '#d97706', 1.2); line(c, [2, -33, 1, -30.6], '#d97706', 1.2);
    shape(c, poly(-7.6, -29.6, 8, -29.6, 6.6, -25.6, 1.2, -25.6, 0, -27, -1.2, -25.6, -6.2, -25.6), '#111827', 1.1);
    line(c, [-6.4, -28.6, -1.6, -28.6], '#ff3df0', 0.9); line(c, [1.6, -28.6, 6.4, -28.6], '#22e3ff', 0.9);
    shape(c, poly(-0.9, -24.6, 0.9, -24.6, 0, -23.6), '#f472b6', 0);
    c.beginPath(); c.moveTo(-2, -22.4); c.quadraticCurveTo(-1, -21.4, 0, -22.4); c.quadraticCurveTo(1, -21.4, 2, -22.4); c.strokeStyle = OL; c.lineWidth = 0.9; c.stroke();
    line(c, [-5, -23.6, -11, -24.6], OL, 0.6); line(c, [-5, -22.8, -11, -22], OL, 0.6); line(c, [5, -23.6, 11, -24.6], OL, 0.6); line(c, [5, -22.8, 11, -22], OL, 0.6);
    c.save(); c.translate(3, -13); c.rotate(-0.35);
    shape(c, rr(-14, -4.5, 26, 9, 3), '#ec4899');
    shape(c, rr(-10, -2.6, 15, 5, 1), '#fff', 1); c.fillStyle = OL; for (let i = 1; i < 6; i++) c.fillRect(-10 + i * 2.5, -2.6, 0.7, 3);
    shape(c, rr(12, -2.4, 12, 4.4, 1.6), '#ec4899', 1.4); dot(c, 22.4, -0.2, 1.4, '#22e3ff');
    dot(c, -12, 0, 1.3, '#22e3ff');
    c.restore();
    shape(c, el(-3.4, -15.4, 2.6, 2.4), '#f59e0b', 1.2); shape(c, el(4, -18, 2.6, 2.4), '#f59e0b', 1.2);
  },
  trollbot(c) {
    shape(c, rr(-14, -33, 28, 29, 6.4), '#6b7280');
    shape(c, rr(-8, -27, 16, 12, 3), '#4b5563', 1.4);
    dot(c, -4, -21, 1.8, '#ff3348'); dot(c, 0.4, -21, 1.8, '#ffe14d'); dot(c, 4.8, -21, 1.8, '#7be04a');
    shape(c, el(-15.4, -19, 4.4, 8, 0.4), '#6b7280'); shape(c, el(-12, -13.2, 3.4, 3.4), '#9ca3af', 1.3);
    shape(c, rr(12, -27, 12, 5.4, 2.4), '#6b7280'); shape(c, rr(22.6, -26.4, 5, 2.4, 1.2), '#9ca3af', 1.1);
    shape(c, rr(-12.5, -51, 25, 19, 5), '#9ca3af');
    shape(c, rr(-9.6, -48, 19.2, 13, 3), '#111827', 1.3);
    c.beginPath(); c.moveTo(-7.6, -42.4); c.quadraticCurveTo(0, -33.4, 7.6, -42.4); c.quadraticCurveTo(0, -39.4, -7.6, -42.4); c.closePath(); c.fillStyle = '#e5e7eb'; c.fill();
    c.strokeStyle = '#111827'; c.lineWidth = 0.7; c.beginPath(); for (let xx = -5; xx <= 5; xx += 2.5) { c.moveTo(xx, -42); c.lineTo(xx, -38); } c.stroke();
    c.beginPath(); c.arc(-4, -44, 2, Math.PI * 1.1, Math.PI * 1.9); c.moveTo(6, -44); c.arc(4, -44, 2, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = '#7be04a'; c.lineWidth = 1.4; c.stroke();
    line(c, [8, -51, 10, -59], OL, 1.6);
    shape(c, rr(10, -61.5, 12, 6.4, 1), '#ff3348', 1.2); txt(c, 'LOL', 16, -58.2, 4.6, '#fff');
  },
  stonks(c) {
    line(c, [12, -14, 15.5, -42], OL, 3.4); line(c, [12, -14, 15.5, -42], '#8a5a33', 1.8);
    shape(c, rr(6, -55, 22, 15, 2), '#fff', 1.5);
    c.strokeStyle = '#d1d5db'; c.lineWidth = 0.6; c.beginPath(); for (let xx = 10; xx < 28; xx += 4) { c.moveTo(xx, -54); c.lineTo(xx, -41); } c.stroke();
    c.beginPath(); c.moveTo(8, -43); c.lineTo(13, -47); c.lineTo(16, -45); c.lineTo(24, -52); c.strokeStyle = '#16a34a'; c.lineWidth = 2; c.stroke();
    shape(c, poly(21, -53.4, 26, -54, 25.2, -49), '#16a34a', 0);
    shape(c, c => { c.moveTo(-10, -26); c.quadraticCurveTo(-12, -12, -10.5, -3); c.quadraticCurveTo(0, 0, 10.5, -3); c.quadraticCurveTo(12, -12, 10, -26); c.quadraticCurveTo(0, -28.5, -10, -26); c.closePath(); }, '#1e3a8a');
    shape(c, poly(-4, -26.6, 4, -26.6, 0, -18), '#fff', 1.2);
    shape(c, poly(-1.4, -25, 1.4, -25, 2, -13, 0, -10.6, -2, -13), '#dc2626', 1.1);
    shape(c, el(-11, -16, 3.4, 7, 0.2), '#1e3a8a'); shape(c, el(-11.6, -9.4, 2.8, 2.8), '#f1c27d', 1.3);
    shape(c, el(10.5, -18, 3.4, 6, -0.4), '#1e3a8a'); shape(c, el(12.4, -14, 2.8, 2.8), '#f1c27d', 1.3);
    shape(c, el(0, -35.5, 8.6, 9.6), '#f5d0b0');
    shape(c, el(-3.6, -40.6, 3, 2, -0.4), 'rgba(255,255,255,.7)', 0);
    shape(c, el(-8.8, -34, 1.6, 2.6), '#f5d0b0', 1.2);
    dot(c, 1.6, -35.6, 1.1, OL); dot(c, 6, -35.6, 1.1, OL);
    line(c, [-0.4, -38.6, 3, -38.2], OL, 1); line(c, [4.6, -38.2, 7.6, -38.6], OL, 1);
    shape(c, el(4.4, -32.4, 1.4, 1.2), '#e8b494', 0.8);
    line(c, [1.4, -29.6, 6.6, -29.8], OL, 1.1);
  },
  chonkcat(c) {
    shape(c, c => { c.moveTo(-24, -6); c.quadraticCurveTo(-34, -2, -30, 4); c.quadraticCurveTo(-10, 5, 8, 3); c.quadraticCurveTo(-12, 1, -22, -2); c.closePath(); }, '#ea8a2a', 1.8);
    shape(c, c => { c.moveTo(-24, -4); c.quadraticCurveTo(-29, -30, -11, -38); c.quadraticCurveTo(6, -44, 18, -36); c.quadraticCurveTo(28, -26, 24, -4); c.quadraticCurveTo(0, 2, -24, -4); c.closePath(); }, '#f59e0b');
    c.strokeStyle = '#d97706'; c.lineWidth = 2.4; for (const [sx, sy] of [[-20, -24], [-17, -32], [-21, -15]]) { c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + 5, sy + 1, sx + 7, sy - 2); c.stroke(); }
    shape(c, el(7, -13, 13, 10), '#fde7c0', 0);
    shape(c, el(4, -3, 5.4, 3.6), '#fde7c0', 1.5); shape(c, el(15.5, -3, 5.4, 3.6), '#fde7c0', 1.5);
    line(c, [3, -4.6, 3, -1.8], OL, 0.8); line(c, [5.4, -4.6, 5.4, -1.8], OL, 0.8); line(c, [14.5, -4.6, 14.5, -1.8], OL, 0.8); line(c, [17, -4.6, 17, -1.8], OL, 0.8);
    shape(c, poly(-5.4, -44, -4.4, -56, 2.6, -48.6), '#f59e0b', 1.8); shape(c, poly(10.4, -48.6, 17.4, -56, 18.2, -43.6), '#f59e0b', 1.8);
    shape(c, poly(-4, -46, -3.6, -52.4, 0.6, -48.4), '#f9a8d4', 0); shape(c, poly(12.2, -48.4, 16.4, -52.4, 16.6, -45.6), '#f9a8d4', 0);
    shape(c, el(6.5, -40, 13.5, 11), '#f59e0b');
    c.strokeStyle = '#d97706'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(4, -50); c.lineTo(4.5, -46); c.moveTo(6.5, -51); c.lineTo(6.5, -46.4); c.moveTo(9, -50); c.lineTo(8.5, -46); c.stroke();
    shape(c, el(1.6, -40.6, 3.2, 2.6), '#fff7d6', 1.1); shape(c, el(11.6, -40.6, 3.2, 2.6), '#fff7d6', 1.1);
    dot(c, 2.4, -40, 1.3, OL); dot(c, 12.4, -40, 1.3, OL);
    shape(c, c => { c.moveTo(-1.8, -41.6); c.lineTo(5, -42.6); c.lineTo(5, -44); c.lineTo(-1.8, -43.6); c.closePath(); }, '#f59e0b', 0);
    shape(c, c => { c.moveTo(8.2, -42.6); c.lineTo(15, -41.6); c.lineTo(15, -43.6); c.lineTo(8.2, -44); c.closePath(); }, '#f59e0b', 0);
    line(c, [-1.8, -42, 5, -42.8], OL, 1.3); line(c, [8.2, -42.8, 15, -42], OL, 1.3);
    shape(c, el(6.6, -34.6, 5, 3.4), '#fde7c0', 0);
    shape(c, poly(5.2, -36.8, 8, -36.8, 6.6, -35.2), '#f472b6', 0.9);
    c.beginPath(); c.moveTo(4.4, -33.6); c.quadraticCurveTo(5.5, -32.4, 6.6, -33.6); c.quadraticCurveTo(7.7, -32.4, 8.8, -33.6); c.strokeStyle = OL; c.lineWidth = 1; c.stroke();
    line(c, [0, -35, -8, -36.4], OL, 0.7); line(c, [0, -34, -8, -33], OL, 0.7); line(c, [13, -35, 21, -36.4], OL, 0.7); line(c, [13, -34, 21, -33], OL, 0.7);
  },
  u_tower(c) {
    shape(c, c => { c.moveTo(-16, -56); c.lineTo(-19, -2); c.quadraticCurveTo(0, 6, 19, -2); c.lineTo(16, -56); c.closePath(); }, '#6b6a7d');
    c.strokeStyle = '#55546a'; c.lineWidth = 1.2; c.beginPath();
    for (let y = -48; y < -4; y += 9) { c.moveTo(-17, y); c.lineTo(17, y); }
    for (let y = -52, r = 0; y < -6; y += 9, r++) for (let x = r % 2 ? -10 : -4; x < 16; x += 12) { c.moveTo(x, y); c.lineTo(x, y + 9); }
    c.stroke();
    shape(c, el(-12, -3, 6, 3.4), '#3f5c40', 1.2); shape(c, el(10, -2, 7, 3.6), '#3f5c40', 1.2);
    line(c, [-8, -32, 8, -18], OL, 4.2); line(c, [-8, -32, 8, -18], '#efeadf', 2.2); line(c, [8, -32, -8, -18], OL, 4.2); line(c, [8, -32, -8, -18], '#efeadf', 2.2);
    shape(c, el(0, -25, 4.8, 4.6), '#efeadf', 1.3); dot(c, -1.7, -25.4, 1.1, '#1a1022'); dot(c, 1.7, -25.4, 1.1, '#1a1022');
    shape(c, c => { c.moveTo(-20, -58); c.lineTo(20, -58); c.quadraticCurveTo(16, -50, 0, -50); c.quadraticCurveTo(-16, -50, -20, -58); c.closePath(); }, '#4a4960');
    shape(c, el(0, -58, 20, 5), '#2a2938', 1.6);
    shape(c, c => { c.moveTo(-10, -58); c.quadraticCurveTo(-12, -68, -4, -76); c.quadraticCurveTo(-4, -70, 0, -68); c.quadraticCurveTo(1, -78, 6, -82); c.quadraticCurveTo(5, -72, 9, -68); c.quadraticCurveTo(13, -63, 10, -58); c.closePath(); }, '#5ef2a0', 1.6);
    shape(c, c => { c.moveTo(-4, -58); c.quadraticCurveTo(-5, -65, 0, -70); c.quadraticCurveTo(1, -64, 4, -62); c.quadraticCurveTo(6, -60, 4, -58); c.closePath(); }, '#d4ffe6', 0);
  },
  u_base(c) {
    shape(c, c => { c.moveTo(-50, -7); c.lineTo(50, -7); c.lineTo(52, 0); c.quadraticCurveTo(0, 8, -52, 0); c.closePath(); }, '#5a596e');
    shape(c, rr(-43, -68, 86, 62, 3), '#7d7c92');
    c.strokeStyle = '#68677e'; c.lineWidth = 1.1; c.beginPath(); for (let y = -60; y < -8; y += 9) { c.moveTo(-42, y); c.lineTo(42, y); } c.stroke();
    for (const x of [-35, -21, 21, 35]) shape(c, rr(x - 3.6, -64, 7.2, 58, 1.5), '#a3a2b8', 1.4);
    shape(c, poly(-49, -67, 0, -98, 49, -67), '#5a596e', 2);
    shape(c, poly(-38, -70, 0, -92, 38, -70), '#6b6a7d', 0);
    shape(c, el(0, -79, 6.2, 5.8), '#efeadf', 1.4); dot(c, -2.2, -79.6, 1.4, '#5ef2d0'); dot(c, 2.2, -79.6, 1.4, '#5ef2d0');
    shape(c, c => { c.moveTo(-12.5, -7); c.lineTo(-12.5, -31); c.arc(0, -31, 12.5, Math.PI, 0); c.lineTo(12.5, -7); c.closePath(); }, '#141020', 1.8);
    shape(c, c => { c.moveTo(-8, -7); c.lineTo(-8, -29); c.arc(0, -29, 8, Math.PI, 0); c.lineTo(8, -7); c.closePath(); }, '#1f4a38', 0);
    line(c, [0, -98, 0, -116], OL, 3.6); line(c, [0, -98, 0, -116], '#c9c3b0', 1.8);
    shape(c, poly(0, -116, 21, -112, 15, -107, 21, -102, 0, -103), '#6a3fb0', 1.6);
    dot(c, 9, -109, 2.2, '#efeadf');
    for (const x of [-21, 21]) { shape(c, rr(x - 2, -15, 4, 8, 1), '#f3e6cc', 1); shape(c, el(x, -17.5, 1.6, 2.6), '#5ef2a0', 0.8); }
  },
  u_rubble(c) {
    shape(c, el(0, -3, 23, 8), '#5a596e');
    shape(c, poly(-17, -3, -16, -16, -10, -12, -6, -20, 0, -13, 6, -18, 12, -11, 17, -14, 17, -3), '#6b6a7d');
    shape(c, rr(-25, -8, 12, 7, 1.5), '#7d7c92', 1.5); shape(c, rr(11, -7, 14, 6, 1.5), '#7d7c92', 1.5);
    line(c, [-6, -2, 6, -6], OL, 3.4); line(c, [-6, -2, 6, -6], '#efeadf', 1.8);
    shape(c, el(3, -10, 3.8, 3.4), '#efeadf', 1.2);
  },
  p_tower(c) {
    shape(c, c => { c.moveTo(-20, -52); c.lineTo(-20, -2); c.quadraticCurveTo(0, 7, 20, -2); c.lineTo(20, -52); c.closePath(); }, '#8b5530');
    c.strokeStyle = '#6c3f22'; c.lineWidth = 1.6;
    for (const lx of [-13, -6, 1, 8, 15]) { c.beginPath(); c.moveTo(lx, -50); c.quadraticCurveTo(lx + 1.5, -26, lx, -2 + Math.abs(lx) * -0.12); c.stroke(); }
    shape(c, el(-14, -3, 7, 4), '#5aa83a', 1.4); shape(c, el(12, -2, 8, 4), '#5aa83a', 1.4); shape(c, el(-2, 0, 6, 3), '#6cc048', 1.2);
    shape(c, el(0, -52, 22, 8), '#d39a5f');
    c.strokeStyle = '#a8723f'; c.lineWidth = 1; c.beginPath(); c.ellipse(0, -52, 15, 5.4, 0, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.ellipse(0, -52, 8, 2.9, 0, 0, Math.PI * 2); c.stroke();
    c.lineCap = 'round';
    line(c, [0, -54, 0, -64], OL, 5); line(c, [0, -64, -6.5, -72], OL, 5); line(c, [0, -64, 6.5, -72], OL, 5);
    line(c, [0, -54, 0, -64], '#a0683a', 2.8); line(c, [0, -64, -6.5, -72], '#a0683a', 2.8); line(c, [0, -64, 6.5, -72], '#a0683a', 2.8);
    c.beginPath(); c.moveTo(-6.5, -72); c.quadraticCurveTo(0, -65, 6.5, -72); c.strokeStyle = '#ff4b5c'; c.lineWidth = 1.5; c.stroke();
    shape(c, el(0, -67.5, 2.6, 2.6), '#9a6a33', 1.2);
    line(c, [15, -54, 15, -85], OL, 3.4); line(c, [15, -54, 15, -85], '#e8d2b0', 1.6);
    shape(c, poly(15, -85, 29, -80.5, 15, -75), '#ff7a1a', 1.6);
  },
  p_base(c) {
    shape(c, el(-40, -6, 12, 7, 0.3), '#6e4226'); shape(c, el(40, -6, 12, 7, -0.3), '#6e4226');
    shape(c, el(-20, 1, 10, 5), '#6e4226'); shape(c, el(22, 1, 10, 5), '#6e4226');
    shape(c, c => { c.moveTo(-44, -66); c.lineTo(-46, -6); c.quadraticCurveTo(0, 10, 46, -6); c.lineTo(44, -66); c.closePath(); }, '#7d4a28');
    c.strokeStyle = '#5e351c'; c.lineWidth = 1.8;
    for (const lx of [-38, -30, -20, 20, 31, 39]) { c.beginPath(); c.moveTo(lx, -62); c.quadraticCurveTo(lx + 2, -34, lx, -6); c.stroke(); }
    shape(c, el(0, -66, 45, 13), '#d7a066');
    c.strokeStyle = '#a6703c'; c.lineWidth = 1.2; for (const q of [34, 22, 10]) { c.beginPath(); c.ellipse(0, -66, q, q * 0.29, 0, 0, Math.PI * 2); c.stroke(); }
    for (let i = 0; i < 9; i++) { const a = Math.PI * (0.1 + i * 0.1); shape(c, el(Math.cos(a) * -42, -66 + Math.sin(a) * 11, 6, 3.6), '#5aa83a', 1.2); }
    shape(c, c => { c.moveTo(-15, -3); c.lineTo(-15, -24); c.arc(0, -24, 15, Math.PI, 0); c.lineTo(15, -3); c.quadraticCurveTo(0, 1, -15, -3); c.closePath(); }, '#d7a066');
    shape(c, c => { c.moveTo(-10.5, -2.5); c.lineTo(-10.5, -24); c.arc(0, -24, 10.5, Math.PI, 0); c.lineTo(10.5, -2.5); c.closePath(); }, '#3a1d10', 1.4);
    dot(c, 6, -13, 1.6, '#ffcb3d');
    for (const wx of [-28, 28]) { shape(c, el(wx, -40, 7.5, 7.5), '#ffd36b'); line(c, [wx - 7, -40, wx + 7, -40], OL, 1.4); line(c, [wx, -47, wx, -33], OL, 1.4); }
    line(c, [30, -66, 30, -106], OL, 3.6); line(c, [30, -66, 30, -106], '#e8d2b0', 1.8);
    shape(c, c => { c.moveTo(30, -106); c.lineTo(54, -100); c.lineTo(47, -93); c.lineTo(54, -86); c.lineTo(30, -84); c.closePath(); }, '#ff7a1a');
    shape(c, el(37.5, -96, 2, 5, -0.2), '#fff', 1.1); shape(c, el(42.5, -96, 2, 5, 0.2), '#fff', 1.1);
  },
  e_tower(c) {
    shape(c, c => { c.moveTo(-23, -7); c.lineTo(23, -7); c.lineTo(23, -1); c.quadraticCurveTo(0, 6, -23, -1); c.closePath(); }, '#4b556b');
    shape(c, rr(-18, -66, 36, 62, 3), '#26314d');
    shape(c, poly(-18, -66, -12, -72, 23, -72, 18, -66), '#3c4b72', 1.6);
    shape(c, poly(18, -66, 23, -72, 23, -9, 18, -4), '#1c2440', 1.6);
    const leds = ['#33e0ff', '#7be04a', '#2e8bff'];
    for (let i = 0; i < 6; i++) {
      const y = -61 + i * 9.4;
      shape(c, rr(-14, y, 28, 6.4, 1.2), '#18203a', 1);
      for (let j = 0; j < 3; j++) { c.fillStyle = leds[(i + j) % 3]; c.fillRect(-11.5 + j * 4, y + 2.2, 2.4, 2); }
      c.strokeStyle = 'rgba(160,180,220,.35)'; c.lineWidth = 0.8; c.beginPath(); for (let v = 3; v < 11; v += 2) { c.moveTo(v, y + 1.5); c.lineTo(v, y + 5); } c.stroke();
    }
    shape(c, rr(-8, -15, 16, 6.5, 1.5), '#2e8bff', 1.2);
    line(c, [-4, -11.7, 4, -11.7], '#fff', 1); line(c, [0, -14, 0, -9.4], '#fff', 1);
    line(c, [4, -72, 4, -80], OL, 1.8);
    shape(c, el(4, -84, 9.5, 4.5, -0.4), '#c3cbe0', 1.6);
    shape(c, el(4, -84, 2, 1.2, -0.4), '#7d889e', 0);
    shape(c, el(-8, -75.5, 3.6, 3.6), '#33e0ff', 1.4);
  },
  e_base(c) {
    const g = c.createLinearGradient(0, -80, 0, 0); g.addColorStop(0, '#3a7de0'); g.addColorStop(1, '#1d3f8a');
    shape(c, rr(-52, -80, 104, 80, 4), g);
    shape(c, poly(52, -80, 60, -88, 60, -8, 52, 0), '#16306b', 1.8);
    shape(c, poly(-52, -80, -44, -88, 60, -88, 52, -80), '#5b8fe6', 1.8);
    c.strokeStyle = 'rgba(190,220,255,.35)'; c.lineWidth = 1; c.beginPath();
    for (let x = -39; x <= 40; x += 13) { c.moveTo(x, -77); c.lineTo(x, -38); }
    for (let y = -70; y <= -40; y += 10) { c.moveTo(-50, y); c.lineTo(50, y); }
    c.stroke();
    c.fillStyle = 'rgba(255,240,170,.5)'; for (const [wx, wy] of [[-33, -66], [-7, -56], [19, -66], [32, -46], [-20, -46]]) c.fillRect(wx, wy, 11, 8);
    shape(c, rr(-13, -21, 26, 21, 2), '#0e1a3a', 1.6);
    line(c, [0, -21, 0, 0], '#3a7de0', 1.2);
    shape(c, rr(-43, -36, 86, 13, 3), '#0f1d44', 1.6);
    c.fillStyle = '#e8f1ff'; c.font = '10px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('MICROBLIZZ', 0, -29);
    shape(c, rr(-34, -104, 68, 22, 8), '#7d889e');
    shape(c, rr(-7, -100, 14, 10, 2), '#5a6378', 1.2);
    shape(c, rr(-24, -136, 48, 34, 9), '#9aa5ba');
    line(c, [-14, -136, -18, -146], OL, 1.8); dot(c, -18.5, -147, 2.4, '#ff3348');
    line(c, [14, -136, 17, -143], OL, 1.8); dot(c, 17.2, -144, 2, '#c3cbe0');
    shape(c, rr(-14, -111, 28, 7, 2), '#5a6378', 1.4);
    c.strokeStyle = OL; c.lineWidth = 0.9; c.beginPath(); for (let x = -9; x <= 9; x += 4.5) { c.moveTo(x, -110); c.lineTo(x, -105); } c.stroke();
    shape(c, el(-9, -121, 7.5, 7.5), '#2a0d14', 1.6); shape(c, el(-9, -121, 4.5, 4.5), '#ff3348', 0); dot(c, -10.5, -122.5, 1.3, '#ffd0d4');
    shape(c, rr(3, -127, 15, 12, 2), '#f1e3c6', 1.4);
    line(c, [6, -124, 15, -118], '#b89a6e', 1.2); line(c, [15, -124, 6, -118], '#b89a6e', 1.2);
    c.save(); c.translate(0, -93); c.rotate(-0.12);
    c.strokeStyle = '#ff3348'; c.lineWidth = 1.4; c.strokeRect(-21, -5, 42, 10);
    c.fillStyle = '#ff3348'; c.font = '7.5px ' + FONT_D; c.fillText('CANCELADO', 0, 0.8);
    c.restore();
  },
  p_rubble(c) {
    shape(c, el(0, -3, 23, 8), '#6e4226');
    shape(c, c => { c.moveTo(-18, -4); c.lineTo(-18, -14); c.lineTo(-12, -18); c.lineTo(-7, -12); c.lineTo(-2, -20); c.lineTo(4, -13); c.lineTo(9, -17); c.lineTo(18, -10); c.lineTo(18, -4); c.quadraticCurveTo(0, 4, -18, -4); c.closePath(); }, '#8b5530');
    shape(c, rr(-26, -8, 16, 6, 3), '#a0683a', 1.6); shape(c, el(-26, -5, 2.4, 3), '#d39a5f', 1.2);
    shape(c, rr(9, -6, 18, 6, 3), '#a0683a', 1.6); shape(c, el(27, -3, 2.4, 3), '#d39a5f', 1.2);
    shape(c, poly(-4, 4, 10, 1, 4, 7), '#ff7a1a', 1.4);
  },
  e_rubble(c) {
    shape(c, el(0, -3, 23, 8), '#4b556b');
    shape(c, poly(-16, -3, -16, -22, -8, -26, -2, -18, 4, -24, 10, -16, 16, -20, 16, -3), '#26314d');
    shape(c, rr(4, -10, 19, 8, 2), '#3c4b72', 1.6);
    shape(c, el(-18, -4, 8, 3.5, 0.3), '#c3cbe0', 1.4);
    c.fillStyle = '#33e0ff'; c.fillRect(-10, -15, 2.4, 2); c.fillStyle = '#7be04a'; c.fillRect(-5, -12, 2.4, 2);
  },
  /* ---------- bots nuevos de Microblizz ---------- */
  cajabotin(c) {
    shape(c, el(-17.5, -5, 2.6, 2.6), '#ffcb3d', 1.1); shape(c, el(18, -4, 2.6, 2.6), '#ffcb3d', 1.1);
    shape(c, rr(-15, -21, 30, 18, 3), '#2e5bb8');
    c.strokeStyle = '#1d3f8a'; c.lineWidth = 1; c.beginPath(); for (const xx of [-8, 8]) { c.moveTo(xx, -20); c.lineTo(xx, -4); } c.stroke();
    line(c, [-15, -12, 15, -12], '#ffcb3d', 2);
    shape(c, rr(-3.6, -16, 7.2, 8, 1.5), '#ffcb3d', 1.3); txt(c, '?', 0, -11.6, 6.4, '#1d3f8a');
    shape(c, c => { c.moveTo(-14, -21); c.lineTo(14, -21); c.lineTo(13, -26); c.lineTo(-13, -26); c.closePath(); }, '#2a0d14', 0);
    for (let i = -12.5; i < 12; i += 5) { shape(c, poly(i, -21.4, i + 2.5, -24.6, i + 5, -21.4), '#fff', 1); shape(c, poly(i, -26, i + 2.5, -22.8, i + 5, -26), '#fff', 1); }
    shape(c, c => { c.moveTo(-16, -26); c.quadraticCurveTo(-15, -40, 0, -40.5); c.quadraticCurveTo(15, -40, 16, -26); c.closePath(); }, '#3a7de0');
    line(c, [-16, -26.5, 16, -26.5], '#ffcb3d', 2.4);
    shape(c, el(-5.2, -33, 3.2, 3.4), '#fff', 1.2); shape(c, el(5.2, -33, 3.2, 3.4), '#fff', 1.2);
    dot(c, -4.4, -32.6, 1.6, '#ff3348'); dot(c, 6, -32.6, 1.6, '#ff3348');
    line(c, [-8.6, -37.4, -2.6, -35.6], OL, 1.4); line(c, [8.6, -37.4, 2.6, -35.6], OL, 1.4);
  },
  soportebot(c) {
    shape(c, c => { rrPath(c, 10, -46, 17, 10, 3); }, '#fff', 1.4); shape(c, poly(13, -36.5, 12, -33, 16.5, -36.5), '#fff', 1.2);
    txt(c, '¿OFF/ON?', 18.5, -40.8, 3.6, '#1d3f8a');
    line(c, [9, -19, 15, -15], OL, 2.8); line(c, [9, -19, 15, -15], '#aab4c4', 1.4);
    shape(c, c => { c.moveTo(14, -18); c.lineTo(18, -17); c.lineTo(17, -15); c.lineTo(19, -13); c.lineTo(17, -11.4); c.lineTo(15, -14); c.closePath(); }, '#d1d5db', 1.1);
    line(c, [-9, -19, -14, -14], OL, 2.8); line(c, [-9, -19, -14, -14], '#aab4c4', 1.4); shape(c, el(-14.6, -13.4, 2.2, 2.2), '#7be04a', 1.1);
    shape(c, el(0, -18, 11, 10.5), '#4d6496');
    shape(c, el(0, -17.5, 6.2, 6.2), '#33e0ff', 1.3);
    c.beginPath(); c.arc(0, -17, 3.2, -Math.PI / 2 + 0.7, -Math.PI / 2 - 0.7 + Math.PI * 2); c.strokeStyle = '#1d3f8a'; c.lineWidth = 1.5; c.stroke(); line(c, [0, -21.4, 0, -17.6], '#1d3f8a', 1.5);
    shape(c, el(0, -33, 8.6, 7.6), '#aab4c4');
    shape(c, rr(-6.4, -36, 12.8, 6.4, 2), '#1b4fc4', 1.3);
    line(c, [-4.4, -33.4, -1.6, -33.4], '#e8f1ff', 1.3); line(c, [1.6, -33.4, 4.4, -33.4], '#e8f1ff', 1.3);
    c.beginPath(); c.arc(0, -34, 9.6, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = OL; c.lineWidth = 3.2; c.stroke(); c.strokeStyle = '#1f2937'; c.lineWidth = 1.8; c.stroke();
    shape(c, rr(-11.4, -37, 4, 6.4, 1.6), '#1f2937', 1.2); shape(c, rr(7.4, -37, 4, 6.4, 1.6), '#1f2937', 1.2);
    c.beginPath(); c.moveTo(9.4, -31); c.quadraticCurveTo(8, -27, 3.4, -28); c.strokeStyle = OL; c.lineWidth = 1.4; c.stroke(); dot(c, 3, -28, 1.2, '#ff3348');
  },
  parchebot(c) {
    shape(c, el(-20, -24, 5.8, 10.5, 0.2), '#5b6578'); shape(c, el(20, -24, 5.8, 10.5, -0.2), '#5b6578');
    shape(c, el(-21.5, -13.6, 4.6, 4.2), '#7d889e', 1.5); shape(c, el(21.5, -13.6, 4.6, 4.2), '#7d889e', 1.5);
    shape(c, rr(-17, -41, 34, 37, 7), '#7d889e');
    shape(c, rr(-11, -34, 22, 13, 3), '#1b4fc4', 1.4); txt(c, '80 GB', 0, -27.4, 6.4, '#e8f1ff');
    c.fillStyle = 'rgba(232,241,255,.35)'; c.fillRect(-9, -22.6, 18 * 0.62, 1.6);
    for (const [bx, by, br] of [[-9, -12, -0.5], [10, -37, 0.6], [9, -9, 0.3]]) {
      c.save(); c.translate(bx, by); c.rotate(br); shape(c, rr(-7, -2.4, 14, 4.8, 2.4), '#f2c9a0', 1.2); shape(c, rr(-2.4, -2.4, 4.8, 4.8, 0.8), '#e3b088', 0); dot(c, -1, -0.8, 0.5, '#c99766'); dot(c, 1, 0.8, 0.5, '#c99766'); c.restore();
    }
    shape(c, rr(-10, -55, 20, 15, 4), '#9aa5ba');
    shape(c, rr(-7, -51, 14, 6, 2), '#2a0d14', 1.2);
    for (let i = 0; i < 3; i++) dot(c, -3.6 + i * 3.6, -48, 1.2, '#ff3348');
    line(c, [4, -55, 6, -62], OL, 1.6); shape(c, el(6.2, -63, 2.4, 2.4), '#ffcb3d', 1.1);
  },
  /* ---------- edificios de las facciones nuevas ---------- */
  s_tower(c) {
    shape(c, c => { c.moveTo(-18, -28); c.lineTo(18, -28); c.lineTo(19.5, -2); c.quadraticCurveTo(0, 5, -19.5, -2); c.closePath(); }, '#4c1d95');
    shape(c, el(0, -15, 9.5, 9.5), '#2b2d3a', 1.6); shape(c, el(0, -15, 4.4, 4.4), '#6d28d9', 1.3); dot(c, 0, -15, 1.5, '#c4b5fd');
    shape(c, el(-12.5, -6, 3, 3), '#2b2d3a', 1.2); shape(c, el(12.5, -6, 3, 3), '#2b2d3a', 1.2);
    c.beginPath(); c.moveTo(-19, -3); c.quadraticCurveTo(0, 3.6, 19, -3); c.strokeStyle = '#22e3ff'; c.lineWidth = 1.8; c.stroke();
    shape(c, el(0, -28, 18, 4.8), '#6d28d9');
    line(c, [-8, -28, -14, -36], OL, 3.4); line(c, [8, -28, 14, -36], OL, 3.4); line(c, [-8, -28, -14, -36], '#9ca3af', 1.6); line(c, [8, -28, 14, -36], '#9ca3af', 1.6);
    line(c, [0, -29, 0, -56], OL, 4.6); line(c, [0, -29, 0, -56], '#9ca3af', 2.6);
    c.beginPath(); c.arc(0, -70, 16, 0, Math.PI * 2); c.strokeStyle = OL; c.lineWidth = 9.4; c.stroke(); c.strokeStyle = '#f5d0fe'; c.lineWidth = 6.2; c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 2.6; c.stroke();
    line(c, [0, -54, 0, -62], OL, 2.4);
    shape(c, rr(-4.6, -78, 9.2, 16, 2), '#111827', 1.5); shape(c, rr(-3.4, -76.6, 6.8, 12.8, 1.2), '#a855f7', 0);
    shape(c, c => heartPath(c, 0, -70, 2.2), '#fff', 0); dot(c, 2.2, -75, 0.9, '#ff3348');
  },
  s_base(c) {
    shape(c, rr(-52, -9, 104, 11, 4), '#2b2d3a');
    shape(c, rr(-45, -62, 90, 55, 6), '#6d28d9');
    c.strokeStyle = '#7c3aed'; c.lineWidth = 1.2; c.beginPath(); for (let y = -54; y < -10; y += 8) { c.moveTo(-43, y); c.lineTo(43, y); } c.stroke();
    line(c, [-44, -14, 44, -14], '#ff3df0', 2); line(c, [-44, -58, 44, -58], '#22e3ff', 2);
    shape(c, c => { c.moveTo(-12, -7); c.lineTo(-12, -28); c.arc(0, -28, 12, Math.PI, 0); c.lineTo(12, -7); c.closePath(); }, '#1a1022', 1.8);
    shape(c, c => { c.moveTo(-8, -7); c.lineTo(-8, -27); c.arc(0, -27, 8, Math.PI, 0); c.lineTo(8, -7); c.closePath(); }, '#3b1d6e', 0);
    for (const wx of [-30, 30]) { shape(c, rr(wx - 9, -46, 18, 13, 2.4), '#111827', 1.5); shape(c, c => heartPath(c, wx, -39.6, 3), wx < 0 ? '#f472b6' : '#22e3ff', 0); }
    shape(c, rr(-6, -68, 12, 8, 1.6), '#2b2d3a', 1.4);
    shape(c, rr(-38, -106, 76, 40, 5), '#111827');
    const g = c.createLinearGradient(0, -102, 0, -70); g.addColorStop(0, '#7c3aed'); g.addColorStop(1, '#22d3ee');
    shape(c, rr(-34, -102, 68, 32, 3), g, 1.4);
    shape(c, rr(-31, -99, 16, 7, 2), '#ff3348', 1.2); txt(c, 'LIVE', -23, -95.2, 5.6, '#fff');
    for (const [yy, w] of [[-88, 22], [-82, 30], [-76, 18]]) { shape(c, rr(6, yy - 2, w, 4.2, 2), 'rgba(255,255,255,.85)', 0); dot(c, 3, yy, 1.8, '#ffe14d'); }
    shape(c, c => heartPath(c, -22, -80, 6), '#f472b6', 1.4);
    shape(c, c => heartPath(c, -11, -86, 3.4), '#fde68a', 1.1);
  },
  h_tower(c) {
    shape(c, rr(-19, -9, 38, 9, 2), '#d6d3cb');
    shape(c, rr(-16, -15, 32, 7, 2), '#e7e5df');
    shape(c, rr(-11, -74, 22, 60, 2), '#f5f3ee');
    c.strokeStyle = '#cfcac0'; c.lineWidth = 1.4; c.beginPath(); for (const xx of [-6, -1.5, 3, 7.5]) { c.moveTo(xx, -72); c.lineTo(xx, -16); } c.stroke();
    shape(c, rr(-11, -74, 22, 60, 2), null, 2.2);
    shape(c, rr(-17, -82, 34, 8, 3), '#f5f3ee');
    for (const sx of [-1, 1]) { shape(c, el(sx * 15, -76, 4.2, 4.2), '#f5f3ee', 1.6); c.beginPath(); c.arc(sx * 15, -76, 1.8, 0, Math.PI * 1.6); c.strokeStyle = OL; c.lineWidth = 1; c.stroke(); }
    shape(c, c => { c.moveTo(-14, -83); c.lineTo(14, -83); c.lineTo(10, -91); c.lineTo(-10, -91); c.closePath(); }, '#ffcb3d', 1.6);
    line(c, [-12, -87, 12, -87], '#ca8a04', 1.2);
    shape(c, c => { c.moveTo(-8, -91); c.quadraticCurveTo(-11, -98, -4, -104); c.quadraticCurveTo(-3, -98, 0, -97); c.quadraticCurveTo(0, -105, 5, -108); c.quadraticCurveTo(4, -100, 8, -97); c.quadraticCurveTo(11, -94, 8, -91); c.closePath(); }, '#ff9f1c', 1.6);
    shape(c, c => { c.moveTo(-4, -91); c.quadraticCurveTo(-5, -97, 0, -100); c.quadraticCurveTo(1, -96, 4, -94); c.quadraticCurveTo(5.4, -92, 4, -91); c.closePath(); }, '#ffe8a3', 0);
    shape(c, el(-12, -2, 6, 3), '#6aa83a', 1.2); shape(c, el(13, -2, 6.6, 3), '#6aa83a', 1.2);
  },
  h_base(c) {
    shape(c, rr(-58, -10, 116, 11, 2), '#cfcac0');
    shape(c, rr(-52, -17, 104, 8, 2), '#e7e5df');
    shape(c, rr(-44, -62, 88, 46, 2), '#b9b2a4');
    shape(c, c => { c.moveTo(-12, -17); c.lineTo(-12, -40); c.arc(0, -40, 12, Math.PI, 0); c.lineTo(12, -17); c.closePath(); }, '#2a1a10', 1.6);
    shape(c, c => { c.moveTo(-8, -17); c.lineTo(-8, -39); c.arc(0, -39, 8, Math.PI, 0); c.lineTo(8, -17); c.closePath(); }, '#ff9f1c', 0);
    shape(c, c => { c.moveTo(-5, -17); c.lineTo(-5, -34); c.arc(0, -34, 5, Math.PI, 0); c.lineTo(5, -17); c.closePath(); }, '#ffe8a3', 0);
    for (const cx of [-42, -26, 26, 42]) {
      shape(c, rr(cx - 5.5, -64, 11, 47, 1.5), '#f5f3ee');
      c.strokeStyle = '#cfcac0'; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - 2, -62); c.lineTo(cx - 2, -19); c.moveTo(cx + 2, -62); c.lineTo(cx + 2, -19); c.stroke();
      shape(c, rr(cx - 5.5, -64, 11, 47, 1.5), null, 1.8);
      shape(c, rr(cx - 7.5, -67, 15, 4, 1.4), '#f5f3ee', 1.5);
    }
    shape(c, rr(-54, -76, 108, 10, 2), '#f5f3ee');
    c.fillStyle = '#ffcb3d'; for (let x = -50; x < 50; x += 8) c.fillRect(x, -72.6, 4, 3);
    shape(c, poly(-58, -76, 0, -102, 58, -76), '#f5f3ee', 2.2);
    shape(c, poly(-44, -79, 0, -97, 44, -79), '#e7e5df', 0);
    shape(c, c => starPath(c, 0, -86, 7, 3), '#ffcb3d', 1.4);
    shape(c, el(0, -104, 5, 4), '#ffcb3d', 1.4);
    shape(c, poly(-4, -106, -13, -112, -8, -104), '#ffcb3d', 1.3); shape(c, poly(4, -106, 13, -112, 8, -104), '#ffcb3d', 1.3);
    shape(c, el(0, -110, 3.4, 3.4), '#ffcb3d', 1.3);
    for (const sx of [-1, 1]) { shape(c, el(sx * 54, -6, 6, 3), '#6aa83a', 1.2); }
  },
  c_tower(c) {
    shape(c, c => { c.moveTo(-21, -2); c.lineTo(-16, -30); c.lineTo(16, -30); c.lineTo(21, -2); c.quadraticCurveTo(0, 5, -21, -2); c.closePath(); }, '#374151');
    c.strokeStyle = '#22e3ff'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-12, -6); c.lineTo(-10, -18); c.lineTo(-4, -22); c.moveTo(12, -6); c.lineTo(10, -16); c.lineTo(4, -20); c.stroke();
    dot(c, -4, -22, 1.6, '#22e3ff'); dot(c, 4, -20, 1.6, '#22e3ff');
    shape(c, rr(-7, -21, 14, 9, 2), '#1f2937', 1.4); dot(c, -2.4, -16.4, 1.2, '#ff3df0'); dot(c, 2.4, -16.4, 1.2, '#7be04a');
    shape(c, rr(-9, -46, 18, 17, 2), '#4b5563');
    line(c, [-9, -37, 9, -37], '#ff3df0', 1.4);
    shape(c, el(0, -46, 15, 4.6), '#1f2937', 1.6);
    shape(c, rr(-14, -64, 28, 18, 7), '#6b7280');
    shape(c, rr(10, -61, 22, 6.4, 2), '#374151', 1.5); shape(c, rr(30, -62, 4, 8.4, 1.2), '#1f2937', 1.3);
    line(c, [12, -57.8, 29, -57.8], '#22e3ff', 1.2);
    shape(c, el(-4, -55, 5.4, 5.4), '#111827', 1.4); dot(c, -3.4, -55, 2.8, '#22e3ff'); dot(c, -4.4, -56, 0.9, '#fff');
    line(c, [-8, -64, -10, -77], OL, 1.8); dot(c, -10.2, -77.6, 2.2, '#ff3df0');
  },
  c_base(c) {
    shape(c, rr(-60, -8, 120, 10, 3), '#1f2937');
    shape(c, c => { c.moveTo(-56, -6); c.lineTo(-56, -26); c.quadraticCurveTo(-54, -72, 0, -74); c.quadraticCurveTo(54, -72, 56, -26); c.lineTo(56, -6); c.closePath(); }, '#4b5563');
    c.save(); c.beginPath(); c.moveTo(-56, -6); c.lineTo(-56, -26); c.quadraticCurveTo(-54, -72, 0, -74); c.quadraticCurveTo(54, -72, 56, -26); c.lineTo(56, -6); c.closePath(); c.clip();
    c.strokeStyle = '#374151'; c.lineWidth = 1.4; c.beginPath(); for (let y = -66; y < -6; y += 10) { c.moveTo(-60, y); c.lineTo(60, y); } for (const xx of [-36, -18, 18, 36]) { c.moveTo(xx, -80); c.lineTo(xx, 0); } c.stroke();
    c.restore();
    c.beginPath(); c.moveTo(-50, -24); c.quadraticCurveTo(-48, -64, 0, -66); c.quadraticCurveTo(48, -64, 50, -24); c.strokeStyle = '#22e3ff'; c.lineWidth = 2; c.stroke();
    shape(c, rr(-17, -38, 34, 32, 3), '#1f2937', 2);
    c.save(); c.beginPath(); c.rect(-14, -35, 28, 26); c.clip(); c.fillStyle = '#ffcb3d'; c.fillRect(-14, -35, 28, 26); c.fillStyle = '#1f2937'; for (let i = -40; i < 20; i += 8) { c.beginPath(); c.moveTo(i, -9); c.lineTo(i + 14, -35); c.lineTo(i + 18, -35); c.lineTo(i + 4, -9); c.closePath(); c.fill(); } c.restore();
    shape(c, rr(-14, -35, 28, 26, 2), null, 1.6);
    shape(c, rr(-36, -58, 72, 12, 3), '#111827', 1.6);
    txt(c, 'BÚNKER', 0, -51.6, 8, '#ff3df0');
    for (const wx of [-40, 40]) { shape(c, rr(wx - 6, -36, 12, 8, 2), '#111827', 1.4); line(c, [wx - 4, -32, wx + 4, -32], '#22e3ff', 1.6); }
    line(c, [-20, -72, -22, -104], OL, 2.4); line(c, [-20, -72, -22, -104], '#9ca3af', 1.2); dot(c, -22, -105, 2.6, '#ff3df0');
    line(c, [18, -73, 22, -84], OL, 2.6);
    shape(c, c => { c.moveTo(10, -92); c.quadraticCurveTo(22, -78, 36, -86); c.quadraticCurveTo(26, -90, 10, -92); c.closePath(); }, '#d1d5db', 1.6);
    line(c, [22, -86, 28, -94], OL, 1.4); dot(c, 28.4, -94.6, 1.6, '#22e3ff');
  },
  m_tower(c) {
    shape(c, rr(-20, -30, 40, 29, 4), '#e7dcc4');
    shape(c, rr(-15, -26, 30, 19, 3), '#1e3a8a', 1.4);
    dot(c, -5, -20, 1.6, '#ffe14d'); dot(c, 5, -20, 1.6, '#ffe14d'); c.beginPath(); c.arc(0, -16, 4.4, 0.2, Math.PI - 0.2); c.strokeStyle = '#ffe14d'; c.lineWidth = 1.6; c.stroke();
    dot(c, 15.5, -4.5, 1.2, '#7be04a');
    shape(c, rr(-16, -54, 32, 25, 4), '#c4b5fd');
    shape(c, rr(-12, -50.5, 24, 17.5, 3), '#111827', 1.4);
    txt(c, 'XD', 0, -41.6, 9, '#7be04a');
    shape(c, rr(-13, -74, 26, 21, 4), '#fda4af');
    shape(c, rr(-9.5, -71, 19, 15, 3), '#ffe14d', 1.4);
    c.beginPath(); c.arc(-3.6, -65.6, 1.8, Math.PI * 1.1, Math.PI * 1.9); c.moveTo(5.4, -65.6); c.arc(3.6, -65.6, 1.8, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = OL; c.lineWidth = 1.2; c.stroke();
    shape(c, c => { c.moveTo(-5, -62.6); c.quadraticCurveTo(0, -56, 5, -62.6); c.closePath(); }, '#5a1530', 1);
    shape(c, el(-8, -64, 1.4, 2.2), '#60a5fa', 0.8); shape(c, el(8, -64, 1.4, 2.2), '#60a5fa', 0.8);
    shape(c, poly(-7, -74, 0, -90, 7, -74), '#22e3ff', 1.6);
    line(c, [-4, -79, 4, -78], '#ff3df0', 1.4); line(c, [-2, -84, 2.6, -83.4], '#ffe14d', 1.4);
    dot(c, 0, -90.6, 2.4, '#ff3df0');
  },
  m_base(c) {
    shape(c, rr(-54, -9, 108, 11, 4), '#9ca3af');
    shape(c, rr(-46, -70, 92, 63, 6), '#e7dcc4');
    shape(c, rr(-38, -62, 34, 5, 1.5), '#9ca3af', 1.3); shape(c, rr(-38, -54, 34, 5, 1.5), '#9ca3af', 1.3);
    line(c, [-34, -59.5, -10, -59.5], OL, 1.2);
    shape(c, el(30, -58, 5, 5), '#d1d5db', 1.5); dot(c, 30, -58, 2, '#7be04a');
    c.strokeStyle = '#b9ac90'; c.lineWidth = 1.4; c.beginPath(); for (let y = -44; y < -14; y += 5) { c.moveTo(20, y); c.lineTo(40, y); } c.stroke();
    shape(c, c => { c.moveTo(-14, -7); c.lineTo(-14, -30); c.arc(0, -30, 14, Math.PI, 0); c.lineTo(14, -7); c.closePath(); }, '#6d28d9', 1.8);
    shape(c, rr(-10, -24, 20, 17, 2), '#a78bfa', 1.2); dot(c, 6, -15, 1.4, '#ffe14d');
    shape(c, el(-30, -30, 8, 8), '#ffe14d', 1.6); dot(c, -32.6, -32, 1.2, OL); dot(c, -27.4, -32, 1.2, OL); c.beginPath(); c.arc(-30, -29, 4, 0.2, Math.PI - 0.2); c.closePath(); c.fillStyle = '#5a1530'; c.fill(); c.strokeStyle = OL; c.lineWidth = 1; c.stroke();
    shape(c, c => { rrPath(c, -34, -110, 68, 30, 12); }, '#fff', 2);
    shape(c, poly(-6, -81, -12, -70, 4, -81), '#fff', 0); line(c, [-6, -81, -12, -70, 4, -81.4], OL, 2);
    txt(c, 'LOL', 0, -94, 18, '#7c3aed');
    shape(c, poly(36, -64, 36, -86, 50, -74, 43, -73, 47, -66, 44, -64.6, 40.4, -71.4), '#fff', 1.6);
  },
  /* ---------- v0.9.13: Olvidados (los juegos cancelados del sótano de Microblizz) ---------- */
  vikingo(c) {
    shape(c, el(-15, -25, 11, 12), '#a8672f');
    c.save(); c.beginPath(); c.ellipse(-15, -25, 11, 12, 0, 0, Math.PI * 2); c.clip(); c.strokeStyle = '#7c4a1e'; c.lineWidth = 1.2; c.beginPath(); for (const xx of [-22, -17.5, -13, -8.5]) { c.moveTo(xx, -38); c.lineTo(xx, -12); } c.stroke(); c.restore();
    c.beginPath(); c.ellipse(-15, -25, 9.6, 10.6, 0, 0, Math.PI * 2); c.strokeStyle = '#9ca3af'; c.lineWidth = 2; c.stroke();
    shape(c, el(-15, -25, 3.4, 3.6), '#d1d5db', 1.3);
    line(c, [13, -8, 19, -46], OL, 4.4); line(c, [13, -8, 19, -46], '#8a5a33', 2.4);
    c.save(); c.translate(18.6, -42); c.rotate(0.15);
    shape(c, c => { c.moveTo(0, -4); c.quadraticCurveTo(12, -9, 13, 2); c.quadraticCurveTo(8, 6, 0, 3); c.closePath(); }, '#d1d5db', 1.6);
    line(c, [3, -2, 10, -3], '#9ca3af', 1);
    c.restore();
    shape(c, c => { c.moveTo(-13, -34); c.quadraticCurveTo(-18, -18, -14, -4); c.quadraticCurveTo(0, 1, 14, -4); c.quadraticCurveTo(18, -18, 13, -34); c.quadraticCurveTo(0, -39, -13, -34); c.closePath(); }, '#7c4a1e');
    shape(c, c => { c.moveTo(-14, -33); c.quadraticCurveTo(0, -27, 14, -33); c.quadraticCurveTo(12, -39, 0, -39); c.quadraticCurveTo(-12, -39, -14, -33); c.closePath(); }, '#d6c4a8', 1.6);
    shape(c, rr(-14, -14, 28, 4.6, 1.6), '#3b2a1e', 1.4); shape(c, rr(-3, -15, 6, 6.4, 1.2), '#ffcb3d', 1.2);
    shape(c, el(14, -22, 4.6, 8, -0.4), '#7c4a1e'); shape(c, el(15.5, -16, 3.8, 3.8), '#f2c29b', 1.4);
    shape(c, el(1, -44, 10.5, 10), '#f2c29b');
    shape(c, c => { c.moveTo(-9, -44); c.quadraticCurveTo(-11, -30, -4, -26); c.lineTo(-1, -21); c.lineTo(2, -26); c.quadraticCurveTo(11, -30, 11, -44); c.quadraticCurveTo(6, -37, 1, -38); c.quadraticCurveTo(-4, -37, -9, -44); c.closePath(); }, '#e2572b', 1.6);
    line(c, [-1, -32, -1, -25], '#b8401c', 1); line(c, [4, -33, 3.6, -27], '#b8401c', 1);
    shape(c, el(3.6, -42, 3, 2.6), '#e8a07a', 1.2);
    dot(c, -2, -45.5, 1.4, OL); dot(c, 6.8, -45.5, 1.4, OL);
    line(c, [-4.6, -48.6, -0.6, -47.6], OL, 1.6); line(c, [9, -48.6, 5, -47.6], OL, 1.6);
    shape(c, c => { c.moveTo(-3, -38.6); c.quadraticCurveTo(3.6, -41, 10, -38.6); c.quadraticCurveTo(3.6, -37, -3, -38.6); c.closePath(); }, '#e2572b', 1.1);
    shape(c, c => { c.moveTo(-10, -47); c.quadraticCurveTo(-10, -59, 1, -59); c.quadraticCurveTo(12, -59, 12, -47); c.closePath(); }, '#aab4c4', 1.8);
    line(c, [-10, -47.4, 12, -47.4], '#7d889e', 2); line(c, [1, -59, 1, -48], '#7d889e', 1.2);
    shape(c, c => { c.moveTo(-8, -53); c.quadraticCurveTo(-17, -54, -18, -63); c.quadraticCurveTo(-13, -59, -9, -58); c.closePath(); }, '#f5f0dc', 1.5);
    shape(c, c => { c.moveTo(10, -53); c.quadraticCurveTo(19, -54, 20, -63); c.quadraticCurveTo(15, -59, 11, -58); c.closePath(); }, '#f5f0dc', 1.5);
  },
  vikingsquad(c) {
    line(c, [9, -10, 16, -30], OL, 3.6); line(c, [9, -10, 16, -30], '#e5e7eb', 1.8); line(c, [7, -13, 12, -11], OL, 2.6); line(c, [7, -13, 12, -11], '#8a5a33', 1.2);
    shape(c, c => { c.moveTo(-8, -20); c.quadraticCurveTo(-11, -10, -9, -3); c.quadraticCurveTo(0, 0, 9, -3); c.quadraticCurveTo(11, -10, 8, -20); c.quadraticCurveTo(0, -23, -8, -20); c.closePath(); }, '#3b5b8a');
    shape(c, rr(-9, -9, 18, 3.4, 1.2), '#3b2a1e', 1.2);
    shape(c, el(9.5, -11.5, 2.8, 2.8), '#f2c29b', 1.3);
    shape(c, el(-8, -12, 7, 7.4), '#c2410c');
    c.beginPath(); c.ellipse(-8, -12, 5.6, 6, 0, 0, Math.PI * 2); c.strokeStyle = '#fcd34d'; c.lineWidth = 1.4; c.stroke(); dot(c, -8, -12, 1.8, '#fcd34d');
    shape(c, el(1, -26, 7.2, 6.8), '#f2c29b');
    shape(c, c => { c.moveTo(-6, -26); c.quadraticCurveTo(-7, -16, 1, -14); c.quadraticCurveTo(9, -16, 8, -26); c.quadraticCurveTo(4, -21.6, 1, -22.4); c.quadraticCurveTo(-2, -21.6, -6, -26); c.closePath(); }, '#f2c94c', 1.4);
    dot(c, -1.4, -27.6, 1.1, OL); dot(c, 4.6, -27.6, 1.1, OL); shape(c, el(2, -24.6, 2, 1.6), '#e8a07a', 1);
    shape(c, c => { c.moveTo(-6.6, -28.6); c.quadraticCurveTo(-6.6, -37, 1, -37); c.quadraticCurveTo(8.6, -37, 8.6, -28.6); c.closePath(); }, '#aab4c4', 1.6);
    line(c, [-6.6, -28.8, 8.6, -28.8], '#7d889e', 1.6);
    shape(c, c => { c.moveTo(-5, -32); c.quadraticCurveTo(-11, -32, -12, -39); c.quadraticCurveTo(-8.6, -36.4, -5.6, -36); c.closePath(); }, '#f5f0dc', 1.2);
    shape(c, c => { c.moveTo(7, -32); c.quadraticCurveTo(13, -32, 14, -39); c.quadraticCurveTo(10.6, -36.4, 7.6, -36); c.closePath(); }, '#f5f0dc', 1.2);
  },
  swarmbug(c) {
    c.strokeStyle = OL; c.lineWidth = 2.2; c.lineCap = 'round';
    for (const [x0, x1] of [[-7, -12], [-1, -4], [5, 4]]) { c.beginPath(); c.moveTo(x0, -7); c.lineTo(x1, -1); c.stroke(); }
    shape(c, el(-5, -10, 8, 6.4, -0.15), '#6d28d9');
    line(c, [-9, -14.6, -7.4, -6], '#8b5cf6', 1.2); line(c, [-4.4, -15.8, -3, -5], '#8b5cf6', 1.2);
    shape(c, el(4, -11, 5.6, 5.2), '#7c3aed');
    shape(c, el(9, -12.5, 4.6, 4.2), '#8b5cf6');
    shape(c, c => { c.moveTo(12, -11); c.quadraticCurveTo(17, -12, 16, -7); c.quadraticCurveTo(14.6, -9.4, 12, -9.6); c.closePath(); }, '#f5f0dc', 1.1);
    dot(c, 10, -14, 1.5, '#a3ff7a'); dot(c, 12.2, -13, 1.1, '#a3ff7a');
    shape(c, poly(-9, -15, -7, -21, -4, -16), '#c4b5fd', 1.2); shape(c, poly(-3, -16, 0, -22, 2, -15.6), '#c4b5fd', 1.2);
    line(c, [9, -16, 7, -21], OL, 1.2); line(c, [11, -16, 12, -21], OL, 1.2);
  },
  retromarine(c) {
    shape(c, rr(-15, -36, 8, 22, 2.4), '#365314');
    shape(c, rr(-10, -32, 20, 27, 5), '#4d7c0f');
    shape(c, rr(-7, -28, 14, 10, 3), '#65a30d', 1.3);
    line(c, [-6, -23, 6, -23], '#a3e635', 1.2);
    shape(c, rr(-10, -9, 20, 4.4, 1.6), '#365314', 1.3);
    shape(c, el(-11, -30, 6.6, 5.4, -0.2), '#65a30d'); shape(c, el(11, -30, 6.6, 5.4, 0.2), '#65a30d');
    shape(c, rr(2, -22, 22, 6, 2), '#374151');
    shape(c, rr(22, -21, 6, 3.6, 1), '#1f2937', 1.2);
    shape(c, rr(8, -17, 4, 6, 1), '#1f2937', 1.2);
    dot(c, 18, -19, 1.1, '#fb923c');
    shape(c, el(4, -18, 3.6, 3.6), '#4d7c0f', 1.3);
    shape(c, rr(-8.5, -47, 17, 16, 7), '#4d7c0f');
    shape(c, rr(-2, -43, 11, 6.4, 3), '#fb923c', 1.4);
    line(c, [0, -41, 7, -41], 'rgba(255,255,255,.8)', 1.1);
    line(c, [-5, -47, -7, -52], OL, 1.6); dot(c, -7.2, -52.6, 1.8, '#a3e635');
  },
  ghostagent(c) {
    shape(c, rr(0, -23, 30, 3.6, 1.4), '#1f2937');
    shape(c, rr(8, -27, 9, 4, 1.4), '#374151', 1.2); dot(c, 16, -25, 1.2, '#22e3ff');
    shape(c, rr(4, -21, 4, 6, 1), '#1f2937', 1.2);
    shape(c, c => { c.moveTo(-8, -32); c.quadraticCurveTo(-14, -16, -12, -3); c.quadraticCurveTo(0, 0, 10, -3); c.quadraticCurveTo(11, -18, 8, -32); c.quadraticCurveTo(0, -35, -8, -32); c.closePath(); }, '#374151');
    line(c, [-3, -30, -5, -5], '#4b5563', 1.4);
    shape(c, rr(-8.4, -14, 17, 3.4, 1.2), '#111827', 1.2);
    shape(c, el(6, -20, 3, 3), '#4b5563', 1.3);
    shape(c, c => { c.moveTo(-9, -32); c.quadraticCurveTo(-11, -46, 0, -46); c.quadraticCurveTo(10, -46, 9, -32); c.quadraticCurveTo(0, -29, -9, -32); c.closePath(); }, '#4b5563');
    shape(c, el(1.4, -36.5, 6.4, 6), '#1f2937', 1.3);
    shape(c, rr(-2.6, -39.4, 10.4, 4.4, 2), '#0e7490', 1.2);
    dot(c, 0.4, -37.2, 1.4, '#22e3ff'); dot(c, 5, -37.2, 1.4, '#22e3ff');
    line(c, [-1, -40.6, 6.6, -40.6], 'rgba(255,255,255,.5)', 0.8);
  },
  rockracer(c) {
    line(c, [-15, -14, -18, -24], OL, 2.6); shape(c, rr(-24, -27, 12, 4, 1.4), '#dc2626', 1.4);
    shape(c, c => { c.moveTo(-20, -6); c.lineTo(-20, -14); c.quadraticCurveTo(-12, -18, -4, -17); c.lineTo(4, -21); c.quadraticCurveTo(10, -21, 13, -15); c.lineTo(22, -12); c.quadraticCurveTo(25, -9, 22, -6); c.closePath(); }, '#dc2626');
    line(c, [-19, -11, 21, -9], '#fff', 2.2);
    shape(c, el(3, -20, 5.6, 5), '#fcd34d', 1.4);
    shape(c, rr(2, -22, 6, 3, 1.2), '#1f2937', 1);
    shape(c, rr(-12, -24, 13, 5.6, 2), '#4b5563', 1.4);
    shape(c, poly(1, -24, 6, -21.2, 1, -18.4), '#ff8a1f', 1.1);
    for (const wx of [-12, 13]) { shape(c, el(wx, -6, 6, 6), '#1f2937', 1.8); shape(c, el(wx, -6, 2.6, 2.6), '#9ca3af', 1); }
    shape(c, el(-8, -12.5, 3.4, 3), '#fff', 1); txt(c, '7', -8, -12.3, 4.4, OL);
    shape(c, poly(-20, -9, -26, -11, -24, -8, -27, -6, -20, -7), '#ffb347', 1);
  },
  titanbeta(c) {
    shape(c, rr(-15, -16, 11, 15, 3), '#57534e'); shape(c, rr(4, -16, 11, 15, 3), '#57534e');
    shape(c, rr(-21, -52, 42, 40, 8), '#78716c');
    c.strokeStyle = '#57534e'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-21, -38); c.lineTo(-8, -38); c.lineTo(-8, -52); c.moveTo(6, -52); c.lineTo(6, -30); c.lineTo(21, -30); c.moveTo(-21, -22); c.lineTo(4, -22); c.stroke();
    c.beginPath(); c.moveTo(-2, -48); c.lineTo(2, -42); c.lineTo(-1, -37); c.lineTo(3, -31); c.strokeStyle = '#ffb347'; c.lineWidth = 1.8; c.stroke();
    c.save(); c.translate(-10, -29); c.rotate(-0.18); shape(c, rr(-9.5, -4.4, 19, 8.8, 1.6), '#ffe14d', 1.4); txt(c, 'BETA', 0, 0.4, 6.4, '#b91c1c'); c.restore();
    shape(c, rr(-30, -50, 11, 30, 5), '#78716c'); shape(c, el(-25, -18, 7, 6), '#57534e');
    shape(c, rr(19, -50, 11, 30, 5), '#78716c'); shape(c, el(25, -18, 7, 6), '#57534e');
    shape(c, rr(-11, -66, 22, 16, 4), '#a8a29e');
    shape(c, rr(-8, -61, 16, 5, 2), '#1c1917', 1.2);
    dot(c, -4, -58.5, 1.8, '#ff7a1a'); dot(c, 4, -58.5, 1.8, '#ff7a1a');
    shape(c, el(-17, -52, 6, 2.6), '#65a30d', 1.2); shape(c, el(14, -66, 5, 2.2), '#65a30d', 1.2);
  },
  o_tower(c) {
    shape(c, rr(-21, -8, 42, 8, 2), '#6b5a45');
    for (const [x, y, w, h, col, t] of [[-19, -30, 38, 22, '#b45309', 'CANCELADO'], [-16, -50, 32, 20, '#7c3aed', 'BETA'], [-17, -66, 34, 16, '#0e7490', '?']]) {
      shape(c, rr(x, y, w, h, 2), col); shape(c, rr(x + 3, y + 3, w - 6, h * 0.42, 1.4), 'rgba(255,255,255,.22)', 0);
      txt(c, t, x + w / 2, y + h * 0.7, t.length > 4 ? 5.6 : 7, '#fff6ea');
    }
    c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-19, -30); c.lineTo(-12, -30); c.moveTo(-19, -30); c.lineTo(-19, -23); c.moveTo(-19, -26.5); c.quadraticCurveTo(-16, -27, -15.5, -30); c.stroke();
    shape(c, rr(-14, -88, 28, 22, 4), '#d6cfc0');
    shape(c, rr(-10, -84, 20, 14, 3), '#1f2937', 1.4);
    dot(c, -4, -78, 1.8, '#ff9a3c'); dot(c, 4, -78, 1.8, '#ff9a3c');
    shape(c, rr(-5, -66.6, 10, 3, 1), '#a8a29e', 1.2);
  },
  o_base(c) {
    shape(c, rr(-56, -9, 112, 10, 3), '#6b5a45');
    shape(c, rr(-48, -66, 96, 58, 3), '#8a7a63');
    c.strokeStyle = '#75664f'; c.lineWidth = 1.2; c.beginPath(); for (let x = -44; x < 48; x += 8) { c.moveTo(x, -64); c.lineTo(x, -10); } c.stroke();
    shape(c, c => { c.moveTo(-54, -64); c.quadraticCurveTo(0, -102, 54, -64); c.closePath(); }, '#9ca3af');
    c.strokeStyle = '#7d8597'; c.lineWidth = 1.2; c.beginPath(); for (let i = -4; i <= 4; i++) { c.moveTo(i * 11, -64); c.lineTo(i * 6, -82 + Math.abs(i) * 2.2); } c.stroke();
    shape(c, rr(-17, -40, 34, 32, 2), '#4b4237', 1.8);
    c.strokeStyle = '#6b5a45'; c.lineWidth = 1.2; c.beginPath(); for (let y = -36; y < -9; y += 4) { c.moveTo(-15, y); c.lineTo(15, y); } c.stroke();
    shape(c, rr(-30, -60, 60, 13, 2), '#2a2118', 1.6);
    txt(c, 'ALMACÉN', 0, -53, 8.6, '#ffcb3d');
    for (const [x, y, sz] of [[-40, -9, 13], [-27, -9, 10], [-38, -22, 10], [30, -9, 13], [41, -9, 10]]) { shape(c, rr(x - sz / 2, y - sz, sz, sz, 1), '#c9955a', 1.4); line(c, [x - sz / 2, y - sz * 0.55, x + sz / 2, y - sz * 0.55], '#a0703c', 1); }
    c.save(); c.translate(31, -16); c.rotate(-0.2); c.strokeStyle = '#dc2626'; c.lineWidth = 1; c.strokeRect(-8, -2.6, 16, 5.2); c.fillStyle = '#dc2626'; c.font = '3.8px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CANCELADO', 0, 0.3); c.restore();
    line(c, [30, -76, 30, -106], OL, 3.4); line(c, [30, -76, 30, -106], '#d6cfc0', 1.6);
    shape(c, poly(30, -106, 50, -101, 30, -94), '#a16207', 1.5);
    txt(c, '?', 37, -100, 6.4, '#fff6ea');
  },
  /* ---------- v0.9.13: Phony y su PayStation (rival de la campaña 2) ---------- */
  descargabot(c) {
    line(c, [-9, -16, -13, -10], OL, 2.6); line(c, [-9, -16, -13, -10], '#cbd5e1', 1.2);
    line(c, [9, -16, 13, -10], OL, 2.6); line(c, [9, -16, 13, -10], '#cbd5e1', 1.2);
    shape(c, rr(-10, -32, 20, 28, 8), '#eef2f7');
    shape(c, rr(-7, -29, 14, 9, 2.4), '#111827', 1.3);
    dot(c, -3, -24.6, 1.6, '#3b82f6'); dot(c, 3, -24.6, 1.6, '#3b82f6');
    shape(c, rr(-7.4, -17, 14.8, 4.6, 2), '#1f2937', 1.2);
    c.fillStyle = '#3b82f6'; c.fillRect(-6.6, -16.2, 13.2 * 0.92, 3);
    txt(c, '99%', 0, -9.4, 4.6, '#1d4ed8');
    line(c, [0, -32, 0, -36], OL, 1.6);
    shape(c, poly(-2.6, -42, 2.6, -42, 2.6, -39.4, 4.6, -39.4, 0, -35, -4.6, -39.4, -2.6, -39.4), '#3b82f6', 1.1);
  },
  licenciabot(c) {
    c.save(); c.translate(14, -20); c.rotate(0.2);
    shape(c, rr(-5, -8, 10, 14, 1), '#fff', 1.4); line(c, [-3, -5, 3, -5], '#9ca3af', 0.9); line(c, [-3, -2.6, 3, -2.6], '#9ca3af', 0.9); line(c, [-3, -0.2, 1.4, -0.2], '#9ca3af', 0.9); dot(c, 2, 3, 1.8, '#dc2626');
    c.restore();
    shape(c, rr(-11, -30, 22, 26, 5), '#1e3a8a');
    shape(c, rr(-8, -26, 16, 10, 2.4), '#111827', 1.3);
    dot(c, -3.4, -21.2, 1.6, '#60a5fa'); dot(c, 3.4, -21.2, 1.6, '#60a5fa');
    line(c, [-3, -18, 3, -18], '#60a5fa', 1);
    shape(c, rr(-11, -10, 22, 3.6, 1.2), '#172554', 1.1);
    shape(c, el(10.6, -18, 3, 3), '#3b82f6', 1.3);
    shape(c, rr(-6, -33, 12, 3, 1), '#ffcb3d', 1.2); shape(c, rr(-6, -45, 12, 3, 1), '#ffcb3d', 1.2);
    shape(c, c => { c.moveTo(-4.6, -42); c.lineTo(4.6, -42); c.lineTo(0.8, -37.6); c.lineTo(4.6, -33); c.lineTo(-4.6, -33); c.lineTo(-0.8, -37.6); c.closePath(); }, 'rgba(200,230,255,.6)', 1.2);
    shape(c, poly(-3, -33, 3, -33, 0, -35.8), '#f59e0b', 0); dot(c, 0, -39.6, 0.8, '#f59e0b');
  },
  plusbot(c) {
    c.save(); c.translate(15, -22); c.rotate(-0.3); shape(c, rr(-6, -4, 12, 8, 1.4), '#ffcb3d', 1.3); c.fillStyle = '#b45309'; c.fillRect(-6, -1.8, 12, 1.6); c.restore();
    line(c, [9, -22, 12, -22], OL, 2.4);
    shape(c, el(0, -24, 12, 11.5), '#0ea5e9');
    shape(c, rr(-7.4, -32, 14.8, 6.6, 3.2), '#e0f2fe', 1.3);
    dot(c, -3, -28.7, 1.4, OL); dot(c, 3.4, -28.7, 1.4, OL);
    shape(c, el(0, -18.4, 5, 4.8), '#fff', 1.2);
    c.fillStyle = '#0284c7'; c.fillRect(-1.1, -21.6, 2.2, 6.4); c.fillRect(-3.2, -19.5, 6.4, 2.2);
    line(c, [-9, -16, -12, -11], OL, 1); shape(c, rr(-20, -11, 14, 6.6, 1.6), '#fff', 1.2); txt(c, '9,99', -13, -7.5, 4.6, '#dc2626');
    c.beginPath(); c.ellipse(0, -38, 7, 2, 0, 0, Math.PI * 2); c.strokeStyle = OL; c.lineWidth = 3; c.stroke(); c.strokeStyle = '#7dd3fc'; c.lineWidth = 1.5; c.stroke();
  },
  cobradlc(c) {
    line(c, [13, -22, 21, -18], OL, 3); line(c, [13, -22, 21, -18], '#94a3b8', 1.6);
    shape(c, rr(18, -26, 8, 11, 1.6), '#1f2937', 1.3); shape(c, rr(19.4, -24.6, 5.2, 3.6, 0.8), '#7be04a', 0);
    shape(c, c => { c.moveTo(-15, -4); c.lineTo(-15, -26); c.lineTo(15, -26); c.lineTo(17, -4); c.closePath(); }, '#64748b');
    shape(c, rr(-16, -10, 33, 6, 1.6), '#475569', 1.4);
    dot(c, 0.5, -7, 1.2, '#ffcb3d');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) shape(c, rr(-12 + j * 5.6, -23 + i * 4.4, 4, 3, 0.8), j === 3 ? '#f87171' : '#e2e8f0', 0.8);
    shape(c, rr(-11, -42, 22, 15, 3), '#334155');
    shape(c, rr(-8, -39, 16, 9, 2), '#111827', 1.2);
    txt(c, '€', -3.6, -34, 6.6, '#7be04a'); txt(c, '€', 3.6, -34, 6.6, '#7be04a');
    line(c, [-6.4, -38, -1.6, -37], '#7be04a', 1.1); line(c, [6.4, -38, 1.6, -37], '#7be04a', 1.1);
    shape(c, rr(-5, -49, 8, 8, 0.6), '#fff', 1.1); line(c, [-3.4, -46.6, 1.4, -46.6], '#9ca3af', 0.8); line(c, [-3.4, -44.6, 1.4, -44.6], '#9ca3af', 0.8);
  },
  servidorbot(c) {
    c.lineWidth = 3.4; c.strokeStyle = OL; c.beginPath(); c.moveTo(-16, -40); c.quadraticCurveTo(-26, -30, -22, -16); c.moveTo(16, -40); c.quadraticCurveTo(26, -30, 22, -16); c.stroke();
    c.lineWidth = 1.8; c.strokeStyle = '#facc15'; c.beginPath(); c.moveTo(-16, -40); c.quadraticCurveTo(-26, -30, -22, -16); c.stroke(); c.strokeStyle = '#3b82f6'; c.beginPath(); c.moveTo(16, -40); c.quadraticCurveTo(26, -30, 22, -16); c.stroke();
    shape(c, rr(-25, -17, 6, 5, 1), '#9ca3af', 1.2); shape(c, rr(19, -17, 6, 5, 1), '#9ca3af', 1.2);
    shape(c, rr(-17, -56, 34, 52, 3), '#1f2937');
    for (let i = 0; i < 6; i++) { const y = -52 + i * 7.6; shape(c, rr(-13, y, 26, 5.4, 1), '#111827', 1); for (let j = 0; j < 4; j++) { c.fillStyle = ['#22c55e', '#3b82f6', '#22c55e', '#f59e0b'][(i + j) % 4]; c.fillRect(-11 + j * 3.2, y + 1.8, 1.8, 1.8); } c.fillStyle = 'rgba(160,180,220,.35)'; c.fillRect(3, y + 2, 8, 1.2); }
    shape(c, el(-5, -48.6, 3, 2.6), '#fff', 1.1); shape(c, el(5, -48.6, 3, 2.6), '#fff', 1.1); dot(c, -4.2, -48.4, 1.2, '#ef4444'); dot(c, 5.8, -48.4, 1.2, '#ef4444');
    line(c, [-8, -52.4, -2.6, -51], OL, 1.4); line(c, [8, -52.4, 2.6, -51], OL, 1.4);
    c.save(); c.translate(0, -27); c.rotate(-0.08); shape(c, rr(-16, -4.6, 32, 9.2, 1.4), '#facc15', 1.4); c.fillStyle = OL; for (let i = -14; i < 16; i += 5) { c.beginPath(); c.moveTo(i, 4.6); c.lineTo(i + 3, -4.6); c.lineTo(i + 5, -4.6); c.lineTo(i + 2, 4.6); c.closePath(); c.fill(); } c.restore();
    shape(c, rr(-5, -60, 10, 4, 1), '#374151', 1.2);
    shape(c, c => { c.moveTo(-4.4, -60); c.quadraticCurveTo(-4.4, -66, 0, -66); c.quadraticCurveTo(4.4, -66, 4.4, -60); c.closePath(); }, '#ef4444', 1.3);
    dot(c, -1.4, -62.6, 1, 'rgba(255,255,255,.8)');
  },
  remasterbot(c) {
    shape(c, el(-20, -26, 5, 8, 0.2), '#8b8b8b');
    shape(c, rr(-18, -44, 36, 38, 7), '#8b8b8b');
    c.save(); c.beginPath(); rrPath(c, -18, -44, 36, 38, 7); c.clip();
    c.fillStyle = '#e11d48'; c.fillRect(0, -50, 30, 50);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(4, -41, 3.4, 28);
    c.fillStyle = '#a16207'; for (const [x, y] of [[-12, -36], [-8, -20], [-14, -14]]) { c.beginPath(); c.arc(x, y, 2.2, 0, Math.PI * 2); c.fill(); }
    c.restore();
    shape(c, rr(-18, -44, 36, 38, 7), null, 2.2);
    line(c, [16, -26, 26, -40], OL, 3.4); line(c, [16, -26, 26, -40], '#a16207', 1.8); shape(c, rr(22, -48, 8, 9, 1.4), '#e11d48', 1.3);
    shape(c, el(16, -24, 4, 4), '#e11d48', 1.3);
    shape(c, rr(-12, -58, 24, 15, 4), '#8b8b8b');
    c.save(); c.beginPath(); rrPath(c, -12, -58, 24, 15, 4); c.clip(); c.fillStyle = '#e11d48'; c.fillRect(0, -60, 14, 18); c.restore();
    shape(c, rr(-12, -58, 24, 15, 4), null, 2);
    dot(c, -5, -51, 2, '#fde047'); dot(c, 5, -51, 2, '#fde047');
    c.save(); c.translate(-8, -28); c.rotate(-0.2); shape(c, rr(-8, -4.4, 16, 8.8, 1.4), '#fff', 1.3); txt(c, '70 €', 0, 0.4, 5.8, '#dc2626'); c.restore();
  },
  y_tower(c) {
    shape(c, rr(-20, -8, 40, 8, 2), '#1f2937');
    shape(c, rr(-15, -72, 30, 65, 5), '#334155');
    shape(c, rr(-15, -72, 5, 65, 2), '#475569', 0); line(c, [-10, -70, -10, -10], '#94a3b8', 1);
    shape(c, rr(-15, -72, 30, 65, 5), null, 2.2);
    shape(c, rr(-9, -64, 18, 11, 2), '#0f172a', 1.4); txt(c, '€', -3, -58.4, 8, '#ffcb3d'); txt(c, '€', 4, -58.4, 8, '#ffcb3d');
    shape(c, rr(-3, -46, 6, 14, 2), '#111827', 1.4); line(c, [0, -44, 0, -34], '#ffcb3d', 1.6);
    shape(c, rr(-10, -26, 14, 3, 1), '#94a3b8', 1); line(c, [-12, -30, 5, -20], '#dc2626', 1.6);
    shape(c, rr(-11, -16, 22, 4, 1.4), '#ffcb3d', 1.2);
    shape(c, el(0, -80, 9, 7), '#111827');
    shape(c, el(4.6, -80, 4, 4), '#ffcb3d', 1.3); dot(c, 5.4, -81, 1.3, '#fff7d6');
    line(c, [-4, -86, -7, -93], OL, 1.6); dot(c, -7.2, -93.6, 1.8, '#ffcb3d');
  },
  y_base(c) {
    shape(c, rr(-58, -10, 116, 11, 3), '#1f2937');
    shape(c, rr(-52, -66, 104, 57, 7), '#334155');
    shape(c, rr(-52, -66, 104, 9, 4), '#475569', 0); line(c, [-48, -57, 48, -57], '#94a3b8', 1.2);
    shape(c, rr(-52, -66, 104, 57, 7), null, 2.2);
    line(c, [-52, -15, 52, -15], '#ffcb3d', 2.4);
    shape(c, rr(-14, -36, 28, 22, 3), '#0f172a', 1.8); line(c, [0, -36, 0, -15], '#ffcb3d', 1.2);
    shape(c, rr(-46, -50, 28, 4, 1.4), '#94a3b8', 1.2);
    line(c, [-48, -56, -16, -41], '#dc2626', 2.4);
    c.save(); c.translate(-31, -27); c.rotate(-0.1); shape(c, rr(-17, -5, 34, 10, 2), '#fff', 1.4); txt(c, 'SIN LECTOR', 0, 0.5, 6, '#dc2626'); c.restore();
    shape(c, rr(22, -52, 24, 30, 3), '#0f172a', 1.6); shape(c, rr(32, -48, 4, 12, 1.4), '#111827', 1.1); line(c, [34, -47, 34, -37], '#ffcb3d', 1.6);
    txt(c, 'PAGA AQUÍ', 34, -28, 4.6, '#ffcb3d');
    shape(c, rr(-34, -98, 68, 24, 5), '#111827', 2);
    txt(c, 'PHONY', 0, -86, 14, '#ffcb3d');
    line(c, [-28, -78.6, 28, -78.6], '#dc2626', 1.6);
    line(c, [-20, -74, -20, -66], OL, 2.6); line(c, [20, -74, 20, -66], OL, 2.6);
    line(c, [0, -98, 0, -114], OL, 3); shape(c, el(0, -118, 4.4, 4.4), '#ffcb3d', 1.4);
    for (const [x, y] of [[-46, -88], [44, -94]]) { shape(c, el(x, y, 5.4, 5.4), '#ffcb3d', 1.4); txt(c, '€', x, y + 0.4, 6.4, '#a16207'); }
  },
  /* ---------- v0.9.13: Cultura Pop ---------- */
  directora(c) {
    shape(c, c => { c.moveTo(-12, -32); c.quadraticCurveTo(-16, -16, -13, -4); c.quadraticCurveTo(0, 0, 13, -4); c.quadraticCurveTo(16, -16, 12, -32); c.quadraticCurveTo(0, -36, -12, -32); c.closePath(); }, '#d97706');
    shape(c, poly(-4, -33, 0, -20, 4, -33), '#fff6ea', 1.2);
    line(c, [0, -20, 0, -6], '#b45309', 1.2);
    shape(c, el(-13, -20, 4.4, 8, 0.3), '#d97706');
    c.save(); c.translate(-16, -12); c.rotate(-0.25);
    shape(c, rr(-7, -4, 14, 9, 1), '#1f2937', 1.4); shape(c, poly(-7, -4, -6, -9, 7, -9, 7, -4), '#f5f5f4', 1.3);
    c.fillStyle = OL; for (const x of [-4, 0, 4]) { c.beginPath(); c.moveTo(x, -9); c.lineTo(x + 2, -9); c.lineTo(x + 1, -4); c.lineTo(x - 1, -4); c.closePath(); c.fill(); }
    line(c, [-5, 1, 5, 1], '#f5f5f4', 0.9);
    c.restore();
    shape(c, c => { c.moveTo(-8, -34); c.quadraticCurveTo(0, -29, 8, -34); c.lineTo(7, -30.6); c.quadraticCurveTo(0, -26, -7, -30.6); c.closePath(); }, '#dc2626', 1.4);
    shape(c, c => { c.moveTo(-6, -31); c.lineTo(-10, -18); c.lineTo(-5.6, -19); c.lineTo(-3, -30); c.closePath(); }, '#dc2626', 1.3);
    shape(c, el(13, -24, 4.4, 7, -0.6), '#d97706');
    shape(c, c => { c.moveTo(14, -30); c.lineTo(27, -36); c.lineTo(27, -22); c.lineTo(14, -26); c.closePath(); }, '#f5f5f4', 1.6);
    shape(c, el(27, -29, 2.6, 7), '#e5e7eb', 1.4); line(c, [18.4, -31.8, 18.4, -24.8], '#dc2626', 1.4);
    shape(c, el(14.5, -27, 3.2, 3.2), '#f1c27d', 1.3);
    shape(c, el(0, -42, 9, 8.8), '#f1c27d');
    shape(c, c => { c.moveTo(-9.6, -43); c.quadraticCurveTo(-11, -34, -6, -33.6); c.lineTo(-6.4, -43); c.closePath(); }, '#d1d5db', 1.3);
    shape(c, rr(-7, -45, 6.2, 4, 1.4), '#111827', 1.1); shape(c, rr(1.4, -45, 6.2, 4, 1.4), '#111827', 1.1); line(c, [-0.8, -44, 1.4, -44], OL, 1);
    c.beginPath(); c.arc(1, -38.6, 2.4, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1.3; c.stroke();
    shape(c, c => { c.moveTo(-10, -47); c.quadraticCurveTo(-8, -55, 2, -54.6); c.quadraticCurveTo(12, -54, 11, -47.6); c.quadraticCurveTo(0, -45, -10, -47); c.closePath(); }, '#1f2937', 1.6);
    line(c, [1, -54.6, 2, -57.6], OL, 1.8);
  },
  extras(c) {
    line(c, [7, -8, 13, -22], OL, 3.4); line(c, [7, -8, 13, -22], '#d6b07a', 1.8);
    shape(c, c => { c.moveTo(-7, -17); c.lineTo(7, -17); c.lineTo(8, -3); c.quadraticCurveTo(0, -1, -8, -3); c.closePath(); }, '#9ca3af');
    shape(c, rr(-5.8, -14.6, 11.6, 4.8, 1), '#fff', 0.9); c.fillStyle = OL; c.font = '3.6px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EXTRA', 0, -12);
    shape(c, el(7.6, -9, 2.4, 2.4), '#f1c27d', 1.2);
    shape(c, el(0, -22, 6.4, 6), '#f1c27d');
    dot(c, -2, -22.4, 1, OL); dot(c, 3, -22.4, 1, OL);
    line(c, [-1, -19.4, 2.6, -19.6], OL, 1);
    shape(c, c => { c.moveTo(-6.6, -24); c.quadraticCurveTo(-6.6, -30.6, 0, -30.6); c.quadraticCurveTo(6.6, -30.6, 6.6, -24); c.closePath(); }, '#d6b07a', 1.4);
    shape(c, c => { c.moveTo(-5, -30); c.quadraticCurveTo(0, -36, 5, -30); c.lineTo(3, -29); c.quadraticCurveTo(0, -32, -3, -29); c.closePath(); }, '#dc2626', 1.2);
  },
  doble(c) {
    shape(c, c => { c.moveTo(-9, -28); c.quadraticCurveTo(-12, -16, -9, -4); c.quadraticCurveTo(0, -1, 9, -4); c.quadraticCurveTo(12, -16, 9, -28); c.quadraticCurveTo(0, -31, -9, -28); c.closePath(); }, '#f5f5f4');
    shape(c, rr(-9, -9, 18, 5, 1.6), '#1e3a8a', 1.2);
    shape(c, el(-11, -20, 4.6, 7.6, 0.2), '#e0a872'); shape(c, el(-12, -12.4, 3.4, 3.4), '#e0a872', 1.3);
    shape(c, el(11.6, -21, 4.6, 7, -0.5), '#e0a872'); shape(c, el(14, -27, 3.4, 3.4), '#e0a872', 1.3);
    shape(c, el(-5, -2.6, 3, 2), '#1f2937', 1); shape(c, el(5, -2.6, 3, 2), '#1f2937', 1);
    shape(c, el(0.5, -35, 7.6, 7.2), '#e0a872');
    shape(c, rr(-7.6, -40.6, 16.2, 3.6, 1.4), '#dc2626', 1.3);
    shape(c, poly(-7.4, -39.4, -13, -37, -12, -42), '#dc2626', 1.2);
    shape(c, rr(-4.6, -37, 11, 3.2, 1.4), '#111827', 1); line(c, [-3, -36.4, 0, -36.4], 'rgba(255,255,255,.6)', 0.8);
    c.beginPath(); c.moveTo(-1, -31.4); c.lineTo(4.6, -31.8); c.strokeStyle = OL; c.lineWidth = 1.2; c.stroke();
    shape(c, rr(3.6, -34.6, 4.4, 2, 0.8), '#fcd9b6', 0.8);
  },
  heroe(c) {
    shape(c, c => { c.moveTo(-6, -36); c.quadraticCurveTo(-20, -28, -22, -10); c.quadraticCurveTo(-16, -13, -13, -8); c.quadraticCurveTo(-9, -14, -5, -10); c.lineTo(4, -32); c.closePath(); }, '#dc2626');
    c.fillStyle = 'rgba(255,255,255,.75)'; for (const [x, y] of [[-15, -24], [-10, -18], [-17, -15], [-9, -27]]) { c.beginPath(); c.arc(x, y, 1.3, 0, Math.PI * 2); c.fill(); }
    shape(c, rr(-7, -11, 6, 9, 2), '#2563eb'); shape(c, rr(1, -11, 6, 9, 2), '#2563eb');
    shape(c, el(-4, -2.4, 3.6, 2.4), '#dc2626', 1.2); shape(c, el(4, -2.4, 3.6, 2.4), '#dc2626', 1.2);
    shape(c, c => { c.moveTo(-8, -34); c.lineTo(8, -34); c.lineTo(9, -10); c.quadraticCurveTo(0, -7, -9, -10); c.closePath(); }, '#2563eb');
    shape(c, rr(-9, -16, 18, 4, 1.4), '#facc15', 1.2);
    shape(c, el(0, -26, 6.4, 5.2), '#facc15', 1.3); txt(c, '2x1', 0, -25.6, 5.4, '#dc2626');
    shape(c, el(11, -32, 7, 3.6, -0.2), '#2563eb'); shape(c, el(18, -33.6, 3.6, 3.4), '#dc2626', 1.4);
    shape(c, el(0, -42, 7.6, 7.4), '#f1c27d');
    shape(c, rr(-7.2, -45.6, 14.4, 4.4, 2), '#111827', 1.2);
    dot(c, -3, -43.4, 1.1, '#fff'); dot(c, 3.4, -43.4, 1.1, '#fff');
    c.beginPath(); c.arc(0.6, -38.8, 2.4, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1.2; c.stroke();
    shape(c, c => { c.moveTo(-7, -46); c.quadraticCurveTo(-4, -54, 6, -51); c.quadraticCurveTo(2, -50, 1, -48); c.quadraticCurveTo(-2, -50, -7, -46); c.closePath(); }, '#1f2937', 1.3);
  },
  detective(c) {
    shape(c, c => { c.moveTo(-9, -30); c.quadraticCurveTo(-13, -15, -12, -2); c.lineTo(11, -2); c.quadraticCurveTo(12, -15, 9, -30); c.quadraticCurveTo(0, -33, -9, -30); c.closePath(); }, '#c8a97e');
    line(c, [0, -30, -1, -3], '#a8875a', 1.4);
    shape(c, rr(-11, -16, 22, 3.6, 1.2), '#8a6a42', 1.2);
    shape(c, poly(-6, -31, 0, -24, 6, -31), '#e5e7eb', 1.1); shape(c, poly(-1.4, -27, 1.4, -27, 0.8, -22, -0.8, -22), '#7c2d12', 0.8);
    shape(c, el(10, -22, 3.8, 7, -0.5), '#c8a97e');
    line(c, [13, -26, 17, -31], OL, 2.6); line(c, [13, -26, 17, -31], '#8a5a33', 1.3);
    c.beginPath(); c.arc(19.6, -34.6, 5.2, 0, Math.PI * 2); c.fillStyle = 'rgba(190,230,255,.55)'; c.fill(); c.lineWidth = 2.6; c.strokeStyle = OL; c.stroke(); c.lineWidth = 1.2; c.strokeStyle = '#d1d5db'; c.stroke();
    shape(c, el(12.6, -25.4, 2.6, 2.6), '#f1c27d', 1.2);
    shape(c, el(0.5, -37, 7, 6.8), '#f1c27d');
    shape(c, el(4, -35.6, 2.4, 2.2), '#e8a07a', 1);
    dot(c, -1, -38, 1.1, OL); line(c, [-3.4, -40, 0.6, -39.4], OL, 1.3);
    shape(c, el(0.5, -42, 11, 2.6), '#5b4636', 1.4);
    shape(c, c => { c.moveTo(-6, -42); c.quadraticCurveTo(-6.4, -50, 0.5, -50); c.quadraticCurveTo(7.4, -50, 7, -42); c.closePath(); }, '#5b4636', 1.4);
    line(c, [-6, -43.6, 7, -43.6], '#1f2937', 1.6);
  },
  spoiler(c) {
    shape(c, c => { c.moveTo(-9, -28); c.quadraticCurveTo(-12, -15, -10, -3); c.quadraticCurveTo(0, 0, 10, -3); c.quadraticCurveTo(12, -15, 9, -28); c.quadraticCurveTo(0, -31, -9, -28); c.closePath(); }, '#16a34a');
    shape(c, rr(-6, -14, 12, 5, 2), '#15803d', 1.1);
    line(c, [-2, -28, -2.6, -21], '#e5e7eb', 1); line(c, [2, -28, 2.6, -21], '#e5e7eb', 1);
    c.save(); c.translate(15, -30); c.rotate(0.15);
    shape(c, rr(-8, -10, 16, 20, 1), '#f5f0e1', 1.4);
    c.fillStyle = '#dc2626'; c.font = '5.2px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('¡FINAL!', 0, -5.6);
    c.fillStyle = '#9ca3af'; for (let y = -2; y < 8; y += 2.4) c.fillRect(-6, y, 12, 1);
    c.restore();
    shape(c, el(9, -22, 3.6, 6.6, -0.5), '#16a34a'); shape(c, el(9.6, -28, 2.8, 2.8), '#f1c27d', 1.2);
    shape(c, el(0, -36, 7.6, 7.2), '#f1c27d');
    shape(c, c => { c.moveTo(-8, -36); c.quadraticCurveTo(-9, -46, 0, -45.6); c.quadraticCurveTo(9, -46, 8, -36); c.quadraticCurveTo(4, -41, 0, -40.6); c.quadraticCurveTo(-4, -41, -8, -36); c.closePath(); }, '#16a34a', 1.5);
    dot(c, -2.6, -37.4, 1.2, OL); dot(c, 3, -37.4, 1.2, OL);
    shape(c, el(0.4, -32.6, 2.6, 2.2), '#7f1d1d', 1.1);
    line(c, [-11, -40, -14, -42], OL, 1.2); line(c, [-11.6, -36, -15, -36], OL, 1.2);
  },
  kaiju(c) {
    shape(c, c => { c.moveTo(-14, -12); c.quadraticCurveTo(-34, -10, -40, -2); c.quadraticCurveTo(-28, -3, -12, -4); c.closePath(); }, '#7c3aed');
    shape(c, el(-9, -5, 7, 5), '#6d28d9'); shape(c, el(9, -5, 7, 5), '#6d28d9');
    shape(c, c => { c.moveTo(-17, -6); c.quadraticCurveTo(-22, -36, -8, -48); c.quadraticCurveTo(8, -54, 15, -40); c.quadraticCurveTo(22, -24, 17, -6); c.quadraticCurveTo(0, 0, -17, -6); c.closePath(); }, '#8b5cf6');
    shape(c, el(3, -22, 10, 14), '#ddd6fe', 0);
    c.strokeStyle = '#c4b5fd'; c.lineWidth = 1.2; c.beginPath(); for (let y = -32; y < -10; y += 5) { c.moveTo(-5, y); c.quadraticCurveTo(3, y + 2, 11, y); } c.stroke();
    line(c, [3, -44, 3, -10], '#facc15', 2); c.strokeStyle = '#a16207'; c.lineWidth = 0.8; c.beginPath(); for (let y = -42; y < -11; y += 2.4) { c.moveTo(1.6, y); c.lineTo(4.4, y); } c.stroke();
    shape(c, rr(1.2, -46, 3.6, 5, 1), '#facc15', 1.1);
    for (const [x, y, sz] of [[-16, -30, 6], [-15, -40, 6.6], [-9, -49, 6.6]]) shape(c, poly(x, y, x - sz, y - sz * 0.4, x - sz * 0.2, y + sz * 0.7), '#f472b6', 1.4);
    shape(c, el(17, -28, 5, 3, -0.4), '#8b5cf6'); shape(c, el(15, -20, 4.6, 2.8, 0.3), '#8b5cf6');
    shape(c, el(8, -54, 12, 10), '#8b5cf6');
    shape(c, el(14, -51, 7, 5), '#a78bfa', 1.4);
    dot(c, 15.6, -52, 0.9, OL); dot(c, 18.6, -52, 0.9, OL);
    shape(c, el(4, -59, 4.6, 4.6), '#fff', 1.3); shape(c, el(12, -60, 4, 4), '#fff', 1.3);
    dot(c, 5, -58.4, 1.8, OL); dot(c, 13, -59.4, 1.6, OL);
    c.beginPath(); c.moveTo(10, -47); c.quadraticCurveTo(14, -45, 19, -47.6); c.strokeStyle = OL; c.lineWidth = 1.3; c.stroke();
    shape(c, poly(12, -46.6, 13.4, -44.4, 14.6, -46.4), '#fff', 0.9);
  },
  k_tower(c) {
    shape(c, rr(-20, -8, 40, 8, 2), '#374151');
    const lx = y => 14 - ((-6 - y) * 8) / 54;
    c.lineCap = 'round';
    c.strokeStyle = OL; c.lineWidth = 3.4; c.beginPath(); c.moveTo(-14, -6); c.lineTo(-6, -60); c.moveTo(14, -6); c.lineTo(6, -60); c.stroke();
    c.strokeStyle = '#9ca3af'; c.lineWidth = 1.8; c.stroke();
    c.strokeStyle = '#6b7280'; c.lineWidth = 1.2; c.beginPath(); for (let i = 0; i < 5; i++) { const ya = -6 - i * 10.8, yb = ya - 10.8, xa = lx(ya), xb = lx(yb); c.moveTo(-xa, ya); c.lineTo(xb, yb); c.moveTo(xa, ya); c.lineTo(-xb, yb); } c.stroke();
    shape(c, el(0, -61, 8, 3), '#4b5563', 1.4);
    c.save(); c.translate(0, -68); c.rotate(-0.35);
    shape(c, rr(-12, -9, 22, 18, 4), '#1f2937');
    line(c, [-8, -9, -8, 9], '#374151', 1.2); line(c, [-3, -9, -3, 9], '#374151', 1.2);
    shape(c, el(10, 0, 4, 9.4), '#fff7d6', 1.6);
    shape(c, el(10, 0, 2.2, 6), '#ffe14d', 0);
    c.restore();
    shape(c, c => starPath(c, -12, -38, 4.6, 2), '#ffcb3d', 1.1);
  },
  k_base(c) {
    shape(c, rr(-58, -9, 116, 10, 3), '#7f1d1d');
    shape(c, c => { c.moveTo(-50, -8); c.lineTo(-50, -54); c.quadraticCurveTo(0, -84, 50, -54); c.lineTo(50, -8); c.closePath(); }, '#e7dcc4');
    c.strokeStyle = '#cbbd9e'; c.lineWidth = 1.2; c.beginPath(); for (let x = -40; x <= 40; x += 10) { c.moveTo(x, -10); c.lineTo(x, -56 - (1 - Math.abs(x) / 50) * 12); } c.stroke();
    shape(c, el(-33, -40, 8, 8), '#1f2937', 1.6); txt(c, '7', -33, -39.4, 10, '#ffcb3d');
    shape(c, rr(-15, -38, 30, 30, 2), '#475569', 1.8);
    c.strokeStyle = '#64748b'; c.lineWidth = 1.2; c.beginPath(); for (let y = -34; y < -9; y += 4) { c.moveTo(-13, y); c.lineTo(13, y); } c.stroke();
    shape(c, el(27, -44, 4.6, 4.6), '#dc2626', 1.4); dot(c, 26, -45, 1.4, '#fecaca');
    shape(c, rr(-38, -100, 76, 26, 4), '#1f2937', 2);
    shape(c, rr(-33, -95, 66, 16, 2), '#fde68a', 1.4);
    txt(c, 'ESTRENO', 0, -86.6, 11, '#b91c1c');
    for (let i = 0; i < 13; i++) { dot(c, -34 + i * 5.66, -98.6, 1.4, '#fff7d6'); dot(c, -34 + i * 5.66, -75.8, 1.4, '#fff7d6'); }
    line(c, [-26, -74, -26, -62], OL, 2.6); line(c, [26, -74, 26, -62], OL, 2.6);
    shape(c, c => starPath(c, -46, -104, 6, 2.6), '#ffcb3d', 1.4); shape(c, c => starPath(c, 46, -106, 5, 2.2), '#ffcb3d', 1.4);
  },
  /* ---------- v0.9.13: Comunidad Gamer ---------- */
  progamer(c) {
    c.save(); c.translate(18, -30); c.rotate(0.45);
    shape(c, rr(-3, -2, 6, 8, 1.4), '#1f2937', 1.3);
    shape(c, rr(-5, -30, 10, 28, 2), '#111827', 1.6);
    ['#ff3348', '#ffcb3d', '#7be04a', '#22e3ff', '#a855f7', '#ff3df0'].forEach((col, i) => { c.fillStyle = col; c.fillRect(-3.4, -27.6 + i * 4.3, 2.6, 2.6); c.fillRect(0.6, -27.6 + i * 4.3, 2.6, 2.6); });
    c.restore();
    shape(c, c => { c.moveTo(-12, -33); c.quadraticCurveTo(-16, -17, -13, -4); c.quadraticCurveTo(0, 0, 13, -4); c.quadraticCurveTo(16, -17, 12, -33); c.quadraticCurveTo(0, -37, -12, -33); c.closePath(); }, '#111827');
    c.save(); c.beginPath(); c.moveTo(-12, -33); c.quadraticCurveTo(-16, -17, -13, -4); c.quadraticCurveTo(0, 0, 13, -4); c.quadraticCurveTo(16, -17, 12, -33); c.quadraticCurveTo(0, -37, -12, -33); c.closePath(); c.clip();
    c.fillStyle = '#22c55e'; c.beginPath(); c.moveTo(-16, -27); c.lineTo(16, -15); c.lineTo(16, -10); c.lineTo(-16, -22); c.closePath(); c.fill(); c.restore();
    txt(c, '1', 1, -27, 8, '#fff');
    shape(c, rr(-13, -9, 26, 4, 1.4), '#22c55e', 1.3);
    shape(c, rr(-12.6, -15.6, 5, 8, 1.4), '#a3e635', 1.2);
    shape(c, el(-13.6, -22, 4.4, 8, 0.25), '#111827'); shape(c, el(-14.6, -14.6, 3.2, 3.2), '#f1c27d', 1.3);
    shape(c, el(13.6, -25, 4.4, 7, -0.6), '#111827'); shape(c, el(16.4, -29.6, 3.4, 3.4), '#f1c27d', 1.3);
    shape(c, el(0, -43, 9, 8.6), '#f1c27d');
    shape(c, poly(-9, -45, -10, -52, -5, -49, -4, -55, 0, -50, 3, -56, 5, -50, 9, -53, 9, -45, 0, -49), '#7c3aed', 1.5);
    c.beginPath(); c.arc(0, -43, 10.4, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = OL; c.lineWidth = 4; c.stroke(); c.strokeStyle = '#22c55e'; c.lineWidth = 2.2; c.stroke();
    shape(c, rr(-12, -47, 5, 9, 2), '#1f2937', 1.4); shape(c, rr(7, -47, 5, 9, 2), '#1f2937', 1.4);
    c.beginPath(); c.moveTo(9, -40); c.quadraticCurveTo(8, -35, 3, -35.4); c.strokeStyle = OL; c.lineWidth = 1.4; c.stroke(); dot(c, 3, -35.4, 1.3, '#22c55e');
    dot(c, -3, -43.4, 1.4, OL); dot(c, 3.6, -43.4, 1.4, OL);
    line(c, [-5.6, -46, -1, -45.4], OL, 1.4); line(c, [6, -46, 1.6, -45.4], OL, 1.4);
    line(c, [-1, -38.6, 2.6, -38.8], OL, 1.2);
  },
  noobs(c) {
    shape(c, c => { c.moveTo(-7, -17); c.lineTo(7, -17); c.lineTo(8, -3); c.quadraticCurveTo(0, -1, -8, -3); c.closePath(); }, '#f97316');
    shape(c, rr(-4, -14.6, 8, 8, 1), '#fff', 1); c.fillStyle = '#dc2626'; c.fillRect(-2, -13, 1.8, 5.4); c.fillRect(-2, -9.4, 4.2, 1.8);
    shape(c, el(8, -9, 2.4, 2.4), '#f1c27d', 1.2); shape(c, el(-8, -9, 2.4, 2.4), '#f1c27d', 1.2);
    shape(c, el(0, -22, 6.6, 6.2), '#f1c27d');
    shape(c, el(-2.4, -22.6, 1.8, 2), '#fff', 1); shape(c, el(2.8, -22.6, 1.8, 2), '#fff', 1);
    dot(c, -2, -22.4, 0.9, OL); dot(c, 3.2, -22.4, 0.9, OL);
    shape(c, el(0.4, -18.6, 1.6, 1.2), '#7f1d1d', 0.9);
    shape(c, c => { c.moveTo(-6.6, -24); c.quadraticCurveTo(-6.6, -31, 0, -31); c.quadraticCurveTo(6.6, -31, 6.6, -24); c.closePath(); }, '#3b82f6', 0);
    shape(c, c => { c.moveTo(-6.6, -24); c.quadraticCurveTo(-6.6, -31, 0, -31); c.lineTo(0, -24); c.closePath(); }, '#ef4444', 0);
    shape(c, c => { c.moveTo(-6.6, -24); c.quadraticCurveTo(-6.6, -31, 0, -31); c.quadraticCurveTo(6.6, -31, 6.6, -24); c.closePath(); }, null, 1.4);
    line(c, [0, -31, 0, -34], OL, 1.2);
    shape(c, el(-3.6, -34.4, 3.6, 1.2), '#ffcb3d', 1); shape(c, el(3.6, -34.4, 3.6, 1.2), '#22c55e', 1);
  },
  speedrunner(c) {
    line(c, [-20, -24, -12, -24], 'rgba(255,255,255,.85)', 1.6); line(c, [-22, -16, -13, -16], 'rgba(255,255,255,.85)', 1.6); line(c, [-18, -8, -11, -8], 'rgba(255,255,255,.85)', 1.6);
    shape(c, el(-8.6, -18, 3.4, 6, 0.8), '#16a34a');
    shape(c, c => { c.moveTo(-6, -28); c.quadraticCurveTo(-10, -16, -8, -4); c.quadraticCurveTo(0, -1, 8, -4); c.quadraticCurveTo(10, -18, 6, -28); c.quadraticCurveTo(0, -31, -6, -28); c.closePath(); }, '#16a34a');
    line(c, [-5, -26, -6, -6], '#fff', 1.4); line(c, [5, -26, 6, -6], '#fff', 1.4);
    shape(c, el(9, -20, 3.6, 6.4, -0.8), '#16a34a');
    shape(c, el(14.6, -24, 4, 4), '#e5e7eb', 1.4); line(c, [14.6, -24, 14.6, -26.4], OL, 1); line(c, [14.6, -24, 16.4, -24], OL, 1); shape(c, rr(13.6, -29.6, 2, 2, 0.5), '#9ca3af', 0.8);
    shape(c, el(1.6, -33.6, 7, 6.6), '#e0a872');
    shape(c, c => { c.moveTo(-5.4, -38); c.quadraticCurveTo(-4, -43, 3, -42); c.quadraticCurveTo(9, -41, 8.6, -37.6); c.closePath(); }, '#78350f', 1.3);
    shape(c, rr(-5.4, -37.6, 14, 3, 1.2), '#dc2626', 1.2);
    shape(c, poly(-5, -36.4, -10, -34, -9.6, -38.4), '#dc2626', 1);
    dot(c, 0.6, -33.4, 1.1, OL); dot(c, 5.4, -33.4, 1.1, OL);
    c.beginPath(); c.arc(3.4, -30.6, 1.8, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1.1; c.stroke();
  },
  modder(c) {
    line(c, [10, -16, 18, -32], OL, 3.6); line(c, [10, -16, 18, -32], '#9ca3af', 2);
    shape(c, el(19, -34, 4, 4), '#9ca3af', 1.4); shape(c, rr(17.4, -39.4, 3.2, 4, 0.6), '#1f2937', 0);
    shape(c, rr(-15, -30, 8, 20, 2), '#4b5563');
    shape(c, c => { c.moveTo(-9, -29); c.quadraticCurveTo(-12, -15, -10, -3); c.quadraticCurveTo(0, 0, 10, -3); c.quadraticCurveTo(12, -15, 9, -29); c.quadraticCurveTo(0, -32, -9, -29); c.closePath(); }, '#0d9488');
    txt(c, '{ }', 0, -17, 6.4, '#ccfbf1');
    shape(c, el(10, -18, 3, 3), '#e0a872', 1.3);
    shape(c, el(0, -37, 7.6, 7.2), '#e0a872');
    shape(c, poly(-8, -39, -9, -45, -4, -43, -2, -47, 2, -44, 6, -47, 7, -42, 8.6, -39, 0, -42), '#57534e', 1.3);
    c.beginPath(); c.arc(-3, -37.6, 2.8, 0, Math.PI * 2); c.moveTo(6.6, -37.6); c.arc(3.8, -37.6, 2.8, 0, Math.PI * 2); c.fillStyle = 'rgba(220,240,255,.7)'; c.fill(); c.lineWidth = 1.4; c.strokeStyle = OL; c.stroke();
    dot(c, -3, -37.4, 0.9, OL); dot(c, 3.8, -37.4, 0.9, OL);
    c.beginPath(); c.arc(0.6, -33.2, 1.8, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1.1; c.stroke();
  },
  coleccionista(c) {
    shape(c, rr(-17, -34, 12, 26, 3), '#92400e');
    for (const [x, y, col] of [[-18, -42, '#2563eb'], [-14, -45, '#dc2626'], [-10, -41, '#16a34a']]) shape(c, rr(x, y, 5, 11, 0.8), col, 1.2);
    shape(c, c => { c.moveTo(-8, -28); c.quadraticCurveTo(-11, -15, -9, -3); c.quadraticCurveTo(0, 0, 9, -3); c.quadraticCurveTo(11, -15, 8, -28); c.quadraticCurveTo(0, -31, -8, -28); c.closePath(); }, '#f59e0b');
    shape(c, el(0, -16, 4.6, 4.6), '#e5e7eb', 1.2); dot(c, 0, -16, 1.2, OL);
    shape(c, rr(-9, -31, 3.4, 22, 1.2), '#78350f', 1);
    shape(c, el(10, -22, 3.6, 6.6, -0.6), '#f59e0b');
    shape(c, el(15, -28, 6, 6), '#e5e7eb', 1.5);
    c.beginPath(); c.arc(15, -28, 4.2, -0.6, 0.9); c.strokeStyle = '#ff8fd0'; c.lineWidth = 1.2; c.stroke(); c.beginPath(); c.arc(15, -28, 4.2, 2.4, 3.6); c.strokeStyle = '#7dd3fc'; c.stroke();
    dot(c, 15, -28, 1.5, OL);
    shape(c, el(0, -36, 7.4, 7), '#f1c27d');
    shape(c, rr(-5.6, -38.6, 11.6, 3.4, 1.2), 'rgba(220,240,255,.7)', 1.2); line(c, [0.2, -38.4, 0.2, -35.4], OL, 1);
    dot(c, -2.6, -37, 0.9, OL); dot(c, 3.2, -37, 0.9, OL);
    c.beginPath(); c.arc(0.6, -32.6, 1.8, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1.1; c.stroke();
    shape(c, c => { c.moveTo(-7, -39); c.quadraticCurveTo(-6, -46, 0, -45.6); c.quadraticCurveTo(7, -46, 7.4, -39); c.closePath(); }, '#1d4ed8', 1.4);
    shape(c, rr(4, -40.6, 9, 2.6, 1.2), '#1d4ed8', 1.2);
  },
  ragequitter(c) {
    shape(c, rr(-15, -44, 12, 30, 4), '#dc2626'); shape(c, rr(-13, -40, 8, 6, 2), '#111827', 1);
    shape(c, c => { c.moveTo(-10, -32); c.quadraticCurveTo(-14, -17, -11, -3); c.quadraticCurveTo(0, 0, 11, -3); c.quadraticCurveTo(14, -17, 10, -32); c.quadraticCurveTo(0, -35, -10, -32); c.closePath(); }, '#4b5563');
    shape(c, rr(-6, -24, 12, 7, 2), '#374151', 1.1);
    shape(c, el(12, -22, 4, 6.6, -0.6), '#4b5563');
    c.save(); c.translate(17, -28); c.rotate(0.3);
    shape(c, c => { c.moveTo(-6, -2); c.quadraticCurveTo(-7, 4, -3, 4); c.lineTo(-1, 1); c.lineTo(-0.4, -3); c.closePath(); }, '#1f2937', 1.2);
    shape(c, c => { c.moveTo(1, -3); c.lineTo(1.6, 1); c.lineTo(3.6, 4); c.quadraticCurveTo(7, 4, 6, -2); c.closePath(); }, '#1f2937', 1.2);
    dot(c, -3.4, -0.4, 0.9, '#ff3348'); dot(c, 3.6, -0.4, 0.9, '#22e3ff');
    c.restore();
    c.beginPath(); c.arc(0, -30, 8, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 3.4; c.stroke(); c.strokeStyle = '#9ca3af'; c.lineWidth = 1.6; c.stroke();
    shape(c, el(0.5, -40, 8.6, 8.2), '#f87171');
    shape(c, poly(-8, -43, -7, -49, -3, -47, 0, -50, 3, -47, 7, -49, 9, -43, 0.5, -46), '#1f2937', 1.3);
    line(c, [-5, -44, -0.6, -42.4], OL, 1.8); line(c, [7, -44, 2.6, -42.4], OL, 1.8);
    dot(c, -2.4, -40.6, 1.3, OL); dot(c, 4, -40.6, 1.3, OL);
    shape(c, rr(-3.4, -36.4, 8, 3.4, 1.2), '#fff', 1.1); line(c, [-3.4, -34.7, 4.6, -34.7], OL, 0.8);
    for (const [x, y] of [[-9, -52], [10, -53]]) { c.beginPath(); c.moveTo(x, y + 4); c.quadraticCurveTo(x - 3, y, x, y - 3); c.quadraticCurveTo(x + 3, y - 6, x, y - 9); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 2; c.stroke(); }
  },
  recreativa(c) {
    line(c, [-15, -34, -24, -22], OL, 4); line(c, [-15, -34, -24, -22], '#7c3aed', 2.2); shape(c, el(-24.6, -20.6, 4, 4), '#f1c27d', 1.4);
    line(c, [15, -34, 24, -26], OL, 4); line(c, [15, -34, 24, -26], '#7c3aed', 2.2); shape(c, el(24.6, -25, 4, 4), '#f1c27d', 1.4);
    shape(c, c => { c.moveTo(-16, -4); c.lineTo(-16, -40); c.lineTo(-13, -62); c.lineTo(13, -62); c.lineTo(16, -40); c.lineTo(16, -4); c.closePath(); }, '#7c3aed');
    shape(c, rr(-14, -68, 28, 8, 2), '#1f2937', 1.6);
    txt(c, 'ARCADE', 0, -63.6, 6.4, '#ffe14d');
    shape(c, rr(-11, -57, 22, 17, 2), '#111827', 1.6);
    c.fillStyle = '#7be04a'; c.fillRect(-7, -53, 4, 4); c.fillRect(3, -53, 4, 4); c.fillRect(-6, -46, 12, 2); c.fillRect(-7, -48, 2, 2); c.fillRect(5, -48, 2, 2);
    shape(c, c => { c.moveTo(-17, -40); c.lineTo(17, -40); c.lineTo(19, -33); c.lineTo(-19, -33); c.closePath(); }, '#4c1d95', 1.6);
    line(c, [-8, -37, -9, -42], OL, 1.6); dot(c, -9.2, -42.6, 2, '#ef4444');
    dot(c, 3, -36.4, 1.6, '#ffcb3d'); dot(c, 7.4, -36.4, 1.6, '#22e3ff'); dot(c, 11.8, -36.4, 1.6, '#7be04a');
    shape(c, rr(-5, -27, 10, 12, 1.4), '#1f2937', 1.4); shape(c, rr(-1, -24, 2, 6, 0.6), '#ffcb3d', 0);
    txt(c, 'INSERT COIN', 0, -9.4, 4, '#ffe14d');
  },
  g_tower(c) {
    shape(c, rr(-20, -8, 40, 8, 2), '#1f2937');
    shape(c, rr(-15, -70, 30, 63, 3), '#111827');
    shape(c, rr(-12, -66, 18, 55, 2), 'rgba(120,200,255,.18)', 1.2);
    for (const [y, col] of [[-56, '#ff3df0'], [-40, '#22e3ff'], [-24, '#7be04a']]) { c.beginPath(); c.arc(-3, y, 6, 0, Math.PI * 2); c.strokeStyle = col; c.lineWidth = 2; c.stroke(); c.beginPath(); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; c.moveTo(-3, y); c.lineTo(-3 + Math.cos(a) * 5, y + Math.sin(a) * 5); } c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.1; c.stroke(); }
    shape(c, rr(8, -66, 5, 30, 1.4), '#1f2937', 1); dot(c, 10.5, -62, 1.2, '#7be04a'); dot(c, 10.5, -58, 1.2, '#ffcb3d');
    shape(c, rr(-9, -82, 18, 11, 4), '#e5e7eb');
    shape(c, el(0, -76.6, 3.6, 3.6), '#111827', 1.2); dot(c, 1, -77.6, 1.2, '#22e3ff');
    dot(c, 6, -79.6, 1, '#ff3348');
  },
  g_base(c) {
    shape(c, rr(-58, -9, 116, 10, 3), '#1f2937');
    shape(c, rr(-50, -60, 100, 52, 3), '#312e81');
    c.strokeStyle = '#4338ca'; c.lineWidth = 1.2; c.beginPath(); for (let x = -40; x < 50; x += 10) { c.moveTo(x, -58); c.lineTo(x, -10); } c.stroke();
    shape(c, poly(-56, -58, 0, -88, 56, -58), '#4c1d95', 2.2);
    line(c, [-50, -58, 50, -58], '#22e3ff', 2);
    shape(c, rr(-26, -84, 52, 26, 3), '#111827', 2);
    const g = c.createLinearGradient(0, -80, 0, -62); g.addColorStop(0, '#7c3aed'); g.addColorStop(1, '#22d3ee');
    shape(c, rr(-22, -80, 44, 18, 2), g, 1.2);
    txt(c, 'GG', 0, -70.6, 14, '#fff');
    shape(c, rr(-13, -34, 26, 26, 3), '#111827', 1.8); line(c, [0, -34, 0, -8], '#22e3ff', 1.2);
    for (const x of [-36, 36]) { shape(c, rr(x - 10, -24, 20, 3, 1), '#6b7280', 1.2); shape(c, rr(x - 7, -36, 14, 10, 1.6), '#1f2937', 1.3); shape(c, rr(x - 5.6, -34.6, 11.2, 7, 1), x < 0 ? '#22e3ff' : '#ff3df0', 0); line(c, [x, -26, x, -24], OL, 1.4); }
    shape(c, rr(-14, -100, 28, 13, 3), '#22c55e', 1.6); txt(c, 'LAN', 0, -93, 10, '#052e16');
    line(c, [0, -87, 0, -84], OL, 2);
  },
  x_rubble(c) {
    shape(c, el(0, -3, 23, 8), '#6b7280');
    shape(c, poly(-17, -3, -15, -15, -9, -12, -4, -20, 2, -13, 8, -18, 13, -11, 17, -14, 17, -3), '#9ca3af');
    shape(c, rr(-25, -8, 12, 7, 1.5), '#d1d5db', 1.5); shape(c, rr(11, -7, 14, 6, 1.5), '#d1d5db', 1.5);
    dot(c, -4, -6, 1.6, '#ff3df0'); dot(c, 5, -8, 1.6, '#22e3ff'); dot(c, 0, -3, 1.6, '#ffcb3d');
  },
};

// sprite box: [width, height, anchorX, anchorY]
const BOX = {
  squirrel: [60, 56, 30, 50], fox: [70, 62, 35, 56], bunny: [90, 96, 45, 88],
  becario: [52, 48, 26, 42], starbot: [60, 58, 28, 52], fallen: [70, 66, 35, 60],
  beaver: [56, 56, 28, 50], meercat: [64, 60, 32, 54], junkcoon: [66, 60, 33, 54], mechavaca: [84, 78, 42, 70], vaca: [52, 50, 26, 44],
  necrolord: [84, 92, 42, 84], skeleton: [44, 40, 22, 36], zombie: [54, 50, 27, 44], ghostmage: [62, 66, 31, 60], banshee: [64, 60, 32, 54], skullknight: [76, 78, 38, 70], stitchbrute: [92, 84, 46, 76],
  u_tower: [70, 96, 35, 90], u_base: [124, 128, 62, 120], u_rubble: [64, 40, 32, 30],
  twitchking: [86, 92, 43, 84], subswarm: [44, 42, 22, 38], hypebeast: [56, 56, 28, 50], viralbot: [60, 58, 30, 52], snackmom: [62, 60, 31, 54], hypetrain: [86, 68, 43, 62], banhammer: [86, 82, 43, 74],
  epicchampion: [90, 96, 45, 88], cupidarcher: [60, 58, 30, 52], hoplite: [56, 58, 28, 52], shieldmaiden: [66, 66, 33, 58], thundergod: [70, 72, 35, 64], medusa: [64, 62, 32, 54], minotaur: [86, 84, 43, 76],
  cybermarine: [88, 90, 44, 82], drone: [44, 40, 22, 36], nanobot: [40, 36, 20, 32], cyberninja: [60, 56, 30, 50], techdroid: [60, 58, 30, 52], hackerkid: [56, 52, 28, 46], neonsniper: [72, 58, 36, 52], siegemech: [92, 82, 46, 74],
  memelord: [84, 90, 42, 82], suchdog: [56, 52, 28, 46], gifblaster: [60, 56, 30, 50], synthcat: [64, 56, 32, 50], trollbot: [70, 66, 35, 58], stonks: [64, 64, 32, 56], chonkcat: [92, 80, 46, 72],
  s_tower: [70, 100, 35, 94], s_base: [124, 124, 62, 116], h_tower: [70, 108, 35, 102], h_base: [130, 128, 65, 120], c_tower: [70, 96, 35, 90], c_base: [130, 124, 65, 116], m_tower: [70, 100, 35, 94], m_base: [124, 128, 62, 120], x_rubble: [64, 40, 32, 30],
  p_tower: [70, 96, 35, 90], p_base: [124, 120, 62, 112], e_tower: [64, 100, 32, 94], e_base: [140, 162, 70, 154],
  p_rubble: [64, 40, 32, 30], e_rubble: [64, 40, 32, 30],
  cajabotin: [64, 56, 32, 50], soportebot: [60, 60, 30, 54], parchebot: [80, 74, 40, 66],
  vikingo: [96, 96, 48, 88], vikingsquad: [52, 52, 26, 46], swarmbug: [44, 34, 20, 30], retromarine: [72, 62, 34, 56], ghostagent: [72, 56, 30, 50], rockracer: [64, 40, 32, 34], titanbeta: [96, 84, 48, 76],
  o_tower: [70, 100, 35, 94], o_base: [124, 124, 62, 116],
  descargabot: [44, 50, 22, 44], licenciabot: [56, 56, 26, 50], plusbot: [56, 52, 26, 46], cobradlc: [64, 62, 30, 56], servidorbot: [76, 76, 38, 70], remasterbot: [80, 72, 38, 64],
  y_tower: [70, 104, 35, 98], y_base: [130, 132, 65, 124],
  directora: [92, 86, 44, 78], extras: [40, 42, 20, 38], doble: [52, 52, 26, 46], heroe: [56, 60, 28, 56], detective: [58, 58, 26, 52], spoiler: [56, 56, 26, 50], kaiju: [100, 80, 54, 72],
  k_tower: [70, 96, 35, 90], k_base: [124, 120, 62, 112],
  progamer: [90, 88, 42, 80], noobs: [40, 44, 20, 40], speedrunner: [56, 50, 28, 46], modder: [56, 56, 26, 50], coleccionista: [60, 56, 30, 50], ragequitter: [60, 70, 28, 64], recreativa: [76, 80, 38, 72],
  g_tower: [70, 92, 35, 86], g_base: [124, 116, 62, 108],
  // v0.9.15: gashapón de cartas
  ceo: [60, 72, 26, 68], presi: [60, 72, 26, 68], huron: [64, 56, 32, 50], sombra: [62, 60, 31, 54], hater: [64, 64, 30, 58], arpia: [64, 60, 32, 54], dron: [56, 50, 28, 44], clickbait: [52, 56, 26, 50], campero: [60, 58, 30, 52], espia: [56, 60, 28, 54], paparazzi: [60, 60, 26, 54], sp_bellotas: [56, 54, 28, 50], sp_botiquin: [56, 54, 28, 50], sp_pulgas: [56, 54, 28, 50], sp_lapidas: [56, 54, 28, 50], sp_formol: [56, 54, 28, 50], sp_eternas: [56, 54, 28, 50], sp_donaciones: [56, 54, 28, 50], sp_merienda: [56, 54, 28, 50], sp_baneo: [56, 54, 28, 50], sp_rayo: [56, 54, 28, 50], sp_ambrosia: [56, 54, 28, 50], sp_nerfeo: [56, 54, 28, 50], sp_orbital: [56, 54, 28, 50], sp_nanobots: [56, 54, 28, 50], sp_update: [56, 54, 28, 50], sp_gatos: [56, 54, 28, 50], sp_likes: [56, 54, 28, 50], sp_confusion: [56, 54, 28, 50], sp_critico: [56, 54, 28, 50], sp_energetica: [56, 54, 28, 50], sp_ping: [56, 54, 28, 50], sp_cartuchos: [56, 54, 28, 50], sp_parchefan: [56, 54, 28, 50], sp_cancelado: [56, 54, 28, 50], sp_taquilla: [56, 54, 28, 50], sp_maquillaje: [56, 54, 28, 50], sp_remake: [56, 54, 28, 50], sp_despido: [56, 54, 28, 50], sp_cobro: [56, 54, 28, 50],
};
const SPR = {};
function buildSprites() {
  for (const key in ART) {
    const [w, h, ax, ay] = BOX[key];
    const c = document.createElement('canvas'); c.width = Math.ceil(w * RES); c.height = Math.ceil(h * RES);
    const x = c.getContext('2d'); x.scale(RES, RES); x.translate(ax, ay); x.lineJoin = 'round'; x.lineCap = 'round';
    ART[key](x);
    if (!key.endsWith('_rubble')) {   // v0.9.8: luz suave arriba y sombra abajo para dar volumen
      x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-atop';
      const sg = x.createLinearGradient(0, 0, 0, c.height);
      sg.addColorStop(0, 'rgba(255,248,225,.24)'); sg.addColorStop(0.4, 'rgba(255,248,225,0)'); sg.addColorStop(0.66, 'rgba(40,10,60,0)'); sg.addColorStop(1, 'rgba(40,10,60,.3)');
      x.fillStyle = sg; x.fillRect(0, 0, c.width, c.height); x.restore();
    }
    const wc = document.createElement('canvas'); wc.width = c.width; wc.height = c.height;
    const wx = wc.getContext('2d'); wx.drawImage(c, 0, 0); wx.globalCompositeOperation = 'source-in'; wx.fillStyle = '#fff'; wx.fillRect(0, 0, wc.width, wc.height);
    let gc = null;
    if (TYPES[key]) { gc = document.createElement('canvas'); gc.width = c.width; gc.height = c.height; const gx = gc.getContext('2d'); gx.drawImage(c, 0, 0); gx.globalCompositeOperation = 'source-in'; gx.fillStyle = '#9aa3a0'; gx.fillRect(0, 0, gc.width, gc.height); }
    SPR[key] = { c, w: wc, g: gc, wd: w, ht: h, ax, ay };
  }
}
// draw a character straight from vectors (sharp at any size: cards and title)
function drawVector(c, key, x, y, h, flip = 1) {
  const sc = h / (TYPES[key] ? TYPES[key].top : TOPS[key]);
  c.save(); c.translate(x, y); c.scale(sc * flip, sc); c.lineJoin = 'round'; c.lineCap = 'round'; ART[key](c);
  const T = TYPES[key];
  if (T && T.foot) { for (const fx of [-0.4, 0.4]) { const r = CFG.units[key].r; c.beginPath(); c.ellipse(fx * r, -1, r * 0.3, r * 0.19, 0, 0, Math.PI * 2); c.fillStyle = T.foot; c.fill(); c.lineWidth = 1.6; c.strokeStyle = OL; c.stroke(); } }
  c.restore();
}

/* ---------- arena background (painted once) ---------- */
const PATHS = [[[270, 700], [110, 575], [110, 270], [270, 196]]];
PATHS.push(PATHS[0].map(([a, b]) => [W - a, b]));
function distToSeg(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay; const t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1); return Math.hypot(px - (ax + dx * t), py - (ay + dy * t)); }
function nearPath(x, y, m) { for (const p of PATHS) for (let i = 0; i < p.length - 1; i++) if (distToSeg(x, y, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]) < m) return true; return false; }
const STRUCT_SPOTS = [[110, 575, 34], [430, 575, 34], [270, 700, 62], [110, 270, 34], [430, 270, 34], [270, 196, 70]];
function freeSpot(x, y, m = 32) {
  if (nearPath(x, y, m)) return false;
  if (y > RIVER.top - 14 && y < RIVER.bottom + 14) return false;
  for (const [sx, sy, sr] of STRUCT_SPOTS) if (Math.hypot(x - sx, y - sy) < sr + 14) return false;
  return true;
}
// tu mitad del campo cambia según la facción
const THEMES = {
  animales:  { grad: ['#6eb646', '#70c24b', '#5aae3b'], greens: ['#4f9a35', '#5fae3e', '#86cf5a', '#3f8a2d', '#9bdc6a'], hedge: ['#3f8a35', '#5fae4a'], cap: '#e2463b', capDot: '#fff', title: ['#5fae3e', '#7cc957'] },
  nomuertos: { grad: ['#6a9a52', '#587f4c', '#4c6e47', '#3d5a40'], greens: ['#3e5e3a', '#4f7046', '#62815a', '#33502f', '#6f8f62'], hedge: ['#2f4a35', '#466b4a'], cap: '#8a4fd0', capDot: '#c8ffe0', title: ['#4c6e47', '#62815a'] },
  streamers: { grad: ['#5fae62', '#58a660', '#4b9658'], greens: ['#3f8a4a', '#4f9a55', '#7ac76a', '#357a40', '#8fd87a'], hedge: ['#357852', '#4f9a68'], cap: '#a855f7', capDot: '#f5d0fe', title: ['#4f9a55', '#6fbf6a'] },
  heroes:    { grad: ['#8cbf4a', '#94c652', '#7fb342'], greens: ['#6f9a35', '#86b043', '#a6cf5e', '#5f8a2d', '#b8dc70'], hedge: ['#5d8a35', '#7aa848'], cap: '#f59e0b', capDot: '#fff7d6', title: ['#86b043', '#a6cf5e'] },
  ciber:     { grad: ['#4f8068', '#46735e', '#3a604f'], greens: ['#2f5a48', '#3e6b56', '#5a8a72', '#26493b', '#6a9c84'], hedge: ['#28463f', '#3d6359'], cap: '#22e3ff', capDot: '#e0faff', title: ['#3e6b56', '#5a8a72'] },
  memes:     { grad: ['#7acb48', '#80d24e', '#6cc03e'], greens: ['#5aae3b', '#6cc04a', '#96df66', '#4a9a32', '#a8ec74'], hedge: ['#3f9a35', '#62bd4c'], cap: '#ff3df0', capDot: '#fff', title: ['#6cc04a', '#96df66'] },
  gamer:     { grad: ['#58b06a', '#5cb870', '#4ea464'], greens: ['#3f8f50', '#4fa060', '#7bcf86', '#358045', '#8fdc96'], hedge: ['#2f7a4a', '#4a9a62'], cap: '#22c55e', capDot: '#fff', title: ['#4fa060', '#7bcf86'] },
  olvidados: { grad: ['#93a36a', '#8a9a62', '#7b8b56'], greens: ['#6f7f4a', '#7f8f55', '#9aa86a', '#5f6f3f', '#a8b478'], hedge: ['#5f6f45', '#7d8c5a'], cap: '#a16207', capDot: '#fde68a', title: ['#7f8f55', '#9aa86a'] },
  pop:       { grad: ['#6cc04a', '#72c850', '#62b440'], greens: ['#4f9a35', '#62b440', '#8fd86a', '#438a2d', '#a2e47c'], hedge: ['#3f8a35', '#5fae4a'], cap: '#dc2626', capDot: '#fff', title: ['#62b440', '#8fd86a'] },
};
function buildBG(fac = 'animales', plaza = 'mb') {
  const undead = fac === 'nomuertos', TH = THEMES[fac] || THEMES.animales, ph = plaza === 'ph';
  const cv = document.createElement('canvas'); cv.width = W * BG_RES; cv.height = H * BG_RES;
  const c = cv.getContext('2d'); c.scale(BG_RES, BG_RES); c.lineJoin = 'round'; c.lineCap = 'round';
  const R = mulberry32(37), r = (a, b) => a + R() * (b - a);
  let g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#a7a77a'); g.addColorStop(0.2, '#9fae69'); g.addColorStop(0.33, '#84b452');
  if (undead) { g.addColorStop(0.43, '#6a9a52'); g.addColorStop(0.5, '#587f4c'); g.addColorStop(0.7, '#4c6e47'); g.addColorStop(1, '#3d5a40'); }
  else { g.addColorStop(0.43, TH.grad[0]); g.addColorStop(0.6, TH.grad[1]); g.addColorStop(1, TH.grad[2]); }
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  for (let y = 60; y < H; y += 44) { c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(0, y, W, 22); }
  for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(176,160,96,${r(0.12, 0.3)})`; c.beginPath(); c.ellipse(r(0, W), r(220, 395), r(14, 42), r(8, 18), r(0, 3), 0, Math.PI * 2); c.fill(); }
  const greens = TH.greens;
  c.lineWidth = 1.2;
  for (let i = 0; i < 2800; i++) {
    const px = r(0, W), py = r(60, 800);
    c.strokeStyle = py < RIVER.y ? (R() < 0.5 ? '#8c9a55' : '#6f9a45') : greens[(R() * greens.length) | 0];
    c.globalAlpha = r(0.35, 0.75); c.beginPath(); c.moveTo(px, py); c.lineTo(px + r(-1.5, 1.5), py - r(2.5, 5.5)); c.stroke();
  }
  c.globalAlpha = 1;
  // Microblizz corporate plaza eating the meadow
  const edge = px => 200 + Math.sin(px * 0.045) * 8 + Math.sin(px * 0.13) * 4 + (Math.abs(px - 270) < 120 ? 34 * Math.cos(((px - 270) / 120) * Math.PI / 2) : 0);
  c.save(); c.beginPath(); c.moveTo(0, 0); c.lineTo(W, 0); for (let px = W; px >= 0; px -= 6) c.lineTo(px, edge(px)); c.closePath();
  c.fillStyle = ph ? '#5b6475' : '#a9b1bf'; c.fill(); c.clip();
  c.strokeStyle = ph ? 'rgba(255,203,61,.22)' : 'rgba(70,80,100,.22)'; c.lineWidth = 1; c.beginPath();
  for (let px = 0; px <= W; px += 26) { c.moveTo(px, 0); c.lineTo(px, 270); }
  for (let py = 0; py <= 270; py += 26) { c.moveTo(0, py); c.lineTo(W, py); }
  c.stroke();
  for (let i = 0; i < 34; i++) { c.fillStyle = `rgba(60,70,95,${r(0.05, 0.13)})`; c.fillRect(Math.floor(r(0, 21)) * 26, Math.floor(r(0, 10)) * 26, 26, 26); }
  c.strokeStyle = 'rgba(30,36,54,.5)'; c.lineWidth = 2.4;
  for (let i = 0; i < 5; i++) { const sx = r(20, 520); c.beginPath(); c.moveTo(sx, 50); c.bezierCurveTo(sx + r(-80, 80), 120, sx + r(-80, 80), 170, sx + r(-60, 60), 250); c.stroke(); }
  c.restore();
  c.beginPath(); for (let px = 0; px <= W; px += 6) { px ? c.lineTo(px, edge(px)) : c.moveTo(px, edge(px)); } c.strokeStyle = ph ? '#ffcb3d' : '#7d8597'; c.lineWidth = 3; c.stroke();
  if (ph) for (let i = 0; i < 18; i++) { const px = r(20, 520), py = r(70, 190); if (Math.abs(px - 270) < 70 && py > 120) continue; c.save(); c.translate(px, py); c.rotate(r(-0.6, 0.6)); c.fillStyle = 'rgba(229,231,235,.75)'; c.beginPath(); c.arc(0, 0, 4, 0, Math.PI * 2); c.fill(); c.strokeStyle = 'rgba(32,16,44,.7)'; c.lineWidth = 1; c.stroke(); c.fillStyle = 'rgba(32,16,44,.7)'; c.beginPath(); c.arc(0, 0, 1, 0, Math.PI * 2); c.fill(); c.restore(); }   // discos tirados por el suelo
  // dusk sky + skyline behind HQ
  const sky = c.createLinearGradient(0, 0, 0, 62); sky.addColorStop(0, '#24133a'); sky.addColorStop(1, '#5b4a80');
  c.fillStyle = sky; c.fillRect(0, 0, W, 62);
  let bx = -10;
  while (bx < W) { const bw = r(34, 64), bh = r(26, 58); c.fillStyle = ph ? '#2a3140' : '#41506f'; c.fillRect(bx, 62 - bh, bw, bh); c.strokeStyle = OL; c.lineWidth = 1.5; c.strokeRect(bx, 62 - bh, bw, bh);
    c.fillStyle = ph ? 'rgba(255,203,61,.6)' : 'rgba(255,230,140,.55)'; for (let wy = 62 - bh + 6; wy < 56; wy += 9) for (let wx = bx + 5; wx < bx + bw - 6; wx += 9) if (R() < 0.45) c.fillRect(wx, wy, 4, 4);
    bx += bw + 2; }
  c.fillStyle = '#5a6582'; c.fillRect(0, 60, W, 5);
  // dirt lanes
  for (const p of PATHS) {
    c.beginPath(); p.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.strokeStyle = 'rgba(115,80,42,.55)'; c.lineWidth = 50; c.stroke();
    c.beginPath(); p.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.strokeStyle = '#d9b77e'; c.lineWidth = 40; c.stroke();
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i], [bx2, by] = p[i + 1]; const L = Math.hypot(bx2 - ax, by - ay); const nx = -(by - ay) / L, ny = (bx2 - ax) / L;
      for (let k = 0; k < L / 7; k++) { const t = R(), o = r(-16, 16); c.fillStyle = R() < 0.5 ? '#b8935e' : '#ead3a3'; c.beginPath(); c.ellipse(ax + (bx2 - ax) * t + nx * o, ay + (by - ay) * t + ny * o, r(1, 2.4), r(0.8, 1.6), 0, 0, Math.PI * 2); c.fill(); }
    }
  }
  // river
  c.fillStyle = '#5b3d24'; c.fillRect(0, RIVER.top - 6, W, RIVER.bottom - RIVER.top + 12);
  const rg = c.createLinearGradient(0, RIVER.top, 0, RIVER.bottom); rg.addColorStop(0, '#1f7f9c'); rg.addColorStop(0.5, '#3cc0cf'); rg.addColorStop(1, '#238aa6');
  c.fillStyle = rg; c.fillRect(0, RIVER.top, W, RIVER.bottom - RIVER.top);
  for (const by of [RIVER.top - 3, RIVER.bottom + 3]) { let px = -6; while (px < W + 6) { c.beginPath(); c.ellipse(px, by + r(-1, 1), r(5, 9), r(3, 5), 0, 0, Math.PI * 2); c.fillStyle = R() < 0.5 ? '#8e8a86' : '#a39e97'; c.fill(); c.lineWidth = 1.2; c.strokeStyle = '#4a3a30'; c.stroke(); px += r(10, 17); } }
  // flowers & mushrooms (meadow side), tombstones & boxes (corporate side)
  const fcols = ['#ffffff', '#ffd84d', '#ff8fb1', '#b98cff'];
  for (let i = 0; i < 90; i++) {
    const px = r(26, W - 26), py = r(250, 785); if (!freeSpot(px, py)) continue;
    if (!undead && fac !== 'animales' && py > RIVER.y && decor(c, fac, px, py, R, r)) continue;
    if (undead && py > RIVER.y) {
      const k = R();
      if (k < 0.45) { dot(c, px, py, 2.6, 'rgba(94,242,160,.25)'); dot(c, px, py, 1.2, '#7dffb8'); }
      else if (k < 0.75) { line(c, [px - 4, py - 1, px + 4, py + 1], OL, 3); line(c, [px - 4, py - 1, px + 4, py + 1], '#e8e2d0', 1.6); dot(c, px - 4.4, py - 1.4, 1.5, '#e8e2d0'); dot(c, px + 4.4, py + 1.4, 1.5, '#e8e2d0'); }
      else { shape(c, rr(px - 1.6, py - 6, 3.2, 6, 0.8), '#f3e6cc', 1); shape(c, el(px, py - 7.6, 1.2, 2), '#5ef2a0', 0); }
      continue;
    }
    const col = fcols[(R() * 4) | 0]; for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; dot(c, px + Math.cos(a) * 2.3, py + Math.sin(a) * 2.3, 1.7, col); } dot(c, px, py, 1.3, '#ffb020');
  }
  for (let i = 0; i < 9; i++) { const px = R() < 0.5 ? r(28, 70) : r(470, 512), py = r(470, 780); if (!freeSpot(px, py)) continue;
    const cap = TH.cap;
    shape(c, rr(px - 2.2, py - 7, 4.4, 7, 1.5), '#f3e6cc', 1.3); shape(c, c => { c.moveTo(px - 7, py - 6); c.quadraticCurveTo(px, py - 16, px + 7, py - 6); c.closePath(); }, cap, 1.4); dot(c, px - 2.5, py - 9, 1.2, TH.capDot); dot(c, px + 2, py - 10.5, 1, TH.capDot); }
  if (!undead && fac !== 'animales') for (let i = 0; i < 10; i++) { const px = R() < 0.5 ? r(30, 90) : r(450, 510), py = r(470, 780); if (!freeSpot(px, py, 30)) continue; bigDecor(c, fac, px, py, R, r); }
  if (undead) for (let i = 0; i < 10; i++) { const px = R() < 0.5 ? r(30, 90) : r(450, 510), py = r(470, 780); if (!freeSpot(px, py, 30)) continue;
    line(c, [px, py, px, py - 14], OL, 4); line(c, [px - 5, py - 10, px + 5, py - 10], OL, 4); line(c, [px, py, px, py - 14], '#7a5a3a', 2.2); line(c, [px - 5, py - 10, px + 5, py - 10], '#7a5a3a', 2.2);
    shape(c, el(px, py + 1, 8, 2.4), 'rgba(40,60,40,.5)', 0); }
  for (let i = 0; i < 14; i++) { const px = R() < 0.5 ? r(30, 82) : r(458, 510), py = r(215, 385); if (!freeSpot(px, py, 30)) continue;
    shape(c, c => { c.moveTo(px - 7, py); c.lineTo(px - 7, py - 9); c.arc(px, py - 9, 7, Math.PI, 0); c.lineTo(px + 7, py); c.closePath(); }, '#b9bfcc', 1.6);
    c.fillStyle = OL; c.font = '6px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('RIP', px, py - 8);
    shape(c, el(px, py + 1, 9, 2.5), 'rgba(90,120,50,.6)', 0); }
  for (const [px, py] of [[196, 238], [352, 240], [400, 214]]) { shape(c, rr(px - 9, py - 11, 18, 11, 1.5), '#c9955a', 1.5); shape(c, poly(px - 9, py - 11, px - 5, py - 15, px + 13, py - 15, px + 9, py - 11), '#ddb07a', 1.3); line(c, [px, py - 11, px, py], '#e8d2a0', 2); }
  // hedges on both sides
  for (let y = 70; y < 800; y += 21) {
    for (const side of [0, 1]) {
      const px = side ? W - r(-4, 8) : r(-4, 8); const cold = y < RIVER.y;
      for (let k = 0; k < 3; k++) { const ox = r(-7, 7), oy = r(-6, 6), rad = r(9, 14);
        c.beginPath(); c.arc(px + ox, y + oy, rad, 0, Math.PI * 2); c.fillStyle = cold ? '#5d7f3c' : TH.hedge[0]; c.fill(); c.lineWidth = 1.5; c.strokeStyle = OL; c.stroke();
        c.beginPath(); c.arc(px + ox - rad * 0.3, y + oy - rad * 0.3, rad * 0.45, 0, Math.PI * 2); c.fillStyle = cold ? '#77964f' : TH.hedge[1]; c.fill(); }
    }
  }
  paintLight(c);
  return cv;
}
// small props scattered on your half (true = drawn)
function decor(c, fac, px, py, R, r) {
  const k = R();
  if (fac === 'streamers') {
    if (k < 0.35) { const col = ['#ff3df0', '#22e3ff', '#a855f7', '#ffe14d'][(R() * 4) | 0]; dot(c, px, py, 4, col + '44'); dot(c, px, py, 1.8, col); return true; }
    if (k < 0.5) { shape(c, rr(px - 2.4, py - 6, 4.8, 6, 1), '#7be04a', 1.1); line(c, [px - 2, py - 4.4, px + 2, py - 4.4], '#1f2937', 0.8); return true; }
    if (k < 0.62) { c.beginPath(); c.moveTo(px - 10, py); c.bezierCurveTo(px - 4, py - 5, px + 2, py + 5, px + 10, py - 1); c.strokeStyle = 'rgba(30,20,40,.55)'; c.lineWidth = 1.6; c.stroke(); return true; }
    return false;
  }
  if (fac === 'heroes') {
    if (k < 0.3) { shape(c, el(px, py, 2.6, 2.6), '#ffcb3d', 1.1); line(c, [px - 0.8, py - 1, px + 0.8, py + 1], '#ca8a04', 0.8); return true; }
    if (k < 0.45) { shape(c, el(px, py, 3.6, 1.6, -0.4), '#4d7c0f', 0.9); shape(c, el(px + 4, py - 1.6, 3.2, 1.4, 0.5), '#65a30d', 0.9); return true; }
    if (k < 0.55) { shape(c, rr(px - 6, py - 3, 12, 4, 1.4), '#f5f3ee', 1.1); return true; }
    return false;
  }
  if (fac === 'ciber') {
    if (k < 0.32) { const L = r(10, 22), dir = R() < 0.5 ? 1 : -1; c.beginPath(); c.moveTo(px, py); c.lineTo(px + L * dir, py); c.lineTo(px + L * dir + 5 * dir, py - 5); c.strokeStyle = 'rgba(34,227,255,.55)'; c.lineWidth = 1.4; c.stroke(); dot(c, px, py, 1.6, '#22e3ff'); dot(c, px + L * dir + 5 * dir, py - 5, 1.6, '#ff3df0'); return true; }
    if (k < 0.45) { shape(c, rr(px - 6, py - 4, 12, 8, 1.4), '#5a6b70', 1.1); dot(c, px - 4, py - 2, 0.7, OL); dot(c, px + 4, py + 2, 0.7, OL); return true; }
    if (k < 0.55) { dot(c, px, py, 6, 'rgba(255,61,240,.18)'); dot(c, px, py, 2.4, 'rgba(255,61,240,.5)'); return true; }
    return false;
  }
  if (fac === 'gamer') {
    if (k < 0.22) { shape(c, rr(px - 2.2, py - 6, 4.4, 6, 1), '#a3e635', 1.1); line(c, [px - 1.8, py - 4.6, px + 1.8, py - 4.6], '#14532d', 0.8); return true; }
    if (k < 0.36) { c.beginPath(); c.moveTo(px - 10, py); c.bezierCurveTo(px - 4, py - 6, px + 2, py + 5, px + 10, py - 1); c.strokeStyle = 'rgba(20,20,40,.6)'; c.lineWidth = 1.6; c.stroke(); dot(c, px + 10, py - 1, 1.4, '#22e3ff'); return true; }
    if (k < 0.46) { shape(c, poly(px - 5, py + 2, px + 5, py + 2, px, py - 7), '#fbbf24', 1.1); dot(c, px - 1, py - 1, 1, '#dc2626'); dot(c, px + 1.4, py + 0.4, 1, '#dc2626'); return true; }
    return false;
  }
  if (fac === 'olvidados') {
    if (k < 0.22) { shape(c, rr(px - 4, py - 4, 8, 8, 0.8), '#1e3a8a', 1); shape(c, rr(px - 2, py - 4, 4, 2.6, 0.4), '#cbd5e1', 0); shape(c, rr(px - 2.6, py + 0.6, 5.2, 3, 0.4), '#fff', 0); return true; }
    if (k < 0.36) { shape(c, rr(px - 5, py - 4, 10, 7, 1), '#6b7280', 1); shape(c, rr(px - 3.6, py - 3, 7.2, 3, 0.6), '#d6cfc0', 0); return true; }
    if (k < 0.5) { dot(c, px, py, 3, 'rgba(214,207,192,.35)'); dot(c, px + 3, py - 1, 2, 'rgba(214,207,192,.3)'); return true; }
    return false;
  }
  if (fac === 'pop') {
    if (k < 0.24) { for (const [ox, oy] of [[0, 0], [2.4, -1], [1, 2]]) dot(c, px + ox, py + oy, 1.9, '#fff7e0'); dot(c, px + 1, py, 0.8, '#fbbf24'); return true; }
    if (k < 0.36) { c.save(); c.translate(px, py); c.rotate(R() - 0.5); shape(c, rr(-5, -2.6, 10, 5.2, 0.8), '#dc2626', 0.9); line(c, [-2, -2.6, -2, 2.6], '#fecaca', 0.8); c.restore(); return true; }
    if (k < 0.46) { shape(c, c => starPath(c, px, py, 3.4, 1.5), '#ffcb3d', 0.9); return true; }
    return false;
  }
  if (fac === 'memes') {
    if (k < 0.3) { shape(c, el(px, py, 3.6, 3.6), '#ffe14d', 1.1); dot(c, px - 1.3, py - 0.8, 0.6, OL); dot(c, px + 1.3, py - 0.8, 0.6, OL); c.beginPath(); c.arc(px, py + 0.4, 1.6, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 0.7; c.stroke(); return true; }
    if (k < 0.42) { c.save(); c.globalAlpha = 0.5; txt(c, pick(['LOL', 'XD', 'GG', '+1']), px, py, 7, '#ffffff'); c.restore(); return true; }
    return false;
  }
  return false;
}
function bigDecor(c, fac, px, py, R, r) {
  if (fac === 'streamers') { shape(c, rr(px - 5, py - 12, 10, 12, 2), '#4c1d95', 1.4); shape(c, el(px, py - 5, 3.4, 3.4), '#2b2d3a', 1); dot(c, px, py - 10, 1.2, '#22e3ff'); shape(c, el(px, py + 1, 8, 2.4), 'rgba(30,60,30,.4)', 0); }
  else if (fac === 'heroes') { shape(c, rr(px - 5, py - 14, 10, 14, 1.4), '#f5f3ee', 1.4); line(c, [px - 2, py - 13, px - 2, py - 1], '#cfcac0', 0.9); line(c, [px + 2, py - 13, px + 2, py - 1], '#cfcac0', 0.9); shape(c, poly(px - 6, py - 14, px - 2, py - 18, px + 3, py - 15, px + 6, py - 17, px + 6, py - 14), '#e7e5df', 1.2); shape(c, el(px, py + 1, 9, 2.4), 'rgba(60,80,30,.45)', 0); }
  else if (fac === 'ciber') { line(c, [px, py, px, py - 18], OL, 3.6); line(c, [px, py, px, py - 18], '#6b7280', 2); dot(c, px, py - 19, 2.4, R() < 0.5 ? '#22e3ff' : '#ff3df0'); dot(c, px, py - 19, 6, 'rgba(34,227,255,.18)'); shape(c, el(px, py + 1, 6, 2), 'rgba(20,40,40,.45)', 0); }
  else if (fac === 'gamer') { shape(c, rr(px - 5, py - 18, 10, 12, 3), '#dc2626', 1.4); shape(c, rr(px - 3, py - 15, 6, 4, 1.2), '#111827', 0); shape(c, rr(px - 6, py - 7, 12, 4, 1.4), '#1f2937', 1.2); line(c, [px, py - 3, px, py], OL, 2); shape(c, el(px, py + 1, 8, 2.4), 'rgba(20,40,30,.4)', 0); }
  else if (fac === 'olvidados') { shape(c, rr(px - 8, py - 9, 16, 9, 1), '#b98a55', 1.3); shape(c, rr(px - 5, py - 16, 11, 7, 1), '#c9955a', 1.3); line(c, [px - 8, py - 5, px + 8, py - 5], '#8a6a3a', 0.9); shape(c, el(px, py + 1, 10, 2.4), 'rgba(60,50,30,.45)', 0); }
  else if (fac === 'pop') { line(c, [px - 5, py, px, py - 12], OL, 2); line(c, [px + 5, py, px, py - 12], OL, 2); line(c, [px, py, px, py - 12], OL, 2); c.save(); c.translate(px, py - 15); c.rotate(-0.4); shape(c, rr(-5, -4, 9, 8, 2), '#1f2937', 1.3); shape(c, el(4.6, 0, 1.8, 3.6), '#fff7d6', 1); c.restore(); shape(c, el(px, py + 1, 7, 2.2), 'rgba(30,60,30,.4)', 0); }
  else if (fac === 'memes') { shape(c, rr(px - 7, py - 12, 14, 11, 2), '#e7dcc4', 1.4); shape(c, rr(px - 5, py - 10.5, 10, 7, 1.4), '#1e3a8a', 1); dot(c, px - 2, py - 7.5, 0.8, '#7be04a'); dot(c, px + 2, py - 7.5, 0.8, '#7be04a'); shape(c, el(px, py + 1, 9, 2.4), 'rgba(30,60,30,.4)', 0); }
}
function buildBridges() {
  const cv = document.createElement('canvas'); cv.width = W * BG_RES; cv.height = H * BG_RES;
  const c = cv.getContext('2d'); c.scale(BG_RES, BG_RES);
  for (const bx of BRIDGES) {
    const L = bx - 34, T = RIVER.top - 12, B = RIVER.bottom + 12, Wd = 68;
    c.fillStyle = 'rgba(10,40,50,.35)'; c.fillRect(L + 5, T + 6, Wd, B - T);
    c.fillStyle = '#a8703f'; c.strokeStyle = OL; c.lineWidth = 2; c.beginPath(); c.rect(L, T, Wd, B - T); c.fill(); c.stroke();
    c.strokeStyle = '#7d4f2a'; c.lineWidth = 1.2; for (let y = T + 6; y < B; y += 7) { c.beginPath(); c.moveTo(L + 6, y); c.lineTo(L + Wd - 6, y); c.stroke(); }
    for (const rx of [L, L + Wd - 6]) {
      c.fillStyle = '#6e4424'; c.fillRect(rx, T - 2, 6, B - T + 4); c.strokeStyle = OL; c.lineWidth = 1.6; c.strokeRect(rx, T - 2, 6, B - T + 4);
      for (const py of [T - 3, (T + B) / 2, B - 3]) { c.fillStyle = '#5a361b'; c.fillRect(rx - 1.5, py - 3.5, 9, 7); c.strokeRect(rx - 1.5, py - 3.5, 9, 7); }
    }
  }
  return cv;
}

