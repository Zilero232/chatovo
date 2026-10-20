'use client';

import { FormField, PasswordInput } from '@chatovo/ui-kit';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import type { CreateRoomPasswordFieldProps } from './CreateRoomPasswordField.types';

import s from '../../CreateRoomForm.module.scss';

export const CreateRoomPasswordField = ({
  isPrivate,
  register,
  error
}: CreateRoomPasswordFieldProps) => {
  const t = useTranslations('createRoom');

  return (
    <AnimatePresence initial={false}>
      {isPrivate && (
        <motion.div
          animate={{ height: 'auto', opacity: 1 }}
          className={s.passwordReveal}
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.32 }}
        >
          <FormField
            error={error}
            hint={t('passwordHint')}
            htmlFor='create-room-password'
            label={t('passwordLabel')}
          >
            <PasswordInput
              autoComplete='new-password'
              id='create-room-password'
              placeholder={t('passwordPlaceholder')}
              {...register('password')}
            />
          </FormField>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
