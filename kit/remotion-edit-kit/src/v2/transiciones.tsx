// Transiciones v2. Todas reciben A y B como {node, from}: `from` es el fotograma del reloj propio de
// cada escena en el que empieza la transición, así la escena sigue moviéndose dentro (sin parones).
// Ninguna es un fundido ni un deslizamiento de manual: cada una tiene un motivo físico (cámara que
// pasa, luz que quema, señal que se rompe, un elemento que viaja de A a B).
import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {DirBlur} from '../kit/DirBlur';
import {geometrica, azar, curva, CALCOS} from './curvas';
import {Textura} from './texturas';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export type Escena = {node: React.ReactNode; from: number};

/** Pinta una escena con su reloj propio: en el fotograma f de la transición, la escena va por e.from + f. */
const Plano: React.FC<{e: Escena; f: number}> = ({e}) => (
  <Sequence from={-e.from} layout="none">
    {e.node}
  </Sequence>
);

/**
 * BARRIDO (cosecha APZ; calco N3 Db55l3zx7wS f549–571): tira de planos con velocidad geométrica
 * alrededor del corte (r = 0,82/f a 30 fps), desenfoque direccional proporcional a la velocidad y
 * destello cálido en el pico. `rellenos` = imágenes que pasan entre A y B.
 */
