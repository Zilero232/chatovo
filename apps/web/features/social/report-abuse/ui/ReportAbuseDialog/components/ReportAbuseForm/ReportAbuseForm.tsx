'use client';

import type { ReportAbuseFormValues, ReportAbuseValues } from '@chatovo/schemas';

import { reportAbuseSchema } from '@chatovo/schemas';
import { FormField, Stack, SubmitButton, Textarea } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useFieldError, useToastError } from '@/entities/app/locale';

import type { ReportAbuseFormProps } from './ReportAbuseForm.types';

import { useReportAbuse } from '../../../../model/hooks';
import { AbuseReasonField } from './components';

import s from '../../ReportAbuseDialog.module.scss';

export const ReportAbuseForm = ({ target, targetId, onSent }: ReportAbuseFormProps) => {
  const t = useTranslations('moderation');
  const fieldError = useFieldError('moderation');
  const toastError = useToastError();

  const { isPending, mutate } = useReportAbuse();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register
  } = useForm<ReportAbuseFormValues, unknown, ReportAbuseValues>({
    resolver: zodResolver(reportAbuseSchema),
    defaultValues: { target, targetId, reason: 'harassment', comment: '' }
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('sent'), { id: 'report-abuse' });
        onSent();
      },
      onError: toastError('report-abuse')
    });
  });

  return (
    <Stack as='form' gap='4' onSubmit={onSubmit}>
      <AbuseReasonField control={control} error={errors.reason && fieldError(errors.reason)} />

      <FormField
        error={errors.comment && fieldError(errors.comment)}
        hint={t('commentHint')}
        htmlFor='abuse-comment'
        label={t('commentLabel')}
      >
        <Textarea
          id='abuse-comment'
          placeholder={t('commentPlaceholder')}
          {...register('comment')}
        />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
