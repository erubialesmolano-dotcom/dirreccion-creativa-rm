// Assets reales v2: fotos, recortes con alfa, vídeo y capturas de UI. Nada de placeholders vectoriales.
// - Foto: recorte de la fuente en px de la imagen original, sombra de contacto + ambiente (dos capas,
//   como una foto real sobre una mesa), borde de papel opcional, curvatura de luz del papel.
// - Recorte: PNG con alfa (scripts/recortar.py con rembg) con borde de pegatina que sigue la silueta
//   (feMorphology) y sombra que sigue el alfa (drop-shadow), no una caja.
// - Clip: vídeo real con speed ramp por remapeo de tiempo (Freeze), como el time remap de AE.
// - PantallaEn: captura de UI pegada en las 4 esquinas de una pantalla fotografiada (homografía).
import React, {useId} from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {keys, type Key} from './curvas';

const src = (s: string) => (s.startsWith('http') || s.startsWith('data:') ? s : staticFile(s));

/** Sombra realista de un objeto plano a `altura` (0 = apoyado, 1 = levantado): contacto + ambiente. */
export const sombraReal = (altura = 0.3, dureza = 1) => {
  const a = Math.max(0, altura);
  const contacto = `0 ${1 + a * 3}px ${2 + a * 4}px rgba(0,0,0,${(0.28 * dureza) * (1 - a * 0.6)})`;
  const media = `0 ${4 + a * 18}px ${10 + a * 30}px rgba(0,0,0,${0.18 * dureza})`;
  const ambiente = `0 ${12 + a * 50}px ${30 + a * 90}px rgba(0,0,0,${0.14 * dureza * (0.6 + a)})`;
  return `${contacto}, ${media}, ${ambiente}`;
};

export type Recuadro = {x: number; y: number; w: number; h: number};

/**
 * Foto real con recorte (como el rectángulo de máscara de AE). `fuente` son las dimensiones de la
 * imagen original y `recorte` el rectángulo a mostrar en px de la original. Se escala a `ancho`.
 */
export const Foto: React.FC<{
  img: string;
  fuente: {w: number; h: number};
  recorte?: Recuadro;
  ancho: number;
  x?: number;
  y?: number;
  rot?: number;
  altura?: number;
  borde?: number; // borde blanco de papel en px (0 = sin borde)
  radio?: number;
  papel?: boolean; // reflejo suave del papel fotográfico
  style?: React.CSSProperties;
}> = ({img, fuente, recorte, ancho, x = 0, y = 0, rot = 0, altura = 0.3, borde = 0, radio = 0, papel = true, style}) => {
  const r = recorte ?? {x: 0, y: 0, w: fuente.w, h: fuente.h};
  const k = (ancho - borde * 2) / r.w;
  const alto = r.h * k + borde * 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - ancho / 2,
        top: y - alto / 2,
        width: ancho,
        height: alto,
        transform: `rotate(${rot}deg)`,
        background: borde ? '#FBFAF7' : 'transparent',
        borderRadius: radio,
        boxShadow: sombraReal(altura),
        padding: borde,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: Math.max(0, radio - borde)}}>
        <Img
          src={src(img)}
          style={{position: 'absolute', left: -r.x * k, top: -r.y * k, width: fuente.w * k, height: fuente.h * k, maxWidth: 'none'}}
        />
        {papel ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(115deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,.06) 100%)',
              mixBlendMode: 'soft-light',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

/**
 * Recorte de sujeto (PNG con alfa). `pegatina` = grosor del borde blanco que sigue la silueta
 * (estilo collage de papel: 8-16 px). La sombra usa el alfa, así que abraza la forma.
 */
export const Recorte: React.FC<{
  img: string;
  ancho: number;
  x?: number;
  y?: number;
  rot?: number;
  pegatina?: number;
  altura?: number;
  style?: React.CSSProperties;
}> = ({img, ancho, x = 0, y = 0, rot = 0, pegatina = 0, altura = 0.35, style}) => {
  const id = 'rc' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const a = Math.max(0, altura);
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y, width: ancho, transform: `translateY(-50%) rotate(${rot}deg)`, ...style}}>
      {pegatina > 0 ? (
        <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" operator="dilate" radius={pegatina} result="d" />
            <feGaussianBlur in="d" stdDeviation={0.6} result="ds" />
            <feFlood floodColor="#FCFBF8" />
            <feComposite in2="ds" operator="in" result="borde" />
            <feMerge>
              <feMergeNode in="borde" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </svg>
      ) : null}
      <Img
        src={src(img)}
        style={{
          width: '100%',
          display: 'block',
          filter: [
            pegatina > 0 ? `url(#${id})` : '',
            `drop-shadow(0 ${1 + a * 3}px ${2 + a * 3}px rgba(0,0,0,.30))`,
            `drop-shadow(0 ${8 + a * 30}px ${14 + a * 40}px rgba(0,0,0,.22))`,
          ].join(' '),
        }}
      />
    </div>
  );
};

