# Entradas de texto y gráficos (cajas, flechas, recortes, rótulos)

Medido con `medidas_manuales.py`: **72 entradas en 25 referencias**, sacadas de 1.233 planos con la cámara casi quieta.

**Método (OpenCV):**
- Se detecta una aparición local: diferencia con el fotograma anterior en menos del 35 % del cuadro.
- Se sigue el área de bordes (Canny) de esa caja durante 20 f.
- Se descarta lo que no crece y se asienta (personas que se mueven, curvas con bajones o negativos).
- Es una medida ruidosa: vale para órdenes de magnitud, no para calcar un efecto concreto (para eso está `calco.py`).

| Medida | P25 | Mediana | P75 |
|---|---|---|---|
| Fotogramas hasta el 90 % | 3 | **9** | 15 |
| Overshoot (pasarse antes de asentarse) | 3 % | **7 %** | 21 % |
| Tamaño de la caja (% del cuadro) | 6 % | 14 % | 27 % |

- **Un 24 % entra de golpe** (≤ 1 f, en corte seco). Es la ráfaga «ta-ta-ta» de unrespiro y APZ: sin animación de entrada.
- **El 60 % se pasa más de un 5 %** antes de asentarse. El pop existe, pero **pequeño** (7 % de mediana), no el rebote de un spring por defecto.
- **En Remotion:** `LineaCinetica` con `durLetra` 9. Los recortes y cajas van en corte seco o con un 5-8 % de sobreescala en 9 f; nunca todos con el mismo pop.
