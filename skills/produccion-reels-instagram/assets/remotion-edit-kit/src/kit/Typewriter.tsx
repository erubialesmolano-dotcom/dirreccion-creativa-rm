// Texto que se escribe con cursor. Ritmo humano determinista: cada carácter
// tiene una duración ligeramente distinta (random(seed)) y la puntuación pausa.
import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {COLOR, FONT} from './constants';

export type TypewriterProps = {
  texto: string;
  /** Fotograma en que empieza a escribir. */
  inicio?: number;
  /** Fotogramas por carácter. 2 f = 15 car/s: se sigue leyendo mientras se escribe. */
  fpc?: number;
  /** Variación del ritmo (0-1). 0,6: humano sin parecer torpe. 0 = máquina. */
  humanizar?: number;
  /** Pausa extra tras , . : ? ! en fotogramas (como respira quien escribe). */
  pausaPuntuacion?: number;
  /** 'barra' tipo iOS; 'bloque' tipo terminal. */
  cursor?: 'barra' | 'bloque' | 'ninguno';
  /** Periodo de parpadeo del cursor en reposo: 30 f = 1 Hz (encendido la mitad). Fijo mientras escribe. */
  parpadeo?: number;
  colorCursor?: string;
  fontSize?: number;
  color?: string;
  peso?: number;
  fuente?: string;
  /** Ancho máximo antes de partir línea. */
  anchoMax?: number;
  seed?: string;
  style?: React.CSSProperties;
};

/** Fotograma (relativo a `inicio`) en que aparece cada carácter. */
export const tiemposTecleo = (texto: string, fpc: number, humanizar: number, pausa: number, seed: string) => {
  const t: number[] = [];
  let acc = 0;
  Array.from(texto).forEach((ch, i) => {
    t.push(Math.round(acc));
    const jitter = 1 + humanizar * (random(`${seed}-${i}`) - 0.5) * 2;
    acc += Math.max(0.5, fpc * jitter) + (/[,.;:?!…]/.test(ch) ? pausa : 0);
  });
  return t;
};

export const Typewriter: React.FC<TypewriterProps> = ({
  texto,
  inicio = 0,
  fpc = 2,
  humanizar = 0.6,
  pausaPuntuacion = 6,
  cursor = 'barra',
  parpadeo = 30,
  colorCursor = '#0A84FF',
  fontSize = 64,
  color = COLOR.tinta,
  peso = 600,
  fuente = FONT,
  anchoMax = 880,
  seed = 'tecleo',
  style,
}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(texto);
  const tiempos = React.useMemo(() => tiemposTecleo(texto, fpc, humanizar, pausaPuntuacion, seed), [texto, fpc, humanizar, pausaPuntuacion, seed]);
  const rel = frame - inicio;
  const n = tiempos.filter((t) => t <= rel).length;
  const escribiendo = rel >= 0 && n < chars.length;
  const finEscritura = tiempos[tiempos.length - 1] ?? 0;
  // Fijo mientras escribe; en reposo parpadea (encendido la primera mitad del periodo).
  const fase = (rel - finEscritura) % parpadeo;
  const cursorVisible = cursor !== 'ninguno' && rel >= 0 && (escribiendo || fase < parpadeo / 2);
  return (
    <div style={{maxWidth: anchoMax, fontFamily: fuente, fontWeight: peso, fontSize, lineHeight: 1.18, color, whiteSpace: 'pre-wrap', ...style}}>
      {chars.slice(0, n).join('')}
      <span
        style={{
          display: 'inline-block',
          width: cursor === 'bloque' ? '0.55em' : Math.max(3, fontSize * 0.07),
          height: '1.05em',
          marginLeft: cursor === 'bloque' ? 2 : fontSize * 0.04,
          verticalAlign: '-0.14em',
          background: colorCursor,
          borderRadius: cursor === 'barra' ? 2 : 0,
          opacity: cursorVisible ? 1 : 0,
        }}
      />
    </div>
  );
};
