// Curvas v2: lo que hace un editor de After Effects en el editor de gráficas.
// - Varios keyframes por propiedad, cada uno con su influencia de entrada y salida (asimétricas).
// - Velocidad que no tiene por qué llegar a 0 en un keyframe intermedio (paso continuo, como en AE
//   cuando se arrastra el manejador sin "easy ease").
// - Overshoot proporcional a la velocidad de llegada (expresión de inercia de Dan Ebberts).
// - Acción secundaria: un hijo sigue al padre con retardo y algo menos de amortiguación.
// - Tablas medidas de una referencia (patrón de Hawkers v6): la curva es la de la ref, no una inventada.
// Todo es determinista: mismo fotograma, mismo valor.
import {Easing, interpolate} from 'remotion';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Keyframe estilo AE. `inf` = influencia (0-1) del manejador; `vel` = velocidad en el keyframe
 * como fracción de la velocidad media del tramo (0 = parada, 1 = sin frenar). Por defecto se para.
 */
export type Key = {
  f: number;
  v: number;
  /** Influencia de salida hacia el siguiente keyframe (0-1). AE "easy ease" = 0,33. */
  infOut?: number;
  /** Influencia de entrada desde el anterior (0-1). */
  infIn?: number;
  /** Velocidad al salir (0 = parado). Fracción de la velocidad media del tramo siguiente. */
  velOut?: number;
  /** Velocidad al llegar (0 = parado). Fracción de la velocidad media del tramo anterior. */
  velIn?: number;
};

/**
 * Bezier cúbica 1D del tramo: con manejadores (x = influencia, y = influencia·velocidad), igual que
 * convierte AE la gráfica de velocidad en gráfica de valor. Si velIn/velOut = 0, es un easy ease con
 * esa influencia; si son 1, el tramo arranca o llega sin frenar.
 */
const tramo = (a: Key, b: Key) => {
  const io = a.infOut ?? 0.33;
  const ii = b.infIn ?? 0.33;
  const vo = a.velOut ?? 0;
  const vi = b.velIn ?? 0;
  return Easing.bezier(io, io * vo, 1 - ii, 1 - ii * vi);
};

/** Valor en el fotograma `f` de una lista de keyframes (ordenados). */
export const keys = (f: number, ks: Key[]): number => {
  if (f <= ks[0].f) return ks[0].v;
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i];
    const b = ks[i + 1];
    if (f <= b.f) return interpolate(f, [a.f, b.f], [a.v, b.v], {...cl, easing: tramo(a, b)});
  }
  return ks[ks.length - 1].v;
};

/** Velocidad (unidades por fotograma) por diferencia central: sirve para desenfoque y overshoot. */
export const velocidad = (fn: (f: number) => number, f: number) => (fn(f + 0.5) - fn(f - 0.5));

/**
 * Inercia de Ebberts: después de llegar a `f1` con velocidad `v` (unidades/f), el valor oscila
 * `amp·v·sin(ω·t)/e^(decay·t)`. El rebote es proporcional a lo rápido que llegó: un elemento lento
 * casi no rebota; uno rápido rebota más. Valores de la expresión clásica: freq 2-3 Hz, decay 5-8.
 */
export const inercia = (
  f: number,
  f1: number,
  vLlegada: number,
  {freq = 2.5, decay = 6, fps = 30, amp = 1}: {freq?: number; decay?: number; fps?: number; amp?: number} = {},
) => {
  if (f <= f1) return 0;
  const t = (f - f1) / fps;
  const w = freq * Math.PI * 2;
  // la amplitud en unidades: v (unidades/f) → unidades/s, dividido por ω para que la pendiente inicial case
  return (amp * vLlegada * fps * Math.sin(w * t)) / Math.exp(decay * t) / w;
};

/**
 * Keyframes + inercia en la llegada al último keyframe: el overshoot sale de la velocidad real.
 * Para que haya rebote, el último keyframe debe llegar con `velIn` > 0 (no frenado del todo).
 */
export const keysConInercia = (f: number, ks: Key[], op?: Parameters<typeof inercia>[3]) => {
  const ult = ks[ks.length - 1];
  if (f <= ult.f) return keys(f, ks);
  const v = keys(ult.f, ks) - keys(ult.f - 1, ks);
  return ult.v + inercia(f, ult.f, v, op);
};

/**
 * Acción secundaria y solapada: el hijo llega `retardo` fotogramas después que el padre y con menos
 * amortiguación (rebota un poco más). `padre` es una función del fotograma.
 */
