"""Recorte de sujeto con rembg → PNG con alfa listo para <Recorte>.

    python scripts/recortar.py foto.jpg public/recortes/foto.png
    python scripts/recortar.py foto.jpg salida.png --modelo isnet-general-use --busto

Qué hace además de rembg (lección de Piqué, «Multitud de fondo sin efecto Photoshop»):
- se queda con la componente más grande del alfa (quita restos del fondo y trozos sueltos);
- cierra agujeros pequeños y suaviza el borde 1 px (sin halo gris: el color del borde se toma
  del interior, «defringe»);
- --busto corta en horizontal bajo los hombros y redondea el corte;
- recorta el lienzo al sujeto con un margen para que el borde de pegatina no se salga.
"""
import argparse
import cv2
import numpy as np
from PIL import Image


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('entrada'); ap.add_argument('salida')
    ap.add_argument('--modelo', default='isnet-general-use')
    ap.add_argument('--busto', action='store_true')
    ap.add_argument('--margen', type=int, default=24)
    a = ap.parse_args()

    from rembg import remove, new_session
    img = Image.open(a.entrada).convert('RGB')
    rgba = np.array(remove(img, session=new_session(a.modelo)))
    al = rgba[:, :, 3]

    # componente más grande
    _, bin_ = cv2.threshold(al, 127, 255, cv2.THRESH_BINARY)
    n, lab, st, _ = cv2.connectedComponentsWithStats(bin_)
    if n > 1:
        k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
        mascara = (lab == k).astype(np.uint8) * 255
        mascara = cv2.morphologyEx(mascara, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
        al = np.minimum(al, cv2.dilate(mascara, np.ones((3, 3), np.uint8)))

    if a.busto:
        ys = np.where(al.max(axis=1) > 127)[0]
        corte = int(ys[0] + (ys[-1] - ys[0]) * 0.62)
        al[corte:] = 0

    # defringe: el color de los píxeles semitransparentes se toma de los opacos vecinos
    rgb = rgba[:, :, :3].astype(np.float32)
    op = (al > 230).astype(np.float32)
    k = 7
    suma = cv2.blur(rgb * op[:, :, None], (k, k)); peso = cv2.blur(op, (k, k))[:, :, None]
    borde = (al > 0) & (al <= 230)
    rgb[borde] = (suma / np.maximum(peso, 1e-3))[borde]
    al = cv2.GaussianBlur(al, (0, 0), 0.7)

    out = np.dstack([np.clip(rgb, 0, 255).astype(np.uint8), al])
    ys, xs = np.where(al > 8)
    m = a.margen
    y0, y1 = max(0, ys.min() - m), min(al.shape[0], ys.max() + m)
    x0, x1 = max(0, xs.min() - m), min(al.shape[1], xs.max() + m)
    Image.fromarray(out[y0:y1, x0:x1]).save(a.salida)
    print(a.salida, f'{x1 - x0}x{y1 - y0}')


if __name__ == '__main__':
    main()
