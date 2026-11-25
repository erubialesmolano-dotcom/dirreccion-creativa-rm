// Cámara v2: nada está quieto salvo el plano de peso (regla de Erik: ningún fotograma congelado).
// - Deriva: movimiento continuo y sutil (posición, rotación y escala con ruido suave, no lineal).
// - Empuje: push-in con curva asimétrica (arranca rápido y se asienta largo) y desenfoque por velocidad.
// - Capas: parallax de recortes por profundidad con una sola cámara.
// - Desenfoque de movimiento: por velocidad medida (filtro direccional barato) o con CameraMotionBlur.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {keys, ruido1, type Key} from './curvas';
import {DirBlur} from '../kit/DirBlur';
import {blurPorVelocidad} from '../kit/constants';

export type Cam = {x: number; y: number; s: number; r: number};

/**
 * Deriva de cámara medida en las referencias (investigacion/medidas/recetas/deriva.md): el 90 % de
 * los planos de ≥3 s se mueve; mediana de zoom 2 %/s y paneo 1,6 % del ancho/s. Es un movimiento
 * CONTINUO EN UNA DIRECCIÓN (empuje lento y, si acaso, paneo constante), nunca un vaivén: la versión
 * con ruido de lado a lado se veía «temblar» (prueba a ciegas con Erik, 25/11/2026).
 * `panPorS` en px/s (signo = dirección; por defecto sale de la semilla), `zoomPorS` en %/s.
 * `temblor` solo para imitar cámara en mano en vídeo grabado, nunca sobre fotos o gráficos.
 */
export const deriva = (
  f: number,
  {intensidad = 1, semilla = 1, panPorS, zoomPorS = 1, fps = 30, temblor = 0}: {intensidad?: number; semilla?: number; panPorS?: number; zoomPorS?: number; fps?: number; temblor?: number; px?: number; grados?: number; periodo?: number} = {},
): Cam => {
  const t = f / fps;
  const dir = ruido1(semilla * 12.9898, semilla) >= 0 ? 1 : -1;
  const pan = (panPorS ?? 4 * dir) * t * intensidad;
  const tt = (f / 6) * Math.PI * 2;
  return {
    x: pan + ruido1(tt, semilla + 21) * temblor,
    y: ruido1(tt * 1.13, semilla + 23) * temblor,
    r: 0,
    s: Math.pow(1 + zoomPorS / 100, t * intensidad),
  };
};

const transformDe = (c: Cam, origen = '50% 50%') => ({
  transform: `translate(${c.x}px, ${c.y}px) rotate(${c.r}deg) scale(${c.s})`,
  transformOrigin: origen,
});

/** Envuelve un plano con deriva continua. */
export const Deriva: React.FC<{intensidad?: number; semilla?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  intensidad = 1,
  semilla = 1,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{...style, ...transformDe(deriva(f, {intensidad, semilla}))}}>{children}</AbsoluteFill>;
};

/**
 * Empuje con keyframes de AE por propiedad (escala, x, y). Por defecto: 1 → 1,18 en 40 f con
 * influencia de salida 0,15 (arranca casi de golpe) y de entrada 0,85 (se asienta muy largo),
 * más deriva encima para que al acabar no se congele. El desenfoque sale de la velocidad real.
 */
export const Empuje: React.FC<{
  escala?: Key[];
  x?: Key[];
  y?: Key[];
  origen?: [number, number];
  deriva?: number;
  blur?: boolean;
  children: React.ReactNode;
}> = ({
  escala = [
    {f: 0, v: 1, infOut: 0.15},
    {f: 40, v: 1.18, infIn: 0.85},
  ],
  x = [{f: 0, v: 0}],
  y = [{f: 0, v: 0}],
  origen = [540, 960],
  deriva: d = 0.6,
  blur = true,
  children,
}) => {
  const f = useCurrentFrame();
  const s = keys(f, escala);
  const ds = keys(f + 0.5, escala) - keys(f - 0.5, escala);
  const vx = keys(f + 0.5, x) - keys(f - 0.5, x);
  const vy = keys(f + 0.5, y) - keys(f - 0.5, y);
  const dr = deriva(f, {intensidad: d, semilla: 5});
  // velocidad radial aparente en el borde (px/f) = cambio de escala × media diagonal
  const vRadial = Math.abs(ds) * 1100;
  const b = blur ? blurPorVelocidad(vRadial, 0.1, 6) : 0;
  const inner = (
    <AbsoluteFill
      style={{
        transform: `translate(${keys(f, x) + dr.x}px, ${keys(f, y) + dr.y}px) rotate(${dr.r}deg) scale(${s * dr.s})`,
        transformOrigin: `${origen[0]}px ${origen[1]}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
  return <DirBlur x={blurPorVelocidad(vx, 0.16) + b * 0.5} y={blurPorVelocidad(vy, 0.16) + b * 0.5}>{inner}</DirBlur>;
};

/**
 * Capas de parallax con una sola cámara: cada capa tiene profundidad z (0 = fondo lejano, 1 = plano
 * de la cámara). La cámara (x, y, s) mueve más las capas cercanas. La escala también se separa:
 * al empujar, lo cercano crece más (perspectiva real, no un zoom de toda la imagen).
 */
export type Capa = {z: number; node: React.ReactNode; blurLejos?: number};
export const Capas: React.FC<{capas: Capa[]; cam: (f: number) => Cam; foco?: number}> = ({capas, cam, foco}) => {
  const f = useCurrentFrame();
  const c = cam(f);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {capas.map((k, i) => {
        const p = 0.25 + k.z * 0.75; // cuánto le afecta la cámara
        const s = 1 + (c.s - 1) * (0.4 + k.z * 1.2);
        const dof = foco === undefined ? 0 : Math.abs(k.z - foco) * (k.blurLejos ?? 6);
        return (
          <AbsoluteFill
            key={i}
            style={{
              transform: `translate(${c.x * p}px, ${c.y * p}px) rotate(${c.r * p}deg) scale(${s})`,
              filter: dof > 0.3 ? `blur(${dof}px)` : undefined,
            }}
          >
            {k.node}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Desenfoque de movimiento real (varias muestras por fotograma). Multiplica el render por `muestras`,
 * así que úsalo solo en el tramo rápido (un zoom-through, un barrido), no en toda la pieza.
 * Obturador 180° (`shutterAngle`) como una cámara de cine.
 */
export const BlurReal: React.FC<{muestras?: number; obturador?: number; children: React.ReactNode}> = ({muestras = 8, obturador = 180, children}) => (
  <CameraMotionBlur samples={muestras} shutterAngle={obturador}>
    {children}
  </CameraMotionBlur>
);
