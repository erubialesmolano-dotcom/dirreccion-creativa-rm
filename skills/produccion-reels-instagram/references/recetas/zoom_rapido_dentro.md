# Zoom rápido hacia dentro (punch-in / zoom-through)

> Tiras de contacto solo en local (`img/` está en .gitignore: son fotogramas de reels de terceros, para análisis interno).

Medido en 773 planos de 118 referencias (fichas de `analizar.py`, fps normalizados a 30).

## Números

- Duración del plano: 25.2 (IQR 10.0–55.0, n=773) f
- Zoom total del plano: 11.81 (IQR 3.27–32.23, n=773) %; pico por fotograma: 1.75 (IQR 0.92–3.3, n=773) %/f
- Paneo pico: 9.7 (IQR 2.3–29.4, n=773) px/f (en px del ancho de análisis de 640)
- Rotación total: 0.0 (IQR -0.42–0.59, n=773)°
- Temblor: 0.62 (IQR 0.0–2.9, n=773) px RMS (escala 1080), 5.14 (IQR 0.0–6.77, n=773) Hz
- Curva ajustada (solo ajustes con RMSE < 0,08, n=434): ease-out (arranca rápido y frena): 147, lineal (velocidad constante): 135, ease-in (arranca lento y acelera): 86, ease-in-out asimétrico: 38, ease-in-out: 28
- Influencias AE (salida / entrada): 0.09 (IQR 0.0–0.37, n=434) / 0.19 (IQR 0.01–0.61, n=434)

## Desenfoque de movimiento (medido en el vídeo)

Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): 30.2 (IQR 20.2–57.75, n=40). Mínimo del plano: 5.75 (IQR 1.22–15.58, n=40).
Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.

## Ejemplos medidos (los más marcados)

| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |
|---|---|---|---|---|---|---|
| `whop_DfDmQ0pvCsP` | f293–613 | 320 | 704.6 | 18.63 | 39.4 | ease-in (arranca lento y acelera) [0.65, 0, 1.0, 1] |
| `whop_DgI4jAbhjvj` | f365–442 | 77 | 202.34 | 19.99 | 31.0 | ease-in-out asimétrico [0.39, 0, 0.11, 1] |
| `dl_NxX7Ct` | f529–570 | 41 | 99.08 | 18.87 | 3.9 | ease-in (arranca lento y acelera) [0.35, 0, 1.0, 1] |
| `chrismansour___DY4UMcliMHF` | f772–793 | 21 | 190.14 | 19.99 | 28.0 | ease-out (arranca rápido y frena) [0.07, 0, 0.11, 1] |
| `nudeproject_DffKOePskrG` | f154–217 | 79 | -19.7 | 18.17 | 21.4 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `bymaximise_DMDFYpGNnNg` | f1921–2036 | 115 | 370.67 | 20.96 | 28.7 | ease-in-out asimétrico [0.75, 0, 0.01, 1] |
| `nudeproject_DffKOePskrG` | f0–61 | 76 | 374.95 | 18.31 | 5.4 | ease-in (arranca lento y acelera) [0.44, 0, 0.95, 1] |
| `whop_Df0dekgvpWE` | f575–645 | 70 | 41.17 | 18.8 | 65.2 | lineal (velocidad constante) [0.64, 0, 1.0, 1] |
| `miro_DaIoeJuhUOE` | f1280–1533 | 316 | 25.7 | 8.0 | 28.8 | ease-out (arranca rápido y frena) [0.0, 0, 0.01, 1] |
| `yt_reel_wPnohSQBNlk` | f866–873 | 8 | 116.64 | 17.61 | 103.9 | ease-in (arranca lento y acelera) [0.23, 0, 0.93, 1] |
| `metromedia.house_Dax0R-atz8d` | f1036–1060 | 30 | 89.22 | 15.6 | 23.5 | ease-out (arranca rápido y frena) [0.1, 0, 0.15, 1] |
| `nudeproject_DffKOePskrG` | f451–502 | 64 | 89.41 | 14.93 | 24.1 | ease-in-out asimétrico [0.62, 0, 0.13, 1] |
| `whop_Df0dekgvpWE` | f0–160 | 160 | 1902.14 | 16.01 | 50.6 | ease-in (arranca lento y acelera) [0.43, 0, 0.91, 1] |
| `yt_reel_louVIwzmXr4` | f1674–1723 | 49 | 193.43 | 16.27 | 73.5 | ease-in-out [0.91, 0, 0.14, 1] |
| `whop_Df0dekgvpWE` | f775–860 | 85 | 78.39 | 3.49 | 70.0 | ease-in (arranca lento y acelera) [0.4, 0, 1.0, 1] |

## Contacto

![zoom_rapido_dentro 0](img/zoom_rapido_dentro_0.jpg)
![zoom_rapido_dentro 1](img/zoom_rapido_dentro_1.jpg)
![zoom_rapido_dentro 2](img/zoom_rapido_dentro_2.jpg)
