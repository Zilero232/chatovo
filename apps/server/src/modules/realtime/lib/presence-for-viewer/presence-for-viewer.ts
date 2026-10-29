import type { RoomsParticipantsSnapshot } from '@chatovo/schemas';

import type { PresenceForViewerInput } from './presence-for-viewer.types';

/** The presence one socket may see: the public or staff snapshot plus only the DM rooms its user belongs to. */
export const presenceForViewer = ({
  snapshots,
  userId,
  canSeeInvisible
}: PresenceForViewerInput): RoomsParticipantsSnapshot => {
  const base = canSeeInvisible ? snapshots.admin : snapshots.public;
  const rooms = { ...base.rooms };

  for (const { roomId, memberIds, participants } of snapshots.dmRooms) {
    if (!memberIds.includes(userId)) {
      continue;
    }

    const visible = canSeeInvisible
      ? participants
      : participants.filter((participant) => !participant.invisible);

    if (visible.length > 0) {
      rooms[roomId] = visible;
    }
  }

  return { ...base, rooms };
};
