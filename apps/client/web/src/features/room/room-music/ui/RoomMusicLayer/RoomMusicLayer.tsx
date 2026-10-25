import { AnimatePresence } from 'motion/react';

import type { RoomMusicLayerProps } from './RoomMusicLayer.types';

import { useCurrentRoomMusic, useHasRemoteMusic } from '../../model/hooks';
import { MusicDialog, MusicMiniBar, MusicPlayerHost, RemoteShareBar } from '../components/index';
import { RemoteMusicVolumeController } from '../controllers/index';

export const RoomMusicLayer = ({ isMinimized }: RoomMusicLayerProps) => {
  const { music } = useCurrentRoomMusic();
  const hasRemoteMusic = useHasRemoteMusic();

  const track = music?.current ?? null;

  return (
    <>
      <RemoteMusicVolumeController />
      <AnimatePresence initial={false}>
        {music !== null && track !== null && (
          <MusicMiniBar key='mini-bar' isMinimized={isMinimized} music={music} track={track} />
        )}
        {track === null && hasRemoteMusic && (
          <RemoteShareBar key='remote-share' isMinimized={isMinimized} />
        )}
      </AnimatePresence>
      {music !== null && track !== null && track.source !== 'radio' && (
        <MusicPlayerHost music={music} track={track} />
      )}
      <MusicDialog />
    </>
  );
};
