'use client';

import type { BlockUserValues } from '@chatovo/schemas';

import { blockUserSchema } from '@chatovo/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormField,
  Stack,
  SubmitButton,
  Textarea
} from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ban } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useBlockUser } from '@/entities/app/admin';
import { useFieldError, useToastError } from '@/entities/app/locale';

import type { BlockUserDialogProps } from './BlockUserDialog.types';

import s from './BlockUserDialog.module.scss';

export const BlockUserDialog = ({ user, open, onOpenChange }: BlockUserDialogProps) => {
  const t = useTranslations('admin');
  const fieldError = useFieldError('moderation');
  const toastError = useToastError();
  const { isPending, mutate } = useBlockUser();

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<BlockUserValues>({
    resolver: zodResolver(blockUserSchema),
    defaultValues: { reason: '' }
  });

  const name = user.displayName ?? user.name;

  const onSubmit = handleSubmit((values) => {
    mutate(
      { userId: user.id, values },
      {
        onSuccess: () => {
          toast.success(t('users.blocked_toast'), { id: 'block-user' });
          onOpenChange(false);
        },
        onError: toastError('block-user')
      }
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Ban />} tone='destructive'>
          <DialogTitle>{t('blockUser.title', { name })}</DialogTitle>
          <DialogDescription>{t('blockUser.description')}</DialogDescription>
        </DialogHeader>

        <Stack as='form' gap='4' onSubmit={onSubmit}>
          <FormField
            error={errors.reason && fieldError(errors.reason)}
            htmlFor='block-reason'
            label={t('blockUser.reason')}
          >
            <Textarea
              id='block-reason'
              placeholder={t('blockUser.reasonPlaceholder')}
              {...register('reason')}
            />
          </FormField>

          <SubmitButton className={s.submit} isPending={isPending} variant='destructive'>
            {t('blockUser.submit')}
          </SubmitButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
