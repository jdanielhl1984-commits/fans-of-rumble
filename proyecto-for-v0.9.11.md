# Fans of Rumble - MVP

**Versión:** 0.9.11 (sátira más clara, partida guiada, premio diario, logros, velocidad x2 e instalable en el móvil; va después de la 0.9.10) · **Última actualización:** 1 de octubre de 2026
**Para jugar:** https://jdanielhl1984-commits.github.io/fans-of-rumble/ (público, para amigos y testers; se abre en el móvil o en el PC)
**Prototipo de trabajo:** https://claude.ai/artifact/ANq12Z668PsMKNHz9gt7jk (privado, lo actualiza Claude en cada versión)

---

## Cómo trabajamos

- **Daniel:** director creativo e inversor. Prueba cada versión y dice qué le gusta y qué no.
- **Claude:** programa todo, dibuja el arte provisional y propone soluciones.
- Ciclo: Daniel da dirección → Claude entrega una versión jugable → Daniel prueba → se ajusta.
- Preferencias de Daniel: que le llame Daniel, explicaciones fáciles y paso a paso, archivos de código completos.

---

## Decisiones confirmadas

| Tema | Decisión |
|------|----------|
| Despliegue | Arrastrar cartas en tiempo real (también vale tocar la carta y luego el campo) |
| Ritmo | Lento y táctico: partidas de 4 minutos |
| Recurso | **CAOS** (sátira del elixir): 1 cada ~3 s, máximo 10, se duplica en el último minuto |
| Pantalla | Vertical, pensada para móvil |
| Progresión | Las unidades suben de nivel con XP (jugando) + oro, del nivel 1 al 10, cada nivel más caro (aprobado el 1 de octubre de 2026) |
| Monedas | Oro (se gana jugando y **también se podrá comprar con dinero real**, decisión de Daniel del 1 de octubre de 2026) y gemas (dinero real más adelante, para aspectos y tiradas) |
| Modelo de negocio | El oro es el cuello de botella a propósito: subir de nivel cuesta cada vez más oro y la tienda vende oro. La XP no se vende: siempre hay que jugar |
| Gashapón | Dos máquinas: habilidades para las unidades (de cualquier facción) y equipamiento solo para el líder (idea de Daniel y su colega) |
| Versiones 0.8 y 0.9 | Se hicieron juntas (petición de Daniel, 1 de octubre de 2026). Daniel prueba y luego se pule |
| **Sátira** | Microblizz es **una empresa millonaria que ha comprado (absorbido) el estudio que hacía tus juegos favoritos**: despide a la gente, recorta, pone robots y **cierra juegos**. Los textos van en lenguaje claro, **sin jerga de empresa**, para que lo entienda todo el mundo (Daniel, 1 de octubre de 2026) |
| Fase 2 o 3 (online) | Nivel de poder, rankings, arenas y PvP, y modo raid contra un megajefe. No se hacen hasta tener servidor (Daniel, 1 de octubre de 2026) |

## Decisiones que tomó Claude en la v0.3 (Daniel puede cambiarlas)

1. **2 carriles con río y puentes** en lugar de 1 carril. Da más estrategia con solo 3 cartas. Volver a 1 carril es fácil.
2. **Se gana tirando torres (coronas) o la sede enemiga.** CrazyBunny es una carta más: si muere, vuelve a estar disponible a los 12 s. El documento original decía "pierdes si muere tu líder".
3. **Costes enteros:** MadSquirrel 2 (salen 2 ardillas), SlyFox 3, CrazyBunny 5.
4. **SlyFox** es invisible hasta que ataca, su primer golpe hace x3 y vuelve a ser invisible 3 s cuando mata.
5. **Sin Phaser:** el juego está hecho en JavaScript y canvas propios, en un solo archivo y sin dependencias. Es más ligero y carga al instante en móvil.
6. **Mazo de 1 líder + 6 unidades (v0.4):** el líder siempre está disponible en su casilla; de las 6 unidades tienes 4 en la mano y una "siguiente". Al jugar una carta, entra la siguiente (como en Warcraft Rumble y Clash Royale).
7. **4 unidades nuevas diseñadas por Claude (v0.4), pendientes de que Daniel las apruebe:** BoomBeaver, MeerCat, JunkCoon y MechaVaca. El documento original solo nombraba a MadSquirrel y SlyFox.

---

## Qué tiene la v0.9.11 (1 de octubre de 2026): sátira más clara, partida guiada y las 7 mejoras

Pedido por Daniel tras probar la v0.9.10: remarcar que la sátira es de una empresa millonaria que compra otra, despide y cierra juegos, quitar la jerga de empresa, chat más grande, bajar el campo de batalla y que el dinero y las gemas no se solapen. Y hacer las 7 mejoras que propuso Claude («las 7 son todas geniales»).

### Sátira en lenguaje claro
- Todos los textos se han repasado con esa idea: campaña, misiones, tienda, pase, chat, frases de las tropas, titulares para compartir, frases del final y de los jefes. Ejemplos: el mundo 1 cuenta que «Microblizz, una empresa millonaria, ha comprado el estudio que hacía tus juegos favoritos. Lo primero: despedir a la gente y poner robots»; sus niveles son *La compra*, *Cartas de despido* y *Cierre del estudio*; SurvivalBot dice «Hemos comprado vuestro juego… y lo vamos a cerrar».
- Nombres que cambian para que se entiendan: las calidades ahora son **Básica, Normal, Buena, Excelente y Perfecta**; «evaluación de desempeño» es **Volver a tirar**; «proteger» es **Bloquear**; el pase es «Temporada 1: La Gran Compra»; mundos *Cementerio de juegos* y *Olimpo Abandonado*.

### Pantalla de combate
- **Chat más grande:** letra un 35 % más grande que en la v0.9.10, caja más ancha y como mucho 3 mensajes. El fondo es más transparente para que se vean las tropas de detrás.
- **Campo de batalla 40 píxeles más abajo:** la base enemiga ya no queda pegada al marcador. Arrastrar y soltar cartas sigue funcionando igual.
- **Oro y gemas sin solaparse** con el título ni salirse de su recuadro (probado en 4 tamaños de pantalla y con letra ancha).

### Las 7 mejoras
1. **Primera partida guiada.** Lola, una antigua trabajadora despedida por Microblizz, explica la historia en una frase y lleva de la mano: Campaña → nivel 1-1 → Jugar. En la partida salen pistas sin parar el juego (arrastra una carta, qué es el CAOS, mantén pulsada una carta, el objetivo). Al ganar regala la habilidad **Cafeína** y enseña a ponérsela al líder en Colección; después regala **3 tiradas** y lleva al Gashapón. Se puede saltar en cualquier momento y repetir en Opciones. Quien ya jugaba antes no lo ve.
2. **Premio por días seguidos.** Calendario de 7 días: 150 de oro, 20 gemas, 300 de oro, 1 tirada, 500 de oro, 40 gemas y **10 tiradas gratis** el día 7. Si un día no entras, vuelves al día 1. Sale al abrir el menú principal.
3. **Pack de bienvenida** en la tienda, una sola vez: 600 gemas + 5.000 de oro + un objeto épico de equipo con calidad Excelente o mejor, por 4,99 € (de prueba, no se cobra). Vale casi el doble que por separado.
4. **x10 con épica segura:** cada x10 trae al menos una épica o legendaria (la x50, cinco). La garantía de «épica cada 10 tiradas» ya existía; ahora los botones lo dicen y el código lo asegura aunque un día se cambie esa garantía.
5. **Velocidad x2** en las partidas: botón debajo del sonido, se recuerda para las siguientes. Junto con «Repetir» en la pantalla final, sirve para repetir niveles rápido. En la partida guiada va siempre a x1.
6. **Logros y notas del parche.** 16 logros con premio en gemas (pestaña «Logros» en Misiones), con nombres de humor: *Pesadilla de Microblizz*, *Despido masivo*, *Modo ballena*, *Compra cancelada*, *Fan de verdad*… A los jugadores de antes se les cuentan las facciones liberadas, los niveles subidos y el jefe final. **Novedades:** al entrar en una versión nueva sale una ventana con lo nuevo de verdad y las «Notas de Microblizz» de broma («Hemos cerrado tres juegos para pagar esta actualización»). También se abre desde Opciones.
7. **Instalar en el móvil como una app.** Desde la web del juego, el móvil ofrece «Instalar aplicación» o «Añadir a pantalla de inicio»: se abre a pantalla completa, con el icono del conejo, y **funciona sin internet**. En Opciones hay un botón **INSTALAR** que lo hace o explica cómo (Android y iPhone). Para esto hacen falta 5 archivos nuevos en GitHub (ver «Dónde está todo»).

