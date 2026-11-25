// Tira de película horizontal que se desliza a velocidad constante.
// Lineal a propósito: es un mecanismo (ticker), no un gesto.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export type FilmStripProps = {
  /** Fotogramas de la tira (se repiten para cubrir el ancho). */
  items: React.ReactNode[];
  /** Alto de cada fotograma en px. */
  alto?: number;
  /** Ancho de cada fotograma en px. */
  ancho?: number;
  /** Velocidad en px/f. 8 px/f = 240 px/s: se distinguen los fotogramas. Negativa = hacia la derecha. */
  velocidad?: number;
  /** Inclinación de la tira en grados. −6°: dinamismo sin perder la horizontal. */
  inclinacion?: number;
  /** Centro vertical de la tira. */
  y?: number;
  colorCelulo?: string;
};

export const FilmStrip: React.FC<FilmStripProps> = ({
  items,
  alto = 420,
  ancho = 320,
  velocidad = 8,
  inclinacion = -6,
  y = 960,
  colorCelulo = '#111114',
}) => {
  const frame = useCurrentFrame();
  const borde = Math.round(alto * 0.14);
  const gap = 18;
  const celda = ancho + gap;
  const total = Math.max(items.length, 1) * celda;
  const repes = Math.ceil(2400 / total) + 1;
  const off = ((frame * velocidad) % total + total) % total;
  const perfo = `repeating-linear-gradient(90deg, transparent 0 14px, rgba(255,255,255,.92) 14px 36px, transparent 36px 50px)`;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: -700,
          top: y - (alto + borde * 2) / 2,
          width: 2480,
          height: alto + borde * 2,
          background: colorCelulo,
          rotate: `${inclinacion}deg`,
          boxShadow: '0 30px 60px rgba(0,0,0,.35)',
          overflow: 'hidden',
        }}
      >
        {/* Perforaciones arriba y abajo, que viajan con la tira. */}
        {[0, 1].map((k) => (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: -off % 50,
              width: 2600,
              top: k === 0 ? borde * 0.3 : alto + borde * 1.3,
              height: borde * 0.4,
              background: perfo,
              borderRadius: 4,
            }}
          />
        ))}
        <div style={{position: 'absolute', left: -off, top: borde, height: alto, display: 'flex', gap}}>
          {Array.from({length: repes}).flatMap((_, r) =>
            items.map((it, i) => (
              <div key={`${r}-${i}`} style={{width: ancho, height: alto, borderRadius: 10, overflow: 'hidden', flex: 'none', position: 'relative'}}>
                {it}
              </div>
            )),
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
