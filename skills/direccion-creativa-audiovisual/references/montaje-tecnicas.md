# Catálogo de técnicas de montaje

> Fuente: informe 2 §5. Etiquetas de evidencia: [estudio]/[estudio*] dato empírico (con * si viene de plataforma con interés comercial), [norma]/[DOC] especificación oficial, [creador]/[EXPERT] quien hizo la pieza o practicante reconocido, [crítica], [PRACT] tutorial, [inferencia]/[INF]/[I] deducción sin fuente directa. Trata [inferencia] como recomendación, no como hecho.

## 5. Catálogo de técnicas de montaje

La mayoría de los fotogramas de esta tabla son **[I]**: convenciones para probar, no medidas (25 fps salvo que se indique). Las fuentes de docentes (StudioBinder, No Film School, Adobe, PremiumBeat) definen y dan ejemplos, pero casi nunca cifras.

### 5.1 J, L y "T cut"

**La aclaración correcta** [E]. Una edición partida es aquella en que la imagen y el sonido cambian en momentos distintos. **J: el sonido del plano siguiente entra antes**, bajo la imagen del anterior. **L: el sonido del plano anterior se alarga** bajo la imagen del siguiente. El nombre viene de la forma de los clips en la línea de tiempo ([Wikipedia](https://en.wikipedia.org/wiki/Split_edit); [Adobe](https://www.adobe.com/creativecloud/video/discover/j-cut-and-l-cut); [Apple](https://support.apple.com/guide/final-cut-pro/ver1632d82c/mac)). La página de StudioBinder sobre match cuts las da al revés ([StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)): no usarla como referencia para esto. Sin ediciones partidas, una conversación parece "a tennis match" [E].

**"T cut": tres lecturas posibles, decisión pendiente de Erik** [I]. No aparece en la documentación de Avid, Premiere, Resolve ni FCP, ni en manuales de montaje.
- **(a)** Sinónimo flojo de cualquier edición partida, porque el desfase forma una T en la línea de tiempo.
- **(b)** Corte seco: imagen y sonido cortan en el mismo fotograma y forman una línea vertical (el "butt cut").
- **(c)** Una J y una L combinadas: el audio entra antes *y* sale después de un plano insertado, como un plano de recurso sobre un diálogo continuo; en la práctica, un inserto sobre audio sin cortar.

No se elige ninguna aquí: hay que preguntarle a Erik qué entiende él.

### 5.2 Tabla técnica → qué hace sentir → cuándo → fotogramas de trabajo

| Técnica | Qué hace sentir | Cuándo (y cuándo no) | Fotogramas de trabajo |
|---|---|---|---|
| **J-cut** | Anticipación; el oído guía al ojo y el corte parece motivado [I] | Diálogo, cambio de escena, VO que adelanta el siguiente b-roll; no si revela una sorpresa antes de tiempo | Diálogo 6-15 f; cambio de escena o pre-lap 0,5-2 s; en reel 4-10 f [I]. En Remotion: `<Sequence from>` del `<Audio>` unos 8 f antes que el visual |
| **L-cut** | Reflexión: deja que la frase caiga sobre una cara (Kuleshov) [I] | Reacciones; colas de música o ambiente | 8-24 f; las colas de ambiente, varios segundos [I] |
| **Puente sonoro / pre-lap** | Continuidad entre escenas; tira hacia delante | Arranques de *Shaun of the Dead* y *Chicas malas* [E] ([StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)) | 0,5-2 s [I] |
| **Corte en acción** | Invisibilidad; "Our eyes follow movement" [E] ([NFS](https://nofilmschool.com/match-on-action-cut)) | Casi todo corte de reel; no cuando quieres que el corte se note o cuando la quietud tras la acción es lo importante | Dmytryk: "near the dead center of the action" [E]; ~1/3 del gesto en A y 2/3 en B, quitando 1-3 f de movimiento repetido [I] |
| **Corte temprano, medio o tardío** | Anticipación / impulso / resolución | Final de *Tiburón* / pelea de *Civil War* / Upham en *Ryan* [P] ([Filmsupply](https://wpengine.fm.co/filmsupply/cutting-on-action-editing/)) | Estudiar la referencia a 0,25× [P] |
| **Corte en el parpadeo** | Fin de un pensamiento (Murch) [E] | Diálogo, entrevista, VO: cortar al acabar la idea | En el fotograma en que se cierra el párpado o justo después, o en una exhalación o mirada que se aparta [I] |
| **Raccord gráfico** | Conexión o metáfora | Cerilla → amanecer (*Lawrence*), hueso → satélite (*2001*), desagüe → ojo (*Psicosis*) [E]; no si la rima no significa nada | Misma posición y escala; corte seco = salto o yuxtaposición; encadenado de 6-12 f = transformación [I] |
| **Montaje intelectual** | Una tercera idea de dos imágenes (Eisenstein) [E] | Problema ↔ producto con una forma compartida | Planificarlo en el shot list: rara vez sale encontrado en post [I] |
| **Raccord de miradas** | Ver lo que ve el personaje | POV, revelado de producto [E] ([Adobe](https://www.adobe.com/creativecloud/video/hub/guides/eyeline-match-rules-for-filmmakers.html)) | Mantener la dirección de la mirada |
| **Jump cut (Godard)** | Ruptura; recuerda que es una película [E] ([Wikipedia](https://en.wikipedia.org/wiki/Jump_Cut)) | Estados subjetivos (ansiedad, memoria) | Sin valor fijo |
| **Jump cut (YouTube)** | Densidad de información [I] | Cabezas que hablan; no en confesiones ni en premium (se lee como vlog) | Cola de 2-4 f tras la palabra; alternar 100 % y un punch-in del 110-130 %; fundido de audio de 1-2 f en cada unión [I] |
| **Morph Cut** | Ocultar un salto | Solo una cabeza que habla, plano fijo, fondo estático y sin cambios de luz; empezar y acabar cerca de los picos de palabra [E] ([Adobe](https://blog.adobe.com/en/publish/2015/06/18/morph-cut-tips-tricks-for-best-results)) | Adobe no da duración |
| **Montaje paralelo** | Contraste o suspense entre acciones simultáneas | El bautizo de *El padrino* [E]; en un 30": mundo del problema y mundo de la solución [I] | Segmentos que se acortan: 6, 4, 2 y 1 s [I] |
| **Tensión con poco movimiento** | Amenaza contenida | Insertos estáticos: cara, mano, arma (*No es país para viejos*) [P] | — |
| **Montaje de paso del tiempo** | Compresión, transformación | *El graduado* [E] | Planos de 0,3-0,7 s sobre la música [I] |
| **Elipsis** | Confianza en el espectador | "Entrar tarde, salir pronto" [I] | — |
| **Barrido (whip pan)** | Energía, continuidad | PTA y Chazelle [E] | Ambos barridos en la misma dirección y velocidad; corte en el fotograma más borroso; 2-6 f de blur direccional y un whoosh con el pico en el corte [I] |
| **Cortinilla de objeto o cuerpo** | Corte oculto | *La soga*, *1917*, *Birdman*, *Spectre* [E] ([NFS](https://nofilmschool.com/iconic-invisible-cuts-in-movies)); no si los dos planos no casan de estilo | Corte cuando el objeto tapa del todo; si no lo tapa, máscara de 3-8 f tras su borde [I] |
| **Encadenado** | Tiempo que pasa, sueño, rima suave | No entre dos planos del mismo sujeto con ángulos parecidos (parece un error) [I] | Corto 12-24 f; emocional 1-3 s [I]. El encadenado de 1 s por defecto en cada corte es la señal más clara de aficionado [P] ([Fstoppers](https://fstoppers.com/education/7-premiere-pro-habits-are-making-your-edits-look-amateur-902662)) |
| **Fundido a negro / a blanco / a color** | Final / muerte, flash, recuerdo / puntuación | Cierre de capítulo; destello de marca | Destello de color 4-8 f; destello blanco de reel 2-4 f [I] |
| **Smash cut** | Choque, comedia | De lo intenso a lo opuesto, sin solapar el audio | Corte seco [I] |
| **Flash cuts** | Recuerdo, trauma, impacto | Con moderación; cuidado con las normas de fotosensibilidad | 1-4 f [I] |
| **Congelado** | Instante decisivo; presentar a un personaje | Final de *Los 400 golpes*; congelado con rótulo como gancho [I] | — |
| **Rampa de velocidad** | Acento en el pico | Solo con un pico motivado | Del 100 % al 20-30 % y vuelta, con curvas suavizadas; rodar a 50/60 fps o más [I] |
| **Pantalla partida** | Simultaneidad, comparación | Antes y después [I] | — |

### 5.3 Reglas que sí tienen fuente

- **Dmytryk** ([ProVideo Coalition](https://www.provideocoalition.com/seven_rules_for_film_and_video_editors/amp/)) [E]: no cortar sin una razón positiva; si dudas, corta largo; corta en movimiento; lo fresco antes que lo rancio (si hay que añadir fotogramas, a la cabeza del plano nuevo); empezar y acabar escenas en acción continua; los valores dramáticos antes que el raccord perfecto; primero la sustancia y después la forma.
- **Ritmo** [P] ([PremiumBeat](https://www.premiumbeat.com/blog/how-to-edit-a-film-to-music-without-it-becoming-a-music-video)): "you never want to cut your film too closely to the beat". El corte en el beat se reserva para los cambios clave, "once or twice in a sequence", y los cortes "a few frames before or after" el cambio musical se sienten más orgánicos. Hay que variar la duración de los planos como la de las frases ([Adobe Community](https://community.adobe.com/t5/premiere-pro-discussions/faq-discussion-learning-to-edit-how-do-i-decide-where-to-cut/m-p/10642611)). Valores de partida [I]: cortes estructurales en el tiempo fuerte de las frases (cada 4 u 8 compases), cortes dentro de la frase a contratiempo, cambio de densidad en el estribillo o el drop, y un hold de respiro cada 5-8 cortes. Hay quien corta 1-2 f antes del transitorio, pero sin fuente.
- **Aficionado frente a profesional** [P] ([Fstoppers](https://fstoppers.com/education/7-premiere-pro-habits-are-making-your-edits-look-amateur-902662)): el aficionado corta "when the clip runs out"; el profesional, cuando cambia la energía. Prueba: ver el montaje en silencio y comprobar si los cortes siguen tirando hacia delante.

---
