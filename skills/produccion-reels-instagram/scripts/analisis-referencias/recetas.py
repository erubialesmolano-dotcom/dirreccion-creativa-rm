"""Recetas por EFECTO (no por vídeo) a partir de muchas fichas de analizar.py.

    python recetas.py <carpeta_fichas> <manifiesto.csv> <carpeta_recetas> [--max-ejemplos 40]

Para cada efecto recurrente:
1. junta todas sus instancias de todas las fichas (clase de movimiento del plano o evento de flash);
2. mide cada instancia fotograma a fotograma en el vídeo original (a 360 px):
   - escala relativa por fotograma (semejanza por flujo óptico, como analizar.py) → curva y pico;
   - nitidez (varianza del laplaciano) relativa a la del plano → cuánto desenfoque de movimiento hay
     en el pico (100 % = nítido; 30 % = muy desenfocado);
   - separación de canales R-B (phaseCorrelate) → glitch / aberración cromática;
   - color medio en el pico de un flash (Lab) → flash blanco, light leak cálido o negro;
3. escribe <efecto>.md con mediana y rango intercuartílico, las instancias y una tira de contacto
   de 8 fotogramas (img/<efecto>_<n>.jpg, 8 × 96 px de ancho) de los mejores ejemplos.

Los números son de fotogramas a 30 fps (se remuestrea si la ref va a otra cadencia).
"""
import argparse, csv, json, math, os, statistics as st
import cv2
import numpy as np
from comun import leer_fotogramas, movimiento_entre, probe

LADO = 360


def q(xs, p):
    xs = sorted(x for x in xs if x is not None and not (isinstance(x, float) and math.isnan(x)))
    if not xs:
        return None
    k = (len(xs) - 1) * p
    a, b = math.floor(k), math.ceil(k)
    return round(xs[a] + (xs[b] - xs[a]) * (k - a), 2)


def resumen(xs):
    return f"{q(xs, .5)} (IQR {q(xs, .25)}–{q(xs, .75)}, n={len([x for x in xs if x is not None])})"


EFECTOS = {
    'zoom_rapido_dentro': ('Zoom rápido hacia dentro (punch-in / zoom-through)', lambda c: c.startswith('zoom rápido') and 'fuera' not in c),
    'zoom_rapido_fuera': ('Zoom rápido hacia fuera', lambda c: 'zoom rápido hacia fuera' in c),
    'empuje': ('Empuje lento (push-in)', lambda c: c.startswith('empuje')),
    'alejamiento': ('Alejamiento lento (pull-out)', lambda c: c.startswith('alejamiento')),
    'latigo': ('Paneo látigo (whip)', lambda c: 'látigo' in c),
    'temblor': ('Cámara en mano / temblor añadido', lambda c: 'temblor' in c),
    'rotacion': ('Rotación de cámara', lambda c: 'rotación' in c),
}


