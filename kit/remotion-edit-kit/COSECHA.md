# Cosecha · lo que Erik ya validó en sus proyectos

Fase 3 del traspaso (25/11/2026). Piezas de `~/remotion` y `~/motion-studio` que funcionaron en un vídeo real, con su procedencia y por qué funcionan. Las marcadas **→ v2** están portadas a `src/v2/` sin dependencias del proyecto (sin `useLienzo`, sin `img_manifest.json`, sin fuentes de marca). Las demás se quedan como referencia: son calcos atados a un vídeo concreto.

`~/style-lab` solo tiene `style-lab.html` (laboratorio de estilos web, sin componentes de vídeo).

| Pieza | Procedencia | Qué hace | Por qué funciona (validación) | Estado |
|---|---|---|---|---|
| `Barrido` | APZ `calcos/Hilo.tsx` (calco de N3 `Db55l3zx7wS` f549–571 con phaseCorrelate) | Tira de planos que pasa a toda velocidad; la velocidad cae geométricamente desde el corte (r = 0,82/f a 30 fps, pico ≈ 436 px/f), con desenfoque direccional proporcional y destello cálido en el pico | La salida acelera y la entrada frena con la misma curva espejo: se ve un solo movimiento ([[2026-11-11 Relevo de movimiento con curva espejo]]) | **→ v2** `Barrido` |
| `Viaje` | APZ `calcos/Transiciones.tsx` (Erik, 21/11) | La cámara se aleja del clip hasta verlo entero, viaja de lado con un ligero yaw y entra en el siguiente | Sustituye al deslizamiento plano que Erik rechaza; tres tiempos claros, sin parones | **→ v2** `Viaje` |
| `Atravesar` | APZ `calcos/Transiciones.tsx` | La cámara entra en la zona oscura del plano A (escala 1→7 con blur 0→14) y sale ya en B (1,35→1) | Sustituye al fundido a negro: transición motivada por un elemento del plano ([[Concatenar planos]]) | **→ v2** `Atravesar` |
| `Pop` / `Lamas` | APZ `calcos/Transiciones.tsx` (N3 `DbjoFw9xS8R` f333, `DefZhSEKITq` f0–24) | Pop desde la palabra y lamas de cristal | Medidas de N3 al píxel | Ya en v1: `PopFromWord`, `GlassSlats` |
| `Costura` | APZ `calcos/Hilo.tsx` (línea roja de Canva en N3 `DefZhSEKITq` f270/f750) | Trazo que se dibuja (máscara con `strokeDashoffset`), pespunte con sombra y agujeros | Es un *trim path* con textura: el trazo tiene material, no es una línea vectorial plana | **→ v2** base de `Trazo` (`estilo="pespunte"`) |
| `MapaCamino` | APZ `calcos/Hilo.tsx` (mapa de puntos de N3 `DefZhSEKITq` f1710) | Mapa con rutas que se dibujan, un hilo que gira hacia el destino, pin con pulso y cámara que acaba entrando en el punto con curva exponencial | Cámara con deriva + entrada acelerada: nunca quieto, termina en el sitio que importa | **→ v2** `RutaMapa` (recibe paths SVG del mapa) |
| `PapelCae` | APZ `calcos/Hilo.tsx` | Folios A4 que caen con sombra que se contrae al aterrizar y empuje de cámara | Sombra que cambia con la altura = profundidad real; pseudoaleatorio determinista | **→ v2** `CaenHojas` |
| `AnilloPiezas` / `AnilloLujo` | APZ `apz/efectos.tsx`, `calcos/Hilo.tsx` | Anillo 3D de tarjetas que gira | Profundidad real con `preserve-3d`, tarjetas de detrás más oscuras | Referencia (atado a assets APZ) |
| `HookGrid` | APZ `calcos/HookGrid.tsx` (N3 `DfM5rBORLbr` f0–59, OpenCV) | Foto que cambia cada 3 f y encoge acelerando, pasa a blanco con guías, rebota y sale | Medido fotograma a fotograma | Referencia |
| `Fichas`, `Pila`, `TarjetaCentro`, `SueloTexto` | APZ `calcos/Unrespiro.tsx` (unrespiro `DepQ2oSoJuy`) | Rejilla de documentos, pila que crece, texto que se apoya en un suelo | Calcos de unrespiro medidos con OpenCV | Referencia (rejilla de documentos) |
| `MotionBlurDefs` / `Dir` | APZ `apz/efectos.tsx`, Webild `lib.tsx` | Desenfoque direccional SVG con σ = L/√12 para una estela de L px | Es el desenfoque de un obturador de 360° sobre un movimiento lineal | Ya en v1: `DirBlur` |
| `homografia` | Webild `lib.tsx` | 4 esquinas → `matrix3d` | Pega una captura de UI real en la pantalla de un móvil o portátil fotografiado | **→ v2** `Homografia` / `PantallaEn` |
| `Barrel` | Webild `lib.tsx` | Distorsión de barril con `feDisplacementMap` y un mapa PNG | Simula lente gran angular en un empuje | **→ v2** `Barril` (genera el mapa con un SVG, sin PNG) |
| `Grano`, `Flash`, `BordesDesenfocados` | Webild `lib.tsx` | Grano, flash, viñeta de desenfoque | Acabado | **→ v2** `Grano` (rehecho con `feTurbulence` por fotograma) |
| `Ventana`, `Tecleo`, `Empuje`, `Luz` | Hawkers `v6/efectos.tsx` (ref `DW7AAQoD7f9`, tablas por fotograma) | Ventanas con tablas [fotograma, x, y] leídas de la ref; tecleo con cursor | Calco por tablas: la curva es la de la referencia, no una ease inventada | Referencia; el patrón "tabla de la ref" pasa a `curvas.tablaRef` |
| `MgArrow` | `motion-studio/src/leo/MgArrow.tsx` | Flecha que se traza de A a B mientras la cámara sigue la punta | La cámara sigue a lo que se dibuja: el ojo no tiene que buscar | **→ v2** `Flecha` con `seguir` |
| Pixelado de logos | Piqué (`pique/fx`) | Pixelado dentro del logo, ~32 cuadros de alto, en color | [[2026-11-12 Pixelado de logos fino y en color]] | Ya en v1: `PixelDissolve` (añadir `cuadrosAlto`) |
| Mezcla musical | Piqué y APZ (`ffmpeg` por actos) | Música continua, voz insertada regenerando la mezcla | [[2026-11-12 Insertar audio nuevo sin romper la música]] | Regla documentada en `motion-remotion` |
