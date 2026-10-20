'use client';

import { useRouter } from 'next/navigation';
import { filter, indexBy, isNonNullish, map } from 'remeda';

import { useRecentRooms, useRooms, useRoomsPresence } from '@/entities/room/room';
import { buildRoomHref } from '@/shared/lib';

type UseRecentRoomsListParams = {
  onNavigate?: () => void;
};

export const useRecentRoomsList = ({ onNavigate }: UseRecentRoomsListParams) => {
  const router = useRouter();

  const { recent } = useRecentRooms();
  const { rooms, isLoading } = useRooms();
  const presence = useRoomsPresence();

  const roomsById = indexBy(rooms, (room) => room.id);

  const navigate = (roomId: string) => {
    router.push(buildRoomHref(roomId));
    onNavigate?.();
  };

  return {
    recent,
    isLoading,
    entries: filter(
      map(recent, (entry) => roomsById[entry.id]),
      isNonNullish
    ),
    isLive: (roomId: string) => (presence[roomId]?.length ?? 0) > 0,
    navigate
  };
};
