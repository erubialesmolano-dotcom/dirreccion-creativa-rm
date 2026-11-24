# Limpio frente a amateur

> Fuente: informe 2 §6. Etiquetas de evidencia: [estudio]/[estudio*] dato empírico (con * si viene de plataforma con interés comercial), [norma]/[DOC] especificación oficial, [creador]/[EXPERT] quien hizo la pieza o practicante reconocido, [crítica], [PRACT] tutorial, [inferencia]/[INF]/[I] deducción sin fuente directa. Trata [inferencia] como recomendación, no como hecho.

## 6. Limpio frente a amateur: checklist de acabado

"Premium" no es minimalismo: es **un sistema estricto aplicado sin excepciones**. Nike es de alto contraste, pero con una sola familia tipográfica y blanco y negro más el color del producto [INFERENCE].

**Tipografía**
- [ ] Una familia (dos como mucho), 2-3 pesos y 3 tamaños, en escala de 1,5-1,618 para vertical [INFERENCE].
- [ ] Sin pesos finos: "In general, avoid light font weights" [EVIDENCE] ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/typography)).
- [ ] Tracking según el tamaño. En SF Pro (1/1000 em): +41 a 6 pt, 0 a 12, −26 a 17, −23 a 20, ~0 a 23-24, **+14 a 28, +10 a 40, +8 a 48 y 0 a partir de 80 pt**, porque la Display ya viene apretada [EVIDENCE]. Esto **confirma la corrección del traspaso**: nada de interletrado negativo en SF Pro Display grande. Solo en fuentes sin corte display (Inter de texto, Helvetica), entre −1 y −3 % em [INFERENCE].
- [ ] Mayúsculas y versalitas con +5-12 % de interletrado; interlineado del 120-145 %; la negrita y la cursiva, lo menos posible y nunca juntas [PRACTITIONER] ([Butterick](https://practicaltypography.com/summary-of-key-rules.html)).
- [ ] Subtítulos: Netflix fija 42 caracteres por línea, 2 líneas, 20 caracteres/s, pirámide con más peso abajo, sin separar artículo y nombre, y "…" como un solo carácter [EVIDENCE] ([Netflix](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide)). En 9:16, unos 20-32 caracteres por línea [INFERENCE].
- [ ] Contraste de 4,5:1, o 3:1 en texto grande (≥ 24 px, o ≥ 18,5 px en negrita); 4,499:1 no pasa [EVIDENCE] ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)). Se mide contra el píxel más claro de detrás, no contra la media [INFERENCE].
- [ ] En lienzo de 1080×1920: unos 40-48 px como mínimo para el texto secundario y 60-80 px o más para ganchos y subtítulos principales (derivado; comprobar en móvil) [INFERENCE].
- [ ] Texto sobre imagen con degradado (40-60 % de opacidad que se desvanece en el 30-40 % de la altura), sombra suave o caja. Nada de sombras duras de 1-2 px, contornos gruesos ni brillos [INFERENCE].

