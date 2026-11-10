import { describe, expect, it } from 'vitest';

import { findOembedProvider } from '../find-oembed-provider';

describe('findOembedProvider', () => {
  it('matches every YouTube host', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://m.youtube.com/shorts/abc',
      'https://music.youtube.com/watch?v=abc'
    ]) {
      expect(findOembedProvider(url)?.siteName).toBe('YouTube');
    }
  });

  it('matches Vimeo and SoundCloud', () => {
    expect(findOembedProvider('https://vimeo.com/76979871')?.siteName).toBe('Vimeo');
    expect(findOembedProvider('https://soundcloud.com/artist/track')?.siteName).toBe('SoundCloud');
  });

  it('leaves other sites and look-alike hosts to the page scraper', () => {
    expect(findOembedProvider('https://example.com/watch?v=1')).toBeNull();
    expect(findOembedProvider('https://youtube.com.evil.example/watch')).toBeNull();
    expect(findOembedProvider('not a url')).toBeNull();
  });
});
