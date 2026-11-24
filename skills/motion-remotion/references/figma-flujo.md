# Figma + Claude para UI y motion graphics: MCP, Figma Motion y flujos hacia Remotion, After Effects, Lottie y Rive

Notas de la ronda 3. Fecha de la investigación: 24-11-2026.

Etiquetas usadas:
- **[DOC]**: documentación oficial (help.figma.com, developers.figma.com, figma.com, remotion.dev, rive.app, lottiefiles.com, aescripts/battleaxe, GitHub), o las *skills* oficiales que sirve el propio servidor MCP de Figma (`skill://figma/...`), leídas en directo.
- **[EXPERT]**: conocimiento de la industria que no he podido comprobar con una URL en esta ronda.
- **[PRACT]**: práctica habitual de estudio o de producción.
- **[INFERENCIA]**: deducción mía a partir de lo anterior.

Sobre el método: el buscador web estaba desactivado para la organización (devolvía 403). Por eso todo se comprobó con WebFetch sobre URLs concretas y leyendo las *skills* del propio servidor MCP de Figma, que es la fuente más fiable para saber qué hacen sus herramientas. Algunas webs bloquearon la descarga (figma.com/config, figma.com/weave, aeux.io, aescripts.com, schoolofmotion.com y el repositorio de skills de la comunidad de Figma en GitHub). Lo que dependía de ellas va a Huecos.

---

## 0. Lo más importante para Erik (leer primero)

