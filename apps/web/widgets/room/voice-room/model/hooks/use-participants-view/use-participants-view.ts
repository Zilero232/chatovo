'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { indexBy } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';

import { ROSTER_EVENTS } from '../../../config';

export const useParticipantsView = () => {
  const room = useRoomContext();
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();

  const presence = useRoomParticipants(room.name);

  const presenceByIdentity = indexBy(presence, (entry) => entry.identity);
  const liveIdentities = new Set(participants.map((entry) => entry.identity));

  return {
    participants,
    presenceByIdentity,
    invisibleParticipants: presence.filter(
      (entry) => entry.invisible && !liveIdentities.has(entry.identity)
    ),
    isSelfInvisible: isAdmin && settings.system.invisibleMode,
    localParticipant: participants.find((entry) => entry.isLocal),
    peerParticipant: participants.find((entry) => !entry.isLocal)
  };
};
