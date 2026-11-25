// Fondo blanco con cuadrícula fina gris: el "papel" del vocabulario de montaje de Erik.
// Nunca un blanco plano: la rejilla y la viñeta gris dan superficie.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLOR} from './constants';

export type GridPaperProps = {
  /** Paso de la cuadrícula en px. 54 = 20 columnas en 1080: fina sin hacerse ruido. */
  paso?: number;
  /** Color de las líneas: gris al 7 %; se nota su ausencia, no su presencia. */
  color?: string;
  /** Grosor de línea en px. */
  grosor?: number;
  /** Deriva vertical de la cuadrícula en px/f: el fondo "vive" (moving hold). 0 = quieto. */
  deriva?: number;
  /** Fondo base. */
  fondo?: string;
  /** Viñeta gris (radial #FFF 40 % → #E3E3E7, medida de Erik). */
  vineta?: boolean;
};

export const GridPaper: React.FC<GridPaperProps> = ({
  paso = 54,
  color = COLOR.cuadricula,
  grosor = 1.5,
  deriva = 0,
  fondo = COLOR.blanco,
  vineta = true,
}) => {
  const frame = useCurrentFrame();
  const off = (frame * deriva) % paso;
  return (
    <AbsoluteFill style={{background: fondo}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${color} ${grosor}px, transparent ${grosor}px), linear-gradient(90deg, ${color} ${grosor}px, transparent ${grosor}px)`,
          backgroundSize: `${paso}px ${paso}px`,
          backgroundPosition: `${(1080 / 2) % paso}px ${-off}px`,
        }}
      />
      {vineta ? (
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0) 40%, rgba(227,227,231,.75) 100%)'}} />
      ) : null}
    </AbsoluteFill>
  );
};
