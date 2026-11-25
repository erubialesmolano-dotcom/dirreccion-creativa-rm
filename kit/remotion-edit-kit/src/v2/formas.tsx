// Motion graphics de shape layers (v2). Todo lo que en AE sería trim paths, máscaras y track mattes.
// Reglas de oficio que siguen estos componentes:
// - Un trazo hecho a mano no es perfecto: el círculo se pasa de largo (cierra un 10-18 % más allá),
//   el subrayado ondula, el rotulador tiene borde irregular y opacidad que varía.
// - Lo que se dibuja arranca rápido y frena (expo out), y la punta lleva la vista: la flecha se
//   dibuja y la cabeza aparece al llegar, con un pequeño rebote por inercia.
// - Nada aparece entero de golpe; nada se queda sin moverse una vez dibujado (respira 1-2 %).
import React, {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {evolvePath, getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {inercia, keys, ruido1, azar, type Key} from './curvas';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const expoOut = Easing.bezier(0.16, 1, 0.3, 1);

export type EstiloTrazo = 'linea' | 'rotulador' | 'pespunte' | 'tiza';

/** Filtro de "rotulador": borde irregular (desplazamiento por turbulencia) y algo de textura. */
const FiltroMano: React.FC<{id: string; fuerza?: number; semilla?: number}> = ({id, fuerza = 2.5, semilla = 3}) => (
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={semilla} result="t" />
    <feDisplacementMap in="SourceGraphic" in2="t" scale={fuerza} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

/**
 * Trazo que se dibuja (trim path). `progreso` puede ser un número 0-1 o keyframes [f → 0..1].
 * Por defecto se dibuja de `desde` a `desde + dur` con expo out.
 */
export const Trazo: React.FC<{
  d: string;
  desde?: number;
  dur?: number;
  progreso?: Key[];
  color?: string;
  grosor?: number;
  estilo?: EstiloTrazo;
  inicio?: number; // trim start (0-1), para que la cola también avance si se quiere
  w?: number;
  h?: number;
  sombra?: boolean;
}> = ({d, desde = 0, dur = 14, progreso, color = '#E8432E', grosor = 10, estilo = 'rotulador', inicio = 0, w = 1080, h = 1920, sombra = false}) => {
  const f = useCurrentFrame();
  const id = 'tz' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const p = progreso ? keys(f, progreso) : interpolate(f, [desde, desde + dur], [0, 1], {...cl, easing: expoOut});
  if (p <= 0) return null;
  const largo = getLength(d);
  const visible = Math.max(0, p - inicio) * largo;
  const ev = {strokeDasharray: `${visible} ${largo}`, strokeDashoffset: -inicio * largo};
  const comun = {d, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <defs>
        {estilo === 'rotulador' || estilo === 'tiza' ? <FiltroMano id={id} fuerza={estilo === 'tiza' ? 5 : 2.5} /> : null}
        {estilo === 'pespunte' ? (
          <mask id={id + 'm'} maskUnits="userSpaceOnUse">
            <path {...comun} {...ev} stroke="#fff" strokeWidth={grosor * 6} />
          </mask>
        ) : null}
      </defs>
      {estilo === 'pespunte' ? (
        // cosecha de Costura (APZ): puntadas de 16 px con 10 px de hueco, sombra y agujeros de aguja
        <g mask={`url(#${id}m)`}>
          <path {...comun} stroke="rgba(0,0,0,.35)" strokeWidth={grosor * 0.55} strokeDasharray="2 24" strokeDashoffset={-19} />
          <path {...comun} stroke="rgba(0,0,0,.28)" strokeWidth={grosor} strokeDasharray="16 10" transform="translate(0 2)" />
          <path {...comun} stroke={color} strokeWidth={grosor} strokeDasharray="16 10" />
        </g>
      ) : (
        <g filter={estilo === 'rotulador' || estilo === 'tiza' ? `url(#${id})` : undefined}>
          {sombra ? <path {...comun} {...ev} stroke="rgba(0,0,0,.25)" strokeWidth={grosor} transform="translate(0 3)" /> : null}
          <path {...comun} {...ev} stroke={color} strokeWidth={grosor} opacity={estilo === 'tiza' ? 0.85 : 1} />
        </g>
      )}
    </svg>
  );
};

/** Punta del trazo en el fotograma: para que la cámara o una etiqueta sigan lo que se dibuja. */
export const puntaDe = (d: string, p: number) => {
  const L = getLength(d);
  const pt = getPointAtLength(d, Math.max(0, Math.min(1, p)) * L);
  const tg = getTangentAtLength(d, Math.max(0, Math.min(1, p)) * L);
  return {x: pt?.x ?? 0, y: pt?.y ?? 0, ang: (Math.atan2(tg?.y ?? 0, tg?.x ?? 1) * 180) / Math.PI};
};

/**
 * Flecha dibujada a mano: el cuerpo se traza con expo out y la cabeza (dos trazos) aparece al llegar
 * con un rebote proporcional a la velocidad de llegada (inercia).
 */
export const Flecha: React.FC<{
  d: string;
  desde?: number;
  dur?: number;
  color?: string;
  grosor?: number;
  cabeza?: number;
  estilo?: EstiloTrazo;
}> = ({d, desde = 0, dur = 16, color = '#E8432E', grosor = 9, cabeza = 34, estilo = 'rotulador'}) => {
  const f = useCurrentFrame();
  const fin = puntaDe(d, 1);
  const llegada = desde + dur * 0.55; // con expo out, a mitad de duración ya ha recorrido ~95 %
  const vel = 0.9; // la punta llega rápido: la cabeza sale con un poco de rebote
  const sc = f < llegada ? 0 : Math.min(1.15, interpolate(f, [llegada, llegada + 4], [0, 1], cl) + inercia(f, llegada + 4, vel * 0.12, {freq: 3, decay: 9}));
  const a = (fin.ang * Math.PI) / 180;
  const ala = (s: number) => `M ${fin.x} ${fin.y} L ${fin.x - Math.cos(a + s * 0.5) * cabeza} ${fin.y - Math.sin(a + s * 0.5) * cabeza}`;
  return (
    <>
      <Trazo d={d} desde={desde} dur={dur} color={color} grosor={grosor} estilo={estilo} />
      {sc > 0 ? (
        <div style={{position: 'absolute', inset: 0, transformOrigin: `${fin.x}px ${fin.y}px`, transform: `scale(${sc})`}}>
          <Trazo d={`${ala(1)} ${ala(-1)}`} progreso={[{f: 0, v: 1}]} color={color} grosor={grosor} estilo={estilo} />
        </div>
      ) : null}
    </>
  );
};

/**
 * Círculo de énfasis hecho a mano alrededor de (cx, cy): elipse algo inclinada que se pasa de largo
 * al cerrar (`pasada` 0,1-0,2) y cuyo radio varía un poco (no es un círculo de compás).
 */
export const CirculoEnfasis: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  desde?: number;
  dur?: number;
  color?: string;
  grosor?: number;
  pasada?: number;
  semilla?: number;
}> = ({cx, cy, rx, ry, desde = 0, dur = 14, color = '#E8432E', grosor = 8, pasada = 0.14, semilla = 1}) => {
  const n = 48;
  const giro = -0.35 + azar(semilla) * 0.3; // empieza arriba a la izquierda, como se dibuja a mano
  const incl = (azar(semilla, 2) - 0.5) * 0.25;
  const pts = Array.from({length: n + 1}, (_, i) => {
    const t = giro + (i / n) * Math.PI * 2 * (1 + pasada);
    const r = 1 + 0.05 * ruido1(i * 0.4, semilla) + (i / n) * 0.06; // espiral leve: el final no cae encima del inicio
    const x = Math.cos(t) * rx * r;
    const y = Math.sin(t) * ry * r;
    return [cx + x * Math.cos(incl) - y * Math.sin(incl), cy + x * Math.sin(incl) + y * Math.cos(incl)];
  });
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return <Trazo d={d} desde={desde} dur={dur} color={color} grosor={grosor} estilo="rotulador" />;
};

/** Subrayado a mano bajo un texto: ondula un poco y sube al final, se dibuja en 6-8 f. */
export const Subrayado: React.FC<{x0: number; x1: number; y: number; desde?: number; dur?: number; color?: string; grosor?: number; semilla?: number}> = ({
  x0,
  x1,
  y,
  desde = 0,
  dur = 7,
  color = '#E8432E',
  grosor = 9,
  semilla = 2,
}) => {
  const n = 16;
  const d = Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const yy = y + ruido1(t * 6, semilla) * 3 - t * t * 8;
    return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${yy.toFixed(1)}`;
  }).join(' ');
  return <Trazo d={d} desde={desde} dur={dur} color={color} grosor={grosor} estilo="rotulador" />;
};

/**
 * Caja de llamada: línea guía desde el punto señalado, y la caja de texto que se abre a lo ancho
 * (máscara) cuando la línea llega. El texto entra 2 f después que la caja (acción solapada).
 */
export const CajaLlamada: React.FC<{
  punto: [number, number];
  caja: [number, number];
  texto: string;
  desde?: number;
  fondo?: string;
  color?: string;
  fuente?: string;
  tam?: number;
}> = ({punto, caja, texto, desde = 0, fondo = '#0B0B0C', color = '#fff', fuente = 'Inter, sans-serif', tam = 44}) => {
  const f = useCurrentFrame();
  const codo: [number, number] = [caja[0], punto[1]];
  const d = `M ${punto[0]} ${punto[1]} L ${codo[0]} ${codo[1]} L ${caja[0]} ${caja[1]}`;
  const abre = interpolate(f, [desde + 8, desde + 16], [0, 1], {...cl, easing: expoOut});
  const txt = interpolate(f, [desde + 10, desde + 18], [0, 1], {...cl, easing: expoOut});
  const pulso = interpolate((f - desde) % 30, [0, 30], [0, 1], cl);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: punto[0] - 9,
          top: punto[1] - 9,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: fondo,
          transform: `scale(${interpolate(f, [desde, desde + 5], [0, 1], {...cl, easing: expoOut})})`,
          boxShadow: `0 0 0 ${pulso * 16}px rgba(0,0,0,${(1 - pulso) * 0.25})`,
        }}
      />
      <Trazo d={d} desde={desde + 2} dur={9} color={fondo} grosor={4} estilo="linea" />
      <div
        style={{
          position: 'absolute',
          left: caja[0],
          top: caja[1] - tam * 0.95,
          padding: `${tam * 0.3}px ${tam * 0.5}px`,
          background: fondo,
          color,
          fontFamily: fuente,
          fontWeight: 600,
          fontSize: tam,
          letterSpacing: -0.5,
          whiteSpace: 'nowrap',
          clipPath: `inset(0 ${(1 - abre) * 100}% 0 0)`,
          boxShadow: '0 10px 30px rgba(0,0,0,.25)',
        }}
      >
        <span style={{display: 'inline-block', transform: `translateY(${(1 - txt) * 30}%)`, opacity: txt}}>{texto}</span>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Gráfico de barras que crece: cada barra con retardo (stagger no lineal: las primeras más juntas)
 * y llegada con inercia proporcional a su altura. La cifra cuenta con expo out.
 */
export const BarrasCrecen: React.FC<{
  valores: number[];
  x: number;
  base: number;
  ancho: number;
  alto: number;
  desde?: number;
  color?: string;
  etiquetas?: string[];
  fuente?: string;
}> = ({valores, x, base, ancho, alto, desde = 0, color = '#0B0B0C', etiquetas, fuente = 'Inter, sans-serif'}) => {
  const f = useCurrentFrame();
  const max = Math.max(...valores);
  const n = valores.length;
  const gap = ancho * 0.25 / n;
  const bw = (ancho - gap * (n - 1)) / n;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {valores.map((v, i) => {
        const a = desde + Math.round(Math.pow(i, 0.85) * 3);
        const d = 14 + i;
        const p = interpolate(f, [a, a + d], [0, 1], {...cl, easing: Easing.bezier(0.3, 0, 0.1, 1)});
        const vLleg = (v / max) * 0.06;
        const hh = (v / max) * alto * (p + (f > a + d ? inercia(f, a + d, vLleg, {freq: 2.2, decay: 7}) : 0));
        const cifra = Math.round(v * interpolate(f, [a, a + d + 6], [0, 1], {...cl, easing: expoOut}));
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x + i * (bw + gap), top: base - hh, width: bw, height: hh, background: color, borderRadius: '6px 6px 0 0'}} />
            <div style={{position: 'absolute', left: x + i * (bw + gap), width: bw, top: base - hh - 56, textAlign: 'center', fontFamily: fuente, fontWeight: 700, fontSize: 40, color, opacity: p}}>
              {cifra}
            </div>
            {etiquetas ? (
              <div style={{position: 'absolute', left: x + i * (bw + gap), width: bw, top: base + 14, textAlign: 'center', fontFamily: fuente, fontSize: 28, color: '#55555c', opacity: p}}>
                {etiquetas[i]}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Ruta en un mapa (cosecha de MapaCamino, APZ): `mapa` son paths SVG del contorno; `ruta` se dibuja
 * con trazo discontinuo, la cámara sigue la punta y acaba entrando en el destino con curva
 * exponencial; pin con pulso al llegar.
 */
export const RutaMapa: React.FC<{
  mapa: string[];
  ruta: string;
  desde?: number;
  dur?: number;
  entra?: number; // fotograma en que la cámara entra en el destino
  w?: number;
  h?: number;
  tinta?: string;
  fondo?: string;
  acento?: string;
  etiqueta?: string;
}> = ({mapa, ruta, desde = 0, dur = 40, entra, w = 1080, h = 1920, tinta = '#A9A298', fondo = '#F6F3EE', acento = '#C2412D', etiqueta}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [desde, desde + dur], [0, 1], {...cl, easing: Easing.bezier(0.45, 0, 0.2, 1)});
  const punta = puntaDe(ruta, p);
  const fin = puntaDe(ruta, 1);
  const e = entra === undefined ? 0 : interpolate(f, [entra, entra + 14], [0, 1], {...cl, easing: Easing.in(Easing.exp)});
  // cámara: sigue la punta a medias (suavizado) y deriva; al final entra
  const camX = (punta.x - w / 2) * 0.35;
  const camY = (punta.y - h / 2) * 0.35;
  const s = 1.05 + 0.08 * p + e * 8;
  const fx = camX + (fin.x - w / 2 - camX) * Math.min(1, e * 1.4);
  const fy = camY + (fin.y - h / 2 - camY) * Math.min(1, e * 1.4);
  const pin = interpolate(f, [desde + dur - 4, desde + dur + 4], [0, 1], {...cl, easing: expoOut});
  const pul = ((f - desde - dur) % 24) / 24;
  return (
    <AbsoluteFill style={{background: fondo, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s}) translate(${-fx}px, ${-fy}px)`, transformOrigin: `${w / 2 + fx}px ${h / 2 + fy}px`}}>
        <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {mapa.map((m, i) => (
            <path key={i} d={m} fill="#ECE6DC" stroke={tinta} strokeWidth={2} />
          ))}
          <path d={ruta} fill="none" stroke={acento} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${p * getLength(ruta)} 99999`} />
          <circle cx={punta.x} cy={punta.y} r={p > 0 && p < 1 ? 9 : 0} fill={acento} />
        </svg>
        {pin > 0 ? (
          <div style={{position: 'absolute', left: fin.x - 14, top: fin.y - 14, width: 28, height: 28, borderRadius: 14, background: acento, transform: `scale(${pin})`, boxShadow: `0 0 0 ${pul * 22}px rgba(194,65,45,${(1 - pul) * 0.35})`}} />
        ) : null}
        {etiqueta ? (
          <div style={{position: 'absolute', left: fin.x + 28, top: fin.y - 22, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 34, color: '#1b1b1d', opacity: pin, whiteSpace: 'nowrap'}}>{etiqueta}</div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Texto (o cualquier forma SVG) como máscara de un contenido: vídeo o foto dentro de las letras.
 * Es el track matte alfa de AE. `forma` son hijos SVG (<text>, <path>…) en coordenadas de la comp.
 */
export const DentroDe: React.FC<{forma: React.ReactNode; children: React.ReactNode; w?: number; h?: number}> = ({forma, children, w = 1080, h = 1920}) => {
  const id = 'mt' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
        <defs>
          <clipPath id={id} clipPathUnits="userSpaceOnUse">
            {forma}
          </clipPath>
        </defs>
      </svg>
      <AbsoluteFill style={{clipPath: `url(#${id})`, width: w, height: h}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Track matte con una imagen (PNG con alfa o en escala de grises). `modo` 'alfa' usa la
 * transparencia; 'luma' la luminancia (blanco = se ve). `invertir` hace el matte invertido de AE.
 */
export const TrackMatte: React.FC<{mate: string; modo?: 'alfa' | 'luma'; invertir?: boolean; tam?: string; pos?: string; children: React.ReactNode}> = ({
  mate,
  modo = 'alfa',
  invertir = false,
  tam = 'cover',
  pos = 'center',
  children,
}) => {
  const style: React.CSSProperties & Record<string, string> = {
    WebkitMaskImage: `url(${mate})`,
    maskImage: `url(${mate})`,
    WebkitMaskSize: tam,
    maskSize: tam,
    WebkitMaskPosition: pos,
    maskPosition: pos,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    maskMode: modo === 'luma' ? 'luminance' : 'alpha',
    maskComposite: invertir ? 'exclude' : 'add',
  };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Barrido de forma: un círculo (u otra forma) que crece desde un punto y descubre B (máscara). */
export const revelaCirculo = (f: number, desde: number, dur: number, cx: number, cy: number, rMax = 2300) =>
  `circle(${interpolate(f, [desde, desde + dur], [0, rMax], {...cl, easing: Easing.bezier(0.7, 0, 0.2, 1)})}px at ${cx}px ${cy}px)`;

/** Evolución de un path a un progreso (re-export práctico). */
export {evolvePath};
