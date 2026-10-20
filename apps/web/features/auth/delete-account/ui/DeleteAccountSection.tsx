'use client';

import { Button, ConfirmDialog, Text } from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';

import { useDeleteAccount } from '../model/hooks';

export const DeleteAccountSection = () => {
  const t = useTranslations('settings.deleteAccount');
  const toastError = useToastError();

  const [isOpen, toggleOpen] = useBoolean(false);

  const deleteMutation = useDeleteAccount();

  const onConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('requested'), { id: 'delete-account' });
        toggleOpen(false);
      },
      onError: toastError('delete-account')
    });
  };

  return (
    <>
      <Text size='sm' tone='muted'>
        {t('description')}
      </Text>

      <Button variant='destructive' onClick={() => toggleOpen(true)}>
        <Trash2 />
        {t('action')}
      </Button>

      <ConfirmDialog
        cancelLabel={t('cancel')}
        confirmLabel={t('confirm')}
        description={t('dialogDescription')}
        hint={t('hint')}
        icon={<Trash2 />}
        isPending={deleteMutation.isPending}
        open={isOpen}
        title={t('dialogTitle')}
        onConfirm={onConfirm}
        onOpenChange={toggleOpen}
      >
        <Text size='sm' tone='destructive'>
          {t('consequences')}
        </Text>
      </ConfirmDialog>
    </>
  );
};