### Otros arreglos
- Los avisos (logros, compras) salen arriba en los menús para no tapar los botones; en la partida siguen encima de las cartas.
- La pantalla final ya no enseña carteles que quedaban de la partida.

## Qué tiene la v0.9.10 (1 de octubre de 2026): tiradas múltiples, menú nuevo y ficha de carta

Pedido por Daniel tras probar la v0.9.9.

- **Gashapón x1, x10 y x50** en las dos máquinas. Cuestan 50, 500 y 2.500 gemas (sin descuento) y gastan primero las tiradas gratis. La x10 lleva la etiqueta «FAVORITA DEL CEO» y la x50, «MODO BALLENA» (sátira de quien más gasta). Cada tirada cuenta para las garantías. Las tiradas múltiples enseñan una cuadrícula ordenada por rareza y calidad, con un resumen («1 épica · 8 comunes · 1 Director o mejor · 5 nuevas») y etiquetas «NUEVA» y «MEJOR». Al tocar una copia se abre su ficha.
- **Logo:** las letras del menú vuelven a moverse un poco, como le gustaba a Daniel. Los cambios de pantalla siguen sin fundidos.
- **Nombres en las cartas de combate:** la letra del nombre y de la etiqueta se ajusta para que no se salga del recuadro (EpicChampion, ShieldMaiden…).
- **Ficha de carta:** en combate, si mantienes pulsada una carta (dedo o ratón) sin arrastrarla, sale una ficha con su rol (líder, tanque, a distancia, curandera, asedio, kamikaze…), su coste, vida y daño, qué hace, y la habilidad y el equipo del gashapón que lleva. Al soltar se cierra sin jugar la carta; si arrastras, se juega normal. También está explicado en «Cómo se juega».
- **Menú principal nuevo:** Gashapón y Tienda grandes y en color, con un aviso de tiradas gratis y del regalo diario. Debajo, en pequeño: Colección, Inventario, Pase, Misiones y Opciones. El oro y las gemas de arriba llevan un «+» y abren la tienda.

## Qué tiene la v0.9.9 (1 de octubre de 2026): calidades, inventario y arreglos de las pruebas

Pedido por Daniel tras probar la v0.9.8 con su amigo Víctor: quitar el mareo de los menús, que cada objeto salga con números distintos (idea de Daniel, aprobada con los ajustes de Claude), un inventario, ranuras de equipo más visibles y los arreglos que pidió Víctor.

### Arreglos de las pruebas de Víctor
- **Soltar tropas:** si sueltas la carta en el río o en el lado enemigo, la tropa sale en la línea límite de tu zona (antes no salía y daba error). Mientras arrastras, una línea punteada enseña dónde va a salir. Arrastrar muy rápido también funciona. Para cancelar, suelta la carta encima de las cartas.
- **Curanderas** (MeerCat, SnackMom, TechDroid y SoporteBot): van detrás de sus aliados (primero de los heridos y los cercanos) y nunca por delante del grupo. Si están solas, esperan delante de su torre en vez de ir a por las del enemigo. Ahora se ve cuándo curan: rayo verde hacia cada aliado, círculo, «+N» más grande y un círculo punteado que marca hasta dónde llegan.
- **Textos que no se leían:** los mensajes de las tropas («¡SORPRESA!», «¡GIGANTE!», «COFRE: …») duran el doble, llevan fondo oscuro y no se pisan entre ellos. Los números de daño siguen siendo rápidos. Los bocadillos de despedida duran más. Los carteles de arriba duran según lo largos que sean (de 2,6 a 4,8 s) y esperan su turno en vez de taparse.
- **Mareo en los menús:** se quitó el fundido al cambiar de pantalla (dejaba ver un destello del campo), el logo que se movía, el botón que latía y los rayos que giraban. Mientras estás en un menú, el campo de detrás se queda quieto. Las partidas siguen igual.
- Los avisos de abajo («Te falta oro…») ahora también se ven en los menús (antes quedaban detrás).

### Calidad de cada copia (gashapón)
- Cada habilidad y cada objeto sale con su **calidad** en cada efecto: del 50 % al 150 % de su valor central (decisión de Daniel: ±50 %). Por ejemplo, la Taza del becario cura entre el 0,5 % y el 1,5 % por segundo. Los números salen con decimales, así que casi no hay dos iguales.
- Si un objeto tiene varios efectos (Corona de hamburguesería: vida y daño), cada uno sale por separado. Que salgan todos altos es rarísimo.

| Calidad | Probabilidad de cada efecto | Rango de calidad |
|---|---|---|
| Becario | 30 % | 0-39 % |
| Junior | 40 % | 40-69 % |
| Senior | 20 % | 70-87 % |
| Director | 9 % | 88-98 % |
| **CEO** (tirada perfecta) | 1 % | 100 % |

- **Garantía:** calidad Director o mejor como mucho cada 10 tiradas (por máquina), además de las garantías de rareza que ya había. Las probabilidades de calidad se enseñan en la letra pequeña del gashapón.
- Al sacar algo, la tarjeta dice la calidad, los números, el rango posible y si es tu mejor copia («¡TU MEJOR COPIA!» o «Copia n.º 3 · tu mejor copia sigue siendo Senior»).
- Las repetidas ya **no suben de rango**: cada tirada es una copia nueva con sus números. Ya no se devuelven gemas por repetidas; las copias que no quieras se despiden por oro.
- Los premios del pase (Diploma y Corbata del CEO) salen siempre con calidad Director.
- **Partidas antiguas:** se convierten solas sin perder nada. Las habilidades conservan su valor exacto (una de ★★★ pasa a ser una copia Senior con el mismo número) y los objetos quedan igual que estaban.

### Inventario (botón nuevo en el menú)
- Todas tus copias en dos pestañas (Habilidades y Equipo), con filtros (rareza o tipo de objeto) y orden por calidad, rareza o nombre.
- Al tocar una copia: sus números con una barra por efecto, el rango posible, tus otras copias de lo mismo y quién la lleva. Botones:
  - **Equipar/Cambiar** (eliges la carta o el líder) y **Quitar**.
  - **Contrato indefinido:** candado para no despedirla por error.
  - **Despedir:** desaparece y da oro de «indemnización» según rareza y cargo: 25 (común), 60 (rara), 150 (épica) o 400 (legendaria), por 1 (Becario), 1,5 (Junior), 2 (Senior), 3 (Director) o 5 (CEO).
  - **Evaluación de desempeño:** pagas oro para volver a tirar todos sus números (250 común, 500 rara, 1.000 épica, 2.000 legendaria). Puede salir mejor o peor; mismas probabilidades, sin garantía.
- **Despido masivo:** despide de golpe las copias Becario y Junior que nadie lleva puestas, salvo las que tienen contrato indefinido y tu mejor copia de cada una. Pide confirmación y dice cuánto oro da.
- Los premios del pase tienen «contrato blindado»: no se evalúan ni se despiden.
- Ahora varias cartas pueden llevar la misma habilidad si tienes varias copias.

