# Música y sonido para redes: encontrar la canción, decidir cuántas y montarlas

> Investigado en noviembre de 2026. Las tendencias caducan en semanas, así que **las fuentes se consultan cada vez, nunca de memoria**. Etiquetas: [DOC] oficial, [PRACT] blog o herramienta del sector, [MEDIDO] medido por nosotros con `scripts/mapa_musical.py`, [INF] inferencia.
> Complementa `sonido-musica.md` (la teoría: síncresis, silencio, Murch, montaje de tráiler) y `licencias-librerias.md` (qué se puede usar). Lo que aquí se decide va a la sección I del documento de desarrollo (`desarrollo-de-recursos.md`).

## 0. Lo que más cuesta, en una frase

No se busca «una canción que guste». Se busca **la canción cuya estructura (compases, drops, huecos) encaja con el mapa de ritmo del guion, cuyo registro es el de la pieza, que el público del nicho reconoce sin que esté quemada y que la cuenta puede usar legalmente**. Si falla una de las cuatro, se descarta.

## 1. Primero el papel de la música (antes de buscar nada)

Decídelo en el documento de desarrollo:

| Papel | Cuándo | Consecuencia |
|---|---|---|
| **Lidera** (tráiler, montaje, edit, intro) | La pieza va de ritmo y emoción, la voz es corta | Se elige la canción **antes** de montar, se mide su mapa y el montaje se corta sobre sus compases. Whop: la música casi no baja bajo la voz, solo 2,8 dB [MEDIDO] |
| **Acompaña** (historia, testimonio, explicación) | Manda la voz | La música entra en los giros y baja de 8 a 12 dB bajo la voz (`sonido-musica.md`). Se elige **después** del corte en silencio, como Joe Walker |
| **Es el contenido** (trend de audio, lip-sync, formato de meme) | El chiste o el formato vive del audio | Tiene que ser el audio en tendencia real, añadido **dentro de la app**, porque su página de audio es parte del alcance |
| **No hay música** | Peso, documental, ASMR del producto | Ambiente, foley y silencio construido. Probar siempre esta opción (empática / anempática / ninguna) |

## 2. Licencia: qué catálogo puede usar esta cuenta

Esto va antes de enamorarse de una canción:

