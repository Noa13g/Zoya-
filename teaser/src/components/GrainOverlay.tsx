import React from 'react';
import { useCurrentFrame } from 'remotion';

export const GrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 256;
  const id = `grain-${seed}`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99,
        opacity,
        mixBlendMode: 'overlay',
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <filter id={id} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              stitchTiles="stitch"
              seed={seed}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
};
