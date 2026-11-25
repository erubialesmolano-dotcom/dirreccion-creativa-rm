# Alejamiento lento (pull-out)

> Tiras de contacto solo en local (`img/` está en .gitignore: son fotogramas de reels de terceros, para análisis interno).

Medido en 469 planos de 111 referencias (fichas de `analizar.py`, fps normalizados a 30).

## Números

- Duración del plano: 24.0 (IQR 11.25–46.0, n=469) f
- Zoom total del plano: -1.57 (IQR -3.77–-0.49, n=469) %; pico por fotograma: 0.21 (IQR 0.09–0.46, n=469) %/f
- Paneo pico: 1.1 (IQR 0.4–2.9, n=469) px/f (en px del ancho de análisis de 640)
- Rotación total: 0.0 (IQR -0.22–0.17, n=469)°
- Temblor: 0.15 (IQR 0.0–0.51, n=469) px RMS (escala 1080), 5.71 (IQR 0.0–8.0, n=469) Hz
- Curva ajustada (solo ajustes con RMSE < 0,08, n=262): lineal (velocidad constante): 111, ease-out (arranca rápido y frena): 87, ease-in (arranca lento y acelera): 31, ease-in-out: 18, ease-in-out asimétrico: 15
- Influencias AE (salida / entrada): 0.04 (IQR 0.0–0.2, n=262) / 0.15 (IQR 0.0–0.55, n=262)

## Desenfoque de movimiento (medido en el vídeo)

Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): 63.95 (IQR 37.92–91.1, n=40). Mínimo del plano: 32.75 (IQR 17.82–49.0, n=40).
Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.

## Ejemplos medidos (los más marcados)

| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |
|---|---|---|---|---|---|---|
| `miro_DD_-MO1N5l0` | f1690–1707 | 17 | -4.03 | 1.06 | 60.8 | ease-in (arranca lento y acelera) [0.44, 0, 0.97, 1] |
| `sam.john.creates_DXeyVwDiNDt` | f2673–2715 | 42 | -7.65 | 1.0 | 83.6 | ease-out (arranca rápido y frena) [0.0, 0, 0.1, 1] |
| `inquisitionaire_DRzzMbzj7SJ` | f2830–3012 | 91 | -1.87 | 0.93 | 28.3 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `clubunrespiro_DfabYg6KBIl` | f81–122 | 51 | -3.19 | 1.11 | 80.5 | ease-in (arranca lento y acelera) [0.99, 0, 0.97, 1] |
| `yt_reel_wTunyjZ2Ecs` | f109–131 | 28 | -6.28 | 0.95 | 68.1 | ease-in (arranca lento y acelera) [0.99, 0, 0.87, 1] |
| `bymaximise_DecHwV7RkAu` | f2783–2821 | 46 | -10.41 | 0.65 | 47.9 | ease-in (arranca lento y acelera) [0.56, 0, 1.0, 1] |
| `grindfull__Dfo0s98s9xC` | f77–141 | 77 | -4.55 | 1.15 | 449.1 | ease-in (arranca lento y acelera) [0.81, 0, 1.0, 1] |
| `clubunrespiro_Df1zJ7pqQv1` | f402–433 | 39 | -4.78 | 0.79 | 91.6 | ease-out (arranca rápido y frena) [0.18, 0, 0.47, 1] |
| `metromedia.house_Df2Q7Gso5UL` | f1049–1070 | 26 | -8.35 | 1.04 | 91.0 | lineal (velocidad constante) [0.0, 0, 0.94, 1] |
| `sam.john.creates_DgFq-vPIhLb` | f305–325 | 20 | -2.49 | 0.93 | 91.4 | ease-in-out [0.99, 0, 0.01, 1] |
| `pique_ref_Db55l3zx7wS` | f1514–1555 | 51 | -10.29 | 1.05 | 32.0 | ease-out (arranca rápido y frena) [0.03, 0, 0.12, 1] |
| `miro_DMdq5YdRQ6q` | f251–260 | 11 | -2.35 | 0.64 | 96.9 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `dl_2Bn_uT` | f1250–1286 | 36 | -6.07 | 1.02 | 9.7 | ease-out (arranca rápido y frena) [0.0, 0, 0.43, 1] |
| `nudeproject_DffKOePskrG` | f634–874 | 300 | -19.42 | 0.4 | 26.7 | lineal (velocidad constante) [0.16, 0, 0.94, 1] |
| `gazisj_DfzjQpXxozj` | f322–386 | 64 | -5.57 | 1.19 | 93.4 | ease-in-out asimétrico [0.99, 0, 0.78, 1] |

## Contacto

![alejamiento 0](img/alejamiento_0.jpg)
![alejamiento 1](img/alejamiento_1.jpg)
![alejamiento 2](img/alejamiento_2.jpg)
