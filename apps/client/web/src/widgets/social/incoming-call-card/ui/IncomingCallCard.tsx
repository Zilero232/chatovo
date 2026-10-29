import { Button } from '@chatovo/ui-kit';
import { Phone, PhoneOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'use-intl';

import { UserAvatar } from '@/entities/auth/user';

import { INCOMING_CARD_MOTION } from '../config';
import { useIncomingCall } from '../model/hooks';

import s from './IncomingCallCard.module.scss';

export const IncomingCallCard = () => {
  const t = useTranslations('friends.incomingCall');

  const { incoming, hint, isBusyVariant, isPending, accept, decline } = useIncomingCall();

  return (
    <AnimatePresence>
      {incoming && (
        <motion.section
          key={incoming.id}
          aria-label={t('description', { name: incoming.peer.name })}
          aria-live='assertive'
          className={s.root}
          role='alertdialog'
          {...INCOMING_CARD_MOTION}
        >
          <UserAvatar
            className={s.avatar}
            name={incoming.peer.name}
            sizes='48px'
            src={incoming.peer.avatarUrl}
          />

          <div className={s.text}>
            <span className={s.title}>{t('title')}</span>
            <span className={s.name}>{incoming.peer.name}</span>
            {hint !== null && <span className={s.hint}>{hint}</span>}
          </div>

          <div className={s.actions}>
            <Button disabled={isPending} size='sm' variant='destructive' onClick={decline}>
              <PhoneOff aria-hidden />
              {t('decline')}
            </Button>
            <Button className={s.accept} disabled={isPending} size='sm' onClick={accept}>
              <Phone aria-hidden />
              {isBusyVariant ? t('endAndAccept') : t('accept')}
            </Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
