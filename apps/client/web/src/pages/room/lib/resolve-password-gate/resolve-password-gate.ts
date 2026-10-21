import { apiErrorCode } from '@/shared/api';

import type { PasswordGate, ResolvePasswordGateInput } from './resolve-password-gate.types';

export const resolvePasswordGate = ({
  isPrivate,
  tokenFailed,
  tokenError,
  password
}: ResolvePasswordGateInput): PasswordGate => {
  const code = apiErrorCode(tokenError);
  const isPasswordPrompt = code === 'ROOM_PASSWORD_REQUIRED';
  const isRefused = tokenFailed && code === 'ROOM_BANNED';

  return {
    isRefused,
    showPasswordForm: isPrivate && !isRefused && (tokenFailed || password !== undefined),
    passwordError: tokenFailed && !isPasswordPrompt ? tokenError : null
  };
};
