"""Genera public/lottie/firma_trazo.json: una firma a mano que se dibuja (trim path) y un subrayado que
la sigue, como se haría en After Effects con shape layers + Trim Paths (curva ease-out medida: entradas
de 9 f hasta el 90 %; aquí la firma tarda 26 f y el subrayado 12 f, solapado). Sirve de prueba de
<LottieAsset> y de plantilla para generar Lotties propios sin AE.

    python scripts/generar_lottie.py
"""
import json, os

W, H, FPS, OP = 900, 360, 30, 60


def catmull(pts, tension=0.5):
    """Bezier suave por los puntos (tangentes de Catmull-Rom), en el formato de vértices de Lottie."""
    n = len(pts)
    i_t, o_t = [], []
    for k in range(n):
        p0 = pts[max(0, k - 1)]; p2 = pts[min(n - 1, k + 1)]
        tx, ty = (p2[0] - p0[0]) * tension / 3, (p2[1] - p0[1]) * tension / 3
        i_t.append([-tx, -ty]); o_t.append([tx, ty])
    return {'i': i_t, 'o': o_t, 'v': [list(p) for p in pts], 'c': False}


def grupo(nombre, path, ancho, inicio, fin, color=(0.11, 0.1, 0.09, 1)):
    return {'ty': 'gr', 'nm': nombre, 'it': [
        {'ty': 'sh', 'nm': 'trazado', 'ks': {'a': 0, 'k': path}},
        {'ty': 'st', 'nm': 'trazo', 'c': {'a': 0, 'k': list(color)}, 'o': {'a': 0, 'k': 100}, 'w': {'a': 0, 'k': ancho}, 'lc': 2, 'lj': 2},
        {'ty': 'tm', 'nm': 'trim', 's': {'a': 0, 'k': 0}, 'o': {'a': 0, 'k': 0}, 'm': 1,
         'e': {'a': 1, 'k': [
             {'t': inicio, 's': [0], 'o': {'x': [0.2], 'y': [0.4]}, 'i': {'x': [0.25], 'y': [1]}},  # arranca con velocidad y se posa
             {'t': fin, 's': [100]}]}},
        {'ty': 'tr', 'p': {'a': 0, 'k': [0, 0]}, 'a': {'a': 0, 'k': [0, 0]}, 's': {'a': 0, 'k': [100, 100]}, 'r': {'a': 0, 'k': 0},
         'o': {'a': 0, 'k': 100}, 'sk': {'a': 0, 'k': 0}, 'sa': {'a': 0, 'k': 0}},
    ]}


firma = catmull([(90, 230), (130, 120), (160, 70), (175, 150), (150, 250), (210, 160), (260, 120), (250, 210), (300, 170),
                 (350, 110), (330, 220), (400, 150), (460, 120), (430, 230), (500, 180), (560, 140), (600, 190), (640, 160),
                 (700, 120), (760, 150), (800, 140)])
subrayado = catmull([(110, 290), (330, 282), (560, 278), (780, 268)], 0.6)

capa = {'ddd': 0, 'ind': 1, 'ty': 4, 'nm': 'firma', 'sr': 1, 'ao': 0, 'ip': 0, 'op': OP, 'st': 0, 'bm': 0,
        'ks': {'o': {'a': 0, 'k': 100}, 'r': {'a': 0, 'k': 0}, 'p': {'a': 0, 'k': [0, 0, 0]}, 'a': {'a': 0, 'k': [0, 0, 0]},
               's': {'a': 0, 'k': [100, 100, 100]}},
        'shapes': [grupo('firma', firma, 9, 2, 28), grupo('subrayado', subrayado, 6, 22, 34, (0.43, 0.13, 0.16, 1))]}
lottie = {'v': '5.7.4', 'fr': FPS, 'ip': 0, 'op': OP, 'w': W, 'h': H, 'nm': 'firma_trazo', 'ddd': 0, 'assets': [], 'layers': [capa]}
ruta = os.path.join(os.path.dirname(__file__), '..', 'public', 'lottie', 'firma_trazo.json')
os.makedirs(os.path.dirname(ruta), exist_ok=True)
json.dump(lottie, open(ruta, 'w'))
print(ruta, os.path.getsize(ruta), 'B')
