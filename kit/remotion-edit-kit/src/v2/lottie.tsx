// Lottie: assets animados hechos en After Effects (Bodymovin) o bajados de LottieFiles.
// Cuándo compensa: iconos animados, ilustraciones con mucho keyframe, flechas o garabatos dibujados a
// mano por un animador. Cuándo no: cualquier cosa que deba encajar con la cámara o el timing de la voz
// al fotograma (mejor componente propio), o texto (las fuentes de Lottie no se cargan bien).
import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {Lottie, type LottieAnimationData} from '@remotion/lottie';

/** Lottie desde public/ (`lottie/flecha.json`). `velocidad` 1 = la del archivo; `bucle` para iconos. */
export const LottieAsset: React.FC<{src: string; velocidad?: number; bucle?: boolean; style?: React.CSSProperties}> = ({src, velocidad = 1, bucle = false, style}) => {
  const [datos, setDatos] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender('Cargando Lottie ' + src));
  useEffect(() => {
    fetch(src.startsWith('http') ? src : staticFile(src))
      .then((r) => r.json())
      .then((j) => {
        setDatos(j);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [src, handle]);
  if (!datos) return null;
  return <Lottie animationData={datos} playbackRate={velocidad} loop={bucle} style={style} />;
};