**Rejilla y espacio** [INFERENCE salvo que se indique]
- [ ] Márgenes y huecos en múltiplos de 8 px; una rejilla de columnas (apartado 2.14); un solo borde izquierdo en toda la pieza; centrado solo para frases cortas de una línea.
- [ ] Alineación óptica: la O, la A, la V y los triángulos de play se ajustan a ojo, y la puntuación cuelga fuera del margen.
- [ ] Un foco por cuadro: el dominante, con al menos el doble de tamaño o contraste que el resto, y dos elementos de apoyo como mucho.
- [ ] Nada crítico en la franja baja de los Reels [PRACTITIONER]; revisar con `<SocialSafeZones>` de Remotion [EVIDENCE/tool] ([Remotion](https://www.remotion.dev/elements/overlays/social-safe-zones/)).

**Color** [INFERENCE salvo que se indique]
- [ ] Reparto 60-30-10: neutro dominante, color secundario y un solo acento por pieza.
- [ ] Nada de #000 ni #FFF puros: mejor #0E0E0E o #F5F3EF.
- [ ] Un solo look para todos los planos (balance de blancos, nivel de negro, saturación), sobre todo al mezclar Kling, Veo y Sora. La piel sobre la línea de tono de piel del vectorscopio. Saturación muy por debajo de la que da el generador por defecto.
- [ ] Sin etalonaje pesado: complica la compresión de Instagram y provoca banding y cambios de color [PRACTITIONER] ([Lilach Bullock](https://www.lilachbullock.com/fix-instagram-reels-quality-dropping-after-upload/)).

**Acabado y exportación**
- [ ] El banding sale de los degradados en 8 bits más la recompresión: grano o ruido **aplicado igual en todos los planos**. H.265 Main10 solo ayuda si el origen tiene esa profundidad [EVIDENCE/PRACTITIONER] ([PremiumBeat](https://www.premiumbeat.com/blog/debanding-footage-davinci-resolve)). El grano no hace cine por sí solo: el de Volvo se calificó de "lazy" [PRACTITIONER].
- [ ] Una sola receta de textura (grano, halación, bloom); sin sobreenfocar lo generado por IA [INFERENCE].
- [ ] Reels: 1080×1920, H.264 + AAC en MP4, 30 fps, "10 Mbps or more", sin subir 4K, con "Upload at highest quality" activado y frecuencia de fotogramas constante; las copias se sacan del máster limpio, nunca de un archivo ya comprimido [PRACTITIONER] ([Lilach Bullock](https://www.lilachbullock.com/fix-instagram-reels-quality-dropping-after-upload/); [Visnalize](https://visnalize.com/blog/instagram-media-specs-compression-guide)).
- [ ] Remotion: `--codec=h264`, `--crf` de 16-18 (o 12-20 Mbps), yuv420p, más una capa de grano animado al 2-4 % sobre degradados y colores planos [INFERENCE].
- [ ] Montaje: fundidos de audio de 1-4 f en cada corte de sonido, cama de room tone sin agujeros de silencio digital, −14 LUFS y −1 dBTP (informe 1), sin fotogramas negros sueltos y subtítulos a ±2 f de la voz [I]. Microfundidos automáticos en los bordes de los clips [E] ([Descript](https://help.descript.com/timeline/automatic-microfades)).

**Tics de IA** (vocabulario de la crítica [PRACTITIONER]: "plastic-y", movimiento a saltos, texto que "isn't nearly legible" en McDonald's; pelaje inconsistente, bocas perfectamente circulares y "part shiny, part plastic" en Coca-Cola ([AOL/Yahoo](https://www.aol.com/articles/ai-slop-christmas-why-mcdonalds-143342213.html)); "overly polished" en Guess, "awful oily sheen" en Toys "R" Us ([Creative Bloq](https://www.creativebloq.com/design/branding/5-failed-ai-ads-that-prove-human-creativity-is-still-superior)))
- [ ] Ningún texto generado: todo el texto se pone en Remotion [INFERENCE].
- [ ] Manos, dientes, dirección de la luz y temperatura de color revisados plano a plano.
- [ ] Menos brillo especular; textura de piel (poros, alguna imperfección); grano coherente.
- [ ] El límite de 5-10 s del generador no puede dictar un ritmo de jump cuts: la crítica a McDonald's señala justo eso, "short clips stitched together with hard jump cuts" [PRACTITIONER].
- [ ] Anclar en lo humano o en lo real: Antebi ganó el AIFF 2025 por las interpretaciones humanas; Trillo genera "hundreds of shots", cura y se apoya en arte existente ([Variety](https://variety.com/vip/runway-ai-film-festival-1235993270); [Motionographer](https://motionographer.com/2025/05/20/paul-trillo-hacking-cinemas-next-level/)) [PRACTITIONER].

**Contención** [INFERENCE]
- [ ] Sistema de motion: 1-2 curvas, 2-3 duraciones (p. ej. 8, 12 y 20 f a 30 fps), una dirección de entrada, un tipo de transición y un estilo de resalte.
- [ ] Como mucho una animación principal y dos secundarias a la vez, con stagger constante de 2-4 f.
- [ ] Señales de barato: más de dos fuentes, más de tres colores aparte de los neutros, espaciado al azar, brillo o contorno en el texto, transiciones por defecto, grano distinto en cada plano, texto pequeño ilegible.

---
