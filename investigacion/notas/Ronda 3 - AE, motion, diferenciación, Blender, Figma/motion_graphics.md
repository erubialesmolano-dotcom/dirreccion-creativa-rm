# Motion graphics que funcionan y se ven de estudio top (ronda 3)

**Alcance.** Estas notas amplían, sin repetirlos, tres documentos previos:

- `motion_design_timing.md`: los 12 principios de Disney en fotogramas, el *Don't Blink* de Apple, la velocidad de lectura y las citas de ManvsMachine y Buck sobre premium frente a barato.
- `clean_premium.md`: tipografía, retícula, color y acabado.
- `after_effects_motion.md`: graph editor, influencia, springs, motion blur y Text Animators.

Aquí el foco está en cinco cosas: (1) el motion como **sistema** (UX in Motion y los sistemas de motion de marca, con tokens numéricos), (2) cómo deciden los estudios, (3) casos de marcas tech, (4) sonido y (5) short-form premium frente a short-form "retention". Cierra con errores de aficionado, mini-casos y una chuleta.

**Etiquetas.**

- **[DOC]**: documentación oficial de un sistema o plataforma.
- **[EXPERT]**: entrevista o texto de un estudio o profesional reconocido.
- **[CASO]**: pieza concreta documentada.
- **[PRACT]**: fuente secundaria o divulgativa.
- **[INFERENCIA]**: síntesis mía. Hay que presentarla como recomendación, no como dato.

**Nota de método.** En esta sesión el buscador web estaba bloqueado: WebSearch devolvió un 403 del proxy. Todo se obtuvo con WebFetch sobre URLs conocidas y con los buscadores internos de los propios sitios (Motionographer, newsroom de Spotify). Por eso hay huecos explícitos en Stripe, Vercel, Figma Config, Google I/O, los product films de Apple, Blend Fest y Motion Hatch. No he rellenado esos huecos con memoria: no hay números ni citas sin URL.

---

## 1. El motion como sistema: UX in Motion y los sistemas de motion de marca

### Takeaway

Los sistemas serios de motion (IBM Carbon, Material 3, Atlassian, Microsoft Fluent) coinciden en cinco ideas:

1. Hay **dos registros**: uno productivo/funcional y otro expresivo/de marca.
2. **La duración crece con la distancia y el tamaño.**
3. **Las salidas duran menos que las entradas.**
4. **Hay un único foco que lidera** y el resto lo acompaña con stagger corto.
5. **Cuanto más frecuente es una animación, más corta y discreta debe ser.**

Un motion graphics de marca tech debería **heredar el "acento" del sistema de motion del producto** (sus curvas, sus duraciones relativas, su forma de entrar y salir). Así la pieza parece hecha por la misma mano que el producto. Se exagera solo en el registro expresivo.

### Hallazgos con cita

**UX in Motion (Issara Willenskomer).** [EXPERT]
- Los 12 principios son: Easing, Offset & Delay, Parenting, Transformation, Value Change, Masking, Overlay, Cloning, Obscuration, Parallax, Dimensionality y Dolly & Zoom.
- Se agrupan en cuatro pilares de usabilidad: **Expectation, Continuity (intra e inter-escena), Narrative y Relationship**.
- La tesis central es que el motion es un "acto" que ocurre en el tiempo, no un "estado". Sobre cuándo usar easing, la respuesta literal es "Always".
- Fuente: https://medium.com/ux-in-motion/creating-usability-with-motion-the-ux-in-motion-manifesto-a87a4584ddc

**IBM Carbon, productive vs expressive.** [DOC]
- Productive transmite "a sense of efficiency and responsiveness". Expressive es "enthusiastic, vibrant, and highly visible", y se reserva para momentos significativos (abrir una página nueva, una acción primaria).
- Tokens de duración: fast-01 **70 ms** (botones), fast-02 **110 ms** (fades), moderate-01 **150 ms**, moderate-02 **240 ms** (toasts, expansiones), slow-01 **400 ms** (expansiones grandes), slow-02 **700 ms** (oscurecer el fondo).
- Curvas cubic-bezier:

  | Curva | Productive | Expressive |
  |---|---|---|
  | Standard | (0.2, 0, 0.38, 0.9) | (0.4, 0.14, 0.3, 1) |
  | Entrance | (0, 0, 0.38, 0.9) | (0, 0, 0.3, 1) |
  | Exit | (0.2, 0, 1, 0.9) | (0.4, 0.14, 1, 1) |

- Equivalencia en After Effects (influencias): standard 20 %/62 % (productive) y 40 %/70 % (expressive).
- "the larger the change in distance (traveled) or size (scaling) of the element, the longer the animation takes". La escala de duraciones es no lineal.
- Microinteracciones: 90–120 ms.
- En transiciones grandes o a pantalla completa, incluir **elementos continuos que guíen**.
- Fuente: https://carbondesignsystem.com/elements/motion/overview/

**IBM Carbon, coreografía.** [DOC]
- Stagger de **20 ms** por elemento en tablas, que "significantly reduces the cognitive load". Hay que ajustar el retraso para que el total quede **dentro de 500 ms**.
- Orden de entrada: carcasa estática (navegación) → contenido estático (titulares, texto, imágenes) → contenido dinámico (datos) → **acción primaria** → contenido animado (dataviz). Se va de lo más estable a lo más importante.
- Elementos compartidos entre pantallas para dar continuidad.
- Consistencia semántica: la misma función lleva el mismo motion.
- **Inconsistencia intencional**: la entrada hacia delante significa afirmación y la entrada invertida significa cancelación.
- Las trayectorias siguen la retícula: "never run diagonally".
- Fuente: https://carbondesignsystem.com/elements/motion/choreography/

**Material 3, duraciones.** [DOC]
- Short1–4: 50/100/150/200 ms.
- Medium1–4: 250/300/350/400 ms.
- Long1–4: 450/500/550/600 ms.
- ExtraLong1–4: 700/800/900/1000 ms.
- Fuente: https://api.flutter.dev/flutter/material/Durations-class.html

