import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export const useSendVerificationEmail = () =>
  useMutation({
    mutationFn: (email: string) => {
      const callbackURL = `${window.location.origin}/`;

      return unwrapAuth(
        authClient.sendVerificationEmail({
          email,
          callbackURL
        }),
        'Failed to send verification email'
      );
    }
  });
