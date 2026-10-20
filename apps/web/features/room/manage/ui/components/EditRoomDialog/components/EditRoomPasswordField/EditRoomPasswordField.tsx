'use client';

import { FormField, PasswordInput } from '@chatovo/ui-kit';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import type { EditRoomPasswordFieldProps } from './EditRoomPasswordField.types';

import s from '../../EditRoomForm.module.scss';

export const EditRoomPasswordField = ({
  isPrivate,
  register,
  error
}: EditRoomPasswordFieldProps) => {
  const t = useTranslations('manageRoom.edit');

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
            htmlFor='edit-room-password'
            label={t('passwordLabel')}
          >
            <PasswordInput
              autoComplete='new-password'
              id='edit-room-password'
              {...register('password')}
            />
          </FormField>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
