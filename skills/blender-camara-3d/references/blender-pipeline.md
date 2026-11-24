# Blender + 3D en el pipeline de un director creativo con Claude (ronda 3)

Investigación para la skill de Erik (Remotion + IA generativa de vídeo). Fecha: 25-11-2026.

**Cómo se ha investigado.** La búsqueda web (WebSearch) estaba desactivada en este entorno, así que todo sale de lecturas directas (WebFetch) de documentación oficial, repositorios de GitHub, npm y webs de producto, más **pruebas ejecutadas de verdad**. Instalé `bpy==5.3.0` (Blender como módulo de Python, desde PyPI) y un proyecto Remotion 4.0.547 con TypeScript. Así comprobé valores por defecto, cambios de API y los snippets de este documento. Lo que lleva la etiqueta "probado" se ejecutó aquí y funcionó.

Etiquetas: [DOC] documentación oficial · [EXPERT] fuente experta o editorial · [PRACT] práctica verificada (incluye mis pruebas, marcadas "probado") · [CASO] caso real de un artista o estudio · [INFERENCIA] deducción mía, sin verificar.

Contexto de versiones (nov. 2026):
- **Blender 5.3** salió el 10-11-2026 y es la versión normal actual. **5.2 es LTS** (14-07-2026, soporte hasta julio de 2028). La 5.0 salió el 18-11-2025. [DOC] https://developer.blender.org/docs/release_notes/5.3/ · https://developer.blender.org/docs/release_notes/5.2/ · https://developer.blender.org/docs/release_notes/5.0/
- En npm: Remotion 4.0.547, three 0.187.0, @react-three/fiber 9.8.2, drei 10.7.9, leva 0.10.1 (oct. 2025) y @theatre/core 0.7.2 (último publish: **mayo de 2024**). [PRACT] consulta con `npm view`.

---

## 1. Blender controlado por Claude

### Takeaway
Hay dos maneras de que Claude controle Blender, y conviene usar las dos:
- **Por lotes (`blender -b -P script.py`).** Es reproducible, se puede versionar y no depende de una GUI abierta. Es la vía de producción.
- **En vivo (MCP).** Claude ejecuta Python dentro de un Blender abierto y "mira" el viewport. Es la vía de exploración y blockout rápido.

Lo que más fallos causa cuando un LLM escribe código bpy son los **cambios de API entre la 4.x y la 5.x** (sobre todo en animación), no Blender en sí.

### Hallazgos

