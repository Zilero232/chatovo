import { IconButtonWithTooltip, Text } from '@chatovo/ui-kit';
import { useConnectionState } from '@livekit/components-react';
import { clsx } from 'clsx';
import { ConnectionState } from 'livekit-client';
import { AudioLines, HeadphoneOff, Headphones, LogOut, Mic, MicOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useRoomControls } from '@/features/room/room-control';

import type { MiniRoomBarProps } from './MiniRoomBar.types';

import s from './MiniRoomBar.module.scss';

export const MiniRoomBar = ({ isDm, roomName, variant = 'docked', onExpand }: MiniRoomBarProps) => {
  const t = useTranslations('room');

  const connectionState = useConnectionState();
  const { mic, deafen, leave } = useRoomControls();

  const isConnected = connectionState === ConnectionState.Connected;

  return (
    <section
      aria-label={t('mini.label', { name: roomName })}
      className={clsx(s.root, variant === 'floating' && [s.floating, 'glass'])}
      data-mini-room={variant}
    >
      <button className={s.identity} type='button' onClick={onExpand}>
        <span aria-hidden className={clsx(s.pulse, isConnected && s.pulseLive)}>
          <AudioLines className={s.pulseGlyph} />
        </span>

        <span className={s.meta}>
          <Text truncate className={s.name} size='sm' weight='medium'>
            {roomName}
          </Text>
          <Text truncate size='xs' tone='muted'>
            {isConnected ? t(isDm ? 'mini.inCall' : 'mini.inRoom') : t('mini.connecting')}
          </Text>
        </span>
      </button>

      <div className={s.actions}>
        <IconButtonWithTooltip
          className={clsx(s.action, mic.isMuted && s.off)}
          disabled={mic.isPending}
          icon={mic.isMuted ? <MicOff /> : <Mic />}
          label={mic.isMuted ? t('controls.unmute') : t('controls.mute')}
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
          icon={<LogOut />}
          label={t('controls.leave')}
          size='icon-sm'
          tooltipSide='top'
          onClick={leave}
        />
      </div>
    </section>
  );
};
