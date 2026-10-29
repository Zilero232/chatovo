import { IconButtonWithTooltip, Text } from '@chatovo/ui-kit';
import { useConnectionState } from '@livekit/components-react';
import { clsx } from 'clsx';
import { ConnectionState } from 'livekit-client';
import { AudioLines, HeadphoneOff, Headphones, Mic, MicOff, PhoneOff } from 'lucide-react';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useRoomControls } from '@/features/room/room-control';

import type { MiniRoomBarProps } from './MiniRoomBar.types';

import { useDmCallLabel } from '../../../model/hooks';

import s from './MiniRoomBar.module.scss';

export const MiniRoomBar = ({ isDm, roomName, variant = 'docked', onExpand }: MiniRoomBarProps) => {
  const t = useTranslations('room');

  const connectionState = useConnectionState();
  const { mic, deafen, leave } = useRoomControls();
  const { title, duration, isRinging } = useDmCallLabel(roomName);

  const isConnected = connectionState === ConnectionState.Connected;
  const micLabelKey = mic.labelKey === 'pttHint' ? 'mute' : mic.labelKey;
  const statusText = match({ isConnected, isRinging, duration })
    .with({ isConnected: false }, () => t('mini.connecting'))
    .with({ isRinging: true }, () => t('mini.calling'))
    .with({ duration: P.string }, ({ duration: value }) => t('mini.inCallFor', { duration: value }))
    .otherwise(() => t(isDm ? 'mini.inCall' : 'mini.inRoom'));

  return (
    <section
      aria-label={t('mini.label', { name: title })}
      className={clsx(s.root, variant === 'floating' && [s.floating, 'glass'])}
      data-mini-room={variant}
    >
      <button className={s.identity} type='button' onClick={onExpand}>
        <span aria-hidden className={clsx(s.pulse, isConnected && s.pulseLive)}>
          <AudioLines className={s.pulseGlyph} />
        </span>

        <span className={s.meta}>
          <Text truncate className={s.name} size='sm' weight='medium'>
            {title}
          </Text>
          <Text truncate size='xs' tone='muted'>
            {statusText}
          </Text>
        </span>
      </button>

      <div className={s.actions}>
        <IconButtonWithTooltip
          aria-disabled={mic.isLocked}
          className={clsx(s.action, mic.isMuted && s.off, mic.isLocked && s.locked)}
          disabled={mic.isPending}
          icon={mic.isMuted ? <MicOff /> : <Mic />}
          label={mic.isInvisible ? mic.label : t(`controls.${micLabelKey}`)}
          size='icon-sm'
          tooltipSide='top'
          onClick={mic.toggle}
        />

        <IconButtonWithTooltip
          className={clsx(s.action, deafen.active && s.off)}
          icon={deafen.active ? <HeadphoneOff /> : <Headphones />}
          label={deafen.active ? t('controls.undeafen') : t('controls.deafen')}
          size='icon-sm'
          tooltipSide='top'
          onClick={deafen.toggle}
        />

        <IconButtonWithTooltip
          className={clsx(s.action, s.leave)}
          icon={<PhoneOff />}
          label={t('controls.leave')}
          size='icon-sm'
          tooltipSide='top'
          onClick={leave}
        />
      </div>
    </section>
  );
};
