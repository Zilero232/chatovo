import { FormField, Label, Select, Switch } from '@chatovo/ui-kit';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'use-intl';

import type { EditUserAccessFieldsProps } from './EditUserAccessFields.types';

import s from './EditUserAccessFields.module.scss';

export const EditUserAccessFields = ({ control }: EditUserAccessFieldsProps) => {
  const t = useTranslations('admin');

  return (
    <>
      <Label className={s.toggle} htmlFor='admin-verified'>
        <Controller
          render={({ field }) => (
            <Switch checked={field.value} id='admin-verified' onCheckedChange={field.onChange} />
          )}
          control={control}
          name='verified'
        />
        {t('editUser.verified')}
      </Label>

      <FormField htmlFor='admin-role-trigger' label={t('editUser.role')}>
        <Controller
          render={({ field }) => (
            <Select
              options={[
                { value: 'user', label: t('editUser.roleUser') },
                { value: 'admin', label: t('editUser.roleAdmin') }
              ]}
              aria-label={t('editUser.role')}
              value={field.value ?? 'user'}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='role'
        />
      </FormField>
    </>
  );
};
