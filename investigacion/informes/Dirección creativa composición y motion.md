# Composición, directores, motion y montaje al detalle (informe 2)

El informe 1 dio el criterio general: emoción → recurso → por qué → cuándo romperlo, con la contención racionada como hallazgo de fondo. Este segundo informe baja al detalle del oficio en cinco frentes que allí quedaron cortos: la composición concepto a concepto, las decisiones de firma de 26 directores, los números de motion de After Effects traducidos a Remotion, un catálogo de técnicas de montaje con fotogramas de trabajo y el acabado que separa lo limpio de lo amateur. Cierra con el recorrido completo de la idea a la pieza, con un control de calidad en cada paso. Lo ya tratado en el informe 1 (Murch, Material, montadores, auditoría de *video-historia-remotion*) solo se cita.

**Etiquetas de evidencia.** Cada nota de origen usaba su propio sistema y aquí se conservan tal cual, para poder volver a la nota sin traducir. Equivalen así:

| Nota de origen | Fuente fuerte | Practicante o experto | Deducción sin fuente |
|---|---|---|---|
| Composición | [evidence]: investigación de percepción | [practitioner]: cineastas, docentes, libros | [inference] |
| Directores | [V]: página leída en la sesión | [S]: solo título o URL vistos en el buscador | [inferencia] |
| Motion (AE → Remotion) | [DOC]: documentación oficial (Adobe, Remotion) | [EXPERT]: Ebberts, School of Motion, Comeau, ProVideo Coalition; [PRACT]: tutorial secundario | [INFERENCE] |
| Montaje | [E]: autoridad de montaje o texto de referencia | [P]: practicante o docente | [I]: convención sin verificar; valores de partida para probar |
| Limpio frente a amateur | [EVIDENCE]: norma, especificación o estudio | [PRACTITIONER]: practicante o crítico | [INFERENCE] |
| De la idea a la pieza | [EVIDENCIA] | [PRACTICANTE] | [INFERENCIA] |

Cuando una nota dice que algo es conocimiento general que no se verificó en la sesión, aquí se marca **(no verificado)**. Las citas de directores salen de páginas leídas con una herramienta que resume con un modelo pequeño. Por eso son cortas y conviene cotejarlas antes de publicarlas. Las de Wong Kar-wai en la BFI, que la nota marcaba como dudosas por demasiado redondas, se cotejaron para este informe: las siete aparecen en la página **[comprobado 24-11-2026]**.

---

## 1. Resumen: qué cambia respecto al informe 1

1. **El centro no es de aficionado; los tercios no son una ley.** En el laboratorio de Palmer (Berkeley), el centro fue la posición preferida para un objeto solo, incluso en una prueba de 3×3 diseñada para la regla de los tercios. No hubo preferencia por la proporción áurea (Friedenberg, 2012). Lo que sí resiste es el **sesgo hacia dentro**: si el sujeto mira o se mueve, se prefiere el espacio delante de él. Ese espacio se reduce cuanto más rápido parece moverse. El centro pasa a ser el valor por defecto para un sujeto único y frontal; el descentrado necesita un vector que lo justifique [evidence].
2. **La composición tiene ya un vocabulario operativo para la IA.** Cada concepto lleva una frase de prompt. Los generadores responden a posiciones y cuerpos descritos en concreto, no a "golden ratio" ni a "dynamic symmetry". El 9:16 necesita traducción propia: vectores verticales, capas apiladas en altura y vistas de 3/4 en lugar de perfiles [inference].
3. **Los directores se dividen en dos métodos, y para la IA conviene combinarlos.** Los planificadores totales (Bong, Park, Wright, Aster, Anderson, Kubrick, Ridley Scott) fijan la película en storyboard, animatic o shot list. Los pescadores (Wong y Doyle, Malick y Lubezki, Lynch) crean condiciones y capturan. Para la IA, lo práctico es planificar como Bong o Wright y generar como Malick: shot list cerrado y muchas variaciones dentro de cada plano [inferencia].
4. **La música manda antes que la imagen en un grupo amplio de directores**: Wong ("Music always leads the way for me"), Leone (Morricone compone antes del guion), Wright (animatic al beat), Nabil (la canción en bucle), Tarantino (el tema de créditos fija el ritmo), Iñárritu (la batería sustituye al corte). Esto refuerza el "animatic con el sonido primero" [V].
5. **El motion "diseñado" tiene números.** El Easy Ease de After Effects deja 33,33 % de influencia a cada lado, y es un punto de partida, no un resultado. El overshoot bueno es proporcional a la velocidad de llegada (Dan Ebberts: amplitud = v / (2π·frecuencia)). El `spring()` de Remotion trae por defecto damping 10, que rebota bastante, y `<CameraMotionBlur>` usa 180° y 10 muestras y degrada el color [DOC/EXPERT].
6. **El montaje gana un catálogo con valores de partida en fotogramas**, casi todos sin fuente ([I]). Lo que sí tiene fuente: las siete reglas de Dmytryk, que el corte en el beat se reserva para los cambios estructurales ("once or twice in a sequence"), y que la J y la L van al revés en StudioBinder. **"T cut" no es un término establecido**: hay tres lecturas posibles y Erik tiene que decir cuál es la suya.
7. **"Limpio" tiene normas medibles**: Netflix limita los subtítulos a 42 caracteres por línea, 2 líneas y 20 caracteres por segundo; WCAG exige un contraste de 4,5:1 (3:1 en texto grande); Apple desaconseja los pesos finos. La tabla de tracking de SF Pro confirma la corrección del traspaso: a partir de 28 pt la Display ya va apretada y su tracking vuelve a ser positivo o nulo. La exportación para Reels es 1080×1920, H.264, 30 fps y unos 10 Mbps o más. El vocabulario de la crítica contra los anuncios con IA ("plastic", "oily sheen", "overly polished", texto ilegible) da una lista de tics que hay que evitar [EVIDENCE/PRACTITIONER].
8. **El pipeline gana controles de calidad.** Hay ocho controles (G0-G8). Un 30" admite unas 75 palabras de locución como máximo, y conviene escribir el 60-70 % de eso. El animatic con el sonido primero hace de reunión de preproducción (PPM) con el cliente antes de gastar créditos de generación [PRACTICANTE/INFERENCIA].

---

## 2. Composición al detalle

Para cada concepto: qué es, cuándo usarlo y por qué, cuándo romperlo y una frase de prompt para imagen o vídeo. Los prompts son propuestas [inference] que hay que probar en cada modelo. Regla general: los generadores responden a posiciones y cuerpos descritos en concreto, no a nombres de teorías.

### 2.1 Centro frente a tercios (Palmer) y proporción áurea

