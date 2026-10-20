import type { MusicTrackPlayback } from '../../../model/types';

import { useFilePlayer } from '../../../model/hooks';

import s from './FileFrame.module.scss';

export const FileFrame = ({ music, track }: MusicTrackPlayback) => {
  const { setMedia, onEnded, onError } = useFilePlayer({ music, track });

  return (
    // eslint-disable-next-line siberiacancode-jsx-a11y/media-has-caption -- a shared music file has no caption track
    <video
      playsInline
      ref={setMedia}
      className={s.root}
      preload='auto'
      src={track.ref}
      onEnded={onEnded}
      onError={onError}
    />
  );
};
