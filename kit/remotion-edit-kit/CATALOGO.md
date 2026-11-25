# Catálogo · remotion-edit-kit

Kit de componentes de edición en Remotion para reels verticales **1080×1920 a 30 fps**. Cada componente lleva props tipadas, valores por defecto con su porqué (en el código) y nada de `Math.random`: el mismo fotograma da siempre la misma imagen. Los números vienen de `skills/motion-remotion` y de las reglas validadas por Erik en `skills/video-historia-remotion`; las transiciones "medidas" (PopFromWord, GlassSlats) reproducen sus medidas al píxel.

## Uso rápido

```bash
npm install                 # versiones exactas en package.json (Remotion 4.0.547)
npm run studio              # Studio: composición "Demo" + carpeta "Componentes" (una vitrina por componente)
npm run typecheck           # tsc --noEmit
npm run render:demo         # out/demo.mp4 a 1080×1920 (unos 3,5 min con 2 núcleos)
npm run master              # out/demo-master.mp4 a −14 LUFS / −1 dBTP (Remotion no normaliza)
node scripts/stills.mjs Demo 30,95,227 out/stills 0.5   # stills sueltos en un solo bundle
npm run sfx                 # regenera los efectos sintéticos de public/sfx/
```

Sin red para descargar Chromium: `REMOTION_BROWSER=/ruta/chrome-headless-shell` (ya apunta solo al de Playwright en `/opt/pw-browsers` si existe).

```tsx
import {CameraPush, FlashCut, WordCaptions, firmaErik, springs} from './kit';
```

**Convenciones**
- Todo en fotogramas a 30 fps, relativos a la `<Sequence>` donde vive el componente. A 24 fps multiplica por 0,8.
- Las transiciones (`ZoomThrough`, `WhipPan`, `GlassSlats`, `PixelDissolve`, `HandOff`, `DeviceThrough`) reciben `a` y `b`. Para que el reloj de una escena siga corriendo dentro de la transición, envuélvela con `<Sequence from={-n} layout="none">` (ver `src/Demo.tsx`).
- Coordenadas en px de la composición (1080×1920). Zonas seguras de Reels en `SAFE` (220 arriba, 420 abajo, 60 izq., 120 der.).
- Antes de renderizar, pasa la revisión anti-robot de `motion-remotion §13` y mira stills de inicio, pico y final de cada movimiento.

---

## Curvas y springs · `src/kit/ease.ts`

| Nombre | Valor | Para |
|---|---|---|
| `aeInfluence(a, b)` | `bezier(a, 0, 1-b, 1)` | Traducir influencias de AE. Pasada "diseñada": a 0,5-0,7, b 0,6-0,8 |
| `materialEnter` | `bezier(0.05, 0.7, 0.1, 1)` | Lo que entra a cuadro (decelera) |
| `materialExit` | `bezier(0.3, 0, 0.8, 0.15)` | Lo que sale (acelera); 50-80 % de la duración de la entrada |
| `standard` | `bezier(0.2, 0, 0, 1)` | Recolocar algo que ya se ve |
| `firmaErik` | `bezier(0.83, 0, 0.17, 1)` | Movimiento que empieza y acaba en cuadro; `FIRMA_ERIK_F30 = 17` f |
| `expoOut` | `bezier(0.16, 1, 0.3, 1)` | Cifras, tracking que se cierra |
| `cutIn` | `bezier(0.55, 0, 1, 0.45)` | Tramo que acaba en un corte (pico de velocidad al cortar) |
| `springs.popPremium` | damping 14, stiffness 180, mass 0,8 (~10 %) | Solo el héroe |
| `springs.asentado` | damping 14, stiffness 100 (~5 %) | Apoyos físicos (tarjetas) |
| `springs.sinRebote` | damping 18, stiffness 120, clamp (~0 %) | Todo lo demás, texto incluido |

Ayudas: `tween(frame, [f0,f1], [v0,v1], curva)`, `springAt(frame, fps, delay, 'popPremium')`, `expScale(s0, s1, e)` (zoom en logarítmico), `cosFade(t, dur)`, `clamp`.

---

## Componentes

