'use client';

import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './ActivityEmpty.module.scss';

export const ActivityEmpty = () => {
  const t = useTranslations('channels.activity');

  return (
    <div className={s.root}>
      <span aria-hidden className={s.glow}>
        <Sparkles className={s.icon} />
      </span>

      <p className={s.title}>{t('emptyTitle')}</p>
      <p className={s.hint}>{t('emptyHint')}</p>
    </div>
  );
};
