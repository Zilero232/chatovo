import type { AssertCanAccessRoomInput } from './assert-can-access-room.types';

import { assertRoomTier } from '../assert-room-tier';

/** Guards room contents: DM membership, ownership or a live LiveKit grant, and no room ban. */
export const assertCanAccessRoom = async ({
  roomId,
  userId
}: AssertCanAccessRoomInput): Promise<void> => assertRoomTier({ roomId, userId, tier: 'access' });
