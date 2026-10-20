import { describe, expect, it } from 'vitest';

import { parseRadioStations } from '../parse-radio-stations';

const OPTIONS = { maxTags: 2, playableCodecs: new Set(['MP3', 'AAC']) };

const STATION = {
  stationuuid: '96062a7b-0601-11e8-ae97-52543be04c81',
  name: ' Lofi Radio ',
  url_resolved: 'https://stream.example.com/lofi.mp3',
  homepage: 'http://example.com',
  favicon: 'https://example.com/icon.png',
  country: 'Germany',
  tags: 'lofi, chill,study,beats',
  codec: 'mp3',
  bitrate: 128,
  hls: 0
};

const parse = (items: unknown[]) => parseRadioStations({ body: JSON.stringify(items), ...OPTIONS });

describe('parseRadioStations', () => {
  it('maps a playable station', () => {
    expect(parse([STATION])).toEqual([
      {
        station: {
          id: STATION.stationuuid,
          name: 'Lofi Radio',
          country: 'Germany',
          tags: ['lofi', 'chill'],
          codec: 'MP3',
          bitrate: 128
        },
        streamUrl: 'https://stream.example.com/lofi.mp3',
        homepage: null,
        faviconUrl: 'https://example.com/icon.png'
      }
    ]);
  });

  it.each([
    ['a plain http stream', { url_resolved: 'http://stream.example.com/a.mp3' }],
    ['an HLS stream', { hls: 1 }],
    [
      'a stream URL longer than a track allows',
      { url_resolved: `https://a.example/${'x'.repeat(2100)}` }
    ],
    ['an unsupported codec', { codec: 'WMA' }],
    ['an unknown codec', { codec: '' }],
    ['a blank name', { name: '   ' }],
    ['a malformed id', { stationuuid: 'nope' }]
  ])('skips %s', (_label, patch) => {
    expect(parse([{ ...STATION, ...patch }])).toEqual([]);
  });

  it('keeps one entry per stream', () => {
    expect(
      parse([STATION, { ...STATION, stationuuid: '96062a7b-0601-11e8-ae97-52543be04c82' }])
    ).toHaveLength(1);
  });

  it('treats a zero bitrate and an empty country as unknown', () => {
    expect(parse([{ ...STATION, bitrate: 0, country: '' }])[0]?.station).toMatchObject({
      bitrate: null,
      country: null
    });
  });

  it('returns nothing for a body that is not an array', () => {
    expect(parseRadioStations({ body: '{"error":true}', ...OPTIONS })).toEqual([]);
  });
});
