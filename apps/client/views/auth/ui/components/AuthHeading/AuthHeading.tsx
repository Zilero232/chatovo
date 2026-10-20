'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Chato, Text } from '@/ui-kit';

import type { AuthHeadingProps } from './AuthHeading.types';

import { AUTH_CHATO_POSE } from '../../../config';

import s from './AuthHeading.module.scss';

export const AuthHeading = ({ mode }: AuthHeadingProps) => {
  const t = useTranslations('auth');

  const { title, subtitle } = match(mode)
    .with('signup', () => ({ title: t('signUp'), subtitle: t('subtitleSignUp') }))
    .with('forgot', () => ({
      title: t('forgotPasswordTitle'),
      subtitle: t('forgotPasswordSubtitle')
    }))
    .with('signin', () => ({ title: t('signIn'), subtitle: t('subtitleSignIn') }))
    .exhaustive();

  return (
    <div className={s.root}>
      <Chato className={s.chato} pose={AUTH_CHATO_POSE[mode]} />

      <h1 className={s.title}>{title}</h1>
      <Text size='sm' tone='muted'>
        {subtitle}
      </Text>
    </div>
  );
};
