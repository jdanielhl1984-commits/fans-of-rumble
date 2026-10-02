// Fans of Rumble · Menús: cartera, colección, gashapón, misiones y campaña
'use strict';
/* =========================================================
   v0.9: CARTERA, COLECCIÓN, GASHAPÓN, MISIONES Y CAMPAÑA
   ========================================================= */
const COIN_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="#ffcb3d" style="stroke: var(--outline)" stroke-width="1.8"/><circle cx="10" cy="10" r="5" fill="none" stroke="#c48a10" stroke-width="1.4"/><path d="M10 6.8v6.4" stroke="#c48a10" stroke-width="1.6" stroke-linecap="round"/></svg>';
const GEM_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3h10l4 5-9 10L1 8z" fill="#ff5fd2" style="stroke: var(--outline)" stroke-width="1.6" stroke-linejoin="round"/><path d="M1 8h18M7 3l3 15M13 3l-3 15" stroke="#b81e8f" stroke-width="1" fill="none"/></svg>';
const SLOT_SVG = {
  weapon: '<svg viewBox="0 0 24 24"><path d="M5 19l3-3M7 21l-4-4M8 16L19 5l1-2-2 1L7 15z" stroke="#20102c" stroke-width="2" fill="#cdd5e0" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  head: '<svg viewBox="0 0 24 24"><path d="M4 16a8 8 0 0 1 16 0v2H4z" fill="#cdd5e0" stroke="#20102c" stroke-width="2" stroke-linejoin="round"/><path d="M8 18v-3h8v3" stroke="#20102c" stroke-width="2" fill="none"/></svg>',
  acc: '<svg viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="12" rx="3" fill="#cdd5e0" stroke="#20102c" stroke-width="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="#20102c" stroke-width="2" fill="none"/></svg>',
};
const fmt = n => Math.floor(n).toLocaleString('es-ES');
const fmtV = v => String(v).replace('.', ',');
const RANK = r => (r > 1 ? ' ' + '★'.repeat(r) : '');
const RAR_ORDER = { legendary: 0, epic: 1, rare: 2, common: 3 };
function updateWallets() {
  for (const w of document.querySelectorAll('[data-wallet]')) w.innerHTML = `<button class="wal" data-wal="gold" aria-label="Oro: ${fmt(SAVE.gold)}. Comprar más">${COIN_SVG}${fmt(SAVE.gold)}<i class="wal-plus ol">+</i></button><button class="wal" data-wal="gems" aria-label="Gemas: ${fmt(SAVE.gems)}. Comprar más">${GEM_SVG}${fmt(SAVE.gems)}<i class="wal-plus ol">+</i></button>`;
  updateBadges();
}
/* ---------- niveles ---------- */
const needXp = l => ECON.xpNeed[l] || 0, upCost = l => ECON.goldCost[l] || 0;
const canLevel = k => { const us = uSave(k); return us.lvl < ECON.maxLvl && us.xp >= needXp(us.lvl); };
function levelUp(k) {
  if (!canLevel(k)) return false;
  const us = uSave(k), cost = upCost(us.lvl);
  if (SAVE.gold < cost) { toast(`Te falta oro: ${fmt(cost - SAVE.gold)} más`); play('deny'); return false; }
  SAVE.gold -= cost; us.xp -= needXp(us.lvl); us.lvl++; missionEvent('lvlup', 1); saveGame(); play('levelup');
  toast(`¡${CFG.cards[k].name} sube a nivel ${us.lvl}!`); return true;
}
function avgLevel(f) { const F = FACTIONS[f]; const ks = [F.leader, ...F.units]; return Math.max(1, Math.round(ks.reduce((a, k) => a + uSave(k).lvl, 0) / ks.length)); }
/* ---------- colección ---------- */
let collFac = null;
function buildColl() {
  if (!collFac) collFac = G.faction;
  const F = FACTIONS[collFac], lock = !isUnlocked(collFac);
  $('#coll-tabs').innerHTML = FACTION_ORDER.map(f => `<button class="fac-tab${isUnlocked(f) ? '' : ' locked'}" data-cf="${f}" aria-pressed="${f === collFac}" style="--fc:${FAC_COLOR[f]}" aria-label="${FACTIONS[f].name}"><canvas></canvas></button>`).join('');
  for (const b of $('#coll-tabs').children) { drawArt(b.querySelector('canvas'), FACTIONS[b.dataset.cf].leader, 48, 36); b.onclick = () => { collFac = b.dataset.cf; play('select'); buildColl(); }; }
  const box = $('#passive-box'); box.className = 'passive-box ' + F.kind;
  box.innerHTML = ICONS[F.icon] + `<div><b class="ol">${F.name.toUpperCase()} · ${F.passive}</b><span>${lock ? 'Bloqueada: libera su mundo en la campaña (o activa el modo pruebas en Opciones).' : F.passiveText}</span></div>`;
  const list = $('#coll-list');
  const deckBar = lock ? '' : deckBarHtml(collFac);   // v0.9.15: el mazo de la facción
  list.innerHTML = deckBar + (lock ? '' : '<p class="coll-hint">Toca las <b>ranuras</b> de cada carta para equipar: <b>habilidades</b> en todas y <b>objetos</b> (arma, cabeza y accesorio) solo en el líder. Salen en el <b>Gashapón</b>. El número rojo dice cuántas tienes sin usar.</p>') + [F.leader, ...F.units].map(k => collRow(k, lock)).join('') + gachaRows(collFac, lock);
  for (const cv of list.querySelectorAll('canvas[data-k]')) drawArt(cv, cv.dataset.k, 62, 54);
  for (const cv of list.querySelectorAll('canvas[data-dk]')) drawArt(cv, cv.dataset.dk, 40, 36);
  const db = $('#btn-deck'); if (db) db.onclick = () => { play('select'); openDeck(collFac); };
  list.querySelectorAll('[data-goc]').forEach(b => { b.onclick = () => { play('select'); gachaTab = 'cd'; updateWallets(); openGacha(); }; });
  list.querySelectorAll('[data-up]').forEach(b => { b.onclick = () => { if (levelUp(b.dataset.up)) { updateWallets(); buildColl(); } }; });
  list.querySelectorAll('[data-ab]').forEach(b => { b.onclick = () => openPick('ab', b.dataset.ab); });
  list.querySelectorAll('[data-eq]').forEach(b => { b.onclick = () => openPick('eq', b.dataset.eq); });
  const ea = list.querySelector('[data-eqall]'); if (ea) ea.onclick = () => { play('select'); equipAll(collFac); };
}
function collRow(k, lock) {
  if (isSpell(k)) return spellRow(k, lock);   // v0.9.15
  const c = CFG.cards[k], u = CFG.units[k], us = uSave(k), max = us.lvl >= ECON.maxLvl, need = needXp(us.lvl);
  const ready = !max && us.xp >= need, cost = upCost(us.lvl), pct = max ? 100 : Math.min(100, (us.xp / need) * 100), m = 1 + (us.lvl - 1) * ECON.lvlStep;
  const es = effStats(k, collFac), bst = es.boosts.length ? `<span class="boost">Con su habilidad${isLeader(k) ? ' y su equipo' : ''}: ${es.boosts.join(', ')}</span>` : '';
  const stats = (u.healer ? `Vida ${Math.round(es.hp)} · Cura ${u.heal}` : `Vida ${Math.round(es.hp)}${c.count > 1 ? ' (x' + c.count + ')' : ''} · Daño ${Math.round(es.dmg)}`) + bst;
  const worn = wornSet();
  let slots = slotTile('ab', k, invGet(SAVE.abEquip[k]), lock, 'HABILIDAD', worn);
  if (isLeader(k)) { const E = SAVE.equip[collFac] || {}; for (const sl in SLOTS) slots += slotTile('eq', sl, invGet(E[sl]), lock, SLOTS[sl].toUpperCase(), worn); }
  const btn = max ? '<button class="btn-up max" disabled>NV MÁX</button>' : `<button class="btn-up" data-up="${k}" ${ready && !lock ? '' : 'disabled'}>SUBIR<small>${COIN_SVG}${fmt(cost)}</small></button>`;
  const allBtn = isLeader(k) && !lock && Object.keys(SAVE.equip[collFac] || {}).length && SAVE.unlocked.length > 1 ? '<button class="btn-eqall" data-eqall="1">PONER ESTE EQUIPO A TODOS LOS LÍDERES</button>' : '';
  return `<div class="coll-row" data-rarity="${c.rarity}"><canvas data-k="${k}"></canvas><div><div class="coll-name ol">${c.name}<em>Nv ${us.lvl}</em>${c.gacha ? starsHtml(k) : ''}</div><div class="deck-desc">${c.desc}</div><div class="xpbar"><i style="width:${pct}%"></i><span>${max ? 'NIVEL MÁXIMO' : `${fmt(us.xp)} / ${fmt(need)} XP`}</span></div><div class="deck-stats">${stats}</div></div>${btn}<div class="slots${isLeader(k) ? '' : ' one'}">${slots}</div>${allBtn}</div>`;
}
// v0.9.9: ranuras grandes. Vacías con borde punteado y un número rojo si tienes copias sin usar para esa ranura
function wornSet() { const w = new Set(Object.values(SAVE.abEquip)); for (const f in SAVE.equip) for (const sl in SAVE.equip[f]) w.add(SAVE.equip[f][sl]); return w; }
function slotTile(kind, key, it, lock, label, worn) {
  const D = it && defOf(it), attr = kind === 'ab' ? `data-ab="${key}"` : `data-eq="${key}"`, dis = lock ? 'disabled' : '';
  if (!D) {
    const n = kind === 'ab' ? SAVE.inv.filter(x => x.k === 'ab' && !worn.has(x.u)).length : SAVE.inv.filter(x => x.k === 'eq' && ITEMS[x.id] && ITEMS[x.id].slot === key && fitsFac(x.id, collFac)).length;
    const ic = kind === 'ab' ? '<span class="sl-plus">+</span>' : SLOT_SVG[key];
    return `<button class="slot" ${attr} ${dis} aria-label="${label}: vacía. Toca para equipar"><span class="sl-ic">${ic}</span><span class="sl-txt"><span class="sl-lbl ol">${label}</span><span class="sl-name">${n ? 'Toca para equipar' : 'Vacía · sale en el gashapón'}</span></span>${n && !lock ? `<span class="sl-n ol">${n}</span>` : ''}</button>`;
  }
  const R = RARITY[D.rar], T = QTIERS[tierOf(avgQ(it))];
  return `<button class="slot full" ${attr} ${dis} style="--qc:${T.col};--rc2:${R[2]}" aria-label="${label}: ${D.name}, calidad ${T.name}. Toca para cambiar"><span class="sl-ic" style="background:${R[1]}">${kind === 'ab' ? D.ic : SLOT_SVG[key]}</span><span class="sl-txt"><span class="sl-lbl ol">${label}</span><span class="sl-name">${D.name}</span><span class="sl-q ol">${T.name}</span></span></button>`;
}
function descOf(it) {
  const D = defOf(it), S = statsOf(it), V = valsOf(it); let t = D.desc + (it.k === 'eq' && D.fac ? ` <i class="wn">Solo para ${CFG.cards[FACTIONS[D.fac].leader].name}.</i>` : '');
  S.forEach((st, i) => { t = t.replace(i === 0 && t.includes('{v}') ? '{v}' : '{' + i + '}', `<b class="sv">${fmtV(V[i])}</b>`); });
  return t;
}
const rangeTxt = it => { const S = statsOf(it); return (S.length > 1 ? 'Rangos: ' : 'Rango: ') + S.map(st => `${fmtV(rnd(st.c * 0.5, st.dec))}–${fmtV(rnd(st.c * 1.5, st.dec))}`).join(' · '); };
const qBadge = (it, big) => { const q = avgQ(it), T = QTIERS[tierOf(q)]; return `<span class="qbadge" style="--qc:${T.col}">${big ? 'CALIDAD ' + T.name.toUpperCase() : T.name} · ${Math.round(q * 100)} %</span>`; };
const sortInv = (a, b) => RAR_ORDER[defOf(a).rar] - RAR_ORDER[defOf(b).rar] || defOf(a).name.localeCompare(defOf(b).name) || avgQ(b) - avgQ(a);
function wearer(it) {   // nombre de la carta que lo lleva puesto (o null)
  if (it.k === 'ab') { for (const k in SAVE.abEquip) if (SAVE.abEquip[k] === it.u) return CFG.cards[k] ? CFG.cards[k].name : k; return null; }
  const ws = []; for (const f in SAVE.equip) for (const sl in SAVE.equip[f]) if (SAVE.equip[f][sl] === it.u && FACTIONS[f]) ws.push(CFG.cards[FACTIONS[f].leader].name);
  if (!ws.length) return null; if (ws.length > 2 && ws.length >= SAVE.unlocked.length) return 'todos tus líderes';   // v0.9.15: un objeto lo pueden llevar varios líderes
  return ws.length === 1 ? ws[0] : ws.length === 2 ? ws.join(' y ') : `${ws[0]} y ${ws.length - 1} más`;
}
function unequip(it) {
  if (it.k === 'ab') { for (const k in SAVE.abEquip) if (SAVE.abEquip[k] === it.u) delete SAVE.abEquip[k]; }
  else for (const f in SAVE.equip) for (const sl in SAVE.equip[f]) if (SAVE.equip[f][sl] === it.u) delete SAVE.equip[f][sl];
}
function pickRowHtml(it, sel) {
  const D = defOf(it), R = RARITY[D.rar], w = wearer(it);
  return `<button class="pick-opt" data-id="${it.u}" aria-pressed="${sel === it.u}" style="--rc:${R[2]}"><span class="ic" style="background:${R[1]}">${it.k === 'ab' ? D.ic : SLOT_SVG[D.slot]}</span><span><span class="inv-top"><b class="ol">${D.name}</b>${qBadge(it)}</span><span class="pk-desc">${descOf(it)}${w ? ` <i class="wn">Lo lleva ${w}.</i>` : ''}</span></span></button>`;
}
// ventana con una lista para elegir (sirve para Colección y para el Inventario)
function openList(title, html, onChoose) {
  $('#pick-title').textContent = title; const list = $('#pick-list'); list.innerHTML = html;
  list.querySelectorAll('.pick-opt').forEach(b => { b.onclick = () => { $('#scr-pick').hidden = true; onChoose(b.dataset.id); }; });
  const g = list.querySelector('[data-goto]'); if (g) g.onclick = () => { $('#scr-pick').hidden = true; gachaTab = g.dataset.goto; play('select'); updateWallets(); openGacha(); };
  for (const cv of list.querySelectorAll('canvas[data-art]')) drawArt(cv, cv.dataset.art, 44, 36);
  $('#scr-pick').hidden = false; list.scrollTop = 0;
}
let pickCtx = null;
function openPick(kind, key) {
  let html = '', owned, sel, title;
  if (kind === 'ab') {
    title = 'Habilidad para ' + CFG.cards[key].name; sel = SAVE.abEquip[key];
    owned = SAVE.inv.filter(it => it.k === 'ab' && ABILITIES[it.id]);
  } else {
    title = SLOTS[key] + ' para ' + CFG.cards[FACTIONS[collFac].leader].name; sel = (SAVE.equip[collFac] || {})[key];
    owned = SAVE.inv.filter(it => it.k === 'eq' && ITEMS[it.id] && ITEMS[it.id].slot === key && fitsFac(it.id, collFac));
  }
  if (sel) html += `<button class="pick-opt" data-id="" style="--rc:#3e2363"><span class="ic" style="background:#cdb9ea">✕</span><span><b class="ol">${kind === 'ab' ? 'Quitar habilidad' : 'Quitar objeto'}</b></span></button>`;
  if (!owned.length) html += `<p class="deck-sub">${kind === 'ab' ? 'Aún no tienes habilidades.' : 'Aún no tienes objetos de este tipo.'} Salen en el gashapón${kind === 'ab' ? '' : ' de equipo'}: cada tirada cuesta ${ECON.pull} gemas.</p><button class="btn-ghost ol" data-goto="${kind}">IR AL GASHAPÓN</button>`;
  html += owned.sort(sortInv).map(it => pickRowHtml(it, sel)).join('');
  pickCtx = { kind, key };
  openList(title, html, uid => chooseFor(kind, key, uid));
}
function chooseFor(kind, key, uid) {
  const it = invGet(uid);
  if (it && kind === 'ab') unequip(it);   // v0.9.15: el equipo se comparte entre líderes; las habilidades no
  if (kind === 'ab') { if (it) SAVE.abEquip[key] = uid; else delete SAVE.abEquip[key]; }
  else { SAVE.equip[collFac] = SAVE.equip[collFac] || {}; if (it) SAVE.equip[collFac][key] = uid; else delete SAVE.equip[collFac][key]; }
  if (kind === 'ab' && it) tutStep(2);
  saveGame(); play('select'); buildColl();
}
/* ---------- gashapón de Microblizz ---------- */
let gachaTab = 'ab', gachaAnim = null, gachaRAF = 0;
function rollRarity(kind, force) {
  const P = SAVE.pity, pk = kind, pl = kind + 'L'; P[pk] = (P[pk] || 0) + 1; P[pl] = (P[pl] || 0) + 1;
  let r = 'common';
  if (P[pl] >= ECON.pityLeg) r = 'legendary';
  else if (force || P[pk] >= ECON.pityEpic) r = Math.random() < ECON.odds.legendary / (ECON.odds.legendary + ECON.odds.epic) ? 'legendary' : 'epic';
  else { let x = Math.random() * 100; for (const k of ['legendary', 'epic', 'rare']) { if (x < ECON.odds[k]) { r = k; break; } x -= ECON.odds[k]; } }
  if (r === 'epic' || r === 'legendary') P[pk] = 0;
  if (r === 'legendary') P[pl] = 0;
  return r;
}
// v0.9.10: tiradas x1, x10 y x50. Primero se gastan las tiradas gratis; cada tirada cuenta para las garantías
function onePull(kind, force) {
  const rar = rollRarity(kind, force), DB = kind === 'ab' ? ABILITIES : ITEMS, fp = kind === 'eq' ? Object.keys(DB).filter(k => DB[k].rar === rar && !DB[k].pass && DB[k].fac && isUnlocked(DB[k].fac)) : [];
  const pool = fp.length && Math.random() < 0.5 ? fp : Object.keys(DB).filter(k => DB[k].rar === rar && !DB[k].pass && (kind === 'ab' || !DB[k].fac));   // v0.9.15: objetos de facción
  const id = pick(pool), prev = bestCopy(kind, id), nPrev = SAVE.inv.filter(x => x.k === kind && x.id === id).length;
  const P = SAVE.pity, qk = 'q' + kind; P[qk] = (P[qk] || 0) + 1;
  const it = newCopy(kind, id, P[qk] >= ECON.pityQ ? 3 : 0), tq = tierOf(avgQ(it)); if (tq >= 3) P[qk] = 0;
  const pn = prev && QTIERS[tierOf(avgQ(prev))].name, better = !!prev && avgQ(it) > avgQ(prev);
  const tag = tq === 4 ? '¡CALIDAD PERFECTA!' : !prev ? (kind === 'ab' ? '¡NUEVA!' : '¡NUEVO!') : better ? `¡TU MEJOR COPIA! (la anterior era ${pn})` : `Copia n.º ${nPrev + 1} · tu mejor copia sigue siendo ${pn}`;
  return { it, tag, isNew: !prev, better };
}
function pullCost(n) { const free = Math.min(SAVE.tickets || 0, n); return { free, gems: (n - free) * ECON.pull }; }
function pull(n) {
  n = n || 1; if (gachaAnim) return;
  const c = pullCost(n);
  if (SAVE.gems < c.gems) { play('deny'); confirmBox('FALTAN GEMAS', `Para girar x${n} te faltan <b>${fmt(c.gems - SAVE.gems)} gemas</b>.<small>Las consigues con misiones, la campaña, el pase de batalla o en la tienda.</small>`, 'IR A LA TIENDA', () => openShop('gems')); return; }
  SAVE.tickets = (SAVE.tickets || 0) - c.free; SAVE.gems -= c.gems;
  audioInit();
  // v0.9.11: cada bloque de 10 tiradas trae al menos una épica (o legendaria)
  const kind = gachaTab, res = []; let gotEpic = false;
  for (let i = 0; i < n; i++) {
    if (i % 10 === 0) gotEpic = false;
    const r = kind === 'cd' ? cardPull(n >= 10 && i % 10 === 9 && !gotEpic) : onePull(kind, n >= 10 && i % 10 === 9 && !gotEpic), rr = rarOfPull(r);
    if (rr === 'epic' || rr === 'legendary') gotEpic = true;
    res.push(r);
  }
  missionEvent('pull', n); if (n >= 50) stat('x50', 1); if (n === 10) stat('x10', 1);
  for (const r of res) { const rr = rarOfPull(r); if (rr === 'legendary') stat('leg', 1); else if (rr === 'epic') stat('epic', 1); }
  if (c.gems > 0 && SAVE.gems === 0) stat('broke', 1);
  saveGame(); updateWallets(); buildGachaText();
  if (!SAVE.tut.done && SAVE.tut.step === 2) setTimeout(() => { tutFinish(); toast('¡Tutorial completado! Ya sabes lo básico. ¡A por Microblizz!', true); }, 1500);
  const cv = $('#gacha-cv'); cv.classList.remove('shake'); void cv.offsetWidth; cv.classList.add('shake'); play('roll');
  const top = res.reduce((a, r) => (RAR_ORDER[rarOfPull(r)] < RAR_ORDER[rarOfPull(a)] ? r : a));
  gachaAnim = { t: 0, col: (kind === 'cd' ? CARD_RAR : RARITY)[rarOfPull(top)][1] };
  setTimeout(() => { gachaAnim = null; if (kind === 'cd') showCardPulls(res); else if (n === 1) showPull(res[0].it, res[0].tag); else showMulti(res); }, 1100);
}
const RAR_PL = { common: ['común', 'comunes'], rare: ['rara', 'raras'], epic: ['épica', 'épicas'], legendary: ['legendaria', 'legendarias'] };
function showMulti(res) {
  const card = $('#gr-card'), top = res.reduce((a, r) => (RAR_ORDER[defOf(r.it).rar] < RAR_ORDER[defOf(a.it).rar] ? r : a)), R = RARITY[defOf(top.it).rar];
  card.classList.add('multi'); card.style.setProperty('--rc1', R[1]); card.style.setProperty('--rc2', R[2]);
  const cnt = r => res.filter(x => defOf(x.it).rar === r).length, good = res.filter(x => tierOf(avgQ(x.it)) >= 3).length, news = res.filter(x => x.isNew).length;
  const sum = ['legendary', 'epic', 'rare', 'common'].filter(r => cnt(r)).map(r => `${cnt(r)} ${RAR_PL[r][cnt(r) > 1 ? 1 : 0]}`).join(' · ');
  const order = res.slice().sort((a, b) => RAR_ORDER[defOf(a.it).rar] - RAR_ORDER[defOf(b.it).rar] || avgQ(b.it) - avgQ(a.it));
  card.innerHTML = `<div class="gr-rar ol">TIRADA x${res.length}</div><div class="gr-sum">${sum}${good ? ` · <b>${good} Excelente o mejor</b>` : ''}${news ? ` · ${news} ${news > 1 ? 'nuevas' : 'nueva'}` : ''}</div><div class="gr-grid">${order.map(r => {
    const D = defOf(r.it), RR = RARITY[D.rar], T = QTIERS[tierOf(avgQ(r.it))], nw = r.it.k === 'ab' ? 'NUEVA' : 'NUEVO';
    return `<button class="gt" data-gu="${r.it.u}" style="--rc:${RR[1]};--rc2:${RR[2]};--qc:${T.col}" aria-label="${D.name}, ${RR[0]}, calidad ${T.name}"><span class="gt-ic">${r.it.k === 'ab' ? D.ic : SLOT_SVG[D.slot]}</span><span class="gt-name">${D.name}</span><span class="gt-q ol">${T.name}</span>${r.isNew ? `<span class="gt-new ol">${nw}</span>` : r.better ? '<span class="gt-new best ol">MEJOR</span>' : ''}</button>`;
  }).join('')}</div><small class="gr-hint">Toca una para ver sus números. Las que no quieras, despídelas en el inventario.</small>`;
  for (const b of card.querySelectorAll('[data-gu]')) b.onclick = () => { play('select'); openItem(b.dataset.gu); };
  $('#gacha-result').hidden = false;
  play(res.some(x => tierOf(avgQ(x.it)) >= 3 || defOf(x.it).rar === 'legendary' || defOf(x.it).rar === 'epic') ? 'win' : 'levelup');
}
function addCopy(k, id, q) { const it = { u: 'i' + (++SAVE.invSeq), k, id, q }; SAVE.inv.push(it); return it; }
function newCopy(k, id, minTier) { const n = k === 'ab' ? 1 : ITEMS[id].st.length, it = addCopy(k, id, Array.from({ length: n }, () => rollQ(minTier))); if (tierOf(avgQ(it)) === 4) stat('perfect', 1); return it; }
function bestCopy(k, id) { let b = null; for (const it of SAVE.inv) if (it.k === k && it.id === id && (!b || avgQ(it) > avgQ(b))) b = it; return b; }
function showPull(it, tag) {
  const D = defOf(it), kind = it.k, R = RARITY[D.rar], T = QTIERS[tierOf(avgQ(it))], card = $('#gr-card');
  card.classList.remove('multi'); card.style.setProperty('--rc1', R[1]); card.style.setProperty('--rc2', R[2]);
  card.innerHTML = `<div class="gr-rar ol">${R[0].toUpperCase()}${kind === 'eq' ? ' · ' + SLOTS[D.slot].toUpperCase() : ''}</div><div class="gr-ic">${kind === 'ab' ? D.ic : SLOT_SVG[D.slot]}</div><div class="gr-name ol">${D.name}</div><div class="gr-q ol" style="--qc:${T.col}">CALIDAD ${T.name.toUpperCase()} · ${Math.round(avgQ(it) * 100)} %</div><div class="gr-desc">${descOf(it)}<br><small class="rg">${rangeTxt(it)}</small>${kind === 'ab' && D.fac ? '<br><small>Viene de los ' + FACTIONS[D.fac].name + '</small>' : ''}</div><span class="gr-tag">${tag}</span>`;
  $('#gacha-result').hidden = false; play(tierOf(avgQ(it)) >= 3 || D.rar === 'legendary' || D.rar === 'epic' ? 'win' : 'levelup');
}
function buildGachaText() {
  for (const b of document.querySelectorAll('[data-gt]')) b.setAttribute('aria-pressed', String(b.dataset.gt === gachaTab));
  $('#btn-gr-inv').textContent = 'Ver en el inventario';
  $('#gacha-sub').textContent = gachaTab === 'ab' ? 'Habilidades de cualquier facción para tus cartas. Cada copia sale con su propia calidad, de Básica a Perfecta: búscale la mejor.' : 'Equipo freak solo para los líderes: arma, cabeza y accesorio. Cada objeto sale con su propia calidad y se ve puesto en la partida.';
  const lab = n => { const c = pullCost(n); return c.gems ? `${fmt(c.gems)} ${GEM_SVG}${c.free ? `<i class="fr">+${c.free} gratis</i>` : ''}` : `${TICKET_SVG} gratis`; };
  for (const b of document.querySelectorAll('[data-pull]')) { const n = +b.dataset.pull; b.innerHTML = `${n === 10 ? '<span class="tag">FAVORITA DEL CEO</span>' : n === 50 ? '<span class="tag">MODO BALLENA</span>' : ''}x${n}<small>${lab(n)}</small>${n >= 10 ? `<span class="sure">${n === 10 ? '1 épica segura' : n / 10 + ' épicas seguras'}</span>` : ''}`; }
  const P = SAVE.pity, O = ECON.odds;
  $('#gacha-odds').textContent = `Probabilidades: común ${O.common} %, rara ${O.rare} %, épica ${O.epic} %, legendaria ${O.legendary} %. Calidad de cada efecto (del 50 % al 150 % de su valor): ${QTIERS.map(t => t.name + ' ' + t.p + ' %').join(', ')}. Garantías: épica o mejor como mucho cada ${ECON.pityEpic} tiradas (llevas ${P[gachaTab] || 0}), legendaria a las ${ECON.pityLeg} (llevas ${P[gachaTab + 'L'] || 0}) y calidad Excelente o mejor cada ${ECON.pityQ} (llevas ${P['q' + gachaTab] || 0}). Las tiradas x10 y x50 traen al menos una épica o legendaria por cada 10. Cada tirada cuesta ${ECON.pull} gemas (unos 0,50 € si compras el pack pequeño de gemas). Microblizz no se hace responsable de tu afición a las cápsulas.`;
  if (gachaTab === 'cd') buildCardGachaText();   // v0.9.15: la máquina de cartas cambia los textos
  adGachaOffer();   // v0.9.16: tirada gratis con anuncio
}
function drawGacha() {
  const cv = $('#gacha-cv'); if (!cv || $('#scr-gacha').hidden) { gachaRAF = 0; return; }
  const LW = 270, LH = 300, R2 = 2; if (cv.width !== LW * R2) { cv.width = LW * R2; cv.height = LH * R2; }
  const c = cv.getContext('2d'); c.setTransform(R2, 0, 0, R2, 0, 0); c.clearRect(0, 0, LW, LH); c.lineJoin = 'round'; c.lineCap = 'round';
  const t = performance.now() / 1000, an = gachaAnim; if (an) an.t += 1 / 60;
  const MC = gachaTab === 'cd' ? ['#8b3dff', '#5b21b6', '#4c1d95'] : ['#2e6fd8', '#1d3f8a', '#173d8f'];   // v0.9.15: la de cartas es morada
  shape(c, el(135, 288, 100, 9), 'rgba(0,0,0,.3)', 0);
  shape(c, rr(48, 176, 174, 108, 14), MC[0], 2.6);
  shape(c, rr(56, 184, 158, 26, 8), MC[1], 2);
  txt(c, gachaTab === 'ab' ? 'HABILIDADES' : gachaTab === 'cd' ? 'CARTAS' : 'EQUIPO', 135, 198, 15, '#e8f1ff');
  shape(c, rr(74, 222, 44, 44, 8), MC[2], 2.2); shape(c, rr(84, 236, 24, 22, 4), '#0b1a3f', 1.6);
  const rot = an ? an.t * 9 : 0; c.save(); c.translate(172, 244); c.rotate(rot);
  shape(c, el(0, 0, 19, 19), '#ffcb3d', 2.4); shape(c, rr(-15, -4, 30, 8, 3), '#e0a92a', 1.8); c.restore();
  shape(c, rr(150, 214, 44, 10, 3), '#0b1a3f', 1.4);
  txt(c, 'MICROBLIZZ', 135, 276, 10, '#bfe0ff');
  if (an) { const k = Math.min(1, an.t / 0.8), y = 160 + k * 88; shape(c, el(96, y, 10, 10), an.col, 2); shape(c, c2 => c2.arc(96, y, 10, Math.PI, 0), '#fff', 1.6); }
  shape(c, rr(108, 160, 54, 20, 6), MC[0], 2.2);
  c.save(); c.beginPath(); c.arc(135, 92, 82, 0, Math.PI * 2); c.clip();
  c.fillStyle = 'rgba(190,230,255,.35)'; c.fillRect(40, 0, 200, 200);
  const cols = ['#ff5fa8', '#ffe14d', '#7be04a', '#63cfe0', '#d08cff', '#ffb04f'];
  for (let i = 0; i < 22; i++) { const a = i * 2.39, rr2 = 18 + (i % 6) * 10, x = 135 + Math.cos(a) * rr2 + (an ? Math.sin(t * 30 + i) * 3 : 0), y = 120 + Math.sin(a) * rr2 * 0.55 + (i % 3) * 10 - 10 + (an ? Math.cos(t * 28 + i) * 3 : 0);
    shape(c, el(x, y, 12, 12), cols[i % 6], 1.8); shape(c, c2 => c2.arc(x, y, 12, Math.PI, 0), 'rgba(255,255,255,.85)', 1.6); }
  c.restore();
  c.beginPath(); c.arc(135, 92, 82, 0, Math.PI * 2); c.lineWidth = 4; c.strokeStyle = OL; c.stroke();
  c.beginPath(); c.arc(112, 62, 30, Math.PI * 1.1, Math.PI * 1.45); c.lineWidth = 6; c.strokeStyle = 'rgba(255,255,255,.6)'; c.stroke();
  shape(c, rr(100, 2, 70, 18, 7), MC[0], 2.4);
  gachaRAF = requestAnimationFrame(drawGacha);
}
function openGacha() { buildGachaText(); show('scr-gacha'); if (!SAVE.tut.done && SAVE.tut.step === 2) SAVE.tut.sawG = true; $('#gacha-result').hidden = true; if (!gachaRAF) gachaRAF = requestAnimationFrame(drawGacha); }
/* ---------- inventario (v0.9.9): todas tus copias, con su calidad ---------- */
let invTab = 'ab', invFilter = 'all', invSort = 'q', itemCur = null;
const INV_FILTERS = { ab: [['all', 'Todas'], ['common', 'Comunes'], ['rare', 'Raras'], ['epic', 'Épicas'], ['legendary', 'Legendarias']], eq: [['all', 'Todo'], ['weapon', 'Armas'], ['head', 'Cabeza'], ['acc', 'Accesorios']] };
const INV_SORTS = { q: 'calidad', rar: 'rareza', name: 'nombre' };
const LOCK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="#ffcb3d" stroke="#20102c" stroke-width="1.4"/><path d="M5.3 7V5.2a2.7 2.7 0 0 1 5.4 0V7" stroke="#20102c" stroke-width="1.6" fill="none"/></svg>';
const scrapValue = it => Math.round(ECON.scrap[defOf(it).rar] * [1, 1.5, 2, 3, 5][tierOf(avgQ(it))]);
const canScrap = it => !it.lock && !wearer(it) && !defOf(it).pass;
// despido masivo: copias Básicas y Normales que nadie lleva, sin bloquear, y nunca tu mejor copia de cada una
const massList = () => SAVE.inv.filter(it => it.k === invTab && canScrap(it) && tierOf(avgQ(it)) <= 1 && bestCopy(it.k, it.id) !== it);
function openInv(tab) { if (tab) invTab = tab; invFilter = 'all'; updateWallets(); show('scr-inv'); buildInv(); $('#inv-list').scrollTop = 0; }
function buildInv() {
  for (const b of document.querySelectorAll('[data-it]')) b.setAttribute('aria-pressed', String(b.dataset.it === invTab));
  $('#inv-filters').innerHTML = INV_FILTERS[invTab].map(([v, l]) => `<button class="chip-btn" data-if="${v}" aria-pressed="${invFilter === v}">${l}</button>`).join('');
  for (const b of document.querySelectorAll('[data-if]')) b.onclick = () => { invFilter = b.dataset.if; play('select'); buildInv(); };
  $('#btn-inv-sort').textContent = 'Orden: ' + INV_SORTS[invSort];
  const all = SAVE.inv.filter(it => it.k === invTab && defOf(it));
  const L = all.filter(it => invFilter === 'all' || (invTab === 'ab' ? defOf(it).rar : defOf(it).slot) === invFilter);
  L.sort(invSort === 'q' ? (a, b) => avgQ(b) - avgQ(a) || sortInv(a, b) : invSort === 'name' ? (a, b) => defOf(a).name.localeCompare(defOf(b).name) || avgQ(b) - avgQ(a) : sortInv);
  $('#inv-sub').textContent = all.length ? `${all.length} ${all.length === 1 ? 'copia' : 'copias'}${invFilter !== 'all' ? ` (${L.length} con este filtro)` : ''}. Toca una para ver sus números, equiparla, evaluarla o despedirla.` : '';
  $('#inv-list').innerHTML = L.length ? L.map(invRow).join('') : `<p class="deck-sub">${all.length ? 'Nada con este filtro.' : invTab === 'ab' ? 'Aún no tienes habilidades: salen en el gashapón.' : 'Aún no tienes equipo: sale en el gashapón de equipo y en el pase de batalla.'}</p>${all.length ? '' : '<button class="btn-ghost ol" id="btn-inv-gacha">IR AL GASHAPÓN</button>'}`;
  const g = $('#btn-inv-gacha'); if (g) g.onclick = () => { play('select'); gachaTab = invTab; openGacha(); };
  for (const b of document.querySelectorAll('[data-u]')) b.onclick = () => { play('select'); openItem(b.dataset.u); };
  const n = massList().length, mb = $('#btn-mass'); mb.textContent = n ? `DESPIDO MASIVO (${n})` : 'DESPIDO MASIVO'; mb.disabled = !n;
}
function invRow(it) {
  const D = defOf(it), R = RARITY[D.rar], w = wearer(it);
  const meta = w || it.lock ? `<span class="inv-meta">${it.lock ? LOCK_SVG + 'Bloqueada' : ''}${w && it.lock ? ' · ' : ''}${w ? 'Lo lleva ' + w : ''}</span>` : '';
  return `<button class="inv-row" data-u="${it.u}" style="--rc:${R[2]}"><span class="ic" style="background:${R[1]}">${it.k === 'ab' ? D.ic : SLOT_SVG[D.slot]}</span><span class="inv-main"><span class="inv-top"><b class="ol">${D.name}</b>${qBadge(it)}</span><span class="inv-desc">${descOf(it)}</span>${meta}</span></button>`;
}
function openItem(uid) {
  const it = invGet(uid); if (!it) { $('#scr-item').hidden = true; itemCur = null; return; } itemCur = uid;
  const D = defOf(it), R = RARITY[D.rar], S = statsOf(it), V = valsOf(it), w = wearer(it), pass = !!D.pass;
  const bars = S.map((st, i) => { const qi = it.q[i], Ti = QTIERS[tierOf(qi)]; return `<div class="qstat">${S.length > 1 ? `Efecto ${i + 1}: ` : 'Valor: '}<b>${fmtV(V[i])}</b> <small>(de ${fmtV(rnd(st.c * 0.5, st.dec))} a ${fmtV(rnd(st.c * 1.5, st.dec))}) · ${Ti.name}</small><div class="qbar" style="--qc:${Ti.col}"><i style="width:${Math.max(2, qi * 100)}%"></i></div></div>`; }).join('');
  const others = SAVE.inv.filter(x => x !== it && x.k === it.k && x.id === it.id).sort((a, b) => avgQ(b) - avgQ(a));
  const oth = others.length ? `Tus otras copias: ${others.slice(0, 5).map(x => `${QTIERS[tierOf(avgQ(x))].name} ${Math.round(avgQ(x) * 100)} %`).join(' · ')}${others.length > 5 ? ` y ${others.length - 5} más` : ''}.` : 'Es tu única copia.';
  $('#item-body').innerHTML = `<div class="item-head"><span class="ic" style="background:${R[1]}">${it.k === 'ab' ? D.ic : SLOT_SVG[D.slot]}</span><div><b class="ol">${D.name}</b><div class="item-note">${R[0]}${it.k === 'eq' ? ' · ' + SLOTS[D.slot] + ' (solo líderes)' : ''}${it.k === 'ab' && D.fac ? ' · de los ' + FACTIONS[D.fac].name : ''}</div></div></div>
    <div>${qBadge(it, true)}</div><div class="inv-desc">${descOf(it)}</div>${bars}
    <div class="item-note">${w ? 'Lo lleva ' + w + '.' : 'No lo lleva nadie.'}${pass ? ' Premio del pase: no se puede despedir ni volver a tirar.' : it.lock ? ' Bloqueada: no se puede despedir.' : ''}</div><div class="item-note">${oth}</div>`;
  const rc = ECON.reroll[D.rar], sv = scrapValue(it);
  $('#item-actions').innerHTML = `<button class="btn-ghost ol btn-ok" id="ia-equip">${w ? 'CAMBIAR' : 'EQUIPAR'}</button><button class="btn-ghost ol" id="ia-unequip" ${w ? '' : 'disabled'}>QUITAR</button>
    <button class="btn-ghost ol" id="ia-lock" ${pass ? 'disabled' : ''}>${it.lock ? 'DESBLOQUEAR' : 'BLOQUEAR'}</button><button class="btn-ghost ol danger" id="ia-scrap" ${canScrap(it) ? '' : 'disabled'}>DESPEDIR · +${fmt(sv)} ORO</button>
    <button class="btn-ghost ol wide" id="ia-reroll" ${pass ? 'disabled' : ''}>VOLVER A TIRAR · ${fmt(rc)} ORO</button>`;
  $('#ia-equip').onclick = () => equipFromInv(it);
  $('#ia-unequip').onclick = () => { unequip(it); saveGame(); play('select'); refreshInv(); };
  $('#ia-lock').onclick = () => { it.lock = !it.lock; saveGame(); play('select'); refreshInv(); toast(it.lock ? 'Bloqueada: ya no se puede despedir' : 'Desbloqueada: ya se puede despedir'); };
  $('#ia-scrap').onclick = () => scrapOne(it);
  $('#ia-reroll').onclick = () => rerollOne(it);
  $('#scr-item').hidden = false;
}
function refreshInv() { if (!$('#scr-inv').hidden) buildInv(); if (!$('#scr-coll').hidden) buildColl(); if (itemCur && !$('#scr-item').hidden) openItem(itemCur); }
function equipFromInv(it) {
  const D = defOf(it), facs = FACTION_ORDER.filter(isUnlocked); let html = '';
  if (it.k === 'ab') {
    for (const f of facs) {
      const F = FACTIONS[f];
      html += `<p class="pick-head ol">${F.name}</p>` + [F.leader, ...F.units].map(k => { const cur = invGet(SAVE.abEquip[k]); return `<button class="pick-opt unit" data-id="${k}" aria-pressed="${SAVE.abEquip[k] === it.u}"><canvas data-art="${k}"></canvas><span><b class="ol">${CFG.cards[k].name}</b><span>${cur ? 'Lleva ' + ABILITIES[cur.id].name + ' (' + QTIERS[tierOf(avgQ(cur))].name + ')' : 'Sin habilidad'}</span></span></button>`; }).join('');
    }
    openList(`¿Quién lleva ${D.name}?`, html, k => { unequip(it); SAVE.abEquip[k] = it.u; tutStep(2); saveGame(); play('select'); toast(`${CFG.cards[k].name} lleva ahora ${D.name}`); refreshInv(); });
  } else {
    const fs = facs.filter(f => fitsFac(it.id, f));
    html = (fs.length > 1 ? `<button class="pick-opt unit" data-id="*"><span class="ic" style="background:#ffcb3d">★</span><span><b class="ol">Todos tus líderes</b><span>Lo llevan los ${fs.length} a la vez (el equipo se comparte)</span></span></button>` : '') + fs.map(f => { const L = FACTIONS[f].leader, cur = invGet((SAVE.equip[f] || {})[D.slot]); return `<button class="pick-opt unit" data-id="${f}" aria-pressed="${cur === it}"><canvas data-art="${L}"></canvas><span><b class="ol">${CFG.cards[L].name}</b><span>${FACTIONS[f].name} · ${cur ? 'lleva ' + ITEMS[cur.id].name + ' (' + QTIERS[tierOf(avgQ(cur))].name + ')' : SLOTS[D.slot] + ' libre'}</span></span></button>`; }).join('');
    openList(`¿Qué líder lleva ${D.name}?`, html, f => { for (const g of f === '*' ? fs : [f]) { SAVE.equip[g] = SAVE.equip[g] || {}; SAVE.equip[g][D.slot] = it.u; } saveGame(); play('select'); toast(f === '*' ? `Todos tus líderes llevan ahora ${D.name}` : `${CFG.cards[FACTIONS[f].leader].name} lleva ahora ${D.name}`); refreshInv(); });
  }
}
function scrapOne(it) {
  if (!canScrap(it)) return;
  const D = defOf(it), sv = scrapValue(it);
  confirmBox('DESPEDIR', `¿Despedir esta copia de <b>${D.name}</b> (${QTIERS[tierOf(avgQ(it))].name})?<span class="big">+${fmt(sv)} ${COIN_SVG}</span><small>La copia desaparece y te da oro. Cuanto mejor es su calidad, más oro.</small>`, 'DESPEDIR', () => {
    SAVE.inv = SAVE.inv.filter(x => x !== it); SAVE.gold += sv; stat('scrap', 1); if (tierOf(avgQ(it)) === 4) stat('scrapperf', 1); saveGame(); play('despido'); updateWallets();
    $('#scr-item').hidden = true; itemCur = null; refreshInv(); toast(`Despedida: +${fmt(sv)} de oro`);
  });
}
function rerollOne(it) {
  const D = defOf(it); if (D.pass) return;
  const cost = ECON.reroll[D.rar];
  if (SAVE.gold < cost) { toast(`Te falta oro: ${fmt(cost - SAVE.gold)} más`); play('deny'); return; }
  confirmBox('VOLVER A TIRAR', `Se vuelven a sortear todos los números de tu <b>${D.name}</b>.<span class="big">${fmt(cost)} ${COIN_SVG}</span><small>Puede salir mejor… o peor. Ahora es ${QTIERS[tierOf(avgQ(it))].name} (${Math.round(avgQ(it) * 100)} %). Mismas probabilidades que el gashapón, sin garantía.</small>`, 'TIRAR', () => {
    const before = avgQ(it); SAVE.gold -= cost; it.q = it.q.map(() => rollQ(0)); stat('reroll', 1); if (tierOf(avgQ(it)) === 4) stat('perfect', 1); saveGame(); updateWallets();
    const after = avgQ(it), T = QTIERS[tierOf(after)];
    play(after > before ? 'levelup' : 'sad'); toast(after > before ? `¡Ha salido mejor! Ahora es ${T.name} (${Math.round(after * 100)} %)` : `Ha salido peor: ahora es ${T.name} (${Math.round(after * 100)} %). Mala suerte`);
    refreshInv();
  });
}
function massScrap() {
  const L = massList(); if (!L.length) return;
  const gold = L.reduce((a, it) => a + scrapValue(it), 0);
  confirmBox('DESPIDO MASIVO', `Vas a despedir <b>${L.length} ${L.length === 1 ? 'copia' : 'copias'}</b> de ${invTab === 'ab' ? 'habilidades' : 'equipo'} de calidad Básica y Normal que nadie lleva puestas.<span class="big">+${fmt(gold)} ${COIN_SVG}</span><small>Se salvan las bloqueadas y tu mejor copia de cada una. Microblizz estaría orgullosa.</small>`, 'DESPEDIR A TODAS', () => {
    const del = new Set(L); SAVE.inv = SAVE.inv.filter(x => !del.has(x)); SAVE.gold += gold; stat('scrap', L.length); stat('scrapperf', L.filter(x => tierOf(avgQ(x)) === 4).length); saveGame(); updateWallets(); play('despido'); buildInv(); toast(`${L.length} despedidas: +${fmt(gold)} de oro`);
  });
}
/* ---------- misiones diarias y semanales ---------- */
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function weekStr() { const d = new Date(), back = (d.getDay() + 6) % 7, m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - back); return `${m.getFullYear()}-${m.getMonth() + 1}-${m.getDate()}`; }
const seedOf = str => { let h = 7; for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const mDef = (m, weekly) => (weekly ? WEEKLY : MISSIONS).find(x => x.id === m.id);
const mText = (m, M) => M.txt.replace('{F}', m.fac ? FACTIONS[m.fac].name : '');
function ensureDaily() {
  const day = todayStr(); if (SAVE.daily && SAVE.daily.day === day && SAVE.daily.list.length === DAILY_N) return;
  const R = mulberry32(seedOf(day)), pool = MISSIONS.slice(), list = [];
  while (list.length < DAILY_N) list.push(pool.splice(Math.floor(R() * pool.length), 1)[0]);
  const facs = FACTION_ORDER.filter(isUnlocked);
  SAVE.daily = { day, list: list.map(m => ({ id: m.id, prog: 0, claimed: false, fac: m.ev === 'facwin' ? facs[Math.floor(R() * facs.length)] : undefined })) }; saveGame();
}
function ensureWeekly() {
  const wk = weekStr(); if (SAVE.weekly && SAVE.weekly.week === wk) return;
  const R = mulberry32(seedOf('w' + wk)), pool = WEEKLY.slice(), list = [];
  while (list.length < WEEKLY_N) list.push(pool.splice(Math.floor(R() * pool.length), 1)[0]);
  SAVE.weekly = { week: wk, list: list.map(m => ({ id: m.id, prog: 0, claimed: false })) }; saveGame();
}
function missionEvent(ev, n, fac) {
  if (!n) return;
  stat(ev, n);
  ensureDaily(); ensureWeekly();
  for (const m of SAVE.daily.list) { const M = mDef(m); if (M && M.ev === ev && !m.claimed && (!m.fac || m.fac === fac)) m.prog = Math.min(M.goal, m.prog + n); }
  for (const m of SAVE.weekly.list) { const M = mDef(m, true); if (M && M.ev === ev && !m.claimed) m.prog = Math.min(M.goal, m.prog + n); }
}
const ECON_W = { gold: 300, gems: 40 };
let missionTab = 'd';
function untilStr(weekly) {
  const now = new Date(), d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (weekly ? 7 - (now.getDay() + 6) % 7 : 1));
  const h = Math.max(1, Math.ceil((d - now) / 3600000));
  return h >= 48 ? `${Math.floor(h / 24)} días` : h >= 24 ? '1 día y ' + (h - 24) + ' h' : h + ' h';
}
function buildMissions() {
  ensureDaily(); ensureWeekly();
  const W = missionTab === 'w', L = W ? SAVE.weekly.list : SAVE.daily.list;
  for (const b of document.querySelectorAll('[data-mt]')) b.setAttribute('aria-pressed', String(b.dataset.mt === missionTab));
  achScan(); const nA = achReady(); $('[data-mt="a"]').textContent = nA ? `Logros (${nA})` : 'Logros';
  $('#ach-bar').hidden = missionTab !== 'a';
  if (missionTab === 'a') { buildAchs(); return; }
  $('#mission-sub').textContent = W ? `${WEEKLY_N} misiones grandes cada semana. Cada una da ${ECON_W.gold} de oro, ${ECON_W.gems} gemas y ${PASS.xpWeekly} puntos de pase. Se renuevan en ${untilStr(true)}.` : `${DAILY_N} misiones nuevas cada día. Cada una da ${ECON.mission[0]} de oro, ${ECON.mission[1]} gemas y ${PASS.xpDaily} puntos de pase. Se renuevan en ${untilStr(false)}.`;
  const rw = W ? [ECON_W.gold, ECON_W.gems, PASS.xpWeekly] : [ECON.mission[0], ECON.mission[1], PASS.xpDaily];
  $('#mission-list').innerHTML = L.map((m, i) => {
    const M = mDef(m, W), done = m.prog >= M.goal;
    return `<div class="mission${m.claimed ? ' done' : ''}"><div><b>${mText(m, M)}</b><div class="xpbar"><i style="width:${(m.prog / M.goal) * 100}%"></i><span>${fmt(m.prog)} / ${fmt(M.goal)}</span></div></div><button class="btn-up" data-claim="${i}" ${done && !m.claimed ? '' : 'disabled'}>${m.claimed ? 'HECHA' : 'COBRAR'}<small>${COIN_SVG}${rw[0]} ${GEM_SVG}${rw[1]}</small><small>+${rw[2]} pase</small></button></div>`;
  }).join('');
  if (!W) adMissionOffer(L);   // v0.9.16: cambiar una misión con anuncio
  for (const b of document.querySelectorAll('[data-claim]')) b.onclick = () => {
    const m = L[+b.dataset.claim]; if (m.claimed || m.prog < mDef(m, W).goal) return;
    m.claimed = true; SAVE.gold += rw[0]; SAVE.gems += rw[1];
    const up = addPassXp(rw[2]); if (!W) missionEvent('dailydone', 1); else stat('weekdone', 1);
    saveGame(); play('crown'); updateWallets(); buildMissions();
    toast(up ? `¡Pase de batalla: nivel ${passLevel()}!` : `+${rw[2]} puntos de pase`);
  };
}
/* ---------- pase de batalla ---------- */
const passLevel = () => Math.min(PASS.levels, Math.floor(SAVE.pass.xp / PASS.xpPer));
function addPassXp(n) { const before = passLevel(); SAVE.pass.xp = Math.min(PASS.levels * PASS.xpPer, SAVE.pass.xp + n); return passLevel() - before; }
const TICKET_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 18 6v2a2 2 0 0 0 0 4v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14v-2a2 2 0 0 0 0-4z" fill="#7df3ff" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 4.5v11" stroke="#20102c" stroke-width="1.2" stroke-dasharray="1.6 1.6"/></svg>';
function rewardHtml(r) {
  if (r.gold) return `${COIN_SVG}${fmt(r.gold)}`;
  if (r.gems) return `${GEM_SVG}${fmt(r.gems)}`;
  if (r.tickets) return `${TICKET_SVG}${r.tickets} ${r.tickets > 1 ? 'tiradas' : 'tirada'}`;
  if (r.item) return `<span class="itm">${ITEMS[r.item].name}</span>`;
  return '';
}
const rewardTxt = r => r.gold ? `${fmt(r.gold)} de oro` : r.gems ? `${fmt(r.gems)} gemas` : r.tickets ? `${r.tickets} ${r.tickets > 1 ? 'tiradas gratis' : 'tirada gratis'} del gashapón` : r.item ? ITEMS[r.item].name : '';
function giveReward(r) {
  if (r.gold) SAVE.gold += r.gold;
  if (r.gems) SAVE.gems += r.gems;
  if (r.tickets) SAVE.tickets = (SAVE.tickets || 0) + r.tickets;
  if (r.item) addCopy('eq', r.item, ITEMS[r.item].st.map(() => PASS_Q));
}
const passReady = (track, i) => i <= passLevel() && !SAVE.pass[track === 'free' ? 'free' : 'paid'].includes(i) && (track === 'free' || SAVE.pass.prem);
function passClaimable() { let n = 0; for (let i = 1; i <= passLevel(); i++) { if (passReady('free', i)) n++; if (passReady('paid', i)) n++; } return n; }
function claimPass(track, i) {
  if (!passReady(track, i)) return false;
  const r = passReward(track, i); giveReward(r); SAVE.pass[track === 'free' ? 'free' : 'paid'].push(i); return r;
}
function buildPass() {
  const lv = passLevel(), into = SAVE.pass.xp - lv * PASS.xpPer, maxed = lv >= PASS.levels, P = SAVE.pass, nClaim = passClaimable();
  $('#pass-top').innerHTML = `<div class="pass-lvl">${lv}</div><div class="pass-name ol">${PASS.name}<small>${PASS.sub}. ${P.prem ? 'Tienes el Pase Ejecutivo.' : 'Pista gratis para todos; la Ejecutiva es de pago (de prueba).'}</small></div>
    <div><div class="xpbar"><i style="width:${maxed ? 100 : (into / PASS.xpPer) * 100}%"></i><span>${maxed ? '¡PASE COMPLETADO!' : `${into} / ${PASS.xpPer} puntos para el nivel ${lv + 1}`}</span></div></div>
    <div class="pass-actions"><button class="btn-vip ol" id="btn-buy-pass" ${P.prem ? 'disabled' : ''}>${P.prem ? 'EJECUTIVO ✓' : 'PASE EJECUTIVO · ' + eur(PASS.eur)}</button><button class="btn-up" id="btn-claim-all" ${nClaim ? '' : 'disabled'}>COBRAR TODO${nClaim ? ` (${nClaim})` : ''}</button></div>`;
  let rows = '';
  for (let i = 1; i <= PASS.levels; i++) {
    const cell = track => {
      const r = passReward(track, i), got = SAVE.pass[track === 'free' ? 'free' : 'paid'].includes(i), ready = passReady(track, i);
      const cls = 'pr-cell' + (track === 'paid' ? ' prem' : '') + (got ? ' done' : ready ? ' ready' : i > lv || (track === 'paid' && !P.prem) ? ' locked' : '');
      const lock = track === 'paid' && !P.prem ? '<span class="lk">🔒</span>' : '';
      return `<button class="${cls}" data-pc="${track}:${i}" ${ready ? '' : 'tabindex="-1"'}>${lock}${rewardHtml(r)}${got ? ' ✓' : ''}</button>`;
    };
    rows += `<div class="pass-row${i <= lv ? ' reached' : ''}" data-row="${i}"><div class="pr-n ol">${i}</div>${cell('free')}${cell('paid')}</div>`;
  }
  const list = $('#pass-list'); list.innerHTML = rows;
  list.querySelectorAll('[data-pc]').forEach(b => { b.onclick = () => {
    const [tr, i] = b.dataset.pc.split(':'); const r = claimPass(tr, +i);
    if (!r) { if (tr === 'paid' && !SAVE.pass.prem) buyPass(); return; }
    saveGame(); play('crown'); updateWallets(); buildPass(); toast('Has cobrado: ' + rewardTxt(r));
  }; });
  $('#btn-buy-pass').onclick = buyPass;
  $('#btn-claim-all').onclick = () => {
    let n = 0; for (let i = 1; i <= passLevel(); i++) { if (claimPass('free', i)) n++; if (claimPass('paid', i)) n++; }
    if (n) { saveGame(); play('win'); updateWallets(); buildPass(); toast(`¡${n} recompensas cobradas!`); }
  };
  const cur = list.querySelector(`[data-row="${Math.max(1, Math.min(PASS.levels, lv))}"]`); if (cur) list.scrollTop = Math.max(0, cur.offsetTop - list.offsetTop - 60);
}
function buyPass() {
  if (SAVE.pass.prem) return;
  confirmBox('PASE EJECUTIVO', `Desbloquea la pista Ejecutiva de la ${PASS.name}: más oro, gemas, tiradas gratis y la <b>Corbata del CEO</b>, exclusiva.<span class="big">${eur(PASS.eur)}</span><small>Versión de prueba: no se cobra nada.</small>`, 'COMPRAR', () => {
    SAVE.pass.prem = true; saveGame(); play('win'); updateWallets(); buildPass(); toast('¡Ya eres Ejecutivo! (sin cobrar nada)');
  });
}
/* ---------- tienda (de prueba, sin cobros) ---------- */
const eur = v => v.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: Number.isInteger(v) ? 0 : 2 });
let shopTab = 'gold', jokeT = 0;
const PILE = (n, gem) => { // dibujo de un montón de monedas o gemas, más alto cuanto más grande el pack
  let o = ''; const k = Math.min(6, n), POS = [[30, 38], [17, 38], [43, 38], [23.5, 28], [36.5, 28], [30, 18]];
  for (let i = 0; i < k; i++) { const [x, y] = POS[i];
    o += gem ? `<path transform="translate(${x - 9} ${y - 9}) scale(.9)" d="M5 3h10l4 5-9 10L1 8z" fill="#ff5fd2" stroke="#20102c" stroke-width="1.6" stroke-linejoin="round"/>` : `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#ffcb3d" stroke="#20102c" stroke-width="1.6"/><ellipse cx="${x}" cy="${y - 1}" rx="5" ry="2.4" fill="none" stroke="#c48a10" stroke-width="1.2"/>`; }
  return `<svg viewBox="0 0 60 48" aria-hidden="true">${o}</svg>`;
};
function bonusPct(list, p) { const base = list[0].amt / list[0].eur, r = p.amt / p.eur; const b = Math.floor((r / base - 1) * 100); return b > 0 ? b : 0; }
function giftReady() { return SAVE.giftDay !== todayStr(); }
function jokeClock() { const now = new Date(), end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); const s = Math.floor((end - now) / 1000); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(v => String(v).padStart(2, '0')).join(':'); }
function buildShop() {
  for (const b of document.querySelectorAll('[data-st]')) b.setAttribute('aria-pressed', String(b.dataset.st === shopTab));
  const g = SHOP.gift, ready = giftReady();
  $('#gift-row').innerHTML = `<div class="pack gift"><div class="pk-ic">${PILE(2)}</div><div><div class="pk-name ol">Regalo del becario</div><div class="pk-note">Gratis una vez al día: ${g.gold} de oro y ${g.gems} gemas. Se lo ha «encontrado» en la oficina de Microblizz.</div></div><button class="btn-price ol" id="btn-gift" ${ready ? '' : 'disabled'}>${ready ? 'GRATIS' : 'MAÑANA'}</button></div>`;
  $('#btn-gift').onclick = () => {
    if (!giftReady()) return;
    SAVE.giftDay = todayStr(); SAVE.gold += g.gold; SAVE.gems += g.gems; missionEvent('gift', 1); saveGame(); play('crown'); updateWallets(); buildShop(); toast(`+${g.gold} de oro y +${g.gems} gemas`);
  };
  if (!SAVE.starter) {
    const P = SHOP.starter;
    $('#gift-row').insertAdjacentHTML('beforeend', `<div class="pack starter"><span class="joke-flag">1 VEZ</span><div class="pk-ic">${PILE(5, true)}</div><div><div class="pk-name ol">Pack de bienvenida</div><div class="pk-amt ol">${GEM_SVG}${fmt(P.gems)} <span class="pk-plus">+</span> ${COIN_SVG}${fmt(P.gold)}</div><div class="pk-note">Y un objeto épico de equipo con calidad Excelente o mejor. Vale casi el doble que comprarlo por separado. Microblizz lo llama «regalo».</div></div><button class="btn-price ol" id="btn-starter">${eur(P.eur)}</button></div>`);
    $('#btn-starter').onclick = () => { play('select'); confirmBox('¿COMPRAR?', `Pack de bienvenida<span class="big">${GEM_SVG} ${fmt(P.gems)} · ${COIN_SVG} ${fmt(P.gold)}</span>y un objeto épico de calidad Excelente o mejor, por <b>${eur(P.eur)}</b><small>Versión de prueba: no se cobra nada y te lo llevas gratis. Solo se puede comprar una vez.</small>`, 'COMPRAR', buyStarter); };
  }
  adShopOffer();   // v0.9.16: regalo x2 y «Sin anuncios»
  const L = SHOP[shopTab], gem = shopTab === 'gems';
  let h = '';
  if (!gem) { const J = SHOP.joke; h += `<div class="pack joke"><span class="joke-flag">¡OFERTA!</span><div class="pk-ic">${PILE(6)}</div><div><div class="pk-name ol">${J.name}</div><div class="pk-amt ol">${COIN_SVG}${fmt(J.amt)}</div><div class="pk-note">¡Oferta irrepetible! (se repite cada día) · Termina en <span class="countdown" id="joke-clock">${jokeClock()}</span></div></div><button class="btn-price ol" id="btn-joke"><small>${eur(J.was)}</small>${eur(J.eur)}</button></div>`; }
  h += L.map(p => { const b = bonusPct(L, p); return `<div class="pack${gem ? ' gem' : ''}"><div class="pk-ic">${PILE(1 + L.indexOf(p) + (L.indexOf(p) > 2 ? 1 : 0), gem)}</div><div><div class="pk-name ol">${p.name}${b ? `<span class="pk-bonus">+${b} % extra</span>` : ''}</div><div class="pk-amt ol">${gem ? GEM_SVG : COIN_SVG}${fmt(p.amt)}</div>${p.note ? `<div class="pk-note">${p.note}</div>` : ''}</div><button class="btn-price ol" data-buy="${p.id}">${eur(p.eur)}</button></div>`; }).join('');
  h += `<p class="small-print">${gem ? 'Las gemas sirven para el gashapón (50 gemas por tirada: unos 0,50 € con el pack pequeño) y, más adelante, para aspectos.' : 'El oro sirve para subir de nivel tus cartas. La experiencia no se vende: siempre hay que jugar.'} Los «% extra» se comparan con el pack más pequeño. Precios de prueba: en esta versión no se cobra nada.</p>`;
  const list = $('#shop-list'); list.innerHTML = h;
  list.querySelectorAll('[data-buy]').forEach(b => { b.onclick = () => {
    const p = L.find(x => x.id === b.dataset.buy); play('select');
    confirmBox('¿COMPRAR?', `${p.name}<span class="big">${gem ? GEM_SVG : COIN_SVG} ${fmt(p.amt)}</span>por <b>${eur(p.eur)}</b><small>Versión de prueba: no se cobra nada y te lo llevas gratis.</small>`, 'COMPRAR', () => {
      if (gem) SAVE.gems += p.amt; else SAVE.gold += p.amt;
      saveGame(); play('win'); updateWallets(); toast(`+${fmt(p.amt)} ${gem ? 'gemas' : 'de oro'} · Microblizz te da las gracias`);
    });
  }; });
  const jb = $('#btn-joke'); if (jb) jb.onclick = () => { play('deny'); confirmBox('AGOTADO', `Se lo ha quedado el CEO de Microblizz.<small>Además, el precio tachado nunca existió: es un truco para que parezca una ganga. Así lo hacen ellos. Aquí, no.</small>`, null); };
  clearInterval(jokeT); jokeT = setInterval(() => { const c = $('#joke-clock'); if (!c || $('#scr-shop').hidden) { clearInterval(jokeT); return; } c.textContent = jokeClock(); }, 1000);
}
function openShop(tab) { if (tab) shopTab = tab; updateWallets(); show('scr-shop'); buildShop(); }
/* ---------- ventana de confirmación ---------- */
function confirmBox(title, html, okTxt, onOk, noTxt) {
  $('#cf-title').textContent = title; $('#cf-body').innerHTML = html;
  $('#cf-btns').innerHTML = okTxt ? `<button class="btn-ghost ol btn-ok" id="cf-ok">${okTxt}</button><button class="btn-ghost ol" id="cf-no">MEJOR NO</button>` : `<button class="btn-ghost ol" id="cf-no">${noTxt || 'VAYA'}</button>`;
  $('#scr-confirm').hidden = false;
  const close = () => { $('#scr-confirm').hidden = true; };
  $('#cf-no').onclick = () => { play('select'); close(); };
  if (okTxt) $('#cf-ok').onclick = () => { close(); onOk(); };
}
function updateBadges() {
  ensureDaily(); ensureWeekly();
  const ready = (L, W) => L.some(m => !m.claimed && m.prog >= mDef(m, W).goal);
  $('#mission-badge').hidden = !(ready(SAVE.daily.list, false) || ready(SAVE.weekly.list, true) || achReady() > 0);
  $('#coll-badge').hidden = !FACTION_ORDER.some(f => isUnlocked(f) && [FACTIONS[f].leader, ...FACTIONS[f].units].some(k => canLevel(k) && SAVE.gold >= upCost(uSave(k).lvl)));
  $('#pass-badge').hidden = !passClaimable();
  $('#shop-badge').hidden = !giftReady();
  const t = SAVE.tickets || 0; $('#gacha-badge').hidden = !t;
  $('#feat-gacha').textContent = t ? `¡${t} ${t > 1 ? 'tiradas gratis' : 'tirada gratis'}!` : 'Tira x1, x10 o x50';
  $('#feat-shop').textContent = giftReady() ? '¡Regalo diario gratis!' : !SAVE.starter ? '¡Pack de bienvenida!' : 'Oro, gemas y ofertas';
}
/* ---------- sátira: chat falso en directo ---------- */
const chatSt = { t: 6 };
function chatSay(kind, extra, key) {
  if (SAVE.chatOff) return;
  const box = $('#chat'); if (!box) return;
  const lines = (ownerOf() === 'phony' && CHAT_PH[kind]) || CHAT[kind]; if (!lines) return;
  const own = (CHAT_FAC[G.faction] || {})[kind];
  const vs = kind === 'idle' ? CHAT_VS[G.efac] : null;
  const bossI = G.mode === 'boss' ? (G.bossWi == null ? CEO_WI : G.bossWi) : G.level && G.level.boss ? G.level.wi : -1, bl = bossI >= 0 && (kind === 'idle' || kind === 'boss' || kind === 'start') ? CHAT_BOSS[bossI] : null;
  const choose = () => { const r = Math.random(); let t = bl && r < 0.3 ? pick(bl) : own && r < 0.62 ? pick(own) : vs && r < 0.8 ? pick(vs) : pick(lines); if (key && CHAT_UNIT[key] && Math.random() < 0.65) t = pick(CHAT_UNIT[key]); return t; };
  const recent = chatSt.recent || (chatSt.recent = []); let txt = choose();
  for (let i = 0; i < 8 && recent.includes(txt); i++) txt = choose();   // v0.9.13: sin repetir lo que acaba de salir
  recent.push(txt); if (recent.length > 10) recent.shift();
  if (extra) txt = txt.replace('{X}', extra);
  const fu = CHAT_USERS_FAC[G.faction], [nm, col] = fu && Math.random() < 0.3 ? pick(fu) : pick(CHAT_USERS);
  const d = document.createElement('div'); d.className = 'cl';
  d.innerHTML = `<b style="color:${col}">${nm}</b>: ${txt}`;
  box.appendChild(d);
  while (box.children.length > 4) box.removeChild(box.firstChild);
  setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 650); }, 6500);
}
function chatBurst(kind, n) { chatSay(kind); for (let i = 1; i < n; i++) setTimeout(() => { if (G.state === 'play' || G.state === 'ending') chatSay(kind); }, 500 + i * 650 + Math.random() * 400); }
function chatTick(dt) { chatSt.t -= dt; if (chatSt.t <= 0) { chatSay('idle'); chatSt.t = rand(5, 10); } }
function chatClear() { const b = $('#chat'); if (b) b.innerHTML = ''; chatSt.t = 6; chatSt.lastDep = null; chatSt.fullT = 0; chatSt.kq = []; chatSt.closeSaid = false; for (const k in chatCd) delete chatCd[k]; }
// v0.9.12: comentarios de lo que pasa. Cada tipo tiene su probabilidad y su pausa, y nunca dos seguidos en menos de 1,2 s
const chatCd = {};
function chatEv(kind, extra, key, prob = 1, cd = 5) {
  if (SAVE.chatOff || G.state !== 'play' || Math.random() > prob) return;
  if (chatCd[kind] != null && G.t - chatCd[kind] < cd) return;
  if (chatCd._any != null && G.t - chatCd._any < 1.2) return;
  chatCd[kind] = chatCd._any = G.t; chatSt.t = Math.max(chatSt.t, 3.5); chatSay(kind, extra, key);
}
function chatWatch(dt) {   // CAOS a tope sin gastar, nadie juega cartas, final igualado
  if (chatSt.lastDep == null) chatSt.lastDep = G.t;
  if (S.p.chaos >= CFG.chaosMax - 0.01) { chatSt.fullT = (chatSt.fullT || 0) + dt; if (chatSt.fullT > 6) { chatSt.fullT = 0; chatEv('full', null, null, 1, 25); } } else chatSt.fullT = 0;
  if (G.t - chatSt.lastDep > 18) chatEv('afk', null, null, 1, 30);
  if (!chatSt.closeSaid && G.mode !== 'boss' && G.time < 20 && S.p.crowns === S.e.crowns) { chatSt.closeSaid = true; chatEv('close', null, null, 1, 0); }
}
/* ---------- sátira: imagen para compartir ---------- */
function shareHeadline() {
  const R = G.rewards || {}, w = G.winner;
  let key = G.mode === 'boss' ? 'boss' : R.unlock ? 'unlock' : w === 'p' ? 'win' : 'lose';
  const HL = ownerOf() === 'phony' && key !== 'boss' ? HEADLINES_PH : HEADLINES;
  return pick(HL[key]).replace('{c}', S.p.crowns).replace('{L}', CFG.cards[FACTIONS[G.faction].leader].name).replace('{F}', FACTIONS[G.faction].name).replace('{U}', R.unlock ? capFirst(losOf(R.unlock)) : '').replace('{S}', fmt(R.score || 0)).replace('{B}', G.bossName || 'El jefe');
}
function wrapLines(c, str, maxW) {
  const words = str.split(' '), out = []; let cur = '';
  for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (c.measureText(t).width > maxW && cur) { out.push(cur); cur = wd; } else cur = t; }
  if (cur) out.push(cur); return out;
}
function makeShareImage() {
  const Wd = 720, Hd = 900, cv2 = document.createElement('canvas'); cv2.width = Wd; cv2.height = Hd;
  const c = cv2.getContext('2d'), w = G.winner, R = G.rewards || {};
  const g = c.createLinearGradient(0, 0, 0, Hd); g.addColorStop(0, '#3b1d63'); g.addColorStop(1, '#140a20'); c.fillStyle = g; c.fillRect(0, 0, Wd, Hd);
  c.globalAlpha = 0.07; c.fillStyle = '#ffffff'; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc((i * 137) % Wd, (i * 251) % Hd, 18 + (i % 5) * 9, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1;
  const T = (str, x, y, size, col, font = FONT_D, align = 'center') => { c.font = `${size}px ${font}`; c.textAlign = align; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = Math.max(4, size * 0.22); c.strokeStyle = OL; c.strokeText(str, x, y); c.fillStyle = col; c.fillText(str, x, y); };
  T('FANS OF', Wd / 2, 58, 34, '#ffffff'); T('RUMBLE', Wd / 2, 108, 70, '#ff8a1f');
  // periódico
  c.save(); c.translate(Wd / 2, 300); c.rotate(-0.025);
  c.fillStyle = '#f5efe1'; c.strokeStyle = OL; c.lineWidth = 6; c.beginPath(); if (c.roundRect) c.roundRect(-300, -130, 600, 260, 14); else c.rect(-300, -130, 600, 260); c.fill(); c.stroke();
  c.fillStyle = '#20102c'; c.font = `26px ${FONT_D}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EL DIARIO DEL GAMER · ÚLTIMA HORA', 0, -100);
  c.fillRect(-270, -80, 540, 3);
  c.font = `bold 30px "Trebuchet MS", system-ui, sans-serif`; const lines = wrapLines(c, shareHeadline(), 520).slice(0, 4);
  lines.forEach((ln, i) => c.fillText(ln, 0, -40 + i * 38 - (lines.length - 3) * 14));
  c.restore();
  // líder
  const lk = FACTIONS[G.faction].leader, sp = SPR[lk];
  if (sp) { const hh = 290, ww = sp.wd * hh / sp.ht; c.save(); c.globalAlpha = 0.35; c.fillStyle = '#000'; c.beginPath(); c.ellipse(175, 745, 95, 22, 0, 0, Math.PI * 2); c.fill(); c.restore(); c.drawImage(sp.c, 175 - ww / 2, 745 - hh * 0.97, ww, hh); }
  const title = G.mode === 'boss' ? (w === 'e' ? 'DERROTA' : !bases.e.alive ? 'JEFE DERROTADO' : G.bossWi === CEO_WI ? 'DAÑO AL CEO' : 'DAÑO AL JEFE') : w === 'p' ? '¡VICTORIA!' : w === 'e' ? 'DERROTA' : 'EMPATE';
  T(title, Wd / 2 + 120, 520, title.length > 10 ? 52 : 62, w === 'e' ? '#ff6b7a' : '#ffe14d');
  const sub = G.mode === 'boss' ? fmt(R.score || 0) + ' de daño' : G.mode === 'camp' && w === 'p' ? '★'.repeat(R.stars || 0) + ' · ' + G.level.name : `${S.p.crowns} - ${S.e.crowns} coronas`;
  T(sub, Wd / 2 + 120, 590, 32, '#ffffff');
  T(`${FACTIONS[G.faction].name} contra ${enemyLabel(G.efac)}`, Wd / 2 + 120, 640, 22, '#cdb9ea', `"Trebuchet MS", system-ui, sans-serif`);
  T(`${S.p.kills} enemigos despedidos · ${S.p.deployed} cartas`, Wd / 2 + 120, 680, 22, '#cdb9ea', `"Trebuchet MS", system-ui, sans-serif`);
  c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, Hd - 120, Wd, 120);
  T('¿Te atreves con Microblizz?', Wd / 2, Hd - 84, 30, '#ffffff');
  T(GAME_URL, Wd / 2, Hd - 46, 22, '#9ef07a', `"Trebuchet MS", system-ui, sans-serif`);
  c.font = `14px system-ui, sans-serif`; c.fillStyle = 'rgba(255,255,255,.55)'; c.textAlign = 'center'; c.fillText('Juego de humor. Microblizz no existe (por suerte).', Wd / 2, Hd - 16);
  return cv2;
}
async function shareResult() {
  play('select');
  const cv2 = makeShareImage(), url = cv2.toDataURL('image/png'), text = `${shareHeadline()} · Juega a Fans of Rumble: https://${GAME_URL}/`;
  try {
    const blob = await new Promise(r => cv2.toBlob(r, 'image/png'));
    const file = new File([blob], 'fans-of-rumble.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text, title: 'Fans of Rumble' }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  let framed = true; try { framed = window.self !== window.top; } catch (e) { /* iframe de otro dominio */ }
  $('#share-img').src = url; $('#share-dl').href = url; $('#share-dl').hidden = framed;   // dentro de un marco la descarga no funciona: se guarda la imagen a mano
  $('#scr-share').hidden = false;
}
/* ---------- campaña ---------- */
const lvlStars = id => SAVE.camp[id] || 0;
const worldOpen = wi => worldOpenD(wi, 'n');
const levelOpen = l => SAVE.testAll || (worldOpen(l.wi) && (l.li === 0 || lvlStars(`${l.wi + 1}-${l.li}`) > 0));
const findLevel = id => { const [w, l] = id.split('-').map(Number); return WORLDS[w - 1].levels[l - 1]; };
function nextLevel(L) { const Wd = WORLDS[L.wi]; if (L.li < Wd.levels.length - 1) return Wd.levels[L.li + 1]; return WORLDS[L.wi + 1] ? WORLDS[L.wi + 1].levels[0] : null; }
const enemyLabel = f => (isCorp(f) ? CORP[f] : FACTIONS[f].corr || FACTIONS[f].name + ' corrompidos');
function buildCamp() {
  const d = campDiff, list = $('#world-list'); let cur = 0;
  for (const b of document.querySelectorAll('[data-cd]')) { b.setAttribute('aria-pressed', String(b.dataset.cd === d)); b.classList.toggle('dim', b.dataset.cd !== 'n' && !WORLDS.some((w, wi) => worldOpenD(wi, b.dataset.cd))); }
  $('#camp-sub').textContent = CAMP_SUB[d];
  $('#camp-mod').innerHTML = d === 'm' ? modBoxHtml() : '';
  const rb = $('#btn-rl-again'); if (rb) rb.onclick = () => { play('select'); openRoulette(); };
  list.innerHTML = WORLDS.map((w, wi) => {
    const open = worldOpenD(wi, d), stars = w.levels.reduce((a, l) => a + starsD(l.id, d), 0); if (open) cur = wi;
    const nodes = w.levels.map(l => { const st = starsD(l.id, d), ok = levelOpenD(l, d); return `<button class="node${d !== 'n' ? ' cd-' + d : ''}${l.boss ? ' boss' : ''}${ok && !st ? ' next' : ''}" data-lv="${l.id}" ${ok ? '' : 'disabled'}><b class="ol">${l.boss ? 'JEFE' : wi + 1 + '-' + (l.li + 1)}</b><small>${l.name}</small><span class="st">${'★'.repeat(st)}<i>${'★'.repeat(3 - st)}</i></span></button>`; }).join('');
    const lv = d === 'n' ? '' : `Nivel ${CDIFF[d].lvl(w.levels[0])}${CDIFF[d].lvl(w.levels[0]) !== CDIFF[d].lvl(w.levels[3]) ? '-' + CDIFF[d].lvl(w.levels[3]) : ''} · `;
    const nextTxt = wi === CEO_WI ? 'Premio: abre el sótano y la Campaña 2' : wi === WORLDS.length - 1 ? 'El final de la Era Digital' : 'Premio: abre el mundo ' + (wi + 2);
    const reward = d === 'h' ? lv + 'premios dobles' : d === 'm' ? lv + (SAVE.mythPrize[wi] ? 'legendario conseguido' : 'su jefe da un legendario') : w.unlock ? `Premio: se unen ${losOf(w.unlock)}` : nextTxt;
    const lockTxt = d === 'h' ? 'Pásate este mundo en Normal para jugarlo en Difícil.' : d === 'm' ? 'Pásate este mundo en Difícil para jugarlo en Mítica.' : w.openAfter ? 'Bloqueado: gana al CEO de Microblizz (mundo 7) para empezar la Campaña 2.' : 'Bloqueado: gana al jefe del mundo anterior.';
    const port = w.efac === 'microblizz' ? (wi ? 'parchebot' : 'becario') : w.efac === 'phony' ? (wi === WORLDS.length - 1 ? 'remasterbot' : 'descargabot') : FACTIONS[w.efac].leader;
    const head = wi === 0 ? '<div class="camp-head ol">CAMPAÑA 1 · LA REBELIÓN DE LOS FANS<small>contra Microblizz</small></div>' : w.camp === 2 && WORLDS[wi - 1].camp !== 2 ? '<div class="camp-head c2 ol">CAMPAÑA 2 · LA ERA DIGITAL<small>contra Phony y su PayStation</small></div>' : '';
    return head + `<div class="world${open ? '' : ' locked'}${d === 'm' && open ? ' cd-m' : ''}" data-wi="${wi}" style="--wc:${d === 'h' ? '#8a2b3a' : d === 'm' ? '#5b2a8f' : w.efac === 'microblizz' ? '#1d3f8a' : w.efac === 'phony' ? '#8a6a12' : FAC_COLOR[w.efac] + '77'}"><div class="world-head"><canvas data-k="${port}"></canvas><div class="world-name ol">${wi + 1}. ${w.name}<small>${enemyLabel(w.efac)} · ${reward}</small></div><div class="world-stars ol">★ ${stars}/12</div></div><p class="world-story">${open ? w.story : lockTxt}</p><div class="nodes">${nodes}</div></div>`;
  }).join('');
  for (const cv of list.querySelectorAll('canvas[data-k]')) drawArt(cv, cv.dataset.k, 52, 46);
  list.querySelectorAll('[data-lv]').forEach(b => { b.onclick = () => { play('select'); openPrep('camp', findLevel(b.dataset.lv)); }; });
  const el = list.querySelector(`[data-wi="${cur}"]`); if (el) list.scrollTop = Math.max(0, el.offsetTop - list.offsetTop - 8);
}
function openCamp() { updateWallets(); show('scr-camp'); buildCamp(); }
/* ---------- antes de jugar: elegir facción ---------- */
function openPrep(mode, lvl) {
  G.prep = { mode, lvl: lvl || null, cd: mode === 'camp' ? campDiff : 'n' };
  const info = $('#prep-info');
  if (mode === 'camp') {
    const cd = campDiff, C = CDIFF[cd], pay = C.pay || 1, Wd = WORLDS[lvl.wi], st = starsD(lvl.id, cd), fr = lvl.boss ? ECON.camp.boss : ECON.camp.first;
    $('#prep-title').textContent = lvl.boss ? `JEFE DEL MUNDO ${lvl.wi + 1}` : `NIVEL ${lvl.wi + 1}-${lvl.li + 1}`;
    let extra = '';
    if (cd !== 'n') {
      const who = Wd.efac === 'microblizz' ? 'Sus FallenHero y Parche Día 1 llevan' : Wd.efac === 'phony' ? 'Sus Servidor Caído y Remaster 70 € llevan' : `${CFG.cards[FACTIONS[Wd.efac].leader].name} lleva`;
      extra += `<div class="gear-list"><span class="gear-who">${who}:</span>${ENEMY_GEAR[cd][lvl.wi].map(id => gearRow(id, C.q)).join('')}</div>`;
      if (cd === 'm') { const M = mythicWeek(); extra += `<div class="mod-row bad"><b>TU CASTIGO</b>${M.deb.name}: ${M.deb.desc}</div><div class="mod-row good"><b>VENTAJA DE LA CPU</b>${M.buf.name}: ${M.buf.desc}</div>`; }
    }
    const ffi = lvl.boss && cd !== 'n' && worldFac(lvl.wi) && !(SAVE.facItem || {})[worldFac(lvl.wi)] ? ` · Y su objeto de facción: ${ITEMS[FAC_ITEM[worldFac(lvl.wi)]].name}` : '';
    const prize = (cd === 'm' && lvl.boss && !SAVE.mythPrize[lvl.wi] ? ' · Al ganar por primera vez: ¡un objeto o habilidad legendario!' : '') + ffi;
    info.innerHTML = `${cd !== 'n' ? `<span class="cd-badge ${cd} ol">${C.name.toUpperCase()}</span>` : ''}<b class="ol">${lvl.name}</b><br>Mundo ${lvl.wi + 1}: ${Wd.name}. Rival: ${enemyLabel(Wd.efac)}, nivel ${cd === 'n' ? lvl.elvl : C.lvl(lvl)}${lvl.boss ? ', con jefe y sus habilidades' : ''}.${extra}<br><span class="stars">${'★'.repeat(st)}<span style="color:#4a3866">${'★'.repeat(3 - st)}</span></span> Estrellas: ganar · sin perder ninguna torre · tirando su base.<br><span class="rw">${st ? `Recompensa: ${ECON.camp.replay * pay} de oro` : `Primera vez: ${fr[0] * pay} de oro y ${fr[1] * pay} gemas`}${st < 3 ? ` · 3 estrellas: +${ECON.camp.stars3[0] * pay} de oro y ${ECON.camp.stars3[1] * pay} gemas` : ''}${prize}</span>`;
  } else if (mode === 'boss') {
    $('#prep-title').textContent = 'MODO JEFE';
    buildBossPrep();   // v0.9.15
  } else {
    $('#prep-title').textContent = 'PARTIDA RÁPIDA';
    info.innerHTML = `Contra Microblizz. Tus cartas juegan con su nivel y Microblizz se pone a tu nivel medio.<br><span class="rw">Recompensa: ${ECON.quick.easy} de oro en Becario o ${ECON.quick.normal} en Ejecutivo si ganas (${ECON.quick.lose} si pierdes), y experiencia para tus cartas.</span>`;
  }
  $('#diff-label').hidden = $('#diff-row').hidden = mode !== 'quick';
  $('#boss-pick').hidden = $('#bdiff-row').hidden = mode !== 'boss';
  if (!isUnlocked(G.faction)) setFaction(SAVE.unlocked[0]);
  syncMenu(); updateWallets(); show('scr-prep'); fitText($('#prep-title'), 52, 26);
  for (const nb of document.querySelectorAll('#fac-grid .fac-opt b')) fitText(nb, 16, 10);   // v0.9.13: «Comunidad Gamer» también cabe
}
function setupMatch(mode, lvl, cd) {
  G.mode = mode; G.level = lvl || null; G.cdiff = mode === 'camp' ? cd || 'n' : 'n'; resetMods();
  if (mode === 'camp') {
    const Wd = WORLDS[lvl.wi]; G.efac = Wd.efac; G.elvl = lvl.elvl; G.bossOn = !!lvl.boss; G.bossName = lvl.boss || 'SurvivalBot';
    G.diffCfg = Object.assign({}, CFG.diff.normal, { aiIncome: lvl.income, think: [0.6, 1.2], bossCd: 18, stun: 2, despido: 20 + lvl.elvl * 2 });
    G.ebaseName = lvl.boss ? lvl.boss.toUpperCase() : Wd.efac === 'microblizz' ? 'SEDE DE MICROBLIZZ' : Wd.efac === 'phony' ? 'SEDE DE PHONY' : FACTIONS[Wd.efac].base;
  } else if (mode === 'boss') {   // v0.9.15: el jefe y la dificultad que elegiste
    const sel = SAVE.bossSel || { wi: CEO_WI, d: 'n' }, wi = bossOpen(sel.wi) ? sel.wi : CEO_WI, d = BDIFF[sel.d] ? sel.d : 'n', B = bossOf(wi), BD = BDIFF[d];
    G.bossWi = wi; G.bossDiff = d;
    G.efac = B.efac; G.elvl = Math.min(12, avgLevel(G.faction) + BD.lvl); G.bossOn = true; G.bossName = B.name; G.ebaseName = wi === CEO_WI ? 'EL CEO' : B.name.toUpperCase();
    G.diffCfg = Object.assign({}, CFG.diff.normal, { aiIncome: B.inc * BD.inc, think: BD.think.slice(), bossCd: BD.cd, stun: BD.stun, despido: 20 + G.elvl * 2 });
  } else {
    G.efac = 'microblizz'; G.elvl = avgLevel(G.faction); G.bossOn = true; G.bossName = 'SurvivalBot'; G.ebaseName = 'SURVIVALBOT'; G.diffCfg = CFG.diff[G.diff];
  }
  const deck = mode === 'boss' ? WORLDS[G.bossWi].levels[3].deck || null : G.level && G.level.deck ? G.level.deck : G.efac === 'microblizz' && mode === 'quick' ? ['becario', 'starbot', 'fallen'] : null;
  G.classicAI = G.efac === 'microblizz' && !!deck && deck.every(k => ['becario', 'starbot', 'fallen'].includes(k));
  G.edeck = deck;
  G.eextra = enemyExtras(mode, lvl);   // v0.9.15: hechizos y mata-sanadores de la CPU
  if (mode === 'boss' && BDIFF[G.bossDiff].gear) { const BD = BDIFF[G.bossDiff]; G.egear = ENEMY_GEAR[BD.gear][G.bossWi]; G.egearQ = BD.q; if (isCorp(G.efac)) G.egearOn = G.efac === 'phony' ? PH_GEAR_ON : MB_GEAR_ON; }
  if (G.cdiff !== 'n') setupHardMode(lvl);
  G.terrain = terrainFor(mode, lvl);   // v0.9.18: campo especial de algunos jefes
}
// v0.9.15: la CPU también lanza hechizos (y en Difícil y Mítica saca a su mata-sanadores)
function enemyExtras(mode, lvl) {
  const F = FACTIONS[G.efac], g = F.gacha || [], dmg = g.find(k => CFG.cards[k].spell && CFG.cards[k].spell.kind === 'dmg'), crazy = g.find(k => CFG.cards[k].rarity === 'legendary'), killer = g.find(k => CFG.units[k]);
  const own = F.spells ? F.spells.slice() : dmg ? [dmg] : [];
  if (mode === 'quick') return G.diff === 'normal' ? own : [];
  if (mode === 'boss') return own.concat(G.bossDiff === 'm' ? [killer, crazy] : G.bossDiff === 'h' ? [killer] : []).filter(Boolean);
  if (!lvl || lvl.elvl < 3) return [];   // el primer mundo, sin hechizos
  const cd = G.cdiff || 'n';
  return own.concat(cd === 'm' ? [killer, crazy] : cd === 'h' ? [killer] : []).filter(Boolean);
}
function startGame() {
  const P = G.prep || { mode: 'quick' };
  if (!isUnlocked(G.faction)) { toast('Esa facción todavía está bloqueada'); play('deny'); return; }
  setupMatch(P.mode, P.lvl, P.cd); startMatch();
}
/* ---------- recompensas al terminar ---------- */
function grantRewards() {
  const R = { gold: 0, gems: 0, xp: [], stars: 0, unlock: null, record: false, ready: [] }, win = G.winner === 'p', w = G.winner;
  for (const [k, n] of Object.entries(S.p.plays)) {
    const us = uSave(k); if (us.lvl >= ECON.maxLvl) continue;
    const x = Math.round(n * ECON.xpPerPlay * (win ? ECON.winXpMult : 1)); us.xp += x; R.xp.push([k, x]); if (canLevel(k)) R.ready.push(k);
  }
  if (G.mode === 'quick') R.gold = win ? ECON.quick[G.diff] : ECON.quick.lose;
  else if (G.mode === 'camp') {
    const L = G.level, cd = G.cdiff || 'n', pay = CDIFF[cd].pay || 1, prev = starsD(L.id, cd);
    if (win) {
      R.stars = 1 + (S.e.crowns === 0 ? 1 : 0) + (G.endReason === 'base' ? 1 : 0);
      if (!prev) { const fr = L.boss ? ECON.camp.boss : ECON.camp.first; R.gold += fr[0] * pay; R.gems += fr[1] * pay; } else R.gold += ECON.camp.replay * pay;
      if (R.stars === 3 && prev < 3) { R.gold += ECON.camp.stars3[0] * pay; R.gems += ECON.camp.stars3[1] * pay; }
      campOf(cd)[L.id] = Math.max(prev, R.stars);
      const Wd = WORLDS[L.wi];
      if (L.boss && Wd.unlock && !isUnlocked(Wd.unlock)) {   // la facción liberada llega con algo de nivel para no empezar de cero
        SAVE.unlocked.push(Wd.unlock); R.unlock = Wd.unlock; stat('unlock', 1);
        const UF = FACTIONS[Wd.unlock]; for (const k of [UF.leader, ...UF.units]) { const us = uSave(k); us.lvl = Math.max(us.lvl, L.elvl - 1); }
      }
      missionEvent('star', R.stars);
      if (L.boss && L.wi === CEO_WI) stat('ceo', 1);
      if (L.boss && WORLDS[L.wi].unlock === 'olvidados') stat('olvido', 1);
      if (L.boss && L.wi === WORLDS.length - 1) stat('phonyboss', 1);
      if (L.boss && cd !== 'n') stat(cd === 'h' ? 'hardboss' : 'mythboss', 1);
      if (L.boss && cd === 'm' && !SAVE.mythPrize[L.wi]) { SAVE.mythPrize[L.wi] = 1; R.prize = legendaryPrize(); }
      const ff = worldFac(L.wi); if (L.boss && cd !== 'n' && ff && !(SAVE.facItem || {})[ff]) { SAVE.facItem = SAVE.facItem || {}; SAVE.facItem[ff] = 1; R.facItem = newCopy('eq', FAC_ITEM[ff], 2); }
    } else R.gold += ECON.camp.lose * pay;
  } else if (G.mode === 'boss') {   // v0.9.15: premios por jefe y dificultad, y un extra si lo derrotas
    const wi = G.bossWi == null ? CEO_WI : G.bossWi, d = G.bossDiff || 'n', BD = BDIFF[d], key = wi + d, hp = bases.e.maxHp, sc = Math.round(S.p.bossDmg), kill = !bases.e.alive && w !== 'e';
    R.score = sc; R.pct = Math.min(100, Math.floor(sc / hp * 100)); R.gold = Math.floor(sc / 40 * BD.pay); R.boss = { wi, d, key, tiers: [], kill, first: false };
    let bits = SAVE.bossPay[key] || 0;
    BOSS_TIERS.forEach((f, i) => { if (sc >= hp * f && !(bits & (1 << i))) { bits |= 1 << i; R.gems += BOSS_TGEMS[i] * BD.pay; R.boss.tiers.push(i); } });
    if (kill) { R.boss.bonus = BOSS_KGOLD * BD.pay + Math.round(Math.max(0, G.time)) * 2; R.gold += R.boss.bonus; if (!(bits & 8)) { bits |= 8; R.gems += BOSS_KGEMS * BD.pay; R.boss.first = true; } stat('bosskill', 1); if (d === 'm') stat('bosskillm', 1); }
    SAVE.bossPay[key] = bits;
    if (sc > (SAVE.bossRec[key] || 0)) { SAVE.bossRec[key] = sc; R.record = true; }
    if (sc > (SAVE.bestBoss || 0)) SAVE.bestBoss = sc;
    missionEvent('boss', 1);
  }
  if (win) missionEvent('win', 1);
  missionEvent('play', 1); if (G.mode === 'camp' || G.mode === 'quick') missionEvent(G.mode, 1);
  missionEvent('caos', Math.round(S.p.spent)); missionEvent('leader', S.p.plays[FACTIONS[G.faction].leader] || 0);
  if (win && S.e.crowns === 0) missionEvent('flawless', 1);
  if (win && G.endReason === 'base') missionEvent('base', 1);
  if (win) missionEvent('facwin', 1, G.faction);
  R.passXp = win ? PASS.xpWin : PASS.xpLose; R.passUp = addPassXp(R.passXp);
  missionEvent('card', S.p.deployed); missionEvent('kill', S.p.kills); missionEvent('tower', Math.min(S.p.crowns, 2 + (G.endReason === 'base' ? 1 : 0)));
  if (win && !SAVE.tut.done && SAVE.tut.step === 0) tutStep(1);   // partida guiada: primera victoria
  // v0.9.14: estadísticas de los logros (cartas jugadas, enemigos por tipo, rachas y secretos)
  for (const [k, n] of Object.entries(S.p.plays)) stat('play_' + k, n);
  for (const [k, n] of Object.entries(S.p.kb || {})) stat('ek_' + k, n);
  stat('ekf_' + G.efac, S.p.kills); stat('eleader', S.p.kl || 0);
  const ST = SAVE.stats, real = G.mode !== 'boss', rwin = win && real;
  if (rwin) { stat('fwin_' + G.faction, 1); ST.curStreak = (ST.curStreak || 0) + 1; ST.bestStreak = Math.max(ST.bestStreak || 0, ST.curStreak); }
  else if (G.winner === 'e') { ST.curStreak = 0; stat('lose', 1); }
  if (new Date().getHours() < 5) stat('night', 1);
  if (rwin && S.e.crowns >= 2) stat('comeback', 1);
  if (rwin && S.p.deployed > 0 && Object.keys(S.p.plays).every(isLeader)) stat('onlylead', 1);
  if (real && !S.p.deployed) stat('strike', 1);
  if (rwin && S.p.spent <= 30) stat('cheapwin', 1);
  if (S.p.spent >= 100) stat('bigspend', 1);
  if (S.p.kills >= 60) stat('massacre', 1);
  const myBase = structs.find(x => x.team === 'p' && x.role === 'base'); if (rwin && myBase && myBase.hp / myBase.maxHp < 0.15) stat('closecall', 1);
  if (rwin && G.endReason === 'base' && CFG.matchTime - G.time < 100) stat('fastwin', 1);
  if (rwin && G.endReason === 'hp') stat('hpwin', 1);
  if (rwin && G.mode === 'quick' && G.diff === 'easy') stat('easywin', 1);
  SAVE.gold += R.gold; SAVE.gems += R.gems; saveGame(); return R;
}

function fit() {
  const bw = document.body.clientWidth, bh = document.body.clientHeight;
  const narrow = bw < 600, pad = narrow ? 0 : 24;
  // tall phones get extra room: HUD moves above the arena, cards get more thumb space
  const LH = narrow ? clamp(Math.round((W * bh) / Math.max(1, bw)), H, 1170) : H;
  let w = bw - pad * 2, h = (w * LH) / W;
  if (h > bh - pad * 2) { h = bh - pad * 2; w = (h * W) / LH; }
  w = Math.max(200, Math.floor(w)); h = Math.floor((w * LH) / W);
  stage.style.width = w + 'px'; stage.style.height = h + 'px';
  const extra = LH - H; VIEW.LH = LH; VIEW.top = Math.round(extra * 0.45); VIEW.bot = extra - VIEW.top;
  ui.style.height = LH + 'px'; ui.style.setProperty('--top', VIEW.top + 'px'); ui.style.setProperty('--bot', VIEW.bot + 'px');
  ui.style.transform = `scale(${w / W})`; VIEW.sc = w / W;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  VIEW.k = cv.width / W;
}
function toLogical(e) {   // v0.9.18: x, y = punto del campo (con el zoom); sy = altura en la pantalla (para saber si el dedo está sobre las cartas)
  const r = stage.getBoundingClientRect(), sx = ((e.clientX - r.left) / r.width) * W, sy = ((e.clientY - r.top) / r.height) * VIEW.LH;
  return { x: (sx - CAM.ox) / CAM.z, y: (sy - CAM.oy) / CAM.z - VIEW.top, sy: sy - VIEW.top };
}

let toastTimer = null;
function toast(msg, good) { const t = $('#toast'); t.textContent = msg; t.classList.toggle('good', !!good); t.classList.toggle('menu', !['play', 'countdown', 'paused', 'ending'].includes(G.state)); t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400); }
let bannerTimer = null;
// v0.9.9: cada cartel se queda el tiempo justo para leerlo (más si es largo) y los siguientes esperan su turno
const bannerQ = []; let bannerOn = false;
function banner(title, sub, kind, now) {
  if (now) bannerClear();
  if (bannerQ.some(q => q.title === title && q.sub === sub)) return;
  bannerQ.push({ title, sub, kind }); if (bannerQ.length > 3) bannerQ.splice(0, bannerQ.length - 3);
  if (!bannerOn) nextBanner();
}
function nextBanner() {
  const B = bannerQ.shift(), b = $('#banner'); if (!B) { bannerOn = false; return; }
  bannerOn = true;
  b.querySelector('.b-title').textContent = B.title; const bs = b.querySelector('.b-sub'); bs.textContent = B.sub || ''; bs.hidden = !B.sub;
  b.className = B.kind || ''; void b.offsetWidth; b.className = 'show ' + (B.kind || '');
  const dur = clamp(1500 + (B.title.length + (B.sub || '').length) * 45, 2600, 4800);
  clearTimeout(bannerTimer); bannerTimer = setTimeout(() => { b.className = B.kind || ''; bannerTimer = setTimeout(nextBanner, 300); }, dur);
}
function bannerClear() { bannerQ.length = 0; clearTimeout(bannerTimer); bannerOn = false; const b = $('#banner'); if (b) b.className = ''; }
function showTut(force) { if ((G.tutSeen && !force) || G.autoplay) return; $('#tut').hidden = false; if (!G.tutMatch) setTimeout(hideTut, 14000); }
function hideTut() { $('#tut').hidden = true; G.tutSeen = true; }

const hud = {
  cache: {},
  reset() { this.cache = {}; $('#x2').hidden = true; $('#score').hidden = G.mode !== 'boss'; },
  update() {
    if (!S) return; const c = this.cache; const ch = S.p.chaos;
    const fw = ((ch / CFG.chaosMax) * 100).toFixed(1) + '%'; if (c.fw !== fw) { $('#chaos-fill').style.width = fw; c.fw = fw; }
    const cn = Math.floor(ch); if (c.cn !== cn) { $('#chaos-num').textContent = cn; c.cn = cn; }
    const ts = Math.ceil(G.time); if (c.ts !== ts) { $('#timer').textContent = Math.floor(ts / 60) + ':' + String(ts % 60).padStart(2, '0'); $('#timer').classList.toggle('low', ts <= 30); c.ts = ts; }
    if (c.cp !== S.p.crowns) { $('#crown-p').textContent = S.p.crowns; c.cp = S.p.crowns; }
    if (c.ce !== S.e.crowns) { $('#crown-e').textContent = S.e.crowns; c.ce = S.e.crowns; }
    if (G.mode === 'boss') { const sc = `DAÑO ${fmt(S.p.bossDmg)} · ${Math.floor(S.p.bossDmg / bases.e.maxHp * 100)} %`; if (c.sc !== sc) { $('#score').textContent = sc; c.sc = sc; } }
    let pn = '';
    if (G.faction === 'streamers') pn = S.p.hypeLvl ? '+' + S.p.hypeLvl * 5 + '%' : S.p.hype + '/' + CFG.passives.streamers.per;
    else if (G.faction === 'heroes') pn = String(S.p.xpLvl);
    else if (G.faction === 'gamer') pn = S.p.comm ? '+' + S.p.comm * 5 + '%' : '';
    if (c.pn !== pn) { const em = $('#pass-n'); if (em) { em.textContent = pn; em.hidden = !pn; } c.pn = pn; }
    const lk = FACTIONS[G.faction].leader;
    const leaderOut = units.some(u => u.alive && u.team === 'p' && u.type === lk), leaderRising = revives.some(r => r.team === 'p' && r.type === lk);
    const nk = S.p.queue[0];
    if (c.next !== nk) { drawArt($('#next-art canvas'), nk, 34, 34); $('#next-art').dataset.rarity = CFG.cards[nk].rarity; $('#next-art').title = 'Siguiente: ' + CFG.cards[nk].name; c.next = nk; }
    for (const el of elCards) {
      const k = slotKey(el._slot);
      if (el._key !== k) { renderCard(el, k); if (el._key && G.state === 'play') { el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); } el._key = k; el._poor = undefined; el._h = undefined; }
      const cost = CFG.cards[k].cost, poor = ch < cost;
      const hgt = poor ? ((1 - ch / cost) * 100).toFixed(1) + '%' : '0%'; if (el._h !== hgt) { el._charge.style.height = hgt; el._h = hgt; }
      if (el._poor !== poor) { el.classList.toggle('poor', poor); el._poor = poor; }
      if (el._wasPoor && !poor && G.state === 'play') { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
      el._wasPoor = poor;
      const sel = (input.selected !== null && input.selSlot === el._slot) || (input.dragging && input.slot === el._slot); if (el._sel !== sel) { el.classList.toggle('selected', sel); el._sel = sel; }
      if (k === lk) { const txt = leaderOut ? 'EN EL CAMPO' : leaderRising ? (G.faction === 'pop' ? 'SECUELA' : 'RENACIENDO') : S.p.leaderCd > 0 ? 'VUELVE EN ' + Math.ceil(S.p.leaderCd) : ''; if (el._lockTxt !== txt) { el._lock.textContent = txt; el._lock.hidden = !txt; el._lockTxt = txt; } }
    }
  },
};

// v0.9.10: ficha de la carta al mantenerla pulsada (dedo o ratón) sin arrastrarla
function roleOf(k) {
  const u = CFG.units[k], c = CFG.cards[k], r = [];
  if (c.spell) return ['Hechizo', { dmg: 'Daño', heal: 'Cura' }[c.spell.kind] || 'Efecto loco', c.spell.side === 'ally' ? 'Sobre los tuyos' : 'Sobre el rival'];   // v0.9.15
  if (u.leap) r.push('Mata-sanadores');
  if (isLeader(k)) r.push('Líder');
  if (u.healer) r.push('Curandera');
  else if (u.kamikaze) r.push('Kamikaze: va a por las torres');
  else if (u.buildings) r.push('Asedio: solo ataca edificios');
  else if (!isLeader(k) && u.hp * (c.count || 1) >= 700) r.push('Tanque');
  if (!u.healer && !u.kamikaze) r.push(u.ranged ? 'A distancia' : 'Cuerpo a cuerpo');
  if ((c.count || 1) > 1) r.push(`Salen ${c.count}`);
  return r;
}
function showCardTip(k) {
  G.tutTipSeen = true;
  if (isSpell(k)) { showSpellTip(k); return; }   // v0.9.15
  const c = CFG.cards[k], u = CFG.units[k], lv = uSave(k).lvl, m = 1 + (lv - 1) * ECON.lvlStep, tip = $('#card-tip');
  const es = effStats(k, G.faction), bst = es.boosts.length ? `<span class="boost">Con todo puesto: ${es.boosts.join(', ')}</span>` : '';
  const stats = (u.healer ? `Vida ${fmt(es.hp)} · Cura ${u.heal} cada ${fmtV(u.healCd)} s a los que tiene delante (en un cono)` : `Vida ${fmt(es.hp)}${c.count > 1 ? ' cada una' : ''} · Daño ${fmt(es.dmg)}${u.buildings ? ' a edificios' : ''}`) + bst;
  const ab = invGet(SAVE.abEquip[k]);
  let extra = ab ? `<div class="tip-ab">Habilidad del gashapón: <b>${ABILITIES[ab.id].name}</b> (${QTIERS[tierOf(avgQ(ab))].name}): ${descOf(ab)}</div>` : '';
  if (isLeader(k)) { const E = SAVE.equip[G.faction] || {}, its = Object.keys(SLOTS).map(sl => invGet(E[sl])).filter(Boolean); if (its.length) extra += `<div class="tip-ab">Equipo: ${its.map(it => `<b>${ITEMS[it.id].name}</b> (${QTIERS[tierOf(avgQ(it))].name})`).join(', ')}.</div>`; }
  tip.innerHTML = `<div class="tip-head"><canvas></canvas><div><b class="ol">${c.name} <small>Nv ${lv}</small></b><span class="tip-tags"><i class="tcost">${c.cost} de CAOS</i>${roleOf(k).map(t => `<i>${t}</i>`).join('')}${c.rarity === 'leader' ? '' : `<i>${c.rar}</i>`}</span></div></div><p>${c.desc}</p><div class="tip-stats">${stats}</div>${extra}`;
  drawArt(tip.querySelector('canvas'), k, 64, 52); tip.hidden = false;
}
function hideCardTip() { const t = document.getElementById('card-tip'); if (t) t.hidden = true; }
function selectCard(slot) {
  if (G.state !== 'play') return;
  if (input.selected !== null && input.selSlot === slot) { input.selected = null; input.selSlot = null; return; }
  input.selected = slotKey(slot); input.selSlot = slot; play('select');
  if (input.touch) toast('Ahora toca tu lado del campo');
}
for (const el of elCards) {
  el.addEventListener('pointerdown', e => {
    if (G.state !== 'play') return;
    e.preventDefault(); audioInit();
    input.card = slotKey(el._slot); input.slot = el._slot; input.pointerId = e.pointerId; input.dragging = false; input.startX = e.clientX; input.startY = e.clientY; input.touch = e.pointerType !== 'mouse';
    clearTimeout(input.tipT); input.tipShown = false; const pid = e.pointerId;
    input.tipT = setTimeout(() => { if (input.card && !input.dragging && input.pointerId === pid && G.state === 'play') { showCardTip(input.card); input.tipShown = true; } }, 420);
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  el.addEventListener('click', e => { if (e.detail === 0) selectCard(el._slot); });
  el.addEventListener('contextmenu', e => e.preventDefault());   // sin menú del sistema al mantener pulsado
}
window.addEventListener('pointermove', e => {
  if (input.card && e.pointerId === input.pointerId) {
    if (!input.dragging && Math.hypot(e.clientX - input.startX, e.clientY - input.startY) > 10) { input.dragging = true; input.selected = null; input.selSlot = null; clearTimeout(input.tipT); if (input.tipShown) { input.tipShown = false; hideCardTip(); } }
    if (input.dragging) { const p = toLogical(e); input.ghost = { x: p.x, y: p.y - (input.touch ? 40 / CAM.z : 0) - FIELD_DY, fy: p.sy }; }
  }
});
function endPointer(e, cancelled) {
  if (!input.card || e.pointerId !== input.pointerId) return;
  clearTimeout(input.tipT);
  if (input.tipShown) { input.tipShown = false; hideCardTip(); input.card = null; input.slot = null; input.dragging = false; input.pointerId = null; return; }   // solo quería leer la ficha
  const k = input.card;
  if (!cancelled) {
    if (!input.dragging && Math.hypot(e.clientX - input.startX, e.clientY - input.startY) > 10) input.dragging = true;
    if (input.dragging) { const p = toLogical(e); const y = p.y - (input.touch ? 40 / CAM.z : 0) - FIELD_DY; if (p.sy < TRAY_Y - 4) tryPlayerDeploy(input.slot, k, p.x, y); }
    else selectCard(input.slot);
  }
  input.card = null; input.slot = null; input.dragging = false; input.pointerId = null; if (input.selected === null) input.ghost = null;
}
window.addEventListener('pointerup', e => endPointer(e, false));
window.addEventListener('pointercancel', e => endPointer(e, true));
function fieldTap(e) {
  if (G.state !== 'play' || input.selected === null) return;
  audioInit(); const p = toLogical(e); if (p.sy >= TRAY_Y) return;
  if (tryPlayerDeploy(input.selSlot, slotKey(input.selSlot), p.x, p.y - FIELD_DY)) { input.selected = null; input.selSlot = null; input.ghost = null; }
}
cv.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') fieldTap(e); });   // con el dedo va en camTouchEnd (v0.9.18: por si es un pellizco)
cv.addEventListener('pointermove', e => { if (input.selected && !input.card && e.pointerType === 'mouse') { const p = toLogical(e); input.ghost = { x: p.x, y: p.y - FIELD_DY, fy: p.sy }; } });
cv.addEventListener('pointerleave', () => { if (!input.card) input.ghost = null; });
window.addEventListener('keydown', e => {
  if (G.state === 'play' && ['1', '2', '3', '4', '5'].includes(e.key)) { input.touch = false; selectCard(+e.key - 2); }
  if (e.key === 'Escape') { if (G.state === 'play') { if (input.selected !== null) { input.selected = null; input.selSlot = null; } else pauseGame(); } else if (G.state === 'paused') resumeGame(); }
});

/* ---------- screens ---------- */
function show(id) { for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== id; const h = document.querySelector('#' + id + ' .scr-head .h2'); if (h) fitText(h, 38, 20); }
function hideScreens() { for (const s of document.querySelectorAll('.screen')) s.hidden = true; }
// v0.9.13: el campo cambia según tu facción y la empresa rival (se pinta de nuevo solo si hace falta)
let BG_KEY = '';
function ensureBG(plaza) { const key = G.faction + '|' + plaza; if (BG_KEY !== key) { BG = buildBG(G.faction, plaza); BG_KEY = key; } }
function startMatch() {
  ensureBG(ownerOf() === 'phony' ? 'ph' : 'mb');
  audioInit(); hideScreens(); resetMatch(); chatClear(); G.state = 'countdown'; camReset(); terrainStart();
  G.tutMatch = !G.autoplay && !SAVE.tut.done && SAVE.tut.step === 0; tutBattleStart(); applySpeed(); applyMatchMods(); hudMods();
  const F = FACTIONS[G.faction];
  banner('PASIVA: ' + F.passive, F.banner, F.kind);
  const L = G.level;
  const intro = G.mode === 'boss' ? [G.bossName, BOSS_QUOTE[G.bossWi] || (G.bossWi === CEO_WI ? '«Os he comprado. Ahora os cierro.»' : isCorp(G.efac) ? '«Hemos comprado vuestro juego… y lo vamos a cerrar.»' : '«Microblizz me ha ascendido. Ahora despido yo.»')]
    : L && L.boss ? [L.boss, BOSS_QUOTE[L.wi] || (G.efac === 'microblizz' ? (L.wi ? '«Os he comprado. Ahora os cierro.»' : '«Hemos comprado vuestro juego… y lo vamos a cerrar.»') : '«Microblizz me ha ascendido. Ahora despido yo.»')]
    : L ? [L.name, isCorp(G.efac) ? `Mundo ${L.wi + 1}: ${WORLDS[L.wi].name}` : `${enemyLabel(G.efac)} por ${ownerName()}`]
    : ['SurvivalBot', '«Hemos comprado vuestro juego… y lo vamos a cerrar.»'];
  setTimeout(() => { if (G.state === 'countdown' || G.state === 'play') { banner(intro[0], intro[1], 'enemy'); if (G.cdiff !== 'n') hardBanner(); else if (G.mode === 'boss' && G.bossDiff !== 'n') banner(BDIFF[G.bossDiff].name.toUpperCase(), `Rival de nivel ${G.elvl}, tropas de élite${G.egear ? ' y equipo' : ''}. Su sede: ${fmt(bases.e.maxHp)} de vida`, 'enemy'); } }, 2400);
  const seq = ['3', '2', '1', '¡CAOS!']; let i = 0; const el = $('#count');
  const tick = () => {
    if (G.state !== 'countdown') return;
    el.textContent = seq[i]; el.className = 'ol-big' + (i === 3 ? ' go' : ''); void el.offsetWidth; el.classList.add('pop');
    play(i < 3 ? 'tick' : 'go'); i++;
    if (i < seq.length) setTimeout(tick, 800); else setTimeout(() => { if (G.state === 'countdown') { G.state = 'play'; if (G.tutMatch) showTut(true); else if (!(SAVE.stats.card > 0)) showTut(); chatBurst('start', 2); if (G.cdiff !== 'n') setTimeout(() => { if (G.state === 'play') chatSay(G.cdiff === 'h' ? 'hard' : 'mythic'); }, 2600); } }, 500);
  };
  setTimeout(tick, 900);
}
function pauseGame() { if (G.state !== 'play') return; G.state = 'paused'; input.card = null; input.dragging = false; show('scr-pause'); }
function resumeGame() { if (G.state !== 'paused') return; hideScreens(); G.state = 'play'; }
function goHome() { ensureBG('mb'); setTagline(); $('#hud-mods').hidden = true; G.state = 'title'; chatClear(); resetMatch(); hud.update(); drawTitleArt(); updateWallets(); show('scr-title'); idleSc.tick = 0; achDay(); titlePopups(); }
function toMenu() { chatClear(); if (G.mode === 'camp') { G.state = 'title'; resetMatch(); hud.update(); openCamp(); } else goHome(); }
// v0.9.13: lo que dice cada jefe nuevo al empezar
const BOSS_QUOTE = { 7: '«Microblizz me encerró aquí abajo. Ahora no sale nadie.»', 8: '«¿Discos? Eso es del siglo pasado. Ahora pagas cada mes.»', 9: '«Phony me paga por ganar. Tú pagas por jugar.»', 10: '«Phony quiere otra secuela. Y la vas a protagonizar tú.»', 11: '«Todo lo que compraste es mío. Lo borro cuando quiera.»' };
const CROWN_SVG = '<svg viewBox="0 0 24 20"><path d="M2 17 L3 5 L8.5 10 L12 2 L15.5 10 L21 5 L22 17 Z" fill="currentColor" style="stroke: var(--outline)" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const STAR_SVG = '<svg viewBox="0 0 24 22"><path d="M12 1.5l3.1 6.4 7 1-5.1 4.9 1.2 7L12 17.5l-6.2 3.3 1.2-7L1.9 8.9l7-1z" fill="currentColor" style="stroke: var(--outline)" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const QUOTES = {
  p: ['Microblizz anuncia que cerrará otro juego para recuperar el dinero.', 'SurvivalBot ha sido cancelado. Otra vez.', 'Microblizz promete arreglar su robot… dentro de diez años.'],
  e: ['Microblizz ha cerrado tu facción. Tus cosas están en esa caja.', 'Microblizz te da las gracias por tu dinero.', 'Error 37: no se pudo conectar con la victoria.'],
  d: ['Empate. Microblizz dirá que ha ganado.'],
};
const QUOTES_PH = {
  p: ['Phony anuncia que subirá la suscripción para compensar la derrota.', 'La PayStation ha sido devuelta. Sin ticket.', 'Phony promete volver a poner lector de discos… en la PayStation 7.'],
  e: ['Phony te ha quitado la licencia de la victoria.', 'Phony te da las gracias por tu suscripción.', 'Error de conexión: no se pudo cargar la victoria.'],
  d: ['Empate. Phony te cobrará la revancha.'],
};
function showEnd() {
  chatClear(); bannerClear();   // v0.9.11: sin carteles de la partida encima de la pantalla final
  const w = G.winner, R = G.rewards = grantRewards(), t = $('#end-title');
  if (G.mode === 'boss') { t.textContent = w === 'e' ? 'DERROTA' : bases.e.alive ? '¡FIN DEL TURNO!' : G.bossWi === CEO_WI ? '¡CEO DESPEDIDO!' : '¡JEFE DERROTADO!'; t.className = 'end-title ol-big ' + (w === 'e' ? 'lose' : 'win'); }
  else { t.textContent = w === 'p' ? '¡VICTORIA!' : w === 'e' ? 'DERROTA' : 'EMPATE'; t.className = 'end-title ol-big ' + (w === 'p' ? 'win' : w === 'e' ? 'lose' : ''); }
  $('#end-crowns').innerHTML = G.mode === 'camp' && w === 'p' ? [0, 1, 2].map(i => `<span class="${i < R.stars ? 'on' : 'off'}">${STAR_SVG}</span>`).join('') : G.mode === 'boss' ? '' : [0, 1, 2].map(i => `<span class="${i < S.p.crowns ? 'on' : 'off'}">${CROWN_SVG}</span>`).join('');
  let sub;
  if (G.mode === 'boss') sub = `${G.bossName}${G.bossDiff !== 'n' ? ' (' + BDIFF[G.bossDiff].name + ')' : ''}: ${fmt(R.score)} de daño, el ${R.pct} % de su vida${R.record ? ' · ¡NUEVO RÉCORD!' : ' · Récord: ' + fmt(SAVE.bossRec[R.boss.key] || 0)}`;
  else if (G.mode === 'camp' && w === 'p') sub = `${G.level.name}${G.cdiff && G.cdiff !== 'n' ? ' (' + CDIFF[G.cdiff].name + ')' : ''}: ${R.stars === 3 ? '¡3 estrellas!' : R.stars + (R.stars === 1 ? ' estrella' : ' estrellas') + (S.e.crowns ? ' (perdiste una torre)' : ' (te faltó tirar su base)')}`;
  else sub = { base: w === 'p' ? `Has tirado ${isCorp(G.efac) ? FACTIONS[G.efac].end : 'su base'}.` : `Han tirado ${FACTIONS[G.faction].end}.`, crowns: `Tiempo: ${S.p.crowns} coronas contra ${S.e.crowns}.`, hp: 'Empate a coronas: gana quien conserva más vida en sus torres.', draw: 'Mismas coronas y misma vida.' }[G.endReason] || '';
  $('#end-sub').textContent = sub;
  let rw = '';
  if (R.unlock) rw += `<span class="rw-chip big ol">¡NUEVA FACCIÓN: ${FACTIONS[R.unlock].name.toUpperCase()}!</span>`;
  if (R.prize) rw += `<span class="rw-chip big ol">¡LEGENDARIO: ${defOf(R.prize).name.toUpperCase()}!</span>`;
  if (R.facItem) rw += `<span class="rw-chip big ol">¡OBJETO DE FACCIÓN: ${defOf(R.facItem).name.toUpperCase()}!</span>`;
  if (R.boss && R.boss.kill) rw += `<span class="rw-chip big ol">¡DERROTADO CON ${Math.round(Math.max(0, G.time))} S DE SOBRA! +${fmt(R.boss.bonus)} DE ORO${R.boss.first ? ' Y GEMAS' : ''}</span>`;
  if (R.boss && R.boss.tiers.length) rw += `<div class="rw-xp" style="color:#ffe06a">Premio por llegar al ${R.boss.tiers.map(i => Math.round(BOSS_TIERS[i] * 100) + ' %').join(', ')} de su vida.</div>`;
  if (R.gold) rw += `<span class="rw-chip ol">${COIN_SVG}+${fmt(R.gold)}</span>`;
  if (R.gems) rw += `<span class="rw-chip ol">${GEM_SVG}+${fmt(R.gems)}</span>`;
  if (R.xp.length) rw += `<div class="rw-xp">Experiencia: ${R.xp.map(([k, x]) => `${CFG.cards[k].name} +${x}`).join(' · ')}</div>`;
  if (R.ready.length) rw += `<div class="rw-xp" style="color:#9ef07a">¡Listas para subir de nivel en la Colección: ${R.ready.map(k => CFG.cards[k].name).join(', ')}!</div>`;
  $('#end-rewards').innerHTML = rw; adEndOffer(R);   // v0.9.16: premio x2 con anuncio
  $('#end-pass').innerHTML = passLevel() >= PASS.levels && !R.passUp ? 'Pase de batalla completado' : `Pase de batalla: +${R.passXp} puntos${R.passUp ? ` · <b style="color:#ffe14d">¡NIVEL ${passLevel()}!</b>` : ` · ${SAVE.pass.xp - passLevel() * PASS.xpPer}/${PASS.xpPer} para el nivel ${passLevel() + 1}`}`;
  $('#end-quote').textContent = R.unlock ? `${capFirst(losOf(R.unlock))} se libran de ${ownerName()} y se unen a la rebelión.` : pick((ownerOf() === 'phony' ? QUOTES_PH : QUOTES)[w || 'd']);
  $('#st-cards').textContent = S.p.deployed; $('#st-kills').textContent = S.p.kills; $('#st-chaos').textContent = Math.round(S.p.spent);
  let nx = G.mode === 'camp' && w === 'p' ? nextLevel(G.level) : null; if (nx && !levelOpenD(nx, G.cdiff || 'n')) nx = null;
  $('#btn-next').hidden = !nx; $('#btn-next').textContent = nx && nx.wi !== G.level.wi ? 'MUNDO ' + (nx.wi + 1) : 'SIGUIENTE';
  $('#btn-again').textContent = G.mode === 'quick' ? 'REVANCHA' : 'REPETIR';
  $('#btn-again').className = nx ? 'btn-ghost ol' : 'btn-big ol';
  updateWallets(); show('scr-end');
}
