#!/usr/bin/env python3
"""Prueba analizar.py y calco.py contra vídeos sintéticos con verdad conocida.

    python tests/probar.py            # genera los vídeos si faltan, analiza y compara
    python tests/probar.py --regenerar

Imprime cada comprobación con el valor medido, el verdadero y el error; sale con código 1 si alguna falla.
"""
from __future__ import annotations

import argparse
import contextlib
import io
import json
import os
import subprocess
import sys

import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, RAIZ)
import analizar  # noqa: E402
import calco  # noqa: E402

SAL = os.path.join(AQUI, "salida")
res = []


def check(nombre, medido, verdad, tol, unidad=""):
    if isinstance(verdad, (list, tuple, set)) or isinstance(medido, (list, tuple, set)):
        ok = medido == verdad
        err = "idéntico" if ok else f"medido {medido}"
    else:
        e = None if medido is None else abs(medido - verdad)
        ok = e is not None and e <= tol
        err = "—" if e is None else f"{e:.3g} {unidad}".strip()
    res.append(ok)
    print(f"[{'OK ' if ok else 'MAL'}] {nombre:<52} medido={medido!s:<14.14} verdad={verdad!s:<14.14} error={err}")


def plano_que_empieza(ficha, f):
    return next((s for s in ficha["planos"]["lista"] if s["inicio"] == f), None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--regenerar", action="store_true")
    a = ap.parse_args()
    if a.regenerar or not os.path.exists(os.path.join(SAL, "verdad.json")):
        subprocess.run([sys.executable, os.path.join(AQUI, "generar_sinteticos.py"), "--out", SAL], check=True)
    V = json.load(open(os.path.join(SAL, "verdad.json"), encoding="utf-8"))

    # ------------------------------------------------------------ v1
    v = V["v1"]
    print("\n== v1_movimiento.mp4 (540×960, 30 fps)")
    with contextlib.redirect_stdout(io.StringIO()):
        F = analizar.main([os.path.join(SAL, v["archivo"]), "--out", os.path.join(SAL, "ficha_v1"), "-q"])
    cortes = [c["f"] for c in F["planos"]["cortes"]]
    check("cortes (fotogramas exactos)", cortes, v["cortes"], 0)
    planos = [s["dur_f"] for s in F["planos"]["lista"] if s["tipo"] == "plano"]
    check("duraciones de plano (f)", planos, v["planos_dur_f"], 0)
    check("planos ≤8 f", F["planos"]["estadisticas"]["planos_hasta_8f"], 3, 0)
    check("planos ≥3 s", F["planos"]["estadisticas"]["planos_3s_o_mas"], 1, 0)
    pi = next((c for c in F["planos"]["cortes"] if c["tipo"] == "punch-in"), {})
    check("punch-in: fotograma", pi.get("f"), 25, 0, "f")
    check("punch-in: salto de escala %", pi.get("salto_escala_pct"), v["punch_in_pct"], 1.0, "%")
    fl = [e for e in F["flashes_tramos"]["eventos"] if e["tipo"] == "flash"]
    f0 = next((e for e in fl if abs(e["inicio"] - 156) <= 2), {})
    check("flash blanco: inicio (f)", f0.get("inicio"), 156, 0, "f")
    check("flash blanco: duración (f)", f0.get("dur_f"), 3, 0, "f")
    check("flash blanco: en corte", bool(f0.get("corte_n")), True, 0)
    f1 = next((e for e in fl if abs(e["inicio"] - 320) <= 2), {})
    check("destello parcial dentro de plano: duración (f)", f1.get("dur_f"), 2, 0, "f")
    tn = next((t for t in F["flashes_tramos"]["tramos"] if t["tipo"] == "negro"), {})
    check("tramo negro: inicio / duración", [tn.get("inicio"), tn.get("dur_f")], [280, 10], 0)
    z = plano_que_empieza(F, 60)["movimiento"]
    check("empuje: zoom %/s", z["zoom_pct_s"], 2.0, 0.1, "%/s")
    check("empuje: clase = empuje", z["clase"] == "empuje", True, 0)
    p = plano_que_empieza(F, 156)["movimiento"]
    check("paneo: desplazamiento x (px)", p["paneo_desplazamiento_px"][0], v["paneo"]["contenido_dx_px"], 3, "px")
    check("paneo: clase = paneo", p["clase"] == "paneo", True, 0)
    c = p["curva"] or {}
    check("paneo: influencia de salida (bezier a)", c.get("influencia_salida"), 0.83, 0.06)
    check("paneo: influencia de entrada (bezier b)", c.get("influencia_entrada"), 0.83, 0.06)
    check("paneo: fotograma de inicio del movimiento", c.get("desde_f"), v["paneo"]["desde"], 3, "f")
    check("paneo: fotograma de fin del movimiento", c.get("hasta_f"), v["paneo"]["hasta"], 3, "f")
    t = plano_que_empieza(F, 240)["movimiento"]
    check("temblor: clase = temblor", t["clase"] == "temblor", True, 0)
    check("temblor: RMS (px)", t["temblor_rms_px"], v["temblor"]["rms_px"], 1.0, "px")
    check("temblor: frecuencia dominante (Hz)", t["temblor_hz"], v["temblor"]["hz"], 0.6, "Hz")
    fijos = [s["movimiento"]["clase"] for s in F["planos"]["lista"] if s["tipo"] == "plano" and s["inicio"] in (0, 25, 45, 53, 150, 290)]
    check("planos fijos clasificados como fijo", all(x in ("fijo", "corto (sin medir)") for x in fijos), True, 0)
    zt = F["texto"]["zonas"][0] if F["texto"]["zonas"] else {}
    check("subtítulos: centro vertical (% alto)", zt.get("y_centro_pct"), v["texto"]["y_centro_pct"], 3, "%")
    check("subtítulos: f por cambio de palabra", zt.get("f_por_cambio"), v["texto"]["f_por_palabra"], 1.5, "f")
    au = F["audio"]
    check("tempo (BPM)", au["tempo_bpm"], 120, 1.5, "BPM")
    check("LUFS integrados vs pyloudnorm", au["loudness"]["lufs_integrados"], v["audio"]["lufs_pyloudnorm"], 0.5, "LU")
    sil = au["silencios"][0] if au["silencios"] else {}
    check("silencio: inicio (s)", sil.get("inicio_s"), 7.0, 0.05, "s")
    check("silencio: fin (s)", sil.get("fin_s"), 8.0, 0.08, "s")
    check("cortes a ±2 f de un clic (n)", au["cortes_vs_onsets"]["aciertos"], v["cortes_en_clic_2f"], 0)
    on = np.array(au["onsets_s"])
    clics = np.array([c for c in v["audio"]["clics_s"] if c >= 0.1])  # librosa no marca onsets en t≈0
    d = [abs(on - c).min() * 30 for c in clics]
    check("onsets: clics detectados (t ≥ 0,1 s)", int(sum(x <= 1 for x in d)), len(clics), 0)
    check("onsets: error medio frente a los clics (f)", float(np.mean(d)), 0.0, 0.5, "f")
    check("onsets: error máximo frente a los clics (f)", float(np.max(d)), 0.0, 1.0, "f")

    # ------------------------------------------------------------ v2
    v = V["v2"]
    print("\n== v2_ffmpeg25.mp4 (720×1280, 25 fps, solo filtros de ffmpeg)")
    with contextlib.redirect_stdout(io.StringIO()):
        F = analizar.main([os.path.join(SAL, v["archivo"]), "--out", os.path.join(SAL, "ficha_v2"), "-q"])
    cortes = [c["f"] for c in F["planos"]["cortes"]]
    check("cortes (fotogramas exactos)", cortes, v["cortes"], 0)
    check("duraciones de plano (f)", [s["dur_f"] for s in F["planos"]["lista"]], v["planos_dur_f"], 0)
    check("fps detectados", F["metadatos"]["fps"], 25, 0)
    check("conversión a 30 fps del corte 1 (f@30)", F["planos"]["cortes"][0]["f_obj"], 60, 0, "f")
    fl = next((e for e in F["flashes_tramos"]["eventos"] if e["tipo"] == "flash"), {})
    check("flash: inicio / duración", [fl.get("inicio"), fl.get("dur_f")], [105, 3], 0)
    check("cortes a ±2 f de un clic (n)", F["audio"]["cortes_vs_onsets"]["aciertos"], v["cortes_en_clic_2f"], 0)

    # ------------------------------------------------------------ calco
    if "calco" in V:
        print("\n== calco.py (1080×1920, tramo f5-f54)")
        ver = V["calco"]["variantes"]
        for nombre, modo_esp, aprob in (("c_ok.mp4", "directo", True), ("c_mal.mp4", "directo", False),
                                        ("c_otra_textura.mp4", "trayectoria", True)):
            with contextlib.redirect_stdout(io.StringIO()):
                r = calco.main([os.path.join(SAL, "c_ref.mp4"), os.path.join(SAL, nombre), "--desde", "5",
                                "--hasta", "54", "--out", os.path.join(SAL, "calco_" + nombre[:-4])])
            verdad = float(np.mean(ver[nombre]["error_por_fotograma"][5:55]))
            check(f"{nombre}: error medio (px)", r["error_medio_px"], round(verdad, 2), 0.3, "px")
            check(f"{nombre}: modo {modo_esp} / aprobado={aprob}", [r["modo"], r["aprobado"]], [modo_esp, aprob], 0)
        with contextlib.redirect_stdout(io.StringIO()):
            r = calco.main([os.path.join(SAL, "v1_movimiento.mp4"), os.path.join(SAL, "v1_desfase3.mp4"),
                            "--desde", "160", "--hasta", "230", "--out", os.path.join(SAL, "calco_desfase")])
        check("alineación por corte: offset (f)", r["offset_f"], V["v1_desfase3"]["offset_f"], 0, "f")
        check("alineación por corte: error medio (px)", r["error_medio_px"], 0.0, 0.3, "px")

    print(f"\n{sum(res)}/{len(res)} comprobaciones correctas")
    sys.exit(0 if all(res) else 1)


if __name__ == "__main__":
    main()
