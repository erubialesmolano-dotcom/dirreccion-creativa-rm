---
name: video-historia-remotion
description: Hace vídeos horizontales de historia con fotos de archivo en Remotion al estilo Milionegle "Formato A", que imita el de Metro Media House. Úsala para un vídeo de "historia de socios", un piloto o reel de Milionegle, para rehacer una referencia plano a plano en Remotion, o para los efectos de ese estilo (grid 3×3, flash con máscara, cámara dentro de la foto, subtítulos blancos sobre foto y negros sobre blanco, piezas que entran girando, "Error." que se desvela, selección de texto iOS, iPhone 3D, cierre de marca). También para montar la voz con Whisper o ElevenLabs y para las rondas de corrección de ese tipo de vídeo.
---

# Vídeo de historia con fotos en Remotion (estilo Milionegle · Formato A)

Esta skill recoge cómo se hizo el piloto de Milionegle "Gates y Allen" y **todas las correcciones de Erik**. Las reglas de estilo de abajo ya las ha validado él: aplícalas desde el primer render, no esperes a que te las vuelva a pedir.

- Proyecto de ejemplo, completo y funcionando: `C:\Users\erikr\remotion\milionegle\video` (copia en `plantilla/` dentro de esta skill).
- Detalle de cada efecto con sus números: `references/efectos.md`.
- Rondas de corrección textuales y qué se cambió: `references/correcciones.md`.
- Prompts de la fase previa (Gemini, Cowork, prompt maestro para Code): `references/prompts.md`.
- Organización de carpetas y entregables: `references/carpetas.md`.
- Prompt original del piloto: `references/prompt_original_milionegle.md`.

## Flujo de trabajo

1. **Leer la carpeta de entrada** (ver `references/carpetas.md`): `referencias/` (vídeo de referencia, desglose de Gemini, guion `formato_X.md`, `fuentes.txt`, capturas y moodboard, logo), `assets/` (fotos, grabación de la app), `sfx/`.
2. **Medir la referencia** antes de programar. Manda lo que mida `ffprobe`, no lo que diga Gemini: Gemini dijo 9:16 y 30 fps, y era 1276×718 a 24 fps.
   - Cortes con `select='gt(scene,0.3)',showinfo` → `ref/cortes.txt`.
   - Fotogramas cada 0,5 s de los primeros 25 s y cada 2 s del resto → `ref/frames/`.
   - Fotogramas a los fps nativos de cada efecto → `ref/efectos/<nombre>/`.
   - RMS cada 0,5 s → `ref/audio_rms.txt`.
   - Lo que mides se apunta en `ref/medidas.md`.
   - **Los primeros 13-23 s de la referencia son el manual de estilo**: estúdialos al milímetro y aplica ese lenguaje al resto.
3. **Preparar los assets**:
   - Escalar las fotos pequeñas: Real-ESRGAN x4 y, si no se puede ejecutar, Lanczos x2 con unsharp.
   - Máscaras de personas y objetos con `rembg` (`u2net_human_seg` para personas, `isnet-general-use` para objetos), limpiadas a mano.
   - SFX clasificados por tipo.
4. **Voz**:
   - Si hay ID de voz de ElevenLabs: `eleven_v4`, **una sola toma con todo el texto** (no por frases) y etiquetas de tono por bloque (`[curious]`, `[dramatically]`, `[mischievously]`, `[warmly]`, `[softly]`, `[pause]`, `[short pause]`). El texto tiene que ser exactamente el del guion.
   - Si no hay ID, usar edge-tts `es-ES-ElviraNeural` por bloques, con pausas.
   - Después, siempre `npm run voz -- ruta/al/audio`, que saca los tiempos por palabra con Whisper medium + DTW.
   - Limitar la voz a −4 dBFS de pico si viene caliente.
