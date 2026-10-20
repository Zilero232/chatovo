'use client';

import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

import { isMusicPublication } from '../../lib';

export const useHasRemoteMusic = () => {
  const tracks = useTracks([Track.Source.Unknown], { onlySubscribed: true });

  return tracks.some(
    ({ participant, publication }) => !participant.isLocal && isMusicPublication(publication)
  );
};
