"""Funciones compartidas por analizar.py y calco.py.

- probe(): metadatos con ffprobe.
- leer_fotogramas(): decodifica con ffmpeg a una rejilla de fps constante (BGR, tamaño reducido).
- movimiento_entre(): transformación de semejanza (escala, rotación, traslación) entre dos fotogramas
  con flujo óptico Lucas-Kanade + RANSAC.
- detectar_cortes(): cortes a partir de histogramas HSV, diferencia de píxeles y fallo del ajuste de movimiento.
"""
from __future__ import annotations

import json
import math
import os
import shutil
import subprocess
from fractions import Fraction

import cv2
import numpy as np

# ---------------------------------------------------------------- utilidades


def binario(nombre: str) -> str:
    """Ruta a ffmpeg / ffprobe (permite FFMPEG / FFPROBE en el entorno)."""
    env = os.environ.get(nombre.upper())
    if env:
        return env
    ruta = shutil.which(nombre)
    if not ruta:
        raise SystemExit(f"No encuentro {nombre}. Instálalo y ponlo en el PATH (ver LEEME.md).")
    return ruta


def es_num(x: float, dec: int = 1) -> str:
    """Número con coma decimal (es-ES)."""
    if x is None or (isinstance(x, float) and (math.isnan(x) or math.isinf(x))):
        return "—"
    if round(x, dec) == 0:
        x = 0.0
    s = f"{x:,.{dec}f}"
    return s.replace(",", " ").replace(".", ",").replace(" ", ".")


def frac(s: str | None) -> float:
    if not s or s in ("0/0", "N/A"):
        return 0.0
    try:
        return float(Fraction(s))
    except (ValueError, ZeroDivisionError):
        return 0.0


# ---------------------------------------------------------------- metadatos


def probe(ruta: str) -> dict:
    cmd = [binario("ffprobe"), "-v", "error", "-print_format", "json",
           "-show_format", "-show_streams", ruta]
    out = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout
    d = json.loads(out)
    v = next((s for s in d["streams"] if s.get("codec_type") == "video"), None)
    a = next((s for s in d["streams"] if s.get("codec_type") == "audio"), None)
    if v is None:
        raise SystemExit("El archivo no tiene pista de vídeo.")
    fmt = d.get("format", {})
    w, h = int(v["width"]), int(v["height"])
    rot = 0
    for sd in v.get("side_data_list", []) or []:
        if "rotation" in sd:
            rot = int(round(float(sd["rotation"])))
    if "rotate" in (v.get("tags") or {}):
        rot = int(v["tags"]["rotate"])
    if abs(rot) % 180 == 90:  # ffmpeg autorrota al decodificar
        w, h = h, w
    r = frac(v.get("r_frame_rate"))
    avg = frac(v.get("avg_frame_rate"))
    fps_str = v.get("avg_frame_rate") if avg > 0 else v.get("r_frame_rate")
    vfr = bool(r and avg and abs(r - avg) / max(r, avg) > 0.01)
    if vfr:
        # rejilla CFR a la cadencia nominal (redondeada a valores típicos)
        objetivo = min([24, 25, 30, 50, 60], key=lambda x: abs(x - avg))
        fps_str = str(objetivo)
    dur = float(fmt.get("duration") or v.get("duration") or 0)
    meta = {
        "archivo": os.path.basename(ruta),
        "ancho": w, "alto": h, "rotacion_metadatos": rot,
        "fps": round(frac(fps_str), 4), "fps_racional": fps_str,
        "fps_r": round(r, 4), "fps_medio": round(avg, 4), "vfr": vfr,
        "duracion_s": round(dur, 3),
        "nb_frames": int(v["nb_frames"]) if str(v.get("nb_frames", "")).isdigit() else None,
        "codec_video": v.get("codec_name"), "perfil": v.get("profile"),
        "pix_fmt": v.get("pix_fmt"),
        "bitrate_video_kbps": round(int(v["bit_rate"]) / 1000) if str(v.get("bit_rate", "")).isdigit() else None,
        "bitrate_total_kbps": round(int(fmt["bit_rate"]) / 1000) if str(fmt.get("bit_rate", "")).isdigit() else None,
        "contenedor": fmt.get("format_name"),
        "tamano_mb": round(int(fmt.get("size", 0)) / 1e6, 2),
        "audio": None,
    }
    if a is not None:
        meta["audio"] = {
            "codec": a.get("codec_name"),
            "frecuencia_hz": int(a.get("sample_rate", 0) or 0),
            "canales": a.get("channels"),
            "bitrate_kbps": round(int(a["bit_rate"]) / 1000) if str(a.get("bit_rate", "")).isdigit() else None,
        }
    return meta


