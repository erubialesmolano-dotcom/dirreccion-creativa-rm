// Constantes del formato y utilidades compartidas por todo el kit.

/** Reel vertical 9:16. */
export const W = 1080;
export const H = 1920;
export const FPS = 30;

/**
 * Zonas seguras de Reels (1080×1920): 220 px arriba (cabecera), 420 abajo
 * (descripción, audio, botones) y la columna de iconos a la derecha.
 * TikTok es más permisivo (108/320, 60 izq., 120 der.): si cumples Reels con
 * 120 px a la derecha, cumples los dos. Verificar siempre en la app.
 */
export const SAFE = {top: 220, bottom: 420, left: 60, right: 120} as const;

/** Tipografía: SF Pro Display en la máquina de Erik; Inter Display como respaldo libre. */
export const FONT = '"SF Pro Display", "Inter Display", Inter, "Helvetica Neue", Arial, sans-serif';
export const FONT_MONO = '"SF Mono", "JetBrains Mono", "DejaVu Sans Mono", monospace';

/** Paleta base del vocabulario de Erik. */
export const COLOR = {
  blanco: '#FFFFFF',
  papel: '#F2F2F4',
  tinta: '#0A0A0B',
  gris: '#ADADB4',
  cuadricula: 'rgba(20, 20, 30, 0.07)',
  acento: '#38BDF8',
} as const;

/** Sombra de texto negro sobre blanco (validada por Erik: nunca plano). */
export const SOMBRA_TEXTO_BLANCO = '0 5px 16px rgba(0,0,0,.16), 0 1px 3px rgba(0,0,0,.14)';
/** Sombra de texto blanco sobre foto: oscura y difusa. */
export const SOMBRA_TEXTO_FOTO = '0 2px 6px rgba(0,0,0,.55), 0 6px 28px rgba(0,0,0,.45)';
/** Sombra de pieza o tarjeta sobre blanco (validada por Erik). */
export const SOMBRA_PIEZA = '0 22px 44px rgba(0,0,0,.30), 0 6px 14px rgba(0,0,0,.18)';

export type Rect = {x: number; y: number; w: number; h: number; radius?: number};
export type Punto = {x: number; y: number};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Desenfoque por velocidad (regla de Erik): 0,16 px por px de desplazamiento
 * por fotograma, con tope. 0 si |v| < 1 px/f para que lo quieto quede nítido.
 */
export const blurPorVelocidad = (v: number, factor = 0.16, tope = 9) =>
  Math.abs(v) < 1 ? 0 : Math.min(tope, Math.abs(v) * factor);

/** Segundos → fotograma redondeado. */
export const sAf = (s: number, fps = FPS) => Math.round(s * fps);
