'use client';

import type { UpdateRoomRequest } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateRoom } from '@/shared/api';

import { upsertRoomInCache } from '../lib';

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoomRequest }) => updateRoom(id, input),
    onSuccess: (room) => {
      upsertRoomInCache({ queryClient, room });
    }
  });
};
