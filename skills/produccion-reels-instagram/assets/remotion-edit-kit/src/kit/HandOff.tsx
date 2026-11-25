// Concatenar planos: el último elemento de A es el primero de B. Un elemento
// viaja de su sitio en A a su sitio en B a través del corte, en arco (curvas
// distintas en X e Y) y con el tamaño interpolado en logarítmico.
// Modo `ventana`: "pequeño → grande como fondo": el elemento se abre y es la
// ventana al plano siguiente hasta llenar la pantalla.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {aeInfluence, clamp, expScale, firmaErik} from './ease';
import {clamp01, lerp, type Rect} from './constants';
import {DirBlur} from './DirBlur';

export type HandOffProps = {
  /** Escena A, SIN el elemento (lo pinta HandOff). En modo ventana, CON él. */
  a: React.ReactNode;
  /** Escena B, SIN el elemento. */
  b: React.ReactNode;
  /** Fotograma del corte A→B. En modo ventana se ignora: B queda de fondo al llenar la pantalla. */
  corte: number;
  /** Rectángulo del elemento en A. */
  desde: Rect;
  /** Rectángulo del elemento en B. En modo ventana, por defecto pantalla completa. */
  hasta?: Rect;
  /** Contenido del elemento (se estira al rectángulo: diséñalo fluido). */
  elemento?: React.ReactNode;
  /** Fotogramas de viaje. 14-20 f: transición de pantalla completa (15-30 f a 30 fps). */
  viaje?: number;
  /** Fotogramas del viaje que ocurren antes del corte. Por defecto la mitad: el corte cae en el pico de velocidad. */
  antesDelCorte?: number;
  /** Curva en X. Distinta de la de Y para que la trayectoria sea un arco, no una recta. */
  curvaX?: (t: number) => number;
  curvaY?: (t: number) => number;
  /** Curva del tamaño. */
  curvaTam?: (t: number) => number;
  /**
   * El elemento se abre y muestra B a través (pequeño → grande como fondo).
   * En este modo A SÍ pinta el elemento (es parte del plano); HandOff lo
   * sustituye desde el inicio del viaje con `desde` = su rectángulo exacto.
   */
  ventana?: boolean;
  /** Sombra del elemento mientras viaja. */
  sombra?: string;
  /** Estela por velocidad: px por px/f (0,08: se nota en el pico, nítido al llegar). */
  factorEstela?: number;
};

export const HandOff: React.FC<HandOffProps> = ({
  a,
  b,
  corte,
  desde,
  hasta,
  elemento,
  viaje = 18,
  antesDelCorte,
  curvaX = aeInfluence(0.55, 0.9),
  curvaY = firmaErik,
  curvaTam = firmaErik,
  ventana = false,
  sombra = '0 30px 60px rgba(0,0,0,.28), 0 8px 18px rgba(0,0,0,.18)',
  factorEstela = 0.08,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const destino: Rect = hasta ?? {x: 0, y: 0, w: width, h: height, radius: 0};
  const inicio = corte - (antesDelCorte ?? Math.round(viaje / 2));
  const t = (f: number) => clamp01((f - inicio) / viaje);

  const rectEn = (f: number) => {
    const u = t(f);
    const ex = curvaX(u);
    const ey = curvaY(u);
    const es = curvaTam(u);
    const w = expScale(desde.w, destino.w, es);
    const h = expScale(desde.h, destino.h, es);
    // El centro viaja con curvas distintas en X e Y → arco.
    const cx = lerp(desde.x + desde.w / 2, destino.x + destino.w / 2, ex);
    const cy = lerp(desde.y + desde.h / 2, destino.y + destino.h / 2, ey);
    return {x: cx - w / 2, y: cy - h / 2, w, h, radius: lerp(desde.radius ?? 0, destino.radius ?? 0, es)};
  };
  const r = rectEn(frame);
  const r0 = rectEn(frame - 1);
  const vx = r.x + r.w / 2 - (r0.x + r0.w / 2);
  const vy = r.y + r.h / 2 - (r0.y + r0.h / 2);
  const estela = (v: number) => (Math.abs(v) < 1 ? 0 : Math.min(6, Math.abs(v) * factorEstela));

  const fin = inicio + viaje;
  const fondo = ventana ? (frame < fin ? a : b) : frame < corte ? a : b;
  const viajando = frame >= inicio && frame < fin;
  // En modo ventana, A ya incluye el elemento: HandOff solo lo sustituye mientras viaja.
  const mostrarElemento = ventana ? frame >= inicio && frame < fin : true;

  // En modo ventana, B se ve a través del elemento en coordenadas de pantalla,
  // con un leve 1,12 → 1 para que la profundidad acompañe a la apertura.
  const escalaB = interpolate(t(frame), [0, 1], [1.12, 1], {easing: curvaTam, ...clamp});
  const opElemento = ventana ? interpolate(t(frame), [0, 0.35], [1, 0], clamp) : 1;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {fondo}
      {mostrarElemento ? (
        <DirBlur x={viajando ? estela(vx) : 0} y={viajando ? estela(vy) : 0}>
          <div
            style={{
              position: 'absolute',
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              borderRadius: r.radius,
              overflow: 'hidden',
              boxShadow: sombra,
            }}
          >
            {ventana ? (
              <div style={{position: 'absolute', left: -r.x, top: -r.y, width, height, scale: String(escalaB)}}>{b}</div>
            ) : null}
            {elemento ? <div style={{position: 'absolute', inset: 0, opacity: opElemento}}>{elemento}</div> : null}
          </div>
        </DirBlur>
      ) : null}
    </AbsoluteFill>
  );
};
