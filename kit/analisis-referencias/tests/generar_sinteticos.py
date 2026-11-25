#!/usr/bin/env python3
"""Genera vídeos sintéticos con verdad conocida para probar analizar.py y calco.py.

    python tests/generar_sinteticos.py [--out tests/salida]

Crea:
  v1_movimiento.mp4  540×960 30 fps 12 s: cortes en fotogramas dados, punch-in, 3 planos ≤8 f,
                     zoom exponencial 2 %/s, flash blanco de 3 f en un corte, paneo con
                     bezier(0.83,0,0.17,1), temblor, tramo negro de 10 f, subtítulos palabra a palabra
                     cada 8 f a y=72 %, destello parcial dentro de plano; audio: clics a 120 BPM
                     (cada 15 f) con 1 s de silencio.
  v2_ffmpeg25.mp4    720×1280 25 fps hecho solo con filtros de ffmpeg (testsrc2, smptebars, flash
                     blanco de 3 f, rgbtestsrc, gradients, testsrc) y clics con aevalsrc.
  c_ref.mp4, c_ok.mp4, c_mal.mp4, c_otra_textura.mp4: 1080×1920 30 fps 2 s para calco.py.
  verdad.json        toda la verdad conocida.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import subprocess
import wave

import cv2
import numpy as np

FFMPEG = os.environ.get("FFMPEG", "ffmpeg")


# --------------------------------------------------------------------- utilidades


def bezier_prog(x: float, a: float = 0.83, b: float = 0.83) -> float:
    u = np.linspace(0, 1, 2000)
    x1, x2 = a, 1 - b
    bx = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3
    by = 3 * (1 - u) * u ** 2 + u ** 3
    return float(np.interp(x, bx, by))


def textura(seed: int, w: int, h: int) -> np.ndarray:
    """Lienzo con formas de colores (esquinas que seguir) y una paleta propia por semilla."""
    rng = np.random.default_rng(seed)
    hue = rng.uniform(0, 180)
    base = np.zeros((h, w, 3), np.uint8)
    fondo = cv2.cvtColor(np.uint8([[[hue, rng.uniform(60, 200), rng.uniform(60, 200)]]]), cv2.COLOR_HSV2BGR)[0, 0]
    base[:] = fondo
    for _ in range(int(w * h / 2500)):
        hh = (hue + rng.normal(0, 25)) % 180
        col = cv2.cvtColor(np.uint8([[[hh, rng.uniform(40, 255), rng.uniform(30, 255)]]]), cv2.COLOR_HSV2BGR)[0, 0]
        col = tuple(int(c) for c in col)
        t = rng.integers(0, 3)
        x, y = int(rng.uniform(0, w)), int(rng.uniform(0, h))
        r = int(rng.uniform(6, 40))
        if t == 0:
            cv2.rectangle(base, (x, y), (x + r, y + int(rng.uniform(6, 40))), col, -1)
        elif t == 1:
            cv2.circle(base, (x, y), r // 2 + 2, col, -1, cv2.LINE_AA)
        else:
            cv2.line(base, (x, y), (x + int(rng.normal(0, 40)), y + int(rng.normal(0, 40))), col, 2, cv2.LINE_AA)
    ruido = rng.normal(0, 6, base.shape)
    return np.clip(base.astype(float) + ruido, 0, 255).astype(np.uint8)


def matriz_camara(W, H, cx, cy, s, rot_deg=0.0):
    """Matriz (2x3) píxel de pantalla -> lienzo. Cámara centrada en (cx, cy) del lienzo, escala s."""
    th = math.radians(rot_deg)
    A = np.array([[math.cos(th), math.sin(th)], [-math.sin(th), math.cos(th)]]) / s
    b = np.array([cx, cy]) - A @ np.array([W / 2, H / 2])
    return np.hstack([A, b[:, None]])


def render(lienzo, W, H, cx, cy, s, rot=0.0):
    M = matriz_camara(W, H, cx, cy, s, rot)
    return cv2.warpAffine(lienzo, M, (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP,
                          borderMode=cv2.BORDER_REFLECT)


def codificar(frames_iter, W, H, fps, wav, ruta, crf=24):
    cmd = [FFMPEG, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
           "-r", str(fps), "-i", "-"]
    if wav:
        cmd += ["-i", wav, "-c:a", "aac", "-b:a", "128k", "-shortest"]
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", str(crf), "-pix_fmt", "yuv420p", ruta]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for fr in frames_iter:
        p.stdin.write(np.ascontiguousarray(fr).tobytes())
    p.stdin.close()
    if p.wait():
        raise SystemExit("ffmpeg falló")


def escribir_wav(ruta, y, sr):
    y = np.clip(y, -1, 1)
    st = np.stack([y, y], 1)
    with wave.open(ruta, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((st * 32767).astype("<i2").tobytes())


# --------------------------------------------------------------------- v1


def generar_v1(out: str) -> dict:
    W, H, fps, N = 540, 960, 30, 360
    LW, LH = 1400, 2200
    lienzos = {k: textura(k * 11 + 3, LW, LH) for k in range(1, 9)}
    cortes = [25, 45, 53, 60, 150, 156, 240, 280, 290]
    flash = (156, 159)
    negro = (280, 290)
    palabras = ["ESTO", "ES", "UNA", "PRUEBA", "DE", "SUBTITULOS", "PALABRA", "A", "PALABRA"]
    pan_ini, pan_fin, pan_px = 166, 226, 240.0   # el contenido se desplaza 240 px a la izquierda
    rng = np.random.default_rng(5)
    fases = rng.uniform(0, 2 * np.pi, 4)
    temblor = {}

    def frame(f):
        if negro[0] <= f < negro[1]:
            return np.zeros((H, W, 3), np.uint8)
        if flash[0] <= f < flash[1]:
            return np.full((H, W, 3), 255, np.uint8)
        cx, cy = LW / 2, LH / 2
        if f < 25:
            img = render(lienzos[1], W, H, cx, cy, 1.0)
        elif f < 45:
            img = render(lienzos[1], W, H, cx, cy, 1.2)           # punch-in +20 %
        elif f < 53:
            img = render(lienzos[2], W, H, cx, cy, 1.0)
        elif f < 60:
            img = render(lienzos[3], W, H, cx, cy, 1.0)
        elif f < 150:
            t = (f - 60) / fps
            img = render(lienzos[4], W, H, cx, cy, 1.02 ** t)    # zoom exponencial 2 %/s
        elif f < 156:
            img = render(lienzos[5], W, H, cx, cy, 1.0)
        elif f < 240:
            p = 0.0 if f <= pan_ini else (1.0 if f >= pan_fin else bezier_prog((f - pan_ini) / (pan_fin - pan_ini)))
            img = render(lienzos[6], W, H, cx + pan_px * p, cy, 1.0)
        elif f < 280:
            t = (f - 240) / fps
            sx = 5 * math.sin(2 * math.pi * 6 * t + fases[0]) + 3 * math.sin(2 * math.pi * 9 * t + fases[1])
            sy = 5 * math.sin(2 * math.pi * 6 * t + fases[2]) + 3 * math.sin(2 * math.pi * 9 * t + fases[3])
            temblor[f] = (sx, sy)
            img = render(lienzos[7], W, H, cx - sx, cy - sy, 1.0)
        else:
            img = render(lienzos[8], W, H, cx, cy, 1.0)
            k = (f - 290) // 8
            if k < len(palabras):
                txt = palabras[k]
                fs = 1.6
                (tw, th), _ = cv2.getTextSize(txt, cv2.FONT_HERSHEY_DUPLEX, fs, 4)
                org = (W // 2 - tw // 2, int(0.72 * H + th / 2))
                cv2.putText(img, txt, org, cv2.FONT_HERSHEY_DUPLEX, fs, (0, 0, 0), 10, cv2.LINE_AA)
                cv2.putText(img, txt, org, cv2.FONT_HERSHEY_DUPLEX, fs, (255, 255, 255), 4, cv2.LINE_AA)
            if 320 <= f < 322:   # destello parcial dentro del plano
                img = cv2.addWeighted(img, 0.4, np.full_like(img, 255), 0.6, 0)
        return img

    # audio: clics cada 0,5 s (120 BPM) + bajo de 110 Hz; silencio total de 7,0 a 8,0 s
    sr = 48000
    dur = N / fps
    t = np.arange(int(dur * sr)) / sr
    y = 0.05 * np.sin(2 * np.pi * 110 * t)
    clics = [k * 0.5 for k in range(int(dur / 0.5) + 1) if not (7.0 <= k * 0.5 < 8.0) and k * 0.5 < dur - 0.05]
    for c in clics:
        i0 = int(c * sr)
        n = int(0.06 * sr)
        tt = np.arange(n) / sr
        seg = 0.8 * np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 90)
        y[i0:i0 + n] += seg[:len(y) - i0]
    y[int(7.0 * sr):int(8.0 * sr)] = 0.0
    wav = os.path.join(out, "v1.wav")
    escribir_wav(wav, y, sr)
    ruta = os.path.join(out, "v1_movimiento.mp4")
    codificar((frame(f) for f in range(N)), W, H, fps, wav, ruta, crf=26)
    sx = np.array([v[0] for v in temblor.values()])
    sy = np.array([v[1] for v in temblor.values()])
    # el temblor medido es el residuo sobre la tendencia; con senos puros el RMS es el de la señal
    rms = float(np.sqrt(np.mean((sx - sx.mean()) ** 2 + (sy - sy.mean()) ** 2)))
    try:
        import pyloudnorm as pyln
        lufs = float(pyln.Meter(sr).integrated_loudness(np.stack([y, y], 1)))
    except ImportError:
        lufs = None
    os.remove(wav)
    return {
        "archivo": "v1_movimiento.mp4", "fps": fps, "n": N, "ancho": W, "alto": H,
        "cortes": cortes, "tipos": {"25": "punch-in", "156": "flash", "280": "tramo", "290": "tramo"},
        "planos_dur_f": [25, 20, 8, 7, 90, 6, 84, 40, 70],
        "punch_in_pct": 20.0,
        "flash": {"inicio": 156, "dur_f": 3, "corte": 156},
        "destello_parcial": {"inicio": 320, "dur_f": 2},
        "tramo_negro": {"inicio": 280, "dur_f": 10},
        "zoom": {"plano": [60, 150], "pct_s": 2.0},
        "paneo": {"plano": [156, 240], "contenido_dx_px": -pan_px, "desde": pan_ini, "hasta": pan_fin,
                  "bezier": [0.83, 0, 0.17, 1]},
        "temblor": {"plano": [240, 280], "rms_px": round(rms, 2), "hz": 6.0},
        "texto": {"y_centro_pct": 72.0, "f_por_palabra": 8, "plano": [290, 360]},
        "audio": {"clics_s": clics, "tempo": 120, "silencio": [7.0, 8.0], "lufs_pyloudnorm": lufs},
        "cortes_en_clic_2f": sum(1 for c in cortes if min(abs(c / fps - k) for k in clics) * fps <= 2 + 1e-9),
    }


# --------------------------------------------------------------------- v2 (solo ffmpeg)


def generar_v2(out: str) -> dict:
    fps, W, H = 25, 720, 1280
    segs = [("testsrc2", "", 50), ("smptebars", "", 25), ("mandelbrot", "", 30), ("color", "c=white", 3),
            ("rgbtestsrc", "", 50), ("gradients", "speed=0.02", 50), ("testsrc", "", 25)]
    entradas, filtros = [], []
    for i, (nombre, opts, n) in enumerate(segs):
        extra = (":" + opts) if opts else ""
        entradas += ["-f", "lavfi", "-t", f"{n / fps + 0.2:.4f}", "-i", f"{nombre}=s={W}x{H}:r={fps}{extra}"]
        filtros.append(f"[{i}:v]format=yuv420p,setsar=1,trim=end_frame={n},setpts=PTS-STARTPTS[v{i}]")
        clics_s = [1.0, 2.0, 4.2, 5.0, 6.32]
    expr = "0.06*sin(2*PI*220*t)" + "".join(
        f"+0.8*sin(2*PI*2000*(t-{c}))*exp(-abs(t-{c})*120)*gte(t,{c})" for c in clics_s)
    dur = sum(s[2] for s in segs) / fps
    entradas += ["-f", "lavfi", "-i", f"aevalsrc='{expr}':s=48000:d={dur}"]
    filtro = ";".join(filtros) + ";" + "".join(f"[v{i}]" for i in range(len(segs))) + \
        f"concat=n={len(segs)}:v=1:a=0[v]"
    ruta = os.path.join(out, "v2_ffmpeg25.mp4")
    cmd = [FFMPEG, "-v", "error", "-y", *entradas, "-filter_complex", filtro, "-map", "[v]",
           "-map", f"{len(segs)}:a", "-c:v", "libx264", "-crf", "28", "-preset", "medium", "-r", str(fps),
           "-c:a", "aac", "-b:a", "96k", "-shortest", ruta]
    subprocess.run(cmd, check=True)
    cortes = [50, 75, 105, 158, 208]   # el flash 105-107 enmascara el corte (convención: corte al inicio del flash)
    return {"archivo": "v2_ffmpeg25.mp4", "fps": fps, "n": sum(s[2] for s in segs), "ancho": W, "alto": H,
            "cortes": cortes, "flash": {"inicio": 105, "dur_f": 3},
            "planos_dur_f": [50, 25, 30, 53, 50, 25],
            "audio": {"clics_s": clics_s},
            "cortes_en_clic_2f": sum(1 for c in cortes if min(abs(c / fps - k) for k in clics_s) * fps <= 2 + 1e-9)}


# --------------------------------------------------------------------- calco


def generar_calco(out: str) -> dict:
    W, H, fps, N = 1080, 1920, 30, 60
    LW, LH = 2600, 3800
    lienzo = textura(101, LW, LH)
    otro = textura(202, LW, LH)

    def cam(f, retraso=0.0):
        t = (f - retraso) / fps
        p = bezier_prog(min(1, max(0, (f - retraso) / (N - 1))), 0.6, 0.8)
        return LW / 2 + 180 * p, LH / 2 - 60 * p, 1.05 * 1.018 ** t

    variantes = {
        "c_ref.mp4": dict(l=lienzo, off=(0, 0), ds=1.0, retraso=0.0),
        "c_ok.mp4": dict(l=lienzo, off=(2.0, -1.0), ds=1.002, retraso=0.0),      # casi igual
        "c_mal.mp4": dict(l=lienzo, off=(4.0, 2.5), ds=1.003, retraso=1.0),      # fuera de tolerancia (≈5-8 px)
        "c_otra_textura.mp4": dict(l=otro, off=(0, 0), ds=1.0, retraso=0.0),     # misma cámara, otra imagen
    }
    verdad = {}
    for nombre, v in variantes.items():
        errs = []

        def frames():
            for f in range(N):
                cx, cy, s = cam(f, v["retraso"])
                # desplazar el contenido en pantalla 'off' px = mover la cámara -off/s en el lienzo
                yield render(v["l"], W, H, cx - v["off"][0] / (s * v["ds"]), cy - v["off"][1] / (s * v["ds"]), s * v["ds"])
        codificar(frames(), W, H, fps, None, os.path.join(out, nombre), crf=20)
        # error verdadero respecto a la referencia: M = T_var ∘ T_ref^{-1} (pantalla ref -> pantalla var)
        for f in range(N):
            cx, cy, s = cam(f)
            Mr = np.vstack([matriz_camara(W, H, cx, cy, s), [0, 0, 1]])           # pantalla -> lienzo
            cx2, cy2, s2 = cam(f, v["retraso"])
            s2 *= v["ds"]
            Mv = np.vstack([matriz_camara(W, H, cx2 - v["off"][0] / s2, cy2 - v["off"][1] / s2, s2), [0, 0, 1]])
            M = (np.linalg.inv(Mv) @ Mr)[:2]
            pts = np.array([[0, 0], [W, 0], [0, H], [W, H], [W / 2, H / 2]], float)
            q = pts @ M[:, :2].T + M[:, 2]
            errs.append(float(np.linalg.norm(q - pts, axis=1).mean()))
        verdad[nombre] = {"error_medio_px": round(float(np.mean(errs)), 2), "error_max_px": round(float(np.max(errs)), 2),
                          "error_por_fotograma": [round(e, 3) for e in errs]}
    return {"ancho": W, "alto": H, "fps": fps, "n": N, "variantes": verdad}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "salida"))
    ap.add_argument("--sin-calco", action="store_true")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    verdad = {"v1": generar_v1(a.out), "v2": generar_v2(a.out)}
    # v1 con 3 fotogramas extra al principio: para probar la alineación por corte de calco.py
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", os.path.join(a.out, "v1_movimiento.mp4"), "-vf",
                    "tpad=start=3:start_mode=clone", "-c:v", "libx264", "-crf", "23", "-an",
                    os.path.join(a.out, "v1_desfase3.mp4")], check=True)
    verdad["v1_desfase3"] = {"offset_f": 3}
    if not a.sin_calco:
        verdad["calco"] = generar_calco(a.out)
    with open(os.path.join(a.out, "verdad.json"), "w", encoding="utf-8") as f:
        json.dump(verdad, f, ensure_ascii=False, indent=1)
    print(json.dumps({k: v.get("cortes", v.get("variantes")) for k, v in verdad.items()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
