import { beforeEach, describe, expect, it, vi } from 'vitest';

const findBans = vi.fn();
const findUser = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    roomBan: { findMany: (...args: unknown[]) => findBans(...args) },
    user: { findUnique: (...args: unknown[]) => findUser(...args) }
  }
}));

const { findBannedRoomIds } = await import('../find-banned-room-ids');

const userId = 'user-1';

describe('findBannedRoomIds', () => {
  beforeEach(() => {
    findBans.mockReset().mockResolvedValue([]);
    findUser.mockReset().mockResolvedValue({ role: 'user' });
  });

  it('skips the query entirely for an empty list', async () => {
    await expect(findBannedRoomIds({ roomIds: [], userId })).resolves.toEqual(new Set());
    expect(findBans).not.toHaveBeenCalled();
  });

  it('looks the bans up for that user among the given rooms only', async () => {
    await findBannedRoomIds({ roomIds: ['room-a', 'room-b'], userId });

    expect(findBans).toHaveBeenCalledWith({
      where: { userId, roomId: { in: ['room-a', 'room-b'] } },
      select: { roomId: true }
    });
  });

  it('returns the rooms the user is banned from', async () => {
    findBans.mockResolvedValueOnce([{ roomId: 'room-b' }]);

    await expect(findBannedRoomIds({ roomIds: ['room-a', 'room-b'], userId })).resolves.toEqual(
      new Set(['room-b'])
    );
  });

  it('does not read the role when there is no ban', async () => {
    await findBannedRoomIds({ roomIds: ['room-a'], userId });

    expect(findUser).not.toHaveBeenCalled();
  });

  it('never keeps an app admin out, even with a ban row', async () => {
    findBans.mockResolvedValueOnce([{ roomId: 'room-a' }]);
    findUser.mockResolvedValueOnce({ role: 'admin' });

    await expect(findBannedRoomIds({ roomIds: ['room-a'], userId })).resolves.toEqual(new Set());
  });
});
