import type { ComponentType } from 'react';

export type DeviceMenuItemProps = {
  device: MediaDeviceInfo;
  icon: ComponentType<{ className?: string }>;
  isActive: boolean;
};
