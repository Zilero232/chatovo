import { ROOM_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { FormField, Input, Text } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { CreateRoomNameFieldProps } from './CreateRoomNameField.types';

import s from '../../CreateRoomForm.module.scss';

export const CreateRoomNameField = ({ register, value, error }: CreateRoomNameFieldProps) => {
  const t = useTranslations('createRoom');

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
      htmlFor='create-room-name'
    >
      <Input
        autoComplete='off'
        id='create-room-name'
        maxLength={ROOM_NAME_MAX_LENGTH}
        placeholder={t('namePlaceholder')}
        {...register('name')}
      />
    </FormField>
  );
};
