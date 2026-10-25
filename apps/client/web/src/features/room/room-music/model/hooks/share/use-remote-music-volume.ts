import { RemoteAudioTrack, TrackEvent } from 'livekit-client';

import { useBlockedUserIds } from '@/entities/social/friend';

import { readParticipantMusicVolume } from '../../../lib/index';
import { useRoomMusicContext } from '../../contexts';
import { useVolumeRamp } from '../use-volume-ramp';
import { useMusicVolumes } from './use-music-volumes';
import { useRemoteMusicTracks } from './use-remote-music-tracks';

export const useRemoteMusicVolume = () => {
  const { outputVolume } = useRoomMusicContext();

  const { volumes } = useMusicVolumes();
  const blockedIds = useBlockedUserIds();
  const remoteTracks = useRemoteMusicTracks();

  const musicTracks = remoteTracks.flatMap(({ participant, publication }) => {
    const { track } = publication;

    if (!(track instanceof RemoteAudioTrack)) {
      return [];
    }

    const { identity } = participant;
    const factor = readParticipantMusicVolume({
      identity,
      isBlocked: blockedIds.has(identity),
      volumes
    });

    return [{ track, factor }];
  });

  useVolumeRamp({
    target: outputVolume,
    resetKey: musicTracks.map(({ track, factor }) => `${track.sid}:${factor}`).join(','),
    apply: (volume) => musicTracks.forEach(({ track, factor }) => track.setVolume(volume * factor)),
    subscribeReapply: (reapply) => {
      musicTracks.forEach(({ track }) => track.on(TrackEvent.ElementAttached, reapply));

      return () =>
        musicTracks.forEach(({ track }) => track.off(TrackEvent.ElementAttached, reapply));
    }
  });
};