### Ranuras de equipo más visibles (Colección)
- Las ranuras son grandes: «HABILIDAD» en todas las cartas y «ARMA», «CABEZA» y «ACCESORIO» en el líder. Vacías tienen borde punteado; llenas enseñan el objeto con el color de su calidad.
- Un **número rojo** dice cuántas copias tienes sin usar para esa ranura.
- Frase de ayuda arriba de la lista y un paso nuevo en «Cómo se juega». Si no tienes nada para una ranura, la ventana te lleva al gashapón.

## Qué tiene la v0.9.8 (1 de octubre de 2026): jefes con música propia, chat por facción y pulido gráfico

Pedido por Daniel tras probar la v0.9.7 («me gusta todo»): música propia para cada jefe de mundo, más frases del chat sobre las facciones y pulir todos los gráficos (personajes, efectos, campo y menús).

### Un tema para cada jefe de mundo
| Mundo | Jefe | Estilo |
|---|---|---|
| 1 | SurvivalBot | Robot corporativo con «tecleo de oficina» en los platillos |
| 2 | NecroLord corrupto | Órgano de catedral, oscuro, con tambores graves |
| 3 | TwitchKing corrupto | EDM de directo patrocinado, con notas que «fallan» al azar |
| 4 | EpicChampion corrupto | Épica de guerra en menor, metales y tambores |
| 5 | CyberMarine corrupto | Darksynth industrial |
| 6 | MemeLord corrupto | Caos rapidísimo en una escala rara (de tonos enteros) |
| 7 y Modo Jefe | El CEO de Microblizz | La música de espera del menú… en versión malvada |

Los niveles normales de la campaña y la partida rápida siguen con la música de tu facción.

### Chat por facción
- Unas 10 frases nuevas por facción para el chat (más las de líder, torre, victoria y derrota). Por ejemplo, con Animales Locos: «¿la ardilla tiene seguro médico?»; con No-Muertos: «¿Renacer cuenta como horas extra?».
- Frases sobre la facción enemiga: Microblizz («SoporteBot: ¿ha probado a reiniciar?») o la corrompida de cada mundo («¡libéralos!»).
- Frases de cada jefe (el CEO: «ha traído 300 diapositivas»).
- Nombres de usuario de cada facción (LichDeGuardia, StonksMaster…).
- Despedidas al caer propias de cada facción («Vuelvo enseguida (literal)», «Batería al 0 %»…) y de las corrompidas al liberarse.

### Pulido gráfico
- **Personajes:** luz suave arriba y sombra abajo (más volumen), anillo dorado giratorio bajo los líderes y polvo al andar en las unidades grandes.
- **Efectos:** estrella de impacto en cada golpe, tajo en los ataques cuerpo a cuerpo, resplandor en críticos, muertes, explosiones, Chaos Jump, nube tóxica y curaciones. Al caer una torre hay un destello de pantalla y queda humo unos segundos.
- **Campo:** espuma en las orillas del río, destellos en el agua, ondas junto a los puentes, luz cálida desde arriba y bordes algo más oscuros. Ambiente en tu mitad según tu facción (mariposas, fuegos fatuos, corazones, motas doradas, bits de neón o confeti) y en la del enemigo (memorandos de Microblizz volando, o brasas rojas si es una facción corrompida).
- **Menús:** las pantallas aparecen con un fundido; el logo se mueve; el botón de Campaña late; los botones grandes tienen un brillo que pasa; el nivel siguiente y los jefes de la campaña llaman la atención; rayos girando detrás del gashapón y de la pantalla de victoria; los costes de las cartas que puedes pagar brillan.
- **Fluidez:** medida simulando un móvil lento, va igual que la v0.9.7. Quien tenga activado «reducir movimiento» en el móvil no ve las animaciones de adorno.

## Qué tiene la v0.9.7 (1 de octubre de 2026): música

Daniel eligió la **opción 1**: música creada por código, igual que los sonidos. Cuesta 0 €, no añade archivos (el juego sigue cargando al instante y funciona sin internet) y no tiene problemas de derechos. Suena a videoconsola retro. Para la 1.0 se puede cambiar por música libre de derechos o de un compositor sin tocar el resto del juego.

| Momento | Pista | Estilo |
|---|---|---|
| Menú y pantallas | Música de espera de Microblizz | Jazz de ascensor, tranquilo (sátira de la música de espera) |
| Combate con Animales Locos | Tema propio | Dibujos animados, saltarín |
| Combate con No-Muertos | Tema propio | Lento y gótico, con campanas de caja de música |
| Combate con Streamers | Tema propio | Pop de directo, con palmas |
| Combate con Héroes | Tema propio | Fanfarria épica con trompetas y marcha |
| Combate con Ciberpunks | Tema propio | Synthwave con arpegio |
| Combate con Memes | Tema propio | Rápido y raro, con notas al azar (como su pasiva RNG) |
| Jefes de mundo y Modo Jefe | Tema del jefe | Amenaza corporativa, rápido y oscuro |
| Victoria / derrota | Jingle corto | Fanfarria / «trombón triste»; luego vuelve el menú |

- **Último minuto (CAOS x2)** y **fase 2 del jefe**: la música acelera un 18 % y añade más platillos.
- Durante la cuenta atrás y la cámara lenta del final hay silencio, para que se oigan el «3, 2, 1» y el golpe final.
- **En pausa** la música se oye apagada, como de fondo.
- **Opciones → Música**: barra propia (por defecto al 70 %; al mínimo, se quita). El botón del altavoz sigue silenciando todo.
- Cuando el móvil cambia de app o se bloquea, el sonido se para.
- Se añadió un limitador suave para que música y efectos juntos no saturen.
- Los navegadores no dejan sonar nada hasta el primer toque: la música del menú empieza al tocar la pantalla.

## Arreglo v0.9.6 (1 de octubre de 2026)

Daniel vio unidades atascadas en la entrada del puente. Causa: todas intentaban pasar por el centro exacto del puente; si llegaban dos a la vez, se empujaban una a otra y ninguna llegaba al centro, así que se quedaban quietas para siempre. Ahora cada una cruza por su sitio dentro del ancho del puente y, al llegar a la entrada, sigue adelante aunque haya otra al lado. Probado con parejas y tríos de unidades pequeñas y grandes (SubSwarm, HypeBeast, BanHammer, ChonkCat, MechaVaca, StitchBrute, Hoplites): ahora cruzan todas.

## Qué tiene la v0.9.5 (1 de octubre de 2026)

Pedido por Daniel: tienda de oro y de gemas, más misiones diarias, misiones semanales, pase de batalla y más sátira para que se comparta en internet.

### Tienda de Microblizz (de prueba: no se cobra nada)
- Aviso visible arriba: «Versión de prueba: aquí no se cobra nada». Al «comprar» sale una confirmación con el precio y te lo llevas gratis.
- **Regalo del becario:** gratis una vez al día, 100 de oro y 5 gemas (para que quien no paga avance algo cada día).
- **Oro:** Puñado 1.000 (0,99 €) · Saco 6.000 (4,99 €) · Cofre 13.000 (9,99 €) · Cámara acorazada 28.000 (19,99 €) · Bóveda del CEO 75.000 (49,99 €).
- **Gemas:** Bolsita 100 (0,99 €) · Puñado 550 (4,99 €) · Saco 1.200 (9,99 €) · Cofre 2.600 (19,99 €) · Caja fuerte 7.000 (49,99 €).
- Los «% extra» que se enseñan son reales: se comparan con el pack más pequeño.
- **Paquete Accionista (broma, no se vende):** 1.000.000 de oro, ~~500 €~~ 100 €, «¡Oferta irrepetible! (se repite cada día)» con cuenta atrás. Al pulsar: «AGOTADO. Lo ha comprado el CEO con el dinero de tu bonus. El precio tachado nunca existió. Así lo hacen ellos. Aquí, no.»
- Si no tienes gemas para el gashapón, te ofrece ir a la tienda. El gashapón enseña lo que cuesta una tirada en euros (unos 0,50 €), como recomiendan las autoridades de consumo europeas.

