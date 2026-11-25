// Demo del kit v2 (solo assets reales). Necesita public/local/ (scripts/assets_locales.sh): no se sube
// al repo porque son clips de stock y brutos de cliente.
// Estructura: 5 planos encadenados; cada transición tiene un motivo (cámara que entra, emulsión que se
// quema, señal que se rompe, luz que barre). Nada está quieto: deriva, empujes y respiración.
import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {
  BarrasCrecen,
  CajaLlamada,
  Capas,
  CirculoEnfasis,
  Clip,
  DentroDe,
  Deriva,
  Empuje,
  FilmBurn,
  Flecha,
  Foto,
  Glitch,
  LeakCorte,
  LineaCinetica,
  Pelicula,
  Recorte,
  SANS,
  Subrayado,
  ZoomRadial,
  deriva,
  rampa,
  pulsoLeak,
  LightLeak,
  type Escena,
} from '../index';

const L = (s: string) => `local/${s}`;
const SOMBRA_FOTO = '0 2px 8px rgba(0,0,0,.55), 0 10px 40px rgba(0,0,0,.45)';

/* ---------- PLANO 1 · gancho: vídeo real con empuje asimétrico y título por letra ---------- */
const P1: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Empuje
      escala={[
        {f: 0, v: 1.0, infOut: 0.12},
        {f: 70, v: 1.16, infIn: 0.9},
      ]}
      origen={[540, 820]}
    >
      <Clip video={L('podcast.mp4')} inicio={30} style={{filter: 'contrast(1.08) saturate(.9)'}} />
    </Empuje>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)'}} />
    <LineaCinetica
      palabras={[
        {t: 'nadie', at: 6},
        {t: 'construye', at: 11, nivel: 1},
        {t: 'solo', at: 20, nivel: 2},
      ]}
      x={80}
      y={1300}
      tam={104}
      color="#fff"
      acento="#FFB25B"
      sombra={SOMBRA_FOTO}
    />
    <Subrayado x0={600} x1={900} y={1388} desde={30} color="#FFB25B" grosor={10} />
  </AbsoluteFill>
);

/* ---------- PLANO 2 · recorte real con parallax y énfasis dibujado a mano ---------- */
const P2: React.FC = () => {
  const f = useCurrentFrame();
  const entra = interpolate(f, [0, 16], [0, 1], {extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 4)});
  return (
    <Capas
      cam={(fr) => {
        const d = deriva(fr, {intensidad: 1.4, semilla: 2});
        return {...d, x: d.x - fr * 0.9, s: 1 + fr * 0.0016};
      }}
      foco={0.7}
      capas={[
        {
          z: 0,
          blurLejos: 7,
          node: (
            <AbsoluteFill style={{filter: 'brightness(.55) saturate(.8)'}}>
              <Foto img={L('fachada.jpg')} fuente={{w: 4884, h: 7326}} recorte={{x: 300, y: 1500, w: 4200, h: 7466 * 0.84}} ancho={1180} x={540} y={960} altura={0} papel={false} />
            </AbsoluteFill>
          ),
        },
        {
          z: 0.7,
          node: (
            <Recorte
              img={L('hurtado_recorte.png')}
              ancho={1020}
              x={520}
              y={1260 + (1 - entra) * 380}
              rot={-2 + (1 - entra) * 6}
              pegatina={12}
              altura={0.5}
            />
          ),
        },
        {
          z: 1,
          node: (
            <>
              <CirculoEnfasis cx={815} cy={1290} rx={140} ry={185} desde={22} dur={15} color="#FFB25B" grosor={9} semilla={4} />
              <Flecha d="M 330 700 C 470 820, 640 930, 740 1080" desde={32} dur={14} color="#FFB25B" grosor={8} />
            </>
          ),
        },
      ]}
    />
  );
};
const P2conTexto: React.FC = () => (
  <AbsoluteFill>
    <P2 />
    <Deriva intensidad={0.5} semilla={21}>
      <LineaCinetica palabras={[{t: 'tu', at: 36}, {t: 'próximo', at: 39}, {t: 'socio', at: 46, nivel: 2}]} x={90} y={560} tam={84} color="#fff" acento="#FFB25B" sombra={SOMBRA_FOTO} entrada="sube" />
    </Deriva>
  </AbsoluteFill>
);

/* ---------- PLANO 3 · vídeo con speed ramp y caja de llamada ---------- */
const P3: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Deriva intensidad={1.2} semilla={9}>
      <Clip video={L('billetes.mp4')} tiempo={rampa(26, {rapido: 2.4, lento: 0.22, dur: 110})} style={{filter: 'contrast(1.1) saturate(1.05)'}} />
    </Deriva>
    <CajaLlamada punto={[560, 1040]} caja={[150, 700]} texto="12 M$ al mes en fraude" desde={24} fondo="#F5F1EA" color="#0B0B0C" fuente={SANS} tam={50} />
  </AbsoluteFill>
);

