import { describe, expect, it } from 'vitest';

import {
  getPublishDefaults,
  getScreenCaptureOptions,
  getScreenPublishOptions
} from '../video-quality';

describe('getScreenCaptureOptions', () => {
  it('captures text with a detail hint at the chosen resolution', () => {
    const options = getScreenCaptureOptions({ quality: '1080p30', content: 'text' });

    expect(options.contentHint).toBe('detail');
    expect(options.resolution).toMatchObject({ width: 1920, height: 1080, frameRate: 30 });
  });

  it('captures motion with a motion hint at 60 fps', () => {
    const options = getScreenCaptureOptions({ quality: '1080p60', content: 'motion' });

    expect(options.contentHint).toBe('motion');
    expect(options.resolution?.frameRate).toBe(60);
  });
});

describe('getScreenPublishOptions', () => {
  it('keeps resolution for text and frame rate for motion', () => {
    expect(getScreenPublishOptions('text').degradationPreference).toBe('maintain-resolution');
    expect(getScreenPublishOptions('motion').degradationPreference).toBe('maintain-framerate');
  });

  it('keeps the stereo shared-audio publish settings', () => {
    expect(getScreenPublishOptions('motion')).toMatchObject({ dtx: false, forceStereo: true });
  });
});

describe('getPublishDefaults', () => {
  it('caps the screen encoder at the preset frame rate', () => {
    const defaults = getPublishDefaults({ cameraQuality: '720p', screenQuality: '1440p60' });

    expect(defaults.screenShareEncoding).toEqual({ maxBitrate: 10_000_000, maxFramerate: 60 });
    expect(defaults.videoEncoding).toEqual({ maxBitrate: 1_700_000, maxFramerate: 30 });
  });
});
