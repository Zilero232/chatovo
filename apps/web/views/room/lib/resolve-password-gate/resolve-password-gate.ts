import { apiErrorCode } from '@/shared/api';

import type { PasswordGate, ResolvePasswordGateInput } from './resolve-password-gate.types';

export const resolvePasswordGate = ({
  isPrivate,
  tokenFailed,
  tokenError,
  password
}: ResolvePasswordGateInput): PasswordGate => {
  const isPasswordPrompt = apiErrorCode(tokenError) === 'ROOM_PASSWORD_REQUIRED';

  return {
    showPasswordForm: isPrivate && (tokenFailed || password !== undefined),
    passwordError: tokenFailed && !isPasswordPrompt ? tokenError : null
  };
};
