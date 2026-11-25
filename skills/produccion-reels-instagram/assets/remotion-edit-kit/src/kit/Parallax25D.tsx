// Cámara 2.5D con CSS: capas planas a distinta profundidad bajo una cámara que
// se mueve. CSS = After Effects si perspective = ancho · focal / 36 (película de 36 mm).
// Convención AE: z positiva = lejos de la cámara.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, firmaErik} from './ease';

export type Capa = {
  /** Profundidad AE en px: 0 = plano del sujeto (100 % de tamaño), + lejos, − cerca. */
  z: number;
  contenido: React.ReactNode;
  /** Escalar para conservar el tamaño en reposo (true) o dejar que la distancia lo encoja. */
  compensarEscala?: boolean;
};

export type Vec3 = {x: number; y: number; z: number};

export type Parallax25DProps = {
  /** De la más lejana a la más cercana (orden de pintado). 2-4 capas. */
  capas: Capa[];
  /** Posición de cámara al principio y al final. z + = la cámara avanza (dolly in). */
  desde?: Vec3;
  hasta?: Vec3;
  /** Fotogramas del movimiento de cámara. */
  duracion?: number;
  /** Curva del movimiento. firmaErik: empieza y acaba en cuadro. */
  curva?: (t: number) => number;
  /** Focal en mm. 50 por defecto; 85-135 comprime (documental); 24-35 exagera (empuje dramático). */
  focal?: number;
  /** Focal final: animar solo la focal con el sujeto en z = 0 es un dolly zoom (Vértigo). */
  focalHasta?: number;
  /** Plano de foco (z AE). Las capas fuera de foco se desenfocan. null = todo nítido. */
  foco?: number | null;
  /** px de desenfoque por px de distancia al foco (0,004) con tope de 10 px a 1080p. */
  dof?: number;
  topeDof?: number;
};

/** perspective CSS equivalente al Zoom de AE. 1080 a 50 mm → 1500 px. */
export const perspectivaDeFocal = (ancho: number, focal: number) => (ancho * focal) / 36;

export const Parallax25D: React.FC<Parallax25DProps> = ({
  capas,
  desde = {x: 0, y: 0, z: 0},
  hasta = {x: 0, y: 0, z: 300},
  duracion = 90,
  curva = firmaErik,
  focal = 50,
  focalHasta,
  foco = 0,
  dof = 0.004,
  topeDof = 10,
}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const e = interpolate(frame, [0, duracion], [0, 1], {easing: curva, ...clamp});
  const cam = {
    x: desde.x + (hasta.x - desde.x) * e,
    y: desde.y + (hasta.y - desde.y) * e,
    z: desde.z + (hasta.z - desde.z) * e,
  };
  const p0 = perspectivaDeFocal(width, focal);
  const p = focalHasta ? perspectivaDeFocal(width, focal + (focalHasta - focal) * e) : p0;

  return (
    <AbsoluteFill style={{perspective: `${p}px`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translate3d(${-cam.x}px, ${-cam.y}px, ${cam.z}px)`}}>
        {capas.map((c, i) => {
          // Conservar tamaño: una capa a z se ve a p/(p+z); se compensa escalando (p+z)/p.
          const s = c.compensarEscala === false ? 1 : (p0 + c.z) / p0;
          const blur = foco === null ? 0 : Math.min(topeDof, Math.abs(c.z - (foco ?? 0)) * dof);
          return (
            <AbsoluteFill key={i} style={{transformStyle: 'preserve-3d', transform: `translateZ(${-c.z}px) scale(${s})`}}>
              <AbsoluteFill style={{filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>{c.contenido}</AbsoluteFill>
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