# ---------------------------------------------------------------- decodificación


def tam_analisis(w: int, h: int, lado_max: int) -> tuple[int, int, float]:
    esc = min(1.0, lado_max / max(w, h))
    aw = max(2, int(round(w * esc / 2)) * 2)
    ah = max(2, int(round(h * esc / 2)) * 2)
    return aw, ah, aw / w


def leer_fotogramas(ruta: str, fps_racional: str, ancho: int, alto: int,
                    desde_s: float | None = None, dur_s: float | None = None):
    """Generador de fotogramas BGR uint8 (alto, ancho, 3) en rejilla de fps constante."""
    cmd = [binario("ffmpeg"), "-v", "error", "-nostdin"]
    if desde_s:
        cmd += ["-ss", f"{desde_s:.4f}"]
    cmd += ["-i", ruta]
    if dur_s:
        cmd += ["-t", f"{dur_s:.4f}"]
    cmd += ["-an", "-sn", "-vf", f"fps={fps_racional},scale={ancho}:{alto}:flags=area",
            "-f", "rawvideo", "-pix_fmt", "bgr24", "-"]
    import tempfile
    err = tempfile.TemporaryFile()
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=err)
    n = ancho * alto * 3
    leidos = 0
    completo = False
    try:
        while True:
            buf = p.stdout.read(n)
            if len(buf) < n:
                completo = True
                break
            leidos += 1
            yield np.frombuffer(buf, np.uint8).reshape(alto, ancho, 3)
    finally:
        if not completo:
            p.kill()  # cierre anticipado: evita el aviso de "Broken pipe" de ffmpeg
        p.stdout.close()
        p.wait()
        if leidos == 0 and completo:
            err.seek(0)
            msg = err.read().decode("utf-8", "replace").strip()
            err.close()
            raise RuntimeError(f"ffmpeg no devolvió fotogramas de {ruta}: {msg[-500:]}")
        err.close()


# ---------------------------------------------------------------- movimiento


def puntos(gray: np.ndarray, maximo: int = 500) -> np.ndarray | None:
    h, w = gray.shape
    md = max(4, int(min(w, h) / 45))
    p = cv2.goodFeaturesToTrack(gray, maxCorners=maximo, qualityLevel=0.01, minDistance=md, blockSize=5)
    return p


def movimiento_entre(g0: np.ndarray, g1: np.ndarray, p0: np.ndarray | None = None) -> dict:
    """Semejanza que lleva g0 -> g1. Devuelve escala, rotación (grados), traslación del centro (px)
    y calidad del ajuste. Si falla, ok=False."""
    h, w = g0.shape
    res = {"ok": False, "s": 1.0, "rot": 0.0, "dx": 0.0, "dy": 0.0, "inliers": 0.0, "n": 0, "M": None}
    if p0 is None:
        p0 = puntos(g0)
    if p0 is None or len(p0) < 12:
        return res
    lk = dict(winSize=(21, 21), maxLevel=4,
              criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01))
    p1, st, _ = cv2.calcOpticalFlowPyrLK(g0, g1, p0, None, **lk)
    if p1 is None:
        return res
    pb, st2, _ = cv2.calcOpticalFlowPyrLK(g1, g0, p1, None, **lk)
    fb = np.linalg.norm((p0 - pb).reshape(-1, 2), axis=1)
    bueno = (st.ravel() == 1) & (st2.ravel() == 1) & (fb < 0.7)
    a, b = p0.reshape(-1, 2)[bueno], p1.reshape(-1, 2)[bueno]
    res["n"] = int(len(p0))
    if len(a) < 10:
        return res
    M, inl = cv2.estimateAffinePartial2D(a, b, method=cv2.RANSAC, ransacReprojThreshold=1.0,
                                         maxIters=2000, confidence=0.995, refineIters=10)
    if M is None:
        return res
    ninl = int(inl.sum())
    s = float(math.hypot(M[0, 0], M[1, 0]))
    rot = math.degrees(math.atan2(M[1, 0], M[0, 0]))
    c = np.array([w / 2, h / 2])
    c2 = M[:, :2] @ c + M[:, 2]
    res.update(ok=ninl >= 10 and ninl / len(p0) > 0.15, s=s, rot=rot,
               dx=float(c2[0] - c[0]), dy=float(c2[1] - c[1]),
               inliers=ninl / len(p0), M=M)
    return res


