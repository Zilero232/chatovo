export { DEFAULT_APP_SETTINGS, KIND_TO_SLOT } from './config/config';
export { audioConstraints } from './lib/audio-constraints';
export {
  getCameraCaptureOptions,
  getPublishDefaults,
  getScreenCaptureOptions
} from './lib/video-quality';
export {
  VOICE_GATE_MANUAL_RANGE,
  VOICE_GATE_TICK_MS,
  VoiceGateDetector
} from './lib/voice-gate/voice-gate-detector';
export type { VoiceGateParams } from './lib/voice-gate/voice-gate-detector';
export { VoiceGateProcessor } from './lib/voice-gate/voice-gate-processor';

export { useAppSettings } from './model/hooks';
export type {
  AppSettings,
  AudioSettings,
  DeviceSettings,
  MicActivationMode,
  MusicSettings,
  ScreenQuality,
  ShortcutActionId,
  ShortcutBinding,
  ShortcutSettings,
  SoundCategory,
  VideoQuality
} from './model/types';