5. **Montar con la línea de tiempo anclada a palabras**: cada evento se coloca con `at("frase", n)` sobre los tiempos de Whisper, nunca con segundos a mano. Así, al cambiar la voz, todo se recoloca solo.
6. **Comprobar** con stills en los momentos clave (contact sheet), `freezedetect` (0 congelados), EBU R128 (≈ −18 LUFS, pico ≤ −1 dBFS) y la sincronía en los momentos fuertes.
7. **Entregar en `entrega/`**: el MP4, `creditos.txt` (imágenes CC BY-SA), `pendientes.md` (cambios de la versión y pendientes) y la voz original. Copia del MP4 en `producido/`.

## Reglas de estilo (validadas por Erik)

### Cámara y fotos
- **Las fotos de la historia van a pantalla completa y la cámara se mueve DENTRO de la foto.** Nunca se ve blanco alrededor mientras se explica una foto. Para señalar a alguien ("1978", "Gates", "la esquina de abajo a la derecha") la cámara se desplaza o se acerca por la imagen.
- **Explicar dentro de la imagen**: mientras la voz habla de una foto, quédate en ella y muévete por ella. No saques la explicación a otra pantalla.
- **Movimiento**:
  - Curva lento-rápido-lento: `bezier(0.83,0,0.17,1)`, unos 13-14 fotogramas a 24 fps.
  - **Desenfoque de movimiento lineal** proporcional a la velocidad, con obturador de unos 0,5: factor 0,16 por píxel de desplazamiento y tope de 9 px.
  - Sin desenfoque en los fotogramas de corte.
- **Corte de acercamiento**: en vez de animar un zoom, corte seco a un encuadre más cerrado. Después se sale hacia atrás con movimiento y desenfoque.
- **Bordes desenfocados** cuando el plano se cierra sobre alguien: elipse nítida en el centro y 6 px de desenfoque en los bordes. Fondo desenfocado con la persona nítida usando su máscara.
- **Empuje continuo**: siempre hay un acercamiento suave, de un 1,8 % por segundo desde el último corte. **Nunca un plano quieto.**
- **Ritmo: un cambio visual cada 1-1,5 s.** 2 s es demasiado lento.
- Grano en todas las fotos (opacidad ≈ 0,16) y viñeta suave.

### Grid de inicio (la referencia la mide exacta)
A pantalla completa sobre la foto icónica:
- F1: blanco al 75 %.
- F2-F9: foto desenfocada (12 px) con rejilla 3×3 de líneas de 1 px en blanco al 40 %.
- Desde F10 se revela una casilla cada 2,4 fotogramas, en el orden `[0,1,8,2,4,6,5,3,7]`: 1 fotograma blanco y 1 fotograma al 50 %, y queda nítida.
- La rejilla se va en el fotograma 36.

### Flash de cámara con máscara
Cuando la voz nombra algo o a alguien que se ve, se rellena **solo su recorte** de blanco al 85 % con el patrón **ON ON OFF ON ON** (24 fps). El resto de la imagen no cambia y suena un click de cámara en ese mismo fotograma. Como mucho uno cada 3-4 s.

### Texto
- Tipografía: **SF Pro Display Bold** (en `public/fonts/`). Interletrado entre −0,02 y −0,035 em.
- **Subtítulos sobre foto: BLANCOS** con sombra oscura difusa, de 46 px a 718 de alto, centrados y con la línea base al 70 % del alto. Una palabra (o grupo corto) cada vez.
- **Texto sobre fondo blanco: NEGRO**, con aparición rápida: 3 fotogramas de fundido, desenfoque de 5 a 0 px y pop de escala de 1,18 a 1.
  - **Siempre con sombra suave** (`0 5px 16px rgba(0,0,0,.16), 0 1px 3px rgba(0,0,0,.14)`), porque de cerca no puede quedar plano.
- **Se remarca cambiando el tamaño, no con subrayados ni cajas.**
  - La palabra clave va grande y la que la acompaña pequeña: "13" grande + "años" pequeño; "Once" + "personas".
  - Las palabras remarcadas se colocan dentro de la foto, junto a lo que señalan.
