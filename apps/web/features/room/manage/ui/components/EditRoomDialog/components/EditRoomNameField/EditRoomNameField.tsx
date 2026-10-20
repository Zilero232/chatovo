import { ROOM_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { FormField, Input, Text } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { EditRoomNameFieldProps } from './EditRoomNameField.types';

import s from '../../EditRoomForm.module.scss';

export const EditRoomNameField = ({ register, value, error }: EditRoomNameFieldProps) => {
  const t = useTranslations('manageRoom.edit');

  return (
    <FormField
      label={
        <span className={s.labelRow}>
          {t('nameLabel')}
          <Text size='xs' tone='muted'>
            {t('nameCounter', { count: value?.length ?? 0, max: ROOM_NAME_MAX_LENGTH })}
          </Text>
        </span>
      }
      error={error}
      htmlFor='edit-room-name'
    >
      <Input
        autoComplete='off'
        id='edit-room-name'
        maxLength={ROOM_NAME_MAX_LENGTH}
        {...register('name')}
      />
    </FormField>
  );
};
