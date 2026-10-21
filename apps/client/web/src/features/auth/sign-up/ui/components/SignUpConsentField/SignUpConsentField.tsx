import type { SignUpFormValues } from '@chatovo/schemas';

import { Checkbox, Label, Text } from '@chatovo/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';

import { useFieldError, useLegalLinks } from '@/entities/app/locale';
import { handleExternalLinkClick } from '@/shared/lib';

import s from './SignUpConsentField.module.scss';

export const SignUpConsentField = () => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
  const links = useLegalLinks();

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
                    href={links.terms}
                    rel='noopener noreferrer'
                    target='_blank'
                    onClick={(event) => handleExternalLinkClick({ event, url: links.terms })}
                  >
                    {chunks}
                  </a>
                ),
                privacy: (chunks) => (
                  <a
                    className={s.link}
                    href={links.privacy}
                    rel='noopener noreferrer'
                    target='_blank'
                    onClick={(event) => handleExternalLinkClick({ event, url: links.privacy })}
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