- **Prohibido el subrayado de marcador.** Si hay que señalar un texto, usar la **selección de texto de iOS**: el texto se escribe letra a letra y luego aparecen el resaltado azul, los tiradores y el menú Cortar · Copiar · Buscar · Compartir….
- **El glitch (aberración cromática azul/roja con temblor de 4 fotogramas) SOLO va en nombres propios** (Gates, Paul Allen…), nunca en otras palabras.
- Color de los nombres: `#38BDF8` solo en la pregunta final ("¿dónde está tu **Paul Allen**?").
- **Micro zoom continuo** en todo el texto: 4-8 % mientras está en pantalla.
- Las cifras **cuentan desde 0** ("100.000 $": 14 fotogramas, ease-out, separador de miles con punto, números tabulares).
- **Karaoke** sobre blanco para frases de reflexión: la frase entera en gris `#ADADB4` y la palabra que suena en negro con sombra, a 54 px y ajustada al 86 % del ancho.
- Los subtítulos solo se ven en los tramos de foto: no se arrastran a la escena blanca siguiente.
- Márgenes del 5 %. Si una fila no cabe, se reduce el tamaño (`fitSize`) y nunca se desborda.

### Piezas sobre blanco
- Fondo blanco con viñeta gris muy suave (`radial #FFF 40 % → #E3E3E7`) y grano al 0,05.
- **La imagen va en el centro, sin borde blanco**, con sombra realista: `0 22px 44px rgba(0,0,0,.30), 0 6px 14px rgba(0,0,0,.18)`.
- **Entra girando**:
  - Escala de 0,32 a 1, rotación del giro final + 11° hasta el giro final (unos −3°).
  - Desenfoque de 6 px a 0 en 5 fotogramas.
  - Desplazamiento de (90, 30) px a 0, con curva de entrada de 8 fotogramas.
  - Deriva de rotación de 0,02°/fotograma.
- **Las palabras van a izquierda y derecha** de la pieza mientras se dicen ("Se llamó [pieza] MS-DOS"), las dos filas al mismo tamaño y separadas 40 px de la pieza.
- Para la pantalla de puntuación ("Error."): **lo que había antes cae con gravedad** (curva de salida, 11 fotogramas, cada elemento con su retardo y su giro) **y desvela la palabra, que ya estaba detrás**, sin animación de aparición. Suenan un whoosh al caer y un golpe cuando queda a la vista. Nunca un "Error." solo y plano.

### Pantallas de texto con máscara cuadrada (estilo un respiro)
Para una frase con peso (la tesis del vídeo, un giro o una frase que tiene que quedarse), el plano se corta a una pantalla lisa y la frase sale de un bloque cuadrado. Validado en "Busca el quién, luego el cómo". Detalle y números en `references/efectos.md` → "Pantalla con máscara cuadrada". Componente `BlockReveal` en `plantilla/video/src/components/Blocks.tsx`.
- **Secuencia, fotograma a fotograma (30 fps)**:
  - F0-F1: destello blanco a pantalla completa.
  - F2-F4: pantalla clara `#F2F2F4` con un bloque negro en el centro (ancho 0,8 × el tamaño de letra, alto 0,44 ×). Es el "cursor".
  - F5-F6: se invierte: fondo `#050505` y bloque claro.
  - F7 en adelante: fondo final (claro u oscuro) y la frase **centrada**, palabra a palabra según se dice. **Cada palabra sube desde abajo** (0,45 × el tamaño de letra, curva de entrada de 7 f) con un fundido de 4 f.
- **Variante clara** (fondo claro y texto negro) para la frase principal, en grande (≈ 124 px a 1080) y repartida en dos líneas. **Variante oscura** (fondo negro y texto blanco) para un golpe corto ("no me lo habría creído").
- En la última palabra clave, **corte de acercamiento** del bloque de texto a ×1,22 (sin animación) y un golpe de sonido.
- Sonido: obturador de cámara en el destello y riser que se corta en seco al entrar la pantalla.
- Sin imagen detrás: la frase sola, para que pese.

