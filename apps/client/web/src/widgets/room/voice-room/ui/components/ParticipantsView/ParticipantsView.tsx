import type { ParticipantsViewProps } from './ParticipantsView.types';

import { useParticipantsView } from '../../../model/hooks';
import { AloneInvite } from '../AloneInvite/AloneInvite';
import { InvisibleParticipantCard } from '../InvisibleParticipantCard/InvisibleParticipantCard';
import { ParticipantCard } from '../ParticipantCard/ParticipantCard';
import { DmStage } from './DmStage/DmStage';

import s from './ParticipantsView.module.scss';

export const ParticipantsView = ({ isDm = false }: ParticipantsViewProps) => {
  const {
    participants,
    presenceByIdentity,
    invisibleParticipants,
    isSelfInvisible,
    isAlone,
    gridStyle,
    localParticipant,
    peerParticipant
  } = useParticipantsView();

  if (isDm) {
    return (
      <DmStage
        isSelfInvisible={isSelfInvisible}
        localParticipant={localParticipant}
        peerParticipant={peerParticipant}
        presenceByIdentity={presenceByIdentity}
      />
    );
  }

  return (
    <div className={s.root}>
      <div className={s.grid} style={gridStyle}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.identity}
            activity={presenceByIdentity[participant.identity]?.activity ?? null}
            deafened={presenceByIdentity[participant.identity]?.deafened ?? false}
            invisible={isSelfInvisible && participant.isLocal}
            participant={participant}
          />
        ))}

        {invisibleParticipants.map((participant) => (
          <InvisibleParticipantCard key={participant.identity} participant={participant} />
        ))}

        {isAlone && <AloneInvite />}
      </div>
    </div>
  );
};
