# Paneo látigo (whip)

> Tiras de contacto solo en local (`img/` está en .gitignore: son fotogramas de reels de terceros, para análisis interno).

Medido en 170 planos de 60 referencias (fichas de `analizar.py`, fps normalizados a 30).

## Números

- Duración del plano: 43.62 (IQR 26.09–72.0, n=170) f
- Zoom total del plano: 0.08 (IQR -7.52–10.15, n=170) %; pico por fotograma: 1.76 (IQR 0.66–3.77, n=170) %/f
- Paneo pico: 86.05 (IQR 67.83–120.9, n=170) px/f (en px del ancho de análisis de 640)
- Rotación total: 0.05 (IQR -0.88–2.64, n=170)°
- Temblor: 9.37 (IQR 4.28–15.77, n=170) px RMS (escala 1080), 5.24 (IQR 4.25–6.42, n=170) Hz
- Curva ajustada (solo ajustes con RMSE < 0,08, n=87): lineal (velocidad constante): 23, ease-out (arranca rápido y frena): 22, ease-in (arranca lento y acelera): 21, ease-in-out: 13, ease-in-out asimétrico: 8
- Influencias AE (salida / entrada): 0.19 (IQR 0.04–0.55, n=87) / 0.19 (IQR 0.03–0.65, n=87)

## Desenfoque de movimiento (medido en el vídeo)

Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): 30.3 (IQR 15.1–73.18, n=40). Mínimo del plano: 7.0 (IQR 2.0–16.65, n=40).
Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.

## Ejemplos medidos (los más marcados)

| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |
|---|---|---|---|---|---|---|
| `metromedia.house_Df2Q7Gso5UL` | f1009–1047 | 48 | -80.75 | 21.37 | 34.4 | ease-out (arranca rápido y frena) [0.01, 0, 0.14, 1] |
| `dl_NxX7Ct` | f229–298 | 69 | -72.01 | 15.53 | 75.5 | ease-out (arranca rápido y frena) [0.18, 0, 0.36, 1] |
| `whop_DgI4jAbhjvj` | f660–808 | 148 | -35.54 | 22.39 | 38.2 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `whop_DfDmQ0pvCsP` | f293–613 | 320 | 704.6 | 18.63 | 37.1 | ease-in (arranca lento y acelera) [0.65, 0, 1.0, 1] |
| `whop_DgI4jAbhjvj` | f365–442 | 77 | 202.34 | 19.99 | 28.6 | ease-in-out asimétrico [0.39, 0, 0.11, 1] |
| `nudeproject_DffKOePskrG` | f154–217 | 79 | -19.7 | 18.17 | 13.6 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `pique_ref_ref_ig` | f537–552 | 19 | -51.78 | 18.19 | 70.3 | ease-out (arranca rápido y frena) [0.1, 0, 0.04, 1] |
| `miro_DaIoeJuhUOE` | f1280–1533 | 316 | 25.7 | 8.0 | 7.3 | ease-out (arranca rápido y frena) [0.0, 0, 0.01, 1] |
| `creatorcamp_DgGQmFIvktl` | f2107–2142 | 44 | -67.94 | 11.53 | 72.4 | ease-in (arranca lento y acelera) [0.55, 0, 0.94, 1] |
| `whop_DfDmQ0pvCsP` | f1239–1382 | 143 | -81.65 | 11.13 | 6.7 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `whop_Df0dekgvpWE` | f775–860 | 85 | 78.39 | 3.49 | 29.6 | ease-in (arranca lento y acelera) [0.4, 0, 1.0, 1] |
| `whop_Df0dekgvpWE` | f1330–1513 | 183 | -34.65 | 12.6 | 29.1 | ease-in-out asimétrico [0.99, 0, 0.36, 1] |
| `alekaig_DfAqdP0Bk0x` | f52–238 | 223 | 40.3 | 12.24 | 78.0 | lineal (velocidad constante) [0.0, 0, 0.84, 1] |
| `whop_DfDmQ0pvCsP` | f694–759 | 65 | -66.83 | 12.27 | 30.4 | ease-in (arranca lento y acelera) [0.31, 0, 0.88, 1] |
| `miro_DeKDmkmh_gM` | f224–237 | 16 | 11.12 | 5.26 | 114.5 | ease-in-out asimétrico [0.4, 0, 0.01, 1] |

## Contacto

![latigo 0](img/latigo_0.jpg)
![latigo 1](img/latigo_1.jpg)
![latigo 2](img/latigo_2.jpg)