**Material 3, curvas.** [DOC]
- standard: (0.2, 0, 0, 1)
- standardDecelerate: (0, 0, 0, 1)
- standardAccelerate: (0.3, 0, 1, 1)
- emphasizedDecelerate: (0.05, 0.7, 0.1, 1)
- emphasizedAccelerate: (0.3, 0, 0.8, 0.15)
- legacy (FastOutSlowIn): (0.4, 0, 0.2, 1)
- Fuente: https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/material/motion.dart

**Material, patrones de transición.** [DOC]
- **Container transform** (un contenedor crece o se convierte en otro): 300 ms de entrada y 250 ms de salida.
- **Shared axis** (relación espacial en X, Y o Z): 300 ms.
- **Fade through** (elementos sin relación fuerte): 300 ms.
- **Fade** (dentro de pantalla): **150 ms de entrada y 75 ms de salida**.
- La duración crece con el área o la distancia recorrida.
- Fuente: https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md

**Atlassian.** [DOC]
- Interacciones de 50–150 ms (hover a 50 ms). Transiciones de 150–400 ms (dropdown a 150 ms, modal a 250 ms).
- Curvas: ease-out bold (0, 0.4, 0, 1), ease-in-out bold (0.4, 0, 0, 1), ease-in practical (0.6, 0, 0.8, 0.6) y ease-out practical (0.4, 1, 0.6, 1).
- Reglas de coreografía: "Lead with one focal point", evitar animaciones que compiten, empezar de inmediato, **salidas más rápidas que entradas**, escalar la duración a la frecuencia (lo que se hace decenas de veces al día va **por debajo de 150 ms**) y al tamaño.
- Separa el motion contenido de los componentes del motion más expresivo de los "branded moments" (onboarding).
- Fuente: https://atlassian.design/foundations/motion

**Microsoft Fluent 2.** [DOC]
- Principios: functional, natural, consistent y appealing.
- Lineal solo para casos de velocidad constante (rotaciones).
- Stagger con offsets cortos, sin perder de vista la duración total. Se puede empezar con huecos grandes e ir acortándolos.
- El no-stagger se reserva para grupos muy grandes.
- Jerarquía: los elementos importantes llevan un movimiento más visible y duraciones más largas. Los secundarios se agrupan con timing sincronizado.
- No publica valores en ms en esa página.
- Fuente: https://fluent2.microsoft.design/motion

**Apple HIG, Motion.** [DOC]
- "Add motion purposefully, supporting the experience without overshadowing it." El motion gratuito puede distraer y causar incomodidad física.
- "Aim for brevity and precision in feedback animations."
- Evitar motion en interacciones frecuentes. Permitir cancelar el motion.
- No usar el motion como única vía de información: complementarlo con hápticos y **audio**.
- visionOS: evitar oscilaciones sostenidas cerca de **0,2 Hz** y motion en la periferia del campo visual. Usar fundidos para reubicar objetos cuando el trayecto no comunica nada.
- Fuente: https://developer.apple.com/design/human-interface-guidelines/motion.md

**NN/g.** [EXPERT]
- La mayoría de las animaciones de UI caben en 100–400 ms. El feedback simple ronda los 100 ms; los cambios grandes de pantalla, 200–300 ms.
- **400 ms** es "a very slow animation" y **500 ms** "start to feel like a real drag".
- Popups: ~300 ms para aparecer y 200–250 ms para desaparecer.
- "It is far more common for animations to be too long than too short." Pasar de 250 a 300 ms "can feel very different".
- Fuente: https://www.nngroup.com/articles/animation-duration/

### Inferencias

**Conversión a fotogramas a 30 fps** [INFERENCIA]:

| Duración | Fotogramas |
|---|---|
| 70 ms | ≈2 f |
| 110 ms | ≈3 f |
| 150 ms | ≈4–5 f |
| 240 ms | ≈7 f |
| 300 ms | 9 f |
| 400 ms | 12 f |
| 700 ms | 21 f |
| 1000 ms | 30 f |

**El stagger de 20 ms de Carbon es imposible en vídeo** [INFERENCIA]. A 30 fps la unidad mínima es 1 f (33 ms). En vídeo el stagger mínimo real es **1 f**, y el techo de 500 ms equivale a ~15 f. Si hay más de ~15 elementos, hay que agruparlos y escalonar los grupos.

**Los tokens de UI son el suelo, no el techo, en un vídeo** [INFERENCIA]. En UI el usuario espera a la animación; en un vídeo el espectador no ha pedido nada. Las duraciones de UI sirven para dos cosas:

1. **Recrear UI en un product film**: si una UI animada en vídeo dura el triple que en el producto real, el producto "parece lento".
2. **Fijar la proporción** entre micro, transición y momento hero. En el registro expresivo del vídeo, los momentos hero pueden durar 600–1200 ms, siempre que lo funcional siga siendo rápido.

**Firma de marca** [INFERENCIA]. Si el cliente tiene sistema de motion (Carbon, Material, Fluent…), conviene usar sus curvas literales en Remotion o After Effects. La "familiaridad" del movimiento es parte de la identidad.

**Asimetría entrada/salida** [INFERENCIA]. Material (150/75), NN/g (300/200–250) y Atlassian coinciden: la salida dura **entre el 50 % y el 80 % de la entrada**.

**Regla de trayectoria** [INFERENCIA]. "Never run diagonally" (Carbon) es una regla de motion productivo y explica por qué las piezas corporativas sobrias se mueven en ejes. Las diagonales y los arcos son recursos expresivos: si aparecen, deben tener intención.

### Reglas (efecto → recurso → por qué → cuándo romperla)

