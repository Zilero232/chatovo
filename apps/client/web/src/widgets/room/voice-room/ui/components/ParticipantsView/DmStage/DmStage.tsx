import { Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import type { DmStageProps } from './DmStage.types';

import { ParticipantCard } from '../../ParticipantCard/ParticipantCard';

import s from '../ParticipantsView.module.scss';

export const DmStage = ({
  isSelfInvisible,
  localParticipant,
  peerParticipant,
  presenceByIdentity
}: DmStageProps) => {
  const t = useTranslations('room');

  return (
    <div className={clsx(s.root, s.rootDm)}>
      <div className={s.dmStage}>
        {peerParticipant ? (
          <div className={s.dmPeer}>
            <ParticipantCard
              fill
              activity={presenceByIdentity[peerParticipant.identity]?.activity ?? null}
              deafened={presenceByIdentity[peerParticipant.identity]?.deafened ?? false}
              participant={peerParticipant}
            />
          </div>
        ) : (
          <Text className={s.dmWaiting} tone='muted'>
            {t('dmWaiting')}
          </Text>
        )}

        {localParticipant && (
          <div className={s.dmSelf}>
            <ParticipantCard
              fill
              activity={presenceByIdentity[localParticipant.identity]?.activity ?? null}
              deafened={presenceByIdentity[localParticipant.identity]?.deafened ?? false}
              invisible={isSelfInvisible}
              participant={localParticipant}
            />
          </div>
        )}
      </div>
    </div>
  );
};
