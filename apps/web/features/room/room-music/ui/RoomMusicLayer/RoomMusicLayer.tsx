import { AnimatePresence } from 'motion/react';

import type { RoomMusicLayerProps } from './RoomMusicLayer.types';

import { useCurrentRoomMusic } from '../../model/hooks';
import { MusicDialog, MusicMiniBar, MusicPlayerHost } from '../components';
import { RemoteMusicVolumeController } from '../controllers';

export const RoomMusicLayer = ({ isMinimized }: RoomMusicLayerProps) => {
  const { music } = useCurrentRoomMusic();

  const track = music?.current ?? null;

  return (
    <>
      <RemoteMusicVolumeController />
      <AnimatePresence initial={false}>
        {music !== null && track !== null && (
          <MusicMiniBar key='mini-bar' isMinimized={isMinimized} music={music} track={track} />
        )}
      </AnimatePresence>
      {music !== null && track !== null && track.source !== 'radio' && (
        <MusicPlayerHost music={music} track={track} />
      )}
      <MusicDialog />
    </>
  );
};