- **Que se sienta "producto serio, rápido".** Usar curvas productive (entrance 0, 0, 0.38, 0.9) y duraciones de 70–240 ms (2–7 f), con movimiento solo en ejes. Funciona porque es el lenguaje de motion de la propia UI, que el espectador reconoce como "real". Romperla en el momento hero o en la revelación del producto.
- **Que se sienta "momento importante".** Usar curvas expressive o emphasizedDecelerate (0.05, 0.7, 0.1, 1) y 400–700 ms (12–21 f). La llegada muy decelerada da peso y ceremonia. Romperla si se repite: lo expresivo repetido cansa.
- **Que se lea la jerarquía.** Un único elemento lidera; el resto entra con stagger de 1–3 f en un total de 15 f o menos. Así se siguen a la vez Atlassian ("one focal point") y Carbon (techo de 500 ms). Romperla en reveals rítmicos sincronizados con música.
- **Que las salidas no estorben.** La salida dura el 50–80 % de la entrada y usa una curva acelerada. Lo que se va no merece atención. Romperla en el cierre de la pieza: la última salida puede ser lenta, a modo de "respiración".

### Huecos

- Las páginas de Material 3 (m3.material.io) y Material 2 (speed: duraciones por dispositivo) requieren JavaScript y no se leyeron. Los valores de Material salen de Flutter y de Material Components Android.
- Shopify Polaris: la URL de tokens de motion redirige a una página sin tokens.
- Salesforce Lightning: error de cliente al cargar.
- Fluent no expone sus ms en la página principal.

---

## 2. Cómo piensan los estudios top

### Takeaway

Lo común es **idea antes que estilo**. "Beautiful isn't an idea" (Giant Ant). El estilo debe "tener propósito". El proceso pasa por look frames, storyboards y boardomatic **antes** de animar. La técnica se elige **plano a plano** según lo que pide el plano. Para unificar una pieza diversa hay que nombrar a alguien que vele por esa unidad. Los mejores estudios protegen la autonomía creativa y hacen proyectos propios para explorar técnicas que luego venden.

### Hallazgos con cita

**Giant Ant (Jay Grandin y Leah Nelson), "The ethos of Giant Ant".** [EXPERT]
- "Beautiful isn't an idea": lo pulido sin idea central deja al espectador sin sentir nada.
- Quieren un estilo que "has purpose". Guion, voz, ritmo, sonido y música pesan tanto como el estilo visual en la respuesta emocional.
- Fuente: https://motionographer.com/2017/01/02/the-ethos-of-giant-ant/

**Buck, Good Books "Metamorphosis".** [EXPERT/CASO]
- Proceso: "initial look frames for the pitch" (ACD Joshua Harvey y AD Joe Mullen), y después "storyboards and a boardomatic, where we figured most things out".
- Técnica según el plano: "Some needed 3D, some pencil tests and some only needed a few keyframes". El único morph en 3D fue el de libro a flores; el resto se hizo con pencil test y Flash, Photoshop o After Effects.
- Los planos hero (cabra, escarabajos) se reanimaron "so many times we stopped counting".
- Fuente: https://motionographer.com/2012/03/26/interview-buck-good-books-metamorphosis/

**Ordinary Folk (Jorge R. Canedo Estrada), "Join the Movement" para School of Motion.** [EXPERT/CASO]
- Querían "a visual progression in terms of complexity" sin que pareciera "a montage where every shot was totally disconnected".
- El diseñador Jay Quercia tuvo el papel de "constantly trying to unify the piece as a whole".
- Su pregunta favorita en un proyecto es "how on earth are we going to animate all of these?!".
- Fuente: https://motionographer.com/2019/09/16/join-the-movement/

**Gunner, "Mesh".** [EXPERT/CASO]
- Corto propio que nace de mezclar escaneos 3D hechos con iPhone (Autodesk 123D Catch) con personajes en cel. Querían "blend cel and 3D in a way we never had before" y "forcing our interests to live in the same world".
- Flujo cruzado: el cel se animaba sobre los rough 3D y el 3D luego referenciaba el cel.
- Problema: el perro se veía plano en los dollies con parallax.
- Fuente: https://motionographer.com/2016/12/12/gunner-their-new-film-mesh-and-the-importance-of-changing-things-up/

**Oddfellows, Works With Nest.** [CASO]
- Una versión previa en imagen real era "technically sound" pero no mostraba los dispositivos **interactuando**. La animación se usó justo para eso.
- Pasaron mucho tiempo probando cómo convivían cel, motion design e imagen real de producto hasta encontrar "a harmonious place for them to co-exist".
- Fuente: https://motionographer.com/2015/10/13/oddfellows-works-with-nest/

**Animade.** [EXPERT]
- Lema: "finding the personality in every project". "Creating character has always been at the heart of what Animade has done."
- Desde agosto de 2026 el equipo se integra en el Design Studio de Duolingo y la marca Animade se retira.
- Fuente: https://archive.animade.tv/scoops/over-and-owlt

### Inferencias

**El pipeline de estudio aplicado a Claude** [INFERENCIA]:

1. Idea en una frase, de qué va y qué se siente.
2. 3–5 look frames o styleframes que fijen paleta, tipo y forma.
3. Storyboard.
4. Boardomatic o animatic **con audio provisional** (aquí se resuelven tiempos y transiciones).
5. Animación del plano hero primero.
6. Resto de planos.
7. Sonido final.

En Remotion, el boardomatic equivale a componer la secuencia con frames estáticos y cortes secos, sincronizados con la música, **antes** de animar nada.

**"Director de unidad"** [INFERENCIA]. Cuando una pieza mezcla muchas técnicas (Ordinary Folk, Oddfellows, Gunner), alguien tiene que velar por la coherencia: paleta, grosor de línea, curva firma, grano. Claude debería escribir esa "biblia" de 5–8 constantes antes de animar.

**Técnica al servicio del plano** [INFERENCIA]. Buck no impone 3D a toda la pieza. Para Claude, la regla es usar la técnica más barata que resuelva el plano y reservar la complejidad (3D, morph, frame a frame) para 1–2 momentos hero.

### Reglas

- **Que la pieza "diga algo".** Escribir la idea en una frase antes del primer keyframe; si la idea no se sostiene en un storyboard estático, la animación no la salvará. "Beautiful isn't an idea" (Giant Ant). Romperla en loops abstractos o idents de pura textura, cuya idea es el propio motion.
- **Unidad en piezas variadas.** Definir una biblia de constantes (2–3 colores, una curva firma, un grosor de trazo, un tipo de grano) y que una persona (o un paso de revisión) la haga cumplir. Eso evita el "montaje de planos desconectados" (Canedo). Romperla si el concepto es precisamente la ruptura, como un cambio de mundo.
- **Pulir donde mira el ojo.** Reanimar el plano hero tantas veces como haga falta; el resto puede resolverse con pocos keyframes. Es la economía de Buck. Romperla nunca en logo y CTA, que siempre son hero.

