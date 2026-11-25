// Constelación: clips que aparecen en corte seco alrededor de una palabra y
// luego se encogen hacia el centro. Sin animación de entrada: el corte seco ES
// la energía; el movimiento se reserva para la recogida.
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, materialExit} from './ease';
import {SOMBRA_PIEZA} from './constants';

export type ConstelacionProps = {
  /** La palabra (o nodo) del centro. */
  centro: React.ReactNode;
  /** Clips que rodean la palabra. 5-8: más se vuelve ruido. */
  clips: React.ReactNode[];
  /** Fotograma del primer clip. */
  inicio?: number;
  /** Fotogramas entre clips. 3-4 f = ráfaga; con 2 f el ojo no registra ninguno. */
  intervalo?: number;
  /** Fotograma en que empiezan a encogerse (relativo). Deja 12+ f de hold con todos visibles. */
  encoger?: number;
  /** Duración de la recogida de cada clip. 10 f, curva de salida (acelera hacia el centro). */
  duracionEncoger?: number;
  /** Stagger de la recogida (1-2 f). */
  staggerEncoger?: number;
  ancho?: number;
  alto?: number;
  /** Radio de la órbita en px (elipse: alto × 1,45 por el formato vertical). */
  radio?: number;
  radioEsquina?: number;
  seed?: string;
};

export const Constelacion: React.FC<ConstelacionProps> = ({
  centro,
  clips,
  inicio = 0,
  intervalo = 3,
  encoger = 40,
  duracionEncoger = 10,
  staggerEncoger = 1,
  ancho = 300,
  alto = 380,
  radio = 320,
  radioEsquina = 28,
  seed = 'constelacion',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  return (
    <AbsoluteFill>
      {clips.map((c, i) => {
        const f0 = inicio + i * intervalo;
        if (frame < f0) return null;
        // Ángulos repartidos con un poco de azar determinista para que no sea un reloj.
        const ang = (i / clips.length) * Math.PI * 2 - Math.PI / 2 + (random(`${seed}-a${i}`) - 0.5) * 0.5;
        const r = radio * (0.85 + random(`${seed}-r${i}`) * 0.3);
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r * 1.45;
        const giro = (random(`${seed}-g${i}`) - 0.5) * 10;
        const e = interpolate(frame, [encoger + i * staggerEncoger, encoger + i * staggerEncoger + duracionEncoger], [0, 1], {easing: materialExit, ...clamp});
        if (e >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + (cx - x) * e - ancho / 2,
              top: y + (cy - y) * e - alto / 2,
              width: ancho,
              height: alto,
              borderRadius: radioEsquina,
              overflow: 'hidden',
              boxShadow: SOMBRA_PIEZA,
              rotate: `${giro * (1 - e)}deg`,
              scale: String(1 - e),
            }}
          >
            {c}
          </div>
        );
      })}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>{centro}</AbsoluteFill>
    </AbsoluteFill>
  );
};
