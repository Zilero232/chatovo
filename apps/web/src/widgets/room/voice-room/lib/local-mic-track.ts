import type { LocalParticipant } from 'livekit-client';

import { LocalAudioTrack, ParticipantEvent, Track } from 'livekit-client';

export const getLocalMicTrack = (participant: LocalParticipant) => {
  const track = participant.getTrackPublication(Track.Source.Microphone)?.track;

  return track instanceof LocalAudioTrack ? track : undefined;
};

type MicTrackHandlers = {
  onPublished: () => void;
  onUnpublished: () => void;
};

export const subscribeToMicTrack = (
  participant: LocalParticipant,
  { onPublished, onUnpublished }: MicTrackHandlers
) => {
  participant.on(ParticipantEvent.LocalTrackPublished, onPublished);
  participant.on(ParticipantEvent.LocalTrackUnpublished, onUnpublished);

  return () => {
    participant.off(ParticipantEvent.LocalTrackPublished, onPublished);
    participant.off(ParticipantEvent.LocalTrackUnpublished, onUnpublished);
  };
};
