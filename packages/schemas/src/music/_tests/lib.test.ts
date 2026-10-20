import { describe, expect, it } from 'vitest';

import { getMusicPositionMs, parseMusicLink } from '../lib';

const VIDEO_ID = 'dQw4w9WgXcQ';
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

describe('parseMusicLink', () => {
  it.each([
    `https://www.youtube.com/watch?v=${VIDEO_ID}&t=42s`,
    `https://youtube.com/watch?v=${VIDEO_ID}&list=PL123`,
    `https://m.youtube.com/watch?v=${VIDEO_ID}`,
    `https://music.youtube.com/watch?v=${VIDEO_ID}`,
    `https://youtu.be/${VIDEO_ID}?si=abc`,
    `https://www.youtube.com/shorts/${VIDEO_ID}`,
    `https://www.youtube.com/live/${VIDEO_ID}`,
    `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`,
    `  http://www.youtube.com/watch?v=${VIDEO_ID}  `
  ])('reads the video id from %s', (url) => {
    expect(parseMusicLink(url)).toEqual({ source: 'youtube', ref: VIDEO_ID, url: VIDEO_URL });
  });

  it.each([
    'https://www.youtube.com/watch?v=short',
    'https://www.youtube.com/playlist?list=PL123',
    'https://www.youtube.com/@channel',
    'https://youtu.be/',
    `https://evil.com/watch?v=${VIDEO_ID}`,
    `https://youtube.com.evil.com/watch?v=${VIDEO_ID}`,
    `javascript:alert(1)//youtu.be/${VIDEO_ID}`
  ])('rejects %s', (url) => {
    expect(parseMusicLink(url)).toBeNull();
  });

  it('canonicalises a SoundCloud track link', () => {
    expect(parseMusicLink('https://m.soundcloud.com/Artist-Name/Some-Track?in=x')).toEqual({
      source: 'soundcloud',
      ref: 'https://soundcloud.com/artist-name/some-track',
      url: 'https://soundcloud.com/artist-name/some-track'
    });
  });

  it.each([
    'https://soundcloud.com/artist',
    'https://soundcloud.com/artist/sets/album',
    'https://soundcloud.com/artist/likes',
    'https://soundcloud.com/discover/sets',
    'https://soundcloud.com/search/sounds',
    'https://on.soundcloud.com/abc123'
  ])('rejects the SoundCloud page %s', (url) => {
    expect(parseMusicLink(url)).toBeNull();
  });

  it.each([
    ['https://vimeo.com/76979871', 'https://vimeo.com/76979871'],
    ['https://vimeo.com/channels/staffpicks/76979871', 'https://vimeo.com/76979871'],
    ['https://vimeo.com/76979871/a1b2c3d4e5', 'https://vimeo.com/76979871/a1b2c3d4e5'],
    [
      'https://player.vimeo.com/video/76979871?h=a1b2c3d4e5',
      'https://vimeo.com/76979871/a1b2c3d4e5'
    ]
  ])('canonicalises the Vimeo link %s', (url, canonical) => {
    expect(parseMusicLink(url)).toEqual({ source: 'vimeo', ref: canonical, url: canonical });
  });

  it('rejects a Vimeo page without a video', () => {
    expect(parseMusicLink('https://vimeo.com/channels/staffpicks')).toBeNull();
  });

  it('accepts a direct https link to a media file', () => {
    const url = 'https://cdn.example.com/music/Track%201.mp3?token=abc';

    expect(parseMusicLink(url)).toEqual({ source: 'file', ref: url, url });
  });

  it.each(['http://cdn.example.com/track.mp3', 'https://example.com/page.html'])(
    'rejects %s as a media file',
    (url) => {
      expect(parseMusicLink(url)).toBeNull();
    }
  );

  it('returns null for text that is not a URL', () => {
    expect(parseMusicLink('not a link')).toBeNull();
  });
});

describe('getMusicPositionMs', () => {
  it('counts the time since the track started while playing', () => {
    expect(
      getMusicPositionMs({ playback: { status: 'playing', startedAt: 1_000 }, now: 4_500 })
    ).toBe(3_500);
  });

  it('never goes below zero when the start lies in the future', () => {
    expect(
      getMusicPositionMs({ playback: { status: 'playing', startedAt: 5_000 }, now: 4_000 })
    ).toBe(0);
  });

  it('holds the stored position while paused', () => {
    expect(
      getMusicPositionMs({ playback: { status: 'paused', positionMs: 12_000 }, now: 99_999 })
    ).toBe(12_000);
  });
});
