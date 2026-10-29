import { Button } from '@chatovo/ui-kit';
import { PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { FriendCallBannerProps } from './FriendCallBanner.types';

import s from './FriendCallBanner.module.scss';

export const FriendCallBanner = ({ duration, status, onJoin }: FriendCallBannerProps) => {
  const t = useTranslations('friends.callBanner');

  const text = match(status)
    .with('calling', () => t('calling'))
    .with('inCall', () => t('inCall'))
    .with('ongoing', () => t('ongoing', { duration: duration ?? '' }))
    .exhaustive();

  return (
    <motion.div
      animate={{ opacity: 1, height: 'auto' }}
      className={s.root}
      exit={{ opacity: 0, height: 0 }}
      initial={{ opacity: 0, height: 0 }}
      role='status'
    >
      <PhoneCall aria-hidden className={s.icon} />
      <span className={s.text}>{text}</span>

      {status === 'ongoing' && (
        <Button className={s.join} size='xs' onClick={onJoin}>
          {t('join')}
        </Button>
      )}
    </motion.div>
  );
};
