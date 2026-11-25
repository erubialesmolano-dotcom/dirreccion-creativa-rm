"""Medidas que analizar.py no saca solo: rampas de velocidad y entradas de texto/gráficos.

    python medidas_manuales.py <fichas> <manifiesto> <salida_dir> [--max-planos 400]

Método (OpenCV, documentado en investigacion/medidas/recetas/*.md):

1. RAMPAS DE VELOCIDAD (speed ramp). Dentro de un mismo plano (sin corte) se mide fotograma a fotograma
   la velocidad aparente: desplazamiento del centro + cambio de escala × media diagonal (px/f a 1080 de
   alto), con la misma semejanza de movimiento_entre que el resto del kit. Hay rampa si la velocidad
   suavizada (mediana de 3) cambia ≥ 3× dentro del plano y se mantiene ≥ 3 f a cada lado. Se guarda el
   perfil normalizado, la relación rápido/lento y cuántos fotogramas tarda el cambio (10 % → 90 %).

2. ENTRADAS DE ELEMENTOS (texto, cajas, flechas, recortes). En planos sin movimiento de cámara apreciable
   se buscan zonas pequeñas (< 35 % del cuadro) donde aparece algo nuevo: diferencia absoluta contra el
   fotograma anterior compensado. Para cada aparición se sigue el área de la máscara de bordes (Canny) en
   esa caja durante 20 f: el tiempo hasta el 90 % del área final es la duración de la entrada, y si el
   área pasa del final antes de asentarse, eso es overshoot (pop). La forma de la curva (área/área final)
   se ajusta igual que las demás (influencias de bezier).
"""
import argparse, csv, json, os, sys
import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import leer_fotogramas, movimiento_entre, probe, tam_analisis  # noqa: E402


def fotogramas(ruta, ini, n, lado=480):
    m = probe(ruta)
    W, H, fps = m['ancho'], m['alto'], m['fps']
    aw, ah, esc = tam_analisis(W, H, lado)
    out = []
    for fr in leer_fotogramas(ruta, m['fps_racional'], W, H, desde_s=ini / fps, dur_s=(n + 0.5) / fps):
        out.append(cv2.resize(cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY), (aw, ah), interpolation=cv2.INTER_AREA))
        if len(out) >= n:
            break
    return out, esc, H


def velocidades(g, esc, H):
    diag = np.hypot(*g[0].shape) / 2
    v = []
    for a, b in zip(g, g[1:]):
        r = movimiento_entre(a, b)
        if not r['ok']:
            v.append(np.nan)
            continue
        M = r['M']
        s = np.hypot(M[0, 0], M[1, 0])
        c = np.array([g[0].shape[1] / 2, g[0].shape[0] / 2])
        d = M[:, :2] @ c + M[:, 2] - c
        v.append((np.hypot(*d) + abs(s - 1) * diag) / esc * 1080 / H)
    return np.array(v)


def rampa(v):
    if len(v) < 9 or np.isnan(v).mean() > 0.2:
        return None
    v = np.nan_to_num(v, nan=np.nanmedian(v))
    vs = np.array([np.median(v[max(0, i - 1):i + 2]) for i in range(len(v))])
    alto, bajo = np.percentile(vs, 90), np.percentile(vs, 10)
    if bajo < 0.5:
        bajo = 0.5
    if alto / bajo < 3 or alto < 4:
        return None
    rapido = vs > bajo + 0.5 * (alto - bajo)
    cambios = np.flatnonzero(np.diff(rapido.astype(int)))
    if not len(cambios):
        return None
    i = int(cambios[0])
    if i < 3 or len(vs) - i < 4:
        return None
    # los dos lados tienen que ser tramos estables de verdad (no un pico suelto)
    m0, m1 = np.median(vs[:i]), np.median(vs[i + 1:])
    if max(m0, m1) / max(0.5, min(m0, m1)) < 3:
        return None
    # duración del cambio 10 % → 90 % alrededor de i
    lo, hi = bajo + 0.1 * (alto - bajo), bajo + 0.9 * (alto - bajo)
    a = i
    while a > 0 and lo < vs[a] < hi:
        a -= 1
    b = i + 1
    while b < len(vs) - 1 and lo < vs[b] < hi:
        b += 1
    return {'relacion': round(float(alto / bajo), 1), 'v_rapida_px_f': round(float(alto), 1), 'v_lenta_px_f': round(float(bajo), 1),
            'sentido': 'rapido→lento' if rapido[0] else 'lento→rapido', 'transicion_f': int(b - a),
            'perfil': [round(float(x / alto), 2) for x in vs]}


