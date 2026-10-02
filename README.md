# Fans of Rumble

Juego táctico para móvil y PC inspirado en Warcraft Rumble, con humor: **Microblizz, una empresa millonaria, ha comprado el estudio que hacía tus juegos favoritos para despedir a todos y cerrarlos.** Tú lideras la rebelión de los fans.

## Cómo jugar

Abre el juego en el navegador, elige tu facción y arrastra cartas a tu lado del campo. Tira las torres o la sede de Microblizz para ganar. La primera vez, Lola (despedida por Microblizz) te guía paso a paso.

- Campaña 1 "La Rebelión de los Fans": 8 mundos contra Microblizz, con el sótano donde guardaba los juegos que canceló. Libera cada mundo y su facción se une a ti.
- Campaña 2 "La Era Digital": 4 mundos contra **Phony y su PayStation**, la consola sin lector de discos que te cobra la suscripción hasta en plena partida.
- Cada mundo se puede jugar después en **Difícil** (rivales casi al máximo y líderes equipados) y en **Mítica**, el verdadero desafío, con una ruleta semanal que da un castigo al jugador y una ventaja a la CPU.
- 9 facciones: Animales Locos, No-Muertos, Streamers, Héroes, Ciberpunks, Memes, Comunidad Gamer, Olvidados y Cultura Pop, cada una con su líder, 6 cartas y una pasiva propia.
- Las unidades suben de nivel (del 1 al 10) con experiencia y oro.
- **Gashapón de cartas** (v0.9.15): 27 hechizos y 9 mata-sanadores, 4 por facción. Los hechizos se lanzan en cualquier sitio (daño, cura y efectos locos como pulgas, baneo o remake) y los mata-sanadores saltan por encima de la primera línea. Las repetidas dan estrellas (+5 % cada una).
- **Mazo personalizado**: líder + 6 cartas de su facción, con 2 hechizos como mucho. Se edita en la Colección o antes de jugar.
- Gashapón de habilidades para las unidades y de equipo para el líder: cada copia sale con su propia calidad, de Básica a Perfecta. Tiradas x1, x10 y x50 (cada x10 trae al menos una épica). Habilidades y objetos de lo más raro: Rage quit, Modo foto, Baguette de ayer, Botón de pausa…
- Inventario con todas tus copias: equipar, volver a tirar sus números o despedirlas. El equipo se comparte: un objeto lo pueden llevar todos los líderes a la vez. Hay 9 objetos de facción más fuertes que da el jefe de cada mundo en Difícil.
- **HORAS EXTRA**: en el menú, tu líder sigue luchando solo aunque no juegues y gana oro, gemas y a veces objetos según su poder. Lo recoges cuando quieras (se llena a las 12 horas).
- Modo Jefe con los 12 jefes de la campaña, en Normal, Difícil y Mítica (4 minutos, premio extra si lo derrotas), misiones diarias y semanales y pase de batalla.
- Más de 1.800 logros que dan gemas, por categorías, con logros secretos y un botón para cobrarlos todos de golpe.
- Premio por entrar días seguidos (el día 7, 10 tiradas gratis) y pack de bienvenida.
- Velocidad x2 en las partidas.
- Tienda de prueba (no se cobra nada) y botón para compartir tu resultado como portada de periódico.
- Música propia para el menú, cada facción, cada jefe de mundo y el final de partida (se ajusta o se quita en Opciones).
- Chat falso en directo que comenta lo que pasa en la partida: tus cartas, las torres, los jefes, las remontadas…
- Zoom con dos dedos en combate y campos especiales en algunos jefes (el primero: un río de lava).
- Anuncios con premio (de prueba, solo si quieres) y «Sin anuncios» en la tienda.
- Funciona en el móvil y en el PC. **Se puede instalar como una app** (Opciones → Instalar) y funciona sin internet. El progreso se guarda en el navegador.

## Archivos

- `index.html`: la página del juego (botones y pantallas). Carga el resto de archivos.
- `css/estilos.css`: colores, tamaños y aspecto de los menús.
- `js/`: el código del juego, en 15 archivos que se cargan en orden (el número del nombre es el orden):
  - `01-config.js`: **todos los números del equilibrio** (vida, daño, costes de CAOS, torres). Para cambiar el balance, normalmente basta con tocar este archivo.
  - `02-progresion.js`: niveles, oro, gemas, gashapón y campaña.
  - `03-arte.js`: los personajes y edificios, dibujados con código.
  - `04-estado.js`, `05-audio.js` (sonidos y música), `06-combate.js` (unidades, ataques e IA), `07-dibujo.js` (pintar el campo), `08-controles.js` (arrastrar cartas).
  - `09-menus.js`, `10-dificultad.js` (Difícil, Mítica y ruleta), `11-logros.js`, `12-app-y-preparacion.js`, `13-horas-extra.js`, `14-cartas-y-jefes.js` (hechizos, mazo, Modo Jefe) y `15-arranque.js` (va el último).
- `manifest.webmanifest`, `sw.js` e iconos (`icon-192.png`, `icon-512.png`, `icon-maskable.png`): para instalarlo como app y jugar sin conexión.

Prototipo en desarrollo (versión 0.9.19). Todo el arte, el sonido y la música están hechos con código.
