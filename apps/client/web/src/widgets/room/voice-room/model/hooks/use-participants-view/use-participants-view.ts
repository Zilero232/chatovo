import { useParticipants, useRoomContext } from '@livekit/components-react';
import { indexBy } from 'remeda';

import { useIsInvisible, useRoomParticipants } from '@/entities/room/room';

import { ROSTER_EVENTS } from '../../../config';
import { getStageGridStyle } from '../../../lib';

export const useParticipantsView = () => {
  const room = useRoomContext();
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const isSelfInvisible = useIsInvisible();

  const presence = useRoomParticipants(room.name);

  const presenceByIdentity = indexBy(presence, (entry) => entry.identity);
  const liveIdentities = new Set(participants.map((entry) => entry.identity));
  const invisibleParticipants = presence.filter(
    (entry) => entry.invisible && !liveIdentities.has(entry.identity)
  );
  const tileCount = participants.length + invisibleParticipants.length;
  const isAlone = tileCount <= 1;

  return {
    participants,
    presenceByIdentity,
    invisibleParticipants,
    isAlone,
    gridStyle: getStageGridStyle(isAlone ? 2 : tileCount),
    isSelfInvisible,
    localParticipant: participants.find((entry) => entry.isLocal),
    peerParticipant: participants.find((entry) => !entry.isLocal)
  };
};
