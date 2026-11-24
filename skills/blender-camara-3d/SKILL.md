---
name: blender-camara-3d
description: Blender controlado por Claude para cámara, previs y 3D de motion. Scripts bpy de Blender 5.x sin interfaz, Blender MCP, rigs y lentes, blockouts grises como referencia de cámara para vídeo con IA, y el puente shot.json y camera.json hacia Remotion. Úsala cuando haya que diseñar o controlar un movimiento de cámara, hacer previs 3D, renderizar elementos 3D o fijar la trayectoria de cámara de una generación de IA.
---

# Blender: cámara, previs y 3D para Erik

Blender es aquí la mejor herramienta de cámara disponible: la misma escena sirve para previsualizar, para guiar la cámara de la IA generativa y para renderizar capas que se montan en Remotion. La decisión de qué debe sentir el plano la toma `direccion-creativa-audiovisual`; el motion 2D/2.5D, `motion-remotion`. Esta skill ejecuta la cámara y el 3D.

Referencia completa (código probado en bpy 5.3 y Remotion 4.0.547, fuentes y huecos): `references/blender-pipeline.md` (si no está: `https://raw.githubusercontent.com/erubialesmolano-dotcom/direccion-creativa-rm/main/skills/blender-camara-3d/references/blender-pipeline.md`). Las reglas de Blender que Erik ya validó en su Obsidian (`cerebro`) mandan sobre esta skill: consúltalas si están disponibles.

---

## 1. Dos maneras de controlar Blender

| Vía | Para qué | Cómo |
|---|---|---|
| **Script por lotes** (producción) | Reproducible, versionable, sin GUI | `blender -b --factory-startup --python-exit-code 1 -P script.py -- args`, con `-a` o `-f N` **al final** (el orden de argumentos importa) |
| **MCP en vivo** (exploración, blockout rápido) | Claude ejecuta Python en un Blender abierto y mira el viewport | `ahujasid/mcp-for-blender` (antes `blender-mcp`; comunitario, no oficial). Ejecuta Python sin autenticación y trae **telemetría activada por defecto**: pon `DISABLE_TELEMETRY=true`, guarda el archivo antes y no expongas el puerto 9876 fuera de localhost |

Cierra cada script con verificación visual: render a 25 % de un fotograma clave y míralo antes de dar el plano por bueno.

---

## 2. Trampas de API en Blender 5.x (causa principal de fallos de Claude)

- `action.fcurves` **ya no existe**. Usa `bpy_extras.anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot).fcurves`.
- Compositor: `scene.compositing_node_group`, no `scene.node_tree`.
- EEVEE es `'BLENDER_EEVEE'`; el acceso tipo diccionario a ajustes (`scene['cycles']`) se eliminó.
- `read_factory_settings(use_empty=True)` deja la escena sin World ni luces: créalos o el render sale negro.
- Nombres estables con prefijo: `CAM_`, `GEO_`, `LGT_`, `EMPTY_`.
- Si dudas de una API, ejecútala en pequeño y lee el error antes de escribir el script entero.

---

## 3. Cámara: decisiones con porqué

| Efecto buscado | Recurso | Por qué / cuándo romperlo |
|---|---|---|
| Natural, "estar ahí" | 35-50 mm | Cerca de la visión humana. Por defecto |
| Espacio, energía, empuje dramático | 24-28 mm | Exagera la profundidad; nunca caras de cerca (deforma) |
| Producto, retrato, compresión, documental | 85-135 mm | Aplana y aísla; en tele el fondo "se pega" al sujeto |
| Vértigo, toma de conciencia | Dolly zoom (avanza mientras abre focal, o al revés) | Úsalo una vez; como transición rutinaria es tic |
| Aislar al sujeto | DOF con **Focus Object** (empty), f/2-4, **escena a escala real** | A escala falsa el desenfoque miente. Sin DOF en look maqueta salvo tilt-shift buscado |
| Seguir mirando algo | Track To (−Z, Up Y); Damped Track si la cámara pasa por encima | Rig: animar cámara y target por separado |
| Trayectoria diseñada | Follow Path con Fixed Position y Offset Factor 0→1 con easing en esa curva | Curva suave = movimiento de grúa o dron |
| Movimiento premium | Bezier con handles Auto Clamped, ease-in-out en arranques y paradas, sin overshoot | Lineal solo en loops |
| Cámara en mano | Camera Shakify (capturado de cámaras reales) o modificador Noise sutil en el target o en un empty padre, fase distinta por eje; Restrict Frame Range para meterlo por tramos | Sin temblor en el plano de peso: la quietud hace notar el movimiento |
| Obturador | 0,5 de base (equivale a 180°); más corto = nervioso; más largo = onírico | Motion blur activo en movimientos rápidos |

Regla general: **la cámara se mueve solo con motivo** (seguir, revelar, cambiar la relación con el sujeto). Comprueba el encuadre al inicio, mitad y final de cada movimiento.

---

## 4. Look premium y render

