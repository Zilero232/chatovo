import { isNonNullish } from 'remeda';

import type { HasUserBlockBetweenInput } from './has-user-block-between.types';

import { basePrisma as prisma } from '../../core';

/** True when either user has blocked the other — the user-to-user block, not the moderator ban. */
export const hasUserBlockBetween = async ({
  userId,
  otherUserId
}: HasUserBlockBetweenInput): Promise<boolean> => {
  const block = await prisma.userBlock.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: otherUserId },
        { blockerId: otherUserId, blockedId: userId }
      ]
    },
    select: { blockerId: true }
  });

  return isNonNullish(block);
};
