// Texturas v2: capas de vídeo en bucle con modo de fusión, como un overlay en AE.
// Los vídeos están en public/texturas/ (scripts/generar_texturas.py). Si hay overlays escaneados
// de verdad, se sustituyen con el mismo nombre y todo sigue funcionando.
import React from 'react';
import {AbsoluteFill, Loop, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

type Modo = React.CSSProperties['mixBlendMode'];

/** Capa de textura en bucle. `desfase` mueve el arranque para que dos usos no coincidan. */
export const Textura: React.FC<{
  src: string;
  modo?: Modo;
  opacidad?: number;
  duracion: number; // fotogramas del vídeo de textura (para el bucle)
  desfase?: number;
  escala?: number;
  style?: React.CSSProperties;
}> = ({src, modo = 'overlay', opacidad = 1, duracion, desfase = 0, escala = 1, style}) => (
  <AbsoluteFill style={{mixBlendMode: modo, opacity: opacidad, pointerEvents: 'none', ...style}}>
    <Sequence from={-desfase} layout="none">
      <Loop durationInFrames={duracion}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${escala})`}}
        />
      </Loop>
    </Sequence>
  </AbsoluteFill>
);

/** Grano de película (overlay). 0,35-0,6 sobre foto; 0,2 sobre blanco para que no ensucie. */
export const Grano: React.FC<{opacidad?: number; modo?: Modo}> = ({opacidad = 0.45, modo = 'overlay'}) => (
  <Textura src="texturas/grano.mp4" duracion={60} modo={modo} opacidad={opacidad} />
);

/** Polvo y rayas (screen). Con moderación: 0,3-0,5. */
export const Polvo: React.FC<{opacidad?: number; desfase?: number}> = ({opacidad = 0.4, desfase = 0}) => (
  <Textura src="texturas/polvo.mp4" duracion={90} modo="screen" opacidad={opacidad} desfase={desfase} />
);

/** Light leak que respira (screen). Sobre foto cálida, 0,25-0,5; nunca constante: anima `opacidad`. */
export const LightLeak: React.FC<{opacidad?: number; desfase?: number; tono?: number}> = ({opacidad = 0.4, desfase = 0, tono = 0}) => (
  <Textura
    src="texturas/leak_a.mp4"
    duracion={150}
    modo="screen"
    opacidad={opacidad}
    desfase={desfase}
    style={tono ? {filter: `hue-rotate(${tono}deg)`} : undefined}
  />
);

/**
 * Viñeta y respiración de exposición: la luz de una imagen real nunca es fija.
 * `respira` = amplitud del parpadeo de exposición (0,01-0,03 ≈ flicker de proyector).
 */
export const Acabado: React.FC<{vineta?: number; respira?: number; calidez?: number}> = ({vineta = 0.35, respira = 0.015, calidez = 0}) => {
  const f = useCurrentFrame();
  const flick = 1 + respira * (Math.sin(f * 2.1) * 0.6 + Math.sin(f * 5.3 + 1) * 0.4);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 65% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vineta}) 100%)`}} />
      <AbsoluteFill style={{background: '#fff', mixBlendMode: 'soft-light', opacity: Math.max(0, flick - 1) * 6}} />
      {calidez ? <AbsoluteFill style={{background: calidez > 0 ? '#ff9d4d' : '#4d8bff', mixBlendMode: 'soft-light', opacity: Math.abs(calidez)}} /> : null}
    </AbsoluteFill>
  );
};

/**
 * Pila de acabado de "película": grano + polvo + viñeta + respiración. Ponla la última de la
 * composición (encima de todo menos de los subtítulos, que deben quedar limpios).
 */
export const Pelicula: React.FC<{grano?: number; polvo?: number; vineta?: number}> = ({grano = 0.45, polvo = 0.3, vineta = 0.3}) => (
  <>
    <Grano opacidad={grano} />
    {polvo > 0 ? <Polvo opacidad={polvo} /> : null}
    <Acabado vineta={vineta} />
  </>
);

/** Rampa de opacidad para un leak que entra, culmina y se va (no se queda fijo). */
export const pulsoLeak = (f: number, a: number, pico: number, b: number, max = 0.6) =>
  interpolate(f, [a, pico, b], [0, max, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
