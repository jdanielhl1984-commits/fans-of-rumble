// Fans of Rumble · Perfil del jugador: tu nombre (el de la Arena y el chat), tu avatar y tus números
'use strict';
/* ---------- v0.9.26 ----------
   · La primera vez, Lola te pregunta cómo te llamas (antes del tutorial, o al entrar si ya lo habías hecho).
   · El nombre sale en la Arena, en el chat de las partidas y en los mensajes de Lola.
   · Botón con tu avatar y tu nombre arriba a la izquierda del menú: abre tu PERFIL.
   · En el perfil: cambiar el nombre, elegir avatar (los líderes de tus facciones) y tus números. */
const NAME_MIN = 3, NAME_MAX = 14;
const NAME_IDEAS = ['ConejoRebelde', 'AntiMicroblizz', 'BecarioLibre', 'SinPaseDeBatalla', 'DespedidoPro', 'ArdillaFuriosa', 'ElQueNoPaga', 'ZorroSigiloso', 'HotfixHumano', 'CEOdeNada',
  'JefaDelCaos', 'CaosConPatas', 'NoAlCrunch', 'ReyDelParche', 'TiradaGratis', 'SinMicropagos', 'LolaFan', 'ConejoLoco', 'DiscoFísico', 'MapacheJefe'];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pname = () => SAVE.name || 'Jugador';
// deja letras (con acentos y ñ), números, espacios y _ - .  · quita espacios repetidos
function cleanName(s) { return String(s || '').replace(/[^\p{L}\p{N} _.\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX); }
function randomName() { let n; do n = pick(NAME_IDEAS) + (Math.random() < 0.6 ? Math.floor(rand(1, 99)) : ''); while (n.length > NAME_MAX || n === SAVE.name); return n; }
function avatarOf() { const a = SAVE.avatar; if (a && avatarList().includes(a)) return a; return (FACTIONS[SAVE.lastFac] || FACTIONS.animales).leader || 'bunny'; }
function avatarList() { return FACTION_ORDER.filter(f => FACTIONS[f].leader && (SAVE.unlocked.includes(f) || SAVE.testAll)).map(f => FACTIONS[f].leader); }

/* ---------- ¿cómo te llamas? ---------- */
let nameFirst = false;
function openName(first) {
  nameFirst = !!first;
  $('#name-title').textContent = first ? '¿CÓMO TE LLAMAS?' : 'CAMBIAR NOMBRE';
  $('#name-text').innerHTML = first
    ? '<b>¡Hola! Soy Lola</b>, me despidió Microblizz. Antes de empezar, ¿cómo quieres que te llame? Será tu nombre en la <b>Arena</b> y en el chat.'
    : 'Así te verán en la <b>Arena</b> y en el chat de las partidas.';
  $('#name-cancel').hidden = first;
  const inp = $('#name-in'); inp.value = SAVE.name || ''; $('#name-err').textContent = '';
  $('#scr-name').hidden = false;
  setTimeout(() => { try { inp.focus(); } catch (e) { /* sin foco */ } }, 60);
}
function nameOk() {
  const n = cleanName($('#name-in').value);
  if (n.length < NAME_MIN) { $('#name-err').textContent = `Tiene que tener al menos ${NAME_MIN} letras o números.`; play('deny'); return; }
  const first = !SAVE.name;
  SAVE.name = n; if (!SAVE.since) { const d = new Date(); SAVE.since = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  saveGame(); $('#scr-name').hidden = true; play('select');
  toast(first ? `¡Encantada, ${n}!` : `Ahora te llamas ${n}`, true);
  profileChip(); if (!$('#scr-profile').hidden) buildProfile();
  if (SAVE.tut.done) titlePopups(); else tutTick();
}
$('#name-ok').addEventListener('click', nameOk);
$('#name-in').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); nameOk(); } });
$('#name-in').addEventListener('input', () => { $('#name-err').textContent = ''; });
$('#name-dice').addEventListener('click', () => { $('#name-in').value = randomName(); $('#name-err').textContent = ''; play('roll'); });
$('#name-cancel').addEventListener('click', () => { $('#scr-name').hidden = true; play('select'); });

/* ---------- botón del menú ---------- */
function profileChip() {
  const b = $('#btn-profile'); if (!b) return;
  b.querySelector('.pc-name').textContent = SAVE.name || 'TU PERFIL';
  const A = SAVE.arena; b.querySelector('.pc-sub').textContent = 'Liga ' + arenaLeague(A ? A.cups : 0);
  drawArt(b.querySelector('canvas'), avatarOf(), 34, 34);
}
$('#btn-profile').addEventListener('click', () => { play('select'); if (!SAVE.name) { openName(true); return; } buildProfile(); $('#scr-profile').hidden = false; });
$('#profile-close').addEventListener('click', () => { $('#scr-profile').hidden = true; play('select'); profileChip(); });
$('#profile-name').addEventListener('click', () => { play('select'); openName(false); });

/* ---------- pantalla de perfil ---------- */
function campStars() {
  let got = 0, max = 0;
  for (const w of WORLDS) for (const l of w.levels) { max += 3; got += starsD(l.id, 'n'); }
  return [got, max];
}
function buildProfile() {
  const A = SAVE.arena || { cups: 0, best: 0, w: 0, l: 0 }, L = arenaLeague(A.cups), T = achTotals(), [sg, sm] = campStars();
  const fa = FACTION_ORDER.filter(f => FACTIONS[f].leader), fu = fa.filter(f => SAVE.unlocked.includes(f)).length;
  const games = A.w + A.l, pct = games ? Math.round(A.w / games * 100) + ' %' : '—';
  const since = SAVE.since ? SAVE.since.split('-').reverse().join('/') : '—';
  const cell = (k, v, s) => `<div class="pf-cell"><small>${k}</small><b class="ol">${v}</b>${s ? `<i>${s}</i>` : ''}</div>`;
  $('#profile-who').textContent = pname();
  $('#profile-league').textContent = `Liga ${L} · ${fmt(A.cups)} copas`;
  $('#profile-stats').innerHTML =
    cell('ARENA', `${A.w} - ${A.l}`, `ganadas - perdidas · ${pct}`) +
    cell('RÉCORD DE COPAS', fmt(A.best), 'tu mejor marca') +
    cell('CAMPAÑA', `${sg} / ${sm} ★`, 'estrellas en normal') +
    cell('LOGROS', `${T.n} / ${T.N}`, 'niveles conseguidos') +
    cell('FACCIONES', `${fu} / ${fa.length}`, 'desbloqueadas') +
    cell('MEJOR RACHA', `${(SAVE.login && SAVE.login.best) || 0} días`, `jugando desde ${since}`);
  const cur = avatarOf();
  $('#profile-avs').innerHTML = avatarList().map(k => `<button class="pf-av${k === cur ? ' on' : ''}" data-av="${k}" aria-label="Avatar: ${esc(CFG.cards[k] ? CFG.cards[k].name : k)}"><canvas></canvas></button>`).join('');
  for (const b of document.querySelectorAll('#profile-avs .pf-av')) {
    drawArt(b.querySelector('canvas'), b.dataset.av, 46, 46);
    b.addEventListener('click', () => { SAVE.avatar = b.dataset.av; saveGame(); play('select'); buildProfile(); profileChip(); });
  }
  drawArt($('#profile-av'), cur, 96, 96);
}
try { profileChip(); } catch (e) { /* se pinta al volver al menú */ }
