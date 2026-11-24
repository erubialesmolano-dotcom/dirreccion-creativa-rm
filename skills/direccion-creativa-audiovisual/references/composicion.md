# Composición y mirada

> Fuente: informe 1 §composición + informe 2 §2. Etiquetas de evidencia: [estudio]/[estudio*] dato empírico (con * si viene de plataforma con interés comercial), [norma]/[DOC] especificación oficial, [creador]/[EXPERT] quien hizo la pieza o practicante reconocido, [crítica], [PRACT] tutorial, [inferencia]/[INF]/[I] deducción sin fuente directa. Trata [inferencia] como recomendación, no como hecho.

## Composición, mirada y timing tienen números concretos

### El ojo va a lo que se mueve sobre lo quieto, y vuelve al centro tras el corte

En el proyecto de eye-tracking DIEM de Tim Smith, las fijaciones duran **unos 300 ms** y la mayoría de los espectadores miran la misma zona a la vez ("sincronía atencional"). Esa sincronía la predice sobre todo el **contraste de movimiento**: un punto que se mueve en una escena quieta, objetos que aparecen de golpe, manos, cabezas y cuerpos; si solo se mueve un punto, casi todo el mundo lo mira [estudio] ([RogerEbert.com](https://www.rogerebert.com/scanners/how-we-really-watch-a-movie)). Entre planos, a igualdad de condiciones, el ojo vuelve al centro del cuadro [estudio] ([Bordwell](https://www.davidbordwell.net/blog/2016/02/10/off-center-mad-maxs-headroom/)). En *Mad Max: Fury Road*, Miller y Seale centraron la acción en las secuencias rápidas para que el ojo no tuviera que buscar al sujeto con "1.8 seconds" por plano, y Bordwell describe el descentrado como acento sobre una base centrada [creador / crítica] ([Bordwell](https://www.davidbordwell.net/blog/2016/02/10/off-center-mad-maxs-headroom/)).

Las reglas que salen de ahí son directas. **Anima una sola cosa importante cada vez y congela el resto**, porque mover varias dispersa la sincronía [inferencia sobre estudio]. **Por debajo de ~1 s por plano, el punto de interés tiene que estar donde ya mira el ojo**: el centro, o el mismo sitio que en el plano anterior. Se rompe cuando se quiere desorientar (terror, caos, composición "all-over" del cine de acción de Hong Kong) [crítica + inferencia]. Murch lo formula como oficio: su trabajo es "gently prod the attention of the audience" hacia distintas partes del cuadro [creador] ([StudioBinder](https://studiobinder.com/blog/walter-murch-rule-of-six)).

### El vacío comunica escala, pausa y lujo

Un sujeto pequeño en mucho espacio negativo se lee como vulnerable o aislado, sin diálogo ni música (*Her*, *Lost in Translation*, *Manchester by the Sea*) [crítica] ([No Film School](https://nofilmschool.com/when-wide-shots-mean-isolation)). Los *pillow shots* de Ozu, planos de vida cotidiana mantenidos varios segundos entre escenas, sirven de transición, de pausa para que la emoción decante y de recordatorio de que el mundo sigue [crítica] ([BFI](https://www.bfi.org.uk/features/enigmatic-pillow-shots-yasujiro-ozu)). En un reel, el equivalente es **un plano vacío de 1,5-3 s después del golpe emocional** [inferencia]. Escala emocional del sujeto como convención de oficio no verificada: grande y centrado = poder o confrontación; pequeño con aire = soledad; descentrado con aire hacia donde mira = expectativa; aire detrás del sujeto = amenaza [inferencia]. La asociación "mucho vacío + un objeto + tipografía pequeña = caro" y "densidad = oferta o urgencia" es razonable pero no tiene fuente en esta investigación (no se pudieron verificar Apple, Vignelli ni Rams).

### La cámara se mueve solo si hay motivo

Deakins: "If the camera moves it's got to be for a reason", con Bresson de modelo [creador] ([Hazlitt](https://hazlitt.net/node/10611811)). El operador de Fincher: la cámara nunca se mueve sin motivo, y por eso cuando se mueve el público lo nota; si se hace en cada plano, "the audience doesn't see it" [creador] ([No Film School](https://nofilmschool.com/david-fincher-never-pans)). Fincher odia la estética de la Steadicam pero la acepta para el punto de vista de un borracho [creador] ([StudioBinder](https://studiobinder.com/blog/david-fincher-interview-directing)). Reglas para IA: **por defecto, "static locked-off shot"**, porque los generadores mueven la cámara siempre; **como mucho 1-2 movimientos con significado en 30 s**; cámara en mano solo cuando el personaje ha perdido el control; generar con margen (16:9 o 4K) y reencuadrar en montaje, como Fincher con el sensor sobrante [inferencia sobre creador]. Como el movimiento que ha crecido en el cine es el de dentro del plano, pedir acción dentro del plano rinde más que pedir dolly o drone gratuitos [inferencia sobre estudio].

### Qué distingue lo "premium" de lo barato en motion

School of Motion insiste en que el easy-ease por defecto "rarely" es lo que necesitas y en que el oficio está en dar forma a lo que pasa entre fotogramas clave con el editor de gráficas [creador] ([School of Motion](https://www.schoolofmotion.com/blog/graph-editor-after-effects)). ManvsMachine: "we never want something to look like it's come from a computer" [creador] ([Clever podcast](https://www.cleverpodcast.com/blog/ep-164-mike-alderson)). Holmedal (ManvsMachine) llama "fractured flow" a encadenar planos con match cuts de composición o de inercia, y pide claridad de luz y composición antes que la "guarnición" de la ejecución [creador] ([Motionographer](https://motionographer.com/2016/05/02/interview-man-vs-machines-simon-holmedal/)). La lista resultante de señales premium es inferencia: pocos elementos moviéndose a la vez, escalonado que sigue la jerarquía, curvas asimétricas (salida rápida, asentamiento largo), holds largos para leer y una curva distinta por tipo de movimiento en vez de un `Easing.ease` global. Animar "a doses" (`Math.floor(frame/2)*2`) da una textura menos de software; la cámara y los barridos van a unos para que no tartamudeen [inferencia]. **Regla de transición motivada**: tiene que pasar al menos una cosa a través del corte (forma o posición, dirección y velocidad, color o valor, o significado); si no pasa ninguna, mejor un corte seco [inferencia sobre Holmedal]. Las imperfecciones controladas de Kyle Cooper en *Se7en* (rayado a mano, transfer cortado y reensamblado, accidentes conservados) eran el concepto, no decoración: presentar al asesino en los créditos [creador] ([Art of the Title](https://www.artofthetitle.com/title/se7en/)). Antes de animar, formula en una frase el núcleo de la pieza y busca la textura que *sea* ese núcleo [inferencia].

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
