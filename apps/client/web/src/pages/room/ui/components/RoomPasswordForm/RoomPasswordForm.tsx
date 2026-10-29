import type { RoomPasswordFormValues } from '@chatovo/schemas';

import { roomPasswordFormSchema } from '@chatovo/schemas';
import { EmptyStatePattern, FormField, Input, Stack } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';

import { useFieldError } from '@/entities/app/locale';

import type { RoomPasswordFormProps } from './RoomPasswordForm.types';

import { RoomPasswordActions, RoomPasswordHeader } from './components';

import s from './RoomPasswordForm.module.scss';

export const RoomPasswordForm = ({
  displayName,
  error,
  isSubmitting,
  onSubmit
}: RoomPasswordFormProps) => {
  const t = useTranslations('room.password');

  const passwordError = useFieldError('room.password');

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<RoomPasswordFormValues>({
    resolver: zodResolver(roomPasswordFormSchema),
    defaultValues: { password: '' }
  });

  const submit = handleSubmit(({ password }) => onSubmit(password));

  const fieldError = passwordError(errors.password) ?? error;

  return (
    <section className={s.root}>
      <EmptyStatePattern className={s.pattern} variant='waves' />

      <Stack
        noValidate
        as='form'
        className={clsx(s.card, 'glass', 'shadow-glow-violet')}
        gap='4'
        onSubmit={submit}
      >
        <RoomPasswordHeader displayName={displayName} />

        <FormField
          className={s.field}
          error={fieldError}
          htmlFor='room-password'
          label={t('label')}
        >
          <Input
            autoComplete='off'
            className={s.input}
            disabled={isSubmitting}
            id='room-password'
            type='password'
            {...register('password')}
          />
        </FormField>

        <RoomPasswordActions isSubmitting={isSubmitting} />
      </Stack>
    </section>
  );
};
