import type { SignInValues } from '@chatovo/schemas';

import { signInSchema } from '@chatovo/schemas';
import { FormField, Input, PasswordInput, Stack, SubmitButton } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useFieldError, useToastError } from '@/entities/app/locale';

import type { SignInFormProps } from './SignInForm.types';

import { useSignIn } from '../model/hooks';

import s from './SignInForm.module.scss';

const DEFAULT_VALUES: SignInValues = { email: '', password: '' };

export const SignInForm = ({ onForgotPassword }: SignInFormProps) => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const toastError = useToastError();
  const { isPending, mutate } = useSignIn();

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: DEFAULT_VALUES
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => toast.success(t('signedIn'), { id: 'sign-in' }),
      onError: toastError('sign-in')
    });
  });

  return (
    <Stack noValidate as='form' gap='4' onSubmit={onSubmit}>
      <FormField
        error={errors.email && fieldError(errors.email)}
        htmlFor='signin-email'
        label={t('fields.email')}
      >
        <Input autoComplete='email' id='signin-email' type='email' {...register('email')} />
      </FormField>

      <FormField
        error={errors.password && fieldError(errors.password)}
        htmlFor='signin-password'
        label={t('fields.password')}
      >
        <PasswordInput
          autoComplete='current-password'
          id='signin-password'
          {...register('password')}
        />
      </FormField>

      <button className={s.forgotLink} type='button' onClick={onForgotPassword}>
        {t('forgotPassword')}
      </button>

      <SubmitButton className={s.submit} isPending={isPending} size='lg'>
        {t('signIn')}
      </SubmitButton>
    </Stack>
  );
};
