'use client';

import { CenteredState } from '@chatovo/ui-kit';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './ChatEmpty.module.scss';

export const ChatEmpty = () => {
  const t = useTranslations('chat.empty');

  return (
    <CenteredState
      className={s.root}
      description={t('description')}
      icon={<MessageSquare className={s.icon} />}
      pattern='waveform'
      size='sm'
      title={t('title')}
    />
  );
};