### Huecos

- No conseguí entrevistas citables de ManvsMachine (más allá de las ya recogidas), Golden Wolf, Tendril, Builders Club, Hornet ni Elastic. Sus fichas en Motionographer son "quickies" sin texto de proceso.
- Tampoco recuperé charlas de Blend Fest, episodios de Motion Hatch ni la frase "the idea is the transition" con fuente primaria. No la atribuyo a nadie.
- No hay datos públicos de cuántos styleframes o semanas de animatic usan los estudios.

---

## 3. Casos de marcas tech y producto

### Takeaway

En producto tech, el motion hace tres trabajos:

1. **Mostrar lo que el vídeo real no puede**: interacciones entre dispositivos, conceptos abstractos como la seguridad de pagos o el "estar conectado".
2. **Volver accesible lo técnico** con personajes o ingenio visual.
3. **Ser coherente con la UI real**: mismo motion, misma calma.

Las marcas con más gusto (Linear) definen la calidad como **sustracción**: quitar lo que compite por la atención.

### Hallazgos con cita

**Airbnb, Lottie.** [CASO/DOC]
- El problema era el traspaso de diseñador a ingeniero. Los ingenieros recreaban a mano lo animado en After Effects: estimaban tiempos, rehacían Béziers y reconstruían desde GIFs.
- Lottie renderiza en tiempo real el JSON exportado con Bodymovin: "Now engineers can use exactly what the designer intended, exactly how it was made."
- Fuente: https://airbnb.design/introducing-lottie/

**ManvsMachine, Google Circle to Search.** [CASO]
- Film "cinematic, informative" construido sobre "simplicity, power, and versatility".
- Mezcla **tipografía cinética con imagen real** para enganchar pronto. Muestra los gestos de entrada (dibujar un círculo, resaltar, tocar) y casos de uso de varios perfiles.
- El tono "playful, visually witty" busca que una herramienta nueva parezca accesible y no técnica.
- Fuente: https://motionographer.com/quickie/manvsmachine-google-circle-to-search/

**Linear, refresh de diseño (2026).** [CASO]
- Principio: "Don't compete for attention you haven't earned". La navegación se atenúa para que mande el área de trabajo.
- Redujeron iconos y bordes porque habían "quietly proliferated... sometimes appearing without clear reason". Gris más cálido, "crisp, but less saturated".
- Criterio de éxito: "If most people don't immediately notice what changed, that's probably a good sign."
- Fuente: https://linear.app/now/behind-the-latest-design-refresh

**Spotify Wrapped 2021.** [CASO]
- El sistema gira en torno a un **lazo o cinta**: "a dynamic thread that ties together all the work" y "an additional layer of storytelling".
- Hay símbolos estándar (corazón, fuego) y los mercados locales pueden crear los suyos; algunos "only be fully understood by a true fan".
- "Motion is always a key part of our design."
- Cada año buscan "a completely new and fresh articulation of our brand". El diseño debe casar con "the sentiment" del año.
- Fuente: https://newsroom.spotify.com/2021-12-01/global-head-of-brand-design-rasmus-wangelin-explains-the-creative-behind-spotify-2021-wrapped/

**Animade, YouTube Shopping (Cafe24).** [CASO]
- 35 ilustraciones, algunas animadas, con el brief de ser "easily understandable but with a playful edge".
- Mucho tiempo de concepto para que lo abstracto (la seguridad de pago) se lea al instante.
- Usan elementos reconocibles de la UI de YouTube y un sistema reducido de personajes con reglas: ojos grandes, sin nariz, "all legs". La simplicidad es "key".
- Fuente: https://archive.animade.tv/work/youtube-shopping

**Animade, Dropbox Presents.** [CASO]
- Cada fotograma de una secuencia se pinta a mano y se presenta como una lámina de vidrio, que representa un archivo de Dropbox. Se secuencia como animación pero se muestra como conjunto.
- La exploración pasó "from tactile collage to hazy glass". Un primer test metía todos los frames en un cubo; luego los separaron para dar protagonismo a cada lámina.
- Fuente: https://archive.animade.tv/work/dropbox-presents

**Mailchimp (Collins).** [CASO] Rebrand "idiosyncratic" con "wry humor, modest celebration, and a dash of absurdity" e ilustración "outsider art". La página no describe el motion.
- Fuente: https://www.wearecollins.com/work/mailchimp

### Inferencias

**Dos escuelas en tech** [INFERENCIA]:

- **Calma y sustracción** (Linear, Apple en UI): pocos elementos, curvas productivas, gris cálido y un acento. Sirve para herramientas de trabajo y audiencias técnicas.
- **Personalidad e irreverencia** (Mailchimp, Duolingo vía Animade, Wrapped): personajes, color saturado y ritmo lúdico. Sirve para consumo, aprendizaje y celebración.

Elegir escuela es la primera decisión de dirección y debe salir del producto, no del gusto del animador.

**Dispositivo visual único** [INFERENCIA]. Wrapped (la cinta) y Dropbox Presents (las láminas de vidrio) muestran que una campaña grande se unifica con **un dispositivo visual único** que transporta contenido variable. Para Claude: inventar un "objeto portador" (cinta, lámina, marco, línea) que recorra toda la pieza y sobre el que entran datos y textos distintos.

**Animar lo invisible** [INFERENCIA]. Oddfellows/Nest y Animade/YouTube coinciden en que el motion se justifica donde la imagen real o la captura fallan: relaciones entre objetos, flujos y conceptos abstractos. Si una captura de pantalla explica algo igual de bien, no hace falta animarlo.

### Huecos

