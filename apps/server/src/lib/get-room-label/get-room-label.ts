import { RoomKind } from '../../../generated';
import { basePrisma as prisma } from '../../core';

/** The room's display name (its id when the row is gone) and whether it is a private DM call. */
export const getRoomLabel = async (roomId: string): Promise<{ isDm: boolean; name: string }> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { name: true, kind: true }
  });

  return { name: room?.name ?? roomId, isDm: room?.kind === RoomKind.dm };
};
