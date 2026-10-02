// Fans of Rumble · Estado de la partida
'use strict';
/* =========================================================
   STATE
   ========================================================= */
const G = { state: 'title', t: 0, time: CFG.matchTime, double: false, diff: 'easy', diffCfg: CFG.diff.easy, faction: 'animales', efac: 'microblizz', mode: 'quick', level: null, bossOn: true, bossName: 'SurvivalBot', ebaseName: 'SURVIVALBOT', elvl: 1, timeScale: 1, slowmo: 1, shake: 0, autoplay: false, endT: 0, winner: null, endReason: '', tutSeen: false, rewards: null };
try { const d = localStorage.getItem('for-diff'); if (d && CFG.diff[d]) { G.diff = d; G.diffCfg = CFG.diff[d]; } } catch (e) { /* storage blocked */ }
if (FACTION_ORDER.includes(SAVE.lastFac) && isUnlocked(SAVE.lastFac)) G.faction = SAVE.lastFac;
const facOf = team => (team === 'p' ? G.faction : G.efac);
// v0.9.13: la empresa que está detrás del rival (en la campaña 2 es Phony)
const ownerOf = () => { const wi = G.mode === 'camp' && G.level ? G.level.wi : G.mode === 'boss' && G.bossWi != null ? G.bossWi : -1, c = wi >= 0 ? WORLDS[wi].camp : 0; return c === 3 ? 'iahorro' : c === 2 ? 'phony' : 'microblizz'; };   // v0.9.23: la campaña 3 es de IAhorro
const ownerName = () => CORP[ownerOf()];
let revives = [];
let S = null;
let units = [], structs = [], projs = [], parts = [], nums = [];
const towers = { p: [], e: [] }, bases = {};
const AI = { p: null, e: null };
let uid = 0;
let BG = null, BRIDGE_LAYER = null, READY = false;

function makeStruct(team, role, x, y, lane = -1) {
  const d = CFG.structs[role];
  const skin = FACTIONS[facOf(team)].skin;
  const muzzle = SKINS[skin][role];
  return { kind: 'struct', id: ++uid, skin, team, role, lane, x, y, r: d.r, hp: d.hp, maxHp: d.hp, dmg: d.dmg, cd: d.cd, range: d.range, atkT: 1, alive: true, hitT: 0, recoil: 0, castT: 0, smokeT: 0, hackedT: 0, cur: null, muzzleX: muzzle[0], muzzleZ: muzzle[1], corrupt: team === 'e' && !isCorp(G.efac) };
}
function resetMatch() {
  units = []; projs = []; parts = []; nums = []; revives = []; spells = []; if (typeof bannerClear === 'function' && READY) bannerClear(); hideCardTip();
  S = {
    p: { chaos: CFG.chaosStart, crowns: 0, leaderCd: 0, spent: 0, deployed: 0, kills: 0, hype: 0, hypeLvl: 0, xp: 0, xpLvl: 0, plays: {}, bossDmg: 0 },
    e: { chaos: CFG.chaosStart, crowns: 0, leaderCd: 0, spent: 0, deployed: 0, kills: 0, hype: 0, hypeLvl: 0, xp: 0, xpLvl: 0, bossT: G.diffCfg.bossCd * 0.8, phase2: false, nextDespido: true },
  };
  const EF = FACTIONS[G.efac]; S.e.deck = (G.edeck ? G.edeck.slice() : EF.units.slice()).concat(G.eextra || []); if (EF.leader) S.e.deck.push(EF.leader);
  const deck = shuffle(deckOf(G.faction)); S.p.hand = deck.slice(0, 4); S.p.queue = deck.slice(4);
  towers.p = [makeStruct('p', 'tower', 110, 575, 0), makeStruct('p', 'tower', 430, 575, 1)];
  towers.e = [makeStruct('e', 'tower', 110, 270, 0), makeStruct('e', 'tower', 430, 270, 1)];
  bases.p = makeStruct('p', 'base', 270, 700);
  bases.e = makeStruct('e', 'base', 270, 196);
  if (G.mode === 'boss') { for (const t of towers.e) { t.alive = false; t.hidden = true; } bases.e.hp = bases.e.maxHp = bossHp(G.bossWi == null ? CEO_WI : G.bossWi, G.bossDiff); }
  else if (G.level && G.level.baseHp) bases.e.hp = bases.e.maxHp = G.level.baseHp;
  else if (G.level && G.level.boss) bases.e.hp = bases.e.maxHp = 2400;
  if (G.mode === 'sandbox') for (const s of [...towers.p, ...towers.e, bases.p, bases.e]) s.hp = s.maxHp = 999999;   // v0.9.20: en la sala de pruebas no se cae nada
  structs = [...towers.p, ...towers.e, bases.p, bases.e];
  G.time = G.mode === 'boss' ? BOSS_MODE.time : CFG.matchTime; G.double = false; G.winner = null; G.shake = 0; G.slowmo = 1; G.layoffShown = false; G.subShown = false;
  AI.p = { think: 1.5, plan: null }; AI.e = { think: 2.5, plan: null };
  input.card = null; input.slot = null; input.dragging = false; input.selected = null; input.selSlot = null; input.ghost = null; input.pointerId = null;
  hud.reset();
}

