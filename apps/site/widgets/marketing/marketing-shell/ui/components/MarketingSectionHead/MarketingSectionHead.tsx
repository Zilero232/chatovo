import { RevealOnScroll, Text } from '@chatovo/ui-kit';

import type { MarketingSectionHeadProps } from './MarketingSectionHead.types';

import s from '../../MarketingShell.module.scss';

export const MarketingSectionHead = ({
  heading,
  description,
  eyebrow
}: MarketingSectionHeadProps) => (
  <RevealOnScroll className={s.sectionHead}>
    {eyebrow && (
      <Text as='span' className={s.eyebrow} size='xs' weight='medium'>
        <span aria-hidden className={s.eyebrowDot} />
        {eyebrow}
      </Text>
    )}

    <Text as='h2' className={s.sectionHeading} weight='semibold'>
      {heading}
    </Text>

    {description && (
      <Text size='lg' tone='muted'>
        {description}
      </Text>
    )}
  </RevealOnScroll>
);
