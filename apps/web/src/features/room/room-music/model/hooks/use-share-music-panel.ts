import { useFileDialog } from '@siberiacancode/reactuse';

import { isScreenShareSupported } from '@/shared/lib';

import { MUSIC_FILE_ACCEPT } from '../../config/music';
import { useRoomMusicShare } from './use-room-music-share';

export const useShareMusicPanel = () => {
  const share = useRoomMusicShare();

  const { open } = useFileDialog(
    (files) => {
      void share.shareFiles([...(files ?? [])]);
    },
    { accept: MUSIC_FILE_ACCEPT, multiple: true, reset: true }
  );

  return { share, canShareTab: isScreenShareSupported(), pickFiles: () => open() };
};
