import type { AssertDmWithoutUserBlockInput } from './assert-dm-without-user-block.types';

import { AppForbiddenException } from '../../common/exceptions';
import { hasDmUserBlock } from '../has-dm-user-block';

/**
 * Refuses a DM message or call once either member has blocked the other. Reports `DM_NOT_FRIENDS`
 * so the blocked side cannot tell a block apart from an ended friendship. Other rooms pass.
 */
export const assertDmWithoutUserBlock = async ({
  roomId,
  userId
}: AssertDmWithoutUserBlockInput): Promise<void> => {
  if (await hasDmUserBlock({ roomId, userId })) {
    throw new AppForbiddenException('DM_NOT_FRIENDS', 'Only friends can message');
  }
};
