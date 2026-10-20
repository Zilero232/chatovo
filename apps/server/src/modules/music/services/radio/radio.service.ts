import type { RadioStationsResponse } from '@chatovo/schemas';
import type { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import type { RadioStationEntry } from '../../music.types';
import type { CachedRadioInput, RadioRequestInput } from '../music.service.types';

import { buildHashKey, safeFetch } from '../../../../lib';
import { MUSIC } from '../../config';
import { parseRadioStations } from '../../lib';

@Injectable()
export class RadioService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  private async request({ path, params = {} }: RadioRequestInput): Promise<RadioStationEntry[]> {
    const { apiBase, accept, maxBytes, maxTags, playableCodecs } = MUSIC.radio;
    const url = new URL(`${apiBase}/${path}`);

    url.search = new URLSearchParams(params).toString();

    const response = await safeFetch({ url: url.toString(), accept, maxBytes });

    return response
      ? parseRadioStations({ body: response.body.toString('utf8'), maxTags, playableCodecs })
      : [];
  }

  private cached({ key, load }: CachedRadioInput): Promise<RadioStationEntry[]> {
    const { cacheTtlMs, failureCacheTtlMs } = MUSIC.radio;

    return this.cache.wrap(
      buildHashKey(key),
      () => load().catch(() => []),
      (entries) => (entries.length > 0 ? cacheTtlMs : failureCacheTtlMs)
    );
  }

  async search(query: string): Promise<RadioStationsResponse> {
    const { fetchLimit, searchLimit } = MUSIC.radio;

    const entries = await this.cached({
      key: ['radio-search', query],
      load: () =>
        this.request({
          path: 'stations/search',
          params: {
            ...(query && { name: query }),
            limit: String(fetchLimit),
            hidebroken: 'true',
            is_https: 'true',
            order: 'clickcount',
            reverse: 'true'
          }
        })
    });

    return { stations: entries.slice(0, searchLimit).map(({ station }) => station) };
  }

  async getStation(stationId: string): Promise<RadioStationEntry | null> {
    const entries = await this.cached({
      key: ['radio-station', stationId],
      load: () => this.request({ path: `stations/byuuid/${stationId}` })
    });

    return entries[0] ?? null;
  }
}
