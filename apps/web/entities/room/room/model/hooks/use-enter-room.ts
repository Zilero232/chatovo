import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

export type EnterRoomInput = {
  password?: string;
  roomId: string;
};

export const useEnterRoom = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();

  const invisible = isAdmin && settings.system.invisibleMode;

  return useMutation({
    mutationFn: async ({ roomId, password }: EnterRoomInput) => {
      const response = await fetchLiveKitToken({ roomId, password, invisible });

      queryClient.setQueryData(QUERY_KEYS.livekitToken(roomId, password), response);

      navigate({ to: ROUTES.room, search: buildRoomSearch(roomId) });
    }
  });
};
