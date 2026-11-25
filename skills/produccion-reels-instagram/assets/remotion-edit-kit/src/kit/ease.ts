// Curvas y springs con nombre. Una curva por tipo de movimiento: nunca una global.
// Fuentes: skills/motion-remotion (SKILL.md §2-3 y references/curvas-timing.md).
import {Easing, interpolate, spring, type SpringConfig} from 'remotion';

/** Opciones de clamp para interpolate: siempre recortar fuera del rango. */
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Influencias de After Effects → bezier. Dos keyframes a velocidad 0 con
 * influencia de salida `a` y de entrada `b` (0-1) ≈ bezier(a, 0, 1-b, 1).
 * Pasada "diseñada": a 0,5-0,7 y b 0,6-0,8. Más de 0,85 se vuelve floaty.
 */
export const aeInfluence = (a: number, b: number) => Easing.bezier(a, 0, 1 - b, 1);

/** Entrada que decelera (Material emphasized decelerate). Para lo que llega a cuadro. */
export const materialEnter = Easing.bezier(0.05, 0.7, 0.1, 1);

/** Salida que acelera (Material). Dura el 50-80 % de la entrada. */
export const materialExit = Easing.bezier(0.3, 0, 0.8, 0.15);

/** Movimiento dentro de pantalla (Material standard). Para recolocar lo que ya se ve. */
export const standard = Easing.bezier(0.2, 0, 0, 1);

/**
 * Firma de Erik: lento-rápido-lento para lo que empieza y acaba en cuadro
 * (cámara dentro de la foto). 13-14 f a 24 fps ≈ 16-17 f a 30 fps.
 */
export const firmaErik = Easing.bezier(0.83, 0, 0.17, 1);
/** Duración de la firma de Erik a 30 fps (13,5 f a 24 fps / 0,8). */
export const FIRMA_ERIK_F30 = 17;

/** Ease-out exponencial (easeOutExpo). Para tracking que se cierra y cifras. */
export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);

/** Ease-in fuerte para el tramo que termina en un corte (zoom-through, whip). */
export const cutIn = Easing.bezier(0.55, 0, 1, 0.45);

/** Springs con nombre. Overshoot teórico: ζ = damping / (2·√(stiffness·mass)). */
export const springs = {
  /** ~10 % de overshoot: solo para el héroe de la escena. */
  popPremium: {damping: 14, stiffness: 180, mass: 0.8, overshootClamping: false},
  /** ~5 %: asentado elegante, para apoyos que deben sentirse físicos. */
  asentado: {damping: 14, stiffness: 100, mass: 1, overshootClamping: false},
  /** ~0 %: para todo lo demás (texto, UI, tarjetas secundarias). */
  sinRebote: {damping: 18, stiffness: 120, mass: 1, overshootClamping: true},
} satisfies Record<string, SpringConfig>;

export type SpringName = keyof typeof springs;

/** spring() con nombre y retardo en fotogramas. Devuelve 0 antes del retardo. */
export const springAt = (
  frame: number,
  fps: number,
  delay = 0,
  config: SpringName | Partial<SpringConfig> = 'sinRebote',
  durationInFrames?: number,
) =>
  spring({
    frame: frame - delay,
    fps,
    config: typeof config === 'string' ? springs[config] : config,
    durationInFrames,
  });

/** interpolate de dos puntos con curva y clamp: el caso del 90 %. */
export const tween = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  easing: (t: number) => number = standard,
) => interpolate(frame, [f0, f1], [v0, v1], {easing, ...clamp});

/** Escala exponencial: el tamaño se percibe en logarítmico, así que se interpola el log. */
export const expScale = (s0: number, s1: number, e: number) => s0 * Math.pow(s1 / s0, e);

/** Coseno de apagado: 1 → 0 en `dur` fotogramas, suave al final. */
export const cosFade = (t: number, dur: number) =>
  t < 0 ? 0 : t >= dur ? 0 : 0.5 * (1 + Math.cos((Math.PI * t) / dur));