### Misiones
- **Diarias:** ahora 4 al día, elegidas de 17 posibles (nuevas: juega 3 partidas, saca a tu líder 5 veces, gana sin perder torres, juega 2 de campaña, juega 2 rápidas, gasta 120 de CAOS, tira una base, gana con una facción concreta, recoge el regalo de la tienda…). Cada una: 50 de oro, 10 gemas y 60 puntos de pase.
- **Semanales (nuevas):** 4 cada semana, se renuevan el lunes, de 10 posibles (gana 15 partidas, despide a 400 enemigos, derriba 20 torres, consigue 12 estrellas, juega 200 cartas, 3 partidas del Modo Jefe, sube 5 niveles, gira 5 veces el gashapón, completa 12 diarias, gana 5 sin perder torres). Cada una: 300 de oro, 40 gemas y 250 puntos de pase.

### Pase de batalla «Temporada 1: Reestructuración» («dura hasta que Microblizz diga lo contrario»)
- 30 niveles de 400 puntos. Puntos: 100 por partida ganada, 40 por perdida, 60 por misión diaria y 250 por semanal. Jugando unas 5 partidas al día y haciendo las misiones, se completa en unas 2 o 3 semanas.
- **Pista gratis:** oro, gemas, 1 tirada gratis del gashapón en los niveles 10 y 20 y, al final, el **Diploma de Becario del Mes** (accesorio exclusivo: +8 % de vida y daño).
- **Pista Ejecutiva (4,99 €, de prueba):** más oro y gemas, 2 tiradas gratis cada 5 niveles y, al final, la **Corbata del CEO** (accesorio legendario exclusivo: +15 % de vida y daño, +10 % de velocidad; se ve puesta en el líder).
- Las tiradas gratis se gastan antes que las gemas en el gashapón. Los objetos del pase no salen en el gashapón.

### Más sátira
- **Botón COMPARTIR** al acabar cada partida: crea una imagen tipo portada de periódico («El Diario del Gamer · Última hora») con un titular de broma, tu líder, el resultado y el enlace del juego. En el móvil abre el menú de compartir; si no se puede, la enseña para guardarla. Titulares como «Microblizz pierde 2 torres: sus acciones caen un 0,0001 %» o «Microblizz gana una partida y lo celebra subiendo el precio del pase».
- **Frases de despedida:** al caer, los bots de Microblizz dicen cosas como «¿Hay indemnización?», «Me llevo la grapadora» o «Error 404: empleo no encontrado»; las facciones corrompidas, «¡Por fin libre!» o «Volveré… en el DLC»; y a veces tus unidades, «¡Ha sido el lag!».
- **Chat falso en directo** abajo a la izquierda, con usuarios inventados que reaccionan a la partida (torres, líder, jefe, último minuto, victoria o derrota) y comentan cosas como «nerf conejo» o «¿esto es pay to win?». Se puede quitar en Opciones.

---

## Qué tiene la v0.9 (0.8 y 0.9 juntas)

Daniel pidió hacer las dos versiones a la vez y pulir después. Todo lo de esta sección son **decisiones de Claude para tener algo jugable**; Daniel puede cambiar cualquier número o nombre.

### Menú nuevo
Pantalla de inicio con **Campaña** (botón grande), **Partida rápida**, **Modo Jefe**, **Colección**, **Gashapón**, **Misiones** y **Opciones**. Arriba se ven el oro y las gemas. Antes de cada partida hay una pantalla de preparación para elegir facción.

### Campaña "La Rebelión de los Fans"
- **7 mundos de 4 niveles** (el 4.º es el jefe del mundo). Se empieza **solo con Animales Locos**; al ganar al jefe de un mundo, **esa facción se une a ti** y llega con sus cartas a nivel parecido al del mundo, para que se pueda usar enseguida.
- Los enemigos de los mundos 2 a 6 son las facciones **corrompidas por Microblizz**: mismo dibujo pero en gris con ojos y aura rojos. Juegan con una IA nueva que sabe usar cualquier mazo (tanques delante, curanderos detrás, etc.).
- **Estrellas:** 1 por ganar, +1 si no pierdes ninguna torre, +1 si tiras la base enemiga.
- Los jefes de mundo usan las habilidades de jefe (congelar unidades y "Despidos masivos").

| Mundo | Enemigo | Niveles | Premio |
|---|---|---|---|
| 1. Oficinas de Microblizz | Becarios y bots (hace de tutorial) | Primer día · Reunión de equipo · Reestructuración · **SurvivalBot** | — |
| 2. Cementerio de IPs | No-Muertos corrompidos | Tumbas sin nombre · Fosa del crunch · Mausoleo corporativo · **NecroLord corrupto** | Desbloquea No-Muertos |
| 3. Plató Abandonado | Streamers corrompidos | Directo sin audio · Caída del chat · Oleada de baneos · **TwitchKing corrupto** | Desbloquea Streamers |
| 4. Olimpo en Mantenimiento | Héroes corrompidos | Templo en obras · Laberinto de tickets · Monte sin parche · **EpicChampion corrupto** | Desbloquea Héroes |
| 5. Sector Neón | Ciberpunks corrompidos | Callejón de neón · Red de drones · Servidor central · **CyberMarine corrupto** | Desbloquea Ciberpunks |
| 6. El Foro Infinito | Memes corrompidos | Hilo infinito · Moderación automática · Spam masivo · **MemeLord corrupto** | Desbloquea Memes |
| 7. Torre de Microblizz | Todos los bots de Microblizz | Recepción · Departamento de monetización · Sala de juntas · **El CEO de Microblizz** | Final |

**Dificultad:** los enemigos tienen nivel (del 1 en el mundo 1 al 9 contra el CEO) y reciben más o menos CAOS según el nivel. Se ajustó con partidas automáticas para que, con las cartas al nivel esperado de cada mundo, se gane casi siempre pero no sobrado. Es un primer ajuste: lo afinaremos con las partidas de Daniel.

### Bots nuevos de Microblizz
| Bot | Coste | Vida | Daño | Detalle | Sátira |
|---|---|---|---|---|---|
| CajaBotín | 3 | 320 | 10 | Al romperse suelta 3 becarios ("¡BOTÍN!") | Las cajas de botín |
| SoporteBot | 3 | 200 | 8 | Dron que cura a los bots cercanos | El soporte técnico |
| Parche Día 1 | 4 | 760 | 22 | Tanque: recibe un 30 % menos de daño | Los parches de lanzamiento |

### Niveles, oro y gemas
- Funciona como estaba aprobado: XP al jugar cartas (+30 % si ganas) y oro para subir, del 1 al 10, +6 % de vida y daño por nivel. Se sube en **Colección**.
- Se empieza con **150 de oro y 100 de gemas**.
- Premios: partida rápida 40 de oro (fácil) o 60 (normal); campaña 100 de oro y 10 gemas la primera vez, 30 al repetir, +50 de oro y 10 gemas por 3 estrellas, jefe de mundo 300 de oro y 50 gemas; perder da 10 de oro.

### Gashapón (pantalla con dos máquinas)
- Cada tirada cuesta **50 gemas**. Probabilidades: común 55 %, rara 30 %, épica 12 %, legendaria 3 %. **Garantía:** épica o mejor cada 10 tiradas y legendaria como mucho a las 50. Se enseñan en letra pequeña, como pedía la sátira.
- **Habilidades** (1 por unidad, de cualquier facción). Las repetidas suben la habilidad de rango (1 → 3); con rango 3, devuelven 15 gemas.

