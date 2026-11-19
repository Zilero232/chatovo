import type { DeviceSettings } from '@/entities/app/settings';

export type UseDeviceSelectInput = {
  kind: MediaDeviceKind;
  slot: keyof DeviceSettings;
};

export type UseDeviceSelect = {
  devices: MediaDeviceInfo[];
  selectDevice: (deviceId: string) => Promise<void>;
  resolvedId?: string;
};
