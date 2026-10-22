import type { ReportProblemValues } from '@chatovo/schemas';

import { reportProblemSchema } from '@chatovo/schemas';
import { FilePicker, FormField, Stack, SubmitButton, Textarea } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useFieldError, useToastError } from '@/entities/app/locale';

import type { ReportProblemFormProps } from './ReportProblemForm.types';

import { useReportProblem } from '../../../../model/hooks';

import s from '../../ReportProblemDialog.module.scss';

const DEFAULT_VALUES: ReportProblemValues = { description: '' };

export const ReportProblemForm = ({ onSent }: ReportProblemFormProps) => {
  const t = useTranslations('feedback');
  const fieldError = useFieldError('feedback');
  const toastError = useToastError();
  const { isPending, mutate } = useReportProblem();

  const [screenshot, setScreenshot] = useState<File | undefined>(undefined);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<ReportProblemValues>({
    resolver: zodResolver(reportProblemSchema),
    defaultValues: DEFAULT_VALUES
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      { ...values, screenshot },
      {
        onSuccess: () => {
          toast.success(t('sent'), { id: 'report-problem' });
          reset(DEFAULT_VALUES);
          setScreenshot(undefined);
          onSent();
        },
        onError: toastError('report-problem')
      }
    );
  });

  return (
    <Stack noValidate as='form' gap='4' onSubmit={onSubmit}>
      <FormField
        error={errors.description && fieldError(errors.description)}
        htmlFor='report-description'
        label={t('descriptionLabel')}
      >
        <Textarea
          id='report-description'
          placeholder={t('descriptionPlaceholder')}
          {...register('description')}
        />
      </FormField>

      <FormField
        hint={t('screenshotHint')}
        htmlFor='report-screenshot'
        label={t('screenshotLabel')}
      >
        <FilePicker
          accept='image/*'
          file={screenshot}
          id='report-screenshot'
          onSelect={setScreenshot}
        />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
