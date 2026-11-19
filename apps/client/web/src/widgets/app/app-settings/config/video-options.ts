import type { ScreenContent, ScreenQuality, VideoQuality } from '@/entities/app/settings';

export const CAMERA_QUALITIES: VideoQuality[] = ['720p', '1080p', '1440p', '4k'];

export const SCREEN_QUALITIES: ScreenQuality[] = [
  '1080p15',
  '1080p30',
  '1080p60',
  '1440p30',
  '1440p60',
  '4k30'
];

export const SCREEN_CONTENTS: ScreenContent[] = ['text', 'motion'];
