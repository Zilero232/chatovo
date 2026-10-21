export type PttState = 'active' | 'disabled' | 'idle';

export type ControlTone = 'active' | 'danger' | 'off' | 'on';

export type MicVisual = {
  isMuted: boolean;
  labelKey: 'mute' | 'mutedByOwner' | 'pttHint' | 'unmute';
  tone: ControlTone;
};

export type ResolveMicVisualInput = {
  isLocked?: boolean;
  isMicrophoneEnabled: boolean;
  pttState: PttState;
};
