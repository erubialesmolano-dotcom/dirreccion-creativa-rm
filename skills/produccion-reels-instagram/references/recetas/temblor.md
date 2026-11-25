# Cámara en mano / temblor añadido

> Tiras de contacto solo en local (`img/` está en .gitignore: son fotogramas de reels de terceros, para análisis interno).

Medido en 1006 planos de 136 referencias (fichas de `analizar.py`, fps normalizados a 30).

## Números

- Duración del plano: 32.0 (IQR 22.0–51.6, n=1006) f
- Zoom total del plano: 0.11 (IQR -3.67–4.41, n=1006) %; pico por fotograma: 0.82 (IQR 0.33–1.76, n=1006) %/f
- Paneo pico: 20.3 (IQR 11.4–35.2, n=1006) px/f (en px del ancho de análisis de 640)
- Rotación total: -0.02 (IQR -1.49–1.12, n=1006)°
- Temblor: 3.71 (IQR 2.36–6.73, n=1006) px RMS (escala 1080), 6.0 (IQR 5.01–10.0, n=1006) Hz
- Curva ajustada (solo ajustes con RMSE < 0,08, n=580): ease-out (arranca rápido y frena): 182, lineal (velocidad constante): 168, ease-in (arranca lento y acelera): 124, ease-in-out asimétrico: 55, ease-in-out: 51
- Influencias AE (salida / entrada): 0.11 (IQR 0.0–0.41, n=580) / 0.19 (IQR 0.02–0.58, n=580)

## Desenfoque de movimiento (medido en el vídeo)

Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): 36.0 (IQR 25.38–84.32, n=40). Mínimo del plano: 11.65 (IQR 2.8–21.4, n=40).
Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.

## Ejemplos medidos (los más marcados)

| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |
|---|---|---|---|---|---|---|
| `whop_DgI4jAbhjvj` | f660–808 | 148 | -35.54 | 22.39 | 38.2 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `whop_DgI4jAbhjvj` | f365–442 | 77 | 202.34 | 19.99 | 28.6 | ease-in-out asimétrico [0.39, 0, 0.11, 1] |
| `pique_ref_DbjoFw9xS8R` | f333–394 | 76 | -47.95 | 23.49 | 28.2 | lineal (velocidad constante) [0.1, 0, 0.76, 1] |
| `yt_reel_JNhkkEppaBQ` | f1325–1446 | 60 | -83.92 | 16.56 | 22.6 | ease-in-out [0.91, 0, 0.23, 1] |
| `creatorcamp_DgGQmFIvktl` | f2211–2243 | 40 | -71.94 | 16.96 | 7.5 | ease-in-out [0.27, 0, 0.57, 1] |
| `whop_Df0dekgvpWE` | f0–160 | 160 | 1902.14 | 16.01 | 25.5 | ease-in (arranca lento y acelera) [0.43, 0, 0.91, 1] |
| `metromedia.house_DgDHsjqBfk2` | f1472–1530 | 70 | 981.88 | 13.17 | 37.2 | ease-out (arranca rápido y frena) [0.19, 0, 0.51, 1] |
| `whop_DfDmQ0pvCsP` | f1052–1088 | 36 | -77.08 | 13.98 | 62.1 | lineal (velocidad constante) [0.0, 0, 0.82, 1] |
| `whop_Df0dekgvpWE` | f311–344 | 33 | -53.19 | 14.65 | 34.8 | lineal (velocidad constante) [0.23, 0, 0.8, 1] |
| `hawkers_ref_ref_reel_DW7` | f513–542 | 36 | 53.56 | 13.01 | 8.1 | ease-in-out [0.88, 0, 0.01, 1] |
| `whop_DgI4jAbhjvj` | f215–289 | 74 | 547.25 | 14.05 | 33.1 | ease-out (arranca rápido y frena) [0.16, 0, 0.55, 1] |
| `miro_DD_-MO1N5l0` | f4483–4509 | 26 | 51.97 | 3.42 | 95.0 | lineal (velocidad constante) [0.14, 0, 0.94, 1] |
| `yt_reel_louVIwzmXr4` | f1053–1142 | 89 | -70.98 | 12.3 | 34.7 | lineal (velocidad constante) [0.0, 0, 1.0, 1] |
| `yt_reel_JNhkkEppaBQ` | f283–367 | 42 | 74.76 | 9.5 | 45.4 | ease-in-out asimétrico [0.27, 0, 0.01, 1] |
| `dl_2Bn_uT` | f757–784 | 27 | 70.92 | 7.39 | 26.2 | ease-out (arranca rápido y frena) [0.0, 0, 0.56, 1] |

## Contacto

![temblor 0](img/temblor_0.jpg)
![temblor 1](img/temblor_1.jpg)
![temblor 2](img/temblor_2.jpg)
