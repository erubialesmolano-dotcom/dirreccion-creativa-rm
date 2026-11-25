// Prueba de <LottieAsset>: firma dibujada con trim path (public/lottie/firma_trazo.json, de
// scripts/generar_lottie.py) sobre papel, con deriva para que el plano no se congele.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Deriva, LottieAsset} from '../index';

export const LottieDemo: React.FC = () => (
  <AbsoluteFill style={{background: '#EEE9E0'}}>
    <Deriva intensidad={0.8} semilla={3}>
      <Img src={staticFile('texturas/papel.jpg')} style={{position: 'absolute', inset: -40, width: 1160, height: 2000}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <LottieAsset src="lottie/firma_trazo.json" style={{width: 900, height: 360}} />
      </AbsoluteFill>
    </Deriva>
  </AbsoluteFill>
);
