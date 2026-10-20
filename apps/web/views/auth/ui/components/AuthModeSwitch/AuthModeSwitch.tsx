'use client';

import { Text } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';

import type { AuthModeSwitchProps } from './AuthModeSwitch.types';

import s from './AuthModeSwitch.module.scss';

export const AuthModeSwitch = ({ mode, onModeChange }: AuthModeSwitchProps) => {
  const t = useTranslations('auth');

  const isSignUp = mode === 'signup';

  return (
    <Text align='center' size='sm' tone='muted'>
      {t(isSignUp ? 'hasAccount' : 'noAccount')}{' '}
      <button
        className={s.toggle}
        type='button'
        onClick={() => onModeChange(isSignUp ? 'signin' : 'signup')}
      >
        {t(isSignUp ? 'signIn' : 'signUp')}
      </button>
    </Text>
  );
};
