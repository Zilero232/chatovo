'use client';

import type { Room } from 'livekit-client';

import { useRoomContext } from '@livekit/components-react';
import { LocalVideoTrack, RoomEvent, Track } from 'livekit-client';
import { useEffect, useEffectEvent, useRef } from 'react';

import type { DeviceSettings } from '@/entities/app/settings';

import {
  getCameraCaptureOptions,
  getPublishDefaults,
  KIND_TO_SLOT,
  useAppSettings
} from '@/entities/app/settings';

import { applyDevices } from '../../lib';

const useApplyDevices = (room: Room, devices: DeviceSettings) => {
  const { audioInput, audioOutput, videoInput } = devices;

  useEffect(() => {
    const apply = () => applyDevices({ room, devices: { audioInput, audioOutput, videoInput } });

    if (room.state === 'connected') {
      apply();
    }

    room.on(RoomEvent.Connected, apply);

    return () => {
      room.off(RoomEvent.Connected, apply);
    };
  }, [room, audioInput, audioOutput, videoInput]);
};

const useMirrorActiveDevice = (room: Room) => {
  const { settings, setGroup } = useAppSettings();

  const onActiveDeviceChanged = useEffectEvent((kind: MediaDeviceKind, deviceId: string) => {
    const slot = KIND_TO_SLOT[kind];

    if (settings.devices[slot] === deviceId) {
      return;
    }

    setGroup('devices', { [slot]: deviceId });
  });

  useEffect(() => {
    room.on(RoomEvent.ActiveDeviceChanged, onActiveDeviceChanged);

    return () => {
      room.off(RoomEvent.ActiveDeviceChanged, onActiveDeviceChanged);
    };
  }, [room]);
};

const useApplyAudioFlags = (room: Room) => {
  const { settings } = useAppSettings();
  const { noiseSuppression, echoCancellation, autoGainControl, voiceIsolation } = settings.audio;

  useEffect(() => {
    const capture = { noiseSuppression, echoCancellation, autoGainControl, voiceIsolation };

    room.options.audioCaptureDefaults = {
      ...room.options.audioCaptureDefaults,
      ...capture
    };

    if (room.localParticipant.isMicrophoneEnabled) {
      room.localParticipant.setMicrophoneEnabled(true, capture).catch((err) => {
        console.error('failed to apply audio capture flags', err);
      });
    }
  }, [room, noiseSuppression, echoCancellation, autoGainControl, voiceIsolation]);
};

const usePublishDefaults = (room: Room) => {
  const { settings } = useAppSettings();
  const { cameraQuality, screenQuality } = settings.video;

  useEffect(() => {
    room.options.publishDefaults = {
      ...room.options.publishDefaults,
      ...getPublishDefaults(cameraQuality, screenQuality)
    };
  }, [room, cameraQuality, screenQuality]);
};

const useRestartCameraOnQualityChange = (room: Room) => {
  const { settings } = useAppSettings();
  const { cameraQuality } = settings.video;

  const appliedQualityRef = useRef(cameraQuality);

  useEffect(() => {
    if (appliedQualityRef.current === cameraQuality) {
      return;
    }

    appliedQualityRef.current = cameraQuality;

    const cameraTrack = room.localParticipant.getTrackPublication(Track.Source.Camera)?.videoTrack;

    if (!(cameraTrack instanceof LocalVideoTrack)) {
      return;
    }

    cameraTrack.restartTrack(getCameraCaptureOptions(cameraQuality)).catch(async (err) => {
      console.error('failed to apply camera quality', err);

      await cameraTrack.restartTrack().catch(() => {
        room.localParticipant.setCameraEnabled(false);
      });
    });
  }, [room, cameraQuality]);
};

export const useDeviceSync = () => {
  const room = useRoomContext();

  const { settings } = useAppSettings();

  useApplyAudioFlags(room);
  usePublishDefaults(room);
  useRestartCameraOnQualityChange(room);
  useMirrorActiveDevice(room);
  useApplyDevices(room, settings.devices);
};
