// Sonido: efectos colocados al fotograma y ducking de la música bajo la voz.
import React from 'react';
import {Audio, Sequence} from 'remotion';
import type {Word} from './WordCaptions';

/** dB → ganancia lineal (−6 dB ≈ 0,5). */
export const dbALineal = (db: number) => Math.pow(10, db / 20);

export type SfxProps = {
  /** Ruta (staticFile('sfx/click.wav')) o URL. */
  src: string;
  /** Fotograma del evento visual. Sonidos de UI: 0-2 f ANTES del cambio visual (usa adelanto). */
  frame: number;
  /** Ganancia en dB. 0 = tal cual; −6 a −12 para que los efectos nunca tapen la voz. */
  gananciaDb?: number;
  /** Fotogramas que el sonido se adelanta al evento (whoosh: su pico debe caer en el pico de velocidad). */
  adelanto?: number;
  /** Duración máxima en fotogramas (corta colas largas). */
  duracion?: number;
  /** Velocidad de reproducción (variar 0,95-1,05 evita que repeticiones suenen a máquina). */
  velocidad?: number;
};

export const Sfx: React.FC<SfxProps> = ({src, frame, gananciaDb = -6, adelanto = 0, duracion, velocidad = 1}) => (
  <Sequence from={frame - adelanto} durationInFrames={duracion} layout="none" name={`sfx ${src.split('/').pop()}`}>
    <Audio src={src} volume={dbALineal(gananciaDb)} playbackRate={velocidad} />
  </Sequence>
);

export type Segmento = {inicio: number; fin: number};

/** Agrupa las palabras en tramos de voz (fotogramas), uniendo huecos cortos. */
export const segmentosDeVoz = (words: Word[], fps: number, unirHueco = 8): Segmento[] => {
  const segs: Segmento[] = [];
  for (const w of words) {
    const s = {inicio: Math.round(w.start * fps), fin: Math.round(w.end * fps)};
    const ult = segs[segs.length - 1];
    if (ult && s.inicio - ult.fin <= unirHueco) ult.fin = Math.max(ult.fin, s.fin);
    else segs.push(s);
  }
  return segs;
};

export type DuckOpciones = {
  /** Volumen de la música sin voz (lineal). 0,55 ≈ −5 dB. */
  base?: number;
  /** Volumen bajo la voz. 0,16 ≈ −16 dB: la música se intuye sin competir con la voz. */
  agachado?: number;
  /** Fotogramas de bajada. 4 f ≈ 130 ms, y empieza ANTES de la voz (anticipación) para no pisar la primera sílaba. */
  ataque?: number;
  /** Fotogramas de recuperación tras la voz. 15 f = 0,5 s: no "bombea" entre frases. */
  relajacion?: number;
};

const sCurve = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));

/**
 * Volumen de la música en un fotograma, agachándose bajo los segmentos de voz.
 * Úsalo como callback: <Audio src={musica} volume={(f) => duck(f, segs)} />.
 */
export const duck = (frame: number, segmentos: Segmento[], {base = 0.55, agachado = 0.16, ataque = 4, relajacion = 15}: DuckOpciones = {}) => {
  let env = 0;
  for (const s of segmentos) {
    let e = 0;
    if (frame >= s.inicio - ataque && frame < s.inicio) e = sCurve((frame - (s.inicio - ataque)) / ataque);
    else if (frame >= s.inicio && frame <= s.fin) e = 1;
    else if (frame > s.fin && frame < s.fin + relajacion) e = 1 - sCurve((frame - s.fin) / relajacion);
    env = Math.max(env, e);
  }
  return base + (agachado - base) * env;
};
