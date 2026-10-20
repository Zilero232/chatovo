'use client';

import { useMutation } from '@tanstack/react-query';

import { removeFriendship } from '@/shared/api';

import { useInvalidateFriends } from './use-invalidate-friends';

export const useRemoveFriendship = () => {
  const invalidate = useInvalidateFriends();

  return useMutation({
    mutationFn: (userId: string) => removeFriendship(userId),
    onSuccess: (_data, userId) => {
      invalidate(userId);
    }
  });
};