| Habilidad | Rareza | Efecto (rango 1 → 3) |
|---|---|---|
| Cafeína | Común | +15 → 30 % de velocidad |
| Piel dura | Común | +15 → 30 % de vida |
| Puños de hierro | Común | +12 → 24 % de daño |
| Reflejos | Común | Ataca un 12 → 24 % más rápido |
| Escudo de plasma (Ciberpunks) | Rara | Escudo del 20 → 30 % de la vida que se recarga |
| Sigilo inicial (Animales) | Rara | Invisible 5 → 9 s y primer golpe doble |
| Escarcha (No-Muertos) | Rara | Sus golpes frenan 1 → 1,6 s |
| Vampirismo | Rara | Se cura el 15 → 25 % del daño que hace |
| Rayo en cadena (Héroes) | Épica | Cada golpe salta a otro enemigo con el 50 → 70 % del daño |
| Provocación (Memes) | Épica | Los enemigos cercanos le atacan a él |
| Renacer (No-Muertos) | Épica | Revive una vez con el 40 → 60 % de vida |
| Grito (No-Muertos) | Épica | Cada 9 s aturde 0,8 → 1,2 s a los cercanos |
| Clon viral (Memes) | Legendaria | Al morir se divide en 2 copias con el 30 → 50 % de vida |
| Furia legendaria | Legendaria | Con menos de media vida, +30 → 50 % de daño y velocidad |

- **Equipo del líder** (3 huecos: arma, cabeza, accesorio; se ve dibujado sobre el líder). Los repetidos devuelven 15 gemas.

| Objeto | Hueco | Rareza | Efecto |
|---|---|---|---|
| Espada de cartón piedra | Arma | Común | +10 % de daño |
| Ratón de 16.000 DPI | Arma | Rara | +20 % de alcance y +10 % de daño |
| Teclado mecánico RGB | Arma | Épica | Ataca un 25 % más rápido |
| BanHammer de oro | Arma | Legendaria | +25 % de daño y cada golpe aparta |
| Casco con cuernos | Cabeza | Común | +15 % de vida |
| Corona de hamburguesería | Cabeza | Rara | +10 % de vida y de daño |
| Gorro de papel de aluminio | Cabeza | Épica | Inmune a las habilidades del jefe y +10 % de vida |
| Auriculares con cancelación de ruido | Cabeza | Legendaria | Inmune a aturdimientos y frenazos, +15 % de vida |
| Taza del becario | Accesorio | Común | Se cura un 1 % de la vida cada segundo |
| Pase de batalla caducado | Accesorio | Común | +3 % a todo. Algo es algo |
| Almohada de viaje | Accesorio | Rara | Si cae, vuelve un 40 % antes |
| Silla gamer portátil | Accesorio | Épica | Recibe un 15 % menos de daño |
| Cofre de botín sin abrir | Accesorio | Legendaria | Cada partida, un efecto sorpresa (o ninguno) |

### Modo Jefe
El CEO de Microblizz con 12.000 de vida, 3 minutos y sin torres. Ganas puntos por el daño que le haces; da oro según la puntuación y gemas la primera vez que pasas de 1.500, 4.000 y 8.000 puntos. Guarda tu récord.

### Misiones diarias (ampliadas en la v0.9.5, ver arriba)
Cada día salían 3 al azar (por ejemplo, "Gana 2 partidas", "Juega 20 cartas", "Despide a 40 enemigos", "Gira una vez el gashapón"). Cada una da 50 de oro y 10 gemas.

### Opciones y guardado
- Volumen.
- **Modo pruebas:** desbloquea todas las facciones y mundos y da 50.000 de oro y 5.000 gemas, para probar sin tener que jugar toda la campaña.
- **El progreso se guarda en el navegador** de cada móvil o PC. Para pasarlo a otro aparato: Opciones → Copiar código, y en el otro, Cargar código.
- Borrar todo el progreso.
- Música: barra de volumen propia (desde la v0.9.7).
- Abajo pone la versión (ahora "versión 0.9.10"), para comprobar que GitHub ya tiene la última.
- Chat en directo: sí o no (desde la v0.9.5).

---

## Qué tiene la v0.4

**Tu mazo (Animales Locos)**: se consulta en el juego, en el menú "Tu mazo".

| Carta | Rareza | Coste | Vida | Daño | Detalle | Guiño |
|-------|--------|-------|------|------|---------|-------|
| CrazyBunny | Líder | 5 | 500 | 25 | Chaos Jump cada 8 s: salta sobre el grupo enemigo y hace 50 de daño en área. Vuelve a los 12 s si cae | |
| MadSquirrel | Común | 2 | 150 (x2) | 15 | Rápidas, salen 2 | |
| BoomBeaver | Común | 2 | 100 | 180 a edificios | Kamikaze: corre a la torre y explota | Humor negro tipo Happy Tree Friends |
| SlyFox | Rara | 3 | 200 | 18 | Invisible hasta que ataca, golpe sorpresa x3 | |
| MeerCat | Rara | 3 | 190 | 8 | Sigue a tus tropas y cura 14 en área cada 1,2 s | Mercy (Overwatch) |
| JunkCoon | Rara | 4 | 240 | 26 en área | Lanza bolsas de basura explosivas a distancia | Junkrat (Overwatch) |
| MechaVaca | Épica | 5 | 950 | 24 | Tanque; al romperse el mecha sale la vaca (160 de vida) | D.Va (Overwatch) |

---

## No-Muertos (v0.6): segunda facción jugable

Se elige en el menú ("Tu facción"). Juegan con su propia base (**La Cripta**), torres de piedra con fuego verde que lanzan bolas de alma, y un campo más tétrico, con niebla, cruces y velas. Parodian World of Warcraft. El documento original daba NecroLord, SkullKnight y GhostMage; las otras 4 cartas las diseñó Claude y están pendientes de aprobación.

| Carta | Rareza | Coste | Vida | Daño | Detalle | Guiño |
|-------|--------|-------|------|------|---------|-------|
| NecroLord | Líder | 5 | 560 | 26 a distancia | Cada 8 s levanta 2 esqueletos a su lado. Vuelve a los 12 s si cae del todo | El Rey Exánime (corona de pinchos) |
| SkeletonCrew | Común | 2 | 75 (x4) | 12 | Cuatro esqueletos piratas rápidos | |
| CrunchZombie | Común | 3 | 140 (x3) | 16 | Programadores zombificados por el crunch: lentos y duros | Sátira del crunch en la industria |
| GhostMage | Rara | 3 | 170 | 28 a distancia | Rayos de escarcha que frenan al enemigo | |
| Banshee | Rara | 4 | 220 | 18 en área | Grita cada 7 s y aturde 1,2 s a los enemigos cercanos | Las banshees de WoW |
| SkullKnight | Rara | 4 | 520 | 32 | Espada rúnica de hielo: cada golpe frena | Caballero de la Muerte |
| StitchBrute | Épica | 5 | 1050 | 50, solo a edificios | Va directo a por las torres; al morir revienta en una nube tóxica (90 en área) | La Abominación de WoW |

**Pasiva Renacer:** cada no-muerto revive una vez, 1,1 s después de caer, con el 60 % de su vida (los esqueletos invocados no). Mientras tanto aparece una lápida, y la unidad sale de la tierra con un aura verde que indica que ya no le quedan más vidas.

**Equilibrio:** con la IA de pruebas, los No-Muertos ganan en Becario y van 3 a 3 en Ejecutivo. Para llegar ahí hubo que darles daño en área (las ondas de la Banshee), que la escarcha frene y que el StitchBrute vaya a por las torres.

---

## Las 4 facciones nuevas (v0.7): ya se juega con las 6

En el menú, "Tu facción" es ahora una cuadrícula de 6. Cada facción tiene su líder, 6 cartas, su pasiva, su base, sus torres (con su propio disparo) y su mitad del campo decorada. Del documento salen el líder y 2 unidades de cada una; las otras 4 cartas de cada facción las diseñó Claude y están pendientes de aprobación (en la tabla, marcadas con *).

### Streamers: base El Plató (parodia de Twitch y la comunidad)
Torres: aro de luz de streamer con un móvil que dispara corazones. Base: plató con pantalla gigante en directo. Campo con luces de neón, latas y cables.

