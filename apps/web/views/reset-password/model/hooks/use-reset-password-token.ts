'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useEffectEvent, useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/shared/constants';

export const useResetPasswordToken = () => {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations('auth');

  const [isDone, setIsDone] = useState(false);

  const token = params.get('token');
  const isInvalid = !token || params.has('error');

  const rejectInvalidToken = useEffectEvent(() => {
    toast.error(t('resetTokenMissing'), { id: 'reset-token-invalid' });

    router.replace(ROUTES.auth);
  });

  useEffect(() => {
    if (isInvalid) {
      rejectInvalidToken();
    }
  }, [isInvalid]);

  const markDone = () => setIsDone(true);

  if (isInvalid || !token) {
    return { isInvalid: true, isDone, markDone } as const;
  }

  return { isInvalid: false, token, isDone, markDone } as const;
};