/** `perfil`: 'geometrica' (r = 0,82/f, cosechada) o 'latigo' (curva calcada de una referencia, p95 2,93 px). */
export const Barrido: React.FC<{a: Escena; b: Escena; rellenos?: string[]; eje?: 'x' | 'y'; dir?: 1 | -1; n?: number; w?: number; h?: number; perfil?: 'geometrica' | 'latigo'}> = ({
  a,
  b,
  rellenos = [],
  eje = 'y',
  dir = 1,
  n = 13,
  w = 1080,
  h = 1920,
  perfil = 'geometrica',
}) => {
  const f = useCurrentFrame();
  const paso = (eje === 'y' ? h : w) + 40;
  const D = paso * (rellenos.length + 1);
  const p01 = (t: number) => (perfil === 'latigo' ? curva(t, CALCOS.latigo, {dur: n}) : geometrica(t, n));
  const pos = p01(f) * D;
  const v = (p01(f + 0.5) - p01(f - 0.5)) * D;
  const leak = Math.max(0, 1 - Math.abs(f - n - 0.5) / 4);
  const caja = (p: number, child: React.ReactNode, key: string) =>
    Math.abs(p - pos) < paso ? (
      <AbsoluteFill key={key} style={{transform: eje === 'y' ? `translateY(${(p - pos) * dir}px)` : `translateX(${(p - pos) * dir}px)`, overflow: 'hidden'}}>
        {child}
      </AbsoluteFill>
    ) : null;
  const bl = Math.min(40, v * 0.12);
  return (
    <AbsoluteFill style={{background: '#0A0A0A', overflow: 'hidden'}}>
      <DirBlur x={eje === 'x' ? bl : 0} y={eje === 'y' ? bl : 0}>
        {caja(0, <Plano e={a} f={f} />, 'a')}
        {rellenos.map((s, i) => caja(paso * (i + 1), <Img src={staticFile(s)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />, 'r' + i))}
        {caja(D, <Plano e={b} f={f} />, 'b')}
      </DirBlur>
      <AbsoluteFill
        style={{
          opacity: leak * 0.85,
          mixBlendMode: 'screen',
          background: 'radial-gradient(60% 80% at 30% 40%, rgba(255,214,150,.95) 0%, rgba(232,120,60,.55) 40%, rgba(110,33,41,0) 80%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Duración total de Barrido para `n`: colócalo en una Sequence de 2n+2 que empieza n+1 f antes del corte. */
export const duracionBarrido = (n = 13) => 2 * n + 2;

/**
 * ZOOM CON DESENFOQUE RADIAL (zoom-through de verdad): la cámara entra en `punto` de A acelerando;
 * el desenfoque es radial (copias escaladas apiladas, como CC Radial Fast Blur), crece con la
 * velocidad y cae a 0 cuando B frena. Corte en el pico de velocidad.
 */
export const ZoomRadial: React.FC<{a: Escena; b: Escena; punto?: [number, number]; dur?: number; muestras?: number}> = ({a, b, punto = [540, 960], dur = 14, muestras = 7}) => {
  const f = useCurrentFrame();
  const mid = dur / 2;
  const fase = f < mid ? 'a' : 'b';
  const t = fase === 'a' ? interpolate(f, [0, mid], [0, 1], {...cl, easing: Easing.in(Easing.cubic)}) : interpolate(f, [mid, dur], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const s = fase === 'a' ? Math.pow(5, t) : Math.pow(0.35, 1 - t) ; // log: B llega desde 0,35× y frena a 1
  const vel = fase === 'a' ? t : 1 - t; // proxy de velocidad (0-1)
  const capa = (k: number) => {
    const sk = s * (1 + vel * 0.035 * k);
    return (
      <AbsoluteFill
        key={k}
        style={{
          transform: `scale(${sk})`,
          transformOrigin: `${punto[0]}px ${punto[1]}px`,
          opacity: k === 0 ? 1 : 0.55 / (k + 0.6),
          filter: k === 0 ? (vel > 0.3 ? `blur(${vel * 3}px)` : undefined) : `blur(${2 + vel * 6}px)`,
        }}
      >
        {fase === 'a' ? <Plano e={a} f={f} /> : <Plano e={b} f={f} />}
      </AbsoluteFill>
    );
  };
  const n = vel > 0.08 ? muestras + 3 : 1;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {Array.from({length: n}, (_, k) => capa(n - 1 - k))}
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, 1 - Math.abs(f - mid) / 2) * 0.35, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/** VIAJE (cosecha APZ, Erik 21/11): alejar · viajar con yaw · entrar. */
export const Viaje: React.FC<{a: Escena; b: Escena; alejar?: number; viajar?: number; entrar?: number; bg?: string; w?: number; h?: number}> = ({
  a,
  b,
  alejar = 14,
  viajar = 20,
  entrar = 14,
  bg = '#F2F1EF',
  w = 1080,
  h = 1920,
}) => {
  const f = useCurrentFrame();
  const io = Easing.bezier(0.65, 0, 0.35, 1);
  const lejos = 0.46;
  const D = w * 1.15;
  const t1 = interpolate(f, [0, alejar], [0, 1], {...cl, easing: io});
  const t2 = interpolate(f, [alejar, alejar + viajar], [0, 1], {...cl, easing: io});
  const t3 = interpolate(f, [alejar + viajar, alejar + viajar + entrar - 1], [0, 1], {...cl, easing: io});
  const s = (f >= alejar + viajar ? lejos + (1 - lejos) * t3 : 1 - (1 - lejos) * t1) * (1 - 0.06 * Math.sin(Math.PI * t2));
  const yaw = -8 * Math.sin(Math.PI * t2);
  const caja = (x: number): React.CSSProperties => ({
    position: 'absolute',
    left: x,
    top: 0,
    width: w,
    height: h,
    overflow: 'hidden',
    borderRadius: 34 * (1 - Math.max(t3, 1 - t1)),
    boxShadow: '0 50px 140px rgba(0,0,0,.22)',
    background: '#000',
  });
  return (
    <AbsoluteFill style={{background: bg, perspective: 2200, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s}) rotateY(${yaw}deg) translateX(${-t2 * D}px)`, transformStyle: 'preserve-3d'}}>
        <div style={caja(0)}>
          <Plano e={a} f={f} />
        </div>
        <div style={caja(D)}>
          <Plano e={b} f={f} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** ATRAVESAR (cosecha APZ): la cámara entra en lo oscuro de A y sale hacia atrás ya en B. */
export const Atravesar: React.FC<{a: Escena; b: Escena; punto: [number, number]; dur?: number}> = ({a, b, punto, dur = 16}) => {
  const f = useCurrentFrame();
  const mid = dur / 2;
  if (f < mid) {
    const t = interpolate(f, [0, mid], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
    return (
      <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${1 + 6 * t})`, transformOrigin: `${punto[0]}px ${punto[1]}px`, filter: `blur(${t * 14}px)`}}>
          <Plano e={a} f={f} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: '#0A0A0A', opacity: interpolate(f, [mid * 0.45, mid], [0, 1], cl)}} />
      </AbsoluteFill>
    );
  }
  const t = interpolate(f, [mid, dur], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1.35 - 0.35 * t})`, filter: `blur(${(1 - t) * 10}px)`}}>
        <Plano e={b} f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#0A0A0A', opacity: 1 - t}} />
    </AbsoluteFill>
  );
};

/**
 * FILM BURN: la emulsión se quema desde una esquina (textura burn_a, 24 f, screen) y el corte a B
 * ocurre cuando el quemado cubre el cuadro (f ≈ 15); B sale sobreexpuesto y se asienta.
 */
export const FilmBurn: React.FC<{a: Escena; b: Escena; dur?: number; corte?: number}> = ({a, b, dur = 24, corte = 15}) => {
  const f = useCurrentFrame();
  const exp = f < corte ? interpolate(f, [corte - 6, corte], [1, 1.8], cl) : interpolate(f, [corte, dur], [2.2, 1], {...cl, easing: Easing.out(Easing.quad)});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: `brightness(${exp}) saturate(${1 + (exp - 1) * 0.4})`}}>{f < corte ? <Plano e={a} f={f} /> : <Plano e={b} f={f} />}</AbsoluteFill>
      <Textura src="texturas/burn_a.mp4" duracion={24} modo="screen" opacidad={f < corte ? 1 : interpolate(f, [corte, dur], [1, 0], cl)} />
    </AbsoluteFill>
  );
};

/** LIGHT LEAK: un destello cálido barre el cuadro y el corte se esconde en su pico. */
export const LeakCorte: React.FC<{a: Escena; b: Escena; dur?: number}> = ({a, b, dur = 16}) => {
  const f = useCurrentFrame();
  const mid = Math.round(dur / 2);
  const o = interpolate(f, [0, mid, dur], [0, 1, 0], {...cl, easing: Easing.inOut(Easing.sin)});
  const x = interpolate(f, [0, dur], [-30, 130], cl);
  return (
    <AbsoluteFill>
      {f < mid ? <Plano e={a} f={f} /> : <Plano e={b} f={f} />}
      <Textura src="texturas/leak_a.mp4" duracion={150} modo="screen" opacidad={o} desfase={40} />
      <AbsoluteFill
        style={{
          mixBlendMode: 'screen',
          opacity: o,
          background: `radial-gradient(55% 70% at ${x}% 45%, rgba(255,236,200,.95) 0%, rgba(255,150,70,.55) 35%, rgba(255,80,40,0) 75%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * GLITCH: 4-6 f de señal rota. Separación RGB horizontal (dos copias teñidas en screen), franjas
 * desplazadas y un fotograma de B que se cuela antes del corte. Determinista.
 */
export const Glitch: React.FC<{a: Escena; b: Escena; dur?: number; fuerza?: number}> = ({a, b, dur = 6, fuerza = 1}) => {
  const f = useCurrentFrame();
  const mid = Math.floor(dur / 2);
  const cuela = f === mid - 1; // un fotograma de B antes del corte: el ojo lo registra como "salto"
  const e = f < mid && !cuela ? a : b;
  const k = (1 - Math.abs(f - mid + 0.5) / (dur / 2)) * fuerza;
  const sep = 18 * k;
  const franjas = Array.from({length: 7}, (_, i) => ({y: azar(i, f) * 100, h: 2 + azar(i, f + 9) * 9, dx: (azar(i, f + 3) - 0.5) * 160 * k}));
  const capa = (filtro: string, dx: number, modo?: React.CSSProperties['mixBlendMode']) => (
    <AbsoluteFill style={{transform: `translateX(${dx}px)`, filter: filtro, mixBlendMode: modo}}>
      <Plano e={e} f={f} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {k > 0.05 ? (
        <>
          {capa('url(#solo-r)', -sep)}
          {capa('url(#solo-g)', 0, 'screen')}
          {capa('url(#solo-b)', sep, 'screen')}
        </>
      ) : (
        capa('', 0)
      )}
      {franjas.map((s, i) => (
        <AbsoluteFill key={i} style={{clipPath: `inset(${s.y}% 0 ${Math.max(0, 100 - s.y - s.h)}% 0)`, transform: `translateX(${s.dx}px)`}}>
          <Plano e={e} f={f} />
        </AbsoluteFill>
      ))}
      <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
        <filter id="solo-r"><feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
        <filter id="solo-g"><feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
        <filter id="solo-b"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
      </svg>
    </AbsoluteFill>
  );
};

/** BARRIDO DE FORMA: B aparece dentro de un círculo que nace de `punto` (un elemento de A) y crece. */
export const Iris: React.FC<{a: Escena; b: Escena; punto: [number, number]; dur?: number; rMax?: number}> = ({a, b, punto, dur = 14, rMax = 2300}) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, dur], [0, rMax], {...cl, easing: Easing.bezier(0.7, 0, 0.2, 1)});
  const empuje = interpolate(f, [0, dur], [1, 1.12], {...cl, easing: Easing.in(Easing.quad)});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${empuje})`, transformOrigin: `${punto[0]}px ${punto[1]}px`}}>
        <Plano e={a} f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${r}px at ${punto[0]}px ${punto[1]}px)`, transform: `scale(${1.08 - 0.08 * (r / rMax)})`, transformOrigin: `${punto[0]}px ${punto[1]}px`}}>
        <Plano e={b} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * MATCH MOVE: un elemento (foto, logo, palabra) que está en A en `desdeRect` viaja a `hastaRect` en
 * B mientras los fondos cortan por debajo. El elemento hereda la velocidad (curva espejo: acelera
 * en A, frena en B; regla del relevo de Piqué) y lleva desenfoque por velocidad.
 */
