import type { DmCallEndReason } from '@chatovo/schemas';

import { hoursToMilliseconds } from 'date-fns';

export const SIGNUP_WINDOW_MS = hoursToMilliseconds(24);

export const MISSED_CALL_OUTCOMES: ReadonlySet<DmCallEndReason> = new Set([
  'missed',
  'cancelled',
  'busy'
]);
