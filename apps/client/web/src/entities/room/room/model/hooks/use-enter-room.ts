import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

import { useIsInvisible } from './use-is-invisible';

export type EnterRoomInput = {
  password?: string;
  roomId: string;
};

export const useEnterRoom = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const invisible = useIsInvisible();

  return useMutation({
    mutationFn: async ({ roomId, password }: EnterRoomInput) => {
      const response = await fetchLiveKitToken({ roomId, password, invisible });

      queryClient.setQueryData(QUERY_KEYS.livekitToken(roomId, password), response);

      navigate({ to: ROUTES.room, search: buildRoomSearch(roomId) });
    }
  });
};
