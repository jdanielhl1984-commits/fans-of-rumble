// Fans of Rumble · Anuncios con premio (de prueba), tope diario y «Sin anuncios» en la tienda
'use strict';
/* ---------- v0.9.16: anuncios con premio ----------
   El jugador decide si ve un anuncio y, a cambio, recibe algo. Nunca hay anuncios obligatorios ni en mitad de la partida.
   En esta versión el anuncio es de prueba (5 s, de Microblizz). En la app de Google Play se cambiará por uno de verdad (AdMob).
   Con «Sin anuncios» (tienda) los premios llegan al momento, sin ver nada, pero con el mismo tope diario. */
const ADS = {
  dayMax: 30,     // anuncios al día en total (entre todos los sitios). v0.9.23: de 12 a 30
  secs: 5,        // lo que dura el anuncio de prueba
  turboH: 2,      // horas que dura el turbo de HORAS EXTRA
  idleH: 4,       // horas de ganancias que da el anuncio de HORAS EXTRA
  noAdsEur: 6.99,
  slots: {        // cuántas veces al día en cada sitio
    idle2: { max: 3, name: 'Recoger x2 en HORAS EXTRA' },
    idle4: { max: 2, name: 'Ganancias de 4 h en HORAS EXTRA' },
    turbo: { max: 2, name: 'Turbo de HORAS EXTRA' },
    end2:  { max: 12, name: 'Premio x2 al acabar una partida' },
    pull_ab: { max: 3, name: 'Tirada gratis: habilidades' },
    pull_eq: { max: 3, name: 'Tirada gratis: equipo' },
    pull_cd: { max: 3, name: 'Tirada gratis: cartas' },
    gift2: { max: 1, name: 'Regalo diario x2' },
    swap:  { max: 2, name: 'Cambiar una misión diaria' },
  },
};
const AD_JOKES = [
  ['PayStation 6 Digital Ultra', 'Ahora sin lector, sin botones y sin consola. Solo la factura.'],
  ['Microblizz Premium Plus Gold', 'Paga más y te dejamos jugar a lo que ya compraste.'],
  ['Curso: despedir con una sonrisa', 'Impartido por el CEO de Microblizz. Plazas limitadas (las demás las hemos recortado).'],
  ['Café del Becario', 'El café que se toma solo… porque ya no queda nadie en la oficina.'],
  ['Caja de botín misteriosa', '¿Qué habrá dentro? Spoiler: nada. Pero el cofre brilla mucho.'],
  ['Seguro anti-cierre de juegos', 'Te protege de todo. No cubre cierres de juegos.'],
  ['Microblizz Bank', 'Te prestamos para el pase de batalla. Intereses del 300 %. ¡Sin preguntas!'],
  ['Phony Cloud Infinito', 'Guarda tus juegos en la nube. Te los borramos cuando nos apetezca.'],
  ['Remaster 70 €', 'El mismo juego de siempre, con un filtro nuevo y el precio de estreno.'],
  ['Silla Gamer Ejecutiva', 'Ergonómica, con ruedas y con un contrato de permanencia de 24 meses.'],
];
const TV_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="4" width="16" height="11" rx="2.5" fill="#7df3ff" style="stroke: var(--outline)" stroke-width="1.6"/><path d="M8.3 7.3v5.4l4.6-2.7z" fill="#20102c"/><path d="M7 18h6" stroke="#20102c" stroke-width="1.8" stroke-linecap="round"/></svg>';
function adsState() {
  const A = SAVE.ads || (SAVE.ads = { day: '', n: 0, by: {}, noAds: false }), d = todayStr();
  if (A.day !== d) { A.day = d; A.n = 0; A.by = {}; }
  return A;
}
const adsFree = () => !!adsState().noAds;
function adLeft(slot) { const A = adsState(), S2 = ADS.slots[slot]; return Math.max(0, Math.min(S2.max - (A.by[slot] || 0), ADS.dayMax - A.n)); }
// botón de anuncio: «▶ texto» y cuántos quedan hoy
function adBtn(slot, label, extra) {
  const left = adLeft(slot), free = adsFree();
  return `<button class="ad-btn ol${free ? ' free' : ''}" data-ad="${slot}" ${left ? '' : 'disabled'} ${extra || ''}>${free ? '' : TV_SVG}<span>${label}</span><small>${left ? (free ? 'Sin anuncios · ' : '') + `quedan ${left} hoy` : 'Mañana más'}</small></button>`;
}
// ver un anuncio y, al acabar, dar el premio
let adRun = null;
function watchAd(slot, onReward) {
  if (!adLeft(slot)) { toast(adsState().n >= ADS.dayMax ? `Ya has visto los ${ADS.dayMax} anuncios de hoy. ¡Mañana más!` : 'Por hoy ya no quedan más aquí. ¡Mañana más!'); play('deny'); return; }
  const done = () => { const A = adsState(); A.n++; A.by[slot] = (A.by[slot] || 0) + 1; stat('ads', 1); onReward(); saveGame(); updateWallets(); };
  if (adsFree()) { play('crown'); done(); return; }
  adOverlay(); const ov = $('#ad-screen'), J = pick(AD_JOKES);
  $('#ad-prod').textContent = J[0]; $('#ad-line').textContent = J[1];
  ov.hidden = false; play('select');
  let t = ADS.secs; const tick = () => {
    const b = $('#ad-get');
    if (t > 0) { b.disabled = true; b.textContent = `El premio llega en ${t}…`; $('#ad-bar').style.setProperty('--p', ((ADS.secs - t) / ADS.secs * 100) + '%'); t--; adRun = setTimeout(tick, 1000); return; }
    $('#ad-bar').style.setProperty('--p', '100%'); b.disabled = false; b.textContent = 'RECOGER PREMIO'; play('levelup');
  };
  clearTimeout(adRun); tick();
  $('#ad-get').onclick = () => { if (t > 0) return; ov.hidden = true; play('crown'); done(); };
  $('#ad-skip').onclick = () => { clearTimeout(adRun); ov.hidden = true; play('select'); toast('Anuncio cerrado: sin premio'); };
}
function adOverlay() {
  if ($('#ad-screen')) return;
  $('#ui').insertAdjacentHTML('beforeend', `<section id="ad-screen" class="ad-screen" hidden role="dialog" aria-label="Anuncio">
    <div class="ad-card"><div class="ad-top"><span class="ad-flag">ANUNCIO</span><span>Un mensaje de nuestros patrocinadores… que somos nosotros.</span></div>
      <div class="ad-body"><div class="ad-logo ol">MICROBLIZZ</div><b class="ad-prod ol" id="ad-prod"></b><p class="ad-line" id="ad-line"></p></div>
      <div class="ad-bar" id="ad-bar"><i></i></div>
      <button class="btn-big ol" id="ad-get" disabled>…</button>
      <button class="btn-link" id="ad-skip">Cerrar sin premio</button>
      <p class="ad-note">Anuncio de prueba. En la app de Google Play aquí saldrá un anuncio de verdad.</p></div></section>`);
}
// ---- sitios donde se ofrece
function adIdleUI() {   // HORAS EXTRA: turbo y ganancias de 4 h al momento (v0.9.18: el x2 va en la ventana de RECOGER)
  const box = $('#idle-ads'); if (!box) return;
  const I = idleState(), now = Date.now(), on = (I.turbo || 0) > now;
  const key = [on ? Math.ceil((I.turbo - now) / 60000) : 0, adLeft('idle4'), adLeft('turbo'), adsFree()].join('|');
  if (box.dataset.k === key) return; box.dataset.k = key;
  const mins = on ? Math.ceil((I.turbo - now) / 60000) : 0;
  box.innerHTML = (on ? `<span class="ad-turbo ol">TURBO x2 · ${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}</span>` : adBtn('turbo', `TURBO ${ADS.turboH} h`))
    + adBtn('idle4', `GANANCIAS DE ${ADS.idleH} h`);
  for (const b of box.querySelectorAll('[data-ad]')) b.onclick = () => {
    if (b.dataset.ad === 'turbo') watchAd('turbo', () => { const J = idleTick(); J.turbo = Math.max(Date.now(), J.turbo || 0) + ADS.turboH * 3600000; idleR = idleRates(J.fac); toast(`¡Turbo! ${ADS.turboH} horas ganando el doble`, true); box.dataset.k = ''; adIdleUI(); idleUI(true); });
    else watchAd('idle4', () => { idleGrantHours(ADS.idleH); box.dataset.k = ''; adIdleUI(); });
  };
}
// cobrar al momento lo que el líder gana en N horas (no toca lo que ya lleva acumulado)
function idleGrantHours(h) {
  const I = idleTick(), R = idleRates(I.fac), g = Math.round(R.gold * h), gm = Math.floor(R.gems * h), it = R.item * h, ni = Math.floor(it) + (Math.random() < it % 1 ? 1 : 0);
  SAVE.gold += g; SAVE.gems += gm; const got = []; for (let i = 0; i < ni; i++) got.push(idleItem());
  stat('idleg', g, true); stat('idlem', gm, true); achScan(); saveGame(); updateWallets(); play('crown'); idleBurst();
  toast(`${h} horas de golpe: +${fmt(g)} de oro${gm ? ` y +${fmt(gm)} ${gm > 1 ? 'gemas' : 'gema'}` : ''}${got.length ? ` y ${got.length > 1 ? got.length + ' objetos' : 'un objeto'}` : ''}`, true);
}
// v0.9.18: al pulsar RECOGER sale una ventana con lo que vas a cobrar, y la opción de doblarlo con un anuncio
function idleCollectBox() {
  const I = idleTick(), g = Math.floor(I.gold), gm = Math.floor(I.gems), ni = Math.floor(I.items);
  if (g < 1 && gm < 1 && ni < 1) { play('deny'); toast('Todavía no hay nada. ¡Dale un rato a tu líder!'); return; }
  $('#ib-sub').textContent = `${CFG.cards[FACTIONS[I.fac].leader].name} ha trabajado ${fmtV(Math.floor(I.h * 10) / 10)} h. Esto es lo que ha ganado:`;
  $('#ib-loot').innerHTML = `<span class="rw-chip big ol">${COIN_SVG}${fmt(g)}</span>${gm ? `<span class="rw-chip big ol">${GEM_SVG}${fmt(gm)}</span>` : ''}${ni ? `<span class="rw-chip big ol">${CHEST_SVG}x${ni}</span>` : ''}`;
  $('#ib-row').innerHTML = `<button class="btn-big ol" id="btn-ib-get">RECOGER</button>${adBtn('idle2', 'RECOGER x2')}`;
  $('#scr-idlebox').hidden = false; play('select');
  $('#btn-ib-get').onclick = () => { $('#scr-idlebox').hidden = true; idleCollect(); };
  $('#ib-row [data-ad]').onclick = () => watchAd('idle2', () => { $('#scr-idlebox').hidden = true; idleCollect(true); });
}
$('#btn-ib-close').addEventListener('click', () => { $('#scr-idlebox').hidden = true; play('select'); });
function adEndOffer(R) {   // pantalla final: premio x2 (oro y gemas; la experiencia no)
  if (!(R.gold > 0 || R.gems > 0)) return;
  const box = $('#end-rewards'); box.insertAdjacentHTML('beforeend', `<div class="ad-end">${adBtn('end2', 'PREMIO x2')}</div>`);
  const b = box.querySelector('[data-ad="end2"]');
  b.onclick = () => watchAd('end2', () => {
    SAVE.gold += R.gold || 0; SAVE.gems += R.gems || 0;
    b.parentNode.innerHTML = `<span class="rw-chip big ol">¡PREMIO DOBLADO! ${R.gold ? `${COIN_SVG}+${fmt(R.gold)}` : ''} ${R.gems ? `${GEM_SVG}+${fmt(R.gems)}` : ''}</span>`;
    toast('Premio doblado', true);
  });
}
function adGachaOffer() {   // una tirada gratis al día
  const box = $('#gacha-ad'); if (!box) return;
  const slot = 'pull_' + (ADS.slots['pull_' + gachaTab] ? gachaTab : 'ab');   // v0.9.23: cada máquina tiene sus propias tiradas gratis
  box.innerHTML = adBtn(slot, 'TIRADA GRATIS EN ESTA MÁQUINA');
  box.querySelector('[data-ad]').onclick = () => watchAd(slot, () => { SAVE.tickets = (SAVE.tickets || 0) + 1; pull(1); });
}
function adShopOffer() {   // regalo diario x2 y el pack «Sin anuncios»
  const gift = document.querySelector('#gift-row .pack.gift');
  if (gift && !giftReady() && adsState().gift2day !== todayStr()) {
    gift.insertAdjacentHTML('beforeend', `<div class="ad-gift">${adBtn('gift2', 'REGALO x2')}</div>`);
    gift.querySelector('[data-ad="gift2"]').onclick = () => watchAd('gift2', () => { const g = SHOP.gift; adsState().gift2day = todayStr(); SAVE.gold += g.gold; SAVE.gems += g.gems; buildShop(); toast(`+${g.gold} de oro y +${g.gems} gemas`, true); });
  }
  const A = adsState();
  $('#gift-row').insertAdjacentHTML('beforeend', A.noAds
    ? `<div class="pack noads"><div class="pk-ic">${TV_SVG}</div><div><div class="pk-name ol">Sin anuncios</div><div class="pk-note">Ya lo tienes: los premios de los anuncios llegan al momento. Hoy: ${A.n} de ${ADS.dayMax}.</div></div></div>`
    : `<div class="pack noads"><span class="joke-flag">PARA SIEMPRE</span><div class="pk-ic">${TV_SVG}</div><div><div class="pk-name ol">Sin anuncios</div><div class="pk-note">Los premios de los anuncios (tirada gratis, premio x2, turbo…) te llegan al momento, sin ver nada. Hasta ${ADS.dayMax} al día.</div></div><button class="btn-price ol" id="btn-noads">${eur(ADS.noAdsEur)}</button></div>`);
  const b = $('#btn-noads'); if (b) b.onclick = () => { play('select'); confirmBox('¿COMPRAR?', `Sin anuncios<span class="big">PARA SIEMPRE</span>por <b>${eur(ADS.noAdsEur)}</b><small>Versión de prueba: no se cobra nada y te lo llevas gratis.</small>`, 'COMPRAR', () => { adsState().noAds = true; stat('noads', 1); saveGame(); play('win'); buildShop(); toast('Sin anuncios: los premios te llegan al momento'); }); };
}
function adMissionOffer(L) {   // cambiar una misión diaria que no te guste
  const rows = document.querySelectorAll('#mission-list .mission');
  L.forEach((m, i) => {
    if (i === 0 || m.claimed || m.prog >= mDef(m, false).goal || !rows[i]) return;   // la de «5 diarias» no se cambia
    rows[i].insertAdjacentHTML('beforeend', adBtn('swap', 'CAMBIAR', `data-mi="${i}"`));
  });
  for (const b of document.querySelectorAll('#mission-list [data-ad="swap"]')) b.onclick = () => watchAd('swap', () => {
    const i = +b.dataset.mi, used = SAVE.daily.list.map(x => x.id), pool = MISSIONS.filter(x => !used.includes(x.id) && x.id !== 'gift'), M = pick(pool);
    const facs = FACTION_ORDER.filter(isUnlocked);
    SAVE.daily.list[i] = { id: M.id, prog: 0, claimed: false, fac: M.ev === 'facwin' ? pick(facs) : undefined };
    buildMissions(); toast('Misión cambiada', true);
  });
}
