# direccion-creativa-rm

Skills para que Claude trabaje como director creativo, editor y motion designer con criterio propio, no copiando referencias. Cada regla está escrita como:

> **efecto buscado → recurso → por qué funciona → cuándo romperlo**, con su nivel de evidencia ([estudio], [creador], [DOC], [inferencia]).

Idea de fondo: el impacto sale de la **contención racionada** (un plano sostenido entre cortes rápidos, un silencio antes del golpe, un acento único). Las recetas de ritmo rápido son el modo "energía"; aquí se añaden los modos "peso" y "respiro".

## Skills

| Skill | Qué hace | Referencias |
|---|---|---|
| `skills/direccion-creativa-audiovisual` | Proceso, jerarquía de decisión (Murch), modos de ritmo, reglas de emoción, sonido, composición, diferenciación de categoría y registro, crítica obligatoria | emoción, diferenciación y registro, composición, sonido y música, licencias, técnicas de montaje, directores, casos desmontados, de la idea a la pieza, limpio vs amateur, gusto (diario de juicios), teoría base |
| `skills/motion-remotion` | Motion de nivel After Effects traducido a Remotion: curvas, springs, stagger, cámara 2.5D/3D, zooms, shake, speed ramps, motion blur, tipografía cinética, transiciones, acabado, Figma → Remotion | curvas y timing, cámara/zoom/3D, motion graphics, flujo Figma |
| `skills/blender-camara-3d` | Blender 5.x por script o MCP, cámara con porqué, previs para IA generativa, puente `shot.json`/`camera.json` con Remotion | pipeline Blender completo con código probado |
| `skills/video-historia-remotion` | **Borrador v2** del Formato A de Milionegle con el porqué de cada regla y las correcciones técnicas. Tiene decisiones pendientes de Erik marcadas con ⚠️ | auditoría 2026 |

`investigacion/` guarda los dos informes, todas las notas en bruto con fuentes (tres rondas) y las versiones anteriores de las skills.

## Instalar

**Claude Code** (todas las skills):

```bash
git clone https://github.com/erubialesmolano-dotcom/direccion-creativa-rm.git
mkdir -p ~/.claude/skills
cp -r direccion-creativa-rm/skills/* ~/.claude/skills/
```

**Claude (app / Cowork)**: comprime cada carpeta de `skills/` (con su `references/`) en un .zip y súbela como skill. Si solo se guarda el `SKILL.md`, la skill sigue funcionando y lee las referencias desde este repositorio (`raw.githubusercontent.com`).

**No sustituyas `video-historia-remotion`** hasta resolver las decisiones pendientes y fusionar el `references/correcciones.md` de la cuenta actual.

## Decisiones pendientes de Erik

1. Las reglas "un cambio cada 1-1,5 s / nunca más de 2 s" y "pop en cada palabra": ¿validadas viéndolas funcionar o heredadas de Metro Media House? Si funcionan: firma del Formato A con su porqué. Si son heredadas: modo "energía", plano de peso de 3-6 s por pieza y sonido solo en eventos de jerarquía.
2. Qué entiende Erik por "T cut" (no es un término estándar; tres lecturas en `montaje-tecnicas.md`).
3. Plan de Figma: la cuenta conectada figura como Starter con asiento View (20 lecturas/mes, sin escritura). El flujo Figma → Remotion necesita Professional con asiento Full.

## Cómo crece

El valor que más sube con el tiempo es `direccion-creativa-audiovisual/references/gusto.md`: cada corrección de Erik con su porqué. Cuando una regla aparezca tres veces, se sube al `SKILL.md`.

## Complementos

- [`arjun988/blender-skills`](https://github.com/arjun988/blender-skills) (MIT): pack de 94 skills de Blender orientado a assets de videojuego. Para este trabajo conviene instalar solo `camera-cinematography`, `lighting`, `rendering`, `compositing`, `animation`, `materials`, `lookdev` y `minimalist-style`.

## Huecos conocidos

Casi no hay entrevistas sobre montaje y sonido de los spots de Anthropic, Apple y Nike; faltan números con fuente para anticipación, squash & stretch y shake; varios precios de licencias vienen de agregadores (comprobar antes de pagar); muchos valores en fotogramas son de oficio y van marcados como [inferencia]. Licencias de 2026: revisar ElevenLabs para uso de agencia.
