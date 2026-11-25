# Producción sostenible de contenido orgánico con calidad de dirección

> Ronda 4 · Redes sociales · Frente: producción sostenible. Fecha de la investigación: 25-11-2026.
> Caso de aplicación: **Pieles APZ** (marroquinería de lujo de Ubrique, B2B), 2-3 vídeos por semana, sin cara del fundador, una persona produciendo (Erik) con DJI Osmo Pocket 3, móvil, IA de vídeo (Higgsfield, Seedance, Kling), stock, Remotion y DaVinci Resolve.

**Etiquetas.** [DOC] documentación oficial (plataforma, fabricante, ley). [ESTUDIO] encuesta o estudio con metodología pública. [ESTUDIO*] estudio de parte interesada (plataforma, patronal publicitaria). [CREADOR] practicante o reseñista con nombre. [PRACT] práctica de oficio extendida, sin fuente primaria verificada en esta ronda. [INFERENCIA] deducción mía: tómala como recomendación, no como hecho.

**Método y límites.** Sin WebSearch: WebFetch sobre páginas concretas y la API de Hacker News como buscador. Estaban bloqueados o fallaron: blogs de marketing (Hootsuite, Sprout, HubSpot, Buffer, Later), ayuda de Meta/Instagram, The Verge, Business Insider, CineD, DPReview y el manual PDF de DJI. Consecuencias: la **música de Meta para cuentas de empresa no está verificada**; los ajustes de la Pocket 3 se apoyan en ficha, FAQ, notas de firmware y una reseña, y el resto es [PRACT]/[INFERENCIA]; los métodos de agencias social-first van como inferencia.

---

## Takeaway general

1. **La calidad sostenible sale del sistema, no del talento de cada pieza**: una sesión de 2 h por bloques de proceso, con sonido aparte y plantillas por serie (Remotion: zod + `inputProps` + render en lote), da para unas dos semanas.
2. **En orgánico se pule la imagen y el sonido, no la gramática publicitaria**: TikTok pide "DIY or less polished"; Instagram penaliza marcas de agua, bordes, vídeos silenciados y "mostly text".
3. **La IA resta confianza cuando se nota y obliga a etiquetar cuando simula realidad** (Pew: 50 % más preocupado que entusiasmado; Gen Z: "inauthentic"; "slop", palabra de 2025; art. 50 del AI Act desde el 2-8-2026). En APZ, **manos, piel, taller y producto se graban siempre**.
4. **Sin cara no es sin personas**: manos, POV, proceso, voz en off y sonido del oficio sustituyen al fundador y separan a APZ del "faceless" automático.
5. **Música**: en TikTok, las empresas tienen que usar la Commercial Music Library. El foley propio es la solución legal y la firma sonora.

---

## Bloque 1 · Sistemas de producción

### Takeaway
Grabar por lotes, catalogar y montar con plantillas parametrizadas es lo que permite a una persona sostener 2-3 piezas/semana sin bajar el nivel. Remotion está hecho para ese caso: una composición = una serie, unas props = una pieza, y un script que renderiza todas.

### Hallazgos con cita

- **Props en cuatro pasos**: `defaultProps` (diseño en Studio) → `inputProps` con merge superficial ("input props take priority") → `calculateMetadata()` → componente. Con esquema, "Remotion validates the merged props during rendering". [DOC] https://www.remotion.dev/docs/parameterized-rendering
- **Zod**: `npx remotion add zod`, `schema={miEsquema}` + `defaultProps` que lo cumplan; el esquema decide los controles de edición visual en Studio; `zColor()` en `@remotion/zod-types`. [DOC] https://www.remotion.dev/docs/schemas
- **Pasar props**: `npx remotion render HelloWorld out/helloworld.mp4 --props=./path/to/props.json`; en servidor, el mismo `inputProps` en `selectComposition()` y `renderMedia()`. [DOC] https://www.remotion.dev/docs/passing-props
- **Lote desde dataset**: `bundle()` una vez y, en bucle, `selectComposition({serveUrl, id, inputProps: entry})` + `renderMedia({..., codec: 'h264', outputLocation: \`out/${entry.name}.mp4\`, inputProps: entry})`, en secuencia: no se recomienda paralelizar porque cada render usa casi toda la máquina. [DOC] https://www.remotion.dev/docs/dataset-render
- **`calculateMetadata`** devuelve `durationInFrames`, `width`, `height`, `fps`, `props` y nombre de salida por defecto. [DOC] https://www.remotion.dev/docs/calculate-metadata · Flags: `--props`, `--crf`, `--concurrency`, `--frames`, `--scale`, `--x264-preset`. [DOC] https://www.remotion.dev/docs/cli/render
- **Vídeo**: se recomienda `<Video>` de `@remotion/media` (`trimBefore`, `durationInFrames`, `playbackRate`, `objectFit`); no hay reproducción inversa. [DOC] https://www.remotion.dev/docs/media/video
- **Subtítulos**: `createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 1200})` (+ `breakOnSilenceAfterMilliseconds`, v4.0.514+); Whisper local con `@remotion/install-whisper-cpp` (`transcribe` con `tokenLevelTimestamps: true`, `toCaptions`, WAV a 16 kHz). [DOC] https://www.remotion.dev/docs/captions/create-tiktok-style-captions · https://www.remotion.dev/docs/install-whisper-cpp/
- **Licencia de Remotion**: gratis para "a for-profit organization with up to 3 employees"; por encima hace falta Company License. [DOC] https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md
- **Límite de las plantillas (YouTube)**: desde el 15-7-2025 la política se llama **"inauthentic content"** y no monetiza lo que "looks like it's made with a template" ni la IA sobre plantillas genéricas. Sí permite repetir intro/outro y series con un enfoque distinto en cada entrega. [DOC] https://support.google.com/youtube/answer/1311392
- **Límite del repurposing (Instagram)**: Instagram reduce la visibilidad de los reels con baja resolución, marcas de agua, silenciados, con bordes, "mostly text" o que repostean contenido ya publicado en Instagram (31-5-2023). [DOC] https://about.instagram.com/blog/announcements/instagram-ranking-explained
- **Protección de originales**: Meta extiende a Instagram (17-11-2026) la detección de copias de vídeos de creadores inscritos y prueba la detección por transcripción. [DOC vía prensa] https://www.socialmediatoday.com/news/meta-expands-content-protection-to-instagram/874965/

