import { beforeEach, describe, expect, it, vi } from 'vitest';

const findBannedRoomIds = vi.fn();
const hasDmUserBlock = vi.fn();

vi.mock('../../../../../lib', () => ({
  findBannedRoomIds: (input: unknown) => findBannedRoomIds(input),
  hasDmUserBlock: (input: unknown) => hasDmUserBlock(input)
}));

const { isBarredFromRoom } = await import('../is-barred-from-room');

const input = { roomId: 'room-1', userId: 'user-1' };

describe('isBarredFromRoom', () => {
  beforeEach(() => {
    findBannedRoomIds.mockReset().mockResolvedValue(new Set());
    hasDmUserBlock.mockReset().mockResolvedValue(false);
  });

  it('lets in a user with neither a room ban nor a dm block', async () => {
    await expect(isBarredFromRoom(input)).resolves.toBe(false);
  });

  it('bars a user banned from the room', async () => {
    findBannedRoomIds.mockResolvedValueOnce(new Set(['room-1']));

    await expect(isBarredFromRoom(input)).resolves.toBe(true);
    expect(findBannedRoomIds).toHaveBeenCalledWith({ roomIds: ['room-1'], userId: 'user-1' });
  });

  it('bars either side of a dm once one blocked the other', async () => {
    hasDmUserBlock.mockResolvedValueOnce(true);

    await expect(isBarredFromRoom(input)).resolves.toBe(true);
    expect(hasDmUserBlock).toHaveBeenCalledWith(input);
  });
});
