'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { ResetPasswordForm } from '@/features/auth/reset-password';
import { useEnterMotion } from '@/shared/hooks';
import { Chato, Text } from '@/ui-kit';

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
    <div className={clsx(s.root, 'inset-page-x', 'inset-page-y')}>
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
    </div>
  );
};
