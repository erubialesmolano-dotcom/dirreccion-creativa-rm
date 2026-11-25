// Composiciones: el demo completo y una vitrina por componente.
import React from 'react';
import {Composition, Folder} from 'remotion';
import {Demo, DEMO_DURACION} from './Demo';
import {FPS, H, W} from './kit';
import * as V from './demo/vitrinas';

const vitrinas: [string, React.FC, number][] = [
  ['WordCaptions', V.VWordCaptions, 170],
  ['KineticTitle', V.VKineticTitle, 90],
  ['CameraPush', V.VCameraPush, 120],
  ['ZoomThrough', V.VZoomThrough, 60],
  ['WhipPan', V.VWhipPan, 60],
  ['FlashCut', V.VFlashCut, 75],
  ['PopFromWord', V.VPopFromWord, 60],
  ['GlassSlats', V.VGlassSlats, 60],
  ['PixelDissolve', V.VPixelDissolve, 50],
  ['HandOff', V.VHandOff, 120],
  ['Parallax25D', V.VParallax25D, 90],
  ['Shake', V.VShake, 100],
  ['FeedStack', V.VFeedStack, 90],
  ['Typewriter', V.VTypewriter, 150],
  ['CountUp', V.VCountUp, 60],
  ['Finish', V.VFinish, 30],
  ['Vocabulario', V.VVocabulario, 250],
  ['Audio', V.VAudio, 170],
];

export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={DEMO_DURACION} fps={FPS} width={W} height={H} defaultProps={{guias: false}} />
    <Folder name="Componentes">
      {vitrinas.map(([id, C, d]) => (
        <Composition key={id} id={`C-${id}`} component={C} durationInFrames={d} fps={FPS} width={W} height={H} />
      ))}
    </Folder>
  </>
);
