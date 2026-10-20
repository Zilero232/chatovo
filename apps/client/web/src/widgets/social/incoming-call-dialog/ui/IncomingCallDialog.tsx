import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@chatovo/ui-kit';
import { Phone, PhoneOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { UserAvatar } from '@/entities/auth/user';

import { useIncomingCall } from '../model/hooks';

import s from './IncomingCallDialog.module.scss';

export const IncomingCallDialog = () => {
  const t = useTranslations('friends.incomingCall');
  const { call, isBusy, accept, decline } = useIncomingCall();

  return (
    <Dialog open={call !== null} onOpenChange={(open) => !open && !isBusy && decline()}>
      <DialogContent className={s.content} showCloseButton={false}>
        {call && (
          <>
            <DialogHeader className={s.header}>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description', { name: call.caller.name })}</DialogDescription>
            </DialogHeader>

            <div className={s.caller}>
              <UserAvatar
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
                name={call.caller.name}
                sizes='80px'
                src={call.caller.avatarUrl}
              />
              <span className={s.name}>{call.caller.name}</span>
            </div>

            <div className={s.actions}>
              <Button disabled={isBusy} size='lg' variant='secondary' onClick={decline}>
                <PhoneOff aria-hidden />
                {t('decline')}
              </Button>
              <Button disabled={isBusy} size='lg' onClick={accept}>
                <Phone aria-hidden />
                {t('accept')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
