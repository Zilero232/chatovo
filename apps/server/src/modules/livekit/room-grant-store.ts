import type { GrantRoomAccessInput, RevokeRoomGrantInput } from './livekit.types';

import { ROOM_GRANT_TTL_MS } from '../../config/livekit';

type RoomGrant = {
  expiresAt: number;
  isHidden: boolean;
};

const grants = new Map<string, RoomGrant>();

const key = (roomId: string, userId: string) => `${roomId}:${userId}`;

const pruneExpired = () => {
  const now = Date.now();

  for (const [grantKey, { expiresAt }] of grants) {
    if (now > expiresAt) {
      grants.delete(grantKey);
    }
  }
};

const readGrant = (grantKey: string): RoomGrant | null => {
  const grant = grants.get(grantKey);

  if (grant === undefined) {
    return null;
  }

  if (Date.now() > grant.expiresAt) {
    grants.delete(grantKey);

    return null;
  }

  return grant;
};

export const grantRoomAccess = ({ roomId, userId, isHidden = false }: GrantRoomAccessInput) => {
  pruneExpired();

  const grantKey = key(roomId, userId);
  const current = readGrant(grantKey);

  grants.set(grantKey, {
    expiresAt: Date.now() + ROOM_GRANT_TTL_MS,
    isHidden: isHidden && (current?.isHidden ?? true)
  });
};

export const hasRoomGrant = (roomId: string, userId: string): boolean =>
  readGrant(key(roomId, userId)) !== null;

export const hasVisibleRoomGrant = ({ roomId, userId }: RevokeRoomGrantInput): boolean =>
  readGrant(key(roomId, userId))?.isHidden === false;

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
