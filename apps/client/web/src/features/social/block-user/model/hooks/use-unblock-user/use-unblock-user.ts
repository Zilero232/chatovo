import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useUnblockUserMutation } from '@/entities/social/friend';

import type { UnblockUserInput } from './use-unblock-user.types';

export const useUnblockUser = () => {
  const t = useTranslations('blocks');
  const toastError = useToastError();

  const unblockMutation = useUnblockUserMutation();

  const unblock = ({ userId, userName }: UnblockUserInput) => {
    unblockMutation.mutate(userId, {
      onSuccess: () => {
        toast.success(t('unblockedToast', { name: userName }), { id: `user-block-${userId}` });
      },
      onError: toastError(`user-unblock-${userId}`)
    });
  };

  return { isPending: unblockMutation.isPending, unblock };
};
