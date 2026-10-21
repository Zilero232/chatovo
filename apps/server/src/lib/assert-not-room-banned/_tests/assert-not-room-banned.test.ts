import { beforeEach, describe, expect, it, vi } from 'vitest';

const findBannedRoomIds = vi.fn();

vi.mock('../../find-banned-room-ids', () => ({
  findBannedRoomIds: (input: unknown) => findBannedRoomIds(input)
}));

const { assertNotRoomBanned } = await import('../assert-not-room-banned');

describe('assertNotRoomBanned', () => {
  beforeEach(() => {
    findBannedRoomIds.mockReset();
  });

  it('lets in a user with no ban for the room', async () => {
    findBannedRoomIds.mockResolvedValueOnce(new Set());

    await expect(
      assertNotRoomBanned({ roomId: 'room-1', userId: 'user-1' })
    ).resolves.toBeUndefined();
  });

  it('refuses a banned user with a 403 ROOM_BANNED', async () => {
    findBannedRoomIds.mockResolvedValueOnce(new Set(['room-1']));

    await expect(assertNotRoomBanned({ roomId: 'room-1', userId: 'user-1' })).rejects.toMatchObject(
      { status: 403, response: { code: 'ROOM_BANNED' } }
    );
  });
});
