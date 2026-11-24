# AE pro: cámara, zooms, 3D y acabado → Remotion

Ronda 3. **Amplía** `Dirección creativa composición y motion/after_effects_motion.md` (graph editor, influencias, overshoot de Ebberts, motion blur 180°, tipografía, mapeo AE→bezier, `spring()`), sin repetirlo. Erik ya tiene en `video-historia-remotion`: cámara dentro de la foto con `bezier(0.83,0,0.17,1)` en 13-14 f a 24 fps, blur proporcional a la velocidad (0,16/px, tope 9 px), corte de acercamiento, empuje 1,8 %/s, grano 0,16 y viñeta.

**Etiquetas:** [DOC] documentación oficial · [EXPERT] Ebberts, School of Motion (SoM), ProVideo Coalition (PVC), paper académico · [PRACT] tutorial secundario o medida de Erik · [INFERENCIA] deducción mía (mucha es geometría comprobable).

**Método:** WebSearch estaba deshabilitado; ~55 WebFetch sobre URLs directas y buscadores internos (sitemap de SoM, búsquedas de PVC y PremiumBeat). No cargaron: Shake Generator, Ease and Wizz, wiggle de motionscript, viñeta de Lumetri.

---

## 1. Cámara: nodos, rig, focal, dolly zoom, DOF, parallax, shake

### Takeaway
La cámara de AE se reduce a un número, **Zoom (px)**: distancia del objetivo al plano de imagen. Con la cámara por defecto a −Zoom, una capa a profundidad z se ve a escala `Zoom/(Zoom+z)` y un movimiento lateral Δ la desplaza `Δ·Zoom/(Zoom+z)`. De ahí sale todo el parallax. Los pros usan cámara one-node colgada de nulls, enfocan por proyección sobre el eje de cámara y tiemblan la cámara a ~1 Hz con poca amplitud. El dolly zoom es mantener `Zoom/distancia` constante; en CSS equivale a animar solo `perspective`.

