# Análisis de referencias: ficha de edición medida

Dos herramientas de línea de comandos para estudiar un reel de referencia y replicar su estilo en Remotion con números, no a ojo:

- **`analizar.py`** mide el vídeo y escribe una **ficha de edición**: planos, ritmo, flashes, movimiento de cámara, texto, color y audio, y lo traduce a componentes del kit (`CameraPush`, `ZoomThrough`, `FlashCut`, `WhipPan`, `Shake`, `WordCaptions`, `PopFromWord`, `GlassSlats`, `Finish`).
- **`calco.py`** compara un tramo de la referencia con nuestra versión, fotograma a fotograma, y da el error en píxeles con imágenes de superposición (onion skin). Sirve para validar un calco con error ≤4 px, como hace Erik.

Automatiza el análisis que Erik hizo a mano con ffprobe, OpenCV, demucs y librosa sobre tres reels.

---

## 1. Instalación

Hace falta **Python 3.10 o posterior** y **ffmpeg/ffprobe** en el PATH.

### Linux / macOS

```bash
cd kit/analisis-referencias
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# ffmpeg: sudo apt install ffmpeg   |   brew install ffmpeg
```

### Windows

1. Instala Python desde python.org y marca **"Add python.exe to PATH"** en el instalador.
2. Instala ffmpeg. En PowerShell: `winget install Gyan.FFmpeg`. Si no tienes winget, usa `choco install ffmpeg` o descarga el zip de gyan.dev y añade su carpeta `bin` al PATH. Cierra y vuelve a abrir la terminal, y comprueba que `ffmpeg -version` responde.
3. En PowerShell, dentro de `kit\analisis-referencias`:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1        # si da error de permisos: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
pip install -r requirements.txt
py analizar.py "C:\Users\erik\Videos\reel.mp4" --out "C:\Users\erik\Videos\reel_ficha"
```

Si ffmpeg no está en el PATH, puedes indicar dónde está: `$env:FFMPEG="C:\ffmpeg\bin\ffmpeg.exe"; $env:FFPROBE="C:\ffmpeg\bin\ffprobe.exe"`. En la hoja de contactos se usa Arial si no está DejaVu.

### Opcionales

| Paquete | Para qué | Instalación |
|---|---|---|
| `rapidocr_onnxruntime` | `--ocr`: lee el texto de los subtítulos (inglés y español sin tildes fiables) | `pip install rapidocr_onnxruntime` |
| `demucs` | `--demucs`: separa el stem de batería, como hizo Erik. Es lento y pesado porque instala PyTorch | `pip install demucs` |
| `pyloudnorm` | Solo para las pruebas: contrasta el LUFS de ffmpeg | `pip install pyloudnorm` |

Sin demucs, el analizador separa la parte percusiva con HPSS de librosa, que se aproxima a la batería.

---

## 2. Uso

```bash
python analizar.py reel.mp4                          # crea reel_ficha/
python analizar.py reel.mp4 --out fichas/marca_01 --fps-objetivo 30
python analizar.py reel.mp4 --ocr --demucs           # con texto leído y stem de batería
```

Salida en la carpeta:

| Archivo | Contenido |
|---|---|
| `ficha.md` | Ficha legible: resumen, metadatos, planos, ritmo cada 5 s, flashes y tramos, movimiento por plano, texto, color, audio y **"Cómo replicarlo en Remotion"** |
| `ficha.json` | Lo mismo en datos, más `remotion.planos[]` (desde_f, dur_f, componente, parámetros) y la luminancia por fotograma |
| `contact_sheet.png` | Un fotograma (el central) por plano con número, duración en f y s y clase de movimiento. Los planos de ≤8 f van con borde naranja |
| `ritmo.png` | Duración de cada plano en el tiempo, con líneas de 8 f y 3 s y los flashes marcados. Debajo, los cortes sobre la fuerza de onset del audio |

Opciones útiles:

| Opción | Por defecto | Qué hace |
|---|---|---|
| `--fps-objetivo` | 30 | fps de la composición de Remotion. Todas las duraciones se dan también como "f@30" |
| `--umbral-corte` | 0,12 | Sensibilidad del detector de cortes. Bájalo (0,08) si se escapan cortes entre planos parecidos y súbelo si sale algún corte falso |
| `--detector scenedetect` | propio | Usa AdaptiveDetector de PySceneDetect para comparar. En las pruebas acierta menos: ver §5 |
| `--tolerancia-beat` | 2 | Fotogramas de margen para decir que un corte cae en un onset |
| `--min-tramo` / `--max-flash` | 6 / 5 | Un tramo liso de ≥6 f cuenta como tramo (blanco o negro). Un pico de luz de ≤5 f cuenta como flash |
| `--lado-analisis` | 640 | Resolución de análisis (lado mayor). Si la subes, gana algo de precisión en el temblor y tarda más |
| `--sin-audio`, `-q` | | Sin análisis de audio; sin mensajes de progreso |

### Qué mide y cómo

- **Metadatos** (ffprobe): resolución (corregida por rotación), fps (si el vídeo es VFR, lo remuestrea a CFR y lo avisa), duración, códecs, perfil, bitrates y tamaño.
- **Planos**: histograma HSV + diferencia de píxeles + fallo del ajuste de movimiento, con umbral adaptativo. Se descartan los paneos y zooms rápidos que conservan la paleta. Para cada plano da el inicio y el fin en f y s. En conjunto, media, mediana, p10, p25, p75 y p90, número de planos ≤8 f (a fps objetivo), planos ≥3 s y su porcentaje del tiempo, y cortes/s por tramos de 5 s.
- **Cortes especiales**: el **punch-in** (salto de escala ≥6 % en un fotograma sin cambiar de plano) y el **látigo** (fotogramas borrosos junto al corte, con dirección horizontal o vertical sacada del gradiente).
- **Flashes y tramos**: luminancia media por fotograma frente a su mediana móvil. Para cada flash da su duración, si es blanco puro o destello parcial y si está en un corte o dentro de un plano. Un **tramo liso** (blanco, negro o color) es un fotograma con ≥92 % de píxeles iguales por canal, así que admite texto encima y descarta los degradados.
- **Movimiento por plano**: Lucas-Kanade y semejanza RANSAC (escala, rotación y traslación del centro). La velocidad de zoom y los totales salen de pares separados ~1/3 s, porque con pares consecutivos LK sobrestima el zoom lento un 10 %. Por plano da:
  - zoom en **% por segundo exponencial**, zoom total y pico en %/f;
  - paneo en px del original y en % del ancho por segundo;
  - rotación en °/s;
  - temblor como RMS del residuo sobre una tendencia Savitzky-Golay de 0,35 s, con su frecuencia dominante.
  
  **Clases**: fijo, empuje, alejamiento, zoom rápido, paneo, paneo látigo, rotación, temblor (se pueden combinar). **Curva**: ajusta a la vez inicio, fin y `Easing.bezier(a, 0, 1-b, 1)` al progreso del movimiento, y lo etiqueta como lineal, ease-in, ease-out o ease-in-out.
- **Texto**: bordes, cierre horizontal y filtros de contraste y transiciones. Los bloques que se pegan a otras formas se parten por filas. Da zonas por altura (y en %), presencia, tamaño de caja y cada cuántos fotogramas cambia el texto, que sirve para detectar palabra a palabra. Con `--ocr`, también el texto leído.
- **Color**: k-means en Lab (paleta global y por tramos de 5 s), saturación y luminancia medias, contraste, temperatura b\* y tinte a\*, viñeta (esquinas frente a centro) y ruido estimado.
- **Audio**:
  - con ffmpeg: LUFS integrados, true peak y LRA (ebur128) y silencios (silencedetect, −45 dBFS, ≥0,25 s);
  - con librosa: onsets, tempo y beats.
  
  El **% de cortes a ±2 f de un onset** se calcula sobre tres referencias: todos los onsets, la batería (HPSS o demucs) y los beats. Se compara con una **línea base de cortes aleatorios** (Monte Carlo, en fotogramas enteros) y se da el p-valor binomial. Es la misma comparación que hizo Erik (45 % frente a 11 % de control). También da el desfase mediano de los aciertos, es decir, si la referencia corta antes o después del golpe.

### Cómo se traduce a Remotion

La sección final de `ficha.md` aplica estas reglas (umbrales del kit `motion-remotion`):

- **Modo de ritmo** según el plano mediano a fps objetivo: ≤12 f → energía; ≤36 f → narrativo; más → respiro/peso. Lista los planos de peso (≥3 s).
- **Cámara**, con una fila por plano que indica desde dónde, cuánto dura, la clase medida, el componente y sus parámetros:
  - empuje → `CameraPush` con su %/s exponencial y la curva si no es lineal;
  - zoom rápido que acelera hacia el corte o frena al entrar → `ZoomThrough`;
  - paneo → desplazamiento en px, dirección de cámara y `Easing.bezier(...)`;
  - látigo o plano no medible → `WhipPan`;
  - temblor → `Shake` con amplitud en px a 1080, Hz y rotación.
- **Transiciones**:
  - `FlashCut` con su duración en f@30 y la lista de cortes;
  - flashes dentro de plano;
  - punch-in con su % (el kit avisa de que con <10 % parece un error);
  - tramos lisos.
  
  `GlassSlats` no se detecta: búscalo a ojo en la hoja de contactos.
- **Texto**: `WordCaptions` con zona, y en % y px a 1920 y tamaño de caja. Si el texto cambia cada ≤12 f, añade `PopFromWord` con los f por palabra.
- **Música**:
  - si el % de cortes en onset supera claramente al control (p<0,05), la ficha dice "corta al golpe: clava 1-2 cortes estructurales y deja el resto a ±2 f"; si no, "≈ azar, monta por sentido";
  - rejilla en f por beat;
  - LUFS y true peak para igualar el máster;
  - silencios.
- **`Finish`**: paleta, saturación, viñeta y ruido. El ruido incluye textura, así que compáralo pasando nuestro render por el mismo analizador.

Los nombres de componente son los del kit. Comprueba en su código los nombres exactos de las props.

---

## 3. Bajar un reel para estudiarlo

Solo para **análisis interno**: no se republica, ni se reutilizan su música o sus imágenes.

- **Skill `descargar-reels-instagram`** de Erik: baja los reels de una cuenta pública (vía save-free.com), los renombra y los guarda en una carpeta por marca. Después basta con `python analizar.py carpeta/marca/reel_01.mp4`.
- **yt-dlp** (Instagram, TikTok, YouTube Shorts):

```bash
pip install yt-dlp
yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "%(uploader)s_%(id)s.%(ext)s" "https://www.instagram.com/reel/XXXX/"
# Instagram suele pedir sesión: añade  --cookies-from-browser chrome   (o firefox / edge)
# TikTok sin marca de agua: yt-dlp "https://www.tiktok.com/@cuenta/video/123"
# Un perfil entero (con mesura):  yt-dlp --max-downloads 20 "https://www.tiktok.com/@cuenta"
```

Analiza el archivo tal como se descarga. Si lo recodificas antes, se pierden fotogramas y se mueven los cortes. Si el reel viene a 1080×1920 y 30 fps (lo normal), la ficha sale directamente en f@30.

---

## 4. `calco.py`: validar un calco

```bash
python calco.py referencia.mp4 nuestro.mp4 --desde 120 --hasta 180          # alinea por el primer corte
python calco.py referencia.mp4 nuestro.mp4 --desde 120 --hasta 180 --offset -2
python calco.py referencia.mp4 nuestro.mp4 --desde 120 --hasta 180 --modo trayectoria
```

- `--desde` y `--hasta` son fotogramas de la **referencia** (incluidos). Nuestro fotograma = referencia + offset. El offset lo das tú con `--offset` o se calcula con `--alinear corte` (opción por defecto), que alinea el primer corte de cada vídeo desde `--desde`. Si no hay corte en los dos vídeos, el offset es 0.
- **Modo `directo`**: registra nuestro fotograma sobre el de la referencia. El error es el desplazamiento medio de las 4 esquinas y el centro, en px de la referencia, y se desglosa en posición, escala y rotación. Es el modo para un calco de la misma foto o del mismo vídeo.
- **Modo `trayectoria`**: si la imagen es distinta (otra foto, mismo movimiento), compara el movimiento de cámara acumulado desde el primer fotograma del tramo. No ve un desfase constante de encuadre.
- **Modo `auto`** (por defecto): usa directo si el registro funciona en ≥70 % de los fotogramas y trayectoria si no.
- **Veredicto**: APROBADO si el p95 del error es ≤ `--umbral` (4 px).
- **Salida**:
  - `calco.md`: resumen;
  - `calco.json` y `calco.csv`: datos por fotograma;
  - `onion_XXXXX.png`: superposición en los fotogramas clave y en el peor fotograma. A la izquierda va la mezcla 50/50; a la derecha, la referencia en magenta y el nuestro en verde, con gris donde coinciden;
  - `onion_resumen.png`.
- Si nuestro render tiene otra resolución o fps, se escala o se remuestrea a los de la referencia y se avisa.

---

## 5. Pruebas y precisión medida

```bash
python tests/probar.py --regenerar      # genera los vídeos sintéticos (≈20 s) y comprueba todo
```

`tests/generar_sinteticos.py` crea vídeos con verdad conocida en `tests/salida/` (12 MB, no se guardan en el repositorio):

- **v1**: 540×960 a 30 fps. Cortes en fotogramas dados, punch-in del +20 %, planos de 8, 7 y 6 f, zoom exponencial del 2 %/s, flash blanco de 3 f en un corte y paneo de 240 px con `bezier(0.83,0,0.17,1)`. Además, temblor de 6 Hz, tramo negro de 10 f, subtítulos palabra a palabra cada 8 f en y=72 % y destello parcial dentro de plano. El audio lleva clics a 120 BPM con 1 s de silencio.
- **v2**: 720×1280 a 25 fps, hecho solo con filtros de ffmpeg (testsrc2, smptebars, mandelbrot, flash blanco, rgbtestsrc, gradients) y clics con `aevalsrc`.
- **Calco**: cuatro variantes a 1080×1920 con error verdadero calculado analíticamente.

Resultado de la última ejecución: **47 de 47 comprobaciones correctas**.

| Medida | Verdad | Medido | Error |
|---|---|---|---|
| Cortes (v1: 9, v2 a 25 fps: 5) | fotogramas exactos | idénticos | **0 f** |
| Duración de planos, ≤8 f, ≥3 s | | idénticos | 0 f |
| Punch-in | f25, +20 % | f25, +20,0 % | 0 |
| Flash blanco en corte | f156, 3 f | f156, 3 f | 0 f |
| Destello parcial dentro de plano / tramo negro | 2 f / f280 10 f | idénticos | 0 f |
| Zoom exponencial | 2,00 %/s | 2,00 %/s | <0,01 %/s (con pares consecutivos daba 2,21) |
| Paneo | −240 px | −239,9 px (−479,8 a 1080) | 0,1 px |
| Curva del paneo | bezier(0,83 / 0,83), f166-226 | (0,85 / 0,85), f164-228 | 0,02 de influencia, 2 f en los extremos |
| Temblor | 5,83 px RMS, 6 Hz | 6,34 px, 6,15 Hz | 0,5 px, 0,15 Hz |
| Planos fijos sin falsos movimientos | 6 | 6 | — |
| Subtítulos | y=72 %, 8 f por palabra | 72,5 %, 7,4 f | 0,5 %, 0,6 f |
| Tempo | 120 BPM | 120,2 | 0,2 BPM |
| LUFS integrados (ffmpeg frente a pyloudnorm) | −18,96 | −19,0 | 0,04 LU |
| Silencio | 7,00-8,00 s | 7,00-8,00 s | <0,01 s |
| Onsets frente a clics | 21 clics | 21 detectados | media 0,22 f, máximo 0,39 f |
| Cortes a ±2 f de un clic | v1 4/9, v2 3/5 | 4/9, 3/5 | 0 |
| Calco casi igual (+2 px, escala ×1,002) | 2,81 px | 2,84 px, APROBADO | 0,03 px |
| Calco desviado (+4 px, ×1,003, 1 f tarde) | 8,33 px | 8,32 px, NO APROBADO | 0,01 px |
| Calco con otra imagen y la misma cámara (trayectoria) | 0 px | 0,08 px | 0,08 px |
| Alineación por corte (versión con 3 f de retraso) | offset +3 | +3, error 0,03 px | 0 f |

**Comparación con PySceneDetect** (`--detector scenedetect`, AdaptiveDetector) en v1: se le escapan los cortes de f53 (plano de 7 f) y f156 (enmascarado por el flash) y da un corte falso en el destello de f320. El detector propio acierta los nueve.

**Rendimiento**: con un reel de 60 s a 1080×1920 y 30 fps, el análisis completo tarda ~60 s (unas 1× tiempo real) en un núcleo. Con `--ocr` sube a ~80 s. `calco.py` tarda ~5 s por tramo de 50 fotogramas a 1080×1920.

---

## 6. Limitaciones

- **Fundidos encadenados largos** (>10 f) y cortes entre dos planos casi iguales (mismo decorado y encuadre) pueden escaparse: revisa la hoja de contactos. Las transiciones con máscara (`GlassSlats`, wipes) se detectan como un corte en algún punto de la transición, no como transición.
- **Movimiento**: mide el movimiento dominante de la imagen. Con un sujeto grande moviéndose sobre fondo liso, mide al sujeto. Los contenidos animados (pantallas, partículas) pueden parecer paneo o temblor (le pasa a testsrc2 en v2). En látigos con mucho desenfoque el flujo falla: el plano sale como "no medible" y el corte como "látigo".
- **Curvas**: el ajuste usa la familia AE `bezier(a,0,1-b,1)`. Con overshoot o spring no hay rebote que ajustar y se queda con la curva más cercana.
- **Texto**: la detección por bordes es aproximada. No ve palabras de una letra y puede confundir texturas finas y contrastadas con texto. Úsala para la posición y el ritmo; para el contenido, `--ocr`, que solo lee bien el texto grande y no lee tildes con fiabilidad.
- **Audio**: los onsets en los primeros ~100 ms no se detectan, y el final de un tono puede contar como onset. Con música densa, el porcentaje de "todos los onsets" se infla porque hay onsets en todas partes: mira la columna de batería y el control aleatorio, no el número solo. HPSS es una aproximación a la batería; para replicar el método de Erik, usa `--demucs`. Instagram y TikTok normalizan el volumen al reproducir, así que el LUFS de un reel descargado es el del archivo, no el que oye el usuario.
- **Recompresión**: los reels descargados ya vienen comprimidos. Los flashes de 1 f y los planos de 1-2 f pueden quedar emborronados por el códec. La duración mínima de plano es `--min-plano 2`.
- **VFR**: algunos TikTok vienen a fps variable. Se remuestrean a 24, 25, 30, 50 o 60 fps (el más cercano a la media), y eso puede mover un corte ±1 f.
