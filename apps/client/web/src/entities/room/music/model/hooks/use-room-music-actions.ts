import type { MusicEnqueueItem, MusicPlaybackCommand, RoomMusic } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { controlRoomMusic, dequeueRoomMusic, enqueueRoomMusic } from '@/shared/api';

import { writeRoomMusicCache } from '../../lib';

export const useRoomMusicActions = (roomId: string) => {
  const queryClient = useQueryClient();

  const store = (music: RoomMusic) => {
    writeRoomMusicCache({ queryClient, music });
  };

  const enqueue = useMutation({
    mutationFn: (item: MusicEnqueueItem) => enqueueRoomMusic({ roomId, item }),
    onSuccess: store
  });

  const dequeue = useMutation({
    mutationFn: (trackId: string) => dequeueRoomMusic({ roomId, trackId }),
    onSuccess: store
  });

  const control = useMutation({
    mutationFn: (command: MusicPlaybackCommand) => controlRoomMusic({ roomId, command }),
    onSuccess: store
  });

  return { enqueue, dequeue, control };
};
