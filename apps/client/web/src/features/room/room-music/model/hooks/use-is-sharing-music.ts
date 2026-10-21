import type { Participant } from 'livekit-client';

import { useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

import { isMusicPublication } from '../../lib/index';

export const useIsSharingMusic = (participant: Participant) => {
  const tracks = useParticipantTracks([Track.Source.Unknown], participant.identity);

  return tracks.some(({ publication }) => isMusicPublication(publication));
};
