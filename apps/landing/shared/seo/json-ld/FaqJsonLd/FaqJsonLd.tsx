import type { FaqJsonLdProps } from './FaqJsonLd.types';

import { JsonLd } from '../JsonLd';

export const FaqJsonLd = ({ items }: FaqJsonLdProps) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer
        }
      }))
    }}
  />
);
