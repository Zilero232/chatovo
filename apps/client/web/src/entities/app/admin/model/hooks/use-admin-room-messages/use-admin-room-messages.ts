import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { listAdminRoomMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseAdminRoomMessagesInput } from './use-admin-room-messages.types';

export const useAdminRoomMessages = ({ roomId, query, enabled }: UseAdminRoomMessagesInput) =>
  useQuery({
    queryKey: QUERY_KEYS.adminRoomMessages(roomId, query),
    queryFn: () => listAdminRoomMessages({ roomId, query }),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: secondsToMilliseconds(15)
  });
