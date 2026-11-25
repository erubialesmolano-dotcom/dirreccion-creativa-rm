// Desenfoque radial de zoom por acumulación: N copias a escalas crecientes
// promediadas (la copia i va con opacidad 1/(i+1), así todas pesan igual).
// Es el equivalente a un obturador de 180° sobre un zoom. Solo se activa con velocidad.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Punto} from './constants';

export type ZoomBlurProps = {
  children: React.ReactNode;
  /** Escala del fotograma actual. */
  escala: number;
  /** Escala del fotograma anterior (para la velocidad). */
  escalaPrev: number;
  ancla: Punto;
  /** Muestras: 6 es suficiente a 30 fps sin multiplicar demasiado el render. */
  muestras?: number;
  /** Fracción del obturador: 0,5 = 180°. */
  obturador?: number;
  style?: React.CSSProperties;
};

export const ZoomBlur: React.FC<ZoomBlurProps> = ({children, escala, escalaPrev, ancla, muestras = 6, obturador = 0.5, style}) => {
  const dlog = Math.log(escala) - Math.log(escalaPrev);
  const origen = `${ancla.x}px ${ancla.y}px`;
  // Por debajo de ~0,4 % de cambio por fotograma no se ve estela: una sola copia.
  if (Math.abs(dlog) < 0.004) {
    return <AbsoluteFill style={{...style, scale: String(escala), transformOrigin: origen}}>{children}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={style}>
      {Array.from({length: muestras}, (_, i) => {
        // Muestras repartidas hacia atrás en el tiempo (centradas en el fotograma actual).
        const k = i / (muestras - 1) - 0.5;
        const s = escala * Math.exp(-dlog * obturador * k);
        return (
          <AbsoluteFill key={i} style={{scale: String(s), transformOrigin: origen, opacity: 1 / (i + 1)}}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
