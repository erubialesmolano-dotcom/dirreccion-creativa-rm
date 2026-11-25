#!/usr/bin/env python3
"""Analiza un vídeo de referencia (reel de Instagram / TikTok) y saca una ficha de edición medida.

Uso:
    python analizar.py VIDEO [--out carpeta] [--fps-objetivo 30]

Salida en la carpeta: ficha.json, ficha.md, contact_sheet.png, ritmo.png.
Ver LEEME.md para instalación, precisión medida y limitaciones.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import subprocess
import sys
import tempfile
import time

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import (binario, detectar_cortes, es_num, es_uniforme, histograma_hsv,  # noqa: E402
                   leer_fotogramas, movimiento_entre, probe, puntos, tam_analisis)

VERSION = "1.0"

# ======================================================================= texto en pantalla


def detectar_texto(gray: np.ndarray) -> tuple[list, np.ndarray]:
    """Zonas probables de texto (bordes + cierre horizontal + filtro de transiciones).
    Devuelve (cajas [x, y, w, h] en px de análisis, máscara binaria de bordes de texto)."""
    h, w = gray.shape
    k3 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    grad = cv2.morphologyEx(gray, cv2.MORPH_GRADIENT, k3)
    thr, _ = cv2.threshold(grad, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    _, bw = cv2.threshold(grad, max(thr, 70), 255, cv2.THRESH_BINARY)
    cerr = cv2.morphologyEx(bw, cv2.MORPH_CLOSE,
                            cv2.getStructuringElement(cv2.MORPH_RECT, (max(3, w // 36), 1)))
    cerr = cv2.morphologyEx(cerr, cv2.MORPH_CLOSE,
                            cv2.getStructuringElement(cv2.MORPH_RECT, (1, 3)))
    cnts, _ = cv2.findContours(cerr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    candidatas = []
    for c in cnts:
        x, y, bwid, bh = cv2.boundingRect(c)
        if bh > 0.09 * h and bwid >= 0.08 * w:
            # bloque alto (texto pegado a otra forma): partir por filas densas
            perfil = cerr[y:y + bh, x:x + bwid].mean(axis=1) / 255.0
            densas = perfil > 0.25
            i = 0
            while i < bh:
                if densas[i]:
                    j = i
                    while j + 1 < bh and densas[j + 1]:
                        j += 1
                    sub = cerr[y + i:y + j + 1, x:x + bwid]
                    cols = np.where(sub.max(axis=0) > 0)[0]
                    if len(cols):
                        candidatas.append((x + int(cols[0]), y + i, int(cols[-1] - cols[0] + 1), j - i + 1))
                    i = j + 1
                else:
                    i += 1
        else:
            candidatas.append((x, y, bwid, bh))
    cajas = []
    mascara = np.zeros_like(bw)
    for x, y, bwid, bh in candidatas:
        if not (0.012 * h <= bh <= 0.09 * h and bwid >= 1.3 * bh and bwid >= 0.08 * w):
            continue
        if gray[y:y + bh, x:x + bwid].std() < 45:  # el texto de subtítulo tiene mucho contraste
            continue
        roi = bw[y:y + bh, x:x + bwid]
        relleno = roi.mean() / 255.0
        if not 0.22 <= relleno <= 0.85:
            continue
        fila = roi[bh // 2] > 0
        trans = int(np.count_nonzero(fila[1:] != fila[:-1]))
        if trans < max(5, 1.2 * bwid / bh):
            continue
        cajas.append([int(x), int(y), int(bwid), int(bh)])
        mascara[y:y + bh, x:x + bwid] = roi
    return cajas, mascara


# ======================================================================= curvas

_INF = np.round(np.arange(0, 0.951, 0.05), 2)
_XS = np.linspace(0, 1, 1001)
_TABLA = None


def _tabla_bezier() -> np.ndarray:
    """y de Easing.bezier(a, 0, 1-b, 1) en 1001 x equiespaciados, para cada (a, b) de la rejilla."""
    global _TABLA
    if _TABLA is None:
        u = np.linspace(0, 1, 3000)
        filas = []
        for a in _INF:
            for b in _INF:
                x1, x2 = a, 1 - b
                bx = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3
                by = 3 * (1 - u) * u ** 2 + u ** 3
                filas.append(np.interp(_XS, bx, by))
        _TABLA = np.array(filas)
    return _TABLA


def ajustar_curva(senal: np.ndarray) -> dict | None:
    """senal: velocidad con signo por fotograma (par k-1 -> k) en la dirección dominante.

    Ajusta conjuntamente inicio, fin e influencias (a, b) de Easing.bezier(a, 0, 1-b, 1) al progreso
    acumulado del plano (0 antes del inicio, 1 después del fin)."""
    n = len(senal)
    if n < 5:
        return None
    prog = np.concatenate([[0.0], np.cumsum(senal)])
    if abs(prog[-1]) < 1e-12:
        return None
    prog = prog / prog[-1]
    T = _tabla_bezier()
    idx = np.arange(len(prog))
    # candidatos de inicio/fin alrededor de los cruces del 2 % y el 98 % del progreso
    i2 = int(np.argmax(prog >= 0.02))
    i98 = int(np.argmax(prog >= 0.98))
    cand_ini = np.unique(np.linspace(0, max(0, i2), min(i2 + 1, 16)).astype(int))
    cand_fin = np.unique(np.linspace(min(len(prog) - 1, i98), len(prog) - 1, min(len(prog) - i98, 16)).astype(int))
    mejor = (9.0, 0, 0, 0, len(prog) - 1)
    lineal = 9.0
    for s0 in cand_ini:
        for s1 in cand_fin:
            if s1 - s0 < 3:
                continue
            x = np.clip((idx - s0) / (s1 - s0), 0, 1)
            j = np.round(x * 1000).astype(int)
            err = np.sqrt(np.mean((T[:, j] - prog[None, :]) ** 2, axis=1))
            k = int(np.argmin(err))
            if err[k] < mejor[0]:
                mejor = (float(err[k]), k // len(_INF), k % len(_INF), int(s0), int(s1))
            lineal = min(lineal, float(err[0]))
    rmse, ia, ib, s0, s1 = mejor
    a, b = float(_INF[ia]), float(_INF[ib])
    # refinamiento a 0,01 alrededor del mejor punto de la rejilla
    x = np.clip((idx - s0) / max(1, s1 - s0), 0, 1)
    u = np.linspace(0, 1, 3000)
    for aa in np.arange(max(0, a - 0.05), min(0.99, a + 0.05) + 1e-9, 0.01):
        for bb in np.arange(max(0, b - 0.05), min(0.99, b + 0.05) + 1e-9, 0.01):
            bx = 3 * (1 - u) ** 2 * u * aa + 3 * (1 - u) * u ** 2 * (1 - bb) + u ** 3
            by = 3 * (1 - u) * u ** 2 + u ** 3
            e = float(np.sqrt(np.mean((np.interp(x, bx, by) - prog) ** 2)))
            if e < rmse - 1e-9:
                rmse, a, b = e, float(aa), float(bb)
    if lineal - rmse < 0.004 or (a < 0.2 and b < 0.2):
        tipo = "lineal (velocidad constante)"
    elif a >= 0.2 and b < 0.2:
        tipo = "ease-in (arranca lento y acelera)"
    elif b >= 0.2 and a < 0.2:
        tipo = "ease-out (arranca rápido y frena)"
    else:
        tipo = "ease-in-out" + (" asimétrico" if abs(a - b) > 0.2 else "")
    return {"desde_rel": s0, "hasta_rel": s1, "dur_f": s1 - s0,
            "influencia_salida": round(a, 2), "influencia_entrada": round(b, 2),
            "bezier": [round(a, 2), 0, round(1 - b, 2), 1], "rmse": round(rmse, 4),
            "rmse_lineal": round(lineal, 4), "tipo": tipo}


# ======================================================================= pase de vídeo


def pase_video(ruta: str, meta: dict, lado: int, verbose: bool = True) -> dict:
    W, H = meta["ancho"], meta["alto"]
    aw, ah, esc = tam_analisis(W, H, lado)
    pw = 64
    ph = max(2, int(round(pw * ah / aw)))
    tw = 32
    th = max(2, int(round(tw * ah / aw)))
    thumb_w = 180
    thumb_h = int(round(thumb_w * H / W))
    fps = meta["fps"]
    paso_color = max(1, int(round(fps / 2)))
    R = {k: [] for k in ("hist", "tiny", "luma", "luma_std", "liso", "mediana", "sat", "nitidez",
                         "gx", "gy", "s", "rot", "dx", "dy", "inl", "ok", "cajas", "mtexto",
                         "thumbs", "viñeta", "ruido", "sK", "rotK", "dxK", "dyK", "okK")}
    K = max(3, int(round(fps / 3)))  # paso largo para medir escala sin el sesgo de LK con desplazamientos subpíxel
    R["K"] = K
    from collections import deque
    buf = deque(maxlen=K)
    R["color_muestras"] = {}
    prev = None
    t0 = time.time()
    k_ruido = np.array([[1, -2, 1], [-2, 4, -2], [1, -2, 1]], np.float32)
    for i, fr in enumerate(leer_fotogramas(ruta, meta["fps_racional"], aw, ah)):
        gray = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        peq = cv2.resize(fr, (pw, ph), interpolation=cv2.INTER_AREA)
        R["hist"].append(histograma_hsv(peq))
        R["tiny"].append(cv2.GaussianBlur(cv2.resize(gray, (tw, th), interpolation=cv2.INTER_AREA), (3, 3), 0))
        R["luma"].append(float(gray.mean()))
        R["luma_std"].append(float(gray.std()))
        liso, med = es_uniforme(cv2.resize(fr, (pw * 2, ph * 2), interpolation=cv2.INTER_AREA))
        R["liso"].append(liso)
        R["mediana"].append(med)
        R["sat"].append(float(cv2.cvtColor(peq, cv2.COLOR_BGR2HSV)[..., 1].mean()))
        R["nitidez"].append(float(cv2.Laplacian(gray, cv2.CV_32F).var()))
        R["gx"].append(float(np.abs(cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)).mean()))
        R["gy"].append(float(np.abs(cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)).mean()))
        # viñeta: esquinas / centro
        cy, cx = ah // 10, aw // 10
        esq = np.mean([gray[:cy, :cx].mean(), gray[:cy, -cx:].mean(), gray[-cy:, :cx].mean(), gray[-cy:, -cx:].mean()])
        cen = gray[ah * 2 // 5:ah * 3 // 5, aw * 2 // 5:aw * 3 // 5].mean()
        R["viñeta"].append(float(esq / cen) if cen > 10 else np.nan)
        # ruido (Immerkær) en la mitad de resolución de análisis
        R["ruido"].append(float(np.sqrt(np.pi / 2) * np.abs(cv2.filter2D(gray.astype(np.float32), -1, k_ruido)).mean() / 6))
        # movimiento
        pts = puntos(gray)
        if prev is None:
            m = {"ok": False, "s": 1.0, "rot": 0.0, "dx": 0.0, "dy": 0.0, "inliers": 0.0}
        else:
            m = movimiento_entre(prev, gray, buf[-1][1])
        R["s"].append(m["s"]); R["rot"].append(m["rot"])
        R["dx"].append(m["dx"] / esc); R["dy"].append(m["dy"] / esc)
        R["inl"].append(m["inliers"]); R["ok"].append(bool(m["ok"]))
        if len(buf) == K:
            mk = movimiento_entre(buf[0][0], gray, buf[0][1])
        else:
            mk = {"ok": False, "s": 1.0, "rot": 0.0, "dx": 0.0, "dy": 0.0}
        R["sK"].append(mk["s"]); R["rotK"].append(mk["rot"])
        R["dxK"].append(mk["dx"] / esc); R["dyK"].append(mk["dy"] / esc); R["okK"].append(bool(mk["ok"]))
        buf.append((gray, pts))
        # texto
        cajas, masc = detectar_texto(gray)
        R["cajas"].append(cajas)
        R["mtexto"].append(np.packbits(cv2.resize(masc, (aw // 4, ah // 4), interpolation=cv2.INTER_NEAREST) > 0))
        # miniatura y color
        ok_jpg, jpg = cv2.imencode(".jpg", cv2.resize(fr, (thumb_w, thumb_h), interpolation=cv2.INTER_AREA),
                                   [cv2.IMWRITE_JPEG_QUALITY, 85])
        R["thumbs"].append(jpg)
        if i % paso_color == 0:
            R["color_muestras"][i] = cv2.resize(fr, (48, max(2, int(48 * ah / aw))), interpolation=cv2.INTER_AREA)
        prev = gray
        if verbose and i % 300 == 0 and i:
            print(f"  … {i} fotogramas ({i / fps:.1f} s) en {time.time() - t0:.0f} s", flush=True)
    R["n"] = len(R["luma"])
    R["tam_analisis"] = [aw, ah]
    R["esc"] = esc
    R["thumb"] = [thumb_w, thumb_h]
    R["mtexto_shape"] = (ah // 4, aw // 4)
    return R


# ======================================================================= flashes y tramos


def runs(mask: np.ndarray) -> list[tuple[int, int]]:
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j + 1 < n and mask[j + 1]:
                j += 1
            out.append((i, j + 1))
            i = j + 1
        else:
            i += 1
    return out


def flashes_y_tramos(R: dict, min_tramo: int, max_flash: int) -> tuple[list, list, np.ndarray]:
    Y = np.array(R["luma"])
    liso = np.array(R["liso"])
    med = np.array(R["mediana"])
    n = len(Y)
    from scipy.ndimage import median_filter
    base = median_filter(Y, size=31, mode="nearest")
    tramos, eventos = [], []
    excl = np.zeros(n, bool)
    for a, b in runs(liso):
        tipo = "blanco" if med[a:b].mean() > 200 else ("negro" if med[a:b].mean() < 35 else "color liso")
        if b - a >= min_tramo:
            tramos.append({"inicio": a, "fin": b, "dur_f": b - a, "tipo": tipo,
                           "luma_media": round(float(Y[a:b].mean()), 1)})
            excl[a:b] = True
    pico = ((Y - base) > 35) & (Y > 140) | (liso & (med > 200))
    for a, b in runs(pico):
        if excl[a:b].all():
            continue
        if b - a <= max_flash:
            eventos.append({"inicio": a, "fin": b, "dur_f": b - a, "tipo": "flash",
                            "blanco_puro": bool(liso[a:b].all()),
                            "luma_pico": round(float(Y[a:b].max()), 1),
                            "subida_sobre_entorno": round(float((Y[a:b] - base[a:b]).max()), 1)})
            excl[a:b] = True
    negro_corto = liso & (med < 35) & ~excl
    for a, b in runs(negro_corto):
        if b - a < min_tramo:
            eventos.append({"inicio": a, "fin": b, "dur_f": b - a, "tipo": "parpadeo negro",
                            "blanco_puro": False, "luma_pico": round(float(Y[a:b].max()), 1),
                            "subida_sobre_entorno": 0.0})
            excl[a:b] = True
    eventos.sort(key=lambda e: e["inicio"])
    return tramos, eventos, excl


# ======================================================================= movimiento por plano


def _interp_nan(x: np.ndarray) -> np.ndarray:
    x = x.copy()
    m = np.isnan(x)
    if m.all():
        return np.zeros_like(x)
    if m.any():
        idx = np.arange(len(x))
        x[m] = np.interp(idx[m], idx[~m], x[~m])
    return x


def movimiento_plano(R: dict, a: int, b: int, excl: np.ndarray, fps: float, W: int) -> dict:
    """Movimiento de cámara del plano [a, b). Unidades: px del vídeo original.

    - Serie fina: pares consecutivos (k-1 -> k), para la forma de la curva y el temblor.
    - Totales y velocidad de zoom: cadena de pares con paso K (≈1/3 s), que evita el sesgo de
      Lucas-Kanade con desplazamientos subpíxel (+10 % de zoom con paso 1 en las pruebas)."""
    K = R["K"]
    dur_s = (b - a) / fps
    ks = list(range(a + 1, b))
    out = {"pares": len(ks), "medible": False, "clase": "—"}
    if len(ks) < 3:
        out["clase"] = "corto (sin medir)"
        return out
    validos = np.array([R["ok"][k] and not excl[k] and not excl[k - 1] for k in ks])
    out["pares_validos_pct"] = round(100 * validos.mean(), 1)
    medibles = np.array([not excl[k] and not excl[k - 1] for k in ks])
    if validos.sum() < 0.5 * max(1, medibles.sum()):
        out["clase"] = "no medible (desenfoque / movimiento brusco)"
        return out
    def serie(clave, f=lambda v: v):
        return _interp_nan(np.array([f(R[clave][k]) if v else np.nan for k, v in zip(ks, validos)]))
    ls = serie("s", math.log)
    dx, dy, rot = serie("dx"), serie("dy"), serie("rot")
    # cadena de paso K
    c = next((k for k in range(a, b) if not excl[k]), a)
    tc, Lc, Xc, Yc, Rc = [c], [0.0], [0.0], [0.0], [0.0]
    cur = c
    while cur + K < b:
        k = cur + K
        if not excl[k] and R["okK"][k]:
            inc = (math.log(R["sK"][k]), R["dxK"][k], R["dyK"][k], R["rotK"][k])
        else:
            sl = slice(cur + 1 - (a + 1), k + 1 - (a + 1))
            inc = (ls[sl].sum(), dx[sl].sum(), dy[sl].sum(), rot[sl].sum())
        tc.append(k); Lc.append(Lc[-1] + inc[0]); Xc.append(Xc[-1] + inc[1])
        Yc.append(Yc[-1] + inc[2]); Rc.append(Rc[-1] + inc[3])
        cur = k
    sl = slice(cur + 1 - (a + 1), None)
    Ltot, Xtot = Lc[-1] + ls[sl].sum(), Xc[-1] + dx[sl].sum()
    Ytot, Rtot = Yc[-1] + dy[sl].sum(), Rc[-1] + rot[sl].sum()
    if len(tc) >= 3:
        pend = float(np.polyfit((np.array(tc) - a) / fps, Lc, 1)[0])
    else:
        pend = Ltot / max(dur_s - 1 / fps, 1e-6)
    # corrige la escala de la serie fina para que sume lo mismo que la cadena
    def corrige(v, total):
        s1 = v.sum()
        r = total / s1 if abs(s1) > 1e-9 else 1.0
        return v * r if 0.5 < r < 2 else v
    if len(tc) >= 2:
        ls, dx, dy = corrige(ls, Ltot), corrige(dx, Xtot), corrige(dy, Ytot)
    zoom_pct_s = (math.exp(pend) - 1) * 100
    zoom_total = (math.exp(Ltot) - 1) * 100
    v_zoom = np.convolve(ls, np.ones(3) / 3, mode="same")
    zoom_pico_pct_f = (math.exp(float(np.abs(v_zoom).max())) - 1) * 100
    disp = math.hypot(Xtot, Ytot)
    pan_px_s = disp / dur_s
    pan_pct_w_s = 100 * pan_px_s / W
    vel = np.hypot(np.convolve(dx, np.ones(3) / 3, "same"), np.convolve(dy, np.ones(3) / 3, "same"))
    pan_pico_px_f = float(vel.max())
    rot_s = Rtot / dur_s
    # temblor: residuo de la posición sobre una tendencia suave (Savitzky-Golay de ~0,35 s)
    temblor_px, temblor_hz, temblor_rot = 0.0, 0.0, 0.0
    X, Y, Rt = np.cumsum(dx), np.cumsum(dy), np.cumsum(rot)
    vent = max(5, int(round(0.35 * fps)) | 1)
    if len(ks) >= vent + 2:
        from scipy.signal import savgol_filter
        rx = X - savgol_filter(X, vent, 2)
        ry = Y - savgol_filter(Y, vent, 2)
        rr = Rt - savgol_filter(Rt, vent, 2)
        # el filtro atenúa parte del temblor: se mide sobre la velocidad para recuperar amplitud
        vx = dx - savgol_filter(dx, vent, 2)
        vy = dy - savgol_filter(dy, vent, 2)
        temblor_px = float(np.sqrt(np.mean(rx ** 2 + ry ** 2)))
        temblor_rot = float(np.sqrt(np.mean(rr ** 2)))
        r = vx if vx.std() >= vy.std() else vy
        espec = np.abs(np.fft.rfft(r * np.hanning(len(r))))
        freqs = np.fft.rfftfreq(len(r), 1 / fps)
        if len(espec) > 2:
            temblor_hz = float(freqs[1:][np.argmax(espec[1:])])
        # amplitud del temblor: RMS de la posición sin la tendencia lenta (poli. grado 3)
        t = np.arange(len(X))
        g = 3 if len(X) >= 20 else 2
        cx_ = X - np.polyval(np.polyfit(t, X, g), t)
        cy_ = Y - np.polyval(np.polyfit(t, Y, g), t)
        osc = float(np.sqrt(np.mean(cx_ ** 2 + cy_ ** 2)))
        # solo cuenta como temblor si además hay residuo rápido (si no, es una curva de paneo)
        out["temblor_rms_lento_px"] = round(osc, 2)
    esc1080 = 1080 / W
    out.update(medible=True,
               zoom_pct_s=round(zoom_pct_s, 2), zoom_total_pct=round(zoom_total, 2),
               zoom_pico_pct_f=round(zoom_pico_pct_f, 2),
               paneo_desplazamiento_px=[round(float(Xtot), 1), round(float(Ytot), 1)],
               paneo_px_s=round(pan_px_s, 1), paneo_pct_ancho_s=round(pan_pct_w_s, 2),
               paneo_pico_px_f=round(pan_pico_px_f, 1),
               rotacion_grados_s=round(rot_s, 3), rotacion_total=round(float(Rtot), 2),
               temblor_rms_px=round(temblor_px, 2), temblor_rms_px_1080=round(temblor_px * esc1080, 2),
               temblor_rot_rms=round(temblor_rot, 3), temblor_hz=round(temblor_hz, 2))
    n5 = min(5, len(ls))
    out["zoom_inicio_pct_f"] = round((math.exp(float(np.mean(ls[:n5]))) - 1) * 100, 2)
    out["zoom_final_pct_f"] = round((math.exp(float(np.mean(ls[-n5:]))) - 1) * 100, 2)
    # clasificación
    clases = []
    zoom_borde_px_s = abs(zoom_pct_s) / 100 * W / 2
    whip = pan_pico_px_f * esc1080 >= 60
    if zoom_pico_pct_f >= 1.2 or abs(zoom_pct_s) >= 10:
        clases.append("zoom rápido" if zoom_pct_s >= 0 else "zoom rápido hacia fuera")
    elif abs(zoom_pct_s) >= 0.4 and zoom_borde_px_s >= 0.5 * pan_px_s:
        clases.append("empuje" if zoom_pct_s > 0 else "alejamiento")
    if whip:
        clases.append("paneo látigo")
    elif pan_pct_w_s >= 2 and pan_px_s > zoom_borde_px_s * 0.5:
        clases.append("paneo")
    if abs(rot_s) >= 1.5:
        clases.append("rotación")
    if temblor_px * esc1080 >= 1.5 and temblor_hz >= 0.7 and temblor_px >= 0.1 * pan_pico_px_f:
        clases.append("temblor")
    if not clases:
        clases = ["fijo"]
    out["clase"] = " + ".join(clases)
    cur_ = None
    if clases[0] in ("empuje", "alejamiento", "zoom rápido", "zoom rápido hacia fuera"):
        cur_ = ajustar_curva(ls * (1 if Ltot >= 0 else -1))
        if cur_:
            cur_["magnitud"] = "escala (log)"
    elif clases[0] in ("paneo", "paneo látigo"):
        u = np.array([Xtot, Ytot]) / max(disp, 1e-9)
        cur_ = ajustar_curva(dx * u[0] + dy * u[1])
        if cur_:
            cur_["magnitud"] = "posición"
    if cur_:
        # índice de progreso i = fotograma a + i
        cur_["desde_f"] = int(a + cur_.pop("desde_rel"))
        cur_["hasta_f"] = int(a + cur_.pop("hasta_rel"))
    out["curva"] = cur_
    return out


# ======================================================================= texto: zonas y cambios


def zonas_texto(R: dict, excl: np.ndarray, fps: float) -> dict:
    aw, ah = R["tam_analisis"]
    n = R["n"]
    cent = []
    for i, cs in enumerate(R["cajas"]):
        if excl[i]:
            continue
        for x, y, w, h in cs:
            cent.append((i, (y + h / 2) / ah, h / ah, (x + w / 2) / aw, w / aw))
    if not cent:
        return {"frames_con_texto_pct": 0.0, "zonas": []}
    arr = np.array(cent)
    # agrupar por altura (centro vertical) en bandas del 4 % y fusionar contiguas
    bins = np.floor(arr[:, 1] * 25).astype(int)
    cuenta = np.bincount(bins, minlength=26)
    zonas, i = [], 0
    while i < 26:
        if cuenta[i] > 0:
            j = i
            while j + 1 < 26 and cuenta[j + 1] > 0:
                j += 1
            zonas.append((i, j))
            i = j + 1
        else:
            i += 1
    validos = int((~excl).sum())
    res = []
    for z0, z1 in zonas:
        sel = arr[(bins >= z0) & (bins <= z1)]
        frames = np.unique(sel[:, 0].astype(int))
        pres = len(frames) / max(1, validos)
        if pres < 0.04 or len(frames) < 4:
            continue
        y0, y1 = int(z0 / 25 * ah), int(min(ah, (z1 + 1) / 25 * ah))
        # cambios de texto dentro de la banda
        cambios = 0
        prev = None
        sh = R["mtexto_shape"]
        for f in range(n):
            if excl[f]:
                continue
            m = np.unpackbits(R["mtexto"][f])[:sh[0] * sh[1]].reshape(sh)[y0 // 4:max(y0 // 4 + 1, y1 // 4)]
            on = m.mean() > 0.002
            if prev is not None:
                pm, pon = prev
                if on != pon and on:
                    cambios += 1
                elif on and pon:
                    inter = np.logical_and(m, pm).sum()
                    union = np.logical_or(m, pm).sum()
                    if union and inter / union < 0.45:
                        cambios += 1
            prev = (m, on)
        dur_pres_s = len(frames) / fps
        res.append({
            "y_centro_pct": round(100 * float(np.median(sel[:, 1])), 1),
            "banda_pct": [round(100 * z0 / 25, 1), round(100 * (z1 + 1) / 25, 1)],
            "presencia_pct": round(100 * pres, 1),
            "altura_caja_pct": round(100 * float(np.median(sel[:, 2])), 2),
            "x_centro_pct": round(100 * float(np.median(sel[:, 3])), 1),
            "ancho_pct": round(100 * float(np.median(sel[:, 4])), 1),
            "cambios": cambios,
            "f_por_cambio": round(len(frames) / cambios, 1) if cambios else None,
            "presente_s": round(dur_pres_s, 2),
            "zona": "superior" if np.median(sel[:, 1]) < 0.33 else ("centro" if np.median(sel[:, 1]) < 0.62 else "inferior"),
        })
    res.sort(key=lambda z: -z["presencia_pct"])
    con_texto = sum(1 for i, cs in enumerate(R["cajas"]) if cs and not excl[i])
    return {"frames_con_texto_pct": round(100 * con_texto / max(1, validos), 1), "zonas": res[:5]}


# ======================================================================= color


def hexcol(bgr) -> str:
    b, g, r = [int(round(v)) for v in bgr]
    return f"#{r:02x}{g:02x}{b:02x}"


def paleta(pix_bgr: np.ndarray, k: int) -> list:
    if len(pix_bgr) < k * 10:
        return []
    lab = cv2.cvtColor(pix_bgr.reshape(-1, 1, 3), cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    crit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    cv2.setRNGSeed(1)
    _, lab_lbl, cent = cv2.kmeans(lab, k, None, crit, 3, cv2.KMEANS_PP_CENTERS)
    cnt = np.bincount(lab_lbl.ravel(), minlength=k)
    out = []
    for j in np.argsort(-cnt):
        bgr = cv2.cvtColor(cent[j].reshape(1, 1, 3).astype(np.uint8), cv2.COLOR_LAB2BGR).ravel()
        out.append({"hex": hexcol(bgr), "pct": round(100 * cnt[j] / cnt.sum(), 1)})
    return out


def analisis_color(R: dict, excl: np.ndarray, fps: float, dur_s: float) -> dict:
    muestras = {i: m for i, m in R["color_muestras"].items() if not excl[i]}
    todas = np.concatenate([m.reshape(-1, 3) for m in muestras.values()]) if muestras else np.zeros((0, 3), np.uint8)
    sat = np.array(R["sat"])[~excl]
    luma = np.array(R["luma"])[~excl]
    lab = cv2.cvtColor(todas.reshape(-1, 1, 3), cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(float) if len(todas) else np.zeros((1, 3))
    tramos = []
    for t0 in np.arange(0, max(dur_s, 0.01), 5.0):
        a, b = int(t0 * fps), int(min(dur_s, t0 + 5) * fps)
        sel = [m.reshape(-1, 3) for i, m in muestras.items() if a <= i < b]
        if not sel:
            continue
        pix = np.concatenate(sel)
        msk = (~excl)[a:b]
        tramos.append({"desde_s": round(float(t0), 1), "hasta_s": round(float(min(dur_s, t0 + 5)), 1),
                       "paleta": paleta(pix, 5),
                       "saturacion_media": round(float(np.array(R["sat"][a:b])[msk].mean() / 255 * 100), 1) if msk.any() else None,
                       "luminancia_media": round(float(np.array(R["luma"][a:b])[msk].mean() / 255 * 100), 1) if msk.any() else None})
    viñ = np.array(R["viñeta"])[~excl]
    viñ = viñ[~np.isnan(viñ)]
    return {
        "paleta_global": paleta(todas, 6),
        "saturacion_media_pct": round(float(sat.mean() / 255 * 100), 1) if len(sat) else None,
        "luminancia_media_pct": round(float(luma.mean() / 255 * 100), 1) if len(luma) else None,
        "contraste_std_luma_pct": round(float(np.mean(np.array(R["luma_std"])[~excl]) / 255 * 100), 1) if len(luma) else None,
        "temperatura_b_lab": round(float(lab[:, 2].mean() - 128), 1),
        "tinte_a_lab": round(float(lab[:, 1].mean() - 128), 1),
        "viñeta_esquinas_vs_centro": round(float(np.median(viñ)), 3) if len(viñ) else None,
        "ruido_sigma_aprox": round(float(np.median(np.array(R["ruido"])[~excl])), 2) if (~excl).any() else None,
        "por_tramo_5s": tramos,
    }


# ======================================================================= audio


def ebur128(ruta: str) -> dict:
    cmd = [binario("ffmpeg"), "-nostats", "-hide_banner", "-nostdin", "-i", ruta, "-map", "0:a:0",
           "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    resumen = err[err.rfind("Summary:"):] if "Summary:" in err else err
    def g(pat):
        m = re.search(pat, resumen)
        return float(m.group(1)) if m else None
    return {"lufs_integrados": g(r"I:\s+(-?[\d.]+) LUFS"),
            "rango_lra_lu": g(r"LRA:\s+(-?[\d.]+) LU"),
            "true_peak_dbtp": g(r"True peak:\s+Peak:\s+(-?[\d.]+|-inf) dBFS")}


def silencios(ruta: str, umbral_db: float, min_s: float) -> list:
    cmd = [binario("ffmpeg"), "-nostats", "-hide_banner", "-nostdin", "-i", ruta, "-map", "0:a:0",
           "-af", f"silencedetect=noise={umbral_db}dB:d={min_s}", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", err)]
    fin = [float(x) for x in re.findall(r"silence_end: (-?[\d.]+)", err)]
    out = []
    for i, s in enumerate(ini):
        e = fin[i] if i < len(fin) else None
        out.append({"inicio_s": round(max(0.0, s), 3), "fin_s": round(e, 3) if e is not None else None,
                    "dur_s": round(e - max(0.0, s), 3) if e is not None else None})
    return out


def alineacion(cortes_t: list, onsets: np.ndarray, fps: float, tol_f: float, dur: float,
               semilla: int = 7, iteraciones: int = 5000) -> dict:
    if not len(cortes_t) or not len(onsets):
        # sin cortes o sin onsets (un solo plano, audio en silencio): mismas claves que el caso normal
        return {"cortes": len(cortes_t), "aciertos": 0, "pct": None, "en_el_fotograma": 0, "a_1f": 0,
                "control_aleatorio_pct": None, "control_p95_pct": None, "p_valor": None,
                "desfase_mediano_f_aciertos": None, "desfases_f": []}
    on = np.sort(np.asarray(onsets))

    def dist(ts):
        ts = np.asarray(ts)
        idx = np.clip(np.searchsorted(on, ts), 1, len(on) - 1)
        izq, der = on[idx - 1], on[idx]
        elegido = np.where(np.abs(ts - izq) <= np.abs(ts - der), izq, der)
        return (ts - elegido) * fps  # >0: el corte llega después del onset

    d = dist(cortes_t)
    hit = np.abs(d) <= tol_f + 1e-6
    rng = np.random.default_rng(semilla)
    lo, hi = min(0.5, dur / 10), max(dur - 0.5, dur * 0.9)
    # control: cortes aleatorios en fotogramas enteros (como los reales)
    ctrl = np.array([(np.abs(dist(rng.integers(int(lo * fps), int(hi * fps), len(cortes_t)) / fps)) <= tol_f + 1e-6).mean()
                     for _ in range(iteraciones // max(1, len(cortes_t) // 50 + 1))])
    from scipy.stats import binom
    p0 = float(ctrl.mean())
    k = int(hit.sum())
    pval = float(binom.sf(k - 1, len(d), p0)) if 0 < p0 < 1 else None
    return {"cortes": len(d), "aciertos": k, "pct": round(100 * hit.mean(), 1),
            "en_el_fotograma": int((np.abs(d) <= 0.5).sum()), "a_1f": int((np.abs(d) <= 1).sum()),
            "control_aleatorio_pct": round(100 * p0, 1),
            "control_p95_pct": round(100 * float(np.percentile(ctrl, 95)), 1),
            "p_valor": round(pval, 4) if pval is not None else None,
            "desfase_mediano_f_aciertos": round(float(np.median(d[hit])), 2) if k else None,
            "desfases_f": [round(float(x), 2) for x in d]}


def analizar_audio(ruta: str, meta: dict, fps: float, cortes_t: list, tol_f: float, demucs: bool,
                   tmp: str, umbral_sil: float) -> dict | None:
    if not meta.get("audio"):
        return None
    out = {"loudness": ebur128(ruta), "silencios": silencios(ruta, umbral_sil, 0.25)}
    wav = os.path.join(tmp, "audio.wav")
    subprocess.run([binario("ffmpeg"), "-v", "error", "-nostdin", "-y", "-i", ruta, "-vn", "-ac", "1",
                    "-ar", "22050", wav], check=True)
    try:
        import librosa
    except ImportError:
        out["aviso"] = "librosa no instalado: sin onsets ni tempo (pip install librosa soundfile)."
        return out
    y, sr = librosa.load(wav, sr=22050, mono=True)
    dur = len(y) / sr
    hop = 256

    def onsets_de(sig):
        env = librosa.onset.onset_strength(y=sig, sr=sr, hop_length=hop)
        on = librosa.onset.onset_detect(onset_envelope=env, sr=sr, hop_length=hop, units="time",
                                        backtrack=False)
        return env, np.asarray(on)

    env, on = onsets_de(y)
    tempo, beats = librosa.beat.beat_track(onset_envelope=env, sr=sr, hop_length=hop, units="time")
    tempo = float(np.atleast_1d(tempo)[0])
    perc = librosa.effects.percussive(y, margin=2.0)
    env_p, on_p = onsets_de(perc)
    fuente_bateria = "percusivo HPSS (aprox. de batería)"
    if demucs:
        try:
            subprocess.run([sys.executable, "-m", "demucs", "--two-stems", "drums", "-o", tmp, wav],
                           check=True, capture_output=True)
            dr = None
            for raiz, _, fs in os.walk(tmp):
                if "drums.wav" in fs:
                    dr = os.path.join(raiz, "drums.wav")
            if dr:
                yd, _ = librosa.load(dr, sr=22050, mono=True)
                env_p, on_p = onsets_de(yd)
                fuente_bateria = "stem de batería (demucs)"
        except Exception as e:  # noqa: BLE001
            out["aviso_demucs"] = f"demucs falló ({e.__class__.__name__}); se usa HPSS."
    out.update({
        "duracion_s": round(dur, 3),
        "tempo_bpm": round(tempo, 1),
        "f_por_beat": round(60 / tempo * fps, 2) if tempo else None,
        "onsets_n": int(len(on)), "onsets_por_s": round(len(on) / dur, 2) if dur else None,
        "onsets_s": [round(float(x), 3) for x in on],
        "beats_s": [round(float(x), 3) for x in np.atleast_1d(beats)],
        "onsets_bateria_fuente": fuente_bateria,
        "onsets_bateria_s": [round(float(x), 3) for x in on_p],
        "env_hop_s": hop / sr,
        "_env": env.tolist(),
        "cortes_vs_onsets": alineacion(cortes_t, on, fps, tol_f, dur),
        "cortes_vs_bateria": alineacion(cortes_t, on_p, fps, tol_f, dur),
        "cortes_vs_beats": alineacion(cortes_t, np.atleast_1d(beats), fps, tol_f, dur),
    })
    return out


# ======================================================================= salidas gráficas


def fuente(tam: int):
    from PIL import ImageFont
    for f in ("DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
              "arialbd.ttf", "C:/Windows/Fonts/arialbd.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"):
        try:
            return ImageFont.truetype(f, tam)
        except OSError:
            continue
    return ImageFont.load_default(size=tam)


def contact_sheet(R: dict, segs: list, fps: float, fps_obj: float, ruta: str, nombre: str):
    from PIL import Image, ImageDraw
    tw, th = R["thumb"]
    cols = 8 if tw < th else 5
    pad, cab = 6, 34
    filas = math.ceil(len(segs) / cols)
    W = cols * (tw + pad) + pad
    Hh = 50 + filas * (th + cab + pad) + pad
    img = Image.new("RGB", (W, Hh), (25, 25, 25))
    d = ImageDraw.Draw(img)
    d.text((pad, 12), f"{nombre} · {len(segs)} segmentos · {es_num(fps, 2)} fps", font=fuente(18), fill=(239, 239, 239))
    f1, f2 = fuente(14), fuente(12)
    for i, s in enumerate(segs):
        r, c = divmod(i, cols)
        x = pad + c * (tw + pad)
        y = 50 + r * (th + cab + pad)
        mid = (s["inicio"] + s["fin"]) // 2
        im = cv2.imdecode(R["thumbs"][mid], cv2.IMREAD_COLOR)
        img.paste(Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)), (x, y))
        etiqueta = f"#{s['n']}  {s['dur_f']} f · {es_num(s['dur_f'] / fps, 2)} s"
        d.text((x + 2, y + th + 2), etiqueta, font=f1, fill=(239, 239, 239))
        sub = s.get("clase_corta") or s["tipo"]
        d.text((x + 2, y + th + 18), sub[:28], font=f2, fill=(156, 156, 156))
        if s["dur_f"] / fps * fps_obj <= 8.5 and s["tipo"] == "plano":
            d.rectangle([x, y, x + tw - 1, y + th - 1], outline=(244, 114, 48), width=3)
    img.save(ruta)


def grafica_ritmo(segs: list, eventos: list, audio: dict | None, fps: float, dur: float, ruta: str):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    azul, naranja, gris, tinta, tinta2 = "#257de0", "#f47230", "#9c9c9c", "#191919", "#666666"
    paneles = 2 if audio and audio.get("_env") else 1
    fig, axs = plt.subplots(paneles, 1, figsize=(12, 5.2 if paneles == 2 else 3.4), sharex=True,
                            gridspec_kw={"height_ratios": [3, 1.3][:paneles]})
    axs = np.atleast_1d(axs)
    ax = axs[0]
    for s in segs:
        if s["tipo"] != "plano":
            ax.axvspan(s["inicio"] / fps, s["fin"] / fps, color="#efefef", lw=0)
            continue
        ax.bar(s["inicio"] / fps, s["dur_f"], width=max(s["dur_f"] / fps - 0.03, 0.02), align="edge",
               color=azul, edgecolor="white", linewidth=0)
    ax.axhline(8, color=tinta2, lw=0.8, ls="--")
    ax.text(dur, 8, " 8 f", va="center", fontsize=8, color=tinta2)
    ax.axhline(3 * fps, color=tinta2, lw=0.8, ls=":")
    ax.text(dur, 3 * fps, " 3 s", va="center", fontsize=8, color=tinta2)
    fl = [e for e in eventos if e["tipo"] == "flash"]
    if fl:
        ax.scatter([e["inicio"] / fps for e in fl], [0] * len(fl), marker="^", s=60, color=naranja,
                   zorder=5, clip_on=False, label="flash")
    ax.bar([0], [0], color=azul, label="duración del plano (f)")
    ax.set_ylabel("fotogramas", color=tinta2)
    ax.set_title("Duración de cada plano en el tiempo", loc="left", color=tinta, fontsize=11, pad=8)
    ax.legend(loc="lower right", bbox_to_anchor=(1, 1.0), frameon=False, fontsize=8, ncol=3)
    for a in axs:
        a.spines[["top", "right"]].set_visible(False)
        a.tick_params(colors=tinta2, labelsize=8)
        a.grid(axis="y", color="#e5e5e5", lw=0.6)
        a.set_axisbelow(True)
    if paneles == 2:
        ax2 = axs[1]
        env = np.array(audio["_env"])
        t = np.arange(len(env)) * audio["env_hop_s"]
        ax2.plot(t, env / (env.max() or 1), color=gris, lw=0.8, label="fuerza de onset")
        on = audio.get("onsets_s", [])
        ax2.vlines(on, 0, 1, color=tinta2, lw=0.5, alpha=0.5)
        for i, s in enumerate(segs[1:]):
            ax2.axvline(s["inicio"] / fps, color=azul, lw=1.2, label="corte" if i == 0 else None)
        ax2.set_ylim(0, 1.05)
        ax2.set_yticks([])
        ax2.set_title("Cortes (azul) sobre los onsets del audio (gris)", loc="left", color=tinta, fontsize=10)
        ax2.legend(loc="upper right", frameon=False, fontsize=8, ncol=2)
    axs[-1].set_xlabel("segundos", color=tinta2)
    axs[-1].set_xlim(0, dur)
    fig.tight_layout()
    fig.savefig(ruta, dpi=130)
    plt.close(fig)


# ======================================================================= estadística


def estad(durs_f: list, fps: float, fps_obj: float) -> dict:
    if not durs_f:
        return {}
    d = np.array(durs_f, float)
    d_obj = d / fps * fps_obj
    def r(x):
        return round(float(x), 2)
    return {
        "n": int(len(d)),
        "media_f": r(d.mean()), "mediana_f": r(np.median(d)),
        "media_f_obj": r(d_obj.mean()), "mediana_f_obj": r(np.median(d_obj)),
        "media_s": r(d.mean() / fps), "mediana_s": r(np.median(d) / fps),
        "p10_f": r(np.percentile(d, 10)), "p25_f": r(np.percentile(d, 25)),
        "p75_f": r(np.percentile(d, 75)), "p90_f": r(np.percentile(d, 90)),
        "min_f": int(d.min()), "max_f": int(d.max()),
        "planos_hasta_8f": int((d_obj <= 8 + 1e-6).sum()),
        "planos_hasta_8f_pct": r(100 * (d_obj <= 8 + 1e-6).mean()),
        "planos_3s_o_mas": int((d / fps >= 3 - 1e-6).sum()),
        "tiempo_en_planos_3s_pct": r(100 * d[d / fps >= 3 - 1e-6].sum() / d.sum()),
        "cortes_por_s": r(len(d) / (d.sum() / fps)),
    }


# ======================================================================= Remotion


def plan_remotion(ficha: dict, fps: float, fps_obj: float) -> tuple[list, dict]:
    """Traduce lo medido al vocabulario del kit. Devuelve (líneas markdown, dict)."""
    L, P = [], {"planos": []}
    est = ficha["planos"]["estadisticas"]
    if not est:
        return ["No hay planos que traducir."], P
    def fo(f):  # fotogramas nativos -> objetivo
        return int(round(f / fps * fps_obj))
    med = est["mediana_f_obj"]
    if med <= 12:
        modo = "energía"
        txt = "cortes muy rápidos; aguanta la tensión con 1 plano de peso"
    elif med <= 36:
        modo = "narrativo (medio)"
        txt = "ritmo de conversación; alterna ráfagas de 3-5 cortes con holds"
    else:
        modo = "respiro / peso"
        txt = "planos largos; el movimiento de cámara lleva el ritmo"
    P["modo"] = modo
    L.append(f"- **Ritmo global**: plano mediano {es_num(med, 0)} f a {es_num(fps_obj, 0)} fps "
             f"(media {es_num(est['media_f_obj'], 1)} f) → **modo {modo}**: {txt}. "
             f"{est['planos_hasta_8f']} de {est['n']} planos duran ≤8 f ({es_num(est['planos_hasta_8f_pct'], 0)} %); "
             f"{est['planos_3s_o_mas']} sostenido(s) ≥3 s ({es_num(est['tiempo_en_planos_3s_pct'], 0)} % del tiempo).")
    largos = [s for s in ficha["planos"]["lista"] if s["tipo"] == "plano" and s["dur_f"] / fps >= 3]
    if largos:
        L.append("- **Planos de peso** (≥3 s): " + ", ".join(
            f"#{s['n']} ({es_num(s['dur_f'] / fps, 1)} s, desde f{fo(s['inicio'])})" for s in largos) +
            ". Mantén su duración exacta; es donde la referencia deja respirar.")
    # cámara por plano
    filas = []
    for s in ficha["planos"]["lista"]:
        if s["tipo"] != "plano":
            continue
        m = s.get("movimiento", {})
        cl = m.get("clase", "—")
        comp, param = "—", ""
        cur = m.get("curva")
        bez = f"`Easing.bezier({', '.join(f'{x:g}' for x in cur['bezier'])})`" if cur else ""
        if cl.startswith("empuje") or cl.startswith("alejamiento"):
            comp = "`CameraPush`"
            param = (f"{'+' if m['zoom_pct_s'] > 0 else ''}{es_num(m['zoom_pct_s'], 1)} %/s exponencial "
                     f"(total {es_num(m['zoom_total_pct'], 1)} %)")
            if cur and "lineal" not in cur["tipo"]:
                param += f"; curva {cur['tipo']} {bez}"
        elif cl.startswith("zoom rápido"):
            nxt = s["n"]
            comp = "`ZoomThrough`" if abs(m.get("zoom_final_pct_f", 0)) >= 1 or abs(m.get("zoom_inicio_pct_f", 0)) >= 1 else "`CameraPush` (rápido)"
            param = (f"{es_num(m['zoom_total_pct'], 0)} % en el plano, pico {es_num(m['zoom_pico_pct_f'], 1)} %/f"
                     + (f"; {cur['tipo']} {bez} en {cur['dur_f']} f" if cur else ""))
        elif cl.startswith("paneo látigo"):
            comp = "`WhipPan`"
            param = f"pico {es_num(m['paneo_pico_px_f'], 0)} px/f"
        elif cl.startswith("paneo"):
            dxp, dyp = m["paneo_desplazamiento_px"]
            comp = "translate (paneo)"
            dirc = ("cámara a la " + ("izquierda" if dxp > 0 else "derecha")) if abs(dxp) >= abs(dyp) else \
                   ("cámara hacia " + ("arriba" if dyp > 0 else "abajo"))
            param = (f"contenido {es_num(dxp, 0)}, {es_num(dyp, 0)} px en {fo(cur['dur_f'] if cur else s['dur_f'])} f "
                     f"({dirc}); {cur['tipo'] if cur else ''} {bez}")
        elif "no medible" in cl:
            comp = "`WhipPan` o desenfoque de movimiento (revisar a ojo)"
        if "temblor" in cl:
            comp = (comp + " + " if comp != "—" else "") + "`Shake`"
            param += (("; " if param else "") +
                      f"amplitud {es_num(m['temblor_rms_px_1080'] * 1.41, 1)} px a 1080 (pico≈RMS·√2), "
                      f"~{es_num(m['temblor_hz'], 1)} Hz, rotación {es_num(m['temblor_rot_rms'], 2)}°")
        if cl == "fijo":
            comp, param = "estático", "sin cámara (o micro-empuje solo si la pieza lo pide)"
        filas.append((s, cl, comp, param))
        P["planos"].append({"n": s["n"], "desde_f": fo(s["inicio"]), "dur_f": fo(s["fin"]) - fo(s["inicio"]),
                            "clase": cl, "componente": comp.replace("`", ""), "parametros": param})
    L.append("")
    L.append(f"| # | desde (f@{es_num(fps_obj, 0)}) | dura (f@{es_num(fps_obj, 0)}) | movimiento medido | componente | parámetros |")
    L.append("|---|---|---|---|---|---|")
    for s, cl, comp, param in filas:
        L.append(f"| {s['n']} | {fo(s['inicio'])} | {fo(s['fin']) - fo(s['inicio'])} | {cl} | {comp} | {param} |")
    L.append("")
    # transiciones
    fl = [e for e in ficha["flashes_tramos"]["eventos"] if e["tipo"] == "flash"]
    if fl:
        en_corte = [e for e in fl if e.get("corte_n")]
        dentro = [e for e in fl if not e.get("corte_n")]
        durs = sorted({fo(e["dur_f"]) or 1 for e in (en_corte or fl)})
        if en_corte:
            L.append(f"- **`FlashCut`**: flash de {'/'.join(map(str, durs))} f en los cortes "
                     + ", ".join(str(e["corte_n"]) for e in en_corte)
                     + f" (f@{es_num(fps_obj, 0)}: " + ", ".join(str(fo(e['inicio'])) for e in en_corte) + ")"
                     + ("; blanco puro" if all(e["blanco_puro"] for e in en_corte) else "; destello parcial (no llega a blanco)") + ".")
        if dentro:
            L.append("- **Flash dentro de plano** (acento sin corte): " + ", ".join(
                f"f{fo(e['inicio'])} ({fo(e['dur_f']) or 1} f, plano #{e.get('plano_n')})" for e in dentro) + ".")
        P["flashes"] = [{"desde_f": fo(e["inicio"]), "dur_f": fo(e["dur_f"]) or 1, "corte": e.get("corte_n")} for e in fl]
    whips = [c for c in ficha["planos"]["cortes"] if c.get("latigo")]
    if whips:
        L.append("- **`WhipPan`** probable en los cortes " + ", ".join(f"{c['n']} ({c['latigo']})" for c in whips) + ".")
    pis = [c for c in ficha["planos"]["cortes"] if c["tipo"] == "punch-in"]
    if pis:
        L.append("- **Punch-in** (salto de escala sin cambiar de plano): " + ", ".join(
            f"corte {c['n']} {'+' if c['salto_escala_pct'] > 0 else ''}{es_num(c['salto_escala_pct'], 0)} %" for c in pis)
                 + ". En el kit: escala seca + 2-4 f de asentamiento (con <10 % parece error).")
    zt = [s for s, cl, comp, _ in filas if "ZoomThrough" in comp]
    if zt:
        L.append("- **`ZoomThrough`**: planos " + ", ".join(f"#{s['n']}" for s in zt)
                 + " (zoom acelerado hacia el corte / que frena al entrar). Corta en el pico de velocidad.")
    tr = ficha["flashes_tramos"]["tramos"]
    if tr:
        L.append("- **Tramos lisos**: " + ", ".join(f"{t['tipo']} {fo(t['dur_f'])} f en f{fo(t['inicio'])}" for t in tr)
                 + ". Si llevan texto encima, es el registro \"negro sobre blanco\"/tarjeta.")
    if not fl and not whips and not pis:
        L.append("- Transiciones: todos los cortes son secos (sin flash, látigo ni punch-in detectados).")
    L.append("- **`GlassSlats`**: el analizador no detecta transiciones de láminas; si las ves en la hoja de contactos, mide su duración a mano.")
    # texto
    tx = ficha["texto"]
    if tx["zonas"]:
        z = tx["zonas"][0]
        alto = ficha["metadatos"]["alto"]
        palabra = z["f_por_cambio"] and z["f_por_cambio"] / fps * fps_obj <= 12
        L.append(f"- **`WordCaptions`**: texto en la franja {z['zona']} (centro y≈{es_num(z['y_centro_pct'], 0)} % del alto, "
                 f"≈{int(round(z['y_centro_pct'] / 100 * 1920))} px en 1080×1920), presente el {es_num(z['presencia_pct'], 0)} % del tiempo, "
                 f"caja ≈{es_num(z['altura_caja_pct'], 1)} % del alto (≈{int(round(z['altura_caja_pct'] / 100 * 1920))} px a 1920)"
                 + (f"; cambia cada ≈{es_num(z['f_por_cambio'] / fps * fps_obj, 0)} f" if z["f_por_cambio"] else "") + ".")
        if palabra:
            L.append(f"- **`PopFromWord`**: el texto cambia cada ≤12 f → palabra a palabra con pop por palabra "
                     f"({es_num(z['f_por_cambio'] / fps * fps_obj, 0)} f por palabra).")
        P["texto"] = {"zona": z["zona"], "y_pct": z["y_centro_pct"], "f_por_cambio": z["f_por_cambio"]}
    # audio
    au = ficha.get("audio")
    if au and au.get("cortes_vs_onsets"):
        a = au["cortes_vs_bateria"] if au.get("cortes_vs_bateria", {}).get("pct") is not None else au["cortes_vs_onsets"]
        a_all = au["cortes_vs_onsets"]
        if a["pct"] is not None:
            sig = a["p_valor"] is not None and a["p_valor"] < 0.05
            L.append(f"- **Corte a la música**: {es_num(a_all['pct'], 0)} % de los cortes caen a ±{ficha['parametros']['tolerancia_beat_f']:g} f de un onset "
                     f"(control aleatorio {es_num(a_all['control_aleatorio_pct'], 0)} %); con la batería ({au['onsets_bateria_fuente']}): "
                     f"{es_num(a['pct'], 0)} % frente a {es_num(a['control_aleatorio_pct'], 0)} %"
                     + (f"; {a['en_el_fotograma']} cortes clavados en el mismo fotograma." if a['aciertos'] else ".")
                     + (" → **corta al golpe**: clava 1-2 cortes estructurales al fotograma y deja el resto a ±2 f."
                        if sig else " → no hay evidencia de corte al beat (≈ azar): monta por sentido, no por rejilla."))
            if a.get("desfase_mediano_f_aciertos") is not None and abs(a["desfase_mediano_f_aciertos"]) >= 0.5:
                L.append(f"  Desfase mediano de los aciertos: {es_num(a['desfase_mediano_f_aciertos'], 1)} f "
                         f"({'el corte llega después del golpe' if a['desfase_mediano_f_aciertos'] > 0 else 'el corte se adelanta al golpe'}).")
        if au.get("tempo_bpm"):
            L.append(f"- **Rejilla**: {es_num(au['tempo_bpm'], 0)} BPM → un beat = {es_num(60 / au['tempo_bpm'] * fps_obj, 1)} f a {es_num(fps_obj, 0)} fps.")
        ld = au["loudness"]
        if ld.get("lufs_integrados") is not None:
            L.append(f"- **Máster**: {es_num(ld['lufs_integrados'], 1)} LUFS integrados, true peak {es_num(ld['true_peak_dbtp'], 1)} dBTP, "
                     f"LRA {es_num(ld['rango_lra_lu'], 1)} LU. Iguálalo en la mezcla final.")
        sil = [s for s in au["silencios"] if s["dur_s"] and s["dur_s"] >= 0.25]
        if sil:
            L.append("- **Silencios** (antes de revelaciones): " + ", ".join(
                f"{es_num(s['inicio_s'], 2)}-{es_num(s['fin_s'], 2)} s (f{fo(s['inicio_s'] * fps)}, {fo(s['dur_s'] * fps)} f)" for s in sil[:8]) + ".")
    # acabado
    co = ficha["color"]
    pal = ", ".join(f"{p['hex']} {es_num(p['pct'], 0)} %" for p in co["paleta_global"][:5])
    viñ = co.get("viñeta_esquinas_vs_centro")
    L.append(f"- **`Finish`**: paleta {pal}; saturación media {es_num(co['saturacion_media_pct'], 0)} %, "
             f"luminancia {es_num(co['luminancia_media_pct'], 0)} %"
             + (f"; esquinas al {es_num(viñ * 100, 0)} % del centro" + (" → viñeta ≈ " + es_num((viñ - 1) * 100, 0) + " %" if viñ and viñ < 0.9 else " (sin viñeta clara)") if viñ else "")
             + f"; ruido σ≈{es_num(co['ruido_sigma_aprox'], 1)} (en 0-255, incluye textura; compáralo con nuestro render en el mismo analizador).")
    return L, P


# ======================================================================= ficha.md


def tabla(cab: list, filas: list) -> list:
    out = ["| " + " | ".join(cab) + " |", "|" + "|".join("---" for _ in cab) + "|"]
    out += ["| " + " | ".join(str(x) for x in f) + " |" for f in filas]
    return out


def escribir_md(ficha: dict, ruta: str, fps: float, fps_obj: float):
    m = ficha["metadatos"]
    est = ficha["planos"]["estadisticas"]
    def fo(f):
        return int(round(f / fps * fps_obj))
    L = [f"# Ficha de edición · {m['archivo']}", "",
         f"Generada con `analizar.py` v{VERSION} el {ficha['generada']}. Fotogramas nativos (f) a {es_num(fps, 3)} fps "
         f"y convertidos a {es_num(fps_obj, 0)} fps (f@{es_num(fps_obj, 0)}) para Remotion.", ""]
    # resumen
    L.append("## Resumen")
    if est:
        L.append(f"- {est['n']} planos en {es_num(m['duracion_s'], 1)} s · plano medio {es_num(est['media_f'], 1)} f "
                 f"(mediana {es_num(est['mediana_f'], 1)} f; {es_num(est['mediana_f_obj'], 1)} f@{es_num(fps_obj, 0)}) · "
                 f"{es_num(est['cortes_por_s'], 2)} cortes/s.")
        L.append(f"- Planos ≤8 f: {est['planos_hasta_8f']} · planos ≥3 s: {est['planos_3s_o_mas']} · "
                 f"flashes: {sum(1 for e in ficha['flashes_tramos']['eventos'] if e['tipo'] == 'flash')} · "
                 f"tramos lisos: {len(ficha['flashes_tramos']['tramos'])}.")
    au = ficha.get("audio")
    if au and au.get("loudness"):
        lt = au["loudness"]
        s = f"- Audio: {es_num(lt['lufs_integrados'], 1)} LUFS, true peak {es_num(lt['true_peak_dbtp'], 1)} dBTP"
        if au.get("tempo_bpm"):
            c = au["cortes_vs_onsets"]
            s += f", {es_num(au['tempo_bpm'], 0)} BPM; cortes en onset ±{ficha['parametros']['tolerancia_beat_f']:g} f: {es_num(c['pct'], 0)} % (control {es_num(c['control_aleatorio_pct'], 0)} %)"
        L.append(s + ".")
    L.append("")
    # metadatos
    L.append("## 1. Metadatos")
    L += tabla(["campo", "valor"], [
        ["resolución", f"{m['ancho']}×{m['alto']}" + (f" (rotación {m['rotacion_metadatos']}°)" if m["rotacion_metadatos"] else "")],
        ["fps", f"{es_num(m['fps'], 3)} ({m['fps_racional']})" + (" · VFR remuestreado a CFR" if m["vfr"] else "")],
        ["duración", f"{es_num(m['duracion_s'], 3)} s · {ficha['planos']['fotogramas_analizados']} fotogramas analizados"],
        ["vídeo", f"{m['codec_video']} {m['perfil'] or ''} {m['pix_fmt']} · {m['bitrate_video_kbps'] or '—'} kbps"],
        ["audio", (f"{m['audio']['codec']} {m['audio']['frecuencia_hz']} Hz {m['audio']['canales']} canales · {m['audio']['bitrate_kbps'] or '—'} kbps") if m["audio"] else "sin audio"],
        ["contenedor", f"{m['contenedor']} · {m['bitrate_total_kbps'] or '—'} kbps · {es_num(m['tamano_mb'], 2)} MB"],
    ])
    L.append("")
    # planos
    L.append("## 2. Planos")
    if est:
        L += tabla(["medida", "f nativos", f"f@{es_num(fps_obj, 0)}", "s"], [
            ["media", es_num(est["media_f"], 1), es_num(est["media_f_obj"], 1), es_num(est["media_s"], 2)],
            ["mediana", es_num(est["mediana_f"], 1), es_num(est["mediana_f_obj"], 1), es_num(est["mediana_s"], 2)],
            ["p10 / p25", f"{es_num(est['p10_f'], 1)} / {es_num(est['p25_f'], 1)}", f"{fo(est['p10_f'])} / {fo(est['p25_f'])}", ""],
            ["p75 / p90", f"{es_num(est['p75_f'], 1)} / {es_num(est['p90_f'], 1)}", f"{fo(est['p75_f'])} / {fo(est['p90_f'])}", ""],
            ["mín / máx", f"{est['min_f']} / {est['max_f']}", f"{fo(est['min_f'])} / {fo(est['max_f'])}", ""],
            ["planos ≤8 f (a fps objetivo)", est["planos_hasta_8f"], f"{es_num(est['planos_hasta_8f_pct'], 0)} %", ""],
            ["planos ≥3 s", est["planos_3s_o_mas"], f"{es_num(est['tiempo_en_planos_3s_pct'], 0)} % del tiempo", ""],
        ])
    L.append("")
    L.append("Lista de segmentos (el corte de entrada indica cómo empieza):")
    L.append("")
    filas = []
    for s in ficha["planos"]["lista"]:
        mv = s.get("movimiento", {})
        filas.append([s["n"], s["tipo"], s["inicio"], s["fin"] - 1, s["dur_f"], fo(s["fin"]) - fo(s["inicio"]),
                      es_num(s["inicio"] / fps, 2), es_num(s["dur_f"] / fps, 2), s.get("corte_entrada", "—"),
                      mv.get("clase", "—")])
    L += tabla(["#", "tipo", "inicio f", "fin f", "dur f", f"dur f@{es_num(fps_obj, 0)}", "inicio s", "dur s", "entrada", "movimiento"], filas)
    L.append("")
    L.append("## 3. Ritmo por tramos de 5 s")
    L += tabla(["tramo", "cortes", "cortes/s", "plano medio (f)", "onsets/s"],
               [[f"{es_num(r['desde_s'], 0)}-{es_num(r['hasta_s'], 0)} s", r["cortes"], es_num(r["cortes_por_s"], 2),
                 es_num(r["plano_medio_f"], 1) if r["plano_medio_f"] else "—",
                 es_num(r["onsets_por_s"], 1) if r.get("onsets_por_s") is not None else "—"] for r in ficha["ritmo_5s"]])
    L.append("")
    L.append("## 4. Flashes y tramos blancos/negros")
    ft = ficha["flashes_tramos"]
    if ft["eventos"]:
        L += tabla(["tipo", "inicio f", "dur f", "luma pico (0-255)", "subida", "blanco puro", "dónde"],
                   [[e["tipo"], e["inicio"], e["dur_f"], es_num(e["luma_pico"], 0), es_num(e["subida_sobre_entorno"], 0),
                     "sí" if e["blanco_puro"] else "no",
                     f"corte {e['corte_n']}" if e.get("corte_n") else f"dentro del plano #{e.get('plano_n')}"] for e in ft["eventos"]])
    else:
        L.append("Sin flashes.")
    L.append("")
    if ft["tramos"]:
        L += tabla(["tramo", "inicio f", "dur f", "dur s"],
                   [[t["tipo"], t["inicio"], t["dur_f"], es_num(t["dur_f"] / fps, 2)] for t in ft["tramos"]])
    else:
        L.append("Sin tramos lisos (blanco/negro) de 5 f o más.")
    L.append("")
    L.append("## 5. Movimiento de cámara por plano")
    L.append("Zoom en % de escala por segundo (exponencial), paneo como desplazamiento del contenido en px del original "
             "(+x = el contenido va a la derecha, la cámara a la izquierda), temblor = RMS del residuo sobre la tendencia, "
             "curva = ajuste `Easing.bezier(a, 0, 1-b, 1)` al tramo activo.")
    L.append("")
    filas = []
    for s in ficha["planos"]["lista"]:
        mv = s.get("movimiento", {})
        if s["tipo"] != "plano" or not mv.get("medible"):
            continue
        c = mv.get("curva")
        filas.append([s["n"], mv["clase"], es_num(mv["zoom_pct_s"], 2), es_num(mv["zoom_total_pct"], 1),
                      f"{es_num(mv['paneo_desplazamiento_px'][0], 0)}, {es_num(mv['paneo_desplazamiento_px'][1], 0)}",
                      es_num(mv["paneo_px_s"], 0), es_num(mv["rotacion_grados_s"], 2),
                      (f"{es_num(mv['temblor_rms_px'], 1)} / {es_num(mv['temblor_hz'], 1)} Hz" if mv['temblor_rms_px'] >= 0.3 else "—"),
                      (f"{c['tipo']} `bezier({', '.join(f'{x:g}' for x in c['bezier'])})` f{c['desde_f']}-{c['hasta_f']}" if c else "—")])
    L += tabla(["#", "clase", "zoom %/s", "zoom total %", "paneo Δx, Δy px", "paneo px/s", "rot °/s", "temblor px / Hz", "curva"], filas)
    L.append("")
    L.append("## 6. Texto en pantalla (aproximado)")
    tx = ficha["texto"]
    L.append(f"Fotogramas con texto detectado: {es_num(tx['frames_con_texto_pct'], 0)} %. Detección por bordes (no OCR): "
             "confunde texturas finas con texto; úsalo para la posición, no para el contenido.")
    L.append("")
    if tx["zonas"]:
        L += tabla(["zona", "centro y %", "banda y %", "presencia %", "alto caja %", "centro x %", "ancho %", "cambios", "f por cambio"],
                   [[z["zona"], es_num(z["y_centro_pct"], 0), f"{es_num(z['banda_pct'][0], 0)}-{es_num(z['banda_pct'][1], 0)}",
                     es_num(z["presencia_pct"], 0), es_num(z["altura_caja_pct"], 1), es_num(z["x_centro_pct"], 0),
                     es_num(z["ancho_pct"], 0), z["cambios"], es_num(z["f_por_cambio"], 1) if z["f_por_cambio"] else "—"] for z in tx["zonas"]])
    if tx.get("ocr"):
        L.append("")
        L.append("OCR (RapidOCR, cada ~0,1 s en los fotogramas con texto; sin tildes fiables):")
        for o in tx["ocr"][:60]:
            L.append(f"- f{o['desde_f']}-{o['hasta_f']} (plano #{o['plano']}, y≈{es_num(o['y_pct'], 0)} %): «{o['texto']}»")
    L.append("")
    L.append("## 7. Color")
    co = ficha["color"]
    L.append("Paleta global (k-means en Lab): " + " · ".join(f"`{p['hex']}` {es_num(p['pct'], 0)} %" for p in co["paleta_global"]))
    L.append("")
    L.append(f"Saturación media {es_num(co['saturacion_media_pct'], 0)} % · luminancia media {es_num(co['luminancia_media_pct'], 0)} % · "
             f"contraste (σ luma) {es_num(co['contraste_std_luma_pct'], 0)} % · temperatura b* {es_num(co['temperatura_b_lab'], 1)} "
             f"({'cálida' if co['temperatura_b_lab'] > 3 else 'fría' if co['temperatura_b_lab'] < -3 else 'neutra'}) · tinte a* {es_num(co['tinte_a_lab'], 1)}.")
    L.append("")
    L += tabla(["tramo", "paleta", "saturación %", "luminancia %"],
               [[f"{es_num(t['desde_s'], 0)}-{es_num(t['hasta_s'], 0)} s", " ".join(f"`{p['hex']}`" for p in t["paleta"]),
                 es_num(t["saturacion_media"], 0), es_num(t["luminancia_media"], 0)] for t in co["por_tramo_5s"]])
    L.append("")
    L.append("## 8. Audio")
    if not au:
        L.append("Sin pista de audio.")
    else:
        lt = au["loudness"]
        L.append(f"- Loudness (ffmpeg ebur128): **{es_num(lt['lufs_integrados'], 1)} LUFS** integrados, true peak "
                 f"**{es_num(lt['true_peak_dbtp'], 1)} dBTP**, LRA {es_num(lt['rango_lra_lu'], 1)} LU.")
        if au.get("tempo_bpm"):
            L.append(f"- Tempo ≈ {es_num(au['tempo_bpm'], 1)} BPM ({es_num(au['f_por_beat'], 1)} f por beat a fps nativo); "
                     f"{au['onsets_n']} onsets ({es_num(au['onsets_por_s'], 2)}/s).")
            tol = ficha["parametros"]["tolerancia_beat_f"]
            filas = []
            for nom, k in (("todos los onsets", "cortes_vs_onsets"), (f"batería: {au['onsets_bateria_fuente']}", "cortes_vs_bateria"),
                           ("beats (beat_track)", "cortes_vs_beats")):
                a = au[k]
                if a.get("pct") is None:
                    continue
                filas.append([nom, f"{a['aciertos']}/{a['cortes']}", f"{es_num(a['pct'], 0)} %", f"{es_num(a['control_aleatorio_pct'], 0)} %",
                              es_num(a["p_valor"], 3) if a["p_valor"] is not None else "—", a["en_el_fotograma"],
                              es_num(a["desfase_mediano_f_aciertos"], 1) if a["desfase_mediano_f_aciertos"] is not None else "—"])
            L.append("")
            L.append(f"Cortes que caen a ±{tol:g} f de un evento de audio, frente a una línea base de cortes aleatorios (Monte Carlo):")
            L.append("")
            L += tabla(["referencia", "aciertos", "%", "control", "p (binomial)", "en el fotograma", "desfase mediano f"], filas)
        if au.get("silencios"):
            L.append("")
            L.append("- Silencios (≤ " + str(ficha["parametros"]["umbral_silencio_db"]) + " dBFS, ≥0,25 s): " + ", ".join(
                f"{es_num(s['inicio_s'], 2)}–{es_num(s['fin_s'], 2) if s['fin_s'] is not None else 'fin'} s" for s in au["silencios"]))
        for k in ("aviso", "aviso_demucs"):
            if au.get(k):
                L.append(f"- {au[k]}")
    L.append("")
    L.append("## 9. Cómo replicarlo en Remotion")
    L.append("")
    L += ficha["_remotion_md"]
    L.append("")
    L.append("Notas: los nombres de componente son los del kit; comprueba los nombres exactos de sus props en el código. "
             "Las duraciones están en fotogramas al fps objetivo. Valida el resultado con `calco.py` (error ≤4 px).")
    L.append("")
    L.append("## Precisión y avisos")
    L.append("- Cortes: detector propio (histograma HSV + diferencia de píxeles + fallo del ajuste de movimiento). "
             "Los fundidos encadenados largos y los cortes entre planos casi idénticos pueden escaparse.")
    L.append("- Zoom/paneo: flujo óptico Lucas-Kanade + semejanza RANSAC a "
             f"{ficha['parametros']['resolucion_analisis'][0]}×{ficha['parametros']['resolucion_analisis'][1]}. "
             "En planos con sujeto que se mueve mucho sobre fondo liso, mide el sujeto, no la cámara.")
    L.append("- Ver `LEEME.md` para la precisión medida en las pruebas sintéticas.")
    with open(ruta, "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")


# ======================================================================= principal


def ocr_texto(R: dict, segs: list, excl: np.ndarray, fps: float) -> list | None:
    """OCR ligero (RapidOCR) cada ~0,1 s en los fotogramas con texto detectado; une repeticiones."""
    try:
        from rapidocr_onnxruntime import RapidOCR  # type: ignore
    except ImportError:
        return None
    motor = RapidOCR()
    paso = max(1, int(round(fps / 10)))
    out = []
    for f in range(0, R["n"], paso):
        if excl[f] or not R["cajas"][f]:
            continue
        im = cv2.imdecode(R["thumbs"][f], cv2.IMREAD_COLOR)
        im = cv2.resize(im, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
        r, _ = motor(im)
        if not r:
            continue
        txt = " ".join(x[1] for x in r).strip()
        y = float(np.mean([np.mean([p[1] for p in x[0]]) for x in r]) / im.shape[0] * 100)
        plano = next((s["n"] for s in segs if s["inicio"] <= f < s["fin"]), None)
        if out and out[-1]["texto"] == txt:
            out[-1]["hasta_f"] = f
            continue
        out.append({"desde_f": f, "hasta_f": f, "plano": plano, "texto": txt, "y_pct": round(y, 1)})
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description="Ficha de edición medida de un vídeo de referencia.")
    ap.add_argument("video")
    ap.add_argument("--out", help="carpeta de salida (por defecto: <video>_ficha)")
    ap.add_argument("--fps-objetivo", type=float, default=30.0, help="fps de la composición de Remotion (30)")
    ap.add_argument("--lado-analisis", type=int, default=640, help="lado mayor de la resolución de análisis (640)")
    ap.add_argument("--umbral-corte", type=float, default=0.12, help="umbral absoluto de corte (0,12; más bajo = más sensible)")
    ap.add_argument("--detector", choices=["propio", "scenedetect"], default="propio")
    ap.add_argument("--min-plano", type=int, default=2, help="duración mínima de plano en f (2)")
    ap.add_argument("--min-tramo", type=int, default=6, help="f mínimos para que un tramo liso cuente como tramo (6)")
    ap.add_argument("--max-flash", type=int, default=5, help="f máximos de un flash (5)")
    ap.add_argument("--tolerancia-beat", type=float, default=2.0, help="tolerancia corte-onset en f (2)")
    ap.add_argument("--umbral-silencio", type=float, default=-45.0, help="dBFS para silencios (-45)")
    ap.add_argument("--demucs", action="store_true", help="separar batería con demucs (lento; pip install demucs)")
    ap.add_argument("--ocr", action="store_true", help="OCR del fotograma central de cada plano (pip install rapidocr_onnxruntime)")
    ap.add_argument("--sin-audio", action="store_true")
    ap.add_argument("-q", "--silencioso", action="store_true")
    a = ap.parse_args(argv)

    t_ini = time.time()
    meta = probe(a.video)
    fps = meta["fps"]
    fps_obj = a.fps_objetivo
    out = a.out or os.path.splitext(a.video)[0] + "_ficha"
    os.makedirs(out, exist_ok=True)
    log = (lambda *x: None) if a.silencioso else (lambda *x: print(*x, flush=True))
    log(f"[1/5] {meta['archivo']}: {meta['ancho']}×{meta['alto']} {es_num(fps, 3)} fps {es_num(meta['duracion_s'], 2)} s")
    R = pase_video(a.video, meta, a.lado_analisis, verbose=not a.silencioso)
    n = R["n"]
    W = meta["ancho"]
    log(f"[2/5] {n} fotogramas leídos; cortes, flashes y movimiento…")
    tramos, eventos, excl = flashes_y_tramos(R, a.min_tramo, a.max_flash)
    mov_ok = np.array(R["ok"])
    if a.detector == "scenedetect":
        from scenedetect import AdaptiveDetector, detect
        escenas = detect(a.video, AdaptiveDetector())
        cortes = sorted({int(round((s[0].seconds if hasattr(s[0], "seconds") else s[0].get_seconds()) * fps)) for s in escenas[1:]})
    else:
        cortes = detectar_cortes(excl, R["hist"], R["tiny"], mov_ok, umbral=a.umbral_corte,
                                 min_plano=a.min_plano)
    tipos = {c: "duro" for c in cortes}
    # punch-in: salto de escala aislado con ajuste correcto
    ls = np.array([math.log(s) if ok else 0.0 for s, ok in zip(R["s"], R["ok"])])
    saltos = {}
    for k in range(1, n):
        if not R["ok"][k] or excl[k] or excl[k - 1] or abs(ls[k]) < math.log(1.06):
            continue
        vec = np.abs(np.concatenate([ls[max(1, k - 4):k], ls[k + 1:k + 5]]))
        if len(vec) and np.median(vec) < 0.01:
            tipos[k] = "punch-in"
            saltos[k] = (math.exp(ls[k]) - 1) * 100
    for t in tramos:
        for b in (t["inicio"], t["fin"]):
            if 0 < b < n:
                tipos.setdefault(b, "tramo")
    # flashes en corte
    for e in eventos:
        if e["inicio"] in tipos and tipos[e["inicio"]] == "duro":
            tipos[e["inicio"]] = "flash"
    bordes = sorted(tipos)
    lim = [0] + bordes + [n]
    segs = []
    for i in range(len(lim) - 1):
        a0, b0 = lim[i], lim[i + 1]
        if b0 <= a0:
            continue
        tr = next((t for t in tramos if t["inicio"] <= a0 and b0 <= t["fin"]), None)
        segs.append({"n": len(segs) + 1, "inicio": a0, "fin": b0, "dur_f": b0 - a0,
                     "tipo": f"tramo {tr['tipo']}" if tr else "plano",
                     "corte_entrada": tipos.get(a0, "inicio") if a0 else "inicio"})
    # movimiento por plano
    for s in segs:
        if s["tipo"] == "plano":
            s["movimiento"] = movimiento_plano(R, s["inicio"], s["fin"], excl, fps, W)
            cl = s["movimiento"]["clase"]
            s["clase_corta"] = cl
            s["luma_media"] = round(float(np.mean(R["luma"][s["inicio"]:s["fin"]])), 1)
    # cortes con detalle (látigo)
    nit = np.array(R["nitidez"])
    gx, gy = np.array(R["gx"]), np.array(R["gy"])
    lista_cortes = []
    for j, s in enumerate(segs[1:], start=1):
        b = s["inicio"]
        c = {"n": j, "f": b, "s": round(b / fps, 3), "f_obj": int(round(b / fps * fps_obj)), "tipo": tipos.get(b, "duro")}
        if b in saltos:
            c["salto_escala_pct"] = round(saltos[b], 1)
        ref = np.median(nit[max(0, b - 15):min(n, b + 15)])
        ventana = range(max(0, b - 3), min(n, b + 3))
        borrosos = [k for k in ventana if nit[k] < 0.3 * ref and not excl[k]]
        if len(borrosos) >= 2:
            rx = np.mean([gx[k] / max(gy[k], 1e-6) for k in borrosos])
            c["latigo"] = "horizontal" if rx < 0.75 else ("vertical" if rx > 1.33 else "sin dirección clara")
        lista_cortes.append(c)
    for e in eventos:
        e["corte_n"] = next((c["n"] for c in lista_cortes if abs(c["f"] - e["inicio"]) <= 1), None)
        e["plano_n"] = next((s["n"] for s in segs if s["inicio"] <= e["inicio"] < s["fin"]), None)
    planos = [s for s in segs if s["tipo"] == "plano"]
    est = estad([s["dur_f"] for s in planos], fps, fps_obj)
    dur = n / fps

    log("[3/5] texto y color…")
    texto = zonas_texto(R, excl, fps)
    if a.ocr:
        o = ocr_texto(R, segs, excl, fps)
        texto["ocr"] = o if o is not None else []
        if o is None:
            texto["aviso_ocr"] = "OCR no disponible: pip install rapidocr_onnxruntime"
    color = analisis_color(R, excl, fps, dur)

    log("[4/5] audio…")
    audio = None
    if not a.sin_audio:
        with tempfile.TemporaryDirectory() as tmp:
            audio = analizar_audio(a.video, meta, fps, [c["s"] for c in lista_cortes], a.tolerancia_beat,
                                   a.demucs, tmp, a.umbral_silencio)
    ritmo = []
    for t0 in np.arange(0, dur, 5.0):
        t1 = min(dur, t0 + 5)
        cs = [c for c in lista_cortes if t0 <= c["s"] < t1]
        ps = [s["dur_f"] for s in planos if t0 <= s["inicio"] / fps < t1]
        r = {"desde_s": round(float(t0), 2), "hasta_s": round(float(t1), 2), "cortes": len(cs),
             "cortes_por_s": round(len(cs) / max(t1 - t0, 1e-6), 2),
             "plano_medio_f": round(float(np.mean(ps)), 1) if ps else None}
        if audio and audio.get("onsets_s") is not None:
            r["onsets_por_s"] = round(sum(1 for x in audio["onsets_s"] if t0 <= x < t1) / max(t1 - t0, 1e-6), 2)
        ritmo.append(r)

    ficha = {
        "version": VERSION, "generada": time.strftime("%Y-%m-%d %H:%M"),
        "parametros": {"fps_objetivo": fps_obj, "resolucion_analisis": R["tam_analisis"], "detector": a.detector,
                       "umbral_corte": a.umbral_corte, "tolerancia_beat_f": a.tolerancia_beat,
                       "umbral_silencio_db": a.umbral_silencio, "min_tramo_f": a.min_tramo, "max_flash_f": a.max_flash},
        "metadatos": meta,
        "planos": {"fotogramas_analizados": n, "estadisticas": est, "cortes": lista_cortes,
                   "lista": [{k: v for k, v in s.items() if k != "clase_corta"} for s in segs]},
        "ritmo_5s": ritmo,
        "flashes_tramos": {"eventos": eventos, "tramos": tramos,
                           "luma_por_fotograma": [round(x, 1) for x in R["luma"]]},
        "texto": texto, "color": color, "audio": audio,
    }
    md_rem, plan = plan_remotion(ficha, fps, fps_obj)
    ficha["remotion"] = plan
    ficha["_remotion_md"] = md_rem
    log("[5/5] escribiendo ficha, hoja de contactos y gráfica…")
    escribir_md(ficha, os.path.join(out, "ficha.md"), fps, fps_obj)
    contact_sheet(R, segs, fps, fps_obj, os.path.join(out, "contact_sheet.png"), meta["archivo"])
    grafica_ritmo(segs, eventos, audio, fps, dur, os.path.join(out, "ritmo.png"))
    ficha.pop("_remotion_md")
    if audio:
        audio.pop("_env", None)
    with open(os.path.join(out, "ficha.json"), "w", encoding="utf-8") as f:
        json.dump(ficha, f, ensure_ascii=False, indent=1, default=lambda o: o.item() if hasattr(o, "item") else str(o))
    log(f"Listo en {time.time() - t_ini:.0f} s → {out}")
    return ficha


if __name__ == "__main__":
    main()
