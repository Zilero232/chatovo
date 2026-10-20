'use client';

import type { RoomParticipant } from '@chatovo/schemas';

import { useRoomsPresence } from './use-rooms-presence';

const EMPTY: RoomParticipant[] = [];

export const useRoomParticipants = (roomId: string | null): RoomParticipant[] => {
  const rooms = useRoomsPresence();

  return (roomId && rooms[roomId]) || EMPTY;
};
