import type { DeviceSettings } from '@/entities/app/settings';

export type DeviceMenuProps = {
  kind: MediaDeviceKind;
  label: string;
  slot: keyof DeviceSettings;
};
