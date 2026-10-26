import { RemoteAudioTrack, TrackEvent } from 'livekit-client';

import { useBlockedUserIds } from '@/entities/social/friend';

import { useRoomMusicContext } from '../../contexts';
import { useVolumeRamp } from '../use-volume-ramp';
import { useRemoteMusicTracks } from './use-remote-music-tracks';

export const useRemoteMusicVolume = () => {
  const { outputVolume } = useRoomMusicContext();

  const blockedIds = useBlockedUserIds();
  const remoteTracks = useRemoteMusicTracks();

  const audibleTracks = remoteTracks.flatMap(({ participant, publication }) => {
    const { track } = publication;

    if (!(track instanceof RemoteAudioTrack)) {
      return [];
    }

    return [{ track, isMuted: blockedIds.has(participant.identity) }];
  });

  useVolumeRamp({
    target: outputVolume,
    resetKey: audibleTracks.map(({ track, isMuted }) => `${track.sid}:${isMuted}`).join(','),
    apply: (volume) =>
      audibleTracks.forEach(({ track, isMuted }) => track.setVolume(isMuted ? 0 : volume)),
    subscribeReapply: (reapply) => {
      audibleTracks.forEach(({ track }) => track.on(TrackEvent.ElementAttached, reapply));

      return () =>
        audibleTracks.forEach(({ track }) => track.off(TrackEvent.ElementAttached, reapply));
    }
  });
};