/* ---------- PLANO 4 · fotos reales como objetos + gráfico que crece ---------- */
const P4: React.FC = () => {
  const f = useCurrentFrame();
  const cae = (a: number) => interpolate(f, [a, a + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <AbsoluteFill style={{background: '#E9E4DB'}}>
      <Deriva intensidad={1} semilla={13}>
        <Img src={staticFile('texturas/papel.jpg')} style={{position: 'absolute', inset: -40, width: 1160, height: 2000}} />
        <Foto img={L('madrid.jpg')} fuente={{w: 1280, h: 960}} recorte={{x: 160, y: 0, w: 960, h: 960}} ancho={560} x={330} y={560 - (1 - cae(0)) * 900} rot={-6 + cae(0) * 2} borde={18} altura={0.8 - cae(0) * 0.5} />
        <Foto img={L('warmi.jpg')} fuente={{w: 1280, h: 853}} recorte={{x: 210, y: 0, w: 853, h: 853}} ancho={520} x={760} y={760 - (1 - cae(5)) * 1100} rot={5 - cae(5) * 1.5} borde={18} altura={0.8 - cae(5) * 0.45} />
        <BarrasCrecen valores={[3, 7, 12, 31]} etiquetas={['2023', '2024', '2025', '2026']} x={120} base={1600} ancho={840} alto={430} desde={16} color="#1B1A18" fuente={SANS} />
      </Deriva>
    </AbsoluteFill>
  );
};

/* ---------- PLANO 5 · vídeo dentro del texto (track matte) y cierre ---------- */
const P5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#0B0B0C'}}>
      <DentroDe
        forma={
          <text x={540} y={1060} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={300} letterSpacing={-14}>
            socios
          </text>
        }
      >
        <Empuje escala={[{f: 0, v: 1.25, infOut: 0.2}, {f: 80, v: 1.05, infIn: 0.8}]}>
          <Clip video={L('podcast.mp4')} inicio={200} style={{filter: 'brightness(1.25) contrast(1.1)'}} />
        </Empuje>
      </DentroDe>
      <LightLeak opacidad={pulsoLeak(f, 0, 20, 70, 0.45)} desfase={20} />
      <LineaCinetica palabras={[{t: 'descarga', at: 34}, {t: 'milionegle', at: 40, nivel: 1}]} alinear="center" y={1300} tam={54} color="#EDE7DD" entrada="desenfoque" />
    </AbsoluteFill>
  );
};

/* ---------- montaje: escenas y transiciones con solape ---------- */
type Corte = {en: number; dur: number; T: React.FC<{a: Escena; b: Escena}>};
const ESCENAS: React.FC[] = [P1, P2conTexto, P3, P4, P5];
const CORTES: Corte[] = [
  {en: 78, dur: 14, T: ({a, b}) => <ZoomRadial a={a} b={b} punto={[560, 760]} dur={14} />},
  {en: 172, dur: 24, T: ({a, b}) => <FilmBurn a={a} b={b} />},
  {en: 268, dur: 6, T: ({a, b}) => <Glitch a={a} b={b} />},
  {en: 352, dur: 16, T: ({a, b}) => <LeakCorte a={a} b={b} />},
];
export const DEMO_V2_DURACION = 440;

/** Cada escena empieza al principio de la transición que la trae y acaba al final de la que la saca. */
const tramos = () => {
  const ini = [0, ...CORTES.map((c) => c.en - Math.floor(c.dur / 2))];
  const fin = [...CORTES.map((c) => c.en + Math.ceil(c.dur / 2)), DEMO_V2_DURACION];
  return ESCENAS.map((E, i) => ({E, ini: ini[i], fin: fin[i]}));
};

export const DemoV2: React.FC = () => {
  const t = tramos();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t.map(({E, ini, fin}, i) => {
        const libreDesde = i === 0 ? ini : ini + CORTES[i - 1].dur;
        const libreHasta = i === CORTES.length ? fin : fin - CORTES[i].dur;
        return (
          <Sequence key={'e' + i} from={libreDesde} durationInFrames={Math.max(1, libreHasta - libreDesde)}>
            <Sequence from={-(libreDesde - ini)} layout="none">
              <E />
            </Sequence>
          </Sequence>
        );
      })}
      {CORTES.map((c, i) => {
        const s = c.en - Math.floor(c.dur / 2);
        const A = t[i];
        const B = t[i + 1];
        return (
          <Sequence key={'c' + i} from={s} durationInFrames={c.dur}>
            <c.T a={{node: <A.E />, from: s - A.ini}} b={{node: <B.E />, from: s - B.ini}} />
          </Sequence>
        );
      })}
      <Pelicula grano={0.4} polvo={0.25} vineta={0.28} />
    </AbsoluteFill>
  );
};

