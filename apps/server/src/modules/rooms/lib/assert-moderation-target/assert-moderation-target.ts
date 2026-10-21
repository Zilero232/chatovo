import { USER_ROLE } from '@chatovo/schemas';

import type { AssertModerationTargetInput } from './assert-moderation-target.types';

import { AppForbiddenException } from '../../../../common/exceptions';

export const assertModerationTarget = ({
  actorId,
  ownerId,
  targetId,
  targetRole
}: AssertModerationTargetInput): void => {
  const isProtected =
    targetId === actorId || targetId === ownerId || targetRole === USER_ROLE.admin;

  if (isProtected) {
    throw new AppForbiddenException(
      'ROOM_MODERATION_TARGET_PROTECTED',
      'This participant cannot be moderated'
    );
  }
};
