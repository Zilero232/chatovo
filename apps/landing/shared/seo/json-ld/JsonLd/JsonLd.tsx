import type { JsonLdProps } from './JsonLd.types';

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml -- JSON-LD requires raw insertion
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    type='application/ld+json'
  />
);
