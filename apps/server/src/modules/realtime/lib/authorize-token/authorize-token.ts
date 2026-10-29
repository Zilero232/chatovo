import { hasPermission } from '@chatovo/schemas';

import { auth } from '../../../auth/auth';

export type AuthorizedRealtimeUser = {
  canSeeInvisible: boolean;
  userId: string;
};

export const authorizeToken = async (
  token: string | null
): Promise<AuthorizedRealtimeUser | null> => {
  if (!token) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${token}` })
  });

  if (!session) {
    return null;
  }

  return {
    userId: session.user.id,
    canSeeInvisible: hasPermission({ role: session.user.role, permission: 'seeInvisible' })
  };
};