### Inferencias

- **"Una grabación → N piezas", bien entendido** [INFERENCIA]: no se trata de trocear un vídeo largo, sino de grabar **cada proceso con cobertura completa** (general, medio, detalle, macro, POV, foley aislado) para que de un mismo bloque salgan: (1) la pieza de proceso de 20-30 s; (2) un loop ASMR de 7-12 s; (3) planos para el banco que alimentan piezas futuras (B2B, catálogo, cierres); (4) fotogramas para carrusel o stories. Así el repurposing respeta la regla de Instagram: no se republica la misma pieza, se remonta material con una idea distinta.
- **Plantilla de serie ≠ plantilla genérica** [INFERENCIA, apoyada en la política de YouTube]: la plantilla fija la caja (tipo, márgenes, curva, firma sonora, cierre) y deja libre el contenido (cada pieza, un proceso o una idea distintos). Si dos piezas seguidas se pueden confundir, la serie se ha convertido en "inauthentic content".
- **Arquitectura de Remotion para APZ** [INFERENCIA sobre la documentación citada]: una `Composition` por serie (`APZ-Oficio`, `APZ-Materia`, `APZ-Taller`), 1080×1920 a 25 fps; esquema zod con lo variable (`titulo`, `clips[]` con `src`/`trimBefore`/`duracion`/`velocidad`, `rotulos[]`, `vo`, `foley[]`, `cierre`); `calculateMetadata` suma clips → `durationInFrames` y nombra la salida `AAAA-MM-DD_serie_slug`; `piezas.json` semanal → `render.mjs` secuencial. Color (D-Log M → Rec.709) y limpieza de sonido, antes, en Resolve: Resolve = imagen, Remotion = sistema. Para Whisper en español, modelo multilingüe (no `medium.en`).
- **Banco de assets** [INFERENCIA]: carpeta por sesión (`2026-12-02_taller_corte`) con `A-roll`, `B-roll`, `foley`, `roomtone`, `stills`; archivos `proceso_plano_toma` (`cosido_macro_03`); hoja de catálogo con proceso, plano, movimiento, duración útil, luz, perfil de color, **pieza de cliente visible (NDA)** y **usos ya hechos** (para no quemar un plano estrella).
- **Calendario** [INFERENCIA]: una sesión cada 1-2 semanas y un bloque de edición semanal, con 3 series rotatorias. La decisión creativa semanal se reduce a qué proceso toca en cada serie.

### Huecos
- No he podido leer fuentes primarias de agencias social-first sobre su método de lotes (GaryVee Content Model, guías de batching de Hootsuite/Sprout/HubSpot: bloqueadas). No cito cifras de "N piezas por grabación" porque no las he verificado.
- No he verificado el precio de la Company License de Remotion (la página de precios falló). Nowrage es "equipo muy pequeño": si tiene más de 3 empleados, necesita licencia.

---

## Bloque 2 · Oficio con móvil y Osmo Pocket 3

### Takeaway
La Pocket 3 tiene un sensor de 1", 10-bit D-Log M/HLG y estabilización en tres ejes, pero también **apertura fija f/2.0, enfoque mínimo de 20 cm y una exposición automática que tiende a aclarar**. Para un taller de piel lo que marca la diferencia es: exposición manual, obturador coherente con los fps, luz lateral suave que saque la textura del cuero, sonido grabado aparte y movimientos de gimbal lentos y motivados.

### Hallazgos con cita

- **Ficha** [DOC] https://www.dji.com/osmo-pocket-3/specs: CMOS de 1"; 20 mm eq., f/2.0, enfoque desde 0,2 m; 4K a 24-60 fps; cámara lenta 4K/120 y 1080p/240; ISO de vídeo 50-6400; 130 Mbps; H.264/HEVC; 3 micros; vertical 9:16 (p. ej., 1080×1920). Producto: "10-Bit D-Log M & HLG", "ActiveTrack 6.0", pantalla giratoria, compatibilidad con Mic 2/Mic Mini, "Glamour Effects 2.0". https://www.dji.com/osmo-pocket-3
- **FAQ** [DOC] https://www.dji.com/osmo-pocket-3/faq: D-Log M = perfil plano de amplio rango para etalonar; ActiveTrack "is not supported in Low-Light, Panorama, Slow Motion, and Timelapse modes"; la orientación "is locked" al empezar a grabar; corta los archivos hacia 16 GB sin pérdida; la Mic 2/Mic Mini se enlaza directamente; la velocidad de giro del gimbal es ajustable.
- **Firmware** [DOC] https://dl.djicdn.com/downloads/DJI_Osmo_Pocket_3/RN/20250826/DJI_Osmo_Pocket_3_Release_Notes_en.pdf: D-Log M/HLG 10-bit también a 120 fps y **copia .wav del micro interno**; modo **FPV-⊥** para vertical (15-5-2024); dos transmisores Mic Mini (26-11-2024); **Med-Tele 2x** (40 mm, hasta 4K, ISO ≤1600, sin ActiveTrack) (18-2-2025).
- **Reseña** [CREADOR] Adam Juniper, Digital Camera World, 25-10-2023 https://www.digitalcameraworld.com/reviews/dji-osmo-pocket-3-review: LUT de DJI "very accurate"; la exposición automática aclara; falla el foco por debajo de 20 cm; imanes para ND; con Mic 2 en 32 bits es "genuinely difficult" saturar.
- **DJI Mic 2** [DOC] https://www.dji.com/mic-2: 32 bits flotante interno, cancelación de ruido, 14 h de grabación interna.
- **Movimiento motivado** [PRACT] StudioBinder: push-in = "tension or intimacy"; lo eficaz son los "deliberate and motivated camera movements". https://www.studiobinder.com/blog/different-types-of-camera-movements-in-film/
- **Room tone** [DOC enc.]: se intercala para suavizar cortes; sin él, el sonido "going dead" parece un fallo; se graba con el micro en la misma posición. https://en.wikipedia.org/wiki/Room_tone

