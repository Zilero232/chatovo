'use client';

import { AvatarWithBadges } from '@chatovo/ui-kit';
import { Gamepad2 } from 'lucide-react';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { DeafenedBadge, MicMutedBadge, OwnerCrown } from '@/entities/room/room';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { FriendProfileActionsPanel } from '@/widgets/social/friend-profile-actions-panel';

import type { RoomParticipantEntryProps } from './RoomParticipantEntry.types';

import s from '../../ChannelsRoomItem.module.scss';

export const RoomParticipantEntry = ({ isOwner, participant }: RoomParticipantEntryProps) => (
  <ProfileCardTrigger
    className={s.participant}
    identity={participant.identity}
    name={participant.name}
    renderFriendActions={(state) => <FriendProfileActionsPanel {...state} />}
  >
    <AvatarWithBadges
      bottomLeft={participant.deafened && <DeafenedBadge />}
      bottomRight={participant.micMuted && <MicMutedBadge />}
      topLeft={isOwner && <OwnerCrown />}
    >
      <UserAvatar
        className={s.participantAvatar}
        fallbackClassName={s.participantFallback}
        name={participant.name}
        src={participant.avatarUrl}
      />
    </AvatarWithBadges>
    <span className={s.participantMeta}>
      <UserName
        className={s.participantName}
        developer={participant.developer}
        name={participant.name}
        verified={participant.verified}
      />
      {participant.activity && (
        <span className={s.participantActivity}>
          <Gamepad2 aria-hidden className={s.participantActivityIcon} />
          <span className={s.participantActivityLabel}>{participant.activity}</span>
        </span>
      )}
    </span>
  </ProfileCardTrigger>
);
