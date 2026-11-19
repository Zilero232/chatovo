import { useMediaDeviceSelect } from '@livekit/components-react';
import { useEffect, useEffectEvent } from 'react';
import { isEmpty } from 'remeda';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';

import type { UseDeviceSelect, UseDeviceSelectInput } from './use-device-select.types';

import { deviceErrorKey } from '../../../ui/RoomControlBar/components/DeviceMenu/lib/device-error-key';

export const useDeviceSelect = ({ kind, slot }: UseDeviceSelectInput): UseDeviceSelect => {
  const t = useTranslations('settings.devices');

  const { settings, setGroup } = useAppSettings();

  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    requestPermissions: true,
    onError: (error) => {
      toast.error(t(deviceErrorKey(error), { device: t(`kinds.${kind}`) }), {
        id: `device-${kind}`
      });
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
      const device =
        devices.find((entry) => entry.deviceId === deviceId)?.label || t(`kinds.${kind}`);

      toast.error(t(deviceErrorKey(error as Error), { device }), { id: `device-${kind}` });
    }
  };

  return { devices, resolvedId, selectDevice };
};
