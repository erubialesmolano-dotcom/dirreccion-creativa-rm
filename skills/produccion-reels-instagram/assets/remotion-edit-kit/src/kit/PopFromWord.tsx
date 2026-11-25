// Pop desde la palabra (medido por Erik al píxel en referencias):
// corte a blanco y la tarjeta nace en el punto del subtítulo. Su ancho relativo
// al final va 0,05 → 0,36 → 0,70 → 0,89 → 1 en 4 fotogramas.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridPaper} from './GridPaper';
import {lerp, SOMBRA_PIEZA, type Punto, type Rect} from './constants';

/** Escalones medidos, uno por fotograma (f0…f4). */
export const ESCALONES_POP = [0.05, 0.36, 0.7, 0.89, 1];

export type PopFromWordProps = {
  /** Centro de la palabra del subtítulo de la que nace la tarjeta (px de la composición). */
  origen: Punto;
  /** Rectángulo final de la tarjeta. */
  destino: Rect;
  /** Contenido de la tarjeta (se escala con ella). */
  children: React.ReactNode;
  /** Fondo tras el corte. Por defecto el papel blanco con cuadrícula. */
  fondo?: React.ReactNode;
  /** Escalones por fotograma. Cambiarlos rompe la medida: solo para otro formato. */
  escalones?: number[];
  /** Radio de esquina en px a tamaño final. */
  radio?: number;
  sombra?: string;
  /** Fondo de la tarjeta (se ve mientras el contenido carga o si es transparente). */
  colorTarjeta?: string;
  /** Empuje continuo tras asentar (por segundo). Mantiene viva la tarjeta. 0 = quieta. */
  empuje?: number;
};

export const PopFromWord: React.FC<PopFromWordProps> = ({
  origen,
  destino,
  children,
  fondo,
  escalones = ESCALONES_POP,
  radio = 44,
  sombra = SOMBRA_PIEZA,
  colorTarjeta = '#FFFFFF',
  empuje = 0.018,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < 0) return null;
  // Sin interpolar entre escalones: a 30 fps cada fotograma ES el escalón medido.
  const p = escalones[Math.min(frame, escalones.length - 1)];
  const p0 = escalones[0];
  const k = (p - p0) / (1 - p0);
  const cx = lerp(origen.x, destino.x + destino.w / 2, k);
  const cy = lerp(origen.y, destino.y + destino.h / 2, k);
  const asentado = Math.max(0, frame - (escalones.length - 1));
  const s = p * Math.pow(1 + empuje, asentado / fps);
  return (
    <AbsoluteFill>
      {fondo ?? <GridPaper />}
      <div
        style={{
          position: 'absolute',
          left: cx - destino.w / 2,
          top: cy - destino.h / 2,
          width: destino.w,
          height: destino.h,
          scale: String(s),
          borderRadius: destino.radius ?? radio,
          overflow: 'hidden',
          boxShadow: sombra,
          background: colorTarjeta,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
