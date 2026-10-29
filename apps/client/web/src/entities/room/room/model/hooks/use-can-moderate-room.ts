import { roomKindSchema } from '@chatovo/schemas';

import { useCurrentUser } from '@/entities/auth/user';

import { useRoomById } from './use-room-by-id';

export const useCanModerateRoom = (roomId: string | null) => {
  const { user, can } = useCurrentUser();

  const { room } = useRoomById(roomId || null);

  const ownerId = room?.ownerId ?? null;
  const isGroup = room?.kind === roomKindSchema.enum.group;
  const isOwner = ownerId !== null && ownerId === user?.id;

  return { canModerate: isGroup && (can('moderateAnyRoom') || isOwner), ownerId };
};
