import React from 'react';

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.65 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 90% at center, transparent 35%, rgba(0,0,0,${intensity}) 100%)`,
        zIndex: 10,
      }}
    />
  );
};
