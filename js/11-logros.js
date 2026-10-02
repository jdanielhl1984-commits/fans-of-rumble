// Fans of Rumble · Logros, premio diario, novedades, velocidad x2, pack de bienvenida y partida guiada
'use strict';
/* =========================================================
   v0.9.11: logros, premio diario, novedades, velocidad x2, partida guiada e instalar como app
   ========================================================= */
// ---- v0.9.14: más de 1.500 logros en familias por niveles (I, II, III…). Cada nivel es un logro y da gemas una sola vez.
// Entre todos dan unas 25.000 gemas: lo bastante para hacer alguna vez una tirada x50 (modo ballena) sin pagar.
const ACH_CATS = [['all', 'Todos'], ['b', 'Batallas'], ['f', 'Facciones'], ['c', 'Cartas'], ['k', 'Campaña'], ['e', 'Enemigos'], ['g', 'Gashapón'], ['d', 'Constancia'], ['s', 'Secretos']];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const ACHF = [];
// id, categoría, de dónde sale el progreso (una estadística o una función), metas, gemas de cada meta,
// nombre (o uno por nivel), texto de la meta, broma, ids de los logros de la 0.9.13 (para no perder lo cobrado) y pista (logros secretos)
function fam(id, cat, src, goals, gems, name, txt, joke, al, hint) {
  const f = { id, cat, goals, gems, txt, joke, al: al || {}, hint };
  if (typeof src === 'function') f.prog = src; else f.ev = src;
  if (Array.isArray(name)) f.names = name; else f.name = name;
  ACHF.push(f); return f;
}
const veces = (g, uno, varias) => (g === 1 ? uno : varias.replace('{n}', fmt(g)));
const facLvl = f => [FACTIONS[f].leader, ...FACTIONS[f].units].reduce((a, k) => a + uSave(k).lvl, 0);
function gearN(f) { const k = FACTIONS[f].leader, E = SAVE.equip[f] || {}; let n = invGet(SAVE.abEquip[k]) ? 1 : 0; for (const sl in SLOTS) { const it = invGet(E[sl]); if (it && it.k === 'eq') n++; } return n; }
const worldStars = (wi, d) => WORLDS[wi].levels.reduce((a, l) => a + starsD(l.id, d), 0);
const allStars = d => WORLDS.reduce((a, w, wi) => a + worldStars(wi, d), 0);
const ownCount = k => new Set(SAVE.inv.filter(it => it.k === k).map(it => it.id)).size;
// -- Batallas
fam('win', 'b', 'win', [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500], [20, 10, 15, 25, 100, 60, 70, 90, 120, 200],
  ['Primera victoria', 'Cogiendo carrerilla', 'Diez de diez', 'Veterano de la rebelión', 'Pesadilla de Microblizz', 'Cien veces no', 'Imparable', 'Leyenda de la rebelión', 'Mil victorias', 'El terror de los CEO'],
  g => veces(g, 'Gana tu primera partida.', 'Gana {n} partidas.'),
  ['Microblizz ya está nerviosa.', 'Microblizz convoca una reunión de crisis.', 'Microblizz contrata a un consultor.', 'Microblizz culpa a los becarios.', 'El CEO ya no duerme bien.', 'El CEO vende un yate.', 'El CEO vende el otro yate.', 'Microblizz pide un rescate.', 'Microblizz pone tu foto en la entrada.', 'Los CEO de todo el mundo tiemblan.'], { 1: 'win1', 50: 'win50' });
