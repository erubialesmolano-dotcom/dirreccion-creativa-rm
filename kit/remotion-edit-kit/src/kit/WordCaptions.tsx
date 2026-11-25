// Subtítulos palabra a palabra desde un words.json tipo Whisper.
// Una sola línea fija en zona segura: las palabras que aún no suenan ocupan su
// hueco (opacidad 0), así que la línea no se recoloca al crecer.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from './ease';
import {FONT, H, SAFE, SOMBRA_TEXTO_BLANCO, SOMBRA_TEXTO_FOTO, W} from './constants';

export type Word = {word: string; start: number; end: number};

export type WordCaptionsProps = {
  /** Palabras con tiempos en segundos (salida de Whisper / voz.mjs). */
  words: Word[];
  /** 'foto': blanco con sombra oscura difusa. 'blanco': negro con sombra suave (reglas de Erik). */
  modo?: 'foto' | 'blanco';
  /** Palabras clave (sin tildes ni mayúsculas importan) que van en color de acento. */
  claves?: string[];
  /** Color de acento. Por defecto depende del modo para mantener contraste ≥ 4,5:1. */
  acento?: string;
  /** Tamaño máximo en px. 72 px en 1080 de ancho se lee en móvil sin tapar la imagen. */
  fontSize?: number;
  /**
   * Máximo de caracteres por línea. 22 ≈ 2-4 palabras: se lee de un vistazo
   * (≤ 42 es el límite de subtítulo clásico; en reels se trocea más).
   */
  maxChars?: number;
  /** Pausa (s) que fuerza página nueva: respeta la respiración de la voz. */
  pausaCorte?: number;
  /** Centro vertical de la línea en px. 1290 ≈ 67 % del alto, por encima de los 420 px inferiores. */
  y?: number;
  /** 'palabra': cada palabra aparece al sonar. 'grupo': la línea entera a la vez. */
  revelar?: 'palabra' | 'grupo';
  /** Fotogramas que la línea se queda tras la última palabra si no hay otra detrás. */
  hold?: number;
  /** Duración del pop 1,18→1 con desenfoque 5→0 (validado por Erik: 3 f). */
  popFrames?: number;
  mayusculas?: boolean;
  /** Peso tipográfico. */
  peso?: number;
};

export type Pagina = {words: (Word & {f0: number; f1: number})[]; f0: number; f1: number};

/** Normaliza para comparar con las claves: minúsculas, sin tildes ni puntuación. */
export const normaliza = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '');

/** Agrupa las palabras en líneas: por caracteres, pausas y puntuación final. */
export const paginar = (
  words: Word[],
  fps: number,
  {maxChars = 22, pausaCorte = 0.35, hold = 12}: {maxChars?: number; pausaCorte?: number; hold?: number} = {},
): Pagina[] => {
  const paginas: Pagina[] = [];
  let actual: Pagina['words'] = [];
  let chars = 0;
  const cerrar = () => {
    if (actual.length) paginas.push({words: actual, f0: actual[0].f0, f1: actual[actual.length - 1].f1});
    actual = [];
    chars = 0;
  };
  words.forEach((w, i) => {
    const texto = w.word.trim();
    if (!texto) return;
    const largo = texto.length + (actual.length ? 1 : 0);
    const prev = words[i - 1];
    const pausa = prev ? w.start - prev.end : 0;
    if (actual.length && (chars + largo > maxChars || pausa > pausaCorte)) cerrar();
    actual.push({...w, word: texto, f0: Math.round(w.start * fps), f1: Math.round(w.end * fps)});
    chars += largo;
    if (/[.!?…:]$/.test(texto)) cerrar();
  });
  cerrar();
  // Cada página dura hasta que empieza la siguiente, con un tope de `hold` tras su última palabra.
  paginas.forEach((p, i) => {
    const siguiente = paginas[i + 1];
    p.f1 = siguiente ? Math.min(siguiente.f0, p.f1 + hold) : p.f1 + hold;
  });
  return paginas;
};

export const WordCaptions: React.FC<WordCaptionsProps> = ({
  words,
  modo = 'foto',
  claves = [],
  acento,
  fontSize = 72,
  maxChars = 22,
  pausaCorte = 0.35,
  y = 1290,
  revelar = 'palabra',
  hold = 12,
  popFrames = 3,
  mayusculas = false,
  peso = 800,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const paginas = React.useMemo(() => paginar(words, fps, {maxChars, pausaCorte, hold}), [words, fps, maxChars, pausaCorte, hold]);
  const pagina = paginas.find((p) => frame >= p.f0 && frame < p.f1);
  if (!pagina) return null;

  const clavesN = new Set(claves.map(normaliza));
  const color = modo === 'foto' ? '#FFFFFF' : '#0A0A0B';
  const colorAcento = acento ?? (modo === 'foto' ? '#38BDF8' : '#0B6BD3');
  const sombra = modo === 'foto' ? SOMBRA_TEXTO_FOTO : SOMBRA_TEXTO_BLANCO;
  // fitSize: si la línea no cabe en el ancho seguro, se reduce el cuerpo; nunca se desborda.
  const ancho = W - SAFE.left - SAFE.right;
  const caracteres = pagina.words.reduce((n, w) => n + w.word.length + 1, -1);
  const size = Math.min(fontSize, ancho / (Math.max(1, caracteres) * 0.58));

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          width: ancho,
          top: Math.min(y, H - SAFE.bottom - size) - size / 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: size * 0.3,
          whiteSpace: 'nowrap',
          fontFamily: FONT,
          fontWeight: peso,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {pagina.words.map((w, i) => {
          const f0 = revelar === 'palabra' ? w.f0 : pagina.f0;
          const t = frame - f0;
          const visible = t >= 0;
          const scale = interpolate(t, [0, popFrames], [1.18, 1], clamp);
          const blur = interpolate(t, [0, popFrames], [5, 0], clamp);
          const opacity = interpolate(t, [0, popFrames], [0, 1], clamp);
          const esClave = clavesN.has(normaliza(w.word));
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: visible ? opacity : 0,
                scale: String(scale),
                filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                color: esClave ? colorAcento : color,
                textShadow: sombra,
                textTransform: mayusculas ? 'uppercase' : undefined,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
