import type { ScreenContent, ScreenQuality, VideoQuality } from '../../model/types';

export type GetScreenCaptureOptionsInput = {
  content: ScreenContent;
  quality: ScreenQuality;
};

export type GetPublishDefaultsInput = {
  cameraQuality: VideoQuality;
  screenQuality: ScreenQuality;
};
