import { useTranslations } from 'use-intl';

import { RoomSkeleton } from '../RoomSkeleton/RoomSkeleton';

export const RoomLoadingFallback = () => {
  const t = useTranslations('room');

  return <RoomSkeleton>{t('loading')}</RoomSkeleton>;
};
