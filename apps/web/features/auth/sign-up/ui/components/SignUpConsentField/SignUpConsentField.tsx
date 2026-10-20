'use client';

import type { SignUpFormValues } from '@chatovo/schemas';

import { Checkbox, Label, Text } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { useFieldError } from '@/entities/app/locale';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { handleExternalLinkClick } from '@/shared/lib';

import s from './SignUpConsentField.module.scss';

export const SignUpConsentField = () => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');

  const { control } = useFormContext<SignUpFormValues>();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <div className={s.root}>
          <Label className={s.row} htmlFor='signup-terms'>
            <Checkbox
              aria-invalid={Boolean(fieldState.error)}
              checked={field.value}
              id='signup-terms'
              name={field.name}
              onCheckedChange={field.onChange}
            />

            <Text as='span' size='xs' tone='muted'>
              {t.rich('consentLabel', {
                terms: (chunks) => (
                  <a
                    className={s.link}
                    href={EXTERNAL_LINKS.terms}
                    rel='noopener noreferrer'
                    target='_blank'
                    onClick={(event) =>
                      handleExternalLinkClick({ event, url: EXTERNAL_LINKS.terms })
                    }
                  >
                    {chunks}
                  </a>
                ),
                privacy: (chunks) => (
                  <a
                    className={s.link}
                    href={EXTERNAL_LINKS.privacy}
                    rel='noopener noreferrer'
                    target='_blank'
                    onClick={(event) =>
                      handleExternalLinkClick({ event, url: EXTERNAL_LINKS.privacy })
                    }
                  >
                    {chunks}
                  </a>
                )
              })}
            </Text>
          </Label>

          {fieldState.error && (
            <Text role='alert' size='xs' tone='destructive'>
              {fieldError(fieldState.error)}
            </Text>
          )}
        </div>
      )}
      control={control}
      name='acceptedTerms'
    />
  );
};
