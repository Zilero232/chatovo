import type { UpdateRoomRequest } from '@chatovo/schemas';

import { updateRoomInputSchema } from '@chatovo/schemas';
import { Row, Stack, SubmitButton } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useUpdateRoom } from '@/entities/room/room';

import type { EditRoomFormProps } from './EditRoomDialog.types';

import { EditRoomNameField, EditRoomPasswordField, EditRoomPrivacyField } from './components';

import s from './EditRoomForm.module.scss';

export const EditRoomForm = ({ room, onUpdated }: EditRoomFormProps) => {
  const t = useTranslations('manageRoom.edit');
  const toastError = useToastError();

  const updateMutation = useUpdateRoom();

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    watch
  } = useForm<UpdateRoomRequest>({
    resolver: zodResolver(updateRoomInputSchema),
    mode: 'onChange',
    defaultValues: { name: room.name, isPrivate: room.isPrivate }
  });

  const isPrivate = watch('isPrivate');
  const name = watch('name');
  const isPending = updateMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate(
      { id: room.id, input: values },
      {
        onSuccess: (updated) => {
          toast.success(t('saved'), {
            id: `room-update-${room.id}`,
            description: `"${updated.name}"`
          });
          onUpdated?.();
        },
        onError: toastError(`room-update-${room.id}`)
      }
    );
  });

  return (
    <Stack noValidate as='form' gap='3' onSubmit={onSubmit}>
      <EditRoomNameField error={errors.name?.message} register={register} value={name ?? ''} />

      <EditRoomPrivacyField control={control} isPrivate={isPrivate ?? false} />

      <EditRoomPasswordField
        error={errors.password?.message}
        isPrivate={isPrivate ?? false}
        register={register}
      />

      <Row className={s.actions} gap='2' justify='end'>
        <SubmitButton disabled={!isDirty} isPending={isPending}>
          {t('submit')}
        </SubmitButton>
      </Row>
    </Stack>
  );
};
