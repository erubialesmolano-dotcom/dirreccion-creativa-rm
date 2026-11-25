# Desarrollo de recursos: fase obligatoria antes de hacer cualquier vídeo

> Este archivo es igual en `direccion-creativa-audiovisual`, `direccion-creativa-redes`, `produccion-reels-instagram`, `motion-remotion` y `video-historia-remotion`. El original está en `direccion-creativa-audiovisual/references/`. Si cambias uno, cambia todos.
> Si una referencia no está en disco, se lee del repositorio: `https://raw.githubusercontent.com/erubialesmolano-dotcom/direccion-creativa-rm/main/skills/<skill>/references/<archivo>`.

## Por qué existe

Las skills llevan cientos de casos, directores, estudios y recursos analizados: composición, espacio negativo, retórica visual, registro, muro de códigos, sonido, montaje, lujo y redes. Si se va directo al kit de edición, nada de eso se usa y sale una pieza "de Claude": efectos bien hechos sin idea ni criterio. Lo dijo Erik: **si no se usan estos criterios al diseñar, la skill no sirve de nada.**

Regla: **ningún vídeo se produce sin un documento de desarrollo aprobado.** Esto incluye guion, styleframes, storyboard, animatic, generación con IA, montaje y render.

## Cuándo se activa

**Siempre** que haya que hacer, montar, editar, animar o rediseñar un vídeo, reel, anuncio, motion graphic, styleframe o storyboard. Da igual que parezca rápido o pequeño.

Solo hay dos excepciones:
- Erik dice de forma explícita «sin desarrollo».
- Es una corrección concreta sobre una pieza que ya tiene documento aprobado. En ese caso se actualiza la fila afectada del documento.

## Paso 1. Leer, no recordar

Antes de proponer nada, abre y lee estos archivos. Citar de memoria no vale.

| Decisión | Archivo (skill) |
|---|---|
| Proceso, jerarquía, modos de ritmo, crítica | `SKILL.md` (direccion-creativa-audiovisual) |
| Si es orgánico de redes: series, formatos, asociaciones, casos por sector | `SKILL.md`, `identidad-asociativa-lujo-b2b.md`, `storytelling-y-formatos.md`, `casos-redes/<sector>.md` (direccion-creativa-redes) |
| Emoción → recurso | `emocion.md` |
| Muro de códigos y registro | `diferenciacion-registro.md` |
| Encuadre, espacio negativo, escala, peso, 9:16 | `composicion.md` |
| Ideación, 6 plantillas, retórica visual, luz y color | `teoria-base.md` |
| Qué decidió un director y por qué | `directores.md` |
| Casos desmontados | `casos.md` |
| Sonido y silencio | `sonido-musica.md` |
| Elegir y montar la música, efectos | `musica-redes.md` |
| Técnicas de montaje | `montaje-tecnicas.md` |
| Acabado premium y tics | `limpio-premium.md` |
| Gustos y correcciones de Erik | `gusto.md` y `cerebro-erik`, si existe |

Lee como mínimo `SKILL.md`, `composicion.md`, `diferenciacion-registro.md`, `teoria-base.md`, `directores.md` y `casos.md`, más los de redes si la pieza es orgánica. Del resto, lee los que toque la pieza.

## Paso 2. Escribir el documento de desarrollo

Guárdalo como `desarrollo.md` en la carpeta del proyecto. Tiene que ser corto y concreto: cada línea es una decisión, no teoría.

**A. Brief.**
- Qué debe pensar, sentir o hacer el espectador al terminar.
- Público.
- Plataforma y contexto: ¿con sonido? ¿feed o pago?
- Duración.
- Material disponible: fotos, vídeo, IA, 3D, voz.

**B. Insight.** La verdad no dicha del espectador sobre el tema, en una frase.

**C. Muro de códigos de la categoría.**
- 15-25 signos, repartidos en cuatro columnas: imagen, sonido, montaje y palabra.
- Clasifica cada signo: ★ imprescindible para entender la categoría; ♦ activo de la marca.
- Ruptura: decide qué 1-2 ejes se rompen y por qué esa ruptura dice algo cierto del producto.

**D. Idea.**
- Genera al menos 10 ideas y pásalas por las 6 plantillas de Goldenberg.
- Quédate con 3 finalistas y aplícales la prueba del vecino.
- Elige una y cuéntala en una frase. Explica por qué no es la primera que se le ocurriría a cualquiera.

