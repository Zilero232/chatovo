import type { SignUpFormValues, SignUpValues } from '@chatovo/schemas';

import { signUpSchema } from '@chatovo/schemas';
import { Stack, SubmitButton } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';

import { useSignUp } from '../model/hooks';
import { SignUpConsentField, SignUpCredentialFields } from './components';

import s from './SignUpForm.module.scss';

const DEFAULT_VALUES: SignUpFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false
};

export const SignUpForm = () => {
  const t = useTranslations('auth');
  const toastError = useToastError();

  const { isPending, mutate } = useSignUp();

  const form = useForm<SignUpFormValues, unknown, SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: DEFAULT_VALUES
  });

  const onSubmit = form.handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => toast.success(t('signedIn'), { id: 'sign-up' }),
      onError: toastError('sign-up')
    });
  });

  return (
    <FormProvider {...form}>
      <Stack as='form' gap='4' onSubmit={onSubmit}>
        <SignUpCredentialFields />

        <SignUpConsentField />

        <SubmitButton className={s.submit} isPending={isPending} size='lg'>
          {t('signUp')}
        </SubmitButton>
      </Stack>
    </FormProvider>
  );
};
