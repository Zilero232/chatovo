'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent } from 'react';
import { isEmpty } from 'remeda';
import { toast } from 'sonner';

import { useAppSettings } from '@/entities/app/settings';

import type { UseDeviceSelect, UseDeviceSelectInput } from './use-device-select.types';

import { deviceErrorKey } from '../../../ui/RoomControlBar/components/DeviceMenu/lib/device-error-key';

export const useDeviceSelect = ({ kind, slot, label }: UseDeviceSelectInput): UseDeviceSelect => {
  const t = useTranslations('settings.devices');

  const { settings, setGroup } = useAppSettings();

  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    requestPermissions: true,
    onError: (error) => {
      toast.error(t(deviceErrorKey(error), { device: label }), { id: `device-${kind}` });
    }
  });

  const selectedId = settings.devices[slot];

  const availableIds = devices.map((device) => device.deviceId).filter((id) => !isEmpty(id));
  const [fallbackId] = availableIds;

  const resolvedId = [selectedId, activeDeviceId, fallbackId].find((deviceId) =>
    availableIds.includes(deviceId)
  );

  const persistDevice = useEffectEvent((deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });
  });

  useEffect(() => {
    if (!resolvedId || resolvedId === selectedId) {
      return;
    }

    persistDevice(resolvedId);
  }, [resolvedId, selectedId]);

  const selectDevice = async (deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });

    try {
      await setActiveMediaDevice(deviceId);
    } catch (error) {
      toast.error(t(deviceErrorKey(error as Error), { device: label }), { id: `device-${kind}` });
    }
  };

  return { devices, resolvedId, selectDevice };
};
