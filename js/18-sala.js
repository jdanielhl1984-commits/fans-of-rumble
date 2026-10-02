// Fans of Rumble · Sala de pruebas: sin premios, CAOS infinito y tú decides qué enemigos salen
'use strict';
/* ---------- v0.9.20: sala de pruebas ----------
   Para probar mazos, hechizos, habilidades y equipo sin consecuencias.
   · CAOS infinito y el tiempo no corre. Las torres y las sedes no se caen.
   · Panel arriba a la izquierda: rival (facción), sacar enemigos (grupo, tanque, sanador, tiradores, líder),
     IA del rival sí/no, limpiar el campo, cambiar de campo (el normal o el de cualquier jefe) y contador de daño.
   · No da oro, ni experiencia, ni cuenta para misiones o logros. */
const SB = { fac: 'microblizz', ai: false, terrain: null, dmg: 0, win: [], t0: 0 };
const SB_FACS = () => ['microblizz', 'phony'].concat(FACTION_ORDER.filter(f => FACTIONS[f].leader));
const SB_FIELDS = [null].concat(Object.keys(TERRAINS));
function sbPool(f) { const F = FACTIONS[f]; return F.units.slice(); }
function sbPick(kind) {
  const f = SB.fac, F = FACTIONS[f], pool = sbPool(f), U = k => CFG.units[k] || {};
  if (kind === 'leader') return F.leader || pick(pool);
  if (kind === 'tank') return pool.slice().sort((a, b) => U(b).hp * ((cardDef(b) || {}).count || 1) - U(a).hp * ((cardDef(a) || {}).count || 1))[0];
  if (kind === 'healer') return pool.find(k => U(k).healer) || null;
  if (kind === 'ranged') return pool.filter(k => U(k).range >= 60).sort(() => Math.random() - 0.5)[0] || null;
  return pick(pool);
}
function sbSpawn(kind) {
  if (G.state !== 'play') return;
  const list = kind === 'group' ? [sbPick('tank'), sbPick('ranged'), sbPick('any')].filter(Boolean) : [sbPick(kind)];
  if (!list[0]) { toast(kind === 'healer' ? 'Este rival no tiene sanadores' : 'Este rival no tiene de esos'); play('deny'); return; }
  list.forEach((k, i) => { S.e.chaos = 99; doDeploy('e', k, clamp(270 + (i - (list.length - 1) / 2) * 90 + rand(-30, 30), 40, W - 40), rand(300, 360)); });
  play('deploy');
}
function sbDamage(n) { SB.dmg += n; SB.win.push([G.t, n]); }
function sbTick() {
  const p = $('#sb-panel'); if (!p) return;
  const now = G.t; SB.win = SB.win.filter(w => now - w[0] <= 5);
  const dps = SB.win.reduce((a, w) => a + w[1], 0) / 5;
  const el = $('#sb-dmg'); if (el) el.innerHTML = `Daño al rival: <b>${fmt(SB.dmg)}</b> · <b>${fmt(dps)}</b>/s`;
}
function sbPanel() {
  let p = $('#sb-panel');
  if (!p) {
    $('#ui').insertAdjacentHTML('beforeend', `<div class="sb-panel" id="sb-panel" hidden>
      <div class="sb-row"><button class="sb-b ol" id="sb-fac"></button><button class="sb-b ol" id="sb-field"></button></div>
      <div class="sb-row"><button class="sb-b add ol" data-sb="group">+ GRUPO</button><button class="sb-b add ol" data-sb="tank">+ TANQUE</button><button class="sb-b add ol" data-sb="healer">+ SANADOR</button><button class="sb-b add ol" data-sb="ranged">+ TIRADOR</button><button class="sb-b add ol" data-sb="leader">+ LÍDER</button></div>
      <div class="sb-row"><button class="sb-b ol" id="sb-ai"></button><button class="sb-b ol" id="sb-clear">LIMPIAR</button><button class="sb-b ol" id="sb-zero">CONTADOR A 0</button></div>
      <div class="sb-dmg" id="sb-dmg"></div></div>`);
    p = $('#sb-panel');
    for (const b of p.querySelectorAll('[data-sb]')) b.addEventListener('click', () => sbSpawn(b.dataset.sb));
    $('#sb-fac').addEventListener('click', () => { const L = SB_FACS(); SB.fac = L[(L.indexOf(SB.fac) + 1) % L.length]; G.efac = SB.fac; play('select'); sbLabels(); });
    $('#sb-field').addEventListener('click', () => { SB.terrain = SB_FIELDS[(SB_FIELDS.indexOf(SB.terrain) + 1) % SB_FIELDS.length]; G.terrain = SB.terrain; terrainStart(); play('select'); sbLabels(); });
    $('#sb-ai').addEventListener('click', () => { SB.ai = !SB.ai; play('select'); sbLabels(); });
    $('#sb-clear').addEventListener('click', () => { for (const u of units) if (u.team === 'e') u.alive = false; units = units.filter(u => u.alive); spells.length = 0; play('select'); });
    $('#sb-zero').addEventListener('click', () => { SB.dmg = 0; SB.win = []; sbTick(); play('select'); });
  }
  sbLabels(); return p;
}
function sbLabels() {
  const F = FACTIONS[SB.fac];
  $('#sb-fac').textContent = 'RIVAL: ' + (SB.fac === 'microblizz' ? 'MICROBLIZZ' : SB.fac === 'phony' ? 'PHONY' : F.name.toUpperCase()) + ' ▸';
  $('#sb-field').textContent = 'CAMPO: ' + (SB.terrain ? TERRAINS[SB.terrain].name : 'NORMAL') + ' ▸';
  $('#sb-ai').textContent = SB.ai ? 'IA RIVAL: SÍ' : 'IA RIVAL: NO';
}
// enseñar u ocultar el panel según el modo
setInterval(() => { const on = G.mode === 'sandbox' && (G.state === 'play' || G.state === 'paused' || G.state === 'countdown'); const p = on ? sbPanel() : $('#sb-panel'); if (p) p.hidden = !on; }, 300);
$('#btn-sandbox').addEventListener('click', () => { play('select'); SB.dmg = 0; SB.win = []; openPrep('sandbox'); });
