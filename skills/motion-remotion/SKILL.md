---
name: motion-remotion
description: Motion design de nivel After Effects traducido a Remotion. Curvas y easing, springs, stagger, anticipación, overshoot, motion blur, cámara 2.5D y 3D, zooms, parallax, shake, speed ramps, tipografía cinética, transiciones, motion graphics de marca, acabado y el flujo Figma a Remotion. Úsala al animar, montar o revisar cualquier pieza en Remotion o cuando algo se vea robótico.
---

# Motion de nivel estudio en Remotion

Objetivo: que nada se vea robótico ni de plantilla. Lo robótico casi siempre es uno de estos fallos: todo empieza a la vez, todo dura lo mismo, curvas lineales o simétricas, rebote en todo, nada reposa, diagonales rectas, blur donde no toca, cámara que se mueve sin motivo. Esta skill da los números y su porqué. La decisión de qué se siente en cada tramo la toma `direccion-creativa-audiovisual`; esta skill la ejecuta.

Referencias (en `references/`; si no están, en `https://raw.githubusercontent.com/erubialesmolano-dotcom/direccion-creativa-rm/main/skills/motion-remotion/references/<archivo>`):

| Necesitas… | Lee |
|---|---|
| Tabla de números (influencias, duraciones, springs, holds, stagger, lectura de texto, zonas seguras) y traducciones con código | `curvas-timing.md` |
| Cámara AE (rig, focal, dolly zoom, DOF, parallax), zooms, shake, expresiones, speed ramps, acabado (glow, grano, aberración, viñeta) y su código | `camara-zoom-3d.md` |
| Sistemas de motion (Carbon, Material, Fluent, Apple), cómo piensan Buck, Giant Ant, Ordinary Folk, casos de marcas tech, transiciones, sonido para motion, short-form premium vs "retention" | `motion-graphics.md` |
| Figma Motion, MCP de Figma, Figma → Remotion / AE / Lottie / Rive | `figma-flujo.md` |

Convención: fotogramas a 30 fps salvo que se diga. A 24 fps multiplica por 0,8. Etiquetas: [DOC] oficial, [EXPERT] practicante reconocido, [PRACT] tutorial, [INF] inferencia (recomendación, no hecho).

---

## 1. Antes del primer keyframe

1. **Idea en una frase.** "Beautiful isn't an idea" (Giant Ant). Si no sabes qué comunica el movimiento, no lo animes.
2. **Registro de motion**: *productive* (rápido, en ejes, 2-7 f) para información y UI; *expressive* (12-21 f, arcos, overshoot) para momentos hero [DOC IBM Carbon]. Mezcla ambos solo para marcar el hero.
3. **Biblia de 5-8 constantes**: paleta, curva firma, duración base, grosor de trazo, grano, tipografía, forma de máscara. Revisa cada plano contra ella [EXPERT Ordinary Folk]. Si el cliente tiene sistema de motion propio, usa sus curvas literales.
4. **Proceso**: look frames → storyboard → boardomatic con audio provisional → plano hero → resto [EXPERT Buck]. El sonido se decide en el animatic, no al final.
5. **Técnica mínima por plano**; la complejidad, en 1-2 momentos hero.

---

## 2. Curvas (lo que más separa amateur de pro)

Mapeo AE → Remotion [INF, geometría]: dos keyframes a velocidad 0 con influencia de salida `a` y de entrada `b` ≈ `Easing.bezier(a, 0, 1-b, 1)`.

```ts
import {interpolate, Easing, spring} from 'remotion';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ae = (a: number, b: number) => Easing.bezier(a, 0, 1 - b, 1);
const x = interpolate(frame, [0, 20], [0, 400], {easing: ae(0.7, 0.9), ...clamp});
```

| Uso | Curva | Fuente |
|---|---|---|
| Entrada (decelera) | `bezier(0.05, 0.7, 0.1, 1)` (Material emphasized decelerate) o `(0, 0, 0.3, 1)` (Carbon expressive) | [DOC] |
| Salida (acelera) | `bezier(0.3, 0, 0.8, 0.15)`; dura el 50-80 % de la entrada | [DOC Material] |
| Movimiento dentro de pantalla | `bezier(0.2, 0, 0, 1)` | [DOC Material] |
| Movimiento que empieza y acaba en cuadro (firma de Erik) | `bezier(0.83, 0, 0.17, 1)` en 13-14 f a 24 fps | [Erik + auditoría] |
| "Diseñado" asimétrico | influencias 50-70 % salida / 60-80 % entrada; 60-85 % da deslizamiento; más, "floaty" | [PRACT] |
| Lineal | Solo velocidad constante: rotaciones, tickers, scroll, loops | [DOC Fluent] |

