import { useTracks } from '@livekit/components-react';
import { RemoteTrackPublication, Track } from 'livekit-client';
import { useEffect } from 'react';

import { useWatchedStreamStore } from '../stores';

const SCREEN_AUDIO_SOURCES = [Track.Source.ScreenShareAudio];

export const useScreenAudioSubscriptions = () => {
  const watchedIdentity = useWatchedStreamStore((state) => state.identity);

  const tracks = useTracks(SCREEN_AUDIO_SOURCES, { onlySubscribed: false });

  useEffect(() => {
    for (const { participant, publication } of tracks) {
      if (!(publication instanceof RemoteTrackPublication)) {
        continue;
      }

      const isWatched = participant.identity === watchedIdentity;

      if (publication.isDesired !== isWatched) {
        publication.setSubscribed(isWatched);
      }
    }
  }, [tracks, watchedIdentity]);
};
