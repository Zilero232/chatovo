import { useConnectionQualityIndicator } from '@livekit/components-react';
import { ConnectionQuality } from 'livekit-client';
import { WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'use-intl';

import type { PeerConnectionNoticeProps } from './PeerConnectionNotice.types';

import s from './PeerConnectionNotice.module.scss';

export const PeerConnectionNotice = ({ name, participant }: PeerConnectionNoticeProps) => {
  const t = useTranslations('room.dmCall');

  const { quality } = useConnectionQualityIndicator({ participant });

  return (
    <AnimatePresence>
      {quality === ConnectionQuality.Lost && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={s.root}
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: -6 }}
          role='status'
        >
          <WifiOff aria-hidden className={s.icon} />
          {t('peerReconnecting', { name })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
