// Temblor de cámara determinista: deriva de mano (~1 Hz) + impactos que decaen.
// Ruido de @remotion/noise: el mismo fotograma da siempre el mismo temblor en
// todos los hilos de render (nunca Math.random).
import React from 'react';
import {noise2D} from '@remotion/noise';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export type Impacto = {
  /** Fotograma del golpe (relativo a la secuencia). Pon aquí también el Sfx. */
  frame: number;
  /** Amplitud en px. 10-15 px: se siente sin perder la lectura. */
  amplitud?: number;
  /** Frecuencia en Hz. 8-12 Hz = golpe; más bajo parece mareo. */
  frecuencia?: number;
  /** Segundos en caer a ~5 %. 0,3 s: el golpe se siente y se va antes de molestar. */
  caida?: number;
};

export type ShakeProps = {
  children: React.ReactNode;
  /** Amplitud de la deriva de mano en px. 2-8 px; 3 es "en mano" sin marear. */
  deriva?: number;
  /** Frecuencia de la deriva en Hz (0,8-1,5). La alta frecuencia sostenida delata. */
  frecuenciaDeriva?: number;
  /** Rotación máxima de la deriva en grados (0,2-0,6°), con otra semilla. */
  rotacion?: number;
  impactos?: Impacto[];
  /** Escala extra para no ver bordes al temblar (2-4 %). */
  sobreescala?: number;
  semilla?: string;
};

/** Desplazamiento del temblor en un fotograma (útil para mover otras capas a la vez). */
export const temblor = (
  frame: number,
  fps: number,
  {deriva = 3, frecuenciaDeriva = 1, rotacion = 0.3, impactos = [], semilla = 'shake'}: Omit<ShakeProps, 'children'>,
) => {
  const ts = (frame / fps) * frecuenciaDeriva;
  let x = noise2D(`${semilla}-x`, ts, 0) * deriva;
  let y = noise2D(`${semilla}-y`, 0, ts) * deriva;
  let r = noise2D(`${semilla}-r`, ts, 7.3) * rotacion;
  for (const im of impactos) {
    const t = (frame - im.frame) / fps;
    if (t < 0) continue;
    const amp = im.amplitud ?? 14;
    const f = im.frecuencia ?? 10;
    // exp(−3) ≈ 5 %: la caída llega a ~5 % en `caida` segundos.
    const env = Math.exp((-3 * t) / (im.caida ?? 0.3));
    if (env < 0.01) continue;
    x += noise2D(`${semilla}-ix${im.frame}`, t * f, 0) * amp * env;
    y += noise2D(`${semilla}-iy${im.frame}`, 0, t * f) * amp * env;
    r += noise2D(`${semilla}-ir${im.frame}`, t * f, 3.1) * amp * 0.05 * env;
  }
  return {x, y, r};
};

export const Shake: React.FC<ShakeProps> = ({children, sobreescala = 1.03, ...opciones}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {x, y, r} = temblor(frame, fps, opciones);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{translate: `${x}px ${y}px`, rotate: `${r}deg`, scale: String(sobreescala)}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
