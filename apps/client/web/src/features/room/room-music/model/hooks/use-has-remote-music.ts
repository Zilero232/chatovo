import { useRemoteMusicTracks } from './share/use-remote-music-tracks';

export const useHasRemoteMusic = () => {
  const tracks = useRemoteMusicTracks();

  return tracks.length > 0;
};
