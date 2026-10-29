import { secondsToMilliseconds } from 'date-fns';

export const DM_CALL_TIMINGS = {
  ringMs: secondsToMilliseconds(45),
  callerOfflineMs: secondsToMilliseconds(10),
  joinMs: secondsToMilliseconds(20),
  peerDropGraceMs: secondsToMilliseconds(60),
  endedVisibleMs: secondsToMilliseconds(4)
} as const;
