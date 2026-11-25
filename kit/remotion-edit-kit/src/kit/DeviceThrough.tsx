// Dispositivo cuya pantalla atraviesa la cámara: un iPhone (CSS) con el plano
// siguiente dentro; la cámara acelera hacia la pantalla, corte en el pico y el
// plano B sigue desde dentro decelerando. Es un ZoomThrough con subencuadre.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01} from './constants';
import {cutIn, expScale, materialEnter} from './ease';
import {GridPaper} from './GridPaper';
import {ZoomBlur} from './ZoomBlur';

export type DeviceThroughProps = {
  /** Plano que se ve en la pantalla y que queda a pantalla completa (diséñalo a 1080×1920). */
  pantalla: React.ReactNode;
  /** Lo que rodea al móvil. Por defecto, papel con cuadrícula. */
  fondo?: React.ReactNode;
  /** Fotograma en que la cámara empieza a entrar. Antes, empuje lento (moving hold). */
  inicio?: number;
  /** Fotogramas de entrada hasta el corte. 10-14 f: se ve el gesto y aún es rápido. */
  duracion?: number;
  /** Fotogramas en que B asienta tras el corte. */
  salida?: number;
  /** Ancho de pantalla del móvil en px (alto = ancho · 2,165, proporción iPhone). */
  anchoPantalla?: number;
  /** Empuje lento antes de entrar (por segundo). */
  empujePrevio?: number;
};

export const DeviceThrough: React.FC<DeviceThroughProps> = ({
  pantalla,
  fondo,
  inicio = 20,
  duracion = 12,
  salida = 6,
  anchoPantalla = 470,
  empujePrevio = 0.025,
}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const sw = anchoPantalla;
  const sh = Math.round(anchoPantalla * 2.165);
  const bisel = 16;
  const cx = width / 2;
  const cy = height / 2;
  // Contenido dentro de la pantalla a "cover"; al final la pantalla cubre el cuadro.
  const c = Math.max(sw / width, sh / height);
  const sFin = Math.max(width / sw, height / sh);
  const previo = (f: number) => Math.pow(1 + empujePrevio, Math.min(f, inicio) / fps);
  const sMovil = (f: number) => previo(f) * expScale(1, sFin / previo(inicio), cutIn(clamp01((f - inicio) / duracion)));
  const corte = inicio + duracion;

  if (frame >= corte) {
    // B continúa desde la escala a la que llegó dentro de la pantalla.
    const desde = c * sFin;
    const sB = (f: number) => expScale(desde, 1, materialEnter(clamp01((f - corte) / salida)));
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <ZoomBlur escala={sB(frame)} escalaPrev={frame === corte ? sB(frame) : sB(frame - 1)} ancla={{x: cx, y: cy}}>
          {pantalla}
        </ZoomBlur>
      </AbsoluteFill>
    );
  }

  const movil = (
    <AbsoluteFill>
      {fondo ?? <GridPaper />}
      <div
        style={{
          position: 'absolute',
          left: cx - sw / 2 - bisel,
          top: cy - sh / 2 - bisel,
          width: sw + bisel * 2,
          height: sh + bisel * 2,
          borderRadius: 86,
          background: 'linear-gradient(135deg, #3a3a40, #121214 45%, #2b2b30)',
          boxShadow: '0 50px 90px rgba(0,0,0,.35), 0 12px 26px rgba(0,0,0,.25), inset 0 0 0 2px rgba(255,255,255,.18)',
        }}
      >
        <div style={{position: 'absolute', left: bisel, top: bisel, width: sw, height: sh, borderRadius: 70, overflow: 'hidden', background: '#000'}}>
          <div style={{position: 'absolute', left: sw / 2 - width / 2, top: sh / 2 - height / 2, width, height, scale: String(c)}}>{pantalla}</div>
          {/* Reflejo diagonal del cristal. */}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 38%)'}} />
          {/* Isla dinámica. */}
          <div style={{position: 'absolute', left: sw / 2 - 62, top: 18, width: 124, height: 36, borderRadius: 18, background: '#000'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <ZoomBlur escala={sMovil(frame)} escalaPrev={sMovil(frame - 1)} ancla={{x: cx, y: cy}}>
        {movil}
      </ZoomBlur>
    </AbsoluteFill>
  );
};
