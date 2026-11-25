// Overlay de zonas seguras de Reels para revisar en el Studio.
// No se pinta al renderizar (salvo `forzar`), así que puede quedarse en la composición.
import React from 'react';
import {AbsoluteFill, getRemotionEnvironment} from 'remotion';
import {FONT, H, SAFE, W} from './constants';

export type SafeZoneGuideProps = {
  /** Píntalo también en el render (para un still de revisión). Por defecto no. */
  forzar?: boolean;
  /** Márgenes; por defecto los de Reels con la columna de iconos a la derecha. */
  zonas?: {top: number; bottom: number; left: number; right: number};
};

const rayado = 'repeating-linear-gradient(45deg, rgba(255,40,80,.28) 0 14px, rgba(255,40,80,.12) 14px 28px)';

export const SafeZoneGuide: React.FC<SafeZoneGuideProps> = ({forzar = false, zonas = SAFE}) => {
  const env = getRemotionEnvironment();
  if (env.isRendering && !forzar) return null;
  const etiqueta: React.CSSProperties = {
    position: 'absolute',
    font: `600 26px ${FONT}`,
    color: '#fff',
    background: 'rgba(255,40,80,.85)',
    padding: '4px 10px',
    borderRadius: 6,
  };
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: zonas.top, background: rayado}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: zonas.bottom, background: rayado}} />
      <div style={{position: 'absolute', left: 0, top: zonas.top, width: zonas.left, height: H - zonas.top - zonas.bottom, background: rayado}} />
      <div style={{position: 'absolute', right: 0, top: zonas.top, width: zonas.right, height: H - zonas.top - zonas.bottom, background: rayado}} />
      {/* Columna de iconos (me gusta, comentar, compartir): más alta que el margen derecho. */}
      <div style={{position: 'absolute', right: 0, bottom: zonas.bottom, width: zonas.right, height: 560, background: rayado}} />
      <div
        style={{
          position: 'absolute',
          left: zonas.left,
          top: zonas.top,
          width: W - zonas.left - zonas.right,
          height: H - zonas.top - zonas.bottom,
          outline: '3px dashed rgba(255,40,80,.9)',
        }}
      />
      <div style={{...etiqueta, left: 24, top: zonas.top - 48}}>Reels · cabecera {zonas.top} px</div>
      <div style={{...etiqueta, left: 24, top: H - zonas.bottom + 12}}>Descripción y audio · {zonas.bottom} px</div>
    </AbsoluteFill>
  );
};
