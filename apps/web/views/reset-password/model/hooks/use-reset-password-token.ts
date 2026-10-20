import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { ROUTES } from '@/shared/constants';

export const useResetPasswordToken = () => {
  const navigate = useNavigate();
  const { token, error } = useSearch({ strict: false });
  const t = useTranslations('auth');

  const [isDone, setIsDone] = useState(false);

  const isInvalid = !token || error !== undefined;

  const rejectInvalidToken = useEffectEvent(() => {
    toast.error(t('resetTokenMissing'), { id: 'reset-token-invalid' });

    navigate({ to: ROUTES.auth, replace: true });
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
