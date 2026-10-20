import type { LocalParticipant } from 'livekit-client';

import { Track } from 'livekit-client';

export const toggleMicStream = (participant: LocalParticipant, enabled: boolean): boolean => {
  const publication = participant.getTrackPublication(Track.Source.Microphone);
  const stream = publication?.track?.mediaStreamTrack;

  if (!stream) {
    return false;
  }

  stream.enabled = enabled;

  return true;
};

export const armPttStream = (participant: LocalParticipant) => toggleMicStream(participant, false);

/** Current `enabled` flag of the published mic track, or null when unpublished. */
export const readMicStreamEnabled = (participant: LocalParticipant): boolean | null => {
  const publication = participant.getTrackPublication(Track.Source.Microphone);

  return publication?.track?.mediaStreamTrack?.enabled ?? null;
};
