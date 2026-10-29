import { beforeEach, describe, expect, it, vi } from 'vitest';

const getRoomDmRouting = vi.fn();
const findFriendship = vi.fn();

vi.mock('../../get-room-dm-routing', () => ({
  getRoomDmRouting: (roomId: string) => getRoomDmRouting(roomId)
}));

vi.mock('../../../core', () => ({
  basePrisma: { friendship: { findFirst: (...args: unknown[]) => findFriendship(...args) } }
}));

const { assertDmFriends } = await import('../assert-dm-friends');

const DM_ROOM = { kind: 'dm', dmUserAId: 'user-a', dmUserBId: 'user-b' };

describe('assertDmFriends', () => {
  beforeEach(() => {
    getRoomDmRouting.mockReset().mockResolvedValue(DM_ROOM);
    findFriendship.mockReset().mockResolvedValue({ id: 'friendship-1' });
  });

  it('lets a friend into the DM voice room', async () => {
    await expect(assertDmFriends({ roomId: 'room-1', userId: 'user-a' })).resolves.toBeUndefined();
  });

  it('refuses a former friend, who could otherwise still join by the room link', async () => {
    findFriendship.mockResolvedValueOnce(null);

    await expect(assertDmFriends({ roomId: 'room-1', userId: 'user-a' })).rejects.toMatchObject({
      response: { code: 'DM_NOT_FRIENDS' }
    });
  });

  it('never checks friendship for a group room', async () => {
    getRoomDmRouting.mockResolvedValueOnce({ kind: 'group', dmUserAId: null, dmUserBId: null });

    await expect(assertDmFriends({ roomId: 'room-1', userId: 'user-a' })).resolves.toBeUndefined();
    expect(findFriendship).not.toHaveBeenCalled();
  });
});
