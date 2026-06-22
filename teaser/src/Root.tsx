import React from 'react';
import { Composition } from 'remotion';
import { TeaserComposition } from './TeaserComposition';
import { TIMING } from './config';

const BlueTeaser: React.FC = () => <TeaserComposition variant="blue" />;
const PinkTeaser: React.FC = () => <TeaserComposition variant="pink" />;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TeaserBlue"
        component={BlueTeaser}
        durationInFrames={TIMING.total}
        fps={TIMING.fps}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="TeaserPink"
        component={PinkTeaser}
        durationInFrames={TIMING.total}
        fps={TIMING.fps}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
