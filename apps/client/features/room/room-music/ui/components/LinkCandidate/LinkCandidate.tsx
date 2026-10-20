'use client';

import { Link2, ListPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import type { LinkCandidateProps } from './LinkCandidate.types';

import s from './LinkCandidate.module.scss';

export const LinkCandidate = ({ isPending, link, onAdd }: LinkCandidateProps) => {
  const t = useTranslations('room.music');

  return (
    <section className={s.root}>
      <span aria-hidden className={s.icon}>
        <Link2 />
      </span>

      <span className={s.meta}>
        <span className={s.source}>{t('add.link', { source: t(`sources.${link.source}`) })}</span>
        <span className={s.url}>{link.url}</span>
      </span>

      <Button disabled={isPending} size='sm' onClick={onAdd}>
        <ListPlus aria-hidden />
        {t('add.submit')}
      </Button>
    </section>
  );
};
