# Cámara que deriva (planos largos)

568 planos de 3 s o más en las referencias: 237 fijos (42 %) y 331 con movimiento.

- En los que se mueven: zoom 1.87 (IQR 0.72–6.13, n=331) %/s, paneo 1.81 (IQR 0.46–6.08, n=331) % del ancho/s, rotación 0.01 (IQR -0.16–0.33, n=331) °/s.
- Incluso los "fijos" tienen temblor residual de 0.16 (IQR 0.06–0.39, n=237) px RMS (a 1080): la imagen real nunca está clavada.

Regla de kit: `deriva()` por defecto = zoom ~1-1,5 %/s equivalente, 14 px de deriva y 0,35°; ajustar a la mediana de arriba.
