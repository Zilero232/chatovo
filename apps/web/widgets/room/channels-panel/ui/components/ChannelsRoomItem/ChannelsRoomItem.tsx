'use client';

import { useSearchParams } from 'next/navigation';

import { useCurrentUser } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';

import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

import { RoomItemTrigger, RoomParticipantList } from './components';

export const ChannelsRoomItem = ({ room, onNavigate }: ChannelsRoomItemProps) => {
  const params = useSearchParams();

  const { user } = useCurrentUser();

  const participants = useRoomParticipants(room.id);

  const isActive = params.get('id') === room.id;
  const isOwner = user?.id === room.ownerId;

  return (
    <div>
      <RoomItemTrigger isActive={isActive} isOwner={isOwner} room={room} onNavigate={onNavigate} />

      <RoomParticipantList ownerId={room.ownerId} participants={participants} />
    </div>
  );
};
