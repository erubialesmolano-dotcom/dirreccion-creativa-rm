// Desenfoque direccional con un filtro SVG (feGaussianBlur con desviación
// distinta en X e Y). Es el "motion blur" barato: no multiplica el render como
// <CameraMotionBlur> y no ensucia el color.
import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';

export type DirBlurProps = {
  /** Desenfoque horizontal en px (desviación típica). */
  x?: number;
  /** Desenfoque vertical en px. */
  y?: number;
  /** Si es false, se envuelve en un div normal en vez de AbsoluteFill. */
  fill?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Por debajo de 0,3 px no se ve: se omite el filtro para no gastar render. */
const UMBRAL = 0.3;

export const DirBlur: React.FC<DirBlurProps> = ({x = 0, y = 0, fill = true, style, children}) => {
  const id = 'db' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const activo = x > UMBRAL || y > UMBRAL;
  const Contenedor = fill ? AbsoluteFill : 'div';
  if (!activo) return <Contenedor style={style}>{children}</Contenedor>;
  return (
    <>
      <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${Math.max(0, x)} ${Math.max(0, y)}`} edgeMode="duplicate" />
          </filter>
        </defs>
      </svg>
      <Contenedor style={{...style, filter: `url(#${id})`}}>{children}</Contenedor>
    </>
  );
};