/**
 * Vídeo real con time remap. `tiempo` son keyframes [fotograma de la composición → fotograma del
 * clip]. Speed ramp clásico: rápido, frena a cámara lenta en el golpe y vuelve a acelerar.
 * Sin `tiempo`, reproduce normal desde `inicio`.
 */
export const Clip: React.FC<{
  video: string;
  inicio?: number;
  tiempo?: Key[];
  style?: React.CSSProperties;
  volumen?: number;
}> = ({video, inicio = 0, tiempo, style, volumen = 0}) => {
  const f = useCurrentFrame();
  const v = (
    <OffthreadVideo
      src={src(video)}
      volume={volumen}
      muted={volumen === 0}
      style={{width: '100%', height: '100%', objectFit: 'cover', ...style}}
    />
  );
  if (!tiempo) {
    return (
      <AbsoluteFill>
        <Sequence from={-inicio} layout="none">
          {v}
        </Sequence>
      </AbsoluteFill>
    );
  }
  const fc = Math.max(0, Math.round(keys(f, tiempo)));
  return (
    <AbsoluteFill>
      <Freeze frame={fc}>{v}</Freeze>
    </AbsoluteFill>
  );
};

/**
 * Speed ramp listo: `golpe` es el fotograma donde va lento. Antes y después va a `rapido`×, en el
 * golpe a `lento`×. Devuelve los keyframes de tiempo para <Clip tiempo={...}>.
 */
export const rampa = (golpe: number, {rapido = 2.4, lento = 0.2, entrada = 8, salida = 8, dur = 90, inicio = 0} = {}): Key[] => {
  const a = golpe - entrada;
  const b = golpe + salida;
  const tA = inicio + a * rapido;
  const tG = tA + entrada * ((rapido + lento) / 2);
  const tB = tG + salida * lento;
  const tFin = tB + (dur - b) * rapido;
  return [
    {f: 0, v: inicio, velOut: 1, infOut: 0.1},
    {f: a, v: tA, velIn: 1, velOut: 1, infIn: 0.1, infOut: 0.6},
    {f: golpe, v: tG, velIn: lento / ((rapido + lento) / 2), velOut: 1, infIn: 0.6, infOut: 0.3},
    {f: b, v: tB, velIn: 1, velOut: 1, infIn: 0.3, infOut: 0.5},
    {f: dur, v: tFin, velIn: 1, infIn: 0.1},
  ];
};

/** Homografía de 4 puntos → matrix3d (cosechada de Webild). Esquinas: sup-izq, sup-der, inf-der, inf-izq. */
export const homografia = (w: number, h: number, d: [number, number][]) => {
  const s = [[0, 0], [w, 0], [w, h], [0, h]];
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = s[i];
    const [u, v] = d[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const k = A[r][c] / A[c][c];
      for (let j = c; j < 8; j++) A[r][j] -= k * A[c][j];
      b[r] -= k * b[c];
    }
  }
  const x = b.map((v, i) => v / A[i][i]);
  return `matrix3d(${x[0]},${x[3]},0,${x[6]},${x[1]},${x[4]},0,${x[7]},0,0,1,0,${x[2]},${x[5]},0,1)`;
};

/**
 * Pega contenido (captura de UI, vídeo de pantalla) en las 4 esquinas de una pantalla real
 * fotografiada. `esquinas` en px de la composición. Añade el reflejo del cristal encima.
 */
export const PantallaEn: React.FC<{w: number; h: number; esquinas: [number, number][]; reflejo?: number; children: React.ReactNode}> = ({
  w,
  h,
  esquinas,
  reflejo = 0.12,
  children,
}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: homografia(w, h, esquinas)}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>{children}</div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(125deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 35%)',
        opacity: reflejo,
        mixBlendMode: 'screen',
      }}
    />
  </div>
);
