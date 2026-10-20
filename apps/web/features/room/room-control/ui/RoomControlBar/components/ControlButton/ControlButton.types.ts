import type { ReactNode } from 'react';

import type { DeviceSettings } from '@/entities/app/settings';

import type { ControlTone } from './control-button-tones';

export type ControlDevice = {
  kind: MediaDeviceKind;
  label: string;
  slot: keyof DeviceSettings;
};

export type ControlButtonProps = {
  device?: ControlDevice;
  disabled?: boolean;
  icon: ReactNode;
  isPending?: boolean;
  label: string;
  pressed?: boolean;
  tone: ControlTone;
  onClick: () => void;
};
