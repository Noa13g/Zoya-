import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { TIMING } from '../config';

export const LightSwipe: React.FC = () => {
  const frame = useCurrentFrame();

  // Sweep happens from frame 75 to 130 — mid-focus-pull
  const sweepStart = TIMING.plan2Start + 15;
  const sweepEnd = TIMING.plan2Start + 75;

  const progress = interpolate(frame, [sweepStart, sweepEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  // Opacity: fade in briefly then fade out
  const beamOpacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Translate X from -40% to +140% across the frame
  const tx = interpolate(progress, [0, 1], [-40, 140]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-25%',
          width: '50%',
          height: '140%',
          background:
            'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.06) 65%, transparent 100%)',
          transform: `translateX(${tx}%)`,
          opacity: beamOpacity,
        }}
      />
    </div>
  );
};
