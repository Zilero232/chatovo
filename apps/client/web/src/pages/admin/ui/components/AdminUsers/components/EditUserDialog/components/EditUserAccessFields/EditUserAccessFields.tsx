import { FormField, Label, Select, Switch } from '@chatovo/ui-kit';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'use-intl';

import type { EditUserAccessFieldsProps } from './EditUserAccessFields.types';

import { useUserAccess } from '../../../../../../../model/hooks';

import s from './EditUserAccessFields.module.scss';

export const EditUserAccessFields = ({ control, user }: EditUserAccessFieldsProps) => {
  const t = useTranslations('admin');

  const { canEditFlags, canEditRole, roleOptions } = useUserAccess(user);

  const options = (canEditRole ? roleOptions : [user.role]).map((role) => ({
    value: role,
    label: t(`roles.${role}`)
  }));

  return (
    <>
      <Label className={s.toggle} htmlFor='admin-verified'>
        <Controller
          render={({ field }) => (
            <Switch
              checked={field.value}
              disabled={!canEditFlags}
              id='admin-verified'
              onCheckedChange={field.onChange}
            />
          )}
          control={control}
          name='verified'
        />
        {t('editUser.verified')}
      </Label>

      <Label className={s.toggle} htmlFor='admin-developer'>
        <Controller
          render={({ field }) => (
            <Switch
              checked={field.value}
              disabled={!canEditFlags}
              id='admin-developer'
              onCheckedChange={field.onChange}
            />
          )}
          control={control}
          name='developer'
        />
        {t('editUser.developer')}
      </Label>

      <FormField
        hint={canEditRole ? undefined : t('editUser.roleLocked')}
        htmlFor='admin-role-trigger'
        label={t('editUser.role')}
      >
        <Controller
          render={({ field }) => (
            <Select
              aria-label={t('editUser.role')}
              isDisabled={!canEditRole}
              options={options}
              value={field.value ?? user.role}
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
