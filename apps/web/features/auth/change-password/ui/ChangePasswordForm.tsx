'use client';

import { FormField, Input, SubmitButton } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { ChangePasswordValues } from '@/entities/auth/user';

import { useFieldError, useToastError } from '@/entities/app/locale';
import { changePasswordSchema, useChangePassword } from '@/entities/auth/user';

import s from './ChangePasswordForm.module.scss';

export const ChangePasswordForm = () => {
  const t = useTranslations('settings.security');
  const fieldError = useFieldError('auth');
  const toastError = useToastError();

  const { isPending, mutate } = useChangePassword();

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('passwordChanged'), { id: 'change-password' });
        reset();
      },
      onError: toastError('change-password')
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <FormField
        error={errors.currentPassword && fieldError(errors.currentPassword)}
        htmlFor='current-password'
        label={t('currentPasswordLabel')}
      >
        <Input
          autoComplete='current-password'
          id='current-password'
          type='password'
          {...register('currentPassword')}
        />
      </FormField>

      <FormField
        error={errors.newPassword && fieldError(errors.newPassword)}
        htmlFor='new-password'
        label={t('newPasswordLabel')}
      >
        <Input
          autoComplete='new-password'
          id='new-password'
          type='password'
          {...register('newPassword')}
        />
      </FormField>

      <FormField
        error={errors.confirmPassword && fieldError(errors.confirmPassword)}
        htmlFor='confirm-password'
        label={t('confirmPasswordLabel')}
      >
        <Input
          autoComplete='new-password'
          id='confirm-password'
          type='password'
          {...register('confirmPassword')}
        />
      </FormField>

      <SubmitButton className={s.submit} disabled={!isDirty} isPending={isPending}>
        {t('changePassword')}
      </SubmitButton>
    </form>
  );
};