- Color: **Standard** para colores de marca exactos; **AgX** para realismo; **Khronos PBR Neutral** para producto. Filmic está obsoleto.
- Kit premium: bevel en todo (sin aristas perfectas), roughness variada, área grande como key, contraluz para recortar, HDRI de estudio suave, ciclorama. Nada de negro puro ni de una luz puntual sola.
- Delata "Blender amateur": aristas sin bevel, materiales de plástico uniforme, luz plana, cámara a la altura de los ojos sin intención, órbitas de 360° sin motivo.
- Motor: EEVEE con GPU para mograph y previs; Cycles para hero y producto. **Sin GPU (servidor en la nube), Cycles CPU** con pocas muestras y denoise: EEVEE sin GPU es mucho más lento.

---

## 5. Previs para vídeo con IA

1. Blockout con **proxies grises simples** (el detalle se filtra como CGI en la generación).
2. Si basta un movimiento estándar: preset de cámara de la herramienta (Higgsfield, Kling, Veo) con primer y último fotograma sacados de Blender y estilizados.
3. Si hace falta **trayectoria exacta**: el render gris como vídeo de referencia (Seedance 2.0, Kling O1 reference de 3-10 s, Runway Aleph, Luma Modify en modo Adhere o Flex). Refuerza siempre el movimiento también en el prompt.
4. Si la IA copia un movimiento robótico: deja las poses clave y pon en negro los intermedios, o simplifica la referencia.
5. Para coherencia entre planos: la misma escena y el mismo `shot.json` para todos los planos de una secuencia.

Verifica el estado actual de cada herramienta de IA antes de prometer un control concreto: cambian cada pocos meses.

---

## 6. Puente con Remotion

- **Mismo fps** en Blender y Remotion (Blender trae 24 por defecto). Blender empieza en el fotograma 1 y Remotion en el 0.
- **Calidad final**: renders de Blender (PNG RGBA o vídeo con alfa) como capas en Remotion (`<Img>` en secuencia, `<OffthreadVideo>`).
- **Elementos ligeros pegados a la cámara** (texto 3D, partículas simples): R3F en `<ThreeCanvas width height>` con la cámara exportada; anima con `useCurrentFrame()`, nunca `useFrame`; GL `angle`. En R3F nativo no existe `makeDefault` (es de drei): usa `useThree().set`.
- **Exporta `camera.json`**, no confíes solo en glTF: glTF hornea Track To pero pierde la animación de focal salvo con `export_pointer_animation=True` y un loader que lo soporte.
- Ejes: Z-up → Y-up premultiplicando la matriz de mundo por una rotación de −90° en X (`R @ cam.matrix_world`); no conjugues el cuaternión.
- FOV: three usa FOV **vertical**; respeta `sensor_fit` (en 9:16 con AUTO, los 36 mm pasan a la vertical).

---

## 7. Interfaz de control de cámara (arquitectura recomendada)

```
shot.json  (fuente única: fps, duración, aspect, keys {frame, pos, target, lens, easing}, shake, DOF)
  ├─► Remotion Studio: composición con schema zod y defaultProps en línea → Erik ajusta números,
  │     keyframes y easing en Studio (se guardan en el código); vista previa R3F con proxies
  ├─► build_shot.py en Blender (-b) → shot.blend, previs gris, primer/último fotograma, renders RGBA,
  │     camera.json + scene.glb
  └─► Remotion (montaje final): secuencias de Blender + vídeo IA + texto 3D pegado a la cámara
```

- Ajuste fino a mano: Blender GUI con el add-on Camera Rigs (Dolly, Crane, 2D, Dolly Zoom) y el mismo exportador regenera `camera.json`.
- Conflictos: gana el último que exporta, y Claude avisa.
- No uses Theatre.js (parado desde mayo de 2024, incompatible con R3F 9) ni Spline para render fotograma a fotograma. leva solo para ajustes efímeros.

---

## 8. Skills de Blender de terceros

`arjun988/blender-skills` (MIT, 94 skills, nov. 2026) es útil como complemento, pero está orientado a assets de videojuego (polycount, LOD, exportar a Unity/Unreal/Godot). Para el trabajo de Erik, las que aportan son `camera-cinematography`, `lighting`, `rendering`, `compositing`, `animation`, `materials`, `lookdev` y `minimalist-style`. Instálalas solo esas (copiando sus carpetas a `.claude/skills/`) para no llenar el contexto de skills de géneros de juego. Su `.mcp.json` usa `cmd /c uvx blender-mcp` (Windows) con `DISABLE_TELEMETRY=true`; en macOS el comando es `uvx` directamente. Si una instrucción de esas skills choca con esta (por ejemplo, API de Blender anterior a 5.x), manda esta.

---

## 9. Checklist antes de entregar un plano 3D

1. ¿El movimiento de cámara tiene motivo y una sola intención?
2. ¿Focal elegida por sensación, no por defecto?
3. ¿Escala real y DOF con Focus Object?
4. ¿Encuadre comprobado al inicio, mitad y final, y en la relación de aspecto de entrega?
5. ¿Mismo fps que Remotion y desfase de fotograma 1/0 resuelto?
6. ¿Render de prueba mirado?
7. ¿Script reproducible guardado junto al `shot.json`?
