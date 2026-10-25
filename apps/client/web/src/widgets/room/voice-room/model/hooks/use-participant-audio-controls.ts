import type { Participant } from 'livekit-client';

import { useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { isNonNullish } from 'remeda';

import { useIsSharingMusic, useParticipantMusicVolume } from '@/features/room/room-music';

import { useParticipantVolume } from './use-participant-volume';

export const useParticipantAudioControls = (participant: Participant) => {
  const voice = useParticipantVolume(participant);
  const screen = useParticipantVolume(participant, Track.Source.ScreenShareAudio);
  const music = useParticipantMusicVolume(participant.identity);

  const [screenAudioTrack] = useParticipantTracks(
    [Track.Source.ScreenShareAudio],
    participant.identity
  );
  const hasMusic = useIsSharingMusic(participant);

  const isVisible = voice.isControllable && !voice.isBlocked;

  return {
    voice,
    screen,
    music,
    isVisible,
    hasScreenAudio: isNonNullish(screenAudioTrack),
    hasMusic
  };
};
