# Empuje lento (push-in)

> Tiras de contacto solo en local (`img/` está en .gitignore: son fotogramas de reels de terceros, para análisis interno).

Medido en 586 planos de 122 referencias (fichas de `analizar.py`, fps normalizados a 30).

## Números

- Duración del plano: 25.2 (IQR 15.0–49.0, n=586) f
- Zoom total del plano: 2.13 (IQR 0.71–4.82, n=586) %; pico por fotograma: 0.21 (IQR 0.11–0.39, n=586) %/f
- Paneo pico: 1.2 (IQR 0.33–3.27, n=586) px/f (en px del ancho de análisis de 640)
- Rotación total: 0.0 (IQR -0.14–0.14, n=586)°
- Temblor: 0.14 (IQR 0.01–0.48, n=586) px RMS (escala 1080), 6.0 (IQR 3.9–8.09, n=586) Hz
- Curva ajustada (solo ajustes con RMSE < 0,08, n=378): lineal (velocidad constante): 217, ease-in (arranca lento y acelera): 66, ease-out (arranca rápido y frena): 60, ease-in-out: 18, ease-in-out asimétrico: 17
- Influencias AE (salida / entrada): 0.04 (IQR 0.0–0.22, n=378) / 0.05 (IQR 0.0–0.2, n=378)

## Desenfoque de movimiento (medido en el vídeo)

Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): 62.25 (IQR 37.9–78.97, n=40). Mínimo del plano: 36.35 (IQR 19.07–48.42, n=40).
Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.

## Ejemplos medidos (los más marcados)

| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |
|---|---|---|---|---|---|---|
| `yt_reel_pSJwUis5jc8` | f473–495 | 22 | 6.01 | 1.2 | 24.6 | lineal (velocidad constante) [0.59, 0, 1.0, 1] |
| `miro_Dax7d5ngKHt` | f296–327 | 39 | 10.05 | 1.08 | 60.4 | ease-in (arranca lento y acelera) [0.21, 0, 1.0, 1] |
| `founderspodcast_DgCqcAhMLYa` | f879–927 | 48 | 10.69 | 1.07 | 64.1 | ease-in-out [0.72, 0, 0.28, 1] |
| `yt_reel_louVIwzmXr4` | f1390–1431 | 41 | 10.87 | 0.32 | 58.3 | lineal (velocidad constante) [0.0, 0, 0.97, 1] |
| `hormozi_Ddii_P4BHns` | f3899–4146 | 247 | 6.6 | 0.98 | 67.4 | ease-in-out asimétrico [0.3, 0, 0.31, 1] |
| `metromedia.house_DgDHsjqBfk2` | f119–129 | 12 | 3.42 | 0.99 | 52.3 | ease-out (arranca rápido y frena) [0.13, 0, 0.01, 1] |
| `dl_NxX7Ct` | f334–362 | 28 | 5.48 | 0.87 | 6.9 | ease-out (arranca rápido y frena) [0.0, 0, 0.25, 1] |
| `grindfull__DfuLuI9Mzk-` | f1440–1500 | 72 | 3.46 | 1.12 | 95.1 | ease-in (arranca lento y acelera) [0.79, 0, 1.0, 1] |
| `creatorcamp_DgGQmFIvktl` | f1757–1769 | 15 | 3.23 | 0.77 | 9.1 | ease-out (arranca rápido y frena) [0.0, 0, 0.01, 1] |
| `nudeproject_Df7nUgSMAX1` | f1675–1822 | 176 | 24.3 | 1.13 | 43.0 | ease-in-out asimétrico [0.86, 0, 0.45, 1] |
| `sam.john.creates_Dd_7jw1K8-L` | f1277–1286 | 9 | 1.67 | 1.19 | 94.5 | ease-in-out asimétrico [0.35, 0, 0.01, 1] |
| `founderspodcast_DgCqcAhMLYa` | f1217–1295 | 78 | 23.16 | 0.54 | 57.0 | lineal (velocidad constante) [0.11, 0, 1.0, 1] |
| `adriasolapastor_Df-QAB2BRF_` | f1289–1386 | 116 | 10.9 | 0.74 | 81.0 | ease-in (arranca lento y acelera) [0.36, 0, 1.0, 1] |
| `founderspodcast_Df9zmYYMM0O` | f225–260 | 35 | 7.57 | 0.71 | 91.0 | ease-out (arranca rápido y frena) [0.0, 0, 0.19, 1] |
| `hormozi_DgKm9OVIUXz` | f0–24 | 30 | 3.08 | 1.11 | 97.9 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |

## Contacto

![empuje 0](img/empuje_0.jpg)
![empuje 1](img/empuje_1.jpg)
![empuje 2](img/empuje_2.jpg)
