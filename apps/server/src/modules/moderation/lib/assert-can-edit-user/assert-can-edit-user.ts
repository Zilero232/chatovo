import { assignableRoles, canActOnRole, toUserRole, USER_ROLE } from '@chatovo/schemas';
import { isNonNullish } from 'remeda';

import type { AssertCanEditUserInput } from './assert-can-edit-user.types';

import { AppBadRequestException, AppForbiddenException } from '../../../../common/exceptions';

export const assertCanEditUser = ({
  actorRole,
  targetRole,
  isSelf,
  nextRole,
  isFlagChange
}: AssertCanEditUserInput): void => {
  const isRoleChange = isNonNullish(nextRole) && nextRole !== toUserRole(targetRole);

  if (isSelf && isRoleChange) {
    throw new AppBadRequestException('BLOCK_SELF', 'Cannot change your own role');
  }

  if (isSelf && isFlagChange && toUserRole(actorRole) !== USER_ROLE.owner) {
    throw new AppForbiddenException('ROLE_PROTECTED', 'Only the owner marks their own account');
  }

  if (!isSelf && !canActOnRole({ actorRole, targetRole })) {
    throw new AppForbiddenException('ROLE_PROTECTED', 'The target ranks as high as you or higher');
  }

  if (isRoleChange && !assignableRoles(actorRole).includes(toUserRole(nextRole))) {
    throw new AppForbiddenException('ROLE_NOT_ASSIGNABLE', 'You cannot hand out this role');
  }
};
