import { RevealOnScroll, Text } from '@chatovo/ui-kit';

import type { MarketingSectionHeadProps } from './MarketingSectionHead.types';

import s from '../../MarketingShell.module.scss';

export const MarketingSectionHead = ({ heading, description }: MarketingSectionHeadProps) => (
  <RevealOnScroll className={s.sectionHead}>
    <h2 className={s.sectionHeading}>{heading}</h2>

    {description && (
      <Text size='lg' tone='muted'>
        {description}
      </Text>
    )}
  </RevealOnScroll>
);
