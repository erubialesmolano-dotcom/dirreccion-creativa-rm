"""Genera las capas de textura del kit v2 en public/texturas/ (vídeo en bucle, para modos de fusión).

    python scripts/generar_texturas.py            # todas
    python scripts/generar_texturas.py grano      # una

Son texturas sintéticas hechas como en un compositor (ruido con la estructura de una película, no
ruido blanco plano). Si Erik tiene overlays escaneados de verdad (grano de 16 mm, film burn de
stock), se dejan en public/texturas/ con el mismo nombre y el componente <Textura> los usa igual.

- grano.mp4     gris 50 % con grano de luminancia en dos escalas que cambia cada fotograma (overlay / soft-light)
- polvo.mp4     fondo negro con motas y pelos que aparecen 1-3 f y rayas verticales intermitentes (screen)
- leak_a.mp4    manchas cálidas que derivan y respiran sobre negro (screen / add)
- burn_a.mp4    quemado de película: frente de fuego naranja-blanco que entra por un borde (screen), 24 f
"""
import subprocess, sys, os
import numpy as np

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'texturas')
os.makedirs(OUT, exist_ok=True)
W, H, FPS = 720, 1280, 30  # se escalan a 1080×1920 en el componente; el grano gana tamaño de 16 mm
rng = np.random.default_rng(7)


def ffmpeg(nombre, n, gen, rgb=True, crf=20):
    ruta = os.path.join(OUT, nombre)
    p = subprocess.Popen(
        ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
         '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', ruta],
        stdin=subprocess.PIPE)
    for i in range(n):
        fr = gen(i)
        if fr.ndim == 2:
            fr = np.repeat(fr[:, :, None], 3, axis=2)
        p.stdin.write(np.clip(fr, 0, 255).astype(np.uint8).tobytes())
    p.stdin.close(); p.wait()
    print(nombre, os.path.getsize(ruta) // 1024, 'KB')


def blur(a, k):
    import cv2
    return cv2.GaussianBlur(a, (0, 0), k)


def grano(i):
    fino = rng.normal(0, 1, (H, W)).astype(np.float32)
    grueso = blur(rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32), 0.8)
    import cv2
    grueso = cv2.resize(grueso, (W, H), interpolation=cv2.INTER_LINEAR)
    g = 0.65 * blur(fino, 0.55) + 0.9 * grueso
    return 128 + g * 15


