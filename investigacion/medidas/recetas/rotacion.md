# Rotación de cámara

> Tiras de contacto solo en local (`img/` está en .gitignore: son fotogramas de reels de terceros, para análisis interno).

Medido en 1003 planos de 134 referencias (fichas de `analizar.py`, fps normalizados a 30).

## Números

- Duración del plano: 23.0 (IQR 13.75–40.02, n=1003) f
- Zoom total del plano: 0.08 (IQR -3.01–4.08, n=1003) %; pico por fotograma: 0.79 (IQR 0.32–1.72, n=1003) %/f
- Paneo pico: 13.4 (IQR 5.0–30.75, n=1003) px/f (en px del ancho de análisis de 640)
- Rotación total: -0.36 (IQR -2.96–2.96, n=1003)°
- Temblor: 1.4 (IQR 0.0–4.05, n=1003) px RMS (escala 1080), 5.29 (IQR 0.0–7.06, n=1003) Hz
- Curva ajustada (solo ajustes con RMSE < 0,08, n=582): ease-out (arranca rápido y frena): 192, lineal (velocidad constante): 191, ease-in (arranca lento y acelera): 114, ease-in-out asimétrico: 47, ease-in-out: 38
- Influencias AE (salida / entrada): 0.09 (IQR 0.0–0.31, n=582) / 0.17 (IQR 0.02–0.5, n=582)

## Desenfoque de movimiento (medido en el vídeo)

Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): 37.2 (IQR 21.85–60.03, n=40). Mínimo del plano: 9.0 (IQR 2.0–27.6, n=40).
Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.

## Ejemplos medidos (los más marcados)

| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |
|---|---|---|---|---|---|---|
| `whop_DgI4jAbhjvj` | f365–442 | 77 | 202.34 | 19.99 | 28.6 | ease-in-out asimétrico [0.39, 0, 0.11, 1] |
| `dl_3HnsuG` | f829–926 | 97 | -32.66 | 18.65 | 99.6 | lineal (velocidad constante) [0.34, 0, 0.27, 1] |
| `pique_ref_ref_ig` | f537–552 | 19 | -51.78 | 18.19 | 70.3 | ease-out (arranca rápido y frena) [0.1, 0, 0.04, 1] |
| `dl_editao` | f907–1001 | 94 | -18.32 | 16.04 | 56.8 | ease-out (arranca rápido y frena) [0.0, 0, 0.01, 1] |
| `nudeproject_DffKOePskrG` | f451–502 | 64 | 89.41 | 14.93 | 72.9 | ease-in-out asimétrico [0.62, 0, 0.13, 1] |
| `whop_DfDmQ0pvCsP` | f1239–1382 | 143 | -81.65 | 11.13 | 6.7 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `whop_Df0dekgvpWE` | f0–160 | 160 | 1902.14 | 16.01 | 25.5 | ease-in (arranca lento y acelera) [0.43, 0, 0.91, 1] |
| `whop_Df0dekgvpWE` | f775–860 | 85 | 78.39 | 3.49 | 29.6 | ease-in (arranca lento y acelera) [0.4, 0, 1.0, 1] |
| `metromedia.house_DgDHsjqBfk2` | f1472–1530 | 70 | 981.88 | 13.17 | 37.2 | ease-out (arranca rápido y frena) [0.19, 0, 0.51, 1] |
| `whop_DfDmQ0pvCsP` | f694–759 | 65 | -66.83 | 12.27 | 30.4 | ease-in (arranca lento y acelera) [0.31, 0, 0.88, 1] |
| `whop_Df0dekgvpWE` | f311–344 | 33 | -53.19 | 14.65 | 34.8 | lineal (velocidad constante) [0.23, 0, 0.8, 1] |
| `videoarecrear` | f75–80 | 5 | 25.13 | 15.31 | 3.0 | —  |
| `whop_DfDmQ0pvCsP` | f761–1002 | 241 | -30.87 | 10.14 | 62.5 | ease-in-out asimétrico [0.99, 0, 0.38, 1] |
| `hawkers_ref_ref_reel_DW7` | f513–542 | 36 | 53.56 | 13.01 | 8.1 | ease-in-out [0.88, 0, 0.01, 1] |
| `sam.john.creates_DgFq-vPIhLb` | f223–229 | 6 | 85.11 | 14.31 | 64.1 | lineal (velocidad constante) [0.12, 0, 1.0, 1] |

## Contacto

![rotacion 0](img/rotacion_0.jpg)
![rotacion 1](img/rotacion_1.jpg)
![rotacion 2](img/rotacion_2.jpg)
