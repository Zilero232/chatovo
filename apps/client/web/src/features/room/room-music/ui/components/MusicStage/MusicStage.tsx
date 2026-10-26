import { WaveMark } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { handleExternalLinkClick } from '@/shared/lib';

import type { MusicStageProps } from './MusicStage.types';

import { useMusicStage } from '../../../model/hooks';
import { PlayerStatusNotice } from '../PlayerStatusNotice/PlayerStatusNotice';
import { StageControls } from '../StageControls/StageControls';
import { TrackArtwork } from '../TrackArtwork/TrackArtwork';

import s from './MusicStage.module.scss';

export const MusicStage = ({ music, track, className }: MusicStageProps) => {
  const t = useTranslations('room.music.nowPlaying');

  const { artist, origin, isPlaying, setSlot } = useMusicStage({ music, track });

  const { title, url } = track;

  return (
    <section className={clsx(s.root, className)}>
      <div className={s.head}>
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
          {artist && <span className={s.artist}>{artist}</span>}
          <span className={s.origin}>
            <WaveMark
              animated={isPlaying}
              className={clsx(s.wave, !isPlaying && s.wavePaused)}
              size={14}
            />
            <span className={s.originText}>{origin}</span>
          </span>
        </div>
      </div>

      <PlayerStatusNotice track={track} />

      <StageControls music={music} track={track} />
    </section>
  );
};
