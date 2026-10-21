import type { ShortcutSettings } from '@/entities/app/shortcut';

export type SoundCategory =
  'ambience' | 'call' | 'join' | 'leave' | 'message' | 'mute' | 'reaction' | 'reconnect';

export type MicActivationMode = 'pushToTalk' | 'voiceActivity';

export type AudioProcessingSettings = {
  autoGainControl: boolean;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  voiceIsolation: boolean;
};

export type AudioSettings = AudioProcessingSettings & {
  activationMode: MicActivationMode;
  autoSensitivity: boolean;
  micThreshold: number;
};

export type VideoQuality = '1080p' | '1440p' | '4k' | '720p';

export type ScreenQuality = '1080p15' | '1080p30' | '1440p30' | '4k30';

type VideoSettings = {
  cameraQuality: VideoQuality;
  mirrorVideo: boolean;
  screenQuality: ScreenQuality;
};

export type DeviceSettings = {
  audioInput: string;
  audioOutput: string;
  videoInput: string;
};

type SoundSettings = {
  enabled: Record<SoundCategory, boolean>;
  volume: number;
};

export type MusicSettings = {
  volume: number;
  ducking: boolean;
};

type ChatSettings = {
  filterProfanity: boolean;
};

type TraySettings = {
  closeToTray: boolean;
};

type SystemSettings = {
  tray: TraySettings;
  invisibleMode: boolean;
  shareActivity: boolean;
};

export type { ShortcutActionId, ShortcutBinding, ShortcutSettings } from '@/entities/app/shortcut';

export type AppSettings = {
  audio: AudioSettings;
  chat: ChatSettings;
  devices: DeviceSettings;
  music: MusicSettings;
  shortcuts: ShortcutSettings;
  sounds: SoundSettings;
  system: SystemSettings;
  video: VideoSettings;
};

export type SettingsGroup = keyof AppSettings;

export type UseAppSettings = {
  settings: AppSettings;
  setGroup: <G extends SettingsGroup>(group: G, patch: Partial<AppSettings[G]>) => void;
  toggleSound: (category: SoundCategory) => void;
};