Reglas:
- **Nunca una sola curva global.** Entradas deceleradas, salidas aceleradas.
- **Easy Ease 33/33 simétrico es punto de partida, no resultado.**
- **Arcos, no rectas:** anima X e Y con curvas o duraciones distintas para que las diagonales salgan curvas.
- **Duración según distancia y tamaño:** icono 4-6 f; tarjeta 8-10 f; elemento medio 9-15 f; transición a pantalla completa 12-18 f (hasta 30). Movimiento pequeño 10-16 f, medio 16-24 f, entrada grande 20-30 f.
- **UI recreada en vídeo**: respeta los tiempos reales del producto (100-400 ms); una UI lenta en vídeo hace que el producto parezca lento [EXPERT NN/g].
- **Siempre `clamp`** en interpolate.

---

## 3. Springs, overshoot y anticipación

`spring()` por defecto (damping 10, stiffness 100, mass 1) rebota ~16 %: demasiado para lo premium.

| Sensación | Config | Overshoot teórico [INF] |
|---|---|---|
| Pop premium | damping 14, stiffness 180, mass 0,8 | ~10 % |
| Asentado elegante | damping 14, stiffness 100 | ~5 % |
| Sin rebote visible | damping 18+ o `overshootClamping: true` | ~0 % |

- **Overshoot solo en el héroe**; el resto, ease-out sin rebote. El rebote en todo es el tic de IA más reconocible.
- **El overshoot depende de la velocidad de llegada** (Ebberts: amplitud = v / (2π·frecuencia), frecuencia 3, decay 5). Un `Easing.elastic` fijo no lo cumple. Un bote real son parábolas que se acortan (elasticidad 0,7), no un seno.
- **Pop de escala**: 0→1 en 12-18 f con un overshoot del 5-10 %; opacidad 0→1 solo en los 4-6 primeros fotogramas (si se funde todo el rato, queda blando).
- **Anticipación**: un solo fotograma ya se nota [EXPERT]. Retroceso del 5-10 % del recorrido en 4-8 f y salida con ease-out fuerte. Sin número con fuente: ajusta a ojo.
- **Follow-through**: hijos con el mismo spring, `delay` de 1-3 f cada uno y algo menos de damping.
- Color y opacidad sin overshoot.

```ts
const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 180, mass: 0.8}});
const opacity = interpolate(frame - delay, [0, 5], [0, 1], clamp);
```

---

## 4. Tiempo, holds y coreografía

- **Holds**: evita holds de 2-5 f (parecen error); mínimo 6 f; una expresión o un logo se leen en ~12 f, mejor 16-18; en holds largos, "moving hold" (micro-empuje) salvo en el momento de peso, que va quieto a propósito.
- **Un solo foco lidera; el resto acompaña.** No más de 2 elementos con movimiento propio a la vez fuera de los momentos hero.
- **Stagger**: 1-3 f entre elementos (50-100 ms; más de 150 ms se siente lento), total ≤15 f; con más de ~15 elementos, escalona grupos. Orden: contexto → contenido → dato → CTA; lo más importante entra último y con la curva más expresiva.
- **Stagger correcto en código** = todas las capas leen la curva del líder con retraso: `anim(frame - i*d)`.
- **Ráfagas y respiros**: alterna 3-5 eventos con holds de 15-45 f. Estímulo uniforme = sin jerarquía.
- **Rejilla rítmica**: a 120 BPM un beat = 15 f a 30 fps; a 90 BPM, 16 f a 24 fps. Cambios de escena en downbeats; clava el beat exacto solo en 1-2 cambios estructurales por secuencia.
- **Lectura de texto**: ~175 palabras/min ≈ 10 f por palabra a 30 fps (+10-20 % en español [INF]); frases clave con ventana estable de 20-30 f. Palabra a palabra tipo "Don't Blink" (5-7 f por palabra) solo con palabras de 1-2 sílabas.

---

## 5. Cámara, zooms y 3D (detalle y código en `camara-zoom-3d.md`)

