import { Button, Text } from '@chatovo/ui-kit';
import { PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'use-intl';

import { UserAvatar } from '@/entities/auth/user';

import type { DmCallStatusProps } from './DmCallStatus.types';

import s from './DmCallStatus.module.scss';

export const DmCallStatus = ({
  peer,
  status,
  isPulsing,
  canRingAgain,
  isRingingAgain,
  onRingAgain
}: DmCallStatusProps) => {
  const t = useTranslations('room.dmCall');

  return (
    <motion.div animate={{ opacity: 1 }} className={s.root} initial={{ opacity: 0 }}>
      {peer && (
        <span className={s.ring} data-pulsing={isPulsing || undefined}>
          <UserAvatar className={s.avatar} name={peer.name} sizes='96px' src={peer.avatarUrl} />
        </span>
      )}

      <Text aria-live='polite' className={s.status} tone='muted'>
        {status}
      </Text>

      {canRingAgain && (
        <Button disabled={isRingingAgain} size='sm' variant='secondary' onClick={onRingAgain}>
          <PhoneCall aria-hidden />
          {t('ringAgain')}
        </Button>
      )}
    </motion.div>
  );
};
