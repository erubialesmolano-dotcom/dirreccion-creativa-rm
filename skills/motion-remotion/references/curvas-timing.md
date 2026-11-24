# Curvas, timing y números de motion (AE → Remotion)

> Fuente: informe 1 §tabla de números + informe 2 §4. Etiquetas de evidencia: [estudio]/[estudio*] dato empírico (con * si viene de plataforma con interés comercial), [norma]/[DOC] especificación oficial, [creador]/[EXPERT] quien hizo la pieza o practicante reconocido, [crítica], [PRACT] tutorial, [inferencia]/[INF]/[I] deducción sin fuente directa. Trata [inferencia] como recomendación, no como hecho.

### Tabla de números para Remotion

La skill de Remotion trabaja a 24 fps (la referencia de Metro Media House medía 1276×718 a 24 fps) y a veces a 30. A 24 fps, 1 fotograma son 41,7 ms; a 30 fps, 33,3 ms.

| Parámetro | Valor | Fuente y nivel |
|---|---|---|
| Duración de animaciones de UI | Corta 50-200 ms; media 250-400; larga 450-600; extralarga 700-1000. "La duración debe aumentar con el área o el recorrido" | [Material Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md) [norma] |
| Rango percibido | 100 ms se siente instantáneo; 200-300 ms para cambios pequeños, 400-500 para recorridos grandes o con rebote; por debajo de 200 ms puede no percibirse | [Val Head](https://valhead.com/?p=2978) [creador con datos de percepción] |
| Curvas | Estándar `cubic-bezier(0.2,0,0,1)`; entradas `(0,0,0,1)` (deceleran); salidas `(0.3,0,1,1)` (aceleran); enfatizada de entrada `(0.05,0.7,0.1,1)`. Lineal solo para lo mecánico | [Material](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md) [norma] |
| Springs | Rebote ~0,15 ligero, ~0,3 notable, >0,4 exagerado; un spring interrumpido conserva su velocidad. Color y opacidad sin overshoot (damping 1) | [WWDC23](https://wwdcnotes.com/notes/wwdc23/10158); [Material](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md) [norma] |
| Conversión a `spring()` de Remotion | ζ = damping / (2·√(stiffness·mass)); con mass 1 y stiffness 100, ζ 0,9 ≈ damping 18 | Física estándar, no verificada en fuente [inferencia] |
| Lectura de *in-betweens* | 0 = golpe de fuerza enorme; 1 = impacto de objeto; 2 = tic nervioso; 3 = esquivar; 4 = orden urgente y nítida | Thomas y Johnston, vía [fullfrontal.moe](https://fullfrontal.moe/animation-fundamentals-timing-and-spacing/) [creador] |
| Pausas (holds) | Evitar holds de 2-5 f; mínimo 6 f; expresión legible en ~12 f, mejor 16-18; 24+ solo para comedia; para holds largos, "moving hold" | [Brian Lemay](https://brianlemay.com/Pages/animationschool/animation/lipsyncbook/timing.html) [creador] |
| Anticipación | "Even one frame of anticipation is enough to make a difference"; probar 1-2 f | [Animator Island](https://www.animatorisland.com/?p=4041) [creador] |
| Rejilla rítmica | "Magic of 8": tramos de 8 f a 24 fps (1/3 s); 8 f casan con 90 BPM cada dos unidades. A 30 fps, 15 f casan con 120 BPM | [Animator Island](https://www.animatorisland.com/?p=2034) [creador] + [inferencia] |
| Stagger entre elementos | Incrementos de 50-100 ms; más de 150 ms se siente lento; secuencias completas por debajo de 1-2 s; ordenar por jerarquía | [SVGator](https://www.svgator.com/blog/offset-delay-motion-design/) [creador] |
| Lectura de subtítulos | Ofcom: máximo 160-180 ppm, más de 200 cuesta; BBC R&D: ~175 ppm "about right", 230 demasiado rápido | [BBC R&D](https://bbcbreakingnews.pages.dev/rd/blog/2015-09-how-fast-should-subtitles-be) [estudio / norma] |
| Duración por subtítulo | Mínimo 5/6 s (20 f a 24 fps), máximo 7 s, máximo dos líneas | [Netflix](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements) [norma] |
| Tipografía de una palabra | "Don't Blink" de Apple: 5-7 f por palabra a 29,97 fps (~0,2 s), con palabras de 1-2 sílabas | [Motionographer](https://motionographer.com/2016/09/14/4-ways-dont-blink-is-a-masterclass-of-type-and-rhythm/) [crítica con recuento de fotogramas] |
| Zonas seguras 9:16 (1080×1920) | Reels: 220 px arriba, 420 abajo; TikTok: 108 arriba, 320 abajo, 60 izquierda, 120 derecha | [Ignite Social Media](https://www.ignitesocialmedia.com/content-creation/what-are-the-safe-zones-for-tiktoks-and-instagram-reels/) [norma de terceros; verificar en la app] |

Traducidas a fotogramas a 30 fps [inferencia]: micro (iconos, chips) 6-9 f; elementos medianos 9-15 f; transición de pantalla completa 15-30 f; anticipación 2-4 f; overshoot y asentamiento 4-8 f; hold de lectura de un logo o cara 15-20 f; pausa cómica o dramática 14-20 f. El límite de 500 ms es de UI, no de narrativa: en vídeo no hay usuario esperando y se puede alargar [inferencia]. Para subtítulos legibles, 175 ppm son unos 10 f por palabra a 30 fps, y las frases clave y CTA necesitan **al menos 20-30 f de "ventana estable"**, desde que el texto ha llegado hasta que empieza a irse; acortar entradas y salidas alarga esa ventana sin alargar la escena ([open-design.ai](https://open-design.ai/blog/on-screen-text-duration/)) [creador]. Las palabras en español son de media más largas que en inglés, así que conviene contar con un 10-20 % más de tiempo por palabra que las cifras inglesas [inferencia sin fuente].

### Qué distingue lo "premium" de lo barato en motion

School of Motion insiste en que el easy-ease por defecto "rarely" es lo que necesitas y en que el oficio está en dar forma a lo que pasa entre fotogramas clave con el editor de gráficas [creador] ([School of Motion](https://www.schoolofmotion.com/blog/graph-editor-after-effects)). ManvsMachine: "we never want something to look like it's come from a computer" [creador] ([Clever podcast](https://www.cleverpodcast.com/blog/ep-164-mike-alderson)). Holmedal (ManvsMachine) llama "fractured flow" a encadenar planos con match cuts de composición o de inercia, y pide claridad de luz y composición antes que la "guarnición" de la ejecución [creador] ([Motionographer](https://motionographer.com/2016/05/02/interview-man-vs-machines-simon-holmedal/)). La lista resultante de señales premium es inferencia: pocos elementos moviéndose a la vez, escalonado que sigue la jerarquía, curvas asimétricas (salida rápida, asentamiento largo), holds largos para leer y una curva distinta por tipo de movimiento en vez de un `Easing.ease` global. Animar "a doses" (`Math.floor(frame/2)*2`) da una textura menos de software; la cámara y los barridos van a unos para que no tartamudeen [inferencia]. **Regla de transición motivada**: tiene que pasar al menos una cosa a través del corte (forma o posición, dirección y velocidad, color o valor, o significado); si no pasa ninguna, mejor un corte seco [inferencia sobre Holmedal]. Las imperfecciones controladas de Kyle Cooper en *Se7en* (rayado a mano, transfer cortado y reensamblado, accidentes conservados) eran el concepto, no decoración: presentar al asesino en los créditos [creador] ([Art of the Title](https://www.artofthetitle.com/title/se7en/)). Antes de animar, formula en una frase el núcleo de la pieza y busca la textura que *sea* ese núcleo [inferencia].

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
