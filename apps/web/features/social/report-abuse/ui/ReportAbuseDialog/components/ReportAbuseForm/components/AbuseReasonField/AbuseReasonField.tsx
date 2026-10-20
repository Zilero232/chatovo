'use client';

import type { AbuseReason } from '@chatovo/schemas';

import { abuseReasonSchema } from '@chatovo/schemas';
import { FormField, Label, RadioGroup, RadioGroupItem } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import type { AbuseReasonFieldProps } from './AbuseReasonField.types';

import s from '../../../../ReportAbuseDialog.module.scss';

const REASONS = abuseReasonSchema.options;

export const AbuseReasonField = ({ control, error }: AbuseReasonFieldProps) => {
  const t = useTranslations('moderation');

  return (
    <FormField error={error} htmlFor='abuse-reason' label={t('reasonLabel')}>
      <Controller
        render={({ field }) => (
          <RadioGroup
            className={s.reasons}
            id='abuse-reason'
            value={field.value}
            onValueChange={(value) => field.onChange(value as AbuseReason)}
          >
            {REASONS.map((reason) => (
              <Label key={reason} className={s.reason} htmlFor={`abuse-reason-${reason}`}>
                <RadioGroupItem id={`abuse-reason-${reason}`} value={reason} />
                <span className={s.reasonLabel}>{t(`reasons.${reason}`)}</span>
              </Label>
            ))}
          </RadioGroup>
        )}
        control={control}
        name='reason'
      />
    </FormField>
  );
};
