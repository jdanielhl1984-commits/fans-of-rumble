// Fans of Rumble · modo sin conexión (v0.9.11; archivos separados desde la v0.9.15)
// El juego (index.html, css/ y js/) se pide primero a internet para tener siempre la última versión;
// si no hay conexión, se usa la copia guardada. Iconos y letras se guardan la primera vez.
const CACHE = 'for-v0.9.18';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable.png', './css/estilos.css',
  './js/01-config.js', './js/02-progresion.js', './js/03-arte.js', './js/04-estado.js', './js/05-audio.js', './js/06-combate.js', './js/07-dibujo.js', './js/08-controles.js', './js/09-menus.js', './js/10-dificultad.js', './js/11-logros.js', './js/12-app-y-preparacion.js', './js/13-horas-extra.js', './js/14-cartas-y-jefes.js', './js/15-anuncios.js', './js/16-camara.js', './js/17-campos.js', './js/18-arranque.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const page = req.mode === 'navigate' || (url.origin === location.origin && (url.pathname.endsWith('/') || /\.(html|js|css)$/.test(url.pathname)));
  if (page) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(m => m || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(m => m || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
