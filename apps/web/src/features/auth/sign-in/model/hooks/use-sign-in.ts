import type { SignInValues } from '@chatovo/schemas';

import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export const useSignIn = () =>
  useMutation({
    mutationFn: async (values: SignInValues) => {
      const result = await unwrapAuth(authClient.signIn.email(values), 'Sign in failed');

      await authClient.getSession();

      return result;
    }
  });
