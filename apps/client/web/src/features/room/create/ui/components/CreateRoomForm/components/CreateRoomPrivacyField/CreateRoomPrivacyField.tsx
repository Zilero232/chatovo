import { Label, Row, Stack, Switch, Text } from '@chatovo/ui-kit';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'use-intl';

import type { CreateRoomPrivacyFieldProps } from './CreateRoomPrivacyField.types';

import s from '../../CreateRoomForm.module.scss';

export const CreateRoomPrivacyField = ({ control, isPrivate }: CreateRoomPrivacyFieldProps) => {
  const t = useTranslations('createRoom');

  return (
    <Stack className={s.privacyCard} gap='1'>
      <Row align='start' gap='3' justify='between'>
        <Label className={s.privacyLabel} htmlFor='create-room-private'>
          {t('privateLabel')}
        </Label>
        <Controller
          render={({ field }) => (
            <Switch
              checked={field.value}
              className={s.privacySwitch}
              id='create-room-private'
              onCheckedChange={field.onChange}
            />
          )}
          control={control}
          name='isPrivate'
        />
      </Row>

      <Text size='xs' tone='muted'>
        {t(isPrivate ? 'privateExplainer' : 'publicExplainer')}
      </Text>
    </Stack>
  );
};
