import { hasPermission } from '@chatovo/schemas';

import { AppForbiddenException } from '../../common/exceptions';
import { findUserRole } from '../find-user-role';

/** Throws unless the user's role opens the admin panel (owner, admin) — the gate for every moderation route. */
export const assertIsAdmin = async (userId: string): Promise<void> => {
  const role = await findUserRole(userId);

  if (!hasPermission({ role, permission: 'adminPanel' })) {
    throw new AppForbiddenException('ADMIN_ONLY', 'Admin only');
  }
};
