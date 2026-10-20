'use client';

import type { MusicTrackPlayback } from '../../../model/types';

import { useVimeoPlayer } from '../../../model/hooks';

import s from './VimeoFrame.module.scss';

export const VimeoFrame = ({ music, track }: MusicTrackPlayback) => {
  const setContainer = useVimeoPlayer({ music, track });

  return <div ref={setContainer} className={s.root} />;
};
