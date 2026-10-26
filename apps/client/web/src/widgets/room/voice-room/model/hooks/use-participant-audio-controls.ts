import type { Participant } from 'livekit-client';

import { useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { isNonNullish } from 'remeda';

import { useParticipantVolume } from './use-participant-volume';

export const useParticipantAudioControls = (participant: Participant) => {
  const voice = useParticipantVolume(participant);
  const screen = useParticipantVolume(participant, Track.Source.ScreenShareAudio);

  const [screenAudioTrack] = useParticipantTracks(
    [Track.Source.ScreenShareAudio],
    participant.identity
  );

  const isVisible = voice.isControllable && !voice.isBlocked;

  return {
    voice,
    screen,
    isVisible,
    hasScreenAudio: isNonNullish(screenAudioTrack)
  };
};
