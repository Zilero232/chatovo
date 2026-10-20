import { Text } from '@chatovo/ui-kit';
import { useConnectionState } from '@livekit/components-react';
import { clsx } from 'clsx';
import { ConnectionState } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { ConnectingOverlayProps } from './ConnectingOverlay.types';

import {
  BOX_ANIMATE,
  BOX_EXIT,
  BOX_INITIAL,
  BOX_TRANSITION,
  OVERLAY_TRANSITION
} from './ConnectingOverlay.motion';
import { ConnectingWaves } from './ConnectingWaves';

import s from './ConnectingOverlay.module.scss';

export const ConnectingOverlay = ({ roomName }: ConnectingOverlayProps) => {
  const t = useTranslations('room');
  const state = useConnectionState();

  const text = match(state)
    .with(ConnectionState.Connected, ConnectionState.Disconnected, () => null)
    .with(ConnectionState.Reconnecting, ConnectionState.SignalReconnecting, () =>
      t('reconnecting', { name: roomName })
    )
    .with(ConnectionState.Connecting, () => t('connecting', { name: roomName }))
    .exhaustive();

  return (
    <AnimatePresence>
      {text !== null && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-atomic='true'
          className={s.root}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role='status'
          transition={OVERLAY_TRANSITION}
        >
          <motion.div
            animate={BOX_ANIMATE}
            className={clsx(s.box, 'glass shadow-glow-violet')}
            exit={BOX_EXIT}
            initial={BOX_INITIAL}
            transition={BOX_TRANSITION}
          >
            <ConnectingWaves />
            <Text className={s.text} size='sm' tone='inherit'>
              {text}
            </Text>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
