import { beforeEach, describe, expect, it, vi } from 'vitest';

const hasDmUserBlock = vi.fn();

vi.mock('../../has-dm-user-block', () => ({
  hasDmUserBlock: (input: unknown) => hasDmUserBlock(input)
}));

const { assertDmWithoutUserBlock } = await import('../assert-dm-without-user-block');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

describe('assertDmWithoutUserBlock', () => {
  beforeEach(() => {
    hasDmUserBlock.mockReset().mockResolvedValue(false);
  });

  it('lets a room without a block between its dm members through', async () => {
    await expect(
      assertDmWithoutUserBlock({ roomId: 'room-1', userId: 'user-a' })
    ).resolves.toBeUndefined();
  });

  it('refuses a dm between two users when either blocked the other, as if they were not friends', async () => {
    hasDmUserBlock.mockResolvedValueOnce(true);

    expect(await codeOf(assertDmWithoutUserBlock({ roomId: 'dm-1', userId: 'user-a' }))).toBe(
      'DM_NOT_FRIENDS'
    );
  });
});
