# Rampa de velocidad (speed ramp)

Medido con `kit/analisis-referencias/medidas_manuales.py`: **65 rampas en 42 referencias**, sacadas de 1.258 planos con movimiento fuerte.

**Método (OpenCV):**
- Dentro de un plano sin corte se mide la velocidad aparente de cada fotograma: desplazamiento del centro más cambio de escala por media diagonal, en px/f a 1080 de alto.
- Hay rampa si la velocidad suavizada (mediana de 3) cambia al menos 3× y los dos lados son tramos estables, no un pico suelto.
- La transición se mide del 10 % al 90 % del cambio.

| Medida | P25 | Mediana | P75 |
|---|---|---|---|
| Relación rápido/lento | 8,6× | **12,6×** | 40× |
| Fotogramas que tarda el cambio | 5 | **8** | 12 |
| Velocidad del tramo rápido (px/f) | 18 | 28 | 38 |
| Velocidad del tramo lento (px/f) | 0,5 | 1,4 | 3,6 |

- **Sentido:** el 62 % va de rápido a lento (entra disparado y se frena para que leas) y el 38 % de lento a rápido.
- **En Remotion:** `<Clip tiempo={rampa(golpe, {rapido: 2.4, lento: 0.2, entrada: 8, salida: 8})}>`. Con rápido 2,4× y lento 0,2× la relación es de 12×, la mediana medida, y el cambio dura 8 f. El tramo lento casi se para (1,4 px/f), pero **no se congela**.
- **Tic de Claude:** una rampa suave de 2-3× en 20 f. Las reales son bruscas: 12× en 8 f.
