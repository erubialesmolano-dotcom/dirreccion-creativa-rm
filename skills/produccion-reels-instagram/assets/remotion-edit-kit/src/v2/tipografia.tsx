// Tipografía v2: fuentes reales cargadas (no la de sistema), jerarquía en cada línea y animación por
// letra con solape. Lo que delata a Claude: un solo peso, todo centrado, todas las palabras igual.
// Aquí: la palabra clave cambia de familia o peso y de tamaño, cada letra llega 1 f después que la
// anterior con su propia curva, y el bloque respira después de entrar.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as cargarInter} from '@remotion/google-fonts/Inter';
import {loadFont as cargarSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as cargarGrotesk} from '@remotion/google-fonts/SpaceGrotesk';

export const SANS = cargarInter('normal', {weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const SERIF = cargarSerif('normal', {subsets: ['latin', 'latin-ext']}).fontFamily;
export const SERIF_IT = cargarSerif('italic', {subsets: ['latin', 'latin-ext']}).fontFamily;
export const GROTESK = cargarGrotesk('normal', {weights: ['500', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type Palabra = {
  t: string;
  /** fotograma de entrada (de la voz) */
  at: number;
  /** jerarquía: 0 normal, 1 acento (más peso), 2 clave (serif itálica más grande, color) */
  nivel?: 0 | 1 | 2;
};

export type EntradaLetra = 'palabra' | 'sube' | 'mascara' | 'escala' | 'desenfoque';

/**
 * Línea de texto cinética por letra. Cada letra entra `escalon` f después de la anterior (1 f por
 * defecto) con expo out (solo con `porLetra`; por defecto entra palabra a palabra, enfocándose); las de nivel 2 van en
 * serif itálica 1,25× más grandes. Después de entrar, la línea deriva 1-2 % (no se congela).
 */
export const LineaCinetica: React.FC<{
  palabras: Palabra[];
  x?: number;
  y?: number;
  tam?: number;
  color?: string;
  acento?: string;
  alinear?: 'left' | 'center';
  entrada?: EntradaLetra;
  escalon?: number;
  durLetra?: number;
  sombra?: string;
  /** fuentes de la marca (por defecto Inter + Instrument Serif itálica) */
  fuente?: string;
  fuenteAcento?: string;
  pesos?: [number, number, number];
  /** animar letra a letra (barrido izquierda → derecha). Erik lo detecta como «hecho por Claude»: solo si se pide */
  porLetra?: boolean;
  /** el texto se acerca después de entrar (1 = 1,5 %). Delata a Claude: 0 por defecto */
  acercar?: number;
}> = ({palabras, x = 80, y = 900, tam = 96, color = '#0B0B0C', acento = '#C2412D', alinear = 'left', entrada = 'palabra', escalon = 1, durLetra = 9, sombra, fuente = SANS, fuenteAcento = SERIF_IT, pesos = [600, 800, 400], porLetra = false, acercar = 0}) => {
  const f = useCurrentFrame();
  const t0 = palabras[0]?.at ?? 0;
  const deriva = interpolate(f, [t0, t0 + 120], [0, 1], cl);
  return (
    <div
      style={{
        position: 'absolute',
        left: alinear === 'center' ? 0 : x,
        right: alinear === 'center' ? 0 : undefined,
        top: y,
        textAlign: alinear,
        transform: `translateY(-50%) scale(${1 + 0.015 * acercar * deriva})`,
        transformOrigin: alinear === 'center' ? '50% 50%' : '0% 50%',
        lineHeight: 1.02,
        letterSpacing: -tam * 0.03,
        color,
        textShadow: sombra,
      }}
    >
      {palabras.map((p, i) => {
        const nivel = p.nivel ?? 0;
        const fam = nivel === 2 ? fuenteAcento : fuente;
        const peso = pesos[nivel];
        const tt = nivel === 2 ? tam * 1.25 : tam;
        return (
          <span key={i} style={{display: 'inline-block', whiteSpace: 'nowrap', marginRight: tam * 0.24, fontFamily: fam, fontWeight: peso, fontSize: tt, color: nivel === 2 ? acento : color, verticalAlign: 'baseline'}}>
            {porLetra ? (
              [...p.t].map((c, j) => {
                const a = p.at + j * escalon;
                const pr = interpolate(f, [a, a + durLetra], [0, 1], {...cl, easing: Easing.bezier(0.16, 1, 0.3, 1)});
                let st: React.CSSProperties = {};
                if (entrada === 'mascara') st = {transform: `translateY(${(1 - pr) * 105}%)`};
                if (entrada === 'sube') st = {transform: `translateY(${(1 - pr) * 40}px)`, opacity: pr};
                if (entrada === 'escala') st = {transform: `scale(${0.4 + 0.6 * pr})`, opacity: Math.min(1, pr * 2)};
                if (entrada === 'desenfoque' || entrada === 'palabra') st = {filter: `blur(${(1 - pr) * 12}px)`, opacity: pr};
                return (
                  <span key={j} style={{display: 'inline-block', overflow: entrada === 'mascara' ? 'hidden' : undefined, verticalAlign: 'bottom', paddingBottom: entrada === 'mascara' ? tt * 0.12 : 0}}>
                    <span style={{display: 'inline-block', whiteSpace: 'pre', ...st}}>{c}</span>
                  </span>
                );
              })
            ) : (
              <EntradaPalabra f={f} at={p.at} dur={durLetra} modo={entrada}>
                {p.t}
              </EntradaPalabra>
            )}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Entrada de una palabra entera (no letra a letra), como en las referencias: aparece desenfocada y
 * se enfoca subiendo un poco. La máscara es de borde suave (degradado del 40 % + desenfoque), nunca
 * una línea dura que se vea. Sin rebotes ni temblores.
 */
const EntradaPalabra: React.FC<{f: number; at: number; dur: number; modo: EntradaLetra; children: string}> = ({f, at, dur, modo, children}) => {
  const pr = interpolate(f, [at, at + dur], [0, 1], {...cl, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const blur = (1 - pr) * (modo === 'mascara' ? 6 : 10);
  const st: React.CSSProperties = {display: 'inline-block', whiteSpace: 'pre', filter: blur > 0.05 ? `blur(${blur}px)` : undefined};
  if (modo === 'mascara') {
    // degradado vertical que sube: el borde del revelado mide el 40 % de la línea
    const pos = 140 - pr * 140; // a pr=0 la palabra está entera oculta (antes asomaba el 40 % de abajo)
    const m = `linear-gradient(180deg, transparent ${pos - 40}%, #000 ${pos}%)`;
    return <span style={{...st, transform: `translateY(${(1 - pr) * 0.25}em)`, WebkitMaskImage: m, maskImage: m}}>{children}</span>;
  }
  if (modo === 'escala') return <span style={{...st, opacity: pr, transform: `scale(${0.92 + 0.08 * pr})`}}>{children}</span>;
  return <span style={{...st, opacity: pr, transform: `translateY(${(1 - pr) * 0.18}em)`}}>{children}</span>;
};

