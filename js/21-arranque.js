// Fans of Rumble · Arranque del juego (va el último)
'use strict';
/* =========================================================
   LOOP
   ========================================================= */
let last = performance.now();
function frame(now) {
  const real = Math.min(0.05, (now - last) / 1000); last = now;
  const steps = G.state === 'play' || G.state === 'ending' ? Math.max(1, Math.round(G.timeScale)) : 1;   // v0.9.11: el x2 solo acelera la partida
  for (let i = 0; i < steps; i++) {
    const dt = real * G.slowmo;
    if (G.state !== 'title') G.t += dt;   // v0.9.9: en los menús el fondo no se mueve
    if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 32);
    if (G.state === 'play' || G.state === 'ending') updateGame(dt);
    if (G.state === 'play') tutBattle(dt);
    updateParts(dt);
    if (G.state === 'ending') { G.endT -= real; if (G.endT <= 0) { G.state = 'end'; G.slowmo = 1; showEnd(); } }
  }
  if (G.state === 'play' || G.state === 'ending' || G.state === 'countdown') hud.update();
  musicUpdate();
  render();
  if (G.state === 'title') idleFrame(real);   // v0.9.14: HORAS EXTRA
  requestAnimationFrame(frame);
}
async function boot() {
  applyLook(); setSoundIcon();
  try { await Promise.race([Promise.all([document.fonts.load('40px "Luckiest Guy"'), document.fonts.load('700 16px "Baloo 2"')]), new Promise(r => setTimeout(r, 1800))]); } catch (e) { /* fonts optional */ }
  buildSprites(); BRIDGE_LAYER = buildBridges(); setFaction(G.faction); updateWallets(); idleTick(); facItemsRetro(); achInit(); achDay(); achSoon(); saveGame(); READY = true;
  requestAnimationFrame(t => { last = t; frame(t); });
  setInterval(tutTick, 250); titlePopups();
  // app instalable: solo en la web del juego (https), no en un archivo ni dentro de otra página
  let top = true; try { top = window.self === window.top; } catch (e) { top = false; }
  if (top && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    const l = document.createElement('link'); l.rel = 'manifest'; l.href = 'manifest.webmanifest'; document.head.appendChild(l);
    try { if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { /* sin modo sin conexión */ }); } catch (e) { /* el navegador no lo permite aquí */ }
  }
}
window.__FOR = { equipAll, facItemsRetro, fitsFac, FAC_ITEM, wearer, chooseFor, openPick, equipFromInv, VIEWX: VIEW, drawEquip, EQ_HAND, EQ_HEAD, bossOf, bossHp, bossOpen, BDIFF, BOSS_HP, BOSS_TIERS, buildBossPrep, grantRewards, deckOf, deckPool, ownsCard, cardPull, cardStars, openDeck, buildDeck, get deckEdit() { return deckEdit; }, cardPool, showCardPulls, isSpell, castSpell, applySpell, spellAim, spellPow, leapPrey, enemyExtras, get spells() { return spells; }, IDLE, idleState, idleTick, idleRates, idlePower, idleCollect, idleSetHero, openIdlePick, idleUI, idleSc, idleFrame, inHealCone, healAim, HEAL_BACK, updateGame, updateUnit, updateStruct, updateProjs, updatePassives, dmgMult, cdMult, ownerOf, ownerName, enemyLabel, losOf, isCorp, CORP, CEO_WI, BOSS_QUOTE, CHAT, CHAT_PH, CHAT_BOSS, CHAT_UNIT, CHAT_VS, CHAT_FAC, QUIPS, QUIPS_FAC, QUIPS_CORRUPT, TRACKS, PROJ, THEMES, AMB_KIND, FAC_COLOR, ICONS, SKINS, ROLES, FUR, NEWS, buildBG, ensureBG, get projs() { return projs; }, bases, towers, expireUnit, bounceShot, effStats, hudMods, hurt, kill, attack, CDIFF, ENEMY_GEAR, starsD, worldOpenD, levelOpenD, mythicWeek, MYTH_DEB, MYTH_BUF, openRoulette, rlSpin, applyItem, legendaryPrize, get campDiff() { return campDiff; }, set campDiff(v) { campDiff = v; }, chatEv, stat, ACHF, ACH_CATS, achProgF, achReady, achScan, achClaim, achInit, achName, achTotals, achDay, buildAchs, get achCat() { return achCat; }, set achCat(v) { achCat = v; }, LOGIN, loginState, openLogin, claimLogin, openNews, titlePopups, tutWant, tutTick, tutStep, tutFinish, curScreen, applySpeed, VERSION, buyStarter, get music() { return M; }, updateWallets, pull, pullCost, showCardTip, hideCardTip, roleOf, fitText, migrateSave, newCopy, addCopy, valsOf, avgQ, tierOf, rollQ, invGet, openInv, buildInv, openItem, massList, scrapValue, snapSpot, wornSet, QTIERS, G, get S() { return S; }, get units() { return units; }, get structs() { return structs; }, get parts() { return parts; }, get revives() { return revives; }, tryPlayerDeploy, playerPlay, spawnUnit, startMatch, setFaction, CFG, SPR, ART, BOX, TYPES, TOPS, drawVector, FACTIONS, get SAVE() { return SAVE; }, set SAVE(v) { SAVE = v; }, saveGame, setupMatch, startGame, openPrep, WORLDS, ECON, ABILITIES, ITEMS, findLevel, levelUp, pull, openCamp, buildColl, goHome, PASS, SHOP, passLevel, addPassXp, buildPass, openShop, buildMissions, makeShareImage, chatSay, missionEvent, get missionTab() { return missionTab; }, set missionTab(v) { missionTab = v; } };
boot();
