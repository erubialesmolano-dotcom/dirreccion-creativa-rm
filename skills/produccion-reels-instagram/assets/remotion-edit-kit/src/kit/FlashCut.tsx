// Flash de cámara con patrón ON ON OFF ON ON (validado por Erik).
// Señala y "archiva" lo que nombra la voz; el OFF intermedio es el parpadeo
// que el ojo capta por contraste. Ración: uno cada 3-4 s como mucho.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Rect} from './constants';

export type FlashCutProps = {
  /** Fotograma del primer ON (relativo a la secuencia). Pon el click de cámara (Sfx) aquí mismo. */
  frame: number;
  /** Patrón por fotograma: 1 = encendido. Por defecto ON ON OFF ON ON. */
  patron?: number[];
  /** Opacidad del relleno. 0,85: deja intuir la imagen debajo (no es un blanco quemado). */
  opacidad?: number;
  color?: string;
  /**
   * Zona a rellenar (el recorte de lo nombrado). Sin zona, pantalla completa.
   * forma 'elipse' para caras; 'rect' con radius para objetos y tarjetas.
   */
  zona?: Rect & {forma?: 'rect' | 'elipse'};
  /** Máscara propia (p. ej. la silueta del sujeto): se pinta con el color del flash. */
  mascara?: React.ReactNode;
  /** Repetir el patrón cada N fotogramas (para ráfagas). 0 = una vez. */
  repetirCada?: number;
  veces?: number;
};

export const PATRON_ERIK = [1, 1, 0, 1, 1];

export const FlashCut: React.FC<FlashCutProps> = ({
  frame: f0,
  patron = PATRON_ERIK,
  opacidad = 0.85,
  color = '#FFFFFF',
  zona,
  mascara,
  repetirCada = 0,
  veces = 1,
}) => {
  const frame = useCurrentFrame();
  let t = frame - f0;
  if (repetirCada > 0 && t >= 0 && t < repetirCada * veces) t = t % repetirCada;
  const on = t >= 0 && t < patron.length && patron[t] === 1;
  if (!on) return null;
  if (mascara) return <AbsoluteFill style={{opacity: opacidad}}>{mascara}</AbsoluteFill>;
  if (!zona) return <AbsoluteFill style={{background: color, opacity: opacidad}} />;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: zona.x,
          top: zona.y,
          width: zona.w,
          height: zona.h,
          background: color,
          opacity: opacidad,
          borderRadius: zona.forma === 'elipse' ? '50%' : zona.radius ?? 0,
        }}
      />
    </AbsoluteFill>
  );
};
