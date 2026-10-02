// Fans of Rumble · Progresión y economía: niveles, oro, gemas, gashapón y campaña
'use strict';
/* =========================================================
   PROGRESIÓN Y ECONOMÍA (v0.9): niveles, oro, gemas, gashapón, campaña
   ========================================================= */
const ECON = {
  lvlStep: 0.06, maxLvl: 10,                                                     // +6 % de vida y daño por nivel
  xpNeed:   [0, 50, 100, 175, 300, 500, 800, 1300, 2000, 3200],                  // XP para pasar del nivel i al i+1
  goldCost: [0, 50, 100, 200, 400, 750, 1500, 3000, 6000, 12000],                // oro para pasar del nivel i al i+1
  xpPerPlay: 10, winXpMult: 1.3,                                                 // XP por cada carta jugada; +30 % si ganas
  quick: { easy: 40, normal: 60, lose: 10 },                                     // oro en partida rápida
  camp: { first: [100, 10], replay: 30, stars3: [50, 10], boss: [300, 50], lose: 10 },  // [oro, gemas]
  pull: 50, dupGems: 15,                                                         // gemas por tirada; repetida sin rango que subir = 15 gemas
  odds: { common: 55, rare: 30, epic: 12, legendary: 3 },                        // probabilidades del gashapón (%)
  pityEpic: 10, pityLeg: 50,                                                     // garantía: épica o mejor cada 10, legendaria a las 50
  start: { gold: 150, gems: 100 },
  mission: [50, 10],
  scrap: { common: 25, rare: 60, epic: 150, legendary: 400 },      // oro al despedir una copia (x1 Básica, x1,5 Normal, x2 Buena, x3 Excelente, x5 Perfecta)
  reroll: { common: 250, rare: 500, epic: 1000, legendary: 2000 }, // oro por volver a tirar los números de una copia
  pityQ: 10,                                                       // garantía: calidad Director (excelente) o mejor como mucho cada 10 tiradas
  cardOdds: { rare: 68, epic: 25, legendary: 7 },                  // v0.9.15: gashapón de cartas (hechizos y mata-sanadores)
  starStep: 0.05, maxStars: 5,                                     // cada estrella: +5 % (vida y daño, o fuerza del hechizo)
};
const RARITY = { common: ['Común', '#63cfe0', '#2a7895'], rare: ['Rara', '#ffb04f', '#cf5a16'], epic: ['Épica', '#d08cff', '#6d28c9'], legendary: ['Legendaria', '#ffe06a', '#c47f10'] };
const CARD_RAR = { rare: RARITY.rare, epic: RARITY.epic, legendary: ['Legendaria', '#ff9ef0', '#b0217f'] };   // v0.9.15: colores de las cartas del gashapón
// gashapón de habilidades: una por carta, de cualquier facción; rango 1-3 con las repetidas
const ABILITIES = {
  cafeina:  { name: 'Cafeína', rar: 'common', ic: 'CF', desc: 'Se mueve un {v} % más rápido.', vals: [15, 22, 30] },
  piel:     { name: 'Piel dura', rar: 'common', ic: 'PD', desc: '+{v} % de vida.', vals: [15, 22, 30] },
  punos:    { name: 'Puños de hierro', rar: 'common', ic: 'PH', desc: '+{v} % de daño.', vals: [12, 18, 24] },
  reflejos: { name: 'Reflejos', rar: 'common', ic: 'RF', desc: 'Ataca un {v} % más rápido.', vals: [12, 18, 24] },
  plasma:   { name: 'Escudo de plasma', rar: 'rare', fac: 'ciber', ic: 'EP', desc: 'Escudo del {v} % de su vida que se recarga.', vals: [20, 25, 30] },
  sigilo:   { name: 'Sigilo inicial', rar: 'rare', fac: 'animales', ic: 'SG', desc: 'Sale invisible {v} s y su primer golpe hace el doble.', vals: [5, 7, 9] },
  escarcha: { name: 'Escarcha', rar: 'rare', fac: 'nomuertos', ic: 'ES', desc: 'Sus golpes frenan al enemigo {v} s.', vals: [1, 1.3, 1.6] },
  vampiro:  { name: 'Vampirismo', rar: 'rare', ic: 'VP', desc: 'Se cura el {v} % del daño que hace.', vals: [15, 20, 25] },
  cadena:   { name: 'Rayo en cadena', rar: 'epic', fac: 'heroes', ic: 'RC', desc: 'Cada golpe salta a otro enemigo con el {v} % del daño.', vals: [50, 60, 70] },
  provoca:  { name: 'Provocación', rar: 'epic', fac: 'memes', ic: 'PV', desc: 'Los enemigos cercanos (a {v}) le atacan a él.', vals: [80, 95, 110] },
  renacer:  { name: 'Renacer', rar: 'epic', fac: 'nomuertos', ic: 'RN', desc: 'Revive una vez con el {v} % de su vida.', vals: [40, 50, 60] },
  grito:    { name: 'Grito', rar: 'epic', fac: 'nomuertos', ic: 'GR', desc: 'Cada 9 s aturde {v} s a los enemigos cercanos.', vals: [0.8, 1, 1.2] },
  clon:     { name: 'Clon viral', rar: 'legendary', fac: 'memes', ic: 'CV', desc: 'Al morir se divide en 2 copias pequeñas con el {v} % de su vida. No funciona en los líderes.', vals: [30, 40, 50] },
  furia:    { name: 'Furia legendaria', rar: 'legendary', ic: 'FL', desc: 'Con menos de la mitad de vida: +{v} % de daño y velocidad.', vals: [30, 40, 50] },
  // v0.9.12: habilidades con efectos nuevos
  speedrun:   { name: 'Speedrun', rar: 'common', ic: 'SR', desc: 'Los primeros {v} s va al triple de velocidad.', vals: [2, 3, 4] },
  hitbox:     { name: 'Hitbox dudosa', rar: 'rare', ic: 'HB', desc: 'Esquiva el {v} % de los golpes. Nadie sabe cómo.', vals: [10, 15, 20] },
  microtrans: { name: 'Microtransacción', rar: 'rare', ic: 'MT', desc: 'Al entrar en el campo le roba {v} de CAOS al rival.', vals: [0.5, 0.8, 1.1] },
  ragequit:   { name: 'Rage quit', rar: 'rare', ic: 'RQ', desc: 'Al caer se enfada y explota: {v} de daño alrededor.', vals: [60, 90, 120] },
  modofoto:   { name: 'Modo foto', rar: 'epic', ic: 'MF', desc: 'Al entrar congela {v} s a los enemigos de alrededor. ¡Sonreíd!', vals: [0.8, 1.2, 1.6] },
  dlc:        { name: 'DLC gratis', rar: 'epic', ic: 'DL', desc: 'Al caer te devuelve {v} de CAOS.', vals: [1, 1.5, 2] },
  gigante:    { name: 'Modo gigante', rar: 'legendary', ic: 'MG', desc: 'Se hace enorme: +{v} % de vida y de daño, pero va más lento.', vals: [30, 40, 50] },
  iman:       { name: 'Imán de CAOS', rar: 'legendary', ic: 'IC', desc: 'Cada enemigo que derrota te da {v} de CAOS.', vals: [0.3, 0.45, 0.6] },
};
// gashapón de equipamiento: solo para el líder (arma, cabeza y accesorio)
const SLOTS = { weapon: 'Arma', head: 'Cabeza', acc: 'Accesorio' };
const FAC_ITEM = { animales: 'zanahoria_oro', nomuertos: 'corona_huesos', streamers: 'microfono_oro', heroes: 'yelmo_olimpo', ciber: 'nucleo_plasma', memes: 'gafas_pixel', gamer: 'raton_campeon', olvidados: 'cartucho_dorado', pop: 'claqueta_oro' };   // v0.9.15
const fitsFac = (id, f) => !ITEMS[id] || !ITEMS[id].fac || ITEMS[id].fac === f;
const worldFac = wi => (wi === 0 ? 'animales' : WORLDS[wi].unlock || null);   // de qué facción es el objeto que da el jefe de cada mundo en Difícil
const ITEMS = {   // st: valor central de cada efecto; cada copia sale entre el 50 % y el 150 % de ese valor
  espada_carton: { name: 'Espada de cartón piedra', slot: 'weapon', rar: 'common', st: [10], desc: '+{0} % de daño. Hecha a mano en una convención.' },
  raton_dpi:     { name: 'Ratón de 16.000 DPI', slot: 'weapon', rar: 'rare', st: [20, 10], desc: '+{0} % de alcance y +{1} % de daño.' },
  teclado_rgb:   { name: 'Teclado mecánico RGB', slot: 'weapon', rar: 'epic', st: [25], desc: 'Ataca un {0} % más rápido. Clic, clic, clic.' },
  banhammer_oro: { name: 'BanHammer de oro', slot: 'weapon', rar: 'legendary', st: [25], desc: '+{0} % de daño y cada golpe aparta al enemigo.' },
  cuernos:       { name: 'Casco con cuernos', slot: 'head', rar: 'common', st: [15], desc: '+{0} % de vida.' },
  corona_carton: { name: 'Corona de hamburguesería', slot: 'head', rar: 'rare', st: [10, 10], desc: '+{0} % de vida y +{1} % de daño.' },
  gorro_aluminio:{ name: 'Gorro de papel de aluminio', slot: 'head', rar: 'epic', st: [10], desc: 'Inmune a las habilidades del jefe y +{0} % de vida.' },
  auriculares:   { name: 'Auriculares con cancelación de ruido', slot: 'head', rar: 'legendary', st: [15], desc: 'Inmune a aturdimientos y frenazos, y +{0} % de vida.' },
  taza:          { name: 'Taza del becario', slot: 'acc', rar: 'common', st: [1], desc: 'Se cura un {0} % de su vida cada segundo.' },
  pase_caducado: { name: 'Pase de batalla caducado', slot: 'acc', rar: 'common', st: [3], desc: '+{0} % a todo. Algo es algo.' },
  almohada:      { name: 'Almohada de viaje', slot: 'acc', rar: 'rare', st: [40], desc: 'Si cae, vuelve un {0} % antes.' },
  silla_gamer:   { name: 'Silla gamer portátil', slot: 'acc', rar: 'epic', st: [15], desc: 'Recibe un {0} % menos de daño.' },
  cofre:         { name: 'Cofre de botín sin abrir', slot: 'acc', rar: 'legendary', st: [100], desc: 'Cada partida, un efecto sorpresa (o ninguno) con un {0} % de potencia.' },
  diploma:       { name: 'Diploma de Becario del Mes', slot: 'acc', rar: 'rare', pass: true, st: [8, 8], desc: '+{0} % de vida y +{1} % de daño. Enmarcado en plástico. Exclusivo del pase.' },
  corbata_ceo:   { name: 'Corbata del CEO', slot: 'acc', rar: 'legendary', pass: true, st: [15, 15, 10], desc: '+{0} % de vida, +{1} % de daño y +{2} % de velocidad. Viste como el que te despide. Exclusivo del Pase Ejecutivo.' },
  // v0.9.12: objetos con efectos nuevos
  mando_cable:  { name: 'Mando con cable de 3 metros', slot: 'weapon', rar: 'common', st: [25], desc: '+{0} % de alcance. El cable llega a todas partes.' },
  baguette:     { name: 'Baguette de ayer', slot: 'weapon', rar: 'rare', st: [20], desc: 'El {0} % de sus golpes son críticos y hacen el triple. Está durísima.' },
  lanzaconfeti: { name: 'Lanzaconfeti', slot: 'weapon', rar: 'epic', st: [40], desc: 'Cada golpe salpica el {0} % del daño a los enemigos de alrededor.' },
  gorra_reves:  { name: 'Gorra del revés', slot: 'head', rar: 'common', st: [12], desc: '+{0} % de velocidad. Más estilo, más rápido.' },
  casco_vr:     { name: 'Casco de realidad virtual', slot: 'head', rar: 'rare', st: [25], desc: 'No ve el peligro: +{0} % de daño, pero un 10 % menos de vida.' },
  orejas_gato:  { name: 'Diadema de orejas de gato', slot: 'head', rar: 'epic', st: [20], desc: 'Los enemigos de alrededor pegan un {0} % menos. Es que es muy mono.' },
  bebida_xxl:   { name: 'Bebida energética XXL', slot: 'acc', rar: 'common', st: [30], desc: 'Los primeros 10 s: +{0} % de daño y de velocidad.' },
  disco_fisico: { name: 'Disco físico de coleccionista', slot: 'acc', rar: 'rare', st: [18], desc: '+{0} % de vida. Es suyo para siempre: nadie se lo puede quitar.' },
  alfombrilla:  { name: 'Alfombrilla XXL', slot: 'acc', rar: 'epic', st: [2], desc: 'Los aliados de alrededor se curan un {0} % de su vida cada segundo.' },
  // v0.9.15: objetos de facción: más fuertes, pero solo los puede llevar el líder de su facción
  zanahoria_oro:   { name: 'Zanahoria de oro', slot: 'weapon', rar: 'legendary', fac: 'animales', st: [22, 30], desc: '+{0} % de daño y su Chaos Jump vuelve un {1} % antes.' },
  corona_huesos:   { name: 'Corona de huesos', slot: 'head', rar: 'legendary', fac: 'nomuertos', st: [22, 1.5], desc: '+{0} % de vida y se cura un {1} % de su vida cada segundo.' },
  microfono_oro:   { name: 'Micrófono de oro', slot: 'acc', rar: 'legendary', fac: 'streamers', st: [18, 1.5], desc: '+{0} % de daño y los aliados de alrededor se curan un {1} % cada segundo.' },
  yelmo_olimpo:    { name: 'Yelmo del Olimpo', slot: 'head', rar: 'legendary', fac: 'heroes', st: [20, 14], desc: '+{0} % de vida y recibe un {1} % menos de daño.' },
  nucleo_plasma:   { name: 'Núcleo de plasma', slot: 'acc', rar: 'legendary', fac: 'ciber', st: [45, 15], desc: 'Escudo de plasma del {0} % de su vida y +{1} % de daño.' },
  gafas_pixel:     { name: 'Gafas pixeladas', slot: 'head', rar: 'legendary', fac: 'memes', st: [22, 15], desc: 'El {0} % de sus golpes son críticos (triple) y +{1} % de velocidad. Deal with it.' },
  raton_campeon:   { name: 'Ratón del campeón', slot: 'weapon', rar: 'legendary', fac: 'gamer', st: [28, 25], desc: 'Ataca un {0} % más rápido y +{1} % de alcance.' },
  cartucho_dorado: { name: 'Cartucho dorado', slot: 'acc', rar: 'legendary', fac: 'olvidados', st: [15, 2], desc: '+{0} % de vida y de daño, y las torres tardan {1} s más en acordarse de él.' },
  claqueta_oro:    { name: 'Claqueta de oro', slot: 'weapon', rar: 'legendary', fac: 'pop', st: [18, 35], desc: '+{0} % de daño y cada golpe salpica el {1} % a los de alrededor.' },
  boton_pausa:  { name: 'Botón de pausa', slot: 'acc', rar: 'legendary', st: [3], desc: 'Una vez por vida, cuando va a caer, se pausa y es invulnerable {0} s.' },
};
const COFRE = [[p => `¡+${Math.round(30 * p)} % DE DAÑO!`, (u, p) => { u.mDmg *= 1 + 0.3 * p; }], [p => `¡+${Math.round(40 * p)} % DE VIDA!`, (u, p) => { u.mHp *= 1 + 0.4 * p; }], [() => '¡TURBO!', (u, p) => { u.mSpeed *= 1 + 0.3 * p; u.mCd *= 1 - 0.2 * p; }], [() => '¡REGENERACIÓN!', (u, p) => { u.regen = (u.regen || 0) + 0.02 * p; }], [() => '…estaba vacío', () => {}]];
// v0.9.9: calidad de cada copia. Cada efecto sale entre el 50 % (calidad 0) y el 150 % (calidad 100) de su valor central.
// Básica, Normal, Buena, Excelente o Perfecta; las probabilidades se enseñan en el gashapón.
const QTIERS = [
  { name: 'Becario (básica)', p: 30, lo: 0, hi: 0.4, col: '#b4bccb' },
  { name: 'Junior (normal)', p: 40, lo: 0.4, hi: 0.7, col: '#63cfe0' },
  { name: 'Senior (buena)', p: 20, lo: 0.7, hi: 0.88, col: '#8cf05a' },
  { name: 'Director (excelente)', p: 9, lo: 0.88, hi: 0.99, col: '#e2a8ff' },
  { name: 'CEO (perfecta)', p: 1, lo: 1, hi: 1, col: '#ffcb3d' },
];
const PASS_Q = 0.9;   // los premios del pase salen siempre con calidad Excelente
function rollQ(minTier) {
  const pool = QTIERS.slice(minTier || 0); let x = Math.random() * pool.reduce((a, t) => a + t.p, 0);
  for (const t of pool) { if (x < t.p) return Math.floor((t.lo + Math.random() * (t.hi - t.lo)) * 1000) / 1000; x -= t.p; }
  return 1;
}
const tierOf = q => (q >= 1 ? 4 : q >= 0.88 ? 3 : q >= 0.7 ? 2 : q >= 0.4 ? 1 : 0);
const avgQ = it => it.q.reduce((a, b) => a + b, 0) / it.q.length;
const defOf = it => (it.k === 'ab' ? ABILITIES : ITEMS)[it.id];
const statDec = (id, c) => (id === 'provoca' ? 0 : c < 5 ? 2 : 1);
const statsOf = it => (it.k === 'ab' ? [ABILITIES[it.id].vals[1]] : ITEMS[it.id].st).map(c => ({ c, dec: statDec(it.id, c) }));
const rnd = (v, dec) => { const m = Math.pow(10, dec); return Math.round(v * m) / m; };
const valsOf = it => statsOf(it).map((st, i) => rnd(st.c * (0.5 + (it.q[i] == null ? 0.5 : it.q[i])), st.dec));
// campaña 1 "La Rebelión de los Fans" (mundos 1-8) y campaña 2 "La Era Digital" (9-12): 4 niveles por mundo (el 4.º es el jefe)
const WORLDS = [
  { name: 'Oficinas de Microblizz', efac: 'microblizz', story: 'Microblizz, una empresa millonaria, ha comprado el estudio que hacía tus juegos favoritos. Lo primero: despedir a la gente y poner robots.', levels: [
    { name: 'La compra', elvl: 1, income: 0.6, deck: ['becario', 'starbot'] },
    { name: 'Cartas de despido', elvl: 1, income: 0.65, deck: ['becario', 'starbot', 'fallen'] },
    { name: 'Cierre del estudio', elvl: 1, income: 0.7, deck: ['becario', 'starbot', 'fallen', 'cajabotin'] },
    { name: 'SurvivalBot', elvl: 2, income: 0.75, boss: 'SurvivalBot', deck: ['becario', 'starbot', 'fallen', 'cajabotin'] }] },
  { name: 'Cementerio de juegos', efac: 'nomuertos', unlock: 'nomuertos', story: 'Aquí entierra Microblizz los juegos que cierra. Los No-Muertos trabajan para ellos… sin cobrar.', levels: [
    { name: 'Tumbas sin nombre', elvl: 2, income: 0.5 }, { name: 'Fosa de las horas extra', elvl: 2, income: 0.53 }, { name: 'Mausoleo de juegos cerrados', elvl: 3, income: 0.56 }, { name: 'NecroLord corrupto', elvl: 3, income: 0.55, boss: 'NecroLord corrupto' }] },
  { name: 'Plató Abandonado', efac: 'streamers', unlock: 'streamers', story: 'Un plató vacío. Microblizz compró el canal, echó al público y ahora solo pone anuncios.', levels: [
    { name: 'Directo sin audio', elvl: 3, income: 0.55 }, { name: 'Caída del chat', elvl: 3, income: 0.58 }, { name: 'Oleada de baneos', elvl: 4, income: 0.6 }, { name: 'TwitchKing corrupto', elvl: 4, income: 0.6, boss: 'TwitchKing corrupto' }] },
  { name: 'Olimpo Abandonado', efac: 'heroes', unlock: 'heroes', story: 'Desde que Microblizz compró a los dioses, nadie arregla su juego. Están de muy mal humor.', levels: [
    { name: 'Templo en obras', elvl: 4, income: 0.58 }, { name: 'Laberinto de quejas', elvl: 4, income: 0.6 }, { name: 'Monte olvidado', elvl: 5, income: 0.62 }, { name: 'EpicChampion corrupto', elvl: 5, income: 0.62, boss: 'EpicChampion corrupto' }] },
  { name: 'Sector Neón', efac: 'ciber', unlock: 'ciber', story: 'Una ciudad de neón que Microblizz compró entera. Ahora todo es de pago, hasta las farolas.', levels: [
    { name: 'Callejón de neón', elvl: 5, income: 0.6 }, { name: 'Red de drones', elvl: 5, income: 0.62 }, { name: 'Servidor central', elvl: 6, income: 0.65 }, { name: 'CyberMarine corrupto', elvl: 6, income: 0.64, boss: 'CyberMarine corrupto' }] },
  { name: 'El Foro Infinito', efac: 'memes', unlock: 'memes', story: 'El foro de los fans. Microblizz lo compró, borró las quejas y lo llenó de anuncios.', levels: [
    { name: 'Hilo infinito', elvl: 6, income: 0.62 }, { name: 'Borrado de quejas', elvl: 6, income: 0.65 }, { name: 'Lluvia de anuncios', elvl: 7, income: 0.68 }, { name: 'MemeLord corrupto', elvl: 7, income: 0.68, boss: 'MemeLord corrupto' }] },
  { name: 'Torre de Microblizz', efac: 'microblizz', story: 'La sede de la empresa. En el último piso, el CEO cuenta sus millones mientras decide qué juego cerrar.', levels: [
    { name: 'Recepción', elvl: 7, income: 0.8 }, { name: 'Planta de las cajas de botín', elvl: 8, income: 0.88 }, { name: 'Despacho de los despidos', elvl: 8, income: 0.95 }, { name: 'El CEO de Microblizz', elvl: 9, income: 1, boss: 'El CEO de Microblizz', baseHp: 2600 }] },
  // v0.9.13: epílogo de la campaña 1
  { name: 'El Sótano de Microblizz', efac: 'olvidados', unlock: 'olvidados', story: 'Con el CEO despedido, encuentras una puerta al sótano. Ahí guardaba Microblizz los juegos que canceló antes de que salieran. Llevan años a oscuras… y están muy enfadados.', levels: [
    { name: 'Cajas sin abrir', elvl: 8, income: 0.85 }, { name: 'Proyectos en pausa', elvl: 8, income: 0.88 }, { name: 'La sala de los cancelados', elvl: 9, income: 0.92 }, { name: 'VikingoPerdido corrupto', elvl: 9, income: 0.95, boss: 'VikingoPerdido corrupto' }] },
  // v0.9.13: Campaña 2 «La Era Digital», contra Phony y su PayStation (se abre al ganar al CEO)
  { camp: 2, openAfter: '7-4', name: 'Tiendas sin discos', efac: 'phony', story: 'Phony ha quitado el lector de discos de su consola, la PayStation, para ahorrarse millones. Ahora todo es digital, todo es de alquiler… y lo que compras te lo pueden borrar.', levels: [
    { name: 'La última tienda', elvl: 7, income: 0.75, deck: ['descargabot', 'licenciabot', 'plusbot'] },
    { name: 'Estanterías vacías', elvl: 7, income: 0.8, deck: ['descargabot', 'licenciabot', 'plusbot', 'cobradlc'] },
    { name: 'Devoluciones imposibles', elvl: 8, income: 0.85, deck: ['descargabot', 'licenciabot', 'plusbot', 'cobradlc', 'servidorbot'] },
    { name: 'PayStation sin lector', elvl: 8, income: 0.88, boss: 'PayStation sin lector' }] },
  { camp: 2, name: 'La LAN Party', efac: 'gamer', unlock: 'gamer', story: 'Phony ha comprado los servidores de la comunidad: ahora para jugar online hay que pagar. A los gamers les ha obligado a firmar contratos de exclusividad y ya no juegan por diversión.', levels: [
    { name: 'Mesas sin cables', elvl: 8, income: 0.82 }, { name: 'Torneo de pago', elvl: 8, income: 0.86 }, { name: 'Servidores cerrados', elvl: 9, income: 0.9 }, { name: 'ProGamer corrupto', elvl: 9, income: 0.92, boss: 'ProGamer corrupto' }] },
  { camp: 2, name: 'Estudios Phony', efac: 'pop', unlock: 'pop', story: 'Phony también tiene estudios de cine. Allí solo se ruedan secuelas, remakes y anuncios de la PayStation. Los de Cultura Pop están hartos de repetir la misma película.', levels: [
    { name: 'Rodaje del remake', elvl: 9, income: 0.85 }, { name: 'La secuela de la secuela', elvl: 9, income: 0.9 }, { name: 'Pase de prensa', elvl: 10, income: 0.94 }, { name: 'LaDirectora corrupta', elvl: 10, income: 0.96, boss: 'LaDirectora corrupta' }] },
  { camp: 2, name: 'Sede de Phony', efac: 'phony', story: 'La sede de Phony. En el último piso, el Presidente sube otra vez la suscripción mientras los fans protestan en la puerta. Es hora de recuperar los discos.', levels: [
    { name: 'Atención al cliente', elvl: 9, income: 0.92 }, { name: 'Departamento de precios', elvl: 10, income: 0.96 }, { name: 'Sala de licencias', elvl: 10, income: 1 }, { name: 'El Presidente de Phony', elvl: 10, income: 1.05, boss: 'El Presidente de Phony', baseHp: 2800 }] },
];
const CEO_WI = 6;   // el mundo del CEO de Microblizz (final de la campaña 1)
WORLDS.forEach((w, wi) => w.levels.forEach((l, li) => { l.id = `${wi + 1}-${li + 1}`; l.wi = wi; l.li = li; }));
// misiones diarias: cada día salen 3 de esta lista
const MISSIONS = [
  { id: 'win2', txt: 'Gana 2 partidas', goal: 2, ev: 'win' },
  { id: 'cards20', txt: 'Juega 20 cartas', goal: 20, ev: 'card' },
  { id: 'kills40', txt: 'Derrota a 40 enemigos', goal: 40, ev: 'kill' },
  { id: 'towers3', txt: 'Derriba 3 torres', goal: 3, ev: 'tower' },
  { id: 'stars3', txt: 'Consigue 3 estrellas en la campaña', goal: 3, ev: 'star' },
  { id: 'boss1', txt: 'Juega una partida del Modo Jefe', goal: 1, ev: 'boss' },
  { id: 'pull1', txt: 'Gira una vez el gashapón', goal: 1, ev: 'pull' },
  { id: 'lvl1', txt: 'Sube de nivel una unidad', goal: 1, ev: 'lvlup' },
  { id: 'play3', txt: 'Juega 3 partidas', goal: 3, ev: 'play' },
  { id: 'leader5', txt: 'Saca a tu líder 5 veces', goal: 5, ev: 'leader' },
  { id: 'flawless', txt: 'Gana sin perder ninguna torre', goal: 1, ev: 'flawless' },
  { id: 'camp2', txt: 'Juega 2 partidas de la campaña', goal: 2, ev: 'camp' },
  { id: 'quick2', txt: 'Juega 2 partidas rápidas', goal: 2, ev: 'quick' },
  { id: 'caos120', txt: 'Gasta 120 de CAOS', goal: 120, ev: 'caos' },
  { id: 'base1', txt: 'Tira una base enemiga', goal: 1, ev: 'base' },
  { id: 'facwin', txt: 'Gana una partida con {F}', goal: 1, ev: 'facwin' },
  { id: 'gift', txt: 'Recoge el regalo diario de la tienda', goal: 1, ev: 'gift' },
];
const DAILY_N = 4;
// misiones semanales: se renuevan cada lunes
const WEEKLY = [
  { id: 'wwin', txt: 'Gana 15 partidas', goal: 15, ev: 'win' },
  { id: 'wkill', txt: 'Derrota a 400 enemigos', goal: 400, ev: 'kill' },
  { id: 'wtower', txt: 'Derriba 20 torres', goal: 20, ev: 'tower' },
  { id: 'wstar', txt: 'Consigue 12 estrellas en la campaña', goal: 12, ev: 'star' },
  { id: 'wcard', txt: 'Juega 200 cartas', goal: 200, ev: 'card' },
  { id: 'wboss', txt: 'Juega 3 partidas del Modo Jefe', goal: 3, ev: 'boss' },
  { id: 'wlvl', txt: 'Sube 5 niveles de unidades', goal: 5, ev: 'lvlup' },
  { id: 'wpull', txt: 'Gira 5 veces el gashapón', goal: 5, ev: 'pull' },
  { id: 'wdaily', txt: 'Completa 12 misiones diarias', goal: 12, ev: 'dailydone' },
  { id: 'wflaw', txt: 'Gana 5 partidas sin perder torres', goal: 5, ev: 'flawless' },
];
const WEEKLY_N = 4;
// Modo Jefe: el CEO de Microblizz, sin torres, 3 minutos para hacerle todo el daño posible
const BOSS_MODE = { name: 'El CEO de Microblizz', hp: 12000, time: 240, income: 0.95, tiers: [[1500, 10], [4000, 25], [8000, 50]] };
// v0.9.15: los 12 jefes de la campaña (se abren al ganarles allí; el CEO, siempre), 3 dificultades y 4 minutos
const BOSS_HP = [5000, 6000, 7000, 8000, 9000, 10000, 12000, 12500, 11000, 12500, 13500, 14000];
const BOSS_ART = ['e_base', 'necrolord', 'twitchking', 'epicchampion', 'cybermarine', 'memelord', 'ceo', 'vikingo', 'y_base', 'progamer', 'directora', 'presi'];
const BOSS_SHORT = ['SurvivalBot', 'NecroLord', 'TwitchKing', 'EpicChampion', 'CyberMarine', 'MemeLord', 'El CEO', 'Vikingo', 'PayStation', 'ProGamer', 'Directora', 'Presidente'];
const BDIFF = {
  n: { name: 'Normal', lvl: 0, inc: 1, hp: 1, elite: 1, pay: 1, cd: 14, stun: 2, think: [0.7, 1.3] },
  h: { name: 'Difícil', lvl: 2, inc: 1.2, hp: 1.5, elite: 1.1, pay: 2, gear: 'h', q: 0.6, cd: 12, stun: 2.3, think: [0.5, 1] },
  m: { name: 'Mítica', lvl: 4, inc: 1.4, hp: 2, elite: 1.25, pay: 3, gear: 'm', q: 1, cd: 10, stun: 2.6, think: [0.35, 0.8] },
};
const BOSS_TIERS = [0.25, 0.5, 0.75], BOSS_TGEMS = [5, 10, 15], BOSS_KGEMS = 20, BOSS_KGOLD = 150;   // gemas por llegar al 25/50/75 % y por derrotarlo (x2 en Difícil, x3 en Mítica)
const bossOf = wi => { const L = WORLDS[wi].levels[3]; return { wi, id: L.id, name: L.boss, efac: WORLDS[wi].efac, art: BOSS_ART[wi], short: BOSS_SHORT[wi], inc: Math.min(BOSS_MODE.income, L.income + 0.05) }; };
const bossHp = (wi, d) => Math.round(BOSS_HP[wi] * BDIFF[d || 'n'].hp);
const bossOpen = wi => wi === CEO_WI || !!SAVE.testAll || ['n', 'h', 'm'].some(d => starsD(WORLDS[wi].levels[3].id, d) > 0);

