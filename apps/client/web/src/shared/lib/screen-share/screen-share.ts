import type { AudioCaptureOptions, TrackPublishOptions } from 'livekit-client';

import { AudioPresets } from 'livekit-client';

import type { CaptureControllerHost, FocusCaptureController } from './screen-share.types';

import { isTauriMobile } from '../tauri-platform';

export const isScreenShareSupported = (): boolean => {
  if (isTauriMobile()) {
    return false;
  }

  if (window.matchMedia('(pointer: coarse)').matches) {
    return false;
  }

  return typeof navigator.mediaDevices?.getDisplayMedia === 'function';
};

/** A fresh controller that keeps Chatovo focused after the user picks a tab or window to share; `undefined` where unsupported. */
export const createCaptureController = (): FocusCaptureController | undefined => {
  const { CaptureController } = globalThis as CaptureControllerHost;

  if (!CaptureController) {
    return undefined;
  }

  const controller = new CaptureController();

  controller.setFocusBehavior('no-focus-change');

  return controller;
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
