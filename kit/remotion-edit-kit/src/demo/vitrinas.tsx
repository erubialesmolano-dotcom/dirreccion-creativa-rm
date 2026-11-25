// Vitrinas: una composición por componente para previsualizarlo aislado en el Studio.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
  CameraPush,
  Constelacion,
  CountUp,
  DeviceThrough,
  duck,
  FeedStack,
  FilmStrip,
  Finish,
  FlashCut,
  FONT,
  GlassSlats,
  GridPaper,
  HandOff,
  KineticTitle,
  Parallax25D,
  PixelDissolve,
  PopFromWord,
  Rafaga,
  SafeZoneGuide,
  Sfx,
  Shake,
  Typewriter,
  WhipPan,
  WordCaptions,
  ZoomThrough,
  type Word,
} from '../kit';
import {FotoFalsa, Miniatura, Plano, SiluetaSujeto, TarjetaUI} from './placeholders';
import palabras from './words.json';

const words = palabras as Word[];
const fotoA = <FotoFalsa seed={0} etiqueta="PLANO A" />;
const fotoB = <FotoFalsa seed={3} etiqueta="PLANO B" />;

/** Rótulo pequeño para saber qué se está viendo. */
const Rotulo: React.FC<{texto: string}> = ({texto}) => (
  <div style={{position: 'absolute', left: 60, top: 240, font: `700 30px ${FONT}`, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '8px 16px', borderRadius: 10}}>{texto}</div>
);

export const VWordCaptions: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={-60} layout="none">
      <FotoFalsa seed={0} />
      <WordCaptions words={words.filter((w) => w.start < 7.6)} modo="foto" claves={['cámara', 'datos']} />
    </Sequence>
    <Rotulo texto="WordCaptions · foto" />
  </AbsoluteFill>
);

export const VKineticTitle: React.FC = () => (
  <AbsoluteFill>
    <GridPaper />
    <KineticTitle texto={'Revelado\npor carácter'} por="caracter" delay={6} acentos={[1]} colorAcento="#0B6BD3" />
    <KineticTitle texto="y por palabra, con stagger de 3 f" delay={30} fontSize={54} peso={600} style={{paddingTop: 520}} />
  </AbsoluteFill>
);

export const VCameraPush: React.FC = () => (
  <AbsoluteFill>
    <CameraPush ancla={{x: 540, y: 1060}} punches={[{frame: 45, cantidad: 0.22}, {frame: 75, cantidad: 0.18, ancla: {x: 540, y: 1000}}]}>
      <FotoFalsa seed={0} />
    </CameraPush>
    <Rotulo texto="CameraPush · +1,8 %/s + punch-in f45 y f75" />
  </AbsoluteFill>
);

export const VZoomThrough: React.FC = () => (
  <AbsoluteFill>
    <ZoomThrough a={fotoA} b={fotoB} corte={30} ancla={{x: 540, y: 1060}} />
    <Rotulo texto="ZoomThrough · corte f30" />
  </AbsoluteFill>
);

export const VWhipPan: React.FC = () => (
  <AbsoluteFill>
    <WhipPan a={fotoA} b={fotoB} inicio={25} />
    <Rotulo texto="WhipPan · f25-34" />
  </AbsoluteFill>
);

export const VFlashCut: React.FC = () => (
  <AbsoluteFill>
    <FotoFalsa seed={0} />
    <FlashCut frame={20} mascara={<SiluetaSujeto />} />
    <FlashCut frame={50} />
    <Rotulo texto="FlashCut · máscara f20 · completo f50" />
  </AbsoluteFill>
);

export const VPopFromWord: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={20}>
      <FotoFalsa seed={1} />
      <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1250, font: `800 72px ${FONT}`, color: '#fff'}}>Datos.</AbsoluteFill>
    </Sequence>
    <Sequence from={20}>
      <PopFromWord origen={{x: 540, y: 1290}} destino={{x: 130, y: 620, w: 820, h: 560}}>
        <TarjetaUI titulo="Datos" seed={3} />
      </PopFromWord>
    </Sequence>
  </AbsoluteFill>
);

export const VGlassSlats: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={20}>
      <GlassSlats a={fotoA} b={fotoB} />
    </Sequence>
    <Sequence durationInFrames={20}>{fotoA}</Sequence>
  </AbsoluteFill>
);

export const VPixelDissolve: React.FC = () => (
  <AbsoluteFill>
    <PixelDissolve a={fotoA} b={<Plano color="#0B6BD3" texto="B" />} inicio={20} />
  </AbsoluteFill>
);

