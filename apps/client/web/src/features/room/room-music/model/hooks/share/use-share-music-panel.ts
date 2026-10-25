import { useFileDialog } from '@siberiacancode/reactuse';

import { isScreenShareSupported } from '@/shared/lib';

import { MUSIC_FILE_ACCEPT } from '../../../config/music';
import { useMusicDialog } from '../use-music-dialog';
import { useRoomMusicShare } from './use-room-music-share';

export const useShareMusicPanel = () => {
  const share = useRoomMusicShare();
  const { setIsOpen } = useMusicDialog();

  const { open } = useFileDialog(
    (files) => {
      void share.shareFiles([...(files ?? [])]);
    },
    { accept: MUSIC_FILE_ACCEPT, multiple: true, reset: true }
  );

  const shareTab = async () => {
    const started = await share.shareTab();

    if (started) {
      setIsOpen(false);
    }
  };

  return { share, canShareTab: isScreenShareSupported(), shareTab, pickFiles: () => open() };
};