### Inferencias: receta de ajustes para APZ

**Cámara (Pocket 3)** [INFERENCIA salvo donde se indica]
- **Fotogramas**: 25 fps de base; red de 50 Hz en España, así que 25/50 fps evitan el parpadeo de fluorescentes y LED baratos [PRACT]. 50 fps para ralentizar al 50 %; 4K/120 solo en el gesto hero (sin ActiveTrack [DOC]).
- **Obturador**: ~1/50 a 25 fps (180°) para un desenfoque natural de las manos [PRACT]. Con la apertura fija f/2.0 [DOC], en interior se controla con ISO y luz; junto a una ventana con sol, **ND magnético**. Sin ND, el movimiento sale "a saltos", una señal de amateur [PRACT].
- **Exposición**: manual o bloqueada en Pro; la automática aclara [CREADOR] y quema la flor del cuero oscuro.
- **Color**: **D-Log M** en las sesiones planificadas (luz mixta, igualar sesiones; el color de la piel es el producto) con el LUT de DJI como base en Resolve; **Normal/HLG** en capturas rápidas. Sin mezclar perfiles dentro de un bloque.
- **Orientación**: 4K 16:9 y reencuadre si el material servirá también en horizontal (web, LinkedIn, catálogo B2B); vertical nativo si es solo para Reels/TikTok. Se bloquea al grabar [DOC]. La resolución vertical máxima actual no está verificada: compruébala en el menú.
- **Macro**: por debajo de 20 cm falla [DOC + CREADOR]; **Med-Tele 2x** desde 30-40 cm o adaptador macro de terceros (no verificado). Enfoque por toque, no AF continuo con manos cruzando.
- **Glamour Effects desactivado** siempre: suaviza la textura que vende la piel [INFERENCIA].
- **Gimbal**: Tilt Locked/Follow a velocidad baja; FPV-⊥ en vertical; ActiveTrack solo para seguir una pieza que mueve una mano.
- **Móvil = cámara B**: plano general fijo en trípode durante todo el bloque. Da cortes gratis y un plano de seguridad.

**Audio** [INFERENCIA salvo donde se indica]
- Transmisor de Mic 2 en **32 bits flotante con grabación interna** [DOC] pegado al banco, a 20-40 cm de la herramienta y no de una persona: foley limpio de cuchilla, hilo encerado, martillo y plegadora sin saturar [CREADOR].
- Segundo transmisor o copia .wav interna [DOC] para el ambiente.
- **Room tone** de 30-60 s al principio y al final de la sesión [PRACT].
- **Foley wild**: 5-10 repeticiones de cada gesto, solo para sonido.
- La VO, aparte, en una habitación con mantas y con la Mic 2 a un palmo.

**Luz** [PRACT/INFERENCIA]
- Ventana como luz principal **lateral y algo rasante**: dibuja grano y poros; la frontal los aplana. Difusión con cortina o papel vegetal si hay sol directo.
- Relleno blanco (cartón pluma) y **negativo negro** para que el cuero no quede gris.
- Apoyo: panel LED con CRI ≥95 difuminado, a la temperatura de color de la ventana. Nunca mezclar.
- En cuero brillante y herraje, mueve la luz hasta que el reflejo dibuje la forma, no un punto quemado.

**Encuadre vertical, manos y producto** [INFERENCIA]
- Gesto en el centro-alto del 9:16: abajo van la descripción y la interfaz.
- Manos siempre con contexto (herramienta + material): unas manos solas parecen stock.
- Escalas por proceso: general, medio, detalle, macro del resultado y POV a la altura del pecho.
- Producto: bodegón sobre superficie de taller, giro a mano, cierre y herraje, plano de uso sin cara.

**Movimientos que se ven premium y los que se ven amateur** [INFERENCIA apoyada en el principio de movimiento motivado de StudioBinder]

| Premium | Amateur |
|---|---|
| Push-in lento de 1-2 s hacia el gesto mientras ocurre | Zoom digital "en directo" |
| Deslizamiento lateral con parallax (algo en primer término: retal, carrete) | Barridos rápidos sin motivo ni destino |
| Pedestal ascendente que revela la mesa | Seguir con ActiveTrack algo que no se mueve |
| Plano fijo (gimbal en Lock) cuando el gesto ya es el movimiento | Moverse a la vez que las manos se mueven (dos movimientos compiten) |
| Arco corto (15-30°) alrededor del producto terminado | Órbita de 360° (recuerda a vídeo de producto de stock y delata el gimbal) |
| Empezar y terminar el movimiento quieto (aire para cortar) | Grabar solo el movimiento, sin margen al principio y al final |
| Velocidad de giro baja y pasos de "ninja walk" | Rebote vertical al andar y horizonte que deriva |

### Huecos
- No he podido leer el manual en PDF (robots) para confirmar los nombres exactos de los modos del gimbal, el rango de obturación en Pro ni la ISO mínima en D-Log M. Antes de fijar la receta, compruébalos en el menú.
- No he verificado reseñas de laboratorio (rango dinámico y rolling shutter de CineD; DPReview falló).
- No he verificado accesorios ND ni macro concretos (Freewell falló).

---

## Bloque 3 · Contenido sin cara

### Takeaway
La presencia humana funciona (TikTok la recomienda incluso en anuncios), pero no exige cara: unas manos trabajando, el punto de vista del artesano y su voz son presencia humana. El "faceless" genérico está asociado hoy a canales automáticos de IA y plataformas como YouTube están desmonetizando ese patrón. Para APZ, lo que diferencia es la **textura de lo real**: el proceso, el sonido, el error corregido, el tiempo.

### Hallazgos con cita

