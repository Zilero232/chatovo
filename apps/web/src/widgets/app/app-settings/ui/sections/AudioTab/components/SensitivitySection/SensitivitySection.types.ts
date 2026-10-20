import type { AudioSettings } from '@/entities/app/settings';

export type SensitivitySectionProps = {
  audio: AudioSettings;
  deviceId: string;
  onAutoSensitivityChange: (value: boolean) => void;
};
