'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Spinner
} from '@chatovo/ui-kit';
import { PhoneOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserAvatar } from '@/entities/auth/user';

import { useOutgoingCall } from '../model/hooks';

import s from './OutgoingCallDialog.module.scss';

export const OutgoingCallDialog = () => {
  const t = useTranslations('friends.outgoingCall');
  const { call, isRinging, isBusy, cancel } = useOutgoingCall();

  return (
    <Dialog open={isRinging} onOpenChange={(open) => !open && !isBusy && cancel()}>
      <DialogContent className={s.content} showCloseButton={false}>
        {call && (
          <>
            <DialogHeader className={s.header}>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description', { name: call.callee.name })}</DialogDescription>
            </DialogHeader>

            <div className={s.callee}>
              <UserAvatar
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
                name={call.callee.name}
                sizes='80px'
                src={call.callee.avatarUrl}
              />
              <span className={s.name}>{call.callee.name}</span>
            </div>

            <Button
              className={s.cancel}
              disabled={isBusy}
              size='lg'
              variant='secondary'
              onClick={cancel}
            >
              {isBusy ? <Spinner decorative /> : <PhoneOff aria-hidden />}
              {t('cancel')}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
