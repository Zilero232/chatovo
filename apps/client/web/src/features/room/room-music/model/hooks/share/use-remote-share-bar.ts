import { useRemoteMusicTracks } from './use-remote-music-tracks';

export const useRemoteShareBar = () => {
  const [sharerTrack] = useRemoteMusicTracks();

  const sharer = sharerTrack?.participant;

  return { sharerName: sharer ? sharer.name || sharer.identity : null };
};
