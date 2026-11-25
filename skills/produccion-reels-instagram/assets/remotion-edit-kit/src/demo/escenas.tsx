// Escenas del demo. Cada una cuenta su tiempo desde 0 (su primer fotograma);
// el montaje (Demo.tsx) las coloca y las une con las transiciones del kit.
import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {
  CameraPush,
  Constelacion,
  CountUp,
  DeviceThrough,
  FeedStack,
  FilmStrip,
  Finish,
  FlashCut,
  FONT,
  GridPaper,
  KineticTitle,
  Parallax25D,
  PopFromWord,
  Rafaga,
  Shake,
  Typewriter,
} from '../kit';
import {FotoFalsa, Miniatura, SiluetaSujeto, TarjetaUI} from './placeholders';

// ───────────── A · Hook de 2 s: ráfaga en corte seco + título que golpea ─────────────
export const A_HOOK_RAFAGA = 15;
export const EscenaA: React.FC = () => (
  <AbsoluteFill>
    <Shake deriva={2} impactos={[{frame: A_HOOK_RAFAGA, amplitud: 16}]}>
      <GridPaper />
      <KineticTitle texto={'Edita como\nun estudio'} por="caracter" delay={A_HOOK_RAFAGA} fontSize={150} acentos={[3]} colorAcento="#0B6BD3" />
    </Shake>
    <Rafaga planos={[<FotoFalsa key={0} seed={1} />, <FotoFalsa key={1} seed={2} />, <FotoFalsa key={2} seed={3} />]} duraciones={5} mantenerUltimo={false} />
    <FlashCut frame={0} opacidad={0.8} />
    <Finish grano={0.06} vineta={0} />
  </AbsoluteFill>
);

// ───────────── B · Cámara dentro de la foto: empuje, flash y punch-in ─────────────
export const B_FLASH = 36; // "foto"
export const B_PUNCH = 58; // "cámara"
export const EscenaB: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Shake deriva={3} sobreescala={1.03}>
      <CameraPush ritmo={0.018} ancla={{x: 540, y: 1060}} punches={[{frame: B_PUNCH, cantidad: 0.24, ancla: {x: 540, y: 1040}}]}>
        <FotoFalsa seed={0} etiqueta="ARCHIVO · 1978" />
        {/* El flash va dentro de la cámara: rellena solo el recorte del sujeto y le sigue. */}
        <FlashCut frame={B_FLASH} mascara={<SiluetaSujeto />} />
      </CameraPush>
    </Shake>
    <Finish grano={0.16} />
  </AbsoluteFill>
);

