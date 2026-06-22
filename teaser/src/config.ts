export const PALETTE = {
  black: '#0A0A0A',
  ecru: '#F3F0E9',
  cobalt: '#1F3BE0',
  magenta: '#F31C8C',
  white: '#FFFFFF',
} as const;

// All timings in frames at 30fps — edit here to shift any plan
export const TIMING = {
  fps: 30,
  total: 330,       // 11s
  plan1End: 75,     // 0→75   : blur + Coming Soon marquee
  plan2End: 135,    // 75→135 : push-in + focus pull
  plan3End: 165,    // 135→165: pullback (recul)
  plan4Mid: 174,    // midpoint of whip (back exits / front enters)
  plan4End: 183,    // 165→183: whip transition
  plan5Hold: 192,   // 183→192: brief hold on face (0.3s)
  plan5End: 240,    // 192→240: push-in toward logo
  plan6End: 272,    // 240→272: detail logo close-up
  plan7End: 300,    // 272→300: pullback to full face
  plan8End: 330,    // 300→330: fade + end card
} as const;

export const TEXT = {
  chapter:     'CHAPITRE 01 // BLURRED BEGINNINGS',
  comingSoon1: 'COMING',
  comingSoon2: 'SOON',
  designedIn:  'DESIGNED IN FRANCE',
  brand:       'RYOA STUDIO',
  stayTuned:   'STAY TUNED',
  drop:        'DROP 01',
  date:        '?? · 2026',
  tagline:     'TRUE FOR NOW',
} as const;

export const GRAIN = { opacity: 0.08 } as const;

// Logo push-in target: left-chest logo position on the front tee image
export const LOGO_ORIGIN = '40% 31%' as const;