- TikTok, buenas prácticas creativas (jun-2025): "Feature people such as creators, employees, or customers"; estilo "DIY or less polished" que se funda con el contenido de usuarios; subtítulos o texto a 5-10 palabras por segundo; gancho en los primeros 6 s; proposición central en los primeros 3 s. [ESTUDIO*/DOC] https://ads.tiktok.com/help/article/creative-best-practices
- YouTube "inauthentic content" (15-7-2025): no monetizan los slideshows de imágenes, el texto desplazándose con poco valor narrativo ni el contenido de IA sobre plantillas genéricas "that lacks the creator's original perspective". [DOC] https://support.google.com/youtube/answer/1311392
- Instagram reduce la visibilidad de las piezas "mostly text". [DOC] https://about.instagram.com/blog/announcements/instagram-ranking-explained
- El ecosistema "faceless" está lleno de herramientas que generan vídeos de forma automática (decenas de "Show HN" de 2024-2026 con generadores de vídeos faceless con IA). Es una señal de saturación, no un estudio. [INDICIO] https://hn.algolia.com/api/v1/search?query=faceless%20youtube%20channel&tags=story
- Detonantes típicos del ASMR: susurro, golpecitos sobre superficies duras, crujidos (papel, tela) y "atención personal cercana". Caso de marca: anuncio de Michelob Ultra en la Super Bowl LIII (3-2-2019), con susurros y golpecitos en la botella ante dos micrófonos. [DOC enciclopédica] https://en.wikipedia.org/wiki/Autonomous_sensory_meridian_response
- YouTube no exige etiquetar la clonación de la propia voz para voces en off o doblajes ("Cloning one's own voice to create voice overs or dubs"). [DOC] https://support.google.com/youtube/answer/14328491

### Inferencias: técnicas sin cara para APZ y cómo sostener la calidad

1. **Manos como personaje**: siempre las mismas manos, reales y cuidadas. Crean continuidad sin rostro.
2. **POV del artesano**: a la altura del pecho, con el horizonte bloqueado; 1-2 planos por pieza.
3. **Proceso con principio y fin** (20-30 s): material crudo → 3-5 gestos → resultado en macro. Engancha el cambio de estado.
4. **ASMR de oficio** (7-12 s, sin música): cuchilla, hilo encerado, martillo, plegadora, cepillo de canto. Golpecitos y crujidos son los detonantes documentados.
5. **Producto como personaje**: la pieza viaja de puesto en puesto con el mismo encuadre y *match cut*.
6. **Archivo**: fotos del taller o de Ubrique con permiso, en cámara 2.5D lenta en Remotion. Sin "animar caras" con IA.
7. **Texto que apoya**: gancho + 2-3 rótulos como máximo; si se entiende solo leyendo, es "mostly text".
8. **Voz en off del fundador** (solo audio): su criterio ("por qué rebajamos este canto así") es el diferenciador B2B. Clonar su voz, solo con consentimiento escrito.
9. **B2B visual**: capacidad, tolerancias, prototipo frente a producción y plazos explicados con objetos. **NDA**: ni logos, herrajes firmados ni patrones reconocibles de clientes sin permiso.

**Calidad sin cara** [INFERENCIA]: sin rostro, la expresión la ponen **sonido, luz y tempo**. Cada serie tiene firma sonora, luz reconocible y ritmo propio.

### Huecos
- No he encontrado (por los bloqueos) datos comparativos de rendimiento entre vídeos con cara y sin cara para marcas. Ninguna cifra que veas por ahí al respecto está verificada aquí.

---

## Bloque 4 · IA en contenido orgánico (2025-2026)

### Takeaway
La percepción empeora y etiquetar ya es obligatorio en las tres plataformas y en la UE. Regla práctica: **lo realista que no ocurrió (lugar real, proceso, persona) se etiqueta; los retoques, los fondos extendidos y lo no realista, no.** Para una marca de oficio, la pregunta previa es "¿estamos fingiendo artesanía?". Si la respuesta es sí, no se hace.

### Hallazgos: percepción del público

- **Pew Research** (17-9-2025; 5.023 adultos de EE. UU.; trabajo de campo del 9 al 15-6-2025): el 50 % está más preocupado que entusiasmado por la IA (37 % en 2021); el 76 % considera muy o extremadamente importante poder distinguir si una imagen, vídeo o texto lo ha hecho una IA o una persona; el 53 % no confía en saber distinguirlo. [ESTUDIO] https://www.pewresearch.org/science/2025/09/17/how-americans-view-ai-and-its-impact-on-people-and-society/
- **Reuters Institute, Generative AI and News Report 2025** (7-10-2025; unas 2.000 personas por país en Argentina, Dinamarca, Francia, Japón, Reino Unido y EE. UU.): solo el 26 % se siente cómodo con que la IA cree una imagen realista cuando no existe foto real; el 62 % prefiere noticias hechas íntegramente por humanos (4 puntos más que en 2024); el 12 %, noticias hechas por completo con IA. [ESTUDIO] https://reutersinstitute.politics.ox.ac.uk/generative-ai-and-news-report-2025-how-people-think-about-ais-role-journalism-and-society
- **IAB + Sonata Insights, "The AI Ad Gap Widens"** (15-1-2026; 505 consumidores Gen Z y millennials de EE. UU., 104 directivos): el 82 % de los directivos cree que esos consumidores ven bien los anuncios con IA, pero solo el 45 % lo hace; el 39 % de la Gen Z los ve de forma negativa (21 % en 2024) y asocia las marcas que usan IA con "inauthentic" (30 %) y "unethical" (24 %); más de la mitad quiere que se revele el vídeo con IA; al 73 % saberlo no le reduce la intención de compra. [ESTUDIO*] https://www.iab.com/insights/the-ai-ad-gap-widens/
- **"Slop", palabra del año 2025** (Merriam-Webster): "digital content of low quality that is produced usually in quantity by means of artificial intelligence". [DOC] https://www.merriam-webster.com/wordplay/word-of-the-year
- **Casos de rechazo**: Coca-Cola (navidades de 2024 y 2025), McDonald's Países Bajos (diciembre de 2025: cerró comentarios y retiró el vídeo), Svedka en la Super Bowl LX (febrero de 2026); en enero de 2026, YouTube puso reducir el slop entre sus prioridades. [DOC enc., verificar caso a caso] https://en.wikipedia.org/wiki/AI_slop
- **Mosseri**, 1-1-2026, "Authenticity After Abundance": solo he podido verificar los titulares (Business Insider: "polished feed is 'dead' thanks to AI"), no el texto. [PRENSA, titular] https://hn.algolia.com/api/v1/search?query=Mosseri&tags=story&numericFilters=created_at_i%3E1764547200

