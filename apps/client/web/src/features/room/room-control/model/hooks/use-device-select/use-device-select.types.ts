import type { DeviceSettings } from '@/entities/app/settings';

export type UseDeviceSelectInput = {
  kind: MediaDeviceKind;
  label: string;
  slot: keyof DeviceSettings;
};

export type UseDeviceSelect = {
  devices: MediaDeviceInfo[];
  selectDevice: (deviceId: string) => Promise<void>;
  resolvedId?: string;
};
