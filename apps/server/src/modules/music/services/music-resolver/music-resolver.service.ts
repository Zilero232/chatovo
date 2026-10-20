import type { MusicEnqueueItem, MusicLink, MusicTrack } from '@chatovo/schemas';
import type { Cache } from 'cache-manager';

import { musicTrackSchema, parseMusicLink } from '@chatovo/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { match } from 'ts-pattern';

import type { EmbedMusicLink, MusicTrackDraft, MusicTrackMeta } from '../../music.types';

import { AppBadRequestException } from '../../../../common/exceptions';
import { buildHashKey, safeFetch, saveRemoteImage } from '../../../../lib';
import { MUSIC } from '../../config';
import { describeMediaFile, parseOembed } from '../../lib';
import { RadioService } from '../radio';

@Injectable()
export class MusicResolverService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly radio: RadioService
  ) {}

  private async loadOembed(link: EmbedMusicLink): Promise<MusicTrackMeta | null> {
    const { accept, maxBytes } = MUSIC.oembed;
    const endpoint = new URL(MUSIC.oembed[link.source]);

    endpoint.search = new URLSearchParams({ format: 'json', url: link.url }).toString();

    const response = await safeFetch({ url: endpoint.toString(), accept, maxBytes });

    return response ? parseOembed(response.body.toString('utf8')) : null;
  }

  private fetchOembed(link: EmbedMusicLink): Promise<MusicTrackMeta | null> {
    const { cacheTtlMs, failureCacheTtlMs } = MUSIC.oembed;

    return this.cache.wrap(
      buildHashKey(['music-oembed', link.url]),
      () => this.loadOembed(link).catch(() => null),
      (meta) => (meta ? cacheTtlMs : failureCacheTtlMs)
    );
  }

  private async probeMediaFile(link: MusicLink): Promise<MusicTrackDraft> {
    const { accept, probeBytes } = MUSIC.mediaFile;
    const response = await safeFetch({
      url: link.url,
      accept,
      maxBytes: probeBytes,
      truncate: true
    });
    const meta =
      response && describeMediaFile({ url: link.url, contentType: response.contentType });

    if (!meta) {
      throw new AppBadRequestException('MUSIC_TRACK_UNAVAILABLE', 'The link is not a media file');
    }

    return { ...link, title: meta.title, artist: meta.artist, artworkSource: null };
  }

  private async resolveEmbed(link: EmbedMusicLink): Promise<MusicTrackDraft> {
    const meta = await this.fetchOembed(link);

    return match(link.source)
      .with('youtube', () => ({
        ...link,
        title: meta?.title ?? `YouTube · ${link.ref}`,
        artist: meta?.artist ?? null,
        artworkSource:
          meta?.thumbnailUrl ?? `${MUSIC.youtubeThumbnailBase}/${link.ref}/hqdefault.jpg`
      }))
      .with('soundcloud', 'vimeo', () => {
        if (!meta) {
          throw new AppBadRequestException('MUSIC_TRACK_UNAVAILABLE', 'Track is not available');
        }

        return {
          ...link,
          title: meta.title,
          artist: meta.artist,
          artworkSource: meta.thumbnailUrl
        };
      })
      .exhaustive();
  }

  private resolveLink(url: string): Promise<MusicTrackDraft> {
    const link = parseMusicLink(url);

    if (!link) {
      throw new AppBadRequestException('MUSIC_LINK_UNSUPPORTED', 'Unsupported music link');
    }

    return link.source === 'file'
      ? this.probeMediaFile(link)
      : this.resolveEmbed({ ...link, source: link.source });
  }

  private async resolveRadio(stationId: string): Promise<MusicTrackDraft> {
    const entry = await this.radio.getStation(stationId);

    if (!entry) {
      throw new AppBadRequestException('MUSIC_TRACK_UNAVAILABLE', 'Station is not available');
    }

    const { station, streamUrl, homepage, faviconUrl } = entry;

    return {
      source: 'radio',
      ref: streamUrl,
      url: homepage ?? streamUrl,
      title: station.name,
      artist: station.country,
      artworkSource: faviconUrl
    };
  }

  private async saveArtwork(url: string | null): Promise<string | null> {
    if (!url) {
      return null;
    }

    const { folder, maxBytes, maxWidth, quality } = MUSIC.artwork;
    const saved = await saveRemoteImage({ url, folder, maxBytes, maxWidth, quality }).catch(
      () => null
    );

    return saved?.url ?? null;
  }

  async resolve(item: MusicEnqueueItem): Promise<Omit<MusicTrack, 'addedBy'>> {
    const { artworkSource, ...draft } = await match(item)
      .with({ kind: 'link' }, ({ url }) => this.resolveLink(url))
      .with({ kind: 'radio' }, ({ stationId }) => this.resolveRadio(stationId))
      .exhaustive();

    const track = musicTrackSchema.omit({ addedBy: true }).safeParse({
      id: randomUUID(),
      ...draft,
      artwork: await this.saveArtwork(artworkSource)
    });

    if (!track.success) {
      throw new AppBadRequestException('MUSIC_TRACK_UNAVAILABLE', 'Track metadata is invalid');
    }

    return track.data;
  }
}