/* ---------- v0.9.5: tienda, pase de batalla y sátira ---------- */
// Tienda de prueba: nada se cobra. Precios orientativos para la 1.0 (decisión de Daniel: el oro se vende)
const SHOP = {
  gold: [
    { id: 'g1', name: 'Puñado de oro', amt: 1000, eur: 0.99, note: 'Para ir tirando.' },
    { id: 'g2', name: 'Saco de oro', amt: 6000, eur: 4.99, note: 'El CEO te lo agradece personalmente (no).' },
    { id: 'g3', name: 'Cofre de oro', amt: 13000, eur: 9.99, note: 'Huele a los millones de Microblizz.' },
    { id: 'g4', name: 'Cámara acorazada', amt: 28000, eur: 19.99, note: 'Incluye la llave. La puerta no.' },
    { id: 'g5', name: 'Bóveda del CEO', amt: 75000, eur: 49.99, note: 'Para subir cartas al 10 sin mirar el precio.' },
  ],
  gems: [
    { id: 'e1', name: 'Bolsita de gemas', amt: 100, eur: 0.99, note: 'Dos tiradas del gashapón.' },
    { id: 'e2', name: 'Puñado de gemas', amt: 550, eur: 4.99, note: 'Brillan más que el futuro de Microblizz.' },
    { id: 'e3', name: 'Saco de gemas', amt: 1200, eur: 9.99, note: '' },
    { id: 'e4', name: 'Cofre de gemas', amt: 2600, eur: 19.99, note: '' },
    { id: 'e5', name: 'Caja fuerte de gemas', amt: 7000, eur: 49.99, note: 'Ni el becario sabe la combinación.' },
  ],
  joke: { name: 'Paquete Millonario', amt: 1000000, was: 500, eur: 100 },
  gift: { gold: 100, gems: 5 },
  starter: { gems: 600, gold: 5000, eur: 4.99 },   // v0.9.11: solo una vez; vale casi el doble que por separado
};
// Pase de batalla: 30 niveles, pista gratis y pista Ejecutiva (de pago simulado)
const PASS = { name: 'Temporada 1: La Gran Compra', sub: 'Dura hasta que Microblizz la cierre', levels: 30, xpPer: 400, eur: 4.99, xpWin: 100, xpLose: 40, xpDaily: 60, xpWeekly: 250 };
function passReward(track, i) {
  if (track === 'free') {
    if (i === PASS.levels) return { item: 'diploma' };
    if (i % 10 === 0) return { tickets: 1 };
    if (i % 3 === 0) return { gems: 15 };
    return { gold: 150 };
  }
  if (i === PASS.levels) return { item: 'corbata_ceo' };
  if (i % 5 === 0) return { tickets: 2 };
  if (i % 2 === 0) return { gems: 30 };
  return { gold: 400 };
}
// frases de despedida al caer (humor)
const QUIPS = {
  microblizz: ['¿Me han despedido?', 'Me llevo la grapadora', '¿Y mi finiquito?', '¿Me puedo quedar la taza?', 'Me cambian por un robot más barato', 'Ocho años aquí y me echan por correo', 'Me faltaban 2 años para ser fijo', '¿Esto cuenta como vacaciones?', 'Error 404: trabajo no encontrado', 'Mi jefe dijo que éramos una familia', 'Dejo el juego a medias', 'El CEO se ha comprado otro yate'],
  corrupt: ['¡Por fin libre!', 'Microblizz me prometió fama', 'Mi contrato tenía letra pequeña', 'Gracias, necesitaba vacaciones', 'Dile a Microblizz que me voy', 'Volveré… en el DLC', '¡Que cierren otro juego, no a mí!'],
  // v0.9.13
  phony: ['¡Mi licencia ha caducado!', 'Me han dado de baja', 'Solo era un alquiler', 'Error: se requiere conexión', 'Vuelvo en la próxima suscripción', 'Me han borrado de la biblioteca', 'Contenido no disponible', 'Pagué 70 € por esto'],
  corruptPh: ['¡Por fin libre!', 'Phony me prometió fama', 'Mi contrato tenía letra pequeña', 'Gracias, necesitaba vacaciones', 'Dile a Phony que me voy', 'Volveré… en el remake', '¡Que suban el precio a otro!'],
  player: ['¡Ha sido el lag!', 'Nerfeadme esto', 'GG', 'Me han reportado', 'Vuelvo en 5 minutos', 'Era un plan', 'Respawn, por favor'],
};
// chat falso en directo
const CHAT_USERS = [['ConejoFan_88', '#ffb04f'], ['LagLord', '#63cfe0'], ['ExDeMicroblizz', '#7da8ff'], ['TioDelPase', '#ffe14d'], ['DespedidoUnLunes', '#ff6b7a'], ['NerfEsto', '#d08cff'], ['GemaPerdida', '#ff8fd8'], ['Ardilla_Rabiosa', '#ff9a3c'], ['ClipItPls', '#9ef07a'], ['MamaDelStreamer', '#fda4af'], ['Becario_42', '#a3e635'], ['ElCEO_Real', '#60a5fa'], ['ZorroSigiloso', '#fb923c'], ['ParcheDia1', '#c4b5fd'], ['CAOSenjoyer', '#e879f9'], ['ModCansado', '#5ef2c0']];
const CHAT = {
  start: ['¡Empieza! A ver si hoy gana alguien que no sea Microblizz', 'primer', 'hola desde el trabajo 👀', 'llego tarde, ¿qué me he perdido?', '¡vamos rebelión!'],
  idle: ['mi abuela juega mejor (y tiene 90 años)', 'POV: eres un becario de Microblizz', 'el chat está más vivo que los servidores de Microblizz', 'yo solo vengo por la música', 'apuesto 100 gemas a que gana', '¿dónde se compra el CAOS?', 'el CEO de Microblizz no sabe jugar a su propio juego', 'esto es mejor que la tele', 'nunca había visto tanto caos junto', 'nerf conejo', '¿esto es pay to win?', '¿cuándo sale para móvil?', 'mi primo trabaja en Microblizz y dice que todo va bien', 'mod, banéalo', 'primera vez aquí, ¿de qué va esto?', 'LOL', '¿quién va ganando?', 'jajaja el becario', 'pon música', '¿se puede jugar con mando?', 'el CEO es mi tío, no digáis nada', 'hype hype hype', '¿alguien ha leído los términos y condiciones?', 'esto es mejor que lo de Microblizz', 'Microblizz ha vuelto a subir el precio de las gemas', '¿el pase de batalla merece la pena?', 'Kappa', 'ese carril está solo', 'más ardillas, menos anuncios', 'Microblizz ha cerrado otro juego hoy', 'Microblizz compró mi juego favorito y lo cerró 😭', '¿cuántos juegos ha cerrado ya Microblizz?'],
  towerP: ['¡a por la siguiente!', 'una torre menos, un despido más para Microblizz', '¡TORRE! 🔥', 'Microblizz: «esa torre nos sobraba»', 'F por la torre', 'clip it!!', 'eso le ha dolido al CEO en la cartera', 'otra torre cerrada, como sus juegos jajaja'],
  towerE: ['eso ha dolido', 'bueno… quedan más torres', 'uff', 'skill issue', 'eso pasa por no comprar el pack', 'F', '¡defiende ese carril!', 'Microblizz lo celebra subiendo los precios'],
  leader: ['¡que salga el jefe!', 'ya viene el bueno', '¡LÍDER EN PISTA!', 'ahora sí'],
  boss: ['¿otra vez despidos?', 'el jefe despide a todo el mundo', 'eso es pay to win', 'el jefe está chetado', 'nerf jefe ya'],
  phase2: ['FASE 2 😱', 'se viene lo gordo', 'se ha enfadado el jefe'],
  x2: ['¡CAOS x2! ahora sí', 'último minuto, nervios', '🍿🍿🍿'],
  win: ['Microblizz va a cerrar este juego por envidia', 'el CEO ha tirado el café al ver esto', 'GG EZ', '¡VAMOOOS!', 'Microblizz dirá que lo tenía planeado', 'clip para TikTok', 'GG WP', '¡fuera robots!'],
  // v0.9.12: el chat comenta lo que pasa en la partida
  deploy: ['¡{X} al campo!', '{X} entra con ganas', 'me encanta {X}', '¿{X}? buena elección', 'con {X} esto se pone interesante', 'allá va {X}'],
  enemyBig: ['¡cuidado, que viene {X}!', 'ojo con ese {X}', 'Microblizz saca a {X}, se viene lo gordo', '{X} en camino, ¡defiende!'],
  multikill: ['¡MULTIKILL! 🔥', '¡triple despido!', 'eso ha sido un recorte de plantilla, pero al revés', 'clip it, clip it', '¡qué limpieza!'],
  leaderDown: ['F por {X} 😢', '{X} vuelve enseguida, tranquilos', 'nooo, {X}', 'se ha caído {X}, ¡aguantad!'],
  eLeaderDown: ['¡adiós, {X}!', '{X}, a la calle', '¡{X} despedido!', 'jajaja {X} fuera'],
  kamikaze: ['¡BOOM! 💥', 'el castor ha cobrado su finiquito', 'eso le ha dolido a la torre', 'boom boom boom'],
  stun: ['¡los ha congelado a todos! 🥶', 'eso es un recorte de movimiento', 'Microblizz: «aquí no se mueve nadie»', 'congelados como el sueldo'],
  full: ['¡gasta el CAOS!', '10 de CAOS y quieto 😴', 'tienes el CAOS a tope, ¡saca algo!', 'ese CAOS no se gasta solo'],
  afk: ['¿AFK?', '¿se ha dormido?', 'hola?? ¿hay alguien jugando?', 'se ha ido a por un café'],
  baseLowE: ['¡que se cae la sede! 🔥', '¡último empujón!', 'la sede está temblando', 'Microblizz ya prepara el comunicado'],
  baseLowP: ['¡defiende la base!', 'esto se pone feo', 'pon algo delante, ¡rápido!', 'que no entren, que no entren'],
  comeback: ['¡REMONTADA! 🔥', '¡empate! ¡qué partida!', 'nunca dudé (mentira)', 'esto no se acaba hasta que se acaba'],
  close: ['esto se decide al final 😬', 'nervios', 'empate y casi sin tiempo', 'que alguien tire una torre ya'],
  heal: ['¡la curandera está en todo!', 'curas gratis, no como en Microblizz', 'menos mal que hay enfermera', 'esa curación ha salvado la partida'],
  stealth: ['¿de dónde ha salido ese?', '¡SORPRESA!', 'nadie lo ha visto venir', 'golpe por la espalda, clásico'],
  revive: ['¡se levanta! 🧟', 'ni muerto se rinde', 'Renacer: el mejor seguro de vida', 'vuelve del más allá'],
  ability: ['eso es una habilidad del gashapón 😮', '¿qué ha sido eso?', 'menuda suerte en las cápsulas', 'esa habilidad está rotísima'],
  hard: ['en Difícil hasta los becarios pegan fuerte', '¿Difícil? a ver cuánto aguanta', 'su líder va equipado hasta los dientes', 'aquí sin subir cartas no se gana'],
  mythic: ['¿Mítica? valiente 😱', 'modo mítico: aquí no gana nadie', 'la ruleta de esta semana es cruel', 'esto es para los que no duermen'],
  lose: ['mañana más', 'Microblizz: «esto lo arreglamos en el próximo parche»', 'GG', 'nerf Microblizz', 'la culpa es del lag', 'en la próxima sí', 'F en el chat', 'compra el pack (es broma)'],
  // v0.9.13
  sequel: ['¡SECUELA! 🎬', 'nadie la pidió, pero ahí está la 2', 'la secuela siempre vuelve', 'esto pide tercera parte'],
  remaster: ['¿otra vez? ¿y a 70 €? 😤', 'remaster = mismo juego, nuevo precio', 'ese robot ya lo había comprado', 'Phony lo vuelve a vender, como siempre'],
  shieldwall: ['¡MURO DE ESCUDOS! 🛡️', 'ese vikingo protege a todos', 'barrera dorada, qué bonito'],
  action: ['¡ACCIÓN! 🎬', 'la Directora lo tiene todo controlado', 'ahora sí, a toda velocidad'],
  expire: ['jajaja, le ha caducado la licencia', 'eso pasa por alquilar', 'ni la licencia les dura', 'contenido no disponible en tu región 😂'],
  sub: ['¿otra vez me cobran? 😡', 'Phony cobrando la suscripción en plena partida', 'pago y pago y sigo sin disco', 'cancela la suscripción, ¡ya!'],
};
// v0.9.13: en la campaña 2 el chat se queja de Phony (estas frases sustituyen a las de Microblizz)
const CHAT_PH = {
  start: ['¡Empieza! A ver si hoy alguien le gana a Phony', 'primer', 'hola desde el trabajo 👀', 'llego tarde, ¿qué me he perdido?', '¡vamos rebelión! #DevolvedLosDiscos'],
  idle: ['mi abuela tenía discos y era feliz', 'POV: eres un becario de Phony', 'el chat está más vivo que los servidores de Phony', 'yo solo vengo por la música', '¿dónde se compra el CAOS? ¿hace falta suscripción?', 'Phony ha subido otra vez la suscripción', 'nerf Phony', '¿esto es pay to win?', 'mod, banéalo', 'LOL', '¿quién va ganando?', 'pon música', '¿la PayStation lee discos? (no)', 'hype hype hype', '¿alguien ha leído los términos de la suscripción?', 'mi juego favorito ha desaparecido de la tienda 😭', 'Kappa', 'ese carril está solo', 'más discos, menos suscripciones', 'Phony ha borrado otra película de mi biblioteca', 'le di a comprar y era un alquiler', 'mi consola vieja sigue funcionando sin internet'],
  towerP: ['¡a por la siguiente!', 'una torre menos para Phony', '¡TORRE! 🔥', 'Phony: «esa torre era una exclusiva temporal»', 'F por la torre', 'clip it!!', 'eso le ha dolido a Phony en la cartera', 'torre cancelada, como mi suscripción'],
  towerE: ['eso ha dolido', 'bueno… quedan más torres', 'uff', 'skill issue', 'eso pasa por no pagar la suscripción', 'F', '¡defiende ese carril!', 'Phony lo celebra subiendo los precios'],
  boss: ['¿otra subida de precios?', 'el jefe cobra hasta por respirar', 'eso es pay to win', 'el jefe está chetado', 'nerf jefe ya'],
  stun: ['¡los ha desconectado a todos! 📵', 'servidores caídos, cómo no', 'Phony: «estamos en mantenimiento»', 'sin conexión, como siempre'],
  baseLowE: ['¡que se cae la sede! 🔥', '¡último empujón!', 'la sede está temblando', 'Phony ya prepara el comunicado'],
  enemyBig: ['¡cuidado, que viene {X}!', 'ojo con ese {X}', 'Phony saca a {X}, se viene lo gordo', '{X} en camino, ¡defiende!'],
  multikill: ['¡MULTIKILL! 🔥', '¡triple cancelación!', 'eso ha sido un reembolso, pero al revés', 'clip it, clip it', '¡qué limpieza!'],
  heal: ['¡la curandera está en todo!', 'curas gratis, sin suscripción', 'menos mal que hay curas', 'esa curación ha salvado la partida'],
  win: ['Phony va a subir la suscripción por envidia', 'el Presidente ha tirado su café', 'GG EZ', '¡VAMOOOS!', '#DevolvedLosDiscos', 'clip para TikTok', 'GG WP', '¡los discos vuelven!'],
  lose: ['mañana más', 'Phony: «lo arreglamos en la próxima suscripción»', 'GG', 'nerf Phony', 'la culpa es de los servidores', 'en la próxima sí', 'F en el chat', 'paga la suscripción (es broma)'],
};
// v0.9.8: el chat habla de tu facción, de la facción enemiga y de cada jefe
const CHAT_FAC = {
  animales: {
    idle: ['¿la ardilla tiene seguro médico?', 'el conejo da miedo, no sé si es de los buenos', 'BoomBeaver: héroe sin capa (ni futuro)', 'Rabia x5 = paz mundial', 'que alguien le quite el café a MadSquirrel', 'la MechaVaca es mi animal espiritual', 'SlyFox ha ido a por tabaco y no vuelve', '¿quién deja a un mapache tirar basura? ah, que es su trabajo', 'más zanahorias para CrazyBunny', 'Animales Locos > cualquier DLC', 'MeerCat cura mejor que mi médico de cabecera'],
    leader: ['¡CONEJO! ¡CONEJO!', 'CrazyBunny ha puesto los ojos en espiral', 'que salte, que salte'],
    towerP: ['¡el castor lo ha vuelto a hacer!', 'rabia nivel: torre derribada', 'esa torre era de madera de pino barato'],
    win: ['la granja le gana al capitalismo', 'zanahorias para todos 🥕', 'el mapache se lleva la basura de Microblizz'],
    lose: ['los animales vuelven a la madriguera 😢', 'el conejo necesita unas vacaciones'],
  },
  nomuertos: {
    idle: ['los zombis de las horas extra tienen mejor horario que yo', '¿Renacer cuenta como horas extra?', 'NecroLord, ¿quieres una bufanda?', 'huele a cripta desde aquí', 'la Banshee necesita un micro con menos ganancia', 'esto me recuerda a cierto rey con corona de pinchos 👀', 'morir y volver: el ciclo de vida de un parche', 'StitchBrute solo quiere abrazos (y torres)', 'esqueletos piratas > esqueletos normales', 'ningún no-muerto ha leído los términos y condiciones'],
    leader: ['¡se levanta el NecroLord!', 'ojo, que invoca', 'el rey de la cripta en directo'],
    towerP: ['torre enviada a la cripta ⚰️', 'RIP torre', 'esa torre no tiene Renacer'],
    win: ['ni la muerte para a estos', 'Microblizz enterrado (otra vez)', 'Renacer GOD'],
    lose: ['vuelta a la tumba… hasta la próxima', 'ni Renacer arregla esto'],
  },
  streamers: {
    idle: ['TwitchKing, ¿me saludas?', 'SUB HYPE', 'cuidado, que el moderador es el BanHammer', 'la madre del streamer cura más que mi seguro', 'ese HypeBeast va con 3 bebidas energéticas', '¡que suene el Hype Train! 🚂', 'dono 5 € si tiras la torre', 'pon la cámara, que no se ve', 'ViralBot me está grabando sin permiso', 'más viewers = más daño, es ciencia'],
    leader: ['¡EN DIRECTO!', 'ha llegado el rey del streaming', 'TwitchKing modo hype ON'],
    towerP: ['¡RAID A LA TORRE!', 'eso va directo a los destacados', 'clip, clip, CLIP'],
    win: ['récord de viewers', 'clip del año', 'el chat ha ganado esta partida'],
    lose: ['se ha caído el directo', 'el chat se va a otro canal 😢'],
  },
  heroes: {
    idle: ['¿Héroes no lo había cerrado Microblizz?', 'el Minotauro aún busca la salida de su laberinto', 'Medusa, unas gafas de sol, por favor', '¡TEAM FIGHT! ¡TEAM FIGHT!', 'los Hoplitas son el grupo de WhatsApp de la familia', 'ThunderGod lleva años pidiendo un parche', 'el querubín me ha enamorado de este juego', 'la ShieldMaiden aguanta más que mi portátil', 'héroes a nivel 5 sin pagar nada', 'esto es más épico que la última cinemática de Microblizz'],
    leader: ['¡HA LLEGADO EL CAMPEÓN!', 'EpicChampion, el carry de la partida', 'que empiece la team fight'],
    towerP: ['¡torre al Olimpo!', 'eso ha sido mitológico', 'XP para todos'],
    win: ['leyendas de verdad', 'los dioses vuelven a casa', 'MVP para todos'],
    lose: ['Microblizz vuelve a cerrar el Olimpo', 'necesitamos un parche urgente'],
  },
  ciber: {
    idle: ['los escudos son mi única defensa contra los lunes', 'HackerKid ha hackeado mi wifi', 'NeonSniper dispara desde la otra punta del mapa', 'en el Sector Neón hay más neón que gente', 'CyberNinja, teletranspórtate a mi trabajo', '¿los NanoBots pagan IVA?', 'StarCraft, ¿eres tú?', 'drones del cielo: envío urgente versión guerra', 'ese mecha tiene más RGB que mi PC', 'beep boop, GG'],
    leader: ['¡Orbital Drop!', 'CyberMarine en el campo: todos a cubierto', 'ese casco tiene wifi'],
    towerP: ['torre desconectada', '404: torre no encontrada', 'firewall atravesado'],
    win: ['sistema de Microblizz hackeado ✅', 'Ctrl+Alt+Victoria', 'firewall de Microblizz 0, rebelión 1'],
    lose: ['pantalla azul…', 'reiniciando la rebelión'],
  },
  memes: {
    idle: ['¿mutación gigante? mi suerte de siempre: normal', 'el RNG manda', 'Stonks 📈', 'such wow, very rumble', 'ChonkCat se ha sentado y no hay quien lo levante', 'TrollBot va ganando sin hacer nada', 'esto es un meme y aun así juega mejor que yo', 'el GifBlaster tiene más GIFs que mi grupo de amigos', 'MemeLord ha vuelto a sacar carta al azar', 'el perrito dice wow, y tiene razón'],
    leader: ['¡MEMELORD! ¡MEMELORD!', 'que saque carta, que saque carta', 'ha llegado el señor de los memes'],
    towerP: ['torre memeada', 'eso merece un GIF', 'stonks ↑'],
    win: ['GG, very victory, much wow', 'stonks para la rebelión 📈', 'Microblizz ha sido memeado'],
    lose: ['not stonks 📉', 'el RNG nos odia'],
  },
  // v0.9.13
  gamer: {
    idle: ['GG desde ya', 'los noobs juegan peor que yo, y mira que es difícil', 'la Recreativa tiene más vidas que yo', 'el Coleccionista tira sus discos… ¡los físicos! 💿', 'nadie corre más que la Speedrunner', 'el Modder arregla lo que Phony rompe', 'RageQuitter, respira hondo', 'Comunidad al máximo = +30 %', 'esto es mejor que cualquier torneo de pago', '¡insert coin!'],
    leader: ['¡PROGAMER! ¡PROGAMER!', 'ha entrado el campeón', 'a ver ese combo'],
    towerP: ['¡GG, torre!', 'speedrun de torre', 'esa torre era de un noob'],
    win: ['GG WP 🎮', 'la comunidad ha hablado', 'y ahora, devolvednos los discos'],
    lose: ['rage quit 😤', 'lag, seguro que es el lag'],
  },
  olvidados: {
    idle: ['¿os acordáis de ellos? yo tampoco', 'el RetroMarine lleva hombreras de 1998', 'TitánBeta: cancelado pero con ganas', 'los SwarmBugs dan un poco de asco, la verdad', 'ese coche tenía un juego increíble (que nunca salió)', 'el GhostAgent está aquí… creo', 'nostalgia nivel: torre que no te ve', 'el VikingoPerdido aún busca la salida del sótano', 'los juegos cancelados también tienen sentimientos', 'esto huele a cartucho viejo'],
    leader: ['¡VIKINGO! ¡VIKINGO!', 'muro de escudos en camino', 'el vikingo ha encontrado la salida'],
    towerP: ['la torre ni lo vio venir', '¿y ese quién era? ¡BUM!', 'nostalgia 1, torre 0'],
    win: ['los cancelados han vuelto', 'nadie se acordaba de ellos… hasta hoy', 'Microblizz, ¿a que ahora sí te acuerdas?'],
    lose: ['vuelta al sótano…', 'otra vez cancelados 😢'],
  },
  pop: {
    idle: ['¿esto es la secuela o el remake?', 'al Kaiju se le ve la cremallera', 'el HéroeDeSaldo vuela con una capa de cortina', 'Spoiler: gana la rebelión (o no)', 'los Extras cobran en bocadillos', 'el Detective ya sabe quién es el culpable: Phony', '¡ACCIÓN! 🎬', 'palomitas listas 🍿', 'esto pide una tercera parte', 'el DobleDeAcción se lleva todos los golpes'],
    leader: ['¡LA DIRECTORA! 🎬', '¡silencio, se rueda!', 'que grite ¡acción!'],
    towerP: ['¡corten! torre derribada', 'escena de acción de 10', 'esa torre era de cartón piedra'],
    win: ['¡y el premio es para…!', 'final feliz 🍿', 'la secuela será aún mejor'],
    lose: ['fracaso de taquilla 📉', 'directa al olvido de las plataformas'],
  },
};
// lo que comenta el chat de la facción enemiga (Microblizz o las corrompidas)
const CHAT_VS = {
  microblizz: ['los becarios de Microblizz trabajan gratis', 'SurvivalBot, ¿quién te ha diseñado?', 'esos servidores gastan más luz que mi pueblo', 'Microblizz despide gente para pagar el yate del CEO', '¿la CajaBotín da algo bueno? (no)', 'el Parche Día 1 pesa 80 GB', 'SoporteBot: «¿ha probado a apagar y encender?»'],
  nomuertos: ['¡libéralos!', 'Microblizz les hace trabajar hasta muertos (literal)', 'ojos rojos = ahora son de Microblizz', 'Microblizz les cobra el alquiler de la tumba'],
  streamers: ['¡libéralos!', 'esos streamers corrompidos solo hacen directos de anuncios', 'el TwitchKing corrupto: «usa mi código de descuento»', 'el chat de ese lado son todo bots'],
  heroes: ['¡libéralos!', 'Microblizz compró a los dioses y dejó de arreglar su juego', 'el Minotauro corrupto se ha perdido en su propio laberinto', 'esa Medusa petrifica con cartas de despido'],
  ciber: ['¡libéralos!', 'Microblizz les ha metido anuncios en el cerebro', 'ese HackerKid ahora trabaja para la empresa', 'la NeonSniper corrupta cobra por disparo'],
  memes: ['¡libéralos!', 'los Memes corrompidos ya no hacen gracia: son anuncios', 'el Stonks corrupto solo sube para el CEO', 'MemeLord corrupto: «este meme es de pago»'],
  // v0.9.13: la comunidad gamer, harta de Phony
  phony: ['¿dónde está mi disco? 😡', 'pagué 80 € por un juego que ya no existe', 'Phony: «el futuro es digital». El futuro es alquilar', 'devolvednos el formato físico', 'sin lector no hay segunda mano ni préstamos', 'mi juego ha desaparecido de la biblioteca de un día para otro', '#DevolvedLosDiscos', 'otra subida de la suscripción…', '¿pagar para jugar online? ¿otra vez?', 'el mando cuesta más que la consola', 'Phony se ahorra millones y nos sube los precios', 'mi colección de discos vale más que toda su consola', 'la caja de mi juego viene vacía, solo trae un código'],
  olvidados: ['¡libéralos!', 'Microblizz los canceló y los encerró en el sótano', 'esos juegos nunca llegaron a salir 😢', 'un MMO entero cancelado… y ahí está, enfadado'],
  gamer: ['¡libéralos!', 'Phony les obliga a jugar con contrato de exclusividad', 'esos gamers ahora pagan por jugar online', 'el ProGamer corrupto ya no saluda al chat'],
  pop: ['¡libéralos!', 'Phony solo les deja rodar remakes', 'todo son secuelas desde que llegó Phony', 'esa película la he visto mil veces'],
};
// frases para cada jefe de mundo (0 = SurvivalBot … 6 = el CEO, que también es el del Modo Jefe)
const CHAT_BOSS = [
  ['SurvivalBot sobrevive a todo menos a las críticas', 'congelar unidades: la única actualización de SurvivalBot en 5 años'],
  ['el NecroLord corrupto despide a los muertos… otra vez', 'eso de congelar es muy de rey exánime'],
  ['TwitchKing corrupto banea a todo el chat', 'ese jefe tiene 3 viewers y son bots'],
  ['EpicChampion corrupto: ahora cobra por pelear', 'el campeón se ha vendido a Microblizz'],
  ['CyberMarine corrupto lleva anuncios en el casco', 'drones de Microblizz con anuncios'],
  ['MemeLord corrupto solo publica memes de empresa', 'el meme del jefe lleva marca de agua'],
  ['el CEO ha venido a cerrar otro juego', 'el CEO cobra más que todo el estudio junto', 'el CEO se ha comprado otro yate con tus gemas', 'esta música me suena del ascensor…'],
  // v0.9.13: mundo 8 y campaña 2
  ['el VikingoPerdido lleva años sin ver la luz', 'ese vikingo se perdió en 1995 y sigue buscando la salida', 'el muro de escudos del jefe es de la beta, seguro que tiene bugs', '¿cuántos juegos guardaba Microblizz en este sótano?'],
  ['una consola sin lector, qué gran invento', 'la PayStation te cobra hasta por mirarla', 'mi consola vieja leía discos y era más feliz', 'la PayStation sin lector cuesta 600 € y no lee nada', '¿y ahora mis discos dónde los meto?'],
  ['el ProGamer corrupto solo juega si le pagan', 'patrocinado por Phony, qué tristeza', 'antes jugaba por diversión 😢', 'lleva el logo de Phony hasta en la frente', 'combo patrocinado por Phony 🙄'],
  ['LaDirectora corrupta solo rueda remakes', 'otra secuela que nadie ha pedido', 'esta película ya la he visto… tres veces', 'LaDirectora corrupta: «¡acción!… y cobrad la entrada»', 'una secuela más y me voy al cine de verdad'],
  ['el Presidente de Phony ha subido la suscripción en directo', '¡devuélvenos los discos!', 'el Presidente cobra hasta el aire que respiras', 'esta música suena a anuncio de consola', 'el Presidente acaba de anunciar la PayStation 7 (sin botones)', '¡que alguien le devuelva los discos a la gente!'],
];
// v0.9.12: frases sobre cada carta cuando la juegas
const CHAT_UNIT = {
  // v0.9.15: mata-sanadores
  huron: ["¡el hurón ninja va a por la enfermera!", "nadie ha visto saltar así a un hurón", "ese hurón ha visto demasiadas pelis"],
  sombra: ["la sombra va directa al sanador 👻", "¿dónde está la sombra? ah, detrás de tu curandera", "ni la sombra cobra en Microblizz"],
  hater: ["ha llegado el hater: BUUUU", "el hater no ha visto el juego pero opina", "ese hater va a por la curandera"],
  arpia: ["¡la arpía viene del cielo!", "la arpía tiene peor humor que el CEO", "ojo con la arpía, va a por el sanador"],
  dron: ["dron cazador en el aire 🚁", "ese dron tiene orden de búsqueda", "el dron ha fichado al sanador"],
  clickbait: ["NO VAS A CREER LO QUE HACE ESTE MEME", "el clickbait ha funcionado, he hecho clic", "número 7: ataca al sanador"],
  campero: ["¡CAMPERO! ¡reportadlo!", "ese arbusto se ha movido", "el campero lleva 20 minutos ahí"],
  espia: ["el espía de un juego que nunca salió", "misión: el sanador. Estado: cancelada… o no", "ese espía lleva gafas de sol de noche"],
  paparazzi: ["¡FLASH! el paparazzi ha pillado al sanador", "el paparazzi no respeta a nadie", "exclusiva: el sanador, sin maquillaje"],
  squirrel: ['¡ardillas con café!', 'dos ardillas, cero paciencia', 'esas ardillas van más rápido que mi wifi'],
  beaver: ['el castor va directo a la torre 💣', 'ese castor no tiene seguro de vida', 'dinamita y ningún plan B'],
  fox: ['el zorro ya ha desaparecido 👀', '¿dónde está el zorro? ¿alguien lo ve?', 'ojo, que el zorro pega x3'],
  meercat: ['llega la enfermera 🩹', 'MeerCat cura gratis, no como el seguro de Microblizz', 'la suricata trae tiritas para todos'],
  junkcoon: ['el mapache ha traído su contenedor', 'reciclaje ofensivo', 'JunkCoon tira basura… a Microblizz'],
  mechavaca: ['¡MECHAVACA! 🐄🤖', 'muuuuu-robot', 'la MechaVaca no frena ni en las curvas'],
  skeleton: ['cuatro esqueletos y ningún contrato', 'huesos baratos, mucho daño', 'esqueletos en fila, como en la oficina'],
  zombie: ['zombis lentos pero cobran horas extra', 'CrunchZombie: el crunch hecho persona', 'tres zombis = un lunes por la mañana'],
  ghostmage: ['un fantasma con varita, lo normal', 'dispara desde lejos, como los jefes por correo'],
  banshee: ['que grite la Banshee 😱', 'Banshee: el despertador de Microblizz'],
  skullknight: ['ese caballero frena a cualquiera', 'caballero sin cabeza (pero con calavera)'],
  stitchbrute: ['StitchBrute viene a dar abrazos tóxicos', 'cosido a mano y con mal olor'],
  subswarm: ['¡llegan los subs!', 'tres subs y un sueño'],
  hypebeast: ['HypeBeast va a toda pastilla', 'ese va con tres bebidas energéticas'],
  viralbot: ['ViralBot va a hacerse viral (aturdiendo)', 'cuidado, que lo graba todo'],
  snackmom: ['SnackMom trae bocatas para todos 🥪', 'la madre del streamer cura mejor que nadie'],
  hypetrain: ['¡CHU CHUUU! a la torre 🚂', 'ese tren no para en ninguna estación'],
  banhammer: ['¡BANEO MASIVO!', 'BanHammer: el moderador que todos temen'],
  cupidarcher: ['flechas de amor (y de daño) 💘', 'Cupido ha venido con mala leche'],
  hoplite: ['hoplitas en formación', 'tres lanzas, cero miedo'],
  shieldmaiden: ['ese escudo es más duro que un lunes', 'ShieldMaiden aguanta lo que le echen'],
  thundergod: ['¡rayo en cadena! ⚡', 'ThunderGod ha venido sin paraguas'],
  medusa: ['no la miréis a los ojos 🐍', 'Medusa: la jefa de personal de los dioses'],
  minotaur: ['el Minotauro viene embistiendo', 'ese toro no entiende de laberintos'],
  nanobot: ['cuatro NanoBots, mil problemas', 'bichitos de metal en camino'],
  cyberninja: ['el ninja se teletransporta; el wifi, no', 'ninja con lag cero'],
  techdroid: ['llega el técnico, y sin cita previa', 'TechDroid lo arregla todo menos mi vida'],
  hackerkid: ['HackerKid va a hackear las torres 💻', 'ese niño ha borrado el servidor de Microblizz'],
  neonsniper: ['francotiradora fluorescente', 'NeonSniper apunta desde casa'],
  siegemech: ['¡artillería pesada! 💥', 'SiegeMech viene a demoler'],
  suchdog: ['such dog, very rápido, wow 🐕', 'dos perritos con ganas'],
  gifblaster: ['ráfaga de gifs en camino', 'GifBlaster dispara en bucle'],
  synthcat: ['gato con sintetizador, lo que faltaba 🎹', 'SynthCat pincha música y daño'],
  trollbot: ['TrollBot va a provocar a todos 😈', 'no le hagáis caso al TrollBot (imposible)'],
  stonks: ['STONKS 📈', 'cuanto más pega, más sube'],
  chonkcat: ['ChonkCat se va a sentar encima de alguien', 'gato gordo, problemas gordos'],
  // v0.9.13
  noobs: ['¡noobs al ataque!', 'tres noobs y ningún plan', 'gorros de hélice en formación'],
  speedrunner: ['¡speedrun! ⏱️', 'se ha saltado medio mapa', 'récord mundial en camino'],
  modder: ['el Modder trae el parche que Phony no hizo', 'arreglos gratis, como debe ser'],
  coleccionista: ['¡discos físicos! 💿', 'el Coleccionista no presta sus juegos: los lanza'],
  ragequitter: ['ojo, que ese explota', 'RageQuitter a punto de tirar el mando'],
  recreativa: ['¡una recreativa con piernas! 🕹️', 'insert coin, insert coin'],
  swarmbug: ['¡bichos! 🐜', 'cuatro bichos con mucha hambre'],
  vikingsquad: ['¡vikingos perdidos!', 'tres vikingos y una brújula rota'],
  retromarine: ['ese marine es de otra década', 'hombreras XXL en camino'],
  ghostagent: ['¿alguien ve al GhostAgent? yo no 👀', 'francotirador invisible, qué miedo'],
  rockracer: ['¡brum, brum! 🏎️', 'ese coche va directo a las torres'],
  titanbeta: ['¡TITÁN! cuidado cuando se enfade', 'un gigante en beta, ¿qué puede salir mal?'],
  extras: ['cuatro extras con espadas de cartón', 'los extras cobran en bocadillos'],
  doble: ['el doble hace todas las escenas peligrosas', '¡acrobacia!'],
  detective: ['el Detective busca pistas 🔍', 'elemental, querido chat'],
  heroe: ['¡HéroeDeSaldo al rescate! (2x1)', 'superhéroe de oferta'],
  spoiler: ['¡no me digas el final!', 'el Spoiler va a destrozar la película'],
  kaiju: ['¡KAIJU! 🦖 (se le ve la cremallera)', 'monstruo de goma en camino'],
};
// nombres del chat según tu facción (se mezclan con los de siempre)
const CHAT_USERS_FAC = {
  animales: [['ArdillaConCafé', '#ff9a3c'], ['ZanahoriaLover', '#ffb04f']], nomuertos: [['LichDeGuardia', '#5ef2a0'], ['Huesitos_99', '#e5e7eb']],
  streamers: [['SubDesde2016', '#c084fc'], ['ModVoluntario', '#22d3ee']], heroes: [['HoplitaDeLunes', '#fcd34d'], ['ZeusSinParche', '#ffe14d']],
  ciber: [['Neo_Neon', '#22e3ff'], ['Root_Admin', '#a3ff7a']], memes: [['DogeFan', '#e8a04a'], ['StonksMaster', '#4ade80']],
  gamer: [['GG_WP_99', '#4ade80'], ['NoobEterno', '#86efac']], olvidados: [['Nostalgico_95', '#ecc98f'], ['CartuchoPerdido', '#d6a96a']], pop: [['PalomitasXL', '#ff9ab8'], ['CinefiloDeSofa', '#fda4af']],
};
// despedidas propias de cada facción (las tuyas y las corrompidas)
const QUIPS_FAC = {
  animales: ['¡Mis bellotas!', 'Decidle a la madriguera que la quiero', 'Era un plan… de ardilla'],
  nomuertos: ['Vuelvo enseguida (literal)', 'Otra vez a la tumba', 'Ya estaba muerto, no cuenta'],
  streamers: ['¡Se me ha caído el directo!', 'Nos vemos en el próximo stream', 'Dadle a like antes de que me vaya'],
  heroes: ['¡Por el Olimpo!', 'Los héroes no mueren, los cierra Microblizz', 'Esto lo arregla un parche'],
  ciber: ['Error crítico del sistema', 'Reiniciando…', 'Batería al 0 %'],
  memes: ['F', 'Me ha tocado la mutación mala', 'Not stonks'],
  gamer: ['GG', 'Me voy, que tengo lag', 'Era mi última vida'],
  olvidados: ['Otra vez al olvido…', 'Nadie se acordará de mí', 'Cancelado de nuevo'],
  pop: ['¡Corten!', 'Volveré en la secuela', 'Eso no estaba en el guion'],
};
const QUIPS_CORRUPT = {
  nomuertos: ['¡Por fin descanso en paz!', 'Microblizz no paga ni a los muertos'],
  streamers: ['¡Por fin sin patrocinadores!', 'Fin del directo patrocinado'],
  heroes: ['¡Libre de Microblizz!', 'Me voy a hacer mi propio juego'],
  ciber: ['Firmware de Microblizz desinstalado', 'Sistema liberado'],
  memes: ['Ya puedo volver a hacer gracia', 'Este meme ya es libre'],
  gamer: ['¡Adiós al contrato de exclusividad!', 'Por fin juego por diversión'],
  olvidados: ['¡Por fin fuera del sótano!', 'Gracias por acordaros de mí'],
  pop: ['¡Se acabaron los remakes!', 'Por fin una película original'],
};
// titulares de broma para compartir
const HEADLINES = {
  win: ['Microblizz pierde {c} torres y el CEO llora en su yate', '{L} humilla a Microblizz; la empresa despide a alguien para compensar', 'Microblizz dice que perder «estaba en el plan»', 'Un jugador gana a Microblizz sin comprar ningún pack. Escándalo', 'Microblizz pierde y cierra otro juego para animarse'],
  lose: ['Microblizz gana una partida y lo celebra subiendo el precio del pase', '{F} cae ante Microblizz: «el problema es que no compraste el pack»', 'Microblizz despide a sus bots tras ganar, por si acaso', 'Microblizz gana y el CEO se compra otro yate'],
  unlock: ['{U} se escapan de Microblizz y piden su finiquito', '{U} dejan Microblizz y se unen a la rebelión'],
  boss: ['{B} recibe {S} de daño y dice que no le ha dolido', '{B} aguanta {S} de daño escondido detrás de su montaña de dinero', '{B} recibe {S} de daño y pide un aumento de sueldo'],
};
const HEADLINES_PH = {
  win: ['Phony pierde {c} torres y sube la suscripción para compensar', '{L} humilla a Phony; la empresa culpa a los discos', 'Phony dice que perder «es una experiencia digital exclusiva»', 'Un jugador gana a Phony sin pagar la suscripción. Escándalo'],
  lose: ['Phony gana una partida y lo celebra subiendo los precios', '{F} cae ante Phony: «el problema es que no tenías suscripción»', 'Phony gana y borra la partida de tu biblioteca, por si acaso'],
  unlock: ['{U} se escapan de Phony y exigen sus discos', '{U} rompen su contrato con Phony y se unen a la rebelión'],
};
const GAME_URL = 'jdanielhl1984-commits.github.io/fans-of-rumble';

