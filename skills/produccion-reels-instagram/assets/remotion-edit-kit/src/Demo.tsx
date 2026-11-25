// Demo de 20 s (600 f a 30 fps) que usa todos los componentes del kit.
// Montaje: cada escena cuenta desde 0; <Sequence from={-n}> adelanta su reloj
// para que siga corriendo dentro de la transición siguiente.
//
// Mapa (fotogramas globales):
//   0-56    A  hook: ráfaga en corte seco + flash + título que golpea (Shake)
//   56-65   WhipPan A→B
//   56-150  B  foto: CameraPush + FlashCut con máscara + punch-in + subtítulos foto
//   146-155 ZoomThrough B→C
//   150-225 C  Parallax25D de 5 capas; "Datos." sola en el subtítulo
//   225     D  PopFromWord: corte a blanco, la tarjeta nace en la palabra
//   280-298 HandOff (ventana) D→E: la tarjeta se abre y es el plano siguiente
//   280-380 E  FeedStack en zigzag
//   380-406 GlassSlats E→F
//   380-460 F  CountUp que golpea + Typewriter
//   451-469 HandOff F→G: la píldora "1 idea" pasa de F a G (concatenar planos)
//   460-525 G  Constelación alrededor de la píldora
//   525-540 PixelDissolve G→H
//   525-600 H  DeviceThrough: el móvil atraviesa la cámara → cierre con FilmStrip
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {
  duck,
  FPS,
  GlassSlats,
  HandOff,
  PixelDissolve,
  SafeZoneGuide,
  segmentosDeVoz,
  Sfx,
  tiemposTecleo,
  WhipPan,
  WordCaptions,
  ZoomThrough,
  type Word,
} from './kit';
import {
  B_FLASH,
  B_PUNCH,
  D_DESTINO,
  E_INICIO_FEED,
  E_INTERVALO,
  EscenaA,
  EscenaB,
  EscenaC,
  EscenaD,
  EscenaE,
  EscenaF,
  EscenaG,
  EscenaH,
  F_LLEGADA,
  F_TECLEO,
  F_TEXTO,
  H_CORTE,
  PILDORA_F,
  PILDORA_G,
  Pildora,
} from './demo/escenas';
import {TarjetaUI} from './demo/placeholders';
import palabras from './demo/words.json';

export const DEMO_DURACION = 600;
const words = palabras as Word[];

// Inicios de escena (globales).
const T = {B: 56, C: 150, D: 225, E: 280, F: 380, FG: 440, G: 460, H: 525} as const;

/** Desplaza los tiempos de las palabras (para subtítulos dentro de una Sequence). */
const desplazar = (ws: Word[], s: number) => ws.map((w) => ({...w, start: w.start - s, end: w.end - s}));

// Rectángulo de la tarjeta de D cuando se abre: PopFromWord sigue empujando +1,8 %/s tras asentar.
const ABRE_D = T.E - T.D; // 55
const sD = Math.pow(1.018, (ABRE_D - 4) / FPS);
const TARJETA_D = {
  x: D_DESTINO.x + D_DESTINO.w / 2 - (D_DESTINO.w * sD) / 2,
  y: D_DESTINO.y + D_DESTINO.h / 2 - (D_DESTINO.h * sD) / 2,
  w: D_DESTINO.w * sD,
  h: D_DESTINO.h * sD,
  radius: 44 * sD,
};

/** F → G con la píldora heredada. Reloj local: 0 = fotograma global 440. */
const BloqueFG: React.FC = () => (
  <HandOff
    a={
      <Sequence from={T.F - T.FG} layout="none">
        <EscenaF />
      </Sequence>
    }
    b={
      <Sequence from={T.G - T.FG} layout="none">
        <EscenaG />
      </Sequence>
    }
    corte={T.G - T.FG}
    desde={PILDORA_F}
    hasta={PILDORA_G}
    elemento={<Pildora texto="1 idea" />}
  />
);

const sfx = (n: string) => staticFile(`sfx/${n}.wav`);