| Carta | Rareza | Coste | Vida | Daño | Detalle |
|-------|--------|-------|------|------|---------|
| TwitchKing | Líder | 5 | 600 | 30 | En directo: los aliados cerca pegan +30 % (el documento decía +20 % con "espectadores") |
| SubSwarm* | Común | 2 | 110 (x3) | 14 | Tres suscriptores con dedo de espuma |
| HypeBeast | Común | 3 | 360 | 22 | Cuerpo a cuerpo y rapidísimo (bebida energética) |
| ViralBot | Rara | 3 | 190 | 20 a distancia | Cámara voladora: cada disparo aturde 0,4 s |
| SnackMom* | Rara | 3 | 220 | 8 | La madre del streamer: cura 16 en área |
| HypeTrain* | Rara | 4 | 580 | 50, solo a edificios | El tren del hype, directo a las torres |
| BanHammer* | Épica | 5 | 1000 | 32 en área | El moderador: tanque, cada martillazo da en área y aparta |

**Pasiva Hype:** cada bot despedido suma un espectador; cada 3, todo tu equipo ataca un 5 % más rápido (hasta +25 %). Si pierdes una torre, el chat se va y vuelve a 0. El botón de arriba muestra el progreso (por ejemplo, "2/3" o "+10 %").

### Héroes: base El Templo (parodia de Heroes of the Storm, dioses y mitología)
Torres: columnas griegas con un brasero que lanza rayos dorados. Base: templo con frontón y estatua dorada. Campo soleado con columnas rotas y monedas.

| Carta | Rareza | Coste | Vida | Daño | Detalle |
|-------|--------|-------|------|------|---------|
| EpicChampion | Líder | 5 | 640 | 32 | ¡Team Fight! cada 8 s: los aliados cercanos golpean a la vez con +50 % |
| CupidArcher* | Común | 2 | 125 | 15 a distancia | Querubín con arco y flechas de corazón |
| Hoplites* | Común | 3 | 160 (x3) | 16 | Tres soldados con escudo y lanza |
| ShieldMaiden | Rara | 3 | 420 | 18 | Valquiria: recibe un 35 % menos de daño |
| ThunderGod | Rara | 4 | 240 | 28 a distancia | Su rayo salta a otros 2 enemigos |
| Medusa* | Rara | 4 | 240 | 18 a distancia | Cada 8 s se baja las gafas y petrifica a los cercanos (1,4 s) |
| Minotaur* | Épica | 5 | 950 | 38 | Embestida: si llega corriendo, el primer golpe hace x2,2 y aturde |

**Pasiva Experiencia:** cada 3 bajas, todo tu ejército sube de nivel: +5 % de vida y daño, hasta nivel 5. Cada unidad lleva una estrella con el nivel.

### Ciberpunks: base El Búnker (parodia de StarCraft, hackers y soldados futuristas)
Torres: torretas con cañón de neón. Base: búnker con antena y parabólica. Campo oscuro con circuitos y postes de luz.

| Carta | Rareza | Coste | Vida | Daño | Detalle |
|-------|--------|-------|------|------|---------|
| CyberMarine | Líder | 5 | 560 | 13 a distancia, muy rápido | Orbital Drop: cada 9 s le caen 2 drones del cielo |
| NanoBots* | Común | 2 | 70 (x4) | 9 | Cuatro robots diminutos |
| CyberNinja* | Común | 3 | 280 | 24 | Se teletransporta hacia su objetivo cada 5 s |
| TechDroid | Rara | 3 | 200 | 8 | Droide de soporte: repara en área |
| HackerKid* | Rara | 3 | 150 | 12 a distancia | Hackea la torre enemiga más cercana: 3,5 s sin disparar (y el jefe tampoco lanza habilidades) |
| NeonSniper | Rara | 4 | 150 | 60 a distancia | Francotiradora: muy lenta y de muy lejos |
| SiegeMech* | Épica | 5 | 820 | 38 en área a distancia | Mecha de asedio con cañón |

**Pasiva Escudos:** cada unidad sale con un escudo de plasma del 25 % de su vida que absorbe el daño primero y se recarga si pasa 3 s sin recibir golpes. Se ve como una burbuja azul y una barrita azul encima de la vida.

### Memes: base El Foro (parodia de Hearthstone y la cultura viral)
Torres: pila de monitores viejos con caras y gorro de fiesta, que lanzan emojis. Base: un PC beige gigante con un bocadillo "LOL". Campo con emojis y "GG" pintados.

| Carta | Rareza | Coste | Vida | Daño | Detalle |
|-------|--------|-------|------|------|---------|
| MemeLord | Líder | 5 | 540 | 24 a distancia | Carta viral cada 7 s, al azar: curar, aturdir, bola de fuego o 2 perritos |
| SuchDog* | Común | 2 | 150 (x2) | 16 | Dos perros muy wow, rápidos |
| GifBlaster | Común | 3 | 200 | 11 a distancia, ráfagas | Dispara GIFs sin parar |
| SynthCat* | Rara | 3 | 210 | 24 en área a distancia | Gato con teclado: sus notas explotan |
| TrollBot | Rara | 4 | 680 | 16 | Provoca: los enemigos y torres cercanos le atacan a él |
| Stonks* | Rara | 4 | 460 | 30, solo a edificios | Cada golpe a un edificio pega un 15 % más que el anterior |
| ChonkCat* | Épica | 5 | 1100 | 26 | Gato enorme: cada 6 s se sienta encima y aturde a los cercanos |

**Pasiva RNG:** al salir, cada unidad recibe una mutación al azar y se anuncia con un texto: **gigante** (más grande, +50 % vida, +25 % daño, más lenta), **turbo** (+40 % velocidad y ataca un 33 % más rápido), **de cristal** (+60 % daño, -40 % vida, semitransparente) o **normal**.

**Equilibrio (v0.7):** primero se midió cada facción en una pelea controlada (el mazo completo contra el mismo ejército de Microblizz) y luego en partidas automáticas. En Becario (fácil) las 4 facciones nuevas ganan todas las partidas de prueba, casi siempre 3 a 0. En Ejecutivo (normal) los resultados de la IA de pruebas varían mucho de una tanda a otra; Streamers salía la más floja y se reforzó (más vida y daño, aura del +30 % y Hype cada 3 bajas). Es un equilibrio provisional: lo afinaremos con las partidas de Daniel.

---

## Pasivas de facción (idea de Daniel, v0.5)

Cada facción tiene una pasiva única que siempre está activa. Les da identidad sin añadir botones.

| Facción | Pasiva | Efecto | Guiño | Estado |
|---------|--------|--------|-------|--------|
| **Animales Locos** | **Rabia** | Cada unidad pega +10 % por cada aliado cerca (a unas 2 casillas), hasta +50 %. Premia ir en grupo y castiga el daño en área enemigo | Idea de Daniel; el caos de Happy Tree Friends | ✅ En el juego |
| **Microblizz** (enemigo) | **Despidos rentables** | Cada bot despedido le devuelve el 40 % de su coste en CAOS | Los despidos masivos de 2024 | ✅ En el juego |
| **No-Muertos** | **Renacer** | Cada unidad revive una vez con el 60 % de vida al morir (los invocados no) | Idea de Daniel; World of Warcraft | ✅ En el juego |
| **Streamers** | **Hype** | Cada baja enemiga suma espectadores; cada 3, +5 % de velocidad de ataque para todo el equipo (máx. +25 %). Si pierdes una torre, el chat se va y se reinicia | Twitch, TwitchKing | ✅ En el juego (v0.7) |
| **Héroes** | **Experiencia** | Cada 3 bajas, todo el equipo sube de nivel: +5 % de vida y daño (máx. nivel 5) | La XP compartida de Heroes of the Storm | ✅ En el juego (v0.7) |
| **Ciberpunks** | **Escudos** | Cada unidad tiene un escudo extra del 25 % de su vida que se recarga si pasa 3 s sin recibir daño | Los escudos protoss de StarCraft | ✅ En el juego (v0.7) |
| **Memes** | **RNG** | Al desplegarse, cada unidad recibe una mutación al azar: gigante, turbo, de cristal o normal (detalle arriba) | La aleatoriedad de Hearthstone | ✅ En el juego (v0.7) |

