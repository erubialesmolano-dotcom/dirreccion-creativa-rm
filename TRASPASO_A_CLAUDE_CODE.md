# Traspaso a Claude Code: kit de edición «nivel editor de After Effects»

Fecha: 25-11-2026. Escrito por Claude (sesión de Cowork) para continuar en Claude Code, en el ordenador de Erik, con acceso a Figma, Miro, GitHub y sus carpetas.

## Contexto en tres líneas
- Este repo (`direccion-creativa-rm`) tiene 7 skills, la investigación completa (6 rondas) y dos herramientas: `kit/remotion-edit-kit` (24 componentes de Remotion probados) y `kit/analisis-referencias` (`analizar.py` mide un reel; `calco.py` valida un calco con p95 ≤ 4 px).
- **Veredicto de Erik:** la edición del kit es mejor que la que hace Claude por defecto, pero **parece hecha por Claude**: tarjetas centradas sobre papel cuadriculado, tipografía de sistema, placeholders vectoriales, pops uniformes. Tiene que parecer **un editor que se ha pasado horas en After Effects**: zooms, motion graphics, assets reales, curvas bien hechas, texturas, imágenes importadas y recortadas, efectos.
- Las reglas de Erik y sus correcciones están en su Obsidian (`~/Documents/cerebro`): léelo primero (`CLAUDE.md`, `00-Indice.md`, `08-Skills/Cómo usar las skills.md`, notas de APZ, Milionegle y Piqué, y `04-Aprendizajes`).

## Prompt para pegar en Claude Code

> Lee `TRASPASO_A_CLAUDE_CODE.md` de este repo y ejecuta las fases en orden. Pregúntame solo lo que bloquee. Al acabar cada fase, dime en dos líneas qué has hecho y guarda lo aprendido en mi cerebro.

## Fase 0 · Puesta en marcha (15 min)
1. Descomprime `direccion-creativa-rm.zip` en `~/direccion-creativa-rm` (ya trae el historial de git).
2. `git remote add origin https://github.com/erubialesmolano-dotcom/direccion-creativa-rm.git` (si el repo remoto ya tiene commits, `git pull --rebase origin main` antes) y `git push -u origin main`.
3. Instala las skills: copia `skills/*` a `~/.claude/skills/`. **No sustituyas `video-historia-remotion`** sin fusionar antes su `references/correcciones.md` y resolver las decisiones pendientes (ver README).
4. Comprueba conectores: Figma (`whoami`: ¿plan y asiento?), Miro, GitHub.

## Fase 1 · Reunir referencias de calidad (sin límite de espacio razonable: 5-7 GB valen)
Fuentes, por este orden:
1. **Tablero de Miro del equipo de Milionegle** con links de referencias de edición: extrae todos los enlaces.
2. Reels que Erik ya tiene descargados (busca en `~/remotion/referencias/`, `~/Downloads`, proyectos de APZ, Piqué y Hawkers).
3. Cuentas y casos de la investigación: unrespiro, N3 (`DefZhSEKITq`, `Db55l3zx7wS`, `DbjoFw9xS8R`), Metro Media House, Hawkers, y los de `skills/direccion-creativa-redes/references/casos-redes/` con buena edición (Whop, Ramp, Nothing, Jacquemus, Apple, Linear…).
4. YouTube: breakdowns de motion designers y editores (School of Motion, Ben Marriott, Jake Bartlett, Video Copilot) para recetas de AE.

Descarga con la skill `descargar-reels-instagram` de Erik o `yt-dlp` (YouTube). Ritmo prudente, sin cuenta personal en scrapers masivos. **Solo para análisis interno**: nada se republica ni se sube al repo.

## Fase 2 · Medir todo y destilar recetas
1. `pip install -r kit/analisis-referencias/requirements.txt`.
2. Pasa `analizar.py` por cada vídeo → `ficha.json`. Agrega un **dataset** (`investigacion/medidas/dataset.csv`): plano medio, mediana, % de planos ≤8 f, zoom %/s, curvas estimadas, flashes, % de cortes en el beat, LUFS, posición del texto, paleta.
3. Por **efecto** recurrente (no por vídeo), haz una ficha de receta en `investigacion/medidas/recetas/<efecto>.md`: qué es, en qué reels aparece, fotogramas medidos (duración, curva, escala, desenfoque, sonido), y una captura de contacto de 6-8 fotogramas (pequeña, para estudio). Prioridad: zooms con motion blur, speed ramps, máscaras y track mattes, recortes de foto con sombra, trazos que se dibujan (trim paths), flechas y subrayados, cajas de llamada, texto dentro de formas, transiciones con light leak y film burn, glitch y RGB split, parallax de recortes, cámara que deriva, tipografía cinética por letra.
4. Las que el analizador no mide (fundidos largos, lamas, máscaras complejas): mide a mano fotograma a fotograma con OpenCV y documenta el método.
5. **Borra los vídeos** al terminar (deja solo fichas, CSV, contact sheets reducidas y recetas).

