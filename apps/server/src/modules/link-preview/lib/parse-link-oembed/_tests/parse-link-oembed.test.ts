import {
  LINK_PREVIEW_DESCRIPTION_MAX_LENGTH,
  LINK_PREVIEW_TITLE_MAX_LENGTH
} from '@chatovo/schemas';
import { describe, expect, it } from 'vitest';

import { parseLinkOembed } from '../parse-link-oembed';

const YOUTUBE_OEMBED = JSON.stringify({
  title: 'Rick Astley - Never Gonna Give You Up',
  author_name: 'Rick Astley',
  thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  type: 'video'
});

describe('parseLinkOembed', () => {
  it('turns an oEmbed answer into link metadata', () => {
    expect(parseLinkOembed({ body: YOUTUBE_OEMBED, siteName: 'YouTube' })).toEqual({
      title: 'Rick Astley - Never Gonna Give You Up',
      description: 'Rick Astley',
      siteName: 'YouTube',
      imageUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
    });
  });

  it('keeps the preview when the author or the thumbnail is missing or broken', () => {
    const body = JSON.stringify({ title: 'Track', author_name: '', thumbnail_url: 'javascript:x' });

    expect(parseLinkOembed({ body, siteName: 'SoundCloud' })).toEqual({
      title: 'Track',
      description: null,
      siteName: 'SoundCloud',
      imageUrl: null
    });
  });

  it('refuses an answer without a title or one that is not JSON', () => {
    expect(
      parseLinkOembed({ body: JSON.stringify({ author_name: 'x' }), siteName: 'YouTube' })
    ).toBeNull();
    expect(parseLinkOembed({ body: '<html>sorry</html>', siteName: 'YouTube' })).toBeNull();
  });

  it('cuts an over-long title and author to the preview limits', () => {
    const body = JSON.stringify({ title: 'a'.repeat(1000), author_name: 'b'.repeat(1000) });
    const metadata = parseLinkOembed({ body, siteName: 'YouTube' });

    expect(metadata?.title.length).toBeLessThanOrEqual(LINK_PREVIEW_TITLE_MAX_LENGTH);
    expect(metadata?.description?.length).toBeLessThanOrEqual(LINK_PREVIEW_DESCRIPTION_MAX_LENGTH);
  });

  it('refuses a JSON array', () => {
    expect(parseLinkOembed({ body: '[{"title":"x"}]', siteName: 'YouTube' })).toBeNull();
  });
});
