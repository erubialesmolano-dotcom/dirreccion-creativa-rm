# Calcos validados (Fase 4)

Regla: un efecto entra en el kit v2 solo si su versión en Remotion, superpuesta a una referencia real,
da **p95 ≤ 4 px** en `calco.py`. Nunca a ojo.

## Método (cámara)

1. `kit/analisis-referencias/calcar_camara.py REF --desde A --hasta B --out public/local/calco_<n>`
   mide la trayectoria del tramo **con el mismo algoritmo que `calco.py`** (ancla en el primer fotograma
   y re-ancla si el registro se pierde). Si los dos midieran distinto, el ajuste perseguiría otra cosa.
2. Parte la trayectoria en tramos de movimiento (rápidos y derivas lentas entre ellos) y ajusta por
   propiedad (escala, x, y) keyframes de AE `{f, v, infOut, infIn, velOut, velIn}` con la misma bezier que
   `keys()` de `src/v2/curvas.ts`. Usa 2 keys por tramo, o 3 si con 2 queda error. Los keys no salen del tramo.
3. Renderiza la composición `CalcoCamara` con el primer fotograma de la referencia y esos keys, y la
   compara con `calco.py REF out.mp4 --desde A --hasta B --offset -A`.

Los fotogramas de referencia se quedan en `public/local/` (está en .gitignore). Al repo solo suben las curvas.

## Resultados

| Efecto | Referencia | p95 | Medio | Qué se aprendió | En el kit |
|---|---|---|---|---|---|
| Zoom al corte | dl_NxX7Ct f529-568 (30 fps) | 1,88 px | 0,41 px | El zoom de la referencia **acelera hasta el corte** (ease-in, velIn 2,4): ×1,62 en 5 f, sin asentarse. Antes hay un paneo vertical que sale disparado y frena en 6 f. | `CALCOS.zoomAlCorte`, `CALCOS.asentamiento` |
| Paneo látigo | alekaig DfDFgp8NaKc f249-272 (25 fps) | 2,93 px | 1,55 px | Arranca sin rampa (infOut 0,01), hace el 87 % en 7 f y se posa el 13 % en 14 f. **A la vez la escala baja un 3,6 %**: el operador se abre al barrer. | `CALCOS.latigo`, `<Barrido perfil="latigo">` |

## Errores del proceso (para no repetirlos)

- Medir la referencia encadenando fotograma a fotograma y validar con el ancla de `calco.py` da 12 px de
  desacuerdo en un látigo con mucho desenfoque. El medidor y el validador tienen que ser el mismo.
- Si una propiedad no cambia en un tramo, el ajustador libre metía keys fuera del tramo (en el f57 de un
  tramo de 40) y se rompía el zoom final. Ahora se acotan y se saltan los tramos sin cambio real.
- Una deriva lenta después del movimiento (+1,6 % de escala en 10 f) son 12 px de error en el borde.
  Hay que calcarla también; en las referencias casi nada se queda quieto.
