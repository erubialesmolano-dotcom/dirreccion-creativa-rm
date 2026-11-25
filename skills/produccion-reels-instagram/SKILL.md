---
name: produccion-reels-instagram
description: Producir y editar reels de Instagram de nivel profesional de principio a fin, de la idea al MP4. Guion optimizado para el Instagram actual (skip rate, envíos, originalidad), hoja de edición plano a plano, kit de 24 componentes de Remotion probado (curvas, punch-in, zoom-through, flash, pop desde la palabra, lamas de cristal, subtítulos por palabra, cámara 2.5D, acabado, sonido) y análisis medido de referencias para calcarlas. Úsala siempre que haya que guionizar, montar, editar, calcar una referencia o revisar un reel.
---

# Producción de reels para Instagram (de la idea al MP4)

Esta skill es la parte que materializa. `direccion-creativa-redes` decide la serie y la estrategia; `direccion-creativa-audiovisual` da el criterio emocional; aquí se escribe el guion para el Instagram de hoy, se traduce a una **hoja de edición** con componentes concretos y se renderiza. Regla: **no se piden referencias para editar.** Si hay una idea, se baja a la hoja de edición con el kit. Las referencias solo se usan para calcar un estilo concreto, y entonces se **miden**, no se miran.

Recursos de esta skill:

| Qué | Dónde |
|---|---|
| Kit de edición en Remotion (24 componentes probados, demo de 20 s) | `assets/remotion-edit-kit/` (copiar `src/kit/` al proyecto) |
| Catálogo del kit: qué hace sentir cada componente, cuándo no, props con su porqué y 10 recetas | `references/catalogo-kit-edicion.md` |
| Instagram 2025-2026 (oficial vs consultor), guion, velocidad del habla en español, 10 plantillas, checklist de publicación | `references/instagram-meta-guion.md` |
| Medir una referencia y validar un calco | `scripts/analisis-referencias/` y `references/analisis-de-referencias.md` |

Si los archivos no están en disco: `https://raw.githubusercontent.com/erubialesmolano-dotcom/direccion-creativa-rm/main/skills/produccion-reels-instagram/<ruta>`. Las correcciones de Erik mandan sobre los valores por defecto: consulta `cerebro-erik` y el diario de gusto.

---

## 1. Lo que manda en Instagram ahora (resumen; detalle y fechas en la referencia)

- **Tres puertas**: que no lo salten en los 3 primeros segundos (**skip rate**, métrica oficial desde agosto de 2025), que lo **envíen** por mensaje (pesa más para llegar a no seguidores) y que sea **original** (desde abril de 2026, las cuentas que suben sobre todo material ajeno, también en fotos y carruseles, salen de las recomendaciones; subtitular un repost no lo hace original).
- **Duración**: punto dulce medido en 30-59 s y 90-179 s. Por encima de 3 min no se recomienda a gente nueva.
- **Penaliza**: marcas de agua, bordes o barras, baja resolución, silenciado, "mostly text".
- **Hashtags**: máximo 5; clasifican, no dan alcance. Las palabras clave en las dos primeras líneas sí ayudan a la búsqueda.
- **Trial Reels**: para probar ganchos o formatos nuevos con no seguidores; se comparan entre sí, no con reels normales; Insights no los incluye: anótalos a mano.
- **Diagnóstico oficial**: caída en el segundo 4 = gancho; muchos guardados y pocos envíos = falta un ángulo para compartir.

---

## 2. Guion (siempre en tres canales a la vez)

**Antes de escribir**: serie y episodio, objetivo y su métrica (alcance → envíos; utilidad → guardados; venta → comentarios con palabra clave), duración objetivo y si lleva voz.

**Velocidad en español**: locución natural de reel a **2,5-3 palabras/s** (techo de radio: 3,5). Texto en pantalla a **≤17 caracteres/s**: un gancho escrito de 10 palabras necesita ≥3,3 s, así que **nace en el fotograma 0**.

| Duración | Palabras de locución | Rótulos máximos |
|---|---|---|
| 15 s | 35-45 | 2-3 |
| 30 s | 75-90 | 4-5 |
| 45 s | 110-135 | 6-7 |
| 60 s | 150-180 | 8-9 |
| 90 s | 225-270 | 10-12 + capítulos |

