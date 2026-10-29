export const STALE_CALL_CODES: ReadonlySet<string> = new Set(['CALL_NOT_FOUND', 'CALL_ENDED']);

export const CALL_ATTENTION = {
  titleFlashMs: 1000
} as const;

export const INCOMING_CARD_MOTION = {
  initial: { opacity: 0, y: -16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
} as const;
