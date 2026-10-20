export type PttState = 'active' | 'disabled' | 'idle';

export type ControlTone = 'active' | 'danger' | 'off' | 'on';

export type MicVisual = {
  isMuted: boolean;
  labelKey: 'mute' | 'pttHint' | 'unmute';
  tone: ControlTone;
};

export type ResolveMicVisualInput = {
  isMicrophoneEnabled: boolean;
  pttState: PttState;
};
