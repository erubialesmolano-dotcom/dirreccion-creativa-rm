"""Calca el movimiento de cámara de un tramo de referencia con keyframes de AE (src/v2/curvas.ts).

    python calcar_camara.py REF.mp4 --desde 1674 --hasta 1723 --out calcos/zoom_lou [--keys 2]

1. Mide la semejanza acumulada fotograma a fotograma (escala, rotación, traslación del centro).
2. Ajusta, por propiedad, 2-3 keyframes estilo AE {f, v, infOut, infIn, velOut, velIn} con el mismo
   modelo de bezier que keys() en TypeScript (mínimos cuadrados).
3. Escribe props.json para la composición CalcoCamara del kit (primer fotograma de la ref + keys)
   y primer_fotograma.png.
Luego: npx remotion render src/index.ts CalcoCamara out.mp4 --props=props.json  y  calco.py ref out.mp4.
"""
import argparse, json, math, os, sys
import cv2
import numpy as np
from scipy.optimize import least_squares

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import leer_fotogramas, movimiento_entre, probe, puntos, tam_analisis  # noqa: E402
from calco import a3, escala_M  # noqa: E402


# ---- réplica numérica de Easing.bezier de Remotion (x1,y1,x2,y2) ----
def bezier(x1, y1, x2, y2):
    u = np.linspace(0, 1, 2001)
    bx = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3
    by = 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3
    return lambda t: np.interp(t, bx, by)


def keys_np(f, ks):
    f = np.asarray(f, float)
    out = np.full_like(f, ks[0]['v'])
    for a, b in zip(ks, ks[1:]):
        io, ii = a.get('infOut', .33), b.get('infIn', .33)
        e = bezier(io, io * a.get('velOut', 0), 1 - ii, 1 - ii * b.get('velIn', 0))
        m = (f > a['f']) & (f <= b['f'])
        t = (f[m] - a['f']) / max(1e-9, b['f'] - a['f'])
        out[m] = a['v'] + (b['v'] - a['v']) * e(t)
    out[f > ks[-1]['f']] = ks[-1]['v']
    return out


def tramos_de_movimiento(series, umbrales, hueco=2):
    """Fotogramas [a, b] en los que algo se mueve (une huecos de <= `hueco` f)."""
    mov = np.zeros(len(series[0]) - 1, bool)
    for s, u in zip(series, umbrales):
        mov |= np.abs(np.diff(s)) > u
    runs, i = [], 0
    while i < len(mov):
        if mov[i]:
            j = i
            while j + 1 < len(mov) and (mov[j + 1] or mov[j + 1:j + 1 + hueco].any()):
                j += 1
            runs.append((i, j + 1))
            i = j + 1
        else:
            i += 1
    # huecos entre movimientos rápidos (y antes/después) que sí cambian despacio = deriva: también se ajustan
    n = len(series[0])
    bordes = [0] + [x for r in runs for x in r] + [n - 1]
    lentos = []
    for a, b in zip(bordes[::2], bordes[1::2]):
        if b - a >= 3 and any(abs(s[b] - s[a]) > u * 2 for s, u in zip(series, umbrales)):
            lentos.append((a, b))
    return sorted(runs + lentos)


def ajustar_por_tramos(serie, runs, umbral):
    """Keyframes AE por tramo de movimiento (2, o 3 si con 2 queda error); entre tramos se mantiene."""
    ks, err = [], []
    for a, b in runs:
        sub = serie[a:b + 1]
        if np.ptp(sub) < umbral:
            continue
        k2, e = ajustar(sub, 2)
        if e > umbral / 2 and len(sub) >= 5:
            k3, e3 = ajustar(sub, 3)
            if e3 < e * 0.8:
                k2, e = k3, e3
        for k in k2:
            k['f'] = round(k['f'] + a, 4)
        if ks and k2[0]['f'] <= ks[-1]['f']:
            k2[0]['f'] = ks[-1]['f'] + 0.01
        if not all(x['f'] < y['f'] for x, y in zip(k2, k2[1:])):
            continue
        ks += k2
        err.append(e)
    if not ks:
        return [{'f': 0, 'v': round(float(serie[0]), 4)}], 0.0
    return ks, float(np.sqrt(np.mean(np.square(err))))


