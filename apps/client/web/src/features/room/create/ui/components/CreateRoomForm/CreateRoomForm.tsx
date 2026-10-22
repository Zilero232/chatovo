import { Stack, SubmitButton } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { CreateRoomFormProps } from './CreateRoomForm.types';

import { useCreateRoomForm } from '../../../model/hooks';
import { CreateRoomNameField, CreateRoomPasswordField, CreateRoomPrivacyField } from './components';

export const CreateRoomForm = ({ hint, onCreated }: CreateRoomFormProps) => {
  const t = useTranslations('createRoom');

  const { form, isPrivate, name, isPending, canSubmit, onSubmit } = useCreateRoomForm({
    onCreated
  });

  const {
    control,
    formState: { errors },
    register
  } = form;

  return (
    <Stack noValidate as='form' gap='3' onSubmit={onSubmit}>
      <CreateRoomNameField error={errors.name?.message} register={register} value={name ?? ''} />

      <CreateRoomPrivacyField control={control} isPrivate={isPrivate ?? false} />

      <CreateRoomPasswordField
        error={errors.password?.message}
        isPrivate={isPrivate ?? false}
        register={register}
      />

      {hint}

      <SubmitButton disabled={!canSubmit} isPending={isPending}>
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