### Textura de pixeles de pantalla
**Nunca un fondo liso plano.** Encima de toda pantalla blanca o negra (escenas sobre blanco, pantallas de texto, piezas) va una textura de pantalla vista de cerca. Detalle en `references/efectos.md` → "Textura de pantalla". Componente `ScreenTexture` en `Blocks.tsx`.
- Rejilla de píxel: líneas de 1 px cada 3 px en horizontal y en vertical, negras al 4,5 % sobre claro o blancas al 3,5 % sobre oscuro.
- Parpadeo de refresco casi imperceptible: una capa del color contrario con opacidad entre 0,006 y 0,018 que cambia cada fotograma.
- Viñeta: transparente hasta el 55 % y luego negra al 10 % sobre claro (al 50 % sobre oscuro).
- Va por encima del contenido y del grano (`pointer-events: none`). En el fotograma del destello blanco no se pone.
- Con metraje de referentes (Jobs, Musk, una película), la versión en vídeo es la **trama de puntos** (`scripts_py/halftone.py`). Celda de 3 a 5 px (muchos puntos pequeños, que se vean pero sin dominar), el tamaño del punto proporcional al brillo, mezcla del 28 % al 60 % según se acerca la cámara y empuje de ×1,22.

### Marca y app (últimos segundos)
- Icono de la app (la M 3D blanca dentro de un squircle negro):
  - Entra con un pop y suena un chasquido.
  - Después se desliza a la izquierda y "Milionegle" en negro sale de una máscara, de abajo arriba con un pequeño desenfoque.
  - Debajo, la frase de marca palabra a palabra.
- **App: como mucho 1,5-2 s** dentro de un **iPhone 3D**, siempre en los últimos 3 s:
  - Perspectiva y canto de titanio con grosor.
  - Reflejo en el cristal y giro lento.
  - El vídeo llena la pantalla entera con `cover`, sin rectángulos grises.
  - La frase va a los lados del móvil.

### Sonido
- **Pop o click en cada palabra o elemento que aparece**, alternando muestras y variando un poco el volumen (≈ 0,1). Si caen varias en menos de 80 ms, un solo sonido.
- **Whoosh** sincronizado con el pico de velocidad de cada movimiento.
- **Riser que acaba justo en el golpe y se corta en seco**:
  - Uno ya en el primer segundo del hook.
  - Hacia "solo" o la puntuación.
  - Hacia el giro de la crisis.
  - Uno suave hacia la pregunta final.
- **Click de cámara** en cada flash. Golpe en la puntuación y en el logo. Engranaje en las transiciones de bloque.
- Los efectos nunca tapan la voz. Mezcla final ≈ −18 LUFS con el pico por debajo de −1 dBFS.
- Música (si hay): baja bajo la voz y se silencia en la puntuación.

## Qué no hacer
- Mostrar blanco alrededor de una foto mientras se explica.
- Subrayados de marcador, o glitch fuera de los nombres.
- Planos quietos o cambios de más de 2 s.
- Texto negro plano, sin sombra.
- La app antes de los últimos 3 s o más de 2 s en pantalla.
- Clips de películas, música con derechos o datos inventados (si un dato no está verificado, va a `pendientes.md`).
- Fiarse de las medidas de Gemini sin medir con ffprobe.
- Fondos blancos o negros planos, sin la textura de pixeles de pantalla.
- Puntos de trama gruesos (más de 6 px) que tapen la imagen del referente.

## Trucos técnicos que costaron encontrar
- Whisper.cpp: los tiempos por token (DTW) devuelven −1 si no se desactiva flash attention (`additionalArgs: ["-nfa"]`). Usar DTW − 220 ms y ajustar al final de cada silencio de `silencedetect`. `voz.mjs` ya lo hace.
- Alinear las palabras del guion con lo que oye Whisper por distancia de edición (`guion.ts`). Whisper escribe "11", "100.000" o "MS2", pero se muestra el texto del guion.
- `at("frase")` puede coincidir con una aparición anterior: usa `nth` o una frase más larga ("Mira la esquina", no "Mira").
- El vídeo de la app va dentro de un `<Sequence from={t}>` para que empiece por su primer fotograma.
- Con detección de TLS en la red: `node --use-system-ca` y `yt-dlp --compat-options no-certifi`.
- rembg: si falla la descarga del modelo, bajarlo a mano a `~/.u2net`.
