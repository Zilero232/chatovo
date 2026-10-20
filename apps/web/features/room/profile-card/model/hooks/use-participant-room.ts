'use client';

import { entries, find, isNullish, pipe } from 'remeda';

import { useRooms, useRoomsPresence } from '@/entities/room/room';

export type ParticipantRoom = {
  roomId: string;
  roomName: string;
};

export const useParticipantRoom = (identity: string) => {
  const presence = useRoomsPresence();
  const { rooms, isLoading } = useRooms();

  const entry = pipe(
    entries(presence),
    find(([, participants]) => participants.some((p) => p.identity === identity))
  );

  if (isNullish(entry)) {
    return { room: null, isLoading };
  }

  const [roomId] = entry;
  const roomName = find(rooms, (room) => room.id === roomId)?.name ?? roomId;

  return { room: { roomId, roomName } satisfies ParticipantRoom, isLoading };
};
