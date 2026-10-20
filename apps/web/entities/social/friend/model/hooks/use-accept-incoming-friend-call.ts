'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acceptIncomingFriendCall } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useAcceptIncomingFriendCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptIncomingFriendCall,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.friendCallIncoming(), { call: null });
    }
  });
};
