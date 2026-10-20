export const SLOW_CONNECTIONS: readonly string[] = ['slow-2g', '2g', '3g'];

export const WEBGL_LIMITS = {
  offMemory: 2,
  offCores: 2,
  liteMemory: 4,
  liteCores: 4,
  unknownHigh: 8,
  narrowQuery: '(max-width: 760px)',
  coarseQuery: '(pointer: coarse)',
  reducedMotionQuery: '(prefers-reduced-motion: reduce)'
} as const;

export const WEBGL_STAGE = {
  nearMargin: '200px',
  idleTimeoutMs: 2500,
  interactionEvents: ['pointerdown', 'touchstart', 'scroll', 'keydown', 'wheel']
} as const;
