import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRoom } from '@/shared/api';

import { upsertRoomInCache } from '../lib';

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: (room) => {
      upsertRoomInCache({ queryClient, room });
    }
  });
};