def error_px_transformacion(M: np.ndarray, w: int, h: int) -> float:
    """Desplazamiento medio (px) de las 4 esquinas y el centro bajo M respecto a la identidad."""
    pts = np.array([[0, 0], [w, 0], [0, h], [w, h], [w / 2, h / 2]], float)
    q = pts @ M[:, :2].T + M[:, 2]
    return float(np.linalg.norm(q - pts, axis=1).mean())


# ---------------------------------------------------------------- rasgos por fotograma


def histograma_hsv(bgr_peq: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(bgr_peq, cv2.COLOR_BGR2HSV)
    hs = [cv2.calcHist([hsv], [0], None, [16], [0, 180]).ravel(),
          cv2.calcHist([hsv], [1], None, [8], [0, 256]).ravel(),
          cv2.calcHist([hsv], [2], None, [8], [0, 256]).ravel()]
    return np.concatenate([x / max(1.0, x.sum()) for x in hs]).astype(np.float32)


def dist_hist(h0: np.ndarray, h1: np.ndarray) -> float:
    # variación total media de los tres canales (0..1)
    return float(0.5 * np.abs(h0 - h1).sum() / 3.0)


def dist_pix(t0: np.ndarray, t1: np.ndarray) -> float:
    return float(np.abs(t0.astype(np.int16) - t1.astype(np.int16)).mean() / 255.0)


def es_uniforme(bgr: np.ndarray) -> tuple[bool, float]:
    """¿Fotograma casi liso? Cada canal B, G, R con ≥92 % de píxeles a ±12 de su mediana
    (admite texto encima de un fondo liso; rechaza degradados). Devuelve (liso, mediana de luma)."""
    liso = True
    for c in range(3):
        ch = bgr[..., c]
        m = float(np.median(ch))
        if (np.abs(ch.astype(np.int16) - m) <= 12).mean() < 0.92:
            liso = False
            break
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    return liso, float(np.median(gray))


# ---------------------------------------------------------------- cortes


def detectar_cortes(excluidos: np.ndarray, hist: list, tiny: list,
                    mov_ok: np.ndarray, umbral: float = 0.12, ratio: float = 3.0,
                    ventana: int = 10, min_plano: int = 2) -> list[int]:
    """Devuelve lista de fotogramas donde empieza un plano nuevo (sin incluir el 0).

    Compara fotogramas válidos consecutivos (saltando los excluidos: flashes y tramos lisos).
    Un corte exige puntuación alta en términos absolutos y relativos a su entorno, y además que
    el ajuste de movimiento haya fallado o que el histograma cambie mucho (protege contra
    paneos y zooms rápidos que mantienen la paleta).
    """
    n = len(hist)
    validos = [i for i in range(n) if not excluidos[i]]
    score = {}
    for a, b in zip(validos, validos[1:]):
        dh = dist_hist(hist[a], hist[b])
        dp = dist_pix(tiny[a], tiny[b])
        score[b] = (dh + dp, dh, dp, a)
    claves = sorted(score)
    vals = np.array([score[k][0] for k in claves]) if claves else np.array([])
    cortes = []
    for idx, k in enumerate(claves):
        sc, dh, dp, a = score[k]
        lo, hi = max(0, idx - ventana), min(len(vals), idx + ventana + 1)
        vecinos = np.concatenate([vals[lo:max(lo, idx - 1)], vals[min(hi, idx + 2):hi]])
        base = float(np.median(vecinos)) if len(vecinos) else 0.0
        salto = (k - a) > 1  # hubo fotogramas excluidos en medio
        movimiento_fallo = not mov_ok[k] if not salto else True
        if sc < umbral:
            continue
        if not salto and sc < ratio * max(base, 0.01):
            continue
        if not (movimiento_fallo or dh > 0.35):
            continue
        # posición del corte: si hay un hueco de excluidos, el corte va al primer excluido
        pos = a + 1 if salto else k
        if cortes and pos - cortes[-1] < min_plano:
            continue
        if pos < min_plano:
            continue
        cortes.append(pos)
    return cortes
