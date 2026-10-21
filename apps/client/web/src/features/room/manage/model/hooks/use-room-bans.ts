import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { listRoomBans } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRoomBans = (roomId: string | null) =>
  useQuery({
    queryKey: QUERY_KEYS.roomBans(roomId ?? ''),
    queryFn: () => listRoomBans(roomId as string),
    enabled: isNonNullish(roomId)
  });
