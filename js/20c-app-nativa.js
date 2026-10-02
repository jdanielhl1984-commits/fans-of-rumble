// Fans of Rumble · Cosas que solo pasan dentro de la app de Android (Capacitor)
'use strict';
/* ---------- v0.9.27 ----------
   En la web este archivo no hace nada. Dentro de la app:
   · Botón ATRÁS del móvil: en partida, pausa (o sigue si ya está en pausa); en una ventana, la cierra;
     en otra pantalla, vuelve al menú; en el menú principal, deja el juego en segundo plano.
   · No se usa el modo sin conexión de la web (la app ya lleva el juego dentro). */
const NATIVE = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
function nativeBack(AppP) {
  if (G.state === 'play' || G.state === 'paused') { $('#btn-pause').click(); return; }   // el mismo botón pausa y sigue
  if (G.state === 'countdown' || G.state === 'ending') return;
  const sc = curScreen(), el = sc ? document.getElementById(sc) : null;
  if (el && el.classList.contains('modal')) {   // ventana encima: se cierra con su propio botón
    const b = [...el.querySelectorAll('.back, [id$="-close"], [id$="-cancel"], [id$="-no"]')].find(x => !x.hidden && x.getClientRects().length);
    if (b) b.click();
    return;
  }
  if (sc && sc !== 'scr-title') { const b = el.querySelector('.back, [data-back]'); if (b) b.click(); else goHome(); return; }
  if (AppP.minimizeApp) AppP.minimizeApp(); else AppP.exitApp();
}
if (NATIVE) {
  document.documentElement.classList.add('native');
  const AppP = window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (AppP) AppP.addListener('backButton', () => { try { nativeBack(AppP); } catch (e) { /* si falla, no hace nada */ } });
}
