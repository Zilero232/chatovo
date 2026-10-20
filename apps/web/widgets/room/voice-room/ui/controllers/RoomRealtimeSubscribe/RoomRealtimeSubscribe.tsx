'use client';

import { useRealtimeSubscribe } from '@/entities/app/realtime';

import { useCurrentRoomId } from '../../../model/hooks';

export const RoomRealtimeSubscribe = () => {
  const roomId = useCurrentRoomId();

  useRealtimeSubscribe([roomId]);

  return null;
};