1. **Figma tiene animación nativa.** Se llama **Figma Motion**: una línea de tiempo con *keyframes*, presets, *easing* (curvas y muelles), animación de texto, *path trim*, audio y exportación de vídeo. Se anunció en Config 2026 y está **en beta abierta, con despliegue gradual desde el 24-06-2026** [DOC: https://help.figma.com/hc/en-us/articles/4406787442711-What-Figma-features-are-in-beta].
2. **`get_motion_context` y `export_video` son las herramientas MCP de Figma Motion.** La primera lee los *keyframes* de un frame animado y devuelve CSS `@keyframes` y código motion.dev. La segunda renderiza en el servidor de Figma el MP4 de la línea de tiempo de un frame de primer nivel. Claude también puede **crear** animación en Figma con `use_figma` (API `manualKeyframeTracks`, `animationStyles`, `TextStagger`) [DOC: skills `figma-use-motion` y `figma-implement-motion`].
3. **Bloqueo actual:** la cuenta de Figma conectada a Claude figura como **plan Starter con asiento View** (lo dice `whoami`). Con eso el MCP permite **20 llamadas de lectura al mes**, y escribir en el lienzo exige plan Professional o superior [DOC: https://help.figma.com/hc/en-us/articles/39252411778583 y https://help.figma.com/hc/en-us/articles/42495251338775]. Para usar este flujo en serio, Erik necesita **plan Professional con asiento Full**.
4. **Remotion no puede usar tal cual el código que devuelve Figma.** Remotion exige que todo se anime a partir de `useCurrentFrame()`. Las animaciones CSS no se admiten y Framer Motion/motion.dev no tiene integración [DOC: https://www.remotion.dev/docs/third-party]. Por tanto, Claude debe **traducir** los *keyframes* de `get_motion_context` a `interpolate()` con `Easing.bezier()` y `spring()`, no pegarlos.

---

## Bloque 1. El servidor MCP oficial de Figma y la animación nativa

### Takeaway
El servidor MCP oficial de Figma (remoto en `https://mcp.figma.com/mcp`) ya no es solo de lectura «diseño → código». Desde 2025-2026 escribe en el lienzo (`use_figma`), genera imágenes y vectores, crea *shaders*, ejecuta flujos de Figma Weave y lee y exporta animación de Figma Motion. Para un estudio de motion, lo relevante es que Figma ya sirve como **herramienta de styleframes y animatics animados**, y que Claude puede leer y escribir esa animación.

### Hallazgos

**Servidor y planes**
- Hay dos servidores. El **remoto** es el recomendado y el que tiene «the broadest set of features». Escribir en el lienzo exige el remoto. El de **escritorio** necesita asiento Dev o Full en un plan de pago [DOC: https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server].
- **Límites de uso:** los asientos View o Collab de cualquier plan, incluido Starter, tienen 20 llamadas al mes. Full o Dev en Professional: 200 al día y 10 por minuto. Organization: 200 al día y 15 por minuto. Enterprise: 600 al día y 20 por minuto. Los límites cuentan las herramientas de lectura. Quedan exentas algunas de escritura (`create_new_file`, `generate_figma_design`, `add_code_connect_map`, `whoami`) y las acciones que gastan créditos de IA [DOC: https://help.figma.com/hc/en-us/articles/39252411778583; https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/].
- **Escribir en el lienzo** está disponible en los planes Professional, Education, Organization y Enterprise, y requiere permiso de edición. `use_figma` no inserta imágenes por sí mismo (se usa `upload_assets` o `generate_image`). Todavía no admite importar componentes con imágenes o vídeos ni crear GIF. Las fuentes tienen que estar subidas a la cuenta de Figma: las instaladas en local no sirven. Cada llamada devuelve como máximo 20 KB [DOC: https://help.figma.com/hc/en-us/articles/42495251338775].
- Fuera de los borradores hace falta asiento Full. El asiento Dev solo escribe en borradores. Escribir es gratis durante la beta y pasará a ser de pago por uso [DOC: https://help.figma.com/hc/en-us/articles/39252411778583].

**Herramientas relevantes para motion**

Fuente de toda la lista: [DOC: https://help.figma.com/hc/en-us/articles/42495147242903].
- `get_design_context`: detalles y código de una capa. Por defecto genera **React + Tailwind**, con captura de pantalla.
- `get_metadata`: esquema XML ligero con ID, nombre, tipo, posición y tamaño.
- `get_screenshot`: captura de la selección.
- `get_variable_defs`: variables y estilos (color, espaciado, tipografía) de una selección.
- `download_assets`: hasta 20 nodos o las imágenes originales.
- `upload_assets`: hasta 60 imágenes o SVG por llamada.
- `get_motion_context`: *keyframes*, *easing*, CSS `@keyframes` y fragmentos de Motion. Se usa después de `get_design_context`.
- `export_video`: renderiza la animación por *keyframes* de un frame como MP4. Solo en el servidor remoto y requiere acceso a la animación por *keyframes*.
- `use_figma`: crea, edita o inspecciona contenido en Design, FigJam, Slides y Specs.
- `html_to_figma`: convierte HTML en capas planas. Está desplegándose y puede no estar disponible.
- `generate_image` y `generate_vector_illustration`: de pago, con créditos de IA de Figma.
- `create_shader`/`update_shader`/`list_shaders`: *shaders* de relleno o de efecto.
- `weave_*`: necesitan una cuenta de Figma Weave de pago y gastan créditos de Weave.
- `send_code_to_figma`: importa un proyecto local como archivo de Make o como *code layer*.
- En el plan Government no están disponibles «Code to Canvas, Code Connect UI ni las herramientas de Figma Motion».

**`get_motion_context` en detalle** [DOC: skill `figma-implement-motion`, leída vía MCP]
- Devuelve el inventario de nodos animados, `codeSnippets` (CSS `@keyframes` y motion.dev), `textAnimations` (grupos de texto escalonados con `derivedTimingInfo`), `keyframeBindings` como respaldo y `motionSummary` solo cuando no hay fragmento.
- Con `recursive: true` (hasta 500 nodos) añade `timelineCohorts`: `{ rootNodeId, durationMs, loopMode: once|loop|boomerang, memberNodeIds }`.
- Se cruza con `get_design_context` por `data-node-id`. Si hay conflicto de tiempos, manda `get_motion_context`.
- **Sin soporte de código** (*lint* de nivel *Error*): transiciones de prototipo y Smart Animate («Prototype interactions aren't currently supported in MCP»), y exportación de GIF o SVG animado.
- **Soporte parcial o nulo** (respaldo recomendado: vídeo o Lottie): trazados en arco, máscaras animadas, redes vectoriales complejas y booleanas, *path trim* con tiempos desalineados y GenEffects (los *shaders* no salen en el código).

**`export_video`** [DOC: descripción de la herramienta y skill `figma-use-motion`]
- Solo produce **MP4**: «GIF and animated SVG export are not supported yet».
- Renderiza en el servidor y devuelve una URL prefirmada, con un tiempo de vida de 30 s a 7 días (1 h por defecto). Si tarda, hay que sondear con `jobId`.
- Admite fps de 5 a 60, `quality` low/medium/high y `constraint` (SCALE, WIDTH o HEIGHT), hasta 4096 px por lado.
- El `nodeId` tiene que ser **el frame de primer nivel** que posee la línea de tiempo, no un hijo.
- Los **GenEffects no se renderizan** en la exportación del servidor. Para que salgan, hay que exportar en local desde Figma.
- La propia skill recomienda usarla como diagnóstico: renders pequeños (ancho de 320 a 768 px, de 5 a 10 fps), extraer fotogramas con `ffmpeg` e iterar agrupando correcciones, porque es «slow and expensive».

**Crear animación desde Claude** [DOC: skill `figma-use-motion` y referencias]
- `node.manualKeyframeTracks` y `applyManualKeyframeTrack`. Campos públicos: `TRANSLATION_X/Y/XY`, `ROTATION`, `SCALE_X/Y/XY`, `OPACITY`, radios de esquina, grosor de trazo, *padding*/*gap* de auto layout, `PATH_TRIM_START/END`, `WIDTH/HEIGHT`, color de rellenos y trazos por índice, y efectos (radio de desenfoque, sombra, refracción, ruido…).
- Las transformaciones son **relativas** (aditivas o multiplicativas). Opacidad, radios y demás campos son absolutos.
- Los tiempos van en segundos. El primer *keyframe* mantiene su valor hacia atrás y el último hacia delante.
- `animationStyles` con estilos de Figma (`figma.motion.figmaAnimationStyles()`) y estilos personalizados del archivo. `TextStagger` anima por carácter, palabra, línea o párrafo sin romper el texto.
- `node.setTimelineDuration` fija la duración de la línea de tiempo del frame contenedor.
- *Easing*: `EASE_IN/OUT/IN_AND_OUT`, `LINEAR`, variantes `_BACK`, `CUSTOM_CUBIC_BEZIER {x1,y1,x2,y2}`, muelles `GENTLE/QUICK/BOUNCY/SLOW`, `CUSTOM_SPRING {bounce 0–1}` y `HOLD`. Existe `figma.motion.physicalSpringToNormalized({mass, stiffness, damping})`.
- **No hay que animar el frame de primer nivel.** Se animan sus descendientes.
- Puede que la API de motion no esté activada para el usuario. Entonces lanza el error «not a supported API» y hay que parar.
- Las transformaciones 3D (`TRANSFORM_3D_ROTATION_X/Y`) van aparte y requieren su propio acceso.

**Figma Motion como producto**
- Descripción: «lets you create, refine, and build production-ready animations without ever leaving your design file». Está en beta abierta. Planes: Starter, Professional, Education, Organization y Enterprise, con permiso de edición [DOC: https://help.figma.com/hc/en-us/articles/41274629073303-Explore-Figma-Motion].
- Funciones:
  - línea de tiempo, presets, *keyframes* manuales o *auto-keyframe*;
  - el agente de Figma genera *keyframes* a partir de texto;
  - variables de *easing* y de tiempo;
  - componentes animados;
  - comentarios con marca de tiempo;
  - Dev Mode copia la animación como CSS, JSON o motion.dev;
  - el MCP envía la animación a agentes de código [DOC: misma URL].
- Línea de tiempo: 2000 ms por defecto; modos Loop, Once y Ping-pong [DOC: https://help.figma.com/hc/en-us/articles/41405906446999-Use-the-Figma-Motion-timeline].
- Punto de anclaje editable (Opción+R). En modo Motion la posición se mide desde el centro [DOC: https://help.figma.com/hc/en-us/articles/41352588622615-Move-a-layer-s-anchor-point].
- *Path trim* solo con trazos centrados. Hay preset de trazo para trazados abiertos y *keyframes* de inicio y fin para abiertos y cerrados [DOC: https://help.figma.com/hc/en-us/articles/42200302811927-Animate-strokes-with-path-trim].
- Animación de texto por carácter, palabra, línea o párrafo, con composiciones de entrada y salida guardables como estilo personalizado [DOC: https://help.figma.com/hc/en-us/articles/43825262591383-Animate-text-layers].
- **Audio:** AAC, MPA, MP3 y WAV, con volumen, silenciado y división en el cabezal. Solo en Professional o superior [DOC: https://help.figma.com/hc/en-us/articles/43825294171927-Add-audio-to-animations].
- **Exportación** desde la app: «You can also export as MP4, WebM, Animated SVG or GIF» [DOC: https://www.figma.com/blog/config-2026-recap/]. La página de producto también cita SVG y React en Dev Mode [DOC: https://www.figma.com/motion/].
- Anunciado como próximo (*coming soon*) en la página de producto: transformaciones 3D y «full timelines for screen-to-screen transitions». La skill del MCP indica que las 3D **ya existen detrás de un control de acceso** [DOC: https://www.figma.com/motion/ y skill `figma-3d-transforms`].

**Otros anuncios**
- **Config 2026:** Motion; Weave como lienzo de nodos para flujos generativos; *shaders* generados por el agente («Interactive shaders are coming soon»); *code layers* desde julio [DOC: https://www.figma.com/blog/config-2026-recap/]. El artículo no da fecha de publicación. La fecha del 24-06-2026 sale de la página de betas.
- **Config 2025:** Figma Make (*prompt-to-app*, con animaciones por *prompt*), Figma Sites (webs con interacciones y animaciones por código o Make), Grid en auto layout, Figma Draw (vectores, efectos y texturas) y Figma Buzz (piezas de marca y diseño en lote). Ninguno era una herramienta de vídeo [DOC: https://www.figma.com/blog/config-2025-recap/]. La página no da la fecha. [EXPERT: Config 2025 fue el 6 y 7 de mayo de 2025.]
- **Figma Weave** (antes Weavy; weavy.ai redirige a weave.figma.com): plataforma de nodos con modelos de Google, Kling, OpenAI, Bytedance, Black Forest Labs, Runway, Luma, LTX, Wan, Grok, Recraft y Bria, más herramientas de edición (*inpainting*, *upscaling*, profundidad Z, *relighting*…) [DOC: https://weave.figma.com/].
- Sites y Buzz siguen en beta abierta. Draw no figura como beta [DOC: página de betas].

### Inferencias
- [INFERENCIA] Figma Motion cubre muy bien el *motion* de interfaz y de marca sencillo: entradas, tipografía cinética simple, *loops*, *lower thirds* e iconos. No sustituye a After Effects en composición avanzada (no hay ni rastro de *tracking*, *rotoscopia*, expresiones, partículas reales ni 3D completo) ni a Remotion en piezas dirigidas por datos, largas o con subtítulos y voz.
- [INFERENCIA] Para la agencia, `export_video` sirve sobre todo para dos cosas: hacer **animatics y previsualizaciones** que Erik valida en Figma, y entregar piezas cortas sin pasar por código.

### Huecos
- No he confirmado si el MP4 de `export_video` incluye el audio de Motion. Ni la ayuda de audio ni la herramienta lo dicen.
- No hay documentación sobre la exportación nativa a Lottie desde Motion. LottieFiles sí dice exportar «Figma Motion work» (ver bloque 3).
- No he podido abrir la página de Config 2026 para fijar la fecha y la ciudad del evento.
- No sé si `get_motion_context` cuenta como lectura a efectos de límite. Es [INFERENCIA] que sí.

---

## Bloque 2. De Figma a After Effects

### Takeaway
La vía mantenida hoy es **Overlord (Battle Axe)**: 75 USD, licencia perpetua, Figma de escritorio y web ⇄ After Effects, Illustrator y Photoshop. **AEUX está archivado** desde el 21-06-2025. Los formatos vectoriales y el texto pasan bien. Auto layout, componentes, variables y efectos complejos llegan «horneados» o se pierden.

### Hallazgos
- **AEUX** (Google): crea capas editables de AE a partir de Sketch y, después, de Figma en navegador. El repositorio está **archivado y en solo lectura desde el 21-06-2025** [DOC: https://github.com/google/aeux].
- **Overlord**: aplicación de escritorio, no plugin. Pasa de Figma a AE capas de forma y texto nativas con fuentes editables, degradados, nombres, máscaras, modos de fusión, varios rellenos y trazos, alineación de trazo (mediante expresiones), grupos e imágenes enlazadas al AEP. También manda de vuelta a Figma un PNG rasterizado o las capas. Requisitos: AE/Ai CC 2022 o superior, Windows 10 22H2 o macOS 12 o superior. Precio: 75 USD, perpetua, dos máquinas [DOC: https://www.battleaxe.co/overlord].
- Importación nativa útil como alternativa: exportar SVG o PDF desde Figma y abrirlo en Illustrator. AE importa archivos .ai («Create shapes from vector layer»). [EXPERT]

### Qué se conserva y qué se rompe
- **Se conserva bien** [DOC Overlord + EXPERT]: rectángulos, elipses, trazados, rellenos sólidos y degradados lineales o radiales, trazos, texto como capa de texto editable, jerarquía de grupos y nombres de capa, máscaras e imágenes.
- **Se rompe o se aplana** [EXPERT/INFERENCIA]:
  - auto layout: queda la posición absoluta y desaparece la lógica de *hug*/*fill*;
  - componentes y variantes: llegan como grupos;
  - variables y modos;
  - efectos avanzados: *glass*, ruido y textura, desenfoque de fondo y blur progresivo; normalmente toca rasterizar;
  - booleanas complejas;
  - texto con estilos mixtos o con `leading` en porcentaje, que puede variar;
  - fuentes no instaladas en local;
  - *shaders* de Figma y la animación de Figma Motion: no hay ninguna fuente que diga que Overlord transfiere los *keyframes*.

### Inferencias
- [INFERENCIA] Ruta práctica para piezas de AE: styleframes en Figma con una capa por elemento animable y nombres limpios → Overlord → precomposiciones por escena en AE. Nombres y grupos son lo que más tiempo ahorra.
- [INFERENCIA] Si el destino es AE, conviene **no** depender de efectos exclusivos de Figma. Lo que no exista en AE se rasteriza a 2× en Figma o se rehace en AE.

### Huecos
- No he podido abrir aescripts.com ni aeux.io para ver las listas detalladas de compatibilidad, ni la última versión de Overlord.
- No he verificado si existen otros plugins actuales de Figma a AE con mantenimiento.

---

## Bloque 3. De Figma a código animado (React, Remotion, Lottie y Rive)

### Takeaway
En el lado del código, Figma aporta tres cosas reutilizables: **estructura** (`get_design_context`: React + Tailwind y *assets*), **tokens** (`get_variable_defs`) y **movimiento** (`get_motion_context`: *keyframes* y *easing*). Remotion las aprovecha todas si Claude **traduce** el tiempo a fotogramas. Lottie es la salida cuando el entregable es un archivo de animación para web o app. Rive, cuando hace falta interactividad o una máquina de estados.

### Hallazgos

**React, Dev Mode y Code Connect**
- `get_design_context` devuelve un código de **referencia** que hay que adaptar al proyecto. La skill obliga a pedir captura, descargar los *assets* (sus URLs caducan), no redibujar los SVG y reutilizar los componentes del proyecto [DOC: skill `figma-design-to-code`].
- Code Connect vincula componentes de Figma con componentes de código. Se ve en Dev Mode y mejora lo que el MCP da a los agentes. Planes Professional, Organization y Enterprise con asiento Dev o Full. En Professional, una librería y un *framework* activos [DOC: https://developers.figma.com/docs/code-connect/].
- La API REST de variables es **solo para Enterprise** [DOC: https://developers.figma.com/docs/rest-api/variables/]. Por eso, en Professional, la vía para extraer *tokens* es el MCP (`get_variable_defs`) o `use_figma`, que puede leer las colecciones con la API de plugins.
- Los modos de variables solo existen en Professional o superior; Starter no los tiene [DOC: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables].

**Remotion**
- Regla de oro: «All animations in Remotion must be driven by the value returned by the `useCurrentFrame()` hook».
  - Framer Motion/motion **no tiene integración**.
  - GSAP tiene `@remotion/gsap`.
  - Lottie tiene `@remotion/lottie`.
  - Rive tiene `@remotion/rive`.
  - Las animaciones CSS solo funcionan sincronizadas con `animation-play-state` y `animation-delay`.
  [DOC: https://www.remotion.dev/docs/third-party; https://www.remotion.dev/docs/flickering]
- Importar desde Figma: «Copy as SVG» y pegar en Remotion Studio (desde la v4.0.495; es el método «more reliable»). También se puede pegar la capa directamente, pero no con imágenes, o pasar el SVG por SVGR a JSX [DOC: https://www.remotion.dev/docs/figma].
- Fuentes: `@remotion/google-fonts` (`loadFont`), `@remotion/fonts` para archivos locales en `public/`, o `FontFace` con `delayRender` [DOC: https://www.remotion.dev/docs/fonts].
- Trazados: `@remotion/paths` incluye `evolvePath`, `interpolatePath`, `getLength`, `getPointAtLength`, `cutPath`… [DOC: https://www.remotion.dev/docs/paths/].
- *Easing*: `interpolate(..., { easing: Easing.bezier(x1,y1,x2,y2) })`. `spring()` acepta `mass`, `damping` y `stiffness` [DOC: https://www.remotion.dev/docs/easing].
- Tailwind v4: `@remotion/tailwind-v4` con `enableTailwind` en `remotion.config.ts`, desde la v4.0.256 [DOC: https://www.remotion.dev/docs/tailwind]. Encaja con el código React + Tailwind que devuelve `get_design_context`.
- Remotion tiene *Agent Skills* para Claude Code: `npx remotion skills add` instala `/remotion-best-practices`, `/remotion-markup`, `/remotion-render`, `/remotion-captions`… [DOC: https://www.remotion.dev/docs/ai/skills].
- Lottie dentro de Remotion: algunas expresiones pueden parpadear porque Remotion busca el fotograma con `goToAndStop` [DOC: https://www.remotion.dev/docs/lottie/].

**Lottie (LottieFiles para Figma)**
- Exporta frames, flujos de prototipo y **trabajo de Figma Motion** a Lottie JSON o dotLottie. También a GIF, MP4, WebM y MOV.
- Los prototipos salen como máquina de estados interactiva de dotLottie, con los *triggers* clic, *hover*, *press*, *after delay* y solo la acción «Navigate To». No admite *drag* ni teclado.
- Los «Motion Tokens» enlazan color, texto y transformaciones con datos en tiempo de ejecución.
- Para animación de personajes fotograma a fotograma, recomiendan After Effects con Bodymovin.
[DOC: https://lottiefiles.com/plugins/figma]

**Rive**
- En Figma, «Copy as SVG» sobre un grupo y pegar en Rive. Se convierte en vectores nativos.
- Admite degradados lineales y radiales, aunque ignora sus transformaciones. Las máscaras pasan a *clipping* y los trazos discontinuos se conservan.
- **No** admite filtros, sesgo (*skew*) ni imágenes incrustadas. Los colores heredados se vuelven blancos.
- Rive recomienda convertir lo no compatible a trazados antes.
[DOC: https://rive.app/docs/editor/assets/svg.md]

**Smart Animate y prototipos como animatic**
- Empareja capas por **nombre y posición en la jerarquía**. Anima escala, posición, opacidad, rotación y relleno.
- **No** anima sombras ni el morphing entre tipos de forma. Si algo no se admite, recurre a un fundido.
[DOC: https://help.figma.com/hc/en-us/articles/360039818874-Create-advanced-animations-with-Smart-Animate]
- El MCP **no** lee transiciones de prototipo ni Smart Animate. Solo ve los estados inicial y final [DOC: lint de la skill `figma-implement-motion`].

### Inferencias
- [INFERENCIA] Correspondencias de Figma Motion a Remotion:
  - `timelinePosition` (s) × fps = fotograma;
  - `CUSTOM_CUBIC_BEZIER` → `Easing.bezier`;
  - `EASE_OUT` y similares → su curva cúbica estándar, que viene en el `@keyframes` del fragmento;
  - `HOLD` → valor escalonado o `Easing.step1`;
  - `TRANSLATION_X` → `translateX` sumado a la posición base;
  - `SCALE_*` → multiplicador;
  - `ROTATION`: Figma considera positivo el giro **antihorario** y CSS el horario, así que hay que cambiar el signo (la skill avisa de que Figma usa el antihorario);
  - `PATH_TRIM` → `evolvePath` o `stroke-dashoffset`;
  - `TextStagger` → *map* de caracteres o palabras con retardo `i * staggerStep`.
- [INFERENCIA] Al leerlos de vuelta, los muelles de Figma solo traen `bounce` (de 0 a 1), no masa, rigidez y amortiguación. Para Remotion hay dos opciones: aproximar con `spring({ config: { damping, stiffness } })` y ajustar a ojo contra el MP4 de `export_video`, o muestrear la curva generada por motion.dev y meterla en una tabla. Hay que avisar a Erik de que no será idéntico.
- [INFERENCIA] La mejor arquitectura en Remotion:
  - `tokens.ts`, generado a partir de `get_variable_defs`;
  - un componente por styleframe o escena, sacado de `get_design_context`;
  - un `motion.ts` con constantes de duraciones y curvas, a partir de `get_motion_context`;
  - `<Sequence>` por escena.
- [INFERENCIA] Las posiciones absolutas de `get_design_context` se pueden **conservar** en Remotion. A diferencia de la web, el lienzo es fijo (1080×1920). Es una de las raras ocasiones en que el código «absolute» de Figma es justo lo que interesa.

### Huecos
- No he probado en vivo qué devuelve `get_motion_context` para una animación concreta (no había archivo y el límite es de 20 lecturas al mes).
- No he confirmado si Rive tiene hoy un plugin oficial de Figma más allá de copiar y pegar SVG.
- No conozco la calidad real de la exportación de Figma Motion a Lottie de LottieFiles con *path trim*, texto escalonado o *easing* de muelle.

---

## Bloque 4. Diseñar para animar: preparar Figma para motion

### Takeaway
Un archivo de Figma «animable» se organiza **por escenas**. Usa **nombres de capa semánticos y estables**, aísla en su propia capa cada elemento que se mueve, y saca color, tipografía, espaciado y tiempos de **variables**. Así funcionan a la vez Smart Animate, Figma Motion, Overlord y la extracción de Claude hacia Remotion.

### Hallazgos con base documental
- Smart Animate empareja por nombre y jerarquía, así que los nombres coherentes entre frames son obligatorios [DOC: artículo de Smart Animate].
- Motion requiere que la animación viva en **descendientes** de un **frame de primer nivel**, que es quien posee la línea de tiempo y quien se exporta [DOC: skill `figma-use-motion`; `export_video`].
- *Path trim* solo con trazos **centrados** [DOC].
- Punto de anclaje: centrado por defecto y movible por capa [DOC].
- Los grupos reciben `display: contents` en el código generado, lo que puede romper animaciones sobre grupos. Es mejor usar **frames** que grupos para lo que se va a animar [DOC: lint «Groups get display: contents»].
- Las redes vectoriales complejas y las booleanas exportan mal animadas, así que conviene aplanarlas antes [DOC: unsupported-and-fallbacks].
- Los GenEffects no salen en el código ni en el vídeo exportado por MCP [DOC].
- Las fuentes, para el MCP, tienen que estar subidas a la cuenta [DOC: escritura en el lienzo].
- Existen variables de *easing* y de tiempo, estilos de animación personalizados y componentes animados para crear un «sistema de motion» [DOC: Explore Figma Motion y blog de Config 2026].

### Prácticas de estudio [PRACT/EXPERT]
- **Styleframes:** de 3 a 6 fotogramas clave de la pieza a resolución final. Representan los momentos de mayor carga visual, no la primera imagen de cada plano. Son el contrato estético con el cliente antes de animar.
- **Design boards / storyboard:** secuencia completa de viñetas con notas de transición («entra por la izquierda», «*match cut* con el círculo»). En Figma se resuelve con una **Section por escena** y frames numerados dentro.
- **Animatic:** los boards cronometrados, con voz o música provisional. En Figma: Motion o prototipo con *After delay* y luego `export_video`.

### Convenciones recomendadas para Erik [PRACT + INFERENCIA]
- **Página `00_Cover`** con portada y versión. **`01_Moodboard`**, **`02_Styleframes`**, **`03_Boards`** y **`04_Animatic`**. **`05_Export`** con frames limpios solo para extraer. **`99_Tokens`** con muestras de variables.
- **Frames de primer nivel** con nombres `SC01_Hook_9x16`, `SC02_Problema_9x16`… Mismo tamaño en toda la pieza: 1080×1920 para vertical, 1920×1080 para horizontal o 1080×1350 para *feed*.
- **Capas:** `bg`, `title`, `subtitle`, `cta`, `logo`, `product`, `shape_01`… en minúsculas, sin espacios y en inglés o castellano, pero de forma **consistente**. El mismo nombre en todas las escenas si es el mismo objeto (para Smart Animate y para la continuidad en Remotion).
- **Un elemento animable = una capa o frame.** Nada de textos fusionados con fondos ni iconos aplanados con su contenedor. Rasterizar solo lo que nunca se mueve.
- **Auto layout** para bloques de texto y UI (los *lower thirds*, los *chips*) y posición absoluta para la composición de escena. Ojo: auto layout no pasa a AE (bloque 2).
- **Componentes** para piezas repetidas: subtítulo, CTA, logotipo, tarjeta de precio, marco de móvil. Con variantes de estado (entrada, reposo, salida) que luego sirven como *keyframes* de referencia.
- **Variables:**
  - colección `color` (`brand/primary`, `bg/base`, `text/onDark`…), con modos claro u oscuro o por cliente si es Professional;
  - `space` (4, 8, 16, 24, 32, 48…);
  - `radius`;
  - `type` (tamaños; las familias en estilos de texto);
  - `motion` (duraciones de 200, 400, 800 ms y curvas como variables de *easing*, si el plan lo permite).
- **Safe zones 9:16:** un componente `guide/safezone_9x16` bloqueado y oculto al exportar, con márgenes laterales de ~60-90 px, una franja superior reservada a la interfaz de ~220-280 px y una inferior de ~350-450 px en 1080×1920 (pie, botones y descripción). [PRACT: las cifras exactas cambian por red social y por año; ver Huecos.]
- **Rejilla:** *layout grid* de 4 a 6 columnas con márgenes de 64-80 px en 1080 de ancho, más una rejilla base de 8 px.
- **Tipografía:** fuentes de Google Fonts o subidas a la cuenta de Figma, para que Claude pueda usarlas con `use_figma` y cargarlas con `@remotion/google-fonts` o `@remotion/fonts`.

### Huecos
- No he verificado con fuentes oficiales de Meta y TikTok las cifras actuales de las *safe zones*.
- No he podido abrir el artículo de School of Motion sobre styleframes. La definición es conocimiento de industria.
- Tampoco he confirmado qué plan permite subir fuentes personalizadas compartidas. [EXPERT: históricamente, las fuentes compartidas eran de Organization o Enterprise, así que en Professional conviene usar Google Fonts.]

---

## Bloque 5. Flujo recomendado: Erik + Claude, de Figma a Remotion

### Configuración previa (la hace Erik una vez)
1. **Plan Figma Professional con asiento Full** para Erik. Desbloquea 200 lecturas al día, escritura en el lienzo fuera de borradores, modos de variables, Code Connect y audio en Motion. Con la cuenta actual (Starter y View) el flujo no es viable: 20 lecturas al mes y sin escritura fuera de borradores. [DOC]
2. **Conector de Figma en Claude** con la cuenta correcta. Comprobarlo pidiendo a Claude `whoami`. Si es Organization o Enterprise, puede que un administrador tenga que aprobar el cliente. [DOC]
3. **Comprobar el acceso a Figma Motion** (beta abierta con despliegue gradual): abrir un archivo de diseño y mirar si aparece Motion en la barra de herramientas. Si `use_figma` devuelve «not a supported API» con motion, todavía no está activo. [DOC]
4. **Equipo y proyecto** «Clientes/<Cliente>/<Campaña>» con una plantilla de archivo (las páginas del bloque 4) y una **librería de marca por cliente** (variables y componentes) publicada. [PRACT]
5. **Fuentes:** usar Google Fonts o subir las de la marca si el plan lo permite. [DOC/INFERENCIA]
6. **Repositorio de Remotion** base con Tailwind v4, *Agent Skills* de Remotion (`npx remotion skills add`), una carpeta `src/brand/<cliente>/tokens.ts` y `ffmpeg` instalado (para revisar los MP4 de `export_video`). [DOC + INFERENCIA]
7. Opcional: **Overlord** (75 USD) si alguna pieza va a AE. **LottieFiles para Figma** si el entregable es Lottie. Cuenta de **Weave** solo si se van a generar imágenes o vídeo con IA desde Figma (de pago). [DOC]

### Paso a paso

| # | Fase | Quién | Herramientas | Salida |
|---|------|-------|--------------|--------|
| 1 | **Brief** | Erik da el contexto y Claude lo estructura | Conversación y skills de agencia | Brief de una página: objetivo, formato (9:16, duración), mensaje, CTA, referencias, restricciones de marca |
| 2 | **Moodboard** | Claude propone y Erik selecciona | `create_new_file`, `upload_assets` (referencias de Erik), `generate_image` o `weave_*` (de pago), `use_figma` para maquetar | Página `01_Moodboard` con 3 rutas visuales nombradas |
| 3 | **Tokens** | Claude | `use_figma` (colecciones `color`, `space`, `type`, `motion`) | Variables y estilos de texto en `99_Tokens`, o enlazar la librería del cliente (`get_libraries`, `search_design_system`) |
| 4 | **Styleframes** | Claude crea y Erik dirige | `use_figma` (componentes y variables, preferible) o `html_to_figma` (capas planas, rápido para explorar), `generate_vector_illustration` | 3-6 frames 1080×1920 por ruta, capas nombradas, guía de *safe zone* |
| 5 | **Validación 1** | **Erik** | Comentarios en Figma (`get_comments` los lee Claude) | Ruta elegida y cambios |
| 6 | **Boards y animatic** | Claude | `use_figma` + skill `figma-use-motion` (*keyframes*, `TextStagger`, estilos), `export_video` a baja resolución y fps bajos, más `ffmpeg` para extraer fotogramas | Animatic MP4 y notas de tiempo por escena |
| 7 | **Validación 2** | **Erik** | Reproducir en Figma, comentarios con marca de tiempo | Ritmo y transiciones aprobados |
| 8 | **Extracción** | Claude | `get_metadata` (mapa de escenas), `get_design_context` (estructura y *assets*), `get_variable_defs` (*tokens*), `get_motion_context` con `recursive` (*keyframes*), `download_assets` | `tokens.ts`, componentes de escena, `motion.ts` y *assets* locales |
| 9 | **Animación en Remotion** | Claude | Remotion: `interpolate`, `Easing.bezier`, `spring`, `@remotion/paths`, fuentes, `<Sequence>` | Composición `Pieza_9x16` que reproduce el animatic y lo mejora |
| 10 | **Render y QA** | Claude | `npx remotion render`, comparación de fotogramas frente a `export_video` y styleframes | MP4 v1 y PNG de control |
| 11 | **Revisión** | **Erik** (y el cliente) | Comentarios con código de tiempo | Ronda de cambios: los visuales en Figma, los de ritmo en Remotion |
| 12 | **Entrega y sistema** | Claude | Exportes por formato y guardar `tokens.ts`, `motion.ts` y componentes como plantilla | Versiones 9:16, 4:5 y 16:9, y el sistema reutilizable para la próxima pieza |

### Qué hace Claude solo y qué necesita a Erik
- **Claude solo:** estructurar el brief; crear archivos, páginas y variables; maquetar styleframes y boards; animar en Figma Motion por API; exportar MP4 de previsualización; extraer *tokens* y estructura; escribir y renderizar Remotion; QA técnico (fotogramas, *safe zones*, contraste, duración).
- **Necesita a Erik:**
  - elegir la ruta creativa y el gusto final (validaciones 1, 2 y 11);
  - aportar *assets* de marca, fuentes con licencia y material del cliente;
  - activar plan, asiento, Motion y créditos de IA o Weave;
  - publicar la librería, porque Code Connect y las librerías requieren publicación manual [DOC];
  - aprobar los gastos en créditos;
  - hacer los ajustes finos de *timing* «a ojo», sobre todo en muelles y transiciones entre escenas, que el MCP no lee (Smart Animate) [DOC].

### Rutas alternativas según el entregable
- **Pieza corta de UI o marca, sin datos ni voz:** Figma Motion y exportación de MP4 desde la app (incluye GenEffects y quizá audio) o `export_video`. Sin Remotion. [DOC + INFERENCIA]
- **Lottie para web o app:** Figma Motion y el plugin de LottieFiles. Validar la fidelidad. [DOC]
- **Composición compleja o 3D:** styleframes en Figma, Overlord y After Effects. [DOC + INFERENCIA]
- **Interactividad o máquina de estados:** copiar como SVG y llevarlo a Rive. [DOC]
- **Series, plantillas con datos, subtítulos o voz:** Remotion (el flujo principal). [INFERENCIA]

---

## Chuleta de reglas

**Cuenta y permisos**
1. Comprueba primero `whoami`. Con Starter o asiento View hay 20 lecturas al mes: no gastes llamadas en exploración.
2. Para escribir en archivos compartidos hace falta asiento Full en Professional o superior. El asiento Dev solo escribe en borradores.
3. Antes de cualquier `use_figma`, carga la skill `figma-use`. Para animación, también `figma-use-motion`. Antes de `get_design_context`, `figma-design-to-code`. Para pasar motion a código, `figma-implement-motion`.
4. Si motion responde «not a supported API», **para**: Motion no está activado para ese usuario.

**Estructura del archivo**
5. Un frame de primer nivel por escena, al tamaño final. Se anima a los hijos, nunca al frame de primer nivel.
6. Usa frames, no grupos, para lo que se mueve: los grupos se convierten en `display: contents`.
7. Nombres de capa semánticos e idénticos entre escenas para el mismo objeto.
8. Un elemento animable, una capa. Aplana las booleanas y los vectores complejos antes de animar.
9. Para *path trim*, el trazo tiene que estar centrado.
10. Color, espaciado, tipografía y tiempos, en variables. Nada de valores sueltos en los styleframes finales.
11. Usa Google Fonts o fuentes subidas a Figma. Las fuentes locales no las ve el MCP.

**Exportación y extracción**
12. `export_video` solo da MP4 y solo de frames de primer nivel. Hazlo pequeño (ancho de 320 a 768 px, de 5 a 10 fps) para revisar y en calidad alta solo al final. La URL caduca (1 h por defecto).
13. Los GenEffects y los *shaders* no salen ni en `export_video` ni en el código. Para ellos, exporta desde la app o rasteriza.
14. El MCP no lee Smart Animate ni las transiciones de prototipo: solo los estados inicial y final. El *timing* entre pantallas se pide por escrito o se anima con *keyframes*.
15. Descarga siempre los *assets*. Nunca dejes URLs temporales de Figma en el código.

**Remotion**
16. Todo se anima a partir de `useCurrentFrame()`. Nunca pegues motion.dev ni CSS `@keyframes` tal cual: tradúcelos a `interpolate`.
17. Tiempo en segundos × fps = fotograma. `CUSTOM_CUBIC_BEZIER` → `Easing.bezier`. `HOLD` → escalón. Rotación de Figma positiva = antihoraria, así que en CSS se invierte el signo.
18. Los muelles de Figma solo traen `bounce`: aproxímalos con `spring()` y valídalos contra el MP4 de Figma.
19. En Remotion conviene mantener las posiciones absolutas de Figma: el lienzo es fijo.
20. Un componente por escena, `tokens.ts` y `motion.ts` compartidos, y `<Sequence>` para montar. Así cada pieza nueva sale de la plantilla de la anterior.

**Otras salidas**
21. AE: Overlord. AEUX está archivado desde junio de 2025. Auto layout, componentes, variables y efectos de Figma no llegan vivos.
22. Rive: copiar como SVG; no admite filtros, *skew* ni imágenes incrustadas.
23. Lottie: plugin de LottieFiles, que acepta trabajo de Figma Motion y prototipos (solo con «Navigate To»).

---

## Fuentes principales consultadas
- Skills del servidor MCP de Figma (leídas vía `get_figma_skill`): `figma-use-motion` (y `references/motion-patterns.md`, `motion-easing.md`), `figma-implement-motion` (y `unsupported-and-fallbacks.md`, `motion-lint-rules.md`), `figma-design-to-code` e índice `skill://index.json`.
- Descripciones de las herramientas MCP `get_motion_context`, `export_video`, `use_figma`, `html_to_figma`, `send_code_to_figma`, `create_shader` y `generate_vector_illustration`.
- https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server
- https://help.figma.com/hc/en-us/articles/42495147242903 (herramientas y *prompts*)
- https://help.figma.com/hc/en-us/articles/39252411778583 (planes, acceso y límites)
- https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/
- https://help.figma.com/hc/en-us/articles/42495251338775 (escritura en el lienzo)
- https://help.figma.com/hc/categories/41274596092695 (categoría Figma Motion) y sus artículos: 41274629073303, 41405906446999, 41307886266135, 41352588622615, 42200302811927, 43825262591383, 43825294171927, 41523077992855
- https://help.figma.com/hc/en-us/articles/4406787442711-What-Figma-features-are-in-beta
- https://www.figma.com/motion/
- https://www.figma.com/blog/config-2026-recap/
- https://www.figma.com/blog/config-2025-recap/
- https://weave.figma.com/
- https://help.figma.com/hc/en-us/articles/360039818874-Create-advanced-animations-with-Smart-Animate
- https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables
- https://developers.figma.com/docs/code-connect/
- https://developers.figma.com/docs/rest-api/variables/
- https://developers.figma.com/docs/figma-mcp-server/
- https://github.com/google/aeux
- https://www.battleaxe.co/overlord
- https://www.remotion.dev/docs/figma
- https://www.remotion.dev/docs/fonts
- https://www.remotion.dev/docs/paths/
- https://www.remotion.dev/docs/easing
- https://www.remotion.dev/docs/third-party
- https://www.remotion.dev/docs/flickering
- https://www.remotion.dev/docs/tailwind
- https://www.remotion.dev/docs/lottie/
- https://www.remotion.dev/docs/rive/
- https://www.remotion.dev/docs/ai/skills
- https://lottiefiles.com/plugins/figma
- https://rive.app/docs/editor/assets/svg.md
