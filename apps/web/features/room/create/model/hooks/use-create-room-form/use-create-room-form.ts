'use client';

import type { CreateRoomRequest } from '@chatovo/schemas';

import { createRoomInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useCreateRoom, useEnterRoom } from '@/entities/room/room';

import type { UseCreateRoomFormInput } from './use-create-room-form.types';

const DEFAULT_VALUES: CreateRoomRequest = { name: '', isPrivate: false };

export const useCreateRoomForm = ({ onCreated }: UseCreateRoomFormInput) => {
  const t = useTranslations('createRoom');
  const toastError = useToastError();
  const createMutation = useCreateRoom();
  const enterMutation = useEnterRoom();

  const form = useForm<CreateRoomRequest>({
    resolver: zodResolver(createRoomInputSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES
  });

  const isPrivate = form.watch('isPrivate');
  const name = form.watch('name');
  const isPending = createMutation.isPending || enterMutation.isPending;

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: (room) => {
        toast.success(t('created'), { id: 'room-create', description: `"${room.name}"` });
        form.reset(DEFAULT_VALUES);
        onCreated?.();
        enterMutation.mutate(
          { roomId: room.id, password: values.isPrivate ? values.password : undefined },
          {
            onError: toastError(`room-enter-${room.id}`)
          }
        );
      },
      onError: toastError('room-create')
    });
  });

  return { form, isPrivate, name, isPending, canSubmit: Boolean(name?.trim()), onSubmit };
};
