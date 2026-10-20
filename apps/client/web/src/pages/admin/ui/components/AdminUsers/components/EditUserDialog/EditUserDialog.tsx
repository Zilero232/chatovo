import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Stack,
  SubmitButton,
  Textarea
} from '@chatovo/ui-kit';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useFieldError } from '@/entities/app/locale';

import type { EditUserDialogProps } from './EditUserDialog.types';

import { useEditUserForm } from '../../../../../model/hooks';
import { EditUserAccessFields } from './components';

import s from './EditUserDialog.module.scss';

export const EditUserDialog = ({ user, open, onOpenChange }: EditUserDialogProps) => {
  const t = useTranslations('admin');
  const fieldError = useFieldError('moderation');

  const { form, isPending, onSubmit } = useEditUserForm({
    user,
    onDone: () => onOpenChange(false)
  });

  const {
    formState: { errors },
    register
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Pencil />} tone='violet'>
          <DialogTitle>{t('editUser.title')}</DialogTitle>
          <DialogDescription>{t('editUser.description')}</DialogDescription>
        </DialogHeader>

        <Stack as='form' gap='4' onSubmit={onSubmit}>
          <FormField
            error={errors.displayName && fieldError(errors.displayName)}
            htmlFor='admin-display-name'
            label={t('editUser.displayName')}
          >
            <Input id='admin-display-name' {...register('displayName')} />
          </FormField>

          <FormField htmlFor='admin-bio' label={t('editUser.bio')}>
            <Textarea id='admin-bio' {...register('bio')} />
          </FormField>

          <FormField htmlFor='admin-profile-url' label={t('editUser.profileUrl')}>
            <Input id='admin-profile-url' {...register('profileUrl')} />
          </FormField>

          <EditUserAccessFields control={form.control} />

          <SubmitButton className={s.submit} isPending={isPending}>
            {t('editUser.submit')}
          </SubmitButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