### Hallazgos: normas de etiquetado (verificadas)

- **YouTube** [DOC, sin fecha visible] https://support.google.com/youtube/answer/14328491
  - **Hay que revelarlo** si es realista y: hace que una persona real parezca decir o hacer algo, altera metraje de un evento o lugar real, genera una escena realista que no ocurrió o crea música que es el foco. Ejemplo literal: "AI generated extra footage of a real place, like a video of a surfer in Maui for a promotional travel video".
  - **No hace falta**: lo no realista, filtros de belleza, color o luz, desenfoque, ayuda de producción (guion, miniatura, título), subtítulos, reescalado, clonar la propia voz, "AI generating or extending a backdrop".
  - Etiqueta automática con herramientas de YouTube, **metadatos C2PA** o detección propia, y entonces no se puede quitar. Incumplir de forma reiterada puede llevar a la retirada o a la suspensión del YPP.
- **TikTok** [DOC, sin fecha visible] https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content: "We also require creators to label all AI-generated content that contains realistic images, audio, and video". Las correcciones menores no cuentan. Etiqueta automática con efectos de TikTok o **C2PA**, imposible de quitar. Etiquetar no afecta a la distribución. Puede retirar lo realista engañoso sin etiquetar. El 22-11-2026 lanzó un verificador público de su marca de agua de IA. [PRENSA] https://www.socialmediatoday.com/news/tiktok-adds-new-ai-transparency-and-parental-controls/875424/
- **Meta** [DOC]:
  - 6-2-2024 (Clegg): obligación de usar la herramienta de etiquetado en orgánico "with a photorealistic video or realistic-sounding audio that was digitally created or altered", con posibles penalizaciones. https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/
  - "AI info" desde el 1-7-2024; desde el 12-9-2024, la etiqueta del contenido solo editado va al menú. https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/
  - 5-11-2026: la Graph API v27.0 permite añadir o quitar la autodeclaración. [PRENSA] https://www.socialmediatoday.com/news/meta-adds-new-capabilities-to-graph-and-marketing-api/873951/
- **AI Act, art. 50** (desde el 2-8-2026) [DOC] https://artificialintelligenceact.eu/article/50/: quien despliega IA que genera un *deep fake* de imagen, audio o vídeo "shall disclose". En obra "evidently artistic, creative, satirical, fictional", basta una revelación que no estorbe. *Deep fake* (art. 3.60) incluye parecerse a personas, objetos, **lugares** o eventos existentes y parecer falsamente auténtico. https://artificialintelligenceact.eu/article/3/
- **España**: el Consejo de Ministros aprobó el anteproyecto de ley de IA el 11-3-2025 (título de la nota de prensa). **No he verificado** su contenido sobre etiquetado y sanciones ni su estado de tramitación a noviembre de 2026. [DOC, solo titular] https://digital.gob.es/comunicacion/notas-prensa/mtdfp/2025/03/2025-03-11.html

### Inferencias: dónde aporta la IA en APZ y dónde no

- **Sí** (bajo riesgo, en general sin etiqueta obligatoria según las listas de YouTube y TikTok): preproducción (guiones, listas de planos, ganchos, portadas), extensión de fondos para reencuadrar en vertical, reescalado y limpieza de audio, subtítulos, y transiciones o texturas claramente no realistas (piel que se vuelve grafismo, mapa estilizado de Ubrique).
- **Con etiqueta y criterio**: B-roll **realista** de un lugar real (la sierra, calles de Ubrique). Es justo el ejemplo de YouTube que exige revelación. Mejor grabarlo o usar stock real con licencia.
- **No**: manos, caras, procesos, producto de APZ, piezas inexistentes, "artesanos" generados, voces sin consentimiento. Las manos y la textura fina delatan a los modelos [PRACT], es lo que la Gen Z llama "inauthentic" [ESTUDIO*] y desmiente el activo de la marca: que lo hacen personas en Ubrique.

**Política de verdad para APZ** [INFERENCIA]
1. Ningún producto, acabado, capacidad ni instalación que APZ no tenga.
2. La IA realista se etiqueta en la plataforma y en el texto.
3. La IA no "mejora" la piel: ni color engañoso ni texturas inventadas.
4. Los clips de Higgsfield, Seedance o Kling se pasan por https://verify.contentauthenticity.org/ antes de publicar: con C2PA, YouTube y TikTok etiquetan solos y sin vuelta atrás [DOC].
5. Registro interno de cada asset de IA (prompt, herramienta, fecha).

### Huecos
- No he verificado qué herramientas (Higgsfield, Seedance, Kling) incrustan C2PA o marca de agua visible en cada plan. Compruébalo exportando y verificando.
- No he verificado si TikTok tiene hoy un control para ver menos contenido de IA en el feed, ni el texto completo de Mosseri.
- No he podido leer los estudios de Billion Dollar Boy ni de Raptive sobre el rechazo al contenido de IA de creadores (sitios inaccesibles). No uso sus cifras.

---

## Bloque 5 · Estilos de edición para orgánico

### Takeaway
"Nativo" no significa "descuidado": significa **gramática de plataforma** (vertical, gancho inmediato, subtítulos, sonido activo, sin marcos ni marcas de agua, ritmo marcado por el contenido) aplicada a **imagen y sonido cuidados**. El anti-polish que recomienda TikTok es contra la estética de anuncio (rótulos corporativos, transiciones de plantilla, locución de spot), no contra la buena luz.

