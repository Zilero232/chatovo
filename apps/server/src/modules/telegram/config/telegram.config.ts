import { minutesToMilliseconds, secondsToMilliseconds } from 'date-fns';

export const VOICE_FLUSH_DELAY_MS = secondsToMilliseconds(2);

export const VOICE_MIN_EDIT_GAP_MS = secondsToMilliseconds(10);

export const VOICE_REFRESH_INTERVAL_MS = secondsToMilliseconds(30);

export const VOICE_ABANDON_AFTER_MS = minutesToMilliseconds(5);

export const VOICE_ELAPSED_STEP_MS = minutesToMilliseconds(5);

export const VOICE_RETRY_DELAY_MS = secondsToMilliseconds(5);

export const VOICE_MAX_DELIVERY_ATTEMPTS = 3;

export const VOICE_MAX_LISTED_NAMES = 20;

export const EDIT_UNCHANGED_RE = /message is not modified/i;

export const EDIT_MISSING_RE =
  /message to edit not found|message can't be edited|message_id_invalid/i;
