import { Label, Row, Stack, Switch, Text } from '@chatovo/ui-kit';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'use-intl';

import type { EditRoomPrivacyFieldProps } from './EditRoomPrivacyField.types';

export const EditRoomPrivacyField = ({ control, isPrivate }: EditRoomPrivacyFieldProps) => {
  const t = useTranslations('manageRoom.edit');

  return (
    <Stack gap='2'>
      <Row align='center' gap='2'>
        <Controller
          render={({ field }) => (
            <Switch checked={field.value} id='edit-room-private' onCheckedChange={field.onChange} />
          )}
          control={control}
          name='isPrivate'
        />
        <Label htmlFor='edit-room-private'>{t('privateLabel')}</Label>
      </Row>

      <Text size='xs' tone='muted'>
        {t(isPrivate ? 'privateExplainer' : 'publicExplainer')}
      </Text>
    </Stack>
  );
};
