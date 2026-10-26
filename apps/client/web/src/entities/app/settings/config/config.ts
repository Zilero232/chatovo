import type { AppSettings, DeviceSettings } from '../model/types';

export const KIND_TO_SLOT: Record<MediaDeviceKind, keyof DeviceSettings> = {
  audioinput: 'audioInput',
  audiooutput: 'audioOutput',
  videoinput: 'videoInput'
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  audio: {
    micThreshold: 0.15,
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    voiceIsolation: false,
    autoSensitivity: true,
    activationMode: 'voiceActivity'
  },
  video: {
    mirrorVideo: false,
    cameraQuality: '1080p',
    screenQuality: '1080p30'
  },
  devices: {
    audioInput: '',
    audioOutput: '',
    videoInput: ''
  },
  sounds: {
    volume: 0.5,
    enabled: {
      join: true,
      leave: true,
      mute: true,
      reconnect: true,
      message: true,
      reaction: true,
      call: true,
      ambience: true
    }
  },
  chat: {
    filterProfanity: true
  },
  music: {
    volume: 0.5
  },
  system: {
    tray: {
      closeToTray: true
    },
    invisibleMode: false,
    shareActivity: true
  },
  shortcuts: {
    muteToggle: 'Ctrl+Shift+M',
    deafenToggle: 'Ctrl+Shift+D',
    pttHold: 'Alt+L',
    chatToggle: 'Ctrl+Shift+C'
  }
};