**E. Figura retórica dominante.**
- Una sola: metáfora, sinécdoque, antítesis, rima visual, elipsis…
- Indica su estructura × significado (Phillips-McQuarrie) o su operación × relación (Durand).
- Describe cómo se ve en pantalla.

**F. Registro y mood.**
- Un registro dominante y, como mucho, un giro.
- Qué instala el mood en los primeros 2 s.
- 2-4 marcadores que escalan hacia el clímax.

**G. Referentes.**
- Mínimo 3 casos, directores o estudios sacados de las referencias.
- De cada uno, el **mecanismo** que se roba, no su superficie.
- Cita el archivo del que sale. No se cita nada que no esté en las referencias o que no se haya verificado.

**H. Sistema visual.**
- **El material decide el estilo:** con fotos se hace motion graphics (papel, tarjetas, trazos, tipografía que construye); con vídeo, montaje editorial (corte seco, jump cuts de proceso, texto alrededor del sujeto).
- Composición de cada tipo de plano: centro o lead room, espacio negativo, escala, tamaño = importancia, profundidad apilada en 9:16. Cada elección con su porqué de `composicion.md`.
- Paleta 60-30-10 con un solo acento, y qué significa ese acento.
- Tipografía: 1-2 familias, pesos y tamaños.
- Dónde va el texto y por qué.
- Biblia de 5-8 constantes.

**I. Sonido primero.**
- Sigue el método de `musica-redes.md`: papel de la música, licencia, búsqueda en el nicho y en tendencias, 3 finalistas medidas con `scripts/mapa_musical.py`, cuántas canciones y hoja de sonido.
- Música o su ausencia.
- Voz.
- Dónde va el silencio construido.
- 1-3 síncresis con significado.
- Firma sonora.
- Recuerda: solo los sonidos que Erik pida.

**J. Mapa de ritmo.**
- Cada tramo marcado como energía, peso o respiro, con sus tiempos.
- Dónde está el plano sostenido de peso.
- Qué se raciona para que ese momento pese.

**K. Tabla de recursos, plano a plano.** Es el corazón del documento:

| # | Tiempo | Qué se ve | Emoción | Recurso | Por qué (archivo + caso, director o estudio, o [inferencia]) | Cuándo romperlo | Componente del kit |
|---|---|---|---|---|---|---|---|

Ningún recurso entra en la pieza sin su fila. Si no sabes rellenar el «por qué» con una fuente, el recurso no entra o se marca como [inferencia] y se le dice a Erik.

**L. Lo que no se va a hacer.**
- Los tics prohibidos: texto que se acerca, entrada letra a letra, máscara dura, imágenes que tiemblan o rebotan, burn o látigo como adorno, texto siempre abajo, cámara que oscila, fotogramas quietos.
- Los recursos que se descartan, cada uno con su razón.

**M. Crítica previa.** Las 18 preguntas de la sección 8 de `direccion-creativa-audiovisual`, respondidas en corto, marcando lo que sea inferencia.

## Paso 3. Puerta: aprobación de Erik

Enséñale a Erik un resumen con:
- la idea en una frase;
- el insight;
- lo que se rompe;
- los referentes y el mecanismo de cada uno;
- el mapa de ritmo;
- la tabla de recursos.

**No se genera con IA, no se monta y no se renderiza hasta que diga que sí.** Los styleframes y el animatic forman parte del desarrollo: cada styleframe lleva escrito qué fila de la tabla ilustra.

## Paso 4. Producir contra el documento

- Cada componente del kit que se use tiene que estar en la tabla K. Si aparece un recurso nuevo, primero se añade su fila con el porqué.
- Los números de ejecución (curvas, duraciones, cámara) salen de `motion-remotion` y de las medidas de `produccion-reels-instagram`.

## Paso 5. Antes de entregar

- Recorre la tabla fila a fila: ¿se ha ejecutado lo decidido?
- Repasa la crítica y la lista de tics.
- Explícale a Erik las decisiones con la fórmula **efecto → recurso → por qué → cuándo romperlo**.

## Paso 6. Después

Cada corrección de Erik va a `gusto.md` y al cerebro, con su porqué. Si una corrección contradice una fila de la tabla, se corrige la regla, no solo la pieza.

## Señales de que te has saltado el desarrollo

- No puedes decir de qué caso, director o estudio sale una decisión.
- Los recursos se eligieron porque estaban en el kit, no por la emoción del tramo.
- Todos los planos tienen el mismo modo de ritmo.
- Las fotos están montadas como vídeo editorial, o el vídeo como motion graphics.
- El texto va siempre en el mismo sitio.

Si ves cualquiera de estas señales, para y vuelve al paso 1.