fam('play', 'b', 'play', [1, 10, 25, 50, 100, 250, 500, 1000, 2500], [5, 5, 10, 15, 20, 30, 45, 60, 90], 'Fichando', g => veces(g, 'Juega tu primera partida.', 'Juega {n} partidas.'), 'Aquí sí cuentan tus horas.');
fam('kill', 'b', 'kill', [50, 200, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000], [5, 10, 50, 30, 35, 45, 55, 70, 90, 120], 'Adiós, robots', g => `Derrota a ${fmt(g)} enemigos.`, 'Microblizz tendrá que comprar más.', { 500: 'kill500' });
fam('tower', 'b', 'tower', [5, 30, 100, 250, 500, 1000, 2500], [5, 50, 30, 35, 45, 60, 90], 'Torres fuera', g => `Derriba ${fmt(g)} torres.`, 'Según Microblizz, sobraban.', { 30: 'tower30' });
fam('base', 'b', 'base', [1, 10, 25, 50, 100, 250, 500], [10, 60, 30, 40, 50, 65, 90], 'Juego salvado', g => veces(g, 'Tira una base enemiga.', 'Tira {n} bases enemigas.'), 'Otro juego que no se cierra.', { 10: 'base10' });
fam('flaw', 'b', 'flawless', [1, 10, 25, 50, 100, 250], [10, 60, 35, 45, 60, 90], 'Sin un rasguño', g => veces(g, 'Gana una partida sin perder ninguna torre.', 'Gana {n} partidas sin perder ninguna torre.'), 'Ni una torre para Microblizz.', { 10: 'flaw10' });
fam('card', 'b', 'card', [50, 250, 1000, 2500, 5000, 10000, 25000], [5, 5, 10, 15, 25, 35, 50], 'Mazo caliente', g => `Juega ${fmt(g)} cartas.`, 'Cada carta, un becario menos.');
fam('caos', 'b', 'caos', [100, 500, 2000, 5000, 10000, 25000, 50000, 100000], [5, 5, 10, 15, 20, 30, 40, 60], 'Agente del CAOS', g => `Gasta ${fmt(g)} de CAOS.`, 'El CAOS es gratis. De momento.');
fam('quick', 'b', 'quick', [1, 10, 50, 100, 250, 500], [5, 5, 10, 15, 25, 40], 'Partida rápida', g => veces(g, 'Juega una partida rápida.', 'Juega {n} partidas rápidas.'), 'Rápida como un despido.');
fam('campp', 'b', 'camp', [1, 10, 50, 100, 250, 500], [5, 5, 10, 15, 25, 40], 'Modo historia', g => veces(g, 'Juega una partida de la campaña.', 'Juega {n} partidas de la campaña.'), 'La historia que Microblizz quiere borrar.');
fam('bossp', 'b', 'boss', [1, 5, 10, 25, 50, 100], [5, 5, 10, 15, 25, 40], 'Cita con el CEO', g => veces(g, 'Juega una partida del Modo Jefe.', 'Juega {n} partidas del Modo Jefe.'), 'Siempre tiene un hueco en la agenda para ti.');
fam('boss', 'b', () => SAVE.bestBoss || 0, [1500, 4000, 6000, 8000, 10000, 12000], [15, 60, 40, 50, 60, 80], 'Golpe al bolsillo', g => `Haz ${fmt(g)} de daño en una partida del Modo Jefe.`, 'Le duele más que perder dinero.', { 4000: 'boss4k' });
fam('bkill', 'b', 'bosskill', [1, 5, 10, 25, 50], [15, 20, 25, 40, 60], 'Despido del jefe', g => veces(g, 'Derrota a un jefe en el Modo Jefe.', 'Derrota a {n} jefes en el Modo Jefe.'), 'Recursos Humanos está en shock.');
fam('bkall', 'b', () => WORLDS.filter((w, i) => ['n', 'h', 'm'].some(d => (SAVE.bossPay[i + d] || 0) & 8)).length, [3, 6, 9, 12], [20, 30, 40, 80], 'Cazajefes', g => g === 12 ? 'Derrota a los 12 jefes en el Modo Jefe.' : `Derrota a ${g} jefes distintos en el Modo Jefe.`, 'Los colecciona como cromos.');
fam('bkmyth', 'b', () => WORLDS.filter((w, i) => (SAVE.bossPay[i + 'm'] || 0) & 8).length, [1, 3, 6, 12], [30, 50, 80, 150], 'Jefe de jefes', g => veces(g, 'Derrota a un jefe en Mítica (Modo Jefe).', 'Derrota a {n} jefes distintos en Mítica (Modo Jefe).'), 'Ni el consejo de administración se lo cree.');
fam('lead', 'b', 'leader', [10, 50, 100, 250, 500, 1000], [5, 5, 10, 15, 25, 40], 'Líder de verdad', g => `Saca a tu líder ${fmt(g)} veces.`, 'Un jefe que sí baja al campo.');
fam('wstreak', 'b', () => SAVE.stats.bestStreak || 0, [3, 5, 10, 15, 25], [10, 15, 30, 45, 80], 'En racha', g => `Gana ${g} partidas seguidas.`, 'Microblizz pide revisar la jugada.');
// -- Facciones
const FAC_ACH = { animales: ['Manada salvaje', 'La rabia también es una pasiva.'], nomuertos: ['Ejército eterno', 'Ni muertos trabajan ya para Microblizz.'], streamers: ['En directo', '¡Dale a la campanita!'], heroes: ['Leyenda viva', 'Los dioses vuelven a estar de buen humor.'], ciber: ['Alto voltaje', 'Firmware libre, por fin.'], memes: ['Viral', 'Este logro ya es un meme.'], gamer: ['GG', 'GG, Phony. GG.'], olvidados: ['Recordados', 'Por fin alguien se acuerda de ellos.'], pop: ['Taquillazo', 'Y sin remake.'] };
for (const f of FACTION_ORDER) {
  const F = FACTIONS[f], L = CFG.cards[F.leader].name, [nm, jk] = FAC_ACH[f], n0 = ACHF.length;
  fam('fw_' + f, 'f', 'fwin_' + f, [1, 10, 25, 50, 100, 250, 500], [5, 10, 15, 20, 25, 35, 50], nm, g => veces(g, `Gana una partida con ${F.name}.`, `Gana {n} partidas con ${F.name}.`), jk);
  fam('fl_' + f, 'f', () => facLvl(f), [14, 28, 42, 56, 70], [5, 10, 15, 20, 30], `Plantilla de ${F.name}`, g => g >= 70 ? `Sube las 7 cartas de ${F.name} a nivel 10.` : `Suma ${g} niveles entre las 7 cartas de ${F.name}.`, 'Aquí se asciende por méritos.');
  fam('fp_' + f, 'f', () => Math.round(idlePower(f) * 100), [120, 150, 200, 250, 300], [5, 10, 15, 20, 35], `Poder de ${L}`, g => `Sube el poder de ${L} a ${g} (nivel, habilidad y equipo).`, 'Se nota en las horas extra.');
  fam('fg_' + f, 'f', () => gearN(f), [1, 2, 3, 4], [5, 5, 5, 10], `${L} bien equipado`, g => g === 4 ? `Pon a ${L} una habilidad y sus 3 objetos.` : g === 1 ? `Equipa a ${L} con una habilidad o un objeto.` : `Equipa a ${L} con ${g} cosas (habilidad u objetos).`, 'Bien vestido para la reunión.');
  for (let i = n0; i < ACHF.length; i++) ACHF[i].fac = f;
}
fam('unlock', 'f', () => Math.max(SAVE.stats.unlock || 0, SAVE.unlocked.length - 1), [1, 2, 3, 4, 5, 6, 7, 8], [50, 20, 20, 20, 25, 25, 30, 50], 'La rebelión crece', g => g === 1 ? 'Libera una facción en la campaña.' : g === 8 ? 'Libera todas las facciones.' : `Libera ${g} facciones en la campaña.`, 'Se van de Microblizz sin avisar.', { 1: 'unlock1' });
// -- Cartas: cada una tiene sus logros de jugarla y de subirla de nivel
for (const f of FACTION_ORDER) for (const k of [FACTIONS[f].leader, ...FACTIONS[f].units]) {
  const nm = CFG.cards[k].name, jk = `Carta de ${FACTIONS[f].name}.`;
  fam('cp_' + k, 'c', 'play_' + k, [1, 10, 50, 100, 250, 500, 1000], [5, 5, 5, 5, 5, 10, 15], `Fan de ${nm}`, g => veces(g, `Juega a ${nm} por primera vez.`, `Juega a ${nm} {n} veces.`), jk);
  fam('cl_' + k, 'c', () => uSave(k).lvl, [2, 3, 5, 7, 10], [5, 5, 5, 5, 10], `Ascenso de ${nm}`, g => `Sube a ${nm} a nivel ${g}.`, g => (g === 10 ? 'Nivel máximo. Ni el CEO llega tan alto.' : jk));
  ACHF[ACHF.length - 1].fac = ACHF[ACHF.length - 2].fac = f;
}
for (const f of FACTION_ORDER) for (const k of FACTIONS[f].gacha || []) {   // v0.9.15: cartas del gashapón
  const nm = CFG.cards[k].name, jk = CFG.cards[k].spell ? 'Hechizo del gashapón de cartas.' : 'Mata-sanadores del gashapón de cartas.';
  fam('cp_' + k, 'c', 'play_' + k, [1, 10, 50, 100], [5, 5, 5, 10], `Fan de ${nm}`, g => veces(g, `Juega ${CFG.cards[k].spell ? 'el hechizo ' : 'a '}${nm} por primera vez.`, `Juega ${CFG.cards[k].spell ? 'el hechizo ' : 'a '}${nm} {n} veces.`), jk);
  fam('cl_' + k, 'c', () => uSave(k).lvl, [3, 6, 10], [5, 5, 10], `Ascenso de ${nm}`, g => `Sube ${CFG.cards[k].spell ? 'el hechizo ' : 'a '}${nm} a nivel ${g}.`, jk);
  ACHF[ACHF.length - 1].fac = ACHF[ACHF.length - 2].fac = f;
}
fam('lvl', 'c', 'lvlup', [1, 10, 25, 50, 100, 250, 500], [5, 10, 50, 50, 50, 65, 90], 'Subida de sueldo', g => veces(g, 'Sube de nivel una carta.', 'Sube {n} niveles a tus cartas.'), 'A ti sí te suben el sueldo.', { 25: 'lvl25' });
// -- Campaña: estrellas de cada mundo en cada dificultad, estrellas totales y jefes
const DIF_ACH = { n: ['', '', [5, 5, 10, 15], [10, 20, 40, 60, 100], 'Cada estrella, un juego salvado.'], h: [' (Difícil)', ' en Difícil', [5, 10, 15, 20], [15, 30, 50, 80, 150], 'Microblizz pide refuerzos.'], m: [' (Mítica)', ' en Mítica', [10, 15, 20, 30], [20, 40, 70, 110, 200], 'Ni la ruleta de la semana pudo contigo.'] };
for (const d of ['n', 'h', 'm']) {
  const [tag, en, gw, gs, jk] = DIF_ACH[d];
  WORLDS.forEach((Wd, wi) => fam(`w${wi + 1}${d}`, 'k', () => worldStars(wi, d), [3, 6, 9, 12], gw, `${Wd.name}${tag}`, g => g === 12 ? `Consigue las 12 estrellas del mundo ${wi + 1}${en}.` : `Consigue ${g} estrellas en el mundo ${wi + 1}${en}.`, jk));
  const tot = WORLDS.length * 12;
  fam('st_' + d, 'k', () => allStars(d), [10, 25, 50, 100, tot], gs, `Coleccionista de estrellas${tag}`, g => g === tot ? `Consigue todas las estrellas de la campaña${en}.` : `Consigue ${g} estrellas en la campaña${en}.`, jk);
}
fam('ceo', 'k', 'ceo', [1], [150], 'Compra cancelada', () => 'Gana al CEO de Microblizz.', 'El CEO tendrá que vender su yate.', { 1: 'ceo' });
fam('olvido', 'k', 'olvido', [1], [80], 'Recuerdos recuperados', () => 'Libera a los Olvidados del sótano de Microblizz.', 'Por fin alguien se acuerda de ellos.', { 1: 'olvido' });
fam('phony', 'k', 'phonyboss', [1], [150], 'Devolvednos los discos', () => 'Gana al Presidente de Phony.', 'Tu colección de discos está a salvo.', { 1: 'phony' });
fam('hard', 'k', 'hardboss', [1, 5, 12, 25, 50], [80, 50, 70, 90, 130], 'Esto ya es otra cosa', g => veces(g, 'Gana a un jefe en Difícil.', 'Gana a {n} jefes en Difícil.'), 'Microblizz pide refuerzos.', { 1: 'hard1' });
fam('myth', 'k', 'mythboss', [1, 5, 12, 25, 50], [150, 80, 100, 130, 200], 'Leyenda mítica', g => veces(g, 'Gana a un jefe en Mítica.', 'Gana a {n} jefes en Mítica.'), 'Ni la ruleta de Microblizz ha podido contigo.', { 1: 'myth1' });
fam('rl', 'k', 'rlspin', [1, 5, 10, 25], [5, 10, 15, 25], 'La ruleta de la semana', g => veces(g, 'Gira la ruleta de la Mítica.', 'Gira {n} veces la ruleta de la Mítica.'), 'La casa siempre gana. O casi.');
// -- Enemigos: cada bot de las empresas, cada facción corrompida y los líderes rivales
const ENEMY_ACH = { becario: ['Sin becarios', 'Becarios', 'Trabajan gratis… y se nota.'], starbot: ['Estrellas fugaces', 'StarBots', 'Su valoración media: una estrella.'], fallen: ['Héroes caídos', 'FallenHeroes', 'Antes era tu héroe favorito.'], cajabotin: ['Cajas abiertas', 'CajaBotines', 'Dentro solo había otra caja.'], soportebot: ['Incidencia cerrada', 'SoporteBots', 'Su respuesta: «reinicia el juego».'], parchebot: ['Parcheado', 'Parches Día 1', 'Pesa 80 GB y no arregla nada.'],
  descargabot: ['Descarga cancelada', 'Descarga99', 'Se quedó en el 99 %.'], licenciabot: ['Licencia revocada', 'LicenciaBots', 'Ahora el juego es tuyo. De verdad.'], plusbot: ['Suscripción cancelada', 'PayPlus', 'Sin permanencia.'], cobradlc: ['DLC gratis', 'CobraDLC', 'El final del juego ya no se vende aparte.'], servidorbot: ['Servidor reiniciado', 'Servidores Caídos', 'Ha vuelto a caer. Por tu culpa.'], remasterbot: ['Mejor el original', 'Remasters 70 €', 'El de 2005 se veía mejor.'] };