**Gancho (0-3 s)**:
- **Imagen, fotograma 0**: el resultado, el objeto o el conflicto ya visible; máximo 3 focos; si hay persona, en mitad de la acción.
- **Voz, 0-2 s**: la primera palabra ya es contenido; promesa, declaración o pregunta.
- **Texto, 0-3,5 s**: ≤10 palabras, alineado con la voz pero **no idéntico** (la voz cuenta, el texto acota con el dato o la tensión).
- **Prueba**: sin audio, ¿se entiende la promesa? Sin texto, ¿se entiende? Si solo funciona con los tres, el gancho es débil.

**Cuerpo**: presagio del final → avance con "pero / por tanto" → re-enganche a mitad → **pago visual** escrito antes de grabar → corte seco o bucle. Cada beat tiene una imagen que lo cuenta sola; números y nombres propios siempre en rótulo.

**CTA y texto del post**: CTA en voz y texto en los últimos 2-3 s. Para envíos, nombra al destinatario ("Mándaselo a quien lleva los regalos de empresa"); para guardados, una lista o paso a paso; para leads, **una palabra** en mayúsculas sin tildes ("Comenta PIEL") con la automatización comprobada. Dos primeras líneas del post = segunda portada: palabra clave buscable y una promesa que amplía el gancho, no lo repite. 3-5 hashtags descriptivos.

Plantillas listas (historia de archivo, lujo B2B sin cara, infoproductor, agencia) en `references/instagram-meta-guion.md` §4.

**Formato de entrega del guion** (dos columnas con tiempo):

```
| t (s) | IMAGEN (plano / asset) | VOZ | TEXTO EN PANTALLA | SONIDO | MODO |
```

---

## 3. Hoja de edición: de la idea al componente

Es el puente que evita pedir referencias. Cada fila del guion se baja a una fila de la hoja, con componente del kit y parámetros:

```
| f inicio–f fin | beat | asset | componente(s) del kit + props | texto (componente) | sonido (Sfx/duck) | modo | por qué |
```

Ejemplo:

```
| 0–60    | gancho     | foto cartera macro  | CameraPush(punch en f12, +22 %) + FlashCut(f0)  | KineticTitle "4 horas en 30 s" | golpe f0, música entra f12 | energía | resultado visible en f0; el punch marca la promesa |
| 60–240  | 6 gestos   | clips taller        | cortes secos al golpe del foley + Shake sutil   | WordCaptions (blanco)          | foley en cada corte        | energía | ilusión de esfuerzo; el foley hace de ritmo |
| 240–390 | pago       | neceser con logo    | quieto, empuje 0 (plano de peso 5 s)            | —                              | música baja a −12 dB, room tone | peso | el único plano quieto concentra la atención |
| 390–450 | firma/CTA  | logo                | HandOff desde el punto del subtítulo            | "Comenta PIEL"                 | golpe seco + cola          | cierre  | concatenar: el punto se vuelve firma |
```

### Recetas por defecto según el modo (valores a 30 fps; ajustables)

| Modo | Cortes | Cámara | Texto | Sonido | Componentes |
|---|---|---|---|---|---|
| **Energía** (hook, enumeración) | cambio visual cada 1-1,5 s; ráfagas de 3-5 en corte seco | `CameraPush` +1,8 %/s, punch-in +15-30 % en las palabras clave | `KineticTitle` o `WordCaptions` con pop 1,18→1 en 3 f | golpes solo en eventos de jerarquía; música con `duck()` bajo la voz | `Rafaga`, `FlashCut` (máx. 1 cada 3-4 s), `WhipPan`, `ZoomThrough` |
| **Peso** (tesis, giro, pago; una vez por pieza) | un plano de 3-6 s | quieto o empuje casi 0 | una sola frase, ventana estable ≥20-30 f | música fuera o −12 dB; room tone; silencio 0,5-1,5 s antes del golpe | ninguno visible; `Finish` siempre |
| **Respiro** (entre bloques) | pillow shot de 1,5-3 s | moving hold muy lento | sin texto | ambiente | `GridPaper`, `Parallax25D` suave |
| **Paso de escena** | concatenar: el último elemento de A es el primero de B | — | — | whoosh solo si el movimiento es de jerarquía | `HandOff`, `PopFromWord`, `GlassSlats`, `PixelDissolve`, `DeviceThrough` |

