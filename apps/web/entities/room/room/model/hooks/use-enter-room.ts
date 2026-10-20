import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { buildRoomHref } from '@/shared/lib';

export type EnterRoomInput = {
  password?: string;
  roomId: string;
};

export const useEnterRoom = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();

  const invisible = isAdmin && settings.system.invisibleMode;

  return useMutation({
    mutationFn: async ({ roomId, password }: EnterRoomInput) => {
      const response = await fetchLiveKitToken({ roomId, password, invisible });

      queryClient.setQueryData(QUERY_KEYS.livekitToken(roomId, password), response);

      router.push(buildRoomHref(roomId));
    }
  });
};