### Hallazgos con cita
- TikTok (jun-2025): "DIY or less polished"; transiciones y gráficos para sostener la atención; texto a 5-10 palabras/s; gancho ≤6 s y proposición ≤3 s; usar sonido; 9:16 ≥720p y zona segura (plantillas descargables, act. jun-2026). [ESTUDIO*/DOC] https://ads.tiktok.com/help/article/creative-best-practices · https://ads.tiktok.com/help/article/video-ads-specifications
- Instagram resta visibilidad a lo de baja resolución, con marca de agua, silenciado, con bordes o "mostly text". [DOC] https://about.instagram.com/blog/announcements/instagram-ranking-explained
- "As much as 85 percent of video views happen with the sound off" (Facebook, Digiday, 17-5-2016): es un dato antiguo que justifica los subtítulos, no una cifra actual. [ESTUDIO* antiguo] https://digiday.com/media/silent-world-facebook-video/
- Edits (Meta, 12-11-2026) añade curvas de velocidad, balance automático de audio y duración de las animaciones de texto: lo nativo se acerca a lo profesional. [PRENSA] https://www.socialmediatoday.com/news/metas-edits-app-gets-speed-curves-and-auto-audio-balancing/874586/

### Inferencias
- **Edición por formato** [INFERENCIA]:

  | Formato | Duración | Planos | Texto | Sonido | Grado de edición |
  |---|---|---|---|---|---|
  | Loop ASMR | 7-12 s | 3-5, largos (1,5-3 s) | 0-1 línea | Solo foley | Mínimo; el corte en el sonido |
  | Proceso | 20-35 s | 8-14 | Gancho + 2 rótulos | Foley + música de librería baja | Medio; cortes en el gesto |
  | B2B "explica" | 35-60 s | 12-20 | Subtítulos de VO | VO + foley + música | Alto, pero sin grafismo de anuncio |
  | Carrusel o still | n/a | 5-8 fotogramas | Titular por lámina | n/a | Color y tipografía |

- **Nativo** [INFERENCIA]: el primer fotograma ya es acción, sin logo de entrada ni cortinillas. Subtítulos con el tipo de la marca, pero colocados como los nativos. El cierre es un plano (producto + sonido de remate), no un *end card*. La marca se reconoce por el sistema (luz, foley, tipo), no por un sello.
- **Ritmo**: se corta en el gesto; el foley marca el tempo. Si manda la música, parece un anuncio.
- **Subtítulos**: con VO, siempre, en páginas de 1-1,2 s. Sin VO, un rótulo descriptivo ("Rebajado de canto, 0,6 mm"). Hasta 20-32 caracteres por línea en 9:16 (ver `limpio-premium.md`).
- **Color**: para que la piel sea creíble. Nada de *teal & orange* ni de LUT que cambien el producto.

### Huecos
- No he podido verificar estudios recientes (2025-2026) que comparen el rendimiento de lo lo-fi frente a lo pulido en orgánico de marca. La recomendación de TikTok es para anuncios y la plataforma es parte interesada.

---

## Bloque 6 · Música y sonido

### Takeaway
En TikTok, una cuenta de empresa **no puede usar la biblioteca general con fines comerciales**: o usa la Commercial Music Library (CML) o necesita una licencia propia. En Meta no he podido verificar la norma actual. La estrategia sostenible para APZ: **foley propio como protagonista**, música de librería con licencia comercial como colchón y tendencias solo si están en la CML.

### Hallazgos con cita
- TikTok CML (act. julio de 2025): "a pre-cleared global music library of 1 million songs", gratuita; "Businesses cannot use the general music library for commercial usage"; la CML cubre "all commercial TikTok activities", también el orgánico (dúos y stitches incluidos); los sonidos originales de otros usuarios requieren licencia propia. [DOC] https://ads.tiktok.com/help/article/commercial-music-library
- La música es el motor de descubrimiento de TikTok: el 94 % de las canciones del Billboard Global 200 de 2025 tuvo un momento viral en TikTok antes de subir en la lista (Music Impact Report, 18-11-2026). [ESTUDIO*] https://www.socialmediatoday.com/news/tiktok-releases-2026-music-impact-report/875144/
- YouTube exige revelar la música generada con IA que sea "the main focus of the video". [DOC] https://support.google.com/youtube/answer/14328491
- Instagram resta visibilidad a los reels "muted". [DOC] https://about.instagram.com/blog/announcements/instagram-ranking-explained

### Inferencias
- **TikTok de APZ** [INFERENCIA]: como cuenta de empresa, solo CML o sonido propio. Una tendencia de la biblioteca general es un riesgo legal y, para el lujo, también de tono.
- **Meta** [no verificado]: las directrices de música y la ayuda de Instagram estaban bloqueadas. **Comprueba en la app y en las directrices vigentes** qué catálogo ve una cuenta de empresa. Por defecto: librería con licencia comercial.
- **Librerías de pago** (Artlist, Epidemic…) [no verificado]: confirma que la licencia cubre cuentas de clientes de agencia.
- **Foley como firma** [INFERENCIA]: 30-50 sonidos del taller nombrados por gesto, de los que sale un logo sonoro (clic de cierre + golpe de martillo). Es legal, único y "real".
- **Mezcla** [PRACT/INFERENCIA]: foley delante y música 12-18 dB por debajo en el gesto; room tone continuo; unos -14 LUFS es la práctica habitual (no verificado en la documentación de las plataformas).
- **Música con IA**: YouTube exige revelarla si es el foco [DOC]; como colchón, revisa los términos comerciales de la herramienta.

### Huecos
- Normativa de música de Meta para cuentas de empresa en 2026: **no verificada**.
- Sanciones concretas de TikTok por usar la biblioteca general en una cuenta de empresa: la página de la CML no las detalla.

---

## Sistema semanal para APZ (1 persona, 2-3 piezas/semana)

[INFERENCIA, construida sobre los hallazgos anteriores]

### Las tres series (rotación fija)
1. **Oficio** (proceso de 20-30 s): un gesto o proceso del taller de principio a fin. Foley más un gancho de texto. Una a la semana.
2. **Materia** (loop ASMR o macro de 7-15 s): la piel, el canto, la puntada, el herraje. Sin música. Una a la semana.
3. **Taller para marcas** (B2B, 35-60 s, cada dos semanas): la VO del fundador (solo audio) explica una decisión de fabricación (tolerancias, prototipo, control de calidad, plazos) sobre planos del banco. Las semanas que no toca, se sustituye por un carrusel de fotogramas o una segunda pieza de Materia.

