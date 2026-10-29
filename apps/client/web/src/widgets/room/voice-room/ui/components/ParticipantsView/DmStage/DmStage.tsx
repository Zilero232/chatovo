import { clsx } from 'clsx';

import type { DmStageProps } from './DmStage.types';

import { useDmStage } from '../../../../model/hooks';
import { ParticipantCard } from '../../ParticipantCard/ParticipantCard';
import { DmCallStatus, PeerConnectionNotice } from './components';

import s from '../ParticipantsView.module.scss';

export const DmStage = ({
  isSelfInvisible,
  localParticipant,
  peerParticipant,
  presenceByIdentity
}: DmStageProps) => {
  const { phase, status, peer, isPulsing, canRingAgain, isRingingAgain, ringAgain } =
    useDmStage(peerParticipant);

  return (
    <div className={clsx(s.root, s.rootDm)}>
      <div className={s.dmStage}>
        {phase === 'live' && peerParticipant && (
          <div className={s.dmPeer}>
            <ParticipantCard
              fill
              activity={presenceByIdentity[peerParticipant.identity]?.activity ?? null}
              deafened={presenceByIdentity[peerParticipant.identity]?.deafened ?? false}
              participant={peerParticipant}
            />
            <PeerConnectionNotice
              name={peer?.name ?? peerParticipant.name ?? ''}
              participant={peerParticipant}
            />
          </div>
        )}

        {status !== null && (
          <DmCallStatus
            canRingAgain={canRingAgain}
            isPulsing={isPulsing}
            isRingingAgain={isRingingAgain}
            peer={peer}
            status={status}
            onRingAgain={ringAgain}
          />
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