Cómo se ve en el juego: el botón de arriba a la izquierda muestra la pasiva de tu facción y, al tocarlo, explica qué hace. Rabia: aura naranja y una llama con las acumulaciones. Hype: aura morada y el contador en el botón. Experiencia: estrella con el nivel sobre cada unidad. Escudos: burbuja y barra azules. RNG: texto de la mutación al caer. La de Microblizz muestra "+0,4 CAOS" (o lo que corresponda) sobre cada bot despedido.

---

**Microblizz (IA)**

| Unidad | Coste | Vida | Daño | Sátira |
|--------|-------|------|------|--------|
| Becario | 2 | 130 (x2) | 13 | Bot con taza de café y acreditación |
| StarBot | 3 | 170 | 18 a distancia | "StarCraft olvidado", con telarañas |
| FallenHero | 5 | 800 | 34, solo ataca edificios | "Heroes descartado", cartel EN MANTENIMIENTO |

**SurvivalBot (jefe, encima de la Sede de Microblizz):**
- *Entierro de IP:* congela 2-2,5 s a tus unidades que cruzan a su lado.
- *Fase 2, a media vida, "Despidos masivos":* cartas de despido que dañan a todas tus unidades.

**Estructuras:** 2 torres por bando (1000 de vida) y una base (1800). Las tuyas cambian según tu facción (troncos, criptas, aros de luz, columnas, torretas o monitores); las de Microblizz son servidores con láser.

**Dificultad:** Becario (fácil) y Ejecutivo (normal). En Becario todas las facciones ganan con holgura en las simulaciones; Ejecutivo es exigente y queda más o menos igualado. La IA de Ejecutivo recibe un 25 % más de CAOS.

**Pulido:** personajes dibujados a mano en código, animaciones de caída, golpe, muerte y salto, números de daño, temblor de pantalla, sonidos sintetizados, tutorial animado y pantallas de inicio, pausa, cómo se juega y final.

---

## Progresión y economía (aprobado por Daniel, 1 de octubre de 2026)

Es lo que hará que quieras seguir jugando. Los números son un punto de partida y se ajustarán al probarlo.

### Niveles de las unidades (como en Warcraft Rumble)

1. Cada unidad gana **experiencia (XP)** cuando la usas: unos 10 XP por cada vez que juegas su carta, y un poco más si ganas.
2. Cuando su barra de XP se llena, aparece el botón **"¡Subir de nivel!"**, y subir cuesta **oro**. Hacen falta las dos cosas.
3. Cada nivel da **+6 % de vida y daño**. Nivel máximo: **10** (+54 % respecto al nivel 1). Los líderes suben igual.
4. El nivel se ve en la carta ("Nv 3").

| Subir de… | XP necesaria | Oro |
|---|---|---|
| 1 → 2 | 50 | 50 |
| 2 → 3 | 100 | 100 |
| 3 → 4 | 175 | 200 |
| 4 → 5 | 300 | 400 |
| 5 → 6 | 500 | 750 |
| 6 → 7 | 800 | 1.500 |
| 7 → 8 | 1.300 | 3.000 |
| 8 → 9 | 2.000 | 6.000 |
| 9 → 10 | 3.200 | 12.000 |
| **Total del 1 al 10** | **8.425** | **24.000** |

El nivel 2 sale en 1 o 2 partidas. Llevar una sola unidad al nivel 10 cuesta unas 90 partidas usándola: es un logro de verdad.

### Cómo se gana oro

| Acción | Oro |
|---|---|
| Ganar un nivel de la campaña por primera vez | 100 |
| Repetir un nivel ya superado | 30 |
| Sacar 3 estrellas en un nivel | +50 |
| Ganar al jefe de un mundo | 300 |
| Misión diaria (por ejemplo, "gana 3 partidas con Streamers") | 50 cada una |
| Perder una partida | 10 (nunca te vas con las manos vacías) |

### Dos monedas (monetización justa, como pide el documento original)

- **Oro:** se gana jugando y sirve para subir de nivel. **Cambio del 1 de octubre de 2026 (decisión de Daniel):** el oro también se venderá en la tienda por dinero real; es la principal fuente de ingresos. El oro es el freno a propósito (la XP llega mucho antes), y la XP no se vende, así que pagar acelera pero no salta el juego. Ya estaba en el documento original ("cristales premium para acelerar mejoras").
- **Gemas:** se comprarán con dinero real más adelante (y algunas se ganarán jugando). Sirven para aspectos (cambiar el look de un líder) y tiradas del gashapón.
- En el PvP futuro, los niveles se igualan o hay ligas por nivel, como en Warcraft Rumble.

### Gashapón de habilidades (para las unidades)

- La máquina da **habilidades, no unidades**. Cada unidad tiene **1 hueco** para una habilidad (un 2.º hueco se podría desbloquear más adelante).
- Las habilidades pueden salir de **cualquier facción**: un zombi con escudo de plasma, una ardilla que provoca… Es la mezcla de fandoms que da nombre al juego.
- La **pasiva de facción no sale en la máquina**: sigue siendo exclusiva de su facción para mantener su identidad.
- Rarezas, con ejemplos:

| Rareza | Ejemplo | Efecto |
|---|---|---|
| Común | Cafeína | +15 % de velocidad |
| Común | Piel dura | +15 % de vida |
| Rara | Escudo de plasma (Ciberpunks) | Escudo del 25 % de la vida que se recarga |
| Rara | Sigilo inicial (Animales Locos) | Sale invisible hasta su primer golpe |
| Épica | Rayo en cadena (Héroes) | Sus golpes saltan a 2 enemigos más |
| Épica | Provocación (Memes) | Los enemigos cercanos le atacan a él |
| Legendaria | Clon viral | Al morir se divide en 2 copias pequeñas |

- **Repetidas:** mejoran esa habilidad. En la v0.9 se hizo con rangos (1 a 3) en vez de fragmentos, que es más fácil de entender.
- En el campo, un **icono sobre la unidad** indica qué habilidad lleva.

### Gashapón de equipamiento (solo para el líder de la facción)

- Solo el líder se puede equipar. Tiene **3 huecos: arma, cabeza y accesorio**, y cada objeto **se ve dibujado sobre el líder**.
- Objetos "freak" con sátira, también por rarezas. Ejemplos:

| Objeto | Hueco | Efecto |
|---|---|---|
| Teclado mecánico RGB | Arma | Pega más rápido y cada golpe hace "clic" |
| Gorro de papel de aluminio | Cabeza | Inmune al Entierro de IP de SurvivalBot |
| Taza del becario | Accesorio | Se cura poco a poco |
| Cofre de botín sin abrir | Accesorio | Cada partida da un efecto al azar |

### Precauciones

- **Equilibrio:** con 28 unidades y muchas habilidades salen miles de combinaciones; habrá que probar y ajustar mucho.
- **Sátira:** la máquina es de **Microblizz** y enseña las probabilidades con letra pequeña. Habrá "garantía": tras cierto número de tiradas sin nada bueno, te toca algo raro o mejor.
- **Dinero real:** mientras el gashapón se pague con monedas del juego no hay problema. Antes de cobrar dinero real por tiradas hay que revisar la ley: en algunos países, como Bélgica, las cajas de botín de pago están prohibidas, y en España se ha intentado regularlas.

---

## Hoja de ruta hasta la versión 1.0 (aprobada el 1 de octubre de 2026)

La **1.0** es la primera versión publicable: un juego completo para un jugador, sin internet, que se instala en el móvil y engancha unas cuantas horas. Lo online viene después.

**Lo que ya tenemos (0.9):** combate completo, 6 facciones con líder, 6 cartas y pasiva, campaña de 7 mundos, niveles, oro y gemas, gashapón de habilidades y de equipo, Modo Jefe, misiones diarias, opciones y guardado, arte, sonido, tutorial, móvil y PC, y versión pública en GitHub.

