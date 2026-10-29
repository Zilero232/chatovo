import { canActOnRole } from '@chatovo/schemas';

import type { AssertModerationTargetInput } from './assert-moderation-target.types';

import { AppForbiddenException } from '../../../../common/exceptions';

export const assertModerationTarget = ({
  actorId,
  actorRole,
  ownerId,
  targetId,
  targetRole
}: AssertModerationTargetInput): void => {
  const isProtected =
    targetId === actorId || targetId === ownerId || !canActOnRole({ actorRole, targetRole });

  if (isProtected) {
    throw new AppForbiddenException(
      'ROOM_MODERATION_TARGET_PROTECTED',
      'This participant cannot be moderated'
    );
  }
};
