import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

import { isMusicPublication } from '../../../lib/index';

export const useRemoteMusicTracks = () => {
  const tracks = useTracks([Track.Source.Unknown], { onlySubscribed: true });

  return tracks.filter(
    ({ participant, publication }) => !participant.isLocal && isMusicPublication(publication)
  );
};