### WordCaptions
- **Hace sentir**: que la voz "escribe" la pantalla; ritmo y claridad sin esfuerzo de lectura.
- **Cuándo**: cualquier tramo con voz. Modo `foto` (blanco con sombra oscura) sobre imagen; `blanco` (negro con sombra suave) sobre papel.
- **Cuándo NO**: sobre un plano de peso que debe respirar en silencio; con una pantalla de texto grande ya en cuadro (dos textos compiten). Nunca se arrastran a la escena blanca siguiente: córtalos con la `Sequence`.
- **Props**: `words` (Whisper, segundos) · `modo='foto'` · `claves=[]` (acento; sin tildes ni mayúsculas importan) · `acento` (#38BDF8 en foto, #0B6BD3 en blanco para contraste ≥ 4,5:1) · `fontSize=72` · `maxChars=22` (2-4 palabras por línea) · `pausaCorte=0.35` s (pausa que abre línea nueva) · `y=1290` (centro de línea, por encima de los 420 px inferiores) · `revelar='palabra'` · `hold=12` f · `popFrames=3` (pop 1,18→1 con desenfoque 5→0, validado). La línea no se recoloca: las palabras futuras ocupan su hueco con opacidad 0. `fitSize` automático si no cabe.
```tsx
<Sequence durationInFrames={225}>
  <WordCaptions words={words} modo="foto" claves={['cámara', 'datos']} />
</Sequence>
```

### KineticTitle
- **Hace sentir**: que el texto se construye; peso tipográfico sin efectos.
- **Cuándo**: títulos, tesis, cierre. Por `caracter` para 1-3 palabras de peso; por `palabra` en líneas largas.
- **Cuándo NO**: subtítulos (usa WordCaptions); más de un título cinético por escena; tracking hero en algo que no sea el momento hero.
- **Props**: `texto` ('\n' = línea) · `por='palabra'` · `stagger` (1 f carácter, 3 f palabra) · `delay=0` · `fontSize=120` · `desplazamiento=0.55` de la altura de línea · `muelle='sinRebote'` (el rebote en texto es tic de IA) · `trackingHero` (0,3 em → −0,02 em en 40 f, expoOut) · `acentos=[índices de palabra]` · `salida` (f; 8 f con materialExit) · `sombra` suave (nunca texto plano).
```tsx
<KineticTitle texto={'Edita como\nun estudio'} por="caracter" delay={15} fontSize={150} acentos={[3]} />
```

### CameraPush
- **Hace sentir**: foto viva (moving hold) y mirada guiada a lo que nombra la voz.
- **Cuándo**: siempre sobre foto (+1,8 %/s). Punch-in cuando la voz nombra algo (+15-30 % seco).
- **Cuándo NO**: en el plano de peso (`ritmo={0}`); punch-ins por calendario (máximo uno marcado cada 3-5 s); punch de menos del 10 % (parece error).
- **Props**: `ritmo=0.018` (exponencial: no frena) · `ancla` (punto fijo; centro por defecto) · `punches=[{frame, cantidad=0.22, asentamiento=3, ancla}]` (llega un 18 % del punch por encima y asienta en 3 f) · `escalaInicial=1`. `escalaCamara()` exportada para sincronizar otras capas.
```tsx
<CameraPush ancla={{x: 540, y: 1060}} punches={[{frame: 58, cantidad: 0.24}]}>
  <Img src={staticFile('foto.jpg')} />
  <FlashCut frame={36} mascara={<Silueta />} />
</CameraPush>
```

### ZoomThrough
- **Hace sentir**: avance, entrar "dentro" de algo; une dos planos con un mismo centro.
- **Cuándo**: cambio de bloque; cuando A y B comparten un punto (cara → cara, pantalla → interfaz).
- **Cuándo NO**: en todas las uniones (es el "smooth zoom" barato); si el centro no coincide con nada; combinado con shake + glitch + RGB a la vez.
- **Props**: `a`, `b`, `corte` · `entrada=4` f (cutIn: pico de velocidad en el corte) · `salida=5` f (materialEnter) · `pico=1.7` (×1,3-2) · `bDesde=1.45` · `ancla`, `anclaB` · `muestras=6` (desenfoque radial por acumulación; 0 en el fotograma de corte y en reposo).
```tsx
<ZoomThrough a={<PlanoA />} b={<Sequence from={10} layout="none"><PlanoB /></Sequence>} corte={10} ancla={{x: 540, y: 1040}} />
```

### WhipPan
- **Hace sentir**: energía, "lo siguiente", cambio de tema con impulso.
- **Cuándo**: salir del hook, enumeraciones horizontales, "y ahora…". Dirección izquierda = avanzar.
- **Cuándo NO**: dos seguidos; hacia atrás en el eje narrativo sin querer decir "antes"; en un momento de peso.
- **Props**: `a`, `b`, `inicio` · `duracion=9` f (más de 10 = paneo) · `direccion='izquierda'` · `factorEstela=0.14` px por px/f · `tope=48` px · `curva=bezier(0.7,0,0.2,1)`. A y B van pegados como una tira; la estela es un desenfoque SVG direccional (`DirBlur`).
```tsx
<WhipPan a={<EscenaA />} b={<Sequence from={56} layout="none"><EscenaB /></Sequence>} inicio={56} />
```

### FlashCut
- **Hace sentir**: "esto, aquí": señala y archiva lo nombrado; con el click, la foto se vuelve documento.
- **Cuándo**: la voz nombra algo o a alguien que se ve. Con `mascara`/`zona`, solo su recorte; sin ellas, flash completo de corte.
- **Cuándo NO**: más de uno cada 3-4 s; sin el click de cámara (`Sfx`) en el mismo fotograma; sobre texto que hay que leer.
- **Props**: `frame` · `patron=[1,1,0,1,1]` (ON ON OFF ON ON, validado) · `opacidad=0.85` · `color='#FFF'` · `zona={x,y,w,h,radius,forma}` · `mascara` (silueta) · `repetirCada`, `veces` (ráfagas). Ponlo DENTRO de `CameraPush` para que siga a la foto.
```tsx
<FlashCut frame={36} mascara={<SiluetaSujeto />} />
<Sfx src={staticFile('sfx/click.wav')} frame={36} />
```

### PopFromWord (medido)
- **Hace sentir**: que la palabra se convierte en la cosa; el subtítulo "abre" el plano.
- **Cuándo**: la voz dice una palabra que tiene imagen propia (dato, producto, nombre) y quieres sacarla de la foto a una pieza.
- **Cuándo NO**: si la palabra no está en el subtítulo en ese momento; dos seguidos (pierde la sorpresa); para tarjetas sin relación con la palabra.
- **Props**: `origen` (centro de la palabra) · `destino` (rect final) · `escalones=[0.05, 0.36, 0.70, 0.89, 1]` (uno por fotograma: no se interpola, a 30 fps cada fotograma ES la medida) · `radio=44` · `sombra` de pieza de Erik · `fondo` (papel con cuadrícula) · `empuje=0.018` tras asentar. El corte a blanco es el fotograma 0.
```tsx
<Sequence from={225}>
  <PopFromWord origen={{x: 510, y: 1290}} destino={{x: 130, y: 620, w: 820, h: 560}}>
    <Tarjeta />
  </PopFromWord>
</Sequence>
```
Truco: si la palabra va sola en su línea (pausa > 0,35 s antes), su centro es `{x: 510, y: 1290}` (centro de la zona segura).

### GlassSlats (medido)
- **Hace sentir**: un barrido de luz a través de cristal acanalado; elegante, "de marca", tecnológico.
- **Cuándo**: cambio de bloque en piezas premium; de un plano oscuro a uno claro (el blanco esconde el cambio).
- **Cuándo NO**: más de una vez por pieza; en un tramo de energía con cortes cada 1 s (dura ~26 f).
- **Props**: `a`, `b` · `lama=285` px · `filo=18` px (filo doble) · `encendidos=[0,3,5,7,10,12,12]` · `apagado=8` f (coseno) · `orientacion='horizontal'` (7 bandas a lo largo de 1920 px = las 7 medidas; `'vertical'` da 4 costillas en 1080 px) · `invertir` · `refraccion=1.12` · `salidaCristal=6` f. Bajo el blanco de cada lama se pasa de A a B.
```tsx
<GlassSlats a={<Sequence from={-100} layout="none"><EscenaE /></Sequence>} b={<EscenaF />} />
```

### PixelDissolve
- **Hace sentir**: digital, "carga", lo de antes se descompone.
- **Cuándo**: hacia una pantalla, interfaz o dispositivo; cierre de un bloque informativo.
- **Cuándo NO**: entre dos fotos de archivo (rompe la época); más corto de 12 f (parece fallo de códec).
- **Props**: `a`, `b` · `inicio=0` · `duracion=15` · `bloque=72` px (15 columnas) · `direccion='abajo'` (`ninguna`, `arriba`, `izquierda`, `derecha`, `centro`) · `sesgo=0.55` (onda con borde roto) · `colorFrente='#FFF'` (las celdas recién cambiadas parpadean; `null` = sin frente) · `seed`.
```tsx
<PixelDissolve a={<PlanoA />} b={<PlanoB />} duracion={15} direccion="centro" />
```

### HandOff (concatenar planos)
- **Hace sentir**: continuidad; el plano siguiente es consecuencia del anterior.
- **Cuándo**: el último elemento de A es el primero de B (una cifra que pasa a ser título, una tarjeta que se coloca). Modo `ventana`: "pequeño → grande como fondo", un elemento se abre y es la ventana al plano siguiente.
- **Cuándo NO**: si el elemento no significa lo mismo en los dos planos (entonces, corte); con más de un elemento viajando a la vez.
- **Props**: `a`, `b` (sin el elemento; en modo ventana, A sí lo pinta) · `corte` · `desde`, `hasta` (rects; en ventana, `hasta` = pantalla completa) · `elemento` · `viaje=18` f · `antesDelCorte` (mitad: el corte cae en el pico de velocidad) · `curvaX=aeInfluence(0.55,0.9)` y `curvaY=firmaErik` (curvas distintas = arco) · `curvaTam=firmaErik` (tamaño en logarítmico) · `ventana` · `factorEstela=0.08` (tope 6 px).
```tsx
<HandOff a={<EscenaF />} b={<Sequence from={20} layout="none"><EscenaG /></Sequence>} corte={20}
  desde={{x: 390, y: 1300, w: 300, h: 104, radius: 52}} hasta={{x: 310, y: 876, w: 460, h: 168, radius: 84}}
  elemento={<Pildora texto="1 idea" />} />
```
El texto del elemento escala con el rectángulo si usa `containerType: 'size'` y `fontSize: '46cqh'`.

### Parallax25D
- **Hace sentir**: volumen y profundidad en una imagen plana; documental, cinematográfico.
- **Cuándo**: foto recortada en 2-4 capas; plano de apertura o de respiro; dolly zoom (`focalHasta`) para una toma de conciencia.
- **Cuándo NO**: con recortes malos (más de 2× de velocidad entre capas contiguas los destapa); en gran angular con caras; sin overscan en las capas (se ven los bordes).
- **Props**: `capas=[{z, contenido, compensarEscala}]` (z AE: + lejos) · `desde`, `hasta` (cámara; z + = avanza) · `duracion=90` · `curva=firmaErik` · `focal=50` mm (`perspective = ancho·focal/36` = 1500 px) · `focalHasta` · `foco=0` · `dof=0.004` px/px con `topeDof=10`. Mantén `hasta.z < perspective − |z más cercana|`. Da a cada capa ~200 px de sobrante por lado.
```tsx
<Parallax25D hasta={{x: 70, y: -30, z: 340}} duracion={75}
  capas={[{z: 2600, contenido: <Cielo />}, {z: 0, contenido: <Sujeto />}, {z: -500, contenido: <PrimerTermino />}]} />
```

### Shake
- **Hace sentir**: cámara en mano (deriva) o golpe físico (impacto).
- **Cuándo**: deriva sutil en planos de foto; impacto en el golpe de una cifra, un título o un punch.
- **Cuándo NO**: alta frecuencia sostenida (marea y delata); shake + zoom-through + glitch a la vez; sobre texto pequeño que hay que leer durante el impacto.
- **Props**: `deriva=3` px · `frecuenciaDeriva=1` Hz · `rotacion=0.3`° (otra semilla) · `impactos=[{frame, amplitud=14, frecuencia=10, caida=0.3}]` · `sobreescala=1.03` (no se ven bordes) · `semilla`. Ruido de `@remotion/noise`. `temblor()` exportada para mover otras capas igual.
```tsx
<Shake impactos={[{frame: 34, amplitud: 14}]}>
  <CountUp valor={100000} sufijo="€" inicio={16} />
</Shake>
```

### FeedStack
- **Hace sentir**: abundancia, enumeración con energía, "scroll" del feed.
- **Cuándo**: listas de 4-8 elementos, pruebas sociales, "6 capas de un reel".
- **Cuándo NO**: si cada tarjeta hay que leerla (sube `intervalo` a 12-15 f o usa otra pieza); con más de ~8 tarjetas (ruido).
- **Props**: `tarjetas` · `inicio=0` · `intervalo=7` f · `ancho=760`, `alto=460` · `paso=330` (se solapan) · `zigzag=90` px · `giro=2.5`° · `yAncla=1000` · `recorridoEntrada=180` · `radio=40` · `muelle='asentado'`. El scroll es la suma de los springs: nunca salta.
```tsx
<FeedStack inicio={22} tarjetas={items.map((t) => <Tarjeta key={t} titulo={t} />)} />
```

### Typewriter
- **Hace sentir**: intimidad, búsqueda, "alguien lo está escribiendo ahora".
- **Cuándo**: preguntas, prompts, búsquedas, la frase que va a pasar a ser selección de iOS.
- **Cuándo NO**: frases de más de ~40 caracteres en un tramo rápido; títulos de peso (usa KineticTitle).
- **Props**: `texto` · `inicio=0` · `fpc=2` (15 car/s) · `humanizar=0.6` (ritmo variable determinista) · `pausaPuntuacion=6` f · `cursor='barra'` (o `bloque`, `ninguno`) · `parpadeo=30` f (fijo mientras escribe) · `colorCursor='#0A84FF'` · `fontSize=64` · `anchoMax=880`. `tiemposTecleo()` exportada para colocar un `Sfx` por tecla.
```tsx
<Typewriter texto="facturados en un mes" inicio={42} fontSize={58} />
```

### CountUp
- **Hace sentir**: magnitud; la cifra "cae" y pesa.
- **Cuándo**: un dato con peso por bloque, con riser antes y golpe al llegar.
- **Cuándo NO**: varias cifras contando a la vez; cifras sin verificar.
- **Props**: `valor` · `desde=0` · `inicio=0` · `duracion=18` f (14 f a 24 fps de Erik) · `decimales=0` · `prefijo`, `sufijo` · `escalaSufijo=0.42` (se remarca con tamaño) · `golpe=0.1` (1,1→1 en 5 f al llegar) · `fontSize=220` · `curva=expoOut`. Formato español con punto de miles siempre (`formatoES`) y números tabulares (no baila).
```tsx
<CountUp valor={100000} sufijo="€" inicio={16} />
```

### Finish
- **Hace sentir**: textura de imagen real; quita el "render de ordenador".
- **Cuándo**: última capa de cada escena. Grano 0,16 sobre foto, 0,05 sobre blanco.
- **Cuándo NO**: dos Finish apilados; viñeta negra sobre papel blanco (usa `vineta={0}`; el papel ya trae la suya).
- **Props**: `grano=0.16` · `frecuencia=0.85` · `vineta=0.22` · `vinetaInicio=55` % · `vinetaColor='0,0,0'`. Grano monocromo con `feTurbulence` y semilla = fotograma.
```tsx
<Finish grano={0.16} />
```

### SafeZoneGuide
- **Para**: revisar que nada importante cae bajo la interfaz de Reels. No se pinta al renderizar salvo `forzar`.
- **Props**: `forzar=false` · `zonas=SAFE`.
```tsx
<SafeZoneGuide />   // en el Demo: --props='{"guias":true}' para un still de revisión
```

### Sfx y duck()
- **Sfx**: un efecto en un fotograma. `src` · `frame` · `gananciaDb=-6` (los efectos nunca tapan la voz) · `adelanto` (whoosh: su pico, a ~7 f del inicio en `whoosh.wav`, debe caer en el pico de velocidad) · `duracion` (cortar un riser en seco) · `velocidad` (0,95-1,05 para que las repeticiones no suenen a máquina).
- **duck(frame, segmentos, {base=0.55, agachado=0.16, ataque=4, relajacion=15})**: la bajada empieza 4 f ANTES de la voz para no pisar la primera sílaba y recupera en 0,5 s para no "bombear". `segmentosDeVoz(words, fps, unirHueco=8)` saca los tramos de Whisper.
- **Cuándo NO**: un pop en cada palabra (más de 2-3 sonidos iguales seguidos se funden); efectos sincronizados con todo (solo eventos de nivel 1: flash, golpe, revelación, cambio de bloque).
```tsx
<Audio src={staticFile('sfx/musica.wav')} loop volume={(f) => duck(f, segmentosDeVoz(words, 30))} />
<Sfx src={staticFile('sfx/whoosh.wav')} frame={150} adelanto={7} />
<Sfx src={staticFile('sfx/golpe.wav')} frame={414} gananciaDb={-3} />
```
Remotion no normaliza: masteriza a −14 LUFS / −1 dBTP con `npm run master`.

### Vocabulario de montaje de Erik
| Componente | Hace sentir / cuándo | Cuándo NO | Props clave |
|---|---|---|---|
| `GridPaper` | Papel blanco con cuadrícula fina gris: la superficie de las escenas sobre blanco | Fondo de foto | `paso=54`, `color` gris 7 %, `deriva` (px/f), `vineta` gris de Erik |
| `Constelacion` | Clips en corte seco alrededor de una palabra que luego se recogen al centro: "todo esto cabe en esto" | Con más de 8 clips o sin hold con todos visibles (≥ 12 f) | `clips`, `centro`, `intervalo=3`, `encoger=40`, `duracionEncoger=10`, `radio=320` |
| `FilmStrip` | Tira de película que se desliza: archivo, proceso, "muchos intentos" | Como fondo de texto que hay que leer | `items`, `velocidad=8` px/f (lineal: es mecanismo), `inclinacion=-6`° |
| `DeviceThrough` | iPhone cuya pantalla atraviesa la cámara: entrar en la app o en "su mundo" | App antes de los últimos 3 s si es la de la marca (regla de Erik) | `pantalla`, `inicio=20`, `duracion=12`, `salida=6`, `anchoPantalla=470` |
| `Rafaga` | Planos en corte seco sin animación de entrada: impacto, acumulación | Seguida de otra ráfaga sin un hold de 15-45 f | `planos`, `duraciones=5` (o una por plano), `mantenerUltimo` |

```tsx
<Constelacion centro={<Palabra />} clips={clips} inicio={4} encoger={42} />
<DeviceThrough inicio={24} duracion={12} pantalla={<Cierre />} />
<Rafaga planos={[<A />, <B />, <C />]} duraciones={[4, 4, 30]} />
```

Piezas internas reutilizables: `DirBlur` (desenfoque direccional SVG), `ZoomBlur` (desenfoque radial de zoom por acumulación), `blurPorVelocidad()` (regla de Erik: 0,16 px por px/f, tope 9).

---

## Recetas

Fotogramas a 30 fps, relativos al inicio de la receta. Cada receta está montada en `src/Demo.tsx` salvo que se diga.

### 1. Hook de 2 s (Demo 0-60)
- f0-14: `Rafaga` de 3 fotos a 5 f + `FlashCut` completo en f0 (`opacidad 0.8`) + `Sfx click` f0.
- f15: corte a `GridPaper`; `KineticTitle` por carácter (`delay 15`, stagger 1, palabra clave en acento) dentro de `Shake` con impacto en f15 + `Sfx golpe` −4 dB.
- f45: título completo; hold hasta f56 y `WhipPan` (9 f) al primer plano con whoosh adelantado 7 f.

### 2. Revelación con peso (cámara dentro de la foto)
- f0: `CameraPush` (+1,8 %/s) anclado al sujeto, `Shake deriva 3`, `Finish grano 0.16`.
- f36 ("foto"): `FlashCut` con la máscara del sujeto dentro de la cámara + click.
- f58 ("cámara"): punch-in +24 % a la cara, asienta en 3 f + golpe −12 dB.
- Variante de peso (pendiente de validar por Erik): `ritmo={0}`, sin shake, 3-6 s quietos y la música a silencio 0,5-1,5 s antes.

### 3. Enumeración de energía (Demo 280-380)
- f0-18: `HandOff ventana` abre el plano; f4: cabecera con `KineticTitle` y degradado que tapa el feed.
- f22, 29, 36, 43, 50, 57: `FeedStack` (intervalo 7) + `Sfx pop` −10/−11 dB alternando `velocidad` 0,96-1,04.
- f57-100: hold con deriva de la cuadrícula; salida con `GlassSlats`.

### 4. Cifra que golpea (Demo 380-460)
- f−11 a f34: `Sfx riser` de 45 f cortado en seco en la llegada.
- f4: contexto ("Con una sola idea:") por palabra.
- f16-34: `CountUp` 18 f con expoOut; f34: `golpe` 1,1→1 + `Shake` impacto 14 px + `Sfx golpe` −3 dB.
- f42: `Typewriter` con `Sfx tecla` por carácter (−16 a −18 dB, `tiemposTecleo`).

### 5. Paso de escena concatenado (Demo 440-525)
- f0: aparece la píldora "1 idea" en corte seco en A (y 1300).
- f11-29: `HandOff` (18 f, corte en f20) lleva la píldora al centro de B en arco, creciendo en logarítmico + whoosh.
- f24-42: `Constelacion` alrededor de la píldora (7 clips cada 3 f en corte seco + click −14 dB); hold de 20 f con todos visibles; f62-78: se recogen al centro (10 f cada uno, stagger 1).

### 6. Pop desde la palabra (Demo 214-298)
- Subtítulo: la palabra sola en su línea (pausa > 0,35 s antes), en color de acento, ≥ 10 f en pantalla.
- f0: corte a blanco; `PopFromWord` 0,05 → 0,36 → 0,70 → 0,89 → 1 en f0-f4 + `Sfx pop`.
- f8: los subtítulos siguen en modo `blanco` (negro con sombra) bajo la tarjeta.
- f55-73: `HandOff ventana` desde el rectángulo exacto de la tarjeta (incluye su empuje de +1,8 %/s).

### 7. Zoom a otro mundo (Demo 146-160)
- f0-3: A acelera ×1→1,7 con `cutIn` hacia el punto que comparte con B; desenfoque radial solo con velocidad.
- f4: corte en el pico; B entra a ×1,45 y decelera a 1 en 5 f (`materialEnter`) desde su punto equivalente.
- Whoosh con `adelanto 7` para que su pico caiga en el corte. Máximo uno cada 3-5 s.

### 8. Barrido de cristal entre bloques (Demo 380-406)
- f0: lama 1 en blanco; f3, 5, 7, 10, 12, 12: el resto (onda); cada una se apaga con coseno en 8 f y bajo su blanco ya está B.
- f18-24: el cristal se disuelve. Úsalo de oscuro a claro: el blanco tapa el cambio.
- Whoosh suave en f0 (adelanto 7). Una vez por pieza.

### 9. Entrar en la pantalla y cerrar (Demo 525-600)
- f0-15: `PixelDissolve` desde el centro hacia el móvil.
- f24-36: `DeviceThrough` (12 f con `cutIn`), corte en f36 con whoosh adelantado y golpe.
- f36-42: B asienta ×1,22→1; f40: `KineticTitle` con `trackingHero` sobre `FilmStrip` lineal; ≥ 1 s de hold final con 0,5-1 s de decay en el sonido.

### 10. Ráfaga + respiro (no está en el demo)
- f0-12: `Rafaga` de 3 planos a 4 f con un click cada uno (−14 dB).
- f12-45: último plano quieto con `CameraPush` y sin música (respiro de 1 s).
- f45: `WhipPan` al bloque siguiente. Regla: alterna 3-5 eventos con holds de 15-45 f.

---

## Límites conocidos
- `GlassSlats` y `ZoomBlur` pintan sus escenas varias veces (7×2 y 6×) solo durante la transición: en escenas muy pesadas (vídeo 4K) el render de esos fotogramas se multiplica.
- `PixelDissolve` usa `clip-path: path()` (Chromium). `HandOff` con texto escalable usa unidades `cqh` (Chromium ≥ 105).
- `Parallax25D` no recorta las capas: dales overscan (≈ 200 px por lado) o se verán sus bordes al mover la cámara en X/Y.
- La orientación por defecto de `GlassSlats` (bandas horizontales) es una inferencia: las 7 lamas medidas casan con 1920 / 285 ≈ 6,7. Si la referencia era de costillas verticales en 16:9, usa `orientacion="vertical"`.
- Los efectos de `public/sfx/` son sintéticos (`scripts/generar-sfx.mjs`), solo para el demo. La mezcla del demo no lleva voz.

---

## Kit v2 · `src/v2/` (que no parezca editado por Claude)

Todo sale de medidas: unas 190 referencias en `investigacion/medidas/` (dataset, recetas por efecto y `calcos.md`). Solo assets reales: vídeo, foto, recortes, texturas y modos de fusión. Nada se queda quieto.

```tsx
import {Empuje, Deriva, Capas, Clip, rampa, Recorte, Foto, Trazo, Flecha, LineaCinetica, Barrido, ZoomRadial, FilmBurn, Glitch, LeakCorte, Pelicula, keys, curva, CALCOS} from './v2';
```

| Módulo | Piezas | De dónde salen los números |
|---|---|---|
| `curvas.ts` | `keys()` con keyframes de AE `{f, v, infOut, infIn, velOut, velIn}`; `inercia`, `secundaria`, `geometrica` (látigo cosechado, r = 0,82/f); **`CALCOS`** (`zoomAlCorte`, `latigo`, `asentamiento`) con `curva()` | Curvas calcadas contra referencias reales con p95 ≤ 4 px (`investigacion/medidas/calcos.md`) |
| `camara.tsx` | `deriva` / `Deriva` (zoom 1 %/s, 14 px, 0,35°), `Empuje` (escala con influencias 0,15 / 0,85 y desenfoque por velocidad), `Capas` (parallax con escala separada y profundidad de campo), `BlurReal` | `recetas/deriva.md`: el 90 % de los planos largos se mueve, con zoom mediano de 2 %/s |
| `texturas.tsx` | `Grano`, `Polvo`, `LightLeak`, `Acabado`, `Pelicula`, `pulsoLeak` (vídeos en `public/texturas/`, de `scripts/generar_texturas.py`) | Flashes de unos 2 f (`recetas/flash_y_leak.md`) |
| `assets.tsx` | `Foto` (recorte en px de la fuente, borde de papel, sombra real), `Recorte` (PNG con alfa y borde de pegatina), `Clip` (time remap), **`rampa()`** (2,4× → 0,2× en 8 f), `homografia` / `PantallaEn` | `recetas/rampa_velocidad.md`: relación mediana de 12,6× en 8 f |
| `formas.tsx` | `Trazo` (línea, rotulador, pespunte, tiza), `Flecha`, `CirculoEnfasis`, `Subrayado`, `CajaLlamada`, `BarrasCrecen`, `RutaMapa`, `DentroDe` / `TrackMatte` (track matte alfa o luma), `revelaCirculo` | `recetas/entradas_graficos.md`: el 90 % del área en 9 f, overshoot del 7 %, un 24 % en corte seco |
| `transiciones.tsx` | `Barrido` (`perfil="latigo"` calcado), `ZoomRadial`, `Viaje`, `Atravesar`, `FilmBurn`, `LeakCorte`, `Glitch` (separación RGB por canales), `Iris`, `MatchMove` | `recetas/latigo.md`, `zoom_rapido_*.md`, `glitch_rgb.md` |
| `tipografia.tsx` | `LineaCinetica`: tres niveles de jerarquía, entradas por letra (máscara, sube, escala, desenfoque) y fuentes de marca (`fuente`, `fuenteAcento`, `pesos`) | Texto en cambios de unos 4 f en las referencias |
| `lottie.tsx` | `LottieAsset` | — |

**Demo:** composición `DemoV2`, con 5 planos y 4 transiciones con motivo. Necesita `public/local/`, que no se sube.

**Calcar un movimiento nuevo de una referencia:**

```bash
python ../analisis-referencias/calcar_camara.py REF.mp4 --desde A --hasta B --out public/local/calco_x
npx remotion render src/index.ts CalcoCamara out/calco_x.mp4 --props=public/local/calco_x/props.json
python ../analisis-referencias/calco.py REF.mp4 out/calco_x.mp4 --desde A --hasta B --offset -A   # p95 ≤ 4 px
```

**Trabajo de cliente:** va en `src/local/` (con su propio `index.ts`) y `public/local/`; las dos carpetas están en .gitignore.
