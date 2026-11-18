import { Text } from '@chatovo/ui-kit';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { AuthHeadingProps } from './AuthHeading.types';

import s from './AuthHeading.module.scss';

export const AuthHeading = ({ mode }: AuthHeadingProps) => {
  const t = useTranslations('auth');

  const { title, subtitle } = match(mode)
    .with('signup', () => ({
      title: t('createAccountTitle'),
      subtitle: t('createAccountSubtitle')
    }))
    .with('forgot', () => ({
      title: t('forgotPasswordTitle'),
      subtitle: t('forgotPasswordSubtitle')
    }))
    .with('signin', () => ({ title: t('welcomeTitle'), subtitle: t('welcomeSubtitle') }))
    .exhaustive();

  return (
    <div className={s.root}>
      <h1 className={s.title}>{title}</h1>
      <Text align='center' size='sm' tone='muted'>
        {subtitle}
      </Text>
    </div>
  );
};
