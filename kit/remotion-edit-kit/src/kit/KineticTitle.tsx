// Título cinético: cada palabra o carácter sube desde detrás de una máscara.
// Stagger = todas las piezas leen la misma curva con retraso (anim(frame - i·d)).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, expoOut, materialExit, springAt, type SpringName} from './ease';
import {COLOR, FONT, SOMBRA_TEXTO_BLANCO} from './constants';

export type KineticTitleProps = {
  /** Texto; '\n' separa líneas. */
  texto: string;
  /** 'palabra' para líneas largas; 'caracter' para 1-3 palabras de peso. */
  por?: 'palabra' | 'caracter';
  /** Fotogramas entre piezas: 1-2 por carácter, 2-3 por palabra (más de 4-5 f se siente lento). */
  stagger?: number;
  /** Fotograma de inicio dentro de la secuencia. */
  delay?: number;
  fontSize?: number;
  color?: string;
  peso?: number;
  /** Palabras (índice global, contando desde 0) que van en color de acento. */
  acentos?: number[];
  colorAcento?: string;
  /**
   * Desplazamiento inicial en Y como fracción de la altura de línea.
   * 0,4-0,6: con más, la pieza viaja demasiado y se lee tarde.
   */
  desplazamiento?: number;
  /** Spring de la subida. sinRebote (damping 18): el rebote en texto es tic de IA. */
  muelle?: SpringName;
  /** Tracking hero: el interletrado se cierra de 0,3 em al final en 40 f con expoOut. */
  trackingHero?: boolean;
  /** Interletrado final en em. SF Pro ya viene apretada: −0,02 como mucho. */
  tracking?: number;
  /** Fotograma de salida (relativo). La salida es más corta que la entrada (60 %). */
  salida?: number;
  /** Sombra suave para texto oscuro sobre blanco (nunca plano). */
  sombra?: string;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
};

export const KineticTitle: React.FC<KineticTitleProps> = ({
  texto,
  por = 'palabra',
  stagger,
  delay = 0,
  fontSize = 120,
  color = COLOR.tinta,
  peso = 800,
  acentos = [],
  colorAcento = COLOR.acento,
  desplazamiento = 0.55,
  muelle = 'sinRebote',
  trackingHero = false,
  tracking = -0.02,
  salida,
  sombra = SOMBRA_TEXTO_BLANCO,
  align = 'center',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = stagger ?? (por === 'caracter' ? 1 : 3);
  const lineas = texto.split('\n').map((l) => l.split(' ').filter(Boolean));
  const lh = fontSize * 1.08;

  const ls = trackingHero ? interpolate(frame - delay, [0, 40], [0.3, tracking], {easing: expoOut, ...clamp}) : tracking;

  // Salida: todas las piezas a la vez hacia arriba con curva de salida, 60 % de la entrada.
  const progSalida = salida === undefined ? 0 : interpolate(frame, [salida, salida + 8], [0, 1], {easing: materialExit, ...clamp});

  let indicePieza = 0;
  let indicePalabra = 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', ...style}}>
      <div style={{textAlign: align, fontFamily: FONT, fontWeight: peso, fontSize, lineHeight: `${lh}px`, letterSpacing: `${ls}em`, color}}>
        {lineas.map((palabras, li) => (
          <div key={li} style={{whiteSpace: 'nowrap'}}>
            {palabras.map((palabra, pi) => {
              const iPal = indicePalabra++;
              const colorPal = acentos.includes(iPal) ? colorAcento : color;
              const piezas = por === 'caracter' ? Array.from(palabra) : [palabra];
              return (
                <span key={pi}>
                  {/* Máscara por palabra: overflow hidden con aire para ascendentes y descendentes. */}
                  <span style={{display: 'inline-block', overflow: 'hidden', padding: `${fontSize * 0.12}px 0.02em`, margin: `${-fontSize * 0.12}px 0`, verticalAlign: 'top'}}>
                    {piezas.map((pieza, ci) => {
                      const i = indicePieza++;
                      const p = springAt(frame, fps, delay + i * d, muelle);
                      const yIn = (1 - p) * desplazamiento * lh;
                      const yOut = -progSalida * lh * 1.1;
                      return (
                        <span
                          key={ci}
                          style={{
                            display: 'inline-block',
                            translate: `0 ${yIn + yOut}px`,
                            color: colorPal,
                            textShadow: sombra,
                            opacity: interpolate(frame - delay - i * d, [0, 4], [0, 1], clamp),
                          }}
                        >
                          {pieza}
                        </span>
                      );
                    })}
                  </span>
                  {pi < palabras.length - 1 ? ' ' : null}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
