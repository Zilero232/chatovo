import { useTranslations } from 'use-intl';

import { RoomSkeleton } from '../RoomSkeleton/RoomSkeleton';

export const RoomConnecting = () => {
  const t = useTranslations('room');

  return <RoomSkeleton>{t('authorizing')}</RoomSkeleton>;
};
