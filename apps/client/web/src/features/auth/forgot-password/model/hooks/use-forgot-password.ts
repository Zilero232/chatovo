import type { ForgotPasswordValues } from '@chatovo/schemas';

import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { buildPublicAppUrl } from '@/shared/lib';

export const useForgotPassword = () =>
  useMutation({
    mutationFn: ({ email }: ForgotPasswordValues) =>
      unwrapAuth(
        authClient.requestPasswordReset({
          email,
          redirectTo: buildPublicAppUrl(ROUTES.resetPassword)
        }),
        'Failed to send reset email'
      )
  });
