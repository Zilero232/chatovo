import type {
  ScreenShareCaptureOptions,
  TrackPublishDefaults,
  VideoCaptureOptions,
  VideoResolution
} from 'livekit-client';

import { createCaptureController, DISPLAY_AUDIO_CAPTURE } from '@/shared/lib';

import type { ScreenQuality, VideoQuality } from '../model/types';

const ASPECT_16_9 = 16 / 9;

const CAMERA_PRESETS: Record<VideoQuality, VideoResolution> = {
  '720p': { width: 1280, height: 720, frameRate: 30, aspectRatio: ASPECT_16_9 },
  '1080p': { width: 1920, height: 1080, frameRate: 30, aspectRatio: ASPECT_16_9 },
  '1440p': { width: 2560, height: 1440, frameRate: 30, aspectRatio: ASPECT_16_9 },
  '4k': { width: 3840, height: 2160, frameRate: 30, aspectRatio: ASPECT_16_9 }
};

const CAMERA_BITRATES: Record<VideoQuality, number> = {
  '720p': 1_700_000,
  '1080p': 3_000_000,
  '1440p': 5_000_000,
  '4k': 8_000_000
};

const SCREEN_PRESETS: Record<ScreenQuality, VideoResolution> = {
  '1080p15': { width: 1920, height: 1080, frameRate: 15, aspectRatio: ASPECT_16_9 },
  '1080p30': { width: 1920, height: 1080, frameRate: 30, aspectRatio: ASPECT_16_9 },
  '1440p30': CAMERA_PRESETS['1440p'],
  '4k30': CAMERA_PRESETS['4k']
};

const SCREEN_BITRATES: Record<ScreenQuality, number> = {
  '1080p15': 2_500_000,
  '1080p30': 5_000_000,
  '1440p30': CAMERA_BITRATES['1440p'],
  '4k30': CAMERA_BITRATES['4k']
};

export const getCameraCaptureOptions = (quality: VideoQuality): VideoCaptureOptions => ({
  resolution: CAMERA_PRESETS[quality]
});

export const getScreenCaptureOptions = (quality: ScreenQuality): ScreenShareCaptureOptions => ({
  resolution: SCREEN_PRESETS[quality],
  contentHint: 'detail',
  audio: DISPLAY_AUDIO_CAPTURE,
  controller: createCaptureController(),
  selfBrowserSurface: 'exclude',
  systemAudio: 'include'
});

export const getPublishDefaults = (
  cameraQuality: VideoQuality,
  screenQuality: ScreenQuality
): TrackPublishDefaults => ({
  videoEncoding: {
    maxBitrate: CAMERA_BITRATES[cameraQuality],
    maxFramerate: CAMERA_PRESETS[cameraQuality].frameRate
  },
  screenShareEncoding: {
    maxBitrate: SCREEN_BITRATES[screenQuality],
    maxFramerate: SCREEN_PRESETS[screenQuality].frameRate
  }
});
