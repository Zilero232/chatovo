import { secondsToMilliseconds } from 'date-fns';
import { GrammyError } from 'grammy';

import type { EditFailure } from '../../telegram.types';

import { EDIT_MISSING_RE, EDIT_UNCHANGED_RE } from '../../config';

export const readEditFailure = (error: unknown): EditFailure => {
  if (!(error instanceof GrammyError)) {
    return { kind: 'failed', retryAfterMs: null };
  }

  if (EDIT_UNCHANGED_RE.test(error.description)) {
    return { kind: 'unchanged' };
  }

  if (EDIT_MISSING_RE.test(error.description)) {
    return { kind: 'missing' };
  }

  const retryAfter = error.parameters.retry_after;

  return {
    kind: 'failed',
    retryAfterMs: retryAfter === undefined ? null : secondsToMilliseconds(retryAfter)
  };
};