def ajustar(serie, nkeys=2):
    """Ajusta keyframes a una serie (valor por fotograma, f = 0..n-1)."""
    n = len(serie)
    fr = np.arange(n)
    v0, v1 = float(serie[0]), float(serie[-1])
    if nkeys == 2:
        def build(p):
            f0, f1, io, ii, vo, vi = p
            return [{'f': f0, 'v': v0, 'infOut': io, 'velOut': vo}, {'f': f1, 'v': v1, 'infIn': ii, 'velIn': vi}]
        x0 = [0, n - 1, .4, .4, 0, 0]
        lo = [-1, 1, .01, .01, 0, 0]; hi = [n - 2, n, .99, .99, 3, 3]
    else:
        vm = float(serie[n // 2])
        def build(p):
            f0, fm, f1, vmid, io, ii1, io1, ii, vmv = p
            return [{'f': f0, 'v': v0, 'infOut': io}, {'f': fm, 'v': vmid, 'infIn': ii1, 'infOut': io1, 'velIn': vmv, 'velOut': vmv},
                    {'f': f1, 'v': v1, 'infIn': ii}]
        x0 = [0, n / 2, n - 1, vm, .4, .3, .3, .4, 1]
        lo = [-1, 1, 2, min(v0, v1) - abs(v1 - v0), .01, .01, .01, .01, 0]; hi = [n - 3, n - 2, n, max(v0, v1) + abs(v1 - v0) + 1e-6, .99, .99, .99, .99, 3]
    def res(p):
        ks = build(p)
        if not all(ks[i]['f'] < ks[i + 1]['f'] for i in range(len(ks) - 1)):
            return np.full(n, 1e3)
        return keys_np(fr, ks) - serie
    r = least_squares(res, x0, bounds=(lo, hi), diff_step=1e-3)
    ks = build(r.x)
    for k in ks:
        for c in list(k):
            k[c] = round(float(k[c]), 4)
    return ks, float(np.sqrt(np.mean(r.fun ** 2)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('ref'); ap.add_argument('--desde', type=int, required=True); ap.add_argument('--hasta', type=int, required=True)
    ap.add_argument('--out', required=True); ap.add_argument('--keys', type=int, default=0, help='0 = un par de keys por tramo de movimiento')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    m = probe(a.ref)
    W, H, fps = m['ancho'], m['alto'], m['fps']
    frames = list(leer_fotogramas(a.ref, m['fps_racional'], W, H, desde_s=a.desde / fps, dur_s=(a.hasta - a.desde + 1) / fps))
    cv2.imwrite(os.path.join(a.out, 'primer_fotograma.png'), frames[0])
    # trayectoria con el MISMO método que calco.py (ancla en el primer fotograma, re-ancla si se pierde),
    # para que el ajuste persiga lo mismo que mide el validador
    aw, ah, esc = tam_analisis(W, H, 960)
    g = [cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (aw, ah), interpolation=cv2.INTER_AREA) for f in frames]
    Ms = [np.eye(3)]
    ancla, T0 = (g[0], puntos(g[0])), np.eye(3)
    for i in range(1, len(g)):
        mm = movimiento_entre(ancla[0], g[i], ancla[1])
        if mm['ok'] and mm['inliers'] > 0.3:
            T = a3(escala_M(mm['M'], esc)) @ T0
        else:
            mm = movimiento_entre(g[i - 1], g[i], puntos(g[i - 1]))
            T = a3(escala_M(mm['M'], esc)) @ Ms[-1] if mm['ok'] else Ms[-1]
            ancla, T0 = (g[i - 1], puntos(g[i - 1])), Ms[-1]
        Ms.append(T)
    c = np.array([W / 2, H / 2, 1])
    s = np.array([math.hypot(M[0, 0], M[1, 0]) for M in Ms])
    tx = np.array([(M @ c)[0] - c[0] for M in Ms])
    ty = np.array([(M @ c)[1] - c[1] for M in Ms])
    props = {'img': 'primer_fotograma.png', 'w': W, 'h': H, 'dur': len(frames), 'fps': fps}
    informe = {}
    runs = tramos_de_movimiento([s, tx, ty], [0.002, 1.0, 1.0])
    informe['tramos'] = runs
    for nombre, serie in [('escala', s), ('x', tx), ('y', ty)]:
        if np.ptp(serie) < (0.004 if nombre == 'escala' else 1.5):
            props[nombre] = [{'f': 0, 'v': round(float(serie.mean()), 4)}]
            informe[nombre] = 'constante'
            continue
        ks, e = ajustar_por_tramos(serie, runs, 0.002 if nombre == 'escala' else 1.0) if a.keys == 0 else ajustar(serie, a.keys)
        props[nombre] = ks
        informe[nombre] = {'rmse': round(e, 4), 'rango': round(float(np.ptp(serie)), 3)}
    json.dump(props, open(os.path.join(a.out, 'props.json'), 'w'), indent=1)
    json.dump({'medida': {'escala': s.round(4).tolist(), 'x': tx.round(2).tolist(), 'y': ty.round(2).tolist()}, 'ajuste': informe},
              open(os.path.join(a.out, 'medida.json'), 'w'))
    print(json.dumps(informe))


if __name__ == '__main__':
    main()
