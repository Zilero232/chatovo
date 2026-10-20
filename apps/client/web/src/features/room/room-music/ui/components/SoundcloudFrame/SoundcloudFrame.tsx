import { useTranslations } from 'use-intl';

import type { MusicTrackPlayback } from '../../../model/types';

import { useSoundcloudPlayer } from '../../../model/hooks';

import s from './SoundcloudFrame.module.scss';

export const SoundcloudFrame = ({ music, track }: MusicTrackPlayback) => {
  const t = useTranslations('room.music.sources');

  const { src, setIframe } = useSoundcloudPlayer({ music, track });

  return (
    <iframe ref={setIframe} allow='autoplay' className={s.root} src={src} title={t('soundcloud')} />
  );
};