export const VHandOff: React.FC = () => {
  const desde = {x: 120, y: 1300, w: 360, h: 220, radius: 28};
  const hasta = {x: 140, y: 380, w: 800, h: 500, radius: 40};
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={75}>
        <HandOff
          a={<Plano color="#F2F2F4" texto={'Plano A'} colorTexto="#0A0A0B" />}
          b={<Plano color="#0E0E12" texto={'Plano B'} />}
          corte={30}
          desde={desde}
          hasta={hasta}
          elemento={<TarjetaUI titulo="Hereda" seed={2} />}
        />
      </Sequence>
      <Sequence from={75}>
        {/* Modo ventana: A pinta el elemento; HandOff lo abre hasta ser el plano B. */}
        <HandOff
          a={
            <Plano color="#0E0E12">
              <div style={{position: 'absolute', left: 390, top: 800, width: 300, height: 300, borderRadius: 150, overflow: 'hidden'}}>
                <Miniatura seed={4} />
              </div>
            </Plano>
          }
          b={fotoB}
          corte={20}
          antesDelCorte={0}
          desde={{x: 390, y: 800, w: 300, h: 300, radius: 150}}
          ventana
          elemento={<Miniatura seed={4} />}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const VParallax25D: React.FC = () => (
  <AbsoluteFill>
    <Parallax25D
      duracion={90}
      hasta={{x: 80, y: -40, z: 350}}
      capas={[
        {z: 2600, contenido: <Plano color="#1A1A2E" />},
        {z: 1000, contenido: <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{width: 700, height: 700, borderRadius: '50%', background: '#3A1C71'}} /></AbsoluteFill>},
        {z: 0, contenido: <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{width: 380, height: 520, borderRadius: 40, background: '#D76D77'}} /></AbsoluteFill>},
        {z: -500, contenido: <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start'}}><div style={{width: 520, height: 700, borderRadius: 60, background: '#050507', marginLeft: -120, marginBottom: -100}} /></AbsoluteFill>},
      ]}
    />
    <Rotulo texto="Parallax25D · 50 mm · DOF en z=0" />
  </AbsoluteFill>
);

export const VShake: React.FC = () => (
  <AbsoluteFill>
    <Shake impactos={[{frame: 30}, {frame: 70, amplitud: 10}]}>
      <FotoFalsa seed={2} />
    </Shake>
    <Rotulo texto="Shake · deriva 1 Hz + impactos f30 y f70" />
  </AbsoluteFill>
);

export const VFeedStack: React.FC = () => (
  <AbsoluteFill>
    <GridPaper />
    <FeedStack inicio={6} tarjetas={['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'].map((t, i) => <TarjetaUI key={t} titulo={t} seed={i} />)} />
  </AbsoluteFill>
);

export const VTypewriter: React.FC = () => (
  <AbsoluteFill>
    <GridPaper />
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Typewriter texto="Escribe, respira y sigue: así teclea una persona." inicio={8} />
    </AbsoluteFill>
  </AbsoluteFill>
);

export const VCountUp: React.FC = () => (
  <AbsoluteFill>
    <Shake impactos={[{frame: 28}]}>
      <GridPaper />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <CountUp valor={100000} sufijo="€" inicio={10} />
      </AbsoluteFill>
    </Shake>
  </AbsoluteFill>
);

export const VFinish: React.FC = () => (
  <AbsoluteFill>
    <FotoFalsa seed={4} />
    <Finish grano={0.2} vineta={0.25} />
    <SafeZoneGuide forzar />
  </AbsoluteFill>
);

export const VVocabulario: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={70}>
        <GridPaper />
        <Constelacion centro={<div style={{font: `800 110px ${FONT}`, color: '#0A0A0B'}}>ideas</div>} clips={Array.from({length: 7}, (_, i) => <Miniatura key={i} seed={i} />)} inicio={4} encoger={40} />
      </Sequence>
      <Sequence from={70} durationInFrames={60}>
        <Plano color="#0E0E12" />
        <FilmStrip items={Array.from({length: 5}, (_, i) => <Miniatura key={i} seed={i} />)} />
      </Sequence>
      <Sequence from={130} durationInFrames={70}>
        <DeviceThrough inicio={20} pantalla={<Plano color="#0B6BD3" texto="Dentro" />} />
      </Sequence>
      <Sequence from={200}>
        <Rafaga planos={[0, 1, 2, 3].map((i) => <FotoFalsa key={i} seed={i} />)} duraciones={[4, 4, 4, 30]} />
      </Sequence>
      <Rotulo texto={`Constelación · FilmStrip · DeviceThrough · Ráfaga (f${frame})`} />
    </AbsoluteFill>
  );
};

/** Sfx + duck: música que baja bajo los tramos de "voz" (aquí, tramos simulados). */
export const VAudio: React.FC = () => {
  const segs = [{inicio: 30, fin: 75}, {inicio: 100, fin: 140}];
  const frame = useCurrentFrame();
  const v = duck(frame, segs);
  return (
    <AbsoluteFill>
      <GridPaper />
      <Audio src={staticFile('sfx/musica.wav')} volume={(f) => duck(f, segs)} />
      <Sfx src={staticFile('sfx/pop.wav')} frame={30} />
      <Sfx src={staticFile('sfx/pop.wav')} frame={100} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: 120, height: 900, borderRadius: 24, background: '#E7E7EC', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', bottom: 0, width: '100%', height: `${v * 100}%`, background: '#0B6BD3'}} />
        </div>
        <div style={{font: `700 48px ${FONT}`, marginTop: 30}}>música {(20 * Math.log10(v)).toFixed(1)} dB</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
