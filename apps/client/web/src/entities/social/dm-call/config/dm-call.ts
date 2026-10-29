import type { DmCallsSnapshot } from '@chatovo/schemas';

export const DM_CALL_LOOP_SRC = {
  incoming: '/audios/call/incoming.mp3',
  outgoing: '/audios/call/outgoing.mp3'
} as const;

export type DmCallLoopKind = keyof typeof DM_CALL_LOOP_SRC;

export const DM_CALL_TIMING = {
  endedVisibleMs: 4000,
  tickMs: 1000
} as const;

export const EMPTY_DM_CALLS: DmCallsSnapshot = { current: null, incoming: null };
