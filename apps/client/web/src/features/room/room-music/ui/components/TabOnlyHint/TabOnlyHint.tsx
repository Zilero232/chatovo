import { MonitorUp } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { TabOnlyHintProps } from './TabOnlyHint.types';

import s from '../LinkCandidate/LinkCandidate.module.scss';

export const TabOnlyHint = ({ service }: TabOnlyHintProps) => {
  const t = useTranslations('room.music.tabOnly');

  return (
    <section className={s.root}>
      <span aria-hidden className={s.icon}>
        <MonitorUp />
      </span>

      <span className={s.meta}>
        <span className={s.source}>{t('title', { service: t(`services.${service}`) })}</span>
        <span className={s.note}>{t('hint')}</span>
      </span>
    </section>
  );
};
