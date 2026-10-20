'use client';

import { FormField, Input, SubmitButton } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { ChangeEmailValues } from '@/entities/auth/user';

import { useFieldError, useToastError } from '@/entities/app/locale';
import { changeEmailSchema, useChangeEmail, useCurrentUser } from '@/entities/auth/user';

import s from './ChangeEmailForm.module.scss';

export const ChangeEmailForm = () => {
  const t = useTranslations('settings.security');
  const fieldError = useFieldError('auth');
  const toastError = useToastError();

  const { user } = useCurrentUser();
  const currentEmail = user?.email ?? '';

  const { isPending, mutate } = useChangeEmail();

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset
  } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: '' }
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('emailChangeRequested'), { id: 'change-email' });
        reset();
      },
      onError: toastError('change-email')
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <FormField htmlFor='current-email' label={t('currentEmailLabel')}>
        <Input disabled id='current-email' type='email' value={currentEmail} />
      </FormField>

      <FormField
        error={errors.newEmail && fieldError(errors.newEmail)}
        hint={errors.newEmail ? undefined : t('emailChangeHint')}
        htmlFor='new-email'
        label={t('newEmailLabel')}
      >
        <Input
          autoComplete='email'
          id='new-email'
          placeholder={t('newEmailPlaceholder')}
          type='email'
          {...register('newEmail')}
        />
      </FormField>

      <SubmitButton className={s.submit} disabled={!isDirty} isPending={isPending} type='submit'>
        {t('changeEmail')}
      </SubmitButton>
    </form>
  );
};