Racionamiento (lo que separa pro de amateur): un solo recurso marcado a la vez; overshoot solo en el héroe; un flash o un whoosh pierde valor a la tercera vez; clava el beat exacto solo en 1-2 cortes estructurales, el resto ±2 f.

---

## 4. Construir en Remotion

1. **Proyecto**: copia `assets/remotion-edit-kit/` (o solo `src/kit/` a un proyecto existente). Versiones fijadas en `package.json` (Remotion 4.0.547). `npm i`.
2. **Assets**: a `public/`. Voz → `words.json` con Whisper (formato `[{word,start,end}]`) para `WordCaptions` y para anclar cortes al final de cada idea.
3. **Marca**: tokens del cliente (colores, tipografías, acento) en `src/kit/constants.ts` o un `tokens.ts` por cliente. Nada de fuentes sin licencia.
4. **Composición**: una `<Sequence>` por fila de la hoja de edición; los componentes del kit con las props de la hoja. Todo animado desde `useCurrentFrame()`; nada de `Math.random`.
5. **Revisión**: `npm run studio` con `SafeZoneGuide` activado; stills de fotogramas clave (`npm run stills` o `npx remotion still`) y **mirarlos** antes de renderizar entero.
6. **Render y máster**: `npx remotion render`, después `npm run master` (loudnorm a −14 LUFS, true peak ≤ −1). Iterar por tramos: renderiza solo el tramo cambiado y empálmalo con ffmpeg.
7. **Exportar**: 1080×1920, H.264, ≥30 fps, AAC estéreo, sin marca de agua ni bordes.

Límites conocidos del kit (ver catálogo): `GlassSlats` por defecto en bandas horizontales (cambiar con `orientacion="vertical"` si la referencia era vertical); en `WordCaptions` la línea no se recentra mientras crece; sin probar en el Studio interactivo con todas las props.

---

## 4b. Que no parezca editado por Claude (kit v2, con números medidos)

Usa `assets/remotion-edit-kit/src/v2/` (catálogo, sección «Kit v2»). Los números salen de unas 190 referencias medidas (`references/recetas/`) y de calcos validados con p95 ≤ 4 px.

**Valores de referencia (mediana de las referencias, a 30 fps):**

| Medida | Referencias | Cómo se consigue con el kit |
|---|---|---|
| Plano mediano | 1,05 s; solo el 14 % de los planos dura ≤ 8 f | Las ráfagas en corte seco son un recurso puntual (gancho, montaje métrico), no todo el vídeo |
| Cortes por segundo | 0,76 | — |
| Cortes en el beat | Igual que el azar (66 % frente a 57 % del control) | Corta al final de la idea de la voz, no a cada golpe de música |
| Planos fijos | 33 %; casi nunca un plano largo quieto (el 90 % de los de ≥ 3 s se mueve) | `deriva` en los largos; quieto solo el plano de peso |
| Zoom de cámara | 0,8-3,5 %/s | `Empuje` de +5-8 % en 60-80 f; nunca +15 % por plano |
| Temblor de cámara en mano | 0,2-3 px | `deriva` lo lleva (`temblor` 0,6 px) |
| Zoom rápido | Ease-out (arranca de golpe y se posa); el zoom al corte, en cambio, acelera | `Empuje` por defecto; `CALCOS.zoomAlCorte` |
| Látigo | 87 % del recorrido en 7 f, se posa en 14 f y la escala baja un 3,6 % | `<Barrido perfil="latigo">` |
| Rampa de velocidad | 12× en 8 f | `rampa()` (2,4× → 0,2×) |
| Entrada de gráficos | 9 f hasta el 90 %, overshoot del 7 %, un 24 % en corte seco | `LineaCinetica` (`durLetra` 9); recortes en corte seco |
| Cambio de texto en pantalla | Cada 6-8 f: trozos de 1-3 palabras | Trozos cortados en la puntuación, uno cada vez |
| Flash | ~2 f | `LeakCorte`, `pulsoLeak` |
| Volumen | −14 LUFS | Máster con loudnorm a −14 / −1 dBTP |

**Lo que necesita cualquier pieza:**
- Material real y capas: vídeo antes que foto, recortes con alfa y sombra real, texturas con modo de fusión.
- Formas que señalan lo que dice la voz.
- Curvas distintas por propiedad.
- Transiciones con motivo (que algo de un plano lleve al siguiente).
- Sonido solo lo pedido: clics y pops, sin risers.

**Tics de Claude (si hay dos, no se entrega).**