### Sesión de rodaje de 2 h (cada 1-2 semanas, en el taller)

| Min. | Qué | Detalle |
|---|---|---|
| 0-15 | Preparación | Ventana como luz principal lateral + cartón blanco y negro. Pocket en Pro, 25 fps, 1/50, ISO fijo, WB fijo, D-Log M, Glamour desactivado. Mic 2 en grabación interna 32 bits pegado al banco. Room tone de 60 s. Claqueta de palmada al empezar cada bloque. |
| 15-75 | 2 bloques de proceso (30 min cada uno) | Por proceso, cobertura completa: general en el móvil sobre trípode (toda la toma) + Pocket: medio, detalle, macro con Med-Tele 2x, POV, 1 push-in y 1 deslizamiento con parallax; 120 fps solo en el gesto hero. Al terminar, 5-10 repeticiones del gesto solo para el foley. |
| 75-100 | Producto terminado | Bodegón en la mesa del taller, giro a mano, apertura y cierre, herraje en macro, arco corto, plano de uso sin cara. Fotos fijas desde el vídeo. |
| 100-115 | B-roll de banco | Atmósfera: pieles en la estantería, herramientas colgadas, luz en la ventana, carretes, retales, la puerta del taller, cajas de envío. Planos fijos de 6-8 s cada uno. |
| 115-120 | Cierre | Room tone final, revisión de la tarjeta y nota rápida de NDA (qué piezas de cliente han salido en plano). |

Rendimiento esperado: 2 bloques de proceso → 2 piezas de Oficio + 2-3 loops de Materia; más el producto y el B-roll → material para 1-2 piezas B2B. **Una sesión cubre unas dos semanas.**

### Semana tipo (unas 10-11 h)

| Día | Tarea | Tiempo |
|---|---|---|
| Lunes | Decidir las piezas de la semana: qué proceso o idea toca en cada serie; guion de la VO B2B (se manda al fundador para que lo grabe en audio); lista de planos de la próxima sesión | 1 h |
| Martes | Sesión de rodaje (semana sí, semana no) **o** grabación de la VO y selección del banco | 2 h + 0,5 h de volcado |
| Miércoles | Volcado y catálogo (hoja de assets), selección, etalonaje base en Resolve (LUT de D-Log M + ajuste de tono de piel), limpieza y mezcla del foley, exportación de clips etalonados | 2,5 h |
| Jueves | Remotion: rellenar `piezas.json` (clips, rótulos, VO, foley y cierre por pieza), revisar en Studio, render en lote; Whisper para los subtítulos de la VO | 2,5 h |
| Viernes | Revisión en el móvil (zona segura, legibilidad, volumen), etiquetado de IA si toca, textos, programación y lectura de las métricas de la semana anterior | 1,5 h |

### Qué se genera con IA (y qué no)
- **Sí**: variantes de gancho y de texto, extensiones de fondo para reencuadres verticales, texturas o transiciones abstractas no realistas, limpieza de audio, subtítulos, y storyboards o previsualizaciones para planear la sesión.
- **Excepcionalmente, con etiqueta**: un plano establecedor realista de paisaje genérico si no se puede grabar. Preferible grabar Ubrique un día al mes.
- **Nunca**: manos, procesos, producto, taller, personas.

### Qué se reutiliza
- Del banco: B-roll de atmósfera (rotación controlada con la columna "usos"), foley (la biblioteca crece cada sesión), cierres de producto y archivo.
- De Remotion: composiciones por serie, tipografía, curvas, firma sonora y cierre. Cambia solo el contenido.
- No se reutiliza: la misma pieza publicada otra vez en la misma plataforma (Instagram penaliza republicar) ni el mismo plano hero en dos piezas seguidas.

### Plantilla de producción por pieza (ficha)

```
PIEZA: AAAA-MM-DD_serie_slug
Serie: Oficio / Materia / Taller para marcas
Idea en una frase (qué cambia de estado o qué decisión se explica):
Gancho (≤3 s, primer fotograma = acción):
Público: marca compradora / profesional / curioso
Estructura (beats con duración):  1) gancho  2) desarrollo  3) resultado  4) cierre-plano
Planos (del catálogo, con ID): ...
Plano hero:
Sonido: foley (IDs) / VO (sí-no) / música (pista + licencia + ¿CML?) / room tone
Texto en pantalla (≤3 líneas, ≤32 caracteres/línea):
Subtítulos: sí (VO) / no
IA usada: ninguna / tipo + herramienta + ¿realista? → ¿etiqueta?
NDA: ¿aparece pieza o marca de cliente? sí/no → permiso
Color: perfil de origen + LUT + nota de tono de piel
Duración objetivo / real:
Comprobación final en el móvil: zona segura · legible sin sonido · suena bien con sonido · sin marca de agua · no "mostly text"
Publicación: plataformas · texto · etiqueta IA · fecha
Métrica a mirar (retención a 3 s, guardados, mensajes B2B):
```

---

## Chuleta: 30 reglas (efecto buscado → recurso → por qué → cuándo romperla)

