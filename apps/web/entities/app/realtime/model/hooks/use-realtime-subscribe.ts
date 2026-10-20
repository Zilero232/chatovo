'use client';

import { useEffect } from 'react';

import { addSubscriptionRooms, removeSubscriptionRooms } from '../lib/subscription-registry';
import { syncRoomSubscriptions } from '../lib/subscription-sync';

export const useRealtimeSubscribe = (roomIds: string[]) => {
  const roomsKey = [...roomIds].sort().join(',');

  useEffect(() => {
    const rooms = roomsKey.length > 0 ? roomsKey.split(',') : [];

    addSubscriptionRooms(rooms);
    syncRoomSubscriptions();

    return () => {
      removeSubscriptionRooms(rooms);
      syncRoomSubscriptions();
    };
  }, [roomsKey]);
};
