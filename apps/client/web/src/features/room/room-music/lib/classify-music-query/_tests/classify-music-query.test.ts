import { describe, expect, it } from 'vitest';

import { classifyMusicQuery } from '../classify-music-query';

describe('classifyMusicQuery', () => {
  it('is idle for blank input', () => {
    expect(classifyMusicQuery('   ')).toEqual({ kind: 'idle' });
  });

  it('recognises a YouTube link', () => {
    const result = classifyMusicQuery(' https://youtu.be/dQw4w9WgXcQ ');

    expect(result).toMatchObject({ kind: 'link', link: { source: 'youtube', ref: 'dQw4w9WgXcQ' } });
  });

  it('treats anything else as a radio search', () => {
    expect(classifyMusicQuery(' lofi beats ')).toEqual({ kind: 'search', query: 'lofi beats' });
  });

  it('recognises a Vimeo link', () => {
    expect(classifyMusicQuery('https://vimeo.com/76979871')).toMatchObject({
      kind: 'link',
      link: { source: 'vimeo' }
    });
  });

  it.each([
    ['https://vk.com/audio-2001_1', 'vk'],
    ['https://music.yandex.ru/album/1/track/2', 'yandex'],
    ['https://open.spotify.com/track/abc', 'spotify']
  ])('points %s to sharing a tab', (url, service) => {
    expect(classifyMusicQuery(url)).toEqual({ kind: 'tab-only', service });
  });

  it('searches with an unsupported link instead of adding it', () => {
    expect(classifyMusicQuery('https://example.com/song')).toMatchObject({ kind: 'search' });
  });
});
