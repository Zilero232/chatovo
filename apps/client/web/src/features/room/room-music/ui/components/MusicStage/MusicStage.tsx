import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { handleExternalLinkClick } from '@/shared/lib';

import type { MusicStageProps } from './MusicStage.types';

import { useMusicStage } from '../../../model/hooks';
import { PlaybackProgress } from '../PlaybackProgress/PlaybackProgress';
import { StageControls } from '../StageControls/StageControls';
import { TrackArtwork } from '../TrackArtwork/TrackArtwork';

import s from './MusicStage.module.scss';

export const MusicStage = ({ music, track, className }: MusicStageProps) => {
  const t = useTranslations('room.music.nowPlaying');

  const { subtitle, setSlot } = useMusicStage(track);

  const { title, url } = track;

  return (
    <section className={clsx(s.root, className)}>
      <div ref={setSlot} className={clsx(s.screen, track.source === 'radio' && s.radio)}>
        <TrackArtwork size='fill' track={track} />
      </div>

      <div className={s.meta}>
        <a
          className={s.title}
          href={url}
          rel='noopener noreferrer'
          target='_blank'
          title={t('open')}
          onClick={(event) => handleExternalLinkClick({ event, url })}
        >
          {title}
        </a>
        <span className={s.subtitle}>{subtitle}</span>
      </div>

      <PlaybackProgress music={music} track={track} />

      <StageControls />
    </section>
  );
};
