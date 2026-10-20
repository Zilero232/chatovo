import type { SelectOption } from '@chatovo/ui-kit';

import { Select } from '@chatovo/ui-kit';
import { useMediaDeviceSelect } from '@livekit/components-react';
import { isEmpty } from 'remeda';
import { useTranslations } from 'use-intl';

import { KIND_TO_SLOT, useAppSettings } from '@/entities/app/settings';

import type { DeviceSelectProps } from './DeviceSelect.types';

export const DeviceSelect = ({ kind, emptyLabel }: DeviceSelectProps) => {
  const t = useTranslations('settings.devices');

  const { settings, setGroup } = useAppSettings();
  const { devices } = useMediaDeviceSelect({ kind, requestPermissions: true });

  const slot = KIND_TO_SLOT[kind];
  const selectedId = settings.devices[slot];
  const selected = devices.find((device) => device.deviceId === selectedId);
  const activeId = selected?.deviceId ?? devices[0]?.deviceId ?? null;

  const options: SelectOption<string>[] = devices.map((device) => ({
    value: device.deviceId,
    label: device.label || t('unknownDevice')
  }));

  const selectDevice = (deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });
  };

  return (
    <Select
      isDisabled={isEmpty(devices)}
      options={options}
      placeholder={emptyLabel ?? t('noDevices')}
      value={activeId}
      onChange={selectDevice}
    />
  );
};
