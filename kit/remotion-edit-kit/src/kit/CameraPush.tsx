// Cámara dentro del plano: empuje exponencial continuo + punch-in secos,
// anclado a un punto (lo que nombra la voz). Firma de Erik: +1,8 %/s.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, standard} from './ease';
import type {Punto} from './constants';

export type PunchIn = {
  /** Fotograma del corte de acercamiento (relativo a la secuencia). */
  frame: number;
  /** Aumento de escala. +15-30 %: con menos de 10 % parece un error de encuadre. */
  cantidad?: number;
  /** Fotogramas de asentamiento tras el golpe (2-4 f). */
  asentamiento?: number;
  /** Punto al que se acerca este punch (si no, el ancla general). */
  ancla?: Punto;
};

export type CameraPushProps = {
  children: React.ReactNode;
  /** Empuje continuo por segundo. 0,018 = firma de Erik; 0 en el plano de peso. */
  ritmo?: number;
  /** Punto (px de la composición) que no se mueve al escalar. Por defecto el centro. */
  ancla?: Punto;
  /** Acercamientos secos. Se acumulan: cada uno parte de la escala anterior. */
  punches?: PunchIn[];
  /** Escala inicial (p. ej. 1,03 para tener margen con un Shake encima). */
  escalaInicial?: number;
};

/** Escala total en un fotograma: empuje exponencial × punches acumulados. */
export const escalaCamara = (
  frame: number,
  fps: number,
  {ritmo = 0.018, punches = [], escalaInicial = 1}: Pick<CameraPushProps, 'ritmo' | 'punches' | 'escalaInicial'>,
) => {
  // Exponencial: el tamaño se percibe en logarítmico, así el empuje no "frena".
  let s = escalaInicial * Math.pow(1 + ritmo, Math.max(0, frame) / fps);
  for (const p of punches) {
    if (frame < p.frame) continue;
    const cantidad = p.cantidad ?? 0.22;
    const asent = p.asentamiento ?? 3;
    // Golpe: el fotograma del corte llega un 4 % por encima y asienta en 2-4 f.
    const extra = interpolate(frame - p.frame, [0, asent], [cantidad * 1.18, cantidad], {easing: standard, ...clamp});
    s *= 1 + extra;
  }
  return s;
};

export const CameraPush: React.FC<CameraPushProps> = ({children, ritmo = 0.018, ancla, punches = [], escalaInicial = 1}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const s = escalaCamara(frame, fps, {ritmo, punches, escalaInicial});
  // El ancla activa es la del último punch con ancla propia; si no, la general.
  const activo = [...punches].reverse().find((p) => frame >= p.frame && p.ancla);
  const a = activo?.ancla ?? ancla ?? {x: width / 2, y: height / 2};
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{scale: String(s), transformOrigin: `${a.x}px ${a.y}px`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
