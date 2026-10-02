// Fans of Rumble · Instalar como app y pantalla de preparación
'use strict';
// ---- instalar en el móvil como una app
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });
window.addEventListener('appinstalled', () => { installEvt = null; toast('¡Instalado! Ya lo tienes en tu pantalla de inicio', true); });
const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
function installApp() {
  play('select');
  if (isStandalone()) { toast('Ya lo estás usando como app', true); return; }
  if (installEvt) { const e = installEvt; installEvt = null; e.prompt(); return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const web = location.protocol === 'https:';
  confirmBox('INSTALAR EN EL MÓVIL', (web ? '' : '<b>Ábrelo desde la web del juego</b> (no desde un archivo) para poder instalarlo.<br><br>') + (ios ? 'En iPhone, con <b>Safari</b>: toca el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba) y luego <b>«Añadir a pantalla de inicio»</b>.' : 'En Android, con <b>Chrome</b>: toca el menú <b>⋮</b> (arriba a la derecha) y luego <b>«Instalar aplicación»</b> o <b>«Añadir a pantalla de inicio»</b>.') + '<small>Se abre como una app, a pantalla completa, y también funciona sin internet.</small>', null, null, 'ENTENDIDO');
}
$('#btn-install').addEventListener('click', installApp);
$('#btn-news').addEventListener('click', () => { play('select'); openNews(); });
$('#btn-tut').addEventListener('click', () => { play('select'); SAVE.tut = { done: false, step: 0 }; saveGame(); goHome(); toast('Tutorial reiniciado: sigue a Lola', true); });
$('#btn-play').addEventListener('click', startGame);
$('#btn-camp').addEventListener('click', () => { play('select'); openCamp(); });
$('#btn-quick').addEventListener('click', () => { play('select'); openPrep('quick'); });
$('#btn-bossmode').addEventListener('click', () => { play('select'); openPrep('boss'); });
$('#btn-coll').addEventListener('click', () => { play('select'); collFac = G.faction; updateWallets(); show('scr-coll'); buildColl(); });
$('#btn-gacha').addEventListener('click', () => { play('select'); updateWallets(); openGacha(); });
$('#btn-inv').addEventListener('click', () => { play('select'); openInv(); });
for (const b of document.querySelectorAll('[data-it]')) b.addEventListener('click', () => { invTab = b.dataset.it; invFilter = 'all'; play('select'); buildInv(); $('#inv-list').scrollTop = 0; });
$('#btn-inv-sort').addEventListener('click', () => { invSort = invSort === 'q' ? 'rar' : invSort === 'rar' ? 'name' : 'q'; play('select'); buildInv(); });
$('#btn-mass').addEventListener('click', massScrap);
$('#btn-item-close').addEventListener('click', () => { $('#scr-item').hidden = true; itemCur = null; });
$('#btn-gr-inv').addEventListener('click', () => { $('#gacha-result').hidden = true; play('select'); if (gachaTab === 'cd') { collFac = cardsGoFac || collFac; updateWallets(); show('scr-coll'); buildColl(); } else openInv(gachaTab); });
$('#btn-missions').addEventListener('click', () => { play('select'); updateWallets(); buildMissions(); show('scr-missions'); });
$('#btn-options').addEventListener('click', () => { play('select'); updateWallets(); $('#opt-vol').value = SAVE.vol == null ? 100 : SAVE.vol; $('#opt-mus').value = SAVE.mus == null ? 70 : SAVE.mus; $('#btn-test').textContent = SAVE.testAll ? 'ACTIVADO' : 'ACTIVAR'; $('#btn-chat').textContent = SAVE.chatOff ? 'NO' : 'SÍ'; show('scr-options'); });
$('#btn-shop').addEventListener('click', () => { play('select'); openShop(); });
$('#btn-pass').addEventListener('click', () => { play('select'); updateWallets(); show('scr-pass'); buildPass(); });
for (const b of document.querySelectorAll('[data-st]')) b.addEventListener('click', () => { shopTab = b.dataset.st; play('select'); buildShop(); });
for (const b of document.querySelectorAll('[data-mt]')) b.addEventListener('click', () => { missionTab = b.dataset.mt; play('select'); buildMissions(); });
$('#btn-share').addEventListener('click', () => { shareResult(); stat('share', 1); });
$('#btn-share-close').addEventListener('click', () => { $('#scr-share').hidden = true; });
// v0.9.17 probó un modo claro y uno pixel art; Daniel los descartó en la v0.9.18: el juego va siempre oscuro y sin pixelar
function applyLook() { delete SAVE.theme; delete SAVE.pixel; document.documentElement.dataset.theme = 'dark'; document.body.classList.remove('pixel'); fit(); }
// v0.9.19: números de daño y sangre
function optLabels() { $('#btn-feed').textContent = SAVE.feed ? 'EN LA CAJA' : 'ENCIMA'; $('#btn-nums').textContent = SAVE.noNums ? 'NO' : 'SÍ'; $('#btn-blood').textContent = SAVE.blood ? 'SÍ' : 'NO'; }
$('#btn-nums').addEventListener('click', () => { SAVE.noNums = !SAVE.noNums; saveGame(); play('select'); optLabels(); });
$('#btn-feed').addEventListener('click', () => { SAVE.feed = !SAVE.feed; saveGame(); play('select'); optLabels(); });
$('#btn-blood').addEventListener('click', () => { SAVE.blood = !SAVE.blood; saveGame(); play('select'); optLabels(); });
$('#btn-options').addEventListener('click', optLabels);
$('#btn-chat').addEventListener('click', () => { SAVE.chatOff = !SAVE.chatOff; saveGame(); $('#btn-chat').textContent = SAVE.chatOff ? 'NO' : 'SÍ'; play('select'); });
for (const b of document.querySelectorAll('[data-back]')) b.addEventListener('click', () => { play('select'); goHome(); });
$('#btn-prep-back').addEventListener('click', () => { if (G.prep && G.prep.mode === 'camp') openCamp(); else goHome(); });
$('#btn-pick-close').addEventListener('click', () => { $('#scr-pick').hidden = true; });
for (const b of document.querySelectorAll('[data-gt]')) b.addEventListener('click', () => { gachaTab = b.dataset.gt; play('select'); buildGachaText(); });
for (const b of document.querySelectorAll('[data-pull]')) b.addEventListener('click', () => pull(+b.dataset.pull));
document.addEventListener('click', e => { const w = e.target.closest && e.target.closest('[data-wal]'); if (!w) return; play('select'); openShop(w.dataset.wal); });
$('#btn-gr-ok').addEventListener('click', () => { $('#gacha-result').hidden = true; });
$('#btn-howto').addEventListener('click', () => { show('scr-howto'); stat('howto', 1); });
$('#btn-howto-ok').addEventListener('click', goHome);
$('#btn-pause').addEventListener('click', () => { if (G.state === 'paused') { resumeGame(); return; } if (G.state === 'play') stat('pause', 1); pauseGame(); });
$('#btn-passive').addEventListener('click', () => { const F = FACTIONS[G.faction]; banner(F.passive, F.passiveText, F.kind, true); });
$('#btn-resume').addEventListener('click', resumeGame);
$('#btn-quit').addEventListener('click', toMenu);
$('#btn-again').addEventListener('click', startGame);
$('#btn-next').addEventListener('click', () => { const nx = nextLevel(G.level); if (nx) { G.prep = { mode: 'camp', lvl: nx, cd: G.cdiff || 'n' }; startGame(); } });
$('#btn-menu').addEventListener('click', toMenu);
/* opciones */
$('#opt-vol').addEventListener('input', e => { SAVE.vol = +e.target.value; applyVolume(); saveGame(); });
$('#opt-mus').addEventListener('input', e => { SAVE.mus = +e.target.value; applyVolume(); saveGame(); });
const TEST_GOLD = 3000000;   // v0.9.16: para poder subir todas las cartas al nivel 10
$('#btn-test').addEventListener('click', () => {
  SAVE.testAll = true; SAVE.unlocked = FACTION_ORDER.slice(); SAVE.gold += TEST_GOLD; SAVE.gems += 5000;
  // v0.9.16: toda la experiencia hasta el nivel 10 (subir de nivel lo haces tú, pagando oro en la Colección)
  for (const k of Object.keys(CFG.cards)) { const us = uSave(k); let need = 0; for (let l = us.lvl; l < ECON.maxLvl; l++) need += needXp(l); us.xp = Math.max(us.xp, need); }
  saveGame(); updateWallets(); syncMenu();
  $('#btn-test').textContent = 'ACTIVADO'; toast('Modo pruebas: todo desbloqueado y toda la experiencia hasta el nivel 10'); play('crown');
});
$('#btn-export').addEventListener('click', () => {
  stat('export', 1); const code = btoa(unescape(encodeURIComponent(JSON.stringify(SAVE)))); const ta = $('#save-code'); ta.value = code; ta.select();
  try { navigator.clipboard.writeText(code).then(() => toast('Código copiado'), () => toast('Copia el código del recuadro')); } catch (e) { toast('Copia el código del recuadro'); }
});
$('#btn-import').addEventListener('click', () => {
  try { const o = JSON.parse(decodeURIComponent(escape(atob($('#save-code').value.trim())))); if (!o || o.v !== 1) throw new Error('bad');
    SAVE = migrateSave(Object.assign(newSave(), o), o); achInit(); achSoon(); saveGame(); if (!isUnlocked(G.faction)) G.faction = SAVE.unlocked[0]; setFaction(G.faction); updateWallets(); toast('Progreso cargado'); play('crown');
  } catch (e) { toast('Ese código no es válido'); play('deny'); }
});
let resetArm = 0;
$('#btn-reset').addEventListener('click', () => {
  if (performance.now() - resetArm > 3000) { resetArm = performance.now(); $('#btn-reset').textContent = '¿SEGURO?'; setTimeout(() => { $('#btn-reset').textContent = 'BORRAR'; }, 3000); return; }
  SAVE = newSave(); achInit(); saveGame(); setFaction('animales'); updateWallets(); $('#btn-reset').textContent = 'BORRAR'; $('#btn-test').textContent = 'ACTIVAR'; toast('Progreso borrado'); resetArm = 0;
});
for (const b of document.querySelectorAll('[data-diff]')) b.addEventListener('click', () => {
  G.diff = b.dataset.diff; G.diffCfg = CFG.diff[G.diff];
  try { localStorage.setItem('for-diff', G.diff); } catch (e) { /* ignore */ }
  syncMenu();
});
for (const b of document.querySelectorAll('[data-fac]')) b.addEventListener('click', () => {
  const f = b.dataset.fac; if (!isUnlocked(f)) { toast('Bloqueada: libera su mundo en la campaña'); play('deny'); return; }
  if (G.faction !== f) { setFaction(f); play('select'); }
});
function syncMenu() {
  for (const o of document.querySelectorAll('[data-diff]')) o.setAttribute('aria-pressed', String(o.dataset.diff === G.diff));
  for (const o of document.querySelectorAll('[data-fac]')) {
    const f = o.dataset.fac, lk = !isUnlocked(f); o.setAttribute('aria-pressed', String(f === G.faction)); o.classList.toggle('locked', lk);
    let tag = o.querySelector('.lock'); if (lk && !tag) { tag = document.createElement('span'); tag.className = 'lock'; tag.textContent = 'BLOQUEADA'; o.appendChild(tag); } if (!lk && tag) tag.remove();
  }
  buildPrepDeck();
  if (G.prep && G.prep.mode === 'boss' && !$('#scr-prep').hidden) buildBossPrep();
}
function buildPrepDeck() {   // v0.9.15: el mazo que vas a llevar, con un botón para cambiarlo
  const el = $('#prep-deck'); if (!el) return;
  const f = G.faction, F = FACTIONS[f]; if (!F || !isUnlocked(f)) { el.hidden = true; return; }
  el.hidden = false; const d = deckOf(f), nsp = d.filter(isSpell).length;
  el.innerHTML = `<span class="pd-lbl ol">TU MAZO<small>${nsp ? nsp + (nsp > 1 ? ' hechizos' : ' hechizo') : 'básico'}</small></span><div class="deck-mini"><span class="ld"><canvas data-pk="${F.leader}"></canvas></span>${d.map(k => `<span class="${isSpell(k) ? 'sp' : ''}"><canvas data-pk="${k}"></canvas></span>`).join('')}</div><button class="btn-ghost ol pd-edit" id="btn-prep-deck">EDITAR</button>`;
  for (const cv of el.querySelectorAll('canvas[data-pk]')) drawArt(cv, cv.dataset.pk, 30, 27);
  $('#btn-prep-deck').onclick = () => { play('select'); openDeck(f); };
}
// cambia de facción: campo, mazo, portada, base y textos
function setFaction(f) {
  G.faction = f; SAVE.lastFac = f; saveGame();
  const F = FACTIONS[f];
  BG = buildBG(f); BG_KEY = f + '|mb'; drawTitleArt(); resetMatch(); hud.update(); syncMenu();
  setTagline();
  const chip = $('#btn-passive'); chip.innerHTML = ICONS[F.icon] + (F.chip || F.passive) + '<em id="pass-n" hidden></em>'; chip.className = 'pass-chip ol ' + F.kind;
  chip.setAttribute('aria-label', `Pasiva de facción: ${F.passive}. Pulsa para ver qué hace`);
}
function setTagline() { const F = FACTIONS[G.faction]; $('#tagline').innerHTML = `<b>${F.name}</b> contra <i>Microblizz${starsD('7-4', 'n') > 0 ? ' y Phony' : ''}</i>`; }
function applyVolume() { if (master) master.gain.value = muted ? 0 : 0.55 * ((SAVE.vol == null ? 100 : SAVE.vol) / 100); if (M.bus) M.bus.gain.value = 0.7 * musVol(); }
function setSoundIcon() {
  $('#ico-sound').innerHTML = muted
    ? '<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
    : '<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.6 6a8.6 8.6 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  $('#btn-sound').setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar sonido');
}
$('#btn-sound').addEventListener('click', () => {
  muted = !muted; audioInit(); applyVolume(); if (muted) stat('mute', 1);
  try { localStorage.setItem('for-muted', muted ? '1' : '0'); } catch (e) { /* ignore */ }
  setSoundIcon();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
  if (AC) { try { if (document.hidden) AC.suspend(); else AC.resume(); } catch (e) { /* ignore */ } }
});
// el navegador solo deja sonar tras un toque: el primero arranca el audio (y con él la música del menú)
for (const ev of ['pointerdown', 'keydown']) document.addEventListener(ev, audioInit, { capture: true });
window.addEventListener('resize', fit);

function drawTitleArt() {
  const F = FACTIONS[G.faction], TH = THEMES[G.faction];
  const c = $('#title-art'); const LW = 420, LH = 200, R2 = 3; c.width = LW * R2; c.height = LH * R2;
  const x = c.getContext('2d'); x.setTransform(R2, 0, 0, R2, 0, 0); x.lineJoin = 'round'; x.clearRect(0, 0, LW, LH);
  x.fillStyle = 'rgba(0,0,0,.3)'; x.beginPath(); x.ellipse(210, 190, 192, 16, 0, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.ellipse(210, 180, 178, 24, 0, 0, Math.PI * 2); x.fillStyle = TH.title[0]; x.fill(); x.lineWidth = 3; x.strokeStyle = OL; x.stroke();
  x.beginPath(); x.ellipse(210, 175, 152, 13, 0, 0, Math.PI * 2); x.fillStyle = TH.title[1]; x.fill();
  const [a, lead, b] = F.trio, [ha, hl, hb] = F.trioH;
  drawVector(x, a, 86, 182, ha, 1);
  drawVector(x, b, 336, 182, hb, -1);
  drawVector(x, lead, 206, 188, hl, 1);
  // portraits on the faction buttons
  for (const btn of document.querySelectorAll('[data-fac]')) drawArt(btn.querySelector('canvas'), FACTIONS[btn.dataset.fac].leader, 56, 44);
}

