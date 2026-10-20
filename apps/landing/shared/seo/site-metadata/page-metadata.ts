import type { Metadata } from 'next';

import { SITE } from '@/shared/config';

import type { PageMetadataInput } from './page-metadata.types';

export const createPageMetadata = ({
  title,
  description,
  path,
  index = true,
  follow = true
}: PageMetadataInput): Metadata => {
  const ogTitle = `${title} · ${SITE.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index, follow },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      type: 'website'
    },
    twitter: {
      title: ogTitle,
      description
    }
  };
};
