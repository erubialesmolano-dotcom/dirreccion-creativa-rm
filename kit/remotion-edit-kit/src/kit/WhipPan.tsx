// Whip pan: A y B están uno junto al otro como en una tira continua y la cámara
// barre de uno a otro en un solo gesto lento-rápido-lento con estela direccional.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from './ease';
import {Easing} from 'remotion';
import {DirBlur} from './DirBlur';

export type WhipPanProps = {
  a: React.ReactNode;
  b: React.ReactNode;
  /** Fotograma en que empieza el barrido (relativo a la secuencia). */
  inicio: number;
  /** Duración total del barrido. 8-10 f: con más deja de ser "látigo" y pasa a paneo. */
  duracion?: number;
  /** Dirección en la que viaja el contenido nuevo. Avanzar = izquierda (eje narrativo). */
  direccion?: 'izquierda' | 'derecha' | 'arriba' | 'abajo';
  /** Px de estela por px/f de velocidad. 0,14 deja leer formas y mata el detalle. */
  factorEstela?: number;
  /** Tope de la estela en px. */
  tope?: number;
  /** Curva del barrido: arranque y llegada muy cortos para que casi todo sea velocidad. */
  curva?: (t: number) => number;
};

const curvaLatigo = Easing.bezier(0.7, 0, 0.2, 1);

export const WhipPan: React.FC<WhipPanProps> = ({
  a,
  b,
  inicio,
  duracion = 9,
  direccion = 'izquierda',
  factorEstela = 0.14,
  tope = 48,
  curva = curvaLatigo,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const horizontal = direccion === 'izquierda' || direccion === 'derecha';
  const signo = direccion === 'izquierda' || direccion === 'arriba' ? -1 : 1;
  const distancia = horizontal ? width : height;
  const pos = (f: number) => interpolate(f, [inicio, inicio + duracion], [0, 1], {easing: curva, ...clamp}) * distancia;
  const d = pos(frame);
  const v = pos(frame + 0.5) - pos(frame - 0.5);
  // Obturador 180°: estela = velocidad · 0,5, aquí con un factor propio porque es un gesto, no una cámara documental.
  const estela = Math.abs(v) < 1 ? 0 : Math.min(tope, Math.abs(v) * factorEstela);
  const t = (off: number) => (horizontal ? `${signo * off}px 0px` : `0px ${signo * off}px`);

  if (frame < inicio) return <AbsoluteFill>{a}</AbsoluteFill>;
  if (frame >= inicio + duracion) return <AbsoluteFill>{b}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DirBlur x={horizontal ? estela : 0} y={horizontal ? 0 : estela}>
        <AbsoluteFill style={{translate: t(d)}}>{a}</AbsoluteFill>
        <AbsoluteFill style={{translate: t(d - distancia)}}>{b}</AbsoluteFill>
      </DirBlur>
    </AbsoluteFill>
  );
};
