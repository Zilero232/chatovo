import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getRoomMusic } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { RoomMusicView } from '../types';

import { isStaleRoomMusic, toRoomMusicView } from '../../lib';

export const useRoomMusic = (roomId: string) => {
  const queryClient = useQueryClient();

  const queryKey = QUERY_KEYS.roomMusic(roomId);

  const { data: music } = useQuery({
    queryKey,
    queryFn: async () => {
      const fetched = await getRoomMusic(roomId);
      const cached = queryClient.getQueryData<RoomMusicView>(queryKey);

      return cached && isStaleRoomMusic({ cached, music: fetched })
        ? cached
        : toRoomMusicView({ music: fetched, receivedAt: Date.now() });
    },
    enabled: roomId !== '',
    staleTime: 0,
    refetchOnMount: 'always'
  });

  return music ?? null;
};
