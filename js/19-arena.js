// Fans of Rumble · Arena sin internet: «jugadores» inventados, copas y ligas
'use strict';
/* ---------- v0.9.20: arena ----------
   Hasta que haya servidor, la arena enfrenta tu mazo a mazos de «jugadores» inventados (los maneja la CPU).
   · Eliges uno de 3 rivales. Cuantas más copas tienes, más nivel tienen.
   · Ganar: +copas, oro y gemas. Perder: -copas.
   · Ligas: Becario, Junior, Senior, Director y CEO. Se guarda tu récord. */
const ARENA = {
  leagues: [['Becario', 0], ['Junior', 200], ['Senior', 500], ['Director', 900], ['CEO', 1400]],
  win: 25, lose: 12, gold: [60, 15], gems: 5, lvlEvery: 120,
  names: ['xX_Noob_Xx', 'ElQuePagaTodo', 'BallenaDorada', 'SinSueño_Dev', 'MamáDelStreamer', 'PatataLag', 'ProDeLaTarde', 'CEO_Secreto', 'BecarioFurioso', 'RageQuitter',
    'ElDelParche', 'DiscoFísicoYa', 'TiradaX50', 'NerfConejo', 'ModoBallena', 'JugadorDeLunes', 'LagEnMiCasa', 'MeLoHeComprado', 'SoloÉpicas', 'GatoTeclista',
    'SuscriptorPlus', 'ElDeLasLoot', 'NoTengoPase', 'CrunchMaster', 'AbuelaGamer', 'TryHard3000', 'ElDeMicroblizz', 'PayStationFan', 'ReviewBomber', 'SinDiscos'],
};
const arenaFacs = () => FACTION_ORDER.filter(f => FACTIONS[f].leader);
function arenaState() {
  const A = SAVE.arena || (SAVE.arena = { cups: 0, best: 0, w: 0, l: 0, rivals: null, sel: 0 });
  if (!A.rivals || A.rivals.length !== 3) { A.rivals = arenaRoll(A.cups); A.sel = 0; }
  return A;
}
function arenaLeague(c) { let L = ARENA.leagues[0]; for (const l of ARENA.leagues) if (c >= l[1]) L = l; return L[0]; }
function arenaRoll(cups) {
  const base = clamp(1 + Math.floor(cups / ARENA.lvlEvery), 1, 12), used = new Set();
  return [-1, 0, 1].map(d => {
    let n; do n = pick(ARENA.names); while (used.has(n)); used.add(n);
    const f = pick(arenaFacs()), F = FACTIONS[f], pool = F.units.concat(F.gacha || []);
    let sp = 0; const deck = pool.slice().sort(() => Math.random() - 0.5).filter(k => !isSpell(k) || ++sp <= DECK_SPELLS).slice(0, 6);
    return { name: n + (Math.random() < 0.5 ? Math.floor(rand(1, 99)) : ''), fac: f, lvl: clamp(base + d, 1, 12), deck, cups: Math.max(0, cups + d * 40 + Math.floor(rand(-30, 30))) };
  });
}
function arenaGold(lgName) { return ARENA.gold[0] + ARENA.gold[1] * ARENA.leagues.findIndex(l => l[0] === lgName); }
function buildArenaPrep() {
  const A = arenaState(), L = arenaLeague(A.cups);
  const card = (r, i) => { const F = FACTIONS[r.fac]; return `<button class="ar-r${A.sel === i ? ' on' : ''}" data-ar="${i}"><canvas data-arl="${F.leader}"></canvas><span><b>${r.name}</b><small>${F.name} · nivel ${r.lvl} · ${fmt(r.cups)} copas</small></span></button>`; };
  $('#prep-info').innerHTML = `<div class="ar-head"><b class="ol">${esc(pname())}</b> · <b class="ol">LIGA ${L.toUpperCase()}</b> · <b>${fmt(A.cups)}</b> copas · récord ${fmt(A.best)} · ${A.w} ganadas, ${A.l} perdidas</div>
    <div class="ar-sub">Elige rival. Son mazos de otros «jugadores» (de momento, inventados: los maneja la CPU).</div>
    <div class="ar-list">${A.rivals.map(card).join('')}</div>
    <span class="rw">Ganar: +${ARENA.win} copas, ${arenaGold(L)} de oro y ${ARENA.gems} gemas · Perder: -${ARENA.lose} copas</span> <button class="btn-link" id="btn-ar-roll">Otros rivales</button>`;
  for (const cv of document.querySelectorAll('#prep-info canvas[data-arl]')) drawArt(cv, cv.dataset.arl, 40, 36);
  for (const b of document.querySelectorAll('[data-ar]')) b.onclick = () => { A.sel = +b.dataset.ar; saveGame(); play('select'); buildArenaPrep(); };
  $('#btn-ar-roll').onclick = () => { A.rivals = arenaRoll(A.cups); A.sel = 0; saveGame(); play('select'); buildArenaPrep(); };
}
function arenaSetup() {
  const A = arenaState(), r = A.rivals[A.sel] || A.rivals[0];
  G.arenaRival = r; G.efac = r.fac; G.elvl = r.lvl; G.bossOn = false; G.bossName = ''; G.ebaseName = r.name.toUpperCase();
  G.diffCfg = Object.assign({}, CFG.diff.normal, { aiIncome: 1, think: [0.6, 1.2] }); G.arenaDeck = r.deck.filter(k => !isSpell(k)); G.arenaSpells = r.deck.filter(isSpell);   // la CPU lanza los hechizos aparte, como en el resto de modos
}
function arenaReward(R, w) {
  const A = arenaState(), lg = arenaLeague(A.cups), win = w === 'p';
  const d = win ? ARENA.win + Math.max(0, (G.elvl - avgLevel(G.faction)) * 3) : w === 'e' ? -ARENA.lose : 0;
  A.cups = Math.max(0, A.cups + d); A.best = Math.max(A.best, A.cups); if (win) A.w++; else if (w === 'e') A.l++;
  R.gold = win ? arenaGold(lg) : 10; if (win) R.gems = ARENA.gems;
  R.arena = { d, cups: A.cups, league: arenaLeague(A.cups) };
  if (win) missionEvent('arenawin', 1); missionEvent('arena', 1);
  A.rivals = arenaRoll(A.cups); A.sel = 0;
}
$('#btn-arena').addEventListener('click', () => { play('select'); openPrep('arena'); });
