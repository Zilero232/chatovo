'use client';

import type { SignUpFormValues } from '@chatovo/schemas';

import { FormField, Input, PasswordInput } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import { useFieldError } from '@/entities/app/locale';

export const SignUpCredentialFields = () => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');

  const {
    formState: { errors },
    register
  } = useFormContext<SignUpFormValues>();

  return (
    <>
      <FormField
        error={errors.name && fieldError(errors.name)}
        htmlFor='signup-name'
        label={t('fields.name')}
      >
        <Input autoComplete='name' id='signup-name' type='text' {...register('name')} />
      </FormField>

      <FormField
        error={errors.email && fieldError(errors.email)}
        htmlFor='signup-email'
        label={t('fields.email')}
      >
        <Input autoComplete='email' id='signup-email' type='email' {...register('email')} />
      </FormField>

      <FormField
        error={errors.password && fieldError(errors.password)}
        htmlFor='signup-password'
        label={t('fields.password')}
      >
        <PasswordInput autoComplete='new-password' id='signup-password' {...register('password')} />
      </FormField>

      <FormField
        error={errors.confirmPassword && fieldError(errors.confirmPassword)}
        htmlFor='signup-confirm-password'
        label={t('fields.confirmPassword')}
      >
        <PasswordInput
          autoComplete='new-password'
          id='signup-confirm-password'
          {...register('confirmPassword')}
        />
      </FormField>
    </>
  );
};