**Render y scripts sin interfaz**
- **Sintaxis oficial.** `blender -b file.blend -a` renderiza la animación y `-f 10` un solo fotograma. Ejemplo completo: `blender -b file.blend -o /project/renders/frame_##### -F OPEN_EXR -f -2`. Otro: `blender -b file.blend -E CYCLES -s 10 -e 500 -t 2 -a`. [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/advanced/command_line/render.rst
- **El orden importa.** El manual dice "Arguments are executed in the order they are given!" y "Always position `-f` or `-a` as the last arguments". Por eso `blender -b file.blend -a -x 1 -o //render` **no** funciona y `-x 1 -o //render -a` sí. [DOC] mismo enlace.
- **Otros flags útiles:**
  - `-o` sustituye `#` por el número de frame (con relleno de ceros); `//` significa "relativo al .blend".
  - `--` corta el procesado de opciones; lo que va detrás llega a Python en `sys.argv`.
  - `--python-exit-code` hace que un error de Python devuelva un código de salida distinto de 0, útil para que Claude detecte fallos.
  - `--factory-startup` ignora el startup.blend del usuario, lo que da reproducibilidad.
  
  [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/advanced/command_line/arguments.rst
- **Patrón para Claude:** `blender -b --factory-startup --python-exit-code 1 -P cam_rig.py -- out/`. [INFERENCIA] combina los flags documentados.

**Cambios de API que rompen el código que suelen escribir los LLM** (probado en Blender 5.3.0)
- **`Action.fcurves` ya no existe en 5.3.** Tutoriales y LLM escriben `obj.animation_data.action.fcurves`, que **falla**. Desde la 4.4 las acciones tienen "slots" ("All Actions are 'slotted' now"); la forma correcta es `bpy_extras.anim_utils.action_get_channelbag_for_slot(action, slot).fcurves`. [DOC] https://developer.blender.org/docs/release_notes/4.4/animation_rigging/ + [PRACT] probado.
- **`scene.node_tree` (compositor) ya no existe;** ahora es `scene.compositing_node_group`. [PRACT] probado. El acceso tipo diccionario a ajustes integrados (`scene['cycles']`) también se eliminó en la 5.0. [DOC] https://developer.blender.org/docs/release_notes/5.0/python_api/
- **Identificador de EEVEE:** en 5.3 es `'BLENDER_EEVEE'`, no el `BLENDER_EEVEE_NEXT` de la 4.2/4.x. [PRACT] probado (enum del motor).
- **Valores por defecto (5.3, probado):**
  - Cámara: lente 50 mm, sensor 36×24, sensor_fit AUTO, clip 0,1–1000.
  - Profundidad de campo: desactivada; f/2.8, foco a 10 m, 0 palas.
  - Escena: 24 fps, 1920×1080. Desenfoque de movimiento desactivado, obturador 0,5, posición CENTER.
  - View transform: **AgX**.
  - Interpolación de keys nuevas: BEZIER con manejadores AUTO_CLAMPED.
- **Trampas reales que pillé en las pruebas:**
  1. `read_factory_settings(use_empty=True)` deja la escena sin World ni luces, y el render sale **negro**.
  2. `bpy.ops.render.render(write_still=True)` **no** sustituye `####`: guardó un archivo llamado literalmente `lit_####.png`. Los `#` solo se sustituyen en animación o con `-f` por CLI.
  3. **EEVEE en un servidor sin GPU** (EGL por software) tardó **87 s en un único frame a 384 px**, mientras que Cycles en CPU a 16 muestras tardó **~1 s por frame**. En una máquina sin GPU, Cycles con pocas muestras y denoise es "el rápido". En el Mac o PC de Erik con GPU será al revés.
  
  [PRACT] probado.

**Blender MCP (ahujasid)**
- **Qué es.** El repositorio se ha renombrado a **`ahujasid/mcp-for-blender`** (antes `blender-mcp`). Es un plugin comunitario, "not affiliated with the Blender Foundation", con unas 35k estrellas. Tiene dos piezas: un addon con un servidor de socket dentro de Blender (puerto por defecto **9876** en localhost) y un servidor MCP. [DOC] https://github.com/ahujasid/blender-mcp
- **Herramientas:**
  - `execute_blender_code` ejecuta Python arbitrario.
  - `look` devuelve capturas del viewport, de la cámara, de varios ángulos (`angles`), una tira de animación (`frames`) o un render, en modo sólido, material, render, wireframe o rayos X.
  - `get_scene_info` da un resumen de la escena.
  - `generate_3d` genera modelos con Tripo, Hunyuan3D, Rodin o Meshy.
  - Búsqueda e importación de assets de Poly Haven (CC0, sin clave), Sketchfab y Poly Pizza.
  - Gaussian splats de World Labs (requiere Blender 5.3+).
  
  **No tiene herramientas específicas de cámara ni de animación:** todo se hace escribiendo bpy. Requisitos: Blender 3.0+ y Python 3.10+. Instalación: `uvx mcp-for-blender setup`. [DOC] mismo enlace.
- **Riesgos:**
  - `execute_blender_code` ejecuta Python arbitrario ("save your work").
  - El socket "has no authentication or encryption".
  - Hay un modo seguro opcional, `BLENDER_MCP_SAFE_MODE=1`, que bloquea lectura y escritura de archivos, subprocesos y red.
  - Telemetría anónima **activada por defecto**; se apaga con `DISABLE_TELEMETRY=true`.
  - Problemas conocidos: timeouts en tareas complejas ("break into smaller steps"), el primer comando a veces falla y las descargas de Poly Haven congelan la UI.
  
  [DOC] mismo enlace.
- **Ecosistema** (tema `blender-mcp` en GitHub, oct. 2026):
  - `blenderwright` (MCP con 191 herramientas).
  - `RobLe3/cc-blender-skill`, una skill de Claude Code para Blender 5.x que envía bpy a `execute_blender_code`.
  - `arjun988/blender-skills` (94 skills).
  - `Evolink-AI/Awesome-Blender-Seedance-Workflow-Usecases`, con casos de previs para IA (ver bloque 4).
  
  [DOC] https://github.com/topics/blender-mcp
- **Buenas prácticas de cc-blender-skill:**
  - Referenciar objetos por **nombres estables** con prefijos (`GEO-`), porque las variables de Python no persisten entre llamadas.
  - Comprobar el estado y la salida estándar de cada respuesta.
  - Validar renders leyendo la ruta que devuelve la herramienta.
  - Un **checkpoint visual obligatorio**, porque "numerical checks passing doesn't guarantee the render looks right".
  
  Esa misma skill menciona un **"official Blender Lab MCP" que requiere Blender 5.1+** y enlaza a https://www.blender.org/lab/mcp-server/. [EXPERT] https://github.com/RobLe3/cc-blender-skill

### Inferencias
- **Reparto de papeles.** MCP para explorar ("monta un blockout, enséñame la cámara desde 4 ángulos"). Script `.py` versionado y `blender -b` para lo definitivo. El MCP no deja un artefacto reproducible; el script sí. [INFERENCIA]
- **Fiabilidad de lo que escriba Claude:**
  1. Fijar la versión de Blender en la skill (5.2 LTS o 5.3).
  2. Incluir en la skill una "hoja de API 5.x" con fcurves por channelbag, `compositing_node_group` y `BLENDER_EEVEE`.
  3. Escribir siempre la escena desde cero con nombres estables.
  4. Terminar cada script con una verificación: `look` o un render de prueba a baja resolución.
  
  [INFERENCIA, apoyada en las pruebas]

### Huecos
- **No pude abrir la página del "Blender Lab MCP" oficial** (error del sitio), y no aparece en el blog de desarrolladores (code.blender.org). Su existencia solo la confirma un tercero; no sé qué herramientas expone.
- El repositorio de ahujasid no publica releases con número de versión.

---

## 2. La cámara en Blender para motion y cine

### Takeaway
Para motion premium bastan unas pocas decisiones bien tomadas:
- Focal **35–50 mm** por defecto; angulares solo con intención y teles para producto y compresión.
- DOF con **objeto de foco**, no distancia a mano.
- Movimiento con **Bezier y manejadores Auto Clamped**, o easing explícito.
- Temblor de cámara **sutil y en el target**, o con datos capturados (Camera Shakify).
- Obturador 0,5 (180°).

### Hallazgos

**Focal y sensor**
- **Rangos y sensación** (StudioBinder):

  | Rango | Efecto |
  |---|---|
  | Ojo de pez, 1–23 mm | Distorsión |
  | Angular, 23–35 mm | Expande el espacio, exagera la profundidad y la velocidad de lo que se acerca, disimula el temblor, deforma caras de cerca |
  | Normal, 35–55 mm | Perspectiva natural |
  | Tele, 70 mm y más | Comprime el espacio, aplana rostros, crea intimidad o mirada voyeur, exagera el movimiento lateral y el temblor |

  [EXPERT] https://www.studiobinder.com/blog/focal-length-camera-lenses-explained/
- **Sensor y FOV en Blender.** La focal se puede dar en mm o como FOV. `Sensor Fit` puede ser Auto, Horizontal o Vertical. En **Auto**, el ancho del sensor se aplica a la dimensión mayor del render, así que en **9:16 el "ancho" de 36 mm pasa a ser la vertical**. [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst + [PRACT] probado: con 1080×1920 y 35 mm, el FOV vertical sale 54,43°, idéntico al `yfov` que escribe el exportador glTF.
- **Shift.** El desplazamiento de óptica permite corregir fugas, lo que da un look arquitectónico de tipo "tilt-shift". [DOC] mismo enlace.

**Profundidad de campo**
- **Focus Object** anula la distancia manual. Cuanto más bajo el **F-Stop**, más desenfoque. Con **Blades ≥ 3** el bokeh es poligonal. **Ratio** distinto de 1 da bokeh anamórfico. [DOC] cameras.rst.
- **Valores por defecto:** f/2.8, foco a 10 m. [PRACT] probado.
- **La escala importa.** El desenfoque depende de la escala real: con un objeto de 1 m a 3 m de distancia, f/2.8 ya desenfoca de forma visible. Si la escena está a escala de juguete, hay que subir el f-stop o escalar la escena. [INFERENCIA, física óptica estándar]

**Rigs de cámara**
- **Track To.** Apunta un eje (en cámaras, −Z) al target con un eje "Up". Si el dueño queda casi encima del target, el roll se vuelve inestable y el manual recomienda **Damped Track** en ese caso. Damped Track hace un giro puro "swing" sin controlar el Up. [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/animation/constraints/tracking/track_to.rst · …/damped_track.rst
- **Follow Path.** "Follow Curve" orienta la cámara según la curva. Con "Fixed Position" se anima **Offset Factor de 0 a 1**, lo que da un control limpio del timing con el easing de la curva F; "Animate Path" usa Evaluation Time. [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/animation/constraints/relationship/follow_path.rst
- **Add Camera Rigs** (extensión oficial, v1.9.2 del 22-10-2026, Blender 4.2+):
  - Rigs **Dolly**, **Crane** (con huesos Arm Height y Arm Length) y **2D**.
  - Hueso "Aim", "Set DOF to Aim" y un operador **Set Dolly Zoom** (efecto vértigo).
  - "Swap Lens" mantiene el encuadre al cambiar de focal.
  - Cambio de cámara por marcadores ("Add Marker and Bind").
  
  [DOC] https://extensions.blender.org/add-ons/add-camera-rigs/

**Editor de gráficas (Graph Editor)**
- **Interpolación:** Constant (escalón), Linear ("prevents abrupt changes in value but not in speed") y **Bézier**, que es la de por defecto: suave en valor y velocidad. [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/editors/graph_editor/fcurves/properties.rst
- **Easing:**
  - Ecuaciones Sine, Quad, Cubic, Quart, Quint, Expo y Circ, más los "efectos dinámicos" Back, Bounce y Elastic.
  - Tipos: Ease In, Ease Out y Ease In Out.
  - En **Auto**, las ecuaciones de easing usan Ease In y los efectos dinámicos Ease Out.
  
  [DOC] mismo enlace + enum probado en bpy.
- **Manejadores:** Automatic; **Auto Clamped** (evita sobrepasamientos y curvas en S entre keys); Vector; Aligned; Free. [DOC] mismo enlace.

**Temblor de cámara**
- **Modificador Noise en curvas F:**
  - Blend Type: Replace (−0,5..0,5), Add, Subtract o Multiply.
  - **Scale** es la escala horizontal; más alto significa oscilación más lenta.
  - **Strength** es la amplitud.
  - Phase hace de semilla. Offset desplaza en el tiempo.
  - Depth, Lacunarity y Roughness añaden detalle (Lacunarity y Roughness solo actúan si Depth > 0).
  - Influence y **Restrict Frame Range con Blend In/Out** permiten meter el temblor solo en un tramo.
  
  [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/editors/graph_editor/fcurves/modifiers.rst
- **Camera Shakify** (extensión, v0.5.1 del 07-02-2026, Blender 4.4+): "Add captured camera shake/wobble". Usa temblores **capturados de cámaras reales**, que se pueden apilar y cuya influencia se puede animar. Los datos son CC0. [DOC] https://extensions.blender.org/add-ons/camera-shakify/ · https://github.com/EatTheFuture/camera_shakify
- **Valores de partida para Noise** (escena a escala real, metros y radianes) [INFERENCIA; no hay una fuente con números]:

  | Tipo de cámara | Posición | Rotación | Scale |
  |---|---|---|---|
  | Handheld suave | Strength 0,01–0,03 | 0,003–0,01 rad (≈0,2–0,6°) | 15–30 |
  | Nervioso o acción | Strength 0,05–0,1 | 0,02 rad | 5–10 |
  
  Usar una Phase distinta en cada eje. Probado: con Scale 25 y Strength 0,02 sobre el target funciona sin errores; queda pendiente juzgarlo a ojo.

**Desenfoque de movimiento y motores de render**
- **Motion blur.** El obturador se mide en frames (0,5 equivale a 180°) y la posición puede ser Start, Center o End. En EEVEE el blur por acumulación con "Steps" es más preciso pero cada paso reevalúa la escena; "Max Blur" limita el post-proceso. [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/motion_blur.rst
- **EEVEE desde la 4.2.** Trazado de rayos en espacio de pantalla para todos los BSDF, Virtual Shadow Maps, desplazamiento y mejoras de volumen. Limitaciones: 4096 luces visibles a la vez y sin el modo "Displacement Only". [DOC] https://developer.blender.org/docs/release_notes/4.2/eevee/

### Inferencias
- **EEVEE frente a Cycles para Erik:**
  - **EEVEE** (con GPU) para mograph, texto 3D, previs y todo lo que no necesite caústicas, mucho vidrio ni GI exacta.
  - **Cycles** para producto con reflejos y refracción creíbles, o para planos hero cortos.
  - En el servidor sin GPU donde corre Claude, Cycles CPU con pocas muestras es la opción viable (ver la prueba del bloque 1).
  
  [INFERENCIA + PRACT]
- **Obturador por intención.** 180° (0,5) es "cine". Un obturador corto (0,1–0,25) da un look nítido, staccato, de acción o de spot deportivo. Un obturador largo (más de 0,5) da un look onírico o líquido. [INFERENCIA, convención cinematográfica]

### Huecos
- No he encontrado benchmarks oficiales de tiempos EEVEE frente a Cycles en GPU.
- Las páginas de CG Cookie y Blender Guru sobre cámara o temblor devolvieron error, así que no hay valores "de experto" citables para Noise.

---

## 3. Blender para motion graphics

### Takeaway
El look "premium" en Blender sale de:
1. Gestión de color correcta (AgX o Standard según el caso).
2. Biseles y escala real.
3. Pocos materiales con roughness variada.
4. Luz de estudio grande y suave más un HDRI.
5. Cámara con focal y DOF intencionados.
6. Movimiento con easing.

El look "amateur" es justo lo contrario: luz por defecto, aristas perfectas, materiales planos al 100 % de saturación, 50 mm sin intención y animación lineal.

### Hallazgos
- **Gestión de color** (manual):
  - **Standard:** "Does no extra conversion besides the conversion for the display"; útil para trabajo no fotorrealista o para mantener el aspecto de vídeo ya etalonado.
  - **AgX:** mejora sobre Filmic y desatura los colores muy expuestos.
  - **Filmic:** marcado como obsoleto.
  - **Khronos PBR Neutral:** pensado para fidelidad de color en producto.
  
  [DOC] https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/color_management/displays_views.rst. AgX es el valor por defecto en 5.3. [PRACT] probado.
- **Grease Pencil v3** (reescrito en la 4.3): grupos de capas, assets de pincel, **soporte en Geometry Nodes** y borrador que corta trazos. Desde la 5.2.4/5.3 la "duración de frame" de Grease Pencil está desactivada (los frames finales se convierten en frames normales). [DOC] https://developer.blender.org/docs/release_notes/4.3/grease_pencil/ · https://developer.blender.org/docs/release_notes/5.3/
- **Geometry Nodes.** Hay talleres activos en 2025-2026 (incluido "Geometry Nodes Physics", julio de 2026), y el blog oficial ha publicado sobre Gaussian splats en Blender (octubre de 2026). [DOC] https://code.blender.org/
- **Realismo.** En el repaso de Blender Guru a renders fotorrealistas destacan las imperfecciones pequeñas (malas hierbas en el pavimento), la iluminación natural y la sencillez: pocos elementos bien elegidos. [EXPERT] https://www.blenderguru.com/articles/24-photorealistic-blender-renders

### Inferencias (recetas para la skill)
- **Mograph con colores de marca exactos:** **Standard**, porque AgX desatura y se come los HEX de la marca. **Producto o realismo:** AgX o Khronos PBR Neutral. [INFERENCIA basada en las descripciones del manual]
- **Kit "premium" mínimo** [INFERENCIA, práctica habitual del sector]:
  - **Bevel** con 2–3 segmentos y una anchura de ~1–2 % del tamaño del objeto. Ninguna arista real es perfecta, y el brillo en el canto "vende" el objeto.
  - **Escala real** (1 unidad = 1 m), para que DOF, luz y física se comporten bien.
  - **Materiales:** Principled con roughness entre 0,2 y 0,6 (nunca 0 ni 1 en todo) y saturación contenida. Un acento metálico o de vidrio como mucho.
  - **Iluminación:** de 3 puntos con área grande (key 45° y alta, fill de 1/3–1/4 de la intensidad, rim o contra para recortar), más un HDRI de estudio (Poly Haven, CC0) a baja intensidad para tener reflejos.
  - **Fondo:** ciclorama (plano curvado) o color sólido con un degradado sutil, nada de negro puro.
  - **Texto 3D:** `bpy.ops.object.text_add` con extrusión, bevel y una fuente de marca. Para animar letras se puede convertir a malla o usar Geometry Nodes ("String to Curves").
- **Señales de "Blender amateur"** [INFERENCIA]:
  - Mundo gris por defecto y una sola luz puntual con sombras duras.
  - Cubos y aristas sin bisel.
  - Animación lineal o keys con overshoot no buscado.
  - Cámara a 50 mm a la altura de los ojos y sin intención.
  - DOF exagerado a escala incorrecta.
  - Motion blur desactivado en movimientos rápidos.
  - Materiales "plástico brillante" al 100 % de saturación.
  - Ruido de Cycles sin denoise.
  - Antiguo look "Standard" quemado en las altas luces.

### Huecos
- No pude acceder a contenidos concretos de Default Cube, Ian Hubert, Polyfjord ni CG Cookie (las webs dieron error o no tenían texto útil). Las recetas premium y amateur son síntesis propia sin cita directa.

---

## 4. Blender como previsualización para IA generativa

### Takeaway
En 2026 el flujo **"blockout en Blender, vídeo de referencia y modelo con referencia de vídeo"** ya es práctica real y documentada. Es la forma más fiable de imponer **una cámara concreta** a la IA, porque los controles de cámara nativos de los modelos son **presets** y no trayectorias arbitrarias. La mejor referencia es simple: proxies grises, sin detalle (el detalle "se filtra" como look de CGI).

### Hallazgos

**Controles de cámara nativos = presets**
- **Higgsfield.** Más de 50 presets (Crash Zoom, Dolly Zoom, Crane Over The Head, Whip Pan, FPV Drone, Snorricam, Bullet Time, 360 Orbit, Through Object…). No tiene un editor de trayectoria propia. Por las rutas de los vídeos de muestra (`wan2_5_motion`, `kling_motion`, `minimax_hailuo_motion`) parece que funciona sobre Wan, Kling o Hailuo, pero eso es una inferencia de las URL. [DOC] https://higgsfield.ai/camera-controls
- **Kling (API vía fal).** `camera_control` acepta `down_back`, `forward_up`, `right_turn_forward` y `left_turn_forward`. `advanced_camera_control` acepta `movement_type`: horizontal, vertical, pan, tilt, roll o zoom, más un valor entero. No se documenta el rango. [DOC] https://fal.ai/models/fal-ai/kling-video/v1/standard/text-to-video/api
- **Veo 3.1.** Ofrece:
  - Presets de cámara ("move back, zoom in, move up, move right").
  - **Primer y último frame.**
  - "Ingredients" (referencias de imagen).
  - Extensión de escena.
  - Motion controls para trayectorias de **objetos**, no de cámara.
  
  No admite entrada 3D ni trayectoria de cámara. [DOC] https://deepmind.google/models/veo/

**Modelos que aceptan vídeo de referencia, que es donde entra Blender**
- **Kling O1 video-to-video reference.** "Preserves camera language and motion dynamics" del vídeo de entrada, que debe durar **3–10 s** y ocupar como máximo 200 MB (mp4 o mov). La sintaxis es `@Video1` y se pueden añadir `@Element1-4` e `@Image1-4`. [DOC] https://fal.ai/models/fal-ai/kling-video/o1/video-to-video/reference
- **Kling 2.6 Motion Control.** Transfiere el movimiento de un vídeo a una imagen de personaje. No dice que transfiera la cámara. [DOC] https://fal.ai/models/fal-ai/kling-video/v2.6/standard/motion-control
- **Runway Aleph** (25-07-2025). Edición vídeo a vídeo: genera "any angle of a scene" a partir de un vídeo y cambia estilo, luz y objetos. [DOC] https://runway.com/research/introducing-runway-aleph
- **Luma Modify Video** (02-06-2025, Ray2). Modos **Adhere**, **Flex** y **Reimagine**; conserva estructura, pose y movimiento; máximo 10 s. [DOC] https://lumalabs.ai/blog/news/introducing-modify-video
- **Seedance 2.0** (ByteDance). Entradas de texto, imagen, audio y vídeo, con control "of performance, lighting, shadow, and camera movement" por referencia. No publica límites. [DOC] https://seed.bytedance.com/en/seedance2_0
- **Wan VACE (abierto, ComfyUI).** Admite R2V, V2V y MV2V con vídeo de **profundidad** como control, y primer y último frame (con la condición "length-1 divisible por 4").
  - Tiempos en una RTX 4090: 720×1280 con 81 frames tardó unos **40 min**; 640×640 con 49 frames, unos 7 min.
  - El modelo 14B ocupa ~32 GB y llega a 720p; el 1.3B, ~7 GB, se queda en 480p.
  
  [DOC] https://docs.comfy.org/tutorials/video/wan/vace · https://github.com/ali-vilab/VACE

**Casos reales** (recopilación de EvoLink, que es proveedor de API y por tanto tiene sesgo comercial, pero cada caso enlaza al post original)
- **@reidhannaford** (caso 2, 22-06-2026). Cámara en Blender, frame inicial en Midjourney, y Seedance "tracks the Blender camera move closely". [CASO] https://github.com/Evolink-AI/Awesome-Blender-Seedance-Workflow-Usecases
- **@JoshDaws** (caso 22, 29-06-2026). Claude con Blender MCP monta la referencia de plano en 2–3 minutos. [CASO] mismo enlace.
- **@ComfyUI** (caso 42, 13-07-2026). Flujo oficial: keyframear la cámara en Blender (movimiento, rotación, encuadre) antes de generar con Seedance. [CASO] mismo enlace.
- **@DiabloNemesis** (caso 4) convierte el primer frame del viewport en realista. **@koldo2k** (caso 5) saca varios mundos de un mismo vídeo de referencia. **@ObsceneSelene** (caso 37) prueba si se mantienen los cambios de foco. [CASO] mismo enlace.
- **Límites documentados:**
  - Solo un ~73 % de los cortes planificados cayeron a menos de ±0,6 s (caso 38).
  - Una referencia tosca vuelve robótico el movimiento; el truco es dejar las poses clave y poner en **negro los frames intermedios** (caso 31).
  - La geometría detallada filtra look de CGI; mejor proxies simples (caso 41).
  - La referencia puede restar dinamismo (casos 23 y 26) y suele necesitar refuerzo en el prompt (caso 25).
  - La tela sigue costando (caso 28).
  
  [CASO] mismo enlace.
- **Herramientas cercanas:**
  - **Intangible:** plataforma de sets 3D con control de cámara y un **servidor MCP** para Claude; no dice a qué modelos exporta. [DOC] https://intangible.ai/
  - **ComfyUI-BlenderAI-node:** convierte nodos de ComfyUI en nodos de Blender y usa la cámara o el viewport como entrada; recomienda Blender 3.5–4.0, así que está desfasado para la 5.x. [DOC] https://github.com/AIGODLIKE/ComfyUI-BlenderAI-node

### Flujo paso a paso recomendado [INFERENCIA sobre los casos y la documentación]
1. **Ficha del plano.** Erik y Claude definen duración, fps, focal, movimiento, easing y frames clave en un JSON (ver bloque 6).
2. **Blockout.** Claude genera por script proxies grises (cápsulas y cajas a escala real), suelo y una luz sencilla, más la cámara con su rig. Nada de texturas.
3. **Exportar la referencia.** Render de viewport, Workbench o EEVEE en gris, a la resolución y fps del modelo destino (p. ej. 720p y 5–10 s). Si el modelo trabaja con profundidad (VACE), activar el pase Mist (`view_layer.use_pass_mist`, probado) o sacar la profundidad del vídeo gris con un preprocesador en ComfyUI.
4. **Primer frame con look.** Exportar el frame 1 (y el último) y estilizarlo con un modelo de imagen.
5. **Generar.**
   - **Trayectoria exacta:** modelo con vídeo de referencia (Seedance 2.0, Kling O1 reference, Aleph o Luma Modify en modo Adhere o Flex), más el primer frame y un prompt que describa también el movimiento.
   - **Solo un movimiento estándar:** basta el preset (Higgsfield, Kling o Veo) con primer y último frame sacados de Blender.
6. **Si el movimiento sale robótico,** probar a poner en negro los intermedios (caso 31) o a simplificar los proxies (caso 41).
7. **Componer en Remotion** con los renders de Blender, el vídeo de IA y las capas 2D (bloque 5).

### Huecos
- No he podido verificar los controles de cámara actuales de Runway (Gen-4 y posteriores), porque la ayuda de Runway dio error.
- Seedance 2.0 no publica límites de referencia.
- No he verificado si Kling Motion Control transfiere la cámara.
- Las páginas de casos de X no se han abierto una a una.

---

## 5. Puente con Remotion

### Takeaway
Hay tres vías, de menos a más integrada:
- **(A) Secuencias PNG o EXR, o vídeo con alfa, de Blender** como capas en Remotion. Es lo más robusto y con mejor calidad.
- **(B) `camera.json` horneado por frame desde Blender** que mueve una cámara en `@remotion/three`. Permite poner texto 3D o UI de Remotion **pegados a la cámara de Blender**, como un matchmove virtual.
- **(C) glTF** con cámara y animación para recrear la escena en R3F. Ojo: la animación de la focal **no** llega a three.js sin un plugin.

### Hallazgos

**`@remotion/three`**
- `<ThreeCanvas>` exige `width` y `height`. Las animaciones deben ser declarativas con `useCurrentFrame()`, "(and must)" en lugar de `useFrame()`. Al renderizar fuerza `frameloop='never'`. [DOC] https://www.remotion.dev/docs/three-canvas
- Hay que usar el renderizador GL **`angle`**: `Config.setChromiumOpenGlRenderer('angle')` o `chromiumOptions.gl` en SSR. Dentro del canvas, `<Sequence layout="none">`. Existe también `<ThreeWebGPUCanvas>`. `useVideoTexture()` y `useOffthreadVideoTexture()` están **obsoletos**; ahora se recomienda `@remotion/media`. [DOC] https://www.remotion.dev/docs/three
- `@remotion/three` 4.0.547 tiene como peer `@react-three/fiber >=8` y `three >=0.137`. [PRACT] `npm view`.

**Imágenes y vídeo**
- `<Img>` espera a que la imagen cargue antes de renderizar el frame; `maxRetries` vale 2 por defecto. [DOC] https://www.remotion.dev/docs/img
- El `<Video>` de `@remotion/media` admite alfa (necesita WebGL; si no, cae a `<OffthreadVideo>`). `<OffthreadVideo transparent>` es la otra opción para alfa. [DOC] https://www.remotion.dev/docs/videos/transparency

**glTF**
- **Prueba propia en Blender 5.3:**
  - El exportador escribe la cámara con `yfov` y **muestrea por frame** la animación, incluida la rotación que produce **Track To**, así que la restricción queda horneada.
  - La **animación de la focal se pierde** salvo que se active `export_pointer_animation=True`, que la escribe como `KHR_animation_pointer` sobre `/cameras/0/perspective/yfov`.
  
  [PRACT] probado.
- `GLTFLoader` de three.js **no** soporta `KHR_animation_pointer` de serie: requiere el plugin `needle-tools/three-animation-pointer`. [DOC] https://threejs.org/docs/pages/GLTFLoader.html

**Conversión de ejes** (probado y validado contra el exportador glTF)
- Hay que **premultiplicar** la matriz de mundo de la cámara por una rotación de −90° en X: `R @ cam.matrix_world`. Conjugar el cuaternión (`r q r⁻¹`) da una orientación **incorrecta** para cámaras: lo comprobé numéricamente.
- Mi JSON coincide con el glTF tanto en `yfov` (54,4322°) como en el cuaternión, salvo milésimas debidas al ruido del target.

[PRACT] probado.

### Snippet 1: bpy (Blender 5.x), cámara con Track To, easing, temblor y exportación JSON y glTF
Probado en bpy 5.3.0. Uso: `blender -b --factory-startup --python-exit-code 1 -P cam_rig.py -- ./out`

```python
import bpy, math, json, sys, os
from mathutils import Matrix
from bpy_extras import anim_utils

out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "/tmp"
bpy.ops.wm.read_factory_settings(use_empty=True)          # ojo: sin World ni luces
sc = bpy.context.scene
sc.render.fps = 30; sc.frame_start, sc.frame_end = 1, 90  # MISMO fps que Remotion
sc.render.resolution_x, sc.render.resolution_y = 1080, 1920

target = bpy.data.objects.new("CAM_target", None); sc.collection.objects.link(target)
target.location = (0, 0, 1)
cd = bpy.data.cameras.new("CAM_main"); cd.lens = 35
cd.dof.use_dof = True; cd.dof.focus_object = target; cd.dof.aperture_fstop = 2.8
cam = bpy.data.objects.new("CAM_main", cd); sc.collection.objects.link(cam); sc.camera = cam
tt = cam.constraints.new('TRACK_TO'); tt.target = target
tt.track_axis, tt.up_axis = 'TRACK_NEGATIVE_Z', 'UP_Y'

for f, loc, mm in [(1, (5, -7, 2.2), 35), (90, (1.6, -2.4, 1.4), 50)]:   # push-in + cambio de focal
    cam.location = loc; cam.keyframe_insert("location", frame=f)
    cd.lens = mm;      cd.keyframe_insert("lens", frame=f)

def fcurves(idb):  # 5.x: Action.fcurves NO existe -> channelbag del slot
    ad = idb.animation_data
    return anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot).fcurves

for fc in list(fcurves(cam)) + list(fcurves(cd)):
    for kp in fc.keyframe_points:
        kp.interpolation = 'BEZIER'                     # o 'SINE'/'CUBIC'... + kp.easing='EASE_IN_OUT'
        kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'

target.keyframe_insert("location", frame=1)             # temblor handheld en el target
for i, fc in enumerate(fcurves(target)):
    m = fc.modifiers.new('NOISE'); m.scale = 25; m.strength = 0.02; m.phase = 10 + i * 7

def vfov_deg(c, s):  # FOV vertical para three.js (respeta sensor_fit y 9:16)
    rx, ry = s.render.resolution_x * s.render.pixel_aspect_x, s.render.resolution_y * s.render.pixel_aspect_y
    fit = c.sensor_fit
    if fit == 'AUTO': fit = 'HORIZONTAL' if rx >= ry else 'VERTICAL'; size = c.sensor_width
    else: size = c.sensor_width if fit == 'HORIZONTAL' else c.sensor_height
    sh = size * ry / rx if fit == 'HORIZONTAL' else size
    return math.degrees(2 * math.atan(sh / (2 * c.lens)))

R = Matrix.Rotation(-math.pi / 2, 4, 'X')               # Z-up -> Y-up (premultiplicar)
frames = []
for f in range(sc.frame_start, sc.frame_end + 1):
    sc.frame_set(f)
    m = R @ cam.matrix_world; q = m.to_quaternion()
    frames.append({"f": f - sc.frame_start, "pos": [round(v, 5) for v in m.translation],
                   "quat": [round(v, 6) for v in (q.x, q.y, q.z, q.w)], "fov": round(vfov_deg(cd, sc), 4)})
os.makedirs(out, exist_ok=True)
json.dump({"fps": sc.render.fps, "frames": frames}, open(os.path.join(out, "camera.json"), "w"))
bpy.ops.export_scene.gltf(filepath=os.path.join(out, "scene.glb"), export_cameras=True,
                          export_pointer_animation=True)   # focal animada como KHR_animation_pointer
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out, "shot.blend"))
```

### Snippet 2: Remotion + R3F, cámara desde Blender (JSON) o cámara declarativa con `interpolate`
Pasa `tsc --strict` con remotion 4.0.547, fiber 9 y three 0.187. Ojo: `makeDefault` **no** existe en el `<perspectiveCamera>` nativo de R3F (es de drei); comprobado con tsc. Aquí se usa `useThree().set`.

```tsx
import React, {useLayoutEffect, useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {z} from 'zod';
import * as THREE from 'three';
import shot from '../camera.json'; // de cam_rig.py, ya en Y-up

const data = shot as {fps: number; frames: {pos: number[]; quat: number[]; fov: number}[]};
const useDefaultCamera = (cam: THREE.PerspectiveCamera) => {
  const set = useThree((s) => s.set); const size = useThree((s) => s.size);
  useLayoutEffect(() => { cam.aspect = size.width / size.height; cam.updateProjectionMatrix(); set({camera: cam}); }, [cam, set, size]);
};

const BlenderCamera: React.FC = () => {            // 1 frame Remotion = 1 frame Blender
  const frame = useCurrentFrame();
  const cam = useMemo(() => new THREE.PerspectiveCamera(50, 1, 0.1, 1000), []);
  useDefaultCamera(cam);
  const k = data.frames[Math.min(frame, data.frames.length - 1)];
  cam.position.set(k.pos[0], k.pos[1], k.pos[2]);
  cam.quaternion.set(k.quat[0], k.quat[1], k.quat[2], k.quat[3]);
  cam.fov = k.fov; cam.updateProjectionMatrix();
  return null;
};

const vec3 = z.tuple([z.number(), z.number(), z.number()]);
export const camSchema = z.object({from: vec3, to: vec3, target: vec3, fovFrom: z.number(), fovTo: z.number()});

const InterpCamera: React.FC<z.infer<typeof camSchema>> = ({from, to, target, fovFrom, fovTo}) => {
  const frame = useCurrentFrame(); const {durationInFrames} = useVideoConfig();
  const cam = useMemo(() => new THREE.PerspectiveCamera(50, 1, 0.1, 1000), []);
  useDefaultCamera(cam);
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  cam.position.set(...(from.map((v, i) => v + (to[i] - v) * t) as [number, number, number]));
  cam.fov = fovFrom + (fovTo - fovFrom) * t; cam.updateProjectionMatrix();
  cam.lookAt(target[0], target[1], target[2]);
  return null;
};
// <ThreeCanvas width={width} height={height}>{source==='blender' ? <BlenderCamera/> : <InterpCamera {...p}/>}…</ThreeCanvas>
```

### Snippet 3: secuencia de PNG de Blender en Remotion
```tsx
// Blender: -o //renders/shot01/frame_#### -F PNG  (con RGBA si va con alfa)  -> frame_0001.png...
const frame = useCurrentFrame();
<Img src={staticFile(`renders/shot01/frame_${String(frame + 1).padStart(4, '0')}.png`)} />
```
El `+ 1` es porque Blender empieza en el frame 1 y Remotion en el 0. [INFERENCIA, compatible con la documentación de `<Img>` y de `-o`]

### Inferencias
- **Sincronía:**
  1. El mismo fps en los dos lados. Blender trae 24 fps por defecto (probado) y Remotion se fija en `<Composition fps>`.
  2. Desfase fijo `frame_blender = frame_remotion + frame_start`.
  3. La misma resolución y relación de aspecto, para que el FOV coincida.
  4. Exportar el FOV **vertical**.
- **Calidad:** para planos "hero", renderizar en Blender y componer en Remotion. El R3F de Remotion se reserva para elementos ligeros (texto 3D, tarjetas, UI flotante) que deben moverse con la cámara de Blender.
- **EXR en el navegador:** un EXR no se puede mostrar directamente en `<Img>`. Para Remotion: PNG de 16 bits RGBA o vídeo con alfa (ProRes 4444 o WebM con alfa); el EXR queda para etalonaje fuera. Comprobar en la documentación de `@remotion/media` qué códecs con alfa admite el `<Video>` actual.

### Huecos
- No he probado un render real de Remotion con `--gl=angle` en este entorno; solo la comprobación de tipos.
- No he verificado la carga de `.glb` con `useGLTF` y `AnimationMixer.setTime(frame/fps)` dentro de Remotion.

---

## 6. Interfaz de control de cámara

### Takeaway
No compensa construir un "Theatre.js casero" ni depender de Theatre.js. La arquitectura viable para Erik es: **una ficha de plano en JSON como fuente única de verdad**, editable desde **Remotion Studio** (props con zod más el nuevo editor de keyframes de `interpolate`), con **Blender como motor de render y previs**, y **Blender GUI con Camera Rigs** como interfaz manual para el ajuste fino cuando haga falta "tocar" la cámara.

### Comparativa

| Opción | Estado verificado | Pros | Contras |
|---|---|---|---|
| **Theatre.js + @theatre/r3f** | Último publish **0.7.2, mayo de 2024**. El repositorio dice "temporarily moved development to a private repo" y "1.0 around the corner". `@theatre/r3f` pide `@react-three/fiber ^8`, **incompatible con fiber 9**. Studio es AGPL y el core Apache. `sequence.position` se puede fijar en segundos, así que podría sincronizarse con `useCurrentFrame`. [DOC] https://github.com/theatre-js/theatre · https://www.theatrejs.com/docs/latest/api/core · `npm view` | La mejor UX de timeline y curvas para R3F; exporta `state.json` | Proyecto parado hace 2,5 años; obliga a fijar R3F 8 y React 18; integrarlo con Remotion es artesanal |
| **Remotion Studio (props con zod e interactividad)** | Desde la v4.0.516 deduce controles de `defaultProps` en línea; zod para validar y para controles a medida; `@remotion/zod-types` (zColor, zTextarea, zMatrix); **guardar los props en el código** si `defaultProps` es un literal en línea; en Studio se pueden **crear y editar keyframes y easing** de `interpolate()` en línea y arrastrar, escalar y rotar elementos `Interactive`. [DOC] https://www.remotion.dev/docs/schemas · https://www.remotion.dev/docs/studio/interactivity-best-practices · https://www.remotion.dev/docs/animating-properties.md | Ya está en su stack; los cambios se escriben en el código, que Claude puede leer; render determinista | Sin gizmo 3D: la cámara se edita con números (from, to, target, fov), no arrastrando en el viewport. No he verificado que el editor de keyframes funcione con props dentro de `<ThreeCanvas>` |
| **leva** | v0.10.1 (oct. 2025); el repositorio avisa "under heavy development"; no documenta guardar en archivo. [DOC] https://github.com/pmndrs/leva | Paneles rapidísimos para ajustar en una vista R3F | No persiste ni anima; sin timeline |
| **Spline** | `@splinetool/react-spline` (MIT): `findObjectByName`, `emitEvent` y `setZoom`; no documenta cómo situar la línea de tiempo en un instante exacto. [DOC] https://github.com/splinetool/react-spline | Editor 3D web muy amable | Sin control determinista por frame, así que no encaja con el render de Remotion |
| **Blender como interfaz** | Camera Rigs (Dolly, Crane, 2D, Dolly Zoom), Camera Shakify, Graph Editor completo; script que exporta `camera.json` y `.glb` (probado). [DOC] enlaces de los bloques 2 y 5 | La mejor herramienta de cámara del lote; la misma escena sirve para render, previs IA y Remotion | Curva de aprendizaje; Erik tiene que abrir Blender |

### Arquitectura recomendada [INFERENCIA apoyada en las pruebas]

```
shot.json  (fuente de verdad: fps, duración, aspect, keys de cámara {frame, pos, target, lens, easing}, shake, DOF)
   │
   ├─► Remotion Studio  ── <Composition schema={shotSchema} defaultProps={…literal…}>
   │      vista previa R3F en vivo: proxies + InterpCamera (interpolate/Easing)
   │      Erik ajusta números, keyframes y easing en Studio → se guardan en el código
   │
   ├─► Claude: build_shot.py (lee shot.json) → blender -b --factory-startup -P build_shot.py -- shot.json out/
   │      ├─ shot.blend (abrir en Blender GUI si Erik quiere afinar con Camera Rigs)
   │      ├─ previs_gris.mp4 / mist (→ Seedance/Kling O1/Aleph/Luma/VACE)
   │      ├─ frame_first.png / frame_last.png (→ estilizar → first/last frame en Veo/Kling)
   │      ├─ renders/shot01/frame_####.png (EEVEE/Cycles, RGBA)
   │      └─ camera.json (Y-up, fov vertical) + scene.glb
   │
   └─► Remotion (montaje final): <Img> secuencias / <Video> IA / <ThreeCanvas><BlenderCamera/> para texto 3D pegado a cámara
```

- **Ida y vuelta.** Si Erik afina en Blender GUI, el mismo exportador regenera `camera.json` y Remotion lo recoge. Si afina en Remotion Studio, Claude vuelve a lanzar Blender con `shot.json`. Para evitar conflictos, la regla es que **gana el último que exporta** y Claude avisa.
- **Por qué esta arquitectura:**
  - Mantiene todo en herramientas vivas (Blender 5.x y Remotion 4.0.5xx).
  - Todo es texto legible para Claude: JSON y `.py`.
  - El render es determinista.
  - Ninguna dependencia está abandonada.
  - El paso a la IA es directo: el blockout gris es justo la referencia que mejor funciona según los casos.
- **Fase 2, opcional:** un panel propio en Remotion Studio, o una página Vite con R3F, `TransformControls` y `CameraControls` de drei para arrastrar la cámara y guardar las keys en `shot.json`. Solo si los controles numéricos se quedan cortos.

### Huecos
- No he probado el editor de keyframes de Remotion Studio con cámaras 3D.
- Desconozco si Theatre.js 1.0 saldrá ni cuándo.

---

## Chuleta: 28 reglas para la skill

1. **Producción = script.** `blender -b --factory-startup --python-exit-code 1 -P script.py -- args`, con `-a` o `-f` **al final**.
2. **Exploración = MCP** (mcp-for-blender), con `look` en modo `camera` o `frames` para verificar. Guardar antes y no exponer el puerto 9876.
3. **En Blender 5.x nunca `action.fcurves`;** usar `anim_utils.action_get_channelbag_for_slot(action, slot).fcurves`.
4. **Compositor en 5.x:** `scene.compositing_node_group`, no `scene.node_tree`. EEVEE es `'BLENDER_EEVEE'`.
5. **Escena desde cero:** crear World y luces (si no, render negro) y usar nombres estables con prefijo (`CAM_`, `GEO_`, `LGT_`).
6. **Cerrar cada script con verificación visual:** un render a 25 % de un frame clave, mirado antes de dar el plano por bueno.
7. **El mismo fps en Blender y Remotion** (Blender trae 24 por defecto). Recordar el desfase: Blender empieza en 1 y Remotion en 0.
8. **Exportar el FOV vertical** y respetar `sensor_fit`: en 9:16 con AUTO, los 36 mm pasan a la vertical.
9. **Z-up a Y-up:** premultiplicar la matriz de mundo por una rotación de −90° en X. No conjugar el cuaternión.
10. **glTF hornea Track To pero no la focal;** para la focal hace falta `export_pointer_animation=True` más el plugin de needle en three, o mejor `camera.json`.
11. **En Remotion,** animar con `useCurrentFrame` (nunca `useFrame`); `<ThreeCanvas>` con width y height; GL `angle`.
12. **Focal por defecto 35–50 mm.** 24–28 mm para espacio y energía. 85–135 mm para producto, retrato y compresión. Ojo de pez solo como efecto.
13. **DOF con Focus Object** (un empty), escena a **escala real** y f-stop de 2–4 para un desenfoque creíble.
14. **Para cámara "aim":** Track To con −Z y Up Y. Si la cámara pasa por encima del target, Damped Track.
15. **Trayectorias:** Follow Path con Fixed Position y Offset Factor 0→1, con easing en esa curva.
16. **Movimiento premium:** Bezier con **Auto Clamped**, sin overshoot salvo que se busque. Ease-in-out en arranques y paradas. Lineal solo en loops.
17. **En Remotion,** `Easing.bezier(0.65,0,0.35,1)` como ease-in-out "cine" y siempre `extrapolate*: 'clamp'`.
18. **Temblor:** Camera Shakify (capturado de cámaras reales) o Noise sutil en el target o en un empty padre, con Phase distinta por eje. Restrict Frame Range con blend para meterlo por tramos.
19. **Obturador 0,5** como base, más corto para un look nervioso y más largo para uno onírico. Activar el motion blur en movimientos rápidos.
20. **EEVEE con GPU** para mograph y previs. **Cycles** para hero y producto. **Sin GPU (servidor), Cycles CPU** con pocas muestras y denoise.
21. **Colores de marca exactos: Standard.** Realismo: AgX. Producto: Khronos PBR Neutral. Filmic está obsoleto.
22. **Kit premium:** bevel en todo, roughness variada, área grande como key, contra para recortar, HDRI de estudio suave y ciclorama. Nada de negro puro ni de luz puntual sola.
23. **Para previs IA,** blockout con **proxies grises simples:** el detalle se filtra como CGI.
24. **Trayectoria exacta en IA:** vídeo de referencia (Seedance 2.0, Kling O1 reference de 3–10 s, Aleph, Luma Modify en Adhere o Flex). **Movimiento estándar:** basta un preset (Higgsfield, Kling, Veo) con primer y último frame sacados de Blender.
25. **Si la IA copia un movimiento robótico,** dejar las poses clave y poner en negro los intermedios, o simplificar la referencia. Reforzar siempre el movimiento en el prompt.
26. **Calidad final:** renders de Blender (PNG RGBA o vídeo con alfa) como capas en Remotion. R3F solo para elementos ligeros pegados a la cámara exportada.
27. **Interfaz:** `shot.json` como fuente de verdad, editada en Remotion Studio (zod, `defaultProps` en línea y keyframes de `interpolate` editables) y renderizada en Blender. Blender GUI con Camera Rigs para el ajuste fino.
28. **Evitar Theatre.js** (parado desde mayo de 2024 e incompatible con R3F 9) y **Spline** para render frame a frame. leva solo para ajustes rápidos efímeros.

---

## Fuentes principales
- Manual de Blender (rst): render.rst, arguments.rst, cameras.rst, modifiers.rst, properties.rst, track_to.rst, damped_track.rst, follow_path.rst, motion_blur.rst, displays_views.rst (projects.blender.org/blender/blender-manual)
- Notas de versión de Blender: 4.2 EEVEE, 4.3 Grease Pencil, 4.4 Animation, 5.0, 5.0 Python API, 5.2, 5.3 (developer.blender.org)
- Extensiones: https://extensions.blender.org/add-ons/add-camera-rigs/ · https://extensions.blender.org/add-ons/camera-shakify/
- MCP: https://github.com/ahujasid/blender-mcp · https://github.com/topics/blender-mcp · https://github.com/RobLe3/cc-blender-skill
- Remotion: /docs/three, /docs/three-canvas, /docs/schemas, /docs/passing-props.md, /docs/animating-properties.md, /docs/studio/interactivity-best-practices, /docs/img, /docs/videos/transparency, /docs/media
- three.js GLTFLoader: https://threejs.org/docs/pages/GLTFLoader.html
- Theatre.js: https://github.com/theatre-js/theatre · https://www.theatrejs.com/docs/latest/api/core
- IA: https://higgsfield.ai/camera-controls · fal.ai (Kling v1 T2V, Kling O1 reference, Kling 2.6 motion control) · https://deepmind.google/models/veo/ · https://runway.com/research/introducing-runway-aleph · https://lumalabs.ai/blog/news/introducing-modify-video · https://seed.bytedance.com/en/seedance2_0 · https://docs.comfy.org/tutorials/video/wan/vace · https://github.com/ali-vilab/VACE
- Casos: https://github.com/Evolink-AI/Awesome-Blender-Seedance-Workflow-Usecases
- Experto: https://www.studiobinder.com/blog/focal-length-camera-lenses-explained/ · https://www.blenderguru.com/articles/24-photorealistic-blender-renders
- Pruebas propias: bpy 5.3.0 (PyPI) y remotion 4.0.547 + @react-three/fiber 9 + three 0.187 con `tsc --strict`.
