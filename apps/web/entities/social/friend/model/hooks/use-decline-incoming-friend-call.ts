'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { declineIncomingFriendCall } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useDeclineIncomingFriendCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineIncomingFriendCall,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.friendCallIncoming(), { call: null });
    }
  });
};
