import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRoom = vi.fn();
const assertNotBlocked = vi.fn();
const assertNotRoomBanned = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    room: { findUnique: (...args: unknown[]) => findRoom(...args) }
  }
}));

vi.mock('../../assert-not-blocked', () => ({
  assertNotBlocked: (userId: string) => assertNotBlocked(userId)
}));

vi.mock('../../assert-not-room-banned', () => ({
  assertNotRoomBanned: (input: unknown) => assertNotRoomBanned(input)
}));

vi.mock('../../../modules/livekit', () => ({
  hasRoomGrant: () => false
}));

const { assertCanViewRoom } = await import('../assert-can-view-room');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const userId = 'user-1';

describe('assertCanViewRoom', () => {
  beforeEach(() => {
    findRoom.mockReset();
    assertNotBlocked.mockReset().mockResolvedValue(undefined);
    assertNotRoomBanned.mockReset().mockResolvedValue(undefined);
  });

  it('lets a stranger read a private room so the client can prompt for its password', async () => {
    findRoom.mockResolvedValueOnce({
      id: 'room-1',
      kind: 'group',
      isPrivate: true,
      ownerId: 'owner-1',
      dmUserAId: null,
      dmUserBId: null
    });

    await expect(assertCanViewRoom({ roomId: 'room-1', userId })).resolves.toBeUndefined();
  });

  it('lets anyone read a public room', async () => {
    findRoom.mockResolvedValueOnce({
      id: 'room-2',
      kind: 'group',
      isPrivate: false,
      ownerId: 'owner-1',
      dmUserAId: null,
      dmUserBId: null
    });

    await expect(assertCanViewRoom({ roomId: 'room-2', userId })).resolves.toBeUndefined();
  });

  it('rejects a dm the user is not part of', async () => {
    findRoom.mockResolvedValueOnce({
      id: 'room-3',
      kind: 'dm',
      isPrivate: false,
      ownerId: null,
      dmUserAId: 'other-1',
      dmUserBId: 'other-2'
    });

    await expect(codeOf(assertCanViewRoom({ roomId: 'room-3', userId }))).resolves.toBe(
      'FORBIDDEN'
    );
  });

  it('allows a dm member', async () => {
    findRoom.mockResolvedValueOnce({
      id: 'room-4',
      kind: 'dm',
      isPrivate: false,
      ownerId: null,
      dmUserAId: userId,
      dmUserBId: 'other-2'
    });

    await expect(assertCanViewRoom({ roomId: 'room-4', userId })).resolves.toBeUndefined();
  });

  it('keeps the metadata readable to a banned user, so only the contents are shut', async () => {
    findRoom.mockResolvedValueOnce({
      id: 'room-6',
      kind: 'group',
      isPrivate: false,
      ownerId: 'owner-1',
      dmUserAId: null,
      dmUserBId: null
    });

    await expect(assertCanViewRoom({ roomId: 'room-6', userId })).resolves.toBeUndefined();
    expect(assertNotRoomBanned).not.toHaveBeenCalled();
  });

  it('reports a missing room as not found', async () => {
    findRoom.mockResolvedValueOnce(null);

    await expect(codeOf(assertCanViewRoom({ roomId: 'gone', userId }))).resolves.toBe(
      'ROOM_NOT_FOUND'
    );
  });

  it('checks the block list before reading the room', async () => {
    assertNotBlocked.mockRejectedValueOnce(new Error('blocked'));

    await expect(assertCanViewRoom({ roomId: 'room-5', userId })).rejects.toThrow('blocked');
    expect(findRoom).not.toHaveBeenCalled();
  });
});