| # | Efecto buscado | Recurso | Por qué | Cuándo romperla |
|---|---|---|---|---|
| 1 | Que cada pieza tenga sentido | Idea en una frase antes de grabar | Sin idea, la serie se convierte en plantilla ("inauthentic content") [DOC YT] | En sesiones de exploración pura para el banco |
| 2 | Sostener el volumen | Grabar por bloques de proceso con cobertura completa | Un bloque da Oficio + Materia + banco [INF] | Si hay un hecho único (pedido especial) que no se repetirá: grábalo ya |
| 3 | No quemar planos estrella | Columna "usos" en el catálogo | Evita repetir y la sensación de reciclado [INF] | Planos-firma de cierre que deben repetirse a propósito |
| 4 | Movimiento natural | 25 fps, 1/50 | 180° y 50 Hz: desenfoque de movimiento y sin parpadeo [PRACT] | Gotas, chispas o hilos que quieras congelar: obturador rápido |
| 5 | Controlar las luces en exterior o junto a la ventana | ND magnético | La apertura es fija f/2.0 [DOC] | En interior con poca luz, ya no hace falta |
| 6 | Piel con el color real | Exposición y balance de blancos manuales | La exposición automática aclara [CREADOR] | Planos en movimiento entre luces muy distintas, con prisa |
| 7 | Margen de color entre sesiones | D-Log M 10-bit + LUT de DJI | Rango dinámico y etalonaje [DOC] | Capturas rápidas: Normal o HLG |
| 8 | Textura del cuero | Luz lateral rasante de ventana | La luz lateral dibuja el grano; la frontal lo aplana [PRACT] | Para un look clínico o de catálogo (fondo blanco) |
| 9 | Negros con cuerpo | Negativo (tela negra) en el lado de sombra | Evita el cuero gris por rebote [PRACT] | Piel clara o tonos pastel: relleno blanco |
| 10 | Macro nítido | Med-Tele 2x desde 30-40 cm | Por debajo de 20 cm no enfoca [DOC] | Con adaptador macro probado |
| 11 | Textura honesta | Glamour Effects desactivado | Suaviza lo que vendes [INF] | Nunca en producto |
| 12 | Gesto hero memorable | 4K/120 fps solo en 1 gesto | La cámara lenta pierde fuerza si se usa siempre; sin ActiveTrack [DOC] | Piezas Materia de un solo plano |
| 13 | Movimiento premium | Push-in lento hacia el gesto | Intimidad y foco [PRACT StudioBinder] | Si el gesto ya es amplio: plano fijo |
| 14 | Profundidad | Deslizamiento con primer término (parallax) | Da escala y 3D sin efectos [INF] | Bodegones minimalistas |
| 15 | No delatar el gimbal | Arco corto de 15-30°, sin órbita de 360° | La órbita completa suena a stock [INF] | Revelación final de una pieza única |
| 16 | Cortes limpios | Empezar y terminar cada movimiento quieto | Da aire para cortar [PRACT] | Montaje de corte por movimiento (*match on action*) |
| 17 | Sonido de oficio | Mic 2 en 32 bits pegado al banco | Golpes sin saturar, foley cercano [DOC/CREADOR] | Ambiente de nave: micro en el centro |
| 18 | Sin huecos de sonido | Room tone de 60 s por sesión | Sin él, el silencio parece un fallo [DOC enc.] | Silencio absoluto como recurso dramático (1 s, no más) |
| 19 | Banco sonoro | 5-10 repeticiones *wild* del gesto | Foley reutilizable y limpio [INF] | Procesos irrepetibles |
| 20 | Gancho | Primer fotograma = acción; idea en ≤3 s | TikTok: proposición en 3 s, gancho en 6 s [DOC*] | Loops ASMR: la calma también engancha |
| 21 | Nativo, no anuncio | Ni logo de entrada, ni cortinillas, ni *end card* | Gramática de anuncio; TikTok pide "less polished" [DOC*] | Piezas para paid o ferias |
| 22 | Visibilidad en Instagram | Sin marcas de agua ni bordes; con sonido; no "mostly text" | Instagram reduce la visibilidad de eso [DOC] | Nunca: limpia las marcas de agua de la IA o del stock |
| 23 | Comprensión sin sonido | Subtítulos de la VO, 5-10 palabras/s | Mucho visionado sin sonido [ESTUDIO* antiguo] + TikTok [DOC*] | Piezas sin VO: un rótulo, no subtítulos |
| 24 | Ritmo de oficio | Corte en el gesto, no en el compás | El foley manda; si manda la música, parece un spot [INF] | Recopilatorios de temporada con música |
| 25 | Música sin riesgo | CML en TikTok; librería con licencia en Meta | La biblioteca general no es para uso comercial [DOC] | Nunca en cuenta de empresa sin licencia |
| 26 | Firma de marca | Logo sonoro de foley propio | Único, legal y "real" [INF] | Colaboraciones con artistas |
| 27 | Verdad de producto | Manos, producto y taller siempre grabados | La Gen Z ve la IA como "inauthentic" [ESTUDIO*]; riesgo de engaño [INF] | Nunca |
| 28 | Cumplir el etiquetado | Etiqueta la IA realista (lugares reales, escenas que no ocurrieron) | YT, TikTok, Meta y el art. 50 del AI Act [DOC] | No hace falta en fondos extendidos, color, subtítulos o lo no realista [DOC YT] |
| 29 | Evitar la autoetiqueta sorpresa | Revisar C2PA de los clips de IA antes de publicar | YT y TikTok etiquetan solos con C2PA, sin opción de quitarlo [DOC] | Si vas a etiquetar igualmente |
| 30 | B2B sin filtrar secretos | Columna NDA en el catálogo y en la ficha | Piezas de clientes en plano = riesgo comercial [INF] | Con permiso escrito del cliente (y entonces, presúmelo) |
| 31 | Escalar sin perder el criterio | Remotion: una composición con zod por serie + `piezas.json` + render en lote | Props validadas y render reproducible [DOC Remotion] | Piezas hero puntuales: a mano en Resolve |
| 32 | Licencias en regla | Comprobar la licencia de Remotion (gratis hasta 3 empleados) | Por encima, Company License [DOC] | Ninguna |

---

## Huecos globales y siguientes pasos
1. **Música de Meta para cuentas de empresa (2026)**: verificar en la ayuda de Instagram/Facebook con un navegador real.
2. **Manual de la Pocket 3**: confirmar los nombres de los modos del gimbal, el rango de obturación en Pro, la ISO mínima en D-Log M y la resolución vertical máxima.
3. **C2PA y marcas de agua en Higgsfield, Seedance y Kling**: prueba práctica exportando un clip de cada herramienta y pasándolo por el verificador.
4. **Ley española de IA**: estado de la tramitación y obligaciones de etiquetado a noviembre de 2026.
5. **Datos de rendimiento con cara frente a sin cara, y lo-fi frente a pulido, en orgánico de marca**: sin fuente verificada. Medir en APZ con las tres series durante 8 semanas (retención a 3 s, guardados, mensajes B2B).
6. **Texto completo de Mosseri (1-1-2026)**: solo se han verificado los titulares de prensa.
