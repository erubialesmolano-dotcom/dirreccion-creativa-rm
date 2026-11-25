"""Mapa musical de un audio: tempo, compases, secciones, energía, huecos y cuánto baja la música bajo la voz.

    python mapa_musical.py AUDIO [--separar] [--salida carpeta]

--separar  pasa antes el audio por Demucs (voz / resto) para medir la música sin la voz y el ducking.
           Necesita `pip install demucs`. Sin --separar se mide la mezcla tal cual.

Escribe mapa.json y mapa.md. Sirve para dos cosas:
1. Medir la música de una referencia (en qué compás corta, cuándo se calla, cuánto baja bajo la voz).
2. Medir una canción candidata y ver dónde caen sus compases fuertes, sus drops y sus huecos para
   encajar los momentos del guion (ver references/musica-redes.md).
"""
import argparse, json, os, subprocess, sys
import numpy as np
import librosa


def db(x):
    return 20 * np.log10(np.maximum(x, 1e-6))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('audio'); ap.add_argument('--separar', action='store_true'); ap.add_argument('--salida', default=None)
    a = ap.parse_args()
    out = a.salida or os.path.splitext(a.audio)[0] + '_mapa'
    os.makedirs(out, exist_ok=True)
    musica, voz = a.audio, None
    if a.separar:
        subprocess.run([sys.executable, '-m', 'demucs', '--two-stems=vocals', '-o', out, a.audio], check=True)
        base = os.path.join(out, 'htdemucs', os.path.splitext(os.path.basename(a.audio))[0])
        musica, voz = os.path.join(base, 'no_vocals.wav'), os.path.join(base, 'vocals.wav')

    y, sr = librosa.load(musica, sr=22050, mono=True)
    dur = len(y) / sr
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
    tempo = float(np.atleast_1d(tempo)[0])
    # primer tiempo de compás: de las 4 fases posibles, la que cae en golpes más fuertes
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    ot = librosa.times_like(onset, sr=sr)
    fuerza = np.interp(beats, ot, onset) if len(beats) else np.array([])
    fase = int(np.argmax([fuerza[i::4].mean() if len(fuerza[i::4]) else 0 for i in range(4)])) if len(beats) >= 8 else 0
    compases = beats[fase::4]

    # energía por medio segundo
    hop = 512
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    t = librosa.times_like(rms, sr=sr, hop_length=hop)
    paso = 0.5
    curva = [round(float(db(rms[(t >= s) & (t < s + paso)].mean() if ((t >= s) & (t < s + paso)).any() else 1e-6)), 1)
             for s in np.arange(0, dur, paso)]
    ref = np.percentile(db(rms), 90)
    # huecos: la música cae más de 18 dB bajo su nivel alto durante ≥ 0,25 s
    bajo = db(rms) < ref - 18
    huecos, i = [], 0
    while i < len(bajo):
        if bajo[i]:
            j = i
            while j + 1 < len(bajo) and bajo[j + 1]:
                j += 1
            if t[j] - t[i] >= 0.25:
                huecos.append([round(float(t[i]), 2), round(float(t[j]), 2)])
            i = j + 1
        else:
            i += 1
    # secciones por cambio de timbre/armonía
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, hop_length=hop)
    feat = np.vstack([librosa.util.normalize(chroma), librosa.util.normalize(mfcc)])
    k = max(2, min(8, int(dur // 6)))
    lim = librosa.segment.agglomerative(feat, k)
    secciones = [round(float(x), 2) for x in librosa.frames_to_time(lim, sr=sr, hop_length=hop)]

    res = {'archivo': a.audio, 'duracion_s': round(dur, 2), 'bpm': round(tempo, 1),
           'beat_s': round(60 / tempo, 3) if tempo else None, 'compases_s': [round(float(x), 2) for x in compases],
           'secciones_s': secciones, 'huecos_s': huecos, 'energia_db_cada_0_5s': curva}

    if voz:
        yv, _ = librosa.load(voz, sr=sr, mono=True)
        rv = librosa.feature.rms(y=yv, hop_length=hop)[0][:len(rms)]
        hablando = db(rv) > np.percentile(db(rv), 90) - 20
        if hablando.any() and (~hablando).any():
            res['musica_bajo_voz_db'] = round(float(db(rms[:len(rv)][hablando]).mean() - db(rms[:len(rv)][~hablando]).mean()), 1)
            res['voz_sobre_musica_db'] = round(float(db(rv[hablando]).mean() - db(rms[:len(rv)][hablando]).mean()), 1)

    json.dump(res, open(os.path.join(out, 'mapa.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(os.path.join(out, 'mapa.md'), 'w', encoding='utf-8') as f:
        f.write(f"# Mapa musical de {os.path.basename(a.audio)}\n\n")
        f.write(f"- Duración: {res['duracion_s']} s · **{res['bpm']} BPM** (un pulso cada {res['beat_s']} s; un compás de 4 cada {round(4 * res['beat_s'], 2) if res['beat_s'] else '?'} s)\n")
        f.write(f"- Primeros tiempos de compás (dónde cortar los momentos grandes): {', '.join(map(str, res['compases_s'][:40]))}\n")
        f.write(f"- Cambios de sección (candidatos a giro o drop): {', '.join(map(str, secciones))}\n")
        f.write(f"- Huecos de la música (silencios o caídas fuertes): {huecos or 'ninguno'}\n")
        if 'musica_bajo_voz_db' in res:
            f.write(f"- La música baja **{res['musica_bajo_voz_db']} dB** cuando hay voz; la voz queda {res['voz_sobre_musica_db']} dB por encima.\n")
        f.write("\nEnergía (dB por medio segundo):\n\n" + ' '.join(map(str, curva)) + "\n")
    print(json.dumps({k: v for k, v in res.items() if k not in ('energia_db_cada_0_5s', 'compases_s')}, ensure_ascii=False))


if __name__ == '__main__':
    main()
