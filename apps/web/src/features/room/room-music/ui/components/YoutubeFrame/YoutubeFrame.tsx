import type { MusicTrackPlayback } from '../../../model/types';

import { useYoutubePlayer } from '../../../model/hooks';

import s from './YoutubeFrame.module.scss';

export const YoutubeFrame = ({ music, track }: MusicTrackPlayback) => {
  const setContainer = useYoutubePlayer({ music, track });

  return <div ref={setContainer} className={s.root} />;
};
