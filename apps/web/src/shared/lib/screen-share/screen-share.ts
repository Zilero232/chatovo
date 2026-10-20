import type { AudioCaptureOptions, TrackPublishOptions } from 'livekit-client';

import { AudioPresets } from 'livekit-client';

import { isTauriMobile } from '../tauri-platform';

export const isScreenShareSupported = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (isTauriMobile()) {
    return false;
  }

  if (window.matchMedia('(pointer: coarse)').matches) {
    return false;
  }

  return typeof navigator.mediaDevices?.getDisplayMedia === 'function';
};

/** Shared-audio capture: no voice processing, stereo, and the page's own playback excluded (no echo). */
export const DISPLAY_AUDIO_CAPTURE: AudioCaptureOptions = {
  autoGainControl: false,
  channelCount: 2,
  echoCancellation: false,
  noiseSuppression: false,
  ...({ restrictOwnAudio: true } as AudioCaptureOptions)
};

export const SHARED_AUDIO_PUBLISH: TrackPublishOptions = {
  audioPreset: AudioPresets.musicHighQualityStereo,
  dtx: false,
  red: false,
  forceStereo: true
};
