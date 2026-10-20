import { Button, Spinner, Text } from '@chatovo/ui-kit';
import { MailWarning } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser, useSendVerificationEmail } from '@/entities/auth/user';

import s from './EmailVerificationNotice.module.scss';

export const EmailVerificationNotice = () => {
  const t = useTranslations('settings.security');
  const toastError = useToastError();
  const { emailVerified, user } = useCurrentUser();
  const { isPending, mutate } = useSendVerificationEmail();
  const [sent, setSent] = useState(false);

  if (!user || emailVerified) {
    return null;
  }

  const send = () => {
    mutate(user.email, {
      onSuccess: () => {
        setSent(true);
        toast.success(t('emailVerificationSent'), { id: 'send-verification-email' });
      },
      onError: (err: Error) => {
        toastError('send-verification-email')(err);
      }
    });
  };

  return (
    <div className={s.root} role='status'>
      <div className={s.header}>
        <MailWarning aria-hidden className={s.icon} />
        <div className={s.copy}>
          <Text size='sm' weight='medium'>
            {t('emailNotVerifiedTitle')}
          </Text>
          <Text className={s.description} size='xs' tone='muted'>
            {t('emailNotVerifiedDescription', { email: user.email })}
          </Text>
        </div>
      </div>

      <div className={s.actions}>
        <Button disabled={isPending} size='sm' type='button' variant='secondary' onClick={send}>
          {isPending && <Spinner decorative />}
          {sent ? t('emailVerificationResend') : t('emailVerificationSend')}
        </Button>
        {sent && <span className={s.sent}>{t('emailVerificationSentHint')}</span>}
      </div>
    </div>
  );
};
