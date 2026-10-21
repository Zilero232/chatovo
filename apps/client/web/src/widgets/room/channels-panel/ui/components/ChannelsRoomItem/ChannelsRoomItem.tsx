import { useSearch } from '@tanstack/react-router';

import { useCurrentUser } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';

import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

import { RoomItemTrigger, RoomParticipantList } from './components';

export const ChannelsRoomItem = ({ room }: ChannelsRoomItemProps) => {
  const search = useSearch({ strict: false });

  const { user } = useCurrentUser();

  const participants = useRoomParticipants(room.id);

  const isActive = search.id === room.id;
  const isOwner = user?.id === room.ownerId;

  return (
    <div>
      <RoomItemTrigger isActive={isActive} isOwner={isOwner} room={room} />

      <RoomParticipantList ownerId={room.ownerId} participants={participants} />
    </div>
  );
};
