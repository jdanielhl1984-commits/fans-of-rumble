window.SIM = {
  match(mode, lvl, cd) {
    G.autoplay = true; G.prep = { mode, lvl, cd }; setupMatch(mode, lvl, cd); startMatch(); G.state = 'play';
    const dt = 1 / 15; let n = 0;
    while (G.state === 'play' && n < 30000) { G.t += dt; updateGame(dt); if (n % 30 === 0) { parts.length = 0; nums.length = 0; } n++; }
    const w = G.winner; G.state = 'end'; const R = grantRewards(); G.state = 'title';
    return { w, gold: R.gold, stars: R.stars, t: Math.round(n * dt), pc: S.p.crowns, ec: S.e.crowns };
  },
  frontier() {
    for (const W2 of WORLDS) for (const l of W2.levels) if (starsD(l.id, 'n') <= 0) return levelOpenD(l, 'n') ? l : null;
    return null;
  },
  levelAll() { const ks = [FACTIONS[G.faction].leader].concat(deckOf(G.faction)); let spent = 0, ups = 0;
    for (;;) { const c = ks.filter(k => canLevel(k) && SAVE.gold >= upCost(uSave(k).lvl)).sort((a, b) => upCost(uSave(a).lvl) - upCost(uSave(b).lvl))[0]; if (!c) break; spent += upCost(uSave(c).lvl); levelUp(c); ups++; }
    return { spent, ups, lv: ks.map(k => uSave(k).lvl) }; },
  dayIncome() { const I = idleRates(FACTIONS[G.faction].leader ? G.faction : 'animales'); const g = ECON.mission[0] * DAILY_N + SHOP.gift.gold + ECON_W.gold * WEEKLY_N / 7 + I.gold * 24; SAVE.gold += Math.round(g); return Math.round(g); },
};
SIM.vs = function (f, g, L) {
  setFaction(f); const F = FACTIONS[f]; for (const k of [F.leader].concat(F.units)) { const u = uSave(k); u.lvl = L; }
  G.autoplay = true; G.mode = 'quick'; G.level = null; G.cdiff = 'n'; resetMods();
  G.efac = g; G.elvl = L; G.bossOn = false; G.bossName = ''; G.ebaseName = FACTIONS[g].base || 'BASE';
  G.diffCfg = Object.assign({}, CFG.diff.normal, { aiIncome: 1, think: [0.6, 1.2] }); G.edeck = null; G.classicAI = false; G.eextra = []; G.terrain = null;
  startMatch(); G.state = 'play';
  const dt = 1 / 15; let n = 0;
  while (G.state === 'play' && n < 30000) { G.t += dt; updateGame(dt); if (n % 30 === 0) { parts.length = 0; nums.length = 0; } n++; }
  const w = G.winner; G.state = 'title'; return w;
};
