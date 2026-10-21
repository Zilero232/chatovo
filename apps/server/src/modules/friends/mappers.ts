import type { FriendshipRelation, FriendUser, UserBlockEntry } from '@chatovo/schemas';

import { match } from 'ts-pattern';

import type { UserWithProfile } from '../users';

import { FriendshipStatus } from '../../../generated';
import { userWithProfileInclude } from '../../lib/selectors';
import { hasUserConnection } from '../realtime';
import { toUserProfile } from '../users';

export const friendshipInclude = {
  requester: { include: userWithProfileInclude },
  addressee: { include: userWithProfileInclude }
} as const;

export const userBlockInclude = {
  blocked: { include: userWithProfileInclude }
} as const;

export const normalizeFriendTag = (tag: string) => tag.trim().toLowerCase();

export const toFriendUser = (user: UserWithProfile): FriendUser => {
  const profile = toUserProfile(user);

  return {
    id: profile.id,
    name: profile.name,
    friendTag: profile.friendTag,
    avatarUrl: profile.avatarUrl,
    verified: profile.verified,
    developer: profile.developer,
    isOnline: hasUserConnection(profile.id)
  };
};

export const toUserBlockEntry = (row: {
  blocked: UserWithProfile;
  createdAt: Date;
}): UserBlockEntry => ({
  user: { ...toFriendUser(row.blocked), isOnline: false },
  blockedAt: row.createdAt.toISOString()
});

export const otherUser = (
  row: {
    requesterId: string;
    requester: UserWithProfile;
    addressee: UserWithProfile;
  },
  userId: string
): UserWithProfile => (row.requesterId === userId ? row.addressee : row.requester);

export const toRelation = (
  row: { id: string; status: FriendshipStatus; requesterId: string },
  userId: string
): FriendshipRelation =>
  match(row)
    .with({ status: FriendshipStatus.accepted }, ({ id }) => ({
      status: 'friends' as const,
      friendshipId: id
    }))
    .with({ status: FriendshipStatus.pending, requesterId: userId }, ({ id }) => ({
      status: 'outgoing_pending' as const,
      friendshipId: id
    }))
    .with({ status: FriendshipStatus.pending }, ({ id }) => ({
      status: 'incoming_pending' as const,
      friendshipId: id
    }))
    .exhaustive();
