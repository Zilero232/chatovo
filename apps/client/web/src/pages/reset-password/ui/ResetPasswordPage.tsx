import { Chato, Text } from '@chatovo/ui-kit';
import { motion } from 'motion/react';
import { useTranslations } from 'use-intl';

import { ResetPasswordForm } from '@/features/auth/reset-password';
import { useEnterMotion } from '@/shared/hooks';

import { useResetPasswordToken } from '../model/hooks';
import { ResetPasswordDoneActions } from './components';

import s from './ResetPasswordPage.module.scss';

export const ResetPasswordPage = () => {
  const t = useTranslations('auth');
  const enterMotion = useEnterMotion();

  const resetToken = useResetPasswordToken();

  if (resetToken.isInvalid) {
    return null;
  }

  const { token, isDone, markDone } = resetToken;

  return (
    <motion.section className={s.card} {...enterMotion}>
      <div className={s.header}>
        <Chato className={s.chato} pose={isDone ? 'wink' : 'peek'} />

        <h1 className={s.title}>{isDone ? t('resetDoneTitle') : t('resetPasswordTitle')}</h1>
        <Text size='sm' tone='muted'>
          {isDone ? t('resetDoneSubtitle') : t('resetPasswordSubtitle')}
        </Text>
      </div>

      {isDone ? (
        <ResetPasswordDoneActions />
      ) : (
        <ResetPasswordForm token={token} onSuccess={markDone} />
      )}
    </motion.section>
  );
};
