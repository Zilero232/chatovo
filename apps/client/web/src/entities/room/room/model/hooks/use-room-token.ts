import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { useIsInvisible } from './use-is-invisible';

type Options = {
  password?: string;
};

export const useRoomToken = (roomId: string | null, { password }: Options = {}) => {
  const invisible = useIsInvisible();

  return useQuery({
    queryKey: QUERY_KEYS.livekitToken(roomId, password, invisible),
    queryFn: () => fetchLiveKitToken({ roomId: roomId as string, password, invisible }),
    select: ({ token }) => token,
    enabled: isNonNullish(roomId),
    retry: false,
    gcTime: 0
  });
};
