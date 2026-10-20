import { describe, expect, it } from 'vitest';

import { describeMediaFile } from '../describe-media-file';

describe('describeMediaFile', () => {
  it('titles an audio file by its decoded name', () => {
    expect(
      describeMediaFile({
        url: 'https://cdn.example.com/music/Night_Drive%20(demo).mp3?token=1',
        contentType: 'audio/mpeg'
      })
    ).toEqual({ title: 'Night Drive (demo)', artist: 'cdn.example.com', thumbnailUrl: null });
  });

  it.each(['video/mp4', 'application/ogg', 'audio/ogg; codecs=opus'])('accepts %s', (type) => {
    expect(describeMediaFile({ url: 'https://a.example/x.ogg', contentType: type })).not.toBeNull();
  });

  it.each(['text/html', 'application/octet-stream', ''])('refuses %s', (type) => {
    expect(describeMediaFile({ url: 'https://a.example/x.mp3', contentType: type })).toBeNull();
  });

  it('keeps a name that is not valid percent-encoding', () => {
    expect(
      describeMediaFile({ url: 'https://a.example/100%25%zz.mp3', contentType: 'audio/mpeg' })
        ?.title
    ).toBe('100%25%zz');
  });
});