### Hallazgos con cita
- [DOC] One-node se orienta sobre sí misma; two-node mira a un point of interest (= Auto-Orient "Towards POI"), por defecto en el centro de la comp. Preset por defecto **50 mm**; el preset fija Angle of View, Zoom, Focus Distance, Focal Length y Aperture. Zoom = distancia lente-plano de imagen. No hay herramienta "Dolly": Track Z mueve a lo largo de la línea al POI. — [Adobe: Cameras](https://helpx.adobe.com/after-effects/using/cameras-lights-points-interest.html)
- [EXPERT] Dejar **Film Size en 36 mm**. Two-node para revelados de logo y órbitas a un objetivo; one-node para movimiento realista, emparentada a un null (todo cambio en el null afecta globalmente a la cámara). Herramienta unificada: izquierdo órbita, derecho Track Z, central Track XY. — [SoM: Cameras](https://www.schoolofmotion.com/blog/cameras-after-effects)
- [EXPERT] Separar XYZ (desde CS4) permite grúa (Y) y dolly (Z) con curvas distintas; antes se hacía con jerarquías de nulls. — [PVC: 3D Camera Tricks](https://www.provideocoalition.com/after-effects-classic-course-3d-camera-tricks-2/)
- [DOC] Orientation va por el camino más corto; Rotation sigue el valor por eje y puede dar varias vueltas: para órbitas largas, animar Rotation. — [Adobe: 3D layers](https://helpx.adobe.com/after-effects/using/3d-layers.html). `lookAt(from, at)` da una Orientation que apunta a un punto (desactivar auto-orient). — [Adobe: Expression reference](https://helpx.adobe.com/after-effects/using/expression-language-reference.html)
- [DOC] DOF: Focus Distance (plano de foco), Aperture (mayor = más desenfoque, ligada a F-Stop), **Blur Level 100 % = desenfoque "natural"**. Comandos Link Focus Distance to POI / to Layer (expresión) y Set Focus Distance to Layer (una vez). — [Adobe: Cameras](https://helpx.adobe.com/after-effects/using/cameras-lights-points-interest.html)
- [DOC] Por expresión, Zoom, Focus Distance y Aperture van en **píxeles**; iris: `irisShape` 1-10, roundness %, aspect 1-100, diffraction fringe 1-100; highlight gain/saturation 1-100, threshold 0-1 en 32 bpc. — [AE Expressions: Camera](https://ae-expressions.docsforadobe.dev/objects/camera/)
- [EXPERT] Autofoco de Ebberts: la cámara enfoca un **plano**, no una esfera, así que `length()` falla fuera de eje. Proyectar:
  ```js
  target = thisComp.layer("target");
  v1 = target.toWorld(target.anchorPoint) - toWorld([0,0,0]);
  v2 = toWorldVec([0,0,1]);
  dot(v1,v2)
  ```
  — [motionscript: auto focus](https://www.motionscript.com/design-guide/auto-focus.html)
- [EXPERT] El DOF "es fácil de pasar": debe parecerse a lo que haría una cámara real. Delatan lo falso los bordes desenfocados que no dejan ver lo de detrás, el banding por rango de profundidad comprimido y el grano de renders con pocas muestras. Las focales cortas dan **más** profundidad de campo. En Lenscare, radio bajo y subir "a unos 5". — [SoM: Depth of field](https://www.schoolofmotion.com/blog/depth-of-field-cinema-4d-nuke-after-effects)
- [DOC] Camera Lens Blur: radio máx **500**; iris con diffraction fringe (100 = halo natural, 500 = energía en el anillo); highlight gain/threshold/saturation (0 = blanco, 100 = color); *Use Linear Working Space* en 32 bpc. — [Adobe: Blur & Sharpen](https://helpx.adobe.com/after-effects/using/blur-sharpen-effects.html)
- [EXPERT] Receta 2.5D de SoM con una foto:
  - recortes con Content-Aware tras **expandir la selección 2 px**;
  - suelo X −90°; **cielo a Z≈15.000** y reescalado; cámara **50 mm** avanzando en Z con algo de rotación X;
  - **null con wiggle ~1/s y ~2 unidades emparentado a la cámara**;
  - Optics Compensation para parallax de borde; channel blur **1 px** en el alfa; **light wrap con fast blur ~30 px**.
  - — [SoM: 3D photo](https://www.schoolofmotion.com/blog/3d-photo-after-effects)
- [DOC] **Collapse Transformations** expone las capas 3D de una precomp a la cámara y luces de fuera y conserva resolución; sin él, la precomp es una imagen plana. — [Adobe: Precomposing](https://helpx.adobe.com/after-effects/using/precomposing-nesting-pre-rendering.html)
- [EXPERT] Shake: **wiggle(1, 25) = "shake sutil"**; sliders Frequency/Amplitude en un null "Controller" con keys; para varias capas, adjustment + efecto Transform con el wiggle; sobre fotos, escalar para no ver bordes. — [SoM: camera shake](https://www.schoolofmotion.com/blog/how-to-simulate-camera-shake-adobe-after-effects)
- [EXPERT] Dolly zoom: Irmin Roberts para *Vertigo* ("trombone shot", "contra zoom"). Mantiene el ancho del sujeto (`w = 2·d·tan(FOV/2)`). Significa vértigo, toma de conciencia (Brody en *Jaws*), miedo o epifanía, o transición entre focales sin corte. — [Wikipedia: Dolly zoom](https://en.wikipedia.org/wiki/Dolly_zoom)

### Inferencias
- [INFERENCIA, geometría] **Zoom (px) = ancho de comp × focal / 36.** 1920 px: 35 mm → 1867; 50 mm → **2667**; 85 mm → 4533. Comprobación: el cielo de SoM a Z=15.000 se ve a 2667/17.667 ≈ 15 %, así que necesita ≈660 % para casar.
- [INFERENCIA, geometría] **Parallax** con Zoom 2667 y 100 px de movimiento lateral de cámara:

  | Z (AE) | Mov. en pantalla | Escala para conservar tamaño | Uso |
  |---|---|---|---|
  | −800 | 143 px | 70 % | Primer término recortado |
  | 0 | 100 px | 100 % | Sujeto / referencia |
  | +1300 | 67 px | 149 % | Fondo cercano |
  | +2667 | 50 px | 200 % | Fondo |
  | +8000 | 25 px | 400 % | Cielo |

  Un 30-50 % de diferencia de velocidad entre sujeto y fondo ya se lee como 3D. Más de 2× entre capas contiguas destapa recortes y huecos del clean plate (umbral mío, validar).
- [INFERENCIA] **Focal:** 85-135 mm comprime el parallax (look documental); 24-35 mm lo exagera y deforma caras; DOF fuerte en gran angular delata.
- [INFERENCIA] **Rig estándar**: `CAM_POS` (traslación/dolly) > `CAM_ORBIT` (null en el POI, rotación) > `CAM_SHAKE` (wiggle) > cámara one-node. Cada curva se edita sola y el shake no contamina el recorrido.
- [INFERENCIA] **Dolly zoom:** `Zoom(t) = Zoom0·d(t)/d0`; 1,5-4 s (sin fuente de duración).
- [INFERENCIA] **Shake creíble:** posición a 0,8-1,5 Hz y 2-8 px, rotación Z a la misma frecuencia con 0,2-0,6° y otra semilla, nunca en escala. Para impactos, un pico de 6-10 f a 8-12 Hz con caída exponencial y vuelta a la deriva. La alta frecuencia sostenida delata.

### Huecos
Parámetros de Shake Generator (no cargó). Valores sourced de Aperture/Blur Level. Duración típica del dolly zoom. Umbrales de parallax con recortes. DOF del renderer Advanced 3D.

---

## 2. Zooms: punch-in, Ken Burns, transiciones, smooth zoom, ease exponencial

### Takeaway
El tamaño se percibe en escala **logarítmica**: un zoom lineal parece frenar al entrar y acelerar al salir. El zoom bien hecho interpola el log de la escala (Exponential Scale de AE; van Wijk & Nuij). Para viajar entre dos puntos lejanos de una foto, lo óptimo es **alejarse-pan-acercarse**, no un pan recto a zoom alto. Las transiciones de zoom viven de **cortar en el pico de velocidad** tapado por blur y de devolver el movimiento en el plano entrante. Un zoom es motivado si lo pide la voz, la información o la emoción; es tic si va por calendario.

### Hallazgos con cita
- [EXPERT/académico] *Smooth and efficient zooming and panning* (2003):
  - suavidad = tasa de cambio percibida constante; en zoom puro el ancho cambia exponencialmente, `w(s)=w0·exp(ρs)`;
  - camino simple: alejarse-pan-acercarse con anchura pico `wm = max(w0, w1, ρ²·Δu/2)`; el óptimo es una curva continua (`cosh`);
  - los usuarios prefirieron **ρ ≈ 1,42 (≈√2)**, con mucha variación.
  - — [van Wijk & Nuij](https://vanwijk.win.tue.nl/zoompan.pdf)
- [EXPERT] AE trae el keyframe assistant **Exponential Scale** (junto a Motion Sketch, Smoother y Time-Reverse). — [PVC: CMG Hidden Gems 5](https://www.provideocoalition.com/creating_motion_graphics_with_after_effects_hidden_gems_chapter_5_-_animati/)
- [PRACT] Zoom transition: preset típico **100→120 %**; keys en el último fotograma del clip saliente y **3-4 f antes**; **shutter 360°** en ese tramo; ease; el clip entrante hace el zoom inverso. — [PremiumBeat: zoom in Premiere](https://www.premiumbeat.com/blog/zoom-in-premiere-pro/)
- [PRACT] Crash zoom con dos planos: null que emparenta WS y CU, animación de **1 s**, **velocidad máxima en el fundido de 1-2 f** del WS, motion blur con shutter alto, Motion Tile (550, mirror) para tapar bordes, shake opcional. — [PremiumBeat: crash zoom](https://www.premiumbeat.com/blog/create-crash-zoom-from-two-shots/)
- [PRACT] Semántica: crash zoom = énfasis o personaje imponente; acercarse = foco o revelación; **alejarse lento = aislamiento** ("cuanto más lento, más conscientes de la distancia"); punch-in = ritmo, revelación o temor creciente. — [PremiumBeat: zoom & punch-in](https://www.premiumbeat.com/blog/mastering-zoom-and-punch-in/)
- [EXPERT] El infinite zoom es una de las seis transiciones esenciales; truco: hacer zoom hacia **subencuadres** (ventana, pantalla con cursor). Match cut en el momento de máxima velocidad. — [SoM: six transitions](https://www.schoolofmotion.com/blog/six-essential-motion-design-transitions-tutorial)
- [EXPERT] Ken Burns (con antecedentes en 1936-1959): sirve para mover fotos sin metraje, **ir de un sujeto a otro dentro de la foto**, simular parallax y recortar a un detalle antes de panear. Solo dice "lento", sin cifras. — [Wikipedia: Ken Burns effect](https://en.wikipedia.org/wiki/Ken_Burns_effect)

### Inferencias
- [INFERENCIA] **Zoom exponencial:** `s = s0·(s1/s0)^e(t)`. El 1,8 %/s de Erik es `1.018^t`: 4 s → ×1,074, 8 s → ×1,153. Por debajo de ×1,2 casi no se distingue del lineal; a partir de ×2 se nota mucho.
- [INFERENCIA] **Zoom anclado:** escalar alrededor del punto P y llevar P al centro con la misma curva. Sin eso aparece la deriva lateral amateur.
- [INFERENCIA] **De "Gates" a "Allen" en la misma foto:** si la separación supera ~1,5 encuadres, alejarse-pan-acercarse en un solo gesto; si están cerca, pan con ease.
- [INFERENCIA] **Punch-in de corte:** +15-30 % seco, como mucho 2-4 f de asentamiento. Con menos de un 10 % parece un error de encuadre.
- [INFERENCIA] **Zoom-through:** 6-10 f en total (3-5 de salida con ease-in hasta ×1,3-2 y 3-5 de entrada con ease-out), corte en el pico, blur de 180-360° solo ahí y mismo centro a ambos lados.
- [INFERENCIA] **El smooth zoom de redes** (packs de transiciones de vídeos de viajes, ~2017-19; origen sin fuente) abarata cuando va en todas las uniones, su centro no coincide con nada, el blur mancha el color o se combina con shake, glitch y RGB a la vez. Funciona cuando une formas comunes o marca un cambio de bloque.
- [INFERENCIA] **¿Motivado o tic?** Motivado si (1) la voz nombra lo que hay en ese punto, (2) revela algo, (3) sube la tensión o (4) une formas. El empuje continuo de 1,8 %/s no cuenta: es "vida", no gesto.

### Huecos
Origen y valores del "smooth zoom"; % por segundo estándar de Ken Burns (solo está la medida de Erik); página de Adobe de Exponential Scale.

---

## 3. Expresiones y técnicas pro

### Takeaway
Dos ideas centrales: **leer el valor en otro tiempo** (`valueAtTime`, para stagger, eco y delay) e **integrar en vez de multiplicar** cuando cambian la frecuencia o la velocidad (Ebberts). Una speed ramp es literalmente la integral de la velocidad; en Remotion, una suma acumulada por fotograma.

### Hallazgos con cita
- [DOC] Funciones de propiedad — [AE Expressions: Property](https://ae-expressions.docsforadobe.dev/objects/property/):
  - `wiggle(freq, amp, octaves=1, amp_mult=.5, t)`: `wiggle(5,20,3,.5)` = base 5/s a 20 px, más 10/s a 10 px y 20/s a 5 px;
  - `temporalWiggle` tiembla el tiempo de muestreo (necesita keys);
  - `smooth(.2, 5)`;
  - `loopOut` con "cycle", "pingpong", "offset" (acumula) y "continue" (sigue con la velocidad final);
  - `valueAtTime(t)`, `velocity`, `speed`.
- [DOC] `ease/easeIn/easeOut/linear(t,tMin,tMax,v1,v2)`; `noise()` es Perlin (−1..1); `seedRandom(offset, timeless)`. — [Adobe: Expression reference](https://helpx.adobe.com/after-effects/using/expression-language-reference.html)
- [EXPERT] Looping wiggle de Ebberts:
  ```js
  freq=1; amp=110; loopTime=3; t=time%loopTime;
  linear(t,0,loopTime, wiggle(freq,amp,1,.5,t), wiggle(freq,amp,1,.5,t-loopTime))
  ```
  — [motionscript: looping wiggle](https://www.motionscript.com/design-guide/looping-wiggle.html)
- [EXPERT] Las expresiones no tienen memoria: animar la frecuencia del wiggle o una velocidad produce saltos, porque fase = f_actual × t. Solución: integrar (el área bajo la curva) y pasarla como tiempo: `wiggle(1, amp, 1, .5, accum)`. Vale igual para time remap guiado por audio. — [motionscript: speed control](https://www.motionscript.com/articles/speed-control.html)
- [EXPERT] Time remap: la ramp se dibuja en la curva de velocidad. El key final por defecto cae **1 f después** del último fotograma real, y con un ease largo el último fotograma llega antes de tiempo: poner el key en el último fotograma real. Frame Mix (fundido) frente a Pixel Motion (flujo óptico); revisar al 100 %; alternativas Twixtor y Kronos. — [PVC: Hidden Gems 28](https://www.provideocoalition.com/cmg_hidden_gems_chapter_28_frame_rate_manipulation/). Rampas con easy ease y manejadores; lo nativo de AE no tiene frame rate y no se entrecorta. — [SoM: time remapping](https://www.schoolofmotion.com/blog/time-remapping-in-after-effects)
- [DOC] Con máscara, estilo o efecto sobre una precomp colapsada, sus modos de fusión internos **dejan de afectar** a lo de abajo. — [Adobe: Precomposing](https://helpx.adobe.com/after-effects/using/precomposing-nesting-pre-rendering.html)
- [EXPERT] Precomps: mover a la precomp todos los atributos animados, numerarlas y nombrarlas, usar Tab para navegar; riesgo de "esconderte keyframes". Glow barato: duplicado + Fast Blur + Add. — [SoM: precomp](https://www.schoolofmotion.com/blog/precomp-animation-after-effects)
- [DOC/PRACT] Herramientas:
  - **Flow 1.5.2** (nov 2023, AE 2020-2026): curvas normalizadas, librerías de presets, **copia como cubic-bezier**, overshoot responsive. — [aescripts Flow](https://aescripts.com/flow/)
  - **Motion de Mt. Mograph** (11 $/mes): Null, Excite (overshoot), Jump (bote), Stagger/Delay, Influence, Value Graph. — [Mt. Mograph](https://mtmograph.com/products/motion/tools)
  - **Overlord** (75 $): pasa Figma, PS o AI a shape y text layers nativas. — [Battle Axe](https://battleaxe.co/overlord)
  - **Ray Dynamic Texture**: paletas de texturas con alpha o luma matte. — [aescripts](https://aescripts.com/ray-dynamic-texture/)

### Inferencias
- [INFERENCIA] **Stagger pro:** cada capa lee la curva de un líder con `valueAtTime(time − i·d)`, d = 1-3 f, y solo se edita una curva. En Remotion, `anim(frame − i*d)`.
- [INFERENCIA] **Speed ramp con gusto:** 100 → 20-30 % en 4-8 f, mantener durante el gesto y volver a 100-200 % en 4-6 f. La curva de velocidad debe ser una S, sin escalones. En fotos fijas, la "rampa" es la de la cámara: frena en el momento clave y acelera al salir.
- [INFERENCIA] **Transición con matte:** la forma (o la silueta del sujeto) crece con ease exponencial en 8-14 f.
- [INFERENCIA] **Trim paths:** `end` 0→100 % con ease-out fuerte y `start` 2-4 f por detrás. En Remotion, `evolvePath` de `@remotion/paths` o `strokeDashoffset`.

### Huecos
Motion Tools Pro (gratuito) y Ease and Wizz no cargaron. No hay valores sourced de speed ramps.

---

## 4. Acabado / look

### Takeaway
El acabado pro está **construido y contenido**. El glow se hace con duplicado + umbral + blur + desaturado + Add (o Deep Glow, con caída de inversa al cuadrado), no con el Glow nativo. La aberración es radial y solo en los bordes. La viñeta es una máscara invertida con ~200 px de feather a opacidad baja. El light wrap ronda los 30 px. Y el grado va en orden: igualar, contraste, máscaras y viñeta, y al final desaturar. Lo amateur es todo al 100 %, a la vez y en todos los planos.

### Hallazgos con cita
- [EXPERT] Glow construido: duplicado → Levels que aplasta negros ("Clip to Output Black" en 32 bits) → Fast Blur → desaturar → máscara opcional → CC Composite en **Add**. El Glow nativo da poco control, un umbral de prueba y error y **halo negro** al animar. — [SoM: glows](https://www.schoolofmotion.com/blog/glows-after-effects)
- [DOC/PRACT] Deep Glow: falloff "physically accurate inverse square", umbral HDR con *smoothness* contra el parpadeo, aberración, tinte, **dither contra banding**, spread y aspect, 8/16/32 bpc. — [aescripts Deep Glow](https://aescripts.com/deep-glow/)
- [EXPERT] Aberración cromática: el desplazamiento RGB uniforme "no es como se ve la aberración real". La de lente es una distorsión radial distinta en azul y en rojo, **alineada en el centro y separada en los bordes**. Se nota en blanco sobre oscuro y poco en azules. "Unos pocos píxeles". Acompañarla de grano. — [SoM: chromatic aberration](https://www.schoolofmotion.com/blog/chromatic-aberration-nuke-after-effects)
- [EXPERT] Color, según [SoM: color theory](https://www.schoolofmotion.com/blog/color-theory-after-effects):
  - comprobar el valor con una adjustment en B/N ("tu ojo miente");
  - Levels hasta tocar negro y blanco reales;
  - curva en S (bajar sombras sube saturación: compensar);
  - tintes al ~10-30 %;
  - **viñeta: elipse invertida, feather ~200 px, oscurecer y bajar la opacidad**;
  - orden: dominante y contraste → máscaras y viñeta → desaturación global → curva final.
- [EXPERT] Light wrap: fondo con Set Matte del alfa del recorte desenfocado, invertido, **fast blur ~30 px**; channel blur **1 px** en el alfa. — [SoM: 3D photo](https://www.schoolofmotion.com/blog/3d-photo-after-effects)
- [DOC] Add Grain: cantidad por sombras/medios/altas (midpoint 0,5), por canal, monocromo o tinte; **Animation Speed 1 = cambia cada fotograma, 0 = estático**; 100 semillas; Blend with Original arranca en 0 %. Para Match Grain, muestrear zonas lisas. — [Adobe: Noise & Grain](https://helpx.adobe.com/after-effects/using/noise-grain-effects.html)
- [PRACT, Erik] Grano 0,16 en foto y 0,05 sobre blanco; viñeta `radial #FFF 40 % → #E3E3E7`.

### Inferencias
- [INFERENCIA] **Señales de amateur:**
  - glow nativo grande en todo el plano;
  - RGB split uniforme y constante;
  - grano estático o de color;
  - viñeta negra que se ve como un óvalo;
  - DOF en gran angular o sin sujeto;
  - blur de cámara sobre texto quieto;
  - LUT al 100 % sobre fotos de archivo sin igualar;
  - todos los efectos a la vez.
- [INFERENCIA] **Intensidades a 1080p** (validar a ojo):
  - aberración 0 en el centro y 1-3 px en las esquinas (picos de 2-4 f para golpes, como el glitch de nombres de Erik);
  - glow con blur del 2-5 % del alto del cuadro y opacidad hasta que se note su *ausencia*;
  - viñeta de −10 a −25 % en las esquinas;
  - grano animado y monocromo, 0,05-0,2.
- [INFERENCIA] **Orden de lente:** igualar cada foto → grado → glow → aberración → viñeta → **grano siempre el último**. En vídeos de historia lo primero es igualar negros, blancos y dominante entre fotos de distintas épocas.

### Huecos
Valores sourced de px de aberración, opacidad de grano y radio de glow (todos los artículos dicen "a ojo"); viñeta de Lumetri; parámetros de Deep Glow 2.

---

## 5. Traducción a Remotion

### Takeaway
Hay tres niveles: (1) 2D sobre foto, que es lo que ya hace Erik; (2) **2.5D con CSS** (`perspective` + `preserve-3d` + `translateZ`), que equivale exactamente a AE si `perspective = Zoom`; (3) **3D real con `@remotion/three`**. El shake determinista sale de `@remotion/noise`, la speed ramp por integración y el DOF con blur por |z−foco| o `<DepthOfField>` de pmndrs.

### Hallazgos con cita
- [DOC] `<ThreeCanvas>` — [Remotion: ThreeCanvas](https://www.remotion.dev/docs/three-canvas):
  - **`width` y `height` obligatorios**; cámara con `camera={{fov:75, position:[0,0,470]}}`;
  - en render `frameloop` se fuerza a `'never'`; **no usar `useFrame()`**, animar con `useCurrentFrame()`;
  - texturas asíncronas con `advance(performance.now())`;
  - props de `<Sequence>` desde v4.0.528.
- [DOC] `npm i three @react-three/fiber @remotion/three @types/three` — [Remotion: three](https://www.remotion.dev/docs/three):
  - `<Sequence layout="none">` dentro del canvas;
  - **ANGLE obligatorio**: `Config.setChromiumOpenGlRenderer('angle')`, y en SSR o Lambda `chromiumOptions:{gl:'angle'}`;
  - existe `<ThreeWebGPUCanvas>`; las texturas de vídeo pasan a `@remotion/media`;
  - versión 4.0.534 en npm.
- [DOC] Preferir `scale`/`translate`/`rotate` sueltos (editables en Studio); `transform` solo para `perspective()`, skew o cadenas que dependen del orden; **rotateX/Y necesita `perspective` en el padre**. — [Remotion: transforms](https://www.remotion.dev/docs/transforms)
- [DOC] `random(seed)` es determinista entre hilos — [Remotion: random](https://www.remotion.dev/docs/random). `noise2D/3D(seed,…)` devuelven un valor suave en −1..1 — [noise2D](https://www.remotion.dev/docs/noise/noise-2d), [noise3D](https://www.remotion.dev/docs/noise/noise-3d).
- [DOC] `<DepthOfField focusDistance={3} focusRange={2} bokehScale={2}/>`; `target` (punto del mundo) tiene prioridad sobre `focusDistance`; `focalLength` está deprecado. — [pmndrs DepthOfField](https://react-postprocessing.docs.pmnd.rs/effects/depth-of-field)
- [DOC] **Effects de Remotion** (desde v4.0.464): `effects={[blur({radius:40})]}` sobre `<Img>`, `<Video>`, `<Solid>`, `<HtmlInCanvas>`…; se encadenan; `createEffect()` para efectos propios; existe `pixelate`. — [Remotion effects](https://www.remotion.dev/docs/effects)
- [DOC] Ejemplos oficiales: template-three, glb-example, 3d-text. — [Remotion resources](https://www.remotion.dev/docs/resources)

### Inferencias y snippets
**[INFERENCIA, geometría] CSS ↔ AE.** En CSS, `translateZ(z)` (+ hacia el espectador) se ve a `p/(p−z)`; AE (+ = lejos) a `Zoom/(Zoom+z)`. Por tanto **`perspective = Zoom`** y `translateZ = −zAE` (1920 px a 50 mm → `perspective: 2667px`). Corolario: **animar solo `perspective` es un dolly zoom**, porque z=0 siempre está al 100 %. Bajar p hace que el fondo "huya" (*Vertigo*).

```tsx
// Cámara 2.5D (CSS). Convención AE: z + = lejos.
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {noise2D} from '@remotion/noise';
type Cam = {x:number; y:number; z:number; rotY?:number; zoom?:number; shake?:number};
export const Camera: React.FC<{cam:Cam; children:React.ReactNode}> = ({cam, children}) => {
  const f = useCurrentFrame(), s = cam.shake ?? 0;
  const sx = noise2D('cx', f*0.04, 0)*s, sy = noise2D('cy', 0, f*0.04)*s; // ≈1 Hz a 24 fps
  const sr = noise2D('cr', f*0.04, 9)*s*0.06;                              // grados
  return (
    <AbsoluteFill style={{perspective: cam.zoom ?? 2667, overflow:'hidden'}}>
      <AbsoluteFill style={{transformStyle:'preserve-3d',
        transform:`rotateZ(${sr}deg) rotateY(${-(cam.rotY??0)}deg) translate3d(${-cam.x+sx}px,${-cam.y+sy}px,${cam.z}px)`}}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>);
};
export const Plane: React.FC<{z:number; zoom?:number; children:React.ReactNode}> = ({z, zoom=2667, children}) => (
  <AbsoluteFill style={{transformStyle:'preserve-3d', transform:`translateZ(${-z}px) scale(${(zoom+z)/zoom})`}}>{children}</AbsoluteFill>);
// Mantener cam.z < zoom − |z de la capa más cercana| o esa capa "atraviesa" la cámara.
```

```tsx
// Zoom exponencial anclado a un punto P de la imagen (modo 2D de Erik)
const zoomAt = (f:number, [f0,f1]:[number,number], s0:number, s1:number, P:{x:number;y:number}, W=1920, H=1080) => {
  const e = interpolate(f,[f0,f1],[0,1],{easing:Easing.bezier(0.83,0,0.17,1), extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const s = s0*Math.pow(s1/s0, e);                 // log-lineal
  const cx = interpolate(e,[0,1],[W/2,P.x]), cy = interpolate(e,[0,1],[H/2,P.y]);
  return {scale:s, translate:`${W/2-cx*s}px ${H/2-cy*s}px`, transformOrigin:'0 0'};
};
// Empuje continuo: scale = Math.pow(1.018, (frame - lastCut)/fps)
```

```tsx
// Shake: deriva a 1 Hz y 3 px + impacto a 10 Hz y 14 px que decae en ~0,3 s
const shake = (f:number, hit:number, fps:number) => {
  const t = (f-hit)/fps;
  return noise2D('drift', f/fps, 0)*3 + (t>=0 ? noise2D('hit', t*10, 0)*14*Math.exp(-t*8) : 0);
};
// Stagger (= valueAtTime(time - i*d)): opacity: lead(frame - i*2)
```

```tsx
// Speed ramp por integración (Ebberts → Remotion). Nunca frame*speed(frame).
const speedAt = (f:number) => interpolate(f,[0,20,28,60,66,90],[1,1,0.25,0.25,1.5,1],
  {easing:Easing.inOut(Easing.cubic), extrapolateRight:'clamp'});
const sourceFrame = (f:number) => { let a=0; for (let i=0;i<f;i++) a+=speedAt(i); return a; };
// Animaciones: usar sourceFrame(frame) en lugar de frame. Vídeo: fotogramas pre-extraídos, índice Math.round(sourceFrame(frame)).
```

```tsx
// DOF en CSS: blur ∝ |z − foco| con tope (rack focus = animar zFocus en 12-20 f)
const dofBlur = (z:number, zFocus:number, k=0.004, max=12) => Math.min(max, Math.abs(z-zFocus)*k);
```

```tsx
// R3F: mm → FOV vertical (three usa FOV vertical; sensor 36 mm horizontal como AE)
const mmToFov = (mm:number, film=36, aspect=16/9) => 2*Math.atan((film/aspect)/2/mm)*180/Math.PI;
<ThreeCanvas width={width} height={height}>
  <PerspectiveCamera makeDefault position={[x,y,z]} fov={mmToFov(focal)} onUpdate={(c)=>c.lookAt(tx,ty,tz)}/>
</ThreeCanvas>
```

Notas [INFERENCIA]:
- `playbackRate` variable no es exacto en vídeo, así que conviene pre-extraer fotogramas; el tramo lento necesita metraje a alta velocidad o interpolación (equivalente a Pixel Motion).
- Comprobar en render (no solo en Studio) que `lookAt` se aplica antes de capturar.
- En fotos 2D, el blur por velocidad de Erik sale más barato y limpio que `<CameraMotionBlur>`, que multiplica el render por `samples`.

### Huecos
`<CameraMotionBlur>` con `<ThreeCanvas>`; catálogo completo de `@remotion/effects` (¿glow, grano, aberración?); rendimiento de `preserve-3d` con muchas imágenes 4K en headless.

---

## 6. Interfaz de control de cámara 3D para Erik

### Takeaway
En 2026, **lo viable es Remotion Studio, no Theatre.js**. Desde v4.0.475 Studio tiene *interactivity*:
- mover, escalar y rotar en el canvas;
- **keyframes que se crean al arrastrar en el fotograma actual**;
- keyframes arrastrables en el timeline;
- **editor de easing (presets y bezier custom)**;
- todo **escrito de vuelta al código**.

El límite es que solo cubre `translate/scale/rotate/transformOrigin` en 2D. Theatre.js tiene la mejor UX 3D (cámara editable sobre R3F con graph editor), pero su desarrollo público está parado (0.7.2, trabajo en un repo privado) y habría que sincronizarlo a mano. Propuesta: cámara 3D con props zod más el editor de easing de Studio; Theatre solo como previsualizador.

### Hallazgos con cita
- [DOC] Studio interactivity (v4.0.475+) — [Remotion: interactivity](https://www.remotion.dev/docs/studio/interactivity):
  - arrastrar mueve (`style.translate`), bordes escalan, esquinas rotan; asa de transform-origin; Shift bloquea el eje;
  - "Drags create or update keyframes at the current frame";
  - segmentos de easing editables: Linear, presets y editor custom;
  - acepta `Easing.bezier` numérico, `Easing.spring()` con config inline, `in/out`, quad/cubic/back/poly(1-3);
  - **no editables**: `sin`, `circle`, `exp`, `bounce`, `elastic`, `poly(4)`;
  - undo y redo.
- [DOC] Para que el código sea editable — [Remotion: best practices](https://www.remotion.dev/docs/studio/interactivity-best-practices):
  - `Interactive.Div` con `name`;
  - `style` literal inline;
  - `interpolate()` inline con rangos y easing literales;
  - `scale/translate/rotate` en lugar de `transform`;
  - metadata inline;
  - la skill `/remotion-interactivity` reestructura el código;
  - desde v4.0.516, controles de props inferidos sin zod.
- [DOC] `Interactive.create({Component, schema})` con `InteractivitySchema` (number con min/step, color…). Incluye translate, scale, rotate, opacity y crop; **no menciona translateZ, rotateX/Y ni perspective**. — [make component interactive](https://www.remotion.dev/docs/studio/make-component-interactive)
- [DOC] Props editor (Cmd/Ctrl+J): zod con `.min/.max/.step`, `zColor`, `zTextarea`, `zMatrix`; 💾 guarda en el código si las defaultProps están inline; sin keyframes. — [visual editing](https://www.remotion.dev/docs/visual-editing)
- [DOC] Theatre.js + R3F: `getProject().sheet()`, `studio.initialize()` y `studio.extend(extension)` (solo en desarrollo), `SheetProvider`, `<PerspectiveCamera theatreKey="Camera" makeDefault/>`; se exporta `state.json` y se carga con `getProject('X',{state})`. — [Theatre + R3F](https://www.theatrejs.com/docs/latest/getting-started/with-react-three-fiber). Tween editor (por nombre o bezier) y curve editor multipista. — [sequences](https://www.theatrejs.com/docs/latest/manual/sequences). `sequence.position` es getter/setter en segundos; `project.ready` es una Promise. — [core API](https://www.theatrejs.com/docs/latest/api/core)
- [DOC] Estado de Theatre.js: core Apache-2.0 y studio AGPL-3.0; el README dice "1.0 is around the corner" y que el desarrollo se movió a un repo privado; npm 0.7.2. — [GitHub](https://github.com/theatre-js/theatre), [npm](https://registry.npmjs.org/@theatre/core). Remotion no lista ninguna integración con Theatre. — [resources](https://www.remotion.dev/docs/resources)

### Diseño propuesto [INFERENCIA]
**A (recomendada) — "CamaraFoto" editable en Studio, sin dependencias nuevas.**
```ts
const keyCam = z.object({
  frame: z.number().min(0).step(1),
  x: z.number().step(1), y: z.number().step(1),
  z: z.number().min(-2000).max(2400).step(10),   // dolly
  rotY: z.number().min(-30).max(30).step(0.5),   // órbita
  focal: z.number().min(18).max(135).step(1),    // perspective = W*focal/36
  focus: z.number().step(10),                    // plano de foco
  ease: z.enum(['erik','expoOut','linear','inOutCubic']),
});
export const camSchema = z.object({
  keys: z.array(keyCam),
  shake: z.object({hz: z.number().min(0).max(3).step(0.1), px: z.number().min(0).max(20).step(0.5)}),
  capas: z.array(z.object({src: z.string(), z: z.number().step(50), blurExtra: z.number().min(0).max(10)})),
  debug: z.boolean(),
});
```
Cómo funciona:
- El componente interpola entre `keys` con la easing de cada tramo y aplica `Camera`/`Plane` y `dofBlur`.
- Erik mueve sliders en Props y guarda con 💾.
- Los planos 2D con `Interactive.Div` le dan arrastre y editor de easing nativos.
- `debug` activa una **vista dron** (segunda cámara alejada con `rotateY(35deg)` que dibuja capas y cámara), el equivalente a la Custom View de AE.

Ventajas: todo vive en el repo y el render es determinista y funciona en Lambda. Limitación: la Z y la órbita se tocan con sliders, no arrastrando.

**B — Theatre.js para vuelo 3D libre:**
- `<ThreeCanvas>` + `SheetProvider` + `PerspectiveCamera` de `@theatre/r3f`;
- reloj sincronizado con `sheet.sequence.position = frame/fps` en cada render, nunca `play()`;
- Studio solo en `remotion studio`; en render se carga `state.json`.
- Riesgo sin verificar: Theatre aplica los valores por suscripción y con `frameloop='never'` podría salir **un fotograma tarde** (habría que forzar `advance()` o un `delayRender`). Además el paquete está parado.

**C — Híbrido:** usar Theatre solo para decidir valores y copiarlos a las `keys` de A.

### Huecos
No hay ningún ejemplo público de Remotion + Theatre ni confirmación de que se aplique de forma síncrona en headless. No está claro si `Interactive.create` permite keyframear campos propios (Z, rotY) desde el canvas. Spline sin evaluar.

---

## Chuleta (efecto → recurso → por qué → cuándo romperla)

**Cámara y 3D**
1. **Parallax en foto** → 2-4 capas a Z −800/0/+1300/+2667 con Zoom 2667, cada una reescalada `(Zoom+z)/Zoom` → la velocidad cae con la profundidad (143/100/67/50 %). Romper: con un clean plate malo, menos Z. [INFERENCIA geom.]
2. **Ocultar el recorte** → ≤2× de velocidad entre capas contiguas, channel blur 1 px en el alfa, light wrap ~30 px. Romper: en estética collage. [EXPERT SoM]
3. **Rig** → POS > ORBIT (en el POI) > SHAKE > cámara one-node → curvas independientes. Romper: two-node solo para órbitas a un único objetivo. [EXPERT SoM + INF.]
4. **Focal** → 50 mm por defecto, 85-135 mm documental, 24-35 mm empuje dramático; nunca caras de cerca en gran angular. [DOC + INF.]
5. **CSS = AE** → `perspective = W·focal/36` px y `translateZ = −zAE`. [INF. geom.]
6. **Dolly zoom** → `Zoom/dist` constante; en CSS, animar solo `perspective` con el sujeto en z=0, 1,5-4 s → toma de conciencia o vértigo. Nunca como transición rutinaria. [EXPERT + INF.]
7. **Autofoco** → proyección sobre el eje Z de cámara (`dot`), no `length`. [EXPERT Ebberts]
8. **DOF** → blur ∝ |z−foco| con tope de 8-12 px a 1080p y casi nada en gran angular. Romper: en look maqueta o tilt-shift. [EXPERT SoM + INF.]
9. **Rack focus** → animar el foco 12-20 f con inOut, en la palabra que lo motiva. [INF.]
10. **3D real solo si hace falta** → CSS 2.5D para fotos; `@remotion/three` para volumen, órbitas >30° o luces. [DOC + INF.]
11. **Precomp 3D** → Collapse Transformations; ojo, con efecto o máscara encima se pierden los modos de fusión. [DOC]

**Shake**
12. **En mano sutil** → ~1 Hz, 2-8 px más 0,2-0,6° de rotación con otra semilla, sin escala. Romper: en impactos. [EXPERT SoM 1 Hz/25 px y 1 Hz/2 u + INF.]
13. **Impacto** → 8-12 Hz, 10-15 px, caída exponencial en ~0,3 s; nunca más de 10 f sostenido. [INF.]
14. **Determinista** → `noise2D(seed, f*hz/fps, 0)*amp` o `random(seed)`, nunca `Math.random`. [DOC]
15. **Shake sobre foto** → escalar un 2-4 % de margen para que no se vean bordes. [EXPERT SoM + INF.]
16. **Intensidad variable** → integrar la frecuencia, no `freq(t)*t`. [EXPERT Ebberts]

**Zooms**
17. **Zoom de escala** → `s0·(s1/s0)^e(t)` → velocidad percibida constante (con zooms de menos de ×1,15 da igual). [EXPERT van Wijk]
18. **Anclado** → escalar alrededor del POI y llevarlo al centro con la misma curva. [INF.]
19. **Detalle a detalle lejano** → alejarse-pan-acercarse (ρ≈1,4) si la distancia supera ~1,5 encuadres. [EXPERT van Wijk]
20. **Empuje continuo** → +1,8 %/s exponencial desde el último corte. Romper: quieto a propósito en el plano de silencio o impacto. [PRACT Erik]
21. **Punch-in** → +15-30 % seco con 2-4 f de asentamiento como mucho; con <10 % parece un error. [PRACT + INF.]
22. **Zoom-through** → 3-5 f de ease-in hasta ×1,3-2, corte en el pico, 3-5 f de ease-out, blur de 180-360° solo ahí, mismo centro. [PRACT PremiumBeat + INF.]
23. **Crash zoom** → 1 s con la velocidad máxima en el fundido de 1-2 f. [PRACT]
24. **Motivación** → solo si la voz nombra, se revela algo, sube la tensión o une formas; máximo un zoom marcado cada 3-5 s. [INF.]
25. **Alejarse lento** → soledad, distancia, cierre de bloque. [PRACT]

**Expresiones y tiempo**
26. **Stagger** → todas las capas leen la curva de un líder con `anim(frame − i*d)` y d = 1-3 f. [DOC + INF.]
27. **Speed ramp** → tiempo fuente = Σ speed; S de 100 → 25 % en 4-8 f y vuelta en 4-6 f. [EXPERT Ebberts + INF.]
28. **Bucle orgánico** → looping wiggle (dos wiggles desfasados un ciclo y fundidos). [EXPERT Ebberts]
29. **Time remap** → key final en el último fotograma real, no en el de por defecto. [EXPERT PVC]

**Acabado**
30. **Glow** → duplicado + umbral + blur + desaturar + Add, hasta que se note su *ausencia*. [EXPERT SoM]
31. **Aberración** → radial: 0 en el centro, 1-3 px en las esquinas. Romper: con picos de 2-4 f en golpes o nombres. [EXPERT SoM + INF.]
32. **Viñeta** → elipse invertida, feather ~200 px, −10 a −25 %. [EXPERT SoM + INF.]
33. **Grano** → animado a cada fotograma, monocromo, 0,05-0,2 (Erik: 0,16 / 0,05), siempre la última capa. [DOC + PRACT]
34. **Orden** → igualar fotos → grado → glow → aberración → viñeta → grano. [EXPERT + INF.]
35. **Comprobar valores** → adjustment en B/N arriba. [EXPERT SoM]
36. **Menos es pro** → como mucho 2-3 efectos de look notables a la vez. [INF.]

**Herramientas e interfaz**
37. **Curvas editables** → `interpolate` inline + `Easing.bezier` numérico + `scale/translate/rotate` sueltos → Studio ≥4.0.475 permite arrastrar, crear keyframes y editar el easing, y lo escribe al código. Evitar `exp`/`elastic` donde Erik vaya a tocar. [DOC]
38. **Cámara 3D editable** → composición zod con `keys[]` (frame/x/y/z/rotY/focal/focus/ease) + shake + capas + vista dron. Theatre solo como previsualizador. [DOC + INF.]
39. **R3F** → `<ThreeCanvas width height>`, sin `useFrame`, `gl:'angle'` y FOV vertical a partir de los mm. [DOC + INF.]
