// Lamas de cristal acanalado (medido por Erik al píxel en referencias):
// lamas de 285 px con filo doble a 18 px; una onda blanca las cruza y cada
// lama se enciende en los fotogramas 0, 3, 5, 7, 10, 12 y 12 y se apaga con
// coseno en 8 f. Bajo el blanco de cada lama se cambia de A a B: el corte no se ve.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, cosFade} from './ease';

/** Encendidos medidos por lama (fotogramas). */
export const ENCENDIDOS_LAMAS = [0, 3, 5, 7, 10, 12, 12];

export type GlassSlatsProps = {
  a: React.ReactNode;
  b: React.ReactNode;
  /** Grosor de lama en px (medido: 285). */
  lama?: number;
  /** Separación del filo doble en px (medido: 18). */
  filo?: number;
  /** Fotograma de encendido de cada lama. Si hay más lamas, se extrapola con el último paso. */
  encendidos?: number[];
  /** Apagado del blanco con coseno, en fotogramas (medido: 8). */
  apagado?: number;
  /**
   * 'horizontal': bandas apiladas a lo largo de los 1920 px (7 lamas = las 7
   * medidas). 'vertical': costillas a lo largo de los 1080 px (4 lamas).
   */
  orientacion?: 'horizontal' | 'vertical';
  /** La onda cruza en sentido contrario (de abajo arriba o de derecha a izquierda). */
  invertir?: boolean;
  /** Aumento de la refracción dentro de cada lama (1,1 = 10 %): rompe la imagen en tiras. */
  refraccion?: number;
  /** Fotogramas que tarda el cristal en desaparecer tras la última lama. */
  salidaCristal?: number;
};

export const GlassSlats: React.FC<GlassSlatsProps> = ({
  a,
  b,
  lama = 285,
  filo = 18,
  encendidos = ENCENDIDOS_LAMAS,
  apagado = 8,
  orientacion = 'horizontal',
  invertir = false,
  refraccion = 1.12,
  salidaCristal = 6,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const horizontal = orientacion === 'horizontal';
  const largo = horizontal ? height : width;
  const n = Math.ceil(largo / lama);
  const paso = encendidos.length > 1 ? Math.max(1, encendidos[encendidos.length - 1] - encendidos[encendidos.length - 2]) : 2;
  const onsetDe = (i: number) => (i < encendidos.length ? encendidos[i] : encendidos[encendidos.length - 1] + paso * (i - encendidos.length + 1));
  const ultimo = onsetDe(n - 1);
  const fin = ultimo + apagado;
  // Intensidad del cristal: entero mientras pasa la onda, se disuelve al final.
  const g = interpolate(frame, [fin - 2, fin - 2 + salidaCristal], [1, 0], clamp);

  if (frame < 0) return <AbsoluteFill>{a}</AbsoluteFill>;
  if (g <= 0) return <AbsoluteFill>{b}</AbsoluteFill>;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {Array.from({length: n}, (_, idx) => {
        const i = invertir ? n - 1 - idx : idx;
        const inicio = idx * lama;
        const onset = onsetDe(i);
        const contenido = frame >= onset ? b : a;
        const blanco = cosFade(frame - onset, apagado);
        const centro = inicio + lama / 2;
        const s = 1 + (refraccion - 1) * g;
        const caja: React.CSSProperties = horizontal
          ? {left: 0, top: inicio, width, height: lama}
          : {left: inicio, top: 0, width: lama, height};
        // Dentro de la lama el contenido se amplía en el eje corto alrededor de su centro: tiras desalineadas.
        const escala = horizontal ? `1 ${s}` : `${s} 1`;
        const origen = horizontal ? `50% ${centro}px` : `${centro}px 50%`;
        const dirSombra = horizontal ? '180deg' : '90deg';
        return (
          <div key={idx} style={{position: 'absolute', overflow: 'hidden', ...caja}}>
            <div
              style={{
                position: 'absolute',
                left: horizontal ? 0 : -inicio,
                top: horizontal ? -inicio : 0,
                width,
                height,
                scale: escala,
                transformOrigin: origen,
                filter: `blur(${1.2 * g}px)`,
              }}
            >
              {contenido}
            </div>
            {/* Sombreado cilíndrico de la costilla: luz en un canto, sombra en el otro. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: g,
                background: `linear-gradient(${dirSombra}, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,.14) 100%)`,
              }}
            />
            {/* Filo doble: dos líneas finas separadas `filo` px en el canto de la lama. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: g,
                background: horizontal
                  ? `linear-gradient(180deg, rgba(255,255,255,.75) 0 2px, transparent 2px ${filo}px, rgba(255,255,255,.45) ${filo}px ${filo + 2}px, transparent ${filo + 2}px)`
                  : `linear-gradient(90deg, rgba(255,255,255,.75) 0 2px, transparent 2px ${filo}px, rgba(255,255,255,.45) ${filo}px ${filo + 2}px, transparent ${filo + 2}px)`,
              }}
            />
            {/* La onda blanca: se enciende de golpe y se apaga con coseno. */}
            {blanco > 0 ? <div style={{position: 'absolute', inset: 0, background: '#FFFFFF', opacity: blanco}} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