- **Qué dice la evidencia.** Palmer, Gardner y Wickens (2008): "pronounced center bias" al colocar un objeto solo. En la prueba directa de los tercios (Palmer, Hara y Griscom, VSS 2014; elección forzada en 3×3 con peces, perros y águilas), los tercios no salieron favorecidos y el centro fue la posición preferida para todo objeto y orientación, sobre todo en objetos simétricos de frente [evidence] ([Palmer Lab](https://palmerlab.berkeley.edu/spatial.html)). Sobre φ: "There was no golden ratio effect"; la preferencia siguió la compacidad y la estabilidad (Friedenberg, 2012) [evidence] ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3485848)). La simetría dinámica de Hambidge se criticó ya en 1921 [practitioner] ([Wikipedia](https://en.wikipedia.org/wiki/Jay_Hambidge)).
- **Cuándo y por qué.** El centro es el valor por defecto para un sujeto único, simétrico y frontal (producto héroe, cabeza que habla, logo) y para los cortes rápidos en 9:16. No es de aficionado: es la posición preferida en los experimentos [inference].
- **Romperlo.** Cuando el sujeto tiene dirección (2.2) o el contexto lo justifica: "representational fit" (Sammartino, Gardner y Palmer); "greater aesthetic value often requires violating these expectations" [evidence]. Los tercios sirven para buscar, no son una ley.
- **Prompt.** `subject dead center, frontal, symmetrical framing`. "Golden ratio composition" es solo una etiqueta de estilo: el modelo no calcula φ.

### 2.2 Aire delante (lead room) y sesgo hacia dentro

- **Evidencia.** Los objetos orientados se prefieren desplazados hacia el lado contrario al que miran, es decir, mirando hacia el espacio grande. El movimiento se impone a la orientación, y el sesgo "decreased as implied speed increased" (Langlois, Sammartino y Palmer, 2012) [evidence] ([póster](https://palmerlab.berkeley.edu/pdf/Langlois.VSS.2012.Final.pdf)). Matiz: en la prueba de 3×3, el centro ganó incluso con objetos orientados. El sesgo dice hacia dónde desplazar un sujeto con dirección, no que haya que sacarlo siempre del centro.
- **Cuándo.** Con mirada o movimiento, para expectativa o avance. Es la regla con más respaldo empírico.
- **Romperlo.** Con velocidad: un coche rápido aguanta cerca del centro. Para incomodar, short side (2.3).
- **9:16** [inference]. Apenas hay aire horizontal. La dirección se convierte en vectores verticales o en profundidad, y conviene la vista de 3/4, porque el perfil queda en short side sin querer.
- **Prompt.** `looking off-frame to the right, generous negative space on the right`.

### 2.3 Short side y long side

- **Qué es.** En el short side, la cara queda pegada al borde hacia el que mira, "crushing look-space and leaving surplus air behind the head"; "Deny the character air and the scene tightens without a closer lens". En *El silencio de los corderos*, las conversaciones se vuelven "cages" [practitioner] ([Melies](https://melies.co/cinematic-techniques/composition/short-siding)). El long side, mirando a través del espacio, es el plano sobre el hombro estándar.
- **Por qué funciona.** Viola el sesgo hacia dentro a propósito. Úsalo para el encierro, el acoso o un personaje acorralado; con los dos interlocutores en short side, quedan enfrentados y atrapados (*Mr. Robot*, **no verificado**). No sirve para presentar a un héroe, salvo que el giro sea que está atrapado.
- **Prompt.** `profile facing the left edge, face pressed against the left edge of frame, large empty space behind the head`.

### 2.4 Headroom y posición vertical

- **Evidencia.** Hay sesgos verticales débiles: el águila se prefiere arriba, la raya abajo, lo apoyado más bajo y lo colgado más alto (Gardner, Nothelfer y Palmer, 2008) [evidence]. Bang: la mitad superior se lee como libertad o poder y la inferior como peso [practitioner] ([SuperSummary](https://www.supersummary.com/picture-this/chapter-2-summary)).
- **Cuándo** [inference, **no verificado** como norma]. Ojos hacia la línea superior de tercios. Headroom justo cortando la frente: intimidad o intensidad (Leone, Fincher). Headroom excesivo: soledad. En 9:16, los ojos van al 35-42 % desde arriba por la interfaz.
- **Romperlo.** Para desplazar algo de su sitio natural: el coche que flota alto da el anuncio surrealista.
- **Prompt.** `head cropped at forehead, extreme close-up` · `tiny figure at the very bottom, vast sky above`.

### 2.5 Triángulos

- **Evidencia.** Los triángulos apoyados en la base y con el vértice arriba son los más atractivos y estables, y los invertidos los que menos. El compacto ganó ~75 % de las comparaciones [evidence] (Friedenberg).
- **Cuándo** [inference, práctica estándar **no verificada**]. Pirámide: el elemento importante en el vértice y la masa de apoyo en la base. Grupo de tres: el dominante en el vértice y los otros dos en las esquinas. Triángulo de miradas (A→B→C→A): el ojo circula dentro del cuadro. Invertido: precariedad, villano que se cierne, derrumbe.
- **Romperlo.** Con el grupo en fila o disperso, para que se lea fracturado; o en la simetría estática de Kubrick o Anderson.
- **Prompt.** `triangular composition, tallest figure standing at apex in the center, two seated at the lower corners`.

### 2.6 Diagonales y simetría dinámica

- **Qué es.** Bang: las horizontales dan calma, las verticales energía que cuesta mantener y las diagonales "motion and tension" [practitioner]. La "baroque diagonal" (de abajo a la izquierda a arriba a la derecha) se propone como punto de partida por la lectura occidental de izquierda a derecha. Si el sujeto no cabe en ella, los elementos se colocan paralelos [practitioner] ([PictureCorrect](https://www.picturecorrect.com/?p=75360)).
- **Construcción** [inference]. El 16:9 (1,78) está cerca de √3. Se trazan las diagonales y las perpendiculares desde las esquinas opuestas; los cruces son los "ojos" donde va el sujeto. En 9:16 las diagonales salen empinadas (~60°) y dan empuje vertical, y las recíprocas forman bandas casi horizontales para colocar texto.
- **Romperlo.** Es una herramienta de trazado con pedigrí débil (2.1), no una verdad.
- **Prompt.** `strong diagonal composition, subject rising from bottom-left to top-right` · `dutch angle 20 degrees`.

### 2.7 Líneas de cuerpo y de mirada

- **Jerarquía de vectores** [inference, con la parte alta apoyada en Palmer]: mirada de una cara > gesto que señala > dirección de movimiento > línea de acción del cuerpo (C o S) > líneas arquitectónicas > líneas implícitas. Muchas líneas están "only in our heads" [practitioner] ([Willamette](https://people.willamette.edu/~gorr/classes/cs145/resources/DesignComponents.pdf)).
- **Cuerpo.** Kurosawa exagera el bloqueo (el nervioso camina de un lado a otro, el indignado se yergue) y da a cada actor un gesto propio [practitioner] ([EFAP](https://amara.org/subtitles/SoHQMOziYeK5/en/1/download/Akira%20Kurosawa%20-%20Composing%20Movement.en.txt)).
- **Fuga y eyeline** [inference]. Las líneas tienen que terminar en el punto focal. Las que convergen (los pasillos de Kubrick) dan inevitabilidad, y las que salen del cuadro sacan el ojo, útiles para una transición. En plano y contraplano, A mira a la derecha y B a la izquierda, a alturas coherentes; la mirada más alta domina.
- **Romperlo.** Para desorientar o para un final abierto.
- **Prompt.** `long corridor, one-point perspective, lines converging on the figure`.

### 2.8 Peso visual y equilibrio

- **Qué es.** En la tradición de Arnheim pesan más: el tamaño, el aislamiento, el interés intrínseco, el rojo frente al azul, lo claro frente a lo oscuro, las formas simples y la parte de arriba. El vacío delante de una figura aporta "balancing power" [practitioner] ([MIT](https://people.csail.mit.edu/fredo/ArtAndScienceOfDepiction/OtherTalks/balance.pdf)). Goude y Hjortzberg: la atención va a los bordes y se estabiliza en el centro; "Dead center" is not dead [evidence/practitioner].
- **Cuándo** [inference]. Las caras y el texto legible son superpesos: nunca una cara y un titular compitiendo al mismo tamaño. Dondis (**no verificado**): o equilibrio claro o desequilibrio claro; lo ambiguo es el error.
- **Prompt.** `single small red object on the right balancing a large dark mass on the left`.

### 2.9 Figura y fondo, y contraste (Block)

- **Qué es.** Block: el contraste sube la intensidad y la afinidad la baja, en espacio, línea y forma, tono, color, movimiento y ritmo [practitioner] ([Routledge](https://www.routledge.com/The-Visual-Story/Block/p/book/9781138014152)).
- **Cuándo** [inference]. Se separa el sujeto por valor, color, foco, textura o movimiento. Más contraste hacia el clímax, afinidad para calmar. Se rompe cuando el sujeto debe perderse (anonimato, multitud).
- **Prompt.** `rim light separating subject, background two stops darker, shallow depth of field`.

### 2.10 Gestalt

- **Evidencia.** Proximidad: lo relacionado se coloca junto (Leyssen et al., 2010) [evidence]. Se agrupa más por color que por forma (Bang) [practitioner].
- **Aplicación** [inference, **no verificada**]. Proximidad: la distancia entre personajes es su relación, y en gráficos titular y CTA van juntos. Semejanza: el único distinto es el protagonista. Cierre: logos recortados para teasers. Continuidad: alinear elementos a través del corte. Destino común: lo que se mueve junto es una unidad. Prägnanz: el desorden destruye la jerarquía.
- **Prompt.** `crowd in identical grey coats, one woman in a yellow coat`.

### 2.11 Color, luz, formas y escala

- **Color y luz** [practitioner + inference]. Fondo claro = seguro y oscuro = inquieto (Bang). Un solo elemento saturado en un cuadro desaturado es foco garantizado: haz que el producto sea lo único cálido (abrigo rojo de *Schindler*, **no verificado**). La zona más clara es la primera fijación. Los charcos de luz y el contraluz deciden dónde mirar y separan la figura. `desaturated frame, the product is the only saturated element`.
- **Formas.** Los diez principios de Bang: puntiagudo = miedo, redondo = protección, grande = fuerte, centro = foco más fuerte, descentrado = dinámico con espacio fuera de campo [practitioner]. Lenguaje de formas de animación (**no verificado**): círculo amable, cuadrado fiable, triángulo peligroso. En producto: lo redondeado es accesible y lo anguloso, de rendimiento. Las afirmaciones de Kandinsky y Dondis son de memoria y sin base empírica.
- **Escala.** Se prefiere ver pequeño lo pequeño y grande lo grande (Linsen et al., 2010; el efecto casi desaparece al igualar el detalle) [evidence]. La figura diminuta en la inmensidad da asombro. El "producto monumental" rompe el tamaño canónico para parecer icónico [inference]. `giant perfume bottle standing in a valley like a monument`.

### 2.12 Capas de profundidad y puesta en escena

- **Kurosawa** compone con cinco movimientos [practitioner] ([EFAP](https://amara.org/subtitles/SoHQMOziYeK5/en/1/download/Akira%20Kurosawa%20-%20Composing%20Movement.en.txt)):
  - naturaleza (viento, lluvia o humo en casi todo plano, para que hasta lo quieto viva);
  - grupos;
  - individuos;
  - cámara, con principio, medio y final;
  - corte en movimiento.

  Contraejemplo citado: una escena de *Los Vengadores*, plana, con la cámara en una sola dirección.
- **Spielberg y el oner** [practitioner] ([EFAP](https://amara.org/subtitles/ml0fpo3zq2BN/en/1/download/The%20Spielberg%20Oner.en.srt)): el bloqueo cambia la composición en vez de cortar. En *En busca del arca perdida*, 90 s funden empuje, dos planos individuales y un inserto. "Move your actors."
- **Tipos de espacio de Block** [inference, **no verificado**]: profundo, plano (Anderson), limitado y ambiguo (terror). Uno por secuencia y contraste entre secuencias.
- **Romperlo.** El espacio plano renuncia a la profundidad para dar control o artificio.
- **Prompt.** `foreground: out-of-focus [objeto] at left edge; midground: subject sharp; background: hazy [lugar], atmospheric perspective`. En 9:16 se apila en altura: primer término abajo, fondo arriba [inference].

### 2.13 Gramática del marco, dirección de pantalla y 180°

[inference salvo que se indique]
- **Abierto y cerrado** (Braudy, **no verificado**): jaula o escenario (Anderson, Kubrick) frente a ventana (Malick). El centro "atrapa" y el descentrado implica fuera de campo (Bang) [practitioner].
- **Horizonte**: bajo da aspiración, alto peso y encierro, centrado estatismo, inclinado inestabilidad.
- **Centre punch**: foco central a través de cortes rápidos (informe 1, *Fury Road*).
- **Regla de impares** (**no verificado**): dos es un duelo, tres un grupo con héroe en medio, cuatro se parte en parejas.
- **Cuadrantes de *Drive***: **no se pudo verificar**; no usarlo como argumento.
- **Dirección de pantalla**: de izquierda a derecha se suele leer como progreso, sin fuente. Lo que sí está medido es la preferencia por objetos orientados a la derecha colocados a la izquierda del centro, que es un efecto de orientación [evidence], no un peso universal de la izquierda.
- **180°**: se rompe para desorientar o marcar un cambio de poder. Se cruza con un plano neutro, un movimiento que atraviesa el eje o un recurso. Los generadores rompen el eje a menudo (Mendiboure, apartado 7).

### 2.14 Rejillas y 16:9 frente a 9:16

[inference; Müller-Brockmann y las zonas oficiales **no consultados**]
- **Rejilla modular.** 12 columnas en 1920×1080 (márgenes de 96 px, medianil de 24). 6 columnas en 1080×1920 (márgenes de ~64 px, con ~220 px arriba y ~380 px abajo reservados). Animar sobre las líneas de la rejilla hace que el movimiento parezca diseñado.
- **Lo suizo aplicado al motion.** Asimetría, alineación a la izquierda, gran contraste de escala entre titular y cuerpo, y una sola imagen dominante.
- **Por formato.** En 16:9 funcionan los tercios, el aire delante y el plano sobre el hombro. En 9:16: centre punch, apilado vertical (título, sujeto, CTA por encima de la interfaz), picados y contrapicados, y planos de dos escalonados en profundidad.

### 2.15 Composición en el tiempo y para el corte

- **Base.** Kurosawa: movimientos con principio, medio y final; cortar en movimiento; acabar en quietud y cortar a movimiento para inquietar [practitioner].
- **Revelados** [inference]: panorámica que descubre, primer término que barre el objetivo, cambio de foco, grúa que sube, empuje. El primer y el último fotograma, cada uno compuesto como un still.
- **Raccord gráfico entre clips de IA** [inference]: pide la misma forma y posición en los dos planos (`circular object centred, filling 40% of frame`).
- **Eye-trace** (Murch, **no verificado** en fuente primaria): el foco de B donde estaba el ojo al final de A para un corte suave; saltarlo de lado para dar un golpe.
- **Prompt de vídeo.** Fija el inicio, el final y el vector: `starts wide with subject small at bottom centre, slow push-in ending in medium close-up, subject centred`. Usa fotograma inicial y final cuando el modelo lo permita.

---

## 3. Directores: decisión de firma, por qué y regla transferible

Cada ficha sigue el mismo orden: **decisión** de firma → **por qué**, con sus palabras cuando las hay → **regla** para piezas cortas de marca. Las citas son [V] salvo que se indique, y las reglas, [inferencia]. Fincher, Villeneuve, Murai, Gavras, Pons Jewell y los montadores ya están en el informe 1.

### 3.1 Estructura y tensión

**Christopher Nolan.**
- *Decisión*: la estructura como mecanismo musical.
- *Por qué*: escribió *Dunkerque* sobre la escala de Shepard, "a corkscrew effect", con tres líneas que "braid together" para dar "a continual feeling of intensity". Le mandó a Zimmer un reloj "with a particularly insistent ticking" ([Business Insider](https://www.businessinsider.in/christopher-nolan-explains-the-audio-illusion-that-created-the-unique-music-in-dunkirk/amp_articleshow/59742153.cms)). "It's not meant to be a puzzle. It's meant to be an experience"; todo "from the point of view of the characters" ([TIME](https://time.com/4864049/dunkirk-christopher-nolan-interview)). Además, "use dialogue as a sound effect" ([SlashFilm](https://www.slashfilm.com/534906/christopher-nolan-interstellar-sound-problems)).
- *Regla*: un motor de tensión que solo sube (tictac, pulso) y que ningún corte reinicia. Si hay varios hilos, se cambia de uno a otro en los picos. Nada de planos sin dueño.

**Quentin Tarantino.**
- *Decisión*: estirar el suspense y aguantar el plano.
- *Por qué*: "the suspense is a rubber band", con la información enterrada entre "minutia about nothing" ([Open Culture](https://www.openculture.com/2017/04/how-quentin-tarantino-creates-suspense.html)). "I like to hold for as long as I can before I have to cut"; "I'm not Mr. Coverage" ([Film Comment](https://www.filmcomment.com/article/quentin-tarantino-interviewed-by-gavin-smith/)). El tema de créditos le dice "what the rhythm of this piece should be" ([No Film School](https://nofilmschool.com/tarantino-music-art)).
- *Regla*: algo que el espectador sabe y el personaje no, y el pago retrasado con banalidades. Un plano más largo de lo cómodo y un corte en seco. La canción de arranque se elige antes del guion.

**Bong Joon-ho.**
- *Decisión*: espacio vertical como clase social y storyboard como plano de obra.
- *Por qué*: "staircase cinema"; "visibility and non-visibility within the house was very important"; "I get more excited when I have these limitations" ([GamesRadar](https://www.gamesradar.com/making-of-parasite-bong-joon-ho-interview)). Dibuja él mismo y rara vez se desvía (paráfrasis, [NFS](https://nofilmschool.com/why-boing-joon-ho-storyboards)).
- *Regla*: la jerarquía (antes y después, problema y solución) se mueve en vertical. El suspense en 15 s sale de que el espectador vea lo que el personaje no ve.

**Park Chan-wook.**
- *Decisión*: storyboard total; un truco solo si dice algo.
- *Por qué*: "storyboarded the entire film" para no pensar la cámara en el set ([The Film Stage](https://thefilmstage.com/park-chan-wook-on-decision-to-leave-methodical-directing-and-not-being-a-film-buff)). En el pasillo de *Oldboy*: "Why am I using all these tricks and references?". Lo rodó "in a single take", "brutal, repetitive, maybe a bit boring" ([BFI](https://www.bfi.org.uk/sight-and-sound/features/out-revenge-park-chan-wook-oldboy)).
- *Regla*: antes de un efecto, preguntar qué dice. Un POV desde el producto, una vez por pieza.

### 3.2 Cámara, bloqueo y plano largo

**Steven Spielberg.**
- *Decisión*: bloqueo antes que cobertura (el oner); en Omaha, lo contrario.
- *Por qué*: "I'll do a whole blocking with second team first" ([NFS](https://nofilmschool.com/steven-spielberg-blocking)). En *Salvar al soldado Ryan* no hubo storyboards: "a 45-degree shutter looks very frightening"; "My intention was to re-sensitize the audience" ([DGA](https://www.dga.org/craft/dgaq/issues/1103-fall-2011/shot-to-remember-saving-private-ryan)).
- *Regla*: probar si un solo movimiento lleva del contexto a la emoción (`slow dolly in from wide to close-up as character turns`). Si hay caos, la forma también: `handheld, 45-degree shutter look, desaturated`.

**Martin Scorsese.**
- *Decisión*: el movimiento y la canción cuentan el estatus.
- *Por qué*: el Copacabana muestra "how far Henry Hill had come", "choreographed like a ballet" ([ShortList](https://www.shortlist.com/movies/article/the-scorsese-interview/2)). Rechaza la música que solo dice "Okay, it's 1956"; puso "Layla" en playback en el set ([Rolling Stone](https://www.rollingstone.com/movies/movie-features/martin-scorsese-the-rolling-stone-interview-192568/)).
- *Regla*: seguir a alguien por la puerta de atrás es acceso, y sirve para marca premium. Se monta con la canción desde el primer corte y se elige por emoción, no para fechar.

**Paul Thomas Anderson.**
- *Decisión*: los planos nacen al escribir y la energía de la cámara sigue la curva.
- *Por qué*: "The shots are planned hand-in-hand with the writing", con "an internal clock". En *Magnolia*: prólogo "cinema to the max", monólogo en "incredibly static shots" y en la lluvia de ranas "we go kind of nuts" ([ICG](https://cigsandredvines.blogspot.com/2000/02/interview-icg-magazine.html)).
- *Regla*: un nivel de energía de cámara por tramo. Para confesiones, plano fijo. El plano se escribe junto a cada línea del guion.

**Alfonso Cuarón.**
- *Decisión*: plano largo porque el entorno es el personaje.
- *Por qué*: "A close-up separates a character from its environment"; "one is a product of the other" ([DGA](https://www.dga.org/craft/dgaq/issues/1303-summer-2013/alfonso-cuaron)). En *Roma*, el estilo "has to be hidden", para "simply observe" ([LWLies](https://lwlies.com/interviews/alfonso-cuaron-roma)).
- *Regla*: si el lugar cuenta la historia, no hay que cortar a primer plano. Para tono de testigo, distancia y fondo con vida (`observational distance, background life`).

**Alejandro G. Iñárritu.**
- *Decisión*: sin montaje, la música da el ritmo; una sola ventana de luz.
- *Por qué*: "we wouldn't be able to rely on editing"; la batería como "the heartbeat" ([MPA](https://motionpictures.org/?p=2963)). "Only late afternoon", "one hour and a half" ([DGA](https://www.dga.org/craft/dgaq/issues/1901-winter-2019/dga-interview-alejandro-gonzalez-inarritu)).
- *Regla*: un falso plano secuencia hecho con clips de IA necesita un motor rítmico (percusión, respiración) y uniones en zonas oscuras. Una sola hora de luz en todos los prompts.

**Damien Chazelle.**
- *Decisión*: la forma imita el instrumento.
- *Por qué*: "Whiplash is short, kinetic punctuation, and percussive; La La Land is long takes, fluid", "the difference between drumming and dancing". "A hint of a bump or sway… that's beautiful" ([DGA](https://www.dga.org/craft/dgaq/issues/1602-spring-2016/independent-voice-damien-chazelle)).
- *Regla*: elegir el instrumento del reel (cortar como batería o rodar como bailarín) y cambiarlo para marcar un giro. `slight handheld sway`.

**Stanley Kubrick.**
- *Decisión*: luz natural motivada y planos decididos de antemano.
- *Por qué*: "I have always tried to light my films to simulate natural light". En *Barry Lyndon*, velas y una lente Zeiss del lote de la NASA ([Far Out](https://faroutmagazine.co.uk/stanley-kubrick-breaks-down-his-revolutionary-approach-to-lighting-in-barry-lyndon/)). Según Garrett Brown, "knew every shot he wanted to do" ([Criterion](https://www.criterion.com/current/posts/4364-smooth-talk-a-conversation-with-steadicam-inventor-garrett-brown)). La simetría y el punto de fuga único: **no verificado** con cita propia.
- *Regla*: cada luz con una fuente creíble (`lit only by candlelight`). Una pintura como biblia en el prompt.

### 3.3 Sistemas formales cerrados

**Wes Anderson.**
- *Decisión*: animatic de toda la película, centro medido y foco profundo.
- *Por qué*: usa animatics desde *Moonrise Kingdom* ([AOL/IndieWire](https://www.aol.com/entertainment/working-animation-made-wes-anderson-160000433.html)). La simetría "it's just for me", como "handwriting" (cita de segunda mano, [SlashFilm](https://www.slashfilm.com/727221/why-theres-so-much-symmetry-in-wes-anderson-films)). Yeoman (DP): "everybody in focus"; "it's very fashionable to shoot wide open… we do the opposite" ([ASC](https://theasc.com/articles/the-french-dispatch)).
- *Regla*: `centered one-point perspective, frontal planimetric staging, deep focus`. El foco profundo ya distingue, porque los modelos tiran al bokeh.

**Yasujirō Ozu.**
- *Decisión*: cámara baja y quieta con 50 mm, y pillow shots.
- *Por qué*: la cámara "never pans" y "rarely moves at all"; "Only a 50-millimeter lens was used" ([Nippon.com](https://nippon.com/en/views/b03601)). Los pillow shots evocan "passionate emotions roiling below the surface" ([BFI](https://www.bfi.org.uk/features/enigmatic-pillow-shots-yasujiro-ozu)).
- *Regla*: una lente y una altura para toda la pieza, que además reduce incoherencias entre clips. Tras el pico, 1-2 planos vacíos de 1,5-2 s.

**Robert Eggers.**
- *Decisión*: autenticidad por acumulación y formato como encierro.
- *Por qué*: "the atmosphere can be an accumulation of details" ([Filmmaker](https://filmmakermagazine.com/?p=108449)). Blaschke (DP) sobre el 1,19: "being stuck with somebody you can't get away from" ([Filmmaker](https://filmmakermagazine.com/?p=108808)).
- *Regla*: el 9:16 encierra igual que el 1,19; aprovecharlo para claustrofobia o intimidad. Para una pieza de época, 10-20 referencias reales.

**Ari Aster.**
- *Decisión*: shot list exhaustivo y espacio negativo.
- *Por qué*: "about 130 pages", "so we all have the same movie in our head". En sus cortos el movimiento "wasn't motivated enough". "Be very bold with the negative space"; personajes "dwarfed in their environments" ([NFS](https://nofilmschool.com/2018/06/hereditary-ari-aster-interview)).
- *Regla*: si no sabes por qué se mueve la cámara, que no se mueva. `wide static frame, large dark negative space, small figure in corner`.

**Sergio Leone.**
- *Decisión*: música antes del guion; del gran plano general al primerísimo.
- *Por qué*: Morricone "composed the music before the script is ever written" ([ASX](https://americansuburbx.com/2012/12/interview-interview-with-sergio-leone-1987.html)). Delli Colli: "start the day with a wide lens and finish with a big close-up"; pedía "a small dolly of 20 centimetres" ([ASC](https://theasc.com/articles/shooting-once-upon-a-time-in-the-west)).
- *Regla*: escalas extremas sin planos medios; en 9:16, los ojos llenan el móvil. Dilatar la anticipación del revelado. `very subtle slow push-in`.

**Akira Kurosawa.**
- *Decisión*: el clima como emoción, varias cámaras con teleobjetivo y cortinillas.
- *Por qué*: con varias cámaras, el actor no sabe cuál le toma y es más natural. "I like hot summers, cold winters, heavy rains and snows". Montaba cada noche ([Wikipedia, con fuentes](https://en.wikipedia.org/wiki/Filmmaking_technique_of_Kurosawa); [BFI](https://bfi.org.uk/features/how-akira-kurosawa-films-command-weather)).
- *Regla*: un clima por pieza; viento en la tela para dar vida a un clip quieto. Tres planos en el mismo eje (general, medio, primerísimo) para enfatizar.

**Ridley Scott.**
- *Decisión*: el storyboard propio decide las cámaras; atmósfera en el aire.
- *Por qué*: "As soon as I've got the first picture on the board, I've already got the page in my head"; "God that room's boring", y entonces metían humo ([DGA](https://www.dga.org/craft/dgaq/issues/1003-fall-2010/interview-ridley-scott)).
- *Regla*: un boceto por plano antes de generar. `volumetric haze, backlit dust`. La misma acción desde 3 ángulos para tener material de montaje.

### 3.4 Captura, atmósfera e intuición

**Wong Kar-wai (con Christopher Doyle).**
- *Decisión*: sin guion cerrado, música primero, lo oculto.
- *Por qué*: Doyle: "we don't have scripts" ([Filmmaker](https://filmmakermagazine.com/archives/issues/winter2000/movie_camera.php)). Wong: "Music always leads the way for me"; "we're making one about what's hidden"; "Repetition is how memory works"; "Hands betray what faces hide" ([BFI](https://www.bfi.org.uk/sight-and-sound/interviews/wong-kar-wai-mood-love-25), **[comprobado 24-11-2026]**). "Change a situation rather than a performance" ([BFI](https://bfi.org.uk/interviews/christopher-doyle-shooting-chungking-express)).
- *Regla*: repetir el motivo 2-3 veces con imágenes casi iguales. Manos en lugar de caras y obstáculos en primer término. Con avatares, cambiar el entorno en vez de la expresión.

**Terrence Malick (con Emmanuel Lubezki).**
- *Decisión*: luz disponible, gran angular cerca y movimiento perpetuo.
- *Por qué*: "almost exclusively under available light" ([British Cinematographer](https://britishcinematographer.co.uk/emmanuel-lubezki-amc-asc-the-tree-of-life/)). Widmer: 12 mm, nunca más de 16. Un actor: "You keep moving, never stop"; "catching fish" ([IndieWire/Yahoo](https://www.yahoo.com/entertainment/working-malick-inside-dance-between-190018012.html)). No hay cita de Malick.
- *Regla*: `backlit golden hour, camera facing the sun`. Cada clip avanza. Muchas variaciones del mismo momento y elegir en montaje.

**Yorgos Lanthimos.**
- *Decisión*: angular hasta el fisheye, barridos, sin luz artificial.
- *Por qué*: "I don't want to have light"; los jump cuts "they discovered stuff in the edit" (Robbie Ryan, [The Film Stage](https://thefilmstage.com/features/cinematographer-robbie-ryan-on-the-hungry-imagination-of-yorgos-lanthimos-avoiding-prep-post-production-and-the-perfect-whip-pan/)). "When the scene gets a bit heightened, that lens comes out" (de segunda mano, [Far Out](https://faroutmagazine.co.uk/poor-things-fish-eye-lens/)).
- *Regla*: fisheye solo en el pico (1-2 planos). El barrido como corte. Zooms casi imperceptibles para tensar.

**Andrei Tarkovsky.**
- *Decisión*: el ritmo es el tiempo dentro del plano.
- *Por qué*: en *Esculpir en el tiempo*, el ritmo como curso del tiempo dentro del cuadro ([Wikipedia](https://en.wikipedia.org/wiki/Sculpting_in_Time)); "the artistic image is always a metonym" ([Goodreads](https://www.goodreads.com/work/quotes/29036)).
- *Regla*: un plano de 6-10 s con tiempo interno (viento, agua) entre cortes rápidos se convierte en el plano de valor. Mostrar una taza que se enfría, no la "nostalgia".

**David Lynch.**
- *Decisión*: ideas en fragmentos, el sonido como mundo, la oscuridad.
- *Por qué*: el deseo "is like a bait on a hook" ([Marginalian](https://www.themarginalian.org/2014/05/09/david-lynch-interview-ideas-creativity/)). "Cinema is sound and picture moving together in time"; "room tones, tones of an industrial city" ([BFI](https://bfi.org.uk/sight-and-sound/interviews/david-lynch-music-sound-chrystabell-cellophane-memories)). Elmes: "fight to take the light away" ([Reverse Shot](https://reverseshot.org/interviews/entry/3227/elmes)).
- *Regla*: un drone de ambiente bajo todo el vídeo. Abrir con una postal perfecta y bajar a lo podrido en dos planos.

### 3.5 Videoclip y publicidad

**Edgar Wright.**
- *Decisión*: animatic al beat, "zero fat".
- *Por qué*: "Because we're setting it to the songs, there's zero fat" ([SlashFilm](https://www.slashfilm.com/551800/baby-driver-edgar-wright-interview/)). Machliss: "'The shot looks good' and 'The shot works'" ([Frame.io](https://blog.frame.io/2017/07/31/baby-driver-workflow/)).
- *Regla*: clips de la duración exacta del intervalo entre beats, juzgados sobre la música y no aislados.

**Spike Jonze.**
- *Decisión*: el sentimiento queda fijo y todo lo demás es flexible.
- *Por qué*: "pop melancholy"; nunca cambia "the feeling I started with" ([LWLies](https://lwlies.com/interviews/spike-jonze-her/)). "If you're just advertising something, no one's going to care" ([shots](https://shots.net/news/view/shots-hero-spike-jonze-is-a-non-accidental-anarchist)).
- *Regla*: el sentimiento final en una línea antes del prompt. Paleta cálida para la soledad. Torpeza real antes que perfección.

**Michel Gondry.**
- *Decisión*: efecto en cámara y la canción como estructura.
- *Por qué*: "shot through layers of glass and texture"; "the computer allows a director to be a little bit more lazy" ([DGA](https://www.dga.org/craft/dgaq/issues/0601-spring-2006/independent-voice-michel-gondry)). En "Come Into My World", cuatro pasadas en bucle que suman Kylies ([befores & afters](https://beforesandafters.com/2026/03/24/olivier-gondry-on-the-making-of-kylie-minogues-come-into-my-world/)).
- *Regla*: un objeto por instrumento que aparece cuando suena. Bucle acumulativo: el último fotograma es el primero del siguiente clip, con un elemento nuevo. Texturas físicas.

**Megaforce.**
- *Decisión*: lo práctico, la ironía y el "sándwich".
- *Por qué*: "People can feel the magic more like that" ([Dazed](https://www.dazeddigital.com/music/article/17986/1/the-megaforce-manifesto)). En *BBHMM*, lo narrativo "in the very beginning and at the very end"; "The middle is much more visual" ([VICE](https://broadly.vice.com/en/article/yp5n3y/talking-to-the-co-director-of-rihannas-bbhmm-music-video)).
- *Regla*: historia en los primeros y los últimos 3-5 s e impacto en el medio. El efecto representa algo interno.

**Nabil Elderkin.**
- *Decisión*: lo mínimo.
- *Por qué*: "It's too easy to go in a million different directions"; "put the song on repeat"; "Music is powerful enough" ([FACT](https://factmag.com/2016/05/07/nabil-interview-kanye-west)).
- *Regla*: una sola idea visual. El still perfecto primero y luego animarlo.

**Dave Meyers.**
- *Decisión*: la letra da permiso.
- *Por qué*: "if it's in the lyrics, it's permission for me to do something crazy"; "the treatment 100% changed when I got to Atlanta" ([RBMA](https://daily.redbullmusicacademy.com/2015/07/dave-meyers-interview)).
- *Regla*: una imagen-firma describible en cinco palabras; si no la hay, la pieza no está terminada.

**Daniel Wolfe** (trabajo listado para Claude AI en [OnePointFour](https://www.onepointfour.co/entries/daniel-wolfe-claude-ai/) [S]).
- *Decisión*: casting de calle con intención mítica.
- *Por qué*: "street-cast"; "it's a heightened film"; "set it over one night. That grounded it" ([HeyUGuys](https://www.heyuguys.com/interview-daniel-wolfe-catch-me-daddy)).
- *Regla*: `non-model street-cast faces, weathered skin` con composición épica. Una sola noche. Un lugar con identidad.

**Ringan Ledwidge.**
- *Decisión*: verdad emocional.
- *Por qué*: "that emotional truth"; la tregua de 1914 como "very basic human act" ([shots](https://shots.net/news/view/creative-correspondence-ringan-ledwidge-and-nina-meredith)).
- *Regla*: un gesto simple y universal en un contexto de conflicto, concreto y lento. Construir la pieza hacia un solo fotograma póster.

**Tarsem Singh.**
- *Decisión*: el encuadre por encima del lugar, sin CGI.
- *Por qué*: "What matters is how I'm framing it"; "no computer effects"; pintó Jodhpur de azul; "everything for her had to be visual" ([RogerEbert.com](https://www.rogerebert.com/interviews/tarsem-and-the-legend-of-the-fall)).
- *Regla*: recortar hasta que solo queden formas, con una figura de color primario. Si no se entiende en silencio, rehacerlo.

### 3.6 Patrones comunes

1. **Dos métodos y una síntesis.** Los planificadores (Kubrick, Scott, Bong, Park, Anderson, Wright, Aster, Eggers, Leone, Kurosawa, Ozu, Iñárritu, Chazelle) frente a los pescadores (Wong y Doyle, Malick y Lubezki, Lynch, Lanthimos en parte, Spielberg en Omaha, Cuarón en *Roma*). En IA la coherencia entre clips es el problema principal: conviene planificar como Bong o Wright y pescar solo dentro de cada plano. Generar sin cobertura, a lo Tarantino, exige tener el montaje decidido [inferencia].
2. **La música va primero**: Wong, Leone, Wright, Nabil, Tarantino, Iñárritu, Scorsese, Gondry [V].
3. **Lo real ancla**: Nolan, Gondry, Megaforce, Tarsem, Park. En IA, foto, voz o lugar reales con lo generativo como capa [inferencia].
4. **Restricción formal**: una lente, una altura, una paleta, un clima (Ozu, Anderson, Eggers, Kurosawa).
5. **El truco tiene que decir algo**: Park, Megaforce, Aster, Lanthimos.
6. **Contención con un punto de exceso**: el plano que respira (Ozu, Tarkovsky), la anticipación dilatada (Leone, Tarantino) y una imagen-firma extrema (Meyers). Es la contención racionada del informe 1 vista desde los directores.

**Lista por pieza** [inferencia]:
1. Sentimiento final en una línea.
2. Tema musical con beats.
3. Imagen-firma en cinco palabras.
4. Shot list o animatic con duraciones.
5. Sistema formal restringido.
6. Clima dominante.
7. Cada truco responde a "¿qué dice?".
8. Un plano que respira tras el pico.
9. Ambiente sonoro continuo.
10. Se entiende en silencio.

---

## 4. Motion experto: de After Effects a Remotion

El oficio de After Effects se traduce a código casi uno a uno: la influencia de los keyframes se convierte en una `cubic-bezier`, el overshoot en un `spring()` y el desenfoque de movimiento en `<CameraMotionBlur>` o en un desenfoque que depende de la velocidad. Lo que no tiene número con fuente se dice: la anticipación, el squash, la vibración de cámara y los tiempos de tipografía cinética.

### 4.1 Tabla de números

| Parámetro | Valor | Nivel y fuente |
|---|---|---|
| Easy Ease por defecto | Velocidad 0 e influencia del 33,33 % a cada lado | [DOC] [Adobe](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/speed-between-keyframes/speed.html) |
| Influencias y sensación | 33-60 %: sutil, casi lineal; 60-85 %: deslizamiento "diseñado"; por encima, "floaty" | [PRACT] [Cursa](https://cursa.app/en/page/after-effects-for-absolute-beginners-smooth-motion-with-easing-and-the-graph-editor) |
| Pasada de pulido | 50-70 % de salida en el primer keyframe y 60-80 % de entrada en el último | [PRACT] Cursa |
| Duraciones de partida (24/30 fps) | Movimiento pequeño 10-16 f; medio 16-24 f; entrada grande 20-30 f | [PRACT] Cursa |
| Overshoot de Ebberts | Seno con amplitud que decae exponencialmente; frecuencia 3, decay 5; **amplitud = v / (frecuencia·2π)**: a más velocidad de llegada, más overshoot | [EXPERT] [motionscript.com](http://www.motionscript.com/articles/bounce-and-overshoot.html) |
| Rebote real (bounce) | Parábolas que se acortan: elasticidad 0,7, gravedad 5000, máximo 9 botes; no usar `Math.abs(sin)` | [EXPERT] motionscript.com |
| "Inertial bounce" | amp 5, freq 2, decay 4 | [EXPERT] [Animoplex](https://gist.github.com/animoplex/aafd6a157282351c8dfeea385d969ef2) |
| `spring()` de Remotion | Por defecto mass 1, damping 10, stiffness 100; más damping = menos rebote; `durationInFrames` lo estira a una duración exacta | [DOC] [Remotion](https://www.remotion.dev/docs/spring) |
| Sandbox de Comeau | mass 1,75, tension 200, friction 12; los springs "do a better job tricking our brains" que las bezier | [EXPERT] [Josh Comeau](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/) |
| Motion blur en AE | Obturador de 180° con fase de −90° (centrado en el fotograma); a 24 fps, la estela es 2-2,5× más larga que en vídeo entrelazado; el desenfoque fuerte perjudica la lectura del texto | [EXPERT] [ProVideo Coalition](https://www.provideocoalition.com/motion_blur/) |
| Cuándo no usar blur | En lo estilizado o cuando tapa el contacto (pierde peso); alternativas: smears, múltiplos, estelas | [EXPERT] [School of Motion](https://www.schoolofmotion.com/blog/motion-blur-after-effects) |
| `<CameraMotionBlur>` | shutterAngle 180, samples 10 (recomendado 5-10); "destructive to colours"; hijos en `<AbsoluteFill>`; no llamar `useCurrentFrame()` fuera del envoltorio | [DOC] [Remotion](https://www.remotion.dev/docs/motion-blur/camera-motion-blur) |
| Range Selector (texto) | Ease High y Ease Low de −100 a 100 %; basado en caracteres, palabras o líneas; Randomize Order con semilla; Wiggly con Correlation (100 % = todos a la vez) | [DOC] [Adobe](https://helpx.adobe.com/after-effects/using/animating-text.html) |

### 4.2 Traducciones a Remotion

**Influencia → bezier** [INFERENCE]. Con dos keyframes a velocidad 0, una influencia de salida `a` y una de entrada `b` dan aproximadamente `cubic-bezier(a, 0, 1-b, 1)`. El Easy Ease (33/33) ≈ `(0.33, 0, 0.67, 1)`; el asimétrico "pro" (70/90) ≈ `(0.7, 0, 0.1, 1)`; solo ease-out (0/85) ≈ `(0, 0, 0.15, 1)`. Los valores de easings.net (easeOutExpo `(0.16, 1, 0.3, 1)`, easeOutQuint `(0.22, 1, 0.36, 1)`) están citados de memoria en la nota y **no se pudieron verificar** (la página no los muestra en texto).

```ts
const ease = (a: number, b: number) => Easing.bezier(a, 0, 1 - b, 1);
const x = interpolate(frame, [0, 20], [0, 400], {
  easing: ease(0.7, 0.9), extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
```

**Damping → sensación** [INFERENCE]. La equivalencia que propone la nota (sin validar con renders): damping 8-10 ≈ inertial bounce con dos o más oscilaciones visibles; damping 14-18 ≈ un solo overshoot (Ebberts con frecuencia 3 y decay 5); damping 26 o más, o `overshootClamping: true`, ≈ ease-out exponencial puro. Con la fórmula del informe 1, ζ = damping / (2·√(stiffness·mass)), se puede calcular el overshoot teórico de un oscilador amortiguado, exp(−πζ/√(1−ζ²)). Es un cálculo propio, no una fuente:

| Config (mass 1 salvo indicación) | ζ | Overshoot teórico |
|---|---|---|
| Por defecto: damping 10, stiffness 100 | 0,50 | ~16 % |
| Pop premium: damping 14, stiffness 180, mass 0,8 | 0,58 | ~10 % |
| damping 14, stiffness 100 | 0,70 | ~5 % |
| damping 18, stiffness 100 | 0,90 | ~0,2 % |
| damping 26, stiffness 100 | 1,30 | 0 % |

**Pop premium a 30 fps** [INFERENCE]: escala de 0 a 1 en 12-18 f con un solo overshoot visible del 5-10 % y opacidad de 0 a 1 **solo en los 4-6 primeros fotogramas**. Si se funde durante toda la duración, el movimiento queda blando.

```ts
const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180, mass: 0.8 } });
const opacity = interpolate(frame - delay, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**Overshoot proporcional a la velocidad** [INFERENCE sobre EXPERT]. El "rebote en todo" de lo hecho con IA canta porque el rebote no depende de la velocidad de llegada. `Easing.elastic` lo fija; un spring que parte de la distancia real, o la fórmula de Ebberts, lo escala:

```ts
// t: segundos desde la llegada; v: velocidad de llegada en px/s
const settle = (v: number, t: number, freq = 3, decay = 5) =>
  (v / (freq * 2 * Math.PI)) * Math.sin(freq * 2 * Math.PI * t) / Math.exp(decay * t);
```

**Anticipación y follow-through** [INFERENCE, sin fuente numérica]. `Easing.back(s)` [DOC] o un interpolate de tres keyframes (`[0, 6, 20] → [0, -0.08*dist, dist]`): retroceso del 5-10 % del recorrido en 4-8 f y luego la salida con ease-out fuerte. Para el follow-through, los hijos usan el mismo spring con `delay` de 1-3 f cada uno y algo menos de damping, para que asienten después del padre.

**Texto por carácter** [INFERENCE]. Un stagger de 1-2 f por carácter a 30 fps; desplazamiento en Y del 40-60 % de la altura de línea hasta 0 con un spring de damping 15-20; `overflow: hidden` por línea para revelarlo con máscara. Para líneas largas, el stagger va por palabras, el equivalente a "Based On: Words". Animar el tracking de 0,3 em al valor final en 30-60 f con ease-out exponencial. "Randomize Order" equivale a barajar los índices con `random(seed)`.

**Desenfoque por velocidad** [INFERENCE]. Es más barato que `<CameraMotionBlur>` y no degrada el color: v = valor(f+0,5) − valor(f−0,5); longitud L = |v|·(ángulo/360), aplicada en la dirección del movimiento (SVG `feGaussianBlur` en un eje y rotado, o un ligero `scaleX`). L = 0 si |v| < ~1 px/f, para que el texto quieto quede nítido. Ángulo de 180° para realismo y de 90-120° si hay texto que leer. No está verificado si `<CameraMotionBlur>` centra las muestras como la fase −90° de AE.

**Smear** [INFERENCE]: en 1-2 fotogramas de velocidad máxima, `scaleX(1 + k·|v|)` hasta 1,2-1,5×, o `<Trail>` con 3-6 capas y poco `lagInFrames` [DOC para `<Trail>`, inferencia para los valores].

### 4.3 Tics robóticos y su arreglo

[INFERENCE, cada punto atado a un principio con fuente donde lo hay]
1. Todo empieza en el mismo fotograma → stagger por jerarquía: primero el héroe, el apoyo 2-4 f después y los detalles al final.
2. La misma duración para todo → escalar con la distancia y el tamaño (bandas de 10-16, 16-24 y 20-30 f).
3. Movimiento lineal o Easy Ease 33/33 simétrico → ease asimétrico ("rarely exactly what you need", School of Motion).
4. Overshoot que no depende de la velocidad → springs proporcionales a la llegada (Ebberts).
5. Sin holds → dejar reposar el momento clave (mínimo 6 f; 12 para leer, según el informe 1).
6. Rebote en todo → overshoot solo en el héroe y ease-out sin rebote en el resto.
7. Diagonales en línea recta → curvas distintas en X y en Y para que salgan arcos.
8. Blur sobre texto quieto o en el contacto → blur que depende de la velocidad.
9. Vibración de cámara uniforme y de alta frecuencia → baja frecuencia (≈1-3 Hz, pocos píxeles) más una rotación pequeña aparte, que decae tras el impacto (convención sin fuente).

---

## 5. Catálogo de técnicas de montaje

La mayoría de los fotogramas de esta tabla son **[I]**: convenciones para probar, no medidas (25 fps salvo que se indique). Las fuentes de docentes (StudioBinder, No Film School, Adobe, PremiumBeat) definen y dan ejemplos, pero casi nunca cifras.

### 5.1 J, L y "T cut"

**La aclaración correcta** [E]. Una edición partida es aquella en que la imagen y el sonido cambian en momentos distintos. **J: el sonido del plano siguiente entra antes**, bajo la imagen del anterior. **L: el sonido del plano anterior se alarga** bajo la imagen del siguiente. El nombre viene de la forma de los clips en la línea de tiempo ([Wikipedia](https://en.wikipedia.org/wiki/Split_edit); [Adobe](https://www.adobe.com/creativecloud/video/discover/j-cut-and-l-cut); [Apple](https://support.apple.com/guide/final-cut-pro/ver1632d82c/mac)). La página de StudioBinder sobre match cuts las da al revés ([StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)): no usarla como referencia para esto. Sin ediciones partidas, una conversación parece "a tennis match" [E].

**"T cut": tres lecturas posibles, decisión pendiente de Erik** [I]. No aparece en la documentación de Avid, Premiere, Resolve ni FCP, ni en manuales de montaje.
- **(a)** Sinónimo flojo de cualquier edición partida, porque el desfase forma una T en la línea de tiempo.
- **(b)** Corte seco: imagen y sonido cortan en el mismo fotograma y forman una línea vertical (el "butt cut").
- **(c)** Una J y una L combinadas: el audio entra antes *y* sale después de un plano insertado, como un plano de recurso sobre un diálogo continuo; en la práctica, un inserto sobre audio sin cortar.

No se elige ninguna aquí: hay que preguntarle a Erik qué entiende él.

### 5.2 Tabla técnica → qué hace sentir → cuándo → fotogramas de trabajo

| Técnica | Qué hace sentir | Cuándo (y cuándo no) | Fotogramas de trabajo |
|---|---|---|---|
| **J-cut** | Anticipación; el oído guía al ojo y el corte parece motivado [I] | Diálogo, cambio de escena, VO que adelanta el siguiente b-roll; no si revela una sorpresa antes de tiempo | Diálogo 6-15 f; cambio de escena o pre-lap 0,5-2 s; en reel 4-10 f [I]. En Remotion: `<Sequence from>` del `<Audio>` unos 8 f antes que el visual |
| **L-cut** | Reflexión: deja que la frase caiga sobre una cara (Kuleshov) [I] | Reacciones; colas de música o ambiente | 8-24 f; las colas de ambiente, varios segundos [I] |
| **Puente sonoro / pre-lap** | Continuidad entre escenas; tira hacia delante | Arranques de *Shaun of the Dead* y *Chicas malas* [E] ([StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)) | 0,5-2 s [I] |
| **Corte en acción** | Invisibilidad; "Our eyes follow movement" [E] ([NFS](https://nofilmschool.com/match-on-action-cut)) | Casi todo corte de reel; no cuando quieres que el corte se note o cuando la quietud tras la acción es lo importante | Dmytryk: "near the dead center of the action" [E]; ~1/3 del gesto en A y 2/3 en B, quitando 1-3 f de movimiento repetido [I] |
| **Corte temprano, medio o tardío** | Anticipación / impulso / resolución | Final de *Tiburón* / pelea de *Civil War* / Upham en *Ryan* [P] ([Filmsupply](https://wpengine.fm.co/filmsupply/cutting-on-action-editing/)) | Estudiar la referencia a 0,25× [P] |
| **Corte en el parpadeo** | Fin de un pensamiento (Murch) [E] | Diálogo, entrevista, VO: cortar al acabar la idea | En el fotograma en que se cierra el párpado o justo después, o en una exhalación o mirada que se aparta [I] |
| **Raccord gráfico** | Conexión o metáfora | Cerilla → amanecer (*Lawrence*), hueso → satélite (*2001*), desagüe → ojo (*Psicosis*) [E]; no si la rima no significa nada | Misma posición y escala; corte seco = salto o yuxtaposición; encadenado de 6-12 f = transformación [I] |
| **Montaje intelectual** | Una tercera idea de dos imágenes (Eisenstein) [E] | Problema ↔ producto con una forma compartida | Planificarlo en el shot list: rara vez sale encontrado en post [I] |
| **Raccord de miradas** | Ver lo que ve el personaje | POV, revelado de producto [E] ([Adobe](https://www.adobe.com/creativecloud/video/hub/guides/eyeline-match-rules-for-filmmakers.html)) | Mantener la dirección de la mirada |
| **Jump cut (Godard)** | Ruptura; recuerda que es una película [E] ([Wikipedia](https://en.wikipedia.org/wiki/Jump_Cut)) | Estados subjetivos (ansiedad, memoria) | Sin valor fijo |
| **Jump cut (YouTube)** | Densidad de información [I] | Cabezas que hablan; no en confesiones ni en premium (se lee como vlog) | Cola de 2-4 f tras la palabra; alternar 100 % y un punch-in del 110-130 %; fundido de audio de 1-2 f en cada unión [I] |
| **Morph Cut** | Ocultar un salto | Solo una cabeza que habla, plano fijo, fondo estático y sin cambios de luz; empezar y acabar cerca de los picos de palabra [E] ([Adobe](https://blog.adobe.com/en/publish/2015/06/18/morph-cut-tips-tricks-for-best-results)) | Adobe no da duración |
| **Montaje paralelo** | Contraste o suspense entre acciones simultáneas | El bautizo de *El padrino* [E]; en un 30": mundo del problema y mundo de la solución [I] | Segmentos que se acortan: 6, 4, 2 y 1 s [I] |
| **Tensión con poco movimiento** | Amenaza contenida | Insertos estáticos: cara, mano, arma (*No es país para viejos*) [P] | — |
| **Montaje de paso del tiempo** | Compresión, transformación | *El graduado* [E] | Planos de 0,3-0,7 s sobre la música [I] |
| **Elipsis** | Confianza en el espectador | "Entrar tarde, salir pronto" [I] | — |
| **Barrido (whip pan)** | Energía, continuidad | PTA y Chazelle [E] | Ambos barridos en la misma dirección y velocidad; corte en el fotograma más borroso; 2-6 f de blur direccional y un whoosh con el pico en el corte [I] |
| **Cortinilla de objeto o cuerpo** | Corte oculto | *La soga*, *1917*, *Birdman*, *Spectre* [E] ([NFS](https://nofilmschool.com/iconic-invisible-cuts-in-movies)); no si los dos planos no casan de estilo | Corte cuando el objeto tapa del todo; si no lo tapa, máscara de 3-8 f tras su borde [I] |
| **Encadenado** | Tiempo que pasa, sueño, rima suave | No entre dos planos del mismo sujeto con ángulos parecidos (parece un error) [I] | Corto 12-24 f; emocional 1-3 s [I]. El encadenado de 1 s por defecto en cada corte es la señal más clara de aficionado [P] ([Fstoppers](https://fstoppers.com/education/7-premiere-pro-habits-are-making-your-edits-look-amateur-902662)) |
| **Fundido a negro / a blanco / a color** | Final / muerte, flash, recuerdo / puntuación | Cierre de capítulo; destello de marca | Destello de color 4-8 f; destello blanco de reel 2-4 f [I] |
| **Smash cut** | Choque, comedia | De lo intenso a lo opuesto, sin solapar el audio | Corte seco [I] |
| **Flash cuts** | Recuerdo, trauma, impacto | Con moderación; cuidado con las normas de fotosensibilidad | 1-4 f [I] |
| **Congelado** | Instante decisivo; presentar a un personaje | Final de *Los 400 golpes*; congelado con rótulo como gancho [I] | — |
| **Rampa de velocidad** | Acento en el pico | Solo con un pico motivado | Del 100 % al 20-30 % y vuelta, con curvas suavizadas; rodar a 50/60 fps o más [I] |
| **Pantalla partida** | Simultaneidad, comparación | Antes y después [I] | — |

### 5.3 Reglas que sí tienen fuente

- **Dmytryk** ([ProVideo Coalition](https://www.provideocoalition.com/seven_rules_for_film_and_video_editors/amp/)) [E]: no cortar sin una razón positiva; si dudas, corta largo; corta en movimiento; lo fresco antes que lo rancio (si hay que añadir fotogramas, a la cabeza del plano nuevo); empezar y acabar escenas en acción continua; los valores dramáticos antes que el raccord perfecto; primero la sustancia y después la forma.
- **Ritmo** [P] ([PremiumBeat](https://www.premiumbeat.com/blog/how-to-edit-a-film-to-music-without-it-becoming-a-music-video)): "you never want to cut your film too closely to the beat". El corte en el beat se reserva para los cambios clave, "once or twice in a sequence", y los cortes "a few frames before or after" el cambio musical se sienten más orgánicos. Hay que variar la duración de los planos como la de las frases ([Adobe Community](https://community.adobe.com/t5/premiere-pro-discussions/faq-discussion-learning-to-edit-how-do-i-decide-where-to-cut/m-p/10642611)). Valores de partida [I]: cortes estructurales en el tiempo fuerte de las frases (cada 4 u 8 compases), cortes dentro de la frase a contratiempo, cambio de densidad en el estribillo o el drop, y un hold de respiro cada 5-8 cortes. Hay quien corta 1-2 f antes del transitorio, pero sin fuente.
- **Aficionado frente a profesional** [P] ([Fstoppers](https://fstoppers.com/education/7-premiere-pro-habits-are-making-your-edits-look-amateur-902662)): el aficionado corta "when the clip runs out"; el profesional, cuando cambia la energía. Prueba: ver el montaje en silencio y comprobar si los cortes siguen tirando hacia delante.

---

## 6. Limpio frente a amateur: checklist de acabado

"Premium" no es minimalismo: es **un sistema estricto aplicado sin excepciones**. Nike es de alto contraste, pero con una sola familia tipográfica y blanco y negro más el color del producto [INFERENCE].

**Tipografía**
- [ ] Una familia (dos como mucho), 2-3 pesos y 3 tamaños, en escala de 1,5-1,618 para vertical [INFERENCE].
- [ ] Sin pesos finos: "In general, avoid light font weights" [EVIDENCE] ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/typography)).
- [ ] Tracking según el tamaño. En SF Pro (1/1000 em): +41 a 6 pt, 0 a 12, −26 a 17, −23 a 20, ~0 a 23-24, **+14 a 28, +10 a 40, +8 a 48 y 0 a partir de 80 pt**, porque la Display ya viene apretada [EVIDENCE]. Esto **confirma la corrección del traspaso**: nada de interletrado negativo en SF Pro Display grande. Solo en fuentes sin corte display (Inter de texto, Helvetica), entre −1 y −3 % em [INFERENCE].
- [ ] Mayúsculas y versalitas con +5-12 % de interletrado; interlineado del 120-145 %; la negrita y la cursiva, lo menos posible y nunca juntas [PRACTITIONER] ([Butterick](https://practicaltypography.com/summary-of-key-rules.html)).
- [ ] Subtítulos: Netflix fija 42 caracteres por línea, 2 líneas, 20 caracteres/s, pirámide con más peso abajo, sin separar artículo y nombre, y "…" como un solo carácter [EVIDENCE] ([Netflix](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide)). En 9:16, unos 20-32 caracteres por línea [INFERENCE].
- [ ] Contraste de 4,5:1, o 3:1 en texto grande (≥ 24 px, o ≥ 18,5 px en negrita); 4,499:1 no pasa [EVIDENCE] ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)). Se mide contra el píxel más claro de detrás, no contra la media [INFERENCE].
- [ ] En lienzo de 1080×1920: unos 40-48 px como mínimo para el texto secundario y 60-80 px o más para ganchos y subtítulos principales (derivado; comprobar en móvil) [INFERENCE].
- [ ] Texto sobre imagen con degradado (40-60 % de opacidad que se desvanece en el 30-40 % de la altura), sombra suave o caja. Nada de sombras duras de 1-2 px, contornos gruesos ni brillos [INFERENCE].

**Rejilla y espacio** [INFERENCE salvo que se indique]
- [ ] Márgenes y huecos en múltiplos de 8 px; una rejilla de columnas (apartado 2.14); un solo borde izquierdo en toda la pieza; centrado solo para frases cortas de una línea.
- [ ] Alineación óptica: la O, la A, la V y los triángulos de play se ajustan a ojo, y la puntuación cuelga fuera del margen.
- [ ] Un foco por cuadro: el dominante, con al menos el doble de tamaño o contraste que el resto, y dos elementos de apoyo como mucho.
- [ ] Nada crítico en la franja baja de los Reels [PRACTITIONER]; revisar con `<SocialSafeZones>` de Remotion [EVIDENCE/tool] ([Remotion](https://www.remotion.dev/elements/overlays/social-safe-zones/)).

**Color** [INFERENCE salvo que se indique]
- [ ] Reparto 60-30-10: neutro dominante, color secundario y un solo acento por pieza.
- [ ] Nada de #000 ni #FFF puros: mejor #0E0E0E o #F5F3EF.
- [ ] Un solo look para todos los planos (balance de blancos, nivel de negro, saturación), sobre todo al mezclar Kling, Veo y Sora. La piel sobre la línea de tono de piel del vectorscopio. Saturación muy por debajo de la que da el generador por defecto.
- [ ] Sin etalonaje pesado: complica la compresión de Instagram y provoca banding y cambios de color [PRACTITIONER] ([Lilach Bullock](https://www.lilachbullock.com/fix-instagram-reels-quality-dropping-after-upload/)).

**Acabado y exportación**
- [ ] El banding sale de los degradados en 8 bits más la recompresión: grano o ruido **aplicado igual en todos los planos**. H.265 Main10 solo ayuda si el origen tiene esa profundidad [EVIDENCE/PRACTITIONER] ([PremiumBeat](https://www.premiumbeat.com/blog/debanding-footage-davinci-resolve)). El grano no hace cine por sí solo: el de Volvo se calificó de "lazy" [PRACTITIONER].
- [ ] Una sola receta de textura (grano, halación, bloom); sin sobreenfocar lo generado por IA [INFERENCE].
- [ ] Reels: 1080×1920, H.264 + AAC en MP4, 30 fps, "10 Mbps or more", sin subir 4K, con "Upload at highest quality" activado y frecuencia de fotogramas constante; las copias se sacan del máster limpio, nunca de un archivo ya comprimido [PRACTITIONER] ([Lilach Bullock](https://www.lilachbullock.com/fix-instagram-reels-quality-dropping-after-upload/); [Visnalize](https://visnalize.com/blog/instagram-media-specs-compression-guide)).
- [ ] Remotion: `--codec=h264`, `--crf` de 16-18 (o 12-20 Mbps), yuv420p, más una capa de grano animado al 2-4 % sobre degradados y colores planos [INFERENCE].
- [ ] Montaje: fundidos de audio de 1-4 f en cada corte de sonido, cama de room tone sin agujeros de silencio digital, −14 LUFS y −1 dBTP (informe 1), sin fotogramas negros sueltos y subtítulos a ±2 f de la voz [I]. Microfundidos automáticos en los bordes de los clips [E] ([Descript](https://help.descript.com/timeline/automatic-microfades)).

**Tics de IA** (vocabulario de la crítica [PRACTITIONER]: "plastic-y", movimiento a saltos, texto que "isn't nearly legible" en McDonald's; pelaje inconsistente, bocas perfectamente circulares y "part shiny, part plastic" en Coca-Cola ([AOL/Yahoo](https://www.aol.com/articles/ai-slop-christmas-why-mcdonalds-143342213.html)); "overly polished" en Guess, "awful oily sheen" en Toys "R" Us ([Creative Bloq](https://www.creativebloq.com/design/branding/5-failed-ai-ads-that-prove-human-creativity-is-still-superior)))
- [ ] Ningún texto generado: todo el texto se pone en Remotion [INFERENCE].
- [ ] Manos, dientes, dirección de la luz y temperatura de color revisados plano a plano.
- [ ] Menos brillo especular; textura de piel (poros, alguna imperfección); grano coherente.
- [ ] El límite de 5-10 s del generador no puede dictar un ritmo de jump cuts: la crítica a McDonald's señala justo eso, "short clips stitched together with hard jump cuts" [PRACTITIONER].
- [ ] Anclar en lo humano o en lo real: Antebi ganó el AIFF 2025 por las interpretaciones humanas; Trillo genera "hundreds of shots", cura y se apoya en arte existente ([Variety](https://variety.com/vip/runway-ai-film-festival-1235993270); [Motionographer](https://motionographer.com/2025/05/20/paul-trillo-hacking-cinemas-next-level/)) [PRACTITIONER].

**Contención** [INFERENCE]
- [ ] Sistema de motion: 1-2 curvas, 2-3 duraciones (p. ej. 8, 12 y 20 f a 30 fps), una dirección de entrada, un tipo de transición y un estilo de resalte.
- [ ] Como mucho una animación principal y dos secundarias a la vez, con stagger constante de 2-4 f.
- [ ] Señales de barato: más de dos fuentes, más de tres colores aparte de los neutros, espaciado al azar, brillo o contorno en el texto, transiciones por defecto, grano distinto en cada plano, texto pequeño ilegible.

---

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

## 8. Huecos y lo no verificado

- **Composición**: no se consultaron Mascelli, Dondis, Kandinsky, Müller-Brockmann, Block (los tipos de espacio), Murch (eye-trace), McManus sobre la sección áurea, Locher ni Itti y Koch. Siguen sin fuente los cuadrantes de *Drive*, el encuadre de *Mr. Robot*, la dirección de pantalla en *El señor de los anillos*, el abrigo rojo de *Schindler* y la regla de impares.
- **Directores**: casi todas las citas pasaron por un modelo resumidor. Solo las de Wong en la BFI se cotejaron. Sin cita propia: la simetría y la perspectiva de un punto de Kubrick, el proceso de Nolan (IMAX, storyboards), el step-printing de Wong, la paleta de *Her*, la lluvia en interiores de Tarkovsky, la mirada a cámara de Ozu y Malick en primera persona.
- **Motion**: faltan números con fuente para anticipación, squash, wiggle, vibración de cámara, tiempos de tipografía cinética, parallax 2.5D y morphs. Los valores de easings.net no se pudieron verificar. Tampoco se sabe si `<CameraMotionBlur>` centra las muestras. La equivalencia entre damping y sensación hay que validarla con renders.
- **Montaje**: ninguna fuente da fotogramas para J/L, el corte en acción, el barrido o la percepción de 1-2 f antes del beat. Smash cut, congelado, rampas y pantalla partida no tienen fuente de autoridad. **"T cut" no existe como término establecido.**
- **Acabado**: no hay cifras oficiales de zonas seguras de TikTok e Instagram ni de bitrate. No se consultaron la guía de subtítulos de la BBC ni los tiempos de Netflix. 60-30-10, la rejilla de 8 px y las escalas modulares son práctica estándar sin cita.
- **Pipeline**: no hay fuentes sobre duraciones por fase, PPM reales, checklists de control de calidad de productoras, tratamientos completos de directores con nombre ni ganadores del AIFF 2026.

**Decisiones pendientes de Erik** (heredadas del traspaso): qué entiende por "T cut" (5.1), y si sus reglas de "un cambio cada 1-1,5 s" y "pop en cada palabra" las validó por resultado o porque venían de la referencia.
