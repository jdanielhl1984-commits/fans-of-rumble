// Fans of Rumble · Cámara: zoom con dos dedos (o la rueda del ratón) durante la partida
'use strict';
/* ---------- v0.9.18: zoom ----------
   · Dos dedos: acercar, alejar y moverte. Con zoom, un dedo también mueve la vista (si no tienes una carta elegida).
   · Un dedo sobre las cartas: se arrastran como siempre.
   · «VISTA NORMAL» o doble toque: vuelve a ver todo el campo al momento.
   · PC: rueda del ratón. Como mucho x2, y la vista nunca se sale del campo. */
const CAM = { z: 1, ox: 0, oy: 0, max: 2 };
const camTouch = new Map();
let camPinch = null, camPan = null, camTap = null, camLastTap = 0;
const camLive = () => ['play', 'paused', 'countdown', 'ending'].includes(G.state);
function camScreen(e) { const r = stage.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * VIEW.LH }; }
function camClamp() {
  CAM.z = clamp(CAM.z, 1, CAM.max);
  if (CAM.z < 1.01) { CAM.z = 1; CAM.ox = 0; CAM.oy = 0; }
  CAM.ox = clamp(CAM.ox, W - W * CAM.z, 0); CAM.oy = clamp(CAM.oy, VIEW.LH - VIEW.LH * CAM.z, 0);
  camBtn();
}
function camReset() { CAM.z = 1; CAM.ox = 0; CAM.oy = 0; camPinch = camPan = null; camBtn(); }
function camZoomAt(sx, sy, z) { const wx = (sx - CAM.ox) / CAM.z, wy = (sy - CAM.oy) / CAM.z; CAM.z = clamp(z, 1, CAM.max); CAM.ox = sx - wx * CAM.z; CAM.oy = sy - wy * CAM.z; camClamp(); }
function camApply() {   // se llama al dibujar el campo
  if (!camLive()) { if (CAM.z !== 1) camReset(); return; }
  if (CAM.z !== 1) { ctx.translate(CAM.ox, CAM.oy); ctx.scale(CAM.z, CAM.z); }
}
function camBtn() {
  let b = document.getElementById('btn-cam');
  if (!b) {
    $('#ui').insertAdjacentHTML('beforeend', '<button class="cam-btn ol" id="btn-cam" hidden aria-label="Volver a la vista normal"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M13 13l4.5 4.5M6 8.5h5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>VISTA NORMAL</button>');
    b = document.getElementById('btn-cam'); b.addEventListener('click', () => { camReset(); play('select'); });
  }
  b.hidden = !(CAM.z > 1 && camLive());
}
// ---- dedos
cv.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') return;
  const p = camScreen(e); camTouch.set(e.pointerId, p);
  if (camTouch.size === 2) {
    const [a, b] = [...camTouch.values()];
    camPinch = { d: Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, z: CAM.z, ox: CAM.ox, oy: CAM.oy };
    camPan = null; camTap = null; input.ghost = null;
    if (!SAVE.camHint) { SAVE.camHint = 1; saveGame(); }
  } else if (camTouch.size === 1) { camTap = { x: p.x, y: p.y, id: e.pointerId }; camPan = null; }
});
cv.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse' || !camTouch.has(e.pointerId)) return;
  const p = camScreen(e); camTouch.set(e.pointerId, p);
  if (camPinch && camTouch.size >= 2) {
    const [a, b] = [...camTouch.values()], d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, P = camPinch;
    const z = clamp(P.z * d / P.d, 1, CAM.max), wx = (P.mx - P.ox) / P.z, wy = (P.my - P.oy) / P.z;
    CAM.z = z; CAM.ox = mx - wx * z; CAM.oy = my - wy * z; camClamp(); return;
  }
  if (camTap && camTap.id === e.pointerId && Math.hypot(p.x - camTap.x, p.y - camTap.y) > 12 && CAM.z > 1 && input.selected === null && camLive()) { camPan = { x: p.x, y: p.y }; camTap = null; }
  if (camPan) { CAM.ox += p.x - camPan.x; CAM.oy += p.y - camPan.y; camPan = { x: p.x, y: p.y }; camClamp(); }
});
function camTouchEnd(e, cancelled) {
  if (e.pointerType === 'mouse' || !camTouch.has(e.pointerId)) return;
  camTouch.delete(e.pointerId);
  if (camPinch) { if (camTouch.size < 2) { camPinch = null; camTap = null; } return; }
  if (camPan) { if (!camTouch.size) camPan = null; return; }
  const tap = camTap && camTap.id === e.pointerId; camTap = null;
  if (!tap || cancelled) return;
  const now = performance.now();
  if (input.selected === null && CAM.z > 1 && now - camLastTap < 320) { camReset(); camLastTap = 0; play('select'); return; }   // doble toque: vista normal
  camLastTap = now;
  fieldTap(e);
}
cv.addEventListener('pointerup', e => camTouchEnd(e, false));
cv.addEventListener('pointercancel', e => camTouchEnd(e, true));
// ---- rueda del ratón
cv.addEventListener('wheel', e => {
  if (G.state !== 'play' && G.state !== 'paused') return;
  e.preventDefault(); const p = camScreen(e); camZoomAt(p.x, p.y, CAM.z * Math.exp(-e.deltaY * 0.0016));
}, { passive: false });
