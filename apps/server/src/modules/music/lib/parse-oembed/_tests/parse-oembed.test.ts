import { describe, expect, it } from 'vitest';

import { parseOembed } from '../parse-oembed';

describe('parseOembed', () => {
  it('reads the title, author and thumbnail', () => {
    expect(
      parseOembed(
        JSON.stringify({
          title: '  Never Gonna Give You Up ',
          author_name: 'Rick Astley',
          thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
        })
      )
    ).toEqual({
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
    });
  });

  it('drops a thumbnail that is not https', () => {
    expect(
      parseOembed(JSON.stringify({ title: 'Song', thumbnail_url: 'http://example.com/a.jpg' }))
    ).toEqual({ title: 'Song', artist: null, thumbnailUrl: null });
  });

  it('caps a very long title', () => {
    expect(parseOembed(JSON.stringify({ title: 'a'.repeat(500) }))?.title).toHaveLength(200);
  });

  it.each(['', 'not json', '{"title":""}', '[]'])('returns null for %j', (body) => {
    expect(parseOembed(body)).toBeNull();
  });
});
