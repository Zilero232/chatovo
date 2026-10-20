'use client';

import type { ForgotPasswordValues } from '@chatovo/schemas';

import { forgotPasswordSchema } from '@chatovo/schemas';
import { FormField, Input, Stack, SubmitButton } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useFieldError, useToastError } from '@/entities/app/locale';

import type { ForgotPasswordFormProps } from './ForgotPasswordForm.types';

import { useForgotPassword } from '../model/hooks';

import s from './ForgotPasswordForm.module.scss';

const DEFAULT_VALUES: ForgotPasswordValues = { email: '' };

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const toastError = useToastError();
  const { isPending, mutate } = useForgotPassword();

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: DEFAULT_VALUES
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => toast.success(t('resetEmailSent'), { id: 'forgot-password' }),
      onError: toastError('forgot-password')
    });
  });

  return (
    <Stack as='form' gap='4' onSubmit={onSubmit}>
      <FormField
        error={errors.email && fieldError(errors.email)}
        htmlFor='forgot-email'
        label={t('fields.email')}
      >
        <Input autoComplete='email' id='forgot-email' type='email' {...register('email')} />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending} size='lg'>
        {t('sendResetLink')}
      </SubmitButton>

      <button className={s.backLink} type='button' onClick={onBack}>
        <ArrowLeft aria-hidden />
        {t('backToSignIn')}
      </button>
    </Stack>
  );
};