def polvo_gen():
    motas = []
    def gen(i):
        import cv2
        fr = np.zeros((H, W), np.float32)
        # 0-3 motas nuevas por fotograma, viven 1-3 f
        for _ in range(rng.poisson(1.6)):
            motas.append([rng.uniform(0, W), rng.uniform(0, H), rng.uniform(1, 4), int(rng.integers(1, 4)), rng.random() < 0.25])
        for m in motas:
            x, y, r, vida, pelo = m
            if pelo:
                pts = np.cumsum(rng.normal(0, 3, (12, 2)), axis=0) + [x, y]
                cv2.polylines(fr, [pts.astype(np.int32)], False, 180, 1, cv2.LINE_AA)
            else:
                cv2.circle(fr, (int(x), int(y)), int(r), 230, -1, cv2.LINE_AA)
            m[3] -= 1
        motas[:] = [m for m in motas if m[3] > 0]
        # raya vertical intermitente
        if (i // 7) % 3 == 0:
            x = int(W * (0.3 + 0.4 * np.sin(i * 0.37)))
            cv2.line(fr, (x, 0), (x + int(rng.integers(-3, 3)), H), 120, 1, cv2.LINE_AA)
        return blur(fr, 0.6)
    return gen


def leak(i, n=150):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    t = i / n * 2 * np.pi
    fr = np.zeros((H, W, 3), np.float32)
    manchas = [((0.15, 0.25), (255, 140, 60), 0.55), ((0.85, 0.6), (255, 70, 40), 0.45), ((0.5, 0.95), (255, 210, 150), 0.5)]
    for k, ((cx, cy), col, rr) in enumerate(manchas):
        cx2 = (cx + 0.12 * np.sin(t + k * 2.1)) * W
        cy2 = (cy + 0.10 * np.cos(t * 0.8 + k)) * H
        r = rr * W * (1 + 0.15 * np.sin(t * 1.3 + k * 1.7))
        d = ((xx - cx2) ** 2 + (yy - cy2) ** 2) / (r * r)
        a = np.exp(-d * 2.2) * (0.75 + 0.25 * np.sin(t * 2 + k))
        fr += a[:, :, None] * np.array(col, np.float32)[None, None, :]
    return fr


def fbm(octavas=5, base=6):
    """Ruido fractal (suma de octavas): grandes masas suaves + detalle fino, como la emulsión quemada."""
    import cv2
    acc = np.zeros((H, W), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octavas):
        n = base * 2 ** o
        capa = rng.random((max(2, H * n // W), n)).astype(np.float32)
        acc += amp * cv2.resize(capa, (W, H), interpolation=cv2.INTER_CUBIC)
        tot += amp
        amp *= 0.5
    acc /= tot
    return (acc - acc.min()) / (acc.max() - acc.min())


def burn_gen(n=24):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    lado = 1 - (xx / W) * 0.75 - (yy / H) * 0.35  # entra por la esquina superior izquierda
    campo = 0.6 * lado + 0.4 * fbm()
    rampa = np.array([[0, 0, 0], [90, 8, 0], [200, 50, 5], [255, 130, 30], [255, 200, 110], [255, 245, 225]], np.float32)
    def gen(i):
        p = i / (n - 1)
        umbral = 1.0 - 1.3 * (p ** 1.5)  # baja: el fuego se come el cuadro y acaba sobreexpuesto
        x = np.clip((campo - umbral) / 0.22, 0, 1)
        x = np.clip(x + 0.5 * blur(x, 18), 0, 1)  # halo: la luz se desborda del frente
        idx = x * (len(rampa) - 1)
        lo = np.floor(idx).astype(int); hi = np.minimum(lo + 1, len(rampa) - 1); t = (idx - lo)[:, :, None]
        return rampa[lo] * (1 - t) + rampa[hi] * t
    return gen


def papel():
    """Papel fotografiado: tono crema irregular (fbm grande), fibras finas orientadas, poro y luz que cae."""
    import cv2
    global W, H
    W0, H0 = W, H
    W, H = 1080, 1920
    tono = fbm(4, 3)
    fibras = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), sigmaX=0.6, sigmaY=5)  # fibras verticales
    fibras2 = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), sigmaX=6, sigmaY=0.6)
    poro = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), 0.8)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    luz = 1 - 0.10 * (((xx - W * 0.35) / W) ** 2 + ((yy - H * 0.3) / H) ** 2) * 2.2
    base = np.array([233, 227, 216], np.float32)  # RGB crema
    v = (1 + 0.035 * (tono - 0.5) + 0.012 * fibras + 0.008 * fibras2 + 0.01 * poro) * luz
    img = base[None, None, :] * v[:, :, None]
    ruta = os.path.join(OUT, 'papel.jpg')
    cv2.imwrite(ruta, cv2.cvtColor(np.clip(img, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 90])
    W, H = W0, H0
    print('papel.jpg', os.path.getsize(ruta) // 1024, 'KB')


TODAS = {
    'papel': papel,
    'grano': lambda: ffmpeg('grano.mp4', 60, grano, crf=18),
    'polvo': lambda: ffmpeg('polvo.mp4', 90, polvo_gen()),
    'leak': lambda: ffmpeg('leak_a.mp4', 150, leak),
    'burn': lambda: ffmpeg('burn_a.mp4', 24, burn_gen()),
}

if __name__ == '__main__':
    for k in (sys.argv[1:] or TODAS):
        TODAS[k]()
