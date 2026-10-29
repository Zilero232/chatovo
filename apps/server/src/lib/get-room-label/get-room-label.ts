import type { RoomLabel } from './get-room-label.types';

import { RoomKind } from '../../../generated';
import { basePrisma as prisma } from '../../core';

/** The room's display name (its id when the row is gone), whether it is a DM and, for a DM, its two members. */
export const getRoomLabel = async (roomId: string): Promise<RoomLabel> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { name: true, kind: true, dmUserAId: true, dmUserBId: true }
  });

  const isDm = room?.kind === RoomKind.dm;
  const dmMemberIds = isDm ? [room.dmUserAId, room.dmUserBId].filter((id) => id !== null) : [];

  return { name: room?.name ?? roomId, isDm, dmMemberIds };
};