export const MatchMove: React.FC<{
  a: Escena;
  b: Escena;
  elemento: React.ReactNode;
  desde: {x: number; y: number; w: number; rot?: number};
  hasta: {x: number; y: number; w: number; rot?: number};
  dur?: number;
}> = ({a, b, elemento, desde, hasta, dur = 18}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], {...cl, easing: Easing.bezier(0.75, 0, 0.25, 1)});
  const v = interpolate(f + 0.5, [0, dur], [0, 1], {...cl, easing: Easing.bezier(0.75, 0, 0.25, 1)}) - interpolate(f - 0.5, [0, dur], [0, 1], {...cl, easing: Easing.bezier(0.75, 0, 0.25, 1)});
  const x = desde.x + (hasta.x - desde.x) * t;
  const y = desde.y + (hasta.y - desde.y) * t;
  const w = desde.w * Math.pow(hasta.w / desde.w, t);
  const rot = (desde.rot ?? 0) + ((hasta.rot ?? 0) - (desde.rot ?? 0)) * t;
  const dist = Math.hypot(hasta.x - desde.x, hasta.y - desde.y);
  const ang = Math.atan2(hasta.y - desde.y, hasta.x - desde.x);
  const bl = Math.min(14, v * dist * 0.16);
  return (
    <AbsoluteFill>
      {t < 0.5 ? <Plano e={a} f={f} /> : <Plano e={b} f={f} />}
      <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translateY(-50%) rotate(${rot}deg)`}}>
        <DirBlur fill={false} x={Math.abs(Math.cos(ang)) * bl} y={Math.abs(Math.sin(ang)) * bl}>
          {elemento}
        </DirBlur>
      </div>
    </AbsoluteFill>
  );
};
