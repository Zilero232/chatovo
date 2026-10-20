'use client';

import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';
import { ROUTES } from '@/shared/constants';

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: () =>
      unwrapAuth(
        authClient.deleteUser({ callbackURL: ROUTES.auth }),
        'Failed to request account deletion'
      )
  });
