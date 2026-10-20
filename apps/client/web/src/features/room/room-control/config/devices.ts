import type { DeviceSettings } from '@/entities/app/settings';

export type RoomControlDevice = {
  kind: MediaDeviceKind;
  labelKey: 'camDevice' | 'micDevice' | 'speakerDevice';
  slot: keyof DeviceSettings;
};

export const MIC_DEVICE: RoomControlDevice = {
  kind: 'audioinput',
  slot: 'audioInput',
  labelKey: 'micDevice'
};

export const CAM_DEVICE: RoomControlDevice = {
  kind: 'videoinput',
  slot: 'videoInput',
  labelKey: 'camDevice'
};

export const SPEAKER_DEVICE: RoomControlDevice = {
  kind: 'audiooutput',
  slot: 'audioOutput',
  labelKey: 'speakerDevice'
};
