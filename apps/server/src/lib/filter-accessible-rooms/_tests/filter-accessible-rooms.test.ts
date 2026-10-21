import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRooms = vi.fn();
const hasRoomGrant = vi.fn();
const findBannedRoomIds = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    room: { findMany: (...args: unknown[]) => findRooms(...args) }
  }
}));

vi.mock('../../find-banned-room-ids', () => ({
  findBannedRoomIds: (input: unknown) => findBannedRoomIds(input)
}));

vi.mock('../../../modules/livekit', () => ({
  hasRoomGrant: (roomId: string, userId: string) => hasRoomGrant(roomId, userId)
}));

const { filterAccessibleRooms } = await import('../filter-accessible-rooms');

const userId = 'user-1';

const room = (overrides: Record<string, unknown>) => ({
  id: 'room-public',
  kind: 'group',
  isPrivate: false,
  ownerId: 'owner-1',
  dmUserAId: null,
  dmUserBId: null,
  ...overrides
});

describe('filterAccessibleRooms', () => {
  beforeEach(() => {
    findRooms.mockReset();
    hasRoomGrant.mockReset().mockReturnValue(false);
    findBannedRoomIds.mockReset().mockResolvedValue(new Set());
  });

  it('skips the query entirely for an empty list', async () => {
    await expect(filterAccessibleRooms({ roomIds: [], userId })).resolves.toEqual([]);
    expect(findRooms).not.toHaveBeenCalled();
  });

  it('keeps only the rooms the user may enter', async () => {
    findRooms.mockResolvedValueOnce([
      room({ id: 'public' }),
      room({ id: 'private-stranger', isPrivate: true }),
      room({ id: 'private-owned', isPrivate: true, ownerId: userId }),
      room({ id: 'dm-mine', kind: 'dm', dmUserAId: userId, dmUserBId: 'other' }),
      room({ id: 'dm-theirs', kind: 'dm', dmUserAId: 'a', dmUserBId: 'b' })
    ]);

    await expect(
      filterAccessibleRooms({
        roomIds: ['public', 'private-stranger', 'private-owned', 'dm-mine', 'dm-theirs'],
        userId
      })
    ).resolves.toEqual(['public', 'private-owned', 'dm-mine']);
  });

  it('keeps a private room the user holds a live grant for', async () => {
    findRooms.mockResolvedValueOnce([room({ id: 'private-granted', isPrivate: true })]);
    hasRoomGrant.mockReturnValue(true);

    await expect(filterAccessibleRooms({ roomIds: ['private-granted'], userId })).resolves.toEqual([
      'private-granted'
    ]);
  });

  it('drops a room the user is banned from, so a banned user cannot subscribe to it', async () => {
    findRooms.mockResolvedValueOnce([room({ id: 'public' }), room({ id: 'banned' })]);
    findBannedRoomIds.mockResolvedValueOnce(new Set(['banned']));

    await expect(filterAccessibleRooms({ roomIds: ['public', 'banned'], userId })).resolves.toEqual(
      ['public']
    );
  });

  it('checks bans only among the rooms that passed the access rule', async () => {
    findRooms.mockResolvedValueOnce([
      room({ id: 'public' }),
      room({ id: 'private-stranger', isPrivate: true })
    ]);

    await filterAccessibleRooms({ roomIds: ['public', 'private-stranger'], userId });

    expect(findBannedRoomIds).toHaveBeenCalledWith({ roomIds: ['public'], userId });
  });

  it('drops ids that no longer resolve to a room', async () => {
    findRooms.mockResolvedValueOnce([]);

    await expect(filterAccessibleRooms({ roomIds: ['gone'], userId })).resolves.toEqual([]);
  });
});
