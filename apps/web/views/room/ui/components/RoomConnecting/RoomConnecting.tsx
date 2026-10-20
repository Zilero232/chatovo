'use client';

import { CenteredState, Spinner } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';

export const RoomConnecting = () => {
  const t = useTranslations('room');

  return <CenteredState icon={<Spinner size='sm' />} size='sm' title={t('authorizing')} />;
};
