import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RealtimeConnection } from '../../realtime.types';

const emitRoomEvent = vi.fn();
const patchParticipant = vi.fn();
const isInvisibleInRoom = vi.fn();
const setConnectionRooms = vi.fn();
const filterAccessibleRooms = vi.fn();

vi.mock('../../emit', () => ({
  emitRoomEvent: (...args: unknown[]) => emitRoomEvent(...args)
}));

vi.mock('../../../livekit/presence', () => ({
  patchParticipant: (...args: unknown[]) => patchParticipant(...args)
}));

vi.mock('../../../livekit', () => ({
  isInvisibleInRoom: (input: unknown) => isInvisibleInRoom(input)
}));

vi.mock('../../connection-store', () => ({
  setConnectionRooms: (...args: unknown[]) => setConnectionRooms(...args)
}));

vi.mock('../../../../lib', () => ({
  filterAccessibleRooms: (input: unknown) => filterAccessibleRooms(input)
}));

const { handleClientMessage } = await import('../client-message');

const ROOM_ID = '11111111-1111-4111-8111-111111111111';

const connectionOf = (canSeeInvisible: boolean, rooms: string[]): RealtimeConnection =>
  ({
    id: 'connection-1',
    isActive: true,
    canSeeInvisible,
    isAlive: true,
    rooms: new Set(rooms),
    userId: 'user-1',
    ws: {} as RealtimeConnection['ws']
  }) satisfies RealtimeConnection;

describe('handleClientMessage', () => {
  beforeEach(() => {
    emitRoomEvent.mockReset();
    patchParticipant.mockReset();
    isInvisibleInRoom.mockReset().mockReturnValue(false);
    setConnectionRooms.mockReset();
    filterAccessibleRooms.mockReset().mockResolvedValue([]);
  });

  it('still broadcasts reactions from a regular user', async () => {
    await handleClientMessage(
      connectionOf(false, [ROOM_ID]),
      JSON.stringify({ op: 'room.reaction', roomId: ROOM_ID, emoji: '🔥' })
    );

    expect(emitRoomEvent).toHaveBeenCalledWith(ROOM_ID, {
      type: 'room.reaction',
      roomId: ROOM_ID,
      emoji: '🔥',
      senderId: 'user-1'
    });
  });

  it('swallows a reaction from an admin sitting invisibly in the room', async () => {
    isInvisibleInRoom.mockReturnValueOnce(true);

    await handleClientMessage(
      connectionOf(true, [ROOM_ID]),
      JSON.stringify({ op: 'room.reaction', roomId: ROOM_ID, emoji: '🔥' })
    );

    expect(emitRoomEvent).not.toHaveBeenCalled();
  });

  it('subscribes only to the rooms the access filter keeps, so a banned room is left out', async () => {
    const OTHER_ROOM_ID = '22222222-2222-4222-8222-222222222222';

    filterAccessibleRooms.mockResolvedValueOnce([OTHER_ROOM_ID]);

    await handleClientMessage(
      connectionOf(false, []),
      JSON.stringify({ op: 'subscribe', rooms: [ROOM_ID, OTHER_ROOM_ID] })
    );

    expect(filterAccessibleRooms).toHaveBeenCalledWith({
      roomIds: [ROOM_ID, OTHER_ROOM_ID],
      userId: 'user-1'
    });
    expect(setConnectionRooms).toHaveBeenCalledWith('connection-1', [OTHER_ROOM_ID]);
  });

  it('drops presence and reactions for a room the connection is not subscribed to', async () => {
    const connection = connectionOf(false, []);

    await handleClientMessage(
      connection,
      JSON.stringify({ op: 'presence.patch', roomId: ROOM_ID, micMuted: true })
    );
    await handleClientMessage(
      connection,
      JSON.stringify({ op: 'room.reaction', roomId: ROOM_ID, emoji: '🔥' })
    );

    expect(patchParticipant).not.toHaveBeenCalled();
    expect(emitRoomEvent).not.toHaveBeenCalled();
  });

  it('ignores malformed payloads', async () => {
    await handleClientMessage(connectionOf(true, [ROOM_ID]), 'not json');

    expect(emitRoomEvent).not.toHaveBeenCalled();
    expect(patchParticipant).not.toHaveBeenCalled();
  });

  it('records whether the client app is in the foreground', async () => {
    const connection = connectionOf(false, []);

    await handleClientMessage(connection, JSON.stringify({ op: 'client.activity', active: false }));

    expect(connection.isActive).toBe(false);
  });
});