def entradas(g, max_n=3):
    """Apariciones locales con cámara quieta: devuelve curvas de área de bordes normalizadas."""
    res = []
    bordes = [cv2.Canny(x, 60, 160) > 0 for x in g]
    A = g[0].shape[0] * g[0].shape[1]
    i = 1
    while i < len(g) - 21 and len(res) < max_n:
        d = cv2.absdiff(g[i], g[i - 1])
        m = (d > 25).astype(np.uint8)
        frac_ = m.mean()
        if 0.005 < frac_ < 0.35:
            x, y, w, h = cv2.boundingRect(cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)))
            if w * h < 0.35 * A and w > 8 and h > 8:
                area = np.array([bordes[j][y:y + h, x:x + w].sum() for j in range(i - 1, i + 20)], float)
                area -= area[0]
                fin = np.median(area[-5:])
                if fin > 50:
                    c = area / fin
                    # un gráfico que entra crece y se asienta: sin negativos ni más de un bajón
                    bajones = int((np.diff(c) < -0.2).sum())
                    if c.min() < -0.15 or bajones > 1 or c.max() > 1.6:
                        i += 1
                        continue
                    t90 = int(np.argmax(c >= 0.9))
                    res.append({'caja_pct': round(100 * w * h / A, 1), 'entrada_f': t90, 'overshoot_pct': round(100 * (c.max() - 1), 1),
                                'curva': [round(float(x), 2) for x in c]})
                    i += 20
                    continue
        i += 1
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('fichas'); ap.add_argument('manifiesto'); ap.add_argument('salida')
    ap.add_argument('--max-planos', type=int, default=400)
    a = ap.parse_args()
    rut = {r['id']: r['ruta'] for r in csv.DictReader(open(a.manifiesto, encoding='utf-8')) if r.get('tipo', 'ref') == 'ref'}
    cand_r, cand_e = [], []
    for i, ruta in rut.items():
        p = os.path.join(a.fichas, i, 'ficha.json')
        if not os.path.exists(p) or not os.path.exists(ruta):
            continue
        d = json.load(open(p, encoding='utf-8'))
        fps = d['metadatos']['fps']
        for pl in d['planos']['lista']:
            mv = pl.get('movimiento') or {}
            if pl['dur_f'] >= 16 and mv.get('medible') and ((mv.get('paneo_pico_px_f') or 0) > 15 or abs(mv.get('zoom_pico_pct_f') or 0) > 1.5):
                cand_r.append((i, ruta, fps, pl))
            elif pl['dur_f'] >= 30 and mv.get('medible') and (mv.get('paneo_px_s') or 0) < 40 and abs(mv.get('zoom_pct_s') or 0) < 3:
                cand_e.append((i, ruta, fps, pl))
    rng = np.random.default_rng(1)
    for lst in (cand_r, cand_e):
        rng.shuffle(lst)
    out_r, out_e = [], []
    for i, ruta, fps, pl in cand_r[:a.max_planos // 2]:
        g, esc, H = fotogramas(ruta, pl['inicio'], min(pl['dur_f'], 90))
        r = rampa(velocidades(g, esc, H))
        if r:
            out_r.append({'id': i, 'inicio': pl['inicio'], 'fps': fps, **r})
    for i, ruta, fps, pl in cand_e[:a.max_planos // 2]:
        g, _, _ = fotogramas(ruta, pl['inicio'], min(pl['dur_f'], 120))
        for e in entradas(g):
            out_e.append({'id': i, 'inicio': pl['inicio'], 'fps': fps, **e})
    os.makedirs(a.salida, exist_ok=True)
    json.dump({'rampas': out_r, 'entradas': out_e, 'candidatos': {'rampa': len(cand_r), 'entrada': len(cand_e)}},
              open(os.path.join(a.salida, 'medidas_manuales.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(len(cand_r), 'candidatos a rampa ->', len(out_r), 'rampas;', len(cand_e), 'planos quietos ->', len(out_e), 'entradas')


if __name__ == '__main__':
    main()
