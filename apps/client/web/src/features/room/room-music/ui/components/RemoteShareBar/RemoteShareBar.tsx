import { AudioLines } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { RemoteShareBarProps } from './RemoteShareBar.types';

import { useRemoteShareBar } from '../../../model/hooks';
import { MusicBarFrame } from '../MusicBarFrame/MusicBarFrame';
import { MusicVolumeButton } from '../MusicVolumeButton/MusicVolumeButton';

import s from './RemoteShareBar.module.scss';

export const RemoteShareBar = ({ isMinimized }: RemoteShareBarProps) => {
  const t = useTranslations('room.music.share');

  const { sharerName } = useRemoteShareBar();

  if (sharerName === null) {
    return null;
  }

  const title = t('remoteTitle', { name: sharerName });

  return (
    <MusicBarFrame isMinimized={isMinimized} label={title}>
      <span aria-hidden className={s.icon}>
        <AudioLines />
      </span>

      <span className={s.meta}>
        <span className={s.title}>{title}</span>
        <span className={s.subtitle}>{t('remoteSubtitle')}</span>
      </span>

      <MusicVolumeButton />
    </MusicBarFrame>
  );
};
