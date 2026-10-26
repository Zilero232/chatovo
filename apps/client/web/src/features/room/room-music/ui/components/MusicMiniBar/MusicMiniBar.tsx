import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import type { MusicMiniBarProps } from './MusicMiniBar.types';

import { useMusicMiniBar } from '../../../model/hooks';
import { MiniBarControls } from '../MiniBarControls/MiniBarControls';
import { MiniProgress } from '../MiniProgress/MiniProgress';
import { MusicBarFrame } from '../MusicBarFrame/MusicBarFrame';
import { RadioAudio } from '../RadioAudio/RadioAudio';
import { TrackArtwork } from '../TrackArtwork/TrackArtwork';

import s from './MusicMiniBar.module.scss';

export const MusicMiniBar = ({ music, track, isMinimized }: MusicMiniBarProps) => {
  const t = useTranslations('room.music');

  const bar = useMusicMiniBar(track);

  return (
    <MusicBarFrame isMinimized={isMinimized} label={t('label')}>
      <button
        aria-label={t('nowPlaying.expand')}
        className={s.identity}
        disabled={!bar.canControl}
        type='button'
        onClick={bar.expand}
      >
        <span ref={bar.setSlot} className={clsx(s.thumb, bar.isRadio && s.square)}>
          <TrackArtwork size='fill' track={track} />
        </span>

        <span className={s.meta}>
          <span className={s.title}>{track.title}</span>
          <span className={clsx(s.subtitle, bar.isUnavailable && s.warning)}>{bar.subtitle}</span>
        </span>
      </button>

      {bar.isRadio && <RadioAudio key={bar.playerKey} music={music} track={track} />}

      {bar.canControl && <MiniBarControls bar={bar} />}

      <MiniProgress music={music} track={track} />
    </MusicBarFrame>
  );
};