export const secundaria = (
  f: number,
  padre: (f: number) => number,
  {retardo = 2, extra = 0.35, fps = 30}: {retardo?: number; extra?: number; fps?: number} = {},
) => {
  const base = padre(f - retardo);
  // rebote extra proporcional a la aceleración del padre (lo que "arrastra" al hijo)
  const acel = padre(f - retardo) - 2 * padre(f - retardo - 1) + padre(f - retardo - 2);
  return base - acel * extra * (fps / 30) * 3;
};

/** Tabla [[fotograma, valor]] medida en una referencia (lineal entre muestras, como Hawkers v6). */
export const tablaRef = (f: number, t: [number, number][]) =>
  interpolate(
    f,
    t.map((x) => x[0]),
    t.map((x) => x[1]),
    cl,
  );

/** Remuestrea una tabla medida a otra cadencia: fotograma local a 30 fps → fotograma de la ref. */
export const aRef = (f: number, fpsRef: number, fps = 30) => (f * fpsRef) / fps;

/**
 * Velocidad geométrica alrededor de un corte (Barrido medido en N3: r = 0,82/f a 30 fps).
 * Devuelve la posición recorrida (0-1) en el fotograma k de 2n+1: acelera hasta el centro y frena.
 */
export const geometrica = (k: number, n: number, r = 0.82) => {
  const pesos = Array.from({length: 2 * n + 1}, (_, i) => Math.pow(r, Math.abs(i - n)));
  const total = pesos.reduce((a, b) => a + b, 0);
  const kk = Math.max(0, Math.min(2 * n + 1, k));
  const ent = Math.floor(kk);
  let s = 0;
  for (let i = 0; i < ent; i++) s += pesos[i];
  if (ent < 2 * n + 1) s += pesos[ent] * (kk - ent);
  return s / total;
};

/** Ruido 1D suave y determinista (suma de senos con fases fijas): para derivas y temblor de mano. */
export const ruido1 = (t: number, semilla = 0) =>
  (Math.sin(t * 1.0 + semilla * 12.9898) * 0.5 +
    Math.sin(t * 2.17 + semilla * 78.233) * 0.3 +
    Math.sin(t * 4.31 + semilla * 37.719) * 0.2);

/** Pseudoaleatorio determinista en [0,1) para posiciones de recortes, hojas, partículas. */
export const azar = (i: number, s = 0) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Curvas calcadas de referencias reales (calcar_camara.py + calco.py, p95 ≤ 4 px).
 * Normalizadas: f relativo al inicio del movimiento y v de 0 a 1; se escalan con `curva()`.
 * - zoomAlCorte: zoom que ACELERA hasta el corte (ease-in, sin asentarse): ×1,62 en 5 f a 30 fps.
 *   Calco dl_NxX7Ct f563-568: p95 1,83 px.
 * - asentamiento: paneo que sale disparado y frena en 6 f (ease-out fuerte). Calco dl_NxX7Ct f530-536.
 * - latigo: paneo látigo dentro del plano (alekaig, 25 fps pasado a 30): arranca sin rampa, hace el
 *   87 % del recorrido en 7 f y se posa el 13 % restante en 14 f; a la vez la escala BAJA un 3,6 %
 *   (se abre al barrer). Calco DfDFgp8NaKc f249-272: p95 2,93 px.
 */
export const CALCOS = {
  zoomAlCorte: {dur: 5, ks: [{f: 0, v: 0, infOut: 0.32, velOut: 0.03}, {f: 5, v: 1, infIn: 0.35, velIn: 2.42}] as Key[]},
  latigo: {dur: 21.5, ks: [{f: 0, v: 0, infOut: 0.01}, {f: 7.2, v: 0.866, infIn: 0.66, velIn: 0.045, infOut: 0.016, velOut: 0.045}, {f: 21.5, v: 1, infIn: 0.97}] as Key[], escala: -0.036},
  asentamiento: {dur: 6, ks: [{f: 0, v: 0, infOut: 0.33, velOut: 2.74}, {f: 6, v: 1, infIn: 0.3, velIn: 0.08}] as Key[]},
};

/** Aplica una curva calcada: empieza en `inicio`, dura `dur` (se estira en el tiempo) y va de `de` a `a`. */
export const curva = (f: number, c: {dur: number; ks: Key[]}, {inicio = 0, dur = c.dur, de = 0, a = 1} = {}) =>
  de + (a - de) * keys(((f - inicio) * c.dur) / dur, c.ks);
