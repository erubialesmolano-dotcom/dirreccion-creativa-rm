// Renderiza stills de una composición en un solo bundle (más rápido que `remotion still` uno a uno).
// Uso: node scripts/stills.mjs <Composición> <f1,f2,...> [carpeta] [escala] [props JSON]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import {join, resolve} from 'node:path';

const [id = 'Demo', lista = '0', carpeta = 'out/stills', escala = '0.5', props = '{}'] = process.argv.slice(2);
const navegador = [
  process.env.REMOTION_BROWSER,
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
].find((p) => p && existsSync(p));

mkdirSync(carpeta, {recursive: true});
const serveUrl = await bundle({entryPoint: resolve('src/index.ts')});
const inputProps = JSON.parse(props);
const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable: navegador});
for (const f of lista.split(',').map(Number)) {
  const output = join(carpeta, `${id}-f${String(f).padStart(4, '0')}.png`);
  await renderStill({composition, serveUrl, output, frame: f, inputProps, scale: Number(escala), browserExecutable: navegador, overwrite: true});
  console.log('still', output);
}
