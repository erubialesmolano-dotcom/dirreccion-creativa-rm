// Ráfaga en corte seco: planos que se suceden sin animación de entrada.
// La energía sale del corte, no del movimiento. Alterna ráfagas de 3-5 planos
// con holds de 15-45 f: estímulo uniforme = sin jerarquía.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export type RafagaProps = {
  planos: React.ReactNode[];
  /** Fotograma del primer plano. */
  inicio?: number;
  /**
   * Fotogramas por plano: un número o uno por plano. 4-6 f se registra;
   * con 2-3 f solo queda la impresión (sirve si el último plano es el que importa).
   */
  duraciones?: number | number[];
  /** El último plano se queda (true) o la ráfaga desaparece al acabar (false). */
  mantenerUltimo?: boolean;
};

export const Rafaga: React.FC<RafagaProps> = ({planos, inicio = 0, duraciones = 5, mantenerUltimo = true}) => {
  const frame = useCurrentFrame();
  let t = frame - inicio;
  if (t < 0) return null;
  for (let i = 0; i < planos.length; i++) {
    const d = Array.isArray(duraciones) ? duraciones[i] ?? duraciones[duraciones.length - 1] : duraciones;
    if (t < d || (mantenerUltimo && i === planos.length - 1)) return <AbsoluteFill>{planos[i]}</AbsoluteFill>;
    t -= d;
  }
  return null;
};
