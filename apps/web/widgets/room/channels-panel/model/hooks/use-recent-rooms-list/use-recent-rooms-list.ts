import { useNavigate } from '@tanstack/react-router';
import { filter, indexBy, isNonNullish, map } from 'remeda';

import { useRecentRooms, useRooms, useRoomsPresence } from '@/entities/room/room';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

type UseRecentRoomsListParams = {
  onNavigate?: () => void;
};

export const useRecentRoomsList = ({ onNavigate }: UseRecentRoomsListParams) => {
  const navigateTo = useNavigate();

  const { recent } = useRecentRooms();
  const { rooms, isLoading } = useRooms();
  const presence = useRoomsPresence();

  const roomsById = indexBy(rooms, (room) => room.id);

  const navigate = (roomId: string) => {
    navigateTo({ to: ROUTES.room, search: buildRoomSearch(roomId) });
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
