'use client';

import type { ChangePasswordValues } from '@chatovo/schemas';

import { changePasswordSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export type { ChangePasswordValues };
export { changePasswordSchema };

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ currentPassword, newPassword }: ChangePasswordValues) =>
      unwrapAuth(
        authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true
        }),
        'Failed to change password'
      )
  });
