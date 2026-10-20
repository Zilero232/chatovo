import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api';

import { resolvePasswordGate } from '../resolve-password-gate';

const PASSWORD_REQUIRED = new ApiError('ROOM_PASSWORD_REQUIRED', 'Password required', 403);
const PASSWORD_INVALID = new ApiError('ROOM_PASSWORD_INVALID', 'Invalid password', 403);

const gate = (overrides: Partial<Parameters<typeof resolvePasswordGate>[0]>) =>
  resolvePasswordGate({
    isPrivate: true,
    tokenFailed: false,
    tokenError: null,
    password: undefined,
    ...overrides
  });

describe('resolvePasswordGate', () => {
  it('tries to join a private room first instead of asking for the password, so its owner walks straight in', () => {
    expect(gate({})).toEqual({ showPasswordForm: false, passwordError: null });
  });

  it('asks for the password once the server says one is needed, without showing it as an error', () => {
    expect(gate({ tokenFailed: true, tokenError: PASSWORD_REQUIRED })).toEqual({
      showPasswordForm: true,
      passwordError: null
    });
  });

  it('keeps the form up while an entered password is being checked', () => {
    expect(gate({ password: 'secret' }).showPasswordForm).toBe(true);
  });

  it('shows a wrong password as an error on the form', () => {
    expect(gate({ password: 'nope', tokenFailed: true, tokenError: PASSWORD_INVALID })).toEqual({
      showPasswordForm: true,
      passwordError: PASSWORD_INVALID
    });
  });

  it('never shows the form for a public room', () => {
    expect(gate({ isPrivate: false, tokenFailed: true, tokenError: PASSWORD_REQUIRED })).toEqual({
      showPasswordForm: false,
      passwordError: null
    });
  });
});
