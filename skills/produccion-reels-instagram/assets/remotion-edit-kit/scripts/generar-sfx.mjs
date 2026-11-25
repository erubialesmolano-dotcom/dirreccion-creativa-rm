// Genera efectos de sonido y una base musical sintéticos (sin derechos) en public/sfx/.
// Deterministas: ruido con PRNG de semilla fija. Uso: node scripts/generar-sfx.mjs
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sfx');
mkdirSync(dir, {recursive: true});

const prng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const wav = (nombre, muestras) => {
  const n = muestras.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  let pico = 0;
  for (const m of muestras) pico = Math.max(pico, Math.abs(m));
  const g = pico > 0 ? 0.89 / pico : 1; // normaliza a −1 dBFS
  muestras.forEach((m, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, m * g)) * 32767), 44 + i * 2));
  writeFileSync(join(dir, nombre), buf);
  console.log('escrito', nombre, (buf.length / 1024).toFixed(1), 'KB');
};

const gen = (seg, f) => Array.from({length: Math.round(seg * SR)}, (_, i) => f(i / SR, i));

// Filtro paso bajo de un polo (para colorear ruido).
const pasoBajo = (x, a) => {
  let y = 0;
  return x.map((v) => (y += a * (v - y)));
};

// Click de cámara: dos transitorios de ruido muy cortos (obturador + espejo).
{
  const r = prng(1);
  wav('click.wav', gen(0.12, (t) => {
    const a = t < 0.006 ? 1 : Math.exp(-(t - 0.006) * 900);
    const b = t > 0.045 ? Math.exp(-(t - 0.045) * 700) * 0.7 : 0;
    return (r() * 2 - 1) * (a + b);
  }));
}
// Pop: seno con caída rápida de tono.
wav('pop.wav', gen(0.14, (t) => Math.sin(2 * Math.PI * (900 * t - 2400 * t * t)) * Math.exp(-t * 38)));
// Tecla: click corto y seco.
{
  const r = prng(2);
  wav('tecla.wav', gen(0.05, (t) => (r() * 2 - 1) * Math.exp(-t * 260) * 0.8 + Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 400) * 0.4));
}
// Whoosh: ruido filtrado con envolvente que sube y cae (pico a 0,22 s).
{
  const r = prng(3);
  const ruido = gen(0.5, () => r() * 2 - 1);
  const filtrado = pasoBajo(ruido, 0.18);
  wav('whoosh.wav', filtrado.map((v, i) => {
    const t = i / SR;
    const env = t < 0.22 ? Math.pow(t / 0.22, 2) : Math.exp(-(t - 0.22) * 14);
    return v * env;
  }));
}
// Golpe: bombo grave con caída de tono + ruido.
{
  const r = prng(4);
  wav('golpe.wav', gen(0.7, (t) => {
    const tono = Math.sin(2 * Math.PI * (55 * t + 90 * (1 - Math.exp(-t * 30)) / 30)) * Math.exp(-t * 6);
    return tono + (r() * 2 - 1) * Math.exp(-t * 60) * 0.5;
  }));
}
// Riser: ruido + seno que suben 1,5 s y se cortan en seco.
{
  const r = prng(5);
  const ruido = pasoBajo(gen(1.5, () => r() * 2 - 1), 0.3);
  wav('riser.wav', ruido.map((v, i) => {
    const t = i / SR;
    const env = Math.pow(t / 1.5, 2.2);
    return (v * 0.7 + Math.sin(2 * Math.PI * (200 * t + 300 * t * t)) * 0.4) * env;
  }));
}
// Música: 8 s a 120 BPM (bombo, hi-hat y bajo), cicla sin costura.
{
  const r = prng(6);
  const beat = 0.5;
  const notas = [55, 55, 65.41, 49];
  wav('musica.wav', gen(8, (t) => {
    const tb = t % beat;
    const bombo = Math.sin(2 * Math.PI * (50 * tb + 60 * (1 - Math.exp(-tb * 25)) / 25)) * Math.exp(-tb * 9) * 0.9;
    const th = (t + beat / 2) % beat;
    const hat = (r() * 2 - 1) * Math.exp(-th * 80) * 0.18;
    const compas = Math.floor(t / 2) % notas.length;
    const tc = t % 2;
    const bajo = Math.tanh(Math.sin(2 * Math.PI * notas[compas] * t) * 2) * 0.35 * Math.min(1, tc * 20) * Math.min(1, (2 - tc) * 20);
    const pad = (Math.sin(2 * Math.PI * notas[compas] * 4 * t) + Math.sin(2 * Math.PI * notas[compas] * 5.04 * t)) * 0.05;
    return bombo + hat + bajo + pad;
  }));
}
