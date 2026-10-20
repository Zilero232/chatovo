'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { useFieldError } from '@/entities/app/locale';

import type { ProfileFieldsProps } from './ProfileFields.types';

import { BannerColorField } from '../BannerColorField/BannerColorField';
import { ProfileTextField } from '../ProfileTextField/ProfileTextField';

export const ProfileFields = ({ control, errors, register }: ProfileFieldsProps) => {
  const t = useTranslations('settings.profile');
  const fieldError = useFieldError('auth');

  return (
    <>
      <ProfileTextField
        autoComplete='name'
        error={errors.displayName && fieldError(errors.displayName)}
        hint={t('displayNameHint')}
        id='profile-display-name'
        label={t('displayNameLabel')}
        registration={register('displayName')}
      />

      <ProfileTextField
        autoComplete='url'
        error={errors.profileUrl && fieldError(errors.profileUrl)}
        hint={t('profileUrlHint')}
        id='profile-url'
        label={t('profileUrlLabel')}
        placeholder={t('profileUrlPlaceholder')}
        registration={register('profileUrl')}
        type='url'
      />

      <ProfileTextField
        multiline
        error={errors.bio && fieldError(errors.bio)}
        hint={t('bioHint')}
        id='profile-bio'
        label={t('bioLabel')}
        placeholder={t('bioPlaceholder')}
        registration={register('bio')}
        rows={3}
      />

      <Controller
        control={control}
        name='bannerColor'
        render={({ field }) => <BannerColorField value={field.value} onChange={field.onChange} />}
      />
    </>
  );
};
