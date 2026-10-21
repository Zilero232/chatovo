import type { RevokeRoomGrantInput } from './livekit.types';

import { ROOM_GRANT_TTL_MS } from '../../config/livekit';

const grants = new Map<string, number>();

const key = (roomId: string, userId: string) => `${roomId}:${userId}`;

const pruneExpired = () => {
  const now = Date.now();

  for (const [grantKey, expiresAt] of grants) {
    if (now > expiresAt) {
      grants.delete(grantKey);
    }
  }
};

export const grantRoomAccess = (roomId: string, userId: string) => {
  pruneExpired();

  grants.set(key(roomId, userId), Date.now() + ROOM_GRANT_TTL_MS);
};

export const hasRoomGrant = (roomId: string, userId: string): boolean => {
  const expiresAt = grants.get(key(roomId, userId));

  if (expiresAt === undefined) {
    return false;
  }

  if (Date.now() > expiresAt) {
    grants.delete(key(roomId, userId));

    return false;
  }

  return true;
};

export const revokeRoomGrants = (roomId: string) => {
  for (const grantKey of grants.keys()) {
    if (grantKey.startsWith(`${roomId}:`)) {
      grants.delete(grantKey);
    }
  }
};

export const revokeRoomGrant = ({ roomId, userId }: RevokeRoomGrantInput) => {
  grants.delete(key(roomId, userId));
};

export const revokeUserGrants = (userId: string) => {
  for (const grantKey of grants.keys()) {
    if (grantKey.endsWith(`:${userId}`)) {
      grants.delete(grantKey);
    }
  }
};
