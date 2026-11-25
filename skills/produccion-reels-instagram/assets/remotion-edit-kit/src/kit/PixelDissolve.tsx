// Disolución en bloques de píxel: B aparece por celdas en un orden
// pseudoaleatorio determinista (random(seed) de Remotion), con sesgo opcional
// en una dirección para que se lea como una onda y no como ruido.
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from './ease';

export type PixelDissolveProps = {
  a: React.ReactNode;
  b: React.ReactNode;
  /** Fotograma de inicio (relativo a la secuencia). */
  inicio?: number;
  /** Duración. 12-18 f: más corto parece fallo de códec; más largo, salvapantallas. */
  duracion?: number;
  /** Lado de la celda en px. 72 en 1080 = 15 columnas: se lee "píxel" sin ser mosaico grueso. */
  bloque?: number;
  /** Dirección del sesgo. 'ninguna' = puro aleatorio. */
  direccion?: 'ninguna' | 'arriba' | 'abajo' | 'izquierda' | 'derecha' | 'centro';
  /** Peso del sesgo direccional frente al azar (0-1). 0,55 = onda con borde roto. */
  sesgo?: number;
  /** Color del frente: las celdas recién cambiadas parpadean con este color 2 f. null = sin frente. */
  colorFrente?: string | null;
  seed?: string;
};

export const PixelDissolve: React.FC<PixelDissolveProps> = ({
  a,
  b,
  inicio = 0,
  duracion = 15,
  bloque = 72,
  direccion = 'abajo',
  sesgo = 0.55,
  colorFrente = '#FFFFFF',
  seed = 'pixel',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  // Avanza a escalones de fotograma: la disolución digital no tiene subfotogramas.
  const p = interpolate(frame, [inicio, inicio + duracion], [0, 1.08], clamp);
  if (p <= 0) return <AbsoluteFill>{a}</AbsoluteFill>;
  if (p >= 1.08) return <AbsoluteFill>{b}</AbsoluteFill>;

  const cols = Math.ceil(width / bloque);
  const filas = Math.ceil(height / bloque);
  let dentro = '';
  let frente = '';
  const ventanaFrente = 2 / duracion;
  for (let r = 0; r < filas; r++) {
    for (let c = 0; c < cols; c++) {
      const azar = random(`${seed}-${r}-${c}`);
      const u = c / (cols - 1);
      const v = r / (filas - 1);
      const pos =
        direccion === 'abajo' ? v : direccion === 'arriba' ? 1 - v : direccion === 'derecha' ? u : direccion === 'izquierda' ? 1 - u
        : direccion === 'centro' ? Math.min(1, Math.hypot(u - 0.5, (v - 0.5) * (height / width)) * 1.6) : azar;
      const umbral = direccion === 'ninguna' ? azar : pos * sesgo + azar * (1 - sesgo);
      if (umbral < p) {
        const rect = `M${c * bloque} ${r * bloque}h${bloque}v${bloque}h${-bloque}Z`;
        dentro += rect;
        if (colorFrente && umbral > p - ventanaFrente) frente += rect;
      }
    }
  }
  return (
    <AbsoluteFill>
      {a}
      {dentro ? <AbsoluteFill style={{clipPath: `path('${dentro}')`}}>{b}</AbsoluteFill> : null}
      {frente ? <AbsoluteFill style={{clipPath: `path('${frente}')`, background: colorFrente ?? undefined, opacity: 0.55}} /> : null}
    </AbsoluteFill>
  );
};
