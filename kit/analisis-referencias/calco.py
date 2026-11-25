#!/usr/bin/env python3
"""Compara un tramo de la referencia con nuestra versión fotograma a fotograma para validar un calco.

Uso:
    python calco.py REFERENCIA.mp4 NUESTRO.mp4 --desde 120 --hasta 180 [--offset 0 | --alinear corte]
                    [--modo auto|directo|trayectoria] [--umbral 4] [--out carpeta]

--desde/--hasta son fotogramas de la REFERENCIA (incluidos). El fotograma de NUESTRO que se compara
con el i de la referencia es i + offset. El offset sale de --offset o, con --alinear corte (por defecto),
de alinear el primer corte de cada vídeo a partir de --desde (si no hay corte en ambos, offset 0).

Modos:
  directo      registra cada fotograma nuestro sobre el de la referencia (misma imagen de partida).
               Error = desplazamiento medio de las 4 esquinas y el centro, en px de la referencia.
  trayectoria  compara solo el movimiento de cámara (cada vídeo respecto a su primer fotograma del
               tramo); sirve cuando la imagen es distinta. No ve un desfase constante de encuadre.
  auto         directo si el registro funciona en ≥70 % de los fotogramas; si no, trayectoria.

Salida: calco.json, calco.csv, calco.md y onion_XXXX.png (superposición) por fotograma clave,
más onion_resumen.png.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import os
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import (detectar_cortes, dist_hist, es_num, histograma_hsv, leer_fotogramas,  # noqa: E402,F401
                   movimiento_entre, probe, puntos, tam_analisis)


def cortes_rapidos(ruta: str, meta: dict) -> list[int]:
    """Cortes con el detector del analizador, sin flujo óptico (solo para alinear)."""
    aw, ah, _ = tam_analisis(meta["ancho"], meta["alto"], 320)
    hist, tiny = [], []
    for fr in leer_fotogramas(ruta, meta["fps_racional"], aw, ah):
        hist.append(histograma_hsv(cv2.resize(fr, (64, max(2, int(64 * ah / aw))), interpolation=cv2.INTER_AREA)))
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        tiny.append(cv2.GaussianBlur(cv2.resize(g, (32, max(2, int(32 * ah / aw))), interpolation=cv2.INTER_AREA), (3, 3), 0))
    n = len(hist)
    return detectar_cortes(np.zeros(n, bool), hist, tiny, np.zeros(n, bool))


def a3(M: np.ndarray) -> np.ndarray:
    return np.vstack([M, [0, 0, 1]])


def descomponer(M: np.ndarray, w: int, h: int) -> dict:
    s = math.hypot(M[0, 0], M[1, 0])
    rot = math.degrees(math.atan2(M[1, 0], M[0, 0]))
    c = np.array([w / 2, h / 2])
    c2 = M[:, :2] @ c + M[:, 2]
    return {"dx": float(c2[0] - c[0]), "dy": float(c2[1] - c[1]), "escala_pct": (s - 1) * 100, "rot": rot}


def error_px(M: np.ndarray, w: int, h: int) -> float:
    pts = np.array([[0, 0], [w, 0], [0, h], [w, h], [w / 2, h / 2]], float)
    q = pts @ M[:, :2].T + M[:, 2]
    return float(np.linalg.norm(q - pts, axis=1).mean())


def escala_M(M: np.ndarray, esc: float) -> np.ndarray:
    """Pasa una semejanza medida a resolución reducida (factor esc) a resolución completa."""
    out = M.copy()
    out[:, 2] = M[:, 2] / esc
    return out


def onion(ref: np.ndarray, nue: np.ndarray, texto: str, ancho: int = 540) -> np.ndarray:
    h, w = ref.shape[:2]
    e = ancho / w
    r = cv2.resize(ref, (ancho, int(h * e)), interpolation=cv2.INTER_AREA)
    n = cv2.resize(nue, (ancho, int(h * e)), interpolation=cv2.INTER_AREA)
    mezcla = cv2.addWeighted(r, 0.5, n, 0.5, 0)
    gr, gn = cv2.cvtColor(r, cv2.COLOR_BGR2GRAY), cv2.cvtColor(n, cv2.COLOR_BGR2GRAY)
    ana = cv2.merge([gr, gn, gr])  # referencia en magenta, nuestro en verde; gris donde coinciden
    lienzo = np.hstack([mezcla, np.full((mezcla.shape[0], 8, 3), 25, np.uint8), ana])
    cv2.rectangle(lienzo, (0, 0), (lienzo.shape[1], 34), (25, 25, 25), -1)
    cv2.putText(lienzo, texto, (8, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (239, 239, 239), 1, cv2.LINE_AA)
    return lienzo


def main(argv=None):
    ap = argparse.ArgumentParser(description="Valida un calco contra la referencia (error en px).")
    ap.add_argument("referencia")
    ap.add_argument("nuestro")
    ap.add_argument("--desde", type=int, required=True, help="fotograma inicial de la referencia")
    ap.add_argument("--hasta", type=int, required=True, help="fotograma final de la referencia (incluido)")
    ap.add_argument("--offset", type=int, help="fotograma_nuestro = fotograma_ref + offset")
    ap.add_argument("--alinear", choices=["corte", "ninguno"], default="corte")
    ap.add_argument("--modo", choices=["auto", "directo", "trayectoria"], default="auto")
    ap.add_argument("--umbral", type=float, default=4.0, help="error máximo aceptable en px (4)")
    ap.add_argument("--lado-registro", type=int, default=960, help="lado mayor para registrar (960)")
    ap.add_argument("--claves", type=int, default=6, help="nº de fotogramas clave con onion skin (6)")
    ap.add_argument("--out", help="carpeta de salida (por defecto calco_<ref>_<desde>-<hasta>)")
    a = ap.parse_args(argv)

    mr, mn = probe(a.referencia), probe(a.nuestro)
    W, H = mr["ancho"], mr["alto"]
    out = a.out or f"calco_{os.path.splitext(os.path.basename(a.referencia))[0]}_{a.desde}-{a.hasta}"
    os.makedirs(out, exist_ok=True)
    avisos = []
    if abs(mr["fps"] - mn["fps"]) > 0.01:
        avisos.append(f"fps distintos ({mr['fps']} y {mn['fps']}): nuestro vídeo se remuestrea a {mr['fps']} fps.")
    if abs(mr["ancho"] / mr["alto"] - mn["ancho"] / mn["alto"]) > 0.01:
        avisos.append("Relación de aspecto distinta: nuestro vídeo se estira a la resolución de la referencia.")
    if (mn["ancho"], mn["alto"]) != (W, H):
        avisos.append(f"Resolución distinta: nuestro {mn['ancho']}×{mn['alto']} se escala a {W}×{H}.")

    # alineación
    if a.offset is not None:
        offset, como = a.offset, "offset dado"
    elif a.alinear == "corte":
        cr = [c for c in cortes_rapidos(a.referencia, mr) if c >= a.desde]
        mn_ = dict(mn, fps_racional=mr["fps_racional"])
        cn = cortes_rapidos(a.nuestro, mn_)
        if cr and cn:
            c0 = cr[0]
            cn0 = min(cn, key=lambda c: abs(c - c0))
            offset, como = cn0 - c0, f"primer corte (ref f{c0} ↔ nuestro f{cn0})"
        else:
            offset, como = 0, "sin cortes en ambos vídeos: offset 0"
    else:
        offset, como = 0, "sin alinear"
    print(f"Alineación: {como}; offset {offset:+d} f")

    fps = mr["fps"]
    n = a.hasta - a.desde + 1
    d_ref = a.desde / fps
    d_nue = (a.desde + offset) / fps
    if d_nue < 0:
        raise SystemExit("El offset deja el tramo de NUESTRO antes del inicio del vídeo.")
    gen_r = leer_fotogramas(a.referencia, mr["fps_racional"], W, H, desde_s=d_ref, dur_s=(n + 0.5) / fps)
    gen_n = leer_fotogramas(a.nuestro, mr["fps_racional"], W, H, desde_s=d_nue, dur_s=(n + 0.5) / fps)
    aw, ah, esc = tam_analisis(W, H, a.lado_registro)

    filas, claves_img = [], {}
    paso_clave = max(1, (n - 1) // max(1, a.claves - 1))
    ancla_r = ancla_n = None   # para trayectoria
    T_r = T_n = np.eye(3)
    prev_r = prev_n = None
    for i, (fr, fn) in enumerate(zip(gen_r, gen_n)):
        if i >= n:
            break
        gr = cv2.resize(cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY), (aw, ah), interpolation=cv2.INTER_AREA)
        gn = cv2.resize(cv2.cvtColor(fn, cv2.COLOR_BGR2GRAY), (aw, ah), interpolation=cv2.INTER_AREA)
        fila = {"i": i, "f_ref": a.desde + i, "f_nuestro": a.desde + i + offset}
        # directo
        m = movimiento_entre(gr, gn)
        if m["ok"] and m["inliers"] > 0.3:
            M = escala_M(m["M"], esc)
            d = descomponer(M, W, H)
            fila.update(directo_ok=True, directo_err_px=error_px(M, W, H), directo_dx=d["dx"], directo_dy=d["dy"],
                        directo_escala_pct=d["escala_pct"], directo_rot=d["rot"])
        else:
            fila.update(directo_ok=False)
        # trayectoria: transformaciones acumuladas desde el primer fotograma del tramo
        if i == 0:
            ancla_r, ancla_n = (gr, puntos(gr)), (gn, puntos(gn))
            T_r0 = T_n0 = np.eye(3)
            fila.update(tray_ok=True, tray_err_px=0.0, tray_dx=0.0, tray_dy=0.0, tray_escala_pct=0.0, tray_rot=0.0)
        else:
            ok_tray = True
            for lado in ("r", "n"):
                g = gr if lado == "r" else gn
                anc = ancla_r if lado == "r" else ancla_n
                T0 = T_r0 if lado == "r" else T_n0
                mm = movimiento_entre(anc[0], g, anc[1])
                if not (mm["ok"] and mm["inliers"] > 0.3):
                    # re-anclar en el fotograma anterior
                    pg = prev_r if lado == "r" else prev_n
                    Tp = T_r if lado == "r" else T_n
                    mm = movimiento_entre(pg, g, puntos(pg))
                    if not mm["ok"]:
                        ok_tray = False
                        T = Tp
                    else:
                        T = a3(escala_M(mm["M"], esc)) @ Tp
                    if lado == "r":
                        ancla_r, T_r0 = (pg, puntos(pg)), Tp
                    else:
                        ancla_n, T_n0 = (pg, puntos(pg)), Tp
                else:
                    T = a3(escala_M(mm["M"], esc)) @ T0
                if lado == "r":
                    T_r = T
                else:
                    T_n = T
            E = (T_n @ np.linalg.inv(T_r))[:2]
            d = descomponer(E, W, H)
            fila.update(tray_ok=ok_tray, tray_err_px=error_px(E, W, H), tray_dx=d["dx"], tray_dy=d["dy"],
                        tray_escala_pct=d["escala_pct"], tray_rot=d["rot"])
        prev_r, prev_n = gr, gn
        filas.append(fila)
        if i % paso_clave == 0 or i == n - 1:
            claves_img[i] = (fr.copy(), fn.copy())
    if not filas:
        raise SystemExit("No se pudo leer ningún fotograma del tramo.")

    ok_dir = np.mean([f["directo_ok"] for f in filas])
    modo = a.modo if a.modo != "auto" else ("directo" if ok_dir >= 0.7 else "trayectoria")
    pre = "directo_" if modo == "directo" else "tray_"
    validas = [f for f in filas if f.get(pre + "ok")]
    err = np.array([f[pre + "err_px"] for f in validas]) if validas else np.array([np.nan])
    pos = np.array([math.hypot(f[pre + "dx"], f[pre + "dy"]) for f in validas]) if validas else np.array([np.nan])
    escp = np.array([abs(f[pre + "escala_pct"]) for f in validas]) if validas else np.array([np.nan])
    rot = np.array([abs(f[pre + "rot"]) for f in validas]) if validas else np.array([np.nan])
    p95 = float(np.percentile(err, 95))
    aprobado = bool(validas) and p95 <= a.umbral
    peor = max(validas, key=lambda f: f[pre + "err_px"]) if validas else None
    if peor is not None:
        claves_img.setdefault(peor["i"], None)

    resumen = {
        "referencia": os.path.basename(a.referencia), "nuestro": os.path.basename(a.nuestro),
        "tramo_ref": [a.desde, a.hasta], "offset_f": offset, "alineacion": como, "modo": modo,
        "fotogramas": len(filas), "fotogramas_medidos": len(validas),
        "registro_directo_ok_pct": round(100 * ok_dir, 1),
        "error_medio_px": round(float(err.mean()), 2), "error_p95_px": round(p95, 2),
        "error_max_px": round(float(err.max()), 2),
        "error_posicion_medio_px": round(float(pos.mean()), 2),
        "error_escala_medio_pct": round(float(escp.mean()), 3),
        "error_rotacion_medio_grados": round(float(rot.mean()), 3),
        "fotogramas_bajo_umbral_pct": round(100 * float((err <= a.umbral).mean()), 1),
        "umbral_px": a.umbral, "aprobado": aprobado,
        "peor_fotograma_ref": peor["f_ref"] if peor else None,
        "resolucion_ref": [W, H], "avisos": avisos,
    }
    with open(os.path.join(out, "calco.json"), "w", encoding="utf-8") as f:
        json.dump({"resumen": resumen, "fotogramas": filas}, f, ensure_ascii=False, indent=1)
    claves_csv = ["i", "f_ref", "f_nuestro", "directo_ok", "directo_err_px", "directo_dx", "directo_dy",
                  "directo_escala_pct", "directo_rot", "tray_ok", "tray_err_px", "tray_dx", "tray_dy",
                  "tray_escala_pct", "tray_rot"]
    with open(os.path.join(out, "calco.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=claves_csv, extrasaction="ignore")
        w.writeheader()
        for fila in filas:
            w.writerow({k: (round(v, 3) if isinstance(v, float) else v) for k, v in fila.items()})

    # onion skins (se vuelve a leer el peor fotograma si no estaba guardado)
    if peor is not None and claves_img.get(peor["i"]) is None:
        i = peor["i"]
        fr = next(leer_fotogramas(a.referencia, mr["fps_racional"], W, H, desde_s=(a.desde + i) / fps, dur_s=1.5 / fps))
        fn = next(leer_fotogramas(a.nuestro, mr["fps_racional"], W, H, desde_s=(a.desde + i + offset) / fps, dur_s=1.5 / fps))
        claves_img[i] = (fr, fn)
    tiras = []
    for i in sorted(claves_img):
        fr, fn = claves_img[i]
        fila = filas[i]
        e = fila.get(pre + "err_px")
        txt = (f"ref f{fila['f_ref']} / nuestro f{fila['f_nuestro']}  error {es_num(e, 1)} px" if e is not None
               else f"ref f{fila['f_ref']} / nuestro f{fila['f_nuestro']}  sin medida")
        im = onion(fr, fn, txt)
        cv2.imwrite(os.path.join(out, f"onion_{fila['f_ref']:05d}.png"), im)
        tiras.append(cv2.resize(im, (im.shape[1] // 2, im.shape[0] // 2), interpolation=cv2.INTER_AREA))
    if tiras:
        cols = 3
        filas_img = [np.hstack(tiras[k:k + cols] + [np.zeros_like(tiras[0])] * (cols - len(tiras[k:k + cols])))
                     for k in range(0, len(tiras), cols)]
        cv2.imwrite(os.path.join(out, "onion_resumen.png"), np.vstack(filas_img))

    veredicto = "APROBADO" if aprobado else "NO APROBADO"
    L = [f"# Calco · {resumen['referencia']} vs {resumen['nuestro']}", "",
         f"**{veredicto}** (criterio: p95 del error ≤ {es_num(a.umbral, 0)} px a {W}×{H}).", "",
         f"- Tramo de la referencia: f{a.desde}-f{a.hasta} ({len(filas)} fotogramas); offset {offset:+d} f ({como}).",
         f"- Modo: **{modo}** (registro directo correcto en el {es_num(resumen['registro_directo_ok_pct'], 0)} % de los fotogramas).",
         f"- Error medio **{es_num(resumen['error_medio_px'], 2)} px**, p95 {es_num(p95, 2)} px, máximo {es_num(resumen['error_max_px'], 2)} px "
         f"(f{resumen['peor_fotograma_ref']} de la referencia); {es_num(resumen['fotogramas_bajo_umbral_pct'], 0)} % de fotogramas ≤ {es_num(a.umbral, 0)} px.",
         f"- Desglose medio: posición del centro {es_num(resumen['error_posicion_medio_px'], 2)} px · escala "
         f"{es_num(resumen['error_escala_medio_pct'], 3)} % · rotación {es_num(resumen['error_rotacion_medio_grados'], 3)}°.",
         "", "Error = desplazamiento medio de las 4 esquinas y el centro del cuadro entre referencia y nuestro "
         "(en trayectoria: entre los movimientos de cámara acumulados desde el primer fotograma del tramo).",
         "Onion skin: izquierda, mezcla 50/50; derecha, referencia en magenta y nuestro en verde (gris = coinciden)."]
    for av in avisos:
        L.append(f"- Aviso: {av}")
    with open(os.path.join(out, "calco.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")
    print("\n".join(L[2:7]))
    print(f"→ {out}")
    return resumen


if __name__ == "__main__":
    main()