export const Demo: React.FC<{guias?: boolean}> = ({guias = false}) => {
  const segs = segmentosDeVoz(words, FPS);
  const tecleo = tiemposTecleo(F_TEXTO, 2, 0.6, 6, 'tecleo');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* ── Imagen ── */}
      <Sequence durationInFrames={T.C - 10} name="A + WhipPan + B">
        <WhipPan
          a={<EscenaA />}
          b={
            <Sequence from={T.B} layout="none">
              <EscenaB />
            </Sequence>
          }
          inicio={T.B}
        />
      </Sequence>
      <Sequence from={T.C - 10} durationInFrames={T.D - (T.C - 10)} name="ZoomThrough B→C">
        <ZoomThrough
          a={
            <Sequence from={T.B - (T.C - 10)} layout="none">
              <EscenaB />
            </Sequence>
          }
          b={
            <Sequence from={10} layout="none">
              <EscenaC />
            </Sequence>
          }
          corte={10}
          ancla={{x: 540, y: 1040}}
          anclaB={{x: 540, y: 1180}}
        />
      </Sequence>
      <Sequence from={T.D} durationInFrames={T.F - T.D} name="D + HandOff ventana + E">
        <HandOff
          a={<EscenaD />}
          b={
            <Sequence from={ABRE_D} layout="none">
              <EscenaE />
            </Sequence>
          }
          corte={ABRE_D}
          antesDelCorte={0}
          viaje={18}
          desde={TARJETA_D}
          ventana
          elemento={<TarjetaUI titulo="Datos" seed={3} />}
        />
      </Sequence>
      <Sequence from={T.F} durationInFrames={T.FG - T.F} name="GlassSlats E→F">
        <GlassSlats
          a={
            <Sequence from={T.E - T.F} layout="none">
              <EscenaE />
            </Sequence>
          }
          b={<EscenaF />}
        />
      </Sequence>
      <Sequence from={T.FG} durationInFrames={T.H - T.FG} name="HandOff F→G">
        <BloqueFG />
      </Sequence>
      <Sequence from={T.H} durationInFrames={DEMO_DURACION - T.H} name="PixelDissolve G→H">
        <PixelDissolve
          a={
            <Sequence from={T.FG - T.H} layout="none">
              <BloqueFG />
            </Sequence>
          }
          b={<EscenaH />}
          duracion={15}
          direccion="centro"
        />
      </Sequence>

      {/* ── Subtítulos: blancos sobre foto, negros sobre blanco ── */}
      <Sequence durationInFrames={T.D} name="Subtítulos foto">
        <WordCaptions words={words.filter((w) => w.start * FPS < T.D)} modo="foto" claves={['cámara', 'datos']} />
      </Sequence>
      <Sequence from={T.D} durationInFrames={T.E - T.D} name="Subtítulos blanco">
        <WordCaptions words={desplazar(words.filter((w) => w.start * FPS >= T.D), T.D / FPS)} modo="blanco" claves={['palabra']} />
      </Sequence>

      {/* ── Sonido ── */}
      <Audio src={sfx('musica')} loop volume={(f) => duck(f, segs)} />
      <Sfx src={sfx('click')} frame={0} gananciaDb={-8} />
      <Sfx src={sfx('golpe')} frame={15} gananciaDb={-4} />
      <Sfx src={sfx('whoosh')} frame={T.B + 4} adelanto={7} gananciaDb={-8} />
      <Sfx src={sfx('click')} frame={T.B + B_FLASH} gananciaDb={-6} />
      <Sfx src={sfx('golpe')} frame={T.B + B_PUNCH} gananciaDb={-12} />
      <Sfx src={sfx('whoosh')} frame={T.C} adelanto={7} gananciaDb={-6} />
      <Sfx src={sfx('pop')} frame={T.D} gananciaDb={-6} />
      <Sfx src={sfx('whoosh')} frame={T.E + 9} adelanto={7} gananciaDb={-8} />
      {Array.from({length: 6}, (_, i) => (
        <Sfx key={`feed${i}`} src={sfx('pop')} frame={T.E + E_INICIO_FEED + i * E_INTERVALO} gananciaDb={-10 - (i % 2)} velocidad={0.96 + (i % 3) * 0.04} />
      ))}
      <Sfx src={sfx('whoosh')} frame={T.F + 4} adelanto={7} gananciaDb={-8} />
      <Sfx src={sfx('riser')} frame={T.F + F_LLEGADA - 45} duracion={45} gananciaDb={-10} />
      <Sfx src={sfx('golpe')} frame={T.F + F_LLEGADA} gananciaDb={-3} />
      {Array.from(F_TEXTO).map((ch, i) =>
        ch === ' ' ? null : (
          <Sfx key={`tecla${i}`} src={sfx('tecla')} frame={T.F + F_TECLEO + tecleo[i]} gananciaDb={-16 - (i % 3)} velocidad={0.95 + (i % 4) * 0.03} />
        ),
      )}
      <Sfx src={sfx('whoosh')} frame={T.FG + 20} adelanto={7} gananciaDb={-8} />
      {Array.from({length: 7}, (_, i) => (
        <Sfx key={`const${i}`} src={sfx('click')} frame={T.G + 4 + i * 3} gananciaDb={-14} velocidad={0.9 + (i % 3) * 0.08} />
      ))}
      <Sfx src={sfx('whoosh')} frame={T.G + 46} adelanto={7} gananciaDb={-10} />
      <Sfx src={sfx('whoosh')} frame={T.H + H_CORTE - 3} adelanto={7} gananciaDb={-6} />
      <Sfx src={sfx('golpe')} frame={T.H + H_CORTE} gananciaDb={-6} />

      {/* Solo en el Studio (o con --props='{"guias":true}'). */}
      <SafeZoneGuide forzar={guias} />
    </AbsoluteFill>
  );
};
