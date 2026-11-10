import {
  LINK_PREVIEW_DESCRIPTION_MAX_LENGTH,
  LINK_PREVIEW_TITLE_MAX_LENGTH,
  safeJsonParse
} from '@chatovo/schemas';
import { truncate } from 'remeda';
import { z } from 'zod';

import type { LinkMetadata } from '../extract-link-metadata';
import type { ParseLinkOembedInput } from './parse-link-oembed.types';

const oembedSchema = z.object({
  title: z.string().trim().min(1),
  author_name: z.string().trim().min(1).optional().catch(undefined),
  thumbnail_url: z
    .url({ protocol: /^https?$/ })
    .optional()
    .catch(undefined)
});

export const parseLinkOembed = ({ body, siteName }: ParseLinkOembedInput): LinkMetadata | null => {
  const parsed = oembedSchema.safeParse(safeJsonParse(body));

  if (!parsed.success) {
    return null;
  }

  const { title, author_name: author, thumbnail_url: imageUrl } = parsed.data;

  return {
    title: truncate(title, LINK_PREVIEW_TITLE_MAX_LENGTH),
    description: author ? truncate(author, LINK_PREVIEW_DESCRIPTION_MAX_LENGTH) : null,
    siteName,
    imageUrl: imageUrl ?? null
  };
};
