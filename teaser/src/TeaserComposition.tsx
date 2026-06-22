import React from 'react';
import {
  AbsoluteFill,
  Img,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  staticFile,
} from 'remotion';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadSpaceMono } from '@remotion/google-fonts/SpaceMono';
import { GrainOverlay } from './components/GrainOverlay';
import { Vignette } from './components/Vignette';
import { LightSwipe } from './components/LightSwipe';
import { PALETTE, TIMING, TEXT } from './config';

const { fontFamily: DISPLAY } = loadAnton();
const { fontFamily: MONO } = loadSpaceMono();

export type TeaserVariant = 'blue' | 'pink';

export interface TeaserProps {
  variant: TeaserVariant;
  audioSrc?: string;
}

export const TeaserComposition: React.FC<TeaserProps> = ({
  variant,
  audioSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = variant === 'blue' ? PALETTE.cobalt : PALETTE.magenta;
  const backImg = staticFile(
    variant === 'blue' ? 'tee-back-blue.jpg' : 'tee-back-pink.jpg'
  );

  // ── Blur: 40px during plan1, pulls to 0 through plan2 ──────────────────
  const blurPx = interpolate(
    frame,
    [TIMING.plan1End, TIMING.plan2End],
    [40, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    }
  );

  // ── Slow zoom: breathes gently across all three photo plans ────────────
  const photoScale = interpolate(
    frame,
    [0, TIMING.plan1End, TIMING.plan2End],
    [1.12, 1.18, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Subtle warm / cinematic color grade on the photo ──────────────────
  const photoFilter = `blur(${blurPx}px) contrast(1.1) saturate(1.06) brightness(0.94)`;

  // ── Photo background fades out into the flash ──────────────────────────
  const photoBgOpacity = interpolate(
    frame,
    [TIMING.plan2End, TIMING.transitionEnd],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.55, 0, 1, 0.45),
    }
  );

  // ── Flash overlay (ecru burst at mid-transition) ────────────────────────
  const midFlash = (TIMING.transitionStart + TIMING.transitionEnd) / 2;
  const flashOpacity = interpolate(
    frame,
    [TIMING.transitionStart, midFlash, TIMING.transitionEnd],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    }
  );

  // ── Chapter label (plan 1 top) ──────────────────────────────────────────
  const labelOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // ── "Coming Soon" appears during plan 2 ────────────────────────────────
  const comingAppearsAt = TIMING.plan2Start + 20;
  const comingOpacity = interpolate(
    frame,
    [comingAppearsAt, comingAppearsAt + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const comingScale = spring({
    frame: frame - comingAppearsAt,
    fps,
    config: { damping: 22, stiffness: 110, mass: 1 },
    from: 0.9,
    to: 1,
  });
  const comingExitOpacity = interpolate(
    frame,
    [TIMING.plan2End, TIMING.transitionEnd],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── End card ───────────────────────────────────────────────────────────
  const cardReveal = interpolate(
    frame,
    [TIMING.transitionEnd, TIMING.transitionEnd + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const logoScale = spring({
    frame: frame - TIMING.plan4Start,
    fps,
    config: { damping: 22, stiffness: 90, mass: 1 },
    from: 0.82,
    to: 1,
  });
  const logoOpacity = interpolate(
    frame,
    [TIMING.plan4Start, TIMING.plan4Start + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const stagger = (delay: number) => {
    const start = TIMING.plan4Start + delay;
    return {
      opacity: interpolate(frame, [start, start + 18], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
      ty: interpolate(frame, [start, start + 18], [14, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    };
  };

  const s1 = stagger(12);
  const s2 = stagger(22);
  const s3 = stagger(32);
  const s4 = stagger(44);

  return (
    <AbsoluteFill style={{ background: PALETTE.ink, overflow: 'hidden' }}>
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* ──────────────────── PLANS 1-2: Photo background ──────────────────── */}
      <div style={{ position: 'absolute', inset: 0, opacity: photoBgOpacity }}>
        <Img
          src={backImg}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${photoScale})`,
            filter: photoFilter,
          }}
        />

        <Vignette />
        <LightSwipe />
        <GrainOverlay opacity={0.08} />

        {/* Chapter label — plan 1 */}
        <div
          style={{
            position: 'absolute',
            top: 96,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: labelOpacity,
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 15,
              letterSpacing: '0.20em',
              color: 'rgba(255,255,255,0.72)',
              textTransform: 'uppercase',
            }}
          >
            {TEXT.chapter}
          </span>
        </div>

        {/* "Coming Soon" — plan 2 center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: comingOpacity * comingExitOpacity,
            transform: `scale(${comingScale})`,
            zIndex: 20,
          }}
        >
          {/* "Coming" — outline / hollow */}
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 128,
              lineHeight: 0.88,
              textTransform: 'uppercase',
              color: 'transparent',
              WebkitTextStroke: '2.5px rgba(255,255,255,0.92)',
              letterSpacing: '0.02em',
            }}
          >
            {TEXT.coming}
          </div>
          {/* "Soon" — solid fill */}
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 128,
              lineHeight: 0.88,
              textTransform: 'uppercase',
              color: '#ffffff',
              letterSpacing: '0.02em',
            }}
          >
            {TEXT.soon}
          </div>
        </div>
      </div>

      {/* ──────────────────── Flash transition (plan 3) ────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: PALETTE.ecru,
          opacity: flashOpacity,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />

      {/* ──────────────────── End card (plan 4) ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: PALETTE.ecru,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: cardReveal,
          zIndex: 40,
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: 48,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile('logo.png')}
            style={{ width: 110, height: 110, objectFit: 'contain' }}
          />
        </div>

        {/* Brand name */}
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 44,
            letterSpacing: '0.10em',
            color: PALETTE.ink,
            textTransform: 'uppercase',
            marginBottom: 12,
            opacity: s1.opacity,
            transform: `translateY(${s1.ty}px)`,
          }}
        >
          {TEXT.brand}
        </div>

        {/* Tagline mono */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: '0.32em',
            color: accent,
            textTransform: 'uppercase',
            marginBottom: 36,
            opacity: s2.opacity,
            transform: `translateY(${s2.ty}px)`,
          }}
        >
          {TEXT.tagline}
        </div>

        {/* DROP 01 — hero size */}
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 104,
            letterSpacing: '0.04em',
            color: accent,
            textTransform: 'uppercase',
            lineHeight: 0.9,
            marginBottom: 28,
            opacity: s3.opacity,
            transform: `translateY(${s3.ty}px)`,
          }}
        >
          {TEXT.drop}
        </div>

        {/* Date teasée */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 18,
            letterSpacing: '0.22em',
            color: PALETTE.ink,
            opacity: s4.opacity * 0.45,
            transform: `translateY(${s4.ty}px)`,
          }}
        >
          {TEXT.date}
        </div>

        {/* Grain on card for texture */}
        <GrainOverlay opacity={0.04} />

        {/* Footer label */}
        <div
          style={{
            position: 'absolute',
            bottom: 52,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: '0.38em',
            color: PALETTE.ink,
            opacity: 0.3,
            textTransform: 'uppercase',
          }}
        >
          {TEXT.footer}
        </div>
      </div>
    </AbsoluteFill>
  );
};