Niveles: (1) 2D sobre foto; (2) **2.5D con CSS** (`perspective` + `preserve-3d` + `translateZ`); (3) **3D real con `@remotion/three`** solo si hace falta volumen, órbitas de más de 30° o luces. Para cámara compleja o previs, skill `blender-camara-3d`.

- **CSS = AE**: `perspective = ancho · focal / 36` px (1920 px a 50 mm → 2667 px) y `translateZ = −zAE` [INF geométrica]. Animar solo `perspective` con el sujeto en z=0 = dolly zoom.
- **Focal**: 50 mm por defecto; 85-135 mm documental, producto, compresión; 24-35 mm empuje dramático; nunca caras de cerca en gran angular.
- **Parallax en foto**: 2-4 capas; la velocidad cae con la profundidad; ≤2× de diferencia entre capas contiguas para ocultar el recorte; 1 px de blur en el alfa y light wrap ~30 px.
- **Rig**: posición > órbita (en el punto de interés) > shake > cámara. Curvas independientes por capa.
- **DOF**: blur proporcional a |z − foco| con tope 8-12 px a 1080p; rack focus de 12-20 f en la palabra que lo motiva.
- **Zooms**: escala **exponencial** (`s0·(s1/s0)^e`), porque el tamaño se percibe en logarítmico; anclado al punto de interés. Entre dos detalles lejanos (>1,5 encuadres): alejarse, desplazarse, acercarse.
  - Punch-in: +15-30 % seco, 2-4 f de asentamiento; con <10 % parece un error.
  - Zoom-through: 3-5 f de ease-in hasta ×1,3-2, corte en el pico de velocidad, 3-5 f de ease-out, blur solo ahí.
  - Empuje continuo (firma de Erik): +1,8 %/s exponencial; a 0 en el plano de peso.
  - **Motivación obligatoria**: la voz nombra algo, se revela algo, sube la tensión o se unen formas. Máximo un zoom marcado cada 3-5 s. Alejarse lento = soledad, distancia, cierre.
- **Shake**: en mano sutil ~1 Hz, 2-8 px + 0,2-0,6° de rotación con otra semilla; impacto 8-12 Hz, 10-15 px que decae en ~0,3 s. Siempre determinista (`noise2D` de `@remotion/noise` o `random(seed)`), nunca `Math.random`. Escala un 2-4 % para no ver bordes.
- **Speed ramp**: integra la velocidad (`sourceFrame = Σ speed`), nunca `frame * speed(frame)`. 100 → 25 % en 4-8 f y vuelta en 4-6 f.
- **R3F en Remotion**: `<ThreeCanvas width height>`, anima con `useCurrentFrame()` (nunca `useFrame`), GL `angle`; three usa FOV vertical: `fov = 2·atan((36/aspect)/2/mm)`.

---

## 6. Motion blur

- Base: obturador 180° (fase −90° en AE). Con texto que leer, 90-120°.
- **Blur por velocidad** (más barato que `<CameraMotionBlur>` y sin degradar color): longitud = |v|·(ángulo/360) en la dirección del movimiento; 0 si |v| < ~1 px/f, para que lo quieto quede nítido. Sin blur en el fotograma de corte ni en el contacto.
- `<CameraMotionBlur>`: 5-10 muestras, multiplica el render y degrada el color [DOC].
- Smear en 1-2 f de velocidad máxima (`scaleX` 1,2-1,5×) o `<Trail>` como alternativa estilizada.

---

## 7. Transiciones y continuidad entre escenas

1. Antes de cada corte decide **qué hereda la escena siguiente**: forma, color, posición o velocidad.
2. Elige por relación: transformación si es "lo mismo cambiado", eje compartido si es "lo siguiente", corte o fade-through si no hay relación [DOC Material].
3. Un morph necesita que A y B compartan dos de tres: silueta, color, posición. 12-24 f.
4. El punto de atención del último frame de A coincide con el del primero de B (±10-15 % del ancho).
5. Eje narrativo: avanzar = una dirección; retroceder, problema o "antes" = la contraria.
6. Si mover un objeto no comunica nada, fúndelo y reaparécelo [DOC Apple HIG].
7. Máscaras de reveal con formas del propio sistema (retícula, logo), nunca wipes de preset.

---

## 8. Tipografía cinética

