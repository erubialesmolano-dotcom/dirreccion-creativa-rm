# De la idea a la pieza: pipeline y controles de calidad

> Fuente: informe 2 §7. Etiquetas de evidencia: [estudio]/[estudio*] dato empírico (con * si viene de plataforma con interés comercial), [norma]/[DOC] especificación oficial, [creador]/[EXPERT] quien hizo la pieza o practicante reconocido, [crítica], [PRACT] tutorial, [inferencia]/[INF]/[I] deducción sin fuente directa. Trata [inferencia] como recomendación, no como hecho.

## 7. De la idea a la pieza

### 7.1 Pipeline con controles de calidad

La industria va de brief → concepto y guion (agencia) → tratamientos de varios directores → storyboard o animatic, shot list y PPM → rodaje → offline → online, etalonaje y mezcla → versiones. El tratamiento "should still mirror the final result" [PRACTICANTE] ([Robin Piree](https://robinpiree.com/blog/how-to-write-a-directors-treatment-for-a-tv-commercial)). Para Erik, que hace a la vez de agencia, director y posproducción, el PPM se convierte en la aprobación del animatic con el cliente antes de gastar créditos [INFERENCIA].

| Paso | Qué se hace | Control de calidad (pasa si…) |
|---|---|---|
| **G0 Idea** | Una frase y una emoción objetivo | Cabe sin "y"; tiene giro; responde a por qué ahora y por qué esta marca [INFERENCIA] |
| **G1 Guion** | Story Spine (Kenn Adams: "an eight-sentence exercise" [EVIDENCIA], [NPR](https://www.npr.org/transcripts/nx-s1-5750619)) y guion AV | Los "Because of that" son causales y no "y luego"; cada beat cambia un valor; gancho en 1-3"; VO por debajo del 70 % del máximo; la VO no repite la imagen; final sorprendente, lógico y emotivo (Arndt [PRACTICANTE], [NFS](https://nofilmschool.com/michael-arndt-writer)); "Is this the tightest version of my story?" ([Sundance](https://www.sundance.org/blogs/pep-talks-and-advice-for-makers-of-short-films-from-our-sundance-programmers/)) |
| **G2 Tratamiento o biblia** | Look, tono, referencias, prohibidos | Los fotogramas de referencia se parecen al resultado; tres adjetivos de tono y uno que no es; riesgos técnicos listados |
| **G3 Hojas de personaje y lugar** | Varios ángulos, vestuario fijado, luz neutra | Mendiboure las actualizaba cuando el personaje cambiaba (heridas) [PRACTICANTE] ([Creative Bloq](https://www.creativebloq.com/ai/how-a-filmmaker-turned-a-10-year-old-unmakeable-movie-idea-into-reality-with-ai)) |
| **G4 Animatic** | Sonido primero + stills | Se entiende sin explicación (probado con un tercero); timing cerrado; funciona en silencio y solo con audio; el cliente lo aprueba |
| **G5 Generación** | Pruebas rápidas y finales en alta calidad, con fotograma inicial y final | Cada plano cumple su función; continuidad de eje, miradas, vestuario y luz; sin artefactos; duración = la del animatic |
| **G6 Offline** | Montaje en paralelo a la generación (Mendiboure) | Ritmo; el giro llega a tiempo; revisado en el móvil a tamaño real |
| **G7 Online y mezcla** | Etalonaje que unifica, VFX, mezcla | Look único entre modelos; −14 LUFS; subtítulos; legales |
| **G8 Entrega** | Versiones 9:16, 1:1 y 16:9; cortes de 15 y 6" | Zonas seguras, nombres de archivo, másteres |

### 7.2 Guion a dos columnas y palabras por duración

Formato AV [PRACTICANTE] ([Boords](https://boords.com/blog/how-to-write-a-tv-commercial-script)): cabecera con cliente, título, versión, fecha y duración. A la izquierda, VISUAL: planos, cámara, gráficos y texto en pantalla, numerados y con la duración entre paréntesis. A la derecha, AUDIO: diálogo, VO, música y SFX, con lo que no es diálogo en mayúsculas. Cada fila arranca a la misma altura. Plantilla de ejemplo (contenido inventado):

| # | VISUAL | AUDIO |
|---|---|---|
| 1 (:03) | PP FIJO. MANOS QUE ABREN UNA CARTA. CENTRADO. | ROOM TONE DE COCINA. VO: "Mi abuela guardaba todo." |
| 2 (:04) | PG. LA COCINA VACÍA, LUZ DE VENTANA. PILLOW SHOT. | SILENCIO. RELOJ DE PARED. |

En Remotion, cada fila es un `<Sequence from durationInFrames>`, así que conviene escribir los tiempos en fotogramas desde el guion [INFERENCIA].

| Duración | Máximo a 160 ppm, con 1-2 s de respiro (cálculo sobre [Killerspots](https://killerspots.com/scriptcounter)) | Objetivo con imagen, 60-70 % [INFERENCIA] | Beats [INFERENCIA] |
|---|---|---|---|
| 6" | — | Sin VO o una frase | Imagen gancho + marca |
| 15" | 35-37 | ~21-26 | Gancho 0-3" → giro o beneficio 3-11" → marca/CTA 11-15" |
| 30" | 75-77 | ~45-55 | Gancho 0-3" → problema 3-12" → giro 12-20" → resolución 20-26" → marca 26-30" |
| 60" | 155-157 | ~95-110 | Story Spine comprimido; últimos 5-7" para la marca |
| 90" | ~235 | ~140-165 | Mini arco con stakes internos |

Los ritmos de Killerspots son 120 ppm lento, 150 conversacional, 160 de locutor, 175 enérgico y 190 rápido. En español, las palabras son más largas: hay que restar un 10-20 % más (informe 1, [inferencia]).

### 7.3 Tratamiento

Estructura de practicante: experiencia, conexión personal y visión, con capítulos de casting, cámara, montaje, música, sonido y VO, localizaciones, arte y producción. Se hacen "as many questions as possible" antes de escribirlo, y nunca sin hablar con los creativos [PRACTICANTE] ([Robin Piree](https://robinpiree.com/blog/how-to-write-a-directors-treatment-for-a-tv-commercial); [Action Cut Print](https://actioncutprint.com/ezine-12)). Versión para IA, de 8-15 páginas [INFERENCIA]:
1. Idea en una frase y emoción objetivo.
2. Por qué yo.
3. Enfoque narrativo.
4. Tono: tres adjetivos y uno que no es.
5. Personajes, con hojas generadas.
6. Look, con 6-12 fotogramas de referencia.
7. Cámara.
8. Montaje y ritmo.
9. Sonido y VO candidata.
10. Mundo.
11. 3-5 hero frames.
12. Riesgos técnicos (consistencia, manos, texto, sincronía labial) y cómo se resuelven.
13. Formatos de entrega.

### 7.4 Animatic con el sonido primero

Frame.io: "Timing and pacing are everything when editing an animatic". Deja unos 4 f de cabeza y cola en los planos de diálogo y al menos 2" en los de situación, porque con el detalle añadido el ritmo se percibe más rápido. Todo el diálogo tiene que estar en el animatic. Encadenados y empujes se dejan para post. Cuanto más tarde se cambia algo, "the more changes ripple down" [PRACTICANTE] ([Frame.io](https://blog.frame.io/2019/07/15/animation-editing/)). Native Foreign montó en Premiere un animatic con stills antes de animar con Veo 3.1 y Ray3 [PRACTICANTE] ([Adobe](https://blog.adobe.com/en/publish/2025/10/29/how-shorts-for-generative-ai-film-festival-max-2025-were-made)). Orden [INFERENCIA]:
1. VO final o casi final y música provisional.
2. Stills cortados sobre ese audio.
3. La duración de cada plano pasa a ser la de su generación, para no generar segundos que no se usarán.

Se juzga por claridad, timing, emoción (¿funciona el giro aunque las imágenes sean feas?), gancho, final y marca, tanto sin audio como sin imagen.

### 7.5 Shot list (hoja de prompts plano a plano)

Columnas [INFERENCIA]: n.º · duración en fotogramas · beat y función · encuadre y lente · movimiento de cámara (o "static locked-off") · acción · fotograma inicial · fotograma final si aplica · modelo · semilla · versiones · estado. Mendiboure hizo 3.229 generaciones en 242 horas con un shot list "como producción tradicional", y lo rehízo cuando un plano accidental salió mejor [PRACTICANTE]. *Dear Upstairs Neighbors*: "we didn't rely on text prompting"; usaron vídeos de entrada animados para controlar interpretación y timing, y dailies diarios con paintovers [PRACTICANTE] ([NFS](https://nofilmschool.com/dear-upstairs-neighbors-hybrid-ai-short-film)). La dirección humana sigue siendo imprescindible en la idea, el final, la interpretación, la continuidad espacial, el ritmo, la curación, el sonido y la coherencia del look [INFERENCIA].

---
