import type { LocalParticipant } from 'livekit-client';

import { Track } from 'livekit-client';

/** Opens or closes the published mic stream; never reopens a muted mic, which would leak audio. */
export const toggleMicStream = (participant: LocalParticipant, enabled: boolean): boolean => {
  const publication = participant.getTrackPublication(Track.Source.Microphone);
  const stream = publication?.track?.mediaStreamTrack;

  if (!stream || (enabled && publication.isMuted)) {
    return false;
  }

  stream.enabled = enabled;

  return true;
};

export const armPttStream = (participant: LocalParticipant) => toggleMicStream(participant, false);
