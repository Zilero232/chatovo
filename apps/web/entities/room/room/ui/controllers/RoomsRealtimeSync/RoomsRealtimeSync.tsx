import { useQueryClient } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { useRealtimeMessage } from '@/entities/app/realtime';

import { removeRoomFromCache, upsertRoomInCache } from '../../../model/lib';

export const RoomsRealtimeSync = () => {
  const queryClient = useQueryClient();

  useRealtimeMessage((message) => {
    match(message)
      .with({ type: 'room.upserted', room: { kind: 'group' } }, ({ room }) => {
        upsertRoomInCache({ queryClient, room });
      })
      .with({ type: 'room.removed' }, ({ roomId }) => {
        removeRoomFromCache({ queryClient, roomId });
      })
      .otherwise(() => {});
  });

  return null;
};