Los de partida:
- fondo cuadriculado con tarjeta blanca centrada;
- tipografía de sistema en un solo peso;
- todo centrado;
- placeholders;
- el mismo spring en todo;
- cámara quieta;
- colores planos;
- subtítulos sin jerarquía;
- cortes clavados a cada beat.

Los de **sobrecorrección**, medidos en la Fase 5 (reel APZ con el kit v2):
- ráfagas en todo el vídeo (82 planos y el 74 % de ≤ 8 f, frente a 24-41 planos en las referencias);
- empujes exagerados (17 %/s de zoom frente a 1-3 %/s);
- frases enteras en pantalla (el texto cambia cada 22 f frente a 6-8);
- cámara sin temblor (0 px);
- audio a −18 LUFS.

**Antes de entregar**, mide la pieza con `analizar.py` y compárala con 3 referencias de la misma duración (`dataset.py`). Si alguna medida sale del rango de las referencias, hay que justificarla.

---

## 5. Calcar una referencia al milímetro (solo cuando hace falta)

1. **Conseguir el vídeo** para estudio interno, nunca para republicar: en el ordenador de Erik, `yt-dlp <url>` o la skill `descargar-reels-instagram`. No hace falta Agent-Reach (en Instagram solo lee perfiles y publicaciones, no baja vídeo, y reutiliza las cookies de sesión de Chrome).
2. **Medir**: `python scripts/analisis-referencias/analizar.py ref.mp4 --out ficha/` → `ficha.md` con planos (media, mediana, ≤8 f, ≥3 s, ritmo cada 5 s), flashes y tramos blancos, movimiento por plano (zoom en %/s, paneo, rotación, temblor y curva `Easing.bezier` estimada), zonas de texto, paleta, LUFS y true peak, onsets y % de cortes en el beat frente al azar, y la sección **"Cómo replicarlo en Remotion"** con los componentes del kit. Precisión en pruebas sintéticas: cortes exactos, zoom ±0,01 %/s, paneo 0,1 px.
3. **Traducir** la ficha a la hoja de edición (sección 3). Se copia el **mecanismo y el timing**, no el contenido.
4. **Validar**: `python scripts/analisis-referencias/calco.py ref.mp4 nuestro.mp4 --desde f --hasta f` → APROBADO si el error p95 es ≤4 px (criterio de Erik).
5. **Guardar** la receta medida en el cerebro (`04-Aprendizajes`) con su nombre, para no volver a medirla.

Limitaciones del analizador: no detecta fundidos largos ni lamas de cristal; un sujeto grande que se mueve puede leerse como cámara; el texto por bordes es aproximado.

---

## 6. QA antes de entregar

- **Gancho**: ¿promesa visible en el fotograma 0? ¿texto ≤10 palabras desde f0? ¿pasa la prueba de los tres canales?
- **Ritmo**: ¿hay un plano de peso? ¿algún recurso repetido hasta dejar de ser señal? ¿algo empieza a la vez sin motivo? (revisión anti-robot de `motion-remotion`).
- **Silencio y sonido**: ¿se entiende en mudo? ¿voz siempre por encima? ¿−14 LUFS / ≤ −1 dBTP?
- **Formato**: zonas seguras (≈269 px arriba, 672 abajo, 65 por lado en 1080×1920, guía de anuncios de Meta), sin marca de agua, 1080×1920, ≥30 fps.
- **Originalidad e IA**: aportación propia (voz, arco, grafismo) en todo material ajeno; etiqueta "AI info" si hay IA realista; nunca IA en manos, producto u oficio de una marca artesanal.
- **Música**: con licencia para cuenta de empresa o sonido propio.
- **Publicación**: portada que se entiende en 1-2 s, dos primeras líneas con palabra clave, CTA con destinatario o palabra, 3-5 hashtags, ¿Trial Reel?, comentario fijado, ManyChat probado.
- **Medición**: skip rate y share rate a las 24 h y a los 7 días; anotar en el cerebro qué gancho, qué duración y qué resultado.

---

## 7. Entregables

1. Guion a dos columnas con tiempos, gancho en tres canales y texto del post.
2. Hoja de edición con componentes y parámetros.
3. Proyecto Remotion y MP4 masterizado.
4. Stills de control de los fotogramas clave.
5. Si hubo referencia: `ficha.md` y el resultado de `calco.py`.
