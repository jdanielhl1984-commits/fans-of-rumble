// Fans of Rumble · Campaña 3 «Fin de la partida»: IAhorro (la IA del ahorro… de sueldos) y la facción 10, Los Creadores
'use strict';
/* ---------- v0.9.23 ----------
   Microblizz y Phony se juntan y compran IAhorro, una IA que «hace juegos sola». Despiden a programadores,
   diseñadores y artistas, y sacan juegos idénticos cada cinco minutos. Los fans tienen que apagarla.
   · 4 mundos (13 a 16): La Granja de Prompts, El Almacén de Datos, El Estudio Vacío y El Núcleo de IAhorro.
   · IAhorro es la tercera empresa rival (como Microblizz y Phony). Su pasiva, ENTRENADA CON TU TRABAJO:
     cada 25 s copia la última unidad que has sacado y la pone de su lado (en gris, con el 70 % de fuerza).
   · Al ganar a IAhorro se unen Los Creadores (facción 10). Su pasiva, SIN CRUNCH: si una unidad pasa 3 s sin
     recibir daño, descansa y se cura un 2 % de su vida por segundo.
   Este archivo va justo después de 05-audio.js: añade datos a las tablas que ya existen. */

// ---- cartas y estadísticas
Object.assign(CFG.enemyCards, {
  promptbot:  { name: 'Becario Virtual', cost: 2, count: 3 },
  copiapega:  { name: 'Copiapega', cost: 3, count: 1 },
  alucinador: { name: 'Asistente Alucinado', cost: 3, count: 1 },
  dronia:     { name: 'Dron de Contenido', cost: 4, count: 1 },
  granjaserv: { name: 'Granja de Servidores', cost: 5, count: 1 },
  clonador:   { name: 'Clonador 3000', cost: 5, count: 1 },
  sp_sustituir: { name: 'Sustitución por IA', cost: 3, count: 1, spell: { side: 'foe', kind: 'dmg', r: 75, amt: 160, bld: 0.3, fx: 'letter', col: '#7df3ff', label: '¡SUSTITUIDO!' } },
});
Object.assign(CFG.cards, {
  indie:        { name: 'IndieDev', cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: '¡Hotfix!', desc: 'Hizo un juego entero ella sola, en su cuarto. Dispara líneas de código y cada 8 s lanza un ¡HOTFIX!: cura 70 a los aliados cercanos y les quita los aturdimientos. Si cae, vuelve a los 12 s.' },
  jam:          { name: 'Game Jam', cost: 2, count: 3, rarity: 'common', rar: 'Común', tag: 'Salen 3', desc: 'Tres creadores que han hecho un juego en 48 horas. Rápidos y con mucho café.' },
  tester:       { name: 'Tester de QA', cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Encuentra bugs', desc: 'Lo rompe todo antes que nadie: recibe un 30 % menos de daño y marca a lo que golpea (tu equipo le hace un 20 % más durante 4 s).' },
  pixelartista: { name: 'Pixelartista', cost: 3, count: 1, rarity: 'common', rar: 'Común', tag: 'A distancia', desc: 'Dibuja a mano, píxel a píxel. Lanza píxeles que salpican a los de alrededor.' },
  compositora:  { name: 'Compositora', cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Banda sonora', desc: 'Su música épica anima a los de alrededor: los aliados cercanos pegan un 20 % más.' },
  disenadora:   { name: 'Diseñadora de Niveles', cost: 4, count: 1, rarity: 'rare', rar: 'Rara', tag: '¡Rediseño!', desc: 'Cada 8 s rediseña el nivel bajo los pies del enemigo: aturde 1 s a los que tiene cerca.' },
  prototipo:    { name: 'El Prototipo', cost: 5, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Tanque + jam', desc: 'Un robot gigante hecho con cinta americana y mucho cariño. Aguanta muchísimo y, cuando cae, salen 2 creadores de la Game Jam a por la segunda versión.' },
  freelance:    { name: 'Freelance', cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: 'Trabaja por su cuenta y va directo al grano: salta a por el sanador o el tirador enemigo y les hace el doble de daño.', gacha: true, fac: 'creadores' },
  sp_portfolio: { name: 'Lluvia de portfolios', cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: 'Llueven portfolios de gente despedida (y con mucho talento): 160 de daño en la zona. A los sanadores, un 50 % más.', gacha: true, fac: 'creadores', spell: { side: 'foe', kind: 'dmg', r: 80, amt: 160, bld: 0.35, fx: 'letter', col: '#ffe06a' } },
  sp_gamejam:   { name: '48 horas de Jam', cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: 'Pizza, café y ganas: cura 110 a tus tropas de la zona y atacan un 30 % más rápido durante 5 s.', gacha: true, fac: 'creadores', spell: { side: 'ally', kind: 'heal', r: 85, amt: 110, haste: 5, fx: 'can', col: '#ff9a3c' } },
  sp_creditos:  { name: 'Créditos finales', cost: 4, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: 'Salen los créditos con el nombre de toda la gente que hizo el juego. Los enemigos de la zona se quedan 3 s leyéndolos sin hacer nada.', gacha: true, fac: 'creadores', spell: { side: 'foe', kind: 'stun', r: 85, t: 3, sk: 'update', fx: 'bar', col: '#fff6ea', label: 'GRACIAS POR JUGAR' } },
});
Object.assign(CFG.units, {
  promptbot:  { hp: 100, dmg: 11, cd: 0.9, range: 6,   speed: 50, r: 10, sight: 110 },
  copiapega:  { hp: 220, dmg: 21, cd: 1.15, range: 105, speed: 36, r: 13, sight: 150, ranged: 'card' },
  alucinador: { hp: 210, dmg: 8,  cd: 1.0, range: 8,   speed: 30, r: 13, sight: 110, healer: true, heal: 15, healCd: 1.8, healR: 95 },
  dronia:     { hp: 480, dmg: 38, cd: 1.3, range: 8,   speed: 42, r: 15, sight: 140, buildings: true },
  granjaserv: { hp: 920, dmg: 24, cd: 1.3, range: 10,  speed: 25, r: 22, sight: 140, pulse: { cd: 9, r: 75, stun: 1, kind: 'daze', text: '¡ACTUALIZANDO!', color: 'rgba(125,243,255,.95)', tc: '#a5f3fc', sfx: 'womp' } },
  clonador:   { hp: 760, dmg: 28, cd: 1.3, range: 10,  speed: 28, r: 20, sight: 140, eject: 'promptbot', ejectN: 2, ejectTxt: '¡VERSIÓN 2.0!' },
  indie:        { hp: 560, dmg: 24, cd: 1.0, range: 95,  speed: 36, r: 18, sight: 150, ranged: 'bullet', hotfix: { cd: 8, r: 110, heal: 70 } },
  jam:          { hp: 88,  dmg: 11, cd: 0.85, range: 6,  speed: 52, r: 10, sight: 110 },
  tester:       { hp: 430, dmg: 17, cd: 1.1, range: 10,  speed: 34, r: 15, sight: 130, armor: 0.3, mark: { t: 4, f: 0.2 } },
  pixelartista: { hp: 190, dmg: 21, cd: 1.15, range: 110, speed: 36, r: 13, sight: 150, ranged: 'pixel', splash: 30 },
  compositora:  { hp: 230, dmg: 12, cd: 1.0, range: 90,  speed: 34, r: 13, sight: 140, ranged: 'heart', aura: { r: 100, mult: 1.2 } },
  disenadora:   { hp: 270, dmg: 18, cd: 1.15, range: 100, speed: 34, r: 13, sight: 150, ranged: 'bullet', pulse: { cd: 8, r: 80, stun: 1, kind: 'daze', text: '¡REDISEÑO!', color: 'rgba(255,203,61,.95)', tc: '#ffe06a', sfx: 'womp' } },
  prototipo:    { hp: 1000, dmg: 30, cd: 1.3, range: 10, speed: 26, r: 22, sight: 140, eject: 'jam', ejectN: 2, ejectTxt: '¡SEGUNDA ITERACIÓN!' },
  freelance:    { hp: 220, dmg: 22, cd: 1.0, range: 8,   speed: 48, r: 13, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
});
Object.assign(TYPES, {
  promptbot: { top: 36, foot: '#334155' }, copiapega: { top: 46, foot: '#1e293b' }, alucinador: { top: 42, foot: null, hover: true, jet: true },
  dronia: { top: 40, foot: null, hover: true, jet: true }, granjaserv: { top: 66, foot: '#0f172a' }, clonador: { top: 60, foot: '#1e293b' },
  indie: { top: 56, foot: '#1f2937' }, jam: { top: 34, foot: '#1f2937' }, tester: { top: 48, foot: '#1f2937' }, pixelartista: { top: 46, foot: '#1f2937' },
  compositora: { top: 48, foot: '#1f2937' }, disenadora: { top: 48, foot: '#1f2937' }, prototipo: { top: 66, foot: '#44403c' }, freelance: { top: 46, foot: '#1f2937' },
});
Object.assign(TOPS, { iahorro: 64, sp_sustituir: 46, sp_portfolio: 46, sp_gamejam: 46, sp_creditos: 46, i_tower: 90, i_base: 120, r_tower: 84, r_base: 104 });
Object.assign(ROLES, { promptbot: 'swarm', copiapega: 'ranged', alucinador: 'support', dronia: 'buster', granjaserv: 'tank', clonador: 'tank',
  indie: 'support', jam: 'swarm', tester: 'tank', pixelartista: 'ranged', compositora: 'support', disenadora: 'control', prototipo: 'tank', freelance: 'assassin',
  sp_sustituir: 'spell', sp_portfolio: 'spell', sp_gamejam: 'spell', sp_creditos: 'spell' });
Object.assign(SKINS, {
  i: { tower: [0, 80], base: [0, 104], shot: ['laser', 'eyelaser'], glow: { tower: [0, 80, 15, '34,227,255'], base: [0, 104, 30, '34,227,255'] }, chips: ['#1e293b', '#334155', '#22e3ff', '#e2e8f0'] },
  r: { tower: [0, 74], base: [0, 84], shot: ['pixel', 'pixel'], glow: { tower: [0, 74, 14, '255,154,60'] }, chips: ['#7c3aed', '#ff9a3c', '#fff6ea', '#22c55e'] },
});

// ---- facciones
FACTIONS.iahorro = { name: 'IAhorro', pname: 'Entrenada con tu trabajo', leader: null, units: ['promptbot', 'copiapega', 'alucinador', 'dronia', 'granjaserv', 'clonador'], skin: 'i', base: 'IAHORRO', passive: 'ENTRENADA CON TU TRABAJO', kind: 'enemy', end: 'el Núcleo de IAhorro', spells: ['sp_sustituir'] };
CORP.iahorro = 'IAhorro';
FACTIONS.creadores = { name: 'Los Creadores', los: 'los Creadores', corr: 'Creadores corrompidos', pname: 'Sin crunch', leader: 'indie', units: ['jam', 'tester', 'pixelartista', 'compositora', 'disenadora', 'prototipo'], skin: 'r', base: 'EL ESTUDIO INDIE', passive: 'SIN CRUNCH', chip: 'DESCANSO', pkey: 'nocrunch',
  passiveText: 'Aquí no se hace crunch: si una unidad pasa 3 s sin recibir daño, descansa y se cura un 2 % de su vida por segundo.', banner: 'Tras 3 s sin recibir daño, tus unidades descansan y se curan un 2 % por segundo', trio: ['tester', 'indie', 'prototipo'], kind: 'creadores', end: 'tu Estudio indie', icon: 'star', trioH: [100, 150, 132],
  gacha: ['freelance', 'sp_portfolio', 'sp_gamejam', 'sp_creditos'] };
FACTION_ORDER.push('creadores');
FAC_BAL.creadores = { hp: 1.16, dmg: 1.13 };
CFG.passives.iahorro = { name: 'ENTRENADA CON TU TRABAJO', every: 25, power: 0.7 };
CFG.passives.creadores = { name: 'SIN CRUNCH', after: 3, regen: 0.02 };
THEMES.creadores = { grad: ['#6fb45a', '#76bc60', '#62a84e'], greens: ['#4f9a3f', '#62ac4c', '#8fd06a', '#438a35', '#a2dc7c'], hedge: ['#3f8a35', '#5fae4a'], cap: '#ff9a3c', capDot: '#fff6ea', title: ['#62ac4c', '#8fd06a'] };

// ---- objeto de facción
ITEMS.taza_indie = { name: 'Taza «Sin crunch»', slot: 'acc', rar: 'legendary', fac: 'creadores', st: [18, 1.2], desc: '+{0} % de daño y se cura un {1} % de su vida cada segundo. Pone «Me voy a mi hora».' };
FAC_ITEM.creadores = 'taza_indie';

// ---- campaña 3: 4 mundos
WORLDS.push(
  { camp: 3, openAfter: '12-4', name: 'La Granja de Prompts', efac: 'iahorro', story: 'Microblizz y Phony se han juntado para comprar IAhorro, la IA del ahorro… de sueldos. Han despedido a todo el estudio: ahora unas pantallas escriben juegos solas, uno cada cinco minutos, y todos son iguales.', levels: [
    { name: 'Puestos vacíos', elvl: 9, income: 0.86, deck: ['promptbot', 'copiapega', 'alucinador'] },
    { name: 'Juegos en serie', elvl: 9, income: 0.9, deck: ['promptbot', 'copiapega', 'alucinador', 'dronia'] },
    { name: 'El prompt definitivo', elvl: 9, income: 0.93, deck: ['promptbot', 'copiapega', 'alucinador', 'dronia', 'granjaserv'] },
    { name: 'Generador de Clones', elvl: 10, income: 0.95, boss: 'Generador de Clones' }] },
  { camp: 3, name: 'El Almacén de Datos', efac: 'ciber', story: 'IAhorro se entrena con todo lo que encuentra… sin pedir permiso. Ha obligado a los Ciberpunks a vigilar sus servidores, llenos de juegos copiados.', levels: [
    { name: 'Pasillo de servidores', elvl: 9, income: 0.86 }, { name: 'Datos sin permiso', elvl: 9, income: 0.9 }, { name: 'La sala fría', elvl: 10, income: 0.93 }, { name: 'CyberMarine entrenado', elvl: 10, income: 0.96, boss: 'CyberMarine entrenado' }] },
  { camp: 3, name: 'El Estudio Vacío', efac: 'streamers', story: 'Sillas vacías y arte con seis dedos. IAhorro ha cambiado a los streamers por copias generadas: todas con la misma cara, la misma voz y el mismo chiste.', levels: [
    { name: 'Arte con seis dedos', elvl: 9, income: 0.88 }, { name: 'Doblaje sintético', elvl: 10, income: 0.92 }, { name: 'Directo de nadie', elvl: 10, income: 0.95 }, { name: 'StreamKing generado', elvl: 10, income: 0.98, boss: 'StreamKing generado' }] },
  { camp: 3, name: 'El Núcleo de IAhorro', efac: 'iahorro', unlock: 'creadores', story: 'El corazón de IAhorro. Cuanto más juegos copia, más grande se hace. Los programadores, diseñadores y artistas despedidos esperan fuera: si la apagas, se unen a ti.', levels: [
    { name: 'Centro de datos', elvl: 10, income: 0.95 }, { name: 'Sala de entrenamiento', elvl: 10, income: 0.98 }, { name: 'El último prompt', elvl: 10, income: 1 }, { name: 'IAhorro', elvl: 10, income: 1.05, boss: 'IAhorro' }] },
);
WORLDS.forEach((w, wi) => w.levels.forEach((l, li) => { l.id = `${wi + 1}-${li + 1}`; l.wi = wi; l.li = li; }));
const IA_FIRST = 12, IA_FINAL = 15;   // mundos de la campaña 3 (empezando por 0)
BOSS_HP.push(13000, 13500, 14000, 15000);
BOSS_ART.push('i_base', 'cybermarine', 'twitchking', 'iahorro');
BOSS_SHORT.push('Clones', 'CyberMarine 2', 'StreamKing IA', 'IAhorro');

// ---- frases
QUIPS.iahorro = ['Error 404: alma no encontrada', 'He sido entrenado para esto', 'Como modelo de lenguaje, me rindo', 'Regenerando respuesta…', 'Mi contexto se ha llenado', 'Esto no estaba en mis datos', 'Prompt rechazado', 'Volveré en la versión 5'];
QUIPS.corruptIa = ['¡Por fin libre!', 'Ya no tengo que copiar a nadie', 'Vuelvo a tener mi cara', '¿Dónde está mi personalidad?', 'IAhorro me prometió «eficiencia»', '¡Me desconecto!'];
QUIPS_FAC.creadores = ['¡Me voy a mi hora!', 'Esto lo hice a mano', 'Guardé la partida', 'Nos vemos en la secuela (si hay presupuesto)'];
QUIPS_CORRUPT.creadores = ['¡Por fin libre!', '¡Vuelvo a crear!'];
CHAT_FAC.creadores = {
  idle: ['estos sí que hacen juegos con cariño', 'la IndieDev hizo su juego en su cuarto, respeto', 'el Tester ya ha encontrado 47 bugs', 'la Compositora tiene banda sonora hasta para ir al baño', 'el Prototipo va con cinta americana y fe', 'sin crunch y siguen ganando, ¿veis?'],
  leader: ['¡HOTFIX! ¡HOTFIX!', 'la IndieDev ha salido con su café', 'parche del día 0, por fin uno bueno'],
  towerP: ['torre rediseñada', 'esa torre la ha hecho una IA, se nota', 'bug encontrado: la torre ya no existe'],
  win: ['¡los creadores vuelven!', 'hecho a mano > hecho en serie', 'créditos finales con nombres de verdad'],
};
CHAT_VS.iahorro = ['IAhorro: «puedo hacer tu juego en 5 segundos». Y se nota', 'esos bots son todos iguales', 'el Asistente Alucinado acaba de inventarse una regla', '«entrenado con tu trabajo» = copiado', 'IAhorro ha despedido a 300 personas para ahorrar en café'];
CHAT_USERS_FAC.creadores = [['DevEnPijama', '#ff9a3c'], ['PixelYCafé', '#fde68a']];
const CHAT_IA = {
  start: ['¡Empieza! Hoy apagamos a IAhorro', 'primer', 'hola desde el trabajo (que aún tengo) 👀', '¡vamos rebelión! #HechoAMano'],
  idle: ['mi juego favorito lo hizo gente, no un servidor', 'POV: eres un prompt de IAhorro', 'IAhorro ha generado 40 juegos mientras escribía esto', '¿soy yo o todos los bots son iguales?', 'yo solo vengo por la música (que la ha compuesto alguien)', 'IAhorro: «he leído todos los juegos». Sin pagar ninguno'],
  towerP: ['¡a por la siguiente!', 'una torre menos para IAhorro', '¡TORRE! 🔥', 'IAhorro: «esa torre era un error de redondeo»', 'servidor apagado 🔌'],
  towerE: ['eso ha dolido', 'uff', 'IAhorro lo celebra despidiendo a alguien más', '¡defiende ese carril!'],
  stun: ['¡los ha dejado actualizando! ⏳', 'actualización obligatoria, cómo no', 'IAhorro: «estamos mejorando el modelo»'],
  baseLowE: ['¡que se apaga! 🔌', '¡último empujón!', 'IAhorro ya está redactando el comunicado (con IA)'],
  enemyBig: ['¡cuidado, que viene {X}!', 'IAhorro saca a {X}, se viene lo gordo', '{X} en camino, ¡defiende!'],
  win: ['¡IAhorro desconectada!', 'GG EZ', '¡VAMOOOS!', '#HechoAMano', 'los creadores vuelven a casa', 'GG WP'],
  lose: ['mañana más', 'IAhorro: «he generado tu derrota en 0,3 s»', 'GG', 'nerf IAhorro', 'la próxima sí'],
  sub: ['¡te ha copiado la carta! 😡', 'entrenada con tu trabajo, literal', 'eso era mío', 'IAhorro copiando en directo'],
};
const HEADLINES_IA = {
  win: ['IAhorro pierde {c} torres: «es un problema de los datos de entrenamiento»', '{L} apaga a IAhorro con un juego hecho a mano', 'IAhorro promete «mejorar el modelo» tras perder contra gente de verdad'],
  lose: ['IAhorro gana y genera 300 notas de prensa celebrándolo', '{F} cae ante IAhorro, que ya ha copiado la partida', 'IAhorro gana: «ha sido muy eficiente»'],
  unlock: ['{U} vuelven a crear: «nadie hace esto como nosotros»', '{U} se unen a la rebelión y prometen no hacer crunch'],
};
const BOSS_QUOTE_IA = { 12: '«He generado 4.000 juegos esta mañana. Todos iguales. Todos tuyos.»', 13: '«IAhorro me ha entrenado con tus partidas. Sé lo que vas a hacer.»', 14: '«Soy el streamer perfecto: nunca me canso, nunca me quejo, nunca existo.»', 15: '«¿Para qué pagar a 300 personas si me tenéis a mí? Ahorro del 100 %.»' };
CHAT_BOSS.push(
  ['el Generador de Clones ha copiado hasta el chat', 'todos esos juegos son el mismo juego'],
  ['el CyberMarine entrenado juega igual que tú… porque te ha copiado', 'ese CyberMarine tiene seis dedos'],
  ['el StreamKing generado tiene 3 millones de seguidores bots', 'su voz es de un robot leyendo un guion'],
  ['¡IAhorro en persona!', 'IAhorro está generando su propio discurso de victoria', 'apágala, apágala', 'cuidado, que ha aprendido a copiar los hechizos'],
);

// ---- música: un tema para Los Creadores y uno para cada jefe nuevo
(() => {
  const mk = d => { d.sc = SCALES[d.scale]; d.L = d.lead.seq.map(mseq); d.B = d.bass ? mseq(d.bass.seq) : []; d.A = d.arp ? d.arp.seq.split(' ') : null; return d; };
  Object.assign(TRACKS, {
    // Los Creadores: chiptune alegre, hecho a mano
    creadores: mk({ bpm: 128, tonic: 50, scale: 'maj', prog: [0, 3, 4, 0], dv: 1,
      pad: { wave: 'triangle', vol: 0.14, lp: 1800, att: 0.04 },
      bass: { wave: 'square', vol: 0.36, lp: 900, seq: 'r . o . r . o . f . o . r . o .' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', h: '..x...x...x...xx' },
      arp: { wave: 'square', vol: 0.07, lp: 3200, oct: 14, gate: 0.35, seq: '0 1 2 1 0 1 2 3 0 1 2 1 0 2 1 0' },
      lead: { wave: 'square', vol: 0.19, gate: 0.6, lp: 3800, oct: 7, up: 7, seq: [
        '4 . 5 . 7 - 4 . 9 . 7 . 5 . 4 .', '3 . 4 . 5 - 3 . 7 . 5 . 4 . 3 .', '4 . 5 . 7 - 9 . 11 . 9 . 7 . 5 .', '7 - - . 5 . 4 . 2 . 4 . 0 - - .'] } }),
    // Generador de Clones: el mismo compás repetido hasta el infinito
    boss12: mk({ bpm: 132, tonic: 45, scale: 'min', prog: [0, 0, 0, 5], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.16, lp: 1000, att: 0.08 },
      bass: { wave: 'square', vol: 0.45, lp: 600, oct: 0, seq: 'r . r . r . r . r . r . r . r .' },
      drums: { k: 'x...x...x...x...', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      arp: { wave: 'square', vol: 0.08, lp: 2600, oct: 14, gate: 0.3, seq: '0 1 2 0 1 2 0 1 2 0 1 2 0 1 2 3' },
      lead: { wave: 'square', vol: 0.18, gate: 0.5, lp: 2600, oct: 7, up: 0, seq: [
        '0 . 2 . 4 . 2 . 0 . 2 . 4 . 2 .', '0 . 2 . 4 . 2 . 0 . 2 . 4 . 2 .', '0 . 2 . 4 . 2 . 0 . 2 . 4 . 2 .', '5 . 4 . 2 . 4 . 5 . 7 - - . . .'] } }),
    // CyberMarine entrenado: darksynth con ruido de datos
    boss13: mk({ bpm: 120, tonic: 43, scale: 'phr', prog: [0, 1, 0, 6], dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.2, lp: 800, att: 0.1 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 520, oct: 0, seq: 'r r . r r . r . r r . r . r o .' },
      drums: { k: 'x..x..x...x..x..', s: '....x.......x...', h: 'xxx.xxx.xxx.xxx.' },
      lead: { wave: 'sawtooth', vol: 0.2, det: 10, lp: 2400, gate: 0.8, oct: 7, up: 7, seq: [
        '0 . . 1 . . 3 . 4 - - . 3 . 1 .', '0 . . 1 . . 5 . 4 - - . 3 . 1 .', '7 . . 6 . . 4 . 3 - - . 1 . 0 .', '? . ? . ? . ? . 0 - - - - - - .'] } }),
    // StreamKing generado: pop de directo con la voz robótica (melodía plana)
    boss14: mk({ bpm: 126, tonic: 47, scale: 'min', prog: [0, 5, 3, 4], dv: 1, crash: true,
      pad: { wave: 'square', vol: 0.12, lp: 1500, att: 0.05 },
      bass: { wave: 'sawtooth', vol: 0.42, lp: 650, seq: '. . r . . . r . . . r . . . r .' },
      drums: { k: 'x...x...x...x...', c: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      lead: { wave: 'square', vol: 0.18, gate: 0.9, lp: 2200, oct: 7, up: 0, seq: [
        '4 . 4 . 4 . 4 . 4 . 4 . 2 . 4 .', '4 . 4 . 4 . 4 . 5 . 4 . 2 . 0 .', '4 . 4 . 4 . 4 . 4 . 4 . 7 . 4 .', '5 . 4 . 2 . 0 . 2 - - . . . . .'] } }),
    // IAhorro: épica fría, cada vez más rápida
    boss15: mk({ bpm: 148, tonic: 46, scale: 'hmin', prog: [0, 5, 3, 4], seven: true, dv: 1, crash: true,
      pad: { wave: 'sawtooth', vol: 0.2, lp: 1000, att: 0.06 },
      bass: { wave: 'sawtooth', vol: 0.5, lp: 650, oct: 0, seq: 'r . r r . r r . r . r r . r o .' },
      drums: { k: 'x.x.x.x.x.x.x.x.', s: '....x.......x..x', h: 'xxxxxxxxxxxxxxxx' },
      arp: { wave: 'triangle', vol: 0.08, lp: 3000, oct: 14, gate: 0.4, seq: '0 1 2 3 2 1 0 1 0 1 2 3 2 1 0 3' },
      lead: { wave: 'sawtooth', vol: 0.21, det: 12, lp: 2800, gate: 0.85, oct: 7, up: 7, seq: [
        '0 . 2 . 4 . 6 - - . 4 . 2 . 0 .', '1 . 3 . 5 . 7 - - . 5 . 3 . 1 .', '4 . 6 . 7 . 9 - - . 7 . 6 . 4 .', '6 . 4 . 2 . 1 - - . 0 . 1 . 0 .'] } }),
  });
})();

/* ---------- arte ---------- */
Object.assign(BOX, {
  iahorro: [64, 74, 32, 68], promptbot: [40, 44, 20, 40], copiapega: [58, 56, 28, 50], alucinador: [56, 54, 28, 48], dronia: [60, 52, 30, 46], granjaserv: [78, 80, 39, 74], clonador: [76, 72, 38, 66],
  indie: [86, 84, 42, 78], jam: [40, 44, 20, 40], tester: [60, 58, 30, 52], pixelartista: [60, 56, 30, 50], compositora: [62, 58, 30, 52], disenadora: [62, 58, 30, 52], prototipo: [84, 82, 42, 76], freelance: [60, 56, 30, 50],
  sp_sustituir: [56, 54, 28, 50], sp_portfolio: [56, 54, 28, 50], sp_gamejam: [56, 54, 28, 50], sp_creditos: [56, 54, 28, 50],
  i_tower: [70, 100, 35, 94], i_base: [130, 132, 65, 124], r_tower: [70, 94, 35, 88], r_base: [124, 116, 62, 108],
});
const SKIN_C = '#f1c27d', SKIN_D = '#c68642', SKIN_M = '#e0a872';
function cdev(c, body, skin, hair, opts = {}) {   // un creador: cuerpo, cabeza y pelo
  shape(c, c => { c.moveTo(-8, -28); c.quadraticCurveTo(-11, -15, -9, -3); c.quadraticCurveTo(0, 0, 9, -3); c.quadraticCurveTo(11, -15, 8, -28); c.quadraticCurveTo(0, -31, -8, -28); c.closePath(); }, body);
  shape(c, el(0, -36, 7.4, 7), skin);
  if (hair) shape(c, c => { c.moveTo(-7.4, -37); c.quadraticCurveTo(-7, -45, 0, -45); c.quadraticCurveTo(7.6, -45, 7.4, -37); c.quadraticCurveTo(2, -41, -7.4, -37); c.closePath(); }, hair, 1.4);
  if (opts.glasses) { c.beginPath(); c.arc(-3, -36.6, 2.6, 0, Math.PI * 2); c.moveTo(6.4, -36.6); c.arc(3.8, -36.6, 2.6, 0, Math.PI * 2); c.fillStyle = 'rgba(220,240,255,.7)'; c.fill(); c.lineWidth = 1.3; c.strokeStyle = OL; c.stroke(); }
  dot(c, -2.8, -36.4, 0.95, OL); dot(c, 3.6, -36.4, 0.95, OL);
  c.beginPath(); c.arc(0.4, -33, 1.8, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1.1; c.stroke();
}
function screenHead(c, x, y, w, h, face) {   // cabeza de pantalla de los bots de IAhorro
  shape(c, rr(x - w / 2, y - h / 2, w, h, 3), '#1e293b', 1.8);
  shape(c, rr(x - w / 2 + 2, y - h / 2 + 2, w - 4, h - 4, 2), '#0e7490', 0);
  c.fillStyle = '#7df3ff'; c.font = Math.round(h * 0.5) + 'px ' + FONT_D; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(face || '•‿•', x, y + 1);
}
Object.assign(ART, {
  // retrato de IAhorro (Modo Jefe): un núcleo con un ojo y una corbata
  iahorro(c) {
    shape(c, el(0, -4, 20, 5), '#0f172a', 1.4);
    shape(c, rr(-17, -48, 34, 44, 9), '#1e293b', 2.2);
    shape(c, rr(-13, -44, 26, 26, 6), '#0e7490', 1.4);
    const g = c.createRadialGradient(0, -31, 1, 0, -31, 11); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, '#7df3ff'); g.addColorStop(1, 'rgba(34,227,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(0, -31, 11, 0, Math.PI * 2); c.fill();
    dot(c, 0, -31, 3.4, '#0f172a'); dot(c, 1, -32, 1.1, '#fff');
    shape(c, poly(-4, -16, 4, -16, 2.4, -7, 0, -4, -2.4, -7), '#22e3ff', 1.4);
    otxt(c, 'IA', 0, -56, 11, '#7df3ff'); line(c, [-14, -60, -20, -66], '#7df3ff', 1.6); line(c, [14, -60, 20, -66], '#7df3ff', 1.6);
    for (const x of [-12, 12]) { c.fillStyle = '#ffcb3d'; c.font = '7px ' + FONT_D; c.fillText('€', x, -10); }
  },
  promptbot(c) {
    shape(c, rr(-6, -16, 12, 14, 3), '#475569'); line(c, [-4, -2, -4, 0], OL, 2.4); line(c, [4, -2, 4, 0], OL, 2.4);
    screenHead(c, 0, -24, 15, 11, '>_');
    line(c, [0, -30, 0, -34], OL, 1.2); dot(c, 0, -35, 1.6, '#22e3ff');
    shape(c, rr(-5, -13, 10, 3, 1), '#22e3ff', 0.8);
  },
  copiapega(c) {
    shape(c, rr(-9, -30, 18, 27, 4), '#334155');
    for (const [x, y, r] of [[13, -22, 0.2], [17, -26, -0.1]]) { c.save(); c.translate(x, y); c.rotate(r); shape(c, rr(-5, -6, 10, 12, 1.2), '#e2e8f0', 1.2); line(c, [-3, -3, 3, -3], OL, 0.9); line(c, [-3, 0, 3, 0], OL, 0.9); c.restore(); }
    otxt(c, 'Ctrl', 0, -20, 5.5, '#7df3ff'); otxt(c, 'C+V', 0, -13, 5.5, '#7df3ff');
    screenHead(c, 0, -38, 18, 13, '©©');
  },
  alucinador(c) {
    shape(c, el(0, -6, 12, 3.4), 'rgba(34,227,255,.35)', 0);
    shape(c, el(0, -24, 13, 12), '#334155');
    screenHead(c, 0, -26, 18, 12, '?‿?');
    for (const [x, y] of [[-15, -38], [14, -40], [0, -44]]) otxt(c, '?', x, y, 8, '#ffcb3d');
    line(c, [-11, -14, -15, -10], OL, 2); line(c, [11, -14, 15, -10], OL, 2);
  },
  dronia(c) {
    shape(c, el(0, -6, 16, 3.6), 'rgba(34,227,255,.3)', 0);
    for (const x of [-16, 16]) { line(c, [x * 0.6, -24, x, -28], OL, 2); shape(c, el(x, -29, 7, 1.8), '#94a3b8', 1.2); }
    shape(c, rr(-12, -28, 24, 14, 4), '#1e293b');
    shape(c, rr(-9, -26, 18, 10, 2), '#0e7490', 1);
    otxt(c, '▶', 0, -21, 7, '#fff6ea');
    otxt(c, '#CONTENIDO', 0, -36, 5, '#7df3ff');
  },
  granjaserv(c) {
    shape(c, rr(-20, -60, 40, 58, 4), '#1e293b', 2.4);
    for (let i = 0; i < 6; i++) { shape(c, rr(-16, -56 + i * 9, 32, 6, 1.4), '#334155', 1); dot(c, -12, -53 + i * 9, 1.3, i % 2 ? '#22e3ff' : '#7be04a'); dot(c, -8, -53 + i * 9, 1.3, '#22e3ff'); line(c, [0, -53 + i * 9, 12, -53 + i * 9], '#64748b', 1); }
    shape(c, el(-14, -2, 6, 2.6), '#0f172a', 1.2); shape(c, el(14, -2, 6, 2.6), '#0f172a', 1.2);
    otxt(c, 'IA', 0, -66, 8, '#7df3ff');
    for (const x of [-8, 6]) { c.globalAlpha = 0.5; line(c, [x, -64, x + 3, -72, x - 1, -78], '#cbd5e1', 1.2); c.globalAlpha = 1; }
  },
  clonador(c) {
    shape(c, rr(-18, -46, 36, 42, 6), '#334155', 2.4);
    shape(c, rr(-14, -42, 28, 18, 3), '#0e7490', 1.4);
    for (const x of [-7, 0, 7]) { shape(c, el(x, -33, 3.2, 4), '#7df3ff', 0.9); dot(c, x, -33, 1, OL); }
    otxt(c, 'x3000', 0, -16, 6.5, '#ffcb3d');
    line(c, [-18, -24, -26, -20], OL, 3.2); line(c, [18, -24, 26, -20], OL, 3.2);
    shape(c, el(-26, -19, 4, 4), '#94a3b8', 1.2); shape(c, el(26, -19, 4, 4), '#94a3b8', 1.2);
    shape(c, rr(-14, -6, 9, 6, 1.6), '#1e293b', 1.4); shape(c, rr(5, -6, 9, 6, 1.6), '#1e293b', 1.4);
    line(c, [0, -46, 0, -54], OL, 1.6); dot(c, 0, -56, 2.2, '#22e3ff');
  },
  indie(c) {
    shape(c, rr(9, -26, 9, 11, 2), '#fff6ea', 1.4); line(c, [18, -23, 21, -23, 21, -17, 18, -17], OL, 1.6); otxt(c, '☕', 13.5, -21, 5, '#7a4a22');
    for (const x of [14, 17]) { c.globalAlpha = 0.6; line(c, [x, -28, x + 1.5, -32, x, -36], '#e2e8f0', 1.1); c.globalAlpha = 1; }
    shape(c, c => { c.moveTo(-10, -32); c.quadraticCurveTo(-13, -16, -11, -3); c.quadraticCurveTo(0, 0, 11, -3); c.quadraticCurveTo(13, -16, 10, -32); c.quadraticCurveTo(0, -35, -10, -32); c.closePath(); }, '#7c3aed');
    shape(c, rr(-7, -24, 14, 10, 2), '#a78bfa', 1.2); otxt(c, '</>', 0, -19, 5.5, '#fff6ea');
    line(c, [-6, -30, -9, -36], '#a78bfa', 2.4);
    shape(c, rr(-21, -22, 15, 9, 1.6), '#1f2937', 1.6);
    for (let i = 0; i < 4; i++) dot(c, -18.5 + i * 3.4, -19, 0.9, ['#ff9a3c', '#22e3ff', '#7be04a', '#ff3df0'][i]);
    shape(c, el(0, -42, 9, 8.6), SKIN_M);
    shape(c, c => { c.moveTo(-9, -43); c.quadraticCurveTo(-10, -53, 0, -53); c.quadraticCurveTo(10, -53, 9.4, -43); c.quadraticCurveTo(4, -47, -9, -43); c.closePath(); }, '#7a3b16', 1.4);
    shape(c, el(-9.6, -40, 3, 5), '#7a3b16', 1.2);
    shape(c, c => { c.arc(0, -43, 10.6, Math.PI * 1.05, Math.PI * 1.95); }, null, 2.6); shape(c, el(-10.4, -42, 2.6, 3.4), '#1f2937', 1.2); shape(c, el(10.4, -42, 2.6, 3.4), '#1f2937', 1.2);
    dot(c, -3.2, -42, 1.1, OL); dot(c, 3.6, -42, 1.1, OL);
    c.beginPath(); c.arc(0.4, -38.4, 2.2, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1.2; c.stroke();
  },
  jam(c) {
    shape(c, c => { c.moveTo(-7, -17); c.lineTo(7, -17); c.lineTo(8, -3); c.quadraticCurveTo(0, -1, -8, -3); c.closePath(); }, '#ff9a3c');
    otxt(c, '48h', 0, -10, 5, '#fff6ea');
    shape(c, el(0, -22, 6.6, 6.2), SKIN_C);
    shape(c, c => { c.moveTo(-6.6, -23); c.quadraticCurveTo(-6, -30, 0, -30); c.quadraticCurveTo(6.6, -30, 6.6, -23); c.quadraticCurveTo(2, -26, -6.6, -23); c.closePath(); }, '#3b2a1e', 1.2);
    dot(c, -2.4, -22, 0.9, OL); dot(c, 2.8, -22, 0.9, OL);
    c.beginPath(); c.arc(0.3, -19.4, 1.4, 0.2, Math.PI - 0.2); c.strokeStyle = OL; c.lineWidth = 1; c.stroke();
    shape(c, rr(7, -14, 5, 6, 1), '#fff6ea', 1);
  },
  tester(c) {
    shape(c, rr(-18, -32, 11, 24, 3), '#facc15'); otxt(c, '!', -12.5, -20, 9, '#1f2937');
    cdev(c, '#16a34a', SKIN_D, '#1f2937', { glasses: true });
    otxt(c, 'QA', 0, -17, 7, '#fff6ea');
    shape(c, el(12, -24, 6.4, 6.4), 'rgba(220,240,255,.55)', 1.8); line(c, [16.4, -19.6, 21, -14], OL, 2.6);
    otxt(c, '🐞', 12, -24, 5, '#dc2626');
  },
  pixelartista(c) {
    shape(c, rr(9, -40, 3, 22, 1), '#a16207', 1); for (const [x, y, col] of [[11, -44, '#ff5f6d'], [14, -40, '#3fd0e8'], [8, -38, '#ffcb3d']]) shape(c, rr(x - 2, y - 2, 4, 4, 0.4), col, 0.8);
    cdev(c, '#0ea5e9', SKIN_C, '#be185d');
    for (let i = 0; i < 9; i++) { c.fillStyle = ['#ff5f6d', '#ffcb3d', '#7be04a', '#3fd0e8'][i % 4]; c.fillRect(-6 + (i % 3) * 4, -22 + Math.floor(i / 3) * 4, 3.4, 3.4); }
    shape(c, c => { c.moveTo(-8.6, -42); c.quadraticCurveTo(0, -50, 8.6, -42); c.lineTo(6, -40); c.quadraticCurveTo(0, -45, -6, -40); c.closePath(); }, '#dc2626', 1.2);
  },
  compositora(c) {
    cdev(c, '#1f2937', SKIN_M, '#facc15');
    shape(c, el(-12, -20, 5, 7, -0.4), '#a16207', 1.6); line(c, [-12, -26, -6, -42], OL, 2); line(c, [-8, -20, -16, -20], '#fde68a', 0.8);
    for (const [x, y] of [[12, -44], [17, -36]]) { otxt(c, '♪', x, y, 9, '#ff9ef0'); }
    shape(c, c => { c.arc(0, -37, 9, Math.PI * 1.05, Math.PI * 1.95); }, null, 2.2); shape(c, el(-9, -36, 2.4, 3.2), '#ff3df0', 1); shape(c, el(9, -36, 2.4, 3.2), '#ff3df0', 1);
  },
  disenadora(c) {
    shape(c, rr(10, -34, 12, 16, 1.6), '#fff6ea', 1.4);
    for (let i = 0; i < 3; i++) line(c, [12, -30 + i * 4, 20, -30 + i * 4], '#93c5fd', 0.9);
    shape(c, rr(13, -27, 3, 3, 0.4), '#7be04a', 0.6); shape(c, rr(17, -23, 3, 3, 0.4), '#ff5f6d', 0.6);
    cdev(c, '#f59e0b', SKIN_D, '#111827');
    shape(c, rr(-5, -24, 10, 8, 1.4), '#fde68a', 1); line(c, [-3, -18, 0, -22, 3, -19], OL, 1);
    shape(c, el(-8, -44, 4.6, 3.4), '#111827', 1.2);
  },
  prototipo(c) {
    shape(c, rr(-20, -58, 40, 46, 8), '#9ca3af', 2.4);
    for (const [x1, y1, x2, y2] of [[-20, -44, 20, -36], [-14, -58, -6, -12]]) { c.globalAlpha = 0.85; line(c, [x1, y1, x2, y2], '#d6d3d1', 6); c.globalAlpha = 1; line(c, [x1, y1, x2, y2], 'rgba(120,113,108,.6)', 1); }
    shape(c, rr(-13, -54, 26, 16, 4), '#1f2937', 1.6);
    shape(c, el(-6, -46, 3.4, 3.8), '#7be04a', 1); shape(c, el(6, -46, 3.4, 3.8), '#7be04a', 1); dot(c, -6, -46, 1.2, OL); dot(c, 6, -46, 1.2, OL);
    otxt(c, 'v0.1', 0, -26, 7, '#ff9a3c');
    line(c, [-20, -40, -28, -30], OL, 4); line(c, [20, -40, 28, -30], OL, 4); shape(c, el(-28, -29, 5, 5), '#9ca3af', 1.4); shape(c, el(28, -29, 5, 5), '#9ca3af', 1.4);
    shape(c, rr(-15, -12, 11, 11, 2), '#78716c', 1.6); shape(c, rr(4, -12, 11, 11, 2), '#78716c', 1.6);
    line(c, [0, -58, 2, -66], OL, 1.6); dot(c, 2.4, -68, 2.2, '#ff9a3c');
  },
  freelance(c) {
    line(c, [-20, -24, -12, -24], 'rgba(255,255,255,.8)', 1.6); line(c, [-22, -16, -13, -16], 'rgba(255,255,255,.8)', 1.6);
    cdev(c, '#475569', SKIN_C, '#57534e');
    shape(c, rr(-16, -24, 10, 14, 2), '#92400e', 1.4); line(c, [-13, -24, -13, -27, -9, -27, -9, -24], OL, 1.2);
    shape(c, rr(6, -22, 14, 9, 1.6), '#1f2937', 1.4); shape(c, rr(7.6, -21, 10.6, 6, 1), '#0ea5e9', 0);
    otxt(c, '€/h', 0, -15, 5, '#fde68a');
  },
  sp_sustituir(c) { spBg(c, 'd'); screenHead(c, 0, -26, 26, 20, '◉_◉'); otxt(c, 'TU SITIO', 0, -10, 6.5, '#fff6ea'); line(c, [-14, -40, 14, -12], '#ff4b5c', 2.6); },
  sp_portfolio(c) { spBg(c, 'd'); for (const [x, y, r] of [[-7, -18, -0.25], [6, -30, 0.2]]) { c.save(); c.translate(x, y); c.rotate(r); shape(c, rr(-11, -8, 22, 16, 2), '#fde68a', 1.6); shape(c, rr(-8, -5, 7, 7, 1), '#7be04a', 0.8); line(c, [1, -4, 8, -4], OL, 1); line(c, [1, 0, 7, 0], OL, 1); c.restore(); } },
  sp_gamejam(c) { spBg(c, 'h'); shape(c, poly(-14, -14, 14, -14, 0, -40), '#fbbf24', 2); for (const [x, y] of [[-4, -22], [4, -24], [0, -30]]) dot(c, x, y, 2.4, '#dc2626'); otxt(c, '48h', 0, -8, 8, '#fff6ea'); },
  sp_creditos(c) { spBg(c, 'c'); shape(c, rr(-14, -42, 28, 34, 3), '#111827', 1.8); for (let i = 0; i < 5; i++) line(c, [-8 + (i % 2) * 2, -36 + i * 6, 8 - (i % 2) * 3, -36 + i * 6], '#fff6ea', 1.4); otxt(c, 'FIN', 0, -12, 7, '#ffe06a'); },
  // edificios de IAhorro: servidores con un ojo
  i_tower(c) {
    shape(c, rr(-20, -8, 40, 8, 2), '#0f172a');
    shape(c, rr(-15, -78, 30, 71, 5), '#1e293b');
    for (let i = 0; i < 6; i++) { shape(c, rr(-11, -72 + i * 10, 22, 6, 1.4), '#334155', 1); dot(c, -7, -69 + i * 10, 1.2, i % 2 ? '#22e3ff' : '#7be04a'); }
    shape(c, rr(-15, -78, 30, 71, 5), null, 2.2);
    shape(c, el(0, -86, 10, 8), '#0f172a');
    const g = c.createRadialGradient(0, -86, 1, 0, -86, 7); g.addColorStop(0, '#fff'); g.addColorStop(0.5, '#22e3ff'); g.addColorStop(1, '#0e7490'); c.fillStyle = g; c.beginPath(); c.arc(0, -86, 6, 0, Math.PI * 2); c.fill();
    dot(c, 0, -86, 2.2, '#0f172a');
  },
  i_base(c) {
    shape(c, rr(-58, -10, 116, 11, 3), '#0f172a');
    shape(c, rr(-52, -70, 104, 61, 7), '#1e293b');
    for (let r2 = 0; r2 < 5; r2++) for (let k = 0; k < 4; k++) { shape(c, rr(-46 + k * 24, -64 + r2 * 11, 20, 7, 1.4), '#334155', 1); dot(c, -42 + k * 24, -60.5 + r2 * 11, 1.2, (r2 + k) % 3 ? '#22e3ff' : '#7be04a'); }
    shape(c, rr(-52, -70, 104, 61, 7), null, 2.2);
    shape(c, rr(-16, -36, 32, 26, 3), '#0f172a', 1.8); otxt(c, 'CERRADO', 0, -22, 6, '#ff4b5c');
    shape(c, rr(-36, -104, 72, 28, 6), '#0f172a', 2);
    otxt(c, 'IAhorro', 0, -90, 13, '#7df3ff');
    line(c, [-24, -76, -24, -70], OL, 2.6); line(c, [24, -76, 24, -70], OL, 2.6);
    shape(c, el(0, -116, 12, 10), '#0f172a', 2);
    const g = c.createRadialGradient(0, -116, 1, 0, -116, 9); g.addColorStop(0, '#fff'); g.addColorStop(0.5, '#22e3ff'); g.addColorStop(1, '#0e7490'); c.fillStyle = g; c.beginPath(); c.arc(0, -116, 8, 0, Math.PI * 2); c.fill();
    dot(c, 0, -116, 3, '#0f172a');
    for (const [x, y] of [[-46, -88], [44, -94]]) { c.save(); c.translate(x, y); c.rotate(x < 0 ? -0.2 : 0.2); shape(c, rr(-11, -6, 22, 12, 2), '#fff6ea', 1.2); otxt(c, x < 0 ? '-300' : 'AHORRO', 0, 0.5, 5, '#dc2626'); c.restore(); }
  },
  // edificios de Los Creadores: un garaje-estudio con carteles hechos a mano
  r_tower(c) {
    shape(c, rr(-20, -8, 40, 8, 2), '#57534e');
    shape(c, rr(-14, -66, 28, 59, 4), '#d6a96a');
    for (let i = 0; i < 5; i++) line(c, [-14, -56 + i * 11, 14, -56 + i * 11], '#a16207', 1);
    shape(c, rr(-14, -66, 28, 59, 4), null, 2.2);
    shape(c, rr(-10, -60, 20, 14, 2), '#1f2937', 1.4); otxt(c, '</>', 0, -53, 6, '#7be04a');
    shape(c, poly(-18, -66, 18, -66, 0, -82), '#7c3aed', 2);
    dot(c, 0, -74, 2.4, '#ff9a3c');
  },
  r_base(c) {
    shape(c, rr(-56, -10, 112, 11, 3), '#57534e');
    shape(c, rr(-50, -62, 100, 53, 6), '#d6a96a');
    for (let i = 0; i < 5; i++) line(c, [-50, -52 + i * 10, 50, -52 + i * 10], '#a16207', 1);
    shape(c, rr(-50, -62, 100, 53, 6), null, 2.2);
    shape(c, poly(-58, -60, 58, -60, 0, -92), '#7c3aed', 2.2);
    shape(c, rr(-18, -40, 36, 31, 3), '#78716c', 1.8); for (let i = 0; i < 4; i++) line(c, [-18, -33 + i * 7, 18, -33 + i * 7], '#57534e', 1.2);
    c.save(); c.translate(-34, -40); c.rotate(-0.12); shape(c, rr(-13, -7, 26, 14, 2), '#fff6ea', 1.4); otxt(c, 'HECHO', 0, -2, 5, '#7c3aed'); otxt(c, 'A MANO', 0, 4, 5, '#7c3aed'); c.restore();
    shape(c, rr(26, -48, 16, 12, 1.6), '#1f2937', 1.4); otxt(c, '♥', 34, -42, 7, '#ff5f6d');
    otxt(c, 'INDIE', 0, -70, 10, '#ffe06a');
  },
});