## Fase 3 · Cosechar lo que Erik ya validó
Recorre `~/remotion`, `~/motion-studio` y `~/style-lab`: componentes y transiciones que ya funcionaron (p. ej. `Hilo.tsx` de APZ, el pop y las lamas de N3, el anillo 3D, la rejilla de documentos, el pixelado de logos, la mezcla musical por actos). Pásalos al kit con su porqué y su procedencia.

## Fase 4 · Kit v2 «nivel After Effects»
Construir en `kit/remotion-edit-kit` (subir versión, mantener los 24 actuales):
1. **Pipeline de assets reales**: importar imagen y vídeo (`staticFile`, `<Img>`, `<OffthreadVideo>`), recorte de sujeto con `rembg` (Erik ya lo tiene instalado) → PNG con alfa, sombra realista y borde de papel opcional; texturas (papel, grano real escaneado, polvo, light leaks, film burn) como capas de vídeo con modos de fusión; capturas de UI reales en mockups 3D; logos en SVG.
2. **Motion graphics de shape layers**: trazos que se dibujan (`@remotion/paths`, `evolvePath`), flechas, círculos de énfasis, subrayados, cajas de llamada, contadores, gráficos que crecen, rutas en mapas, texto enmascarado en formas, track mattes (luma y alfa).
3. **Transiciones**: `@remotion/transitions` como base + las propias (zoom con blur real, speed ramp, light leak, film burn, glitch, barrido de forma, match move de un elemento entre planos).
4. **Cámara**: deriva continua sutil en todo (nada estático salvo el plano de peso), parallax de recortes, empuje con curva asimétrica, desenfoque de movimiento por velocidad (`@remotion/motion-blur` donde compense).
5. **Curvas como en el editor de gráficas de AE**: influencias asimétricas por propiedad, overshoot proporcional a la velocidad (Ebberts), acción secundaria y solapada (los hijos llegan 1-3 f después y con algo menos de amortiguación), ninguna propiedad con la misma curva que otra si no hay motivo.
6. **Lottie** (`@remotion/lottie`) para assets hechos en After Effects o LottieFiles cuando sea más rápido.
7. **Figma**: styleframes y assets desde el MCP (`get_design_context`, `download_assets`, `get_motion_context` traducido a `interpolate`), si el plan de Erik lo permite.
8. **Cada efecto nuevo se calca** contra una referencia real con `calco.py` (p95 ≤ 4 px) antes de entrar en el kit.

## Fase 5 · Prueba de verdad
1. Montar un reel real (APZ «4 horas en 30 segundos» o un episodio de Milionegle) **solo con assets reales**, con el kit v2.
2. Comparar en paralelo con 3 referencias de la Fase 1 (misma duración) y medir ambos con `analizar.py`.
3. Prueba a ciegas con Erik: ¿cuál está editado por Claude? Lo que delate a Claude va a la lista «tics de Claude» (abajo) y se corrige.

## Fase 6 · Cerrar
Actualizar `skills/produccion-reels-instagram` (catálogo, recetas medidas, lista de tics), `motion-remotion` y el README; commit y push; resumen en el cerebro (`04-Aprendizajes` y `08-Skills`).

## Tics que delatan «editado por Claude» (lista de partida; ampliar en la Fase 5)
- Fondo de papel cuadriculado o degradado plano con una tarjeta blanca centrada.
- Tipografía de sistema, un solo peso, todo centrado y perfectamente alineado.
- Placeholders vectoriales en lugar de fotos, vídeo, texturas y recortes reales.
- Todos los elementos entran con el mismo pop o el mismo spring.
- Curvas simétricas y duraciones iguales; nada se solapa.
- Cámara quieta: ni deriva, ni parallax, ni empuje.
- Sin texturas (grano, polvo, luz) ni modos de fusión; colores planos.
- Transiciones de manual (fundido, deslizamiento) en lugar de match moves.
- Sonido escaso o un efecto igual en cada evento.
- Subtítulos genéricos sin jerarquía (sin tamaños ni pesos que marquen la palabra importante).
- Cortes clavados a cada beat (las referencias cortan al beat igual que el azar).

### Añadidos en la Fase 5 (sobrecorrección, medida con `analizar.py` frente a 3 referencias)
- Ráfagas en todo el vídeo: 82 planos y el 74 % de ≤ 8 f, frente a 24-41 planos y un 14 % de ≤ 8 f.
- Empujes exagerados: 17 %/s de zoom frente a 1-3 %/s.
- Frases enteras en pantalla: el texto cambia cada 22 f frente a 6-8 f (trozos de 1-3 palabras).
- Cámara sin temblor de mano (0 px frente a 0,2-3 px).
- Audio sin masterizar: −18 LUFS frente a −14.