### Versión 0.8: Campaña, oro y niveles ✅ (hecha junto con la 0.9)
- **Modo Campaña "La Rebelión de los Fans".** Microblizz ha fragmentado el universo y ha «reestructurado» a cada facción. Cada mundo tiene una facción corrompida por Microblizz (ojos rojos, logo corporativo) y su jefe. **Al liberar un mundo, esa facción se une a ti y se desbloquea como jugable.**
  - Mundo 1, *Oficinas de Microblizz*: becarios y bots; jefe SurvivalBot. Hace de tutorial.
  - Mundos 2 a 6: No-Muertos, Streamers, Héroes, Ciberpunks y Memes corrompidos, cada uno con su jefe.
  - Final, *Torre de Microblizz*: el jefe final de la corporación.
  - Cada mundo con 3 o 4 niveles y uno de jefe, estrellas por nivel y progreso guardado en el móvil.
- La IA aprende a jugar con cualquier mazo (no solo con el de Microblizz).
- **Oro y niveles** de las unidades, con su barra de XP y la pantalla para subir de nivel.

### Versión 0.9: Gashapón y más contenido ✅ (falta pulir con las pruebas de Daniel)
- Gashapón de habilidades y de equipamiento del líder, con pantalla de inventario.
- Más tipos de bots de Microblizz (ahora hay 6) y jefes distintos por mundo.
- Modo Jefe o Raid en solitario: un jefe gigante con fases, contra reloj y con puntuación.
- Misiones diarias.
- Pendiente: equilibrio ajustado con partidas reales de Daniel, su colega y más testers.
- Pantalla de opciones (hecha: volumen, modo pruebas y guardado). Pendiente: vibración y pruebas en móviles viejos.

### Versión 1.0: Lista para publicar
- Decidir el arte definitivo: seguir con este estilo dibujado o pasar al pixel art del documento (100-200 €).
- Música de fondo: ✅ provisional hecha con código (v0.9.7). Decidir si se cambia por música libre de derechos o de un compositor (50-300 €).
- Icono del juego: ✅ provisional, el conejo (v0.9.11). Cambiarlo cuando haya arte definitivo.
- **Instalable en el móvil** desde el navegador, como una app, y jugable sin conexión: ✅ hecho en la v0.9.11. Falta probarlo en móviles reales (Android e iPhone).
- **Cobrar de verdad** en la tienda y el Pase Ejecutivo (hace falta publicar la app; por ejemplo, Google Play gestiona los pagos y se queda una comisión). Antes, revisar las normas de consumo: precio en euros visible, nada de descuentos inventados y cuidado con los menores.
- Publicación en itch.io (gratis) y Google Play (25 €).
- Página sencilla con capturas para recoger opiniones.

### Después de la 1.0: online (necesita servidor y cuentas; coste bajo, por ejemplo con Supabase)
- **Nivel de poder** (idea de Daniel, 1 de octubre de 2026, para la fase 2 o 3): un número que suma tus cartas, sus niveles, habilidades y objetos (con su calidad). Cada cosa tendrá su valor de poder. Servirá para los rankings y para emparejar en arenas y PvP.
- **Rankings** para picarse por el mejor equipo. Necesitan servidor: ahora el progreso se guarda en cada móvil y se podría trucar, así que el poder se tendría que comprobar en el servidor.
- **Modo raid online** (idea de Daniel): mucha gente a la vez contra un megajefe.
- **Arena PvP asíncrona** (paso intermedio): te enfrentas al mazo de otro jugador manejado por la IA, con ranking.
- **PvP en tiempo real** con emparejamiento y rankings mensuales. Es lo más difícil técnicamente.
- **Raids cooperativos online** cada 15 días, cuentas, pase de batalla, tienda y gemas de pago.

Encaja con la "Fase 2: Financiación" del documento original: primero validar la campaña con jugadores reales.

---

## Próximos pasos

- [x] Música v0.9.7: a Daniel le gustó todo (1 de octubre de 2026).
- [x] v0.9.8 probada por Daniel y Víctor (1 de octubre de 2026): les gustó; pidieron los arreglos y las ideas de la v0.9.9.
- [x] v0.9.9 probada; Daniel pidió tiradas x10/x50, menú nuevo, ficha de carta y nombres que caben (hecho en la v0.9.10).
- [x] v0.9.10 probada; Daniel pidió sátira más clara y sin jerga, chat más grande, campo más abajo, cartera sin solaparse y las 7 mejoras (hecho en la v0.9.11).
- [ ] **Ahora: Daniel y Víctor prueban la v0.9.11**: la partida guiada desde cero (Opciones → Ayuda → TUTORIAL, no borra nada), el premio diario, el pack de bienvenida, los logros, la velocidad x2 y si se entienden los textos. Instalarlo en el móvil desde la web y probarlo sin internet.
- [ ] Ajustar con las pruebas: premios del calendario de 7 días, gemas de cada logro y precio del pack de bienvenida.
- [ ] Daniel prueba la v0.9.5 (tienda, pase, misiones semanales, compartir y chat) y la campaña desde cero, y apunta qué pulir: dificultad de cada mundo, premios, precios, textos de humor.
- [ ] Revisar las listas del gashapón y los premios del pase con el colega.
- [ ] Aprobar o cambiar las cartas diseñadas por Claude (marcadas con *), las 4 nuevas de Animales Locos y No-Muertos, y los 3 bots nuevos de Microblizz.
- [x] Notas del parche de broma y logros satíricos (v0.9.11).
- [ ] Idea de sátira pendiente: el CEO atacando con diapositivas.
- [ ] Decidir el estilo de arte definitivo (paso previo a la 1.0).
- [ ] Opcional: enlace corto (tinyurl.com, gratis) o dominio propio, por ejemplo fansofrumble.com (10-15 € al año).

---

## Presupuesto

| Concepto | Coste | Estado |
|----------|-------|--------|
| Motor / código | 0 € | Hecho en casa |
| Sonidos | 0 € | Sintetizados en el propio juego |
| Música | 0 € | Hecha con código (v0.9.7); opcional compositor 50-300 € para la 1.0 |
| Arte definitivo (pixel art) | 100-200 € | Pendiente |
| Google Play (cuenta de desarrollador) | 25 € | Pendiente |
| Marketing inicial | 100 € | Pendiente |
| Publicación web (GitHub Pages) | 0 € | Hecho |
| Dominio propio (opcional) | 10-15 € al año | Pendiente |
| **Reserva** | ~660 € | |

---

## Dónde está todo

| Qué | Dónde |
|---|---|
| Juego público | https://jdanielhl1984-commits.github.io/fans-of-rumble/ |
| Código en GitHub | https://github.com/jdanielhl1984-commits/fans-of-rumble: `index.html`, `README.md` y, desde la v0.9.11, los archivos de la app instalable: `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` y `icon-maskable.png` |
| Carpeta en el PC de Daniel | `D:\Proyectos personales\Fans Of Rumble` (juego, documentos, PDFs y la subcarpeta `Para GitHub`) |
| Este documento | En el Proyecto de Claude ("Fans of Rumble") y en la carpeta del PC |

**Cómo subir una versión nueva a GitHub:** Claude deja los archivos nuevos en la carpeta `Para GitHub`. En el repositorio, pulsa **Add file → Upload files**, arrastra los archivos y pulsa **Commit changes**. En 1 o 2 minutos el enlace público muestra la versión nueva. En la v0.9.11 hay que subir los 7 archivos (los 5 de la app solo esta vez); en las siguientes versiones normalmente basta con el `index.html`.

---

## Referencias

- PDFs originales del proyecto (en los archivos del Proyecto): resumen para programadores, proyecto completo y resumen general.
- Inspiración: Warcraft Rumble, Clash Royale y Brawl Stars.
- Sátira segura: nombres y diseños originales, con guiños y sin copiar assets de Blizzard.