for (const k in ENEMY_ACH) { const [nm, pl, jk] = ENEMY_ACH[k]; fam('ek_' + k, 'e', 'ek_' + k, [10, 50, 100, 250, 500, 1000, 2500], [5, 5, 10, 10, 15, 25, 35], nm, g => `Derrota a ${fmt(g)} ${pl}.`, jk); }
const CORR_ACH = { gamer: 'Gamers corrompidos', pop: 'personajes de Cultura Pop corrompidos' };
for (const f of FACTION_ORDER) if (WORLDS.some(w => w.efac === f)) fam('ef_' + f, 'e', 'ekf_' + f, [25, 100, 250, 500, 1000], [5, 10, 15, 20, 30], `Rescate: ${FACTIONS[f].name}`, g => `Derrota a ${fmt(g)} ${CORR_ACH[f] || FACTIONS[f].name + ' corrompidos'}.`, 'No es nada personal: es para liberarlos.');
fam('ef_microblizz', 'e', 'ekf_microblizz', [100, 500, 1000, 2500, 5000, 10000], [5, 10, 15, 25, 35, 50], 'Contra Microblizz', g => `Derrota a ${fmt(g)} enemigos de Microblizz.`, 'Despidos, pero al revés.');
fam('ef_phony', 'e', 'ekf_phony', [100, 500, 1000, 2500, 5000, 10000], [5, 10, 15, 25, 35, 50], 'Contra Phony', g => `Derrota a ${fmt(g)} enemigos de Phony.`, 'Suscripción cancelada.');
fam('elead', 'e', 'eleader', [1, 10, 25, 50, 100, 250], [5, 10, 15, 25, 40, 60], 'Cazalíderes', g => veces(g, 'Derrota a un líder enemigo.', 'Derrota a {n} líderes enemigos.'), 'Sin jefe, el equipo se toma el día libre.');
// -- Gashapón y tesoro
fam('pull', 'g', 'pull', [1, 10, 50, 100, 250, 500, 1000, 2500, 5000], [5, 5, 10, 50, 30, 35, 50, 70, 100], 'Adicto a las cápsulas', g => veces(g, 'Gira el gashapón por primera vez.', 'Gira {n} veces el gashapón.'), 'Microblizz te manda una postal.', { 100: 'pull100' });
fam('x10', 'g', 'x10', [1, 10, 25, 50, 100], [10, 15, 25, 40, 60], 'De diez en diez', g => veces(g, 'Haz una tirada x10.', 'Haz {n} tiradas x10.'), 'Diez veces más ilusión.');
fam('x50', 'g', 'x50', [1, 5, 10, 25, 50], [30, 40, 50, 70, 100], 'Modo ballena', g => veces(g, 'Haz una tirada x50.', 'Haz {n} tiradas x50.'), 'El CEO le ha puesto tu nombre a su yate.', { 1: 'x50' });
fam('leg', 'g', 'leg', [1, 5, 10, 25, 50, 100], [10, 15, 25, 40, 60, 90], 'Suerte legendaria', g => veces(g, 'Consigue una legendaria en el gashapón.', 'Consigue {n} legendarias en el gashapón.'), 'Salen 3 de cada 100. Dicen.');
fam('epic', 'g', 'epic', [1, 10, 25, 50, 100, 250], [5, 10, 15, 25, 35, 55], 'Épico', g => veces(g, 'Consigue una épica en el gashapón.', 'Consigue {n} épicas en el gashapón.'), 'Épico de verdad, no como el último parche.');
fam('perfect', 'g', 'perfect', [1, 3, 5, 10, 25], [100, 40, 50, 70, 100], 'Perfeccionista', g => veces(g, 'Consigue una copia de calidad CEO (perfecta).', 'Consigue {n} copias de calidad CEO (perfecta).'), 'Sale una vez de cada cien.', { 1: 'perfect' });
fam('scrap', 'g', 'scrap', [10, 50, 100, 250, 500, 1000, 2500], [5, 40, 25, 35, 45, 60, 90], 'Despido masivo', g => `Despide ${fmt(g)} copias en el inventario.`, 'Como Microblizz, pero con cosas.', { 50: 'scrap50' });
fam('reroll', 'g', 'reroll', [1, 5, 25, 50, 100, 250], [5, 30, 25, 35, 50, 70], 'Segunda oportunidad', g => veces(g, 'Vuelve a tirar los números de una copia.', 'Vuelve a tirar los números de una copia {n} veces.'), 'Más oportunidades de las que da Microblizz.', { 5: 'reroll5' });
const N_AB = Object.keys(ABILITIES).length, N_EQ = Object.keys(ITEMS).length;
fam('ownab', 'g', () => ownCount('ab'), [5, 10, 15, 20, N_AB], [10, 20, 30, 45, 80], 'Coleccionista de habilidades', g => g === N_AB ? 'Consigue todas las habilidades.' : `Consigue ${g} habilidades distintas.`, 'Hazte con todas. Sin gastar. Bueno, casi.');
fam('owneq', 'g', () => ownCount('eq'), [5, 10, 15, 20, N_EQ], [10, 20, 30, 45, 80], 'Coleccionista de objetos', g => g === N_EQ ? 'Consigue todos los objetos.' : `Consigue ${g} objetos distintos.`, 'Tu armario es más grande que la sede de Microblizz.');
fam('owncd', 'g', () => Object.keys(SAVE.cards || {}).length, [1, 5, 10, 20, 36], [10, 15, 25, 40, 70], 'Coleccionista de cartas', g => g === 36 ? 'Consigue las 36 cartas del gashapón de cartas.' : veces(g, 'Consigue una carta del gashapón de cartas.', 'Consigue {n} cartas del gashapón de cartas.'), 'Hechizos, mata-sanadores y cero remordimientos.');
fam('stars', 'g', () => Object.values(SAVE.cards || {}).reduce((a, c) => a + (c.st || 0), 0), [5, 25, 50, 100, 180], [10, 15, 25, 40, 70], 'Lluvia de estrellas', g => `Suma ${g} estrellas en tus cartas del gashapón.`, 'Cinco estrellas, como las reseñas compradas.');
fam('goldb', 'g', () => SAVE.gold, [1000, 5000, 10000, 25000, 50000, 100000, 250000], [5, 10, 15, 20, 30, 45, 70], 'Hucha de oro', g => `Ten ${fmt(g)} de oro a la vez.`, 'El CEO quiere saber tu secreto.');
fam('gemb', 'g', () => SAVE.gems, [500, 1000, 2500, 5000], [10, 15, 30, 50], 'Hucha de ballena', g => `Ten ${fmt(g)} gemas a la vez.`, g => (g === 2500 ? 'Justo lo que cuesta una tirada x50.' : 'Ahorrar también es un arte.'));
// -- Constancia
fam('days', 'd', 'days', [1, 3, 7, 14, 30, 60, 100, 150, 200, 365], [5, 10, 15, 20, 30, 40, 50, 60, 70, 100], 'Fichaje diario', g => veces(g, 'Juega un día.', 'Juega {n} días distintos.'), 'Más constante que los servidores de Phony.');
fam('lstreak', 'd', () => (SAVE.login && SAVE.login.best) || 0, [3, 7], [15, 50], 'Fan de verdad', g => `Entra ${g} días seguidos.`, 'Microblizz no consigue echarte.', { 7: 'streak7' });
fam('daily', 'd', 'dailydone', [1, 10, 25, 50, 100, 250, 500, 1000], [5, 10, 15, 20, 30, 40, 60, 80], 'Misión cumplida', g => veces(g, 'Completa una misión diaria.', 'Completa {n} misiones diarias.'), 'Más productivo que un consejo de dirección.');
fam('weekly', 'd', 'weekdone', [1, 5, 10, 25, 50, 100], [10, 15, 25, 40, 60, 100], 'Semana completa', g => veces(g, 'Completa una misión semanal.', 'Completa {n} misiones semanales.'), 'Te has ganado el fin de semana.');
fam('passl', 'd', () => passLevel(), [1, 5, 10, 15, 20, 25, 30], [5, 10, 15, 20, 25, 30, 50], 'Pase de batalla', g => `Llega al nivel ${g} del pase de batalla.`, 'Dura hasta que Microblizz lo cierre.');
fam('gift', 'd', 'gift', [1, 7, 30, 100, 365], [5, 10, 20, 40, 80], 'Regalo de la casa', g => veces(g, 'Recoge el regalo diario de la tienda.', 'Recoge {n} veces el regalo diario de la tienda.'), 'Lo único gratis de la tienda.');
fam('login', 'd', 'login', [1, 7, 30, 100, 365], [5, 10, 20, 40, 80], 'Premio diario', g => veces(g, 'Cobra el premio diario.', 'Cobra {n} premios diarios.'), 'Microblizz te premia para que no te vayas.');
fam('idle', 'd', 'idle', [1, 10, 50, 100, 250, 500], [10, 15, 25, 40, 60, 90], 'Horas extra', g => veces(g, 'Recoge lo que gana tu líder en HORAS EXTRA.', 'Recoge {n} veces las HORAS EXTRA.'), 'Aquí las horas extra sí se pagan.');
fam('idleh', 'd', 'idleh', [12, 50, 100, 250, 500, 1000, 2500], [10, 15, 20, 30, 40, 60, 100], 'Jornada interminable', g => `Cobra ${fmt(g)} horas en las HORAS EXTRA.`, 'Tu líder pide vacaciones.');
fam('idleg', 'd', 'idleg', [1000, 10000, 50000, 100000, 500000], [10, 20, 35, 55, 100], 'Sueldo extra', g => `Gana ${fmt(g)} de oro en las HORAS EXTRA.`, 'Mejor pagado que en Microblizz.');
fam('idlei', 'd', 'idlei', [1, 5, 10, 25, 50], [10, 20, 30, 50, 80], 'Objetos perdidos', g => veces(g, 'Tu líder encuentra un objeto en las HORAS EXTRA.', 'Tu líder encuentra {n} objetos en las HORAS EXTRA.'), 'Nadie sabe de dónde los saca.');
// -- Secretos: no se sabe qué piden hasta que se consiguen (solo hay una pista)
const SECRETS = [
  ['night', 'night', 1, 40, 'Turno de noche', 'Juega una partida entre las 0:00 y las 5:00.', 'Microblizz también te vigila de noche.', 'Pista: hay horas en las que hasta Microblizz duerme.'],
  ['comeback', 'comeback', 1, 50, 'Remontada épica', 'Gana una partida después de perder dos torres.', 'El CEO ya había abierto el champán.', 'Pista: nunca te rindas, aunque vayas perdiendo.'],
  ['onlylead', 'onlylead', 1, 40, 'Hombre orquesta', 'Gana una partida jugando solo a tu líder.', 'El resto del equipo estaba de vacaciones.', 'Pista: ¿quién necesita equipo?'],
  ['strike', 'strike', 1, 20, 'Huelga general', 'Termina una partida sin jugar ninguna carta.', 'Ni un becario trabajaría tan poco.', 'Pista: a veces lo mejor es no hacer nada.'],
  ['cheap', 'cheapwin', 1, 50, 'Bajo coste', 'Gana una partida gastando 30 de CAOS o menos.', 'Más rentable que Microblizz.', 'Pista: ganar sin gastar.'],
  ['spend', 'bigspend', 1, 30, 'Derroche', 'Gasta 100 de CAOS en una sola partida.', 'Microblizz quiere ficharte para finanzas.', 'Pista: el CAOS está para gastarlo.'],
  ['massacre', 'massacre', 1, 40, 'Despidos al revés', 'Derrota a 60 enemigos en una sola partida.', 'Recursos humanos no da abasto.', 'Pista: muchísimos enemigos en una sola partida.'],
  ['close', 'closecall', 1, 40, 'Por los pelos', 'Gana con tu base por debajo del 15 % de vida.', 'Ni el VAR lo tenía claro.', 'Pista: ganar cuando todo parecía perdido.'],
  ['fast', 'fastwin', 1, 50, 'Speedrun', 'Tira la base enemiga en menos de 100 segundos.', 'Más rápido que un despido.', 'Pista: el reloj es tu enemigo.'],
  ['time', 'hpwin', 1, 30, 'Hasta el último segundo', 'Gana por vida cuando se acaba el tiempo.', 'Se decidió en la foto finish.', 'Pista: se acaba el tiempo y vais empatados.'],
  ['tut', () => (SAVE.tut && SAVE.tut.done ? 1 : 0), 1, 20, 'Ya me lo sé', 'Termina la partida guiada.', 'Bienvenido a la rebelión.', 'Pista: lo primero es lo primero.'],
  ['howto', 'howto', 1, 20, 'Leer las instrucciones', 'Abre «Cómo se juega».', 'Nadie lo hace. Tú sí.', 'Pista: está en el menú principal.'],
  ['speed', 'speed2', 1, 20, 'Con prisa', 'Pon la partida a velocidad x2.', 'El tiempo es oro. Y el oro, de Microblizz.', 'Pista: hay un botón para ir más rápido.'],
  ['share', 'share', 1, 30, 'Fama mundial', 'Comparte el resultado de una partida.', 'Microblizz ha visto tu publicación.', 'Pista: presume de tus victorias.'],
  ['export', 'export', 1, 20, 'Copia de seguridad', 'Exporta tu progreso en Opciones.', 'Que no te lo cierren.', 'Pista: mira en Opciones.'],
  ['scrapp', 'scrapperf', 1, 60, 'Esto no se tira', 'Despide una copia de calidad CEO (perfecta).', '¿Seguro que no la querías?', 'Pista: despedir algo que no deberías.'],
  ['broke', 'broke', 1, 30, 'Sin blanca', 'Quédate con 0 gemas después de girar el gashapón.', 'Microblizz te quiere mucho.', 'Pista: gástalo todo.'],
  ['starter', () => (SAVE.starter ? 1 : 0), 1, 20, 'Cliente fiel', 'Consigue el pack de bienvenida de la tienda.', 'Gratis en esta versión. Shh.', 'Pista: algo de la tienda.'],
  ['prem', () => (SAVE.pass && SAVE.pass.prem ? 1 : 0), 1, 30, 'VIP', 'Activa el pase premium.', 'Gratis en esta versión. Que no se entere el CEO.', 'Pista: el pase tiene dos caminos.'],
  ['full', 'idlefull', 1, 30, 'Almacén lleno', 'Recoge las HORAS EXTRA con el almacén lleno (12 h).', 'Tu líder ya estaba durmiendo.', 'Pista: deja trabajar a tu líder mucho, mucho tiempo.'],
  ['swap', 'idleswap', 1, 20, 'Cambio de turno', 'Cambia de líder en las HORAS EXTRA.', 'Turno de día, turno de noche.', 'Pista: cualquiera puede hacer horas extra.'],
  ['mute', 'mute', 1, 20, 'Silencio, se juega', 'Quita el sonido.', 'Así no oyes al CEO.', 'Pista: ssshhh.'],
  ['lose', 'lose', 10, 30, 'Aprender a perder', 'Pierde 10 partidas.', 'Microblizz lo celebra con otro yate.', 'Pista: de los errores se aprende.'],
  ['easy', 'easywin', 10, 20, 'Becario eterno', 'Gana 10 partidas rápidas contra el Becario.', 'Por algo se empieza.', 'Pista: el rival más fácil.'],
  ['pause', 'pause', 10, 20, 'Pausa para el café', 'Pausa la partida 10 veces.', 'Un derecho básico. Menos en Microblizz.', 'Pista: tómate un respiro.'],
  ['news', 'news', 1, 20, 'Al día', 'Lee las novedades del juego.', 'Las notas de Microblizz son de broma. ¿O no?', 'Pista: el juego cambia; entérate.'],
];
for (const [id, src, goal, gm, nm, txt, jk, hint] of SECRETS) fam('s_' + id, 's', src, [goal], [gm], nm, () => txt, jk, null, hint);
// ---- estado: por familia, qué niveles se han conseguido (para siempre) y cuáles se han cobrado (bits)
const ACH_OLD = {};   // ids de la 0.9.13 → [familia, nivel]
for (const f of ACHF) for (const g in f.al) ACH_OLD[f.al[g]] = [f, f.goals.indexOf(+g)];
const achName = (f, i) => (f.names ? f.names[i] : f.goals.length > 1 ? `${f.name} ${ROMAN[i]}` : f.name);
const achJoke = (f, i) => (typeof f.joke === 'function' ? f.joke(f.goals[i]) : Array.isArray(f.joke) ? f.joke[i] : f.joke || '');
const achProgF = f => (f.prog ? f.prog() : SAVE.stats[f.ev] || 0);
const popc = b => { let n = 0; while (b) { n += b & 1; b >>>= 1; } return n; };
function achInit() {   // los logros de la 0.9.13 (una lista de ids) pasan al formato nuevo sin perder lo cobrado
  SAVE.achC = SAVE.achC || {}; SAVE.achR = SAVE.achR || {}; if (SAVE.achV === 2) return;
  for (const id of SAVE.achDone || []) { const r = ACH_OLD[id]; if (r && r[1] >= 0) { SAVE.achC[r[0].id] = (SAVE.achC[r[0].id] || 0) | (1 << r[1]); SAVE.achR[r[0].id] = (SAVE.achR[r[0].id] || 0) | (1 << r[1]); } }
  for (const id of SAVE.achSeen || []) { const r = ACH_OLD[id]; if (r && r[1] >= 0) SAVE.achR[r[0].id] = (SAVE.achR[r[0].id] || 0) | (1 << r[1]); }
  SAVE.achV = 2;
}
let achNew = 0, achNewName = '', achT = 0, achScanT = 0;
function stat(ev, n) { if (!n || (G.mode === 'sandbox' && G.state !== 'title')) return;   // v0.9.20: la sala de pruebas no cuenta para logros ni misiones
  SAVE.stats[ev] = (SAVE.stats[ev] || 0) + n; achSoon(); }
