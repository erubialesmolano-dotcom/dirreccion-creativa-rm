// Feed vertical: tarjetas con esquinas redondeadas y sombra que suben en zigzag.
// Cada tarjeta nueva empuja el feed hacia arriba con su propio spring: el
// scroll es la suma de esos springs, así nunca da saltos.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, springAt, type SpringName} from './ease';
import {SOMBRA_PIEZA} from './constants';

export type FeedStackProps = {
  /** Contenido de cada tarjeta, en orden de llegada. */
  tarjetas: React.ReactNode[];
  /** Fotograma de la primera tarjeta. */
  inicio?: number;
  /** Fotogramas entre tarjetas. 6-8 f = enumeración con energía; 12-15 f si hay que leerlas. */
  intervalo?: number;
  ancho?: number;
  alto?: number;
  /** Distancia vertical entre tarjetas. Menor que el alto: se solapan como un feed apilado. */
  paso?: number;
  /** Desplazamiento lateral alterno en px (el zigzag). */
  zigzag?: number;
  /** Giro alterno en grados. 2-3°: vivo sin parecer desordenado. */
  giro?: number;
  /** Centro vertical donde se asienta la tarjeta más reciente. */
  yAncla?: number;
  /** Recorrido extra desde abajo al entrar (px). */
  recorridoEntrada?: number;
  radio?: number;
  sombra?: string;
  /** Spring de entrada. asentado (~5 %): física sin rebote de plantilla. */
  muelle?: SpringName;
};

export const FeedStack: React.FC<FeedStackProps> = ({
  tarjetas,
  inicio = 0,
  intervalo = 7,
  ancho = 760,
  alto = 460,
  paso = 330,
  zigzag = 90,
  giro = 2.5,
  yAncla = 1000,
  recorridoEntrada = 180,
  radio = 40,
  sombra = SOMBRA_PIEZA,
  muelle = 'asentado',
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const progreso = tarjetas.map((_, i) => springAt(frame, fps, inicio + i * intervalo, muelle));
  // Scroll = suma de springs de las tarjetas 1…n: cada llegada empuja el feed un `paso`.
  const scroll = progreso.slice(1).reduce((acc, p) => acc + p * paso, 0);
  return (
    <AbsoluteFill>
      {tarjetas.map((t, i) => {
        const f0 = inicio + i * intervalo;
        if (frame < f0) return null;
        const p = progreso[i];
        const lado = i % 2 === 0 ? -1 : 1;
        const cy = yAncla + i * paso - scroll + (1 - p) * recorridoEntrada;
        if (cy < -alto || cy > 1920 + alto) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: width / 2 - ancho / 2 + lado * zigzag,
              top: cy - alto / 2,
              width: ancho,
              height: alto,
              borderRadius: radio,
              overflow: 'hidden',
              boxShadow: sombra,
              rotate: `${lado * giro}deg`,
              scale: String(interpolate(p, [0, 1], [0.92, 1])),
              opacity: interpolate(frame - f0, [0, 4], [0, 1], clamp),
            }}
          >
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
