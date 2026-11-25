// Placeholders generados (formas, degradados, texto): nada con derechos.
// Sustitúyelos por <Img src={staticFile(...)} /> en un vídeo real.
import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {FONT} from '../kit';

const paletas = [
  ['#0F2027', '#203A43', '#2C5364', '#F8B500'],
  ['#1A1A2E', '#16213E', '#E94560', '#F5F5F5'],
  ['#3A1C71', '#D76D77', '#FFAF7B', '#FFF3E0'],
  ['#004E92', '#000428', '#38BDF8', '#E0F2FE'],
  ['#134E5E', '#71B280', '#F7F7F2', '#2F3E46'],
  ['#2B1B17', '#8E5B3E', '#E8C07D', '#FFF8E7'],
];

/** "Foto" de paisaje: cielo, sol, colinas y un sujeto. Distinta por semilla. */
export const FotoFalsa: React.FC<{seed?: number; sujeto?: boolean; etiqueta?: string}> = ({seed = 0, sujeto = true, etiqueta}) => {
  const p = paletas[seed % paletas.length];
  const r = (k: string) => random(`foto-${seed}-${k}`);
  const solX = 25 + r('sx') * 50;
  const solY = 22 + r('sy') * 18;
  const colina = (y0: number, amp: number, k: string) => {
    const pts = Array.from({length: 9}, (_, i) => `${i * 135},${y0 + Math.sin(i * 1.3 + r(k) * 6) * amp}`);
    return `M0,1920 L${pts.join(' L')} L1080,1920 Z`;
  };
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${p[1]} 0%, ${p[0]} 45%, ${p[2]} 100%)`}}>
      <div
        style={{
          position: 'absolute',
          left: `${solX}%`,
          top: `${solY}%`,
          width: 300,
          height: 300,
          marginLeft: -150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${p[3]} 0%, ${p[3]}AA 35%, transparent 70%)`,
        }}
      />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={colina(1180, 70, 'c1')} fill={p[1]} opacity={0.75} />
        <path d={colina(1380, 90, 'c2')} fill={p[0]} opacity={0.92} />
        <path d={colina(1600, 50, 'c3')} fill="#000" opacity={0.55} />
        {sujeto ? (
          <g fill="#0B0B0E">
            <circle cx={540} cy={1060} r={78} />
            <path d="M400,1460 C400,1230 460,1160 540,1160 C620,1160 680,1230 680,1460 Z" />
          </g>
        ) : null}
      </svg>
      {etiqueta ? (
        <div style={{position: 'absolute', left: 70, top: 260, font: `700 34px ${FONT}`, color: 'rgba(255,255,255,.55)', letterSpacing: '0.12em'}}>{etiqueta}</div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Zona del sujeto de FotoFalsa (para FlashCut con máscara). */
export const SiluetaSujeto: React.FC<{color?: string}> = ({color = '#FFFFFF'}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <g fill={color}>
      <circle cx={540} cy={1060} r={78} />
      <path d="M400,1460 C400,1230 460,1160 540,1160 C620,1160 680,1230 680,1460 Z" />
    </g>
  </svg>
);

/** Tarjeta de UI genérica: cabecera, líneas de texto y una mini gráfica. */
export const TarjetaUI: React.FC<{titulo: string; seed?: number; color?: string}> = ({titulo, seed = 0, color = '#0B6BD3'}) => {
  const barras = Array.from({length: 7}, (_, i) => 0.25 + random(`ui-${seed}-${i}`) * 0.75);
  return (
    <AbsoluteFill style={{background: '#FFFFFF', padding: 36, fontFamily: FONT}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 56, height: 56, borderRadius: 16, background: color}} />
        <div style={{fontSize: 36, fontWeight: 800, color: '#0A0A0B', letterSpacing: '-0.02em'}}>{titulo}</div>
      </div>
      <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{height: 16, width: '82%', borderRadius: 8, background: '#E7E7EC'}} />
        <div style={{height: 16, width: '64%', borderRadius: 8, background: '#E7E7EC'}} />
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 24}}>
        {barras.map((b, i) => (
          <div key={i} style={{flex: 1, height: `${b * 100}%`, borderRadius: 10, background: i === barras.length - 1 ? color : `${color}33`}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Miniatura de color con una forma: para clips, constelación y tira de película. */
export const Miniatura: React.FC<{seed?: number}> = ({seed = 0}) => {
  const p = paletas[seed % paletas.length];
  const forma = seed % 3;
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${p[2]}, ${p[0]})`, justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: '46%',
          aspectRatio: '1',
          background: p[3],
          opacity: 0.9,
          borderRadius: forma === 0 ? '50%' : forma === 1 ? 24 : 0,
          rotate: forma === 2 ? '45deg' : '0deg',
          boxShadow: '0 12px 30px rgba(0,0,0,.25)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Fondo de color liso con texto grande: para escenas B de transiciones. */
export const Plano: React.FC<{color: string; texto?: string; colorTexto?: string; children?: React.ReactNode}> = ({color, texto, colorTexto = '#FFFFFF', children}) => (
  <AbsoluteFill style={{background: color, justifyContent: 'center', alignItems: 'center'}}>
    {texto ? <div style={{font: `800 120px ${FONT}`, color: colorTexto, letterSpacing: '-0.03em', textAlign: 'center', lineHeight: 1.05}}>{texto}</div> : null}
    {children}
  </AbsoluteFill>
);
