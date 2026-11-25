// Cifra que cuenta desde 0 y golpea al llegar.
// Regla de Erik: 14 f a 24 fps (≈ 18 f a 30), ease-out, punto de miles, números tabulares.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, expoOut} from './ease';
import {COLOR, FONT, SOMBRA_TEXTO_BLANCO} from './constants';

export type CountUpProps = {
  valor: number;
  desde?: number;
  /** Fotograma de inicio. */
  inicio?: number;
  /** Duración del conteo. 18 f a 30 fps (14 f a 24 fps, medida de Erik). */
  duracion?: number;
  decimales?: number;
  prefijo?: string;
  sufijo?: string;
  /** Escala del sufijo respecto a la cifra: se remarca con tamaño ("13" grande, "años" pequeño). */
  escalaSufijo?: number;
  /** Golpe al llegar: escala 1+golpe → 1 en 5 f. 0,1: se siente sin rebotar. 0 = sin golpe. */
  golpe?: number;
  fontSize?: number;
  color?: string;
  peso?: number;
  sombra?: string;
  /** Curva del conteo: ease-out exponencial, los últimos dígitos "frenan" y se leen. */
  curva?: (t: number) => number;
};

/** Formato español: punto de miles siempre (también en 4 cifras) y coma decimal. */
export const formatoES = (n: number, decimales = 0) => {
  const [ent, dec] = Math.abs(n).toFixed(decimales).split('.');
  const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (n < 0 ? '−' : '') + miles + (dec ? ',' + dec : '');
};

export const CountUp: React.FC<CountUpProps> = ({
  valor,
  desde = 0,
  inicio = 0,
  duracion = 18,
  decimales = 0,
  prefijo = '',
  sufijo = '',
  escalaSufijo = 0.42,
  golpe = 0.1,
  fontSize = 220,
  color = COLOR.tinta,
  peso = 800,
  sombra = SOMBRA_TEXTO_BLANCO,
  curva = expoOut,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [inicio, inicio + duracion], [desde, valor], {easing: curva, ...clamp});
  // Redondeo al decimal mostrado para que el último fotograma diga exactamente el valor.
  const f = Math.pow(10, decimales);
  const mostrado = Math.round(v * f) / f;
  const llegada = inicio + duracion;
  const s = golpe > 0 ? interpolate(frame, [llegada, llegada + 5], [1 + golpe, 1], clamp) : 1;
  const escala = frame >= llegada ? s : 1;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: fontSize * 0.06,
        fontFamily: FONT,
        fontWeight: peso,
        fontSize,
        lineHeight: 1,
        color,
        textShadow: sombra,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.03em',
        scale: String(escala),
        opacity: frame < inicio ? 0 : 1,
      }}
    >
      <span>
        {prefijo}
        {formatoES(mostrado, decimales)}
      </span>
      {sufijo ? <span style={{fontSize: fontSize * escalaSufijo, fontWeight: 700}}>{sufijo}</span> : null}
    </div>
  );
};