def medir(ruta, fps, a, b, pad=2):
    """Mide el tramo [a-pad, b+pad] (fotogramas nativos). Devuelve series por fotograma y la tira."""
    m = probe(ruta)
    W, H = m['ancho'], m['alto']
    k = LADO / max(W, H)
    w, h = int(W * k) // 2 * 2, int(H * k) // 2 * 2
    a0 = max(0, a - pad)
    frames = list(leer_fotogramas(ruta, m['fps_racional'], w, h, desde_s=a0 / fps, dur_s=(b + pad - a0 + 1) / fps))
    if len(frames) < 3:
        return None
    grises = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in frames]
    nit = [float(cv2.Laplacian(g, cv2.CV_32F).var()) for g in grises]
    esc, dxs = [1.0], [0.0]
    for g0, g1 in zip(grises, grises[1:]):
        r = movimiento_entre(g0, g1)
        esc.append(r['s'] if r['ok'] else float('nan'))
        dxs.append(math.hypot(r['dx'], r['dy']) / w * 100 if r['ok'] else float('nan'))
    rgb = []
    for f in frames:
        rr = f[:, :, 2].astype(np.float32); bb = f[:, :, 0].astype(np.float32)
        (sx, sy), _ = cv2.phaseCorrelate(rr, bb)
        rgb.append(math.hypot(sx, sy) / w * 1080)  # px de un vídeo de 1080 de ancho
    lab = [cv2.cvtColor(f, cv2.COLOR_BGR2LAB).reshape(-1, 3).mean(axis=0).tolist() for f in frames]
    idx = np.linspace(0, len(frames) - 1, 8).round().astype(int)
    tira = np.hstack([cv2.resize(frames[i], (96, int(96 * h / w))) for i in idx])
    return {'nitidez': nit, 'escala_f': esc, 'despl_pct_f': dxs, 'rgb_px1080': rgb, 'lab': lab, 'tira': tira, 'a0': a0}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('fichas'); ap.add_argument('manifiesto'); ap.add_argument('salida')
    ap.add_argument('--max-ejemplos', type=int, default=40)
    a = ap.parse_args()
    os.makedirs(os.path.join(a.salida, 'img'), exist_ok=True)
    metas = {r['id']: r for r in csv.DictReader(open(a.manifiesto, encoding='utf-8')) if r['tipo'] == 'ref'}
    fichas = {}
    for i in metas:
        p = os.path.join(a.fichas, i, 'ficha.json')
        if os.path.exists(p):
            fichas[i] = json.load(open(p, encoding='utf-8'))
    print(len(fichas), 'fichas de referencias')

    # ---------------- efectos de cámara (por plano)
    for clave, (titulo, cond) in EFECTOS.items():
        inst = []
        for i, d in fichas.items():
            fps = d['metadatos']['fps']
            for p in d['planos']['lista']:
                mv = p.get('movimiento') or {}
                c = mv.get('clase') or ''
                if mv.get('medible') and cond(c):
                    inst.append((i, fps, p, mv))
        if not inst:
            continue
        # se miden los más marcados (mayor pico de zoom o paneo)
        inst.sort(key=lambda t: -(abs(t[3].get('zoom_pico_pct_f') or 0) + (t[3].get('paneo_pico_px_f') or 0) / 20))
        medidas = []
        for n, (i, fps, p, mv) in enumerate(inst[:a.max_ejemplos]):
            try:
                r = medir(metas[i]['ruta'], fps, p['inicio'], p['fin'])
            except Exception as ex:
                print('  fallo', i, ex); continue
            if not r:
                continue
            nit = np.array(r['nitidez']); base = np.percentile(nit, 90) or 1
            esc = np.array(r['escala_f'])
            pico = int(np.nanargmax(np.abs(np.log(np.where(np.isnan(esc), 1, esc))))) if clave.startswith('zoom') else int(np.nanargmax(np.nan_to_num(r['despl_pct_f'])))
            medidas.append({'id': i, 'fps': fps, 'plano': p, 'mv': mv, 'nit_min_pct': round(100 * float(nit.min() / base), 1),
                            'nit_pico_pct': round(100 * float(nit[pico] / base), 1), 'r': r})
            if n < 3:
                cv2.imwrite(os.path.join(a.salida, 'img', f'{clave}_{n}.jpg'), r['tira'], [cv2.IMWRITE_JPEG_QUALITY, 80])
        escribir_camara(a.salida, clave, titulo, inst, medidas)
        print(clave, len(inst), 'instancias,', len(medidas), 'medidas')

    # ---------------- flashes y light leaks (eventos)
    flashes = []
    for i, d in fichas.items():
        fps = d['metadatos']['fps']
        for e in d['flashes_tramos']['eventos']:
            if e.get('tipo') == 'flash':
                flashes.append((i, fps, e))
    flashes.sort(key=lambda t: -(t[2].get('subida_sobre_entorno') or 0))
    fl = []
    for n, (i, fps, e) in enumerate(flashes[:a.max_ejemplos]):
        try:
            r = medir(metas[i]['ruta'], fps, e['inicio'], e['fin'], pad=3)
        except Exception as ex:
            print('  fallo', i, ex); continue
        if not r:
            continue
        L = [x[0] for x in r['lab']]
        k = int(np.argmax(L))
        Lp, ap_, bp = r['lab'][k]
        tipo = 'blanco' if abs(ap_ - 128) < 6 and abs(bp - 128) < 8 else ('cálido (leak)' if bp > 136 else 'tintado')
        fl.append({'id': i, 'fps': fps, 'e': e, 'tipo': tipo, 'a': round(ap_ - 128, 1), 'b': round(bp - 128, 1), 'L': round(Lp / 2.55, 1), 'r': r})
        if n < 3:
            cv2.imwrite(os.path.join(a.salida, 'img', f'flash_{n}.jpg'), r['tira'], [cv2.IMWRITE_JPEG_QUALITY, 80])
    escribir_flashes(a.salida, flashes, fl)

    # ---------------- deriva: planos largos (≥ 3 s), ¿quietos o con movimiento?
    largos = []
    for i, d in fichas.items():
        fps = d['metadatos']['fps']
        for p in d['planos']['lista']:
            mv = p.get('movimiento') or {}
            if p['dur_f'] / fps >= 3 and mv.get('medible'):
                largos.append((i, fps, p, mv))
    escribir_deriva(a.salida, largos)

    # ---------------- glitch / RGB split: separación de canales en planos cortos
    gl = []
    for i, d in list(fichas.items()):
        fps = d['metadatos']['fps']
        cortos = [p for p in d['planos']['lista'] if p['dur_f'] <= 6]
        for p in cortos[:6]:
            try:
                r = medir(metas[i]['ruta'], fps, p['inicio'], p['fin'], pad=1)
            except Exception:
                continue
            if r and max(r['rgb_px1080']) > 6:
                gl.append({'id': i, 'fps': fps, 'p': p, 'max': round(max(r['rgb_px1080']), 1), 'r': r})
    gl.sort(key=lambda g: -g['max'])
    for n, g in enumerate(gl[:3]):
        cv2.imwrite(os.path.join(a.salida, 'img', f'glitch_{n}.jpg'), g['r']['tira'], [cv2.IMWRITE_JPEG_QUALITY, 80])
    escribir_glitch(a.salida, gl)


