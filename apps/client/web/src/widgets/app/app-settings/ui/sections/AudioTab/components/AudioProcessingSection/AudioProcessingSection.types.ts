import type { AudioSettings } from '@/entities/app/settings';

export type AudioProcessingSectionProps = {
  audio: AudioSettings;
  onFlagChange: (key: keyof AudioSettings, value: boolean) => void;
};