- **Instagram.** La biblioteca de música es para uso personal y no comercial. Las cuentas que no tienen acceso usan la Meta Sound Collection, con unas 14.000 pistas libres de derechos y válidas para uso comercial [DOC] ([Instagram Help](https://help.instagram.com/ipad-app/402084904469945)). Las cuentas de empresa suelen ver solo esa colección; según algunos proveedores, Meta también puede tratar como comercial una cuenta personal que monetiza [PRACT] ([Soundstripe](https://www.soundstripe.com/blogs/instagram-music-library)).
- **TikTok.** Las empresas usan la Commercial Music Library, que tiene un Top 100 de tendencias filtrable por país y género (cuentas Business) [PRACT] ([Metricool](https://metricool.com/es/canciones-tiktok/)).
- **Marca o cliente:**
  - No se descarga el mp3 de una canción comercial para hornearlo en el render.
  - Para música propia de la pieza, se usa librería con licencia de cliente (`licencias-librerias.md`) o música hecha a medida.
  - Para usar un audio en tendencia, se añade dentro de la app desde una cuenta que lo tenga disponible (creador o personal de un fundador). Antes, el cliente asume ese riesgo por escrito.
- **Parodias de canciones icónicas** (tráileres de GTA, películas): la canción original casi nunca se puede usar. Se roba el **mecanismo**:
  - época y género (la canción de los 80 del tráiler 2 de GTA VI);
  - tempo;
  - arco;
  - el silencio antes del logo.

  Con eso se busca una pista de librería o se encarga una a medida.

## 3. Dónde buscar (en este orden)

1. **Tu nicho, medido por ti.**
   - No existe una lista oficial de «las 200 canciones del emprendimiento».
   - Busca en Instagram y TikTok los **30 reels con más vistas del nicho en los últimos 30 días**: cuentas referentes, hashtags y búsquedas del tema.
   - Apunta el audio de cada uno en una hoja: audio, uso (lidera / acompaña / contenido), número de reels de su página y si tiene la flecha ↗.
   - Lo que se repite ahí es el código sonoro del nicho. Va al muro de códigos y se decide si se mantiene o se rompe.
2. **Instagram, dentro de la app:**
   - Panel profesional › Recursos y consejos › Audio en tendencia. Solo lo ven las cuentas profesionales y algunas fuentes dicen que solo en EE. UU.; se comprueba en la cuenta [PRACT] ([Buffer](https://buffer.com/resources/trending-instagram-audio/)).
   - La **flecha ↗** junto al nombre del audio en Reels: está subiendo.
   - La **página del audio**: dice cuántos reels lo usan.
   - La pestaña Tendencias del selector de música.
   - El feed de inspiración de la app **Edits**, con audio en tendencia (`instagram-meta-guion.md`).
3. **TikTok va por delante de Reels.**
   - Creative Center: Top songs y Commercial Music Library, con filtro España.
   - Lo que sube allí suele llegar a Reels unas semanas después [PRACT] ([Tokchart](https://tokchart.com/help/find-trending-tiktok-sounds-and-songs)).
4. **Herramientas de listas:**
   - Tokchart: diario, 126 países, «Radar» para detectar sonidos antes del pico, de pago; la promesa de predicción es del propio proveedor.
   - Chartmetric: tendencia de 28 días y comparador.
   - Soundcharts: lista de TikTok España.
   - Metricool: top semanal de TikTok y de Instagram con número de usos [PRACT] ([Chartmetric](https://help.chartmetric.com/en/articles/4208282-where-do-i-find-trending-tiktok-sounds); [Soundcharts](https://soundcharts.com/en/charts/tiktok/spain)).
   - Las listas generales (top 100/200/500) sirven sobre todo para saber **qué está quemado**, no para elegir.
5. **Playlists de género para edits** (phonk, funk brasileño, «motivation»), en Spotify y Apple Music. Útiles para el registro «edit de dinero o gym». Ojo: son de terceros y no miden uso real.
6. **Identificar** lo que suena en una referencia:
   - Shazam desde el móvil, o el nombre del audio abajo del reel con sesión iniciada.
   - Si no aparece, separar con Demucs (sección 6) y buscar la música sola.

## 4. Cómo elegir entre candidatas

Mide cada candidata con `python scripts/mapa_musical.py cancion.mp3`, que da BPM, compases, secciones, huecos y energía. Puntúa del 0 al 2 en cada criterio:

| Criterio | Pregunta | Cómo se comprueba |
|---|---|---|
| **Estructura** | ¿Hay un cambio de sección o drop donde el guion pone el giro? ¿Un hueco donde va el remate? | Sus `secciones_s` y `huecos_s`, comparados con el mapa de ritmo del documento |
| **Tempo** | ¿El pulso permite cortar donde el montaje lo necesita? | Tráiler y energía: 95-130 BPM. Peso: 60-80. Planos de 1-2 s = 2-4 pulsos a 100 BPM |
| **Registro** | ¿Dice lo mismo que la pieza, o lo contrario a propósito (anempática)? | El registro elegido en el desarrollo (`diferenciacion-registro.md`) |
| **Reconocible sin quemar** | ¿El nicho la reconoce? ¿Está subiendo o ya en la meseta? | Flecha ↗, curva de Tokchart y Metricool, número de reels. Un audio que crece vale más que uno con millones de usos. Un clásico del nicho puede servir por residual con intención [INF] |
| **Voz** | ¿La letra compite con la locución? | Nunca dos violetas: sin letra bajo la voz, o el instrumental |
| **Licencia** | ¿Esta cuenta la puede usar para esto? | Sección 2 |
| **Prueba del vecino** | Con otra marca encima, ¿funciona igual? | Si sí, la canción no aporta identidad. Vale en un trend; en una pieza de marca, no |

Se llevan **3 finalistas** al animatic: empática, anempática y ninguna, sobre el mismo corte. Decide Erik.

## 5. Cuántas músicas y cómo se montan

**Cuántas:**
- **1 canción** por defecto en piezas de menos de 45 s. Es la identidad del vídeo. Whop usa una sola canción en 41 s y la estructura la dan sus secciones [MEDIDO].
- **2** si hay un cambio de acto o de registro de verdad (de comedia a épica). El paso va escondido bajo un golpe, un silencio o un corte seco en el primer tiempo de compás.
- **3 como máximo**, en piezas de más de 60 s con tres actos (planteamiento, nudo y clímax). Cada cambio necesita un motivo en la historia; si no lo hay, se edita la misma canción (ver abajo).
- Una canción nueva sin giro se lee como «otro vídeo».

**Editar una sola canción para que dure lo que dura el vídeo:**
- Se corta en el **primer tiempo de compás** y se unen secciones del mismo tipo.
- El empalme se esconde bajo un golpe o un transitorio.
- El final de la canción se ancla al final del vídeo (backtiming), nunca un fundido.

**Cuándo entra, sube, para y vuelve:**
- **Los primeros 2 s funcionan en mudo.** La música puede empezar ya, pero el gancho no depende de ella.
- **Entrada:** en un primer tiempo de compás o justo después de un silencio. En un tráiler, la música puede entrar tarde, con el primer golpe del acto 2.
- **Cortes grandes** en primer tiempo de compás. **Cortes de energía** a contratiempo o cada 1-2 pulsos.
- **Parar:** se baja o se corta la música 0,5-1,5 s antes del remate, el chiste o la revelación. Que quede room tone o un solo sonido, y vuelve en el golpe (`sonido-musica.md`). En un tráiler, ese hueco va justo antes del título o del logo.
- **Subir:**
  - la energía crece hacia el clímax por secciones de la canción, no con el volumen;
  - nada de risers si Erik no los pide;
  - en otros proyectos ha pedido solo clics y pops, así que mira el gusto (`gusto.md`, `cerebro-erik`).
- **Bajo la voz:**
  - en pieza narrativa, de −8 a −12 dB;
  - en tráiler de frases cortas, casi nada (2-3 dB, como Whop), porque la voz va comprimida y entre frases manda la música [MEDIDO].
- **Final:** el final real de la canción, o un corte seco a silencio más la firma sonora de la marca.

## 6. Separar pistas (Demucs) y medir

Demucs (`pip install demucs`) separa voz y música, o batería, bajo, voz y resto (`--two-stems=vocals` para dos pistas). Sirve para:

1. **Medir una referencia sin su voz:** BPM, en qué compás corta, cuándo se calla, cuánto baja bajo la voz. Lo hace `python scripts/mapa_musical.py ref.wav --separar`.
2. **Sacar una pista guía** para cronometrar el animatic, sin publicarla.
3. **Quitar la voz a una canción** propia o con licencia que lo permita, para ponerla bajo locución.
4. **Separar el ambiente** de un clip para recolocarlo.

Ejemplo, el reel de Whop (41,7 s) [MEDIDO]:
- **Tempo:** 99,4 BPM, con un compás cada 2,42 s.
- **Secciones:** cambia en 3,2 / 7,6 / 11,3 / 28,2 / 33,0 s. El 33,0 coincide con el inicio del acto 3 (33,2 s).
- **Huecos:** solo el del final.
- **Bajo la voz:** la música solo baja 2,8 dB.

## 7. Efectos de sonido

**Capas, por función:**
- ambiente (da tiempo a las fotos y lugar a los planos);
- foley (el producto, las manos);
- puntuación (golpe en el corte, clic en la interfaz);
- firma de marca.

Ley de 2,5: no más de 2-3 sonidos del mismo tipo a la vez, ni más de 5 capas en total (`sonido-musica.md`).

**Racionamiento:**
- Un sonido destacado por idea, solo en eventos de jerarquía.
- En vídeos de juego o tráiler: los sonidos de la interfaz del juego (notificación, misión cumplida, dinero) son síncresis que cuentan el chiste. Se diseñan como sonidos propios, no se copian del juego.

**Fuentes:**
- librerías con licencia (Epidemic, Artlist, Soundstripe);
- Sonniss GDC (gratis y comercial);
- SFX de ElevenLabs (mira sus términos para clientes);
- grabación propia con el móvil para la firma de marca.

Ver `licencias-librerias.md`.

## 8. Entregable: hoja de sonido

Va en la sección I del documento de desarrollo y se aprueba con la tabla de recursos:

| Tiempo | Sección de la canción | Voz (frase) | Nivel música | SFX (función) | Por qué (fuente) |
|---|---|---|---|---|---|

Más:
- las 3 finalistas, con su mapa musical y su puntuación;
- la licencia de cada una;
- la decisión de Erik.

## 9. Señales de que la música está mal elegida

- Los cortes caen fuera de compás sin intención.
- El giro del guion no coincide con ningún cambio de la canción.
- La letra pisa a la voz.
- La canción se eligió porque estaba en un top general.
- No se sabe si la cuenta la puede usar.
- Hay dos o más canciones sin un giro que las justifique.