def ts(i, fps, f):
    return f"`{i}` f{f} ({f / fps:.2f} s)"


def escribir_camara(dir_, clave, titulo, inst, med):
    dur = [p['dur_f'] * 30 / fps for _, fps, p, _ in inst]
    zt = [mv.get('zoom_total_pct') for *_, mv in inst]
    zp = [mv.get('zoom_pico_pct_f') for *_, mv in inst]
    pp = [mv.get('paneo_pico_px_f') for *_, mv in inst]
    tb = [mv.get('temblor_rms_px_1080') for *_, mv in inst]
    hz = [mv.get('temblor_hz') for *_, mv in inst]
    rot = [mv.get('rotacion_total') for *_, mv in inst]
    curvas = [mv['curva'] for *_, mv in inst if isinstance(mv.get('curva'), dict) and mv['curva'].get('rmse', 1) < 0.08]
    tipos = {}
    for c in curvas:
        tipos[c['tipo']] = tipos.get(c['tipo'], 0) + 1
    infs = [c['influencia_salida'] for c in curvas]; infe = [c['influencia_entrada'] for c in curvas]
    vids = len({i for i, *_ in inst})
    L = [f'# {titulo}', '', f'Medido en {len(inst)} planos de {vids} referencias (fichas de `analizar.py`, fps normalizados a 30).', '',
         '## Números', '',
         f'- Duración del plano: {resumen(dur)} f',
         f'- Zoom total del plano: {resumen(zt)} %; pico por fotograma: {resumen(zp)} %/f',
         f'- Paneo pico: {resumen(pp)} px/f (en px del ancho de análisis de 640)',
         f'- Rotación total: {resumen(rot)}°',
         f'- Temblor: {resumen(tb)} px RMS (escala 1080), {resumen(hz)} Hz',
         f'- Curva ajustada (solo ajustes con RMSE < 0,08, n={len(curvas)}): ' + ', '.join(f'{k}: {v}' for k, v in sorted(tipos.items(), key=lambda x: -x[1])),
         f'- Influencias AE (salida / entrada): {resumen(infs)} / {resumen(infe)}', '']
    if med:
        L += ['## Desenfoque de movimiento (medido en el vídeo)', '',
              f'Nitidez en el fotograma de más velocidad, en % de la nitidez normal del plano (100 = nítido): {resumen([m["nit_pico_pct"] for m in med])}. '
              f'Mínimo del plano: {resumen([m["nit_min_pct"] for m in med])}.',
              'Lectura: por debajo de ~60 % hay desenfoque de movimiento visible; por debajo de ~30 %, el fotograma es casi una estela.', '',
              '## Ejemplos medidos (los más marcados)', '', '| ref | plano | dur f@30 | zoom total % | pico %/f | nitidez pico % | curva |', '|---|---|---|---|---|---|---|']
        for m in med[:15]:
            mv, p = m['mv'], m['plano']
            c = mv.get('curva') if isinstance(mv.get('curva'), dict) else {}
            L.append(f"| `{m['id']}` | f{p['inicio']}–{p['fin']} | {round(p['dur_f'] * 30 / m['fps'])} | {mv.get('zoom_total_pct')} | {mv.get('zoom_pico_pct_f')} | {m['nit_pico_pct']} | {c.get('tipo', '—')} {c.get('bezier', '')} |")
        L += ['', '## Contacto', ''] + [f'![{clave} {n}](img/{clave}_{n}.jpg)' for n in range(min(3, len(med)))]
    open(os.path.join(dir_, f'{clave}.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')


def escribir_flashes(dir_, todos, fl):
    dur = [e['dur_f'] * 30 / fps for _, fps, e in todos]
    tipos = {}
    for f in fl:
        tipos[f['tipo']] = tipos.get(f['tipo'], 0) + 1
    L = ['# Flashes y light leaks', '', f'{len(todos)} flashes en {len({i for i, *_ in todos})} referencias.', '',
         f'- Duración: {resumen(dur)} f a 30 fps',
         f'- Luma del pico: {resumen([e.get("luma_pico") for *_, e in todos])} (0-255); subida sobre el entorno: {resumen([e.get("subida_sobre_entorno") for *_, e in todos])}',
         f'- Blanco puro: {sum(1 for *_, e in todos if e.get("blanco_puro"))} de {len(todos)}',
         f'- Color del pico en los {len(fl)} más fuertes: ' + ', '.join(f'{k}: {v}' for k, v in tipos.items()),
         f'- Tinte Lab en el pico (a*, b*; b* > 8 = cálido): a* {resumen([f["a"] for f in fl])}, b* {resumen([f["b"] for f in fl])}', '',
         '| ref | f | dur | tipo | L | a* | b* |', '|---|---|---|---|---|---|---|']
    for f in fl[:20]:
        e = f['e']
        L.append(f"| `{f['id']}` | {e['inicio']}–{e['fin']} | {e['dur_f']} | {f['tipo']} | {f['L']} | {f['a']} | {f['b']} |")
    L += ['', '## Contacto', ''] + [f'![flash {n}](img/flash_{n}.jpg)' for n in range(min(3, len(fl)))]
    open(os.path.join(dir_, 'flash_y_leak.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')


def escribir_deriva(dir_, largos):
    fijos = [x for x in largos if (x[3].get('clase') or '') == 'fijo']
    mov = [x for x in largos if (x[3].get('clase') or '') != 'fijo']
    zs = [abs(mv.get('zoom_pct_s') or 0) for *_, mv in mov]
    ps = [mv.get('paneo_pct_ancho_s') for *_, mv in mov]
    rs = [mv.get('rotacion_grados_s') for *_, mv in mov]
    tf = [mv.get('temblor_rms_px_1080') for *_, mv in fijos]
    L = ['# Cámara que deriva (planos largos)', '',
         f'{len(largos)} planos de 3 s o más en las referencias: {len(fijos)} fijos ({round(100 * len(fijos) / max(1, len(largos)))} %) y {len(mov)} con movimiento.', '',
         f'- En los que se mueven: zoom {resumen(zs)} %/s, paneo {resumen(ps)} % del ancho/s, rotación {resumen(rs)} °/s.',
         f'- Incluso los "fijos" tienen temblor residual de {resumen(tf)} px RMS (a 1080): la imagen real nunca está clavada.',
         '', 'Regla de kit: `deriva()` por defecto = zoom ~1-1,5 %/s equivalente, 14 px de deriva y 0,35°; ajustar a la mediana de arriba.']
    open(os.path.join(dir_, 'deriva.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')


def escribir_glitch(dir_, gl):
    L = ['# Glitch y separación RGB', '', f'Planos cortos (≤6 f) con separación R-B > 6 px (a 1080): {len(gl)} en {len({g["id"] for g in gl})} referencias.', '',
         f'- Separación máxima: {resumen([g["max"] for g in gl])} px', '', '| ref | plano | dur f | sep. máx px |', '|---|---|---|---|']
    for g in gl[:15]:
        L.append(f"| `{g['id']}` | f{g['p']['inicio']}–{g['p']['fin']} | {g['p']['dur_f']} | {g['max']} |")
    L += ['', '## Contacto', ''] + [f'![glitch {n}](img/glitch_{n}.jpg)' for n in range(min(3, len(gl)))]
    open(os.path.join(dir_, 'glitch_rgb.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')


if __name__ == '__main__':
    main()