// ───────────── C · Parallax 2.5D con capas generadas ─────────────
// Cada capa lleva sobrante (overscan) fuera del cuadro: al mover la cámara en X/Y
// las capas se desplazan y, sin margen, se verían sus bordes.
const Cielo: React.FC = () => (
  <div style={{position: 'absolute', left: -200, top: -200, width: 1480, height: 2320, background: 'linear-gradient(180deg, #1A1A2E 0%, #3A1C71 45%, #D76D77 80%, #FFAF7B 100%)'}}>
    <div style={{position: 'absolute', left: 760, top: 840, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, #FFF3E0 0%, #FFD9A0 40%, transparent 70%)'}} />
  </div>
);
const Montes: React.FC<{y: number; color: string; seed: number}> = ({y, color, seed}) => {
  const pts = Array.from({length: 13}, (_, i) => `${i * 124},${y + 200 + Math.sin(i * 0.9 + seed) * 90 + random(`m${seed}${i}`) * 50}`);
  return (
    <div style={{position: 'absolute', left: -200, top: -200, width: 1480, height: 2320}}>
      <svg width={1480} height={2320} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M0,2320 L${pts.join(' L')} L1480,2320 Z`} fill={color} />
      </svg>
    </div>
  );
};
const SujetoCapa: React.FC = () => (
  <AbsoluteFill>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g fill="#0B0B0E">
        <circle cx={540} cy={1180} r={86} />
        <path d="M380,1720 C380,1400 450,1290 540,1290 C630,1290 700,1400 700,1720 L700,1920 L380,1920 Z" />
      </g>
    </svg>
  </AbsoluteFill>
);
const PrimerTermino: React.FC = () => (
  <div style={{position: 'absolute', left: -200, top: -200, width: 1480, height: 2320}}>
    <svg width={1480} height={2320} style={{position: 'absolute', left: 0, top: 0}}>
      <path d="M0,2320 L0,2060 C300,1980 500,2140 720,2080 C960,2020 1200,2160 1480,2050 L1480,2320 Z" fill="#050507" />
      <path d="M1480,150 C1360,420 1330,820 1430,1250 L1480,1250 Z" fill="#050507" opacity={0.9} />
    </svg>
  </div>
);
export const EscenaC: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Parallax25D
      duracion={75}
      desde={{x: -50, y: 10, z: 0}}
      hasta={{x: 70, y: -30, z: 340}}
      foco={0}
      capas={[
        {z: 2600, contenido: <Cielo />},
        {z: 1300, contenido: <Montes y={1150} color="#2A1846" seed={1} />},
        {z: 500, contenido: <Montes y={1420} color="#140C22" seed={4} />},
        {z: 0, contenido: <SujetoCapa />},
        {z: -500, contenido: <PrimerTermino />},
      ]}
    />
    <Finish grano={0.16} />
  </AbsoluteFill>
);

// ───────────── D · Pop desde la palabra ─────────────
/** Centro de la palabra "Datos." en el subtítulo (línea sola centrada en la zona segura). */
export const D_ORIGEN = {x: 510, y: 1290};
export const D_DESTINO = {x: 130, y: 620, w: 820, h: 560};
export const EscenaD: React.FC = () => (
  <AbsoluteFill>
    <PopFromWord origen={D_ORIGEN} destino={D_DESTINO}>
      <TarjetaUI titulo="Datos" seed={3} />
    </PopFromWord>
    <Finish grano={0.05} vineta={0} />
  </AbsoluteFill>
);

// ───────────── E · Feed en zigzag (enumeración de energía) ─────────────
export const E_INICIO_FEED = 22;
export const E_INTERVALO = 7;
const titulosFeed = ['Hook', 'Ritmo', 'Cámara', 'Texto', 'Sonido', 'Acabado'];
const coloresFeed = ['#0B6BD3', '#E94560', '#16A34A', '#F59E0B', '#7C3AED', '#0EA5E9'];
export const EscenaE: React.FC = () => (
  <AbsoluteFill>
    <GridPaper fondo="#0E0E12" color="rgba(255,255,255,.06)" vineta={false} deriva={-0.6} />
    <FeedStack
      yAncla={1180}
      inicio={E_INICIO_FEED}
      intervalo={E_INTERVALO}
      tarjetas={titulosFeed.map((t, i) => (
        <TarjetaUI key={t} titulo={t} seed={i} color={coloresFeed[i]} />
      ))}
    />
    {/* El feed se pierde bajo la cabecera: degradado entre las tarjetas y el título. */}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0E0E12 0%, #0E0E12 22%, rgba(14,14,18,0) 36%)'}} />
    <KineticTitle texto="6 capas de un reel" delay={4} fontSize={70} color="#FFFFFF" sombra="0 4px 20px rgba(0,0,0,.5)" style={{justifyContent: 'flex-start', paddingTop: 280}} />
    <Finish grano={0.1} vineta={0.3} />
  </AbsoluteFill>
);

// ───────────── F · Cifra que golpea ─────────────
export const F_CONTEO = 16;
export const F_DURACION = 18;
export const F_LLEGADA = F_CONTEO + F_DURACION;
export const F_TECLEO = 42;
export const F_TEXTO = 'facturados en un mes';
export const EscenaF: React.FC = () => (
  <AbsoluteFill>
    <Shake deriva={2} impactos={[{frame: F_LLEGADA, amplitud: 14}]}>
      <GridPaper />
      <KineticTitle texto="Con una sola idea:" delay={4} fontSize={60} peso={700} style={{justifyContent: 'flex-start', paddingTop: 620}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <CountUp valor={100000} sufijo="€" inicio={F_CONTEO} duracion={F_DURACION} fontSize={200} />
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1110}}>
        <Typewriter texto={F_TEXTO} inicio={F_TECLEO} fontSize={58} />
      </AbsoluteFill>
    </Shake>
    <Finish grano={0.05} vineta={0} />
  </AbsoluteFill>
);

/** La píldora que se hereda de F a G (concatenar planos). */
export const Pildora: React.FC<{texto: string}> = ({texto}) => (
  <AbsoluteFill style={{background: '#0B6BD3', containerType: 'size', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: '46cqh', color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>{texto}</div>
  </AbsoluteFill>
);
export const PILDORA_F = {x: 540 - 150, y: 1300, w: 300, h: 104, radius: 52};
export const PILDORA_G = {x: 540 - 230, y: 960 - 84, w: 460, h: 168, radius: 84};

// ───────────── G · Constelación alrededor de la idea ─────────────
export const EscenaG: React.FC = () => (
  <AbsoluteFill>
    <GridPaper />
    <Constelacion centro={null} clips={Array.from({length: 7}, (_, i) => <Miniatura key={i} seed={i} />)} inicio={4} intervalo={3} encoger={42} ancho={260} alto={330} />
    <Finish grano={0.05} vineta={0} />
  </AbsoluteFill>
);

// ───────────── H · Móvil que atraviesa la cámara + cierre ─────────────
export const H_ENTRADA = 24;
export const H_DURACION = 12;
export const H_CORTE = H_ENTRADA + H_DURACION;
export const Cierre: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #0E0E12 0%, #1A1A2E 100%)'}}>
    <FilmStrip items={Array.from({length: 6}, (_, i) => <Miniatura key={i} seed={i + 2} />)} y={1330} alto={300} ancho={230} velocidad={7} />
    <KineticTitle
      texto={'Tu próximo\nreel'}
      por="caracter"
      delay={H_CORTE + 4}
      fontSize={150}
      color="#FFFFFF"
      acentos={[2]}
      colorAcento="#38BDF8"
      trackingHero
      sombra="0 6px 30px rgba(0,0,0,.5)"
      style={{justifyContent: 'flex-start', paddingTop: 560}}
    />
    <Finish grano={0.1} vineta={0.3} />
  </AbsoluteFill>
);
export const EscenaH: React.FC = () => (
  <DeviceThrough inicio={H_ENTRADA} duracion={H_DURACION} pantalla={<Cierre />} />
);
