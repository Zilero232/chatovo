import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

type Options = {
  password?: string;
};

export const useRoomToken = (roomId: string | null, { password }: Options = {}) => {
  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();

  const invisible = isAdmin && settings.system.invisibleMode;

  return useQuery({
    queryKey: QUERY_KEYS.livekitToken(roomId, password, invisible),
    queryFn: () => fetchLiveKitToken({ roomId: roomId as string, password, invisible }),
    select: ({ token }) => token,
    enabled: isNonNullish(roomId),
    retry: false,
    gcTime: 0
  });
};