function achSoon() { if (!achScanT) achScanT = setTimeout(() => { achScanT = 0; achScan(); }, 0); }
function achScan() {   // marca los niveles conseguidos (se quedan aunque luego bajes) y avisa con un solo mensaje
  if (SAVE.achV !== 2) achInit();
  for (const f of ACHF) {
    const p = achProgF(f), R0 = SAVE.achR[f.id] || 0; let R = R0;
    for (let i = 0; i < f.goals.length; i++) if (p >= f.goals[i]) R |= 1 << i;
    if (R === R0) continue;
    SAVE.achR[f.id] = R; const nw = R & ~R0 & ~(SAVE.achC[f.id] || 0);
    for (let i = 0; i < f.goals.length; i++) if (nw & (1 << i)) { achNew++; achNewName = achName(f, i); }
  }
  if (achNew && !achT) achT = setTimeout(achToast, 700);
}
function achToast() {
  achT = 0; if (!achNew) return;
  const n = achNew; achNew = 0;
  if (!$('#scr-missions').hidden && missionTab === 'a') { buildMissions(); return; }   // ya los estás viendo
  toast(n > 1 ? `¡${fmt(n)} logros nuevos! Cóbralos en Misiones` : `¡Logro: ${achNewName}! Cóbralo en Misiones`, true); play('crown');
  if (G.state === 'title') updateBadges();
}
const achReady = () => { let r = 0; if (!SAVE.achR) return 0; for (const f of ACHF) r += popc((SAVE.achR[f.id] || 0) & ~(SAVE.achC[f.id] || 0)); return r; };
function achTotals() {
  const T = { n: 0, g: 0, N: 0, Gt: 0, ready: 0, rg: 0 };
  for (const f of ACHF) { const C = SAVE.achC[f.id] || 0, R = SAVE.achR[f.id] || 0; f.goals.forEach((x, i) => { T.N++; T.Gt += f.gems[i]; if (C & (1 << i)) { T.n++; T.g += f.gems[i]; } else if (R & (1 << i)) { T.ready++; T.rg += f.gems[i]; } }); }
  return T;
}
function achClaim(list) {   // cobra todos los niveles conseguidos de estas familias
  let n = 0, g = 0, last = '';
  for (const f of list) {
    const C = SAVE.achC[f.id] || 0, R = SAVE.achR[f.id] || 0, nw = R & ~C; if (!nw) continue;
    f.goals.forEach((x, i) => { if (nw & (1 << i)) { n++; g += f.gems[i]; last = achName(f, i); } }); SAVE.achC[f.id] = C | R;
  }
  if (!n) return 0;
  SAVE.gems += g; saveGame(); play('crown'); updateWallets(); updateBadges(); buildMissions();
  toast(n > 1 ? `+${fmt(g)} gemas por ${fmt(n)} logros` : `+${fmt(g)} gemas por «${last}»`, true);
  return g;
}
let achCat = 'all';
function achRowData(f) {
  const C = SAVE.achC[f.id] || 0, R = SAVE.achR[f.id] || 0, n = f.goals.length;
  let ready = 0, gems = 0, cur = -1, nc = 0;
  for (let i = 0; i < n; i++) { if (C & (1 << i)) nc++; else { if (cur < 0) cur = i; if (R & (1 << i)) { ready++; gems += f.gems[i]; } } }
  const i = cur < 0 ? n - 1 : cur, p = achProgF(f);
  return { f, p, i, ready, gems, nc, n, done: cur < 0, hidden: !!f.hint && !R, lk: !!f.fac && !isUnlocked(f.fac), fr: cur < 0 ? 2 : Math.min(1, p / f.goals[i]) };
}
function buildAchs() {
  achScan();
  const T = achTotals(), inCat = f => achCat === 'all' || f.cat === achCat;
  $('#mission-sub').textContent = `Retos para siempre: cada logro da gemas una sola vez. Llevas ${fmt(T.n)} de ${fmt(T.N)} logros y ${fmt(T.g)} de ${fmt(T.Gt)} gemas.`;
  $('#ach-cats').innerHTML = ACH_CATS.map(([c, nm]) => { const r = ACHF.filter(f => c === 'all' || f.cat === c).reduce((a, f) => a + popc((SAVE.achR[f.id] || 0) & ~(SAVE.achC[f.id] || 0)), 0); return `<button class="ach-cat" data-ac="${c}" aria-pressed="${c === achCat}">${nm}${r ? `<i>${r > 99 ? '99+' : r}</i>` : ''}</button>`; }).join('');
  for (const b of $('#ach-cats').querySelectorAll('[data-ac]')) b.onclick = () => { achCat = b.dataset.ac; play('select'); buildAchs(); $('#mission-list').scrollTop = 0; };
  const all = $('#btn-ach-all'); all.disabled = !T.ready;
  all.innerHTML = T.ready ? `COBRAR TODO<small>${fmt(T.ready)} ${T.ready > 1 ? 'logros' : 'logro'} · ${GEM_SVG}${fmt(T.rg)}</small>` : 'NADA QUE COBRAR (DE MOMENTO)';
  const L = ACHF.filter(inCat).map(achRowData).sort((x, y) => (y.ready > 0) - (x.ready > 0) || (x.done - y.done) || (x.lk - y.lk) || y.fr - x.fr);
  $('#mission-list').innerHTML = L.map(d => {
    const f = d.f, goal = f.goals[d.i], name = d.hidden ? '???' : achName(f, d.i), txt = d.hidden ? f.hint : f.txt(goal), jk = d.hidden ? '' : achJoke(f, d.i);
    const pr = d.done ? 1 : Math.min(1, d.p / goal), gm = d.ready ? d.gems : f.gems[d.i], lkTxt = d.lk && !d.ready ? ' <i>Primero libera a esta facción en la campaña.</i>' : '';
    return `<div class="mission ach${d.done ? ' done' : ''}${d.ready ? ' ready' : ''}"><div><b>${name}</b>${d.n > 1 ? `<span class="ach-lv">${d.nc}/${d.n}</span>` : ''}<span class="ach-txt">${txt}${lkTxt || (jk ? ` <i>${jk}</i>` : '')}</span><div class="xpbar"><i style="width:${pr * 100}%"></i><span>${d.done ? '¡COMPLETO!' : `${fmt(Math.min(d.p, goal))} / ${fmt(goal)}`}</span></div></div><button class="btn-up" data-af="${f.id}" ${d.ready ? '' : 'disabled'}>${d.done ? 'HECHO' : d.ready > 1 ? `COBRAR x${d.ready}` : 'COBRAR'}<small>${GEM_SVG}${fmt(gm)}</small></button></div>`;
  }).join('');
  for (const b of document.querySelectorAll('[data-af]')) b.onclick = () => { const f = ACHF.find(x => x.id === b.dataset.af); if (f) achClaim([f]); };
}
$('#btn-ach-all').addEventListener('click', () => achClaim(ACHF));
function achDay() { const td = todayStr(); if (SAVE.dayMark !== td) { SAVE.dayMark = td; stat('days', 1); } }   // días distintos que juegas
// ---- premio por entrar días seguidos (si fallas un día, vuelves al día 1)
const LOGIN = [{ gold: 150 }, { gems: 20 }, { gold: 300 }, { tickets: 1 }, { gold: 500 }, { gems: 40 }, { tickets: 10 }];
function dayDiff(a, b) { const d = t => { const [y, m, dd] = t.split('-').map(Number); return new Date(y, m - 1, dd); }; return Math.round((d(b) - d(a)) / 86400000); }
function loginState() {
  const L = SAVE.login, today = todayStr();
  if (L.last === today) return { ready: false, day: L.day, lost: false };
  const gap = L.last ? dayDiff(L.last, today) : 0, cont = gap === 1 && L.day < 7;
  return { ready: true, day: cont ? L.day + 1 : 1, lost: !!L.last && gap > 1 && L.day > 0 && L.day < 7 };
}
const loginRw = (r, big) => (r.gold ? `${COIN_SVG}${fmt(r.gold)}` : r.gems ? `${GEM_SVG}${r.gems}` : `${TICKET_SVG}${big ? '¡x10 GRATIS!' : r.tickets + (r.tickets > 1 ? ' tiradas' : ' tirada')}`);
function openLogin() {
  const st = loginState(); if (!st.ready) return;
  $('#login-sub').innerHTML = (st.lost ? '<b>Un día sin entrar y vuelves al día 1.</b> Microblizz no perdona. ' : '') + 'Microblizz te premia por entrar cada día (así no te vas a otro juego). Si un día no entras, vuelves a empezar. El día 7: ¡10 tiradas gratis!';
  $('#login-grid').innerHTML = LOGIN.map((r, i) => `<div class="lg-day${i === 6 ? ' big' : ''}${i < st.day - 1 ? ' done' : ''}${i === st.day - 1 ? ' today' : ''}"><span class="lg-n">DÍA ${i + 1}</span><span class="lg-r">${loginRw(r, i === 6)}</span></div>`).join('');
  $('#btn-login').textContent = `¡COBRAR DÍA ${st.day}!`;
  $('#scr-login').hidden = false; fitText($('#btn-login'), 36, 20);
}
function claimLogin() {
  const st = loginState(); $('#scr-login').hidden = true; if (!st.ready) return;
  const r = LOGIN[st.day - 1]; giveReward(r);
  SAVE.login = { last: todayStr(), day: st.day, best: Math.max(SAVE.login.best || 0, st.day) };
  stat('login', 1); saveGame(); updateWallets(); play('win'); toast(`Día ${st.day}: ${rewardTxt(r)}`, true);
}
$('#btn-login').addEventListener('click', claimLogin);
// ---- novedades: lo nuevo de verdad y las «notas» de Microblizz
const NEWS = {
  real: ['<b>Equilibrio de facciones</b>: medido con miles de partidas automáticas. Antes una facción ganaba el 94 % y otra el 6 %; ahora todas quedan entre el 47 % y el 54 %. Animales Locos y Comunidad Gamer, más fuertes; No-Muertos y Memes, algo menos.',
    '<b>Sala de pruebas</b> (abajo en el menú): CAOS infinito, el tiempo no corre y nada se cae. Saca grupos, tanques, sanadores, tiradores o líderes de cualquier rival, enciende su IA, cambia al campo de cualquier jefe y mira el daño por segundo. Sin premios.',
    '<b>Arena</b> (abajo en el menú): elige uno de 3 «jugadores» inventados, gana copas y sube de liga: Becario, Junior, Senior, Director y CEO.',
    '<b>Hechizos nuevos</b> en el gashapón de cartas: <b>Crunch</b> (No-Muertos: tus tropas pegan el doble de rápido, pero se van quemando) y <b>Review bombing</b> (Comunidad Gamer: las torres y la sede del rival reciben un 40 % más de daño).',
    'De antes: campos propios para los 12 jefes y opciones de números de daño y sangre.'],
  joke: ['Microblizz ha probado su juego en la sala de pruebas. Dice que está «equilibrado»: gana siempre ella.', 'Phony cobra la Arena como DLC. Aquí es gratis y las copas no se venden.', 'El CEO hizo Crunch tres semanas para entregar esta versión. Él no, sus empleados.'],
};
function openNews() {
  $('#news-title').textContent = 'NOVEDADES · ' + VERSION;
  $('#news-body').innerHTML = `<h4>LO NUEVO</h4><ul>${NEWS.real.map(t => `<li>${t}</li>`).join('')}</ul><h4>NOTAS DE MICROBLIZZ Y PHONY</h4><ul class="joke">${NEWS.joke.map(t => `<li>${t}</li>`).join('')}</ul>`;
  $('#scr-news').hidden = false; $('#news-body').scrollTop = 0;
}
$('#btn-news-ok').addEventListener('click', () => { $('#scr-news').hidden = true; play('select'); stat('news', 1); if (SAVE.seenVer !== VERSION) { SAVE.seenVer = VERSION; saveGame(); } titlePopups(); });
// al volver al menú principal: primero las novedades y luego el premio diario (nunca durante la partida guiada)
function titlePopups() {
  if (!SAVE.tut.done || G.autoplay || $('#scr-title').hidden || !$('#scr-news').hidden || !$('#scr-login').hidden) return;
  if (SAVE.seenVer !== VERSION) { openNews(); return; }
  if (loginState().ready) openLogin();
}
// ---- velocidad x2 (se guarda; en la partida guiada siempre va a x1)
function applySpeed() {
  const on = !!SAVE.speed2 && !G.tutMatch, b = $('#btn-speed'); G.timeScale = on ? 2 : 1;
  b.hidden = !!G.tutMatch; b.setAttribute('aria-pressed', String(on)); $('#speed-txt').textContent = on ? 'x2' : 'x1';
  b.setAttribute('aria-label', on ? 'Velocidad x2. Pulsa para volver a la normal' : 'Velocidad normal. Pulsa para ir el doble de rápido');
}
$('#btn-speed').addEventListener('click', () => { if (G.tutMatch) return; SAVE.speed2 = !SAVE.speed2; if (SAVE.speed2) stat('speed2', 1); saveGame(); applySpeed(); play('select'); toast(SAVE.speed2 ? 'Velocidad x2: todo va el doble de rápido' : 'Velocidad normal', true); });
// ---- pack de bienvenida
function buyStarter() {
  if (SAVE.starter) return;
  const P = SHOP.starter, pool = Object.keys(ITEMS).filter(k => ITEMS[k].rar === 'epic' && !ITEMS[k].pass);
  SAVE.starter = true; SAVE.gems += P.gems; SAVE.gold += P.gold;
  const it = newCopy('eq', pick(pool), 3);
  saveGame(); play('win'); updateWallets(); buildShop(); toast('¡Pack de bienvenida! Microblizz te da las gracias', true);
  setTimeout(() => openItem(it.u), 450);
}
// ---- partida guiada. Pasos: 0 = ganar una partida · 1 = ponerle una habilidad a una carta · 2 = girar el gashapón
const COACH_WHO = 'LOLA · DESPEDIDA POR MICROBLIZZ';
function curScreen() { let top = null; for (const sc of document.querySelectorAll('.screen')) if (!sc.hidden && (!top || sc.classList.contains('modal'))) top = sc; return top ? top.id : ''; }
function tutStep(n) {
  const T = SAVE.tut; if (T.done || T.step >= n) return;
  T.step = n;
  if (n === 1) {
    if (!SAVE.tutGift.cafe) { SAVE.tutGift.cafe = 1; T.cafeU = addCopy('ab', 'cafeina', [0.75]).u; G.tutJust = true; }
    if (!SAVE.inv.some(x => x.k === 'ab')) { tutStep(2); return; }
  }
  if (n === 2 && !SAVE.tutGift.tix) { SAVE.tutGift.tix = 1; SAVE.tickets = (SAVE.tickets || 0) + 3; G.tutJust2 = true; updateWallets(); }
  saveGame();
}
function tutFinish() {
  const T = SAVE.tut; if (T.done) return;
  T.done = true; T.step = 3; delete T.sawG; if (SAVE.seenVer !== VERSION) SAVE.seenVer = VERSION;
  G.tutMatch = false; saveGame(); tutTick(); setTimeout(titlePopups, 60);
}
function tutSkip() { play('select'); tutFinish(); $('#tut').hidden = true; $('#tut-tip').hidden = true; toast('Tutorial saltado. Puedes repetirlo en Opciones', true); }
function tutWant() {
  const T = SAVE.tut; if (!T || T.done || G.autoplay) return null;
  const sc = curScreen();
  if (T.step === 0) {
    if (sc === 'scr-title') return { sel: '#btn-camp', text: '¡Hola! Soy Lola. Microblizz, una empresa millonaria, compró el estudio donde yo trabajaba, nos despidió a todos y ahora quiere cerrar tus juegos favoritos. ¡Vamos a impedirlo! Toca <b>CAMPAÑA</b>.' };
    if (sc === 'scr-camp') return { sel: '[data-lv="1-1"]', text: 'Empieza por el primer nivel: <b>La compra</b>.' };
    if (sc === 'scr-prep') return { sel: '#btn-play', text: 'Aquí eliges con qué facción juegas. Por ahora tienes a los <b>Animales Locos</b>. Toca <b>JUGAR</b>.' };
    if (sc === 'scr-end') return { sel: '#btn-again', text: `¡Casi! Esta vez ha ganado Microblizz. Toca <b>${$('#btn-again').textContent}</b> y vuelve a intentarlo.` };
    return null;
  }
  if (T.step === 1) {
    if (sc === 'scr-end') return { sel: '#btn-menu', text: G.tutJust ? '¡Victoria! Te regalo una habilidad: <b>Cafeína</b>, que hace que una carta corra más. Toca <b>MENÚ</b> y vamos a ponérsela.' : 'Toca <b>MENÚ</b> y vamos a ponerle una habilidad a una carta.' };
    if (sc === 'scr-camp') return { sel: '#scr-camp .back', text: 'Vuelve al menú principal con la flecha.' };
    if (sc === 'scr-title') return { sel: '#btn-coll', text: 'Toca <b>COLECCIÓN</b>: ahí están tus cartas y lo que llevan puesto.' };
    if (sc === 'scr-coll') return { sel: '#coll-list [data-ab]', text: 'Cada carta tiene una <b>ranura de HABILIDAD</b>. Toca la de tu líder.' };
    if (sc === 'scr-pick') { const cafe = T.cafeU && invGet(T.cafeU); return { sel: cafe ? `#pick-list .pick-opt[data-id="${T.cafeU}"]` : '#pick-list .pick-opt[data-id]:not([data-id=""])', text: cafe ? 'Elige <b>Cafeína</b>.' : 'Elige una habilidad.' }; }
    return null;
  }
  if (T.step === 2) {
    const done = G.tutJust2 ? '¡Hecho! Tu carta ya lleva su habilidad. Y te regalo <b>3 tiradas gratis</b> del gashapón. ' : '¡Hecho! ';
    if (sc === 'scr-coll') return { sel: '#scr-coll .back', text: done + 'Vuelve al menú con la flecha.' };
    if (sc === 'scr-inv') return { sel: '#scr-inv .back', text: done + 'Vuelve al menú con la flecha.' };
    if (sc === 'scr-title') return { sel: '#btn-gacha', text: 'Toca <b>GASHAPÓN</b>: ahí salen habilidades y equipo para tus cartas.' };
    if (sc === 'scr-gacha') return { sel: '#btn-pull', text: 'Gira <b>x1</b>: es gratis. Lo que te toque, póntelo en Colección como antes.' };
    return null;
  }
  return null;
}
let coachKey = '';
function coachPlace(t) {
  const co = $('#coach'), sr = stage.getBoundingClientRect(), k = W / sr.width, r = t.getBoundingClientRect();
  const cx = (r.left + r.width / 2 - sr.left) * k, top = (r.top - sr.top) * k, bot = (r.bottom - sr.top) * k, h = co.offsetHeight;
  let up = bot + 20 + h > VIEW.LH - 6, y = up ? top - h - 20 : bot + 20;
  if (up && y < 6) { up = false; y = bot + 20; }
  co.style.top = Math.round(y) + 'px'; co.classList.toggle('up', up); co.classList.toggle('down', !up);
  co.style.setProperty('--ax', Math.round(clamp(cx - 24 - 12, 18, 492 - 46)) + 'px');
}
function tutTick() {
  const T = SAVE.tut;
  if (!T.done && T.step === 2 && T.sawG && curScreen() !== 'scr-gacha') { tutFinish(); return; }   // vio el gashapón y se fue: listo
  const want = tutWant(), key = want ? want.sel + '|' + want.text : '', co = $('#coach');
  if (key !== coachKey) {
    coachKey = key;
    for (const e of document.querySelectorAll('.coach-glow')) e.classList.remove('coach-glow');
    if (!want) { co.hidden = true; return; }
    co.innerHTML = `<span class="coach-who">${COACH_WHO}</span>${want.text}<button class="coach-skip" id="coach-skip">Saltar tutorial</button>`;
    co.hidden = false; $('#coach-skip').onclick = tutSkip;
  }
  if (!want) return;
  const t = document.querySelector(want.sel);
  if (!t || !t.getClientRects().length) { co.style.visibility = 'hidden'; return; }
  co.style.visibility = '';
  if (!t.classList.contains('coach-glow')) { t.classList.add('coach-glow'); try { t.scrollIntoView({ block: 'nearest' }); } catch (e) { /* sin scroll */ } }
  coachPlace(t);
}
// pistas durante la primera partida (no paran el juego)
function tutBattleStart() { G.tutB = 0; G.tutT = 0; G.tutAt = 0; G.tutTipSeen = false; G.tutJust = false; G.tutJust2 = false; $('#tut-tip').hidden = true; }
function tipBattle(html, secs) { const t = $('#tut-tip'); t.innerHTML = html; t.hidden = false; clearTimeout(tipBattle.tm); tipBattle.tm = setTimeout(() => { t.hidden = true; }, secs * 1000); }
function tutBattle(dt) {
  if (!G.tutMatch) return;
  G.tutT += dt;
  if (G.tutB === 1 && G.tutT > G.tutAt + 9) { G.tutB = 2; G.tutAt = G.tutT; if (!G.tutTipSeen) tipBattle('Truco: <b>mantén pulsada</b> una carta para ver qué hace.', 7); }
  else if (G.tutB === 2 && G.tutT > G.tutAt + (G.tutTipSeen ? 1 : 10)) { G.tutB = 3; tipBattle('Tu objetivo: tira sus <b>torres</b> y la <b>sede de Microblizz</b>. ¡Tú puedes!', 7); }
}
