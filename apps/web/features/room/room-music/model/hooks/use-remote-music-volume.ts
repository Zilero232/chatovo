import { useTracks } from '@livekit/components-react';
import { RemoteAudioTrack, Track, TrackEvent } from 'livekit-client';

import { isMusicPublication } from '../../lib';
import { useRoomMusicContext } from '../contexts/room-music-context';
import { useVolumeRamp } from './use-volume-ramp';

export const useRemoteMusicVolume = () => {
  const { outputVolume } = useRoomMusicContext();

  const musicTracks = useTracks([Track.Source.Unknown], { onlySubscribed: true })
    .filter(
      ({ participant, publication }) => !participant.isLocal && isMusicPublication(publication)
    )
    .map(({ publication }) => publication.track)
    .filter((track) => track instanceof RemoteAudioTrack);

  useVolumeRamp({
    target: outputVolume,
    resetKey: musicTracks.map((track) => track.sid).join(','),
    apply: (volume) => musicTracks.forEach((track) => track.setVolume(volume)),
    subscribeReapply: (reapply) => {
      musicTracks.forEach((track) => track.on(TrackEvent.ElementAttached, reapply));

      return () => musicTracks.forEach((track) => track.off(TrackEvent.ElementAttached, reapply));
    }
  });
};
