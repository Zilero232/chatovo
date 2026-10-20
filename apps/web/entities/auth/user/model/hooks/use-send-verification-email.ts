'use client';

import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export const useSendVerificationEmail = () =>
  useMutation({
    mutationFn: (email: string) => {
      const callbackURL = typeof window === 'undefined' ? '/' : `${window.location.origin}/`;

      return unwrapAuth(
        authClient.sendVerificationEmail({
          email,
          callbackURL
        }),
        'Failed to send verification email'
      );
    }
  });
