// Configuración de render. Si Remotion no puede descargar su Chromium (sin red),
// apunta a uno local con REMOTION_BROWSER=/ruta/al/chrome-headless-shell.
import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(20);
Config.setPixelFormat('yuv420p');

const candidatos = [
  process.env.REMOTION_BROWSER,
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
].filter((p): p is string => Boolean(p));
const navegador = candidatos.find((p) => existsSync(p));
if (navegador) Config.setBrowserExecutable(navegador);