- Stagger por carácter 1-2 f; por palabra en líneas largas.
- Desplazamiento en Y del 40-60 % de la altura de línea → 0 con spring de damping 15-20 y `overflow: hidden` por línea.
- Tracking que se cierra de 0,3 em al valor final en 30-60 f con ease-out exponencial, para momentos hero.
- Jerarquía por tamaño (tamaño = importancia), no por cantidad de efectos.
- Legibilidad: contraste ≥4,5:1; subtítulos ≤42 caracteres por línea, 2 líneas, ≤20 caracteres/s; zonas seguras 9:16 (Reels 220 px arriba / 420 abajo; TikTok 108 / 320, 60 izq., 120 der.; verificar en la app).
- SF Pro Display ya está dibujada apretada a tamaños grandes: no apliques interletrado negativo extra sin mirarlo.

---

## 9. Sonido en motion graphics

- Sincronía al fotograma solo para eventos de nivel 1 (logo, revelación, cambio de estado); la música cubre stagger y loops.
- UI sounds cortos, de un solo material, 0-2 f antes del cambio visual.
- 6-12 f de silencio antes de la revelación principal; el logo final necesita 0,5-1 s de decay o silencio.

---

## 10. Acabado (orden y límites)

Orden: igualar fotos → grado → glow → aberración → viñeta → grano (última capa).
- **Glow** construido (duplicado + umbral + blur + desaturar + Add), hasta que se note su ausencia, no su presencia.
- **Aberración** radial: 0 en el centro, 1-3 px en esquinas; picos de 2-4 f solo en golpes.
- **Viñeta**: elipse invertida, feather ~200 px, −10 a −25 %.
- **Grano** animado cada fotograma, monocromo, 0,05-0,2.
- Como mucho 2-3 efectos de look notables a la vez. Comprueba valores con una capa en blanco y negro.
- Export: 1080×1920 H.264, sin subir 4K reescalado, sin comprimir dos veces.

---

## 11. Figma → Remotion (detalle en `figma-flujo.md`)

- Figma Motion (beta desde junio de 2026) tiene línea de tiempo y exporta MP4. Por MCP: `get_motion_context` devuelve los keyframes como CSS/motion.dev; `export_video` renderiza MP4 de un frame de primer nivel; `use_figma` crea animación (carga antes las skills `figma-use` y `figma-use-motion`).
- **Remotion no acepta CSS animations ni motion.dev**: traduce los keyframes a `interpolate` + `Easing.bezier` y `spring()` (tiempo en s × fps; rotación de Figma positiva = antihoraria, invierte el signo).
- El MCP no lee Smart Animate ni transiciones de prototipo, ni exporta shaders o GenEffects.
- Comprueba `whoami` primero: con plan Starter / asiento View solo hay 20 lecturas al mes y no se puede escribir en el lienzo. El flujo serio necesita Professional con asiento Full.
- Estructura de proyecto: `tokens.ts` y `motion.ts` compartidos, un componente por escena, `<Sequence>` para montar; descarga los assets (las URLs de Figma caducan).

---

## 12. Edición de curvas visual (para que Erik ajuste a ojo)

Remotion Studio (≥4.0.475) permite arrastrar valores, crear keyframes y editar el easing, y lo escribe en el código, si el código usa `interpolate` en línea con `Easing.bezier` numérico y `scale`/`translate`/`rotate` sueltos (no dentro de `transform`). Escribe así lo que Erik vaya a tocar; evita `Easing.exp`/`elastic` en esos puntos. Para cámara 3D, composición con props zod (`keys[]` con frame, x, y, z, rotY, focal, foco, ease). Theatre.js está parado: no lo uses para render.

---

## 13. Revisión anti-robot (pásala antes de renderizar)

1. ¿Algo empieza en el mismo fotograma que otra cosa sin motivo? → stagger por jerarquía.
2. ¿Todo dura lo mismo? → escala con distancia y tamaño.
3. ¿Hay curvas lineales o simétricas donde debería haber entrada/salida? → asimétricas.
4. ¿Rebote en más de un elemento por escena? → solo el héroe.
5. ¿Cada momento clave reposa al menos 6-12 f?
6. ¿Diagonales en línea recta? → arcos.
7. ¿Blur sobre texto quieto o en contactos?
8. ¿Algún zoom o movimiento de cámara sin motivo?
9. ¿Más de 2-3 efectos de look notables?
10. ¿Cumple la biblia de constantes en todos los planos?
11. Render de fotogramas clave (inicio, pico, final de cada movimiento) y míralos antes de dar la pieza por buena.
