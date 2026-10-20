'use client';

import {
  HeadphoneOff,
  Headphones,
  LogOut,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Video,
  VideoOff
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { isScreenShareSupported } from '@/shared/lib';

import type { RoomControlDevice } from '../../config/devices';
import type { ControlDevice } from './components';
import type { RoomControlBarProps } from './RoomControlBar.types';

import { CAM_DEVICE, MIC_DEVICE, SPEAKER_DEVICE } from '../../config/devices';
import { useRoomControls } from '../../model/hooks';
import { ControlButton, ReactionButton } from './components';

import s from './RoomControlBar.module.scss';

export const RoomControlBar = ({ extraActions }: RoomControlBarProps) => {
  const t = useTranslations('room.controls');

  const { mic, camera, screen, deafen, leave } = useRoomControls();
  const screenShareSupported = isScreenShareSupported();

  const micLabel = mic.pttKey ? `${t(mic.labelKey)} · ${mic.pttKey}` : t(mic.labelKey);

  const toDevice = ({ kind, slot, labelKey }: RoomControlDevice): ControlDevice => ({
    kind,
    slot,
    label: t(labelKey)
  });

  return (
    <div className={s.root}>
      <ControlButton
        device={toDevice(MIC_DEVICE)}
        icon={mic.isMuted ? <MicOff /> : <Mic />}
        isPending={mic.isPending}
        label={micLabel}
        pressed={mic.isMuted}
        tone={mic.tone}
        onClick={mic.toggle}
      />

      <ControlButton
        device={toDevice(SPEAKER_DEVICE)}
        icon={deafen.active ? <HeadphoneOff /> : <Headphones />}
        label={deafen.active ? t('undeafen') : t('deafen')}
        pressed={deafen.active}
        tone={deafen.active ? 'danger' : 'off'}
        onClick={deafen.toggle}
      />

      <ControlButton
        device={toDevice(CAM_DEVICE)}
        icon={camera.enabled ? <Video /> : <VideoOff />}
        isPending={camera.isPending}
        label={camera.enabled ? t('cameraOff') : t('camera')}
        pressed={camera.enabled}
        tone={camera.enabled ? 'active' : 'off'}
        onClick={camera.toggle}
      />

      {screenShareSupported && (
        <ControlButton
          icon={screen.enabled ? <MonitorOff /> : <Monitor />}
          isPending={screen.isPending}
          label={screen.enabled ? t('stopShare') : t('screenShare')}
          pressed={screen.enabled}
          tone={screen.enabled ? 'active' : 'off'}
          onClick={screen.toggle}
        />
      )}

      <ReactionButton />

      {extraActions}

      <span aria-hidden className={s.divider} />

      <ControlButton icon={<LogOut />} label={t('leave')} tone='leave' onClick={leave} />
    </div>
  );
};
