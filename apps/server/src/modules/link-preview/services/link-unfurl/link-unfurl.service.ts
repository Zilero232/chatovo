import type { LinkPreview, LinkPreviewResponse } from '@chatovo/schemas';
import type { Cache } from 'cache-manager';

import { linkPreviewSchema } from '@chatovo/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import type { LinkMetadata } from '../../lib';
import type { ReadOembedInput } from '../link-preview.service.types';

import { buildHashKey, safeFetch, saveRemoteImage } from '../../../../lib';
import { LINK_PREVIEW } from '../../config';
import { decodeHtml, extractLinkMetadata, findOembedProvider, parseLinkOembed } from '../../lib';

@Injectable()
export class LinkUnfurlService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  private saveImage(imageUrl: string) {
    const { folder, maxWidth, quality } = LINK_PREVIEW.unfurl.image;

    return saveRemoteImage({
      url: imageUrl,
      folder,
      maxBytes: LINK_PREVIEW.unfurl.imageMaxBytes,
      maxWidth,
      quality
    }).catch(() => null);
  }

  private async readOembed({ url, provider }: ReadOembedInput): Promise<LinkMetadata | null> {
    const { accept, maxBytes } = LINK_PREVIEW.unfurl.oembed;
    const endpoint = new URL(provider.endpoint);

    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('format', 'json');

    const response = await safeFetch({ url: endpoint.toString(), accept, maxBytes });

    return response
      ? parseLinkOembed({ body: response.body.toString('utf8'), siteName: provider.siteName })
      : null;
  }

  private async readPage(url: string): Promise<LinkMetadata | null> {
    const page = await safeFetch({
      url,
      accept: LINK_PREVIEW.unfurl.accept,
      maxBytes: LINK_PREVIEW.unfurl.htmlMaxBytes,
      truncate: true
    });

    const html = page && decodeHtml({ body: page.body, contentType: page.contentType });

    if (!page || !html) {
      return null;
    }

    return extractLinkMetadata({ html, url: page.url });
  }

  private async buildPreview(url: string): Promise<LinkPreview | null> {
    const provider = findOembedProvider(url);
    const metadata = provider ? await this.readOembed({ url, provider }) : await this.readPage(url);

    if (!metadata) {
      return null;
    }

    const { imageUrl, ...text } = metadata;
    const image = imageUrl ? await this.saveImage(imageUrl) : null;
    const preview = linkPreviewSchema.safeParse({ url, ...text, image });

    return preview.success ? preview.data : null;
  }

  private async buildPreviewSafely(url: string): Promise<LinkPreview | null> {
    try {
      return await this.buildPreview(url);
    } catch {
      return null;
    }
  }

  async unfurl(url: string): Promise<LinkPreviewResponse> {
    const { cacheTtlMs, failureCacheTtlMs } = LINK_PREVIEW.unfurl;

    const preview = await this.cache.wrap(
      buildHashKey(['link-preview', url]),
      () => this.buildPreviewSafely(url),
      (value) => (value ? cacheTtlMs : failureCacheTtlMs)
    );

    return { preview };
  }
}
