import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useBlockUserMutation } from '@/entities/social/friend';

import type { BlockUserInput } from './use-block-user.types';

export const useBlockUser = () => {
  const t = useTranslations('blocks');
  const toastError = useToastError();

  const blockMutation = useBlockUserMutation();

  const block = ({ userId, userName, onBlocked }: BlockUserInput) => {
    blockMutation.mutate(userId, {
      onSuccess: () => {
        toast.success(t('blockedToast', { name: userName }), { id: `user-block-${userId}` });
        onBlocked?.();
      },
      onError: toastError(`user-block-${userId}`)
    });
  };

  return { isPending: blockMutation.isPending, block };
};
