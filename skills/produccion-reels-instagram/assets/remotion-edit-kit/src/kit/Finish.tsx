// Acabado: grano animado monocromo + viñeta. Va SIEMPRE la última capa.
// Orden de lente (motion-remotion §10): igualar → grado → glow → aberración → viñeta → grano.
import React, {useId} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export type FinishProps = {
  /**
   * Opacidad del grano. 0,16 sobre foto y 0,05 sobre blanco (medidas de Erik).
   * Rango útil 0,05-0,2: por encima se ve "filtro".
   */
  grano?: number;
  /** Tamaño del grano: baseFrequency de feTurbulence. 0,85 ≈ grano fino de 1080p. */
  frecuencia?: number;
  /**
   * Oscurecimiento de la viñeta en las esquinas (0-1). −10 a −25 % es el rango
   * pro; por encima se ve el óvalo.
   */
  vineta?: number;
  /** Dónde empieza a oscurecer la viñeta, en % del radio. 55 % = centro limpio. */
  vinetaInicio?: number;
  /** Color de la viñeta: negro sobre foto; gris frío (#E3E3E7 de Erik) sobre blanco. */
  vinetaColor?: string;
};

export const Finish: React.FC<FinishProps> = ({
  grano = 0.16,
  frecuencia = 0.85,
  vineta = 0.22,
  vinetaInicio = 55,
  vinetaColor = '0,0,0',
}) => {
  const frame = useCurrentFrame();
  const id = 'gr' + useId().replace(/[^a-zA-Z0-9]/g, '');
  // Semilla = fotograma: grano distinto en cada fotograma ("Animation Speed 1")
  // y determinista (el mismo fotograma da siempre el mismo grano).
  const seed = (frame * 7919) % 10007;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {vineta > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(${vinetaColor},0) ${vinetaInicio}%, rgba(${vinetaColor},${vineta}) 100%)`,
          }}
        />
      ) : null}
      {grano > 0 ? (
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: grano, mixBlendMode: 'overlay'}}>
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency={frecuencia} numOctaves={2} seed={seed} stitchTiles="stitch" />
            {/* Monocromo: el grano de color delata el filtro barato. */}
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope={0} intercept={1} />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter={`url(#${id})`} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
