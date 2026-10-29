import { match } from 'ts-pattern';

import type { VoiceAttendee, VoiceSession } from '../../telegram.types';
import type { ApplyVoiceEventInput, CloseStintInput } from './apply-voice-event.types';

const closeStint = ({ attendee, now }: CloseStintInput): VoiceAttendee => {
  if (attendee.joinedAt === null) {
    return attendee;
  }

  return {
    ...attendee,
    joinedAt: null,
    totalMs: attendee.totalMs + Math.max(0, now - attendee.joinedAt)
  };
};

export const applyVoiceEvent = ({
  session,
  event,
  now
}: ApplyVoiceEventInput): VoiceSession | null =>
  match(event)
    .with({ type: 'join' }, ({ participantId, participantName, roomName }) => {
      const base = session ?? {
        attendees: [],
        peakCount: 0,
        presentIds: [],
        roomName,
        startedAt: now
      };

      const isKnown = base.attendees.some((attendee) => attendee.id === participantId);

      const attendees = isKnown
        ? base.attendees.map((attendee) =>
            attendee.id === participantId
              ? { ...attendee, name: participantName, joinedAt: attendee.joinedAt ?? now }
              : attendee
          )
        : [
            ...base.attendees,
            { id: participantId, name: participantName, joinedAt: now, totalMs: 0 }
          ];

      const presentIds = base.presentIds.includes(participantId)
        ? base.presentIds
        : [...base.presentIds, participantId];

      return {
        ...base,
        roomName,
        attendees,
        presentIds,
        peakCount: Math.max(base.peakCount, presentIds.length)
      };
    })
    .with({ type: 'leave' }, ({ participantId }) => {
      if (!session) {
        return null;
      }

      return {
        ...session,
        attendees: session.attendees.map((attendee) =>
          attendee.id === participantId ? closeStint({ attendee, now }) : attendee
        ),
        presentIds: session.presentIds.filter((id) => id !== participantId)
      };
    })
    .with({ type: 'end' }, () => {
      if (!session) {
        return null;
      }

      return {
        ...session,
        attendees: session.attendees.map((attendee) => closeStint({ attendee, now })),
        presentIds: []
      };
    })
    .exhaustive();
