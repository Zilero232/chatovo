import { beforeEach, describe, expect, it, vi } from 'vitest';

const getRoomDmRouting = vi.fn();
const hasUserBlockBetween = vi.fn();

vi.mock('../../get-room-dm-routing', () => ({
  getRoomDmRouting: (roomId: string) => getRoomDmRouting(roomId)
}));

vi.mock('../../has-user-block-between', () => ({
  hasUserBlockBetween: (input: unknown) => hasUserBlockBetween(input)
}));

const { hasDmUserBlock } = await import('../has-dm-user-block');

const DM = { kind: 'dm', dmUserAId: 'user-a', dmUserBId: 'user-b' };

describe('hasDmUserBlock', () => {
  beforeEach(() => {
    getRoomDmRouting.mockReset().mockResolvedValue(DM);
    hasUserBlockBetween.mockReset().mockResolvedValue(false);
  });

  it('is false for a group room without looking up any block', async () => {
    getRoomDmRouting.mockResolvedValueOnce({ kind: 'group', dmUserAId: null, dmUserBId: null });

    await expect(hasDmUserBlock({ roomId: 'room-1', userId: 'user-a' })).resolves.toBe(false);
    expect(hasUserBlockBetween).not.toHaveBeenCalled();
  });

  it('is false for a missing room so the access guard reports it', async () => {
    getRoomDmRouting.mockResolvedValueOnce(null);

    await expect(hasDmUserBlock({ roomId: 'room-1', userId: 'user-a' })).resolves.toBe(false);
  });

  it('checks the block against the other member of the dm', async () => {
    await hasDmUserBlock({ roomId: 'dm-1', userId: 'user-b' });

    expect(hasUserBlockBetween).toHaveBeenCalledWith({ userId: 'user-b', otherUserId: 'user-a' });
  });

  it('is true when either member of the dm blocked the other', async () => {
    hasUserBlockBetween.mockResolvedValueOnce(true);

    await expect(hasDmUserBlock({ roomId: 'dm-1', userId: 'user-a' })).resolves.toBe(true);
  });
});
