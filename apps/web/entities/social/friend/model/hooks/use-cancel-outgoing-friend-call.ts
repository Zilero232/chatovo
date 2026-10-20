'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelOutgoingFriendCall } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useCancelOutgoingFriendCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOutgoingFriendCall,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: null });
    }
  });
};
