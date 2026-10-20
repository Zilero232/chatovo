import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRoom } from '@/shared/api';

import { removeRoomFromCache } from '../lib';

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: (_, roomId) => {
      removeRoomFromCache({ queryClient, roomId });
    }
  });
};
