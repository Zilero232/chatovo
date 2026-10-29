import type { RoomPasswordFormValues } from '@chatovo/schemas';

import { roomPasswordFormSchema } from '@chatovo/schemas';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Row,
  Stack,
  SubmitButton
} from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';

import { useFieldError } from '@/entities/app/locale';

import type { InvisiblePasswordDialogProps } from './InvisiblePasswordDialog.types';

import s from './InvisiblePasswordDialog.module.scss';

const DEFAULT_VALUES: RoomPasswordFormValues = { password: '' };

export const InvisiblePasswordDialog = ({
  roomName,
  isPending,
  isWrong,
  onCancel,
  onSubmit
}: InvisiblePasswordDialogProps) => {
  const t = useTranslations('room');
  const passwordError = useFieldError('room.password');

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<RoomPasswordFormValues>({
    resolver: zodResolver(roomPasswordFormSchema),
    defaultValues: DEFAULT_VALUES
  });

  const submit = handleSubmit(({ password }) => onSubmit(password));

  const error = passwordError(errors.password) ?? (isWrong ? t('password.wrong') : undefined);

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader icon={<LockKeyhole />} tone='violet'>
          <DialogTitle>{t('invisible.passwordTitle')}</DialogTitle>
          <DialogDescription>{t('invisible.passwordHint', { name: roomName })}</DialogDescription>
        </DialogHeader>

        <Stack noValidate as='form' gap='4' onSubmit={submit}>
          <FormField error={error} htmlFor='invisible-room-password' label={t('password.label')}>
            <Input
              autoComplete='off'
              disabled={isPending}
              id='invisible-room-password'
              type='password'
              {...register('password')}
            />
          </FormField>

          <Row className={s.actions} gap='2'>
            <Button type='button' variant='secondary' onClick={onCancel}>
              {t('invisible.stayInvisible')}
            </Button>
            <SubmitButton isPending={isPending}>{t('invisible.passwordSubmit')}</SubmitButton>
          </Row>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
