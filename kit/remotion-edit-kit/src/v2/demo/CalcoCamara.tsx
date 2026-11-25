// Composición de calco: el primer fotograma de un tramo de referencia animado con keyframes de AE
// ajustados por kit/analisis-referencias/calcar_camara.py. Sirve para validar con calco.py que
// keys() reproduce la curva real (p95 ≤ 4 px). Tamaño y duración salen de las props.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, type CalculateMetadataFunction} from 'remotion';
import {keys, type Key} from '../curvas';

export type CalcoProps = {img: string; w: number; h: number; dur: number; fps: number; escala: Key[]; x: Key[]; y: Key[]};

export const CalcoCamara: React.FC<CalcoProps> = ({img, w, h, escala, x, y}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Img
        src={staticFile(img)}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: h,
          transformOrigin: `${w / 2}px ${h / 2}px`,
          transform: `translate(${keys(f, x)}px, ${keys(f, y)}px) scale(${keys(f, escala)})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const metaCalco: CalculateMetadataFunction<CalcoProps> = ({props}) => ({
  width: Math.round(props.w / 2) * 2,
  height: Math.round(props.h / 2) * 2,
  durationInFrames: props.dur,
  fps: props.fps,
});

export const calcoPorDefecto: CalcoProps = {img: 'calco/primer_fotograma.png', w: 1080, h: 1920, dur: 30, fps: 30, escala: [{f: 0, v: 1}], x: [{f: 0, v: 0}], y: [{f: 0, v: 0}]};
