# Zoom rápido hacia fuera

> Tiras de contacto solo en local (`img/` está en .gitignore: son fotogramas de reels de terceros, para análisis interno).

Medido en 628 planos de 113 referencias (fichas de `analizar.py`, fps normalizados a 30).

## Números

- Duración del plano: 32.4 (IQR 16.19–59.0, n=628) f
- Zoom total del plano: -13.12 (IQR -28.05–-6.27, n=628) %; pico por fotograma: 2.2 (IQR 1.36–3.98, n=628) %/f
- Paneo pico: 11.4 (IQR 3.18–28.8, n=628) px/f (en px del ancho de análisis de 640)
- Rotación total: 0.01 (IQR -0.65–0.77, n=628)°
- Temblor: 0.89 (IQR 0.05–3.03, n=628) px RMS (escala 1080), 5.71 (IQR 4.17–7.37, n=628) Hz
- Curva ajustada (solo ajustes con RMSE < 0,08, n=363): ease-out (arranca rápido y frena): 188, lineal (velocidad constante): 74, ease-in (arranca lento y acelera): 53, ease-in-out asimétrico: 26, ease-in-out: 22
- Influencias AE (salida / entrada): 0.05 (IQR 0.0–0.26, n=363) / 0.42 (IQR 0.11–0.8, n=363)

## Desenfoque de movimiento (medido en el vídeo)

Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): 33.55 (IQR 25.35–50.7, n=40). Mínimo del plano: 11.95 (IQR 5.1–24.52, n=40).
Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.

## Ejemplos medidos (los más marcados)

| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |
|---|---|---|---|---|---|---|
| `metromedia.house_Df2Q7Gso5UL` | f1009–1047 | 48 | -80.75 | 21.37 | 34.4 | ease-out (arranca rápido y frena) [0.01, 0, 0.14, 1] |
| `dl_NxX7Ct` | f229–298 | 69 | -72.01 | 15.53 | 46.5 | ease-out (arranca rápido y frena) [0.18, 0, 0.36, 1] |
| `whop_DgI4jAbhjvj` | f660–808 | 148 | -35.54 | 22.39 | 34.5 | ease-in (arranca lento y acelera) [0.99, 0, 1.0, 1] |
| `pique_ref_DbjoFw9xS8R` | f333–394 | 76 | -47.95 | 23.49 | 28.2 | lineal (velocidad constante) [0.1, 0, 0.76, 1] |
| `dl_3HnsuG` | f829–926 | 97 | -32.66 | 18.65 | 56.0 | lineal (velocidad constante) [0.34, 0, 0.27, 1] |
| `dl_AQMkNe` | f0–82 | 98 | -71.96 | 20.07 | 27.3 | ease-in-out asimétrico [0.27, 0, 0.44, 1] |
| `pique_ref_ref_ig` | f537–552 | 19 | -51.78 | 18.19 | 3.0 | ease-out (arranca rápido y frena) [0.1, 0, 0.04, 1] |
| `yt_reel_JNhkkEppaBQ` | f1325–1446 | 60 | -83.92 | 16.56 | 22.6 | ease-in-out [0.91, 0, 0.23, 1] |
| `dl_NxX7Ct` | f584–624 | 40 | -66.34 | 20.04 | 52.8 | ease-in-out [0.61, 0, 0.2, 1] |
| `nudeproject_DffKOePskrG` | f324–399 | 94 | -58.89 | 17.93 | 23.1 | ease-in-out asimétrico [0.99, 0, 0.69, 1] |
| `creatorcamp_DgGQmFIvktl` | f2107–2142 | 44 | -67.94 | 11.53 | 57.4 | ease-in (arranca lento y acelera) [0.55, 0, 0.94, 1] |
| `nudeproject_DffKOePskrG` | f1529–1617 | 110 | -66.01 | 17.67 | 15.6 | lineal (velocidad constante) [0.0, 0, 0.92, 1] |
| `yt_reel_louVIwzmXr4` | f295–326 | 31 | -89.38 | 18.02 | 90.3 | lineal (velocidad constante) [0.0, 0, 1.0, 1] |
| `dl_editao` | f907–1001 | 94 | -18.32 | 16.04 | 56.8 | ease-out (arranca rápido y frena) [0.0, 0, 0.01, 1] |
| `creatorcamp_DgGQmFIvktl` | f2211–2243 | 40 | -71.94 | 16.96 | 4.5 | ease-in-out [0.27, 0, 0.57, 1] |

## Contacto

![zoom_rapido_fuera 0](img/zoom_rapido_fuera_0.jpg)
![zoom_rapido_fuera 1](img/zoom_rapido_fuera_1.jpg)
![zoom_rapido_fuera 2](img/zoom_rapido_fuera_2.jpg)
