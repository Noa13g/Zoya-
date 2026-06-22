import React from 'react';
import {
  AbsoluteFill,
  Img,
  Audio,
  interpolate,
  useCurrentFrame,
  Easing,
  staticFile,
} from 'remotion';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadSpaceMono } from '@remotion/google-fonts/SpaceMono';
import { GrainOverlay } from './components/GrainOverlay';
import { Vignette } from './components/Vignette';
import { PALETTE, TIMING, TEXT, GRAIN, LOGO_ORIGIN } from './config';

const { fontFamily: DISPLAY } = loadAnton();
const { fontFamily: MONO } = loadSpaceMono();

export type TeaserVariant = 'blue' | 'pink';
export interface TeaserProps {
  variant: TeaserVariant;
  audioSrc?: string;
}

// ── helpers ────────────────────────────────────────────────────────────────
const EASE_IN_OUT = Easing.bezier(0.4, 0, 0.6, 1);
const EASE_OUT    = Easing.bezier(0.16, 1, 0.3, 1);

// ── component ─────────────────────────────────────────────────────────────
export const TeaserComposition: React.FC<TeaserProps> = ({ variant, audioSrc }) => {
  const frame = useCurrentFrame();

  const accent    = variant === 'blue' ? PALETTE.cobalt   : PALETTE.magenta;
  const backImg   = staticFile(variant === 'blue' ? 'tee-back-blue.png'         : 'tee-back-pink.png');
  const frontImg  = staticFile(variant === 'blue' ? 'tee-front-blue.png'        : 'tee-front-pink.png');
  const detailImg = staticFile(variant === 'blue' ? 'tee-front-blue-detail.png' : 'tee-front-pink-detail.png');
  const logoImg   = staticFile('logo.png');

  // ─────────────────── BACK IMAGE (plans 1-3 + whip exit) ─────────────────

  // Focus blur: stays 22px through plan 1, pulls to 0 through plan 2
  const backFocusBlur = (() => {
    if (frame <= TIMING.plan1End) return 22;
    if (frame <= TIMING.plan2End)
      return interpolate(frame, [TIMING.plan1End, TIMING.plan2End], [22, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      });
    return 0;
  })();

  // Scale: gentle push through plan 1→2, pullback plan 3
  const backScale = (() => {
    if (frame <= TIMING.plan1End)
      return interpolate(frame, [0, TIMING.plan1End], [1.04, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    if (frame <= TIMING.plan2End)
      return interpolate(frame, [TIMING.plan1End, TIMING.plan2End], [1.08, 1.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT });
    if (frame <= TIMING.plan3End)
      return interpolate(frame, [TIMING.plan2End, TIMING.plan3End], [1.45, 1.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT });
    return 1.06;
  })();

  // Parallax Y: slight upward shift during push-in, returns during pullback
  const backTy = (() => {
    if (frame < TIMING.plan1End) return 0;
    if (frame < TIMING.plan2End)
      return interpolate(frame, [TIMING.plan1End, TIMING.plan2End], [0, -28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT });
    if (frame < TIMING.plan3End)
      return interpolate(frame, [TIMING.plan2End, TIMING.plan3End], [-28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT });
    return 0;
  })();

  // Whip exit: back image slides left toward mid-whip
  const backWhipTx = interpolate(frame, [TIMING.plan3End, TIMING.plan4Mid], [0, -1250], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.55, 0, 1, 0.55),
  });

  // Horizontal motion blur (whip exit)
  const backHBlur = interpolate(frame, [TIMING.plan3End, TIMING.plan4Mid], [0, 75], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });

  // Back opacity — fades just before mid-whip
  const backOpacity = frame < TIMING.plan4Mid - 4
    ? 1
    : interpolate(frame, [TIMING.plan4Mid - 4, TIMING.plan4Mid], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Back CSS filter — switches to SVG hblur during whip
  const backFilter = (() => {
    const grade = 'contrast(1.09) saturate(1.05) brightness(0.95)';
    if (frame <= TIMING.plan2End) return `blur(${backFocusBlur}px) ${grade}`;
    if (backHBlur > 0) return `url(#hblur-back) ${grade}`;
    return grade;
  })();

  // ─────────────────── FRONT IMAGE (whip enter + plans 5, 7) ──────────────

  // Whip enter: front slides in from right
  const frontWhipTx = interpolate(frame, [TIMING.plan4Mid, TIMING.plan4End], [1250, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0, 0.5, 0.5, 1),
  });

  // Horizontal motion blur (whip enter — clears as image settles)
  const frontHBlur = interpolate(frame, [TIMING.plan4Mid, TIMING.plan4End - 3], [75, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Scale: hold then push toward logo (plan 5), hold during detail (plan 6), pullback (plan 7)
  const frontScale = (() => {
    if (frame < TIMING.plan5Hold) return 1.0;
    if (frame < TIMING.plan5End)
      return interpolate(frame, [TIMING.plan5Hold, TIMING.plan5End], [1.0, 1.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT });
    if (frame < TIMING.plan6End) return 1.6; // behind the detail image
    if (frame < TIMING.plan7End)
      return interpolate(frame, [TIMING.plan6End, TIMING.plan7End], [1.6, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN_OUT });
    return 1.0;
  })();

  // Front opacity: hidden until mid-whip, fades for detail swap, then end card
  const frontOpacity = (() => {
    if (frame < TIMING.plan4Mid) return 0;
    if (frame < TIMING.plan4End)
      return interpolate(frame, [TIMING.plan4Mid, TIMING.plan4Mid + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    // fade out as detail appears
    const D_IN  = TIMING.plan5End - 4;
    const D_OUT = TIMING.plan5End + 4;
    if (frame >= D_IN && frame < D_OUT)
      return interpolate(frame, [D_IN, D_OUT], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    // hidden under detail
    if (frame >= D_OUT && frame < TIMING.plan6End - 4) return 0;
    // fade back in as detail exits
    if (frame >= TIMING.plan6End - 4 && frame < TIMING.plan6End + 4)
      return interpolate(frame, [TIMING.plan6End - 4, TIMING.plan6End + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    // fade out to end card
    if (frame >= TIMING.plan7End)
      return interpolate(frame, [TIMING.plan7End, TIMING.plan7End + 14], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return 1;
  })();

  const frontTx     = frame < TIMING.plan4End ? frontWhipTx : 0;
  const frontFilter = frontHBlur > 0
    ? `url(#hblur-front) contrast(1.09) saturate(1.05) brightness(0.95)`
    : `contrast(1.09) saturate(1.05) brightness(0.95)`;

  // ─────────────────── DETAIL IMAGE (plan 6) ──────────────────────────────

  const detailOpacity = (() => {
    const IN_S  = TIMING.plan5End - 4;
    const IN_E  = TIMING.plan5End + 4;
    const OUT_S = TIMING.plan6End - 4;
    const OUT_E = TIMING.plan6End + 4;
    if (frame < IN_S) return 0;
    if (frame < IN_E) return interpolate(frame, [IN_S, IN_E], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    if (frame < OUT_S) return 1;
    if (frame < OUT_E) return interpolate(frame, [OUT_S, OUT_E], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return 0;
  })();

  const detailScale = interpolate(frame, [TIMING.plan5End, TIMING.plan6End], [1.0, 1.06], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ─────────────────── MARQUEE "COMING SOON" (plan 1 into plan 2) ──────────

  // Scrolls at constant speed from right (+1400px) to left (-1400px) over frames 5→120
  const marqueeX = interpolate(frame, [5, 120], [1450, -1450], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const marqueeOpacity = interpolate(frame, [5, 22, 95, 118], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ─────────────────── CHAPTER LABEL ──────────────────────────────────────
  const chapterOpacity = interpolate(frame, [5, 22, 88, 112], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ─────────────────── END CARD (plan 8) ──────────────────────────────────
  const endCardOpacity = interpolate(frame, [TIMING.plan7End, TIMING.plan7End + 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const stagger = (delay: number) => {
    const s = TIMING.plan7End + 3 + delay;
    return {
      opacity: interpolate(frame, [s, s + 11], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT }),
      ty:      interpolate(frame, [s, s + 11], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT }),
    };
  };

  const sLogo  = stagger(0);
  const sBrand = stagger(2);
  const sStay  = stagger(4);
  const sDrop  = stagger(6);
  const sDate  = stagger(9);
  const sTag   = stagger(14);

  // ─────────────────── DETAIL LABEL ────────────────────────────────────────
  const designedOpacity = interpolate(
    frame,
    [TIMING.plan5End + 4, TIMING.plan5End + 18, TIMING.plan6End - 8, TIMING.plan6End],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ─────────────────── RENDER ───────────────────────────────────────────────
  return (
    <AbsoluteFill style={{ background: PALETTE.black, overflow: 'hidden' }}>
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* ── SVG directional-blur filters for whip ── */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="hblur-back" x="-80%" y="-5%" width="260%" height="110%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${backHBlur} 0`} />
          </filter>
          <filter id="hblur-front" x="-80%" y="-5%" width="260%" height="110%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${frontHBlur} 0`} />
          </filter>
        </defs>
      </svg>

      {/* ── PLAN 1-3: back image (blur, push-in, pullback) ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: backOpacity,
          transform: `translateX(${backWhipTx}px) translateY(${backTy}px) scale(${backScale})`,
          filter: backFilter,
        }}
      >
        <Img src={backImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* ── PLAN 5 & 7: front image (whip enter, logo push-in, pullback) ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: frontOpacity,
          transform: `translateX(${frontTx}px) scale(${frontScale})`,
          transformOrigin: LOGO_ORIGIN,
          filter: frontFilter,
        }}
      >
        <Img src={frontImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* ── PLAN 6: detail logo close-up ── */}
      {detailOpacity > 0 && (
        <div
          style={{
            position: 'absolute', inset: 0,
            opacity: detailOpacity,
            transform: `scale(${detailScale})`,
          }}
        >
          <Img src={detailImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* ── Vignette — always on ── */}
      <Vignette />

      {/* ── Grain — always on ── */}
      <GrainOverlay opacity={GRAIN.opacity} />

      {/* ── PLAN 1: chapter label (top) ── */}
      {chapterOpacity > 0 && (
        <div
          style={{
            position: 'absolute', top: 84, left: 0, right: 0,
            textAlign: 'center',
            opacity: chapterOpacity,
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontFamily: MONO, fontSize: 14, letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase',
            }}
          >
            {TEXT.chapter}
          </span>
        </div>
      )}

      {/* ── PLAN 1→2: "COMING SOON" marquee scrolling horizontally ── */}
      {marqueeOpacity > 0 && (
        <div
          style={{
            position: 'absolute', inset: 0,
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: marqueeOpacity,
            zIndex: 22,
            pointerEvents: 'none',
          }}
        >
          <div style={{ transform: `translateX(${marqueeX}px)`, textAlign: 'center', whiteSpace: 'nowrap' }}>
            {/* "COMING" — outline */}
            <div
              style={{
                fontFamily: DISPLAY, fontSize: 142, lineHeight: 0.86,
                textTransform: 'uppercase',
                color: 'transparent',
                WebkitTextStroke: '2.5px #ffffff',
                letterSpacing: '0.02em',
              }}
            >
              {TEXT.comingSoon1}
            </div>
            {/* "SOON" — solid white */}
            <div
              style={{
                fontFamily: DISPLAY, fontSize: 142, lineHeight: 0.86,
                textTransform: 'uppercase',
                color: '#ffffff',
                letterSpacing: '0.02em',
              }}
            >
              {TEXT.comingSoon2}
            </div>
          </div>
        </div>
      )}

      {/* ── PLAN 6: "DESIGNED IN FRANCE" label ── */}
      {designedOpacity > 0 && (
        <div
          style={{
            position: 'absolute', bottom: 64, left: 0, right: 0,
            textAlign: 'center',
            opacity: designedOpacity * 0.65,
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: MONO, fontSize: 12, letterSpacing: '0.38em',
              color: '#ffffff', textTransform: 'uppercase',
            }}
          >
            {TEXT.designedIn}
          </span>
        </div>
      )}

      {/* ── PLAN 8: end card ── */}
      {endCardOpacity > 0 && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: PALETTE.black,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: endCardOpacity,
            zIndex: 50,
          }}
        >
          {/* Logo */}
          <div
            style={{
              opacity: sLogo.opacity,
              transform: `translateY(${sLogo.ty}px)`,
              marginBottom: 28,
            }}
          >
            <Img
              src={logoImg}
              style={{
                width: 88, height: 88, objectFit: 'contain',
                filter: variant === 'pink'
                  ? 'hue-rotate(282deg) saturate(1.3) brightness(1.05)'
                  : 'none',
              }}
            />
          </div>

          {/* RYOA STUDIO */}
          <div
            style={{
              fontFamily: DISPLAY, fontSize: 38, letterSpacing: '0.12em',
              color: PALETTE.white, textTransform: 'uppercase',
              marginBottom: 6,
              opacity: sBrand.opacity,
              transform: `translateY(${sBrand.ty}px)`,
            }}
          >
            {TEXT.brand}
          </div>

          {/* STAY TUNED */}
          <div
            style={{
              fontFamily: DISPLAY, fontSize: 92, letterSpacing: '0.03em',
              color: PALETTE.white, textTransform: 'uppercase',
              lineHeight: 0.87, marginBottom: 10,
              opacity: sStay.opacity,
              transform: `translateY(${sStay.ty}px)`,
            }}
          >
            {TEXT.stayTuned}
          </div>

          {/* DROP 01 */}
          <div
            style={{
              fontFamily: DISPLAY, fontSize: 58, letterSpacing: '0.06em',
              color: accent, textTransform: 'uppercase',
              lineHeight: 0.9, marginBottom: 26,
              opacity: sDrop.opacity,
              transform: `translateY(${sDrop.ty}px)`,
            }}
          >
            {TEXT.drop}
          </div>

          {/* Date */}
          <div
            style={{
              fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em',
              color: PALETTE.white,
              opacity: sDate.opacity * 0.45,
              transform: `translateY(${sDate.ty}px)`,
            }}
          >
            {TEXT.date}
          </div>

          {/* Tagline — bottom */}
          <div
            style={{
              position: 'absolute', bottom: 52,
              fontFamily: MONO, fontSize: 11, letterSpacing: '0.38em',
              color: PALETTE.white, textTransform: 'uppercase',
              opacity: sTag.opacity * 0.28,
              transform: `translateY(${sTag.ty}px)`,
            }}
          >
            {TEXT.tagline}
          </div>

          <GrainOverlay opacity={0.05} />
        </div>
      )}
    </AbsoluteFill>
  );
};