- Sin fuente verificada en esta ronda: Stripe Sessions, Vercel / Next.js Conf, Figma Config, Notion, Google I/O, los product films de Apple (salvo el ya analizado *Don't Blink*) y los posts de motion de Duolingo/Rive. No describo sus recursos para no inventar.
- La ficha de ManvsMachine para el iMac Pro en Motionographer no tiene texto.

---

## 4. Tipografía cinética y transiciones: continuidad entre escenas

### Takeaway

La mejor transición **transforma** algo que ya estaba en pantalla en lo siguiente. Son los principios de *Transformation*, *Cloning*, *Masking* y *Continuity* de UX in Motion, y el *container transform* y el *shared axis* de Material. El fundido "neutro" es el recurso para escenas **sin relación**, no la opción por defecto. La dirección del movimiento tiene semántica: hacia delante es avanzar o afirmar; invertido es volver o cancelar (Carbon).

### Hallazgos con cita

Fuentes ya citadas en los bloques 1 y 2, aquí leídas en clave de transición:

- **UX in Motion** [EXPERT]: *Transformation* (un objeto cambia de forma entre estados), *Cloning* (lo nuevo nace de lo existente), *Masking* (revelar u ocultar manteniendo el contenido), *Parenting* (vincular propiedades) y *Continuity* intra e inter-escena.
- **Material** [DOC]: container transform para "convertirse en"; shared axis cuando hay relación espacial (X para un flujo, Y para un stepper, Z para padre-hijo); fade through solo si **no** hay relación.
- **Carbon** [DOC]: elementos compartidos y continuos que guían en transiciones grandes; entrada hacia delante = afirmación, invertida = cancelación.
- **Apple HIG** [DOC]: si el trayecto no comunica nada, fundir y reaparecer, porque el ojo sigue todo movimiento.
- **Buck, Metamorphosis** [CASO]: pieza entera apoyada en morphs planificados en boardomatic.

### Inferencias

**Escalera de transiciones de más a menos "estudio"** [INFERENCIA]:

1. **Transformación o morph**: la forma A se convierte en la forma B. Las dos deben compartir silueta, color o posición.
2. **Hand-off**: el elemento sale de una escena y entra en la siguiente con la misma velocidad y dirección.
3. **Match cut de forma**: corte seco entre dos formas similares en la misma posición de pantalla.
4. **Máscara o wipe motivado**: un elemento de la escena hace de cortinilla. Un texto que barre, un círculo que crece desde el punto de interés.
5. **Shared axis**: toda la escena se desplaza en un eje coherente con la narrativa (izquierda→derecha = avanzar).
6. **Fade through**: solo entre bloques sin relación.
7. **Corte seco a negro o blanco**: puntuación, un capítulo nuevo.

**Guiar la mirada entre escenas** [INFERENCIA]. El punto de atención del último frame de la escena A debe coincidir, dentro de ~10–15 % del ancho de pantalla, con el punto de atención del primer frame de B. Si se rompe esa coincidencia, que sea a propósito y acompañada de sonido (un whoosh que "lleva" el ojo).

**Vector de movimiento** [INFERENCIA]. Elegir una dirección dominante para la pieza (por ejemplo, el avance hacia la derecha) y reservar la dirección contraria para el "giro", el problema o el "antes". Es la "inconsistencia intencional" de Carbon aplicada a la narrativa.

**Tipografía cinética con jerarquía** [INFERENCIA]. Aplicar el orden de Carbon: primero el contexto (label pequeño), luego el titular y por último la cifra o el CTA, que es lo importante, con la curva más expresiva. La palabra clave recibe la duración más larga (Fluent: "important elements… longer durations"); el resto entra sincronizado como grupo.

**Reglas sobre el morph** [INFERENCIA]:
- Un morph necesita que los dos estados compartan al menos dos de estos tres: silueta, color, posición. Si no, se lee como un efecto.
- Su duración debe ser larga dentro de la escala: 12–24 f a 30 fps, el rango expressive o ExtraLong. El ojo tiene que poder seguir la metamorfosis.

### Reglas

- **Continuidad "sin costura".** Antes de cortar, preguntarse qué hereda la escena siguiente; heredar forma, color, posición o velocidad. El ojo sigue un único objeto y no tiene que reorientarse (Continuity, Cloning). Romperla al cambiar de acto: el corte duro marca capítulo.
- **Que "adelante" se sienta adelante.** Fijar un eje narrativo: lo positivo avanza en una dirección y el retroceso o problema invierte la dirección (Carbon: el sentido del movimiento carga significado). Romperla si la composición de pantalla lo impide; entonces usar el eje Z, escala.
- **Reveal elegante.** Usar una máscara cuyo borde sea un elemento de diseño (una línea de la retícula, la forma del logo), no un wipe genérico de plugin. Se percibe como parte del sistema y no como un preset. Romperla en lenguaje "lo-fi o collage" deliberado.
- **Reubicar sin distraer.** Si mover el elemento no aporta significado: fade out, cambio de posición, fade in (Apple: el ojo sigue todo movimiento, así que no conviene gastarlo). Romperla cuando el trayecto sí es la historia, como un dato que viaja de A a B.

### Huecos

- No obtuve breakdowns publicados (Behance o Vimeo con notas) de transiciones concretas de Apple, Stripe o Vercel.
- La atribución de "the idea is the transition" sigue sin fuente.

---

## 5. Sonido para motion graphics

### Takeaway

El sonido se decide **en concepto**, no al final: "Audio won't save mediocre direction" (Antfood). Música, diseño sonoro y mezcla se piensan como un todo al servicio de la idea. La sincronía conviene a los eventos que **significan** algo (llegada del logo, cifra, acción de UI). No conviene a cada micro-movimiento, por lo mismo que un sistema de UI no anima las interacciones frecuentes.

### Hallazgos con cita

- **Antfood (Motionographer, "The other half")** [EXPERT]:
  - "it's best to be involved from concept and pre-production"
  - "Audio won't save mediocre direction"
  - "we focus holistically on what sound can do for the idea or message": no separan música, diseño sonoro y post de audio.
  - Exploran mucho: "we may present 30, 50 or 100 ideas and settle on the 99th or go back to the very first one".
  - Fuente: https://motionographer.com/2018/09/05/the-other-half-with-antfood/
- **Apple HIG** [DOC]: el motion no debe ser la única vía de información; se complementa con hápticos y audio. El feedback debe ser "brief and precise", "precisely tied to a successful action".
  - Fuente: https://developer.apple.com/design/human-interface-guidelines/motion.md
- **Créditos** [CASO]: los estudios top trabajan con casas de sonido dedicadas (Actual Magic en Circle to Search, Sono Sanctus en Nest; ver bloque 3).

### Inferencias

**Jerarquía de sincronía** [INFERENCIA]:

- **Nivel 1, sincronía exacta (al frame)**: llegada del logo o sonic logo, revelación de la cifra o del producto, clic o tap de UI que causa un cambio de estado, impacto de un corte de capítulo.
- **Nivel 2, sincronía por frase musical**: cambios de escena en downbeats (a 120 BPM, un beat cada 15 f a 30 fps) y entradas de bloques de texto en el pulso.
- **Nivel 3, sin sincronía puntual**: stagger de listas, parallax, loops de fondo y micro-hovers. Se cubren con una cama, un "swell" o un riser continuo.

Sincronizarlo todo produce "Mickey Mousing", el efecto de dibujo animado infantil. Es adecuado para piezas lúdicas tipo Duolingo y se ve barato en marcas sobrias.

**UI sounds en product films** [INFERENCIA]:
- Sonidos cortos (por debajo de ~150 ms), suaves, de transitorio limpio y del mismo "material" (todos de cristal, de madera o sintéticos).
- Se colocan **0–2 f antes** del cambio visual. Es práctica habitual de edición (el audio tardío se nota antes que el adelantado), pero no tengo fuente en esta ronda.

**Whooshes** [INFERENCIA]:
- Solo en transiciones con desplazamiento grande y con la duración del movimiento, no más largos.
- No más de uno por cada ~3–4 s en una pieza premium. El whoosh en cada corte es firma de plantilla.

**Sonic logo** [INFERENCIA]:
- Es la "rima" del cierre: la llegada del logo y el último golpe de audio caen en el mismo frame.
- Le sigue un silencio o un decay de 0,5–1 s antes del final, para que el logo "respire".

**Silencio** [INFERENCIA]. Un drop de música de 6–12 f justo antes de la revelación principal multiplica su impacto. Es el equivalente sonoro del "ma" ya descrito en notas previas.

### Reglas

- **Que el sonido parezca diseñado y no pegado.** Decidir paleta sonora y BPM en el animatic y montar sobre el audio, no al revés. Antfood: hay que entrar en preproducción porque el audio no rescata la dirección. Romperla en piezas de UI puramente funcionales, que se sonorizan al final.
- **Que un evento "pese".** Sincronía al frame más 6–12 f de silencio previo: el contraste de energía marca la importancia. Romperla si hay más de 2–3 eventos de ese tipo, porque se pierde la jerarquía.
- **Que la UI suene premium.** Pocos sonidos, cortos, de un solo material, solo en cambios de estado (Apple: "brief and precise", evitar feedback en lo frecuente). Romperla en piezas lúdicas o infantiles con personaje.

### Huecos

- No obtuve directrices oficiales de sonic branding (Mastercard, Netflix, Intel) ni tiempos medidos de anticipación audio-vídeo con fuente. La guía de "playing audio" de Apple no se leyó.

---

## 6. Short-form premium frente a edición "retention" hiperestimulada

### Takeaway

Las dos funcionan, pero para contratos distintos con el espectador:

- **Retention** (MrBeast, estilo Hormozi: zooms cada pocos segundos, subtítulos palabra a palabra, SFX en cada corte, b-roll constante) optimiza la **retención de un contenido largo o informativo** en un feed donde se compite por cada segundo.
- **Premium** (Apple, Nike, estudios) optimiza el **recuerdo de marca y el deseo**. Su arma es el **contraste** (pausa contra golpe), no la estimulación constante.

El error es mezclar contratos, por ejemplo una marca de lujo editada como un clip de podcast.

### Hallazgos con cita

**Documento de producción de MrBeast (filtrado en 2024), según extractos de Simon Willison.** [CASO, con salvedades]
- El proceso empieza por **título y miniatura**, que fijan la promesa. Ejemplo: "I Spent 50 Hours In Ketchup" frente a "…In My Front Yard".
- El primer minuto debe **cumplir la promesa de la miniatura**. Perder 21 de 60 millones de clics en el primer minuto se considera "a reasonably good result".
- Estructura por tramos (minutos 1–3, 3–6 y 6–final) con responsabilidades distintas. Los extractos no detallan cuáles.
- Busca un "wow factor": en "100 days in the circle" se trae una casa con grúa **a los 30 segundos** en lugar de introducirla despacio.
- El dinero gastado debe verse en cámara.
- **Contexto**: es un documento interno para una operación enorme de YouTube de formato largo, optimizada para la métrica de duración media de visionado. Willison advierte de que muchas lecciones no se transfieren.
- Fuente: https://simonwillison.net/2024/Sep/15/how-to-succeed-in-mrbeast-production/

**Contrapeso de los sistemas de motion** [DOC/CASO]: Atlassian ("Avoid competing animations"), Apple (el motion gratuito "can distract") y NN/g (lo repetido, más sutil), todos citados en el bloque 1, y Linear ("Don't compete for attention you haven't earned", bloque 3).

### Inferencias

**Lo que sí es transferible del doc de MrBeast a un reel premium** [INFERENCIA]:
- (a) La promesa se fija antes de producir: el hook y el primer frame se diseñan primero.
- (b) Hay que cumplirla pronto.
- (c) Hace falta un "momento wow" visual temprano. En un reel de marca, la revelación del producto o la transformación hero ocurre en los primeros 2–3 s, no al final.

**Lo que no es transferible** [INFERENCIA]: la densidad constante de estímulos. En una pieza de marca, la estimulación uniforme borra la jerarquía: si todo hace zoom, nada importa.

**Diferencias medibles entre premium y retention barato** [INFERENCIA]. Son observaciones de oficio, no datos publicados:

| Rasgo | Premium | Retention barato |
|---|---|---|
| Elementos en movimiento simultáneo | 1–2 | 3+ |
| Pausas | Holds deliberados de 0,5–1,5 s sobre el plano clave | Ninguna |
| Zooms | Solo con motivo, una vez por idea | Punch-in cada pocos segundos |
| Subtítulos | Integrados en la retícula, tipografía de marca, por frase | Palabra a palabra, con colores y emojis |
| SFX | Solo en eventos de nivel 1 | En cada corte |
| Paleta | Restringida y graduada | Sin control |
| Curvas | Una curva firma | Easing por defecto o rebote en todo |
| Cierre | Logo con respiración y silencio | Corte abrupto o loop |

**Dónde funciona cada una** [INFERENCIA]:
- **Retention**: talking heads educativos, podcasts recortados, contenido informativo de creador y ofertas directas de respuesta.
- **Premium**: lanzamientos de producto, brand films, piezas para marcas que venden estatus, calidad o calma, y anuncios que se verán muchas veces (porque la sobreestimulación cansa al repetirse, como dice NN/g de la UI).
- **Híbrido válido**: hook con energía de retention (primeros 1–2 s, corte rápido) y desarrollo con gramática premium.

### Reglas

- **Enganchar sin abaratar.** Poner el momento visual más fuerte (transformación, producto, cifra) en los primeros 2–3 s con una sola acción clara. Es la lógica de "cumplir la promesa pronto" del doc de MrBeast, sin la densidad. Romperla en brand films de cine o TV, donde el público no hace scroll.
- **Ritmo premium.** Alternar densidad y respiración: cada ráfaga de 3–5 eventos va seguida de un hold de 15–45 f. El contraste crea jerarquía y la estimulación uniforme la destruye (Atlassian: evitar animaciones que compiten). Romperla en piezas de "hype" de 6–10 s puramente rítmicas.
- **Subtítulos con criterio.** En una pieza de marca, subtítulo por frase con la tipografía y la retícula de la marca. El palabra a palabra con emojis queda para contenido de creador: el subtítulo forma parte del sistema visual. Romperla cuando el cliente es un creador y el formato es su firma.

### Huecos

- No obtuve fuentes publicadas que analicen el estilo Hormozi ni estudios de retención que comparen ambos estilos. No he podido leer el PDF completo de MrBeast, solo extractos.

---

## 7. Errores típicos que delatan a un aficionado

### Takeaway

Casi todos los errores de aficionado son **violaciones de sistema**, no de técnica: demasiadas cosas moviéndose, duraciones sin relación con tamaño o importancia, curvas por defecto, transiciones sin herencia, sonido pegado al final y estilo sin idea.

### Hallazgos con cita

Las fuentes ya citadas en los bloques 1–6 nombran o implican estos errores: belleza sin idea (Giant Ant), montaje desconectado (Canedo), animaciones demasiado largas (NN/g), animaciones que compiten (Atlassian), motion gratuito (Apple HIG), lineal donde no toca (Fluent), diagonales sin motivo en registro productivo (Carbon), sonido como parche (Antfood) y proliferación de elementos sin motivo (Linear). Las URLs están en cada bloque.

### Inferencias: lista de comprobación de aficionado [INFERENCIA]

1. Todo entra a la vez, o todo con el mismo stagger y la misma curva.
2. Misma duración para un icono y para un panel a pantalla completa.
3. Entradas y salidas simétricas, con la salida tan lenta como la entrada.
4. Rebote u overshoot en todo, incluido el texto de cuerpo.
5. Fundido cruzado como transición por defecto entre escenas relacionadas.
6. Presets de plugin reconocibles (glitch, light leaks, wipes de pack) sin relación con la marca.
7. Texto que no se queda quieto el tiempo suficiente para leerse (ver las notas previas de lectura).
8. Cámara que se mueve sin motivo: drift constante, "wiggle" en todo.
9. Whoosh en cada corte, música sin relación con los cortes y logo final sin respiración.
10. Más de 3 colores de acento y más de 2 familias tipográficas.
11. UI recreada con tiempos irreales: el producto parece lento o falso.
12. Ningún plano hero: el pulido está repartido por igual, así que nada destaca.
13. Diseñado en 16:9 y recortado a 9:16 sin recomponer.

---

## 8. Mini-casos desmontados

Las fuentes de cada caso están en los bloques 2–6. Formato: pieza · qué se buscaba hacer sentir · recurso · regla.

1. **Buck, Good Books "Metamorphosis"** · fascinación "dark but arty" · cadena de morphs con técnica decidida plano a plano y planos hero reanimados sin límite · **la transformación es la narrativa; técnica mínima por plano y pulido concentrado en los hero.**
2. **Ordinary Folk, "Join the Movement"** · amplitud del motion design · progresión de complejidad y un diseñador dedicado a unificar · **la variedad necesita curva de progresión y guardián de la unidad, o se convierte en reel.**
3. **Oddfellows, Works With Nest** · que los dispositivos "colaboran" · cel y personajes sobre imagen real de producto · **anima lo que la cámara no puede mostrar; deja real el producto real.**
4. **ManvsMachine, Circle to Search** · herramienta nueva intuitiva y para todos · tipografía cinética con imagen real, el gesto y casos de uso diversos · **en lanzamientos de función, enseña el gesto y no la tecnología.**
5. **Spotify Wrapped 2021** · campaña variada que se lee como una sola · la cinta como objeto portador de datos y símbolos locales · **la unidad está en el portador, no en el contenido.**
6. **Animade, Dropbox Presents** · el proceso creativo como algo precioso · fotogramas pintados como láminas de vidrio, expuestos como conjunto · **la metáfora del producto cabe en una frase y dicta la técnica.**
7. **Animade, YouTube Shopping** · lo complejo (pagos seguros) se entiende al instante · personajes mínimos con reglas y UI real de YouTube como ancla · **simplifica el personaje para que el concepto mande.**
8. **Airbnb, Lottie** · que el motion llegue intacto al producto · After Effects a JSON renderizado en vivo · **diseña el motion de marca pensando en el formato de entrega.**
9. **Linear, refresh 2026** · calma y foco · atenuar lo secundario y reducir iconos, bordes y saturación · **en marcas de herramienta, la calidad se mide por lo que quitas; aplícalo también al vídeo.**
10. **Doc de producción de MrBeast** · retención máxima en YouTube largo · promesa en miniatura, cumplida en el primer minuto, con "wow" temprano (la grúa a los 30 s) · **diseña el hook primero y adelanta el momento fuerte; importa la lógica, no la densidad.**

---

## 9. Chuleta: 36 reglas accionables

Los valores en fotogramas son a 30 fps. Las reglas con fuente llevan su etiqueta; las demás son [INFERENCIA].

**Sistema y timing**

1. Antes de animar, fija el registro de la pieza: **productive** (rápido, en ejes, 70–240 ms ≈ 2–7 f) o **expressive** (400–700 ms ≈ 12–21 f) [DOC Carbon]. Mezcla ambos solo para marcar momentos hero.
2. La duración crece con la distancia y el tamaño. Un icono va a 4–6 f, una tarjeta a 8–10 f y una transición a pantalla completa a 12–18 f [DOC Carbon/Material; conversión INFERENCIA].
3. La salida dura el 50–80 % de la entrada y usa una curva acelerada (Material: fade 150/75 ms) [DOC].
4. Curvas por defecto recomendadas:
   - Entrada: emphasizedDecelerate (0.05, 0.7, 0.1, 1) o Carbon expressive entrance (0, 0, 0.3, 1).
   - Salida: (0.3, 0, 0.8, 0.15).
   - Movimiento en pantalla: standard (0.2, 0, 0, 1).
   [DOC]
5. Si el cliente tiene sistema de motion propio, usa sus curvas y tokens literales: la familiaridad es parte de la identidad.
6. En una UI recreada en vídeo, respeta los tiempos reales del producto (100–400 ms), porque la UI lenta en vídeo hace que el producto parezca lento [EXPERT NN/g].
7. Lo que se repite en la pieza (un tick, un contador, un hover) debe ser corto y discreto: por debajo de 150 ms, ≈4 f [DOC Atlassian].
8. Lineal solo para velocidad constante: rotaciones, scroll infinito, tickers [DOC Fluent].
9. En registro sobrio las trayectorias van en ejes; las diagonales y los arcos se reservan para momentos expresivos [DOC Carbon].

**Coreografía**

10. Un solo foco lidera; el resto acompaña [DOC Atlassian].
11. Stagger de 1–3 f por elemento con un total de 15 f o menos. Con más de ~15 elementos, agrupa y escalona grupos [DOC Carbon 20 ms / 500 ms adaptado].
12. Orden de entrada: contexto → contenido → dato → acción o CTA. Lo más importante entra último y con la curva más expresiva [DOC Carbon].
13. Los elementos importantes llevan más duración y más movimiento; los secundarios entran sincronizados como grupo [DOC Fluent].
14. No más de 2 elementos con movimiento propio a la vez fuera de los momentos hero.

**Transiciones y mirada**

15. Antes de cada corte, decide qué hereda la escena siguiente: forma, color, posición o velocidad [EXPERT UX in Motion: Continuity, Cloning, Transformation].
16. Elige la transición según la relación: transformación si es "lo mismo cambiado", eje compartido si es "lo siguiente" y fade through o corte si no hay relación [DOC Material].
17. Un morph solo funciona si A y B comparten dos de tres: silueta, color o posición. Dale 12–24 f.
18. Haz coincidir el punto de atención del último frame de A con el del primer frame de B (±10–15 % del ancho).
19. Fija un eje narrativo: avanzar = una dirección y retroceder, problema o "antes" = la contraria [DOC Carbon: entrada invertida = cancelación].
20. Si mover un objeto no comunica nada, fúndelo y reaparécelo en su sitio [DOC Apple HIG].
21. Las máscaras de reveal usan formas del propio sistema (retícula, logo), nunca wipes de preset.

**Concepto y proceso**

22. Idea en una frase antes del primer keyframe. "Beautiful isn't an idea" [EXPERT Giant Ant].
23. Proceso: look frames → storyboard → boardomatic con audio provisional → plano hero → resto [EXPERT Buck].
24. Escribe una biblia de 5–8 constantes (paleta, curva firma, trazo, grano, tipo) y revisa cada plano contra ella [EXPERT Ordinary Folk: alguien que unifica].
25. En cada plano, la técnica mínima que lo resuelve; la complejidad va a 1–2 momentos hero [EXPERT Buck].
26. Anima lo que la cámara o la captura no pueden enseñar (relaciones, procesos, invisibles) [CASO Nest, YouTube Shopping].
27. En campañas variadas, un objeto portador único (cinta, lámina, marco) que transporta el contenido [CASO Wrapped, Dropbox Presents].
28. Marca de herramienta = sustracción: menos elementos, saturación contenida y un acento [CASO Linear].

**Sonido**

29. El sonido se decide en el animatic, no al final. "Audio won't save mediocre direction" [EXPERT Antfood].
30. Sincronía al frame solo para eventos de nivel 1 (logo, revelación, cambio de estado); la cama musical cubre stagger y loops.
31. Cambios de escena en downbeats: a 120 BPM, un beat cada 15 f.
32. UI sounds cortos, de un solo material, colocados 0–2 f antes del cambio visual.
33. Entre 6 y 12 f de silencio antes de la revelación principal. El logo final necesita 0,5–1 s de decay o silencio.

**Short-form**

34. Hook: el momento visual más fuerte va en los primeros 2–3 s, con una sola acción clara [CASO MrBeast: cumplir la promesa pronto, "wow" temprano].
35. Alterna ráfagas de 3–5 eventos con holds de 15–45 f. La estimulación uniforme destruye la jerarquía [DOC Atlassian].
36. La estética "retention" (punch-ins constantes, subtítulo palabra a palabra con emojis, SFX en cada corte) es para contenido de creador e informativo, no para lanzamientos de marca. Si se usa en un híbrido, que sea solo en el hook.
