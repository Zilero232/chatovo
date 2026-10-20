import { MUSIC_LINK_MAX_LENGTH, MUSIC_TITLE_MAX_LENGTH } from '@chatovo/schemas';
import { isNonNullish, uniqueBy } from 'remeda';
import { z } from 'zod';

import type { RadioStationEntry } from '../../music.types';
import type { ParseRadioStationsInput, ToRadioEntryInput } from './parse-radio-stations.types';

export const radioBrowserStationSchema = z.object({
  stationuuid: z.uuid(),
  name: z.string(),
  url_resolved: z.string(),
  homepage: z.string().optional(),
  favicon: z.string().optional(),
  country: z.string().optional(),
  tags: z.string().optional(),
  codec: z.string().optional(),
  bitrate: z.number().optional(),
  hls: z.number().optional()
});

const readJson = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
};

const httpsUrlSchema = z.url({ protocol: /^https$/ }).max(MUSIC_LINK_MAX_LENGTH);

const toHttpsUrl = (value: string | undefined): string | null => {
  const parsed = httpsUrlSchema.safeParse(value?.trim());

  return parsed.success ? parsed.data : null;
};

const toEntry = ({ raw, maxTags, playableCodecs }: ToRadioEntryInput): RadioStationEntry | null => {
  const name = raw.name.trim().slice(0, MUSIC_TITLE_MAX_LENGTH);
  const streamUrl = toHttpsUrl(raw.url_resolved);
  const codec = raw.codec?.trim().toUpperCase() ?? '';

  if (!name || !streamUrl || raw.hls === 1 || !playableCodecs.has(codec)) {
    return null;
  }

  const tags = (raw.tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, maxTags);

  return {
    station: {
      id: raw.stationuuid,
      name,
      country: raw.country?.trim() || null,
      tags,
      codec,
      bitrate: raw.bitrate && raw.bitrate > 0 ? Math.round(raw.bitrate) : null
    },
    streamUrl,
    homepage: toHttpsUrl(raw.homepage),
    faviconUrl: toHttpsUrl(raw.favicon)
  };
};

export const parseRadioStations = ({
  body,
  maxTags,
  playableCodecs
}: ParseRadioStationsInput): RadioStationEntry[] => {
  const items = z.array(z.unknown()).safeParse(readJson(body));

  if (!items.success) {
    return [];
  }

  const entries = items.data
    .map((item) => radioBrowserStationSchema.safeParse(item))
    .map((parsed) =>
      parsed.success ? toEntry({ raw: parsed.data, maxTags, playableCodecs }) : null
    )
    .filter(isNonNullish);

  return uniqueBy(entries, (entry) => entry.streamUrl);
};
