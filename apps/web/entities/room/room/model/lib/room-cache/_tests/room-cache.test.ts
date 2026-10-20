import type { Room } from '@chatovo/schemas';

import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';

import { removeRoomFromCache, upsertRoomInCache } from '../room-cache';

const room = (id: string, name: string): Room => ({
  id,
  name,
  kind: 'group',
  isPrivate: false,
  ownerId: '00000000-0000-4000-8000-000000000001'
});

const ALPHA = room('00000000-0000-4000-8000-00000000000a', 'alpha');
const BETA = room('00000000-0000-4000-8000-00000000000b', 'beta');

const clientWithRooms = (rooms?: Room[]) => {
  const queryClient = new QueryClient();

  if (rooms) {
    queryClient.setQueryData(QUERY_KEYS.rooms(), rooms);
  }

  return queryClient;
};

describe('upsertRoomInCache', () => {
  it('puts a new room at the top of the list', () => {
    const queryClient = clientWithRooms([ALPHA]);

    upsertRoomInCache({ queryClient, room: BETA });

    expect(queryClient.getQueryData(QUERY_KEYS.rooms())).toEqual([BETA, ALPHA]);
  });

  it('replaces a known room in place instead of duplicating it', () => {
    const queryClient = clientWithRooms([ALPHA, BETA]);
    const renamed = { ...ALPHA, name: 'alpha-2', isPrivate: true };

    upsertRoomInCache({ queryClient, room: renamed });
    upsertRoomInCache({ queryClient, room: renamed });

    expect(queryClient.getQueryData(QUERY_KEYS.rooms())).toEqual([renamed, BETA]);
  });

  it('leaves a list that was never loaded alone, so it is not cached as partial', () => {
    const queryClient = clientWithRooms();

    upsertRoomInCache({ queryClient, room: ALPHA });

    expect(queryClient.getQueryData(QUERY_KEYS.rooms())).toBeUndefined();
  });

  it('refreshes the single-room query too', () => {
    const queryClient = clientWithRooms([ALPHA]);

    upsertRoomInCache({ queryClient, room: ALPHA });

    expect(queryClient.getQueryData(QUERY_KEYS.room(ALPHA.id))).toEqual(ALPHA);
  });
});

describe('removeRoomFromCache', () => {
  it('drops the room from the list and forgets its own query', () => {
    const queryClient = clientWithRooms([ALPHA, BETA]);

    queryClient.setQueryData(QUERY_KEYS.room(ALPHA.id), ALPHA);
    removeRoomFromCache({ queryClient, roomId: ALPHA.id });

    expect(queryClient.getQueryData(QUERY_KEYS.rooms())).toEqual([BETA]);
    expect(queryClient.getQueryData(QUERY_KEYS.room(ALPHA.id))).toBeUndefined();
  });

  it('ignores an unknown room', () => {
    const queryClient = clientWithRooms([BETA]);

    removeRoomFromCache({ queryClient, roomId: ALPHA.id });

    expect(queryClient.getQueryData(QUERY_KEYS.rooms())).toEqual([BETA]);
  });
});
