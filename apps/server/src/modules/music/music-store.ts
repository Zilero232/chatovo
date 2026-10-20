import type { RoomMusicState, StoredRoomMusic, WriteRoomMusicInput } from './music.types';

import { EMPTY_ROOM_MUSIC } from './config';

const rooms = new Map<string, StoredRoomMusic>();

let lastRevision = Date.now();

const nextRevision = (): number => {
  lastRevision = Math.max(lastRevision + 1, Date.now());

  return lastRevision;
};

export const readRoomMusic = (roomId: string): RoomMusicState =>
  rooms.get(roomId)?.state ?? EMPTY_ROOM_MUSIC;

export const readRoomMusicRevision = (roomId: string): number =>
  rooms.get(roomId)?.revision ?? lastRevision;

export const writeRoomMusic = ({ roomId, state }: WriteRoomMusicInput): void => {
  const revision = nextRevision();

  if (!state.current && state.queue.length === 0 && state.history.length === 0) {
    rooms.delete(roomId);

    return;
  }

  rooms.set(roomId, { state, revision });
};

export const listMusicRoomIds = (): string[] => [...rooms.keys()];
