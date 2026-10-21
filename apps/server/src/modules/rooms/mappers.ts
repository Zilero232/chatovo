import type { RoomBan } from '@chatovo/schemas';

import type { UserWithProfile } from '../users';

import { userWithProfileInclude } from '../../lib';
import { toUserProfile } from '../users';

export const roomBanInclude = {
  user: { include: userWithProfileInclude }
} as const;

export const toRoomBan = (row: { user: UserWithProfile; createdAt: Date }): RoomBan => {
  const { id, name, avatarUrl } = toUserProfile(row.user);

  return { user: { id, name, avatarUrl }, bannedAt: row.createdAt.toISOString() };
};
