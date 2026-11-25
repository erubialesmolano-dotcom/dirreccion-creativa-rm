// Zoom-through: A acelera hacia el ancla, corte en el pico de velocidad y B
// entra decelerando desde cerca. El desenfoque solo vive en esos 6-10 f.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, type Punto} from './constants';
import {cutIn, expScale, materialEnter} from './ease';
import {ZoomBlur} from './ZoomBlur';

export type ZoomThroughProps = {
  a: React.ReactNode;
  b: React.ReactNode;
  /** Fotograma del corte (relativo a la secuencia). */
  corte: number;
  /** Fotogramas de aceleración de A antes del corte (3-5 f). */
  entrada?: number;
  /** Fotogramas de deceleración de B tras el corte (3-5 f; algo más largo que la entrada asienta mejor). */
  salida?: number;
  /** Escala de A en el corte. ×1,3-2: más de 2 deja de leerse como el mismo gesto. */
  pico?: number;
  /** Escala de B al entrar; baja a 1. Continúa la sensación de avance sin destapar bordes. */
  bDesde?: number;
  /** Punto de A hacia el que se avanza (mismo centro a ambos lados del corte). */
  ancla?: Punto;
  /** Punto de B desde el que se sale; por defecto el mismo que en A. */
  anclaB?: Punto;
  /** Muestras del desenfoque de zoom. */
  muestras?: number;
};

export const ZoomThrough: React.FC<ZoomThroughProps> = ({
  a,
  b,
  corte,
  entrada = 4,
  salida = 5,
  pico = 1.7,
  bDesde = 1.45,
  ancla,
  anclaB,
  muestras = 6,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const pA = ancla ?? {x: width / 2, y: height / 2};
  const pB = anclaB ?? pA;
  const escalaA = (f: number) => expScale(1, pico, cutIn(clamp01((f - (corte - entrada)) / entrada)));
  const escalaB = (f: number) => expScale(bDesde, 1, materialEnter(clamp01((f - corte) / salida)));

  if (frame < corte) {
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <ZoomBlur escala={escalaA(frame)} escalaPrev={escalaA(frame - 1)} ancla={pA} muestras={muestras}>
          {a}
        </ZoomBlur>
      </AbsoluteFill>
    );
  }
  // En el fotograma del corte no hay desenfoque (regla de Erik): la estela empieza en el siguiente.
  const prev = frame === corte ? escalaB(frame) : escalaB(frame - 1);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <ZoomBlur escala={escalaB(frame)} escalaPrev={prev} ancla={pB} muestras={muestras}>
        {b}
      </ZoomBlur>
    </AbsoluteFill>
  );
};
