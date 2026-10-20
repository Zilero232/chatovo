'use client';

import { clsx } from 'clsx';

import type { ParticipantCardProps } from './ParticipantCard.types';

import { useParticipantMedia } from '../../../model/hooks';
import { ParticipantCardMenu } from '../ParticipantCardMenu/ParticipantCardMenu';
import { ParticipantBadges, ParticipantMetadata, ParticipantStage } from './components';

import s from './ParticipantCard.module.scss';

export const ParticipantCard = ({
  activity,
  deafened,
  fill = false,
  invisible = false,
  participant
}: ParticipantCardProps) => {
  const { isSpeaking, isLocal, hasScreen, hasMusic } = useParticipantMedia(participant);

  return (
    <ParticipantCardMenu participant={participant}>
      <div
        className={clsx(s.root, { [s.rootFill]: fill, [s.rootInvisible]: invisible })}
        data-local={isLocal}
        data-speaking={isSpeaking}
      >
        <ParticipantStage participant={participant} />

        <ParticipantBadges hasMusic={hasMusic} hasScreen={hasScreen} invisible={invisible} />

        <ParticipantMetadata activity={activity} deafened={deafened} participant={participant} />
      </div>
    </ParticipantCardMenu>
  );
};
