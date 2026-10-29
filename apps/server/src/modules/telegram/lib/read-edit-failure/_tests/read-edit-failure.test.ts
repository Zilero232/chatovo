import { GrammyError } from 'grammy';
import { describe, expect, it } from 'vitest';

import { readEditFailure } from '../read-edit-failure';

const apiError = (description: string, retryAfter?: number) =>
  new GrammyError(
    description,
    {
      ok: false,
      error_code: retryAfter ? 429 : 400,
      description,
      parameters: retryAfter ? { retry_after: retryAfter } : {}
    },
    'editMessageText',
    {}
  );

describe('readEditFailure', () => {
  it('treats an identical text as nothing to change', () => {
    expect(
      readEditFailure(apiError('Bad Request: message is not modified: specified new content'))
    ).toEqual({ kind: 'unchanged' });
  });

  it('reports a deleted or uneditable message as missing', () => {
    expect(readEditFailure(apiError('Bad Request: message to edit not found'))).toEqual({
      kind: 'missing'
    });
    expect(readEditFailure(apiError("Bad Request: message can't be edited"))).toEqual({
      kind: 'missing'
    });
  });

  it('carries the flood wait from Telegram into the retry delay', () => {
    expect(readEditFailure(apiError('Too Many Requests: retry after 7', 7))).toEqual({
      kind: 'failed',
      retryAfterMs: 7000
    });
  });

  it('treats a network error as a plain failure', () => {
    expect(readEditFailure(new Error('socket hang up'))).toEqual({
      kind: 'failed',
      retryAfterMs: null
    });
  });
});
