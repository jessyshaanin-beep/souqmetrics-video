import React from 'react';
import {Composition} from 'remotion';
import {SouqMetricsAd} from './SouqMetricsAd';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SouqMetricsVerticalAd"
    component={SouqMetricsAd}
    durationInFrames={450}
    fps={30}
    width={1080}
    height={1350}
  />
);
