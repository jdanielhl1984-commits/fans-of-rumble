// Fans of Rumble · Balance: vida, daño, costes de CAOS y demás números de cada carta, facción y torre
'use strict';
/* =========================================================
   CONFIG: every balance number lives here
   ========================================================= */
const W = 540, H = 960, RES = 3, BG_RES = 2;
const TRAY_Y = 790;
const FIELD_DY = 40;   // v0.9.11: el campo se dibuja 40 px más abajo para que la base enemiga no quede bajo el marcador
const RIVER = { y: 420, top: 401, bottom: 439 };
const BRIDGES = [110, 430];   // v0.9.19: los campos de jefe pueden cambiar cuántos puentes hay y dónde (ver 17-campos.js)
const BASE_BRIDGES = [110, 430];
let RIVER_OPEN = false;      // v0.9.19: río helado: se puede cruzar por cualquier sitio
let BRIDGE_STYLE = null;     // v0.9.19: colores de los puentes (null = madera)
const BRIDGE_HALF = 27;
const BOUNDS = { x0: 18, x1: 522, y0: 66, y1: 782 };
const ZONE = { p: { y0: 452, y1: 738 }, e: { y0: 72, y1: 388 } };

// v0.9.20: ajuste de equilibrio por facción, medido con miles de partidas automáticas (facción contra facción).
// Multiplica la vida (hp) y el daño (dmg) de TODAS las unidades de esa facción, juegue quien juegue con ella. 1 = sin cambios.
const FAC_BAL = {
  animales:  { hp: 1.32, dmg: 1.25 },
  nomuertos: { hp: 0.80, dmg: 0.88 },
  streamers: { hp: 1.00, dmg: 1.00 },
  heroes:    { hp: 1.05, dmg: 1.04 },
  ciber:     { hp: 0.95, dmg: 0.94 },
  memes:     { hp: 0.92, dmg: 0.94 },
  gamer:     { hp: 1.38, dmg: 1.33 },
  olvidados: { hp: 1.07, dmg: 1.06 },
  pop:       { hp: 1.09, dmg: 1.08 },
};
const CFG = {
  matchTime: 240,          // 4:00
  doubleAt: 60,            // último minuto: CAOS x2
  chaosStart: 5,
  chaosMax: 10,
  chaosEvery: 2.8,         // segundos por punto de CAOS
  // pasivas de facción
  passives: {
    animales:  { name: 'RABIA', radius: 85, perAlly: 0.10, maxStacks: 5 },   // +10 % de daño por aliado cerca, máx +50 %
    nomuertos: { name: 'RENACER', hpFrac: 0.6, delay: 1.1 },                 // cada unidad revive una vez con el 60 % de vida
    streamers: { name: 'HYPE', per: 3, step: 0.05, max: 5 },                 // cada 5 bajas, +5 % de velocidad de ataque (máx +25 %)
    heroes:    { name: 'EXPERIENCIA', per: 3, step: 0.05, max: 5 },           // cada 4 bajas, +5 % de vida y daño (máx nivel 5)
    ciber:     { name: 'ESCUDOS', frac: 0.25, delay: 3, regen: 0.5 },         // escudo del 25 % de la vida; se recarga tras 3 s sin daño
    memes:     { name: 'RNG', muts: [                                         // mutación al azar al salir
      { id: 'giant', txt: '¡GIGANTE!', color: '#ffb347', hp: 1.5, dmg: 1.25, speed: 0.85, cd: 1, scale: 1.3 },
      { id: 'turbo', txt: '¡TURBO!', color: '#ffe14d', hp: 1, dmg: 1, speed: 1.4, cd: 0.75, scale: 1 },
      { id: 'glass', txt: '¡DE CRISTAL!', color: '#9ff0ff', hp: 0.6, dmg: 1.6, speed: 1, cd: 1, scale: 1 },
      { id: 'normal', txt: 'normal…', color: '#d1d5db', hp: 1, dmg: 1, speed: 1, cd: 1, scale: 1 },
    ] },
    e: { name: 'DESPIDOS RENTABLES', refund: 0.4 },                          // cada bot despedido devuelve el 40 % de su coste
    // v0.9.13
    olvidados: { name: 'NOSTALGIA', t: 3 },                                  // las torres enemigas tardan 3 s en acordarse de cada unidad
    pop: { name: 'SECUELA', chance: 0.3, hp: 0.5, scale: 0.82 },             // 3 de cada 10 vuelven en versión «2», más pequeña y con media vida
    gamer: { name: 'COMUNIDAD', step: 0.05, max: 6 },                        // +5 % de daño por cada tipo distinto de unidad en el campo (hasta +30 %)
    phony: { name: 'SUSCRIPCIÓN OBLIGATORIA', every: 20, take: 0.5, gain: 1 },   // cada 20 s te cobra 0,5 de CAOS
  },
  // mazo: 1 líder + 6 unidades
  cards: {
    bunny:     { name: 'CrazyBunny',  cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'Chaos Jump', desc: 'Salta sobre el grupo enemigo más grande y hace 50 de daño en área cada 8 s. Si cae, vuelve a los 12 s.' },
    squirrel:  { name: 'MadSquirrel', cost: 2, count: 2, rarity: 'common', rar: 'Común', tag: 'Rápidas · x2', desc: 'Salen dos. Rápidas y frágiles: perfectas para distraer a las torres.' },
    beaver:    { name: 'BoomBeaver',  cost: 2, count: 1, rarity: 'common', rar: 'Común', tag: 'Kamikaze', desc: 'Corre a la torre más cercana con dinamita y explota: 180 al edificio. Él no sobrevive, claro.' },
    fox:       { name: 'SlyFox',      cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Invisible · x3', desc: 'Invisible hasta que ataca. Su primer golpe hace el triple y, si mata, vuelve a desaparecer.' },
    meercat:   { name: 'MeerCat',     cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Cura aliados', desc: 'Enfermera con alas de ángel. Va detrás de tus tropas y cura a las que tiene delante. Casi no pega.' },
    junkcoon:  { name: 'JunkCoon',    cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Daño en área', desc: 'Lanza bolsas de basura explosivas desde lejos. Ideal contra grupos de becarios.' },
    mechavaca: { name: 'MechaVaca',   cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Tanque + vaca', desc: 'Una vaca en un mecha rosa. Aguanta muchísimo y, cuando el mecha revienta, la vaca sale y sigue peleando.' },
    // No-Muertos
    necrolord:   { name: 'NecroLord',    cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'Invoca', desc: 'Lanza rayos de sombra y cada 8 s levanta 2 esqueletos a su lado. Si cae del todo, vuelve a los 12 s.' },
    skeleton:    { name: 'SkeletonCrew', cost: 2, count: 4, rarity: 'common', rar: 'Común', tag: 'Salen 4', desc: 'Cuatro esqueletos piratas, frágiles y muy rápidos. Rodean al enemigo y distraen a las torres.' },
    zombie:      { name: 'CrunchZombie', cost: 3, count: 3, rarity: 'common', rar: 'Común', tag: 'Lentos · x3', desc: 'Tres programadores convertidos en zombis por trabajar meses sin parar. Lentos pero duros, y no se quejan.' },
    ghostmage:   { name: 'GhostMage',    cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'A distancia', desc: 'Mago fantasma que lanza rayos de escarcha desde lejos. Cada impacto frena al enemigo.' },
    banshee:     { name: 'Banshee',      cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Grito aturde', desc: 'Grita cada 7 s y aturde a los enemigos cercanos. Entre grito y grito, lanza ondas que golpean en área.' },
    skullknight: { name: 'SkullKnight',  cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Ralentiza', desc: 'Caballero esqueleto con espada rúnica de hielo: cada golpe frena al enemigo.' },
    // Streamers
    twitchking:  { name: 'TwitchKing',   cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'En directo', desc: 'El rey del directo. Mientras siga en pie, los aliados que tiene cerca pegan un 30 % más.' },
    subswarm:    { name: 'SubSwarm',     cost: 2, count: 3, rarity: 'common', rar: 'Común', tag: 'Salen 3', desc: 'Tres suscriptores con dedo de espuma. Frágiles, rápidos y muy entregados.' },
    hypebeast:   { name: 'HypeBeast',    cost: 3, count: 1, rarity: 'common', rar: 'Común', tag: 'Rápido', desc: 'Fan con ropa de marca y hasta arriba de bebida energética. Pega rapidísimo.' },
    viralbot:    { name: 'ViralBot',     cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Aturde', desc: 'Cámara voladora que graba clips: cada disparo aturde un instante al objetivo.' },
    snackmom:    { name: 'SnackMom',     cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Cura aliados', desc: 'La madre del streamer va detrás de tus tropas y reparte bocadillos a las que tiene delante.' },
    hypetrain:   { name: 'HypeTrain',    cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Rompe torres', desc: 'El tren del hype va directo a por los edificios. No hay quien lo pare.' },
    banhammer:   { name: 'BanHammer',    cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Área · empuja', desc: 'El moderador. Aguanta muchísimo y cada martillazo golpea en área y aparta a los enemigos.' },
    // Héroes
    epicchampion:{ name: 'EpicChampion', cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'Team Fight', desc: 'Cada 8 s grita ¡Team Fight! y todos los aliados cercanos dan a la vez un golpe extra con +50 % de daño.' },
    cupidarcher: { name: 'CupidArcher',  cost: 2, count: 1, rarity: 'common', rar: 'Común', tag: 'A distancia', desc: 'Un querubín con arco que dispara flechas rápidas desde lejos.' },
    hoplite:     { name: 'Hoplites',     cost: 3, count: 3, rarity: 'common', rar: 'Común', tag: 'Lanzas · x3', desc: 'Tres soldados con escudo y lanza larga. Aguantan bien en grupo.' },
    shieldmaiden:{ name: 'ShieldMaiden', cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Blindada', desc: 'Valquiria con escudo: recibe un 35 % menos de daño. Perfecta para ir delante.' },
    thundergod:  { name: 'ThunderGod',   cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Rayo en cadena', desc: 'Dios del trueno: su rayo salta del objetivo a otros 2 enemigos cercanos.' },
    medusa:      { name: 'Medusa',       cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Petrifica', desc: 'Cada 8 s se baja las gafas de sol y petrifica a los enemigos cercanos.' },
    minotaur:    { name: 'Minotaur',     cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Embestida', desc: 'Mole con hacha doble. Si llega corriendo, su primer golpe hace más del doble y aturde.' },
    // Ciberpunks
    cybermarine: { name: 'CyberMarine',  cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'Orbital Drop', desc: 'Marine con armadura y fusil rápido. Cada 9 s le caen del cielo 2 drones de apoyo.' },
    nanobot:     { name: 'NanoBots',     cost: 2, count: 4, rarity: 'common', rar: 'Común', tag: 'Salen 4', desc: 'Cuatro robots diminutos y rápidos que rodean al enemigo.' },
    cyberninja:  { name: 'CyberNinja',   cost: 3, count: 1, rarity: 'common', rar: 'Común', tag: 'Teletransporte', desc: 'Ninja con katana de neón: cada 5 s se teletransporta hacia su objetivo.' },
    techdroid:   { name: 'TechDroid',    cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Repara', desc: 'Droide de soporte: va detrás de tus tropas y repara a las que tiene delante.' },
    hackerkid:   { name: 'HackerKid',    cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Hackea torres', desc: 'Cada 8 s hackea la torre enemiga más cercana y la deja 3,5 s sin disparar.' },
    neonsniper:  { name: 'NeonSniper',   cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Francotiradora', desc: 'Dispara muy despacio, pero desde muy lejos y con muchísimo daño.' },
    siegemech:   { name: 'SiegeMech',    cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Artillería', desc: 'Mecha de asedio con cañón: daño en área desde lejos. Lento pero demoledor.' },
    // Memes
    memelord:    { name: 'MemeLord',     cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'Carta viral', desc: 'Cada 7 s juega una carta al azar: curación, aturdir, bola de fuego o invocar perros.' },
    suchdog:     { name: 'SuchDog',      cost: 2, count: 2, rarity: 'common', rar: 'Común', tag: 'Rápidos · x2', desc: 'Dos perros muy wow. Corren mucho y muerden más.' },
    gifblaster:  { name: 'GifBlaster',   cost: 3, count: 1, rarity: 'common', rar: 'Común', tag: 'Ráfagas', desc: 'Dispara GIFs en bucle a toda velocidad. Poco daño por disparo, pero no para.' },
    synthcat:    { name: 'SynthCat',     cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Daño en área', desc: 'Un gato con teclado: sus notas explotan en área. Nadie sabe por qué.' },
    trollbot:    { name: 'TrollBot',     cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Provoca', desc: 'Obliga a los enemigos y torres cercanos a atacarle a él. Aguanta y se ríe.' },
    stonks:      { name: 'Stonks',       cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Rompe torres', desc: 'Ejecutivo que solo ataca edificios: cada golpe pega un 15 % más que el anterior.' },
    chonkcat:    { name: 'ChonkCat',     cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Aplasta', desc: 'Un gato enorme. Cada 6 s se sienta encima de los enemigos cercanos y los aturde.' },
    stitchbrute: { name: 'StitchBrute',  cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Tanque tóxico', desc: 'Una mole cosida a trozos que va directa a por las torres. Aguanta muchísimo y, al morir, revienta en una nube tóxica.' },
    // Comunidad Gamer (v0.9.13)
    progamer:    { name: 'ProGamer',     cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'Combo', desc: 'Campeón de torneos con un teclado como espada. Ataca rapidísimo y cada 4.º golpe es un ¡COMBO!: triple de daño y aturde. Si cae, vuelve a los 12 s.' },
    noobs:       { name: 'Noobs',        cost: 2, count: 3, rarity: 'common', rar: 'Común', tag: 'Salen 3', desc: 'Tres novatos con gorro de hélice. No saben jugar, pero le ponen muchas ganas.' },
    speedrunner: { name: 'Speedrunner',  cost: 3, count: 1, rarity: 'common', rar: 'Común', tag: 'Rompe torres', desc: 'Se salta a los enemigos (como en sus partidas) y corre directa a por las torres. Nadie corre más que ella.' },
    modder:      { name: 'Modder',       cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Repara', desc: 'Arregla el juego mejor que la empresa: va detrás de tus tropas y repara a las que tiene delante.' },
    coleccionista:{ name: 'Coleccionista', cost: 4, count: 1, rarity: 'rare', rar: 'Rara',  tag: 'Disco que rebota', desc: 'Lanza sus juegos en disco (los físicos, los de verdad). Cada disco rebota a otro enemigo cercano.' },
    ragequitter: { name: 'RageQuitter',  cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Explota al caer', desc: 'Pierde y se enfada. Al caer, tira el mando y explota: 100 de daño a los enemigos de alrededor.' },
    recreativa:  { name: 'Recreativa',   cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Tanque + noobs', desc: 'Una máquina arcade con piernas. Aguanta muchísimo y, cuando cae, salen 2 noobs a seguir jugando.' },
    // Olvidados (v0.9.13)
    vikingo:     { name: 'VikingoPerdido', cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: 'Muro de escudos', desc: 'Lleva años perdido en el sótano. Cada 8 s levanta un muro de escudos: él y sus aliados cercanos reciben una barrera dorada que para 80 de daño. Si cae, vuelve a los 12 s.' },
    swarmbug:    { name: 'SwarmBugs',    cost: 2, count: 4, rarity: 'common', rar: 'Común', tag: 'Salen 4', desc: 'Cuatro bichos de un juego de estrategia que nunca salió. Rapidísimos y con muchas ganas de morder.' },
    vikingsquad: { name: 'Vikingos',     cost: 3, count: 3, rarity: 'common', rar: 'Común', tag: 'Salen 3', desc: 'Tres vikingos que se perdieron en un juego cancelado. Con escudo y espada, aguantan bien en grupo.' },
    retromarine: { name: 'RetroMarine',  cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Ráfagas', desc: 'Marine espacial de 1998 con hombreras enormes. Dispara ráfagas rapidísimas desde lejos.' },
    ghostagent:  { name: 'GhostAgent',   cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Invisible · francotirador', desc: 'Agente de un juego que se canceló en secreto. Sale invisible y su primer disparo hace el doble. Si derriba a alguien, vuelve a desaparecer.' },
    rockracer:   { name: 'RockRacer',    cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Rompe torres', desc: 'Un coche de carreras con lanzamisiles. Corre muchísimo y solo dispara a los edificios.' },
    titanbeta:   { name: 'TitánBeta',    cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Furia', desc: 'Un gigante de un juego que se quedó en la beta. Con menos de la mitad de vida se enfada: pega un 50 % más y anda más rápido.' },
    // Cultura Pop (v0.9.13)
    directora:   { name: 'LaDirectora',  cost: 5, count: 1, respawn: 12, rarity: 'leader', rar: 'Líder', tag: '¡Acción!', desc: 'Dirige la batalla con su megáfono. Cada 8 s grita ¡ACCIÓN! y sus aliados cercanos atacan un 40 % más rápido y corren más durante 4 s. Si cae, vuelve a los 12 s.' },
    extras:      { name: 'Extras',       cost: 2, count: 4, rarity: 'common', rar: 'Común', tag: 'Salen 4', desc: 'Cuatro extras con disfraz de cartón. Cobran poco y se caen enseguida, pero distraen a las torres.' },
    doble:       { name: 'DobleDeAcción', cost: 3, count: 1, rarity: 'common', rar: 'Común', tag: 'Acrobacias', desc: 'El doble que rueda las escenas peligrosas. Cada 5 s da un salto acrobático hasta su objetivo.' },
    detective:   { name: 'Detective',    cost: 3, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Marca al enemigo', desc: 'Encuentra el punto débil: cada disparo marca al enemigo 4 s y todo tu equipo le hace un 25 % más de daño.' },
    heroe:       { name: 'HéroeDeSaldo', cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Vuela · blindado', desc: 'Superhéroe de película barata, con capa de cortina. Vuela y recibe un 30 % menos de daño.' },
    spoiler:     { name: 'Spoiler',      cost: 4, count: 1, rarity: 'rare',   rar: 'Rara',  tag: 'Aturde', desc: 'Grita el final de la película cada 7 s: los enemigos cercanos se quedan en shock 1,3 s. Entre grito y grito, tira periódicos.' },
    kaiju:       { name: 'KaijuDeGoma',  cost: 5, count: 1, rarity: 'epic',   rar: 'Épica', tag: 'Rompe torres · pisotón', desc: 'Un monstruo de película (es un actor con un disfraz de goma). Va a por los edificios y cada pisotón da también a los enemigos de alrededor.' },
    // v0.9.15: gashapón de cartas: un mata-sanadores y 3 hechizos por facción
    huron: { name: "HurónNinja", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Ninja del bosque: salta por encima de la primera línea y cae junto al sanador o al tirador enemigo. A esos les hace el doble de daño.", gacha: true, fac: 'animales' },
    sombra: { name: "Sombra", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Una sombra sin cara: se desliza por encima de la pelea y cae junto al sanador o al tirador enemigo. A esos les hace el doble de daño.", gacha: true, fac: 'nomuertos' },
    hater: { name: "Hater", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Escribe «ESTO ES MALÍSIMO» y salta a por el sanador o el tirador enemigo. A esos les hace el doble de daño.", gacha: true, fac: 'streamers' },
    arpia: { name: "Arpía", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Mitad pájaro y muy mal humor: vuela por encima de la pelea y cae sobre el sanador o el tirador enemigo. A esos les hace el doble de daño.", gacha: true, fac: 'heroes' },
    dron: { name: "DronCazador", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Dron de caza: vuela por encima de la pelea y se lanza a por el sanador o el tirador enemigo. A esos les hace el doble de daño.", gacha: true, fac: 'ciber' },
    clickbait: { name: "Clickbait", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "«¡NO VAS A CREER A QUIÉN ATACA!»: salta a por el sanador o el tirador enemigo. A esos les hace el doble de daño.", gacha: true, fac: 'memes' },
    campero: { name: "Campero", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Sale escondido en un arbusto y, cuando ve a un sanador o a un tirador, salta a por él. A esos les hace el doble de daño.", gacha: true, fac: 'gamer' },
    espia: { name: "EspíaCancelado", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Protagonista de un juego de espías que nunca salió: salta por encima de la pelea y cae junto al sanador o al tirador enemigo. A esos les hace el doble de daño.", gacha: true, fac: 'olvidados' },
    paparazzi: { name: "Paparazzi", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Mata-sanadores', desc: "Salta a por el sanador o el tirador enemigo y lo deslumbra con el flash (1 s sin moverse). A esos les hace el doble de daño.", gacha: true, fac: 'pop' },
    sp_bellotas: { name: "Lluvia de bellotas", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Una tormenta de bellotas cae sobre la zona: 150 de daño a los enemigos (y un poco a los edificios).", gacha: true, fac: 'animales', spell: { side: "foe", kind: "dmg", r: 80, amt: 150, bld: 0.35, fx: "acorn", col: "#c0742e" } },
    sp_botiquin: { name: "Botiquín del bosque", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "Tiritas, hojas y mucho cariño: cura 170 a tus tropas de la zona.", gacha: true, fac: 'animales', spell: { side: "ally", kind: "heal", r: 90, amt: 170, fx: "leaf", col: "#7be04a" } },
    sp_pulgas: { name: "Pulgas", cost: 3, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "Una plaga de pulgas: los enemigos de la zona se rascan sin parar y no pueden atacar durante 4 s.", gacha: true, fac: 'animales', spell: { side: "foe", kind: "disarm", r: 85, t: 4, fx: "flea", col: "#8b5530", label: "¡QUÉ PICOR!" } },
    sp_lapidas: { name: "Lluvia de lápidas", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Caen lápidas del cielo: 170 de daño y un pequeño aturdimiento a los enemigos de la zona.", gacha: true, fac: 'nomuertos', spell: { side: "foe", kind: "dmg", r: 70, amt: 170, bld: 0.35, stun: 0.5, fx: "tomb", col: "#9aa3b2" } },
    sp_formol: { name: "Poción de formol", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "Conserva a tus tropas como nuevas: cura 150 a las de la zona.", gacha: true, fac: 'nomuertos', spell: { side: "ally", kind: "heal", r: 85, amt: 150, fx: "potion", col: "#7dffb8" } },
    sp_eternas: { name: "Horas extra eternas", cost: 3, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "Los enemigos de la zona se arrastran como zombis: andan y atacan a la mitad de velocidad durante 6 s.", gacha: true, fac: 'nomuertos', spell: { side: "foe", kind: "slow", r: 90, t: 6, fx: "clock", col: "#7d5fff", label: "HORAS EXTRA" } },
    sp_donaciones: { name: "Lluvia de donaciones", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Caen monedas de los fans: 130 de daño en la zona, y cada enemigo al que da te devuelve 0,3 de CAOS (hasta 1,5).", gacha: true, fac: 'streamers', spell: { side: "foe", kind: "dmg", r: 85, amt: 130, bld: 0.3, gain: 0.3, fx: "coin", col: "#ffcb3d" } },
    sp_merienda: { name: "Pausa para merendar", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "La madre del streamer trae la merienda: cura 160 a tus tropas de la zona.", gacha: true, fac: 'streamers', spell: { side: "ally", kind: "heal", r: 90, amt: 160, fx: "sandwich", col: "#ffb04f" } },
    sp_baneo: { name: "Ban temporal", cost: 4, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "El moderador banea a los enemigos de la zona: desaparecen 3 s y no pueden hacer nada.", gacha: true, fac: 'streamers', spell: { side: "foe", kind: "ban", r: 75, t: 3, fx: "hammer", col: "#a855f7", label: "BANEADO" } },
    sp_rayo: { name: "Rayo divino", cost: 4, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Un dios enfadado lanza un rayo: 260 de daño en una zona pequeña.", gacha: true, fac: 'heroes', spell: { side: "foe", kind: "dmg", r: 55, amt: 260, bld: 0.4, fx: "bolt", col: "#ffe14d" } },
    sp_ambrosia: { name: "Ambrosía", cost: 4, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "La bebida de los dioses: cura 200 a tus tropas de la zona.", gacha: true, fac: 'heroes', spell: { side: "ally", kind: "heal", r: 85, amt: 200, fx: "goblet", col: "#ffd166" } },
    sp_nerfeo: { name: "Nerfeo divino", cost: 3, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "Los dioses publican un parche: los enemigos de la zona encogen y pegan un 40 % menos durante 6 s.", gacha: true, fac: 'heroes', spell: { side: "foe", kind: "shrink", r: 85, t: 6, f: 0.6, fx: "arrow", col: "#63cfe0", label: "¡NERFEADO!" } },
    sp_orbital: { name: "Ataque orbital", cost: 4, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Un satélite marca la zona y, un segundo después, dispara: 240 de daño.", gacha: true, fac: 'ciber', spell: { side: "foe", kind: "dmg", r: 65, amt: 240, bld: 0.5, delay: 1.2, fx: "laser", col: "#22e3ff" } },
    sp_nanobots: { name: "Parche de nanobots", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "Nanobots que reparan: curan 130 a tus tropas de la zona y les dan un escudo de 60.", gacha: true, fac: 'ciber', spell: { side: "ally", kind: "heal", r: 85, amt: 130, shield: 60, fx: "chip", col: "#7df3ff" } },
    sp_update: { name: "Actualización obligatoria", cost: 4, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "Los enemigos de la zona se quedan «instalando la actualización 1 de 47»: no se mueven ni atacan durante 3 s.", gacha: true, fac: 'ciber', spell: { side: "foe", kind: "stun", r: 80, t: 3, sk: "update", fx: "bar", col: "#22e3ff", label: "INSTALANDO 1/47…" } },
    sp_gatos: { name: "Lluvia de gatos", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Llueven gatos (enfadados): 120 de daño en una zona grande y, a veces, cae uno gordo que hace el doble.", gacha: true, fac: 'memes', spell: { side: "foe", kind: "dmg", r: 95, amt: 120, bld: 0.3, crit: 0.25, fx: "cat", col: "#ffb04f" } },
    sp_likes: { name: "Like masivo", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "Mil likes de golpe: curan 140 a tus tropas de una zona grande.", gacha: true, fac: 'memes', spell: { side: "ally", kind: "heal", r: 100, amt: 140, fx: "heart", col: "#ff5fa8" } },
    sp_confusion: { name: "Confusión", cost: 4, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "Nadie entiende el meme: los enemigos de la zona se pelean entre ellos durante 3 s.", gacha: true, fac: 'memes', spell: { side: "foe", kind: "confuse", r: 80, t: 3, fx: "swirl", col: "#ff3df0", label: "¿EH?" } },
    sp_critico: { name: "Golpe crítico", cost: 4, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "¡CRÍTICO! Un golpe enorme en una zona pequeña: 300 de daño.", gacha: true, fac: 'gamer', spell: { side: "foe", kind: "dmg", r: 45, amt: 300, bld: 0.45, fx: "sword", col: "#ff4b5c" } },
    sp_crunch: { name: "Crunch", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Hechizo · loco', desc: "Semana de crunch: tus tropas de la zona atacan el doble de rápido durante 6 s… pero se van quemando (pierden un 4 % de vida por segundo).", gacha: true, fac: 'nomuertos', spell: { side: "ally", kind: "crunch", r: 85, t: 6, drain: 0.04, fx: "clock", col: "#ff8a3d", label: "¡CRUNCH!" } },
    sp_review: { name: "Review bombing", cost: 3, count: 1, rarity: 'epic', rar: 'Épica', tag: 'Hechizo · loco', desc: "La comunidad llena la tienda de reseñas de 1 estrella: las torres y la sede del rival en la zona reciben un 40 % más de daño durante 8 s.", gacha: true, fac: 'gamer', spell: { side: "foe", kind: "review", r: 80, t: 8, amp: 0.4, fx: "letter", col: "#ffcb3d", label: "★☆☆☆☆" } },
    sp_energetica: { name: "Bebida energética", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "Una lata para todos: cura 120 a tus tropas de la zona y atacan un 30 % más rápido durante 5 s.", gacha: true, fac: 'gamer', spell: { side: "ally", kind: "heal", r: 85, amt: 120, haste: 5, fx: "can", col: "#7be04a" } },
    sp_ping: { name: "Ping de 999", cost: 3, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "Lag horrible: los enemigos de la zona dan un salto hacia atrás y se quedan congelados 1 s.", gacha: true, fac: 'gamer', spell: { side: "foe", kind: "knock", r: 85, d: 80, t: 1, fx: "wifi", col: "#ff4b5c", label: "LAG" } },
    sp_cartuchos: { name: "Lluvia de cartuchos", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Caen cartuchos de juegos olvidados: 150 de daño en la zona.", gacha: true, fac: 'olvidados', spell: { side: "foe", kind: "dmg", r: 80, amt: 150, bld: 0.35, fx: "cart", col: "#a16207" } },
    sp_parchefan: { name: "Parche de la comunidad", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "Los fans arreglan lo que la empresa abandonó: cura 160 a tus tropas de la zona.", gacha: true, fac: 'olvidados', spell: { side: "ally", kind: "heal", r: 90, amt: 160, fx: "patch", col: "#fde68a" } },
    sp_cancelado: { name: "Juego cancelado", cost: 4, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "Los enemigos de la zona se quedan en gris, como un juego cancelado: no hacen nada durante 3 s.", gacha: true, fac: 'olvidados', spell: { side: "foe", kind: "stun", r: 80, t: 3, sk: "stone", fx: "stamp", col: "#9aa3a0", label: "CANCELADO" } },
    sp_taquilla: { name: "Explosión de taquilla", cost: 4, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · daño', desc: "Una explosión de 200 millones de presupuesto: 170 de daño en una zona grande.", gacha: true, fac: 'pop', spell: { side: "foe", kind: "dmg", r: 95, amt: 170, bld: 0.35, fx: "boom", col: "#ff7a1a" } },
    sp_maquillaje: { name: "Maquillaje de rodaje", cost: 3, count: 1, rarity: 'rare', rar: 'Rara', tag: 'Hechizo · cura', desc: "Un retoque rápido antes de la toma: cura 160 a tus tropas de la zona.", gacha: true, fac: 'pop', spell: { side: "ally", kind: "heal", r: 90, amt: 160, fx: "brush", col: "#ff9ab8" } },
    sp_remake: { name: "Remake", cost: 4, count: 1, rarity: 'legendary', rar: 'Legendaria', tag: 'Hechizo · loco', desc: "El enemigo más fuerte de la zona sale en versión remake: más pequeño, con un 35 % menos de vida y pegando menos durante 10 s. Y más caro.", gacha: true, fac: 'pop', spell: { side: "foe", kind: "remake", r: 90, t: 10, f: 0.6, cut: 0.35, fx: "clap", col: "#ff9ab8", label: "REMAKE" } },
  },
  enemyCards: {
    becario: { name: 'Becario',    cost: 2, count: 2 },
    starbot: { name: 'StarBot',    cost: 3, count: 1 },
    fallen:  { name: 'FallenHero', cost: 5, count: 1 },
    cajabotin:  { name: 'CajaBotín', cost: 3, count: 1 },
    soportebot: { name: 'SoporteBot', cost: 3, count: 1 },
    parchebot:  { name: 'Parche Día 1', cost: 4, count: 1 },
    // Phony (v0.9.13)
    descargabot: { name: 'Descarga99', cost: 2, count: 3 },
    licenciabot: { name: 'LicenciaBot', cost: 3, count: 1 },
    plusbot:     { name: 'PayPlus', cost: 3, count: 1 },
    cobradlc:    { name: 'CobraDLC', cost: 4, count: 1 },
    servidorbot: { name: 'Servidor Caído', cost: 5, count: 1 },
    remasterbot: { name: 'Remaster 70 €', cost: 5, count: 1 },
    // v0.9.15: hechizos de las empresas (los usa la CPU)
    sp_despido: { name: "Despido fulminante", cost: 3, count: 1, spell: { side: "foe", kind: "dmg", r: 70, amt: 170, bld: 0.3, fx: "letter", col: "#fff6ea", label: "¡DESPEDIDO!" } },
    sp_cobro: { name: "Cobro automático", cost: 3, count: 1, spell: { side: "foe", kind: "dmg", r: 80, amt: 150, bld: 0.3, steal: 0.5, fx: "card9", col: "#ffcb3d", label: "-9,99 €" } },
  },
  units: {
    squirrel: { hp: 150, dmg: 15, cd: 0.9, range: 8,   speed: 52, r: 12, sight: 120 },
    fox:      { hp: 200, dmg: 18, cd: 1.2, range: 8,   speed: 42, r: 14, sight: 130, stealth: 8, surprise: 3, restealth: 3 },
    bunny:    { hp: 500, dmg: 25, cd: 1.1, range: 10,  speed: 36, r: 20, sight: 150, jumpCd: 8, jumpDmg: 50, jumpR: 72, jumpRange: 210 },
    beaver:   { hp: 100, dmg: 180, cd: 1, range: 6,  speed: 58, r: 12, sight: 140, buildings: true, kamikaze: true, splash: 50, splashDmg: 60 },
    meercat:  { hp: 190, dmg: 8,  cd: 1.0, range: 8,   speed: 32, r: 12, sight: 110, healer: true, heal: 14, healCd: 1.7, healR: 95 },
    junkcoon: { hp: 240, dmg: 26, cd: 1.7, range: 115, speed: 36, r: 14, sight: 150, ranged: 'trash', splash: 42 },
    mechavaca:{ hp: 950, dmg: 24, cd: 1.3, range: 10,  speed: 26, r: 22, sight: 140, eject: 'vaca' },
    vaca:     { hp: 160, dmg: 12, cd: 0.9, range: 8,   speed: 46, r: 12, sight: 120 },
    necrolord:   { hp: 560, dmg: 26, cd: 1.4, range: 100, speed: 32, r: 18, sight: 150, ranged: 'shadow', summon: 'skeleton', summonN: 2, summonCd: 8 },
    skeleton:    { hp: 75,  dmg: 12, cd: 0.8, range: 6,   speed: 52, r: 9,  sight: 110 },
    zombie:      { hp: 140, dmg: 16, cd: 1.1, range: 8,   speed: 32, r: 12, sight: 110 },
    ghostmage:   { hp: 170, dmg: 28, cd: 1.5, range: 110, speed: 36, r: 13, sight: 150, ranged: 'frost', slow: { f: 0.5, t: 1.2 } },
    banshee:     { hp: 220, dmg: 18, cd: 1.2, range: 80,  speed: 38, r: 13, sight: 140, ranged: 'wave', splash: 34, pulse: { cd: 7, r: 80, stun: 1.2, kind: 'daze', text: '¡AAAAAH!', color: 'rgba(230,220,255,.9)', tc: '#e6dcff', sfx: 'wail' } },
    // Streamers
    twitchking:  { hp: 600, dmg: 30, cd: 1.1, range: 10,  speed: 36, r: 19, sight: 150, aura: { r: 110, mult: 1.3 } },
    subswarm:    { hp: 110, dmg: 14, cd: 0.8, range: 6,   speed: 54, r: 9,  sight: 110 },
    hypebeast:   { hp: 360, dmg: 22, cd: 0.65, range: 8,   speed: 54, r: 12, sight: 130 },
    viralbot:    { hp: 190, dmg: 20, cd: 1.1, range: 110, speed: 38, r: 13, sight: 150, ranged: 'clip', stunOnHit: 0.4 },
    snackmom:    { hp: 220, dmg: 8,  cd: 1.0, range: 8,   speed: 30, r: 13, sight: 110, healer: true, heal: 16, healCd: 1.7, healR: 95 },
    hypetrain:   { hp: 580, dmg: 50, cd: 1.3, range: 8,   speed: 48, r: 18, sight: 140, buildings: true },
    banhammer:   { hp: 1000, dmg: 32, cd: 1.4, range: 12,  speed: 26, r: 21, sight: 140, knock: 22, cleave: { r: 38, f: 0.7 } },
    // Héroes
    epicchampion:{ hp: 640, dmg: 32, cd: 1.2, range: 10,  speed: 36, r: 20, sight: 150, teamFight: { cd: 8, r: 110 } },
    cupidarcher: { hp: 125, dmg: 15, cd: 0.8, range: 115, speed: 44, r: 11, sight: 150, ranged: 'arrow' },
    hoplite:     { hp: 160, dmg: 16, cd: 1.0, range: 14,  speed: 36, r: 11, sight: 120 },
    shieldmaiden:{ hp: 420, dmg: 18, cd: 1.1, range: 10,  speed: 34, r: 15, sight: 130, armor: 0.35 },
    thundergod:  { hp: 240, dmg: 28, cd: 1.6, range: 105, speed: 34, r: 15, sight: 150, chain: { n: 2, r: 75, f: 0.7 } },
    medusa:      { hp: 240, dmg: 18, cd: 1.2, range: 90,  speed: 36, r: 13, sight: 140, ranged: 'venom', pulse: { cd: 8, r: 90, stun: 1.4, kind: 'stone', text: '¡MIRADA DE PIEDRA!', color: 'rgba(200,215,190,.95)', tc: '#d4f5c4', sfx: 'womp' } },
    minotaur:    { hp: 950, dmg: 38, cd: 1.4, range: 10,  speed: 30, r: 21, sight: 140, charge: { dist: 70, mult: 2.2, stun: 0.8 } },
    // Ciberpunks
    cybermarine: { hp: 560, dmg: 13, cd: 0.45, range: 100, speed: 34, r: 19, sight: 150, ranged: 'bullet', summon: 'drone', summonN: 2, summonCd: 9, summonDrop: true },
    drone:       { hp: 80,  dmg: 8,  cd: 0.6, range: 90,  speed: 50, r: 8,  sight: 140, ranged: 'bullet' },
    nanobot:     { hp: 70,  dmg: 9,  cd: 0.7, range: 6,   speed: 56, r: 8,  sight: 110 },
    cyberninja:  { hp: 280, dmg: 24, cd: 0.8, range: 8,   speed: 46, r: 12, sight: 150, blink: { cd: 5, dist: 80 } },
    techdroid:   { hp: 200, dmg: 8,  cd: 1.0, range: 8,   speed: 30, r: 13, sight: 110, healer: true, heal: 14, healCd: 1.7, healR: 95 },
    hackerkid:   { hp: 150, dmg: 12, cd: 1.0, range: 90,  speed: 40, r: 11, sight: 140, ranged: 'code', hack: { cd: 8, r: 170, t: 3.5 } },
    neonsniper:  { hp: 150, dmg: 60, cd: 2.4, range: 170, speed: 34, r: 12, sight: 190, ranged: 'snipe' },
    siegemech:   { hp: 820, dmg: 38, cd: 2.0, range: 120, speed: 24, r: 22, sight: 150, ranged: 'shell', splash: 45 },
    // Memes
    memelord:    { hp: 540, dmg: 24, cd: 1.2, range: 90,  speed: 34, r: 18, sight: 150, ranged: 'card', viral: { cd: 7 } },
    suchdog:     { hp: 150, dmg: 16, cd: 0.8, range: 8,   speed: 56, r: 11, sight: 120 },
    gifblaster:  { hp: 200, dmg: 11, cd: 0.45, range: 100, speed: 44, r: 12, sight: 140, ranged: 'gif' },
    synthcat:    { hp: 210, dmg: 24, cd: 1.4, range: 100, speed: 36, r: 13, sight: 140, ranged: 'note', splash: 36 },
    trollbot:    { hp: 680, dmg: 16, cd: 1.0, range: 8,   speed: 34, r: 16, sight: 130, taunt: { r: 110 } },
    stonks:      { hp: 460, dmg: 30, cd: 1.1, range: 8,   speed: 40, r: 14, sight: 140, buildings: true, stonks: { step: 0.15, max: 10 } },
    chonkcat:    { hp: 1100, dmg: 26, cd: 1.4, range: 10, speed: 26, r: 23, sight: 140, pulse: { cd: 6, r: 55, stun: 0.6, dmg: 30, kind: 'daze', text: '¡SE SIENTA!', color: 'rgba(255,220,150,.95)', tc: '#ffd28a', sfx: 'slam' } },
    skullknight: { hp: 520, dmg: 32, cd: 1.3, range: 10,  speed: 36, r: 18, sight: 140, slow: { f: 0.5, t: 1.6 } },
    stitchbrute: { hp: 1050, dmg: 50, cd: 1.4, range: 10, speed: 27, r: 24, sight: 140, buildings: true, deathBlast: { r: 70, dmg: 90 } },
    becario:  { hp: 130, dmg: 13, cd: 1.0, range: 8,   speed: 44, r: 12, sight: 120 },
    starbot:  { hp: 170, dmg: 18, cd: 1.3, range: 105, speed: 36, r: 14, sight: 150, ranged: 'plasma' },
    fallen:   { hp: 800, dmg: 34, cd: 1.6, range: 10,  speed: 26, r: 21, sight: 170, buildings: true },
    cajabotin:  { hp: 320, dmg: 10, cd: 1.0, range: 8,  speed: 30, r: 15, sight: 120, eject: 'becario', ejectN: 3, ejectTxt: '¡BOTÍN!' },
    soportebot: { hp: 200, dmg: 8,  cd: 1.0, range: 8,  speed: 30, r: 13, sight: 110, healer: true, heal: 14, healCd: 1.8, healR: 95 },
    parchebot:  { hp: 760, dmg: 22, cd: 1.3, range: 10, speed: 28, r: 20, sight: 140, armor: 0.3 },
    // Comunidad Gamer (v0.9.13)
    progamer:    { hp: 560, dmg: 17, cd: 0.7, range: 10,  speed: 38, r: 18, sight: 150, combo: { n: 4, mult: 3, stun: 0.6 } },
    noobs:       { hp: 90,  dmg: 11, cd: 0.9, range: 6,   speed: 48, r: 10, sight: 110 },
    speedrunner: { hp: 230, dmg: 28, cd: 0.8, range: 8,   speed: 70, r: 12, sight: 140, buildings: true },
    modder:      { hp: 200, dmg: 8,  cd: 1.0, range: 8,   speed: 30, r: 13, sight: 110, healer: true, heal: 15, healCd: 1.7, healR: 95 },
    coleccionista:{ hp: 210, dmg: 24, cd: 1.25, range: 110, speed: 36, r: 13, sight: 150, ranged: 'disc', bounce: 0.6 },
    ragequitter: { hp: 480, dmg: 24, cd: 1.0, range: 8,   speed: 40, r: 15, sight: 130, deathBlast: { r: 70, dmg: 100, txt: '¡RAGE QUIT!', rgb: '255,90,90', c1: '#ff6b6b', c2: '#ffd0d0', tc: '#ff8a8a' } },
    recreativa:  { hp: 950, dmg: 26, cd: 1.3, range: 10,  speed: 26, r: 22, sight: 140, eject: 'noobs', ejectN: 2, ejectTxt: '¡INSERT COIN!' },
    // Olvidados (v0.9.13)
    vikingo:     { hp: 620, dmg: 26, cd: 1.1, range: 10,  speed: 34, r: 19, sight: 150, shieldUp: { cd: 8, r: 100, amt: 80, t: 6 } },
    swarmbug:    { hp: 65,  dmg: 10, cd: 0.6, range: 6,   speed: 60, r: 8,  sight: 110 },
    vikingsquad: { hp: 170, dmg: 15, cd: 1.0, range: 10,  speed: 38, r: 11, sight: 120 },
    retromarine: { hp: 230, dmg: 9,  cd: 0.4, range: 100, speed: 36, r: 13, sight: 150, ranged: 'bullet' },
    ghostagent:  { hp: 170, dmg: 62, cd: 2.4, range: 165, speed: 36, r: 12, sight: 190, ranged: 'snipe', stealth: 8, surprise: 2, restealth: 3 },
    rockracer:   { hp: 420, dmg: 36, cd: 1.3, range: 95,  speed: 56, r: 16, sight: 150, buildings: true, ranged: 'missile' },
    titanbeta:   { hp: 1150, dmg: 34, cd: 1.4, range: 12, speed: 26, r: 23, sight: 140, fury: { f: 0.5, mult: 1.5, spd: 1.3 } },
    // Cultura Pop (v0.9.13)
    directora:   { hp: 520, dmg: 22, cd: 1.1, range: 95,  speed: 34, r: 18, sight: 150, ranged: 'wave', action: { cd: 8, r: 110, t: 4 } },
    extras:      { hp: 70,  dmg: 9,  cd: 0.7, range: 6,   speed: 54, r: 9,  sight: 110 },
    doble:       { hp: 300, dmg: 22, cd: 0.8, range: 8,   speed: 46, r: 12, sight: 150, blink: { cd: 5, dist: 80, col: '#ffcb3d', ring: 'rgba(255,203,61,.9)', txt: '¡ACROBACIA!' } },
    detective:   { hp: 190, dmg: 18, cd: 1.1, range: 110, speed: 36, r: 12, sight: 150, ranged: 'bullet', mark: { t: 4, f: 0.25 } },
    heroe:       { hp: 520, dmg: 26, cd: 1.0, range: 8,   speed: 44, r: 14, sight: 140, armor: 0.3 },
    spoiler:     { hp: 230, dmg: 16, cd: 1.1, range: 80,  speed: 38, r: 13, sight: 140, ranged: 'paper', pulse: { cd: 7, r: 85, stun: 1.3, kind: 'daze', text: '¡SPOILER!', color: 'rgba(255,240,180,.95)', tc: '#ffe9a8', sfx: 'wail' } },
    kaiju:       { hp: 1100, dmg: 40, cd: 1.5, range: 12, speed: 25, r: 24, sight: 140, buildings: true, cleave: { r: 44, f: 0.6 } },
    // Phony (v0.9.13)
    descargabot: { hp: 110, dmg: 12, cd: 0.9, range: 6,   speed: 50, r: 11, sight: 110 },
    licenciabot: { hp: 230, dmg: 22, cd: 1.2, range: 105, speed: 36, r: 13, sight: 150, ranged: 'contract', life: 22 },
    plusbot:     { hp: 210, dmg: 8,  cd: 1.0, range: 8,   speed: 30, r: 13, sight: 110, healer: true, heal: 15, healCd: 1.8, healR: 95 },
    cobradlc:    { hp: 520, dmg: 40, cd: 1.3, range: 8,   speed: 40, r: 16, sight: 140, buildings: true, steal: 0.4 },
    servidorbot: { hp: 900, dmg: 24, cd: 1.3, range: 10,  speed: 26, r: 21, sight: 140, pulse: { cd: 9, r: 75, stun: 1, kind: 'daze', text: '¡SIN CONEXIÓN!', color: 'rgba(120,170,255,.95)', tc: '#a9c8ff', sfx: 'womp' } },
    remasterbot: { hp: 700, dmg: 30, cd: 1.3, range: 10,  speed: 30, r: 20, sight: 140, remaster: 0.5 },
    // v0.9.15: mata-sanadores (saltan por encima de la primera línea a por el sanador o el tirador)
    huron: { hp: 230, dmg: 24, cd: 0.9, range: 8, speed: 50, r: 13, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
    sombra: { hp: 220, dmg: 26, cd: 1.0, range: 8, speed: 46, r: 13, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
    hater: { hp: 240, dmg: 24, cd: 0.95, range: 8, speed: 48, r: 13, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
    arpia: { hp: 210, dmg: 26, cd: 0.95, range: 8, speed: 50, r: 13, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
    dron: { hp: 190, dmg: 24, cd: 0.8, range: 8, speed: 54, r: 12, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
    clickbait: { hp: 220, dmg: 25, cd: 0.95, range: 8, speed: 48, r: 14, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
    campero: { hp: 250, dmg: 24, cd: 1.0, range: 8, speed: 44, r: 14, sight: 140, stealth: 4, leap: { range: 250, cd: 9, mult: 2 } },
    espia: { hp: 220, dmg: 26, cd: 0.95, range: 8, speed: 48, r: 13, sight: 140, leap: { range: 250, cd: 9, mult: 2 } },
    paparazzi: { hp: 220, dmg: 22, cd: 1.0, range: 8, speed: 48, r: 13, sight: 140, flash: 1, leap: { range: 250, cd: 9, mult: 2 } },
  },
  structs: {
    tower: { hp: 1000, dmg: 20, cd: 0.9, range: 130, r: 24 },
    base:  { hp: 1800, dmg: 28, cd: 1.1, range: 100, r: 46 },
  },
  diff: {
    easy:   { aiIncome: 0.8, think: [1.3, 2.3], bossCd: 20, stun: 2.0, despido: 28 },
    normal: { aiIncome: 1.25, think: [0.5, 1.0], bossCd: 14, stun: 2.5, despido: 40 },
  },
};

const TYPES = {
  squirrel: { top: 40, foot: '#7a3414' },
  fox:      { top: 44, foot: '#2b1622' },
  bunny:    { top: 66, foot: '#efe8ff' },
  beaver:   { top: 40, foot: '#5a3a20', spark: [3.2, -23] },
  meercat:  { top: 44, foot: '#b48a58' },
  junkcoon: { top: 44, foot: '#3b3d47' },
  mechavaca:{ top: 54, foot: '#b84f86' },
  vaca:     { top: 34, foot: '#efe8ff' },
  becario:  { top: 34, foot: '#5b6578' },
  starbot:  { top: 44, foot: null, hover: true, jet: true },
  necrolord:   { top: 64, foot: '#2a1840' },
  skeleton:    { top: 28, foot: '#efeadf' },
  zombie:      { top: 36, foot: '#5b4a3a' },
  ghostmage:   { top: 52, foot: null, hover: true },
  banshee:     { top: 46, foot: null, hover: true },
  skullknight: { top: 56, foot: '#2f3a5c' },
  stitchbrute: { top: 52, foot: '#6f8a62' },
  twitchking:  { top: 63, foot: '#2b2d3a' },
  subswarm:    { top: 34, foot: '#f5f5f5' },
  hypebeast:   { top: 40, foot: '#f5f5f5' },
  viralbot:    { top: 44, foot: null, hover: true, jet: true },
  snackmom:    { top: 46, foot: '#f472b6' },
  hypetrain:   { top: 56, foot: null },
  banhammer:   { top: 66, foot: '#14532d' },
  epicchampion:{ top: 68, foot: '#a16207' },
  cupidarcher: { top: 42, foot: null, hover: true },
  hoplite:     { top: 40, foot: '#7a4a1a' },
  shieldmaiden:{ top: 50, foot: '#5b6787' },
  thundergod:  { top: 56, foot: null, hover: true },
  medusa:      { top: 50, foot: '#15803d' },
  minotaur:    { top: 60, foot: '#3b2a1e' },
  cybermarine: { top: 62, foot: '#1f2937' },
  drone:       { top: 24, foot: null, hover: true, jet: true },
  nanobot:     { top: 24, foot: '#4b5563' },
  cyberninja:  { top: 42, foot: '#111827' },
  techdroid:   { top: 40, foot: null, hover: true, jet: true },
  hackerkid:   { top: 38, foot: '#111827' },
  neonsniper:  { top: 42, foot: '#1f2937' },
  siegemech:   { top: 60, foot: '#1f2937' },
  memelord:    { top: 60, foot: '#27272a' },
  suchdog:     { top: 36, foot: '#e8a04a' },
  gifblaster:  { top: 44, foot: '#f5f5f5' },
  synthcat:    { top: 40, foot: '#f59e0b' },
  trollbot:    { top: 56, foot: '#4b5563' },
  stonks:      { top: 52, foot: '#111827' },
  chonkcat:    { top: 54, foot: null },
  fallen:   { top: 52, foot: '#5b6787' },
  cajabotin:  { top: 40, foot: '#5b6578' },
  soportebot: { top: 46, foot: null, hover: true, jet: true },
  parchebot:  { top: 56, foot: '#5b6578' },
  progamer:    { top: 58, foot: '#1f2937' }, noobs: { top: 34, foot: '#1f2937' }, speedrunner: { top: 42, foot: '#f5f5f5' }, modder: { top: 46, foot: '#1f2937' },
  coleccionista: { top: 46, foot: '#1f2937' }, ragequitter: { top: 52, foot: '#1f2937' }, recreativa: { top: 68, foot: '#1f2937' },
  vikingo:     { top: 62, foot: '#5a3a20' }, swarmbug: { top: 22, foot: null }, vikingsquad: { top: 38, foot: '#5a3a20' }, retromarine: { top: 50, foot: '#365314' },
  ghostagent:  { top: 46, foot: '#1f2937' }, rockracer: { top: 28, foot: null }, titanbeta: { top: 66, foot: '#44403c' },
  directora:   { top: 58, foot: '#3b2a1e' }, extras: { top: 32, foot: '#57534e' }, doble: { top: 42, foot: '#1f2937' }, detective: { top: 48, foot: '#3f2d20' },
  heroe:       { top: 50, foot: null, hover: true }, spoiler: { top: 46, foot: '#14532d' }, kaiju: { top: 64, foot: null },
  descargabot: { top: 40, foot: '#94a3b8' }, licenciabot: { top: 45, foot: '#172554' }, plusbot: { top: 40, foot: null, hover: true, jet: true },
  cobradlc:    { top: 50, foot: '#334155' }, servidorbot: { top: 64, foot: '#111827' }, remasterbot: { top: 60, foot: '#4b5563' },
  // v0.9.15: mata-sanadores
  huron: { top: 42, foot: "#5a3a20" },
  sombra: { top: 46, foot: null, hover: true },
  hater: { top: 50, foot: "#334155" },
  arpia: { top: 46, foot: null, hover: true },
  dron: { top: 40, foot: null, hover: true },
  clickbait: { top: 44, foot: "#1f2937" },
  campero: { top: 46, foot: "#3f6212" },
  espia: { top: 49, foot: "#1f2937" },
  paparazzi: { top: 46, foot: "#1e3a8a" },
};
const TOPS = { ceo: 64, presi: 64, sp_crunch: 46, sp_review: 46, sp_bellotas: 46, sp_botiquin: 46, sp_pulgas: 46, sp_lapidas: 46, sp_formol: 46, sp_eternas: 46, sp_donaciones: 46, sp_merienda: 46, sp_baneo: 46, sp_rayo: 46, sp_ambrosia: 46, sp_nerfeo: 46, sp_orbital: 46, sp_nanobots: 46, sp_update: 46, sp_gatos: 46, sp_likes: 46, sp_confusion: 46, sp_critico: 46, sp_energetica: 46, sp_ping: 46, sp_cartuchos: 46, sp_parchefan: 46, sp_cancelado: 46, sp_taquilla: 46, sp_maquillaje: 46, sp_remake: 46, sp_despido: 46, sp_cobro: 46, p_tower: 86, p_base: 106, e_tower: 88, e_base: 140, u_tower: 84, u_base: 110, s_tower: 88, s_base: 104, h_tower: 106, h_base: 112, c_tower: 78, c_base: 102, m_tower: 90, m_base: 112, o_tower: 88, o_base: 104, y_tower: 92, y_base: 124, k_tower: 80, k_base: 108, g_tower: 82, g_base: 102 };
// por piel de edificio: [boca de disparo x, altura] y proyectil [torre, base]
const SKINS = {
  p: { tower: [0, 68], base: [0, 70], shot: ['acorn', 'carrot'], chips: ['#8b5530', '#d39a5f', '#ff7a1a'] },
  u: { tower: [0, 66], base: [0, 80], shot: ['soulfire', 'soulfire'], glow: { tower: [0, 68, 22, '94,242,160'], base: [0, 22, 30, '94,242,160'] }, chips: ['#6b6a7d', '#efeadf', '#5ef2a0'] },
  e: { tower: [-8, 76], base: [-9, 121], shot: ['laser', 'eyelaser'], chips: ['#26314d', '#3c4b72', '#33e0ff', '#c3cbe0'] },
  s: { tower: [0, 70], base: [0, 86], shot: ['heart', 'heart'], glow: { tower: [0, 70, 24, '255,220,255'] }, chips: ['#6d28d9', '#a855f7', '#22e3ff', '#f472b6'] },
  h: { tower: [0, 94], base: [0, 100], shot: ['bolt', 'bolt'], glow: { tower: [0, 97, 24, '255,190,70'], base: [0, 28, 26, '255,190,70'] }, chips: ['#f5f3ee', '#cfcac0', '#ffcb3d'] },
  c: { tower: [30, 58], base: [0, 74], shot: ['neon', 'neon'], glow: { tower: [-3.4, 55, 14, '34,227,255'], base: [0, 52, 30, '255,61,240'] }, chips: ['#4b5563', '#1f2937', '#22e3ff', '#ff3df0'] },
  m: { tower: [0, 64], base: [0, 95], shot: ['meme', 'meme'], chips: ['#e7dcc4', '#ffe14d', '#c4b5fd', '#fda4af'] },
  // v0.9.13
  o: { tower: [0, 78], base: [0, 62], shot: ['pixel', 'pixel'], glow: { tower: [0, 78, 15, '255,154,60'] }, chips: ['#b45309', '#7c3aed', '#0e7490', '#d6cfc0'] },
  y: { tower: [5, 80], base: [0, 98], shot: ['payray', 'payray'], glow: { tower: [5, 80, 15, '255,203,61'] }, chips: ['#334155', '#111827', '#ffcb3d', '#94a3b8'] },
  k: { tower: [9, 71], base: [0, 64], shot: ['popcorn', 'popcorn'], glow: { tower: [9.4, 71.4, 18, '255,240,170'], base: [27, 44, 12, '255,60,60'] }, chips: ['#e7dcc4', '#fde68a', '#dc2626', '#1f2937'] },
  g: { tower: [0, 77], base: [0, 71], shot: ['rgb', 'rgb'], glow: { tower: [0, 77, 13, '34,227,255'], base: [0, 71, 28, '124,58,237'] }, chips: ['#111827', '#22e3ff', '#ff3df0', '#7be04a'] },
};
// facciones jugables: líder fijo + 6 unidades + pasiva
const FACTIONS = {
  animales: { name: 'Animales Locos', pname: 'Rabia', leader: 'bunny', units: ['squirrel', 'beaver', 'fox', 'meercat', 'junkcoon', 'mechavaca'], skin: 'p', base: 'LA MADRIGUERA', passive: 'RABIA', pkey: 'rage', passiveText: 'Cada animal pega un 10 % más por cada aliado que tenga cerca, hasta +50 %. Cuanto más juntos, más locos.', banner: 'Tus animales pegan +10 % por cada aliado cerca, hasta +50 %', trio: ['squirrel', 'bunny', 'fox'], kind: 'player', end: 'tu Madriguera', icon: 'flame', trioH: [82, 158, 100] },
  streamers: { name: 'Streamers', pname: 'Hype', leader: 'twitchking', units: ['subswarm', 'hypebeast', 'viralbot', 'snackmom', 'hypetrain', 'banhammer'], skin: 's', base: 'EL PLATÓ', passive: 'HYPE', pkey: 'hype', passiveText: 'Cada bot que despides suma espectadores al chat. Cada 3, todo tu equipo ataca un 5 % más rápido (hasta +25 %). Si pierdes una torre, el chat se va.', banner: 'Cada 3 bajas, tu equipo ataca un 5 % más rápido (hasta +25 %)', trio: ['hypebeast', 'twitchking', 'viralbot'], kind: 'stream', end: 'tu Plató', icon: 'chat', trioH: [84, 150, 92] },
  heroes:    { name: 'Héroes', pname: 'Experiencia', leader: 'epicchampion', units: ['cupidarcher', 'hoplite', 'shieldmaiden', 'thundergod', 'medusa', 'minotaur'], skin: 'h', base: 'EL TEMPLO', passive: 'EXPERIENCIA', chip: 'NIVEL', pkey: 'xp', passiveText: 'Cada bot que despides da experiencia a todo tu ejército: cada 3 bajas subís de nivel, +5 % de vida y daño, hasta nivel 5.', banner: 'Cada 3 bajas, +5 % de vida y daño a todo tu ejército', trio: ['shieldmaiden', 'epicchampion', 'thundergod'], kind: 'hero', end: 'tu Templo', icon: 'star', trioH: [104, 156, 104] },
  ciber:     { name: 'Ciberpunks', pname: 'Escudos', leader: 'cybermarine', units: ['nanobot', 'cyberninja', 'techdroid', 'hackerkid', 'neonsniper', 'siegemech'], skin: 'c', base: 'EL BÚNKER', passive: 'ESCUDOS', pkey: 'shield', passiveText: 'Cada unidad lleva un escudo de plasma del 25 % de su vida que se recarga si pasa 3 s sin recibir daño.', banner: 'Escudo de plasma del 25 % que se recarga a los 3 s sin daño', trio: ['cyberninja', 'cybermarine', 'neonsniper'], kind: 'ciber', end: 'tu Búnker', icon: 'shield', trioH: [92, 150, 92] },
  memes:     { name: 'Memes', pname: 'RNG', leader: 'memelord', units: ['suchdog', 'gifblaster', 'synthcat', 'trollbot', 'stonks', 'chonkcat'], skin: 'm', base: 'EL FORO', passive: 'RNG', pkey: 'rng', passiveText: 'Cada unidad sale con una mutación al azar: gigante, turbo, de cristal o normal. Nunca sabes lo que va a salir.', banner: 'Cada unidad sale con una mutación al azar', trio: ['suchdog', 'memelord', 'trollbot'], kind: 'meme', end: 'tu Foro', icon: 'dice', trioH: [74, 150, 104] },
  gamer:     { name: 'Comunidad Gamer', los: 'los Gamers', corr: 'Gamers corrompidos', pname: 'Comunidad', leader: 'progamer', units: ['noobs', 'speedrunner', 'modder', 'coleccionista', 'ragequitter', 'recreativa'], skin: 'g', base: 'LA LAN PARTY', passive: 'COMUNIDAD', chip: 'EQUIPO', pkey: 'community', passiveText: 'Juntos son más fuertes: todo tu equipo pega un 5 % más por cada tipo distinto de unidad que tengas en el campo, hasta +30 %.', banner: '+5 % de daño por cada tipo distinto de unidad en el campo (hasta +30 %)', trio: ['speedrunner', 'progamer', 'recreativa'], kind: 'gamer', end: 'tu LAN Party', icon: 'pad', trioH: [92, 150, 132] },
  olvidados: { name: 'Olvidados', pname: 'Nostalgia', leader: 'vikingo', units: ['swarmbug', 'vikingsquad', 'retromarine', 'ghostagent', 'rockracer', 'titanbeta'], skin: 'o', base: 'EL ALMACÉN', passive: 'NOSTALGIA', pkey: 'nostalgia', passiveText: 'Nadie se acuerda de ellos: las torres y la base enemigas no les disparan hasta que llevan 3 s a su alcance.', banner: 'Las torres enemigas tardan 3 s en acordarse de cada unidad tuya', trio: ['retromarine', 'vikingo', 'titanbeta'], kind: 'olv', end: 'tu Almacén', icon: 'box', trioH: [96, 150, 124] },
  pop:       { name: 'Cultura Pop', los: 'los de Cultura Pop', corr: 'Cultura Pop corrompida', pname: 'Secuela', leader: 'directora', units: ['extras', 'doble', 'detective', 'heroe', 'spoiler', 'kaiju'], skin: 'k', base: 'EL ESTUDIO', passive: 'SECUELA', pkey: 'sequel', passiveText: 'Toda buena película tiene secuela: cuando una de tus unidades cae, 3 de cada 10 veces vuelve en versión «2», más pequeña y con la mitad de vida.', banner: '3 de cada 10 unidades que caen vuelven en versión «2»', trio: ['heroe', 'directora', 'kaiju'], kind: 'pop', end: 'tu Estudio', icon: 'clap', trioH: [100, 150, 132] },
  nomuertos: { name: 'No-Muertos', pname: 'Renacer', leader: 'necrolord', units: ['skeleton', 'zombie', 'ghostmage', 'banshee', 'skullknight', 'stitchbrute'], skin: 'u', base: 'LA CRIPTA', passive: 'RENACER', pkey: 'revive', passiveText: 'Cada no-muerto revive una vez, con el 60 % de su vida, poco después de caer. Los esqueletos invocados no.', banner: 'Cada no-muerto revive una vez con el 60 % de su vida', trio: ['ghostmage', 'necrolord', 'skullknight'], kind: 'undead', end: 'tu Cripta', icon: 'soul', trioH: [96, 158, 104] },
};
const FACTION_ORDER = ['animales', 'nomuertos', 'streamers', 'heroes', 'ciber', 'memes', 'gamer', 'olvidados', 'pop'];   // v0.9.13: la Comunidad Gamer es la facción 7
// v0.9.15: cartas del gashapón de cada facción (mata-sanadores, hechizo de daño, de cura y uno loco)
const HEALER_SPELL = 1.5;   // v0.9.15: los hechizos de daño hacen un 50 % más a los sanadores
for (const k in CFG.cards) { const c = CFG.cards[k]; if (c.spell && c.spell.kind === 'dmg') c.desc += ' A los sanadores, un 50 % más.'; }
const GACHA_CARDS = {"animales": ["huron", "sp_bellotas", "sp_botiquin", "sp_pulgas"], "nomuertos": ["sombra", "sp_lapidas", "sp_formol", "sp_eternas", "sp_crunch"], "streamers": ["hater", "sp_donaciones", "sp_merienda", "sp_baneo"], "heroes": ["arpia", "sp_rayo", "sp_ambrosia", "sp_nerfeo"], "ciber": ["dron", "sp_orbital", "sp_nanobots", "sp_update"], "memes": ["clickbait", "sp_gatos", "sp_likes", "sp_confusion"], "gamer": ["campero", "sp_critico", "sp_energetica", "sp_ping", "sp_review"], "olvidados": ["espia", "sp_cartuchos", "sp_parchefan", "sp_cancelado"], "pop": ["paparazzi", "sp_taquilla", "sp_maquillaje", "sp_remake"]};
for (const f in GACHA_CARDS) FACTIONS[f].gacha = GACHA_CARDS[f];
// Microblizz: solo rival (no tiene líder: su jefe es SurvivalBot, encima de la sede)
FACTIONS.microblizz = { name: 'Microblizz', pname: 'Despidos rentables', leader: null, units: ['becario', 'starbot', 'fallen', 'cajabotin', 'soportebot', 'parchebot'], skin: 'e', base: 'SURVIVALBOT', passive: 'DESPIDOS RENTABLES', kind: 'enemy', end: 'la Sede de Microblizz' };
// v0.9.13: Phony y su PayStation, la empresa rival de la campaña 2 (quitó los discos para ahorrar millones)
FACTIONS.phony = { name: 'Phony', pname: 'Suscripción', leader: null, units: ['descargabot', 'licenciabot', 'plusbot', 'cobradlc', 'servidorbot', 'remasterbot'], skin: 'y', base: 'PAYSTATION', passive: 'SUSCRIPCIÓN OBLIGATORIA', kind: 'enemy', end: 'la Sede de Phony' };
FACTIONS.microblizz.spells = ['sp_despido']; FACTIONS.phony.spells = ['sp_cobro'];   // v0.9.15: hechizos de las empresas
const CORP = { microblizz: 'Microblizz', phony: 'Phony' };   // las dos empresas malvadas (no son facciones corrompidas)
const isCorp = f => !!CORP[f];
const losOf = f => FACTIONS[f].los || 'los ' + FACTIONS[f].name;   // «los Olvidados», «los Gamers», «los de Cultura Pop»
const capFirst = t => t.charAt(0).toUpperCase() + t.slice(1);
const ROLES = { twitchking: 'tank', subswarm: 'swarm', hypebeast: 'assassin', viralbot: 'ranged', snackmom: 'support', hypetrain: 'buster', banhammer: 'tank',
  epicchampion: 'tank', cupidarcher: 'ranged', hoplite: 'swarm', shieldmaiden: 'tank', thundergod: 'ranged', medusa: 'control', minotaur: 'tank',
  cybermarine: 'support', nanobot: 'swarm', cyberninja: 'assassin', techdroid: 'support', hackerkid: 'control', neonsniper: 'ranged', siegemech: 'tank',
  memelord: 'support', suchdog: 'swarm', gifblaster: 'ranged', synthcat: 'ranged', trollbot: 'tank', stonks: 'buster', chonkcat: 'tank',
  becario: 'swarm', starbot: 'ranged', fallen: 'buster', cajabotin: 'tank', soportebot: 'support', parchebot: 'tank',
  bunny: 'tank', squirrel: 'swarm', beaver: 'buster', fox: 'assassin', meercat: 'support', junkcoon: 'ranged', mechavaca: 'tank', necrolord: 'support', skeleton: 'swarm', zombie: 'swarm', ghostmage: 'ranged', banshee: 'control', skullknight: 'tank', stitchbrute: 'tank',
  progamer: 'tank', noobs: 'swarm', speedrunner: 'buster', modder: 'support', coleccionista: 'ranged', ragequitter: 'assassin', recreativa: 'tank',
  vikingo: 'tank', swarmbug: 'swarm', vikingsquad: 'swarm', retromarine: 'ranged', ghostagent: 'assassin', rockracer: 'buster', titanbeta: 'tank',
  directora: 'support', extras: 'swarm', doble: 'assassin', detective: 'ranged', heroe: 'tank', spoiler: 'control', kaiju: 'buster',
  descargabot: 'swarm', licenciabot: 'ranged', plusbot: 'support', cobradlc: 'buster', servidorbot: 'tank', remasterbot: 'tank',
  // v0.9.15
  huron: 'assassin', sombra: 'assassin', hater: 'assassin', arpia: 'assassin', dron: 'assassin', clickbait: 'assassin', campero: 'assassin', espia: 'assassin', paparazzi: 'assassin', sp_bellotas: 'spell', sp_botiquin: 'spell', sp_pulgas: 'spell', sp_lapidas: 'spell', sp_formol: 'spell', sp_eternas: 'spell', sp_donaciones: 'spell', sp_merienda: 'spell', sp_baneo: 'spell', sp_rayo: 'spell', sp_ambrosia: 'spell', sp_nerfeo: 'spell', sp_orbital: 'spell', sp_nanobots: 'spell', sp_update: 'spell', sp_gatos: 'spell', sp_likes: 'spell', sp_confusion: 'spell', sp_critico: 'spell', sp_crunch: 'spell', sp_review: 'spell', sp_energetica: 'spell', sp_ping: 'spell', sp_cartuchos: 'spell', sp_parchefan: 'spell', sp_cancelado: 'spell', sp_taquilla: 'spell', sp_maquillaje: 'spell', sp_remake: 'spell', sp_despido: 'spell', sp_cobro: 'spell' };
const isLeader = k => !!CFG.cards[k] && CFG.cards[k].rarity === 'leader';
const cardDef = k => CFG.cards[k] || CFG.enemyCards[k];
// invocaciones que no son carta: suben de nivel con su carta "madre"
const SUMMON_PARENT = { drone: 'cybermarine', vaca: 'mechavaca' };

