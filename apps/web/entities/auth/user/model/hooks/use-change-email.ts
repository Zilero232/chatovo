'use client';

import type { ChangeEmailValues } from '@chatovo/schemas';

import { changeEmailSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export type { ChangeEmailValues };
export { changeEmailSchema };

export const useChangeEmail = () =>
  useMutation({
    mutationFn: ({ newEmail }: ChangeEmailValues) =>
      unwrapAuth(
        authClient.changeEmail({
          newEmail,
          callbackURL: '/'
        }),
        'Failed to change email'
      )
  });
