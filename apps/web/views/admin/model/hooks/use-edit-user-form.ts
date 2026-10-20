'use client';

import type { AdminUser, UpdateAdminUserValues } from '@chatovo/schemas';

import { updateAdminUserSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useUpdateUser } from '@/entities/app/admin';
import { useToastError } from '@/entities/app/locale';

type UseEditUserFormInput = {
  user: AdminUser;
  onDone: () => void;
};

export const useEditUserForm = ({ user, onDone }: UseEditUserFormInput) => {
  const t = useTranslations('admin');
  const toastError = useToastError();
  const { isPending, mutate } = useUpdateUser();

  const form = useForm<UpdateAdminUserValues>({
    resolver: zodResolver(updateAdminUserSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio,
      profileUrl: user.profileUrl,
      verified: user.verified,
      role: user.role === 'admin' ? 'admin' : 'user'
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    mutate(
      { userId: user.id, values },
      {
        onSuccess: () => {
          toast.success(t('users.updated'), { id: 'update-user' });
          onDone();
        },
        onError: toastError('update-user')
      }
    );
  });

  return { form, isPending, onSubmit };
};
