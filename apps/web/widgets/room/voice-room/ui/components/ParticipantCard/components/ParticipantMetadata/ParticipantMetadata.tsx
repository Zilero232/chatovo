'use client';

import { Gamepad2, HeadphoneOff, MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserName } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { FriendProfileActionsPanel } from '@/widgets/social/friend-profile-actions-panel';

import type { ParticipantMetadataProps } from './ParticipantMetadata.types';

import { useParticipantMedia } from '../../../../../model/hooks';

import s from '../../ParticipantCard.module.scss';

export const ParticipantMetadata = ({
  activity,
  deafened,
  participant
}: ParticipantMetadataProps) => {
  const tLobby = useTranslations('lobby.card');

  const { micMuted, verified, developer, displayName } = useParticipantMedia(participant);

  return (
    <div className={s.metadata}>
      <div className={s.identity}>
        {micMuted && <MicOff aria-label={tLobby('micMuted')} className={s.micIcon} role='img' />}
        {deafened && (
          <HeadphoneOff aria-label={tLobby('deafened')} className={s.micIcon} role='img' />
        )}
        <ProfileCardTrigger
          className={s.nameTrigger}
          identity={participant.identity}
          name={displayName}
          renderFriendActions={(state) => <FriendProfileActionsPanel {...state} />}
        >
          <UserName
            className={s.name}
            developer={developer}
            name={displayName}
            verified={verified}
          />
        </ProfileCardTrigger>
      </div>

      {activity && (
        <div className={s.activity}>
          <Gamepad2 aria-hidden className={s.activityIcon} />
          <span className={s.activityLabel}>{activity}</span>
        </div>
      )}
    </div>
  );
};
