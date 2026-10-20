'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { LEGAL } from '@/shared/config';
import { Text } from '@/ui-kit';

import s from './AuthLegalFooter.module.scss';

export const AuthLegalFooter = () => {
  const t = useTranslations('legal');

  return (
    <Text align='center' className={s.root} size='xs' tone='inherit'>
      <Link className={s.link} href={LEGAL.privacyPath}>
        {t('privacy')}
      </Link>
      <span aria-hidden className={s.sep}>
        ·
      </span>
      <Link className={s.link} href={LEGAL.termsPath}>
        {t('terms')}
      </Link>
    </Text>
  );
};