/* ---------- guardado (en el navegador; se puede exportar e importar) ---------- */
const SAVE_KEY = 'for-save-1';
const VERSION = '0.9.25';
function newSave() { return { v: 1, gold: ECON.start.gold, gems: ECON.start.gems, units: {}, unlocked: ['animales'], camp: {}, inv: [], invSeq: 0, abEquip: {}, equip: {}, pity: { ab: 0, abL: 0, eq: 0, eqL: 0, qab: 0, qeq: 0, cd: 0, cdL: 0 }, cards: {}, decks: {}, bossRec: {}, bossPay: {}, bossSel: { wi: 6, d: 'n' }, daily: null, weekly: null, tickets: 0, pass: { xp: 0, prem: false, free: [], paid: [] }, giftDay: '', chatOff: false, bestBoss: 0, lastFac: 'animales', tut: { done: false, step: 0 }, tutGift: {}, login: { last: '', day: 0, best: 0 }, stats: {}, achDone: [], achSeen: [], starter: false, speed2: false, seenVer: '', campH: {}, campM: {}, rlWeek: '', mythPrize: {}, facItem: {} }; }
// v0.9.9: antes se guardaba «tengo esta habilidad (rango 1-3)» y «tengo este objeto»; ahora cada copia tiene su calidad.
// Las partidas antiguas se convierten sin perder nada: la habilidad conserva su valor exacto y los objetos quedan como estaban.
function migrateSave(s, raw) {
  if (!Array.isArray(s.inv)) s.inv = [];
  s.invSeq = s.invSeq || s.inv.length;
  const add = (k, id, q) => { const it = { u: 'i' + (++s.invSeq), k, id, q }; s.inv.push(it); return it.u; };
  const has = uid => s.inv.some(it => it.u === uid);
  if (s.abil) {
    const map = {};
    for (const id in s.abil) if (ABILITIES[id]) { const v = ABILITIES[id].vals, r = Math.max(1, Math.min(3, s.abil[id] || 1)); map[id] = add('ab', id, [Math.max(0, Math.min(1, Math.floor((v[r - 1] / v[1] - 0.5) * 1000) / 1000))]); }
    for (const k in s.abEquip || {}) { const v = s.abEquip[k]; if (map[v]) s.abEquip[k] = map[v]; else if (!has(v)) delete s.abEquip[k]; }
    delete s.abil;
  }
  if (s.items) {
    const map = {};
    for (const id in s.items) if (ITEMS[id]) map[id] = add('eq', id, ITEMS[id].st.map(() => (ITEMS[id].pass ? PASS_Q : 0.5)));
    for (const f in s.equip || {}) for (const sl in s.equip[f]) { const v = s.equip[f][sl]; if (map[v]) s.equip[f][sl] = map[v]; else if (!has(v)) delete s.equip[f][sl]; }
    delete s.items;
  }
  s.abEquip = s.abEquip || {}; s.equip = s.equip || {};
  s.pity = Object.assign({ ab: 0, abL: 0, eq: 0, eqL: 0, qab: 0, qeq: 0, cd: 0, cdL: 0 }, s.pity || {});
  s.cards = s.cards || {}; s.decks = s.decks || {};   // v0.9.15: cartas del gashapón (copias y estrellas) y mazos
  s.bossRec = s.bossRec || {}; s.bossPay = s.bossPay || {}; s.bossSel = s.bossSel || { wi: 6, d: 'n' };   // v0.9.15: Modo Jefe por jefe y dificultad
  if (s.bestBoss && !s.bossRec['6n']) s.bossRec['6n'] = s.bestBoss;
  if (s.bossTier && !s.bossPay['6n']) s.bossPay['6n'] = (1 << Math.min(3, s.bossTier)) - 1;
  // v0.9.11: logros, premio diario y partida guiada. Quien ya jugaba antes no repite el tutorial.
  s.stats = s.stats || {}; s.achDone = s.achDone || []; s.achSeen = s.achSeen || []; s.tutGift = s.tutGift || {};
  s.login = Object.assign({ last: '', day: 0, best: 0 }, s.login || {});
  if (raw && !raw.tut) {
    const played = Object.keys(s.camp || {}).length > 0 || (s.inv || []).length > 0 || (s.pass && s.pass.xp > 0) || (s.unlocked || []).length > 1 || Object.values(s.units || {}).some(u => u && (u.lvl > 1 || u.xp > 0));
    s.tut = { done: played, step: played ? 3 : 0 };
    if (played) {   // lo que ya se puede contar para los logros
      s.stats.unlock = Math.max(s.stats.unlock || 0, (s.unlocked || []).length - 1);
      s.stats.lvlup = Math.max(s.stats.lvlup || 0, Object.values(s.units || {}).reduce((a, u) => a + Math.max(0, ((u && u.lvl) || 1) - 1), 0));
      if ((s.camp || {})['7-4']) s.stats.ceo = Math.max(s.stats.ceo || 0, 1);
    }
  }
  s.tut = Object.assign({ done: false, step: 0 }, s.tut || {});
  s.campH = s.campH || {}; s.campM = s.campM || {}; s.mythPrize = s.mythPrize || {};   // v0.9.12: Difícil y Mítica
  return s;
}
function loadSave() {
  try { const t = localStorage.getItem(SAVE_KEY); if (t) { const o = JSON.parse(t); if (o && o.v === 1) return migrateSave(Object.assign(newSave(), o), o); } } catch (e) { /* storage blocked */ }
  return newSave();
}
let SAVE = loadSave();
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE)); } catch (e) { /* storage blocked: progress lives in memory */ } }
const uSave = k => (SAVE.units[k] || (SAVE.units[k] = { lvl: 1, xp: 0 }));
const isUnlocked = f => SAVE.unlocked.includes(f);
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
const OL = '#20102c';
const FONT_D = '"Luckiest Guy", "Arial Black", Impact, sans-serif';
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- utils ---------- */
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const other = t => (t === 'p' ? 'e' : 'p');
const pick = a => a[(Math.random() * a.length) | 0];
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
// v0.9.14: los sanadores curan en un cono de 90° hacia delante y se quedan a esta distancia detrás de la unidad que siguen
const HEAL_CONE = Math.PI / 2, HEAL_COS = Math.cos(HEAL_CONE / 2), HEAL_BACK = 58;
const edgeDist = (a, b) => dist(a, b) - a.r - b.r;
const nearestBridge = x => BRIDGES.reduce((b, c) => (Math.abs(x - c) < Math.abs(x - b) ? c : b), BRIDGES[0]);
const laneBridge = i => (i === 0 ? BRIDGES[0] : BRIDGES[BRIDGES.length - 1]);   // v0.9.19: el puente del carril izquierdo (0) o derecho (1)
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function rrPath(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

