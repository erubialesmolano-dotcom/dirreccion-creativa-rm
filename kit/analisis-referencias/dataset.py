"""Agrega muchas fichas de analizar.py en un dataset CSV (una fila por vídeo).

    python dataset.py <carpeta_de_fichas> <manifiesto.csv> <salida.csv>

Cada subcarpeta de <carpeta_de_fichas> es una ficha (con ficha.json) cuyo nombre es el `id` del
manifiesto (columnas id, ruta, origen, tipo). Columnas del dataset: ritmo (planos, mediana, % de
planos ≤8 f, cortes/s), cámara (zoom %/s, % de planos con zoom, paneo, temblor, curvas), flashes,
cortes en el beat (frente al control aleatorio), sonoridad, texto (presencia y posición), color
(paleta, saturación, contraste, ruido ≈ grano, viñeta).
"""
import csv, json, os, statistics as st, sys
from collections import Counter


def med(xs):
    xs = [x for x in xs if x is not None]
    return round(st.median(xs), 2) if xs else None


def fila(ficha, meta):
    md, pl, co, tx = ficha['metadatos'], ficha['planos'], ficha['color'], ficha['texto']
    au = ficha.get('audio') or {}  # vídeos sin pista de audio
    e = pl['estadisticas']
    lista = pl['lista']
    movs = [p['movimiento'] for p in lista if p.get('movimiento', {}).get('medible')]
    zoom = [abs(m['zoom_pct_s']) for m in movs if m.get('zoom_pct_s') is not None]
    paneo = [m['paneo_pct_ancho_s'] for m in movs if m.get('paneo_pct_ancho_s') is not None]
    clases = Counter(m.get('clase') for m in movs)
    curvas = Counter((m.get('curva') or {}).get('tipo') if isinstance(m.get('curva'), dict) else m.get('curva') for m in movs if m.get('curva'))
    fl = ficha['flashes_tramos']
    cvo = au.get('cortes_vs_onsets') or {}
    zonas = sorted(tx.get('zonas', []), key=lambda z: -z.get('presencia_pct', 0))
    z0 = zonas[0] if zonas else {}
    lo = au.get('loudness') or {}
    n = max(1, len(movs))
    return {
        'id': meta['id'], 'origen': meta['origen'], 'tipo': meta['tipo'],
        'dur_s': md.get('duracion_s'), 'fps': md.get('fps'), 'ancho': md.get('ancho'), 'alto': md.get('alto'),
        'planos': e.get('n'), 'plano_media_s': e.get('media_s'), 'plano_mediana_s': e.get('mediana_s'),
        'pct_planos_8f': e.get('planos_hasta_8f_pct'), 'cortes_por_s': e.get('cortes_por_s'),
        'pct_tiempo_planos_3s': e.get('tiempo_en_planos_3s_pct'),
        'flashes': len(fl.get('eventos', [])), 'tramos_lisos': len(fl.get('tramos', [])),
        'zoom_abs_pct_s_mediana': med(zoom), 'pct_planos_zoom_2': round(100 * sum(z > 2 for z in zoom) / n, 1),
        'paneo_pct_ancho_s_mediana': med(paneo),
        'pct_planos_fijos': round(100 * clases.get('fijo', 0) / n, 1),
        'clases_mov': ';'.join(f'{k}:{v}' for k, v in clases.most_common()),
        'curvas': ';'.join(f'{k}:{v}' for k, v in curvas.most_common()),
        'temblor_px1080_mediana': med([m.get('temblor_rms_px_1080') for m in movs]),
        'pct_cortes_en_onset': cvo.get('pct'), 'control_onset_pct': cvo.get('control_aleatorio_pct'), 'p_onset': cvo.get('p_valor'),
        'bpm': au.get('tempo_bpm'), 'lufs': lo.get('lufs_integrados'), 'lra': lo.get('rango_lra_lu'), 'true_peak': lo.get('true_peak_dbtp'),
        'texto_pct': tx.get('frames_con_texto_pct'), 'texto_y_pct': z0.get('y_centro_pct'), 'texto_zona': z0.get('zona'),
        'texto_f_por_cambio': z0.get('f_por_cambio'),
        'paleta': ' '.join(p['hex'] for p in co.get('paleta_global', [])[:5]),
        'saturacion': co.get('saturacion_media_pct'), 'luminancia': co.get('luminancia_media_pct'),
        'contraste': co.get('contraste_std_luma_pct'), 'ruido_sigma': co.get('ruido_sigma_aprox'),
        'vineta': next((v for k, v in co.items() if k.startswith('vi')), None),
    }


def main(dir_fichas, manifiesto, salida):
    metas = {r['id']: r for r in csv.DictReader(open(manifiesto, encoding='utf-8'))}
    filas = []
    for i in sorted(os.listdir(dir_fichas)):
        p = os.path.join(dir_fichas, i, 'ficha.json')
        if not os.path.exists(p):
            continue
        if i not in metas:  # solo lo que está en el manifiesto (sin duplicados)
            continue
        meta = metas[i]
        try:
            filas.append(fila(json.load(open(p, encoding='utf-8')), meta))
        except Exception as ex:  # una ficha rara no tumba el dataset
            print('omitida', i, ex)
    with open(salida, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(filas[0].keys()))
        w.writeheader(); w.writerows(filas)
    print(len(filas), 'filas ->', salida)


if __name__ == '__main__':
    main(*sys.argv[1:4])
